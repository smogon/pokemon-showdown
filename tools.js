module.exports = (function () {
	var dataTypes = ['Pokedex', 'Movedex', 'Statuses', 'TypeChart', 'Scripts', 'Items', 'Abilities', 'Formats', 'FormatsData', 'Learnsets', 'Aliases'];
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

		Data[mod] = {
			mod: mod
		};
		if (mod === 'base') {
			dataTypes.forEach(function(dataType) {
				try {
					Data[mod][dataType] = require('./data/'+dataFiles[dataType])['Battle'+dataType];
				} catch (e) {}
				if (!Data[mod][dataType]) Data[mod][dataType] = {};
			}, this);
		} else {
			dataTypes.forEach(function(dataType) {
				try {
					Data[mod][dataType] = require('./mods/'+mod+'/'+dataFiles[dataType])['Battle'+dataType];
				} catch (e) {}
				if (!Data[mod][dataType]) Data[mod][dataType] = {};
				for (var i in Data.base[dataType]) {
					if (Data[mod][dataType][i] === null) {
						// null means don't inherit
						delete Data[mod][dataType][i];
					} else if (typeof Data[mod][dataType][i] === 'undefined') {
						// If it doesn't exist is inherited from the base data
						Data[mod][dataType][i] = Object.clone(Data.base[dataType][i], true);
					} else if (Data[mod][dataType][i] && Data[mod][dataType][i].inherit) {
						// {inherit: true} can be used to modify only parts of the base data,
						// instead of overwriting entirely
						delete Data[mod][dataType][i].inherit;
						Object.merge(Data[mod][dataType][i], Data.base[dataType][i], true, false);
					}
				}
			});
		}
		this.data = Data[mod];

		// Scripts are Tools specific to a mod; they add to or overwrite base tools
		// Many Scripts are not meant to be run from Tools directly; rather, they're meant
		// to be copied into Battle.js using Tools.install and run from there
		for (var i in this.data.Scripts) {
			this[i] = this.data.Scripts[i];
		}
		if (this.init) this.init();
	}

	var moddedTools = {};
	Tools.prototype.mod = function(mod) {
		if (!moddedTools[mod]) {
			mod = this.getFormat(mod).mod;
		}
		if (!mod) mod = 'base';
		return moddedTools[mod];
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
			if (!template.basespecies) template.basespecies = name;
			if (!template.forme) template.forme = '';
			if (!template.formeletter) template.formeletter = '';
			if (!template.spriteid) template.spriteid = toId(template.basespecies)+(template.basespecies!==name?'-'+toId(template.forme):'');
			if (!template.prevo) template.prevo = '';
			if (!template.evos) template.evos = [];
			if (!template.nfe) template.nfe = !!template.evos.length;
			if (!template.gender) template.gender = '';
			if (!template.genderRatio && template.gender === 'M') template.genderRatio = {M:1,F:0};
			if (!template.genderRatio && template.gender === 'F') template.genderRatio = {M:0,F:1};
			if (!template.genderRatio && template.gender === 'N') template.genderRatio = {M:0,F:0};
			if (!template.genderRatio) template.genderRatio = {M:.5,F:.5};
			if (!template.tier) template.tier = 'Illegal';
			if (!template.gen) {
				if (template.num >= 494) template.gen = 5;
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
			move = {};
			if (id.substr(0,12) === 'HiddenPower[') {
				var hptype = id.substr(12);
				hptype = hptype.substr(0,hptype.length-1);
				id = 'HiddenPower'+hptype;
			}
			if (id && this.data.Movedex[id]) {
				move = this.data.Movedex[id];
				move.exists = true;
			}
			if (!move.id) move.id = id;
			if (!move.name) move.name = name;
			if (!move.fullname) move.fullname = 'move: '+name;
			move.toString = this.effectToString;
			if (!move.critRatio) move.critRatio = 1;
			if (!move.baseType) move.baseType = move.type;
			if (!move.effectType) move.effectType = 'Move';
			if (!move.secondaries && move.secondary) move.secondaries = [move.secondary];
			if (!move.gen) {
				if (move.num >= 468) move.gen = 5;
				else if (move.num >= 355) move.gen = 4;
				else if (move.num >= 252) move.gen = 3;
				else if (move.num >= 166) move.gen = 2;
				else if (move.num >= 1) move.gen = 1;
				else move.gen = 0;
			}
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
		var move = this.getMove(move);
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
			if (!effect.fullname) effect.fullname = name;
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
				effect.name = effect.name || this.data.Formats[id].name;
				if (!effect.mod) effect.mod = this.currentMod;
				if (!effect.effectType) effect.effectType = 'Format';
			}
			if (!effect.id) effect.id = id;
			if (!effect.name) effect.name = name;
			if (!effect.fullname) effect.fullname = name;
			effect.toString = this.effectToString;
			if (!effect.category) effect.category = 'Effect';
			if (!effect.effectType) effect.effectType = 'Effect';
		}
		return effect;
	};
	Tools.prototype.getItem = function(item) {
		if (!item || typeof item === 'string') {
			var name = (item||'').trim();
			var id = toId(name);
			item = {};
			if (id && this.data.Items[id]) {
				item = this.data.Items[id];
				item.exists = true;
			}
			if (!item.id) item.id = id;
			if (!item.name) item.name = name;
			if (!item.fullname) item.fullname = 'item: '+name;
			item.toString = this.effectToString;
			if (!item.category) item.category = 'Effect';
			if (!item.effectType) item.effectType = 'Item';
			if (item.isBerry) item.fling = { basePower: 10 };
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
				ability.exists = true;
			}
			if (!ability.id) ability.id = id;
			if (!ability.name) ability.name = name;
			if (!ability.fullname) ability.fullname = 'ability: '+name;
			ability.toString = this.effectToString;
			if (!ability.category) ability.category = 'Effect';
			if (!ability.effectType) ability.effectType = 'Ability';
			if (!ability.gen) {
				if (ability.num >= 124) ability.gen = 5;
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
			type = {};
			if (id && this.data.TypeChart[id]) {
				type = this.data.TypeChart[id];
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
		Timid: {plus:'spe', minus:'atk'},
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
		lsetData = lsetData || {set:{},format:{}};
		var set = lsetData.set;
		var format = lsetData.format;
		var alreadyChecked = {};
		var result = false;
		var isDW = (this.getAbility(set.ability).name === template.abilities.DW);
		var isMaleOnly = template.maleOnlyDreamWorld;
		var recheck = false;
		if (move.id) move = move.id;
		do {
			alreadyChecked[template.speciesid] = true;
			if (template.learnset) {
				if (template.learnset[move]) {
					var lset = template.learnset[move];
					if (typeof lset === 'string') lset = [lset];
					if (isDW) {
						result = null; // DW illegality
						if (isMaleOnly && !template.maleOnlyDreamWorld) { // the pokemon is released, but not its prevo(s)
							return result;
						}
						// the combination of DW ability and gen 3-4 exclusive move is illegal
						for (var i=0; i<lset.length; i++) {
							if (lset[i].substr(0,1) === '5' && (!isMaleOnly || lset[i] !== '5E')) {
								return true;
							}
						}
					} else {
						// the combination of non-DW ability and DW exclusive move is illegal
						result = 0; // DW exclusivity
						for (var i=0; i<lset.length; i++) {
							if (lset[i] !== '5D') return true;
						}
					}
				}
				if (template.learnset['sketch']) {
					var lset = template.learnset['sketch'];
					if (typeof lset === 'string') lset = [lset];
					for (var i=0; i<lset.length; i++) if (lset[i].substr(1) !== 'E') return true;
					result = 1;
				}
				if (format.mimicGlitch && template.gen < 5 && !isDW) {
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
						if (this.getMove(move).gen >= 5) {
							result = 1;
						} else {
							return true;
						}
					}
				}
			}
			if (Object.keys(template.abilities).length === 1 && template.dreamWorldRelease && !recheck) {
				// Some Pokemon with no DW ability still have DW-exclusive moves (e.g. Gastly, Koffing, Chimecho)
				isDW = !isDW;
				recheck = true;
				alreadyChecked[template.speciesid] = null;
				continue;
			} else {
				recheck = false;
			}
			if (template.speciesid === 'shaymin') {
				template = this.getTemplate('shayminsky');
			} else if (template.basespecies !== template.species && template.basespecies !== 'Kyurem') {
				template = this.getTemplate(template.basespecies);
			} else {
				template = this.getTemplate(template.prevo);
			}
		} while (template && template.species && !alreadyChecked[template.speciesid]);
		return result;
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
		if (format.team === 'random') {
			return false;
		}
		if (!team || !Array.isArray(team)) {
			if (format.canUseRandomTeam) {
				return false;
			}
			return ["Random teams are not allowed in this format."];
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
				clause = format.name ? " by "+format.name : '';
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

		set.species = (''+(set.species||'')).trim();
		set.name = (''+(set.name||'')).trim();
		set.item = ''+(set.item||'');
		set.ability = ''+(set.ability||'');
		if (!Array.isArray(set.moves)) set.moves = [];

		set.species = set.species || set.name || 'Bulbasaur';
		set.name = set.name || set.species;
		var name = set.species;
		if (set.species !== set.name) name = set.name + " ("+set.species+")";
		var template = this.getTemplate(set.species);
		var source = '';

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
		var item = this.getItem(set.item);
		if (banlistTable['Unreleased'] && item.isUnreleased) {
			problems.push(name+"'s item "+set.item+" is unreleased.");
		}
		setHas[toId(set.ability)] = true;
		if (banlistTable['illegal']) {
			var totalEV = 0;
			for (var k in set.evs) {
				totalEV += set.evs[k];
			}
			if (totalEV > 510) {
				problems.push(name+" has more than 510 total EVs.");
			}

			var ability = this.getAbility(set.ability).name;
			if (ability !== template.abilities['0'] &&
				ability !== template.abilities['1'] &&
				ability !== template.abilities['DW']) {
				problems.push(name+" can't have "+set.ability+".");
			}
			if (ability === template.abilities['DW']) {
				source = 'DW';

				if (!template.dreamWorldRelease && banlistTable['Unreleased']) {
					problems.push(name+"'s Dream World ability is unreleased.");
				} else if (template.maleOnlyDreamWorld) {
					set.gender = 'M';
				}
			}
		}
		var limit1 = 0;
		if (!set.moves || !set.moves.length) {
			problems.push(name+" has no moves.");
		} else {
			// A limit is imposed here to prevent too much engine strain or
			// too much layout deformation - to be exact, this is the Debug
			// Mode limitation.
			// The usual limit of 4 moves is handled elsewhere - currently
			// in the cartridge-compliant set validator: formats.js:pokemon
			set.moves = set.moves.slice(0,24);

			var lsetData = {set:set, format:format};
			for (var i=0; i<set.moves.length; i++) {
				if (!set.moves[i]) continue;
				set.moves[i] = ''+(set.moves[i]||'');
				var move = this.getMove(set.moves[i]);
				check = move.id;
				setHas[check] = true;
				if (banlistTable[check]) {
					clause = typeof banlistTable[check] === 'string' ? " by "+ banlistTable[check] : '';
					problems.push(name+"'s move "+set.moves[i]+" is banned"+clause+".");
				}

				if (banlistTable['illegal']) {
					var lset = this.checkLearnset(move, template, lsetData);
					if (!lset) {
						var problem = name+" can't learn "+move.name;
						if (lset === null) {
							problem = problem.concat(" if it's from the Dream World.");
						} else if (lset === 0) {
							problem = problem.concat(" if it's not from the Dream World.");
						} else {
							problem = problem.concat(".");
						}
						problems.push(problem);
					} else if (lset === 1) {
						limit1++;
						if (limit1 > 1) {
							problems.push(name+" can't Sketch "+move.name+" - it's limited to 1 Sketch move.");
						}
					}
				}
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
	/**
	 * Install our Tools functions into the battle object
	 */
	Tools.prototype.install = function(battle) {
		for (var i in this) {
			battle[i] = this[i];
		}
	};

	moddedTools.base = new Tools();
	try {
		var dirs = fs.readdirSync('./mods/');

		dirs.forEach(function(dir) {
			moddedTools[dir] = new Tools(dir);
		});
	} catch (e) {}

	moddedTools.base.moddedTools = moddedTools;

	return moddedTools.base;
})();
