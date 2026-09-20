// DigiPen tier / formats-data definitions.
//
// Every Pokémon defined in pokedex.ts needs an entry here with:
//   - `isNonstandard: "DigiPen" | "DigiPen" | "DigiPen"` — marks it illegal outside DigiPen formats.
//   - `tier`       — singles / NatDex placement
//
// "DigiPen" and "DigiPen" are used to mark Pokemon that mechanically/lore-wise should be illegal in
// generation 9 formats. For instance, DigiPen mega-evolutions should be marked as DigiPen Future (or DigiPen Past)
// since they were reintroduced only in Pokemon Champions. DigiPen Ultrabeasts should
// be marked as DigiPen Past since the Ultrabeasts have not been in games since generation 7.
//
// Valid DigiPen tier strings (defined in TierTypes.Other in sim/global-types.ts):
//   tier / natDexTier : "DigiPen Uber" | "DigiPen" | "DigiPen NFE" | "DigiPen LC"
//   doublesTier       : "DigiPen DUber" | "DigiPen" | "DigiPen NFE" | "DigiPen LC"
//
// Overriding a base-game Pokémon's tier inside DigiPen formats:
//   Use `inherit: true` + only the fields you want to differ.
//   The base tier is preserved in all non-DigiPen formats.
//	 It makes sense to override the tiers of a buffed Pokemon to OU
// 	 	to draw attention to the buffs.

export const FormatsData: import('../../../sim/dex-species').ModdedSpeciesFormatsDataTable = {

	// ── Fakemon (Original) ─────────────────────────────────────────────
	pootis: {
		isNonstandard: "DigiPen",
	},
	armorobin: {
		isNonstandard: "DigiPen",
	},
	chickiev: {
		isNonstandard: "DigiPen",
	},
	tineon: {
		isNonstandard: "DigiPen",
	},
	asymiladi: {
		isNonstandard: "DigiPen",
	},
	thiriniri: {
		isNonstandard: "DigiPen",
	},
	technichine: {
		isNonstandard: "DigiPen",
	},
	exytem: {
		isNonstandard: "DigiPen",
	},
	frostscales: {
		isNonstandard: "DigiPen",
	},
	tarantuchas: {
		isNonstandard: "DigiPen",
	},
	jotabyte: {
		isNonstandard: "DigiPen",
	},
	mojamas: {
		isNonstandard: "DigiPen",
	},
	quipsand: {
		isNonstandard: "DigiPen",
	},
	alteraton: {
		isNonstandard: "DigiPen",
	},

	// ── Fakemon (from Fanart) ─────────────────────────────────────────────

	// ── Forms/Variants ────────────────────────────────────────────────────
	typhlosiondigipen: {
		isNonstandard: "DigiPen",
	},

	// ── Mega Evolutions ────────────────────────────────────────────────────

	hydreigonmega: {
		isNonstandard: "DigiPen",
	},

	// ── Buff Item Holders ─────────────────────────────────────────────
	sirfetchdarmored: {
		isNonstandard: "DigiPen",
	},
	sandslasharmored: {
		isNonstandard: "DigiPen",
	},
	sandslashalolaarmored: {
		isNonstandard: "DigiPen",
	},
	samurottarmored: {
		isNonstandard: "DigiPen",
	},
	samurotthisuiarmored: {
		isNonstandard: "DigiPen",
	},

	// ── Base-game Pokémon Changes ───────────────────────────────────────
	// Don't forget to add inherit: true
	// Move sufficiently buffed Pokemon to OU
	abomasnow: {
		inherit: true,
		tier: "UU",
		doublesTier: "DUU",
		natDexTier: "UU",
	},
	abomasnowmega: {
		inherit: true,
		natDexTier: "OU",
	},
};
