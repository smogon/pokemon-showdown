/**
 * Strategic-AI damage calculator.
 *
 * This is a Smogon-style "approximate" damage calculator: it returns
 * `{minDamage, avgDamage, maxDamage, koProbability, hitChance}` rather
 * than a single point estimate, because the AI cares about full
 * distributions when it's computing KO probabilities and expected
 * value.
 *
 * It is **not** a full reimplementation of Showdown's mechanics. We
 * cover the modifiers that matter for play decisions:
 *
 * - STAB (incl. Adaptability and Tera STAB),
 * - Type effectiveness (incl. immunities and Tera defensive flips),
 * - Standard attacking abilities: Adaptability, Aerilate-family
 *   (incl. -ate BP boost), Protean/Libero, Huge/Pure Power, Technician,
 *   Iron Fist, Strong Jaw, Mega Launcher, Tinted Lens, Filter/Solid
 *   Rock/Prism Armor, Multiscale/Shadow Shield, Magic Guard, Thick Fat,
 *   Heatproof, Fluffy, Ice Scales, Punk Rock, Sniper, Super Luck,
 *   Stakeout, Tough Claws, Sand Force, Swarm/Blaze/Torrent/Overgrow,
 *   Guts/Facade interaction, Wonder Guard, Levitate, Flash Fire,
 *   Sap Sipper / Lightning Rod / Storm Drain / Volt/Water Absorb /
 *   Motor Drive / Dry Skin.
 * - Standard attacking items: Choice Band/Specs, Life Orb, Expert Belt,
 *   Eviolite, Assault Vest, Air Balloon (defensive), Heavy-Duty Boots
 *   (hazard immunity, separate from this file), Type-resist berries,
 *   type-boosting plates / gems / drives / orbs, Muscle Band / Wise
 *   Glasses, Punching Glove.
 * - Weather (rain/sun/sand/snow + Cloud Nine / Air Lock suppression).
 * - Terrain (Electric/Grassy/Misty/Psychic).
 * - Screens (Reflect, Light Screen, Aurora Veil; doubles correction).
 * - Burn penalty (with Guts/Facade interactions and Punching Glove).
 * - Special-cased moves: Body Press, Foul Play, Psyshock/Psystrike/
 *   Secret Sword, Photon Geyser, Tera Blast (dynamic
 *   type/category), Knock Off boost when target holds an item.
 * - Multi-hit distributions (2-5 hit weighted, Skill Link, Population
 *   Bomb, Triple Kick, Bullet Seed, etc.).
 * - Crit chance (1/24 default, 1/8 high-crit, +1 stage with Super Luck,
 *   +1 stage with Razor Claw / Scope Lens, always-crit moves).
 * - Accuracy (move accuracy * accuracy boosts vs evasion boosts).
 *
 * Where data is missing (e.g. opponent stats / EVs / nature unknown) we
 * estimate from species base stats with full-investment assumptions
 * (252 EV, neutral nature, 31 IV) which is the standard "calc" default.
 *
 * @license MIT
 */
import { Dex, toID } from "../../../dex";
import type { Move } from "../../../dex-moves";
import type { Species } from "../../../dex-species";
import type { FieldState, SideState, TrackedPokemon } from "../state/BattleStateTracker";

/** Stat block. All values are unboosted; boosts are applied separately. */
export interface StatBlock {
	hp: number;
	atk: number;
	def: number;
	spa: number;
	spd: number;
	spe: number;
}

/**
 * The minimum information the calculator needs about a Pokemon to do
 * its job. We accept the more complete {@link TrackedPokemon} via the
 * convenience helpers below, but the calc itself only depends on this
 * narrower interface.
 */
export interface CalcPokemon {
	/** Species id (e.g. `garchomp`, `urshifu-rapid-strike` -> `urshifurapidstrike`). */
	species: string;
	/** Effective types this turn. May be `[teraType]` if Terastallized. */
	types: string[];
	/**
	 * Original (pre-Tera) types, when the mon is currently Terastallized.
	 * Used to detect "Tera into existing STAB" so the calc can apply the
	 * 2.0x / 2.25x multiplier instead of the bare 1.5x / 2.0x STAB.
	 * Optional; when omitted we fall back to legacy STAB rules.
	 */
	originalTypes?: string[];
	/** Tera type if known. */
	teraType?: string;
	/** True if this mon is currently Terastallized. */
	terastallized?: boolean;
	/** Pokemon level (defaults 100 if missing). */
	level: number;
	/** Active ability id, or `""` if none / unknown. */
	ability?: string;
	/** Currently-held item id, or `""` if none / unknown. */
	item?: string;
	/** Major status (`brn`, `par`, `psn`, `tox`, `slp`, `frz`, or `""`). */
	status?: string;
	/** Stat-stage boosts in [-6,+6]. */
	boosts: Record<string, number>;
	/** Best-known stat block; otherwise we estimate from species. */
	stats?: Partial<StatBlock>;
	/** Active volatile effect ids (`flashfire`, `charged`, `substitute`, ...). */
	volatiles?: Set<string>;
	/** Defender HP fraction in [0,1] (used for Multiscale and KO probability). */
	hpFraction?: number;
}

