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
		return (typeof str === 'string' || typeof str === 'number') ? '' + str : '';
	}

	/**
	 * Converts anything to an ID. An ID must have only lowercase alphanumeric
	 * characters.
	 *
	 * If a string is passed, it will be converted to lowercase and
	 * non-alphanumeric characters will be stripped.
	 *
	 * If an object with an ID is passed, its ID will be returned.
	 * Otherwise, an empty string will be returned.
	 *
	 * Dex.getId is generally assigned to the global toID, because of how
	 * commonly it's used.
	 */
	static getId(text: any): ID {
		if (text && text.id) {
			text = text.id;
		} else if (text && text.userid) {
			text = text.userid;
		} else if (text && text.roomid) {
			text = text.roomid;
		}
		if (typeof text !== 'string' && typeof text !== 'number') return '';
		return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '') as ID;
	}
}
const toID = Tools.getId;

export class BasicEffect implements EffectData {
	/**
	 * ID. This will be a lowercase version of the name with all the
	 * non-alphanumeric characters removed. So, for instance, "Mr. Mime"
	 * becomes "mrmime", and "Basculin-Blue-Striped" becomes
	 * "basculinbluestriped".
	 */
	id: ID;
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
	/** Effect type. */
	effectType: EffectType;
	/**
	 * Does it exist? For historical reasons, when you use an accessor
	 * for an effect that doesn't exist, you get a dummy effect that
	 * doesn't do anything, and this field set to false.
	 */
	exists: boolean;
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
	isUnreleased: boolean | 'Past';
	/**
	 * A shortened form of the description of this effect.
	 * Not all effects have this.
	 */
	shortDesc: string;
	/** The full description for this effect. */
	desc: string;
	/**
	 * Is this item/move/ability/pokemon nonstandard? Specified for effects
	 * that have no use in standard formats: made-up pokemon (CAP),
	 * glitches (Missingno etc), Pokestar pokemon, etc.
	 */
	isNonstandard: Nonstandard | null;
	/** The duration of the effect.  */
	duration?: number;
	/** Whether or not the effect is ignored by Baton Pass. */
	noCopy: boolean;
	/** Whether or not the effect affects fainted Pokemon. */
	affectsFainted: boolean;
	/** The status that the effect may cause. */
	status?: ID;
	/** The weather that the effect may cause. */
	weather?: ID;
	sourceEffect: string;

	constructor(data: AnyObject, ...moreData: (AnyObject | null)[]) {
		this.exists = true;
		data = combine(this, data, ...moreData);

		this.name = Tools.getString(data.name).trim();
		this.id = data.id as ID || toID(this.name); // Hidden Power hack
		this.fullname = Tools.getString(data.fullname) || this.name;
		this.effectType = Tools.getString(data.effectType) as EffectType || 'Effect';
		this.exists = !!(this.exists && this.id);
		this.num = data.num || 0;
		this.gen = data.gen || 0;
		this.isUnreleased = data.isUnreleased || false;
		this.shortDesc = data.shortDesc || '';
		this.desc = data.desc || '';
		this.isNonstandard = data.isNonstandard || null;
		this.duration = data.duration;
		this.noCopy = !!data.noCopy;
		this.affectsFainted = !!data.affectsFainted;
		this.status = data.status as ID || undefined;
		this.weather = data.weather as ID || undefined;
		this.sourceEffect = data.sourceEffect || '';
	}

	toString() {
		return this.name;
	}
}

/** rule, source, limit, bans */
export type ComplexBan = [string, string, number, string[]];
export type ComplexTeamBan = ComplexBan;

/**
 * A RuleTable keeps track of the rules that a format has. The key can be:
 * - '[ruleid]' the ID of a rule in effect
 * - '-[thing]' or '-[category]:[thing]' ban a thing
 * - '+[thing]' or '+[category]:[thing]' allow a thing (override a ban)
 * [category] is one of: item, move, ability, species, basespecies
 *
 * The value is the name of the parent rule (blank for the active format).
 */
