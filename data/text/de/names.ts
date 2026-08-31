export const TermNames: { [id: string]: TranslationString } = {
	shiny: "Schillernd",
	happiness: null, // NEEDS TRANSLATION
	level: "Level",
	nickname: null, // NEEDS TRANSLATION
	ev: "EV",
	evs: "EVs",
	iv: "IV",
	ivs: "IVs",
	dv: "DVs",
	dvs: "DVs",
	av: "AV",
	avs: "AVs",
	point: null, // NEEDS TRANSLATION
	points: null, // NEEDS TRANSLATION
	// n.b. used in Teambuilder, so it should be capitalized (unlike StatNames.stats)
	stats: "Statuswerte",

	pokemon: "Pokémon",
	move: null, // NEEDS TRANSLATION
	moves: null, // NEEDS TRANSLATION
	item: null, // NEEDS TRANSLATION
	items: null, // NEEDS TRANSLATION
	ability: null, // NEEDS TRANSLATION
	abilities: null, // NEEDS TRANSLATION
	hiddenability: null, // NEEDS TRANSLATION
	possibleabilities: null, // NEEDS TRANSLATION
	team: "Team",
	teams: "Teams",
	teamslist: null, // NEEDS TRANSLATION

	type: "Typ",
	types: "Typen",
	teratype: null, // NEEDS TRANSLATION
	nature: "Wesen",
	category: "Kategorie",
	categories: "Kategorien",
	gender: "Geschlecht",
	egggroup: null, // NEEDS TRANSLATION
	egggroups: null, // NEEDS TRANSLATION
	tag: null, // NEEDS TRANSLATION
	article: null, // NEEDS TRANSLATION
	articles: null, // NEEDS TRANSLATION
	tier: "Tier",
	tiers: "Tiers",
	format: null, // NEEDS TRANSLATION
	formats: null, // NEEDS TRANSLATION
	color: "Farbe",
	form: null, // NEEDS TRANSLATION
	forme: null, // NEEDS TRANSLATION
	dexnum: null, // NEEDS TRANSLATION
	generation: "Generation",
	gennum: null, // NEEDS TRANSLATION
	evolution: null, // NEEDS TRANSLATION
	preevolution: null, // NEEDS TRANSLATION
	doesnotevolve: null, // NEEDS TRANSLATION
	zcrystal: null, // NEEDS TRANSLATION
	target: null, // NEEDS TRANSLATION
	height: "Größe",
	numm: "{NUMBER} m",
	weight: "Gewicht",
	numkg: "{NUMBER} kg",
	critrate: null, // NEEDS TRANSLATION
	user: null, // NEEDS TRANSLATION
	requiredmove: null, // NEEDS TRANSLATION
	dynamaxpower: null, // NEEDS TRANSLATION
	none: null, // NEEDS TRANSLATION
	pastgensonly: null, // NEEDS TRANSLATION
	flingbasepower: null, // NEEDS TRANSLATION
	flingeffect: null, // NEEDS TRANSLATION
	naturalgifttype: null, // NEEDS TRANSLATION
	naturalgiftbasepower: null, // NEEDS TRANSLATION

	megaevolution: null, // NEEDS TRANSLATION
	zpower: null, // NEEDS TRANSLATION
	zeffect: null, // NEEDS TRANSLATION
	dynamax: null, // NEEDS TRANSLATION
	dynamaxlevel: null, // NEEDS TRANSLATION
	ultraburst: null, // NEEDS TRANSLATION
	tera: null, // NEEDS TRANSLATION

	supereffective: null, // NEEDS TRANSLATION
	extremelyeffective: null, // NEEDS TRANSLATION
	effective: null, // NEEDS TRANSLATION
	notveryeffective: null, // NEEDS TRANSLATION
	mostlyineffective: null, // NEEDS TRANSLATION
	noeffect: null, // NEEDS TRANSLATION

	weak: null, // NEEDS TRANSLATION
	resist: null, // NEEDS TRANSLATION
	immune: null, // NEEDS TRANSLATION

	nicknamespecies: "{NICKNAME} ({SPECIES})",
	label: null, // NEEDS TRANSLATION
	speciesforme: null, // NEEDS TRANSLATION
};

export const StatNames: { [id: string]: TranslationString } = {
	hp: "KP",
	atk: "Angriff", "atk:grammar": "ms",
	def: "Verteidigung", "def:grammar": "fs",
	spa: "Spezial-Angriff", "spa:grammar": "ms",
	spd: "Spezial-Verteidigung", "spd:grammar": "fs",
	spe: "Initiative", "spe:grammar": "fs",
	accuracy: "Genauigkeit", "accuracy:grammar": "fs",
	evasion: "Ausweichwert", "evasion:grammar": "ms",
	spc: "Spezial", "spc:grammar": "ns",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike TermNames.stats)
	stats: "Statuswerte", "stats:grammar": "mp",
};

export const StatMediumNames: { [id: string]: TranslationString } = {
	hp: "KP", atk: "Angriff", def: "Verteidigung",
	spa: "Sp.-Ang.", spd: "Sp.-Vert.", spe: "Initiative",
	accuracy: "Genauigkeit", evasion: "Ausweichwert", spc: "Spezial",
};

