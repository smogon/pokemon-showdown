export const Items: {[k: string]: ModdedItemData} = {
	aguavberry: {
		inherit: true,
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -SpD Nature. Single use.",
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'spd') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	belueberry: {
		inherit: true,
		isNonstandard: null,
	},
	bigroot: {
		inherit: true,
		desc: "Holder gains 1.3x HP from draining moves, Aqua Ring, Ingrain, and Leech Seed.",
	},
	cornnberry: {
		inherit: true,
		isNonstandard: null,
	},
	durinberry: {
		inherit: true,
		isNonstandard: null,
	},
	energypowder: {
		name: "Energy Powder",
		spritenum: 123,
		fling: {
			basePower: 30,
		},
		num: 34,
		gen: 2,
		desc: "Restores 50 HP to one Pokemon but lowers Happiness.",
	},
	figyberry: {
		inherit: true,
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -Atk Nature. Single use.",
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'atk') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	iapapaberry: {
		inherit: true,
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -Def Nature. Single use.",
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'def') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	jabocaberry: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical') {
				if (target.eatItem()) {
					this.damage(source.baseMaxhp / 8, source, target, null, true);
				}
			}
		},
	},
	lifeorb: {
		inherit: true,
		onAfterMoveSecondarySelf(source, target, move) {
			if (source && source !== target && move && move.category !== 'Status' && !move.ohko) {
				this.damage(source.baseMaxhp / 10, source, source, this.dex.getItem('lifeorb'));
			}
		},
	},
	lightclay: {
		inherit: true,
		desc: "Holder's use of Light Screen or Reflect lasts 8 turns instead of 5.",
	},
	machobrace: {
		inherit: true,
		isNonstandard: null,
	},
	magoberry: {
		inherit: true,
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -Spe Nature. Single use.",
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'spe') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	magostberry: {
		inherit: true,
		isNonstandard: null,
	},
	nanabberry: {
		inherit: true,
		isNonstandard: null,
	},
	nomelberry: {
		inherit: true,
		isNonstandard: null,
	},
	oldamber: {
		inherit: true,
		isNonstandard: null,
	},
	pamtreberry: {
		inherit: true,
		isNonstandard: null,
	},
	rabutaberry: {
		inherit: true,
		isNonstandard: null,
	},
	razzberry: {
		inherit: true,
		isNonstandard: null,
	},
	rockyhelmet: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				this.damage(source.baseMaxhp / 6, source, target, null, true);
			}
		},
	},
	rowapberry: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Special') {
				if (target.eatItem()) {
					this.damage(source.baseMaxhp / 8, source, target, null, true);
				}
			}
		},
	},
	spelonberry: {
		inherit: true,
		isNonstandard: null,
	},
	souldew: {
		inherit: true,
		desc: "If held by a Latias or a Latios, its Sp. Atk and Sp. Def are 1.5x.",
		onBasePower() {},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.num === 380 || pokemon.baseSpecies.num === 381) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.num === 380 || pokemon.baseSpecies.num === 381) {
				return this.chainModify(1.5);
			}
		},
	},
	watmelberry: {
		inherit: true,
		isNonstandard: null,
	},
	wepearberry: {
		inherit: true,
		isNonstandard: null,
	},
	wikiberry: {
		inherit: true,
		desc: "Restores 1/8 max HP at 1/2 max HP or less; confuses if -SpA Nature. Single use.",
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'spa') {
				pokemon.addVolatile('confusion');
			}
		},
	},
};
