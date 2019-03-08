/**
 * Battle Stream Example
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Example random player AI.
 *
 * @license MIT
 * @author Guangcong Luo <guangcongluo@gmail.com>
 */

import {BattlePlayer} from '../battle-stream';

function randomElem(array: number[]) {
	return array[Math.floor(Math.random() * array.length)];
}

export class RandomPlayerAI extends BattlePlayer {
	receiveRequest(request: AnyObject) {
		if (request.wait) {
			// wait request
			// do nothing
		} else if (request.forceSwitch) {
			// switch request
			const pokemon = request.side.pokemon;
			const chosen: number[] = [];
			const choices = request.forceSwitch.map((mustSwitch: AnyObject) => {
				if (!mustSwitch) return `pass`;
				const canSwitch = [1, 2, 3, 4, 5, 6].filter(i => (
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
			const choices = request.active.map((pokemon: AnyObject, i: number) => {
				if (request.side.pokemon[i].condition.endsWith(` fnt`)) return `pass`;
				const canMove = [1, 2, 3, 4].slice(0, pokemon.moves.length).filter(j => (
					// not disabled
					!pokemon.moves[j - 1].disabled
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
