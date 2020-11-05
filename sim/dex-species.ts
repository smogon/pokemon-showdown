import {toID, BasicEffect} from './dex-data';

interface SpeciesAbility {
	0: string;
	1?: string;
	H?: string;
	S?: string;
}

export interface SpeciesData extends Partial<Species> {
	name: string;
	/** National Dex number */
	num: number;

	types: string[];
	abilities: SpeciesAbility;
	baseStats: StatsTable;
	eggGroups: string[];
	weightkg: number;
}

export type ModdedSpeciesData = SpeciesData | Partial<Omit<SpeciesData, 'name'>> & {inherit: true};

export interface SpeciesFormatsData {
	comboMoves?: readonly string[];
	doublesTier?: TierTypes.Doubles | TierTypes.Other;
	essentialMove?: string;
	exclusiveMoves?: readonly string[];
	gmaxUnreleased?: boolean;
	isNonstandard?: Nonstandard | null;
	randomBattleMoves?: readonly string[];
	randomBattleLevel?: number;
	randomDoubleBattleMoves?: readonly string[];
	randomDoubleBattleLevel?: number;
	tier?: TierTypes.Singles | TierTypes.Other;
}

export type ModdedSpeciesFormatsData = SpeciesFormatsData & {inherit?: true};

export class Species extends BasicEffect implements Readonly<BasicEffect & SpeciesFormatsData> {
	readonly effectType: 'Pokemon';
	/**
	 * Species ID. Identical to ID. Note that this is the full ID, e.g.
	 * 'basculinbluestriped'. To get the base species ID, you need to
	 * manually read toID(species.baseSpecies).
	 */
	readonly id: ID;
	/**
	 * Name. Note that this is the full name with forme,
	 * e.g. 'Basculin-Blue-Striped'. To get the name without forme, see
	 * `species.baseSpecies`.
	 */
	readonly name: string;
	/**
	 * Base species. Species, but without the forme name.
	 *
	 * DO NOT ASSUME A POKEMON CAN TRANSFORM FROM `baseSpecies` TO
	 * `species`. USE `changesFrom` FOR THAT.
	 */
	readonly baseSpecies: string;
	/**
	 * Forme name. If the forme exists,
	 * `species.name === species.baseSpecies + '-' + species.forme`
	 *
	 * The games make a distinction between Forme (foorumu) (legendary Pokémon)
	 * and Form (sugata) (non-legendary Pokémon). PS does not use the same
	 * distinction – they're all "Forme" to PS, reflecting current community
	 * use of the term.
	 *
	 * This property only tracks non-cosmetic formes, and will be `''` for
	 * cosmetic formes.
	 */
	readonly forme: string;
	/**
	 * Base forme name (e.g. 'Altered' for Giratina).
	 */
	readonly baseForme: string;
	/**
	 * Other forms. List of names of cosmetic forms. These should have
	 * `aliases.js` aliases to this entry, but not have their own
	 * entry in `pokedex.js`.
	 */
	readonly cosmeticFormes?: string[];
	/**
	 * Other formes. List of names of formes, appears only on the base
	 * forme. Unlike forms, these have their own entry in `pokedex.js`.
	 */
	readonly otherFormes?: string[];
	/**
	 * List of forme speciesNames in the order they appear in the game data -
	 * the union of baseSpecies, otherFormes and cosmeticFormes. Appears only on
	 * the base species forme.
	 *
	 * A species's alternate formeindex may change from generation to generation -
	 * the forme with index N in Gen A is not guaranteed to be the same forme as the
	 * forme with index in Gen B.
	 *
	 * Gigantamaxes are not considered formes by the game (see data/FORMES.md - PS
	 * labels them as such for convenience) - Gigantamax "formes" are instead included at
	 * the end of the formeOrder list so as not to interfere with the correct index numbers.
	 */
	readonly formeOrder?: string[];
	/**
	 * Sprite ID. Basically the same as ID, but with a dash between
	 * species and forme.
	 */
	readonly spriteid: string;
	/** Abilities. */
	readonly abilities: SpeciesAbility;
	/** Types. */
	readonly types: string[];
	/** Added type (used in OMs). */
	readonly addedType?: string;
	/** Pre-evolution. '' if nothing evolves into this Pokemon. */
	readonly prevo: string;
	/** Evolutions. Array because many Pokemon have multiple evolutions. */
	readonly evos: string[];
	readonly evoType?: 'trade' | 'useItem' | 'levelMove' | 'levelExtra' | 'levelFriendship' | 'levelHold' | 'other';
	/** Evolution condition. falsy if doesn't evolve. */
	readonly evoCondition?: string;
	/** Evolution item. falsy if doesn't evolve. */
	readonly evoItem?: string;
	/** Evolution move. falsy if doesn't evolve. */
	readonly evoMove?: string;
	/** Evolution level. falsy if doesn't evolve. */
	readonly evoLevel?: number;
	/** Is NFE? True if this Pokemon can evolve (Mega evolution doesn't count). */
	readonly nfe: boolean;
	/** Egg groups. */
	readonly eggGroups: string[];
	/** True if this species can hatch from an Egg. */
	readonly canHatch: boolean;
	/**
	 * Gender. M = always male, F = always female, N = always
	 * genderless, '' = sometimes male sometimes female.
	 */
	readonly gender: GenderName;
	/** Gender ratio. Should add up to 1 unless genderless. */
	readonly genderRatio: {M: number, F: number};
	/** Base stats. */
	readonly baseStats: StatsTable;
	/** Max HP. Overrides usual HP calculations (for Shedinja). */
	readonly maxHP?: number;
	/** A Pokemon's Base Stat Total */
	readonly bst: number;
	/** Weight (in kg). Not valid for OMs; use weighthg / 10 instead. */
	readonly weightkg: number;
	/** Weight (in integer multiples of 0.1kg). */
	readonly weighthg: number;
	/** Height (in m). */
	readonly heightm: number;
	/** Color. */
	readonly color: string;
	/** Does this Pokemon have an unreleased hidden ability? */
	readonly unreleasedHidden: boolean | 'Past';
	/**
	 * Is it only possible to get the hidden ability on a male pokemon?
	 * This is mainly relevant to Gen 5.
	 */
	readonly maleOnlyHidden: boolean;
	/** True if a pokemon is mega. */
	readonly isMega?: boolean;
	/** True if a pokemon is primal. */
	readonly isPrimal?: boolean;
	/** Name of its Gigantamax move, if a pokemon is capable of gigantamaxing. */
	readonly canGigantamax?: string;
	/** If this Pokemon can gigantamax, is its gigantamax released? */
	readonly gmaxUnreleased?: boolean;
	/** True if a Pokemon species is incapable of dynamaxing */
	readonly cannotDynamax?: boolean;
	/** What it transforms from, if a pokemon is a forme that is only accessible in battle. */
	readonly battleOnly?: string | string[];
	/** Required item. Do not use this directly; see requiredItems. */
	readonly requiredItem?: string;
	/** Required move. Move required to use this forme in-battle. */
	readonly requiredMove?: string;
	/** Required ability. Ability required to use this forme in-battle. */
	readonly requiredAbility?: string;
	/**
	 * Required items. Items required to be in this forme, e.g. a mega
	 * stone, or Griseous Orb. Array because Arceus formes can hold
	 * either a Plate or a Z-Crystal.
	 */
	readonly requiredItems?: string[];

