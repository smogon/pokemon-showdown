/**
 * Opponent move-set / item / ability inference.
 *
 * Showdown's `request` JSON exposes only what the player is allowed to
 * see: species, level, types, HP%, base ability hint (often partial),
 * and item only when revealed. The strategic AI tracks every protocol
 * event ({@link BattleStateTracker}) so we can layer informed guesses
 * on top of that:
 *
 * - **Item inference:** if a foe has been on the field through Stealth
 *   Rock without taking damage, it's holding Heavy-Duty Boots. If a
 *   physical Ground move missed (or hit and did nothing), the foe has
 *   Air Balloon. Lots of survives-at-1HP signal Focus Sash. Repeating
 *   the same attacking move two turns in a row strongly implies a
 *   Choice item.
 * - **Ability inference:** the simulator emits `|-ability|` on activation
 *   for many abilities (Intimidate, Mold Breaker, Sand Stream, etc.); we
 *   pick those up directly via the tracker. Otherwise, we limit guesses
 *   to legal abilities (`Dex.species.get(...).abilities`).
 * - **Move-set inference:** revealed moves come from the tracker; for
 *   the rest, we sample a uniform prior over the moves the species can
 *   legally know *in the current gen at the mon's level* (level-up
 *   moves above its level are excluded; machine / tutor / egg sources
 *   are level-free). Species without current-gen learnset data fall
 *   back to the full multi-gen learnset.
 *
 * The output is always a probability distribution over moves /
 * abilities / items, never a single guess. Search engines (one-ply,
 * MCTS) sample from these distributions rather than committing to a
 * "guessed" build.
 *
 * @license MIT
 */
import { Dex, toID } from "../../../dex";
import type { Move } from "../../../dex-moves";
import type { Species } from "../../../dex-species";
import type { BattleStateTracker, TrackedPokemon } from "./BattleStateTracker";

/**
 * Probability distribution over a discrete set of values. Values
 * sum to ~1.0 (small float drift acceptable). Keys are ids.
 */
export type Distribution<K extends string = string> = Map<K, number>;

/** Aggregate inference about a single foe Pokemon. */
export interface FoeInference {
	/** The tracked record this inference is about. */
	mon: TrackedPokemon;
	/** Move-id distribution over the foe's *unrevealed* slots. */
	moves: Distribution;
	/** Ability-id distribution. */
	abilities: Distribution;
	/** Item-id distribution. */
	items: Distribution;
	/** True if we believe the foe is locked into its last move (Choice). */
	choiceLocked: boolean;
	/** True if we believe the foe holds Heavy-Duty Boots. */
	hasBoots: boolean;
	/** True if we believe the foe holds Air Balloon. */
	hasAirBalloon: boolean;
}

/**
 * Build a fresh inference snapshot for the foe's active Pokemon. Cheap
 * to call every turn; designed not to do learnset lookups twice in a
 * row for the same species.
 */
export function inferFoeActive(tracker: BattleStateTracker): FoeInference | null {
	const foe = tracker.foeActive;
	if (!foe) return null;
	return inferMon(tracker, foe);
}

/** Inference for an arbitrary tracked Pokemon (any side). */
export function inferMon(tracker: BattleStateTracker, mon: TrackedPokemon): FoeInference {
	const moves = inferMoves(mon);
	const abilities = inferAbilities(mon);
	const items = inferItems(tracker, mon);
	const hasBoots = (mon.item ? toID(mon.item) === "heavydutyboots" : (items.get("heavydutyboots") ?? 0) > 0.5);
	const hasAirBalloon = (mon.item ? toID(mon.item) === "airballoon" : (items.get("airballoon") ?? 0) > 0.5);
	return {
		mon,
		moves,
		abilities,
		items,
		choiceLocked: mon.choiceLocked,
		hasBoots,
		hasAirBalloon,
	};
}

/** Top-N most-likely moves the foe might use this turn. */
export function topMoves(inf: FoeInference, n: number): string[] {
	const entries = Array.from(inf.moves.entries()).sort((a, b) => b[1] - a[1]);
	return entries.slice(0, n).map(([id]) => id);
}

// -----------------------------------------------------------------------
// Internals
// -----------------------------------------------------------------------

/** Cache of parsed learnsets per `${speciesId}|${gen}`. */
const learnsetCache = new Map<string, LearnableMove[]>();

