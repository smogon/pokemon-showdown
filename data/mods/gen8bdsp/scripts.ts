export const Scripts: ModdedBattleScriptsData = {
	gen: 8,
	inherit: 'gen8',
	side: {
		inherit: true,
		canDynamaxNow() {
			// Dynamaxing is not in BDSP
			return false;
		},
	},
};
