export const StatNames: { [id: string]: TranslationString } = {
	hp: "ＨＰ", atk: "攻撃", def: "防御", spa: "特攻", spd: "特防", spe: "素早さ",
	accuracy: "命中率", evasion: "回避率", spc: "特殊",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike the "Stats" UI catalog entry)
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
	bug: "むし",
	dark: "あく",
	dragon: "ドラゴン",
	electric: "でんき",
	fairy: "フェアリー",
	fighting: "かくとう",
	fire: "ほのお",
	flying: "ひこう",
	ghost: "ゴースト",
	grass: "くさ",
	ground: "じめん",
	ice: "こおり",
	normal: "ノーマル",
	poison: "どく",
	psychic: "エスパー",
	rock: "いわ",
	steel: "はがね",
	stellar: "ステラ",
	water: "みず",
};

export const NatureNames: { [id: string]: TranslationString } = {
	adamant: "いじっぱり",
	bashful: "てれや",
	bold: "ずぶとい",
	brave: "ゆうかん",
	calm: "おだやか",
	careful: "しんちょう",
	docile: "すなお",
	gentle: "おとなしい",
	hardy: "がんばりや",
	hasty: "せっかち",
	impish: "わんぱく",
	jolly: "ようき",
	lax: "のうてんき",
	lonely: "さみしがり",
	mild: "おっとり",
	modest: "ひかえめ",
	naive: "むじゃき",
	naughty: "やんちゃ",
	quiet: "れいせい",
	quirky: "きまぐれ",
	rash: "うっかりや",
	relaxed: "のんき",
	sassy: "なまいき",
	serious: "まじめ",
	timid: "おくびょう",
};

export const GenderNames: { [id: string]: TranslationString } = {
	male: "オス",
	female: "メス",
	genderless: "せいべつなし",
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
	monster: "怪獣", // NEEDS QC
	water1: "水中1", // NEEDS QC
	bug: "虫", // NEEDS QC
	flying: "飛行", // NEEDS QC
	field: "陸上", // NEEDS QC
	fairy: "妖精", // NEEDS QC
	grass: "植物", // NEEDS QC
	humanlike: "人型", // NEEDS QC
	water3: "水中3", // NEEDS QC
	mineral: "鉱物", // NEEDS QC
	amorphous: "不定形", // NEEDS QC
	water2: "水中2", // NEEDS QC
	ditto: "メタモン", // NEEDS QC
	dragon: "ドラゴン", // NEEDS QC
	undiscovered: "タマゴ未発見", // NEEDS QC
};

export const ColorNames: { [id: string]: TranslationString } = {
	black: "黒",
	blue: "青",
	brown: "茶",
	gray: "灰",
	green: "緑",
	pink: "桃",
	purple: "紫",
	red: "赤",
	white: "白",
	yellow: "黄",
};
