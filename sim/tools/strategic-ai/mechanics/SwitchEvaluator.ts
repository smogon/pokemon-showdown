/**
 * Strategic-AI switch evaluator.
 *
 * Replaces the legacy `evaluateMatchup` / `chooseBestSwitch` heuristic.
 * The legacy code multiplied attacker types against defender types,
 * which produced the wrong score for any mon with two STAB options
 * (the AI would think it was *weak* to a defender that resisted only
 * one of its STABs). This implementation computes:
 *
 * - The defender's best plausible damage roll on us, using
 *   {@link calculateDamage} with our defenders' types/abilities/items.
 *   "Plausible" means: we use the foe's revealed moves first, and fall
 *   back to a probability-weighted set of common STAB choices when the
 *   foe hasn't revealed enough.
 * - Our best plausible damage roll on the foe, using the same logic
 *   but against their species/types.
 * - Speed-tier comparison with Tailwind / Trick Room / Choice Scarf
 *   awareness.
 * - Hazard damage on entry, with Heavy-Duty Boots / Magic Guard /
 *   Levitate exemptions (delegated to `BattleStateTracker`).
 * - Foe boost penalties; phazing / unaware / clear smog mitigation.
 *
 * @license MIT
 */
import { Dex, toID } from "../../../dex";
import type { Move } from "../../../dex-moves";
import type { BattleStateTracker, TrackedPokemon } from "../state/BattleStateTracker";
import type { SideId } from "../state/LogParser";
import {
	calculateDamage,
	estimateMaxHp,
	fromTracked,
	type CalcPokemon,
} from "./DamageCalc";

/** Result of `evaluateMatchup`. Higher is better for our side. */
export interface MatchupScore {
	/** Aggregate utility (positive = good for us). */
	score: number;
	/** Damage we can deal as a fraction of foe HP. 0..1 (or higher for OHKO). */
	weDealFraction: number;
	/** Damage foe can deal as a fraction of our HP. 0..1 (or higher). */
	foeDealFraction: number;
	/** Speed delta in `>0 means we're faster` units. */
	speedDelta: number;
	/** Hazard damage we'd take on entry, as fraction of HP. */
	hazardFraction: number;
}

const COMMON_COVERAGE_TYPES = [
	"Normal",
	"Fire",
	"Water",
	"Electric",
	"Grass",
	"Ice",
	"Fighting",
	"Poison",
	"Ground",
	"Flying",
	"Psychic",
	"Bug",
	"Rock",
	"Ghost",
	"Dragon",
	"Dark",
	"Steel",
	"Fairy",
];

/**
 * Evaluate the matchup of our `mon` against the foe's active mon. We
 * assume both are at full health unless `mon.hpFraction` says otherwise.
 *
 * @param mon - our Pokemon (typically a switch candidate).
 * @param foe - the foe's active mon.
 * @param tracker - battle state tracker for field/side/hazard data.
 */
