export const StatNames: { [id: string]: TranslationString } = {
	hp: "PS",
	atk: "Ataque", "atk:grammar": "ms",
	def: "Defensa", "def:grammar": "fs",
	spa: "Ataque Especial", "spa:grammar": "ms",
	spd: "Defensa Especial", "spd:grammar": "fs",
	spe: "Velocidad", "spe:grammar": "fs",
	accuracy: "Precisión", "accuracy:grammar": "fs",
	evasion: "Evasión", "evasion:grammar": "fs",
	spc: "Especial", "spc:grammar": "ms",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike "Stats" in ui.ts)
	stats: "características", "stats:grammar": "fp",
};

export const StatMediumNames: { [id: string]: TranslationString } = {
	hp: "PS", atk: "Ataque", def: "Defensa",
	spa: "At. Esp.", spd: "Def. Esp.", spe: "Velocidad",
	accuracy: "Precisión", evasion: "Evasión", spc: "Especial",
};

export const StatShortNames: { [id: string]: TranslationString } = {
	hp: "PS", atk: "Ata", def: "Def", spa: "AEs", spd: "DEs", spe: "Vel", spc: "Esp",
};

export const TypeNames: { [id: string]: TranslationString } = {
	Bug: "Bicho",
	Dark: "Siniestro",
	Dragon: "Dragón",
	Electric: "Eléctrico",
	Fairy: "Hada",
	Fighting: "Lucha",
	Fire: "Fuego",
	Flying: "Volador",
	Ghost: "Fantasma",
	Grass: "Planta",
	Ground: "Tierra",
	Ice: "Hielo",
	Normal: "Normal",
	Poison: "Veneno",
	Psychic: "Psíquico",
	Rock: "Roca",
	Steel: "Acero",
	Stellar: "Astral",
	Water: "Agua",
	"???": null, // NEEDS TRANSLATION
};

export const NatureNames: { [id: string]: TranslationString } = {
	Adamant: "Firme",
	Bashful: "Tímida",
	Bold: "Osada",
	Brave: "Audaz",
	Calm: "Serena",
	Careful: "Cauta",
	Docile: "Dócil",
	Gentle: "Amable",
	Hardy: "Fuerte",
	Hasty: "Activa",
	Impish: "Agitada",
	Jolly: "Alegre",
	Lax: "Floja",
	Lonely: "Huraña",
	Mild: "Afable",
	Modest: "Modesta",
	Naive: "Ingenua",
	Naughty: "Pícara",
	Quiet: "Mansa",
	Quirky: "Rara",
	Rash: "Alocada",
	Relaxed: "Plácida",
	Sassy: "Grosera",
	Serious: "Seria",
	Timid: "Miedosa",
};

export const GenderNames: { [id: string]: TranslationString } = {
	M: "Macho",
	F: "Hembra",
	N: "Desconocido",
};

export const StatusNames: { [id: string]: TranslationString } = {
	brn: "Quemado", // verified: SV es_common 21613
	par: "Paralizado", // verified: SV es_common 21609
	slp: null, // NEEDS TRANSLATION
	frz: null, // NEEDS TRANSLATION
	psn: "Envenenado", // verified: SV es_common 21607
	tox: "Grav. envenenado", // verified: SV es_common 21545
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

// from veekun/WikiDex who presumably got it from Pokédex 3D Pro
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
	Black: "Negro",
	Blue: "Azul",
	Brown: "Marrón",
	Gray: "Gris",
	Green: "Verde",
	Pink: "Rosa",
	Purple: "Morado",
	Red: "Rojo",
	White: "Blanco",
	Yellow: "Amarillo",
};
