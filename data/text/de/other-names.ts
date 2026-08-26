export const TermNames: { [id: string]: TranslationString } = {
	shiny: "Schillernd",
	happiness: "Freundschaft", // NEEDS QC
	level: "Level",
	nickname: "Spitzname", // NEEDS QC
	ev: "EV",
	evs: "EVs",
	iv: "IV",
	ivs: "IVs",
	dv: "DVs",
	dvs: "DVs",
	av: "AV",
	avs: "AVs",
	point: "Punkt", // NEEDS QC
	points: "Punkte", // NEEDS QC
	stats: "Statuswerte", "stats:grammar": "mp",

	pokemon: "Pokémon",
	move: "Attacke", // NEEDS QC
	moves: "Attacken", // NEEDS QC
	item: "Item", // NEEDS QC
	items: "Items", // NEEDS QC
	ability: "Fähigkeit", // NEEDS QC
	abilities: "Fähigkeiten", // NEEDS QC
	hiddenability: "Versteckte Fähigkeit", // NEEDS QC

	type: "Typ",
	types: "Typen",
	teratype: "Tera-Typ", // NEEDS QC
	nature: "Wesen",
	category: "Kategorie",
	categories: "Kategorien",
	gender: "Geschlecht",
	egggroup: "Ei-Gruppe", // NEEDS QC
	egggroups: "Ei-Gruppen", // NEEDS QC
	tag: "Etikett", // NEEDS QC
	color: "Farbe",
	form: "Form", // NEEDS QC
	forme: "Form", // NEEDS QC
	dexnum: "Pokédex-Nr.", // NEEDS QC
	gen: "Generation", // NEEDS QC
	evolution: "Entwicklung", // NEEDS QC
	preevolution: "Vorentwicklung", // NEEDS QC
	doesnotevolve: "Entwickelt sich nicht", // NEEDS QC
	zcrystal: "Z-Kristall", // NEEDS QC
	target: "Ziel", // NEEDS QC
	height: "Größe",
	numm: "[NUMBER] m",
	weight: "Gewicht",
	numkg: "[NUMBER] kg",

	megaevolution: "Mega-Entwicklung", // NEEDS QC
	zpower: "Z-Kraft", // NEEDS QC
	dynamax: "Dynamax", // NEEDS QC
	dynamaxlevel: "Dynamax-Level", // NEEDS QC

	supereffective: "Sehr effektiv", // NEEDS QC
	extremelyeffective: "Extrem effektiv", // NEEDS QC
	effective: "Effektiv", // NEEDS QC
	notveryeffective: "Nicht sehr effektiv", // NEEDS QC
	mostlyineffective: "Extrem ineffektiv", // NEEDS QC
	noeffect: "Wirkungslos", // NEEDS QC

	weak: "Schwäche", // NEEDS QC: unofficial
	resist: "Resistenz", // NEEDS QC: unofficial
	immune: "Immunität", // NEEDS QC: unofficial
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
	brn: "Verbrennung", // NEEDS QC
	par: "Paralysiert", // NEEDS QC
	slp: "Schläft", // NEEDS QC
	frz: "Gefroren", // NEEDS QC
	psn: "Vergiftet", // NEEDS QC
	tox: "Schwer vergiftet", // NEEDS QC
	fnt: "Besiegt", // NEEDS QC
	confusion: "Verwirrung", // NEEDS QC
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: "Ein angrenzendes Pokémon", // NEEDS QC
	self: "Anwender", // NEEDS QC
	adjacentAlly: "Ein Mitstreiter", // NEEDS QC
	adjacentAllyOrSelf: "Anwender oder Mitstreiter", // NEEDS QC
	adjacentFoe: "Ein angrenzender Gegner", // NEEDS QC
	allAdjacentFoes: "Alle angrenzenden Gegner", // NEEDS QC
	foeSide: "Gegnerische Seite", // NEEDS QC
	allySide: "Seite des Anwenders", // NEEDS QC
	allyTeam: "Team des Anwenders", // NEEDS QC
	allAdjacent: "Alle angrenzenden Pokémon", // NEEDS QC
	any: "Ein beliebiges Pokémon", // NEEDS QC
	all: "Alle Pokémon", // NEEDS QC
	scripted: "Automatisch gewählt", // NEEDS QC
	randomNormal: "Zufälliger angrenzender Gegner", // NEEDS QC
	allies: "Anwender und Mitstreiter", // NEEDS QC
};

