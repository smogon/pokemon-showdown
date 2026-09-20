// DigiPen custom Pokémon definitions.
//
// Remember to add the Pokemon to the format-data.ts file afterwards so it acutally appears in the
// Teambuilder
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
//     customIconnum: 100,
//     customSprite: true,
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
//     customIconnum: 100,
//     customSprite: true,
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
// change. The base data is otherwise preserved. Include the modified: "DigiPen" 
// flag to indicate that the Pokemon has been rebalanced as part of the DigiPen project.

// Example:
//   pikachu: {
//     inherit: true,
//     modified: "DigiPen",
//     baseStats: { hp: 60, atk: 75, def: 60, spa: 65, spd: 70, spe: 115 },
//   },
//
// ── Sprites and Icons ─────────────────────────────────────────────
// `customSprite: true` means the client will (attempt to) load the sprite from the DigiPen
//  resource location instead of the default resource location.
//
// `customIcon: true` means the client will (attempt to) load the icon from the DigiPen
// resource location instead of the default resource location, and will look for an individual icon
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
		customSprite: true,
		// customIcon: true,
		types: ["Fighting"],
		gender: "M",
		baseStats: { hp: 50, atk: 60, def: 50, spa: 60, spd: 50, spe: 35 },
		abilities: { 0: "Thick Fat", 1: "Gluttony", H: "Ripen" },
		heightm: 0.7,
		weightkg: 34,
		// color: "TBD",
		evos: ["Armorobin"],
		eggGroups: ["Flying", "Monster"],
		title: "Punch Baby",
		dexEntry: "It enjoys punching things, but its damage is limited by its puniness. It has an affinity towards sandwiches.",
		// habitat: "TBD",
		contributors: ["Will T."],
		artSource: { artist: "American Bird Conservancy", url: "https://abcbirds.org/news/eight-red-birds-to-know-in-north-america/" }
	},
	armorobin: {
		num: 2003,
		name: "Armorobin",
		isNonstandard: "DigiPen",
		//customSprite: true,
		//customIcon: true,
		types: ["Fighting"],
		gender: "M",
		baseStats: { hp: 70, atk: 85, def: 60, spa: 85, spd: 60, spe: 45} ,
		abilities: { 0: "Thick Fat", 1: "Gluttony", H: "Ripen" },
		heightm: 1.5,
		weightkg: 150,
		// color: "TBD",
		prevo: "Pootis",
		evoLevel: 35,
		evos: ["Chickiev"],
		eggGroups: ["Flying", "Monster"],
		title: "Red Army",
		dexEntry: "Its steel-plated feathers scatter at high speeds when it flaps its wings. If Armorobin aren't fed often, it will throw a dangerous tantrum.",
		// habitat: "TBD",
		notes: "Originally named Pootispenser, renamed by Jared G.",
		contributors: ["Will T."],
	},
	chickiev: {
		num: 2004,
		name: "Chickiev",
		isNonstandard: "DigiPen",
		//customSprite: true,
		//customIcon: true,
		types: ["Fighting", "Steel"],
		gender: "M",
		baseStats: { hp: 85, atk: 105, def: 90, spa: 100, spd: 90, spe: 60 },
		abilities: {0: "Thick Fat", 1: "Gluttony", H: "Ripen"},
		heightm: 1.9,
		weightkg: 300,
		// color: "TBD",
		prevo: "Armorobin",
		evoType: "trade",
		evoCondition: "with a Metal Coat",
		eggGroups: ["Flying", "Monster"],
		title: "Mow Down",
		dexEntry: "With its newfound upgrades, it is able to produce its own sandwiches to its liking. In battle, the speed of the feathers and punches it throws surpass that of bullets.",
		// habitat: "TBD",
		notes: "Originally named Pootispenserheer, rename by Jared G.",
		contributors: ["Will T."],
	},
	tineon: {
		num: 2005, 
		name: "Tineon",
		isNonstandard: "DigiPen",
		//customSprite: true,
		//customIcon: true,
		types: ["Steel"],
		baseStats: { hp: 130, atk: 65, def: 65, spa: 95, spd: 110, spe: 60 },
		abilities: { 0: "Clear Body", H: "Steelworker" },
		heightm: 1.0,
		weightkg: 50,
		// color: "TBD",
		prevo: "Eevee",
		evoType: "useItem",
		evoItem: "Up-Grade",
		eggGroups: ["Field"],
		title: "Factory",
		dexEntry: "It is an artificial evolution to Eevee, created using the data behind Porygon's creation. New Trainers need to be careful while petting Tineon, as one wrong move could result in serious injury due to its sharp edges.",
		// habitat: "TBD",
		notes: "Legacy Steel-type Eevee evolution; swapped Special/Physical stats from Guardeon.",
		contributors: ["Alex A."],
	}, // See eevee entry after other eeveelutions below for modifications to evolution list
	asymiladi: {
		num: 2006,
		name: "Asymiladi",
		isNonstandard: "DigiPen",
		//customSprite: true,
		//customIcon: true,
		types: ["Poison", "Psychic"],
		gender: "N",
		baseStats: { hp: 107, atk: 79, def: 89, spa: 109, spd: 107, spe: 79 }, // Changed slightly so all prime numbers
		abilities: { 0: "Beast Boost", H: "Poison Puppeteer" },
		heightm: 1.2,
		weightkg: 91,
		// color: "TBD",
		tags: ["Ultra Beast"],
		eggGroups: ["Undiscovered"],
		title: "Mind Control",
		dexEntry: "It can manipulate the toxins it creates in order to attach to and manipulate the bodies and minds of other Pokemon. Its motives are unknown.",
		// habitat: "TBD",
		notes: "Codename: UB ASSIMILATION; based on an OC sprite by pokereplicant",
		contributors: ["Jared G."],
	},
	thiriniri: {
		num: 2007,
		name: "Thiriniri",
		isNonstandard: "DigiPen",
		//customSprite: true,
		//customIcon: true,
		types: ["Poison", "Fairy"],
		gender: "N",
		baseStats: { hp: 97, atk: 89, def: 89, spa: 109, spd: 79, spe: 107 }, // Changed slightly so all prime numbers
		abilities: { 0: "Beast Boost", H: "Venom Absorb" },
		heightm: 1.6,
		weightkg: 57,
		// color: "TBD",
		tags: ["Ultra Beast"],
		eggGroups: ["Undiscovered"],
		title: "Fantastical",
		dexEntry: "Whenever it rests, it leaves behind globs of sparkly slime as cushions. Despite containing various dangerous chemicals, the slime seems to have powerful healing properties. The slime has also been noted to taste very sweet.",
		// habitat: "TBD",
		notes: "Codename: UB KEMONO; based on an OC sprite by pokereplicant",
		contributors: ["Jared G."],
	},
	technichine: {
		num: 2008,
		name: "Technichine",
		isNonstandard: "DigiPen",
		//customSprite: true,
		//customIcon: true,
		types: ["Normal"],
		gender: "N",
		baseStats: { hp: 80, atk: 70, def: 60, spa: 70, spd: 60, spe: 90 },
		abilities: { 0: "Technician", 1: "Download", H: "Trace" },
		heightm: 0.6,
		weightkg: 45,
		//color: "TBD",
		eggGroups: ["Mineral"],
		title: "Move Storage",
		dexEntry: "Technichine are very curious and capable Pokemon. Despite being limited in their initial forms, they are easily able to copy battle moves when given information about them.",
		// habitat: "TBD",
		notes: "Based on Technical Machines",
		contributors: ["Jared G."],
	},
	exytem: {
		num: 2009,
		name: "Exytem",
		isNonstandard: "DigiPen",
		//customSprite: true,
		//customIcon: true,
		types: ["Steel", "Normal"],
		gender: "N",
		baseStats: { hp: 80, atk: 80, def: 80, spa: 80, spd: 80, spe: 100 },
		abilities: { 0: "Simple", 1: "Moody", H: "Protean" },
		heightm: 1.5,
		weightkg: 97.5,
		// color: "TBD",
		eggGroups: ["Mineral"],
		title: "Potential",
		dexEntry: "These Pokemon have a strange affinity towards X Items, and hang around places powerful Pokemon are known to train. Despite their affinity and potential for combat, they appear happier during times of peace and quiet.",
		// habitat: "TBD",
		notes: "Based on X Items and Mega Man X",
		contributors: ["Jared G."],
	},
	frostscales: {
		num: 2010,
		name: "Frost Scales",
		isNonstandard: "DigiPen",
		//customSprite: true,
		//customIcon: true,
		types: ["Ice", "Dragon"],
		gender: "N", // Changed to N because paradox pokemon are genderless
		baseStats: { hp: 100, atk: 120, def: 100, spa: 85, spd: 85, spe: 100 },
		abilities: { 0: "Protosynthesis" },
		heightm: 2.4,
		weightkg: 143,
		// color: "TBD",
		tags: ["Paradox"],
		eggGroups: ["Undiscovered"],
		title: "Paradox",
		dexEntry: "This Pokemon is known to overpower its prey with its strong legs and freezes them solid for future consumption.",
		habitat: "Secret caves within frozen tundras",
		notes: "Paradox Yanmega",
		contributors: ["Justice Z."],
	},
	tarantuchas: {
		num: 2011,
		name: "Tarantuchas",
		isNonstandard: "DigiPen",
		//customSprite: true,
		//customIcon: true,
		types: ["Bug", "Dark"],
		baseStats: { hp: 120, atk: 110, def: 100, spa: 60, spd: 60, spe: 65 },
		abilities: { 0: "Stakeout", 1: "Fluffy", H: "Sniper" },
		heightm: 1.6,
		weightkg: 74.3,
		// color: "TBD",
		prevo: "Ariados",
		evoType: "levelMove",
		evoMove: "Ancient Power",
		eggGroups: ["Bug"],
		title: "Pursuing",
		dexEntry: "An evolution of Ariados that evolved due to high amounts of prehistoric energy. It overpowers its prey until they are injured, and follows them back to their nest to find more prey.",
		habitat: "Deep caves and prehistoric jungles",
		notes: "Based on the Goliath birdeater tarantula and the Araneo from ARK: Survival Evolved",
		contributors: ["Justice Z."],
	},
	ariados: {
		inherit: true,
		evos: ["Tarantuchas"],
	},
	jotabyte: {
		num: 2012,
		name: "Jotabyte",
		isNonstandard: "DigiPen",
		//customSprite: true,
		//customIcon: true,
		types: ["Fire", "Fairy"],
		baseStats: { hp: 100, atk: 60, def: 90, spa: 110, spd: 90, spe: 100 },
		abilities: { 0: "Magic Bounce", 1: "Download", H: "Soul-Heart" },
		heightm: 1.8,
		weightkg: 83.9,
		// color: "TBD",
		tags: ["Sub-Legendary"],
		eggGroups: ["Undiscovered"],
		title: "Boss Monster",
		dexEntry: "Jotabyte is rumored to be the code of a video game come to life. It can interface with technology using its tail, and the way it executes different battle moves changes depending on the most recent game it interfaced with.",
		// habitat: "TBD",
		notes: "Jared's Pokésona",
		contributors: ["Jared G."],
	},
	mojamas: {
		num: 2013,
		name: "Mojamas",
		isNonstandard: "DigiPen",
		//customSprite: true,
		//customIcon: true,
		types: ["Normal"],
		genderRatio: { M: 0.875, F: 0.125 },
		baseStats: { hp: 95, atk: 55, def: 65, spa: 110, spd: 90, spe: 100 },
		abilities: { 0: "Analytic", 1: "Procrastinator", H: "Unaware" },
		heightm: 1.8,
		weightkg: 29,
		//color: "TBD",
		eggGroups: ["Human-Like", "Fairy"],
		title: "Bored",
		dexEntry: "Its appearance is tall and lanky. Given its skeletal body, it curls up in soft clothing to keep warm, generally pajamas and robes. Lethargic by nature, it will generally attempt to spend its time pursuing its own immediate interests. If given a task to complete, it will generally wait until it is able to achieve the motivation to do so.",
		// habitat: "TBD",
		notes: "Logan's Pokésona",
		contributors: ["Logan C."],
	},
	quipsand: {
		num: 2014,
		name: "Quipsand",
		isNonstandard: "DigiPen",
		//customSprite: true,
		//customIcon: true,
		types: ["Psychic", "Ground"],
		genderRatio: { M: 0.875, F: 0.125 },
		baseStats: { hp: 100, atk: 85, def: 100, spa: 90, spd: 60, spe: 80 },
		abilities: { 0: "Gluttony", 1: "Snarky", H: "Stamina" },
		heightm: 1.1,
		weightkg: 18,
		//color: "TBD",
		eggGroups: ["Field", "Monster"],
		title: "Wisecracker",
		dexEntry: "It can store sounds in balls of clay. Sometimes it will listen to these sounds to relax, but mostly it throws them at unsuspecting victims.",
		habitat: "Swamp areas and Safari Zones",
		notes: "Aiden's Pokésona; sprite by Aiden C.; design by Sky W.",
		contributors: ["Aiden C."],
	},
	alteraton: {
		num: 2015,
		name: "Alteraton",
		isNonstandard: "DigiPen",
		// customSprite: true,
		// customIcon: true,
		types: ["Normal", "???"],
		gender: "N",
		baseStats: { hp: 75, atk: 50, def: 111, spa: 166, spd: 111, spe:88 },
		abilities: { 0: "Self-Alteryzation" },
		// heightm: 0.0, 
		weightkg: 0.0, //placeholder
		// color: "TBD", 
		tags: ["Sub-Legendary"],
		eggGroups: ["Undiscovered"], //placeholder
		// title: "TBD",
		// dexEntry: "TBD",
		// habitat: "TBD",
		notes: "Joshua's Pokésona",
		contributors: ["Joshua C."]
	},

	eevee: {
		inherit: true,
		evos: ["Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Sylveon", "Tineon"],
	},

	// ── Fakemon (from Fanart) ─────────────────────────────────────────────

	// ── Forms/Variants ────────────────────────────────────────────────────

	typhlosiondigipen: {
		num: 157,
		name: "Typhlosion-DigiPen",
		isNonstandard: "DigiPen",
		//customIcon: true,
		//customSprite: true,
		baseSpecies: "Typhlosion",
		forme: "DigiPen",
		types: ["Fire", "Electric"],
		genderRatio: { M: 0.875, F: 0.125 },
		baseStats: { hp: 78, atk: 90, def: 50, spa: 135, spd: 51, spe: 130 },
		abilities: { 0: "Blaze", H: "Comatose" },
		heightm: 1.8,
		weightkg: 59,
		color: "TBD",
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
		otherFormes: ["Typhlosion-Hisui", "Typhlosion-DigiPen"],
		formeOrder: ["Typhlosion", "Typhlosion-Hisui", "Typhlosion-DigiPen"],
	},
	quilava: {
		inherit: true,
		evos: ["Typhlosion", "Typhlosion-Hisui", "Typhlosion-DigiPen"],
	},

	// ── Mega Evolutions ─────────────────────────────────────────────

	hydreigonmega: {
		num: 635,
		name: "Hydreigon-Mega",
		customIcon: true,
		customSprite: true,
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
		otherFormes: ["Hydreigon-Mega"],
		formeOrder: ["Hydreigon", "Hydreigon-Mega"],
	},

	// ── Buff Item Holders ─────────────────────────────────────────────

	sirfetchdarmored: {
		num: 865,
		name: "Sirfetch\u2019d-Armored",
		isNonstandard: "DigiPen",
		// customIcon: true,
		// customSprite: true,
		baseSpecies: "Sirfetch\u2019d",
		forme: "Armored",
		types: ["Fighting"],
		baseStats: { hp: 62, atk: 135, def: 125, spa: 68, spd: 102, spe: 65 },
		abilities: { 0: "Steadfast", H: "Scrappy" },
		heightm: 0.8,
		weightkg: 167,
		color: "White",
		eggGroups: ["Flying", "Field"],
		requiredItem: "Sirfetch\u2019d Armor",
		changesFrom: "Sirfetch\u2019d",
	},
	sirfetchd: {
		inherit: true,
		otherFormes: ["Sirfetch\u2019d-Armored"],
		formeOrder: ["Sirfetch\u2019d", "Sirfetch\u2019d-Armored"],
	},

	sandslasharmored: {
		num: 28,
		name: "Sandslash-Armored",
		isNonstandard: "DigiPen",
		// customIcon: true,
		// customSprite: true,
		baseSpecies: "Sandslash",
		forme: "Armored",
		types: ["Ground"],
		baseStats: { hp: 75, atk: 100, def: 160, spa: 45, spd: 75, spe: 65 },
		abilities: { 0: "Sand Veil", H: "Sand Rush" },
		heightm: 1,
		weightkg: 79.5,
		color: "Yellow",
		eggGroups: ["Field"],
		requiredItem: "Sandslash Armor",
		changesFrom: "Sandslash",
	},
	sandslashalolaarmored: {
		num: 28,
		name: "Sandslash-Alola-Armored",
		isNonstandard: "DigiPen",
		// customIcon: true,
		// customSprite: true,
		baseSpecies: "Sandslash",
		forme: "Alola-Armored",
		types: ["Ice", "Steel"],
		baseStats: { hp: 75, atk: 100, def: 170, spa: 25, spd: 85, spe: 65 },
		abilities: { 0: "Snow Cloak", H: "Slush Rush" },
		heightm: 1.2,
		weightkg: 105,
		color: "Blue",
		eggGroups: ["Field"],
		requiredItem: "Sandslash Armor",
		changesFrom: "Sandslash-Alola",
	},
	sandslash: {
		inherit: true,
		otherFormes: ["Sandslash-Alola", "Sandslash-Armored", "Sandslash-Alola-Armored"],	
		formeOrder: ["Sandslash", "Sandslash-Alola", "Sandslash-Armored", "Sandslash-Alola-Armored"],
	},

	samurottarmored: {
		num: 503,
		name: "Samurott-Armored",
		isNonstandard: "DigiPen",
		// customIcon: true,
		// customSprite: true,
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
		requiredItem: "Samurott Armor",
		changesFrom: "Samurott",
	},
	samurotthisuiarmored: {
		num: 503,
		name: "Samurott-Hisui-Armored",
		isNonstandard: "DigiPen",
		// customIcon: true,
		// customSprite: true,
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
		requiredItem: "Samurott Armor",
		changesFrom: "Samurott-Hisui",
	},
	samurott: {
		inherit: true,
		otherFormes: ["Samurott-Hisui", "Samurott-Armored", "Samurott-Hisui-Armored"],
		formeOrder: ["Samurott", "Samurott-Hisui", "Samurott-Armored", "Samurott-Hisui-Armored"],
	},

	// ── Mon Changes/Buffs ────────────────────────────────────────────────────
	// Don't forget to add the modified: "DigiPen" flag to the Pokemon
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
	absolmega: {
		inherit: true,
		types: ["Dark", "Fairy"],
		contributors: ["Bryce G."],
	},
};
