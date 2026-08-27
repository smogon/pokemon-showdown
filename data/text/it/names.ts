export const TermNames: { [id: string]: TranslationString } = {
	shiny: "Cromatico",
	happiness: "Amicizia", // NEEDS QC
	level: "Livello", // NEEDS QC
	nickname: "Soprannome", // NEEDS QC
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
	stats: "Statistiche", "stats:grammar": "fp",

	pokemon: "Pokémon",
	move: "Mossa", // NEEDS QC
	moves: "Mosse", // NEEDS QC
	item: "Strumento", // NEEDS QC
	items: "Strumenti", // NEEDS QC
	ability: "Abilità", // NEEDS QC
	abilities: "Abilità", // NEEDS QC
	hiddenability: "Abilità speciale", // NEEDS QC
	team: "Squadra", // NEEDS QC
	teams: "Squadre", // NEEDS QC
	teamslist: "Elenco squadre", // NEEDS QC

	type: "Tipo",
	types: "Tipi",
	teratype: "Teratipo", // NEEDS QC
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
	color: "Colore",
	form: "Forma", // NEEDS QC
	forme: "Forma", // NEEDS QC
	dexnum: "N. Pokédex", // NEEDS QC
	generation: "Generazione", // NEEDS QC
	gennum: "Gen [NUMBER]",
	evolution: "Evoluzione", // NEEDS QC
	preevolution: "Preevoluzione", // NEEDS QC
	doesnotevolve: "Non si evolve", // NEEDS QC
	zcrystal: "Cristallo Z", // NEEDS QC
	target: "Bersaglio", // NEEDS QC
	height: "Altezza",
	numm: "[NUMBER] m",
	weight: "Peso",
	numkg: "[NUMBER] kg",

	megaevolution: "Megaevoluzione", // NEEDS QC
	zpower: "Potere Z", // NEEDS QC
	dynamax: "Dynamax", // NEEDS QC
	dynamaxlevel: "Livello Dynamax", // NEEDS QC

	supereffective: "Superefficace", // NEEDS QC
	extremelyeffective: "Iperefficace", // NEEDS QC
	effective: "Effetto normale", // NEEDS QC
	notveryeffective: "Poco efficace", // NEEDS QC
	mostlyineffective: "Quasi per niente efficace", // NEEDS QC
	noeffect: "Nessun effetto", // NEEDS QC

	weak: "Debolezza", // NEEDS QC: unofficial
	resist: "Resistenza", // NEEDS QC: unofficial
	immune: "Immunità", // NEEDS QC: unofficial

	nicknamespecies: "[NICKNAME] ([SPECIES])",
	speciesforme: "[SPECIES] [FORME]", // NEEDS QC
};

export const StatNames: { [id: string]: TranslationString } = {
	hp: "PS",
	atk: "Attacco", "atk:grammar": "ms",
	def: "Difesa", "def:grammar": "fs",
	spa: "Attacco Speciale", "spa:grammar": "ms",
	spd: "Difesa Speciale", "spd:grammar": "fs",
	spe: "Velocità", "spe:grammar": "fs",
	accuracy: "precisione", "accuracy:grammar": "fs",
	evasion: "elusione", "evasion:grammar": "fs",
	spc: "Speciale", "spc:grammar": "ms",
};

export const StatMediumNames: { [id: string]: TranslationString } = {
	hp: "PS", atk: "Attacco", def: "Difesa",
	spa: "Att. Sp.", spd: "Dif. Sp.", spe: "Velocità",
	accuracy: "Precisione", evasion: "Elusione", spc: "Speciale",
};

