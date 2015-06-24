exports.BattleItems = {
	leppaberry: {
		inherit: true,
		onUpdate: function (pokemon) {
			var move = pokemon.getMoveData(pokemon.getLastMoveAbsolute());
			if (move && move.pp === 0) {
				pokemon.addVolatile('leppaberry');
				pokemon.volatiles['leppaberry'].move = move;
				pokemon.eatItem();
			}
		}
	},
	metronome: {
		inherit: true
		// Mod-specific: default mechanics
	}
};
