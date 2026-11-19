export const Scripts: ModdedBattleScriptsData = {
	gen: 8,
	inherit: 'gen8',
	actions: {
		inherit: true,
		canDynamaxSide() {
			// Dynamaxing is not in BDSP
			return false;
		},
	},
};
