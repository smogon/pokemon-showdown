/**
 * Dex
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Handles getting data about pokemon, items, etc. Also contains some useful
 * helper functions for using dex data.
 *
 * By default, nothing is loaded until you call Dex.mod(mod) or
 * Dex.forFormat(format).
 *
 * You may choose to preload some things:
 * - Dex.includeMods() ~10ms
 *   This will populate Dex.dexes, giving you a list of possible mods.
 *   Note that you don't need this for Dex.mod, Dex.mod will
 *   automatically populate this.
 * - Dex.includeFormats() ~30ms
 *   As above, but will also populate Dex.formats, giving an object
 *   containing formats.
 * - Dex.includeData() ~500ms
 *   As above, but will also preload all of Dex.data, giving access to
 *   the data access functions like Dex.getTemplate, Dex.getMove, etc.
 * - Dex.includeModData() ~1500ms
 *   As above, but will also preload Dex.dexes[...].data for all mods.
 *
 * Note that preloading is only necessary for iterating Dex.dexes. Getters
 * like Dex.getTemplate will automatically load this data as needed.
 *
 * @license MIT license
 */

'use strict';

const fs = require('fs');
const path = require('path');

const Data = require('./dex-data');

const DATA_DIR = path.resolve(__dirname, '../data');
const MODS_DIR = path.resolve(__dirname, '../mods');
const FORMATS = path.resolve(__dirname, '../config/formats');

/** @type {{[mod: string]: ModdedDex}} */
let dexes = Object.create(null);

/** @typedef {'Pokedex' | 'FormatsData' | 'Learnsets' | 'Movedex' | 'Statuses' | 'TypeChart' | 'Scripts' | 'Items' | 'Abilities' | 'Natures' | 'Formats'} DataType */
/** @type {DataType[]} */
const DATA_TYPES = ['Pokedex', 'FormatsData', 'Learnsets', 'Movedex', 'Statuses', 'TypeChart', 'Scripts', 'Items', 'Abilities', 'Natures', 'Formats'];

const DATA_FILES = {
	'Pokedex': 'pokedex',
	'Movedex': 'moves',
	'Statuses': 'statuses',
	'TypeChart': 'typechart',
	'Scripts': 'scripts',
	'Items': 'items',
	'Abilities': 'abilities',
	'Formats': 'rulesets',
	'FormatsData': 'formats-data',
	'Learnsets': 'learnsets',
	'Aliases': 'aliases',
	'Natures': 'natures',
};

const nullEffect = new Data.PureEffect({name: '', exists: false});

/** @typedef {{id: string, name: string, [k: string]: any}} DexTemplate */
/** @typedef {{[id: string]: AnyObject}} DexTable */

/** @typedef {{Pokedex: DexTable, Movedex: DexTable, Statuses: DexTable, TypeChart: DexTable, Scripts: DexTable, Items: DexTable, Abilities: DexTable, FormatsData: DexTable, Learnsets: DexTable, Aliases: {[id: string]: string}, Natures: DexTable, Formats: DexTable}} DexTableData */

const BattleNatures = {
	adamant: {name: "Adamant", plus: 'atk', minus: 'spa'},
	bashful: {name: "Bashful"},
	bold: {name: "Bold", plus: 'def', minus: 'atk'},
	brave: {name: "Brave", plus: 'atk', minus: 'spe'},
	calm: {name: "Calm", plus: 'spd', minus: 'atk'},
	careful: {name: "Careful", plus: 'spd', minus: 'spa'},
	docile: {name: "Docile"},
	gentle: {name: "Gentle", plus: 'spd', minus: 'def'},
	hardy: {name: "Hardy"},
	hasty: {name: "Hasty", plus: 'spe', minus: 'def'},
	impish: {name: "Impish", plus: 'def', minus: 'spa'},
	jolly: {name: "Jolly", plus: 'spe', minus: 'spa'},
	lax: {name: "Lax", plus: 'def', minus: 'spd'},
	lonely: {name: "Lonely", plus: 'atk', minus: 'def'},
	mild: {name: "Mild", plus: 'spa', minus: 'def'},
	modest: {name: "Modest", plus: 'spa', minus: 'atk'},
	naive: {name: "Naive", plus: 'spe', minus: 'spd'},
	naughty: {name: "Naughty", plus: 'atk', minus: 'spd'},
	quiet: {name: "Quiet", plus: 'spa', minus: 'spe'},
	quirky: {name: "Quirky"},
	rash: {name: "Rash", plus: 'spa', minus: 'spd'},
	relaxed: {name: "Relaxed", plus: 'def', minus: 'spe'},
	sassy: {name: "Sassy", plus: 'spd', minus: 'spe'},
	serious: {name: "Serious"},
	timid: {name: "Timid", plus: 'spe', minus: 'atk'},
};

const toId = Data.Tools.getId;

class ModdedDex {
	/**
	 * @param {string} [mod = 'base']
	 * @param {boolean} [isOriginal]
	 */
	constructor(mod = 'base', isOriginal = false) {
		/** @type {number} */
		this.gen = 0;

		this.name = "[ModdedDex]";

		this.isBase = (mod === 'base');
		/** @type {string} */
		this.currentMod = mod;
		/** @type {string} */
		this.parentMod = '';

		/** @type {?DexTableData} */
		this.dataCache = null;
		/** @type {?DexTable} */
		this.formatsCache = null;

		/** @type {Map<string, Template>} */
		this.templateCache = new Map();
		/** @type {Map<string, Move>} */
		this.moveCache = new Map();
		/** @type {Map<string, Item>} */
		this.itemCache = new Map();
		/** @type {Map<string, Ability>} */
		this.abilityCache = new Map();
		/** @type {Map<string, TypeInfo>} */
		this.typeCache = new Map();

		if (!isOriginal) {
			const original = dexes['base'].mod(mod).includeData();
			this.gen = original.gen;
			this.currentMod = original.currentMod;
			this.parentMod = original.parentMod;
			this.dataCache = original.dataCache;
			this.formatsCache = original.formatsCache;
			this.templateCache = original.templateCache;
			this.moveCache = original.moveCache;
			this.itemCache = original.itemCache;
			this.abilityCache = original.abilityCache;
		}

		this.modsLoaded = false;

		this.getString = Data.Tools.getString;
		this.getId = Data.Tools.getId;
		this.ModdedDex = ModdedDex;
		this.Data = Data;
	}