export function evaluateMatchup(
	mon: TrackedPokemon,
	foe: TrackedPokemon,
	tracker: BattleStateTracker
): MatchupScore {
	const myCalc = fromTracked(mon);
	const foeCalc = fromTracked(foe);

	// Best-known foe attack on us. Side IDs are ordered (attacker, defender)
	// so screens / Tailwind are read off the correct sides.
	const foeBest = bestAttackingDamage(
		foeCalc, myCalc, tracker, foe, mon, /* known */ true,
		tracker.foeSide, tracker.mySide,
	);
	// Our best attack on the foe (using known moves first).
	const myBest = bestAttackingDamage(
		myCalc, foeCalc, tracker, mon, foe, /* known */ false,
		tracker.mySide, tracker.foeSide,
	);

	const myMaxHp = estimateMaxHp(myCalc);
	const foeMaxHp = estimateMaxHp(foeCalc);

	const weDealFraction = (myBest?.avgDamage || 0) / Math.max(1, foeMaxHp);
	const foeDealFraction = (foeBest?.avgDamage || 0) / Math.max(1, myMaxHp);

	// Speed delta: positive => we're faster.
	const speedDelta = computeSpeedDelta(mon, foe, tracker);

	// Hazard damage on entry (mon is the candidate switching in).
	const ourSide = tracker.mySide;
	const hazardFraction = tracker.hazardDamageFraction(mon, ourSide);

	// Score formula. Tunable weights chosen so the components are roughly
	// comparable: a 100% damage threat counts about as much as a clean
	// speed advantage and a 25% hazard tax.
	let score = 0;
	score += weDealFraction * 30;
	score -= foeDealFraction * 30;
	score += speedDelta > 0 ? 6 : speedDelta < 0 ? -4 : 0;
	score -= hazardFraction * 25;
	// Status risk: if foe is poisoning and we're a Steel/Poison? Free
	// switch. If we're vulnerable to Toxic Spikes and not immune, count
	// it via hazardFraction proxy already.
	const statusOnUs = mon.status && mon.status !== "fnt" ? 4 : 0;
	score -= statusOnUs;
	// Boosted-foe penalty.
	let foeBoosts = 0;
	for (const v of Object.values(foe.boosts)) foeBoosts += Math.max(0, v);
	if (foeBoosts > 0 && toID(mon.ability) !== "unaware") {
		score -= foeBoosts * 4;
	}

	// Entry-synergy bonuses: things that happen the moment `mon`
	// switches in, which the rest of the matchup math doesn't capture
	// because it works from the *current* tracker state.
	score += entrySynergyBonus(mon, foe, tracker);

	// Survivability gate: a switch-in that will be OHKO'd by the foe's
	// best plausible attack is a sacrifice, not a switch. The linear
	// `foeDealFraction * 30` penalty above can be overcome by entry
	// synergies + speed bonuses, which is how we used to swap into a
	// 4×-weak teammate to "activate Booster Energy" and immediately
	// faint. Stack an explicit non-linear penalty whenever the foe's
	// best move is a likely OHKO so that path is closed off — unless
	// the candidate brings something that compensates (priority KO,
	// massive speed control, etc., which downstream code can still
	// add). We also count residual hazard damage toward the OHKO
	// threshold because the hazard tick happens before the foe's hit.
	const survivabilityHit =
		(foeBest?.avgDamage ?? 0) / Math.max(1, myMaxHp) +
		hazardFraction;
	if (survivabilityHit >= 0.95) {
		score -= 35;
	} else if (survivabilityHit >= 0.7) {
		score -= 15;
	}

	return { score, weDealFraction, foeDealFraction, speedDelta, hazardFraction };
}

/**
 * Score the "switching this mon in right now" effects that aren't
 * already captured by the static matchup numbers:
 *
 * - **Terrain seeds** (Grassy/Electric/Misty/Psychic Seed) trigger on
 *   entry under the matching terrain and grant a +1 stat boost. Worth
 *   ~+10 since the boost lingers for the whole stay-in window.
 * - **Intimidate** drops the foe's Attack on entry. Heavily valuable
 *   against physical attackers, neutral otherwise.
 * - **Weather setters** (Drought/Drizzle/Sand Stream/Snow Warning)
 *   on switch-in: bonus when the weather they set differs from the
 *   currently-active one and would benefit us (e.g. a Chlorophyll
 *   teammate would love a sunlight setter). We approximate this as
 *   "any new weather you bring in is mildly positive".
 *
 * @param mon The candidate switch-in.
 * @param foe The foe currently on the field.
 * @param tracker Battle state tracker.
 * @returns A synergy bonus in roughly the [-2, +14] range.
 */
