export const TermNames: { [id: string]: TranslationString } = {
	shiny: "Cromatico",
	happiness: "Amicizia", // NEEDS QC
	level: "Livello", // NEEDS QC
	nickname: "Soprannome", // official: SV it_common 4414
	ev: "EV",
	evs: "EVs",
	iv: "IV",
	ivs: "IVs",
	dv: "DVs",
	dvs: "DVs",
	av: "AV",
	avs: "AVs",
	point: "Punto", // NEEDS QC
	points: "Punti", // NEEDS QC
	// n.b. used in Teambuilder, so it should be capitalized (unlike StatNames.stats)
	stats: "Statistiche",

	pokemon: "Pokémon",
	move: "Mossa", // NEEDS QC
	moves: "Mosse", // NEEDS QC
	item: "Strumento", // NEEDS QC
	items: "Strumenti", // NEEDS QC
	ability: "Abilità", // NEEDS QC
	abilities: "Abilità", // NEEDS QC
	hiddenability: "Abilità speciale", // official: SV it_common 36040 ("con un’abilità speciale")
	possibleabilities: "Abilità possibili", // NEEDS QC
	team: "Squadra", // NEEDS QC
	teams: "Squadre", // NEEDS QC
	teamslist: "Elenco squadre", // NEEDS QC

	type: "Tipo",
	types: "Tipi",
	teratype: "Teratipo {TYPE}", // NEEDS QC
	nature: "Natura",
	category: "Categoria",
	categories: "Categorie",
	gender: "Sesso",
	egggroup: "Gruppo Uova", // NEEDS QC
	egggroups: "Gruppi Uova", // NEEDS QC
	tag: "Etichetta", // NEEDS QC
	article: "Articolo", // NEEDS QC
	articles: "Articoli", // NEEDS QC
	tier: "Tier",
	tiers: "Tier", // NEEDS QC
	format: "Formato", // NEEDS QC
	formats: "Formati", // NEEDS QC
	color: "Colore",
	form: "Forma", // NEEDS QC
	forme: "Forma", // NEEDS QC
	dexnum: "N. Pokédex", // NEEDS QC
	generation: "Generazione", // NEEDS QC
	gennum: "Gen {NUMBER}",
	evolution: "Evoluzione", // NEEDS QC
	preevolution: "Pre-evoluzione", // NEEDS QC
	doesnotevolve: "Non si evolve", // NEEDS QC
	zcrystal: "Cristallo Z", // official: USUM it_common 21919
	target: "Bersaglio", // NEEDS QC
	height: "Altezza",
	numm: "{NUMBER} m",
	weight: "Peso",
	numkg: "{NUMBER} kg",
	critrate: "Tasso di brutto colpo", // NEEDS QC
	user: "Utilizzabile da", // NEEDS QC
	requiredmove: "Mossa richiesta", // NEEDS QC
	dynamaxpower: "Potenza Dynamax", // NEEDS QC
	none: "Nessuno", // NEEDS QC
	pastgensonly: "Solo generazioni precedenti", // NEEDS QC
	flingbasepower: "Potenza di Lancio", // NEEDS QC
	flingeffect: "Effetto di Lancio", // NEEDS QC
	naturalgifttype: "Tipo di Dononaturale", // NEEDS QC
	naturalgiftbasepower: "Potenza di Dononaturale", // NEEDS QC

	megaevolution: "Megaevoluzione", // NEEDS QC
	zpower: "Potere Z", // NEEDS QC
	zeffect: "Effetto Z", // NEEDS QC
	dynamax: "Dynamax", // NEEDS QC
	dynamaxlevel: "Livello Dynamax", // official: SwSh it_common 846
	ultraburst: "Ultraesplosione", // official: USUM it_common 8794
	tera: "Tera", // NEEDS QC

	supereffective: "Superefficace", // official: SV it_common 8613 ("È superefficace!")
	extremelyeffective: "Iperefficace", // official: Champions it_ms 1925 ("È iperefficace!!")
	effective: "Effetto normale", // NEEDS QC
	notveryeffective: "Poco efficace", // NEEDS QC
	mostlyineffective: "Quasi per niente efficace", // official: Champions it_ms 1928
	noeffect: "Nessun effetto", // NEEDS QC

	weak: "Debolezza", // NEEDS QC: unofficial
	resist: "Resistenza", // NEEDS QC: unofficial
	immune: "Immunità", // NEEDS QC: unofficial

	nicknamespecies: "{NICKNAME} ({SPECIES})",
	label: "{LABEL}: ", // NEEDS QC
	noweather: "(nessuna condizione atmosferica)", // NEEDS QC
	noitem: "(nessuno strumento)", // NEEDS QC
	noability: "(nessuna abilità)", // NEEDS QC
	foescondition: "Lato avversario: {CONDITION}", // NEEDS QC
	speciesforme: "{SPECIES} {FORME}", // NEEDS QC
};

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
	// so it should be lowercase (unlike TermNames.stats)
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
	bug: "Coleottero",
	dark: "Buio",
	dragon: "Drago",
	electric: "Elettro",
	fairy: "Folletto",
	fighting: "Lotta",
	fire: "Fuoco",
	flying: "Volante",
	ghost: "Spettro",
	grass: "Erba",
	ground: "Terra",
	ice: "Ghiaccio",
	normal: "Normale",
	poison: "Veleno",
	psychic: "Psico",
	rock: "Roccia",
	steel: "Acciaio",
	stellar: "Astrale",
	water: "Acqua",
};

