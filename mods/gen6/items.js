'use strict';

exports.BattleItems = {
	abomasite: {
		inherit: true,
		isUnreleased: false,
	},
	aggronite: {
		inherit: true,
		isUnreleased: false,
	},
	aguavberry: {
		inherit: true,
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
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -SpD Nature. Single use.",
	},
	altarianite: {
		inherit: true,
		isUnreleased: false,
	},
	ampharosite: {
		inherit: true,
		isUnreleased: false,
	},
	audinite: {
		inherit: true,
		isUnreleased: false,
	},
	banettite: {
		inherit: true,
		isUnreleased: false,
	},
	beedrillite: {
		inherit: true,
		isUnreleased: false,
	},
	belueberry: {
		inherit: true,
		isUnreleased: false,
	},
	blazikenite: {
		inherit: true,
		isUnreleased: false,
	},
	cameruptite: {
		inherit: true,
		isUnreleased: false,
	},
	cornnberry: {
		inherit: true,
		isUnreleased: false,
	},
	custapberry: {
		inherit: true,
		isUnreleased: false,
	},
	diancite: {
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
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -Atk Nature. Single use.",
	},
	galladite: {
		inherit: true,
		isUnreleased: false,
	},
	gardevoirite: {
		inherit: true,
		isUnreleased: false,
	},
	heracronite: {
		inherit: true,
		isUnreleased: false,
	},
	houndoominite: {
		inherit: true,
		isUnreleased: false,
	},
	iapapaberry: {
		inherit: true,
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
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -Def Nature. Single use.",
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
	latiasite: {
		inherit: true,
		isUnreleased: false,
	},
	latiosite: {
		inherit: true,
		isUnreleased: false,
	},
	lightclay: {
		inherit: true,
		desc: "Holder's use of Light Screen or Reflect lasts 8 turns instead of 5.",
	},
	lopunnite: {
		inherit: true,
		isUnreleased: false,
	},
	machobrace: {
		inherit: true,
		isUnreleased: false,
	},
	magoberry: {
		inherit: true,
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
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -Spe Nature. Single use.",
	},
	magostberry: {
		inherit: true,
		isUnreleased: false,
	},
	manectite: {
		inherit: true,
		isUnreleased: false,
	},
	mawilite: {
		inherit: true,
		isUnreleased: false,
	},
	medichamite: {
		inherit: true,
		isUnreleased: false,
	},
	mewtwonitex: {
		inherit: true,
		isUnreleased: false,
	},
	mewtwonitey: {
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
	pidgeotite: {
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
	sceptilite: {
		inherit: true,
		isUnreleased: false,
	},
	spelonberry: {
		inherit: true,
		isUnreleased: false,
	},
	steelixite: {
		inherit: true,
		isUnreleased: false,
	},
	swampertite: {
		inherit: true,
		isUnreleased: false,
	},
	tyranitarite: {
		inherit: true,
		isUnreleased: false,
	},
	souldew: {
		id: "souldew",
		name: "Soul Dew",
		spritenum: 459,
		fling: {
			basePower: 30,
		},
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
		num: 225,
		gen: 3,
		desc: "If holder is a Latias or a Latios, its Sp. Atk and Sp. Def are 1.5x.",
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
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -SpA Nature. Single use.",
	},
};
