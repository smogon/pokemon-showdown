export const TermNames: { [id: string]: TranslationString } = {
	shiny: "異色",
	happiness: "親密度", // NEEDS QC
	level: "等級", // NEEDS QC
	nickname: "暱稱", // NEEDS QC
	ev: "努力值", // NEEDS QC
	evs: "努力值", // NEEDS QC
	iv: "個體值", // NEEDS QC
	ivs: "個體值", // NEEDS QC
	dv: "個體值", // NEEDS QC
	dvs: "個體值", // NEEDS QC
	av: "覺醒值", // NEEDS QC
	avs: "覺醒值", // NEEDS QC
	point: "點數", // NEEDS QC
	points: "點數", // NEEDS QC
	// n.b. used in Teambuilder, so it should be capitalized (unlike StatNames.stats)
	stats: "狀態",

	pokemon: "寶可夢",
	move: "招式", // NEEDS QC
	moves: "招式", // NEEDS QC
	item: "道具", // NEEDS QC
	items: "道具", // NEEDS QC
	ability: "特性", // NEEDS QC
	abilities: "特性", // NEEDS QC
	hiddenability: "隱藏特性", // NEEDS QC
	possibleabilities: "可能的特性", // NEEDS QC
	team: "隊伍", // NEEDS QC
	teams: "隊伍", // NEEDS QC
	teamslist: "隊伍清單", // NEEDS QC

	type: "屬性",
	types: "屬性",
	teratype: "太晶{TYPE}", // NEEDS QC
	nature: "性格",
	category: "分類",
	categories: "分類",
	gender: "性別",
	egggroup: "蛋群", // NEEDS QC
	egggroups: "蛋群", // NEEDS QC
	tag: "標籤", // NEEDS QC
	article: "文章", // NEEDS QC
	articles: "文章", // NEEDS QC
	tier: "分級", // NEEDS QC
	tiers: "分級", // NEEDS QC
	format: "對戰模式", // NEEDS QC
	formats: "對戰模式", // NEEDS QC
	color: "顏色",
	form: "樣子", // NEEDS QC
	forme: "形態", // NEEDS QC
	dexnum: "圖鑑No.", // NEEDS QC
	generation: "世代", // NEEDS QC
	gennum: "第{NUMBER}世代", // NEEDS QC
	evolution: "進化", // NEEDS QC
	preevolution: "進化前", // NEEDS QC
	doesnotevolve: "不進化", // NEEDS QC
	zcrystal: "Ｚ純晶", // NEEDS QC
	target: "對象", // NEEDS QC
	height: "身高",
	numm: "{NUMBER}m", // NEEDS QC
	weight: "體重",
	numkg: "{NUMBER}kg", // NEEDS QC
	critrate: "擊中要害率", // NEEDS QC
	user: "可使用的寶可夢", // NEEDS QC
	requiredmove: "所需招式", // NEEDS QC
	dynamaxpower: "極巨招式威力", // NEEDS QC
	none: "無", // NEEDS QC
	pastgensonly: "僅限過去世代", // NEEDS QC
	flingbasepower: "投擲威力", // NEEDS QC
	flingeffect: "投擲效果", // NEEDS QC
	naturalgifttype: "自然之恩屬性", // NEEDS QC
	naturalgiftbasepower: "自然之恩威力", // NEEDS QC

	megaevolution: "超級進化", // NEEDS QC
	zpower: "Ｚ力量", // NEEDS QC
	zeffect: "Ｚ效果", // NEEDS QC
	dynamax: "極巨化", // NEEDS QC
	dynamaxlevel: "極巨化等級", // NEEDS QC
	ultraburst: "究極爆發", // NEEDS QC
	tera: "太晶", // NEEDS QC

	supereffective: "效果絕佳",
	extremelyeffective: "效果無比絕佳",
	effective: "有效果",
	notveryeffective: "效果不好",
	mostlyineffective: "效果相當不好",
	noeffect: "沒有效果",

	weak: "弱點", // NEEDS QC: unofficial
	resist: "抵抗", // NEEDS QC: unofficial
	immune: "免疫", // NEEDS QC: unofficial

	nicknamespecies: "{NICKNAME}（{SPECIES}）", // NEEDS QC
	label: "{LABEL}：", // NEEDS QC
	noweather: "（無天氣）", // NEEDS QC
	noitem: "（無攜帶物品）", // NEEDS QC
	noability: "（無特性）", // NEEDS QC
	foescondition: "對手的{CONDITION}", // NEEDS QC
	speciesforme: "{SPECIES}・{FORME}", // NEEDS QC
};

export const StatNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "攻擊", def: "防禦", spa: "特攻", spd: "特防", spe: "速度",
	accuracy: "命中率", evasion: "閃避率", spc: "特殊",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike TermNames.stats)
	stats: "能力",
};

export const StatMediumNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "攻擊", def: "防禦", spa: "特攻", spd: "特防",
	spe: "速度", accuracy: "命中", evasion: "閃避", spc: "特殊",
};

