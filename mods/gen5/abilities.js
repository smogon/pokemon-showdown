exports.BattleAbilities = {
	"intimidate": {
		inherit: true,
		onStart: function(pokemon) {
			var foeactive = pokemon.side.foe.active;
			for (var i=0; i<foeactive.length; i++) {
				if (!foeactive[i] || foeactive[i].fainted) continue;
				if (foeactive[i].volatiles['substitute']) {
					// does it give a message?
					this.add('-activate',foeactive[i],'Substitute','ability: Intimidate','[of] '+pokemon);
				} else {
					this.add('-ability',pokemon,'Intimidate','[of] '+foeactive[i]);
					this.boost({atk: -1}, foeactive[i], pokemon);
				}
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
