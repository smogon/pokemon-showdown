/**
 * Data searching commands.
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Commands for advanced searching for pokemon, moves, items and learnsets.
 * These commands run on a child process by default.
 *
 * @license MIT license
 */

'use strict';

const ProcessManager = require('./../process-manager');

const MAX_PROCESSES = 1;
const RESULTS_MAX_LENGTH = 10;

class DatasearchManager extends ProcessManager {
	onMessageUpstream(message) {
		// Protocol:
		// "[id]|JSON"
		let pipeIndex = message.indexOf('|');
		let id = +message.substr(0, pipeIndex);
		let result = JSON.parse(message.slice(pipeIndex + 1));

		if (this.pendingTasks.has(id)) {
			this.pendingTasks.get(id)(result);
			this.pendingTasks.delete(id);
			this.release();
		}
	}

	onMessageDownstream(message) {
		// protocol:
		// "[id]|{data, sig}"
		let pipeIndex = message.indexOf('|');
		let id = message.substr(0, pipeIndex);

		let data = JSON.parse(message.slice(pipeIndex + 1));
		process.send(id + '|' + JSON.stringify(this.receive(data)));
	}

	receive(data) {
		let result;
		try {
			switch (data.cmd) {
			case 'randpoke':
			case 'dexsearch':
				result = runDexsearch(data.target, data.cmd, data.canAll, data.message);
				break;
			case 'movesearch':
				result = runMovesearch(data.target, data.cmd, data.canAll, data.message);
				break;
			case 'itemsearch':
				result = runItemsearch(data.target, data.cmd, data.canAll, data.message);
				break;
			case 'learn':
				result = runLearn(data.target, data.message);
				break;
			default:
				result = null;
			}
		} catch (err) {
			require('./../crashlogger')(err, 'A search query', data);
			result = {error: "Sorry! Our search engine crashed on your query. We've been automatically notified and will fix this crash."};
		}
		return result;
	}
}

exports.DatasearchManager = DatasearchManager;

const PM = exports.PM = new DatasearchManager({
	execFile: __filename,
	maxProcesses: MAX_PROCESSES,
	isChatBased: true,
});

exports.commands = {
	ds: 'dexsearch',
	dsearch: 'dexsearch',
	dexsearch: function (target, room, user, connection, cmd, message) {
		if (!this.canBroadcast()) return;
		if (!target) return this.parse('/help dexsearch');

		return runSearch({
			target: target,
			cmd: 'dexsearch',
			canAll: (!this.broadcastMessage || room.isPersonal),
			message: (this.broadcastMessage ? "" : message),
		}).then(response => {
			if (!this.runBroadcast()) return;
			if (response.error) {
				this.errorReply(response.error);
			} else if (response.reply) {
				this.sendReplyBox(response.reply);
			} else if (response.dt) {
				CommandParser.commands.data.call(this, response.dt, room, user, connection, 'dt');
			}
			room.update();
		});
	},

	dexsearchhelp: ["/dexsearch [parameter], [parameter], [parameter], ... - Searches for Pok\u00e9mon that fulfill the selected criteria",
		"Search categories are: type, tier, color, moves, ability, gen, resists, recovery, priority, stat.",
		"Valid colors are: green, red, blue, white, brown, yellow, purple, pink, gray and black.",
		"Valid tiers are: Uber/OU/BL/UU/BL2/RU/BL3/NU/BL4/PU/NFE/LC/CAP.",
		"Types must be followed by ' type', e.g., 'dragon type'.",
		"'resists' followed by a type will show Pok\u00e9mon that resist that typing, e.g., 'resists normal'.",
		"Inequality ranges use the characters '>=' for '≥' and '<=' for '≤', e.g., 'hp <= 95' searches all Pok\u00e9mon with HP less than or equal to 95.",
		"Parameters can be excluded through the use of '!', e.g., '!water type' excludes all water types.",
		"The parameter 'mega' can be added to search for Mega Evolutions only, and the parameter 'NFE' can be added to search not-fully evolved Pok\u00e9mon only.",
		"Parameters separated with '|' will be searched as alternatives for each other, e.g., 'trick | switcheroo' searches for all Pok\u00e9mon that learn either Trick or Switcheroo.",
		"The order of the parameters does not matter."],

	rollpokemon: 'randompokemon',
	randpoke: 'randompokemon',
	randompokemon: function (target, room, user, connection, cmd, message) {
		if (!this.canBroadcast()) return;
		let targets = target.split(",");
		let targetsBuffer = [];
		let qty;
		for (let i = 0; i < targets.length; i++) {
			if (!targets[i]) continue;
			let num = Number(targets[i]);
			if (Number.isInteger(num)) {
				if (qty) return this.errorReply("Only specify the number of Pok\u00e9mon once.");
				qty = num;
				if (qty < 1 || 15 < qty) return this.errorReply("Number of random Pok\u00e9mon must be between 1 and 15.");
				targetsBuffer.push("random" + qty);
			} else {
				targetsBuffer.push(targets[i]);
			}
		}
		if (!qty) targetsBuffer.push("random1");

		return runSearch({
			target: targetsBuffer.join(","),
			cmd: 'randpoke',
			canAll: (!this.broadcastMessage || room.isPersonal),
			message: (this.broadcastMessage ? "" : message),
		}).then(response => {
			if (!this.runBroadcast()) return;
			if (response.error) {
				this.errorReply(response.error);
			} else if (response.reply) {
				this.sendReplyBox(response.reply);
			} else if (response.dt) {
				CommandParser.commands.data.call(this, response.dt, room, user, connection, 'dt');
			}
			room.update();
		});
	},
	randompokemonhelp: ["/randompokemon - Generates random Pok\u00e9mon based on given search conditions.",
		"/randompokemon uses the same parameters as /dexsearch (see '/help ds').",
		"Adding a number as a parameter returns that many random Pok\u00e9mon, e.g., '/randpoke 6' returns 6 random Pok\u00e9mon."],

	ms: 'movesearch',
	msearch: 'movesearch',
	movesearch: function (target, room, user, connection, cmd, message) {
		if (!this.canBroadcast()) return;
		if (!target) return this.parse('/help movesearch');

		return runSearch({
			target: target,
			cmd: 'movesearch',
			canAll: (!this.broadcastMessage || room.isPersonal),
			message: (this.broadcastMessage ? "" : message),
		}).then(response => {
			if (!this.runBroadcast()) return;
			if (response.error) {
				this.errorReply(response.error);
			} else if (response.reply) {
				this.sendReplyBox(response.reply);
			} else if (response.dt) {
				CommandParser.commands.data.call(this, response.dt, room, user, connection, 'dt');
			}
			room.update();
		});
	},
	movesearchhelp: ["/movesearch [parameter], [parameter], [parameter], ... - Searches for moves that fulfill the selected criteria.",
		"Search categories are: type, category, contest condition, flag, status inflicted, type boosted, and numeric range for base power, pp, and accuracy.",
		"Types must be followed by ' type', e.g., 'dragon type'.",
		"Stat boosts must be preceded with 'boosts ', e.g., 'boosts attack' searches for moves that boost the attack stat.",
		"Inequality ranges use the characters '>' and '<' though they behave as '≥' and '≤', e.g., 'bp > 100' searches for all moves equal to and greater than 100 base power.",
		"Parameters can be excluded through the use of '!', e.g., !water type' excludes all water type moves.",
		"Valid flags are: authentic (bypasses substitute), bite, bullet, contact, defrost, powder, pulse, punch, secondary, snatch, and sound.",
		"If a Pok\u00e9mon is included as a parameter, moves will be searched from its movepool.",
		"The order of the parameters does not matter."],

	isearch: 'itemsearch',
	itemsearch: function (target, room, user, connection, cmd, message) {
		if (!this.canBroadcast()) return;
		if (!target) return this.parse('/help itemsearch');

		return runSearch({
			target: target,
			cmd: 'itemsearch',
			canAll: (!this.broadcastMessage || room.isPersonal),
			message: (this.broadcastMessage ? "" : message),
		}).then(response => {
			if (!this.runBroadcast()) return;
			if (response.error) {
				this.errorReply(response.error);
			} else if (response.reply) {
				this.sendReplyBox(response.reply);
			} else if (response.dt) {
				CommandParser.commands.data.call(this, response.dt, room, user, connection, 'dt');
			}
			room.update();
		});
	},
	itemsearchhelp: ["/itemsearch [move description] - finds items that match the given key words.",
	"Command accepts natural language. (tip: fewer words tend to work better)",
	"Searches with \"fling\" in them will find items with the specified Fling behavior.",
	"Searches with \"natural gift\" in them will find items with the specified Natural Gift behavior."],

	learnset: 'learn',
	learnall: 'learn',
	learn5: 'learn',
	g6learn: 'learn',
	rbylearn: 'learn',
	gsclearn: 'learn',
	advlearn: 'learn',
	dpplearn: 'learn',
	bw2learn: 'learn',
	learn: function (target, room, user, connection, cmd, message) {
		if (!this.canBroadcast()) return;
		if (!target) return this.parse('/help learn');

		return runSearch({
			target: target,
			cmd: 'learn',
			message: cmd,
		}).then(response => {
			if (!this.runBroadcast()) return;
			if (response.error) {
				this.errorReply(response.error);
			} else if (response.reply) {
				this.sendReplyBox(response.reply);
			}
			room.update();
		});
	},
	learnhelp: ["/learn [pokemon], [move, move, ...] - Displays how a Pok\u00e9mon can learn the given moves, if it can at all.",
		"!learn [pokemon], [move, move, ...] - Show everyone that information. Requires: + % @ * # & ~"],
};

