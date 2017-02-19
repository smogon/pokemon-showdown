'use strict';

exports.BattleAbilities = {
	"cutecharm": {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(3) < 1) {
					source.addVolatile('attract', target);
				}
			}
		},
	},
	"effectspore": {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact'] && !source.status) {
				let r = this.random(300);
				if (r < 10) {
					source.setStatus('slp');
				} else if (r < 20) {
					source.setStatus('par');
				} else if (r < 30) {
					source.setStatus('psn');
				}
			}
		},
	},
	"flamebody": {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(3) < 1) {
					source.trySetStatus('brn', target);
				}
			}
		},
	},
	"flashfire": {
		inherit: true,
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Fire') {
				if (move.id === 'willowisp' && (target.hasType('Fire') || target.status || target.volatiles['substitute'])) {
					return;
				}
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[msg]');
				}
				return null;
			}
		},
	},
	"lightningrod": {
		desc: "During double battles, this Pokemon draws any single-target Electric-type attack to itself. If an opponent uses an Electric-type attack that affects multiple Pokemon, those targets will be hit. This ability does not affect Electric Hidden Power or Judgment.",
		shortDesc: "This Pokemon draws opposing Electric moves to itself.",
		onFoeRedirectTarget: function (target, source, source2, move) {
			if (move.type !== 'Electric') return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				return this.effectData.target;
			}
		},
		id: "lightningrod",
		name: "Lightning Rod",
		rating: 3.5,
		num: 32,
	},
	"minus": {
		inherit: true,
		shortDesc: "If an active Pokemon has the Ability Plus, this Pokemon's Sp. Atk is 1.5x.",
		onModifySpA: function (spa, pokemon) {
			let allActives = pokemon.side.active.concat(pokemon.side.foe.active);
			for (let i = 0; i < allActives.length; i++) {
				if (!allActives[i].fainted && allActives[i].hasAbility('plus')) {
					return this.chainModify(1.5);
				}
			}
		},
	},
	"naturalcure": {
		inherit: true,
		onCheckShow: function (pokemon) {},
		onSwitchOut: function (pokemon) {
			if (!pokemon.status || pokemon.status === 'fnt') return;

			// Because statused/unstatused pokemon are shown after every switch
			// in gen 3-4, Natural Cure's curing is always known to both players

			this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure');
			pokemon.setStatus('');
		},
	},
	"pickup": {
		inherit: true,
		onResidualOrder: null,
		onResidualSubOrder: null,
		onResidual: function () {},
	},
	"plus": {
		inherit: true,
		shortDesc: "If an active Pokemon has the Ability Minus, this Pokemon's Sp. Atk is 1.5x.",
		onModifySpA: function (spa, pokemon) {
			let allActives = pokemon.side.active.concat(pokemon.side.foe.active);
			for (let i = 0; i < allActives.length; i++) {
				if (!allActives[i].fainted && allActives[i].hasAbility('minus')) {
					return this.chainModify(1.5);
				}
			}
		},
	},
	"poisonpoint": {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(3) < 1) {
					source.trySetStatus('psn', target);
				}
			}
		},
	},
	"pressure": {
		inherit: true,
		onStart: function () { },
	},
	"roughskin": {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 16, source, target);
			}
		},
	},
	"serenegrace": {
		inherit: true,
		onModifyMove: function (move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (let i = 0; i < move.secondaries.length; i++) {
					move.secondaries[i].chance *= 2;
				}
			}
		},
	},
	"shadowtag": {
		inherit: true,
		onFoeTrapPokemon: function (pokemon) {
			pokemon.trapped = true;
		},
	},
	"static": {
		inherit: true,
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.flags['contact']) {
				if (this.random(3) < 1) {
					source.trySetStatus('par', target);
				}
			}
		},
	},
	"stench": {
		inherit: true,
		onModifyMove: function () {},
	},
	"sturdy": {
		inherit: true,
		onDamage: function () {},
	},
	"synchronize": {
		inherit: true,
		onAfterSetStatus: function (status, target, source) {
			if (!source || source === target) return;
			let id = status.id;
			if (id === 'slp' || id === 'frz') return;
			if (id === 'tox') id = 'psn';
			source.trySetStatus(id);
		},
	},
	"trace": {
		inherit: true,
		onUpdate: function (pokemon) {
			if (!pokemon.isStarted) return;
			let target = pokemon.side.foe.randomActive();
			if (!target || target.fainted) return;
			let ability = this.getAbility(target.ability);
			let bannedAbilities = {forecast:1, multitype:1, trace:1};
			if (bannedAbilities[target.ability]) {
				return;
			}
			if (pokemon.setAbility(ability)) {
				this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
			}
		},
	},
	"voltabsorb": {
		inherit: true,
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Electric' && move.id !== 'thunderwave') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]');
				}
				return null;
			}
		},
	},
};
