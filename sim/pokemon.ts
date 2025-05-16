/**
 * Simulator Pokemon
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT license
 */

import { State } from './state';
import { toID } from './dex';
import type { DynamaxOptions, PokemonMoveRequestData, PokemonSwitchRequestData } from './side';

/** A Pokemon's move slot. */
interface MoveSlot {
	id: ID;
	move: string;
	pp: number;
	maxpp: number;
	target?: string;
	disabled: boolean | string;
	disabledSource?: string;
	used: boolean;
	virtual?: boolean;
}

interface Attacker {
	source: Pokemon;
	damage: number;
	thisTurn: boolean;
	move?: ID;
	slot: PokemonSlot;
	damageValue?: (number | boolean | undefined);
}

export interface EffectState {
	id: string;
	effectOrder: number;
	duration?: number;
	[k: string]: any;
}

// Berries which restore PP/HP and thus inflict external staleness when given to an opponent as
// there are very few non-malicious competitive reasons to do so
export const RESTORATIVE_BERRIES = new Set([
	'leppaberry', 'aguavberry', 'enigmaberry', 'figyberry', 'iapapaberry', 'magoberry', 'sitrusberry', 'wikiberry', 'oranberry',
] as ID[]);

export class Pokemon {
	readonly side: Side;
	readonly battle: Battle;

	readonly set: PokemonSet;
	readonly name: string;
	/** `` `${sideid}: ${name}` `` - used to refer to pokemon in the protocol */
	readonly fullname: string;
	readonly level: number;
	readonly gender: GenderName;
	readonly happiness: number;
	readonly pokeball: ID;
	readonly dynamaxLevel: number;
	readonly gigantamax: boolean;

	/** Transform keeps the original pre-transformed Hidden Power in Gen 2-4. */
	readonly baseHpType: string;
	readonly baseHpPower: number;

	readonly baseMoveSlots: MoveSlot[];
	moveSlots: MoveSlot[];

	hpType: string;
	hpPower: number;

	/**
	 * Index of `pokemon.side.pokemon` and `pokemon.side.active`, which are
	 * guaranteed to be the same for active pokemon. Note that this isn't
	 * its field position in multi battles - use `getSlot()` for that.
	 */
	position: number;
	/**
	 * Information about this pokemon visible to opponents when in battle
	 * (species, gender, level, shininess, tera state).
	 * @see https://github.com/smogon/pokemon-showdown/blob/master/sim/SIM-PROTOCOL.md#identifying-pok%C3%A9mon
	 */
	details: string;

	baseSpecies: Species;
	species: Species;
	speciesState: EffectState;

	status: ID;
	statusState: EffectState;
	volatiles: { [id: string]: EffectState };
	showCure?: boolean;

	/**
	 * These are the basic stats that appear on the in-game stats screen:
	 * calculated purely from the species base stats, level, IVs, EVs,
	 * and Nature, before modifications from item, ability, etc.
	 *
	 * Forme changes affect these, but Transform doesn't.
	 */
	baseStoredStats: StatsTable;
	/**
	 * These are pre-modification stored stats in-battle. At switch-in,
	 * they're identical to `baseStoredStats`, but can be temporarily changed
	 * until switch-out by effects such as Power Trick and Transform.
	 *
	 * Stat multipliers from abilities, items, and volatiles, such as
	 * Solar Power, Choice Band, or Swords Dance, are not stored in
	 * `storedStats`, but applied on top and accessed by `pokemon.getStat`.
	 *
	 * (Except in Gen 1, where stat multipliers are stored, leading
	 * to several famous glitches.)
	 */
	storedStats: StatsExceptHPTable;
	boosts: BoostsTable;

	baseAbility: ID;
	ability: ID;
	abilityState: EffectState;

	item: ID;
	itemState: EffectState;
	lastItem: ID;
	usedItemThisTurn: boolean;
	ateBerry: boolean;

	trapped: boolean | "hidden";
	maybeTrapped: boolean;
	maybeDisabled: boolean;
	/** true = locked,  */
	maybeLocked: boolean | null;

	illusion: Pokemon | null;
	transformed: boolean;

	maxhp: number;
	/** This is the max HP before Dynamaxing; it's updated for Power Construct etc */
	baseMaxhp: number;
	hp: number;
	fainted: boolean;
	faintQueued: boolean;
	subFainted: boolean | null;

	/** If this Pokemon should revert to its set species when it faints */
	regressionForme: boolean;

	types: string[];
	addedType: string;
	knownType: boolean;
	/** Keeps track of what type the client sees for this Pokemon. */
	apparentType: string;

	/**
	 * If the switch is called by an effect with a special switch
	 * message, like U-turn or Baton Pass, this will be the ID of
	 * the calling effect.
	 */
	switchFlag: ID | boolean;
	forceSwitchFlag: boolean;
	skipBeforeSwitchOutEventFlag: boolean;
	draggedIn: number | null;
	newlySwitched: boolean;
	beingCalledBack: boolean;

	lastMove: ActiveMove | null;
	// Gen 2 only
	lastMoveEncore?: ActiveMove | null;
	lastMoveUsed: ActiveMove | null;
	lastMoveTargetLoc?: number;
	moveThisTurn: string | boolean;
	statsRaisedThisTurn: boolean;
	statsLoweredThisTurn: boolean;
	/**
	 * The result of the last move used on the previous turn by this
	 * Pokemon. Stomping Tantrum checks this property for a value of false
	 * when determine whether to double its power, but it has four
	 * possible values:
	 *
	 * undefined indicates this Pokemon was not active last turn. It should
	 * not be used to indicate that a move was attempted and failed, either
	 * in a way that boosts Stomping Tantrum or not.
	 *
	 * null indicates that the Pokemon's move was skipped in such a way
	 * that does not boost Stomping Tantrum, either from having to recharge
	 * or spending a turn trapped by another Pokemon's Sky Drop.
	 *
	 * false indicates that the move completely failed to execute for any
	 * reason not mentioned above, including missing, the target being
	 * immune, the user being immobilized by an effect such as paralysis, etc.
	 *
	 * true indicates that the move successfully executed one or more of
	 * its effects on one or more targets, including hitting with an attack
	 * but dealing 0 damage to the target in cases such as Disguise, or that
	 * the move was blocked by one or more moves such as Protect.
	 */
	moveLastTurnResult: boolean | null | undefined;
	/**
	 * The result of the most recent move used this turn by this Pokemon.
	 * At the start of each turn, the value stored here is moved to its
	 * counterpart, moveLastTurnResult, and this property is reinitialized
	 * to undefined. This property can have one of four possible values:
	 *
	 * undefined indicates that this Pokemon has not yet finished an
	 * attempt to use a move this turn. As this value is only overwritten
	 * after a move finishes execution, it is not sufficient for an event
	 * to examine only this property when checking if a Pokemon has not
	 * moved yet this turn if the event could take place during that
	 * Pokemon's move.
	 *
	 * null indicates that the Pokemon's move was skipped in such a way
	 * that does not boost Stomping Tantrum, either from having to recharge
	 * or spending a turn trapped by another Pokemon's Sky Drop.
	 *
	 * false indicates that the move completely failed to execute for any
	 * reason not mentioned above, including missing, the target being
	 * immune, the user being immobilized by an effect such as paralysis, etc.
	 *
	 * true indicates that the move successfully executed one or more of
	 * its effects on one or more targets, including hitting with an attack
	 * but dealing 0 damage to the target in cases such as Disguise. It can
	 * also mean that the move was blocked by one or more moves such as
	 * Protect. Uniquely, this value can also be true if this Pokemon mega
	 * evolved or ultra bursted this turn, but in that case the value should
	 * always be overwritten by a move action before the end of that turn.
	 */
	moveThisTurnResult: boolean | null | undefined;
	/**
	 * The undynamaxed HP value this Pokemon was reduced to by damage this turn,
	 * or false if it hasn't taken damage yet this turn
	 *
	 * Used for Assurance, Emergency Exit, and Wimp Out
	 */
	hurtThisTurn: number | null;
	lastDamage: number;
	attackedBy: Attacker[];
	timesAttacked: number;

	isActive: boolean;
	activeTurns: number;
	/**
	 * This is for Fake-Out-likes specifically - it mostly counts how many move
	 * actions you've had since the last time you switched in, so 1/turn normally,
	 * +1 for Dancer/Instruct, -1 for shifting/Sky Drop.
	 *
	 * Incremented before the move is used, so the first move use has
	 * `activeMoveActions === 1`.
	 *
	 * Unfortunately, Truant counts Mega Evolution as an action and Fake
	 * Out doesn't, meaning that Truant can't use this number.
	 */
	activeMoveActions: number;
	previouslySwitchedIn: number;
	truantTurn: boolean;
	bondTriggered: boolean;
	// Gen 9 only
	swordBoost: boolean;
	shieldBoost: boolean;
	syrupTriggered: boolean;
	stellarBoostedTypes: string[];

	/** Have this pokemon's Start events run yet? (Start events run every switch-in) */
	isStarted: boolean;
	duringMove: boolean;

	weighthg: number;
	speed: number;

	canMegaEvo: string | null | undefined;
	canMegaEvoX: string | null | undefined;
	canMegaEvoY: string | null | undefined;
	canUltraBurst: string | null | undefined;
	readonly canGigantamax: string | null;
	/**
	 * A Pokemon's Tera type if it can Terastallize, false if it is temporarily unable to tera and should have its
	 * ability restored upon switching out, or null if its inability to tera is permanent.
	 */
	canTerastallize: string | false | null;
	teraType: string;
	baseTypes: string[];
	terastallized?: string;

	/** A Pokemon's currently 'staleness' with respect to the Endless Battle Clause. */
	staleness?: 'internal' | 'external';
	/** Staleness that will be set once a future action occurs (eg. eating a berry). */
	pendingStaleness?: 'internal' | 'external';
	/** Temporary staleness that lasts only until the Pokemon switches. */
	volatileStaleness?: 'external';

