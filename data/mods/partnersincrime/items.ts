export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	leppaberry: {
		inherit: true,
		onEat(pokemon) {
			const moveSlot = pokemon.moveSlots.find(move => move.pp === 0) ||
				pokemon.moveSlots.find(move => move.pp < move.maxpp);
			if (!moveSlot) return;
			moveSlot.pp += 10;
			if (moveSlot.pp > moveSlot.maxpp) moveSlot.pp = moveSlot.maxpp;
			if (!pokemon.m.curMoves.includes(moveSlot.id) && pokemon.m.trackPP.get(moveSlot.id)) {
				pokemon.m.trackPP.set(moveSlot.id, moveSlot.maxpp - moveSlot.pp);
			}
			this.add('-activate', pokemon, 'item: Leppa Berry', moveSlot.move, '[consumed]');
		},
	},
};
