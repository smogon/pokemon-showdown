export const TermNames: { [id: string]: TranslationString } = {
	shiny: "いろちがい",
	happiness: "なつき度", // NEEDS QC
	level: "レベル", // NEEDS QC
	nickname: "ニックネーム", // NEEDS QC
	ev: "努力値", // NEEDS QC
	evs: "努力値", // NEEDS QC
	iv: "個体値", // NEEDS QC
	ivs: "個体値", // NEEDS QC
	dv: "個体値", // NEEDS QC
	dvs: "個体値", // NEEDS QC
	av: "努力値", // NEEDS QC
	avs: "努力値", // NEEDS QC
	point: "ポイント", // NEEDS QC
	points: "ポイント", // NEEDS QC
	stats: "ステータス",

	pokemon: "ポケモン",
	move: "技", // NEEDS QC
	moves: "技", // NEEDS QC
	item: "持ち物", // NEEDS QC
	items: "持ち物", // NEEDS QC
	ability: "特性", // NEEDS QC
	abilities: "特性", // NEEDS QC
	hiddenability: "隠れ特性", // NEEDS QC

	type: "タイプ",
	types: "タイプ",
	teratype: "テラスタイプ", // NEEDS QC
	nature: "せいかく",
	category: "ぶんるい",
	categories: "ぶんるい",
	gender: "せいべつ",
	egggroup: "タマゴグループ", // NEEDS QC
	egggroups: "タマゴグループ", // NEEDS QC
	tag: "タグ", // NEEDS QC
	color: "色",
	form: "すがた", // NEEDS QC
	forme: "フォルム", // NEEDS QC
	dexnum: "図鑑No.", // NEEDS QC
	gen: "世代", // NEEDS QC
	evolution: "進化", // NEEDS QC
	preevolution: "進化前", // NEEDS QC
	doesnotevolve: "進化しない", // NEEDS QC
	zcrystal: "Ｚクリスタル", // NEEDS QC
	target: "対象", // NEEDS QC
	height: "高さ",
	numm: "[NUMBER]m", // NEEDS QC
	weight: "重さ",
	numkg: "[NUMBER]kg", // NEEDS QC

	megaevolution: "メガシンカ", // NEEDS QC
	zpower: "Ｚパワー", // NEEDS QC
	dynamax: "ダイマックス", // NEEDS QC
	dynamaxlevel: "ダイマックスレベル", // NEEDS QC

	supereffective: "ばつぐん", // NEEDS QC
	extremelyeffective: "ちょうばつぐん", // NEEDS QC
	effective: "こうかあり", // NEEDS QC
	notveryeffective: "いまひとつ", // NEEDS QC
	mostlyineffective: "かなりいまひとつ", // NEEDS QC
	noeffect: "こうかなし", // NEEDS QC

	weak: "弱点", // NEEDS QC: unofficial
	resist: "半減", // NEEDS QC: unofficial
	immune: "無効", // NEEDS QC: unofficial
};

export const StatNames: { [id: string]: TranslationString } = {
	hp: "ＨＰ", atk: "攻撃", def: "防御", spa: "特攻", spd: "特防", spe: "素早さ",
	accuracy: "命中率", evasion: "回避率", spc: "特殊",
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
	brn: "やけど", // NEEDS QC
	par: "まひ", // NEEDS QC
	slp: "ねむり", // NEEDS QC
	frz: "こおり", // NEEDS QC
	psn: "どく", // NEEDS QC
	tox: "もうどく", // NEEDS QC
	fnt: "ひんし", // NEEDS QC
	confusion: "こんらん", // NEEDS QC
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: "隣接するポケモン１匹", // NEEDS QC
	self: "自分", // NEEDS QC
	adjacentAlly: "味方１匹", // NEEDS QC
	adjacentAllyOrSelf: "自分または味方１匹", // NEEDS QC
	adjacentFoe: "隣接する相手１匹", // NEEDS QC
	allAdjacentFoes: "隣接する相手全体", // NEEDS QC
	foeSide: "相手の場", // NEEDS QC
	allySide: "自分の場", // NEEDS QC
	allyTeam: "自分の手持ち全体", // NEEDS QC
	allAdjacent: "隣接するポケモン全体", // NEEDS QC
	any: "ポケモン１匹", // NEEDS QC
	all: "場のポケモン全体", // NEEDS QC
	scripted: "自動で選択", // NEEDS QC
	randomNormal: "ランダムな相手１匹", // NEEDS QC
	allies: "自分と味方全体", // NEEDS QC
};

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
	undiscovered: "未発見", // NEEDS QC
};

export const TagNames: { [id: string]: TranslationString } = {
	physical: "ぶつり",
	special: "とくしゅ",
	status: "へんか",
	mega: "メガシンカ",
	gigantamax: "キョダイマックス",
	mythical: "幻のポケモン",
	sublegendary: "準伝説", // NEEDS QC
	restrictedlegendary: "禁止級伝説", // NEEDS QC
	ultrabeast: "ウルトラビースト",
	paradox: "パラドックス",
	pokestar: "ポケウッド", // NEEDS QC
	zmove: "Ｚワザ",
	maxmove: "ダイマックスわざ",
	contact: "直接攻撃", // NEEDS QC
	sound: "音", // NEEDS QC
	powder: "粉", // NEEDS QC
	fist: "パンチ", // NEEDS QC
	pulse: "はどう", // NEEDS QC
	bite: "かみつき", // NEEDS QC
	bullet: "弾", // NEEDS QC
	dance: "踊り", // NEEDS QC
	slicing: "切る技", // NEEDS QC
	wind: "風", // NEEDS QC
	bypassprotect: "まもる貫通", // NEEDS QC
	nonreflectable: "反射不可", // NEEDS QC
	nonmirror: "オウムがえし不可", // NEEDS QC
	nonsnatchable: "よこどり不可", // NEEDS QC
	bypasssubstitute: "みがわり貫通", // NEEDS QC
	gmaxmove: "キョダイマックスわざ", // NEEDS QC
	past: "過去作", // NEEDS QC
	truepast: "完全過去作", // NEEDS QC
	pastunobtainable: "過去作入手不可", // NEEDS QC
	future: "未実装", // NEEDS QC
	lgpe: "ピカブイ", // NEEDS QC
	unobtainable: "入手不可", // NEEDS QC
	cap: "CAP",
	custom: "カスタム", // NEEDS QC
	nonexistent: "存在しない", // NEEDS QC

	introducedgen: "初登場世代", // NEEDS QC
	height: "高さ",
	weight: "重さ",
	hp: "HP",
	atk: "Ａ", // NEEDS QC
	def: "Ｂ", // NEEDS QC
	spa: "Ｃ", // NEEDS QC
	spd: "Ｄ", // NEEDS QC
	spe: "Ｓ", // NEEDS QC
	bst: "種族値合計", // NEEDS QC
	basepower: "いりょく",
	priority: "優先度", // NEEDS QC
	accuracy: "めいちゅう",
	maxpp: "最大PP", // NEEDS QC
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
