/**
 * Battle Simulator runners.
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

'use strict';

import {ObjectReadWriteStream} from '../lib/streams';
import * as BattleStreams from '../sim/battle-stream';
import Dex = require('../sim/dex');
import {RandomPlayerAI} from '../sim/examples/random-player-ai';
import {PRNG, PRNGSeed} from '../sim/prng';
const toId = Dex.getId;

export interface AIOptions {
	createAI: (stream: ObjectReadWriteStream<string>, options: AIOptions) => RandomPlayerAI;
	move?: number;
	mega?: number;
	seed?: PRNG | PRNGSeed | null;
	team?: PokemonSet[];
}

export interface RunnerOptions {
	format: string;
	prng?: PRNG | PRNGSeed | null;
	p1options?: AIOptions;
	p2options?: AIOptions;
	input?: boolean;
	output?: boolean;
	error?: boolean;
}

export class Runner {
	static readonly AI_OPTIONS: AIOptions = {
		createAI: (s: ObjectReadWriteStream<string>, o: AIOptions) => new RandomPlayerAI(s, o),
		move: 0.7,
		mega: 0.6,
	};

	private readonly prng: PRNG;
	private readonly p1options: AIOptions;
	private readonly p2options: AIOptions;
	private readonly format: string;
	private readonly input: boolean;
	private readonly output: boolean;
	private readonly error: boolean;

	constructor(options: RunnerOptions) {
		this.format = options.format;

		this.prng = (options.prng && !Array.isArray(options.prng)) ?
			options.prng : new PRNG(options.prng);
		this.p1options = Object.assign({}, Runner.AI_OPTIONS, options.p1options);
		this.p2options = Object.assign({}, Runner.AI_OPTIONS, options.p2options);

		this.input = !!options.input;
		this.output = !!options.output;
		this.error = !!options.error;
	}

	async run() {
		const battleStream = new RawBattleStream(this.input);
		const game = this.runGame(this.format, battleStream);
		if (!this.error) return game;
		return game.catch(err => {
			console.log(`\n${battleStream.rawInputLog.join('\n')}\n`);
			throw err;
		});
	}

	private async runGame(format: string, battleStream: RawBattleStream) {
		const streams = BattleStreams.getPlayerStreams(battleStream);
		const spec = {formatid: format, seed: this.prng.seed};
		const p1spec = this.getPlayerSpec("Bot 1", this.p1options);
		const p2spec = this.getPlayerSpec("Bot 2", this.p2options);

		const p1 = this.p1options.createAI(
			streams.p1, Object.assign({seed: this.newSeed()}, this.p1options));
		const p2 = this.p2options.createAI(
			streams.p2, Object.assign({seed: this.newSeed()}, this.p2options));
		// TODO: Use `await Promise.race([streams.omniscient.read(), p1, p2])` to avoid
		// leaving these promises dangling once it no longer causes memory leaks (v8#9069).
		/* tslint:disable:no-floating-promises */
		p1.start();
		p2.start();
		/* tslint:enable:no-floating-promises */

		streams.omniscient.write(`>start ${JSON.stringify(spec)}\n` +
			`>player p1 ${JSON.stringify(p1spec)}\n` +
			`>player p2 ${JSON.stringify(p2spec)}`);

		let chunk;
		// tslint:disable-next-line no-conditional-assignment
		while ((chunk = await streams.omniscient.read())) {
			if (this.output) console.log(chunk);
		}
		return streams.omniscient.end();
	}

	// Same as PRNG#generatedSeed, only deterministic.
	// NOTE: advances this.prng's seed by 4.
	private newSeed(): PRNGSeed {
		return [
			Math.floor(this.prng.next() * 0x10000),
			Math.floor(this.prng.next() * 0x10000),
			Math.floor(this.prng.next() * 0x10000),
			Math.floor(this.prng.next() * 0x10000),
		];
	}

	private getPlayerSpec(name: string, options: AIOptions) {
		if (options.team) return {name, team: options.team};
		return {name, seed: this.newSeed()};
	}
}

class RawBattleStream extends BattleStreams.BattleStream {
	readonly rawInputLog: string[];

	private readonly input: boolean;

	constructor(input: boolean) {
		super();
		this.input = !!input;
		this.rawInputLog = [];
	}

	_write(message: string) {
		if (this.input) console.log(message);
		this.rawInputLog.push(message);
		super._write(message);
	}
}

// @ts-ignore
export interface MultiRandomRunnerOptions extends RunnerOptions {
	totalGames: number;
	prng?: PRNG | PRNGSeed | null;
	format?: string;
	cycle?: boolean;
	all?: boolean;
	async?: boolean;
}

