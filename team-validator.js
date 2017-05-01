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

function banReason(strings, reason) {
	return reason && typeof reason === 'string' ? `banned by ${reason}` : `banned`;
}

class Validator {
	constructor(format, supplementaryBanlist) {
		format = Tools.getFormat(format);
		if (supplementaryBanlist && supplementaryBanlist.length) {
			format = Object.assign({}, format);
			if (format.banlistTable) delete format.banlistTable;
			format.banlist = format.banlist ? format.banlist.slice() : [];
			format.unbanlist = format.unbanlist ? format.unbanlist.slice() : [];
			format.ruleset = format.ruleset ? format.ruleset.slice() : [];
			for (let i = 0; i < supplementaryBanlist.length; i++) {
				let ban = supplementaryBanlist[i];
				let unban = false;
				if (ban.charAt(0) === '!') {
					unban = true;
					ban = ban.substr(1);
				}
				if (ban.startsWith('Rule:')) {
					ban = ban.substr(5);
					if (unban) {
						ban = 'Rule:' + toId(ban);
						if (!format.unbanlist.includes(ban)) format.unbanlist.push(ban);
					} else {
						if (!format.ruleset.includes(ban)) format.ruleset.push(ban);
					}
				} else {
					if (unban) {
						if (!format.unbanlist.includes(ban)) format.unbanlist.push(ban);
					} else {
						if (!format.banlist.includes(ban)) format.banlist.push(ban);
					}
				}
			}
			supplementaryBanlist = supplementaryBanlist.join(',');
		} else {
			supplementaryBanlist = '0';
		}
		this.format = format;
		this.supplementaryBanlist = supplementaryBanlist;
		this.tools = Tools.format(this.format);
	}

	validateTeam(team, removeNicknames) {
		if (this.format.validateTeam) return this.format.validateTeam.call(this, team, removeNicknames);
		return this.baseValidateTeam(team, removeNicknames);
	}

	prepTeam(team, removeNicknames) {
		removeNicknames = removeNicknames ? '1' : '0';
		return PM.send(this.format.id, this.supplementaryBanlist, removeNicknames, team);
	}

	baseValidateTeam(team, removeNicknames) {
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
			return [`You sent invalid team data. If you're not using a custom client, please report this as a bug.`];
		}

		let lengthRange = format.teamLength && format.teamLength.validate;
		if (!lengthRange) {
			lengthRange = [1, 6];
			if (format.gameType === 'doubles') lengthRange[0] = 2;
			if (format.gameType === 'triples' || format.gameType === 'rotation') lengthRange[0] = 3;
		}
		if (team.length < lengthRange[0]) problems.push([`You must bring at least ${lengthRange[0]} Pok\u00E9mon.`]);
		if (team.length > lengthRange[1]) return [`You may only bring up to ${lengthRange[1]} Pok\u00E9mon.`];

		let teamHas = {};
		for (let i = 0; i < team.length; i++) {
			if (!team[i]) return [`You sent invalid team data. If you're not using a custom client, please report this as a bug.`];
			let setProblems = (format.validateSet || this.validateSet).call(this, team[i], teamHas);
			if (setProblems) {
				problems = problems.concat(setProblems);
			}
			if (removeNicknames) team[i].name = team[i].baseSpecies;
		}

		for (let i = 0; i < format.teamBanTable.length; i++) {
			let bannedCombo = true;
			for (let j = 1; j < format.teamBanTable[i].length; j++) {
				if (!teamHas[format.teamBanTable[i][j]]) {
					bannedCombo = false;
					break;
				}
			}
			if (bannedCombo) {
				const reason = banReason`${format.name}`;
				problems.push(`Your team has the combination of ${format.teamBanTable[i][0]}, which is ${reason}.`);
			}
		}

		for (let i = 0; i < format.teamLimitTable.length; i++) {
			let entry = format.teamLimitTable[i];
			let count = 0;
			for (let j = 3; j < entry.length; j++) {
				if (teamHas[entry[j]] > 0) count += teamHas[entry[j]];
			}
			let limit = entry[2];
			if (count > limit) {
				let clause = entry[1] ? ` by ${entry[1]}` : ``;
				problems.push(`You are limited to ${limit} of ${entry[0]}${clause}.`);
			}
		}

