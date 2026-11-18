export const StatNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "攻擊", def: "防禦", spa: "特攻", spd: "特防", spe: "速度",
	accuracy: "命中率", evasion: "閃避率", spc: "特殊",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike "Stats" in ui.ts)
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
	Bug: "蟲",
	Dark: "惡",
	Dragon: "龍",
	Electric: "電",
	Fairy: "妖精",
	Fighting: "格鬥",
	Fire: "火",
	Flying: "飛行",
	Ghost: "幽靈",
	Grass: "草",
	Ground: "地面",
	Ice: "冰",
	Normal: "一般",
	Poison: "毒",
	Psychic: "超能力",
	Rock: "岩石",
	Steel: "鋼",
	Stellar: "星晶",
	Water: "水",
	"???": null, // NEEDS TRANSLATION
};

export const NatureNames: { [id: string]: TranslationString } = {
	Adamant: "固執",
	Bashful: "害羞",
	Bold: "大膽",
	Brave: "勇敢",
	Calm: "溫和",
	Careful: "慎重",
	Docile: "坦率",
	Gentle: "溫順",
	Hardy: "勤奮",
	Hasty: "急躁",
	Impish: "淘氣",
	Jolly: "爽朗",
	Lax: "樂天",
	Lonely: "怕寂寞",
	Mild: "慢吞吞",
	Modest: "內斂",
	Naive: "天真",
	Naughty: "頑皮",
	Quiet: "冷靜",
	Quirky: "浮躁",
	Rash: "馬虎",
	Relaxed: "悠閒",
	Sassy: "自大",
	Serious: "認真",
	Timid: "膽小",
};

export const GenderNames: { [id: string]: TranslationString } = {
	M: "雄性",
	F: "雌性",
	N: "無性別",
};

export const StatusNames: { [id: string]: TranslationString } = {
	brn: null, // NEEDS TRANSLATION
	par: null, // NEEDS TRANSLATION
	slp: null, // NEEDS TRANSLATION
	frz: null, // NEEDS TRANSLATION
	psn: null, // NEEDS TRANSLATION
	tox: null, // NEEDS TRANSLATION
	fnt: null, // NEEDS TRANSLATION
	confusion: null, // NEEDS TRANSLATION
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
	Blue: "藍色",
	Brown: "褐色",
	Gray: "灰色",
	Green: "綠色",
	Pink: "粉紅色",
	Purple: "紫色",
	Red: "紅色",
	White: "白色",
	Yellow: "黃色",
};
