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
	// n.b. used in Teambuilder, so it should be capitalized (unlike StatNames.stats)
	stats: "Statuswerte",

	pokemon: "Pokémon",
	move: "Attacke", // NEEDS QC
	moves: "Attacken", // NEEDS QC
	item: "Item", // NEEDS QC
	items: "Items", // NEEDS QC
	ability: "Fähigkeit", // NEEDS QC
	abilities: "Fähigkeiten", // NEEDS QC
	hiddenability: "Versteckte Fähigkeit", // NEEDS QC
	possibleabilities: "Mögliche Fähigkeiten", // NEEDS QC
	team: "Team",
	teams: "Teams",
	teamslist: "Teamliste", // NEEDS QC

	type: "Typ",
	types: "Typen",
	teratype: "Tera-Typ: {TYPE}", // NEEDS QC
	nature: "Wesen",
	category: "Kategorie",
	categories: "Kategorien",
	gender: "Geschlecht",
	egggroup: "Ei-Gruppe", // NEEDS QC
	egggroups: "Ei-Gruppen", // NEEDS QC
	tag: "Tag", // NEEDS QC: borrowed term, user-approved (avoids collision with category = "Kategorie")
	article: "Artikel", // NEEDS QC
	articles: "Artikel", // NEEDS QC
	tier: "Tier",
	tiers: "Tiers",
	format: "Format", // NEEDS QC
	formats: "Formate", // NEEDS QC
	color: "Farbe",
	form: "Form", // NEEDS QC
	forme: "Form", // NEEDS QC
	dexnum: "Pokédex-Nr.", // NEEDS QC
	generation: "Generation",
	gennum: "{NUMBER}. Gen", // NEEDS QC
	evolution: "Entwicklung", // NEEDS QC
	preevolution: "Vorentwicklung", // NEEDS QC
	doesnotevolve: "Entwickelt sich nicht", // NEEDS QC
	zcrystal: "Z-Kristall", // NEEDS QC
	target: "Ziel", // NEEDS QC
	height: "Größe",
	numm: "{NUMBER} m",
	weight: "Gewicht",
	numkg: "{NUMBER} kg",
	critrate: "Volltrefferquote", // NEEDS QC
	user: "Nutzbar von", // NEEDS QC
	requiredmove: "Benötigte Attacke", // NEEDS QC
	dynamaxpower: "Dynamax-Stärke", // NEEDS QC
	none: "Keine", // NEEDS QC
	pastgensonly: "Nur frühere Generationen", // NEEDS QC
	flingbasepower: "Schleuder-Stärke", // NEEDS QC
	flingeffect: "Schleuder-Effekt", // NEEDS QC
	naturalgifttype: "Beerenkräfte-Typ", // NEEDS QC
	naturalgiftbasepower: "Beerenkräfte-Stärke", // NEEDS QC

	megaevolution: "Mega-Entwicklung", // NEEDS QC
	zpower: "Z-Kraft", // NEEDS QC
	zeffect: "Z-Effekt", // NEEDS QC
	dynamax: "Dynamax", // NEEDS QC
	dynamaxlevel: "Dynamax-Level", // NEEDS QC
	ultraburst: "Ultra-Burst", // NEEDS QC
	tera: "Tera", // NEEDS QC

	supereffective: "Sehr effektiv", // NEEDS QC
	extremelyeffective: "Extrem effektiv", // NEEDS QC
	effective: "Effektiv", // NEEDS QC
	notveryeffective: "Nicht sehr effektiv", // NEEDS QC
	mostlyineffective: "Extrem ineffektiv", // NEEDS QC
	noeffect: "Wirkungslos", // NEEDS QC

	weak: "Schwäche", // NEEDS QC: unofficial
	resist: "Resistenz", // NEEDS QC: unofficial
	immune: "Immunität", // NEEDS QC: unofficial

	nicknamespecies: "{NICKNAME} ({SPECIES})",
	label: "{LABEL}: ", // NEEDS QC
	noweather: "(kein Wetter)", // NEEDS QC
	noitem: "(kein Item)", // NEEDS QC
	noability: "(keine Fähigkeit)", // NEEDS QC
	foescondition: "{CONDITION} des Gegners", // NEEDS QC
	speciesforme: "{FORME}-{SPECIES}", // NEEDS QC
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

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike TermNames.stats)
	stats: "Statuswerte", "stats:grammar": "mp",
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
	brn: "Verbrennungen",
	par: "Paralyse",
	slp: "Schlaf",
	frz: "Gefroren",
	psn: "Vergiftung",
	tox: "Schwere Vergiftung",
	fnt: "Besiegt", // NEEDS QC
	confusion: "Verwirrung",
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: "Kann benachbarte Mitstreiter oder Gegner anvisieren", // NEEDS QC
	normalDoubles: "Kann Mitstreiter oder jeden Gegner anvisieren", // NEEDS QC
	normalSingles: "Trifft den Gegner", // NEEDS QC
	normalFFA: "Kann jeden Gegner anvisieren", // NEEDS QC
	self: "Trifft den Anwender", // NEEDS QC
	adjacentAlly: "Kann benachbarte Mitstreiter anvisieren", // NEEDS QC
	adjacentAllyDoubles: "Trifft den Mitstreiter", // NEEDS QC
	adjacentAllySingles: "Schlägt in Einzelkämpfen immer fehl", // NEEDS QC
	adjacentAllyOrSelf: "Kann Anwender oder benachbarte Mitstreiter anvisieren", // NEEDS QC
	adjacentAllyOrSelfDoubles: "Kann Anwender oder Mitstreiter anvisieren", // NEEDS QC
	adjacentFoe: "Kann benachbarte Gegner anvisieren", // NEEDS QC
	allAdjacentFoes: "Trifft benachbarte Gegner", // NEEDS QC
	allAdjacentFoesDoubles: "Trifft beide Gegner", // NEEDS QC
	foeSide: "Trifft die gegnerische Seite", // NEEDS QC
	allySide: "Trifft die eigene Seite", // NEEDS QC
	allyTeam: "Trifft das eigene Team", // NEEDS QC
	allAdjacent: "Trifft benachbarte Mitstreiter und Gegner", // NEEDS QC
	allAdjacentDoubles: "Trifft Mitstreiter und beide Gegner", // NEEDS QC
	allAdjacentFFA: "Trifft alle Gegner", // NEEDS QC
	any: "Kann in Dreierkämpfen entfernte Pokémon anvisieren", // NEEDS QC
	all: "Trifft alle Pokémon", // NEEDS QC
	scripted: "Ziel wird automatisch gewählt", // NEEDS QC
	randomNormal: "Trifft zufälligen benachbarten Gegner", // NEEDS QC
	randomNormalDoubles: "Trifft zufälligen Gegner", // NEEDS QC
	allies: "Trifft Anwender und Mitstreiter", // NEEDS QC
};

// from veekun/Bulbapedia who presumably got it from Pokédex 3D Pro
// Stadium 2 names in comments
export const EggGroupNames: { [id: string]: TranslationString } = {
	monster: "Monster", // NEEDS QC
	water1: "Wasser 1", // NEEDS QC
	bug: "Käfer", // NEEDS QC
	flying: "Flug", // NEEDS QC
	field: "Feld", // NEEDS QC: Stadium 2: "Boden" (when English was "Ground")
	fairy: "Fee", // NEEDS QC
	grass: "Pflanze", // NEEDS QC
	humanlike: "Humanotyp", // NEEDS QC
	water3: "Wasser 3", // NEEDS QC
	mineral: "Mineral", // NEEDS QC
	amorphous: "Amorph", // NEEDS QC: Stadium 2: "Unbestimmt" (when English was "Indeterminate")
	water2: "Wasser 2", // NEEDS QC
	ditto: "Ditto", // NEEDS QC
	dragon: "Drache", // NEEDS QC
	undiscovered: "Unbekannt", // NEEDS QC: Stadium 2: "Keine Eier" (when English was "No Eggs")
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
