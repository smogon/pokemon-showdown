'use strict';

exports.BattleItems = {
	aguavberry: {
		inherit: true,
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -SpD Nature. Single use.",
		onUpdate: function (pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat: function (pokemon) {
			this.heal(pokemon.maxhp / 8);
			if (pokemon.getNature().minus === 'spd') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	belueberry: {
		inherit: true,
		isUnreleased: false,
	},
	bigroot: {
		inherit: true,
		desc: "Holder gains 1.3x HP from draining moves, Aqua Ring, Ingrain, and Leech Seed.",
	},
	cornnberry: {
		inherit: true,
		isUnreleased: false,
	},
	custapberry: {
		inherit: true,
		isUnreleased: false,
	},
	durinberry: {
		inherit: true,
		isUnreleased: false,
	},
	enigmaberry: {
		inherit: true,
		isUnreleased: false,
	},
	figyberry: {
		inherit: true,
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -Atk Nature. Single use.",
		onUpdate: function (pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat: function (pokemon) {
			this.heal(pokemon.maxhp / 8);
			if (pokemon.getNature().minus === 'atk') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	iapapaberry: {
		inherit: true,
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -Def Nature. Single use.",
		onUpdate: function (pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat: function (pokemon) {
			this.heal(pokemon.maxhp / 8);
			if (pokemon.getNature().minus === 'def') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	jabocaberry: {
		inherit: true,
		isUnreleased: false,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.category === 'Physical') {
				if (target.eatItem()) {
					this.damage(source.maxhp / 8, source, target, null, true);
				}
			}
		},
	},
	lightclay: {
		inherit: true,
		desc: "Holder's use of Light Screen or Reflect lasts 8 turns instead of 5.",
	},
	machobrace: {
		inherit: true,
		isUnreleased: false,
	},
	magoberry: {
		inherit: true,
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -Spe Nature. Single use.",
		onUpdate: function (pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat: function (pokemon) {
			this.heal(pokemon.maxhp / 8);
			if (pokemon.getNature().minus === 'spe') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	magostberry: {
		inherit: true,
		isUnreleased: false,
	},
	micleberry: {
		inherit: true,
		isUnreleased: false,
	},
	nanabberry: {
		inherit: true,
		isUnreleased: false,
	},
	nomelberry: {
		inherit: true,
		isUnreleased: false,
	},
	pamtreberry: {
		inherit: true,
		isUnreleased: false,
	},
	rabutaberry: {
		inherit: true,
		isUnreleased: false,
	},
	razzberry: {
		inherit: true,
		isUnreleased: false,
	},
	rockyhelmet: {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 6, source, target, null, true);
			}
		},
	},
	rowapberry: {
		inherit: true,
		isUnreleased: false,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.category === 'Special') {
				if (target.eatItem()) {
					this.damage(source.maxhp / 8, source, target, null, true);
				}
			}
		},
	},
	spelonberry: {
		inherit: true,
		isUnreleased: false,
	},
	souldew: {
		inherit: true,
		desc: "If held by a Latias or a Latios, its Sp. Atk and Sp. Def are 1.5x.",
		onBasePower: function () {},
		onModifySpAPriority: 1,
		onModifySpA: function (spa, pokemon) {
			if (pokemon.baseTemplate.num === 380 || pokemon.baseTemplate.num === 381) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD: function (spd, pokemon) {
			if (pokemon.baseTemplate.num === 380 || pokemon.baseTemplate.num === 381) {
				return this.chainModify(1.5);
			}
		},
	},
	watmelberry: {
		inherit: true,
		isUnreleased: false,
	},
	wepearberry: {
		inherit: true,
		isUnreleased: false,
	},
	wikiberry: {
		inherit: true,
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -SpA Nature. Single use.",
		onUpdate: function (pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat: function (pokemon) {
			this.heal(pokemon.maxhp / 8);
			if (pokemon.getNature().minus === 'spa') {
				pokemon.addVolatile('confusion');
			}
		},
	},
};