	/** @return {string} */
	get dataDir() {
		return (this.isBase ? DATA_DIR : MODS_DIR + '/' + this.currentMod);
	}
	/** @return {DexTableData} */
	get data() {
		return this.loadData();
	}
	/** @return {DexTable} */
	get formats() {
		this.includeFormats();
		// @ts-ignore
		return this.formatsCache;
	}
	/** @return {{[mod: string]: ModdedDex}} */
	get dexes() {
		this.includeMods();
		return dexes;
	}

	/**
	 * @param {string} mod
	 * @return {ModdedDex}
	 */
	mod(mod) {
		if (!dexes['base'].modsLoaded) dexes['base'].includeMods();
		if (!mod) mod = 'base';
		return dexes[mod];
	}
	/**
	 * @param {Format | string} format
	 * @return {ModdedDex}
	 */
	forFormat(format) {
		if (!this.modsLoaded) this.includeMods();
		const mod = this.getFormat(format).mod;
		if (!mod) return dexes['gen7'];
		return dexes[mod];
	}
	/**
	 * @param {DataType} dataType
	 * @param {string} id
	 */
	modData(dataType, id) {
		if (this.isBase) return this.data[dataType][id];
		if (this.data[dataType][id] !== dexes[this.parentMod].data[dataType][id]) return this.data[dataType][id];
		return (this.data[dataType][id] = this.deepClone(this.data[dataType][id]));
	}

	effectToString() {
		return this.name;
	}

	/**
	 * Sanitizes a username or Pokemon nickname
	 *
	 * Returns the passed name, sanitized for safe use as a name in the PS
	 * protocol.
	 *
	 * Such a string must uphold these guarantees:
	 * - must not contain any ASCII whitespace character other than a space
	 * - must not start or end with a space character
	 * - must not contain any of: | , [ ]
	 * - must not be the empty string
	 * - must not contain Unicode RTL control characters
	 *
	 * If no such string can be found, returns the empty string. Calling
	 * functions are expected to check for that condition and deal with it
	 * accordingly.
	 *
	 * getName also enforces that there are not multiple consecutive space
	 * characters in the name, although this is not strictly necessary for
	 * safety.
	 *
	 * @param {any} name
	 * @return {string}
	 */
	getName(name) {
		if (typeof name !== 'string' && typeof name !== 'number') return '';
		name = ('' + name).replace(/[|\s[\],\u202e]+/g, ' ').trim();
		if (name.length > 18) name = name.substr(0, 18).trim();

		// remove zalgo
		name = name.replace(/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g, '');
		name = name.replace(/[\u239b-\u23b9]/g, '');

		return name;
	}

	/**
	 * returns false if the target is immune; true otherwise
	 *
	 * also checks immunity to some statuses
	 * @param {{type: string} | string} source
	 * @param {{types: string[]} | string[] | string} target
	 * @return {boolean}
	 */
	getImmunity(source, target) {
		/** @type {string} */
		// @ts-ignore
		let sourceType = source.type || source;
		/** @type {string[] | string} */
		// @ts-ignore
		let targetTyping = target.getTypes && target.getTypes() || target.types || target;
		if (Array.isArray(targetTyping)) {
			for (const type of targetTyping) {
				if (!this.getImmunity(sourceType, type)) return false;
			}
			return true;
		}
		let typeData = this.data.TypeChart[targetTyping];
		if (typeData && typeData.damageTaken[sourceType] === 3) return false;
		return true;
	}
	/**
	 * @param {{type: string} | string} source
	 * @param {{types: string[]} | string[] | string} target
	 * @return {number}
	 */
	getEffectiveness(source, target) {
		/** @type {string} */
		// @ts-ignore
		let sourceType = source.type || source;
		let totalTypeMod = 0;
		/** @type {string[] | string} */
		// @ts-ignore
		let targetTyping = target.getTypes && target.getTypes() || target.types || target;
		if (Array.isArray(targetTyping)) {
			for (const type of targetTyping) {
				totalTypeMod += this.getEffectiveness(sourceType, type);
			}
			return totalTypeMod;
		}
		let typeData = this.data.TypeChart[targetTyping];
		if (!typeData) return 0;
		switch (typeData.damageTaken[sourceType]) {
		case 1: return 1; // super-effective
		case 2: return -1; // resist
		// in case of weird situations like Gravity, immunity is
		// handled elsewhere
		default: return 0;
		}
	}

	/**
	 * Convert a pokemon name, ID, or template into its species name, preserving
	 * form name (which is the main way Dex.getSpecies(id) differs from
	 * Dex.getTemplate(id).species).
	 *
	 * @param {string | Template} species
	 * @return {string}
	 */
	getSpecies(species) {
		let id = toId(species || '');
		let template = this.getTemplate(id);
		if (template.otherForms && template.otherForms.indexOf(id) >= 0) {
			let form = id.slice(template.species.length);
			return template.species + '-' + form[0].toUpperCase() + form.slice(1);
		} else {
			return template.species;
		}
	}

