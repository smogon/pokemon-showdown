/**
 * Dex
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Handles getting data about pokemon, items, etc.
 *
 * This file is used by basically every PS process. Sim processes use it
 * to get game data for simulation, team validators use it to get data
 * for validation, dexsearch uses it for dex data, and the main process
 * uses it for format listing and miscellaneous dex lookup chat commands.
 *
 * It currently also contains our shims, since it has no dependencies and
 * is included by nearly every process.
 *
 * By default, nothing is loaded until you call Dex.mod(mod) or
 * Dex.format(format).
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
 *   As above, but will also populate all of Dex.data, giving access to
 *   the data access functions like Dex.getTemplate, Dex.getMove, etc.
 *   Note that you don't need this if you access the functions through
 *   Dex.mod(...).getTemplate, because Dex.mod automatically populates
 *   data for the relevant mod.
 * - Dex.includeModData() ~1500ms
 *   As above, but will also populate Dex.dexes[...].data for all mods.
 *   Note that Dex.mod(...) will automatically populate .data, so use
 *   this only if you need to manually iterate Dex.dexes.
 *
 * Note that preloading is unnecessary. The getters for Dex.data etc
 * will automatically load this data as needed.
 *
 * @license MIT license
 */

'use strict';

const fs = require('fs');
const path = require('path');

const {Tools, Effect} = require('./dex-data');

const DATA_DIR = path.resolve(__dirname, '../data');
const MODS_DIR = path.resolve(__dirname, '../mods');
const FORMATS = path.resolve(__dirname, '../config/formats');

// shim Object.values
if (!Object.values) {
	// @ts-ignore
	Object.values = function (object) {
		let values = [];
		for (let k in object) values.push(object[k]);
		return values;
	};
	// @ts-ignore
	Object.entries = function (object) {
		let entries = [];
		for (let k in object) entries.push([k, object[k]]);
		return entries;
	};
}

// shim padStart
// if (!String.prototype.padStart) {
// 	String.prototype.padStart = function padStart(maxLength, filler) {
// 		filler = filler || ' ';
// 		while (filler.length + this.length < maxLength) {
// 			filler += filler;
// 		}

// 		return filler.slice(0, maxLength - this.length) + this;
// 	};
// }

/** @type {{[mod: string]: ModdedDex}} */
let dexes = {};

/** @typedef {'Pokedex' | 'FormatsData' | 'Learnsets' | 'Movedex' | 'Statuses' | 'TypeChart' | 'Scripts' | 'Items' | 'Abilities' | 'Natures' | 'Formats' | 'Aliases'} DataType */
/** @type {DataType[]} */
const DATA_TYPES = ['Pokedex', 'FormatsData', 'Learnsets', 'Movedex', 'Statuses', 'TypeChart', 'Scripts', 'Items', 'Abilities', 'Natures', 'Formats', 'Aliases'];

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

/** @typedef {{id: string, name: string, [k: string]: any}} DexTemplate */
/** @typedef {{[id: string]: AnyObject}} DexTable */

/** @typedef {{Pokedex: DexTable, Movedex: DexTable, Statuses: DexTable, TypeChart: DexTable, Scripts: DexTable, Items: DexTable, Abilities: DexTable, FormatsData: DexTable, Learnsets: DexTable, Aliases: DexTable, Natures: DexTable, Formats: DexTable, MoveCache: Map, ItemCache: Map, AbilityCache: Map, TemplateCache: Map}} DexTableData */

const BattleNatures = {
	adamant: {name:"Adamant", plus:'atk', minus:'spa'},
	bashful: {name:"Bashful"},
	bold: {name:"Bold", plus:'def', minus:'atk'},
	brave: {name:"Brave", plus:'atk', minus:'spe'},
	calm: {name:"Calm", plus:'spd', minus:'atk'},
	careful: {name:"Careful", plus:'spd', minus:'spa'},
	docile: {name:"Docile"},
	gentle: {name:"Gentle", plus:'spd', minus:'def'},
	hardy: {name:"Hardy"},
	hasty: {name:"Hasty", plus:'spe', minus:'def'},
	impish: {name:"Impish", plus:'def', minus:'spa'},
	jolly: {name:"Jolly", plus:'spe', minus:'spa'},
	lax: {name:"Lax", plus:'def', minus:'spd'},
	lonely: {name:"Lonely", plus:'atk', minus:'def'},
	mild: {name:"Mild", plus:'spa', minus:'def'},
	modest: {name:"Modest", plus:'spa', minus:'atk'},
	naive: {name:"Naive", plus:'spe', minus:'spd'},
	naughty: {name:"Naughty", plus:'atk', minus:'spd'},
	quiet: {name:"Quiet", plus:'spa', minus:'spe'},
	quirky: {name:"Quirky"},
	rash: {name:"Rash", plus:'spa', minus:'spd'},
	relaxed: {name:"Relaxed", plus:'def', minus:'spe'},
	sassy: {name:"Sassy", plus:'spd', minus:'spe'},
	serious: {name:"Serious"},
	timid: {name:"Timid", plus:'spe', minus:'atk'},
};

