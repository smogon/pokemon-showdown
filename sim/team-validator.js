/**
 * Team Validator
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Handles team validation, and specifically learnset checking.
 *
 * @license MIT license
 */

'use strict';

/**
 * Keeps track of how a pokemon with a given set might be obtained.
 *
 * `sources` is a list of possible PokemonSources, and a nonzero
 * sourcesBefore means the Pokemon is compatible with all possible
 * PokemonSources from that gen or earlier.
 *
 * `limitedEgg` tracks moves that can only be obtained from an egg with
 * another father in gen 2-5. If there are multiple such moves,
 * potential fathers need to be checked to see if they can actually
 * learn the move combination in question.
 *
 * @typedef {Object} PokemonSources
 * @property {PokemonSource[]} sources
 * @property {number} sourcesBefore
 * @property {string} [sketchMove] limit 1 in fakemon Sketch-as-egg-move formats
 * @property {string} [hm] limit 1 HM transferred from gen 4 to 5
 * @property {(string | 'self')[]} [limitedEgg] list of egg moves
 * @property {true} [fastCheck]
 */

class Validator {
	/**
	 * @param {string | Format} format
	 */
	constructor(format) {
		this.format = Dex.getFormat(format);
		this.dex = Dex.forFormat(this.format);
		this.ruleTable = this.dex.getRuleTable(this.format);
	}

	/**
	 * @param {PokemonSet[]} team
	 * @return {string[] | false}
	 */
	validateTeam(team, removeNicknames = false) {
		if (this.format.validateTeam) return this.format.validateTeam.call(this, team, removeNicknames);
		return this.baseValidateTeam(team, removeNicknames);
	}

	/**
	 * @param {PokemonSet[]} team
	 * @return {string[] | false}
	 */
	baseValidateTeam(team, removeNicknames = false) {
		let format = this.format;
		let dex = this.dex;

		let problems = /** @type {string[]} */ ([]);
		const ruleTable = this.ruleTable;
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
		if (!lengthRange) lengthRange = [1, 6];
		if (format.gameType === 'doubles' && lengthRange[0] < 2) lengthRange[0] = 2;
		if ((format.gameType === 'triples' || format.gameType === 'rotation') && lengthRange[0] < 3) lengthRange[0] = 3;
		if (team.length < lengthRange[0]) problems.push(`You must bring at least ${lengthRange[0]} Pok\u00E9mon.`);
		if (team.length > lengthRange[1]) return [`You may only bring up to ${lengthRange[1]} Pok\u00E9mon.`];

		// A limit is imposed here to prevent too much engine strain or
		// too much layout deformation - to be exact, this is the limit
		// allowed in Custom Game.
		// The usual limit of 6 pokemon is handled elsewhere - currently
		// in the cartridge-compliant set validator: rulesets.js:pokemon
		if (team.length > 24) {
			problems.push(`Your team has more than than 24 Pok\u00E9mon, which the simulator can't handle.`);
			return problems;
		}

		let teamHas = {};
		for (let i = 0; i < team.length; i++) { // Changing this loop to for-of would require another loop/map statement to do removeNicknames
			if (!team[i]) return [`You sent invalid team data. If you're not using a custom client, please report this as a bug.`];
			let setProblems = (format.validateSet || this.validateSet).call(this, team[i], teamHas);
			if (setProblems) {
				problems = problems.concat(setProblems);
			}
			if (removeNicknames) team[i].name = dex.getTemplate(team[i].species).baseSpecies;
		}

		for (const [rule, source, limit, bans] of ruleTable.complexTeamBans) {
			let count = 0;
			for (const ban of bans) {
				if (teamHas[ban] > 0) {
					count += limit ? teamHas[ban] : 1;
				}
			}
			if (limit && count > limit) {
				const clause = source ? ` by ${source}` : ``;
				problems.push(`You are limited to ${limit} of ${rule}${clause}.`);
			} else if (!limit && count >= bans.length) {
				const clause = source ? ` by ${source}` : ``;
				problems.push(`Your team has the combination of ${rule}, which is banned${clause}.`);
			}
		}

		for (const [rule] of ruleTable) {
			let subformat = dex.getFormat(rule);
			if (subformat.onValidateTeam && ruleTable.has(subformat.id)) {
				problems = problems.concat(subformat.onValidateTeam.call(dex, team, format, teamHas) || []);
			}
		}
		if (format.onValidateTeam) {
			problems = problems.concat(format.onValidateTeam.call(dex, team, format, teamHas) || []);
		}

		if (!problems.length) return false;
		return problems;
	}

