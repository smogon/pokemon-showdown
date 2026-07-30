export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	// CAP Mega Stones live fully in this mod so they do not leak into unrelated
	// formats via data/items.ts. Canonical stones that already exist upstream
	// (and are used by [Gen 3] Megas) are not redefined here.

	// Gen 1
	fearite: {
		name: "Fearite", spritenum: 782, megaStone: { "Fearow": "Fearow-Mega" }, itemUser: ["Fearow"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2660, gen: 3, isNonstandard: null,
	},
	wigglytite: {
		name: "Wigglytite", spritenum: 783, megaStone: { "Wigglytuff": "Wigglytuff-Mega" }, itemUser: ["Wigglytuff"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2661, gen: 3, isNonstandard: null,
	},
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
	rapidasite: {
		name: "Rapidasite", spritenum: 784, megaStone: { "Rapidash": "Rapidash-Mega" }, itemUser: ["Rapidash"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2662, gen: 3, isNonstandard: null,
	},
	kinglerite: {
		name: "Kinglerite", spritenum: 785, megaStone: { "Kingler": "Kingler-Mega" }, itemUser: ["Kingler"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2663, gen: 3, isNonstandard: null,
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
	flareite: {
		name: "Flaerite", spritenum: 786, megaStone: { "Flareon": "Flareon-Mega" }, itemUser: ["Flareon"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2664, gen: 3, isNonstandard: null,
	},

	// Gen 2
	furretitex: {
		name: "Furretite X", spritenum: 787, megaStone: { "Furret": "Furret-Mega-X" }, itemUser: ["Furret"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2665, gen: 3, isNonstandard: null,
	},
	furretitey: {
		name: "Furretite Y", spritenum: 788, megaStone: { "Furret": "Furret-Mega-Y" }, itemUser: ["Furret"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2672, gen: 3, isNonstandard: null,
	},
	noctite: {
		name: "Noctite", spritenum: 765, megaStone: { "Noctowl": "Noctowl-Mega" }, itemUser: ["Noctowl"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2654, gen: 3, isNonstandard: null,
	},
	lediate: {
		name: "Lediate", spritenum: 789, megaStone: { "Ledian": "Ledian-Mega" }, itemUser: ["Ledian"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2673, gen: 3, isNonstandard: null,
	},
	sudowooditex: {
		name: "Sudowoodite X", spritenum: 790, megaStone: { "Sudowoodo": "Sudowoodo-Mega-X" }, itemUser: ["Sudowoodo"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2674, gen: 3, isNonstandard: null,
	},
	sudowooditey: {
		name: "Sudowoodite Y", spritenum: 791, megaStone: { "Sudowoodo": "Sudowoodo-Mega-Y" }, itemUser: ["Sudowoodo"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2666, gen: 3, isNonstandard: null,
	},
	quagsite: {
		name: "Quagsite", spritenum: 772, megaStone: { "Quagsire": "Quagsire-Mega" }, itemUser: ["Quagsire"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2677, gen: 3, isNonstandard: null,
	},
	unknownstone: {
		name: "Unknown Stone", spritenum: 792, megaStone: { "Unown": "Unown-Mega" }, itemUser: ["Unown"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2667, gen: 3, isNonstandard: null,
	},
	magcargoite: {
		name: "Magcargoite", spritenum: 762, megaStone: { "Magcargo": "Magcargo-Mega" }, itemUser: ["Magcargo"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2651, gen: 3, isNonstandard: null,
	},
	octillerite: {
		name: "Octillerite", spritenum: 793, megaStone: { "Octillery": "Octillery-Mega" }, itemUser: ["Octillery"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2668, gen: 3, isNonstandard: null,
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
		name: "Mightyenite Y", spritenum: 797, megaStone: { "Mightyena": "Mightyena-Mega-Y" }, itemUser: ["Mightyena"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2671, gen: 3, isNonstandard: null,
	},
	beautiflite: {
		name: "Beautiflite", spritenum: 766, megaStone: { "Beautifly": "Beautifly-Mega" }, itemUser: ["Beautifly"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2655, gen: 3, isNonstandard: null,
	},
	masquerite: {
		name: "Masquerite", spritenum: 775, megaStone: { "Masquerain": "Masquerain-Mega" }, itemUser: ["Masquerain"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2680, gen: 3, isNonstandard: null,
	},
	shedinjite: {
		name: "Shedinjite", spritenum: 774, megaStone: { "Shedinja": "Shedinja-Mega" }, itemUser: ["Shedinja"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2679, gen: 3, isNonstandard: null,
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
		name: "Sole Rock", spritenum: 798, megaStone: { "Solrock": "Solrock-Mega" }, itemUser: ["Solrock"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2676, gen: 3, isNonstandard: null,
	},
	armaldite: {
		name: "Armaldite", spritenum: 794, megaStone: { "Armaldo": "Armaldo-Mega" }, itemUser: ["Armaldo"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2669, gen: 3, isNonstandard: null,
	},
	cradilite: {
		name: "Cradilite", spritenum: 795, megaStone: { "Cradily": "Cradily-Mega" }, itemUser: ["Cradily"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2687, gen: 3, isNonstandard: null,
	},
	kecleitex: {
		name: "Kecleite X", spritenum: 796, megaStone: { "Kecleon": "Kecleon-Mega-X" }, itemUser: ["Kecleon"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2675, gen: 3, isNonstandard: null,
	},
	kecleitey: {
		name: "Kecleite Y", spritenum: 776, megaStone: { "Kecleon": "Kecleon-Mega-Y" }, itemUser: ["Kecleon"],
		onTakeItem(item, source) { return !item.megaStone?.[source.baseSpecies.baseSpecies]; },
		num: 2681, gen: 3, isNonstandard: null,
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
};
