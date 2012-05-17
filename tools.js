function BattleTools() {
	var selfT = this;
	this.effectToString = function() {
		return this.name;
	};
	this.getImmunity = function(type, target) {
		for (var i=0; i<target.types.length; i++) {
			if (BattleTypeChart[target.types[i]] && BattleTypeChart[target.types[i]].damageTaken && BattleTypeChart[target.types[i]].damageTaken[type] === 3) {
				return false;
			}
		}
		return true;
	};
	this.getEffectiveness = function(type, target) {
		var totalTypeMod = 0;
		for (var i=0; i<target.types.length; i++) {
			if (!BattleTypeChart[target.types[i]]) continue;
			var typeMod = BattleTypeChart[target.types[i]].damageTaken[type];
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
	this.getTemplate = function(template) {
		if (!template || typeof template === 'string') {
			var name = (template||'').trim();
			var id = toId(name);
			if (BattleAliases[id]) {
				name = BattleAliases[id];
				id = toId(name);
			}
			template = {};
			if (id && BattlePokedex[id]) {
				template = BattlePokedex[id];
				template.exists = true;
			}
			name = template.species || template.name || name;
			if (BattleFormatsData[id]) {
				template.tier = BattleFormatsData[id].tier;
				template.isNonstandard = BattleFormatsData[id].isNonstandard;
				template.viableMoves = BattleFormatsData[id].viableMoves;
				template.requiredItem = BattleFormatsData[id].requiredItem;
				template.eventPokemon = BattleFormatsData[id].eventPokemon;
			}
			if (BattleLearnsets[id]) {
				template.learnset = BattleLearnsets[id].learnset;
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
	this.getMove = function(move) {
		if (!move || typeof move === 'string') {
			var name = (move||'').trim();
			var id = toId(name);
			move = {};
			if (id.substr(0,12) === 'HiddenPower[') {
				var hptype = id.substr(12);
				hptype = hptype.substr(0,hptype.length-1);
				id = 'HiddenPower'+hptype;
			}
			if (id && BattleMovedex[id]) {
				move = BattleMovedex[id];
				move.exists = true;
			}
			if (!move.id) move.id = id;
			if (!move.name) move.name = name;
			if (!move.fullname) move.fullname = 'move: '+name;
			move.toString = selfT.effectToString;
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
	this.getMoveCopy = function(move) {
		if (move && move.isCopy) return move;
		var move = this.getMove(move);
		var moveCopy = Object.clone(move, true);
		moveCopy.isCopy = true;
		return moveCopy;
	};
	this.getNature = function(nature) {
		return BattleScripts.getNature.call(selfT, nature);
	};
	this.getEffect = function(effect) {
		if (!effect || typeof effect === 'string') {
			var name = (effect||'').trim();
			var id = toId(name);
			effect = {};
			if (id && BattleStatuses[id]) {
				effect = BattleStatuses[id];
				effect.name = effect.name || BattleStatuses[id].name;
			} else if (id && BattleMovedex[id] && BattleMovedex[id].effect) {
				effect = BattleMovedex[id].effect;
				effect.name = effect.name || BattleMovedex[id].name;
			} else if (id && BattleAbilities[id] && BattleAbilities[id].effect) {
				effect = BattleAbilities[id].effect;
				effect.name = effect.name || BattleAbilities[id].name;
			} else if (id && BattleItems[id] && BattleItems[id].effect) {
				effect = BattleItems[id].effect;
				effect.name = effect.name || BattleItems[id].name;
			} else if (id && BattleFormats[id]) {
				effect = BattleFormats[id];
				effect.name = effect.name || BattleFormats[id].name;
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
			effect.toString = selfT.effectToString;
			if (!effect.category) effect.category = 'Effect';
			if (!effect.effectType) effect.effectType = 'Effect';
		}
		return effect;
	};
	this.getItem = function(item) {
		if (!item || typeof item === 'string') {
			var name = (item||'').trim();
			var id = toId(name);
			item = {};
			if (id && BattleItems[id]) {
				item = BattleItems[id];
				item.exists = true;
			}
			if (!item.id) item.id = id;
			if (!item.name) item.name = name;
			if (!item.fullname) item.fullname = 'item: '+name;
			item.toString = selfT.effectToString;
			if (!item.category) item.category = 'Effect';
			if (!item.effectType) item.effectType = 'Item';
			if (item.isBerry) item.fling = { basePower: 10 };
		}
		return item;
	};
	this.getAbility = function(ability) {
		if (!ability || typeof ability === 'string') {
			var name = (ability||'').trim();
			var id = toId(name);
			ability = {};
			if (id && BattleAbilities[id]) {
				ability = BattleAbilities[id];
				ability.exists = true;
			}
			if (!ability.id) ability.id = id;
			if (!ability.name) ability.name = name;
			if (!ability.fullname) ability.fullname = 'ability: '+name;
			ability.toString = selfT.effectToString;
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
	this.getType = function(type) {
		if (!type || typeof type === 'string') {
			var id = toId(type);
			type = {};
			if (id && BattleTypeChart[id]) {
				type = BattleTypeChart[id];
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


	this.checkLearnset = function(move, template, lsetData) {
		lsetData = lsetData || {};
		var alreadyChecked = {};
		if (move.id) move = move.id;
		do {
			alreadyChecked[template.speciesid] = true;
			if (template.learnset) {
				if (template.learnset[move]) {
					return true;
				}
				if (template.learnset['sketch']) {
					var lset = template.learnset['sketch'];
					if (typeof lset === 'string') lset = [lset];
					for (var i=0; i<lset.length; i++) if (lset[i].substr(1) !== 'E') return true;
					return 1;
				}
			}
			if (template.speciesid === 'shaymin') {
				template = selfT.getTemplate('shayminsky');
			} else if (template.basespecies !== template.species) {
				template = selfT.getTemplate(template.basespecies);
			} else {
				template = selfT.getTemplate(template.prevo);
			}
		} while (template && template.species && !alreadyChecked[template.speciesid]);
		return false;
	};
	this.getBanlistTable = function(format, subformat, depth) {
		var banlistTable;
		if (!depth) depth = 0;
		if (depth>4) return; // avoid infinite recursion
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

					banlistTable[subformat.banlist[i]] = true;
					banlistTable[toId(subformat.banlist[i])] = true;

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

					banlistTable['Rule:'+toId(subformat.ruleset[i])] = true;

					var subsubformat = selfT.getEffect(subformat.ruleset[i]);
					if (subsubformat.ruleset || subsubformat.banlist) {
						selfT.getBanlistTable(format, subsubformat, depth+1);
					}
				}
			}
		}
		return banlistTable;
	};
	this.validateTeam = function(team, format) {
		var problems = [];
		format = selfT.getEffect(format);
		selfT.getBanlistTable(format);
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
			var setProblems = selfT.validateSet(team[i], format, teamHas);
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
				problems.push("Your team has the combination of "+bannedCombo+", which is banned.");
			}
		}

		if (format.ruleset) {
			for (var i=0; i<format.ruleset.length; i++) {
				var subformat = selfT.getEffect(format.ruleset[i]);
				if (subformat.validateTeam) {
					problems = problems.concat(subformat.validateTeam.call(selfT, team, format)||[]);
				}
			}
		}
		if (format.validateTeam) {
			problems = problems.concat(format.validateTeam.call(selfT, team, format)||[]);
		}

		if (!problems.length) return false;
		return problems;
	};
	this.validateSet = function(set, format, teamHas) {
		var problems = [];
		format = selfT.getEffect(format);
		if (!set) {
			return ["This is not a pokemon."];
		}

		set.species = (''+(set.species||'')).trim();
		set.name = (''+(set.name||'')).trim();
		set.item = ''+(set.item||'');
		set.ability = ''+(set.ability||'');
		if (!Array.isArray(set.moves)) set.moves = [];

		set.species = set.species || set.name || 'Bulbasaur';
		set.name = set.name || set.species;
		var template = selfT.getTemplate(set.species);
		var source = '';

		var setHas = {};

		if (!template || !template.abilities) {
			set.species = 'Bulbasaur';
			template = selfT.getTemplate('Bulbasaur')
		}

		var banlistTable = selfT.getBanlistTable(format);

		setHas[toId(set.species)] = true;
		if (banlistTable[toId(set.species)]) {
			problems.push(set.species+' is banned.');
		}
		setHas[toId(set.ability)] = true;
		if (banlistTable[toId(set.ability)]) {
			problems.push(set.name+"'s ability "+set.ability+" is banned.");
		}
		setHas[toId(set.item)] = true;
		if (banlistTable[toId(set.item)]) {
			problems.push(set.name+"'s item "+set.item+" is banned.");
		}
		var item = selfT.getItem(set.item);
		if (banlistTable['Unreleased'] && item.isUnreleased) {
			problems.push(set.name+"'s item "+set.item+" is unreleased.");
		}
		setHas[toId(set.ability)] = true;
		if (banlistTable['Rule:standard']) {
			var totalEV = 0;
			for (var k in set.evs) {
				totalEV += set.evs[k];
			}
			if (totalEV > 510) {
				problems.push(set.name+" has more than 510 total EVs.");
			}

			var ability = selfT.getAbility(set.ability).name;
			if (ability !== template.abilities['0'] &&
				ability !== template.abilities['1'] &&
				ability !== template.abilities['DW']) {
				problems.push(set.name+" ("+set.species+") can't have "+set.ability+".");
			}
			if (ability === template.abilities['DW']) {
				source = 'DW';

				unreleasedDW = {
					Serperior: 1, Chandelure: 1, Ditto: 1,
					Breloom: 1, Zapdos: 1, Feraligatr: 1, Gothitelle: 1,
					'Ho-Oh': 1, Lugia: 1, Raikou: 1, Cinccino: 1
				};

				if (unreleasedDW[set.species] && banlistTable['Unreleased']) {
					problems.push(set.name+" ("+set.species+")'s Dream World ability is unreleased.");
				} else if (template.num >= 494 && set.species !== 'Darmanitan' && set.species !== 'Munna') {
					problems.push(set.name+" ("+set.species+")'s Dream World ability is unreleased.");
				}
			}
		}
		var limit1 = 0;
		if (!set.moves || !set.moves.length) {
			problems.push(set.name+" has no moves.");
		} else {
			// A limit is imposed here to prevent too much engine strain or
			// too much layout deformation - to be exact, this is the Debug
			// Mode limitation.
			// The usual limit of 4 moves is handled elsewhere - currently
			// in the cartridge-compliant set validator: formats.js:pokemon
			set.moves = set.moves.slice(0,24);

			for (var i=0; i<set.moves.length; i++) {
				if (!set.moves[i]) continue;
				set.moves[i] = ''+(set.moves[i]||'');
				var move = selfT.getMove(set.moves[i]);
				setHas[move.id] = true;
				if (banlistTable[move.id]) {
					problems.push(set.name+"'s move "+set.moves[i]+" is banned.");
				} else if (move.ohko && banlistTable['OHKO']) {
					problems.push(set.name+"'s move "+set.moves[i]+" is an OHKO move, which is banned.");
				}

				if (banlistTable['Rule:standard']) {
					var lset = selfT.checkLearnset(move, template);
					if (!lset) {
						problems.push(set.name+" ("+set.species+") can't learn "+move.name);
					} else if (lset === 1) {
						limit1++;
						if (limit1 > 1) {
							problems.push(set.name+" ("+set.species+") can't Sketch "+move.name+" - it's limited to 1 Sketch move");
						}
					}
				}
			}
		}
		setHas[toId(template.tier)] = true;
		if (banlistTable[template.tier]) {
			problems.push(set.name+" is in "+template.tier+", which is banned.");
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
				problems.push(set.name+" has the combination of "+bannedCombo+", which is banned.");
			}
		}

		if (format.ruleset) {
			for (var i=0; i<format.ruleset.length; i++) {
				var subformat = selfT.getEffect(format.ruleset[i]);
				if (subformat.validateSet) {
					problems = problems.concat(subformat.validateSet.call(selfT, set, format)||[]);
				}
			}
		}
		if (format.validateSet) {
			problems = problems.concat(format.validateSet.call(selfT, set, format)||[]);
		}

		if (!problems.length) return false;
		return problems;
	};

	/* for (var i in BattleScripts) {
		var script = BattleScripts[i];
		this[i] = function() {
			return script.apply(selfT, arguments);
		};
	} */
}

exports.BattleTools = BattleTools;
