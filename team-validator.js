/**
 * Team Validator
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Handles team validation, and specifically learnset checking.
 *
 * @license MIT license
 */

if (!process.send) {
	var validationCount = 0;
	var pendingValidations = {};

	var ValidatorProcess = (function() {
		function ValidatorProcess() {
			this.process = require('child_process').fork('team-validator.js');
			var self = this;
			this.process.on('message', function(message) {
				// Protocol:
				// success: "[id]|1[details]"
				// failure: "[id]|0[details]"
				var pipeIndex = message.indexOf('|');
				var id = message.substr(0,pipeIndex);
				var success = (message.charAt(pipeIndex+1) === '1');

				if (pendingValidations[id]) {
					ValidatorProcess.release(self);
					pendingValidations[id](success, message.substr(pipeIndex+2));
					delete pendingValidations[id];
				}
			});
		}
		ValidatorProcess.prototype.load = 0;
		ValidatorProcess.prototype.active = true;
		ValidatorProcess.processes = [];
		ValidatorProcess.spawn = function() {
			var num = config.validatorprocesses || 1;
			for (var i = 0; i < num; ++i) {
				this.processes.push(new ValidatorProcess());
			}
		};
		ValidatorProcess.respawn = function() {
			this.processes.splice(0).forEach(function(process) {
				process.active = false;
				if (!process.load) process.process.disconnect();
			});
			this.spawn();
		};
		ValidatorProcess.acquire = function() {
			var process = this.processes[0];
			for (var i = 1; i < this.processes.length; ++i) {
				if (this.processes[i].load < process.load) {
					process = this.processes[i];
				}
			}
			++process.load;
			return process;
		};
		ValidatorProcess.release = function(process) {
			--process.load;
			if (!process.load && !process.active) {
				process.process.disconnect();
			}
		};
		ValidatorProcess.send = function(format, team, callback) {
			var process = this.acquire();
			pendingValidations[validationCount] = callback;
			process.process.send(''+validationCount+'|'+format+'|'+team);
			++validationCount;
		};
		return ValidatorProcess;
	})();

	// Create the initial set of validator processes.
	ValidatorProcess.spawn();

	exports.ValidatorProcess = ValidatorProcess;
	exports.pendingValidations = pendingValidations;

	exports.validateTeam = function(format, team, callback) {
		ValidatorProcess.send(format, team, callback);
	};

	var synchronousValidators = {};
	exports.validateTeamSync = function(format, team) {
		if (!synchronousValidators[format]) synchronousValidators[format] = new Validator(format);
		return synchronousValidators[format].validateTeam(team);
	};
	exports.validateSetSync = function(format, set, teamHas) {
		if (!synchronousValidators[format]) synchronousValidators[format] = new Validator(format);
		return synchronousValidators[format].validateSet(set, teamHas);
	};
	exports.checkLearnsetSync = function(format, move, template, lsetData) {
		if (!synchronousValidators[format]) synchronousValidators[format] = new Validator(format);
		return synchronousValidators[format].checkLearnset(move, template, lsetData);
	};
} else {
	require('sugar');
	global.fs = require('fs');
	global.config = require('./config/config.js');

	if (config.crashguard) {
		process.on('uncaughtException', function (err) {
			require('./crashlogger.js')(err, 'A team validator process');
		});
	}

	/**
	 * Converts anything to an ID. An ID must have only lowercase alphanumeric
	 * characters.
	 * If a string is passed, it will be converted to lowercase and
	 * non-alphanumeric characters will be stripped.
	 * If an object with an ID is passed, its ID will be returned.
	 * Otherwise, an empty string will be returned.
	 */
	global.toId = function(text) {
		if (text && text.id) text = text.id;
		else if (text && text.userid) text = text.userid;

		return string(text).toLowerCase().replace(/[^a-z0-9]+/g, '');
	};
	global.toUserid = toId;

	/**
	 * Validates a username or Pokemon nickname
	 */
	var bannedNameStartChars = {'~':1, '&':1, '@':1, '%':1, '+':1, '-':1, '!':1, '?':1, '#':1, ' ':1};
	global.toName = function(name) {
		name = string(name);
		name = name.replace(/[\|\s\[\]\,]+/g, ' ').trim();
		while (bannedNameStartChars[name.charAt(0)]) {
			name = name.substr(1);
		}
		if (name.length > 18) name = name.substr(0,18);
		if (config.namefilter) {
			name = config.namefilter(name);
		}
		return name.trim();
	};

	/**
	 * Safely ensures the passed variable is a string
	 * Simply doing ''+str can crash if str.toString crashes or isn't a function
	 * If we're expecting a string and being given anything that isn't a string
	 * or a number, it's safe to assume it's an error, and return ''
	 */
	global.string = function(str) {
		if (typeof str === 'string' || typeof str === 'number') return ''+str;
		return '';
	}

	global.Tools = require('./tools.js');

	var validators = {};

	function respond(id, success, details) {
		process.send(id+(success?'|1':'|0')+details);
	}

	process.on('message', function(message) {
		// protocol:
		// "[id]|[format]|[team]"
		var pipeIndex = message.indexOf('|');
		var pipeIndex2 = message.indexOf('|', pipeIndex + 1);
		var id = message.substr(0, pipeIndex);
		var format = message.substr(pipeIndex + 1, pipeIndex2 - pipeIndex - 1);

		if (!validators[format]) validators[format] = new Validator(format);
		var parsedTeam = {};
		try {
			var parsedTeam = JSON.parse(message.substr(pipeIndex2 + 1));
		} catch (e) {
			respond(id, false, "Your team was invalid and could not be parsed.");
			return;
		}
		var problems = validators[format].validateTeam(parsedTeam);
		if (problems && problems.length) {
			respond(id, false, problems.join('\n'));
		} else {
			respond(id, true, JSON.stringify(parsedTeam));
		}
	});
}

