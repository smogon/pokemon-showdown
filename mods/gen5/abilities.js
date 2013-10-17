exports.BattleAbilities = {
	"keeneye": {
		inherit: true,
		onModifyMove: function() {}
	},
	"oblivious": {
		inherit: true,
		onUpdate: function(pokemon) {
			if (pokemon.volatiles['attract']) {
				pokemon.removeVolatile('attract');
				this.add("-message", pokemon.name+" got over its infatuation. (placeholder)");
			}
		},
		onTryHit: function(pokemon, target, move) {
			if (move.id === 'captivate') {
				this.add('-immune', pokemon, '[msg]', '[from] Oblivious');
				return null;
			}
		}
	},
	"overcoat": {
		inherit: true,
		onTryHit: function() {}
	}
};