const toId = Tools.getId;

class ModdedDex {

	/**
	 * @param {string=} mod
	 */
	constructor(mod = 'base') {
		this.gen = 0;

		this.name = "[ModdedDex]";

		this.isBase = (mod === 'base');
		this.currentMod = mod;
		this.parentMod = '';

		/** @type {?DexTableData} */
		this.dataCache = null;
		/** @type {?DexTable} */
		this.formatsCache = null;
		this.modsLoaded = false;

		this.getString = Tools.getString;
		this.getId = Tools.getId;
		this.ModdedDex = ModdedDex;
	}

	/**
	 * @return {DexTableData}
	 */
	get data() {
		return this.loadData();
	}
	/**
	 * @return {DexTable}
	 */
	get formats() {
		this.includeFormats();
		// @ts-ignore
		return this.formatsCache;
	}
	/**
	 * @return {{[mod: string]: ModdedDex}}
	 */
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
	 * @param {AnyObject | string} format
	 * @return {ModdedDex}
	 */
	format(format) {
		if (!this.modsLoaded) this.includeMods();
		const mod = this.getFormat(format).mod;
		// TODO: change default format mod as gen7 becomes stable
		if (!mod) return dexes['gen6'];
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
		name = ('' + name).replace(/[\|\s\[\]\,\u202e]+/g, ' ').trim();
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
			for (let i = 0; i < targetTyping.length; i++) {
				if (!this.getImmunity(sourceType, targetTyping[i])) return false;
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
			for (let i = 0; i < targetTyping.length; i++) {
				totalTypeMod += this.getEffectiveness(sourceType, targetTyping[i]);
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
	 * @param {string | AnyObject} species
	 * @return {string}
	 */
	getSpecies(species) {
		let id = toId(species || '');
		let template = this.getTemplate(id);
		if (template.otherForms && template.otherForms.indexOf(id) >= 0) {
			let form = id.slice(template.species.length);
			species = template.species + '-' + form[0].toUpperCase() + form.slice(1);
		} else {
			species = template.species;
		}
		return species;
	}

	/**
	 * @param {string | AnyObject} template
	 * @return {AnyObject}
	 */
	getTemplate(template) {
		if (!template || typeof template === 'string') {
			let name = (template || '').trim();
			let id = toId(name);
			if (id === 'nidoran' && name.slice(-1) === '♀') {
				id = 'nidoranf';
			} else if (id === 'nidoran' && name.slice(-1) === '♂') {
				id = 'nidoranm';
			}
			template = this.data.TemplateCache.get(id);
			if (template) return template;
			if (this.data.Aliases.hasOwnProperty(id)) {
				template = this.getTemplate(this.data.Aliases[id]);
				if (template) {
					this.data.TemplateCache.set(id, template);
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
						this.data.TemplateCache.set(id, template);
						return template;
					}
				}
			}
			if (id && this.data.Pokedex.hasOwnProperty(id)) {
				template = this.deepClone(this.data.Pokedex[id]);
				template.exists = true;
			} else {
				template = {};
			}
			name = template.species || template.name || name;
			if (this.data.FormatsData[id]) {
				Object.assign(template, this.data.FormatsData[id]);
			}
			if (this.data.Learnsets[id]) {
				Object.assign(template, this.data.Learnsets[id]);
			}
			if (!template.id) template.id = id;
			if (!template.name) template.name = name;
			if (!template.speciesid) template.speciesid = id;
			if (!template.species) template.species = name;
			if (!template.baseSpecies) template.baseSpecies = name;
			if (!template.forme) template.forme = '';
			if (!template.formeLetter) template.formeLetter = '';
			if (!template.spriteid) template.spriteid = toId(template.baseSpecies) + (template.baseSpecies !== name ? '-' + toId(template.forme) : '');
			if (!template.prevo) template.prevo = '';
			if (!template.evos) template.evos = [];
			if (!template.nfe) template.nfe = !!template.evos.length;
			if (!template.eggGroups) template.eggGroups = [];
			if (!template.gender) template.gender = '';
			if (!template.genderRatio && template.gender === 'M') template.genderRatio = {M:1, F:0};
			if (!template.genderRatio && template.gender === 'F') template.genderRatio = {M:0, F:1};
			if (!template.genderRatio && template.gender === 'N') template.genderRatio = {M:0, F:0};
			if (!template.genderRatio) template.genderRatio = {M:0.5, F:0.5};
			if (!template.tier && template.baseSpecies !== template.species) template.tier = this.data.FormatsData[toId(template.baseSpecies)].tier;
			if (!template.requiredItems && template.requiredItem) template.requiredItems = [template.requiredItem];
			if (!template.tier) template.tier = 'Illegal';
			if (!template.gen) {
				if (template.num >= 722 || template.forme === 'Alola') {
					template.gen = 7;
				} else if (template.forme && template.forme in {'Mega':1, 'Mega-X':1, 'Mega-Y':1}) {
					template.gen = 6;
					template.isMega = true;
					template.battleOnly = true;
				} else if (template.forme === 'Primal') {
					template.gen = 6;
					template.isPrimal = true;
					template.battleOnly = true;
				} else if (template.num >= 650) {
					template.gen = 6;
				} else if (template.num >= 494) {
					template.gen = 5;
				} else if (template.num >= 387) {
					template.gen = 4;
				} else if (template.num >= 252) {
					template.gen = 3;
				} else if (template.num >= 152) {
					template.gen = 2;
				} else if (template.num >= 1) {
					template.gen = 1;
				} else {
					template.gen = 0;
				}
			}
			if (template.exists) this.data.TemplateCache.set(id, template);
		}
		return template;
	}
	/**
	 * @param {string | AnyObject} template
	 * @return {AnyObject}
	 */
	getLearnset(template) {
		const id = toId(template);
		if (!this.data.Learnsets[id]) return null;
		return this.data.Learnsets[id].learnset;
	}
	/**
	 * @param {string | AnyObject} move
	 * @return {AnyObject}
	 */
	getMove(move) {
		if (!move || typeof move === 'string') {
			let name = (move || '').trim();
			let id = toId(name);
			move = this.data.MoveCache.get(id);
			if (move) return move;
			if (this.data.Aliases.hasOwnProperty(id)) {
				move = this.getMove(this.data.Aliases[id]);
				if (move.exists) {
					this.data.MoveCache.set(id, move);
				}
				return move;
			}
			if (id.substr(0, 11) === 'hiddenpower') {
				let matches = /([a-z]*)([0-9]*)/.exec(id);
				// @ts-ignore
				id = matches[1];
			}
			if (id && this.data.Movedex.hasOwnProperty(id)) {
				move = this.deepClone(this.data.Movedex[id]);
				move.exists = true;
			} else {
				move = {};
			}
			if (!move.id) move.id = id;
			if (!move.name) move.name = name;
			if (!move.fullname) move.fullname = 'move: ' + move.name;
			move.toString = this.effectToString;
			if (!move.critRatio) move.critRatio = 1;
			if (!move.baseType) move.baseType = move.type;
			if (!move.effectType) move.effectType = 'Move';
			if (!move.secondaries && move.secondary) move.secondaries = [move.secondary];
			if (!move.gen) {
				if (move.num >= 622) {
					move.gen = 7;
				} else if (move.num >= 560) {
					move.gen = 6;
				} else if (move.num >= 468) {
					move.gen = 5;
				} else if (move.num >= 355) {
					move.gen = 4;
				} else if (move.num >= 252) {
					move.gen = 3;
				} else if (move.num >= 166) {
					move.gen = 2;
				} else if (move.num >= 1) {
					move.gen = 1;
				} else {
					move.gen = 0;
				}
			}
			if (!move.priority) move.priority = 0;
			if (move.ignoreImmunity === undefined) move.ignoreImmunity = (move.category === 'Status');
			if (!move.flags) move.flags = {};
			if (move.exists) this.data.MoveCache.set(id, move);
		}
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
	 * @param {AnyObject | string} move - Move ID, move object, or movecopy object describing move to copy
	 * @return {AnyObject} movecopy object
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
	 * @param {string | AnyObject} name
	 * @return {AnyObject}
	 */
	getEffect(name) {
		if (name && typeof name !== 'string') {
			return name;
		}
		let id = toId(name);
		let effect;
		if (id && this.data.Statuses.hasOwnProperty(id)) {
			effect = new Effect({name}, this.data.Statuses[id]);
		} else if (id && this.data.Movedex.hasOwnProperty(id) && this.data.Movedex[id].effect) {
			effect = new Effect({name}, this.data.Movedex[id].effect);
		} else if (id && this.data.Abilities.hasOwnProperty(id) && this.data.Abilities[id].effect) {
			effect = new Effect({name}, this.data.Abilities[id].effect);
		} else if (id && this.data.Items.hasOwnProperty(id) && this.data.Items[id].effect) {
			effect = new Effect({name}, this.data.Items[id].effect);
		} else if (id && this.data.Formats.hasOwnProperty(id)) {
			effect = new Effect({name, mod: 'gen6', effectType: 'Format'}, this.data.Formats[id]);
		} else if (id === 'recoil') {
			effect = new Effect({name: 'Recoil', effectType: 'Recoil'});
		} else if (id === 'drain') {
			effect = new Effect({name: 'Drain', effectType: 'Drain'});
		} else {
			effect = new Effect({name, exists: false});
		}
		return effect;
	}
	/**
	 * @param {string | AnyObject} name
	 * @return {AnyObject}
	 */
	getFormat(name) {
		if (name && typeof name !== 'string') {
			return name;
		}
		name = (name || '').trim();
		let id = toId(name);
		if (this.data.Aliases[id]) {
			name = this.data.Aliases[id];
			id = toId(name);
		}
		let effect = {};
		if (this.data.Formats.hasOwnProperty(id)) {
			effect = this.data.Formats[id];
			if (effect.cached) return effect;
			effect.cached = true;
			effect.exists = true;
			effect.name = effect.name || this.data.Formats[id].name;
			if (!effect.mod) effect.mod = 'gen6';
			if (!effect.effectType) effect.effectType = 'Format';
		}
		if (!effect.id) effect.id = id;
		if (!effect.name) effect.name = name;
		if (!effect.fullname) effect.fullname = effect.name;
		effect.toString = this.effectToString;
		if (!effect.category) effect.category = 'Effect';
		if (!effect.effectType) effect.effectType = 'Effect';
		return effect;
	}
	/**
	 * @param {string | AnyObject} item
	 * @return {AnyObject}
	 */
	getItem(item) {
		if (!item || typeof item === 'string') {
			let name = (item || '').trim();
			let id = toId(name);
			item = this.data.ItemCache.get(id);
			if (item) return item;
			if (this.data.Aliases.hasOwnProperty(id)) {
				item = this.getItem(this.data.Aliases[id]);
				if (item.exists) {
					this.data.ItemCache.set(id, item);
				}
				return item;
			}
			if (id && !this.data.Items[id] && this.data.Items[id + 'berry']) {
				item = this.getItem(id + 'berry');
				this.data.ItemCache.set(id, item);
				return item;
			}
			if (id && this.data.Items.hasOwnProperty(id)) {
				item = this.data.Items[id];
				item.exists = true;
			} else {
				item = {};
			}
			if (!item.id) item.id = id;
			if (!item.name) item.name = name;
			if (!item.fullname) item.fullname = 'item: ' + item.name;
			item.toString = this.effectToString;
			if (!item.category) item.category = 'Effect';
			if (!item.effectType) item.effectType = 'Item';
			if (item.isBerry) item.fling = {basePower: 10};
			if (item.id.endsWith('plate')) item.fling = {basePower: 90};
			if (item.onDrive) item.fling = {basePower: 70};
			if (item.megaStone) item.fling = {basePower: 80};
			if (item.onMemory) item.fling = {basePower: 50};
			if (!item.gen) {
				if (item.num >= 689) {
					item.gen = 7;
				} else if (item.num >= 577) {
					item.gen = 6;
				} else if (item.num >= 537) {
					item.gen = 5;
				} else if (item.num >= 377) {
					item.gen = 4;
				} else {
					item.gen = 3;
				}
				// Due to difference in storing items, gen 2 items must be specified manually
			}
			if (item.exists) this.data.ItemCache.set(id, item);
		}
		return item;
	}
	/**
	 * @param {string | AnyObject} ability
	 * @return {AnyObject}
	 */
	getAbility(ability) {
		if (!ability || typeof ability === 'string') {
			let name = (ability || '').trim();
			let id = toId(name);
			ability = this.data.AbilityCache.get(id);
			if (ability) return ability;
			if (id && this.data.Abilities.hasOwnProperty(id)) {
				ability = this.data.Abilities[id];
				if (ability.cached) return ability;
				ability.cached = true;
				ability.exists = true;
			} else {
				ability = {};
			}
			if (!ability.id) ability.id = id;
			if (!ability.name) ability.name = name;
			if (!ability.fullname) ability.fullname = 'ability: ' + ability.name;
			ability.toString = this.effectToString;
			if (!ability.category) ability.category = 'Effect';
			if (!ability.effectType) ability.effectType = 'Ability';
			if (!ability.gen) {
				if (ability.num >= 192) {
					ability.gen = 7;
				} else if (ability.num >= 165) {
					ability.gen = 6;
				} else if (ability.num >= 124) {
					ability.gen = 5;
				} else if (ability.num >= 77) {
					ability.gen = 4;
				} else if (ability.num >= 1) {
					ability.gen = 3;
				} else {
					ability.gen = 0;
				}
			}
			if (ability.exists) this.data.AbilityCache.set(id, ability);
		}
		return ability;
	}
	/**
	 * @param {string | AnyObject} type
	 * @return {AnyObject}
	 */
	getType(type) {
		if (!type || typeof type === 'string') {
			let id = toId(type);
			id = id.charAt(0).toUpperCase() + id.substr(1);
			type = {};
			if (id && id !== 'constructor' && this.data.TypeChart[id]) {
				type = this.data.TypeChart[id];
				if (type.cached) return type;
				type.cached = true;
				type.exists = true;
				type.isType = true;
				type.effectType = 'Type';
			}
			if (!type.id) type.id = id;
			if (!type.effectType) {
				// man, this is really meta
				type.effectType = 'EffectType';
			}
		}
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
		}
		return nature;
	}
	/**
	 * @param {AnyObject} stats
	 * @param {AnyObject} set
	 * @return {AnyObject}
	 */
	spreadModify(stats, set) {
		const modStats = {atk:10, def:10, spa:10, spd:10, spe:10};
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
				power: Math.floor((5 * ((spcDV >> 3) + (2 * (speDV >> 3)) + (4 * (defDV >> 3)) + (8 * (atkDV >> 3))) + (spcDV > 2 ? 3 : spcDV)) / 2 + 31),
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
	 * @param {AnyObject} format
	 * @param {AnyObject=} subformat
	 * @param {number=} depth
	 * @return {AnyObject}
	 */
	getBanlistTable(format, subformat, depth) {
		let banlistTable;
		if (!depth) depth = 0;
		if (depth > 8) return; // avoid infinite recursion
		if (format.banlistTable && !subformat) {
			banlistTable = format.banlistTable;
		} else {
			if (!format.banlistTable) format.banlistTable = {};
			if (!format.setBanTable) format.setBanTable = [];
			if (!format.teamBanTable) format.teamBanTable = [];
			if (!format.teamLimitTable) format.teamLimitTable = [];

			banlistTable = format.banlistTable;
			if (!subformat) subformat = format;
			if (subformat.unbanlist) {
				for (let i = 0; i < subformat.unbanlist.length; i++) {
					banlistTable[subformat.unbanlist[i]] = false;
					banlistTable[toId(subformat.unbanlist[i])] = false;
				}
			}
			if (subformat.banlist) {
				for (let i = 0; i < subformat.banlist.length; i++) {
					// don't revalidate what we already validate
					if (banlistTable[toId(subformat.banlist[i])] !== undefined) continue;

					banlistTable[subformat.banlist[i]] = subformat.name || true;
					banlistTable[toId(subformat.banlist[i])] = subformat.name || true;

					let complexList;
					if (subformat.banlist[i].includes('>')) {
						complexList = subformat.banlist[i].split('>');
						let limit = parseInt(complexList[1]);
						let banlist = complexList[0].trim();
						complexList = banlist.split('+').map(toId);
						complexList.unshift(banlist, subformat.name, limit);
						format.teamLimitTable.push(complexList);
					} else if (subformat.banlist[i].includes('+')) {
						if (subformat.banlist[i].includes('++')) {
							complexList = subformat.banlist[i].split('++');
							let banlist = complexList.join('+');
							for (let j = 0; j < complexList.length; j++) {
								complexList[j] = toId(complexList[j]);
							}
							complexList.unshift(banlist);
							format.teamBanTable.push(complexList);
						} else {
							complexList = subformat.banlist[i].split('+');
							for (let j = 0; j < complexList.length; j++) {
								complexList[j] = toId(complexList[j]);
							}
							complexList.unshift(subformat.banlist[i]);
							format.setBanTable.push(complexList);
						}
					}
				}
			}
			if (subformat.ruleset) {
				for (let i = 0; i < subformat.ruleset.length; i++) {
					// don't revalidate what we already validate
					if (banlistTable['Rule:' + toId(subformat.ruleset[i])] !== undefined) continue;

					banlistTable['Rule:' + toId(subformat.ruleset[i])] = subformat.ruleset[i];
					if (!format.ruleset.includes(subformat.ruleset[i])) format.ruleset.push(subformat.ruleset[i]);

					let subsubformat = this.getFormat(subformat.ruleset[i]);
					if (subsubformat.ruleset || subsubformat.banlist) {
						this.getBanlistTable(format, subsubformat, depth + 1);
					}
				}
			}
		}
		return banlistTable;
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
		if (num < min) num = min;
		if (max !== undefined && num > max) num = max;
		return num;
	}

	/**
	 * @param {string} target
	 * @param {DataType[] | null=} searchIn
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
		let searchResults = [];
		for (let i = 0; i < searchIn.length; i++) {
			/** @type {AnyObject} */
			// @ts-ignore
			let res = this[searchFunctions[searchIn[i]]](target);
			if (res.exists && res.gen <= this.gen) {
				searchResults.push({
					exactMatch: !isInexact,
					searchType: searchTypes[searchIn[i]],
					name: res.name || isInexact,
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
	 * @param {AnyObject[]} team
	 * @return {string}
	 */
	packTeam(team) {
		if (!team) return '';

		let buf = '';

		for (let i = 0; i < team.length; i++) {
			let set = team[i];
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
			buf += '|' + set.nature;

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
	 * @return {AnyObject[]}
	 */
	fastUnpackTeam(buf) {
		if (!buf) return null;

		let team = [];
		let i = 0, j = 0;

		// limit to 24
		for (let count = 0; count < 24; count++) {
			let set = {};
			team.push(set);

			// name
			j = buf.indexOf('|', i);
			if (j < 0) return;
			set.name = buf.substring(i, j);
			i = j + 1;

			// species
			j = buf.indexOf('|', i);
			if (j < 0) return;
			set.species = buf.substring(i, j) || set.name;
			i = j + 1;

			// item
			j = buf.indexOf('|', i);
			if (j < 0) return;
			set.item = buf.substring(i, j);
			i = j + 1;

			// ability
			j = buf.indexOf('|', i);
			if (j < 0) return;
			let ability = buf.substring(i, j);
			let template = dexes['base'].getTemplate(set.species);
			set.ability = (template.abilities && ability in {'':1, 0:1, 1:1, H:1} ? template.abilities[ability || '0'] : ability);
			i = j + 1;

			// moves
			j = buf.indexOf('|', i);
			if (j < 0) return;
			set.moves = buf.substring(i, j).split(',', 24);
			i = j + 1;

			// nature
			j = buf.indexOf('|', i);
			if (j < 0) return;
			set.nature = buf.substring(i, j);
			i = j + 1;

			// evs
			j = buf.indexOf('|', i);
			if (j < 0) return;
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
			if (j < 0) return;
			if (i !== j) set.gender = buf.substring(i, j);
			i = j + 1;

			// ivs
			j = buf.indexOf('|', i);
			if (j < 0) return;
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
			if (j < 0) return;
			if (i !== j) set.shiny = true;
			i = j + 1;

			// level
			j = buf.indexOf('|', i);
			if (j < 0) return;
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
	 * @param {AnyObject} obj
	 * @return {AnyObject}
	 */
	deepClone(obj) {
		if (typeof obj === 'function') return obj;
		if (obj === null || typeof obj !== 'object') return obj;
		if (Array.isArray(obj)) return obj.map(prop => this.deepClone(prop));
		const clone = Object.create(Object.getPrototypeOf(obj));
		const keys = Object.keys(obj);
		for (let i = 0; i < keys.length; i++) {
			clone[keys[i]] = this.deepClone(obj[keys[i]]);
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
			if (e.code !== 'MODULE_NOT_FOUND') {
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

		let modList = fs.readdirSync(MODS_DIR);
		for (let i = 0; i < modList.length; i++) {
			dexes[modList[i]] = new ModdedDex(modList[i]);
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
		this.dataCache = {};

		let basePath = (this.isBase ? DATA_DIR : MODS_DIR + '/' + this.currentMod) + '/';

		let BattleScripts = this.loadDataFile(basePath, 'Scripts');
		this.parentMod = this.isBase ? '' : (BattleScripts.inherit || 'base');

		let parentDex;
		if (this.parentMod) {
			parentDex = dexes[this.parentMod];
			if (!parentDex || parentDex === this) throw new Error("Unable to load " + this.currentMod + ". `inherit` should specify a parent mod from which to inherit data, or must be not specified.");
		}

		for (let dataType of DATA_TYPES) {
			if (dataType === 'Natures' && this.isBase) {
				this.dataCache[dataType] = BattleNatures;
				continue;
			}
			let BattleData = this.loadDataFile(basePath, dataType);
			if (!BattleData || typeof BattleData !== 'object') throw new TypeError("Exported property `Battle" + dataType + "`from `" + './data/' + DATA_FILES[dataType] + "` must be an object except `null`.");
			if (BattleData !== this.dataCache[dataType]) this.dataCache[dataType] = Object.assign(BattleData, this.dataCache[dataType]);
			if (dataType === 'Formats' && !parentDex) Object.assign(BattleData, this.formats);
		}
		this.dataCache['MoveCache'] = new Map();
		this.dataCache['ItemCache'] = new Map();
		this.dataCache['AbilityCache'] = new Map();
		this.dataCache['TemplateCache'] = new Map();
		if (!parentDex) {
			// Formats are inherited by mods
			this.includeFormats();
		} else {
			for (let dataType of DATA_TYPES) {
				const parentTypedData = parentDex.data[dataType];
				const childTypedData = this.dataCache[dataType] || (this.dataCache[dataType] = {});
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
		}

		// Flag the generation. Required for team validator.
		this.gen = this.dataCache.Scripts.gen || 7;

		// Execute initialization script.
		if (BattleScripts.init) BattleScripts.init.call(this);

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
			if (e.code !== 'MODULE_NOT_FOUND') throw e;
		}
		if (!Array.isArray(Formats)) throw new TypeError(`Exported property 'Formats' from "./config/formats.js" must be an array`);

		let section = '';
		let column = 1;
		for (let i = 0; i < Formats.length; i++) {
			let format = Formats[i];
			let id = toId(format.name);
			if (format.section) section = format.section;
			if (format.column) column = format.column;
			if (!format.name && format.section) continue;
			if (!id) throw new RangeError(`Format #${i + 1} must have a name with alphanumeric characters, not '${format.name}'`);
			if (!format.section) format.section = section;
			if (!format.column) format.column = column;
			if (this.formatsCache[id]) throw new Error(`Format #${i + 1} has a duplicate ID: '${id}'`);
			format.effectType = 'Format';
			if (format.challengeShow === undefined) format.challengeShow = true;
			if (format.searchShow === undefined) format.searchShow = true;
			if (format.tournamentShow === undefined) format.tournamentShow = true;
			if (format.mod === undefined) format.mod = 'gen6';
			if (!dexes[format.mod]) throw new Error(`Format "${format.name}" requires nonexistent mod: '${format.mod}'`);
			this.formatsCache[id] = format;
		}

		return this;
	}

	/**
	 * @param {string} id - Format ID
	 * @param {object} format - Format
	 */
	installFormat(id, format) {
		dexes['base'].includeFormats();
		// @ts-ignore
		dexes['base'].formatsCache[id] = format;
		if (this.dataCache) this.dataCache.Formats[id] = format;
		if (!this.isBase) {
			if (dexes['base'].dataCache) dexes['base'].dataCache.Formats[id] = format;
		}
	}
}

dexes['base'] = new ModdedDex();

// "gen7" is an alias for the current base data
dexes['gen7'] = dexes['base'];

module.exports = dexes['gen7'];
