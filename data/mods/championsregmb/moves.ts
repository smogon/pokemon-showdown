export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	frostbreath: {
		inherit: true,
		accuracy: 90,
	},
	metalsound: {
		inherit: true,
		accuracy: 85
	},
	rockslide: {
		inherit: true,
		accuracy: 90,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		}
	},
	screech: {
		inherit: true,
		accuracy: 85
	},
	steelwing: {
		inherit: true,
		accuracy: 90,
	},
	strengthsap: {
		inherit: true,
		pp: 10,
	},
	wish: {
		inherit: true,
		pp: 10,
	},
};
