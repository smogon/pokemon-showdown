'use strict';

exports.BattlePokedex = {
	// Eevee General
	eevee: {
		inherit: true,
		baseStats: {hp:80, atk:80, def:75, spa:70, spd:90, spe:80},
	},
	// xJoelituh
	marowak: {
		inherit: true,
		baseStats: {hp:60, atk:100, def:110, spa:50, spd:95, spe:75},
	},
	// qtrx
	missingno: {
		inherit: true,
		abilities: {0: "Oblivious"},
		basespecies: "Unown",
		forme: "Mega",
		formeLetter: "M",
		baseStats: {hp:48, atk:136, def:0, spa:6, spd:255, spe:29}, // HP must be same as base forme (Unown). Took liberties with SpD since Spc only has to correspond with one stat anyway.
	},
	unown: {
		inherit: true,
		otherForms: ["missingno"],
	},
};