	/**
	 * @param {string | Template} [name]
	 * @return {Template}
	 */
	getTemplate(name) {
		if (name && typeof name !== 'string') {
			return name;
		}
		name = (name || '').trim();
		let id = toId(name);
		if (id === 'nidoran' && name.slice(-1) === '♀') {
			id = 'nidoranf';
		} else if (id === 'nidoran' && name.slice(-1) === '♂') {
			id = 'nidoranm';
		}
		let template = this.templateCache.get(id);
		if (template) return template;
		if (this.data.Aliases.hasOwnProperty(id)) {
			if (this.data.FormatsData.hasOwnProperty(id)) {
				// special event ID, like Rockruff-Dusk
				let baseId = toId(this.data.Aliases[id]);
				template = new Data.Template({name}, this.data.Pokedex[baseId], this.data.FormatsData[id], this.data.Learnsets[id]);
				template.name = id;
				template.species = id;
				template.speciesid = id;
				// @ts-ignore
				template.abilities = {0: template.abilities['S']};
			} else {
				template = this.getTemplate(this.data.Aliases[id]);
			}
			if (template) {
				this.templateCache.set(id, template);
			}
			return template;
		}
		if (!this.data.Pokedex.hasOwnProperty(id)) {
			let aliasTo = '';
			if (id.startsWith('mega') && this.data.Pokedex[id.slice(4) + 'mega']) {
				aliasTo = id.slice(4) + 'mega';
			} else if (id.startsWith('m') && this.data.Pokedex[id.slice(1) + 'mega']) {
				aliasTo = id.slice(1) + 'mega';
			} else if (id.startsWith('primal') && this.data.Pokedex[id.slice(6) + 'primal']) {
				aliasTo = id.slice(6) + 'primal';
			} else if (id.startsWith('p') && this.data.Pokedex[id.slice(1) + 'primal']) {
				aliasTo = id.slice(1) + 'primal';
			}
			if (aliasTo) {
				template = this.getTemplate(aliasTo);
				if (template.exists) {
					this.templateCache.set(id, template);
					return template;
				}
			}
		}
		if (id && this.data.Pokedex.hasOwnProperty(id)) {
			template = new Data.Template({name}, this.data.Pokedex[id], this.data.FormatsData[id], this.data.Learnsets[id]);
			// Inherit any statuses from the base species (Arceus, Silvally).
			const baseSpeciesStatuses = this.data.Statuses[toId(template.baseSpecies)];
			if (baseSpeciesStatuses !== undefined) {
				for (const key in baseSpeciesStatuses) {
					// @ts-ignore
					if (!(key in template)) template[key] = baseSpeciesStatuses[key];
				}
			}
			if (!template.tier && !template.doublesTier && template.baseSpecies !== template.species) {
				if (template.baseSpecies === 'Mimikyu') {
					template.tier = this.data.FormatsData[toId(template.baseSpecies)].tier;
					template.doublesTier = this.data.FormatsData[toId(template.baseSpecies)].doublesTier;
				} else if (template.speciesid.endsWith('totem')) {
					template.tier = this.data.FormatsData[template.speciesid.slice(0, -5)].tier;
					template.doublesTier = this.data.FormatsData[template.speciesid.slice(0, -5)].doublesTier;
				} else {
					template.tier = this.data.FormatsData[toId(template.baseSpecies)].tier;
					template.doublesTier = this.data.FormatsData[toId(template.baseSpecies)].doublesTier;
				}
			}
			if (!template.tier) template.tier = 'Illegal';
			if (!template.doublesTier) template.doublesTier = template.tier;
		} else {
			template = new Data.Template({name, exists: false});
		}
		if (template.exists) this.templateCache.set(id, template);
		return template;
	}
	/**
	 * @param {string | AnyObject} template
	 * @return {?AnyObject}
	 */
	getLearnset(template) {
		const id = toId(template);
		if (!this.data.Learnsets[id]) return null;
		return this.data.Learnsets[id].learnset;
	}
	/**
	 * @param {string | Move} [name]
	 * @return {Move}
	 */
	getMove(name) {
		if (name && typeof name !== 'string') {
			return name;
		}
		name = (name || '').trim();
		let id = toId(name);
		let move = this.moveCache.get(id);
		if (move) return move;
		if (this.data.Aliases.hasOwnProperty(id)) {
			move = this.getMove(this.data.Aliases[id]);
			if (move.exists) {
				this.moveCache.set(id, move);
			}
			return move;
		}
		if (id.substr(0, 11) === 'hiddenpower') {
			let matches = /([a-z]*)([0-9]*)/.exec(id);
			// @ts-ignore
			id = matches[1];
		}
		if (id && this.data.Movedex.hasOwnProperty(id)) {
			move = new Data.Move({name}, this.data.Movedex[id]);
		} else {
			move = new Data.Move({name, exists: false});
		}
		if (move.exists) this.moveCache.set(id, move);
		return move;
	}
	/**
	 * Ensure we're working on a copy of a move (and make a copy if we aren't)
	 *
	 * Remember: "ensure" - by default, it won't make a copy of a copy:
	 *     moveCopy === Dex.getMoveCopy(moveCopy)
	 *
	 * If you really want to, use:
	 *     moveCopyCopy = Dex.getMoveCopy(moveCopy.id)
	 *
	 * @param {Move | string} move - Move ID, move object, or movecopy object describing move to copy
	 * @return {Move} movecopy object
	 */
	getMoveCopy(move) {
		// @ts-ignore
		if (move && move.isCopy) return move;
		move = this.getMove(move);
		let moveCopy = this.deepClone(move);
		moveCopy.isCopy = true;
		return moveCopy;
	}
	/**
	 * @param {?string | Effect} [name]
	 * @return {Effect}
	 */
	getEffect(name) {
		if (!name) {
			return nullEffect;
		}
		if (typeof name !== 'string') {
			return name;
		}
		if (name.startsWith('move:')) {
			return this.getMove(name.slice(5));
		} else if (name.startsWith('item:')) {
			return this.getItem(name.slice(5));
		} else if (name.startsWith('ability:')) {
			return this.getAbility(name.slice(8));
		}
		let id = toId(name);
		let effect;
		if (this.data.Statuses.hasOwnProperty(id)) {
			effect = new Data.PureEffect({name}, this.data.Statuses[id]);
		} else if (this.data.Movedex.hasOwnProperty(id) && this.data.Movedex[id].effect) {
			name = this.data.Movedex[id].name || name;
			effect = new Data.PureEffect({name}, this.data.Movedex[id].effect);
		} else if (this.data.Abilities.hasOwnProperty(id) && this.data.Abilities[id].effect) {
			name = this.data.Abilities[id].name || name;
			effect = new Data.PureEffect({name}, this.data.Abilities[id].effect);
		} else if (this.data.Items.hasOwnProperty(id) && this.data.Items[id].effect) {
			name = this.data.Items[id].name || name;
			effect = new Data.PureEffect({name}, this.data.Items[id].effect);
		} else if (this.data.Formats.hasOwnProperty(id)) {
			effect = new Data.Format({name}, this.data.Formats[id]);
		} else if (id === 'recoil') {
			effect = new Data.PureEffect({name: 'Recoil', effectType: 'Recoil'});
		} else if (id === 'drain') {
			effect = new Data.PureEffect({name: 'Drain', effectType: 'Drain'});
		} else {
			effect = new Data.PureEffect({name, exists: false});
		}
		return effect;
	}
	/**
	 * Returns a sanitized format ID if valid, or throws if invalid.
	 * @param {string} name
	 */
	validateFormat(name) {
		const [formatName, customRulesString] = name.split('@@@', 2);
		const format = this.getFormat(formatName);
		if (!format.exists) throw new Error(`Unrecognized format "${formatName}"`);
		if (!customRulesString) return format.id;
		const ruleTable = this.getRuleTable(format);
		const customRules = customRulesString.split(',').map(rule => {
			const ruleSpec = this.validateRule(rule);
			if (typeof ruleSpec === 'string' && ruleTable.has(ruleSpec)) return null;
			return rule.replace(/[\r\n|]*/g, '').trim();
		}).filter(rule => rule);
		if (!customRules.length) throw new Error(`The format already has your custom rules`);
		const validatedFormatid = format.id + '@@@' + customRules.join(',');
		const moddedFormat = this.getFormat(validatedFormatid, true);
		this.getRuleTable(moddedFormat);
		return validatedFormatid;
	}
	/**
	 * @param {string | Format} [name]
	 * @return {Format}
	 */
	getFormat(name, isTrusted = false) {
		if (name && typeof name !== 'string') {
			return name;
		}
		name = (name || '').trim();
		let id = toId(name);
		if (this.data.Aliases.hasOwnProperty(id)) {
			name = this.data.Aliases[id];
			id = toId(name);
		}
		if (this.data.Formats.hasOwnProperty('gen7' + id)) {
			id = 'gen7' + id;
		}
		let supplementaryAttributes = /** @type {AnyObject?} */ (null);
		if (name.includes('@@@')) {
			if (!isTrusted) {
				try {
					name = this.validateFormat(name);
					isTrusted = true;
				} catch (e) {}
			}
			let [newName, customRulesString] = name.split('@@@', 2);
			name = newName;
			id = toId(name);
			if (isTrusted && customRulesString) {
				supplementaryAttributes = {
					customRules: customRulesString.split(','),
					searchShow: false,
				};
			}
		}
		let effect;
		if (this.data.Formats.hasOwnProperty(id)) {
			let format = this.data.Formats[id];
			effect = new Data.Format({name}, format, supplementaryAttributes);
		} else {
			effect = new Data.Format({name, exists: false});
		}
		return effect;
	}
	/**
	 * @param {string | Item} [name]
	 * @return {Item}
	 */
	getItem(name) {
		if (name && typeof name !== 'string') {
			return name;
		}
		name = (name || '').trim();
		let id = toId(name);
		let item = this.itemCache.get(id);
		if (item) return item;
		if (this.data.Aliases.hasOwnProperty(id)) {
			item = this.getItem(this.data.Aliases[id]);
			if (item.exists) {
				this.itemCache.set(id, item);
			}
			return item;
		}
		if (id && !this.data.Items[id] && this.data.Items[id + 'berry']) {
			item = this.getItem(id + 'berry');
			this.itemCache.set(id, item);
			return item;
		}
		if (id && this.data.Items.hasOwnProperty(id)) {
			item = new Data.Item({name}, this.data.Items[id]);
		} else {
			item = new Data.Item({name, exists: false});
		}

		if (item.exists) this.itemCache.set(id, item);
		return item;
	}
	/**
	 * @param {string | Ability} [name]
	 * @return {Ability}
	 */
	getAbility(name = '') {
		if (name && typeof name !== 'string') {
			return name;
		}
		let id = toId(name);
		let ability = this.abilityCache.get(id);
		if (ability) return ability;
		if (this.data.Aliases.hasOwnProperty(id)) {
			ability = this.getAbility(this.data.Aliases[id]);
			if (ability.exists) {
				this.abilityCache.set(id, ability);
			}
			return ability;
		}
		if (id && this.data.Abilities.hasOwnProperty(id)) {
			ability = new Data.Ability({name}, this.data.Abilities[id]);
		} else {
			ability = new Data.Ability({name, exists: false});
		}

		if (ability.exists) this.abilityCache.set(id, ability);
		return ability;
	}
	/**
	 * @param {string | TypeInfo} name
	 * @return {TypeInfo}
	 */
	getType(name) {
		if (name && typeof name !== 'string') {
			return name;
		}
		let id = toId(name);
		id = id.charAt(0).toUpperCase() + id.substr(1);
		let type = this.typeCache.get(id);
		if (type) return type;
		if (id && this.data.TypeChart.hasOwnProperty(id)) {
			type = new Data.TypeInfo({id}, this.data.TypeChart[id]);
		} else {
			type = new Data.TypeInfo({name, exists: false, effectType: 'EffectType'});
		}

		if (type.exists) this.typeCache.set(id, type);
		return type;
	}
	/**
	 * @param {string | AnyObject} nature
	 * @return {AnyObject}
	 */
	getNature(nature) {
		if (!nature || typeof nature === 'string') {
			let name = (nature || '').trim();
			let id = toId(name);
			nature = {};
			if (id && id !== 'constructor' && this.data.Natures[id]) {
				nature = this.data.Natures[id];
				if (nature.cached) return nature;
				nature.cached = true;
				nature.exists = true;
			}
			if (!nature.id) nature.id = id;
			if (!nature.name) nature.name = name;
			nature.toString = this.effectToString;
			if (!nature.effectType) nature.effectType = 'Nature';
			if (!nature.gen) nature.gen = 3;
		}
		return nature;
	}
	/**
	 * @param {AnyObject} stats
	 * @param {AnyObject} set
	 * @return {AnyObject}
	 */
	spreadModify(stats, set) {
		const modStats = {atk: 10, def: 10, spa: 10, spd: 10, spe: 10};
		for (let statName in modStats) {
			let stat = stats[statName];
			modStats[statName] = Math.floor(Math.floor(2 * stat + set.ivs[statName] + Math.floor(set.evs[statName] / 4)) * set.level / 100 + 5);
		}
		if ('hp' in stats) {
			let stat = stats['hp'];
			modStats['hp'] = Math.floor(Math.floor(2 * stat + set.ivs['hp'] + Math.floor(set.evs['hp'] / 4) + 100) * set.level / 100 + 10);
		}
		return this.natureModify(modStats, set.nature);
	}
	/**
	 * @param {AnyObject} stats
	 * @param {string | AnyObject} nature
	 * @return {AnyObject}
	 */
	natureModify(stats, nature) {
		nature = this.getNature(nature);
		if (nature.plus) stats[nature.plus] = Math.floor(stats[nature.plus] * 1.1);
		if (nature.minus) stats[nature.minus] = Math.floor(stats[nature.minus] * 0.9);
		return stats;
	}

