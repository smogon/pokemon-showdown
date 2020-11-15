/**
 * Random Simulation harness for testing and benchmarking purposes.
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Refer to `README.md` for detailed usage instructions.
 *
 * @license MIT
 */

'use strict';

if (process.argv[2]) {
	const help = ['help', '-help', '--help', 'h', '-h', '--help', '?', '-?', '--?'].includes(process.argv[2]);
	const unknown = !['multi', 'random', 'exhaustive'].includes(process.argv[2]) && !/^[0-9]+$/.test(process.argv[2]);

	if (help || unknown) {
		const out = help ? console.log : console.error;
		if (unknown) out(`Unrecognized command: ${process.argv[2]}\n`);
		out('tools/simulate random');
		out('');
		out(' Randomly simulates `--num` total games (default=100).');
		out(' The format(s) played and what gets output can be altered.');
		out('');
		out('tools/simulate exhaustive');
		out('');
		out(' Plays through enough randomly simulated battles to exhaust');
		out(' all options of abilities/items/moves/pokemon. `--cycles` can');
		out(' used to run through multiple exhaustions of the options.');
		out('');
		out('tools/simulate help');
		out('');
		out('  Displays this reference');
		out('');
		out('Please refer to tools/SIMULATE.md for full documentation');
		process.exit(+!help);
	}
}

const child_process = require('child_process');
const path = require('path');
const shell = cmd => child_process.execSync(cmd, {stdio: 'inherit', cwd: path.resolve(__dirname, '../..')});
shell('node build');

const Dex = require('../../.sim-dist/dex').Dex;
global.toID = require('../../.sim-dist/dex').Dex.getId;
global.Config = {allowrequestingties: false};
Dex.includeModData();

const {ExhaustiveRunner} = require('../../.sim-dist/tools/exhaustive-runner');
const {MultiRandomRunner} = require('../../.sim-dist/tools/multi-random-runner');

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
			console.error(`UNHANDLED PROMISE REJECTION:\n${error.stack}`);
			i++;
		}
		process.exit(code + i);
	}

	register() {
		process.on('unhandledRejection', (r, p) => this.onUnhandledRejection(r, p));
		process.on('rejectionHandled', p => this.onRejectionHandled(p));
		process.on('exit', c => this.onExit(c)); // TODO
	}
}();

RejectionTracker.register();

function missing(dep) {
	try {
		require.resolve(dep);
		return false;
	} catch (err) {
		if (err.code !== 'MODULE_NOT_FOUND') throw err;
		return true;
	}
}

function parseFlags(argv) {
	if (!(argv.length > 3 || argv.length === 3 && argv[2].startsWith('-'))) return {_: argv.slice(2)};
	if (missing('minimist')) shell('npm install minimist');
	return require('minimist')(argv.slice(2));
}

if (!process.argv[2] || /^[0-9]+$/.test(process.argv[2])) process.argv.splice(2, 0, 'multi');
switch (process.argv[2]) {
case 'multi':
case 'random':
	{
		const argv = parseFlags(process.argv);
		const options = Object.assign({totalGames: 100}, argv);
		options.totalGames = Number(argv._[1] || argv.num) || options.totalGames;
		if (argv.seed) options.prng = argv.seed.split(',').map(s => Number(s));
		// Run options.totalGames, exiting with the number of games with errors.
		(async () => process.exit(await new MultiRandomRunner(options).run()))();
	}
	break;
case 'exhaustive':
	{
		const argv = parseFlags(process.argv);
		let formats;
		if (argv.formats) {
			formats = argv.formats.split(',');
		} else if (argv.format) {
			formats = argv.format.split(',');
		} else {
			formats = ExhaustiveRunner.FORMATS;
		}
		let cycles = Number(argv._[1] || argv.cycles) || ExhaustiveRunner.DEFAULT_CYCLES;
		let forever = argv.forever;
		if (cycles < 0) {
			cycles = -cycles;
			forever = true;
		}
		const maxFailures = argv.maxFailures || argv.failures || (formats.length > 1 ? ExhaustiveRunner.MAX_FAILURES : 1);
		const prng = argv.seed && argv.seed.split(',').map(s => Number(s));
		const maxGames = argv.maxGames || argv.games;
		(async () => {
			let failures = 0;
			do {
				for (const format of formats) {
					failures += await new ExhaustiveRunner({
						format, cycles, prng, maxFailures, log: true, dual: argv.dual, maxGames,
					}).run();
					process.stdout.write('\n');
					if (failures >= maxFailures) break;
				}
			} while (forever); // eslint-disable-line no-unmodified-loop-condition
			process.exit(failures);
		})();
	}
	break;
default:
	throw new TypeError('Unknown command' + process.argv[2]);
}
