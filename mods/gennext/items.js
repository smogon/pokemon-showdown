exports.BattleItems = {
	"burndrive": {
		id: "burndrive",
		name: "Burn Drive",
		spritenum: 103,
		fling: {
			basePower: 70
		},
		onBasePower: function (basePower, user, target, move) {
		},
		onDrive: 'Fire',
		desc: "Changes Genesect to Genesect-Burn."
	},
	"chilldrive": {
		id: "chilldrive",
		name: "Chill Drive",
		spritenum: 103,
		fling: {
			basePower: 70
		},
		onBasePower: function (basePower, user, target, move) {
		},
		onDrive: 'Ice',
		desc: "Changes Genesect to Genesect-Chill."
	},
	"dousedrive": {
		id: "dousedrive",
		name: "Douse Drive",
		spritenum: 103,
		fling: {
			basePower: 70
		},
		onBasePower: function (basePower, user, target, move) {
		},
		onDrive: 'Water',
		desc: "Changes Genesect to Genesect-Douse."
	},
	"shockdrive": {
		id: "shockdrive",
		name: "Shock Drive",
		spritenum: 103,
		fling: {
			basePower: 70
		},
		onBasePower: function (basePower, user, target, move) {
		},
		onDrive: 'Electric',
		desc: "Changes Genesect to Genesect-Shock."
	},
	"widelens": {
		inherit: true,
		onSourceModifyAccuracy: function (accuracy) {
			if (typeof accuracy === 'number') {
				return accuracy * 1.3;
			}
		}
	},
	"zoomlens": {
		inherit: true,
		onSourceModifyAccuracy: function (accuracy, target) {
			if (typeof accuracy === 'number' && !this.willMove(target)) {
				this.debug('Zoom Lens boosting accuracy');
				return accuracy * 1.6;
			}
		}
	},
	"bigroot": {
		inherit: true,
		onAfterMoveSecondarySelf: function (source, target) {
			if (source.hasType('Grass')) {
				this.heal(source.lastDamage / 8, source);
			}
		},
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual: function (pokemon) {
			if (pokemon.hasType('Grass')) {
				this.heal(pokemon.maxhp / 16);
			}
		}
	},
	"blacksludge": {
		inherit: true,
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual: function (pokemon) {
			if (pokemon.hasType('Poison')) {
				this.heal(pokemon.maxhp / (pokemon.getTypes().length === 1 ? 8 : 16));
			} else {
				this.damage(pokemon.maxhp / 8);
			}
		}
	},
	"focusband": {
		id: "focusband",
		name: "Focus Band",
		spritenum: 150,
		fling: {
			basePower: 10
		},
		onDamage: function (damage, target, source, effect) {
			var types = target.getTypes();
			if (types.length === 1 && types[0] === 'Fighting' &&
					effect && effect.effectType === 'Move' &&
					target.useItem()) {
				if (damage >= target.hp) {
					this.add("-message", target.name + " held on using its Focus Band!");
					return target.hp - 1;
				} else {
					this.add("-message", target.name + "'s Focus Band broke!");
				}
			}
		},
		num: 230,
		gen: 2,
		desc: "Holder has a 10% chance to survive an attack that would KO it with 1HP."
	},
	"wiseglasses": {
		inherit: true,
		onBasePower: function (basePower, user, target, move) {
			if (move.category === 'Special') {
				var types = user.getTypes();
				if (types.length === 1 && types[0] === 'Psychic') {
					return basePower * 1.2;
				}
				return basePower * 1.1;
			}
		}
	},
	"muscleband": {
		inherit: true,
		onBasePower: function (basePower, user, target, move) {
			if (move.category === 'Physical') {
				var types = user.getTypes();
				if (types.length === 1 && types[0] === 'Fighting') {
					return basePower * 1.2;
				}
				return basePower * 1.1;
			}
		}
	},
	"stick": {
		id: "stick",
		name: "Stick",
		fling: {
			basePower: 60
		},
		spritenum: 475,
		// The Stick is a stand-in for a number of pokemon-exclusive items
		// introduced with Gen Next
		onModifyMove: function (move, user) {
			if (user.template.species === 'Farfetch\'d') {
				move.critRatio += 2;
			}
		},
		onModifyDef: function (def, pokemon) {
			if (pokemon.template.species === 'Shuckle') {
				return def * 1.5;
			}
		},
		onModifySpA: function (spa, pokemon) {
			if (pokemon.template.species === 'Unown') {
				return spa * 2;
			}
		},
		onModifySpD: function (spd, pokemon) {
			if (pokemon.template.species === 'Unown') {
				return spd * 2;
			}
			if (pokemon.template.species === 'Shuckle') {
				return spd * 1.5;
			}
		},
		onModifySpe: function (spe, pokemon) {
			if (pokemon.template.species === 'Unown') {
				return spe * 2;
			}
		},
		onFoeBasePower: function (basePower, attacker, defender, move) {
			var GossamerWingUsers = {"Butterfree":1, "Masquerain":1, "Beautifly":1, "Mothim":1, "Vivillon":1};
			if (GossamerWingUsers[defender.template.species]) {
				if (move.type === 'Rock' || move.type === 'Electric' || move.type === 'Ice') {
					this.add('-message', "The attack was weakened by GoassamerWing!");
					return basePower / 2;
				}
			}
		},
		onDamage: function (damage, defender, attacker, effect) {
			var GossamerWingUsers = {"Butterfree":1, "Masquerain":1, "Beautifly":1, "Mothim":1, "Vivillon":1};
			if (GossamerWingUsers[defender.template.species]) {
				if (effect && effect.id === 'stealthrock') {
					return damage / 2;
				}
			}
		},
		onAfterMoveSecondarySelf: function (source, target, move) {
			var GossamerWingUsers = {"Butterfree":1, "Masquerain":1, "Beautifly":1, "Mothim":1, "Vivillon":1, "Venomoth":1, "Volcarona":1, "Dustox": 1, "Lilligant":1};
			if (move && move.effectType === 'Move' && move.category === 'Status' && GossamerWingUsers[source.template.species]) {
				this.heal(source.maxhp / 16);
			}
		},
		// onResidual: function (pokemon) {
		// 	if (pokemon.template.species === 'Shuckle') {
		// 		this.heal(this.clampIntRange(pokemon.maxhp / 16, 1));
		// 	}
		// },
		desc: "Raises Farfetch'd's critical hit rate two stages."
	}
};