	/**
	 * @param {AnyObject} ivs
	 */
	getHiddenPower(ivs) {
		const hpTypes = ['Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark'];
		const stats = {hp: 31, atk: 31, def: 31, spe: 31, spa: 31, spd: 31};
		if (this.gen <= 2) {
			// Gen 2 specific Hidden Power check. IVs are still treated 0-31 so we get them 0-15
			const atkDV = Math.floor(ivs.atk / 2);
			const defDV = Math.floor(ivs.def / 2);
			const speDV = Math.floor(ivs.spe / 2);
			const spcDV = Math.floor(ivs.spa / 2);
			return {
				type: hpTypes[4 * (atkDV % 4) + (defDV % 4)],
				power: Math.floor((5 * ((spcDV >> 3) + (2 * (speDV >> 3)) + (4 * (defDV >> 3)) + (8 * (atkDV >> 3))) + (spcDV % 4)) / 2 + 31),
			};
		} else {
			// Hidden Power check for gen 3 onwards
			let hpTypeX = 0, hpPowerX = 0;
			let i = 1;
			for (const s in stats) {
				hpTypeX += i * (ivs[s] % 2);
				hpPowerX += i * (Math.floor(ivs[s] / 2) % 2);
				i *= 2;
			}
			return {
				type: hpTypes[Math.floor(hpTypeX * 15 / 63)],
				// In Gen 6, Hidden Power is always 60 base power
				power: (this.gen && this.gen < 6) ? Math.floor(hpPowerX * 40 / 63) + 30 : 60,
			};
		}
	}