export const StatShortNames: { [id: string]: TranslationString } = {
	hp: "PS", atk: "Att", def: "Dif", spa: "ASp", spd: "DSp", spe: "Vel", spc: "Spe",
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
	normal: "Un Pokémon adiacente", // NEEDS QC
	self: "Utilizzatore", // NEEDS QC
	adjacentAlly: "Un alleato", // NEEDS QC
	adjacentAllyOrSelf: "Utilizzatore o alleato", // NEEDS QC
	adjacentFoe: "Un nemico adiacente", // NEEDS QC
	allAdjacentFoes: "Tutti i nemici adiacenti", // NEEDS QC
	foeSide: "Campo avversario", // NEEDS QC
	allySide: "Campo dell'utilizzatore", // NEEDS QC
	allyTeam: "Squadra dell'utilizzatore", // NEEDS QC
	allAdjacent: "Tutti i Pokémon adiacenti", // NEEDS QC
	any: "Un Pokémon qualsiasi", // NEEDS QC
	all: "Tutti i Pokémon", // NEEDS QC
	scripted: "Scelto automaticamente", // NEEDS QC
	randomNormal: "Nemico adiacente casuale", // NEEDS QC
	allies: "Utilizzatore e alleati", // NEEDS QC
};

export const EggGroupNames: { [id: string]: TranslationString } = {
	monster: "Mostro", // NEEDS QC
	water1: "Acqua 1", // NEEDS QC
	bug: "Insetto", // NEEDS QC
	flying: "Volante", // NEEDS QC
	field: "Campo", // NEEDS QC
	fairy: "Fata", // NEEDS QC
	grass: "Erba", // NEEDS QC
	humanlike: "Umanoide", // NEEDS QC
	water3: "Acqua 3", // NEEDS QC
	mineral: "Minerale", // NEEDS QC
	amorphous: "Amorfo", // NEEDS QC
	water2: "Acqua 2", // NEEDS QC
	ditto: "Ditto", // NEEDS QC
	dragon: "Drago", // NEEDS QC
	undiscovered: "Sconosciuto", // NEEDS QC
};

export const TagNames: { [id: string]: TranslationString } = {
	physical: "Fisico",
	special: "Speciale",
	status: "Di stato",
	mega: "Megaevoluzione",
	gigantamax: "Gigamax",
	mythical: "Pokémon misterioso",
	sublegendary: "Semileggendario", // NEEDS QC
	restrictedlegendary: "Leggendario limitato", // NEEDS QC
	ultrabeast: "Ultracreatura",
	paradox: "Paradosso",
	pokestar: "Pokéwood", // NEEDS QC
	zmove: "Mossa Z",
	maxmove: "Mossa Dynamax",
	contact: "Contatto", // NEEDS QC
	sound: "Suono", // NEEDS QC
	powder: "Polvere", // NEEDS QC
	fist: "Pugno", // NEEDS QC
	pulse: "Impulso", // NEEDS QC
	bite: "Morso", // NEEDS QC
	bullet: "Proiettile", // NEEDS QC
	dance: "Danza", // NEEDS QC
	slicing: "Taglio", // NEEDS QC
	wind: "Vento", // NEEDS QC
	bypassprotect: "Ignora protezione", // NEEDS QC
	nonreflectable: "Non riflettibile", // NEEDS QC
	nonmirror: "Non copiabile", // NEEDS QC
	nonsnatchable: "Non scippabile", // NEEDS QC
	bypasssubstitute: "Ignora sostituto", // NEEDS QC
	gmaxmove: "Mossa Gigamax", // NEEDS QC
	past: "Passato", // NEEDS QC
	truepast: "Solo passato", // NEEDS QC
	pastunobtainable: "Passato non ottenibile", // NEEDS QC
	future: "Futuro", // NEEDS QC
	lgpe: "LGPE",
	unobtainable: "Non ottenibile", // NEEDS QC
	cap: "CAP",
	custom: "Personalizzato", // NEEDS QC
	nonexistent: "Inesistente", // NEEDS QC

	introducedgen: "Generazione", // NEEDS QC
	height: "Altezza",
	weight: "Peso",
	hp: "PS", // NEEDS QC
	atk: "Att", // NEEDS QC
	def: "Dif", // NEEDS QC
	spa: "Att. Sp.", // NEEDS QC
	spd: "Dif. Sp.", // NEEDS QC
	spe: "Vel.", // NEEDS QC
	bst: "BST",
	basepower: "Potenza",
	priority: "Priorità", // NEEDS QC
	accuracy: "Precisione",
	maxpp: "PP max", // NEEDS QC
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
