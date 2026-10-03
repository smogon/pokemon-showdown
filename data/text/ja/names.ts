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
	"???": "？？？",
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
	normal: "隣接する味方や相手を狙える", // NEEDS QC
	normalDoubles: "味方やどちらの相手も狙える", // NEEDS QC
	normalSingles: "相手に当たる", // NEEDS QC
	normalFFA: "どの相手も狙える", // NEEDS QC
	self: "自分が対象", // NEEDS QC
	adjacentAlly: "隣接する味方を狙える", // NEEDS QC
	adjacentAllyDoubles: "味方に当たる", // NEEDS QC
	adjacentAllySingles: "シングルバトルでは必ず失敗する", // NEEDS QC
	adjacentAllyOrSelf: "自分か隣接する味方を狙える", // NEEDS QC
	adjacentAllyOrSelfDoubles: "自分か味方を狙える", // NEEDS QC
	adjacentFoe: "隣接する相手を狙える", // NEEDS QC
	allAdjacentFoes: "隣接する相手全体に当たる", // NEEDS QC
	allAdjacentFoesDoubles: "相手2体に当たる", // NEEDS QC
	foeSide: "相手の場が対象", // NEEDS QC
	allySide: "自分の場が対象", // NEEDS QC
	allyTeam: "自分の手持ち全体が対象", // NEEDS QC
	allAdjacent: "隣接する味方と相手全体に当たる", // NEEDS QC
	allAdjacentDoubles: "味方と相手2体に当たる", // NEEDS QC
	allAdjacentFFA: "相手全員に当たる", // NEEDS QC
	any: "トリプルバトルでは離れたポケモンも狙える", // NEEDS QC
	all: "場の全員に当たる", // NEEDS QC
	scripted: "対象は自動で決まる", // NEEDS QC
	randomNormal: "隣接する相手にランダムで当たる", // NEEDS QC
	randomNormalDoubles: "相手にランダムで当たる", // NEEDS QC
	allies: "自分と味方全体が対象", // NEEDS QC
};

// veekun (presumably from Pokédex 3D Pro) uses kana (かいじゅう, タマゴみはっけん, ...)
// these are Kanji forms, presumably from guidebooks
export const EggGroupNames: { [id: string]: TranslationString } = {
	Monster: "怪獣", // NEEDS QC
	"Water 1": "水中1", // NEEDS QC
	Bug: "虫", // NEEDS QC
	Flying: "飛行", // NEEDS QC
	Field: "陸上", // NEEDS QC
	Fairy: "妖精", // NEEDS QC
	Grass: "植物", // NEEDS QC
	"Human-Like": "人型", // NEEDS QC
	"Water 3": "水中3", // NEEDS QC
	Mineral: "鉱物", // NEEDS QC
	Amorphous: "不定形", // NEEDS QC
	"Water 2": "水中2", // NEEDS QC
	Ditto: "メタモン", // NEEDS QC
	Dragon: "ドラゴン", // NEEDS QC
	Undiscovered: "タマゴ未発見", // NEEDS QC
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
