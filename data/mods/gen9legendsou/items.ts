export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	slowbronite: {
		inherit: true,
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.name) return false;
			return true;
		},
	},
	greninjite: {
		inherit: true,
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.name) return false;
			return true;
		},
	},
	floettite: {
		inherit: true,
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.name) return false;
			return true;
		},
	},
};
