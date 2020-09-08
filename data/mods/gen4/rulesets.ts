export const Formats: {[k: string]: ModdedFormatData} = {
	standard: {
		inherit: true,
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
	},
	validatestats: {
		inherit: true,
		onValidateSet(set) {
			const species = this.dex.getSpecies(set.species);
			const item = this.dex.getItem(set.item);
			if (item && item.id === 'griseousorb' && species.num !== 487) {
				return ['Griseous Orb can only be held by Giratina in Generation 4.'];
			}
			if (species.num === 493 && set.evs) {
				const isEventArceus = set.moves.includes('roaroftime') || set.moves.includes('shadowforce') ||
					set.moves.includes('spacialrend');
				if (isEventArceus) {
					let stat: StatName;
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