	/**
	 * @param {PokemonSet} set
	 * @param {AnyObject} teamHas
	 * @return {string[] | false}
	 */
	validateSet(set, teamHas) {
		let format = this.format;
		let dex = this.dex;

		let problems = /** @type {string[]} */ ([]);
		if (!set) {
			return [`This is not a Pokemon.`];
		}

		let template = dex.getTemplate(set.species);
		set.species = Dex.getSpecies(set.species);
		set.name = dex.getName(set.name);
		let item = dex.getItem(Dex.getString(set.item));
		set.item = item.name;
		let ability = dex.getAbility(Dex.getString(set.ability));
		set.ability = ability.name;
		set.nature = dex.getNature(Dex.getString(set.nature)).name;
		if (!Array.isArray(set.moves)) set.moves = [];

		let maxLevel = format.maxLevel || 100;
		let maxForcedLevel = format.maxForcedLevel || maxLevel;
		let forcedLevel = /** @type {number?} */ (null);
		if (!set.level) {
			set.level = (format.defaultLevel || maxLevel);
		}
		if (format.forcedLevel) {
			forcedLevel = format.forcedLevel;
		} else if (set.level >= maxForcedLevel) {
			forcedLevel = maxForcedLevel;
		}
		if (set.level > maxLevel || set.level === forcedLevel || set.level === maxForcedLevel) {
			// Note that we're temporarily setting level 50 pokemon in VGC to level 100
			// This allows e.g. level 50 Hydreigon even though it doesn't evolve until level 64.
			// Leveling up can't make an obtainable pokemon unobtainable, so this is safe.
			// Just remember to set the level back to forcedLevel at the end of the file.
			set.level = maxLevel;
		}

		let nameTemplate = dex.getTemplate(set.name);
		if (toId(format.name) !== 'gen7crossevolution' && nameTemplate.exists && nameTemplate.name.toLowerCase() === set.name.toLowerCase()) {
			// Name must not be the name of another pokemon
			// @ts-ignore
			set.name = null;
		}
		set.name = set.name || template.baseSpecies;
		let name = set.species;
		if (set.species !== set.name && template.baseSpecies !== set.name) name = `${set.name} (${set.species})`;
		let isHidden = false;
		let lsetData = /** @type {PokemonSources} */ ({sources:[], sourcesBefore:dex.gen});

		let setHas = {};
		const ruleTable = this.ruleTable;

		for (const [rule] of ruleTable) {
			let subformat = dex.getFormat(rule);
			if (subformat.onChangeSet && ruleTable.has(subformat.id)) {
				problems = problems.concat(subformat.onChangeSet.call(dex, set, format) || []);
			}
		}
		if (format.onChangeSet) {
			problems = problems.concat(format.onChangeSet.call(dex, set, format, setHas, teamHas) || []);
		}

		// onChangeSet can modify set.species, set.item, set.ability
		template = dex.getTemplate(set.species);
		item = dex.getItem(set.item);
		ability = dex.getAbility(set.ability);

		if (ability.id === 'battlebond' && template.id === 'greninja' && !ruleTable.has('ignoreillegalabilities')) {
			template = dex.getTemplate('greninjaash');
			if (set.gender && set.gender !== 'M') {
				problems.push(`Battle Bond Greninja must be male.`);
			}
			set.gender = 'M';
		}
		if (ability.id === 'owntempo' && template.id === 'rockruff') {
			template = dex.getTemplate('rockruffdusk');
		}
		if (!template.exists) {
			return [`The Pokemon "${set.species}" does not exist.`];
		}

		if (item.id && !item.exists) {
			return [`"${set.item}" is an invalid item.`];
		}
		if (ability.id && !ability.exists) {
			if (dex.gen < 3) {
				// gen 1-2 don't have abilities, just silently remove
				ability = dex.getAbility('');
				set.ability = '';
			} else {
				return [`"${set.ability}" is an invalid ability.`];
			}
		}
		if (set.nature && !dex.getNature(set.nature).exists) {
			if (dex.gen < 3) {
				// gen 1-2 don't have natures, just remove them
				set.nature = '';
			} else {
				return [`${set.species}'s nature is invalid.`];
			}
		}
		if (set.happiness !== undefined && isNaN(set.happiness)) {
			problems.push(`${set.species} has an invalid happiness.`);
		}

		let banReason = ruleTable.check(template.id, setHas) || ruleTable.check(template.id + 'base', setHas);
		if (banReason) {
			return [`${set.species} is ${banReason}.`];
		} else {
			banReason = ruleTable.check(toId(template.baseSpecies), setHas);
			if (banReason) {
				return [`${template.baseSpecies} is ${banReason}.`];
			}
		}

		banReason = ruleTable.check(toId(set.ability), setHas);
		if (banReason) {
			problems.push(`${name}'s ability ${set.ability} is ${banReason}.`);
		}
		banReason = ruleTable.check(toId(set.item), setHas);
		if (banReason) {
			problems.push(`${name}'s item ${set.item} is ${banReason}.`);
		}
		if (ruleTable.has('-unreleased') && item.isUnreleased) {
			problems.push(`${name}'s item ${set.item} is unreleased.`);
		}
		if (ruleTable.has('-unreleased') && template.isUnreleased) {
			if (template.eggGroups[0] === 'Undiscovered' && !template.evos) {
				problems.push(`${name} (${template.species}) is unreleased.`);
			}
		}
		setHas[toId(set.ability)] = true;
		if (ruleTable.has('-illegal')) {
			// Don't check abilities for metagames with All Abilities
			if (dex.gen <= 2) {
				set.ability = 'None';
			} else if (!ruleTable.has('ignoreillegalabilities')) {
				if (!ability.name) {
					problems.push(`${name} needs to have an ability.`);
				} else if (!Object.values(template.abilities).includes(ability.name)) {
					problems.push(`${name} can't have ${set.ability}.`);
				}
				if (ability.name === template.abilities['H']) {
					isHidden = true;

					if (template.unreleasedHidden && ruleTable.has('-unreleased')) {
						problems.push(`${name}'s hidden ability is unreleased.`);
					} else if (dex.gen === 6 && (set.species.endsWith('Orange') || set.species.endsWith('White')) && ability.name === 'Symbiosis') {
						problems.push(`${name}'s hidden ability is unreleased for the Orange and White forms.`);
					} else if (dex.gen === 5 && set.level < 10 && (template.maleOnlyHidden || template.gender === 'N')) {
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
			// too much layout deformation - to be exact, this is the limit
			// allowed in Custom Game.
			// The usual limit of 4 moves is handled elsewhere - currently
			// in the cartridge-compliant set validator: rulesets.js:pokemon
			if (set.moves.length > 24) {
				problems.push(`${name} has more than 24 moves, which the simulator can't handle.`);
				return problems;
			}

			set.ivs = Validator.fillStats(set.ivs, 31);
			let ivs = /** @type {StatsTable} */ (set.ivs);
			let maxedIVs = Object.values(ivs).every(stat => stat === 31);

			for (const moveName of set.moves) {
				if (!moveName) continue;
				let move = dex.getMove(Dex.getString(moveName));
				if (!move.exists) return [`"${move.name}" is an invalid move.`];
				banReason = ruleTable.check(move.id, setHas);
				if (banReason) {
					problems.push(`${name}'s move ${move.name} is ${banReason}.`);
				}

				// Note that we don't error out on multiple Hidden Power types
				// That is checked in rulesets.js rule Pokemon
				if (move.id === 'hiddenpower' && move.type !== 'Normal' && !set.hpType) {
					set.hpType = move.type;
				}

				if (ruleTable.has('-unreleased')) {
					if (move.isUnreleased) problems.push(`${name}'s move ${move.name} is unreleased.`);
				}

				if (ruleTable.has('-illegal')) {
					let problem = this.checkLearnset(move, template, lsetData, set);
					if (problem) {
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

			const canBottleCap = (dex.gen >= 7 && set.level === 100);
			if (set.hpType && maxedIVs && ruleTable.has('pokemon')) {
				if (dex.gen <= 2) {
					let HPdvs = dex.getType(set.hpType).HPdvs;
					ivs = set.ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};
					for (let i in HPdvs) {
						// @ts-ignore TypeScript index signature bug
						ivs[i] = HPdvs[i] * 2;
					}
					ivs.hp = -1;
				} else if (!canBottleCap) {
					ivs = set.ivs = Validator.fillStats(dex.getType(set.hpType).HPivs, 31);
				}
			}
			if (set.hpType === 'Fighting' && ruleTable.has('pokemon')) {
				if (template.gen >= 6 && template.eggGroups[0] === 'Undiscovered' && !template.nfe && (template.baseSpecies !== 'Diancie' || !set.shiny)) {
					// Legendary Pokemon must have at least 3 perfect IVs in gen 6+
					problems.push(`${name} must not have Hidden Power Fighting because it starts with 3 perfect IVs because it's a gen 6+ legendary.`);
				}
			}
			const ivHpType = dex.getHiddenPower(set.ivs).type;
			if (!canBottleCap && ruleTable.has('pokemon') && set.hpType && set.hpType !== ivHpType) {
				problems.push(`${name} has Hidden Power ${set.hpType}, but its IVs are for Hidden Power ${ivHpType}.`);
			}
			if (dex.gen <= 2) {
				// validate DVs
				const atkDV = Math.floor(ivs.atk / 2);
				const defDV = Math.floor(ivs.def / 2);
				const speDV = Math.floor(ivs.spe / 2);
				const spcDV = Math.floor(ivs.spa / 2);
				const expectedHpDV = (atkDV % 2) * 8 + (defDV % 2) * 4 + (speDV % 2) * 2 + (spcDV % 2);
				if (ivs.hp === -1) ivs.hp = expectedHpDV * 2;
				const hpDV = Math.floor(ivs.hp / 2);
				if (expectedHpDV !== hpDV) {
					problems.push(`${name} has an HP DV of ${hpDV}, but its Atk, Def, Spe, and Spc DVs give it an HP DV of ${expectedHpDV}.`);
				}
				if (ivs.spa !== ivs.spd) {
					if (dex.gen === 2) {
						problems.push(`${name} has different SpA and SpD DVs, which is not possible in Gen 2.`);
					} else {
						ivs.spd = ivs.spa;
					}
				}
				if (dex.gen > 1 && !template.gender) {
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
				if (dex.gen > 1) {
					const expectedShiny = !!(defDV === 10 && speDV === 10 && spcDV === 10 && atkDV % 4 >= 2);
					if (expectedShiny && !set.shiny) {
						problems.push(`${name} is not shiny, which does not match its DVs.`);
					} else if (!expectedShiny && set.shiny) {
						problems.push(`${name} is shiny, which does not match its DVs (its DVs must all be 10, except Atk which must be 2, 3, 6, 7, 10, 11, 14, or 15).`);
					}
				}
			}
			if (dex.gen <= 2 || dex.gen !== 6 && (format.id.endsWith('hackmons') || format.name.includes('BH'))) {
				if (!set.evs) set.evs = Validator.fillStats(null, 252);
				let evTotal = (set.evs.hp || 0) + (set.evs.atk || 0) + (set.evs.def || 0) + (set.evs.spa || 0) + (set.evs.spd || 0) + (set.evs.spe || 0);
				if (evTotal === 508 || evTotal === 510) {
					problems.push(`${name} has exactly 510 EVs, but this format does not restrict you to 510 EVs: you can max out every EV (If this was intentional, add exactly 1 to one of your EVs, which won't change its stats but will tell us that it wasn't a mistake).`);
				}
			}
			// @ts-ignore TypeScript index signature bug
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
					for (const source of lsetData.sources) {
						if (source.charAt(1) === 'S' || source.charAt(1) === 'D') continue;
						let eggGen = parseInt(source.charAt(0));
						if (source.charAt(1) !== 'E' || eggGen === 6) {
							// (There is a way to obtain this pokemon without past-gen breeding.)
							// In theory, limitedEgg should not exist in this case.
							throw new Error(`invalid limitedEgg on ${name}: ${limitedEgg} with ${source}`);
						}
						let potentialFather = dex.getTemplate(source.slice(source.charAt(2) === 'T' ? 3 : 2));
						if (!potentialFather.learnset) throw new Error(`${potentialFather.species} has no learnset`);
						let restrictedSources = 0;
						for (const moveid of limitedEgg) {
							let fatherSources = potentialFather.learnset[moveid] || potentialFather.learnset['sketch'];
							if (!fatherSources) throw new Error(`Egg move father ${potentialFather.id} can't learn ${moveid}`);
							let hasUnrestrictedSource = false;
							let hasSource = false;
							for (const fatherSource of fatherSources) {
								// Triply nested loop! Fortunately, all the loops are designed
								// to be as short as possible.
								if (+source.charAt(0) > eggGen) continue;
								hasSource = true;
								if (fatherSource.charAt(1) !== 'E' && fatherSource.charAt(1) !== 'S') {
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
						for (const source of lsetData.sources) {
							if (source.charAt(1) === 'S') {
								newSources.push(source);
							}
						}
						lsetData.sources = newSources;
						if (!newSources.length) {
							const moveNames = limitedEgg.map(id => dex.getMove(id).name);
							problems.push(`${name}'s past gen egg moves ${moveNames.join(', ')} do not have a valid father. (Is this incorrect? If so, post the chainbreeding instructions in Bug Reports)`);
						}
					}
				}
			}

			if (isHidden && lsetData.sourcesBefore < 5) {
				lsetData.sources = lsetData.sources.filter(source =>
					parseInt(source.charAt(0)) >= 5
				);
				lsetData.sourcesBefore = 0;
				if (!lsetData.sources.length) {
					problems.push(`${name} has a hidden ability - it can't have moves only learned before gen 5.`);
				}
			}

			if (!lsetData.sourcesBefore && lsetData.sources.length && lsetData.sources.every(source => 'SVD'.includes(source.charAt(1)))) {
				// Every source is restricted
				let legal = false;
				for (const source of lsetData.sources) {
					// @ts-ignore TypeScript overload syntax bug
					if (this.validateSource(set, source, template)) continue;
					legal = true;
					break;
				}

				if (!legal) {
					if (lsetData.sources.length > 1) {
						problems.push(`${template.species} has an event-exclusive move that it doesn't qualify for (only one of several ways to get the move will be listed):`);
					}
					// @ts-ignore TypeScript overload syntax bug
					let eventProblems = this.validateSource(set, lsetData.sources[0], template, ` because it has a move only available`);
					// @ts-ignore TypeScript overload syntax bug
					if (eventProblems) problems.push(...eventProblems);
				}
			} else if (ruleTable.has('-illegal') && template.eventOnly) {
				let eventTemplate = !template.learnset && template.baseSpecies !== template.species ? dex.getTemplate(template.baseSpecies) : template;
				const eventPokemon = eventTemplate.eventPokemon;
				if (!eventPokemon) throw new Error(`Event-only template ${template.species} has no eventPokemon table`);
				let legal = false;
				for (const eventData of eventPokemon) {
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
						if (eventPokemon[i].generation <= dex.gen && eventPokemon[i].generation >= minPastGen) {
							eventData = eventPokemon[i];
							eventNum = i + 1;
							break;
						}
					}
					let eventName = eventPokemon.length > 1 ? ` #${eventNum}` : ``;
					let eventProblems = this.validateEvent(set, eventData, eventTemplate, ` to be`, `from its event${eventName}`);
					// @ts-ignore TypeScript overload syntax bug
					if (eventProblems) problems.push(...eventProblems);
				}
			}
			if (ruleTable.has('-illegal') && set.level < (template.evoLevel || 0)) {
				// FIXME: Event pokemon given at a level under what it normally can be attained at gives a false positive
				problems.push(`${name} must be at least level ${template.evoLevel} to be evolved.`);
			}
			if (!lsetData.sources && lsetData.sourcesBefore <= 3 && dex.getAbility(set.ability).gen === 4 && !template.prevo && dex.gen <= 5) {
				problems.push(`${name} has a gen 4 ability and isn't evolved - it can't use anything from gen 3.`);
			}
			if (!lsetData.sources && lsetData.sourcesBefore < 6 && lsetData.sourcesBefore >= 3 && (isHidden || dex.gen <= 5) && template.gen <= lsetData.sourcesBefore) {
				let oldAbilities = dex.mod('gen' + lsetData.sourcesBefore).getTemplate(set.species).abilities;
				if (ability.name !== oldAbilities['0'] && ability.name !== oldAbilities['1'] && !oldAbilities['H']) {
					problems.push(`${name} has moves incompatible with its ability.`);
				}
			}
		}
		if (item.megaEvolves === template.species) {
			if (!item.megaStone) throw new Error(`Item ${item.name} has no base form for mega evolution`);
			template = dex.getTemplate(item.megaStone);
		}
		if (ruleTable.has('-mega') && ['Mega', 'Mega-X', 'Mega-Y'].includes(template.forme)) {
			problems.push(`Mega evolutions are banned.`);
		}
		if (template.tier) {
			banReason = ruleTable.check(toId(template.tier), setHas);
			if (banReason && !ruleTable.has('+' + template.id)) {
				problems.push(`${template.species} is in ${template.tier}, which is ${banReason}.`);
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
		for (const [rule, source, limit, bans] of ruleTable.complexBans) {
			let count = 0;
			for (const ban of bans) {
				if (setHas[ban] > 0) {
					count += limit ? setHas[ban] : 1;
				}
			}
			if (limit && count > limit) {
				const clause = source ? ` by ${source}` : ``;
				problems.push(`${name} is limited to ${limit} of ${rule}${clause}.`);
			} else if (!limit && count >= bans.length) {
				const clause = source ? ` by ${source}` : ``;
				problems.push(`${name} has the combination of ${rule}, which is banned${clause}.`);
			}
		}

		for (const [rule] of ruleTable) {
			if (rule.startsWith('!')) continue;
			let subformat = dex.getFormat(rule);
			if (subformat.onValidateSet && ruleTable.has(subformat.id)) {
				problems = problems.concat(subformat.onValidateSet.call(dex, set, format, setHas, teamHas) || []);
			}
		}
		if (format.onValidateSet) {
			problems = problems.concat(format.onValidateSet.call(dex, set, format, setHas, teamHas) || []);
		}

		if (!problems.length) {
			if (forcedLevel) set.level = forcedLevel;
			return false;
		}

		return problems;
	}

	/**
	 * Returns array of error messages if invalid, undefined if valid
	 *
	 * If `because` is not passed, instead returns true if invalid.
	 * @param {PokemonSet} set
	 * @param {PokemonSource} source
	 * @param {Template} template
	 * @param {string} because
	 * @param {string} from
	 */
	validateSource(set, source, template, because, from) {
		let eventData = /** @type {?EventInfo} */ (null);
		let eventTemplate = template;
		if (source.charAt(1) === 'S') {
			let splitSource = source.substr(source.charAt(2) === 'T' ? 3 : 2).split(' ');
			eventTemplate = this.dex.getTemplate(splitSource[1]);
			if (eventTemplate.eventPokemon) eventData = eventTemplate.eventPokemon[parseInt(splitSource[0])];
			if (!eventData) {
				throw new Error(`${eventTemplate.species} from ${template.species} doesn't have data for event ${source}`);
			}
		} else if (source.charAt(1) === 'V') {
			eventData = {
				generation: 2,
				perfectIVs: (template.speciesid === 'mew' ? 5 : 3),
				isHidden: true,
				from: 'Gen 1-2 Virtual Console transfer',
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
	 * @param {PokemonSet} set
	 * @param {EventInfo} eventData
	 * @param {Template} eventTemplate
	 */
	validateEvent(set, eventData, eventTemplate, because = ``, from = `from an event`) {
		let dex = this.dex;
		let name = set.species;
		let template = dex.getTemplate(set.species);
		if (!eventTemplate) eventTemplate = template;
		if (set.species !== set.name && template.baseSpecies !== set.name) name = `${set.name} (${set.species})`;

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
		if (dex.gen < eventData.generation) {
			if (fastReturn) return true;
			problems.push(`This format is in gen ${dex.gen} and ${name} is from gen ${eventData.generation}${etc}.`);
		}

		if (eventData.level && (set.level || 0) < eventData.level) {
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
			const canBottleCap = (dex.gen >= 7 && set.level === 100);

			if (!set.ivs) set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
			let statTable = {hp:'HP', atk:'Attack', def:'Defense', spa:'Special Attack', spd:'Special Defense', spe:'Speed'};
			for (let statId in eventData.ivs) {
				// @ts-ignore TypeScript index signature bug
				if (canBottleCap && set.ivs[statId] === 31) continue;
				// @ts-ignore TypeScript index signature bug
				if (set.ivs[statId] !== eventData.ivs[statId]) {
					if (fastReturn) return true;
					// @ts-ignore TypeScript index signature bug
					problems.push(`${name} must have ${eventData.ivs[statId]} ${statTable[statId]} IVs${etc}.`);
				}
			}

			if (canBottleCap) {
				// IVs can be overridden but Hidden Power type can't
				if (Object.keys(eventData.ivs).length >= 6) {
					const requiredHpType = dex.getHiddenPower(eventData.ivs).type;
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
				// @ts-ignore TypeScript index signature bug
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
			if (dex.gen >= 3 && requiredIVs >= 3 && set.hpType === 'Fighting') {
				if (fastReturn) return true;
				problems.push(`${name} can't use Hidden Power Fighting because it must have at least three perfect IVs${etc}.`);
			} else if (dex.gen >= 3 && requiredIVs >= 5 && set.hpType && !['Dark', 'Dragon', 'Electric', 'Steel', 'Ice'].includes(set.hpType)) {
				if (fastReturn) return true;
				problems.push(`${name} can only use Hidden Power Dark/Dragon/Electric/Steel/Ice because it must have at least 5 perfect IVs${etc}.`);
			}
		}
		// Event-related ability restrictions only matter if we care about illegal abilities
		const ruleTable = this.ruleTable;
		if (!ruleTable.has('ignoreillegalabilities')) {
			if (dex.gen <= 5 && eventData.abilities && eventData.abilities.length === 1 && !eventData.isHidden) {
				if (template.species === eventTemplate.species) {
					// has not evolved, abilities must match
					const requiredAbility = dex.getAbility(eventData.abilities[0]).name;
					if (set.ability !== requiredAbility) {
						if (fastReturn) return true;
						problems.push(`${name} must have ${requiredAbility}${etc}.`);
					}
				} else {
					// has evolved
					let ability1 = dex.getAbility(eventTemplate.abilities['1']);
					if (ability1.gen && eventData.generation >= ability1.gen) {
						// pokemon had 2 available abilities in the gen the event happened
						// ability is restricted to a single ability slot
						const requiredAbilitySlot = (toId(eventData.abilities[0]) === ability1.id ? 1 : 0);
						const requiredAbility = dex.getAbility(template.abilities[requiredAbilitySlot] || template.abilities['0']).name;
						if (set.ability !== requiredAbility) {
							const originalAbility = dex.getAbility(eventData.abilities[0]).name;
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
		}
		if (!problems.length) return;
		return problems;
	}

	/**
	 * @param {Move} move
	 * @param {Template} species
	 * @param {PokemonSources} lsetData
	 * @param {AnyObject} set
	 * @return {{type: string, [any: string]: any} | false}
	 */
	checkLearnset(move, species, lsetData = {sources: [], sourcesBefore: this.dex.gen}, set = {}) {
		let dex = this.dex;

		let moveid = toId(move);
		if (moveid === 'constructor') return {type: 'invalid'};
		move = dex.getMove(moveid);
		/** @type {?Template} */
		let template = dex.getTemplate(species);

		let format = this.format;
		let ruleTable = dex.getRuleTable(format);
		let alreadyChecked = {};
		let level = set.level || 100;

		let incompatibleAbility = false;
		let isHidden = false;
		if (set.ability && dex.getAbility(set.ability).name === template.abilities['H']) isHidden = true;

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
		let sources = /** @type {PokemonSource[]} */ ([]);
		// the equivalent of adding "every source at or before this gen" to sources
		let sourcesBefore = 0;

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
		const noFutureGen = !ruleTable.has('allowtradeback');
		/**
		 * If a move can only be learned from a gen 2-5 egg, we have to check chainbreeding validity
		 * limitedEgg is false if there are any legal non-egg sources for the move, and true otherwise
		 */
		let limitedEgg = null;

		let tradebackEligible = false;
		while (template && template.species && !alreadyChecked[template.speciesid]) {
			alreadyChecked[template.speciesid] = true;
			if (dex.gen === 2 && template.gen === 1) tradebackEligible = true;
			// STABmons hack to avoid copying all of validateSet to formats
			// @ts-ignore
			let noLearn = format.noLearn || dex.getFormat('gen7stabmons').noLearn;
			if (ruleTable.has('ignorestabmoves') && !noLearn.includes(move.name) && !move.isZ) {
				let types = template.types;
				if (template.baseSpecies === 'Rotom') types = ['Electric', 'Ghost', 'Fire', 'Water', 'Ice', 'Flying', 'Grass'];
				if (template.baseSpecies === 'Shaymin') types = ['Grass', 'Flying'];
				if (template.baseSpecies === 'Hoopa') types = ['Psychic', 'Ghost', 'Dark'];
				if (template.baseSpecies === 'Oricorio') types = ['Fire', 'Flying', 'Electric', 'Psychic', 'Ghost'];
				if (template.baseSpecies === 'Arceus' || template.baseSpecies === 'Silvally' || types.includes(move.type)) return false;
			}
			if (!template.learnset) {
				if (template.baseSpecies !== template.species) {
					// forme without its own learnset
					template = dex.getTemplate(template.baseSpecies);
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
					if (move.noSketch || move.isZ) return {type: 'invalid'};
					lset = template.learnset['sketch'];
					sketch = true;
				}
				if (typeof lset === 'string') lset = [lset];

				for (let learned of lset) {
					// Every `learned` represents a single way a pokemon might
					// learn a move. This can be handled one of several ways:
					// `continue`
					//   means we can't learn it
					// `return false`
					//   means we can learn it with no restrictions
					//   (there's a way to just teach any pokemon of this species
					//   the move in the current gen, like a TM.)
					// `sources.push(source)`
					//   means we can learn it only if obtained that exact way described
					//   in source
					// `sourcesBefore = Math.max(sourcesBefore, learnedGen)`
					//   means we can learn it only if obtained at or before learnedGen
					//   (i.e. get the pokemon however you want, transfer to that gen,
					//   teach it, and transfer it to the current gen.)

					let learnedGen = parseInt(learned.charAt(0));
					if (learnedGen < minPastGen) continue;
					if (noFutureGen && learnedGen > dex.gen) continue;

					// redundant
					if (learnedGen <= sourcesBefore) continue;

					if (learnedGen < 7 && isHidden && !dex.mod('gen' + learnedGen).getTemplate(template.species).abilities['H']) {
						// check if the Pokemon's hidden ability was available
						incompatibleAbility = true;
						continue;
					}
					if (!template.isNonstandard) {
						// HMs can't be transferred
						if (dex.gen >= 4 && learnedGen <= 3 && ['cut', 'fly', 'surf', 'strength', 'flash', 'rocksmash', 'waterfall', 'dive'].includes(moveid)) continue;
						if (dex.gen >= 5 && learnedGen <= 4 && ['cut', 'fly', 'surf', 'strength', 'rocksmash', 'waterfall', 'rockclimb'].includes(moveid)) continue;
						// Defog and Whirlpool can't be transferred together
						if (dex.gen >= 5 && ['defog', 'whirlpool'].includes(moveid) && learnedGen <= 4) blockedHM = true;
					}

					if (learned.charAt(1) === 'L') {
						// special checking for level-up moves
						if (level >= parseInt(learned.substr(2)) || learnedGen >= 7) {
							// we're past the required level to learn it
							// (gen 7 level-up moves can be relearnered at any level)
							// falls through to LMT check below
						} else if (level >= 5 && learnedGen === 3 && template.eggGroups && template.eggGroups[0] !== 'Undiscovered') {
							// Pomeg Glitch
						} else if ((!template.gender || template.gender === 'F') && learnedGen >= 2) {
							// available as egg move
							learned = learnedGen + 'Eany';
							limitedEgg = false;
							// falls through to E check below
						} else {
							// this move is unavailable, skip it
							continue;
						}
					}

					if ('LMT'.includes(learned.charAt(1))) {
						if (learnedGen === dex.gen) {
							// current-gen level-up, TM or tutor moves:
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
						if (eggGroups[0] === 'Undiscovered') eggGroups = dex.getTemplate(template.evos[0]).eggGroups;
						let atLeastOne = false;
						let fromSelf = (learned.substr(1) === 'Eany');
						let eggGroupsSet = new Set(eggGroups);
						learned = learned.substr(0, 2);
						// loop through pokemon for possible fathers to inherit the egg move from
						for (let fatherid in dex.data.Pokedex) {
							let father = dex.getTemplate(fatherid);
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
			if (ruleTable.has('mimicglitch') && template.gen < 5) {
				// include the Mimic Glitch when checking this mon's learnset
				let glitchMoves = ['metronome', 'copycat', 'transform', 'mimic', 'assist'];
				let getGlitch = false;
				for (const i of glitchMoves) {
					if (template.learnset[i]) {
						if (!(i === 'mimic' && dex.getAbility(set.ability).gen === 4 && !template.prevo)) {
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
			if (template.species === 'Lycanroc-Dusk') {
				template = dex.getTemplate('Rockruff-Dusk');
			} else if (template.prevo) {
				template = dex.getTemplate(template.prevo);
				if (template.gen > Math.max(2, dex.gen)) template = null;
				if (template && !template.abilities['H']) isHidden = false;
			} else if (template.baseSpecies !== template.species && template.baseSpecies === 'Rotom') {
				// only Rotom inherit learnsets from base
				template = dex.getTemplate(template.baseSpecies);
			} else {
				template = null;
			}
		}

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
			return {type: 'invalid'};
		}
		if (sourcesBefore || lsetData.sourcesBefore) {
			// having sourcesBefore is the equivalent of having everything before that gen
			// in sources, so we fill the other array in preparation for intersection
			if (sourcesBefore > lsetData.sourcesBefore) {
				for (const oldSource of lsetData.sources) {
					const oldSourceGen = parseInt(oldSource.charAt(0));
					if (oldSourceGen <= sourcesBefore) {
						sources.push(oldSource);
					}
				}
			} else if (lsetData.sourcesBefore > sourcesBefore) {
				for (const source of sources) {
					const sourceGen = parseInt(source.charAt(0));
					if (sourceGen <= lsetData.sourcesBefore) {
						lsetData.sources.push(source);
					}
				}
			}
			lsetData.sourcesBefore = sourcesBefore = Math.min(sourcesBefore, lsetData.sourcesBefore);
		}
		if (lsetData.sources.length) {
			if (sources.length) {
				let sourcesSet = new Set(sources);
				let intersectSources = lsetData.sources.filter(source => sourcesSet.has(source));
				lsetData.sources = intersectSources;
			} else {
				lsetData.sources = [];
			}
		}
		if (!lsetData.sources.length && !sourcesBefore) {
			return {type:'incompatible'};
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

	/**
	 * @param {Template} template
	 */
	static hasLegendaryIVs(template) {
		return ((template.eggGroups[0] === 'Undiscovered' || template.species === 'Manaphy') && !template.prevo && !template.nfe &&
			template.species !== 'Unown' && template.baseSpecies !== 'Pikachu');
	}
	/**
	 * @param {SparseStatsTable? | undefined} [stats]
	 * @param {number} [fillNum]
	 * @return {StatsTable}
	 */
	static fillStats(stats, fillNum = 0) {
		/** @type {StatsTable} */
		let filledStats = {hp: fillNum, atk: fillNum, def: fillNum, spa: fillNum, spd: fillNum, spe: fillNum};
		if (stats) {
			for (const stat in filledStats) {
				// @ts-ignore TypeScript index signature bug
				if (typeof stats[stat] === 'number') filledStats[stat] = stats[stat];
			}
		}
		return filledStats;
	}
}

function getValidator(/** @type {string | Format} */ format) {
	return new Validator(format);
}

const TeamValidator = Object.assign(getValidator, {
	Validator: Validator,
});

module.exports = TeamValidator;
