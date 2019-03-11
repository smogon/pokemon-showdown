/**
 * Random Simulation harness for testing and benchmarking purposes.
 *
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

'use strict';

const child_process = require('child_process');
const shell = cmd => child_process.execSync(cmd, {stdio: 'inherit', cwd: __dirname});
// `require('../build')` is not safe because `replace` is async.
shell('node ../build');

const BattleStreams = require('../.sim-dist/battle-stream');
const Dex = require('../.sim-dist/dex');
const PRNG = require('../.sim-dist/prng').PRNG;
const RandomPlayerAI = require('../.sim-dist/examples/random-player-ai').RandomPlayerAI;

const DEFAULT_SEED = [0x09917, 0x06924, 0x0e1c8, 0x06af0];
const AI_OPTIONS = {move: 0.7, mega: 0.6};

const FORMATS = [
	'gen7randombattle', 'gen7randomdoublesbattle', 'gen7battlefactory', 'gen6randombattle', 'gen6battlefactory',
	'gen5randombattle', 'gen4randombattle', 'gen3randombattle', 'gen2randombattle', 'gen1randombattle',
];

class Runner {
	constructor(options) {
		this.prng = new PRNG(options.seed);
		this.format = options.format;
		this.totalGames = options.totalGames;
		this.all = !!options.all;
		this.logs = !!options.logs;
		this.silent = !this.logs || !!options.silent;
		this.async = !!options.async;
		this.p1options = options.p1options;
		this.p2options = options.p2options;

		this.formatIndex = 0;
		this.numGames = 0;
	}

	async run() {
		let games = [];
		let format, lastFormat;
		while ((format = this.getNextFormat())) {
			if (this.all && lastFormat && format !== lastFormat) {
				await Promise.all(games);
				games = [];
			}

			let seed = this.prng.seed;
			try {
				const game = this.runGame(format);
				if (!this.async) await game;
				games.push(game);
			} catch (e) {
				console.error(`Run \`node dev-tools/harness 1 --format=` +
					`${format} --seed=${seed.join(',')} --logs\` to debug:\n`, e);
			}
			lastFormat = format;
		}

		// Calculate how many games failed (failures weren't added to `games`).
		return this.totalGames - (await Promise.all(games)).length;
	}

	async runGame(format) {
		const streams = BattleStreams.getPlayerStreams(new BattleStreams.BattleStream());
		const spec = {formatid: format, seed: this.prng.seed};
		const p1spec = {name: "Bot 1", team: this.generateTeam(format)};
		const p2spec = {name: "Bot 2", team: this.generateTeam(format)};

		/* eslint-disable no-unused-vars */
		const p1 = new RandomPlayerAI(streams.p1,
			Object.assign({seed: this.nextSeed()}, this.p1options));
		const p2 = new RandomPlayerAI(streams.p2,
			Object.assign({seed: this.nextSeed()}, this.p2options));
		/* eslint-enable no-unused-vars */

		streams.omniscient.write(`>start ${JSON.stringify(spec)}\n` +
			`>player p1 ${JSON.stringify(p1spec)}\n` +
			`>player p2 ${JSON.stringify(p2spec)}`);

		let chunk;
		while ((chunk = await streams.omniscient.read())) {
			if (this.silent || !this.logs) continue;
			console.log(chunk);
		}
	}

	nextSeed() {
		return (this.prng.seed = this.prng.nextFrame(this.prng.seed));
	}

	generateTeam(format) {
		return Dex.packTeam(Dex.generateTeam(format, this.nextSeed()));
	}

	getNextFormat() {
		if (this.format) {
			return (this.numGames++ < this.totalGames) && this.format;
		} else if (this.formatIndex > FORMATS.length) {
			return false;
		} else if (this.numGames++ < this.totalGames) {
			return this.all ? FORMATS[this.formatIndex] : this.prng.sample(FORMATS);
		} else if (!this.all) {
			return false;
		} else {
			this.numGames = 1;
			this.formatIndex++;
			return FORMATS[this.formatIndex];
		}
	}
}

module.exports = Runner;

// Run the Runner if we're being run from the command line.
if (require.main === module) {
	const options = {seed: DEFAULT_SEED, totalGames: 100, p1options: AI_OPTIONS, p2options: AI_OPTIONS};
	// If we have more than one arg, or the arg looks like a flag, we need minimist to understand it.
	if (process.argv.length > 2 || process.argv.length === 2 && process.argv[2].startsWith('-')) {
		try {
			require.resolve('minimist');
		} catch (err) {
			if (err.code !== 'MODULE_NOT_FOUND') throw err;
			shell('npm install minimist');
		}

		const argv = require('minimist')(process.argv.slice(2));
		if (argv.seed) options.seed = argv.seed.split(',').map(s => Number(s));
		options.totalGames = Number(argv._[0] || argv.num) || options.totalGames;
		options.logs = argv.logs;
		options.silent = argv.silent;
		options.all = argv.all;
		options.async = argv.async;
		options.format = argv.format;
	} else if (process.argv.length === 2) {
		// If we have one arg, treat it as the total number of games to play.
		options.totalGames = Number(process.argv[2]) || options.totalGames;
	}

	// Run options.totalGames, exiting with the number of games with errors.
	(async () => process.exit(await new Runner(options).run()))();
}
