export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	watershuriken: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (pokemon.species.name === 'Greninja-Mega' && pokemon.hasAbility('battlebond') &&
				!pokemon.transformed) {
				return move.basePower * 5;
			}
			return move.basePower;
		},
	},
};
