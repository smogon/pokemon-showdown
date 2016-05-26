/**
 * Team Validator
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Handles team validation, and specifically learnset checking.
 *
 * @license MIT license
 */

'use strict';

let TeamValidator = module.exports = getValidator;
let PM;

class Validator {
	constructor(format) {
		this.format = Tools.getFormat(format);
		this.tools = Tools.mod(this.format);
	}

	validateTeam(team) {
		let format = Tools.getFormat(this.format);
		if (format.validateTeam) return format.validateTeam.call(this, team);
		return this.baseValidateTeam(team);
	}

	prepTeam(team) {
		return PM.send(this.format.id, team);
	}

	baseValidateTeam(team) {
		let format = this.format;
		let tools = this.tools;

		let problems = [];
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

		let lengthRange = format.teamLength && format.teamLength.validate;
		if (!lengthRange) {
			lengthRange = [1, 6];
			if (format.gameType === 'doubles') lengthRange[0] = 2;
			if (format.gameType === 'triples' || format.gameType === 'rotation') lengthRange[0] = 3;
		}
		if (team.length < lengthRange[0]) return ["You must bring at least " + lengthRange[0] + " Pok\u00E9mon."];
		if (team.length > lengthRange[1]) return ["You may only bring up to " + lengthRange[1] + " Pok\u00E9mon."];

		let teamHas = {};
		for (let i = 0; i < team.length; i++) {
			if (!team[i]) return ["You sent invalid team data. If you're not using a custom client, please report this as a bug."];
			let setProblems = (format.validateSet || this.validateSet).call(this, team[i], teamHas);
			if (setProblems) {
				problems = problems.concat(setProblems);
			}
		}

		for (let i = 0; i < format.teamBanTable.length; i++) {
			let bannedCombo = true;
			for (let j = 0; j < format.teamBanTable[i].length; j++) {
				if (!teamHas[format.teamBanTable[i][j]]) {
					bannedCombo = false;
					break;
				}
			}
			if (bannedCombo) {
				let clause = format.name ? " by " + format.name : '';
				problems.push("Your team has the combination of " + format.teamBanTable[i].join(' + ') + ", which is banned" + clause + ".");
			}
		}

		if (format.ruleset) {
			for (let i = 0; i < format.ruleset.length; i++) {
				let subformat = tools.getFormat(format.ruleset[i]);
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
	}

	validateSet(set, teamHas, template) {
		let format = this.format;
		let tools = this.tools;

		let problems = [];
		if (!set) {
			return ["This is not a Pokemon."];
		}

		if (!template) {
			template = tools.getTemplate(Tools.getString(set.species));
			if (!template.exists) {
				return ["The Pokemon '" + set.species + "' does not exist."];
			}
		}
		set.species = Tools.getSpecies(set.species);

		set.name = tools.getName(set.name);
		let item = tools.getItem(Tools.getString(set.item));
		set.item = item.name;
		let ability = tools.getAbility(Tools.getString(set.ability));
		set.ability = ability.name;
		if (!Array.isArray(set.moves)) set.moves = [];

		let maxLevel = format.maxLevel || 100;
		let maxForcedLevel = format.maxForcedLevel || maxLevel;
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

		let nameTemplate = tools.getTemplate(set.name);
		if (nameTemplate.exists && nameTemplate.name.toLowerCase() === set.name.toLowerCase()) {
			set.name = null;
		}
		set.name = set.name || set.baseSpecies;
		let name = set.species;
		if (set.species !== set.name && set.baseSpecies !== set.name) name = set.name + " (" + set.species + ")";
		let isHidden = false;
		let lsetData = {set:set, format:format};

		let setHas = {};

		if (!template || !template.abilities) {
			set.species = 'Unown';
			template = tools.getTemplate('Unown');
		}

		if (format.ruleset) {
			for (let i = 0; i < format.ruleset.length; i++) {
				let subformat = tools.getFormat(format.ruleset[i]);
				if (subformat.onChangeSet) {
					problems = problems.concat(subformat.onChangeSet.call(tools, set, format) || []);
				}
			}
		}
		if (format.onChangeSet) {
			problems = problems.concat(format.onChangeSet.call(tools, set, format, setHas, teamHas) || []);
		}
		if (toId(set.species) !== template.speciesid) template = tools.getTemplate(set.species);
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

		let banlistTable = tools.getBanlistTable(format);

		let check = template.id;
		let clause = '';
		setHas[check] = true;
		if (banlistTable[check]) {
			clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
			return [set.species + " is banned" + clause + "."];
		} else if (!tools.data.FormatsData[check] || !tools.data.FormatsData[check].tier) {
			check = toId(template.baseSpecies);
			if (banlistTable[check]) {
				clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
				return [template.baseSpecies + " is banned" + clause + "."];
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
				} else if (!Object.values(template.abilities).includes(ability.name)) {
					problems.push(name + " can't have " + set.ability + ".");
				}
				if (ability.name === template.abilities['H']) {
					isHidden = true;

					if (template.unreleasedHidden && banlistTable['Unreleased']) {
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
			set.moves = set.moves.filter(val => val);
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

			for (let i = 0; i < set.moves.length; i++) {
				if (!set.moves[i]) continue;
				let move = tools.getMove(Tools.getString(set.moves[i]));
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
					let problem = this.checkLearnset(move, template, lsetData);
					if (problem) {
						let problemString = name + " can't learn " + move.name;
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

			if (lsetData.limitedEgg && lsetData.limitedEgg.length > 1 && !lsetData.sourcesBefore && lsetData.sources) {
				// console.log("limitedEgg 1: " + lsetData.limitedEgg);
				// Multiple gen 2-5 egg moves
				// This code hasn't been closely audited for multi-gen interaction, but
				// since egg moves don't get removed between gens, it's unlikely to have
				// any serious problems.
				let limitedEgg = Array.from(new Set(lsetData.limitedEgg));
				if (limitedEgg.length <= 1) {
					// Only one source, can't conflict with anything else
				} else if (limitedEgg.includes('self')) {
					// Self-moves are always incompatible with anything else
					problems.push(name + "'s egg moves are incompatible.");
				} else {
					// Doing a full validation of the possible egg parents takes way too much
					// CPU power (and is in NP), so we're just gonna use a heuristic:
					// They're probably incompatible if all potential fathers learn more than
					// one limitedEgg move from another egg.
					let validFatherExists = false;
					for (let i = 0; i < lsetData.sources.length; i++) {
						if (lsetData.sources[i].charAt(1) === 'S' || lsetData.sources[i].charAt(1) === 'D') continue;
						let eggGen = parseInt(lsetData.sources[i].charAt(0));
						if (lsetData.sources[i].charAt(1) !== 'E' || eggGen === 6) {
							// (There is a way to obtain this pokemon without past-gen breeding.)
							// In theory, limitedEgg should not exist in this case.
							throw new Error("invalid limitedEgg on " + name + ": " + limitedEgg + " with " + lsetData.sources[i]);
						}
						let potentialFather = tools.getTemplate(lsetData.sources[i].slice(lsetData.sources[i].charAt(2) === 'T' ? 3 : 2));
						let restrictedSources = 0;
						for (let j = 0; j < limitedEgg.length; j++) {
							let moveid = limitedEgg[j];
							let fatherSources = potentialFather.learnset[moveid] || potentialFather.learnset['sketch'];
							if (!fatherSources) throw new Error("Egg move father " + potentialFather.id + " can't learn " + moveid);
							let hasUnrestrictedSource = false;
							let hasSource = false;
							for (let k = 0; k < fatherSources.length; k++) {
								// Triply nested loop! Fortunately, all the loops are designed
								// to be as short as possible.
								if (fatherSources[k].charAt(0) > eggGen) continue;
								hasSource = true;
								if (fatherSources[k].charAt(1) !== 'E' && fatherSources[k].charAt(1) !== 'S') {
									hasUnrestrictedSource = true;
									break;
								}
							}
							if (!hasSource) {
								// no match for the current gen; early escape
								restrictedSources = 10;
								break;
							}
							if (!hasUnrestrictedSource) restrictedSources++;
							if (restrictedSources > 1) break;
						}
						if (restrictedSources <= 1) {
							validFatherExists = true;
							// console.log("valid father: " + potentialFather.id);
							break;
						}
					}
					if (!validFatherExists) {
						// Could not find a valid father using our heuristic.
						// TODO: hardcode false positives for our heuristic
						// in theory, this heuristic doesn't have false negatives
						let newSources = [];
						for (let i = 0; i < lsetData.sources.length; i++) {
							if (lsetData.sources[i].charAt(1) === 'S') {
								newSources.push(lsetData.sources[i]);
							}
						}
						lsetData.sources = newSources;
						if (!newSources.length) problems.push(name + "'s past gen egg moves " + limitedEgg.map(id => tools.getMove(id).name).join(', ') + " do not have a valid father. (Is this incorrect? If so, post the chainbreeding instructions in Bug Reports)");
					}
				}
			}

			if (lsetData.sources && lsetData.sources.length === 1 && !lsetData.sourcesBefore) {
				// we're restricted to a single source
				let source = lsetData.sources[0];
				if (source.charAt(1) === 'S') {
					// it's an event
					let eventData = null;
					let splitSource = source.substr(2).split(' ');
					let eventTemplate = tools.getTemplate(splitSource[1]);
					if (eventTemplate.eventPokemon) eventData = eventTemplate.eventPokemon[parseInt(splitSource[0])];
					if (eventData) {
						if (eventData.level && set.level < eventData.level) {
							problems.push(name + " must be at least level " + eventData.level + " because it has a move only available from a specific event.");
						}
						if ((eventData.shiny === true && !set.shiny) || (!eventData.shiny && set.shiny)) {
							problems.push(name + " must " + (eventData.shiny ? "" : "not ") + "be shiny because it has a move only available from a specific event.");
						}
						if (eventData.gender) {
							set.gender = eventData.gender;
						}
						if (eventData.nature && eventData.nature !== set.nature) {
							problems.push(name + " must have a " + eventData.nature + " nature because it has a move only available from a specific event.");
						}
						if (eventData.ivs) {
							if (!set.ivs) set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
							let statTable = {atk:'Attack', def:'Defense', spa:'Special Attack', spd:'Special Defense', spe:'Speed'};
							for (let i in eventData.ivs) {
								if (set.ivs[i] !== eventData.ivs[i]) {
									problems.push(name + " must have " + eventData.ivs[i] + " " + statTable[i] + " IVs because it has a move only available from a specific event.");
								}
							}
						} else if (set.ivs && (eventData.perfectIVs || (eventData.generation >= 6 && (template.eggGroups[0] === 'Undiscovered' || template.species === 'Manaphy') && !template.prevo && !template.nfe &&
							template.species !== 'Unown' && template.baseSpecies !== 'Pikachu' && (template.baseSpecies !== 'Diancie' || !set.shiny)))) {
							// Legendary Pokemon must have at least 3 perfect IVs in gen 6
							// Events can also have a certain amount of guaranteed perfect IVs
							let perfectIVs = 0;
							for (let i in set.ivs) {
								if (set.ivs[i] >= 31) perfectIVs++;
							}
							if (eventData.perfectIVs) {
								if (perfectIVs < eventData.perfectIVs) problems.push(name + " must have at least " + eventData.perfectIVs + " perfect IVs because it has a move only available from a specific event.");
							} else if (perfectIVs < 3) {
								problems.push(name + " must have at least three perfect IVs because it's a legendary and it has a move only available from a gen 6 event.");
							}
						}
						if (tools.gen <= 5 && eventData.abilities && eventData.abilities.length === 1 && !eventData.isHidden) {
							if (template.species === eventTemplate.species) {
								// has not evolved, abilities must match
								if (ability.id !== eventData.abilities[0]) {
									problems.push(name + " must have " + tools.getAbility(eventData.abilities[0]).name + " because it has a move only available from a specific event.");
								}
							} else {
								// has evolved
								let ability1 = tools.getAbility(eventTemplate.abilities['1']);
								if (ability1.gen && eventData.generation >= ability1.gen) {
									// pokemon had 2 available abilities in the gen the event happened
									// ability is restricted to a single ability slot
									let requiredAbilitySlot = (toId(eventData.abilities[0]) === ability1.id ? 1 : 0);
									let requiredAbility = toId(template.abilities[requiredAbilitySlot] || template.abilities['0']);
									if (ability.id !== requiredAbility) {
										problems.push(name + " must have " + tools.getAbility(requiredAbility).name + " because it has a move only available from a specific " + tools.getAbility(eventData.abilities[0]).name + " " + eventTemplate.species + " event.");
									}
								}
							}
						}
					}
					isHidden = false;
				}
			} else if (banlistTable['illegal'] && template.eventOnly) {
				let eventPokemon = !template.learnset && template.baseSpecies !== template.species ? tools.getTemplate(template.baseSpecies).eventPokemon : template.eventPokemon;
				let legal = false;
				events:
				for (let i = 0; i < eventPokemon.length; i++) {
					let eventData = eventPokemon[i];
					if (format.requirePentagon && eventData.generation < 6) continue;
					if (eventData.level && set.level < eventData.level) continue;
					if ((eventData.shiny === true && !set.shiny) || (!eventData.shiny && set.shiny)) continue;
					if (eventData.nature && set.nature !== eventData.nature) continue;
					if (eventData.ivs) {
						if (!set.ivs) set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
						for (let i in eventData.ivs) {
							if (set.ivs[i] !== eventData.ivs[i]) continue events;
						}
					}
					if (eventData.isHidden !== undefined && isHidden !== eventData.isHidden) continue;
					legal = true;
					if (eventData.gender) set.gender = eventData.gender;
				}
				if (!legal) problems.push(template.species + " is only obtainable via event - it needs to match one of its events.");
			}
			if (isHidden && lsetData.sourcesBefore) {
				if (!lsetData.sources && lsetData.sourcesBefore < 5) {
					problems.push(name + " has a hidden ability - it can't have moves only learned before gen 5.");
				} else if (lsetData.sources && template.gender && template.gender !== 'F' && !{'Nidoran-M':1, 'Nidorino':1, 'Nidoking':1, 'Volbeat':1}[template.species]) {
					let compatibleSource = false;
					for (let i = 0, len = lsetData.sources.length; i < len; i++) {
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
			if (!lsetData.sources && lsetData.sourcesBefore < 6 && lsetData.sourcesBefore >= 3 && (isHidden || tools.gen <= 5) && template.gen <= lsetData.sourcesBefore) {
				let oldAbilities = tools.mod('gen' + lsetData.sourcesBefore).getTemplate(set.species).abilities;
				if (ability.name !== oldAbilities['0'] && ability.name !== oldAbilities['1'] && !oldAbilities['H']) {
					problems.push(name + " has moves incompatible with its ability.");
				}
			}
		}
		if (item.megaEvolves === template.species) {
			template = tools.getTemplate(item.megaStone);
		}
		if (template.tier) {
			let tier = template.tier;
			if (tier.charAt(0) === '(') tier = tier.slice(1, -1);
			setHas[toId(tier)] = true;
			if (banlistTable[tier]) {
				problems.push(template.species + " is in " + tier + ", which is banned.");
			}
		}

		if (teamHas) {
			for (let i in setHas) {
				teamHas[i] = true;
			}
		}
		for (let i = 0; i < format.setBanTable.length; i++) {
			let bannedCombo = true;
			for (let j = 0; j < format.setBanTable[i].length; j++) {
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
			for (let i = 0; i < format.ruleset.length; i++) {
				let subformat = tools.getFormat(format.ruleset[i]);
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
	}

	checkLearnset(move, template, lsetData) {
		let tools = this.tools;

		let moveid = toId(move);
		if (moveid === 'constructor') return true;
		move = tools.getMove(moveid);
		template = tools.getTemplate(template);

		lsetData = lsetData || {};
		let set = (lsetData.set || (lsetData.set = {}));
		let format = (lsetData.format || (lsetData.format = {}));
		let alreadyChecked = {};
		let level = set.level || 100;

		let incompatibleAbility = false;
		let isHidden = false;
		if (set.ability && tools.getAbility(set.ability).name === template.abilities['H']) isHidden = true;

		let limit1 = true;
		let sketch = false;
		let blockedHM = false;

		let sometimesPossible = false; // is this move in the learnset at all?

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
		let sources = [];
		// the equivalent of adding "every source at or before this gen" to sources
		let sourcesBefore = 0;
		if (lsetData.sourcesBefore === undefined) lsetData.sourcesBefore = 6;
		let noPastGen = !!format.requirePentagon;
		// Pokemon cannot be traded to past generations except in Gen 1 Tradeback
		let noFutureGen = !(format.banlistTable && format.banlistTable['allowtradeback']);
		// if a move can only be learned from a gen 2-5 egg, we have to check chainbreeding validity
		// limitedEgg is false if there are any legal non-egg sources for the move, and true otherwise
		let limitedEgg = null;

		let tradebackEligible = false;
		do {
			alreadyChecked[template.speciesid] = true;
			if (tools.gen === 2 && template.gen === 1) tradebackEligible = true;
			// STABmons hack to avoid copying all of validateSet to formats
			if (format.banlistTable && format.banlistTable['ignorestabmoves'] && !(moveid in {'bellydrum':1, 'chatter':1, 'darkvoid':1, 'geomancy':1, 'lovelykiss':1, 'shellsmash':1, 'shiftgear':1})) {
				let types = template.types;
				if (template.species === 'Shaymin') types = ['Grass', 'Flying'];
				if (template.baseSpecies === 'Hoopa') types = ['Psychic', 'Ghost', 'Dark'];
				if (types.includes(move.type)) return false;
			}
			if (!template.learnset) {
				if (template.baseSpecies !== template.species) {
					// forme without its own learnset
					template = tools.getTemplate(template.baseSpecies);
					// warning: formes with their own learnset, like Wormadam, should NOT
					// inherit from their base forme unless they're freely switchable
					continue;
				}
				// should never happen
				break;
			}

			if (template.learnset[moveid] || template.learnset['sketch']) {
				sometimesPossible = true;
				let lset = template.learnset[moveid];
				if (!lset || template.speciesid === 'smeargle') {
					if (move.noSketch) return true;
					lset = template.learnset['sketch'];
					sketch = true;
				}
				if (typeof lset === 'string') lset = [lset];

				for (let i = 0, len = lset.length; i < len; i++) {
					let learned = lset[i];
					let learnedGen = learned.charAt(0);
					if (noPastGen && learnedGen !== '6') continue;
					if (noFutureGen && parseInt(learnedGen) > tools.gen) continue;

					// redundant
					if (learnedGen <= sourcesBefore) continue;

					if (learnedGen !== '6' && isHidden && !tools.mod('gen' + learnedGen).getTemplate(template.species).abilities['H']) {
						// check if the Pokemon's hidden ability was available
						incompatibleAbility = true;
						continue;
					}
					if (!template.isNonstandard) {
						// HMs can't be transferred
						if (tools.gen >= 4 && learnedGen <= 3 && moveid in {'cut':1, 'fly':1, 'surf':1, 'strength':1, 'flash':1, 'rocksmash':1, 'waterfall':1, 'dive':1}) continue;
						if (tools.gen >= 5 && learnedGen <= 4 && moveid in {'cut':1, 'fly':1, 'surf':1, 'strength':1, 'rocksmash':1, 'waterfall':1, 'rockclimb':1}) continue;
						// Defog and Whirlpool can't be transferred together
						if (tools.gen >= 5 && moveid in {'defog':1, 'whirlpool':1} && learnedGen <= 4) blockedHM = true;
					}
					if (learned.substr(0, 2) in {'4L':1, '5L':1, '6L':1}) {
						// gen 4-6 level-up moves
						if (level >= parseInt(learned.substr(2))) {
							// we're past the required level to learn it
							return false;
						}
						if (!template.gender || template.gender === 'F') {
							// available as egg move
							learned = learnedGen + 'Eany';
							limitedEgg = false;
						} else {
							// this move is unavailable, skip it
							continue;
						}
					}
					if (learned.charAt(1) in {L:1, M:1, T:1}) {
						if (parseInt(learnedGen) === tools.gen) {
							// current-gen TM or tutor moves:
							//   always available
							return false;
						}
						// past-gen level-up, TM, or tutor moves:
						//   available as long as the source gen was or was before this gen
						limit1 = false;
						sourcesBefore = Math.max(sourcesBefore, parseInt(learnedGen));
						limitedEgg = false;
					} else if (learned.charAt(1) === 'E') {
						// egg moves:
						//   only if that was the source
						if (learnedGen === '6' || lsetData.fastCheck) {
							// gen 6 doesn't have egg move incompatibilities except for certain cases with baby Pokemon
							learned = learnedGen + 'E' + (template.prevo ? template.id : '');
							sources.push(learned);
							limitedEgg = false;
							continue;
						}
						// it's a past gen; egg moves can only be inherited from the father
						// we'll add each possible father separately to the source list
						let eggGroups = template.eggGroups;
						if (!eggGroups) continue;
						if (eggGroups[0] === 'Undiscovered') eggGroups = tools.getTemplate(template.evos[0]).eggGroups;
						let atLeastOne = false;
						let fromSelf = (learned.substr(1) === 'Eany');
						let eggGroupsSet = new Set(eggGroups);
						learned = learned.substr(0, 2);
						// loop through pokemon for possible fathers to inherit the egg move from
						for (let templateid in tools.data.Pokedex) {
							let dexEntry = tools.getTemplate(templateid);
							// can't inherit from CAP pokemon
							if (dexEntry.isNonstandard) continue;
							// can't breed mons from future gens
							if (dexEntry.gen > parseInt(learnedGen)) continue;
							// father must be male
							if (dexEntry.gender === 'N' || dexEntry.gender === 'F') continue;
							// can't inherit from dex entries with no learnsets
							if (!dexEntry.learnset) continue;
							// unless it's supposed to be self-breedable, can't inherit from self, prevos, etc
							// only basic pokemon have egg moves, so by now all evolutions should be in alreadyChecked
							if (!fromSelf && alreadyChecked[dexEntry.speciesid]) continue;
							// father must be able to learn the move
							if (!fromSelf && !dexEntry.learnset[moveid] && !dexEntry.learnset['sketch']) continue;

							// must be able to breed with father
							if (!dexEntry.eggGroups.some(eggGroup => eggGroupsSet.has(eggGroup))) continue;

							// we can breed with it
							atLeastOne = true;
							if (tradebackEligible && learnedGen === '2' && move.gen <= 1) {
								// can tradeback
								sources.push('1ET' + dexEntry.id);
							}
							sources.push(learned + dexEntry.id);
							if (limitedEgg !== false) limitedEgg = true;
						}
						// chainbreeding with itself
						// e.g. ExtremeSpeed Dragonite
						if (!atLeastOne) {
							sources.push(learned + template.id);
							limitedEgg = 'self';
						}
					} else if (learned.charAt(1) === 'S') {
						// event moves:
						//   only if that was the source
						// Event Pokémon:
						//	Available as long as the past gen can get the Pokémon and then trade it back.
						if (tradebackEligible && learnedGen === '2' && move.gen <= 1) {
							// can tradeback
							sources.push('1ST' + learned.slice(2) + ' ' + template.id);
						}
						if (set.ability) {
							// The event ability must match the Pokémon's
							let hiddenAbility = template.eventPokemon[learned.substr(2)].isHidden || false;
							if (hiddenAbility !== isHidden) {
								incompatibleAbility = true;
								continue;
							}
						}
						sources.push(learned + ' ' + template.id);
					} else if (learned.charAt(1) === 'D') {
						// DW moves:
						//   only if that was the source
						// DW Pokemon are at level 10 or at the evolution level
						let minLevel = (template.evoLevel && template.evoLevel > 10) ? template.evoLevel : 10;
						if (set.level < minLevel) continue;
						sources.push(learned);
					}
				}
			}
			if (format.mimicGlitch && template.gen < 5) {
				// include the Mimic Glitch when checking this mon's learnset
				let glitchMoves = {metronome:1, copycat:1, transform:1, mimic:1, assist:1};
				let getGlitch = false;
				for (let i in glitchMoves) {
					if (template.learnset[i]) {
						if (!(i === 'mimic' && tools.getAbility(set.ability).gen === 4 && !template.prevo)) {
							getGlitch = true;
							break;
						}
					}
				}
				if (getGlitch) {
					sourcesBefore = Math.max(sourcesBefore, 4);
					if (move.gen < 5) {
						limit1 = false;
					}
				}
			}

			// also check to see if the mon's prevo or freely switchable formes can learn this move
			if (template.prevo) {
				template = tools.getTemplate(template.prevo);
				if (template.gen > Math.max(2, tools.gen)) template = null;
				if (template && !template.abilities['H']) isHidden = false;
			} else if (template.baseSpecies !== template.species && template.baseSpecies !== 'Kyurem' && template.baseSpecies !== 'Pikachu' && template.baseSpecies !== 'Vivillon') {
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
			lsetData.sketchMove = moveid;
		}

		if (blockedHM) {
			// Limit one of Defog/Whirlpool to be transferred
			if (lsetData.hm) return {type:'incompatible'};
			lsetData.hm = moveid;
		}

		// Now that we have our list of possible sources, intersect it with the current list
		if (!sourcesBefore && !sources.length) {
			if (noPastGen && sometimesPossible) return {type:'pokebank'};
			if (incompatibleAbility) return {type:'incompatible'};
			return true;
		}
		if (!sources.length) sources = null;
		if (sourcesBefore || lsetData.sourcesBefore) {
			// having sourcesBefore is the equivalent of having everything before that gen
			// in sources, so we fill the other array in preparation for intersection
			if (sourcesBefore && lsetData.sources) {
				if (!sources) sources = [];
				for (let i = 0, len = lsetData.sources.length; i < len; i++) {
					let learned = lsetData.sources[i];
					if (parseInt(learned.charAt(0)) <= sourcesBefore) {
						sources.push(learned);
					}
				}
				if (!lsetData.sourcesBefore) sourcesBefore = 0;
			}
			if (lsetData.sourcesBefore && sources) {
				if (!lsetData.sources) lsetData.sources = [];
				for (let i = 0, len = sources.length; i < len; i++) {
					let learned = sources[i];
					let sourceGen = parseInt(learned.charAt(0));
					if (sourceGen <= lsetData.sourcesBefore && sourceGen > sourcesBefore) {
						lsetData.sources.push(learned);
					}
				}
				if (!sourcesBefore) lsetData.sourcesBefore = 0;
			}
		}
		if (sources) {
			if (lsetData.sources) {
				let sourcesSet = new Set(sources);
				let intersectSources = lsetData.sources.filter(source => sourcesSet.has(source));
				if (!intersectSources.length && !(sourcesBefore && lsetData.sourcesBefore)) {
					return {type:'incompatible'};
				}
				lsetData.sources = intersectSources;
			} else {
				lsetData.sources = Array.from(new Set(sources));
			}
		}

		if (sourcesBefore) {
			lsetData.sourcesBefore = Math.min(sourcesBefore, lsetData.sourcesBefore);
		}

		if (limitedEgg) {
			// lsetData.limitedEgg = [moveid] of egg moves with potential breeding incompatibilities
			// 'self' is a possible entry (namely, ExtremeSpeed on Dragonite) meaning it's always
			// incompatible with any other egg move
			if (!lsetData.limitedEgg) lsetData.limitedEgg = [];
			lsetData.limitedEgg.push(limitedEgg === true ? moveid : limitedEgg);
		}

		return false;
	}
}
TeamValidator.Validator = Validator;

function getValidator(format) {
	return new Validator(format);
}

/*********************************************************
 * Process manager
 *********************************************************/

const ProcessManager = require('./process-manager');

PM = TeamValidator.PM = new ProcessManager({
	maxProcesses: global.Config && Config.validatorprocesses,
	execFile: 'team-validator.js',
	onMessageUpstream: function (message) {
		// Protocol:
		// success: "[id]|1[details]"
		// failure: "[id]|0[details]"
		let pipeIndex = message.indexOf('|');
		let id = +message.substr(0, pipeIndex);

		if (this.pendingTasks.has(id)) {
			this.pendingTasks.get(id)(message.slice(pipeIndex + 1));
			this.pendingTasks.delete(id);
			this.release();
		}
	},
	onMessageDownstream: function (message) {
		// protocol:
		// "[id]|[format]|[team]"
		let pipeIndex = message.indexOf('|');
		let pipeIndex2 = message.indexOf('|', pipeIndex + 1);
		let id = message.substr(0, pipeIndex);

		let format = message.substr(pipeIndex + 1, pipeIndex2 - pipeIndex - 1);
		let team = message.substr(pipeIndex2 + 1);

		process.send(id + '|' + this.receive(format, team));
	},
	receive: function (format, team) {
		let parsedTeam = Tools.fastUnpackTeam(team);

		let problems;
		try {
			problems = TeamValidator(format).validateTeam(parsedTeam);
		} catch (err) {
			require('./crashlogger.js')(err, 'A team validation', {
				format: format,
				team: team,
			});
			problems = ["Your team crashed the team validator. We've been automatically notified and will fix this crash, but you should use a different team for now."];
		}

		if (problems && problems.length) {
			return '0' + problems.join('\n');
		} else {
			let packedTeam = Tools.packTeam(parsedTeam);
			// console.log('FROM: ' + message.substr(pipeIndex2 + 1));
			// console.log('TO: ' + packedTeam);
			return '1' + packedTeam;
		}
	},
});

if (process.send && module === process.mainModule) {
	// This is a child process!

	global.Config = require('./config/config.js');

	if (Config.crashguard) {
		process.on('uncaughtException', err => {
			require('./crashlogger.js')(err, 'A team validator process', true);
		});
	}

	global.Tools = require('./tools.js').includeMods();
	global.toId = Tools.getId;

	require('./repl.js').start('team-validator-', process.pid, cmd => eval(cmd));

	process.on('message', message => PM.onMessageDownstream(message));
	process.on('disconnect', () => process.exit());
}
