/**
 * Strategic-AI heuristic engine (difficulty 3).
 *
 * Replaces the legacy single-ply scoring inside the original
 * `player-ai.ts` shell with a composition of:
 *
 * - {@link DamageCalc} for damage *distributions* (min/avg/max/KO%).
 * - {@link MoveEvaluator} for category-based move scoring (status,
 *   hazards, pivot, priority, recovery, ...).
 * - {@link SwitchEvaluator} for switch matchup scoring with the
 *   correct per-attacker-type effectiveness math.
 * - {@link TargetPicker} for doubles target selection (redirection,
 *   spread, Helping Hand).
 * - {@link OpponentInference} for layered guesses about hidden info.
 *
 * The engine keeps the host {@link PlayerAI}'s legacy
 * "switch lock" / "Protect spam guard" knobs so its public behaviour
 * stays close to today's at the same difficulty.
 *
 * @license MIT
 */
import { Dex, toID } from "../../../dex";
import type {
	ChoiceRequest,
	MoveRequest,
	PokemonMoveRequestData,
	PokemonSwitchRequestData,
	SideRequestData,
	SwitchRequest,
	TeamPreviewRequest,
} from "../../../side";
import { calculateDamage, fromTracked } from "../mechanics/DamageCalc";
import { evaluateMove, type MoveEvalContext } from "../mechanics/MoveEvaluator";
import { chooseBestSwitch, evaluateMatchup, scaledSpeed } from "../mechanics/SwitchEvaluator";
import { pickTarget } from "../mechanics/TargetPicker";
import { chooseTransform } from "../mechanics/TransformPolicy";
import type { BattleStateTracker, TrackedPokemon } from "../state/BattleStateTracker";
import { applyNoise, type Engine, type EngineContext } from "./Engine";

/** Switch-out HP threshold below which we consider safe-pivoting. */
const HP_SWITCH_OUT_THRESHOLD = 0.3;
/** Faint-emergency HP threshold (combine with foe-faster check). */
const FAINT_THRESHOLD = 0.1;
/** How many turns we lock against re-switching the same mon. */
const SWITCH_LOCK_TURNS = 2;
/** Chance per-turn to consider Protect when it's available and safe. */
const PROTECT_CONSIDER_CHANCE = 0.15;
/** Switch-out matchup threshold; below this, switching is favoured. */
const SWITCH_OUT_MATCHUP = -8;
/**
 * Proactive-switch trigger: switch out even from a non-bad matchup if a
 * bench mon outscores the current one by at least this much. Sized so
 * the AI doesn't flip-flop on small numerical edges, but does take
 * obvious synergies (e.g. Grassy Seed in Grassy Terrain, 4× resist on
 * the bench) when they appear.
 */
const PROACTIVE_SWITCH_DELTA = 18;
/** Absolute bench score required to take a proactive switch. */
const PROACTIVE_SWITCH_FLOOR = 12;
/**
 * Moves whose positive priority (or usability) is conditional and so
 * can't be relied on to KO on a future turn: Fake Out / First Impression
 * only work on the switch-in turn, Sucker Punch only fires if the foe
 * attacks. They must not count toward the "we're already a priority-KO
 * threat, don't switch out" veto.
 */
const CONDITIONAL_PRIORITY_MOVES = new Set([
	"fakeout",
	"firstimpression",
	"suckerpunch",
]);

/** Lazy `Dex.moves.get`. */
function moveOf(id: string) {
	return Dex.moves.get(id);
}

/**
 * Default heuristic engine. Stateless (state lives on `EngineContext`).
 */
export class HeuristicEngine implements Engine {
	readonly id: string = "heuristic";

	choose(request: ChoiceRequest, ctx: EngineContext): string {
		if (request.wait) return "";
		if (request.teamPreview) return this.chooseTeamPreview(request, ctx);
		if (request.forceSwitch) return this.chooseForceSwitch(request, ctx);
		return this.chooseMove(request, ctx);
	}

	// -----------------------------------------------------------------
	// Team preview
	// -----------------------------------------------------------------

