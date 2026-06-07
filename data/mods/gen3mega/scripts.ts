export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen3',
	gen: 3,
	actions: {
		inherit: true,
		canMegaEvo(pokemon) {
			const species = pokemon.baseSpecies;
			const altForme = species.otherFormes && this.dex.species.get(species.otherFormes[0]);
			const item = pokemon.getItem();

			if (altForme?.isMega && altForme?.requiredMove &&
				pokemon.baseMoves.includes(toID(altForme.requiredMove)) && !item.zMove) {
				return altForme.name;
			}
			if (!item.megaStone) return null;
			const megaEvolution = item.megaStone[species.baseSpecies] || item.megaStone[species.name];
			return megaEvolution && megaEvolution !== species.name ? megaEvolution : null;
		},
		runMegaEvo(pokemon) {
			const speciesid = pokemon.canMegaEvo;
			if (!speciesid) return false;

			pokemon.formeChange(speciesid, pokemon.getItem(), true);

			for (const ally of pokemon.side.pokemon) {
				ally.canMegaEvo = false;
			}

			this.battle.runEvent('AfterMega', pokemon);
			return true;
		},
	},
};
