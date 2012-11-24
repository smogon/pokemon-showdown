exports.BattleStatuses = {
	frz: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('-status', target.id, 'frz');
		},
		duration: 2,
		onBeforeMovePriority: 2,
		onBeforeMove: function(pokemon, target, move) {
			if (move.thawsUser) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon.id, 'frz');
			return false;
		},
		onHit: function(target, source, move) {
			if (move.type === 'Fire' && move.category !== 'Status' || move.thawsUser) {
				target.cureStatus();
			}
		}
	},
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