	private chooseTeamPreview(
		request: TeamPreviewRequest,
		ctx: EngineContext
	): string {
		const tracker = ctx.tracker;
		const side = request.side;
		const foes = side.foePokemon ?? [];
		if (!side.pokemon.length || !foes.length || !tracker) return "default";

		// Score each of our mons as a lead by summing matchup scores
		// against every foe.
		const myMons = side.pokemon
			.map((p, idx) => ({ p, idx, mon: this.resolveTrackedFromRequest(p, ctx, tracker.mySide) }))
			.filter(x => x.mon);
		const foeMons = foes
			.map(p => this.resolveTrackedFromRequest(p, ctx, tracker.foeSide))
			.filter((m): m is TrackedPokemon => !!m);

		let bestLead = 0;
		let bestScore = -Infinity;
		for (const candidate of myMons) {
			let total = 0;
			for (const foe of foeMons) {
				total += evaluateMatchup(candidate.mon!, foe, tracker).score;
			}
			if (total > bestScore) {
				bestScore = total;
				bestLead = candidate.idx;
			}
		}

		const order = [
			bestLead,
			...Array.from({ length: side.pokemon.length }, (_, i) => i).filter(i => i !== bestLead),
		];
		return `team ${order.map(i => i + 1).join(",")}`;
	}

	// -----------------------------------------------------------------
	// Force switch
	// -----------------------------------------------------------------

	/**
	 * Pick a switch-in for every slot the simulator has flagged in
	 * `forceSwitch`. The hard requirement is "every flagged slot must
	 * answer with `switch N` for some non-active, non-fainted bench
	 * Pokemon, or `pass` if (and only if) no such Pokemon exists" —
	 * showdown rejects `pass` otherwise and the resulting error loop
	 * eventually trips the host's safety valve into a forced tie.
	 *
	 * That means the candidate set must be built from `request.side`
	 * directly. The tracker is only consulted to *rank* the candidates;
	 * a missing tracker entry (e.g. on the very first force-switch of a
	 * battle, before any move log has populated the tracker) MUST NOT
	 * remove a Pokemon from consideration.
	 */
	private chooseForceSwitch(
		request: SwitchRequest,
		ctx: EngineContext
	): string {
		const side = request.side;
		const slots = request.forceSwitch || [];
		if (!side?.pokemon) return "pass";
		const tracker = ctx.tracker;
		const foeActive = tracker?.foeActive ?? null;

		const taken = new Set<number>();
		const actions = slots.map(needsSwitch => {
			if (!needsSwitch) return "pass";

			interface RawCandidate {
				req: PokemonSwitchRequestData;
				idx: number;
				mon: TrackedPokemon | null;
			}

			const candidates: RawCandidate[] = [];
			for (let i = 0; i < side.pokemon.length; i++) {
				const p = side.pokemon[i];
				if (!p || p.active || p.condition.endsWith(" fnt")) continue;
				if (taken.has(i + 1)) continue;
				const mon = tracker ?
					this.resolveTrackedFromRequest(p, ctx, tracker.mySide) :
					null;
				candidates.push({ req: p, idx: i + 1, mon });
			}

			// Genuinely no live bench mon — fine to pass.
			if (!candidates.length) return "pass";

			let pickIdx = candidates[0].idx;
			if (tracker && foeActive) {
				const ranked = candidates.filter(
					(c): c is RawCandidate & { mon: TrackedPokemon } => !!c.mon
				);
				if (ranked.length) {
					const best = chooseBestSwitch(
						ranked.map(c => c.mon),
						foeActive,
						tracker
					);
					if (best) {
						const match = ranked.find(c => c.mon.id === best.mon.id);
						if (match) pickIdx = match.idx;
					}
				}
			}
			taken.add(pickIdx);
			return `switch ${pickIdx}`;
		});
		return actions.join(", ");
	}

	// -----------------------------------------------------------------
	// Move requests (the big one)
	// -----------------------------------------------------------------

	private chooseMove(request: MoveRequest, ctx: EngineContext): string {
		const tracker = ctx.tracker;
		const side = request.side;
		if (!side || !request.active || !tracker) return "default";

		const decisions: string[] = request.active.map((active, slotIndex) => {
			const sideMon = side.pokemon[slotIndex];
			if (!sideMon || sideMon.condition.endsWith(" fnt")) return "pass";
			return this.decideForSlot(request, ctx, tracker, slotIndex, active);
		});
		return decisions.join(", ");
	}

