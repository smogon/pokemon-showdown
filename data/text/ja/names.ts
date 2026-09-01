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
	av: "覚醒値", // community term
	avs: "覚醒値", // community term
	point: "ポイント", // NEEDS QC
	points: "ポイント", // NEEDS QC
	// n.b. used in Teambuilder, so it should be capitalized (unlike StatNames.stats)
	stats: "ステータス",

	pokemon: "ポケモン",
	move: "技", // NEEDS QC
	moves: "技", // NEEDS QC
	item: "持ち物", // NEEDS QC
	items: "持ち物", // NEEDS QC
	ability: "特性", // NEEDS QC
	abilities: "特性", // NEEDS QC
	hiddenability: "隠れ特性", // NEEDS QC
	possibleabilities: "特性の候補", // NEEDS QC
	team: "チーム", // NEEDS QC
	teams: "チーム", // NEEDS QC
	teamslist: "チーム一覧", // NEEDS QC

	type: "タイプ",
	types: "タイプ",
	teratype: "テラスタイプ：{TYPE}", // official term (SV)
	nature: "せいかく",
	category: "ぶんるい",
	categories: "ぶんるい",
	gender: "せいべつ",
	egggroup: "タマゴグループ", // NEEDS QC
	egggroups: "タマゴグループ", // NEEDS QC
	tag: "タグ", // NEEDS QC
	article: "記事", // NEEDS QC
	articles: "記事", // NEEDS QC
	tier: "ティア", // NEEDS QC
	tiers: "ティア", // NEEDS QC
	format: "フォーマット", // NEEDS QC
	formats: "フォーマット", // NEEDS QC
	color: "色",
	form: "すがた", // NEEDS QC
	forme: "フォルム", // NEEDS QC
	dexnum: "図鑑No.", // NEEDS QC
	generation: "世代", // NEEDS QC
	gennum: "第{NUMBER}世代", // NEEDS QC
	evolution: "進化", // NEEDS QC
	preevolution: "進化前", // NEEDS QC
	doesnotevolve: "進化しない", // NEEDS QC
	zcrystal: "Ｚクリスタル", // NEEDS QC
	target: "対象", // NEEDS QC
	height: "高さ",
	numm: "{NUMBER}m", // NEEDS QC
	weight: "重さ",
	numkg: "{NUMBER}kg", // NEEDS QC
	critrate: "急所率", // NEEDS QC
	user: "使用できるポケモン", // NEEDS QC
	requiredmove: "必要な技", // NEEDS QC
	dynamaxpower: "ダイマックス技の威力", // NEEDS QC
	none: "なし", // NEEDS QC
	pastgensonly: "過去世代のみ", // NEEDS QC
	flingbasepower: "なげつけるの威力", // NEEDS QC
	flingeffect: "なげつけるの効果", // NEEDS QC
	naturalgifttype: "しぜんのめぐみのタイプ", // NEEDS QC
	naturalgiftbasepower: "しぜんのめぐみの威力", // NEEDS QC

	megaevolution: "メガシンカ", // official term (XY)
	zpower: "Ｚパワー", // official term (SM ja_common 8430)
	zeffect: "Ｚ効果", // NEEDS QC
	dynamax: "ダイマックス", // official term (SwSh)
	dynamaxlevel: "ダイマックスレベル", // NEEDS QC
	ultraburst: "ウルトラバースト", // NEEDS QC
	tera: "テラスタル", // official term (SV)

	supereffective: "ばつぐん",
	extremelyeffective: "ちょうばつぐん",
	effective: "こうかあり", // NEEDS QC
	notveryeffective: "いまひとつ",
	mostlyineffective: "かなりいまひとつ",
	noeffect: "こうかなし", // NEEDS QC

	weak: "弱点", // NEEDS QC: unofficial
	resist: "耐性", // NEEDS QC: unofficial
	immune: "無効", // NEEDS QC: unofficial

	nicknamespecies: "{NICKNAME}（{SPECIES}）", // NEEDS QC
	label: "{LABEL}：", // NEEDS QC
	noweather: "（天候なし）", // NEEDS QC
	noitem: "（もちものなし）", // NEEDS QC
	noability: "（とくせいなし）", // NEEDS QC
	foescondition: "相手の{CONDITION}", // NEEDS QC
	speciesforme: "{SPECIES}・{FORME}", // NEEDS QC
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
