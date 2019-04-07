/**
 * Battle Simulator smoke testing tooling.
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * 'Smoke tests' are a form of sanity testing/build verification which can be
 * used to expose obvious critical issues with the application. The tooling
 * in this file works by playing out a number of battles across various
 * generations and game types, attempting to use as many different effects to
 * smoke out any crashes. Making it through a successful cycle of smoke tests
 * does *not* mean the application is without bugs, or even that it is crash
 * free - it simply provides some confidence that the application is less
 * likely to catch fire.
 *
 * USAGE: `node dev-tools/harness.js` will run through a single 'cycle' of
 * battles, where each 'cycle' involves exhausting all possible
 * Pokemon/Abilities/Items/Moves at least once. Additional cycles can be run
 * by passing the desired number to run as the first argument to the script
 * (which is important to force different combinations/scenarios to play out).
 * If the number of cycles is negative, the smoke tests will loop continuously,
 * running each format a number of times specified by the cycle ad infinitum.
 *
 * In all cases, the program will abort if MAX_FAILURES have been encountered.
 *
 * @license MIT
 */

'use strict';

const child_process = require('child_process');
const shell = cmd => child_process.execSync(cmd, {stdio: 'inherit', cwd: __dirname});

// Run the build script if we're being called from the command line.
// NOTE: `require('../build')` is not safe because `replace` is async.
if (require.main === module) shell('node ../build');

const Dex = require('../.sim-dist/dex');
const PRNG = require('../.sim-dist/prng').PRNG;
const RandomPlayerAI = require('../.sim-dist/examples/random-player-ai').RandomPlayerAI;
const toId = Dex.getId;
const {Runner, RejectionTracker} = require('./harness');

// By default, the TeamGenerator generates sets completely at random which unforunately means
// certain signature combinations (eg. Mega Stone/Z Moves which only work for specific Pokemon)
// are unlikely to be chosen. To combat this, we keep a mapping of these combinations and some
// fraction of the time when we are generating sets for these particular Pokemon we give them
// the combinations they need to exercise the simulator more thoroughly.
const COMBO = 0.5;

