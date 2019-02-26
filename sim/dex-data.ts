/**
 * Simulator Battle
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT license
 */

export class Tools {
	/**
	 * Safely converts the passed variable into a string. Unlike '' + str,
	 * String(str), or str.toString(), Dex.getString is guaranteed not to
	 * crash.
	 *
	 * Specifically, the fear with untrusted JSON is an object like:
	 *
	 *     let a = {"toString": "this is not a function"};
	 *     console.log(`a is ${a}`);
	 *
	 * This will crash (because a.toString() is not a function). Instead,
	 * Dex.getString simply returns '' if the passed variable isn't a
	 * string or a number.
	 */
	static getString(str: any): string {
		if (typeof str === 'string' || typeof str === 'number') return '' + str;
		return '';
	}

	/**
	 * Converts anything to an ID. An ID must have only lowercase alphanumeric
	 * characters.
	 * If a string is passed, it will be converted to lowercase and
	 * non-alphanumeric characters will be stripped.
	 * If an object with an ID is passed, its ID will be returned.
	 * Otherwise, an empty string will be returned.
	 *
	 * Dex.getId is generally assigned to the global toId, because of how
	 * commonly it's used.
	 */
	static getId(text: any): string {
		if (text && text.id) {
			text = text.id;
		} else if (text && text.userid) {
			text = text.userid;
		}
		if (typeof text !== 'string' && typeof text !== 'number') return '';
		return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
	}
}
const toId = Tools.getId;
export class BasicEffect {
	/**
	 * ID. This will be a lowercase version of the name with all the
	 * non-alphanumeric characters removed. So, for instance, "Mr. Mime"
	 * becomes "mrmime", and "Basculin-Blue-Striped" becomes
	 * "basculinbluestriped".
	 */
	id: string;
	/**
	 * Name. Currently does not support Unicode letters, so "Flabébé"
	 * is "Flabebe" and "Nidoran♀" is "Nidoran-F".
	 */
	name: string;
	/**
	 * Full name. Prefixes the name with the effect type. For instance,
	 * Leftovers would be "item: Leftovers", confusion the status
	 * condition would be "confusion", etc.
	 */
	fullname: string;
	/**
	 * Effect type.
	 */
	effectType: EffectTypes;
	/**
	 * Does it exist? For historical reasons, when you use an accessor
	 * for an effect that doesn't exist, you get a dummy effect that
	 * doesn't do anything, and this field set to false.
	 * @type {boolean}
	 */
	exists = true;
	/**
	 * Dex number? For a Pokemon, this is the National Dex number. For
	 * other effects, this is often an internal ID (e.g. a move
	 * number). Not all effects have numbers, this will be 0 if it
	 * doesn't. Nonstandard effects (e.g. CAP effects) will have
	 * negative numbers.
	 */
	num: number;
	/**
	 * The generation of Pokemon game this was INTRODUCED (NOT
	 * necessarily the current gen being simulated.) Not all effects
	 * track generation; this will be 0 if not known.
	 */
	gen: number;
	/**
	 * Is this item/move/ability/pokemon unreleased? True if there's
	 * no known way to get access to it without cheating.
	 */
	isUnreleased: boolean;
	/**
	 * A shortened form of the description of this effect. Not all effects have this
	 */
	shortDesc: string;
	/**
	 * The full description for this effect
	 */
	desc: string;
	/**
	 * Is this item/move/ability/pokemon nonstandard? True for effects
	 * that have no use in standard formats: made-up pokemon (CAP),
	 * glitches (Missingno etc), and Pokestar pokemon.
	 */
	isNonstandard: boolean;
	/**
	 * The duration of the effect.
	 */
	duration?: number;
	/**
	 * Whether or not the effect is ignored by Baton Pass.
	 */
	noCopy: boolean;
	/**
	 * Whether or not the effect affects fainted Pokemon.
	 */
	affectsFainted: boolean;
	/**
	 * The status that the effect may cause.
	 */
	status?: string;
	/**
	 * The weather that the effect may cause.
	 */
	weather?: undefined;
	/**
	 * HP that the effect may drain.
	 */
	drain?: number[];
	flags: AnyObject;
	sourceEffect: string;

	constructor(data: AnyObject, moreData: AnyObject | null = null, moreData2: AnyObject | null = null) {
		this.id = '';
		this.name = '';
		this.fullname = '';
		this.effectType = 'Effect';
		this.exists = true;
		this.num = 0;
		this.gen = 0;
		this.isUnreleased = false;
		this.shortDesc = '';
		this.desc = '';
		this.isNonstandard = false;
		this.duration = this.duration;
		// @ts-ignore
		this.noCopy = !!this.noCopy;
		// @ts-ignore
		this.affectsFainted = !!this.affectsFainted;
		this.status = this.status || undefined;
		this.weather = this.weather || undefined;
		this.drain = this.drain || undefined;
		// @ts-ignore
		this.flags = this.flags || {};
		// @ts-ignore
		this.sourceEffect = this.sourceEffect || '';

		Object.assign(this, data);
		if (moreData) Object.assign(this, moreData);
		if (moreData2) Object.assign(this, moreData2);
		this.name = Tools.getString(this.name).trim();
		this.fullname = Tools.getString(this.fullname) || this.name;
		if (!this.id) this.id = toId(this.name); // Hidden Power hack
		// @ts-ignore
		this.effectType = Tools.getString(this.effectType) || "Effect";
		this.exists = !!(this.exists && this.id);
	}
	toString() {
		return this.name;
	}
}