if (process.send && module === process.mainModule) {
	// This is a child process!

	global.Config = require('../config/config');

	if (Config.crashguard) {
		process.on('uncaughtException', err => {
			require('../crashlogger')(err, 'A dexsearch process', true);
		});
	}

	global.Tools = require('../tools');
	global.toId = Tools.getId;
	Tools.includeData();
	Tools.includeMods();
	global.TeamValidator = require('../team-validator');

	process.on('message', message => PM.onMessageDownstream(message));
	process.on('disconnect', () => process.exit());

	require('../repl').start('dexsearch', cmd => eval(cmd));
} else if (!PM.maxProcesses) {
	process.nextTick(() => Tools.includeMods());
}

function runDexsearch(target, cmd, canAll, message) {
	let searches = [];
	let allTiers = {'uber':'Uber', 'ou':'OU', 'bl':"BL", 'uu':'UU', 'bl2':"BL2", 'ru':'RU', 'bl3':"BL3", 'nu':'NU', 'bl4':"BL4", 'pu':'PU', 'nfe':'NFE', 'lc uber':"LC Uber", 'lc':'LC', 'cap':"CAP"};
	let allColours = {'green':1, 'red':1, 'blue':1, 'white':1, 'brown':1, 'yellow':1, 'purple':1, 'pink':1, 'gray':1, 'black':1};
	let allStats = {'hp':1, 'atk':1, 'def':1, 'spa':1, 'spd':1, 'spe':1, 'bst':1};
	let showAll = false;
	let megaSearch = null;
	let capSearch = null;
	let randomOutput = 0;

	let validParameter = (cat, param, isNotSearch, input) => {
		let uniqueTraits = {'colors':1, 'gens':1};
		for (let h = 0; h < searches.length; h++) {
			let group = searches[h];
			if (group[cat] === undefined) continue;
			if (group[cat][param] === undefined) {
				if (cat in uniqueTraits) {
					for (let currentParam in group[cat]) {
						if (group[cat][currentParam] !== isNotSearch) return "A pokemon cannot have multiple " + cat + ".";
					}
				}
				continue;
			}
			if (group[cat][param] === isNotSearch) {
				return "A search cannot both include and exclude '" + input + "'.";
			} else {
				return "The search included '" + (isNotSearch ? "!" : "") + input + "' more than once.";
			}
		}
		return false;
	};

	let andGroups = target.split(',');
	for (let i = 0; i < andGroups.length; i++) {
		let orGroup = {abilities: {}, tiers: {}, colors: {}, gens: {}, moves: {}, types: {}, resists: {}, stats: {}, skip: false};
		let parameters = andGroups[i].split("|");
		if (parameters.length > 3) return {reply: "No more than 3 alternatives for each parameter may be used."};
		for (let j = 0; j < parameters.length; j++) {
			let isNotSearch = false;
			target = parameters[j].trim().toLowerCase();
			if (target.charAt(0) === '!') {
				isNotSearch = true;
				target = target.substr(1);
			}

			let targetAbility = Tools.getAbility(target);
			if (targetAbility.exists) {
				let invalid = validParameter("abilities", targetAbility, isNotSearch, targetAbility);
				if (invalid) return {reply: invalid};
				orGroup.abilities[targetAbility] = !isNotSearch;
				continue;
			}

			if (target in allTiers) {
				target = allTiers[target];
				if (target === "CAP") {
					if (parameters.length > 1) return {reply: "The parameter 'CAP' cannot have alternative parameters"};
					if (capSearch === isNotSearch) return {reply: "A search cannot both include and exclude 'CAP'."};
					capSearch = !isNotSearch;
				}
				let invalid = validParameter("tiers", target, isNotSearch, target);
				if (invalid) return {reply: invalid};
				orGroup.tiers[target] = !isNotSearch;
				continue;
			}

			if (target in allColours) {
				target = target.charAt(0).toUpperCase() + target.slice(1);
				let invalid = validParameter("colors", target, isNotSearch, target);
				if (invalid) return {reply: invalid};
				orGroup.colors[target] = !isNotSearch;
				continue;
			}

			let targetInt = 0;
			if (target.substr(0, 3) === 'gen' && Number.isInteger(parseFloat(target.substr(3)))) targetInt = parseInt(target.substr(3).trim());
			if (0 < targetInt && targetInt < 7) {
				let invalid = validParameter("gens", targetInt, isNotSearch, target);
				if (invalid) return {reply: invalid};
				orGroup.gens[targetInt] = !isNotSearch;
				continue;
			}

			if (target === 'all') {
				if (!canAll) return {reply: "A search with the parameter 'all' cannot be broadcast."};
				if (parameters.length > 1) return {reply: "The parameter 'all' cannot have alternative parameters"};
				showAll = true;
				orGroup.skip = true;
				break;
			}

			if (target.substr(0, 6) === 'random' && cmd === 'randpoke') {
				//validation for this is in the /randpoke command
				randomOutput = parseInt(target.substr(6));
				orGroup.skip = true;
				continue;
			}

			if (target === 'megas' || target === 'mega') {
				if (megaSearch === isNotSearch) return {reply: "A search cannot include and exclude 'mega'."};
				if (parameters.length > 1) return {reply: "The parameter 'mega' cannot have alternative parameters"};
				megaSearch = !isNotSearch;
				orGroup.skip = true;
				break;
			}

			if (target === 'recovery') {
				if (parameters.length > 1) return {reply: "The parameter 'recovery' cannot have alternative parameters"};
				let recoveryMoves = ["recover", "roost", "moonlight", "morningsun", "synthesis", "milkdrink", "slackoff", "softboiled", "wish", "healorder"];
				for (let k = 0; k < recoveryMoves.length; k++) {
					let invalid = validParameter("moves", recoveryMoves[k], isNotSearch, target);
					if (invalid) return {reply: invalid};
					if (isNotSearch) {
						let bufferObj = {moves: {}};
						bufferObj.moves[recoveryMoves[k]] = false;
						searches.push(bufferObj);
					} else {
						orGroup.moves[recoveryMoves[k]] = true;
					}
				}
				if (isNotSearch) orGroup.skip = true;
				break;
			}

			if (target === 'priority') {
				if (parameters.length > 1) return {reply: "The parameter 'priority' cannot have alternative parameters"};
				for (let move in Tools.data.Movedex) {
					let moveData = Tools.getMove(move);
					if (moveData.category === "Status" || moveData.id === "bide") continue;
					if (moveData.priority > 0) {
						let invalid = validParameter("moves", move, isNotSearch, target);
						if (invalid) return {reply: invalid};
						if (isNotSearch) {
							let bufferObj = {moves: {}};
							bufferObj.moves[move] = false;
							searches.push(bufferObj);
						} else {
							orGroup.moves[move] = true;
						}
					}
				}
				if (isNotSearch) orGroup.skip = true;
				break;
			}

			if (target.substr(0, 8) === 'resists ') {
				let targetResist = target.substr(8, 1).toUpperCase() + target.substr(9);
				if (targetResist in Tools.data.TypeChart) {
					let invalid = validParameter("resists", targetResist, isNotSearch, target);
					if (invalid) return {reply: invalid};
					orGroup.resists[targetResist] = !isNotSearch;
					continue;
				} else {
					return {reply: "'" + targetResist + "' is not a recognized type."};
				}
			}

			let targetMove = Tools.getMove(target);
			if (targetMove.exists) {
				let invalid = validParameter("moves", targetMove.id, isNotSearch, target);
				if (invalid) return {reply: invalid};
				orGroup.moves[targetMove.id] = !isNotSearch;
				continue;
			}

			let typeIndex = target.indexOf(' type');
			if (typeIndex >= 0) {
				target = target.charAt(0).toUpperCase() + target.substring(1, typeIndex);
				if (target in Tools.data.TypeChart) {
					let invalid = validParameter("types", target, isNotSearch, target + ' type');
					if (invalid) return {reply: invalid};
					orGroup.types[target] = !isNotSearch;
					continue;
				} else {
					return {reply: "'" + target + "' is not a recognized type."};
				}
			}

			let inequality = target.search(/>|<|=/);
			if (inequality >= 0) {
				if (isNotSearch) return {reply: "You cannot use the negation symbol '!' in stat ranges."};
				if (target.charAt(inequality + 1) === '=') {
					inequality = target.substr(inequality, 2);
				} else {
					inequality = target.charAt(inequality);
				}
				let inequalityOffset = (inequality.charAt(1) === '=' ? 0 : -1);
				let targetParts = target.replace(/\s/g, '').split(inequality);
				let num, stat, direction;
				if (!isNaN(targetParts[0])) {
					// e.g. 100 < spe
					num = parseFloat(targetParts[0]);
					stat = targetParts[1];
					switch (inequality.charAt(0)) {
					case '>': direction = 'less'; num += inequalityOffset; break;
					case '<': direction = 'greater'; num -= inequalityOffset; break;
					case '=': direction = 'equal'; break;
					}
				} else if (!isNaN(targetParts[1])) {
					// e.g. spe > 100
					num = parseFloat(targetParts[1]);
					stat = targetParts[0];
					switch (inequality.charAt(0)) {
					case '<': direction = 'less'; num += inequalityOffset; break;
					case '>': direction = 'greater'; num -= inequalityOffset; break;
					case '=': direction = 'equal'; break;
					}
				} else {
					return {reply: "No value given to compare with '" + Tools.escapeHTML(target) + "'."};
				}
				switch (toId(stat)) {
				case 'attack': stat = 'atk'; break;
				case 'defense': stat = 'def'; break;
				case 'specialattack': stat = 'spa'; break;
				case 'spatk': stat = 'spa'; break;
				case 'specialdefense': stat = 'spd'; break;
				case 'spdef': stat = 'spd'; break;
				case 'speed': stat = 'spe'; break;
				}
				if (!(stat in allStats)) return {reply: "'" + Tools.escapeHTML(target) + "' did not contain a valid stat."};
				if (!orGroup.stats[stat]) orGroup.stats[stat] = {};
				if (orGroup.stats[stat][direction]) return {reply: "Invalid stat range for " + stat + "."};
				orGroup.stats[stat][direction] = num;
				continue;
			}
			return {reply: "'" + Tools.escapeHTML(target) + "' could not be found in any of the search categories."};
		}
		searches.push(orGroup);
	}

	if (showAll && searches.length === 0 && megaSearch === null) return {reply: "No search parameters other than 'all' were found. Try '/help dexsearch' for more information on this command."};

	let dex = {};
	for (let pokemon in Tools.data.Pokedex) {
		let template = Tools.getTemplate(pokemon);
		let megaSearchResult = (megaSearch === null || (megaSearch === true && template.isMega) || (megaSearch === false && !template.isMega));
		if (template.tier !== 'Unreleased' && template.tier !== 'Illegal' && (template.tier !== 'CAP' || capSearch) && megaSearchResult) {
			dex[pokemon] = template;
		}
	}
	dex = JSON.parse(JSON.stringify(dex)); // Don't modify the original template (when compiling learnsets)

	let learnSetsCompiled = false;

	// Prioritize searches with the least alternatives.
	const accumulateKeyCount = (count, searchData) => count + (typeof searchData === 'object' ? Object.keys(searchData).length : 0);
	searches.sort((a, b) => Object.values(a).reduce(accumulateKeyCount, 0) - Object.values(b).reduce(accumulateKeyCount, 0));

	for (let group = 0; group < searches.length; group++) {
		let alts = searches[group];
		if (alts.skip) continue;
		for (let mon in dex) {
			let matched = false;
			if (alts.gens && Object.keys(alts.gens).length) {
				if (alts.gens[dex[mon].gen]) continue;
				if (Object.values(alts.gens).includes(false) && alts.gens[dex[mon].gen] !== false) continue;
			}

			if (alts.colors && Object.keys(alts.colors).length) {
				if (alts.colors[dex[mon].color]) continue;
				if (Object.values(alts.colors).includes(false) && alts.colors[dex[mon].color] !== false) continue;
			}

			if (alts.tiers && Object.keys(alts.tiers).length) {
				if (alts.tiers[dex[mon].tier]) continue;
				if (Object.values(alts.tiers).includes(false) && alts.tiers[dex[mon].tier] !== false) continue;
				// some LC Pokemon are also in other tiers and need to be handled separately
				if (alts.tiers.LC && !dex[mon].prevo && dex[mon].nfe && dex[mon].tier !== 'LC Uber' && !Tools.data.Formats.lc.banlist.includes(dex[mon].species)) continue;
			}

			for (let type in alts.types) {
				if (dex[mon].types.includes(type) === alts.types[type]) {
					matched = true;
					break;
				}
			}
			if (matched) continue;

			for (let type in alts.resists) {
				let effectiveness = 0;
				let notImmune = Tools.getImmunity(type, dex[mon]);
				if (notImmune) effectiveness = Tools.getEffectiveness(type, dex[mon]);
				if (!alts.resists[type]) {
					if (notImmune && effectiveness >= 0) matched = true;
				} else {
					if (!notImmune || effectiveness < 0) matched = true;
				}
			}
			if (matched) continue;

			for (let ability in alts.abilities) {
				if (Object.values(dex[mon].abilities).includes(ability) === alts.abilities[ability]) {
					matched = true;
					break;
				}
			}
			if (matched) continue;

			for (let stat in alts.stats) {
				let monStat = 0;
				if (stat === 'bst') {
					for (let monStats in dex[mon].baseStats) {
						monStat += dex[mon].baseStats[monStats];
					}
				} else {
					monStat = dex[mon].baseStats[stat];
				}
				if (typeof alts.stats[stat].less === 'number') {
					if (monStat <= alts.stats[stat].less) {
						matched = true;
						break;
					}
				}
				if (typeof alts.stats[stat].greater === 'number') {
					if (monStat >= alts.stats[stat].greater) {
						matched = true;
						break;
					}
				}
				if (typeof alts.stats[stat].equal === 'number') {
					if (monStat === alts.stats[stat].equal) {
						matched = true;
						break;
					}
				}
			}
			if (matched) continue;

			if (!learnSetsCompiled) {
				for (let mon2 in dex) {
					let template = dex[mon2];
					if (!template.learnset) template = Tools.getTemplate(template.baseSpecies);
					if (!template.learnset) continue;
					let fullLearnset = template.learnset;
					while (template.prevo) {
						template = Tools.getTemplate(template.prevo);
						for (let move in template.learnset) {
							if (!fullLearnset[move]) fullLearnset[move] = template.learnset[move];
						}
					}
					dex[mon2].learnset = fullLearnset;
				}
				learnSetsCompiled = true;
			}

			for (let move in alts.moves) {
				let canLearn = (dex[mon].learnset.sketch && !['chatter', 'struggle', 'magikarpsrevenge'].includes(move)) || dex[mon].learnset[move];
				if ((canLearn && alts.moves[move]) || (alts.moves[move] === false && !canLearn)) {
					matched = true;
					break;
				}
			}
			if (matched) continue;

			delete dex[mon];
		}
	}

	let results = [];
	for (let mon in dex) {
		if (dex[mon].baseSpecies && results.includes(dex[mon].baseSpecies)) continue;
		results.push(dex[mon].species);
	}

	let moveGroups = searches
		.filter(alts => alts.moves && Object.keys(alts.moves).some(move => alts.moves[move]))
		.map(alts => Object.keys(alts.moves));
	if (moveGroups.length >= 2) {
		results = results.filter(mon => {
			let lsetData = {fastCheck: true, set: {}};
			for (let group = 0; group < moveGroups.length; group++) {
				for (let i = 0; i < moveGroups[group].length; i++) {
					let problem = TeamValidator('anythinggoes').checkLearnset(moveGroups[group][i], mon, lsetData);
					if (!problem) break;
					if (i === moveGroups[group].length - 1) return false;
				}
			}
			return true;
		});
	}

	if (randomOutput && randomOutput < results.length) {
		results = Tools.shuffle(results).slice(0, randomOutput);
	}

	let resultsStr = (message === "" ? message : "<font color=#999999>" + Tools.escapeHTML(message) + ":</font><br>");
	if (results.length > 1) {
		if (showAll || results.length <= RESULTS_MAX_LENGTH + 5) {
			results.sort();
			resultsStr += results.join(", ");
		} else {
			resultsStr += results.slice(0, RESULTS_MAX_LENGTH).join(", ") + ", and " + (results.length - RESULTS_MAX_LENGTH) + " more. <font color=#999999>Redo the search with 'all' as a search parameter to show all results.</font>";
		}
	} else if (results.length === 1) {
		return {dt: results[0]};
	} else {
		resultsStr += "No Pok&eacute;mon found.";
	}
	return {reply: resultsStr};
}

