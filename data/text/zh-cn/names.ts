export const TermNames: { [id: string]: TranslationString } = {
	shiny: "异色",
	happiness: "亲密度", // official (SV zh-Hans_common 115)
	level: "等级", // official (SV zh-Hans_common 48221)
	nickname: "昵称", // official (SV zh-Hans_common 4414)
	ev: "努力值", // NEEDS QC
	evs: "努力值", // NEEDS QC
	iv: "个体值", // NEEDS QC
	ivs: "个体值", // NEEDS QC
	dv: "个体值", // NEEDS QC
	dvs: "个体值", // NEEDS QC
	av: "觉醒值", // NEEDS QC
	avs: "觉醒值", // NEEDS QC
	point: "点数", // NEEDS QC
	points: "点数", // NEEDS QC
	// n.b. used in Teambuilder, so it should be capitalized (unlike StatNames.stats)
	stats: "状态",

	pokemon: "宝可梦",
	move: "招式", // NEEDS QC
	moves: "招式", // NEEDS QC
	item: "道具", // NEEDS QC
	items: "道具", // NEEDS QC
	ability: "特性", // NEEDS QC
	abilities: "特性", // NEEDS QC
	hiddenability: "隐藏特性", // NEEDS QC
	possibleabilities: "可能的特性", // NEEDS QC
	team: "队伍", // NEEDS QC
	teams: "队伍", // NEEDS QC
	teamslist: "队伍列表", // NEEDS QC

	type: "属性",
	types: "属性",
	teratype: "太晶{TYPE}", // NEEDS QC
	nature: "性格",
	category: "分类",
	categories: "分类",
	gender: "性别",
	egggroup: "蛋组", // NEEDS QC
	egggroups: "蛋组", // NEEDS QC
	tag: "标签", // NEEDS QC
	article: "文章", // NEEDS QC
	articles: "文章", // NEEDS QC
	tier: "分级", // NEEDS QC
	tiers: "分级", // NEEDS QC
	format: "对战模式", // NEEDS QC
	formats: "对战模式", // NEEDS QC
	color: "颜色",
	form: "样子", // NEEDS QC
	forme: "形态", // NEEDS QC
	dexnum: "图鉴No.", // NEEDS QC
	generation: "世代", // NEEDS QC
	gennum: "第{NUMBER}世代", // NEEDS QC
	evolution: "进化", // NEEDS QC
	preevolution: "进化前", // NEEDS QC
	doesnotevolve: "不进化", // NEEDS QC
	zcrystal: "Ｚ纯晶", // NEEDS QC
	target: "对象", // NEEDS QC
	height: "身高",
	numm: "{NUMBER}m", // NEEDS QC
	weight: "体重",
	numkg: "{NUMBER}kg", // NEEDS QC
	critrate: "击中要害率", // NEEDS QC
	user: "可使用的宝可梦", // NEEDS QC
	requiredmove: "所需招式", // NEEDS QC
	dynamaxpower: "极巨招式威力", // NEEDS QC
	none: "无", // NEEDS QC
	pastgensonly: "仅限过去世代", // NEEDS QC
	flingbasepower: "投掷威力", // NEEDS QC
	flingeffect: "投掷效果", // NEEDS QC
	naturalgifttype: "自然之恩属性", // NEEDS QC
	naturalgiftbasepower: "自然之恩威力", // NEEDS QC

	megaevolution: "超级进化", // NEEDS QC
	zpower: "Ｚ力量", // NEEDS QC
	zeffect: "Ｚ效果", // NEEDS QC
	dynamax: "极巨化", // NEEDS QC
	dynamaxlevel: "极巨化等级", // NEEDS QC
	ultraburst: "究极爆发", // NEEDS QC
	tera: "太晶", // NEEDS QC

	supereffective: "效果绝佳",
	extremelyeffective: "效果无比绝佳",
	effective: "有效果",
	notveryeffective: "效果不好",
	mostlyineffective: "效果相当不好",
	noeffect: "没有效果",

	weak: "弱点", // NEEDS QC: unofficial
	resist: "抵抗", // NEEDS QC: unofficial
	immune: "免疫", // NEEDS QC: unofficial

	nicknamespecies: "{NICKNAME}（{SPECIES}）", // NEEDS QC
	label: "{LABEL}：", // NEEDS QC
	noweather: "（无天气）", // NEEDS QC
	noitem: "（无携带物品）", // NEEDS QC
	noability: "（无特性）", // NEEDS QC
	foescondition: "对手的{CONDITION}", // NEEDS QC
	speciesforme: "{SPECIES}・{FORME}", // NEEDS QC
};

export const StatNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "攻击", def: "防御", spa: "特攻", spd: "特防", spe: "速度",
	accuracy: "命中率", evasion: "闪避率", spc: "特殊",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike TermNames.stats)
	stats: "能力",
};

export const StatMediumNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "攻击", def: "防御", spa: "特攻", spd: "特防",
	spe: "速度", accuracy: "命中", evasion: "闪避", spc: "特殊",
};

