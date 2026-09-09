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
	Bug: "虫",
	Dark: "恶",
	Dragon: "龙",
	Electric: "电",
	Fairy: "妖精",
	Fighting: "格斗",
	Fire: "火",
	Flying: "飞行",
	Ghost: "幽灵",
	Grass: "草",
	Ground: "地面",
	Ice: "冰",
	Normal: "一般",
	Poison: "毒",
	Psychic: "超能力",
	Rock: "岩石",
	Steel: "钢",
	Stellar: "星晶",
	Water: "水",
	"???": null, // NEEDS TRANSLATION
};

export const NatureNames: { [id: string]: TranslationString } = {
	Adamant: "固执",
	Bashful: "害羞",
	Bold: "大胆",
	Brave: "勇敢",
	Calm: "温和",
	Careful: "慎重",
	Docile: "坦率",
	Gentle: "温顺",
	Hardy: "勤奋",
	Hasty: "急躁",
	Impish: "淘气",
	Jolly: "爽朗",
	Lax: "乐天",
	Lonely: "怕寂寞",
	Mild: "慢吞吞",
	Modest: "内敛",
	Naive: "天真",
	Naughty: "顽皮",
	Quiet: "冷静",
	Quirky: "浮躁",
	Rash: "马虎",
	Relaxed: "悠闲",
	Sassy: "自大",
	Serious: "认真",
	Timid: "胆小",
};

export const GenderNames: { [id: string]: TranslationString } = {
	M: "雄性",
	F: "雌性",
	N: "无性别", // NEEDS QC
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
	Monster: "怪兽", // NEEDS QC
	"Water 1": "水中1", // NEEDS QC
	Bug: "虫", // NEEDS QC
	Flying: "飞行", // NEEDS QC
	Field: "陆上", // NEEDS QC
	Fairy: "妖精", // NEEDS QC
	Grass: "植物", // NEEDS QC
	"Human-Like": "人型", // NEEDS QC
	"Water 3": "水中3", // NEEDS QC
	Mineral: "矿物", // NEEDS QC
	Amorphous: "不定形", // NEEDS QC
	"Water 2": "水中2", // NEEDS QC
	Ditto: "百变怪", // NEEDS QC
	Dragon: "龙", // NEEDS QC
	Undiscovered: "蛋未发现", // NEEDS QC
};

export const ColorNames: { [id: string]: TranslationString } = {
	Black: "黑色",
	Blue: "蓝色",
	Brown: "褐色",
	Gray: "灰色",
	Green: "绿色",
	Pink: "粉红色",
	Purple: "紫色",
	Red: "红色",
	White: "白色",
	Yellow: "黄色",
};