export const EggGroupNames: { [id: string]: TranslationString } = {
	monster: "Monster", // NEEDS QC
	water1: "Wasser 1", // NEEDS QC
	bug: "Käfer", // NEEDS QC
	flying: "Flug", // NEEDS QC
	field: "Feld", // NEEDS QC
	fairy: "Fee", // NEEDS QC
	grass: "Pflanze", // NEEDS QC
	humanlike: "Humanotyp", // NEEDS QC
	water3: "Wasser 3", // NEEDS QC
	mineral: "Mineral", // NEEDS QC
	amorphous: "Amorph", // NEEDS QC
	water2: "Wasser 2", // NEEDS QC
	ditto: "Ditto", // NEEDS QC
	dragon: "Drache", // NEEDS QC
	undiscovered: "Unbekannt", // NEEDS QC
};

export const TagNames: { [id: string]: TranslationString } = {
	physical: "Physisch",
	special: "Spezial",
	status: "Status",
	mega: "Mega-Entwicklung",
	gigantamax: "Gigadynamax",
	mythical: "Mysteriöses Pokémon",
	sublegendary: "Sub-Legendär", // NEEDS QC
	restrictedlegendary: "Limitiert-Legendär", // NEEDS QC
	ultrabeast: "Ultrabestie",
	paradox: "Paradox",
	pokestar: "Pokéwood", // NEEDS QC
	zmove: "Z-Attacke",
	maxmove: "Dynamax-Attacke",
	contact: "Kontakt", // NEEDS QC
	sound: "Geräusch", // NEEDS QC
	powder: "Pulver", // NEEDS QC
	fist: "Schlag", // NEEDS QC
	pulse: "Welle", // NEEDS QC
	bite: "Biss", // NEEDS QC
	bullet: "Kugel", // NEEDS QC
	dance: "Tanz", // NEEDS QC
	slicing: "Schnitt", // NEEDS QC
	wind: "Wind",
	bypassprotect: "Umgeht Schutz", // NEEDS QC
	nonreflectable: "Nicht reflektierbar", // NEEDS QC
	nonmirror: "Nicht kopierbar", // NEEDS QC
	nonsnatchable: "Nicht übernehmbar", // NEEDS QC
	bypasssubstitute: "Umgeht Delegator", // NEEDS QC
	gmaxmove: "Gigadynamax-Attacke", // NEEDS QC
	past: "Vergangenheit", // NEEDS QC
	truepast: "Nur Vergangenheit", // NEEDS QC
	pastunobtainable: "Früher unerhältlich", // NEEDS QC
	future: "Zukunft", // NEEDS QC
	lgpe: "LGPE",
	unobtainable: "Nicht erhältlich", // NEEDS QC
	cap: "CAP",
	custom: "Benutzerdefiniert", // NEEDS QC
	nonexistent: "Nicht existent", // NEEDS QC

	introducedgen: "Generation", // NEEDS QC
	height: "Größe",
	weight: "Gewicht",
	hp: "KP", // NEEDS QC
	atk: "Ang.", // NEEDS QC
	def: "Vert.", // NEEDS QC
	spa: "Sp.-Ang.", // NEEDS QC
	spd: "Sp.-Vert.", // NEEDS QC
	spe: "Init.", // NEEDS QC
	bst: "BST",
	basepower: "Stärke",
	priority: "Priorität", // NEEDS QC
	accuracy: "Genauigkeit",
	maxpp: "Max. AP", // NEEDS QC
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
