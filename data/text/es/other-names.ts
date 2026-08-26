export const TermNames: { [id: string]: TranslationString } = {
	shiny: "Variocolor",
	happiness: "Amistad", // NEEDS QC
	level: "Nivel", // NEEDS QC
	nickname: "Mote", // NEEDS QC
	ev: "EV",
	evs: "EVs",
	iv: "IV",
	ivs: "IVs",
	dv: "DVs",
	dvs: "DVs",
	av: "AV",
	avs: "AVs",
	point: "Punto", // NEEDS QC
	points: "Puntos", // NEEDS QC
	stats: "Características", "stats:grammar": "fp",

	pokemon: "Pokémon",
	move: "Movimiento", // NEEDS QC
	moves: "Movimientos", // NEEDS QC
	item: "Objeto", // NEEDS QC
	items: "Objetos", // NEEDS QC
	ability: "Habilidad", // NEEDS QC
	abilities: "Habilidades", // NEEDS QC
	hiddenability: "Habilidad oculta", // NEEDS QC

	type: "Tipo",
	types: "Tipos",
	teratype: "Teratipo", // NEEDS QC
	nature: "Naturaleza",
	category: "Clase",
	categories: "Clases",
	gender: "Sexo",
	egggroup: "Grupo Huevo", // NEEDS QC
	egggroups: "Grupos Huevo", // NEEDS QC
	tag: "Etiqueta", // NEEDS QC
	color: "Color",
	form: "Forma", // NEEDS QC
	forme: "Forma", // NEEDS QC
	dexnum: "N.º Pokédex", // NEEDS QC
	gen: "Generación", // NEEDS QC
	evolution: "Evolución", // NEEDS QC
	preevolution: "Preevolución", // NEEDS QC
	doesnotevolve: "No evoluciona", // NEEDS QC
	zcrystal: "Cristal Z", // NEEDS QC
	target: "Objetivo", // NEEDS QC
	height: "Altura",
	numm: "[NUMBER] m",
	weight: "Peso",
	numkg: "[NUMBER] kg",

	megaevolution: "Megaevolución", // NEEDS QC
	zpower: "Poder Z", // NEEDS QC
	dynamax: "Dinamax", // NEEDS QC
	dynamaxlevel: "Nivel Dinamax", // NEEDS QC

	supereffective: "Supereficaz", // NEEDS QC
	extremelyeffective: "Hipereficaz", // NEEDS QC
	effective: "Eficaz", // NEEDS QC
	notveryeffective: "Poco eficaz", // NEEDS QC
	mostlyineffective: "Muy poco eficaz", // NEEDS QC
	noeffect: "Sin efecto", // NEEDS QC

	weak: "Debilidad", // NEEDS QC: unofficial
	resist: "Resistencia", // NEEDS QC: unofficial
	immune: "Inmunidad", // NEEDS QC: unofficial
};

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
	brn: "Quemado", // NEEDS QC
	par: "Paralizado", // NEEDS QC
	slp: "Dormido", // NEEDS QC
	frz: "Congelado", // NEEDS QC
	psn: "Envenenado", // NEEDS QC
	tox: "Grav. envenenado", // NEEDS QC
	fnt: "Debilitado", // NEEDS QC
	confusion: "Confuso", // NEEDS QC
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: "Un Pokémon adyacente", // NEEDS QC
	self: "Usuario", // NEEDS QC
	adjacentAlly: "Un aliado", // NEEDS QC
	adjacentAllyOrSelf: "Usuario o aliado", // NEEDS QC
	adjacentFoe: "Un rival adyacente", // NEEDS QC
	allAdjacentFoes: "Todos los rivales adyacentes", // NEEDS QC
	foeSide: "Campo rival", // NEEDS QC
	allySide: "Campo del usuario", // NEEDS QC
	allyTeam: "Equipo del usuario", // NEEDS QC
	allAdjacent: "Todos los Pokémon adyacentes", // NEEDS QC
	any: "Cualquier Pokémon", // NEEDS QC
	all: "Todos los Pokémon", // NEEDS QC
	scripted: "Elegido automáticamente", // NEEDS QC
	randomNormal: "Rival adyacente aleatorio", // NEEDS QC
	allies: "Usuario y aliados", // NEEDS QC
};

export const EggGroupNames: { [id: string]: TranslationString } = {
	monster: "Monstruo", // NEEDS QC
	water1: "Agua 1", // NEEDS QC
	bug: "Bicho", // NEEDS QC
	flying: "Volador", // NEEDS QC
	field: "Campo", // NEEDS QC
	fairy: "Hada", // NEEDS QC
	grass: "Planta", // NEEDS QC
	humanlike: "Humanoide", // NEEDS QC
	water3: "Agua 3", // NEEDS QC
	mineral: "Mineral", // NEEDS QC
	amorphous: "Amorfo", // NEEDS QC
	water2: "Agua 2", // NEEDS QC
	ditto: "Ditto", // NEEDS QC
	dragon: "Dragón", // NEEDS QC
	undiscovered: "Desconocido", // NEEDS QC
};

export const TagNames: { [id: string]: TranslationString } = {
	physical: "Físico",
	special: "Especial",
	status: "Estado",
	mega: "Megaevolución",
	gigantamax: "Gigamax",
	mythical: "Pokémon singular",
	sublegendary: "Sublegendario", // NEEDS QC
	restrictedlegendary: "Legendario restringido", // NEEDS QC
	ultrabeast: "Ultraente",
	paradox: "Paradoja",
	pokestar: "Pokéwood", // NEEDS QC
	zmove: "Movimiento Z",
	maxmove: "Movimiento Dinamax",
	contact: "Contacto", // NEEDS QC
	sound: "Sonido", // NEEDS QC
	powder: "Polvo", // NEEDS QC
	fist: "Puño", // NEEDS QC
	pulse: "Pulso", // NEEDS QC
	bite: "Mordisco", // NEEDS QC
	bullet: "Proyectil", // NEEDS QC
	dance: "Baile", // NEEDS QC
	slicing: "Corte", // NEEDS QC
	wind: "Viento", // NEEDS QC
	bypassprotect: "Ignora protección", // NEEDS QC
	nonreflectable: "No reflejable", // NEEDS QC
	nonmirror: "No copiable", // NEEDS QC
	nonsnatchable: "No robable", // NEEDS QC
	bypasssubstitute: "Ignora sustituto", // NEEDS QC
	gmaxmove: "Movimiento Gigamax", // NEEDS QC
	past: "Pasado", // NEEDS QC
	truepast: "Solo pasado", // NEEDS QC
	pastunobtainable: "Pasado no obtenible", // NEEDS QC
	future: "Futuro", // NEEDS QC
	lgpe: "LGPE",
	unobtainable: "No obtenible", // NEEDS QC
	cap: "CAP",
	custom: "Personalizado", // NEEDS QC
	nonexistent: "Inexistente", // NEEDS QC

	introducedgen: "Generación", // NEEDS QC
	height: "Altura",
	weight: "Peso",
	hp: "PS", // NEEDS QC
	atk: "At.", // NEEDS QC
	def: "Def.", // NEEDS QC
	spa: "At. Esp.", // NEEDS QC
	spd: "Def. Esp.", // NEEDS QC
	spe: "Vel.", // NEEDS QC
	bst: "BST",
	basepower: "Potencia",
	priority: "Prioridad", // NEEDS QC
	accuracy: "Precisión",
	maxpp: "PP máx.", // NEEDS QC
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
