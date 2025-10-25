export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	teampreview: {
		inherit: true,
		onBattleStart() {
			// Xerneas isn't in DLC1 but operated this way pre-1.3.2 update
			const formesToLeak = ['zaciancrowned', 'zamazentacrowned', 'xerneasactive'];
			for (const pokemon of this.getAllPokemon()) {
				if (!formesToLeak.includes(pokemon.baseSpecies.id)) continue;
				const newDetails = pokemon.details.replace(', shiny', '');
				this.add('updatepoke', pokemon, newDetails);
			}
		},
	},
};
