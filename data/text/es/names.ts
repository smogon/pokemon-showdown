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
	slp: "Dormido", // NEEDS QC
	frz: "Congelado", // NEEDS QC
	psn: "Envenenado", // verified: SV es_common 21607
	tox: "Grav. envenenado", // verified: SV es_common 21545
	fnt: "Debilitado", // NEEDS QC
	confusion: "Confuso", // NEEDS QC
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: "Puede apuntar a un aliado o rival adyacente", // NEEDS QC
	normalDoubles: "Puede apuntar al aliado o a cualquier rival", // NEEDS QC
	normalSingles: "Afecta al rival", // NEEDS QC
	normalFFA: "Puede apuntar a cualquier rival", // NEEDS QC
	self: "Afecta al usuario", // NEEDS QC
	adjacentAlly: "Puede apuntar a un aliado adyacente", // NEEDS QC
	adjacentAllyDoubles: "Afecta al aliado", // NEEDS QC
	adjacentAllySingles: "Siempre falla en los Combates Individuales", // NEEDS QC
	adjacentAllyOrSelf: "Puede apuntar al usuario o a un aliado adyacente", // NEEDS QC
	adjacentAllyOrSelfDoubles: "Puede apuntar al usuario o al aliado", // NEEDS QC
	adjacentFoe: "Puede apuntar a un rival adyacente", // NEEDS QC
	allAdjacentFoes: "Afecta a los rivales adyacentes", // NEEDS QC
	allAdjacentFoesDoubles: "Afecta a ambos rivales", // NEEDS QC
	foeSide: "Afecta al lado rival", // NEEDS QC
	allySide: "Afecta al lado del usuario", // NEEDS QC
	allyTeam: "Afecta al equipo del usuario", // NEEDS QC
	allAdjacent: "Afecta a los aliados y rivales adyacentes", // NEEDS QC
	allAdjacentDoubles: "Afecta al aliado y a ambos rivales", // NEEDS QC
	allAdjacentFFA: "Afecta a todos los rivales", // NEEDS QC
	any: "Puede apuntar a Pokémon alejados en los Combates Trío", // NEEDS QC
	all: "Afecta a todos los Pokémon", // NEEDS QC
	scripted: "Objetivo elegido automáticamente", // NEEDS QC
	randomNormal: "Afecta a un rival adyacente al azar", // NEEDS QC
	randomNormalDoubles: "Afecta a un rival al azar", // NEEDS QC
	allies: "Afecta al usuario y a los aliados", // NEEDS QC
};

// from veekun/WikiDex who presumably got it from Pokédex 3D Pro
// Stadium 2 names in comments
export const EggGroupNames: { [id: string]: TranslationString } = {
	Monster: "Monstruo", // NEEDS QC
	"Water 1": "Agua 1", // NEEDS QC
	Bug: "Bicho", // NEEDS QC
	Flying: "Volador", // NEEDS QC
	Field: "Campo", // NEEDS QC: Stadium 2: "Tierra" (when English was "Ground")
	Fairy: "Hada", // NEEDS QC
	Grass: "Planta", // NEEDS QC
	"Human-Like": "Humanoide", // NEEDS QC: Stadium 2: "F. Humana"
	"Water 3": "Agua 3", // NEEDS QC
	Mineral: "Mineral", // NEEDS QC
	Amorphous: "Amorfo", // NEEDS QC: Stadium 2: "Indeterminado"
	"Water 2": "Agua 2", // NEEDS QC
	Ditto: "Ditto", // NEEDS QC
	Dragon: "Dragón", // NEEDS QC
	Undiscovered: "Desconocido", // NEEDS QC: Stadium 2: "No pone Huevos"
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
