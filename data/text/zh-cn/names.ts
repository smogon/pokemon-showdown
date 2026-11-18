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
	N: null, // NEEDS TRANSLATION
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
	Monster: null, // NEEDS TRANSLATION
	"Water 1": null, // NEEDS TRANSLATION
	Bug: null, // NEEDS TRANSLATION
	Flying: null, // NEEDS TRANSLATION
	Field: null, // NEEDS TRANSLATION
	Fairy: null, // NEEDS TRANSLATION
	Grass: null, // NEEDS TRANSLATION
	"Human-Like": null, // NEEDS TRANSLATION
	"Water 3": null, // NEEDS TRANSLATION
	Mineral: null, // NEEDS TRANSLATION
	Amorphous: null, // NEEDS TRANSLATION
	"Water 2": null, // NEEDS TRANSLATION
	Ditto: null, // NEEDS TRANSLATION
	Dragon: null, // NEEDS TRANSLATION
	Undiscovered: null, // NEEDS TRANSLATION
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
