export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	gastroacid: {
		inherit: true,
		condition: {
			// Ability suppression implemented in Pokemon.ignoringAbility() within sim/pokemon.js
			onStart(pokemon, source, sourceEffect) {
				this.add('-endability', pokemon);
				this.singleEvent('End', pokemon.getAbility(), pokemon.abilityState, pokemon, pokemon, sourceEffect);
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
