import {toID, BasicEffect} from './dex-data';

interface SpeciesAbility {
	0: string;
	1?: string;
	H?: string;
	S?: string;
}

type SpeciesTag = "Mythical" | "Restricted Legendary" | "Sub-Legendary" | "Paradox";

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
	doublesTier?: TierTypes.Doubles | TierTypes.Other;
	gmaxUnreleased?: boolean;
	isNonstandard?: Nonstandard | null;
	natDexTier?: TierTypes.Singles | TierTypes.Other;
	tier?: TierTypes.Singles | TierTypes.Other;
}

export type ModdedSpeciesFormatsData = SpeciesFormatsData & {inherit?: true};

export interface LearnsetData {
	learnset?: {[moveid: string]: MoveSource[]};
	eventData?: EventInfo[];
	eventOnly?: boolean;
	encounters?: EventInfo[];
	exists?: boolean;
}

export type ModdedLearnsetData = LearnsetData & {inherit?: true};

export interface PokemonGoData {
	encounters?: string[];
	LGPERestrictiveMoves?: {[moveid: string]: number | null};
}

export class Species extends BasicEffect implements Readonly<BasicEffect & SpeciesFormatsData> {
	declare readonly effectType: 'Pokemon';
	/**
	 * Species ID. Identical to ID. Note that this is the full ID, e.g.
	 * 'basculinbluestriped'. To get the base species ID, you need to
	 * manually read toID(species.baseSpecies).
	 */
	declare readonly id: ID;
	/**
	 * Name. Note that this is the full name with forme,
	 * e.g. 'Basculin-Blue-Striped'. To get the name without forme, see
	 * `species.baseSpecies`.
	 */
	declare readonly name: string;
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
	/** Added type (added by Trick-Or-Treat or Forest's Curse, but only listed in species by OMs). */
	readonly addedType?: string;
	/** Pre-evolution. '' if nothing evolves into this Pokemon. */
	readonly prevo: string;
	/** Evolutions. Array because many Pokemon have multiple evolutions. */
	readonly evos: string[];
	readonly evoType?: 'trade' | 'useItem' | 'levelMove' | 'levelExtra' | 'levelFriendship' | 'levelHold' | 'other';
	/** Evolution condition. falsy if doesn't evolve. */
	declare readonly evoCondition?: string;
	/** Evolution item. falsy if doesn't evolve. */
	declare readonly evoItem?: string;
	/** Evolution move. falsy if doesn't evolve. */
	readonly evoMove?: string;
	/** Region required to be in for evolution. falsy if doesn't evolve. */
	readonly evoRegion?: 'Alola' | 'Galar';
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
	/**
	 * Tags, boolean data. Currently just legendary/mythical status.
	 */
	readonly tags: SpeciesTag[];
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
	declare readonly isPrimal?: boolean;
	/** Name of its Gigantamax move, if a pokemon is capable of gigantamaxing. */
	readonly canGigantamax?: string;
	/** If this Pokemon can gigantamax, is its gigantamax released? */
	readonly gmaxUnreleased?: boolean;
	/** True if a Pokemon species is incapable of dynamaxing */
	readonly cannotDynamax?: boolean;
	/** The Tera Type this Pokemon is forced to use */
	readonly forceTeraType?: string;
	/** What it transforms from, if a pokemon is a forme that is only accessible in battle. */
	readonly battleOnly?: string | string[];
	/** Required item. Do not use this directly; see requiredItems. */
	readonly requiredItem?: string;
	/** Required move. Move required to use this forme in-battle. */
	declare readonly requiredMove?: string;
	/** Required ability. Ability required to use this forme in-battle. */
	declare readonly requiredAbility?: string;
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
	 * List of sources and other availability for a Pokemon transferred from
	 * Pokemon GO.
	 */
	readonly pokemonGoData?: string[];

