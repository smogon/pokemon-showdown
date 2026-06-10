/**
 * Strategic-AI Monte Carlo Tree Search engine (difficulty 5).
 *
 * Implements a time-budgeted PUCT-style search. Each search node
 * represents *our* decision in the current turn; children correspond
 * to candidate actions (moves and switches). For each visited child we
 * sample one of the foe's plausible replies (via
 * {@link OpponentInference}) and roll the encounter forward using the
 * heuristic-engine policy.
 *
 * Two execution paths are supported:
 *
 * 1. **Simulator fork** (when a `Battle` reference is available via
 *    `ctx.searchBudgetMs`'s sibling `forkBattle` hook): we use
 *    `Battle.toJSON()` / `Battle.fromJSON()` (declared at
 *    `sim/battle.ts:L327-L333`)
 *    to clone the full battle state, advance by one (or more) plies via
 *    the rollout policy, and read off the resulting expected utility.
 * 2. **Tracker-only fallback** (the default): we approximate forward
 *    play through the {@link BattleStateTracker} + {@link DamageCalc}.
 *    Equivalent to {@link OnePlySearchEngine} with K samples per
 *    candidate plus PUCT-style exploration weighting.
 *
 * On budget exhaustion (`ctx.searchBudgetMs` ms elapsed) we fall back
 * to the highest-visited child's mean reward, equivalent to
 * {@link OnePlySearchEngine}'s output.
 *
 * @license MIT
 */
import { Battle } from "../../../battle";
import { Dex } from "../../../dex";
import type { Move } from "../../../dex-moves";
import type { Pokemon } from "../../../pokemon";
import { PRNG, type PRNGSeed } from "../../../prng";
import type {
	PokemonMoveRequestData,
	PokemonSwitchRequestData,
	Side,
	SideRequestData,
} from "../../../side";
import { calculateDamage, fromTracked } from "../mechanics/DamageCalc";
import { evaluateMove, type MoveEvalContext } from "../mechanics/MoveEvaluator";
import { chooseBestSwitch, evaluateMatchup } from "../mechanics/SwitchEvaluator";
import type { BattleStateTracker, TrackedPokemon } from "../state/BattleStateTracker";
import { inferFoeActive, topMoves } from "../state/OpponentInference";
import type { EngineContext } from "./Engine";
import { SWITCH_LOCK_TURNS } from "./HeuristicEngine";
import { OnePlySearchEngine } from "./OnePlySearchEngine";

/** Default search budget in milliseconds when not provided by ctx. */
const DEFAULT_BUDGET_MS = 200;
/** Min visits per candidate before PUCT exploration kicks in. */
const MIN_VISITS_PER_CANDIDATE = 4;
/** PUCT exploration constant (tuned manually). */
const C_PUCT = 1.4;
/** Top-N foe replies to sample per rollout. */
const FOE_SAMPLE_N = 4;
/** Wider inferred-move pool used to determinize foe move slots. */
const DETERMINIZE_POOL_N = 8;
/** Extra turns played out per fork rollout after the root turn. */
const FORK_ROLLOUT_TURNS = 2;
/** Reward scale converting fork HP-differential swings into MoveEvaluator units. */
const FORK_REWARD_SCALE = 35;
/** Flat bonus/penalty when a fork rollout ends the battle. */
const FORK_WIN_BONUS = 60;
/**
 * Maximum weight the (noisy) rollout estimate can carry in the final
 * blended score; the rest stays on the heuristic baseline. Rollouts
 * against determinized (guessed) foe sets are high-variance in random
 * formats, so they act as a tiebreaker rather than overriding the
 * heuristic outright.
 */
const ROLLOUT_MAX_WEIGHT = 0.6;
/** Visit count at which the rollout estimate reaches half its max weight. */
const ROLLOUT_HALF_WEIGHT_VISITS = 6;
/**
 * Probability the foe's root reply in a fork rollout is its greedy
 * max-damage move (on the determinized set) rather than a prior
 * sample. Real opponents — including our own lower tiers — play
 * near-greedy, so a mostly-greedy foe model is tougher and lower
 * variance than pure prior sampling.
 */