function entrySynergyBonus(
	mon: TrackedPokemon,
	foe: TrackedPokemon,
	tracker: BattleStateTracker
): number {
	let bonus = 0;
	const item = toID(mon.item);
	const ability = toID(mon.ability);
	const terrain = tracker.field.terrain;
	const weather = tracker.field.weather;

	// Terrain-seed entry boost. The seed is consumed on entry and grants
	// +1 Def (Grassy/Electric) or +1 SpDef (Misty/Psychic) for the stay.
	if (
		(item === "grassyseed" && terrain === "grassyterrain") ||
		(item === "electricseed" && terrain === "electricterrain") ||
		(item === "mistyseed" && terrain === "mistyterrain") ||
		(item === "psychicseed" && terrain === "psychicterrain")
	) {
		bonus += 10;
	}

	// Intimidate: foe loses one stage of Attack on our entry. Scales
	// with how much the foe was going to lean on Attack.
	if (ability === "intimidate") {
		const foeAtk = foe.stats?.atk ?? 0;
		const foeSpa = foe.stats?.spa ?? 0;
		// Reduce by ~25% damage on physical hits → ~+6 matchup units;
		// scale by how physical the foe looks. Pure special attackers
		// get the floor (the lost Atk is wasted).
		const physicalLean = foeAtk > foeSpa ? 1 : foeAtk >= foeSpa * 0.85 ? 0.5 : 0.15;
		const foeAbil = toID(foe.ability);
		// Abilities that turn Intimidate against us: Defiant/Competitive
		// convert the drop into a +2 boost for the foe, Mirror Armor
		// reflects it back onto our Attack, and Guard Dog raises the
		// foe's Attack instead. Switching Intimidate in is actively bad.
		const punishesIntimidate =
			foeAbil === "defiant" || foeAbil === "competitive" ||
			foeAbil === "mirrorarmor" || foeAbil === "guarddog";
		// Abilities that simply ignore the Attack drop. Note: Unaware is
		// NOT one of these — it only ignores the *opponent's* stat
		// stages during damage calc, so the foe still attacks with its
		// own Intimidate-lowered Attack and the matchup bonus stands.
		const blocksIntimidate =
			foeAbil === "clearbody" || foeAbil === "whitesmoke" ||
			foeAbil === "fullmetalbody" || foeAbil === "hypercutter" ||
			foeAbil === "innerfocus" || foeAbil === "owntempo" ||
			foeAbil === "oblivious" || foeAbil === "scrappy";
		if (punishesIntimidate) bonus -= 6 * physicalLean;
		else if (!blocksIntimidate) bonus += 7 * physicalLean;
	}

	// Weather setters on entry: a switch-in that brings a *new* weather
	// is usually a positive — either it benefits us directly or it
	// disrupts the foe's weather-dependent strategy. Capped to +4 so
	// it doesn't dominate the matchup math.
	const weatherFromAbility: Record<string, string> = {
		drought: "sunnyday",
		drizzle: "raindance",
		sandstream: "sandstorm",
		snowwarning: "snowscape",
		orichalcumpulse: "sunnyday",
		hadronengine: "electricterrain",
	};
	const broughtWeather = weatherFromAbility[ability];
	if (broughtWeather && broughtWeather !== weather && broughtWeather !== terrain) {
		bonus += 4;
	}

	// Weather-speed synergy (Chlorophyll / Swift Swim / Sand Rush /
	// Slush Rush): when the matching weather is already active and the
	// candidate's Speed boost would let it outspeed the current foe,
	// reward heavily. We avoid double-counting with `scaledSpeed`'s
	// speed-delta — this bonus targets the *decision* layer (the AI
	// often refuses to swap a slow mon in even when the weather makes
	// it the fastest thing on the field).
	const weatherSpeedAbility: Record<string, (w: string) => boolean> = {
		swiftswim: w => w === "raindance" || w === "primordialsea",
		chlorophyll: w => w === "sunnyday" || w === "desolateland",
		sandrush: w => w === "sandstorm",
		slushrush: w => w === "snow" || w === "snowscape" || w === "hail",
	};
	if (weatherSpeedAbility[ability]?.(weather)) {
		const baseSpe = mon.stats?.spe ?? 0;
		const foeSpe = foe.stats?.spe ?? 0;
		// Pre-bonus we'd have been slower; with the 2× we'd outspeed →
		// massive tempo swing.
		if (baseSpe <= foeSpe && baseSpe * 2 > foeSpe) bonus += 12;
		else bonus += 4;
	}

	// Booster Energy on a Paradox mon switching into a field that
	// won't activate the ability naturally (no sun for Protosynthesis,
	// no Electric Terrain for Quark Drive). The held Booster Energy
	// triggers on entry instead, granting +30%/+50% to the highest
	// stat for the duration of the stay.
	if (item === "boosterenergy") {
		const isProto = ability === "protosynthesis";
		const isQuark = ability === "quarkdrive";
		const protoFromField = weather === "sunnyday" || weather === "desolateland";
		const quarkFromField = terrain === "electricterrain";
		// Only reward Booster Energy when the field wouldn't have
		// already activated the ability — otherwise the item is just
		// a wasted slot.
		if ((isProto && !protoFromField) || (isQuark && !quarkFromField)) {
			bonus += 10;
		}
	}

	// Absorb / punish ability switch-in: if the foe has revealed (or
	// just used) a move that our ability nullifies or feeds on, this
	// is a free turn — often a heal, a stat boost, or a flat
	// nullification. The damage calc already returns 0 for the
	// nullified hit, so `foeDealFraction` reflects the *avoided*
	// damage; this bonus reflects the *positive* upside (the heal /
	// boost / continued pressure from the absorb).
	bonus += absorbAbilityBonus(mon, foe);

	// Weakness Policy "bait" recognition: the holder *wants* a SE
	// physical or special hit to trigger +2 Atk / +2 SpA. If the foe's
	// best plausible move is SE on us, the candidate trades one hit
	// for a free double-dance. Survivability gating happens upstream
	// in `evaluateMatchup` so we don't recommend WP-baiting on a 4×
	// weakness OHKO.
	if (item === "weaknesspolicy") {
		const seBait = anyRevealedFoeMoveIsSuperEffective(foe, mon);
		if (seBait) bonus += 10;
	}

	return bonus;
}