export const StatShortNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "攻", def: "防", spa: "特攻", spd: "特防", spe: "速", spc: "特",
};

export const TypeNames: { [id: string]: TranslationString } = {
	bug: "蟲",
	dark: "惡",
	dragon: "龍",
	electric: "電",
	fairy: "妖精",
	fighting: "格鬥",
	fire: "火",
	flying: "飛行",
	ghost: "幽靈",
	grass: "草",
	ground: "地面",
	ice: "冰",
	normal: "一般",
	poison: "毒",
	psychic: "超能力",
	rock: "岩石",
	steel: "鋼",
	stellar: "星晶",
	water: "水",
};

export const NatureNames: { [id: string]: TranslationString } = {
	adamant: "固執",
	bashful: "害羞",
	bold: "大膽",
	brave: "勇敢",
	calm: "溫和",
	careful: "慎重",
	docile: "坦率",
	gentle: "溫順",
	hardy: "勤奮",
	hasty: "急躁",
	impish: "淘氣",
	jolly: "爽朗",
	lax: "樂天",
	lonely: "怕寂寞",
	mild: "慢吞吞",
	modest: "內斂",
	naive: "天真",
	naughty: "頑皮",
	quiet: "冷靜",
	quirky: "浮躁",
	rash: "馬虎",
	relaxed: "悠閒",
	sassy: "自大",
	serious: "認真",
	timid: "膽小",
};

export const GenderNames: { [id: string]: TranslationString } = {
	male: "雄性",
	female: "雌性",
	genderless: "無性別",
};

export const StatusNames: { [id: string]: TranslationString } = {
	brn: "灼傷", // NEEDS QC
	par: "麻痺", // NEEDS QC
	slp: "睡眠", // NEEDS QC
	frz: "冰凍", // NEEDS QC
	psn: "中毒", // NEEDS QC
	tox: "劇毒", // NEEDS QC
	fnt: "瀕死", // NEEDS QC
	confusion: "混亂", // NEEDS QC
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: "可以瞄準相鄰的同伴或對手", // NEEDS QC
	normalDoubles: "可以瞄準同伴或任意對手", // NEEDS QC
	normalSingles: "命中對手", // NEEDS QC
	normalFFA: "可以瞄準任意對手", // NEEDS QC
	self: "以自己為對象", // NEEDS QC
	adjacentAlly: "可以瞄準相鄰的同伴", // NEEDS QC
	adjacentAllyDoubles: "命中我方同伴", // NEEDS QC
	adjacentAllySingles: "單打對戰中必定失敗", // NEEDS QC
	adjacentAllyOrSelf: "可以瞄準自己或相鄰的同伴", // NEEDS QC
	adjacentAllyOrSelfDoubles: "可以瞄準自己或同伴", // NEEDS QC
	adjacentFoe: "可以瞄準相鄰的對手", // NEEDS QC
	allAdjacentFoes: "命中相鄰的對手", // NEEDS QC
	allAdjacentFoesDoubles: "命中兩隻對手", // NEEDS QC
	foeSide: "以對手的場地為對象", // NEEDS QC
	allySide: "以我方的場地為對象", // NEEDS QC
	allyTeam: "以我方全隊為對象", // NEEDS QC
	allAdjacent: "命中相鄰的同伴和對手", // NEEDS QC
	allAdjacentDoubles: "命中我方同伴和兩隻對手", // NEEDS QC
	allAdjacentFFA: "命中所有對手", // NEEDS QC
	any: "三打對戰中可以瞄準較遠的寶可夢", // NEEDS QC
	all: "命中場上所有寶可夢", // NEEDS QC
	scripted: "自動選擇對象", // NEEDS QC
	randomNormal: "隨機命中相鄰的對手", // NEEDS QC
	randomNormalDoubles: "隨機命中對手", // NEEDS QC
	allies: "以自己和同伴為對象", // NEEDS QC
};

// no official Chinese egg group names exist (Pokédex 3D Pro predates official Chinese)
// names from 52poke
export const EggGroupNames: { [id: string]: TranslationString } = {
	monster: "怪獸", // NEEDS QC
	water1: "水中1", // NEEDS QC
	bug: "蟲", // NEEDS QC
	flying: "飛行", // NEEDS QC
	field: "陸上", // NEEDS QC
	fairy: "妖精", // NEEDS QC
	grass: "植物", // NEEDS QC
	humanlike: "人型", // NEEDS QC
	water3: "水中3", // NEEDS QC
	mineral: "礦物", // NEEDS QC
	amorphous: "不定形", // NEEDS QC
	water2: "水中2", // NEEDS QC
	ditto: "百變怪", // NEEDS QC
	dragon: "龍", // NEEDS QC
	undiscovered: "未發現", // NEEDS QC
};

export const ColorNames: { [id: string]: TranslationString } = {
	black: "黑色",
	blue: "藍色",
	brown: "褐色",
	gray: "灰色",
	green: "綠色",
	pink: "粉紅色",
	purple: "紫色",
	red: "紅色",
	white: "白色",
	yellow: "黃色",
};
