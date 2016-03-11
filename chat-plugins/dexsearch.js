/**
 * Dexsearch commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Commands for advanced searching for pokemon, moves, and items.
 *
 * @license MIT license
 */

'use strict';

const RESULTS_MAX_LENGTH = 10;

exports.commands = {
	ds: 'dexsearch',
	dsearch: 'dexsearch',
	dexsearch: function (target, room, user, connection, cmd, message) {
		if (!this.canBroadcast()) return;

		if (!target) return this.parse('/help dexsearch');
		let searches = [];
		let allTiers = {'uber':1, 'ou':1, 'bl':1, 'uu':1, 'bl2':1, 'ru':1, 'bl3':1, 'nu':1, 'bl4':1, 'pu':1, 'nfe':1, 'lc uber':1, 'lc':1, 'cap':1};
		let allColours = {'green':1, 'red':1, 'blue':1, 'white':1, 'brown':1, 'yellow':1, 'purple':1, 'pink':1, 'gray':1, 'black':1};
		let allStats = {'hp':1, 'atk':1, 'def':1, 'spa':1, 'spd':1, 'spe':1, 'bst':1};
		let showAll = false;
		let megaSearch = null;
		let capSearch = null;
		let randomOutput = 0;

		let validParameter = (cat, param, isNotSearch) => {
			for (let h = 0; h < searches.length; h++) {
				let group = searches[h];
				if (group[cat] === undefined) continue;
				if (group[cat][param] === undefined) continue;
				if (group[cat][param] === isNotSearch) {
					this.sendReplyBox("A search cannot both include and exclude '" + param + "'.");
				} else {
					this.sendReplyBox("The search included '" + (isNotSearch ? "!" : "") + param + "' more than once.");
				}
				return false;
			}
			return true;
		};

		let andGroups = target.split(',');
		for (let i = 0; i < andGroups.length; i++) {
			let orGroup = {abilities: {}, tiers: {}, colors: {}, gens: {}, moves: {}, types: {}, stats: {}, skip: false};
			let parameters = andGroups[i].split("|");
			if (parameters.length > 3) return this.sendReply("No more than 3 alternatives for each parameter may be used.");
			for (let j = 0; j < parameters.length; j++) {
				let isNotSearch = false;
				target = parameters[j].trim().toLowerCase();
				if (target.charAt(0) === '!') {
					isNotSearch = true;
					target = target.substr(1);
				}

				let targetAbility = Tools.getAbility(target);
				if (targetAbility.exists) {
					if (!validParameter("abilities", targetAbility, isNotSearch)) return;
					orGroup.abilities[targetAbility] = !isNotSearch;
					continue;
				}

				if (target in allTiers) {
					if (target === "cap") {
						if (parameters.length > 1) return this.sendReplyBox("The parameter 'cap' cannot have alternative parameters");
						capSearch = !isNotSearch;
					}
					if (!validParameter("tiers", target, isNotSearch)) return;
					orGroup.tiers[target] = !isNotSearch;
					continue;
				}

				if (target in allColours) {
					target = target.charAt(0).toUpperCase() + target.slice(1);
					if (!validParameter("colors", target, isNotSearch)) return;
					orGroup.colors[target] = !isNotSearch;
					continue;
				}

				if (target.substr(0, 3) === 'gen' && Number.isInteger(parseFloat(target.substr(3)))) target = target.substr(3).trim();
				let targetInt = parseInt(target);
				if (0 < targetInt && targetInt < 7) {
					if (!validParameter("gens", target, isNotSearch)) return;
					orGroup.gens[target] = !isNotSearch;
					continue;
				}

				if (target === 'all') {
					if (this.broadcasting && !room.isPersonal) return this.sendReplyBox("A search with the parameter 'all' cannot be broadcast.");
					if (parameters.length > 1) return this.sendReplyBox("The parameter 'all' cannot have alternative parameters");
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
					if (parameters.length > 1) return this.sendReplyBox("The parameter 'mega' cannot have alternative parameters");
					megaSearch = !isNotSearch;
					orGroup.skip = true;
					break;
				}

				if (target === 'recovery') {
					if (parameters.length > 1) return this.sendReplyBox("The parameter 'recovery' cannot have alternative parameters");
					let recoveryMoves = ["recover", "roost", "moonlight", "morningsun", "synthesis", "milkdrink", "slackoff", "softboiled", "wish", "healorder"];
					for (let k = 0; k < recoveryMoves.length; k++) {
						if (!validParameter("moves", recoveryMoves[k], isNotSearch)) return;
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
					if (parameters.length > 1) return this.sendReplyBox("The parameter 'priority' cannot have alternative parameters");
					for (let move in Tools.data.Movedex) {
						let moveData = Tools.getMove(move);
						if (moveData.category === "Status" || moveData.id === "bide") continue;
						if (moveData.priority > 0) {
							if (!validParameter("moves", move, isNotSearch)) return;
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

				let targetMove = Tools.getMove(target);
				if (targetMove.exists) {
					if (!validParameter("moves", targetMove.id, isNotSearch)) return;
					orGroup.moves[targetMove.id] = !isNotSearch;
					continue;
				}

				let typeIndex = target.indexOf(' type');
				if (typeIndex >= 0) {
					target = target.charAt(0).toUpperCase() + target.substring(1, typeIndex);
					if (target in Tools.data.TypeChart) {
						if (!validParameter("types", target, isNotSearch)) return;
						orGroup.types[target] = !isNotSearch;
						continue;
					}
				}

				let inequality = target.search(/>|<|=/);
				if (inequality >= 0) {
					if (isNotSearch) return this.sendReplyBox("You cannot use the negation symbol '!' in stat ranges.");
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
						return this.sendReplyBox("No value given to compare with '" + Tools.escapeHTML(target) + "'.");
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
					if (!(stat in allStats)) return this.sendReplyBox("'" + Tools.escapeHTML(target) + "' did not contain a valid stat.");
					if (!orGroup.stats[stat]) orGroup.stats[stat] = {};
					if (orGroup.stats[stat][direction]) return this.sendReplyBox("Invalid stat range for " + stat + ".");
					orGroup.stats[stat][direction] = num;
					continue;
				}
				return this.sendReplyBox("'" + Tools.escapeHTML(target) + "' could not be found in any of the search categories.");
			}
			searches.push(orGroup);
		}

		if (showAll && searches.length === 0 && megaSearch === null) return this.sendReplyBox("No search parameters other than 'all' were found. Try '/help dexsearch' for more information on this command.");

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
					if (Object.values(alts.gens).indexOf(false) >= 0 && alts.gens[dex[mon].gen] !== false) continue;
				}

				if (alts.colors && Object.keys(alts.colors).length) {
					if (alts.colors[dex[mon].color]) continue;
					if (Object.values(alts.colors).indexOf(false) >= 0 && alts.colors[dex[mon].color] !== false) continue;
				}

				if (alts.tiers && Object.keys(alts.tiers).length) {
					if (alts.tiers[dex[mon].tier.toLowerCase()]) continue;
					if (Object.values(alts.tiers).indexOf(false) >= 0 && alts.tiers[dex[mon].tier.toLowerCase()] !== false) continue;
				}

				for (let type in alts.types) {
					if (dex[mon].types.indexOf(type) >= 0 === alts.types[type]) {
						matched = true;
						break;
					}
				}
				if (matched) continue;

				for (let ability in alts.abilities) {
					if (Object.values(dex[mon].abilities).indexOf(ability) >= 0 === alts.abilities[ability]) {
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
					let canLearn = (dex[mon].learnset.sketch && ['chatter', 'struggle', 'magikarpsrevenge'].indexOf(move) < 0) || dex[mon].learnset[move];
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
			if (dex[mon].baseSpecies && results.indexOf(dex[mon].baseSpecies) >= 0) continue;
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
						let problem = TeamValidator.checkLearnsetSync('anythinggoes', moveGroups[group][i], mon, lsetData);
						if (!problem) break;
						if (i === moveGroups[group].length - 1) return;
					}
				}
				return true;
			});
		}

		if (randomOutput && randomOutput < results.length) {
			results = Tools.shuffle(results).slice(0, randomOutput);
		}

		let resultsStr = this.broadcasting ? "" : ("<font color=#999999>" + Tools.escapeHTML(message) + ":</font><br>");
		if (results.length > 1) {
			if (showAll || results.length <= RESULTS_MAX_LENGTH + 5) {
				results.sort();
				resultsStr += results.join(", ");
			} else {
				resultsStr += results.slice(0, RESULTS_MAX_LENGTH).join(", ") + ", and " + (results.length - RESULTS_MAX_LENGTH) + " more. <font color=#999999>Redo the search with 'all' as a search parameter to show all results.</font>";
			}
		} else if (results.length === 1) {
			return CommandParser.commands.data.call(this, results[0], room, user, connection, 'dt');
		} else {
			resultsStr += "No Pok&eacute;mon found.";
		}
		return this.sendReplyBox(resultsStr);
	},
	dexsearchhelp: ["/dexsearch [parameter], [parameter], [parameter], ... - Searches for Pok\u00e9mon that fulfill the selected criteria",
		"Search categories are: type, tier, color, moves, ability, gen, recovery, priority, stat.",
		"Valid colors are: green, red, blue, white, brown, yellow, purple, pink, gray and black.",
		"Valid tiers are: Uber/OU/BL/UU/BL2/RU/BL3/NU/BL4/PU/NFE/LC/CAP.",
		"Types must be followed by ' type', e.g., 'dragon type'.",
		"Inequality ranges use the characters '>=' for '≥' and '<=' for '≤', e.g., 'hp <= 95' searches all Pok\u00e9mon with HP less than or equal to 95.",
		"Parameters can be excluded through the use of '!', e.g., '!water type' excludes all water types.",
		"The parameter 'mega' can be added to search for Mega Evolutions only, and the parameter 'NFE' can be added to search not-fully evolved Pok\u00e9mon only.",
		"Parameters separated with '|' will be searched as alternatives for each other, e.g., 'trick | switcheroo' searches for all Pok\u00e9mon that learn either Trick or Switcheroo.",
		"The order of the parameters does not matter."],

	rollpokemon: 'randompokemon',
	randpoke: 'randompokemon',
	randompokemon: function (target, room, user, connection, cmd, message) {
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

		CommandParser.commands.dexsearch.call(this, targetsBuffer.join(","), room, user, connection, "randpoke", message);
	},
	randompokemonhelp: ["/randompokemon - Generates random Pok\u00e9mon based on given search conditions.",
		"/randompokemon uses the same parameters as /dexsearch (see '/help ds').",
		"Adding a number as a parameter returns that many random Pok\u00e9mon, e.g., '/randpoke 6' returns 6 random Pok\u00e9mon."],

	ms: 'movesearch',
	msearch: 'movesearch',
	movesearch: function (target, room, user, connection, cmd, message) {
		if (!this.canBroadcast()) return;

		if (!target) return this.parse('/help movesearch');
		let targets = target.split(',');
		let searches = {};
		let allCategories = {'physical':1, 'special':1, 'status':1};
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
				if (!(target in Tools.data.TypeChart)) return this.sendReplyBox("Type '" + Tools.escapeHTML(target) + "' not found.");
				if (!searches['type']) searches['type'] = {};
				if ((searches['type'][target] && isNotSearch) || (searches['type'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a type.');
				searches['type'][target] = !isNotSearch;
				continue;
			}

			if (target in allCategories) {
				target = target.charAt(0).toUpperCase() + target.substr(1);
				if (!searches['category']) searches['category'] = {};
				if ((searches['category'][target] && isNotSearch) || (searches['category'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a category.');
				searches['category'][target] = !isNotSearch;
				continue;
			}

			if (target === 'bypassessubstitute') target = 'authentic';
			if (target in allFlags) {
				if (!searches['flags']) searches['flags'] = {};
				if ((searches['flags'][target] && isNotSearch) || (searches['flags'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include \'' + target + '\'.');
				searches['flags'][target] = !isNotSearch;
				continue;
			}

			if (target === 'all') {
				if (this.broadcasting && !room.isPersonal) return this.sendReplyBox("A search with the parameter 'all' cannot be broadcast.");
				showAll = true;
				continue;
			}

			if (target === 'recovery') {
				if (!searches['recovery']) {
					searches['recovery'] = !isNotSearch;
				} else if ((searches['recovery'] && isNotSearch) || (searches['recovery'] === false && !isNotSearch)) {
					return this.sendReplyBox('A search cannot both exclude and include recovery moves.');
				}
				continue;
			}

			let template = Tools.getTemplate(target);
			if (template.exists) {
				if (Object.keys(lsetData).length) return this.sendReplyBox("A search can only include one Pok\u00e9mon learnset.");
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
				if (isNotSearch) return this.sendReplyBox("You cannot use the negation symbol '!' in quality ranges.");
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
					return this.sendReplyBox("No value given to compare with '" + Tools.escapeHTML(target) + "'.");
				}
				let prop = targetParts[propSide];
				switch (toId(targetParts[propSide])) {
				case 'basepower': prop = 'basePower'; break;
				case 'bp': prop = 'basePower'; break;
				case 'acc': prop = 'accuracy'; break;
				}
				if (!(prop in allProperties)) return this.sendReplyBox("'" + Tools.escapeHTML(target) + "' did not contain a valid property.");
				if (!searches['property']) searches['property'] = {};
				if (direction === 'equal') {
					if (searches['property'][prop]) return this.sendReplyBox("Invalid property range for " + prop + ".");
					searches['property'][prop] = {};
					searches['property'][prop]['less'] = parseFloat(targetParts[numSide]);
					searches['property'][prop]['greater'] = parseFloat(targetParts[numSide]);
				} else {
					if (!searches['property'][prop]) searches['property'][prop] = {};
					if (searches['property'][prop][direction]) {
						return this.sendReplyBox("Invalid property range for " + prop + ".");
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
					return this.sendReplyBox("Priority type '" + target + "' not recognized.");
				}
				if (!searches['property']) searches['property'] = {};
				if (searches['property']['priority']) {
					return this.sendReplyBox("Priority cannot be set with both shorthand and inequality range.");
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
				if (!(target in allBoosts)) return this.sendReplyBox("'" + Tools.escapeHTML(target.substr(7)) + "' is not a recognized stat.");
				if (!searches['boost']) searches['boost'] = {};
				if ((searches['boost'][target] && isNotSearch) || (searches['boost'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a stat boost.');
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
				if ((searches['status'][target] && isNotSearch) || (searches['status'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a status.');
				searches['status'][target] = !isNotSearch;
				continue;
			}

			if (target in allVolatileStatus) {
				if (!searches['volatileStatus']) searches['volatileStatus'] = {};
				if ((searches['volatileStatus'][target] && isNotSearch) || (searches['volatileStatus'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a volitile status.');
				searches['volatileStatus'][target] = !isNotSearch;
				continue;
			}

			return this.sendReplyBox("'" + Tools.escapeHTML(oldTarget) + "' could not be found in any of the search categories.");
		}

		if (showAll && !Object.keys(searches).length && !targetMon) {
			return this.sendReplyBox("No search parameters other than 'all' were found. Try '/help movesearch' for more information on this command.");
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
				for (let move in dex) {
					if (searches[search][String(dex[move][search])] === false ||
						Object.values(searches[search]).indexOf(true) >= 0 && !searches[search][String(dex[move][search])]) {
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
			resultsStr += this.broadcasting ? "" : ("<font color=#999999>" + Tools.escapeHTML(message) + ":</font><br>");
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
		return this.sendReplyBox(resultsStr);
	},
	movesearchhelp: ["/movesearch [parameter], [parameter], [parameter], ... - Searches for moves that fulfill the selected criteria.",
		"Search categories are: type, category, flag, status inflicted, type boosted, and numeric range for base power, pp, and accuracy.",
		"Types must be followed by ' type', e.g., 'dragon type'.",
		"Stat boosts must be preceded with 'boosts ', e.g., 'boosts attack' searches for moves that boost the attack stat.",
		"Inequality ranges use the characters '>' and '<' though they behave as '≥' and '≤', e.g., 'bp > 100' searches for all moves equal to and greater than 100 base power.",
		"Parameters can be excluded through the use of '!', e.g., !water type' excludes all water type moves.",
		"Valid flags are: authentic (bypasses substitute), bite, bullet, contact, defrost, powder, pulse, punch, secondary, snatch, sound",
		"If a Pok\u00e9mon is included as a parameter, moves will be searched from it's movepool.",
		"The order of the parameters does not matter."],

	isearch: 'itemsearch',
	itemsearch: function (target, room, user, connection, cmd, message) {
		if (!target) return this.parse('/help itemsearch');
		if (!this.canBroadcast()) return;

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
			if (!newWord || searchedWords.indexOf(newWord) >= 0) continue;
			searchedWords.push(newWord);
		}

		if (searchedWords.length === 0) return this.sendReplyBox("No distinguishing words were used. Try a more specific search.");
		if (searchedWords.indexOf('fling') >= 0) {
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
					if (!(wordEff === 'psn' && effect === 'tox')) return this.sendReplyBox("Only specify fling effect once.");
				} else if (wordEff) {
					effect = wordEff;
				} else {
					if (searchedWords[k].substr(searchedWords[k].length - 2) === 'bp' && searchedWords[k].length > 2) searchedWords[k] = searchedWords[k].substr(0, searchedWords[k].length - 2);
					if (Number.isInteger(Number(searchedWords[k]))) {
						if (basePower) return this.sendReplyBox("Only specify a number for base power once.");
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
			if (foundItems.length === 0) return this.sendReplyBox('No items inflict ' + basePower + 'bp damage when used with Fling.');
		} else if (target.search(/natural ?gift/i) >= 0) {
			let basePower = 0;
			let type = "";

			for (let k = 0; k < searchedWords.length; k++) {
				searchedWords[k] = searchedWords[k].charAt(0).toUpperCase() + searchedWords[k].slice(1);
				if (searchedWords[k] in Tools.data.TypeChart) {
					if (type) return this.sendReplyBox("Only specify natural gift type once.");
					type = searchedWords[k];
				} else {
					if (searchedWords[k].substr(searchedWords[k].length - 2) === 'bp' && searchedWords[k].length > 2) searchedWords[k] = searchedWords[k].substr(0, searchedWords[k].length - 2);
					if (Number.isInteger(Number(searchedWords[k]))) {
						if (basePower) return this.sendReplyBox("Only specify a number for base power once.");
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
			if (foundItems.length === 0) return this.sendReplyBox('No berries inflict ' + basePower + 'bp damage when used with Natural Gift.');
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
					if (descWords.indexOf(searchedWords[k]) >= 0) matched++;
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
					if (descWords.indexOf(searchedWords[k]) >= 0) matched++;
				}

				if (matched !== bestMatched) {
					foundItems.splice(l, 1);
					l--;
				}
			}
		}

		let resultsStr = this.broadcasting ? "" : ("<font color=#999999>" + Tools.escapeHTML(message) + ":</font><br>");
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
		return this.sendReplyBox(resultsStr);
	},
	itemsearchhelp: ["/itemsearch [move description] - finds items that match the given key words.",
	"Command accepts natural language. (tip: fewer words tend to work better)",
	"Searches with \"fling\" in them will find items with the specified Fling behavior.",
	"Searches with \"natural gift\" in them will find items with the specified Natural Gift behavior."],
};
