export const Items: {[k: string]: ModdedItemData} = {
	adrenalineorb: {
		inherit: true,
		onAfterBoost(boost, target, source, effect) {
			if (effect.id === 'intimidate' || effect.id === 'ability:intimidate') {
				target.useItem();
			}
		},
	},
};
