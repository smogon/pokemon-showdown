export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	gastroacid: {
		inherit: true,
		condition: {
			// Ability suppression implemented in sim/pokemon.ts#ignoringAbility
			onStart(pokemon) {
				this.add('-endability', pokemon);
				this.singleEvent('End', pokemon.getAbility(), pokemon.abilityState, pokemon, pokemon, 'gastroacid');
				const keys = Object.keys(pokemon.volatiles).filter(x => x.startsWith("ability:"));
				if (keys.length) {
					for (const abil of keys) {
						pokemon.removeVolatile(abil);
					}
				}
			},
		},
	},
};
