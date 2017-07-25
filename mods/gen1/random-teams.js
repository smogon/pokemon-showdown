'use strict';

const RandomGen2Teams = require('../../mods/gen2/random-teams');

class RandomGen1Teams extends RandomGen2Teams {
	// Challenge Cup or CC teams are basically fully random teams.
	randomCCTeam(side) {
		let team = [];

		let hasDexNumber = {};
		let formes = [[], [], [], [], [], []];

		// Pick six random Pokémon, no repeats.
		let num;
		for (let i = 0; i < 6; i++) {
			do {
				num = this.random(151) + 1;
			} while (num in hasDexNumber);
			hasDexNumber[num] = i;
		}

		let formeCounter = 0;
		for (let id in this.data.Pokedex) {
			if (!(this.data.Pokedex[id].num in hasDexNumber)) continue;
			let template = this.getTemplate(id);
			if (!template.learnset || template.forme) continue;
			formes[hasDexNumber[template.num]].push(template.species);
			if (++formeCounter >= 6) {
				// Gen 1 had no alternate formes, so we can break out of the loop already.
				break;
			}
		}

		for (let i = 0; i < 6; i++) {
			// Choose forme.
			let poke = formes[i][this.random(formes[i].length)];
			let template = this.getTemplate(poke);

			// Level balance: calculate directly from stats rather than using some silly lookup table.
			let mbstmin = 1307;
			let stats = template.baseStats;

			// Modified base stat total assumes 15 DVs, 255 EVs in every stat
			let mbst = (stats["hp"] * 2 + 30 + 63 + 100) + 10;
			mbst += (stats["atk"] * 2 + 30 + 63 + 100) + 5;
			mbst += (stats["def"] * 2 + 30 + 63 + 100) + 5;
			mbst += (stats["spa"] * 2 + 30 + 63 + 100) + 5;
			mbst += (stats["spd"] * 2 + 30 + 63 + 100) + 5;
			mbst += (stats["spe"] * 2 + 30 + 63 + 100) + 5;

			let level = Math.floor(100 * mbstmin / mbst); // Initial level guess will underestimate

			while (level < 100) {
				mbst = Math.floor((stats["hp"] * 2 + 30 + 63 + 100) * level / 100 + 10);
				mbst += Math.floor(((stats["atk"] * 2 + 30 + 63 + 100) * level / 100 + 5) * level / 100); //since damage is roughly proportional to lvl
				mbst += Math.floor((stats["def"] * 2 + 30 + 63 + 100) * level / 100 + 5);
				mbst += Math.floor(((stats["spa"] * 2 + 30 + 63 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats["spd"] * 2 + 30 + 63 + 100) * level / 100 + 5);
				mbst += Math.floor((stats["spe"] * 2 + 30 + 63 + 100) * level / 100 + 5);

				if (mbst >= mbstmin) break;
				level++;
			}

			// Random DVs.
			let ivs = {
				hp: 0,
				atk: this.random(15),
				def: this.random(15),
				spa: this.random(15),
				spd: 0,
				spe: this.random(15),
			};
			ivs["hp"] = (ivs["atk"] % 2) * 16 + (ivs["def"] % 2) * 8 + (ivs["spe"] % 2) * 4 + (ivs["spa"] % 2) * 2;
			ivs["atk"] = ivs["atk"] * 2;
			ivs["def"] = ivs["def"] * 2;
			ivs["spa"] = ivs["spa"] * 2;
			ivs["spd"] = ivs["spa"];
			ivs["spe"] = ivs["spe"] * 2;

			// Maxed EVs.
			let evs = {hp: 255, atk: 255, def: 255, spa: 255, spd: 255,	spe: 255};

			// Four random unique moves from movepool. don't worry about "attacking" or "viable".
			// Since Gens 1 and 2 learnsets are shared, we need to weed out Gen 2 moves.
			let moves;
			let pool = [];
			for (let move in template.learnset) {
				if (this.getMove(move).gen !== 1) continue;
				if (template.learnset[move].some(learned => learned[0] === '1')) {
					pool.push(move);
				}
			}
			if (pool.length <= 4) {
				moves = pool;
			} else {
				moves = [this.sampleNoReplace(pool), this.sampleNoReplace(pool), this.sampleNoReplace(pool), this.sampleNoReplace(pool)];
			}

			team.push({
				name: poke,
				moves: moves,
				ability: 'None',
				evs: evs,
				ivs: ivs,
				item: '',
				level: level,
				happiness: 0,
				shiny: false,
				nature: 'Serious',
			});
		}

		return team;
	}
	// Random team generation for Gen 1 Random Battles.
	randomTeam(side) {
		// Get what we need ready.
		let pokemonLeft = 0;
		let pokemon = [];

		let handicapMons = {'magikarp':1, 'weedle':1, 'kakuna':1, 'caterpie':1, 'metapod':1};
		let nuTiers = {'UU':1, 'BL':1, 'NFE':1, 'LC':1, 'NU':1};
		let uuTiers = {'NFE':1, 'UU':1, 'BL':1, 'NU':1};

		let n = 1;
		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			// FIXME: Not ES-compliant
			if (n++ > 151 || !this.data.FormatsData[id].randomBattleMoves) continue;
			pokemonPool.push(id);
		}

		// Now let's store what we are getting.
		let typeCount = {};
		let weaknessCount = {'Electric':0, 'Psychic':0, 'Water':0, 'Ice':0, 'Ground':0};
		let uberCount = 0;
		let nuCount = 0;
		let hasShitmon = false;

		while (pokemonPool.length && pokemonLeft < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Bias the tiers so you get less shitmons and only one of the two Ubers.
			// If you have a shitmon, don't get another
			if ((template.speciesid in handicapMons) && hasShitmon) continue;

			let tier = template.tier;
			switch (tier) {
			case 'LC':
			case 'NFE':
				// Don't add pre-evo mon if already 4 or more non-OUs, or if already 3 or more non-OUs with one being a shitmon
				// Regardless, pre-evo mons are slightly less common.
				if (nuCount > 3 || (hasShitmon && nuCount > 2) || this.random(3) === 0) continue;
				break;
			case 'Uber':
				// If you have one of the worst mons we allow luck to give you all Ubers.
				if (uberCount >= 1 && !hasShitmon) continue;
				break;
			default:
				// OUs are fine. Otherwise 50% chance to skip mon if already 4 or more non-OUs.
				if (uuTiers[tier] && pokemonPool.length > 1 && (nuCount > 3 && this.random(2) >= 1)) continue;
			}

			let skip = false;

			// Limit 2 of any type as well. Diversity and minor weakness count.
			// The second of a same type has halved chance of being added.
			let types = template.types;
			for (let t = 0; t < types.length; t++) {
				if (typeCount[types[t]] > 1 || (typeCount[types[t]] === 1 && this.random(2) && pokemonPool.length > 1)) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			// We need a weakness count of spammable attacks to avoid being swept by those.
			// Spammable attacks are: Thunderbolt, Psychic, Surf, Blizzard, Earthquake.
			let pokemonWeaknesses = [];
			for (let type in weaknessCount) {
				let increaseCount = this.getImmunity(type, template) && this.getEffectiveness(type, template) > 0;
				if (!increaseCount) continue;
				if (weaknessCount[type] >= 2) {
					skip = true;
					break;
				}
				pokemonWeaknesses.push(type);
			}

			if (skip) continue;

			// The set passes the limitations.
			let set = this.randomSet(template, pokemon.length);
			pokemon.push(set);

			// Now let's increase the counters. First, the Pokémon left.
			pokemonLeft++;

			// Type counter.
			for (let t = 0; t < types.length; t++) {
				if (typeCount[types[t]]) {
					typeCount[types[t]]++;
				} else {
					typeCount[types[t]] = 1;
				}
			}

			// Weakness counter.
			for (let t = 0; t < pokemonWeaknesses.length; t++) {
				weaknessCount[pokemonWeaknesses[t]]++;
			}

			// Increment tier bias counters.
			if (tier === 'Uber') {
				uberCount++;
			} else if (nuTiers[tier]) {
				nuCount++;
			}

			// Is it Magikarp or one of the useless bugs?
			if (template.speciesid in handicapMons) hasShitmon = true;
		}

		return pokemon;
	}
	// Random set generation for Gen 1 Random Battles.
	randomSet(template, slot) {
		if (slot === undefined) slot = 1;
		template = this.getTemplate(template);
		if (!template.exists) template = this.getTemplate('pikachu'); // Because Gen 1.

		let movePool = template.randomBattleMoves.slice();
		let moves = [];
		let hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) hasType[template.types[1]] = true;
		let hasMove = {};
		let counter = {};
		// let setupType = '';

		// Moves that boost Attack:
		let PhysicalSetup = {
			swordsdance:1, sharpen:1,
		};
		// Moves which boost Special Attack:
		let SpecialSetup = {
			amnesia:1, growth:1,
		};

		// Either add all moves or add none
		if (template.comboMoves) {
			if (this.random(2) === 0) {
				moves = moves.concat(template.comboMoves);
			}
		}

		// Add one of the semi-mandatory moves
		// Often, these are used so that the Pokemon only gets one of the less useful moves
		if (moves.length < 4 && template.exclusiveMoves) {
			moves.push(template.exclusiveMoves[this.random(template.exclusiveMoves.length)]);
		}

		// Add the mandatory move. SD Mew and Amnesia Snorlax are exceptions.
		if (moves.length < 4 && template.essentialMove) {
			moves.push(template.essentialMove);
		}

		while (moves.length < 4 && movePool.length) {
			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length < 4 && movePool.length) {
				let moveid = this.sampleNoReplace(movePool);
				moves.push(moveid);
			}

			// Only do move choosing if we have backup moves in the pool...
			if (movePool.length) {
				hasMove = {};
				counter = {Physical: 0, Special: 0, Status: 0, physicalsetup: 0, specialsetup: 0};
				for (let k = 0; k < moves.length; k++) {
					let move = this.getMove(moves[k]);
					let moveid = move.id;
					hasMove[moveid] = true;
					if (!move.damage && !move.damageCallback) {
						counter[move.category]++;
					}
					if (PhysicalSetup[moveid]) {
						counter['physicalsetup']++;
					}
					if (SpecialSetup[moveid]) {
						counter['specialsetup']++;
					}
				}

				// if (counter['specialsetup']) {
				// 	setupType = 'Special';
				// } else if (counter['physicalsetup']) {
				// 	setupType = 'Physical';
				// }

				for (let k = 0; k < moves.length; k++) {
					let moveid = moves[k];
					if (moveid === template.essentialMove) continue;
					let move = this.getMove(moveid);
					let rejected = false;
					if (!template.essentialMove || moveid !== template.essentialMove) {
						switch (moveid) {
						// bit redundant to have both, but neither particularly better than the other
						case 'hydropump':
							if (hasMove['surf']) rejected = true;
							break;
						case 'surf':
							if (hasMove['hydropump']) rejected = true;
							break;
						// other redundancies that aren't handled within the movesets themselves
						case 'selfdestruct':
							if (hasMove['rest']) rejected = true;
							break;
						case 'rest':
							if (hasMove['selfdestruct']) rejected = true;
							break;
						case 'sharpen':
						case 'swordsdance':
							if (counter['Special'] > counter['Physical'] || !counter['Physical'] || hasMove['growth']) rejected = true;
							break;
						case 'growth':
							if (counter['Special'] < counter['Physical'] || !counter['Special'] || hasMove['swordsdance']) rejected = true;
							break;
						case 'poisonpowder':
						case 'stunspore':
						case 'sleeppowder':
						case 'toxic':
							if (counter['Status'] > 1) rejected = true;
							break;
						} // End of switch for moveid
					}
					if (rejected) {
						moves.splice(k, 1);
						break;
					}
					counter[move.category]++;
				} // End of for
			} // End of the check for more than 4 moves on moveset.
		}

		let levelScale = {
			LC: 88,
			NFE: 80,
			UU: 74,
			OU: 68,
			Uber: 65,
		};

		let customScale = {
			Mewtwo: 62,
			Caterpie: 99, Metapod: 99, Weedle: 99, Kakuna: 99, Magikarp: 99,
			Ditto: 88,
		};
		let level = levelScale[template.tier] || 80;
		if (customScale[template.name]) level = customScale[template.name];

		return {
			name: template.name,
			moves: moves,
			ability: 'None',
			evs: {hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255},
			ivs: {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30},
			item: '',
			level: level,
			shiny: false,
			gender: false,
		};
	}
}

module.exports = RandomGen1Teams;
