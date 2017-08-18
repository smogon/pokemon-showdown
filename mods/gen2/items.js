'use strict';

exports.BattleItems = {
	berryjuice: {
		inherit: true,
		isUnreleased: false,
	},
	dragonfang: {
		inherit: true,
		onBasePower: function () {},
		desc: "No competitive use.",
	},
	metalpowder: {
		inherit: true,
		// On Gen 2 this happens in stat calculation directly.
		onModifyDef: function () {},
		onModifySpD: function () {},
	},
	lightball: {
		inherit: true,
		// On Gen 2 this happens in stat calculation directly.
		onModifyAtk: function () {},
		onModifySpA: function () {},
	},
	luckypunch: {
		inherit: true,
		onModifyCritRatioPriority: -1,
		onModifyCritRatio: function (critRatio, user) {
			if (user.template.species === 'Chansey') {
				return 3;
			}
		},
		desc: "If held by a Chansey, its critical hit ratio is set to +3 stages (for a crit chance of 33%), overriding all other crit rate changes.",
		shortDesc: "If holder is Chansey, its critical hit ratio is set to +3 stages and overrides all other crit rate changes.",
	},
	stick: {
		inherit: true,
		onModifyCritRatioPriority: -1,
		onModifyCritRatio: function (critRatio, user) {
			if (user.template.species === 'Farfetch\'d') {
				return 3;
			}
		},
		desc: "If held by a Farfetch'd, its critical hit ratio is set to +3 stages (for a crit chance of 33%), overriding all other crit rate changes.",
		shortDesc: "If holder is Farfetch'd, its critical hit ratio is set to +3 stages and overrides all other crit rate changes.",
	},
	thickclub: {
		inherit: true,
		// On Gen 2 this happens in stat calculation directly.
		onModifyAtk: function () {},
	},
	berserkgene: {
		inherit: true,
		isNonstandard: false,
	},
	berry: {
		inherit: true,
		isNonstandard: false,
	},
	bitterberry: {
		inherit: true,
		isNonstandard: false,
	},
	burntberry: {
		inherit: true,
		isNonstandard: false,
	},
	dragonscale: {
		inherit: true,
		isNonstandard: false,
	},
	goldberry: {
		inherit: true,
		isNonstandard: false,
	},
	iceberry: {
		inherit: true,
		isNonstandard: false,
	},
	mintberry: {
		inherit: true,
		isNonstandard: false,
	},
	miracleberry: {
		inherit: true,
		isNonstandard: false,
	},
	mysteryberry: {
		inherit: true,
		isNonstandard: false,
	},
	pinkbow: {
		inherit: true,
		isNonstandard: false,
	},
	polkadotbow: {
		inherit: true,
		isNonstandard: false,
	},
	przcureberry: {
		inherit: true,
		isNonstandard: false,
	},
	psncureberry: {
		inherit: true,
		isNonstandard: false,
	},
};