export const StatShortNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "攻", def: "防", spa: "特攻", spd: "特防", spe: "速", spc: "特",
};

export const TypeNames: { [id: string]: TranslationString } = {
	bug: "虫",
	dark: "恶",
	dragon: "龙",
	electric: "电",
	fairy: "妖精",
	fighting: "格斗",
	fire: "火",
	flying: "飞行",
	ghost: "幽灵",
	grass: "草",
	ground: "地面",
	ice: "冰",
	normal: "一般",
	poison: "毒",
	psychic: "超能力",
	rock: "岩石",
	steel: "钢",
	stellar: "星晶",
	water: "水",
};

export const NatureNames: { [id: string]: TranslationString } = {
	adamant: "固执",
	bashful: "害羞",
	bold: "大胆",
	brave: "勇敢",
	calm: "温和",
	careful: "慎重",
	docile: "坦率",
	gentle: "温顺",
	hardy: "勤奋",
	hasty: "急躁",
	impish: "淘气",
	jolly: "爽朗",
	lax: "乐天",
	lonely: "怕寂寞",
	mild: "慢吞吞",
	modest: "内敛",
	naive: "天真",
	naughty: "顽皮",
	quiet: "冷静",
	quirky: "浮躁",
	rash: "马虎",
	relaxed: "悠闲",
	sassy: "自大",
	serious: "认真",
	timid: "胆小",
};

export const GenderNames: { [id: string]: TranslationString } = {
	male: "雄性",
	female: "雌性",
	genderless: "无性别", // NEEDS QC
};

export const StatusNames: { [id: string]: TranslationString } = {
	brn: "灼伤",
	par: "麻痹",
	slp: "睡眠",
	frz: "冰冻",
	psn: "中毒",
	tox: "剧毒",
	fnt: "濒死", // official (Gen 7+ ability/flavor text, e.g. 引爆 "变为濒死时")
	confusion: "混乱",
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: "可以瞄准相邻的同伴或对手", // NEEDS QC
	normalDoubles: "可以瞄准同伴或任意对手", // NEEDS QC
	normalSingles: "命中对手", // NEEDS QC
	normalFFA: "可以瞄准任意对手", // NEEDS QC
	self: "以自己为对象", // NEEDS QC
	adjacentAlly: "可以瞄准相邻的同伴", // NEEDS QC
	adjacentAllyDoubles: "命中我方同伴", // NEEDS QC
	adjacentAllySingles: "单打对战中必定失败", // NEEDS QC
	adjacentAllyOrSelf: "可以瞄准自己或相邻的同伴", // NEEDS QC
	adjacentAllyOrSelfDoubles: "可以瞄准自己或同伴", // NEEDS QC
	adjacentFoe: "可以瞄准相邻的对手", // NEEDS QC
	allAdjacentFoes: "命中相邻的对手", // NEEDS QC
	allAdjacentFoesDoubles: "命中两只对手", // NEEDS QC
	foeSide: "以对手的场地为对象", // NEEDS QC
	allySide: "以我方的场地为对象", // NEEDS QC
	allyTeam: "以我方全队为对象", // NEEDS QC
	allAdjacent: "命中相邻的同伴和对手", // NEEDS QC
	allAdjacentDoubles: "命中我方同伴和两只对手", // NEEDS QC
	allAdjacentFFA: "命中所有对手", // NEEDS QC
	any: "三打对战中可以瞄准较远的宝可梦", // NEEDS QC
	all: "命中场上所有宝可梦", // NEEDS QC
	scripted: "自动选择对象", // NEEDS QC
	randomNormal: "随机命中相邻的对手", // NEEDS QC
	randomNormalDoubles: "随机命中对手", // NEEDS QC
	allies: "以自己和同伴为对象", // NEEDS QC
};

// no official Chinese egg group names exist (Pokédex 3D Pro predates official Chinese)
// names from 52poke
export const EggGroupNames: { [id: string]: TranslationString } = {
	monster: "怪兽", // NEEDS QC
	water1: "水中1", // NEEDS QC
	bug: "虫", // NEEDS QC
	flying: "飞行", // NEEDS QC
	field: "陆上", // NEEDS QC
	fairy: "妖精", // NEEDS QC
	grass: "植物", // NEEDS QC
	humanlike: "人型", // NEEDS QC
	water3: "水中3", // NEEDS QC
	mineral: "矿物", // NEEDS QC
	amorphous: "不定形", // NEEDS QC
	water2: "水中2", // NEEDS QC
	ditto: "百变怪", // NEEDS QC
	dragon: "龙", // NEEDS QC
	undiscovered: "蛋未发现", // NEEDS QC
};

export const ColorNames: { [id: string]: TranslationString } = {
	black: "黑色",
	blue: "蓝色",
	brown: "褐色",
	gray: "灰色",
	green: "绿色",
	pink: "粉红色",
	purple: "紫色",
	red: "红色",
	white: "白色",
	yellow: "黄色",
};