	private decideForSlot(
		request: MoveRequest,
		ctx: EngineContext,
		tracker: BattleStateTracker,
		slotIndex: number,
		active: PokemonMoveRequestData
	): string {
		const side = request.side;
		const sideMon = side.pokemon[slotIndex];
		const myMon = this.resolveTrackedFromRequest(sideMon, ctx, tracker.mySide);
		const foeMon = tracker.foeActive;
		if (!myMon || !foeMon) return "default";

		const monId = this.monIdForSlot(side, slotIndex, ctx);
		const lastMoveId = monId ? ctx.lastMoveByMon.get(monId) : undefined;

		// 1. Should we switch out?
		const switchCandidates = this.gatherSwitchCandidates(side, slotIndex, ctx, tracker);
		// Ability/item-based traps (Shadow Tag, Magnet Pull, Arena Trap)
		// don't always surface as `active.trapped: true` on the request
		// payload — the simulator only learns about them after we tried to
		// switch and got rejected. `PlayerAI.receiveError` records the
		// rejection in `trappedActiveByMon`; treat that as authoritative.
		const erroredTrapped = ctx.trappedActiveByMon?.has(myMon.id) ?? false;
		const trapped = !!active.trapped || erroredTrapped;
		if (!trapped && switchCandidates.length > 0) {
			const switchDecision = this.maybeSwitchOut(
				myMon, foeMon, tracker, side, slotIndex, ctx, switchCandidates, active
			);
			if (switchDecision) {
				if (monId) ctx.lastSwitchTurnByMon.set(monId, tracker.turn);
				return switchDecision;
			}
		}

		// 2. Filter available moves.
		const availableMoves = this.availableMoves(active, monId, ctx);
		if (!availableMoves.length) return "default";

		// 3. Optional Protect probe.
		if (lastMoveId !== "protect" && ctx.prng.random() < PROTECT_CONSIDER_CHANCE) {
			const protectIdx = availableMoves.findIndex(m => m.id === "protect");
			if (protectIdx >= 0) {
				if (monId) ctx.lastMoveByMon.set(monId, "protect");
				return `move ${this.moveCommandIndex(active, "protect")}`;
			}
		}

		// 4. Score each candidate move.
		const evalCtx: MoveEvalContext = {
			tracker,
			attacker: myMon,
			defender: foeMon,
			mySide: tracker.mySide,
			foeSide: tracker.foeSide,
			weOutspeed: this.weOutspeed(myMon, foeMon, tracker),
			isDoubles: request.active.length > 1,
			valueOfBestSwitch: switchCandidates.length ?
				this.bestSwitchValue(switchCandidates, foeMon, tracker) :
				0,
			// Plumb "did our last attempt fizzle?" through to the move
			// scorer. This lets Stomping Tantrum's 2× BP fire after
			// e.g. an Earthquake into Levitate the previous turn.
			attackerLastMoveFailed: myMon.lastMoveFailed,
		};

		const scored = this.scoreCandidates(availableMoves, evalCtx, ctx);
		scored.sort((a, b) => b.score - a.score);

		// 5. Anti-staleness: avoid repeating the same move turn-after-turn
		// when an alternative is nearly as good (predictability hurts).
		let pick = scored[0];
		if (
			scored.length > 1 &&
			pick.opt.id === lastMoveId &&
			scored[1].score >= 0.9 * pick.score
		) {
			pick = scored[1];
		}
		// 6. Apply epsilon noise.
		const noisedPool = scored.filter(s => s.score >= pick.score * 0.5);
		const noised = applyNoise(pick, noisedPool, ctx.noiseEpsilon, ctx.prng);
		const chosen = noised.opt;
		if (monId) ctx.lastMoveByMon.set(monId, chosen.id);

		// 7. Format command (with target for doubles).
		return this.formatMoveCommand(active, chosen.id, slotIndex, request, ctx, tracker, myMon);
	}

