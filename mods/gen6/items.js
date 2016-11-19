'use strict';

exports.BattleItems = {
	abomasite: {
		inherit: true,
		isUnreleased: false,
	},
	aggronite: {
		inherit: true,
		isUnreleased: false,
	},
	altarianite: {
		inherit: true,
		isUnreleased: false,
	},
	ampharosite: {
		inherit: true,
		isUnreleased: false,
	},
	audinite: {
		inherit: true,
		isUnreleased: false,
	},
	banettite: {
		inherit: true,
		isUnreleased: false,
	},
	beedrillite: {
		inherit: true,
		isUnreleased: false,
	},
	blazikenite: {
		inherit: true,
		isUnreleased: false,
	},
	cameruptite: {
		inherit: true,
		isUnreleased: false,
	},
	diancite: {
		inherit: true,
		isUnreleased: false,
	},
	galladite: {
		inherit: true,
		isUnreleased: false,
	},
	gardevoirite: {
		inherit: true,
		isUnreleased: false,
	},
	heracronite: {
		inherit: true,
		isUnreleased: false,
	},
	houndoominite: {
		inherit: true,
		isUnreleased: false,
	},
	latiasite: {
		inherit: true,
		isUnreleased: false,
	},
	latiosite: {
		inherit: true,
		isUnreleased: false,
	},
	lopunnite: {
		inherit: true,
		isUnreleased: false,
	},
	manectite: {
		inherit: true,
		isUnreleased: false,
	},
	mawilite: {
		inherit: true,
		isUnreleased: false,
	},
	medichamite: {
		inherit: true,
		isUnreleased: false,
	},
	mewtwonitex: {
		inherit: true,
		isUnreleased: false,
	},
	mewtwonitey: {
		inherit: true,
		isUnreleased: false,
	},
	pidgeotite: {
		inherit: true,
		isUnreleased: false,
	},
	sceptilite: {
		inherit: true,
		isUnreleased: false,
	},
	steelixite: {
		inherit: true,
		isUnreleased: false,
	},
	swampertite: {
		inherit: true,
		isUnreleased: false,
	},
	tyranitarite: {
		inherit: true,
		isUnreleased: false,
	},
	souldew: {
		id: "souldew",
		name: "Soul Dew",
		spritenum: 459,
		fling: {
			basePower: 30,
		},
		onModifySpAPriority: 1,
		onModifySpA: function (spa, pokemon) {
			if (pokemon.baseTemplate.num === 380 || pokemon.baseTemplate.num === 381) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD: function (spd, pokemon) {
			if (pokemon.baseTemplate.num === 380 || pokemon.baseTemplate.num === 381) {
				return this.chainModify(1.5);
			}
		},
		num: 225,
		gen: 3,
		desc: "If holder is a Latias or a Latios, its Sp. Atk and Sp. Def are 1.5x.",
	},
};
