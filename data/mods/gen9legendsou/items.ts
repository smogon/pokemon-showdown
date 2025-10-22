export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	slowbronite: {
		inherit: true,
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.name || item.megaStone === source.baseSpecies.name) return false;
			return true;
		},
	},
	greninjite: {
		inherit: true,
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.name || item.megaStone === source.baseSpecies.name) return false;
			return true;
		},
	},
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
			if ((source.baseSpecies.baseSpecies === 'Zygarde' && source.baseAbility === 'powerconstruct') ||
				source.baseSpecies.name === 'Zygarde-Mega') return false;
			return true;
		},
	},
};
