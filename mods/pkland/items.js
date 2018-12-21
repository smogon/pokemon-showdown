'use strict';

/**@type {{[k: string]: ModdedItemData}} */
let BattleItems = {
	// Felix
	felixiumz: {
		id: "felixiumz",
		name: "Felixium Z",
		isNonstandard: true,
		onTakeItem: false,
		zMove: "The Magic Bag of Tricks",
		zMoveFrom: "Metronome",
		zMoveUser: ["Meowth-Alola"],
		gen: 7,
		desc: "If held by an Alolan Meowth with Metronome, it can use The Magic Bag of Tricks.",
	},
	// Abby
	mysticwater: {
		inherit: true,
		megaStone: "Altaria-Mega",
		megaEvolves: "Altaria",
		onTakeItem: function (item, source) {
			if (item.megaEvolves === source.baseTemplate.baseSpecies) return false;
			return true;
		},
		fling: undefined, // Cannot be flung now since its a mega stone
		desc: "If held by an Altaria, this item allows it to Mega Evolve in battle.",
	},
  // Gold Ho-Oh
	goldhoohniumz: {
		id: "goldhoohniumz",
		name: "Gold Ho-Ohnium Z",
		isNonstandard: true,
		onTakeItem: false,
		zMove: "Golden Passion",
		zMoveFrom: "Sacred Fire",
		zMoveUser: ["Ho-Oh"],
		gen: 7,
		desc: "If held by a Ho-Oh with Sacred Fire, it can use Golden Passion.",
	},
};

exports.BattleItems = BattleItems;