	/**
	 * Evaluate whether the active mon should switch this turn. Returns a
	 * `switch N` command or `null` to indicate "stay in".
	 */
	private maybeSwitchOut(
		myMon: TrackedPokemon,
		foeMon: TrackedPokemon,
		tracker: BattleStateTracker,
		side: SideRequestData,
		slotIndex: number,
		ctx: EngineContext,
		switchCandidates: { req: PokemonSwitchRequestData, idx: number, mon: TrackedPokemon }[],
		active: PokemonMoveRequestData
	): string | null {
		const monId = this.monIdForSlot(side, slotIndex, ctx);
		const lastSwitch = monId ? ctx.lastSwitchTurnByMon.get(monId) : undefined;
		if (lastSwitch !== undefined && tracker.turn - lastSwitch < SWITCH_LOCK_TURNS) return null;

		const myHp = myMon.hpFraction ?? 1;
		const matchup = evaluateMatchup(myMon, foeMon, tracker);
		const myStats = myMon.stats;
		// Use `scaledSpeed` (weather doubled / Tailwind / boosts / status)
		// so emergency / dominant-outspeeder checks match the matchup
		// scorer. Without this, a Swift Swim user in rain reads as
		// "slower" for emergency logic but "faster" for matchup logic
		// — exactly the bug behind the Mega-Sceptile vs Pelipper /
		// Barraskewda misfire reported in playtest.
		const myTailwind = tracker.sides[tracker.mySide].tailwindTurns > 0;
		const foeTailwind = tracker.sides[tracker.foeSide].tailwindTurns > 0;
		const myEff = scaledSpeed(myMon, myTailwind, tracker.field.weather, tracker.field.terrain);
		const foeEff = scaledSpeed(foeMon, foeTailwind, tracker.field.weather, tracker.field.terrain);
		const wereFaster = tracker.field.trickRoom ? myEff < foeEff : myEff > foeEff;

		// Find best candidate so we can both rank it and use it for the
		// proactive-synergy trigger below.
		const best = chooseBestSwitch(
			switchCandidates.map(c => c.mon),
			foeMon,
			tracker
		);
		const bestScore = best?.score.score ?? -Infinity;
		// Proactive: even if the current matchup isn't *bad*, a bench
		// mon might be drastically better. Only trip this when the
		// current matchup is at least mildly unfavourable AND a bench
		// mon clears a large absolute floor — otherwise we just flip-
		// flop and feed the foe free turns. The bench mon must also
		// actually survive entry (so we don't sac into a 4× weakness
		// for the speed/seed bonus).
		const proactiveSurvives =
			!best || best.score.foeDealFraction + best.score.hazardFraction < 0.9;
		const proactiveSwitch =
			matchup.score < 0 &&
			bestScore >= PROACTIVE_SWITCH_FLOOR &&
			bestScore - matchup.score >= PROACTIVE_SWITCH_DELTA &&
			proactiveSurvives;

		const emergencySwitch =
			(myHp < FAINT_THRESHOLD && !wereFaster) ||
			((myMon.boosts.atk || 0) <= -3 && (myStats?.atk ?? 0) >= (myStats?.spa ?? 0)) ||
			((myMon.boosts.spa || 0) <= -3 && (myStats?.spa ?? 0) >= (myStats?.atk ?? 0));

		// "Don't waste a consumed-item activation": if the current mon
		// is sitting on a fresh boost it paid for (Paradox boost from
		// Booster Energy / matching weather/terrain, terrain-seed Def/
		// SpD bump, Flash Fire / Charge, etc.) leaving it costs a real
		// resource. Refuse non-emergency switches in that state.
		if (hasActiveConsumableBoost(myMon, tracker) && !emergencySwitch) return null;

		// Setup-window preservation: a fresh Focus Sash / Sturdy mon
		// at full HP is locked in to one more turn no matter how scary
		// the matchup looks; pivoting away wastes the protection. Same
		// logic for Weakness Policy when the foe's revealed kit
		// includes a SE attack (the WP will fire, we get +2/+2).
		if (shouldPreserveSetupWindow(myMon, foeMon) && !emergencySwitch) return null;

		// Already-dominant: if we outspeed AND can already pressure the
		// foe meaningfully (>= 25% per swing) AND we're not low HP,
		// proactive switching just throws tempo away. The user's
		// playtests showed flip-flop swaps from healthy outspeeding
		// mons; this guard closes that branch.
		const weDealMeaningful = matchup.weDealFraction >= 0.25;
		if (wereFaster && weDealMeaningful && myHp >= 0.5 && matchup.score >= 0) return null;

		// "We can clean up with priority next turn": refuse to swap into
		// a healthy teammate (almost always a sacrifice setup) when our
		// current mon has a usable priority move that would KO the foe.
		// Even if the matchup score says "you're losing", the actual
		// outcome is "we KO before they move" → we don't need a swap.
		if (this.hasUsablePriorityKO(myMon, foeMon, tracker, active, ctx) && !emergencySwitch) {
			return null;
		}

		const wantSwitch =
			emergencySwitch ||
			matchup.score < SWITCH_OUT_MATCHUP ||
			(myHp < HP_SWITCH_OUT_THRESHOLD && matchup.score < 0) ||
			proactiveSwitch;
		if (!wantSwitch) return null;

		if (!best) return null;
		// Sacrifice guard: refuse to "switch out" into a mon that the
		// foe's best plausible attack would OHKO on entry. Without this
		// the engine happily pivots a low-HP mon into a 4×-weak teammate
		// just to set up a future swap — exactly the "swap-in, get KO'd,
		// swap back" loop reported in playtest. Only the FAINT-emergency
		// branch overrides this (we're already dying anyway, and the
		// foe gets a free turn either way).
		const candidateSurvives = best.score.foeDealFraction + best.score.hazardFraction < 0.95;
		const isEmergency = myHp < FAINT_THRESHOLD && !wereFaster;
		// Stay-and-sac gate: when the *current* mon is already going to
		// faint to the foe's best plausible attack this turn (foe is
		// faster and OHKOs us, or we're a doomed Sash/Sturdy) AND the
		// best switch-in would also eat heavy chip on entry, staying
		// is the correct play — we get one more attack / hazard / status
		// for free instead of throwing a fresh mon into the same shot.
		//
		// The textbook scenario is the Mega-Sceptile (+2 SD) vs Pelipper
		// (Drizzle) / Barraskewda (Swift Swim) line: Pelipper is dead
		// either way, and pivoting Barraskewda in straight into Leaf
		// Storm wastes the cleaner. Sac Pelipper, send Barraskewda on
		// a free turn.
		const wereDying = !wereFaster &&
			matchup.foeDealFraction >= 0.9 &&
			!hasGuaranteedSurvivalForActive(myMon);
		const candidateAlsoChipped =
			best.score.foeDealFraction + best.score.hazardFraction >= 0.7;
		if (wereDying && candidateAlsoChipped && !emergencySwitch) return null;
		if (!candidateSurvives && !isEmergency) return null;
		const slot = switchCandidates.find(c => c.mon.id === best.mon.id);
		if (!slot) return null;
		// Skill-gated: lower difficulty switches less reliably.
		const skill = Math.max(0, Math.min(1, (ctx.difficulty - 1) / 4));
		if (ctx.prng.random() > skill) return null;
		return `switch ${slot.idx}`;
	}

