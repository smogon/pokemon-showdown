// Gen 2 Stadium fixes Dragon Fang and Dragon Scale having the wrong effects.
export const Items: {[k: string]: ModdedItemData} = {
	dragonfang: {
		inherit: true,
		onModifyDamage(damage, source, target, move) {
			if (move?.type === 'Dragon') {
				return damage * 1.1;
			}
		},
	},
	dragonscale: {
		inherit: true,
		onModifyDamage() {},
	},
};
