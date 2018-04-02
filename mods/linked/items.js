'use strict';

exports.BattleItems = {
	leppaberry: {
		inherit: true,
		onUpdate: function (pokemon) {
			if (!pokemon.hp) return;
			let moveSlot = pokemon.getMoveData(pokemon.getLastMoveAbsolute());
			if (moveSlot && moveSlot.pp === 0) {
				pokemon.addVolatile('leppaberry');
				pokemon.volatiles['leppaberry'].moveSlot = moveSlot;
				pokemon.eatItem();
			}
		},
	},
};
