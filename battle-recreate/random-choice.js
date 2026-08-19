'use strict';

/**
 * Pure request -> choice-string logic, adapted from
 * sim/tools/random-player-ai.ts's RandomPlayerAI.receiveRequest, but
 * operating directly on a `ChoiceRequest` + `PRNG` rather than being wired
 * up as a BattlePlayer over a stream. Used to drive "random legal actions"
 * directly against a `Battle` instance via `battle.choose(sideId, input)`.
 */

function range(start, end, step = 1) {
	if (end === undefined) {
		end = start;
		start = 0;
	}
	const result = [];
	for (; start <= end; start += step) result.push(start);
	return result;
}

function pickChoice(request, prng) {
	if (request.wait) return '';

	if (request.teamPreview) return 'default';

	if (request.forceSwitch) {
		const pokemon = request.side.pokemon;
		const chosen = [];
		const choices = request.forceSwitch.map((mustSwitch, i) => {
			if (!mustSwitch) return 'pass';
			const canSwitch = range(1, 6).filter(j => (
				pokemon[j - 1] &&
				(j > request.forceSwitch.length || pokemon[i].reviving) &&
				!chosen.includes(j) &&
				!pokemon[j - 1].condition.endsWith(' fnt') === !pokemon[i].reviving
			));
			if (!canSwitch.length) return 'pass';
			const target = prng.sample(canSwitch);
			chosen.push(target);
			return `switch ${target}`;
		});
		return choices.join(', ');
	}

	if (request.active) {
		let [canMegaEvo, canUltraBurst, canZMove, canDynamax, canTerastallize] = [true, true, true, true, true];
		const pokemon = request.side.pokemon;
		const chosen = [];
		const choices = request.active.map((active, i) => {
			if (pokemon[i].condition.endsWith(' fnt') || pokemon[i].commanding) return 'pass';

			canMegaEvo = canMegaEvo && active.canMegaEvo;
			canUltraBurst = canUltraBurst && active.canUltraBurst;
			canZMove = canZMove && !!active.canZMove;
			canDynamax = canDynamax && !!active.canDynamax;
			canTerastallize = canTerastallize && !!active.canTerastallize;

			const change = (canMegaEvo || canUltraBurst || canDynamax) && prng.random() < 0;
			const useMaxMoves = (!active.canDynamax && active.maxMoves) || (change && canDynamax);
			const possibleMoves = useMaxMoves ? active.maxMoves.maxMoves : active.moves;

			let canMove = range(1, possibleMoves.length)
				.filter(j => !possibleMoves[j - 1].disabled)
				.map(j => ({
					slot: j,
					move: possibleMoves[j - 1].move,
					target: possibleMoves[j - 1].target,
					zMove: false,
				}));
			if (canZMove) {
				canMove.push(...range(1, active.canZMove.length)
					.filter(j => active.canZMove[j - 1])
					.map(j => ({
						slot: j,
						move: active.canZMove[j - 1].move,
						target: active.canZMove[j - 1].target,
						zMove: true,
					})));
			}

			const hasAlly = pokemon.length > 1 && !pokemon[i ^ 1].condition.endsWith(' fnt');
			const filtered = canMove.filter(m => m.target !== 'adjacentAlly' || hasAlly);
			canMove = filtered.length ? filtered : canMove;

			const moves = canMove.map(m => {
				let move = `move ${m.slot}`;
				if (request.active.length > 1) {
					if (['normal', 'any', 'adjacentFoe'].includes(m.target)) {
						move += ` ${1 + prng.random(2)}`;
					}
					if (m.target === 'adjacentAlly') {
						move += ` -${(i ^ 1) + 1}`;
					}
					if (m.target === 'adjacentAllyOrSelf') {
						move += hasAlly ? ` -${1 + prng.random(2)}` : ` -${i + 1}`;
					}
				}
				if (m.zMove) move += ' zmove';
				return { choice: move, move: m };
			});

			const canSwitch = range(1, 6).filter(j => (
				pokemon[j - 1] &&
				!pokemon[j - 1].active &&
				!chosen.includes(j) &&
				!pokemon[j - 1].condition.endsWith(' fnt')
			));
			const switches = active.trapped ? [] : canSwitch;

			// Bias toward moves (10% switch chance when available) so games
			// don't stall out on repeated switching.
			if (switches.length && (!moves.length || prng.random() > 0.9)) {
				const target = prng.sample(canSwitch);
				chosen.push(target);
				return `switch ${target}`;
			} else if (moves.length) {
				const chosenMove = prng.sample(moves);
				if (chosenMove.choice.endsWith(' zmove')) {
					canZMove = false;
					return chosenMove.choice;
				} else if (canTerastallize && prng.random() < 0.3) {
					canTerastallize = false;
					return `${chosenMove.choice} terastallize`;
				}
				return chosenMove.choice;
			} else {
				throw new Error(
					`Unable to make a choice for slot ${i}: request=${JSON.stringify(active)}`
				);
			}
		});
		return choices.join(', ');
	}

	throw new Error(`Unrecognized request shape: ${JSON.stringify(request)}`);
}

module.exports = { pickChoice };
