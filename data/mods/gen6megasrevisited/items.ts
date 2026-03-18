export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	meteorite: {
		name: "Meteorite",
		spritenum: 615,
		megaStone: { "Rayquaza": "Rayquaza-Mega" },
		itemUser: ["Rayquaza"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		desc: "If held by a Rayquaza, this item allows it to Mega Evolve in battle.",
	},
};
