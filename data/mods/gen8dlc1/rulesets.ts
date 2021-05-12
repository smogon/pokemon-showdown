export const Rulesets: {[k: string]: ModdedFormatData} = {
	teampreview: {
		effectType: 'Rule',
		name: 'Team Preview',
		desc: "Allows each player to see the Pok&eacute;mon on their opponent's team before they choose their lead Pok&eacute;mon",
		onTeamPreview() {
			this.add('clearpoke');
			for (const pokemon of this.getAllPokemon()) {
				const details = pokemon.details.replace(', shiny', '')
					.replace(/(Arceus|Gourgeist|Pumpkaboo|Xerneas|Silvally|Zacian|Zamazenta|Urshifu)(-[a-zA-Z?-]+)?/g, '$1-*');
				this.add('poke', pokemon.side.id, details, '');
			}
			this.makeRequest('teampreview');
		},
		onFieldStart() {
			// Xerneas isn't in DLC1 but operated this way pre-1.3.2 update
			const formesToLeak = ["zaciancrowned", "zamazentacrowned", "xerneas"];
			for (const pokemon of this.getAllPokemon()) {
				if (!formesToLeak.includes(this.toID(pokemon.baseSpecies.name))) continue;
				const newDetails = pokemon.details.replace(', shiny', '');
				this.add('updatepoke', pokemon, newDetails);
			}
		},
	},
};
