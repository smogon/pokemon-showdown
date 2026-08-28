export const TermNames: { [id: string]: TranslationString } = {
	shiny: "异色",
	happiness: "亲密度", // NEEDS QC
	level: "等级", // NEEDS QC
	nickname: "昵称", // NEEDS QC
	ev: "努力值", // NEEDS QC
	evs: "努力值", // NEEDS QC
	iv: "个体值", // NEEDS QC
	ivs: "个体值", // NEEDS QC
	dv: "个体值", // NEEDS QC
	dvs: "个体值", // NEEDS QC
	av: "努力值", // NEEDS QC
	avs: "努力值", // NEEDS QC
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
	team: "队伍", // NEEDS QC
	teams: "队伍", // NEEDS QC
	teamslist: "队伍列表", // NEEDS QC

	type: "属性",
	types: "属性",
	teratype: "太晶属性", // NEEDS QC
	nature: "性格",
	category: "分类",
	categories: "分类",
	gender: "性别",
	egggroup: "蛋组", // NEEDS QC
	egggroups: "蛋组", // NEEDS QC
	tag: "标签", // NEEDS QC
	article: "文章", // NEEDS QC
	articles: "文章", // NEEDS QC
	tier: "级别", // NEEDS QC
	tiers: "分级", // NEEDS QC
	color: "颜色",
	form: "样子", // NEEDS QC
	forme: "形态", // NEEDS QC
	dexnum: "图鉴No.", // NEEDS QC
	generation: "世代", // NEEDS QC
	gennum: "{NUMBER}代", // NEEDS QC
	evolution: "进化", // NEEDS QC
	preevolution: "进化前", // NEEDS QC
	doesnotevolve: "不进化", // NEEDS QC
	zcrystal: "Ｚ纯晶", // NEEDS QC
	target: "对象", // NEEDS QC
	height: "身高",
	numm: "{NUMBER}m", // NEEDS QC
	weight: "体重",
	numkg: "{NUMBER}kg", // NEEDS QC

	megaevolution: "超级进化", // NEEDS QC
	zpower: "Ｚ力量", // NEEDS QC
	dynamax: "极巨化", // NEEDS QC
	dynamaxlevel: "极巨化等级", // NEEDS QC

	supereffective: "效果绝佳", // NEEDS QC
	extremelyeffective: "效果无比绝佳", // NEEDS QC
	effective: "有效果", // NEEDS QC
	notveryeffective: "效果不好", // NEEDS QC
	mostlyineffective: "效果相当不好", // NEEDS QC
	noeffect: "没有效果", // NEEDS QC

	weak: "弱点", // NEEDS QC: unofficial
	resist: "抵抗", // NEEDS QC: unofficial
	immune: "免疫", // NEEDS QC: unofficial

	nicknamespecies: "{NICKNAME}（{SPECIES}）", // NEEDS QC
	speciesforme: "{SPECIES}-{FORME}",
};

export const StatNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "攻击", def: "防御", spa: "特攻", spd: "特防", spe: "速度",
	accuracy: "命中率", evasion: "闪避率", spc: "特殊",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike TermNames.stats)
	stats: "状态",
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
	brn: "灼伤", // NEEDS QC
	par: "麻痹", // NEEDS QC
	slp: "睡眠", // NEEDS QC
	frz: "冰冻", // NEEDS QC
	psn: "中毒", // NEEDS QC
	tox: "剧毒", // NEEDS QC
	fnt: "濒死", // NEEDS QC
	confusion: "混乱", // NEEDS QC
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: "相邻的1只宝可梦", // NEEDS QC
	self: "自己", // NEEDS QC
	adjacentAlly: "我方1只", // NEEDS QC
	adjacentAllyOrSelf: "自己或我方1只", // NEEDS QC
	adjacentFoe: "相邻的对手1只", // NEEDS QC
	allAdjacentFoes: "相邻的对手全体", // NEEDS QC
	foeSide: "对手的场地", // NEEDS QC
	allySide: "我方的场地", // NEEDS QC
	allyTeam: "我方全队", // NEEDS QC
	allAdjacent: "相邻的宝可梦全体", // NEEDS QC
	any: "任意1只宝可梦", // NEEDS QC
	all: "场上宝可梦全体", // NEEDS QC
	scripted: "自动选择", // NEEDS QC
	randomNormal: "随机对手1只", // NEEDS QC
	allies: "自己和我方全体", // NEEDS QC
};

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
	undiscovered: "未发现", // NEEDS QC
};

export const TagNames: { [id: string]: TranslationString } = {
	physical: "物理", // NEEDS QC
	special: "特殊", // NEEDS QC
	status: "变化", // NEEDS QC
	mega: "超级进化",
	gigantamax: "超极巨化",
	mythical: "幻之宝可梦",
	sublegendary: "准传说", // NEEDS QC
	restrictedlegendary: "限制级传说", // NEEDS QC
	ultrabeast: "究极异兽",
	paradox: "悖谬",
	pokestar: "宝可坞", // NEEDS QC
	zmove: "Ｚ招式",
	maxmove: "极巨招式",
	contact: "接触", // NEEDS QC
	sound: "声音", // NEEDS QC
	powder: "粉末", // NEEDS QC
	fist: "拳", // NEEDS QC
	pulse: "波动", // NEEDS QC
	bite: "啃咬", // NEEDS QC
	bullet: "弹", // NEEDS QC
	dance: "舞蹈", // NEEDS QC
	slicing: "切割", // NEEDS QC
	wind: "风", // NEEDS QC
	bypassprotect: "无视守住", // NEEDS QC
	nonreflectable: "不可反射", // NEEDS QC
	nonmirror: "不可鹦鹉学舌", // NEEDS QC
	nonsnatchable: "不可抢夺", // NEEDS QC
	bypasssubstitute: "无视替身", // NEEDS QC
	gmaxmove: "超极巨招式", // NEEDS QC
	past: "过去作", // NEEDS QC
	truepast: "完全过去作", // NEEDS QC
	pastunobtainable: "过去作不可入手", // NEEDS QC
	future: "未实装", // NEEDS QC
	lgpe: "LGPE",
	unobtainable: "无法入手", // NEEDS QC
	cap: "CAP",
	custom: "自定义", // NEEDS QC
	nonexistent: "不存在", // NEEDS QC

	introducedgen: "登场世代", // NEEDS QC
	height: "身高",
	weight: "体重",
	hp: "HP",
	atk: "攻", // NEEDS QC
	def: "防", // NEEDS QC
	spa: "特攻", // NEEDS QC
	spd: "特防", // NEEDS QC
	spe: "速", // NEEDS QC
	bst: "种族值总和", // NEEDS QC
	basepower: "威力",
	priority: "优先度", // NEEDS QC
	accuracy: "命中",
	maxpp: "最大PP", // NEEDS QC
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
