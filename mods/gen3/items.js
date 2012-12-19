exports.BattleItems = {
	"blackbelt": {
		id: "blackbelt",
		name: "Black Belt",
		spritenum: 32,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fighting') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Fighting-type moves 10%."
	},
	"blackglasses": {
		id: "blackglasses",
		name: "BlackGlasses",
		spritenum: 35,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dark') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Dark-type moves 10%."
	},
	"charcoal": {
		id: "charcoal",
		name: "Charcoal",
		spritenum: 61,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Fire') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Fire-type moves 10%."
	},
	"custapberry": {
		id: "custapberry",
		name: "Custap Berry",
		spritenum: 86,
		isBerry: true,
		onBeforeTurn: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/4 || (pokemon.hp <= pokemon.maxhp/2 && pokemon.ability === 'Gluttony')) {
				var decision = this.willMove(pokemon);
				if (!decision) return;
				this.addQueue({
					choice: 'event',
					event: 'Custap',
					priority: decision.priority + .1,
					pokemon: decision.pokemon,
					move: decision.move,
					target: decision.target
				});
			}
		},
		onCustap: function(pokemon) {
			var decision = this.willMove(pokemon);
			this.debug('custap decision: '+decision);
			if (decision) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			var decision = this.willMove(pokemon);
			this.debug('custap eaten: '+decision);
			if (decision) {
				this.cancelDecision(pokemon);
				this.add('r-custap '+pokemon.id);
				this.runDecision(decision);
			}
		},
		desc: "Activates at 25% HP. Next move used goes first. One-time use."
	},
	"dragonfang": {
		id: "dragonfang",
		name: "Dragon Fang",
		spritenum: 106,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Dragon') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Dragon-type moves 10%."
	},
	"hardstone": {
		id: "hardstone",
		name: "Hard Stone",
		spritenum: 187,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Rock') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Rock-type moves 10%."
	},
	"lightball": {
		id: "lightball",
		name: "Light Ball",
		spritenum: 251,
		fling: {
			basePower: 30,
			status: 'par'
		},
		onModifyStats: function(stats, pokemon) {
			if (pokemon.template.species === 'Pikachu') {
				stats.spa *= 2;
			}
		},
		desc: "Doubles Pikachu's Attack and Special Attack."
	},
	"magnet": {
		id: "magnet",
		name: "Magnet",
		spritenum: 273,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Electric') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Electric-type moves 10%."
	},
	"mentalherb": {
		id: "mentalherb",
		name: "Mental Herb",
		spritenum: 285,
		effect: function(pokemon) {
			var conditions = ['attract'];
			for (var i=0; i<conditions.length; i++) {
				if (pokemon.volatiles[conditions[i]]) {
					for (var j=0; j<conditions.length; j++) {
						pokemon.removeVolatile(conditions[j]);
					}
					return;
				}
			}
		}
	},
	"metalcoat": {
		id: "metalcoat",
		name: "Metal Coat",
		spritenum: 286,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Steel') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Steel-type moves 10%. Evolves Onix and Scyther."
	},
	"miracleseed": {
		id: "miracleseed",
		name: "Miracle Seed",
		spritenum: 292,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Grass') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Grass-type moves 10%."
	},
	"mysticwater": {
		id: "mysticwater",
		name: "Mystic Water",
		spritenum: 300,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Water') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Water-type moves 10%."
	},
	"nevermeltice": {
		id: "nevermeltice",
		name: "NeverMeltIce",
		spritenum: 305,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ice') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Ice-type moves 10%."
	},
	"poisonbarb": {
		id: "poisonbarb",
		name: "Poison Barb",
		spritenum: 343,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Poison') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Poison-type moves 10%."
	},
	"seaincense": {
		id: "seaincense",
		name: "Sea Incense",
		spritenum: 430,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Water') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Water-type moves 10%. Allows breeding of Azurill."
	},
	"sharpbeak": {
		id: "sharpbeak",
		name: "Sharp Beak",
		spritenum: 436,
		onBasePower: function(basePower, user, target, move) {
			if (move && move.type === 'Flying') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Flying-type moves 10%."
	},
	"silkscarf": {
		id: "silkscarf",
		name: "Silk Scarf",
		spritenum: 444,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Normal') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Normal-type moves 10%."
	},
	"silverpowder": {
		id: "silverpowder",
		name: "SilverPowder",
		spritenum: 447,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Bug') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Bug-type moves 10%."
	},
	"sitrusberry": {
		id: "sitrusberry",
		name: "Sitrus Berry",
		spritenum: 448,
		isBerry: true,
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/2) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			this.heal(30);
		},
		desc: "Restores 30 HP when at 50% HP or less. One-time use."
	},
	"softsand": {
		id: "softsand",
		name: "Soft Sand",
		spritenum: 456,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ground') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Ground-type moves 10%."
	},
	"spelltag": {
		id: "spelltag",
		name: "Spell Tag",
		spritenum: 461,
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Ghost') {
				return basePower * 1.1;
			}
		},
		desc: "Raises power of Ghost-type moves 10%."
	}
};
