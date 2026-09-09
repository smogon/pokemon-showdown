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
	// so it should be lowercase (unlike the "Stats" UI catalog entry)
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