/** Inputs to {@link calculateDamage}. */
export interface DamageCalcInput {
	attacker: CalcPokemon;
	defender: CalcPokemon;
	move: Move | string;
	field: FieldState;
	/** State of the attacker's side (Tailwind, screens, etc. used elsewhere). */
	attackerSide: SideState;
	/** State of the defender's side (Reflect/LightScreen/AuroraVeil). */
	defenderSide: SideState;
	/**
	 * If supplied, replaces the calc's automatic hit rolls. Useful for
	 * MCTS rollouts where the simulator already decided.
	 */
	forceCrit?: boolean;
	/** True if the attack is a spread move (doubles spread modifier). */
	spread?: boolean;
	/** True for AI-purposes "is this a doubles battle?". Affects screens. */
	isDoubles?: boolean;
	/**
	 * Optional override for the gen number. If not provided, we use
	 * `Dex.gen`.
	 */
	gen?: number;
	/**
	 * True when the attacker is expected to move before the defender
	 * this turn. Used by power-doubling moves whose effect depends on
	 * turn order: Bolt Beak / Fishious Rend (`true` → 2× BP), Payback /
	 * Revenge / Avalanche (`false` → 2× BP), Assurance (foe took damage
	 * this turn → 2× BP, approximated downstream by combining this with
	 * `defenderTookDamageThisTurn`).
	 *
	 * Falsy (undefined) means "unknown"; the calc falls back to neutral
	 * scaling (no boost, no penalty).
	 */
	attackerMovesFirst?: boolean;
	/**
	 * True when the attacker's previous successful move attempt failed
	 * (missed / immune / blocked). Used by Stomping Tantrum (2× BP) so
	 * the AI sequences "Earthquake against Levitate → Stomping Tantrum"
	 * intentionally instead of treating the first turn as a sunk loss.
	 */
	attackerLastMoveFailed?: boolean;
	/**
	 * True when one of the attacker's stat stages was lowered this turn
	 * (Intimidate switch-in, Sticky Web entry, foe Sword Dance, etc.).
	 * Used by Lash Out (2× BP).
	 */
	attackerLostStatThisTurn?: boolean;
	/**
	 * True when the defender has already been hit by another move this
	 * turn (doubles partner, prior multi-hit, etc.). Used by Assurance
	 * (2× BP).
	 */
	defenderTookDamageThisTurn?: boolean;
}

/** Output of {@link calculateDamage}. */
export interface DamageRange {
	/** Damage in HP units at the worst (0.85) damage roll. */
	minDamage: number;
	/** Damage at the average (0.925) roll. */
	avgDamage: number;
	/** Damage at the best (1.00) roll. */
	maxDamage: number;
	/** Probability the move outright KOs the defender. In [0,1]. */
	koProbability: number;
	/** Defender max HP (used to convert damage to %). */
	defenderMaxHp: number;
	/** Probability the move actually lands. */
	hitChance: number;
	/** True if the move is non-damaging (status / setup / pivot). */
	status: boolean;
	/** True if the defender is fully immune (type, ability, item). */
	immune: boolean;
	/** Hits in the move; `[1]` for normal, `[2,3,4,5]` for variable multi-hit. */
	hits: number[];
	/** Did we account for an explicit crit (`forceCrit`)? */
	crit: boolean;
}

const DAMAGE_ROLLS_COUNT = 16;

/** Damage variance rolls in 0.85..1.00 step 0.01. */
const DAMAGE_ROLLS: number[] = (() => {
	const out: number[] = [];
	for (let i = 0; i < DAMAGE_ROLLS_COUNT; i++) {
		out.push((85 + i) / 100);
	}
	return out;
})();

/** Distribution of hit counts for a Pokemon-Showdown 2-to-5-hit move. */
const VARIABLE_MULTIHIT_DIST: [number, number][] = [
	[2, 0.35],
	[3, 0.35],
	[4, 0.15],
	[5, 0.15],
];

/** Public main entry point. */
export function calculateDamage(input: DamageCalcInput): DamageRange {
	const move = typeof input.move === "string" ? Dex.moves.get(input.move) : input.move;
	const moveId = toID(move.id || (move as { name: string }).name || "");
	const defenderHp = estimateMaxHp(input.defender);
	// Always-crit moves (Wicked Blow, Surging Strikes, Flower Trick,
	// Storm Throw, Frost Breath, Zippy Zap, ...) carry `willCrit: true`
	// in dex data. Auto-promote them to `forceCrit` so callers don't
	// have to know which moves are guaranteed: a Wicked Blow into a
	// +6 Iron Defense Cosmoem still does its full chip because crit
	// ignores foe positive Def stages (see `effectiveStat`).
	const guaranteedCrit = move && (move as { willCrit?: boolean }).willCrit === true;
	if (guaranteedCrit && !input.forceCrit) {
		input = { ...input, forceCrit: true };
	}
	const baseRange: DamageRange = {
		minDamage: 0,
		avgDamage: 0,
		maxDamage: 0,
		koProbability: 0,
		defenderMaxHp: defenderHp,
		hitChance: 1,
		status: false,
		immune: false,
		hits: [1],
		crit: !!input.forceCrit,
	};
	if (!move || move.category === "Status" || moveId === "" || moveId === "struggle" && move.basePower === 50) {
		baseRange.status = move ? move.category === "Status" : true;
	}
	if (!move) return baseRange;
	if (move.category === "Status") {
		baseRange.status = true;
		baseRange.hitChance = computeHitChance(move, input);
		return baseRange;
	}
	// Type immunity (after potential -ate ability conversions).
	const moveType = resolveMoveType(move, input);
	if (!Dex.getImmunity(moveType, input.defender.types)) {
		// Type immunity also covers Levitate via runImmunity in real
		// Showdown; the tracker stores Levitate as ability and Flying as
		// type. We catch ground-type immunity from Levitate explicitly.
		baseRange.immune = true;
		baseRange.hits = explicitHitDistribution(move);
		return baseRange;
	}
	if (abilityImmunityBlocks(moveType, move, input)) {
		baseRange.immune = true;
		baseRange.hits = explicitHitDistribution(move);
		return baseRange;
	}
	if (itemImmunityBlocks(moveType, move, input)) {
		baseRange.immune = true;
		baseRange.hits = explicitHitDistribution(move);
		return baseRange;
	}
	// Compute per-hit damage at every roll, then collapse via the
	// move's hit distribution to {min, avg, max, koProbability}.
	const perHitDamages = DAMAGE_ROLLS.map(roll => singleHitDamage(move, moveType, roll, input));
	const hits = explicitHitDistribution(move);
	const isVariable = isVariableMultihit(move);
	const skillLink = toID(input.attacker.ability) === "skilllink";
	const distribution: [number, number][] = isVariable && !skillLink ?
		VARIABLE_MULTIHIT_DIST :
		[[hits[hits.length - 1], 1]];
	let min = Infinity;
	let max = 0;
	let sum = 0;
	let koProb = 0;
	const denominator = perHitDamages.length;
	const targetHp = (input.defender.hpFraction ?? 1) * defenderHp;
	for (const [count, weight] of distribution) {
		for (const dmg of perHitDamages) {
			const total = Math.floor(dmg * count);
			if (total < min) min = total;
			if (total > max) max = total;
			sum += total * weight;
			if (total >= targetHp) {
				koProb += weight / denominator;
			}
		}
	}
	const avg = sum / denominator;
	baseRange.minDamage = Math.max(0, Math.round(min));
	baseRange.maxDamage = Math.max(0, Math.round(max));
	baseRange.avgDamage = Math.max(0, Math.round(avg));
	baseRange.koProbability = Math.min(1, koProb);
	baseRange.hitChance = computeHitChance(move, input);
	baseRange.koProbability *= baseRange.hitChance;
	baseRange.hits = isVariable && !skillLink ? hits : [distribution[0][0]];
	return baseRange;
}