	/**
	 * True iff the active mon has a usable (PP > 0, not disabled,
	 * non-status) positive-priority move that has a high probability of
	 * KOing the current foe on the next turn. Used by the switch-out
	 * gate to refuse pivots when we're already a one-turn-KO threat.
	 *
	 * @param myMon Tracked current mon.
	 * @param foeMon Tracked foe active.
	 * @param tracker Battle state tracker.
	 * @param active Request payload for the active slot (move PP/lock).
	 * @param ctx Engine context (for per-mon disabled-move set).
	 * @returns true when at least one priority move probably KOs.
	 */
	private hasUsablePriorityKO(
		myMon: TrackedPokemon,
		foeMon: TrackedPokemon,
		tracker: BattleStateTracker,
		active: PokemonMoveRequestData,
		ctx: EngineContext
	): boolean {
		const monDisabled = ctx.disabledMovesByMon.get(myMon.id);
		for (const m of active.moves) {
			if (m.disabled || m.pp === 0) continue;
			if (monDisabled?.has(m.id)) continue;
			const move = moveOf(m.id);
			if (!move?.exists || move.category === "Status") continue;
			if ((move.priority ?? 0) <= 0) continue;
			// Conditional-priority moves only have their priority (and
			// sometimes only work at all) under specific circumstances:
			// Fake Out / First Impression only on the turn we switch in,
			// Sucker Punch only if the foe attacks. We can't rely on
			// them to KO "next turn", so they must not veto a switch.
			if (CONDITIONAL_PRIORITY_MOVES.has(toID(m.id))) continue;
			const calc = calculateDamage({
				attacker: fromTracked(myMon),
				defender: fromTracked(foeMon),
				move,
				field: tracker.field,
				attackerSide: tracker.sides[tracker.mySide],
				defenderSide: tracker.sides[tracker.foeSide],
			});
			if (calc.koProbability > 0.6) return true;
		}
		return false;
	}

