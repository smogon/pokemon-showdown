/**
 * Random Simulation harness for testing and benchmarking purposes.
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Refer to `HARNESS.md` for detailed usage instructions.
 *
 * @license MIT
 */

'use strict';

const child_process = require('child_process');
const shell = cmd => child_process.execSync(cmd, {stdio: 'inherit', cwd: __dirname});

// Run the build script if we're being called from the command line.
// NOTE: `require('../build')` is not safe because `replace` is async.
if (require.main === module) shell('node ../build');

const BattleStreams = require('../.sim-dist/battle-stream');
const PRNG = require('../.sim-dist/prng').PRNG;
const RandomPlayerAI = require('../.sim-dist/examples/random-player-ai').RandomPlayerAI;

// 'move' 70% of the time (ie. 'switch' 30%) and ' mega' 60% of the time that its an option.
const AI_OPTIONS = {move: 0.7, mega: 0.6, createAI: (s, o) => new RandomPlayerAI(s, o)};

const FORMATS = [
	'gen7randombattle', 'gen7randomdoublesbattle', 'gen7battlefactory', 'gen6randombattle', 'gen6battlefactory',
	'gen5randombattle', 'gen4randombattle', 'gen3randombattle', 'gen2randombattle', 'gen1randombattle',
];

class Runner {
	constructor(options) {
		this.prng = (options.prng && !Array.isArray(options.prng)) ?
			options.prng : new PRNG(options.prng);
		this.p1options = Object.assign({}, AI_OPTIONS, options.p1options);
		this.p2options = Object.assign({}, AI_OPTIONS, options.p2options);

		this.format = options.format;
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

	async runGame(format, battleStream) {
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
		p1.start();
		p2.start();

		streams.omniscient.write(`>start ${JSON.stringify(spec)}\n` +
			`>player p1 ${JSON.stringify(p1spec)}\n` +
			`>player p2 ${JSON.stringify(p2spec)}`);

		let chunk;
		while ((chunk = await streams.omniscient.read())) {
			if (this.output) console.log(chunk);
		}
		streams.omniscient.end();
	}

	// Same as PRNG#generatedSeed, only deterministic.
	// NOTE: advances this.prng's seed by 4.
	newSeed() {
		return [
			Math.floor(this.prng.next() * 0x10000),
			Math.floor(this.prng.next() * 0x10000),
			Math.floor(this.prng.next() * 0x10000),
			Math.floor(this.prng.next() * 0x10000),
		];
	}

	getPlayerSpec(name, options) {
		if (options.team) return {name, team: options.team};
		return {name, seed: this.newSeed()};
	}
}

class RawBattleStream extends BattleStreams.BattleStream {
	constructor(input) {
		super();
		this.input = !!input;
		this.rawInputLog = [];
	}

	_write(message) {
		if (this.input) console.log(message);
		this.rawInputLog.push(message);
		super._write(message);
	}
}

class MultiRunner {
	constructor(options) {
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
		let format, lastFormat;
		let failures = 0;
		while ((format = this.getNextFormat())) {
			if (this.all && lastFormat && format !== lastFormat) {
				if (this.async) await Promise.all(games);
				games = [];
			}

			const seed = this.prng.seed;
			const game = new Runner(Object.assign({format}, this.options)).run().catch(err => {
				failures++;
				console.error(
					`Run \`node dev-tools/harness 1 --format=${format} --seed=${seed.join()}\` ` +
					`to debug (optionally with \`--output\` and/or \`--input\` for more info):\n`, err);
			});

			if (!this.async) await game;
			games.push(game);
			lastFormat = format;
		}

		if (this.async) await Promise.all(games);
		return failures;
	}

	getNextFormat() {
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

// Tracks whether some promises threw errors that weren't caught so we can log
// and exit with a non-zero status to fail any tests. This "shouldn't happen"
// because we're "great at propagating promises (TM)", but better safe than sorry.
const RejectionTracker = new class {
	constructor() {
		this.unhandled = [];
	}

	onUnhandledRejection(reason, promise) {
		this.unhandled.push({reason, promise});
	}

	onRejectionHandled(promise) {
		this.unhandled.splice(this.unhandled.findIndex(u => u.promise === promise), 1);
	}

	onExit(code) {
		let i = 0;
		for (const u of this.unhandled) {
			const error = (u.reason instanceof Error) ? u.reason :
				new Error(`Promise rejected with value: ${u.reason}`);
			console.error(error.stack);
			i++;
		}
		process.exit(code + i);
	}

	register() {
		process.on('unhandledRejection', (r, p) => this.onUnhandledRejection(r, p));
		process.on('rejectionHandled', p => this.onRejectionHandled(p));
		process.on('exit', c => this.onExit(c));
	}
}();

module.exports = {Runner, MultiRunner, RejectionTracker};

// Kick off the MultiRunner if we're being called from the command line.
if (require.main === module) {
	const options = {totalGames: 100};
	// If we have more than one arg, or the arg looks like a flag, we need minimist to understand it.
	if (process.argv.length > 3 || process.argv.length === 3 && process.argv[2].startsWith('-')) {
		const missing = dep => {
			try {
				require.resolve(dep);
				return false;
			} catch (err) {
				if (err.code !== 'MODULE_NOT_FOUND') throw err;
				return true;
			}
		};

		if (missing('minimist')) shell('npm install minimist');
		const argv = require('minimist')(process.argv.slice(2));
		Object.assign(options, argv);
		options.totalGames = Number(argv._[0] || argv.num) || options.totalGames;
		if (argv.seed) options.prng = argv.seed.split(',').map(s => Number(s));
	} else if (process.argv.length === 3) {
		// If we have one arg, treat it as the total number of games to play.
		options.totalGames = Number(process.argv[2]) || options.totalGames;
	}

	RejectionTracker.register();

	// Run options.totalGames, exiting with the number of games with errors.
	(async () => process.exit(await new MultiRunner(options).run()))();
}
