import { RandomTeams, type MoveCounter } from '../gen9/teams';

export class RandomMNMLS extends RandomTeams {
	override randomSets: { [species: string]: RandomTeamsTypes.RandomSpeciesData } = require('./sets.json');

	randomMnMLSTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const seed = this.prng.getSeed();
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// For Monotype
		const isMonotype = !!this.forceMonotype || ruleTable.has('sametypeclause');
		const isDoubles = this.format.gameType !== 'singles';
		const typePool = this.dex.types.names().filter(name => name !== "Stellar");
		const type = this.forceMonotype || this.sample(typePool);

		const baseFormes: { [k: string]: number } = {};

		const typeCount: { [k: string]: number } = {};
		const typeComboCount: { [k: string]: number } = {};
		const typeWeaknesses: { [k: string]: number } = {};
		const typeDoubleWeaknesses: { [k: string]: number } = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};
		let magicBouncers = 0;

		let pokemonList = Object.keys(this.randomSets);
		const CAPTiers = ["CAP", "CAP NFE", "CAP LC"];
		if (pokemonList.filter(mon => CAPTiers.includes(this.dex.species.get(mon).tier)).length >= 6) {
			if (ruleTable.has("+tag:cap"))
				pokemonList = pokemonList.filter(mon => CAPTiers.includes(this.dex.species.get(mon).tier));
			else
				pokemonList = pokemonList.filter(mon => !CAPTiers.includes(this.dex.species.get(mon).tier));
		}
		const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);

		// const leadsRemaining = this.format.gameType === 'doubles' ? 2 : 1;
		while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
			const baseSpecies = this.sampleNoReplace(baseSpeciesPool);
			const species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));
			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			// Treat Ogerpon formes and Terapagos like the Tera Blast user role; reject if team has one already
			if (['ogerpon', 'ogerponhearthflame', 'terapagos'].includes(species.id) && teamDetails.teraBlast) continue;

			// Illusion shouldn't be on the last slot
			if (species.baseSpecies === 'Zoroark' && pokemon.length >= (this.maxTeamSize - 1)) continue;

			const types = species.types;
			const typeCombo = types.slice().sort().join();
			const weakToFreezeDry = (
				this.dex.getEffectiveness('Ice', species) > 0 ||
				(this.dex.getEffectiveness('Ice', species) > -2 && types.includes('Water'))
			);
			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

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

				// Limit three weak to any type, and one double weak to any type
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0) {
						if (!typeWeaknesses[typeName]) typeWeaknesses[typeName] = 0;
						if (typeWeaknesses[typeName] >= 3 * limitFactor) {
							skip = true;
							break;
						}
					}
					if (this.dex.getEffectiveness(typeName, species) > 1) {
						if (!typeDoubleWeaknesses[typeName]) typeDoubleWeaknesses[typeName] = 0;
						if (typeDoubleWeaknesses[typeName] >= limitFactor) {
							skip = true;
							break;
						}
					}
				}
				if (skip) continue;

				// Count Dry Skin/Fluffy as Fire weaknesses
				if (
					this.dex.getEffectiveness('Fire', species) === 0 &&
					Object.values(species.abilities).filter(a => ['Dry Skin', 'Fluffy'].includes(a)).length
				) {
					if (!typeWeaknesses['Fire']) typeWeaknesses['Fire'] = 0;
					if (typeWeaknesses['Fire'] >= 3 * limitFactor) continue;
				}

				// Limit four weak to Freeze-Dry
				if (weakToFreezeDry) {
					if (!typeWeaknesses['Freeze-Dry']) typeWeaknesses['Freeze-Dry'] = 0;
					if (typeWeaknesses['Freeze-Dry'] >= 4 * limitFactor) continue;
				}

				// Check Magic Bounce
				if ((species.id === 'fezandipiti' || species.id === 'jirachi' ||
					species.id === 'ursalunabloodmoon') && magicBouncers >= 1) {
					continue;
				}

				// Check compatibility with team
				if (!this.getPokemonCompatibility(species, pokemon, isDoubles)) continue;
			}

			// Limit three of any type combination in Monotype
			if (!this.forceMonotype && isMonotype && (typeComboCount[typeCombo] >= 3 * limitFactor)) continue;

			const set = this.randomSet(species, teamDetails, false, isDoubles);
			pokemon.push(set);

			// Don't bother tracking details for the last Pokemon
			if (pokemon.length === this.maxTeamSize) break;

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[species.baseSpecies] = 1;

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
				if (this.dex.getEffectiveness(typeName, species) > 1) {
					typeDoubleWeaknesses[typeName]++;
				}
			}
			// Count Dry Skin/Fluffy as Fire weaknesses
			if (['Dry Skin', 'Fluffy'].includes(set.ability) && this.dex.getEffectiveness('Fire', species) === 0) {
				typeWeaknesses['Fire']++;
			}
			if (weakToFreezeDry) typeWeaknesses['Freeze-Dry']++;

			// Increment Magic Bounce counter
			if (species.id === 'fezandipiti' || species.id === 'jirachi' || species.id === 'ursalunabloodmoon') magicBouncers++;

			// Track what the team has
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails.rain = 1;
			if (set.ability === 'Drought' || set.ability === 'Orichalcum Pulse' || set.moves.includes('sunnyday')) {
				teamDetails.sun = 1;
			}
			if (set.ability === 'Sand Stream') teamDetails.sand = 1;
			if (set.ability === 'Snow Warning' || set.moves.includes('snowscape') || set.moves.includes('chillyreception')) {
				teamDetails.snow = 1;
			}
			if (set.moves.includes('healbell')) teamDetails.statusCure = 1;
			if (set.moves.includes('spikes') || set.moves.includes('ceaselessedge')) {
				teamDetails.spikes = (teamDetails.spikes || 0) + 1;
			}
			if (set.moves.includes('toxicspikes') || set.ability === 'Toxic Debris') teamDetails.toxicSpikes = 1;
			if (set.moves.includes('stealthrock') || set.moves.includes('stoneaxe')) teamDetails.stealthRock = 1;
			if (set.moves.includes('stickyweb')) teamDetails.stickyWeb = 1;
			if (set.moves.includes('defog')) teamDetails.defog = 1;
			if (set.moves.includes('rapidspin') || set.moves.includes('mortalspin')) teamDetails.rapidSpin = 1;
			if (set.moves.includes('auroraveil') || (set.moves.includes('reflect') && set.moves.includes('lightscreen'))) {
				teamDetails.screens = 1;
			}
			if (set.role === 'Tera Blast user' || ['ogerpon', 'ogerponhearthflame', 'terapagos'].includes(species.id)) {
				teamDetails.teraBlast = 1;
			}
		}
		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) { // large teams sometimes cannot be built
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
		}

		return pokemon;
	};

	/* All items are generated in getItem, so we shouldn't override anything */
	override getPriorityItem(ability: string, types: Set<string>, moves: Set<string>,
		counter: MoveCounter, teamDetails: RandomTeamsTypes.TeamDetails, species: Species,
		isLead: boolean, teraType: string, role: RandomTeamsTypes.Role, isDoubles: boolean):
		string | undefined {
		return;
	};

	override getItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): string {
		if (species.id === 'dragonite') return 'Scizorite';
		if (species.id === 'garganacl') return 'Scraftinite';
		if (species.id === 'greattusk') return 'Lopunnite';
		if (species.id === 'heatran') return 'Garchompite Z';
		if (species.id === 'pecharunt') return 'Gyaradosite';
		if (species.id === 'ragingbolt') return 'Manectite';
		if (species.id === 'annihilape') return 'Crabominite';
		if (species.id === 'archaludon') return 'Blue Orb';
		if (species.id === 'ceruledge') return 'Eelektrossite';
		if (species.id === 'gholdengo') return 'Magearnite';
		if (species.id === 'gougingfire') return 'Pinsirite';
		if (species.id === 'magearna') return 'Metagrossite';
		if (species.id === 'roaringmoon') return 'Sharpedonite';
		if (species.id === 'walkingwake') return 'Charizardite Y';
		if (species.id === 'darkrai') return 'Pidgeotite';
		if (species.id === 'dragapult') return 'Red Orb';
		if (species.id === 'gengar') return 'Dragoninite';
		if (species.id === 'ironboulder') return 'Aerodactylite';
		if (species.id === 'regieleki') return 'Altarianite';
		if (species.id === 'shayminsky') return 'Meganiumite';
		if (species.id === 'weavile') return 'Zygardite';
		if (species.id === 'zamazenta') return 'Red Orb';
		if (species.id === 'mandibuzz') return 'Mawilite';
		if (species.id === 'skarmory') return 'Starminite';
		if (species.id === 'salazzle') return 'Beedrillite';
		if (species.id === 'mamoswine') return 'Lucarionite Z';
		if (species.id === 'fezandipiti') return 'Clefablite';
		if (species.id === 'jirachi') return 'Clefablite';
		if (species.id === 'hippowdon') return 'Steelixite';
		if (species.id === 'drifblim') return 'Victreebelite';
		if (species.id === 'tinkaton') return 'Banettite';
		if (species.id === 'landorustherian') return 'Manectite';
		if (species.id === 'hydreigon') return 'Chimechite';
		if (species.id === 'lugia') return 'Wellspring Mask';
		if (species.id === 'kyuremblack') return 'Zap Plate';
		if (species.id === 'regigigas') return 'Iron Plate';
		if (species.id === 'palossand') return 'Kangaskhanite';
		if (species.id === 'revavroom') return 'Pinsirite';
		if (species.id === 'vikavolt') return 'Aggronite';
		if (species.id === 'umbreon') return 'Meganiumite';
		if (species.id === 'ironmoth') return 'Chimechite';
		if (species.id === 'fluttermane') return 'Cornerstone Mask';
		if (species.id === 'rotomwash') return 'Pidgeotite';
		if (species.id === 'flygon') return 'Altarianite';
		if (species.id === 'hariyama') return 'Scolipite';
		if (species.id === 'ursalunabloodmoon') return 'Sablenite';
		/* Fallback */
		else return 'Life Orb';
	}
}

export default RandomMNMLS;
