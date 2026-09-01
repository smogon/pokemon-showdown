export const TermNames: { [id: string]: TranslationString } = {
	shiny: "异色",
	happiness: "亲密度", // official (SV zh-Hans_common 115)
	level: "等级", // official (SV zh-Hans_common 48221)
	nickname: "昵称", // official (SV zh-Hans_common 4414)
	ev: null, // NEEDS TRANSLATION
	evs: null, // NEEDS TRANSLATION
	iv: null, // NEEDS TRANSLATION
	ivs: null, // NEEDS TRANSLATION
	dv: null, // NEEDS TRANSLATION
	dvs: null, // NEEDS TRANSLATION
	av: null, // NEEDS TRANSLATION
	avs: null, // NEEDS TRANSLATION
	point: null, // NEEDS TRANSLATION
	points: null, // NEEDS TRANSLATION
	// n.b. used in Teambuilder, so it should be capitalized (unlike StatNames.stats)
	stats: "状态",

	pokemon: "宝可梦",
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

	type: "属性",
	types: "属性",
	teratype: null, // NEEDS TRANSLATION
	nature: "性格",
	category: "分类",
	categories: "分类",
	gender: "性别",
	egggroup: null, // NEEDS TRANSLATION
	egggroups: null, // NEEDS TRANSLATION
	tag: null, // NEEDS TRANSLATION
	article: null, // NEEDS TRANSLATION
	articles: null, // NEEDS TRANSLATION
	tier: null, // NEEDS TRANSLATION
	tiers: null, // NEEDS TRANSLATION
	format: null, // NEEDS TRANSLATION
	formats: null, // NEEDS TRANSLATION
	color: "颜色",
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
	height: "身高",
	numm: null, // NEEDS TRANSLATION
	weight: "体重",
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

	megaevolution: null, // NEEDS TRANSLATION
	zpower: null, // NEEDS TRANSLATION
	zeffect: null, // NEEDS TRANSLATION
	dynamax: null, // NEEDS TRANSLATION
	dynamaxlevel: null, // NEEDS TRANSLATION
	ultraburst: null, // NEEDS TRANSLATION
	tera: null, // NEEDS TRANSLATION

	supereffective: "效果绝佳",
	extremelyeffective: "效果无比绝佳",
	effective: "有效果",
	notveryeffective: "效果不好",
	mostlyineffective: "效果相当不好",
	noeffect: "没有效果",

	weak: null, // NEEDS TRANSLATION
	resist: null, // NEEDS TRANSLATION
	immune: null, // NEEDS TRANSLATION

	nicknamespecies: null, // NEEDS TRANSLATION
	label: null, // NEEDS TRANSLATION
	noweather: null, // NEEDS TRANSLATION
	noitem: null, // NEEDS TRANSLATION
	noability: null, // NEEDS TRANSLATION
	foescondition: null, // NEEDS TRANSLATION
	speciesforme: null, // NEEDS TRANSLATION
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
	genderless: null, // NEEDS TRANSLATION
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

// no official Chinese egg group names exist (Pokédex 3D Pro predates official Chinese)
// names from 52poke
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