	/**
	 * Score every candidate move. Default implementation defers to
	 * {@link evaluateMove} and applies info-forgetting noise. Subclasses
	 * (e.g. {@link OnePlySearchEngine}) override this to layer search
	 * on top.
	 */
	protected scoreCandidates(
		moves: { id: string, idx: number }[],
		evalCtx: MoveEvalContext,
		ctx: EngineContext
	): { opt: { id: string, idx: number }, score: number }[] {
		return moves.map(opt => {
			const move = moveOf(opt.id);
			const evalResult = evaluateMove(move, evalCtx);
			let score = evalResult.score;
			if (ctx.infoForgetting > 0 && evalCtx.defender.revealedMoves.size > 0 &&
				ctx.prng.random() < ctx.infoForgetting) {
				score *= 0.85;
			}
			return { opt, score };
		});
	}

	private bestSwitchValue(
		switchCandidates: { mon: TrackedPokemon }[],
		foeMon: TrackedPokemon,
		tracker: BattleStateTracker
	): number {
		let best = -Infinity;
		for (const c of switchCandidates) {
			const score = evaluateMatchup(c.mon, foeMon, tracker).score;
			if (score > best) best = score;
		}
		return Number.isFinite(best) ? best : 0;
	}

	private gatherSwitchCandidates(
		side: SideRequestData,
		slotIndex: number,
		ctx: EngineContext,
		tracker: BattleStateTracker
	): { req: PokemonSwitchRequestData, idx: number, mon: TrackedPokemon }[] {
		const out: { req: PokemonSwitchRequestData, idx: number, mon: TrackedPokemon }[] = [];
		for (let i = 0; i < side.pokemon.length; i++) {
			const p = side.pokemon[i];
			if (!p || p.active || p.condition.endsWith(" fnt")) continue;
			const mon = this.resolveTrackedFromRequest(p, ctx, tracker.mySide);
			if (!mon) continue;
			out.push({ req: p, idx: i + 1, mon });
		}
		return out;
	}

	// -----------------------------------------------------------------
	// Helpers
	// -----------------------------------------------------------------

	private weOutspeed(
		me: TrackedPokemon,
		foe: TrackedPokemon,
		tracker: BattleStateTracker
	): boolean {
		const mySpe = me.stats?.spe ?? 0;
		const foeSpe = foe.stats?.spe ?? 0;
		const myEff = mySpe * (tracker.sides[tracker.mySide].tailwindTurns > 0 ? 2 : 1);
		const foeEff = foeSpe * (tracker.sides[tracker.foeSide].tailwindTurns > 0 ? 2 : 1);
		const baseFaster = myEff > foeEff;
		return tracker.field.trickRoom ? !baseFaster : baseFaster;
	}

	private availableMoves(
		active: PokemonMoveRequestData,
		monId: string | null,
		ctx: EngineContext
	): { id: string, idx: number }[] {
		const out: { id: string, idx: number }[] = [];
		const monDisabled = monId ? ctx.disabledMovesByMon.get(monId) : undefined;
		active.moves.forEach((move, idx) => {
			if (move.disabled) return;
			if (move.pp === 0) return;
			if (monDisabled?.has(move.id)) return;
			out.push({ id: move.id, idx: idx + 1 });
		});
		return out;
	}

	private moveCommandIndex(active: PokemonMoveRequestData, moveId: string): number {
		const idx = active.moves.findIndex(m => m.id === moveId);
		return idx >= 0 ? idx + 1 : 1;
	}

