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
	Bug: "Insecte",
	Dark: "Ténèbres",
	Dragon: "Dragon",
	Electric: "Électrik",
	Fairy: "Fée",
	Fighting: "Combat",
	Fire: "Feu",
	Flying: "Vol",
	Ghost: "Spectre",
	Grass: "Plante",
	Ground: "Sol",
	Ice: "Glace",
	Normal: "Normal",
	Poison: "Poison",
	Psychic: "Psy",
	Rock: "Roche",
	Steel: "Acier",
	Stellar: "Stellaire",
	Water: "Eau",
	"???": null, // NEEDS TRANSLATION
};

export const NatureNames: { [id: string]: TranslationString } = {
	Adamant: "Rigide",
	Bashful: "Pudique",
	Bold: "Assuré",
	Brave: "Brave",
	Calm: "Calme",
	Careful: "Prudent",
	Docile: "Docile",
	Gentle: "Gentil",
	Hardy: "Hardi",
	Hasty: "Pressé",
	Impish: "Malin",
	Jolly: "Jovial",
	Lax: "Lâche",
	Lonely: "Solo",
	Mild: "Doux",
	Modest: "Modeste",
	Naive: "Naïf",
	Naughty: "Mauvais",
	Quiet: "Discret",
	Quirky: "Bizarre",
	Rash: "Foufou",
	Relaxed: "Relax",
	Sassy: "Malpoli",
	Serious: "Sérieux",
	Timid: "Timide",
};

export const GenderNames: { [id: string]: TranslationString } = {
	M: "Mâle",
	F: "Femelle",
	N: null, // NEEDS TRANSLATION
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
	Monster: null, // NEEDS TRANSLATION
	"Water 1": null, // NEEDS TRANSLATION
	Bug: null, // NEEDS TRANSLATION
	Flying: null, // NEEDS TRANSLATION
	Field: null, // NEEDS TRANSLATION
	Fairy: null, // NEEDS TRANSLATION
	Grass: null, // NEEDS TRANSLATION
	"Human-Like": null, // NEEDS TRANSLATION
	"Water 3": null, // NEEDS TRANSLATION
	Mineral: null, // NEEDS TRANSLATION
	Amorphous: null, // NEEDS TRANSLATION
	"Water 2": null, // NEEDS TRANSLATION
	Ditto: null, // NEEDS TRANSLATION
	Dragon: null, // NEEDS TRANSLATION
	Undiscovered: null, // NEEDS TRANSLATION
};

export const ColorNames: { [id: string]: TranslationString } = {
	Black: "Noir",
	Blue: "Bleu",
	Brown: "Brun",
	Gray: "Gris",
	Green: "Vert",
	Pink: "Rose",
	Purple: "Violet",
	Red: "Rouge",
	White: "Blanc",
	Yellow: "Jaune",
};