function runMovesearch(target, cmd, canAll, message) {
	let targets = target.split(',');
	let searches = {};
	let allCategories = {'physical':1, 'special':1, 'status':1};
	let allContestTypes = {'beautiful':1, 'clever':1, 'cool':1, 'cute':1, 'tough':1};
	let allProperties = {'basePower':1, 'accuracy':1, 'priority':1, 'pp':1};
	let allFlags = {'authentic':1, 'bite':1, 'bullet':1, 'contact':1, 'defrost':1, 'powder':1, 'pulse':1, 'punch':1, 'secondary':1, 'snatch':1, 'sound':1};
	let allStatus = {'psn':1, 'tox':1, 'brn':1, 'par':1, 'frz':1, 'slp':1};
	let allVolatileStatus = {'flinch':1, 'confusion':1, 'partiallytrapped':1};
	let allBoosts = {'hp':1, 'atk':1, 'def':1, 'spa':1, 'spd':1, 'spe':1, 'accuracy':1, 'evasion':1};
	let showAll = false;
	let lsetData = {};
	let targetMon = '';

	for (let i = 0; i < targets.length; i++) {
		let isNotSearch = false;
		target = targets[i].toLowerCase().trim();
		if (target.charAt(0) === '!') {
			isNotSearch = true;
			target = target.substr(1);
		}

		let typeIndex = target.indexOf(' type');
		if (typeIndex >= 0) {
			target = target.charAt(0).toUpperCase() + target.substring(1, typeIndex);
			if (!(target in Tools.data.TypeChart)) return {reply: "Type '" + Tools.escapeHTML(target) + "' not found."};
			if (!searches['type']) searches['type'] = {};
			if ((searches['type'][target] && isNotSearch) || (searches['type'][target] === false && !isNotSearch)) return {reply: 'A search cannot both exclude and include a type.'};
			searches['type'][target] = !isNotSearch;
			continue;
		}

		if (target in allCategories) {
			target = target.charAt(0).toUpperCase() + target.substr(1);
			if (!searches['category']) searches['category'] = {};
			if ((searches['category'][target] && isNotSearch) || (searches['category'][target] === false && !isNotSearch)) return {reply: 'A search cannot both exclude and include a category.'};
			searches['category'][target] = !isNotSearch;
			continue;
		}

		if (target in allContestTypes) {
			target = target.charAt(0).toUpperCase() + target.substr(1);
			if (!searches['contestType']) searches['contestType'] = {};
			if ((searches['contestType'][target] && isNotSearch) || (searches['contestType'][target] === false && !isNotSearch)) return {reply: 'A search cannot both exclude and include a contest condition.'};
			searches['contestType'][target] = !isNotSearch;
			continue;
		}

		if (target === 'bypassessubstitute') target = 'authentic';
		if (target in allFlags) {
			if (!searches['flags']) searches['flags'] = {};
			if ((searches['flags'][target] && isNotSearch) || (searches['flags'][target] === false && !isNotSearch)) return {reply: 'A search cannot both exclude and include \'' + target + '\'.'};
			searches['flags'][target] = !isNotSearch;
			continue;
		}

		if (target === 'all') {
			if (!canAll) return {reply: "A search with the parameter 'all' cannot be broadcast."};
			showAll = true;
			continue;
		}

		if (target === 'recovery') {
			if (!searches['recovery']) {
				searches['recovery'] = !isNotSearch;
			} else if ((searches['recovery'] && isNotSearch) || (searches['recovery'] === false && !isNotSearch)) {
				return {reply: 'A search cannot both exclude and include recovery moves.'};
			}
			continue;
		}

		let template = Tools.getTemplate(target);
		if (template.exists) {
			if (Object.keys(lsetData).length) return {reply: "A search can only include one Pok\u00e9mon learnset."};
			if (!template.learnset) template = Tools.getTemplate(template.baseSpecies);
			lsetData = template.learnset;
			targetMon = template.name;
			while (template.prevo) {
				template = Tools.getTemplate(template.prevo);
				for (let move in template.learnset) {
					if (!lsetData[move]) lsetData[move] = template.learnset[move];
				}
			}
			continue;
		}

		let inequality = target.search(/>|<|=/);
		if (inequality >= 0) {
			if (isNotSearch) return {reply: "You cannot use the negation symbol '!' in quality ranges."};
			inequality = target.charAt(inequality);
			let targetParts = target.replace(/\s/g, '').split(inequality);
			let numSide, propSide, direction;
			if (!isNaN(targetParts[0])) {
				numSide = 0;
				propSide = 1;
				switch (inequality) {
				case '>': direction = 'less'; break;
				case '<': direction = 'greater'; break;
				case '=': direction = 'equal'; break;
				}
			} else if (!isNaN(targetParts[1])) {
				numSide = 1;
				propSide = 0;
				switch (inequality) {
				case '<': direction = 'less'; break;
				case '>': direction = 'greater'; break;
				case '=': direction = 'equal'; break;
				}
			} else {
				return {reply: "No value given to compare with '" + Tools.escapeHTML(target) + "'."};
			}
			let prop = targetParts[propSide];
			switch (toId(targetParts[propSide])) {
			case 'basepower': prop = 'basePower'; break;
			case 'bp': prop = 'basePower'; break;
			case 'acc': prop = 'accuracy'; break;
			}
			if (!(prop in allProperties)) return {reply: "'" + Tools.escapeHTML(target) + "' did not contain a valid property."};
			if (!searches['property']) searches['property'] = {};
			if (direction === 'equal') {
				if (searches['property'][prop]) return {reply: "Invalid property range for " + prop + "."};
				searches['property'][prop] = {};
				searches['property'][prop]['less'] = parseFloat(targetParts[numSide]);
				searches['property'][prop]['greater'] = parseFloat(targetParts[numSide]);
			} else {
				if (!searches['property'][prop]) searches['property'][prop] = {};
				if (searches['property'][prop][direction]) {
					return {reply: "Invalid property range for " + prop + "."};
				} else {
					searches['property'][prop][direction] = parseFloat(targetParts[numSide]);
				}
			}
			continue;
		}

		if (target.substr(0, 8) === 'priority') {
			let sign = '';
			target = target.substr(8).trim();
			if (target === "+") {
				sign = 'greater';
			} else if (target === "-") {
				sign = 'less';
			} else {
				return {reply: "Priority type '" + target + "' not recognized."};
			}
			if (!searches['property']) searches['property'] = {};
			if (searches['property']['priority']) {
				return {reply: "Priority cannot be set with both shorthand and inequality range."};
			} else {
				searches['property']['priority'] = {};
				searches['property']['priority'][sign] = (sign === 'less' ? -1 : 1);
			}
			continue;
		}

		if (target.substr(0, 7) === 'boosts ') {
			switch (target.substr(7)) {
			case 'attack': target = 'atk'; break;
			case 'defense': target = 'def'; break;
			case 'specialattack': target = 'spa'; break;
			case 'spatk': target = 'spa'; break;
			case 'specialdefense': target = 'spd'; break;
			case 'spdef': target = 'spd'; break;
			case 'speed': target = 'spe'; break;
			case 'acc': target = 'accuracy'; break;
			case 'evasiveness': target = 'evasion'; break;
			default: target = target.substr(7);
			}
			if (!(target in allBoosts)) return {reply: "'" + Tools.escapeHTML(target.substr(7)) + "' is not a recognized stat."};
			if (!searches['boost']) searches['boost'] = {};
			if ((searches['boost'][target] && isNotSearch) || (searches['boost'][target] === false && !isNotSearch)) return {reply: 'A search cannot both exclude and include a stat boost.'};
			searches['boost'][target] = !isNotSearch;
			continue;
		}

		let oldTarget = target;
		if (target.charAt(target.length - 1) === 's') target = target.substr(0, target.length - 1);
		switch (target) {
		case 'toxic': target = 'tox'; break;
		case 'poison': target = 'psn'; break;
		case 'burn': target = 'brn'; break;
		case 'paralyze': target = 'par'; break;
		case 'freeze': target = 'frz'; break;
		case 'sleep': target = 'slp'; break;
		case 'confuse': target = 'confusion'; break;
		case 'trap': target = 'partiallytrapped'; break;
		case 'flinche': target = 'flinch'; break;
		}

		if (target in allStatus) {
			if (!searches['status']) searches['status'] = {};
			if ((searches['status'][target] && isNotSearch) || (searches['status'][target] === false && !isNotSearch)) return {reply: 'A search cannot both exclude and include a status.'};
			searches['status'][target] = !isNotSearch;
			continue;
		}

		if (target in allVolatileStatus) {
			if (!searches['volatileStatus']) searches['volatileStatus'] = {};
			if ((searches['volatileStatus'][target] && isNotSearch) || (searches['volatileStatus'][target] === false && !isNotSearch)) return {reply: 'A search cannot both exclude and include a volitile status.'};
			searches['volatileStatus'][target] = !isNotSearch;
			continue;
		}

		return {reply: "'" + Tools.escapeHTML(oldTarget) + "' could not be found in any of the search categories."};
	}

	if (showAll && !Object.keys(searches).length && !targetMon) {
		return {reply: "No search parameters other than 'all' were found. Try '/help movesearch' for more information on this command."};
	}

	let dex = {};
	if (targetMon) {
		for (let move in lsetData) {
			dex[move] = Tools.getMove(move);
		}
	} else {
		for (let move in Tools.data.Movedex) {
			dex[move] = Tools.getMove(move);
		}
		delete dex.magikarpsrevenge;
	}

	for (let search in searches) {
		switch (search) {
		case 'type':
		case 'category':
		case 'contestType':
			for (let move in dex) {
				if (searches[search][String(dex[move][search])] === false ||
					Object.values(searches[search]).includes(true) && !searches[search][String(dex[move][search])]) {
					delete dex[move];
				}
			}
			break;

		case 'flags':
			for (let flag in searches[search]) {
				for (let move in dex) {
					if (flag !== 'secondary') {
						if ((!dex[move].flags[flag] && searches[search][flag]) || (dex[move].flags[flag] && !searches[search][flag])) delete dex[move];
					} else {
						if (searches[search][flag]) {
							if (!dex[move].secondary && !dex[move].secondaries) delete dex[move];
						} else {
							if (dex[move].secondary && dex[move].secondaries) delete dex[move];
						}
					}
				}
			}
			break;

		case 'recovery':
			for (let move in dex) {
				let hasRecovery = (dex[move].drain || dex[move].flags.heal);
				if ((!hasRecovery && searches[search]) || (hasRecovery && !searches[search])) delete dex[move];
			}
			break;

		case 'property':
			for (let prop in searches[search]) {
				for (let move in dex) {
					if (typeof searches[search][prop].less === "number") {
						if (dex[move][prop] === true) {
							delete dex[move];
							continue;
						}
						if (dex[move][prop] > searches[search][prop].less) {
							delete dex[move];
							continue;
						}
					}
					if (typeof searches[search][prop].greater === "number") {
						if (dex[move][prop] === true) {
							if (dex[move].category === "Status") delete dex[move];
							continue;
						}
						if (dex[move][prop] < searches[search][prop].greater) {
							delete dex[move];
							continue;
						}
					}
				}
			}
			break;

		case 'boost':
			for (let boost in searches[search]) {
				for (let move in dex) {
					if (dex[move].boosts) {
						if ((dex[move].boosts[boost] > 0 && searches[search][boost]) ||
							(dex[move].boosts[boost] < 1 && !searches[search][boost])) continue;
					} else if (dex[move].secondary && dex[move].secondary.self && dex[move].secondary.self.boosts) {
						if ((dex[move].secondary.self.boosts[boost] > 0 && searches[search][boost]) ||
							(dex[move].secondary.self.boosts[boost] < 1 && !searches[search][boost])) continue;
					}
					delete dex[move];
				}
			}
			break;

		case 'status':
		case 'volatileStatus':
			for (let searchStatus in searches[search]) {
				for (let move in dex) {
					if (dex[move][search] !== searchStatus) {
						if (!dex[move].secondaries) {
							if (!dex[move].secondary) {
								if (searches[search][searchStatus]) delete dex[move];
							} else {
								if ((dex[move].secondary[search] !== searchStatus && searches[search][searchStatus]) ||
									(dex[move].secondary[search] === searchStatus && !searches[search][searchStatus])) delete dex[move];
							}
						} else {
							let hasSecondary = false;
							for (let i = 0; i < dex[move].secondaries.length; i++) {
								if (dex[move].secondaries[i][search] === searchStatus) hasSecondary = true;
							}
							if ((!hasSecondary && searches[search][searchStatus]) || (hasSecondary && !searches[search][searchStatus])) delete dex[move];
						}
					} else {
						if (!searches[search][searchStatus]) delete dex[move];
					}
				}
			}
			break;

		default:
			throw new Error("/movesearch search category '" + search + "' was unrecognised.");
		}
	}

	let results = [];
	for (let move in dex) {
		results.push(dex[move].name);
	}

	let resultsStr = "";
	if (targetMon) {
		resultsStr += "<font color=#999999>Matching moves found in learnset for</font> " + targetMon + ":<br>";
	} else {
		resultsStr += (message === "" ? message : "<font color=#999999>" + Tools.escapeHTML(message) + ":</font><br>");
	}
	if (results.length > 0) {
		if (showAll || results.length <= RESULTS_MAX_LENGTH + 5) {
			results.sort();
			resultsStr += results.join(", ");
		} else {
			resultsStr += results.slice(0, RESULTS_MAX_LENGTH).join(", ") + ", and " + (results.length - RESULTS_MAX_LENGTH) + " more. <font color=#999999>Redo the search with 'all' as a search parameter to show all results.</font>";
		}
	} else {
		resultsStr += "No moves found.";
	}
	return {reply: resultsStr};
}

