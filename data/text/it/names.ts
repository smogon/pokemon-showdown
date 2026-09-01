export const TermNames: { [id: string]: TranslationString } = {
	shiny: "Cromatico",
	happiness: null, // NEEDS TRANSLATION
	level: null, // NEEDS TRANSLATION
	nickname: "Soprannome", // official: SV it_common 4414
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
	stats: "Statistiche",

	pokemon: "Pokémon",
	move: null, // NEEDS TRANSLATION
	moves: null, // NEEDS TRANSLATION
	item: null, // NEEDS TRANSLATION
	items: null, // NEEDS TRANSLATION
	ability: null, // NEEDS TRANSLATION
	abilities: null, // NEEDS TRANSLATION
	hiddenability: "Abilità speciale", // official: SV it_common 36040 ("con un’abilità speciale")
	possibleabilities: null, // NEEDS TRANSLATION
	team: null, // NEEDS TRANSLATION
	teams: null, // NEEDS TRANSLATION
	teamslist: null, // NEEDS TRANSLATION

	type: "Tipo",
	types: "Tipi",
	teratype: null, // NEEDS TRANSLATION
	nature: "Natura",
	category: "Categoria",
	categories: "Categorie",
	gender: "Sesso",
	egggroup: null, // NEEDS TRANSLATION
	egggroups: null, // NEEDS TRANSLATION
	tag: null, // NEEDS TRANSLATION
	article: null, // NEEDS TRANSLATION
	articles: null, // NEEDS TRANSLATION
	tier: "Tier",
	tiers: null, // NEEDS TRANSLATION
	format: null, // NEEDS TRANSLATION
	formats: null, // NEEDS TRANSLATION
	color: "Colore",
	form: null, // NEEDS TRANSLATION
	forme: null, // NEEDS TRANSLATION
	dexnum: null, // NEEDS TRANSLATION
	generation: null, // NEEDS TRANSLATION
	gennum: "Gen {NUMBER}",
	evolution: null, // NEEDS TRANSLATION
	preevolution: null, // NEEDS TRANSLATION
	doesnotevolve: null, // NEEDS TRANSLATION
	zcrystal: "Cristallo Z", // official: USUM it_common 21919
	target: null, // NEEDS TRANSLATION
	height: "Altezza",
	numm: "{NUMBER} m",
	weight: "Peso",
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
	dynamaxlevel: "Livello Dynamax", // official: SwSh it_common 846
	ultraburst: "Ultraesplosione", // official: USUM it_common 8794
	tera: null, // NEEDS TRANSLATION

	supereffective: "Superefficace", // official: SV it_common 8613 ("È superefficace!")
	extremelyeffective: "Iperefficace", // official: Champions it_ms 1925 ("È iperefficace!!")
	effective: null, // NEEDS TRANSLATION
	notveryeffective: null, // NEEDS TRANSLATION
	mostlyineffective: "Quasi per niente efficace", // official: Champions it_ms 1928
	noeffect: null, // NEEDS TRANSLATION

	weak: null, // NEEDS TRANSLATION
	resist: null, // NEEDS TRANSLATION
	immune: null, // NEEDS TRANSLATION

	nicknamespecies: "{NICKNAME} ({SPECIES})",
	label: null, // NEEDS TRANSLATION
	noweather: null, // NEEDS TRANSLATION
	noitem: null, // NEEDS TRANSLATION
	noability: null, // NEEDS TRANSLATION
	foescondition: null, // NEEDS TRANSLATION
	speciesforme: null, // NEEDS TRANSLATION
};

export const StatNames: { [id: string]: TranslationString } = {
	hp: "PS", "hp:grammar": "mp",
	atk: "Attacco", "atk:grammar": "ms",
	def: "Difesa", "def:grammar": "fs",
	spa: "Attacco Speciale", "spa:grammar": "ms",
	spd: "Difesa Speciale", "spd:grammar": "fs",
	spe: "Velocità", "spe:grammar": "fs",
	accuracy: "precisione", "accuracy:grammar": "fs",
	evasion: "elusione", "evasion:grammar": "fs",
	spc: "Speciale", "spc:grammar": "ms",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike TermNames.stats)
	stats: "statistiche", "stats:grammar": "fp",
};

export const StatMediumNames: { [id: string]: TranslationString } = {
	hp: "PS", atk: "Attacco", def: "Difesa",
	spa: "Att. Sp.", spd: "Dif. Sp.", spe: "Velocità",
	accuracy: "Precisione", evasion: "Elusione", spc: "Speciale",
};

export const StatShortNames: { [id: string]: TranslationString } = {
	hp: "PS", atk: "Att", def: "Dif", spa: "ASp", spd: "DSp", spe: "Vel",
	spc: "Spc", // deliberate PS shorthand: avoids clash with English "Spe" (Speed)
};

export const TypeNames: { [id: string]: TranslationString } = {
	bug: "Coleottero",
	dark: "Buio",
	dragon: "Drago",
	electric: "Elettro",
	fairy: "Folletto",
	fighting: "Lotta",
	fire: "Fuoco",
	flying: "Volante",
	ghost: "Spettro",
	grass: "Erba",
	ground: "Terra",
	ice: "Ghiaccio",
	normal: "Normale",
	poison: "Veleno",
	psychic: "Psico",
	rock: "Roccia",
	steel: "Acciaio",
	stellar: "Astrale",
	water: "Acqua",
};

export const NatureNames: { [id: string]: TranslationString } = {
	adamant: "Decisa",
	bashful: "Ritrosa",
	bold: "Sicura",
	brave: "Audace",
	calm: "Calma",
	careful: "Cauta",
	docile: "Docile",
	gentle: "Gentile",
	hardy: "Ardita",
	hasty: "Lesta",
	impish: "Scaltra",
	jolly: "Allegra",
	lax: "Fiacca",
	lonely: "Schiva",
	mild: "Mite",
	modest: "Modesta",
	naive: "Ingenua",
	naughty: "Birbona",
	quiet: "Quieta",
	quirky: "Furba",
	rash: "Ardente",
	relaxed: "Placida",
	sassy: "Vivace",
	serious: "Seria",
	timid: "Timida",
};

export const GenderNames: { [id: string]: TranslationString } = {
	male: "Maschio",
	female: "Femmina",
	genderless: "Sconosciuto",
};

export const StatusNames: { [id: string]: TranslationString } = {
	brn: null, // NEEDS TRANSLATION
	par: null, // NEEDS TRANSLATION
	slp: null, // NEEDS TRANSLATION
	frz: null, // NEEDS TRANSLATION
	psn: null, // NEEDS TRANSLATION
	tox: null, // NEEDS TRANSLATION
	fnt: null, // NEEDS TRANSLATION
	confusion: null, // NEEDS TRANSLATION
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

// from veekun/Pokémon Central who presumably got it from Pokédex 3D Pro
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
	black: "Nero",
	blue: "Blu",
	brown: "Marrone",
	gray: "Grigio",
	green: "Verde",
	pink: "Rosa",
	purple: "Viola",
	red: "Rosso",
	white: "Bianco",
	yellow: "Giallo",
};