/**
 * A RuleTable keeps track of the rules that a format has. The key can be:
 * - '[ruleid]' the ID of a rule in effect
 * - '-[thing]' or '-[category]:[thing]' ban a thing
 * - '+[thing]' or '+[category]:[thing]' allow a thing (override a ban)
 * [category] is one of: item, move, ability, species, basespecies
 */
export class RuleTable extends Map {
	/** rule, source, limit, bans */
	complexBans: [string, string, number, string[]][];
	/** rule, source, limit, bans */
	complexTeamBans: [string, string, number, string[]][];
	// tslint:disable-next-line:ban-types
	checkLearnset: [Function, string] | null;

	constructor() {
		super();
		this.complexBans = [];
		this.complexTeamBans = [];
		this.checkLearnset = null;
	}

	check(thing: string, setHas: {[id: string]: true} | null = null): string {
		if (setHas) setHas[thing] = true;
		return this.getReason('-' + thing);
	}

	getReason(key: string): string {
		const source = this.get(key);
		if (source === undefined) return '';
		return source ? `banned by ${source}` : `banned`;
	}

	getComplexBanIndex(complexBans: [string, string, number, string[]][], rule: string): number {
		let ruleId = toId(rule);
		let complexBanIndex = -1;
		for (let i = 0; i < complexBans.length; i++) {
			if (toId(complexBans[i][0]) === ruleId) {
				complexBanIndex = i;
				break;
			}
		}
		return complexBanIndex;
	}

	addComplexBan(rule: string, source: string, limit: number, bans: string[]) {
		let complexBanIndex = this.getComplexBanIndex(this.complexBans, rule);
		if (complexBanIndex !== -1) {
			if (this.complexBans[complexBanIndex][2] === Infinity) return;
			this.complexBans[complexBanIndex] = [rule, source, limit, bans];
		} else {
			this.complexBans.push([rule, source, limit, bans]);
		}
	}

	addComplexTeamBan(rule: string, source: string, limit: number, bans: string[]) {
		let complexBanTeamIndex = this.getComplexBanIndex(this.complexTeamBans, rule);
		if (complexBanTeamIndex !== -1) {
			if (this.complexTeamBans[complexBanTeamIndex][2] === Infinity) return;
			this.complexTeamBans[complexBanTeamIndex] = [rule, source, limit, bans];
		} else {
			this.complexTeamBans.push([rule, source, limit, bans]);
		}
	}
}

export class Format extends BasicEffect {
	mod: string;
	/**
	 * Name of the team generator algorithm, if this format uses
	 * random/fixed teams. null if players can bring teams.
	 */
	team?: string;
	effectType: 'Format' | 'Ruleset' | 'Rule' | 'ValidatorRule';
	debug: boolean;
	/**
	 * Whether or not a format will update ladder points if searched
	 * for using the "Battle!" button.
	 * (Challenge and tournament games will never update ladder points.)
	 * (Defaults to `true`.)
	 */
	rated: boolean;
	/**
	 * Game type.
	 */
	gameType: GameType;
	/**
	 * List of rule names.
	 */
	ruleset: string[];
	/**
	 * Base list of rule names as specified in "./config/formats.js".
	 * Used in a custom format to correctly display the altered ruleset.
	 */
	baseRuleset: string[];
	/**
	 * List of banned effects.
	 */
	banlist: string[];
	/**
	 * List of inherited banned effects to override.
	 */
	unbanlist: string[];
	/**
	 * List of ruleset and banlist changes in a custom format.
	 */
	customRules: string[] | null;
	/**
	 * Table of rule names and banned effects.
	 */
	ruleTable: RuleTable | null;
	/**
	 * The number of Pokemon players can bring to battle and
	 * the number that can actually be used.
	 */
	teamLength?: {battle?: number, validate?: [number, number]};
	/**
	 * An optional function that runs at the start of a battle.
	 */
	onBegin?: (this: Battle) => void;
	/**
	 * If no team is selected, this format can generate a random team
	 * for the player.
	 */
	canUseRandomTeam: boolean;
	/**
	 * Pokemon must be obtained from Gen 6 or later.
	 */
	requirePentagon: boolean;
	/**
	 * Pokemon must be obtained from Gen 7 or later.
	 */
	requirePlus: boolean;
	/**
	 * Maximum possible level pokemon you can bring. Note that this is
	 * still 100 in VGC, because you can bring level 100 pokemon,
	 * they'll just be set to level 50. Can be above 100 in special
	 * formats.
	 */
	maxLevel: number;
	/**
	 * Default level of a pokemon without level specified. Mainly
	 * relevant to Custom Game where the default level is still 100
	 * even though higher level pokemon can be brought.
	 */
	defaultLevel: number;
	/**
	 * Forces all pokemon brought in to this level. Certain Game Freak
	 * formats will change level 1 and level 100 pokemon to level 50,
	 * which is what this does.
	 *
	 * You usually want maxForcedLevel instead, which will bring level
	 * 100 pokemon down, but not level 1 pokemon up.
	 */
	forcedLevel?: number;
	/**
	 * Forces all pokemon above this level down to this level. This
	 * will allow e.g. level 50 Hydreigon in Gen 5, which is not
	 * normally legal because Hydreigon doesn't evolve until level
	 * 64.
	 */
	maxForcedLevel?: number;
	noLog: boolean;