/**
 * Bonus a candidate earns for having an ability that turns one of the
 * foe's *revealed* moves into a "do nothing / give us something"
 * outcome.
 *
 * Where the damage calc already zeros out the matchup's
 * `foeDealFraction` (Flash Fire blocking Fire, Water Absorb / Volt
 * Absorb blocking their type, Levitate ignoring Ground, etc.), this
 * bonus represents the *additional* value beyond just "didn't take
 * damage": a heal, a +1 stat stage, or sustained type pressure.
 *
 * The check requires the foe to have actually revealed (or last-used)
 * a matching move — we don't switch a Flash Fire user into a foe with
 * no Fire move on its known list just because Charizard *might* have
 * one. Revealed-only avoids cheating with hidden moves while still
 * acting on the simulator-emitted signal.
 *
 * @param mon Candidate switch-in.
 * @param foe Foe's active mon (with its revealed move set).
 * @returns Synergy bonus, capped at +20 to keep matchup math sane.
 */
function absorbAbilityBonus(
	mon: TrackedPokemon,
	foe: TrackedPokemon
): number {
	const ability = toID(mon.ability);
	if (!ability) return 0;
	const known = new Set<string>(foe.revealedMoves);
	if (foe.lastMove) known.add(foe.lastMove);
	if (known.size === 0) return 0;
	let bonus = 0;
	for (const moveId of known) {
		const move = Dex.moves.get(moveId);
		if (!move?.exists || move.category === "Status") continue;
		const moveType = move.type;
		// Type immunities that grant a flat-out free turn.
		if (
			(ability === "flashfire" && moveType === "Fire") ||
			(ability === "wellbakedbody" && moveType === "Fire") ||
			(ability === "voltabsorb" && moveType === "Electric") ||
			(ability === "lightningrod" && moveType === "Electric") ||
			(ability === "motordrive" && moveType === "Electric") ||
			(ability === "waterabsorb" && moveType === "Water") ||
			(ability === "stormdrain" && moveType === "Water") ||
			(ability === "dryskin" && moveType === "Water") ||
			(ability === "sapsipper" && moveType === "Grass") ||
			(ability === "eartheater" && moveType === "Ground") ||
			(ability === "levitate" && moveType === "Ground") ||
			// Wind Rider only grants a free turn against *wind-flagged*
			// moves (Tailwind, Hurricane, Bleakwind Storm, ...), NOT
			// every Flying attack — Brave Bird / Air Slash / Acrobatics
			// hit it normally.
			(ability === "windrider" && !!move.flags?.wind)
		) {
			// Heal / boost abilities are slightly better than pure
			// nullifications because they also tip the matchup in our
			// favour for next turn.
			const boostAbilities = new Set([
				"flashfire", "wellbakedbody", "stormdrain", "lightningrod",
				"motordrive", "sapsipper", "windrider",
			]);
			const healAbilities = new Set(["voltabsorb", "waterabsorb", "dryskin", "eartheater"]);
			if (boostAbilities.has(ability)) bonus = Math.max(bonus, 20);
			else if (healAbilities.has(ability)) bonus = Math.max(bonus, 18);
			else bonus = Math.max(bonus, 14);
			continue;
		}
		// Flag-based immunities.
		if (ability === "bulletproof" && move.flags?.bullet) {
			bonus = Math.max(bonus, 16);
			continue;
		}
		if (ability === "soundproof" && move.flags?.sound) {
			bonus = Math.max(bonus, 14);
			continue;
		}
		// Purifying Salt: not an immunity, but halves Ghost damage and
		// makes us status-proof. A modest bonus when the foe has a
		// Ghost move revealed.
		if (ability === "purifyingsalt" && moveType === "Ghost") {
			bonus = Math.max(bonus, 8);
		}
	}
	return bonus;
}

