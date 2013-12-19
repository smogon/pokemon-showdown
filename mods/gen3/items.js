exports.BattleItems = {
	"blackbelt": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fighting') {
				return basePower * 1.1;
			}
		}
	},
	"blackglasses": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dark') {
				return basePower * 1.1;
			}
		}
	},
	"charcoal": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fire') {
				return basePower * 1.1;
			}
		}
	},
	"dragonfang": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dragon') {
				return basePower * 1.1;
			}
		}
	},
	"hardstone": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Rock') {
				return basePower * 1.1;
			}
		}
	},
	"lightball": {
		inherit: true,
		onModifyAtk: null
	},
	"magnet": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Electric') {
				return basePower * 1.1;
			}
		}
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
		}
	},
	"miracleseed": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Grass') {
				return basePower * 1.1;
			}
		}
	},
	"mysticwater": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Water') {
				return basePower * 1.1;
			}
		}
	},
	"nevermeltice": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ice') {
				return basePower * 1.1;
			}
		}
	},
	"poisonbarb": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Poison') {
				return basePower * 1.1;
			}
		}
	},
	"seaincense": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Water') {
				return basePower * 1.1;
			}
		}
	},
	"sharpbeak": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Flying') {
				return basePower * 1.1;
			}
		}
	},
	"silkscarf": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Normal') {
				return basePower * 1.1;
			}
		}
	},
	"silverpowder": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Bug') {
				return basePower * 1.1;
			}
		}
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
		}
	},
	"spelltag": {
		inherit: true,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ghost') {
				return basePower * 1.1;
			}
		}
	}
};