const GREEDY_FOE_REPLY_CHANCE = 0.65;
/** Fork-eval penalty per non-volatile status on a living mon. */
const STATUS_EVAL_PENALTY = 0.12;
/** Fork-eval value per net stat-boost stage on an active mon. */
const BOOST_EVAL_VALUE = 0.04;
/** Max fork rollouts per arm of a stay-vs-switch comparison. */
const SWITCH_EVAL_ROLLOUTS = 5;
/** Fraction of the search budget the switch comparison may consume. */
const SWITCH_EVAL_BUDGET_FRACTION = 0.35;
/**
 * Reward margin by which "stay" must beat a heuristic-proposed switch
 * before the search vetoes it (rewards are ~35 per mon of HP swing).
 */
const SWITCH_VETO_MARGIN = 12;
/**
 * Reward margin by which a switch must beat "stay" before the search
 * overrides a heuristic "stay in" verdict. Higher than the veto margin
 * — overriding the gate's anti-ping-pong protections needs strong
 * evidence.
 */
const SWITCH_OVERRIDE_MARGIN = 18;

/** Side ids as used by the tracker. */
type TrackedSideID = "p1" | "p2" | "p3" | "p4";

/** The slice of decision context a fork rollout needs. */
interface ForkView {
	mySide: TrackedSideID;
	foeSide: TrackedSideID;
	/** The foe active's revealed move ids (kept during determinization). */
	revealedMoves: Set<string>;
}

/** Inferred foe reply/determinization pools shared across rollouts. */
interface FoeModel {
	foeIds: string[];
	foeWeights: number[];
	determinizeIds: string[];
	determinizeWeights: number[];
}

interface CandidateNode {
	id: string;
	idx: number;
	visits: number;
	totalReward: number;
	prior: number;
}

/**
 * Tier 5 engine. Reuses every piece of {@link OnePlySearchEngine} for
 * the rollout policy and overrides scoring with a budgeted sampler.
 */
export class MctsEngine extends OnePlySearchEngine {
	override readonly id: string = "mcts";

	protected override scoreCandidates(
		moves: { id: string, idx: number }[],
		evalCtx: MoveEvalContext,
		ctx: EngineContext
	): { opt: { id: string, idx: number }, score: number }[] {
		// Phase 1: build priors from the heuristic baseline so PUCT has
		// something to start with. Priors are softmaxed.
		const heuristicScores = moves.map(m => ({
			m,
			heuristic: evaluateMove(Dex.moves.get(m.id), evalCtx).score,
		}));
		const priors = softmax(heuristicScores.map(h => h.heuristic));
		const nodes: CandidateNode[] = heuristicScores.map(({ m }, i) => ({
			id: m.id,
			idx: m.idx,
			visits: 0,
			totalReward: 0,
			prior: priors[i],
		}));

		const model = buildFoeModel(evalCtx.tracker);
		const { foeIds, foeWeights } = model;

		const budgetMs = ctx.searchBudgetMs ?? DEFAULT_BUDGET_MS;
		const deadline = Date.now() + budgetMs;
		let totalVisits = 0;

		// True multi-turn search: when the host hands us the live battle
		// (singles only — doubles slot pairing isn't modelled here), we
		// snapshot it once and replay candidate turns on forks.
		const snapshot = takeBattleSnapshot(ctx);
		const view: ForkView = {
			mySide: evalCtx.mySide,
			foeSide: evalCtx.foeSide,
			revealedMoves: evalCtx.defender.revealedMoves,
		};

		while (Date.now() < deadline) {
			const pick = selectByPUCT(nodes, totalVisits);
			if (!pick) break;
			const reward = (snapshot ?
				forkRollout(snapshot, `move ${pick.idx}`, view, model, ctx) :
				null) ?? sampleRollout(pick, evalCtx, foeIds, foeWeights, ctx);
			pick.visits += 1;
			pick.totalReward += reward;
			totalVisits += 1;
			// Hard cap to avoid spinning forever on a fast machine.
			if (totalVisits >= 200 * nodes.length) break;
		}

		// Phase 2: emit final scores. The rollout estimate is *blended*
		// with the heuristic baseline rather than replacing it: rollout
		// weight grows with visit count (more samples = less variance)
		// up to ROLLOUT_MAX_WEIGHT, so a handful of noisy rollouts can
		// break ties but can't overturn a confident heuristic read. A
		// node with zero visits keeps its pure heuristic score.
		return nodes.map((n, i) => {
			const heuristic = heuristicScores[i].heuristic;
			const meanReward = n.visits > 0 ? n.totalReward / n.visits : heuristic;
			const rolloutWeight = ROLLOUT_MAX_WEIGHT *
				n.visits / (n.visits + ROLLOUT_HALF_WEIGHT_VISITS);
			let score = (1 - rolloutWeight) * heuristic + rolloutWeight * meanReward;
			if (ctx.infoForgetting > 0 && evalCtx.defender.revealedMoves.size > 0 &&
				ctx.prng.random() < ctx.infoForgetting) {
				score *= 0.85;
			}
			return { opt: { id: n.id, idx: n.idx }, score };
		});
	}