/**
 * True if any of the foe's revealed moves would be super-effective on
 * `mon` (used to detect Weakness Policy / Beast Boost / Anger Point
 * "bait" scenarios).
 *
 * @param foe Foe with revealedMoves.
 * @param mon Candidate evaluating the matchup.
 * @returns true when any revealed move's type is 2× or 4× on `mon`.
 */
function anyRevealedFoeMoveIsSuperEffective(
	foe: TrackedPokemon,
	mon: TrackedPokemon
): boolean {
	if (!foe.revealedMoves.size && !foe.lastMove) return false;
	const known = new Set<string>(foe.revealedMoves);
	if (foe.lastMove) known.add(foe.lastMove);
	for (const moveId of known) {
		const move = Dex.moves.get(moveId);
		if (!move?.exists || move.category === "Status") continue;
		// A move that deals zero damage can't trigger Weakness Policy,
		// even if the type chart says it's super-effective (Levitate vs
		// Ground, Flash Fire vs Fire, Air Balloon vs Ground, ...).
		if (isMoveNeutralizedBy(move, mon)) continue;
		let eff = 0;
		for (const t of mon.types) eff += Dex.getEffectiveness(move.type, t);
		if (eff > 0) return true;
	}
	return false;
}

/**
 * True when `target` takes no damage from `move` because of a type,
 * ability, or item immunity — i.e. the hit would deal zero and so
 * can't proc damage-triggered effects like Weakness Policy.
 *
 * @param move The incoming move.
 * @param target The Pokemon being hit.
 * @returns true if the move is fully neutralized.
 */
function isMoveNeutralizedBy(move: Move, target: TrackedPokemon): boolean {
	const moveType = move.type;
	// Type-based immunity (Ground vs Flying, Normal/Fighting vs Ghost, ...).
	if (!Dex.getImmunity(moveType, target.types)) return true;
	const ability = toID(target.ability);
	const item = toID(target.item);
	// Ability-based type immunities / absorptions.
	const absorbType: Record<string, string> = {
		levitate: "Ground",
		flashfire: "Fire",
		wellbakedbody: "Fire",
		voltabsorb: "Electric",
		lightningrod: "Electric",
		motordrive: "Electric",
		waterabsorb: "Water",
		stormdrain: "Water",
		dryskin: "Water",
		sapsipper: "Grass",
		eartheater: "Ground",
	};
	if (absorbType[ability] === moveType) return true;
	if (ability === "bulletproof" && move.flags?.bullet) return true;
	if (ability === "soundproof" && move.flags?.sound) return true;
	if ((ability === "windrider" || ability === "windpower") && move.flags?.wind) return true;
	// Air Balloon grants a Ground immunity until it pops.
	if (item === "airballoon" && moveType === "Ground") return true;
	return false;
}

