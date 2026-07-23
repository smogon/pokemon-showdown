// AUTO-GENERATED from pret/pokegold-spaceworld (data/types/type_matchups.asm) by tools/sw97-gen.js.
// The 1997 beta type chart differs from final GSC (Steel and Dark are unfinished).
// damageTaken codes: 1 = super-effective, 2 = resisted, 3 = immune, 0 = neutral.
// Only types whose column changed are listed; PS replaces damageTaken wholesale,
// so each entry below is that type's COMPLETE beta table (unlisted = neutral).
export const TypeChart: import('../../../sim/dex-data').ModdedTypeDataTable = {
	normal: {
		inherit: true,
		damageTaken: {
			Fighting: 1,
			Ghost: 3,
			Dark: 2,
		},
	},
	fighting: {
		inherit: true,
		damageTaken: {
			Flying: 1,
			Rock: 2,
			Bug: 2,
			Psychic: 1,
		},
	},
	poison: {
		inherit: true,
		damageTaken: {
			Fighting: 2,
			Poison: 2,
			Ground: 1,
			Bug: 1,
			Grass: 2,
			Psychic: 1,
		},
	},
	bug: {
		inherit: true,
		damageTaken: {
			Fighting: 2,
			Flying: 1,
			Poison: 1,
			Ground: 2,
			Rock: 1,
			Fire: 1,
			Grass: 2,
		},
	},
	ghost: {
		inherit: true,
		damageTaken: {
			Normal: 3,
			Fighting: 3,
			Poison: 2,
			Bug: 2,
			Dark: 1,
		},
	},
	steel: {
		inherit: true,
		damageTaken: {
			Fighting: 2,
			Poison: 2,
			Rock: 2,
			Steel: 3,
			Water: 1,
			Electric: 1,
		},
	},
	fire: {
		inherit: true,
		damageTaken: {
			Ground: 1,
			Rock: 1,
			Bug: 2,
			Fire: 2,
			Water: 1,
			Grass: 2,
			Ice: 2,
		},
	},
	electric: {
		inherit: true,
		damageTaken: {
			Flying: 2,
			Ground: 1,
			Steel: 2,
			Water: 2,
			Electric: 2,
		},
	},
	ice: {
		inherit: true,
		damageTaken: {
			Fighting: 1,
			Rock: 1,
			Fire: 1,
			Ice: 2,
		},
	},
	dark: {
		inherit: true,
		damageTaken: {
			Normal: 1,
			Bug: 1,
			Ghost: 2,
			Psychic: 2,
			Dark: 1,
		},
	},
};
