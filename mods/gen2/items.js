'use strict';

/**@type {{[k: string]: ModdedItemData}} */
let BattleItems = {
	brightpowder: {
		inherit: true,
		desc: "An attack against the holder has its accuracy out of 255 lowered by 20.",
		onModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			return accuracy - 20;
		},
	},
	berryjuice: {
		inherit: true,
		isUnreleased: false,
	},
	dragonfang: {
		inherit: true,
		desc: "No competitive use.",
		onBasePower: function () {},
	},
	dragonscale: {
		inherit: true,
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Dragon') {
				return basePower * 1.1;
			}
		},
		desc: "Holder's Dragon-type attacks have 1.1x power. Evolves Seadra (trade).",
	},
	focusband: {
		inherit: true,
		desc: "Holder has a ~11.7% chance to survive an attack that would KO it with 1 HP.",
		onDamage: function (damage, target, source, effect) {
			if (this.randomChance(30, 256) && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-activate', target, 'item: Focus Band');
				return target.hp - 1;
			}
		},
	},
	metalpowder: {
		inherit: true,
		desc: "If held by a Ditto, its Defense and Sp. Def are 1.5x, even while Transformed.",
		// In Gen 2 this happens in stat calculation directly.
		onModifyDef: function () {},
		onModifySpD: function () {},
	},
	lightball: {
		inherit: true,
		// In Gen 2 this happens in stat calculation directly.
		onModifySpA: function () {},
	},
	luckypunch: {
		inherit: true,
		desc: "If held by a Chansey, its critical hit ratio is always at stage 2. (25% crit rate)",
		onModifyCritRatioPriority: -1,
		onModifyCritRatio: function (critRatio, user) {
			if (user.template.species === 'Chansey') {
				return 3;
			}
		},
	},
	quickclaw: {
		inherit: true,
		desc: "Each turn, holder has a ~23.4% chance to move first in its priority bracket.",
		onModifyPriority: function (priority, pokemon) {
			if (this.randomChance(60, 256)) {
				return Math.round(priority) + 0.1;
			}
		},
	},
	stick: {
		inherit: true,
		desc: "If held by a Farfetch'd, its critical hit ratio is always at stage 2. (25% crit rate)",
		onModifyCritRatioPriority: -1,
		onModifyCritRatio: function (critRatio, user) {
			if (user.template.species === 'Farfetch\'d') {
				return 3;
			}
		},
	},
	thickclub: {
		inherit: true,
		// In Gen 2 this happens in stat calculation directly.
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

exports.BattleItems = BattleItems;
