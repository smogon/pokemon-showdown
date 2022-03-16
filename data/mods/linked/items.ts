export const Items: {[k: string]: ModdedItemData} = {
	leppaberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (!pokemon.hp) return;
			const moveSlot = pokemon.getMoveData(pokemon.m.lastMoveAbsolute);
			if (moveSlot?.pp === 0) {
				pokemon.addVolatile('leppaberry');
				pokemon.volatiles['leppaberry'].moveSlot = moveSlot;
				pokemon.eatItem();
			}
		},
	},
};