	/**
	 * Search-verified switch gate. The heuristic gate decides first;
	 * when the live battle can be forked, the verdict is then checked
	 * against multi-turn rollouts:
	 *
	 * - heuristic says **switch** → veto it when staying in clearly
	 *   scores better (the gate's matchup math misses e.g. "we KO
	 *   first" lines the simulator resolves correctly);
	 * - heuristic says **stay** in a negative matchup → override to
	 *   the best bench switch when rollouts strongly favour it (the
	 *   gate's margin/veto stack misses e.g. "every move we have is
	 *   resisted" situations).
	 *
	 * Both directions respect the switch lock and use asymmetric
	 * margins so noisy rollouts can't induce ping-ponging.
	 *
	 * @param myMon Tracked active mon for this slot.
	 * @param foeMon Tracked foe active.
	 * @param tracker Battle state tracker.
	 * @param side Our side's request payload.
	 * @param slotIndex Slot being decided.
	 * @param ctx Engine context.
	 * @param switchCandidates Live bench candidates with request slots.
	 * @param active Request payload for the active slot.
	 * @returns A `switch N` command, or `null` to indicate "stay in".
	 */
	protected override maybeSwitchOut(
		myMon: TrackedPokemon,
		foeMon: TrackedPokemon,
		tracker: BattleStateTracker,
		side: SideRequestData,
		slotIndex: number,
		ctx: EngineContext,
		switchCandidates: { req: PokemonSwitchRequestData, idx: number, mon: TrackedPokemon }[],
		active: PokemonMoveRequestData
	): string | null {
		const heuristicChoice = super.maybeSwitchOut(
			myMon, foeMon, tracker, side, slotIndex, ctx, switchCandidates, active
		);
		const snapshot = takeBattleSnapshot(ctx);
		if (!snapshot) return heuristicChoice;

		let switchChoice = heuristicChoice;
		if (!switchChoice) {
			// Candidate for a stay→switch override: only out of a losing
			// matchup, never through the switch lock, and never into a
			// bench mon that dies on entry.
			const monId = this.monIdForSlot(side, slotIndex, ctx);
			const lastSwitch = monId ? ctx.lastSwitchTurnByMon.get(monId) : undefined;
			if (lastSwitch !== undefined && tracker.turn - lastSwitch < SWITCH_LOCK_TURNS) return null;
			if (evaluateMatchup(myMon, foeMon, tracker).score >= 0) return null;
			const best = chooseBestSwitch(switchCandidates.map(c => c.mon), foeMon, tracker);
			if (!best || best.score.foeDealFraction + best.score.hazardFraction >= 0.95) return null;
			const slot = switchCandidates.find(c => c.mon.id === best.mon.id);
			if (!slot) return null;
			switchChoice = `switch ${slot.idx}`;
		}

		const model = buildFoeModel(tracker);
		const view: ForkView = {
			mySide: tracker.mySide,
			foeSide: tracker.foeSide,
			revealedMoves: foeMon.revealedMoves,
		};
		const budgetMs = (ctx.searchBudgetMs ?? DEFAULT_BUDGET_MS) * SWITCH_EVAL_BUDGET_FRACTION;
		const deadline = Date.now() + budgetMs;
		const stay = meanForkReward(snapshot, "greedy", view, model, ctx, deadline);
		const swap = meanForkReward(snapshot, switchChoice, view, model, ctx, deadline);
		if (stay === null || swap === null) return heuristicChoice;

		if (heuristicChoice) return stay - swap > SWITCH_VETO_MARGIN ? null : heuristicChoice;
		return swap - stay > SWITCH_OVERRIDE_MARGIN ? switchChoice : null;
	}
}

