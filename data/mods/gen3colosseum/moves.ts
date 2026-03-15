/**
 * Gen 3 colosseum modifications (perish song should fail if it effects all remaining pokemon)
 */
export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	perishsong: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			let immuneMon = false;

			for (const mon of attacker.side.active) {
				if (this.runEvent('Immunity', mon, attacker, move)) {
					immuneMon = true;
				}
			}

			for (const mon of attacker.side.foe.active) {
				if (this.runEvent('Immunity', mon, attacker, move)) {
					immuneMon = true;
				}
			}

			if (immuneMon) return;

			if (this.format.gameType === 'singles') {
				if (attacker.side.pokemonLeft === 1 && attacker.side.foe.pokemonLeft === 1) {
					return false;
				}
			} else if (this.format.gameType === 'doubles') {
				if (attacker.side.pokemonLeft === 2 && attacker.side.foe.pokemonLeft === 2) {
					return false;
				}
			}
		},
	},
};
