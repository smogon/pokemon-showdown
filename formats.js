exports.BattleFormats = {

	// formats

	randombattle: {
		effectType: 'Format',
		name: "Random Battle",
		team: 'random',
		searchDefault: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause']
	},
	unratedrandombattle: {
		effectType: 'Format',
		name: "Unrated Random Battle",
		team: 'random',
		searchShow: true,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause']
	},
	ou: {
		effectType: 'Format',
		name: "OU",
		challengeDefault: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim']
	},
	cap: {
		effectType: 'Format',
		name: "CAP",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['CAP Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim']
	},
	capnecturnaplaytest: {
		effectType: 'Format',
		name: "CAP Necturna Playtest",
		rated: true,
		ruleset: ['CAP Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: ['Uber','G4CAP','Tomohawk','ShadowStrike','Paleo Wave']
	},
	ubers: {
		effectType: 'Format',
		name: "Ubers",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: []
	},
	uu: {
		effectType: 'Format',
		name: "UU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: ['Uber','OU','BL', 'Snow Warning','Drought']
	},
	ru: {
		effectType: 'Format',
		name: "RU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: ['Uber','OU','BL','UU','BL2', 'Snow Warning','Drought', 'Shell Smash + Baton Pass']
	},
	nu: {
		effectType: 'Format',
		name: "NU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: ['Uber','OU','BL','UU','BL2','RU','BL3', 'Snow Warning','Drought', 'Shell Smash + Baton Pass']
	},
	lc: {
		effectType: 'Format',
		name: "LC",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Sonicboom', 'Dragon Rage', 'Berry Juice', 'Carvanha', 'Meditite', 'Gligar', 'Scyther', 'Sneasel', 'Tangela', 'Vulpix', 'Yanma']
	},
	hackmons: {
		effectType: 'Format',
		name: "Hackmons",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon'],
		banlist: []
	},
	balancedhackmons: {
		effectType: 'Format',
		name: "Balanced Hackmons",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon'],
		banlist: ['OHKO', 'Wonder Guard']
	},
	haxmons: {
		effectType: 'Format',
		name: "Haxmons",
		ruleset: ['Hax Clause', 'Team Preview']
	},
	debugmode: {
		effectType: 'Format',
		name: "Debug Mode",
		challengeShow: true,
		canUseRandomTeam: true,
		// no restrictions, for serious
		ruleset: []
	},

	// rules

	standard: {
		effectType: 'Banlist',
		banlist: ['Unreleased', 'Illegal', 'OHKO', 'Moody', 'BrightPowder', 'LaxIncense', 'Minimize', 'DoubleTeam', 'Legal'],
		validateSet: function(set) {
			if (!set.name) set.name = set.species;
			var template = this.getTemplate(set.species);
			var problems = new Array();

			// limit one of each move in Standard
			var moves = [];
			if (set.moves) {
				var hasMove = {};
				for (var i=0; i<set.moves.length; i++) {
					var move = this.getMove(set.moves[i]);
					var moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(set.moves[i]);
				}
			}
			set.moves = moves;

			// Check for more than 510 total EVs
			var totalEV = 0;
			for (var k in set.evs) totalEV += set.evs[k];
			if (totalEV > 510) {
				problems.push(set.name+" ("+set.species+") has more than 510 total EVs.");
			}

			// Check that the ability used is allowed
			var ability = this.getAbility(set.ability).name;
			if (ability !== template.abilities['0'] &&
				ability !== template.abilities['1'] &&
				ability !== template.abilities['DW']) {
				problems.push(set.name+" ("+set.species+") can't have "+set.ability+".");
			}
			if (ability === template.abilities['DW']) {
				var unreleasedDW = {
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

			//
			// Check if the pokemon can have such a moveset
			// TODO:
			//   - Check pokemon prevos
			//   - Check illegal movesets
			//   - Check for sketched moves
			//

			// Split the moves in to learnable moves and unlearnable moves
			var learnableMoves = new Array();
			var unlearnableMoves = new Array();
			for (var m = 0; m < set.moves.length; ++m) {
				var move = this.getMove(set.moves[m]);
				if (template.learnset[move.id] && template.learnset[move.id].length > 0) {
					learnableMoves.push(move);
				} else {
					unlearnableMoves.push(move);
				}
			}

			for (var m = 0; m < unlearnableMoves.length; ++m) {
				problems.push(set.name + " (" + set.species + ") can't learn " + unlearnableMoves[m].name + ".");
			}

			// Parse the learnset data for the learnable moves
			var learnableMovesData = new Object();
			for (var m = 0; m < learnableMoves.length; ++m) {
				learnableMovesData[learnableMoves[m].id] = {
						isEgg: false,
						isTutor: false,
						isMachine: false,
						levelup: new Array(),
						event: new Array()
					};
				for (var l = 0; l < template.learnset[learnableMoves[m].id].length; ++l) {
					switch (template.learnset[learnableMoves[m].id][l][1]) {
						case 'L':
							learnableMovesData[learnableMoves[m].id].levelup.push(parseInt(template.learnset[learnableMoves[m].id][l].slice(2), 10));
							break;

						case 'E':
							learnableMovesData[learnableMoves[m].id].isEgg = true;
							break;

						case 'T':
							learnableMovesData[learnableMoves[m].id].isTutor = true;
							break;

						case 'M':
							learnableMovesData[learnableMoves[m].id].isMachine = true;
							break;

						case 'S':
							learnableMovesData[learnableMoves[m].id].event.push(parseInt(template.learnset[learnableMoves[m].id][l].slice(2), 10));
							break;
					}
				}
			}

			// Split the learnable moves in to event-only and non-event moves
			var allEventIds = new Array();
			var eventMoves = new Array();
			var nonEventMoves = new Array();
			for (var m = 0; m < learnableMoves.length; ++m) {
				if (learnableMovesData[learnableMoves[m].id].event.length > 0 &&
					learnableMovesData[learnableMoves[m].id].levelup.length === 0 &&
					!learnableMovesData[learnableMoves[m].id].isEgg &&
					!learnableMovesData[learnableMoves[m].id].isTutor &&
					!learnableMovesData[learnableMoves[m].id].isMachine) {
					eventMoves.push(learnableMoves[m]);
					for (var e = 0; e < learnableMovesData[learnableMoves[m].id].event.length; ++e) {
						if (allEventIds.indexOf(learnableMovesData[learnableMoves[m].id].event[e]) === -1) {
							allEventIds.push(learnableMovesData[learnableMoves[m].id].event[e]);
						}
					}
				} else {
					nonEventMoves.push(learnableMoves[m]);
				}
			}

			// If there are event moves...
			if (eventMoves.length > 0) {
				// Make sure there a no egg moves in the non-event moves
				for (var m = 0; m < nonEventMoves.length; ++m) {
					if (learnableMovesData[nonEventMoves[m].id].isEgg &&
						!learnableMovesData[nonEventMoves[m].id].isTutor &&
						!learnableMovesData[nonEventMoves[m].id].isMachine &&
						learnableMovesData[nonEventMoves[m].id].levelup.length === 0) {
						if (learnableMovesData[nonEventMoves[m].id].event.length > 0) {
							eventMoves.push(nonEventMoves[m]);
						} else {
							unlearnableMoves.push(nonEventMoves[m]);
							problems.push(set.name + " (" + set.species + ") can't learn " + nonEventMoves[m].name + " because it is an egg move but event moves are being used.");
						}
						nonEventMoves.splice(m, 1);
						--m;
					} else if (learnableMovesData[nonEventMoves[m].id].levelup.length > 0 &&
						!learnableMovesData[nonEventMoves[m].id].isTutor &&
						!learnableMovesData[nonEventMoves[m].id].isMachine) {
						var minLevelLearnt = 999;
						for (var l = 0; l < learnableMovesData[nonEventMoves[m].id].levelup.length; ++l) {
							if (learnableMovesData[nonEventMoves[m].id].levelup[l] < minLevelLearnt) {
								minLevelLearnt = learnableMovesData[nonEventMoves[m].id].levelup[l];
							}
						}
						if (minLevelLearnt > set.level) {
							if (learnableMovesData[nonEventMoves[m].id].event.length > 0) {
								eventMoves.push(nonEventMoves[m]);
							} else {
								unlearnableMoves.push(nonEventMoves[m]);
								problems.push(set.name + " (" + set.species + ") can't learn " + nonEventMoves[m].name + " because it is an egg move at this level but event moves are being used.");
							}
							nonEventMoves.splice(m, 1);
							--m;
						}
					}
				}

				// Check that all the event moves come from a single event
				var possibleEventIds = new Array();
				for (var i = 0; i < allEventIds.length; ++i) {
					var isPossible = true;
					for (var e = 0; e < eventMoves.length; ++e) {
						if (learnableMovesData[eventMoves[e].id].event.indexOf(allEventIds[i]) === -1) {
							isPossible = false;
							break;
						}
					}
					if (isPossible) possibleEventIds.push(allEventIds[i]);
				}
				if (possibleEventIds.length === 0) {
					var problemMessage = set.name + "'s (" + set.species + ") moves ";
					for (var e = 0; e < eventMoves.length; ++e) {
						problemMessage += eventMoves[e].name;
						if (e + 2 === eventMoves.length) {
							problemMessage += " and ";
						} else if (e + 1 !== eventMoves.length) {
							problemMessage += ", ";
						}
					}
					problemMessage += " come from more than one event.";
					problems.push(problemMessage);
				} else {
					// Make sure the nature, ability, gender and level of the pokemon matches one of the possible events
					var possibleNatures = new Array();
					var possibleAbilities = new Array();
					var possibleGenders = "N/A";
					var minLevel = 999;
					for (var i = 0; i < possibleEventIds.length; ++i) {
						possibleNatures.push(template.eventPokemon[possibleEventIds[i]].nature);
						possibleAbilities = possibleAbilities.concat(template.eventPokemon[possibleEventIds[i]].abilities);

						var gender = template.eventPokemon[possibleEventIds[i]].gender;
						if (possibleGenders === "N/A") {
							possibleGenders = gender;
						} else if (gender === "M/F" ||
							(possibleGenders === "M" && gender === "F") ||
							(possibleGenders === "F" && gender === "M")) {
							possibleGenders = "M/F";
						}
						if (template.eventPokemon[possibleEventIds[i]].level < minLevel) {
							minLevel = template.eventPokemon[possibleEventIds[i]].level;
						}
					}
					if (possibleNatures.indexOf("Any") === -1 &&
						possibleNatures.indexOf(set.nature) === -1) {
						problems.push(set.name + " (" + set.species + ") can't have a " + set.nature.toLowerCase() + " nature because it uses an event move and none of the event pokemon have it.");
					}
					if (possibleAbilities.indexOf(set.ability.toLowerCase().replace(/[^a-z0-9]+/g, "")) === -1) {
						problems.push(set.name + " (" + set.species + ") can't have " + set.ability + " because it uses an event move and none of the event pokemon have it.");
					}
					if (!set.gender) {
						set.gender = possibleGenders;
						if (set.gender === "M/F") {
							set.gender = Math.random() > 0.5 ? "M" : "F";
						}
					}
					if (possibleGenders === "N/A" && set.gender !== "N" && set.gender !== "N/A") {
						problems.push(set.name + " (" + set.species + ") can't have a gender.");
					} else if (possibleGenders === "M" && set.gender === "F") {
						problems.push(set.name + " (" + set.species + ") must be male because it uses an event move and none of the event pokemon are female.");
					} else if (possibleGenders === "F" && set.gender === "M") {
						problems.push(set.name + " (" + set.species + ") must be female because it uses an event move and none of the event pokemon are male.");
					}
					if (set.level < minLevel) {
						problems.push(set.name + " (" + set.species + ") must be at least level " + minLevel + " because it uses an event move and none of the event pokemon are given out under that level.");
					}
				}
			}

			return problems;
		}
	},
	pokemon: {
		effectType: 'Banlist',
		validateSet: function(set, format) {
			var item = this.getItem(set.item);
			var template = this.getTemplate(set.species);
			var problems = [];

			if (set.species === set.name) delete set.name;
			if (template.num == 493) { // Arceus
				if (set.ability === 'Multitype' && item.onPlate) {
					set.species = 'Arceus-'+item.onPlate;
				} else {
					set.species = 'Arceus';
				}
			}
			if (template.num == 487) { // Giratina
				if (item.id === 'GriseousOrb') {
					set.species = 'Giratina-O';
				} else {
					set.species = 'Giratina';
				}
			}
			if (template.num == 555) { // Darmanitan
				set.species = 'Darmanitan';
			}
			if (template.num == 648) { // Meloetta
				set.species = 'Meloetta';
			}
			if (template.num == 351) { // Castform
				set.species = 'Castform';
			}
			if (template.num == 421) { // Cherrim
				set.species = 'Cherrim';
			}
			if (template.isNonstandard) {
				problems.push(set.species+' is not a real pokemon.');
			}
			if (set.moves) for (var i=0; i<set.moves.length; i++) {
				var move = this.getMove(set.moves[i]);
				if (!move) {
					set.moves.splice(i, 1);
					--i;
					continue;
				}
				if (move.isNonstandard) {
					problems.push(move.name+' is not a real move.');
				}
			}
			if (set.moves && set.moves.length > 4) {
				problems.push((set.name||set.species) + ' has more than four moves.');
			}
			return problems;
		}
	},
	cappokemon: {
		effectType: 'Rule',
		validateSet: function(set, format) {
			// don't return
			this.getEffect('Pokemon').validateSet.call(this, set, format);
		}
	},
	legal: {
		effectType: 'Banlist',
		banlist: ['Crobat+BraveBird+Hypnosis']
	},
	potd: {
		effectType: 'Rule',
		onPotD: '',
		onStart: function() {
			if (this.effect.onPotD) {
				this.add('rule', 'Pokemon of the Day: '+this.effect.onPotD);
			}
		}
	},
	teampreview: {
		onStartPriority: -10,
		onStart: function() {
			this.add('clearpoke');
			for (var i=0; i<this.sides[0].pokemon.length; i++) {
				this.add('poke', this.sides[0].pokemon[i].side.id, this.sides[0].pokemon[i].details);
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++) {
				this.add('poke', this.sides[1].pokemon[i].side.id, this.sides[1].pokemon[i].details);
			}
		},
		onTeamPreview: function() {
			this.callback('team-preview');
		}
	},
	littlecup: {
		effectType: 'Rule',
		validateSet: function(set) {
			var template = this.getTemplate(set.species || set.name)

			if (template.prevo) {
				return [set.species+" isn't the first in its evolution family."];
			}
			if (!template.nfe) {
				return [set.species+" doesn't have an evolution family."];
			}
			if (!set.level || set.level > 5) {
				set.level = 5;
			}
		}
	},
	haxclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Hax Clause');
		},
		onModifyMovePriority: -100,
		onModifyMove: function(move) {
			if (move.secondary) {
				move.secondary.chance = 100;
			}
			if (move.accuracy !== true && move.accuracy <= 99) {
				move.accuracy = 0;
			}
			move.willCrit = true;
		}
	},
	speciesclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Species Clause');
		},
		validateTeam: function(team, format) {
			var speciesTable = {};
			for (var i=0; i<team.length; i++) {
				var template = this.getTemplate(team[i].species);
				if (speciesTable[template.num]) {
					return [template.name+" is banned by Species Clause."];
				}
				speciesTable[template.num] = true;
			}
		}
	},
	sleepclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Sleep Clause');
		},
		onSetStatus: function(status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'slp') {
				for (var i=0; i<target.side.pokemon.length; i++) {
					var pokemon = target.side.pokemon[i];
					if (pokemon.status === 'slp') {
						if (!pokemon.statusData.source ||
							pokemon.statusData.source.side !== pokemon.side) {
							this.add('message', 'Sleep Clause activated.');
							return false;
						}
					}
				}
			}
		}
	},
	freezeclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Freeze Clause');
		}
	}
};