	constructor(data: AnyObject, moreData: AnyObject | null = null, moreData2: AnyObject | null = null) {
		super(data, moreData, moreData2);
		// @ts-ignore
		this.mod = Tools.getString(this.mod) || 'gen7';
		// @ts-ignore
		this.effectType = Tools.getString(this.effectType) || 'Format';
		// @ts-ignore
		this.debug = !!this.debug;
		// @ts-ignore
		this.rated = (this.rated !== false);
		// @ts-ignore
		this.gameType = this.gameType || 'singles';
		// @ts-ignore
		this.ruleset = this.ruleset || [];
		// @ts-ignore
		this.baseRuleset = this.baseRuleset || [];
		// @ts-ignore
		this.banlist = this.banlist || [];
		// @ts-ignore
		this.unbanlist = this.unbanlist || [];
		// @ts-ignore
		this.customRules = this.customRules || null;
		this.ruleTable = null;
		this.teamLength = this.teamLength || undefined;
		this.onBegin = this.onBegin || undefined;
		// @ts-ignore
		this.canUseRandomTeam = !!this.canUseRandomTeam;
		// @ts-ignore
		this.requirePentagon = !!this.requirePentagon;
		// @ts-ignore
		this.requirePlus = !!this.requirePlus;
		// @ts-ignore
		this.maxLevel = this.maxLevel || 100;
		// @ts-ignore
		this.defaultLevel = this.defaultLevel || this.maxLevel;
		this.forcedLevel = this.forcedLevel || undefined;
		this.maxForcedLevel = this.maxForcedLevel || undefined;
		// @ts-ignore
		this.noLog = !!this.noLog;
	}
}

export class PureEffect extends BasicEffect {
	effectType: 'Effect' | 'Weather' | 'Status';

	constructor(data: AnyObject, moreData: AnyObject | null = null) {
		super(data, moreData);
		// @ts-ignore
		this.effectType = (['Weather', 'Status'].includes(this.effectType) ? this.effectType : 'Effect');
	}
}

export class Item extends BasicEffect {
	effectType: 'Item';
	/**
	 * A Move-like object depicting what happens when Fling is used on
	 * this item.
	 */
	fling?: FlingData;
	/**
	 * If this is a Drive: The type it turns Techno Blast into.
	 * undefined, if not a Drive.
	 */
	onDrive?: string;
	/**
	 * If this is a Memory: The type it turns Multi-Attack into.
	 * undefined, if not a Memory.
	 */
	onMemory?: string;
	/**
	 * If this is a mega stone: The name (e.g. Charizard-Mega-X) of the
	 * forme this allows transformation into.
	 * undefined, if not a mega stone.
	 */
	megaStone?: string;
	/**
	 * If this is a mega stone: The name (e.g. Charizard) of the
	 * forme this allows transformation from.
	 * undefined, if not a mega stone.
	 */
	megaEvolves?: string;
	/**
	 * If this is a Z crystal: true if the Z Crystal is generic
	 * (e.g. Firium Z). If species-specific, the name
	 * (e.g. Inferno Overdrive) of the Z Move this crystal allows
	 * the use of.
	 * undefined, if not a Z crystal.
	 */
	zMove?: true | string;
	/**
	 * If this is a generic Z crystal: The type (e.g. Fire) of the
	 * Z Move this crystal allows the use of (e.g. Fire)
	 * undefined, if not a generic Z crystal
	 */
	zMoveType?: string;
	/**
	 * If this is a species-specific Z crystal: The name
	 * (e.g. Play Rough) of the move this crystal requires its
	 * holder to know to use its Z move.
	 * undefined, if not a species-specific Z crystal
	 */
	zMoveFrom?: string;
	/**
	 * If this is a species-specific Z crystal: An array of the
	 * species of Pokemon that can use this crystal's Z move.
	 * Note that these are the full names, e.g. 'Mimikyu-Busted'
	 * undefined, if not a species-specific Z crystal
	 */
	zMoveUser?: string[];
	/**
	 * Is this item a Berry?
	 */
	isBerry: boolean;
	/**
	 * Whether or not this item ignores the Klutz ability.
	 */
	ignoreKlutz: boolean;
	/**
	 * The type the holder will change into if it is an Arceus.
	 */
	onPlate?: string;
	/**
	 * Is this item a Gem?
	 */
	isGem: boolean;