	/**
	 * @param {Format} format
	 * @param {number} [depth = 0]
	 * @return {RuleTable}
	 */
	getRuleTable(format, depth = 0) {
		let ruleTable = new Data.RuleTable();
		if (format.ruleTable) return format.ruleTable;

		let ruleset = format.ruleset.slice();
		for (const ban of format.banlist) {
			ruleset.push('-' + ban);
		}
		for (const ban of format.unbanlist) {
			ruleset.push('+' + ban);
		}
		if (format.customRules) {
			for (const rule of format.customRules) {
				if (rule.startsWith('!')) {
					ruleset.unshift(rule);
				} else {
					ruleset.push(rule);
				}
			}
		}
		if (format.checkLearnset) {
			ruleTable.checkLearnset = [format.checkLearnset, format.name];
		}

		for (const rule of ruleset) {
			const ruleSpec = this.validateRule(rule, format);
			if (typeof ruleSpec !== 'string') {
				if (ruleSpec[0] === 'complexTeamBan') {
					/**@type {[string, string, number, string[]]} */
					// @ts-ignore
					let complexTeamBan = ruleSpec.slice(1);
					ruleTable.addComplexTeamBan(complexTeamBan[0], complexTeamBan[1], complexTeamBan[2], complexTeamBan[3]);
				} else if (ruleSpec[0] === 'complexBan') {
					/**@type {[string, string, number, string[]]} */
					// @ts-ignore
					let complexBan = ruleSpec.slice(1);
					ruleTable.addComplexBan(complexBan[0], complexBan[1], complexBan[2], complexBan[3]);
				} else {
					throw new Error(`Unrecognized rule spec ${ruleSpec}`);
				}
				continue;
			}
			if ("!+-".includes(ruleSpec.charAt(0))) {
				if (ruleSpec.charAt(0) === '+' && ruleTable.has('-' + ruleSpec.slice(1))) {
					ruleTable.delete('-' + ruleSpec.slice(1));
				} else {
					ruleTable.set(ruleSpec, '');
				}
				continue;
			}
			const subformat = this.getFormat(ruleSpec);
			if (ruleTable.has('!' + subformat.id)) continue;
			ruleTable.set(subformat.id, '');
			if (!subformat.exists) continue;
			if (depth > 16) {
				throw new Error(`Excessive ruleTable recursion in ${format.name}: ${ruleSpec} of ${format.ruleset}`);
			}
			const subRuleTable = this.getRuleTable(subformat, depth + 1);
			for (const [k, v] of subRuleTable) {
				if (!ruleTable.has('!' + k)) ruleTable.set(k, v || subformat.name);
			}
			for (const [rule, source, limit, bans] of subRuleTable.complexBans) {
				ruleTable.addComplexBan(rule, source || subformat.name, limit, bans);
			}
			for (const [rule, source, limit, bans] of subRuleTable.complexTeamBans) {
				ruleTable.addComplexTeamBan(rule, source || subformat.name, limit, bans);
			}
			if (subRuleTable.checkLearnset) {
				if (ruleTable.checkLearnset) {
					throw new Error(`"${format.name}" has conflicting move validation rules from "${ruleTable.checkLearnset[1]}" and "${subRuleTable.checkLearnset[1]}"`);
				}
				ruleTable.checkLearnset = subRuleTable.checkLearnset;
			}
		}

		format.ruleTable = ruleTable;
		return ruleTable;
	}

	/**
	 * @param {string} rule
	 * @param {Format?} format
	 */
	validateRule(rule, format = null) {
		switch (rule.charAt(0)) {
		case '-':
		case '+':
			if (format && format.team) throw new Error(`We don't currently support bans in generated teams`);
			if (rule.slice(1).includes('>') || rule.slice(1).includes('+')) {
				let buf = rule.slice(1);
				const gtIndex = buf.lastIndexOf('>');
				let limit = rule.charAt(0) === '+' ? Infinity : 0;
				if (gtIndex >= 0 && /^[0-9]+$/.test(buf.slice(gtIndex + 1).trim())) {
					if (limit === 0) limit = parseInt(buf.slice(gtIndex + 1));
					buf = buf.slice(0, gtIndex);
				}
				let checkTeam = buf.includes('++');
				const banNames = buf.split(checkTeam ? '++' : '+').map(v => v.trim());
				if (banNames.length === 1 && limit > 0) checkTeam = true;
				const innerRule = banNames.join(checkTeam ? ' ++ ' : ' + ');
				const bans = banNames.map(v => this.validateBanRule(v));

				if (checkTeam) {
					return ['complexTeamBan', innerRule, '', limit, bans];
				}
				if (bans.length > 1 || limit > 0) {
					return ['complexBan', innerRule, '', limit, bans];
				}
				throw new Error(`Confusing rule ${rule}`);
			}
			return rule.charAt(0) + this.validateBanRule(rule.slice(1));
		default:
			let id = toId(rule);
			if (!this.data.Formats.hasOwnProperty(id)) {
				throw new Error(`Unrecognized rule "${rule}"`);
			}
			if (rule.charAt(0) === '!') return '!' + id;
			return id;
		}
	}