// =====================================================================
// Damage formula
// =====================================================================

function singleHitDamage(
	move: Move,
	moveType: string,
	roll: number,
	input: DamageCalcInput
): number {
	const { attacker, defender, field, defenderSide } = input;
	const level = attacker.level || 100;
	const basePower = computeBasePower(move, moveType, input);
	if (basePower <= 0) return 0;
	const offensiveStat = computeOffensiveStat(move, input);
	const defensiveStat = computeDefensiveStat(move, input);
	if (defensiveStat <= 0) return 0;
	let damage = Math.floor(((2 * level) / 5 + 2) * basePower * offensiveStat / defensiveStat);
	damage = Math.floor(damage / 50) + 2;

	// Spread move modifier (doubles).
	if (input.spread) damage *= 0.75;

	// Weather modifier (suppressed by Cloud Nine / Air Lock).
	const weather = effectiveWeather(field, attacker, defender);
	if (weather === "raindance" || weather === "primordialsea") {
		if (moveType === "Water") damage *= 1.5;
		if (moveType === "Fire") damage *= weather === "primordialsea" ? 0 : 0.5;
	} else if (weather === "sunnyday" || weather === "desolateland") {
		if (moveType === "Fire") damage *= 1.5;
		if (moveType === "Water") damage *= weather === "desolateland" ? 0 : 0.5;
	}

	// Crit. Crit doubles damage (1.5x in gen 6+) and ignores defensive boosts (handled in computeDefensiveStat).
	if (input.forceCrit) {
		damage *= toID(attacker.ability) === "sniper" ? 2.25 : 1.5;
	}

	// STAB.
	const stabApplies = moveTypeMatchesUserType(moveType, attacker);
	const adapt = toID(attacker.ability) === "adaptability";
	const isTera = !!attacker.terastallized && !!attacker.teraType;
	const teraMatchesMove = isTera && moveType === attacker.teraType;
	// "Tera into existing STAB": move type matches both the Tera type and
	// one of the user's *original* (pre-Tera) types. Gen 9 grants 2.0x
	// (2.25x with Adaptability) in that case. We detect it via
	// `originalTypes`, which transform-aware callers populate before
	// overwriting `types` with `[teraType]`.
	const teraOnOriginalStab = teraMatchesMove && !!attacker.originalTypes &&
		attacker.originalTypes.includes(moveType);
	if (teraOnOriginalStab) {
		damage *= adapt ? 2.25 : 2.0;
	} else if (stabApplies) {
		damage *= adapt ? 2.0 : 1.5;
	} else if (teraMatchesMove) {
		// Tera grants 1.5x STAB on the Tera type even when the user is
		// no longer that type post-Tera.
		damage *= 1.5;
	}

	// Type effectiveness.
	const eff = typeEffectivenessExp(moveType, defender);
	let effMult = 2 ** eff;
	const ability = toID(attacker.ability);
	if (ability === "tintedlens" && eff < 0) {
		effMult *= 2;
	}
	const defAbility = toID(defender.ability);
	if ((defAbility === "filter" || defAbility === "solidrock" || defAbility === "prismarmor") && eff > 0) {
		effMult *= 0.75;
	}
	damage *= effMult;

	// Burn penalty.
	if (
		attacker.status === "brn" &&
		isPhysicalForCalc(move, input) &&
		ability !== "guts" &&
		toID(move.id || (move as { name?: string }).name || "") !== "facade"
	) {
		damage *= 0.5;
	}

	// Multiscale / Shadow Shield (defender at full HP halves damage).
	if (
		(defAbility === "multiscale" || defAbility === "shadowshield") &&
		(defender.hpFraction ?? 1) >= 1
	) {
		damage *= 0.5;
	}

	// Screens (singles 0.5x, doubles 0.6667x).
	const isPhysical = isPhysicalForCalc(move, input);
	const screenMod = input.isDoubles ? 2 / 3 : 0.5;
	const ignoresScreens = input.forceCrit || ability === "infiltrator" ||
		toID(move.id || (move as { name?: string }).name || "") === "brickbreak" ||
		toID(move.id || (move as { name?: string }).name || "") === "psychicfangs";
	if (!ignoresScreens) {
		if (defenderSide.auroraVeilTurns > 0) damage *= screenMod;
		else if (isPhysical && defenderSide.reflectTurns > 0) damage *= screenMod;
		else if (!isPhysical && defenderSide.lightScreenTurns > 0) damage *= screenMod;
	}

	// Ability defensive multipliers.
	if (defAbility === "thickfat" && (moveType === "Fire" || moveType === "Ice")) damage *= 0.5;
	if (defAbility === "heatproof" && moveType === "Fire") damage *= 0.5;
	if (defAbility === "fluffy") {
		if (move.flags?.contact) damage *= 0.5;
		if (moveType === "Fire") damage *= 2;
	}
	if (defAbility === "icescales" && !isPhysical) damage *= 0.5;
	if (defAbility === "punkrock" && move.flags?.sound) damage *= 0.5;
	if (defAbility === "purifyingsalt" && moveType === "Ghost") damage *= 0.5;

	// Random roll.
	damage *= roll;

	// Item multipliers (offensive).
	const itemId = toID(attacker.item);
	if (itemId === "lifeorb") damage *= 1.3;
	else if (itemId === "expertbelt" && eff > 0) damage *= 1.2;
	// Metronome (item) stacking is not modelled — would need
	// per-attacker streak tracking we don't currently keep.
	if (typeBoostingItem(itemId, moveType)) damage *= 1.2;

	// Type-resist berries on the defender (rough single-trigger model:
	// they halve a SE hit).
	if (typeResistBerry(toID(defender.item), moveType, eff)) damage *= 0.5;

	return Math.max(0, damage);
}