/**
 * Build the inferred foe move pools shared by all rollouts of one
 * decision: a narrow reply pool (what the foe likely clicks now) and a
 * wider determinization pool (what its hidden slots may contain).
 *
 * @param tracker Battle state tracker.
 * @returns The pools; all arrays are empty when inference has nothing.
 */
function buildFoeModel(tracker: BattleStateTracker): FoeModel {
	const inference = inferFoeActive(tracker);
	const foeIds = inference ? topMoves(inference, FOE_SAMPLE_N) : [];
	const determinizeIds = inference ? topMoves(inference, DETERMINIZE_POOL_N) : [];
	return {
		foeIds,
		foeWeights: inference ? normalizedWeights(foeIds, inference.moves) : [],
		determinizeIds,
		determinizeWeights: inference ? normalizedWeights(determinizeIds, inference.moves) : [],
	};
}

/**
 * Average fork-rollout reward for one root choice, bounded by both a
 * rollout cap and a wall-clock deadline.
 *
 * @param snapshot JSON-string snapshot of the live battle.
 * @param myChoice Root choice (`"greedy"` for the in-fork greedy move).
 * @param view Side/revealed-move context for the rollouts.
 * @param model Inferred foe move pools.
 * @param ctx Engine context (PRNG).
 * @param deadline Wall-clock cutoff (`Date.now()` ms).
 * @returns The mean reward, or `null` when no rollout succeeded.
 */
function meanForkReward(
	snapshot: string,
	myChoice: string,
	view: ForkView,
	model: FoeModel,
	ctx: EngineContext,
	deadline: number
): number | null {
	let total = 0;
	let count = 0;
	for (let i = 0; i < SWITCH_EVAL_ROLLOUTS; i++) {
		if (count > 0 && Date.now() >= deadline) break;
		const reward = forkRollout(snapshot, myChoice, view, model, ctx);
		if (reward === null) break;
		total += reward;
		count++;
	}
	return count > 0 ? total / count : null;
}

/** Standard PUCT: argmax q + c * prior * sqrt(N) / (1 + n). */
function selectByPUCT(nodes: CandidateNode[], totalVisits: number): CandidateNode | null {
	let best: CandidateNode | null = null;
	let bestUcb = -Infinity;
	const sqrtN = Math.sqrt(Math.max(1, totalVisits));
	for (const n of nodes) {
		// Until each candidate has been explored a minimum number of
		// times we round-robin so the search isn't dominated by an
		// early-lucky high-variance reward.
		if (n.visits < MIN_VISITS_PER_CANDIDATE) {
			return n;
		}
		const q = n.totalReward / n.visits;
		const u = C_PUCT * n.prior * sqrtN / (1 + n.visits);
		const ucb = q + u;
		if (ucb > bestUcb) {
			bestUcb = ucb;
			best = n;
		}
	}
	return best;
}

/**
 * Roll a single (our move, foe move) sample forward using the
 * tracker + DamageCalc. Returns a scalar reward in roughly the same
 * units as {@link MoveEvaluator} produces.
 */