var Validator = (function() {
	function Validator(format) {
		this.format = Tools.getFormat(format);
		this.tools = Tools.mod(this.format);
	}

	Validator.prototype.validateTeam = function(team) {
		var format = this.format;
		var tools = this.tools;

		var problems = [];
		tools.getBanlistTable(format);
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
			if (!team[i]) return ["You sent invalid team data. If you're not using a custom client, please report this as a bug."];
			var setProblems = this.validateSet(team[i], teamHas);
			if (setProblems) {
				problems = problems.concat(setProblems);
			}
		}

		for (var i=0; i<format.teamBanTable.length; i++) {
			var bannedCombo = true;
			for (var j=0; j<format.teamBanTable[i].length; j++) {
				if (!teamHas[format.teamBanTable[i][j]]) {
					bannedCombo = false;
					break;
				}
			}
			if (bannedCombo) {
				var clause = format.name ? " by "+format.name : '';
				problems.push("Your team has the combination of "+format.teamBanTable[i].join('+')+", which is banned"+clause+".");
			}
		}

		if (format.ruleset) {
			for (var i=0; i<format.ruleset.length; i++) {
				var subformat = tools.getFormat(format.ruleset[i]);
				if (subformat.validateTeam) {
					problems = problems.concat(subformat.validateTeam.call(tools, team, format)||[]);
				}
			}
		}
		if (format.validateTeam) {
			problems = problems.concat(format.validateTeam.call(tools, team, format)||[]);
		}

		if (!problems.length) return false;
		return problems;
	};

	Validator.prototype.validateSet = function(set, teamHas) {
		var format = this.format;
		var tools = this.tools;

		var problems = [];
		if (!set) {
			return ["This is not a Pokemon."];
		}

		var template = tools.getTemplate(string(set.species));
		if (!template.exists) {
			return ["The Pokemon '"+set.species+"' does not exist."];
		}
		set.species = template.species;

		set.name = toName(set.name);
		var item = tools.getItem(string(set.item));
		set.item = item.name;
		var ability = tools.getAbility(string(set.ability));
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

		var nameTemplate = tools.getTemplate(set.name);
		if (nameTemplate.exists && nameTemplate.name.toLowerCase() === set.name.toLowerCase()) set.name = null;
		set.species = set.species;
		set.name = set.name || set.species;
		var name = set.species;
		if (set.species !== set.name) name = set.name + " ("+set.species+")";
		var isHidden = false;
		var lsetData = {set:set, format:format};

		var setHas = {};

		if (!template || !template.abilities) {
			set.species = 'Unown';
			template = tools.getTemplate('Unown');
		}

		if (format.ruleset) {
			for (var i=0; i<format.ruleset.length; i++) {
				var subformat = tools.getFormat(format.ruleset[i]);
				if (subformat.validateSet) {
					problems = problems.concat(subformat.validateSet.call(tools, set, format)||[]);
				}
			}
		}
		template = tools.getTemplate(set.species);
		item = tools.getItem(set.item);
		if (item.id && !item.exists) {
			return ['"'+set.item+"' is an invalid item."];
		}
		ability = tools.getAbility(set.ability);

		var banlistTable = tools.getBanlistTable(format);

		var check = template.id;
		var clause = '';
		setHas[check] = true;
		if (banlistTable[check]) {
			clause = typeof banlistTable[check] === 'string' ? " by "+ banlistTable[check] : '';
			problems.push(set.species+' is banned'+clause+'.');
		} else if (!tools.data.FormatsData[check] || !tools.data.FormatsData[check].tier) {
			check = toId(template.baseSpecies);
			if (banlistTable[check]) {
				clause = typeof banlistTable[check] === 'string' ? " by "+ banlistTable[check] : '';
				problems.push(template.baseSpecies+' is banned'+clause+'.');
			}
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
		if (banlistTable['illegal'] && item.isUnreleased) {
			problems.push(name+"'s item "+set.item+" is unreleased.");
		}
		if (banlistTable['Unreleased'] && template.isUnreleased) {
			if (!format.requirePentagon || (template.eggGroups[0] === 'Undiscovered' && !template.evos)) {
				problems.push(name+" ("+template.species+") is unreleased.");
			}
		}
		setHas[toId(set.ability)] = true;
		if (banlistTable['illegal']) {
			var totalEV = 0;
			for (var k in set.evs) {
				if (typeof set.evs[k] !== 'number' || set.evs[k] < 0) {
					set.evs[k] = 0;
				}
				totalEV += set.evs[k];
			}
			// In gen 1 and 2, it was possible to max out all EVs
			if (tools.gen >= 3 && totalEV > 510) {
				problems.push(name+" has more than 510 total EVs.");
			}

			// Don't check abilities for metagames with All Abilities
			if (tools.gen <= 2) {
				set.ability = 'None';
			} else if (!banlistTable['ignoreillegalabilities']) {
				if (!ability.name) {
					problems.push(name+" needs to have an ability.");
				} else if (ability.name !== template.abilities['0'] &&
					ability.name !== template.abilities['1'] &&
					ability.name !== template.abilities['H']) {
					problems.push(name+" can't have "+set.ability+".");
				}
				if (ability.name === template.abilities['H']) {
					isHidden = true;

					if (template.unreleasedHidden && banlistTable['illegal']) {
						problems.push(name+"'s hidden ability is unreleased.");
					} else if (tools.gen === 5 && set.level < 10 && (template.maleOnlyHidden || template.gender === 'N')) {
						problems.push(name+" must be at least level 10 with its hidden ability.");
					}
					if (template.maleOnlyHidden) {
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
			// in the cartridge-compliant set validator: rulesets.js:pokemon
			set.moves = set.moves.slice(0,24);

			for (var i=0; i<set.moves.length; i++) {
				if (!set.moves[i]) continue;
				var move = tools.getMove(string(set.moves[i]));
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
							if (isHidden) {
								problemString = problemString.concat(" because it's incompatible with its ability or another move.");
							} else {
								problemString = problemString.concat(" because it's incompatible with another move.");
							}
						} else if (problem.type === 'oversketched') {
							problemString = problemString.concat(" because it can only sketch "+problem.maxSketches+" move"+(problem.maxSketches>1?"s":"")+".");
						} else if (problem.type === 'pokebank') {
							problemString = problemString.concat(" because it's only obtainable from a previous generation.");
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
					var eventTemplate = tools.getTemplate(splitSource[1]);
					if (eventTemplate.eventPokemon) eventData = eventTemplate.eventPokemon[parseInt(splitSource[0],10)];
					if (eventData) {
						if (eventData.nature && eventData.nature !== set.nature) {
							problems.push(name+" must have a "+eventData.nature+" nature because it comes from a specific event.");
						}
						if (eventData.shiny) {
							set.shiny = true;
						}
						if (eventData.generation < 5) eventData.isHidden = false;
						if (eventData.isHidden !== undefined && eventData.isHidden !== isHidden) {
							problems.push(name+(isHidden?" can't have":" must have")+" its hidden ability because it comes from a specific event.");
						}
						if (tools.gen <= 5 && eventData.abilities && eventData.abilities.indexOf(ability.id) < 0) {
							problems.push(name+" must have "+eventData.abilities.join(" or ")+" because it comes from a specific event.");
						}
						if (eventData.gender) {
							set.gender = eventData.gender;
						}
						if (eventData.level && set.level < eventData.level) {
							problems.push(name+" must be at least level "+eventData.level+" because it comes from a specific event.");
						}
					}
					isHidden = false;
				}
			}
			if (isHidden && lsetData.sourcesBefore < 5) {
				if (!lsetData.sources) {
					problems.push(name+" has a hidden ability - it can't have moves only learned before gen 5.");
				} else if (template.gender) {
					var compatibleSource = false;
					for (var i=0,len=lsetData.sources.length; i<len; i++) {
						if (lsetData.sources[i].charAt(1) === 'E' || (lsetData.sources[i].substr(0,2) === '5D' && set.level >= 10)) {
							compatibleSource = true;
							break;
						}
					}
					if (!compatibleSource) {
						problems.push(name+" has moves incompatible with its hidden ability.");
					}
				}
			}
			if (set.level < template.evoLevel) {
				// FIXME: Event pokemon given at a level under what it normally can be attained at gives a false positive
				problems.push(name+" must be at least level "+template.evoLevel+".");
			}
			if (!lsetData.sources && lsetData.sourcesBefore <= 3 && tools.getAbility(set.ability).gen === 4 && !template.prevo && tools.gen <= 5) {
				problems.push(name+" has a gen 4 ability and isn't evolved - it can't use anything from gen 3.");
			}
			if (!lsetData.sources && lsetData.sourcesBefore >= 3 && (isHidden || tools.gen <= 5) && template.gen <= lsetData.sourcesBefore) {
				var oldAbilities = tools.mod('gen'+lsetData.sourcesBefore).getTemplate(set.species).abilities;
				if (ability.name !== oldAbilities['0'] && ability.name !== oldAbilities['1'] && ability.name !== oldAbilities['H']) {
					problems.push(name+" has moves incompatible with its ability.");
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
			var bannedCombo = true;
			for (var j=0; j<format.setBanTable[i].length; j++) {
				if (!setHas[format.setBanTable[i][j]]) {
					bannedCombo = false;
					break;
				}
			}
			if (bannedCombo) {
				clause = format.name ? " by "+format.name : '';
				problems.push(name+" has the combination of "+format.setBanTable[i].join('+')+", which is banned"+clause+".");
			}
		}

		if (format.validateSet) {
			problems = problems.concat(format.validateSet.call(tools, set, format)||[]);
		}

		if (!problems.length) return false;
		return problems;
	};

	Validator.prototype.checkLearnset = function(move, template, lsetData) {
		var tools = this.tools;

		move = toId(move);
		template = tools.getTemplate(template);

		lsetData = lsetData || {};
		var set = (lsetData.set || (lsetData.set={}));
		var format = (lsetData.format || (lsetData.format={}));
		var alreadyChecked = {};
		var level = set.level || 100;

		var limit1 = true;
		var sketch = false;

		var sometimesPossible = false; // is this move in the learnset at all?

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
		var noPastGen = format.requirePentagon;

		do {
			alreadyChecked[template.speciesid] = true;
			// Stabmons hack to avoid copying all of validateSet to formats.
			if (format.id === 'stabmons' && template.types.indexOf(tools.getMove(move).type) > -1) return false;
			if (template.learnset) {
				if (template.learnset[move] || template.learnset['sketch']) {
					sometimesPossible = true;
					var lset = template.learnset[move];
					if (!lset || template.speciesid === 'smeargle') {
						lset = template.learnset['sketch'];
						sketch = true;
						// Chatter, Struggle and Magikarp's Revenge cannot be sketched
						if (move in {'chatter':1, 'struggle':1, 'magikarpsrevenge':1}) return true;
					}
					if (typeof lset === 'string') lset = [lset];

					for (var i=0, len=lset.length; i<len; i++) {
						var learned = lset[i];
						if (noPastGen && learned.charAt(0) !== '6') continue;
						if (parseInt(learned.charAt(0),10) > tools.gen) continue;
						if (!template.isNonstandard) {
							// HMs can't be transferred
							if (tools.gen >= 4 && learned.charAt(0) <= 3 && move in {'cut':1, 'fly':1, 'surf':1, 'strength':1, 'flash':1, 'rocksmash':1, 'waterfall':1, 'dive':1}) continue;
							if (tools.gen >= 5 && learned.charAt(0) <= 4 && move in {'cut':1, 'fly':1, 'surf':1, 'strength':1, 'rocksmash':1, 'waterfall':1, 'rockclimb':1}) continue;
						}
						if (learned.substr(0,2) in {'4L':1,'5L':1,'6L':1}) {
							// gen 4-6 level-up moves
							if (level >= parseInt(learned.substr(2),10)) {
								// we're past the required level to learn it
								return false;
							}
							if (!template.gender || template.gender === 'F') {
								// available as egg move
								learned = learned.charAt(0)+'Eany';
							} else {
								// this move is unavailable, skip it
								continue;
							}
						}
						if (learned.charAt(1) in {L:1,M:1,T:1}) {
							if (learned.charAt(0) === '6') {
								// current-gen TM or tutor moves:
								//   always available
								return false;
							}
							// past-gen level-up, TM, or tutor moves:
							//   available as long as the source gen was or was before this gen
							limit1 = false;
							sourcesBefore = Math.max(sourcesBefore, parseInt(learned.charAt(0),10));
						} else if (learned.charAt(1) in {E:1,S:1,D:1}) {
							// egg, event, or DW moves:
							//   only if that was the source
							if (learned.charAt(1) === 'E') {
								// it's an egg move, so we add each pokemon that can be bred with to its sources
								if (learned.charAt(0) === '6') {
									// gen 6 doesn't have egg move incompatibilities
									sources.push('6E');
									continue;
								}
								var eggGroups = template.eggGroups;
								if (!eggGroups) continue;
								if (eggGroups[0] === 'Undiscovered') eggGroups = tools.getTemplate(template.evos[0]).eggGroups;
								var atLeastOne = false;
								var fromSelf = (learned.substr(1) === 'Eany');
								learned = learned.substr(0,2);
								for (var templateid in tools.data.Pokedex) {
									var dexEntry = tools.getTemplate(templateid);
									if (
										// CAP pokemon can't breed
										!dexEntry.isNonstandard &&
										// can't breed mons from future gens
										dexEntry.gen <= parseInt(learned.charAt(0),10) &&
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
							} else if (learned.charAt(1) === 'S') {
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
							if (i === 'mimic' && tools.getAbility(set.ability).gen == 4 && !template.prevo) {
								// doesn't get the glitch
							} else {
								getGlitch = true;
								break;
							}
						}
					}
					if (getGlitch) {
						sourcesBefore = Math.max(sourcesBefore, 4);
						if (tools.getMove(move).gen < 5) {
							limit1 = false;
						}
					}
				}
			}
			// also check to see if the mon's prevo or freely switchable formes can learn this move
			if (!template.learnset && template.baseSpecies !== template.species) {
				// forme takes precedence over prevo only if forme has no learnset
				template = tools.getTemplate(template.baseSpecies);
			} else if (template.prevo) {
				template = tools.getTemplate(template.prevo);
			} else if (template.speciesid === 'shaymin') {
				template = tools.getTemplate('shayminsky');
			} else if (template.baseSpecies !== template.species && template.baseSpecies !== 'Kyurem') {
				template = tools.getTemplate(template.baseSpecies);
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
			if (noPastGen && sometimesPossible) return {type:'pokebank'};
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
			lsetData.sourcesBefore = Math.min(sourcesBefore, lsetData.sourcesBefore||6);
		}

		return false;
	};

	return Validator;
})();