function explicitHitDistribution(move: Move): number[] {
	if (!move.multihit) return [1];
	if (Array.isArray(move.multihit)) {
		return move.multihit.length === 1 ? [move.multihit[0]] : move.multihit;
	}
	return [move.multihit];
}

function isVariableMultihit(move: Move): boolean {
	return Array.isArray(move.multihit) && move.multihit.length === 2;
}

function moveTypeMatchesUserType(moveType: string, mon: CalcPokemon): boolean {
	if (mon.types.includes(moveType)) return true;
	const ability = toID(mon.ability);
	if (ability === "protean" || ability === "libero") return true;
	return false;
}

/**
 * Type effectiveness as the sum of `Dex.getEffectiveness` log2
 * exponents (so SE -> +1 each, NVE -> -1 each, etc.).
 */
function typeEffectivenessExp(moveType: string, defender: CalcPokemon): number {
	let total = 0;
	for (const t of defender.types) total += Dex.getEffectiveness(moveType, t);
	return total;
}

/**
 * Apply -ate abilities (Aerilate / Pixilate / Refrigerate / Galvanize /
 * Normalize) to the move type, plus dynamic conversions like Tera Blast
 * adopting the user's Tera type, Weather Ball, Judgment, Multi-Attack,
 * and Techno Blast.
 */
function resolveMoveType(move: Move, input: DamageCalcInput): string {
	const id = toID(move.id || (move as { name?: string }).name || "");
	let type = move.type || "Normal";
	const ability = toID(input.attacker.ability);
	if (id === "terablast" && input.attacker.terastallized && input.attacker.teraType) {
		type = input.attacker.teraType;
	}
	if (id === "weatherball") {
		const w = input.field.weather;
		if (w === "raindance" || w === "primordialsea") type = "Water";
		else if (w === "sunnyday" || w === "desolateland") type = "Fire";
		else if (w === "sandstorm") type = "Rock";
		else if (w === "snow" || w === "snowscape" || w === "hail") type = "Ice";
	}
	if (id === "judgment") {
		// Plate-determined type; we read from item id like `firiumz`/`flameplate`.
		const plateType = platedItemType(toID(input.attacker.item));
		if (plateType) type = plateType;
	}
	if (id === "technoblast") {
		const driveType = driveItemType(toID(input.attacker.item));
		if (driveType) type = driveType;
	}
	if (id === "multiattack") {
		const memoryType = memoryItemType(toID(input.attacker.item));
		if (memoryType) type = memoryType;
	}
	if (type === "Normal") {
		switch (ability) {
			case "aerilate": return "Flying";
			case "pixilate": return "Fairy";
			case "refrigerate": return "Ice";
			case "galvanize": return "Electric";
			case "normalize": return "Normal"; // No-op on Normal; -ate boost still applies.
		}
	}
	return type;
}

function abilityImmunityBlocks(moveType: string, move: Move, input: DamageCalcInput): boolean {
	const ability = toID(input.defender.ability);
	if (move.category === "Status") return false;
	switch (ability) {
		case "voltabsorb":
		case "lightningrod":
		case "motordrive":
			return moveType === "Electric";
		case "waterabsorb":
		case "stormdrain":
		case "dryskin":
			return moveType === "Water";
		case "flashfire":
			return moveType === "Fire";
		case "sapsipper":
			return moveType === "Grass";
		case "levitate":
			return moveType === "Ground" && !input.field.gravity;
		case "wonderguard":
			return typeEffectivenessExp(moveType, input.defender) <= 0;
	}
	return false;
}

function itemImmunityBlocks(moveType: string, move: Move, input: DamageCalcInput): boolean {
	const item = toID(input.defender.item);
	if (item === "airballoon" && moveType === "Ground") return true;
	if (item === "ringtarget") return false;
	return false;
}

/**
 * Compute base power including ability modifiers and the various
 * BP-altering items / situations.
 */
