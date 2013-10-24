exports.BattleAbilities = {
	"frisk": {
		inherit: true,
		onStart: function(pokemon) {
			var target = pokemon.side.foe.randomActive();
			if (target && target.item) {
				this.add('-item', target, target.getItem().name, '[from] ability: Frisk', '[of] '+pokemon);
			}
		}
	},
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