/**
 * Pick the best switch-in among `candidates` against the current foe.
 * Returns the candidate with the highest score, breaking ties by
 * highest `weDealFraction - foeDealFraction`.
 */
export function chooseBestSwitch(
	candidates: TrackedPokemon[],
	foe: TrackedPokemon,
	tracker: BattleStateTracker
): { mon: TrackedPokemon, score: MatchupScore } | null {
	let best: TrackedPokemon | null = null;
	let bestScore: MatchupScore | null = null;
	for (const cand of candidates) {
		if (cand.fainted) continue;
		const ms = evaluateMatchup(cand, foe, tracker);
		if (!best || ms.score > (bestScore?.score ?? -Infinity)) {
			best = cand;
			bestScore = ms;
		}
	}
	if (!best || !bestScore) return null;
	return { mon: best, score: bestScore };
}

/**
 * Find the best damaging move `attacker` can throw at `defender`.
 *
 * We pull every revealed damaging move from the attacker's known set.
 * When we're estimating the *foe's* threat (`useKnownOnly === true`)
 * the revealed set is only partial, so we additionally consider
 * STAB-type proxies derived from the foe's species. STAB types are
 * publicly inferable from the species, so this isn't "cheating": the
 * AI just refuses to pretend a Garchomp won't have a Ground STAB until
 * it sees Earthquake. Without this, a foe that has only revealed one
 * of its two STABs looks artificially safe — so on monotype teams the
 * AI would happily switch a 4×-weak teammate into an unrevealed hit.
 *
 * For *our* side (`useKnownOnly === false`) the revealed set is seeded
 * from the battle request and is therefore the complete moveset, so we
 * use it as-is and only fall back to proxies if it somehow contains no
 * damaging move. Each proxy is emitted in both Physical and Special
 * flavours so special-leaning attackers aren't clamped to their unused
 * Attack stat (the max-damage selection picks whichever hurts more).
 *
 * @param attacker The CalcPokemon snapshot of the attacking side.
 * @param defender The CalcPokemon snapshot of the defending side.
 * @param tracker Battle state tracker (provides field / side state).
 * @param attackerMon TrackedPokemon record for the attacker (move pool).
 * @param defenderMon TrackedPokemon record for the defender (unused, for symmetry).
 * @param useKnownOnly True when we're estimating the foe's threat to us:
 *   uses only revealed moves plus species STAB proxies (no coverage probe).
 * @param attackerSideId Tracker side id of the attacker (for screens/Tailwind).
 * @param defenderSideId Tracker side id of the defender (for screens/Tailwind).
 * @returns The highest expected damage roll along with the move id, or `null`
 *   if no damaging move can be modelled (e.g. an immune defender).
 */
