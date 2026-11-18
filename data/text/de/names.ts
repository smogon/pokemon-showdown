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
	// so it should be lowercase (unlike "Stats" in ui.ts)
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
	Bug: "Käfer",
	Dark: "Unlicht",
	Dragon: "Drache",
	Electric: "Elektro",
	Fairy: "Fee",
	Fighting: "Kampf",
	Fire: "Feuer",
	Flying: "Flug",
	Ghost: "Geist",
	Grass: "Pflanze",
	Ground: "Boden",
	Ice: "Eis",
	Normal: "Normal",
	Poison: "Gift",
	Psychic: "Psycho",
	Rock: "Gestein",
	Steel: "Stahl",
	Stellar: "Stellar",
	Water: "Wasser",
	"???": null, // NEEDS TRANSLATION
};

export const NatureNames: { [id: string]: TranslationString } = {
	Adamant: "Hart",
	Bashful: "Zaghaft",
	Bold: "Kühn",
	Brave: "Mutig",
	Calm: "Still",
	Careful: "Sacht",
	Docile: "Sanft",
	Gentle: "Zart",
	Hardy: "Robust",
	Hasty: "Hastig",
	Impish: "Pfiffig",
	Jolly: "Froh",
	Lax: "Lasch",
	Lonely: "Solo",
	Mild: "Mild",
	Modest: "Mäßig",
	Naive: "Naiv",
	Naughty: "Frech",
	Quiet: "Ruhig",
	Quirky: "Kauzig",
	Rash: "Hitzig",
	Relaxed: "Locker",
	Sassy: "Forsch",
	Serious: "Ernst",
	Timid: "Scheu",
};

export const GenderNames: { [id: string]: TranslationString } = {
	M: "Männlich",
	F: "Weiblich",
	N: "Unbekannt",
};

export const StatusNames: { [id: string]: TranslationString } = {
	brn: "Verbrennungen",
	par: "Paralyse",
	slp: "Schlaf",
	frz: "Gefroren",
	psn: "Vergiftung",
	tox: "Schwere Vergiftung",
	fnt: null, // NEEDS TRANSLATION
	confusion: "Verwirrung",
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: null, // NEEDS TRANSLATION
	normalDoubles: null, // NEEDS TRANSLATION
	normalSingles: null, // NEEDS TRANSLATION
	normalFFA: null, // NEEDS TRANSLATION
	self: null, // NEEDS TRANSLATION
	adjacentAlly: null, // NEEDS TRANSLATION
	adjacentAllyDoubles: null, // NEEDS TRANSLATION
	adjacentAllySingles: null, // NEEDS TRANSLATION
	adjacentAllyOrSelf: null, // NEEDS TRANSLATION
	adjacentAllyOrSelfDoubles: null, // NEEDS TRANSLATION
	adjacentFoe: null, // NEEDS TRANSLATION
	allAdjacentFoes: null, // NEEDS TRANSLATION
	allAdjacentFoesDoubles: null, // NEEDS TRANSLATION
	foeSide: null, // NEEDS TRANSLATION
	allySide: null, // NEEDS TRANSLATION
	allyTeam: null, // NEEDS TRANSLATION
	allAdjacent: null, // NEEDS TRANSLATION
	allAdjacentDoubles: null, // NEEDS TRANSLATION
	allAdjacentFFA: null, // NEEDS TRANSLATION
	any: null, // NEEDS TRANSLATION
	all: null, // NEEDS TRANSLATION
	scripted: null, // NEEDS TRANSLATION
	randomNormal: null, // NEEDS TRANSLATION
	randomNormalDoubles: null, // NEEDS TRANSLATION
	allies: null, // NEEDS TRANSLATION
};

// from veekun/Bulbapedia who presumably got it from Pokédex 3D Pro
// Stadium 2 names in comments
export const EggGroupNames: { [id: string]: TranslationString } = {
	Monster: null, // NEEDS TRANSLATION
	"Water 1": null, // NEEDS TRANSLATION
	Bug: null, // NEEDS TRANSLATION
	Flying: null, // NEEDS TRANSLATION
	Field: null, // NEEDS TRANSLATION
	Fairy: null, // NEEDS TRANSLATION
	Grass: null, // NEEDS TRANSLATION
	"Human-Like": null, // NEEDS TRANSLATION
	"Water 3": null, // NEEDS TRANSLATION
	Mineral: null, // NEEDS TRANSLATION
	Amorphous: null, // NEEDS TRANSLATION
	"Water 2": null, // NEEDS TRANSLATION
	Ditto: null, // NEEDS TRANSLATION
	Dragon: null, // NEEDS TRANSLATION
	Undiscovered: null, // NEEDS TRANSLATION
};

export const ColorNames: { [id: string]: TranslationString } = {
	Black: "Schwarz",
	Blue: "Blau",
	Brown: "Braun",
	Gray: "Grau",
	Green: "Grün",
	Pink: "Rosa",
	Purple: "Violett",
	Red: "Rot",
	White: "Weiß",
	Yellow: "Gelb",
};
