'use strict';

/**@type {{[k: string]: ModdedMoveData}} */
let BattleMovedex = {
	"absorb": {
		inherit: true,
		basePower: 40,
		pp: 15,
	},
	"baddybad": {
		inherit: true,
		isUnreleased: false,
	},
	"bouncybubble": {
		inherit: true,
		isUnreleased: false,
	},
	"buzzybuzz": {
		inherit: true,
		isUnreleased: false,
	},
	"doubleironbash": {
		inherit: true,
		isUnreleased: false,
	},
	"floatyfall": {
		inherit: true,
		isUnreleased: false,
	},
	"freezyfrost": {
		inherit: true,
		isUnreleased: false,
	},
	"glitzyglow": {
		inherit: true,
		isUnreleased: false,
	},
	"megadrain": {
		inherit: true,
		basePower: 75,
		pp: 10,
	},
	"pikapapow": {
		inherit: true,
		isUnreleased: false,
	},
	"sappyseed": {
		inherit: true,
		isUnreleased: false,
	},
	"sizzlyslide": {
		inherit: true,
		isUnreleased: false,
	},
	"solarbeam": {
		inherit: true,
		basePower: 200,
	},
	"sparklyswirl": {
		inherit: true,
		isUnreleased: false,
	},
	"splishysplash": {
		inherit: true,
		isUnreleased: false,
	},
	"skyattack": {
		inherit: true,
		basePower: 200,
	},
	"teleport": {
		inherit: true,
		desc: "If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members.",
		shortDesc: "User switches out.",
		priority: -6,
		selfSwitch: true,
	},
	"veeveevolley": {
		inherit: true,
		isUnreleased: false,
	},
	"zippyzap": {
		inherit: true,
		isUnreleased: false,
	},
};

exports.BattleMovedex = BattleMovedex;
