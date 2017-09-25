'use strict';

exports.BattleAbilities = {
	"frisk": {
		inherit: true,
		shortDesc: "On switch-in, this Pokemon identifies a random foe's held item.",
		onStart: function (pokemon) {
			let target = pokemon.side.foe.randomActive();
			if (target && target.item) {
				this.add('-item', target, target.getItem().name, '[from] ability: Frisk', '[of] ' + pokemon);
			}
		},
	},
	"keeneye": {
		inherit: true,
		desc: "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage.",
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage.",
		onModifyMove: function () {},
	},
	"oblivious": {
		inherit: true,
		desc: "This Pokemon cannot be infatuated. Gaining this Ability while infatuated cures it.",
		shortDesc: "This Pokemon cannot be infatuated. Gaining this Ability while infatuated cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.volatiles['attract']) {
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
		},
		onTryHit: function (pokemon, target, move) {
			if (move.id === 'captivate') {
				this.add('-immune', pokemon, '[msg]', '[from] Oblivious');
				return null;
			}
		},
	},
	"overcoat": {
		inherit: true,
		shortDesc: "This Pokemon is immune to damage from Sandstorm or Hail.",
		onTryHit: function () {},
	},
	"sapsipper": {
		inherit: true,
		onAllyTryHitSide: function () {},
	},
	"serenegrace": {
		inherit: true,
		onModifyMove: function (move) {
			if (move.secondaries && move.id !== 'secretpower') {
				this.debug('doubling secondary chance');
				for (let i = 0; i < move.secondaries.length; i++) {
					move.secondaries[i].chance *= 2;
				}
			}
		},
	},
	"soundproof": {
		inherit: true,
		shortDesc: "This Pokemon is immune to sound-based moves, except Heal Bell.",
		onAllyTryHitSide: function () {},
	},
};
