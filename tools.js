/**
 * Tools
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Handles getting data about pokemon, items, etc.
 *
 * This file is used by the main process (to validate teams)
 * as well as the individual simulator processes (to get
 * information about pokemon, items, etc to simulate).
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
// shim Array.prototype.includes
if (!Array.prototype.includes) {
	Object.defineProperty(Array.prototype, 'includes', { // eslint-disable-line no-extend-native
		writable: true, configurable: true,
		value: function (object) {
			return this.indexOf(object) !== -1;
		},
	});
}

module.exports = (() => {
	let moddedTools = {};

	let dataTypes = ['Pokedex', 'FormatsData', 'Learnsets', 'Movedex', 'Statuses', 'TypeChart', 'Scripts', 'Items', 'Abilities', 'Natures', 'Formats', 'Aliases'];
	let dataFiles = {
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
	};

	let BattleNatures = dataFiles.Natures = {
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

	function tryRequire(filePath) {
		try {
			let ret = require(filePath);
			if (!ret || typeof ret !== 'object') return new TypeError("" + filePath + " must export an object except `null`, or it should be removed");
			return ret;
		} catch (e) {
			return e;
		}
	}

	function deepClone(obj) {
		if (typeof obj === 'function') return obj;
		if (obj === null || typeof obj !== 'object') return obj;
		if (Array.isArray(obj)) return obj.map(deepClone);
		const clone = Object.create(Object.getPrototypeOf(obj));
		const keys = Object.keys(obj);
		for (let i = 0; i < keys.length; i++) {
			clone[keys[i]] = deepClone(obj[keys[i]]);
		}
		return clone;
	}

	function Tools(mod) {
		if (!mod) mod = 'base';
		this.isBase = (mod === 'base');

		let path = (this.isBase ? './data/' : './mods/' + mod + '/') + dataFiles.Scripts;
		let maybeScripts = tryRequire(path);
		if (maybeScripts instanceof Error) {
			if (maybeScripts.code !== 'MODULE_NOT_FOUND') throw new Error("CRASH LOADING DATA IN " + path + ": " + maybeScripts.stack);
		} else {
			let BattleScripts = maybeScripts.BattleScripts;
			if (!BattleScripts || typeof BattleScripts !== 'object') throw new TypeError("Exported property `BattleScripts`from `./data/scripts.js` must be an object except `null`.");
			if (BattleScripts.init) Object.defineProperty(this, 'initMod', {value: BattleScripts.init, enumerable: false, writable: true, configurable: true});
			if (BattleScripts.inherit) Object.defineProperty(this, 'inheritMod', {value: BattleScripts.inherit, enumerable: false, writable: true, configurable: true});
		}
		this.currentMod = mod;
		this.parentMod = this.isBase ? '' : (this.inheritMod || 'base');
	}

	Tools.preloadMods = function () {
		if (Tools.preloadedMods) return;
		let modList = fs.readdirSync(path.resolve(__dirname, 'mods'));
		for (let i = 0; i < modList.length; i++) {
			moddedTools[modList[i]] = new Tools(modList[i]);
		}
		Tools.preloadedMods = true;
	};

	Tools.prototype.mod = function (mod) {
		if (!moddedTools[mod]) {
			mod = this.getFormat(mod).mod;
		}
		if (!mod) mod = 'base';
		return moddedTools[mod].includeData();
	};
	Tools.prototype.modData = function (dataType, id) {
		if (this.isBase) return this.data[dataType][id];
		if (this.data[dataType][id] !== moddedTools[this.parentMod].data[dataType][id]) return this.data[dataType][id];
		return (this.data[dataType][id] = deepClone(this.data[dataType][id]));
	};

	Tools.prototype.effectToString = function () {
		return this.name;
	};
	Tools.prototype.getImmunity = function (source, target) {
		// returns false if the target is immune; true otherwise
		// also checks immunity to some statuses
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
	};
	Tools.prototype.getEffectiveness = function (source, target) {
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
	};

	/**
	 * Safely ensures the passed variable is a string
	 * Simply doing '' + str can crash if str.toString crashes or isn't a function
	 * If we're expecting a string and being given anything that isn't a string
	 * or a number, it's safe to assume it's an error, and return ''
	 */
	Tools.prototype.getString = function (str) {
		if (typeof str === 'string' || typeof str === 'number') return '' + str;
		return '';
	};

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
	 * getName also enforces that there are not multiple space characters
	 * in the name, although this is not strictly necessary for safety.
	 */
	Tools.prototype.getName = function (name) {
		if (typeof name !== 'string' && typeof name !== 'number') return '';
		name = ('' + name).replace(/[\|\s\[\]\,\u202e]+/g, ' ').trim();
		if (name.length > 18) name = name.substr(0, 18).trim();

		// remove zalgo
		name = name.replace(/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g, '');
		name = name.replace(/[\u239b-\u23b9]/g, '');

		return name;
	};

	/**
	 * Converts anything to an ID. An ID must have only lowercase alphanumeric
	 * characters.
	 * If a string is passed, it will be converted to lowercase and
	 * non-alphanumeric characters will be stripped.
	 * If an object with an ID is passed, its ID will be returned.
	 * Otherwise, an empty string will be returned.
	 */
	Tools.prototype.getId = function (text) {
		if (text && text.id) {
			text = text.id;
		} else if (text && text.userid) {
			text = text.userid;
		}
		if (typeof text !== 'string' && typeof text !== 'number') return '';
		return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
	};
	let toId = Tools.prototype.getId;

	Tools.prototype.getSpecies = function (species) {
		let id = toId(species || '');
		let template = this.getTemplate(id);
		if (template.otherForms && template.otherForms.indexOf(id) >= 0) {
			let form = id.slice(template.species.length);
			species = template.species + '-' + form[0].toUpperCase() + form.slice(1);
		} else {
			species = template.species;
		}
		return species;
	};

	Tools.prototype.getTemplate = function (template) {
		if (!template || typeof template === 'string') {
			let name = (template || '').trim();
			let id = toId(name);
			if (id !== 'constructor' && this.data.Aliases[id]) {
				name = this.data.Aliases[id];
				id = toId(name);
			}
			if (!this.data.Pokedex[id]) {
				if (id.startsWith('mega') && this.data.Pokedex[id.slice(4) + 'mega']) {
					id = id.slice(4) + 'mega';
				} else if (id.startsWith('m') && this.data.Pokedex[id.slice(1) + 'mega']) {
					id = id.slice(1) + 'mega';
				} else if (id.startsWith('primal') && this.data.Pokedex[id.slice(6) + 'primal']) {
					id = id.slice(6) + 'primal';
				} else if (id.startsWith('p') && this.data.Pokedex[id.slice(1) + 'primal']) {
					id = id.slice(1) + 'primal';
				}
			}
			template = {};
			if (id && id !== 'constructor' && this.data.Pokedex[id]) {
				template = this.data.Pokedex[id];
				if (template.cached) return template;
				template.cached = true;
				template.exists = true;
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
		}
		return template;
	};
	Tools.prototype.getMove = function (move) {
		if (!move || typeof move === 'string') {
			let name = (move || '').trim();
			let id = toId(name);
			if (this.data.Aliases[id]) {
				name = this.data.Aliases[id];
				id = toId(name);
			}
			move = {};
			if (id.substr(0, 11) === 'hiddenpower') {
				let matches = /([a-z]*)([0-9]*)/.exec(id);
				id = matches[1];
			}
			if (id && id !== 'constructor' && this.data.Movedex[id]) {
				move = this.data.Movedex[id];
				if (move.cached) return move;
				move.cached = true;
				move.exists = true;
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
		}
		return move;
	};
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
	Tools.prototype.getMoveCopy = function (move) {
		if (move && move.isCopy) return move;
		move = this.getMove(move);
		let moveCopy = deepClone(move);
		moveCopy.isCopy = true;
		return moveCopy;
	};
	Tools.prototype.getEffect = function (effect) {
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
	};
	Tools.prototype.getFormat = function (effect) {
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
	};
	Tools.prototype.getItem = function (item) {
		if (!item || typeof item === 'string') {
			let name = (item || '').trim();
			let id = toId(name);
			if (this.data.Aliases[id]) {
				name = this.data.Aliases[id];
				id = toId(name);
			}
			if (id && !this.data.Items[id] && this.data.Items[id + 'berry']) {
				id += 'berry';
			}
			item = {};
			if (id && id !== 'constructor' && this.data.Items[id]) {
				item = this.data.Items[id];
				if (item.cached) return item;
				item.cached = true;
				item.exists = true;
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
		}
		return item;
	};
	Tools.prototype.getAbility = function (ability) {
		if (!ability || typeof ability === 'string') {
			let name = (ability || '').trim();
			let id = toId(name);
			ability = {};
			if (id && id !== 'constructor' && this.data.Abilities[id]) {
				ability = this.data.Abilities[id];
				if (ability.cached) return ability;
				ability.cached = true;
				ability.exists = true;
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
		}
		return ability;
	};
	Tools.prototype.getType = function (type) {
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
	};
	Tools.prototype.getNature = function (nature) {
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
	};
	Tools.prototype.natureModify = function (stats, nature) {
		nature = this.getNature(nature);
		if (nature.plus) stats[nature.plus] *= 1.1;
		if (nature.minus) stats[nature.minus] *= 0.9;
		return stats;
	};

	Tools.prototype.getBanlistTable = function (format, subformat, depth) {
		let banlistTable;
		if (!depth) depth = 0;
		if (depth > 8) return; // avoid infinite recursion
		if (format.banlistTable && !subformat) {
			banlistTable = format.banlistTable;
		} else {
			if (!format.banlistTable) format.banlistTable = {};
			if (!format.setBanTable) format.setBanTable = [];
			if (!format.teamBanTable) format.teamBanTable = [];

			banlistTable = format.banlistTable;
			if (!subformat) subformat = format;
			if (subformat.banlist) {
				for (let i = 0; i < subformat.banlist.length; i++) {
					// don't revalidate what we already validate
					if (banlistTable[toId(subformat.banlist[i])]) continue;

					banlistTable[subformat.banlist[i]] = subformat.name || true;
					banlistTable[toId(subformat.banlist[i])] = subformat.name || true;

					let complexList;
					if (subformat.banlist[i].includes('+')) {
						if (subformat.banlist[i].includes('++')) {
							complexList = subformat.banlist[i].split('++');
							for (let j = 0; j < complexList.length; j++) {
								complexList[j] = toId(complexList[j]);
							}
							format.teamBanTable.push(complexList);
						} else {
							complexList = subformat.banlist[i].split('+');
							for (let j = 0; j < complexList.length; j++) {
								complexList[j] = toId(complexList[j]);
							}
							format.setBanTable.push(complexList);
						}
					}
				}
			}
			if (subformat.ruleset) {
				for (let i = 0; i < subformat.ruleset.length; i++) {
					// don't revalidate what we already validate
					if (banlistTable['Rule:' + toId(subformat.ruleset[i])]) continue;

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
	};

	Tools.prototype.shuffle = function (arr) {
		// In-place shuffle by Fisher-Yates algorithm
		for (let i = arr.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
		}
		return arr;
	};

	Tools.prototype.levenshtein = function (s, t, l) { // s = string 1, t = string 2, l = limit
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
	};

	Tools.prototype.clampIntRange = function (num, min, max) {
		if (typeof num !== 'number') num = 0;
		num = Math.floor(num);
		if (num < min) num = min;
		if (max !== undefined && num > max) num = max;
		return num;
	};

	Tools.prototype.escapeHTML = function (str) {
		if (!str) return '';
		return ('' + str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\//g, '&#x2f;');
	};

	Tools.prototype.html = function (strings) {
		let buf = strings[0];
		for (let i = 1; i < arguments.length; i++) {
			buf += moddedTools.base.escapeHTML(arguments[i]);
			buf += strings[i];
		}
		return buf;
	};
	Tools.prototype.plural = function (num, plural, singular) {
		if (!plural) plural = 's';
		if (!singular) singular = '';
		if (num && typeof num.length === 'number') {
			num = num.length;
		} else if (num && typeof num.size === 'number') {
			num = num.size;
		} else {
			num = Number(num);
		}
		return (num !== 1 ? plural : singular);
	};

	Tools.prototype.toTimeStamp = function (date, options) {
		// Return a timestamp in the form {yyyy}-{MM}-{dd} {hh}:{mm}:{ss}.
		// Optionally reports hours in mod-12 format.
		const isHour12 = options && options.hour12;
		let parts = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
		if (isHour12) {
			parts.push(parts[3] >= 12 ? 'pm' : 'am');
			parts[3] = parts[3] % 12 || 12;
		}
		parts = parts.map(val => val < 10 ? '0' + val : '' + val);
		return parts.slice(0, 3).join("-") + " " + parts.slice(3, 6).join(":") + (isHour12 ? " " + parts[6] : "");
	};

	Tools.prototype.toDurationString = function (number, options) {
		// TODO: replace by Intl.DurationFormat or equivalent when it becomes available (ECMA-402)
		// https://github.com/tc39/ecma402/issues/47
		const date = new Date(+number);
		const parts = [date.getUTCFullYear() - 1970, date.getUTCMonth(), date.getUTCDate() - 1, date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()];
		const unitNames = ["second", "minute", "hour", "day", "month", "year"];
		const positiveIndex = parts.findIndex(elem => elem > 0);
		if (options && options.hhmmss) {
			let string = parts.slice(positiveIndex).map(value => value < 10 ? "0" + value : "" + value).join(":");
			return string.length === 2 ? "00:" + string : string;
		}
		return parts.slice(positiveIndex).reverse().map((value, index) => value ? value + " " + unitNames[index] + (value > 1 ? "s" : "") : "").reverse().join(" ").trim();
	};

	Tools.prototype.dataSearch = function (target, searchIn, isInexact) {
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
	};

	Tools.prototype.packTeam = function (team) {
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
			let template = moddedTools.base.getTemplate(set.species || set.name);
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
	};

	Tools.prototype.fastUnpackTeam = function (buf) {
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
			let template = moddedTools.base.getTemplate(set.species);
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
	};

	Tools.prototype.includeMods = function () {
		if (this.modsLoaded) return this;
		if (!this.isLoaded) this.includeData();

		for (let id in moddedTools) {
			if (moddedTools[id].isLoaded) continue;
			moddedTools[id].includeData();
		}

		return this;
	};

	Tools.prototype.includeData = function () {
		if (this.isLoaded) return this;
		if (!this.data) this.data = {mod: this.currentMod};
		let data = this.data;

		let basePath = './data/';
		let parentTools;
		if (this.parentMod) {
			parentTools = moddedTools[this.parentMod];
			if (!parentTools || parentTools === this) throw new Error("Unable to load " + this.currentMod + ". `inherit` should specify a parent mod from which to inherit data, or must be not specified.");
			if (!parentTools.isLoaded) parentTools.includeData();
			basePath = './mods/' + this.currentMod + '/';
		}

		for (let dataType of dataTypes) {
			if (typeof dataFiles[dataType] !== 'string') {
				data[dataType] = dataFiles[dataType];
				continue;
			}
			if (dataType === 'Natures') {
				if (data.mod === 'base') data[dataType] = BattleNatures;
				continue;
			}
			let maybeData = tryRequire(basePath + dataFiles[dataType]);
			if (maybeData instanceof Error) {
				if (maybeData.code !== 'MODULE_NOT_FOUND') throw new Error("CRASH LOADING " + data.mod.toUpperCase() + " DATA in " + basePath + dataFiles[dataType] + ":\n" + maybeData.stack);
				maybeData['Battle' + dataType] = {}; // Fall back to an empty object
			}
			let BattleData = maybeData['Battle' + dataType];
			if (!BattleData || typeof BattleData !== 'object') throw new TypeError("Exported property `Battle" + dataType + "`from `" + './data/' + dataFiles[dataType] + "` must be an object except `null`.");
			if (BattleData !== data[dataType]) data[dataType] = Object.assign(BattleData, data[dataType]);
		}
		if (this.isBase) {
			// Formats are inherited by mods
			this.includeFormats();
		} else {
			for (let dataType of dataTypes) {
				const parentTypedData = parentTools.data[dataType];
				const childTypedData = data[dataType] || (data[dataType] = {});
				for (let entryId in parentTypedData) {
					if (childTypedData[entryId] === null) {
						// null means don't inherit
						delete childTypedData[entryId];
					} else if (!(entryId in childTypedData)) {
						// If it doesn't exist it's inherited from the parent data
						if (dataType === 'Pokedex') {
							// Pokedex entries can be modified too many different ways
							childTypedData[entryId] = deepClone(parentTypedData[entryId]);
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
		this.gen = data.Scripts.gen || 6;

		// Execute initialization script.
		if (typeof this.initMod === 'function') this.initMod();

		this.isLoaded = true;
		return this;
	};

	Tools.prototype.includeFormats = function () {
		if (this.formatsLoaded) return this;
		Tools.preloadMods();

		if (!this.data) this.data = {mod: this.currentMod};
		if (!this.data.Formats) this.data.Formats = {};

		// Load [formats] aliases
		let maybeAliases = tryRequire('./data/' + dataFiles.Aliases);
		if (maybeAliases instanceof Error) {
			if (maybeAliases.code !== 'MODULE_NOT_FOUND') throw new Error("CRASH LOADING ALIASES:\n" + maybeAliases.stack);
			maybeAliases.BattleAliases = {}; // Fall back to an empty object
		}
		let BattleAliases = maybeAliases.BattleAliases;
		if (!BattleAliases || typeof BattleAliases !== 'object') throw new TypeError("Exported property `BattleAliases`from `" + "./data/aliases.js` must be an object except `null`.");
		this.data.Aliases = BattleAliases;

		// Load formats
		let maybeFormats = tryRequire('./config/formats');
		if (maybeFormats instanceof Error) {
			if (maybeFormats.code !== 'MODULE_NOT_FOUND') throw new Error("CRASH LOADING FORMATS:\n" + maybeFormats.stack);
		}
		let BattleFormats = maybeFormats.Formats;
		if (!Array.isArray(BattleFormats)) throw new TypeError("Exported property `Formats`from `" + "./config/formats.js" + "` must be an array.");

		for (let i = 0; i < BattleFormats.length; i++) {
			let format = BattleFormats[i];
			let id = toId(format.name);
			if (!id) throw new RangeError("Format #" + (i + 1) + " must have a name with alphanumeric characters");
			if (this.data.Formats[id]) throw new Error("Format #" + (i + 1) + " has a duplicate ID: `" + id + "`");
			format.effectType = 'Format';
			if (format.challengeShow === undefined) format.challengeShow = true;
			if (format.searchShow === undefined) format.searchShow = true;
			if (format.tournamentShow === undefined) format.tournamentShow = true;
			if (format.mod === undefined) format.mod = 'base';
			if (!moddedTools[format.mod]) throw new Error("Format `" + format.name + "` requires nonexistent mod: `" + format.mod + "`");
			this.installFormat(id, format);
		}

		this.formatsLoaded = true;
		return this;
	};

	Tools.prototype.installFormat = function (id, format) {
		this.data.Formats[id] = format;
		if (!this.isBase) {
			moddedTools.base.data.Formats[id] = format;
		}
	};

	/**
	 * Install our Tools functions into the battle object
	 */
	Tools.prototype.install = function (battle) {
		for (let i in this.data.Scripts) {
			battle[i] = this.data.Scripts[i];
		}
	};

	moddedTools.base = new Tools();

	// "gen6" is an alias for the current base data
	moddedTools.gen6 = moddedTools.base;

	Object.getPrototypeOf(moddedTools.base).moddedTools = moddedTools;

	return moddedTools.base;
})();
