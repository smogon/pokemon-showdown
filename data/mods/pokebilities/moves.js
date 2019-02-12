'use strict';

/**@type {{[k: string]: ModdedMoveData}} */
exports.BattleMovedex = {
	"gastroacid": {
		inherit: true,
		effect: {
			// Ability suppression implemented in Pokemon.ignoringAbility() within sim/pokemon.js
			onStart(pokemon) {
				this.add('-endability', pokemon);
				this.singleEvent('End', this.getAbility(pokemon.ability), pokemon.abilityData, pokemon, pokemon, 'gastroacid');
				if (pokemon.innates) pokemon.innates.forEach(innate => pokemon.removeVolatile("ability" + innate));
			},
		},
	},
};