	constructor(data: AnyObject, moreData: AnyObject | null = null) {
		super(data, moreData);
		this.fullname = 'item: ' + this.name;
		this.effectType = 'Item';
		this.fling = this.fling || undefined;
		this.onDrive = this.onDrive || undefined;
		this.onMemory = this.onMemory || undefined;
		this.megaStone = this.megaStone || undefined;
		this.megaEvolves = this.megaEvolves || undefined;
		this.zMove = this.zMove || undefined;
		this.zMoveType = this.zMoveType || undefined;
		this.zMoveFrom = this.zMoveFrom || undefined;
		this.zMoveUser = this.zMoveUser || undefined;
		// @ts-ignore
		this.isBerry = !!this.isBerry;
		// @ts-ignore
		this.ignoreKlutz = !!this.ignoreKlutz;
		this.onPlate = this.onPlate || undefined;
		// @ts-ignore
		this.isGem = !!this.isGem;

		if (!this.gen) {
			if (this.num >= 689) {
				this.gen = 7;
			} else if (this.num >= 577) {
				this.gen = 6;
			} else if (this.num >= 537) {
				this.gen = 5;
			} else if (this.num >= 377) {
				this.gen = 4;
			} else {
				this.gen = 3;
			}
			// Due to difference in gen 2 item numbering, gen 2 items must be
			// specified manually
		}

		if (this.isBerry) this.fling = {basePower: 10};
		if (this.id.endsWith('plate')) this.fling = {basePower: 90};
		if (this.onDrive) this.fling = {basePower: 70};
		if (this.megaStone) this.fling = {basePower: 80};
		if (this.onMemory) this.fling = {basePower: 50};
	}
}

export class Ability extends BasicEffect {
	effectType: 'Ability';
	/** Represents how useful or detrimental this ability is. */
	// @ts-ignore
	rating: number;
	/** Whether or not this ability suppresses weather. */
	suppressWeather: boolean;

	constructor(data: AnyObject, moreData: AnyObject | null = null) {
		super(data, moreData);
		this.fullname = 'ability: ' + this.name;
		this.effectType = 'Ability';
		// @ts-ignore
		this.suppressWeather = !!this.suppressWeather;

		if (!this.gen) {
			if (this.num >= 192) {
				this.gen = 7;
			} else if (this.num >= 165) {
				this.gen = 6;
			} else if (this.num >= 124) {
				this.gen = 5;
			} else if (this.num >= 77) {
				this.gen = 4;
			} else if (this.num >= 1) {
				this.gen = 3;
			}
		}
	}
}

export class Template extends BasicEffect {
	effectType: 'Pokemon';
	/**
	 * Species ID. Identical to ID. Note that this is the full ID, e.g.
	 * 'basculinbluestriped'. To get the base species ID, you need to
	 * manually read toId(template.baseSpecies).
	 */
	speciesid: string;
	/**
	 * Species. Identical to name. Note that this is the full name,
	 * e.g. 'Basculin-Blue-Striped'. To get the base species name, see
	 * template.baseSpecies.
	 */
	species: string;
	name: string;
	/**
	 * Base species. Species, but without the forme name.
	 */
	baseSpecies: string;
	/**
	 * Forme name. If the forme exists,
	 * `template.species === template.baseSpecies + '-' + template.forme`
	 */
	forme: string;
	/**
	 * Other forms. List of names of cosmetic forms. These should have
	 * `aliases.js` aliases to this entry, but not have their own
	 * entry in `pokedex.js`.
	 */
	otherForms?: string[];
	/**
	 * Other formes. List of names of formes, appears only on the base
	 * forme. Unlike forms, these have their own entry in `pokedex.js`.
	 */
	otherFormes?: string[];
	/**
	 * Forme letter. One-letter version of the forme name. Usually the
	 * first letter of the forme, but not always - e.g. Rotom-S is
	 * Rotom-Fan because Rotom-F is Rotom-Frost.
	 */
	formeLetter: string;
	/**
	 * Sprite ID. Basically the same as ID, but with a dash between
	 * species and forme.
	 */
	spriteid: string;
	/** Abilities. */
	abilities: TemplateAbility;
	/** Types. */
	// @ts-ignore
	types: string[];
	/** Added type (used in OMs). */
	addedType?: string;
	/** Pre-evolution. '' if nothing evolves into this Pokemon. */
	prevo: string;
	/**
	 * Singles Tier. The Pokemon's location in the Smogon tier system.
	 * Do not use for LC bans.
	 */
	tier: string;
	/**
	 * Doubles Tier. The Pokemon's location in the Smogon doubles tier system.
	 * Do not use for LC bans.
	 */
	doublesTier: string;
	/** Evolutions. Array because many Pokemon have multiple evolutions. */
	evos: string;
	/** Evolution level. falsy if doesn't evolve. */
	evoLevel?: number;
	/** Is NFE? True if this Pokemon can evolve (Mega evolution doesn't count). */
	nfe: boolean;
	/** Egg groups. */
	eggGroups: string[];
	/**
	 * Gender. M = always male, F = always female, N = always
	 * genderless, '' = sometimes male sometimes female.
	 */
	gender: GenderName;
	/** Gender ratio. Should add up to 1 unless genderless. */
	genderRatio: {M: number, F: number};
	/** Required item. Do not use this directly; see requiredItems. */
	requiredItem?: string;
	/**
	 * Required items. Items required to be in this forme, e.g. a mega
	 * stone, or Griseous Orb. Array because Arceus formes can hold
	 * either a Plate or a Z-Crystal.
	 */
	requiredItems?: string[];
	/** Base stats. */
	// @ts-ignore
	baseStats: StatsTable;
	/** Weight (in kg). */
	// @ts-ignore
	weightkg: number;
	/** Height (in m). */
	// @ts-ignore
	heightm: number;
	/** Color. */
	color: string;
	/** Does this Pokemon have an unreleased hidden ability? */
	unreleasedHidden: boolean;
	/**
	 * Is it only possible to get the hidden ability on a male pokemon?
	 * This is mainly relevant to Gen 5.
	 */
	maleOnlyHidden: boolean;
	/** Max HP. Used in the battle engine. */
	maxHP?: number;
	/**
	 * Keeps track of exactly how a pokemon might learn a move, in the
	 * form moveid:sources[].
	 */
	learnset?: {[moveid: string]: MoveSource[]};
	/** True if the only way to get this pokemon is from events. */
	eventOnly: boolean;
	/** List of event data for each event. */
	eventPokemon?: EventInfo[] ;
	/** True if a pokemon is mega. */
	isMega?: boolean;
	/** True if a pokemon is a forme that is only accessible in battle. */
	battleOnly?: boolean;

