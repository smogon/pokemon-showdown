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
		'Formats': 'formats.js',
		'FormatsData': 'formats-data.js',
		'Learnsets': 'learnsets.js',
		'Aliases': 'aliases.js'
	};
	function Tools(mod) {
		if (!mod) {
			mod = 'base';
			this.isBase = true;
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
			var baseData = moddedTools.base.data;
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
				for (var i in baseData[dataType]) {
					if (data[dataType][i] === null) {
						// null means don't inherit
						delete data[dataType][i];
					} else if (!(i in data[dataType])) {
						// If it doesn't exist it's inherited from the base data
						if (dataType === 'Pokedex') {
							// Pokedex entries can be modified too many different ways
							data[dataType][i] = Object.clone(baseData[dataType][i], true);
						} else {
							data[dataType][i] = baseData[dataType][i];
						}
					} else if (data[dataType][i] && data[dataType][i].inherit) {
						// {inherit: true} can be used to modify only parts of the base data,
						// instead of overwriting entirely
						delete data[dataType][i].inherit;
						Object.merge(data[dataType][i], baseData[dataType][i], true, false);
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
		for (var i=0; i<target.types.length; i++) {
			if (this.data.TypeChart[target.types[i]] && this.data.TypeChart[target.types[i]].damageTaken && this.data.TypeChart[target.types[i]].damageTaken[type] === 3) {
				return false;
			}
		}
		return true;
	};
	Tools.prototype.getEffectiveness = function(type, target) {
		var totalTypeMod = 0;
		for (var i=0; i<target.types.length; i++) {
			if (!this.data.TypeChart[target.types[i]]) continue;
			var typeMod = this.data.TypeChart[target.types[i]].damageTaken[type];
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
			if (!template.tier) template.tier = 'Illegal';
			if (!template.gen) {
				if (template.num >= 650) template.gen = 6;
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

	Tools.prototype.checkLearnset = function(move, template, lsetData) {
		move = toId(move);
		template = this.getTemplate(template);

		lsetData = lsetData || {};
		var set = (lsetData.set || (lsetData.set={}));
		var format = (lsetData.format || (lsetData.format={}));
		var alreadyChecked = {};
		var level = set.level || 100;

		var limit1 = true;
		var sketch = false;

		// This is a pretty complicated algorithm

		// Abstractly, what it does is construct the union of sets of all
		// possible ways this pokemon could be obtained, and then intersect
		// it with a the pokemon's existing set of all possible ways it could
		// be obtained. If this intersection is non-empty, the move is legal.

		// We apply several optimizations to this algorithm. The most
		// important is that with, for instance, a TM move, that Pokemon
		// could have been obtained from any gen at or before that TM's gen.
		// Instead of adding every possible source before or during that gen,
		// we keep track of a maximum gen variable, intended to mean "any
		// source at or before this gen is possible."

		// set of possible sources of a pokemon with this move, represented as an array
		var sources = [];
		// the equivalent of adding "every source at or before this gen" to sources
		var sourcesBefore = 0;

		do {
			alreadyChecked[template.speciesid] = true;
			// Stabmons hack to avoid copying all of validateSet to formats.
			if (format.id === 'stabmons' && template.types.indexOf(this.getMove(move).type) > -1) return false;
			if (template.learnset) {
				if (template.learnset[move] || template.learnset['sketch']) {
					var lset = template.learnset[move];
					if (!lset || template.speciesid === 'smeargle') {
						lset = template.learnset['sketch'];
						sketch = true;
					}
					if (typeof lset === 'string') lset = [lset];

					for (var i=0, len=lset.length; i<len; i++) {
						var learned = lset[i];
						if (learned.substr(0,2) in {'4L':1,'5L':1}) {
							// gen 4 or 5 level-up moves
							if (level >= parseInt(learned.substr(2),10)) {
								// Chatter and Struggle cannot be sketched
								if (sketch && (move === 'chatter' || move === 'struggle')) return true;
								// we're past the required level to learn it
								return false;
							}
							if (!template.gender || template.gender === 'F') {
								// available as egg move
								learned = learned.substr(0,1)+'Eany';
							} else {
								// this move is unavailable, skip it
								continue;
							}
						}
						if (learned.substr(1,1) in {L:1,M:1,T:1}) {
							if (learned.substr(0,1) === '5') {
								// current-gen TM or tutor moves:
								//   always available
								return false;
							}
							// past-gen level-up, TM, or tutor moves:
							//   available as long as the source gen was or was before this gen
							limit1 = false;
							sourcesBefore = Math.max(sourcesBefore, parseInt(learned.substr(0,1),10));
						} else if (learned.substr(1,1) in {E:1,S:1,D:1}) {
							// egg, event, or DW moves:
							//   only if that was the source
							if (learned.substr(1,1) === 'E') {
								// it's an egg move, so we add each pokemon that can be bred with to its sources
								var eggGroups = template.eggGroups;
								if (!eggGroups) continue;
								if (eggGroups[0] === 'No Eggs') eggGroups = this.getTemplate(template.evos[0]).eggGroups;
								var atLeastOne = false;
								var fromSelf = (learned.substr(1) === 'Eany');
								learned = learned.substr(0,2);
								for (var templateid in this.data.Pokedex) {
									var dexEntry = this.getTemplate(templateid);
									if (
										// CAP pokemon can't breed
										!dexEntry.isNonstandard &&
										// can't breed mons from future gens
										dexEntry.gen <= parseInt(learned.substr(0,1),10) &&
										// genderless pokemon can't pass egg moves
										dexEntry.gender !== 'N') {
										if (
											// chainbreeding
											fromSelf ||
											// otherwise parent must be able to learn the move
											!alreadyChecked[dexEntry.speciesid] && dexEntry.learnset && (dexEntry.learnset[move]||dexEntry.learnset['sketch'])) {
											if (dexEntry.eggGroups.intersect(eggGroups).length) {
												// we can breed with it
												atLeastOne = true;
												sources.push(learned+dexEntry.id);
											}
										}
									}
								}
								// chainbreeding with itself from earlier gen
								if (!atLeastOne) sources.push(learned+template.id);
							} else if (learned.substr(1,1) === 'S') {
								sources.push(learned+' '+template.id);
							} else {
								sources.push(learned);
							}
						}
					}
				}
				if (format.mimicGlitch && template.gen < 5) {
					// include the Mimic Glitch when checking this mon's learnset
					var glitchMoves = {metronome:1, copycat:1, transform:1, mimic:1, assist:1};
					var getGlitch = false;
					for (var i in glitchMoves) {
						if (template.learnset[i]) {
							if (i === 'mimic' && this.getAbility(set.ability).gen == 4 && !template.prevo) {
								// doesn't get the glitch
							} else {
								getGlitch = true;
								break;
							}
						}
					}
					if (getGlitch) {
						sourcesBefore = Math.max(sourcesBefore, 4);
						if (this.getMove(move).gen < 5) {
							limit1 = false;
						}
					}
				}
			}
			// also check to see if the mon's prevo or freely switchable formes can learn this move
			if (template.prevo) {
				template = this.getTemplate(template.prevo);
			} else if (template.speciesid === 'shaymin') {
				template = this.getTemplate('shayminsky');
			} else if (template.baseSpecies !== template.species && template.baseSpecies !== 'Kyurem') {
				template = this.getTemplate(template.baseSpecies);
			} else {
				template = null;
			}
		} while (template && template.species && !alreadyChecked[template.speciesid]);

		if (limit1 && sketch) {
			// limit 1 sketch move
			if (lsetData.sketchMove) {
				return {type:'oversketched', maxSketches: 1};
			}
			lsetData.sketchMove = move;
		}

		// Now that we have our list of possible sources, intersect it with the current list
		if (!sourcesBefore && !sources.length) {
			return true;
		}
		if (!sources.length) sources = null;
		if (sourcesBefore || lsetData.sourcesBefore) {
			// having sourcesBefore is the equivalent of having everything before that gen
			// in sources, so we fill the other array in preparation for intersection
			if (sourcesBefore && lsetData.sources) {
				if (!sources) sources = [];
				for (var i=0, len=lsetData.sources.length; i<len; i++) {
					var learned = lsetData.sources[i];
					if (parseInt(learned.substr(0,1),10) <= sourcesBefore) {
						sources.push(learned);
					}
				}
				if (!lsetData.sourcesBefore) sourcesBefore = 0;
			}
			if (lsetData.sourcesBefore && sources) {
				if (!lsetData.sources) lsetData.sources = [];
				for (var i=0, len=sources.length; i<len; i++) {
					var learned = sources[i];
					if (parseInt(learned.substr(0,1),10) <= lsetData.sourcesBefore) {
						lsetData.sources.push(learned);
					}
				}
				if (!sourcesBefore) delete lsetData.sourcesBefore;
			}
		}
		if (sources) {
			if (lsetData.sources) {
				var intersectSources = lsetData.sources.intersect(sources);
				if (!intersectSources.length && !(sourcesBefore && lsetData.sourcesBefore)) {
					return {type:'incompatible'};
				}
				lsetData.sources = intersectSources;
			} else {
				lsetData.sources = sources.unique();
			}
		}

		if (sourcesBefore) {
			lsetData.sourcesBefore = Math.min(sourcesBefore, lsetData.sourcesBefore||5);
		}

		return false;
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
	Tools.prototype.validateTeam = function(team, format, forceThisMod) {
		format = this.getFormat(format);
		if (!forceThisMod && this.isBase && format.mod !== this.currentMod) {
			return this.mod(format).validateTeam(team, format, true);
		}
		var problems = [];
		this.getBanlistTable(format);
		if (format.team) {
			return false;
		}
		if (!team || !Array.isArray(team)) {
			if (format.canUseRandomTeam) {
				return false;
			}
			return ["You sent invalid team data. If you're not using a custom client, please report this as a bug."];
		}
		if (!team.length) {
			return ["Your team has no pokemon."];
		}
		if (team.length>6) {
			return ["Your team has more than 6 pokemon."];
		}
		var teamHas = {};
		for (var i=0; i<team.length; i++) {
			var setProblems = this.validateSet(team[i], format, teamHas);
			if (setProblems) {
				problems = problems.concat(setProblems);
			}
		}

		for (var i=0; i<format.teamBanTable.length; i++) {
			var bannedCombo = '';
			for (var j=0; j<format.teamBanTable[i].length; j++) {
				if (!teamHas[format.teamBanTable[i][j]]) {
					bannedCombo = false;
					break;
				}

				if (j == 0) {
					bannedCombo += format.teamBanTable[i][j];
				} else {
					bannedCombo += ' and '+format.teamBanTable[i][j];
				}
			}
			if (bannedCombo) {
				var clause = format.name ? " by "+format.name : '';
				problems.push("Your team has the combination of "+bannedCombo+", which is banned"+clause+".");
			}
		}

		if (format.ruleset) {
			for (var i=0; i<format.ruleset.length; i++) {
				var subformat = this.getFormat(format.ruleset[i]);
				if (subformat.validateTeam) {
					problems = problems.concat(subformat.validateTeam.call(this, team, format)||[]);
				}
			}
		}
		if (format.validateTeam) {
			problems = problems.concat(format.validateTeam.call(this, team, format)||[]);
		}

		if (!problems.length) return false;
		return problems;
	};
	Tools.prototype.validateSet = function(set, format, teamHas, forceThisMod) {
		format = this.getFormat(format);
		if (!forceThisMod && this.isBase && format.mod !== this.currentMod) {
			return this.mod(format).validateSet(set, format, teamHas, true);
		}
		var problems = [];
		if (!set) {
			return ["This is not a Pokemon."];
		}

		var template = this.getTemplate(string(set.species));
		if (!template.exists) {
			return ["The Pokemon '"+set.species+"' does not exist."];
		}
		set.species = template.species;

		set.name = toName(set.name);
		var item = this.getItem(string(set.item));
		set.item = item.name;
		var ability = this.getAbility(string(set.ability));
		set.ability = ability.name;
		if (!Array.isArray(set.moves)) set.moves = [];

		var maxLevel = format.maxLevel || 100;
		var maxForcedLevel = format.maxForcedLevel || maxLevel;
		if (!set.level) {
			set.level = (format.defaultLevel || maxLevel);
		}
		if (format.forcedLevel) {
			set.forcedLevel = format.forcedLevel;
		} else if (set.level >= maxForcedLevel) {
			set.forcedLevel = maxForcedLevel;
		}
		if (set.level > maxLevel || set.level == set.forcedLevel || set.level == set.maxForcedLevel) {
			set.level = maxLevel;
		}

		set.species = set.species || set.name || 'Bulbasaur';
		set.name = set.name || set.species;
		var name = set.species;
		if (set.species !== set.name) name = set.name + " ("+set.species+")";
		var isDW = false;
		var lsetData = {set:set, format:format};

		var setHas = {};

		if (!template || !template.abilities) {
			set.species = 'Bulbasaur';
			template = this.getTemplate('Bulbasaur');
		}

		var banlistTable = this.getBanlistTable(format);

		var check = toId(set.species);
		var clause = '';
		setHas[check] = true;
		if (banlistTable[check]) {
			clause = typeof banlistTable[check] === 'string' ? " by "+ banlistTable[check] : '';
			problems.push(set.species+' is banned'+clause+'.');
		}
		check = toId(set.ability);
		setHas[check] = true;
		if (banlistTable[check]) {
			clause = typeof banlistTable[check] === 'string' ? " by "+ banlistTable[check] : '';
			problems.push(name+"'s ability "+set.ability+" is banned"+clause+".");
		}
		check = toId(set.item);
		setHas[check] = true;
		if (banlistTable[check]) {
			clause = typeof banlistTable[check] === 'string' ? " by "+ banlistTable[check] : '';
			problems.push(name+"'s item "+set.item+" is banned"+clause+".");
		}
		if (banlistTable['Unreleased'] && item.isUnreleased) {
			problems.push(name+"'s item "+set.item+" is unreleased.");
		}
		setHas[toId(set.ability)] = true;
		if (banlistTable['illegal']) {
			var totalEV = 0;
			for (var k in set.evs) {
				if (typeof set.evs[k] !== 'number') {
					set.evs[k] = 0;
				}
				totalEV += set.evs[k];
			}
			if (totalEV > 510) {
				problems.push(name+" has more than 510 total EVs.");
			}

			// Don't check abilities for metagames with All Abilities
			if (this.gen <= 2) {
				set.ability = '';
			} else if (!banlistTable['ignoreillegalabilities']) {
				if (!ability.name) {
					problems.push(name+" needs to have an ability.");
				} else if (ability.name !== template.abilities['0'] &&
					ability.name !== template.abilities['1'] &&
					ability.name !== template.abilities['DW']) {
					problems.push(name+" can't have "+set.ability+".");
				}
				if (ability.name === template.abilities['DW']) {
					isDW = true;

					if (!template.dreamWorldRelease && banlistTable['Unreleased']) {
						problems.push(name+"'s Dream World ability is unreleased.");
					} else if (set.level < 10 && (template.maleOnlyDreamWorld || template.gender === 'N')) {
						problems.push(name+" must be at least level 10 with its DW ability.");
					}
					if (template.maleOnlyDreamWorld) {
						set.gender = 'M';
						lsetData.sources = ['5D'];
					}
				}
			}
		}
		if (set.moves && Array.isArray(set.moves)) {
			set.moves = set.moves.filter(function(val){ return val; });
		}
		if (!set.moves || !set.moves.length) {
			problems.push(name+" has no moves.");
		} else {
			// A limit is imposed here to prevent too much engine strain or
			// too much layout deformation - to be exact, this is the Debug
			// Mode limitation.
			// The usual limit of 4 moves is handled elsewhere - currently
			// in the cartridge-compliant set validator: formats.js:pokemon
			set.moves = set.moves.slice(0,24);

			for (var i=0; i<set.moves.length; i++) {
				if (!set.moves[i]) continue;
				var move = this.getMove(string(set.moves[i]));
				set.moves[i] = move.name;
				check = move.id;
				setHas[check] = true;
				if (banlistTable[check]) {
					clause = typeof banlistTable[check] === 'string' ? " by "+ banlistTable[check] : '';
					problems.push(name+"'s move "+set.moves[i]+" is banned"+clause+".");
				}

				if (banlistTable['illegal']) {
					var problem = this.checkLearnset(move, template, lsetData);
					if (problem) {
						var problemString = name+" can't learn "+move.name;
						if (problem.type === 'incompatible') {
							if (isDW) {
								problemString = problemString.concat(" because it's incompatible with its ability or another move.");
							} else {
								problemString = problemString.concat(" because it's incompatible with another move.");
							}
						} else if (problem.type === 'oversketched') {
							problemString = problemString.concat(" because it can only sketch "+problem.maxSketches+" move"+(problem.maxSketches>1?"s":"")+".");
						} else {
							problemString = problemString.concat(".");
						}
						problems.push(problemString);
					}
				}
			}

			if (lsetData.sources && lsetData.sources.length === 1 && !lsetData.sourcesBefore) {
				// we're restricted to a single source
				var source = lsetData.sources[0];
				if (source.substr(1,1) === 'S') {
					// it's an event
					var eventData = null;
					var splitSource = source.substr(2).split(' ');
					var eventTemplate = this.getTemplate(splitSource[1]);
					if (eventTemplate.eventPokemon) eventData = eventTemplate.eventPokemon[parseInt(splitSource[0],10)];
					if (eventData) {
						if (eventData.nature && eventData.nature !== set.nature) {
							problems.push(name+" must have a "+eventData.nature+" nature because it comes from a specific event.");
						}
						if (eventData.shiny) {
							set.shiny = true;
						}
						if (eventData.generation < 5) eventData.isDW = false;
						if (eventData.isDW !== undefined && eventData.isDW !== isDW) {
							problems.push(name+(isDW?" can't have":" must have")+" its DW ability because it comes from a specific event.");
						}
						if (eventData.abilities && eventData.abilities.indexOf(ability.id) < 0) {
							problems.push(name+" must have "+eventData.abilities.join(" or ")+" because it comes from a specific event.");
						}
						if (eventData.gender) {
							set.gender = eventData.gender;
						}
						if (eventData.level && set.level < eventData.level) {
							problems.push(name+" must be at least level "+eventData.level+" because it comes from a specific event.");
						}
					}
					isDW = false;
				}
			}
			if (isDW && template.gender) {
				if (!lsetData.sources && lsetData.sourcesBefore < 5) {
					problems.push(name+" has a DW ability - it can't have moves only learned before gen 5.");
				} else if (lsetData.sources) {
					var compatibleSource = false;
					for (var i=0,len=lsetData.sources.length; i<len; i++) {
						if (lsetData.sources[i].substr(0,2) === '5E' || (lsetData.sources[i].substr(0,2) === '5D' && set.level >= 10)) {
							compatibleSource = true;
							break;
						}
					}
					if (!compatibleSource) {
						problems.push(name+" has moves incompatible with its DW ability.");
					}
				}
			}
			if (set.level < template.evoLevel) {
				// FIXME: Event pokemon given at a level under what it normally can be attained at gives a false positive
				problems.push(name+" must be at least level "+template.evoLevel+".");
			}
			if (!lsetData.sources && lsetData.sourcesBefore <= 3 && this.getAbility(set.ability).gen === 4 && !template.prevo) {
				problems.push(name+" has a gen 4 ability and isn't evolved - it can't use anything from gen 3.");
			}
		}
		setHas[toId(template.tier)] = true;
		if (banlistTable[template.tier]) {
			problems.push(name+" is in "+template.tier+", which is banned.");
		}

		if (teamHas) {
			for (var i in setHas) {
				teamHas[i] = true;
			}
		}
		for (var i=0; i<format.setBanTable.length; i++) {
			var bannedCombo = '';
			for (var j=0; j<format.setBanTable[i].length; j++) {
				if (!setHas[format.setBanTable[i][j]]) {
					bannedCombo = false;
					break;
				}

				if (j == 0) {
					bannedCombo += format.setBanTable[i][j];
				} else {
					bannedCombo += ' and '+format.setBanTable[i][j];
				}
			}
			if (bannedCombo) {
				clause = format.name ? " by "+format.name : '';
				problems.push(name+" has the combination of "+bannedCombo+", which is banned"+clause+".");
			}
		}

		if (format.ruleset) {
			for (var i=0; i<format.ruleset.length; i++) {
				var subformat = this.getFormat(format.ruleset[i]);
				if (subformat.validateSet) {
					problems = problems.concat(subformat.validateSet.call(this, set, format)||[]);
				}
			}
		}
		if (format.validateSet) {
			problems = problems.concat(format.validateSet.call(this, set, format)||[]);
		}

		if (!problems.length) return false;
		return problems;
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

	Tools.construct = function(mod) {
		var tools = new Tools(mod);
		// Scripts override Tools.
		var ret = Object.create(tools);
		tools.install(ret);
		if (ret.init) {
			ret.init();
		}
		return ret;
	};

	moddedTools.base = Tools.construct();
	try {
		var dirs = fs.readdirSync('./mods/');

		dirs.forEach(function(dir) {
			moddedTools[dir] = Tools.construct(dir);
		});
	} catch (e) {}

	moddedTools.base.__proto__.moddedTools = moddedTools;

	return moddedTools.base;
})();
