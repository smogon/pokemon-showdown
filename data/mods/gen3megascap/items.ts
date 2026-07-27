export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	// CAP Mega Stones live fully in this mod so they do not leak into unrelated
	// formats via data/items.ts. Canonical stones that already exist upstream
	// (and are used by [Gen 3] Megas) are not redefined here.

	// Gen 1
	parasectite: {
		name: "Parasectite", spritenum: 763, megaStone: { "Parasect": "Parasect-Mega" }, itemUser: ["Parasect"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2652, gen: 3, isNonstandard: null,
	},
	venomite: {
		name: "Venomite", spritenum: 780, megaStone: { "Venomoth": "Venomoth-Mega" }, itemUser: ["Venomoth"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2685, gen: 3, isNonstandard: null,
	},
	hitmonchanite: {
		name: "Hitmonchanite", spritenum: 764, megaStone: { "Hitmonchan": "Hitmonchan-Mega" }, itemUser: ["Hitmonchan"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2653, gen: 3, isNonstandard: null,
	},
	dittite: {
		name: "Dittite", spritenum: 770, megaStone: { "Ditto": "Ditto-Mega" }, itemUser: ["Ditto"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2659, gen: 3, isNonstandard: null,
	},

	// Gen 2
	noctite: {
		name: "Noctite", spritenum: 765, megaStone: { "Noctowl": "Noctowl-Mega" }, itemUser: ["Noctowl"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2654, gen: 3, isNonstandard: null,
	},
	quagsite: {
		name: "Quagsite", spritenum: 772, megaStone: { "Quagsire": "Quagsire-Mega" }, itemUser: ["Quagsire"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2677, gen: 3, isNonstandard: null,
	},
	magcargoite: {
		name: "Magcargoite", spritenum: 762, megaStone: { "Magcargo": "Magcargo-Mega" }, itemUser: ["Magcargo"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2651, gen: 3, isNonstandard: null,
	},
	corsolite: {
		name: "Corsolite", spritenum: 781, megaStone: { "Corsola": "Corsola-Mega" }, itemUser: ["Corsola"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2686, gen: 3, isNonstandard: null,
	},
	mantite: {
		name: "Mantite", spritenum: 769, megaStone: { "Mantine": "Mantine-Mega" }, itemUser: ["Mantine"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2658, gen: 3, isNonstandard: null,
	},

	// Gen 3
	mightyenitex: {
		name: "Mightyenite X", spritenum: 771, megaStone: { "Mightyena": "Mightyena-Mega-X" }, itemUser: ["Mightyena"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2670, gen: 3, isNonstandard: null,
	},
	mightyenitey: {
		name: "Mightyenite Y", spritenum: 772, megaStone: { "Mightyena": "Mightyena-Mega-Y" }, itemUser: ["Mightyena"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2671, gen: 3, isNonstandard: null,
	},
	beautiflite: {
		name: "Beautiflite", spritenum: 766, megaStone: { "Beautifly": "Beautifly-Mega" }, itemUser: ["Beautifly"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2655, gen: 3, isNonstandard: null,
	},
	shedinjite: {
		name: "Shedinjite", spritenum: 774, megaStone: { "Shedinja": "Shedinja-Mega" }, itemUser: ["Shedinja"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2679, gen: 3, isNonstandard: null,
	},
	kecleitex: {
		name: "Kecleite X", spritenum: 770, megaStone: { "Kecleon": "Kecleon-Mega-X" }, itemUser: ["Kecleon"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2675, gen: 3, isNonstandard: null,
	},
	kecleitey: {
		name: "Kecleite Y", spritenum: 776, megaStone: { "Kecleon": "Kecleon-Mega-Y" }, itemUser: ["Kecleon"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2681, gen: 3, isNonstandard: null,
	},
	grumpigite: {
		name: "Grumpigite", spritenum: 773, megaStone: { "Grumpig": "Grumpig-Mega" }, itemUser: ["Grumpig"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2678, gen: 3, isNonstandard: null,
	},
	flygonite: {
		name: "Flygonite", spritenum: 779, megaStone: { "Flygon": "Flygon-Mega" }, itemUser: ["Flygon"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2684, gen: 3, isNonstandard: null,
	},
	solerock: {
		name: "Sole Rock", spritenum: 771, megaStone: { "Solrock": "Solrock-Mega" }, itemUser: ["Solrock"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2676, gen: 3, isNonstandard: null,
	},
	walrite: {
		name: "Walrite", spritenum: 767, megaStone: { "Walrein": "Walrein-Mega" }, itemUser: ["Walrein"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2656, gen: 3, isNonstandard: null,
	},
	luvdite: {
		name: "Luvdite", spritenum: 768, megaStone: { "Luvdisc": "Luvdisc-Mega" }, itemUser: ["Luvdisc"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2657, gen: 3, isNonstandard: null,
	},
	masquerite: {
		name: "Masquerite", spritenum: 775, megaStone: { "Masquerain": "Masquerain-Mega" }, itemUser: ["Masquerain"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2680, gen: 3, isNonstandard: null,
	},
	volbeatite: {
		name: "Volbeatite", spritenum: 777, megaStone: { "Volbeat": "Volbeat-Mega" }, itemUser: ["Volbeat"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2682, gen: 3, isNonstandard: null,
	},
	illumite: {
		name: "Illumite", spritenum: 778, megaStone: { "Illumise": "Illumise-Mega" }, itemUser: ["Illumise"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2683, gen: 3, isNonstandard: null,
	},
};
