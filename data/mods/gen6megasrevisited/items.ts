export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	meteorite: {
		name: "Meteorite",
		spritenum: 615,
		megaStone: "Rayquaza-Mega",
		megaEvolves: "Rayquaza",
		itemUser: ["Rayquaza"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		desc: "If held by a Rayquaza, this item allows it to Mega Evolve in battle.",
	},
};