export class RuleTable extends Map<string, string> {
	complexBans: ComplexBan[];
	complexTeamBans: ComplexTeamBan[];
	// tslint:disable-next-line:ban-types
	checkLearnset: [Function, string] | null;
	timer: [Partial<GameTimerSettings>, string] | null;
	minSourceGen: [number, string] | null;

	constructor() {
		super();
		this.complexBans = [];
		this.complexTeamBans = [];
		this.checkLearnset = null;
		this.timer = null;
		this.minSourceGen = null;
	}

	isBanned(thing: string) {
		if (this.has(`+${thing}`)) return false;
		return this.has(`-${thing}`);
	}

	check(thing: string, setHas: {[id: string]: true} | null = null) {
		if (this.has(`+${thing}`)) return '';
		if (setHas) setHas[thing] = true;
		return this.getReason(`-${thing}`);
	}

	getReason(key: string): string | null {
		const source = this.get(key);
		if (source === undefined) return null;
		if (key === '-nonexistent' || key.startsWith('obtainable')) {
			return 'not obtainable';
		}
		return source ? `banned by ${source}` : `banned`;
	}

	getComplexBanIndex(complexBans: ComplexBan[], rule: string): number {
		const ruleId = toID(rule);
		let complexBanIndex = -1;
		for (let i = 0; i < complexBans.length; i++) {
			if (toID(complexBans[i][0]) === ruleId) {
				complexBanIndex = i;
				break;
			}
		}
		return complexBanIndex;
	}

	addComplexBan(rule: string, source: string, limit: number, bans: string[]) {
		const complexBanIndex = this.getComplexBanIndex(this.complexBans, rule);
		if (complexBanIndex !== -1) {
			if (this.complexBans[complexBanIndex][2] === Infinity) return;
			this.complexBans[complexBanIndex] = [rule, source, limit, bans];
		} else {
			this.complexBans.push([rule, source, limit, bans]);
		}
	}

	addComplexTeamBan(rule: string, source: string, limit: number, bans: string[]) {
		const complexBanTeamIndex = this.getComplexBanIndex(this.complexTeamBans, rule);
		if (complexBanTeamIndex !== -1) {
			if (this.complexTeamBans[complexBanTeamIndex][2] === Infinity) return;
			this.complexTeamBans[complexBanTeamIndex] = [rule, source, limit, bans];
		} else {
			this.complexTeamBans.push([rule, source, limit, bans]);
		}
	}
}

type FormatEffectType = 'Format' | 'Ruleset' | 'Rule' | 'ValidatorRule';

export class Format extends BasicEffect implements Readonly<BasicEffect & FormatsData> {
	readonly mod: string;
	/**
	 * Name of the team generator algorithm, if this format uses
	 * random/fixed teams. null if players can bring teams.
	 */
	readonly team?: string;
	readonly effectType: FormatEffectType;
	readonly debug: boolean;
	/**
	 * Whether or not a format will update ladder points if searched
	 * for using the "Battle!" button.
	 * (Challenge and tournament games will never update ladder points.)
	 * (Defaults to `true`.)
	 */
	readonly rated: boolean;
	/** Game type. */
	readonly gameType: GameType;
	/** List of rule names. */
	readonly ruleset: string[];
	/**
	 * Base list of rule names as specified in "./config/formats.js".
	 * Used in a custom format to correctly display the altered ruleset.
	 */
	readonly baseRuleset: string[];
	/** List of banned effects. */
	readonly banlist: string[];
	/** List of inherited banned effects to override. */
	readonly unbanlist: string[];
	/** List of ruleset and banlist changes in a custom format. */
	readonly customRules: string[] | null;
	/** Table of rule names and banned effects. */
	ruleTable: RuleTable | null;
	/**
	 * The number of Pokemon players can bring to battle and
	 * the number that can actually be used.
	 */
	readonly teamLength?: {battle?: number, validate?: [number, number]};
	/** An optional function that runs at the start of a battle. */
	readonly onBegin?: (this: Battle) => void;
	/** Pokemon must be obtained from this generation or later. */
	readonly minSourceGen?: number;
	/**
	 * Maximum possible level pokemon you can bring. Note that this is
	 * still 100 in VGC, because you can bring level 100 pokemon,
	 * they'll just be set to level 50. Can be above 100 in special
	 * formats.
	 */
	readonly maxLevel: number;
	/**
	 * Default level of a pokemon without level specified. Mainly
	 * relevant to Custom Game where the default level is still 100
	 * even though higher level pokemon can be brought.
	 */
	readonly defaultLevel: number;
	/**
	 * Forces all pokemon brought in to this level. Certain Game Freak
	 * formats will change level 1 and level 100 pokemon to level 50,
	 * which is what this does.
	 *
	 * You usually want maxForcedLevel instead, which will bring level
	 * 100 pokemon down, but not level 1 pokemon up.
	 */
	readonly forcedLevel?: number;
	/**
	 * Forces all pokemon above this level down to this level. This
	 * will allow e.g. level 50 Hydreigon in Gen 5, which is not
	 * normally legal because Hydreigon doesn't evolve until level
	 * 64.
	 */
	readonly maxForcedLevel?: number;
	readonly noLog: boolean;

