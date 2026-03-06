/**
 * Gen 3 colosseum modifications (perish song should fail if it effects all remaining pokemon)
 */
export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	perishsong: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.side.pokemonLeft === 1) {
				return false;
			}
		},
	},
};
