exports.BattleAbilities = {
	"frisk": {
		inherit: true,
		desc: "When this Pokemon enters the field, it identifies the opponent's held item; in double battles, the held item of an unrevealed, randomly selected opponent is identified.",
		shortDesc: "On switch-in, this Pokemon identifies a random foe's held item.",
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
		desc: "This Pokemon cannot be infatuated (by Attract or Cute Charm). Gaining this Ability while infatuated cures it.",
		shortDesc: "This Pokemon cannot be infatuated. Gaining this Ability while infatuated cures it.",
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
