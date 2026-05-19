// DigiPen custom item definitions.
//
// HOW TO ADD CONTENT:
//
// ── Custom Items ─────────────────────────────────────────────────────────────
// New DigiPen items must include `isNonstandard: "DigiPen"` so they are
// treated as illegal outside DigiPen formats and flagged as DigiPen in the Pokedex.
//
// DigiPen item icons image files are in a separate resource location and uses a file
// system instead of an icon sheet, so spritenum is an unecessary field to specify.
// However, it is a required field by default, so just set `spritenum: 0` to avoid errors.
//
// `shortDesc` field is displayed in Teambuilder and should be under 100 characters.
//
// `desc` field is displayed in the Pokedex. This field is optional if a longer description
// not needed, and will default to the `shortDesc` field if omitted.
// 
// (See data/text/items.ts for examples of desc and shortDesc fields.)
//
// `quality` field allows for the item to be categorized in the Teambuilder. The possible
// values are: "great", "good", "specific", "poor", "bad".
//
// `contributors` field is an optional field used to credit the person/people who contributed to the item
//
// ── Mega Stones ──────────────────────────────────────────────────────────────
// If you define a custom Mega Evolution in pokedex.ts you also need to define
// its Mega Stone here so the validator can find it. Set
// `megaStone: "<Species>-Mega"` and `itemUser: "<Species>"`.
//
// These should also be marked as `isNonstandard: "DigiPen Future"` or 
// `isNonstandard: "DigiPen Past"` since mega stones are not legal in normal generation
//  9 formats.
//
// Finally, they should be marked as `quality: "specific"` since they are specific to a single Pokemon.
//
// ── Overriding Existing Items ─────────────────────────────────────────────────
// Use `inherit: true` to change one or more fields of an existing item without
// replacing the whole entry.
//
// For buffed items, consider changing the item's quality to "great" or "good" to highlight the buff
// in the Teambuilder.

export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {

	// ── Custom Items ─────────────────────────────────────────────────────────
	// Use ordering from DigiPen Spreadsheet

	blueprint: {
		name: "Blueprint",
		spritenum: 0,
		fling: { basePower: 30 },
		// battle logic implemented on Trick Room move
		num: 10001,
		gen: 9,
		isNonstandard: "DigiPen",
		quality: "great",
		contributors: ["Jared G."],
		shortDesc: "Holder's use of Trick Room lasts 8 turns instead of 5.",
	},

	// -- Buff Items ──────────────────────────────────────────────────────────
	// Use ordering from DigiPen Spreadsheet

	armor: {
		name: "Armor",
		spritenum: 0,
		fling: { basePower: 60 },
		forcedFormes: { 
			'Sirfetch\u2019d': 'Sirfetch\u2019d-Armored', 
			'Sandslash': 'Sandslash-Armored', 
			'Sandslash-Alola': 'Sandslash-Alola-Armored',
			'Samurott': 'Samurott-Armored',
			'Samurott-Hisui': 'Samurott-Hisui-Armored'
		},
		itemUser: ['Sirfetch\u2019d', 'Sandslash', 'Sandslash-Alola', 'Samurott', 'Samurott-Hisui'],
		num: 20002,
		gen: 9,
		isNonstandard: "DigiPen",
		shortDesc: "If held by a certain Pokemon, this item increases their base defense and special defense.",
		quality: "specific",
		dexEntry: "This is a test dex entry.",
		contributors: ["Bryce G."],
	},

	// ── Mega Stones ──────────────────────────────────────────────────────────
	// Use ordering from DigiPen Spreadsheet of the corresponding Mega Pokemon

	hydreigite: {
		name: "Hydreigite",
		spritenum: 0,
		megaStone: { "Hydreigon": "Hydreigon-Mega" },
		itemUser: ["Hydreigon"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		num: 30003,
		gen: 9,
		isNonstandard: "DigiPen Future",
		shortDesc: "If held by a Hydreigon, this item allows it to Mega Evolve in battle.",
		quality: "specific",
		contributors: ["Bryce G."],
	},

	// ── Changing Existing Items ─────────────────────────────────────────────
	// Use alphabetical ordering

};