function inferMoves(mon: TrackedPokemon): Distribution {
	const dist: Distribution = new Map();
	// Revealed moves get high mass.
	const revealed = Array.from(mon.revealedMoves);
	if (mon.choiceLocked && mon.lastMove) {
		dist.set(mon.lastMove, 1);
		return dist;
	}
	const revealedShare = Math.min(0.85, revealed.length * 0.25);
	const remaining = 1 - revealedShare;
	for (const id of revealed) {
		dist.set(id, revealedShare / Math.max(1, revealed.length));
	}
	// Spread `remaining` over the species' legal moves we haven't seen yet.
	const learnset = legalMoves(mon);
	const unseen = learnset.filter(m => !revealed.includes(m));
	if (unseen.length === 0) {
		// No unseen moves to absorb the remaining mass — renormalize the
		// existing entries so the `Distribution` invariant (probabilities
		// sum to ~1) holds for downstream consumers.
		let total = 0;
		for (const v of dist.values()) total += v;
		if (total > 0) {
			for (const [id, v] of Array.from(dist.entries())) {
				dist.set(id, v / total);
			}
		}
		return dist;
	}
	const per = remaining / unseen.length;
	for (const id of unseen) {
		dist.set(id, (dist.get(id) || 0) + per);
	}
	return dist;
}

/**
 * Type-immunity abilities the `|-immune|` log signal can implicate,
 * keyed by the immune move type. Shared by ability and item inference.
 */
const IMMUNITY_ABILITIES: Record<string, string[]> = {
	Ground: ["levitate", "eartheater"],
	Fire: ["flashfire", "wellbakedbody"],
	Water: ["waterabsorb", "stormdrain", "dryskin"],
	Electric: ["voltabsorb", "lightningrod", "motordrive"],
	Grass: ["sapsipper"],
};

function inferAbilities(mon: TrackedPokemon): Distribution {
	const dist: Distribution = new Map();
	if (mon.ability) {
		dist.set(toID(mon.ability), 1);
		return dist;
	}
	const species = Dex.species.get(mon.species);
	if (!species?.exists) {
		dist.set("", 1);
		return dist;
	}
	const choices = uniqueAbilityIds(species);
	if (choices.length === 0) {
		dist.set("", 1);
		return dist;
	}
	// An observed unexplained immunity (tracker `|-immune|` analysis)
	// pins the ability hard when the species can legally carry a
	// matching immunity ability — e.g. a Ground "miss" on a non-Flying
	// Bronzong is Levitate, full stop.
	for (const type of mon.inferredImmunities) {
		const candidates = IMMUNITY_ABILITIES[type]?.filter(a => choices.includes(a));
		if (!candidates?.length) continue;
		const per = 0.9 / candidates.length;
		for (const id of candidates) dist.set(id, per);
		const rest = choices.filter(c => !candidates.includes(c));
		for (const id of rest) dist.set(id, 0.1 / rest.length);
		return dist;
	}
	const per = 1 / choices.length;
	for (const id of choices) dist.set(id, per);
	return dist;
}

function inferItems(tracker: BattleStateTracker, mon: TrackedPokemon): Distribution {
	const dist: Distribution = new Map();
	if (mon.item !== undefined && mon.item !== "") {
		dist.set(toID(mon.item), 1);
		return dist;
	}
	if (mon.item === "") {
		// Item explicitly removed; treat as known-empty.
		dist.set("", 1);
		return dist;
	}
	// Heuristics from observed events.
	let bootsScore = 0;
	let sashScore = 0;
	let balloonScore = 0;
	let evioliteScore = 0;
	let choiceScore = 0;
	let leftoversScore = 0;
	let avScore = 0;

	// Heavy-Duty Boots: foe stayed in through hazards on its side without
	// hazard damage. Approximated: if hazards exist on the foe side and
	// the foe is at >75% HP after several turns, slightly boost boots.
	const ss = tracker.sides[tracker.foeSide];
	if ((ss.stealthRock || ss.spikes > 0 || ss.stickyWeb) && mon.hpFraction >= 0.95 && tracker.turn > 1) {
		bootsScore += 0.5;
	}

	// Choice items: if the foe used the same move twice in a row.
	if (mon.sameMoveStreak >= 2) choiceScore += 0.6;
	if (mon.choiceLocked) choiceScore += 0.4;

	// Eviolite: NFE foes default to Eviolite in singles.
	const species = Dex.species.get(mon.species);
	if (species?.exists && species.nfe) evioliteScore += 0.6;

	// Air Balloon: tracker emits `|-item|airballoon|` when the user is
	// hit; before that the strongest signal is an *unexplained* Ground
	// immunity from the `|-immune|` analysis — when the species can't
	// legally run Levitate / Earth Eater, the balloon is the only
	// remaining explanation. Otherwise fall back to the weak
	// species-typing prior.
	if (mon.inferredImmunities.has("Ground")) {
		const legal = species?.exists ? uniqueAbilityIds(species) : [];
		const abilityExplains = legal.some(a => IMMUNITY_ABILITIES.Ground.includes(a));
		if (!abilityExplains) balloonScore += 0.8;
	} else if (species?.exists) {
		const tagged = species.types.includes("Electric") || species.types.includes("Steel");
		if (tagged) balloonScore += 0.05;
	}

	leftoversScore = 0.05; // Generic prior.
	avScore = 0.05;
	sashScore = 0.05;

	// Normalise the heuristic mass so the distribution sums to ~1.0 even
	// when individual heuristics over-allocate (e.g. an NFE foe through
	// hazards mid choice-streak can otherwise total ~1.85).
	const totals =
		bootsScore + sashScore + balloonScore + evioliteScore +
		choiceScore + leftoversScore + avScore;
	const scale = totals > 1 ? 1 / totals : 1;
	const rest = totals > 1 ? 0 : Math.max(0, 1 - totals);
	dist.set("heavydutyboots", bootsScore * scale);
	dist.set("focussash", sashScore * scale);
	dist.set("airballoon", balloonScore * scale);
	dist.set("eviolite", evioliteScore * scale);
	dist.set("choicescarf", choiceScore * 0.45 * scale);
	dist.set("choiceband", choiceScore * 0.35 * scale);
	dist.set("choicespecs", choiceScore * 0.20 * scale);
	dist.set("leftovers", leftoversScore * scale);
	dist.set("assaultvest", avScore * scale);
	dist.set("", rest);
	return dist;
}

