'use strict';

/**@type {{[k: string]: ModdedItemData}} */
exports.BattleItems = {
	leppaberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (!pokemon.hp) return;
			let moveSlot = pokemon.getMoveData(pokemon.m.lastMoveAbsolute);
			if (moveSlot && moveSlot.pp === 0) {
				pokemon.addVolatile('leppaberry');
				pokemon.volatiles['leppaberry'].moveSlot = moveSlot;
				pokemon.eatItem();
			}
		},
	},
};