// Generates random teams of pokemon suitable for use in custom games (ie. without team
// validation). Coordinates with the CoordinatedPlayerAI below through Pools to ensure as
// many different options as possible get exercised in battle.
class TeamGenerator {
	constructor(dex, prng, pools, signatures) {
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
		const team = [];
		for (let pokemon of this.pools.pokemon.next(6)) {
			const template = this.dex.getTemplate(pokemon);
			const randomEVs = () => this.prng.next(253);
			const randomIVs = () => this.prng.next(32);

			let item;
			const moves = [];
			const combos = this.signatures.get(template.id);
			if (combos && this.prng.next() > COMBO) {
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
	constructor(possible, prng) {
		this.possible = possible;
		this.prng = prng;
		this.exhausted = 0;
		this.unused = new Set();
	}

	toString() {
		return `${this.exhausted} (${this.unused.size}/${this.possible.length})`;
	}

	reset() {
		if (this.filled) this.exhausted++;

		this.iter = undefined;
		this.unused = new Set(this.shuffle(this.possible));
		if (this.possible.length && this.filled) {
			for (let used of this.filled) {
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

	shuffle(arr) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(this.prng.next() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	wasUsed(k) {
		// NOTE: We are intentionally clearing our iterator even though `unused`
		// hasn't been modified, see explanation below.
		this.iter = undefined;
		return !this.unused.has(k);
	}

	markUsed(k) {
		this.iter = undefined;
		this.unused.delete(k);
	}

	next(num) {
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
	choose() {
		if (!this.unused.size) this.reset();

		if (this.iter) {
			if (!this.iter.done) {
				const next = this.iter.next();
				this.iter.done = next.done;
				if (!next.done) return next.value;
			}
			return this.fill();
		}

		this.iter = this.unused.values();
		const next = this.iter.next();
		this.iter.done = next.done;
		// this.iter.next() must have a value (!this.iter.done) because this.unused.size > 0
		// after this.reset(), and the only places that mutate this.unused clear this.iter.
		return next.value;
	}

	fill() {
		let length = this.filler.length;
		if (!length) {
			this.filler = this.possible.slice();
			length = this.filler.length;
		}
		const index = this.prng.next(length);
		const element = this.filler[index];
		this.filler[index] = this.filler[length - 1];
		this.filler.pop();
		this.filled.add(element);
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
	constructor(playerStream, options, pools) {
		super(playerStream, options);
		this.pools = pools;
	}

	chooseTeamPreview(team) {
		return `team ${this.choosePokemon(team.map((p, i) => ({slot: i + 1, pokemon: p}))) || 1}`;
	}

	chooseMove(moves) {
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

	chooseSwitch(switches) {
		return this.choosePokemon(switches) || super.chooseSwitch(switches);
	}

	choosePokemon(choices) {
		// Prefer to choose a Pokemon that has a species/ability/item/move we haven't seen yet.
		for (const {slot, pokemon} of choices) {
			const species = toId(pokemon.details.split(',')[0]);
			if (!this.pools.pokemon.wasUsed(species) ||
					!this.pools.abilities.wasUsed(pokemon.baseAbility) ||
					!this.pools.items.wasUsed(pokemon.item) ||
					pokemon.moves.some(m => !this.pools.moves.wasUsed(this.fixMove(m)))) {
				this.pools.pokemon.markUsed(species);
				this.pools.abilities.markUsed(pokemon.baseAbility);
				this.pools.items.markUsed(pokemon.item);
				return slot;
			}
		}
	}

	// The move options provided by the simulator have been converted from the name
	// which we're tracking, so we need to convert them back;
	fixMove(m) {
		const id = toId(m.move);
		if (id.startsWith('return')) return 'return';
		if (id.startsWith('frustration')) return 'frustration';
		if (id.startsWith('hiddenpower')) return 'hiddenpower';
		return id;
	}
}

const DEFAULT_CYCLES = 1;
const MAX_FAILURES = 10;

class SmokeRunner {
	constructor(options) {
		this.format = options.format;
		this.cycles = options.cycles || DEFAULT_CYCLES;
		this.prng = (options.prng && !Array.isArray(options.prng)) ?
			options.prng : new PRNG(options.prng);
		this.log = !!options.log;
		this.maxGames = options.maxGames;
		this.maxFailures = options.maxFailures || MAX_FAILURES;

		this.failures = 0;
		this.games = 0;
	}

	async run() {
		const dex = Dex.forFormat(this.format);

		const seed = this.prng.seed;
		const pools = this.createPools(dex);
		const createAI = (s, o) => new CoordinatedPlayerAI(s, o, pools);
		const generator = new TeamGenerator(dex, this.prng, pools, getSignatures(dex, pools));

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
					`\n\nRun \`node dev-tools/smoke ${this.cycles} ${this.format} ${seed.join()}\`:\n`, err);
			}
		} while ((!this.maxGames || this.games < this.maxGames) &&
					(!this.maxFailures || this.failures < this.maxFailures) &&
					generator.exhausted < this.cycles);

		return this.failures;
	}

	createPools(dex) {
		return {
			pokemon: new Pool(onlyValid(dex.gen, dex.data.Pokedex, p => dex.getTemplate(p),
				(_, p) => (p.species !== 'Pichu-Spiky-eared' && p.species.substr(0, 8) !== 'Pikachu-')), this.prng),
			items: new Pool(onlyValid(dex.gen, dex.data.Items, i => dex.getItem(i)), this.prng),
			abilities: new Pool(onlyValid(dex.gen, dex.data.Abilities, a => dex.getAbility(a)), this.prng),
			moves: new Pool(onlyValid(dex.gen, dex.data.Movedex, m => dex.getMove(m),
				m => (m !== 'struggle' && (m === 'hiddenpower' || m.substr(0, 11) !== 'hiddenpower'))), this.prng),
		};
	}

	logProgress(p) {
		// `\r` = return to the beginning of the line
		// `\x1b[k` (`\e[K`) = clear all characters from cursor position to EOL
		if (this.games) process.stdout.write('\r\x1b[K');
		// Deliberately don't print a `\n` character so that we can overwrite
		process.stdout.write(
			`[${this.format}] P:${p.pokemon} I:${p.items} A:${p.abilities} M:${p.moves} = ${this.games}`);
	}
}

module.exports = {TeamGenerator, Pool, CoordinatedPlayerAI, SmokeRunner};

function onlyValid(gen, obj, getter, additional, nonStandard) {
	return Object.keys(obj).filter(k => {
		const v = getter(k);
		return v.gen <= gen &&
			(!v.isNonstandard || !!nonStandard) &&
			(!additional || additional(k, v));
	});
}

function getSignatures(dex, pools) {
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
				const combo = {item: id};
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

if (require.main === module) {
	Dex.includeModData();
	RejectionTracker.register();

	// TODO: Add triple battles once supported by the AI.
	const FORMATS = [
		'gen7customgame', 'gen7doublescustomgame',
		'gen6customgame', 'gen6doublescustomgame',
		'gen5customgame', 'gen5doublescustomgame',
		'gen4customgame', 'gen4doublescustomgame',
		'gen3customgame', 'gen3doublescustomgame',
		'gen2customgame',
		'gen1customgame'];

	const format = process.argv[3];
	const formats = format ? [format] : FORMATS;
	const maxFailures = format ? 1 : MAX_FAILURES;
	const seed = process.argv[4] && process.argv[4].split(',').map(s => Number(s));
	const prng = new PRNG(seed);

	// Because of our handwavy accounting of 'usage', as well as to account for ordering effects and
	// the interplay of various combinations, we should actually run multiple cycles and exhaust our
	// pools multiple times to provide more confidence that we're actually smoking out issues.
	let cycles = Number(process.argv[2]) || DEFAULT_CYCLES;
	// If cycles is negative the smoke test will instead run indefinitely in case you wish to
	// dedicate some computer resources to finding PS! edge case crashes instead of mining crypto,
	// folding proteins, or searching for extraterrestrials/large primes.
	let forever = false;
	if (cycles < 0) {
		cycles = -cycles;
		forever = true;
	}

	(async () => {
		let failures = 0;
		do {
			for (let format of formats) {
				failures += await new SmokeRunner({
					format, cycles, prng, maxFailures, log: true,
				}).run();
				process.stdout.write('\n');
				if (failures >= maxFailures) break;
			}
		} while (forever); // eslint-disable-line no-unmodified-loop-condition
		process.exit(failures);
	})();
}
