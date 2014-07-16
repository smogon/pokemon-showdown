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
			pokemon.addVolatile('confuse');
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
		onModifyDef: function (def, pokemon) {
			if (pokemon.template.species === 'Ditto') {
				return def * 1.5;
			}
		},
		onModifySpD: function (def, pokemon) {
			if (pokemon.template.species === 'Ditto') {
				return def * 1.5;
			}
		}
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
			this.add("-message", pokemon.name + " restored " + move.move + "'s PP using its Leppa Berry! (placeholder)");
		},
		gen: 2,
		desc: "Restores 5PP to the first of the holder's moves to reach 0PP. Single use."
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
	}
};
