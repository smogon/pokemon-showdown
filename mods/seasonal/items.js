'use strict';

/**@type {{[k: string]: ModdedItemData}} */
let BattleItems = {
	magmarizer: {
		inherit: true,
		megaStone: "Steelix-Mega",
		megaEvolves: "Steelix",
		onTakeItem: function (item, source) {
			if (item.megaEvolves === source.baseTemplate.baseSpecies) return false;
			return true;
		},
		fling: undefined, // Cannot be flung now since its a mega stone
		desc: "If held by a Steelix, this item allows it to Mega Evolve in battle.",
	},
};

exports.BattleItems = BattleItems;