	constructor(data: AnyObject, ...moreData: (AnyObject | null)[]) {
		super(data, ...moreData);
		data = this;

		this.mod = Tools.getString(data.mod) || 'gen7';
		this.effectType = Tools.getString(data.effectType) as FormatEffectType || 'Format';
		this.debug = !!data.debug;
		this.rated = (data.rated !== false);
		this.gameType = data.gameType || 'singles';
		this.ruleset = data.ruleset || [];
		this.baseRuleset = data.baseRuleset || [];
		this.banlist = data.banlist || [];
		this.unbanlist = data.unbanlist || [];
		this.customRules = data.customRules || null;
		this.ruleTable = null;
		this.teamLength = data.teamLength || undefined;
		this.onBegin = data.onBegin || undefined;
		this.minSourceGen = data.minSourceGen || undefined;
		this.maxLevel = data.maxLevel || 100;
		this.defaultLevel = data.defaultLevel || this.maxLevel;
		this.forcedLevel = data.forcedLevel || undefined;
		this.maxForcedLevel = data.maxForcedLevel || undefined;
		this.noLog = !!data.noLog;
	}
}

export class PureEffect extends BasicEffect implements Readonly<BasicEffect & PureEffectData> {
	readonly effectType: 'Effect' | 'Weather' | 'Status';

	constructor(data: AnyObject, ...moreData: (AnyObject | null)[]) {
		super(data, ...moreData);
		data = this;
		this.effectType = (['Weather', 'Status'].includes(data.effectType) ? data.effectType : 'Effect');
	}
}

export class Item extends BasicEffect implements Readonly<BasicEffect & ItemData> {
	readonly effectType: 'Item';
	/**
	 * A Move-like object depicting what happens when Fling is used on
	 * this item.
	 */
	readonly fling?: FlingData;
	/**
	 * If this is a Drive: The type it turns Techno Blast into.
	 * undefined, if not a Drive.
	 */
	readonly onDrive?: string;
	/**
	 * If this is a Memory: The type it turns Multi-Attack into.
	 * undefined, if not a Memory.
	 */
	readonly onMemory?: string;
	/**
	 * If this is a mega stone: The name (e.g. Charizard-Mega-X) of the
	 * forme this allows transformation into.
	 * undefined, if not a mega stone.
	 */
	readonly megaStone?: string;
	/**
	 * If this is a mega stone: The name (e.g. Charizard) of the
	 * forme this allows transformation from.
	 * undefined, if not a mega stone.
	 */
	readonly megaEvolves?: string;
	/**
	 * If this is a Z crystal: true if the Z Crystal is generic
	 * (e.g. Firium Z). If species-specific, the name
	 * (e.g. Inferno Overdrive) of the Z Move this crystal allows
	 * the use of.
	 * undefined, if not a Z crystal.
	 */
	readonly zMove?: true | string;
	/**
	 * If this is a generic Z crystal: The type (e.g. Fire) of the
	 * Z Move this crystal allows the use of (e.g. Fire)
	 * undefined, if not a generic Z crystal
	 */
	readonly zMoveType?: string;
	/**
	 * If this is a species-specific Z crystal: The name
	 * (e.g. Play Rough) of the move this crystal requires its
	 * holder to know to use its Z move.
	 * undefined, if not a species-specific Z crystal
	 */
	readonly zMoveFrom?: string;
	/**
	 * If this is a species-specific Z crystal: An array of the
	 * species of Pokemon that can use this crystal's Z move.
	 * Note that these are the full names, e.g. 'Mimikyu-Busted'
	 * undefined, if not a species-specific Z crystal
	 */
	readonly itemUser?: string[];
	/** Is this item a Berry? */
	readonly isBerry: boolean;
	/** Whether or not this item ignores the Klutz ability. */
	readonly ignoreKlutz: boolean;
	/** The type the holder will change into if it is an Arceus. */
	readonly onPlate?: string;
	/** Is this item a Gem? */
	readonly isGem: boolean;
	/** Is this item a Pokeball? */
	readonly isPokeball: boolean;

