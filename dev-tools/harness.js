/**
 * Random Simulation harness for testing and benchmarking purposes.
 *
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

'use strict';

const trakkr = require('trakkr'); // TODO
const child_process = require('child_process');
const shell = cmd => child_process.execSync(cmd, {stdio: 'inherit', cwd: __dirname});

// Run the build script if we're being called from the command line.
// NOTE: `require('../build')` is not safe because `replace` is async.
if (require.main === module) shell('node ../build');

// Preload Dex to avoid skewing benchmarks.
require('../.sim-dist/dex').includeModData();
const BattleStreams = require('../.sim-dist/battle-stream');
const PRNG = require('../.sim-dist/prng').PRNG;
const RandomPlayerAI = require('../.sim-dist/examples/random-player-ai').RandomPlayerAI;

const FORMATS = [
	'gen7randombattle', 'gen7randomdoublesbattle', 'gen7battlefactory', 'gen6randombattle', 'gen6battlefactory',
	'gen5randombattle', 'gen4randombattle', 'gen3randombattle', 'gen2randombattle', 'gen1randombattle',
];

class Runner {
	constructor(options) {
		this.prng = (options.prng && !Array.isArray(options.prng)) ?
			options.prng : new PRNG(options.prng);
		this.format = options.format;
		this.totalGames = options.totalGames;
		this.all = !!options.all;
		this.async = !!options.async;
		this.p1options = options.p1options;
		this.p2options = options.p2options;
		// silence is golden (trumps noisy options)
		this.silent = !!options.silent;
		this.logs = !this.silent && !!options.logs;
		this.verbose = !this.silent && !!options.verbose;
		this.timer = options.timer;
		this.formatter = options.formatter;
		this.warmup = options.warmup;

		this.formatIndex = 0;
		this.numGames = 0;
	}

	async run() {
		let games = [];
		let timers = [];
		let format, lastFormat;
		while ((format = this.getNextFormat())) {
			if (this.all && lastFormat && format !== lastFormat) {
				await Promise.all(games);

				// TODO: WIP trakkr still needs to support aggregated statistics...
				if (this.formatter) this.display(lastFormat, timers);

				games = [];
				timers = [];
			}

			const seed = this.prng.seed;
			const timer = this.timer();

			let battleStream;
			try {
				timer.start();
				battleStream = new BattleStreams.BattleStream({timer});
				const game = this.runGame(format, timer, battleStream).finally(() => timer.stop());
				if (!this.async) {
					await game;
					if (this.verbose && this.formatter) console.log(this.formatter.display(timer));
				}
				games.push(game);
				timers.push(timer);
			} catch (e) {
				if (battleStream && battleStream.battle && this.logs) {
					console.error(`${battleStream.battle.inputLog.join('\n')}\n\n`);
				}
				console.error(`Run \`node dev-tools/harness 1 --format=` +
					`${format} --seed=${seed.join(',')} --verbose\` to debug:\n`, e);
			}
			lastFormat = format;
		}

		if (this.all && this.formatter) {
			this.display(lastFormat, timers);
			// TODO: spit out summary if benchmarking?
		}

		// Calculate how many games failed (failures weren't added to `games`).
		return this.totalGames - (await Promise.all(games)).length;
	}

	display(format, timers) {
		if (this.warmup) timers = timers.slice(this.warmup);
		const formatStats = new Map();
		formatStats.set(format, trakkr.Stats.compute(timers.map(t => t.duration)));
		console.log(this.formatter.displayStats(formatStats));
		console.log(this.formatter.displayStats(trakkr.aggregateStats(timers)));
	}

	async runGame(format, timer, battleStream) {
		const streams = BattleStreams.getPlayerStreams(battleStream || new BattleStreams.BattleStream());
		// The seed used is the intial seed to begin with (its important that nothing
		// advances the PRNG before the initial `runGame` call for repro purposes), but
		// later is advanced by the four `newSeed()` calls, so each iteration should be
		// 16 frames off the previous.
		const spec = {formatid: format, seed: this.prng.seed};
		const p1spec = {name: "Bot 1", seed: this.newSeed()};
		const p2spec = {name: "Bot 2", seed: this.newSeed()};

		const p1 = new RandomPlayerAI(
			streams.p1, Object.assign({seed: this.newSeed()}, this.p1options)).start();
		const p2 = new RandomPlayerAI(
			streams.p2, Object.assign({seed: this.newSeed()}, this.p2options)).start();

		timer.start();
		streams.omniscient.write(`>start ${JSON.stringify(spec)}\n` +
			`>player p1 ${JSON.stringify(p1spec)}\n` +
			`>player p2 ${JSON.stringify(p2spec)}`);

		let chunk;
		while ((chunk = await Promise.race([streams.omniscient.read(), p1, p2]))) {
			if (this.verbose) console.log(chunk);
		}
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

// 'Timer' used when we're not benchmarking and don't need it to be operational.
const ID = a => a;
const STATS = {stats: new Map()};
const NOOP_TIMER = new class {
	count() {}
	add() {}
	start() {}
	stop() {}
	time() { return ID; }
	stats() { return STATS; }
}();

module.exports = Runner;

// Kick off the Runner if we're being called from the command line.
if (require.main === module) {
	// 'move' 70% of the time (ie. 'switch' 30%) and ' mega' 60% of the time that its an option.
	const AI_OPTIONS = {move: 0.7, mega: 0.6};

	const options = {totalGames: 100, p1options: AI_OPTIONS, p2options: AI_OPTIONS, timer: () => NOOP_TIMER};
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
		if (argv.benchmark) {
			// *Seed scientifically chosen after incredibly detailed and thoughtful analysis.*
			// The default seed used when running the harness for benchmarking purposes - all we
			// really care about is consistency between runs, we don't have any specific concerns
			// about the randomness provided it results in pseudo-realistic game playouts.
			options.prng = [0x01234, 0x05678, 0x09123, 0x04567];

			//if (missing('trakkr')) shell('npm install trakkr');
			//const trakkr = require('trakkr');
			const buf = argv.fixed && {buf: Buffer.allocUnsafe(options.totalGames * (parseInt(argv.fixed) || 0x100000))};
			options.timer = () => trakkr.Timer.create(buf);
			// Choose which formatter to use - we don't need to tweak the sort or write a custom
			// formatter because its almost as though the defaults were written for our usecase...
			const formatter = new trakkr.Formatter(!!argv.full, trakkr.SORT,
				(argv.output === 'csv' || argv.csv) ? trakkr.CSV :
					(argv.output === 'tsv' || argv.tsv) ? trakkr.TSV :
					/** argv.output === 'table' */ trakkr.TABLE);
			options.formatter = formatter;

			if (argv.warmup) {
				options.warmup = parseInt(argv.warmup) || Math.ceil(0.1 * options.totalGames);
				options.totalGames += options.warmup;
			}
		}
	} else if (process.argv.length === 3) {
		// If we have one arg, treat it as the total number of games to play.
		options.totalGames = Number(process.argv[2]) || options.totalGames;
	}

	// Run options.totalGames, exiting with the number of games with errors.
	(async () => process.exit(await new Runner(options).run()))();
}