function computeBasePower(move: Move, moveType: string, input: DamageCalcInput): number {
	let bp = move.basePower;
	const id = toID(move.id || (move as { name?: string }).name || "");
	const ability = toID(input.attacker.ability);
	const item = toID(input.attacker.item);

	// Some ID-specific BP recomputations.
	switch (id) {
		case "earthquake":
		case "magnitude":
			break;
		case "knockoff":
			if (input.defender.item) bp *= 1.5;
			break;
		case "facade":
			if (input.attacker.status && input.attacker.status !== "frz" && input.attacker.status !== "slp") {
				bp *= 2;
			}
			break;
		case "hex":
			if (input.defender.status) bp *= 2;
			break;
		case "venoshock":
			if (input.defender.status === "psn" || input.defender.status === "tox") bp *= 2;
			break;
		case "acrobatics":
			if (!input.attacker.item) bp *= 2;
			break;
		case "lowkick":
		case "grassknot":
			// Weight-based; we approximate with average BP of 80.
			bp = Math.max(bp, 80);
			break;
		case "heavyslam":
		case "heatcrash":
			bp = Math.max(bp, 80);
			break;
		case "gyroball":
			bp = Math.max(bp, 60);
			break;
		case "electroball":
			bp = Math.max(bp, 80);
			break;
		case "weatherball":
			if (input.field.weather && input.field.weather !== "none") bp = 100;
			break;
		case "terrainpulse":
			if (input.field.terrain) bp = 100;
			break;
		case "boltbeak":
		case "fishiousrend":
			// 2× if the attacker moves first this turn — we now have
			// the hint from the caller. When the hint is missing
			// (`undefined`), fall back to the historical 1.5× midpoint
			// estimate rather than guess wrong either way.
			if (input.attackerMovesFirst === true) bp *= 2;
			else if (input.attackerMovesFirst === undefined) bp *= 1.5;
			break;
		case "payback":
			// 2× if the attacker moves second.
			if (input.attackerMovesFirst === false) bp *= 2;
			break;
		case "revenge":
		case "avalanche":
			// 2× if the attacker took damage from the foe this turn.
			// We approximate that as "foe moves first" — the typical
			// scenario where Revenge / Avalanche actually fire. (False
			// positives in the unusual "foe used a status move first
			// turn" case are tolerable; the scoring layer cross-checks
			// `defender.lastMove?.category` for the higher-value
			// branches.)
			if (input.attackerMovesFirst === false) bp *= 2;
			break;
		case "assurance":
			// 2× if the target has already taken damage this turn —
			// classic doubles partner combo, or any prior hit on the
			// same target in singles (multi-hit interruption, etc.).
			if (input.defenderTookDamageThisTurn) bp *= 2;
			break;
		case "lashout":
			// 2× if the attacker's stat stages were lowered this turn
			// (Intimidate switch-in, Sticky Web, foe Sword Dance/Snarl).
			if (input.attackerLostStatThisTurn) bp *= 2;
			break;
		case "stompingtantrum":
			// 2× if the user's *previous* move failed. The engine sets
			// this flag from `lastMoveFailedByMon` (LogParser feeds it
			// from `|miss|` / `|-immune|` / `|cant|` events). The
			// classic "Earthquake into Levitate → Stomping Tantrum"
			// combo finally scores correctly.
			if (input.attackerLastMoveFailed) bp *= 2;
			break;
		case "lastrespects":
			// Scales with team faints; approximate with +1 per faint.
			break;
		case "rage Fist":
		case "ragefist":
			break;
	}

	// Terrain BP boosts (only when grounded, simplified).
	if (input.field.terrain === "electricterrain" && moveType === "Electric") bp *= 1.3;
	else if (input.field.terrain === "grassyterrain" && moveType === "Grass") bp *= 1.3;
	else if (input.field.terrain === "psychicterrain" && moveType === "Psychic") bp *= 1.3;

	// Misty Terrain halves Dragon damage on grounded targets.
	if (input.field.terrain === "mistyterrain" && moveType === "Dragon") bp *= 0.5;

	// Grassy Terrain halves Earthquake/Bulldoze/Magnitude on grounded.
	if (input.field.terrain === "grassyterrain" && (id === "earthquake" || id === "bulldoze" || id === "magnitude")) {
		bp *= 0.5;
	}

	// Ability BP boosts.
	switch (ability) {
		case "technician": if (bp <= 60) bp *= 1.5; break;
		case "ironfist": if (move.flags?.punch) bp *= 1.2; break;
		case "strongjaw": if (move.flags?.bite) bp *= 1.5; break;
		case "megalauncher": if (move.flags?.pulse) bp *= 1.5; break;
		case "toughclaws": if (move.flags?.contact) bp *= 1.3; break;
		case "rivalry": /* depends on gender; ignored */ break;
		case "swarm": if (moveType === "Bug" && (input.attacker.hpFraction ?? 1) <= 1 / 3) bp *= 1.5; break;
		case "blaze": if (moveType === "Fire" && (input.attacker.hpFraction ?? 1) <= 1 / 3) bp *= 1.5; break;
		case "torrent": if (moveType === "Water" && (input.attacker.hpFraction ?? 1) <= 1 / 3) bp *= 1.5; break;
		case "overgrow": if (moveType === "Grass" && (input.attacker.hpFraction ?? 1) <= 1 / 3) bp *= 1.5; break;
		case "sandforce":
			if (input.field.weather === "sandstorm" && (moveType === "Rock" || moveType === "Ground" || moveType === "Steel")) {
				bp *= 1.3;
			}
			break;
		case "punkrock": if (move.flags?.sound) bp *= 1.3; break;
		case "aerilate":
		case "pixilate":
		case "refrigerate":
		case "galvanize":
			if (move.type === "Normal" && moveType !== "Normal") bp *= 1.2;
			break;
		case "normalize":
			if (moveType === "Normal" && (move.type !== "Normal" || true)) bp *= 1.2;
			break;
		case "stakeout": /* needs "switched in this turn" tracking; skipped */ break;
		case "sheerforce":
			if (move.secondaries?.length || (move as { hasSheerForce?: boolean }).hasSheerForce) bp *= 1.3;
			break;
		case "analytic": /* needs move-order; skipped */ break;
		case "darkaura": if (moveType === "Dark") bp *= 4 / 3; break;
		case "fairyaura": if (moveType === "Fairy") bp *= 4 / 3; break;
	}

	// Item BP boosts. (Choice Band is an Atk multiplier, not BP, so it's
	// handled later in the stat pipeline rather than here.)
	if (item === "muscleband" && isPhysicalForCalc(move, input)) bp *= 1.1;
	else if (item === "wiseglasses" && !isPhysicalForCalc(move, input)) bp *= 1.1;
	else if (item === "punchingglove" && move.flags?.punch) bp *= 1.1;

	return bp;
}

