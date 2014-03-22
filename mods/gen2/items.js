exports.BattleItems = {
	amuletcoin: {
		id: "amuletcoin",
		name: "Amulet Coin",
		num: -1,
		gen: 2,
		desc: "Doubles the amount of money received in trainer battles."
	},
	berry: {
		id: "berry",
		name: "Berry",
		isBerry: true,
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/2) pokemon.eatItem();
		},
		onEat: function(pokemon) {
			this.heal(10);
		},
		num: -2,
		gen: 2,
		desc: "Restores 10 HP when the holder of this item is at 50% HP or less. One-time use."
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