export const StatShortNames: { [id: string]: TranslationString } = {
	hp: "KP", atk: "Ang", def: "Ver", spa: "SpA", spd: "SpV", spe: "Ini", spc: "Spz",
};

export const TypeNames: { [id: string]: TranslationString } = {
	bug: "Käfer",
	dark: "Unlicht",
	dragon: "Drache",
	electric: "Elektro",
	fairy: "Fee",
	fighting: "Kampf",
	fire: "Feuer",
	flying: "Flug",
	ghost: "Geist",
	grass: "Pflanze",
	ground: "Boden",
	ice: "Eis",
	normal: "Normal",
	poison: "Gift",
	psychic: "Psycho",
	rock: "Gestein",
	steel: "Stahl",
	stellar: "Stellar",
	water: "Wasser",
};

export const NatureNames: { [id: string]: TranslationString } = {
	adamant: "Hart",
	bashful: "Zaghaft",
	bold: "Kühn",
	brave: "Mutig",
	calm: "Still",
	careful: "Sacht",
	docile: "Sanft",
	gentle: "Zart",
	hardy: "Robust",
	hasty: "Hastig",
	impish: "Pfiffig",
	jolly: "Froh",
	lax: "Lasch",
	lonely: "Solo",
	mild: "Mild",
	modest: "Mäßig",
	naive: "Naiv",
	naughty: "Frech",
	quiet: "Ruhig",
	quirky: "Kauzig",
	rash: "Hitzig",
	relaxed: "Locker",
	sassy: "Forsch",
	serious: "Ernst",
	timid: "Scheu",
};

export const GenderNames: { [id: string]: TranslationString } = {
	male: "Männlich",
	female: "Weiblich",
	genderless: "Unbekannt",
};

export const StatusNames: { [id: string]: TranslationString } = {
	brn: "Verbrennungen",
	par: "Paralyse",
	slp: "Schlaf",
	frz: "Gefroren",
	psn: "Vergiftung",
	tox: "Schwere Vergiftung",
	fnt: null, // NEEDS TRANSLATION
	confusion: "Verwirrung",
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: null, // NEEDS TRANSLATION
	normalDoubles: null, // NEEDS TRANSLATION
	normalSingles: null, // NEEDS TRANSLATION
	normalFFA: null, // NEEDS TRANSLATION
	self: null, // NEEDS TRANSLATION
	adjacentAlly: null, // NEEDS TRANSLATION
	adjacentAllyDoubles: null, // NEEDS TRANSLATION
	adjacentAllySingles: null, // NEEDS TRANSLATION
	adjacentAllyOrSelf: null, // NEEDS TRANSLATION
	adjacentAllyOrSelfDoubles: null, // NEEDS TRANSLATION
	adjacentFoe: null, // NEEDS TRANSLATION
	allAdjacentFoes: null, // NEEDS TRANSLATION
	allAdjacentFoesDoubles: null, // NEEDS TRANSLATION
	foeSide: null, // NEEDS TRANSLATION
	allySide: null, // NEEDS TRANSLATION
	allyTeam: null, // NEEDS TRANSLATION
	allAdjacent: null, // NEEDS TRANSLATION
	allAdjacentDoubles: null, // NEEDS TRANSLATION
	allAdjacentFFA: null, // NEEDS TRANSLATION
	any: null, // NEEDS TRANSLATION
	all: null, // NEEDS TRANSLATION
	scripted: null, // NEEDS TRANSLATION
	randomNormal: null, // NEEDS TRANSLATION
	randomNormalDoubles: null, // NEEDS TRANSLATION
	allies: null, // NEEDS TRANSLATION
};

// from veekun/Bulbapedia who presumably got it from Pokédex 3D Pro
// Stadium 2 names in comments
export const EggGroupNames: { [id: string]: TranslationString } = {
	monster: null, // NEEDS TRANSLATION
	water1: null, // NEEDS TRANSLATION
	bug: null, // NEEDS TRANSLATION
	flying: null, // NEEDS TRANSLATION
	field: null, // NEEDS TRANSLATION
	fairy: null, // NEEDS TRANSLATION
	grass: null, // NEEDS TRANSLATION
	humanlike: null, // NEEDS TRANSLATION
	water3: null, // NEEDS TRANSLATION
	mineral: null, // NEEDS TRANSLATION
	amorphous: null, // NEEDS TRANSLATION
	water2: null, // NEEDS TRANSLATION
	ditto: null, // NEEDS TRANSLATION
	dragon: null, // NEEDS TRANSLATION
	undiscovered: null, // NEEDS TRANSLATION
};

export const ColorNames: { [id: string]: TranslationString } = {
	black: "Schwarz",
	blue: "Blau",
	brown: "Braun",
	gray: "Grau",
	green: "Grün",
	pink: "Rosa",
	purple: "Violett",
	red: "Rot",
	white: "Weiß",
	yellow: "Gelb",
};
