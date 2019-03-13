'use strict';

exports.BattleStatuses = {
	brn: {
		inherit: true,
		onResidual(pokemon) {
			this.damage(pokemon.maxhp * 0.0615);
		},
	},
	par: {
		inherit: true,
		onBeforeMove() {},
	},
	psn: {
		inherit: true,
		onResidual(pokemon) {
			this.damage(pokemon.maxhp * 0.125);
		},
	},
	chilled: {
		duration: 3,
		onStart(target, source, sourceEffect) {
			this.add('-start', target, 'chilled');
			this.add('-message', target.name + ' has been chilled!');
		},
		onEnd(target) {
			this.add('-end', target, 'chilled');
		},
		onModifySpe(speMod, pokemon) {
			return this.chain(speMod, 0.1);
		},
	},
	bleeding: {
		duration: 5,
		onStart(target) {
			this.add('-start', target, 'bleeding');
			this.add('-message', target.name + ' is bleeding!');
		},
		onEnd(target) {
			this.add('-end', target, 'bleeding');
		},
		onResidual(pokemon) {
			this.damage(pokemon.maxhp * 0.0615);
		},
	},
	taunting: {
		duration: 4,
		onStart(target) {
			this.add('-start', target, 'taunting');
			this.add('-message', target.name + ' is taunting its enemies!');
		},
		onEnd(target) {
			this.add('-end', target, 'taunting');
		},
		onFoeRedirectTarget(target, source, source2, move) {
			if (this.validTarget(this.effectData.target, source, move.target)) {
				return this.effectData.target;
			}
		},
	},
	sacrifice: {
		duration: 4,
		onStart(target) {
			this.add('-start', target, 'sacrifice');
			this.add('-message', target.name + ' is sacrificing itself for its teammates!');
		},
		onEnd(target) {
			this.add('-end', target, 'sacrifice');
		},
		onAnyDamage(damage, target, source, effect) {
			for (let i = 0; i < target.side.active.length; i++) {
				if (target !== target.side.active[i] && target.side.active[i].volatiles['sacrifice']) {
					this.add('-message', target.side.active[i].name + "'s Sacrifice took " + target.name + "'s damage!");
					this.directDamage(damage, target.side.active[i], source, {id: 'sacrifice'});
					return 0;
				}
			}
			return;
		},
	},
	corruption: {
		duration: 4,
		onStart(target) {
			this.add('-start', target, 'corruption');
		},
		onEnd(target) {
			this.add('-end', target, 'corruption');
		},
		onResidual(pokemon) {
			this.damage(pokemon.maxhp * 0.1);
			this.add('-message', pokemon.name + ' took Corruption damage!');
		},
	},
	wildgrowth: {
		duration: 5,
		onStart(side) {
			this.add('-sidestart', side, 'Wild Growth');
		},
		onResidualOrder: 21,
		onResidual(side) {
			for (let i = 0; i < side.active.length; i++) {
				let pokemon = side.active[i];
				if (pokemon.hp < pokemon.maxhp) {
					this.heal(pokemon.maxhp * 0.125, pokemon, pokemon);
					this.add('-message', 'The wild growth recovered some of ' + pokemon.name + "'s HP!");
				}
			}
		},
		onEnd(side) {
			this.add('-sideend', side, 'Wild Growth');
		},
	},
	powershield: {
		onStart(pokemon) {
			this.add('-start', pokemon, 'Power Shield');
			this.add('-message', pokemon.name + ' has been shielded!');
		},
		onDamage(damage, target, source, effect) {
			let h = Math.ceil(damage / 4);
			this.heal(h, target, target);
			this.add('-message', target.name + "'s Power Shield healed it for " + h + "!");
			target.removeVolatile('powershield');
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Power Shield');
		},
	},
	rejuvenation: {
		duration: 3,
		onStart(pokemon) {
			this.add('-start', pokemon, 'Rejuvenation');
			this.add('-message', pokemon.name + ' is rejuvenating!');
		},
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			this.heal(pokemon.maxhp * 0.18);
			this.add('-message', pokemon.name + ' healed due to its rejuvenation!');
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Rejuvenation');
		},
	},
	fairyward: {
		duration: 3,
		onSetStatus(status, target, source, effect) {
			if (source && target !== source && effect && (!effect.infiltrates || target.side === source.side)) {
				return false;
			}
		},
		onTryConfusion(target, source, effect) {
			if (source && target !== source && effect && (!effect.infiltrates || target.side === source.side)) {
				return false;
			}
		},
		onStart(side) {
			this.add('-sidestart', side, 'Fairy Ward');
		},
		onResidualOrder: 21,
		onResidualSubOrder: 2,
		onEnd(side) {
			this.add('-sideend', side, 'Fairy Ward');
		},
		onDamagePriority: -10,
		onDamage(damage, target, source, effect) {
			return Math.ceil(damage * 0.95);
		},
	},
	penance: {
		onStart(pokemon) {
			this.add('-start', pokemon, 'Penance');
		},
		onDamagePriority: -10,
		onDamage(damage, target, source, effect) {
			let d = Math.ceil(damage * 0.0615);
			this.heal(d, target, target);
			this.add('-message', target.name + "'s Penance healed it for " + d + "!");
			target.removeVolatile('penance');
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Penance');
		},
	},
	barkskin: {
		duration: 2,
		onStart(target) {
			this.add('-start', target, 'move: Barkskin');
		},
		onEnd(target) {
			this.add('-end', target, 'move: Barkskin');
		},
		onDamage(damage, target, source, effect) {
			this.add('-message', target.name + "'s Barkskin reduced the damage!");
			return Math.ceil(damage * 0.75);
		},
	},
	laststand: {
		duration: 1,
		onStart(target) {
			this.add('-singleturn', target, 'move: Last Stand');
		},
		onDamage(damage, target, source, effect) {
			let originalDamage = damage;
			damage = Math.ceil(damage / 2);
			if (damage >= target.hp) damage = target.hp - 1;
			this.add('-message', target.name + "'s Last Stand made it take " + (originalDamage - damage) + " damage less!");
			return damage;
		},
	},
	moonfire: {
		duration: 4,
		onStart(target) {
			this.add('-start', target, 'move: Moonfire');
		},
		onEnd(target) {
			this.add('-end', target, 'move: Moonfire');
		},
		onResidual(pokemon) {
			this.damage(pokemon.maxhp * 0.06);
			this.add('-message', pokemon.name + ' took Moonfire damage!');
		},
	},
	slowdown: {
		duration: 3,
		onModifyDamage(damage, source, target, move) {
			if (source.volatiles['slowdown']) {
				damage = Math.floor(damage * 0.85);
			}
			return damage;
		},
	},
	sacredshield: {
		duration: 4,
		onStart(target) {
			this.add('-start', target, 'move: Sacred Shield');
		},
		onEnd(target) {
			this.add('-end', target, 'move: Sacred Shield');
		},
		onDamagePriority: -10,
		onDamage(damage, target, source, effect) {
			let d = Math.ceil(damage * 0.25);
			damage -= d;
			this.add('-message', target.name + "'s Sacred Shield protected it for " + d + "!");
			target.removeVolatile('sacredshield');
			return damage;
		},
	},
};
