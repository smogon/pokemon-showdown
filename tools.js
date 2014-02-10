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

module.exports = (function () {
	var moddedTools = {};

	var dataTypes = ['FormatsData', 'Learnsets', 'Pokedex', 'Movedex', 'Statuses', 'TypeChart', 'Scripts', 'Items', 'Abilities', 'Formats', 'Aliases'];
	var dataFiles = {
		'Pokedex': 'pokedex.js',
		'Movedex': 'moves.js',
		'Statuses': 'statuses.js',
		'TypeChart': 'typechart.js',
		'Scripts': 'scripts.js',
		'Items': 'items.js',
		'Abilities': 'abilities.js',
		'Formats': 'rulesets.js',
		'FormatsData': 'formats-data.js',
		'Learnsets': 'learnsets.js',
		'Aliases': 'aliases.js'
	};
	function Tools(mod, parentMod) {
		if (!mod) {
			mod = 'base';
			this.isBase = true;
		} else if (!parentMod) {
			parentMod = 'base';
		}
		this.currentMod = mod;

		var data = this.data = {
			mod: mod
		};
		if (mod === 'base') {
			dataTypes.forEach(function(dataType) {
				try {
					var path = './data/' + dataFiles[dataType];
					if (fs.existsSync(path)) {
						data[dataType] = require(path)['Battle' + dataType];
					}
				} catch (e) {
					console.log('CRASH LOADING DATA: '+e.stack);
				}
				if (!data[dataType]) data[dataType] = {};
			}, this);
			try {
				var path = './config/formats.js';
				if (fs.existsSync(path)) {
					var configFormats = require(path).Formats;
					for (var i=0; i<configFormats.length; i++) {
						var format = configFormats[i];
						var id = toId(format.name);
						format.effectType = 'Format';
						if (format.challengeShow === undefined) format.challengeShow = true;
						if (format.searchShow === undefined) format.searchShow = true;
						data.Formats[id] = format;
					}
				}
			} catch (e) {
				console.log('CRASH LOADING FORMATS: '+e.stack);
			}
		} else {
			var parentData = moddedTools[parentMod].data;
			dataTypes.forEach(function(dataType) {
				try {
					var path = './mods/' + mod + '/' + dataFiles[dataType];
					if (fs.existsSync(path)) {
						data[dataType] = require(path)['Battle' + dataType];
					}
				} catch (e) {
					console.log('CRASH LOADING MOD DATA: '+e.stack);
				}
				if (!data[dataType]) data[dataType] = {};
				for (var i in parentData[dataType]) {
					if (data[dataType][i] === null) {
						// null means don't inherit
						delete data[dataType][i];
					} else if (!(i in data[dataType])) {
						// If it doesn't exist it's inherited from the parent data
						if (dataType === 'Pokedex') {
							// Pokedex entries can be modified too many different ways
							data[dataType][i] = Object.clone(parentData[dataType][i], true);
						} else {
							data[dataType][i] = parentData[dataType][i];
						}
					} else if (data[dataType][i] && data[dataType][i].inherit) {
						// {inherit: true} can be used to modify only parts of the parent data,
						// instead of overwriting entirely
						delete data[dataType][i].inherit;
						Object.merge(data[dataType][i], parentData[dataType][i], true, false);
					}
				}
			});
		}
	}

	Tools.prototype.mod = function(mod) {
		if (!moddedTools[mod]) {
			mod = this.getFormat(mod).mod;
		}
		if (!mod) mod = 'base';
		return moddedTools[mod];
	};
	Tools.prototype.modData = function(dataType, id) {
		if (this.isBase) return this.data[dataType][id];
		if (this.data[dataType][id] !== moddedTools.base.data[dataType][id]) return this.data[dataType][id];
		return this.data[dataType][id] = Object.clone(this.data[dataType][id], true);
	};

	Tools.prototype.effectToString = function() {
		return this.name;
	};
	Tools.prototype.getImmunity = function(type, target) {
		var types = target.getTypes && target.getTypes() || target.types;
		for (var i=0; i<types.length; i++) {
			if (this.data.TypeChart[types[i]] && this.data.TypeChart[types[i]].damageTaken && this.data.TypeChart[types[i]].damageTaken[type] === 3) {
				return false;
			}
		}
		return true;
	};
	Tools.prototype.getEffectiveness = function(source, target, pokemon) {
		if (source.getEffectiveness) {
			return source.getEffectiveness.call(this, source, target, pokemon);
		}
		var type = source.type || source;
		var totalTypeMod = 0;
		var targetTypes = target.getTypes && target.getTypes() || target.types;
		for (var i=0; i<targetTypes.length; i++) {
			if (!this.data.TypeChart[targetTypes[i]]) continue;
			var typeMod = this.data.TypeChart[targetTypes[i]].damageTaken[type];
			if (typeMod === 1) { // super-effective
				totalTypeMod++;
			}
			if (typeMod === 2) { // resist
				totalTypeMod--;
			}
			// in case of weird situations like Gravity, immunity is
			// handled elsewhere
		}
		return totalTypeMod;
	};
	Tools.prototype.getTemplate = function(template) {
		if (!template || typeof template === 'string') {
			var name = (template||'').trim();
			var id = toId(name);
			if (this.data.Aliases[id]) {
				name = this.data.Aliases[id];
				id = toId(name);
			}
			template = {};
			if (id && this.data.Pokedex[id]) {
				template = this.data.Pokedex[id];
				if (template.cached) return template;
				template.cached = true;
				template.exists = true;
			}
			name = template.species || template.name || name;
			if (this.data.FormatsData[id]) {
				Object.merge(template, this.data.FormatsData[id]);
			}
			if (this.data.Learnsets[id]) {
				Object.merge(template, this.data.Learnsets[id]);
			}
			if (!template.id) template.id = id;
			if (!template.name) template.name = name;
			if (!template.speciesid) template.speciesid = id;
			if (!template.species) template.species = name;
			if (!template.baseSpecies) template.baseSpecies = name;
			if (!template.forme) template.forme = '';
			if (!template.formeLetter) template.formeLetter = '';
			if (!template.spriteid) template.spriteid = toId(template.baseSpecies)+(template.baseSpecies!==name?'-'+toId(template.forme):'');
			if (!template.prevo) template.prevo = '';
			if (!template.evos) template.evos = [];
			if (!template.nfe) template.nfe = !!template.evos.length;
			if (!template.gender) template.gender = '';
			if (!template.genderRatio && template.gender === 'M') template.genderRatio = {M:1,F:0};
			if (!template.genderRatio && template.gender === 'F') template.genderRatio = {M:0,F:1};
			if (!template.genderRatio && template.gender === 'N') template.genderRatio = {M:0,F:0};
			if (!template.genderRatio) template.genderRatio = {M:0.5,F:0.5};
			if (!template.tier && template.baseSpecies !== template.species) template.tier = this.data.FormatsData[toId(template.baseSpecies)].tier;
			if (!template.tier) template.tier = 'Illegal';
			if (!template.gen) {
				if (template.forme && template.forme in {'Mega':1,'Mega-X':1,'Mega-Y':1}) {
					template.gen = 6;
					template.isMega = true;
				} else if (template.num >= 650) template.gen = 6;
				else if (template.num >= 494) template.gen = 5;
				else if (template.num >= 387) template.gen = 4;
				else if (template.num >= 252) template.gen = 3;
				else if (template.num >= 152) template.gen = 2;
				else if (template.num >= 1) template.gen = 1;
				else template.gen = 0;
			}
		}
		return template;
	};
	Tools.prototype.getMove = function(move) {
		if (!move || typeof move === 'string') {
			var name = (move||'').trim();
			var id = toId(name);
			if (this.data.Aliases[id]) {
				name = this.data.Aliases[id];
				id = toId(name);
			}
			move = {};
			if (id.substr(0,11) === 'hiddenpower') {
				var matches = /([a-z]*)([0-9]*)/.exec(id);
				id = matches[1];
			}
			if (id && this.data.Movedex[id]) {
				move = this.data.Movedex[id];
				if (move.cached) return move;
				move.cached = true;
				move.exists = true;
			}
			if (!move.id) move.id = id;
			if (!move.name) move.name = name;
			if (!move.fullname) move.fullname = 'move: '+move.name;
			move.toString = this.effectToString;
			if (!move.critRatio) move.critRatio = 1;
			if (!move.baseType) move.baseType = move.type;
			if (!move.effectType) move.effectType = 'Move';
			if (!move.secondaries && move.secondary) move.secondaries = [move.secondary];
			if (!move.gen) {
				if (move.num >= 560) move.gen = 6;
				else if (move.num >= 468) move.gen = 5;
				else if (move.num >= 355) move.gen = 4;
				else if (move.num >= 252) move.gen = 3;
				else if (move.num >= 166) move.gen = 2;
				else if (move.num >= 1) move.gen = 1;
				else move.gen = 0;
			}
			if (!move.priority) move.priority = 0;
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
	Tools.prototype.getMoveCopy = function(move) {
		if (move && move.isCopy) return move;
		move = this.getMove(move);
		var moveCopy = Object.clone(move, true);
		moveCopy.isCopy = true;
		return moveCopy;
	};
	Tools.prototype.getEffect = function(effect) {
		if (!effect || typeof effect === 'string') {
			var name = (effect||'').trim();
			var id = toId(name);
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
				if (!effect.mod) effect.mod = this.currentMod;
				if (!effect.effectType) effect.effectType = 'Format';
			} else if (id === 'recoil') {
				effect = {
					effectType: 'Recoil'
				};
			} else if (id === 'drain') {
				effect = {
					effectType: 'Drain'
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
	Tools.prototype.getFormat = function(effect) {
		if (!effect || typeof effect === 'string') {
			var name = (effect||'').trim();
			var id = toId(name);
			effect = {};
			if (id && this.data.Formats[id]) {
				effect = this.data.Formats[id];
				if (effect.cached) return effect;
				effect.cached = true;
				effect.name = effect.name || this.data.Formats[id].name;
				if (!effect.mod) effect.mod = this.currentMod;
				if (!effect.effectType) effect.effectType = 'Format';
			}
			if (!effect.id) effect.id = id;
			if (!effect.name) effect.name = name;
			if (!effect.fullname) effect.fullname = effect.name;
			effect.toString = this.effectToString;
			if (!effect.category) effect.category = 'Effect';
			if (!effect.effectType) effect.effectType = 'Effect';
			this.getBanlistTable(effect);
		}
		return effect;
	};
	Tools.prototype.getItem = function(item) {
		if (!item || typeof item === 'string') {
			var name = (item||'').trim();
			var id = toId(name);
			if (this.data.Aliases[id]) {
				name = this.data.Aliases[id];
				id = toId(name);
			}
			item = {};
			if (id && this.data.Items[id]) {
				item = this.data.Items[id];
				if (item.cached) return item;
				item.cached = true;
				item.exists = true;
			}
			if (!item.id) item.id = id;
			if (!item.name) item.name = name;
			if (!item.fullname) item.fullname = 'item: '+item.name;
			item.toString = this.effectToString;
			if (!item.category) item.category = 'Effect';
			if (!item.effectType) item.effectType = 'Item';
			if (item.isBerry) item.fling = { basePower: 10 };
			if (!item.gen) {
				if (item.num >= 577) item.gen = 6;
				else if (item.num >= 537) item.gen = 5;
				else if (item.num >= 377) item.gen = 4;
				// Due to difference in storing items, gen 2 items must be specified specifically
				else item.gen = 3;
			}
		}
		return item;
	};
	Tools.prototype.getAbility = function(ability) {
		if (!ability || typeof ability === 'string') {
			var name = (ability||'').trim();
			var id = toId(name);
			ability = {};
			if (id && this.data.Abilities[id]) {
				ability = this.data.Abilities[id];
				if (ability.cached) return ability;
				ability.cached = true;
				ability.exists = true;
			}
			if (!ability.id) ability.id = id;
			if (!ability.name) ability.name = name;
			if (!ability.fullname) ability.fullname = 'ability: '+ability.name;
			ability.toString = this.effectToString;
			if (!ability.category) ability.category = 'Effect';
			if (!ability.effectType) ability.effectType = 'Ability';
			if (!ability.gen) {
				if (ability.num >= 165) ability.gen = 6;
				else if (ability.num >= 124) ability.gen = 5;
				else if (ability.num >= 77) ability.gen = 4;
				else if (ability.num >= 1) ability.gen = 3;
				else ability.gen = 0;
			}
		}
		return ability;
	};
	Tools.prototype.getType = function(type) {
		if (!type || typeof type === 'string') {
			var id = toId(type);
			id = id.substr(0,1).toUpperCase() + id.substr(1);
			type = {};
			if (id && this.data.TypeChart[id]) {
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
	var BattleNatures = {
		Adamant: {plus:'atk', minus:'spa'},
		Bashful: {},
		Bold: {plus:'def', minus:'atk'},
		Brave: {plus:'atk', minus:'spe'},
		Calm: {plus:'spd', minus:'atk'},
		Careful: {plus:'spd', minus:'spa'},
		Docile: {},
		Gentle: {plus:'spd', minus:'def'},
		Hardy: {},
		Hasty: {plus:'spe', minus:'def'},
		Impish: {plus:'def', minus:'spa'},
		Jolly: {plus:'spe', minus:'spa'},
		Lax: {plus:'def', minus:'spd'},
		Lonely: {plus:'atk', minus:'def'},
		Mild: {plus:'spa', minus:'def'},
		Modest: {plus:'spa', minus:'atk'},
		Naive: {plus:'spe', minus:'spd'},
		Naughty: {plus:'atk', minus:'spd'},
		Quiet: {plus:'spa', minus:'spe'},
		Quirky: {},
		Rash: {plus:'spa', minus:'spd'},
		Relaxed: {plus:'def', minus:'spe'},
		Sassy: {plus:'spd', minus:'spe'},
		Serious: {},
		Timid: {plus:'spe', minus:'atk'}
	};
	Tools.prototype.getNature = function(nature) {
		if (typeof nature === 'string') nature = BattleNatures[nature];
		if (!nature) nature = {};
		return nature;
	};
	Tools.prototype.natureModify = function(stats, nature) {
		if (typeof nature === 'string') nature = BattleNatures[nature];
		if (!nature) return stats;
		if (nature.plus) stats[nature.plus] *= 1.1;
		if (nature.minus) stats[nature.minus] *= 0.9;
		return stats;
	};

	Tools.prototype.getBanlistTable = function(format, subformat, depth) {
		var banlistTable;
		if (!depth) depth = 0;
		if (depth>8) return; // avoid infinite recursion
		if (format.banlistTable && !subformat) {
			banlistTable = format.banlistTable;
		} else {
			if (!format.banlistTable) format.banlistTable = {};
			if (!format.setBanTable) format.setBanTable = [];
			if (!format.teamBanTable) format.teamBanTable = [];

			banlistTable = format.banlistTable;
			if (!subformat) subformat = format;
			if (subformat.banlist) {
				for (var i=0; i<subformat.banlist.length; i++) {
					// don't revalidate what we already validate
					if (banlistTable[toId(subformat.banlist[i])]) continue;

					banlistTable[subformat.banlist[i]] = subformat.name || true;
					banlistTable[toId(subformat.banlist[i])] = subformat.name || true;

					var plusPos = subformat.banlist[i].indexOf('+');
					if (plusPos && plusPos > 0) {
						var plusPlusPos = subformat.banlist[i].indexOf('++');
						if (plusPlusPos && plusPlusPos > 0) {
							var complexList = subformat.banlist[i].split('++');
							for (var j=0; j<complexList.length; j++) {
								complexList[j] = toId(complexList[j]);
							}
							format.teamBanTable.push(complexList);
						} else {
							var complexList = subformat.banlist[i].split('+');
							for (var j=0; j<complexList.length; j++) {
								complexList[j] = toId(complexList[j]);
							}
							format.setBanTable.push(complexList);
						}
					}
				}
			}
			if (subformat.ruleset) {
				for (var i=0; i<subformat.ruleset.length; i++) {
					// don't revalidate what we already validate
					if (banlistTable['Rule:'+toId(subformat.ruleset[i])]) continue;

					banlistTable['Rule:'+toId(subformat.ruleset[i])] = subformat.ruleset[i];
					if (format.ruleset.indexOf(subformat.ruleset[i]) === -1) format.ruleset.push(subformat.ruleset[i]);

					var subsubformat = this.getFormat(subformat.ruleset[i]);
					if (subsubformat.ruleset || subsubformat.banlist) {
						this.getBanlistTable(format, subsubformat, depth+1);
					}
				}
			}
		}
		return banlistTable;
	};

	Tools.prototype.levenshtein = function(s, t, l) { // s = string 1, t = string 2, l = limit
		// Original levenshtein distance function by James Westgate, turned out to be the fastest
		var d = []; // 2d matrix

		// Step 1
		var n = s.length;
		var m = t.length;

		if (n == 0) return m;
		if (m == 0) return n;
		if (l && Math.abs(m - n) > l) return Math.abs(m - n);

		// Create an array of arrays in javascript (a descending loop is quicker)
		for (var i = n; i >= 0; i--) d[i] = [];

		// Step 2
		for (var i = n; i >= 0; i--) d[i][0] = i;
		for (var j = m; j >= 0; j--) d[0][j] = j;

		// Step 3
		for (var i = 1; i <= n; i++) {
			var s_i = s.charAt(i - 1);

			// Step 4
			for (var j = 1; j <= m; j++) {
				// Check the jagged ld total so far
				if (i == j && d[i][j] > 4) return n;

				var t_j = t.charAt(j - 1);
				var cost = (s_i == t_j) ? 0 : 1; // Step 5

				// Calculate the minimum
				var mi = d[i - 1][j] + 1;
				var b = d[i][j - 1] + 1;
				var c = d[i - 1][j - 1] + cost;

				if (b < mi) mi = b;
				if (c < mi) mi = c;

				d[i][j] = mi; // Step 6
			}
		}

		// Step 7
		return d[n][m];
	};

	Tools.prototype.dataSearch = function(target, searchIn) {
		if (!target) {
			return false;
		}

		searchIn = searchIn || ['Pokedex', 'Movedex', 'Abilities', 'Items'];

		var searchFunctions = { Pokedex: 'getTemplate', Movedex: 'getMove', Abilities: 'getAbility', Items: 'getItem' };
		var searchTypes = { Pokedex: 'pokemon', Movedex: 'move', Abilities: 'ability', Items: 'item' };
		var searchResults = [];
		for (var i = 0; i < searchIn.length; i++) {
			if (typeof this[searchFunctions[searchIn[i]]] === "function") {
				var res = this[searchFunctions[searchIn[i]]](target);
				if (res.exists) {
					res.searchType = searchTypes[searchIn[i]];
					searchResults.push(res);
				}
			}
		}
		if (searchResults.length) {
			return searchResults;
		}

		var cmpTarget = target.toLowerCase();
		var maxLd = 3;
		if (cmpTarget.length <= 1) {
			return false;
		} else if (cmpTarget.length <= 4) {
			maxLd = 1;
		} else if (cmpTarget.length <= 6) {
			maxLd = 2;
		}
		for (var i = 0; i < searchIn.length; i++) {
			var searchObj = this.data[searchIn[i]];
			if (!searchObj) {
				continue;
			}

			for (var j in searchObj) {
				var word = searchObj[j];
				if (typeof word === "object") {
					word = word.name || word.species;
				}
				if (!word) {
					continue;
				}

				var ld = this.levenshtein(cmpTarget, word.toLowerCase(), maxLd);
				if (ld <= maxLd) {
					searchResults.push({ word: word, ld: ld });
				}
			}
		}

		if (searchResults.length) {
			var newTarget = "";
			var newLD = 10;
			for (var i = 0, l = searchResults.length; i < l; i++) {
				if (searchResults[i].ld < newLD) {
					newTarget = searchResults[i];
					newLD = searchResults[i].ld;
				}
			}

			// To make sure we aren't in an infinite loop...
			if (cmpTarget !== newTarget.word) {
				return this.dataSearch(newTarget.word);
			}
		}

		return false;
	};
	/**
	 * Install our Tools functions into the battle object
	 */
	Tools.prototype.install = function(battle) {
		for (var i in this.data.Scripts) {
			battle[i] = this.data.Scripts[i];
		}
	};

	Tools.construct = function(mod, parentMod) {
		var tools = new Tools(mod, parentMod);
		// Scripts override Tools.
		var ret = Object.create(tools);
		tools.install(ret);
		if (ret.init) {
			ret.init();
		}
		return ret;
	};

	moddedTools.base = Tools.construct();

	// "gen6" is an alias for the current base data
	moddedTools.gen6 = moddedTools.base;

	var parentMods = {};

	try {
		var mods = fs.readdirSync('./mods/');

		mods.forEach(function(mod) {
			if (fs.existsSync('./mods/'+mod+'/scripts.js')) {
				parentMods[mod] = require('./mods/'+mod+'/scripts.js').BattleScripts.inherit || 'base';
			} else {
				parentMods[mod] = 'base';
			}
		});

		var didSomething = false;
		do {
			didSomething = false;
			for (var i in parentMods) {
				if (!moddedTools[i] && moddedTools[parentMods[i]]) {
					moddedTools[i] = Tools.construct(i, parentMods[i]);
					didSomething = true;
				}
			}
		} while (didSomething);
	} catch (e) {
		console.log("Error while loading mods: "+e);
	}

	moddedTools.base.__proto__.moddedTools = moddedTools;

	return moddedTools.base;
})();
