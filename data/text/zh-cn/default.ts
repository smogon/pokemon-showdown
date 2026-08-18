export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "[TRAINER]和[TRAINER]的对战开始了！",
		winBattle: "**[TRAINER]**在对战中获胜了！",
		tieBattle: "[TRAINER]和[TRAINER]打成了平局！",

		pokemon: "[NICKNAME]",
		opposingPokemon: "对手的[NICKNAME]",
		team: "我方",
		opposingTeam: "对手",
		party: "我方宝可梦",
		opposingParty: "对手的宝可梦",

		turn: "== [NUMBER]回合 ==",
		switchIn: "[TRAINER]派出了[FULLNAME]！",
		switchInOwn: "上吧！[FULLNAME]！",
		switchOut: "[TRAINER]换下了[NICKNAME]！",
		switchOutOwn: "[NICKNAME]，回来！",
		drag: "[FULLNAME]被拖进了战斗！",
		faint: "[POKEMON]倒下了！",
		swap: "[POKEMON]和[TARGET]互换了场地！",
		swapCenter: "[POKEMON]移动到了中间！",

		// Multi Battles only
		canDynamax: "  [TRAINER]可以极巨化了！",
		canDynamaxOwn: "  [TRAINER]周围汇聚了极巨力！",

		zEffect: "  [POKEMON]开始释放全力的Ｚ招式！",
		move: "[POKEMON]使出了**[MOVE]**！",
		abilityActivation: "[[POKEMON]的[ABILITY]]",

		mega: "  [POKEMON]的[ITEM]和[TRAINER]的钥石起了反应！",
		megaNoItem: "  [TRAINER]的钥石和[POKEMON]起了反应！",
		megaGen6: "  [POKEMON]的[ITEM]和[TRAINER]的超级手镯起了反应！",
		transformMega: "[POKEMON]超级进化成了超级[SPECIES]！",
		primal: "[POKEMON]的原始回归！恢复了原始的样子！",
		zPower: "  [POKEMON]让Ｚ力量笼罩了全身！",
		zBroken: "  [POKEMON]没能防住攻击，受到了伤害！",
		terastallize: "", // NEEDS TRANSLATION: Showdown custom text

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON]无法使用[MOVE]！",
		cantNoMove: "", // NEEDS TRANSLATION: predates Chinese support
		fail: "  但是，没有起到效果！！",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "[POKEMON]的样子发生了变化！",
		typeChange: "  [POKEMON]变成了[TYPE]属性！",
		typeChangeFromEffect: "  [POKEMON]变成了[TYPE]属性！",
		typeAdd: "  [POKEMON]增加了[TYPE]属性！",

		start: "", // NEEDS TRANSLATION: Showdown custom text
		end: "  [POKEMON]摆脱了[EFFECT]的束缚！",
		activate: "", // NEEDS TRANSLATION: Showdown custom text
		startTeamEffect: "", // NEEDS TRANSLATION: Showdown custom text
		endTeamEffect: "", // NEEDS TRANSLATION: Showdown custom text
		startFieldEffect: "", // NEEDS TRANSLATION: Showdown custom text
		endFieldEffect: "", // NEEDS TRANSLATION: Showdown custom text

		changeAbility: "  [POKEMON]的特性变为[ABILITY]了！",
		addItem: "  [POKEMON]获得了[ITEM]！",
		takeItem: "  [POKEMON]从[SOURCE]那里夺取了[ITEM]！",
		eatItem: "", // NEEDS TRANSLATION: Showdown custom text
		useGem: "  [ITEM]加强了[MOVE]的威力！",
		eatItemWeaken: "  [ITEM]减轻了对[POKEMON]造成的伤害！",
		removeItem: "", // NEEDS TRANSLATION: Showdown custom text
		activateItem: "", // NEEDS TRANSLATION: Showdown custom text
		activateWeaken: "  [ITEM]减轻了对[POKEMON]造成的伤害！",

		damage: "  ([POKEMON]受到了伤害！)",
		damagePercentage: "", // NEEDS TRANSLATION: Showdown custom text
		damageFromPokemon: "  [POKEMON]因[SOURCE]的[ITEM]而受到了伤害！",
		damageFromItem: "  [POKEMON]因[ITEM]而受到了伤害！",
		damageFromPartialTrapping: "  [POKEMON]受到了[MOVE]的伤害。",
		heal: "  [POKEMON]的体力回复了！",
		healFromZEffect: "  因为Ｚ力量，[POKEMON]回复了体力！",
		healFromEffect: "  [POKEMON]用[EFFECT]回复了体力！",

		boost: "  [POKEMON]的[STAT]提高了！",
		boost2: "  [POKEMON]的[STAT]大幅提高了！",
		boost3: "  [POKEMON]的[STAT]巨幅提高了！",
		boost0: "  [POKEMON]的[STAT]已经无法再提高了！",
		boostFromItem: "  [POKEMON]用[ITEM]提高了[STAT]！",
		boost2FromItem: "  [POKEMON]用[ITEM]大幅提高了[STAT]！",
		boost3FromItem: "  [POKEMON]用[ITEM]巨幅提高了[STAT]！",
		boostFromZEffect: "  因为Ｚ力量，[POKEMON]的[STAT]提高了！",
		boost2FromZEffect: "  因为Ｚ力量，[POKEMON]的[STAT]大幅提高了！",
		boost3FromZEffect: "  因为Ｚ力量，[POKEMON]的[STAT]巨幅提高了！",
		boostMultipleFromZEffect: "  因为Ｚ力量，[POKEMON]的能力提高了！",

		unboost: "  [POKEMON]的[STAT]降低了！",
		unboost2: "  [POKEMON]的[STAT]大幅降低了！",
		unboost3: "  [POKEMON]的[STAT]巨幅降低了！",
		unboost0: "  [POKEMON]的[STAT]已经无法再降低了！",
		unboostFromItem: "", // NEEDS TRANSLATION: Showdown custom text
		unboost2FromItem: "", // NEEDS TRANSLATION: Showdown custom text
		unboost3FromItem: "", // NEEDS TRANSLATION: Showdown custom text

		swapBoost: "  [POKEMON]和对手互换了自己的能力变化！",
		swapOffensiveBoost: "  [POKEMON]和对手互换了自己的攻击和特攻的能力变化！",
		swapDefensiveBoost: "  [POKEMON]和对手互换了自己的防御和特防的能力变化！",
		copyBoost: "  [POKEMON]复制了[TARGET]的能力变化！",
		clearBoost: "  [POKEMON]的能力变化消失了！",
		clearBoostFromZEffect: "  因为Ｚ力量，[POKEMON]恢复了降低的能力！",
		invertBoost: "  [POKEMON]的能力变化颠倒过来了！",
		clearAllBoost: "  所有能力都复原了！",

		superEffective: "  效果绝佳！",
		superEffectiveSpread: "  对[POKEMON]效果绝佳！",
		resisted: "  效果不好。",
		resistedSpread: "  对[POKEMON]效果不好。",
		extremelyEffective: "  效果无比绝佳！！",
		extremelyEffectiveSpread: "  对[POKEMON]效果无比绝佳！！",
		mostlyIneffective: "  效果相当不好。",
		mostlyIneffectiveSpread: "  对[POKEMON]效果相当不好。",
		crit: "  击中了要害！",
		critSpread: "  击中了[POKEMON]的要害！",
		immune: "  对于[POKEMON]，好像没有效果……",
		immuneNoPokemon: "  但是，没有效果！",
		immuneOHKO: "  对于[POKEMON]，完全没有效果！",
		miss: "  没有击中[POKEMON]！",
		missNoPokemon: "", // NEEDS TRANSLATION: predates Chinese support

		center: "  复位移动！！",
		noTarget: "", // NEEDS TRANSLATION: predates Chinese support
		ohko: "  一击必杀！",
		combine: "  两个招式合二为一！这是合体招式！！",
		hitCount: "  击中了[NUMBER]次！",
	},

	// stats
	hp: {
		statName: "HP",
		statShortName: "HP",
	},
	atk: {
		statName: "攻击",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	def: {
		statName: "防御",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spa: {
		statName: "特攻",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spd: {
		statName: "特防",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spe: {
		statName: "速度",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	accuracy: {
		statName: "命中率",
	},
	evasion: {
		statName: "闪避率",
	},
	spc: {
		statName: "特殊",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	stats: {
		statName: "状态",
	},

	// statuses
	brn: {
		start: "  [POKEMON]被灼伤了！",
		startFromItem: "  [POKEMON]因[ITEM]被灼伤了！",
		alreadyStarted: "  [POKEMON]已经被灼伤了。",
		end: "  [POKEMON]的灼伤治愈了！",
		endFromItem: "  [POKEMON]用[ITEM]治愈了灼伤！",
		damage: "  [POKEMON]受到了灼伤的伤害！",
	},
	frz: {
		start: "  [POKEMON]冻住了！",
		alreadyStarted: "  [POKEMON]已经冻住了。",
		end: "  [POKEMON]的冰冻融化了！",
		endFromItem: "  [POKEMON]用[ITEM]治愈了冰冻状态！",
		endFromMove: "  因[POKEMON]的[MOVE]，冰冻融化了！",
		cant: "[POKEMON]因冻住了而无法行动！",
	},
	par: {
		start: "  [POKEMON]麻痹了，很难使出招式！",
		alreadyStarted: "  [POKEMON]已经麻痹了。",
		end: "  [POKEMON]的麻痹解除了！",
		endFromItem: "  [POKEMON]用[ITEM]治愈了麻痹！",
		cant: "[POKEMON]因身体麻痹而无法行动！",
	},
	psn: {
		start: "  [POKEMON]中毒了！",
		alreadyStarted: "  [POKEMON]已经中毒了。",
		end: "  [POKEMON]中的毒彻底清除了！",
		endFromItem: "  [POKEMON]用[ITEM]治愈了中毒！",
		damage: "  [POKEMON]受到了毒的伤害！",
	},
	tox: {
		start: "  [POKEMON]中剧毒了！",
		startFromItem: "  [POKEMON]因[ITEM]中剧毒了！",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  [POKEMON]睡着了！",
		startFromRest: "  [POKEMON]睡着了，并且变得精力充沛！",
		alreadyStarted: "  [POKEMON]已经睡着了。",
		end: "  [POKEMON]醒过来了！",
		endFromItem: "  [POKEMON]用[ITEM]让自己醒过来了！",
		cant: "[POKEMON]正在呼呼大睡。",
	},

	// misc effects
	confusion: {
		start: "  [POKEMON]混乱了！",
		startFromFatigue: "  [POKEMON]因精疲力尽而混乱了！",
		end: "  [POKEMON]的混乱解除了！",
		endFromItem: "  [POKEMON]用[ITEM]治愈了混乱！",
		alreadyStarted: "  [POKEMON]已经混乱了。",
		activate: "  [POKEMON]正在混乱中！",
		damage: "不知所以地攻击了自己！",
	},
	drain: {
		heal: "  从[SOURCE]那里吸取了体力！",
	},
	flinch: {
		cant: "[POKEMON]畏缩了，无法使出招式！",
	},
	heal: {
		fail: "  但是，[POKEMON]的体力是全满的！",
	},
	healreplacement: {
		activate: "  因为Ｚ力量，[POKEMON]将会回复来替换的宝可梦的ＨＰ！",
	},
	nopp: {
		cant: "[POKEMON]使出了**[MOVE]**！\n  但是，招式的剩余点数 已经用完了！",
	},
	recharge: {
		cant: "[POKEMON]因攻击的反作用力而无法动弹！",
	},
	recoil: {
		damage: "  [POKEMON]受到了反作用力造成的伤害！",
	},
	unboost: {
		fail: "  [POKEMON]的能力不会降低！",
	},
	struggle: {
		activate: "  [POKEMON]没有可用来施展的招式！",
	},
	trapped: {
		start: "  [POKEMON]已经无法逃走了！",
	},
	dynamax: {
		start: "", // NEEDS TRANSLATION: Showdown custom text
		end: "", // NEEDS TRANSLATION: Showdown custom text
		block: "  被极巨化之力弹开了！",
		fail: "  [POKEMON]摇了摇头，好像无法使出这个招式……",
	},

	// weather
	sandstorm: {
		weatherName: "沙暴状态",
		start: "  开始刮沙暴了！",
		end: "  沙暴停止了！",
		upkeep: "  (沙暴肆虐！)",
		damage: "  沙暴袭击了[POKEMON]！",
	},
	sunnyday: {
		weatherName: "大晴天状态",
		start: "  日照变强了！",
		end: "  日照复原了！",
		upkeep: "", // NEEDS TRANSLATION: predates Chinese support
	},
	raindance: {
		weatherName: "下雨状态",
		start: "  开始下雨了！",
		end: "  雨停了！",
		upkeep: "", // NEEDS TRANSLATION: predates Chinese support
	},
	hail: {
		weatherName: "冰雹",
		start: "  开始下冰雹了！",
		end: "  冰雹不下了！",
		upkeep: "  (冰雹漫天！)",
		damage: "  冰雹袭击了[POKEMON]！",
	},
	snowscape: {
		weatherName: "下雪状态",
		start: "  开始下雪了！",
		end: "  雪停了！",
		upkeep: "  (漫天大雪！)",
	},
	desolateland: {
		weatherName: "大日照",
		start: "  日照变得非常强了！",
		end: "  日照复原了！",
		block: "  强日照势头不减！",
		blockMove: "  受强日照的影响，水属性的攻击被蒸发了！",
	},
	primordialsea: {
		weatherName: "大雨",
		start: "  开始下起了暴雨！",
		end: "  暴雨停了！",
		block: "  暴雨势头不减！",
		blockMove: "  受暴雨的影响，火属性的攻击被扑灭了！",
	},
	deltastream: {
		weatherName: "乱流",
		start: "  神秘的乱流保护着飞行属性宝可梦！",
		end: "  神秘的乱流停止了！",
		activate: "  神秘的乱流减弱了攻击！",
		block: "  神秘的乱流势头不减！",
	},

	// terrain
	electricterrain: {
		start: "  脚下电光飞闪！",
		end: "  脚下的电光消失不见了！",
		block: "  [POKEMON]正受到电气场地的保护！",
	},
	grassyterrain: {
		start: "  脚下青草如茵！",
		end: "  脚下的青草消失不见了！",
		heal: "  [POKEMON]的体力回复了！",
	},
	mistyterrain: {
		start: "  脚下雾气缭绕！",
		end: "  脚下的雾气消失不见了！",
		block: "  [POKEMON]正受到薄雾场地的保护！",
	},
	psychicterrain: {
		start: "  脚下传来了奇妙的感觉！",
		end: "  脚下的奇妙感觉消失了！",
		block: "  [POKEMON]正受到精神场地的保护！",
	},

	// field effects
	gravity: {
		start: "  重力变强了！",
		end: "  重力复原了！",
		cant: "[POKEMON]因重力太强而无法使出[MOVE]！",
		activate: "[POKEMON]因受到重力影响而无法待在空中！",
	},
	magicroom: {
		start: "  凭空制造出了会让携带的道具的效果消失的空间！",
		end: "  魔法空间被解除，道具的效果复原了！",
	},
	mudsport: {
		start: "  电气的威力减弱了！",
		end: "  玩泥巴的效果消失了！",
	},
	trickroom: {
		start: "  [POKEMON]扭曲了时空！",
		end: "  扭曲的时空复原了！",
	},
	watersport: {
		start: "  火焰的威力减弱了！",
		end: "  玩水的效果消失了！",
	},
	wonderroom: {
		start: "  凭空制造出了互换防御和特防的空间！",
		end: "  奇妙空间被解除，防御和特防复原了！",
	},

	// misc
	crash: {
		damage: "  [POKEMON]因势头过猛而撞到了地面！",
	},
};
