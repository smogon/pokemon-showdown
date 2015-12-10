'use strict';

exports.BattleItems = {
	amuletcoin: {
		id: "amuletcoin",
		name: "Amulet Coin",
		num: -1,
		gen: 2,
		desc: "Doubles the amount of money received in trainer battles."
	},
	aspearberry: {
		inherit: true,
		gen: 2
	},
	berserkgene: {
		id: "berserkgene",
		name: "Berserk Gene",
		onUpdate: function (pokemon) {
			this.boost({atk: 2});
			pokemon.addVolatile('confusion');
			pokemon.setItem('');
		},
		gen: 2,
		desc: "Raises attack by 2 when holder is switched in. Confuses holder. Single use."
	},
	cheriberry: {
		inherit: true,
		gen: 2
	},
	chestoberry: {
		inherit: true,
		gen: 2
	},
	dragonfang: {
		inherit: true,
		onBasePower: function () {},
		desc: "No competitive use."
	},
	dragonscale: {
		id: "dragonscale",
		name: "Dragon Scale",
		num: -3,
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Dragon') {
				return basePower * 1.1;
			}
		},
		gen: 2,
		desc: "Evolves Seadra into Kingdra when traded. Dragon-type attacks have 1.1x power."
	},
	metalpowder: {
		inherit: true,
		// On Gen 2 this happens in stat calculation directly.
		onModifyDef: function () {},
		onModifySpD: function () {}
	},
	leppaberry: {
		inherit: true,
		onEat: function (pokemon) {
			var move;
			if (pokemon.volatiles['leppaberry']) {
				move = pokemon.volatiles['leppaberry'].move;
				pokemon.removeVolatile('leppaberry');
			} else {
				var pp = 99;
				for (var i in pokemon.moveset) {
					if (pokemon.moveset[i].pp < pp) {
						move = pokemon.moveset[i];
						pp = move.pp;
					}
				}
			}
			move.pp += 5;
			if (move.pp > move.maxpp) move.pp = move.maxpp;
			this.add('-activate', pokemon, 'item: Leppa Berry', move.move);
		},
		gen: 2,
		desc: "Restores 5PP to the first of the holder's moves to reach 0PP. Single use."
	},
	lightball: {
		inherit: true,
		// On Gen 2 this happens in stat calculation directly.
		onModifyAtk: function () {},
		onModifySpA: function () {}
	},
	luckypunch: {
		inherit: true,
		onModifyMove: function (move, user) {
			if (user.template.species === 'Chansey') {
				move.critRatio = 3;
			}
		}
	},
	lumberry: {
		inherit: true,
		gen: 2
	},
	oranberry: {
		inherit: true,
		gen: 2
	},
	pechaberry: {
		inherit: true,
		gen: 2
	},
	persimberry: {
		inherit: true,
		gen: 2
	},
	pinkbow: {
		id: "pinkbow",
		name: "Pink Bow",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Normal') {
				return basePower * 1.1;
			}
		},
		gen: 2,
		desc: "Holder's Normal-type attacks have 1.1x power."
	},
	polkadotbow: {
		id: "polkadotbow",
		name: "Polkadot Bow",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Normal') {
				return basePower * 1.1;
			}
		},
		gen: 2,
		desc: "Holder's Normal-type attacks have 1.1x power."
	},
	rawstberry: {
		inherit: true,
		gen: 2
	},
	sitrusberry: {
		inherit: true,
		gen: 2
	},
	stick: {
		inherit: true,
		onModifyMove: function (move, user) {
			if (user.template.species === 'Farfetch\'d') {
				move.critRatio = 3;
			}
		}
	},
	thickclub: {
		inherit: true,
		// On Gen 2 this happens in stat calculation directly.
		onModifyAtk: function () {}
	}
};
