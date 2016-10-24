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
 *   As above, but will also populate Dex.data.Formats, giving an object
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
 * @license MIT license
 */

'use strict';

const fs = require('fs');
const path = require('path');

// shim Object.values
if (!Object.values) {
	Object.values = function (object) {
		let values = [];
		for (let k in object) values.push(object[k]);
		return values;
	};
}

let dexes = {};

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

function toId(text) {
	// this is a duplicate of Dex.getId, for performance reasons
	if (text && text.id) {
		text = text.id;
	} else if (text && text.userid) {
		text = text.userid;
	}
	if (typeof text !== 'string' && typeof text !== 'number') return '';
	return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

class BattleDex {

	constructor(mod) {
		if (!mod) mod = 'base';

		this.formatsLoaded = false;
		this.modsLoaded = false;
		this.dataLoaded = false;

		this.isBase = (mod === 'base');
		this.currentMod = mod;
		this.parentMod = '';
		this.data = null;
		this.dexes = dexes;
	}

	mod(mod) {
		if (!dexes['base'].modsLoaded) dexes['base'].includeMods();
		if (!mod) mod = 'base';
		return dexes[mod].includeData();
	}
	format(format) {
		if (!this.modsLoaded) this.includeMods();
		const mod = this.getFormat(format).mod;
		if (!mod) return dexes['base'].includeData();
		return dexes[mod].includeData();
	}
	modData(dataType, id) {
		if (this.isBase) return this.data[dataType][id];
		if (this.data[dataType][id] !== dexes[this.parentMod].data[dataType][id]) return this.data[dataType][id];
		return (this.data[dataType][id] = this.deepClone(this.data[dataType][id]));
	}

	effectToString() {
		return this.name;
	}

	/**
	 * Safely converts the passed variable into a string. Unlike '' + str,
	 * String(str), or str.toString(), Tools.getString is guaranteed not to
	 * crash.
	 *
	 * The other methods of casting to string can crash if str.toString crashes
	 * or isn't a function. Instead, Tools.getString simply returns '' if the
	 * passed variable isn't a string or a number.
	 *
	 * @param {mixed} str
	 * @return {string}
	 */
	getString(str) {
		if (typeof str === 'string' || typeof str === 'number') return '' + str;
		return '';
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
	 * @param {mixed} name
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
	 * Converts anything to an ID. An ID must have only lowercase alphanumeric
	 * characters.
	 * If a string is passed, it will be converted to lowercase and
	 * non-alphanumeric characters will be stripped.
	 * If an object with an ID is passed, its ID will be returned.
	 * Otherwise, an empty string will be returned.
	 *
	 * Tools.getId is generally assigned to the global toId, because of how
	 * commonly it's used.
	 *
	 * @param {mixed} text
	 * @return {string}
	 */
	getId(text) {
		if (text && text.id) {
			text = text.id;
		} else if (text && text.userid) {
			text = text.userid;
		}
		if (typeof text !== 'string' && typeof text !== 'number') return '';
		return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
	}

	/**
	 * returns false if the target is immune; true otherwise
	 *
	 * also checks immunity to some statuses
	 */
	getImmunity(source, target) {
		let sourceType = source.type || source;
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
	getEffectiveness(source, target) {
		let sourceType = source.type || source;
		let totalTypeMod = 0;
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
	 * form name (which is the main way Tools.getSpecies(id) differs from
	 * Tools.getTemplate(id).species).
	 *
	 * @param {string|DexTemplate} species
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

	getTemplate(template) {
		if (!template || typeof template === 'string') {
			let name = (template || '').trim();
			let id = toId(name);
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
			if (!template.tier) template.tier = 'Illegal';
			if (!template.gen) {
				if (template.forme && template.forme in {'Mega':1, 'Mega-X':1, 'Mega-Y':1}) {
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
	getLearnset(template) {
		const id = toId(template);
		if (!this.data.Learnsets[id]) return null;
		return this.data.Learnsets[id].learnset;
	}
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
				if (move.num >= 560) {
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
	 *     moveCopy === Tools.getMoveCopy(moveCopy)
	 *
	 * If you really want to, use:
	 *     moveCopyCopy = Tools.getMoveCopy(moveCopy.id)
	 *
	 * @param  move    Move ID, move object, or movecopy object describing move to copy
	 * @return         movecopy object
	 */
	getMoveCopy(move) {
		if (move && move.isCopy) return move;
		move = this.getMove(move);
		let moveCopy = this.deepClone(move);
		moveCopy.isCopy = true;
		return moveCopy;
	}
	getEffect(effect) {
		if (!effect || typeof effect === 'string') {
			let name = (effect || '').trim();
			let id = toId(name);
			effect = {};
			if (id && this.data.Statuses[id]) {
				effect = this.data.Statuses[id];
				effect.name = effect.name || this.data.Statuses[id].name;
			} else if (id && this.data.Movedex[id] && this.data.Movedex[id].effect) {
				effect = this.data.Movedex[id].effect;
				effect.name = effect.name || this.data.Movedex[id].name;
			} else if (id && this.data.Abilities[id] && this.data.Abilities[id].effect) {
				effect = this.data.Abilities[id].effect;
				effect.name = effect.name || this.data.Abilities[id].name;
			} else if (id && this.data.Items[id] && this.data.Items[id].effect) {
				effect = this.data.Items[id].effect;
				effect.name = effect.name || this.data.Items[id].name;
			} else if (id && this.data.Formats[id]) {
				effect = this.data.Formats[id];
				effect.name = effect.name || this.data.Formats[id].name;
				if (!effect.mod) effect.mod = 'base';
				if (!effect.effectType) effect.effectType = 'Format';
			} else if (id === 'recoil') {
				effect = {
					effectType: 'Recoil',
				};
			} else if (id === 'drain') {
				effect = {
					effectType: 'Drain',
				};
			}
			if (!effect.id) effect.id = id;
			if (!effect.name) effect.name = name;
			if (!effect.fullname) effect.fullname = effect.name;
			effect.toString = this.effectToString;
			if (!effect.category) effect.category = 'Effect';
			if (!effect.effectType) effect.effectType = 'Effect';
		}
		return effect;
	}
	getFormat(effect) {
		if (!effect || typeof effect === 'string') {
			let name = (effect || '').trim();
			let id = toId(name);
			if (this.data.Aliases[id]) {
				name = this.data.Aliases[id];
				id = toId(name);
			}
			effect = {};
			if (id && this.data.Formats[id]) {
				effect = this.data.Formats[id];
				if (effect.cached) return effect;
				effect.cached = true;
				effect.name = effect.name || this.data.Formats[id].name;
				if (!effect.mod) effect.mod = 'base';
				if (!effect.effectType) effect.effectType = 'Format';
			}
			if (!effect.id) effect.id = id;
			if (!effect.name) effect.name = name;
			if (!effect.fullname) effect.fullname = effect.name;
			effect.toString = this.effectToString;
			if (!effect.category) effect.category = 'Effect';
			if (!effect.effectType) effect.effectType = 'Effect';
		}
		return effect;
	}
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
			if (item.onPlate) item.fling = {basePower: 90};
			if (item.onDrive) item.fling = {basePower: 70};
			if (item.megaStone) item.fling = {basePower: 80};
			if (!item.gen) {
				if (item.num >= 577) {
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
				if (ability.num >= 165) {
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
	natureModify(stats, nature) {
		nature = this.getNature(nature);
		if (nature.plus) stats[nature.plus] *= 1.1;
		if (nature.minus) stats[nature.minus] *= 0.9;
		return stats;
	}

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

	levenshtein(s, t, l) { // s = string 1, t = string 2, l = limit
		// Original levenshtein distance function by James Westgate, turned out to be the fastest
		let d = []; // 2d matrix

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

	clampIntRange(num, min, max) {
		if (typeof num !== 'number') num = 0;
		num = Math.floor(num);
		if (num < min) num = min;
		if (max !== undefined && num > max) num = max;
		return num;
	}

	dataSearch(target, searchIn, isInexact) {
		if (!target) {
			return false;
		}

		searchIn = searchIn || ['Pokedex', 'Movedex', 'Abilities', 'Items', 'Natures'];

		let searchFunctions = {Pokedex: 'getTemplate', Movedex: 'getMove', Abilities: 'getAbility', Items: 'getItem', Natures: 'getNature'};
		let searchTypes = {Pokedex: 'pokemon', Movedex: 'move', Abilities: 'ability', Items: 'item', Natures: 'nature'};
		let searchResults = [];
		for (let i = 0; i < searchIn.length; i++) {
			let res = this[searchFunctions[searchIn[i]]](target);
			if (res.exists) {
				searchResults.push({
					exactMatch: !isInexact,
					searchType: searchTypes[searchIn[i]],
					name: res.name,
				});
			}
		}
		if (searchResults.length) {
			return searchResults;
		}

		let cmpTarget = target.toLowerCase();
		let maxLd = 3;
		if (cmpTarget.length <= 1) {
			return false;
		} else if (cmpTarget.length <= 4) {
			maxLd = 1;
		} else if (cmpTarget.length <= 6) {
			maxLd = 2;
		}
		for (let i = 0; i < searchIn.length; i++) {
			let searchObj = this.data[searchIn[i]];
			if (!searchObj) {
				continue;
			}

			for (let j in searchObj) {
				let word = searchObj[j];
				if (typeof word === "object") {
					word = word.name || word.species;
				}
				if (!word) {
					continue;
				}

				let ld = this.levenshtein(cmpTarget, word.toLowerCase(), maxLd);
				if (ld <= maxLd) {
					searchResults.push({word: word, ld: ld});
				}
			}
		}

		if (searchResults.length) {
			let newTarget = "";
			let newLD = 10;
			for (let i = 0, l = searchResults.length; i < l; i++) {
				if (searchResults[i].ld < newLD) {
					newTarget = searchResults[i];
					newLD = searchResults[i].ld;
				}
			}

			// To make sure we aren't in an infinite loop...
			if (cmpTarget !== newTarget.word) {
				return this.dataSearch(newTarget.word, null, true);
			}
		}

		return false;
	}

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
		}

		return buf;
	}

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
			set.moves = buf.substring(i, j).split(',');
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
				let evs = buf.substring(i, j).split(',');
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
				let ivs = buf.substring(i, j).split(',');
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
			if (j < 0) {
				if (buf.substring(i)) {
					set.happiness = Number(buf.substring(i));
				}
				break;
			}
			if (i !== j) set.happiness = Number(buf.substring(i, j));
			i = j + 1;
		}

		return team;
	}

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

	includeMods() {
		if (!this.isBase) throw new Error("This must be called on the base Dex.");
		if (this.modsLoaded) return this;

		let modList = fs.readdirSync(path.resolve(__dirname, 'mods'));
		for (let i = 0; i < modList.length; i++) {
			dexes[modList[i]] = new BattleDex(modList[i]);
		}
		this.modsLoaded = true;

		return this;
	}

	includeModData() {
		this.includeMods();
		for (const mod in dexes) {
			dexes[mod].includeData();
		}
	}

	includeData() {
		if (this.dataLoaded) return this;
		dexes['base'].includeMods();
		if (!this.data) this.data = {mod: this.currentMod};

		let basePath = this.isBase ? './data/' : './mods/' + this.currentMod + '/';

		let BattleScripts = this.loadDataFile(basePath, 'Scripts');
		this.parentMod = this.isBase ? '' : (BattleScripts.inherit || 'base');

		let parentDex;
		if (this.parentMod) {
			parentDex = dexes[this.parentMod];
			if (!parentDex || parentDex === this) throw new Error("Unable to load " + this.currentMod + ". `inherit` should specify a parent mod from which to inherit data, or must be not specified.");
			parentDex.includeData();
		}

		for (let dataType of DATA_TYPES) {
			if (dataType === 'Natures' && this.isBase) {
				this.data[dataType] = BattleNatures;
				continue;
			}
			let BattleData = this.loadDataFile(basePath, dataType);
			if (!BattleData || typeof BattleData !== 'object') throw new TypeError("Exported property `Battle" + dataType + "`from `" + './data/' + DATA_FILES[dataType] + "` must be an object except `null`.");
			if (BattleData !== this.data[dataType]) this.data[dataType] = Object.assign(BattleData, this.data[dataType]);
		}
		this.data['MoveCache'] = new Map();
		this.data['ItemCache'] = new Map();
		this.data['AbilityCache'] = new Map();
		this.data['TemplateCache'] = new Map();
		if (this.isBase) {
			// Formats are inherited by mods
			this.includeFormats();
		} else {
			for (let dataType of DATA_TYPES) {
				const parentTypedData = parentDex.data[dataType];
				const childTypedData = this.data[dataType] || (this.data[dataType] = {});
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
		this.gen = this.data.Scripts.gen || 6;

		// Execute initialization script.
		if (BattleScripts.init) BattleScripts.init.call(this);

		this.dataLoaded = true;
		return this;
	}

	includeFormats() {
		this.includeMods();
		if (this.formatsLoaded) return this;

		if (!this.data) this.data = {mod: this.currentMod};
		if (!this.data.Formats) this.data.Formats = {};

		// Load [formats] aliases
		let BattleAliases = this.loadDataFile('./data/', 'Aliases');
		this.data.Aliases = BattleAliases;

		// Load formats
		let Formats;
		try {
			Formats = require('./config/formats').Formats;
		} catch (e) {
			if (e.code !== 'MODULE_NOT_FOUND') throw e;
		}
		if (!Array.isArray(Formats)) throw new TypeError("Exported property `Formats` from `" + "./config/formats.js" + "` must be an array.");

		for (let i = 0; i < Formats.length; i++) {
			let format = Formats[i];
			let id = toId(format.name);
			if (!id) throw new RangeError("Format #" + (i + 1) + " must have a name with alphanumeric characters");
			if (this.data.Formats[id]) throw new Error("Format #" + (i + 1) + " has a duplicate ID: `" + id + "`");
			format.effectType = 'Format';
			if (format.challengeShow === undefined) format.challengeShow = true;
			if (format.searchShow === undefined) format.searchShow = true;
			if (format.tournamentShow === undefined) format.tournamentShow = true;
			if (format.mod === undefined) format.mod = 'base';
			if (!dexes[format.mod]) throw new Error("Format `" + format.name + "` requires nonexistent mod: `" + format.mod + "`");
			this.installFormat(id, format);
		}

		this.formatsLoaded = true;
		return this;
	}

	installFormat(id, format) {
		this.data.Formats[id] = format;
		if (!this.isBase) {
			dexes['base'].data.Formats[id] = format;
		}
	}

	/**
	 * Install our Tools functions into the battle object
	 */
	install(battle) {
		for (let i in this.data.Scripts) {
			battle[i] = this.data.Scripts[i];
		}
	}
}

dexes['base'] = new BattleDex();
dexes['base'].BattleDex = BattleDex;

// "gen6" is an alias for the current base data
dexes['gen6'] = dexes['base'];

module.exports = dexes['gen6'];