	constructor(data: AnyObject, moreData: AnyObject | null = null, moreData2: AnyObject | null = null, moreData3: AnyObject | null = null) {
		super(data, moreData);
		if (moreData2) Object.assign(this, moreData2);
		if (moreData3) Object.assign(this, moreData3);
		// @ts-ignore
		this.fullname = 'pokemon: ' + this.name;
		this.effectType = 'Pokemon';
		// @ts-ignore
		this.speciesid = this.speciesid || this.id;
		// @ts-ignore
		this.species = this.species || this.name;
		this.name = this.species;
		// @ts-ignore
		this.baseSpecies = this.baseSpecies || this.name;
		// @ts-ignore
		this.forme = this.forme || '';
		this.otherForms = this.otherForms || undefined;
		this.otherFormes = this.otherFormes || undefined;
		// @ts-ignore
		this.formeLetter = this.formeLetter || '';
		// @ts-ignore
		this.spriteid = this.spriteid || (toId(this.baseSpecies) + (this.baseSpecies !== this.name ? '-' + toId(this.forme) : ''));
		// @ts-ignore
		this.abilities = this.abilities || {0: ""};
		this.addedType = this.addedType || undefined;
		// @ts-ignore
		this.prevo = this.prevo || '';
		// @ts-ignore
		this.tier = this.tier || '';
		// @ts-ignore
		this.doublesTier = this.doublesTier || '';
		// @ts-ignore
		this.evos = this.evos || [];
		this.evoLevel = this.evoLevel || undefined;
		this.nfe = !!this.evos.length;
		// @ts-ignore
		this.eggGroups = this.eggGroups || [];
		// @ts-ignore
		this.gender = this.gender || '';
		// @ts-ignore
		this.genderRatio = this.genderRatio || (this.gender === 'M' ? {M: 1, F: 0} :
			this.gender === 'F' ? {M: 0, F: 1} :
				this.gender === 'N' ? {M: 0, F: 0} :
					{M: 0.5, F: 0.5});
		this.requiredItem = this.requiredItem || undefined;
		this.requiredItems = this.requiredItems || (this.requiredItem ? [this.requiredItem] : undefined);
		// @ts-ignore
		this.color = this.color || '';
		// @ts-ignore
		this.unreleasedHidden = !!this.unreleasedHidden;
		// @ts-ignore
		this.maleOnlyHidden = !!this.maleOnlyHidden;
		this.maxHP = this.maxHP || undefined;
		this.learnset = this.learnset || undefined;
		// @ts-ignore
		this.eventOnly = !!this.eventOnly;
		this.eventPokemon = this.eventPokemon || undefined;
		this.isMega = !!(this.forme && ['Mega', 'Mega-X', 'Mega-Y'].includes(this.forme)) || undefined;
		this.battleOnly = !!this.battleOnly || !!this.isMega || undefined;

		if (!this.gen && this.num >= 1) {
			if (this.num >= 722 || this.forme.startsWith('Alola')) {
				this.gen = 7;
			} else if (this.forme === 'Primal') {
				this.gen = 6;
				// @ts-ignore
				this.isPrimal = true;
				this.battleOnly = true;
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

/** Possible move flags. */
interface MoveFlags {
	authentic?: 1; // Ignores a target's substitute.
	bite?: 1; // Power is multiplied by 1.5 when used by a Pokemon with the Ability Strong Jaw.
	bullet?: 1; // Has no effect on Pokemon with the Ability Bulletproof.
	charge?: 1; // The user is unable to make a move between turns.
	contact?: 1; // Makes contact.
	dance?: 1; // When used by a Pokemon, other Pokemon with the Ability Dancer can attempt to execute the same move.
	defrost?: 1; // Thaws the user if executed successfully while the user is frozen.
	distance?: 1; // Can target a Pokemon positioned anywhere in a Triple Battle.
	gravity?: 1; // Prevented from being executed or selected during Gravity's effect.
	heal?: 1; // Prevented from being executed or selected during Heal Block's effect.
	mirror?: 1; // Can be copied by Mirror Move.
	mystery?: 1; // Unknown effect.
	nonsky?: 1; // Prevented from being executed or selected in a Sky Battle.
	powder?: 1; // Has no effect on Grass-type Pokemon, Pokemon with the Ability Overcoat, and Pokemon holding Safety Goggles.
	protect?: 1; // Blocked by Detect, Protect, Spiky Shield, and if not a Status move, King's Shield.
	pulse?: 1; // Power is multiplied by 1.5 when used by a Pokemon with the Ability Mega Launcher.
	punch?: 1; // Power is multiplied by 1.2 when used by a Pokemon with the Ability Iron Fist.
	recharge?: 1; // If this move is successful, the user must recharge on the following turn and cannot make a move.
	reflectable?: 1; // Bounced back to the original user by Magic Coat or the Ability Magic Bounce.
	snatch?: 1; // Can be stolen from the original user and instead used by another Pokemon using Snatch.
	sound?: 1; // Has no effect on Pokemon with the Ability Soundproof.
}

export class Move extends BasicEffect {
	effectType: 'Move';
	/** Move type. */
	type: string;
	/** Move target. */
	target: string;
	/** Move base power. */
	// @ts-ignore
	basePower: number;
	/** Move base accuracy. True denotes a move that always hits. */
	// @ts-ignore
	accuracy: true | number;
	/** Critical hit ratio. Defaults to 1. */
	critRatio: number;
	/** Will this move always or never be a critical hit? */
	willCrit?: boolean;
	/** Is this move a critical hit? */
	crit?: boolean;
	/** Can this move OHKO foes? */
	ohko?: boolean | string;
	/**
	 * Base move type. This is the move type as specified by the games,
	 * tracked because it often differs from the real move type.
	 */
	baseMoveType: string;
	/**
	 * Secondary effect. You usually don't want to access this
	 * directly; but through the secondaries array.
	 */
	secondary: SecondaryEffect | null;
	/**
	 * Secondary effects. An array because there can be more than one
	 * (for instance, Fire Fang has both a burn and a flinch
	 * secondary).
	 */
	secondaries: SecondaryEffect[] | null;
	/**
	 * Move priority. Higher priorities go before lower priorities,
	 * trumping the Speed stat.
	 */
	priority: number;
	/** Move category. */
	// @ts-ignore
	category: 'Physical' | 'Special' | 'Status';
	/**
	 * Category that changes which defense to use when calculating
	 * move damage.
	 */
	defensiveCategory?: 'Physical' | 'Special' | 'Status';
	/** Whether or not this move uses the target's boosts. */
	useTargetOffensive: boolean;
	/** Whether or not this move uses the user's boosts. */
	useSourceDefensive: boolean;
	/** Whether or not this move ignores negative attack boosts. */
	ignoreNegativeOffensive: boolean;
	/** Whether or not this move ignores positive defense boosts. */
	ignorePositiveDefensive: boolean;
	/** Whether or not this move ignores attack boosts. */
	ignoreOffensive: boolean;
	/** Whether or not this move ignores defense boosts. */
	ignoreDefensive: boolean;
	/**
	 * Whether or not this move ignores type immunities. Defaults to
	 * true for Status moves and false for Physical/Special moves.
	 */
	readonly ignoreImmunity: AnyObject | boolean;
	/** Base move PP. */
	// @ts-ignore
	pp: number;
	/** Whether or not this move can receive PP boosts. */
	noPPBoosts: boolean;
	/** Is this move a Z-Move? */
	isZ: boolean | string;
	readonly flags: MoveFlags;
	/** Whether or not the user must switch after using this move. */
	selfSwitch?: string | true;
	/** Move target only used by Pressure. */
	pressureTarget: string;
	/** Move target used if the user is not a Ghost type (for Curse). */
	nonGhostTarget: string;
	/** Whether or not the move ignores abilities. */
	ignoreAbility: boolean;
	/**
	 * Move damage against the current target
	 * false = move will always fail with "But it failed!"
	 * null = move will always silently fail
	 * undefined = move does not deal fixed damage
	 */
	// @ts-ignore
	damage: number | 'level' | false | null;
	/** Whether or not this move hit multiple targets. */
	spreadHit: boolean;
	/** Modifier that affects damage when multiple targets are hit. */
	spreadModifier?: number;
	/**  Modifier that affects damage when this move is a critical hit. */
	critModifier?: number;
	/** Damage modifier based on the user's types. */
	typeMod: number;
	/** Forces the move to get STAB even if the type doesn't match. */
	forceSTAB: boolean;
	/** True if it can't be copied with Sketch. */
	noSketch: boolean;
	/** STAB multiplier (can be modified by other effects) (default 1.5). */
	stab?: number;

	constructor(data: AnyObject, moreData: AnyObject | null = null) {
		super(data, moreData);
		this.fullname = 'move: ' + this.name;
		this.effectType = 'Move';
		// @ts-ignore
		this.type = Tools.getString(this.type);
		// @ts-ignore
		this.target = Tools.getString(this.target);
		// @ts-ignore
		this.critRatio = Number(this.critRatio) || 1;
		// @ts-ignore
		this.baseMoveType = Tools.getString(this.baseMoveType) || this.type;
		// @ts-ignore
		this.secondary = this.secondary || null;
		// @ts-ignore
		this.secondaries = this.secondaries || (this.secondary && [this.secondary]) || null;
		// @ts-ignore
		this.priority = Number(this.priority) || 0;
		this.defensiveCategory = this.defensiveCategory || undefined;
		// @ts-ignore
		this.useTargetOffensive = !!this.useTargetOffensive;
		// @ts-ignore
		this.useSourceDefensive = !!this.useSourceDefensive;
		// @ts-ignore
		this.ignoreNegativeOffensive = !!this.ignoreNegativeOffensive;
		// @ts-ignore
		this.ignorePositiveDefensive = !!this.ignorePositiveDefensive;
		// @ts-ignore
		this.ignoreOffensive = !!this.ignoreOffensive;
		// @ts-ignore
		this.ignoreDefensive = !!this.ignoreDefensive;
		// @ts-ignore
		this.ignoreImmunity = (this.ignoreImmunity !== undefined ? this.ignoreImmunity : this.category === 'Status');
		// @ts-ignore
		this.noPPBoosts = !!this.noPPBoosts;
		// @ts-ignore
		this.isZ = this.isZ || false;
		// @ts-ignore
		this.flags = this.flags || {};
		this.selfSwitch = this.selfSwitch || undefined;
		// @ts-ignore
		this.pressureTarget = this.pressureTarget || '';
		// @ts-ignore
		this.nonGhostTarget = this.nonGhostTarget || '';
		// @ts-ignore
		this.ignoreAbility = this.ignoreAbility || false;
		// @ts-ignore
		this.spreadHit = this.spreadHit || false;
		// @ts-ignore
		this.typeMod = this.typeMod || 0;
		// @ts-ignore
		this.forceSTAB = !!this.forceSTAB;
		// @ts-ignore
		this.noSketch = !!this.noSketch;
		this.stab = this.stab || undefined;

		if (!this.gen) {
			if (this.num >= 622) {
				this.gen = 7;
			} else if (this.num >= 560) {
				this.gen = 6;
			} else if (this.num >= 468) {
				this.gen = 5;
			} else if (this.num >= 355) {
				this.gen = 4;
			} else if (this.num >= 252) {
				this.gen = 3;
			} else if (this.num >= 166) {
				this.gen = 2;
			} else if (this.num >= 1) {
				this.gen = 1;
			}
		}
	}
}

export class TypeInfo {
	/**
	 * ID. This will be a lowercase version of the name with all the
	 * non-alphanumeric characters removed. e.g. 'flying'
	 */
	id: string;
	/**
	 * Name. e.g. 'Flying'
	 */
	name: string;
	/**
	 * Effect type.
	 */
	effectType: 'Type' | 'EffectType';
	/**
	 * Does it exist? For historical reasons, when you use an accessor
	 * for an effect that doesn't exist, you get a dummy effect that
	 * doesn't do anything, and this field set to false.
	 */
	exists: boolean;
	/**
	 * The generation of Pokemon game this was INTRODUCED (NOT
	 * necessarily the current gen being simulated.) Not all effects
	 * track generation; this will be 0 if not known.
	 */
	gen: number;
	/**
	 * Type chart, attackingTypeName:result, effectid:result
	 * result is: 0 = normal, 1 = weakness, 2 = resistance, 3 = immunity
	 */
	damageTaken: {[attackingTypeNameOrEffectid: string]: number};
	/**
	 * The IVs to get this Type Hidden Power (in gen 3 and later)
	 */
	HPivs: SparseStatsTable;
	/**
	 * The DVs to get this Type Hidden Power (in gen 2)
	 */
	HPdvs: SparseStatsTable;

	constructor(data: AnyObject, moreData: AnyObject | null = null, moreData2: AnyObject | null = null) {
		this.id = '';
		this.name = '';
		this.effectType = 'Type';
		this.exists = true;
		this.gen = 0;
		this.damageTaken = {};
		this.HPivs = {};
		this.HPdvs = {};

		Object.assign(this, data);
		if (moreData) Object.assign(this, moreData);
		if (moreData2) Object.assign(this, moreData2);
		this.name = Tools.getString(this.name).trim();
		this.exists = !!(this.exists && this.id);
	}
	toString() {
		return this.name;
	}
}

// export class PokemonSet {
// 	/**
// 	 * The Pokemon's set's nickname, which is identical to its base
// 	 * species if not specified by the player, e.g. "Minior".
// 	 */
// 	name: string;
// 	/**
// 	 * The Pokemon's species, e.g. "Minior-Red".
// 	 * This should always be converted to an id before use.
// 	 */
// 	species: string;
// 	/**
// 	 * The Pokemon's set's item. This can be an id, e.g. "whiteherb"
// 	 * or a full name, e.g. "White Herb".
// 	 * This should always be converted to an id before use.
// 	 */
// 	item: string;
// 	/**
// 	 * The Pokemon's set's ability. This can be an id, e.g. "shieldsdown"
// 	 * or a full name, e.g. "Shields Down".
// 	 * This should always be converted to an id before use.
// 	 */
// 	ability: string;
// 	/**
// 	 * An array of the Pokemon's set's moves. Each move can be an id,
// 	 * e.g. "shellsmash" or a full name, e.g. "Shell Smash"
// 	 * These should always be converted to ids before use.
// 	 */
// 	moves: string[];
// 	/**
// 	 * The Pokemon's set's nature. This can be an id, e.g. "adamant"
// 	 * or a full name, e.g. "Adamant".
// 	 * This should always be converted to an id before use.
// 	 */
// 	nature: string;
// 	/**
// 	 * The Pokemon's set's gender.
// 	 */
// 	gender: GenderName;
// 	/**
// 	 * The Pokemon's set's effort values, used in stat calculation.
// 	 * These must be between 0 and 255, inclusive.
// 	 */
// 	evs: StatsTable;
// 	/**
// 	 * The Pokemon's individual values, used in stat calculation.
// 	 * These must be between 0 and 31, inclusive.
// 	 * These are also used as DVs, or determinant values, in Gens
// 	 * 1 and 2, which are represented as even numbers from 0 to 30.
// 	 * From Gen 2 and on, IVs/DVs are used to determine Hidden Power's
// 	 * type, although in Gen 7 a Pokemon may be legally altered such
// 	 * that its stats are calculated as if these values were 31 via
// 	 * Bottlecaps. Currently, PS handles this by considering any
// 	 * IV of 31 in Gen 7 to count as either even or odd for the purpose
// 	 * of validating a Hidden Power type, though restrictions on
// 	 * possible IVs for event-only Pokemon are still considered.
// 	 */
// 	ivs: StatsTable;
// 	/**
// 	 * The Pokemon's level. This is usually between 1 and 100, inclusive,
// 	 * but the simulator supports levels up to 9999 for testing purposes.
// 	 */
// 	level: number;
// 	/**
// 	 * Whether the Pokemon is shiny or not. While having no direct
// 	 * competitive effect except in a few OMs, certain Pokemon cannot
// 	 * be legally obtained as shiny, either as a whole or with certain
// 	 * event-only abilities or moves.
// 	 */
// 	shiny?: boolean;
// 	/**
// 	 * The Pokemon's set's happiness value. This is used only for
// 	 * calculating the base power of the moves Return and Frustration.
// 	 * This value must be between 0 and 255, inclusive.
// 	 */
// 	happiness: number;
// 	/**
// 	 * The Pokemon's set's Hidden Power type. This value is intended
// 	 * to be used to manually set a set's HP type in Gen 7 where
// 	 * its IVs do not necessarily reflect the user's intended type.
// 	 * TODO: actually support this in the teambuilder.
// 	 */
// 	hpType?: string;
// 	/**
// 	 * The pokeball this Pokemon is in. Like shininess, this property
// 	 * has no direct competitive effects, but has implications for
// 	 * event legality. For example, any Rayquaza that knows V-Create
// 	 * must be sent out from a Cherish Ball.
// 	 * TODO: actually support this in the validator, switching animations,
// 	 * and the teambuilder.
// 	 */
// 	pokeball?: string;
//
// 	constructor(data: Partial<PokemonSet>) {
// 		this.name = '';
// 		this.species = '';
// 		this.item = '';
// 		this.ability = 'noability';
// 		this.moves = [];
// 		this.nature = '';
// 		this.gender = '';
// 		this.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
// 		this.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
// 		this.level = 100;
// 		this.shiny = undefined;
// 		this.happiness = 255; // :)
// 		this.hpType = undefined;
// 		this.pokeball = undefined;
// 		Object.assign(this, data);
// 	}
// }
