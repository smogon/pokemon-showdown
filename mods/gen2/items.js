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
	}
};
