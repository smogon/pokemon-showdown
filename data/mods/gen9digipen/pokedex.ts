// DigiPen custom Pokémon definitions.
//
// Remember to add the Pokemon to the format-data.ts file afterwards so it acutally appears in the
// Teambuilder!
//
// ── Custom Pokémon ──────────────────────────────────────────────────────────
// Add a new entry keyed by the Pokémon's ID. This should be lowercase, no spaces/punctuation, with
// the forme info concatenated after the Pokemon name.
//
// Example:
//   pootis: {
//     num: 2002,
//     name: "Pootis",
//     isNonstandard: "DigiPen",
//     digipenIconnum: 100,
//     digipenSprite: true,
//     types: ["Fighting"],
//     gender: "M",
//     baseStats: { hp: 50, atk: 60, def: 50, spa: 60, spd: 50, spe: 35 },
//     abilities: { 0: "Thick Fat", 1: "Gluttony", H: "Ripen" },
//     heightm: 0.7,
//     weightkg: 34,
//     color: "Red",
//     evos: ["Armorobin"],
//     eggGroups: ["Flying", "Monster"],
//     title: "Punch Baby",
//     dexEntry: "…",
//     habitat: "…",
//     notes: "…",
//     contributors: ["…"],
//     artSource: { artist: "…", url: "https://…" },
//   },
//
/* ── Regional Formes / Variant Formes  ───────────────────────────────────────────────────────── */
//
// Regional formes and variant formes are separate entries whose `baseSpecies` points at the
// base species Pokémon and whose `forme` field names the region or variant.
// (e.g. "Alola", "Hisui", "DigiPen", "Snowman"). 
// 
// Remember to add the form ID to the base Pokémon's `otherFormes` / `formeOrder` lists 
// via `inherit: true` and to add it as an evolution of the base game non-regional form.
//
// Example:
// Step 1 – add the form entry:
//   pikachudigipen: {
//     num: 25,
//     name: "Pikachu-DigiPen",
//     digipenIconnum: 100,
//     digipenSprite: true,
//     baseSpecies: "Pikachu",
//     forme: "DigiPen",
//     types: ["Electric", "Fairy"],
//     baseStats: { hp: 50, atk: 85, def: 50, spa: 85, spd: 55, spe: 110 },
//     abilities: { 0: "Lightning Rod" },
//     heightm: 0.5,
//     weightkg: 6.5,
//     color: "Yellow",
//     eggGroups: ["Undiscovered"],
//   },
//
// Step 2 – patch the base species to advertise the form:
//   pikachu: {
//     inherit: true,
//     otherFormes: ["Pikachu-Original", ..., "Pikachu-DigiPen"],
//     formeOrder: ["Pikachu", "Pikachu-Original", ..., "Pikachu-DigiPen"],
//   },
//
// Step 3 (if necessary) – add the form as an evolution of the base game non-regional form:
//   pichu: {
//     inherit: true,
//     evos: ["Pikachu, Pikachu-Original", ..., "Pikachu-DigiPen"],
//   },
//
// ── Mega Evolutions ─────────────────────────────────────────────────────────
// Mega Evolutions are forme entries with `requiredItem: "<MegaStone>"`.
// The base Pokémon's entry needs `otherFormes` / `formeOrder` updated
// (use `inherit: true` to patch the existing entry without overwriting it).
//
// ── Buff Item Holders ──────────────────────────────────────────────────────────────
// Buff Item Holders are Pokemon that can hold an item that transforms them into a different forme.
// They have the `requiredItem` field set to the item that transforms them into the different forme,
// and the `changesFrom` field set to the Pokemon that they transform from.
// Same as above, the base Pokémon's entry needs `otherFormes` / `formeOrder` updated.
//
// ── Overriding Existing Pokémon ─────────────────────────────────────────────
// To change how a base-game Pokémon behaves *only* inside DigiPen formats,
// add its ID with `inherit: true` and override only the fields you want to
// change. The base data is otherwise preserved.
//
// Example:
//   pikachu: {
//     inherit: true,
//     baseStats: { hp: 60, atk: 75, def: 60, spa: 65, spd: 70, spe: 115 },
//   },
//
// ── Sprites and Icons ─────────────────────────────────────────────
// `digipenSprite: true` means the client will (attempt to) load the sprite from the digiPen
//  resource folder instead of the default resource folder.
//
// `digipenIcon: true` means the client will (attempt to) load the icon from the digiPen
// resource folder instead of the default resource folder, and will look for an individual icon
// file instead of the icon on a sprite sheet
//
// ── Other Custom Fields ─────────────────────────────────────────────
// `title`, `habitat`, `dexEntry`, and `notes` are optional flavor fields that are displayed in the Pokedex.
// `contributors and `artSource` are optional fields used to credit the person/people who contributed to
// the Pokémon and the art source (for Pokemon inspired by fan art) respectively. These are also displayed 
// in the Pokedex.

