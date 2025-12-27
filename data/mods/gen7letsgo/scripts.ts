function checkMegaForme(species: Species, forme: string, battle: Battle) {
	const baseSpecies = battle.dex.species.get(species.baseSpecies);
	const altForme = battle.dex.species.get(`${baseSpecies.name}-${forme}`);
	if (altForme.exists && altForme.gen <= 7 && !battle.ruleTable.isBannedSpecies(altForme) &&
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
			this.modData('Pokedex', i).abilities = { 0: 'No Ability' };
			delete this.modData('Pokedex', i).requiredItem;
		}
	},
	actions: {
		inherit: true,
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
			pokemon.formeRegression = true;

			// Limit one mega evolution
			for (const ally of pokemon.side.pokemon) {
				ally.canMegaEvo = false;
				ally.canMegaEvoX = false;
				ally.canMegaEvoY = false;
			}

			this.battle.runEvent('AfterMega', pokemon);
			return true;
		},
		runMegaEvoX(pokemon) {
			if (!pokemon.canMegaEvoX) return false;
			pokemon.canMegaEvoY = false;
			return this.runMegaEvo(pokemon);
		},
		runMegaEvoY(pokemon) {
			if (!pokemon.canMegaEvoY) return false;
			pokemon.canMegaEvoX = false;
			return this.runMegaEvo(pokemon);
		},
	},
	/**
	 * Given a table of base stats and a pokemon set, return the actual stats.
	 */
	statModify(baseStats, set, statName) {
		const tr = this.trunc;
		let stat = baseStats[statName];
		if (statName === 'hp') {
			return tr(tr(2 * stat + set.ivs[statName] + 100) * set.level / 100 + 10) + set.evs[statName];
		}
		stat = tr((tr(2 * stat + set.ivs[statName]) * set.level / 100 + 5));
		const nature = this.dex.natures.get(set.nature);
		if (nature.plus === statName) {
			stat = tr(tr(stat * 110, 16) / 100);
		} else if (nature.minus === statName) {
			stat = tr(tr(stat * 90, 16) / 100);
		}
		set.happiness = 70;
		const friendshipValue = tr((set.happiness / 255 / 10 + 1) * 100);
		stat = tr(stat * friendshipValue / 100);
		return stat;
	},
};
