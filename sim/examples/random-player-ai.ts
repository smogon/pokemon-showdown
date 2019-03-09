/**
 * Battle Stream Example
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Example random player AI.
 *
 * @license MIT
 * @author Guangcong Luo <guangcongluo@gmail.com>
 */

import {ObjectReadWriteStream} from '../../lib/streams';
import {BattlePlayer} from '../battle-stream';

function randomElem<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

export class RandomPlayerAI extends BattlePlayer {
	readonly move: number;
	readonly mega: number;
	readonly zmove: number;

	constructor(
		playerStream: ObjectReadWriteStream,
		options: {move?: number, mega?: number, zmove?: number} = {},
		debug: boolean = false
	) {
		super(playerStream, debug);
		this.move = options.move || 1.0;
		this.mega = options.mega || 0;
		this.zmove = options.zmove || 0;
	}

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
			let canMegaEvo = true;
			const pokemon = request.side.pokemon;
			const chosen: number[] = [];
			const choices = request.active.map((active: AnyObject, i: number) => {
				if (pokemon[i].condition.endsWith(` fnt`)) return `pass`;

				canMegaEvo = canMegaEvo && active.canMegaEvo;

				const canMove = [1, 2, 3, 4].slice(0, active.moves.length).filter(j => (
					// not disabled
					!active.moves[j - 1].disabled
				));

				// TODO zmove?
				const moves = canMove.map(j => {
					// NOTE: We don't generate all posible targeting combinations.
					if (request.active.length > 1) {
						const target = active.moves[j - 1].target;
						if (['normal', 'any'].includes(target)) {
							return `move ${j} ${1 + Math.floor(Math.random() * 2)}`;
						}
						// TODO targetting adjacentAlly etc
					}
					return `move ${j}`;
				});

				const canSwitch = [1, 2, 3, 4, 5, 6].filter(j => (
					// not active
					!pokemon[j - 1].active &&
					// not chosen for a simultaneous switch
					!chosen.includes(j) &&
					// not fainted
					!pokemon[j - 1].condition.endsWith(` fnt`)
				));
				const switches = (active.trapped || active.maybeTrapped) ? [] : canSwitch;

				if (Math.random() > this.move && switches.length) {
					const target = randomElem(switches);
					chosen.push(target);
					return `switch ${target}`;
				} else {
					let move = randomElem(moves);
					if (Math.random() < this.mega && canMegaEvo) {
						canMegaEvo = false;
						return `${move} mega`;
					} else {
						return move;
					}
				}
			});
			this.choose(choices.join(`, `));
		} else {
			// team preview?
			this.choose(`default`);
		}
	}
}
