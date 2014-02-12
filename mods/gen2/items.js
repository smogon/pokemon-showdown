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
	blackbelt: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fighting') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Fighting-type attacks have 1.1x power."
	},
	blackglasses: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dark') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Dark-type attacks have 1.1x power."
	},
	charcoal: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fire') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Fire-type attacks have 1.1x power."
	},
	dragonfang: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dragon') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Dragon-type attacks have 1.1x power."
	},
	dragonscale: {
		id: "dragonscale",
		name: "Dragon Scale",
		num: -3,
		gen: 2,
		desc: "Evolves Seadra into Kingdra. Raises power of Dragon-type moves by 10%."
	},
	hardstone: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Rock') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Rock-type attacks have 1.1x power."
	},
	lightball: {
		inherit: true,
		onModifyAtk: function() { }
	},
	magnet: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Electric') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Electric-type attacks have 1.1x power."
	},
	metalcoat: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Steel') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Steel-type attacks have 1.1x power."
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
	},
	miracleseed: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Grass') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Grass-type attacks have 1.1x power."
	},
	mysticwater: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Water') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Water-type attacks have 1.1x power."
	},
	nevermeltice: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ice') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Ice-type attacks have 1.1x power."
	},
	poisonbarb: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Poison') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Poison-type attacks have 1.1x power."
	},
	sharpbeak: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Flying') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Flying-type attacks have 1.1x power."
	},
	silkscarf: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Normal') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Normal-type attacks have 1.1x power."
	},
	silverpowder: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Bug') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Bug-type attacks have 1.1x power."
	},
	softsand: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ground') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Ground-type attacks have 1.1x power."
	},
	spelltag: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ghost') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Ghost-type attacks have 1.1x power."
	},
	twistedspoon: {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Psychic') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Psychic-type attacks have 1.1x power."
	}
};