export const Moves: {[k: string]: ModdedMoveData} = {
	bonemerang: {
		inherit: true,
		beforeTurnCallback(pokemon, target) {
			const stallMove = this.queue.willMove(target)?.move.volatileStatus === 'stall';
			if (stallMove) {
				// Do nothing
			} else if (this.field.isTerrain('psychicterrain') && target.isGrounded() && !stallMove) {
				this.add('-activate', target, 'move: Psychic Terrain');
			} else if (target.hasAbility(['dazzling', 'queenlymajesty']) && !stallMove) {
				this.add('cant', target, 'ability: Queenly Majesty', this.dex.getMove('bonemerang'), '[of] ' + pokemon);
			} else {
				this.useMove('bonemerang', pokemon);
			}
		},
		multihit: 1,
		priority: -6,
	},
};
