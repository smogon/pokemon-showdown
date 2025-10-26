export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	commander: {
		inherit: true,
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
	},
	gulpmissile: {
		inherit: true,
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1, notransform: 1 },
	},
	protosynthesis: {
		inherit: true,
		onWeatherChange(pokemon) {
			// Protosynthesis is not affected by Utility Umbrella
			if (this.field.isWeather('sunnyday')) {
				if (!this.effectState.bestStat) {
					this.effectState.bestStat = pokemon.getBestStat(false, true);
					this.add('-activate', pokemon, 'ability: Protosynthesis');
					this.add('-start', pokemon, 'protosynthesis' + this.effectState.bestStat);
				}
				return;
			}
			if (!this.effectState.fromBooster && this.field.weather !== 'sunnyday') {
				// Protosynthesis will not deactivite if Sun is suppressed, hence the direct ID check (isWeather respects suppression)
				delete this.effectState.bestStat;
				this.add('-end', pokemon, 'Protosynthesis');
			}
			if (!this.effectState.bestStat && pokemon.hasItem('boosterenergy') &&
				pokemon.useItem(pokemon, this.effect)) {
				this.effectState.fromBooster = true;
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'ability: Protosynthesis', '[fromitem]');
				this.add('-start', pokemon, 'protosynthesis' + this.effectState.bestStat);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1, cantsuppress: 1 },
	},
	quarkdrive: {
		inherit: true,
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1, cantsuppress: 1 },
	},
};