	/**
	 * @param {string} rule
	 */
	validateBanRule(rule) {
		let id = toId(rule);
		if (id === 'unreleased') return 'unreleased';
		if (id === 'illegal') return 'illegal';
		const matches = [];
		let matchTypes = ['pokemon', 'move', 'ability', 'item', 'pokemontag'];
		for (const matchType of matchTypes) {
			if (rule.slice(0, 1 + matchType.length) === matchType + ':') {
				matchTypes = [matchType];
				id = id.slice(matchType.length);
				break;
			}
		}
		const ruleid = id;
		if (this.data.Aliases.hasOwnProperty(id)) id = toId(this.data.Aliases[id]);
		for (const matchType of matchTypes) {
			let table;
			switch (matchType) {
			case 'pokemon': table = this.data.Pokedex; break;
			case 'move': table = this.data.Movedex; break;
			case 'item': table = this.data.Items; break;
			case 'ability': table = this.data.Abilities; break;
			case 'pokemontag':
				// valid pokemontags
				const validTags = [
					// singles tiers
					'uber', 'ou', 'uubl', 'uu', 'rubl', 'ru', 'nubl', 'nu', 'publ', 'pu', 'nfe', 'lcuber', 'lc', 'cap', 'caplc', 'capnfe',
					//doubles tiers
					'duber', 'dou', 'dbl', 'duu',
					// custom tags
					'mega',
				];
				if (validTags.includes(ruleid)) matches.push('pokemontag:' + ruleid);
				continue;
			default:
				throw new Error(`Unrecognized match type.`);
			}
			if (table.hasOwnProperty(id)) {
				if (matchType === 'pokemon') {
					const template = table[id];
					if (template.otherFormes) {
						matches.push('basepokemon:' + id);
						continue;
					}
				}
				matches.push(matchType + ':' + id);
			} else if (matchType === 'pokemon' && id.slice(-4) === 'base') {
				id = id.slice(0, -4);
				if (table.hasOwnProperty(id)) {
					matches.push('pokemon:' + id);
				}
			}
		}
		if (matches.length > 1) {
			throw new Error(`More than one thing matches "${rule}"; please use something like "-item:metronome" to disambiguate`);
		}
		if (matches.length < 1) {
			throw new Error(`Nothing matches "${rule}"`);
		}
		return matches[0];
	}

	/**
	 * TODO: TypeScript generics
	 * @param {Array} arr
	 * @return {Array}
	 */
	shuffle(arr) {
		// In-place shuffle by Fisher-Yates algorithm
		for (let i = arr.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
		}
		return arr;
	}

	/**
	 * @param {string} s - string 1
	 * @param {string} t - string 2
	 * @param {number} l - limit
	 * @return {number} - distance
	 */
	levenshtein(s, t, l) {
		// Original levenshtein distance function by James Westgate, turned out to be the fastest
		/** @type {number[][]} */
		let d = [];

		// Step 1
		let n = s.length;
		let m = t.length;

		if (n === 0) return m;
		if (m === 0) return n;
		if (l && Math.abs(m - n) > l) return Math.abs(m - n);

		// Create an array of arrays in javascript (a descending loop is quicker)
		for (let i = n; i >= 0; i--) d[i] = [];

		// Step 2
		for (let i = n; i >= 0; i--) d[i][0] = i;
		for (let j = m; j >= 0; j--) d[0][j] = j;

		// Step 3
		for (let i = 1; i <= n; i++) {
			let s_i = s.charAt(i - 1);

			// Step 4
			for (let j = 1; j <= m; j++) {
				// Check the jagged ld total so far
				if (i === j && d[i][j] > 4) return n;

				let t_j = t.charAt(j - 1);
				let cost = (s_i === t_j) ? 0 : 1; // Step 5

				// Calculate the minimum
				let mi = d[i - 1][j] + 1;
				let b = d[i][j - 1] + 1;
				let c = d[i - 1][j - 1] + cost;

				if (b < mi) mi = b;
				if (c < mi) mi = c;

				d[i][j] = mi; // Step 6
			}
		}

		// Step 7
		return d[n][m];
	}

	/**
	 * Forces num to be an integer (between min and max).
	 * @param {any} num
	 * @param {number=} min
	 * @param {number=} max
	 * @return {number}
	 */
	clampIntRange(num, min, max) {
		if (typeof num !== 'number') num = 0;
		num = Math.floor(num);
		if (min !== undefined && num < min) num = min;
		if (max !== undefined && num > max) num = max;
		return num;
	}

	/**
	 * @param {Format | string} format
	 * @param {PRNG | PRNGSeed?} [seed]
	 */
	getTeamGenerator(format, seed = null) {
		const TeamGenerator = require(dexes['base'].forFormat(format).dataDir + '/random-teams');
		return new TeamGenerator(format, seed);
	}
	/**
	 * @param {Format | string} format
	 * @param {PRNG | PRNGSeed?} [seed]
	 */
	generateTeam(format, seed = null) {
		return this.getTeamGenerator(format, seed).generateTeam();
	}

	/**
	 * @param {string} target
	 * @param {DataType[] | null} [searchIn]
	 * @param {boolean=} isInexact
	 * @return {AnyObject[] | false}
	 */
	dataSearch(target, searchIn, isInexact) {
		if (!target) {
			return false;
		}

		/** @type {DataType[]} */
		searchIn = searchIn || ['Pokedex', 'Movedex', 'Abilities', 'Items', 'Natures'];

		let searchFunctions = {Pokedex: 'getTemplate', Movedex: 'getMove', Abilities: 'getAbility', Items: 'getItem', Natures: 'getNature'};
		let searchTypes = {Pokedex: 'pokemon', Movedex: 'move', Abilities: 'ability', Items: 'item', Natures: 'nature'};
		/** @type {AnyObject[] | false} */
		let searchResults = [];
		for (const result of searchIn) {
			/** @type {AnyObject} */
			// @ts-ignore
			let res = this[searchFunctions[result]](target);
			if (res.exists && res.gen <= this.gen) {
				searchResults.push({
					isInexact: isInexact,
					searchType: searchTypes[result],
					name: res.species ? res.species : res.name,
				});
			}
		}
		if (searchResults.length) {
			return searchResults;
		}
		if (isInexact) {
			return false; // prevent infinite loop
		}

		let cmpTarget = toId(target);
		let maxLd = 3;
		if (cmpTarget.length <= 1) {
			return false;
		} else if (cmpTarget.length <= 4) {
			maxLd = 1;
		} else if (cmpTarget.length <= 6) {
			maxLd = 2;
		}
		searchResults = false;
		for (let i = 0; i <= searchIn.length; i++) {
			let searchObj = this.data[searchIn[i] || 'Aliases'];
			if (!searchObj) {
				continue;
			}

			for (let j in searchObj) {
				let ld = this.levenshtein(cmpTarget, j, maxLd);
				if (ld <= maxLd) {
					// @ts-ignore
					let word = searchObj[j].name || searchObj[j].species || j;
					let results = this.dataSearch(word, searchIn, word);
					if (results) {
						searchResults = results;
						maxLd = ld;
					}
				}
			}
		}

		return searchResults;
	}