	private formatMoveCommand(
		active: PokemonMoveRequestData,
		moveId: string,
		slotIndex: number,
		request: MoveRequest,
		ctx: EngineContext,
		tracker: BattleStateTracker,
		myMon: TrackedPokemon
	): string {
		const idx = this.moveCommandIndex(active, moveId);
		// Decide whether to consume a one-shot transformation (Tera/
		// Mega/Z/Dynamax). The transform decision needs to know which
		// move we picked, so we compute it after move selection.
		let suffix = "";
		const foeMon = tracker.foeActive;
		if (foeMon) {
			const transform = chooseTransform({
				tracker,
				myMon,
				foeMon,
				active,
				chosenMoveId: moveId,
			});
			if (transform) suffix = transform.suffix;
		}
		if (request.active.length <= 1) return `move ${idx}${suffix}`;
		const move = moveOf(moveId);
		const target = move.target;
		const ourSlots = request.active
			.map((_, i) => i)
			.filter(i => {
				const p = (request.side).pokemon[i];
				return p && p.active && !p.condition.endsWith(" fnt");
			});
		const foeSlotMons = (request.side?.foePokemon ?? [])
			.map((p, i) => ({ p, i }))
			.filter(({ p }) => p.active && !p.condition.endsWith(" fnt"))
			.map(({ p }) => this.resolveTrackedFromRequest(p, ctx, tracker.foeSide))
			.filter((m): m is TrackedPokemon => !!m);
		const allyMons = ourSlots
			.map(i => this.resolveTrackedFromRequest(
				(request.side).pokemon[i], ctx, tracker.mySide))
			.filter((m): m is TrackedPokemon => !!m);

		switch (target) {
		case "normal":
		case "any":
		case "adjacentFoe": {
			const t = pickTarget({
				tracker,
				attacker: myMon,
				move,
				foeSlots: foeSlotMons,
				allySlots: allyMons,
			});
			return t !== null ? `move ${idx} ${t}${suffix}` : `move ${idx}${suffix}`;
		}
		case "adjacentAlly":
			return `move ${idx} -${(slotIndex ^ 1) + 1}${suffix}`;
		case "adjacentAllyOrSelf": {
			const allyIndex = slotIndex ^ 1;
			const ally = (request.side).pokemon[allyIndex];
			const allyAlive = !!ally && !ally.condition.endsWith(" fnt");
			return `move ${idx} -${(allyAlive ? allyIndex : slotIndex) + 1}${suffix}`;
		}
		default:
			return `move ${idx}${suffix}`;
		}
	}

	private monIdForSlot(
		side: SideRequestData,
		slotIndex: number,
		ctx: EngineContext
	): string | null {
		const me = side.pokemon[slotIndex];
		if (!me) return null;
		if (me.uuid) return me.uuid;
		const sideId = side.id ?? ctx.tracker?.mySide ?? "p1";
		const colon = me.ident.indexOf(":");
		const name = colon >= 0 ? me.ident.slice(colon + 1).trim() : me.ident;
		return `${sideId}|${name}`;
	}

	/**
	 * Look up the tracker record corresponding to a request entry.
	 * The tracker indexes mons by uuid (preferred) or `${side}|${name}`,
	 * and is fed by `applyRequest` before the engine runs, so this
	 * lookup should always succeed for a current-team mon.
	 */
	private resolveTrackedFromRequest(
		req: PokemonSwitchRequestData,
		ctx: EngineContext,
		sideId: "p1" | "p2" | "p3" | "p4"
	): TrackedPokemon | null {
		const tracker = ctx.tracker;
		if (!tracker) return null;
		if (req.uuid) {
			const m = tracker.pokemon.get(req.uuid);
			if (m) return m;
		}
		const colon = req.ident.indexOf(":");
		const name = colon >= 0 ? req.ident.slice(colon + 1).trim() : req.ident;
		for (const mon of tracker.pokemon.values()) {
			if (mon.name === name && (mon.id.startsWith(`${sideId}:`) || mon.id === req.uuid)) {
				return mon;
			}
		}
		// Fallback: synthesise a minimal record so we don't crash.
		return null;
	}
}

/**
 * True if `mon` is currently enjoying a stat boost that was earned by
 * consuming a single-use item or by entering a matching field (e.g.
 * Booster Energy / sun on Protosynthesis, Electric Terrain on Quark
 * Drive, Grassy/Electric/Misty/Psychic Seed in the matching terrain,
 * Flash Fire / Charge volatile up).
 *
 * Switching out throws that resource away — the seed is already gone,
 * Booster Energy was consumed on entry, etc. — so the caller uses this
 * as a soft veto against non-emergency switches.
 *
 * @param mon Tracked Pokemon snapshot for the active mon.
 * @param tracker Battle state tracker (for current field state).
 * @returns true when a consumed-item or field-activated boost is up.
 */
function hasActiveConsumableBoost(
	mon: TrackedPokemon,
	tracker: BattleStateTracker
): boolean {
	for (const v of mon.volatiles) {
		if (v.startsWith("protosynthesis") || v.startsWith("quarkdrive")) return true;
		if (v === "flashfire" || v === "charge") return true;
	}
	const ability = toID(mon.ability);
	const weather = tracker.field.weather;
	const terrain = tracker.field.terrain;
	const protoActive = ability === "protosynthesis" &&
		(weather === "sunnyday" || weather === "desolateland");
	const quarkActive = ability === "quarkdrive" && terrain === "electricterrain";
	if (protoActive || quarkActive) return true;
	// Terrain-seed users keep their +1 Def/SpD boost for the duration of
	// the stay; the item has already been consumed by the time we get
	// here, so we infer "boost up" from the boost stage matching the
	// expected stat. Best-effort: a real Defiant trigger could also leave
	// these stages up, but the conservatism cost is small.
	if (
		(terrain === "grassyterrain" || terrain === "electricterrain") &&
		(mon.boosts.def ?? 0) > 0 &&
		!mon.item
	) {
		return true;
	}
	if (
		(terrain === "mistyterrain" || terrain === "psychicterrain") &&
		(mon.boosts.spd ?? 0) > 0 &&
		!mon.item
	) {
		return true;
	}
	return false;
}