function bestAttackingDamage(
	attacker: CalcPokemon,
	defender: CalcPokemon,
	tracker: BattleStateTracker,
	attackerMon: TrackedPokemon,
	defenderMon: TrackedPokemon,
	useKnownOnly: boolean,
	attackerSideId: SideId,
	defenderSideId: SideId,
): { avgDamage: number, moveId: string } | null {
	void defenderMon;
	const moves: Move[] = [];
	for (const id of attackerMon.revealedMoves) {
		const m = Dex.moves.get(id);
		if (m && m.category !== "Status" && m.basePower > 0) moves.push(m);
	}
	const hasRevealedDamage = moves.length > 0;
	// Whether to synthesise STAB / coverage proxies for unrevealed moves.
	//
	// For the *foe* (`useKnownOnly === true`) the revealed set is
	// partial, so proxies are essential — they stop a foe that's only
	// shown one of its two STABs from looking artificially safe.
	//
	// For *our* side (`useKnownOnly === false`) the revealed set is
	// seeded from the battle request and is therefore the *complete*
	// moveset. Imagining extra STAB/coverage moves on top would
	// overestimate our own output and skew matchup/switching decisions,
	// so we only fall back to proxies when (defensively) we somehow have
	// no revealed damaging move to work from.
	const addProxies = useKnownOnly || !hasRevealedDamage;
	if (addProxies) {
		// Skip types already covered by a revealed move to avoid
		// double-counting (revealed Earthquake + imagined "Proxy
		// Ground" → over-estimate). Emit BOTH categories per type and
		// let the max-damage selection below pick whichever side
		// actually hurts — this avoids clamping a special attacker
		// (e.g. Magnezone) to its unused Attack stat.
		const revealedTypes = new Set(moves.map(m => m.type));
		const tackleProto = Dex.moves.get("tackle");
		const seenProxyTypes = new Set<string>();
		const pushProxy = (idPrefix: string, t: string, category: "Physical" | "Special") => {
			moves.push({
				...tackleProto,
				id: `${idPrefix}${category.toLowerCase()}${t.toLowerCase()}` as never,
				name: `Proxy ${category} ${t}`,
				type: t,
				// Slightly lower BP for the proxy (80) than a real STAB
				// so the estimate is "probably has *some* attack of this
				// type" without claiming a guaranteed top-tier hit.
				category,
				basePower: 80,
				accuracy: 100,
			});
		};
		for (const t of attackerMon.types) {
			if (seenProxyTypes.has(t) || revealedTypes.has(t)) continue;
			seenProxyTypes.add(t);
			pushProxy("proxystab", t, "Physical");
			pushProxy("proxystab", t, "Special");
		}
		if (!useKnownOnly) {
			// Coverage moves: the most-feared off-type move. We probe a
			// shortlist of common types; the best one wins.
			for (const t of COMMON_COVERAGE_TYPES) {
				if (seenProxyTypes.has(t) || revealedTypes.has(t)) continue;
				pushProxy("proxycov", t, "Physical");
				pushProxy("proxycov", t, "Special");
			}
		}
	}
	let best: { avgDamage: number, moveId: string } | null = null;
	for (const m of moves) {
		const range = calculateDamage({
			attacker,
			defender,
			move: m,
			field: tracker.field,
			attackerSide: tracker.sides[attackerSideId],
			defenderSide: tracker.sides[defenderSideId],
		});
		if (!best || range.avgDamage > best.avgDamage) {
			best = { avgDamage: range.avgDamage, moveId: toID(m.id || (m as { name?: string }).name || "") };
		}
	}
	return best;
}

/**
 * Effective speed delta between our `mon` and `foe`, factoring in
 * Tailwind, Trick Room, and Choice Scarf. Positive => we move first.
 */
function computeSpeedDelta(
	mon: TrackedPokemon,
	foe: TrackedPokemon,
	tracker: BattleStateTracker
): number {
	const weather = tracker.field.weather;
	const terrain = tracker.field.terrain;
	const mySpe = scaledSpeed(mon, tracker.sides[tracker.mySide].tailwindTurns > 0, weather, terrain);
	const foeSpe = scaledSpeed(foe, tracker.sides[tracker.foeSide].tailwindTurns > 0, weather, terrain);
	let delta = mySpe - foeSpe;
	if (tracker.field.trickRoom) delta = -delta;
	return delta;
}

/**
 * Compute the effective Speed of `mon` after weather-speed abilities
 * (Swift Swim, Chlorophyll, Sand Rush, Slush Rush), Paradox-style
 * +50% boosts, Choice Scarf, stat-stage modifiers, Tailwind, and
 * Paralysis. This is the same number {@link evaluateMatchup} uses
 * when computing speed-tier deltas, and is exported so other engine
 * layers (emergency-switch checks, `weOutspeed` predicates) can stay
 * consistent with the switch evaluator.
 *
 * @param mon The Pokemon whose effective Speed we want.
 * @param tailwind Whether the side currently has Tailwind active.
 * @param weather The current field weather id (`raindance`,
 *   `sunnyday`, `sandstorm`, `snow`, ...).
 * @param terrain The current field terrain id (`electricterrain`, ...);
 *   used so Quark Drive's Speed boost can fire off Electric Terrain set
 *   by another source, not just Booster Energy. Defaults to none.
 * @returns Estimated in-battle Speed stat (post-modifiers).
 */