	/**
	 * @param {PokemonSet[]?} team
	 * @return {string}
	 */
	packTeam(team) {
		if (!team) return '';

		let buf = '';

		for (const set of team) {
			if (buf) buf += ']';

			// name
			buf += (set.name || set.species);

			// species
			let id = toId(set.species || set.name);
			buf += '|' + (toId(set.name || set.species) === id ? '' : id);

			// item
			buf += '|' + toId(set.item);

			// ability
			let template = dexes['base'].getTemplate(set.species || set.name);
			let abilities = template.abilities;
			id = toId(set.ability);
			if (abilities) {
				if (id === toId(abilities['0'])) {
					buf += '|';
				} else if (id === toId(abilities['1'])) {
					buf += '|1';
				} else if (id === toId(abilities['H'])) {
					buf += '|H';
				} else {
					buf += '|' + id;
				}
			} else {
				buf += '|' + id;
			}

			// moves
			buf += '|' + set.moves.map(toId).join(',');

			// nature
			buf += '|' + (set.nature || '');

			// evs
			let evs = '|';
			if (set.evs) {
				evs = '|' + (set.evs['hp'] || '') + ',' + (set.evs['atk'] || '') + ',' + (set.evs['def'] || '') + ',' + (set.evs['spa'] || '') + ',' + (set.evs['spd'] || '') + ',' + (set.evs['spe'] || '');
			}
			if (evs === '|,,,,,') {
				buf += '|';
			} else {
				buf += evs;
			}

			// gender
			if (set.gender && set.gender !== template.gender) {
				buf += '|' + set.gender;
			} else {
				buf += '|';
			}

			// ivs
			let ivs = '|';
			if (set.ivs) {
				ivs = '|' + (set.ivs['hp'] === 31 || set.ivs['hp'] === undefined ? '' : set.ivs['hp']) + ',' + (set.ivs['atk'] === 31 || set.ivs['atk'] === undefined ? '' : set.ivs['atk']) + ',' + (set.ivs['def'] === 31 || set.ivs['def'] === undefined ? '' : set.ivs['def']) + ',' + (set.ivs['spa'] === 31 || set.ivs['spa'] === undefined ? '' : set.ivs['spa']) + ',' + (set.ivs['spd'] === 31 || set.ivs['spd'] === undefined ? '' : set.ivs['spd']) + ',' + (set.ivs['spe'] === 31 || set.ivs['spe'] === undefined ? '' : set.ivs['spe']);
			}
			if (ivs === '|,,,,,') {
				buf += '|';
			} else {
				buf += ivs;
			}

			// shiny
			if (set.shiny) {
				buf += '|S';
			} else {
				buf += '|';
			}

			// level
			if (set.level && set.level !== 100) {
				buf += '|' + set.level;
			} else {
				buf += '|';
			}

			// happiness
			if (set.happiness !== undefined && set.happiness !== 255) {
				buf += '|' + set.happiness;
			} else {
				buf += '|';
			}

			if (set.pokeball || set.hpType) {
				buf += ',' + set.hpType;
				buf += ',' + toId(set.pokeball);
			}
		}

		return buf;
	}

	/**
	 * @param {string} buf
	 * @return {PokemonSet[]?}
	 */
	fastUnpackTeam(buf) {
		if (!buf) return null;
		if (typeof buf !== 'string') return buf;
		if (buf.charAt(0) === '[' && buf.charAt(buf.length - 1) === ']') {
			buf = this.packTeam(JSON.parse(buf));
		}

		let team = [];
		let i = 0, j = 0;

		// limit to 24
		for (let count = 0; count < 24; count++) {
			let set = /** @type {any} */ ({});
			team.push(set);

			// name
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.name = buf.substring(i, j);
			i = j + 1;

			// species
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.species = buf.substring(i, j) || set.name;
			i = j + 1;

			// item
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.item = buf.substring(i, j);
			i = j + 1;

			// ability
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			let ability = buf.substring(i, j);
			let template = dexes['base'].getTemplate(set.species);
			// @ts-ignore
			set.ability = (template.abilities && ['', '0', '1', 'H'].includes(ability) ? template.abilities[ability || '0'] : ability);
			i = j + 1;

			// moves
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.moves = buf.substring(i, j).split(',', 24).filter(x => x);
			i = j + 1;

			// nature
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.nature = buf.substring(i, j);
			i = j + 1;

			// evs
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (j !== i) {
				let evs = buf.substring(i, j).split(',', 6);
				set.evs = {
					hp: Number(evs[0]) || 0,
					atk: Number(evs[1]) || 0,
					def: Number(evs[2]) || 0,
					spa: Number(evs[3]) || 0,
					spd: Number(evs[4]) || 0,
					spe: Number(evs[5]) || 0,
				};
			}
			i = j + 1;

			// gender
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (i !== j) set.gender = buf.substring(i, j);
			i = j + 1;

			// ivs
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (j !== i) {
				let ivs = buf.substring(i, j).split(',', 6);
				set.ivs = {
					hp: ivs[0] === '' ? 31 : Number(ivs[0]) || 0,
					atk: ivs[1] === '' ? 31 : Number(ivs[1]) || 0,
					def: ivs[2] === '' ? 31 : Number(ivs[2]) || 0,
					spa: ivs[3] === '' ? 31 : Number(ivs[3]) || 0,
					spd: ivs[4] === '' ? 31 : Number(ivs[4]) || 0,
					spe: ivs[5] === '' ? 31 : Number(ivs[5]) || 0,
				};
			}
			i = j + 1;

			// shiny
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (i !== j) set.shiny = true;
			i = j + 1;

			// level
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (i !== j) set.level = parseInt(buf.substring(i, j));
			i = j + 1;

			// happiness
			j = buf.indexOf(']', i);
			let misc;
			if (j < 0) {
				if (i < buf.length) misc = buf.substring(i).split(',', 3);
			} else {
				if (i !== j) misc = buf.substring(i, j).split(',', 3);
			}
			if (misc) {
				set.happiness = (misc[0] ? Number(misc[0]) : 255);
				set.hpType = misc[1];
				set.pokeball = misc[2];
			}
			if (j < 0) break;
			i = j + 1;
		}

		return team;
	}

	/**
	 * @param {any} obj
	 * @return {any}
	 */
	deepClone(obj) {
		if (typeof obj === 'function') return obj;
		if (obj === null || typeof obj !== 'object') return obj;
		if (Array.isArray(obj)) return obj.map(prop => this.deepClone(prop));
		const clone = Object.create(Object.getPrototypeOf(obj));
		for (const key of Object.keys(obj)) {
			clone[key] = this.deepClone(obj[key]);
		}
		return clone;
	}

