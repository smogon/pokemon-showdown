/**
 * Strategic-AI difficulty policy.
 *
 * Maps the user-visible `difficulty` integer (1..5) to a concrete
 * engine instance plus the per-engine knobs (move-ladder advance cap,
 * info-forgetting, switch margin). Centralising this here lets us tune
 * each tier without touching the engines themselves.
 *
 * Mapping (matches the project plan):
 *
 * | difficulty | engine        | ladder cap | info forgetting | switch margin |
 * |-----------:|:--------------|:-----------|:----------------|:--------------|
 * | 1          | RandomEngine  | 0.50       | 1.0             | 18            |
 * | 2          | LightEngine   | 0.50       | 0.50            | 14            |
 * | 3          | HeuristicE.   | 0.50       | 0.20            | 10            |
 * | 4          | OnePly        | 0.30       | 0.10            | 6             |
 * | 5          | MCTS          | 0.12       | 0.00            | 4             |
 *
 * The ladder cap bounds the per-step "slip to the next-best move"
 * probability ({@link selectByScoreLadder}); difficulty 5 is
 * near-greedy. The switch margin is how much better a bench mon's
 * matchup must score before a voluntary switch fires (boss tiers
 * switch on smaller edges, pokerogue-style).
 *
 * The `engine` option on `PlayerAIOptions` can force any tier to a
 * specific engine for tooling / testing.
 *
 * @license MIT
 */
import type { Engine, EngineContext } from "../engines/Engine";
import { HeuristicEngine } from "../engines/HeuristicEngine";
import { LightHeuristicEngine } from "../engines/LightHeuristicEngine";
import { MctsEngine } from "../engines/MctsEngine";
import { OnePlySearchEngine } from "../engines/OnePlySearchEngine";
import { RandomEngine } from "../engines/RandomEngine";

/** Engine names accepted by `DifficultyPolicy.create`. */
export type EngineName =
	| "auto" |
	"random" |
	"light" |
	"heuristic" |
	"oneply" |
	"mcts";

/** Per-tier knobs applied to {@link EngineContext}. */
export interface DifficultyKnobs {
	ladderAdvanceCap: number;
	infoForgetting: number;
	switchMargin: number;
	searchBudgetMs?: number;
}

/** Compute the ladder/info-forgetting/switch knobs for a difficulty level. */
export function knobsForDifficulty(difficulty: number): DifficultyKnobs {
	switch (difficulty) {
	case 1:
		return { ladderAdvanceCap: 0.50, infoForgetting: 1.0, switchMargin: 18 };
	case 2:
		return { ladderAdvanceCap: 0.50, infoForgetting: 0.50, switchMargin: 14 };
	case 3:
		return { ladderAdvanceCap: 0.50, infoForgetting: 0.20, switchMargin: 10 };
	case 4:
		return { ladderAdvanceCap: 0.30, infoForgetting: 0.10, switchMargin: 6, searchBudgetMs: 100 };
	case 5:
		// Fully greedy: no move-selection noise at max difficulty.
		return { ladderAdvanceCap: 0, infoForgetting: 0.0, switchMargin: 4, searchBudgetMs: 200 };
	default:
		return { ladderAdvanceCap: 0.50, infoForgetting: 0.20, switchMargin: 10 };
	}
}

/**
 * Produce a fresh engine for `difficulty`, optionally overridden by
 * the explicit `engine` name.
 */
export function pickEngine(
	difficulty: number,
	engine: EngineName = "auto"
): Engine {
	const resolved = engine === "auto" ? autoFor(difficulty) : engine;
	switch (resolved) {
	case "random":
		return new RandomEngine();
	case "light":
		return new LightHeuristicEngine();
	case "heuristic":
		return new HeuristicEngine();
	case "oneply":
		return new OnePlySearchEngine();
	case "mcts":
		return new MctsEngine();
	default:
		// Unknown engine string: behave like tier 3.
		return new HeuristicEngine();
	}
}

function autoFor(difficulty: number): Exclude<EngineName, "auto"> {
	if (difficulty <= 1) return "random";
	if (difficulty === 2) return "light";
	if (difficulty === 3) return "heuristic";
	if (difficulty === 4) return "oneply";
	return "mcts";
}

/**
 * Apply the per-tier knobs to an {@link EngineContext}. Idempotent.
 */
export function applyKnobs(ctx: EngineContext, difficulty: number): void {
	const knobs = knobsForDifficulty(difficulty);
	ctx.ladderAdvanceCap = knobs.ladderAdvanceCap;
	ctx.infoForgetting = knobs.infoForgetting;
	ctx.switchMargin = knobs.switchMargin;
	if (knobs.searchBudgetMs) ctx.searchBudgetMs = knobs.searchBudgetMs;
}