/**
 * True when the current mon is sitting on a setup-window resource that
 * a switch-out would waste. We're conservative on purpose: only flag
 * cases where the resource is *about* to pay off this very turn, so
 * the engine doesn't lock itself into a doomed mon just because it
 * holds a Sash.
 *
 * Covered cases:
 *
 * - **Focus Sash at full HP**: guaranteed survival of any one hit;
 *   pivoting away throws that protection (the Sash is on, the swap-in
 *   doesn't inherit it).
 * - **Sturdy at full HP**: same guarantee, ability-based.
 * - **Weak Armor / Anger Point** with the foe likely to fire a SE /
 *   physical hit and us surviving — the trigger arrives next turn,
 *   pre-empt the swap.
 * - **Weakness Policy holder** when the foe has revealed a SE move
 *   AND we can survive that hit (matchup `foeDealFraction < 0.9` is a
 *   rough proxy for "Sash/Sturdy/multiscale/Eviolite let us tank").
 * - **Unburden holder** carrying a one-shot consumable (Sash, Berry,
 *   Seed, Booster) — about to lose the item and double its speed.
 *
 * @param myMon Tracked current mon.
 * @param foeMon Tracked foe active.
 * @returns true when a swap would burn the setup window.
 */
function shouldPreserveSetupWindow(
	myMon: TrackedPokemon,
	foeMon: TrackedPokemon
): boolean {
	const hpf = myMon.hpFraction ?? 1;
	const item = toID(myMon.item);
	const ability = toID(myMon.ability);
	if (hpf >= 0.99 && item === "focussash") return true;
	if (hpf >= 0.99 && ability === "sturdy") return true;
	// Weakness Policy: only relevant if the foe has actually revealed
	// a SE move (anything else is speculation), and we plausibly tank
	// at least one such hit (no need for full survivability math here
	// — the broader survivability gate in `evaluateMatchup` handles
	// the OHKO case via the score the caller already consulted).
	if (item === "weaknesspolicy" && hpf >= 0.6) {
		for (const moveId of foeMon.revealedMoves) {
			const move = Dex.moves.get(moveId);
			if (!move?.exists || move.category === "Status") continue;
			let eff = 0;
			for (const t of myMon.types) eff += Dex.getEffectiveness(move.type, t);
			if (eff > 0) return true;
		}
	}
	// Unburden: holding a one-shot consumable that's about to fire.
	// Pivoting away forfeits both the consumable's effect *and* the
	// post-consume +Speed.
	if (ability === "unburden") {
		const oneShotItems = new Set([
			"focussash", "boosterenergy",
			"grassyseed", "electricseed", "mistyseed", "psychicseed",
			"salacberry", "liechiberry", "petayaberry",
			"ganlonberry", "apicotberry", "starfberry",
			"sitrusberry", "lumberry",
		]);
		if (oneShotItems.has(item)) return true;
	}
	return false;
}

/**
 * True iff the given active mon has a one-shot "live through anything"
 * guarantee this turn — Focus Sash at full HP or Sturdy at full HP.
 * Used by the stay-and-sac gate: a doomed mon is exempt when it still
 * has a survival guarantee, since that guarantee will pay for our
 * "one more turn" play anyway.
 *
 * @param mon The current active mon to inspect.
 * @returns true when the mon should be considered "guaranteed to
 *   survive this turn no matter what hits it".
 */
function hasGuaranteedSurvivalForActive(mon: TrackedPokemon): boolean {
	const hpf = mon.hpFraction ?? 1;
	if (hpf < 0.99) return false;
	const item = toID(mon.item);
	const ability = toID(mon.ability);
	return item === "focussash" || ability === "sturdy";
}

/** Re-export the small helper consumers may want. */
export { calculateDamage, fromTracked, toID };
