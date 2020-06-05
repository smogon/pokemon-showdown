export const BattleItems: {[k: string]: ModdedItemData} = {
	// Custom support for Perish Song's ability (Snowstorm)
	safetygoggles: {
		inherit: true,
		onImmunity(type, pokemon) {
			if (['sandstorm', 'hail', 'snowstorm', 'powder'].includes(type)) return false;
		},
		desc: "Holder is immune to powder moves and damage from Sandstorm Hail, and Snowstorm.",
	},
};

exports.BattleItems = BattleItems;
