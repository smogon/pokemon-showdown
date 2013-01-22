exports.BattleItems = {
	"burndrive": {
		id: "burndrive",
		name: "Burn Drive",
		spritenum: 103,
		fling: {
			basePower: 70
		},
		onStart: function (pokemon) {
			if (pokemon.species === 'Genesect') {
				this.add('-item', pokemon, 'Burn Drive');
				if (pokemon.transformInto('Genesect-Burn')) {
					this.add('-formechange', pokemon, 'Genesect-Burn');
				}
			}
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.id === 'technoblast') {
				return basePower * 1.1;
			}
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
		onStart: function (pokemon) {
			if (pokemon.species === 'Genesect') {
				this.add('-item', pokemon, 'Chill Drive');
				if (pokemon.transformInto('Genesect-Chill')) {
					this.add('-formechange', pokemon, 'Genesect-Chill');
				}
			}
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.id === 'technoblast') {
				return basePower * 1.1;
			}
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
		onStart: function (pokemon) {
			if (pokemon.species === 'Genesect') {
				this.add('-item', pokemon, 'Douse Drive');
				if (pokemon.transformInto('Genesect-Douse')) {
					this.add('-formechange', pokemon, 'Genesect-Douse');
				}
			}
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.id === 'technoblast') {
				return basePower * 1.1;
			}
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
		onStart: function (pokemon) {
			if (pokemon.species === 'Genesect') {
				this.add('-item', pokemon, 'Shock Drive');
				if (pokemon.transformInto('Genesect-Shock')) {
					this.add('-formechange', pokemon, 'Genesect-Shock');
				}
			}
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.id === 'technoblast') {
				return basePower * 1.1;
			}
		},
		onDrive: 'Electric',
		desc: "Changes Genesect to Genesect-Shock."
	},
	"widelens": {
		inherit: true,
		onModifyMove: function(move, user, target) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.3;
			}
		}
	},
	"zoomlens": {
		inherit: true,
		onModifyMove: function(move, user, target) {
			if (typeof move.accuracy === 'number' && !this.willMove(target)) {
				this.debug('Zoom Lens boosting accuracy');
				move.accuracy *= 1.6;
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
		onModifyMove: function(move, user) {
			if (user.template.species === 'Farfetch\'d') {
				move.critRatio += 2;
			}
		},
		onModifyDef: function(def, pokemon) {
			if (pokemon.template.species === 'Shuckle') {
				return def*1.5;
			}
		},
		onModifySpA: function(spa, pokemon) {
			if (pokemon.template.species === 'Unown') {
				return spa*2;
			}
		},
		onModifySpD: function(spd, pokemon) {
			if (pokemon.template.species === 'Unown') {
				return spd*2;
			}
			if (pokemon.template.species === 'Shuckle') {
				return spd*1.5;
			}
		},
		onModifySpe: function(spe, pokemon) {
			if (pokemon.template.species === 'Unown') {
				return spe*2;
			}
		},
		onFoeBasePower: function(basePower, attacker, defender, move) {
			var GossamerWingUsers = {"Butterfree":1, "Masquerain":1, "Beautifly":1, "Mothim":1};
			if (GossamerWingUsers[defender.template.species]) {
				if (move.type === 'Rock' || move.type === 'Electric' || move.type === 'Ice') {
					return basePower / 2;
				}
			}
		},
		onDamage: function(damage, defender, attacker, effect) {
			var GossamerWingUsers = {"Butterfree":1, "Masquerain":1, "Beautifly":1, "Mothim":1};
			if (GossamerWingUsers[defender.template.species]) {
				if (effect && effect.id === 'stealthrock') {
					return damage / 2;
				}
			}
		},
		// onResidual: function(pokemon) {
		// 	if (pokemon.template.species === 'Shuckle') {
		// 		this.heal(clampIntRange(pokemon.maxhp/16, 1));
		// 	}
		// },
		desc: "Raises Farfetch'd's critical hit rate two stages."
	},
};
