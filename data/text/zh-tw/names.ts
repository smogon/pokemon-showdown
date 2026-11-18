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
	"???": "？？？",
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
	Monster: "怪獸", // NEEDS QC
	"Water 1": "水中1", // NEEDS QC
	Bug: "蟲", // NEEDS QC
	Flying: "飛行", // NEEDS QC
	Field: "陸上", // NEEDS QC
	Fairy: "妖精", // NEEDS QC
	Grass: "植物", // NEEDS QC
	"Human-Like": "人型", // NEEDS QC
	"Water 3": "水中3", // NEEDS QC
	Mineral: "礦物", // NEEDS QC
	Amorphous: "不定形", // NEEDS QC
	"Water 2": "水中2", // NEEDS QC
	Ditto: "百變怪", // NEEDS QC
	Dragon: "龍", // NEEDS QC
	Undiscovered: "未發現", // NEEDS QC
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
