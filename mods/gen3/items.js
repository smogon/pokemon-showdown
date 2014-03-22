exports.BattleItems = {
	"blackbelt": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fighting') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Fighting-type attacks have 1.1x power."
	},
	"blackglasses": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dark') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Dark-type attacks have 1.1x power."
	},
	"charcoal": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fire') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Fire-type attacks have 1.1x power."
	},
	"dragonfang": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dragon') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Dragon-type attacks have 1.1x power."
	},
	"hardstone": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Rock') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Rock-type attacks have 1.1x power."
	},
	"lightball": {
		inherit: true,
		onModifyAtk: function() { }
	},
	"magnet": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Electric') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Electric-type attacks have 1.1x power."
	},
	"mentalherb": {
		inherit: true,
		onUpdate: function(pokemon) {
			if (pokemon.volatiles.attract && pokemon.useItem()) {
				pokemon.removeVolatile('attract');
			}
		}
	},
	"metalcoat": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Steel') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Steel-type attacks have 1.1x power."
	},
	"miracleseed": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Grass') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Grass-type attacks have 1.1x power."
	},
	"mysticwater": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Water') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Water-type attacks have 1.1x power."
	},
	"nevermeltice": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ice') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Ice-type attacks have 1.1x power."
	},
	"poisonbarb": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Poison') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Poison-type attacks have 1.1x power."
	},
	"seaincense": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Water') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Water-type attacks have 1.1x power."
	},
	"sharpbeak": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Flying') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Flying-type attacks have 1.1x power."
	},
	"silkscarf": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Normal') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Normal-type attacks have 1.1x power."
	},
	"silverpowder": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Bug') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Bug-type attacks have 1.1x power."
	},
	"sitrusberry": {
		inherit: true,
		onEat: function(pokemon) {
			this.heal(30);
		}
	},
	"softsand": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ground') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Ground-type attacks have 1.1x power."
	},
	"spelltag": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ghost') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Ghost-type attacks have 1.1x power."
	},
	"twistedspoon": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Psychic') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Psychic-type attacks have 1.1x power."
	}
};
