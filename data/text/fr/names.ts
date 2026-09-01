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
	move: "Capacité", // official term (SV fr_common, e.g. 7435 "la capacité …")
	moves: "Capacités",
	item: "Objet", // SV fr_common 431 (Held Item → Objet); Champions fra btl_data_pokedetail 11
	items: "Objets", // NEEDS QC
	ability: "Talent", // SV en/fr_common 429; Champions fra btl_data_pokedetail 3
	abilities: "Talents", // NEEDS QC
	hiddenability: "Talent caché", // NEEDS QC
	possibleabilities: "Talents possibles", // NEEDS QC
	team: "Équipe", // NEEDS QC
	teams: "Équipes", // NEEDS QC
	teamslist: "Liste des équipes", // NEEDS QC

	type: "Type",
	types: "Types",
	teratype: "Type Téracristal : {TYPE}", // NEEDS QC (term "Type Téracristal" = SV en/fr_common 565; label composition is PS-authored)
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
	format: "Format", // NEEDS QC
	formats: "Formats", // NEEDS QC
	color: "Couleur",
	form: "Forme", // NEEDS QC
	forme: "Forme", // NEEDS QC
	dexnum: "N° Pokédex", // NEEDS QC
	generation: "Génération", // NEEDS QC
	gennum: "Gén {NUMBER}", // NEEDS QC
	evolution: "Évolution", // NEEDS QC
	preevolution: "Pré-évolution", // NEEDS QC
	doesnotevolve: "N'évolue pas", // NEEDS QC
	zcrystal: "Cristal Z", // NEEDS QC
	target: "Cible", // NEEDS QC
	height: "Taille",
	numm: "{NUMBER} m",
	weight: "Poids",
	numkg: "{NUMBER} kg",
	critrate: "Taux de critique", // NEEDS QC
	user: "Utilisable par", // NEEDS QC
	requiredmove: "Capacité requise", // NEEDS QC
	dynamaxpower: "Puissance Dynamax", // NEEDS QC
	none: "Aucun", // NEEDS QC
	pastgensonly: "Générations précédentes uniquement", // NEEDS QC
	flingbasepower: "Puissance de Dégommage", // NEEDS QC
	flingeffect: "Effet de Dégommage", // NEEDS QC
	naturalgifttype: "Type de Don Naturel", // NEEDS QC
	naturalgiftbasepower: "Puissance de Don Naturel", // NEEDS QC

	megaevolution: "Méga-Évolution", // NEEDS QC
	zpower: "Force Z", // NEEDS QC
	zeffect: "Effet Z", // NEEDS QC
	dynamax: "Dynamax", // NEEDS QC
	dynamaxlevel: "Niveau Dynamax", // NEEDS QC
	ultraburst: "Ultra-Explosion", // NEEDS QC
	tera: "Téra", // NEEDS QC

	supereffective: "Super efficace", // NEEDS QC
	extremelyeffective: "Hyper efficace", // NEEDS QC
	effective: "Efficace", // NEEDS QC
	notveryeffective: "Pas très efficace", // NEEDS QC
	mostlyineffective: "Vraiment pas très efficace", // NEEDS QC
	noeffect: "Aucun effet", // NEEDS QC

	weak: "Faiblesse", // NEEDS QC: unofficial
	resist: "Résistance", // NEEDS QC: unofficial
	immune: "Immunité", // NEEDS QC: unofficial

	nicknamespecies: "{NICKNAME} ({SPECIES})",
	label: "{LABEL} : ", // NEEDS QC (non-breaking space before the colon)
	noweather: "(aucune météo)", // NEEDS QC
	noitem: "(aucun objet)", // NEEDS QC
	noability: "(aucun talent)", // NEEDS QC
	foescondition: "Côté adverse : {CONDITION}", // NEEDS QC
	speciesforme: "{SPECIES} {FORME}", // NEEDS QC
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
	normal: "Peut viser un allié ou ennemi adjacent", // NEEDS QC
	normalDoubles: "Peut viser l'allié ou n'importe quel ennemi", // NEEDS QC
	normalSingles: "Touche l'ennemi", // NEEDS QC
	normalFFA: "Peut viser n'importe quel ennemi", // NEEDS QC
	self: "Touche l'utilisateur", // NEEDS QC
	adjacentAlly: "Peut viser un allié adjacent", // NEEDS QC
	adjacentAllyDoubles: "Touche l'allié", // NEEDS QC
	adjacentAllySingles: "Échoue toujours en Combat Solo", // NEEDS QC
	adjacentAllyOrSelf: "Peut viser l'utilisateur ou un allié adjacent", // NEEDS QC
	adjacentAllyOrSelfDoubles: "Peut viser l'utilisateur ou l'allié", // NEEDS QC
	adjacentFoe: "Peut viser un ennemi adjacent", // NEEDS QC
	allAdjacentFoes: "Touche les ennemis adjacents", // NEEDS QC
	allAdjacentFoesDoubles: "Touche les deux ennemis", // NEEDS QC
	foeSide: "Touche le camp adverse", // NEEDS QC
	allySide: "Touche le camp de l'utilisateur", // NEEDS QC
	allyTeam: "Touche l'équipe de l'utilisateur", // NEEDS QC
	allAdjacent: "Touche les alliés et ennemis adjacents", // NEEDS QC
	allAdjacentDoubles: "Touche l'allié et les deux ennemis", // NEEDS QC
	allAdjacentFFA: "Touche tous les ennemis", // NEEDS QC
	any: "Peut viser un Pokémon éloigné en Combat Trio", // NEEDS QC
	all: "Touche tous les Pokémon", // NEEDS QC
	scripted: "Cible choisie automatiquement", // NEEDS QC
	randomNormal: "Touche un ennemi adjacent au hasard", // NEEDS QC
	randomNormalDoubles: "Touche un ennemi au hasard", // NEEDS QC
	allies: "Touche l'utilisateur et les alliés", // NEEDS QC
};

// from veekun/Poképédia who presumably got it from Pokédex 3D Pro
// Stadium 2 names in comments
export const EggGroupNames: { [id: string]: TranslationString } = {
	monster: "Monstrueux", // NEEDS QC: Bulbapedia transcribes Pokédex 3D Pro as "Monstreux"; Stadium 2: "Monstre"
	water1: "Aquatique 1", // NEEDS QC: Stadium 2: "Eau 1"
	bug: "Insectoïde", // NEEDS QC: Stadium 2: "Insecte"
	flying: "Aérien", // NEEDS QC: Stadium 2: "Vol"
	field: "Terrestre", // NEEDS QC: Stadium 2: "Sol"
	fairy: "Féerique", // NEEDS QC: Stadium 2: "Fée"
	grass: "Végétal", // NEEDS QC: Stadium 2: "Plante"
	humanlike: "Humanoïde", // NEEDS QC
	water3: "Aquatique 3", // NEEDS QC: Stadium 2: "Eau 3"
	mineral: "Minéral", // NEEDS QC
	amorphous: "Amorphe", // NEEDS QC: Stadium 2: "Indéterminé"
	water2: "Aquatique 2", // NEEDS QC: Stadium 2: "Eau 2"
	ditto: "Métamorph", // NEEDS QC
	dragon: "Draconique", // NEEDS QC: Stadium 2: "Dragon"
	undiscovered: "Inconnu", // NEEDS QC: Stadium 2: "Pas d'Oeufs"
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
