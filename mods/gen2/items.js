'use strict';

exports.BattleItems = {
	dragonfang: {
		inherit: true,
		onBasePower: function () {},
		desc: "No competitive use."
	},
	metalpowder: {
		inherit: true,
		// On Gen 2 this happens in stat calculation directly.
		onModifyDef: function () {},
		onModifySpD: function () {}
	},
	lightball: {
		inherit: true,
		// On Gen 2 this happens in stat calculation directly.
		onModifyAtk: function () {},
		onModifySpA: function () {}
	},
	luckypunch: {
		inherit: true,
		onModifyMove: function (move, user) {
			if (user.template.species === 'Chansey') {
				move.critRatio = 3;
			}
		}
	},
	stick: {
		inherit: true,
		onModifyMove: function (move, user) {
			if (user.template.species === 'Farfetch\'d') {
				move.critRatio = 3;
			}
		}
	},
	thickclub: {
		inherit: true,
		// On Gen 2 this happens in stat calculation directly.
		onModifyAtk: function () {}
	},
	berserkgene: {
		inherit: true,
		isNonstandard: false
	},
	berry: {
		inherit: true,
		isNonstandard: false
	},
	bitterberry: {
		inherit: true,
		isNonstandard: false
	},
	burntberry: {
		inherit: true,
		isNonstandard: false
	},
	dragonscale: {
		inherit: true,
		isNonstandard: false
	},
	goldberry: {
		inherit: true,
		isNonstandard: false
	},
	iceberry: {
		inherit: true,
		isNonstandard: false
	},
	mintberry: {
		inherit: true,
		isNonstandard: false
	},
	miracleberry: {
		inherit: true,
		isNonstandard: false
	},
	mysteryberry: {
		inherit: true,
		isNonstandard: false
	},
	pinkbow: {
		inherit: true,
		isNonstandard: false
	},
	polkadotbow: {
		inherit: true,
		isNonstandard: false
	},
	przcureberry: {
		inherit: true,
		isNonstandard: false
	},
	psncureberry: {
		inherit: true,
		isNonstandard: false
	}
};
