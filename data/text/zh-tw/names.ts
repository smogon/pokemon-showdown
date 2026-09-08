export const TermNames: { [id: string]: TranslationString } = {
	shiny: "異色",
	happiness: null, // NEEDS TRANSLATION
	level: null, // NEEDS TRANSLATION
	nickname: null, // NEEDS TRANSLATION
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
	stats: "狀態",

	pokemon: "寶可夢",
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

	type: "屬性",
	types: "屬性",
	teratype: null, // NEEDS TRANSLATION
	nature: "性格",
	category: "分類",
	categories: "分類",
	gender: "性別",
	egggroup: null, // NEEDS TRANSLATION
	egggroups: null, // NEEDS TRANSLATION
	tag: null, // NEEDS TRANSLATION
	article: null, // NEEDS TRANSLATION
	articles: null, // NEEDS TRANSLATION
	tier: null, // NEEDS TRANSLATION
	tiers: null, // NEEDS TRANSLATION
	format: null, // NEEDS TRANSLATION
	formats: null, // NEEDS TRANSLATION
	color: "顏色",
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
	weight: "體重",
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

	supereffective: "效果絕佳",
	extremelyeffective: "效果無比絕佳",
	effective: "有效果",
	notveryeffective: "效果不好",
	mostlyineffective: "效果相當不好",
	noeffect: "沒有效果",

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
