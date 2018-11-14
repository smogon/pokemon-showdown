'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	pokemon: {
		inherit: true,
		onChangeSet: function (set, format) {
			let template = this.getTemplate(set.species);
			let baseTemplate = this.getTemplate(template.baseSpecies);
			let problems = [];
			let totalEV = 0;
			let allowCAP = !!(format && this.getRuleTable(format).has('allowcap'));

			if (set.species === set.name) delete set.name;
			if ((baseTemplate.num > 151 || baseTemplate.num < 1) && ![808, 809].includes(baseTemplate.num) &&
				!['Alola', 'Mega', 'Mega-X', 'Mega-Y', 'Starter'].includes(template.forme)) {
					problems.push(
						`Only Pok\u00E9mon whose base formes are from Gen 1, Meltan, and Melmetal can be used.`,
						`(${baseTemplate.species} is from Gen ${baseTemplate.gen}.)`
					);
				}
			}
			set.ability = 'None';
			set.item = '';
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

			if (set.evs) {
				for (let k in set.evs) {
					// @ts-ignore
					if (typeof set.evs[k] !== 'number' || set.evs[k] < 0) {
						// @ts-ignore
						set.evs[k] = 0;
					}
					// @ts-ignore
					totalEV += set.evs[k];
				}
			}

			// In gen 6, it is impossible to battle other players with pokemon that break the EV limit
			if (totalEV > 510 && this.gen === 6) {
				problems.push((set.name || set.species) + " has more than 510 total EVs.");
			}

			// ----------- legality line ------------------------------------------
			if (!this.getRuleTable(format).has('-illegal')) return problems;
			// everything after this line only happens if we're doing legality enforcement

			// Pokestar studios
			if (template.num <= -5000 && template.isNonstandard) {
				problems.push(`${set.species} cannot be obtained by legal means.`);
			}

			// only in gen 1 and 2 it was legal to max out all EVs
			if (this.gen >= 3 && totalEV > 510) {
				problems.push((set.name || set.species) + " has more than 510 total EVs.");
			}
			set.gender = '';
			set.ability = '';
			set.item = '';

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
				if (!format.noChangeForme) set.species = template.baseSpecies; // Fix battle-only forme
			} else {
				if (template.requiredMove && !set.moves.includes(toId(template.requiredMove))) {
					problems.push(`${(set.name || set.species)} needs to have the move ${template.requiredMove}.`); // Keldeo-Resolute
				}
			}

			if (set.species !== template.species) {
				// Autofixed forme.
				template = this.getTemplate(set.species);

				if (!this.getRuleTable(format).has('ignoreillegalabilities') && !format.noChangeAbility) {
					// Ensure that the ability is (still) legal.
					let legalAbility = false;
					for (let i in template.abilities) {
						// @ts-ignore
						if (template.abilities[i] !== set.ability) continue;
						legalAbility = true;
						break;
					}
					if (!legalAbility) { // Default to first ability.
						set.ability = template.abilities['0'];
					}
				}
			}

			return problems;
		},
	},
};

exports.BattleFormats = BattleFormats;