function sampleRollout(
	pick: CandidateNode,
	evalCtx: MoveEvalContext,
	foeIds: string[],
	foeWeights: number[],
	ctx: EngineContext
): number {
	const ourMove = Dex.moves.get(pick.id);
	if (!ourMove?.exists) return 0;
	// Sample one foe move proportional to weights.
	const foeMove = sampleWeighted(foeIds, foeWeights, ctx) ?? "tackle";
	const foeMoveData = Dex.moves.get(foeMove);
	const ourCalc = ourMove.category !== "Status" ? calculateDamage({
		attacker: fromTracked(evalCtx.attacker),
		defender: fromTracked(evalCtx.defender),
		move: ourMove,
		field: evalCtx.tracker.field,
		attackerSide: evalCtx.tracker.sides[evalCtx.mySide],
		defenderSide: evalCtx.tracker.sides[evalCtx.foeSide],
		isDoubles: evalCtx.isDoubles,
	}) : null;
	const foeCalc = foeMoveData?.exists && foeMoveData.category !== "Status" ? calculateDamage({
		attacker: fromTracked(evalCtx.defender),
		defender: fromTracked(evalCtx.attacker),
		move: foeMoveData,
		field: evalCtx.tracker.field,
		attackerSide: evalCtx.tracker.sides[evalCtx.foeSide],
		defenderSide: evalCtx.tracker.sides[evalCtx.mySide],
		isDoubles: evalCtx.isDoubles,
	}) : null;

	let reward = 0;
	if (ourCalc) {
		const maxHp = ourCalc.defenderMaxHp || 1;
		const ourDamage = (ourCalc.avgDamage / maxHp) * ourCalc.hitChance;
		reward += ourDamage * 100;
		reward += 30 * ourCalc.koProbability;
	} else {
		// Status move: use the heuristic move-evaluator score as a stand-in.
		reward += evaluateMove(ourMove, evalCtx).score * 0.3;
	}
	if (foeCalc) {
		const myMaxHp = foeCalc.defenderMaxHp || 1;
		const foeDamage = (foeCalc.avgDamage / myMaxHp) * foeCalc.hitChance;
		let foeCost = foeDamage * 70;
		foeCost += 35 * foeCalc.koProbability;
		// Speed: if we go first AND OHKO, the foe never attacks.
		if (evalCtx.weOutspeed && ourCalc?.koProbability) {
			foeCost *= (1 - ourCalc.koProbability);
		}
		reward -= foeCost;
	}
	return reward;
}

/**
 * Serialize the live battle for fork rollouts, when available and the
 * battle shape is one we can replay (2-side singles, mid move-request).
 *
 * The snapshot is a JSON *string*, not the `toJSON()` object:
 * `State.deserializeBattle` reuses nested objects from its input, so
 * deserializing the same object repeatedly would make every fork (and
 * the live battle) share mutable state — fork turns would push into the
 * live battle's log until the sim's "Infinite loop" guard fired.
 * Round-tripping through `JSON.parse` gives each fork a private copy.
 * (Measured: parse+deserialize is ~0.3ms per fork — cheaper than
 * `structuredClone` on this data and negligible next to the rollout
 * simulation itself.)
 *
 * @param ctx Engine context (provides the optional `getBattle` hook).
 * @returns The serialized battle, or `null` when forking is
 *   unavailable or unsupported for this battle.
 */
function takeBattleSnapshot(ctx: EngineContext): string | null {
	const live = ctx.getBattle?.();
	if (!live || live.ended) return null;
	if (live.sides.length !== 2 || live.gameType !== "singles") return null;
	if (live.requestState !== "move") return null;
	try {
		return JSON.stringify(live.toJSON());
	} catch {
		return null;
	}
}

/**
 * Play one full multi-turn rollout on a fork of the real battle:
 *
 * 1. `Battle.fromJSON(snapshot)` clones the live state, re-seeded from
 *    the engine PRNG so each rollout samples fresh damage rolls.
 * 2. The fork is *determinized*: the foe active's unrevealed move slots
 *    are overwritten with a fresh weighted sample from the
 *    {@link OpponentInference} prior pool, so the search plays against
 *    what we *believe* the foe has rather than reading its true hidden
 *    set (no full-info cheating). Sampling a different plausible set
 *    per rollout means repeated visits average over determinizations
 *    instead of anchoring on a single guess.
 * 3. The root action is committed against a sampled foe reply, then
 *    {@link FORK_ROLLOUT_TURNS} more turns are played with a cheap
 *    greedy policy (forced switches auto-resolve).
 * 4. The reward is the HP/faint differential swing across the rollout,
 *    plus a win/loss bonus if the battle ended.
 *
 * @param snapshot JSON-string snapshot of the live battle.
 * @param myChoice Our root action (`"move N"` / `"switch N"`), or
 *   `"greedy"` to let the in-fork greedy policy pick it.
 * @param view Side ids and the foe's revealed-move set.
 * @param model Inferred foe reply/determinization pools.
 * @param ctx Engine context (PRNG).
 * @returns The rollout reward, or `null` when the fork could not be
 *   built or the root choice was rejected (caller falls back to the
 *   tracker-only sampler).
 */
