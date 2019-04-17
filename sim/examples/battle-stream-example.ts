/**
 * Battle Stream Example
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Example of how to create AIs battling against each other.
 * Run this using `node build && node .sim-dist/examples/battle-stream-example`.
 *
 * @license MIT
 * @author Guangcong Luo <guangcongluo@gmail.com>
 */

import {BattleStream, getPlayerStreams} from '../battle-stream';
import Dex = require('../dex');
import {RandomPlayerAI} from '../tools/random-player-ai';

/*********************************************************************
 * Run AI
 *********************************************************************/
// tslint:disable:no-floating-promises

const streams = getPlayerStreams(new BattleStream());

const spec = {
	formatid: "gen7customgame",
};
const p1spec = {
	name: "Bot 1",
	team: Dex.packTeam(Dex.generateTeam('gen7randombattle')),
};
const p2spec = {
	name: "Bot 2",
	team: Dex.packTeam(Dex.generateTeam('gen7randombattle')),
};

const p1 = new RandomPlayerAI(streams.p1);
const p2 = new RandomPlayerAI(streams.p2);

console.log("p1 is " + p1.constructor.name);
console.log("p2 is " + p2.constructor.name);

p1.start();
p2.start();

(async () => {
	let chunk;
	// tslint:disable-next-line no-conditional-assignment
	while ((chunk = await streams.omniscient.read())) {
		console.log(chunk);
	}
})();

streams.omniscient.write(`>start ${JSON.stringify(spec)}
>player p1 ${JSON.stringify(p1spec)}
>player p2 ${JSON.stringify(p2spec)}`);
