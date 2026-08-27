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
	av: "努力值", // NEEDS QC
	avs: "努力值", // NEEDS QC
	point: "點數", // NEEDS QC
	points: "點數", // NEEDS QC
	stats: "狀態",

	pokemon: "寶可夢",
	move: "招式", // NEEDS QC
	moves: "招式", // NEEDS QC
	item: "道具", // NEEDS QC
	items: "道具", // NEEDS QC
	ability: "特性", // NEEDS QC
	abilities: "特性", // NEEDS QC
	hiddenability: "隱藏特性", // NEEDS QC
	team: "隊伍", // NEEDS QC
	teams: "隊伍", // NEEDS QC
	teamslist: "隊伍列表", // NEEDS QC

	type: "屬性",
	types: "屬性",
	teratype: "太晶屬性", // NEEDS QC
	nature: "性格",
	category: "分類",
	categories: "分類",
	gender: "性別",
	egggroup: "蛋群", // NEEDS QC
	egggroups: "蛋群", // NEEDS QC
	tag: "標籤", // NEEDS QC
	article: "文章", // NEEDS QC
	articles: "文章", // NEEDS QC
	tier: "級別", // NEEDS QC
	tiers: "分級", // NEEDS QC
	color: "顏色",
	form: "樣子", // NEEDS QC
	forme: "形態", // NEEDS QC
	dexnum: "圖鑑No.", // NEEDS QC
	generation: "世代", // NEEDS QC
	gennum: "[NUMBER]代", // NEEDS QC
	evolution: "進化", // NEEDS QC
	preevolution: "進化前", // NEEDS QC
	doesnotevolve: "不進化", // NEEDS QC
	zcrystal: "Ｚ純晶", // NEEDS QC
	target: "對象", // NEEDS QC
	height: "身高",
	numm: "[NUMBER]m", // NEEDS QC
	weight: "體重",
	numkg: "[NUMBER]kg", // NEEDS QC

	megaevolution: "超級進化", // NEEDS QC
	zpower: "Ｚ力量", // NEEDS QC
	dynamax: "極巨化", // NEEDS QC
	dynamaxlevel: "極巨化等級", // NEEDS QC

	supereffective: "效果絕佳", // NEEDS QC
	extremelyeffective: "效果無比絕佳", // NEEDS QC
	effective: "有效果", // NEEDS QC
	notveryeffective: "效果不好", // NEEDS QC
	mostlyineffective: "效果相當不好", // NEEDS QC
	noeffect: "沒有效果", // NEEDS QC

	weak: "弱點", // NEEDS QC: unofficial
	resist: "抵抗", // NEEDS QC: unofficial
	immune: "免疫", // NEEDS QC: unofficial

	nicknamespecies: "[NICKNAME]（[SPECIES]）", // NEEDS QC
	speciesforme: "[SPECIES]-[FORME]",
};

export const StatNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "攻擊", def: "防禦", spa: "特攻", spd: "特防", spe: "速度",
	accuracy: "命中率", evasion: "閃避率", spc: "特殊",
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
	normal: "相鄰的1隻寶可夢", // NEEDS QC
	self: "自己", // NEEDS QC
	adjacentAlly: "我方1隻", // NEEDS QC
	adjacentAllyOrSelf: "自己或我方1隻", // NEEDS QC
	adjacentFoe: "相鄰的對手1隻", // NEEDS QC
	allAdjacentFoes: "相鄰的對手全體", // NEEDS QC
	foeSide: "對手的場地", // NEEDS QC
	allySide: "我方的場地", // NEEDS QC
	allyTeam: "我方全隊", // NEEDS QC
	allAdjacent: "相鄰的寶可夢全體", // NEEDS QC
	any: "任意1隻寶可夢", // NEEDS QC
	all: "場上寶可夢全體", // NEEDS QC
	scripted: "自動選擇", // NEEDS QC
	randomNormal: "隨機對手1隻", // NEEDS QC
	allies: "自己和我方全體", // NEEDS QC
};

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

export const TagNames: { [id: string]: TranslationString } = {
	physical: "物理", // NEEDS QC
	special: "特殊", // NEEDS QC
	status: "變化", // NEEDS QC
	mega: "超級進化",
	gigantamax: "超極巨化",
	mythical: "幻之寶可夢",
	sublegendary: "準傳說", // NEEDS QC
	restrictedlegendary: "限制級傳說", // NEEDS QC
	ultrabeast: "究極異獸",
	paradox: "悖謬",
	pokestar: "寶可塢", // NEEDS QC
	zmove: "Ｚ招式",
	maxmove: "極巨招式",
	contact: "接觸", // NEEDS QC
	sound: "聲音", // NEEDS QC
	powder: "粉末", // NEEDS QC
	fist: "拳", // NEEDS QC
	pulse: "波動", // NEEDS QC
	bite: "啃咬", // NEEDS QC
	bullet: "彈", // NEEDS QC
	dance: "舞蹈", // NEEDS QC
	slicing: "切割", // NEEDS QC
	wind: "風", // NEEDS QC
	bypassprotect: "無視守住", // NEEDS QC
	nonreflectable: "不可反射", // NEEDS QC
	nonmirror: "不可鸚鵡學舌", // NEEDS QC
	nonsnatchable: "不可搶奪", // NEEDS QC
	bypasssubstitute: "無視替身", // NEEDS QC
	gmaxmove: "超極巨招式", // NEEDS QC
	past: "過去作", // NEEDS QC
	truepast: "完全過去作", // NEEDS QC
	pastunobtainable: "過去作不可入手", // NEEDS QC
	future: "未實裝", // NEEDS QC
	lgpe: "LGPE",
	unobtainable: "無法入手", // NEEDS QC
	cap: "CAP",
	custom: "自訂", // NEEDS QC
	nonexistent: "不存在", // NEEDS QC

	introducedgen: "登場世代", // NEEDS QC
	height: "身高",
	weight: "體重",
	hp: "HP",
	atk: "攻", // NEEDS QC
	def: "防", // NEEDS QC
	spa: "特攻", // NEEDS QC
	spd: "特防", // NEEDS QC
	spe: "速", // NEEDS QC
	bst: "種族值總和", // NEEDS QC
	basepower: "威力",
	priority: "優先度", // NEEDS QC
	accuracy: "命中",
	maxpp: "最大PP", // NEEDS QC
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