function forkRollout(
	snapshot: string,
	myChoice: string,
	view: ForkView,
	model: FoeModel,
	ctx: EngineContext
): number | null {
	let fork: Battle;
	try {
		fork = Battle.fromJSON(snapshot);
	} catch {
		return null;
	}
	fork.prng = PRNG.get(forkSeed(ctx));
	const mySide = fork.sides.find(s => s.id === view.mySide);
	const foeSide = fork.sides.find(s => s.id === view.foeSide);
	if (!mySide || !foeSide) return null;

	const foeActive = foeSide.active[0];
	if (foeActive) {
		determinizeMoves(foeActive, view.revealedMoves, model.determinizeIds, model.determinizeWeights, ctx);
	}

	const before = evaluateForkState(fork, mySide);
	try {
		// Foe reply first (order doesn't matter; commit fires once both
		// sides are done).
		const foeChoice = pickForkFoeChoice(fork, foeSide, foeActive, model.foeIds, model.foeWeights, ctx);
		if (!fork.choose(foeSide.id, foeChoice)) {
			if (!fork.choose(foeSide.id, "default")) return null;
		}
		const rootChoice = myChoice === "greedy" ? greedyChoiceForSide(fork, mySide) : myChoice;
		if (!fork.choose(mySide.id, rootChoice)) return null;
		resolvePendingChoices(fork);
		for (let t = 0; t < FORK_ROLLOUT_TURNS && !fork.ended; t++) {
			if (fork.requestState === "move") {
				playGreedyTurn(fork);
			} else {
				fork.makeChoices();
			}
			resolvePendingChoices(fork);
		}
	} catch {
		// Forks can die on exotic mechanics (forme bugs, choice-lock edge
		// cases); score whatever state we reached rather than discarding
		// the visit entirely.
	}

	const after = evaluateForkState(fork, mySide);
	let reward = (after - before) * FORK_REWARD_SCALE;
	if (fork.ended) {
		if (fork.winner === mySide.name) reward += FORK_WIN_BONUS;
		else if (fork.winner) reward -= FORK_WIN_BONUS;
	}
	return reward;
}

/**
 * Derive a fresh battle seed from the engine PRNG so consecutive
 * rollouts diverge while the engine itself stays reproducible.
 *
 * @param ctx Engine context providing the PRNG.
 * @returns A four-part numeric PRNG seed.
 */
function forkSeed(ctx: EngineContext): PRNGSeed {
	return [
		ctx.prng.random(2 ** 16), ctx.prng.random(2 ** 16),
		ctx.prng.random(2 ** 16), ctx.prng.random(2 ** 16),
	].join(",") as PRNGSeed;
}

/**
 * Overwrite the foe active's *unrevealed* move slots with a weighted
 * sample (without replacement) from the inferred-move pool. Revealed
 * moves are kept untouched; fills skip moves the mon already has.
 * Because the sample is re-drawn per rollout, repeated visits to the
 * same candidate average over many plausible foe sets.
 *
 * @param foeActive The foe's active Pokemon in the fork.
 * @param revealed The foe active's revealed move ids (kept untouched).
 * @param pool Inferred move-id pool to sample fills from.
 * @param weights Sampling weights parallel to `pool`.
 * @param ctx Engine context (PRNG).
 */
function determinizeMoves(
	foeActive: Pokemon,
	revealed: Set<string>,
	pool: string[],
	weights: number[],
	ctx: EngineContext
): void {
	if (!pool.length) return;
	const present = new Set<string>(foeActive.moveSlots.map(s => s.id));
	const eligible: string[] = [];
	const eligibleWeights: number[] = [];
	for (const [i, id] of pool.entries()) {
		if (present.has(id)) continue;
		eligible.push(id);
		eligibleWeights.push(weights[i] ?? 0);
	}
	const fills = sampleWithoutReplacement(eligible, eligibleWeights, ctx);
	for (const slot of foeActive.moveSlots) {
		if (revealed.has(slot.id)) continue;
		const next = fills.shift();
		if (!next) break;
		const mv = Dex.moves.get(next);
		if (!mv?.exists) continue;
		slot.move = mv.name;
		slot.id = mv.id;
		slot.pp = mv.pp;
		slot.maxpp = mv.pp;
		slot.target = mv.target;
		slot.disabled = false;
	}
}

