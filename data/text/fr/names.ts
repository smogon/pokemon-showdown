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
	// so it should be lowercase (unlike "Stats" in ui.ts)
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
	Bug: "Insecte",
	Dark: "Ténèbres",
	Dragon: "Dragon",
	Electric: "Électrik",
	Fairy: "Fée",
	Fighting: "Combat",
	Fire: "Feu",
	Flying: "Vol",
	Ghost: "Spectre",
	Grass: "Plante",
	Ground: "Sol",
	Ice: "Glace",
	Normal: "Normal",
	Poison: "Poison",
	Psychic: "Psy",
	Rock: "Roche",
	Steel: "Acier",
	Stellar: "Stellaire",
	Water: "Eau",
	"???": null, // NEEDS TRANSLATION
};

export const NatureNames: { [id: string]: TranslationString } = {
	Adamant: "Rigide",
	Bashful: "Pudique",
	Bold: "Assuré",
	Brave: "Brave",
	Calm: "Calme",
	Careful: "Prudent",
	Docile: "Docile",
	Gentle: "Gentil",
	Hardy: "Hardi",
	Hasty: "Pressé",
	Impish: "Malin",
	Jolly: "Jovial",
	Lax: "Lâche",
	Lonely: "Solo",
	Mild: "Doux",
	Modest: "Modeste",
	Naive: "Naïf",
	Naughty: "Mauvais",
	Quiet: "Discret",
	Quirky: "Bizarre",
	Rash: "Foufou",
	Relaxed: "Relax",
	Sassy: "Malpoli",
	Serious: "Sérieux",
	Timid: "Timide",
};

export const GenderNames: { [id: string]: TranslationString } = {
	M: "Mâle",
	F: "Femelle",
	N: "Inconnu", // NEEDS QC
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
	Monster: "Monstrueux", // NEEDS QC: Bulbapedia transcribes Pokédex 3D Pro as "Monstreux"; Stadium 2: "Monstre"
	"Water 1": "Aquatique 1", // NEEDS QC: Stadium 2: "Eau 1"
	Bug: "Insectoïde", // NEEDS QC: Stadium 2: "Insecte"
	Flying: "Aérien", // NEEDS QC: Stadium 2: "Vol"
	Field: "Terrestre", // NEEDS QC: Stadium 2: "Sol"
	Fairy: "Féerique", // NEEDS QC: Stadium 2: "Fée"
	Grass: "Végétal", // NEEDS QC: Stadium 2: "Plante"
	"Human-Like": "Humanoïde", // NEEDS QC
	"Water 3": "Aquatique 3", // NEEDS QC: Stadium 2: "Eau 3"
	Mineral: "Minéral", // NEEDS QC
	Amorphous: "Amorphe", // NEEDS QC: Stadium 2: "Indéterminé"
	"Water 2": "Aquatique 2", // NEEDS QC: Stadium 2: "Eau 2"
	Ditto: "Métamorph", // NEEDS QC
	Dragon: "Draconique", // NEEDS QC: Stadium 2: "Dragon"
	Undiscovered: "Inconnu", // NEEDS QC: Stadium 2: "Pas d'Oeufs"
};

export const ColorNames: { [id: string]: TranslationString } = {
	Black: "Noir",
	Blue: "Bleu",
	Brown: "Brun",
	Gray: "Gris",
	Green: "Vert",
	Pink: "Rose",
	Purple: "Violet",
	Red: "Rouge",
	White: "Blanc",
	Yellow: "Jaune",
};