function computeOffensiveStat(move: Move, input: DamageCalcInput): number {
	const id = toID(move.id || (move as { name?: string }).name || "");
	const physical = isPhysicalForCalc(move, input);
	const crit = !!input.forceCrit;
	let baseStat: number;
	let offensiveStatKey: keyof StatBlock;
	if (id === "bodypress") {
		offensiveStatKey = "def";
		baseStat = effectiveStat(input.attacker, "def", /* ignoreNeg */ crit);
	} else if (id === "foulplay") {
		// Foul Play reads the defender's attack as if it were the user's,
		// so the attacker-side crit rule (ignore negative stages) applies.
		offensiveStatKey = "atk";
		baseStat = effectiveStat(input.defender, "atk", /* ignoreNeg */ crit);
	} else if (id === "photongeyser") {
		const atk = effectiveStat(input.attacker, "atk", /* ignoreNeg */ crit);
		const spa = effectiveStat(input.attacker, "spa", /* ignoreNeg */ crit);
		offensiveStatKey = atk >= spa ? "atk" : "spa";
		baseStat = Math.max(atk, spa);
	} else {
		offensiveStatKey = physical ? "atk" : "spa";
		baseStat = effectiveStat(input.attacker, offensiveStatKey, /* ignoreNeg */ crit);
	}
	const ability = toID(input.attacker.ability);
	if ((ability === "hugepower" || ability === "purepower") && physical) baseStat *= 2;
	if (ability === "guts" && physical && input.attacker.status) baseStat *= 1.5;
	if (
		ability === "flashfire" &&
		input.attacker.volatiles?.has("flashfire") &&
		(move.type === "Fire" || resolveMoveType(move, input) === "Fire")
	) {
		baseStat *= 1.5;
	}
	// Solar Power: +50% Special Attack in harsh sunlight.
	const offensiveWeather = effectiveWeather(input.field, input.attacker, input.defender);
	if (
		ability === "solarpower" &&
		!physical &&
		(offensiveWeather === "sunnyday" || offensiveWeather === "desolateland")
	) {
		baseStat *= 1.5;
	}
	// Protosynthesis (sun / Booster Energy) and Quark Drive (electric
	// terrain / Booster Energy) grant a +30% boost (+50% to Speed) to
	// the user's highest stat. We approximate "highest stat" from the
	// stat block (best-known) or the species' base stats, defaulting to
	// the offensive stat if the species lookup fails so the boost still
	// applies in the common case.
	const paradoxBoosted = paradoxBoostedStat(input.attacker, ability, input.field, offensiveWeather);
	// Foul Play attacks with the *defender's* Attack stat, so the user's
	// own Protosynthesis / Quark Drive Attack boost must not be folded
	// back in — that would make a boosted Foul Play user hit far harder
	// than it really does.
	if (paradoxBoosted && paradoxBoosted === offensiveStatKey && id !== "foulplay") {
		baseStat *= paradoxBoostedMultiplier(paradoxBoosted);
	}
	const item = toID(input.attacker.item);
	if (item === "choiceband" && physical) baseStat *= 1.5;
	if (item === "choicespecs" && !physical) baseStat *= 1.5;
	if (item === "thickclub" && physical && (input.attacker.species === "cubone" || input.attacker.species === "marowak")) {
		baseStat *= 2;
	}
	if (item === "lightball" && input.attacker.species === "pikachu") {
		baseStat *= 2;
	}
	if (item === "deepseatooth" && !physical && input.attacker.species === "clamperl") {
		baseStat *= 2;
	}
	return baseStat;
}

function computeDefensiveStat(move: Move, input: DamageCalcInput): number {
	const id = toID(move.id || (move as { name?: string }).name || "");
	let stat: keyof StatBlock;
	if (id === "psyshock" || id === "psystrike" || id === "secretsword") {
		stat = "def";
	} else {
		stat = isPhysicalForCalc(move, input) ? "def" : "spd";
	}
	// On crit, ignore the defender's *positive* defensive stages.
	let value = effectiveStat(input.defender, stat, /* ignoreNeg */ false, /* ignorePos */ !!input.forceCrit);
	const item = toID(input.defender.item);
	const species = input.defender.species;
	if (item === "eviolite" && isNFE(species)) value *= 1.5;
	if (item === "assaultvest" && stat === "spd") value *= 1.5;
	if (item === "deepseascale" && stat === "spd" && species === "clamperl") value *= 2;
	if (item === "metalpowder" && stat === "def" && species === "ditto") value *= 2;
	const weather = effectiveWeather(input.field, input.attacker, input.defender);
	const isSnow = weather === "snow" || weather === "snowscape";
	if (weather === "sandstorm" && stat === "spd" && input.defender.types.includes("Rock")) {
		value *= 1.5;
	}
	if (isSnow && stat === "def" && input.defender.types.includes("Ice")) {
		value *= 1.5;
	}
	// Protosynthesis/Quark Drive defensive boost: applies whenever the
	// defender's "highest stat" happens to be the relevant defensive
	// stat (Def for Physical, SpD for Special / Psyshock-family).
	const defAbility = toID(input.defender.ability);
	const paradoxBoosted = paradoxBoostedStat(input.defender, defAbility, input.field, weather);
	if (paradoxBoosted && paradoxBoosted === stat) {
		value *= paradoxBoostedMultiplier(paradoxBoosted);
	}
	return value;
}

/**
 * Return the stat that a Protosynthesis / Quark Drive user is currently
 * boosting, or `null` if the ability isn't active.
 *
 * The boost activates when:
 *
 * - **Protosynthesis** holder is in harsh sun, or holds Booster Energy
 *   (which the mon consumes on switch-in; until the calc sees the
 *   item as consumed we treat presence-of-item as proof it'll fire).
 * - **Quark Drive** holder is in Electric Terrain, or holds Booster
 *   Energy under the same logic.
 *
 * The boosted stat is the user's highest stat after positive stat
 * stages (per Showdown's `getActiveProto` rule). We approximate from
 * the best-known stat block; when none is known we fall back to the
 * species' base stats so the boost still kicks in for foe mons whose
 * EV spread isn't visible to us.
 *
 * @param mon The Pokemon snapshot to evaluate.
 * @param ability The mon's currently-active ability id.
 * @param field The battle field state (used for the terrain check).
 * @param effWeather The *effective* weather id (i.e. after Cloud Nine /
 *   Air Lock suppression), so Protosynthesis doesn't activate under sun
 *   that's currently being negated.
 * @returns The boosted stat key, or `null` when not active.
 */
function paradoxBoostedStat(
	mon: CalcPokemon,
	ability: string,
	field: FieldState,
	effWeather: string
): keyof StatBlock | null {
	const isProto = ability === "protosynthesis";
	const isQuark = ability === "quarkdrive";
	if (!isProto && !isQuark) return null;
	// Volatile already records the boosted stat — prefer it when present.
	// Showdown emits `|-start|...|protosynthesis|atk` etc., so the
	// tracker stores `protosynthesisatk` / `quarkdriveatk` style ids.
	if (mon.volatiles) {
		for (const v of mon.volatiles) {
			if (!v.startsWith("protosynthesis") && !v.startsWith("quarkdrive")) continue;
			const stat = v.slice(v.startsWith("protosynthesis") ? "protosynthesis".length : "quarkdrive".length);
			if (isStatKey(stat)) return stat;
		}
	}
	const terrain = field.terrain;
	const item = toID(mon.item);
	// Use the effective weather so Cloud Nine / Air Lock correctly
	// suppress sun-based Protosynthesis activation. (Electric Terrain
	// isn't weather, so Cloud Nine / Air Lock don't touch Quark Drive.)
	const sun = effWeather === "sunnyday" || effWeather === "desolateland";
	const eTerrain = terrain === "electricterrain";
	const booster = item === "boosterenergy";
	const activeForProto = isProto && (sun || booster);
	const activeForQuark = isQuark && (eTerrain || booster);
	if (!activeForProto && !activeForQuark) return null;
	return highestNonHpStat(mon);
}

