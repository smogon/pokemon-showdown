import RandomGen2Teams from '../gen2/random-teams';

export class RandomGen1Teams extends RandomGen2Teams {
	// Challenge Cup or CC teams are basically fully random teams.
	randomCCTeam() {
		const team = [];

		const hasDexNumber: {[k: string]: number} = {};
		const formes: string[][] = [[], [], [], [], [], []];

		// Pick six random Pokémon, no repeats.
		let num: number;
		for (let i = 0; i < 6; i++) {
			do {
				num = this.random(151) + 1;
			} while (num in hasDexNumber);
			hasDexNumber[num] = i;
		}

		let formeCounter = 0;
		for (const id in this.dex.data.Pokedex) {
			if (!(this.dex.data.Pokedex[id].num in hasDexNumber)) continue;
			const species = this.dex.getSpecies(id);
			const lsetData = this.dex.getLearnsetData(id as ID);
			if (!lsetData.learnset || species.forme) continue;
			formes[hasDexNumber[species.num]].push(species.name);
			if (++formeCounter >= 6) {
				// Gen 1 had no alternate formes, so we can break out of the loop already.
				break;
			}
		}

		for (let i = 0; i < 6; i++) {
			// Choose forme.
			const poke = this.sample(formes[i]);
			const species = this.dex.getSpecies(poke);
			const lsetData = this.dex.getLearnsetData(species.id);

			// Level balance: calculate directly from stats rather than using some silly lookup table.
			const mbstmin = 1307;
			const stats = species.baseStats;

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
				// Since damage is roughly proportional to lvl
				mbst += Math.floor(((stats["atk"] * 2 + 30 + 63 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats["def"] * 2 + 30 + 63 + 100) * level / 100 + 5);
				mbst += Math.floor(((stats["spa"] * 2 + 30 + 63 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats["spd"] * 2 + 30 + 63 + 100) * level / 100 + 5);
				mbst += Math.floor((stats["spe"] * 2 + 30 + 63 + 100) * level / 100 + 5);

				if (mbst >= mbstmin) break;
				level++;
			}

			// Random DVs.
			const ivs = {
				hp: 0,
				atk: this.random(16),
				def: this.random(16),
				spa: this.random(16),
				spd: 0,
				spe: this.random(16),
			};
			ivs["hp"] = (ivs["atk"] % 2) * 16 + (ivs["def"] % 2) * 8 + (ivs["spe"] % 2) * 4 + (ivs["spa"] % 2) * 2;
			ivs["atk"] = ivs["atk"] * 2;
			ivs["def"] = ivs["def"] * 2;
			ivs["spa"] = ivs["spa"] * 2;
			ivs["spd"] = ivs["spa"];
			ivs["spe"] = ivs["spe"] * 2;

			// Maxed EVs.
			const evs = {hp: 255, atk: 255, def: 255, spa: 255, spd: 255,	spe: 255};

			// Four random unique moves from movepool. don't worry about "attacking" or "viable".
			// Since Gens 1 and 2 learnsets are shared, we need to weed out Gen 2 moves.
			let moves;
			const pool: string[] = [];
			if (lsetData.learnset) {
				for (const move in lsetData.learnset) {
					if (this.dex.getMove(move).gen !== 1) continue;
					if (lsetData.learnset[move].some(learned => learned.startsWith('1'))) {
						pool.push(move);
					}
				}
			}
			if (pool.length <= 4) {
				moves = pool;
			} else {
				moves = [
					this.sampleNoReplace(pool), this.sampleNoReplace(pool),
					this.sampleNoReplace(pool), this.sampleNoReplace(pool),
				];
			}

			team.push({
				name: poke,
				species: species.name,
				moves: moves,
				gender: false,
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
	randomTeam() {
		// Get what we need ready.
		let pokemonLeft = 0;
		const pokemon = [];

		const handicapMons = ['magikarp', 'weedle', 'kakuna', 'caterpie', 'metapod'];
		const nuTiers = ['UU', 'UUBL', 'NFE', 'LC', 'NU'];
		const uuTiers = ['NFE', 'UU', 'UUBL', 'NU'];

		const pokemonPool = [];
		for (const id in this.dex.data.FormatsData) {
			const species = this.dex.getSpecies(id);
			if (!species.isNonstandard && species.randomBattleMoves) {
				pokemonPool.push(id);
			}
		}

		// Now let's store what we are getting.
		const typeCount: {[k: string]: number} = {};
		const weaknessCount: {[k: string]: number} = {Electric: 0, Psychic: 0, Water: 0, Ice: 0, Ground: 0};
		let uberCount = 0;
		let nuCount = 0;
		let hasShitmon = false;

		while (pokemonPool.length && pokemonLeft < 6) {
			const species = this.dex.getSpecies(this.sampleNoReplace(pokemonPool));
			if (!species.exists) continue;

			// Bias the tiers so you get less shitmons and only one of the two Ubers.
			// If you have a shitmon, don't get another
			if (handicapMons.includes(species.id) && hasShitmon) continue;

			const tier = species.tier;
			switch (tier) {
			case 'LC':
			case 'NFE':
				// Don't add pre-evo mon if already 4 or more non-OUs, or if already 3 or more non-OUs with one being a shitmon
				// Regardless, pre-evo mons are slightly less common.
				if (nuCount > 3 || (hasShitmon && nuCount > 2) || this.randomChance(1, 3)) continue;
				break;
			case 'Uber':
				// If you have one of the worst mons we allow luck to give you all Ubers.
				if (uberCount >= 1 && !hasShitmon) continue;
				break;
			default:
				// OUs are fine. Otherwise 50% chance to skip mon if already 4 or more non-OUs.
				if (uuTiers.includes(tier) && pokemonPool.length > 1 && (nuCount > 3 && this.randomChance(1, 2))) continue;
			}

			let skip = false;

			// Limit 2 of any type as well. Diversity and minor weakness count.
			// The second of a same type has halved chance of being added.
			for (const type of species.types) {
				if (typeCount[type] > 1 || (typeCount[type] === 1 && this.randomChance(1, 2) && pokemonPool.length > 1)) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			// We need a weakness count of spammable attacks to avoid being swept by those.
			// Spammable attacks are: Thunderbolt, Psychic, Surf, Blizzard, Earthquake.
			const pokemonWeaknesses = [];
			for (const type in weaknessCount) {
				const increaseCount = this.dex.getImmunity(type, species) && this.dex.getEffectiveness(type, species) > 0;
				if (!increaseCount) continue;
				if (weaknessCount[type] >= 2) {
					skip = true;
					break;
				}
				pokemonWeaknesses.push(type);
			}

			if (skip) continue;

			// The set passes the limitations.
			const set = this.randomSet(species);
			pokemon.push(set);

			// Now let's increase the counters. First, the Pokémon left.
			pokemonLeft++;

			// Type counter.
			for (const type of species.types) {
				if (typeCount[type]) {
					typeCount[type]++;
				} else {
					typeCount[type] = 1;
				}
			}

			// Weakness counter.
			for (const weakness of pokemonWeaknesses) {
				weaknessCount[weakness]++;
			}

			// Increment tier bias counters.
			if (tier === 'Uber') {
				uberCount++;
			} else if (nuTiers.includes(tier)) {
				nuCount++;
			}

			// Is it Magikarp or one of the useless bugs?
			if (handicapMons.includes(species.id)) hasShitmon = true;
		}

		return pokemon;
	}

	/**
	 * Random set generation for Gen 1 Random Battles.
	 */
	randomSet(species: string | Species): RandomTeamsTypes.RandomSet {
		species = this.dex.getSpecies(species);
		if (!species.exists) species = this.dex.getSpecies('pikachu'); // Because Gen 1.

		const movePool = species.randomBattleMoves ? species.randomBattleMoves.slice() : [];
		let moves: string[] = [];
		const hasType: {[k: string]: true} = {};
		hasType[species.types[0]] = true;
		if (species.types[1]) hasType[species.types[1]] = true;
		let hasMove: {[k: string]: true} = {};
		let counter: {[k: string]: number} = {};
		// const setupType = '';

		// Moves that boost Attack:
		const PhysicalSetup = ['swordsdance', 'sharpen'];
		// Moves which boost Special Attack:
		const SpecialSetup = ['amnesia', 'growth'];

		// Either add all moves or add none
		if (species.comboMoves) {
			if (this.randomChance(1, 2)) {
				moves = moves.concat(species.comboMoves);
			}
		}

		// Add one of the semi-mandatory moves
		// Often, these are used so that the Pokemon only gets one of the less useful moves
		if (moves.length < 4 && species.exclusiveMoves) {
			moves.push(this.sample(species.exclusiveMoves));
		}

		// Add the mandatory move. SD Mew and Amnesia Snorlax are exceptions.
		if (moves.length < 4 && species.essentialMove) {
			moves.push(species.essentialMove);
		}

		while (moves.length < 4 && movePool.length) {
			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length < 4 && movePool.length) {
				const moveid = this.sampleNoReplace(movePool);
				moves.push(moveid);
			}

			// Only do move choosing if we have backup moves in the pool...
			if (movePool.length) {
				hasMove = {};
				counter = {Physical: 0, Special: 0, Status: 0, physicalsetup: 0, specialsetup: 0};
				for (const setMoveid of moves) {
					const move = this.dex.getMove(setMoveid);
					const moveid = move.id;
					hasMove[moveid] = true;
					if (!move.damage && !move.damageCallback) {
						counter[move.category]++;
					}
					if (PhysicalSetup.includes(moveid)) {
						counter['physicalsetup']++;
					}
					if (SpecialSetup.includes(moveid)) {
						counter['specialsetup']++;
					}
				}

				// if (counter['specialsetup']) {
				// 	setupType = 'Special';
				// } else if (counter['physicalsetup']) {
				// 	setupType = 'Physical';
				// }

				for (const [i, moveid] of moves.entries()) {
					if (moveid === species.essentialMove) continue;
					const move = this.dex.getMove(moveid);
					let rejected = false;
					if (!species.essentialMove || moveid !== species.essentialMove) {
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
						moves.splice(i, 1);
						break;
					}
					counter[move.category]++;
				} // End of for
			} // End of the check for more than 4 moves on moveset.
		}

		const levelScale: {[k: string]: number} = {
			LC: 88,
			NFE: 80,
			UU: 74,
			OU: 68,
			Uber: 65,
		};

		const customScale: {[k: string]: number} = {
			Mewtwo: 62,
			Caterpie: 99, Metapod: 99, Weedle: 99, Kakuna: 99, Magikarp: 99,
			Ditto: 88,
		};
		let level = levelScale[species.tier] || 80;
		if (customScale[species.name]) level = customScale[species.name];

		return {
			name: species.name,
			species: species.name,
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

export default RandomGen1Teams;
