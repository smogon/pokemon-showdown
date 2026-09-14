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
	// so it should be lowercase (unlike "Stats" in ui.ts)
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
