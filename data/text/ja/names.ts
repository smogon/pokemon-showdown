export const StatNames: { [id: string]: TranslationString } = {
	hp: "ＨＰ", atk: "攻撃", def: "防御", spa: "特攻", spd: "特防", spe: "素早さ",
	accuracy: "命中率", evasion: "回避率", spc: "特殊",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike "Stats" in ui.ts)
	stats: "ステータス",
};

export const StatMediumNames: { [id: string]: TranslationString } = {
	hp: "ＨＰ", atk: "こうげき", def: "ぼうぎょ", spa: "とくこう", spd: "とくぼう",
	spe: "すばやさ", accuracy: "めいちゅう", evasion: "かいひ", spc: "とくしゅ",
};

export const StatShortNames: { [id: string]: TranslationString } = {
	hp: "Ｈ", atk: "Ａ", def: "Ｂ", spa: "Ｃ", spd: "Ｄ", spe: "Ｓ", spc: "ＣＤ",
};

export const TypeNames: { [id: string]: TranslationString } = {
	Bug: "むし",
	Dark: "あく",
	Dragon: "ドラゴン",
	Electric: "でんき",
	Fairy: "フェアリー",
	Fighting: "かくとう",
	Fire: "ほのお",
	Flying: "ひこう",
	Ghost: "ゴースト",
	Grass: "くさ",
	Ground: "じめん",
	Ice: "こおり",
	Normal: "ノーマル",
	Poison: "どく",
	Psychic: "エスパー",
	Rock: "いわ",
	Steel: "はがね",
	Stellar: "ステラ",
	Water: "みず",
	"???": null, // NEEDS TRANSLATION
};

export const NatureNames: { [id: string]: TranslationString } = {
	Adamant: "いじっぱり",
	Bashful: "てれや",
	Bold: "ずぶとい",
	Brave: "ゆうかん",
	Calm: "おだやか",
	Careful: "しんちょう",
	Docile: "すなお",
	Gentle: "おとなしい",
	Hardy: "がんばりや",
	Hasty: "せっかち",
	Impish: "わんぱく",
	Jolly: "ようき",
	Lax: "のうてんき",
	Lonely: "さみしがり",
	Mild: "おっとり",
	Modest: "ひかえめ",
	Naive: "むじゃき",
	Naughty: "やんちゃ",
	Quiet: "れいせい",
	Quirky: "きまぐれ",
	Rash: "うっかりや",
	Relaxed: "のんき",
	Sassy: "なまいき",
	Serious: "まじめ",
	Timid: "おくびょう",
};

export const GenderNames: { [id: string]: TranslationString } = {
	M: "オス",
	F: "メス",
	N: "せいべつなし",
};

export const StatusNames: { [id: string]: TranslationString } = {
	// official status condition names
	brn: "やけど",
	par: "まひ",
	slp: "ねむり",
	frz: "こおり",
	psn: "どく",
	tox: "もうどく",
	fnt: "ひんし",
	confusion: "こんらん",
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

// veekun (presumably from Pokédex 3D Pro) uses kana (かいじゅう, タマゴみはっけん, ...)
// these are Kanji forms, presumably from guidebooks
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
	Black: "黒",
	Blue: "青",
	Brown: "茶",
	Gray: "灰",
	Green: "緑",
	Pink: "桃",
	Purple: "紫",
	Red: "赤",
	White: "白",
	Yellow: "黄",
};
