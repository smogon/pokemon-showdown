/**
 * Gen 3 colosseum modifications (perish song should fail if it effects all remaining pokemon)
 */
export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	perishsong: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.side.pokemonLeft === 1) {
				this.add('-fail', attacker, 'move: Perish Song');
				this.hint("Self KO Clause: The last pokemon on a team cannot use moves that force fainting");
				return false;
			}
		},
	},
	destinybond: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.side.pokemonLeft === 1) {
				this.add('-fail', attacker, 'move: Perish Song');
				this.hint("Self KO Clause: The last pokemon on a team cannot use moves that force fainting");
				return false;
			}
		},
	},
};