	// Gen 1 only
	modifiedStats?: StatsExceptHPTable;
	modifyStat?: (this: Pokemon, statName: StatIDExceptHP, modifier: number) => void;
	// Stadium only
	recalculateStats?: (this: Pokemon) => void;

	/**
	 * An object for storing untyped data, for mods to use.
	 */
	m: {
		innate?: string, // Partners in Crime
		originalSpecies?: string, // Mix and Mega
		[key: string]: any,
	};

	constructor(set: string | AnyObject, side: Side) {
		this.side = side;
		this.battle = side.battle;

		this.m = {};

		const pokemonScripts = this.battle.format.pokemon || this.battle.dex.data.Scripts.pokemon;
		if (pokemonScripts) Object.assign(this, pokemonScripts);

		if (typeof set === 'string') set = { name: set };

		this.baseSpecies = this.battle.dex.species.get(set.species || set.name);
		if (!this.baseSpecies.exists) {
			throw new Error(`Unidentified species: ${this.baseSpecies.name}`);
		}
		this.set = set as PokemonSet;

		this.species = this.baseSpecies;
		if (set.name === set.species || !set.name) {
			set.name = this.baseSpecies.baseSpecies;
		}
		this.speciesState = this.battle.initEffectState({ id: this.species.id });

		this.name = set.name.substr(0, 20);
		this.fullname = `${this.side.id}: ${this.name}`;

		set.level = this.battle.clampIntRange(set.adjustLevel || set.level || 100, 1, 9999);
		this.level = set.level;
		const genders: { [key: string]: GenderName } = { M: 'M', F: 'F', N: 'N' };
		this.gender = genders[set.gender] || this.species.gender || (this.battle.random(2) ? 'F' : 'M');
		if (this.gender === 'N') this.gender = '';
		this.happiness = typeof set.happiness === 'number' ? this.battle.clampIntRange(set.happiness, 0, 255) : 255;
		this.pokeball = toID(this.set.pokeball) || 'pokeball' as ID;
		this.dynamaxLevel = typeof set.dynamaxLevel === 'number' ? this.battle.clampIntRange(set.dynamaxLevel, 0, 10) : 10;
		this.gigantamax = this.set.gigantamax || false;

		this.baseMoveSlots = [];
		this.moveSlots = [];
		if (!this.set.moves?.length) {
			throw new Error(`Set ${this.name} has no moves`);
		}
		for (const moveid of this.set.moves) {
			let move = this.battle.dex.moves.get(moveid);
			if (!move.id) continue;
			if (move.id === 'hiddenpower' && move.type !== 'Normal') {
				if (!set.hpType) set.hpType = move.type;
				move = this.battle.dex.moves.get('hiddenpower');
			}
			let basepp = move.noPPBoosts ? move.pp : move.pp * 8 / 5;
			if (this.battle.gen < 3) basepp = Math.min(61, basepp);
			this.baseMoveSlots.push({
				move: move.name,
				id: move.id,
				pp: basepp,
				maxpp: basepp,
				target: move.target,
				disabled: false,
				disabledSource: '',
				used: false,
			});
		}

		this.position = 0;
		this.details = this.getUpdatedDetails();

		this.status = '';
		this.statusState = this.battle.initEffectState({});
		this.volatiles = {};
		this.showCure = undefined;

		if (!this.set.evs) {
			this.set.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		}
		if (!this.set.ivs) {
			this.set.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
		}
		const stats: StatsTable = { hp: 31, atk: 31, def: 31, spe: 31, spa: 31, spd: 31 };
		let stat: StatID;
		for (stat in stats) {
			if (!this.set.evs[stat]) this.set.evs[stat] = 0;
			if (!this.set.ivs[stat] && this.set.ivs[stat] !== 0) this.set.ivs[stat] = 31;
		}
		for (stat in this.set.evs) {
			this.set.evs[stat] = this.battle.clampIntRange(this.set.evs[stat], 0, 255);
		}
		for (stat in this.set.ivs) {
			this.set.ivs[stat] = this.battle.clampIntRange(this.set.ivs[stat], 0, 31);
		}
		if (this.battle.gen && this.battle.gen <= 2) {
			// We represent DVs using even IVs. Ensure they are in fact even.
			for (stat in this.set.ivs) {
				this.set.ivs[stat] &= 30;
			}
		}

		const hpData = this.battle.dex.getHiddenPower(this.set.ivs);
		this.hpType = set.hpType || hpData.type;
		this.hpPower = hpData.power;

		this.baseHpType = this.hpType;
		this.baseHpPower = this.hpPower;

		// initialized in this.setSpecies(this.baseSpecies)
		this.baseStoredStats = null!;
		this.storedStats = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		this.boosts = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 };

		this.baseAbility = toID(set.ability);
		this.ability = this.baseAbility;
		this.abilityState = this.battle.initEffectState({ id: this.ability, target: this });

		this.item = toID(set.item);
		this.itemState = this.battle.initEffectState({ id: this.item, target: this });
		this.lastItem = '';
		this.usedItemThisTurn = false;
		this.ateBerry = false;

		this.trapped = false;
		this.maybeTrapped = false;
		this.maybeDisabled = false;
		this.maybeLocked = false;

		this.illusion = null;
		this.transformed = false;

		this.fainted = false;
		this.faintQueued = false;
		this.subFainted = null;

		this.regressionForme = false;

		this.types = this.baseSpecies.types;
		this.baseTypes = this.types;
		this.addedType = '';
		this.knownType = true;
		this.apparentType = this.baseSpecies.types.join('/');
		// Every Pokemon has a Terastal type
		this.teraType = this.set.teraType || this.types[0];

		this.switchFlag = false;
		this.forceSwitchFlag = false;
		this.skipBeforeSwitchOutEventFlag = false;
		this.draggedIn = null;
		this.newlySwitched = false;
		this.beingCalledBack = false;

		this.lastMove = null;
		// This is used in gen 2 only, here to avoid code repetition.
		// Only declared if gen 2 to avoid declaring an object we aren't going to need.
		if (this.battle.gen === 2) this.lastMoveEncore = null;
		this.lastMoveUsed = null;
		this.moveThisTurn = '';
		this.statsRaisedThisTurn = false;
		this.statsLoweredThisTurn = false;
		this.hurtThisTurn = null;
		this.lastDamage = 0;
		this.attackedBy = [];
		this.timesAttacked = 0;

		this.isActive = false;
		this.activeTurns = 0;
		this.activeMoveActions = 0;
		this.previouslySwitchedIn = 0;
		this.truantTurn = false;
		this.bondTriggered = false;
		this.swordBoost = false;
		this.shieldBoost = false;
		this.syrupTriggered = false;
		this.stellarBoostedTypes = [];
		this.isStarted = false;
		this.duringMove = false;

		this.weighthg = 1;
		this.speed = 0;

		this.canMegaEvo = this.battle.actions.canMegaEvo(this);
		this.canMegaEvoX = this.battle.actions.canMegaEvoX?.(this);
		this.canMegaEvoY = this.battle.actions.canMegaEvoY?.(this);
		this.canUltraBurst = this.battle.actions.canUltraBurst(this);
		this.canGigantamax = this.baseSpecies.canGigantamax || null;
		this.canTerastallize = this.battle.actions.canTerastallize(this);

		// This is used in gen 1 only, here to avoid code repetition.
		// Only declared if gen 1 to avoid declaring an object we aren't going to need.
		if (this.battle.gen === 1) this.modifiedStats = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

