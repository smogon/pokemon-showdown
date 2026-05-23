/**
 * =========================================================
 * KONIVRER BATTLE OUTPUT LAYER
 * (REPLACES SHOWDOWN BATTLE-STREAM)
 * =========================================================
 *
 * Removes:
 * - real-time event streaming
 * - incremental mutation emission
 * - multi-subscriber live sync complexity
 *
 * Replaces with:
 * - deterministic transcript generation
 * - snapshot-based output model
 */

import { Action } from "./battle-actions";
import { ScheduledAction } from "./battle-queue";

export interface BattleTranscriptEntry {
	phase: string;
	description: string;
	payload?: unknown;
}

export interface BattleTranscript {
	entries: BattleTranscriptEntry[];
}

/**
 * =========================================================
 * MAIN OUTPUT GENERATOR
 * =========================================================
 *
 * Consumes deterministic execution results
 * Produces immutable battle log
 */

export function generateBattleTranscript(
	executedPlan: ScheduledAction[]
): BattleTranscript {
	const entries: BattleTranscriptEntry[] = [];

	for (const step of executedPlan) {
		entries.push({
			phase: step.phase,
			description: formatAction(step.action),
			payload: step.action,
		});
	}

	return { entries };
}

/**
 * =========================================================
 * FORMATTING LAYER (NO GAME LOGIC)
 * =========================================================
 */

function formatAction(action: Action): string {
	return `${action.user.id} performs ${action.type}`;
}

/**
 * =========================================================
 * OPTIONAL SNAPSHOT EXPORT
 * =========================================================
 *
 * Useful for replay systems or competitive validation
 */

export function exportBattleSnapshot(state: unknown): unknown {
	return JSON.parse(JSON.stringify(state));
}
