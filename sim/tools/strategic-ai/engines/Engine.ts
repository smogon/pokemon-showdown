/**
 * Strategic-AI engine interface.
 *
 * An "engine" is a self-contained decision-maker: given a Showdown
 * `ChoiceRequest` plus the tracker / PRNG / per-mon state owned by the
 * host {@link PlayerAI}, it returns the showdown command
 * string (e.g. `"move 1"`, `"switch 3"`, `"team 1,2,3,4,5,6"`,
 * `"pass"`).
 *
 * Engines deliberately don't touch the network or the battle stream;
 * they're pure functions of their inputs (modulo PRNG draws). This keeps
 * them trivial to unit-test against a `BattleStream` snapshot, and lets
 * the search engines (one-ply, MCTS) embed the heuristic engine as a
 * rollout policy.
 *
 * The {@link DifficultyPolicy} module is responsible for picking which
 * engine handles a given `difficulty` level and for filling in the
 * noise/info-forgetting knobs on {@link EngineContext}.
 *
 * @license MIT
 */
import type { Battle } from "../../../battle";
import type { PRNG } from "../../../prng";
import type { ChoiceRequest } from "../../../side";
import type { BattleStateTracker } from "../state/BattleStateTracker";

/**
 * Per-host mutable state passed down to every engine call. The host
 * owns these maps so the engine can stay stateless across calls.
 */
export interface EngineContext {
	/** Battle state tracker, or `null` if we haven't seen any requests yet. */
	tracker: BattleStateTracker | null;
	/** PRNG for noise / sampling. */
	prng: PRNG;
	/** Difficulty 1..5 the user configured. Engines may key behaviour on this. */
	difficulty: number;
	/** Per-Pokemon last-move ids. */
	lastMoveByMon: Map<string, string>;
	/** Per-Pokemon disabled-move sets (Imprison/Disable). */
	disabledMovesByMon: Map<string, Set<string>>;
	/**
	 * Per-Pokemon "did the previous move attempt fail" flag, mirrored
	 * from the tracker by `PlayerAI` whenever a `|miss|`, `|-immune|`,
	 * `|-fail|`, or `|cant|` line is parsed against that mon (via
	 * `receiveLine` or `ingestLogLine`). Cleared the next time the
	 * same mon successfully uses a move. Used by power-doubling moves
	 * like Stomping Tantrum (2× BP when the user's previous move
	 * failed).
	 */
	lastMoveFailedByMon: Set<string>;
	/**
	 * Per-Pokemon "is trapped" override fed by error feedback (see
	 * `PlayerAI.receiveError`). The simulator only sets `request.active[i]
	 * .trapped = true` when it's been told the foe revealed a trapping
	 * effect (Mean Look, Block, etc.), but ability/item-based traps
	 * (Shadow Tag, Magnet Pull, Arena Trap) only surface on the *next*
	 * request after we tried to switch — leaving us looping a `switch N`
	 * command that gets rejected. Engines should treat any mon listed
	 * here as trapped regardless of `active.trapped`.
	 */
	trappedActiveByMon: Set<string>;
	/** Per-Pokemon last switch turn. */
	lastSwitchTurnByMon: Map<string, number>;
	/**
	 * Net "how often have we been switching lately" counter, pokerogue
	 * style: incremented each time the engine emits a voluntary switch,
	 * decremented (floored at 0) each time it commits to a move. The
	 * switch gate adds a margin penalty proportional to this counter so
	 * the AI can't ping-pong between two mons.
	 */
	switchCount: number;
	/**
	 * Cap on the per-step advance probability of the move-selection
	 * ladder (see {@link selectByScoreLadder}). 0 means always-greedy;
	 * 0.5 is the pokerogue default ("at most a coin flip to slip to
	 * the next-best move").
	 */
	ladderAdvanceCap: number;
	/**
	 * Extra matchup-score margin the best bench mon must clear over the
	 * active mon before a voluntary (non-emergency) switch fires. Lower
	 * = switch-happier. Scaled per difficulty by `DifficultyPolicy`.
	 */
	switchMargin: number;
	/**
	 * For low-difficulty engines: probability to "forget" any single
	 * piece of revealed info (a foe's revealed move, a known item, ...)
	 * during scoring. 0 disables forgetting.
	 */
	infoForgetting: number;
	/** Optional per-engine search budget in ms (used by OnePly / MCTS). */
	searchBudgetMs?: number;
	/**
	 * Probability the random engine picks a move over a switch when both
	 * are legal. Defaults to 1 (always move). Used by dev runners that
	 * want stress-testing pivots.
	 */
	randomMoveProb?: number;
	/**
	 * Probability the random engine attempts a Mega/Ultra/Dynamax/Tera
	 * when available. Defaults to 0.
	 */
	randomMegaProb?: number;
	/**
	 * Optional accessor for the live simulator {@link Battle} this AI
	 * is embedded in. When the host stream is a `BattleStream` the
	 * shell wires this up automatically, letting the MCTS tier fork
	 * the real battle (`Battle.toJSON` / `Battle.fromJSON`) for its
	 * rollouts instead of the tracker-only approximation.
	 */
	getBattle?: () => Battle | null;
}

/**
 * Public interface every engine implements.
 */
export interface Engine {
	/** Stable engine id (`"random"`, `"light"`, `"heuristic"`, ...). */
	readonly id: string;
	/**
	 * Make a decision for `request`. Must return a valid showdown
	 * command for the request kind (`"move N"`, `"switch N"`,
	 * `"team ..."`, `"pass"`, or `","`-joined for doubles). When the
	 * request is `wait`, return `""`.
	 */
	choose(request: ChoiceRequest, ctx: EngineContext): string;
}

/**
 * Pokerogue-style weighted pick ladder over a descending-sorted score
 * list. Starting from `startIndex`, we advance from candidate `i` to
 * `i + 1` with probability `min(advanceCap, ratio * advanceCap)` where
 * `ratio` is how close the next score is to the current one (1 for a
 * tie, smaller as the next candidate falls behind). The walk stops at
 * the first failed roll, a score sign flip, or the end of the list.
 *
 * This replaces the old epsilon-uniform noise: variety is now
 * *strength-preserving* — a close second is a frequent pick, a distant
 * third is rare, and a negative-scored move is never reached from a
 * positive run.
 *
 * @param sorted Candidates sorted by descending score.
 * @param startIndex Index to start the walk from.
 * @param advanceCap Maximum per-step advance probability in [0, 1].
 * @param prng PRNG used for the advance rolls.
 * @returns The selected candidate. `sorted` must be non-empty.
 */
export function selectByScoreLadder<T extends { score: number }>(
	sorted: T[],
	startIndex: number,
	advanceCap: number,
	prng: PRNG
): T {
	let idx = Math.max(0, Math.min(startIndex, sorted.length - 1));
	if (advanceCap <= 0) return sorted[idx];
	while (idx + 1 < sorted.length) {
		const cur = sorted[idx].score;
		const next = sorted[idx + 1].score;
		if (Math.sign(cur) !== Math.sign(next)) break;
		// Closeness ratio in (0, 1]: works for both positive and
		// negative same-sign runs because the list is sorted descending.
		const ratio = cur === next ? 1 : cur > 0 ? next / cur : cur / next;
		if (!(ratio > 0)) break;
		if (prng.random() >= Math.min(advanceCap, ratio * advanceCap)) break;
		idx++;
	}
	return sorted[idx];
}