		if (format.ruleset) {
			for (let i = 0; i < format.ruleset.length; i++) {
				let subformat = tools.getFormat(format.ruleset[i]);
				if (subformat.onValidateTeam && format.banlistTable['Rule:' + subformat.id]) {
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
			return [`This is not a Pokemon.`];
		}

		set.species = Tools.getSpecies(set.species);
		set.name = tools.getName(set.name);
		let item = tools.getItem(Tools.getString(set.item));
		set.item = item.name;
		let ability = tools.getAbility(Tools.getString(set.ability));
		set.ability = ability.name;
		set.nature = tools.getNature(Tools.getString(set.nature)).name;
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
		if (toId(format.name) !== 'gen7crossevolution' && nameTemplate.exists && nameTemplate.name.toLowerCase() === set.name.toLowerCase()) {
			set.name = null;
		}
		set.name = set.name || set.baseSpecies;
		let name = set.species;
		if (set.species !== set.name && set.baseSpecies !== set.name) name = `${set.name} (${set.species})`;
		let isHidden = false;
		let lsetData = {set:set, format:format};

		let setHas = {};
		let banlistTable = tools.getBanlistTable(format);

		if (format.ruleset) {
			for (let i = 0; i < format.ruleset.length; i++) {
				let subformat = tools.getFormat(format.ruleset[i]);
				if (subformat.onChangeSet && banlistTable['Rule:' + subformat.id]) {
					problems = problems.concat(subformat.onChangeSet.call(tools, set, format) || []);
				}
			}
		}
		if (format.onChangeSet) {
			problems = problems.concat(format.onChangeSet.call(tools, set, format, setHas, teamHas) || []);
		}

		if (!template) {
			template = tools.getTemplate(set.species);
			if (ability.id === 'battlebond' && template.id === 'greninja' && !banlistTable['Rule:ignoreillegalabilities']) {
				template = tools.getTemplate('greninjaash');
				set.gender = 'M';
			}
		}
		if (!template.exists) {
			return [`The Pokemon "${set.species}" does not exist.`];
		}

		item = tools.getItem(set.item);
		if (item.id && !item.exists) {
			return [`"${set.item}" is an invalid item.`];
		}
		ability = tools.getAbility(set.ability);
		if (ability.id && !ability.exists) {
			if (tools.gen < 3) {
				// gen 1-2 don't have abilities, just silently remove
				ability = tools.getAbility('');
				set.ability = '';
			} else {
				return [`"${set.ability}" is an invalid ability.`];
			}
		}
		if (set.nature && !tools.getNature(set.nature).exists) {
			if (tools.gen < 3) {
				// gen 1-2 don't have natures, just remove them
				set.nature = '';
			} else {
				return [`${set.species}'s nature is invalid.`];
			}
		}
		if (set.happiness !== undefined && isNaN(set.happiness)) {
			problems.push(`${set.species} has an invalid happiness.`);
		}

		let check = template.id;
		setHas[check] = true;
		if (banlistTable[check] || banlistTable[check + 'base']) {
			const reason = banReason`${banlistTable[check]}`;
			return [`${set.species} is ${reason}.`];
		} else {
			check = toId(template.baseSpecies);
			if (banlistTable[check]) {
				const reason = banReason`${banlistTable[check]}`;
				return [`${template.baseSpecies} is ${reason}.`];
			}
		}

		check = toId(set.ability);
		setHas[check] = true;
		if (banlistTable[check]) {
			const reason = banReason`${banlistTable[check]}`;
			problems.push(`${name}'s ability ${set.ability} is ${reason}.`);
		}
		check = toId(set.item);
		setHas[check] = true;
		if (banlistTable[check]) {
			const reason = banReason`${banlistTable[check]}`;
			problems.push(`${name}'s item ${set.item} is ${reason}.`);
		}
		if (banlistTable['Unreleased'] && item.isUnreleased) {
			problems.push(`${name}'s item ${set.item} is unreleased.`);
		}
		if (banlistTable['Unreleased'] && template.isUnreleased) {
			if (template.eggGroups[0] === 'Undiscovered' && !template.evos) {
				problems.push(`${name} (${template.species}) is unreleased.`);
			}
		}
		setHas[toId(set.ability)] = true;
		if (banlistTable['illegal']) {
			// Don't check abilities for metagames with All Abilities
			if (tools.gen <= 2) {
				set.ability = 'None';
			} else if (!banlistTable['Rule:ignoreillegalabilities']) {
				if (!ability.name) {
					problems.push(`${name} needs to have an ability.`);
				} else if (!Object.values(template.abilities).includes(ability.name)) {
					problems.push(`${name} can't have ${set.ability}.`);
				}
				if (ability.name === template.abilities['H']) {
					isHidden = true;

					if (template.unreleasedHidden && banlistTable['Unreleased']) {
						problems.push(`${name}'s hidden ability is unreleased.`);
					} else if (set.species.endsWith('Orange') || set.species.endsWith('White') && ability.name === 'Symbiosis') {
						problems.push(`${name}'s hidden ability is unreleased for the Orange and White forms.`);
					} else if (tools.gen === 5 && set.level < 10 && (template.maleOnlyHidden || template.gender === 'N')) {
						problems.push(`${name} must be at least level 10 with its hidden ability.`);
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
			problems.push(`${name} has no moves.`);
		} else {
			// A limit is imposed here to prevent too much engine strain or
			// too much layout deformation - to be exact, this is the Debug
			// Mode limitation.
			// The usual limit of 4 moves is handled elsewhere - currently
			// in the cartridge-compliant set validator: rulesets.js:pokemon
			set.moves = set.moves.slice(0, 24);

			set.ivs = Validator.fillStats(set.ivs, 31);
			let maxedIVs = Object.values(set.ivs).every(val => val === 31);

			for (let i = 0; i < set.moves.length; i++) {
				if (!set.moves[i]) continue;
				let move = tools.getMove(Tools.getString(set.moves[i]));
				if (!move.exists) return [`"${move.name}" is an invalid move.`];
				check = move.id;
				setHas[check] = true;
				if (banlistTable[check]) {
					const reason = banReason`${banlistTable[check]}`;
					problems.push(`${name}'s move ${move.name} is ${reason}.`);
				}

				// Note that we don't error out on multiple Hidden Power types
				// That is checked in rulesets.js rule Pokemon
				if (move.id === 'hiddenpower' && move.type !== 'Normal' && !set.hpType) {
					set.hpType = move.type;
				}

				if (banlistTable['Unreleased']) {
					if (move.isUnreleased) problems.push(`${name}'s move ${move.name} is unreleased.`);
				}

				if (banlistTable['illegal']) {
					let problem = this.checkLearnset(move, template, lsetData);
					if (problem) {
						// Sketchmons hack
						const noSketch = format.noSketch || tools.getFormat('gen7sketchmons').noSketch;
						if (banlistTable['Rule:allowonesketch'] && noSketch.indexOf(move.name) < 0 && !set.sketchmonsMove && !move.noSketch && !move.isZ) {
							set.sketchmonsMove = move.id;
							continue;
						}
						let problemString = `${name} can't learn ${move.name}`;
						if (problem.type === 'incompatibleAbility') {
							problemString = problemString.concat(` because it's incompatible with its ability.`);
						} else if (problem.type === 'incompatible') {
							problemString = problemString.concat(` because it's incompatible with another move.`);
						} else if (problem.type === 'oversketched') {
							let plural = (parseInt(problem.maxSketches) === 1 ? '' : 's');
							problemString = problemString.concat(` because it can only sketch ${problem.maxSketches} move${plural}.`);
						} else if (problem.type === 'pastgen') {
							problemString = problemString.concat(` because it needs to be from generation ${problem.gen} or later.`);
						} else {
							problemString = problemString.concat(`.`);
						}
						problems.push(problemString);
					}
				}
			}

			const canBottleCap = (tools.gen >= 7 && set.level === 100);
			if (set.hpType && maxedIVs && banlistTable['Rule:pokemon']) {
				if (tools.gen <= 2) {
					let HPdvs = tools.getType(set.hpType).HPdvs;
					set.ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};
					for (let i in HPdvs) {
						set.ivs[i] = HPdvs[i] * 2;
					}
				} else if (!canBottleCap) {
					set.ivs = Validator.fillStats(tools.getType(set.hpType).HPivs, 31);
				}
			}
			if (set.hpType === 'Fighting' && banlistTable['Rule:pokemon']) {
				if (template.gen >= 6 && template.eggGroups[0] === 'Undiscovered' && !template.nfe && (template.baseSpecies !== 'Diancie' || !set.shiny)) {
					// Legendary Pokemon must have at least 3 perfect IVs in gen 6+
					problems.push(`${name} must not have Hidden Power Fighting because it starts with 3 perfect IVs because it's a gen 6+ legendary.`);
				}
			}
			const ivHpType = tools.getHiddenPower(set.ivs).type;
			if (!canBottleCap && banlistTable['Rule:pokemon'] && set.hpType && set.hpType !== ivHpType) {
				problems.push(`${name} has Hidden Power ${set.hpType}, but its IVs are for Hidden Power ${ivHpType}.`);
			}
			if (tools.gen <= 2) {
				// validate DVs
				const hpDV = Math.floor(set.ivs.hp / 2);
				const atkDV = Math.floor(set.ivs.atk / 2);
				const defDV = Math.floor(set.ivs.def / 2);
				const speDV = Math.floor(set.ivs.spe / 2);
				const spcDV = Math.floor(set.ivs.spa / 2);
				const expectedHpDV = (atkDV % 2) * 8 + (defDV % 2) * 4 + (speDV % 2) * 2 + (spcDV % 2);
				if (expectedHpDV !== hpDV) {
					problems.push(`${name} has an HP DV of ${hpDV}, but its Atk, Def, Spe, and Spc DVs give it an HP DV of ${expectedHpDV}.`);
				}
				if (set.ivs.spa !== set.ivs.spd) {
					if (tools.gen === 2) {
						problems.push(`${name} has different SpA and SpD DVs, which is not possible in Gen 2.`);
					} else {
						set.ivs.spd = set.ivs.spa;
					}
				}
				if (tools.gen > 1 && !template.gender) {
					// Gen 2 gender is calculated from the Atk DV.
					// High Atk DV <-> M. The meaning of "high" depends on the gender ratio.
					let genderThreshold = template.genderRatio.F * 16;
					if (genderThreshold === 4) genderThreshold = 5;
					if (genderThreshold === 8) genderThreshold = 7;

					const expectedGender = (atkDV >= genderThreshold ? 'M' : 'F');
					if (set.gender && set.gender !== expectedGender) {
						problems.push(`${name} is ${set.gender}, but it has an Atk DV of ${atkDV}, which makes its gender ${expectedGender}.`);
					} else {
						set.gender = expectedGender;
					}
				}
				if (tools.gen > 1) {
					const expectedShiny = !!(defDV === 10 && speDV === 10 && spcDV === 10 && atkDV % 4 >= 2);
					if (expectedShiny && !set.shiny) {
						problems.push(`${name} is not shiny, which does not match its DVs.`);
					} else if (!expectedShiny && set.shiny) {
						problems.push(`${name} is shiny, which does not match its DVs (its DVs must all be 10, except Atk which must be 2, 3, 6, 7, 10, 11, 14, or 15).`);
					}
				}
			}
			if (tools.gen <= 2 || tools.gen !== 6 && (format.id.endsWith('hackmons') || format.name.includes('BH'))) {
				if (!set.evs) set.evs = Validator.fillStats(null, 252);
				let evTotal = (set.evs.hp || 0) + (set.evs.atk || 0) + (set.evs.def || 0) + (set.evs.spa || 0) + (set.evs.spd || 0) + (set.evs.spe || 0);
				if (evTotal === 508 || evTotal === 510) {
					problems.push(`${name} has exactly 510 EVs, but this format does not restrict you to 510 EVs: you can max out every EV (If this was intentional, add exactly 1 to one of your EVs, which won't change its stats but will tell us that it wasn't a mistake).`);
				}
			}
			if (set.evs && !Object.values(set.evs).some(value => value > 0)) {
				problems.push(`${name} has exactly 0 EVs - did you forget to EV it? (If this was intentional, add exactly 1 to one of your EVs, which won't change its stats but will tell us that it wasn't a mistake).`);
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
					problems.push(`${name}'s egg moves are incompatible.`);
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
							throw new Error(`invalid limitedEgg on ${name}: ${limitedEgg} with ${lsetData.sources[i]}`);
						}
						let potentialFather = tools.getTemplate(lsetData.sources[i].slice(lsetData.sources[i].charAt(2) === 'T' ? 3 : 2));
						let restrictedSources = 0;
						for (let j = 0; j < limitedEgg.length; j++) {
							let moveid = limitedEgg[j];
							let fatherSources = potentialFather.learnset[moveid] || potentialFather.learnset['sketch'];
							if (!fatherSources) throw new Error(`Egg move father ${potentialFather.id} can't learn ${moveid}`);
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
						if (!newSources.length) {
							const moveNames = limitedEgg.map(id => tools.getMove(id).name);
							problems.push(`${name}'s past gen egg moves ${moveNames.join(', ')} do not have a valid father. (Is this incorrect? If so, post the chainbreeding instructions in Bug Reports)`);
						}
					}
				}
			}

			if (lsetData.sources && lsetData.sources.length && !lsetData.sourcesBefore && lsetData.sources.every(source => 'SVD'.includes(source.charAt(1)))) {
				// Every source is restricted
				let legal = false;
				for (const source of lsetData.sources) {
					if (this.validateSource(set, source, template)) continue;
					legal = true;
					break;
				}

				if (!legal) {
					if (lsetData.sources.length > 1) {
						problems.push(`${template.species} has an event-exclusive move that it doesn't qualify for (only one of several ways to get the move will be listed):`);
					}
					let eventProblems = this.validateSource(set, lsetData.sources[0], template, ` because it has a move only available`);
					if (eventProblems) problems.push(...eventProblems);
				}
			} else if (banlistTable['illegal'] && template.eventOnly) {
				let eventTemplate = !template.learnset && template.baseSpecies !== template.species ? tools.getTemplate(template.baseSpecies) : template;
				let eventPokemon = eventTemplate.eventPokemon;
				let legal = false;
				for (let i = 0; i < eventPokemon.length; i++) {
					let eventData = eventPokemon[i];
					if (this.validateEvent(set, eventData, eventTemplate)) continue;
					legal = true;
					if (eventData.gender) set.gender = eventData.gender;
					break;
				}
				if (!legal) {
					if (eventPokemon.length === 1) {
						problems.push(`${template.species} is only obtainable from an event - it needs to match its event:`);
					} else {
						problems.push(`${template.species} is only obtainable from events - it needs to match one of its events, such as:`);
					}
					let eventData = eventPokemon[0];
					const minPastGen = (format.requirePlus ? 7 : format.requirePentagon ? 6 : 1);
					let eventNum = 1;
					for (let i = 0; i < eventPokemon.length; i++) {
						if (eventPokemon[i].generation <= tools.gen && eventPokemon[i].generation >= minPastGen) {
							eventData = eventPokemon[i];
							eventNum = i + 1;
							break;
						}
					}
					let eventName = eventPokemon.length > 1 ? ` #${eventNum}` : ``;
					let eventProblems = this.validateEvent(set, eventData, eventTemplate, ` to be`, `from its event${eventName}`);
					if (eventProblems) problems.push(...eventProblems);
				}
			}
			if (isHidden && lsetData.sourcesBefore) {
				if (!lsetData.sources && lsetData.sourcesBefore < 5) {
					problems.push(`${name} has a hidden ability - it can't have moves only learned before gen 5.`);
				} else if (lsetData.sources && template.gender && template.gender !== 'F' && !{'Nidoran-M':1, 'Nidorino':1, 'Nidoking':1, 'Volbeat':1}[template.species]) {
					let compatibleSource = false;
					for (let i = 0, len = lsetData.sources.length; i < len; i++) {
						if (lsetData.sources[i].charAt(1) === 'E' || (lsetData.sources[i].substr(0, 2) === '5D' && set.level >= 10)) {
							compatibleSource = true;
							break;
						}
					}
					if (!compatibleSource) {
						problems.push(`${name} has moves incompatible with its hidden ability.`);
					}
				}
			}
			if (banlistTable['illegal'] && set.level < template.evoLevel) {
				// FIXME: Event pokemon given at a level under what it normally can be attained at gives a false positive
				problems.push(`${name} must be at least level ${template.evoLevel} to be evolved.`);
			}
			if (!lsetData.sources && lsetData.sourcesBefore <= 3 && tools.getAbility(set.ability).gen === 4 && !template.prevo && tools.gen <= 5) {
				problems.push(`${name} has a gen 4 ability and isn't evolved - it can't use anything from gen 3.`);
			}
			if (!lsetData.sources && lsetData.sourcesBefore < 6 && lsetData.sourcesBefore >= 3 && (isHidden || tools.gen <= 5) && template.gen <= lsetData.sourcesBefore) {
				let oldAbilities = tools.mod('gen' + lsetData.sourcesBefore).getTemplate(set.species).abilities;
				if (ability.name !== oldAbilities['0'] && ability.name !== oldAbilities['1'] && !oldAbilities['H']) {
					problems.push(`${name} has moves incompatible with its ability.`);
				}
			}
		}
		if (item.megaEvolves === template.species) {
			template = tools.getTemplate(item.megaStone);
		}
		if (banlistTable['mega'] && template.forme in {'Mega': 1, 'Mega-X': 1, 'Mega-Y': 1}) {
			problems.push(`Mega evolutions are banned.`);
		}
		if (template.tier) {
			let tier = template.tier;
			if (tier.charAt(0) === '(') tier = tier.slice(1, -1);
			setHas[toId(tier)] = true;
			if (banlistTable[tier] && banlistTable[template.id] !== false) {
				problems.push(`${template.species} is in ${tier}, which is banned.`);
			}
		}

		if (teamHas) {
			for (let i in setHas) {
				if (i in teamHas) {
					teamHas[i]++;
				} else {
					teamHas[i] = 1;
				}
			}
		}
		for (let i = 0; i < format.setBanTable.length; i++) {
			let bannedCombo = true;
			for (let j = 1; j < format.setBanTable[i].length; j++) {
				if (!setHas[format.setBanTable[i][j]]) {
					bannedCombo = false;
					break;
				}
			}
			if (bannedCombo) {
				const reason = banReason`${format.name}`;
				problems.push(`${name} has the combination of ${format.setBanTable[i][0]}, which is ${reason}.`);
			}
		}

		if (format.ruleset) {
			for (let i = 0; i < format.ruleset.length; i++) {
				let subformat = tools.getFormat(format.ruleset[i]);
				if (subformat.onValidateSet && banlistTable['Rule:' + subformat.id]) {
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

	/**
	 * Returns array of error messages if invalid, undefined if valid
	 *
	 * If `because` is not passed, instead returns true if invalid.
	 */
	validateSource(set, source, template, because, from) {
		let eventData;
		let eventTemplate = template;
		if (source.charAt(1) === 'S') {
			let splitSource = source.substr(source.charAt(2) === 'T' ? 3 : 2).split(' ');
			eventTemplate = this.tools.getTemplate(splitSource[1]);
			if (eventTemplate.eventPokemon) eventData = eventTemplate.eventPokemon[parseInt(splitSource[0])];
			if (!eventData) {
				throw new Error(`${eventTemplate.species} from ${template.species} doesn't have data for event ${source}`);
			}
		} else if (source.charAt(1) === 'V') {
			eventData = {
				generation: 1,
				perfectIVs: (template.speciesid === 'mew' ? 5 : 3),
				isHidden: true,
				from: 'Gen 1 Virtual Console transfer',
			};
		} else if (source.charAt(1) === 'D') {
			eventData = {
				generation: 5,
				level: 10,
				from: 'Gen 5 Dream World',
			};
		} else {
			throw new Error(`Unidentified source ${source} passed to validateSource`);
		}

		return this.validateEvent(set, eventData, eventTemplate, because, from);
	}

	/**
	 * Returns array of error messages if invalid, undefined if valid
	 *
	 * If `because` is not passed, instead returns true if invalid.
	 */
	validateEvent(set, eventData, eventTemplate, because, from = `from an event`) {
		let tools = this.tools;
		let name = set.species;
		let template = tools.getTemplate(set.species);
		if (!eventTemplate) eventTemplate = template;
		if (set.species !== set.name && set.baseSpecies !== set.name) name = `${set.name} (${set.species})`;

		const fastReturn = !because;
		if (eventData.from) from = `from ${eventData.from}`;
		let etc = `${because} ${from}`;

		let problems = [];

		if (this.format.requirePentagon && eventData.generation < 6) {
			if (fastReturn) return true;
			problems.push(`This format requires Pokemon from gen 6 or later and ${name} is from gen ${eventData.generation}${etc}.`);
		}
		if (this.format.requirePlus && eventData.generation < 7) {
			if (fastReturn) return true;
			problems.push(`This format requires Pokemon from gen 7 and ${name} is from gen ${eventData.generation}${etc}.`);
		}
		if (tools.gen < eventData.generation) {
			if (fastReturn) return true;
			problems.push(`This format is in gen ${tools.gen} and ${name} is from gen ${eventData.generation}${etc}.`);
		}

		if (eventData.level && set.level < eventData.level) {
			if (fastReturn) return true;
			problems.push(`${name} must be at least level ${eventData.level}${etc}.`);
		}
		if ((eventData.shiny === true && !set.shiny) || (!eventData.shiny && set.shiny)) {
			if (fastReturn) return true;
			let shinyReq = eventData.shiny ? ` be shiny` : ` not be shiny`;
			problems.push(`${name} must${shinyReq}${etc}.`);
		}
		if (eventData.gender) {
			if (set.gender && eventData.gender !== set.gender) {
				if (fastReturn) return true;
				problems.push(`${name}'s gender must be ${eventData.gender}${etc}.`);
			}
			if (!fastReturn) set.gender = eventData.gender;
		}
		if (eventData.nature && eventData.nature !== set.nature) {
			if (fastReturn) return true;
			problems.push(`${name} must have a ${eventData.nature} nature${etc}.`);
		}
		let requiredIVs = 0;
		if (eventData.ivs) {
			/** In Gen 7, IVs can be changed to 31 */
			const canBottleCap = (tools.gen >= 7 && set.level === 100);

			if (!set.ivs) set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
			let statTable = {hp:'HP', atk:'Attack', def:'Defense', spa:'Special Attack', spd:'Special Defense', spe:'Speed'};
			for (let statId in eventData.ivs) {
				if (canBottleCap && set.ivs[statId] === 31) continue;
				if (set.ivs[statId] !== eventData.ivs[statId]) {
					if (fastReturn) return true;
					problems.push(`${name} must have ${eventData.ivs[statId]} ${statTable[statId]} IVs${etc}.`);
				}
			}

			if (canBottleCap) {
				// IVs can be overridden but Hidden Power type can't
				if (Object.keys(eventData.ivs).length >= 6) {
					const requiredHpType = tools.getHiddenPower(eventData.ivs).type;
					if (set.hpType && set.hpType !== requiredHpType) {
						if (fastReturn) return true;
						problems.push(`${name} can only have Hidden Power ${requiredHpType}${etc}.`);
					}
					set.hpType = requiredHpType;
				}
			}
		} else {
			requiredIVs = eventData.perfectIVs || 0;
			if (eventData.generation >= 6 && eventData.perfectIVs === undefined && Validator.hasLegendaryIVs(template)) {
				requiredIVs = 3;
			}
		}
		if (requiredIVs && set.ivs) {
			// Legendary Pokemon must have at least 3 perfect IVs in gen 6
			// Events can also have a certain amount of guaranteed perfect IVs
			let perfectIVs = 0;
			for (let i in set.ivs) {
				if (set.ivs[i] >= 31) perfectIVs++;
			}
			if (perfectIVs < requiredIVs) {
				if (fastReturn) return true;
				if (eventData.perfectIVs) {
					problems.push(`${name} must have at least ${requiredIVs} perfect IVs${etc}.`);
				} else {
					problems.push(`${name} is a legendary and must have at least three perfect IVs${etc}.`);
				}
			}
			// The perfect IV count affects Hidden Power availability
			if (tools.gen >= 3 && requiredIVs >= 3 && set.hpType === 'Fighting') {
				if (fastReturn) return true;
				problems.push(`${name} can't use Hidden Power Fighting because it must have at least three perfect IVs${etc}.`);
			} else if (tools.gen >= 3 && requiredIVs >= 5 && set.hpType && !['Dark', 'Dragon', 'Electric', 'Steel', 'Ice'].includes(set.hpType)) {
				if (fastReturn) return true;
				problems.push(`${name} can only use Hidden Power Dark/Dragon/Electric/Steel/Ice because it must have at least 5 perfect IVs${etc}.`);
			}
		}
		if (tools.gen <= 5 && eventData.abilities && eventData.abilities.length === 1 && !eventData.isHidden) {
			if (template.species === eventTemplate.species) {
				// has not evolved, abilities must match
				const requiredAbility = tools.getAbility(eventData.abilities[0]).name;
				if (set.ability !== requiredAbility) {
					if (fastReturn) return true;
					problems.push(`${name} must have ${requiredAbility}${etc}.`);
				}
			} else {
				// has evolved
				let ability1 = tools.getAbility(eventTemplate.abilities['1']);
				if (ability1.gen && eventData.generation >= ability1.gen) {
					// pokemon had 2 available abilities in the gen the event happened
					// ability is restricted to a single ability slot
					const requiredAbilitySlot = (toId(eventData.abilities[0]) === ability1.id ? 1 : 0);
					const requiredAbility = tools.getAbility(template.abilities[requiredAbilitySlot] || template.abilities['0']).name;
					if (set.ability !== requiredAbility) {
						const originalAbility = tools.getAbility(eventData.abilities[0]).name;
						if (fastReturn) return true;
						problems.push(`${name} must have ${requiredAbility}${because} from a ${originalAbility} ${eventTemplate.species} event.`);
					}
				}
			}
		}
		if (eventData.isHidden !== undefined && template.abilities['H']) {
			const isHidden = (set.ability === template.abilities['H']);

			if (isHidden !== eventData.isHidden) {
				if (fastReturn) return true;
				problems.push(`${name} must ${eventData.isHidden ? 'have' : 'not have'} its Hidden Ability${etc}.`);
			}
		}
		if (!problems.length) return;
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
		if (lsetData.sourcesBefore === undefined) lsetData.sourcesBefore = tools.gen;

		/**
		 * The minimum past gen the format allows
		 */
		const minPastGen = (format.requirePlus ? 7 : format.requirePentagon ? 6 : 1);
		/**
		 * The format doesn't allow Pokemon who've bred with past gen Pokemon
		 * (e.g. Gen 6-7 before Pokebank was released)
		 */
		const noPastGenBreeding = false;
		/**
		 * The format doesn't allow Pokemon traded from the future
		 * (This is everything except in Gen 1 Tradeback)
		 */
		const noFutureGen = !(format.banlistTable && format.banlistTable['allowtradeback']);
		/**
		 * If a move can only be learned from a gen 2-5 egg, we have to check chainbreeding validity
		 * limitedEgg is false if there are any legal non-egg sources for the move, and true otherwise
		 */
		let limitedEgg = null;

		let tradebackEligible = false;
		do {
			alreadyChecked[template.speciesid] = true;
			if (tools.gen === 2 && template.gen === 1) tradebackEligible = true;
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
				if (moveid === 'sketch' || !lset || template.speciesid === 'smeargle') {
					if (move.noSketch || move.isZ) return true;
					lset = template.learnset['sketch'];
					sketch = true;
				}
				if (typeof lset === 'string') lset = [lset];

				for (let i = 0, len = lset.length; i < len; i++) {
					let learned = lset[i];
					let learnedGen = parseInt(learned.charAt(0));
					if (learnedGen < minPastGen) continue;
					if (noFutureGen && learnedGen > tools.gen) continue;

					// redundant
					if (learnedGen <= sourcesBefore) continue;

					if (learnedGen < 7 && isHidden && !tools.mod('gen' + learnedGen).getTemplate(template.species).abilities['H']) {
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
					if (learned.substr(0, 2) in {'4L':1, '5L':1, '6L':1, '7L':1}) {
						// gen 4-7 level-up moves
						if (level >= parseInt(learned.substr(2)) || learnedGen === 7 && tools.gen >= 7) {
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
						if (learnedGen === tools.gen) {
							// current-gen TM or tutor moves:
							//   always available
							return false;
						}
						// past-gen level-up, TM, or tutor moves:
						//   available as long as the source gen was or was before this gen
						limit1 = false;
						sourcesBefore = Math.max(sourcesBefore, learnedGen);
						limitedEgg = false;
					} else if (learned.charAt(1) === 'E') {
						// egg moves:
						//   only if that was the source
						if ((learnedGen >= 6 && !noPastGenBreeding) || lsetData.fastCheck) {
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
						for (let fatherid in tools.data.Pokedex) {
							let father = tools.getTemplate(fatherid);
							// can't inherit from CAP pokemon
							if (father.isNonstandard) continue;
							// can't breed mons from future gens
							if (father.gen > learnedGen) continue;
							// father must be male
							if (father.gender === 'N' || father.gender === 'F') continue;
							// can't inherit from dex entries with no learnsets
							if (!father.learnset) continue;
							// unless it's supposed to be self-breedable, can't inherit from self, prevos, evos, etc
							// only basic pokemon have egg moves, so by now all evolutions should be in alreadyChecked
							if (!fromSelf && alreadyChecked[father.speciesid]) continue;
							if (!fromSelf && father.evos.includes(template.id)) continue;
							if (!fromSelf && father.prevo === template.id) continue;
							// father must be able to learn the move
							let fatherSources = father.learnset[moveid] || father.learnset['sketch'];
							if (!fromSelf && !fatherSources) continue;

							// must be able to breed with father
							if (!father.eggGroups.some(eggGroup => eggGroupsSet.has(eggGroup))) continue;

							// detect unavailable egg moves
							if (noPastGenBreeding) {
								const fatherLatestMoveGen = fatherSources[0].charAt(0);
								if (father.tier.startsWith('Bank') || fatherLatestMoveGen !== '7') continue;
								atLeastOne = true;
								break;
							}

							// we can breed with it
							atLeastOne = true;
							if (tradebackEligible && learnedGen === 2 && move.gen <= 1) {
								// can tradeback
								sources.push('1ET' + father.id);
							}
							sources.push(learned + father.id);
							if (limitedEgg !== false) limitedEgg = true;
						}
						if (atLeastOne && noPastGenBreeding) {
							// gen 6+ doesn't have egg move incompatibilities except for certain cases with baby Pokemon
							learned = learnedGen + 'E' + (template.prevo ? template.id : '');
							sources.push(learned);
							limitedEgg = false;
							continue;
						}
						// chainbreeding with itself
						// e.g. ExtremeSpeed Dragonite
						if (!atLeastOne) {
							if (noPastGenBreeding) continue;
							sources.push(learned + template.id);
							limitedEgg = 'self';
						}
					} else if (learned.charAt(1) === 'S') {
						// event moves:
						//   only if that was the source
						// Event Pokémon:
						//	Available as long as the past gen can get the Pokémon and then trade it back.
						if (tradebackEligible && learnedGen === 2 && move.gen <= 1) {
							// can tradeback
							sources.push('1ST' + learned.slice(2) + ' ' + template.id);
						}
						sources.push(learned + ' ' + template.id);
					} else if (learned.charAt(1) === 'D') {
						// DW moves:
						//   only if that was the source
						sources.push(learned);
					} else if (learned.charAt(1) === 'V') {
						// Virtual Console moves:
						//   only if that was the source
						if (sources[sources.length - 1] !== learned) sources.push(learned);
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
			} else if (template.baseSpecies !== template.species && template.baseSpecies === 'Rotom') {
				// only Rotom inherit learnsets from base
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
			if (minPastGen > 1 && sometimesPossible) return {type:'pastgen', gen: minPastGen};
			if (incompatibleAbility) return {type:'incompatibleAbility'};
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

	static hasLegendaryIVs(template) {
		return ((template.eggGroups[0] === 'Undiscovered' || template.species === 'Manaphy') && !template.prevo && !template.nfe &&
			template.species !== 'Unown' && template.baseSpecies !== 'Pikachu');
	}
	static fillStats(stats, fillNum = 0) {
		let filledStats = {hp: fillNum, atk: fillNum, def: fillNum, spa: fillNum, spd: fillNum, spe: fillNum};
		if (stats) {
			for (const stat in filledStats) {
				if (typeof stats[stat] === 'number') filledStats[stat] = stats[stat];
			}
		}
		return filledStats;
	}
}
TeamValidator.Validator = Validator;

function getValidator(format, supplementaryBanlist) {
	return new Validator(format, supplementaryBanlist);
}

/*********************************************************
 * Process manager
 *********************************************************/

const ProcessManager = require('./process-manager');

class TeamValidatorManager extends ProcessManager {
	onMessageUpstream(message) {
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
	}

	onMessageDownstream(message) {
		// protocol:
		// "[id]|[format]|[supplementaryBanlist]|[removeNicknames]|[team]"
		let pipeIndex = message.indexOf('|');
		let nextPipeIndex = message.indexOf('|', pipeIndex + 1);
		let id = message.substr(0, pipeIndex);
		let format = message.substr(pipeIndex + 1, nextPipeIndex - pipeIndex - 1);

		pipeIndex = nextPipeIndex;
		nextPipeIndex = message.indexOf('|', pipeIndex + 1);
		let supplementaryBanlist = message.substr(pipeIndex + 1, nextPipeIndex - pipeIndex - 1);

		pipeIndex = nextPipeIndex;
		nextPipeIndex = message.indexOf('|', pipeIndex + 1);
		let removeNicknames = message.substr(pipeIndex + 1, nextPipeIndex - pipeIndex - 1);
		let team = message.substr(nextPipeIndex + 1);

		process.send(id + '|' + this.receive(format, supplementaryBanlist, removeNicknames, team));
	}

	receive(format, supplementaryBanlist, removeNicknames, team) {
		let parsedTeam = Tools.fastUnpackTeam(team);
		supplementaryBanlist = supplementaryBanlist === '0' ? false : supplementaryBanlist.split(',');
		removeNicknames = removeNicknames === '1';

		let problems;
		try {
			problems = TeamValidator(format, supplementaryBanlist).validateTeam(parsedTeam, removeNicknames);
		} catch (err) {
			require('./crashlogger')(err, 'A team validation', {
				format: format,
				team: team,
				supplementaryBanlist: supplementaryBanlist,
			});
			problems = [`Your team crashed the team validator. We've been automatically notified and will fix this crash, but you should use a different team for now.`];
		}

		if (problems && problems.length) {
			return '0' + problems.join('\n');
		} else {
			let packedTeam = Tools.packTeam(parsedTeam);
			// console.log('FROM: ' + message.substr(pipeIndex2 + 1));
			// console.log('TO: ' + packedTeam);
			return '1' + packedTeam;
		}
	}
}

TeamValidator.TeamValidatorManager = TeamValidatorManager;

PM = TeamValidator.PM = new TeamValidatorManager({
	execFile: __filename,
	maxProcesses: global.Config ? Config.validatorprocesses : 1,
	isChatBased: false,
});

if (process.send && module === process.mainModule) {
	// This is a child process!

	global.Config = require('./config/config');

	if (Config.crashguard) {
		process.on('uncaughtException', err => {
			require('./crashlogger')(err, `A team validator process`, true);
		});
	}

	global.Tools = require('./tools').includeData();
	global.toId = Tools.getId;
	global.Chat = require('./chat');

	require('./repl').start('team-validator-', process.pid, cmd => eval(cmd));

	process.on('message', message => PM.onMessageDownstream(message));
	process.on('disconnect', () => process.exit());
}
