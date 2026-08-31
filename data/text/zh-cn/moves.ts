// Mechanics desc style (zh-cn): official game terminology, halfwidth numerals (1.5倍, 30%, 2～5次).
// Terminology: 使用者 (user), 目标 (target), 对手/相手方=对手方 (opposing side), 己方 (user side),
//   追加效果 (secondary effect), 畏缩 (flinch), 击中要害 (crit), 能力等级 (stat stage), 异常状态
//   (non-volatile status), 连续攻击招式 (multi-hit), 优先度 (priority), 场地设置类招式=设置技 (hazards),
//   替身 (substitute), 属性相性 (type effectiveness), 必定命中 (never misses), 反作用力 (recoil).
// Rounding: 四舍五入 (half up), 五舍六入 (half down), 向下取整 (down), 向上取整 (up).
// Fixed formulas mirror ja/moves.ts; boilerplate (protect family, partial trap, multi-hit,
//   Max Moves) is shared verbatim across entries — QC one, fix all.
// Cross-references generated from name fields / pokedex-names.ts. CAP entities keep name null
//   (English fallback); descs are translated with English names inline.

export const MovesText: { [id: IDEntry]: MoveText } = {
	"10000000voltthunderbolt": {
		name: "千万伏特",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	absorb: {
		name: "吸取",
		// Official flavor text: "吸取对手的养分进行攻击。 可以回复给予对手 伤害的一半ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	accelerock: {
		name: "冲岩",
		// Official flavor text: "迅速撞向对手进行攻击。 必定能够先制攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	acid: {
		name: "溶解液",
		// Official flavor text: "将强酸泼向对手进行攻击。 有时会降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	acidarmor: {
		name: "溶化",
		// Official flavor text: "通过细胞的变化进行液化， 从而大幅提高自己的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aciddownpour: {
		name: "强酸剧毒灭绝雨",
		shortDesc: null, // NEEDS TRANSLATION
	},
	acidspray: {
		name: "酸液炸弹",
		// Official flavor text: "喷出能溶化对手的液体进行攻击。 大幅降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	acrobatics: {
		name: "杂技",
		shortDesc: null, // NEEDS TRANSLATION
	},
	acupressure: {
		name: "点穴",
		// Official flavor text: "通过点穴 让身体舒筋活络。 大幅提高某１项能力。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	aerialace: {
		name: "燕返",
		shortDesc: null, // NEEDS TRANSLATION
	},
	aeroblast: {
		name: "气旋攻击",
		// Official flavor text: "发射空气旋涡 进行攻击。 容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	afteryou: {
		name: "您先请",
		// Official flavor text: "支援我方或对手的行动， 使其紧接着此招式之后行动。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {TARGET}接受了对手的好意！",
	},
	agility: {
		name: "高速移动",
		// Official flavor text: "让身体放松变得轻盈， 以便高速移动。 大幅提高自己的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aircutter: {
		name: "空气利刃",
		// Official flavor text: "用锐利的风 切斩对手进行攻击。 容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	airslash: {
		name: "空气斩",
		// Official flavor text: "用连天空也能劈开的 空气之刃进行攻击。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	alloutpummeling: {
		name: "全力无双激烈拳",
		shortDesc: null, // NEEDS TRANSLATION
	},
	alluringvoice: {
		name: "魅诱之声",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	allyswitch: {
		name: "交换场地",
		// Official flavor text: "用神奇的力量瞬间移动， 互换自己和同伴所在的位置。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	amnesia: {
		name: "瞬间失忆",
		// Official flavor text: "将头脑清空， 瞬间忘记某事， 从而大幅提高自己的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	anchorshot: {
		name: "掷锚",
		// Official flavor text: "将锚缠住对手进行攻击。 使对手无法逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	ancientpower: {
		name: "原始之力",
		// Official flavor text: "用原始之力进行攻击。 有时会提高 自己所有的能力。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	appleacid: {
		name: "苹果酸",
		// Official flavor text: "使用从酸苹果中提取出来的 酸性液体进行攻击。 降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aquacutter: {
		name: "水波刀",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aquajet: {
		name: "水流喷射",
		// Official flavor text: "以迅雷不及掩耳之势 扑向对手。 必定能够先制攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aquaring: {
		name: "水流环",
		// Official flavor text: "在自己身体的周围 覆盖用水制造的幕。 每回合回复ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}套上了水环！",
		heal: "  {POKEMON}通过水环回复了体力！",
	},
	aquastep: {
		name: "流水旋舞",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aquatail: {
		name: "水流尾",
		shortDesc: null, // NEEDS TRANSLATION
	},
	armorcannon: {
		name: "铠农炮",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	armthrust: {
		name: "猛推",
		// Official flavor text: "用张开着的双手 猛推对手进行攻击。 连续攻击２～５次。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	aromatherapy: {
		name: "芳香治疗",
		// Official flavor text: "让同伴闻沁人心脾的香气， 从而治愈我方全员的异常状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  怡人的香气扩散了开来！",
	},
	aromaticmist: {
		name: "芳香薄雾",
		// Official flavor text: "通过神奇的芳香， 提高我方宝可梦的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	assist: {
		name: "借助",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
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
	},
	assurance: {
		name: "恶意追击",
		// Official flavor text: "如果此回合内对手 已经受到伤害的话， 招式威力会变成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	astonish: {
		name: "惊吓",
		// Official flavor text: "用尖叫声等 突然惊吓对手进行攻击。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	astralbarrage: {
		name: "星碎",
		// Official flavor text: "用大量的小灵体向 对手发起攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	attackorder: {
		name: "攻击指令",
		// Official flavor text: "召唤手下， 让其朝对手发起攻击。 容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	attract: {
		name: "迷人",
		// Official flavor text: "♂诱惑♀或♀诱惑♂， 让对手着迷。 对手将很难使出招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}着迷了！",
		startFromItem: "  {ITEM}让{POKEMON}着迷了！",
		end: "  {POKEMON}的着迷状态治愈了！",
		endFromItem: "  {POKEMON}用{ITEM}治愈了着迷状态！",
		activate: "  {TARGET}让{POKEMON}着迷了！",
		cant: "{POKEMON}因着迷了而无法使出招式！",
	},
	aurasphere: {
		name: "波导弹",
		shortDesc: null, // NEEDS TRANSLATION
	},
	aurawheel: {
		name: "气场轮",
		// Official flavor text: "用储存在颊囊里的能量 进行攻击，并提高自己的速度。 其属性会随着莫鲁贝可的样子而改变。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aurorabeam: {
		name: "极光束",
		// Official flavor text: "向对手发射 虹色光束进行攻击。 有时会降低对手的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	auroraveil: {
		name: "极光幕",
		// Official flavor text: "在５回合内减弱 物理和特殊的伤害。 只有冰雹时才能使出。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  极光幕使{TEAM}的物理和特殊抗性提高了！",
		end: "  {TEAM}的极光幕消失了！",
	},
	autotomize: {
		name: "身体轻量化",
		// Official flavor text: "削掉身体上没用的部分。 大幅提高自己的速度， 同时体重也会变轻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}变得身轻如燕了！",
	},
	avalanche: {
		name: "雪崩",
		// Official flavor text: "如果受到对手的招式攻击， 就能给予该对手 ２倍威力的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	axekick: {
		name: "下压踢",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		damage: "#crash",
	},
	babydolleyes: {
		name: "圆瞳",
		// Official flavor text: "用圆瞳凝视对手， 从而降低其攻击。 必定能够先制攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	baddybad: {
		name: "坏坏领域",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	banefulbunker: {
		name: "碉堡",
		// Official flavor text: "防住对手攻击的同时， 让接触到自己的对手中毒。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	barbbarrage: {
		name: "毒千针",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	barrage: {
		name: "投球",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	barrier: {
		name: "屏障",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	batonpass: {
		name: "接棒",
		// Official flavor text: "和后备宝可梦进行替换。 换上的宝可梦能直接继承 其能力的变化。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
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
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	beakblast: {
		name: "鸟嘴加农炮",
		// Official flavor text: "先加热鸟嘴后再进行攻击。 鸟嘴在加热时对手触碰的话， 就会使其灼伤。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}开始给鸟嘴加热了！",
	},
	beatup: {
		name: "围攻",
		// Official flavor text: "我方全员进行攻击。 同行的宝可梦越多， 招式的攻击次数越多。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: null, // NEEDS TRANSLATION
	},
	behemothbash: {
		name: "巨兽弹",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	behemothblade: {
		name: "巨兽斩",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	belch: {
		name: "打嗝",
		// Official flavor text: "朝着对手打嗝， 并给予伤害。 如果不吃树果则无法使出。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	bellydrum: {
		name: "腹鼓",
		// Official flavor text: "将自己的ＨＰ减少到 最大ＨＰ的一半， 从而最大限度提高自己的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		boost: "  {POKEMON}削减了体力并释放了全部力量！",
	},
	bestow: {
		name: "传递礼物",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		takeItem: "  {POKEMON}从{SOURCE}那里获得了{ITEM}！",
	},
	bide: {
		name: "忍耐",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}正在忍耐。",
		end: "  {POKEMON}的忍耐被解除了！",
		activate: "  {POKEMON}正在忍耐。",
	},
	bind: {
		name: "绑紧",
		// Official flavor text: "使用长长的身体或藤蔓等， 在４～５回合内 绑紧对手进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
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
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}被{SOURCE}紧紧绑住了！",
		move: "#wrap",
	},
	bite: {
		name: "咬住",
		// Official flavor text: "用尖锐的牙 咬住对手进行攻击。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	bitterblade: {
		name: "悔念剑",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bittermalice: {
		name: "冤冤相报",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	blackholeeclipse: {
		name: "黑洞吞噬万物灭",
		shortDesc: null, // NEEDS TRANSLATION
	},
	blastburn: {
		name: "爆炸烈焰",
		// Official flavor text: "用爆炸的火焰 烧尽对手进行攻击。 下一回合自己将无法动弹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	blazekick: {
		name: "火焰踢",
		// Official flavor text: "攻击对手后， 有时会使其陷入灼伤状态。 也容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	blazingtorque: {
		name: "灼热暴冲",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bleakwindstorm: {
		name: "枯叶风暴",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	blizzard: {
		name: "暴风雪",
		// Official flavor text: "将猛烈的暴风雪 刮向对手进行攻击。 有时会让对手陷入冰冻状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	block: {
		name: "挡路",
		// Official flavor text: "张开双手进行阻挡， 封住对手的退路， 使其不能逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
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
	bloodmoon: {
		name: "血月",
		shortDesc: null, // NEEDS TRANSLATION
	},
	bloomdoom: {
		name: "绚烂缤纷花怒放",
		shortDesc: null, // NEEDS TRANSLATION
	},
	blueflare: {
		name: "青焰",
		// Official flavor text: "用美丽而激烈的青焰 包裹住对手进行攻击。 有时会让对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bodypress: {
		name: "扑击",
		// Official flavor text: "用身体撞向对手进行攻击。 防御越高， 给予的伤害就越高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bodyslam: {
		name: "泰山压顶",
		// Official flavor text: "用整个身体 压住对手进行攻击。 有时会让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	boltbeak: {
		name: "电喙",
		// Official flavor text: "用带电的喙啄刺对手。 如果比对手先出手攻击， 招式的威力会变成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	boltstrike: {
		name: "雷击",
		// Official flavor text: "让强大的电流覆盖全身， 猛撞向对手进行攻击。 有时会让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	boneclub: {
		name: "骨棒",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bonemerang: {
		name: "骨头回力镖",
		// Official flavor text: "用手中的骨头投掷对手， 来回连续２次给予伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	bonerush: {
		name: "骨棒乱打",
		// Official flavor text: "用坚硬的骨头 殴打对手进行攻击。 连续攻击２～５次。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	boomburst: {
		name: "爆音波",
		// Official flavor text: "通过震耳欲聋的爆炸声 产生的破坏力， 攻击自己周围所有的宝可梦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bounce: {
		name: "弹跳",
		// Official flavor text: "弹跳到高高的空中， 第２回合攻击对手。 有时会让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},

		prepare: "{POKEMON}高高地跳了起来！",
	},
	bouncybubble: {
		name: "活活气泡",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	branchpoke: {
		name: "木枝突刺",
		// Official flavor text: "使用尖锐的树枝 刺向对手进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bravebird: {
		name: "勇鸟猛攻",
		// Official flavor text: "收拢翅膀， 通过低空飞行突击对手。 自己也会受到不小的伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	breakingswipe: {
		name: "广域破坏",
		// Official flavor text: "用坚韧的尾巴 猛扫对手进行攻击， 从而降低对手的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	breakneckblitz: {
		name: "究极无敌大冲撞",
		shortDesc: null, // NEEDS TRANSLATION
	},
	brickbreak: {
		name: "劈瓦",
		// Official flavor text: "将手刀猛烈地挥下攻击对手。 还可以破坏光墙和反射壁等。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: null, // NEEDS TRANSLATION
	},
	brine: {
		name: "盐水",
		// Official flavor text: "当对手的ＨＰ 负伤到一半左右时， 招式威力会变成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	brutalswing: {
		name: "狂舞挥打",
		// Official flavor text: "用自己的身体狂舞挥打， 给予对手伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bubble: {
		name: "泡沫",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	bubblebeam: {
		name: "泡沫光线",
		// Official flavor text: "向对手猛烈地喷射 泡沫进行攻击。 有时会降低对手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	bugbite: {
		name: "虫咬",
		// Official flavor text: "咬住进行攻击。 当对手携带树果时， 可以食用并获得其效果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		removeItem: "  {SOURCE}夺取并吃掉了{ITEM}！",
	},
	bugbuzz: {
		name: "虫鸣",
		// Official flavor text: "利用振动发出音波进行攻击。 有时会降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bulkup: {
		name: "健美",
		// Official flavor text: "使出全身力气绷紧肌肉， 从而提高自己的攻击和防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bulldoze: {
		name: "重踏",
		// Official flavor text: "用力踩踏地面并攻击 自己周围所有的宝可梦。 降低对方的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bulletpunch: {
		name: "子弹拳",
		// Official flavor text: "向对手使出如子弹般 快速而坚硬的拳头。 必定能够先制攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bulletseed: {
		name: "种子机关枪",
		// Official flavor text: "向对手猛烈地 发射种子进行攻击。 连续攻击２～５次。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	burningbulwark: {
		name: "火焰守护",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	burningjealousy: {
		name: "妒火",
		// Official flavor text: "用嫉妒的能量攻击对手。 会让在该回合内能力有所提高的 宝可梦陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	burnup: {
		name: "燃尽",
		// Official flavor text: "将自己全身燃烧起火焰来， 给予对手大大的伤害。 自己的火属性将会消失。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},

		typeChange: "  {POKEMON}的火焰燃尽了！",
	},
	buzzybuzz: {
		name: "麻麻电击",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	calmmind: {
		name: "冥想",
		// Official flavor text: "静心凝神， 从而提高自己的特攻和特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	camouflage: {
		name: "保护色",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
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
		},
	},
	captivate: {
		name: "诱惑",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	catastropika: {
		name: "皮卡皮卡必杀击",
		shortDesc: null, // NEEDS TRANSLATION
	},
	ceaselessedge: {
		name: "秘剑・千重涛",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	celebrate: {
		name: "庆祝",
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  恭喜恭喜！{TRAINER}！！",
	},
	charge: {
		name: "充电",
		// Official flavor text: "提高下一回合使出的 电属性的招式威力。 自己的特防也会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}开始充电了！",
	},
	chargebeam: {
		name: "充电光束",
		// Official flavor text: "向对手发射电击光束。 由于蓄满电流， 有时会提高自己的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	charm: {
		name: "撒娇",
		// Official flavor text: "可爱地凝视， 诱使对手疏忽大意， 从而大幅降低对手的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	chatter: {
		name: "喋喋不休",
		// Official flavor text: "用非常烦人的， 喋喋不休的音波攻击对手。 使对手混乱。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	chillingwater: {
		name: "泼冷水",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	chillyreception: {
		name: "冷笑话",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		prepare: "  {POKEMON}说出了冷笑话！",
	},
	chipaway: {
		name: "逐步击破",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	chloroblast: {
		name: "叶绿爆震",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	circlethrow: {
		name: "巴投",
		// Official flavor text: "扔飞对手，强制拉后备宝可梦上场。 如果对手为野生宝可梦， 战斗将直接结束。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	clamp: {
		name: "贝壳夹击",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
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
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}被{SOURCE}的贝壳夹住了！",
		move: "#wrap",
	},
	clangingscales: {
		name: "鳞片噪音",
		// Official flavor text: "摩擦全身鳞片， 发出响亮的声音进行攻击。 攻击后自己的防御会降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	clangoroussoul: {
		name: "魂舞烈音爆",
		// Official flavor text: "削减少许自己的ＨＰ， 使所有能力都提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	clangoroussoulblaze: {
		name: "炽魂热舞烈音爆",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	clearsmog: {
		name: "清除之烟",
		shortDesc: null, // NEEDS TRANSLATION
	},
	closecombat: {
		name: "近身战",
		// Official flavor text: "放弃守护， 向对手的怀里突击。 自己的防御和特防会降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	coaching: {
		name: "指导",
		// Official flavor text: "通过进行正确合理的指导， 提高我方全员的攻击和防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	coil: {
		name: "盘蜷",
		// Official flavor text: "盘蜷着集中精神。 提高自己的攻击、防御和命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	collisioncourse: {
		name: "全开猛撞",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	combattorque: {
		name: "格斗暴冲",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	cometpunch: {
		name: "连续拳",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	comeuppance: {
		name: "复仇",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	confide: {
		name: "密语",
		// Official flavor text: "和对手进行密语， 使其失去集中力， 从而降低对手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	confuseray: {
		name: "奇异之光",
		// Official flavor text: "显示奇怪的光， 扰乱对手。 使对手混乱。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	confusion: {
		name: "念力",
		// Official flavor text: "向对手发送 微弱的念力进行攻击。 有时会使对手混乱。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	constrict: {
		name: "缠绕",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	continentalcrush: {
		name: "毁天灭地巨岩坠",
		shortDesc: null, // NEEDS TRANSLATION
	},
	conversion: {
		name: "纹理",
		// Official flavor text: "将自己的属性转换成 和已学会的招式中 第一个招式相同的属性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		typeChange: null, // NEEDS TRANSLATION
	},
	conversion2: {
		name: "纹理２",
		// Official flavor text: "为了可以抵抗对手 最后使用的招式， 从而使自己的属性发生变化。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	copycat: {
		name: "仿效",
		// Official flavor text: "模仿对手刚才使出的招式， 并使出相同招式。 如果对手还没出招则会失败。"
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
	},
	coreenforcer: {
		name: "核心惩罚者",
		// Official flavor text: "如果给予过伤害的对手 已经结束行动， 其特性就会被消除。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	corkscrewcrash: {
		name: "超绝螺旋连击",
		shortDesc: null, // NEEDS TRANSLATION
	},
	corrosivegas: {
		name: "腐蚀气体",
		// Official flavor text: "用具有强酸性的气体 包裹住自己周围所有的宝可梦， 并融化其所携带的道具。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},

		fail: "#healblock",
		removeItem: "  {SOURCE}把{POKEMON}的{ITEM}融化了！",
	},
	cosmicpower: {
		name: "宇宙力量",
		// Official flavor text: "汲取宇宙中神秘的力量， 从而提高自己的防御和特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	cottonguard: {
		name: "棉花防守",
		// Official flavor text: "用软绵绵的绒毛包裹住 自己的身体进行守护。 巨幅提高自己的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	cottonspore: {
		name: "棉孢子",
		// Official flavor text: "将棉花般柔软的孢子 紧贴对手， 从而大幅降低对手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	counter: {
		name: "双倍奉还",
		// Official flavor text: "从对手那里受到 物理攻击的伤害将以 ２倍返还给同一个对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	courtchange: {
		name: "换场",
		// Official flavor text: "用神奇的力量 交换双方的场地效果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}交换了双方的场地效果！",
	},
	covet: {
		name: "渴望",
		// Official flavor text: "一边可爱地撒娇， 一边靠近对手进行攻击， 还能夺取对手携带的道具。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
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
	},
	crabhammer: {
		name: "蟹钳锤",
		// Official flavor text: "用大钳子 敲打对手进行攻击。 容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	craftyshield: {
		name: "戏法防守",
		// Official flavor text: "使用神奇的力量 防住攻击我方的变化招式。 但无法防住伤害招式的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {TEAM}受到了戏法防守的保护！",
		block: "  {POKEMON}受到了戏法防守的保护！",
	},
	crosschop: {
		name: "十字劈",
		// Official flavor text: "用两手呈十字 劈打对手进行攻击。 容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	crosspoison: {
		name: "十字毒刃",
		// Official flavor text: "用毒刃劈开对手。 有时会让对手陷入中毒状态， 也容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	crunch: {
		name: "咬碎",
		// Official flavor text: "用利牙咬碎对手进行攻击。 有时会降低对手的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	crushclaw: {
		name: "撕裂爪",
		// Official flavor text: "用坚硬的锐爪 劈开对手进行攻击。 有时会降低对手的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	crushgrip: {
		name: "捏碎",
		// Official flavor text: "用骇人的力量捏碎对手。 对手剩余的ＨＰ越多， 威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	curse: {
		name: "诅咒",
		// Official flavor text: "使用该招式的宝可梦， 其属性是幽灵属性或其他属性时， 效果会不一样。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {SOURCE}削减了自己的体力，并向{POKEMON}施加了咒术！",
		damage: "  {POKEMON}正受到诅咒！",
	},
	cut: {
		name: "居合斩",
		shortDesc: null, // NEEDS TRANSLATION
	},
	darkestlariat: {
		name: "ＤＤ金勾臂",
		// Official flavor text: "旋转双臂打向对手。 无视对手的能力变化， 直接给予伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	darkpulse: {
		name: "恶之波动",
		// Official flavor text: "从体内发出 充满恶意的恐怖气场。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	darkvoid: {
		name: "暗黑洞",
		// Official flavor text: "将对手强制拖入黑暗的世界， 从而让对手陷入睡眠状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		fail: "但是，{POKEMON}无法使用！",
		failWrongForme: "但是，现在的{POKEMON}无法使用！",
	},
	dazzlinggleam: {
		name: "魔法闪耀",
		// Official flavor text: "向对手发射强光， 并给予伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	decorate: {
		name: "装饰",
		// Official flavor text: "通过装饰， 大幅提高对方的 攻击和特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	defendorder: {
		name: "防御指令",
		// Official flavor text: "召唤手下， 让其附在自己的身体上。 可以提高自己的防御和特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	defensecurl: {
		name: "变圆",
		// Official flavor text: "将身体蜷曲变圆， 从而提高自己的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	defog: {
		name: "清除浓雾",
		// Official flavor text: "用强风吹开对手的 反射壁或光墙等。 也会降低对手的闪避率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	destinybond: {
		name: "同命",
		// Official flavor text: "使出招式后，当受到对手攻击 陷入濒死时，对手也会一同濒死。 连续使出则会失败。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}想和对手同归于尽！",
		activate: "{POKEMON}和对手同归于尽了！",
	},
	detect: {
		name: "看穿",
		// Official flavor text: "完全抵挡 对手的攻击。 连续使出则容易失败。"
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
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	devastatingdrake: {
		name: "究极巨龙震天地",
		shortDesc: null, // NEEDS TRANSLATION
	},
	diamondstorm: {
		name: "钻石风暴",
		// Official flavor text: "掀起钻石风暴给予伤害。 有时会大幅提高自己的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	dig: {
		name: "挖洞",
		// Official flavor text: "第１回合钻入， 第２回合攻击对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},

		prepare: "{POKEMON}钻入了地里！",
	},
	direclaw: {
		name: "克命爪",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	disable: {
		name: "定身法",
		// Official flavor text: "阻碍对手行动， 之前使出的招式 将在４回合内无法使用。"
		desc: null, // NEEDS TRANSLATION
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
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  封住了{POKEMON}的{MOVE}！",
		end: "  {POKEMON}的定身法解除了！",
		cant: "{POKEMON}因定身法而无法使出{MOVE}！",
	},
	disarmingvoice: {
		name: "魅惑之声",
		// Official flavor text: "发出魅惑的叫声， 给予对手精神上的伤害。 攻击必定会命中。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	discharge: {
		name: "放电",
		// Official flavor text: "用耀眼的电击 攻击自己周围所有的宝可梦。 有时会陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dive: {
		name: "潜水",
		// Official flavor text: "第１回合潜入， 第２回合浮上来进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},

		prepare: "{POKEMON}潜入了水中！",
	},
	dizzypunch: {
		name: "迷昏拳",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	doodle: {
		name: "描绘",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	doomdesire: {
		name: "破灭之愿",
		// Official flavor text: "使用招式２回合后， 会用无数道光束攻击对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}将破灭之愿托付给了未来！",
		activate: "  {TARGET}受到了破灭之愿的攻击！",
	},
	doubleedge: {
		name: "舍身冲撞",
		// Official flavor text: "拼命地猛撞向对手进行攻击。 自己也会受到不小的伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	doublehit: {
		name: "二连击",
		// Official flavor text: "使用尾巴等 拍打对手进行攻击。 连续２次给予伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	doubleironbash: {
		name: "钢拳双击",
		// Official flavor text: "以胸口的螺帽为中心旋转， 并连续２次挥动手臂打击对手。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	doublekick: {
		name: "二连踢",
		// Official flavor text: "用２只脚踢飞对手进行攻击。 连续２次给予伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	doubleshock: {
		name: "电光双击",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		typeChange: "  {POKEMON}用尽电力了！",
	},
	doubleslap: {
		name: "连环巴掌",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	doubleteam: {
		name: "影子分身",
		// Official flavor text: "通过快速移动来制造分身， 扰乱对手，从而提高闪避率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dracometeor: {
		name: "流星群",
		// Official flavor text: "从天空中向对手落下陨石。 使用之后因为反作用力， 自己的特攻会大幅降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonascent: {
		name: "画龙点睛",
		// Official flavor text: "从天空中急速下降攻击对手。 自己的防御和特防会降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		megaNoItem: "  {TRAINER}衷心的祈愿传递到了{POKEMON}那里！",
	},
	dragonbreath: {
		name: "龙息",
		// Official flavor text: "将强烈的气息 吹向对手进行攻击。 有时会让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragoncheer: {
		name: "龙声鼓舞",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "#focusenergy",
	},
	dragonclaw: {
		name: "龙爪",
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragondance: {
		name: "龙之舞",
		// Official flavor text: "激烈地跳起神秘 且强有力的舞蹈。 从而提高自己的攻击和速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragondarts: {
		name: "龙箭",
		// Official flavor text: "让多龙梅西亚进行２次攻击。 如果对手有２只宝可梦， 则对它们各进行１次攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonenergy: {
		name: "巨龙威能",
		// Official flavor text: "把生命力转换为力量攻击对手。 自己的ＨＰ越少，招式的威力越小。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonhammer: {
		name: "龙锤",
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonpulse: {
		name: "龙之波动",
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonrage: {
		name: "龙之怒",
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonrush: {
		name: "龙之俯冲",
		// Official flavor text: "释放出骇人的杀气， 一边威慑一边撞击对手。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	dragontail: {
		name: "龙尾",
		// Official flavor text: "弹飞对手，强制拉后备宝可梦上场。 如果对手为野生宝可梦， 战斗将直接结束。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	drainingkiss: {
		name: "吸取之吻",
		// Official flavor text: "用一个吻吸取对手的ＨＰ。 回复给予对手 伤害的一半以上的ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	drainpunch: {
		name: "吸取拳",
		// Official flavor text: "用拳头吸取对手的力量。 可以回复给予对手 伤害的一半ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	dreameater: {
		name: "食梦",
		// Official flavor text: "吃掉正在睡觉的对手的梦 进行攻击。回复对手 所受到伤害的一半ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	drillpeck: {
		name: "啄钻",
		shortDesc: null, // NEEDS TRANSLATION
	},
	drillrun: {
		name: "直冲钻",
		// Official flavor text: "像钢钻一样，一边旋转身体 一边撞击对手。 容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	drumbeating: {
		name: "鼓击",
		// Official flavor text: "用鼓点来控制 鼓的根部进行攻击， 从而降低对手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dualchop: {
		name: "二连劈",
		// Official flavor text: "用身体坚硬的部分 拍打对手进行攻击。 连续２次给予伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dualwingbeat: {
		name: "双翼",
		// Official flavor text: "将翅膀撞向对手进行攻击。 连续２次给予伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dynamaxcannon: {
		name: "极巨炮",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	dynamicpunch: {
		name: "爆裂拳",
		// Official flavor text: "使出浑身力气出拳进行攻击。 必定会使对手混乱。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	earthpower: {
		name: "大地之力",
		// Official flavor text: "向对手脚下 释放出大地之力。 有时会降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	earthquake: {
		name: "地震",
		// Official flavor text: "利用地震的冲击， 攻击自己周围所有的宝可梦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	echoedvoice: {
		name: "回声",
		// Official flavor text: "用回声攻击对手。 如果每回合都有宝可梦接着 使用该招式，威力就会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	eerieimpulse: {
		name: "怪异电波",
		// Official flavor text: "从身体放射出怪异电波， 让对手沐浴其中， 从而大幅降低其特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	eeriespell: {
		name: "诡异咒语",
		// Official flavor text: "用强大的精神力量攻击。 让对手最后使用的招式 减少３ＰＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "#spite",
	},
	eggbomb: {
		name: "炸蛋",
		shortDesc: null, // NEEDS TRANSLATION
	},
	electricterrain: {
		name: "电气场地",
		// Official flavor text: "在５回合内变成电气场地。 地面上的宝可梦将无法入眠。 电属性的招式威力还会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	electrify: {
		name: "输电",
		// Official flavor text: "对手使出招式前， 如果输电，则该回合 对手的招式变成电属性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  因为输电，{POKEMON}的招式变成了电属性！",
	},
	electroball: {
		name: "电球",
		// Official flavor text: "用电气团撞向对手。 自己比对手速度越快， 威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	electrodrift: {
		name: "闪电猛冲",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	electroshot: {
		name: "电光束",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		prepare: "{POKEMON}吸收了电力！",
	},
	electroweb: {
		name: "电网",
		// Official flavor text: "用电网捉住对手进行攻击。 降低对手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	embargo: {
		name: "查封",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}无法使用道具了！",
		end: "  {POKEMON}变得可以使用道具了！",
	},
	ember: {
		name: "火花",
		// Official flavor text: "向对手发射 小型火焰进行攻击。 有时会让对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	encore: {
		name: "再来一次",
		// Official flavor text: "让对手接受再来一次， 连续３次使出最后使用的招式。"
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
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}接受了再来一次！",
		end: "  {POKEMON}的再来一次状态解除了！",
	},
	endeavor: {
		name: "蛮干",
		// Official flavor text: "给予伤害， 使对手的ＨＰ变得 和自己的ＨＰ一样。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	endure: {
		name: "挺住",
		// Official flavor text: "即使受到攻击， 也至少会留下１ＨＰ。 连续使出则容易失败。"
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
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}摆出了挺住攻击的架势！",
		activate: "  {POKEMON}挺住了攻击！",
	},
	energyball: {
		name: "能量球",
		// Official flavor text: "发射从自然收集的生命力量。 有时会降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	entrainment: {
		name: "找伙伴",
		// Official flavor text: "用神奇的节奏跳舞。 使对手模仿自己的动作， 从而将特性变成一样。"
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
	},
	eruption: {
		name: "喷火",
		// Official flavor text: "爆发怒火攻击对手。 自己的ＨＰ越少， 招式的威力越小。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	esperwing: {
		name: "气场之翼",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	eternabeam: {
		name: "无极光束",
		// Official flavor text: "无极汰那变回原来的样子后， 发动的最强攻击。 下一回合自己将无法动弹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	expandingforce: {
		name: "广域战力",
		// Official flavor text: "利用精神力量攻击对手。 在精神场地上威力会有所提高， 能对所有对手造成伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	explosion: {
		name: "大爆炸",
		// Official flavor text: "引发大爆炸， 攻击自己周围所有的宝可梦。 使用后自己会陷入濒死。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	extrasensory: {
		name: "神通力",
		// Official flavor text: "发出看不见的 神奇力量进行攻击。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	extremeevoboost: {
		name: "九彩升华齐聚顶",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	extremespeed: {
		name: "神速",
		// Official flavor text: "以迅雷不及掩耳之势 猛撞向对手进行攻击。 必定能够先制攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	facade: {
		name: "硬撑",
		// Official flavor text: "当自己处于中毒、麻痹、灼伤状态时， 向对手使出此招式的话， 威力会变成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	fairylock: {
		name: "妖精之锁",
		// Official flavor text: "通过封锁， 下一回合所有的 宝可梦都无法逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  下回合无法逃走！",
	},
	fairywind: {
		name: "妖精之风",
		shortDesc: null, // NEEDS TRANSLATION
	},
	fakeout: {
		name: "击掌奇袭",
		// Official flavor text: "进行先制攻击，使对手畏缩。 要在出场后立刻使出才能成功。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	faketears: {
		name: "假哭",
		// Official flavor text: "装哭流泪。 使对手不知所措， 从而大幅降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	falsesurrender: {
		name: "假跪真撞",
		shortDesc: null, // NEEDS TRANSLATION
	},
	falseswipe: {
		name: "点到为止",
		// Official flavor text: "对手的ＨＰ 至少会留下１ＨＰ， 如此般手下留情地攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	featherdance: {
		name: "羽毛舞",
		// Official flavor text: "撒出羽毛， 笼罩在对手的周围。 大幅降低对手的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	feint: {
		name: "佯攻",
		// Official flavor text: "能够攻击正在使用 守住或看穿等招式的对手。 解除其守护效果。"
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
			shortDesc: null, // NEEDS TRANSLATION
		},

		activate: "  {TARGET}中了佯攻！",
	},
	feintattack: {
		name: "出奇一击",
		shortDesc: null, // NEEDS TRANSLATION
	},
	fellstinger: {
		name: "致命针刺",
		// Official flavor text: "如果使用此招式打倒对手， 攻击会巨幅提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	ficklebeam: {
		name: "随机光",
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}拿出全力了！",
	},
	fierydance: {
		name: "火之舞",
		// Official flavor text: "让火焰覆盖全身， 振翅攻击对手。 有时会提高自己的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fierywrath: {
		name: "怒火中烧",
		// Official flavor text: "将愤怒转化为火焰般的气场进行攻击。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	filletaway: {
		name: "甩肉",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	finalgambit: {
		name: "搏命",
		// Official flavor text: "拼命攻击对手。 虽然自己陷入濒死，但会给予对手 和自己目前ＨＰ等量的伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fireblast: {
		name: "大字爆炎",
		// Official flavor text: "用大字形状的火焰烧尽对手。 有时会让对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	firefang: {
		name: "火焰牙",
		// Official flavor text: "用覆盖着火焰的牙齿咬住对手。 有时会使对手畏缩 或陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	firelash: {
		name: "火焰鞭",
		// Official flavor text: "用燃烧的鞭子抽打对手。 受到攻击的对手防御会降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	firepledge: {
		name: "火之誓约",
		// Official flavor text: "用火柱进行攻击。 如果和草组合，威力就会提高， 周围会变成火海。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "#waterpledge",
		start: "  {TEAM}周围被火海包围了！",
		end: "  {TEAM}周围的火海消失不见了！",
		damage: "  {POKEMON}受到了火海的伤害！",
	},
	firepunch: {
		name: "火焰拳",
		// Official flavor text: "用充满火焰的拳头攻击对手。 有时会让对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	firespin: {
		name: "火焰旋涡",
		// Official flavor text: "将对手困在 激烈的火焰旋涡中， 在４～５回合内进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
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
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}被困在了火焰旋涡之中！",
		move: "#wrap",
	},
	firstimpression: {
		name: "迎头一击",
		// Official flavor text: "威力很高的招式， 但只有在出场战斗时， 立刻使出才能成功。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	fishiousrend: {
		name: "鳃咬",
		// Official flavor text: "用坚硬的腮咬住对手。 如果比对手先出手攻击， 招式的威力会变成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fissure: {
		name: "地裂",
		// Official flavor text: "让对手掉落于地裂的 裂缝中进行攻击。 只要命中就会一击濒死。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	flail: {
		name: "抓狂",
		// Official flavor text: "抓狂般乱打进行攻击。 自己的ＨＰ越少， 招式的威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	flameburst: {
		name: "烈焰溅射",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		damage: "  火花也溅射到了{POKEMON}的身上！",
	},
	flamecharge: {
		name: "蓄能焰袭",
		// Official flavor text: "让火焰覆盖全身，攻击对手。 积蓄力量并提高自己的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flamethrower: {
		name: "喷射火焰",
		// Official flavor text: "向对手发射 烈焰进行攻击。 有时会让对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flamewheel: {
		name: "火焰轮",
		// Official flavor text: "让火焰覆盖全身， 猛撞向对手进行攻击。 有时会让对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flareblitz: {
		name: "闪焰冲锋",
		// Official flavor text: "让火焰覆盖全身猛撞向对手。 自己也会受到不小的伤害。 有时会让对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	flash: {
		name: "闪光",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flashcannon: {
		name: "加农光炮",
		// Official flavor text: "将身体的光芒 聚集在一点释放出去。 有时会降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flatter: {
		name: "吹捧",
		// Official flavor text: "吹捧对手，使其混乱。 同时还会提高对手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fleurcannon: {
		name: "花朵加农炮",
		// Official flavor text: "放出强力光束后， 自己的特攻会大幅降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fling: {
		name: "投掷",
		// Official flavor text: "快速投掷携带的道具进行攻击。 根据道具不同， 威力和效果会改变。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		removeItem: "  {POKEMON}投掷了{ITEM}！",
	},
	flipturn: {
		name: "快速折返",
		// Official flavor text: "在攻击之后急速返回， 和后备宝可梦进行替换。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		switchOut: "#uturn",
	},
	floatyfall: {
		name: "飘飘坠落",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	floralhealing: {
		name: "花疗",
		// Official flavor text: "回复对手最大ＨＰ的一半。 在青草场地时，效果会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flowershield: {
		name: "鲜花防守",
		// Official flavor text: "使用神奇的力量 提高在场的所有 草属性宝可梦的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flowertrick: {
		name: "千变万花",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fly: {
		name: "飞翔",
		// Official flavor text: "第１回合飞上天空， 第２回合攻击对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},

		prepare: "{POKEMON}飞向了高空！",
	},
	flyingpress: {
		name: "飞身重压",
		// Official flavor text: "从空中俯冲向对手。 此招式同时带有 格斗属性和飞行属性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	focusblast: {
		name: "真气弹",
		// Official flavor text: "提高气势， 释放出全部力量。 有时会降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	focusenergy: {
		name: "聚气",
		// Official flavor text: "深深地吸口气，集中精神。 自己的攻击 会变得容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}现在干劲十足！",
		startFromItem: "  {POKEMON}使用了{ITEM}，拿出了干劲！",
		startFromZEffect: "  因为Ｚ力量，{POKEMON}变得容易击中要害了！",
	},
	focuspunch: {
		name: "真气拳",
		// Official flavor text: "集中精神出拳。 在招式使出前 若受到攻击则会失败。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}聚精会神了起来！",
		cant: "{POKEMON}聚气时受到干扰，无法使出招式！",
	},
	followme: {
		name: "看我嘛",
		// Official flavor text: "引起对手的注意， 将对手的攻击 全部转移到自己身上。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}变得万众瞩目了！",
		startFromZEffect: "  {POKEMON}变得万众瞩目了！",
	},
	forcepalm: {
		name: "发劲",
		// Official flavor text: "向对手的身体 发出冲击波进行攻击。 有时会让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	foresight: {
		name: "识破",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  识破了{POKEMON}的原形！",
	},
	forestscurse: {
		name: "森林诅咒",
		// Official flavor text: "向对手施加森林诅咒。 中了诅咒的对手 会被追加草属性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	foulplay: {
		name: "欺诈",
		// Official flavor text: "利用对手的力量进行攻击。 正和自己战斗的对手， 其攻击越高，伤害越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	freezedry: {
		name: "冷冻干燥",
		// Official flavor text: "急剧冷冻对手， 有时会让对手陷入冰冻状态。 对于水属性宝可梦也是效果绝佳。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	freezeshock: {
		name: "冰冻伏特",
		// Official flavor text: "用覆盖着电流的冰块， 在第２回合撞向对手。 有时会让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		prepare: "  {POKEMON}被冷光包围了！",
	},
	freezingglare: {
		name: "冰冷视线",
		// Official flavor text: "从双眼发射精神力量进行攻击。 有时会让对手陷入冰冻状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	freezyfrost: {
		name: "冰冰霜冻",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	frenzyplant: {
		name: "疯狂植物",
		// Official flavor text: "用大树摔打对手进行攻击。 下一回合自己将无法动弹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	frostbreath: {
		name: "冰息",
		// Official flavor text: "将冰冷的气息 吹向对手进行攻击。 必定会击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	frustration: {
		name: "迁怒",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	furyattack: {
		name: "乱击",
		// Official flavor text: "用角或喙 刺向对手进行攻击。 连续攻击２～５次。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	furycutter: {
		name: "连斩",
		// Official flavor text: "用镰刀或爪子等 切斩对手进行攻击。 连续击中，威力就会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	furyswipes: {
		name: "乱抓",
		// Official flavor text: "用爪子或镰刀等 抓对手进行攻击。 连续攻击２～５次。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	fusionbolt: {
		name: "交错闪电",
		// Official flavor text: "释放出巨大的闪电。 受到巨大的火焰影响时， 招式威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fusionflare: {
		name: "交错火焰",
		// Official flavor text: "释放出巨大的火焰。 受到巨大的闪电影响时， 招式威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	futuresight: {
		name: "预知未来",
		// Official flavor text: "在使用招式２回合后， 向对手发送一团念力进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}预知了未来的攻击！",
		activate: "  {TARGET}受到了预知未来的攻击！",
	},
	gastroacid: {
		name: "胃液",
		// Official flavor text: "将胃液吐向对手的身体。 沾上的胃液会消除 对手的特性效果。"
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

		start: "  {POKEMON}的特性变得无效了！",
	},
	geargrind: {
		name: "齿轮飞盘",
		// Official flavor text: "向对手投掷 钢铁齿轮进行攻击。 连续２次给予伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gearup: {
		name: "辅助齿轮",
		// Official flavor text: "启动齿轮， 提高特性为正电和负电的 宝可梦的攻击和特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	genesissupernova: {
		name: "起源超新星大爆炸",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	geomancy: {
		name: "大地掌控",
		// Official flavor text: "第１回合吸收能量， 第２回合大幅提高 特攻、特防和速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		prepare: "{POKEMON}正在积蓄力量！",
	},
	gigadrain: {
		name: "终极吸取",
		// Official flavor text: "吸取对手的养分进行攻击。 可以回复给予对手 伤害的一半ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	gigaimpact: {
		name: "终极冲击",
		// Official flavor text: "使出自己浑身力量突击对手。 下一回合自己将无法动弹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gigatonhammer: {
		name: "巨力锤",
		shortDesc: null, // NEEDS TRANSLATION
	},
	gigavolthavoc: {
		name: "终极伏特狂雷闪",
		shortDesc: null, // NEEDS TRANSLATION
	},
	glaciallance: {
		name: "雪矛",
		// Official flavor text: "向对手投掷 掀起暴风雪的冰矛进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	glaciate: {
		name: "冰封世界",
		// Official flavor text: "将冰冻的冷气 吹向对手进行攻击。 会降低对手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	glaiverush: {
		name: "巨剑突击",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	glare: {
		name: "大蛇瞪眼",
		// Official flavor text: "用腹部的花纹使对手害怕， 从而让其陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	glitzyglow: {
		name: "哗哗气场",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxbefuddle: {
		name: "超极巨蝶影蛊惑",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxcannonade: {
		name: "超极巨水炮轰灭",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {PARTY}被困在水流之中！",
		damage: "  {POKEMON}被吞没在超极巨水炮轰灭的水流里，痛苦难耐！",
	},
	gmaxcentiferno: {
		name: "超极巨百火焚野",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxchistrike: {
		name: "超极巨会心一击",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "#focusenergy",
	},
	gmaxcuddle: {
		name: "超极巨热情拥抱",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxdepletion: {
		name: "超极巨劣化衰变",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {TARGET}的PP减少了！",
	},
	gmaxdrumsolo: {
		name: "超极巨狂擂乱打",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxfinale: {
		name: "超极巨幸福圆满",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxfireball: {
		name: "超极巨破阵火球",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxfoamburst: {
		name: "超极巨激漩泡涡",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxgoldrush: {
		name: "超极巨特大金币",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxgravitas: {
		name: "超极巨天道七星",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxhydrosnipe: {
		name: "超极巨狙击神射",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxmalodor: {
		name: "超极巨臭气冲天",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxmeltdown: {
		name: "超极巨液金熔击",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxoneblow: {
		name: "超极巨夺命一击",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxrapidflow: {
		name: "超极巨流水连击",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxreplenish: {
		name: "超极巨资源再生",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxresonance: {
		name: "超极巨极光旋律",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxsandblast: {
		name: "超极巨沙尘漫天",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxsmite: {
		name: "超极巨天谴雷诛",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxsnooze: {
		name: "超极巨睡魔降临",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxsteelsurge: {
		name: "超极巨钢铁阵法",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {PARTY}周围开始悬浮起尖锐的钢刺！",
		end: "  {PARTY}周围的钢刺消失了！",
		damage: "  尖锐的钢刺扎进了{POKEMON}体内！",
	},
	gmaxstonesurge: {
		name: "超极巨岩阵以待",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxstunshock: {
		name: "超极巨异毒电场",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxsweetness: {
		name: "超极巨琼浆玉液",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxtartness: {
		name: "超极巨酸不溜丢",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxterror: {
		name: "超极巨幻影幽魂",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxvinelash: {
		name: "超极巨灰飞鞭灭",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {PARTY}被困在鞭子的猛击中！",
		damage: "  {POKEMON}被暴露在超极巨灰飞鞭灭的猛击下，疼痛难忍！",
	},
	gmaxvolcalith: {
		name: "超极巨炎石喷发",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {PARTY}被困在岩石之中！",
		damage: "  {POKEMON}被困在超极巨炎石喷发的岩石之中，疼痛难忍！",
	},
	gmaxvoltcrash: {
		name: "超极巨万雷轰顶",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxwildfire: {
		name: "超极巨地狱灭焰",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {PARTY}被困在火焰之中！",
		damage: "  {POKEMON}被超极巨地狱灭焰的火焰包围，酷热难耐！",
	},
	gmaxwindrage: {
		name: "超极巨旋风袭卷",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	grassknot: {
		name: "打草结",
		// Official flavor text: "用草缠住并绊倒对手。 对手越重，威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	grasspledge: {
		name: "草之誓约",
		// Official flavor text: "用草柱进行攻击。 如果和水组合，威力就会提高， 周围会变成湿地。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "#waterpledge",
		start: "  在{TEAM}周围延伸出了湿地！",
		end: "  {TEAM}周围的湿地消失不见了！",
	},
	grasswhistle: {
		name: "草笛",
		shortDesc: null, // NEEDS TRANSLATION
	},
	grassyglide: {
		name: "青草滑梯",
		// Official flavor text: "仿佛在地面上滑行般地攻击对手。 在青草场地上， 必定能够先制攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	grassyterrain: {
		name: "青草场地",
		// Official flavor text: "在５回合内变成青草场地。 地面上的宝可梦每回合都能回复。 草属性的招式威力还会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	gravapple: {
		name: "万有引力",
		// Official flavor text: "从高处落下苹果， 给予对手伤害。 可降低对手的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gravity: {
		name: "重力",
		// Official flavor text: "在５回合内，飘浮特性和飞行属性的 宝可梦会被地面属性的招式击中。 飞向空中的招式也将无法使用。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
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
	},
	growl: {
		name: "叫声",
		// Official flavor text: "让对手听可爱的叫声， 引开注意力使其疏忽， 从而降低对手的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	growth: {
		name: "生长",
		// Official flavor text: "让身体一下子长大， 从而提高攻击和特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	grudge: {
		name: "怨念",
		// Official flavor text: "因对手的招式而陷入濒死时 给对手施加怨念， 让该招式的ＰＰ变成０。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  因为怨念，{POKEMON}失去了其招式{MOVE}的所有ＰＰ！",
		start: "{POKEMON}想向对手施放怨念！",
	},
	guardianofalola: {
		name: "巨人卫士・阿罗拉",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	guardsplit: {
		name: "防守平分",
		// Official flavor text: "利用超能力将自己和对手的 防御和特防相加， 再进行平分。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}平分了各自的防守！",
	},
	guardswap: {
		name: "防守互换",
		// Official flavor text: "利用超能力互换 自己和对手的防御 以及特防的能力变化。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	guillotine: {
		name: "断头钳",
		// Official flavor text: "用大钳子或剪刀等 夹断对手进行攻击。 只要命中就会一击濒死。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	gunkshot: {
		name: "垃圾射击",
		// Official flavor text: "用肮脏的垃圾 撞向对手进行攻击。 有时会让对手陷入中毒状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gust: {
		name: "起风",
		// Official flavor text: "用翅膀将刮起的狂风 袭向对手进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	gyroball: {
		name: "陀螺球",
		// Official flavor text: "让身体高速旋转并撞击对手。 速度比对手越慢，威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	hail: {
		name: "冰雹",
		// Official flavor text: "在５回合内一直降冰雹， 除冰属性的宝可梦以外， 给予全体宝可梦伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	hammerarm: {
		name: "臂锤",
		// Official flavor text: "挥舞强力而沉重的拳头， 给予对手伤害。 自己的速度会降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	happyhour: {
		name: "欢乐时光",
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  大家被欢乐的气氛包围了！",
	},
	harden: {
		name: "变硬",
		// Official flavor text: "全身使劲，让身体变硬， 从而提高自己的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hardpress: {
		name: "硬压",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	haze: {
		name: "黑雾",
		// Official flavor text: "升起黑雾，将正在场上战斗的 全体宝可梦的能力变回原点。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		// Only used in Gen 1
		activate: "  所有能力都复原了！",
	},
	headbutt: {
		name: "头锤",
		// Official flavor text: "将头伸出， 笔直地扑向对手进行攻击。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	headcharge: {
		name: "爆炸头突击",
		// Official flavor text: "用厉害的爆炸头 猛撞向对手进行攻击。 自己也会受到少许伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	headlongrush: {
		name: "突飞猛扑",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	headsmash: {
		name: "双刃头锤",
		// Official flavor text: "拼命使出浑身力气， 向对手进行头锤攻击。 自己也会受到非常大的伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	healbell: {
		name: "治愈铃声",
		// Official flavor text: "让同伴听舒适的铃音， 从而治愈我方全员的异常状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  铃声响彻四周！",
	},
	healblock: {
		name: "回复封锁",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			end: "  {POKEMON}的回复封锁的效果消失了！",
			cant: "{POKEMON}因回复封锁而无法使出{MOVE}！",
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

		start: "  {POKEMON}的回复行为被封住了！",
		end: "  {POKEMON}的回复封锁的效果消失了！",
		cant: "{POKEMON}因回复封锁而无法使出{MOVE}！",
		fail: "  但是，对于{POKEMON}没有起到效果！",
	},
	healingwish: {
		name: "治愈之愿",
		// Official flavor text: "虽然自己陷入濒死， 但可以治愈后备上场的 宝可梦的异常状态以及回复ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		heal: "  治愈之愿在{POKEMON}身上实现了！",
	},
	healorder: {
		name: "回复指令",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	healpulse: {
		name: "治愈波动",
		// Official flavor text: "放出治愈波动， 从而回复对手 最大ＨＰ的一半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	heartstamp: {
		name: "爱心印章",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	heartswap: {
		name: "心灵互换",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	heatcrash: {
		name: "高温重压",
		// Official flavor text: "用燃烧的身体撞向对手进行攻击。 自己比对手越重，威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	heatwave: {
		name: "热风",
		// Official flavor text: "将炎热的气息 吹向对手进行攻击。 有时会让对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	heavyslam: {
		name: "重磅冲撞",
		// Official flavor text: "用沉重的身体撞向对手进行攻击。 自己比对手越重，威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	helpinghand: {
		name: "帮助",
		// Official flavor text: "帮助伙伴。 被帮助的宝可梦， 其招式威力变得比平时大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {SOURCE}摆出了帮助{POKEMON}的架势！",
	},
	hex: {
		name: "祸不单行",
		// Official flavor text: "接二连三地进行攻击。 对处于异常状态的对手 给予较大的伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hiddenpower: {
		name: "觉醒力量",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	hiddenpowerbug: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowerdark: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowerdragon: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowerelectric: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowerfighting: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowerfire: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowerflying: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowerghost: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowergrass: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowerground: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowerice: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowerpoison: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowerpsychic: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowerrock: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowersteel: {
		name: null, // NEEDS TRANSLATION
	},
	hiddenpowerwater: {
		name: null, // NEEDS TRANSLATION
	},
	highhorsepower: {
		name: "十万马力",
		shortDesc: null, // NEEDS TRANSLATION
	},
	highjumpkick: {
		name: "飞膝踢",
		// Official flavor text: "跳起后用膝盖撞对手进行攻击。 如果撞偏则自己会受到伤害。"
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
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		damage: "#crash",
	},
	holdback: {
		name: "手下留情",
		// Official flavor text: "在攻击的时候手下留情， 从而使对手的ＨＰ 至少会留下１ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	holdhands: {
		name: "牵手",
		// Official flavor text: "我方宝可梦之间牵手。 能带来非常幸福的心情。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	honeclaws: {
		name: "磨爪",
		// Official flavor text: "将爪子磨得更加锋利。 提高自己的攻击和命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hornattack: {
		name: "角撞",
		shortDesc: null, // NEEDS TRANSLATION
	},
	horndrill: {
		name: "角钻",
		// Official flavor text: "用旋转的角 刺入对手进行攻击。 只要命中就会一击濒死。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	hornleech: {
		name: "木角",
		// Official flavor text: "将角刺入，吸取对手的养分。 可以回复给予对手 伤害的一半ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	howl: {
		name: "长嚎",
		// Official flavor text: "大声吼叫提高气势， 从而提高自己和同伴的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	hurricane: {
		name: "暴风",
		// Official flavor text: "用强烈的风席卷 对手进行攻击。 有时会使对手混乱。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	hydrocannon: {
		name: "加农水炮",
		// Official flavor text: "向对手喷射水炮进行攻击。 下一回合自己将无法动弹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hydropump: {
		name: "水炮",
		shortDesc: null, // NEEDS TRANSLATION
	},
	hydrosteam: {
		name: "水蒸气",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hydrovortex: {
		name: "超级水流大漩涡",
		shortDesc: null, // NEEDS TRANSLATION
	},
	hyperbeam: {
		name: "破坏光线",
		// Official flavor text: "向对手发射 强烈的光线进行攻击。 下一回合自己将无法动弹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	hyperdrill: {
		name: "强力钻",
		shortDesc: null, // NEEDS TRANSLATION
	},
	hyperfang: {
		name: "必杀门牙",
		// Official flavor text: "用锋利的门牙 牢牢地咬住对手进行攻击。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hyperspacefury: {
		name: "异次元猛攻",
		// Official flavor text: "用许多手臂，无视对手的 守住或看穿等招式进行连续攻击， 自己的防御会降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "#shadowforce",
		fail: "#darkvoid",
	},
	hyperspacehole: {
		name: "异次元洞",
		// Official flavor text: "通过异次元洞， 突然出现在对手的侧面进行攻击。 还可以无视守住和看穿等招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "#shadowforce",
	},
	hypervoice: {
		name: "巨声",
		// Official flavor text: "给予对手又吵又响的 巨大震动进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hypnosis: {
		name: "催眠术",
		shortDesc: null, // NEEDS TRANSLATION
	},
	iceball: {
		name: "冰球",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	icebeam: {
		name: "冰冻光束",
		// Official flavor text: "向对手发射 冰冻光束进行攻击。 有时会让对手陷入冰冻状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	iceburn: {
		name: "极寒冷焰",
		// Official flavor text: "用能够冻结一切的强烈冷气， 在第２回合包裹住对手。 有时会让对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		prepare: "  {POKEMON}被冰冻的空气包围了！",
	},
	icefang: {
		name: "冰冻牙",
		// Official flavor text: "用藏有冷气的牙齿咬住对手。 有时会使对手畏缩 或陷入冰冻状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	icehammer: {
		name: "冰锤",
		// Official flavor text: "挥舞强力而沉重的拳头， 给予对手伤害。 自己的速度会降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	icepunch: {
		name: "冰冻拳",
		// Official flavor text: "用充满寒气的拳头攻击对手。 有时会让对手陷入冰冻状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	iceshard: {
		name: "冰砾",
		// Official flavor text: "瞬间制作冰块， 快速地扔向对手。 必定能够先制攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	icespinner: {
		name: "冰旋",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	iciclecrash: {
		name: "冰柱坠击",
		// Official flavor text: "用大冰柱激烈地 撞向对手进行攻击。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	iciclespear: {
		name: "冰锥",
		// Official flavor text: "向对手发射 锋利的冰柱进行攻击。 连续攻击２～５次。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	icywind: {
		name: "冰冻之风",
		// Official flavor text: "将结冰的冷气 吹向对手进行攻击。 会降低对手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	imprison: {
		name: "封印",
		// Official flavor text: "如果对手有和自己相同的招式， 那么只有对手无法使用该招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}封印了对手的招式！",
		cant: "{POKEMON}因封印而无法使出{MOVE}！",
	},
	incinerate: {
		name: "烧尽",
		// Official flavor text: "用火焰攻击对手。 对手携带树果等时， 会烧掉，使其不能使用。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		removeItem: "  {POKEMON}的{ITEM}被烧没了！",
	},
	infernalparade: {
		name: "群魔乱舞",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	inferno: {
		name: "炼狱",
		// Official flavor text: "用烈焰包裹住对手进行攻击。 让对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	infernooverdrive: {
		name: "超强极限爆焰弹",
		shortDesc: null, // NEEDS TRANSLATION
	},
	infestation: {
		name: "死缠烂打",
		// Official flavor text: "在４～５回合内 死缠烂打地进行攻击。 在此期间对手将无法逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}受到了{SOURCE}的死缠烂打！",
	},
	ingrain: {
		name: "扎根",
		// Official flavor text: "在大地上扎根， 每回合回复自己的ＨＰ。 因为扎根了，所以不能替换宝可梦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
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
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}扎下了根！",
		block: "  {POKEMON}扎下了根，屹立不动！",
		heal: "  {POKEMON}从根上吸取了养分！",
	},
	instruct: {
		name: "号令",
		// Official flavor text: "向对手下达指示， 让其再次使出刚才的招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  根据{POKEMON}的指示，{TARGET}使出了招式！",
	},
	iondeluge: {
		name: "等离子浴",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  等离子雨倾盆而下！",
	},
	irondefense: {
		name: "铁壁",
		// Official flavor text: "将皮肤变得坚硬如铁， 从而大幅提高自己的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	ironhead: {
		name: "铁头",
		// Official flavor text: "用钢铁般 坚硬的头部进行攻击。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	irontail: {
		name: "铁尾",
		// Official flavor text: "使用坚硬的尾巴 摔打对手进行攻击。 有时会降低对手的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	ivycudgel: {
		name: "棘藤棒",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	jawlock: {
		name: "紧咬不放",
		// Official flavor text: "使双方直到一方濒死为止 无法替换宝可梦。 其中一方退场则可以解除效果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	jetpunch: {
		name: "喷射拳",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	judgment: {
		name: "制裁光砾",
		// Official flavor text: "向对手放出无数的光弹。 属性会根据自己 携带的石板不同而改变。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	jumpkick: {
		name: "飞踢",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
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
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		damage: "#crash",
	},
	junglehealing: {
		name: "丛林治疗",
		// Official flavor text: "与丛林融为一体， 回复自己和场上同伴的ＨＰ和状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	karatechop: {
		name: "空手劈",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	kinesis: {
		name: "折弯汤匙",
		// Official flavor text: "折弯汤匙引开注意， 从而降低对手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	kingsshield: {
		name: "王者盾牌",
		// Official flavor text: "防住对手攻击的同时， 自己变为防御姿态。 能够降低所接触到的对手的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	knockoff: {
		name: "拍落",
		// Official flavor text: "拍落对手的持有物， 直到战斗结束都不能使用。 对手携带道具时会增加伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
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
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},

		removeItem: "  {SOURCE}拍落了{POKEMON}的{ITEM}！",
	},
	kowtowcleave: {
		name: "仆刀",
		shortDesc: null, // NEEDS TRANSLATION
	},
	landswrath: {
		name: "大地神力",
		// Official flavor text: "聚集大地的力量， 将此力量集中攻击对手， 并给予伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	laserfocus: {
		name: "磨砺",
		// Official flavor text: "集中精神， 下次攻击必定会击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}磨砺了精神！",
	},
	lashout: {
		name: "泄愤",
		// Official flavor text: "攻击对手以发泄对其感到的恼怒情绪。 如果在该回合内自身能力遭到降低， 招式的威力会变成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lastresort: {
		name: "珍藏",
		// Official flavor text: "当战斗中已学会的招式 全部使用过后， 才能开始使出珍藏的招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lastrespects: {
		name: "扫墓",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lavaplume: {
		name: "喷烟",
		// Official flavor text: "用熊熊烈火 攻击自己周围所有的宝可梦。 有时会陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	leafage: {
		name: "树叶",
		shortDesc: null, // NEEDS TRANSLATION
	},
	leafblade: {
		name: "叶刃",
		// Official flavor text: "像用剑一般操纵叶片 切斩对手进行攻击。 容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	leafstorm: {
		name: "飞叶风暴",
		// Official flavor text: "用尖尖的叶片向对手卷起风暴。 使用之后因为反作用力 自己的特攻会大幅降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	leaftornado: {
		name: "青草搅拌器",
		// Official flavor text: "用锋利的叶片包裹住 对手进行攻击。 有时会降低对手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	leechlife: {
		name: "吸血",
		// Official flavor text: "吸取血液攻击对手。 可以回复给予对手 伤害的一半ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	leechseed: {
		name: "寄生种子",
		// Official flavor text: "植入寄生种子后，将在每回合 一点一点吸取对手的ＨＰ， 从而用来回复自己的ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  将种子种植在了{POKEMON}身上！",
		end: "  {POKEMON}摆脱了寄生种子的束缚！",
		damage: "  寄生植物夺取了{POKEMON}的体力！",
	},
	leer: {
		name: "瞪眼",
		// Official flavor text: "用犀利的眼神使其害怕， 从而降低对手的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	letssnuggleforever: {
		name: "亲密无间大乱揍",
		shortDesc: null, // NEEDS TRANSLATION
	},
	lick: {
		name: "舌舔",
		// Official flavor text: "用长长的舌头， 舔遍对手进行攻击。 有时会让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lifedew: {
		name: "生命水滴",
		// Official flavor text: "喷洒出神奇的水， 回复自己和场上同伴的ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lightofruin: {
		name: "破灭之光",
		// Official flavor text: "借用永恒之花的力量， 发射出强力光线。 自己也会受到不小的伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lightscreen: {
		name: "光墙",
		// Official flavor text: "利用神奇的墙壁， 在５回合内减弱从对手那里 受到的特殊攻击的伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
			start: null, // NEEDS TRANSLATION
		},

		start: "  光墙使{TEAM}的特殊抗性提高了！",
		end: "  {TEAM}的光墙消失了！",
	},
	lightthatburnsthesky: {
		name: "焚天灭世炽光爆",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	liquidation: {
		name: "水流裂破",
		// Official flavor text: "用水之力量撞向对手进行攻击。 有时会降低对手的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lockon: {
		name: "锁定",
		// Official flavor text: "紧紧瞄准对手， 下次攻击必定会打中。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {SOURCE}将目标对准了{POKEMON}！",
	},
	lovelykiss: {
		name: "恶魔之吻",
		shortDesc: null, // NEEDS TRANSLATION
	},
	lowkick: {
		name: "踢倒",
		// Official flavor text: "用力踢对手的脚， 使其摔倒进行攻击。 对手越重，威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	lowsweep: {
		name: "下盘踢",
		// Official flavor text: "以敏捷的动作瞄准 对手的脚进行攻击。 降低对手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	luckychant: {
		name: "幸运咒语",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  因幸运咒语的力量，{TEAM}的要害被隐藏了起来！",
		end: "  {TEAM}的幸运咒语解除了！",
	},
	luminacrash: {
		name: "琉光冲激",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lunarblessing: {
		name: "新月祈祷",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lunardance: {
		name: "新月舞",
		// Official flavor text: "虽然自己陷入濒死， 但可以治愈后备上场的 宝可梦的全部状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		heal: "  {POKEMON}被神秘的月光包围了！",
	},
	lunge: {
		name: "猛扑",
		// Official flavor text: "全力猛扑对手进行攻击。 从而降低对手的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lusterpurge: {
		name: "洁净光芒",
		// Official flavor text: "释放耀眼的光芒进行攻击。 有时会降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	machpunch: {
		name: "音速拳",
		// Official flavor text: "以迅雷不及掩耳之势出拳。 必定能够先制攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	magicalleaf: {
		name: "魔法叶",
		shortDesc: null, // NEEDS TRANSLATION
	},
	magicaltorque: {
		name: "魔法暴冲",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	magiccoat: {
		name: "魔法反射",
		// Official flavor text: "当对手使出会变成异常状态的 招式或寄生种子等时， 会将对手的招式反射回去。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}获得了魔法反射的效果！",
		move: "{POKEMON}将{MOVE}反射了回去！",
	},
	magicpowder: {
		name: "魔法粉",
		// Official flavor text: "向对手喷洒魔法粉， 使对手变为超能力属性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	magicroom: {
		name: "魔法空间",
		// Official flavor text: "制造出离奇的空间。 在５回合内所有宝可梦 携带道具的效果都会消失。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	magmastorm: {
		name: "熔岩风暴",
		// Official flavor text: "将对手困在 熊熊燃烧的火焰中， 在４～５回合内进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}被困在了熔岩旋涡之中！",
	},
	magnetbomb: {
		name: "磁铁炸弹",
		shortDesc: null, // NEEDS TRANSLATION
	},
	magneticflux: {
		name: "磁场操控",
		// Official flavor text: "通过操控磁场， 会提高特性为正电和负电的 宝可梦的防御和特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	magnetrise: {
		name: "电磁飘浮",
		// Official flavor text: "利用电气产生的磁力浮在空中。 在５回合内可以飘浮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}因电磁力浮了起来！",
		end: "  {POKEMON}的电磁力消失了！",
	},
	magnitude: {
		name: "震级",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  震级{NUMBER}！",
	},
	makeitrain: {
		name: "淘金潮",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},

		activate: "#payday",
	},
	maliciousmoonsault: {
		name: "极恶飞跃粉碎击",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	malignantchain: {
		name: "邪毒锁链",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	matblock: {
		name: "掀榻榻米",
		// Official flavor text: "将掀起来的榻榻米当作盾牌， 防住自己和同伴免受招式伤害。 变化招式无法防住。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}正在伺机使出掀榻榻米！",
		block: "  {MOVE}被掀榻榻米保护住了！",
	},
	matchagotcha: {
		name: "刷刷茶炮",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxairstream: {
		name: "极巨飞冲",
		// Official flavor text: "极巨化宝可梦使出的飞行属性攻击。 会提高我方的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxdarkness: {
		name: "极巨恶霸",
		// Official flavor text: "极巨化宝可梦使出的恶属性攻击。 会降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxflare: {
		name: "极巨火爆",
		// Official flavor text: "极巨化宝可梦使出的火属性攻击。 可在５回合内让日照变得强烈。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxflutterby: {
		name: "极巨虫蛊",
		// Official flavor text: "极巨化宝可梦使出的虫属性攻击。 会降低对手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxgeyser: {
		name: "极巨水流",
		// Official flavor text: "极巨化宝可梦使出的水属性攻击。 可在５回合内降下大雨。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxguard: {
		name: "极巨防壁",
		// Official flavor text: "完全抵挡 对手的攻击。 连续使出则容易失败。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}在攻击中守护住了自己！",
	},
	maxhailstorm: {
		name: "极巨寒冰",
		// Official flavor text: "极巨化宝可梦 才能使出的冰属性攻击。 在５回合内会降下冰雹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxknuckle: {
		name: "极巨拳斗",
		// Official flavor text: "极巨化宝可梦使出的格斗属性攻击。 会提高我方的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxlightning: {
		name: "极巨闪电",
		// Official flavor text: "极巨化宝可梦使出的电属性攻击。 可在５回合内将脚下变成电气场地。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxmindstorm: {
		name: "极巨超能",
		// Official flavor text: "极巨化宝可梦使出的超能力属性攻击。 可在５回合内将脚下变成精神场地。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxooze: {
		name: "极巨酸毒",
		// Official flavor text: "极巨化宝可梦使出的毒属性攻击。 会提高我方的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxovergrowth: {
		name: "极巨草原",
		// Official flavor text: "极巨化宝可梦使出的草属性攻击。 可在５回合内将脚下变成青草场地。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxphantasm: {
		name: "极巨幽魂",
		// Official flavor text: "极巨化宝可梦使出的幽灵属性攻击。 会降低对手的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxquake: {
		name: "极巨大地",
		// Official flavor text: "极巨化宝可梦使出的地面属性攻击。 会提高我方的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxrockfall: {
		name: "极巨岩石",
		// Official flavor text: "极巨化宝可梦使出的岩石属性攻击。 可在５回合内卷起沙暴。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxstarfall: {
		name: "极巨妖精",
		// Official flavor text: "极巨化宝可梦使出的妖精属性攻击。 可在５回合内将脚下变成薄雾场地。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxsteelspike: {
		name: "极巨钢铁",
		// Official flavor text: "极巨化宝可梦使出的钢属性攻击。 会提高我方的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxstrike: {
		name: "极巨攻击",
		// Official flavor text: "极巨化宝可梦使出的一般属性攻击。 会降低对手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxwyrmwind: {
		name: "极巨龙骑",
		// Official flavor text: "极巨化宝可梦使出的龙属性攻击。 会降低对手的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	meanlook: {
		name: "黑色目光",
		// Official flavor text: "用好似要勾人心魂的黑色目光 一动不动地凝视对手， 使其不能从战斗中逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
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
	meditate: {
		name: "瑜伽姿势",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mefirst: {
		name: "抢先一步",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
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
	},
	megadrain: {
		name: "超级吸取",
		// Official flavor text: "吸取对手的养分进行攻击。 可以回复给予对手 伤害的一半ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	megahorn: {
		name: "超级角击",
		shortDesc: null, // NEEDS TRANSLATION
	},
	megakick: {
		name: "百万吨重踢",
		shortDesc: null, // NEEDS TRANSLATION
	},
	megapunch: {
		name: "百万吨重拳",
		shortDesc: null, // NEEDS TRANSLATION
	},
	memento: {
		name: "临别礼物",
		// Official flavor text: "虽然会使自己陷入濒死， 但是能够大幅降低 对手的攻击和特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},

		heal: "  因为Ｚ力量，{POKEMON}的体力回复了！",
	},
	menacingmoonrazemaelstrom: {
		name: "月华飞溅落灵霄",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	metalburst: {
		name: "金属爆炸",
		// Official flavor text: "使出招式前， 将最后受到的招式的伤害 大力返还给对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	metalclaw: {
		name: "金属爪",
		// Official flavor text: "用钢铁之爪 劈开对手进行攻击。 有时会提高自己的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	metalsound: {
		name: "金属音",
		// Official flavor text: "让对手听摩擦金属般 讨厌的声音。 大幅降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	meteorassault: {
		name: "流星突击",
		// Official flavor text: "大力挥舞粗壮的茎进行攻击。 但同时自己也会被晃晕， 下一回合自己将无法动弹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	meteorbeam: {
		name: "流星光束",
		// Official flavor text: "第１回合聚集宇宙之力提高特攻， 第２回合攻击对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		prepare: "{POKEMON}身上溢出了宇宙之力！",
	},
	meteormash: {
		name: "彗星拳",
		// Official flavor text: "使出彗星般的拳头攻击对手。 有时会提高自己的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	metronome: {
		name: "挥指",
		// Official flavor text: "挥动手指刺激自己的大脑， 从所有的招式中 任意使出１个。"
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
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},

		move: "挥动手指后，使出了{MOVE}！",
	},
	mightycleave: {
		name: "强刃攻击",
		shortDesc: null, // NEEDS TRANSLATION
	},
	milkdrink: {
		name: "喝牛奶",
		// Official flavor text: "回复自己最大ＨＰ的一半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	mimic: {
		name: "模仿",
		// Official flavor text: "可以将对手 最后使用的招式， 在战斗内变成自己的招式。"
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
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}学会了{MOVE}！",
	},
	mindblown: {
		name: "惊爆大头",
		// Official flavor text: "让自己的头爆炸， 来攻击周围的一切。 自己也会受到伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		damage: null, // NEEDS TRANSLATION
	},
	mindreader: {
		name: "心之眼",
		// Official flavor text: "用心感受对手的行动， 下次攻击必定 会击中对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "#lockon",
	},
	minimize: {
		name: "变小",
		// Official flavor text: "蜷缩身体显得很小， 从而大幅提高 自己的闪避率。"
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
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	miracleeye: {
		name: "奇迹之眼",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "#foresight",
	},
	mirrorcoat: {
		name: "镜面反射",
		// Official flavor text: "从对手那里受到 特殊攻击的伤害将以 ２倍返还给同一个对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	mirrormove: {
		name: "鹦鹉学舌",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	mirrorshot: {
		name: "镜光射击",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mist: {
		name: "白雾",
		// Official flavor text: "用白雾覆盖身体。 在５回合内不会让对手 降低自己的能力。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
			start: null, // NEEDS TRANSLATION
			block: "  {POKEMON}正受到白雾的保护！",
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			start: null, // NEEDS TRANSLATION
			block: "  但是，招式失败了！！",
		},

		start: "  {TEAM}被白雾包围了！",
		end: "  包围{TEAM}的白雾消失了！",
		block: "  {POKEMON}正受到白雾的保护！",
	},
	mistball: {
		name: "薄雾球",
		// Official flavor text: "用围绕着雾状 羽毛的球进行攻击。 有时会降低对手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mistyexplosion: {
		name: "薄雾炸裂",
		// Official flavor text: "对自己周围的所有宝可梦进行攻击， 但使出后，自己会陷入濒死。 在薄雾场地上，招式威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mistyterrain: {
		name: "薄雾场地",
		// Official flavor text: "在５回合内， 地面上的宝可梦不会陷入异常状态。 龙属性招式的伤害也会减半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	moonblast: {
		name: "月亮之力",
		// Official flavor text: "借用月亮的力量攻击对手。 有时会降低对手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	moongeistbeam: {
		name: "暗影之光",
		// Official flavor text: "放出奇怪的光线攻击对手。 可以无视对手的特性进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	moonlight: {
		name: "月光",
		// Official flavor text: "回复自己的ＨＰ。 根据天气的不同， 回复量也会有所变化。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	morningsun: {
		name: "晨光",
		// Official flavor text: "回复自己的ＨＰ。 根据天气的不同， 回复量也会有所变化。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	mortalspin: {
		name: "晶光转转",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mountaingale: {
		name: "冰山风",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mudbomb: {
		name: "泥巴炸弹",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	muddywater: {
		name: "浊流",
		// Official flavor text: "向对手喷射 浑浊的水进行攻击。 有时会降低对手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mudshot: {
		name: "泥巴射击",
		// Official flavor text: "向对手投掷 泥块进行攻击。 同时降低对手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mudslap: {
		name: "掷泥",
		// Official flavor text: "向对手的脸等 投掷泥块进行攻击。 会降低对手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mudsport: {
		name: "玩泥巴",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	multiattack: {
		name: "多属性攻击",
		// Official flavor text: "一边覆盖高能量， 一边撞向对手进行攻击。 根据存储碟不同，属性会改变。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mysticalfire: {
		name: "魔法火焰",
		// Official flavor text: "从口中喷出特别灼热的 火焰进行攻击。 降低对手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mysticalpower: {
		name: "神秘之力",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	nastyplot: {
		name: "诡计",
		// Official flavor text: "谋划诡计，激活头脑。 大幅提高自己的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	naturalgift: {
		name: "自然之恩",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	naturepower: {
		name: "自然之力",
		// Official flavor text: "用自然之力进行攻击。 根据所使用场所的不同， 使出的招式也会有所变化。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
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

		move: "自然之力变成了{MOVE}！",
	},
	naturesmadness: {
		name: "自然之怒",
		// Official flavor text: "向对手释放自然之怒。 对手的ＨＰ会减半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	needlearm: {
		name: "尖刺臂",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	neverendingnightmare: {
		name: "无尽暗夜之诱惑",
		shortDesc: null, // NEEDS TRANSLATION
	},
	nightdaze: {
		name: "暗黑爆破",
		// Official flavor text: "放出黑暗的冲击波攻击对手。 有时会降低对手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	nightmare: {
		name: "恶梦",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}开始做恶梦了！",
		damage: "  {POKEMON}正被恶梦缠身！",
	},
	nightshade: {
		name: "黑夜魔影",
		// Official flavor text: "显示恐怖幻影， 只给予对手 和自己等级相同的伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	nightslash: {
		name: "暗袭要害",
		// Official flavor text: "抓住瞬间的空隙 切斩对手。 容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	nobleroar: {
		name: "战吼",
		// Official flavor text: "发出战吼威吓对手， 从而降低对手的攻击和特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	noretreat: {
		name: "背水一战",
		// Official flavor text: "提高自己的所有能力， 但无法替换或逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}受到背水一战的效果影响，无法逃走了！",
	},
	noxioustorque: {
		name: "剧毒暴冲",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	nuzzle: {
		name: "蹭蹭脸颊",
		// Official flavor text: "将带电的脸颊 蹭蹭对手进行攻击。 让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	oblivionwing: {
		name: "死亡之翼",
		// Official flavor text: "从锁定的对手身上吸取ＨＰ。 回复给予对手 伤害的一半以上的ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	obstruct: {
		name: "拦堵",
		// Official flavor text: "完全抵挡对手的攻击。 连续使出则容易失败。 一旦触碰，防御就会大幅降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	oceanicoperetta: {
		name: "海神庄严交响乐",
		shortDesc: null, // NEEDS TRANSLATION
	},
	octazooka: {
		name: "章鱼桶炮",
		// Official flavor text: "向对手的脸等 喷出墨汁进行攻击。 有时会降低对手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	octolock: {
		name: "蛸固",
		// Official flavor text: "让对手无法逃走。 对手被固定后， 每回合都会降低防御和特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}受到蛸固的效果影响，变得无法逃走了……",
	},
	odorsleuth: {
		name: "气味侦测",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	ominouswind: {
		name: "奇异之风",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	orderup: {
		name: "上菜",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	originpulse: {
		name: "根源波动",
		// Official flavor text: "用无数青白色 且闪耀的光线攻击对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	outrage: {
		name: "逆鳞",
		// Official flavor text: "在２～３回合内， 乱打一气地进行攻击。 大闹一番后自己会陷入混乱。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	overdrive: {
		name: "破音",
		// Official flavor text: "奏响吉他和贝斯，释放出 发出巨响的剧烈震动 攻击对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	overheat: {
		name: "过热",
		// Official flavor text: "使出全部力量攻击对手。 使用之后会因为反作用力， 自己的特攻大幅降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	painsplit: {
		name: "分担痛楚",
		// Official flavor text: "将自己的ＨＰ和 对手的ＨＰ相加， 然后自己和对手友好地平分。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  均分了彼此的体力！",
	},
	paleowave: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	paraboliccharge: {
		name: "抛物面充电",
		// Official flavor text: "给周围全体宝可梦造成伤害。 可以回复给予伤害的一半HP。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	partingshot: {
		name: "抛下狠话",
		// Official flavor text: "抛下狠话威吓对手， 降低攻击和特攻后， 和后备宝可梦进行替换。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		heal: "#memento",
		switchOut: "#uturn",
	},
	payback: {
		name: "以牙还牙",
		// Official flavor text: "蓄力攻击。 如果能在对手之后攻击， 招式的威力会变成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	payday: {
		name: "聚宝功",
		// Official flavor text: "向对手的身体 投掷小金币进行攻击。 战斗后可以拿到钱。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  金币散落一地！",
	},
	peck: {
		name: "啄",
		shortDesc: null, // NEEDS TRANSLATION
	},
	perishsong: {
		name: "灭亡之歌",
		// Official flavor text: "倾听歌声的宝可梦 经过３回合陷入濒死。 替换后效果消失。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  听过终焉之歌的宝可梦会在3回合后步向终焉！",
		activate: "  {POKEMON}的灭亡计时变成{NUMBER}了！",
	},
	petalblizzard: {
		name: "落英缤纷",
		// Official flavor text: "猛烈地刮起飞雪般的落花， 攻击周围所有的宝可梦， 并给予伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	petaldance: {
		name: "花瓣舞",
		// Official flavor text: "在２～３回合内， 散落花瓣攻击对手。 之后自己会陷入混乱。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	phantomforce: {
		name: "潜灵奇袭",
		// Official flavor text: "第１回合消失在某处， 第２回合攻击对手。 可以无视守护进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		prepare: "#shadowforce",
		activate: "#shadowforce",
	},
	photongeyser: {
		name: "光子喷涌",
		// Official flavor text: "用光柱来进行攻击。 比较自己的攻击和特攻， 用数值相对较高的一项给予对方伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pikapapow: {
		name: "闪闪雷光",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pinmissile: {
		name: "飞弹针",
		// Official flavor text: "向对手发射 锐针进行攻击。 连续攻击２～５次。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	plasmafists: {
		name: "等离子闪电拳",
		// Official flavor text: "用覆盖着电流的拳头进行攻击。 使一般属性的招式变成电属性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	playnice: {
		name: "和睦相处",
		// Official flavor text: "和对手和睦相处， 使其失去战斗的气力， 从而降低对手的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	playrough: {
		name: "嬉闹",
		// Official flavor text: "与对手嬉闹并攻击。 有时会降低对手的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pluck: {
		name: "啄食",
		// Official flavor text: "用喙进行攻击。 当对手携带树果时， 可以食用并获得其效果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		removeItem: "#bugbite",
	},
	poisonfang: {
		name: "剧毒牙",
		// Official flavor text: "用有毒的牙齿 咬住对手进行攻击。 有时会使对手中剧毒。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	poisongas: {
		name: "毒瓦斯",
		// Official flavor text: "将毒瓦斯吹到对手的脸上， 从而让对手陷入中毒状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	poisonjab: {
		name: "毒击",
		// Official flavor text: "用带毒的触手或手臂刺入对手。 有时会让对手陷入中毒状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	poisonpowder: {
		name: "毒粉",
		// Official flavor text: "撒出毒粉， 从而让对手陷入中毒状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	poisonsting: {
		name: "毒针",
		// Official flavor text: "将有毒的针 刺入对手进行攻击。 有时会让对手陷入中毒状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	poisontail: {
		name: "毒尾",
		// Official flavor text: "用尾巴拍打。 有时会让对手陷入中毒状态， 也容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	polarflare: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pollenpuff: {
		name: "花粉团",
		// Official flavor text: "对敌人使用是会爆炸的团子。 对我方使用则是给予回复的团子。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	poltergeist: {
		name: "灵骚",
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}被{ITEM}袭击了！",
	},
	populationbomb: {
		name: "鼠数儿",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pounce: {
		name: "虫扑",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pound: {
		name: "拍击",
		shortDesc: null, // NEEDS TRANSLATION
	},
	powder: {
		name: "粉尘",
		// Official flavor text: "如果被撒到粉尘的对手 使用火招式， 则会爆炸并给予伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  向{POKEMON}抛洒了粉尘！",
		activate: "  和{MOVE}起了反应，粉尘爆炸了！",
	},
	powdersnow: {
		name: "细雪",
		// Official flavor text: "将冰冷的细雪 吹向对手进行攻击。 有时会让对手陷入冰冻状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	powergem: {
		name: "力量宝石",
		shortDesc: null, // NEEDS TRANSLATION
	},
	powersplit: {
		name: "力量平分",
		// Official flavor text: "利用超能力将自己和对手的 攻击和特攻相加， 再进行平分。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}平分了各自的力量！",
	},
	powerswap: {
		name: "力量互换",
		// Official flavor text: "利用超能力互换 自己和对手的攻击 以及特攻的能力变化。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	powershift: {
		name: "力量转换",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}互换了进攻力和防守力！",
		end: "#.start",
	},
	powertrick: {
		name: "力量戏法",
		// Official flavor text: "利用超能力交换 自己的攻击和 防御的力量。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}互换了攻击和防御！",
		end: "#.start",
	},
	powertrip: {
		name: "嚣张",
		// Official flavor text: "耀武扬威地攻击对手， 自己的能力提高得越多， 威力就越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	poweruppunch: {
		name: "增强拳",
		// Official flavor text: "通过反复击打对手， 使自己的拳头慢慢变硬。 打中对手攻击就会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	powerwhip: {
		name: "强力鞭打",
		shortDesc: null, // NEEDS TRANSLATION
	},
	precipiceblades: {
		name: "断崖之剑",
		// Official flavor text: "将大地的力量变化为利刃 攻击对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	present: {
		name: "礼物",
		// Official flavor text: "递给对手设有圈套的 盒子进行攻击。 也有可能回复对手ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	prismaticlaser: {
		name: "棱镜镭射",
		// Official flavor text: "用棱镜的力量发射强烈光线。 下一回合自己将无法动弹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	protect: {
		name: "守住",
		// Official flavor text: "完全抵挡 对手的攻击。 连续使出则容易失败。"
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
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}摆出了防守的架势！",
		block: "  {POKEMON}在攻击中守护住了自己！",
	},
	psybeam: {
		name: "幻象光线",
		// Official flavor text: "向对手发射 神奇的光线进行攻击。 有时会使对手混乱。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psyblade: {
		name: "精神剑",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psychic: {
		name: "精神强念",
		// Official flavor text: "向对手发送 强大的念力进行攻击。 有时会降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	psychicfangs: {
		name: "精神之牙",
		// Official flavor text: "利用精神力量咬住对手进行攻击。 还可以破坏光墙和反射壁等。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psychicnoise: {
		name: "精神噪音",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psychicterrain: {
		name: "精神场地",
		// Official flavor text: "在５回合内，地面上的宝可梦 不会受到先制招式的攻击。 超能力属性的招式威力会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	psychoboost: {
		name: "精神突进",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psychocut: {
		name: "精神利刃",
		// Official flavor text: "用实体化的 心之利刃劈开对手。 容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psychoshift: {
		name: "精神转移",
		// Official flavor text: "利用超能力施以暗示， 从而将自己受到的异常状态 转移给对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psychup: {
		name: "自我暗示",
		// Official flavor text: "向自己施以自我暗示， 将能力变化的状态 变得和对手一样。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	psyshieldbash: {
		name: "屏障猛攻",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psyshock: {
		name: "精神冲击",
		// Official flavor text: "将神奇的念波实体化攻击对手。 给予物理伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psystrike: {
		name: "精神击破",
		// Official flavor text: "将神奇的念波实体化攻击对手。 给予物理伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psywave: {
		name: "精神波",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	pulverizingpancake: {
		name: "认真起来大爆击",
		shortDesc: null, // NEEDS TRANSLATION
	},
	punishment: {
		name: "惩罚",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	purify: {
		name: "净化",
		// Official flavor text: "治愈对手的异常状态。 治愈后可以回复自己的ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pursuit: {
		name: "追打",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
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
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		activate: null, // NEEDS TRANSLATION
	},
	pyroball: {
		name: "火焰球",
		// Official flavor text: "点燃小石子，形成火球攻击对手。 有时会使对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	quash: {
		name: "延后",
		// Official flavor text: "压制对手， 从而将其行动顺序放到最后。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  延后了{TARGET}的顺序！",
	},
	quickattack: {
		name: "电光一闪",
		// Official flavor text: "以迅雷不及掩耳之势扑向对手。 必定能够先制攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	quickguard: {
		name: "快速防守",
		// Official flavor text: "守护自己和同伴， 以防对手的先制攻击。"
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

		start: "  {TEAM}受到了快速防守的保护！",
		block: "  {POKEMON}受到了快速防守的保护！",
	},
	quiverdance: {
		name: "蝶舞",
		// Official flavor text: "轻巧地跳起神秘而又美丽的舞蹈。 提高自己的特攻、特防和速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rage: {
		name: "愤怒",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	ragefist: {
		name: "愤怒之拳",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	ragepowder: {
		name: "愤怒粉",
		// Official flavor text: "将令人烦躁的粉末撒在自己身上， 用以吸引对手的注意。 使对手的攻击全部指向自己。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "#followme",
		startFromZEffect: "#followme",
	},
	ragingbull: {
		name: "怒牛",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: null, // NEEDS TRANSLATION
	},
	ragingfury: {
		name: "大愤慨",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	raindance: {
		name: "求雨",
		// Official flavor text: "在５回合内一直降雨， 从而提高水属性的招式威力。 火属性的招式威力则降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	rapidspin: {
		name: "高速旋转",
		// Official flavor text: "通过旋转来攻击对手。 可以摆脱绑紧、紧束、寄生种子 等招式。还能提高自己的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	razorleaf: {
		name: "飞叶快刀",
		// Official flavor text: "飞出叶片， 切斩对手进行攻击。 容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	razorshell: {
		name: "贝壳刃",
		// Official flavor text: "用锋利的贝壳切斩 对手进行攻击。 有时会降低对手的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	razorwind: {
		name: "旋风刀",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		prepare: "  {POKEMON}周围的空气产生了旋涡！",
	},
	recover: {
		name: "自我再生",
		// Official flavor text: "让细胞再生， 从而回复自己 最大ＨＰ的一半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	recycle: {
		name: "回收利用",
		// Official flavor text: "使战斗中已经消耗掉的 自己的持有物再生， 并可以再次使用。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		addItem: "  {POKEMON}捡来了{ITEM:classified}！",
	},
	reflect: {
		name: "反射壁",
		// Official flavor text: "利用神奇的墙壁， 在５回合内减弱从对手那里 受到的物理攻击的伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
			start: null, // NEEDS TRANSLATION
		},

		start: "  反射壁使{TEAM}的物理抗性提高了！",
		end: "  {TEAM}的反射壁消失了！",
	},
	reflecttype: {
		name: "镜面属性",
		// Official flavor text: "反射对手的属性， 让自己也变成一样的属性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		typeChange: "  {POKEMON}变成了和{SOURCE}相同的属性！",
	},
	refresh: {
		name: "焕然一新",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	relicsong: {
		name: "古老之歌",
		// Official flavor text: "让对手听古老之歌， 打动对手的内心进行攻击。 有时会让对手陷入睡眠状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rest: {
		name: "睡觉",
		// Official flavor text: "连续睡上２回合。 回复自己的全部ＨＰ 以及治愈所有异常状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	retaliate: {
		name: "报仇",
		// Official flavor text: "为倒下的同伴报仇。 如果上一回合有同伴倒下， 威力就会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	return: {
		name: "报恩",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	revelationdance: {
		name: "觉醒之舞",
		// Official flavor text: "全力跳舞进行攻击。 此招式的属性将 变得和自己的属性相同。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	revenge: {
		name: "报复",
		// Official flavor text: "如果受到对手的招式攻击， 就能给予对手２倍的伤害。"
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
	reversal: {
		name: "起死回生",
		// Official flavor text: "竭尽全力进行攻击。 自己的ＨＰ越少， 招式的威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	revivalblessing: {
		name: "复生祈祷",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		heal: "  {POKEMON}复活并能继续战斗了！",
	},
	risingvoltage: {
		name: "电力上升",
		// Official flavor text: "用从地面升腾而起的电击进行攻击。 当对手处于电气场地上时， 招式威力会变成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	roar: {
		name: "吼叫",
		// Official flavor text: "放走对手，强制拉后备宝可梦上场。 如果对手为野生宝可梦， 战斗将直接结束。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	roaroftime: {
		name: "时光咆哮",
		// Official flavor text: "释放出扭曲时间般的 强大力量攻击对手。 下一回合自己将无法动弹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rockblast: {
		name: "岩石爆击",
		// Official flavor text: "向对手发射 坚硬的岩石进行攻击。 连续攻击２～５次。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	rockclimb: {
		name: "攀岩",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rockpolish: {
		name: "岩石打磨",
		// Official flavor text: "打磨自己的身体， 减少空气阻力。 可以大幅提高自己的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rockslide: {
		name: "岩崩",
		// Official flavor text: "将大岩石 猛烈地撞向对手进行攻击。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	rocksmash: {
		name: "碎岩",
		// Official flavor text: "用拳头进行攻击。 有时会降低对手的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rockthrow: {
		name: "落石",
		shortDesc: null, // NEEDS TRANSLATION
	},
	rocktomb: {
		name: "岩石封锁",
		// Official flavor text: "投掷岩石进行攻击。 封住对手的行动， 从而降低速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rockwrecker: {
		name: "岩石炮",
		// Official flavor text: "向对手发射 巨大的岩石进行攻击。 下一回合自己将无法动弹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	roleplay: {
		name: "扮演",
		// Official flavor text: "扮演对手， 让自己的特性 变得和对手相同。"
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

		changeAbility: "  {POKEMON}复制了{SOURCE}的{ABILITY}！",
	},
	rollingkick: {
		name: "回旋踢",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rollout: {
		name: "滚动",
		// Official flavor text: "在５回合内连续滚动攻击对手。 招式每次击中，威力就会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	roost: {
		name: "羽栖",
		// Official flavor text: "降到地面，使身体休息。 回复自己最大ＨＰ的一半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: null, // NEEDS TRANSLATION
	},
	rototiller: {
		name: "耕地",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	round: {
		name: "轮唱",
		// Official flavor text: "用歌声攻击对手。 同伴还可以接着使出轮唱招式， 威力也会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	ruination: {
		name: "大灾难",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sacredfire: {
		name: "神圣之火",
		// Official flavor text: "用神秘的火焰 烧尽对手进行攻击。 有时会让对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sacredsword: {
		name: "圣剑",
		// Official flavor text: "用长角切斩对手进行攻击。 无视对手的能力变化， 直接给予伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	safeguard: {
		name: "神秘守护",
		// Official flavor text: "在５回合内 被神奇的力量守护， 从而不会陷入异常状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {TEAM}被神秘之幕包围了！",
		end: "  包围{TEAM}的神秘之幕消失了！",
		block: "  {POKEMON}正受到神秘之幕的保护！",
	},
	saltcure: {
		name: "盐腌",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},

		start: "  {POKEMON}陷入了盐腌状态！",
		damage: "  {POKEMON}受到了盐腌的伤害。",
	},
	sandattack: {
		name: "泼沙",
		// Official flavor text: "向对手脸上泼沙子， 从而降低命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sandsearstorm: {
		name: "热沙风暴",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sandstorm: {
		name: "沙暴",
		// Official flavor text: "在５回合内扬起沙暴，除岩石、地面和 钢属性以外的宝可梦，都会受到伤害。 岩石属性的特防还会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	sandtomb: {
		name: "流沙地狱",
		// Official flavor text: "将对手困在 铺天盖地的沙暴中， 在４～５回合内进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
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
		},

		start: "  {POKEMON}陷入了流沙深渊！",
	},
	sappyseed: {
		name: "茁茁轰炸",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	savagespinout: {
		name: "绝对捕食回旋斩",
		shortDesc: null, // NEEDS TRANSLATION
	},
	scald: {
		name: "热水",
		// Official flavor text: "向对手喷射 煮得翻滚的开水进行攻击。 有时会让对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	scaleshot: {
		name: "鳞射",
		// Official flavor text: "发射鳞片进行攻击。 连续攻击２～５次。 速度会提高但防御会降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	scaryface: {
		name: "鬼面",
		// Official flavor text: "用恐怖的表情瞪着对手， 使其害怕， 从而大幅降低对手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	scorchingsands: {
		name: "热沙大地",
		// Official flavor text: "将滚烫的沙子砸向对手进行攻击。 有时会让对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	scratch: {
		name: "抓",
		shortDesc: null, // NEEDS TRANSLATION
	},
	screech: {
		name: "刺耳声",
		// Official flavor text: "发出不由自主想要 捂起耳朵的刺耳声， 从而大幅降低对手的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	searingshot: {
		name: "火焰弹",
		// Official flavor text: "用熊熊烈火 攻击自己周围所有的宝可梦。 有时会陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	searingsunrazesmash: {
		name: "日光回旋下苍穹",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	secretpower: {
		name: "秘密之力",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	secretsword: {
		name: "神秘之剑",
		// Official flavor text: "用长角切斩对手进行攻击。 角上拥有的神奇力量 将给予物理伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	seedbomb: {
		name: "种子炸弹",
		shortDesc: null, // NEEDS TRANSLATION
	},
	seedflare: {
		name: "种子闪光",
		// Official flavor text: "从身体里产生冲击波。 有时会大幅降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	seismictoss: {
		name: "地球上投",
		// Official flavor text: "利用引力将对手甩飞出去。 给予对手和自己等级相同的伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	selfdestruct: {
		name: "自爆",
		// Official flavor text: "引发爆炸， 攻击自己周围所有的宝可梦。 使用后陷入濒死。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	shadowball: {
		name: "暗影球",
		// Official flavor text: "投掷一团黑影进行攻击。 有时会降低对手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shadowbone: {
		name: "暗影之骨",
		// Official flavor text: "用附有灵魂的骨头 殴打对手进行攻击。 有时会降低对手的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shadowclaw: {
		name: "暗影爪",
		// Official flavor text: "以影子做成的锐爪， 劈开对手。 容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shadowforce: {
		name: "暗影潜袭",
		// Official flavor text: "第１回合消失踪影， 第２回合攻击对手。 即使对手正受保护，也能击中。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  打破了{TARGET}的防守！",
		prepare: "{POKEMON}的身影瞬间消失了！",
	},
	shadowpunch: {
		name: "暗影拳",
		shortDesc: null, // NEEDS TRANSLATION
	},
	shadowsneak: {
		name: "影子偷袭",
		// Official flavor text: "伸长影子， 从对手的背后进行攻击。 必定能够先制攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shadowstrike: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sharpen: {
		name: "棱角化",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shatteredpsyche: {
		name: "至高精神破坏波",
		shortDesc: null, // NEEDS TRANSLATION
	},
	shedtail: {
		name: "断尾",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}断掉尾巴并将其作为替身了！",
		alreadyStarted: "#substitute",
		fail: "#substitute",
	},
	sheercold: {
		name: "绝对零度",
		// Official flavor text: "给对手一击濒死。 如果是冰属性以外的宝可梦使用， 就会难以打中。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	shellsidearm: {
		name: "臂贝武器",
		// Official flavor text: "从物理攻击和特殊攻击中选择 可造成较多伤害的方式进行攻击。 有时会让对手陷入中毒状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shellsmash: {
		name: "破壳",
		// Official flavor text: "打破外壳， 降低自己的防御和特防， 但大幅提高攻击、特攻和速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shelltrap: {
		name: "陷阱甲壳",
		// Official flavor text: "设下甲壳陷阱。 如果对手使出物理招式， 陷阱就会爆炸并给予对手伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}设置了陷阱甲壳！",
		prepare: "  {POKEMON}设置了陷阱甲壳！",
		cant: "{POKEMON}的陷阱甲壳没有被触发！",
	},
	shelter: {
		name: "闭关",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shiftgear: {
		name: "换档",
		// Official flavor text: "转动齿轮， 不仅提高自己的攻击， 还会大幅提高速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shockwave: {
		name: "电击波",
		shortDesc: null, // NEEDS TRANSLATION
	},
	shoreup: {
		name: "集沙",
		// Official flavor text: "回复自己最大ＨＰ的一半。 在沙暴中回复得更多。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	signalbeam: {
		name: "信号光束",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	silktrap: {
		name: "线阱",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	silverwind: {
		name: "银色旋风",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	simplebeam: {
		name: "单纯光束",
		// Official flavor text: "向对手发送谜之念波。 接收到念波的对手， 其特性会变为单纯。"
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
	},
	sing: {
		name: "唱歌",
		shortDesc: null, // NEEDS TRANSLATION
	},
	sinisterarrowraid: {
		name: "遮天蔽日暗影箭",
		shortDesc: null, // NEEDS TRANSLATION
	},
	sizzlyslide: {
		name: "熊熊火爆",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sketch: {
		name: "写生",
		// Official flavor text: "将对手使用的招式 变成自己的招式。 使用１次后写生消失。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		activate: "  {POKEMON}对{MOVE}进行了写生！",
	},
	skillswap: {
		name: "特性互换",
		// Official flavor text: "利用超能力互换 自己和对手的特性。"
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

		activate: "  {POKEMON}互换了各自的特性！",
	},
	skittersmack: {
		name: "爬击",
		// Official flavor text: "从对手背后爬近后进行攻击。 会降低对手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	skullbash: {
		name: "火箭头锤",
		// Official flavor text: "第１回合把头缩进去， 从而提高防御。 第２回合攻击对手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		prepare: "{POKEMON}把头缩了进去！",
	},
	skyattack: {
		name: "神鸟猛击",
		// Official flavor text: "第２回合攻击对手。 偶尔使对手畏缩。 也容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		prepare: "强光包围了{POKEMON}！",
	},
	skydrop: {
		name: "自由落体",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		prepare: "{POKEMON}将{TARGET}带上了高空！",
		end: "  {POKEMON}摆脱了自由落体！",
		failSelect: "{POKEMON}因自由落体而无法自由行动！",
		failTooHeavy: "  {POKEMON}太重了，抬不起来！",
	},
	skyuppercut: {
		name: "冲天拳",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	slackoff: {
		name: "偷懒",
		// Official flavor text: "偷懒休息。 回复自己最大ＨＰ的一半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	slam: {
		name: "摔打",
		shortDesc: null, // NEEDS TRANSLATION
	},
	slash: {
		name: "劈开",
		// Official flavor text: "用爪子或镰刀等 劈开对手进行攻击。 容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sleeppowder: {
		name: "催眠粉",
		shortDesc: null, // NEEDS TRANSLATION
	},
	sleeptalk: {
		name: "梦话",
		// Official flavor text: "从自己已学会的招式中 任意使出１个。 只能在自己睡觉时使用。"
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
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	sludge: {
		name: "污泥攻击",
		// Official flavor text: "用污泥投掷对手进行攻击。 有时会让对手陷入中毒状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	sludgebomb: {
		name: "污泥炸弹",
		// Official flavor text: "用污泥投掷对手进行攻击。 有时会让对手陷入中毒状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sludgewave: {
		name: "污泥波",
		// Official flavor text: "用污泥波攻击 自己周围所有的宝可梦。 有时会陷入中毒状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	smackdown: {
		name: "击落",
		// Official flavor text: "扔石头或炮弹， 攻击飞行的对手。 对手会被击落，掉到地面。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}被击落，掉到了地面！",
	},
	smartstrike: {
		name: "修长之角",
		shortDesc: null, // NEEDS TRANSLATION
	},
	smellingsalts: {
		name: "清醒",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
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
	smog: {
		name: "浊雾",
		// Official flavor text: "将肮脏的浓雾 吹向对手进行攻击。 有时会让对手陷入中毒状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	smokescreen: {
		name: "烟幕",
		// Official flavor text: "向对手喷出烟或墨汁等， 从而降低对手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	snaptrap: {
		name: "捕兽夹",
		// Official flavor text: "使用捕兽夹， 在４～５回合内， 夹住对手进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}被捕兽夹困住了！",
	},
	snarl: {
		name: "大声咆哮",
		// Official flavor text: "没完没了地大声斥责， 从而降低对手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	snatch: {
		name: "抢夺",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}正在观察对手的动向！",
		activate: "  {POKEMON}抢夺了{TARGET}的招式！",
	},
	snipeshot: {
		name: "狙击",
		// Official flavor text: "能无视具有吸引对手招式效果的 特性或招式的影响。 可以向选定的对手进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	snore: {
		name: "打鼾",
		// Official flavor text: "在自己睡觉时， 发出噪音进行攻击。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	snowscape: {
		name: "雪景",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	soak: {
		name: "浸水",
		// Official flavor text: "将大量的水泼向对手， 从而使其变成水属性。"
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
	softboiled: {
		name: "生蛋",
		// Official flavor text: "回复自己最大ＨＰ的一半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	solarbeam: {
		name: "日光束",
		// Official flavor text: "第１回合收集满满的日光， 第２回合发射光束进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
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
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		prepare: "  {POKEMON}吸收了光！",
	},
	solarblade: {
		name: "日光刃",
		// Official flavor text: "第１回合收集满满的日光， 第２回合将此力量 集中在剑上进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},

		prepare: "#solarbeam",
	},
	sonicboom: {
		name: "音爆",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	soulstealing7starstrike: {
		name: "七星夺魂腿",
		shortDesc: null, // NEEDS TRANSLATION
	},
	spacialrend: {
		name: "亚空裂斩",
		// Official flavor text: "将对手连同周围的空间一起 撕裂并给予伤害。 容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	spark: {
		name: "电光",
		// Official flavor text: "让电流覆盖全身， 猛撞向对手进行攻击。 有时会让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sparklingaria: {
		name: "泡影的咏叹调",
		// Official flavor text: "随着唱歌会放出很多气球。 受到此招式攻击时， 灼伤会被治愈。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sparklyswirl: {
		name: "亮亮风暴",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	spectralthief: {
		name: "暗影偷盗",
		// Official flavor text: "潜入对手的影子进行攻击。 会夺取对手的能力提升。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		clearBoost: "  {SOURCE}夺取了提高的那部分能力！",
	},
	speedswap: {
		name: "速度互换",
		// Official flavor text: "将对手和自己的速度 进行互换。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}互换了各自的速度！",
	},
	spicyextract: {
		name: "辣椒精华",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	spiderweb: {
		name: "蛛网",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
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
	spikecannon: {
		name: "尖刺加农炮",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	spikes: {
		name: "撒菱",
		// Official flavor text: "在对手的脚下扔撒菱。 对替换出场的对手的宝可梦 给予伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {TEAM}脚下散落着撒菱！",
		end: "  {TEAM}脚下的撒菱消失不见了！",
		damage: "  {POKEMON}受到了撒菱的伤害！",
	},
	spikyshield: {
		name: "尖刺防守",
		// Official flavor text: "防住对手攻击的同时， 削减接触到自己的对手的体力。"
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

		damage: "  {POKEMON}受伤了！",
	},
	spinout: {
		name: "疾速转轮",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	spiritbreak: {
		name: "灵魂冲击",
		// Official flavor text: "用足以让对手一蹶不振的 气势进行攻击。 会降低对手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	spiritshackle: {
		name: "缝影",
		// Official flavor text: "攻击的同时， 缝住对手的影子， 使其无法逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	spite: {
		name: "怨恨",
		// Official flavor text: "对对手最后使用的招式 怀有怨恨， 减少４ＰＰ该招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  削减了{TARGET}的{MOVE}{NUMBER}点！",
	},
	spitup: {
		name: "喷出",
		// Official flavor text: "将积蓄的力量 撞向对手进行攻击。 积蓄得越多，威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	splash: {
		name: "跃起",
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  但是什么都没有发生！",
	},
	splinteredstormshards: {
		name: "狼啸石牙飓风暴",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	splishysplash: {
		name: "滔滔冲浪",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	spore: {
		name: "蘑菇孢子",
		shortDesc: null, // NEEDS TRANSLATION
	},
	spotlight: {
		name: "聚光灯",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "#followme",
		startFromZEffect: "#followme",
	},
	springtidestorm: {
		name: "阳春风暴",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stealthrock: {
		name: "隐形岩",
		// Official flavor text: "将无数岩石悬浮在对手的周围， 从而对替换出场的对手的 宝可梦给予伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {TEAM}周围开始浮现出尖锐的岩石！",
		end: "  {TEAM}周围的隐形岩消失不见了！",
		damage: "  尖锐的岩石扎进了{POKEMON}的体内！",
	},
	steameruption: {
		name: "蒸汽爆炸",
		// Official flavor text: "将滚烫的蒸汽喷向对手。 有时会让对手灼伤。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	steamroller: {
		name: "疯狂滚压",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	steelbeam: {
		name: "铁蹄光线",
		// Official flavor text: "将从全身聚集的钢铁 化为光束，激烈地发射出去。 自己也会受到伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		damage: "#mindblown",
	},
	steelroller: {
		name: "铁滚轮",
		// Official flavor text: "在破坏场地的同时攻击对手。 如果脚下没有任何场地状态存在， 使出此招式时便会失败。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	steelwing: {
		name: "钢翼",
		// Official flavor text: "用坚硬的翅膀敲打 对手进行攻击。 有时会提高自己的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stickyweb: {
		name: "黏黏网",
		// Official flavor text: "在对手周围围上黏黏的网， 降低替换出场的对手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {TEAM}的脚下延伸出了黏黏网！",
		end: "  {TEAM}脚下的黏黏网消失不见了！",
		activate: "  {POKEMON}被黏黏网粘住了！",
	},
	stockpile: {
		name: "蓄力",
		// Official flavor text: "积蓄力量， 提高自己的防御和特防。 最多积蓄３次。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}蓄力了{NUMBER}次！",
		end: "  {POKEMON}蓄力后的效果消失了！",
	},
	stokedsparksurfer: {
		name: "驾雷驭电戏冲浪",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stomp: {
		name: "踩踏",
		// Official flavor text: "用大脚踩踏对手进行攻击。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	stompingtantrum: {
		name: "跺脚",
		// Official flavor text: "化悔恨为力量进行攻击。 如果上一回合招式没有打中， 威力就会翻倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stoneaxe: {
		name: "岩斧",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stoneedge: {
		name: "尖石攻击",
		// Official flavor text: "用尖尖的岩石 刺入对手进行攻击。 容易击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	storedpower: {
		name: "辅助力量",
		// Official flavor text: "用蓄积起来的力量攻击对手。 自己的能力提高得越多， 威力就越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stormthrow: {
		name: "山岚摔",
		// Official flavor text: "向对手使出强烈的一击。 攻击必定会击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	strangesteam: {
		name: "神奇蒸汽",
		// Official flavor text: "喷出烟雾攻击对手。 有时会使对手混乱。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	strength: {
		name: "怪力",
		shortDesc: null, // NEEDS TRANSLATION
	},
	strengthsap: {
		name: "吸取力量",
		// Official flavor text: "给自己回复和对手攻击力 相同数值的ＨＰ， 然后降低对手的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stringshot: {
		name: "吐丝",
		// Official flavor text: "用口中吐出的丝缠绕对手， 从而大幅降低对手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	struggle: {
		name: "挣扎",
		// Official flavor text: "当自己的ＰＰ耗尽时， 努力挣扎攻击对手。 自己也会受到少许伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	strugglebug: {
		name: "虫之抵抗",
		// Official flavor text: "抵抗并攻击对手。 降低对手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stuffcheeks: {
		name: "大快朵颐",
		// Official flavor text: "吃掉携带的树果， 大幅提高防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	stunspore: {
		name: "麻痹粉",
		// Official flavor text: "撒出麻痹粉， 从而让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	submission: {
		name: "地狱翻滚",
		// Official flavor text: "将对手连同自己一起 摔向地面进行攻击。 自己也会受到少许伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	substitute: {
		name: "替身",
		// Official flavor text: "削减少许自己的ＨＰ， 制造分身。 分身将成为自己的替身。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}的替身出现了！",
		alreadyStarted: "  但是，{POKEMON}的替身已经出现了。",
		end: "  {POKEMON}的替身消失了……",
		fail: "  但是，体力已经不够放出替身了！",
		activate: "  替身代替{POKEMON}承受了攻击！",
	},
	subzeroslammer: {
		name: "激狂大地万里冰",
		shortDesc: null, // NEEDS TRANSLATION
	},
	suckerpunch: {
		name: "突袭",
		// Official flavor text: "可以比对手先攻击。 对手使出的招式 如果不是攻击招式则会失败。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	sunnyday: {
		name: "大晴天",
		// Official flavor text: "在５回合内让日照变得强烈， 从而提高火属性的招式威力。 水属性的招式威力则降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	sunsteelstrike: {
		name: "流星闪冲",
		// Official flavor text: "以流星般的气势猛撞对手。 可以无视对手的特性进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	supercellslam: {
		name: "闪电强袭",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		damage: "#crash",
	},
	superfang: {
		name: "愤怒门牙",
		// Official flavor text: "用锋利的门牙 猛烈地咬住对手进行攻击。 对手的ＨＰ减半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	superpower: {
		name: "蛮力",
		// Official flavor text: "发挥惊人的力量攻击对手。 自己的攻击和防御会降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	supersonic: {
		name: "超音波",
		shortDesc: null, // NEEDS TRANSLATION
	},
	supersonicskystrike: {
		name: "极速俯冲轰烈撞",
		shortDesc: null, // NEEDS TRANSLATION
	},
	surf: {
		name: "冲浪",
		// Official flavor text: "利用大浪 攻击自己周围所有的宝可梦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	surgingstrikes: {
		name: "水流连打",
		// Official flavor text: "将水之流派修炼至大成的 仿若行云流水般的３次连击。 必定会击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	swagger: {
		name: "虚张声势",
		// Official flavor text: "激怒对手，使其混乱。 因为愤怒，对手的攻击 会大幅提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	swallow: {
		name: "吞下",
		// Official flavor text: "将积蓄的力量吞下， 从而回复自己的ＨＰ。 积蓄得越多，回复越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	sweetkiss: {
		name: "天使之吻",
		shortDesc: null, // NEEDS TRANSLATION
	},
	sweetscent: {
		name: "甜甜香气",
		// Official flavor text: "用香气大幅降低对手的闪避率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	swift: {
		name: "高速星星",
		// Official flavor text: "发射星形的光攻击对手。 攻击必定会命中。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	switcheroo: {
		name: "掉包",
		// Official flavor text: "用一闪而过的速度 交换自己和对手的持有物。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
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

		activate: "#trick",
	},
	swordsdance: {
		name: "剑舞",
		// Official flavor text: "激烈地跳起战舞提高气势。 大幅提高自己的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	synchronoise: {
		name: "同步干扰",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	synthesis: {
		name: "光合作用",
		// Official flavor text: "回复自己的ＨＰ。 根据天气的不同， 回复量也会有所变化。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	syrupbomb: {
		name: "糖浆炸弹",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}陷入了满身糖状态！",
	},
	tackle: {
		name: "撞击",
		shortDesc: null, // NEEDS TRANSLATION
	},
	tachyoncutter: {
		name: "迅子利刃",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	tailglow: {
		name: "萤火",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	tailslap: {
		name: "扫尾拍打",
		// Official flavor text: "用坚硬的尾巴 拍打对手进行攻击。 连续攻击２～５次。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	tailwhip: {
		name: "摇尾巴",
		// Official flavor text: "可爱地左右摇晃尾巴， 诱使对手疏忽大意。 会降低对手的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	tailwind: {
		name: "顺风",
		// Official flavor text: "刮起猛烈的旋风， 在４回合内 提高我方全员的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  从{TEAM}身后吹起了顺风！",
		end: "  {TEAM}的顺风停止了！",
	},
	takedown: {
		name: "猛撞",
		// Official flavor text: "以惊人的气势 撞向对手进行攻击。 自己也会受到少许伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	takeheart: {
		name: "勇气填充",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	tarshot: {
		name: "沥青射击",
		// Official flavor text: "泼洒黏糊糊的沥青， 降低对手的速度， 并且使对手的弱点变为火。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}变得怕火了！",
	},
	taunt: {
		name: "挑衅",
		// Official flavor text: "使对手愤怒。 在３回合内让对手 只能使出给予伤害的招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
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
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}中了挑衅！",
		end: "  {POKEMON}的挑衅效果解除了！",
		cant: "{POKEMON}受到了挑衅，无法使出{MOVE}！",
	},
	tearfullook: {
		name: "泪眼汪汪",
		// Official flavor text: "变得泪眼汪汪， 让对手丧失斗志。 从而降低对手的攻击和特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	teatime: {
		name: "茶会",
		// Official flavor text: "举办一场茶会， 场上的所有宝可梦都会 吃掉自己携带的树果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  大家开茶会，吃了树果！",
		fail: "  但是什么都没有发生！",
	},
	technoblast: {
		name: "高科技光炮",
		// Official flavor text: "向对手放出光弹。 属性会根据自己 携带的卡带不同而改变。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	tectonicrage: {
		name: "地隆啸天大终结",
		shortDesc: null, // NEEDS TRANSLATION
	},
	teeterdance: {
		name: "摇晃舞",
		// Official flavor text: "摇摇晃晃地跳起舞蹈， 让自己周围的宝可梦 陷入混乱状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	telekinesis: {
		name: "意念移物",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  让{POKEMON}浮在了空中！",
		end: "  {POKEMON}摆脱了意念移物！",
	},
	teleport: {
		name: "瞬间移动",
		// Official flavor text: "当有后备宝可梦在时， 如果使用就可以进行替换。 野生的宝可梦会逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	temperflare: {
		name: "豁出去",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	terablast: {
		name: "太晶爆发",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	terastarstorm: {
		name: "晶光星群",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	terrainpulse: {
		name: "大地波动",
		// Official flavor text: "借助场地的力量进行攻击。 视使出招式时场地状态不同， 招式的属性和威力会有所变化。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thief: {
		name: "小偷",
		// Official flavor text: "攻击的同时盗取道具。 当自己携带道具时， 不会去盗取。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
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
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	thousandarrows: {
		name: "千箭齐发",
		// Official flavor text: "可以击中浮在空中的宝可梦。 空中的对手被击落后， 会掉到地面。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thousandwaves: {
		name: "千波激荡",
		// Official flavor text: "从地面掀起波浪进行攻击。 被掀入波浪中的对手， 将无法从战斗中逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	thrash: {
		name: "大闹一番",
		// Official flavor text: "在２～３回合内， 乱打一气地攻击对手。 大闹一番后自己会陷入混乱。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	throatchop: {
		name: "地狱突刺",
		// Official flavor text: "受到此招式攻击的对手， 会因为地狱般的痛苦，在２回合内， 变得无法使出声音类招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},

		cant: "{POKEMON}因深渊突刺的效果无法使出招式！",
	},
	thunder: {
		name: "打雷",
		// Official flavor text: "向对手劈下暴雷进行攻击。 有时会让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	thunderbolt: {
		name: "十万伏特",
		// Official flavor text: "向对手发出 强力电击进行攻击。 有时会让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thundercage: {
		name: "雷电囚笼",
		// Official flavor text: "将对手困在 电流四溅的囚笼中， 在４～５回合内进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}被{SOURCE}困住了！",
	},
	thunderclap: {
		name: "迅雷",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thunderfang: {
		name: "雷电牙",
		// Official flavor text: "用蓄满电流的牙齿咬住对手。 有时会使对手畏缩 或陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thunderouskick: {
		name: "雷鸣蹴击",
		// Official flavor text: "以雷电般的动作 戏耍对手的同时使出脚踢。 可降低对手的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thunderpunch: {
		name: "雷电拳",
		// Official flavor text: "用充满电流的拳头攻击对手。 有时会让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thundershock: {
		name: "电击",
		// Official flavor text: "发出电流刺激对手进行攻击。 有时会让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thunderwave: {
		name: "电磁波",
		// Official flavor text: "向对手发出 微弱的电击， 从而让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	tickle: {
		name: "挠痒",
		// Official flavor text: "给对手挠痒，使其发笑， 从而降低对手的攻击和防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	tidyup: {
		name: "大扫除",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  大扫除完毕！",
	},
	topsyturvy: {
		name: "颠倒",
		// Official flavor text: "颠倒对手身上的 所有能力变化， 变成和原来相反的状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	torchsong: {
		name: "闪焰高歌",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	torment: {
		name: "无理取闹",
		// Official flavor text: "向对手无理取闹， 令其不能连续２次 使出相同招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}遭到了无理取闹！",
		end: "  {POKEMON}的无理取闹的效果消失了！",
	},
	toxic: {
		name: "剧毒",
		// Official flavor text: "让对手陷入剧毒状态。 随着回合的推进， 中毒伤害会增加。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	toxicspikes: {
		name: "毒菱",
		// Official flavor text: "在对手的脚下撒毒菱。 使对手替换出场的宝可梦中毒。"
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
		},

		start: "  {TEAM}脚下散落着毒菱！",
		end: "  {TEAM}脚下的毒菱消失不见了！",
	},
	toxicthread: {
		name: "毒丝",
		// Official flavor text: "将混有毒的丝吐向对手。 使其中毒， 从而降低对手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	trailblaze: {
		name: "起草",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	transform: {
		name: "变身",
		// Official flavor text: "变身成对手宝可梦的样子， 能够使用和对手 完全相同的招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},

		transform: "{POKEMON}变身成了{SPECIES}！",
	},
	triattack: {
		name: "三重攻击",
		// Official flavor text: "用３种光线进行攻击。 有时会让对手陷入 麻痹、灼伤或冰冻的状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	trick: {
		name: "戏法",
		// Official flavor text: "抓住对手的空隙， 交换自己和对手的持有物。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
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

		activate: "  {POKEMON}互换了各自的道具！",
	},
	trickortreat: {
		name: "万圣夜",
		// Official flavor text: "邀请对手参加万圣夜。 使对手被追加幽灵属性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	trickroom: {
		name: "戏法空间",
		// Official flavor text: "制造出离奇的空间。 在５回合内 速度慢的宝可梦可以先行动。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	triplearrows: {
		name: "三连箭",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	tripleaxel: {
		name: "三旋击",
		// Official flavor text: "连续３次踢对手进行攻击。 每踢中一次，威力就会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	tripledive: {
		name: "三连钻",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	triplekick: {
		name: "三连踢",
		// Official flavor text: "连续３次踢对手进行攻击。 每踢中一次，威力就会提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	tropkick: {
		name: "热带踢",
		// Official flavor text: "向对手使出来自南国的火热脚踢。 从而降低对手的攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	trumpcard: {
		name: "王牌",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	twinbeam: {
		name: "双光束",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	twineedle: {
		name: "双针",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	twinkletackle: {
		name: "可爱星星飞天撞",
		shortDesc: null, // NEEDS TRANSLATION
	},
	twister: {
		name: "龙卷风",
		// Official flavor text: "兴起龙卷风， 将对手卷入进行攻击。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	upperhand: {
		name: "快手还击",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	uproar: {
		name: "吵闹",
		// Official flavor text: "在３回合内 用骚乱攻击对手。 在此期间谁都不能入眠。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
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

		start: "  {POKEMON}吵闹了起来！",
		end: "  {POKEMON}平静了下来！",
		upkeep: "  {POKEMON}吵闹个不停！",
		block: "  但是，{POKEMON}被吵得无法入睡！",
		blockSelf: "  但是，{POKEMON}吵闹个不停，无法入睡！",
	},
	uturn: {
		name: "急速折返",
		// Official flavor text: "在攻击之后急速返回， 和后备宝可梦进行替换。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		switchOut: "{POKEMON}要回到{TRAINER}的身边了！",
	},
	vacuumwave: {
		name: "真空波",
		// Official flavor text: "挥动拳头， 掀起真空波。 必定能够先制攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	vcreate: {
		name: "Ｖ热焰",
		// Official flavor text: "从前额产生灼热的火焰， 舍身撞击对手。 防御、特防和速度会降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	veeveevolley: {
		name: "砰砰击破",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	venomdrench: {
		name: "毒液陷阱",
		// Official flavor text: "将特殊的毒液泼向对手。 对处于中毒状态的对手， 其攻击、特攻和速度都会降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	venoshock: {
		name: "毒液冲击",
		// Official flavor text: "将特殊的毒液泼向对手。 对处于中毒状态的对手， 威力会变成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	victorydance: {
		name: "胜利之舞",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	vinewhip: {
		name: "藤鞭",
		shortDesc: null, // NEEDS TRANSLATION
	},
	visegrip: {
		name: "夹住",
		shortDesc: null, // NEEDS TRANSLATION
	},
	vitalthrow: {
		name: "借力摔",
		// Official flavor text: "会在对手之后进行攻击。 但是自己的攻击必定会命中。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	voltswitch: {
		name: "伏特替换",
		// Official flavor text: "在攻击之后急速返回， 和后备宝可梦进行替换。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		switchOut: "#uturn",
	},
	volttackle: {
		name: "伏特攻击",
		// Official flavor text: "让电流覆盖全身猛撞向对手。 自己也会受到不小的伤害。 有时会让对手陷入麻痹状态。"
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
	wakeupslap: {
		name: "唤醒巴掌",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	waterfall: {
		name: "攀瀑",
		// Official flavor text: "以惊人的气势扑向对手。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	watergun: {
		name: "水枪",
		shortDesc: null, // NEEDS TRANSLATION
	},
	waterpledge: {
		name: "水之誓约",
		// Official flavor text: "用水柱进行攻击。 如果和火组合，威力就会提高， 天空中会挂上彩虹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}正在等待{TARGET}……",
		start: "  彩虹出现在了{TEAM}上空！",
		end: "  彩虹从{TEAM}上空消失了！",
	},
	waterpulse: {
		name: "水之波动",
		// Official flavor text: "用水的震动攻击对手。 有时会使对手混乱。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	watershuriken: {
		name: "飞水手里剑",
		// Official flavor text: "用粘液制成的手里剑， 连续攻击２～５次。 必定能够先制攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	watersport: {
		name: "玩水",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	waterspout: {
		name: "喷水",
		// Official flavor text: "掀起潮水进行攻击。 自己的ＨＰ越少， 招式的威力越小。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	wavecrash: {
		name: "波动冲",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	weatherball: {
		name: "气象球",
		// Official flavor text: "根据使用时的天气， 招式属性和威力会改变。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		move: "究极无敌大冲撞因天气的影响变成了{MOVE}！",
	},
	whirlpool: {
		name: "潮旋",
		// Official flavor text: "将对手困在激烈的 水流旋涡中， 在４～５回合内进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
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
		},

		start: "  {POKEMON}被困在了旋涡之中！",
	},
	whirlwind: {
		name: "吹飞",
		// Official flavor text: "吹飞对手，强制拉后备宝可梦上场。 如果对手为野生宝可梦， 战斗将直接结束。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	wickedblow: {
		name: "暗冥强击",
		// Official flavor text: "将恶之流派修炼至大成的 猛烈一击。 必定会击中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	wickedtorque: {
		name: "黑暗暴冲",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	wideguard: {
		name: "广域防守",
		// Official flavor text: "在１回合内防住 击打我方全员的攻击。"
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
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {TEAM}受到了广域防守的保护！",
		block: "  {POKEMON}受到了广域防守的保护！",
	},
	wildboltstorm: {
		name: "鸣雷风暴",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	wildcharge: {
		name: "疯狂伏特",
		// Official flavor text: "让电流覆盖全身， 撞向对手进行攻击。 自己也会受到少许伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	willowisp: {
		name: "鬼火",
		// Official flavor text: "放出怪异的火焰， 从而让对手陷入灼伤状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	wingattack: {
		name: "翅膀攻击",
		shortDesc: null, // NEEDS TRANSLATION
	},
	wish: {
		name: "祈愿",
		// Official flavor text: "在下一回合回复自己或是 替换出场的宝可梦最大ＨＰ的一半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		heal: "  {NICKNAME}的祈愿实现了！",
	},
	withdraw: {
		name: "缩入壳中",
		// Official flavor text: "缩入壳里保护身体， 从而提高自己的防御。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	wonderroom: {
		name: "奇妙空间",
		// Official flavor text: "制造出离奇的空间。 在５回合内互换 所有宝可梦的防御和特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	woodhammer: {
		name: "木槌",
		// Official flavor text: "用坚硬的躯体 撞击对手进行攻击。 自己也会受到不小的伤害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	workup: {
		name: "自我激励",
		// Official flavor text: "激励自己， 从而提高攻击和特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	worryseed: {
		name: "烦恼种子",
		// Official flavor text: "种植心神不宁的种子。 使对手不能入眠， 并将特性变成不眠。"
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
	},
	wrap: {
		name: "紧束",
		// Official flavor text: "使用长长的身体或藤蔓等， 在４～５回合内 紧束对手进行攻击。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
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
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}被{SOURCE}紧紧束缚住了！",
		move: null, // NEEDS TRANSLATION
	},
	wringout: {
		name: "绞紧",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	xscissor: {
		name: "十字剪",
		shortDesc: null, // NEEDS TRANSLATION
	},
	yawn: {
		name: "哈欠",
		// Official flavor text: "打个大哈欠引起睡意。 在下一回合让对手陷入睡眠状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  让{POKEMON}产生睡意了！",
	},
	zapcannon: {
		name: "电磁炮",
		// Official flavor text: "发射大炮一样的 电流进行攻击。 让对手陷入麻痹状态。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	zenheadbutt: {
		name: "意念头锤",
		// Official flavor text: "将思念的力量集中在 前额进行攻击。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	zingzap: {
		name: "麻麻刺刺",
		// Official flavor text: "撞向对手，并发出强电， 使其感到麻麻刺刺的。 有时会使对手畏缩。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	zippyzap: {
		name: "电电加速",
		// Official flavor text: "无法使用这个招式。 虽然忘记之后就再也想不起来了， 但还是建议忘记这个招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
};
