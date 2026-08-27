export const TermNames: { [id: string]: TranslationString } = {
	shiny: "Chromatique",
	happiness: "Bonheur", // NEEDS QC
	level: "Niveau", // NEEDS QC
	nickname: "Surnom", // NEEDS QC
	ev: "EV",
	evs: "EVs",
	iv: "IV",
	ivs: "IVs",
	dv: "DVs",
	dvs: "DVs",
	av: "AV",
	avs: "AVs",
	point: "Point",
	points: "Points",
	// n.b. used in Teambuilder, so it should be capitalized (unlike StatNames.stats)
	stats: "Stats",

	pokemon: "Pokémon",
	move: "Capacité", // NEEDS QC
	moves: "Capacités", // NEEDS QC
	item: "Objet", // NEEDS QC
	items: "Objets", // NEEDS QC
	ability: "Talent", // NEEDS QC
	abilities: "Talents", // NEEDS QC
	hiddenability: "Talent caché", // NEEDS QC
	team: "Équipe", // NEEDS QC
	teams: "Équipes", // NEEDS QC
	teamslist: "Liste des équipes", // NEEDS QC

	type: "Type",
	types: "Types",
	teratype: "Type Téracristal", // NEEDS QC
	nature: "Nature",
	category: "Catégorie",
	categories: "Catégories",
	gender: "Sexe",
	egggroup: "Groupe d’Œuf", // NEEDS QC
	egggroups: "Groupes d’Œufs", // NEEDS QC
	tag: "Étiquette", // NEEDS QC
	article: "Article",
	articles: "Articles",
	tier: "Tier",
	tiers: "Tiers",
	color: "Couleur",
	form: "Forme", // NEEDS QC
	forme: "Forme", // NEEDS QC
	dexnum: "N° Pokédex", // NEEDS QC
	generation: "Génération", // NEEDS QC
	gennum: "Gen [NUMBER]",
	evolution: "Évolution", // NEEDS QC
	preevolution: "Pré-évolution", // NEEDS QC
	doesnotevolve: "N'évolue pas", // NEEDS QC
	zcrystal: "Cristal Z", // NEEDS QC
	target: "Cible", // NEEDS QC
	height: "Taille",
	numm: "[NUMBER] m",
	weight: "Poids",
	numkg: "[NUMBER] kg",

	megaevolution: "Méga-Évolution", // NEEDS QC
	zpower: "Force Z", // NEEDS QC
	dynamax: "Dynamax", // NEEDS QC
	dynamaxlevel: "Niveau Dynamax", // NEEDS QC

	supereffective: "Super efficace", // NEEDS QC
	extremelyeffective: "Hyper efficace", // NEEDS QC
	effective: "Efficace", // NEEDS QC
	notveryeffective: "Pas très efficace", // NEEDS QC
	mostlyineffective: "Vraiment pas très efficace", // NEEDS QC
	noeffect: "Aucun effet", // NEEDS QC

	weak: "Faiblesse", // NEEDS QC: unofficial
	resist: "Résistance", // NEEDS QC: unofficial
	immune: "Immunité", // NEEDS QC: unofficial

	nicknamespecies: "[NICKNAME] ([SPECIES])",
	speciesforme: "[SPECIES] [FORME]", // NEEDS QC
};

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
	// so it should be lowercase (unlike TermNames.stats)
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
	bug: "Insecte",
	dark: "Ténèbres",
	dragon: "Dragon",
	electric: "Électrik",
	fairy: "Fée",
	fighting: "Combat",
	fire: "Feu",
	flying: "Vol",
	ghost: "Spectre",
	grass: "Plante",
	ground: "Sol",
	ice: "Glace",
	normal: "Normal",
	poison: "Poison",
	psychic: "Psy",
	rock: "Roche",
	steel: "Acier",
	stellar: "Stellaire",
	water: "Eau",
};

export const NatureNames: { [id: string]: TranslationString } = {
	adamant: "Rigide",
	bashful: "Pudique",
	bold: "Assuré",
	brave: "Brave",
	calm: "Calme",
	careful: "Prudent",
	docile: "Docile",
	gentle: "Gentil",
	hardy: "Hardi",
	hasty: "Pressé",
	impish: "Malin",
	jolly: "Jovial",
	lax: "Lâche",
	lonely: "Solo",
	mild: "Doux",
	modest: "Modeste",
	naive: "Naïf",
	naughty: "Mauvais",
	quiet: "Discret",
	quirky: "Bizarre",
	rash: "Foufou",
	relaxed: "Relax",
	sassy: "Malpoli",
	serious: "Sérieux",
	timid: "Timide",
};

export const GenderNames: { [id: string]: TranslationString } = {
	male: "Mâle",
	female: "Femelle",
	genderless: "Inconnu", // NEEDS QC
};

