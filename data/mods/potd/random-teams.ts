import {RandomTeams} from './../../random-teams';

const potdPokemon = [
	"hoopa", "groudon", "dachsbun", "squawkabilly", "cacturne", "typhlosion", "jolteon", "masquerain", "falinks",
	"wyrdeer", "gardevoir", "decidueye", "hawlucha", "azelf", "gothitelle", "donphan", "pikachu", "zaciancrowned",
	"quagsire", "uxie", "dondozo", "orthworm", "klawf", "dunsparce", "avalugg", "pawmot", "qwilfish", "lilliganthisui",
];

export class RandomPOTDTeams extends RandomTeams {
	randomTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const seed = this.prng.seed;
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// For Monotype
		const isMonotype = !!this.forceMonotype || ruleTable.has('sametypeclause');
		const isDoubles = this.format.gameType !== 'singles';
		const typePool = this.dex.types.names();
		const type = this.forceMonotype || this.sample(typePool);

		// PotD stuff
		const day = new Date().getDate();
		const potd = this.dex.species.get(potdPokemon[day > 28 ? 27 : day - 1]);

		const baseFormes: {[k: string]: number} = {};

		const tierCount: {[k: string]: number} = {};
		const typeCount: {[k: string]: number} = {};
		const typeComboCount: {[k: string]: number} = {};
		const typeWeaknesses: {[k: string]: number} = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		const pokemonList = isDoubles ? Object.keys(this.randomDoublesSets) : Object.keys(this.randomSets);
		const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);

		// Remove PotD from baseSpeciesPool
		if (baseSpeciesPool.includes(potd.baseSpecies)) {
			this.fastPop(baseSpeciesPool, baseSpeciesPool.indexOf(potd.baseSpecies));
		}

		// Add PotD to type counts
		for (const typeName of potd.types) {
			typeCount[typeName] = 1;
		}
		typeComboCount[potd.types.slice().sort().join()] = 1;

		// Increment weakness counter
		for (const typeName of this.dex.types.names()) {
			// it's weak to the type
			if (this.dex.getEffectiveness(typeName, potd) > 0) {
				typeWeaknesses[typeName] = 1;
			}
		}

		while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
			const baseSpecies = this.sampleNoReplace(baseSpeciesPool);
			const currentSpeciesPool: Species[] = [];
			for (const poke of pokemonPool) {
				const species = this.dex.species.get(poke);
				if (species.baseSpecies === baseSpecies) currentSpeciesPool.push(species);
			}
			let species = this.sample(currentSpeciesPool);
			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			// Illusion shouldn't be on the last slot
			if (species.baseSpecies === 'Zoroark' && pokemon.length >= (this.maxTeamSize - 1)) continue;

			// If Zoroark is in the team, the sixth slot should not be a Pokemon with extremely low level
			if (
				pokemon.some(pkmn => pkmn.name === 'Zoroark') &&
				pokemon.length >= (this.maxTeamSize - 1) &&
				this.getLevel(species, isDoubles) < 72 &&
				!this.adjustLevel
			) {
				continue;
			}

			// Pokemon with Last Respects, Intrepid Sword, and Dauntless Shield shouldn't be leading
			if (['Basculegion', 'Houndstone', 'Zacian', 'Zamazenta'].includes(species.baseSpecies) && !pokemon.length) continue;

			const tier = species.tier;
			const types = species.types;
			const typeCombo = types.slice().sort().join();
			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

			// Limit one Pokemon per tier, two for Monotype
			// Disable this for now, since it is still a new gen
			// Unless you want to have a lot of Ubers!
			// if (
			// 	(tierCount[tier] >= (this.forceMonotype || isMonotype ? 2 : 1) * limitFactor) &&
			// 	!this.randomChance(1, Math.pow(5, tierCount[tier]))
			// ) {
			// 	continue;
			// }

			if (!isMonotype && !this.forceMonotype) {
				let skip = false;

				// Limit two of any type
				for (const typeName of types) {
					if (typeCount[typeName] >= 2 * limitFactor) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit three weak to any type
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0) {
						if (!typeWeaknesses[typeName]) typeWeaknesses[typeName] = 0;
						if (typeWeaknesses[typeName] >= 3 * limitFactor) {
							skip = true;
							break;
						}
					}
				}
				if (skip) continue;
			}

			// Limit one of any type combination, two in Monotype
			if (!this.forceMonotype && typeComboCount[typeCombo] >= (isMonotype ? 2 : 1) * limitFactor) continue;

			// The Pokemon of the Day
			if (potd?.exists && (pokemon.length === 1 || this.maxTeamSize === 1)) species = potd;

			const set = this.randomSet(species, teamDetails, pokemon.length === 0, isDoubles);

			// Okay, the set passes, add it to our team
			pokemon.push(set);
			if (pokemon.length === this.maxTeamSize) {
				// Set Zoroark's level to be the same as the last Pokemon
				const illusion = teamDetails.illusion;
				if (illusion) pokemon[illusion - 1].level = pokemon[this.maxTeamSize - 1].level;

				// Don't bother tracking details for the last Pokemon
				break;
			}

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[species.baseSpecies] = 1;

			// Increment tier counter
			if (tierCount[tier]) {
				tierCount[tier]++;
			} else {
				tierCount[tier] = 1;
			}

			// Don't increment type/weakness counters for POTD, since they were added at the beginning
			if (pokemon.length !== 1 && this.maxTeamSize !== 1) {
				// Increment type counters
				for (const typeName of types) {
					if (typeName in typeCount) {
						typeCount[typeName]++;
					} else {
						typeCount[typeName] = 1;
					}
				}
				if (typeCombo in typeComboCount) {
					typeComboCount[typeCombo]++;
				} else {
					typeComboCount[typeCombo] = 1;
				}

				// Increment weakness counter
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0) {
						typeWeaknesses[typeName]++;
					}
				}
			}

			// Track what the team has
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails.rain = 1;
			if (set.ability === 'Drought' || set.moves.includes('sunnyday')) teamDetails.sun = 1;
			if (set.ability === 'Sand Stream') teamDetails.sand = 1;
			if (set.ability === 'Snow Warning' || set.moves.includes('snowscape') || set.moves.includes('chillyreception')) {
				teamDetails.snow = 1;
			}
			if (set.moves.includes('spikes')) teamDetails.spikes = (teamDetails.spikes || 0) + 1;
			if (set.moves.includes('stealthrock')) teamDetails.stealthRock = 1;
			if (set.moves.includes('stickyweb')) teamDetails.stickyWeb = 1;
			if (set.moves.includes('stoneaxe')) teamDetails.stealthRock = 1;
			if (set.moves.includes('toxicspikes')) teamDetails.toxicSpikes = 1;
			if (set.moves.includes('defog')) teamDetails.defog = 1;
			if (set.moves.includes('rapidspin')) teamDetails.rapidSpin = 1;
			if (set.moves.includes('mortalspin')) teamDetails.rapidSpin = 1;
			if (set.moves.includes('tidyup')) teamDetails.rapidSpin = 1;
			if (set.moves.includes('auroraveil') || (set.moves.includes('reflect') && set.moves.includes('lightscreen'))) {
				teamDetails.screens = 1;
			}
			if (set.role === 'Tera Blast user') teamDetails.teraBlast = 1;

			// For setting Zoroark's level
			if (set.ability === 'Illusion') teamDetails.illusion = pokemon.length;
		}
		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) { // large teams sometimes cannot be built
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
		}

		return pokemon;
	}
}

export default RandomPOTDTeams;
