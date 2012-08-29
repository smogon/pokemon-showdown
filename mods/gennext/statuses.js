exports.BattleStatuses = {
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		durationCallback: function() {
			return this.random(2,4);
		},
		onResidual: function(target) {
			var move = this.getMove(target.lastMove);
			if (!move.self || move.self.volatileStatus !== 'lockedmove') {
				// don't lock, and bypass confusion for calming
				delete target.volatiles['lockedmove'];
			} else if (target.ability === 'owntempo') {
				// Own Tempo prevents locking
				delete target.volatiles['lockedmove'];
			}
		},
		onEnd: function(target) {
			this.add('-end', target, 'rampage');
			target.addVolatile('confusion');
		},
		onLockMove: function(pokemon) {
			return pokemon.lastMove;
		},
		onBeforeTurn: function(pokemon) {
			var move = this.getMove(pokemon.lastMove);
			if (pokemon.lastMove) {
				this.debug('Forcing into '+pokemon.lastMove);
				this.changeDecision(pokemon, {move: pokemon.lastMove});
			}
		}
	}
};