	/**
	 * Singles Tier. The Pokemon's location in the Smogon tier system.
	 */
	readonly tier: TierTypes.Singles | TierTypes.Other;
	/**
	 * Doubles Tier. The Pokemon's location in the Smogon doubles tier system.
	 */
	readonly doublesTier: TierTypes.Doubles | TierTypes.Other;
	/**
	 * National Dex Tier. The Pokemon's location in the Smogon National Dex tier system.
	 */
	readonly natDexTier: TierTypes.Singles | TierTypes.Other;

	constructor(data: AnyObject) {
		super(data);
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		data = this;

		this.fullname = `pokemon: ${data.name}`;
		this.effectType = 'Pokemon';
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
		this.natDexTier = data.natDexTier || '';
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
		this.tags = data.tags || [];
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
		this.pokemonGoData = data.pokemonGoData || undefined;
		if (Array.isArray(data.changesFrom)) this.changesFrom = data.changesFrom[0];

		if (!this.gen && this.num >= 1) {
			if (this.num >= 906 || this.forme.includes('Paldea')) {
				this.gen = 9;
			} else if (this.num >= 810 || ['Gmax', 'Galar', 'Galar-Zen', 'Hisui'].includes(this.forme)) {
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

export class Learnset {
	readonly effectType: 'Learnset';
	/**
	 * Keeps track of exactly how a pokemon might learn a move, in the
	 * form moveid:sources[].
	 */
	readonly learnset?: {[moveid: string]: MoveSource[]};
	/** True if the only way to get this Pokemon is from events. */
	readonly eventOnly: boolean;
	/** List of event data for each event. */
	readonly eventData?: EventInfo[];
	readonly encounters?: EventInfo[];
	readonly exists: boolean;
	readonly species: Species;

	constructor(data: AnyObject, species: Species) {
		this.exists = true;
		this.effectType = 'Learnset';
		this.learnset = data.learnset || undefined;
		this.eventOnly = !!data.eventOnly;
		this.eventData = data.eventData || undefined;
		this.encounters = data.encounters || undefined;
		this.species = species;
	}
}

export class DexSpecies {
	readonly dex: ModdedDex;
	readonly speciesCache = new Map<ID, Species>();
	readonly learnsetCache = new Map<ID, Learnset>();
	allCache: readonly Species[] | null = null;

	constructor(dex: ModdedDex) {
		this.dex = dex;
	}

	get(name?: string | Species): Species {
		if (name && typeof name !== 'string') return name;

		name = (name || '').trim();
		let id = toID(name);
		if (id === 'nidoran' && name.endsWith('♀')) {
			id = 'nidoranf' as ID;
		} else if (id === 'nidoran' && name.endsWith('♂')) {
			id = 'nidoranm' as ID;
		}

		return this.getByID(id);
	}
	getByID(id: ID): Species {
		let species: Mutable<Species> | undefined = this.speciesCache.get(id);
		if (species) return species;

		if (this.dex.data.Aliases.hasOwnProperty(id)) {
			if (this.dex.data.FormatsData.hasOwnProperty(id)) {
				// special event ID, like Rockruff-Dusk
				const baseId = toID(this.dex.data.Aliases[id]);
				species = new Species({
					...this.dex.data.Pokedex[baseId],
					...this.dex.data.FormatsData[id],
					name: id,
				});
				species.abilities = {0: species.abilities['S']!};
			} else {
				species = this.get(this.dex.data.Aliases[id]);
				if (species.cosmeticFormes) {
					for (const forme of species.cosmeticFormes) {
						if (toID(forme) === id) {
							species = new Species({
								...species,
								name: forme,
								forme: forme.slice(species.name.length + 1),
								baseForme: "",
								baseSpecies: species.name,
								otherFormes: null,
								cosmeticFormes: null,
							});
							break;
						}
					}
				}
			}
			this.speciesCache.set(id, this.dex.deepFreeze(species));
			return species;
		}

		if (!this.dex.data.Pokedex.hasOwnProperty(id)) {
			let aliasTo = '';
			const formeNames: {[k: string]: string[]} = {
				alola: ['a', 'alola', 'alolan'],
				galar: ['g', 'galar', 'galarian'],
				hisui: ['h', 'hisui', 'hisuian'],
				paldea: ['p', 'paldea', 'paldean'],
				mega: ['m', 'mega'],
				primal: ['p', 'primal'],
			};
			for (const forme in formeNames) {
				let pokeName = '';
				for (const i of formeNames[forme]) {
					if (id.startsWith(i)) {
						pokeName = id.slice(i.length);
					} else if (id.endsWith(i)) {
						pokeName = id.slice(0, -i.length);
					}
				}
				if (this.dex.data.Aliases.hasOwnProperty(pokeName)) pokeName = toID(this.dex.data.Aliases[pokeName]);
				if (this.dex.data.Pokedex[pokeName + forme]) {
					aliasTo = pokeName + forme;
					break;
				}
			}
			if (aliasTo) {
				species = this.get(aliasTo);
				if (species.exists) {
					this.speciesCache.set(id, species);
					return species;
				}
			}
		}
		if (id && this.dex.data.Pokedex.hasOwnProperty(id)) {
			const pokedexData = this.dex.data.Pokedex[id];
			const baseSpeciesTags = pokedexData.baseSpecies && this.dex.data.Pokedex[toID(pokedexData.baseSpecies)].tags;
			species = new Species({
				tags: baseSpeciesTags,
				...pokedexData,
				...this.dex.data.FormatsData[id],
			});
			// Inherit any statuses from the base species (Arceus, Silvally).
			const baseSpeciesStatuses = this.dex.data.Conditions[toID(species.baseSpecies)];
			if (baseSpeciesStatuses !== undefined) {
				let key: keyof EffectData;
				for (key in baseSpeciesStatuses) {
					if (!(key in species)) (species as any)[key] = baseSpeciesStatuses[key];
				}
			}
			if (!species.tier && !species.doublesTier && !species.natDexTier && species.baseSpecies !== species.name) {
				if (species.baseSpecies === 'Mimikyu') {
					species.tier = this.dex.data.FormatsData[toID(species.baseSpecies)].tier || 'Illegal';
					species.doublesTier = this.dex.data.FormatsData[toID(species.baseSpecies)].doublesTier || 'Illegal';
					species.natDexTier = this.dex.data.FormatsData[toID(species.baseSpecies)].natDexTier || 'Illegal';
				} else if (species.id.endsWith('totem')) {
					species.tier = this.dex.data.FormatsData[species.id.slice(0, -5)].tier || 'Illegal';
					species.doublesTier = this.dex.data.FormatsData[species.id.slice(0, -5)].doublesTier || 'Illegal';
					species.natDexTier = this.dex.data.FormatsData[species.id.slice(0, -5)].natDexTier || 'Illegal';
				} else if (species.battleOnly) {
					species.tier = this.dex.data.FormatsData[toID(species.battleOnly)].tier || 'Illegal';
					species.doublesTier = this.dex.data.FormatsData[toID(species.battleOnly)].doublesTier || 'Illegal';
					species.natDexTier = this.dex.data.FormatsData[toID(species.battleOnly)].natDexTier || 'Illegal';
				} else {
					const baseFormatsData = this.dex.data.FormatsData[toID(species.baseSpecies)];
					if (!baseFormatsData) {
						throw new Error(`${species.baseSpecies} has no formats-data entry`);
					}
					species.tier = baseFormatsData.tier || 'Illegal';
					species.doublesTier = baseFormatsData.doublesTier || 'Illegal';
					species.natDexTier = baseFormatsData.natDexTier || 'Illegal';
				}
			}
			if (!species.tier) species.tier = 'Illegal';
			if (!species.doublesTier) species.doublesTier = species.tier as any;
			if (!species.natDexTier) species.natDexTier = species.tier;
			if (species.gen > this.dex.gen) {
				species.tier = 'Illegal';
				species.doublesTier = 'Illegal';
				species.natDexTier = 'Illegal';
				species.isNonstandard = 'Future';
			}
			if (this.dex.currentMod === 'gen7letsgo' && !species.isNonstandard) {
				const isLetsGo = (
					(species.num <= 151 || ['Meltan', 'Melmetal'].includes(species.name)) &&
					(!species.forme || (['Alola', 'Mega', 'Mega-X', 'Mega-Y', 'Starter'].includes(species.forme) &&
					species.name !== 'Pikachu-Alola'))
				);
				if (!isLetsGo) species.isNonstandard = 'Past';
			}
			if (this.dex.currentMod === 'gen8bdsp' &&
				(!species.isNonstandard || ["Gigantamax", "CAP"].includes(species.isNonstandard))) {
				if (species.gen > 4 || (species.num < 1 && species.isNonstandard !== 'CAP') ||
					species.id === 'pichuspikyeared') {
					species.isNonstandard = 'Future';
					species.tier = species.doublesTier = species.natDexTier = 'Illegal';
				}
			}
			species.nfe = species.evos.some(evo => {
				const evoSpecies = this.get(evo);
				return !evoSpecies.isNonstandard ||
					evoSpecies.isNonstandard === species?.isNonstandard ||
					// Pokemon with Hisui evolutions
					evoSpecies.isNonstandard === "Unobtainable";
			});
			species.canHatch = species.canHatch ||
				(!['Ditto', 'Undiscovered'].includes(species.eggGroups[0]) && !species.prevo && species.name !== 'Manaphy');
			if (this.dex.gen === 1) species.bst -= species.baseStats.spd;
			if (this.dex.gen < 5) {
				species.abilities = this.dex.deepClone(species.abilities);
				delete species.abilities['H'];
			}
			if (this.dex.gen === 3 && this.dex.abilities.get(species.abilities['1']).gen === 4) delete species.abilities['1'];
		} else {
			species = new Species({
				id, name: id,
				exists: false, tier: 'Illegal', doublesTier: 'Illegal', natDexTier: 'Illegal', isNonstandard: 'Custom',
			});
		}
		if (species.exists) this.speciesCache.set(id, this.dex.deepFreeze(species));
		return species;
	}

	/**
	 * @param id the ID of the species the move pool belongs to
	 * @param isNatDex
	 * @returns a Set of IDs of the full valid movepool of the given species for the current generation/mod.
	 * Note that inter-move incompatibilities, such as those from exclusive events, are not considered and all moves are
	 * lumped together. However, Necturna and Necturine's Sketchable moves are omitted from this pool, as their fundamental
	 * incompatibility with each other is essential to the nature of those species.
	 */
	getMovePool(id: ID, isNatDex = false): Set<ID> {
		let eggMovesOnly = false;
		let maxGen = this.dex.gen;
		const movePool = new Set<ID>();
		for (const {species, learnset} of this.getFullLearnset(id)) {
			for (const moveid in learnset) {
				if (eggMovesOnly) {
					if (learnset[moveid].some(source => source.startsWith('9E'))) {
						movePool.add(moveid as ID);
					}
				} else if (maxGen >= 9) {
					// Pokemon Home now strips learnsets on withdrawal
					if (isNatDex || learnset[moveid].some(source => source.startsWith('9'))) {
						movePool.add(moveid as ID);
					}
				} else {
					if (learnset[moveid].some(source => parseInt(source.charAt(0)) <= maxGen)) {
						movePool.add(moveid as ID);
					}
				}
				if (moveid === 'sketch' && movePool.has('sketch' as ID)) {
					if (species.isNonstandard === 'CAP') {
						// Given what this function is generally used for, adding all sketchable moves to Necturna and Necturine's
						// movepools would be undesirable as it would be impossible to tell sketched moves apart from normal ones
						// so any code calling this one will need to get and handle those moves separately themselves
						continue;
					}
					// Smeargle time
					// A few moves like Dark Void were made unSketchable in a generation later than when they were introduced
					// However, this has only happened in a gen where transfer moves are unavailable
					const sketchables = this.dex.moves.all().filter(m => !m.noSketch && !m.isNonstandard);
					for (const move of sketchables) {
						movePool.add(move.id);
					}
					// Smeargle has some event moves; they're all sketchable, so let's just skip them
					break;
				}
			}
			if (species.evoRegion) {
				// species can only evolve in this gen, so prevo can't have any moves
				// from after that gen
				if (this.dex.gen >= 9) eggMovesOnly = true;
				if (this.dex.gen === 8 && species.evoRegion === 'Alola') maxGen = 7;
			}
		}
		return movePool;
	}

	getFullLearnset(id: ID): (Learnset & {learnset: NonNullable<Learnset['learnset']>})[] {
		const originalSpecies = this.get(id);
		let species: Species | null = originalSpecies;
		const out: (Learnset & {learnset: NonNullable<Learnset['learnset']>})[] = [];
		const alreadyChecked: {[k: string]: boolean} = {};

		while (species?.name && !alreadyChecked[species.id]) {
			alreadyChecked[species.id] = true;
			const learnset = this.getLearnsetData(species.id);
			if (learnset.learnset) {
				out.push(learnset as any);
				species = this.learnsetParent(species);
				continue;
			}

			// no learnset
			if ((species.changesFrom || species.baseSpecies) !== species.name) {
				// forme without its own learnset
				species = this.get(species.changesFrom || species.baseSpecies);
				// warning: formes with their own learnset, like Wormadam, should NOT
				// inherit from their base forme unless they're freely switchable
				continue;
			}
			if (species.isNonstandard) {
				// It's normal for a nonstandard species not to have learnset data

				// Formats should replace the `Obtainable Moves` rule if they want to
				// allow pokemon without learnsets.
				return out;
			}
			if (species.prevo && this.getLearnsetData(toID(species.prevo)).learnset) {
				species = this.get(toID(species.prevo));
				continue;
			}

			// should never happen
			throw new Error(`Species with no learnset data: ${species.id}`);
		}

		return out;
	}

	learnsetParent(species: Species) {
		// Own Tempo Rockruff and Battle Bond Greninja are special event formes
		// that are visually indistinguishable from their base forme but have
		// different learnsets. To prevent a leak, we make them show up as their
		// base forme, but hardcode their learnsets into Rockruff-Dusk and
		// Greninja-Ash
		if (['Gastrodon', 'Pumpkaboo', 'Sinistea', 'Tatsugiri'].includes(species.baseSpecies) && species.forme) {
			return this.get(species.baseSpecies);
		} else if (species.name === 'Lycanroc-Dusk') {
			return this.get('Rockruff-Dusk');
		} else if (species.name === 'Greninja-Bond') {
			return null;
		} else if (species.prevo) {
			// there used to be a check for Hidden Ability here, but apparently it's unnecessary
			// Shed Skin Pupitar can definitely evolve into Unnerve Tyranitar
			species = this.get(species.prevo);
			if (species.gen > Math.max(2, this.dex.gen)) return null;
			return species;
		} else if (species.changesFrom && species.baseSpecies !== 'Kyurem') {
			// For Pokemon like Rotom and Necrozma whose movesets are extensions are their base formes
			return this.get(species.changesFrom);
		}
		return null;
	}

	/**
	 * Gets the raw learnset data for the species.
	 *
	 * In practice, if you're trying to figure out what moves a pokemon learns,
	 * you probably want to `getFullLearnset` or `getMovePool` instead.
	 */
	getLearnsetData(id: ID): Learnset {
		let learnsetData = this.learnsetCache.get(id);
		if (learnsetData) return learnsetData;
		if (!this.dex.data.Learnsets.hasOwnProperty(id)) {
			return new Learnset({exists: false}, this.get(id));
		}
		learnsetData = new Learnset(this.dex.data.Learnsets[id], this.get(id));
		this.learnsetCache.set(id, this.dex.deepFreeze(learnsetData));
		return learnsetData;
	}

	getPokemonGoData(id: ID): PokemonGoData {
		return this.dex.data.PokemonGoData[id];
	}

	all(): readonly Species[] {
		if (this.allCache) return this.allCache;
		const species = [];
		for (const id in this.dex.data.Pokedex) {
			species.push(this.getByID(id as ID));
		}
		this.allCache = Object.freeze(species);
		return this.allCache;
	}
}