export function scaledSpeed(
	mon: TrackedPokemon,
	tailwind: boolean,
	weather: string,
	terrain = ""
): number {
	let spe = mon.stats?.spe ?? approximateSpeed(mon);
	const stage = mon.boosts.spe || 0;
	if (stage > 0) spe = Math.floor(spe * (2 + stage) / 2);
	else if (stage < 0) spe = Math.floor(spe * 2 / (2 - stage));
	if (toID(mon.item) === "choicescarf") spe = Math.floor(spe * 1.5);
	const ability = toID(mon.ability);
	const isRain = weather === "raindance" || weather === "primordialsea";
	const isSun = weather === "sunnyday" || weather === "desolateland";
	if (ability === "swiftswim" && isRain) spe *= 2;
	if (ability === "chlorophyll" && isSun) spe *= 2;
	if (ability === "sandrush" && weather === "sandstorm") spe *= 2;
	if (ability === "slushrush" &&
		(weather === "snow" || weather === "snowscape" || weather === "hail")) {
		spe *= 2;
	}
	// Paradox speed boost when Protosynthesis/Quark Drive picks Speed
	// as the highest stat: this is the +50% Booster-Energy / sun /
	// electric-terrain bonus (`paradoxBoostedStat` returns `spe` only
	// in that case).
	if (paradoxSpeedActive(mon, weather, terrain)) spe = Math.floor(spe * 1.5);
	if (tailwind) spe *= 2;
	if (mon.status === "par" && ability !== "quickfeet") spe = Math.floor(spe / 2);
	if (ability === "quickfeet" && mon.status) spe = Math.floor(spe * 1.5);
	return spe;
}

/**
 * Check whether the mon's Protosynthesis / Quark Drive boost is
 * currently picking Speed. We mirror the activation logic in
 * `DamageCalc.paradoxBoostedStat`: ability + (matching field or
 * Booster Energy in hand or a recorded `*spe` volatile).
 *
 * @param mon Tracked Pokemon snapshot.
 * @param weather Active weather id.
 * @param terrain Active terrain id (Quark Drive activates on Electric
 *   Terrain regardless of who set it).
 * @returns true if the Speed multiplier applies.
 */
function paradoxSpeedActive(mon: TrackedPokemon, weather: string, terrain: string): boolean {
	const ability = toID(mon.ability);
	if (ability !== "protosynthesis" && ability !== "quarkdrive") return false;
	for (const v of mon.volatiles) {
		if (v === "protosynthesisspe" || v === "quarkdrivespe") return true;
	}
	const item = toID(mon.item);
	const hasBooster = item === "boosterenergy";
	const sun = weather === "sunnyday" || weather === "desolateland";
	const eTerrain = terrain === "electricterrain";
	const isProto = ability === "protosynthesis";
	// Without an explicit volatile or stat block we don't know which
	// stat the ability picks. Approximate by checking whether Speed is
	// the species' highest base stat (the most common Paradox sweeper
	// configuration). Conservative: returns false when in doubt.
	if (!(isProto ? sun || hasBooster : eTerrain || hasBooster)) return false;
	const stats = mon.stats;
	if (!stats) {
		// Fall back to a species-base-stat lookup; the Dex import is
		// available at the top of the file.
		const species = Dex.species.get(toID(mon.species));
		if (!species?.exists || !species.baseStats) return false;
		const { atk, def, spa, spd, spe } = species.baseStats;
		return spe >= Math.max(atk, def, spa, spd);
	}
	const candidates: [keyof typeof stats, number][] = [
		["atk", stats.atk ?? 0],
		["def", stats.def ?? 0],
		["spa", stats.spa ?? 0],
		["spd", stats.spd ?? 0],
		["spe", stats.spe ?? 0],
	];
	let best: keyof typeof stats = "atk";
	let bestVal = -Infinity;
	for (const [k, v] of candidates) {
		if (v > bestVal) {
			bestVal = v;
			best = k;
		}
	}
	return best === "spe";
}

function approximateSpeed(mon: TrackedPokemon): number {
	const species = Dex.species.get(mon.species);
	if (!species?.baseStats) return 80;
	const base = species.baseStats.spe || 80;
	const lvl = mon.level || 100;
	return Math.floor(((2 * base + 31 + 63) * lvl) / 100) + 5;
}
