export const StatNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "攻击", def: "防御", spa: "特攻", spd: "特防", spe: "速度",
	accuracy: "命中率", evasion: "闪避率", spc: "特殊",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike "Stats" in ui.ts)
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