export class MultiRandomRunner {
	static readonly FORMATS = [
		'gen7randombattle', 'gen7randomdoublesbattle', 'gen7battlefactory', 'gen6randombattle', 'gen6battlefactory',
		'gen5randombattle', 'gen4randombattle', 'gen3randombattle', 'gen2randombattle', 'gen1randombattle',
	];

	private readonly options: Partial<RunnerOptions>;
	private readonly totalGames: number;
	private readonly prng: PRNG;
	private readonly format: string | undefined;
	private readonly cycle: boolean;
	private readonly all: boolean;
	private readonly async: boolean;

	private formatIndex: number;
	private numGames: number;

	constructor(options: MultiRandomRunnerOptions) {
		this.options = Object.assign({}, options);

		this.totalGames = options.totalGames;

		this.prng = (options.prng && !Array.isArray(options.prng)) ?
			options.prng : new PRNG(options.prng);
		this.options.prng = this.prng;

		this.format = options.format;
		this.cycle = !!options.cycle;
		this.all = !!options.all;

		this.async = !!options.async;

		this.formatIndex = 0;
		this.numGames = 0;
	}

	async run() {
		let games = [];
		let format: string | false;
		let lastFormat: string | false = false;
		let failures = 0;
		// tslint:disable-next-line no-conditional-assignment
		while ((format = this.getNextFormat())) {
			if (this.all && lastFormat && format !== lastFormat) {
				if (this.async) await Promise.all(games);
				games = [];
			}

			const seed = this.prng.seed;
			const game = new Runner(Object.assign({format}, this.options)).run().catch(err => {
				failures++;
				console.error(
					`Run \`node dev-tools/simulate multi 1 --format=${format} --seed=${seed.join()}\` ` +
					`to debug (optionally with \`--output\` and/or \`--input\` for more info):\n`, err);
			});

			if (!this.async) await game;
			games.push(game);
			lastFormat = format;
		}

		if (this.async) await Promise.all(games);
		return failures;
	}

	private getNextFormat() {
		const FORMATS = MultiRandomRunner.FORMATS;
		if (this.formatIndex > FORMATS.length) return false;

		if (this.numGames++ < this.totalGames) {
			if (this.format) {
				return this.format;
			} else if (this.all) {
				return FORMATS[this.formatIndex];
			} else if (this.cycle) {
				const format = FORMATS[this.formatIndex];
				this.formatIndex = (this.formatIndex + 1) % FORMATS.length;
				return format;
			} else {
				return this.prng.sample(FORMATS);
			}
		} else if (this.all) {
			this.numGames = 1;
			this.formatIndex++;
			return FORMATS[this.formatIndex];
		}

		return false;
	}
}

interface Pools {
	pokemon: Pool;
	items: Pool;
	abilities: Pool;
	moves: Pool;
}

export interface ExhaustiveRunnerOptions {
	format: string;
	cycles?: number;
	prng?: PRNG | PRNGSeed | null;
	log?: boolean;
	maxGames?: number;
	maxFailures?: number;
}

export class ExhaustiveRunner {
	static readonly DEFAULT_CYCLES = 1;
	static readonly MAX_FAILURES = 10;

	// TODO: Add triple battles once supported by the AI.
	static readonly FORMATS = [
		'gen7customgame', 'gen7doublescustomgame',
		'gen6customgame', 'gen6doublescustomgame',
		'gen5customgame', 'gen5doublescustomgame',
		'gen4customgame', 'gen4doublescustomgame',
		'gen3customgame', 'gen3doublescustomgame',
		'gen2customgame',
		'gen1customgame',
	];

	private readonly format: string;
	private readonly cycles: number;
	private readonly prng: PRNG;
	private readonly log: boolean;
	private readonly maxGames?: number;
	private readonly maxFailures?: number;

	private failures: number;
	private games: number;

	constructor(options: ExhaustiveRunnerOptions) {
		this.format = options.format;
		this.cycles = options.cycles || ExhaustiveRunner.DEFAULT_CYCLES;
		this.prng = (options.prng && !Array.isArray(options.prng)) ?
			options.prng : new PRNG(options.prng);
		this.log = !!options.log;
		this.maxGames = options.maxGames;
		this.maxFailures = options.maxFailures || ExhaustiveRunner.MAX_FAILURES;

		this.failures = 0;
		this.games = 0;
	}