/**
 * Pick the foe's reply for the root turn of a fork rollout: usually
 * its greedy max-damage move on the determinized set (real opponents
 * play near-greedy), otherwise a prior-weighted sample for variety.
 * Falls back to the simulator default when neither produces a usable
 * move.
 *
 * @param fork The forked battle.
 * @param foeSide The foe's side in the fork.
 * @param foeActive The foe's active Pokemon in the fork.
 * @param foeIds Inferred move ids.
 * @param foeWeights Sampling weights parallel to `foeIds`.
 * @param ctx Engine context (PRNG).
 * @returns A choice string for `Battle.choose`.
 */
function pickForkFoeChoice(
	fork: Battle,
	foeSide: Side,
	foeActive: Pokemon | null,
	foeIds: string[],
	foeWeights: number[],
	ctx: EngineContext
): string {
	if (!foeActive) return "default";
	if (ctx.prng.random() < GREEDY_FOE_REPLY_CHANCE) {
		return greedyChoiceForSide(fork, foeSide);
	}
	const sampled = sampleWeighted(foeIds, foeWeights, ctx);
	if (!sampled) return "default";
	const idx = foeActive.moveSlots.findIndex(
		s => s.id === sampled && !s.disabled && s.pp > 0
	);
	return idx >= 0 ? `move ${idx + 1}` : "default";
}

/**
 * Resolve any pending mid-turn requests (forced switches after faints,
 * U-turn targets, etc.) with the simulator's auto-choose so the fork
 * reaches the next stable turn boundary.
 *
 * @param fork The forked battle.
 */
function resolvePendingChoices(fork: Battle): void {
	let guard = 0;
	while (!fork.ended && fork.requestState === "switch" && guard++ < 6) {
		fork.makeChoices();
	}
}

/**
 * Play one fork turn with a cheap greedy policy for both sides: the
 * usable move with the highest effective base power (STAB and type
 * effectiveness against the opposing active included).
 *
 * @param fork The forked battle, mid move-request.
 */
function playGreedyTurn(fork: Battle): void {
	const turnBefore = fork.turn;
	for (const side of fork.sides) {
		if (side.isChoiceDone()) continue;
		const choice = greedyChoiceForSide(fork, side);
		if (!fork.choose(side.id, choice)) fork.choose(side.id, "default");
		// The last successful choice commits the turn.
		if (fork.ended || fork.turn !== turnBefore) return;
	}
	// A rejected choice left the turn uncommitted — let the simulator
	// auto-resolve rather than stalling the rollout.
	if (!fork.ended && fork.turn === turnBefore) fork.makeChoices();
}

/**
 * Greedy move pick for a fork side: max `BP x STAB x effectiveness`
 * across usable move slots.
 *
 * @param fork The forked battle.
 * @param side The side to choose for.
 * @returns A choice string for `Battle.choose`.
 */
function greedyChoiceForSide(fork: Battle, side: Side): string {
	const active = side.active[0];
	if (!active || active.fainted) return "default";
	const foe = side.foe?.active[0] ?? null;
	let bestIdx = -1;
	let bestScore = -Infinity;
	for (const [i, slot] of active.moveSlots.entries()) {
		if (slot.disabled || slot.pp <= 0) continue;
		const mv = Dex.moves.get(slot.id);
		if (!mv?.exists) continue;
		const bp = typeof mv.basePower === "number" ? mv.basePower : 0;
		const stab = active.types.includes(mv.type) ? 1.5 : 1;
		const eff = foe && bp > 0 ?
			(Dex.getImmunity(mv.type, foe.types) ? 2 ** foe.types.reduce(
				(acc, t) => acc + Dex.getEffectiveness(mv.type, t), 0
			) : 0) :
			1;
		const score = bp * stab * eff;
		if (score > bestScore) {
			bestScore = score;
			bestIdx = i;
		}
	}
	return bestIdx >= 0 ? `move ${bestIdx + 1}` : "default";
}

