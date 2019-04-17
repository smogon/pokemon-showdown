/**
 * Battle Simulator runner.
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

import {ObjectReadWriteStream} from '../../lib/streams';
import * as BattleStreams from '../battle-stream';
import {PRNG, PRNGSeed} from '../prng';
import {RandomPlayerAI} from './random-player-ai';

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
