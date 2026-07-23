/**
 * Beta base stats + typings from the Gold/Silver Spaceworld '97 demo.
 *
 * Every value below is transcribed from the pret/pokegold-spaceworld
 * disassembly (data/pokemon/base_stats/<name>.asm). The demo stores stats in
 * the GB order hp/atk/def/SPEED/SPATK/SPDEF; they are remapped here to PS's
 * {hp, atk, def, spa, spd, spe}.
 *
 * Notes on fidelity:
 * - The demo does NOT define per-species level-up movepools (its evos_attacks
 *   table is empty for these slots), so movepools are inherited unchanged from
 *   GSC. Only stats/types are beta-accurate.
 * - Many beta stat spreads are placeholder-flat (e.g. straight 50s) — that is
 *   the real demo data, not a stand-in.
 * - Types that match the final Gen 2 game are left inherited; only genuine
 *   beta differences are overridden (see Skarmory below).
 */
export const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {
	// HANARYU (beta Meganium) — pure Grass, as in final; much weaker beta line.
	meganium: {
		inherit: true,
		baseStats: { hp: 70, atk: 65, def: 60, spa: 55, spd: 50, spe: 60 },
	},
	// DENRYU (beta Ampharos) — Electric, as in final.
	ampharos: {
		inherit: true,
		baseStats: { hp: 55, atk: 45, def: 45, spa: 70, spd: 50, spe: 50 },
	},
	// NYOROTONO (beta Politoed) — Water, as in final.
	politoed: {
		inherit: true,
		baseStats: { hp: 90, atk: 85, def: 95, spa: 70, spd: 50, spe: 70 },
	},
	// HAGANEIL (beta Steelix) — Steel/Ground, as in final; flat placeholder stats.
	steelix: {
		inherit: true,
		baseStats: { hp: 50, atk: 50, def: 50, spa: 50, spd: 50, spe: 50 },
	},
	// YOROIDORI (beta Skarmory) — the demo lists it Flying/Steel (final flips the
	// order to Steel/Flying); flat placeholder stats.
	skarmory: {
		inherit: true,
		types: ["Flying", "Steel"],
		baseStats: { hp: 50, atk: 50, def: 50, spa: 50, spd: 50, spe: 50 },
	},
	// EKSING (beta Crobat) — Poison/Flying, as in final; fast but frail beta spread.
	crobat: {
		inherit: true,
		baseStats: { hp: 60, atk: 65, def: 50, spa: 45, spd: 50, spe: 85 },
	},
};
