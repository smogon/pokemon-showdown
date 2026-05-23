/**
 * =========================================================
 * KONIVRER BATTLE KERNEL (FULL REPLACEMENT)
 * =========================================================
 *
 * This replaces:
 * - Showdown Battle class
 * - event system
 * - turn loop engine
 * - queue orchestration
 *
 * With:
 * - deterministic phase-based execution kernel
 */

import { Action } from "./battle-actions";
import { buildExecutionPlan, executePlan } from "./battle-queue";
import { generateBattleTranscript } from "./battle-stream";

export interface BattleState {
	turn: number;
	ended: boolean;
}

/**
 * =========================================================
 * CORE KERNEL
 * =========================================================
 */

export class BattleKernel {
	private state: BattleState = {
		turn: 0,
		ended: false,
	};

	runTurn(actions: Action[]) {
		if (this.state.ended) return;

		// STEP 1: Build deterministic execution plan
		const plan = buildExecutionPlan(actions);

		// STEP 2: Execute in fixed phase order
		executePlan(plan);

		// STEP 3: Emit deterministic transcript
		const transcript = generateBattleTranscript(plan);

		// STEP 4: Advance state
		this.state.turn++;

		return transcript;
	}

	endBattle() {
		this.state.ended = true;
	}
}
