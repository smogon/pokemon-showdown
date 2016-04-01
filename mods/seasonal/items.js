'use strict';

exports.BattleItems = {
	"keyboard": {
		id: "keyboard",
		name: "Keyboard",
		megaStone: "Missingno.",
		megaEvolves: "Unown",
		onTakeItem: function () {
			return false;
		},
		gen: 6,
		desc: "If holder is an Unown, this item allows it to Mega Evolve in battle?",
	},
};
