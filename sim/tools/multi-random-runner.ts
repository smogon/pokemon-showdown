/**
 * Battle Simulator multi random runner.
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

import {PRNG, PRNGSeed} from '../prng';
import {Runner, RunnerOptions} from './runner';

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
		'gen8randombattle', 'gen8randomdoublesbattle', 'gen8battlefactory',
		'gen7randombattle', 'gen7battlefactory',
		'gen6randombattle', 'gen6battlefactory',
		'gen5randombattle',
		'gen4randombattle',
		'gen3randombattle',
		'gen2randombattle',
		'gen1randombattle',
	];

	private readonly options: Partial<RunnerOptions>;
	private readonly totalGames: number;
	private readonly prng: PRNG;
	private readonly format: string | undefined;
	private readonly cycle: boolean;
	private readonly all: boolean;
	private readonly isAsync: boolean;

	private formatIndex: number;
	private numGames: number;

	constructor(options: MultiRandomRunnerOptions) {
		this.options = {...options};

		this.totalGames = options.totalGames;

		this.prng = PRNG.get(options.prng);
		this.options.prng = this.prng;

		this.format = options.format;
		this.cycle = !!options.cycle;
		this.all = !!options.all;

		this.isAsync = !!options.async;

		this.formatIndex = 0;
		this.numGames = 0;
	}

	async run() {
		let games = [];
		let format: string | false;
		let lastFormat: string | false = false;
		let failures = 0;
		while ((format = this.getNextFormat())) {
			if (this.all && lastFormat && format !== lastFormat) {
				if (this.isAsync) await Promise.all(games);
				games = [];
			}

			const seed = this.prng.getSeed();
			const game = new Runner({format, ...this.options}).run().catch(err => {
				failures++;
				console.error(
					`Run \`node tools/simulate multi 1 --format=${format} --seed=${seed}\` ` +
					`to debug (optionally with \`--output\` and/or \`--input\` for more info):\n`,
					err
				);
			});

			if (!this.isAsync) await game;
			games.push(game);
			lastFormat = format;
		}

		if (this.isAsync) await Promise.all(games);
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
