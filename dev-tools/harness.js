/**
 * Random Simulation harness for testing and benchmarking purposes.
 * NOTE: Run with `node --random-seed=<SEED> harness` to get repeatable results.
 *
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

'use strict';

const child_process = require('child_process');

function shell(cmd) {
	child_process.execSync(cmd, {stdio: 'inherit', cwd: __dirname});
}

// `require('../build')` is not safe because `replace` is async.
shell('node ../build');

try {
	require.resolve('minimist');
	//require.resolve('trakr');
} catch (e) {
	if (e.code !== 'MODULE_NOT_FOUND') throw e;
	console.log('Installing dependencies...');
	shell('npm install minimist');
	//child_process.execSync('npm install minimist trakr', {stdio: 'inherit', cwd: __dirname});
}

const argv = require('minimist')(process.argv.slice(2));
//const trakr = require('trakr');

const BattleStreams = require('../.sim-dist/battle-stream');
const Dex = require('../.sim-dist/dex');
const RandomPlayerAI = require('../.sim-dist/examples/random-player-ai').RandomPlayerAI;
const PRNG = new (require('../.sim-dist/prng').PRNG)();

const NUM_GAMES = Number(argv._[0] || argv.num) || 100;
const LOGS = !!argv.logs;
const SILENT = !LOGS || !!argv.silent;
const ALL = !!argv.all;
const ASYNC = !!argv.async;
const FORMAT = argv.format;

const AI_OPTIONS = {move: 0.7, mega: 0.3, zmove: 0.3};

const FORMATS = [
	'gen7randombattle', 'gen7randomdoublesbattle',
	'gen7battlefactory', 'gen6randombattle', 'gen6battlefactory',
	'gen5randombattle', 'gen4randombattle', 'gen3randombattle',
	'gen2randombattle', 'gen1randombattle',
];

let formatIndex = 0;
let numGames = 0;
function getNextFormat() {
	if (FORMAT) return (numGames++ < NUM_GAMES) && FORMAT;
	if (formatIndex > FORMATS.length) {
		return false;
	} else if (numGames++ < NUM_GAMES) {
		return ALL ? FORMATS[formatIndex] : PRNG.sample(FORMATS);
	} else if (!ALL) {
		return false;
	} else {
		numGames = 1;
		formatIndex++;
		return FORMATS[formatIndex];
	}
}

function generateTeam(format) {
	return Dex.packTeam(Dex.generateTeam(format));
}

async function runGame(format) {
	const streams = BattleStreams.getPlayerStreams(new BattleStreams.BattleStream());
	const spec = {formatid: format};
	const p1spec = {name: "Bot 1", team: generateTeam(format)};
	const p2spec = {name: "Bot 2", team: generateTeam(format)};

	/* eslint-disable no-unused-vars */
	const p1 = new RandomPlayerAI(streams.p1, AI_OPTIONS);
	const p2 = new RandomPlayerAI(streams.p2, AI_OPTIONS);
	/* eslint-enable no-unused-vars */

	streams.omniscient.write(`>start ${JSON.stringify(spec)}
>player p1 ${JSON.stringify(p1spec)}
>player p2 ${JSON.stringify(p2spec)}`);

	let chunk;
	while ((chunk = await streams.omniscient.read())) {
		if (SILENT || !LOGS) continue;
		// Logged to error for easier redirection.
		console.error(chunk);
	}
}

(async () => {
	let games = [];

	let format, lastFormat;
	while ((format = getNextFormat())) {
		if (ALL && lastFormat && format !== lastFormat) {
			await Promise.all(games);
			if (!SILENT) {
				// TODO timing
			}
			games = [];
		}

		const game = runGame(format);
		if (!ASYNC) await game;
		games.push(game);
		lastFormat = format;
	}

	await Promise.all(games);

	if (!SILENT) {
		// TODO timing
	}
})();

