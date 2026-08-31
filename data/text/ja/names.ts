export const TermNames: { [id: string]: TranslationString } = {
	shiny: "いろちがい",
	happiness: null, // NEEDS TRANSLATION
	level: null, // NEEDS TRANSLATION
	nickname: null, // NEEDS TRANSLATION
	ev: null, // NEEDS TRANSLATION
	evs: null, // NEEDS TRANSLATION
	iv: null, // NEEDS TRANSLATION
	ivs: null, // NEEDS TRANSLATION
	dv: null, // NEEDS TRANSLATION
	dvs: null, // NEEDS TRANSLATION
	av: "覚醒値", // community term
	avs: "覚醒値", // community term
	point: null, // NEEDS TRANSLATION
	points: null, // NEEDS TRANSLATION
	// n.b. used in Teambuilder, so it should be capitalized (unlike StatNames.stats)
	stats: "ステータス",

	pokemon: "ポケモン",
	move: null, // NEEDS TRANSLATION
	moves: null, // NEEDS TRANSLATION
	item: null, // NEEDS TRANSLATION
	items: null, // NEEDS TRANSLATION
	ability: null, // NEEDS TRANSLATION
	abilities: null, // NEEDS TRANSLATION
	hiddenability: null, // NEEDS TRANSLATION
	possibleabilities: null, // NEEDS TRANSLATION
	team: null, // NEEDS TRANSLATION
	teams: null, // NEEDS TRANSLATION
	teamslist: null, // NEEDS TRANSLATION

	type: "タイプ",
	types: "タイプ",
	teratype: "テラスタイプ：{TYPE}", // official term (SV)
	nature: "せいかく",
	category: "ぶんるい",
	categories: "ぶんるい",
	gender: "せいべつ",
	egggroup: null, // NEEDS TRANSLATION
	egggroups: null, // NEEDS TRANSLATION
	tag: null, // NEEDS TRANSLATION
	article: null, // NEEDS TRANSLATION
	articles: null, // NEEDS TRANSLATION
	tier: null, // NEEDS TRANSLATION
	tiers: null, // NEEDS TRANSLATION
	format: null, // NEEDS TRANSLATION
	formats: null, // NEEDS TRANSLATION
	color: "色",
	form: null, // NEEDS TRANSLATION
	forme: null, // NEEDS TRANSLATION
	dexnum: null, // NEEDS TRANSLATION
	generation: null, // NEEDS TRANSLATION
	gennum: null, // NEEDS TRANSLATION
	evolution: null, // NEEDS TRANSLATION
	preevolution: null, // NEEDS TRANSLATION
	doesnotevolve: null, // NEEDS TRANSLATION
	zcrystal: null, // NEEDS TRANSLATION
	target: null, // NEEDS TRANSLATION
	height: "高さ",
	numm: null, // NEEDS TRANSLATION
	weight: "重さ",
	numkg: null, // NEEDS TRANSLATION
	critrate: null, // NEEDS TRANSLATION
	user: null, // NEEDS TRANSLATION
	requiredmove: null, // NEEDS TRANSLATION
	dynamaxpower: null, // NEEDS TRANSLATION
	none: null, // NEEDS TRANSLATION
	pastgensonly: null, // NEEDS TRANSLATION
	flingbasepower: null, // NEEDS TRANSLATION
	flingeffect: null, // NEEDS TRANSLATION
	naturalgifttype: null, // NEEDS TRANSLATION
	naturalgiftbasepower: null, // NEEDS TRANSLATION

	megaevolution: "メガシンカ", // official term (XY)
	zpower: "Ｚパワー", // official term (SM ja_common 8430)
	zeffect: null, // NEEDS TRANSLATION
	dynamax: "ダイマックス", // official term (SwSh)
	dynamaxlevel: null, // NEEDS TRANSLATION
	ultraburst: null, // NEEDS TRANSLATION
	tera: "テラスタル", // official term (SV)

	supereffective: "ばつぐん",
	extremelyeffective: "ちょうばつぐん",
	effective: null, // NEEDS TRANSLATION
	notveryeffective: "いまひとつ",
	mostlyineffective: "かなりいまひとつ",
	noeffect: null, // NEEDS TRANSLATION

	weak: null, // NEEDS TRANSLATION
	resist: null, // NEEDS TRANSLATION
	immune: null, // NEEDS TRANSLATION

	nicknamespecies: null, // NEEDS TRANSLATION
	label: null, // NEEDS TRANSLATION
	speciesforme: null, // NEEDS TRANSLATION
};

export const StatNames: { [id: string]: TranslationString } = {
	hp: "ＨＰ", atk: "攻撃", def: "防御", spa: "特攻", spd: "特防", spe: "素早さ",
	accuracy: "命中率", evasion: "回避率", spc: "特殊",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike TermNames.stats)
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
	monster: null, // NEEDS TRANSLATION
	water1: null, // NEEDS TRANSLATION
	bug: null, // NEEDS TRANSLATION
	flying: null, // NEEDS TRANSLATION
	field: null, // NEEDS TRANSLATION
	fairy: null, // NEEDS TRANSLATION
	grass: null, // NEEDS TRANSLATION
	humanlike: null, // NEEDS TRANSLATION
	water3: null, // NEEDS TRANSLATION
	mineral: null, // NEEDS TRANSLATION
	amorphous: null, // NEEDS TRANSLATION
	water2: null, // NEEDS TRANSLATION
	ditto: null, // NEEDS TRANSLATION
	dragon: null, // NEEDS TRANSLATION
	undiscovered: null, // NEEDS TRANSLATION
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
