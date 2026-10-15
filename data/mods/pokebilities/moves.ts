export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	gastroacid: {
		inherit: true,
		condition: {
			// Ability suppression implemented in sim/pokemon.ts#ignoringAbility
			onStart(pokemon) {
				this.add('-endability', pokemon);
				this.singleEvent('End', pokemon.getAbility(), pokemon.abilityState, pokemon, pokemon, 'gastroacid');
				if (pokemon.m.innates) {
					for (const innate of pokemon.m.innates) {
						pokemon.removeVolatile("ability" + innate);
					}
				}
			},
		},
	},
};
