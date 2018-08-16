'use strict';

/**@type {{[k: string]: ModdedAbilityData}} */
let BattleAbilities = {
	/*
	// Example
	"abilityid": {
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		id: "abilityid",
		name: "Ability Name",
		// The bulk of an ability is not easily shown in an example since it varies
		// For more examples, see https://github.com/Zarel/Pokemon-Showdown/blob/master/data/abilities.js
	},
	*/
	// Please keep abilites organized alphabetically based on staff member name!
	// cc
	lurking: {
		desc: "",
		shortDesc: "",
		id: "lurking",
		name: "Lurking",
		onModifyMove: function (move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.3;
			}
		},
	},
	// Megazard
	standuptall: {
		desc: "This Pokemon's Defense or Special Defense is raised 1 stage at the end of each full turn on the field.",
		shortDesc: "This Pokemon's Def or Spd is raised 1 stage at the end of each full turn on the field.",
		id: "standuptall",
		name: "Stand Up Tall",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.activeTurns) {
				if (this.randomChance(1, 2)) {
					this.boost({def: 1});
				} else {
					this.boost({spd: 1});
				}
			}
		},
	},
	// torkool
	deflectiveshell: {
		desc: "Non-contact moves do 33% less damage to this pokemon.",
		shortDesc: "Non-contact moves do 33% less damage to this pokemon.",
		id: "deflectiveshell",
		name: "Deflective Shell",
		onSourceModifyDamage: function (damage, source, target, move) {
			let mod = 1;
			if (!move.flags['contact']) mod = (mod / 3) * 2; // 2/3
			return this.chainModify(mod);
		},
	},
};

exports.BattleAbilities = BattleAbilities;