export const NatureNames: { [id: string]: TranslationString } = {
	adamant: "Decisa",
	bashful: "Ritrosa",
	bold: "Sicura",
	brave: "Audace",
	calm: "Calma",
	careful: "Cauta",
	docile: "Docile",
	gentle: "Gentile",
	hardy: "Ardita",
	hasty: "Lesta",
	impish: "Scaltra",
	jolly: "Allegra",
	lax: "Fiacca",
	lonely: "Schiva",
	mild: "Mite",
	modest: "Modesta",
	naive: "Ingenua",
	naughty: "Birbona",
	quiet: "Quieta",
	quirky: "Furba",
	rash: "Ardente",
	relaxed: "Placida",
	sassy: "Vivace",
	serious: "Seria",
	timid: "Timida",
};

export const GenderNames: { [id: string]: TranslationString } = {
	male: "Maschio",
	female: "Femmina",
	genderless: "Sconosciuto",
};

export const StatusNames: { [id: string]: TranslationString } = {
	brn: "Scottato", // NEEDS QC
	par: "Paralizzato", // NEEDS QC
	slp: "Addormentato", // NEEDS QC
	frz: "Congelato", // NEEDS QC
	psn: "Avvelenato", // NEEDS QC
	tox: "Iperavvelenato", // NEEDS QC
	fnt: "KO", // NEEDS QC
	confusion: "Confusione", // NEEDS QC
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: "Può colpire un alleato o nemico adiacente", // NEEDS QC
	normalDoubles: "Può colpire l'alleato o qualsiasi nemico", // NEEDS QC
	normalSingles: "Colpisce il nemico", // NEEDS QC
	normalFFA: "Può colpire qualsiasi nemico", // NEEDS QC
	self: "Colpisce l'utilizzatore", // NEEDS QC
	adjacentAlly: "Può colpire un alleato adiacente", // NEEDS QC
	adjacentAllyDoubles: "Colpisce l'alleato", // NEEDS QC
	adjacentAllySingles: "Fallisce sempre nelle Lotte in Singolo", // NEEDS QC
	adjacentAllyOrSelf: "Può colpire l'utilizzatore o un alleato adiacente", // NEEDS QC
	adjacentAllyOrSelfDoubles: "Può colpire l'utilizzatore o l'alleato", // NEEDS QC
	adjacentFoe: "Può colpire un nemico adiacente", // NEEDS QC
	allAdjacentFoes: "Colpisce i nemici adiacenti", // NEEDS QC
	allAdjacentFoesDoubles: "Colpisce entrambi i nemici", // NEEDS QC
	foeSide: "Colpisce il lato avversario", // NEEDS QC
	allySide: "Colpisce il lato dell'utilizzatore", // NEEDS QC
	allyTeam: "Colpisce la squadra dell'utilizzatore", // NEEDS QC
	allAdjacent: "Colpisce gli alleati e i nemici adiacenti", // NEEDS QC
	allAdjacentDoubles: "Colpisce l'alleato ed entrambi i nemici", // NEEDS QC
	allAdjacentFFA: "Colpisce tutti i nemici", // NEEDS QC
	any: "Può colpire Pokémon lontani nelle Lotte in Trio", // NEEDS QC
	all: "Colpisce tutti i Pokémon", // NEEDS QC
	scripted: "Bersaglio scelto automaticamente", // NEEDS QC
	randomNormal: "Colpisce un nemico adiacente a caso", // NEEDS QC
	randomNormalDoubles: "Colpisce un nemico a caso", // NEEDS QC
	allies: "Colpisce l'utilizzatore e gli alleati", // NEEDS QC
};

// from veekun/Pokémon Central who presumably got it from Pokédex 3D Pro
// Stadium 2 names in comments
export const EggGroupNames: { [id: string]: TranslationString } = {
	monster: "Mostro", // NEEDS QC: Stadium 2: "Creatura"
	water1: "Acqua 1", // NEEDS QC
	bug: "Coleottero", // NEEDS QC
	flying: "Volante", // NEEDS QC
	field: "Campo", // NEEDS QC: Stadium 2: "Terra" (when English was "Ground")
	fairy: "Magico", // NEEDS QC: Stadium 2: "Fata"
	grass: "Erba", // NEEDS QC: Stadium 2: "Pianta" (when English was "Plant")
	humanlike: "Umanoide", // NEEDS QC
	water3: "Acqua 3", // NEEDS QC
	mineral: "Minerale", // NEEDS QC
	amorphous: "Amorfo", // NEEDS QC: Stadium 2: "Indeterminato"
	water2: "Acqua 2", // NEEDS QC
	ditto: "Ditto", // NEEDS QC
	dragon: "Drago", // NEEDS QC
	undiscovered: "Sconosciuto", // NEEDS QC: Pokédex 3D Pro also uses "Non ancora scoperto"; Stadium 2: "Nessun Uovo"
};

export const ColorNames: { [id: string]: TranslationString } = {
	black: "Nero",
	blue: "Blu",
	brown: "Marrone",
	gray: "Grigio",
	green: "Verde",
	pink: "Rosa",
	purple: "Viola",
	red: "Rosso",
	white: "Bianco",
	yellow: "Giallo",
};