	async run() {
		const dex = Dex.forFormat(this.format);

		const seed = this.prng.seed;
		const pools = this.createPools(dex);
		const createAI = (s: ObjectReadWriteStream<string>, o: AIOptions) => new CoordinatedPlayerAI(s, o, pools);
		const generator = new TeamGenerator(dex, this.prng, pools, ExhaustiveRunner.getSignatures(dex, pools));

		do {
			this.games++;
			try {
				// We run these sequentially instead of async so that the team generator
				// and the AI can coordinate usage properly.
				await new Runner({
					prng: this.prng,
					p1options: {team: generator.generate(), createAI},
					p2options: {team: generator.generate(), createAI},
					format: this.format,
					error: true,
				}).run();

				if (this.log) this.logProgress(pools);
			} catch (err) {
				this.failures++;
				console.error(
					`\n\nRun \`node dev-tools/simulate exhaustive --cycles=${this.cycles} ` +
					`--format=${this.format} --seed${seed.join()}\`:\n`, err);
			}
		} while ((!this.maxGames || this.games < this.maxGames) &&
					(!this.maxFailures || this.failures < this.maxFailures) &&
					generator.exhausted < this.cycles);

		return this.failures;
	}

	private createPools(dex: typeof Dex): Pools {
		return {
			pokemon: new Pool(ExhaustiveRunner.onlyValid(dex.gen, dex.data.Pokedex, p => dex.getTemplate(p),
				(_, p) => (p.species !== 'Pichu-Spiky-eared' && p.species.substr(0, 8) !== 'Pikachu-')), this.prng),
			items: new Pool(ExhaustiveRunner.onlyValid(dex.gen, dex.data.Items, i => dex.getItem(i)), this.prng),
			abilities: new Pool(ExhaustiveRunner.onlyValid(dex.gen, dex.data.Abilities, a => dex.getAbility(a)), this.prng),
			moves: new Pool(ExhaustiveRunner.onlyValid(dex.gen, dex.data.Movedex, m => dex.getMove(m),
				m => (m !== 'struggle' && (m === 'hiddenpower' || m.substr(0, 11) !== 'hiddenpower'))), this.prng),
		};
	}

	private logProgress(p: Pools) {
		// `\r` = return to the beginning of the line
		// `\x1b[k` (`\e[K`) = clear all characters from cursor position to EOL
		if (this.games) process.stdout.write('\r\x1b[K');
		// Deliberately don't print a `\n` character so that we can overwrite
		process.stdout.write(
			`[${this.format}] P:${p.pokemon} I:${p.items} A:${p.abilities} M:${p.moves} = ${this.games}`);
	}

	private static getSignatures(dex: typeof Dex, pools: Pools): Map<string, {item: string, move?: string}[]> {
		const signatures = new Map();
		for (const id of pools.items.possible) {
			const item = dex.data.Items[id];
			if (item.megaEvolves) {
				const pokemon = toId(item.megaEvolves);
				const combo = {item: id};
				let combos = signatures.get(pokemon);
				if (!combos) {
					combos = [];
					signatures.set(pokemon, combos);
				}
				combos.push(combo);
			} else if (item.zMoveUser) {
				for (const user of item.zMoveUser) {
					const pokemon = toId(user);
					const combo: {item: string, move?: string} = {item: id};
					if (item.zMoveFrom) combo.move = toId(item.zMoveFrom);
					let combos = signatures.get(pokemon);
					if (!combos) {
						combos = [];
						signatures.set(pokemon, combos);
					}
					combos.push(combo);
				}
			}
		}
		return signatures;
	}

	private static onlyValid<T>(
		gen: number, obj: {[key: string]: T}, getter: (k: string) => AnyObject,
		additional?: (k: string, v: AnyObject) => boolean, nonStandard?: boolean
	) {
		return Object.keys(obj).filter(k => {
			const v = getter(k);
			return v.gen <= gen &&
				(!v.isNonstandard || !!nonStandard) &&
				(!additional || additional(k, v));
		});
	}
}

// Generates random teams of pokemon suitable for use in custom games (ie. without team
// validation). Coordinates with the CoordinatedPlayerAI below through Pools to ensure as
// many different options as possible get exercised in battle.
class TeamGenerator {
	// By default, the TeamGenerator generates sets completely at random which unforunately means
	// certain signature combinations (eg. Mega Stone/Z Moves which only work for specific Pokemon)
	// are unlikely to be chosen. To combat this, we keep a mapping of these combinations and some
	// fraction of the time when we are generating sets for these particular Pokemon we give them
	// the combinations they need to exercise the simulator more thoroughly.
	static readonly COMBO = 0.5;

