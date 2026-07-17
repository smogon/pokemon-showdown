/* eslint-disable @stylistic/max-len */

export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	// Re-legalize all Mega Stones for Gen 1-3 base species
	// and both Primal Orbs.

	// Gen 1
	parasectite: { inherit: true, gen: 3, isNonstandard: null },
	venomite: {
		name: "Venomite", spritenum: 780, megaStone: { "Venomoth": "Venomoth-Mega" }, itemUser: ["Venomoth"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2685, gen: 3, isNonstandard: null,
	},
	hitmonchanite: { inherit: true, gen: 3, isNonstandard: null },
	dittite: { inherit: true, gen: 3, isNonstandard: null },

	// Gen 2
	noctite: { inherit: true, gen: 3, isNonstandard: null },
	quagsite: {
		name: "Quagsite", spritenum: 772, megaStone: { "Quagsire": "Quagsire-Mega" }, itemUser: ["Quagsire"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2677, gen: 3, isNonstandard: null,
	},
	magcargoite: { inherit: true, gen: 3, isNonstandard: null },
	corsolite: {
		name: "Corsolite", spritenum: 781, megaStone: { "Corsola": "Corsola-Mega" }, itemUser: ["Corsola"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2686, gen: 3, isNonstandard: null,
	},
	mantite: { inherit: true, gen: 3, isNonstandard: null },

	// Gen 3
	mightyenitex: { inherit: true, gen: 3, isNonstandard: null },
	mightyenitey: { inherit: true, gen: 3, isNonstandard: null },
	beautiflite: { inherit: true, gen: 3, isNonstandard: null },
	shedinjite: { name: "Shedinjite", spritenum: 774, megaStone: { "Shedinja": "Shedinja-Mega" }, itemUser: ["Shedinja"], onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; }, num: 2679, gen: 3, isNonstandard: null },
	kecleitex: { name: "Kecleite X", spritenum: 770, megaStone: { "Kecleon": "Kecleon-Mega-X" }, itemUser: ["Kecleon"], onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; }, num: 2675, gen: 3, isNonstandard: null },
	kecleitey: { name: "Kecleite Y", spritenum: 776, megaStone: { "Kecleon": "Kecleon-Mega-Y" }, itemUser: ["Kecleon"], onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; }, num: 2681, gen: 3, isNonstandard: null },
	grumpigite: { name: "Grumpigite", spritenum: 773, megaStone: { "Grumpig": "Grumpig-Mega" }, itemUser: ["Grumpig"], onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; }, num: 2678, gen: 3, isNonstandard: null },
	flygonite: { name: "Flygonite", spritenum: 779, megaStone: { "Flygon": "Flygon-Mega" }, itemUser: ["Flygon"], onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; }, num: 2684, gen: 3, isNonstandard: null },
	solerock: {
		name: "Sole Rock", spritenum: 771, megaStone: { "Solrock": "Solrock-Mega" }, itemUser: ["Solrock"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2676, gen: 3, isNonstandard: null,
	},
	walrite: { inherit: true, gen: 3, isNonstandard: null },
	luvdite: { inherit: true, gen: 3, isNonstandard: null },
	masquerite: { name: "Masquerite", spritenum: 775, megaStone: { "Masquerain": "Masquerain-Mega" }, itemUser: ["Masquerain"], onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; }, num: 2680, gen: 3, isNonstandard: null },
	volbeatite: { name: "Volbeatite", spritenum: 777, megaStone: { "Volbeat": "Volbeat-Mega" }, itemUser: ["Volbeat"], onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; }, num: 2682, gen: 3, isNonstandard: null },
	illumite: { name: "Illumite", spritenum: 778, megaStone: { "Illumise": "Illumise-Mega" }, itemUser: ["Illumise"], onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; }, num: 2683, gen: 3, isNonstandard: null },
};
