export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	chesnaughtite: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	delphoxite: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	mewtwonitex: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	mewtwonitey: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	diancite: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	zygardite: {
		inherit: true,
		onTakeItem(item, source) {
			// needs special handling because of intermediate form
			if ((source.baseSpecies.baseSpecies === 'Zygarde' && source.baseAbility === 'Power Construct') ||
			source.baseSpecies.name === 'Zygarde-Mega') return false;
			return true;
		},
	},
};
