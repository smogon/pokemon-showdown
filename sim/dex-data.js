/**
 * Simulator Battle
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT license
 */
'use strict';

class Tools {
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
	 *
	 * @param {any} str
	 * @return {string}
	 */
	static getString(str) {
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
	 *
	 * @param {any} text
	 * @return {string}
	 */
	static getId(text) {
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
class Effect {
	/**
	 * @param {AnyObject} data
	 * @param {?AnyObject} [moreData]
	 * @param {?AnyObject} [moreData2]
	 */
	constructor(data, moreData = null, moreData2 = null) {
		/**
		 * ID. This will be a lowercase version of the name with all the
		 * non-alphanumeric characters removed. So, for instance, "Mr. Mime"
		 * becomes "mrmime", and "Basculin-Blue-Striped" becomes
		 * "basculinbluestriped".
		 * @type {string}
		 */
		this.id = '';
		/**
		 * Name. Currently does not support Unicode letters, so "Flabébé"
		 * is "Flabebe" and "Nidoran♀" is "Nidoran-F".
		 * @type {string}
		 */
		this.name = '';
		/**
		 * Full name. Prefixes the name with the effect type. For instance,
		 * Leftovers would be "item: Leftovers", confusion the status
		 * condition would be "confusion", etc.
		 * @type {string}
		 */
		this.fullname = '';
		/**
		 * Effect type.
		 * @type {'Effect' | 'Pokemon' | 'Move' | 'Item' | 'Ability' | 'Format' | 'Ruleset' | 'Weather' | 'Status' | 'Rule' | 'ValidatorRule'}
		 */
		this.effectType = 'Effect';
		/**
		 * Does it exist? For historical reasons, when you use an accessor
		 * for an effect that doesn't exist, you get a dummy effect that
		 * doesn't do anything, and this field set to false.
		 * @type {boolean}
		 */
		this.exists = true;
		/**
		 * Dex number? For a Pokemon, this is the National Dex number. For
		 * other effects, this is often an internal ID (e.g. a move
		 * number). Not all effects have numbers, this will be 0 if it
		 * doesn't. Nonstandard effects (e.g. CAP effects) will have
		 * negative numbers.
		 * @type {number}
		 */
		this.num = 0;
		/**
		 * The generation of Pokemon game this was INTRODUCED (NOT
		 * necessarily the current gen being simulated.) Not all effects
		 * track generation; this will be 0 if not known.
		 * @type {number}
		 */
		this.gen = 0;
		/**
		 * Is this item/move/ability/pokemon unreleased? True if there's
		 * no known way to get access to it without cheating.
		 * @type {boolean}
		 */
		this.isUnreleased = false;
		/**
		 * Is this item/move/ability/pokemon nonstandard? True for effects
		 * that have no use in standard formats: made-up pokemon (CAP),
		 * glitches (Missingno etc), and Pokestar pokemon.
		 * @type {boolean}
		 */
		this.isNonstandard = false;
		/**
		 * The duration of the effect.
		 * @type {?number}
		 */
		this.duration = this.duration;
		/**
		 * Whether or not the effect is ignored by Baton Pass.
		 * @type {boolean}
		 */
		this.noCopy = this.noCopy;
		/**
		 * Whether or not the effect affects fainted Pokemon.
		 * @type {boolean}
		 */
		this.affectsFainted = this.affectsFainted;
		/**
		 * The status that the effect may cause.
		 * @type {string}
		 */
		this.status = this.status;
		/**
		 * The weather that the effect may cause.
		 * @type {string}
		 */
		this.weather = this.weather;

		/**
		 * HP that the effect may drain.
		 * @type {?number[]}
		 */
		this.drain = this.drain;
		/**
		 * @type {?Function}
		 */
		this.onRestart = this.onRestart;
		/**
		 * @type {?Function}
		 */
		this.durationCallback = this.durationCallback;
		/**
		 * @type {AnyObject}
		 */
		this.flags = this.flags || {};

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
 * @augments {Map<string, string>}
 */
// @ts-ignore TypeScript bug
class RuleTable extends Map {
	constructor() {
		super();
		/**
		 * rule, source, limit, bans
		 * @type {[string, string, number, string[]][]}
		 */
		this.complexBans = [];
		/**
		 * rule, source, limit, bans
		 * @type {[string, string, number, string[]][]}
		 */
		this.complexTeamBans = [];
	}
	/**
	 * @param {string} thing
	 * @param {{[id: string]: true}} setHas
	 * @return {string}
	 */
	check(thing, setHas) {
		setHas[thing] = true;
		return this.getReason(this.get('-' + thing));
	}
	/**
	 * @param {string | undefined} source
	 * @return {string}
	 */
	getReason(source) {
		if (source === undefined) return '';
		return source ? `banned by ${source}` : `banned`;
	}
}

class Format extends Effect {
	/**
	 * @param {AnyObject} data
	 * @param {?AnyObject} [moreData]
	 * @param {?AnyObject} [moreData2]
	 */
	constructor(data, moreData = null, moreData2 = null) {
		super(data, moreData, moreData2);
		/** @type {string} */
		this.mod = Tools.getString(this.mod) || 'gen7';
		/**
		 * Name of the team generator algorithm, if this format uses
		 * random/fixed teams. null if players can bring teams.
		 * @type {?string}
		 */
		this.team = this.team;
		/** @type {'Format' | 'Ruleset' | 'Rule' | 'ValidatorRule'} */
		// @ts-ignore
		this.effectType = Tools.getString(this.effectType) || 'Format';
		/**
		 * Whether or not debug battle messages should be shown.
		 * @type {boolean}
		 */
		this.debug = this.debug;
		/**
		 * Whether or not a format is played for ladder points.
		 * @type {boolean}
		 */
		this.rated = this.rated;
		/**
		 * Game type.
		 * @type {'singles' | 'doubles' | 'triples' | 'rotation'}
		 */
		this.gameType = this.gameType || 'singles';
		/**
		 * List of rule names.
		 * @type {string[]}
		 */
		this.ruleset = this.ruleset || [];
		/**
		 * Base list of rule names as specified in "./config/formats.js".
		 * Used in a custom format to correctly display the altered ruleset.
		 * @type {string[]}
		 */
		this.baseRuleset = this.baseRuleset || [];
		/**
		 * List of banned effects.
		 * @type {string[]}
		 */
		this.banlist = this.banlist || [];
		/**
		 * List of inherited banned effects to override.
		 * @type {string[]}
		 */
		this.unbanlist = this.unbanlist || [];
		/**
		 * List of ruleset and banlist changes in a custom format.
		 * @type {?string[]}
		 */
		this.customRules = this.customRules || null;
		/**
		 * Table of rule names and banned effects.
		 * @type {?RuleTable}
		 */
		this.ruleTable = null;
		/**
		 * The number of Pokemon players can bring to battle and
		 * the number that can actually be used.
		 * @type {?{battle: number, validate: number[]}}
		 */
		this.teamLength = this.teamLength;
		/**
		 * An optional function that runs at the start of a battle.
		 * @type {?Function}
		 */
		this.onBegin = this.onBegin;

		/**
		 * If no team is selected, this format can generate a random team
		 * for the player.
		 * @type {boolean}
		 */
		this.canUseRandomTeam = !!this.canUseRandomTeam;
		/**
		 * Pokemon must be obtained from Gen 6 or later.
		 * @type {boolean}
		 */
		this.requirePentagon = !!this.requirePentagon;
		/**
		 * Pokemon must be obtained from Gen 7 or later.
		 * @type {boolean}
		 */
		this.requirePlus = !!this.requirePlus;
		/**
		 * Maximum possible level pokemon you can bring. Note that this is
		 * still 100 in VGC, because you can bring level 100 pokemon,
		 * they'll just be set to level 50. Can be above 100 in special
		 * formats.
		 * @type {number}
		 */
		this.maxLevel = this.maxLevel || 100;
		/**
		 * Default level of a pokemon without level specified. Mainly
		 * relevant to Custom Game where the default level is still 100
		 * even though higher level pokemon can be brought.
		 * @type {number}
		 */
		this.defaultLevel = this.defaultLevel || this.maxLevel;
		/**
		 * Forces all pokemon brought in to this level. Certain Game Freak
		 * formats will change level 1 and level 100 pokemon to level 50,
		 * which is what you want here. You usually want maxForcedLevel
		 * instead.
		 * @type {number?}
		 */
		this.forcedLevel = this.forcedLevel;
		/**
		 * Forces all pokemon above this level down to this level. This
		 * will allow e.g. level 50 Hydreigon in Gen 5, which is not
		 * normally legal because Hydreigon doesn't evolve until level
		 * 64.
		 * @type {number?}
		 */
		this.maxForcedLevel = this.maxForcedLevel;

		/**
		 * @type {((this: Validator, set: PokemonSet, teamHas: AnyObject) => string[] | false)?}
		 */
		this.validateSet = this.validateSet;
		/**
		 * @type {((this: Validator, team: PokemonSet[], removeNicknames: boolean) => string[] | false)?}
		 */
		this.validateTeam = this.validateTeam;
		/**
		 * @type {((this: Validator, set: PokemonSet, format: Format, setHas: AnyObject, teamHas: AnyObject) => string[] | false)?}
		 */
		this.onChangeSet = this.onChangeSet;
		/**
		 * @type {((this: Validator, set: PokemonSet, format: Format, setHas: AnyObject, teamHas: AnyObject) => string[] | false)?}
		 */
		this.onValidateSet = this.onValidateSet;
		/**
		 * @type {((this: Validator, team: PokemonSet[], format: Format, teamHas: AnyObject) => string[] | false)?}
		 */
		this.onValidateTeam = this.onValidateTeam;
	}
}

class PureEffect extends Effect {
	/**
	 * @param {AnyObject} data
	 * @param {?AnyObject} [moreData]
	 */
	constructor(data, moreData = null) {
		super(data, moreData);
		/** @type {'Effect' | 'Weather' | 'Status'} */
		this.effectType = (['Weather', 'Status'].includes(this.effectType) ? this.effectType : 'Effect');
	}
}

class Item extends Effect {
	/**
	 * @param {AnyObject} data
	 * @param {?AnyObject} [moreData]
	 */
	constructor(data, moreData = null) {
		super(data, moreData);
		this.fullname = 'item: ' + this.name;
		/** @type {'Item'} */
		this.effectType = 'Item';
		/**
		 * A Move-like object depicting what happens when Fling is used on
		 * this item.
		 * @type {?AnyObject}
		 */
		this.fling = this.fling;
		/**
		 * If this is a Drive: The type it turns Techno Blast into.
		 * undefined, if not a Drive.
		 * @type {?string}
		 */
		this.onDrive = this.onDrive;
		/**
		 * If this is a Memory: The type it turns Multi-Attack into.
		 * undefined, if not a Memory.
		 * @type {?string}
		 */
		this.onMemory = this.onMemory;
		/**
		 * If this is a mega stone: The name (e.g. Charizard-Mega-X) of the
		 * forme this allows transformation into.
		 * undefined, if not a mega stone.
		 * @type {?string}
		 */
		this.megaStone = this.megaStone;
		/**
		 * If this is a mega stone: The name (e.g. Charizard) of the
		 * forme this allows transformation from.
		 * undefined, if not a mega stone.
		 * @type {?string}
		 */
		this.megaEvolves = this.megaEvolves;
		/**
		 * Is this item a Berry?
		 * @type {boolean}
		 */
		this.isBerry = !!this.isBerry;

		/**
		 * Whether or not this item ignores the Klutz ability.
		 * @type {boolean}
		 */
		this.ignoreKlutz = this.ignoreKlutz;

		/**
		 * The type the holder will change into if it is an Arceus.
		 * @type {string}
		 */
		this.onPlate = this.onPlate;

		/**
		 * Is this item a Gem?
		 * @type {boolean}
		 */
		this.isGem = this.isGem;

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

class Ability extends Effect {
	/**
	 * @param {AnyObject} data
	 * @param {?AnyObject} [moreData]
	 */
	constructor(data, moreData = null) {
		super(data, moreData);
		this.fullname = 'ability: ' + this.name;
		/** @type {'Ability'} */
		this.effectType = 'Ability';

		/**
		 * Whether or not this ability suppresses weather.
		 * @type {boolean}
		 */
		this.suppressWeather = this.suppressWeather;

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

class Template extends Effect {
	/**
	 * @param {AnyObject} data
	 * @param {?AnyObject} [moreData]
	 * @param {?AnyObject} [moreData2]
	 * @param {?AnyObject} [moreData3]
	 */
	constructor(data, moreData = null, moreData2 = null, moreData3 = null) {
		super(data, moreData);
		if (moreData2) Object.assign(this, moreData2);
		if (moreData3) Object.assign(this, moreData3);
		this.fullname = 'pokemon: ' + this.name;
		/** @type {'Pokemon'} */
		this.effectType = 'Pokemon';

		/**
		 * Species ID. Identical to ID. Note that this is the full ID, e.g.
		 * 'basculinbluestriped'. To get the base species ID, you need to
		 * manually read toId(template.baseSpecies).
		 * @type {string}
		 */
		this.speciesid = this.speciesid || this.id;

		/**
		 * Species. Identical to name. Note that this is the full name,
		 * e.g. 'Basculin-Blue-Striped'. To get the base species name, see
		 * template.baseSpecies.
		 * @type {string}
		 */
		this.species = this.species || this.name;
		this.name = this.species;

		/**
		 * Base species. Species, but without the forme name.
		 * @type {string}
		 */
		this.baseSpecies = this.baseSpecies || this.name;

		/**
		 * Forme name. If the forme exists,
		 * `template.species === template.baseSpecies + '-' + template.forme`
		 * @type {string}
		 */
		this.forme = this.forme || '';

		/**
		 * Other forms. List of names of cosmetic forms. These should have
		 * `aliases.js` aliases to this entry, but not have their own
		 * entry in `pokedex.js`.
		 * @type {?string[]}
		 */
		this.otherForms = this.otherForms || null;

		/**
		 * Forme letter. One-letter version of the forme name. Usually the
		 * first letter of the forme, but not always - e.g. Rotom-S is
		 * Rotom-Fan because Rotom-F is Rotom-Frost.
		 * @type {string}
		 */
		this.formeLetter = this.formeLetter || '';

		/**
		 * Sprite ID. Basically the same as ID, but with a dash between
		 * species and forme.
		 * @type {string}
		 */
		this.spriteid = this.spriteid || (toId(this.baseSpecies) + (this.baseSpecies !== this.name ? '-' + toId(this.forme) : ''));

		/**
		 * Abilities
		 * @type {{0: string, 1?: string, H?: string}}
		 */
		this.abilities = this.abilities || {0: ""};

		/**
		 * Types
		 * @type {string[]}
		 */
		this.types = this.types;

		/**
		 * Added type (used in OMs)
		 * @type {?string}
		 */
		this.addedType = this.addedType;

		/**
		 * Pre-evolution. '' if nothing evolves into this Pokemon.
		 * @type {string}
		 */
		this.prevo = this.prevo || '';

		/**
		 * Singles Tier. The Pokemon's location in the Smogon tier system.
		 * Do not use for LC bans.
		 * @type {string}
		 */
		this.tier = this.tier || '';

		/**
		 * Evolutions. Array because many Pokemon have multiple evolutions.
		 * @type {string[]}
		 */
		this.evos = this.evos || [];

		/**
		 * Evolution level. falsy if doesn't evolve
		 * @type {number?}
		 */
		this.evoLevel = this.evoLevel || null;

		/**
		 * Is NFE? True if this Pokemon can evolve (Mega evolution doesn't
		 * count).
		 * @type {boolean}
		 */
		this.nfe = !!this.evos.length;

		/**
		 * Egg groups.
		 * @type {string[]}
		 */
		this.eggGroups = this.eggGroups || [];

		/**
		 * Gender. M = always male, F = always female, N = always
		 * genderless, '' = sometimes male sometimes female.
		 * @type {GenderName}
		 */
		this.gender = this.gender || '';

		/**
		 * Gender ratio. Should add up to 1 unless genderless.
		 * @type {{M: number, F: number}}
		 */
		this.genderRatio = this.genderRatio || (this.gender === 'M' ? {M:1, F:0} :
			this.gender === 'F' ? {M:0, F:1} :
				this.gender === 'N' ? {M:0, F:0} :
					{M:0.5, F:0.5});

		/**
		 * Required item. Do not use this directly; see requiredItems.
		 * @type {string}
		 */
		this.requiredItem = this.requiredItem;

		/**
		 * Required items. Items required to be in this forme, e.g. a mega
		 * stone, or Griseous Orb. Array because Arceus formes can hold
		 * either a Plate or a Z-Crystal.
		 * @type {?string[]}
		 */
		this.requiredItems = this.requiredItems || (this.requiredItem && [this.requiredItem]) || null;

		/**
		 * Base stats
		 * @type {AnyObject}
		 */
		this.baseStats = this.baseStats;

		/**
		 * Weight (in kg)
		 * @type {number}
		 */
		this.weightkg = this.weightkg;

		/**
		 * Height (in m)
		 * @type {number}
		 */
		this.heightm = this.heightm;

		/**
		 * Does this Pokemon have an unreleased hidden ability?
		 * @type {boolean}
		 */
		this.unreleasedHidden = !!this.unreleasedHidden;

		/**
		 * Is it only possible to get the hidden ability on a male pokemon?
		 * This is mainly relevant to Gen 5.
		 * @type {boolean}
		 */
		this.maleOnlyHidden = !!this.maleOnlyHidden;

		/**
		 * Max HP. Used in the battle engine
		 * @type {?number}
		 */
		this.maxHP = this.maxHP;

		/**
		 * Keeps track of exactly how a pokemon might learn a move, in the form moveid:sources[]
		 * @type {?{[moveid: string]: MoveSource[]}}
		 */
		this.learnset = this.learnset;
		/**
		 * True if the only way to get this pokemon is from events.
		 * @type {boolean}
		 */
		this.eventOnly = !!this.eventOnly;
		/**
		 * List of event data for each event.
		 * @type {?EventInfo[]}
		 */
		this.eventPokemon = this.eventPokemon;

		if (!this.gen) {
			if (this.num >= 722 || this.forme === 'Alola') {
				this.gen = 7;
			} else if (this.forme && ['Mega', 'Mega-X', 'Mega-Y'].includes(this.forme)) {
				this.gen = 6;
				this.isMega = true;
				this.battleOnly = true;
			} else if (this.forme === 'Primal') {
				this.gen = 6;
				this.isPrimal = true;
				this.battleOnly = true;
			} else if (this.num >= 650) {
				this.gen = 6;
			} else if (this.num >= 494) {
				this.gen = 5;
			} else if (this.num >= 387) {
				this.gen = 4;
			} else if (this.num >= 252) {
				this.gen = 3;
			} else if (this.num >= 152) {
				this.gen = 2;
			} else if (this.num >= 1) {
				this.gen = 1;
			}
		}
	}
}

/**
 * An object containing possible move flags.
 *
 * @typedef {Object} MoveFlags
 * @property {1} [authentic] - Ignores a target's substitute.
 * @property {1} [bite] - Power is multiplied by 1.5 when used by a Pokemon with the Ability Strong Jaw.
 * @property {1} [bullet] - Has no effect on Pokemon with the Ability Bulletproof.
 * @property {1} [charge] - The user is unable to make a move between turns.
 * @property {1} [contact] - Makes contact.
 * @property {1} [dance] - When used by a Pokemon, other Pokemon with the Ability Dancer can attempt to execute the same move.
 * @property {1} [defrost] - Thaws the user if executed successfully while the user is frozen.
 * @property {1} [distance] - Can target a Pokemon positioned anywhere in a Triple Battle.
 * @property {1} [gravity] - Prevented from being executed or selected during Gravity's effect.
 * @property {1} [heal] - Prevented from being executed or selected during Heal Block's effect.
 * @property {1} [mirror] - Can be copied by Mirror Move.
 * @property {1} [mystery] - Unknown effect.
 * @property {1} [nonsky] - Prevented from being executed or selected in a Sky Battle.
 * @property {1} [powder] - Has no effect on Grass-type Pokemon, Pokemon with the Ability Overcoat, and Pokemon holding Safety Goggles.
 * @property {1} [protect] - Blocked by Detect, Protect, Spiky Shield, and if not a Status move, King's Shield.
 * @property {1} [pulse] - Power is multiplied by 1.5 when used by a Pokemon with the Ability Mega Launcher.
 * @property {1} [punch] - Power is multiplied by 1.2 when used by a Pokemon with the Ability Iron Fist.
 * @property {1} [recharge] - If this move is successful, the user must recharge on the following turn and cannot make a move.
 * @property {1} [reflectable] - Bounced back to the original user by Magic Coat or the Ability Magic Bounce.
 * @property {1} [snatch] - Can be stolen from the original user and instead used by another Pokemon using Snatch.
 * @property {1} [sound] - Has no effect on Pokemon with the Ability Soundproof.
 */
class Move extends Effect {
	/**
	 * @param {AnyObject} data
	 * @param {?AnyObject} [moreData]
	 */
	constructor(data, moreData = null) {
		super(data, moreData);
		this.fullname = 'move: ' + this.name;
		/** @type {'Move'} */
		this.effectType = 'Move';

		/**
		 * Move type.
		 * @type {string}
		 */
		this.type = Tools.getString(this.type);

		/**
		 * Move target.
		 * @type {string}
		 */
		this.target = Tools.getString(this.target);

		/**
		 * Move base power.
		 * @type {number}
		 */
		this.basePower = this.basePower;

		/**
		 * Critical hit ratio. Defaults to 1.
		 * @type {number}
		 */
		this.critRatio = Number(this.critRatio) || 1;

		/**
		 * Will this move always be a critical hit?
		 * @type {boolean}
		 */
		this.willCrit = this.willCrit;

		/**
		 * Is this move a critical hit?
		 * @type {boolean}
		 */
		this.crit = this.crit;

		/**
		 * Can this move OHKO foes?
		 * @type {boolean}
		 */
		this.ohko = this.ohko;

		/**
		 * Base move type. This is the move type as specified by the games,
		 * tracked because it often differs from the real move type.
		 * @type {string}
		 */
		this.baseType = Tools.getString(this.baseType) || this.type;

		/**
		 * Secondary effect. You usually don't want to access this
		 * directly; but through the secondaries array.
		 * @type {?AnyObject}
		 */
		this.secondary = this.secondary;

		/**
		 * Secondary effects. An array because there can be more than one
		 * (for instance, Fire Fang has both a burn and a flinch
		 * secondary).
		 * @type {?AnyObject[]}
		 */
		this.secondaries = this.secondaries || (this.secondary && [this.secondary]);

		/**
		 * Move priority. Higher priorities go before lower priorities,
		 * trumping the Speed stat.
		 * @type {number}
		 */
		this.priority = Number(this.priority) || 0;

		/**
		 * Move category
		 * @type {'Physical' | 'Special' | 'Status'}
		 */
		this.category = this.category;

		/**
		 * Category that changes which defense to use when calculating
		 * move damage.
		 * @type {?'Physical' | 'Special' | 'Status'}
		 */
		this.defensiveCategory = this.defensiveCategory;

		/**
		 * Whether or not this move uses the target's boosts
		 * @type {boolean}
		 */
		this.useTargetOffensive = this.useTargetOffensive;

		/**
		 * Whether or not this move uses the user's boosts
		 * @type {boolean}
		 */
		this.useSourceDefensive = this.useSourceDefensive;

		/**
		 * Whether or not this move ignores negative attack boosts
		 * @type {boolean}
		 */
		this.ignoreNegativeOffensive = this.ignoreNegativeOffensive;

		/**
		 * Whether or not this move ignores positive defense boosts
		 * @type {boolean}
		 */
		this.ignorePositiveDefensive = this.ignorePositiveDefensive;

		/**
		 * Whether or not this move ignores attack boosts
		 * @type {boolean}
		 */
		this.ignoreOffensive = this.ignoreOffensive;

		/**
		 * Whether or not this move ignores defense boosts
		 * @type {boolean}
		 */
		this.ignoreDefensive = this.ignoreDefensive;

		/**
		 * Whether or not this move uses the source's highest raw stat.
		 * @type {boolean}
		 */
		this.useBestSourceOffensive = this.useBestSourceOffensive;

		/**
		 * Whether or not this move ignores type immunities. Defaults to
		 * true for Status moves and false for Physical/Special moves.
		 * @type {AnyObject | boolean}
		 * @readonly
		 */
		this.ignoreImmunity = (this.ignoreImmunity !== undefined ? this.ignoreImmunity : this.category === 'Status');

		/**
		 * Base move PP.
		 * @type {number}
		 */
		this.pp = this.pp;

		/**
		 * Whether or not this move can receive PP boosts.
		 * @type {boolean}
		 */
		this.noPPBoosts = this.noPPBoosts;

		/**
		 * Is this move a Z-Move?
		 * @type {boolean}
		 */
		this.isZ = this.isZ;

		/**
		 * Whether or not this move is a Z-Move that broke protect
		 * (affects damage calculation).
		 * @type {boolean}
		 */
		this.zBrokeProtect = this.zBrokeProtect;

		/**
		 * @type {MoveFlags}
		 * @readonly
		 */
		this.flags = this.flags || {};

		/**
		 * Whether or not the user must switch after using this move.
		 * @type {string | boolean}
		 */
		this.selfSwitch = this.selfSwitch;

		/**
		 * Move target only used by Pressure
		 * @type {string}
		 */
		this.pressureTarget = this.pressureTarget;

		/**
		 * Move target used if the user is not a Ghost type
		 * @type {string}
		 */
		this.nonGhostTarget = this.nonGhostTarget;

		/**
		 * Whether or not the move ignores abilities
		 * @type {boolean}
		 */
		this.ignoreAbility = this.ignoreAbility;

		/**
		 * Move damage against the current target
		 * @type {string | number | boolean}
		 */
		this.damage = this.damage;

		/**
		 * Whether or not this move hit multiple targets
		 * @type {boolean}
		 */
		this.spreadHit = this.spreadHit;

		/**
		 * Modifier that affects damage when multiple targets
		 * are hit
		 * @type {?number}
		 */
		this.spreadModifier = this.spreadModifier;

		/**
		 * Modifier that affects damage when this move is
		 * a critical hit
		 * @type {?number}
		 */
		this.critModifier = this.critModifier;

		/**
		 * Damage modifier based on the user's types
		 * @type {number}
		 */
		this.typeMod = this.typeMod;

		/**
		 * Whether or not this move gets STAB
		 * @type {boolean}
		 */
		this.hasSTAB = this.hasSTAB;

		/**
		 * True if it can't be copied with Sketch
		 * @type {boolean}
		 */
		this.noSketch = !!this.noSketch;

		/**
		 * STAB (can be modified by other effects)
		 * @type {?number}
		 */
		this.stab = this.stab;

		/**
		 * @type {?Function}
		 */
		this.damageCallback = this.damageCallback;

		/**
		 * @type {?Function}
		 */
		this.basePowerCallback = this.basePowerCallback;

		/**
		 * @type {?Function}
		 */
		this.beforeTurnCallback = this.beforeTurnCallback;

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

class TypeInfo {
	/**
	 * @param {AnyObject} data
	 * @param {?AnyObject} [moreData]
	 * @param {?AnyObject} [moreData2]
	 */
	constructor(data, moreData = null, moreData2 = null) {
		/**
		 * ID. This will be a lowercase version of the name with all the
		 * non-alphanumeric characters removed. e.g. 'flying'
		 * @type {string}
		 */
		this.id = '';
		/**
		 * Name. e.g. 'Flying'
		 * @type {string}
		 */
		this.name = '';
		/**
		 * Effect type.
		 * @type {'Type' | 'EffectType'}
		 */
		this.effectType = 'Type';
		/**
		 * Does it exist? For historical reasons, when you use an accessor
		 * for an effect that doesn't exist, you get a dummy effect that
		 * doesn't do anything, and this field set to false.
		 * @type {boolean}
		 */
		this.exists = true;
		/**
		 * The generation of Pokemon game this was INTRODUCED (NOT
		 * necessarily the current gen being simulated.) Not all effects
		 * track generation; this will be 0 if not known.
		 * @type {number}
		 */
		this.gen = 0;
		/**
		 * Type chart, attackingTypeName:result, effectid:result
		 * result is: 0 = normal, 1 = weakness, 2 = resistance, 3 = immunity
		 * @type {{[attackingTypeNameOrEffectid: string]: number}}
		 */
		this.damageTaken = {};
		/**
		 * The IVs to get this Type Hidden Power (in gen 3 and later)
		 * @type {SparseStatsTable}
		 */
		this.HPivs = {};
		/**
		 * The DVs to get this Type Hidden Power (in gen 2)
		 * @type {SparseStatsTable}
		 */
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

exports.Tools = Tools;
exports.Effect = Effect;
exports.PureEffect = PureEffect;
exports.RuleTable = RuleTable;
exports.Format = Format;
exports.Item = Item;
exports.Template = Template;
exports.Move = Move;
exports.Ability = Ability;
exports.TypeInfo = TypeInfo;