export const StatusNames: { [id: string]: TranslationString } = {
	brn: "Brûlure", // NEEDS QC
	par: "Paralysie", // NEEDS QC
	slp: "Sommeil", // NEEDS QC
	frz: "Gel", // NEEDS QC
	psn: "Poison", // NEEDS QC
	tox: "Poison grave", // NEEDS QC
	fnt: "K.O.", // NEEDS QC
	confusion: "Confusion", // NEEDS QC
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: "Un Pokémon adjacent", // NEEDS QC
	self: "Utilisateur", // NEEDS QC
	adjacentAlly: "Un allié", // NEEDS QC
	adjacentAllyOrSelf: "Utilisateur ou allié", // NEEDS QC
	adjacentFoe: "Un ennemi adjacent", // NEEDS QC
	allAdjacentFoes: "Tous les ennemis adjacents", // NEEDS QC
	foeSide: "Camp adverse", // NEEDS QC
	allySide: "Camp de l'utilisateur", // NEEDS QC
	allyTeam: "Équipe de l'utilisateur", // NEEDS QC
	allAdjacent: "Tous les Pokémon adjacents", // NEEDS QC
	any: "N'importe quel Pokémon", // NEEDS QC
	all: "Tous les Pokémon", // NEEDS QC
	scripted: "Choisi automatiquement", // NEEDS QC
	randomNormal: "Ennemi adjacent aléatoire", // NEEDS QC
	allies: "Utilisateur et alliés", // NEEDS QC
};

export const EggGroupNames: { [id: string]: TranslationString } = {
	monster: "Monstrueux", // NEEDS QC
	water1: "Aquatique 1", // NEEDS QC
	bug: "Insectoïde", // NEEDS QC
	flying: "Aérien", // NEEDS QC
	field: "Terrestre", // NEEDS QC
	fairy: "Féérique", // NEEDS QC
	grass: "Végétal", // NEEDS QC
	humanlike: "Humanoïde", // NEEDS QC
	water3: "Aquatique 3", // NEEDS QC
	mineral: "Minéral", // NEEDS QC
	amorphous: "Amorphe", // NEEDS QC
	water2: "Aquatique 2", // NEEDS QC
	ditto: "Métamorph", // NEEDS QC
	dragon: "Draconique", // NEEDS QC
	undiscovered: "Inconnu", // NEEDS QC
};

export const TagNames: { [id: string]: TranslationString } = {
	physical: "Physique",
	special: "Spéciale",
	status: "Statut",
	mega: "Méga-Évolution",
	gigantamax: "Gigamax",
	mythical: "Pokémon fabuleux",
	sublegendary: "Semi-Légendaire", // NEEDS QC
	restrictedlegendary: "Légendaire restreint", // NEEDS QC
	ultrabeast: "Ultra-Chimère",
	paradox: "Paradoxe",
	pokestar: "Pokéwood", // NEEDS QC
	zmove: "Capacité Z",
	maxmove: "Capacité Dynamax",
	contact: "Contact",
	sound: "Son", // NEEDS QC
	powder: "Poudre", // NEEDS QC
	fist: "Poing", // NEEDS QC
	pulse: "Onde", // NEEDS QC
	bite: "Morsure", // NEEDS QC
	bullet: "Projectile", // NEEDS QC
	dance: "Danse", // NEEDS QC
	slicing: "Tranchant", // NEEDS QC
	wind: "Vent", // NEEDS QC
	bypassprotect: "Ignore la protection", // NEEDS QC
	nonreflectable: "Non réfléchissable", // NEEDS QC
	nonmirror: "Non imitable", // NEEDS QC
	nonsnatchable: "Non saisissable", // NEEDS QC
	bypasssubstitute: "Ignore le clone", // NEEDS QC
	gmaxmove: "Capacité Gigamax", // NEEDS QC
	past: "Passé", // NEEDS QC
	truepast: "Passé uniquement", // NEEDS QC
	pastunobtainable: "Passé introuvable", // NEEDS QC
	future: "Futur", // NEEDS QC
	lgpe: "LGPE",
	unobtainable: "Introuvable", // NEEDS QC
	cap: "CAP",
	custom: "Personnalisé", // NEEDS QC
	nonexistent: "Inexistant", // NEEDS QC

	introducedgen: "Génération", // NEEDS QC
	height: "Taille",
	weight: "Poids",
	hp: "PV", // NEEDS QC
	atk: "Atq", // NEEDS QC
	def: "Déf", // NEEDS QC
	spa: "Atq. Spé", // NEEDS QC
	spd: "Déf. Spé", // NEEDS QC
	spe: "Vit.", // NEEDS QC
	bst: "BST",
	basepower: "Puissance",
	priority: "Priorité", // NEEDS QC
	accuracy: "Précision",
	maxpp: "PP Max", // NEEDS QC
};

export const ColorNames: { [id: string]: TranslationString } = {
	black: "Noir",
	blue: "Bleu",
	brown: "Brun",
	gray: "Gris",
	green: "Vert",
	pink: "Rose",
	purple: "Violet",
	red: "Rouge",
	white: "Blanc",
	yellow: "Jaune",
};
