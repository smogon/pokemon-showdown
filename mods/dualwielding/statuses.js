'use strict';

exports.BattleStatuses = {
	choicelock: {
		inherit: true,
		onBeforeMove: function (pokemon, target, move) {
			if (!(pokemon.getItem().isChoice || pokemon.getAbility().isChoice) || !pokemon.hasMove(this.effectData.move)) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (move.id !== this.effectData.move && move.id !== 'struggle') {
				// Fails even if the Choice item is being ignored, and no PP is lost
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.add('-fail', pokemon);
				return false;
			}
		},
		onDisableMove: function (pokemon) {
			if (!(pokemon.getItem().isChoice || pokemon.getAbility().isChoice) || !pokemon.hasMove(this.effectData.move)) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (pokemon.ignoringItem()) {
				return;
			}
			let moves = pokemon.moveset;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].id !== this.effectData.move) {
					pokemon.disableMove(moves[i].id, false, this.effectData.sourceEffect);
				}
			}
		},
	},
};