		this.maxhp = 0;
		this.baseMaxhp = 0;
		this.hp = 0;
		this.clearVolatile();
		this.hp = this.maxhp;
	}

	toJSON(): AnyObject {
		return State.serializePokemon(this);
	}

	get moves(): readonly string[] {
		return this.moveSlots.map(moveSlot => moveSlot.id);
	}

	get baseMoves(): readonly string[] {
		return this.baseMoveSlots.map(moveSlot => moveSlot.id);
	}

	getSlot(): PokemonSlot {
		const positionOffset = Math.floor(this.side.n / 2) * this.side.active.length;
		const positionLetter = 'abcdef'.charAt(this.position + positionOffset);
		return (this.side.id + positionLetter) as PokemonSlot;
	}

	toString() {
		const fullname = (this.illusion) ? this.illusion.fullname : this.fullname;
		return this.isActive ? this.getSlot() + fullname.slice(2) : fullname;
	}

	getUpdatedDetails(level?: number) {
		let name = this.species.name;
		if (['Greninja-Bond', 'Rockruff-Dusk'].includes(name)) name = this.species.baseSpecies;
		if (!level) level = this.level;
		return name + (level === 100 ? '' : `, L${level}`) +
			(this.gender === '' ? '' : `, ${this.gender}`) + (this.set.shiny ? ', shiny' : '');
	}

	getFullDetails = () => {
		const health = this.getHealth();
		let details = this.details;
		if (this.illusion) {
			details = this.illusion.getUpdatedDetails(
				this.battle.ruleTable.has('illusionlevelmod') ? this.illusion.level : this.level
			);
		}
		if (this.terastallized) details += `, tera:${this.terastallized}`;
		return { side: health.side, secret: `${details}|${health.secret}`, shared: `${details}|${health.shared}` };
	};

	updateSpeed() {
		this.speed = this.getActionSpeed();
	}

	calculateStat(statName: StatIDExceptHP, boost: number, modifier?: number, statUser?: Pokemon) {
		statName = toID(statName) as StatIDExceptHP;
		// @ts-expect-error type checking prevents 'hp' from being passed, but we're paranoid
		if (statName === 'hp') throw new Error("Please read `maxhp` directly");

		// base stat
		let stat = this.storedStats[statName];

		// Wonder Room swaps defenses before calculating anything else
		if ('wonderroom' in this.battle.field.pseudoWeather) {
			if (statName === 'def') {
				stat = this.storedStats['spd'];
			} else if (statName === 'spd') {
				stat = this.storedStats['def'];
			}
		}

		// stat boosts
		let boosts: SparseBoostsTable = {};
		const boostName = statName as BoostID;
		boosts[boostName] = boost;
		boosts = this.battle.runEvent('ModifyBoost', statUser || this, null, null, boosts);
		boost = boosts[boostName]!;
		const boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
		if (boost > 6) boost = 6;
		if (boost < -6) boost = -6;
		if (boost >= 0) {
			stat = Math.floor(stat * boostTable[boost]);
		} else {
			stat = Math.floor(stat / boostTable[-boost]);
		}

		// stat modifier
		return this.battle.modify(stat, (modifier || 1));
	}

	getStat(statName: StatIDExceptHP, unboosted?: boolean, unmodified?: boolean) {
		statName = toID(statName) as StatIDExceptHP;
		// @ts-expect-error type checking prevents 'hp' from being passed, but we're paranoid
		if (statName === 'hp') throw new Error("Please read `maxhp` directly");

		// base stat
		let stat = this.storedStats[statName];

		// Download ignores Wonder Room's effect, but this results in
		// stat stages being calculated on the opposite defensive stat
		if (unmodified && 'wonderroom' in this.battle.field.pseudoWeather) {
			if (statName === 'def') {
				statName = 'spd';
			} else if (statName === 'spd') {
				statName = 'def';
			}
		}

		// stat boosts
		if (!unboosted) {
			const boosts = this.battle.runEvent('ModifyBoost', this, null, null, { ...this.boosts });
			let boost = boosts[statName];
			const boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
			if (boost > 6) boost = 6;
			if (boost < -6) boost = -6;
			if (boost >= 0) {
				stat = Math.floor(stat * boostTable[boost]);
			} else {
				stat = Math.floor(stat / boostTable[-boost]);
			}
		}

		// stat modifier effects
		if (!unmodified) {
			const statTable: { [s in StatIDExceptHP]: string } = { atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };
			stat = this.battle.runEvent('Modify' + statTable[statName], this, null, null, stat);
		}

		if (statName === 'spe' && stat > 10000 && !this.battle.format.battle?.trunc) stat = 10000;
		return stat;
	}

	getActionSpeed() {
		let speed = this.getStat('spe', false, false);
		const trickRoomCheck = this.battle.ruleTable.has('twisteddimensionmod') ?
			!this.battle.field.getPseudoWeather('trickroom') : this.battle.field.getPseudoWeather('trickroom');
		if (trickRoomCheck) {
			speed = 10000 - speed;
		}
		return this.battle.trunc(speed, 13);
	}

	/**
	 * Gets the Pokemon's best stat.
	 * Moved to its own method due to frequent use of the same code.
	 * Used by Beast Boost, Quark Drive, and Protosynthesis.
	 */
	getBestStat(unboosted?: boolean, unmodified?: boolean): StatIDExceptHP {
		let statName: StatIDExceptHP = 'atk';
		let bestStat = 0;
		const stats: StatIDExceptHP[] = ['atk', 'def', 'spa', 'spd', 'spe'];
		for (const i of stats) {
			if (this.getStat(i, unboosted, unmodified) > bestStat) {
				statName = i;
				bestStat = this.getStat(i, unboosted, unmodified);
			}
		}

		return statName;
	}

	/* Commented out for now until a use for Combat Power is found in Let's Go
	getCombatPower() {
		let statSum = 0;
		let awakeningSum = 0;
		for (const stat in this.stats) {
			statSum += this.calculateStat(stat, this.boosts[stat as BoostName]);
			awakeningSum += this.calculateStat(
				stat, this.boosts[stat as BoostName]) + this.set.evs[stat];
		}
		const combatPower = Math.floor(Math.floor(statSum * this.level * 6 / 100) +
			(Math.floor(awakeningSum) * Math.floor((this.level * 4) / 100 + 2)));
		return this.battle.clampIntRange(combatPower, 0, 10000);
	}
	*/

	getWeight() {
		const weighthg = this.battle.runEvent('ModifyWeight', this, null, null, this.weighthg);
		return Math.max(1, weighthg);
	}

	getMoveData(move: string | Move) {
		move = this.battle.dex.moves.get(move);
		for (const moveSlot of this.moveSlots) {
			if (moveSlot.id === move.id) {
				return moveSlot;
			}
		}
		return null;
	}

	getMoveHitData(move: ActiveMove) {
		if (!move.moveHitData) move.moveHitData = {};
		const slot = this.getSlot();
		return move.moveHitData[slot] || (move.moveHitData[slot] = {
			crit: false,
			typeMod: 0,
			zBrokeProtect: false,
		});
	}

	alliesAndSelf(): Pokemon[] {
		return this.side.allies();
	}

	allies(): Pokemon[] {
		return this.side.allies().filter(ally => ally !== this);
	}

	adjacentAllies(): Pokemon[] {
		return this.side.allies().filter(ally => this.isAdjacent(ally));
	}

	foes(all?: boolean): Pokemon[] {
		return this.side.foes(all);
	}

	adjacentFoes(): Pokemon[] {
		if (this.battle.activePerHalf <= 2) return this.side.foes();
		return this.side.foes().filter(foe => this.isAdjacent(foe));
	}

	isAlly(pokemon: Pokemon | null) {
		return !!pokemon && (this.side === pokemon.side || this.side.allySide === pokemon.side);
	}

	isAdjacent(pokemon2: Pokemon) {
		if (this.fainted || pokemon2.fainted) return false;
		if (this.battle.activePerHalf <= 2) return this !== pokemon2;
		if (this.side === pokemon2.side) return Math.abs(this.position - pokemon2.position) === 1;
		return Math.abs(this.position + pokemon2.position + 1 - this.side.active.length) <= 1;
	}

	getUndynamaxedHP(amount?: number) {
		const hp = amount || this.hp;
		if (this.volatiles['dynamax']) {
			return Math.ceil(hp * this.baseMaxhp / this.maxhp);
		}
		return hp;
	}

	/** Get targets for Dragon Darts */
	getSmartTargets(target: Pokemon, move: ActiveMove) {
		const target2 = target.adjacentAllies()[0];
		if (!target2 || target2 === this || !target2.hp) {
			move.smartTarget = false;
			return [target];
		}
		if (!target.hp) {
			move.smartTarget = false;
			return [target2];
		}
		return [target, target2];
	}

	getAtLoc(targetLoc: number) {
		let side = this.battle.sides[targetLoc < 0 ? this.side.n % 2 : (this.side.n + 1) % 2];
		targetLoc = Math.abs(targetLoc);
		if (targetLoc > side.active.length) {
			targetLoc -= side.active.length;
			side = this.battle.sides[side.n + 2];
		}
		return side.active[targetLoc - 1];
	}

	/**
	 * Returns a relative location: 1-3, positive for foe, and negative for ally.
	 * Use `getAtLoc` to reverse.
	 */
	getLocOf(target: Pokemon) {
		const positionOffset = Math.floor(target.side.n / 2) * target.side.active.length;
		const position = target.position + positionOffset + 1;
		const sameHalf = (this.side.n % 2) === (target.side.n % 2);
		return sameHalf ? -position : position;
	}

	getMoveTargets(move: ActiveMove, target: Pokemon): { targets: Pokemon[], pressureTargets: Pokemon[] } {
		let targets: Pokemon[] = [];

		switch (move.target) {
		case 'all':
		case 'foeSide':
		case 'allySide':
		case 'allyTeam':
			if (!move.target.startsWith('foe')) {
				targets.push(...this.alliesAndSelf());
			}
			if (!move.target.startsWith('ally')) {
				targets.push(...this.foes(true));
			}
			if (targets.length && !targets.includes(target)) {
				this.battle.retargetLastMove(targets[targets.length - 1]);
			}
			break;
		case 'allAdjacent':
			targets.push(...this.adjacentAllies());
			// falls through
		case 'allAdjacentFoes':
			targets.push(...this.adjacentFoes());
			if (targets.length && !targets.includes(target)) {
				this.battle.retargetLastMove(targets[targets.length - 1]);
			}
			break;
		case 'allies':
			targets = this.alliesAndSelf();
			break;
		default:
			const selectedTarget = target;
			if (!target || (target.fainted && !target.isAlly(this)) && this.battle.gameType !== 'freeforall') {
				// If a targeted foe faints, the move is retargeted
				const possibleTarget = this.battle.getRandomTarget(this, move);
				if (!possibleTarget) return { targets: [], pressureTargets: [] };
				target = possibleTarget;
			}
			if (this.battle.activePerHalf > 1 && !move.tracksTarget) {
				const isCharging = move.flags['charge'] && !this.volatiles['twoturnmove'] &&
					!(move.id.startsWith('solarb') && ['sunnyday', 'desolateland'].includes(this.effectiveWeather())) &&
					!(move.id === 'electroshot' && ['raindance', 'primordialsea'].includes(this.effectiveWeather())) &&
					!(this.hasItem('powerherb') && move.id !== 'skydrop');
				if (!isCharging) {
					target = this.battle.priorityEvent('RedirectTarget', this, this, move, target);
				}
			}
			if (move.smartTarget) {
				targets = this.getSmartTargets(target, move);
				target = targets[0];
			} else {
				targets.push(target);
			}
			if (target.fainted && !move.flags['futuremove']) {
				return { targets: [], pressureTargets: [] };
			}
			if (selectedTarget !== target) {
				this.battle.retargetLastMove(target);
			}
		}

		// Resolve apparent targets for Pressure.
		let pressureTargets = targets;
		if (move.target === 'foeSide') {
			pressureTargets = [];
		}
		if (move.flags['mustpressure']) {
			pressureTargets = this.foes();
		}

		return { targets, pressureTargets };
	}

	ignoringAbility() {
		if (this.battle.gen >= 5 && !this.isActive) return true;

		// Certain Abilities won't activate while Transformed, even if they ordinarily couldn't be suppressed (e.g. Disguise)
		if (this.getAbility().flags['notransform'] && this.transformed) return true;
		if (this.getAbility().flags['cantsuppress']) return false;
		if (this.volatiles['gastroacid']) return true;

		// Check if any active pokemon have the ability Neutralizing Gas
		if (this.hasItem('Ability Shield') || this.ability === ('neutralizinggas' as ID)) return false;
		for (const pokemon of this.battle.getAllActive()) {
			// can't use hasAbility because it would lead to infinite recursion
			if (pokemon.ability === ('neutralizinggas' as ID) && !pokemon.volatiles['gastroacid'] &&
				!pokemon.transformed && !pokemon.abilityState.ending && !this.volatiles['commanding']) {
				return true;
			}
		}

		return false;
	}

	ignoringItem() {
		return !this.getItem().isPrimalOrb && !!(
			this.itemState.knockedOff || // Gen 3-4
			(this.battle.gen >= 5 && !this.isActive) ||
			(!this.getItem().ignoreKlutz && this.hasAbility('klutz')) ||
			this.volatiles['embargo'] || this.battle.field.pseudoWeather['magicroom']
		);
	}

	deductPP(move: string | Move, amount?: number | null, target?: Pokemon | null | false) {
		const gen = this.battle.gen;
		move = this.battle.dex.moves.get(move);
		const ppData = this.getMoveData(move);
		if (!ppData) return 0;
		ppData.used = true;
		if (!ppData.pp && gen > 1) return 0;

		if (!amount) amount = 1;
		ppData.pp -= amount;
		if (ppData.pp < 0 && gen > 1) {
			amount += ppData.pp;
			ppData.pp = 0;
		}
		return amount;
	}

	moveUsed(move: ActiveMove, targetLoc?: number) {
		this.lastMove = move;
		if (this.battle.gen === 2) this.lastMoveEncore = move;
		this.lastMoveTargetLoc = targetLoc;
		this.moveThisTurn = move.id;
	}

	gotAttacked(move: string | Move, damage: number | false | undefined, source: Pokemon) {
		const damageNumber = (typeof damage === 'number') ? damage : 0;
		move = this.battle.dex.moves.get(move);
		this.attackedBy.push({
			source,
			damage: damageNumber,
			move: move.id,
			thisTurn: true,
			slot: source.getSlot(),
			damageValue: damage,
		});
	}

	getLastAttackedBy() {
		if (this.attackedBy.length === 0) return undefined;
		return this.attackedBy[this.attackedBy.length - 1];
	}

	getLastDamagedBy(filterOutSameSide: boolean) {
		const damagedBy: Attacker[] = this.attackedBy.filter(attacker => (
			typeof attacker.damageValue === 'number' &&
			(filterOutSameSide === undefined || !this.isAlly(attacker.source))
		));
		if (damagedBy.length === 0) return undefined;
		return damagedBy[damagedBy.length - 1];
	}

	/**
	 * This refers to multi-turn moves like SolarBeam and Outrage and
	 * Sky Drop, which remove all choice (no dynamax, switching, etc).
	 * Don't use it for "soft locks" like Choice Band.
	 */
	getLockedMove(): ID | null {
		const lockedMove = this.battle.runEvent('LockMove', this);
		return (lockedMove === true) ? null : lockedMove;
	}

	getMoves(lockedMove?: ID | null, restrictData?: boolean): {
		move: string, id: ID, disabled?: string | boolean, disabledSource?: string,
		target?: string, pp?: number, maxpp?: number,
	}[] {
		if (lockedMove) {
			lockedMove = toID(lockedMove);
			this.trapped = true;
			if (lockedMove === 'recharge') {
				return [{
					move: 'Recharge',
					id: 'recharge' as ID,
				}];
			}
			for (const moveSlot of this.moveSlots) {
				if (moveSlot.id !== lockedMove) continue;
				return [{
					move: moveSlot.move,
					id: moveSlot.id,
				}];
			}
			// does this happen?
			return [{
				move: this.battle.dex.moves.get(lockedMove).name,
				id: lockedMove,
			}];
		}
		const moves = [];
		let hasValidMove = false;
		for (const moveSlot of this.moveSlots) {
			let moveName = moveSlot.move;
			if (moveSlot.id === 'hiddenpower') {
				moveName = `Hidden Power ${this.hpType}`;
				if (this.battle.gen < 6) moveName += ` ${this.hpPower}`;
			} else if (moveSlot.id === 'return' || moveSlot.id === 'frustration') {
				const basePowerCallback = this.battle.dex.moves.get(moveSlot.id).basePowerCallback as (pokemon: Pokemon) => number;
				moveName += ` ${basePowerCallback(this)}`;
			}
			let target = moveSlot.target;
			switch (moveSlot.id) {
			case 'curse':
				if (!this.hasType('Ghost')) {
					target = this.battle.dex.moves.get('curse').nonGhostTarget;
				}
				break;
			case 'pollenpuff':
				// Heal Block only prevents Pollen Puff from targeting an ally when the user has Heal Block
				if (this.volatiles['healblock']) {
					target = 'adjacentFoe';
				}
				break;
			case 'terastarstorm':
				if (this.species.name === 'Terapagos-Stellar') {
					target = 'allAdjacentFoes';
				}
				break;
			}
			let disabled = moveSlot.disabled;
			if (this.volatiles['dynamax']) {
				// if each of a Pokemon's base moves are disabled by one of these effects, it will Struggle
				const canCauseStruggle = ['Encore', 'Disable', 'Taunt', 'Assault Vest', 'Belch', 'Stuff Cheeks'];
				disabled = this.maxMoveDisabled(moveSlot.id) || disabled && canCauseStruggle.includes(moveSlot.disabledSource!);
			} else if (
				(moveSlot.pp <= 0 && !this.volatiles['partialtrappinglock']) || disabled &&
				this.side.active.length >= 2 && this.battle.actions.targetTypeChoices(target!)
			) {
				disabled = true;
			}

			if (!disabled) {
				hasValidMove = true;
			} else if (disabled === 'hidden' && restrictData) {
				disabled = false;
			}

			moves.push({
				move: moveName,
				id: moveSlot.id,
				pp: moveSlot.pp,
				maxpp: moveSlot.maxpp,
				target,
				disabled,
			});
		}
		return hasValidMove ? moves : [];
	}

	/** This should be passed the base move and not the corresponding max move so we can check how much PP is left. */
	maxMoveDisabled(baseMove: Move | string) {
		baseMove = this.battle.dex.moves.get(baseMove);
		if (!this.getMoveData(baseMove.id)?.pp) return true;
		return !!(baseMove.category === 'Status' && (this.hasItem('assaultvest') || this.volatiles['taunt']));
	}

	getDynamaxRequest(skipChecks?: boolean) {
		// {gigantamax?: string, maxMoves: {[k: string]: string} | null}[]
		if (!skipChecks) {
			if (!this.side.canDynamaxNow()) return;
			if (
				this.species.isMega || this.species.isPrimal || this.species.forme === "Ultra" ||
				this.getItem().zMove || this.canMegaEvo
			) {
				return;
			}
			// Some pokemon species are unable to dynamax
			if (this.species.cannotDynamax || this.illusion?.species.cannotDynamax) return;
		}
		const result: DynamaxOptions = { maxMoves: [] };
		let atLeastOne = false;
		for (const moveSlot of this.moveSlots) {
			const move = this.battle.dex.moves.get(moveSlot.id);
			const maxMove = this.battle.actions.getMaxMove(move, this);
			if (maxMove) {
				if (this.maxMoveDisabled(move)) {
					result.maxMoves.push({ move: maxMove.id, target: maxMove.target, disabled: true });
				} else {
					result.maxMoves.push({ move: maxMove.id, target: maxMove.target });
					atLeastOne = true;
				}
			}
		}
		if (!atLeastOne) return;
		if (this.canGigantamax) result.gigantamax = this.canGigantamax;
		return result;
	}

	getMoveRequestData() {
		let lockedMove = this.maybeLocked ? null : this.getLockedMove();

		// Information should be restricted for the last active Pokémon
		const isLastActive = this.isLastActive();
		const canSwitchIn = this.battle.canSwitch(this.side) > 0;
		let moves = this.getMoves(lockedMove, isLastActive);

		if (!moves.length) {
			moves = [{ move: 'Struggle', id: 'struggle' as ID, target: 'randomNormal', disabled: false }];
			lockedMove = 'struggle' as ID;
		}

		const data: PokemonMoveRequestData = {
			moves,
		};

		if (isLastActive) {
			if (this.maybeDisabled) {
				data.maybeDisabled = this.maybeDisabled;
			}
			if (this.maybeLocked) {
				data.maybeLocked = this.maybeLocked;
			}
			if (canSwitchIn) {
				if (this.trapped === true) {
					data.trapped = true;
				} else if (this.maybeTrapped) {
					data.maybeTrapped = true;
				}
			}
		} else if (canSwitchIn) {
			// Discovered by selecting a valid Pokémon as a switch target and cancelling.
			if (this.trapped) data.trapped = true;
		}

		if (!lockedMove) {
			if (this.canMegaEvo) data.canMegaEvo = true;
			if (this.canMegaEvoX) data.canMegaEvoX = true;
			if (this.canMegaEvoY) data.canMegaEvoY = true;
			if (this.canUltraBurst) data.canUltraBurst = true;
			const canZMove = this.battle.actions.canZMove(this);
			if (canZMove) data.canZMove = canZMove;

			if (this.getDynamaxRequest()) data.canDynamax = true;
			if (data.canDynamax || this.volatiles['dynamax']) data.maxMoves = this.getDynamaxRequest(true);
			if (this.canTerastallize) data.canTerastallize = this.canTerastallize;
		}

		return data;
	}

	getSwitchRequestData(forAlly?: boolean): PokemonSwitchRequestData {
		const entry: PokemonSwitchRequestData = {
			ident: this.fullname,
			details: this.details,
			condition: this.getHealth().secret,
			active: (this.position < this.side.active.length),
			stats: {
				atk: this.baseStoredStats['atk'],
				def: this.baseStoredStats['def'],
				spa: this.baseStoredStats['spa'],
				spd: this.baseStoredStats['spd'],
				spe: this.baseStoredStats['spe'],
			},
			moves: this[forAlly ? 'baseMoves' : 'moves'].map(move => {
				if (move === 'hiddenpower') {
					return `${move}${toID(this.hpType)}${this.battle.gen < 6 ? '' : this.hpPower}` as ID;
				}
				if (move === 'frustration' || move === 'return') {
					const basePowerCallback = this.battle.dex.moves.get(move).basePowerCallback as (pokemon: Pokemon) => number;
					return `${move}${basePowerCallback(this)}` as ID;
				}
				return move as ID;
			}),
			baseAbility: this.baseAbility,
			item: this.item,
			pokeball: this.pokeball,
		};
		if (this.battle.gen > 6) entry.ability = this.ability;
		if (this.battle.gen >= 9) {
			entry.commanding = !!this.volatiles['commanding'] && !this.fainted;
			entry.reviving = this.isActive && !!this.side.slotConditions[this.position]['revivalblessing'];
		}
		if (this.battle.gen === 9) {
			entry.teraType = this.teraType;
			entry.terastallized = this.terastallized || '';
		}
		return entry;
	}

	isLastActive() {
		if (!this.isActive) return false;
		const allyActive = this.side.active;
		for (let i = this.position + 1; i < allyActive.length; i++) {
			if (allyActive[i] && !allyActive[i].fainted) return false;
		}
		return true;
	}

	positiveBoosts() {
		let boosts = 0;
		let boost: BoostID;
		for (boost in this.boosts) {
			if (this.boosts[boost] > 0) boosts += this.boosts[boost];
		}
		return boosts;
	}

	getCappedBoost(boosts: SparseBoostsTable) {
		const cappedBoost: SparseBoostsTable = {};
		let boostName: BoostID;
		for (boostName in boosts) {
			const boost = boosts[boostName];
			if (!boost) continue;
			cappedBoost[boostName] = this.battle.clampIntRange(this.boosts[boostName] + boost, -6, 6) - this.boosts[boostName];
		}
		return cappedBoost;
	}

	boostBy(boosts: SparseBoostsTable) {
		boosts = this.getCappedBoost(boosts);
		let delta = 0;
		let boostName: BoostID;
		for (boostName in boosts) {
			delta = boosts[boostName]!;
			this.boosts[boostName] += delta;
		}
		return delta;
	}

	clearBoosts() {
		let boostName: BoostID;
		for (boostName in this.boosts) {
			this.boosts[boostName] = 0;
		}
	}

	setBoost(boosts: SparseBoostsTable) {
		let boostName: BoostID;
		for (boostName in boosts) {
			this.boosts[boostName] = boosts[boostName]!;
		}
	}

	copyVolatileFrom(pokemon: Pokemon, switchCause?: string | boolean) {
		this.clearVolatile();
		if (switchCause !== 'shedtail') this.boosts = pokemon.boosts;
		for (const i in pokemon.volatiles) {
			if (switchCause === 'shedtail' && i !== 'substitute') continue;
			if (this.battle.dex.conditions.getByID(i as ID).noCopy) continue;
			// shallow clones
			this.volatiles[i] = this.battle.initEffectState({ ...pokemon.volatiles[i], target: this });
			if (this.volatiles[i].linkedPokemon) {
				delete pokemon.volatiles[i].linkedPokemon;
				delete pokemon.volatiles[i].linkedStatus;
				for (const linkedPoke of this.volatiles[i].linkedPokemon) {
					const linkedPokeLinks = linkedPoke.volatiles[this.volatiles[i].linkedStatus].linkedPokemon;
					linkedPokeLinks[linkedPokeLinks.indexOf(pokemon)] = this;
				}
			}
		}
		pokemon.clearVolatile();
		for (const i in this.volatiles) {
			const volatile = this.getVolatile(i) as Condition;
			this.battle.singleEvent('Copy', volatile, this.volatiles[i], this);
		}
	}

	transformInto(pokemon: Pokemon, effect?: Effect) {
		const species = pokemon.species;
		if (
			pokemon.fainted || this.illusion || pokemon.illusion || (pokemon.volatiles['substitute'] && this.battle.gen >= 5) ||
			(pokemon.transformed && this.battle.gen >= 2) || (this.transformed && this.battle.gen >= 5) ||
			species.name === 'Eternatus-Eternamax' ||
			(['Ogerpon', 'Terapagos'].includes(species.baseSpecies) && (this.terastallized || pokemon.terastallized)) ||
			this.terastallized === 'Stellar'
		) {
			return false;
		}

		if (this.battle.dex.currentMod === 'gen1stadium' && (
			species.name === 'Ditto' ||
			(this.species.name === 'Ditto' && pokemon.moves.includes('transform'))
		)) {
			return false;
		}

		if (!this.setSpecies(species, effect, true)) return false;

		this.transformed = true;
		this.weighthg = pokemon.weighthg;

		const types = pokemon.getTypes(true, true);
		this.setType(pokemon.volatiles['roost'] ? pokemon.volatiles['roost'].typeWas : types, true);
		this.addedType = pokemon.addedType;
		this.knownType = this.isAlly(pokemon) && pokemon.knownType;
		this.apparentType = pokemon.apparentType;

		let statName: StatIDExceptHP;
		for (statName in this.storedStats) {
			this.storedStats[statName] = pokemon.storedStats[statName];
			if (this.modifiedStats) this.modifiedStats[statName] = pokemon.modifiedStats![statName]; // Gen 1: Copy modified stats.
		}
		this.moveSlots = [];
		this.hpType = (this.battle.gen >= 5 ? this.hpType : pokemon.hpType);
		this.hpPower = (this.battle.gen >= 5 ? this.hpPower : pokemon.hpPower);
		this.timesAttacked = pokemon.timesAttacked;
		for (const moveSlot of pokemon.moveSlots) {
			let moveName = moveSlot.move;
			if (moveSlot.id === 'hiddenpower') {
				moveName = 'Hidden Power ' + this.hpType;
			}
			this.moveSlots.push({
				move: moveName,
				id: moveSlot.id,
				pp: moveSlot.maxpp === 1 ? 1 : 5,
				maxpp: this.battle.gen >= 5 ? (moveSlot.maxpp === 1 ? 1 : 5) : moveSlot.maxpp,
				target: moveSlot.target,
				disabled: false,
				used: false,
				virtual: true,
			});
		}
		let boostName: BoostID;
		for (boostName in pokemon.boosts) {
			this.boosts[boostName] = pokemon.boosts[boostName];
		}
		if (this.battle.gen >= 6) {
			// we need to remove all of the overlapping crit volatiles before adding any of them
			const volatilesToCopy = ['dragoncheer', 'focusenergy', 'gmaxchistrike', 'laserfocus'];
			for (const volatile of volatilesToCopy) this.removeVolatile(volatile);
			for (const volatile of volatilesToCopy) {
				if (pokemon.volatiles[volatile]) {
					this.addVolatile(volatile);
					if (volatile === 'gmaxchistrike') this.volatiles[volatile].layers = pokemon.volatiles[volatile].layers;
					if (volatile === 'dragoncheer') this.volatiles[volatile].hasDragonType = pokemon.volatiles[volatile].hasDragonType;
				}
			}
		}
		if (effect) {
			this.battle.add('-transform', this, pokemon, '[from] ' + effect.fullname);
		} else {
			this.battle.add('-transform', this, pokemon);
		}
		if (this.terastallized) {
			this.knownType = true;
			this.apparentType = this.terastallized;
		}
		if (this.battle.gen > 2) this.setAbility(pokemon.ability, this, true, true);

		// Change formes based on held items (for Transform)
		// Only ever relevant in Generation 4 since Generation 3 didn't have item-based forme changes
		if (this.battle.gen === 4) {
			if (this.species.num === 487) {
				// Giratina formes
				if (this.species.name === 'Giratina' && this.item === 'griseousorb') {
					this.formeChange('Giratina-Origin');
				} else if (this.species.name === 'Giratina-Origin' && this.item !== 'griseousorb') {
					this.formeChange('Giratina');
				}
			}
			if (this.species.num === 493) {
				// Arceus formes
				const item = this.getItem();
				const targetForme = (item?.onPlate ? 'Arceus-' + item.onPlate : 'Arceus');
				if (this.species.name !== targetForme) {
					this.formeChange(targetForme);
				}
			}
		}

		// Pokemon transformed into Ogerpon cannot Terastallize
		// restoring their ability to tera after they untransform is handled ELSEWHERE
		if (['Ogerpon', 'Terapagos'].includes(this.species.baseSpecies) && this.canTerastallize) this.canTerastallize = false;

		return true;
	}

	/**
	 * Changes this Pokemon's species to the given speciesId (or species).
	 * This function only handles changes to stats and type.
	 * Use formeChange to handle changes to ability and sending client messages.
	 */
	setSpecies(rawSpecies: Species, source: Effect | null = this.battle.effect, isTransform = false) {
		const species = this.battle.runEvent('ModifySpecies', this, null, source, rawSpecies);
		if (!species) return null;
		this.species = species;

		this.setType(species.types, true);
		this.apparentType = rawSpecies.types.join('/');
		this.addedType = species.addedType || '';
		this.knownType = true;
		this.weighthg = species.weighthg;

		const stats = this.battle.spreadModify(this.species.baseStats, this.set);
		if (this.species.maxHP) stats.hp = this.species.maxHP;

		if (!this.maxhp) {
			this.baseMaxhp = stats.hp;
			this.maxhp = stats.hp;
			this.hp = stats.hp;
		}

		if (!isTransform) this.baseStoredStats = stats;
		let statName: StatIDExceptHP;
		for (statName in this.storedStats) {
			this.storedStats[statName] = stats[statName];
			if (this.modifiedStats) this.modifiedStats[statName] = stats[statName]; // Gen 1: Reset modified stats.
		}
		if (this.battle.gen <= 1) {
			// Gen 1: Re-Apply burn and para drops.
			if (this.status === 'par') this.modifyStat!('spe', 0.25);
			if (this.status === 'brn') this.modifyStat!('atk', 0.5);
		}
		this.speed = this.storedStats.spe;
		return species;
	}

	/**
	 * Changes this Pokemon's forme to match the given speciesId (or species).
	 * This function handles all changes to stats, ability, type, species, etc.
	 * as well as sending all relevant messages sent to the client.
	 */
	formeChange(
		speciesId: string | Species, source: Effect | null = this.battle.effect,
		isPermanent?: boolean, abilitySlot = '0', message?: string
	) {
		const rawSpecies = this.battle.dex.species.get(speciesId);

		const species = this.setSpecies(rawSpecies, source);
		if (!species) return false;

		if (this.battle.gen <= 2) return true;

		// The species the opponent sees
		const apparentSpecies =
			this.illusion ? this.illusion.species.name : species.baseSpecies;
		if (isPermanent) {
			this.baseSpecies = rawSpecies;
			this.details = this.getUpdatedDetails();
			let details = (this.illusion || this).details;
			if (this.terastallized) details += `, tera:${this.terastallized}`;
			this.battle.add('detailschange', this, details);
			if (!source) {
				// Tera forme
				// Ogerpon/Terapagos text goes here
				this.regressionForme = true;
			} else if (source.effectType === 'Item') {
				this.canTerastallize = null; // National Dex behavior
				if (source.zMove) {
					this.battle.add('-burst', this, apparentSpecies, species.requiredItem);
					this.moveThisTurnResult = true; // Ultra Burst counts as an action for Truant
				} else if (source.isPrimalOrb) {
					if (this.illusion) {
						this.ability = '';
						this.battle.add('-primal', this.illusion, species.requiredItem);
					} else {
						this.battle.add('-primal', this, species.requiredItem);
					}
				} else {
					this.battle.add('-mega', this, apparentSpecies, species.requiredItem);
					this.moveThisTurnResult = true; // Mega Evolution counts as an action for Truant
				}
				this.regressionForme = true;
			} else if (source.effectType === 'Status') {
				// Shaymin-Sky -> Shaymin
				this.battle.add('-formechange', this, species.name, message);
			}
		} else {
			if (source?.effectType === 'Ability') {
				this.battle.add('-formechange', this, species.name, message, `[from] ability: ${source.name}`);
			} else {
				this.battle.add('-formechange', this, this.illusion ? this.illusion.species.name : species.name, message);
			}
		}
		if (isPermanent && (!source || !['disguise', 'iceface'].includes(source.id))) {
			if (this.illusion) {
				this.ability = ''; // Don't allow Illusion to wear off
			}
			const ability = species.abilities[abilitySlot] || species.abilities['0'];
			// Ogerpon's forme change doesn't override permanent abilities
			if (source || !this.getAbility().flags['cantsuppress']) this.setAbility(ability, null, true);
			// However, its ability does reset upon switching out
			this.baseAbility = toID(ability);
		}
		if (this.terastallized) {
			this.knownType = true;
			this.apparentType = this.terastallized;
		}
		return true;
	}

	clearVolatile(includeSwitchFlags = true) {
		this.boosts = {
			atk: 0,
			def: 0,
			spa: 0,
			spd: 0,
			spe: 0,
			accuracy: 0,
			evasion: 0,
		};

		if (this.battle.gen === 1 && this.baseMoves.includes('mimic' as ID) && !this.transformed) {
			const moveslot = this.baseMoves.indexOf('mimic' as ID);
			const mimicPP = this.moveSlots[moveslot] ? this.moveSlots[moveslot].pp : 16;
			this.moveSlots = this.baseMoveSlots.slice();
			this.moveSlots[moveslot].pp = mimicPP;
		} else {
			this.moveSlots = this.baseMoveSlots.slice();
		}

		this.transformed = false;
		this.ability = this.baseAbility;
		this.hpType = this.baseHpType;
		this.hpPower = this.baseHpPower;
		if (this.canTerastallize === false) this.canTerastallize = this.teraType;
		for (const i in this.volatiles) {
			if (this.volatiles[i].linkedStatus) {
				this.removeLinkedVolatiles(this.volatiles[i].linkedStatus, this.volatiles[i].linkedPokemon);
			}
		}
		if (this.species.name === 'Eternatus-Eternamax' && this.volatiles['dynamax']) {
			this.volatiles = { dynamax: this.volatiles['dynamax'] };
		} else {
			this.volatiles = {};
		}
		if (includeSwitchFlags) {
			this.switchFlag = false;
			this.forceSwitchFlag = false;
		}

		this.lastMove = null;
		if (this.battle.gen === 2) this.lastMoveEncore = null;
		this.lastMoveUsed = null;
		this.moveThisTurn = '';
		this.moveLastTurnResult = undefined;
		this.moveThisTurnResult = undefined;

		this.lastDamage = 0;
		this.attackedBy = [];
		this.hurtThisTurn = null;
		this.newlySwitched = true;
		this.beingCalledBack = false;

		this.volatileStaleness = undefined;

		delete this.abilityState.started;
		delete this.itemState.started;

		this.setSpecies(this.baseSpecies);
	}

	hasType(type: string | string[]) {
		const thisTypes = this.getTypes();
		if (typeof type === 'string') {
			return thisTypes.includes(type);
		}

		for (const typeName of type) {
			if (thisTypes.includes(typeName)) return true;
		}
		return false;
	}

	/**
	 * This function only puts the pokemon in the faint queue;
	 * actually setting of this.fainted comes later when the
	 * faint queue is resolved.
	 *
	 * Returns the amount of damage actually dealt
	 */
	faint(source: Pokemon | null = null, effect: Effect | null = null) {
		if (this.fainted || this.faintQueued) return 0;
		const d = this.hp;
		this.hp = 0;
		this.switchFlag = false;
		this.faintQueued = true;
		this.battle.faintQueue.push({
			target: this,
			source,
			effect,
		});
		return d;
	}

	damage(d: number, source: Pokemon | null = null, effect: Effect | null = null) {
		if (!this.hp || isNaN(d) || d <= 0) return 0;
		if (d < 1 && d > 0) d = 1;
		d = this.battle.trunc(d);
		this.hp -= d;
		if (this.hp <= 0) {
			d += this.hp;
			this.faint(source, effect);
		}
		return d;
	}

	tryTrap(isHidden = false) {
		if (!this.runStatusImmunity('trapped')) return false;
		if (this.trapped && isHidden) return true;
		this.trapped = isHidden ? 'hidden' : true;
		return true;
	}

	hasMove(moveid: string) {
		moveid = toID(moveid);
		if (moveid.substr(0, 11) === 'hiddenpower') moveid = 'hiddenpower';
		for (const moveSlot of this.moveSlots) {
			if (moveid === moveSlot.id) {
				return moveid;
			}
		}
		return false;
	}

	disableMove(moveid: string, isHidden?: boolean | string, sourceEffect?: Effect) {
		if (!sourceEffect && this.battle.event) {
			sourceEffect = this.battle.effect;
		}
		moveid = toID(moveid);

		for (const moveSlot of this.moveSlots) {
			if (moveSlot.id === moveid && moveSlot.disabled !== true) {
				moveSlot.disabled = (isHidden || true);
				moveSlot.disabledSource = (sourceEffect?.name || moveSlot.move);
			}
		}
	}

	/** Returns the amount of damage actually healed */
	heal(d: number, source: Pokemon | null = null, effect: Effect | null = null) {
		if (!this.hp) return false;
		d = this.battle.trunc(d);
		if (isNaN(d)) return false;
		if (d <= 0) return false;
		if (this.hp >= this.maxhp) return false;
		this.hp += d;
		if (this.hp > this.maxhp) {
			d -= this.hp - this.maxhp;
			this.hp = this.maxhp;
		}
		return d;
	}

	/** Sets HP, returns delta */
	sethp(d: number) {
		if (!this.hp) return 0;
		d = this.battle.trunc(d);
		if (isNaN(d)) return;
		if (d < 1) d = 1;
		d -= this.hp;
		this.hp += d;
		if (this.hp > this.maxhp) {
			d -= this.hp - this.maxhp;
			this.hp = this.maxhp;
		}
		return d;
	}

	trySetStatus(status: string | Condition, source: Pokemon | null = null, sourceEffect: Effect | null = null) {
		return this.setStatus(this.status || status, source, sourceEffect);
	}

	/** Unlike clearStatus, gives cure message */
	cureStatus(silent = false) {
		if (!this.hp || !this.status) return false;
		this.battle.add('-curestatus', this, this.status, silent ? '[silent]' : '[msg]');
		if (this.status === 'slp' && this.removeVolatile('nightmare')) {
			this.battle.add('-end', this, 'Nightmare', '[silent]');
		}
		this.setStatus('');
		return true;
	}

	setStatus(
		status: string | Condition,
		source: Pokemon | null = null,
		sourceEffect: Effect | null = null,
		ignoreImmunities = false
	) {
		if (!this.hp) return false;
		status = this.battle.dex.conditions.get(status);
		if (this.battle.event) {
			if (!source) source = this.battle.event.source;
			if (!sourceEffect) sourceEffect = this.battle.effect;
		}
		if (!source) source = this;

		if (this.status === status.id) {
			if ((sourceEffect as Move)?.status === this.status) {
				this.battle.add('-fail', this, this.status);
			} else if ((sourceEffect as Move)?.status) {
				this.battle.add('-fail', source);
				this.battle.attrLastMove('[still]');
			}
			return false;
		}

		if (
			!ignoreImmunities && status.id && !(source?.hasAbility('corrosion') && ['tox', 'psn'].includes(status.id))
		) {
			// the game currently never ignores immunities
			if (!this.runStatusImmunity(status.id === 'tox' ? 'psn' : status.id)) {
				this.battle.debug('immune to status');
				if ((sourceEffect as Move)?.status) {
					this.battle.add('-immune', this);
				}
				return false;
			}
		}
		const prevStatus = this.status;
		const prevStatusState = this.statusState;
		if (status.id) {
			const result: boolean = this.battle.runEvent('SetStatus', this, source, sourceEffect, status);
			if (!result) {
				this.battle.debug('set status [' + status.id + '] interrupted');
				return result;
			}
		}

		this.status = status.id;
		this.statusState = this.battle.initEffectState({ id: status.id, target: this });
		if (source) this.statusState.source = source;
		if (status.duration) this.statusState.duration = status.duration;
		if (status.durationCallback) {
			this.statusState.duration = status.durationCallback.call(this.battle, this, source, sourceEffect);
		}

		if (status.id && !this.battle.singleEvent('Start', status, this.statusState, this, source, sourceEffect)) {
			this.battle.debug('status start [' + status.id + '] interrupted');
			// cancel the setstatus
			this.status = prevStatus;
			this.statusState = prevStatusState;
			return false;
		}
		if (status.id && !this.battle.runEvent('AfterSetStatus', this, source, sourceEffect, status)) {
			return false;
		}
		return true;
	}

	/**
	 * Unlike cureStatus, does not give cure message
	 */
	clearStatus() {
		if (!this.hp || !this.status) return false;
		if (this.status === 'slp' && this.removeVolatile('nightmare')) {
			this.battle.add('-end', this, 'Nightmare', '[silent]');
		}
		this.setStatus('');
		return true;
	}

	getStatus() {
		return this.battle.dex.conditions.getByID(this.status);
	}

	eatItem(force?: boolean, source?: Pokemon, sourceEffect?: Effect) {
		if (!this.item || this.itemState.knockedOff) return false;
		if ((!this.hp && this.item !== 'jabocaberry' && this.item !== 'rowapberry') || !this.isActive) return false;

		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event?.target) source = this.battle.event.target;
		const item = this.getItem();
		if (sourceEffect?.effectType === 'Item' && this.item !== sourceEffect.id && source === this) {
			// if an item is telling us to eat it but we aren't holding it, we probably shouldn't eat what we are holding
			return false;
		}
		if (
			this.battle.runEvent('UseItem', this, null, null, item) &&
			(force || this.battle.runEvent('TryEatItem', this, null, null, item))
		) {
			this.battle.add('-enditem', this, item, '[eat]');

			this.battle.singleEvent('Eat', item, this.itemState, this, source, sourceEffect);
			this.battle.runEvent('EatItem', this, null, null, item);

			if (RESTORATIVE_BERRIES.has(item.id)) {
				switch (this.pendingStaleness) {
				case 'internal':
					if (this.staleness !== 'external') this.staleness = 'internal';
					break;
				case 'external':
					this.staleness = 'external';
					break;
				}
				this.pendingStaleness = undefined;
			}

			this.lastItem = this.item;
			this.item = '';
			this.battle.clearEffectState(this.itemState);
			this.usedItemThisTurn = true;
			this.ateBerry = true;
			this.battle.runEvent('AfterUseItem', this, null, null, item);
			return true;
		}
		return false;
	}

	useItem(source?: Pokemon, sourceEffect?: Effect) {
		if ((!this.hp && !this.getItem().isGem) || !this.isActive) return false;
		if (!this.item || this.itemState.knockedOff) return false;

		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event?.target) source = this.battle.event.target;
		const item = this.getItem();
		if (sourceEffect?.effectType === 'Item' && this.item !== sourceEffect.id && source === this) {
			// if an item is telling us to eat it but we aren't holding it, we probably shouldn't eat what we are holding
			return false;
		}
		if (this.battle.runEvent('UseItem', this, null, null, item)) {
			switch (item.id) {
			case 'redcard':
				this.battle.add('-enditem', this, item, `[of] ${source}`);
				break;
			default:
				if (item.isGem) {
					this.battle.add('-enditem', this, item, '[from] gem');
				} else {
					this.battle.add('-enditem', this, item);
				}
				break;
			}
			if (item.boosts) {
				this.battle.boost(item.boosts, this, source, item);
			}

			this.battle.singleEvent('Use', item, this.itemState, this, source, sourceEffect);

			this.lastItem = this.item;
			this.item = '';
			this.battle.clearEffectState(this.itemState);
			this.usedItemThisTurn = true;
			this.battle.runEvent('AfterUseItem', this, null, null, item);
			return true;
		}
		return false;
	}

	takeItem(source?: Pokemon) {
		if (!this.item || this.itemState.knockedOff) return false;
		if (!source) source = this;
		if (this.battle.gen === 4) {
			if (toID(this.ability) === 'multitype') return false;
			if (toID(source.ability) === 'multitype') return false;
		}
		const item = this.getItem();
		if (this.battle.runEvent('TakeItem', this, source, null, item)) {
			this.item = '';
			const oldItemState = this.itemState;
			this.battle.clearEffectState(this.itemState);
			this.pendingStaleness = undefined;
			this.battle.singleEvent('End', item, oldItemState, this);
			this.battle.runEvent('AfterTakeItem', this, null, null, item);
			return item;
		}
		return false;
	}

	setItem(item: string | Item, source?: Pokemon, effect?: Effect) {
		if (!this.hp || !this.isActive) return false;
		if (this.itemState.knockedOff) return false;
		if (typeof item === 'string') item = this.battle.dex.items.get(item);

		const effectid = this.battle.effect ? this.battle.effect.id : '';
		if (RESTORATIVE_BERRIES.has('leppaberry' as ID)) {
			const inflicted = ['trick', 'switcheroo'].includes(effectid);
			const external = inflicted && source && !source.isAlly(this);
			this.pendingStaleness = external ? 'external' : 'internal';
		} else {
			this.pendingStaleness = undefined;
		}
		const oldItem = this.getItem();
		const oldItemState = this.itemState;
		this.item = item.id;
		this.itemState = this.battle.initEffectState({ id: item.id, target: this });
		if (oldItem.exists) this.battle.singleEvent('End', oldItem, oldItemState, this);
		if (item.id) {
			this.battle.singleEvent('Start', item, this.itemState, this, source, effect);
		}
		return true;
	}

	getItem() {
		return this.battle.dex.items.getByID(this.item);
	}

	hasItem(item: string | string[]) {
		if (Array.isArray(item)) {
			if (!item.map(toID).includes(this.item)) return false;
		} else {
			if (toID(item) !== this.item) return false;
		}
		return !this.ignoringItem();
	}

	clearItem() {
		return this.setItem('');
	}

	setAbility(ability: string | Ability, source?: Pokemon | null, isFromFormeChange = false, isTransform = false) {
		if (!this.hp) return false;
		if (typeof ability === 'string') ability = this.battle.dex.abilities.get(ability);
		const oldAbility = this.ability;
		if (!isFromFormeChange) {
			if (ability.flags['cantsuppress'] || this.getAbility().flags['cantsuppress']) return false;
		}
		if (!isFromFormeChange && !isTransform) {
			const setAbilityEvent: boolean | null = this.battle.runEvent('SetAbility', this, source, this.battle.effect, ability);
			if (!setAbilityEvent) return setAbilityEvent;
		}
		this.battle.singleEvent('End', this.battle.dex.abilities.get(oldAbility), this.abilityState, this, source);
		if (this.battle.effect && this.battle.effect.effectType === 'Move' && !isFromFormeChange) {
			this.battle.add(
				'-endability', this, this.battle.dex.abilities.get(oldAbility),
				`[from] move: ${this.battle.dex.moves.get(this.battle.effect.id)}`
			);
		}
		this.ability = ability.id;
		this.abilityState = this.battle.initEffectState({ id: ability.id, target: this });
		if (ability.id && this.battle.gen > 3 &&
			(!isTransform || oldAbility !== ability.id || this.battle.gen <= 4)) {
			this.battle.singleEvent('Start', ability, this.abilityState, this, source);
		}
		return oldAbility;
	}

	getAbility() {
		return this.battle.dex.abilities.getByID(this.ability);
	}

	hasAbility(ability: string | string[]) {
		if (Array.isArray(ability)) {
			if (!ability.map(toID).includes(this.ability)) return false;
		} else {
			if (toID(ability) !== this.ability) return false;
		}
		return !this.ignoringAbility();
	}

	clearAbility() {
		return this.setAbility('');
	}

	getNature() {
		return this.battle.dex.natures.get(this.set.nature);
	}

	addVolatile(
		status: string | Condition, source: Pokemon | null = null, sourceEffect: Effect | null = null,
		linkedStatus: string | Condition | null = null
	): boolean | any {
		let result;
		status = this.battle.dex.conditions.get(status);
		if (!this.hp && !status.affectsFainted) return false;
		if (linkedStatus && source && !source.hp) return false;
		if (this.battle.event) {
			if (!source) source = this.battle.event.source;
			if (!sourceEffect) sourceEffect = this.battle.effect;
		}
		if (!source) source = this;

		if (this.volatiles[status.id]) {
			if (!status.onRestart) return false;
			return this.battle.singleEvent('Restart', status, this.volatiles[status.id], this, source, sourceEffect);
		}
		if (!this.runStatusImmunity(status.id)) {
			this.battle.debug('immune to volatile status');
			if ((sourceEffect as Move)?.status) {
				this.battle.add('-immune', this);
			}
			return false;
		}
		result = this.battle.runEvent('TryAddVolatile', this, source, sourceEffect, status);
		if (!result) {
			this.battle.debug('add volatile [' + status.id + '] interrupted');
			return result;
		}
		this.volatiles[status.id] = this.battle.initEffectState({ id: status.id, name: status.name, target: this });
		if (source) {
			this.volatiles[status.id].source = source;
			this.volatiles[status.id].sourceSlot = source.getSlot();
		}
		if (sourceEffect) this.volatiles[status.id].sourceEffect = sourceEffect;
		if (status.duration) this.volatiles[status.id].duration = status.duration;
		if (status.durationCallback) {
			this.volatiles[status.id].duration = status.durationCallback.call(this.battle, this, source, sourceEffect);
		}
		result = this.battle.singleEvent('Start', status, this.volatiles[status.id], this, source, sourceEffect);
		if (!result) {
			// cancel
			delete this.volatiles[status.id];
			return result;
		}
		if (linkedStatus && source) {
			if (!source.volatiles[linkedStatus.toString()]) {
				source.addVolatile(linkedStatus, this, sourceEffect);
				source.volatiles[linkedStatus.toString()].linkedPokemon = [this];
				source.volatiles[linkedStatus.toString()].linkedStatus = status;
			} else {
				source.volatiles[linkedStatus.toString()].linkedPokemon.push(this);
			}
			this.volatiles[status.toString()].linkedPokemon = [source];
			this.volatiles[status.toString()].linkedStatus = linkedStatus;
		}
		return true;
	}

	getVolatile(status: string | Effect) {
		status = this.battle.dex.conditions.get(status) as Effect;
		if (!this.volatiles[status.id]) return null;
		return status;
	}

	removeVolatile(status: string | Effect) {
		if (!this.hp) return false;
		status = this.battle.dex.conditions.get(status) as Effect;
		if (!this.volatiles[status.id]) return false;
		const { linkedPokemon, linkedStatus } = this.volatiles[status.id];
		this.battle.singleEvent('End', status, this.volatiles[status.id], this);
		delete this.volatiles[status.id];
		if (linkedPokemon) {
			this.removeLinkedVolatiles(linkedStatus, linkedPokemon);
		}
		return true;
	}

	removeLinkedVolatiles(linkedStatus: string | Effect, linkedPokemon: Pokemon[]) {
		linkedStatus = linkedStatus.toString();
		for (const linkedPoke of linkedPokemon) {
			const volatileData = linkedPoke.volatiles[linkedStatus];
			if (!volatileData) continue;
			volatileData.linkedPokemon.splice(volatileData.linkedPokemon.indexOf(this), 1);
			if (volatileData.linkedPokemon.length === 0) {
				linkedPoke.removeVolatile(linkedStatus);
			}
		}
	}

	getHealth = () => {
		if (!this.hp) return { side: this.side.id, secret: '0 fnt', shared: '0 fnt' };
		let secret = `${this.hp}/${this.maxhp}`;
		let shared;
		const ratio = this.hp / this.maxhp;
		if (this.battle.reportExactHP) {
			shared = secret;
		} else if (this.battle.reportPercentages || this.battle.gen >= 8) {
			// HP Percentage Mod mechanics
			let percentage = Math.ceil(ratio * 100);
			if ((percentage === 100) && (ratio < 1.0)) {
				percentage = 99;
			}
			shared = `${percentage}/100`;
		} else {
			// In-game accurate pixel health mechanics
			const pixels = Math.floor(ratio * 48) || 1;
			shared = `${pixels}/48`;
			if ((pixels === 9) && (ratio > 0.2)) {
				shared += 'y'; // force yellow HP bar
			} else if ((pixels === 24) && (ratio > 0.5)) {
				shared += 'g'; // force green HP bar
			}
		}
		if (this.status) {
			secret += ` ${this.status}`;
			shared += ` ${this.status}`;
		}
		return { side: this.side.id, secret, shared };
	};

	/**
	 * Sets a type (except on Arceus, who resists type changes)
	 */
	setType(newType: string | string[], enforce = false) {
		if (!enforce) {
			// No Pokemon should be able to have Stellar as a base type
			if (typeof newType === 'string' ? newType === 'Stellar' : newType.includes('Stellar')) return false;
			// First type of Arceus, Silvally cannot be normally changed
			if ((this.battle.gen >= 5 && (this.species.num === 493 || this.species.num === 773)) ||
				(this.battle.gen === 4 && this.hasAbility('multitype'))) {
				return false;
			}
			// Terastallized Pokemon cannot have their base type changed except via forme change
			if (this.terastallized) return false;
		}

		if (!newType) throw new Error("Must pass type to setType");
		this.types = (typeof newType === 'string' ? [newType] : newType);
		this.addedType = '';
		this.knownType = true;
		this.apparentType = this.types.join('/');

		return true;
	}

	/** Removes any types added previously and adds another one. */
	addType(newType: string) {
		if (this.terastallized) return false;
		this.addedType = newType;
		return true;
	}

	getTypes(excludeAdded?: boolean, preterastallized?: boolean): string[] {
		if (!preterastallized && this.terastallized && this.terastallized !== 'Stellar') {
			return [this.terastallized];
		}
		const types = this.battle.runEvent('Type', this, null, null, this.types);
		if (!types.length) types.push(this.battle.gen >= 5 ? 'Normal' : '???');
		if (!excludeAdded && this.addedType) return types.concat(this.addedType);
		return types;
	}

	isGrounded(negateImmunity = false) {
		if ('gravity' in this.battle.field.pseudoWeather) return true;
		if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
		if ('smackdown' in this.volatiles) return true;
		const item = (this.ignoringItem() ? '' : this.item);
		if (item === 'ironball') return true;
		// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
		if (!negateImmunity && this.hasType('Flying') && !(this.hasType('???') && 'roost' in this.volatiles)) return false;
		if (this.hasAbility('levitate') && !this.battle.suppressingAbility(this)) return null;
		if ('magnetrise' in this.volatiles) return false;
		if ('telekinesis' in this.volatiles) return false;
		return item !== 'airballoon';
	}

	isSemiInvulnerable() {
		return (this.volatiles['fly'] || this.volatiles['bounce'] || this.volatiles['dive'] || this.volatiles['dig'] ||
			this.volatiles['phantomforce'] || this.volatiles['shadowforce'] || this.isSkyDropped());
	}

	isSkyDropped() {
		if (this.volatiles['skydrop']) return true;
		for (const foeActive of this.side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === this) {
				return true;
			}
		}
		return false;
	}

	/** Specifically: is protected against a single-target damaging move */
	isProtected() {
		return !!(
			this.volatiles['protect'] || this.volatiles['detect'] || this.volatiles['maxguard'] ||
			this.volatiles['kingsshield'] || this.volatiles['spikyshield'] || this.volatiles['banefulbunker'] ||
			this.volatiles['obstruct'] || this.volatiles['silktrap'] || this.volatiles['burningbulwark']
		);
	}

	/**
	 * Like Field.effectiveWeather(), but ignores sun and rain if
	 * the Utility Umbrella is active for the Pokemon.
	 */
	effectiveWeather() {
		const weather = this.battle.field.effectiveWeather();
		switch (weather) {
		case 'sunnyday':
		case 'raindance':
		case 'desolateland':
		case 'primordialsea':
			if (this.hasItem('utilityumbrella')) return '';
		}
		return weather;
	}

	runEffectiveness(move: ActiveMove) {
		let totalTypeMod = 0;
		if (this.terastallized && move.type === 'Stellar') {
			totalTypeMod = 1;
		} else {
			for (const type of this.getTypes()) {
				let typeMod = this.battle.dex.getEffectiveness(move, type);
				typeMod = this.battle.singleEvent('Effectiveness', move, null, this, type, move, typeMod);
				totalTypeMod += this.battle.runEvent('Effectiveness', this, type, move, typeMod);
			}
		}
		if (this.species.name === 'Terapagos-Terastal' && this.hasAbility('Tera Shell') &&
			!this.battle.suppressingAbility(this)) {
			if (this.abilityState.resisted) return -1; // all hits of multi-hit move should be not very effective
			if (move.category === 'Status' || move.id === 'struggle' || !this.runImmunity(move.type) ||
				totalTypeMod < 0 || this.hp < this.maxhp) {
				return totalTypeMod;
			}

			this.battle.add('-activate', this, 'ability: Tera Shell');
			this.abilityState.resisted = true;
			return -1;
		}
		return totalTypeMod;
	}

	/** false = immune, true = not immune */
	runImmunity(type: string, message?: string | boolean) {
		if (!type || type === '???') return true;
		if (!this.battle.dex.types.isName(type)) {
			throw new Error("Use runStatusImmunity for " + type);
		}
		if (this.fainted) return false;

		const negateImmunity = !this.battle.runEvent('NegateImmunity', this, type);
		const notImmune = type === 'Ground' ?
			this.isGrounded(negateImmunity) :
			negateImmunity || this.battle.dex.getImmunity(type, this);
		if (notImmune) return true;
		if (!message) return false;
		if (notImmune === null) {
			this.battle.add('-immune', this, '[from] ability: Levitate');
		} else {
			this.battle.add('-immune', this);
		}
		return false;
	}

	runStatusImmunity(type: string, message?: string) {
		if (this.fainted) return false;
		if (!type) return true;

		if (!this.battle.dex.getImmunity(type, this)) {
			this.battle.debug('natural status immunity');
			if (message) {
				this.battle.add('-immune', this);
			}
			return false;
		}
		const immunity = this.battle.runEvent('Immunity', this, null, null, type);
		if (!immunity) {
			this.battle.debug('artificial status immunity');
			if (message && immunity !== null) {
				this.battle.add('-immune', this);
			}
			return false;
		}
		return true;
	}

	destroy() {
		// deallocate ourself
		// get rid of some possibly-circular references
		(this as any).battle = null!;
		(this as any).side = null!;
	}
}
