/**
 * Battle Stream Example
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Example of how to create AIs battling against each other.
 *
 * @license MIT
 * @author Guangcong Luo <guangcongluo@gmail.com>
 */

'use strict';

const BattleStreams = require('./battle-stream');
const Dex = require('./dex');

/*********************************************************************
 * Helper functions
 *********************************************************************/

/**
 * @param {number[]} array
 */
function randomElem(array) {
	return array[Math.floor(Math.random() * array.length)];
}

/*********************************************************************
 * Define AI
 *********************************************************************/

class RandomPlayerAI extends BattleStreams.BattlePlayer {
	/**
	 * @param {AnyObject} request
	 */
	receiveRequest(request) {
		if (request.wait) {
			// wait request
			// do nothing
		} else if (request.forceSwitch) {
			// switch request
			const pokemon = request.side.pokemon;
			let chosen = /** @type {number[]} */ ([]);
			const choices = request.forceSwitch.map((/** @type {AnyObject} */ mustSwitch) => {
				if (!mustSwitch) return `pass`;
				let canSwitch = [1, 2, 3, 4, 5, 6];
				canSwitch = canSwitch.filter(i => (
					// not active
					i > request.forceSwitch.length &&
					// not chosen for a simultaneous switch
					!chosen.includes(i) &&
					// not fainted
					!pokemon[i - 1].condition.endsWith(` fnt`)
				));
				const target = randomElem(canSwitch);
				chosen.push(target);
				return `switch ${target}`;
			});
			this.choose(choices.join(`, `));
		} else if (request.active) {
			// move request
			const choices = request.active.map((/** @type {AnyObject} */ pokemon, /** @type {number} */ i) => {
				if (request.side.pokemon[i].condition.endsWith(` fnt`)) return `pass`;
				let canMove = [1, 2, 3, 4].slice(0, pokemon.moves.length);
				canMove = canMove.filter(i => (
					// not disabled
					!pokemon.moves[i - 1].disabled
				));
				const move = randomElem(canMove);
				const targetable = request.active.length > 1 && ['normal', 'any'].includes(pokemon.moves[move - 1].target);
				const target = targetable ? ` ${1 + Math.floor(Math.random() * 2)}` : ``;
				return `move ${move}${target}`;
			});
			this.choose(choices.join(`, `));
		} else {
			// team preview?
			this.choose(`default`);
		}
	}
}

/*********************************************************************
 * Run AI
 *********************************************************************/

const streams = BattleStreams.getPlayerStreams(new BattleStreams.BattleStream());

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

// eslint-disable-next-line no-unused-vars
const p1 = new RandomPlayerAI(streams.p1);
// eslint-disable-next-line no-unused-vars
const p2 = new RandomPlayerAI(streams.p2);

(async () => {
	let chunk;
	while ((chunk = await streams.omniscient.read())) {
		console.log(chunk);
	}
})();

streams.omniscient.write(`>start ${JSON.stringify(spec)}
>player p1 ${JSON.stringify(p1spec)}
>player p2 ${JSON.stringify(p2spec)}`);