/**
 * Multiplier applied by Protosynthesis / Quark Drive to the chosen
 * stat. Speed receives a 1.5× multiplier; offensive/defensive stats
 * receive 1.3×. The HP boost case never applies because the ability
 * deliberately skips HP when picking its target stat.
 *
 * @param stat The stat key the ability boosted.
 * @returns The multiplicative scale factor.
 */
function paradoxBoostedMultiplier(stat: keyof StatBlock): number {
	if (stat === "spe") return 1.5;
	return 1.3;
}

function highestNonHpStat(mon: CalcPokemon): keyof StatBlock {
	const stats = ensureStats(mon);
	// Effective post-positive-stage stats (Showdown's
	// `getActiveProto` definition). Negative stages are ignored.
	const keys: (keyof StatBlock)[] = ["atk", "def", "spa", "spd", "spe"];
	let best: keyof StatBlock = "atk";
	let bestVal = -Infinity;
	for (const k of keys) {
		const stage = Math.max(0, mon.boosts?.[k] || 0);
		const base = stats[k] || 1;
		const adjusted = stage > 0 ? Math.floor(base * (2 + stage) / 2) : base;
		if (adjusted > bestVal) {
			bestVal = adjusted;
			best = k;
		}
	}
	return best;
}

function isStatKey(v: string): v is keyof StatBlock {
	return v === "hp" || v === "atk" || v === "def" || v === "spa" || v === "spd" || v === "spe";
}

/**
 * Resolve a stat value with optional crit-aware stage filtering.
 *
 * Showdown's crit rule: ignore the *attacker's negative* offensive
 * stages and the *defender's positive* defensive stages — the boosts
 * that would otherwise help the side hit by the crit. Pass
 * `ignoreNegativeStage` for the attacker's stat and
 * `ignorePositiveStage` for the defender's stat.
 */
function effectiveStat(
	mon: CalcPokemon,
	stat: keyof StatBlock,
	ignoreNegativeStage = false,
	ignorePositiveStage = false,
): number {
	const stats = ensureStats(mon);
	let value = stats[stat] || 1;
	const stage = mon.boosts[stat] || 0;
	let useStage = stage;
	if (ignoreNegativeStage && useStage < 0) useStage = 0;
	if (ignorePositiveStage && useStage > 0) useStage = 0;
	if (useStage > 0) value = Math.floor(value * (2 + useStage) / 2);
	else if (useStage < 0) value = Math.floor(value * 2 / (2 - useStage));
	return value;
}

/** Estimate full-investment stats from species base stats if unknown. */
function ensureStats(mon: CalcPokemon): StatBlock {
	if (mon.stats?.hp && mon.stats.atk && mon.stats.def && mon.stats.spa && mon.stats.spd && mon.stats.spe) {
		return mon.stats as StatBlock;
	}
	const species = Dex.species.get(mon.species);
	const base = species?.baseStats;
	if (!base) {
		return mon.stats ?
			{ hp: 200, atk: 100, def: 100, spa: 100, spd: 100, spe: 100, ...mon.stats } :
			{ hp: 200, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 };
	}
	const level = mon.level || 100;
	const calc = (key: keyof StatBlock) => {
		const baseVal = (base as unknown as Record<string, number>)[key] ?? 50;
		return statFromBase(baseVal, level, key === "hp");
	};
	return {
		hp: mon.stats?.hp ?? calc("hp"),
		atk: mon.stats?.atk ?? calc("atk"),
		def: mon.stats?.def ?? calc("def"),
		spa: mon.stats?.spa ?? calc("spa"),
		spd: mon.stats?.spd ?? calc("spd"),
		spe: mon.stats?.spe ?? calc("spe"),
	};
}

function statFromBase(base: number, level: number, isHp: boolean): number {
	// 252 EV = 63, 31 IV. Neutral nature.
	const ev = 252;
	const iv = 31;
	if (isHp) {
		if (base === 1) return 1; // Shedinja
		return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
	}
	return Math.floor(Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5);
}

/** Max HP calc, falling back to species base stats. */
export function estimateMaxHp(mon: CalcPokemon): number {
	if (mon.stats?.hp) return mon.stats.hp;
	const species = Dex.species.get(mon.species);
	if (!species?.baseStats) return 100;
	return statFromBase(species.baseStats.hp, mon.level || 100, true);
}

function isPhysicalForCalc(move: Move, input: DamageCalcInput): boolean {
	const id = toID(move.id || (move as { name?: string }).name || "");
	if (id === "photongeyser") {
		return effectiveStat(input.attacker, "atk") > effectiveStat(input.attacker, "spa");
	}
	if (id === "shellsidearm") {
		return effectiveStat(input.attacker, "atk") > effectiveStat(input.attacker, "spa");
	}
	return move.category === "Physical";
}

function effectiveWeather(field: FieldState, attacker: CalcPokemon, defender: CalcPokemon): string {
	const a = toID(attacker.ability);
	const d = toID(defender.ability);
	if (a === "cloudnine" || a === "airlock" || d === "cloudnine" || d === "airlock") return "";
	return field.weather;
}

