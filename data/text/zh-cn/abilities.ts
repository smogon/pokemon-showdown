// Mechanics desc style (zh-cn): official game terminology, halfwidth numerals (1.5倍, 30%).
// Terminology: 该宝可梦 (this Pokemon), 出场时 (on switch-in), 能力等级 (stat stage),
//   进攻能力 (offensive stat), 濒死 (fainted/KO), 接触类招式 (contact move), 连续攻击招式
//   (multi-hit move), 追加效果 (secondary effect), 异常状态 (non-volatile status),
//   向下取整 (rounded down), 五舍六入 (rounded half down), 先制招式 (priority move).
// Weather states: 大晴天/下雨/沙暴/冰雹/下雪; harsh: 大日照 (Desolate Land), 大雨
//   (Primordial Sea), 乱流 (Delta Stream).
// Cross-references generated from name fields / pokedex-names.ts. CAP entities keep
//   name null (English fallback); descs are translated with English names inline.

export const AbilitiesText: { [id: IDEntry]: AbilityText } = {
	noability: {
		name: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	adaptability: {
		name: "适应力",
		// Official flavor text: "与自身同属性的招式 威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aerilate: {
		name: "飞行皮肤",
		// Official flavor text: "一般属性的招式 会变为飞行属性。 威力会少量提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	aftermath: {
		name: "引爆",
		// Official flavor text: "变为濒死时， 会对接触到自己的对手造成伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		damage: "  {POKEMON}受到了伤害！",
	},
	airlock: {
		name: "气闸",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  天气的影响消失了！",
	},
	analytic: {
		name: "分析",
		// Official flavor text: "如果在最后使出招式， 招式的威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	angerpoint: {
		name: "愤怒穴位",
		// Official flavor text: "要害被击中时， 会大发雷霆， 攻击力变为最大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		boost: "  {POKEMON}的攻击被提高到了最大！",
	},
	angershell: {
		name: "愤怒甲壳",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	anticipation: {
		name: "危险预知",
		// Official flavor text: "可以察觉到 对手拥有的危险招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  {POKEMON}发抖了！",
	},
	arenatrap: {
		name: "沙穴",
		// Official flavor text: "在战斗中让对手无法逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	armortail: {
		name: "尾甲",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		block: "#damp",
	},
	aromaveil: {
		name: "芳香幕",
		// Official flavor text: "可以防住向自己和同伴 发出的心灵攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		block: "  {POKEMON}正受到芳香幕的保护！",
	},
	asone: {
		name: "人马一体",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}同时拥有了两种特性！",
	},
	asoneglastrier: {
		name: "人马一体（雪暴马）", // PS-style disambiguator (not part of the official name)
		shortDesc: null, // NEEDS TRANSLATION
	},
	asonespectrier: {
		name: "人马一体（灵幽马）", // PS-style disambiguator (not part of the official name)
		shortDesc: null, // NEEDS TRANSLATION
	},
	aurabreak: {
		name: "气场破坏",
		// Official flavor text: "让气场的效果发生逆转， 降低威力。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}压制了所有气场！",
	},
	auraguard: {
		name: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	baddreams: {
		name: "梦魇",
		// Official flavor text: "给予睡眠状态的对手伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		damage: "  {POKEMON}正被恶梦缠身！",
	},
	ballfetch: {
		name: "捡球",
		shortDesc: null, // NEEDS TRANSLATION
	},
	battery: {
		name: "蓄电池",
		shortDesc: null, // NEEDS TRANSLATION
	},
	battlearmor: {
		name: "战斗盔甲",
		shortDesc: null, // NEEDS TRANSLATION
	},
	battlebond: {
		name: "牵绊变身",
		// Official flavor text: "打倒对手时，与训练家的牵绊会增强， 变为小智版甲贺忍蛙。 飞水手里剑的招式威力会增强。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		activate: "  {POKEMON}浑身充满了牵绊之力！",
		transform: "{POKEMON}变身成了小智版甲贺忍蛙！",
	},
	beadsofruin: {
		name: "灾祸之玉",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}的灾祸之玉令周围的宝可梦的特防减弱了！",
	},
	beastboost: {
		name: "异兽提升",
		// Official flavor text: "打倒对手的时候， 自己最高的那项能力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	berserk: {
		name: "怒火冲天",
		// Official flavor text: "因对手的攻击 ＨＰ变为一半时， 特攻会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bigpecks: {
		name: "健壮胸肌",
		shortDesc: null, // NEEDS TRANSLATION
	},
	blaze: {
		name: "猛火",
		// Official flavor text: "ＨＰ减少的时候， 火属性的招式威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	bulletproof: {
		name: "防弹",
		shortDesc: null, // NEEDS TRANSLATION
	},
	cheekpouch: {
		name: "颊囊",
		// Official flavor text: "无论是哪种树果， 食用后，ＨＰ都会回复。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	chillingneigh: {
		name: "苍白嘶鸣",
		// Official flavor text: "打倒对手时 会用冰冷的声音嘶鸣 并提高攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	chlorophyll: {
		name: "叶绿素",
		// Official flavor text: "晴朗天气时， 速度会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	clearbody: {
		name: "恒净之躯",
		shortDesc: null, // NEEDS TRANSLATION
	},
	cloudnine: {
		name: "无关天气",
		shortDesc: null, // NEEDS TRANSLATION

		start: "#airlock",
	},
	colorchange: {
		name: "变色",
		// Official flavor text: "自己的属性会变为 从对手处所受招式的属性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	comatose: {
		name: "绝对睡眠",
		// Official flavor text: "总是半梦半醒的状态， 绝对不会醒来。 可以就这么睡着进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}处于半梦半醒状态！",
	},
	commander: {
		name: "发号施令",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}作为发号施令的要员而被{TARGET}吞下去了！",
	},
	competitive: {
		name: "好胜",
		// Official flavor text: "如果能力被降低， 特攻就会大幅提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	compoundeyes: {
		name: "复眼",
		shortDesc: null, // NEEDS TRANSLATION
	},
	contrary: {
		name: "唱反调",
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	corrosion: {
		name: "腐蚀",
		shortDesc: null, // NEEDS TRANSLATION
	},
	costar: {
		name: "同台共演",
		shortDesc: null, // NEEDS TRANSLATION
	},
	cottondown: {
		name: "棉絮",
		// Official flavor text: "受到攻击后撒下棉絮， 降低除自己以外的 所有宝可梦的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	cudchew: {
		name: "反刍",
		shortDesc: null, // NEEDS TRANSLATION
	},
	curiousmedicine: {
		name: "怪药",
		shortDesc: null, // NEEDS TRANSLATION
	},
	cursedbody: {
		name: "诅咒之躯",
		// Official flavor text: "受到攻击时， 有时会把对手的招式 变为定身法状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	cutecharm: {
		name: "迷人之躯",
		// Official flavor text: "有时会让接触到自己的对手着迷。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	damp: {
		name: "湿气",
		// Official flavor text: "通过把周围都弄湿， 使谁都无法使用自爆等爆炸类的招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		block: "  {SOURCE}无法使用{MOVE}！",
	},
	dancer: {
		name: "舞者",
		// Official flavor text: "有谁使出跳舞招式时， 自己也能就这么接着使出跳舞招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	darkaura: {
		name: "暗黑气场",
		// Official flavor text: "全体的恶属性招式变强。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}正在释放暗黑气场！",
	},
	dauntlessshield: {
		name: "不屈之盾",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	dazzling: {
		name: "鲜艳之躯",
		// Official flavor text: "让对手吓一跳， 使其无法对我方使出先制招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		block: "#damp",
	},
	defeatist: {
		name: "软弱",
		// Official flavor text: "ＨＰ减半时， 会变得软弱， 攻击和特攻会减半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	defiant: {
		name: "不服输",
		// Official flavor text: "能力被降低时， 攻击会大幅提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	deltastream: {
		name: "德尔塔气流",
		// Official flavor text: "变为令飞行属性的弱点 消失的天气。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	desolateland: {
		name: "终结之地",
		// Official flavor text: "变为不会受到 水属性攻击的天气。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	disguise: {
		name: "画皮",
		// Official flavor text: "通过画皮覆盖住身体， 可以防住１次攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		block: "  画皮变成了替身！",
		transform: "{POKEMON}的画皮脱落了！",
	},
	download: {
		name: "下载",
		// Official flavor text: "比较对手的防御和特防， 根据较低的那项能力 相应地提高自己的攻击或特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonize: {
		name: "龙皮肤",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonsmaw: {
		name: "龙颚",
		shortDesc: null, // NEEDS TRANSLATION
	},
	drizzle: {
		name: "降雨",
		shortDesc: null, // NEEDS TRANSLATION
	},
	drought: {
		name: "日照",
		shortDesc: null, // NEEDS TRANSLATION
	},
	dryskin: {
		name: "干燥皮肤",
		// Official flavor text: "下雨天气时和受到水属性的招式时， ＨＰ会回复。晴朗天气时和受到火属性的 招式时，ＨＰ会减少。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},

		damage: "#aftermath",
	},
	earlybird: {
		name: "早起",
		shortDesc: null, // NEEDS TRANSLATION
	},
	eartheater: {
		name: "食土",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	eelevate: {
		name: "鳗鳗高升",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	effectspore: {
		name: "孢子",
		// Official flavor text: "受到攻击时， 有时会把接触到自己的对手 变为中毒、麻痹或睡眠状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	electricsurge: {
		name: "电气制造者",
		shortDesc: null, // NEEDS TRANSLATION
	},
	electromorphosis: {
		name: "电力转换",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}受到{MOVE}而充电了！",
	},
	embodyaspectcornerstone: {
		name: "面影辉映（础石）", // PS-style disambiguator (not part of the official name)
		shortDesc: null, // NEEDS TRANSLATION

		boost: "  {POKEMON}让础之假面发出光辉，防御提高了！",
	},
	embodyaspecthearthflame: {
		name: "面影辉映（火灶）", // PS-style disambiguator (not part of the official name)
		shortDesc: null, // NEEDS TRANSLATION

		boost: "  {POKEMON}让灶之假面发出光辉，攻击提高了！",
	},
	embodyaspectteal: {
		name: "面影辉映（碧草）", // PS-style disambiguator (not part of the official name)
		shortDesc: null, // NEEDS TRANSLATION

		boost: "  {POKEMON}让碧之假面发出光辉，速度提高了！",
	},
	embodyaspectwellspring: {
		name: "面影辉映（水井）", // PS-style disambiguator (not part of the official name)
		shortDesc: null, // NEEDS TRANSLATION

		boost: "  {POKEMON}让井之假面发出光辉，特防提高了！",
	},
	emergencyexit: {
		name: "危险回避",
		// Official flavor text: "ＨＰ变为一半时， 为了回避危险， 会退回到同行队伍中。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fairyaura: {
		name: "妖精气场",
		// Official flavor text: "全体的妖精属性招式变强。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}正在释放妖精气场！",
	},
	filter: {
		name: "过滤",
		shortDesc: null, // NEEDS TRANSLATION
	},
	firemane: {
		name: "火焰鬃毛",
		shortDesc: null, // NEEDS TRANSLATION
	},
	flamebody: {
		name: "火焰之躯",
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	flareboost: {
		name: "受热激升",
		// Official flavor text: "变为灼伤状态时， 特殊招式的威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flashfire: {
		name: "引火",
		// Official flavor text: "受到火属性的招式攻击时， 吸收火焰，自己使出的 火属性招式会变强。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}的火焰威力提高了！",
	},
	flowergift: {
		name: "花之礼",
		// Official flavor text: "晴朗天气时， 自己与同伴的攻击和 特防能力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	flowerveil: {
		name: "花幕",
		// Official flavor text: "我方的草属性宝可梦 能力不会降低， 也不会变为异常状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		block: "  {POKEMON}正受到花幕的保护！",
	},
	fluffy: {
		name: "毛茸茸",
		// Official flavor text: "会将对手所给予的接触类招式的伤害减半， 但火属性招式的伤害会变为２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	forecast: {
		name: "阴晴不定",
		// Official flavor text: "受天气的影响， 会变为水属性、火属性 或冰属性中的某一个。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	forewarn: {
		name: "预知梦",
		// Official flavor text: "出场时， 只读取１个对手拥有的招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  读取了{TARGET}的{MOVE}！",
		activateNoTarget: null, // NEEDS TRANSLATION
	},
	friendguard: {
		name: "友情防守",
		shortDesc: null, // NEEDS TRANSLATION
	},
	frisk: {
		name: "察觉",
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			shortDesc: null, // NEEDS TRANSLATION
		},

		activate: "  {POKEMON}察觉到了{TARGET}的{ITEM}！",
		activateNoTarget: null, // NEEDS TRANSLATION
	},
	fullmetalbody: {
		name: "金属防护",
		shortDesc: null, // NEEDS TRANSLATION
	},
	furcoat: {
		name: "毛皮大衣",
		shortDesc: null, // NEEDS TRANSLATION
	},
	galewings: {
		name: "疾风之翼",
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	galvanize: {
		name: "电气皮肤",
		// Official flavor text: "一般属性的招式 会变为电属性。 威力会少量提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gluttony: {
		name: "贪吃鬼",
		// Official flavor text: "原本ＨＰ变得很少时才会吃树果， 在ＨＰ还有一半时就会把它吃掉。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	goodasgold: {
		name: "黄金之躯",
		shortDesc: null, // NEEDS TRANSLATION
	},
	gooey: {
		name: "黏滑",
		shortDesc: null, // NEEDS TRANSLATION
	},
	gorillatactics: {
		name: "一猩一意",
		// Official flavor text: "虽然攻击会提高， 但是只能使出 一开始所选的招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	grasspelt: {
		name: "草之毛皮",
		shortDesc: null, // NEEDS TRANSLATION
	},
	grassysurge: {
		name: "青草制造者",
		shortDesc: null, // NEEDS TRANSLATION
	},
	grimneigh: {
		name: "漆黑嘶鸣",
		// Official flavor text: "打倒对手时 会用恐怖的声音嘶鸣 并提高特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	guarddog: {
		name: "看门犬",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gulpmissile: {
		name: "一口导弹",
		// Official flavor text: "冲浪或潜水时会叼来猎物。 受到伤害时， 会吐出猎物进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	guts: {
		name: "毅力",
		// Official flavor text: "如果变为异常状态， 会拿出毅力， 攻击会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hadronengine: {
		name: "强子引擎",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}布下电气场地使未来的机关跃动起来！！",
		activate: "  {POKEMON}用电气场地使未来的机关跃动起来！！",
	},
	harvest: {
		name: "收获",
		// Official flavor text: "可以多次制作出 已被使用掉的树果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		addItem: "  {POKEMON}收获了{ITEM}！",
	},
	healer: {
		name: "治愈之心",
		// Official flavor text: "有时会治愈异常状态的同伴。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	heatproof: {
		name: "耐热",
		// Official flavor text: "耐热的体质会 让火属性的招式威力减半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	heavymetal: {
		name: "重金属",
		// Official flavor text: "自身的重量会变为２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	honeygather: {
		name: "采蜜",
		shortDesc: null, // NEEDS TRANSLATION
	},
	hospitality: {
		name: "款待",
		shortDesc: null, // NEEDS TRANSLATION

		heal: "  {POKEMON}喝光了{SOURCE}泡的茶！",
	},
	hugepower: {
		name: "大力士",
		shortDesc: null, // NEEDS TRANSLATION
	},
	hungerswitch: {
		name: "饱了又饿",
		// Official flavor text: "每回合结束时会在 满腹花纹与空腹花纹之间 交替改变样子。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hustle: {
		name: "活力",
		// Official flavor text: "自己的攻击变高， 但命中率会降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hydration: {
		name: "湿润之躯",
		// Official flavor text: "下雨天气时， 异常状态会治愈。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	hypercutter: {
		name: "怪力钳",
		shortDesc: null, // NEEDS TRANSLATION
	},
	icebody: {
		name: "冰冻之躯",
		// Official flavor text: "冰雹天气时， 会缓缓回复ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	iceface: {
		name: "结冻头",
		// Official flavor text: "头部的冰会代替自己承受 物理攻击，但是样子会改变。 下冰雹时，冰会恢复原状。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	icescales: {
		name: "冰鳞粉",
		shortDesc: null, // NEEDS TRANSLATION
	},
	illuminate: {
		name: "发光",
		// Official flavor text: "通过让周围变亮， 变得容易遇到野生的宝可梦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	illusion: {
		name: "幻觉",
		// Official flavor text: "假扮成同行队伍中的 最后一只宝可梦出场， 迷惑对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		end: "  {POKEMON}造成的幻觉解除了！",
	},
	immunity: {
		name: "免疫",
		shortDesc: null, // NEEDS TRANSLATION
	},
	imposter: {
		name: "变身者",
		// Official flavor text: "变身为当前面对的宝可梦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	infiltrator: {
		name: "穿透",
		// Official flavor text: "可以穿透对手的壁障 或替身进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	innardsout: {
		name: "飞出的内在物",
		// Official flavor text: "被对手打倒的时候， 会给予对手相当于 ＨＰ剩余量的伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		damage: "#aftermath",
	},
	innerfocus: {
		name: "精神力",
		// Official flavor text: "拥有经过锻炼的精神， 而不会因对手的攻击而畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	insomnia: {
		name: "不眠",
		shortDesc: null, // NEEDS TRANSLATION
	},
	intimidate: {
		name: "威吓",
		// Official flavor text: "出场时威吓对手， 让其退缩， 降低对手的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	intrepidsword: {
		name: "不挠之剑",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	ironbarbs: {
		name: "铁刺",
		// Official flavor text: "用铁刺给予接触到自己的 对手伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		damage: "#roughskin",
	},
	ironfist: {
		name: "铁拳",
		// Official flavor text: "使用拳类招式的威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	justified: {
		name: "正义之心",
		shortDesc: null, // NEEDS TRANSLATION
	},
	keeneye: {
		name: "锐利目光",
		// Official flavor text: "多亏了锐利的目光， 命中率不会被降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	klutz: {
		name: "笨拙",
		// Official flavor text: "无法使用持有的道具。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	leafguard: {
		name: "叶子防守",
		// Official flavor text: "晴朗天气时， 不会变为异常状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	levitate: {
		name: "飘浮",
		// Official flavor text: "从地面浮起， 从而不会受到地面属性招式的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	libero: {
		name: "自由者",
		// Official flavor text: "变为与自己使出的招式 相同的属性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	lightmetal: {
		name: "轻金属",
		// Official flavor text: "自身的重量会减半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lightningrod: {
		name: "避雷针",
		// Official flavor text: "将电属性的招式吸引到自己身上， 不会受到伤害，而是会提高特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		activate: "  {POKEMON}吸引了攻击！",
	},
	limber: {
		name: "柔软",
		shortDesc: null, // NEEDS TRANSLATION
	},
	lingeringaroma: {
		name: "甩不掉的气味",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},

		changeAbility: "  {TARGET}沾上了味道且挥之不去！",
	},
	liquidooze: {
		name: "污泥浆",
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		damage: "  {POKEMON}吸到了污泥浆！",
	},
	liquidvoice: {
		name: "湿润之声",
		// Official flavor text: "所有的声音招式 都变为水属性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	longreach: {
		name: "远隔",
		shortDesc: null, // NEEDS TRANSLATION
	},
	magicbounce: {
		name: "魔法镜",
		// Official flavor text: "可以不受到由对手使出的 变化招式影响，并将其反弹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		move: "#magiccoat",
	},
	magicguard: {
		name: "魔法防守",
		// Official flavor text: "不会受到攻击以外的伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	magician: {
		name: "魔术师",
		// Official flavor text: "夺走被自己的招式 击中的对手的道具。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	magmaarmor: {
		name: "熔岩铠甲",
		shortDesc: null, // NEEDS TRANSLATION
	},
	magnetpull: {
		name: "磁力",
		// Official flavor text: "用磁力吸住钢属性的宝可梦， 使其无法逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	marvelscale: {
		name: "神奇鳞片",
		shortDesc: null, // NEEDS TRANSLATION
	},
	megalauncher: {
		name: "超级发射器",
		// Official flavor text: "波动和波导类招式的 威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	megasol: {
		name: "超级日光",
		shortDesc: null, // NEEDS TRANSLATION
	},
	merciless: {
		name: "不仁不义",
		shortDesc: null, // NEEDS TRANSLATION
	},
	mimicry: {
		name: "拟态",
		// Official flavor text: "宝可梦的属性会根据 场地的状态而变化。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}变回了原来的属性！",
	},
	mindseye: {
		name: "心眼",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	minus: {
		name: "负电",
		// Official flavor text: "出场的伙伴之间 如果有正电或负电特性的宝可梦， 自己的特攻会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	mirrorarmor: {
		name: "镜甲",
		// Official flavor text: "只反弹自己受到的 能力降低效果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mistysurge: {
		name: "薄雾制造者",
		shortDesc: null, // NEEDS TRANSLATION
	},
	moldbreaker: {
		name: "破格",
		// Official flavor text: "可以不受对手特性的干扰， 向对手使出招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}打破了常规！",
	},
	moody: {
		name: "心情不定",
		// Official flavor text: "每一回合，能力中的某项 会大幅提高，而某项会降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	motordrive: {
		name: "电气引擎",
		// Official flavor text: "受到电属性的招式攻击时， 不会受到伤害，而是速度会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	moxie: {
		name: "自信过度",
		// Official flavor text: "如果打倒对手， 就会充满自信，攻击会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	multiscale: {
		name: "多重鳞片",
		shortDesc: null, // NEEDS TRANSLATION
	},
	multitype: {
		name: "多属性",
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen6: {
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	mummy: {
		name: "木乃伊",
		// Official flavor text: "被对手接触到后， 会将对手变为木乃伊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		changeAbility: "  {TARGET}的特性变成了木乃伊！",
	},
	myceliummight: {
		name: "菌丝之力",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	naturalcure: {
		name: "自然回复",
		shortDesc: null, // NEEDS TRANSLATION

		activate: null, // NEEDS TRANSLATION
	},
	neuroforce: {
		name: "脑核之力",
		// Official flavor text: "效果绝佳的攻击， 威力会变得更强。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	neutralizinggas: {
		name: "化学变化气体",
		// Official flavor text: "特性为化学变化气体的宝可梦在场时， 场上所有宝可梦的 特性效果都会消失或者无法生效。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  周围充满了化学变化气体！",
		end: "  化学变化气体的效果消失了！",
	},
	noguard: {
		name: "无防守",
		shortDesc: null, // NEEDS TRANSLATION
	},
	normalize: {
		name: "一般皮肤",
		// Official flavor text: "无论是什么属性的招式， 全部会变为一般属性。 威力会少量提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	oblivious: {
		name: "迟钝",
		// Official flavor text: "因为感觉迟钝， 不会变为着迷和被挑衅状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	opportunist: {
		name: "跟风",
		shortDesc: null, // NEEDS TRANSLATION
	},
	orichalcumpulse: {
		name: "绯红脉动",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}令日照变强，激起了古代的脉动！",
		activate: "  {POKEMON}受到日照而激起了古代的脉动！！",
	},
	overcoat: {
		name: "防尘",
		// Official flavor text: "不会受到沙暴或冰雹等的伤害。 不会受到粉末类招式的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	overgrow: {
		name: "茂盛",
		// Official flavor text: "ＨＰ减少的时候， 草属性的招式威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	owntempo: {
		name: "我行我素",
		// Official flavor text: "因为我行我素， 不会变为混乱状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	parentalbond: {
		name: "亲子爱",
		// Official flavor text: "亲子俩可以合计攻击２次。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	pastelveil: {
		name: "粉彩护幕",
		// Official flavor text: "自己和同伴都不会 陷入中毒的异常状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	perishbody: {
		name: "灭亡之躯",
		// Official flavor text: "受到接触类招式攻击时， 双方都会在３回合后变为濒死状态。 替换后效果消失。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  双方将在３回合后灭亡！",
	},
	pickpocket: {
		name: "顺手牵羊",
		// Official flavor text: "盗取接触到自己的 对手的道具。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pickup: {
		name: "捡拾",
		// Official flavor text: "有时会捡来对手用过的道具， 冒险过程中也会捡到。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		addItem: "#recycle",
	},
	piercingdrill: {
		name: "贯穿钻",
		shortDesc: null, // NEEDS TRANSLATION
	},
	pixilate: {
		name: "妖精皮肤",
		// Official flavor text: "一般属性的招式 会变为妖精属性。 威力会少量提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	plus: {
		name: "正电",
		// Official flavor text: "出场的伙伴之间 如果有正电或负电特性的宝可梦， 自己的特攻会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	poisonheal: {
		name: "毒疗",
		// Official flavor text: "变为中毒状态时， ＨＰ不会减少，反而会增加起来。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	poisonpoint: {
		name: "毒刺",
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	poisonpuppeteer: {
		name: "毒傀儡",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	poisontouch: {
		name: "毒手",
		// Official flavor text: "只通过接触就有可能 让对手变为中毒状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	powerconstruct: {
		name: "群聚变形",
		// Official flavor text: "ＨＰ变为一半时， 细胞们会赶来支援， 变为完全体形态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  你感受到了大量的气息……！",
		transform: "{POKEMON}变成了完全体形态！",
	},
	powerofalchemy: {
		name: "化学之力",
		// Official flavor text: "继承被打倒的同伴的特性， 变为相同的特性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},

		changeAbility: "#receiver",
	},
	powerspot: {
		name: "能量点",
		// Official flavor text: "只要处在相邻位置， 招式的威力就会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	prankster: {
		name: "恶作剧之心",
		// Official flavor text: "可以率先使出变化招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	pressure: {
		name: "压迫感",
		// Official flavor text: "给予对手压迫感， 大量减少其使用招式的ＰＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  从{POKEMON}的身上感到了一种压迫感！",
	},
	primordialsea: {
		name: "始源之海",
		// Official flavor text: "变为不会受到 火属性攻击的天气。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	prismarmor: {
		name: "棱镜装甲",
		shortDesc: null, // NEEDS TRANSLATION
	},
	propellertail: {
		name: "螺旋尾鳍",
		shortDesc: null, // NEEDS TRANSLATION
	},
	protean: {
		name: "变幻自如",
		// Official flavor text: "变为与自己使出的招式 相同的属性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	protosynthesis: {
		name: "古代活性",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}通过大晴天发动了古代活性！",
		activateFromItem: "  {POKEMON}通过驱劲能量发动了古代活性！",
		start: "  {POKEMON}的{STAT}升高了！",
		end: "  {POKEMON}古代活性的效果消失了！",
	},
	psychicsurge: {
		name: "精神制造者",
		shortDesc: null, // NEEDS TRANSLATION
	},
	punkrock: {
		name: "庞克摇滚",
		// Official flavor text: "声音招式的威力会提高。 受到的声音招式伤害会减半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	purepower: {
		name: "瑜伽之力",
		shortDesc: null, // NEEDS TRANSLATION
	},
	purifyingsalt: {
		name: "洁净之盐",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	quarkdrive: {
		name: "夸克充能",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}通过电气场地发动了夸克充能！",
		activateFromItem: "  {POKEMON}通过驱劲能量发动了夸克充能！",
		start: "  {POKEMON}的{STAT}升高了！",
		end: "  {POKEMON}夸克充能的效果消失了！",
	},
	queenlymajesty: {
		name: "女王的威严",
		// Official flavor text: "向对手施加威慑力， 使其无法对我方使出先制招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		block: "#damp",
	},
	quickdraw: {
		name: "速击",
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  速击使{POKEMON}行动变快了！",
	},
	quickfeet: {
		name: "飞毛腿",
		// Official flavor text: "变为异常状态时， 速度会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	raindish: {
		name: "雨盘",
		// Official flavor text: "下雨天气时， 会缓缓回复ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	rattled: {
		name: "胆怯",
		// Official flavor text: "受到恶属性、幽灵属性 和虫属性的招式攻击时， 会因胆怯而速度提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	receiver: {
		name: "接球手",
		// Official flavor text: "继承被打倒的同伴的特性， 变为相同的特性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},

		changeAbility: "  继承了{SOURCE}的{ABILITY}！",
	},
	reckless: {
		name: "舍身",
		// Official flavor text: "自己会因反作用力受伤的招式， 其威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	refrigerate: {
		name: "冰冻皮肤",
		// Official flavor text: "一般属性的招式 会变为冰属性。 威力会少量提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	regenerator: {
		name: "再生力",
		shortDesc: null, // NEEDS TRANSLATION
	},
	ripen: {
		name: "熟成",
		// Official flavor text: "使树果成熟， 效果变为２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rivalry: {
		name: "斗争心",
		// Official flavor text: "面对性别相同的对手， 会燃起斗争心，变得更强。 而面对性别不同的，则会变弱。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rkssystem: {
		name: "ＡＲ系统",
		shortDesc: null, // NEEDS TRANSLATION
	},
	rockhead: {
		name: "坚硬脑袋",
		// Official flavor text: "即使使出会受反作用力伤害的招式， ＨＰ也不会减少。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	rockypayload: {
		name: "搬岩",
		shortDesc: null, // NEEDS TRANSLATION
	},
	roughskin: {
		name: "粗糙皮肤",
		// Official flavor text: "受到攻击时， 用粗糙的皮肤弄伤 接触到自己的对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		damage: "  {POKEMON}受到了伤害！",
	},
	runaway: {
		name: "逃跑",
		shortDesc: null, // NEEDS TRANSLATION
	},
	sandforce: {
		name: "沙之力",
		// Official flavor text: "沙暴天气时， 岩石属性、地面属性 和钢属性的招式威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sandrush: {
		name: "拨沙",
		// Official flavor text: "沙暴天气时， 速度会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sandspit: {
		name: "吐沙",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	sandstream: {
		name: "扬沙",
		shortDesc: null, // NEEDS TRANSLATION
	},
	sandveil: {
		name: "沙隐",
		// Official flavor text: "在沙暴的时候， 闪避率会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sapsipper: {
		name: "食草",
		// Official flavor text: "受到草属性的招式攻击时， 不会受到伤害，而是攻击会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	schooling: {
		name: "鱼群",
		// Official flavor text: "ＨＰ多的时候会聚起来变强。 ＨＰ剩余量变少时， 群体会分崩离析。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		transform: "{POKEMON}一群群地聚集起来了！",
		transformEnd: "{POKEMON}一群群地四散而去了！",
	},
	scrappy: {
		name: "胆量",
		// Official flavor text: "一般属性和格斗属性的招式 可以击中幽灵属性的宝可梦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	screencleaner: {
		name: "除障",
		shortDesc: null, // NEEDS TRANSLATION
	},
	seedsower: {
		name: "掉出种子",
		shortDesc: null, // NEEDS TRANSLATION
	},
	serenegrace: {
		name: "天恩",
		// Official flavor text: "托天恩的福， 招式的追加效果容易出现。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	shadowshield: {
		name: "幻影防守",
		shortDesc: null, // NEEDS TRANSLATION
	},
	shadowtag: {
		name: "踩影",
		// Official flavor text: "踩住对手的影子 使其无法逃走或替换。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	sharpness: {
		name: "锋锐",
		shortDesc: null, // NEEDS TRANSLATION
	},
	shedskin: {
		name: "蜕皮",
		// Official flavor text: "通过蜕去身上的皮， 有时会治愈异常状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sheerforce: {
		name: "强行",
		// Official flavor text: "招式的追加效果消失， 但因此能以更高的威力使出招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	shellarmor: {
		name: "硬壳盔甲",
		shortDesc: null, // NEEDS TRANSLATION
	},
	shielddust: {
		name: "鳞粉",
		// Official flavor text: "被鳞粉守护着， 不会受到招式的追加效果影响。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	shieldsdown: {
		name: "界限盾壳",
		// Official flavor text: "ＨＰ变为一半时， 壳会坏掉，变得有攻击性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		transform: "界限盾壳启动！",
		transformEnd: "界限盾壳解除！",
	},
	simple: {
		name: "单纯",
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	skilllink: {
		name: "连续攻击",
		// Official flavor text: "如果使用连续招式， 总是能使出最高次数。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	slowstart: {
		name: "慢启动",
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}无法拿出平时的水平！",
		end: "  {POKEMON}恢复了平时的水平！",
	},
	slushrush: {
		name: "拨雪",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	sniper: {
		name: "狙击手",
		shortDesc: null, // NEEDS TRANSLATION
	},
	snowcloak: {
		name: "雪隐",
		// Official flavor text: "冰雹天气时， 闪避率会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	snowwarning: {
		name: "降雪",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	solarpower: {
		name: "太阳之力",
		// Official flavor text: "晴朗天气时， 特攻会提高， 而每回合ＨＰ会减少。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	solidrock: {
		name: "坚硬岩石",
		shortDesc: null, // NEEDS TRANSLATION
	},
	soulheart: {
		name: "魂心",
		shortDesc: null, // NEEDS TRANSLATION
	},
	soundproof: {
		name: "隔音",
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen5: {
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	speedboost: {
		name: "加速",
		// Official flavor text: "每一回合速度会变快。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	spicyspray: {
		name: "辣椒喷发",
		shortDesc: null, // NEEDS TRANSLATION
	},
	stakeout: {
		name: "蹲守",
		shortDesc: null, // NEEDS TRANSLATION
	},
	stall: {
		name: "慢出",
		shortDesc: null, // NEEDS TRANSLATION
	},
	stalwart: {
		name: "坚毅",
		shortDesc: null, // NEEDS TRANSLATION
	},
	stamina: {
		name: "持久力",
		shortDesc: null, // NEEDS TRANSLATION
	},
	stancechange: {
		name: "战斗切换",
		// Official flavor text: "如果使出攻击招式，会变为刀剑形态， 如果使出招式“王者盾牌”， 会变为盾牌形态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		transform: "刀剑形态，变形！",
		transformEnd: "盾牌形态，变形！",
	},
	static: {
		name: "静电",
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	steadfast: {
		name: "不屈之心",
		shortDesc: null, // NEEDS TRANSLATION
	},
	steamengine: {
		name: "蒸汽机",
		// Official flavor text: "受到水属性或 火属性的招式攻击时， 速度会巨幅提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	steelworker: {
		name: "钢能力者",
		shortDesc: null, // NEEDS TRANSLATION
	},
	steelyspirit: {
		name: "钢之意志",
		// Official flavor text: "我方的钢属性 攻击威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stench: {
		name: "恶臭",
		// Official flavor text: "通过释放臭臭的气味， 在攻击的时候， 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	stickyhold: {
		name: "黏着",
		// Official flavor text: "因为道具是粘在黏性身体上的， 所以不会被对手夺走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		block: "  无法夺取{POKEMON}的道具！",
	},
	stormdrain: {
		name: "引水",
		// Official flavor text: "将水属性的招式引到自己身上， 不会受到伤害，而是会提高特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		activate: "#lightningrod",
	},
	strongjaw: {
		name: "强壮之颚",
		// Official flavor text: "因为颚部强壮， 啃咬类招式的威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sturdy: {
		name: "结实",
		// Official flavor text: "即使受到对手的招式攻击， 也不会被一击打倒。 一击必杀的招式也没有效果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		activate: "  {POKEMON}挺住了攻击！",
	},
	suctioncups: {
		name: "吸盘",
		shortDesc: null, // NEEDS TRANSLATION

		block: "  {POKEMON}用吸盘吸住了！",
	},
	superluck: {
		name: "超幸运",
		shortDesc: null, // NEEDS TRANSLATION
	},
	supersweetsyrup: {
		name: "甘露之蜜",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}的蜜散发出了甜甜香气！",
	},
	supremeoverlord: {
		name: "大将",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}从被打倒的同伴身上得到力量了！",
	},
	surgesurfer: {
		name: "冲浪之尾",
		shortDesc: null, // NEEDS TRANSLATION
	},
	swarm: {
		name: "虫之预感",
		// Official flavor text: "ＨＰ减少的时候， 虫属性的招式威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	sweetveil: {
		name: "甜幕",
		// Official flavor text: "我方的宝可梦 不会变为睡眠状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		block: "  {POKEMON}因甜幕而不会睡着！",
	},
	swiftswim: {
		name: "悠游自如",
		// Official flavor text: "下雨天气时， 速度会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	swordofruin: {
		name: "灾祸之剑",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}的灾祸之剑令周围的宝可梦的防御减弱了！",
	},
	symbiosis: {
		name: "共生",
		// Official flavor text: "同伴使用道具时， 会把自己持有的道具传递给同伴。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  {POKEMON}将{ITEM}交给了{TARGET}！",
	},
	synchronize: {
		name: "同步",
		// Official flavor text: "将自己的中毒、麻痹 或灼伤状态传染给对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	tabletsofruin: {
		name: "灾祸之简",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}的灾祸之简令周围的宝可梦的攻击减弱了！",
	},
	tangledfeet: {
		name: "蹒跚",
		shortDesc: null, // NEEDS TRANSLATION
	},
	tanglinghair: {
		name: "卷发",
		shortDesc: null, // NEEDS TRANSLATION
	},
	technician: {
		name: "技术高手",
		// Official flavor text: "攻击时可以将 低威力招式的威力提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	telepathy: {
		name: "心灵感应",
		shortDesc: null, // NEEDS TRANSLATION

		block: "  {POKEMON}不会受到同伴的攻击！",
	},
	teraformzero: {
		name: "归零化境",
		shortDesc: null, // NEEDS TRANSLATION
	},
	terashell: {
		name: "太晶甲壳",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}让甲壳发出光辉，使属性相克发生扭曲！！",
	},
	terashift: {
		name: "太晶变形",
		shortDesc: null, // NEEDS TRANSLATION

		transform: "{POKEMON}的样子发生了变化！",
	},
	teravolt: {
		name: "兆级电压",
		// Official flavor text: "可以不受对手特性的干扰， 向对手使出招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}正在释放溅射气场！",
	},
	thermalexchange: {
		name: "热交换",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thickfat: {
		name: "厚脂肪",
		// Official flavor text: "因为被厚厚的脂肪保护着， 会让火属性和冰属性的招式伤害减半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	tintedlens: {
		name: "有色眼镜",
		shortDesc: null, // NEEDS TRANSLATION
	},
	torrent: {
		name: "激流",
		// Official flavor text: "ＨＰ减少的时候， 水属性的招式威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	toughclaws: {
		name: "硬爪",
		shortDesc: null, // NEEDS TRANSLATION
	},
	toxicboost: {
		name: "中毒激升",
		// Official flavor text: "变为中毒状态时， 物理招式的威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	toxicchain: {
		name: "毒锁链",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	toxicdebris: {
		name: "毒满地",
		shortDesc: null, // NEEDS TRANSLATION
	},
	trace: {
		name: "复制",
		// Official flavor text: "出场时，复制对手的特性， 变为与之相同的特性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},

		changeAbility: "  复制了{SOURCE}的{ABILITY}！",
	},
	transistor: {
		name: "电晶体",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	triage: {
		name: "先行治疗",
		shortDesc: null, // NEEDS TRANSLATION
	},
	truant: {
		name: "懒惰",
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},

		cant: "{POKEMON}正在偷懒。",
	},
	turboblaze: {
		name: "涡轮火焰",
		// Official flavor text: "可以不受对手特性的干扰， 向对手使出招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}正在释放炽焰气场！",
	},
	unaware: {
		name: "纯朴",
		// Official flavor text: "可以无视对手能力的变化， 进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	unburden: {
		name: "轻装",
		// Official flavor text: "失去所持有的道具时， 速度会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	unnerve: {
		name: "紧张感",
		// Official flavor text: "让对手紧张， 使其无法食用树果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {TEAM}因太紧张而无法食用树果！",
	},
	unseenfist: {
		name: "无形拳",
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	vesselofruin: {
		name: "灾祸之鼎",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}的灾祸之鼎令周围的宝可梦的特攻减弱了！",
	},
	victorystar: {
		name: "胜利之星",
		shortDesc: null, // NEEDS TRANSLATION
	},
	vitalspirit: {
		name: "干劲",
		shortDesc: null, // NEEDS TRANSLATION
	},
	voltabsorb: {
		name: "蓄电",
		// Official flavor text: "受到电属性的招式攻击时， 不会受到伤害，而是会回复。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	wanderingspirit: {
		name: "游魂",
		// Official flavor text: "与使用接触类招式 攻击自己的宝可梦互换特性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "#skillswap",
	},
	waterabsorb: {
		name: "储水",
		// Official flavor text: "受到水属性的招式攻击时， 不会受到伤害，而是会回复。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	waterbubble: {
		name: "水泡",
		// Official flavor text: "降低自己受到的火属性 招式的威力，不会灼伤。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	watercompaction: {
		name: "遇水凝固",
		shortDesc: null, // NEEDS TRANSLATION
	},
	waterveil: {
		name: "水幕",
		shortDesc: null, // NEEDS TRANSLATION
	},
	weakarmor: {
		name: "碎裂铠甲",
		// Official flavor text: "如果因物理招式受到伤害， 防御会降低， 速度会大幅提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	wellbakedbody: {
		name: "焦香之躯",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	whitesmoke: {
		name: "白色烟雾",
		shortDesc: null, // NEEDS TRANSLATION
	},
	wimpout: {
		name: "跃跃欲逃",
		// Official flavor text: "ＨＰ变为一半时， 会慌慌张张逃走， 退回同行队伍中。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	windpower: {
		name: "风力发电",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "#electromorphosis",
	},
	windrider: {
		name: "乘风",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	wonderguard: {
		name: "神奇守护",
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	wonderskin: {
		name: "奇迹皮肤",
		// Official flavor text: "成为不易受到变化招式 攻击的身体。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	zenmode: {
		name: "达摩模式",
		// Official flavor text: "ＨＰ变为一半以下时， 样子会改变。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		transform: "达摩模式，启动！",
		transformEnd: "达摩模式，解除！",
	},
	zerotohero: {
		name: "全能变身",
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}变身后归来了！",
	},

	// CAP
	mountaineer: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: null, // NEEDS TRANSLATION
	},
	rebound: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		move: "#magiccoat",
	},
	persistent: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: null, // NEEDS TRANSLATION
	},
};