	/**
	 * Formes that can transform into this Pokemon, to inherit learnsets
	 * from. (Like `prevo`, but for transformations that aren't
	 * technically evolution. Includes in-battle transformations like
	 * Zen Mode and out-of-battle transformations like Rotom.)
	 *
	 * Not filled out for megas/primals - fall back to baseSpecies
	 * for in-battle formes.
	 */
	readonly changesFrom?: string;

	/**
	 * Singles Tier. The Pokemon's location in the Smogon tier system.
	 * Do not use for LC bans (usage tier will override LC Uber).
	 */
	readonly tier: TierTypes.Singles | TierTypes.Other;
	/**
	 * Doubles Tier. The Pokemon's location in the Smogon doubles tier system.
	 * Do not use for LC bans (usage tier will override LC Uber).
	 */
	readonly doublesTier: TierTypes.Doubles | TierTypes.Other;
	readonly randomBattleMoves?: readonly ID[];
	readonly randomBattleLevel?: number;
	readonly randomDoubleBattleMoves?: readonly ID[];
	readonly randomDoubleBattleLevel?: number;
	readonly exclusiveMoves?: readonly ID[];
	readonly comboMoves?: readonly ID[];
	readonly essentialMove?: ID;

	constructor(data: AnyObject, ...moreData: (AnyObject | null)[]) {
		super(data, ...moreData);
		data = this;

		this.fullname = `pokemon: ${data.name}`;
		this.effectType = 'Pokemon';
		this.id = data.id as ID;
		this.name = data.name;
		this.baseSpecies = data.baseSpecies || this.name;
		this.forme = data.forme || '';
		this.baseForme = data.baseForme || '';
		this.cosmeticFormes = data.cosmeticFormes || undefined;
		this.otherFormes = data.otherFormes || undefined;
		this.formeOrder = data.formeOrder || undefined;
		this.spriteid = data.spriteid ||
			(toID(this.baseSpecies) + (this.baseSpecies !== this.name ? `-${toID(this.forme)}` : ''));
		this.abilities = data.abilities || {0: ""};
		this.types = data.types || ['???'];
		this.addedType = data.addedType || undefined;
		this.prevo = data.prevo || '';
		this.tier = data.tier || '';
		this.doublesTier = data.doublesTier || '';
		this.evos = data.evos || [];
		this.evoType = data.evoType || undefined;
		this.evoMove = data.evoMove || undefined;
		this.evoLevel = data.evoLevel || undefined;
		this.nfe = data.nfe || false;
		this.eggGroups = data.eggGroups || [];
		this.canHatch = data.canHatch || false;
		this.gender = data.gender || '';
		this.genderRatio = data.genderRatio || (this.gender === 'M' ? {M: 1, F: 0} :
			this.gender === 'F' ? {M: 0, F: 1} :
			this.gender === 'N' ? {M: 0, F: 0} :
			{M: 0.5, F: 0.5});
		this.requiredItem = data.requiredItem || undefined;
		this.requiredItems = this.requiredItems || (this.requiredItem ? [this.requiredItem] : undefined);
		this.baseStats = data.baseStats || {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
		this.bst = this.baseStats.hp + this.baseStats.atk + this.baseStats.def +
			this.baseStats.spa + this.baseStats.spd + this.baseStats.spe;
		this.weightkg = data.weightkg || 0;
		this.weighthg = this.weightkg * 10;
		this.heightm = data.heightm || 0;
		this.color = data.color || '';
		this.unreleasedHidden = data.unreleasedHidden || false;
		this.maleOnlyHidden = !!data.maleOnlyHidden;
		this.maxHP = data.maxHP || undefined;
		this.isMega = !!(this.forme && ['Mega', 'Mega-X', 'Mega-Y'].includes(this.forme)) || undefined;
		this.canGigantamax = data.canGigantamax || undefined;
		this.gmaxUnreleased = !!data.gmaxUnreleased;
		this.cannotDynamax = !!data.cannotDynamax;
		this.battleOnly = data.battleOnly || (this.isMega ? this.baseSpecies : undefined);
		this.changesFrom = data.changesFrom ||
			(this.battleOnly !== this.baseSpecies ? this.battleOnly : this.baseSpecies);
		if (Array.isArray(data.changesFrom)) this.changesFrom = data.changesFrom[0];

		if (!this.gen && this.num >= 1) {
			if (this.num >= 810 || ['Gmax', 'Galar', 'Galar-Zen'].includes(this.forme)) {
				this.gen = 8;
			} else if (this.num >= 722 || this.forme.startsWith('Alola') || this.forme === 'Starter') {
				this.gen = 7;
			} else if (this.forme === 'Primal') {
				this.gen = 6;
				this.isPrimal = true;
				this.battleOnly = this.baseSpecies;
			} else if (this.num >= 650 || this.isMega) {
				this.gen = 6;
			} else if (this.num >= 494) {
				this.gen = 5;
			} else if (this.num >= 387) {
				this.gen = 4;
			} else if (this.num >= 252) {
				this.gen = 3;
			} else if (this.num >= 152) {
				this.gen = 2;
			} else {
				this.gen = 1;
			}
		}
	}
}
