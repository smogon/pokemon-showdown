/**
 * Team Validator
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Handles team validation, and specifically learnset checking.
 *
 * @license MIT
 */

import Dex = require('./dex');

export class Validator {
	readonly format: Format;
	readonly dex: ModdedDex;
	readonly ruleTable: RuleTable;

	constructor(format: string | Format) {
		this.format = Dex.getFormat(format);
		this.dex = Dex.forFormat(this.format);
		this.ruleTable = this.dex.getRuleTable(this.format);
	}

	validateTeam(team: PokemonSet[] | null, removeNicknames: boolean = false): string[] | null {
		if (team && this.format.validateTeam) {
			return this.format.validateTeam.call(this, team, removeNicknames) || null;
		}
		return this.baseValidateTeam(team, removeNicknames);
	}

	baseValidateTeam(team: PokemonSet[] | null, removeNicknames = false): string[] | null {
		const format = this.format;
		const dex = this.dex;

		let problems: string[] = [];
		const ruleTable = this.ruleTable;
		if (format.team) {
			return null;
		}
		if (!team || !Array.isArray(team)) {
			if (format.canUseRandomTeam) {
				return null;
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

		const teamHas: {[k: string]: number} = {};
		for (const set of team) {
			if (!set) return [`You sent invalid team data. If you're not using a custom client, please report this as a bug.`];
			const setProblems = (format.validateSet || this.validateSet).call(this, set, teamHas);
			if (setProblems) {
				problems = problems.concat(setProblems);
			}
			if (removeNicknames) set.name = dex.getTemplate(set.species).baseSpecies;
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

		for (const rule of ruleTable.keys()) {
			const subformat = dex.getFormat(rule);
			if (subformat.onValidateTeam && ruleTable.has(subformat.id)) {
				problems = problems.concat(subformat.onValidateTeam.call(dex, team, format, teamHas) || []);
			}
		}
		if (format.onValidateTeam) {
			problems = problems.concat(format.onValidateTeam.call(dex, team, format, teamHas) || []);
		}

		if (!problems.length) return null;
		return problems;
	}

	validateSet(set: PokemonSet, teamHas: AnyObject): string[] | null {
		const format = this.format;
		const dex = this.dex;

		let problems: string[] = [];
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

		const maxLevel = format.maxLevel || 100;
		const maxForcedLevel = format.maxForcedLevel || maxLevel;
		let forcedLevel: number | null = null;
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

		const nameTemplate = dex.getTemplate(set.name);
		if (nameTemplate.exists && nameTemplate.name.toLowerCase() === set.name.toLowerCase()) {
			// Name must not be the name of another pokemon
			set.name = '';
		}
		set.name = set.name || template.baseSpecies;
		let name = set.species;
		if (set.species !== set.name && template.baseSpecies !== set.name) name = `${set.name} (${set.species})`;
		let isHidden = false;
		const lsetData: PokemonSources = {sources: [], sourcesBefore: dex.gen};

		const setHas: {[k: string]: true} = {};
		const ruleTable = this.ruleTable;

		for (const [rule] of ruleTable) {
			const subformat = dex.getFormat(rule);
			if (subformat.onChangeSet && ruleTable.has(subformat.id)) {
				problems = problems.concat(subformat.onChangeSet.call(dex, set, format, setHas, teamHas) || []);
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
				problems.push(`${name}'s nature is invalid.`);
			}
		}
		if (set.happiness !== undefined && isNaN(set.happiness)) {
			problems.push(`${name} has an invalid happiness.`);
		}
		if (set.hpType && (!dex.getType(set.hpType).exists || ['normal', 'fairy'].includes(toId(set.hpType)))) {
			problems.push(`${name}'s Hidden Power type (${set.hpType}) is invalid.`);
		}

		let banReason = ruleTable.check('pokemon:' + template.id, setHas);
		let templateOverride = ruleTable.has('+pokemon:' + template.id);
		if (!templateOverride) {
			banReason = banReason || ruleTable.check('basepokemon:' + toId(template.baseSpecies), setHas);
		}
		if (banReason) {
			return [`${set.species} is ${banReason}.`];
		}
		templateOverride = templateOverride || ruleTable.has('+basepokemon:' + toId(template.baseSpecies));
		let postMegaTemplate = template;
		if (item.megaEvolves === template.species) {
			if (!item.megaStone) throw new Error(`Item ${item.name} has no base form for mega evolution`);
			postMegaTemplate = dex.getTemplate(item.megaStone);
		}
		if (['Mega', 'Mega-X', 'Mega-Y'].includes(postMegaTemplate.forme)) {
			templateOverride = ruleTable.has('+pokemon:' + postMegaTemplate.id);
			banReason = ruleTable.check('pokemon:' + postMegaTemplate.id, setHas);
			if (banReason) {
				problems.push(`${postMegaTemplate.species} is ${banReason}.`);
			} else if (!templateOverride) {
				banReason = ruleTable.check('pokemontag:mega', setHas);
				if (banReason) problems.push(`Mega evolutions are ${banReason}.`);
			}
		}
		if (!templateOverride) {
			if (ruleTable.has('-unreleased') && postMegaTemplate.isUnreleased) {
				problems.push(`${name} (${postMegaTemplate.species}) is unreleased.`);
			} else if (postMegaTemplate.tier) {
				let tag = postMegaTemplate.tier === '(PU)' ? 'ZU' : postMegaTemplate.tier;
				banReason = ruleTable.check('pokemontag:' + toId(tag), setHas);
				if (banReason) {
					problems.push(`${postMegaTemplate.species} is in ${tag}, which is ${banReason}.`);
				} else if (postMegaTemplate.doublesTier) {
					tag = postMegaTemplate.doublesTier === '(DUU)' ? 'DNU' : postMegaTemplate.doublesTier;
					banReason = ruleTable.check('pokemontag:' + toId(tag), setHas);
					if (banReason) {
						problems.push(`${postMegaTemplate.species} is in ${tag}, which is ${banReason}.`);
					}
				}
			}
		}

		banReason = ruleTable.check('ability:' + toId(set.ability), setHas);
		if (banReason) {
			problems.push(`${name}'s ability ${set.ability} is ${banReason}.`);
		}
		banReason = ruleTable.check('item:' + toId(set.item), setHas);
		if (banReason) {
			problems.push(`${name}'s item ${set.item} is ${banReason}.`);
		}
		if (ruleTable.has('-unreleased') && item.isUnreleased && !ruleTable.has('+item:' + item.id)) {
			problems.push(`${name}'s item ${set.item} is unreleased.`);
		}

		if (!set.ability) set.ability = 'No Ability';
		setHas[toId(set.ability)] = true;
		if (ruleTable.has('-illegal')) {
			// Don't check abilities for metagames with All Abilities
			if (dex.gen <= 2) {
				set.ability = 'No Ability';
			} else if (!ruleTable.has('ignoreillegalabilities')) {
				if (!ability.name) {
					problems.push(`${name} needs to have an ability.`);
				} else if (!Object.values(template.abilities).includes(ability.name)) {
					problems.push(`${name} can't have ${set.ability}.`);
				}
				if (ability.name === template.abilities['H']) {
					isHidden = true;

					if (template.unreleasedHidden && ruleTable.has('-unreleased')) {
						problems.push(`${name}'s Hidden Ability is unreleased.`);
					} else if (['entei', 'suicune', 'raikou'].includes(template.id) && format.requirePlus) {
						problems.push(`${name}'s Hidden Ability is only available from Virtual Console, which is not allowed in this format.`);
					} else if (dex.gen === 6 && ability.name === 'Symbiosis' &&
						(set.species.endsWith('Orange') || set.species.endsWith('White'))) {
						problems.push(`${name}'s Hidden Ability is unreleased for the Orange and White forms.`);
					} else if (dex.gen === 5 && set.level < 10 && (template.maleOnlyHidden || template.gender === 'N')) {
						problems.push(`${name} must be at least level 10 with its Hidden Ability.`);
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
			set.moves = [];
		}
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
		let ivs: StatsTable = set.ivs;
		const maxedIVs = Object.values(ivs).every(stat => stat === 31);

		let lsetProblem = null;
		for (const moveName of set.moves) {
			if (!moveName) continue;
			const move = dex.getMove(Dex.getString(moveName));
			if (!move.exists) return [`"${move.name}" is an invalid move.`];
			banReason = ruleTable.check('move:' + move.id, setHas);
			if (banReason) {
				problems.push(`${name}'s move ${move.name} is ${banReason}.`);
			}

			// Note that we don't error out on multiple Hidden Power types
			// That is checked in rulesets.js rule Pokemon
			if (move.id === 'hiddenpower' && move.type !== 'Normal' && !set.hpType) {
				set.hpType = move.type;
			}

			if (ruleTable.has('-unreleased')) {
				if (move.isUnreleased && !ruleTable.has('+move:' + move.id)) {
					problems.push(`${name}'s move ${move.name} is unreleased.`);
				}
			}

			if (ruleTable.has('-illegal')) {
				const checkLearnset = (ruleTable.checkLearnset && ruleTable.checkLearnset[0] || this.checkLearnset);
				lsetProblem = checkLearnset.call(this, move, template, lsetData, set);
				if (lsetProblem) {
					lsetProblem.moveName = move.name;
					break;
				}
			}
		}

		const canBottleCap = (dex.gen >= 7 && set.level === 100);
		if (set.hpType && maxedIVs && ruleTable.has('pokemon')) {
			if (dex.gen <= 2) {
				const HPdvs = dex.getType(set.hpType).HPdvs;
				ivs = set.ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};
				let statName: StatName;
				for (statName in HPdvs) {
					ivs[statName] = HPdvs[statName]! * 2;
				}
				ivs.hp = -1;
			} else if (!canBottleCap) {
				ivs = set.ivs = Validator.fillStats(dex.getType(set.hpType).HPivs, 31);
			}
		}
		if (set.hpType === 'Fighting' && ruleTable.has('pokemon')) {
			if (template.gen >= 6 && template.eggGroups[0] === 'Undiscovered' && !template.nfe &&
				(template.baseSpecies !== 'Diancie' || !set.shiny)) {
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
			const evTotal = (set.evs.hp || 0) + (set.evs.atk || 0) + (set.evs.def || 0) +
				(set.evs.spa || 0) + (set.evs.spd || 0) + (set.evs.spe || 0);
			if (evTotal === 508 || evTotal === 510) {
				problems.push(`${name} has exactly 510 EVs, but this format does not restrict you to 510 EVs: you can max out every EV (If this was intentional, add exactly 1 to one of your EVs, which won't change its stats but will tell us that it wasn't a mistake).`);
			}
		}
		const noEVs = (!set.evs || !Object.values(set.evs).some(value => value > 0));
		if (noEVs && !format.debug && !format.id.includes('letsgo')) {
			problems.push(`${name} has exactly 0 EVs - did you forget to EV it? (If this was intentional, add exactly 1 to one of your EVs, which won't change its stats but will tell us that it wasn't a mistake).`);
		}

		lsetData.isHidden = isHidden;
		const lsetProblems = this.reconcileLearnset(template, lsetData, lsetProblem, name);
		if (lsetProblems) problems.push(...lsetProblems);

		if (!lsetData.sourcesBefore && lsetData.sources.length &&
				lsetData.sources.every(source => 'SVD'.includes(source.charAt(1)))) {
			// Every source is restricted
			let legal = false;
			for (const source of lsetData.sources) {
				if (this.validateSource(set, source, template)) continue;
				legal = true;
				break;
			}

			if (!legal) {
				if (lsetData.sources.length > 1) {
					problems.push(`${name} has an event-exclusive move that it doesn't qualify for (only one of several ways to get the move will be listed):`);
				}
				const eventProblems = this.validateSource(
					set, lsetData.sources[0], template, ` because it has a move only available`
				);
				// @ts-ignore validateEvent must have returned an array because it was passed a because param
				if (eventProblems) problems.push(...eventProblems);
			}
		} else if (ruleTable.has('-illegal') && template.eventOnly) {
			const eventTemplate = !template.learnset && template.baseSpecies !== template.species &&
				template.id !== 'zygarde10' ? dex.getTemplate(template.baseSpecies) : template;
			const eventPokemon = eventTemplate.eventPokemon;
			if (!eventPokemon) throw new Error(`Event-only template ${template.species} has no eventPokemon table`);
			let legal = false;
			for (const eventData of eventPokemon) {
				if (this.validateEvent(set, eventData, eventTemplate)) continue;
				legal = true;
				break;
			}
			if (!legal && template.id === 'celebi' && dex.gen >= 7 && !this.validateSource(set, '7V', template)) {
				legal = true;
			}
			if (!legal) {
				if (eventPokemon.length === 1) {
					problems.push(`${template.species} is only obtainable from an event - it needs to match its event:`);
				} else {
					problems.push(`${template.species} is only obtainable from events - it needs to match one of its events, such as:`);
				}
				let eventInfo = eventPokemon[0];
				const minPastGen = (format.requirePlus ? 7 : format.requirePentagon ? 6 : 1);
				let eventNum = 1;
				for (const [i, eventData] of eventPokemon.entries()) {
					if (eventData.generation <= dex.gen && eventData.generation >= minPastGen) {
						eventInfo = eventData;
						eventNum = i + 1;
						break;
					}
				}
				const eventName = eventPokemon.length > 1 ? ` #${eventNum}` : ``;
				const eventProblems = this.validateEvent(set, eventInfo, eventTemplate, ` to be`, `from its event${eventName}`);
				// @ts-ignore validateEvent must have returned an array because it was passed a because param
				if (eventProblems) problems.push(...eventProblems);
			}
		}
		if (ruleTable.has('-illegal') && set.level < (template.evoLevel || 0)) {
			// FIXME: Event pokemon given at a level under what it normally can be attained at gives a false positive
			problems.push(`${name} must be at least level ${template.evoLevel} to be evolved.`);
		}
		if (ruleTable.has('-illegal') && template.id === 'keldeo' && set.moves.includes('secretsword') &&
			(format.requirePlus || format.requirePentagon)) {
			problems.push(`${name} has Secret Sword, which is only compatible with Keldeo-Ordinary obtained from Gen 5.`);
		}
		const hasGen3moves = !lsetData.sources && lsetData.sourcesBefore <= 3;
		if (hasGen3moves && dex.getAbility(set.ability).gen === 4 && !template.prevo && dex.gen <= 5) {
			problems.push(`${name} has a gen 4 ability and isn't evolved - it can't use moves from gen 3.`);
		}
		if (!lsetData.sources && lsetData.sourcesBefore < 6 && lsetData.sourcesBefore >= 3 &&
			(isHidden || dex.gen <= 5) && template.gen <= lsetData.sourcesBefore) {
			const oldAbilities = dex.mod('gen' + lsetData.sourcesBefore).getTemplate(set.species).abilities;
			if (ability.name !== oldAbilities['0'] && ability.name !== oldAbilities['1'] && !oldAbilities['H']) {
				problems.push(`${name} has moves incompatible with its ability.`);
			}
		}

		if (teamHas) {
			for (const i in setHas) {
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
				if (setHas[ban]) count++;
			}
			if (limit && count > limit) {
				const clause = source ? ` by ${source}` : ``;
				problems.push(`${name} is limited to ${limit} of ${rule}${clause}.`);
			} else if (!limit && count >= bans.length) {
				const clause = source ? ` by ${source}` : ``;
				if (source === 'Pokemon') {
					if (ruleTable.has('-illegal')) {
						problems.push(`${name} has the combination of ${rule}, which is impossible to obtain legitimately.`);
					}
				} else {
					problems.push(`${name} has the combination of ${rule}, which is banned${clause}.`);
				}
			}
		}

		for (const [rule] of ruleTable) {
			if (rule.startsWith('!')) continue;
			const subformat = dex.getFormat(rule);
			if (subformat.onValidateSet && ruleTable.has(subformat.id)) {
				problems = problems.concat(subformat.onValidateSet.call(dex, set, format, setHas, teamHas) || []);
			}
		}
		if (format.onValidateSet) {
			problems = problems.concat(format.onValidateSet.call(dex, set, format, setHas, teamHas) || []);
		}

		if (!problems.length) {
			if (forcedLevel) set.level = forcedLevel;
			return null;
		}

		return problems;
	}

	/**
	 * Returns array of error messages if invalid, undefined if valid
	 *
	 * If `because` is not passed, instead returns true if invalid.
	 */
	validateSource(set: PokemonSet, source: PokemonSource, template: Template, because?: string, from?: string) {
		let eventData: EventInfo | null = null;
		let eventTemplate = template;
		if (source.charAt(1) === 'S') {
			const splitSource = source.substr(source.charAt(2) === 'T' ? 3 : 2).split(' ');
			eventTemplate = this.dex.getTemplate(splitSource[1]);
			if (eventTemplate.eventPokemon) eventData = eventTemplate.eventPokemon[parseInt(splitSource[0], 10)];
			if (!eventData) {
				throw new Error(`${eventTemplate.species} from ${template.species} doesn't have data for event ${source}`);
			}
		} else if (source.charAt(1) === 'V') {
			const isMew = template.speciesid === 'mew';
			const isCelebi = template.speciesid === 'celebi';
			eventData = {
				generation: 2,
				level: isMew ? 5 : isCelebi ? 30 : undefined,
				perfectIVs: isMew || isCelebi ? 5 : 3,
				isHidden: true,
				shiny: isMew ? undefined : 1,
				pokeball: 'pokeball',
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
	 */
	validateEvent(set: PokemonSet, eventData: EventInfo, eventTemplate: Template, because = ``, from = `from an event`) {
		const dex = this.dex;
		let name = set.species;
		const template = dex.getTemplate(set.species);
		if (!eventTemplate) eventTemplate = template;
		if (set.name && set.species !== set.name && template.baseSpecies !== set.name) name = `${set.name} (${set.species})`;

		const fastReturn = !because;
		if (eventData.from) from = `from ${eventData.from}`;
		const etc = `${because} ${from}`;

		const problems = [];

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
			const shinyReq = eventData.shiny ? ` be shiny` : ` not be shiny`;
			problems.push(`${name} must${shinyReq}${etc}.`);
		}
		if (eventData.gender) {
			if (set.gender && eventData.gender !== set.gender) {
				if (fastReturn) return true;
				problems.push(`${name}'s gender must be ${eventData.gender}${etc}.`);
			}
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
			const statTable = {
				hp: 'HP', atk: 'Attack', def: 'Defense', spa: 'Special Attack', spd: 'Special Defense', spe: 'Speed',
			};
			let statName: StatName;
			for (statName in eventData.ivs) {
				if (canBottleCap && set.ivs[statName] === 31) continue;
				if (set.ivs[statName] !== eventData.ivs[statName]) {
					if (fastReturn) return true;
					problems.push(`${name} must have ${eventData.ivs[statName]} ${statTable[statName]} IVs${etc}.`);
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
			let statName: StatName;
			for (statName in set.ivs) {
				if (set.ivs[statName] >= 31) perfectIVs++;
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
			} else if (dex.gen >= 3 && requiredIVs >= 5 && set.hpType &&
					!['Dark', 'Dragon', 'Electric', 'Steel', 'Ice'].includes(set.hpType)) {
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
					const ability1 = dex.getAbility(eventTemplate.abilities['1']);
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
		if (problems.length) return problems;
		if (eventData.gender) set.gender = eventData.gender;
	}

	reconcileLearnset(
		species: Template, lsetData: PokemonSources, problem: {type: string, moveName: string, [key: string]: any} | null,
		name: string = species.species
	) {
		const dex = this.dex;
		const problems = [];

		if (problem) {
			let problemString = `${name}'s move ${problem.moveName}`;
			if (problem.type === 'incompatibleAbility') {
				problemString += ` can only be learned in past gens without Hidden Abilities.`;
			} else if (problem.type === 'incompatible') {
				problemString = `${name}'s moves ${(lsetData.restrictiveMoves || []).join(', ')} are incompatible.`;
			} else if (problem.type === 'oversketched') {
				const plural = (parseInt(problem.maxSketches, 10) === 1 ? '' : 's');
				problemString += ` can't be Sketched because it can only Sketch ${problem.maxSketches} move${plural}.`;
			} else if (problem.type === 'pastgen') {
				problemString += ` is not available in generation ${problem.gen} or later.`;
			} else if (problem.type === 'invalid') {
				problemString = `${name} can't learn ${problem.moveName}.`;
			} else {
				throw new Error(`Unrecognized problem ${JSON.stringify(problem)}`);
			}
			problems.push(problemString);
		}

		if (problems.length) return problems;

		if (lsetData.isHidden) {
			lsetData.sources = lsetData.sources.filter(source =>
				parseInt(source.charAt(0), 10) >= 5
			);
			if (lsetData.sourcesBefore < 5) lsetData.sourcesBefore = 0;
			if (!lsetData.sourcesBefore && !lsetData.sources.length) {
				problems.push(`${name} has a hidden ability - it can't have moves only learned before gen 5.`);
				return problems;
			}
		}

		if (lsetData.limitedEgg && lsetData.limitedEgg.length > 1 && !lsetData.sourcesBefore && lsetData.sources) {
			// console.log("limitedEgg 1: " + lsetData.limitedEgg);
			// Multiple gen 2-5 egg moves
			// This code hasn't been closely audited for multi-gen interaction, but
			// since egg moves don't get removed between gens, it's unlikely to have
			// any serious problems.
			const limitedEgg = [...new Set(lsetData.limitedEgg)];
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
					let eggGen = parseInt(source.charAt(0), 10);
					if (source.charAt(1) !== 'E' || eggGen === 6) {
						// (There is a way to obtain this pokemon without past-gen breeding.)
						// In theory, limitedEgg should not exist in this case.
						throw new Error(`invalid limitedEgg on ${name}: ${limitedEgg} with ${source}`);
					}
					if (eggGen === 1) {
						// tradebacks are supported in Gen 2
						eggGen = 2;
					}
					const potentialFather = dex.getTemplate(source.slice(source.charAt(2) === 'T' ? 3 : 2));
					if (potentialFather.id === 'smeargle') {
						validFatherExists = true;
						break;
					}
					if (!potentialFather.learnset) throw new Error(`${potentialFather.species} has no learnset`);
					/**
					 * '' = no sources to worry about
					 * [source string] = one restricted move
					 * '!' = incompatible restricted moves
					 */
					let restrictedSource: string = '';
					// fathers that can't breed with Smeargle might have incompatible egg moves
					const eggsRestricted = !potentialFather.eggGroups.includes('Field');
					for (const moveid of limitedEgg) {
						const fatherSources = potentialFather.learnset[moveid] || potentialFather.learnset['sketch'];
						if (!fatherSources) throw new Error(`Egg move father ${potentialFather.id} can't learn ${moveid}`);
						let bestSource = '!';
						for (const fatherSource of fatherSources) {
							// Triply nested loop! Fortunately, all the loops are designed
							// to be as short as possible.
							if (+fatherSource.charAt(0) > eggGen) continue;
							if (fatherSource.charAt(1) === 'E') {
								if (restrictedSource && (restrictedSource !== fatherSource || eggsRestricted)) {
									continue;
								} else {
									bestSource = fatherSource;
								}
							} else if (fatherSource.charAt(1) === 'S') {
								if (restrictedSource && restrictedSource !== fatherSource) {
									continue;
								} else {
									bestSource = fatherSource;
								}
							} else {
								bestSource = '';
								break;
							}
						}
						if (bestSource === '!') {
							// no match for the current gen; early escape
							restrictedSource = '!';
							break;
						} else if (bestSource !== '') {
							restrictedSource = bestSource;
						}
					}
					if (restrictedSource !== '!') {
						validFatherExists = true;
						// console.log("valid father: " + potentialFather.id);
						break;
					}
				}
				if (!validFatherExists) {
					// Could not find a valid father using our heuristic.
					// TODO: hardcode false positives for our heuristic
					// in theory, this heuristic doesn't have false negatives
					const newSources = [];
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

		if (lsetData.babyOnly && lsetData.sources.length) {
			const babyid = lsetData.babyOnly;
			lsetData.sources = lsetData.sources.filter(source => {
				if (source.charAt(1) === 'S') {
					const sourceSpeciesid = source.split(' ')[1];
					if (sourceSpeciesid !== babyid) return false;
				}
				if (source.startsWith('7E') || source.startsWith('6E')) {
					if (source.length > 2 && source.slice(2) !== babyid) return false;
				}
				return true;
			});
			if (!lsetData.sources.length && !lsetData.sourcesBefore) {
				const babySpecies = dex.getTemplate(babyid).species;
				problems.push(`${name}'s event/egg moves are from an evolution, and are incompatible with its moves from ${babySpecies}.`);
			}
		}

		return problems.length ? problems : null;
	}

	checkLearnset(
		move: Move,
		species: Template,
		lsetData: PokemonSources = {sources: [], sourcesBefore: this.dex.gen},
		set: AnyObject = {}
	): {type: string, [key: string]: any} | null {
		const dex = this.dex;

		const moveid = toId(move);
		if (moveid === 'constructor') return {type: 'invalid'};
		move = dex.getMove(moveid);
		let template: Template | null = dex.getTemplate(species);

		const format = this.format;
		const ruleTable = dex.getRuleTable(format);
		const alreadyChecked: {[k: string]: boolean} = {};
		const level = set.level || 100;

		let incompatibleAbility = false;
		let isHidden = false;
		if (set.ability && dex.getAbility(set.ability).name === template.abilities['H']) isHidden = true;

		let limit1 = true;
		let sketch = false;
		let blockedHM = false;

		let sometimesPossible = false; // is this move in the learnset at all?

		let babyOnly = '';

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
		const sources: PokemonSource[] = [];
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
			const checkingPrevo = template.baseSpecies !== species.baseSpecies;
			if (checkingPrevo && !sources.length && !sourcesBefore) {
				if (!lsetData.babyOnly || !template.prevo) {
					babyOnly = template.speciesid;
				}
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

					const learnedGen = parseInt(learned.charAt(0), 10);
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
						if (dex.gen >= 4 && learnedGen <= 3 &&
							['cut', 'fly', 'surf', 'strength', 'flash', 'rocksmash', 'waterfall', 'dive'].includes(moveid)) continue;
						if (dex.gen >= 5 && learnedGen <= 4 &&
							['cut', 'fly', 'surf', 'strength', 'rocksmash', 'waterfall', 'rockclimb'].includes(moveid)) continue;
						// Defog and Whirlpool can't be transferred together
						if (dex.gen >= 5 && ['defog', 'whirlpool'].includes(moveid) && learnedGen <= 4) blockedHM = true;
					}

					if (learned.charAt(1) === 'L') {
						// special checking for level-up moves
						if (level >= parseInt(learned.substr(2), 10) || learnedGen >= 7) {
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
							if (babyOnly) lsetData.babyOnly = babyOnly;
							return null;
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
						const fromSelf = (learned.substr(1) === 'Eany');
						const eggGroupsSet = new Set(eggGroups);
						learned = learned.substr(0, 2);
						// loop through pokemon for possible fathers to inherit the egg move from
						for (const fatherid in dex.data.Pokedex) {
							const father = dex.getTemplate(fatherid);
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
							const fatherSources = father.learnset[moveid] || father.learnset['sketch'];
							if (!fromSelf && !fatherSources) continue;

							// must be able to breed with father
							if (!father.eggGroups.some(eggGroup => eggGroupsSet.has(eggGroup))) continue;

							// detect unavailable egg moves
							if (noPastGenBreeding && fatherSources) {
								const fatherLatestMoveGen = fatherSources[0].charAt(0);
								if (father.tier.startsWith('Bank') || father.doublesTier.startsWith('Bank') || fatherLatestMoveGen !== '7') {
									continue;
								}
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
						// 	Available as long as the past gen can get the Pokémon and then trade it back.
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
				const glitchMoves = ['metronome', 'copycat', 'transform', 'mimic', 'assist'];
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
				return {type: 'oversketched', maxSketches: 1};
			}
			lsetData.sketchMove = moveid;
		}

		if (blockedHM) {
			// Limit one of Defog/Whirlpool to be transferred
			if (lsetData.hm) return {type: 'incompatible'};
			lsetData.hm = moveid;
		}

		if (!lsetData.restrictiveMoves) {
			lsetData.restrictiveMoves = [];
		}
		lsetData.restrictiveMoves.push(move.name);

		// Now that we have our list of possible sources, intersect it with the current list
		if (!sourcesBefore && !sources.length) {
			if (minPastGen > 1 && sometimesPossible) return {type: 'pastgen', gen: minPastGen};
			if (incompatibleAbility) return {type: 'incompatibleAbility'};
			return {type: 'invalid'};
		}
		if (sourcesBefore || lsetData.sourcesBefore) {
			// having sourcesBefore is the equivalent of having everything before that gen
			// in sources, so we fill the other array in preparation for intersection
			if (sourcesBefore > lsetData.sourcesBefore) {
				for (const oldSource of lsetData.sources) {
					const oldSourceGen = parseInt(oldSource.charAt(0), 10);
					if (oldSourceGen <= sourcesBefore) {
						sources.push(oldSource);
					}
				}
			} else if (lsetData.sourcesBefore > sourcesBefore) {
				for (const source of sources) {
					const sourceGen = parseInt(source.charAt(0), 10);
					if (sourceGen <= lsetData.sourcesBefore) {
						lsetData.sources.push(source);
					}
				}
			}
			lsetData.sourcesBefore = sourcesBefore = Math.min(sourcesBefore, lsetData.sourcesBefore);
		}
		if (lsetData.sources.length) {
			if (sources.length) {
				const sourcesSet = new Set(sources);
				const intersectSources = lsetData.sources.filter(source => sourcesSet.has(source));
				lsetData.sources = intersectSources;
			} else {
				lsetData.sources = [];
			}
		}
		if (!lsetData.sources.length && !sourcesBefore) {
			return {type: 'incompatible'};
		}

		if (limitedEgg) {
			// lsetData.limitedEgg = [moveid] of egg moves with potential breeding incompatibilities
			// 'self' is a possible entry (namely, ExtremeSpeed on Dragonite) meaning it's always
			// incompatible with any other egg move
			if (!lsetData.limitedEgg) lsetData.limitedEgg = [];
			lsetData.limitedEgg.push(limitedEgg === true ? moveid : limitedEgg);
		}

		if (babyOnly) lsetData.babyOnly = babyOnly;
		return null;
	}

	static hasLegendaryIVs(template: Template) {
		return ((template.eggGroups[0] === 'Undiscovered' || template.species === 'Manaphy') &&
			!template.prevo && !template.nfe && template.species !== 'Unown' && template.baseSpecies !== 'Pikachu');
	}

	static fillStats(stats: SparseStatsTable | null, fillNum: number = 0): StatsTable {
		const filledStats: StatsTable = {hp: fillNum, atk: fillNum, def: fillNum, spa: fillNum, spd: fillNum, spe: fillNum};
		if (stats) {
			let statName: StatName;
			for (statName in filledStats) {
				const stat = stats[statName];
				if (typeof stat === 'number') filledStats[statName] = stat;
			}
		}
		return filledStats;
	}
}

function getValidator(format: string | Format) {
	return new Validator(format);
}

export const TeamValidator = Object.assign(getValidator, {
	Validator,
});
