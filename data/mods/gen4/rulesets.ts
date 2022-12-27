export const Rulesets: {[k: string]: ModdedFormatData} = {
	standard: {
		inherit: true,
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Items Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
	},
	flatrules: {
		inherit: true,
		ruleset: ['Obtainable', 'Species Clause', 'Nickname Clause', 'Item Clause', 'Adjust Level Down = 50', 'Cancel Mod'],
	},
	teampreview: {
		inherit: true,
		onTeamPreview() {
			this.add('clearpoke');
			for (const pokemon of this.getAllPokemon()) {
				const details = pokemon.details.replace(', shiny', '')
					.replace(/(Arceus|Gourgeist|Pumpkaboo|Xerneas|Silvally|Urshifu|Dudunsparce)(-[a-zA-Z?-]+)?/g, '$1-*')
					.replace(/(Zacian|Zamazenta)(?!-Crowned)/g, '$1-*'); // Hacked-in Crowned formes will be revealed
				this.add('poke', pokemon.side.id, details, pokemon.item ? 'item' : '');
			}
			this.makeRequest('teampreview');
		},
	},
	validatestats: {
		inherit: true,
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			const item = this.dex.items.get(set.item);
			if (item && item.id === 'griseousorb' && species.num !== 487) {
				return ['Griseous Orb can only be held by Giratina in Generation 4.'];
			}
			if (species.num === 493 && set.evs) {
				const isEventArceus = set.moves.includes('roaroftime') || set.moves.includes('shadowforce') ||
					set.moves.includes('spacialrend');
				if (isEventArceus) {
					let stat: StatID;
					for (stat in set.evs) {
						if (set.evs[stat] > 100) {
							return ["Event Arceus may not have more than 100 of any EVs in Generation 4."];
						}
					}
				}
			}
		},
	},
};