	/**
	 * @param {string} basePath
	 * @param {DataType} dataType
	 * @return {AnyObject}
	 */
	loadDataFile(basePath, dataType) {
		try {
			const filePath = basePath + DATA_FILES[dataType];
			const dataObject = require(filePath);
			const key = `Battle${dataType}`;
			if (!dataObject || typeof dataObject !== 'object') return new TypeError(`${filePath}, if it exists, must export a non-null object`);
			if (!dataObject[key] || typeof dataObject[key] !== 'object') return new TypeError(`${filePath}, if it exists, must export an object whose '${key}' property is a non-null object`);
			return dataObject[key];
		} catch (e) {
			if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
				throw e;
			}
		}
		return {};
	}

	/**
	 * @return {ModdedDex}
	 */
	includeMods() {
		if (!this.isBase) throw new Error(`This must be called on the base Dex`);
		if (this.modsLoaded) return this;

		for (const mod of fs.readdirSync(MODS_DIR)) {
			dexes[mod] = new ModdedDex(mod, true);
		}
		this.modsLoaded = true;

		return this;
	}

	/**
	 * @return {ModdedDex}
	 */
	includeModData() {
		for (const mod in this.dexes) {
			dexes[mod].includeData();
		}
		return this;
	}

	/**
	 * @return {ModdedDex}
	 */
	includeData() {
		this.loadData();
		return this;
	}
	/**
	 * @return {DexTableData}
	 */
	loadData() {
		if (this.dataCache) return this.dataCache;
		dexes['base'].includeMods();
		let dataCache = {};

		let basePath = this.dataDir + '/';

		let BattleScripts = this.loadDataFile(basePath, 'Scripts');
		this.parentMod = this.isBase ? '' : (BattleScripts.inherit || 'base');

		let parentDex;
		if (this.parentMod) {
			parentDex = dexes[this.parentMod];
			if (!parentDex || parentDex === this) throw new Error("Unable to load " + this.currentMod + ". `inherit` should specify a parent mod from which to inherit data, or must be not specified.");
		}

		// @ts-ignore
		for (const dataType of DATA_TYPES.concat('Aliases')) {
			if (dataType === 'Natures' && this.isBase) {
				dataCache[dataType] = BattleNatures;
				continue;
			}
			let BattleData = this.loadDataFile(basePath, dataType);
			if (!BattleData || typeof BattleData !== 'object') throw new TypeError("Exported property `Battle" + dataType + "`from `" + './data/' + DATA_FILES[dataType] + "` must be an object except `null`.");
			if (BattleData !== dataCache[dataType]) dataCache[dataType] = Object.assign(BattleData, dataCache[dataType]);
			if (dataType === 'Formats' && !parentDex) Object.assign(BattleData, this.formats);
		}
		if (!parentDex) {
			// Formats are inherited by mods
			this.includeFormats();
		} else {
			for (const dataType of DATA_TYPES) {
				const parentTypedData = parentDex.data[dataType];
				const childTypedData = dataCache[dataType] || (dataCache[dataType] = {});
				for (let entryId in parentTypedData) {
					if (childTypedData[entryId] === null) {
						// null means don't inherit
						delete childTypedData[entryId];
					} else if (!(entryId in childTypedData)) {
						// If it doesn't exist it's inherited from the parent data
						if (dataType === 'Pokedex') {
							// Pokedex entries can be modified too many different ways
							// e.g. inheriting different formats-data/learnsets
							childTypedData[entryId] = this.deepClone(parentTypedData[entryId]);
						} else {
							childTypedData[entryId] = parentTypedData[entryId];
						}
					} else if (childTypedData[entryId] && childTypedData[entryId].inherit) {
						// {inherit: true} can be used to modify only parts of the parent data,
						// instead of overwriting entirely
						delete childTypedData[entryId].inherit;

						// Merge parent into children entry, preserving existing childs' properties.
						for (let key in parentTypedData[entryId]) {
							if (key in childTypedData[entryId]) continue;
							childTypedData[entryId][key] = parentTypedData[entryId][key];
						}
					}
				}
			}
			dataCache['Aliases'] = parentDex.data['Aliases'];
		}

		// Flag the generation. Required for team validator.
		this.gen = dataCache.Scripts.gen || 7;
		// @ts-ignore
		this.dataCache = dataCache;

		// Execute initialization script.
		if (BattleScripts.init) BattleScripts.init.call(this);

		// @ts-ignore TypeScript bug
		return this.dataCache;
	}

	/**
	 * @return {ModdedDex}
	 */
	includeFormats() {
		if (!this.isBase) throw new Error(`This should only be run on the base mod`);
		this.includeMods();
		if (this.formatsCache) return this;

		if (!this.formatsCache) this.formatsCache = {};

		// Load formats
		let Formats;
		try {
			Formats = require(FORMATS).Formats;
		} catch (e) {
			if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
				throw e;
			}
		}
		if (!Array.isArray(Formats)) throw new TypeError(`Exported property 'Formats' from "./config/formats.js" must be an array`);

		let section = '';
		let column = 1;
		for (const [i, format] of Formats.entries()) {
			let id = toId(format.name);
			if (format.section) section = format.section;
			if (format.column) column = format.column;
			if (!format.name && format.section) continue;
			if (!id) throw new RangeError(`Format #${i + 1} must have a name with alphanumeric characters, not '${format.name}'`);
			if (!format.section) format.section = section;
			if (!format.column) format.column = column;
			if (this.formatsCache[id]) throw new Error(`Format #${i + 1} has a duplicate ID: '${id}'`);
			format.effectType = 'Format';
			format.baseRuleset = format.ruleset ? format.ruleset.slice() : [];
			if (format.challengeShow === undefined) format.challengeShow = true;
			if (format.searchShow === undefined) format.searchShow = true;
			if (format.tournamentShow === undefined) format.tournamentShow = true;
			if (format.mod === undefined) format.mod = 'gen7';
			if (!dexes[format.mod]) throw new Error(`Format "${format.name}" requires nonexistent mod: '${format.mod}'`);
			this.formatsCache[id] = format;
		}

		return this;
	}

	/**
	 * @param {string} id - Format ID
	 * @param {Format} format - Format
	 */
	installFormat(id, format) {
		dexes['base'].includeFormats();
		// @ts-ignore
		dexes['base'].formatsCache[id] = format;
		if (this.dataCache) this.dataCache.Formats[id] = format;
		if (!this.isBase) {
			// @ts-ignore
			if (dexes['base'].dataCache) dexes['base'].dataCache.Formats[id] = format;
		}
	}
}

dexes['base'] = new ModdedDex(undefined, true);

// "gen7" is an alias for the current base data
dexes['gen7'] = dexes['base'];

module.exports = dexes['gen7'];
