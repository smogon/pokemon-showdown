exports.BattleItems = {
	amuletcoin: {
		id: "amuletcoin",
		name: "Amulet Coin",
		num: -1,
		gen: 2,
		desc: "Doubles the amount of money received in trainer battles."
	},
	berry: {
	
	},
	dragonfang: {
		inherit: true,
		onBasePower: null
	},
	dragonscale: {
		id: "dragonscale",
		name: "Dragon Scale",
		num: -1,
		gen: 2,
		desc: "Evolves Seadra into Kingdra. Raises power of Dragon-type moves by 10%."
	},
	lightball: {
		inherit: true,
		onModifyAtk: null
	},
	metalpowder: {
		inherit: true,
		onModifyDef: function(def, pokemon) {
			if (pokemon.template.species === 'Ditto') {
				return def * 1.5;
			}
		},
		onModifySpD: function(def, pokemon) {
			if (pokemon.template.species === 'Ditto') {
				return def * 1.5;
			}
		}
	}
};