function runItemsearch(target, cmd, canAll, message) {
	let showAll = false;

	target = target.trim();
	if (target.substr(target.length - 5) === ', all' || target.substr(target.length - 4) === ',all') {
		showAll = true;
		target = target.substr(0, target.length - 5);
	}

	target = target.toLowerCase().replace('-', ' ').replace(/[^a-z0-9.\s\/]/g, '');
	let rawSearch = target.split(' ');
	let searchedWords = [];
	let foundItems = [];

	//refine searched words
	for (let i = 0; i < rawSearch.length; i++) {
		let newWord = rawSearch[i].trim();
		if (isNaN(newWord)) newWord = newWord.replace('.', '');
		switch (newWord) {
		// words that don't really help identify item removed to speed up search
		case 'a':
		case 'an':
		case 'is':
		case 'it':
		case 'its':
		case 'the':
		case 'that':
		case 'which':
		case 'user':
		case 'holder':
		case 'holders':
			newWord = '';
			break;
		// replace variations of common words with standardized versions
		case 'opponent': newWord = 'attacker'; break;
		case 'flung': newWord = 'fling'; break;
		case 'heal': case 'heals':
		case 'recovers': newWord = 'restores'; break;
		case 'boost':
		case 'boosts': newWord = 'raises'; break;
		case 'weakens': newWord = 'halves'; break;
		case 'more': newWord = 'increases'; break;
		case 'super':
			if (rawSearch[i + 1] === 'effective') {
				newWord = 'supereffective';
			}
			break;
		case 'special': newWord = 'sp'; break;
		case 'spa':
			newWord = 'sp';
			break;
		case 'atk':
		case 'attack':
			if (rawSearch[i - 1] === 'sp') {
				newWord = 'atk';
			} else {
				newWord = 'attack';
			}
			break;
		case 'spd':
			newWord = 'sp';
			break;
		case 'def':
		case 'defense':
			if (rawSearch[i - 1] === 'sp') {
				newWord = 'def';
			} else {
				newWord = 'defense';
			}
			break;
		case 'burns': newWord = 'burn'; break;
		case 'poisons': newWord = 'poison'; break;
		default:
			if (/x[\d\.]+/.test(newWord)) {
				newWord = newWord.substr(1) + 'x';
			}
		}
		if (!newWord || searchedWords.includes(newWord)) continue;
		searchedWords.push(newWord);
	}

	if (searchedWords.length === 0) return {reply: "No distinguishing words were used. Try a more specific search."};
	if (searchedWords.includes('fling')) {
		let basePower = 0;
		let effect;

		for (let k = 0; k < searchedWords.length; k++) {
			let wordEff = "";
			switch (searchedWords[k]) {
			case 'burn': case 'burns':
			case 'brn': wordEff = 'brn'; break;
			case 'paralyze': case 'paralyzes':
			case 'par': wordEff = 'par'; break;
			case 'poison': case 'poisons':
			case 'psn': wordEff = 'psn'; break;
			case 'toxic':
			case 'tox': wordEff = 'tox'; break;
			case 'flinches':
			case 'flinch': wordEff = 'flinch'; break;
			case 'badly': wordEff = 'tox'; break;
			}
			if (wordEff && effect) {
				if (!(wordEff === 'psn' && effect === 'tox')) return {reply: "Only specify fling effect once."};
			} else if (wordEff) {
				effect = wordEff;
			} else {
				if (searchedWords[k].substr(searchedWords[k].length - 2) === 'bp' && searchedWords[k].length > 2) searchedWords[k] = searchedWords[k].substr(0, searchedWords[k].length - 2);
				if (Number.isInteger(Number(searchedWords[k]))) {
					if (basePower) return {reply: "Only specify a number for base power once."};
					basePower = parseInt(searchedWords[k]);
				}
			}
		}

		for (let n in Tools.data.Items) {
			let item = Tools.getItem(n);
			if (!item.fling) continue;

			if (basePower && effect) {
				if (item.fling.basePower === basePower &&
				(item.fling.status === effect || item.fling.volatileStatus === effect)) foundItems.push(item.name);
			} else if (basePower) {
				if (item.fling.basePower === basePower) foundItems.push(item.name);
			} else {
				if (item.fling.status === effect || item.fling.volatileStatus === effect) foundItems.push(item.name);
			}
		}
		if (foundItems.length === 0) return {reply: 'No items inflict ' + basePower + 'bp damage when used with Fling.'};
	} else if (target.search(/natural ?gift/i) >= 0) {
		let basePower = 0;
		let type = "";

		for (let k = 0; k < searchedWords.length; k++) {
			searchedWords[k] = searchedWords[k].charAt(0).toUpperCase() + searchedWords[k].slice(1);
			if (searchedWords[k] in Tools.data.TypeChart) {
				if (type) return {reply: "Only specify natural gift type once."};
				type = searchedWords[k];
			} else {
				if (searchedWords[k].substr(searchedWords[k].length - 2) === 'bp' && searchedWords[k].length > 2) searchedWords[k] = searchedWords[k].substr(0, searchedWords[k].length - 2);
				if (Number.isInteger(Number(searchedWords[k]))) {
					if (basePower) return {reply: "Only specify a number for base power once."};
					basePower = parseInt(searchedWords[k]);
				}
			}
		}

		for (let n in Tools.data.Items) {
			let item = Tools.getItem(n);
			if (!item.isBerry) continue;

			if (basePower && type) {
				if (item.naturalGift.basePower === basePower && item.naturalGift.type === type) foundItems.push(item.name);
			} else if (basePower) {
				if (item.naturalGift.basePower === basePower) foundItems.push(item.name);
			} else {
				if (item.naturalGift.type === type) foundItems.push(item.name);
			}
		}
		if (foundItems.length === 0) return {reply: 'No berries inflict ' + basePower + 'bp damage when used with Natural Gift.'};
	} else {
		let bestMatched = 0;
		for (let n in Tools.data.Items) {
			let item = Tools.getItem(n);
			let matched = 0;
			// splits words in the description into a toId()-esk format except retaining / and . in numbers
			let descWords = item.desc;
			// add more general quantifier words to descriptions
			if (/[1-9\.]+x/.test(descWords)) descWords += ' increases';
			if (item.isBerry) descWords += ' berry';
			descWords = descWords.replace(/super[\-\s]effective/g, 'supereffective');
			descWords = descWords.toLowerCase().replace('-', ' ').replace(/[^a-z0-9\s\/]/g, '').replace(/(\D)\./, (p0, p1) => p1).split(' ');

			for (let k = 0; k < searchedWords.length; k++) {
				if (descWords.includes(searchedWords[k])) matched++;
			}

			if (matched >= bestMatched && matched >= (searchedWords.length * 3 / 5)) foundItems.push(item.name);
			if (matched > bestMatched) bestMatched = matched;
		}

		// iterate over found items again to make sure they all are the best match
		for (let l = 0; l < foundItems.length; l++) {
			let item = Tools.getItem(foundItems[l]);
			let matched = 0;
			let descWords = item.desc;
			if (/[1-9\.]+x/.test(descWords)) descWords += ' increases';
			if (item.isBerry) descWords += ' berry';
			descWords = descWords.replace(/super[\-\s]effective/g, 'supereffective');
			descWords = descWords.toLowerCase().replace('-', ' ').replace(/[^a-z0-9\s\/]/g, '').replace(/(\D)\./, (p0, p1) => p1).split(' ');

			for (let k = 0; k < searchedWords.length; k++) {
				if (descWords.includes(searchedWords[k])) matched++;
			}

			if (matched !== bestMatched) {
				foundItems.splice(l, 1);
				l--;
			}
		}
	}

	let resultsStr = (message === "" ? message : "<font color=#999999>" + Tools.escapeHTML(message) + ":</font><br>");
	if (foundItems.length > 0) {
		if (showAll || foundItems.length <= RESULTS_MAX_LENGTH + 5) {
			foundItems.sort();
			resultsStr += foundItems.join(", ");
		} else {
			resultsStr += foundItems.slice(0, RESULTS_MAX_LENGTH).join(", ") + ", and " + (foundItems.length - RESULTS_MAX_LENGTH) + " more. <font color=#999999>Redo the search with ', all' at the end to show all results.</font>";
		}
	} else {
		resultsStr += "No items found. Try a more general search";
	}
	return {reply: resultsStr};
}

