export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	dragonfang: {
		inherit: true,
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Dragon') {
				return damage * 1.1;
			}
		},
	},
};
