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
	dragonscale: {
		id: "dragonscale",
		name: "Dragon Scale",
		num: -3,
		gen: 2,
		desc: "Evolves Seadra into Kingdra. Raises power of Dragon-type moves by 10%."
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
			this.add('-activate', pokemon, 'item: Leppa Berry', move.name);
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
				return basePower * 1.125;
			}
		},
		gen: 2,
		desc: "Holder's Normal-type attacks have 1.125x power."
	},
	rawstberry: {
		inherit: true,
		gen: 2
	},
	sitrusberry: {
		inherit: true,
		gen: 2
	},
	thickclub: {
		inherit: true,
		// On Gen 2 this happens in stat calculation directly.
		onModifyAtk: function () {}
	}
};