/** One learnable move with its current-gen availability. */
interface LearnableMove {
	id: string;
	/** True when the move has at least one current-gen learn source. */
	inGen: boolean;
	/**
	 * Lowest level the move becomes available at in the current gen.
	 * 0 for level-free sources (machine / tutor / egg / event).
	 */
	minLevel: number;
}

/**
 * Parse the species' learnset into {@link LearnableMove} records,
 * cached per species+gen. Showdown stores learnsets by the *base*
 * species (cosmetic forms share); sources are encoded like `9L36`
 * (gen 9, level-up at 36), `9M` (machine), `8T` (tutor), `9E` (egg).
 *
 * @param species The species name or id to look up.
 * @returns Every dex-valid move the species can know in any gen, with
 *   current-gen availability metadata.
 */
function learnableMoves(species: string): LearnableMove[] {
	const gen = Dex.gen;
	const key = `${toID(species)}|${gen}`;
	const cached = learnsetCache.get(key);
	if (cached) return cached;
	const result: LearnableMove[] = [];
	const speciesObj = Dex.species.get(species);
	if (!speciesObj?.exists) {
		learnsetCache.set(key, result);
		return result;
	}
	const data = (Dex as unknown as { data: { Learnsets?: Record<string, { learnset?: Record<string, string[]> }> } }).data;
	const ls = data?.Learnsets?.[toID(species)]?.learnset ??
		data?.Learnsets?.[toID(speciesObj.baseSpecies)]?.learnset;
	if (ls) {
		for (const [moveId, sources] of Object.entries(ls)) {
			const mv: Move | undefined = Dex.moves.get(moveId);
			if (!mv?.exists) continue;
			let inGen = false;
			let minLevel = Infinity;
			for (const source of sources) {
				const m = /^(\d+)([A-Z])(\d*)/.exec(source);
				if (!m || parseInt(m[1]) !== gen) continue;
				inGen = true;
				const levelGate = m[2] === "L" ? parseInt(m[3]) || 0 : 0;
				if (levelGate < minLevel) minLevel = levelGate;
				if (minLevel === 0) break;
			}
			result.push({ id: moveId, inGen, minLevel: inGen ? minLevel : 0 });
		}
	}
	learnsetCache.set(key, result);
	return result;
}

/**
 * Moves `mon` could legally know right now: current-gen sources only,
 * with level-up moves above the mon's level excluded. Falls back to
 * the full multi-gen learnset when the species has no current-gen
 * data at all (custom formats / modded species).
 *
 * @param mon The tracked Pokemon whose move pool we're estimating.
 * @returns Legal move ids for the prior distribution.
 */
function legalMoves(mon: TrackedPokemon): string[] {
	const all = learnableMoves(mon.species);
	const inGen = all.filter(m => m.inGen);
	const pool = inGen.length > 0 ? inGen : all;
	const level = mon.level || 100;
	return pool.filter(m => m.minLevel <= level).map(m => m.id);
}

function uniqueAbilityIds(species: Species): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	const abilities = species.abilities ?? {};
	for (const slot of ["0", "1", "H", "S"] as const) {
		const a = (abilities as unknown as Record<string, string>)[slot];
		if (!a) continue;
		const id = toID(a);
		if (id && !seen.has(id)) {
			seen.add(id);
			out.push(id);
		}
	}
	return out;
}