	private readonly dex: typeof Dex;
	private readonly prng: PRNG;
	private readonly pools: Pools;
	private readonly signatures: Map<string, {item: string, move?: string}[]>;
	private readonly natures: readonly string[];

	constructor(
		dex: typeof Dex, prng: PRNG | PRNGSeed | null, pools: Pools,
		signatures: Map<string, {item: string, move?: string}[]>
	) {
		this.dex = dex;
		this.prng = prng && !Array.isArray(prng) ? prng : new PRNG(prng);
		this.pools = pools;
		this.signatures = signatures;

		this.natures = Object.keys(this.dex.data.Natures);
	}

	get exhausted() {
		const exhausted = [this.pools.pokemon.exhausted, this.pools.moves.exhausted];
		if (this.dex.gen >= 2) exhausted.push(this.pools.items.exhausted);
		if (this.dex.gen >= 3) exhausted.push(this.pools.abilities.exhausted);
		return Math.min.apply(null, exhausted);
	}

	generate() {
		const team: PokemonSet[] = [];
		for (const pokemon of this.pools.pokemon.next(6)) {
			const template = this.dex.getTemplate(pokemon);
			const randomEVs = () => this.prng.next(253);
			const randomIVs = () => this.prng.next(32);

			let item;
			const moves = [];
			const combos = this.signatures.get(template.id);
			if (combos && this.prng.next() > TeamGenerator.COMBO) {
				const combo = this.prng.sample(combos);
				item = combo.item;
				if (combo.move) moves.push(combo.move);
			} else {
				item = this.dex.gen >= 2 ? this.pools.items.next() : '';
			}

			team.push({
				name: template.baseSpecies,
				species: template.species,
				gender: template.gender,
				item,
				ability: this.dex.gen >= 3 ? this.pools.abilities.next() : 'None',
				moves: moves.concat(...this.pools.moves.next(4 - moves.length)),
				evs: {
					hp: randomEVs(),
					atk: randomEVs(),
					def: randomEVs(),
					spa: randomEVs(),
					spd: randomEVs(),
					spe: randomEVs(),
				},
				ivs: {
					hp: randomIVs(),
					atk: randomIVs(),
					def: randomIVs(),
					spa: randomIVs(),
					spd: randomIVs(),
					spe: randomIVs(),
				},
				nature: this.prng.sample(this.natures),
				level: this.prng.next(50, 100),
				happiness: this.prng.next(256),
				shiny: this.prng.randomChance(1, 1024),
			});
		}
		return team;
	}
}

class Pool {
	readonly possible: string[];

	private readonly prng: PRNG;

	private unused: Set<string>;
	private filled: Set<string> | undefined;
	private filler: string[] | undefined;
	private iter: (Iterator<string> & {done?: boolean}) | undefined;

	exhausted: number;

	constructor(possible: string[], prng: PRNG) {
		this.possible = possible;
		this.prng = prng;
		this.exhausted = 0;
		this.unused = new Set();
	}

	toString() {
		return `${this.exhausted} (${this.unused.size}/${this.possible.length})`;
	}

	private reset() {
		if (this.filled) this.exhausted++;

		this.iter = undefined;
		this.unused = new Set(this.shuffle(this.possible));
		if (this.possible.length && this.filled) {
			for (const used of this.filled) {
				this.unused.delete(used);
			}
			this.filled = new Set();
			if (!this.unused.size) this.reset();
		} else {
			this.filled = new Set();
		}
		this.filler = this.possible.slice();
		// POST: this.unused.size === this.possible.length
		// POST: this.filler.length > 0
		// POST: this.filled.size === 0
		// POST: this.iter === undefined
	}

