/**
 * Team Validator
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Handles team validation, and specifically learnset checking.
 *
 * @license MIT license
 */

var Validator;

if (!process.send) {
	var validationCount = 0;
	var pendingValidations = {};

	var ValidatorProcess = (function () {
		function ValidatorProcess() {
			this.process = require('child_process').fork('team-validator.js', {cwd: __dirname});
			var self = this;
			this.process.on('message', function (message) {
				// Protocol:
				// success: "[id]|1[details]"
				// failure: "[id]|0[details]"
				var pipeIndex = message.indexOf('|');
				var id = message.substr(0, pipeIndex);
				var success = (message.charAt(pipeIndex + 1) === '1');

				if (pendingValidations[id]) {
					ValidatorProcess.release(self);
					pendingValidations[id](success, message.substr(pipeIndex + 2));
					delete pendingValidations[id];
				}
			});
		}
		ValidatorProcess.prototype.load = 0;
		ValidatorProcess.prototype.active = true;
		ValidatorProcess.processes = [];
		ValidatorProcess.spawn = function () {
			var num = Config.validatorprocesses || 1;
			for (var i = 0; i < num; ++i) {
				this.processes.push(new ValidatorProcess());
			}
		};
		ValidatorProcess.respawn = function () {
			this.processes.splice(0).forEach(function (process) {
				process.active = false;
				if (!process.load) process.process.disconnect();
			});
			this.spawn();
		};
		ValidatorProcess.acquire = function () {
			var process = this.processes[0];
			for (var i = 1; i < this.processes.length; ++i) {
				if (this.processes[i].load < process.load) {
					process = this.processes[i];
				}
			}
			++process.load;
			return process;
		};
		ValidatorProcess.release = function (process) {
			--process.load;
			if (!process.load && !process.active) {
				process.process.disconnect();
			}
		};
		ValidatorProcess.send = function (format, team, callback) {
			var process = this.acquire();
			pendingValidations[validationCount] = callback;
			try {
				process.process.send('' + validationCount + '|' + format + '|' + team);
			} catch (e) {}
			++validationCount;
		};
		return ValidatorProcess;
	})();

	// Create the initial set of validator processes.
	ValidatorProcess.spawn();

	exports.ValidatorProcess = ValidatorProcess;
	exports.pendingValidations = pendingValidations;

	exports.validateTeam = function (format, team, callback) {
		ValidatorProcess.send(format, team, callback);
	};

	var synchronousValidators = {};
	exports.validateTeamSync = function (format, team) {
		if (!synchronousValidators[format]) synchronousValidators[format] = new Validator(format);
		return synchronousValidators[format].validateTeam(team);
	};
	exports.validateSetSync = function (format, set, teamHas) {
		if (!synchronousValidators[format]) synchronousValidators[format] = new Validator(format);
		return synchronousValidators[format].validateSet(set, teamHas);
	};
	exports.checkLearnsetSync = function (format, move, template, lsetData) {
		if (!synchronousValidators[format]) synchronousValidators[format] = new Validator(format);
		return synchronousValidators[format].checkLearnset(move, template, lsetData);
	};
} else {
	require('sugar');
	if (!''.includes) require('es6-shim');
	global.Config = require('./config/config.js');

	if (Config.crashguard) {
		process.on('uncaughtException', function (err) {
			require('./crashlogger.js')(err, 'A team validator process', true);
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
	global.toId = function (text) {
		if (text && text.id) {
			text = text.id;
		} else if (text && text.userid) {
			text = text.userid;
		}

		if (typeof text !== 'string' && typeof text !== 'number') return '';
		return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
	};

	global.Tools = require('./tools.js').includeMods();

	require('./repl.js').start('team-validator-', process.pid, function (cmd) { return eval(cmd); });

	var validators = {};

	var respond = function respond(id, success, details) {
		process.send(id + (success ? '|1' : '|0') + details);
	};

	process.on('message', function (message) {
		// protocol:
		// "[id]|[format]|[team]"
		var pipeIndex = message.indexOf('|');
		var pipeIndex2 = message.indexOf('|', pipeIndex + 1);
		var id = message.substr(0, pipeIndex);
		var format = message.substr(pipeIndex + 1, pipeIndex2 - pipeIndex - 1);

		if (!validators[format]) validators[format] = new Validator(format);
		var parsedTeam = [];
		parsedTeam = Tools.fastUnpackTeam(message.substr(pipeIndex2 + 1));

		var problems;
		try {
			problems = validators[format].validateTeam(parsedTeam);
		} catch (err) {
			var stack = err.stack + '\n\n' +
					'Additional information:\n' +
					'format = ' + format + '\n' +
					'team = ' + message.substr(pipeIndex2 + 1) + '\n';
			var fakeErr = {stack: stack};

			require('./crashlogger.js')(fakeErr, 'A team validation');
			problems = ["Your team crashed the team validator. We've been automatically notified and will fix this crash, but you should use a different team for now."];
		}

		if (problems && problems.length) {
			respond(id, false, problems.join('\n'));
		} else {
			var packedTeam = Tools.packTeam(parsedTeam);
			// console.log('FROM: ' + message.substr(pipeIndex2 + 1));
			// console.log('TO: ' + packedTeam);
			respond(id, true, packedTeam);
		}
	});

	process.on('disconnect', function () {
		process.exit();
	});
}

Validator = (function () {
	function Validator(format) {
		this.format = Tools.getFormat(format);
		this.tools = Tools.mod(this.format);
	}

	Validator.prototype.validateTeam = function (team) {
		var format = Tools.getFormat(this.format);
		if (format.validateTeam) return format.validateTeam.call(this, team);
		return this.baseValidateTeam(team);
	};

	Validator.prototype.baseValidateTeam = function (team) {
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

		var lengthRange = format.teamLength && format.teamLength.validate;
		if (!lengthRange) {
			lengthRange = [1, 6];
			if (format.gameType === 'doubles') lengthRange[0] = 2;
			if (format.gameType === 'triples' || format.gameType === 'rotation') lengthRange[0] = 3;
		}
		if (team.length < lengthRange[0]) return ["You must bring at least " + lengthRange[0] + " Pok\u00E9mon."];
		if (team.length > lengthRange[1]) return ["You may only bring up to " + lengthRange[1] + " Pok\u00E9mon."];

		var teamHas = {};
		for (var i = 0; i < team.length; i++) {
			if (!team[i]) return ["You sent invalid team data. If you're not using a custom client, please report this as a bug."];
			var setProblems = (format.validateSet || this.validateSet).call(this, team[i], teamHas);
			if (setProblems) {
				problems = problems.concat(setProblems);
			}
		}

		for (var i = 0; i < format.teamBanTable.length; i++) {
			var bannedCombo = true;
			for (var j = 0; j < format.teamBanTable[i].length; j++) {
				if (!teamHas[format.teamBanTable[i][j]]) {
					bannedCombo = false;
					break;
				}
			}
			if (bannedCombo) {
				var clause = format.name ? " by " + format.name : '';
				problems.push("Your team has the combination of " + format.teamBanTable[i].join(' + ') + ", which is banned" + clause + ".");
			}
		}

		if (format.ruleset) {
			for (var i = 0; i < format.ruleset.length; i++) {
				var subformat = tools.getFormat(format.ruleset[i]);
				if (subformat.onValidateTeam) {
					problems = problems.concat(subformat.onValidateTeam.call(tools, team, format, teamHas) || []);
				}
			}
		}
		if (format.onValidateTeam) {
			problems = problems.concat(format.onValidateTeam.call(tools, team, format, teamHas) || []);
		}

		if (!problems.length) return false;
		return problems;
	};

	Validator.prototype.validateSet = function (set, teamHas, flags) {
		var format = this.format;
		var tools = this.tools;

		var problems = [];
		if (!set) {
			return ["This is not a Pokemon."];
		}

		var template = tools.getTemplate(Tools.getString(set.species));
		if (!template.exists) {
			return ["The Pokemon '" + set.species + "' does not exist."];
		}
		set.species = template.species;

		set.name = tools.getName(set.name);
		var item = tools.getItem(Tools.getString(set.item));
		set.item = item.name;
		var ability = tools.getAbility(Tools.getString(set.ability));
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
		if (set.level > maxLevel || set.level === set.forcedLevel || set.level === set.maxForcedLevel) {
			set.level = maxLevel;
		}

		var nameTemplate = tools.getTemplate(set.name);
		if (nameTemplate.exists && nameTemplate.name.toLowerCase() === set.name.toLowerCase()) set.name = null;
		set.species = set.species;
		set.name = set.name || set.species;
		var name = set.species;
		if (set.species !== set.name) name = set.name + " (" + set.species + ")";
		var isHidden = false;
		var lsetData = {set:set, format:format};
		if (flags) Object.merge(lsetData, flags);

		var setHas = {};

		if (!template || !template.abilities) {
			set.species = 'Unown';
			template = tools.getTemplate('Unown');
		}

		if (format.ruleset) {
			for (var i = 0; i < format.ruleset.length; i++) {
				var subformat = tools.getFormat(format.ruleset[i]);
				if (subformat.onChangeSet) {
					problems = problems.concat(subformat.onChangeSet.call(tools, set, format) || []);
				}
			}
		}
		if (format.onChangeSet) {
			problems = problems.concat(format.onChangeSet.call(tools, set, format, setHas, teamHas) || []);
		}
		template = tools.getTemplate(set.species);
		item = tools.getItem(set.item);
		if (item.id && !item.exists) {
			return ['"' + set.item + "' is an invalid item."];
		}
		ability = tools.getAbility(set.ability);
		if (ability.id && !ability.exists) {
			if (tools.gen < 3) {
				// gen 1-2 don't have abilities, just silently remove
				ability = tools.getAbility('');
				set.ability = '';
			} else {
				return ['"' + set.ability + "' is an invalid ability."];
			}
		}

		var banlistTable = tools.getBanlistTable(format);

		var check = template.id;
		var clause = '';
		setHas[check] = true;
		if (banlistTable[check]) {
			clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
			problems.push(set.species + ' is banned' + clause + '.');
		} else if (!tools.data.FormatsData[check] || !tools.data.FormatsData[check].tier) {
			check = toId(template.baseSpecies);
			if (banlistTable[check]) {
				clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
				problems.push(template.baseSpecies + ' is banned' + clause + '.');
			}
		}

		check = toId(set.ability);
		setHas[check] = true;
		if (banlistTable[check]) {
			clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
			problems.push(name + "'s ability " + set.ability + " is banned" + clause + ".");
		}
		check = toId(set.item);
		setHas[check] = true;
		if (banlistTable[check]) {
			clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
			problems.push(name + "'s item " + set.item + " is banned" + clause + ".");
		}
		if (banlistTable['Unreleased'] && item.isUnreleased) {
			problems.push(name + "'s item " + set.item + " is unreleased.");
		}
		if (banlistTable['Unreleased'] && template.isUnreleased) {
			if (!format.requirePentagon || (template.eggGroups[0] === 'Undiscovered' && !template.evos)) {
				problems.push(name + " (" + template.species + ") is unreleased.");
			}
		}
		setHas[toId(set.ability)] = true;
		if (banlistTable['illegal']) {
			// Don't check abilities for metagames with All Abilities
			if (tools.gen <= 2) {
				set.ability = 'None';
			} else if (!banlistTable['ignoreillegalabilities']) {
				if (!ability.name) {
					problems.push(name + " needs to have an ability.");
				} else if (ability.name !== template.abilities['0'] &&
					ability.name !== template.abilities['1'] &&
					ability.name !== template.abilities['H']) {
					problems.push(name + " can't have " + set.ability + ".");
				}
				if (ability.name === template.abilities['H']) {
					isHidden = true;

					if (template.unreleasedHidden && banlistTable['illegal']) {
						problems.push(name + "'s hidden ability is unreleased.");
					} else if (tools.gen === 5 && set.level < 10 && (template.maleOnlyHidden || template.gender === 'N')) {
						problems.push(name + " must be at least level 10 with its hidden ability.");
					}
					if (template.maleOnlyHidden) {
						set.gender = 'M';
						lsetData.sources = ['5D'];
					}
				}
			}
		}
		if (set.moves && Array.isArray(set.moves)) {
			set.moves = set.moves.filter(function (val) { return val; });
		}
		if (!set.moves || !set.moves.length) {
			problems.push(name + " has no moves.");
		} else {
			// A limit is imposed here to prevent too much engine strain or
			// too much layout deformation - to be exact, this is the Debug
			// Mode limitation.
			// The usual limit of 4 moves is handled elsewhere - currently
			// in the cartridge-compliant set validator: rulesets.js:pokemon
			set.moves = set.moves.slice(0, 24);

			for (var i = 0; i < set.moves.length; i++) {
				if (!set.moves[i]) continue;
				var move = tools.getMove(Tools.getString(set.moves[i]));
				if (!move.exists) return ['"' + move.name + '" is an invalid move.'];
				set.moves[i] = move.name;
				check = move.id;
				setHas[check] = true;
				if (banlistTable[check]) {
					clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
					problems.push(name + "'s move " + set.moves[i] + " is banned" + clause + ".");
				}

				if (banlistTable['Unreleased']) {
					if (move.isUnreleased) problems.push(name + "'s move " + set.moves[i] + " is unreleased.");
				}

				if (banlistTable['illegal']) {
					var problem = this.checkLearnset(move, template, lsetData);
					if (problem) {
						var problemString = name + " can't learn " + move.name;
						if (problem.type === 'incompatible') {
							if (isHidden) {
								problemString = problemString.concat(" because it's incompatible with its ability or another move.");
							} else {
								problemString = problemString.concat(" because it's incompatible with another move.");
							}
						} else if (problem.type === 'oversketched') {
							problemString = problemString.concat(" because it can only sketch " + problem.maxSketches + " move" + (problem.maxSketches > 1 ? "s" : "") + ".");
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
				if (source.charAt(1) === 'S') {
					// it's an event
					var eventData = null;
					var splitSource = source.substr(2).split(' ');
					var eventTemplate = tools.getTemplate(splitSource[1]);
					if (eventTemplate.eventPokemon) eventData = eventTemplate.eventPokemon[parseInt(splitSource[0], 10)];
					if (eventData) {
						if (eventData.nature && eventData.nature !== set.nature) {
							problems.push(name + " must have a " + eventData.nature + " nature because it has a move only available from a specific event.");
						}
						if (eventData.shiny && !set.shiny) {
							problems.push(name + " must be shiny because it has a move only available from a specific event.");
						}
						if (eventData.generation < 5) eventData.isHidden = false;
						if (eventData.isHidden !== undefined && eventData.isHidden !== isHidden) {
							problems.push(name + (isHidden ? " can't have" : " must have") + " its hidden ability because it has a move only available from a specific event.");
						}
						if (tools.gen <= 5 && eventData.abilities && eventData.abilities.indexOf(ability.id) < 0 && (template.species === eventTemplate.species || tools.getAbility(set.ability).gen <= eventData.generation)) {
							problems.push(name + " must have " + eventData.abilities.join(" or ") + " because it has a move only available from a specific event.");
						}
						if (eventData.gender) {
							set.gender = eventData.gender;
						}
						if (eventData.level && set.level < eventData.level) {
							problems.push(name + " must be at least level " + eventData.level + " because it has a move only available from a specific event.");
						}
					}
					isHidden = false;
				}
			}
			if (isHidden && lsetData.sourcesBefore) {
				if (!lsetData.sources && lsetData.sourcesBefore < 5) {
					problems.push(name + " has a hidden ability - it can't have moves only learned before gen 5.");
				} else if (lsetData.sources && template.gender && template.gender !== 'F' && !{'Nidoran-M':1, 'Nidorino':1, 'Nidoking':1, 'Volbeat':1}[template.species]) {
					var compatibleSource = false;
					for (var i = 0, len = lsetData.sources.length; i < len; i++) {
						if (lsetData.sources[i].charAt(1) === 'E' || (lsetData.sources[i].substr(0, 2) === '5D' && set.level >= 10)) {
							compatibleSource = true;
							break;
						}
					}
					if (!compatibleSource) {
						problems.push(name + " has moves incompatible with its hidden ability.");
					}
				}
			}
			if (banlistTable['illegal'] && set.level < template.evoLevel) {
				// FIXME: Event pokemon given at a level under what it normally can be attained at gives a false positive
				problems.push(name + " must be at least level " + template.evoLevel + " to be evolved.");
			}
			if (!lsetData.sources && lsetData.sourcesBefore <= 3 && tools.getAbility(set.ability).gen === 4 && !template.prevo && tools.gen <= 5) {
				problems.push(name + " has a gen 4 ability and isn't evolved - it can't use anything from gen 3.");
			}
			if (!lsetData.sources && lsetData.sourcesBefore >= 3 && (isHidden || tools.gen <= 5) && template.gen <= lsetData.sourcesBefore) {
				var oldAbilities = tools.mod('gen' + lsetData.sourcesBefore).getTemplate(set.species).abilities;
				if (ability.name !== oldAbilities['0'] && ability.name !== oldAbilities['1'] && !oldAbilities['H']) {
					problems.push(name + " has moves incompatible with its ability.");
				}
			}
		}
		if (item.megaEvolves === template.species) {
			template = tools.getTemplate(item.megaStone);
		}
		if (template.tier) {
			var tier = template.tier;
			if (tier.charAt(0) === '(') tier = tier.slice(1, -1);
			setHas[toId(tier)] = true;
			if (banlistTable[tier]) {
				problems.push(template.species + " is in " + tier + ", which is banned.");
			}
		}

		if (teamHas) {
			for (var i in setHas) {
				teamHas[i] = true;
			}
		}
		for (var i = 0; i < format.setBanTable.length; i++) {
			var bannedCombo = true;
			for (var j = 0; j < format.setBanTable[i].length; j++) {
				if (!setHas[format.setBanTable[i][j]]) {
					bannedCombo = false;
					break;
				}
			}
			if (bannedCombo) {
				clause = format.name ? " by " + format.name : '';
				problems.push(name + " has the combination of " + format.setBanTable[i].join(' + ') + ", which is banned" + clause + ".");
			}
		}

		if (format.ruleset) {
			for (var i = 0; i < format.ruleset.length; i++) {
				var subformat = tools.getFormat(format.ruleset[i]);
				if (subformat.onValidateSet) {
					problems = problems.concat(subformat.onValidateSet.call(tools, set, format, setHas, teamHas) || []);
				}
			}
		}
		if (format.onValidateSet) {
			problems = problems.concat(format.onValidateSet.call(tools, set, format, setHas, teamHas) || []);
		}

		if (!problems.length) {
			if (set.forcedLevel) set.level = set.forcedLevel;
			return false;
		}

		return problems;
	};

	Validator.prototype.checkLearnset = function (move, template, lsetData) {
		var tools = this.tools;

		move = toId(move);
		template = tools.getTemplate(template);

		lsetData = lsetData || {};
		lsetData.eggParents = lsetData.eggParents || [];
		var set = (lsetData.set || (lsetData.set = {}));
		var format = (lsetData.format || (lsetData.format = {}));
		var alreadyChecked = {};
		var level = set.level || 100;

		var isHidden = false;
		if (set.ability && tools.getAbility(set.ability).name === template.abilities['H']) isHidden = true;
		var incompatibleHidden = false;

		var limit1 = true;
		var sketch = false;
		var blockedHM = false;

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
		var noPastGen = !!format.requirePentagon;
		// since Gen 3, Pokemon cannot be traded to past generations
		var noFutureGen = tools.gen >= 3 ? true : !!(format.banlistTable && format.banlistTable['tradeback']);

		do {
			alreadyChecked[template.speciesid] = true;
			// STABmons hack to avoid copying all of validateSet to formats
			if (move !== 'chatter' && lsetData['ignorestabmoves'] && lsetData['ignorestabmoves'][this.tools.getMove(move).category]) {
				var types = template.types;
				if (template.species === 'Shaymin') types = ['Grass', 'Flying'];
				if (template.baseSpecies === 'Hoopa') types = ['Psychic', 'Ghost', 'Dark'];
				if (types.indexOf(tools.getMove(move).type) >= 0) return false;
			}
			if (template.learnset) {
				if (template.learnset[move] || template.learnset['sketch']) {
					sometimesPossible = true;
					var lset = template.learnset[move];
					if (!lset || template.speciesid === 'smeargle') {
						if (tools.getMove(move).noSketch) return true;
						lset = template.learnset['sketch'];
						sketch = true;
					}
					if (typeof lset === 'string') lset = [lset];

					for (var i = 0, len = lset.length; i < len; i++) {
						var learned = lset[i];
						if (noPastGen && learned.charAt(0) !== '6') continue;
						if (noFutureGen && parseInt(learned.charAt(0), 10) > tools.gen) continue;
						if (learned.charAt(0) !== '6' && isHidden && !tools.mod('gen' + learned.charAt(0)).getTemplate(template.species).abilities['H']) {
							// check if the Pokemon's hidden ability was available
							incompatibleHidden = true;
							continue;
						}
						if (!template.isNonstandard) {
							// HMs can't be transferred
							if (tools.gen >= 4 && learned.charAt(0) <= 3 && move in {'cut':1, 'fly':1, 'surf':1, 'strength':1, 'flash':1, 'rocksmash':1, 'waterfall':1, 'dive':1}) continue;
							if (tools.gen >= 5 && learned.charAt(0) <= 4 && move in {'cut':1, 'fly':1, 'surf':1, 'strength':1, 'rocksmash':1, 'waterfall':1, 'rockclimb':1}) continue;
							// Defog and Whirlpool can't be transferred together
							if (tools.gen >= 5 && move in {'defog':1, 'whirlpool':1} && learned.charAt(0) <= 4) blockedHM = true;
						}
						if (learned.substr(0, 2) in {'4L':1, '5L':1, '6L':1}) {
							// gen 4-6 level-up moves
							if (level >= parseInt(learned.substr(2), 10)) {
								// we're past the required level to learn it
								return false;
							}
							if (!template.gender || template.gender === 'F') {
								// available as egg move
								learned = learned.charAt(0) + 'Eany';
							} else {
								// this move is unavailable, skip it
								continue;
							}
						}
						if (learned.charAt(1) in {L:1, M:1, T:1}) {
							if (learned.charAt(0) === '6') {
								// current-gen TM or tutor moves:
								//   always available
								return false;
							}
							// past-gen level-up, TM, or tutor moves:
							//   available as long as the source gen was or was before this gen
							limit1 = false;
							sourcesBefore = Math.max(sourcesBefore, parseInt(learned.charAt(0), 10));
							if (tools.gen === 2 && lsetData.hasGen2Move && parseInt(learned.charAt(0), 10) === 1) lsetData.blockedGen2Move = true;
						} else if (learned.charAt(1) in {E:1, S:1, D:1}) {
							// egg, event, or DW moves:
							//   only if that was the source
							if (learned.charAt(1) === 'E') {
								// it's an egg move, so we add each pokemon that can be bred with to its sources
								if (learned.charAt(0) === '6') {
									// gen 6 doesn't have egg move incompatibilities except for certain cases with baby Pokemon
									learned = '6E' + (template.prevo ? template.id : '');
									sources.push(learned);
									continue;
								}
								var eggGroups = template.eggGroups;
								if (!eggGroups) continue;
								if (eggGroups[0] === 'Undiscovered') eggGroups = tools.getTemplate(template.evos[0]).eggGroups;
								var atLeastOne = false;
								var fromSelf = (learned.substr(1) === 'Eany');
								learned = learned.substr(0, 2);
								for (var templateid in tools.data.Pokedex) {
									var dexEntry = tools.getTemplate(templateid);
									if (
										// CAP pokemon can't breed
										!dexEntry.isNonstandard &&
										// can't breed mons from future gens
										dexEntry.gen <= parseInt(learned.charAt(0), 10) &&
										// genderless pokemon can't pass egg moves
										(dexEntry.gender !== 'N' || tools.gen <= 1 && dexEntry.gen <= 1)) {
										if (
											// chainbreeding
											fromSelf ||
											// otherwise parent must be able to learn the move
											!alreadyChecked[dexEntry.speciesid] && dexEntry.learnset && (dexEntry.learnset[move] || dexEntry.learnset['sketch'])) {
											if (dexEntry.eggGroups.intersect(eggGroups).length) {
												if (tools.gen === 2 && lsetData.hasEggMove && lsetData.hasEggMove !== move) {
													// If the mon already has an egg move by a father, other different father can't give it another egg move.
													if (lsetData.eggParents.indexOf(dexEntry.species) >= 0) {
														// We have to test here that the father of both moves doesn't get both by egg breeding
														var learnsFrom = false;
														var lsetToCheck = (dexEntry.learnset[lsetData.hasEggMove]) ? dexEntry.learnset[lsetData.hasEggMove] : dexEntry.learnset['sketch'];
														if (!lsetToCheck || !lsetToCheck.length) continue;
														for (var ltype = 0; ltype < lsetToCheck.length; ltype++) {
															// Save first learning type. After that, only save it if we have egg and it's not egg.
															learnsFrom = !learnsFrom || learnsFrom === 'E' ? lsetToCheck[ltype].charAt(1) : learnsFrom;
														}
														// If the previous egg move was learnt by the father through an egg as well:
														if (learnsFrom === 'E') {
															var secondLearnsFrom = false;
															var lsetToCheck = (dexEntry.learnset[move]) ? dexEntry.learnset[move] : dexEntry.learnset['sketch'];
															// Have here either the move learnset or sketch learnset for Smeargle.
															if (lsetToCheck) {
																for (var ltype = 0; ltype < lsetToCheck.length; ltype++) {
																	// Save first learning type. After that, only save it if we have egg and it's not egg.
																	secondLearnsFrom = !secondLearnsFrom || secondLearnsFrom === 'E' ? dexEntry.learnset[move][ltype].charAt(1) : secondLearnsFrom;
																}
																// Ok, both moves are learnt by father through an egg, therefor, it's impossible.
																if (secondLearnsFrom === 'E') {
																	lsetData.blockedGen2Move = true;
																	continue;
																}
															}
														}
													} else {
														lsetData.blockedGen2Move = true;
														continue;
													}
												}
												lsetData.hasEggMove = move;
												lsetData.eggParents.push(dexEntry.species);
												// Check if it has a move that needs to come from a prior gen to this egg move.
												lsetData.hasGen2Move = lsetData.hasGen2Move || (tools.gen === 2 && tools.getMove(move).gen === 2);
												lsetData.blockedGen2Move = lsetData.hasGen2Move && tools.gen === 2 && (lsetData.sourcesBefore ? lsetData.sourcesBefore : sourcesBefore) > 0 && (lsetData.sourcesBefore ? lsetData.sourcesBefore : sourcesBefore) < parseInt(learned.charAt(0), 10);
												// we can breed with it
												atLeastOne = true;
												sources.push(learned + dexEntry.id);
											}
										}
									}
								}
								// chainbreeding with itself from earlier gen
								if (!atLeastOne) sources.push(learned + template.id);
								// Egg move tradeback for gens 1 and 2.
								if (!noFutureGen) sourcesBefore = Math.max(sourcesBefore, parseInt(learned.charAt(0), 10));
							} else if (learned.charAt(1) === 'S') {
								// Event Pokémon:
								//	Available as long as the past gen can get the Pokémon and then trade it back.
								sources.push(learned + ' ' + template.id);
								if (!noFutureGen) sourcesBefore = Math.max(sourcesBefore, parseInt(learned.charAt(0), 10));
								// Check if it has a move that needs to come from a prior gen to this event move.
								lsetData.hasGen2Move = lsetData.hasGen2Move || (tools.gen === 2 && tools.getMove(move).gen === 2);
								lsetData.blockedGen2Move = lsetData.hasGen2Move && tools.gen === 2 && (lsetData.sourcesBefore ? lsetData.sourcesBefore : sourcesBefore) > 0 && (lsetData.sourcesBefore ? lsetData.sourcesBefore : sourcesBefore) < parseInt(learned.charAt(0), 10);
							} else {
								// DW Pokemon are at level 10 or at the evolution level
								var minLevel = (template.evoLevel && template.evoLevel > 10) ? template.evoLevel : 10;
								if (set.level < minLevel) continue;
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
							if (!(i === 'mimic' && tools.getAbility(set.ability).gen === 4 && !template.prevo)) {
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
				if (template.gen > Math.max(2, tools.gen)) template = null;
				if (template && !template.abilities['H']) isHidden = false;
			} else if (template.baseSpecies !== template.species && template.baseSpecies !== 'Kyurem' && template.baseSpecies !== 'Pikachu') {
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

		if (blockedHM) {
			// Limit one of Defog/Whirlpool to be transferred
			if (lsetData.hm) return {type:'incompatible'};
			lsetData.hm = move;
		}

		if (lsetData.blockedGen2Move) {
			// Limit Gen 2 egg moves on gen 1 when move doesn't exist
			return {type:'incompatible'};
		}

		// Now that we have our list of possible sources, intersect it with the current list
		if (!sourcesBefore && !sources.length) {
			if (noPastGen && sometimesPossible) return {type:'pokebank'};
			if (incompatibleHidden) return {type:'incompatible'};
			return true;
		}
		if (!sources.length) sources = null;
		if (sourcesBefore || lsetData.sourcesBefore) {
			// having sourcesBefore is the equivalent of having everything before that gen
			// in sources, so we fill the other array in preparation for intersection
			var learned;
			if (sourcesBefore && lsetData.sources) {
				if (!sources) sources = [];
				for (var i = 0, len = lsetData.sources.length; i < len; i++) {
					learned = lsetData.sources[i];
					if (parseInt(learned.charAt(0), 10) <= sourcesBefore) {
						sources.push(learned);
					}
				}
				if (!lsetData.sourcesBefore) sourcesBefore = 0;
			}
			if (lsetData.sourcesBefore && sources) {
				if (!lsetData.sources) lsetData.sources = [];
				for (var i = 0, len = sources.length; i < len; i++) {
					learned = sources[i];
					if (parseInt(learned.charAt(0), 10) <= lsetData.sourcesBefore) {
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
			lsetData.sourcesBefore = Math.min(sourcesBefore, lsetData.sourcesBefore || 6);
		}

		return false;
	};

	return Validator;
})();