export const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {
	// ── Fakemon (Original) ─────────────────────────────────────────────
	pootis: {
		num: 2002,
		name: "Pootis",
		isNonstandard: "DigiPen",
		digipenSprite: true,
		digipenIcon: true,
		types: ["Fighting"],
		gender: "M",
		baseStats: { hp: 50, atk: 60, def: 50, spa: 60, spd: 50, spe: 35 },
		abilities: { 0: "Thick Fat", 1: "Gluttony", H: "Ripen" },
		heightm: 0.7,
		weightkg: 34,
		color: "Red",
		evos: ["Armorobin"],
		eggGroups: ["Flying", "Monster"],
		title: "Punch Baby",
		dexEntry: "It enjoys punching things, but its damage is limited by its puniness. It has an affinity towards sandwiches.",
		habitat: "Test habitat",
		notes: "Test note.",
		contributors: ["Will T.", "Test contributor"],
		artSource: { artist: "American Bird Conservancy", url: "https://abcbirds.org/news/eight-red-birds-to-know-in-north-america/" }
	},
	armorobin: {
		num: 2003,
		name: "Armorobin",
		isNonstandard: "DigiPen",
		//digipenSprite: true,
		//digipenIcon: true,
		types: ["Fighting"],
		gender: "M",
		baseStats: { hp: 70, atk: 85, def: 60, spa: 85, spd: 60, spe: 45} ,
		abilities: { 0: "Thick Fat", 1: "Gluttony", H: "Ripen" },
		heightm: 1.5,
		weightkg: 150,
		color: "Red",
		prevo: "Pootis",
		evoLevel: 35,
		evos: ["Chickiev"],
		eggGroups: ["Flying", "Monster"],
		title: "Red Army",
		dexEntry: "Its steel-plated feathers scatter at high speeds when it flaps its wings. If Armorobin aren't fed often, it will throw a dangerous tantrum.",
		notes: "Originally named Pootispenser, renamed by Jared G.",
		contributors: ["Will T."],
	},
	chickiev: {
		num: 2004,
		name: "Chickiev",
		isNonstandard: "DigiPen",
		//digipenSprite: true,
		//digipenIcon: true,
		types: ["Fighting", "Steel"],
		gender: "M",
		baseStats: { hp: 85, atk: 105, def: 90, spa: 100, spd: 90, spe: 60 },
		abilities: {0: "Thick Fat", 1: "Gluttony", H: "Ripen"},
		heightm: 1.9,
		weightkg: 300,
		color: "Red",
		prevo: "Armorobin",
		evoType: "trade",
		evoCondition: "with a Metal Coat",
		eggGroups: ["Flying", "Monster"],
		title: "Mow Down",
		dexEntry: "With its newfound upgrades, it is able to produce its own sandwiches to its liking. In battle, the speed of the feathers and punches it throws surpass that of bullets.",
		notes: "Originally named Pootispenserheer, rename by Jared G.",
		contributors: ["Will T."],
	},
	mojamas: {
		num: 2013,
		name: "Mojamas",
		isNonstandard: "DigiPen",
		//digipenSprite: true,
		//digipenIcon: true,
		types: ["Normal"],
		genderRatio: { M: 0.875, F: 0.125 },
		baseStats: { hp: 95, atk: 55, def: 65, spa: 110, spd: 90, spe: 100 },
		abilities: { 0: "Analytic", 1: "Procrastinator", H: "Unaware" },
		heightm: 1.8,
		weightkg: 29,
		color: "Gray",
		eggGroups: ["Human-Like", "Fairy"],
		title: "Bored",
		dexEntry: "Its appearance is tall and lanky. Given its skeletal body, it curls up in soft clothing to keep warm, generally pajamas and robes. Lethargic by nature, it will generally attempt to spend its time pursuing its own immediate interests. If given a task to complete, it will generally wait until it is able to achieve the motivation to do so.",
		notes: "Logan's Pokésona",
		contributors: ["Logan C."],
	},
	alteraton: {
		num: 2015,
		name: "Alteraton",
		isNonstandard: "DigiPen",
		// digipenSprite: true,
		// digipenIcon: true,
		types: ["Normal", "???"],
		gender: "N",
		baseStats: { hp: 75, atk: 50, def: 111, spa: 166, spd: 111, spe:88 },
		abilities: { 0: "Self-Alteryzation" },
		heightm: 0.0, //placeholder
		weightkg: 0.0, //placeholder
		color: "Gray", //placeholder
		eggGroups: ["Undiscovered"], //placeholder
		title: "Alteration", //placeholder
		notes: "Joshua's Pokésona",
		contributors: ["Joshua C."]
	},

	// ── Fakemon (from Fanart) ─────────────────────────────────────────────

	// ── Forms/Variants ────────────────────────────────────────────────────

	typhlosiondigipen: {
		num: 157,
		name: "Typhlosion-DigiPen",
		isNonstandard: "DigiPen",
		//digipenIcon: true,
		//digipenSprite: true,
		baseSpecies: "Typhlosion",
		forme: "DigiPen",
		types: ["Fire", "Electric"],
		genderRatio: { M: 0.875, F: 0.125 },
		baseStats: { hp: 78, atk: 90, def: 50, spa: 135, spd: 51, spe: 130 },
		abilities: { 0: "Blaze", H: "Comatose" },
		heightm: 1.8,
		weightkg: 59,
		color: "Yellow",
		prevo: "Quilava",
		evoLevel: 36,
		eggGroups: ["Field"],
		title: "Hotwire",
		dexEntry: "Nobody knows where the plug on Typhlosion's face came from, nor where it goes. Despite having the capability of ravaging the battlefield with a storm of both fireballs and lightning strikes, it always seems to be in a state of rest and relaxation.",
		notes: "'Typhwire'; Deltarune Werewire reference",
		contributors: ["Jared G."],
	},
	typhlosion: {
		inherit: true,
		modified: "DigiPen",
		otherFormes: ["Typhlosion-Hisui", "Typhlosion-DigiPen"],
		formeOrder: ["Typhlosion", "Typhlosion-Hisui", "Typhlosion-DigiPen"],
	},
	quilava: {
		inherit: true,
		modified: "DigiPen",
		evos: ["Typhlosion", "Typhlosion-Hisui", "Typhlosion-DigiPen"],
	},

	// ── Mega Evolutions ─────────────────────────────────────────────

	hydreigonmega: {
		num: 635,
		name: "Hydreigon-Mega",
		digipenIcon: true,
		digipenSprite: true,
		isNonstandard: "DigiPen",
		baseSpecies: "Hydreigon",
		forme: "Mega",
		types: ["Dark", "Dragon"],
		baseStats: { hp: 92, atk: 115, def: 120, spa: 145, spd: 110, spe: 118 },
		abilities: { 0: "Mega Launcher" },
		heightm: 1.6,
		weightkg: 48.4,
		color: "Blue",
		eggGroups: ["Dragon"],
		requiredItem: "Hydreigite",
		notes: "Inspired by its commonly used moves, Dragon Pulse and Dark Pulse",
		contributors: ["Bryce G."],
		// Temporary art for testing; source seems suspicious
		artSource: { artist: "TRXPICS (allegedly)", url: "https://www.pokemonpets.com/Mega-Hydreigon-Pokemon-Pokedex-8635" }
	},
	hydreigon: {
		inherit: true,
		modified: "DigiPen",
		otherFormes: ["Hydreigon-Mega"],
		formeOrder: ["Hydreigon", "Hydreigon-Mega"],
	},

	// ── Buff Item Holders ─────────────────────────────────────────────

	sirfetchdarmored: {
		num: 865,
		name: "Sirfetch\u2019d-Armored",
		isNonstandard: "DigiPen",
		// digipenIcon: true,
		// digipenSprite: true,
		baseSpecies: "Sirfetch\u2019d",
		forme: "Armored",
		types: ["Fighting"],
		baseStats: { hp: 62, atk: 135, def: 125, spa: 68, spd: 102, spe: 65 },
		abilities: { 0: "Steadfast", H: "Scrappy" },
		heightm: 0.8,
		weightkg: 167,
		color: "White",
		eggGroups: ["Flying", "Field"],
		requiredItem: "Armor",
		changesFrom: "Sirfetch\u2019d",
	},
	sirfetchd: {
		inherit: true,
		modified: "DigiPen",
		otherFormes: ["Sirfetch\u2019d-Armored"],
		formeOrder: ["Sirfetch\u2019d", "Sirfetch\u2019d-Armored"],
	},

	sandslasharmored: {
		num: 28,
		name: "Sandslash-Armored",
		isNonstandard: "DigiPen",
		// digipenIcon: true,
		// digipenSprite: true,
		baseSpecies: "Sandslash",
		forme: "Armored",
		types: ["Ground"],
		baseStats: { hp: 75, atk: 100, def: 160, spa: 45, spd: 75, spe: 65 },
		abilities: { 0: "Sand Veil", H: "Sand Rush" },
		heightm: 1,
		weightkg: 79.5,
		color: "Yellow",
		eggGroups: ["Field"],
		requiredItem: "Armor",
		changesFrom: "Sandslash",
	},
	sandslashalolaarmored: {
		num: 28,
		name: "Sandslash-Alola-Armored",
		isNonstandard: "DigiPen",
		// digipenIcon: true,
		// digipenSprite: true,
		baseSpecies: "Sandslash",
		forme: "Alola-Armored",
		types: ["Ice", "Steel"],
		baseStats: { hp: 75, atk: 100, def: 170, spa: 25, spd: 85, spe: 65 },
		abilities: { 0: "Snow Cloak", H: "Slush Rush" },
		heightm: 1.2,
		weightkg: 105,
		color: "Blue",
		eggGroups: ["Field"],
		requiredItem: "Armor",
		changesFrom: "Sandslash-Alola",
	},
	sandslash: {
		inherit: true,
		modified: "DigiPen",
		otherFormes: ["Sandslash-Alola", "Sandslash-Armored", "Sandslash-Alola-Armored"],	
		formeOrder: ["Sandslash", "Sandslash-Alola", "Sandslash-Armored", "Sandslash-Alola-Armored"],
	},

	samurottarmored: {
		num: 503,
		name: "Samurott-Armored",
		isNonstandard: "DigiPen",
		// digipenIcon: true,
		// digipenSprite: true,
		baseSpecies: "Samurott",
		forme: "Armored",
		types: ["Water"],
		genderRatio: { M: 0.875, F: 0.125 },
		baseStats: { hp: 95, atk: 100, def: 115, spa: 108, spd: 110, spe: 70 },
		abilities: { 0: "Torrent", H: "Shell Armor" },
		heightm: 1.5,
		weightkg: 144.6,
		color: "Blue",
		eggGroups: ["Field"],
		requiredItem: "Armor",
		changesFrom: "Samurott",
	},
	samurotthisuiarmored: {
		num: 503,
		name: "Samurott-Hisui-Armored",
		isNonstandard: "DigiPen",
		// digipenIcon: true,
		// digipenSprite: true,
		baseSpecies: "Samurott",
		forme: "Hisui-Armored",
		types: ["Water", "Dark"],
		genderRatio: { M: 0.875, F: 0.125 },
		baseStats: { hp: 90, atk: 108, def: 110, spa: 100, spd: 105, spe: 85 },
		abilities: { 0: "Torrent", H: "Sharpness" },
		heightm: 1.5,
		weightkg: 108.2,
		color: "Blue",
		eggGroups: ["Field"],
		requiredItem: "Armor",
		changesFrom: "Samurott-Hisui",
	},
	samurott: {
		inherit: true,
		modified: "DigiPen",
		otherFormes: ["Samurott-Hisui", "Samurott-Armored", "Samurott-Hisui-Armored"],
		formeOrder: ["Samurott", "Samurott-Hisui", "Samurott-Armored", "Samurott-Hisui-Armored"],
	},

	// ── Mon Changes/Buffs ────────────────────────────────────────────────────
	abomasnow: {
		inherit: true,
		modified: "DigiPen",
		abilities: {0: "Snow Warning", 1: "Skill Link", H: "Mountaineer"},
		baseStats: {hp: 80, atk: 114, def: 75, spa: 105, spd: 85, spe: 81},
		contributors: ["Bryce G."]
	},
	abomasnowmega: {
		inherit: true,
		modified: "DigiPen",
		baseStats: {hp: 80, atk: 154, def: 105, spa: 145, spd: 105, spe: 51},
		contributors: ["Bryce G."],
	},


	// ── Champions Mega Evolutions "Leaked" Abilities ────────────────────────────────────────────────────
	baxcaliburmega: {
		inherit: true,
		modified: "DigiPen",
		abilities: { 0: "Thermal Exchange" },
	},
	darkraimega: {
		inherit: true,
		modified: "DigiPen",
		digipenSprite: true,
		abilities: { 0: "Nightmares" },
	},
	golisopodmega: {
		inherit: true,
		modified: "DigiPen",
		abilities: { 0: "Tough Claws" },
	},
	lucariomegaz: {
		inherit: true,
		modified: "DigiPen",
		abilities: { 0: "Prankster" },
	},
	pyroarmega: {
		inherit: true,
		modified: "DigiPen",
		abilities: { 0: "Thermal Boost" },
	},
	raichumegax: {
		inherit: true,
		modified: "DigiPen",
		abilities: { 0: "Electric Surge" },
	},
	staraptormega: {
		inherit: true,
		modified: "DigiPen",
		abilities: { 0: "Contrary" },
	},
	zeraoramega: {
		inherit: true,
		modified: "DigiPen",
		abilities: { 0: "Speed Boost" },
	},
};
