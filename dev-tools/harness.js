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

// Run the build script if we're being called from the command line.
// NOTE: `require('../build')` is not safe because `replace` is async.
if (require.main === module) shell('node ../build');

const BattleStreams = require('../.sim-dist/battle-stream');
const Dex = require('../.sim-dist/dex');
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
					if (this.verbose) display(timer);
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

		// Calculate how many games failed (failures weren't added to `games`).
		return this.totalGames - (await Promise.all(games)).length;
	}

	async runGame(format, timer, battleStream) {
		const t = timer.time('prepare');
		const streams = BattleStreams.getPlayerStreams(battleStream || new BattleStreams.BattleStream());
		// The seed used is the intial seed to begin with (its important that nothing
		// advances the PRNG before the initial `runGame` call for repro purposes), but
		// later is advanced by the four `newSeed()` calls, so each iteration should be
		// 16 frames off the previous.
		const spec = {formatid: format, seed: this.prng.seed};
		const p1spec = {name: "Bot 1", team: this.generateTeam(format, timer)};
		const p2spec = {name: "Bot 2", team: this.generateTeam(format, timer)};

		// eslint-disable
		const p1 = new RandomPlayerAI( // eslint-disable-line no-unused-vars
			streams.p1, Object.assign({seed: this.newSeed()}, this.p1options));
		const p2 = new RandomPlayerAI( // eslint-disable-line no-unused-vars
			streams.p2, Object.assign({seed: this.newSeed()}, this.p2options));

		t(streams.omniscient.write(`>start ${JSON.stringify(spec)}\n` +
			`>player p1 ${JSON.stringify(p1spec)}\n` +
			`>player p2 ${JSON.stringify(p2spec)}`));

		let chunk;
		while ((chunk = await streams.omniscient.read())) {
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

	generateTeam(format, timer) {
		return timer.time('generateTeam')(Dex.packTeam(Dex.generateTeam(format, this.newSeed())));
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


const micros = t => `${Math.round(t * 1000).toLocaleString()}\u03BCs`;
const percent = (n, d) => `${(n * 100 / d).toFixed(2)}%`;
const sheader = ['name', 'count', 'p50', 'p90', 'p95', 'p99', 'min', 'max', 'avg', 'std'];
const cheader = ['name', 'count'];

const sconfig = {columns: sheader.map((col, i) => {
	const all = {wrapWord: true};
	if (i >= 2) all.width = 10;
	return all;
})};

let table;
let style = {bold: ID, underline: ID};
function display(timers) {
	if (!table) return;

	if (Array.isArray(timers)) {
		// TODO
	} else {
		const timer = timers;
		const {stats, total} = timer.stats();
		if (total) console.log(`\n${style.bold(style.underline('Time'))} (${micros(total)})`);
		if (stats.size) {
			const data = [];
			for (const [name, s] of stats.entries()) {
				const d = [name, s.cnt];
				for (let i = 2; i < sheader.length; i++) {
					const val = s[sheader[i]];
					let out = micros(val);
					if (total) out += ` (${percent(val, total)})`;
					d.push(out);
				}
				data.push(d);
			}
			// TODO sort!
			console.log(table([sheader.map(h => style.bold(h)), ...data], sconfig));
		}

		if (timer.counters.size) {
			if (!stats.size) console.log('\n');
			console.log(style.bold(style.underline('Counters')));

			const groups = new Map();
			for (const [name, count] of timer.counters.entries()) {
				const [prefix, suffix] = name.split(':');
				let group = groups.get(prefix);
				if (!group) groups.set(prefix, (group = []));
				group.push([name, count]);
			}

			for (const [group, data] of groups.entries()) {
				data.sort((a, b) => (b[1] - a[1]));
				console.log(table([cheader.map(h => style.bold(h)), ...data]));
			}
		}
	}
}


module.exports = Runner;

// Kick off the Runner if we're being called from the command line.
if (require.main === module) {
	// *Seed scientifically chosen after incredibly detailed and thoughtful analysis.*
	// The default seed used when running the harness for benchmarking purposes - all we
	// really care about is consistency between runs, we don't have any specific concerns
	// about the randomness provided it results in pseudo-realistic game playouts.
	const BENCHMARK_SEED = [0x01234, 0x05678, 0x09123, 0x04567];
	// 'move' 70% of the time (ie. 'switch' 30%) and ' mega' 60% of the time that its an option.
	const AI_OPTIONS = {move: 0.7, mega: 0.6};

	const options = {totalGames: 100, p1options: AI_OPTIONS, p2options: AI_OPTIONS, timer: () => NOOP_TIMER};
	// If we have more than one arg, or the arg looks like a flag, we need minimist to understand it.
	if (process.argv.length > 2 || process.argv.length === 2 && process.argv[2].startsWith('-')) {
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

		if (argv.benchmark) {
			options.seed = BENCHMARK_SEED;

			let deps = '';
			if (missing('trakr')) deps += 'trakr';
			if (missing('table')) deps += 'table';
			if (deps) shell(`npm install ${deps}`);

			const trakr = require('trakr');
			options.timer = () => new trakr.Timer();
			// Require 'table' so that the display function actually works.
			table = require('table').table;
			if (!missing('colors')) {
				const colors = require('colors/safe');
				style = {bold: colors.bold, underline: colors.underline};
			}
		}
		if (argv.seed) options.seed = argv.seed.split(',').map(s => Number(s));
		options.totalGames = Number(argv._[0] || argv.num) || options.totalGames;
		options.verbose = argv.verbose;
		options.silent = argv.silent;
		options.logs = argv.logs;
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
