export const StatNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "攻击", def: "防御", spa: "特攻", spd: "特防", spe: "速度",
	accuracy: "命中率", evasion: "闪避率", spc: "特殊",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike the "Stats" UI catalog entry)
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
