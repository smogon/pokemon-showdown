'use strict';

exports.BattleAbilities = {
	"cutecharm": {
		inherit: true,
		desc: "There is a 1/3 chance a Pokemon making contact with this Pokemon will become infatuated if it is of the opposite gender.",
		shortDesc: "1/3 chance of infatuating Pokemon of the opposite gender if they make contact.",
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
		desc: "10% chance a Pokemon making contact with this Pokemon will be poisoned, paralyzed, or fall asleep.",
		shortDesc: "10% chance of poison/paralysis/sleep on others making contact with this Pokemon.",
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
		shortDesc: "1/3 chance a Pokemon making contact with this Pokemon will be burned.",
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
		desc: "This Pokemon is immune to Fire-type moves, as long as it is not frozen. The first time it is hit by a Fire-type move, damage from its Fire-type attacks will be multiplied by 1.5 as long as it remains active and has this Ability. If this Pokemon has a major status condition, is a Fire type, or has a substitute, Will-O-Wisp will not activate this Ability.",
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
		desc: "If this Pokemon is not the target of a single-target Electric-type move used by an opposing Pokemon, this Pokemon redirects that move to itself. This effect considers Hidden Power a Normal-type move.",
		shortDesc: "This Pokemon draws single-target Electric moves used by opponents to itself.",
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
		desc: "If an active Pokemon has the Ability Plus, this Pokemon's Special Attack is multiplied by 1.5.",
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
	"plus": {
		inherit: true,
		desc: "If an active Pokemon has the Ability Minus, this Pokemon's Special Attack is multiplied by 1.5.",
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
		shortDesc: "1/3 chance a Pokemon making contact with this Pokemon will be poisoned.",
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
		desc: "Pokemon making contact with this Pokemon lose 1/16 of their maximum HP, rounded down.",
		shortDesc: "Pokemon making contact with this Pokemon lose 1/16 of their max HP.",
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 16, source, target);
			}
		},
	},
	"shadowtag": {
		inherit: true,
		desc: "Prevents opposing Pokemon from choosing to switch out.",
		shortDesc: "Prevents opposing Pokemon from choosing to switch out.",
		onFoeTrapPokemon: function (pokemon) {
			pokemon.trapped = true;
		},
	},
	"static": {
		inherit: true,
		shortDesc: "1/3 chance a Pokemon making contact with this Pokemon will be paralyzed.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.flags['contact']) {
				if (this.random(3) < 1) {
					source.trySetStatus('par', target);
				}
			}
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
		desc: "This Pokemon is immune to damaging Electric-type moves and restores 1/4 of its maximum HP, rounded down, when hit by one.",
		shortDesc: "This Pokemon heals 1/4 its max HP when hit by a damaging Electric move; immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Electric' && move.id !== 'thunderwave') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]');
				}
				return null;
			}
		},
	},
	"wonderguard": {
		inherit: true,
		shortDesc: "This Pokemon is only damaged by supereffective moves and indirect damage.",
	},
};
