export const AbilitiesText: { [id: IDEntry]: AbilityText } = {
	noability: {
		name: "无特性", // NEEDS QC
		shortDesc: "没有任何效果。", // NEEDS QC
	},
	adaptability: {
		name: "适应力",
		// Official flavor text: "与自身同属性的招式 威力会提高。"
		desc: "该宝可梦与自身属性一致的招式的属性一致加成（STAB）由1.5倍变为2倍。", // NEEDS QC
		shortDesc: "属性一致加成由1.5倍变为2倍。", // NEEDS QC
	},
	aerilate: {
		name: "飞行皮肤",
		// Official flavor text: "一般属性的招式 会变为飞行属性。 威力会少量提高。"
		desc: "该宝可梦的一般属性招式变为飞行属性，威力变为1.2倍。此效果在其他改变招式属性的效果之后、等离子浴和输电的效果之前适用。", // NEEDS QC
		shortDesc: "一般属性招式变为飞行属性，威力1.2倍。", // NEEDS QC
		gen6: {
			desc: "该宝可梦的一般属性招式变为飞行属性，威力变为1.3倍。此效果在其他改变招式属性的效果之后、等离子浴和输电的效果之前适用。", // NEEDS QC
			shortDesc: "该宝可梦的一般属性招式变为飞行属性，威力1.3倍。", // NEEDS QC
		},
	},
	aftermath: {
		name: "引爆",
		// Official flavor text: "变为濒死时， 会对接触到自己的对手造成伤害。"
		desc: "该宝可梦因接触类招式濒死时，攻击方失去最大HP的1/4（向下取整）。若攻击方的特性为魔法防守，或场上有特性为湿气的宝可梦，则此效果不会发动。", // NEEDS QC
		shortDesc: "因接触类招式濒死时，攻击方失去最大HP的1/4。", // NEEDS QC

		damage: "  {POKEMON}受到了伤害！",
	},
	airlock: {
		name: "气闸",
		shortDesc: "在场时，天气的效果消失。", // NEEDS QC

		start: "  天气的影响消失了！",
	},
	analytic: {
		name: "分析",
		// Official flavor text: "如果在最后使出招式， 招式的威力会提高。"
		desc: "若该宝可梦在一回合中最后行动，其招式威力变为1.3倍。对破灭之愿和预知未来无效。", // NEEDS QC
		shortDesc: "在回合中最后行动时，招式威力变为1.3倍。", // NEEDS QC
	},
	angerpoint: {
		name: "愤怒穴位",
		// Official flavor text: "要害被击中时， 会大发雷霆， 攻击力变为最大。"
		desc: "该宝可梦（而非其替身）被击中要害时，攻击提高12级。", // NEEDS QC
		shortDesc: "（替身以外）被击中要害时，攻击提高12级。", // NEEDS QC
		gen4: {
			desc: "该宝可梦或其替身被击中要害时，攻击提高12级。", // NEEDS QC
			shortDesc: "该宝可梦或其替身被击中要害时，攻击提高12级。", // NEEDS QC
		},

		boost: "  {POKEMON}的攻击被提高到了最大！",
	},
	angershell: {
		name: "愤怒甲壳",
		desc: "该宝可梦的HP高于最大HP的1/2、且受到攻击伤害后降至1/2或以下时，其攻击、特攻、速度各提高1级，防御、特防各降低1级。此效果在连续攻击招式的所有攻击结束后判定。若招式的追加效果被特性强行消除，则此效果不会发动。", // NEEDS QC
		shortDesc: "HP变为1/2以下时，攻击、特攻、速度+1，防御、特防-1。", // NEEDS QC
	},
	anticipation: {
		name: "危险预知",
		// Official flavor text: "可以察觉到 对手拥有的危险招式。"
		desc: "出场时，若对手拥有对该宝可梦效果绝佳的攻击招式或一击必杀招式，该宝可梦会感到战栗。觉醒力量按其实际属性判定，其他招式按原本属性判定。", // NEEDS QC
		shortDesc: "出场时，对手有效果绝佳或一击必杀招式则会战栗。", // NEEDS QC
		gen5: {
			desc: "出场时，若对手宝可梦拥有对该宝可梦效果绝佳的攻击招式或一击必杀招式，会颤抖示警。招式按其原本属性判定。", // NEEDS QC
		},
		gen4: {
			desc: "出场时，若对手宝可梦拥有对该宝可梦效果绝佳的攻击招式，或拥有对该宝可梦并非无效的一击必杀招式且等级不低于该宝可梦，会颤抖示警。招式按其原本属性判定。双倍奉还、龙之怒、金属爆炸、镜面反射、黑夜魔影、精神波、地球上投不会触发此效果。判定条件前，会考虑该宝可梦是否携带黑色铁球、是否处于识破（气味侦测）、重力、扎根、奇迹之眼、羽栖的效果下，以及对手的特性是否为一般皮肤或胆量。", // NEEDS QC
		},

		activate: "  {POKEMON}发抖了！",
	},
	arenatrap: {
		name: "沙穴",
		// Official flavor text: "在战斗中让对手无法逃走。"
		desc: "使对手无法选择交换。不在地面上的宝可梦、携带美丽空壳的宝可梦和幽灵属性宝可梦除外。", // NEEDS QC
		shortDesc: "使地面上的对手无法交换。", // NEEDS QC
		gen6: {
			desc: "使相邻的对手无法选择交换。不在地面上的宝可梦、携带美丽空壳的宝可梦和幽灵属性宝可梦除外。", // NEEDS QC
		},
		gen5: {
			desc: "使相邻的对手无法选择交换。不在地面上的宝可梦和携带美丽空壳的宝可梦除外。", // NEEDS QC
		},
		gen4: {
			desc: "使对手无法选择交换。不在地面上的宝可梦和携带美丽空壳的宝可梦除外。", // NEEDS QC
		},
		gen3: {
			desc: "使对手无法选择交换。不在地面上的宝可梦除外。", // NEEDS QC
		},
	},
	armortail: {
		name: "尾甲",
		desc: "对手使用的以该宝可梦或其队友为目标的先制招式无法生效。", // NEEDS QC
		shortDesc: "使对手指向己方的先制招式无效。", // NEEDS QC

		block: "#damp",
	},
	aromaveil: {
		name: "芳香幕",
		// Official flavor text: "可以防住向自己和同伴 发出的心灵攻击。"
		desc: "该宝可梦及其队友不会受到迷人、定身法、再来一次、回复封锁、挑衅、无理取闹的影响。", // NEEDS QC
		shortDesc: "保护己方不受着迷、再来一次、挑衅等影响。", // NEEDS QC

		block: "  {POKEMON}正受到芳香幕的保护！",
	},
	asone: {
		name: "人马一体",
		shortDesc: "参见人马一体（雪暴马/灵幽马）。", // NEEDS QC

		start: "  {POKEMON}同时拥有了两种特性！",
	},
	asoneglastrier: {
		name: "人马一体（雪暴马）", // PS-style disambiguator (not part of the official name)
		shortDesc: "紧张感和苍白嘶鸣的组合。", // NEEDS QC
	},
	asonespectrier: {
		name: "人马一体（灵幽马）", // PS-style disambiguator (not part of the official name)
		shortDesc: "紧张感和漆黑嘶鸣的组合。", // NEEDS QC
	},
	aurabreak: {
		name: "气场破坏",
		// Official flavor text: "让气场的效果发生逆转， 降低威力。"
		desc: "该宝可梦在场时，暗黑气场和妖精气场的效果反转，恶属性和妖精属性招式的威力分别变为3/4而非1.33倍。", // NEEDS QC
		shortDesc: "暗黑气场、妖精气场的加成变为0.75倍。", // NEEDS QC

		start: "  {POKEMON}压制了所有气场！",
	},
	auraguard: {
		name: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	baddreams: {
		name: "梦魇",
		// Official flavor text: "给予睡眠状态的对手伤害。"
		desc: "每回合结束时，处于睡眠状态的对手失去最大HP的1/8（向下取整）。", // NEEDS QC
		shortDesc: "睡眠状态的对手每回合失去最大HP的1/8。", // NEEDS QC
		gen6: {
			desc: "每回合结束时，处于睡眠状态的相邻对手宝可梦失去最大HP的1/8（向下取整）。", // NEEDS QC
			shortDesc: "每回合结束时，睡眠中的相邻对手失去最大HP的1/8。", // NEEDS QC
		},
		gen4: {
			desc: "每回合结束时，处于睡眠状态的对手失去最大HP的1/8（向下取整）。", // NEEDS QC
			shortDesc: "睡眠状态的对手每回合失去最大HP的1/8。", // NEEDS QC
		},

		damage: "  {POKEMON}正被恶梦缠身！",
	},
	ballfetch: {
		name: "捡球",
		shortDesc: "没有对战效果。", // NEEDS QC
	},
	battery: {
		name: "蓄电池",
		shortDesc: "队友的特殊招式威力变为1.3倍。", // NEEDS QC
	},
	battlearmor: {
		name: "战斗盔甲",
		shortDesc: "不会被击中要害。", // NEEDS QC
	},
	battlebond: {
		name: "牵绊变身",
		// Official flavor text: "打倒对手时，与训练家的牵绊会增强， 变为小智版甲贺忍蛙。 飞水手里剑的招式威力会增强。"
		desc: "若该宝可梦是甲贺忍蛙，其使其他宝可梦濒死时，攻击、特攻、速度各提高1级。此效果每场战斗只能发动1次。", // NEEDS QC
		shortDesc: "打倒对手后攻击、特攻、速度+1。每场战斗1次。", // NEEDS QC
		gen8: {
			desc: "该宝可梦是甲贺忍蛙时，用攻击打倒其他宝可梦后变为小智版甲贺忍蛙。小智版甲贺忍蛙的飞水手里剑威力为20且必定攻击3次。", // NEEDS QC
			shortDesc: "打倒对手后变为小智版甲贺忍蛙。飞水手里剑：威力20，攻击3次。", // NEEDS QC
		},
		activate: "  {POKEMON}浑身充满了牵绊之力！",
		transform: "{POKEMON}变身成了小智版甲贺忍蛙！",
	},
	beadsofruin: {
		name: "灾祸之玉",
		shortDesc: "场上不具此特性的宝可梦特防变为0.75倍。", // NEEDS QC

		start: "  {POKEMON}的灾祸之玉令周围的宝可梦的特防减弱了！",
	},
	beastboost: {
		name: "异兽提升",
		// Official flavor text: "打倒对手的时候， 自己最高的那项能力会提高。"
		desc: "该宝可梦使其他宝可梦濒死时，其数值最高的能力提高1级。此判定不考虑能力等级变化。若多项能力相同，按攻击、防御、特攻、特防、速度的顺序优先。", // NEEDS QC
		shortDesc: "打倒对手后，数值最高的能力提高1级。", // NEEDS QC
	},
	berserk: {
		name: "怒火冲天",
		// Official flavor text: "因对手的攻击 ＨＰ变为一半时， 特攻会提高。"
		desc: "该宝可梦的HP高于最大HP的1/2、且受到攻击伤害后降至1/2或以下时，其特攻提高1级。此效果在连续攻击招式的所有攻击结束后判定。若招式的追加效果被特性强行消除，则此效果不会发动。", // NEEDS QC
		shortDesc: "HP变为1/2以下时，特攻提高1级。", // NEEDS QC
	},
	bigpecks: {
		name: "健壮胸肌",
		shortDesc: "防御不会被其他宝可梦降低。", // NEEDS QC
	},
	blaze: {
		name: "猛火",
		// Official flavor text: "ＨＰ减少的时候， 火属性的招式威力会提高。"
		desc: "该宝可梦的HP为最大HP的1/3（向下取整）或以下时，其使用火属性攻击时进攻能力变为1.5倍。", // NEEDS QC
		shortDesc: "HP为1/3以下时，火属性攻击的进攻能力变为1.5倍。", // NEEDS QC
		gen4: {
			desc: "该宝可梦的HP为最大HP的1/3（向下取整）以下时，其火属性攻击招式的威力变为1.5倍。", // NEEDS QC
			shortDesc: "HP为1/3以下时，火属性攻击的威力变为1.5倍。", // NEEDS QC
		},
	},
	bulletproof: {
		name: "防弹",
		shortDesc: "不受弹类招式影响。", // NEEDS QC
	},
	cheekpouch: {
		name: "颊囊",
		// Official flavor text: "无论是哪种树果， 食用后，ＨＰ都会回复。"
		desc: "该宝可梦吃掉携带的树果时，除树果的效果外，还回复最大HP的1/3（向下取整）。在虫咬、投掷、啄食、大快朵颐、茶会的效果之后，若吃掉的树果对该宝可梦生效，此效果也会发动。", // NEEDS QC
		shortDesc: "吃掉树果后，额外回复最大HP的1/3。", // NEEDS QC
		gen7: {
			desc: "该宝可梦吃掉携带的树果时，除树果的效果外还会回复最大HP的1/3（向下取整）。通过虫咬、投掷、啄食吃掉的树果对该宝可梦有效果时也会触发。", // NEEDS QC
		},
	},
	chillingneigh: {
		name: "苍白嘶鸣",
		// Official flavor text: "打倒对手时 会用冰冷的声音嘶鸣 并提高攻击。"
		desc: "该宝可梦使其他宝可梦濒死时，攻击提高1级。", // NEEDS QC
		shortDesc: "打倒对手后，攻击提高1级。", // NEEDS QC
	},
	chlorophyll: {
		name: "叶绿素",
		// Official flavor text: "晴朗天气时， 速度会提高。"
		desc: "大晴天时，该宝可梦的速度变为2倍。携带万能伞时此效果不会发动。", // NEEDS QC
		shortDesc: "大晴天时速度变为2倍。", // NEEDS QC
		gen7: {
			desc: "天气为大晴天时，该宝可梦的速度变为2倍。", // NEEDS QC
		},
	},
	clearbody: {
		name: "恒净之躯",
		shortDesc: "能力等级不会被其他宝可梦降低。", // NEEDS QC
	},
	cloudnine: {
		name: "无关天气",
		shortDesc: "在场时，天气的效果消失。", // NEEDS QC

		start: "#airlock",
	},
	colorchange: {
		name: "变色",
		// Official flavor text: "自己的属性会变为 从对手处所受招式的属性。"
		desc: "该宝可梦的属性变为最后击中它的招式的属性，除非其已具有该属性。此效果在连续攻击招式的所有攻击结束后判定。若招式的追加效果被特性强行消除，则此效果不会发动。", // NEEDS QC
		shortDesc: "属性变为击中自己的招式的属性，已有该属性时除外。", // NEEDS QC
		gen4: {
			desc: "该宝可梦的属性变为最后所受招式的属性。已是该属性时不变。连续攻击招式在每次攻击后都适用。该攻击未造成HP损失时不触发。", // NEEDS QC
		},
	},
	comatose: {
		name: "绝对睡眠",
		// Official flavor text: "总是半梦半醒的状态， 绝对不会醒来。 可以就这么睡着进行攻击。"
		desc: "该宝可梦视为处于睡眠状态，不会陷入异常状态，也不受哈欠的影响。", // NEEDS QC
		shortDesc: "视为处于睡眠状态，不会陷入异常状态。", // NEEDS QC

		start: "  {POKEMON}处于半梦半醒状态！",
	},
	commander: {
		name: "发号施令",
		desc: "若该宝可梦是米立龙且场上有队友吃吼霸，该宝可梦会进入吃吼霸的口中。吃吼霸的攻击、特攻、速度、防御、特防各提高2级。效果期间，吃吼霸无法交换，该宝可梦无法选择行动，以该宝可梦为目标的攻击会落空，但其仍会受到间接伤害。若该宝可梦在效果期间濒死，可以交换其他宝可梦上场，但吃吼霸仍然无法交换。若吃吼霸在效果期间濒死，该宝可梦恢复选择行动的能力。", // NEEDS QC
		shortDesc: "进入队友吃吼霸的口中，使其全部能力提高2级。", // NEEDS QC

		activate: "  {POKEMON}作为发号施令的要员而被{TARGET}吞下去了！",
	},
	competitive: {
		name: "好胜",
		// Official flavor text: "如果能力被降低， 特攻就会大幅提高。"
		desc: "该宝可梦的能力等级每被对手降低1级，特攻提高2级。", // NEEDS QC
		shortDesc: "能力被对手降低时，特攻提高2级。", // NEEDS QC
	},
	compoundeyes: {
		name: "复眼",
		shortDesc: "招式命中率变为1.3倍。", // NEEDS QC
	},
	contrary: {
		name: "唱反调",
		shortDesc: "能力等级变化的升降颠倒。", // NEEDS QC
		gen7: {
			desc: "该宝可梦的能力等级提高时反而降低，降低时反而提高。对使用Z招式前Z力量带来的能力提升不适用。", // NEEDS QC
		},
		gen6: {
			desc: "该宝可梦的能力等级提高时反而降低，降低时反而提高。", // NEEDS QC
		},
	},
	corrosion: {
		name: "腐蚀",
		shortDesc: "可以无视属性使对方陷入中毒或剧毒状态。", // NEEDS QC
	},
	costar: {
		name: "同台共演",
		shortDesc: "出场时复制队友的能力等级变化。", // NEEDS QC
	},
	cottondown: {
		name: "棉絮",
		// Official flavor text: "受到攻击后撒下棉絮， 降低除自己以外的 所有宝可梦的速度。"
		desc: "该宝可梦受到攻击时，场上所有其他宝可梦的速度降低1级。", // NEEDS QC
		shortDesc: "受到攻击时，其他所有宝可梦的速度降低1级。", // NEEDS QC
	},
	cudchew: {
		name: "反刍",
		shortDesc: "吃过的树果会在下一回合结束时再吃1次。", // NEEDS QC
	},
	curiousmedicine: {
		name: "怪药",
		shortDesc: "出场时重置队友的能力等级变化。", // NEEDS QC
	},
	cursedbody: {
		name: "诅咒之躯",
		// Official flavor text: "受到攻击时， 有时会把对手的招式 变为定身法状态。"
		desc: "该宝可梦受到攻击时，有30%的几率使该招式陷入定身法状态；若攻击方已有招式处于定身法状态，则不会发动。", // NEEDS QC
		shortDesc: "受到攻击时，有30%的几率使该招式陷入定身法状态。", // NEEDS QC
	},
	cutecharm: {
		name: "迷人之躯",
		// Official flavor text: "有时会让接触到自己的对手着迷。"
		desc: "与该宝可梦直接接触的异性宝可梦有30%的几率陷入着迷状态。", // NEEDS QC
		shortDesc: "有30%的几率使接触自己的异性陷入着迷。", // NEEDS QC
		gen4: {
			desc: "用接触类招式攻击该宝可梦的异性宝可梦有30%的几率陷入着迷状态。该攻击未造成HP损失时不触发。", // NEEDS QC
		},
		gen3: {
			desc: "用接触类招式攻击该宝可梦的异性宝可梦有1/3的几率陷入着迷状态。该攻击未造成HP损失时不触发。", // NEEDS QC
			shortDesc: "有1/3的几率使接触的异性宝可梦着迷。", // NEEDS QC
		},
	},
	damp: {
		name: "湿气",
		// Official flavor text: "通过把周围都弄湿， 使谁都无法使用自爆等爆炸类的招式。"
		desc: "该宝可梦在场时，大爆炸、惊爆大头、薄雾炸裂、自爆和特性引爆无法生效。", // NEEDS QC
		shortDesc: "阻止大爆炸和引爆等自爆类效果。", // NEEDS QC
		gen7: {
			desc: "该宝可梦在场期间，大爆炸、惊爆大头、自爆和特性引爆不会发动。", // NEEDS QC
			shortDesc: "在场期间阻止大爆炸/惊爆大头/自爆/引爆。", // NEEDS QC
		},
		gen6: {
			desc: "该宝可梦在场期间，大爆炸、自爆和特性引爆不会发动。", // NEEDS QC
			shortDesc: "在场期间阻止大爆炸/自爆/引爆。", // NEEDS QC
		},
		gen3: {
			desc: "该宝可梦在场期间，大爆炸和自爆不会发动。", // NEEDS QC
			shortDesc: "在场期间阻止大爆炸和自爆。", // NEEDS QC
		},

		block: "  {SOURCE}无法使用{MOVE}！",
	},
	dancer: {
		name: "舞者",
		// Official flavor text: "有谁使出跳舞招式时， 自己也能就这么接着使出跳舞招式。"
		desc: "其他宝可梦使用舞蹈类招式后，该宝可梦会使用相同的招式。复制的招式受所有可阻止招式执行的效果影响。通过此特性使用的招式不会再被其他拥有此特性的宝可梦复制。", // NEEDS QC
		shortDesc: "其他宝可梦使用舞蹈类招式后，自己也使出该招式。", // NEEDS QC
	},
	darkaura: {
		name: "暗黑气场",
		// Official flavor text: "全体的恶属性招式变强。"
		desc: "该宝可梦在场时，场上宝可梦使用的恶属性招式威力变为1.33倍。", // NEEDS QC
		shortDesc: "在场时，恶属性招式威力变为1.33倍。", // NEEDS QC

		start: "  {POKEMON}正在释放暗黑气场！",
	},
	dauntlessshield: {
		name: "不屈之盾",
		shortDesc: "出场时防御提高1级。每场战斗1次。", // NEEDS QC
		gen8: {
			shortDesc: "出场时防御提高1级。", // NEEDS QC
		},
	},
	dazzling: {
		name: "鲜艳之躯",
		// Official flavor text: "让对手吓一跳， 使其无法对我方使出先制招式。"
		desc: "对手使用的以该宝可梦或其队友为目标的先制招式无法生效。", // NEEDS QC
		shortDesc: "使对手指向己方的先制招式无效。", // NEEDS QC

		block: "#damp",
	},
	defeatist: {
		name: "软弱",
		// Official flavor text: "ＨＰ减半时， 会变得软弱， 攻击和特攻会减半。"
		desc: "该宝可梦的HP为最大HP的1/2或以下时，攻击和特攻减半。", // NEEDS QC
		shortDesc: "HP为1/2以下时，攻击和特攻减半。", // NEEDS QC
	},
	defiant: {
		name: "不服输",
		// Official flavor text: "能力被降低时， 攻击会大幅提高。"
		desc: "该宝可梦的能力等级每被对手降低1级，攻击提高2级。", // NEEDS QC
		shortDesc: "能力被对手降低时，攻击提高2级。", // NEEDS QC
	},
	deltastream: {
		name: "德尔塔气流",
		// Official flavor text: "变为令飞行属性的弱点 消失的天气。"
		desc: "出场时，天气变为乱流。乱流会消除飞行属性宝可梦的飞行属性弱点。此天气持续到场上没有宝可梦具有此特性为止，或被特性终结之地、始源之海改变为止。", // NEEDS QC
		shortDesc: "出场时刮起乱流，直到此特性不在场为止。", // NEEDS QC
	},
	desolateland: {
		name: "终结之地",
		// Official flavor text: "变为不会受到 水属性攻击的天气。"
		desc: "出场时，天气变为大日照。大日照包含大晴天的所有效果，并使水属性攻击招式无法使用。此天气持续到场上没有宝可梦具有此特性为止，或被特性德尔塔气流、始源之海改变为止。", // NEEDS QC
		shortDesc: "出场时日照变得强烈，直到此特性不在场为止。", // NEEDS QC
	},
	disguise: {
		name: "画皮",
		// Official flavor text: "通过画皮覆盖住身体， 可以防住１次攻击。"
		desc: "若该宝可梦是谜拟丘，战斗中首次受到的攻击伤害为0（按一般属性相性判定）。随后画皮被识破，变为谜拟丘（现形的样子），并失去最大HP的1/8。混乱的自伤也会识破画皮。", // NEEDS QC
		shortDesc: "（谜拟丘专用）挡下首次攻击，改为失去1/8HP。", // NEEDS QC
		gen7: {
			desc: "若该宝可梦是谜拟丘，战斗中首次受到的攻击伤害为0（按一般属性相性判定）。随后画皮被识破，变为现形的样子。混乱的自伤也会识破画皮。", // NEEDS QC
			shortDesc: "（限谜拟丘）首次受到的攻击伤害为0，画皮被识破。", // NEEDS QC
		},

		block: "  画皮变成了替身！",
		transform: "{POKEMON}的画皮脱落了！",
	},
	download: {
		name: "下载",
		// Official flavor text: "比较对手的防御和特防， 根据较低的那项能力 相应地提高自己的攻击或特攻。"
		desc: "出场时，根据所有对手合计较弱的防御能力，该宝可梦的攻击或特攻提高1级。对手的防御较低时提高攻击，特防相同或较低时提高特攻。", // NEEDS QC
		shortDesc: "出场时根据对手较弱的防御，攻击或特攻+1。", // NEEDS QC
	},
	dragonize: {
		name: "龙皮肤",
		desc: "该宝可梦的一般属性招式变为龙属性，威力变为1.2倍。此效果在其他改变招式属性的效果之后、等离子浴和输电的效果之前适用。", // NEEDS QC
		shortDesc: "一般属性招式变为龙属性，威力1.2倍。", // NEEDS QC
	},
	dragonsmaw: {
		name: "龙颚",
		shortDesc: "龙属性攻击的进攻能力变为1.5倍。", // NEEDS QC
	},
	drizzle: {
		name: "降雨",
		shortDesc: "出场时召唤下雨。", // NEEDS QC
	},
	drought: {
		name: "日照",
		shortDesc: "出场时召唤大晴天。", // NEEDS QC
	},
	dryskin: {
		name: "干燥皮肤",
		// Official flavor text: "下雨天气时和受到水属性的招式时， ＨＰ会回复。晴朗天气时和受到火属性的 招式时，ＨＰ会减少。"
		desc: "该宝可梦不受水属性招式影响，且被水属性招式击中时回复最大HP的1/4（向下取整）。火属性招式对该宝可梦的威力变为1.25倍。每回合结束时，下雨时回复最大HP的1/8（向下取整），大晴天失去最大HP的1/8（向下取整）。携带万能伞时天气效果不会发动。", // NEEDS QC
		shortDesc: "受水属性回复、下雨回复；受火属性1.25倍，大晴天扣HP。", // NEEDS QC
		gen7: {
			desc: "该宝可梦不受水属性招式影响，受到水属性招式时回复最大HP的1/4（向下取整）。受到的火属性招式威力变为1.25倍。每回合结束时，天气为下雨时回复最大HP的1/8（向下取整），天气为大晴天时失去最大HP的1/8（向下取整）。", // NEEDS QC
		},

		damage: "#aftermath",
	},
	earlybird: {
		name: "早起",
		shortDesc: "睡眠回合数以2倍速度减少。", // NEEDS QC
	},
	eartheater: {
		name: "食土",
		desc: "该宝可梦不受地面属性招式影响，且被地面属性招式击中时回复最大HP的1/4（向下取整）。", // NEEDS QC
		shortDesc: "受到地面属性招式时无效化，并回复最大HP的1/4。", // NEEDS QC
	},
	eelevate: {
		name: "鳗鳗高升",
		desc: "该宝可梦不受地面属性攻击及撒菱、毒菱、黏黏网和特性沙穴的影响。受到重力、扎根、击落、千箭齐发、黑色铁球的效果时，此免疫失效。千箭齐发可无视此特性击中该宝可梦。该宝可梦使其他宝可梦濒死时，其数值最高的能力提高1级。此判定不考虑能力等级变化。若多项能力相同，按攻击、防御、特攻、特防、速度的顺序优先。", // NEEDS QC
		shortDesc: "不受地面属性招式影响。打倒对手后最高能力+1。", // NEEDS QC
	},
	effectspore: {
		name: "孢子",
		// Official flavor text: "受到攻击时， 有时会把接触到自己的对手 变为中毒、麻痹或睡眠状态。"
		desc: "与该宝可梦直接接触的宝可梦有30%的几率陷入中毒、麻痹或睡眠状态。", // NEEDS QC
		shortDesc: "有30%的几率使接触自己的对手中毒、麻痹或睡眠。", // NEEDS QC
		gen4: {
			desc: "用接触类招式攻击该宝可梦的宝可梦有30%的几率陷入中毒、麻痹或睡眠状态。该攻击未造成HP损失时不触发。", // NEEDS QC
		},
		gen3: {
			desc: "用接触类招式攻击该宝可梦的宝可梦有10%的几率陷入中毒、麻痹或睡眠状态。该攻击未造成HP损失时不触发。", // NEEDS QC
			shortDesc: "有10%的几率使接触的宝可梦中毒/麻痹/睡眠。", // NEEDS QC
		},
	},
	electricsurge: {
		name: "电气制造者",
		shortDesc: "出场时布下电气场地。", // NEEDS QC
	},
	electromorphosis: {
		name: "电力转换",
		shortDesc: "受到攻击时，进入充电状态。", // NEEDS QC

		start: "  {POKEMON}受到{MOVE}而充电了！",
	},
	embodyaspectcornerstone: {
		name: "面影辉映（础石）", // PS-style disambiguator (not part of the official name)
		shortDesc: "出场时防御提高1级。", // NEEDS QC

		boost: "  {POKEMON}让础之假面发出光辉，防御提高了！",
	},
	embodyaspecthearthflame: {
		name: "面影辉映（火灶）", // PS-style disambiguator (not part of the official name)
		shortDesc: "出场时攻击提高1级。", // NEEDS QC

		boost: "  {POKEMON}让灶之假面发出光辉，攻击提高了！",
	},
	embodyaspectteal: {
		name: "面影辉映（碧草）", // PS-style disambiguator (not part of the official name)
		shortDesc: "出场时速度提高1级。", // NEEDS QC

		boost: "  {POKEMON}让碧之假面发出光辉，速度提高了！",
	},
	embodyaspectwellspring: {
		name: "面影辉映（水井）", // PS-style disambiguator (not part of the official name)
		shortDesc: "出场时特防提高1级。", // NEEDS QC

		boost: "  {POKEMON}让井之假面发出光辉，特防提高了！",
	},
	emergencyexit: {
		name: "危险回避",
		// Official flavor text: "ＨＰ变为一半时， 为了回避危险， 会退回到同行队伍中。"
		desc: "该宝可梦的HP高于最大HP的1/2、且受到伤害后降至1/2或以下时，立即交换为选择的队友。此效果在连续攻击招式的所有攻击结束后判定。若招式的追加效果被特性强行消除，则此效果不会发动。直接和间接伤害均可触发，但使用诅咒、替身时的消耗、腹鼓、分担痛楚和混乱的自伤除外。", // NEEDS QC
		shortDesc: "HP变为1/2以下时，与同伴交换。", // NEEDS QC
	},
	fairyaura: {
		name: "妖精气场",
		// Official flavor text: "全体的妖精属性招式变强。"
		desc: "该宝可梦在场时，场上宝可梦使用的妖精属性招式威力变为1.33倍。", // NEEDS QC
		shortDesc: "在场时，妖精属性招式威力变为1.33倍。", // NEEDS QC

		start: "  {POKEMON}正在释放妖精气场！",
	},
	filter: {
		name: "过滤",
		shortDesc: "受到的效果绝佳伤害变为3/4。", // NEEDS QC
	},
	firemane: {
		name: "火焰鬃毛",
		shortDesc: "火属性攻击的进攻能力变为1.5倍。", // NEEDS QC
	},
	flamebody: {
		name: "火焰之躯",
		shortDesc: "有30%的几率使接触自己的对手陷入灼伤。", // NEEDS QC
		gen4: {
			desc: "用接触类招式攻击该宝可梦的宝可梦有30%的几率陷入灼伤状态。该攻击未造成HP损失时不触发。", // NEEDS QC
		},
		gen3: {
			desc: "用接触类招式攻击该宝可梦的宝可梦有1/3的几率陷入灼伤状态。该攻击未造成HP损失时不触发。", // NEEDS QC
			shortDesc: "有1/3的几率使接触的宝可梦灼伤。", // NEEDS QC
		},
	},
	flareboost: {
		name: "受热激升",
		// Official flavor text: "变为灼伤状态时， 特殊招式的威力会提高。"
		desc: "该宝可梦处于灼伤状态时，其特殊攻击的威力变为1.5倍。", // NEEDS QC
		shortDesc: "灼伤时特殊招式威力变为1.5倍。", // NEEDS QC
	},
	flashfire: {
		name: "引火",
		// Official flavor text: "受到火属性的招式攻击时， 吸收火焰，自己使出的 火属性招式会变强。"
		desc: "该宝可梦不受火属性招式影响。首次被火属性招式击中后，只要仍在场并保持此特性，其使用火属性攻击时进攻能力变为1.5倍。若该宝可梦处于冰冻状态，无法被火属性攻击解冻。", // NEEDS QC
		shortDesc: "被火属性招式击中后，自身火属性攻击威力变为1.5倍；免疫火属性。", // NEEDS QC
		gen4: {
			desc: "该宝可梦未处于冰冻状态时不受火属性招式影响。首次被火属性招式击中后，只要仍在场并保持此特性，其火属性攻击的伤害变为1.5倍。", // NEEDS QC
		},
		gen3: {
			desc: "该宝可梦未处于冰冻状态时不受火属性招式影响。首次被火属性招式击中后，只要仍在场并保持此特性，其火属性攻击的伤害变为1.5倍。该宝可梦处于异常状态时、是火属性时、处于替身状态时，鬼火不会触发此特性。", // NEEDS QC
		},

		start: "  {POKEMON}的火焰威力提高了！",
	},
	flowergift: {
		name: "花之礼",
		// Official flavor text: "晴朗天气时， 自己与同伴的攻击和 特防能力会提高。"
		desc: "若该宝可梦是樱花儿且天气为大晴天，其变为阳光下的样子，自身及队友的攻击和特防变为1.5倍。携带万能伞时这些效果不会发动。", // NEEDS QC
		shortDesc: "（樱花儿专用）大晴天时己方攻击和特防变为1.5倍。", // NEEDS QC
		gen7: {
			desc: "该宝可梦是樱花儿且天气为大晴天时，变为阳光下的样子，自身和队友的攻击和特防变为1.5倍。", // NEEDS QC
		},
		gen4: {
			desc: "天气为大晴天时，该宝可梦和队友的攻击和特防变为1.5倍。", // NEEDS QC
			shortDesc: "大晴天时，自身和队友的攻击和特防变为1.5倍。", // NEEDS QC
		},
	},
	flowerveil: {
		name: "花幕",
		// Official flavor text: "我方的草属性宝可梦 能力不会降低， 也不会变为异常状态。"
		desc: "该宝可梦一方的草属性宝可梦不会被其他宝可梦降低能力等级，也不会被其他宝可梦施加异常状态。", // NEEDS QC
		shortDesc: "己方草属性宝可梦不会被降能力或陷入异常状态。", // NEEDS QC

		block: "  {POKEMON}正受到花幕的保护！",
	},
	fluffy: {
		name: "毛茸茸",
		// Official flavor text: "会将对手所给予的接触类招式的伤害减半， 但火属性招式的伤害会变为２倍。"
		desc: "该宝可梦受到的接触类招式伤害减半，但受到的火属性招式伤害变为2倍。", // NEEDS QC
		shortDesc: "受到的接触类伤害减半，火属性伤害2倍。", // NEEDS QC
	},
	forecast: {
		name: "阴晴不定",
		// Official flavor text: "受天气的影响， 会变为水属性、火属性 或冰属性中的某一个。"
		desc: "若该宝可梦是飘浮泡泡，其属性随当前天气变化（沙暴除外）。携带万能伞且天气为下雨或大晴天时，此效果不会发动。", // NEEDS QC
		shortDesc: "飘浮泡泡的属性随天气变化（沙暴除外）。", // NEEDS QC
		gen7: {
			desc: "该宝可梦是飘浮泡泡时，属性随沙暴以外的天气变化。", // NEEDS QC
		},
	},
	forewarn: {
		name: "预知梦",
		// Official flavor text: "出场时， 只读取１个对手拥有的招式。"
		desc: "出场时，随机得知一个对手威力最高的招式。此判定中，一击必杀招式视为威力150，双倍奉还、镜面反射、金属爆炸视为威力120，其他威力不定的攻击招式视为威力80，变化招式视为威力1。", // NEEDS QC
		shortDesc: "出场时得知对手威力最高的招式。", // NEEDS QC
		gen4: {
			desc: "出场时，随机得知对手宝可梦所拥有招式中威力最高的一个。一击必杀招式按威力150判定，双倍奉还、镜面反射、金属爆炸按威力120判定，其他威力不定的攻击招式按威力80判定。", // NEEDS QC
		},

		activate: "  读取了{TARGET}的{MOVE}！",
		activateNoTarget: "  {POKEMON}的预知梦读取了{MOVE}！", // NEEDS QC
	},
	friendguard: {
		name: "友情防守",
		shortDesc: "队友受到的伤害变为3/4。", // NEEDS QC
	},
	frisk: {
		name: "察觉",
		shortDesc: "出场时得知所有对手的携带道具。", // NEEDS QC
		gen5: {
			shortDesc: "出场时，得知随机1只对手携带的道具。", // NEEDS QC
		},

		activate: "  {POKEMON}察觉到了{TARGET}的{ITEM}！",
		activateNoTarget: "  {POKEMON}察觉到了对手的{ITEM}！", // NEEDS QC
	},
	fullmetalbody: {
		name: "金属防护",
		shortDesc: "能力等级不会被其他宝可梦降低。", // NEEDS QC
	},
	furcoat: {
		name: "毛皮大衣",
		shortDesc: "防御变为2倍。", // NEEDS QC
	},
	galewings: {
		name: "疾风之翼",
		shortDesc: "HP全满时，飞行属性招式优先度+1。", // NEEDS QC
		gen6: {
			shortDesc: "该宝可梦的飞行属性招式优先度+1。", // NEEDS QC
		},
	},
	galvanize: {
		name: "电气皮肤",
		// Official flavor text: "一般属性的招式 会变为电属性。 威力会少量提高。"
		desc: "该宝可梦的一般属性招式变为电属性，威力变为1.2倍。此效果在其他改变招式属性的效果之后、等离子浴和输电的效果之前适用。", // NEEDS QC
		shortDesc: "一般属性招式变为电属性，威力1.2倍。", // NEEDS QC
	},
	gluttony: {
		name: "贪吃鬼",
		// Official flavor text: "原本ＨＰ变得很少时才会吃树果， 在ＨＰ还有一半时就会把它吃掉。"
		desc: "该宝可梦携带的通常在最大HP的1/4或以下时发动的树果，会提前在最大HP的1/2或以下时吃掉。", // NEEDS QC
		shortDesc: "在HP为1/2以下时提前吃掉1/4触发的树果。", // NEEDS QC
	},
	goodasgold: {
		name: "黄金之躯",
		shortDesc: "不受变化招式影响。", // NEEDS QC
	},
	gooey: {
		name: "黏滑",
		shortDesc: "接触自己的对手速度降低1级。", // NEEDS QC
	},
	gorillatactics: {
		name: "一猩一意",
		// Official flavor text: "虽然攻击会提高， 但是只能使出 一开始所选的招式。"
		desc: "该宝可梦的攻击变为1.5倍，但只能使用最先使出的招式。极巨化期间这些效果不会发动。", // NEEDS QC
		shortDesc: "攻击变为1.5倍，但只能使出最先选择的招式。", // NEEDS QC
	},
	grasspelt: {
		name: "草之毛皮",
		shortDesc: "青草场地时，防御变为1.5倍。", // NEEDS QC
	},
	grassysurge: {
		name: "青草制造者",
		shortDesc: "出场时布下青草场地。", // NEEDS QC
	},
	grimneigh: {
		name: "漆黑嘶鸣",
		// Official flavor text: "打倒对手时 会用恐怖的声音嘶鸣 并提高特攻。"
		desc: "该宝可梦使其他宝可梦濒死时，特攻提高1级。", // NEEDS QC
		shortDesc: "打倒对手后，特攻提高1级。", // NEEDS QC
	},
	guarddog: {
		name: "看门犬",
		desc: "该宝可梦不受特性威吓的影响，反而会因此提高1级攻击。该宝可梦不会因其他宝可梦的攻击或道具而被强制交换。", // NEEDS QC
		shortDesc: "受威吓影响时攻击+1。不会被强制交换。", // NEEDS QC
	},
	gulpmissile: {
		name: "一口导弹",
		// Official flavor text: "冲浪或潜水时会叼来猎物。 受到伤害时， 会吐出猎物进行攻击。"
		desc: "若该宝可梦是古月鸟，用冲浪击中目标或成功使用潜水的第1回合后会改变样子。剩余HP高于最大HP的1/2时，变为口中含着刺梭鱼的古月鸟（一口吞的样子）；剩余HP为1/2或以下时，变为口中含着皮卡丘的古月鸟（大口吞的样子）。这些样子的古月鸟受到攻击时，即使HP归零，也会把刺梭鱼或皮卡丘吐向攻击方。吐出物造成目标最大HP1/4（向下取整）的伤害；此伤害可被特性魔法防守防止，但不会被替身挡下。刺梭鱼还会使目标的防御降低1级，皮卡丘会使目标陷入麻痹状态。吐出后、交换下场或极巨化时，古月鸟恢复原样。", // NEEDS QC
		shortDesc: "冲浪、潜水后受击时，吐出猎物反击。", // NEEDS QC
	},
	guts: {
		name: "毅力",
		// Official flavor text: "如果变为异常状态， 会拿出毅力， 攻击会提高。"
		desc: "该宝可梦处于异常状态时，攻击变为1.5倍。其物理攻击无视灼伤减半伤害的效果。", // NEEDS QC
		shortDesc: "有异常状态时攻击变为1.5倍，且无视灼伤减半。", // NEEDS QC
	},
	hadronengine: {
		name: "强子引擎",
		shortDesc: "出场时布下电气场地，期间特攻变为1.3333倍。", // NEEDS QC

		start: "  {POKEMON}布下电气场地使未来的机关跃动起来！！",
		activate: "  {POKEMON}用电气场地使未来的机关跃动起来！！",
	},
	harvest: {
		name: "收获",
		// Official flavor text: "可以多次制作出 已被使用掉的树果。"
		desc: "若该宝可梦最后使用的道具是树果，每回合结束时有50%的几率将其恢复。大晴天时，几率为100%。", // NEEDS QC
		shortDesc: "有50%的几率（大晴天必定）恢复用过的树果。", // NEEDS QC

		addItem: "  {POKEMON}收获了{ITEM}！",
	},
	healer: {
		name: "治愈之心",
		// Official flavor text: "有时会治愈异常状态的同伴。"
		desc: "每回合结束时，有30%的几率治愈队友的异常状态。", // NEEDS QC
		shortDesc: "每回合有30%的几率治愈队友的异常状态。", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "每回合结束时，相邻的每个队友各有30%的几率治愈异常状态。", // NEEDS QC
			shortDesc: "每回合结束时，相邻的每个队友各有30%的几率治愈异常状态。", // NEEDS QC
		},
	},
	heatproof: {
		name: "耐热",
		// Official flavor text: "耐热的体质会 让火属性的招式威力减半。"
		desc: "其他宝可梦对该宝可梦使用火属性攻击时，计算伤害时进攻能力减半。该宝可梦受到的灼伤伤害减半（向下取整）。", // NEEDS QC
		shortDesc: "受到的火属性伤害和灼伤伤害减半。", // NEEDS QC
		gen8: {
			desc: "该宝可梦受到的火属性攻击威力减半。灼伤造成的伤害也减半（向下取整）。", // NEEDS QC
			shortDesc: "受到的火属性攻击威力减半，灼伤伤害也减半。", // NEEDS QC
		},
	},
	heavymetal: {
		name: "重金属",
		// Official flavor text: "自身的重量会变为２倍。"
		desc: "该宝可梦的重量变为2倍。此效果在身体轻量化的效果之后、轻石的效果之前计算。", // NEEDS QC
		shortDesc: "体重变为2倍。", // NEEDS QC
	},
	honeygather: {
		name: "采蜜",
		shortDesc: "没有对战效果。", // NEEDS QC
	},
	hospitality: {
		name: "款待",
		shortDesc: "出场时回复队友最大HP的1/4。", // NEEDS QC

		heal: "  {POKEMON}喝光了{SOURCE}泡的茶！",
	},
	hugepower: {
		name: "大力士",
		shortDesc: "攻击变为2倍。", // NEEDS QC
	},
	hungerswitch: {
		name: "饱了又饿",
		// Official flavor text: "每回合结束时会在 满腹花纹与空腹花纹之间 交替改变样子。"
		desc: "若该宝可梦是莫鲁贝可，每回合结束时在满腹花纹和空腹花纹之间切换。", // NEEDS QC
		shortDesc: "莫鲁贝可每回合结束时切换花纹。", // NEEDS QC
	},
	hustle: {
		name: "活力",
		// Official flavor text: "自己的攻击变高， 但命中率会降低。"
		desc: "该宝可梦的攻击变为1.5倍，物理攻击的命中率变为0.8倍。", // NEEDS QC
		shortDesc: "攻击变为1.5倍，但物理招式命中率变为0.8倍。", // NEEDS QC
	},
	hydration: {
		name: "湿润之躯",
		// Official flavor text: "下雨天气时， 异常状态会治愈。"
		desc: "下雨时，该宝可梦的异常状态在每回合结束时治愈。携带万能伞时此效果不会发动。", // NEEDS QC
		shortDesc: "下雨时，每回合结束时治愈异常状态。", // NEEDS QC
		gen7: {
			desc: "天气为下雨时，每回合结束时治愈异常状态。", // NEEDS QC
		},
	},
	hypercutter: {
		name: "怪力钳",
		shortDesc: "攻击不会被其他宝可梦降低。", // NEEDS QC
	},
	icebody: {
		name: "冰冻之躯",
		// Official flavor text: "冰雹天气时， 会缓缓回复ＨＰ。"
		desc: "下雪时，该宝可梦在每回合结束时回复最大HP的1/16（向下取整）。", // NEEDS QC
		shortDesc: "下雪时，每回合回复最大HP的1/16。", // NEEDS QC
		gen8: {
			desc: "天气为冰雹时，每回合结束时回复最大HP的1/16（向下取整）。不受冰雹的伤害。", // NEEDS QC
			shortDesc: "冰雹时每回合回复最大HP的1/16。不受冰雹伤害。", // NEEDS QC
		},
	},
	iceface: {
		name: "结冻头",
		// Official flavor text: "头部的冰会代替自己承受 物理攻击，但是样子会改变。 下冰雹时，冰会恢复原状。"
		desc: "若该宝可梦是冰砌鹅，战斗中首次受到的物理攻击伤害为0（按一般属性相性判定）。随后冰头被打碎，变为冰砌鹅（解冻头）。下雪时或在下雪时交换上场时，恢复为结冻头的样子。混乱的自伤也会打碎冰头。", // NEEDS QC
		shortDesc: "（冰砌鹅专用）挡下首次物理攻击，下雪时恢复。", // NEEDS QC
		gen8: {
			desc: "若该宝可梦是冰砌鹅，战斗中首次受到的物理攻击伤害为0（按一般属性相性判定）。随后冰头被打碎，变为解冻头的样子。冰雹开始时或冰雹期间出场时，恢复结冻头的样子。混乱的自伤也会打碎冰头。", // NEEDS QC
			shortDesc: "是冰砌鹅时，首次受到的物理攻击伤害为0。冰雹时恢复。", // NEEDS QC
		},
	},
	icescales: {
		name: "冰鳞粉",
		shortDesc: "受到的特殊招式伤害减半。", // NEEDS QC
	},
	illuminate: {
		name: "发光",
		// Official flavor text: "通过让周围变亮， 变得容易遇到野生的宝可梦。"
		desc: "该宝可梦的命中率不会被其他宝可梦降低。该宝可梦无视目标的回避率变化。", // NEEDS QC
		shortDesc: "命中率不会被降低，且无视对手的回避率。", // NEEDS QC
		gen8: {
			desc: "没有对战效果。", // NEEDS QC
			shortDesc: "没有对战效果。", // NEEDS QC
		},
	},
	illusion: {
		name: "幻觉",
		// Official flavor text: "假扮成同行队伍中的 最后一只宝可梦出场， 迷惑对手。"
		desc: "交换上场时，该宝可梦会以队伍中最后一只未濒死的宝可梦的样子出场，直到受到其他宝可梦攻击的直接伤害为止。显示的等级和HP为该宝可梦自身的数值。", // NEEDS QC
		shortDesc: "受到直接伤害前，伪装成队伍最后一只宝可梦。", // NEEDS QC

		end: "  {POKEMON}造成的幻觉解除了！",
	},
	immunity: {
		name: "免疫",
		shortDesc: "不会陷入中毒状态。中毒时获得此特性会将其治愈。", // NEEDS QC
	},
	imposter: {
		name: "变身者",
		// Official flavor text: "变身为当前面对的宝可梦。"
		desc: "出场时，变身为正对面的对手宝可梦。若该位置没有宝可梦，则不会变身。", // NEEDS QC
		shortDesc: "出场时变身为正对面的对手。", // NEEDS QC
	},
	infiltrator: {
		name: "穿透",
		// Official flavor text: "可以穿透对手的壁障 或替身进行攻击。"
		desc: "该宝可梦的招式无视替身以及对手方的反射壁、光墙、神秘守护、白雾、极光幕。", // NEEDS QC
		shortDesc: "攻击时无视替身和反射壁、光墙等。", // NEEDS QC
		gen6: {
			desc: "该宝可梦的招式无视替身以及对手方的反射壁、光墙、神秘守护、白雾。", // NEEDS QC
			shortDesc: "招式无视替身及对手的反射壁、光墙、神秘守护、白雾。", // NEEDS QC
		},
		gen5: {
			desc: "该宝可梦的招式无视对手方的反射壁、光墙、神秘守护、白雾。", // NEEDS QC
			shortDesc: "招式无视对手的反射壁、光墙、神秘守护、白雾。", // NEEDS QC
		},
	},
	innardsout: {
		name: "飞出的内在物",
		// Official flavor text: "被对手打倒的时候， 会给予对手相当于 ＨＰ剩余量的伤害。"
		desc: "该宝可梦因招式濒死时，攻击方失去与该宝可梦所受伤害相同的HP。", // NEEDS QC
		shortDesc: "因招式濒死时，攻击方受到相同伤害。", // NEEDS QC

		damage: "#aftermath",
	},
	innerfocus: {
		name: "精神力",
		// Official flavor text: "拥有经过锻炼的精神， 而不会因对手的攻击而畏缩。"
		desc: "该宝可梦不会畏缩。不受特性威吓的影响。", // NEEDS QC
		shortDesc: "不会畏缩。不受威吓影响。", // NEEDS QC
		gen7: {
			desc: "该宝可梦不会畏缩。", // NEEDS QC
			shortDesc: "该宝可梦不会畏缩。", // NEEDS QC
		},
	},
	insomnia: {
		name: "不眠",
		shortDesc: "不会陷入睡眠状态。睡眠时获得此特性会将其治愈。", // NEEDS QC
	},
	intimidate: {
		name: "威吓",
		// Official flavor text: "出场时威吓对手， 让其退缩， 降低对手的攻击。"
		desc: "出场时，使对手的攻击降低1级。特性为精神力、迟钝、我行我素、胆量的宝可梦和处于替身状态的宝可梦不受影响。", // NEEDS QC
		shortDesc: "出场时使对手的攻击降低1级。", // NEEDS QC
		gen7: {
			desc: "出场时，使对手的攻击降低1级。处于替身状态的宝可梦不受影响。", // NEEDS QC
		},
		gen6: {
			desc: "出场时，使相邻对手的攻击降低1级。处于替身状态的宝可梦不受影响。", // NEEDS QC
			shortDesc: "出场时，使相邻对手的攻击降低1级。", // NEEDS QC
		},
		gen4: {
			desc: "出场时，使对手的攻击降低1级。处于替身状态的宝可梦不受影响。急速折返打破对手的替身且该宝可梦作为接替出场时，原本处于替身状态的宝可梦仍不受此特性影响。", // NEEDS QC
			shortDesc: "出场时使对手的攻击降低1级。", // NEEDS QC
		},
		gen3: {
			desc: "出场时，使对手的攻击降低1级。处于替身状态的宝可梦不受影响。", // NEEDS QC
		},
	},
	intrepidsword: {
		name: "不挠之剑",
		shortDesc: "出场时攻击提高1级。每场战斗1次。", // NEEDS QC
		gen8: {
			shortDesc: "出场时攻击提高1级。", // NEEDS QC
		},
	},
	ironbarbs: {
		name: "铁刺",
		// Official flavor text: "用铁刺给予接触到自己的 对手伤害。"
		desc: "与该宝可梦直接接触的宝可梦失去最大HP的1/8（向下取整）。", // NEEDS QC
		shortDesc: "接触自己的对手失去最大HP的1/8。", // NEEDS QC

		damage: "#roughskin",
	},
	ironfist: {
		name: "铁拳",
		// Official flavor text: "使用拳类招式的威力会提高。"
		desc: "该宝可梦的拳类招式威力变为1.2倍。", // NEEDS QC
		shortDesc: "拳类招式威力变为1.2倍（突袭除外）。", // NEEDS QC
	},
	justified: {
		name: "正义之心",
		shortDesc: "受到恶属性招式攻击后，攻击提高1级。", // NEEDS QC
	},
	keeneye: {
		name: "锐利目光",
		// Official flavor text: "多亏了锐利的目光， 命中率不会被降低。"
		desc: "该宝可梦的命中率不会被其他宝可梦降低。该宝可梦无视目标的回避率变化。", // NEEDS QC
		shortDesc: "命中率不会被降低，且无视对手的回避率。", // NEEDS QC
		gen5: {
			desc: "该宝可梦的命中率不会被其他宝可梦降低。", // NEEDS QC
			shortDesc: "命中率不会被其他宝可梦降低。", // NEEDS QC
		},
	},
	klutz: {
		name: "笨拙",
		// Official flavor text: "无法使用持有的道具。"
		desc: "该宝可梦携带的道具无效。该宝可梦无法成功使用投掷。强制锻炼器、力量护踝、力量束带、力量腰带、力量护腕、力量镜、力量负重的效果仍然有效。", // NEEDS QC
		shortDesc: "携带的道具无效（强制锻炼器等除外）。", // NEEDS QC
	},
	leafguard: {
		name: "叶子防守",
		// Official flavor text: "晴朗天气时， 不会变为异常状态。"
		desc: "大晴天时，该宝可梦不会陷入异常状态，不受哈欠的影响，睡觉也会失败。携带万能伞时此效果不会发动。", // NEEDS QC
		shortDesc: "大晴天时不会陷入异常状态，睡觉也会失败。", // NEEDS QC
		gen7: {
			desc: "天气为大晴天时，该宝可梦不会陷入异常状态或受哈欠影响，且睡觉会失败。", // NEEDS QC
		},
		gen4: {
			desc: "天气为大晴天时，该宝可梦不会陷入异常状态或受哈欠影响，但可以正常使用睡觉。", // NEEDS QC
			shortDesc: "大晴天时不会陷入异常状态，但可以正常使用睡觉。", // NEEDS QC
		},
	},
	levitate: {
		name: "飘浮",
		// Official flavor text: "从地面浮起， 从而不会受到地面属性招式的攻击。"
		desc: "该宝可梦不受地面属性攻击及撒菱、毒菱、黏黏网和特性沙穴的影响。受到重力、扎根、击落、千箭齐发、黑色铁球的效果时，此免疫失效。千箭齐发可无视此特性击中该宝可梦。", // NEEDS QC
		shortDesc: "不受地面属性招式影响。会被重力等无效化。", // NEEDS QC
		gen5: {
			desc: "该宝可梦不受地面属性的攻击及撒菱、毒菱、特性沙穴的影响。处于重力、扎根、击落、黑色铁球的效果下时，此免疫无效。", // NEEDS QC
		},
		gen4: {
			desc: "该宝可梦不受地面属性的攻击及撒菱、毒菱、特性沙穴的影响。处于重力、扎根、黑色铁球的效果下时，此免疫无效。", // NEEDS QC
			shortDesc: "不受地面属性影响。重力/扎根/黑色铁球使其无效。", // NEEDS QC
		},
		gen3: {
			desc: "该宝可梦不受地面属性的攻击及撒菱、特性沙穴的影响。", // NEEDS QC
			shortDesc: "该宝可梦不受地面属性影响。", // NEEDS QC
		},
	},
	libero: {
		name: "自由者",
		// Official flavor text: "变为与自己使出的招式 相同的属性。"
		desc: "该宝可梦的属性变为其即将使用的招式的属性。此效果在所有改变招式属性的效果之后适用。每次出场只能发动1次，且太晶化后不会发动。", // NEEDS QC
		shortDesc: "属性变为自己使出的招式属性。每次出场1次。", // NEEDS QC
		gen8: {
			desc: "该宝可梦的属性变为即将使用的招式的属性。此效果在所有改变招式属性的效果之后适用。", // NEEDS QC
			shortDesc: "该宝可梦的属性变为即将使用的招式的属性。", // NEEDS QC
		},
	},
	lightmetal: {
		name: "轻金属",
		// Official flavor text: "自身的重量会减半。"
		desc: "该宝可梦的重量减半（以0.1千克为单位向下取整）。此效果在身体轻量化的效果之后、轻石的效果之前计算。重量不会低于0.1千克。", // NEEDS QC
		shortDesc: "体重减半。", // NEEDS QC
	},
	lightningrod: {
		name: "避雷针",
		// Official flavor text: "将电属性的招式吸引到自己身上， 不会受到伤害，而是会提高特攻。"
		desc: "该宝可梦不受电属性招式影响，且被电属性招式击中时特攻提高1级。其他宝可梦使用的单体电属性招式若不以该宝可梦为目标，且该宝可梦在其范围内，会被引到该宝可梦身上。若多只宝可梦可以用此特性引开招式，由速度最高的一只引开；速度相同时，由此特性生效更久的一只引开。", // NEEDS QC
		shortDesc: "吸引并免疫电属性招式，特攻提高1级。", // NEEDS QC
		gen4: {
			desc: "其他宝可梦对该宝可梦以外的单体目标使用电属性招式时，该招式被引到自己身上。", // NEEDS QC
			shortDesc: "将单体目标的电属性招式引到自己身上。", // NEEDS QC
		},
		gen3: {
			desc: "对手对该宝可梦以外的单体目标使用电属性招式时，该招式被引到自己身上。觉醒力量视为一般属性。", // NEEDS QC
			shortDesc: "将对手使用的单体目标电属性招式引到自己身上。", // NEEDS QC
		},

		activate: "  {POKEMON}吸引了攻击！",
	},
	limber: {
		name: "柔软",
		shortDesc: "不会陷入麻痹状态。麻痹时获得此特性会将其治愈。", // NEEDS QC
	},
	lingeringaroma: {
		name: "甩不掉的气味",
		desc: "与该宝可梦直接接触的宝可梦，特性会变为甩不掉的气味。特性为人马一体、牵绊变身、绝对睡眠、画皮、一口导弹、结冻头、甩不掉的气味、多属性、群聚变形、ＡＲ系统、鱼群、界限盾壳、战斗切换、太晶变形、达摩模式、全能变身的宝可梦不受影响。", // NEEDS QC
		shortDesc: "接触自己的对手特性变为此特性。", // NEEDS QC
		gen8: {
			desc: "用接触类招式攻击该宝可梦的宝可梦，特性变为甩不掉的气味。对特性为人马一体、牵绊变身、绝对睡眠、画皮、一口导弹、结冻头、甩不掉的气味、多属性、群聚变形、ＡＲ系统、鱼群、界限盾壳、战斗切换、达摩模式的宝可梦无效。", // NEEDS QC
		},

		changeAbility: "  {TARGET}沾上了味道且挥之不去！",
	},
	liquidooze: {
		name: "污泥浆",
		shortDesc: "吸取自己HP的对手受到等量伤害。", // NEEDS QC
		gen4: {
			desc: "从该宝可梦吸取HP的宝可梦，受到相当于其本应回复量的伤害。食梦不受此效果影响。", // NEEDS QC
		},

		damage: "  {POKEMON}吸到了污泥浆！",
	},
	liquidvoice: {
		name: "湿润之声",
		// Official flavor text: "所有的声音招式 都变为水属性。"
		desc: "该宝可梦的声音类招式变为水属性。此效果在其他改变招式属性的效果之后、等离子浴和输电的效果之前适用。", // NEEDS QC
		shortDesc: "声音类招式变为水属性。", // NEEDS QC
	},
	longreach: {
		name: "远隔",
		shortDesc: "招式不会接触到对手。", // NEEDS QC
	},
	magicbounce: {
		name: "魔法镜",
		// Official flavor text: "可以不受到由对手使出的 变化招式影响，并将其反弹。"
		desc: "该宝可梦不受以其为目标的一部分变化招式影响，并会将这些招式反弹给原使用者。以此方式反弹的招式无法被此特性或魔法反射的效果再次反弹。撒菱、隐形岩、黏黏网、毒菱每一方只能被反弹1次，由处于此特性或魔法反射效果下的最左侧宝可梦反弹。特性避雷针、引水的引开效果先于此特性发动。", // NEEDS QC
		shortDesc: "将一部分变化招式反弹给对方。", // NEEDS QC
		gen5: {
			desc: "该宝可梦不受以自己为目标的部分变化招式影响，并将其反弹给原使用者。被反弹的招式无法被此特性或魔法反射的效果再次反弹。撒菱、隐形岩、毒菱每方只能被反弹1次，由受此特性或魔法反射效果影响的最左侧宝可梦反弹。特性避雷针和引水在此特性生效前引来各自的招式。", // NEEDS QC
		},

		move: "#magiccoat",
	},
	magicguard: {
		name: "魔法防守",
		// Official flavor text: "不会受到攻击以外的伤害。"
		desc: "该宝可梦只会受到直接攻击的伤害。使用诅咒、替身时的消耗、腹鼓、分担痛楚、挣扎的反作用力伤害和混乱的自伤视为直接伤害。", // NEEDS QC
		shortDesc: "只会受到直接攻击的伤害。", // NEEDS QC
		gen4: {
			desc: "该宝可梦只会受到直接攻击的伤害。使用诅咒和替身、腹鼓、分担痛楚、挣扎的反作用力以及混乱造成的伤害视为直接伤害。该宝可梦不会因麻痹而无法行动，出场时不受毒菱影响。", // NEEDS QC
			shortDesc: "只受到直接攻击的伤害，且不会因麻痹而无法行动。", // NEEDS QC
		},
	},
	magician: {
		name: "魔术师",
		// Official flavor text: "夺走被自己的招式 击中的对手的道具。"
		desc: "若该宝可梦没有携带道具，其攻击击中宝可梦时会夺取对方的道具。对破灭之愿和预知未来无效。攻击击中多个目标时，从最快的宝可梦处夺取（考虑戏法空间的效果，且对手优先于队友）。", // NEEDS QC
		shortDesc: "未携带道具时，夺取被自己招式击中的对手的道具。", // NEEDS QC
	},
	magmaarmor: {
		name: "熔岩铠甲",
		shortDesc: "不会陷入冰冻状态。冰冻时获得此特性会将其治愈。", // NEEDS QC
	},
	magnetpull: {
		name: "磁力",
		// Official flavor text: "用磁力吸住钢属性的宝可梦， 使其无法逃走。"
		desc: "使钢属性的对手无法选择交换。携带美丽空壳的宝可梦和幽灵属性宝可梦除外。", // NEEDS QC
		shortDesc: "使钢属性对手无法交换。", // NEEDS QC
		gen6: {
			desc: "使相邻的钢属性对手无法选择交换。携带美丽空壳的宝可梦和幽灵属性宝可梦除外。", // NEEDS QC
			shortDesc: "使相邻的钢属性对手无法选择交换。", // NEEDS QC
		},
		gen5: {
			desc: "使相邻的钢属性对手无法选择交换。携带美丽空壳的宝可梦除外。", // NEEDS QC
			shortDesc: "使相邻的钢属性对手无法选择交换。", // NEEDS QC
		},
		gen4: {
			desc: "使钢属性对手无法选择交换。携带美丽空壳的宝可梦除外。", // NEEDS QC
			shortDesc: "使钢属性对手无法交换。", // NEEDS QC
		},
		gen3: {
			desc: "使该宝可梦以外的钢属性宝可梦无法选择交换。", // NEEDS QC
			shortDesc: "使该宝可梦以外的钢属性宝可梦无法交换。", // NEEDS QC
		},
	},
	marvelscale: {
		name: "神奇鳞片",
		shortDesc: "有异常状态时，防御变为1.5倍。", // NEEDS QC
	},
	megalauncher: {
		name: "超级发射器",
		// Official flavor text: "波动和波导类招式的 威力会提高。"
		desc: "该宝可梦的波动类招式威力变为1.5倍。治愈波动回复目标最大HP的3/4（五舍六入）。", // NEEDS QC
		shortDesc: "波动类招式威力变为1.5倍，治愈波动回复量变为3/4。", // NEEDS QC
	},
	megasol: {
		name: "超级日光",
		shortDesc: "使出招式时视为处于大晴天效果下。", // NEEDS QC
	},
	merciless: {
		name: "不仁不义",
		shortDesc: "攻击中毒状态的对手时必定击中要害。", // NEEDS QC
	},
	mimicry: {
		name: "拟态",
		// Official flavor text: "宝可梦的属性会根据 场地的状态而变化。"
		desc: "该宝可梦获得此特性时或场地开始时，其属性随当前场地变化。电气场地时为电属性，青草场地时为草属性，薄雾场地时为妖精属性，精神场地时为超能力属性。获得此特性时没有场地，或场地结束时，恢复为其种族原本的属性。", // NEEDS QC
		shortDesc: "属性随场地变化，场地结束后恢复。", // NEEDS QC

		activate: "  {POKEMON}变回了原来的属性！",
	},
	mindseye: {
		name: "心眼",
		desc: "该宝可梦的一般属性和格斗属性招式可以击中幽灵属性宝可梦。该宝可梦的命中率不会被其他宝可梦降低。该宝可梦无视目标的回避率变化。", // NEEDS QC
		shortDesc: "一般和格斗招式可命中幽灵属性，且无视回避率。", // NEEDS QC
	},
	minus: {
		name: "负电",
		// Official flavor text: "出场的伙伴之间 如果有正电或负电特性的宝可梦， 自己的特攻会提高。"
		desc: "若在场队友的特性为此特性或正电，该宝可梦的特攻变为1.5倍。", // NEEDS QC
		shortDesc: "场上队友有正电或此特性时，特攻变为1.5倍。", // NEEDS QC
		gen4: {
			desc: "在场的队友特性为正电时，该宝可梦的特攻变为1.5倍。", // NEEDS QC
			shortDesc: "队友的特性为正电时，特攻变为1.5倍。", // NEEDS QC
		},
		gen3: {
			desc: "场上有特性为正电的宝可梦时，该宝可梦的特攻变为1.5倍。", // NEEDS QC
			shortDesc: "场上有特性为正电的宝可梦时，特攻变为1.5倍。", // NEEDS QC
		},
	},
	mirrorarmor: {
		name: "镜甲",
		// Official flavor text: "只反弹自己受到的 能力降低效果。"
		desc: "该宝可梦的能力等级将被其他宝可梦降低时，改为降低对方的能力等级。若该宝可梦的该项能力已为-6级，此效果不会发动。若对方处于替身状态，双方的能力等级都不会降低。", // NEEDS QC
		shortDesc: "将受到的能力降低反弹给对方。", // NEEDS QC
	},
	mistysurge: {
		name: "薄雾制造者",
		shortDesc: "出场时布下薄雾场地。", // NEEDS QC
	},
	moldbreaker: {
		name: "破格",
		// Official flavor text: "可以不受对手特性的干扰， 向对手使出招式。"
		desc: "该宝可梦的招式及其效果无视其他宝可梦的一部分特性。可无视的特性包括：尾甲、芳香幕、气场破坏、战斗盔甲、健壮胸肌、防弹、恒净之躯、唱反调、湿气、鲜艳之躯、画皮、干燥皮肤、食土、过滤、引火、花之礼、花幕、毛茸茸、友情防守、毛皮大衣、黄金之躯、草之毛皮、看门犬、耐热、重金属、怪力钳、结冻头、冰鳞粉、发光、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、心眼、镜甲、电气引擎、多重鳞片、迟钝、防尘、我行我素、粉彩护幕、庞克摇滚、洁净之盐、女王的威严、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、甜幕、蹒跚、心灵感应、太晶甲壳、热交换、厚脂肪、纯朴、干劲、蓄电、储水、水泡、水幕、焦香之躯、白色烟雾、乘风、神奇守护、奇迹皮肤。此效果影响场上所有其他宝可梦，无论其是否为该宝可梦招式的目标，也无论其特性是否对该宝可梦有利。", // NEEDS QC
		shortDesc: "使出招式时无视对手的特性。", // NEEDS QC
		gen8: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为芳香幕、气场破坏、战斗盔甲、健壮胸肌、防弹、恒净之躯、唱反调、湿气、鲜艳之躯、画皮、干燥皮肤、过滤、引火、花之礼、花幕、毛茸茸、友情防守、毛皮大衣、草之毛皮、耐热、重金属、怪力钳、结冻头、冰鳞粉、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、镜甲、电气引擎、多重鳞片、迟钝、防尘、我行我素、粉彩护幕、庞克摇滚、女王的威严、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、甜幕、蹒跚、心灵感应、厚脂肪、纯朴、干劲、蓄电、储水、水泡、水幕、白色烟雾、神奇守护、奇迹皮肤。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标，也无论该特性对该宝可梦是否有利。", // NEEDS QC
		},
		gen7: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为芳香幕、气场破坏、战斗盔甲、健壮胸肌、防弹、恒净之躯、唱反调、湿气、暗黑气场、鲜艳之躯、画皮、干燥皮肤、妖精气场、过滤、引火、花之礼、花幕、毛茸茸、友情防守、毛皮大衣、草之毛皮、耐热、重金属、怪力钳、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、电气引擎、多重鳞片、迟钝、防尘、我行我素、女王的威严、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、甜幕、蹒跚、心灵感应、厚脂肪、纯朴、干劲、蓄电、储水、水泡、水幕、白色烟雾、神奇守护、奇迹皮肤。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标，也无论该特性对该宝可梦是否有利。", // NEEDS QC
		},
		gen6: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为芳香幕、气场破坏、战斗盔甲、健壮胸肌、防弹、恒净之躯、唱反调、湿气、暗黑气场、干燥皮肤、妖精气场、过滤、引火、花之礼、花幕、友情防守、毛皮大衣、草之毛皮、耐热、重金属、怪力钳、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、电气引擎、多重鳞片、迟钝、防尘、我行我素、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、甜幕、蹒跚、心灵感应、厚脂肪、纯朴、干劲、蓄电、储水、水幕、白色烟雾、神奇守护、奇迹皮肤。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标，也无论该特性对该宝可梦是否有利。", // NEEDS QC
		},
		gen5: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为战斗盔甲、健壮胸肌、恒净之躯、唱反调、湿气、干燥皮肤、过滤、引火、花之礼、友情防守、耐热、重金属、怪力钳、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、电气引擎、多重鳞片、迟钝、我行我素、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、蹒跚、心灵感应、厚脂肪、纯朴、干劲、蓄电、储水、水幕、白色烟雾、神奇守护、奇迹皮肤。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标，也无论该特性对该宝可梦是否有利。", // NEEDS QC
		},
		gen4: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为战斗盔甲、恒净之躯、湿气、干燥皮肤、过滤、引火、花之礼、耐热、怪力钳、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、避雷针、柔软、熔岩铠甲、神奇鳞片、电气引擎、迟钝、我行我素、沙隐、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、蹒跚、厚脂肪、纯朴、干劲、蓄电、储水、水幕、白色烟雾、神奇守护。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标。不会无视队友的特性花之礼带来的攻击修正。", // NEEDS QC
		},

		start: "  {POKEMON}打破了常规！",
	},
	moody: {
		name: "心情不定",
		// Official flavor text: "每一回合，能力中的某项 会大幅提高，而某项会降低。"
		desc: "每回合结束时，该宝可梦随机一项能力（命中率和回避率除外）提高2级，另一项能力降低1级。", // NEEDS QC
		shortDesc: "每回合随机1项能力+2，另1项能力-1。", // NEEDS QC
		gen7: {
			desc: "每回合结束时，随机一项能力提高2级，另一项能力降低1级。", // NEEDS QC
			shortDesc: "每回合结束时，随机一项能力提高2级，另一项降低1级。", // NEEDS QC
		},
	},
	motordrive: {
		name: "电气引擎",
		// Official flavor text: "受到电属性的招式攻击时， 不会受到伤害，而是速度会提高。"
		desc: "该宝可梦不受电属性招式影响，且被电属性招式击中时速度提高1级。", // NEEDS QC
		shortDesc: "免疫电属性招式，且速度提高1级。", // NEEDS QC
	},
	moxie: {
		name: "自信过度",
		// Official flavor text: "如果打倒对手， 就会充满自信，攻击会提高。"
		desc: "该宝可梦使其他宝可梦濒死时，攻击提高1级。", // NEEDS QC
		shortDesc: "打倒对手后，攻击提高1级。", // NEEDS QC
	},
	multiscale: {
		name: "多重鳞片",
		shortDesc: "HP全满时，受到的伤害减半。", // NEEDS QC
	},
	multitype: {
		name: "多属性",
		shortDesc: "阿尔宙斯的属性随携带的属性板变化。", // NEEDS QC
		gen7: {
			shortDesc: "是阿尔宙斯时，属性随携带的属性板或Z纯晶变化。", // NEEDS QC
		},
		gen6: {
			shortDesc: "阿尔宙斯的属性随携带的属性板变化。", // NEEDS QC
		},
		gen4: {
			desc: "若该宝可梦是阿尔宙斯，其属性随携带的属性板变化。该宝可梦不会因其他宝可梦的攻击而失去携带的道具。", // NEEDS QC
		},
	},
	mummy: {
		name: "木乃伊",
		// Official flavor text: "被对手接触到后， 会将对手变为木乃伊。"
		desc: "与该宝可梦直接接触的宝可梦，特性会变为木乃伊。特性为人马一体、牵绊变身、绝对睡眠、画皮、一口导弹、结冻头、多属性、木乃伊、群聚变形、ＡＲ系统、鱼群、界限盾壳、战斗切换、太晶变形、达摩模式、全能变身的宝可梦不受影响。", // NEEDS QC
		shortDesc: "接触自己的对手特性变为此特性。", // NEEDS QC
		gen8: {
			desc: "用接触类招式攻击该宝可梦的宝可梦，特性变为木乃伊。对特性为人马一体、牵绊变身、绝对睡眠、画皮、一口导弹、结冻头、多属性、木乃伊、群聚变形、ＡＲ系统、鱼群、界限盾壳、战斗切换、达摩模式的宝可梦无效。", // NEEDS QC
		},
		gen7: {
			desc: "用接触类招式攻击该宝可梦的宝可梦，特性变为木乃伊。对特性为牵绊变身、绝对睡眠、画皮、多属性、木乃伊、群聚变形、ＡＲ系统、鱼群、界限盾壳、战斗切换、达摩模式的宝可梦无效。", // NEEDS QC
		},
		gen6: {
			desc: "用接触类招式攻击该宝可梦的宝可梦，特性变为木乃伊。对特性为多属性、木乃伊、战斗切换的宝可梦无效。", // NEEDS QC
		},
		gen5: {
			desc: "用接触类招式攻击该宝可梦的宝可梦，特性变为木乃伊。对特性为多属性、木乃伊的宝可梦无效。", // NEEDS QC
		},

		changeAbility: "  {TARGET}的特性变成了木乃伊！",
	},
	myceliummight: {
		name: "菌丝之力",
		desc: "该宝可梦的变化招式无视其他宝可梦的一部分特性，并且在使用相同或更高优先度招式的宝可梦中最后行动。", // NEEDS QC
		shortDesc: "变化招式在相同优先度中最后使出，但无视特性。", // NEEDS QC
	},
	naturalcure: {
		name: "自然回复",
		shortDesc: "交换下场时治愈异常状态。", // NEEDS QC

		activate: "  ({POKEMON}因自然回复治好了异常状态！)", // NEEDS QC
	},
	neuroforce: {
		name: "脑核之力",
		// Official flavor text: "效果绝佳的攻击， 威力会变得更强。"
		desc: "该宝可梦使用效果绝佳的攻击时，伤害变为1.25倍。", // NEEDS QC
		shortDesc: "效果绝佳的攻击伤害变为1.25倍。", // NEEDS QC
	},
	neutralizinggas: {
		name: "化学变化气体",
		// Official flavor text: "特性为化学变化气体的宝可梦在场时， 场上所有宝可梦的 特性效果都会消失或者无法生效。"
		desc: "该宝可梦在场时，所有特性无效。此特性先于陷阱和其他特性发动。不影响人马一体、牵绊变身、绝对睡眠、画皮、一口导弹、结冻头、多属性、群聚变形、ＡＲ系统、鱼群、界限盾壳、战斗切换、太晶变形、达摩模式、全能变身、化学变化气体的特性。", // NEEDS QC
		shortDesc: "在场时，所有特性无效。", // NEEDS QC
		gen8: {
			desc: "该宝可梦在场期间，特性都失去效果。此特性在陷阱和其他特性生效前发动。对特性为人马一体、牵绊变身、绝对睡眠、画皮、一口导弹、结冻头、多属性、化学变化气体、群聚变形、ＡＲ系统、鱼群、界限盾壳、战斗切换、达摩模式的宝可梦无效。", // NEEDS QC
		},

		start: "  周围充满了化学变化气体！",
		end: "  化学变化气体的效果消失了！",
	},
	noguard: {
		name: "无防守",
		shortDesc: "自己使出和受到的招式都必定命中。", // NEEDS QC
	},
	normalize: {
		name: "一般皮肤",
		// Official flavor text: "无论是什么属性的招式， 全部会变为一般属性。 威力会少量提高。"
		desc: "该宝可梦的招式全部变为一般属性，威力变为1.2倍。此效果在其他改变招式属性的效果之前适用。", // NEEDS QC
		shortDesc: "所有招式变为一般属性，威力1.2倍。", // NEEDS QC
		gen6: {
			desc: "该宝可梦的招式变为一般属性。此效果在其他改变招式属性的效果之前适用。", // NEEDS QC
			shortDesc: "该宝可梦的招式变为一般属性。", // NEEDS QC
		},
		gen4: {
			desc: "该宝可梦的招式变为一般属性。此效果在除挣扎外其他改变招式属性的效果之后适用。", // NEEDS QC
		},
	},
	oblivious: {
		name: "迟钝",
		// Official flavor text: "因为感觉迟钝， 不会变为着迷和被挑衅状态。"
		desc: "该宝可梦不会陷入着迷状态，也不会被挑衅。在着迷或被挑衅时获得此特性会将其治愈。不受特性威吓的影响。", // NEEDS QC
		shortDesc: "不会着迷或被挑衅。不受威吓影响。", // NEEDS QC
		gen7: {
			desc: "该宝可梦不会陷入着迷状态或受挑衅影响。在着迷或挑衅效果中获得此特性时会解除。", // NEEDS QC
			shortDesc: "不会陷入着迷状态或受挑衅影响。", // NEEDS QC
		},
		gen5: {
			desc: "该宝可梦不会陷入着迷状态。在着迷状态中获得此特性时会解除。", // NEEDS QC
			shortDesc: "不会陷入着迷状态。着迷中获得此特性时会解除。", // NEEDS QC
		},
	},
	opportunist: {
		name: "跟风",
		shortDesc: "对手提高能力等级时，自己也复制该变化。", // NEEDS QC
	},
	orichalcumpulse: {
		name: "绯红脉动",
		shortDesc: "出场时召唤大晴天，大晴天期间攻击变为1.3333倍。", // NEEDS QC

		start: "  {POKEMON}令日照变强，激起了古代的脉动！",
		activate: "  {POKEMON}受到日照而激起了古代的脉动！！",
	},
	overcoat: {
		name: "防尘",
		// Official flavor text: "不会受到沙暴或冰雹等的伤害。 不会受到粉末类招式的攻击。"
		desc: "该宝可梦不受粉末类招式、沙暴的伤害以及愤怒粉和特性孢子的影响。", // NEEDS QC
		shortDesc: "不受粉末类招式、沙暴伤害和孢子影响。", // NEEDS QC
		gen8: {
			desc: "该宝可梦不受粉末类招式、沙暴或冰雹的伤害以及愤怒粉和特性孢子的影响。", // NEEDS QC
			shortDesc: "不受粉末类招式、沙暴/冰雹伤害和孢子影响。", // NEEDS QC
		},
		gen5: {
			desc: "该宝可梦不受沙暴或冰雹的伤害。", // NEEDS QC
			shortDesc: "不受沙暴或冰雹的伤害。", // NEEDS QC
		},
	},
	overgrow: {
		name: "茂盛",
		// Official flavor text: "ＨＰ减少的时候， 草属性的招式威力会提高。"
		desc: "该宝可梦的HP为最大HP的1/3（向下取整）或以下时，其使用草属性攻击时进攻能力变为1.5倍。", // NEEDS QC
		shortDesc: "HP为1/3以下时，草属性攻击的进攻能力变为1.5倍。", // NEEDS QC
		gen4: {
			desc: "该宝可梦的HP为最大HP的1/3（向下取整）以下时，其草属性攻击招式的威力变为1.5倍。", // NEEDS QC
			shortDesc: "HP为1/3以下时，草属性攻击的威力变为1.5倍。", // NEEDS QC
		},
	},
	owntempo: {
		name: "我行我素",
		// Official flavor text: "因为我行我素， 不会变为混乱状态。"
		desc: "该宝可梦不会陷入混乱状态。在混乱时获得此特性会将其治愈。不受特性威吓的影响。", // NEEDS QC
		shortDesc: "不会混乱。不受威吓影响。", // NEEDS QC
		gen7: {
			desc: "该宝可梦不会陷入混乱状态。在混乱状态中获得此特性时会解除。", // NEEDS QC
			shortDesc: "该宝可梦不会陷入混乱状态。", // NEEDS QC
		},
	},
	parentalbond: {
		name: "亲子爱",
		// Official flavor text: "亲子俩可以合计攻击２次。"
		desc: "该宝可梦的攻击招式变为攻击2次的连续攻击招式，第2次攻击的伤害变为1/4。对破灭之愿、龙箭、极巨炮、蛮干、大爆炸、搏命、投掷、预知未来、冰球、滚动、自爆、连续攻击招式、以多个目标为对象的招式和需要2回合的招式无效。", // NEEDS QC
		shortDesc: "攻击招式命中2次，第2次伤害为1/4。", // NEEDS QC
		gen8: {
			desc: "该宝可梦的攻击招式变为攻击2次的连续招式。第2次攻击的伤害变为1/4。对破灭之愿、龙箭、极巨炮、蛮干、大爆炸、搏命、投掷、预知未来、冰球、滚动、自爆、连续攻击招式、以多个对象为目标的招式、需2回合的招式、极巨招式不发动。", // NEEDS QC
		},
		gen7: {
			desc: "该宝可梦的攻击招式变为攻击2次的连续招式。第2次攻击的伤害变为1/4。对破灭之愿、蛮干、大爆炸、搏命、投掷、预知未来、冰球、滚动、自爆、连续攻击招式、以多个对象为目标的招式、需2回合的招式、Z招式不发动。", // NEEDS QC
		},
		gen6: {
			desc: "该宝可梦的攻击招式变为攻击2次的连续招式。第2次攻击的伤害变为一半。对破灭之愿、蛮干、大爆炸、搏命、投掷、预知未来、冰球、滚动、自爆、连续攻击招式、以多个对象为目标的招式、需2回合的招式不发动。", // NEEDS QC
			shortDesc: "攻击招式攻击2次。第2次伤害减半。", // NEEDS QC
		},
	},
	pastelveil: {
		name: "粉彩护幕",
		// Official flavor text: "自己和同伴都不会 陷入中毒的异常状态。"
		desc: "该宝可梦及其队友不会陷入中毒状态。自身或队友中毒时获得此特性会将其治愈。若在引发中毒的效果中此特性被无视，该宝可梦会立即被治愈，但队友不会。", // NEEDS QC
		shortDesc: "自己和队友不会陷入中毒状态。", // NEEDS QC
	},
	perishbody: {
		name: "灭亡之躯",
		// Official flavor text: "受到接触类招式攻击时， 双方都会在３回合后变为濒死状态。 替换后效果消失。"
		desc: "与该宝可梦直接接触时，该宝可梦和攻击方都会进入灭亡之歌的效果。若攻击方已有灭亡计数，该宝可梦不会进入此效果。", // NEEDS QC
		shortDesc: "被接触时，双方进入灭亡之歌的效果。", // NEEDS QC

		start: "  双方将在３回合后灭亡！",
	},
	pickpocket: {
		name: "顺手牵羊",
		// Official flavor text: "盗取接触到自己的 对手的道具。"
		desc: "若该宝可梦没有携带道具，被接触类招式击中时会偷取攻击方的道具。此效果在连续攻击招式的所有攻击结束后判定。若招式的追加效果被特性强行消除，则此效果不会发动。", // NEEDS QC
		shortDesc: "未携带道具时被接触，夺取攻击方的道具。", // NEEDS QC
	},
	pickup: {
		name: "捡拾",
		// Official flavor text: "有时会捡来对手用过的道具， 冒险过程中也会捡到。"
		desc: "每回合结束时，若该宝可梦没有携带道具，且相邻的宝可梦中至少有一只在此回合使用过道具，会随机选择其中一只，获得其最后使用的道具。以下情况不视为最后使用的道具：破裂的气球、被其他具有此特性的宝可梦捡走的道具、因虫咬、腐蚀气体、渴望、烧尽、拍落、啄食、小偷而失去的道具。用投掷投掷的道具可以捡到。", // NEEDS QC
		shortDesc: "未携带道具时，捡走本回合被使用的道具。", // NEEDS QC
		gen7: {
			desc: "每回合结束时，若该宝可梦没有携带道具且相邻的宝可梦本回合使用过道具，则随机选择其中1只，获得其最后使用的道具。破裂的气球、被其他拥有此特性的宝可梦捡走的道具、因虫咬、渴望、烧尽、拍落、啄食、小偷失去的道具不视为最后使用的道具。用投掷投掷的道具可以捡取。", // NEEDS QC
		},
		gen4: {
			desc: "没有对战效果。", // NEEDS QC
			shortDesc: "没有对战效果。", // NEEDS QC
		},

		addItem: "#recycle",
	},
	piercingdrill: {
		name: "贯穿钻",
		shortDesc: "接触类招式可穿透守护，造成1/4伤害。", // NEEDS QC
	},
	pixilate: {
		name: "妖精皮肤",
		// Official flavor text: "一般属性的招式 会变为妖精属性。 威力会少量提高。"
		desc: "该宝可梦的一般属性招式变为妖精属性，威力变为1.2倍。此效果在其他改变招式属性的效果之后、等离子浴和输电的效果之前适用。", // NEEDS QC
		shortDesc: "一般属性招式变为妖精属性，威力1.2倍。", // NEEDS QC
		gen6: {
			desc: "该宝可梦的一般属性招式变为妖精属性，威力变为1.3倍。此效果在其他改变招式属性的效果之后、等离子浴和输电的效果之前适用。", // NEEDS QC
			shortDesc: "该宝可梦的一般属性招式变为妖精属性，威力1.3倍。", // NEEDS QC
		},
	},
	plus: {
		name: "正电",
		// Official flavor text: "出场的伙伴之间 如果有正电或负电特性的宝可梦， 自己的特攻会提高。"
		desc: "若在场队友的特性为此特性或负电，该宝可梦的特攻变为1.5倍。", // NEEDS QC
		shortDesc: "场上队友有负电或此特性时，特攻变为1.5倍。", // NEEDS QC
		gen4: {
			desc: "在场的队友特性为负电时，该宝可梦的特攻变为1.5倍。", // NEEDS QC
			shortDesc: "队友的特性为负电时，特攻变为1.5倍。", // NEEDS QC
		},
		gen3: {
			desc: "场上有特性为负电的宝可梦时，该宝可梦的特攻变为1.5倍。", // NEEDS QC
			shortDesc: "场上有特性为负电的宝可梦时，特攻变为1.5倍。", // NEEDS QC
		},
	},
	poisonheal: {
		name: "毒疗",
		// Official flavor text: "变为中毒状态时， ＨＰ不会减少，反而会增加起来。"
		desc: "该宝可梦处于中毒状态时，不会失去HP，反而在每回合结束时回复最大HP的1/8（向下取整）。", // NEEDS QC
		shortDesc: "中毒时不掉血，反而每回合回复1/8HP。", // NEEDS QC
	},
	poisonpoint: {
		name: "毒刺",
		shortDesc: "有30%的几率使接触自己的对手中毒。", // NEEDS QC
		gen4: {
			desc: "用接触类招式攻击该宝可梦的宝可梦有30%的几率陷入中毒状态。该攻击未造成HP损失时不触发。", // NEEDS QC
		},
		gen3: {
			desc: "用接触类招式攻击该宝可梦的宝可梦有1/3的几率陷入中毒状态。该攻击未造成HP损失时不触发。", // NEEDS QC
			shortDesc: "有1/3的几率使接触的宝可梦中毒。", // NEEDS QC
		},
	},
	poisonpuppeteer: {
		name: "毒傀儡",
		desc: "若该宝可梦是桃歹郎，其使目标陷入中毒或剧毒状态时，目标还会陷入混乱状态。", // NEEDS QC
		shortDesc: "（桃歹郎专用）使中毒的对手同时陷入混乱。", // NEEDS QC
	},
	poisontouch: {
		name: "毒手",
		// Official flavor text: "只通过接触就有可能 让对手变为中毒状态。"
		desc: "该宝可梦的接触类招式有30%的几率使目标中毒。此效果在招式本身的追加效果几率之后判定。", // NEEDS QC
		shortDesc: "接触类招式有30%的几率使对手中毒。", // NEEDS QC
	},
	powerconstruct: {
		name: "群聚变形",
		// Official flavor text: "ＨＰ变为一半时， 细胞们会赶来支援， 变为完全体形态。"
		desc: "若该宝可梦是10%形态或50%形态的基格尔德，回合结束时HP为最大HP的1/2或以下时，变为完全体形态。", // NEEDS QC
		shortDesc: "10%/50%基格尔德在回合结束时HP为1/2以下则变为完全体形态。", // NEEDS QC

		activate: "  你感受到了大量的气息……！",
		transform: "{POKEMON}变成了完全体形态！",
	},
	powerofalchemy: {
		name: "化学之力",
		// Official flavor text: "继承被打倒的同伴的特性， 变为相同的特性。"
		desc: "该宝可梦复制濒死队友的特性。无法复制的特性包括：人马一体、牵绊变身、绝对睡眠、发号施令、画皮、面影辉映、花之礼、阴晴不定、饱了又饿、结冻头、幻觉、变身者、多属性、化学变化气体、毒傀儡、群聚变形、化学之力、古代活性、夸克充能、接球手、ＡＲ系统、鱼群、界限盾壳、战斗切换、太晶甲壳、太晶变形、归零化境、复制、神奇守护、达摩模式、全能变身。", // NEEDS QC
		shortDesc: "复制濒死队友的特性。", // NEEDS QC
		gen8: {
			desc: "复制濒死队友的特性。人马一体、牵绊变身、绝对睡眠、画皮、花之礼、阴晴不定、一口导弹、饱了又饿、结冻头、幻觉、变身者、多属性、化学变化气体、群聚变形、化学之力、接球手、ＡＲ系统、鱼群、界限盾壳、战斗切换、复制、神奇守护、达摩模式无法复制。", // NEEDS QC
		},
		gen7: {
			desc: "复制濒死队友的特性。牵绊变身、绝对睡眠、画皮、花之礼、阴晴不定、幻觉、变身者、多属性、群聚变形、化学之力、接球手、ＡＲ系统、鱼群、界限盾壳、战斗切换、复制、神奇守护、达摩模式无法复制。", // NEEDS QC
		},

		changeAbility: "#receiver",
	},
	powerspot: {
		name: "能量点",
		// Official flavor text: "只要处在相邻位置， 招式的威力就会提高。"
		desc: "该宝可梦的队友的招式威力变为1.3倍。对破灭之愿和预知未来也有效，即使使用者不在场上。", // NEEDS QC
		shortDesc: "队友的招式威力变为1.3倍。", // NEEDS QC
	},
	prankster: {
		name: "恶作剧之心",
		// Official flavor text: "可以率先使出变化招式。"
		desc: "该宝可梦的变化招式优先度+1。若招式的最终使用者具有此特性，恶属性的对手不受这些招式以及由这些招式调用的招式的影响。", // NEEDS QC
		shortDesc: "变化招式优先度+1，但对恶属性无效。", // NEEDS QC
		gen6: {
			desc: "该宝可梦不造成伤害的招式优先度+1。", // NEEDS QC
			shortDesc: "该宝可梦不造成伤害的招式优先度+1。", // NEEDS QC
		},
	},
	pressure: {
		name: "压迫感",
		// Official flavor text: "给予对手压迫感， 大量减少其使用招式的ＰＰ。"
		desc: "该宝可梦成为对手招式的目标时，该招式额外消耗1点PP。对手使用封印、抢夺、太晶爆发时也额外消耗1点PP，但黏黏网不会。", // NEEDS QC
		shortDesc: "以自己为目标的招式额外消耗1点PP。", // NEEDS QC
		gen8: {
			desc: "该宝可梦成为对手招式的目标时，该招式额外减少1点PP。对手使用的封印和抢夺也额外减少1点PP，但黏黏网不会。", // NEEDS QC
		},
		gen5: {
			desc: "该宝可梦成为对手招式的目标时，该招式额外减少1点PP。对手使用的封印和抢夺也额外减少1点PP。", // NEEDS QC
		},
		gen4: {
			desc: "该宝可梦成为其他宝可梦招式的目标时，该招式额外减少1点PP。", // NEEDS QC
			shortDesc: "以该宝可梦为目标的招式额外减少1点PP。", // NEEDS QC
		},

		start: "  从{POKEMON}的身上感到了一种压迫感！",
	},
	primordialsea: {
		name: "始源之海",
		// Official flavor text: "变为不会受到 火属性攻击的天气。"
		desc: "出场时，天气变为大雨。大雨包含下雨的所有效果，并使火属性攻击招式无法使用。此天气持续到场上没有宝可梦具有此特性为止，或被特性德尔塔气流、终结之地改变为止。", // NEEDS QC
		shortDesc: "出场时下起大雨，直到此特性不在场为止。", // NEEDS QC
	},
	prismarmor: {
		name: "棱镜装甲",
		shortDesc: "受到的效果绝佳伤害变为3/4。", // NEEDS QC
	},
	propellertail: {
		name: "螺旋尾鳍",
		shortDesc: "招式的目标不会被变更。", // NEEDS QC
	},
	protean: {
		name: "变幻自如",
		// Official flavor text: "变为与自己使出的招式 相同的属性。"
		desc: "该宝可梦的属性变为其即将使用的招式的属性。此效果在所有改变招式属性的效果之后适用。每次出场只能发动1次，且太晶化后不会发动。", // NEEDS QC
		shortDesc: "属性变为自己使出的招式属性。每次出场1次。", // NEEDS QC
		gen8: {
			desc: "该宝可梦的属性变为即将使用的招式的属性。此效果在所有改变招式属性的效果之后适用。", // NEEDS QC
			shortDesc: "该宝可梦的属性变为即将使用的招式的属性。", // NEEDS QC
		},
	},
	protosynthesis: {
		name: "古代活性",
		desc: "大晴天时，或该宝可梦使用携带的驱劲能量时，其数值最高的能力变为1.3倍（若最高的是速度则变为1.5倍）。此特性发动时考虑能力等级变化。若多项能力相同，按攻击、防御、特攻、特防、速度的顺序优先。若此效果由大晴天发动，携带的驱劲能量不会发动，且大晴天结束时此效果结束。若此效果由携带的驱劲能量发动，该宝可梦离场时效果结束。", // NEEDS QC
		shortDesc: "大晴天或驱劲能量发动时，最高能力1.3倍（速度则1.5倍）。", // NEEDS QC

		activate: "  {POKEMON}通过大晴天发动了古代活性！",
		activateFromItem: "  {POKEMON}通过驱劲能量发动了古代活性！",
		start: "  {POKEMON}的{STAT}升高了！",
		end: "  {POKEMON}古代活性的效果消失了！",
	},
	psychicsurge: {
		name: "精神制造者",
		shortDesc: "出场时布下精神场地。", // NEEDS QC
	},
	punkrock: {
		name: "庞克摇滚",
		// Official flavor text: "声音招式的威力会提高。 受到的声音招式伤害会减半。"
		desc: "该宝可梦的声音类招式威力变为1.3倍。该宝可梦受到的声音类招式伤害减半。", // NEEDS QC
		shortDesc: "声音类招式威力1.3倍，受到的声音类伤害减半。", // NEEDS QC
	},
	purepower: {
		name: "瑜伽之力",
		shortDesc: "攻击变为2倍。", // NEEDS QC
	},
	purifyingsalt: {
		name: "洁净之盐",
		desc: "该宝可梦不会陷入异常状态，不受哈欠的影响。其他宝可梦对该宝可梦使用幽灵属性攻击时，计算伤害时进攻能力减半。", // NEEDS QC
		shortDesc: "不会陷入异常状态，受到的幽灵属性伤害减半。", // NEEDS QC
	},
	quarkdrive: {
		name: "夸克充能",
		desc: "电气场地存在时，或该宝可梦使用携带的驱劲能量时，其数值最高的能力变为1.3倍（若最高的是速度则变为1.5倍）。此特性发动时考虑能力等级变化。若多项能力相同，按攻击、防御、特攻、特防、速度的顺序优先。若此效果由电气场地发动，携带的驱劲能量不会发动，且电气场地结束时此效果结束。若此效果由携带的驱劲能量发动，该宝可梦离场时效果结束。", // NEEDS QC
		shortDesc: "电气场地或驱劲能量发动时，最高能力1.3倍（速度则1.5倍）。", // NEEDS QC

		activate: "  {POKEMON}通过电气场地发动了夸克充能！",
		activateFromItem: "  {POKEMON}通过驱劲能量发动了夸克充能！",
		start: "  {POKEMON}的{STAT}升高了！",
		end: "  {POKEMON}夸克充能的效果消失了！",
	},
	queenlymajesty: {
		name: "女王的威严",
		// Official flavor text: "向对手施加威慑力， 使其无法对我方使出先制招式。"
		desc: "对手使用的以该宝可梦或其队友为目标的先制招式无法生效。", // NEEDS QC
		shortDesc: "使对手指向己方的先制招式无效。", // NEEDS QC

		block: "#damp",
	},
	quickdraw: {
		name: "速击",
		shortDesc: "使用攻击招式时有30%的几率在相同优先度中先行动。", // NEEDS QC

		activate: "  速击使{POKEMON}行动变快了！",
	},
	quickfeet: {
		name: "飞毛腿",
		// Official flavor text: "变为异常状态时， 速度会提高。"
		desc: "该宝可梦处于异常状态时，速度变为1.5倍。其无视麻痹使速度减半的效果。", // NEEDS QC
		shortDesc: "有异常状态时速度1.5倍，且无视麻痹的减速。", // NEEDS QC
		gen6: {
			desc: "该宝可梦处于异常状态时，速度变为1.5倍。无视麻痹造成的速度降低。", // NEEDS QC
		},
	},
	raindish: {
		name: "雨盘",
		// Official flavor text: "下雨天气时， 会缓缓回复ＨＰ。"
		desc: "下雨时，该宝可梦在每回合结束时回复最大HP的1/16（向下取整）。携带万能伞时此效果不会发动。", // NEEDS QC
		shortDesc: "下雨时，每回合回复最大HP的1/16。", // NEEDS QC
		gen7: {
			desc: "天气为下雨时，每回合结束时回复最大HP的1/16（向下取整）。", // NEEDS QC
		},
	},
	rattled: {
		name: "胆怯",
		// Official flavor text: "受到恶属性、幽灵属性 和虫属性的招式攻击时， 会因胆怯而速度提高。"
		desc: "该宝可梦被虫、恶或幽灵属性攻击击中时，或受到对手特性威吓的影响时，速度提高1级。", // NEEDS QC
		shortDesc: "受到虫、恶、幽灵属性攻击或威吓时速度+1。", // NEEDS QC
		gen7: {
			desc: "该宝可梦受到虫、恶或幽灵属性攻击时，速度提高1级。", // NEEDS QC
			shortDesc: "受到虫/恶/幽灵属性攻击时，速度提高1级。", // NEEDS QC
		},
	},
	receiver: {
		name: "接球手",
		// Official flavor text: "继承被打倒的同伴的特性， 变为相同的特性。"
		desc: "该宝可梦复制濒死队友的特性。无法复制的特性包括：人马一体、牵绊变身、绝对睡眠、发号施令、画皮、面影辉映、花之礼、阴晴不定、饱了又饿、结冻头、幻觉、变身者、多属性、化学变化气体、毒傀儡、群聚变形、化学之力、古代活性、夸克充能、接球手、ＡＲ系统、鱼群、界限盾壳、战斗切换、太晶甲壳、太晶变形、归零化境、复制、神奇守护、达摩模式、全能变身。", // NEEDS QC
		shortDesc: "复制濒死队友的特性。", // NEEDS QC
		gen8: {
			desc: "复制濒死队友的特性。人马一体、牵绊变身、绝对睡眠、画皮、花之礼、阴晴不定、一口导弹、饱了又饿、结冻头、幻觉、变身者、多属性、化学变化气体、群聚变形、化学之力、接球手、ＡＲ系统、鱼群、界限盾壳、战斗切换、复制、神奇守护、达摩模式无法复制。", // NEEDS QC
		},
		gen7: {
			desc: "复制濒死队友的特性。牵绊变身、绝对睡眠、画皮、花之礼、阴晴不定、幻觉、变身者、多属性、群聚变形、化学之力、接球手、ＡＲ系统、鱼群、界限盾壳、战斗切换、复制、神奇守护、达摩模式无法复制。", // NEEDS QC
		},

		changeAbility: "  继承了{SOURCE}的{ABILITY}！",
	},
	reckless: {
		name: "舍身",
		// Official flavor text: "自己会因反作用力受伤的招式， 其威力会提高。"
		desc: "该宝可梦的具有反作用力伤害或失误自伤的攻击招式威力变为1.2倍。对挣扎无效。", // NEEDS QC
		shortDesc: "有反作用力伤害的招式威力变为1.2倍。", // NEEDS QC
	},
	refrigerate: {
		name: "冰冻皮肤",
		// Official flavor text: "一般属性的招式 会变为冰属性。 威力会少量提高。"
		desc: "该宝可梦的一般属性招式变为冰属性，威力变为1.2倍。此效果在其他改变招式属性的效果之后、等离子浴和输电的效果之前适用。", // NEEDS QC
		shortDesc: "一般属性招式变为冰属性，威力1.2倍。", // NEEDS QC
		gen6: {
			desc: "该宝可梦的一般属性招式变为冰属性，威力变为1.3倍。此效果在其他改变招式属性的效果之后、等离子浴和输电的效果之前适用。", // NEEDS QC
			shortDesc: "该宝可梦的一般属性招式变为冰属性，威力1.3倍。", // NEEDS QC
		},
	},
	regenerator: {
		name: "再生力",
		shortDesc: "交换下场时回复最大HP的1/3。", // NEEDS QC
	},
	ripen: {
		name: "熟成",
		// Official flavor text: "使树果成熟， 效果变为２倍。"
		desc: "该宝可梦吃掉某些树果时，效果翻倍。回复HP或PP的树果回复量翻倍，提高能力等级的树果提高量翻倍，伤害减半的树果改为使伤害变为1/4，嘉珍果和雾莲果使攻击方失去最大HP的1/4（向下取整）。", // NEEDS QC
		shortDesc: "树果的效果变为2倍。", // NEEDS QC
	},
	rivalry: {
		name: "斗争心",
		// Official flavor text: "面对性别相同的对手， 会燃起斗争心，变得更强。 而面对性别不同的，则会变弱。"
		desc: "该宝可梦攻击同性别的目标时威力变为1.25倍，攻击异性别的目标时威力变为0.75倍。自身或目标无性别时没有修正。", // NEEDS QC
		shortDesc: "对同性别威力1.25倍，对异性别0.75倍。", // NEEDS QC
	},
	rkssystem: {
		name: "ＡＲ系统",
		shortDesc: "银伴战兽的属性随携带的存储碟变化。", // NEEDS QC
	},
	rockhead: {
		name: "坚硬脑袋",
		// Official flavor text: "即使使出会受反作用力伤害的招式， ＨＰ也不会减少。"
		desc: "该宝可梦不受反作用力伤害（挣扎除外）。对生命宝珠的伤害和失误自伤无效。", // NEEDS QC
		shortDesc: "不受反作用力伤害。", // NEEDS QC
		gen3: {
			desc: "该宝可梦不受反作用力伤害，挣扎除外。无法防止落空时的伤害。", // NEEDS QC
			shortDesc: "不受挣扎和落空伤害以外的反作用力伤害。", // NEEDS QC
		},
	},
	rockypayload: {
		name: "搬岩",
		shortDesc: "岩石属性攻击的进攻能力变为1.5倍。", // NEEDS QC
	},
	roughskin: {
		name: "粗糙皮肤",
		// Official flavor text: "受到攻击时， 用粗糙的皮肤弄伤 接触到自己的对手。"
		desc: "与该宝可梦直接接触的宝可梦失去最大HP的1/8（向下取整）。", // NEEDS QC
		shortDesc: "接触自己的对手失去最大HP的1/8。", // NEEDS QC
		gen4: {
			desc: "用接触类招式攻击该宝可梦的宝可梦失去最大HP的1/8（向下取整）。该攻击未造成HP损失时不触发。", // NEEDS QC
		},
		gen3: {
			desc: "用接触类招式攻击该宝可梦的宝可梦失去最大HP的1/16（向下取整）。该攻击未造成HP损失时不触发。", // NEEDS QC
			shortDesc: "接触该宝可梦的宝可梦失去最大HP的1/16。", // NEEDS QC
		},

		damage: "  {POKEMON}受到了伤害！",
	},
	runaway: {
		name: "逃跑",
		shortDesc: "没有对战效果。", // NEEDS QC
	},
	sandforce: {
		name: "沙之力",
		// Official flavor text: "沙暴天气时， 岩石属性、地面属性 和钢属性的招式威力会提高。"
		desc: "沙暴时，该宝可梦的地面、岩石和钢属性攻击招式威力变为1.3倍。该宝可梦不受沙暴伤害。", // NEEDS QC
		shortDesc: "沙暴时地面、岩石、钢招式威力1.3倍，且免疫沙暴。", // NEEDS QC
	},
	sandrush: {
		name: "拨沙",
		// Official flavor text: "沙暴天气时， 速度会提高。"
		desc: "沙暴时，该宝可梦的速度变为2倍。该宝可梦不受沙暴伤害。", // NEEDS QC
		shortDesc: "沙暴时速度变为2倍，且免疫沙暴伤害。", // NEEDS QC
	},
	sandspit: {
		name: "吐沙",
		shortDesc: "受到攻击时召唤沙暴。", // NEEDS QC
		gen8: {
			desc: "该宝可梦受到攻击时，沙暴的效果开始。此效果在极巨招式和超极巨招式的效果之后发动。", // NEEDS QC
		},
	},
	sandstream: {
		name: "扬沙",
		shortDesc: "出场时召唤沙暴。", // NEEDS QC
	},
	sandveil: {
		name: "沙隐",
		// Official flavor text: "在沙暴的时候， 闪避率会提高。"
		desc: "沙暴时，以该宝可梦为目标的招式命中率变为0.8倍。该宝可梦不受沙暴伤害。", // NEEDS QC
		shortDesc: "沙暴时回避率变为1.25倍，且免疫沙暴伤害。", // NEEDS QC
	},
	sapsipper: {
		name: "食草",
		// Official flavor text: "受到草属性的招式攻击时， 不会受到伤害，而是攻击会提高。"
		desc: "该宝可梦不受草属性招式影响，且被草属性招式击中时攻击提高1级。", // NEEDS QC
		shortDesc: "免疫草属性招式，且攻击提高1级。", // NEEDS QC
	},
	schooling: {
		name: "鱼群",
		// Official flavor text: "ＨＰ多的时候会聚起来变强。 ＨＰ剩余量变少时， 群体会分崩离析。"
		desc: "出场时，若该宝可梦是等级20以上的弱丁鱼且剩余HP高于最大HP的1/4，变为弱丁鱼（鱼群的样子）。处于鱼群的样子时，HP降至最大HP的1/4或以下时，回合结束时变回单独的样子。处于单独的样子时，回合结束时HP高于最大HP的1/4时，变为鱼群的样子。", // NEEDS QC
		shortDesc: "弱丁鱼HP高于1/4时变为鱼群的样子。", // NEEDS QC

		transform: "{POKEMON}一群群地聚集起来了！",
		transformEnd: "{POKEMON}一群群地四散而去了！",
	},
	scrappy: {
		name: "胆量",
		// Official flavor text: "一般属性和格斗属性的招式 可以击中幽灵属性的宝可梦。"
		desc: "该宝可梦的一般属性和格斗属性招式可以击中幽灵属性宝可梦。不受特性威吓的影响。", // NEEDS QC
		shortDesc: "一般和格斗招式可命中幽灵属性。不受威吓影响。", // NEEDS QC
		gen7: {
			desc: "该宝可梦可以用一般和格斗属性招式命中幽灵属性宝可梦。", // NEEDS QC
			shortDesc: "可以用一般/格斗属性招式命中幽灵属性。", // NEEDS QC
		},
	},
	screencleaner: {
		name: "除障",
		shortDesc: "出场时消除双方的反射壁、光墙等。", // NEEDS QC
	},
	seedsower: {
		name: "掉出种子",
		shortDesc: "受到攻击时布下青草场地。", // NEEDS QC
	},
	serenegrace: {
		name: "天恩",
		// Official flavor text: "托天恩的福， 招式的追加效果容易出现。"
		desc: "该宝可梦招式的追加效果发动几率翻倍。此效果可与彩虹的效果叠加，但使目标畏缩的追加效果除外。", // NEEDS QC
		shortDesc: "招式追加效果的发动几率变为2倍。", // NEEDS QC
		gen4: {
			desc: "该宝可梦招式的追加效果发动几率变为2倍。", // NEEDS QC
		},
	},
	shadowshield: {
		name: "幻影防守",
		shortDesc: "HP全满时，受到的伤害减半。", // NEEDS QC
	},
	shadowtag: {
		name: "踩影",
		// Official flavor text: "踩住对手的影子 使其无法逃走或替换。"
		desc: "使对手无法选择交换。携带美丽空壳的宝可梦、幽灵属性宝可梦和同样具有此特性的宝可梦除外。", // NEEDS QC
		shortDesc: "使不具此特性的对手无法交换。", // NEEDS QC
		gen6: {
			desc: "使相邻的对手无法选择交换。携带美丽空壳的宝可梦、幽灵属性宝可梦和同样拥有此特性的宝可梦除外。", // NEEDS QC
			shortDesc: "使相邻的对手无法交换。拥有相同特性时除外。", // NEEDS QC
		},
		gen5: {
			desc: "使相邻的对手无法选择交换。携带美丽空壳的宝可梦和同样拥有此特性的宝可梦除外。", // NEEDS QC
		},
		gen4: {
			desc: "使对手无法选择交换。携带美丽空壳的宝可梦和同样拥有此特性的宝可梦除外。", // NEEDS QC
			shortDesc: "使不具此特性的对手无法交换。", // NEEDS QC
		},
		gen3: {
			desc: "使对手无法选择交换。", // NEEDS QC
			shortDesc: "使对手无法选择交换。", // NEEDS QC
		},
	},
	sharpness: {
		name: "锋锐",
		shortDesc: "切割类招式威力变为1.5倍。", // NEEDS QC
	},
	shedskin: {
		name: "蜕皮",
		// Official flavor text: "通过蜕去身上的皮， 有时会治愈异常状态。"
		desc: "每回合结束时，该宝可梦有33%的几率治愈自身的异常状态。", // NEEDS QC
		shortDesc: "每回合有33%的几率治愈自己的异常状态。", // NEEDS QC
	},
	sheerforce: {
		name: "强行",
		// Official flavor text: "招式的追加效果消失， 但因此能以更高的威力使出招式。"
		desc: "该宝可梦具有追加效果的攻击招式威力变为1.3倍，但追加效果消失。若追加效果被消除，还会消除自身生命宝珠的反作用力伤害和贝壳之铃的回复，并使目标的特性愤怒甲壳、怒火冲天、变色、危险回避、顺手牵羊、跃跃欲逃以及红牌、逃脱按键、亚开果、香罗果不会发动。", // NEEDS QC
		shortDesc: "有追加效果的招式威力1.3倍，但追加效果消失。", // NEEDS QC
		gen8: {
			desc: "该宝可梦带有追加效果的攻击威力变为1.3倍，但失去追加效果。追加效果消失时，自身的生命宝珠反作用力和贝壳之铃回复也消失，并阻止对手的怒火冲天、变色、危险回避、顺手牵羊、跃跃欲逃、红牌、逃脱按键、亚开果、香罗果发动。", // NEEDS QC
		},
		gen6: {
			desc: "该宝可梦带有追加效果的攻击威力变为1.3倍，但失去追加效果。追加效果消失时，自身的生命宝珠反作用力和贝壳之铃回复也消失，并阻止对手的变色、顺手牵羊、红牌、逃脱按键、亚开果、香罗果发动。", // NEEDS QC
		},
		gen5: {
			desc: "该宝可梦带有追加效果的攻击威力变为1.3倍，但失去追加效果。追加效果消失时，自身的生命宝珠反作用力和贝壳之铃回复也消失，并阻止对手的变色、顺手牵羊、红牌、逃脱按键发动。", // NEEDS QC
		},
	},
	shellarmor: {
		name: "硬壳盔甲",
		shortDesc: "不会被击中要害。", // NEEDS QC
	},
	shielddust: {
		name: "鳞粉",
		// Official flavor text: "被鳞粉守护着， 不会受到招式的追加效果影响。"
		desc: "该宝可梦不受其他宝可梦攻击的追加效果影响。被防止的追加效果包括：有一定几率（即使是100%）使该宝可梦陷入麻痹、睡眠、冰冻、灼伤、中毒、混乱状态，使其畏缩，或降低其能力等级的效果，以及掷锚、诡异咒语、投掷、精神噪音、盐腌、缝影、糖浆炸弹、地狱突刺的效果。泡影的咏叹调的效果只有在该宝可梦是唯一目标时才会被防止。王者之证、锐利之牙以及特性毒手、恶臭、毒锁链附加的追加效果也会被防止。", // NEEDS QC
		shortDesc: "不受对手招式的追加效果影响。", // NEEDS QC
		gen8: {
			desc: "该宝可梦不受其他宝可梦攻击的追加效果影响。可以防止有几率（即使是100%）造成麻痹、睡眠、冰冻、灼伤、中毒、混乱、畏缩、能力下降的攻击以及掷锚、诡异咒语、投掷、缝影、地狱突刺的追加效果。该宝可梦是唯一目标时，也防止泡影的咏叹调的效果。也不受王者之证、锐利之牙以及特性毒手、恶臭附加的追加效果影响。", // NEEDS QC
		},
		gen7: {
			desc: "该宝可梦不受其他宝可梦攻击的追加效果影响。可以防止有几率（即使是100%）造成麻痹、睡眠、冰冻、灼伤、中毒、混乱、畏缩、能力下降的攻击以及掷锚、投掷、缝影、地狱突刺的追加效果。该宝可梦是唯一目标时，也防止泡影的咏叹调的效果。也不受王者之证、锐利之牙以及特性毒手、恶臭附加的追加效果影响。", // NEEDS QC
		},
		gen6: {
			desc: "该宝可梦不受其他宝可梦攻击的追加效果影响。可以防止有几率（即使是100%）造成麻痹、睡眠、冰冻、灼伤、中毒、混乱、畏缩、能力下降的攻击以及投掷的追加效果。也不受王者之证、锐利之牙以及特性毒手、恶臭附加的追加效果影响。", // NEEDS QC
		},
		gen4: {
			desc: "该宝可梦不受其他宝可梦攻击的追加效果影响。可以防止有几率（即使是100%）造成麻痹、睡眠、冰冻、灼伤、中毒、混乱、畏缩、能力下降的攻击以及投掷的追加效果。也不受王者之证和锐利之牙附加的追加效果影响。", // NEEDS QC
		},
		gen3: {
			desc: "该宝可梦不受其他宝可梦攻击的追加效果影响。可以防止有几率（即使是100%）造成麻痹、睡眠、冰冻、灼伤、中毒、混乱、畏缩、能力下降的攻击。也不受王者之证附加的追加效果影响。", // NEEDS QC
		},
	},
	shieldsdown: {
		name: "界限盾壳",
		// Official flavor text: "ＨＰ变为一半时， 壳会坏掉，变得有攻击性。"
		desc: "若该宝可梦是小陨星，HP为最大HP的1/2或以下时变为核心的样子，高于1/2时变为流星的样子。此判定在出场时和每回合结束时进行。处于流星的样子时，不会陷入异常状态，也不受哈欠的影响。", // NEEDS QC
		shortDesc: "小陨星HP为1/2以下时变为核心的样子。", // NEEDS QC

		transform: "界限盾壳启动！",
		transformEnd: "界限盾壳解除！",
	},
	simple: {
		name: "单纯",
		shortDesc: "能力等级的变化量变为2倍。", // NEEDS QC
		gen7: {
			desc: "该宝可梦的能力等级提高或降低时，幅度变为2倍。对使用变化类Z招式前Z力量带来的能力提升不适用。", // NEEDS QC
		},
		gen6: {
			desc: "该宝可梦的能力等级提高或降低时，幅度变为2倍。", // NEEDS QC
		},
		gen4: {
			desc: "计算能力时，该宝可梦的能力等级视为2倍。等级不会被视为高于6或低于-6。", // NEEDS QC
			shortDesc: "计算能力时，能力等级视为2倍。", // NEEDS QC
		},
	},
	skilllink: {
		name: "连续攻击",
		// Official flavor text: "如果使用连续招式， 总是能使出最高次数。"
		desc: "该宝可梦的连续攻击招式必定攻击最多次数。三连踢和三旋击的第2、3次攻击不进行命中判定。", // NEEDS QC
		shortDesc: "连续攻击招式必定攻击最多次数。", // NEEDS QC
		gen7: {
			desc: "该宝可梦的连续攻击招式必定攻击最多次数。三连踢的第2次和第3次攻击不进行命中判定。", // NEEDS QC
		},
		gen4: {
			desc: "该宝可梦的连续攻击招式必定攻击最多次数。对三连踢不发动。", // NEEDS QC
		},
	},
	slowstart: {
		name: "慢启动",
		shortDesc: "出场后5回合内，攻击和速度减半。", // NEEDS QC
		gen7: {
			desc: "出场后5回合内，攻击和速度减半。效果期间，使用基于特殊招式的通用Z招式时，伤害计算中特攻减半。", // NEEDS QC
		},
		gen6: {
			desc: "出场后5回合内，攻击和速度减半。", // NEEDS QC
		},

		start: "  {POKEMON}无法拿出平时的水平！",
		end: "  {POKEMON}恢复了平时的水平！",
	},
	slushrush: {
		name: "拨雪",
		shortDesc: "下雪时速度变为2倍。", // NEEDS QC
		gen8: {
			shortDesc: "冰雹时，该宝可梦的速度变为2倍。", // NEEDS QC
		},
	},
	sniper: {
		name: "狙击手",
		shortDesc: "击中要害时的伤害变为1.5倍。", // NEEDS QC
	},
	snowcloak: {
		name: "雪隐",
		// Official flavor text: "冰雹天气时， 闪避率会提高。"
		desc: "下雪时，以该宝可梦为目标的招式命中率变为0.8倍。", // NEEDS QC
		shortDesc: "下雪时回避率变为1.25倍。", // NEEDS QC
		gen8: {
			desc: "天气为冰雹时，以该宝可梦为目标的招式命中率变为0.8倍。不受冰雹的伤害。", // NEEDS QC
			shortDesc: "冰雹时回避率变为1.25倍。不受冰雹伤害。", // NEEDS QC
		},
	},
	snowwarning: {
		name: "降雪",
		shortDesc: "出场时召唤下雪。", // NEEDS QC
		gen8: {
			shortDesc: "出场时，使天气变为冰雹。", // NEEDS QC
		},
	},
	solarpower: {
		name: "太阳之力",
		// Official flavor text: "晴朗天气时， 特攻会提高， 而每回合ＨＰ会减少。"
		desc: "大晴天时，该宝可梦的特攻变为1.5倍，且每回合结束时失去最大HP的1/8（向下取整）。携带万能伞时这些效果不会发动。", // NEEDS QC
		shortDesc: "大晴天时特攻1.5倍，但每回合失去1/8HP。", // NEEDS QC
		gen7: {
			desc: "天气为大晴天时，该宝可梦的特攻变为1.5倍，且每回合结束时失去最大HP的1/8（向下取整）。", // NEEDS QC
		},
	},
	solidrock: {
		name: "坚硬岩石",
		shortDesc: "受到的效果绝佳伤害变为3/4。", // NEEDS QC
	},
	soulheart: {
		name: "魂心",
		shortDesc: "每当有宝可梦濒死，特攻提高1级。", // NEEDS QC
	},
	soundproof: {
		name: "隔音",
		shortDesc: "不受（自己以外的）声音类招式影响。", // NEEDS QC
		gen7: {
			shortDesc: "不受包括治愈铃声在内的声音类招式影响。", // NEEDS QC
		},
		gen5: {
			shortDesc: "不受除治愈铃声以外的声音类招式影响。", // NEEDS QC
		},
		gen4: {
			shortDesc: "不受包括治愈铃声在内的声音类招式影响。", // NEEDS QC
		},
	},
	speedboost: {
		name: "加速",
		// Official flavor text: "每一回合速度会变快。"
		desc: "该宝可梦在场上度过完整回合时，每回合结束时速度提高1级。", // NEEDS QC
		shortDesc: "每在场上度过1回合，速度提高1级。", // NEEDS QC
	},
	spicyspray: {
		name: "辣椒喷发",
		shortDesc: "使攻击自己的对手陷入灼伤状态。", // NEEDS QC
	},
	stakeout: {
		name: "蹲守",
		shortDesc: "对本回合交换出场的对手，进攻能力变为2倍。", // NEEDS QC
	},
	stall: {
		name: "慢出",
		shortDesc: "在相同优先度中最后行动。", // NEEDS QC
	},
	stalwart: {
		name: "坚毅",
		shortDesc: "招式的目标不会被变更。", // NEEDS QC
	},
	stamina: {
		name: "持久力",
		shortDesc: "受到招式伤害后，防御提高1级。", // NEEDS QC
	},
	stancechange: {
		name: "战斗切换",
		// Official flavor text: "如果使出攻击招式，会变为刀剑形态， 如果使出招式“王者盾牌”， 会变为盾牌形态。"
		desc: "若该宝可梦是坚盾剑怪，使用攻击招式前变为刀剑形态，使用王者盾牌前变为盾牌形态。", // NEEDS QC
		shortDesc: "坚盾剑怪攻击时变为刀剑形态，用王者盾牌时变为盾牌形态。", // NEEDS QC
		gen6: {
			desc: "该宝可梦是坚盾剑怪时，尝试使用攻击招式前变为刀剑形态，尝试使用王者盾牌前变为盾牌形态。", // NEEDS QC
		},

		transform: "刀剑形态，变形！",
		transformEnd: "盾牌形态，变形！",
	},
	static: {
		name: "静电",
		shortDesc: "有30%的几率使接触自己的对手麻痹。", // NEEDS QC
		gen4: {
			desc: "用接触类招式攻击该宝可梦的宝可梦有30%的几率陷入麻痹状态。该攻击未造成HP损失时不触发。", // NEEDS QC
		},
		gen3: {
			desc: "用接触类招式攻击该宝可梦的宝可梦有1/3的几率陷入麻痹状态。该攻击未造成HP损失时不触发。", // NEEDS QC
			shortDesc: "有1/3的几率使接触的宝可梦麻痹。", // NEEDS QC
		},
	},
	steadfast: {
		name: "不屈之心",
		shortDesc: "畏缩时速度提高1级。", // NEEDS QC
	},
	steamengine: {
		name: "蒸汽机",
		// Official flavor text: "受到水属性或 火属性的招式攻击时， 速度会巨幅提高。"
		desc: "该宝可梦受到火属性或水属性招式的伤害后，速度提高6级。", // NEEDS QC
		shortDesc: "受到火或水属性招式伤害后，速度提高6级。", // NEEDS QC
	},
	steelworker: {
		name: "钢能力者",
		shortDesc: "钢属性攻击的进攻能力变为1.5倍。", // NEEDS QC
	},
	steelyspirit: {
		name: "钢之意志",
		// Official flavor text: "我方的钢属性 攻击威力会提高。"
		desc: "该宝可梦及其队友的钢属性招式威力变为1.5倍。对破灭之愿也有效，即使使用者不在场上。", // NEEDS QC
		shortDesc: "己方的钢属性招式威力变为1.5倍。", // NEEDS QC
	},
	stench: {
		name: "恶臭",
		// Official flavor text: "通过释放臭臭的气味， 在攻击的时候， 有时会使对手畏缩。"
		desc: "该宝可梦的攻击招式若没有使目标畏缩的追加效果，则获得10%的几率使目标畏缩。", // NEEDS QC
		shortDesc: "没有畏缩效果的攻击招式获得10%的畏缩几率。", // NEEDS QC
		gen4: {
			desc: "没有对战效果。", // NEEDS QC
			shortDesc: "没有对战效果。", // NEEDS QC
		},
	},
	stickyhold: {
		name: "黏着",
		// Official flavor text: "因为道具是粘在黏性身体上的， 所以不会被对手夺走。"
		desc: "该宝可梦不会因其他宝可梦的特性或攻击而失去携带的道具，除非该攻击使其濒死。附着针仍会转移给其他宝可梦。", // NEEDS QC
		shortDesc: "不会因对手的特性或攻击失去道具。", // NEEDS QC
		gen4: {
			desc: "该宝可梦不会因其他宝可梦的攻击而失去携带的道具，即使因该攻击濒死也不会失去。附着针无视此特性，会转移给其他宝可梦。", // NEEDS QC
		},

		block: "  无法夺取{POKEMON}的道具！",
	},
	stormdrain: {
		name: "引水",
		// Official flavor text: "将水属性的招式引到自己身上， 不会受到伤害，而是会提高特攻。"
		desc: "该宝可梦不受水属性招式影响，且被水属性招式击中时特攻提高1级。其他宝可梦使用的单体水属性招式若不以该宝可梦为目标，且该宝可梦在其范围内，会被引到该宝可梦身上。若多只宝可梦可以用此特性引开招式，由速度最高的一只引开；速度相同时，由此特性生效更久的一只引开。", // NEEDS QC
		shortDesc: "吸引并免疫水属性招式，特攻提高1级。", // NEEDS QC
		gen4: {
			desc: "其他宝可梦对该宝可梦以外的单体目标使用水属性招式时，该招式被引到自己身上。", // NEEDS QC
			shortDesc: "将单体目标的水属性招式引到自己身上。", // NEEDS QC
		},

		activate: "#lightningrod",
	},
	strongjaw: {
		name: "强壮之颚",
		// Official flavor text: "因为颚部强壮， 啃咬类招式的威力会提高。"
		desc: "该宝可梦的牙类招式威力变为1.5倍。", // NEEDS QC
		shortDesc: "牙类招式威力变为1.5倍（虫咬除外）。", // NEEDS QC
	},
	sturdy: {
		name: "结实",
		// Official flavor text: "即使受到对手的招式攻击， 也不会被一击打倒。 一击必杀的招式也没有效果。"
		desc: "该宝可梦的HP全满时，受到攻击必定会留下至少1点HP。一击必杀招式对该宝可梦无效。", // NEEDS QC
		shortDesc: "HP全满时不会被一击打倒。免疫一击必杀。", // NEEDS QC
		gen4: {
			desc: "一击必杀招式对该宝可梦无效。", // NEEDS QC
			shortDesc: "一击必杀招式对该宝可梦无效。", // NEEDS QC
		},

		activate: "  {POKEMON}挺住了攻击！",
	},
	suctioncups: {
		name: "吸盘",
		shortDesc: "不会被对手的招式或道具强制交换。", // NEEDS QC

		block: "  {POKEMON}用吸盘吸住了！",
	},
	superluck: {
		name: "超幸运",
		shortDesc: "击中要害等级提高1级。", // NEEDS QC
	},
	supersweetsyrup: {
		name: "甘露之蜜",
		shortDesc: "出场时使对手的回避率降低1级。每场战斗1次。", // NEEDS QC

		start: "  {POKEMON}的蜜散发出了甜甜香气！",
	},
	supremeoverlord: {
		name: "大将",
		desc: "该宝可梦的招式威力变为1+(X×0.1)倍。X为此特性发动时己方宝可梦濒死的累计次数（最多5）。", // NEEDS QC
		shortDesc: "每有1只同伴濒死，招式威力+10%（最多5只）。", // NEEDS QC

		activate: "  {POKEMON}从被打倒的同伴身上得到力量了！",
	},
	surgesurfer: {
		name: "冲浪之尾",
		shortDesc: "电气场地时，速度变为2倍。", // NEEDS QC
	},
	swarm: {
		name: "虫之预感",
		// Official flavor text: "ＨＰ减少的时候， 虫属性的招式威力会提高。"
		desc: "该宝可梦的HP为最大HP的1/3（向下取整）或以下时，其使用虫属性攻击时进攻能力变为1.5倍。", // NEEDS QC
		shortDesc: "HP为1/3以下时，虫属性攻击的进攻能力变为1.5倍。", // NEEDS QC
		gen4: {
			desc: "该宝可梦的HP为最大HP的1/3（向下取整）以下时，其虫属性攻击招式的威力变为1.5倍。", // NEEDS QC
			shortDesc: "HP为1/3以下时，虫属性攻击的威力变为1.5倍。", // NEEDS QC
		},
	},
	sweetveil: {
		name: "甜幕",
		// Official flavor text: "我方的宝可梦 不会变为睡眠状态。"
		desc: "该宝可梦及其队友不会陷入睡眠状态，但已经睡着的不会立即醒来。该宝可梦及其队友无法成功使用睡觉，不会受到哈欠的影响，已受到哈欠效果的也不会睡着。", // NEEDS QC
		shortDesc: "自己和队友不会陷入睡眠状态。", // NEEDS QC

		block: "  {POKEMON}因甜幕而不会睡着！",
	},
	swiftswim: {
		name: "悠游自如",
		// Official flavor text: "下雨天气时， 速度会提高。"
		desc: "下雨时，该宝可梦的速度变为2倍。携带万能伞时此效果不会发动。", // NEEDS QC
		shortDesc: "下雨时速度变为2倍。", // NEEDS QC
		gen7: {
			desc: "天气为下雨时，该宝可梦的速度变为2倍。", // NEEDS QC
		},
	},
	swordofruin: {
		name: "灾祸之剑",
		shortDesc: "场上不具此特性的宝可梦防御变为0.75倍。", // NEEDS QC

		start: "  {POKEMON}的灾祸之剑令周围的宝可梦的防御减弱了！",
	},
	symbiosis: {
		name: "共生",
		// Official flavor text: "同伴使用道具时， 会把自己持有的道具传递给同伴。"
		desc: "队友使用道具后，该宝可梦立即将自己的道具交给该队友。若队友的道具是被夺走或被拍落的，或队友使用的是逃脱按键或避难背包，则不会发动。", // NEEDS QC
		shortDesc: "队友使用道具后，立即把自己的道具交给对方。", // NEEDS QC
		gen7: {
			desc: "队友使用道具后，该宝可梦立即将携带的道具交给该队友。队友的道具被夺走或拍落时，或队友使用了逃脱按键时不发动。", // NEEDS QC
		},
		gen6: {
			desc: "队友使用道具后，该宝可梦立即将携带的道具交给该队友。队友的道具被夺走或拍落时不发动。", // NEEDS QC
		},

		activate: "  {POKEMON}将{ITEM}交给了{TARGET}！",
	},
	synchronize: {
		name: "同步",
		// Official flavor text: "将自己的中毒、麻痹 或灼伤状态传染给对手。"
		desc: "该宝可梦被其他宝可梦施加灼伤、麻痹、中毒或剧毒状态时，对方也会陷入相同的异常状态。", // NEEDS QC
		shortDesc: "被施加灼伤、中毒或麻痹时，对方也陷入相同状态。", // NEEDS QC
		gen4: {
			desc: "其他宝可梦使该宝可梦陷入灼伤、麻痹或中毒状态时，该宝可梦也使其陷入相同的异常状态。其他宝可梦使该宝可梦陷入剧毒状态时，该宝可梦使其陷入中毒状态。", // NEEDS QC
		},
	},
	tabletsofruin: {
		name: "灾祸之简",
		shortDesc: "场上不具此特性的宝可梦攻击变为0.75倍。", // NEEDS QC

		start: "  {POKEMON}的灾祸之简令周围的宝可梦的攻击减弱了！",
	},
	tangledfeet: {
		name: "蹒跚",
		shortDesc: "混乱期间，回避率变为2倍。", // NEEDS QC
	},
	tanglinghair: {
		name: "卷发",
		shortDesc: "接触自己的对手速度降低1级。", // NEEDS QC
	},
	technician: {
		name: "技术高手",
		// Official flavor text: "攻击时可以将 低威力招式的威力提高。"
		desc: "该宝可梦威力60以下的招式威力变为1.5倍，包括挣扎。此效果在招式自身改变威力的效果之后适用。", // NEEDS QC
		shortDesc: "威力60以下的招式威力变为1.5倍，包括挣扎。", // NEEDS QC
		gen4: {
			desc: "该宝可梦威力60以下的招式威力变为1.5倍，挣扎除外。此效果在招式自身的威力变化以及充电、帮助的效果之后适用。", // NEEDS QC
			shortDesc: "威力60以下的招式威力变为1.5倍，挣扎除外。", // NEEDS QC
		},
	},
	telepathy: {
		name: "心灵感应",
		shortDesc: "不受队友攻击的伤害。", // NEEDS QC

		block: "  {POKEMON}不会受到同伴的攻击！",
	},
	teraformzero: {
		name: "归零化境",
		shortDesc: "（太乐巴戈斯专用）太晶化时消除天气和场地。每场战斗1次。", // NEEDS QC
	},
	terashell: {
		name: "太晶甲壳",
		desc: "若该宝可梦是HP全满的太乐巴戈斯，受到的攻击的属性相性变为0.5倍，除非该宝可梦对该招式免疫。连续攻击招式在整次攻击中保持相同的相性。", // NEEDS QC
		shortDesc: "（太乐巴戈斯专用）HP全满时，受击相性变为0.5倍。", // NEEDS QC

		activate: "  {POKEMON}让甲壳发出光辉，使属性相克发生扭曲！！",
	},
	terashift: {
		name: "太晶变形",
		shortDesc: "太乐巴戈斯出场时变为太晶形态。", // NEEDS QC

		transform: "{POKEMON}的样子发生了变化！",
	},
	teravolt: {
		name: "兆级电压",
		// Official flavor text: "可以不受对手特性的干扰， 向对手使出招式。"
		desc: "该宝可梦的招式及其效果无视其他宝可梦的一部分特性。可无视的特性包括：尾甲、芳香幕、气场破坏、战斗盔甲、健壮胸肌、防弹、恒净之躯、唱反调、湿气、鲜艳之躯、画皮、干燥皮肤、食土、过滤、引火、花之礼、花幕、毛茸茸、友情防守、毛皮大衣、黄金之躯、草之毛皮、看门犬、耐热、重金属、怪力钳、结冻头、冰鳞粉、发光、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、心眼、镜甲、电气引擎、多重鳞片、迟钝、防尘、我行我素、粉彩护幕、庞克摇滚、洁净之盐、女王的威严、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、甜幕、蹒跚、心灵感应、太晶甲壳、热交换、厚脂肪、纯朴、干劲、蓄电、储水、水泡、水幕、焦香之躯、白色烟雾、乘风、神奇守护、奇迹皮肤。此效果影响场上所有其他宝可梦，无论其是否为该宝可梦招式的目标，也无论其特性是否对该宝可梦有利。", // NEEDS QC
		shortDesc: "使出招式时无视对手的特性。", // NEEDS QC
		gen8: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为芳香幕、气场破坏、战斗盔甲、健壮胸肌、防弹、恒净之躯、唱反调、湿气、鲜艳之躯、画皮、干燥皮肤、过滤、引火、花之礼、花幕、毛茸茸、友情防守、毛皮大衣、草之毛皮、耐热、重金属、怪力钳、结冻头、冰鳞粉、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、镜甲、电气引擎、多重鳞片、迟钝、防尘、我行我素、粉彩护幕、庞克摇滚、女王的威严、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、甜幕、蹒跚、心灵感应、厚脂肪、纯朴、干劲、蓄电、储水、水泡、水幕、白色烟雾、神奇守护、奇迹皮肤。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标，也无论该特性对该宝可梦是否有利。", // NEEDS QC
		},
		gen7: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为芳香幕、气场破坏、战斗盔甲、健壮胸肌、防弹、恒净之躯、唱反调、湿气、暗黑气场、鲜艳之躯、画皮、干燥皮肤、妖精气场、过滤、引火、花之礼、花幕、毛茸茸、友情防守、毛皮大衣、草之毛皮、耐热、重金属、怪力钳、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、电气引擎、多重鳞片、迟钝、防尘、我行我素、女王的威严、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、甜幕、蹒跚、心灵感应、厚脂肪、纯朴、干劲、蓄电、储水、水泡、水幕、白色烟雾、神奇守护、奇迹皮肤。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标，也无论该特性对该宝可梦是否有利。", // NEEDS QC
		},
		gen6: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为芳香幕、气场破坏、战斗盔甲、健壮胸肌、防弹、恒净之躯、唱反调、湿气、暗黑气场、干燥皮肤、妖精气场、过滤、引火、花之礼、花幕、友情防守、毛皮大衣、草之毛皮、耐热、重金属、怪力钳、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、电气引擎、多重鳞片、迟钝、防尘、我行我素、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、甜幕、蹒跚、心灵感应、厚脂肪、纯朴、干劲、蓄电、储水、水幕、白色烟雾、神奇守护、奇迹皮肤。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标，也无论该特性对该宝可梦是否有利。", // NEEDS QC
		},
		gen5: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为战斗盔甲、健壮胸肌、恒净之躯、唱反调、湿气、干燥皮肤、过滤、引火、花之礼、友情防守、耐热、重金属、怪力钳、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、电气引擎、多重鳞片、迟钝、我行我素、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、蹒跚、心灵感应、厚脂肪、纯朴、干劲、蓄电、储水、水幕、白色烟雾、神奇守护、奇迹皮肤。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标，也无论该特性对该宝可梦是否有利。", // NEEDS QC
		},
		gen4: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为战斗盔甲、恒净之躯、湿气、干燥皮肤、过滤、引火、花之礼、耐热、怪力钳、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、避雷针、柔软、熔岩铠甲、神奇鳞片、电气引擎、迟钝、我行我素、沙隐、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、蹒跚、厚脂肪、纯朴、干劲、蓄电、储水、水幕、白色烟雾、神奇守护。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标。不会无视队友的特性花之礼带来的攻击修正。", // NEEDS QC
		},

		start: "  {POKEMON}正在释放溅射气场！",
	},
	thermalexchange: {
		name: "热交换",
		desc: "该宝可梦受到火属性招式的伤害后，攻击提高1级。该宝可梦不会陷入灼伤状态。在灼伤时获得此特性会将其治愈。", // NEEDS QC
		shortDesc: "受到火属性伤害时攻击+1。不会陷入灼伤。", // NEEDS QC
	},
	thickfat: {
		name: "厚脂肪",
		// Official flavor text: "因为被厚厚的脂肪保护着， 会让火属性和冰属性的招式伤害减半。"
		desc: "其他宝可梦对该宝可梦使用火属性或冰属性攻击时，计算伤害时进攻能力减半。", // NEEDS QC
		shortDesc: "受到的火和冰属性伤害减半。", // NEEDS QC
		gen4: {
			desc: "该宝可梦受到的火属性和冰属性攻击威力减半。", // NEEDS QC
			shortDesc: "受到的火/冰属性攻击威力减半。", // NEEDS QC
		},
		gen3: {
			desc: "其他宝可梦对该宝可梦使用火属性或冰属性攻击时，计算对该宝可梦的伤害时其特攻减半。", // NEEDS QC
			shortDesc: "对该宝可梦的火/冰属性攻击以减半的特攻计算伤害。", // NEEDS QC
		},
	},
	tintedlens: {
		name: "有色眼镜",
		shortDesc: "效果不好的招式伤害变为2倍。", // NEEDS QC
	},
	torrent: {
		name: "激流",
		// Official flavor text: "ＨＰ减少的时候， 水属性的招式威力会提高。"
		desc: "该宝可梦的HP为最大HP的1/3（向下取整）或以下时，其使用水属性攻击时进攻能力变为1.5倍。", // NEEDS QC
		shortDesc: "HP为1/3以下时，水属性攻击的进攻能力变为1.5倍。", // NEEDS QC
		gen4: {
			desc: "该宝可梦的HP为最大HP的1/3（向下取整）以下时，其水属性攻击招式的威力变为1.5倍。", // NEEDS QC
			shortDesc: "HP为1/3以下时，水属性攻击的威力变为1.5倍。", // NEEDS QC
		},
	},
	toughclaws: {
		name: "硬爪",
		shortDesc: "接触类招式威力变为1.3倍。", // NEEDS QC
	},
	toxicboost: {
		name: "中毒激升",
		// Official flavor text: "变为中毒状态时， 物理招式的威力会提高。"
		desc: "该宝可梦处于中毒状态时，其物理攻击的威力变为1.5倍。", // NEEDS QC
		shortDesc: "中毒时物理招式威力变为1.5倍。", // NEEDS QC
	},
	toxicchain: {
		name: "毒锁链",
		desc: "该宝可梦的攻击招式有30%的几率使目标陷入剧毒状态。此效果在招式本身的追加效果几率之前判定。", // NEEDS QC
		shortDesc: "攻击招式有30%的几率使对手剧毒。", // NEEDS QC
	},
	toxicdebris: {
		name: "毒满地",
		shortDesc: "受到物理攻击时，在对手方布下毒菱。", // NEEDS QC
	},
	trace: {
		name: "复制",
		// Official flavor text: "出场时，复制对手的特性， 变为与之相同的特性。"
		desc: "出场时，该宝可梦复制随机一个对手的特性。无法复制的特性包括：人马一体、牵绊变身、绝对睡眠、发号施令、画皮、面影辉映、花之礼、阴晴不定、饱了又饿、结冻头、幻觉、变身者、多属性、化学变化气体、毒傀儡、群聚变形、化学之力、古代活性、夸克充能、接球手、ＡＲ系统、鱼群、界限盾壳、战斗切换、太晶甲壳、太晶变形、归零化境、复制、达摩模式、全能变身。若没有对手拥有可复制的特性，此特性会在出现可复制的特性时立即发动。", // NEEDS QC
		shortDesc: "出场时复制随机一个对手的特性。", // NEEDS QC
		gen8: {
			desc: "出场时，随机复制1只对手宝可梦的特性。人马一体、牵绊变身、绝对睡眠、画皮、花之礼、阴晴不定、一口导弹、饱了又饿、结冻头、幻觉、变身者、多属性、化学变化气体、群聚变形、化学之力、接球手、ＡＲ系统、鱼群、界限盾壳、战斗切换、复制、达摩模式无法复制。没有拥有可复制特性的对手时，一旦出现就会发动此特性。", // NEEDS QC
		},
		gen7: {
			desc: "出场时，随机复制1只对手宝可梦的特性。牵绊变身、绝对睡眠、画皮、花之礼、阴晴不定、幻觉、变身者、多属性、群聚变形、化学之力、接球手、ＡＲ系统、鱼群、界限盾壳、战斗切换、复制、达摩模式无法复制。没有拥有可复制特性的对手时，一旦出现就会发动此特性。", // NEEDS QC
		},
		gen6: {
			desc: "出场时，随机复制1只相邻的对手宝可梦的特性。花之礼、阴晴不定、幻觉、变身者、多属性、战斗切换、复制、达摩模式无法复制。没有拥有可复制特性的对手时，一旦出现就会发动此特性。", // NEEDS QC
		},
		gen5: {
			desc: "出场时，随机复制1只相邻的对手宝可梦的特性。花之礼、阴晴不定、幻觉、变身者、多属性、复制、达摩模式无法复制。没有拥有可复制特性的对手时，一旦出现就会发动此特性。", // NEEDS QC
		},
		gen4: {
			desc: "出场时，随机复制1只对手宝可梦的特性。阴晴不定、多属性、复制无法复制。没有拥有可复制特性的对手时，一旦出现就会发动此特性。", // NEEDS QC
		},
		gen3: {
			desc: "出场时，随机复制1只对手宝可梦的特性。", // NEEDS QC
		},

		changeAbility: "  复制了{SOURCE}的{ABILITY}！",
	},
	transistor: {
		name: "电晶体",
		shortDesc: "电属性攻击的进攻能力变为1.3倍。", // NEEDS QC
		gen8: {
			shortDesc: "使用电属性攻击时，进攻能力变为1.5倍。", // NEEDS QC
		},
	},
	triage: {
		name: "先行治疗",
		shortDesc: "回复类招式优先度+3。", // NEEDS QC
	},
	truant: {
		name: "懒惰",
		shortDesc: "每隔1回合才能行动。", // NEEDS QC
		gen3: {
			desc: "该宝可梦每隔一回合会偷懒而不使用招式。若接替因回合结束时的效果而濒死的宝可梦出场，第一回合会偷懒。", // NEEDS QC
		},

		cant: "{POKEMON}正在偷懒。",
	},
	turboblaze: {
		name: "涡轮火焰",
		// Official flavor text: "可以不受对手特性的干扰， 向对手使出招式。"
		desc: "该宝可梦的招式及其效果无视其他宝可梦的一部分特性。可无视的特性包括：尾甲、芳香幕、气场破坏、战斗盔甲、健壮胸肌、防弹、恒净之躯、唱反调、湿气、鲜艳之躯、画皮、干燥皮肤、食土、过滤、引火、花之礼、花幕、毛茸茸、友情防守、毛皮大衣、黄金之躯、草之毛皮、看门犬、耐热、重金属、怪力钳、结冻头、冰鳞粉、发光、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、心眼、镜甲、电气引擎、多重鳞片、迟钝、防尘、我行我素、粉彩护幕、庞克摇滚、洁净之盐、女王的威严、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、甜幕、蹒跚、心灵感应、太晶甲壳、热交换、厚脂肪、纯朴、干劲、蓄电、储水、水泡、水幕、焦香之躯、白色烟雾、乘风、神奇守护、奇迹皮肤。此效果影响场上所有其他宝可梦，无论其是否为该宝可梦招式的目标，也无论其特性是否对该宝可梦有利。", // NEEDS QC
		shortDesc: "使出招式时无视对手的特性。", // NEEDS QC
		gen8: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为芳香幕、气场破坏、战斗盔甲、健壮胸肌、防弹、恒净之躯、唱反调、湿气、鲜艳之躯、画皮、干燥皮肤、过滤、引火、花之礼、花幕、毛茸茸、友情防守、毛皮大衣、草之毛皮、耐热、重金属、怪力钳、结冻头、冰鳞粉、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、镜甲、电气引擎、多重鳞片、迟钝、防尘、我行我素、粉彩护幕、庞克摇滚、女王的威严、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、甜幕、蹒跚、心灵感应、厚脂肪、纯朴、干劲、蓄电、储水、水泡、水幕、白色烟雾、神奇守护、奇迹皮肤。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标，也无论该特性对该宝可梦是否有利。", // NEEDS QC
		},
		gen7: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为芳香幕、气场破坏、战斗盔甲、健壮胸肌、防弹、恒净之躯、唱反调、湿气、暗黑气场、鲜艳之躯、画皮、干燥皮肤、妖精气场、过滤、引火、花之礼、花幕、毛茸茸、友情防守、毛皮大衣、草之毛皮、耐热、重金属、怪力钳、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、电气引擎、多重鳞片、迟钝、防尘、我行我素、女王的威严、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、甜幕、蹒跚、心灵感应、厚脂肪、纯朴、干劲、蓄电、储水、水泡、水幕、白色烟雾、神奇守护、奇迹皮肤。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标，也无论该特性对该宝可梦是否有利。", // NEEDS QC
		},
		gen6: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为芳香幕、气场破坏、战斗盔甲、健壮胸肌、防弹、恒净之躯、唱反调、湿气、暗黑气场、干燥皮肤、妖精气场、过滤、引火、花之礼、花幕、友情防守、毛皮大衣、草之毛皮、耐热、重金属、怪力钳、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、电气引擎、多重鳞片、迟钝、防尘、我行我素、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、甜幕、蹒跚、心灵感应、厚脂肪、纯朴、干劲、蓄电、储水、水幕、白色烟雾、神奇守护、奇迹皮肤。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标，也无论该特性对该宝可梦是否有利。", // NEEDS QC
		},
		gen5: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为战斗盔甲、健壮胸肌、恒净之躯、唱反调、湿气、干燥皮肤、过滤、引火、花之礼、友情防守、耐热、重金属、怪力钳、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、轻金属、避雷针、柔软、魔法镜、熔岩铠甲、神奇鳞片、电气引擎、多重鳞片、迟钝、我行我素、沙隐、食草、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、蹒跚、心灵感应、厚脂肪、纯朴、干劲、蓄电、储水、水幕、白色烟雾、神奇守护、奇迹皮肤。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标，也无论该特性对该宝可梦是否有利。", // NEEDS QC
		},
		gen4: {
			desc: "该宝可梦的招式及其效果无视其他宝可梦的部分特性。可以无视的特性为战斗盔甲、恒净之躯、湿气、干燥皮肤、过滤、引火、花之礼、耐热、怪力钳、免疫、精神力、不眠、锐利目光、叶子防守、飘浮、避雷针、柔软、熔岩铠甲、神奇鳞片、电气引擎、迟钝、我行我素、沙隐、硬壳盔甲、鳞粉、单纯、雪隐、坚硬岩石、隔音、黏着、引水、结实、吸盘、蹒跚、厚脂肪、纯朴、干劲、蓄电、储水、水幕、白色烟雾、神奇守护。此效果适用于场上其他所有宝可梦，无论其是否为该宝可梦招式的目标。不会无视队友的特性花之礼带来的攻击修正。", // NEEDS QC
		},

		start: "  {POKEMON}正在释放炽焰气场！",
	},
	unaware: {
		name: "纯朴",
		// Official flavor text: "可以无视对手能力的变化， 进行攻击。"
		desc: "该宝可梦受到伤害时，无视其他宝可梦的攻击、特攻和命中率的能力等级变化；造成伤害时，无视其他宝可梦的防御、特防和回避率的能力等级变化。", // NEEDS QC
		shortDesc: "计算伤害时无视对手的能力等级变化。", // NEEDS QC
	},
	unburden: {
		name: "轻装",
		// Official flavor text: "失去所持有的道具时， 速度会提高。"
		desc: "该宝可梦因任何原因失去携带的道具后，只要仍在场、保持此特性且没有携带道具，速度变为2倍。", // NEEDS QC
		shortDesc: "失去道具后速度变为2倍。交换、获得道具或更换特性时解除。", // NEEDS QC
	},
	unnerve: {
		name: "紧张感",
		// Official flavor text: "让对手紧张， 使其无法食用树果。"
		desc: "该宝可梦在场时，对手无法使用树果。此特性先于陷阱和其他特性发动。", // NEEDS QC
		shortDesc: "在场时，对手无法食用树果。", // NEEDS QC

		start: "  {TEAM}因太紧张而无法食用树果！",
	},
	unseenfist: {
		name: "无形拳",
		shortDesc: "接触类招式可穿透守护类招式（极巨防壁除外）。", // NEEDS QC
		champions: {
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	vesselofruin: {
		name: "灾祸之鼎",
		shortDesc: "场上不具此特性的宝可梦特攻变为0.75倍。", // NEEDS QC

		start: "  {POKEMON}的灾祸之鼎令周围的宝可梦的特攻减弱了！",
	},
	victorystar: {
		name: "胜利之星",
		shortDesc: "己方的命中率变为1.1倍。", // NEEDS QC
	},
	vitalspirit: {
		name: "干劲",
		shortDesc: "不会陷入睡眠状态。睡眠时获得此特性会将其治愈。", // NEEDS QC
	},
	voltabsorb: {
		name: "蓄电",
		// Official flavor text: "受到电属性的招式攻击时， 不会受到伤害，而是会回复。"
		desc: "该宝可梦不受电属性招式影响，且被电属性招式击中时回复最大HP的1/4（向下取整）。", // NEEDS QC
		shortDesc: "免疫电属性招式，并回复最大HP的1/4。", // NEEDS QC
		gen3: {
			desc: "该宝可梦不受电属性攻击招式影响，受到时回复最大HP的1/4（向下取整）。", // NEEDS QC
			shortDesc: "使电属性攻击招式无效，并回复最大HP的1/4。", // NEEDS QC
		},
	},
	wanderingspirit: {
		name: "游魂",
		// Official flavor text: "与使用接触类招式 攻击自己的宝可梦互换特性。"
		desc: "与该宝可梦直接接触的宝可梦，特性会与此特性互换。特性为人马一体、牵绊变身、绝对睡眠、发号施令、画皮、面影辉映、饱了又饿、结冻头、幻觉、多属性、化学变化气体、毒傀儡、群聚变形、古代活性、夸克充能、ＡＲ系统、鱼群、界限盾壳、战斗切换、太晶甲壳、太晶变形、归零化境、神奇守护、达摩模式、全能变身的宝可梦不受影响。", // NEEDS QC
		shortDesc: "与接触自己的对手互换特性。", // NEEDS QC
		gen8: {
			desc: "与用接触类招式攻击该宝可梦的宝可梦互换特性。对特性为人马一体、牵绊变身、绝对睡眠、画皮、一口导弹、饱了又饿、结冻头、幻觉、多属性、化学变化气体、群聚变形、ＡＲ系统、鱼群、界限盾壳、战斗切换、神奇守护、达摩模式的宝可梦无效。", // NEEDS QC
		},

		activate: "#skillswap",
	},
	waterabsorb: {
		name: "储水",
		// Official flavor text: "受到水属性的招式攻击时， 不会受到伤害，而是会回复。"
		desc: "该宝可梦不受水属性招式影响，且被水属性招式击中时回复最大HP的1/4（向下取整）。", // NEEDS QC
		shortDesc: "免疫水属性招式，并回复最大HP的1/4。", // NEEDS QC
	},
	waterbubble: {
		name: "水泡",
		// Official flavor text: "降低自己受到的火属性 招式的威力，不会灼伤。"
		desc: "该宝可梦使用水属性攻击时进攻能力变为2倍。其他宝可梦对该宝可梦使用火属性攻击时，计算伤害时进攻能力减半。该宝可梦不会陷入灼伤状态。在灼伤时获得此特性会将其治愈。", // NEEDS QC
		shortDesc: "水属性威力2倍，受火属性减半，不会灼伤。", // NEEDS QC
	},
	watercompaction: {
		name: "遇水凝固",
		shortDesc: "受到水属性招式伤害后，防御提高2级。", // NEEDS QC
	},
	waterveil: {
		name: "水幕",
		shortDesc: "不会陷入灼伤状态。灼伤时获得此特性会将其治愈。", // NEEDS QC
	},
	weakarmor: {
		name: "碎裂铠甲",
		// Official flavor text: "如果因物理招式受到伤害， 防御会降低， 速度会大幅提高。"
		desc: "该宝可梦被物理攻击击中时，防御降低1级，速度提高2级。", // NEEDS QC
		shortDesc: "受到物理攻击时，防御-1，速度+2。", // NEEDS QC
		gen6: {
			desc: "该宝可梦受到物理攻击时，防御降低1级，速度提高1级。", // NEEDS QC
			shortDesc: "受到物理攻击时，防御降低1级，速度提高1级。", // NEEDS QC
		},
	},
	wellbakedbody: {
		name: "焦香之躯",
		desc: "该宝可梦不受火属性招式影响，且被火属性招式击中时防御提高2级。", // NEEDS QC
		shortDesc: "免疫火属性招式，且防御提高2级。", // NEEDS QC
	},
	whitesmoke: {
		name: "白色烟雾",
		shortDesc: "能力等级不会被其他宝可梦降低。", // NEEDS QC
	},
	wimpout: {
		name: "跃跃欲逃",
		// Official flavor text: "ＨＰ变为一半时， 会慌慌张张逃走， 退回同行队伍中。"
		desc: "该宝可梦的HP高于最大HP的1/2、且受到伤害后降至1/2或以下时，立即交换为选择的队友。此效果在连续攻击招式的所有攻击结束后判定。若招式的追加效果被特性强行消除，则此效果不会发动。直接和间接伤害均可触发，但使用诅咒、替身时的消耗、腹鼓、分担痛楚和混乱的自伤除外。", // NEEDS QC
		shortDesc: "HP变为1/2以下时，与同伴交换。", // NEEDS QC
	},
	windpower: {
		name: "风力发电",
		desc: "该宝可梦受到风类招式攻击时，或己方发动顺风时，获得充电的效果。", // NEEDS QC
		shortDesc: "受到风类招式或顺风发动时，进入充电状态。", // NEEDS QC

		start: "#electromorphosis",
	},
	windrider: {
		name: "乘风",
		desc: "该宝可梦不受风类招式影响，且被风类招式击中时或己方发动顺风时，攻击提高1级。", // NEEDS QC
		shortDesc: "免疫风类招式且攻击+1。顺风发动时也触发。", // NEEDS QC
	},
	wonderguard: {
		name: "神奇守护",
		shortDesc: "只会受到效果绝佳的招式和间接伤害。", // NEEDS QC
		gen4: {
			shortDesc: "只受到火焰牙、效果绝佳的招式和间接伤害。", // NEEDS QC
		},
		gen3: {
			shortDesc: "只受到效果绝佳的招式和间接伤害。", // NEEDS QC
		},
	},
	wonderskin: {
		name: "奇迹皮肤",
		// Official flavor text: "成为不易受到变化招式 攻击的身体。"
		desc: "以该宝可梦为目标、需要进行命中判定的变化招式，命中率变为50%。此效果在其他改变命中率的效果之前适用。", // NEEDS QC
		shortDesc: "需要命中判定的变化招式对自己命中率变为50%。", // NEEDS QC
	},
	zenmode: {
		name: "达摩模式",
		// Official flavor text: "ＨＰ变为一半以下时， 样子会改变。"
		desc: "若该宝可梦是达摩狒狒（包括伽勒尔的样子），回合结束时HP为最大HP的1/2或以下时，变为达摩模式。回合结束时HP高于最大HP的1/2时，变回普通模式。", // NEEDS QC
		shortDesc: "达摩狒狒HP为1/2以下时变为达摩模式。", // NEEDS QC
		gen7: {
			desc: "该宝可梦是达摩狒狒时，回合结束时HP为一半以下则变为达摩模式。回合结束时HP超过一半则变回普通模式。", // NEEDS QC
		},
		gen6: {
			desc: "该宝可梦是达摩狒狒时，回合结束时HP为一半以下则变为达摩模式。回合结束时HP超过一半则变回普通模式。在达摩模式中失去此特性时，立即变回普通模式。", // NEEDS QC
		},

		transform: "达摩模式，启动！",
		transformEnd: "达摩模式，解除！",
	},
	zerotohero: {
		name: "全能变身",
		shortDesc: "海豚侠交换下场后变为全能形态。", // NEEDS QC

		activate: "  {POKEMON}变身后归来了！",
	},

	// CAP
	mountaineer: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "出场回合不受岩石属性招式和隐形岩影响。", // NEEDS QC
	},
	rebound: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "出场时，该宝可梦可以反弹一部分变化招式，将其反用于原使用者。", // NEEDS QC
		shortDesc: "出场回合可反弹一部分变化招式。", // NEEDS QC

		move: "#magiccoat",
	},
	persistent: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "由该宝可梦发动的重力、回复封锁、魔法空间、神秘守护、顺风、戏法空间、奇妙空间的效果时间延长2回合。", // NEEDS QC
		shortDesc: "重力和各种空间等效果延长2回合。", // NEEDS QC

		activate: "  {POKEMON}将{MOVE}延长了2回合！", // NEEDS QC
	},
};
