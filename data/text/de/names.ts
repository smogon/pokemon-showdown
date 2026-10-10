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
	"???": "???",
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
	Monster: "Monster", // NEEDS QC
	"Water 1": "Wasser 1", // NEEDS QC
	Bug: "Käfer", // NEEDS QC
	Flying: "Flug", // NEEDS QC
	Field: "Feld", // NEEDS QC: Stadium 2: "Boden" (when English was "Ground")
	Fairy: "Fee", // NEEDS QC
	Grass: "Pflanze", // NEEDS QC
	"Human-Like": "Humanotyp", // NEEDS QC
	"Water 3": "Wasser 3", // NEEDS QC
	Mineral: "Mineral", // NEEDS QC
	Amorphous: "Amorph", // NEEDS QC: Stadium 2: "Unbestimmt" (when English was "Indeterminate")
	"Water 2": "Wasser 2", // NEEDS QC
	Ditto: "Ditto", // NEEDS QC
	Dragon: "Drache", // NEEDS QC
	Undiscovered: "Unbekannt", // NEEDS QC: Stadium 2: "Keine Eier" (when English was "No Eggs")
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
