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
	// so it should be lowercase (unlike "Stats" in ui.ts)
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
	Bug: "Coleottero",
	Dark: "Buio",
	Dragon: "Drago",
	Electric: "Elettro",
	Fairy: "Folletto",
	Fighting: "Lotta",
	Fire: "Fuoco",
	Flying: "Volante",
	Ghost: "Spettro",
	Grass: "Erba",
	Ground: "Terra",
	Ice: "Ghiaccio",
	Normal: "Normale",
	Poison: "Veleno",
	Psychic: "Psico",
	Rock: "Roccia",
	Steel: "Acciaio",
	Stellar: "Astrale",
	Water: "Acqua",
	"???": null, // NEEDS TRANSLATION
};

export const NatureNames: { [id: string]: TranslationString } = {
	Adamant: "Decisa",
	Bashful: "Ritrosa",
	Bold: "Sicura",
	Brave: "Audace",
	Calm: "Calma",
	Careful: "Cauta",
	Docile: "Docile",
	Gentle: "Gentile",
	Hardy: "Ardita",
	Hasty: "Lesta",
	Impish: "Scaltra",
	Jolly: "Allegra",
	Lax: "Fiacca",
	Lonely: "Schiva",
	Mild: "Mite",
	Modest: "Modesta",
	Naive: "Ingenua",
	Naughty: "Birbona",
	Quiet: "Quieta",
	Quirky: "Furba",
	Rash: "Ardente",
	Relaxed: "Placida",
	Sassy: "Vivace",
	Serious: "Seria",
	Timid: "Timida",
};

export const GenderNames: { [id: string]: TranslationString } = {
	M: "Maschio",
	F: "Femmina",
	N: "Sconosciuto",
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
	Black: "Nero",
	Blue: "Blu",
	Brown: "Marrone",
	Gray: "Grigio",
	Green: "Verde",
	Pink: "Rosa",
	Purple: "Viola",
	Red: "Rosso",
	White: "Bianco",
	Yellow: "Giallo",
};
