export const StatNames: { [id: string]: TranslationString } = {
	hp: "HP",
	atk: "Attack",
	def: "Defense",
	spa: "Sp. Atk",
	spd: "Sp. Def",
	spe: "Speed",
	accuracy: "accuracy",
	evasion: "evasiveness",
	spc: "Special",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike "Stats" in ui.ts)
	stats: "stats",
};

export const StatMediumNames: { [id: string]: TranslationString } = {
	hp: "HP",
	atk: "Attack",
	def: "Defense",
	spa: "Sp. Atk",
	spd: "Sp. Def",
	spe: "Speed",
	accuracy: "Accuracy",
	evasion: "Evasiveness",
	spc: "Special",
};

export const StatShortNames: { [id: string]: TranslationString } = {
	hp: "HP",
	atk: "Atk",
	def: "Def",
	spa: "SpA",
	spd: "SpD",
	spe: "Spe",
	spc: "Spc",
};

export const TypeNames: { [id: string]: TranslationString } = {
	Bug: "Bug",
	Dark: "Dark",
	Dragon: "Dragon",
	Electric: "Electric",
	Fairy: "Fairy",
	Fighting: "Fighting",
	Fire: "Fire",
	Flying: "Flying",
	Ghost: "Ghost",
	Grass: "Grass",
	Ground: "Ground",
	Ice: "Ice",
	Normal: "Normal",
	Poison: "Poison",
	Psychic: "Psychic",
	Rock: "Rock",
	Steel: "Steel",
	Stellar: "Stellar",
	Water: "Water",
	"???": "???",
};

export const NatureNames: { [id: string]: TranslationString } = {
	Adamant: "Adamant",
	Bashful: "Bashful",
	Bold: "Bold",
	Brave: "Brave",
	Calm: "Calm",
	Careful: "Careful",
	Docile: "Docile",
	Gentle: "Gentle",
	Hardy: "Hardy",
	Hasty: "Hasty",
	Impish: "Impish",
	Jolly: "Jolly",
	Lax: "Lax",
	Lonely: "Lonely",
	Mild: "Mild",
	Modest: "Modest",
	Naive: "Naive",
	Naughty: "Naughty",
	Quiet: "Quiet",
	Quirky: "Quirky",
	Rash: "Rash",
	Relaxed: "Relaxed",
	Sassy: "Sassy",
	Serious: "Serious",
	Timid: "Timid",
};

export const GenderNames: { [id: string]: TranslationString } = {
	M: "Male",
	F: "Female",
	N: "Genderless",
};

export const StatusNames: { [id: string]: TranslationString } = {
	brn: "Burned",
	par: "Paralyzed",
	slp: "Asleep",
	frz: "Frozen",
	psn: "Poisoned",
	tox: "Badly Poisoned",
	fnt: "Fainted",
	confusion: "Confused",
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: "Can target any adjacent ally or foe",
	normalDoubles: "Can target ally or any foe",
	normalSingles: "Hits foe",
	normalFFA: "Can target any foe",
	self: "Hits user",
	adjacentAlly: "Can target any adjacent ally",
	adjacentAllyDoubles: "Hits your ally",
	adjacentAllySingles: "Always fails in Singles",
	adjacentAllyOrSelf: "Can target user or adjacent ally",
	adjacentAllyOrSelfDoubles: "Can target user or ally",
	adjacentFoe: "Can target any adjacent foe",
	allAdjacentFoes: "Hits adjacent foes",
	allAdjacentFoesDoubles: "Hits both foes",
	foeSide: "Hits opposing side",
	allySide: "Hits user's side",
	allyTeam: "Hits user's team",
	allAdjacent: "Hits adjacent allies and foes",
	allAdjacentDoubles: "Hits ally and both foes",
	allAdjacentFFA: "Hits all foes",
	any: "Can target distant Pokémon in Triples",
	all: "Hits all Pokémon",
	scripted: "Target chosen automatically",
	randomNormal: "Hits random adjacent foe",
	randomNormalDoubles: "Hits random foe",
	allies: "Hits user and allies",
};

// Pokédex 3D Pro names; Stadium 2 variants noted inline.
export const EggGroupNames: { [id: string]: TranslationString } = {
	Monster: "Monster",
	"Water 1": "Water 1",
	Bug: "Bug",
	Flying: "Flying",
	Field: "Field", // Stadium 2: "Ground"
	Fairy: "Fairy",
	Grass: "Grass", // Stadium 2: "Plant"
	"Human-Like": "Human-Like", // Stadium 2: "Humanshape"
	"Water 3": "Water 3",
	Mineral: "Mineral",
	Amorphous: "Amorphous", // Stadium 2: "Indeterminate"
	"Water 2": "Water 2",
	Ditto: "Ditto",
	Dragon: "Dragon",
	Undiscovered: "Undiscovered", // Stadium 2: "No EGGs"
};

export const ColorNames: { [id: string]: TranslationString } = {
	Black: "Black",
	Blue: "Blue",
	Brown: "Brown",
	Gray: "Gray",
	Green: "Green",
	Pink: "Pink",
	Purple: "Purple",
	Red: "Red",
	White: "White",
	Yellow: "Yellow",
};
