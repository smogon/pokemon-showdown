export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	// Mega Sol makes the holder treat the weather as Sunny Day, but it does so
	// purely through Pokemon.effectiveWeather() — it never sets real field
	// weather. The Gen 4 versions of the weather-heal moves (inherited here via
	// gen3) check this.field.isWeather(), so they never see Mega Sol and fall
	// through to the 50% heal. Re-point them at the *Pokemon's* effective
	// weather so a Mega Sol holder gets the 2/3 sun heal, while keeping the exact
	// Gen 4 heal amounts for everyone else.
	morningsun: {
		inherit: true,
		onHit(pokemon) {
			const weather = pokemon.effectiveWeather();
			if (weather === 'sunnyday' || weather === 'desolateland') {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (['raindance', 'primordialsea', 'sandstorm', 'hail'].includes(weather)) {
				this.heal(pokemon.baseMaxhp / 4);
			} else {
				this.heal(pokemon.baseMaxhp / 2);
			}
		},
	},
	moonlight: {
		inherit: true,
		onHit(pokemon) {
			const weather = pokemon.effectiveWeather();
			if (weather === 'sunnyday' || weather === 'desolateland') {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (['raindance', 'primordialsea', 'sandstorm', 'hail'].includes(weather)) {
				this.heal(pokemon.baseMaxhp / 4);
			} else {
				this.heal(pokemon.baseMaxhp / 2);
			}
		},
	},
	synthesis: {
		inherit: true,
		onHit(pokemon) {
			const weather = pokemon.effectiveWeather();
			if (weather === 'sunnyday' || weather === 'desolateland') {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (['raindance', 'primordialsea', 'sandstorm', 'hail'].includes(weather)) {
				this.heal(pokemon.baseMaxhp / 4);
			} else {
				this.heal(pokemon.baseMaxhp / 2);
			}
		},
	},
};