	private shuffle<T>(arr: T[]): T[] {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(this.prng.next() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	wasUsed(k: string) {
		// NOTE: We are intentionally clearing our iterator even though `unused`
		// hasn't been modified, see explanation below.
		this.iter = undefined;
		return !this.unused.has(k);
	}

	markUsed(k: string) {
		this.iter = undefined;
		this.unused.delete(k);
	}

	next(): string;
	next(num: number): string[];
	next(num?: number): string | string[] {
		if (!num) return this.choose();
		const chosen = [];
		for (let i = 0; i < num; i++) {
			chosen.push(this.choose());
		}
		return chosen;
	}

	// Returns the next option in our set of unused options which were shuffled
	// before insertion so as to come out in random order. The iterator is
	// reset when the pools are manipulated by the CombinedPlayerAI (`markUsed`
	// as it mutates the set, but also `wasUsed` because resetting the
	// iterator isn't so much 'marking it as invalid' as 'signalling that we
	// should move the unused options to the top again').
	//
	// As the pool of options dwindles, we run into scenarios where `choose`
	// will keep returning the same options. This helps ensure they get used,
	// but having a game with every Pokemon having the same move or ability etc
	// is less realistic, so instead we 'fill' out the remaining choices during a
	// generator round (ie. until our iterator gets invalidated during gameplay).
	//
	// The 'filler' choices are tracked in `filled` to later subtract from the next
	// exhaustion cycle of this pool, but in theory we could be so unlucky that
	// we loop through our fillers multiple times while dealing with a few stubborn
	// remaining options in `unused`, therefore undercounting our `exhausted` total,
	// but this is considered to be unlikely enough that we don't care (and
	// `exhausted` is a lower bound anyway).
	private choose() {
		if (!this.unused.size) this.reset();

		if (this.iter) {
			if (!this.iter!.done) {
				const next = this.iter.next();
				this.iter.done = next.done;
				if (!next.done) return next.value;
			}
			return this.fill();
		}

		this.iter = this.unused.values();
		const next = this.iter.next();
		this.iter!.done = next.done;
		// this.iter.next() must have a value (!this.iter.done) because this.unused.size > 0
		// after this.reset(), and the only places that mutate this.unused clear this.iter.
		return next.value;
	}

	private fill() {
		let length = this.filler!.length;
		if (!length) {
			this.filler = this.possible.slice();
			length = this.filler.length;
		}
		const index = this.prng.next(length);
		const element = this.filler![index];
		this.filler![index] = this.filler![length - 1];
		this.filler!.pop();
		this.filled!.add(element);
		return element;
	}
}

// Random AI which shares Pools with the TeamGenerator to coordinate creating battle simulations
// that test out as many different Pokemon/Species/Items/Moves as possible. The logic is still
// random, so it's not going to optimally use as many new effects as would be possible, but it
// should exhaust its pools much faster than the naive RandomPlayerAI alone.
//
// NOTE: We're tracking 'usage' when we make the choice and not what actually gets used in Battle.
// These can differ in edge cases and so its possible we report that we've 'used' every option
// when we haven't (for example, we may switch in a Pokemon with an ability, but we're not
// guaranteeing the ability activates, etc).
class CoordinatedPlayerAI extends RandomPlayerAI {
	private readonly pools: Pools;

	constructor(playerStream: ObjectReadWriteStream<string>, options: AIOptions, pools: Pools) {
		super(playerStream, options);
		this.pools = pools;
	}

	protected chooseTeamPreview(team: AnyObject[]): string {
		return `team ${this.choosePokemon(team.map((p, i) => ({slot: i + 1, pokemon: p}))) || 1}`;
	}

	protected chooseMove(moves: {choice: string, move: AnyObject}[]): string {
		// Prefer to use a move which hasn't been used yet.
		for (const {choice, move} of moves) {
			const id = this.fixMove(move);
			if (!this.pools.moves.wasUsed(id)) {
				this.pools.moves.markUsed(id);
				return choice;
			}
		}
		return super.chooseMove(moves);
	}

	protected chooseSwitch(switches: {slot: number, pokemon: AnyObject}[]): number {
		return this.choosePokemon(switches) || super.chooseSwitch(switches);
	}

	private choosePokemon(choices: {slot: number, pokemon: AnyObject}[]) {
		// Prefer to choose a Pokemon that has a species/ability/item/move we haven't seen yet.
		for (const {slot, pokemon} of choices) {
			const species = toId(pokemon.details.split(',')[0]);
			if (!this.pools.pokemon.wasUsed(species) ||
					!this.pools.abilities.wasUsed(pokemon.baseAbility) ||
					!this.pools.items.wasUsed(pokemon.item) ||
					pokemon.moves.some((m: AnyObject) => !this.pools.moves.wasUsed(this.fixMove(m)))) {
				this.pools.pokemon.markUsed(species);
				this.pools.abilities.markUsed(pokemon.baseAbility);
				this.pools.items.markUsed(pokemon.item);
				return slot;
			}
		}
	}

	// The move options provided by the simulator have been converted from the name
	// which we're tracking, so we need to convert them back;
	private fixMove(m: AnyObject) {
		const id = toId(m.move);
		if (id.startsWith('return')) return 'return';
		if (id.startsWith('frustration')) return 'frustration';
		if (id.startsWith('hiddenpower')) return 'hiddenpower';
		return id;
	}
}
