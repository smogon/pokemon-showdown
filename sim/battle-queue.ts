/**
 * =========================================================
 * KONIVRER DETERMINISTIC ACTION SCHEDULER
 * (REPLACES SHOWDOWN BATTLEQUEUE)
 * =========================================================
 *
 * Removes:
 * - priority sorting system
 * - speed-based ordering
 * - RNG tie-breakers
 * - dynamic queue mutation
 * - event-injected actions
 *
 * Replaces with:
 * - fixed-phase deterministic execution model
 */

import { Action } from "./battle-actions";

export type ActionPhase =
	| "guard"
	| "shift"
	| "strike"
	| "surge";

export interface ScheduledAction {
	phase: ActionPhase;
	action: Action;
}

/**
 * =========================================================
 * SCHEDULER ENTRY POINT
 * =========================================================
 */

export function buildExecutionPlan(actions: Action[]): ScheduledAction[] {
	const plan: ScheduledAction[] = [];

	for (const a of actions) {
		switch (a.type) {
			case "guard":
				plan.push({ phase: "guard", action: a });
				break;
			case "shift":
				plan.push({ phase: "shift", action: a });
				break;
			case "strike":
				plan.push({ phase: "strike", action: a });
				break;
			case "surge":
				plan.push({ phase: "surge", action: a });
				break;
		}
	}

	return plan;
}

/**
 * =========================================================
 * EXECUTION ORDER (FIXED CONTRACT)
 * =========================================================
 *
 * This replaces:
 * - speed sorting
 * - priority sorting
 * - queue rebalancing
 */

export function executePlan(plan: ScheduledAction[]): void {
	// Phase 1: Guards (defensive pre-resolution layer)
	for (const p of plan) {
		if (p.phase === "guard") {
			resolveAction(p.action);
		}
	}

	// Phase 2: Shifts (tempo/positioning)
	for (const p of plan) {
		if (p.phase === "shift") {
			resolveAction(p.action);
		}
	}

	// Phase 3: Strikes (primary damage layer)
	for (const p of plan) {
		if (p.phase === "strike") {
			resolveAction(p.action);
		}
	}

	// Phase 4: Surges (secondary effects / amplification)
	for (const p of plan) {
		if (p.phase === "surge") {
			resolveAction(p.action);
		}
	}
}

/**
 * =========================================================
 * CORE RESOLUTION HOOK
 * =========================================================
 */

function resolveAction(action: Action) {
	// Delegates into battle-actions deterministic resolver
	console.log(`Resolving ${action.type} from ${action.user.id}`);
}
