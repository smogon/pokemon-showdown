// DigiPen custom item definitions.
//
// HOW TO ADD CONTENT:
//
// ── Custom Items ─────────────────────────────────────────────────────────────
// New DigiPen items MUST include `isNonstandard: "DigiPen"` so they are
// treated as illegal outside DigiPen formats.
//
// ── Mega Stones ──────────────────────────────────────────────────────────────
// If you define a custom Mega Evolution in pokedex.ts you also need to define
// its Mega Stone here so the validator can find it. Set
// `megaStone: "<Species>-Mega"` and `megaEvolves: "<Species>"`.
//
// ── Overriding Existing Items ─────────────────────────────────────────────────
// Use `inherit: true` to change one or more fields of an existing item without
// replacing the whole entry.
//
// Example:
//   choiceband: {
//     inherit: true,
//     shortDesc: "Raises Attack by 1.5x but locks the holder into one move.",
//   },

export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {

	// ── Custom Items ─────────────────────────────────────────────────────────

	// -- Buff Items ──────────────────────────────────────────────────────────

	// ── Mega Stones ──────────────────────────────────────────────────────────
	hydreigite: {
		name: "Hydreigite",
		spritenum: 0,
		megaStone: { "Hydreigon": "Hydreigon-Mega" },
		itemUser: ["Hydreigon"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		num: 20001,
		gen: 9,
		isNonstandard: "DigiPen Future",
		shortDesc: "If held by a Hydreigon, this item allows it to Mega Evolve in battle.",
		quality: "specific",
		contributors: ["Bryce G."],
	},

	// ── Changing Existing Items ─────────────────────────────────────────────

};
