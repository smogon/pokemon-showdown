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
	// so it should be lowercase (unlike "Stats" in ui.ts)
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
	Bug: "Coleottero",
	Dark: "Buio",
	Dragon: "Drago",
	Electric: "Elettro",
	Fairy: "Folletto",
	Fighting: "Lotta",
	Fire: "Fuoco",
	Flying: "Volante",
	Ghost: "Spettro",
	Grass: "Erba",
	Ground: "Terra",
	Ice: "Ghiaccio",
	Normal: "Normale",
	Poison: "Veleno",
	Psychic: "Psico",
	Rock: "Roccia",
	Steel: "Acciaio",
	Stellar: "Astrale",
	Water: "Acqua",
	"???": "???",
};

export const NatureNames: { [id: string]: TranslationString } = {
	Adamant: "Decisa",
	Bashful: "Ritrosa",
	Bold: "Sicura",
	Brave: "Audace",
	Calm: "Calma",
	Careful: "Cauta",
	Docile: "Docile",
	Gentle: "Gentile",
	Hardy: "Ardita",
	Hasty: "Lesta",
	Impish: "Scaltra",
	Jolly: "Allegra",
	Lax: "Fiacca",
	Lonely: "Schiva",
	Mild: "Mite",
	Modest: "Modesta",
	Naive: "Ingenua",
	Naughty: "Birbona",
	Quiet: "Quieta",
	Quirky: "Furba",
	Rash: "Ardente",
	Relaxed: "Placida",
	Sassy: "Vivace",
	Serious: "Seria",
	Timid: "Timida",
};

export const GenderNames: { [id: string]: TranslationString } = {
	M: "Maschio",
	F: "Femmina",
	N: "Sconosciuto",
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
	any: "Può colpire Pokémon lontani nelle Lotte in Triplo", // NEEDS QC
	all: "Colpisce tutti i Pokémon", // NEEDS QC
	scripted: "Bersaglio scelto automaticamente", // NEEDS QC
	randomNormal: "Colpisce un nemico adiacente a caso", // NEEDS QC
	randomNormalDoubles: "Colpisce un nemico a caso", // NEEDS QC
	allies: "Colpisce l'utilizzatore e gli alleati", // NEEDS QC
};

// from veekun/Pokémon Central who presumably got it from Pokédex 3D Pro
// Stadium 2 names in comments
export const EggGroupNames: { [id: string]: TranslationString } = {
	Monster: "Mostro", // NEEDS QC: Stadium 2: "Creatura"
	"Water 1": "Acqua 1", // NEEDS QC
	Bug: "Coleottero", // NEEDS QC
	Flying: "Volante", // NEEDS QC
	Field: "Campo", // NEEDS QC: Stadium 2: "Terra" (when English was "Ground")
	Fairy: "Magico", // NEEDS QC: Stadium 2: "Fata"
	Grass: "Erba", // NEEDS QC: Stadium 2: "Pianta" (when English was "Plant")
	"Human-Like": "Umanoide", // NEEDS QC
	"Water 3": "Acqua 3", // NEEDS QC
	Mineral: "Minerale", // NEEDS QC
	Amorphous: "Amorfo", // NEEDS QC: Stadium 2: "Indeterminato"
	"Water 2": "Acqua 2", // NEEDS QC
	Ditto: "Ditto", // NEEDS QC
	Dragon: "Drago", // NEEDS QC
	Undiscovered: "Sconosciuto", // NEEDS QC: Pokédex 3D Pro also uses "Non ancora scoperto"; Stadium 2: "Nessun Uovo"
};

export const ColorNames: { [id: string]: TranslationString } = {
	Black: "Nero",
	Blue: "Blu",
	Brown: "Marrone",
	Gray: "Grigio",
	Green: "Verde",
	Pink: "Rosa",
	Purple: "Viola",
	Red: "Rosso",
	White: "Bianco",
	Yellow: "Giallo",
};
