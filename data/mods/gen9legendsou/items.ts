export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	slowbronite: {
		inherit: true,
		onTakeItem(item, source) {
			return !item.megaStone || (!item.megaStone[source.baseSpecies.name] &&
				!Object.values(item.megaStone).includes(source.baseSpecies.name));
		},
	},
	greninjite: {
		inherit: true,
		onTakeItem(item, source) {
			return !item.megaStone || (!item.megaStone[source.baseSpecies.name] &&
				!Object.values(item.megaStone).includes(source.baseSpecies.name));
		},
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
