export const TermNames: { [id: string]: TranslationString } = {
	shiny: "Chromatique",
	happiness: null, // NEEDS TRANSLATION
	level: null, // NEEDS TRANSLATION
	nickname: null, // NEEDS TRANSLATION
	ev: "EV",
	evs: "EVs",
	iv: "IV",
	ivs: "IVs",
	dv: "DVs",
	dvs: "DVs",
	av: "AV",
	avs: "AVs",
	point: "Point",
	points: "Points",
	// n.b. used in Teambuilder, so it should be capitalized (unlike StatNames.stats)
	stats: "Stats",

	pokemon: "Pokémon",
	move: "Capacité", // official term (SV)
	moves: "Capacités",
	item: "Objet", // official term
	items: null, // NEEDS TRANSLATION
	ability: "Talent", // SV en/fr_common 429; Champions fra btl_data_pokedetail 3
	abilities: null, // NEEDS TRANSLATION
	hiddenability: null, // NEEDS TRANSLATION
	possibleabilities: null, // NEEDS TRANSLATION
	team: null, // NEEDS TRANSLATION
	teams: null, // NEEDS TRANSLATION
	teamslist: null, // NEEDS TRANSLATION

	type: "Type",
	types: "Types",
	teratype: null, // NEEDS TRANSLATION
	nature: "Nature",
	category: "Catégorie",
	categories: "Catégories",
	gender: "Sexe",
	egggroup: null, // NEEDS TRANSLATION
	egggroups: null, // NEEDS TRANSLATION
	tag: null, // NEEDS TRANSLATION
	article: "Article",
	articles: "Articles",
	tier: "Tier",
	tiers: "Tiers",
	format: null, // NEEDS TRANSLATION
	formats: null, // NEEDS TRANSLATION
	color: "Couleur",
	form: null, // NEEDS TRANSLATION
	forme: null, // NEEDS TRANSLATION
	dexnum: null, // NEEDS TRANSLATION
	generation: null, // NEEDS TRANSLATION
	gennum: null, // NEEDS TRANSLATION
	evolution: null, // NEEDS TRANSLATION
	preevolution: null, // NEEDS TRANSLATION
	doesnotevolve: null, // NEEDS TRANSLATION
	zcrystal: null, // NEEDS TRANSLATION
	target: null, // NEEDS TRANSLATION
	height: "Taille",
	numm: "{NUMBER} m",
	weight: "Poids",
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
	hp: "PV",
	atk: "Attaque", "atk:grammar": "fs",
	def: "Défense", "def:grammar": "fs",
	spa: "Attaque Spéciale", "spa:grammar": "fs",
	spd: "Défense Spéciale", "spd:grammar": "fs",
	spe: "Vitesse", "spe:grammar": "fs",
	accuracy: "Précision", "accuracy:grammar": "fs",
	evasion: "Esquive", "evasion:grammar": "fs",
	spc: "Spécial", "spc:grammar": "ms",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike TermNames.stats)
	stats: "stats", "stats:grammar": "fp",
};

export const StatMediumNames: { [id: string]: TranslationString } = {
	hp: "PV", atk: "Attaque", def: "Défense",
	spa: "Atq. Spé.", spd: "Déf. Spé.", spe: "Vitesse",
	accuracy: "Précision", evasion: "Esquive", spc: "Spécial",
};

export const StatShortNames: { [id: string]: TranslationString } = {
	hp: "PV", atk: "Atq", def: "Déf", spa: "ASp", spd: "DSp", spe: "Vit", spc: "Spé",
};

export const TypeNames: { [id: string]: TranslationString } = {
	bug: "Insecte",
	dark: "Ténèbres",
	dragon: "Dragon",
	electric: "Électrik",
	fairy: "Fée",
	fighting: "Combat",
	fire: "Feu",
	flying: "Vol",
	ghost: "Spectre",
	grass: "Plante",
	ground: "Sol",
	ice: "Glace",
	normal: "Normal",
	poison: "Poison",
	psychic: "Psy",
	rock: "Roche",
	steel: "Acier",
	stellar: "Stellaire",
	water: "Eau",
};

export const NatureNames: { [id: string]: TranslationString } = {
	adamant: "Rigide",
	bashful: "Pudique",
	bold: "Assuré",
	brave: "Brave",
	calm: "Calme",
	careful: "Prudent",
	docile: "Docile",
	gentle: "Gentil",
	hardy: "Hardi",
	hasty: "Pressé",
	impish: "Malin",
	jolly: "Jovial",
	lax: "Lâche",
	lonely: "Solo",
	mild: "Doux",
	modest: "Modeste",
	naive: "Naïf",
	naughty: "Mauvais",
	quiet: "Discret",
	quirky: "Bizarre",
	rash: "Foufou",
	relaxed: "Relax",
	sassy: "Malpoli",
	serious: "Sérieux",
	timid: "Timide",
};

export const GenderNames: { [id: string]: TranslationString } = {
	male: "Mâle",
	female: "Femelle",
	genderless: null, // NEEDS TRANSLATION
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

// from veekun/Poképédia who presumably got it from Pokédex 3D Pro
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
	black: "Noir",
	blue: "Bleu",
	brown: "Brun",
	gray: "Gris",
	green: "Vert",
	pink: "Rose",
	purple: "Violet",
	red: "Rouge",
	white: "Blanc",
	yellow: "Jaune",
};