function computeHitChance(move: Move, input: DamageCalcInput): number {
	const acc = move.accuracy;
	if (acc === true || acc === undefined) return 1;
	let chance = (acc) / 100;
	const accStage = (input.attacker.boosts.accuracy || 0) - (input.defender.boosts.evasion || 0);
	const stageMult = accStage >= 0 ? (3 + accStage) / 3 : 3 / (3 - accStage);
	chance *= stageMult;
	const ability = toID(input.attacker.ability);
	if (ability === "compoundeyes") chance *= 1.3;
	if (ability === "hustle" && move.category === "Physical") chance *= 0.8;
	const defAbility = toID(input.defender.ability);
	const fw = input.field.weather;
	const isSnowyOrHail = fw === "snow" || fw === "snowscape" || fw === "hail";
	if (defAbility === "snowcloak" && isSnowyOrHail) {
		chance *= 0.8;
	}
	if (defAbility === "sandveil" && input.field.weather === "sandstorm") chance *= 0.8;
	const item = toID(input.attacker.item);
	if (item === "widelens") chance *= 1.1;
	if (item === "zoomlens") chance *= 1.2; // Approximation; only when moving second.
	return Math.max(0, Math.min(1, chance));
}

function typeBoostingItem(itemId: string, moveType: string): boolean {
	switch (itemId) {
		case "blackbelt": return moveType === "Fighting";
		case "blackglasses": return moveType === "Dark";
		case "charcoal": return moveType === "Fire";
		case "dragonfang": return moveType === "Dragon";
		case "hardstone": return moveType === "Rock";
		case "magnet": return moveType === "Electric";
		case "metalcoat": return moveType === "Steel";
		case "miracleseed": return moveType === "Grass";
		case "mysticwater": return moveType === "Water";
		case "neverMeltIce":
		case "nevermelltice":
		case "nevermelitice":
		case "nevermellice":
		case "nevermeltice":
			return moveType === "Ice";
		case "poisonbarb": return moveType === "Poison";
		case "sharpbeak": return moveType === "Flying";
		case "silkscarf": return moveType === "Normal";
		case "silverpowder": return moveType === "Bug";
		case "softsand": return moveType === "Ground";
		case "spelltag": return moveType === "Ghost";
		case "twistedspoon": return moveType === "Psychic";
		case "fairyfeather": return moveType === "Fairy";
	}
	if (itemId.endsWith("plate")) {
		const t = platedItemType(itemId);
		return !!t && t === moveType;
	}
	if (itemId.endsWith("memory")) {
		const t = memoryItemType(itemId);
		return !!t && t === moveType;
	}
	return false;
}

function typeResistBerry(itemId: string, moveType: string, eff: number): boolean {
	if (eff <= 0 && itemId !== "chilanberry") return false;
	switch (itemId) {
		case "occaberry": return moveType === "Fire";
		case "passhoberry": return moveType === "Water";
		case "wacanberry": return moveType === "Electric";
		case "rindoberry": return moveType === "Grass";
		case "yacheberry": return moveType === "Ice";
		case "chopleberry": return moveType === "Fighting";
		case "kebiaberry": return moveType === "Poison";
		case "shucaberry": return moveType === "Ground";
		case "cobaberry": return moveType === "Flying";
		case "payapaberry": return moveType === "Psychic";
		case "tangaberry": return moveType === "Bug";
		case "chartiberry": return moveType === "Rock";
		case "kasibberry": return moveType === "Ghost";
		case "habanberry": return moveType === "Dragon";
		case "colburberry": return moveType === "Dark";
		case "babiriberry": return moveType === "Steel";
		case "roseliberry": return moveType === "Fairy";
		case "chilanberry": return moveType === "Normal";
	}
	return false;
}

function platedItemType(itemId: string): string | null {
	const map: Record<string, string> = {
		flameplate: "Fire",
		splashplate: "Water",
		zapplate: "Electric",
		meadowplate: "Grass",
		icicleplate: "Ice",
		fistplate: "Fighting",
		toxicplate: "Poison",
		earthplate: "Ground",
		skyplate: "Flying",
		mindplate: "Psychic",
		insectplate: "Bug",
		stoneplate: "Rock",
		spookyplate: "Ghost",
		dracoplate: "Dragon",
		dreadplate: "Dark",
		ironplate: "Steel",
		pixieplate: "Fairy",
	};
	return map[itemId] || null;
}

function driveItemType(itemId: string): string | null {
	const map: Record<string, string> = {
		shockdrive: "Electric",
		burndrive: "Fire",
		chilldrive: "Ice",
		dousedrive: "Water",
	};
	return map[itemId] || null;
}

function memoryItemType(itemId: string): string | null {
	if (!itemId.endsWith("memory")) return null;
	const t = itemId.slice(0, -"memory".length);
	const cap = t.charAt(0).toUpperCase() + t.slice(1);
	return cap || null;
}

function isNFE(speciesId: string): boolean {
	const species = Dex.species.get(speciesId) as Species | undefined;
	if (!species) return false;
	return !!(species.evos && species.evos.length > 0 && !species.nfe === false);
}

// =====================================================================
// Convenience: build a `CalcPokemon` from a tracker record.
// =====================================================================

/**
 * Build a {@link CalcPokemon} snapshot suitable for {@link calculateDamage}
 * out of a {@link TrackedPokemon}. Convenience helper so call sites
 * don't have to spread the same fields every time.
 */
export function fromTracked(mon: TrackedPokemon): CalcPokemon {
	// Preserve pre-Tera types so the STAB calculation can detect "Tera
	// onto an existing STAB" (gen 9 grants 2.0×/2.25× there). Once a mon
	// is Terastallized, `mon.types` has been overwritten with
	// `[teraType]`, so we fall back to the species' canonical types from
	// the dex.
	let originalTypes: string[] | undefined;
	if (mon.terastallized) {
		const species = Dex.species.get(toID(mon.species));
		const speciesTypes = species?.exists ? species.types : undefined;
		originalTypes = speciesTypes ? [...speciesTypes] : [...mon.types];
	}
	return {
		species: toID(mon.species),
		types: mon.types,
		originalTypes,
		teraType: mon.teraType,
		terastallized: mon.terastallized,
		level: mon.level,
		ability: mon.ability,
		item: mon.item,
		status: mon.status,
		boosts: mon.boosts,
		stats: mon.stats,
		volatiles: mon.volatiles,
		hpFraction: mon.hpFraction,
	};
}
