exports.BattleAbilities = {
	"frisk": {
		inherit: true,
		desc: "When this Pokemon enters the field, it identifies the opponent's held item; in double battles, the held item of an unrevealed, randomly selected opponent is identified.",
		shortDesc: "On switch-in, this Pokemon identifies a random foe's held item.",
		onStart: function (pokemon) {
			var target = pokemon.side.foe.randomActive();
			if (target && target.item) {
				this.add('-item', target, target.getItem().name, '[from] ability: Frisk', '[of] ' + pokemon);
			}
		}
	},
	"keeneye": {
		inherit: true,
		onModifyMove: function () {}
	},
	"infiltrator": {
		inherit: true,
		onModifyMove: function (move) {
			move.ignoreScreens = true;
		}
	},
	"oblivious": {
		inherit: true,
		desc: "This Pokemon cannot be infatuated (by Attract or Cute Charm). Gaining this Ability while infatuated cures it.",
		shortDesc: "This Pokemon cannot be infatuated. Gaining this Ability while infatuated cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.volatiles['attract']) {
				pokemon.removeVolatile('attract');
				this.add("-message", pokemon.name + " got over its infatuation. (placeholder)");
			}
		},
		onTryHit: function (pokemon, target, move) {
			if (move.id === 'captivate') {
				this.add('-immune', pokemon, '[msg]', '[from] Oblivious');
				return null;
			}
		}
	},
	"overcoat": {
		inherit: true,
		onTryHit: function () {}
	},
	"sapsipper": {
		inherit: true,
		desc: "This Pokemon is immune to Grass moves, except for Aromatherapy. If hit by a Grass move, its Attack is increased by one stage (once for each hit of Bullet Seed)."
		// differences implemented in allyTeam targetting
	},
	"soundproof": {
		inherit: true,
		desc: "This Pokemon is immune to the effects of sound-based moves, which are: Bug Buzz, Chatter, Echoed Voice, Grasswhistle, Growl, Heal Bell, Hyper Voice, Metal Sound, Perish Song, Relic Song, Roar, Round, Screech, Sing, Snarl, Snore, Supersonic, and Uproar. This ability doesn't affect Heal Bell.",
		shortDesc: "This Pokemon is immune to sound-based moves, except Heal Bell."
		// differences implemented in allyTeam targetting
	}
};