	constructor(data: AnyObject, ...moreData: (AnyObject | null)[]) {
		super(data, ...moreData);
		data = this;

		this.fullname = `item: ${this.name}`;
		this.effectType = 'Item';
		this.fling = data.fling || undefined;
		this.onDrive = data.onDrive || undefined;
		this.onMemory = data.onMemory || undefined;
		this.megaStone = data.megaStone || undefined;
		this.megaEvolves = data.megaEvolves || undefined;
		this.zMove = data.zMove || undefined;
		this.zMoveType = data.zMoveType || undefined;
		this.zMoveFrom = data.zMoveFrom || undefined;
		this.itemUser = data.itemUser || undefined;
		this.isBerry = !!data.isBerry;
		this.ignoreKlutz = !!data.ignoreKlutz;
		this.onPlate = data.onPlate || undefined;
		this.isGem = !!data.isGem;
		this.isPokeball = !!data.isPokeball;

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

export class Ability extends BasicEffect implements Readonly<BasicEffect & AbilityData> {
	readonly effectType: 'Ability';
	/** Represents how useful or detrimental this ability is. */
	readonly rating: number;
	/** Whether or not this ability suppresses weather. */
	readonly suppressWeather: boolean;

	constructor(data: AnyObject, ...moreData: (AnyObject | null)[]) {
		super(data, ...moreData);
		data = this;

		this.fullname = `ability: ${this.name}`;
		this.effectType = 'Ability';
		this.suppressWeather = !!data.suppressWeather;
		this.rating = data.rating!;

		if (!this.gen) {
			if (this.num >= 234) {
				this.gen = 8;
			} else if (this.num >= 192) {
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

export class Template extends BasicEffect implements Readonly<BasicEffect & TemplateData & TemplateFormatsData> {
	readonly effectType: 'Pokemon';
	/**
	 * Species ID. Identical to ID. Note that this is the full ID, e.g.
	 * 'basculinbluestriped'. To get the base species ID, you need to
	 * manually read toID(template.baseSpecies).
	 */
	readonly speciesid: ID;
	/**
	 * Species. Identical to name. Note that this is the full name,
	 * e.g. 'Basculin-Blue-Striped'. To get the base species name, see
	 * template.baseSpecies.
	 */
	readonly species: string;
	readonly name: string;
	/**
	 * Base species. Species, but without the forme name.
	 */
	readonly baseSpecies: string;
	/**
	 * Forme name. If the forme exists,
	 * `template.species === template.baseSpecies + '-' + template.forme`
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
	readonly otherForms?: string[];
	/**
	 * Other formes. List of names of formes, appears only on the base
	 * forme. Unlike forms, these have their own entry in `pokedex.js`.
	 */
	readonly otherFormes?: string[];
	/**
	 * Sprite ID. Basically the same as ID, but with a dash between
	 * species and forme.
	 */
	readonly spriteid: string;
	/** Abilities. */
	readonly abilities: TemplateAbility;
	/** Types. */
	readonly types: string[];
	/** Added type (used in OMs). */
	readonly addedType?: string;
	/** Pre-evolution. '' if nothing evolves into this Pokemon. */
	readonly prevo: ID;
	/** Evolutions. Array because many Pokemon have multiple evolutions. */
	readonly evos: ID[];
	readonly evoType?: 'trade' | 'useItem' | 'levelMove' | 'levelExtra' | 'levelFriendship' | 'levelHold' | 'other';
	readonly evoMove?: string;
	/** Evolution level. falsy if doesn't evolve. */
	readonly evoLevel?: number;
	/** Is NFE? True if this Pokemon can evolve (Mega evolution doesn't count). */
	readonly nfe: boolean;
	/** Egg groups. */
	readonly eggGroups: string[];
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
	/** Name of its Gigantamax move, if a pokemon is gigantamax. */
	readonly isGigantamax?: string;
	/** True if a pokemon is a forme that is only accessible in battle. */
	readonly battleOnly?: boolean;
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
	 * Keeps track of exactly how a pokemon might learn a move, in the
	 * form moveid:sources[].
	 */
	readonly learnset?: {[moveid: string]: MoveSource[]};
	/** Source of learnsets for Pokemon that lack their own */
	readonly inheritsFrom: string | string[];
	/** True if the only way to get this pokemon is from events. */
	readonly eventOnly: boolean;
	/** List of event data for each event. */
	readonly eventPokemon?: EventInfo[];

	/**
	 * Singles Tier. The Pokemon's location in the Smogon tier system.
	 * Do not use for LC bans (usage tier will override LC Uber).
	 */
	readonly tier: string;
	/**
	 * Doubles Tier. The Pokemon's location in the Smogon doubles tier system.
	 * Do not use for LC bans (usage tier will override LC Uber).
	 */
	readonly doublesTier: string;
	readonly randomBattleMoves?: readonly ID[];
	readonly randomDoubleBattleMoves?: readonly ID[];
	readonly exclusiveMoves?: readonly ID[];
	readonly comboMoves?: readonly ID[];
	readonly essentialMove?: ID;

	constructor(data: AnyObject, ...moreData: (AnyObject | null)[]) {
		super(data, ...moreData);
		data = this;

		this.fullname = `pokemon: ${data.name}`;
		this.effectType = 'Pokemon';
		this.speciesid = data.speciesid as ID || this.id;
		this.species = data.species || data.name;
		this.name = data.species;
		this.baseSpecies = data.baseSpecies || this.name;
		this.forme = data.forme || '';
		this.baseForme = data.baseForme || '';
		this.otherForms = data.otherForms || undefined;
		this.otherFormes = data.otherFormes || undefined;
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
		this.nfe = !!this.evos.length;
		this.eggGroups = data.eggGroups || [];
		this.gender = data.gender || '';
		this.genderRatio = data.genderRatio || (this.gender === 'M' ? {M: 1, F: 0} :
			this.gender === 'F' ? {M: 0, F: 1} :
				this.gender === 'N' ? {M: 0, F: 0} :
					{M: 0.5, F: 0.5});
		this.requiredItem = data.requiredItem || undefined;
		this.requiredItems = this.requiredItems || (this.requiredItem ? [this.requiredItem] : undefined);
		this.baseStats = data.baseStats || {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
		this.weightkg = data.weightkg || 0;
		this.weighthg = this.weightkg * 10;
		this.heightm = data.heightm || 0;
		this.color = data.color || '';
		this.unreleasedHidden = data.unreleasedHidden || false;
		this.maleOnlyHidden = !!data.maleOnlyHidden;
		this.maxHP = data.maxHP || undefined;
		this.learnset = data.learnset || undefined;
		this.eventOnly = !!data.eventOnly;
		this.eventPokemon = data.eventPokemon || undefined;
		this.isMega = !!(this.forme && ['Mega', 'Mega-X', 'Mega-Y'].includes(this.forme)) || undefined;
		this.isGigantamax = data.isGigantamax || undefined;
		this.battleOnly = !!data.battleOnly || !!this.isMega || !!this.isGigantamax || undefined;
		this.inheritsFrom = data.inheritsFrom || undefined;

		if (!this.gen && this.num >= 1) {
			if (this.num >= 810 || ['Gmax', 'Galar', 'Galar-Zen'].includes(this.forme)) {
				this.gen = 8;
			} else if (this.num >= 722 || this.forme.startsWith('Alola') || this.forme === 'Starter') {
				this.gen = 7;
			} else if (this.forme === 'Primal') {
				this.gen = 6;
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
	powder?: 1; // Has no effect on Pokemon which are Grass-type, have the Ability Overcoat, or hold Safety Goggles.
	protect?: 1; // Blocked by Detect, Protect, Spiky Shield, and if not a Status move, King's Shield.
	pulse?: 1; // Power is multiplied by 1.5 when used by a Pokemon with the Ability Mega Launcher.
	punch?: 1; // Power is multiplied by 1.2 when used by a Pokemon with the Ability Iron Fist.
	recharge?: 1; // If this move is successful, the user must recharge on the following turn and cannot make a move.
	reflectable?: 1; // Bounced back to the original user by Magic Coat or the Ability Magic Bounce.
	snatch?: 1; // Can be stolen from the original user and instead used by another Pokemon using Snatch.
	sound?: 1; // Has no effect on Pokemon with the Ability Soundproof.
}

type MoveCategory = 'Physical' | 'Special' | 'Status';

export class Move extends BasicEffect implements Readonly<BasicEffect & MoveData> {
	readonly effectType: 'Move';
	/** Move type. */
	readonly type: string;
	/** Move target. */
	readonly target: MoveTarget;
	/** Move base power. */
	readonly basePower: number;
	/** Move base accuracy. True denotes a move that always hits. */
	readonly accuracy: true | number;
	/** Critical hit ratio. Defaults to 1. */
	readonly critRatio: number;
	/** Will this move always or never be a critical hit? */
	readonly willCrit?: boolean;
	/** Can this move OHKO foes? */
	readonly ohko?: boolean | string;
	/**
	 * Base move type. This is the move type as specified by the games,
	 * tracked because it often differs from the real move type.
	 */
	readonly baseMoveType: string;
	/**
	 * Secondary effect. You usually don't want to access this
	 * directly; but through the secondaries array.
	 */
	readonly secondary: SecondaryEffect | null;
	/**
	 * Secondary effects. An array because there can be more than one
	 * (for instance, Fire Fang has both a burn and a flinch
	 * secondary).
	 */
	readonly secondaries: SecondaryEffect[] | null;
	/**
	 * Move priority. Higher priorities go before lower priorities,
	 * trumping the Speed stat.
	 */
	readonly priority: number;
	/** Move category. */
	readonly category: MoveCategory;
	/**
	 * Category that changes which defense to use when calculating
	 * move damage.
	 */
	readonly defensiveCategory?: MoveCategory;
	/** Uses the target's Atk/SpA as the attacking stat, instead of the user's. */
	readonly useTargetOffensive: boolean;
	/** Use the user's Def/SpD as the attacking stat, instead of Atk/SpA. */
	readonly useSourceDefensiveAsOffensive: boolean;
	/** Whether or not this move ignores negative attack boosts. */
	readonly ignoreNegativeOffensive: boolean;
	/** Whether or not this move ignores positive defense boosts. */
	readonly ignorePositiveDefensive: boolean;
	/** Whether or not this move ignores attack boosts. */
	readonly ignoreOffensive: boolean;
	/** Whether or not this move ignores defense boosts. */
	readonly ignoreDefensive: boolean;
	/**
	 * Whether or not this move ignores type immunities. Defaults to
	 * true for Status moves and false for Physical/Special moves.
	 */
	readonly ignoreImmunity: AnyObject | boolean;
	/** Base move PP. */
	readonly pp: number;
	/** Whether or not this move can receive PP boosts. */
	readonly noPPBoosts: boolean;
	/** Is this move a Z-Move? */
	readonly isZ: boolean | string;
	/** How many times does this move hit? */
	readonly multihit?: number | number[];
	/** Max/G-Max move power */
	readonly gmaxPower?: number;
	/** Z-move power */
	readonly zMovePower?: number;
	readonly flags: MoveFlags;
	/** Whether or not the user must switch after using this move. */
	readonly selfSwitch?: ID | boolean;
	/** Move target only used by Pressure. */
	readonly pressureTarget: string;
	/** Move target used if the user is not a Ghost type (for Curse). */
	readonly nonGhostTarget: string;
	/** Whether or not the move ignores abilities. */
	readonly ignoreAbility: boolean;
	/**
	 * Move damage against the current target
	 * false = move will always fail with "But it failed!"
	 * null = move will always silently fail
	 * undefined = move does not deal fixed damage
	 */
	readonly damage: number | 'level' | false | null;
	/** Whether or not this move hit multiple targets. */
	readonly spreadHit: boolean;
	/** Modifier that affects damage when multiple targets are hit. */
	readonly spreadModifier?: number;
	/**  Modifier that affects damage when this move is a critical hit. */
	readonly critModifier?: number;
	/** Forces the move to get STAB even if the type doesn't match. */
	readonly forceSTAB: boolean;
	/** True if it can't be copied with Sketch. */
	readonly noSketch: boolean;
	/** STAB multiplier (can be modified by other effects) (default 1.5). */
	readonly stab?: number;

	readonly volatileStatus?: ID;

	constructor(data: AnyObject, ...moreData: (AnyObject | null)[]) {
		super(data, ...moreData);
		data = this;

		this.fullname = `move: ${this.name}`;
		this.effectType = 'Move';
		this.type = Tools.getString(data.type);
		this.target = data.target;
		this.basePower = Number(data.basePower!);
		this.accuracy = data.accuracy!;
		this.critRatio = Number(data.critRatio) || 1;
		this.baseMoveType = Tools.getString(data.baseMoveType) || this.type;
		this.secondary = data.secondary || null;
		this.secondaries = data.secondaries || (this.secondary && [this.secondary]) || null;
		this.priority = Number(data.priority) || 0;
		this.category = data.category!;
		this.defensiveCategory = data.defensiveCategory || undefined;
		this.useTargetOffensive = !!data.useTargetOffensive;
		this.useSourceDefensiveAsOffensive = !!data.useSourceDefensiveAsOffensive;
		this.ignoreNegativeOffensive = !!data.ignoreNegativeOffensive;
		this.ignorePositiveDefensive = !!data.ignorePositiveDefensive;
		this.ignoreOffensive = !!data.ignoreOffensive;
		this.ignoreDefensive = !!data.ignoreDefensive;
		this.ignoreImmunity = (data.ignoreImmunity !== undefined ? data.ignoreImmunity : this.category === 'Status');
		this.pp = Number(data.pp!);
		this.noPPBoosts = !!data.noPPBoosts;
		this.isZ = data.isZ || false;
		this.flags = data.flags || {};
		this.selfSwitch = (typeof data.selfSwitch === 'string' ? (data.selfSwitch as ID) : data.selfSwitch) || undefined;
		this.pressureTarget = data.pressureTarget || '';
		this.nonGhostTarget = data.nonGhostTarget || '';
		this.ignoreAbility = data.ignoreAbility || false;
		this.damage = data.damage!;
		this.spreadHit = data.spreadHit || false;
		this.forceSTAB = !!data.forceSTAB;
		this.noSketch = !!data.noSketch;
		this.stab = data.stab || undefined;
		this.volatileStatus = typeof data.volatileStatus === 'string' ? (data.volatileStatus as ID) : undefined;

		if (this.category !== 'Status' && !this.gmaxPower) {
			if (!this.basePower) {
				this.gmaxPower = 100;
			} else if (['Fighting', 'Poison'].includes(this.type)) {
				if (this.basePower >= 150) {
					this.gmaxPower = 100;
				} else if (this.basePower >= 110) {
					this.gmaxPower = 95;
				} else if (this.basePower >= 75) {
					this.gmaxPower = 90;
				} else if (this.basePower >= 65) {
					this.gmaxPower = 85;
				} else if (this.basePower >= 55) {
					this.gmaxPower = 80;
				} else if (this.basePower >= 45) {
					this.gmaxPower = 75;
				} else  {
					this.gmaxPower = 70;
				}
			} else {
				if (this.basePower >= 150) {
					this.gmaxPower = 150;
				} else if (this.basePower >= 110) {
					this.gmaxPower = 140;
				} else if (this.basePower >= 75) {
					this.gmaxPower = 130;
				} else if (this.basePower >= 65) {
					this.gmaxPower = 120;
				} else if (this.basePower >= 55) {
					this.gmaxPower = 110;
				} else if (this.basePower >= 45) {
					this.gmaxPower = 100;
				} else  {
					this.gmaxPower = 90;
				}
			}
		}
		if (this.category !== 'Status' && !this.zMovePower) {
			let basePower = this.basePower;
			if (Array.isArray(this.multihit)) basePower *= 3;
			if (!basePower) {
				this.zMovePower = 100;
			} else if (basePower >= 140) {
				this.zMovePower = 200;
			} else if (basePower >= 130) {
				this.zMovePower = 195;
			} else if (basePower >= 120) {
				this.zMovePower = 190;
			} else if (basePower >= 110) {
				this.zMovePower = 185;
			} else if (basePower >= 100) {
				this.zMovePower = 180;
			} else if (basePower >= 90) {
				this.zMovePower = 175;
			} else if (basePower >= 80) {
				this.zMovePower = 160;
			} else if (basePower >= 70) {
				this.zMovePower = 140;
			} else if (basePower >= 60) {
				this.zMovePower = 120;
			} else  {
				this.zMovePower = 100;
			}
		}

		if (!this.gen) {
			if (this.num >= 743) {
				this.gen = 8;
			} else if (this.num >= 622) {
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

type TypeInfoEffectType = 'Type' | 'EffectType';

export class TypeInfo implements Readonly<TypeData> {
	/**
	 * ID. This will be a lowercase version of the name with all the
	 * non-alphanumeric characters removed. e.g. 'flying'
	 */
	readonly id: ID;
	/** Name. e.g. 'Flying' */
	readonly name: string;
	/** Effect type. */
	readonly effectType: TypeInfoEffectType;
	/**
	 * Does it exist? For historical reasons, when you use an accessor
	 * for an effect that doesn't exist, you get a dummy effect that
	 * doesn't do anything, and this field set to false.
	 */
	readonly exists: boolean;
	/**
	 * The generation of Pokemon game this was INTRODUCED (NOT
	 * necessarily the current gen being simulated.) Not all effects
	 * track generation; this will be 0 if not known.
	 */
	readonly gen: number;
	/**
	 * Type chart, attackingTypeName:result, effectid:result
	 * result is: 0 = normal, 1 = weakness, 2 = resistance, 3 = immunity
	 */
	readonly damageTaken: {[attackingTypeNameOrEffectid: string]: number};
	/** The IVs to get this Type Hidden Power (in gen 3 and later) */
	readonly HPivs: SparseStatsTable;
	/** The DVs to get this Type Hidden Power (in gen 2). */
	readonly HPdvs: SparseStatsTable;

	constructor(data: AnyObject, ...moreData: (AnyObject | null)[]) {
		this.exists = true;
		data = combine(this, data, ...moreData);

		this.id = data.id || '';
		this.name = Tools.getString(data.name).trim();
		this.effectType = Tools.getString(data.effectType) as TypeInfoEffectType || 'Type';
		this.exists = !!(this.exists && this.id);
		this.gen = data.gen || 0;
		this.damageTaken = data.damageTaken || {};
		this.HPivs = data.HPivs || {};
		this.HPdvs = data.HPdvs || {};
	}

	toString() {
		return this.name;
	}
}

function combine(obj: AnyObject, ...data: (AnyObject | null)[]): AnyObject {
	for (const d of data) {
		if (d) Object.assign(obj, d);
	}
	return obj;
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
