/**
 * Battle Simulator runner.
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

import {ObjectReadWriteStream} from '../../lib/streams';
import {Battle} from '../battle';
import * as BattleStreams from '../battle-stream';
import {PRNG, PRNGSeed} from '../prng';
import {State} from '../state';
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
	dual?: boolean;
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
	private readonly dual: boolean;

	constructor(options: RunnerOptions) {
		this.format = options.format;

		this.prng = (options.prng && !Array.isArray(options.prng)) ?
			options.prng : new PRNG(options.prng);
		this.p1options = Object.assign({}, Runner.AI_OPTIONS, options.p1options);
		this.p2options = Object.assign({}, Runner.AI_OPTIONS, options.p2options);

		this.input = !!options.input;
		this.output = !!options.output;
		this.error = !!options.error;
		this.dual = !!options.dual;
	}

	async run() {
		const battleStream =
			this.dual ? new DualStream(this.input) : new RawBattleStream(this.input);
		const game = this.runGame(this.format, battleStream);
		if (!this.error) return game;
		return game.catch(err => {
			console.log(`\n${battleStream.rawInputLog.join('\n')}\n`);
			throw err;
		});
	}

	private async runGame(format: string, battleStream: RawBattleStream | DualStream) {
		// @ts-ignore - DualStream implements everything relevant from BattleStream.
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

class DualStream {
	private readonly mutex: Mutex;

	private readonly control: RawBattleStream;
	private test: RawBattleStream;

	constructor(input: boolean) {
		this.mutex = new Mutex();
		// The input to both streams should be the same, so to satisfy the
		// input flag we only need to track the raw input of one stream.
		this.control = new RawBattleStream(input);
		this.test = new RawBattleStream(false);
	}

	get rawInputLog() {
		const control = this.control.rawInputLog;
		const test = this.test.rawInputLog;
		this.verify(control.join('\n'), test.join('\n'));
		return control;
	}

	async read() {
		const control = await this.control.read();
		const test = await this.test.read();
		this.verify(control, test);
		return control;
	}

	async write(message: string) {
		 const release = await this.mutex.acquire();
		 try {
			await this.control._write(message);
			await this.test._write(message);
			this.compare();
		 } finally {
			 release();
		 }
	}

	async end() {
		// We need to compare first because _end() destroys the battle object.
		this.compare(true);
		await this.control._end();
		await this.test._end();
	}

	compare(end?: boolean) {
		if (!this.control.battle || !this.test.battle) return;

		const control = this.control.battle.toJSON();
		const test = this.test.battle.toJSON();
		if (!State.equal(control, test)) {
			this.verify(JSON.stringify(control, null, 2), JSON.stringify(test, null, 2));
		}

		if (end) return;
		const send = this.test.battle.send;
		this.test.battle = Battle.fromJSON(test);
		this.test.battle.restart(send);
	}

	verify(control?: string | null, test?: string | null) {
		if (test !== control) {
			console.log(control);
			console.error(test);
			process.exit(1);
		}
	}
}

class Mutex {
	private readonly queue: ((release: () => void) => void)[];
	private pending: boolean;

	constructor() {
		this.queue = [];
		this.pending = false;
	}

	acquire(): Promise<() => void> {
		const ticket = new Promise<(() => void)>(resolve => this.queue.push(resolve));
		if (!this.pending) this.dispatchNext();
		return ticket;
	}

	private dispatchNext(): void {
		if (this.queue.length > 0) {
			this.pending = true;
			this.queue.shift()!(this.dispatchNext.bind(this));
		} else {
			this.pending = false;
		}
	}
}
