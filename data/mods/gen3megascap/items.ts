export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	// Re-legalize all Mega Stones for Gen 1-3 base species
	// and both Primal Orbs.

	// Gen 1
	gengarite: { inherit: true, gen: 3, isNonstandard: null },
	mewtwonitex: { inherit: true, gen: 3, isNonstandard: null },
	mewtwonitey: { inherit: true, gen: 3, isNonstandard: null },

	// Gen 2
	magcargoite: {
		name: "Magcargoite",
		spritenum: 762,
		megaStone: { "Magcargo": "Magcargo-Mega" },
		itemUser: ["Magcargo"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		num: 2651,
		gen: 3,
		isNonstandard: null,
	},

	// Gen 3
	blazikenite: { inherit: true, gen: 3, isNonstandard: null },
	medichamite: { inherit: true, gen: 3, isNonstandard: null },
	salamencite: { inherit: true, gen: 3, isNonstandard: null },
	metagrossite: { inherit: true, gen: 3, isNonstandard: null },
	latiasite: { inherit: true, gen: 3, isNonstandard: null },
	latiosite: { inherit: true, gen: 3, isNonstandard: null },

	// Primal Orbs
	blueorb: { inherit: true, gen: 3, isNonstandard: null },
	redorb: { inherit: true, gen: 3, isNonstandard: null },
};
