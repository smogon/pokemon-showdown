export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	encore: {
		inherit: true,
		condition: {
			durationCallback() {
				return this.random(3, 7);
			},
			onStart(target) {
				const lockedMove = target.lastMoveEncore?.id || '';
				const moveSlot = lockedMove ? target.getMoveData(lockedMove) : null;
				if (!moveSlot || target.lastMoveEncore?.flags['failencore'] || moveSlot.pp <= 0) {
					// it failed
					return false;
				}
				this.effectState.move = lockedMove;
				this.add('-start', target, 'Encore');
			},
			onOverrideAction(pokemon) {
				return this.effectState.move;
			},
			onModifyMove(move, pokemon) {
				if (['normal', 'any', 'adjacentFoe'].includes(move.target)) {
					move.target = 'randomNormal';
				}
			},
			onResidualOrder: 13,
			onResidual(target) {
				const lockedMoveSlot = target.getMoveData(this.effectState.move);
				if (lockedMoveSlot && lockedMoveSlot.pp <= 0) {
					// early termination if you run out of PP
					target.removeVolatile('encore');
				}
			},
			onEnd(target) {
				this.add('-end', target, 'Encore');
			},
			onDisableMove(pokemon) {
				if (!this.effectState.move || !pokemon.hasMove(this.effectState.move)) {
					return;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id !== this.effectState.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
	},
};
