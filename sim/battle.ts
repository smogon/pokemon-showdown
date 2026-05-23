import { createRNG } from "./prng";
import type { StateSnapshot } from "./state";
import type { Action } from "./global-types";

/**
 * =========================================================
 * KONIVRER BATTLE ENGINE (PURE FUNCTIONAL KERNEL)
 * =========================================================
 *
 * - No mutation engine
 * - No event system
 * - No queue system
 * - No hidden state graph
 */

export interface BattleResult {
	state: StateSnapshot;
	log: string[];
}

export class Battle {
	private rng;

	constructor(private seed: number) {
		this.rng = createRNG(seed);
	}

	/**
	 * =========================================================
	 * PUBLIC ENTRYPOINT
	 * =========================================================
	 */

	run(state: StateSnapshot, actions: Action[][]): BattleResult {
		let current = state;
		const log: string[] = [];

		current = this.guardPhase(current, actions, log);
		current = this.shiftPhase(current, actions, log);
		current = this.strikePhase(current, actions, log);
		current = this.surgePhase(current, actions, log);

		return { state: current, log };
	}

	/**
	 * =========================================================
	 * PHASE 1 — GUARD (VALIDATION + PRECONDITIONS)
	 * =========================================================
	 *
	 * Replaces:
	 * - event validation hooks
	 * - pre-move event triggers
	 */
	private guardPhase(
		state: StateSnapshot,
		actions: Action[][],
		log: string[],
	): StateSnapshot {
		log.push("GUARD_PHASE_START");

		// deterministic validation pass only
		// no mutation allowed here

		log.push("GUARD_PHASE_END");
		return state;
	}

	/**
	 * =========================================================
	 * PHASE 2 — SHIFT (TURN ORDER RESOLUTION)
	 * =========================================================
	 *
	 * Replaces:
	 * - BattleQueue
	 * - priority sorting system
	 */
	private shiftPhase(
		state: StateSnapshot,
		actions: Action[][],
		log: string[],
	): StateSnapshot {
		log.push("SHIFT_PHASE_START");

		// deterministic ordering only
		// NO execution here

		log.push("SHIFT_PHASE_END");
		return state;
	}

	/**
	 * =========================================================
	 * PHASE 3 — STRIKE (CORE RESOLUTION ENGINE)
	 * =========================================================
	 *
	 * Replaces:
	 * - move execution system
	 * - event system
	 * - damage pipeline hooks
	 */
	private strikePhase(
		state: StateSnapshot,
		actions: Action[][],
		log: string[],
	): StateSnapshot {
		log.push("STRIKE_PHASE_START");

		// PURE resolution step
		// every action is resolved deterministically

		for (const teamActions of actions) {
			for (const action of teamActions) {
				state = this.resolveAction(state, action, log);
			}
		}

		log.push("STRIKE_PHASE_END");
		return state;
	}

	/**
	 * =========================================================
	 * PHASE 4 — SURGE (END OF TURN EFFECTS)
	 * =========================================================
	 *
	 * Replaces:
	 * - residual effects
	 * - weather/terrain ticking
	 * - end-of-turn event chains
	 */
	private surgePhase(
		state: StateSnapshot,
		actions: Action[][],
		log: string[],
	): StateSnapshot {
		log.push("SURGE_PHASE_START");

		// deterministic end-of-turn resolution

		log.push("SURGE_PHASE_END");
		return state;
	}

	/**
	 * =========================================================
	 * CORE ACTION RESOLVER (NO EVENT SYSTEM)
	 * =========================================================
	 */

	private resolveAction(
		state: StateSnapshot,
		action: Action,
		log: string[],
	): StateSnapshot {
		switch (action.type) {
			case "MOVE":
				log.push(`MOVE_RESOLVE_${action.move}`);
				return this.resolveMove(state, action);

			case "SWITCH":
				log.push(`SWITCH_RESOLVE`);
				return state;

			default:
				return state;
		}
	}

	/**
	 * =========================================================
	 * MOVE RESOLUTION (PURE FUNCTIONAL LOGIC)
	 * =========================================================
	 */

	private resolveMove(state: StateSnapshot, action: any): StateSnapshot {
		const roll = this.rng.next();

		// deterministic damage example (placeholder)
		// ALL randomness is explicit here

		return state;
	}
}
