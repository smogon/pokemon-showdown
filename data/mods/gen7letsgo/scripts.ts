function checkMegaForme(species: Species, forme: string, battle: Battle) {
	const baseSpecies = battle.dex.species.get(species.baseSpecies);
	const altForme = battle.dex.species.get(`${baseSpecies.name}-${forme}`);
	if (
		altForme.exists && !battle.ruleTable.isBannedSpecies(altForme) &&
		!battle.ruleTable.isBanned('pokemontag:mega')
	) {
		return altForme.name;
	}
	return null;
}

export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7',
	init() {
		this.modData('Abilities', 'noability').isNonstandard = null;
		for (const i in this.data.Pokedex) {
			this.modData('Pokedex', i).abilities = {0: 'No Ability'};
			delete this.modData('Pokedex', i).requiredItem;
		}
	},
	actions: {
		canMegaEvo(pokemon) {
			return checkMegaForme(pokemon.baseSpecies, 'Mega', this.battle);
		},
		canMegaEvoX(pokemon) {
			return checkMegaForme(pokemon.baseSpecies, 'Mega-X', this.battle);
		},
		canMegaEvoY(pokemon) {
			return checkMegaForme(pokemon.baseSpecies, 'Mega-Y', this.battle);
		},
		runMegaEvo(pokemon) {
			const speciesid = pokemon.canMegaEvo || pokemon.canMegaEvoX || pokemon.canMegaEvoY;
			if (!speciesid) return false;

			pokemon.formeChange(speciesid, null, true);
			this.battle.add('-mega', pokemon, this.dex.species.get(speciesid).baseSpecies);

			// Limit one mega evolution
			for (const ally of pokemon.side.pokemon) {
				ally.canMegaEvo = null;
				ally.canMegaEvoX = null;
				ally.canMegaEvoY = null;
			}

			this.battle.runEvent('AfterMega', pokemon);
			return true;
		},
		runMegaEvoX(pokemon) {
			if (!pokemon.canMegaEvoX) return false;
			pokemon.canMegaEvoY = null;
			return this.runMegaEvo(pokemon);
		},
		runMegaEvoY(pokemon) {
			if (!pokemon.canMegaEvoY) return false;
			pokemon.canMegaEvoX = null;
			return this.runMegaEvo(pokemon);
		},
	},
	/**
	 * Given a table of base stats and a pokemon set, return the actual stats.
	 */
	spreadModify(baseStats, set) {
		const modStats: StatsTable = {hp: 10, atk: 10, def: 10, spa: 10, spd: 10, spe: 10};
		let statName: StatID;
		for (statName in modStats) {
			const stat = baseStats[statName];
			modStats[statName] = Math.floor((Math.floor(2 * stat + set.ivs[statName]) * set.level / 100 + 5));
		}
		if ('hp' in baseStats) {
			const stat = baseStats['hp'];
			modStats['hp'] = Math.floor(Math.floor(2 * stat + set.ivs['hp'] + 100) * set.level / 100 + 10);
		}
		return this.natureModify(modStats, set);
	},

	/**
	 * @param {StatsTable} stats
	 * @param {PokemonSet} set
	 * @return {StatsTable}
	 */
	natureModify(stats, set) {
		const nature = this.dex.natures.get(set.nature);
		if (nature.plus) stats[nature.plus] = Math.floor(stats[nature.plus] * 1.1);
		if (nature.minus) stats[nature.minus] = Math.floor(stats[nature.minus] * 0.9);
		set.happiness = 70;
		const friendshipValue = Math.floor((set.happiness / 255 / 10 + 1) * 100);
		let stat: StatID;
		for (stat in stats) {
			if (stat !== 'hp') {
				stats[stat] = Math.floor(stats[stat] * friendshipValue / 100);
			}
			stats[stat] += set.evs[stat];
		}
		return stats;
	},
};