function runLearn(target, cmd) {
	let lsetData = {set:{}};
	let targets = target.split(',');
	let template = Tools.getTemplate(targets[0]);
	let move = {};
	let problem;
	let gen = ({rby:1, gsc:2, adv:3, dpp:4, bw2:5}[cmd.substring(0, 3)] || 6);
	let format = 'gen' + gen + 'ou';
	let all = (cmd === 'learnall');
	if (cmd === 'learn5') lsetData.set.level = 5;
	if (cmd === 'g6learn') lsetData.format = {noPokebank: true};

	if (!template.exists || template.id === 'missingno') {
		return {error: "Pok\u00e9mon '" + template.id + "' not found."};
	}

	if (template.gen > gen) {
		return {error: template.name + " didn't exist yet in generation " + gen + "."};
	}

	if (targets.length < 2) {
		return {error: "You must specify at least one move."};
	}

	for (let i = 1, len = targets.length; i < len; i++) {
		move = Tools.getMove(targets[i]);
		if (!move.exists || move.id === 'magikarpsrevenge') {
			return {error: "Move '" + move.id + "' not found."};
		}
		if (move.gen > gen) {
			return {error: move.name + " didn't exist yet in generation " + gen + "."};
		}
		problem = TeamValidator(format).checkLearnset(move, template.species, lsetData);
		if (problem) break;
	}
	let buffer = "";
	if (format) buffer += "In Gen " + gen + ", ";
	buffer += "" + template.name + (problem ? " <span class=\"message-learn-cannotlearn\">can't</span> learn " : " <span class=\"message-learn-canlearn\">can</span> learn ") + (targets.length > 2 ? "these moves" : move.name);
	if (!problem) {
		let sourceNames = {E:"egg", S:"event", D:"dream world", X:"egg, traded back", Y: "event, traded back"};
		let sourcesBefore = lsetData.sourcesBefore;
		if (lsetData.sources || sourcesBefore < gen) buffer += " only when obtained";
		buffer += " from:<ul class=\"message-learn-list\">";
		if (lsetData.sources) {
			let sources = lsetData.sources.map(source => {
				if (source.slice(0, 3) === '1ET') {
					return '2X' + source.slice(3);
				}
				if (source.slice(0, 3) === '1ST') {
					return '2Y' + source.slice(3);
				}
				return source;
			}).sort();
			let prevSourceType;
			let prevSourceCount = 0;
			for (let i = 0, len = sources.length; i < len; ++i) {
				let source = sources[i];
				if (source.substr(0, 2) === prevSourceType) {
					if (prevSourceCount < 0) {
						buffer += ": " + source.substr(2);
					} else if (all || prevSourceCount < 3) {
						buffer += ", " + source.substr(2);
					} else if (prevSourceCount === 3) {
						buffer += ", ...";
					}
					++prevSourceCount;
					continue;
				}
				prevSourceType = source.substr(0, 2);
				prevSourceCount = source.substr(2) ? 0 : -1;
				buffer += "<li>gen " + source.charAt(0) + " " + sourceNames[source.charAt(1)];
				if (prevSourceType === '5E' && template.maleOnlyHidden) buffer += " (cannot have hidden ability)";
				if (source.substr(2)) buffer += ": " + source.substr(2);
			}
		}
		if (sourcesBefore) {
			buffer += "<li>" + (sourcesBefore < gen ? "gen " + sourcesBefore + " or earlier" : "anywhere") + " (all moves are level-up/tutor/TM/HM in gen " + Math.min(gen, sourcesBefore) + (sourcesBefore < gen ? " to " + gen : "") + ")";
		}
		buffer += "</ul>";
	}
	return {reply: buffer};
}

function runSearch(query) {
	return PM.send(query);
}

if (!process.send) {
	PM.spawn();
}
