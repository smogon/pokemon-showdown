'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	pokemon: {
		effectType: 'ValidatorRule',
		name: 'Pokemon',
		onValidateTeam(team, format) {
			let problems = [];
			if (team.length > 6) problems.push('Your team has more than six Pok\u00E9mon.');
			// Unlike Pokemon like Kyurem-B and Kyurem-W, the two Starter Pokemon cannot be hacked onto other games.
			let hasStarter = 0;
			for (const set of team) {
				if (set.species === 'Pikachu-Starter' || set.species === 'Eevee-Starter') {
					hasStarter++;
					if (hasStarter > 1) {
						problems.push(`You can only have one of Pikachu-Starter or Eevee-Starter on a team.`);
						break;
					}
				}
			}
			return problems;
		},
		onChangeSet(set, format) {
			let template = this.getTemplate(set.species);
			let baseTemplate = this.getTemplate(template.baseSpecies);
			let problems = [];
			let allowAVs = !!(format && this.getRuleTable(format).has('allowavs'));
			let allowCAP = !!(format && this.getRuleTable(format).has('allowcap'));

			if (set.species === set.name) delete set.name;
			const validNum = (baseTemplate.num <= 151 && baseTemplate.num >= 1) || [808, 809].includes(baseTemplate.num);
			if (!validNum) {
				problems.push(
					`Only Pok\u00E9mon whose base formes are from Gen 1, Meltan, and Melmetal can be used.`,
					`(${set.species} is from Gen ${baseTemplate.gen === 1 ? 7 : baseTemplate.gen}.)`
				);
			}
			if (template.forme && (!['Alola', 'Mega', 'Mega-X', 'Mega-Y', 'Starter'].includes(template.forme) || template.species === 'Pikachu-Alola')) {
				problems.push(`${set.species}'s forme ${template.forme} is not available in Let's Go.`);
			}
			if (set.moves) {
				for (const moveid of set.moves) {
					let move = this.getMove(moveid);
					if (move.gen > this.gen) {
						problems.push(move.name + ' does not exist in gen ' + this.gen + '.');
					} else if (!allowCAP && move.isNonstandard) {
						problems.push(move.name + ' does not exist.');
					}
				}
			}
			if (set.moves && set.moves.length > 4) {
				problems.push((set.name || set.species) + ' has more than four moves.');
			}
			if (set.level && set.level > 100) {
				problems.push((set.name || set.species) + ' is higher than level 100.');
			}

			if (!allowCAP || !template.tier.startsWith('CAP')) {
				if (template.isNonstandard && template.num > -5000) {
					problems.push(set.species + ' does not exist.');
				}
			}

			if (!allowAVs && set.evs) {
				const statNames = {hp: 'HP', atk: 'Attack', def: 'Defense', spa: 'Special Attack', spd: 'Special Defense', spe: 'Speed'};
				for (let k in set.evs) {
					// @ts-ignore
					if (set.evs[k]) {
						// @ts-ignore
						problems.push(`${set.name || set.species} has ${set.evs[k]} AVs/EVs in ${statNames[k]}, but AVs and EVs are not allowed in this format.`);
						break;
					}
					// @ts-ignore
					set.evs[k] = 0;
				}
			}

			set.ability = 'No Ability';
			// Temporary hack to allow mega evolution
			if (set.item) {
				let item = this.getItem(set.item);
				if (item.megaEvolves !== template.baseSpecies) {
					problems.push(`Items aren't allowed in Let's Go.`);
				}
			}

			if (!set.happiness || set.happiness !== 70) {
				set.happiness = 70;
			}

			// ----------- legality line ------------------------------------------
			if (!this.getRuleTable(format).has('-illegal')) return problems;
			// everything after this line only happens if we're doing legality enforcement

			// Pokestar studios
			if (template.num <= -5000 && template.isNonstandard) {
				problems.push(`${set.species} cannot be obtained by legal means.`);
			}

			// Legendary Pokemon must have at least 3 perfect IVs in gen 6
			if (set.ivs && this.gen >= 6 && (baseTemplate.gen >= 6 || format.requirePentagon) && (template.eggGroups[0] === 'Undiscovered' || template.species === 'Manaphy') && !template.prevo && !template.nfe &&
				// exceptions
				template.species !== 'Unown' && template.baseSpecies !== 'Pikachu' && (template.baseSpecies !== 'Diancie' || !set.shiny)) {
				let perfectIVs = 0;
				for (let i in set.ivs) {
					// @ts-ignore
					if (set.ivs[i] >= 31) perfectIVs++;
				}
				let reason = (format.requirePentagon ? " and this format requires gen " + this.gen + " Pokémon" : " in gen 6");
				if (perfectIVs < 3) problems.push((set.name || set.species) + " must have at least three perfect IVs because it's a legendary" + reason + ".");
			}

			// limit one of each move
			let moves = [];
			if (set.moves) {
				/**@type {{[k: string]: true}} */
				let hasMove = {};
				for (const moveId of set.moves) {
					let move = this.getMove(moveId);
					let moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(moveId);
				}
			}
			set.moves = moves;

			let battleForme = template.battleOnly && template.species;
			if (battleForme) {
				if (template.isMega) set.species = template.baseSpecies;
				if (template.requiredMove && !set.moves.includes(toId(template.requiredMove))) {
					problems.push(`${template.species} transforms in-battle with ${template.requiredMove}.`); // Meloetta-Pirouette, Rayquaza-Mega
				}
			} else {
				if (template.requiredMove && !set.moves.includes(toId(template.requiredMove))) {
					problems.push(`${(set.name || set.species)} needs to have the move ${template.requiredMove}.`); // Keldeo-Resolute
				}
			}

			return problems;
		},
	},
	allowavs: {
		effectType: 'ValidatorRule',
		name: 'Allow AVs',
		desc: "Tells formats with the 'letsgo' mod to take Awakening Values into consideration when calculating stats",
		onChangeSet(set, format) {
			/**@type {string[]} */
			let problems = ([]);
			let avs = /** @type {StatsTable} */(this.getAwakeningValues(set));
			if (set.evs) {
				for (let k in set.evs) {
					// @ts-ignore
					avs[k] = set.evs[k];
					// @ts-ignore
					if (typeof avs[k] !== 'number' || avs[k] < 0) {
						// @ts-ignore
						avs[k] = 0;
					}
				}
			}

			// Pokemon cannot have more than 200 Awakening Values in a stat. It is impossible to hack more than 200 AVs onto a stat, so legality doesn't matter.
			for (let av in avs) {
				let statNames = {hp: 'HP', atk: 'Attack', def: 'Defense', spa: 'Special Attack', spd: 'Special Defense', spe: 'Speed'};
				// @ts-ignore
				if (avs[av] > 200) {
					// @ts-ignore
					problems.push(`${set.name || set.species} has more than 200 Awakening Values in its ${statNames[av]}.`);
				}
			}
			return problems;
		},
		// Partially implemented in the modified pokemon rule above
	},
};

exports.BattleFormats = BattleFormats;
