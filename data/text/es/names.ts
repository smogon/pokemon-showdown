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
	// so it should be lowercase (unlike the "Stats" UI catalog entry)
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
	bug: "Bicho",
	dark: "Siniestro",
	dragon: "Dragón",
	electric: "Eléctrico",
	fairy: "Hada",
	fighting: "Lucha",
	fire: "Fuego",
	flying: "Volador",
	ghost: "Fantasma",
	grass: "Planta",
	ground: "Tierra",
	ice: "Hielo",
	normal: "Normal",
	poison: "Veneno",
	psychic: "Psíquico",
	rock: "Roca",
	steel: "Acero",
	stellar: "Astral",
	water: "Agua",
};

export const NatureNames: { [id: string]: TranslationString } = {
	adamant: "Firme",
	bashful: "Tímida",
	bold: "Osada",
	brave: "Audaz",
	calm: "Serena",
	careful: "Cauta",
	docile: "Dócil",
	gentle: "Amable",
	hardy: "Fuerte",
	hasty: "Activa",
	impish: "Agitada",
	jolly: "Alegre",
	lax: "Floja",
	lonely: "Huraña",
	mild: "Afable",
	modest: "Modesta",
	naive: "Ingenua",
	naughty: "Pícara",
	quiet: "Mansa",
	quirky: "Rara",
	rash: "Alocada",
	relaxed: "Plácida",
	sassy: "Grosera",
	serious: "Seria",
	timid: "Miedosa",
};

export const GenderNames: { [id: string]: TranslationString } = {
	male: "Macho",
	female: "Hembra",
	genderless: "Desconocido",
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
	any: "Puede apuntar a Pokémon alejados en los Combates Triples", // NEEDS QC
	all: "Afecta a todos los Pokémon", // NEEDS QC
	scripted: "Objetivo elegido automáticamente", // NEEDS QC
	randomNormal: "Afecta a un rival adyacente al azar", // NEEDS QC
	randomNormalDoubles: "Afecta a un rival al azar", // NEEDS QC
	allies: "Afecta al usuario y a los aliados", // NEEDS QC
};

// from veekun/WikiDex who presumably got it from Pokédex 3D Pro
// Stadium 2 names in comments
export const EggGroupNames: { [id: string]: TranslationString } = {
	monster: "Monstruo", // NEEDS QC
	water1: "Agua 1", // NEEDS QC
	bug: "Bicho", // NEEDS QC
	flying: "Volador", // NEEDS QC
	field: "Campo", // NEEDS QC: Stadium 2: "Tierra" (when English was "Ground")
	fairy: "Hada", // NEEDS QC
	grass: "Planta", // NEEDS QC
	humanlike: "Humanoide", // NEEDS QC: Stadium 2: "F. Humana"
	water3: "Agua 3", // NEEDS QC
	mineral: "Mineral", // NEEDS QC
	amorphous: "Amorfo", // NEEDS QC: Stadium 2: "Indeterminado"
	water2: "Agua 2", // NEEDS QC
	ditto: "Ditto", // NEEDS QC
	dragon: "Dragón", // NEEDS QC
	undiscovered: "Desconocido", // NEEDS QC: Stadium 2: "No pone Huevos"
};

export const ColorNames: { [id: string]: TranslationString } = {
	black: "Negro",
	blue: "Azul",
	brown: "Marrón",
	gray: "Gris",
	green: "Verde",
	pink: "Rosa",
	purple: "Morado",
	red: "Rojo",
	white: "Blanco",
	yellow: "Amarillo",
};
