/**
 * Example random player AI.
 *
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

import {ObjectReadWriteStream} from '../../lib/streams';
import {BattlePlayer} from '../battle-stream';
import {PRNG, PRNGSeed} from '../prng';

export class RandomPlayerAI extends BattlePlayer {
	readonly move: number;
	readonly mega: number;
	readonly prng: PRNG;

	constructor(
		playerStream: ObjectReadWriteStream<string>,
		options: {move?: number, mega?: number, seed?: PRNG | PRNGSeed | null } = {},
		debug: boolean = false
	) {
		super(playerStream, debug);
		this.move = options.move || 1.0;
		this.mega = options.mega || 0;
		this.prng = options.seed && !Array.isArray(options.seed) ? options.seed : new PRNG(options.seed);
	}

	receiveError(error: Error) {
		if (!error.message.startsWith('[Invalid choice]')) throw error;
		// If we made an invalid choice we just let the simulator auto-choose for us. This can happen
		// if we were disabled (Imprison) or trapped (Arena Trap / Magnet Pull / Shadow Tag) and it
		// wasn't revealed to us until we made our choice. We could add extra logic to redo the decision,
		// removing the invalid choice from our set of options, but given how niche this edge case is
		// its not worth dramatically complicating the code to handle it.
		this.choose(`default`);
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

				if (!canSwitch.length) return `pass`;
				const target = this.prng.sample(canSwitch);
				chosen.push(target);
				return `switch ${target}`;
			});

			this.choose(choices.join(`, `));
		} else if (request.active) {
			// move request
			let [canMegaEvo, canUltraBurst, canZMove] = [true, true, true];
			const pokemon = request.side.pokemon;
			const chosen: number[] = [];
			const choices = request.active.map((active: AnyObject, i: number) => {
				if (pokemon[i].condition.endsWith(` fnt`)) return `pass`;

				canMegaEvo = canMegaEvo && active.canMegaEvo;
				canUltraBurst = canUltraBurst && active.canUltraBurst;
				canZMove = canZMove && !!active.canZMove;

				let canMove = [1, 2, 3, 4].slice(0, active.moves.length).filter(j => (
					// not disabled
					!active.moves[j - 1].disabled &&
					// has pp
					active.moves[j - 1].pp !== 0
				)).map(j => ({
					slot: j,
					move: active.moves[j - 1].move,
					target: active.moves[j  - 1].target,
					zMove: false,
				}));
				if (canZMove) {
					canMove.push(...[1, 2, 3, 4].slice(0, active.canZMove.length)
						.filter(j => active.canZMove[j - 1])
						.map(j => ({
							slot: j,
							move: active.canZMove[j - 1].move,
							target: active.canZMove[j - 1].target,
							zMove: true,
						})));
				}

				// Filter out adjacentAlly moves if we have no allies left.
				const hasAlly = !pokemon[i ^ 1].condition.endsWith(` fnt`);
				canMove = canMove.filter(m => m.target !== `adjacentAlly` || hasAlly);

				const moves = canMove.map(m => {
					let move = `move ${m.slot}`;
					// NOTE: We don't generate all possible targeting combinations.
					if (request.active.length > 1) {
						if ([`normal`, `any`, `adjacentFoe`].includes(m.target)) {
							move += ` ${1 + Math.floor(this.prng.next() * 2)}`;
						}
						if (m.target === `adjacentAlly`) {
							move += ` -${(i ^ 1) + 1}`;
						}
						if (m.target === `adjacentAllyOrSelf`) {
							if (hasAlly) {
								move += ` -${1 + Math.floor(this.prng.next() * 2)}`;
							} else {
								move += ` -${i + 1}`;
							}
						}
					}
					if (m.zMove) move += ` zmove`;
					return move;
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

				if (switches.length && (!moves.length || this.prng.next() > this.move)) {
					const target = this.prng.sample(switches);
					chosen.push(target);
					return `switch ${target}`;
				} else if (moves.length) {
					const move = this.prng.sample(moves);
					if (move.endsWith(` zmove`)) {
						canZMove = false;
						return move;
					} else if ((canMegaEvo || canUltraBurst) && this.prng.next() < this.mega) {
						if (canMegaEvo) {
							canMegaEvo = false;
							return `${move} mega`;
						} else {
							canUltraBurst = false;
							return `${move} ultra`;
						}
					} else {
						return move;
					}
				} else {
					// Just give up if we couldn't come up with any moves or switches.
					return `default`;
				}
			});
			this.choose(choices.join(`, `));
		} else {
			// team preview?
			this.choose(`default`);
		}
	}
}