/**
 * Static evaluation of a fork in "mons" units (each living mon
 * contributes up to ~1.3 from HP fraction + alive bonus), refined by
 * positional terms a pure material count misses:
 *
 * - non-volatile status on living mons (burn/para/tox cost real value),
 * - net stat-boost stages on the actives (a free setup turn is worth
 *   something even before it converts to damage),
 * - entry hazards stacked on each side (they tax future switches).
 *
 * @param fork The forked battle.
 * @param mySide Our side in the fork.
 * @returns Positive when we're ahead.
 */
function evaluateForkState(fork: Battle, mySide: Side): number {
	let score = 0;
	for (const side of fork.sides) {
		const sign = side === mySide ? 1 : -1;
		for (const p of side.pokemon) {
			const hpFraction = p.maxhp > 0 ? p.hp / p.maxhp : 0;
			let value = hpFraction + (p.hp > 0 ? 0.3 : 0);
			if (p.hp > 0 && p.status) value -= STATUS_EVAL_PENALTY;
			score += sign * value;
		}
		const active = side.active[0];
		if (active && !active.fainted) {
			let netBoosts = 0;
			for (const stage of Object.values(active.boosts)) netBoosts += stage;
			score += sign * BOOST_EVAL_VALUE * netBoosts;
		}
		score -= sign * hazardPressure(side);
	}
	return score;
}

/**
 * Cost of the entry hazards currently stacked on a side, in the same
 * "mons" units as {@link evaluateForkState}.
 *
 * @param side The side whose hazards are being scored.
 * @returns The total hazard tax (0 when the side is clean).
 */
function hazardPressure(side: Side): number {
	let cost = 0;
	if (side.sideConditions["stealthrock"]) cost += 0.15;
	const spikes = side.sideConditions["spikes"];
	if (spikes) cost += 0.07 * (spikes.layers ?? 1);
	const tspikes = side.sideConditions["toxicspikes"];
	if (tspikes) cost += 0.06 * (tspikes.layers ?? 1);
	if (side.sideConditions["stickyweb"]) cost += 0.08;
	return cost;
}

function softmax(values: number[]): number[] {
	if (!values.length) return [];
	const max = Math.max(...values);
	const exps = values.map(v => Math.exp((v - max) / 25));
	const sum = exps.reduce((a, b) => a + b, 0);
	return sum > 0 ? exps.map(e => e / sum) : values.map(() => 1 / values.length);
}

/**
 * Normalize inference scores for a set of move ids into sampling
 * weights that sum to 1.
 *
 * @param ids Move ids to weight.
 * @param scores Raw inference scores keyed by move id.
 * @returns Weights parallel to `ids` (all zero when scores sum to 0).
 */
function normalizedWeights(ids: string[], scores: Map<string, number>): number[] {
	const raw = ids.map(id => scores.get(id) ?? 0);
	const sum = raw.reduce((a, b) => a + b, 0);
	return sum > 0 ? raw.map(v => v / sum) : raw;
}

/**
 * Weighted sample without replacement: draws ids one at a time
 * proportionally to their weight until the pool is exhausted.
 *
 * @param ids Candidate ids.
 * @param weights Sampling weights parallel to `ids`.
 * @param ctx Engine context (PRNG).
 * @returns The ids in sampled order.
 */
function sampleWithoutReplacement(ids: string[], weights: number[], ctx: EngineContext): string[] {
	const remainingIds = ids.slice();
	const remainingWeights = weights.slice();
	const out: string[] = [];
	while (remainingIds.length) {
		const sampled = sampleWeighted(remainingIds, remainingWeights, ctx);
		if (!sampled) break;
		const i = remainingIds.indexOf(sampled);
		remainingIds.splice(i, 1);
		remainingWeights.splice(i, 1);
		out.push(sampled);
	}
	return out;
}

function sampleWeighted(ids: string[], weights: number[], ctx: EngineContext): string | null {
	if (!ids.length) return null;
	const total = weights.reduce((a, b) => a + b, 0);
	if (total <= 0) return ids[Math.floor(ctx.prng.random() * ids.length)] ?? null;
	let r = ctx.prng.random() * total;
	for (let i = 0; i < ids.length; i++) {
		r -= weights[i];
		if (r <= 0) return ids[i];
	}
	return ids[ids.length - 1];
}

// Re-export the proxy Move type for tests.
export type { Move };
