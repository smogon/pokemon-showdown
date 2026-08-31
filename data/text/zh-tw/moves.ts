// Mechanics desc style (zh-tw): official game terminology, halfwidth numerals (1.5倍, 30%, 2～5次).
// Terminology: 使用者 (user), 目標 (target), 對手方 (opposing side), 己方 (user side),
//   追加效果 (secondary effect), 畏縮 (flinch), 擊中要害 (crit), 能力等級 (stat stage), 異常狀態
//   (non-volatile status), 連續攻擊招式 (multi-hit), 優先度 (priority), 替身 (substitute),
//   屬性相性 (type effectiveness), 必定命中 (never misses), 反作用力 (recoil).
// Rounding: 四捨五入 (half up), 五捨六入 (half down), 向下取整 (down), 向上取整 (up).
// Fixed formulas mirror zh-cn/moves.ts (converted); boilerplate is shared verbatim across
//   entries — QC one, fix all. Cross-references generated from zh-tw name fields.
// CAP entities keep name null (English fallback); descs are translated with English names inline.

export const MovesText: { [id: IDEntry]: MoveText } = {
	"10000000voltthunderbolt": {
		name: "千萬伏特",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	absorb: {
		name: "吸取",
		// Official flavor text: "吸取對手的養分進行攻擊。 可以回復給予對手 傷害的一半ＨＰ。"
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
		name: "衝岩",
		// Official flavor text: "迅速撞向對手進行攻擊。 必定能夠發動先制攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	acid: {
		name: "溶解液",
		// Official flavor text: "將強酸潑向對手進行攻擊。 有時會降低對手的特防。"
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
		// Official flavor text: "藉由細胞的變化讓身體液化， 大幅提高自己的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aciddownpour: {
		name: "強酸劇毒滅絕雨",
		shortDesc: null, // NEEDS TRANSLATION
	},
	acidspray: {
		name: "酸液炸彈",
		// Official flavor text: "噴出能溶化對手的液體進行攻擊。 可大幅降低對手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	acrobatics: {
		name: "雜技",
		shortDesc: null, // NEEDS TRANSLATION
	},
	acupressure: {
		name: "點穴",
		// Official flavor text: "利用點穴激發身體的活力， 大幅提高某一項能力。"
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
		name: "氣旋攻擊",
		// Official flavor text: "向對手發射空氣旋渦 進行攻擊。 容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	afteryou: {
		name: "您先請",
		// Official flavor text: "支援對手， 讓對手緊接在自己之後行動。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {TARGET}接受了對手的好意！",
	},
	agility: {
		name: "高速移動",
		// Official flavor text: "放鬆身體， 讓自己變得輕盈以進行高速移動。 可大幅提高自己的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aircutter: {
		name: "空氣利刃",
		// Official flavor text: "用鋒利的風刃 斬切對手進行攻擊。 容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	airslash: {
		name: "空氣斬",
		// Official flavor text: "用連天空也能劈開的 空氣之刃進行攻擊。 有時會使對手畏縮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	alloutpummeling: {
		name: "全力無雙激烈拳",
		shortDesc: null, // NEEDS TRANSLATION
	},
	alluringvoice: {
		name: "魅誘之聲",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	allyswitch: {
		name: "交換場地",
		// Official flavor text: "用神奇的力量瞬間移動， 讓自己和同伴的所在位置互換。"
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
		name: "瞬間失憶",
		// Official flavor text: "將頭腦清空， 藉由在一瞬間遺忘某些事 大幅提高自己的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	anchorshot: {
		name: "擲錨",
		// Official flavor text: "將錨纏住對手進行攻擊。 使對手無法逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	ancientpower: {
		name: "原始之力",
		// Official flavor text: "用原始之力進行攻擊。 有時會提高 自己的所有能力。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	appleacid: {
		name: "蘋果酸",
		// Official flavor text: "使用從酸蘋果提煉出的 酸性液體進行攻擊。 可降低對手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aquacutter: {
		name: "水波刀",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aquajet: {
		name: "水流噴射",
		// Official flavor text: "以迅雷不及掩耳之勢 撲向對手。 必定能夠發動先制攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aquaring: {
		name: "水流環",
		// Official flavor text: "在自己的身邊套上水流環。 每回合會回復自己的ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}套上了水環！",
		heal: "  {POKEMON}透過水環回復了體力！",
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
		name: "鎧農炮",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	armthrust: {
		name: "猛推",
		// Official flavor text: "用張開的雙手 猛推對手進行攻擊。 連續攻擊２～５次。"
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
		name: "芳香治療",
		// Official flavor text: "釋放出宜人的香氣， 治癒我方全體的異常狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  怡人的香氣擴散了開來！",
	},
	aromaticmist: {
		name: "芳香薄霧",
		// Official flavor text: "利用神奇的芳香， 提高我方寶可夢的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	assist: {
		name: "借助",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "惡意追擊",
		// Official flavor text: "如果此回合內對手 已受到傷害， 招式威力會變成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	astonish: {
		name: "驚嚇",
		// Official flavor text: "用巨大的聲響等 突然驚嚇對手進行攻擊。 有時會讓對手畏縮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	astralbarrage: {
		name: "星碎",
		// Official flavor text: "向對手釋出大量的 小靈體進行攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	attackorder: {
		name: "攻擊指令",
		// Official flavor text: "呼喚手下， 向對手發動攻擊。 容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	attract: {
		name: "迷人",
		// Official flavor text: "♂誘惑♀而♀誘惑♂， 讓對手著迷。 對手將難以使用招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}陷入了著迷狀態！",
		startFromItem: "  {POKEMON}因{ITEM}陷入了著迷狀態！",
		end: "  {POKEMON}的著迷狀態痊癒了！",
		endFromItem: "  {POKEMON}用{ITEM}治癒了著迷狀態！",
		activate: "  {POKEMON}對{TARGET}著迷了！",
		cant: "{POKEMON}陷入了著迷狀態，無法使出招式！",
	},
	aurasphere: {
		name: "波導彈",
		shortDesc: null, // NEEDS TRANSLATION
	},
	aurawheel: {
		name: "氣場輪",
		// Official flavor text: "用儲存在頰囊中的能量進行攻擊， 並提高自己的速度。招式屬性 會隨著莫魯貝可的樣子而改變。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aurorabeam: {
		name: "極光束",
		// Official flavor text: "向對手發射 七彩光束進行攻擊。 有時會降低對手的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	auroraveil: {
		name: "極光幕",
		// Official flavor text: "在５回合內減弱 物理和特殊的傷害。 在下冰雹時才有效果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  極光幕使{TEAM}的物理和特殊抗性提高了！",
		end: "  {TEAM}的極光幕消失了！",
	},
	autotomize: {
		name: "身體輕量化",
		// Official flavor text: "削去身體上多餘的部分。 以大幅提高自己的速度， 同時體重也會變輕。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}變得身輕如燕了！",
	},
	avalanche: {
		name: "雪崩",
		// Official flavor text: "如果受到對手的招式攻擊， 給予該對手的招式威力就會變成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	axekick: {
		name: "下壓踢",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		damage: "#crash",
	},
	babydolleyes: {
		name: "圓瞳",
		// Official flavor text: "用圓圓的眼睛凝視對手， 降低對手的攻擊。 必定能夠發動先制攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	baddybad: {
		name: "壞壞領域",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	banefulbunker: {
		name: "碉堡",
		// Official flavor text: "防住對手攻擊的同時， 讓碰觸到自己的對手中毒。"
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
		name: "毒千針",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	barrage: {
		name: "投球",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	batonpass: {
		name: "接棒",
		// Official flavor text: "與後備寶可夢進行替換。 替換上場的寶可夢， 將承接目前寶可夢的能力變化。"
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
		name: "鳥嘴加農炮",
		// Official flavor text: "先加熱鳥嘴後再進行攻擊。 若對手在加熱時觸碰的話， 就會灼傷。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}開始給鳥嘴加熱了！",
	},
	beatup: {
		name: "圍攻",
		// Official flavor text: "讓我方所有寶可夢進行攻擊。 同行的寶可夢越多， 招式的攻擊次數越多。"
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
		name: "巨獸彈",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	behemothblade: {
		name: "巨獸斬",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	belch: {
		name: "打嗝",
		// Official flavor text: "朝著對手打嗝進行攻擊。 沒吃下樹果時無法使用。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	bellydrum: {
		name: "腹鼓",
		// Official flavor text: "將現有的ＨＰ 減去最大ＨＰ的一半， 讓自己的攻擊提高至最大值。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		boost: "  {POKEMON}削減體力並釋放了全部力量！",
	},
	bestow: {
		name: "傳遞禮物",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		takeItem: "  {POKEMON}從{SOURCE}那裡獲得了{ITEM}！",
	},
	bide: {
		name: "忍耐",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "綁緊",
		// Official flavor text: "使用長長的身體或藤蔓等， 在４～５回合內 綁緊對手進行攻擊。"
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

		start: "  {POKEMON}被{SOURCE}緊緊綁住了！",
		move: "#wrap",
	},
	bite: {
		name: "咬住",
		// Official flavor text: "用尖銳的牙齒 咬住對手進行攻擊。 有時會使對手畏縮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	bitterblade: {
		name: "悔念劍",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bittermalice: {
		name: "冤冤相報",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	blackholeeclipse: {
		name: "黑洞吞噬萬物滅",
		shortDesc: null, // NEEDS TRANSLATION
	},
	blastburn: {
		name: "爆炸烈焰",
		// Official flavor text: "用爆炸的火焰 燒盡對手進行攻擊。 下一回合自己將無法動彈。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	blazekick: {
		name: "火焰踢",
		// Official flavor text: "有時會讓受到攻擊的對手 陷入灼傷狀態。 且容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	blazingtorque: {
		name: "灼熱暴衝",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bleakwindstorm: {
		name: "枯葉風暴",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	blizzard: {
		name: "暴風雪",
		// Official flavor text: "將猛烈的暴風雪 吹向對手進行攻擊。 有時會讓對手陷入冰凍狀態。"
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
		name: "擋路",
		// Official flavor text: "張開雙手進行阻擋， 封住對手的退路， 讓對手無法逃走。"
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
		name: "絢爛繽紛花怒放",
		shortDesc: null, // NEEDS TRANSLATION
	},
	blueflare: {
		name: "青焰",
		// Official flavor text: "用美麗而激烈的青焰 燃燒對手進行攻擊。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bodypress: {
		name: "撲擊",
		// Official flavor text: "用身體撞向對手進行攻擊。 自己的防禦越高， 給予對手的傷害越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bodyslam: {
		name: "泰山壓頂",
		// Official flavor text: "用整個身體 壓住對手進行攻擊。 有時會讓對手陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	boltbeak: {
		name: "電喙",
		// Official flavor text: "用帶有電流的鳥嘴刺向對手。 若在對手之前進行攻擊， 招式的威力會變成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	boltstrike: {
		name: "雷擊",
		// Official flavor text: "用強大的電流圍繞身體， 猛撞對手進行攻擊。 有時會讓對手陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	boneclub: {
		name: "骨棒",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bonemerang: {
		name: "骨頭回力鏢",
		// Official flavor text: "向對手投擲手中的骨頭， 來回連續２次給予傷害。"
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
		name: "骨棒亂打",
		// Official flavor text: "用堅硬的骨頭 毆打對手進行攻擊。 連續攻擊２～５次。"
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
		// Official flavor text: "利用震耳欲聾的爆炸聲 所產生的破壞力， 攻擊自己周圍所有的寶可夢。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bounce: {
		name: "彈跳",
		// Official flavor text: "彈跳到高空中， 在下一回合攻擊對手。 有時會讓對手陷入麻痺狀態。"
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

		prepare: "{POKEMON}高高地跳了起來！",
	},
	bouncybubble: {
		name: "活活氣泡",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	branchpoke: {
		name: "木枝突刺",
		// Official flavor text: "用尖銳的樹枝 刺向對手進行攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bravebird: {
		name: "勇鳥猛攻",
		// Official flavor text: "收起翅膀， 低空飛行突擊對手。 自己也會受到不小的傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	breakingswipe: {
		name: "廣域破壞",
		// Official flavor text: "激烈地甩動強韌 的尾巴攻擊對手， 降低對手的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	breakneckblitz: {
		name: "究極無敵大衝撞",
		shortDesc: null, // NEEDS TRANSLATION
	},
	brickbreak: {
		name: "劈瓦",
		// Official flavor text: "猛烈地揮下手刀 攻擊對手。還可以破壞 光牆和反射壁等。"
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
		name: "鹽水",
		// Official flavor text: "當對手負傷， ＨＰ剩一半左右時， 招式威力會變成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	brutalswing: {
		name: "狂舞揮打",
		// Official flavor text: "用自己的身體狂舞揮打， 給予對手傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bubble: {
		name: "泡沫",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "泡沫光線",
		// Official flavor text: "向對手猛烈地噴射 泡沫進行攻擊。 有時會降低對手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	bugbite: {
		name: "蟲咬",
		// Official flavor text: "叮咬對手進行攻擊。 可以吃下對手攜帶的樹果， 並獲得樹果的效果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		removeItem: "  {SOURCE}奪取並吃掉了{ITEM}！",
	},
	bugbuzz: {
		name: "蟲鳴",
		// Official flavor text: "利用振動產生出的音波進行攻擊。 有時會降低對手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bulkup: {
		name: "健美",
		// Official flavor text: "將力量集中於體內，增厚肌肉， 提高自己的攻擊和防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bulldoze: {
		name: "重踏",
		// Official flavor text: "用力踩踏地面， 攻擊自己周圍所有的寶可夢。 可降低對手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bulletpunch: {
		name: "子彈拳",
		// Official flavor text: "向對手連續揮出如子彈般 快速且堅硬的拳頭。 必定能夠發動先制攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bulletseed: {
		name: "種子機關槍",
		// Official flavor text: "向對手猛烈地 發射種子進行攻擊。 連續攻擊２～５次。"
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
		name: "火焰守護",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	burningjealousy: {
		name: "妒火",
		// Official flavor text: "用嫉妒的能量攻擊對手。 讓此回合內能力提高的 寶可夢陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	burnup: {
		name: "燃盡",
		// Official flavor text: "燃盡全身的火焰， 給予對手巨大的傷害。 自己的火屬性將會消失。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},

		typeChange: "  {POKEMON}的火焰燃盡了！",
	},
	buzzybuzz: {
		name: "麻麻電擊",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	calmmind: {
		name: "冥想",
		// Official flavor text: "屏氣凝神， 提高自己的特攻和特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	camouflage: {
		name: "保護色",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "誘惑",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	catastropika: {
		name: "皮卡皮卡必殺擊",
		shortDesc: null, // NEEDS TRANSLATION
	},
	ceaselessedge: {
		name: "秘劍・千重濤",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	celebrate: {
		name: "慶祝",
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  恭喜恭喜！{TRAINER}！！",
	},
	charge: {
		name: "充電",
		// Official flavor text: "提高下一回合使出的 電屬性招式威力。 也會提高自己的特防。"
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

		start: "  {POKEMON}開始充電了！",
	},
	chargebeam: {
		name: "充電光束",
		// Official flavor text: "向對手發射電擊光束。 有時會因電流蓄積， 提高自己的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	charm: {
		name: "撒嬌",
		// Official flavor text: "用撒嬌的眼神 誘使對手疏忽大意， 大幅降低對手的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	chatter: {
		name: "喋喋不休",
		// Official flavor text: "用非常煩人且喋喋不休的 音波攻擊對手。 使對手混亂。"
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
		name: "潑冷水",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	chillyreception: {
		name: "冷笑話",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		prepare: "  {POKEMON}說了冷笑話！",
	},
	chipaway: {
		name: "逐步擊破",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	chloroblast: {
		name: "葉綠爆震",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	circlethrow: {
		name: "巴投",
		// Official flavor text: "摔飛對手， 強制讓後備寶可夢上場。 對手為野生寶可夢時，戰鬥將直接結束。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	clamp: {
		name: "貝殼夾擊",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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

		start: "  {POKEMON}被{SOURCE}的殼夾住了！",
		move: "#wrap",
	},
	clangingscales: {
		name: "鱗片噪音",
		// Official flavor text: "摩擦全身鱗片， 發出響亮的聲音並進行攻擊。 攻擊後自己的防禦會降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	clangoroussoul: {
		name: "魂舞烈音爆",
		// Official flavor text: "消耗一些自己的ＨＰ， 提高自己的所有能力。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	clangoroussoulblaze: {
		name: "熾魂熱舞烈音爆",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	clearsmog: {
		name: "清除之煙",
		shortDesc: null, // NEEDS TRANSLATION
	},
	closecombat: {
		name: "近身戰",
		// Official flavor text: "反守為攻，近身突擊對手。 自己的防禦和特防會降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	coaching: {
		name: "指導",
		// Official flavor text: "透過適切的指導， 提高我方全體的攻擊和防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	coil: {
		name: "盤蜷",
		// Official flavor text: "盤蜷身體集中精神。 可提高自己的攻擊、防禦和命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	collisioncourse: {
		name: "全開猛撞",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	combattorque: {
		name: "格鬥暴衝",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	cometpunch: {
		name: "連續拳",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "復仇",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	confide: {
		name: "密語",
		// Official flavor text: "向對手低聲密語， 使對手失去集中力， 降低對手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	confuseray: {
		name: "奇異之光",
		// Official flavor text: "讓對手看奇怪的光線 擾亂對手。 使對手混亂。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	confusion: {
		name: "念力",
		// Official flavor text: "向對手發送 微弱的念力進行攻擊。 有時會使對手混亂。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	constrict: {
		name: "纏繞",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	continentalcrush: {
		name: "毀天滅地巨岩墜",
		shortDesc: null, // NEEDS TRANSLATION
	},
	conversion: {
		name: "紋理",
		// Official flavor text: "將自己的屬性轉換成 與已學會的招式中 第１個招式相同的屬性。"
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
		name: "紋理２",
		// Official flavor text: "改變屬性， 讓自己能夠抵抗對手 最近一次使出的招式。"
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
		// Official flavor text: "模仿對手最近一次使用的招式， 若對手沒有成功出招則會失敗。"
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
		name: "核心懲罰者",
		// Official flavor text: "如果攻擊的對手在該回合 已經結束行動， 對手的特性就會被消除。"
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
		name: "超絕螺旋連擊",
		shortDesc: null, // NEEDS TRANSLATION
	},
	corrosivegas: {
		name: "腐蝕氣體",
		// Official flavor text: "用強烈的酸性氣體 包圍周圍所有的寶可夢， 並將攜帶的道具融化掉。"
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
		// Official flavor text: "吸取來自宇宙的神秘力量， 提高自己的防禦和特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	cottonguard: {
		name: "棉花防守",
		// Official flavor text: "用軟綿綿的絨毛 保護自己的身體。 極大幅提高自己的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	cottonspore: {
		name: "棉孢子",
		// Official flavor text: "將棉花般柔軟的孢子 纏繞對手， 大幅降低對手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	counter: {
		name: "雙倍奉還",
		// Official flavor text: "將來自對手的物理攻擊傷害加倍後， 返還給該對手。"
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
		name: "換場",
		// Official flavor text: "用神奇的力量 與對手交換場地效果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}交換了雙方的場地效果！",
	},
	covet: {
		name: "渴望",
		// Official flavor text: "一邊可愛地撒嬌， 一邊靠近對手， 奪取對手攜帶的道具。"
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
		name: "蟹鉗錘",
		// Official flavor text: "用巨大的鉗子 敲打對手進行攻擊。 容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	craftyshield: {
		name: "戲法防守",
		// Official flavor text: "使用神奇的力量 防禦住攻擊我方的變化招式。 但無法防禦住攻擊招式的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {TEAM}受到了戲法防守的保護！",
		block: "  {POKEMON}受到了戲法防守的保護！",
	},
	crosschop: {
		name: "十字劈",
		// Official flavor text: "用左右手刀 劈打對手進行攻擊。 容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	crosspoison: {
		name: "十字毒刃",
		// Official flavor text: "用毒刃劈開對手。 有時會讓對手陷入中毒狀態， 也容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	crunch: {
		name: "咬碎",
		// Official flavor text: "用尖銳的牙齒咬碎對手進行攻擊。 有時會降低對手的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	crushclaw: {
		name: "撕裂爪",
		// Official flavor text: "用堅硬的銳爪 撕裂對手進行攻擊。 有時會降低對手的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	crushgrip: {
		name: "捏碎",
		// Official flavor text: "用驚人的力量捏碎對手。 對手現有的ＨＰ越多， 招式的威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	curse: {
		name: "詛咒",
		// Official flavor text: "使用詛咒時， 幽靈屬性的寶可夢和其他屬性的寶可夢， 會獲得不同的招式效果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {SOURCE}削減了自己的體力，並詛咒了{POKEMON}！",
		damage: "  {POKEMON}正受到詛咒！",
	},
	cut: {
		name: "居合斬",
		shortDesc: null, // NEEDS TRANSLATION
	},
	darkestlariat: {
		name: "ＤＤ金勾臂",
		// Official flavor text: "旋轉雙臂並打向對手。 可不顧對手的能力變化 給予傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	darkpulse: {
		name: "惡之波動",
		// Official flavor text: "從身體散發出 充滿惡意的恐怖氣場。 有時會使對手畏縮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	darkvoid: {
		name: "暗黑洞",
		// Official flavor text: "將對手強制拉進黑暗的世界， 讓對手陷入睡眠狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		fail: "但是，{POKEMON}無法使用！",
		failWrongForme: "但是，現在的{POKEMON}無法使用！",
	},
	dazzlinggleam: {
		name: "魔法閃耀",
		// Official flavor text: "發出強烈的閃光， 給予對手傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	decorate: {
		name: "裝飾",
		// Official flavor text: "透過裝飾， 大幅提高對手的 攻擊和特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	defendorder: {
		name: "防禦指令",
		// Official flavor text: "呼喚手下，覆蓋住自己的身體。 可提高自己的防禦和特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	defensecurl: {
		name: "變圓",
		// Official flavor text: "將身體蜷縮成圓形， 提高自己的防禦。"
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
		name: "清除濃霧",
		// Official flavor text: "用強風吹開對手的 反射壁或光牆等。 也會降低對手的閃避率。"
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
		// Official flavor text: "使出招式後，當受到對手攻擊， 陷入瀕死時，對手也會一同陷入瀕死。 連續使用時會失敗。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}想和對手同歸於盡！",
		activate: "{POKEMON}和對手同歸於盡了！",
	},
	detect: {
		name: "看穿",
		// Official flavor text: "完全防住對手的所有攻擊。 連續使用時容易失敗。"
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
		name: "究極巨龍震天地",
		shortDesc: null, // NEEDS TRANSLATION
	},
	diamondstorm: {
		name: "鑽石風暴",
		// Official flavor text: "吹起鑽石風暴給予對手傷害。 有時會大幅提高自己的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	dig: {
		name: "挖洞",
		// Official flavor text: "使用後的第１回合潛入地底， 並於第２回合攻擊對手。"
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

		prepare: "{POKEMON}鑽進了地下！",
	},
	direclaw: {
		name: "剋命爪",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	disable: {
		name: "定身法",
		// Official flavor text: "阻止對手出招， 最近一次使用的招式 在４回合內無法使用。"
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
		cant: "{POKEMON}因定身法而無法使出{MOVE}！",
	},
	disarmingvoice: {
		name: "魅惑之聲",
		// Official flavor text: "發出迷人的叫聲， 給予對手精神上的傷害。 攻擊必定會命中。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	discharge: {
		name: "放電",
		// Official flavor text: "用耀眼的電流 攻擊自己周圍所有的寶可夢。 有時會讓對手陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dive: {
		name: "潛水",
		// Official flavor text: "使用後的第１回合潛入水中， 並於第２回合浮上來進行攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},

		prepare: "{POKEMON}潛入了水中！",
	},
	dizzypunch: {
		name: "迷昏拳",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	doodle: {
		name: "描繪",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	doomdesire: {
		name: "破滅之願",
		// Official flavor text: "使用招式的２回合後， 向對手發射無數道光束 進行攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}將破滅之願託付給了未來！",
		activate: "  {TARGET}受到了破滅之願的攻擊！",
	},
	doubleedge: {
		name: "捨身衝撞",
		// Official flavor text: "捨身衝撞對手進行攻擊。 自己也會受到不小的傷害。"
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
		name: "二連擊",
		// Official flavor text: "用尾巴等 向對手進行攻擊。 連續２次給予傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	doubleironbash: {
		name: "鋼拳雙擊",
		// Official flavor text: "以胸口的螺帽為軸心旋轉， 連續２次揮動手臂痛擊對手。 有時會使對手畏縮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	doublekick: {
		name: "二連踢",
		// Official flavor text: "用２隻腳踢飛對手進行攻擊。 連續２次給予傷害。"
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
		name: "電光雙擊",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		typeChange: "  {POKEMON}用盡了電力！",
	},
	doubleslap: {
		name: "連環巴掌",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		// Official flavor text: "利用快速移動 製造出分身擾亂對手， 提高自己的閃避率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dracometeor: {
		name: "流星群",
		// Official flavor text: "讓隕石從空中落下以攻擊對手。 使用後因為反作用力， 自己的特攻會大幅降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonascent: {
		name: "畫龍點睛",
		// Official flavor text: "從天空中急速下降攻擊對手。 自己的防禦和特防會降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		megaNoItem: "  {TRAINER}衷心的祈願傳遞到了{POKEMON}那裡！",
	},
	dragonbreath: {
		name: "龍息",
		// Official flavor text: "將強烈的氣息 吹向對手進行攻擊。 有時會讓對手陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragoncheer: {
		name: "龍聲鼓舞",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "#focusenergy",
	},
	dragonclaw: {
		name: "龍爪",
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragondance: {
		name: "龍之舞",
		// Official flavor text: "激烈地跳起神秘又強而有力的舞蹈。 提高自己的攻擊和速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragondarts: {
		name: "龍箭",
		// Official flavor text: "讓多龍梅西亞進行２次攻擊。 當對手場上有２隻寶可夢時， 則向牠們各進行１次攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonenergy: {
		name: "巨龍威能",
		// Official flavor text: "將生命力化為力量攻擊對手。 自己的ＨＰ越少，招式的威力越小。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonhammer: {
		name: "龍錘",
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonpulse: {
		name: "龍之波動",
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonrage: {
		name: "龍之怒",
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonrush: {
		name: "龍之俯衝",
		// Official flavor text: "釋放出駭人的殺氣， 威嚇並撞擊對手。 有時會使對手畏縮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	dragontail: {
		name: "龍尾",
		// Official flavor text: "彈飛對手， 強制讓後備寶可夢上場。 對手為野生寶可夢時，戰鬥將直接結束。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	drainingkiss: {
		name: "吸取之吻",
		// Official flavor text: "親吻對手來吸取對手的ＨＰ。 可以回復給予對手 傷害的一半以上的ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	drainpunch: {
		name: "吸取拳",
		// Official flavor text: "從拳頭吸取對手的力量。 可以回復給予對手 傷害的一半ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	dreameater: {
		name: "食夢",
		// Official flavor text: "吃掉熟睡中對手的夢 進行攻擊。可以回復給予對手 傷害的一半ＨＰ。"
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
		name: "啄鑽",
		shortDesc: null, // NEEDS TRANSLATION
	},
	drillrun: {
		name: "直衝鑽",
		// Official flavor text: "像鑽頭一樣旋轉身體， 猛烈地撞擊對手。 容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	drumbeating: {
		name: "鼓擊",
		// Official flavor text: "用打鼓來控制 鼓的根部進行攻擊， 進而降低對手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dualchop: {
		name: "二連劈",
		// Official flavor text: "用身體的堅硬部分攻擊對手。 連續２次給予傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dualwingbeat: {
		name: "雙翼",
		// Official flavor text: "用翅膀撞向對手進行攻擊。 連續２次給予傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dynamaxcannon: {
		name: "極巨炮",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	dynamicpunch: {
		name: "爆裂拳",
		// Official flavor text: "使出渾身力量出拳進行攻擊。 必定會使對手混亂。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	earthpower: {
		name: "大地之力",
		// Official flavor text: "向對手腳下 釋放出大地之力。 有時會降低對手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	earthquake: {
		name: "地震",
		// Official flavor text: "用地震的衝擊， 攻擊自己周圍所有的寶可夢。"
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
		name: "回聲",
		// Official flavor text: "用回聲攻擊對手。 每回合有寶可夢持續使用回聲時， 招式的威力會提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	eerieimpulse: {
		name: "怪異電波",
		// Official flavor text: "從身體發出怪異電波 影響對手， 大幅降低對手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	eeriespell: {
		name: "詭異咒語",
		// Official flavor text: "用強大的精神力量攻擊。 讓對手最近一次使用的招式 減少３ＰＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "#spite",
	},
	eggbomb: {
		name: "炸蛋",
		shortDesc: null, // NEEDS TRANSLATION
	},
	electricterrain: {
		name: "電氣場地",
		// Official flavor text: "在５回合內將腳下變成電氣場地。 地面上的寶可夢將不會陷入睡眠狀態。 電屬性招式的威力會提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	electrify: {
		name: "輸電",
		// Official flavor text: "如果在對手使用招式前輸電， 該回合對手的招式會變成電屬性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  因為輸電，{POKEMON}的招式變成了電屬性！",
	},
	electroball: {
		name: "電球",
		// Official flavor text: "用電球攻擊對手。 速度比對手快越多， 威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	electrodrift: {
		name: "閃電猛衝",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	electroshot: {
		name: "電光束",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		prepare: "{POKEMON}吸收了電力！",
	},
	electroweb: {
		name: "電網",
		// Official flavor text: "用電網捉住對手進行攻擊。 可降低對手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	embargo: {
		name: "查封",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}無法使用道具了！",
		end: "  {POKEMON}變得可以使用道具了！",
	},
	ember: {
		name: "火花",
		// Official flavor text: "向對手發射 小火焰進行攻擊。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	encore: {
		name: "再來一次",
		// Official flavor text: "要求對手再來一次， 讓對手連續３次 使出最近一次使用的招式。"
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

		start: "  {POKEMON}接受了再來一次！",
		end: "  {POKEMON}的再來一次狀態解除了！",
	},
	endeavor: {
		name: "蠻幹",
		// Official flavor text: "給予傷害， 使對手的ＨＰ變得 和自己的ＨＰ一樣。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	endure: {
		name: "挺住",
		// Official flavor text: "即使受到再強烈的攻擊， 也一定會剩下１ＨＰ。 連續使用時容易失敗。"
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

		start: "  {POKEMON}擺出了挺住攻擊的架勢！",
		activate: "  {POKEMON}挺住了攻擊！",
	},
	energyball: {
		name: "能量球",
		// Official flavor text: "發射從大自然匯聚而來的生命力量。 有時會降低對手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	entrainment: {
		name: "找夥伴",
		// Official flavor text: "用神奇的節奏跳舞。 讓對手模仿自己的動作， 變成和自己一樣的特性。"
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
		name: "噴火",
		// Official flavor text: "爆發怒火攻擊對手。 自己的ＨＰ越少， 招式的威力越小。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	esperwing: {
		name: "氣場之翼",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	eternabeam: {
		name: "無極光束",
		// Official flavor text: "無極汰那變回 本來樣子時的最強攻擊。 下一回合自己將無法動彈。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	expandingforce: {
		name: "廣域戰力",
		// Official flavor text: "用精神力量攻擊對手。 在精神場地時，威力會提高， 能給予所有對手傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	explosion: {
		name: "大爆炸",
		// Official flavor text: "引起大爆炸， 攻擊自己周圍所有的寶可夢。 使用後自己會陷入瀕死。"
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
		// Official flavor text: "發送看不見的 神奇力量進行攻擊。 有時會使對手畏縮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	extremeevoboost: {
		name: "九彩昇華齊聚頂",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	extremespeed: {
		name: "神速",
		// Official flavor text: "以迅雷不及掩耳之勢 猛撞向對手進行攻擊。 必定能夠發動先制攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	facade: {
		name: "硬撐",
		// Official flavor text: "當自己陷入中毒、麻痺、灼傷等 狀態時，向對手使用此招式， 威力會變成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	fairylock: {
		name: "妖精之鎖",
		// Official flavor text: "封鎖對戰場地， 下一回合所有的 寶可夢都無法逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  下回合無法逃走！",
	},
	fairywind: {
		name: "妖精之風",
		shortDesc: null, // NEEDS TRANSLATION
	},
	fakeout: {
		name: "擊掌奇襲",
		// Official flavor text: "利用先制攻擊使對手畏縮。 要在上場後立即使用才會成功。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	faketears: {
		name: "假哭",
		// Official flavor text: "裝哭掉眼淚。 讓對手不知所措， 大幅降低對手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	falsesurrender: {
		name: "假跪真撞",
		shortDesc: null, // NEEDS TRANSLATION
	},
	falseswipe: {
		name: "點到為止",
		// Official flavor text: "手下留情地攻擊對手， 一定會讓對手剩下１ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	featherdance: {
		name: "羽毛舞",
		// Official flavor text: "撒出羽毛， 纏住對手的身體。 大幅降低對手的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	feint: {
		name: "佯攻",
		// Official flavor text: "能夠攻擊使用了 守住或看穿的對手。 並解除對手的防守效果。"
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
		name: "出奇一擊",
		shortDesc: null, // NEEDS TRANSLATION
	},
	fellstinger: {
		name: "致命針刺",
		// Official flavor text: "使用此招式打倒對手時， 自己的攻擊會極大幅提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	ficklebeam: {
		name: "隨機光",
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}拿出全力了！",
	},
	fierydance: {
		name: "火之舞",
		// Official flavor text: "讓火焰圍繞全身後， 振翅攻擊對手。 有時會提高自己的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fierywrath: {
		name: "怒火中燒",
		// Official flavor text: "將憤怒化為火焰般的氣場進行攻擊。 有時會讓對手畏縮。"
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
		// Official flavor text: "捨身攻擊對手。 雖然自己會陷入瀕死，但能夠給予對手 和自己現有ＨＰ相同的傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fireblast: {
		name: "大字爆炎",
		// Official flavor text: "用大字形狀的火焰燒盡對手。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	firefang: {
		name: "火焰牙",
		// Official flavor text: "用纏繞火焰的牙齒咬住對手。 有時會讓對手畏縮 或陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	firelash: {
		name: "火焰鞭",
		// Official flavor text: "用燃燒的鞭子抽打對手。 受到攻擊的對手防禦會降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	firepledge: {
		name: "火之誓約",
		// Official flavor text: "用火柱進行攻擊。 和草之誓約同時使用時，威力會提高， 周圍會變成火海。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "#waterpledge",
		start: "  {TEAM}周圍被火海包圍了！",
		end: "  {TEAM}周圍的火海消失不見了！",
		damage: "  {POKEMON}受到了火海的傷害！",
	},
	firepunch: {
		name: "火焰拳",
		// Official flavor text: "用帶有火焰的拳頭 攻擊對手。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	firespin: {
		name: "火焰旋渦",
		// Official flavor text: "將對手困在 熊熊燃燒的火焰旋渦中， 在４～５回合內進行攻擊。"
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

		start: "  {POKEMON}被困在了火焰旋渦之中！",
		move: "#wrap",
	},
	firstimpression: {
		name: "迎頭一擊",
		// Official flavor text: "招式的威力雖高， 但只有在出場戰鬥時， 立刻使出才能成功。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	fishiousrend: {
		name: "鰓咬",
		// Official flavor text: "用堅硬的鰓咬住對手。 若在對手之前進行攻擊， 招式的威力會變成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fissure: {
		name: "地裂",
		// Official flavor text: "讓對手掉進地面的 裂縫中進行攻擊。 只要命中就會一擊瀕死。"
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
		// Official flavor text: "抓狂般亂打進行攻擊。 自己的ＨＰ越少， 招式的威力越大。"
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
		name: "烈焰濺射",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		damage: "  火花也飛濺到了{POKEMON}的身上！",
	},
	flamecharge: {
		name: "蓄能焰襲",
		// Official flavor text: "讓火焰圍繞全身後攻擊對手。 同時蓄積力量來提高自己的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flamethrower: {
		name: "噴射火焰",
		// Official flavor text: "向對手發射 強烈火焰進行攻擊。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flamewheel: {
		name: "火焰輪",
		// Official flavor text: "用火焰圍繞身體， 猛撞對手進行攻擊。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flareblitz: {
		name: "閃焰衝鋒",
		// Official flavor text: "將火焰圍繞全身後猛撞對手。 自己也會受到不小的傷害。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	flash: {
		name: "閃光",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flashcannon: {
		name: "加農光炮",
		// Official flavor text: "將身體的光芒 聚集在一個點後釋放出去。 有時會降低對手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flatter: {
		name: "吹捧",
		// Official flavor text: "吹捧對手，使其混亂。 同時還會提高對手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fleurcannon: {
		name: "花朵加農炮",
		// Official flavor text: "放出強力光束後， 自己的特攻會大幅降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fling: {
		name: "投擲",
		// Official flavor text: "快速投擲攜帶的道具進行攻擊。 招式威力和效果會隨著 道具不同而改變。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		removeItem: "  {POKEMON}投擲了{ITEM}！",
	},
	flipturn: {
		name: "快速折返",
		// Official flavor text: "攻擊後迅速返回， 和後備寶可夢進行替換。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		switchOut: "#uturn",
	},
	floatyfall: {
		name: "飄飄墜落",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	floralhealing: {
		name: "花療",
		// Official flavor text: "回復對手最大ＨＰ的一半。 在青草場地時，效果會提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flowershield: {
		name: "鮮花防守",
		// Official flavor text: "使用神奇的力量， 提高場上全體 草屬性寶可夢的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flowertrick: {
		name: "千變萬花",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fly: {
		name: "飛翔",
		// Official flavor text: "使用後的第１回合飛上天空， 並於第２回合攻擊對手。"
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

		prepare: "{POKEMON}飛向了高空！",
	},
	flyingpress: {
		name: "飛身重壓",
		// Official flavor text: "從空中俯衝向對手進行攻擊。 此招式同時具有 格鬥屬性和飛行屬性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	focusblast: {
		name: "真氣彈",
		// Official flavor text: "提高氣勢， 釋放全身所有力量。 有時會降低對手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	focusenergy: {
		name: "聚氣",
		// Official flavor text: "深呼吸後集中精神。 讓自己的攻擊 變得容易擊中要害。"
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

		start: "  {POKEMON}現在幹勁十足！",
		startFromItem: "  {POKEMON}使用了{ITEM}，變得幹勁十足！",
		startFromZEffect: "  因為Ｚ力量，{POKEMON}變得容易擊中要害了！",
	},
	focuspunch: {
		name: "真氣拳",
		// Official flavor text: "集中精神後出拳。 若出拳前受到攻擊， 則會失敗。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}聚精會神了起來！",
		cant: "{POKEMON}聚氣時受到干擾，無法使出招式！",
	},
	followme: {
		name: "看我嘛",
		// Official flavor text: "吸引對手的注意， 將對手的攻擊 全部轉移到自己身上。"
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

		start: "  {POKEMON}變得萬眾矚目了！",
		startFromZEffect: "  {POKEMON}變得萬眾矚目了！",
	},
	forcepalm: {
		name: "發勁",
		// Official flavor text: "向對手的身體 發出衝擊波進行攻擊。 有時會讓對手陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	foresight: {
		name: "識破",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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

		start: "  識破了{POKEMON}的原形！",
	},
	forestscurse: {
		name: "森林詛咒",
		// Official flavor text: "向對手施加森林詛咒。 中了詛咒的對手 會被追加草屬性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	foulplay: {
		name: "欺詐",
		// Official flavor text: "利用對手的力量進行攻擊。 對手的攻擊越高， 給予對手的傷害越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	freezedry: {
		name: "冷凍乾燥",
		// Official flavor text: "急速冷凍對手， 有時會讓對手陷入冰凍狀態。 對水屬性寶可夢也是效果絕佳。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	freezeshock: {
		name: "冰凍伏特",
		// Official flavor text: "製造出帶有電流的冰塊， 在下一回合攻擊對手。 有時會讓對手陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		prepare: "  {POKEMON}被冷光包圍了！",
	},
	freezingglare: {
		name: "冰冷視線",
		// Official flavor text: "從雙眼釋放出精神力量進行攻擊。 有時會讓對手陷入冰凍狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	freezyfrost: {
		name: "冰冰霜凍",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	frenzyplant: {
		name: "瘋狂植物",
		// Official flavor text: "將大大的樹木 甩向對手進行攻擊。 下一回合自己將無法動彈。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	frostbreath: {
		name: "冰息",
		// Official flavor text: "將冰冷的氣息 吹向對手進行攻擊。 必定會擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	frustration: {
		name: "遷怒",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	furyattack: {
		name: "亂擊",
		// Official flavor text: "用角或喙 刺向對手進行攻擊。 連續攻擊２～５次。"
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
		name: "連斬",
		// Official flavor text: "用鐮刀或爪子等 斬切對手進行攻擊。 連續命中時威力會提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	furyswipes: {
		name: "亂抓",
		// Official flavor text: "用爪子或鐮刀等 向對手進行攻擊。 可連續攻擊２～５次。"
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
		name: "交錯閃電",
		// Official flavor text: "放出巨大的閃電攻擊對手。 受到巨大的火焰影響時， 招式的威力會提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fusionflare: {
		name: "交錯火焰",
		// Official flavor text: "放出巨大的火焰攻擊對手。 受到巨大的閃電影響時， 招式的威力會提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	futuresight: {
		name: "預知未來",
		// Official flavor text: "使用招式的２回合後， 向對手發送一團念力進行攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}預知了未來的攻擊！",
		activate: "  {TARGET}受到了預知未來的攻擊！",
	},
	gastroacid: {
		name: "胃液",
		// Official flavor text: "將胃液吐向對手的身體。 沾到的胃液會消除 對手的特性效果。"
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

		start: "  {POKEMON}的特性變得無效了！",
	},
	geargrind: {
		name: "齒輪飛盤",
		// Official flavor text: "向對手投擲 鋼鐵齒輪進行攻擊。 連續２次給予傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gearup: {
		name: "輔助齒輪",
		// Official flavor text: "藉由啟動齒輪， 提高特性為正電和負電的 寶可夢的攻擊和特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	genesissupernova: {
		name: "起源超新星大爆炸",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	geomancy: {
		name: "大地掌控",
		// Official flavor text: "使用後的第１回合吸收能量， 並於第２回合大幅提高 自己的特攻、特防和速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		prepare: "{POKEMON}正在積蓄力量！",
	},
	gigadrain: {
		name: "終極吸取",
		// Official flavor text: "吸取對手的養分進行攻擊。 可以回復給予對手 傷害的一半ＨＰ。"
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
		name: "終極衝擊",
		// Official flavor text: "使出全身上下所有力量突擊對手。 下一回合自己將無法動彈。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gigatonhammer: {
		name: "巨力錘",
		shortDesc: null, // NEEDS TRANSLATION
	},
	gigavolthavoc: {
		name: "終極伏特狂雷閃",
		shortDesc: null, // NEEDS TRANSLATION
	},
	glaciallance: {
		name: "雪矛",
		// Official flavor text: "向對手投擲 捲著暴風雪的冰矛進行攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	glaciate: {
		name: "冰封世界",
		// Official flavor text: "放出冰凍的寒氣 向對手進行攻擊。 可降低對手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	glaiverush: {
		name: "巨劍突擊",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	glare: {
		name: "大蛇瞪眼",
		// Official flavor text: "用腹部的花紋使對手心生恐懼， 讓對手陷入麻痺狀態。"
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
		name: "嘩嘩氣場",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxbefuddle: {
		name: "超極巨蝶影蠱惑",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxcannonade: {
		name: "超極巨水砲轟滅",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {PARTY}被水流包圍了！",
		damage: "  {POKEMON}被吞沒在超極巨水砲轟滅的水流裡，痛苦難耐！",
	},
	gmaxcentiferno: {
		name: "超極巨百火焚野",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxchistrike: {
		name: "超極巨會心一擊",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "#focusenergy",
	},
	gmaxcuddle: {
		name: "超極巨熱情擁抱",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxdepletion: {
		name: "超極巨劣化衰變",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {TARGET}的PP減少了！",
	},
	gmaxdrumsolo: {
		name: "超極巨狂擂亂打",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxfinale: {
		name: "超極巨幸福圓滿",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxfireball: {
		name: "超極巨破陣火球",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxfoamburst: {
		name: "超極巨激漩泡渦",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxgoldrush: {
		name: "超極巨特大金幣",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxgravitas: {
		name: "超極巨天道七星",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxhydrosnipe: {
		name: "超極巨狙擊神射",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxmalodor: {
		name: "超極巨臭氣沖天",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxmeltdown: {
		name: "超極巨液金熔擊",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxoneblow: {
		name: "超極巨奪命一擊",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxrapidflow: {
		name: "超極巨流水連擊",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxreplenish: {
		name: "超極巨資源再生",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxresonance: {
		name: "超極巨極光旋律",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxsandblast: {
		name: "超極巨沙塵漫天",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxsmite: {
		name: "超極巨天譴雷誅",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxsnooze: {
		name: "超極巨睡魔降臨",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxsteelsurge: {
		name: "超極巨鋼鐵陣法",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {PARTY}周圍開始浮現出尖銳的鋼刺！",
		end: "  {PARTY}周圍的鋼刺消失了！",
		damage: "  尖銳的鋼刺扎進了{POKEMON}體內！",
	},
	gmaxstonesurge: {
		name: "超極巨岩陣以待",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxstunshock: {
		name: "超極巨異毒電場",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxsweetness: {
		name: "超極巨瓊漿玉液",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxtartness: {
		name: "超極巨酸不溜丟",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxterror: {
		name: "超極巨幻影幽魂",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxvinelash: {
		name: "超極巨灰飛鞭滅",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {PARTY}被鞭子的猛擊包圍了！",
		damage: "  {POKEMON}被暴露在超極巨灰飛鞭滅的猛擊下，疼痛不堪！",
	},
	gmaxvolcalith: {
		name: "超極巨炎石噴發",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {PARTY}被岩石包圍了！",
		damage: "  {POKEMON}被困在超極巨炎石噴發的岩石裡，疼痛不堪！",
	},
	gmaxvoltcrash: {
		name: "超極巨萬雷轟頂",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gmaxwildfire: {
		name: "超極巨地獄滅焰",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {PARTY}被火焰包圍了！",
		damage: "  {POKEMON}被超極巨地獄滅焰的火焰包圍，熾熱難耐！",
	},
	gmaxwindrage: {
		name: "超極巨旋風襲捲",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	grassknot: {
		name: "打草結",
		// Official flavor text: "用打結的草絆倒對手。 對手越重，威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	grasspledge: {
		name: "草之誓約",
		// Official flavor text: "用草柱進行攻擊。 和水之誓約同時使用時，威力會提高， 周圍會變成濕地。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "#waterpledge",
		start: "  在{TEAM}周圍開展出了濕地！",
		end: "  {TEAM}周圍的濕地消失不見了！",
	},
	grasswhistle: {
		name: "草笛",
		shortDesc: null, // NEEDS TRANSLATION
	},
	grassyglide: {
		name: "青草滑梯",
		// Official flavor text: "在地面上滑行般地攻擊對手。 在青草場地時， 必定能夠發動先制攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	grassyterrain: {
		name: "青草場地",
		// Official flavor text: "在５回合內將腳下變成青草場地。 地面上的寶可夢每回合都會回復ＨＰ。 草屬性招式的威力會提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	gravapple: {
		name: "萬有引力",
		// Official flavor text: "讓蘋果從高處落下， 給予對手傷害。 可降低對手的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gravity: {
		name: "重力",
		// Official flavor text: "在５回合內，飄浮特性和飛行屬性的 寶可夢會被地面屬性的招式擊中。 且無法使用飛向空中的招式。"
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
		name: "叫聲",
		// Official flavor text: "發出可愛的叫聲， 誘使對手疏忽大意， 降低對手的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	growth: {
		name: "生長",
		// Official flavor text: "讓身體瞬間長大， 提高自己的攻擊和特攻。"
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
		// Official flavor text: "因為對手的招式而陷入瀕死時， 施加怨念， 讓該招式的ＰＰ變成０。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  因為怨念，{POKEMON}失去了{MOVE}的所有ＰＰ！",
		start: "{POKEMON}想向對手施放怨念！",
	},
	guardianofalola: {
		name: "巨人衛士・阿羅拉",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	guardsplit: {
		name: "防守平分",
		// Official flavor text: "用超能力將自己和對手的 防禦和特防各別相加後， 再進行平分。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}平分了各自的防守！",
	},
	guardswap: {
		name: "防守互換",
		// Official flavor text: "用超能力將自己和對手的 防禦與特防的能力變化互相交換。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	guillotine: {
		name: "斷頭鉗",
		// Official flavor text: "用巨大的鉗子或剪刀等 撕裂對手進行攻擊。 只要命中就會一擊瀕死。"
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
		name: "垃圾射擊",
		// Official flavor text: "將骯髒的垃圾 丟向對手進行攻擊。 有時會讓對手陷入中毒狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gust: {
		name: "起風",
		// Official flavor text: "用翅膀刮起狂風， 吹向對手進行攻擊。"
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
		// Official flavor text: "高速旋轉身體，撞擊對手。 速度比對手越慢，威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	hail: {
		name: "冰雹",
		// Official flavor text: "降下冰雹，在５回合內 場上除了冰屬性以外的寶可夢 都會受到傷害。"
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
		name: "臂錘",
		// Official flavor text: "揮出強力而沉重的拳頭， 給予對手傷害。 自己的速度會降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	happyhour: {
		name: "歡樂時光",
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  大家被歡樂的氣氛包圍了！",
	},
	harden: {
		name: "變硬",
		// Official flavor text: "使用全身的力量讓身體硬化， 提高自己的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hardpress: {
		name: "硬壓",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	haze: {
		name: "黑霧",
		// Official flavor text: "放出黑霧，讓場上全體寶可夢的 能力變化回到初始狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		// Only used in Gen 1
		activate: "  所有能力都復原了！",
	},
	headbutt: {
		name: "頭錘",
		// Official flavor text: "將頭伸出， 直直衝向對手進行攻擊。 有時會讓對手畏縮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	headcharge: {
		name: "爆炸頭突擊",
		// Official flavor text: "用帥氣的爆炸頭 猛撞對手進行攻擊。 自己也會受到少許傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	headlongrush: {
		name: "突飛猛撲",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	headsmash: {
		name: "雙刃頭錘",
		// Official flavor text: "使出渾身力量， 捨身向對手進行頭錘攻擊。 自己也會受到非常大的傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	healbell: {
		name: "治癒鈴聲",
		// Official flavor text: "發出悅耳的鈴聲， 治癒我方全體的異常狀態。"
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

		activate: "  鈴聲響徹四周！",
	},
	healblock: {
		name: "回復封鎖",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			end: "  {POKEMON}的回復封鎖效果消失了！",
			cant: "{POKEMON}因回復封鎖而無法使出{MOVE}！",
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

		start: "  {POKEMON}的回復行為被封住了！",
		end: "  {POKEMON}的回復封鎖效果消失了！",
		cant: "{POKEMON}因回復封鎖而無法使出{MOVE}！",
		fail: "  但是，對{POKEMON}沒有效果！",
	},
	healingwish: {
		name: "治癒之願",
		// Official flavor text: "雖然自己會陷入瀕死， 但可以治癒接替上場的 寶可夢的異常狀態並回復ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		heal: "  治癒之願在{POKEMON}身上實現了！",
	},
	healorder: {
		name: "回復指令",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	healpulse: {
		name: "治癒波動",
		// Official flavor text: "釋放出治癒波動， 讓對手回復 最大ＨＰ的一半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	heartstamp: {
		name: "愛心印章",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	heartswap: {
		name: "心靈互換",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	heatcrash: {
		name: "高溫重壓",
		// Official flavor text: "用燃燒的身體重壓對手 進行攻擊。體重比對手 重越多，威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	heatwave: {
		name: "熱風",
		// Official flavor text: "將炎熱的氣息 吹向對手進行攻擊。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	heavyslam: {
		name: "重磅衝撞",
		// Official flavor text: "用沉重的身體衝撞對手進行攻擊。 體重比對手重越多，威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	helpinghand: {
		name: "幫助",
		// Official flavor text: "幫助夥伴。 被幫助的寶可夢， 招式的威力會比原來更大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {SOURCE}擺出了幫助{POKEMON}的架勢！",
	},
	hex: {
		name: "禍不單行",
		// Official flavor text: "接二連三地向對手進行攻擊。 攻擊陷入異常狀態的對手時， 能給予較大的傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hiddenpower: {
		name: "覺醒力量",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "十萬馬力",
		shortDesc: null, // NEEDS TRANSLATION
	},
	highjumpkick: {
		name: "飛膝踢",
		// Official flavor text: "跳起後用膝蓋踢擊對手。 沒踢中對手時自己會受到傷害。"
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
		// Official flavor text: "在攻擊的時候手下留情， 讓對手的ＨＰ一定會剩下１。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	holdhands: {
		name: "牽手",
		// Official flavor text: "我方的寶可夢手牽手。 心情會變得非常幸福。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	honeclaws: {
		name: "磨爪",
		// Official flavor text: "將爪子磨得更加鋒利。 可提高自己的攻擊和命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hornattack: {
		name: "角撞",
		shortDesc: null, // NEEDS TRANSLATION
	},
	horndrill: {
		name: "角鑽",
		// Official flavor text: "用旋轉的角 刺進對手進行攻擊。 只要命中就會一擊瀕死。"
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
		// Official flavor text: "將角刺進對手，吸取養分。 可以回復給予對手 傷害的一半ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	howl: {
		name: "長嚎",
		// Official flavor text: "大聲地吼叫提升氣勢， 提高自己和同伴的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	hurricane: {
		name: "暴風",
		// Official flavor text: "用強烈的風席捲 對手進行攻擊。 有時會使對手混亂。"
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
		name: "加農水炮",
		// Official flavor text: "向對手發射水炮進行攻擊。 下一回合自己將無法動彈。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hydropump: {
		name: "水炮",
		shortDesc: null, // NEEDS TRANSLATION
	},
	hydrosteam: {
		name: "水蒸氣",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hydrovortex: {
		name: "超級水流大漩渦",
		shortDesc: null, // NEEDS TRANSLATION
	},
	hyperbeam: {
		name: "破壞光線",
		// Official flavor text: "向對手發射 強烈的光線進行攻擊。 下一回合自己將無法動彈。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	hyperdrill: {
		name: "強力鑽",
		shortDesc: null, // NEEDS TRANSLATION
	},
	hyperfang: {
		name: "必殺門牙",
		// Official flavor text: "用銳利的門牙 牢牢咬住對手進行攻擊。 有時會使對手畏縮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hyperspacefury: {
		name: "異次元猛攻",
		// Official flavor text: "使用許多手臂，發動可 不顧守住和看穿的連續攻擊。 自己的防禦會降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "#shadowforce",
		fail: "#darkvoid",
	},
	hyperspacehole: {
		name: "異次元洞",
		// Official flavor text: "利用異次元洞， 突然出現在對手的側面進行攻擊。 可避開對手的守住和看穿等招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "#shadowforce",
	},
	hypervoice: {
		name: "巨聲",
		// Official flavor text: "製造出震耳欲聾的 巨大聲波攻擊對手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hypnosis: {
		name: "催眠術",
		shortDesc: null, // NEEDS TRANSLATION
	},
	iceball: {
		name: "冰球",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "冰凍光束",
		// Official flavor text: "向對手發射 冰凍光束進行攻擊。 有時會讓對手陷入冰凍狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	iceburn: {
		name: "極寒冷焰",
		// Official flavor text: "在使用後的下一回合， 用能夠凍結一切的強烈寒氣包圍對手。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		prepare: "  {POKEMON}被冰凍的空氣包圍了！",
	},
	icefang: {
		name: "冰凍牙",
		// Official flavor text: "用帶有寒氣的牙齒咬住對手。 有時會讓對手畏縮 或陷入冰凍狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	icehammer: {
		name: "冰錘",
		// Official flavor text: "揮出強力而沉重的拳頭， 給予對手傷害。 自己的速度會降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	icepunch: {
		name: "冰凍拳",
		// Official flavor text: "用帶有寒氣的拳頭 攻擊對手。 有時會讓對手陷入冰凍狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	iceshard: {
		name: "冰礫",
		// Official flavor text: "將瞬間製造出的冰塊 快速地扔向對手。 必定能夠發動先制攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	icespinner: {
		name: "冰旋",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	iciclecrash: {
		name: "冰柱墜擊",
		// Official flavor text: "將巨大冰柱猛烈地 砸向對手進行攻擊。 有時會使對手畏縮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	iciclespear: {
		name: "冰錐",
		// Official flavor text: "向對手發射 尖銳的冰柱進行攻擊。 可連續攻擊２～５次。"
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
		name: "冰凍之風",
		// Official flavor text: "將冰冷的寒氣 吹向對手進行攻擊。 可降低對手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	imprison: {
		name: "封印",
		// Official flavor text: "如果對手也學會了和自己 相同的招式，則對手將 不能使用該招式。"
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

		start: "  {POKEMON}封印了對手的招式！",
		cant: "{POKEMON}因封印而無法使出{MOVE}！",
	},
	incinerate: {
		name: "燒盡",
		// Official flavor text: "用火焰攻擊對手。 能夠燒掉對手攜帶的樹果等道具， 讓對手無法使用。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		removeItem: "  {POKEMON}的{ITEM}被燒掉了！",
	},
	infernalparade: {
		name: "群魔亂舞",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	inferno: {
		name: "煉獄",
		// Official flavor text: "用猛烈的火焰 包圍對手進行攻擊。 能讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	infernooverdrive: {
		name: "超強極限爆焰彈",
		shortDesc: null, // NEEDS TRANSLATION
	},
	infestation: {
		name: "死纏爛打",
		// Official flavor text: "在４～５回合內 死纏爛打地進行攻擊。 在此期間對手將無法逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}受到了{SOURCE}的死纏爛打！",
	},
	ingrain: {
		name: "扎根",
		// Official flavor text: "在大地上扎根， 每回合會回復自己的ＨＰ。 但扎根之後無法進行替換。"
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
		block: "  {POKEMON}扎下了根，屹立不動！",
		heal: "  {POKEMON}從根部吸取了養分！",
	},
	instruct: {
		name: "號令",
		// Official flavor text: "對手使出招式之後， 能夠透過指令讓對手 再次使出相同招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  根據{POKEMON}的指示，{TARGET}使出了招式！",
	},
	iondeluge: {
		name: "等離子浴",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  等離子雨傾盆而下！",
	},
	irondefense: {
		name: "鐵壁",
		// Official flavor text: "將皮膚變得堅硬如鐵， 大幅提高自己的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	ironhead: {
		name: "鐵頭",
		// Official flavor text: "用如同鋼鐵般 堅硬的頭部進行攻擊。 有時會讓對手畏縮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	irontail: {
		name: "鐵尾",
		// Official flavor text: "將堅硬的尾巴 甩向對手進行攻擊。 有時會降低對手的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	ivycudgel: {
		name: "棘藤棒",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	jawlock: {
		name: "緊咬不放",
		// Official flavor text: "使攻擊對象及自己在陷入瀕死前 都無法進行替換。當兩隻寶可夢 其中一方退場時，效果就會消失。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	jetpunch: {
		name: "噴射拳",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	judgment: {
		name: "制裁光礫",
		// Official flavor text: "向對手放出無數的光彈。 招式的屬性會隨著自己 攜帶的石板不同而改變。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	jumpkick: {
		name: "飛踢",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "叢林治療",
		// Official flavor text: "和叢林化為一體， 回復自己和場上同伴的ＨＰ和狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	karatechop: {
		name: "空手劈",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	kinesis: {
		name: "折彎湯匙",
		// Official flavor text: "折彎湯匙引起注意， 降低對手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	kingsshield: {
		name: "王者盾牌",
		// Official flavor text: "防住對手攻擊的同時， 使自己變為防禦姿態。 降低接觸到的對手的攻擊。"
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
		// Official flavor text: "拍落對手的持有物， 讓對手在戰鬥結束前都無法使用。 對手有攜帶物品時，傷害會增加。"
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
		name: "仆斬",
		shortDesc: null, // NEEDS TRANSLATION
	},
	landswrath: {
		name: "大地神力",
		// Official flavor text: "聚集大地的能量後， 將力量集中攻擊對手給予傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	laserfocus: {
		name: "磨礪",
		// Official flavor text: "集中精神， 下次攻擊必定會擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}集中了精神！",
	},
	lashout: {
		name: "洩憤",
		// Official flavor text: "將惱怒砸向對手進行攻擊。 如果此回合已被降低能力， 招式威力就會變成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lastresort: {
		name: "珍藏",
		// Official flavor text: "在戰鬥中將其他已學會的招式 全部使用過後， 才能夠使出的珍藏招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lastrespects: {
		name: "掃墓",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lavaplume: {
		name: "噴煙",
		// Official flavor text: "用熊熊烈火 攻擊自己周圍所有的寶可夢。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	leafage: {
		name: "樹葉",
		shortDesc: null, // NEEDS TRANSLATION
	},
	leafblade: {
		name: "葉刃",
		// Official flavor text: "如用劍般操控葉子 切斬對手進行攻擊。 容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	leafstorm: {
		name: "飛葉風暴",
		// Official flavor text: "用尖銳的葉子捲起風暴向對手進行攻擊。 使用後因為反作用力， 自己的特攻會大幅降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	leaftornado: {
		name: "青草攪拌器",
		// Official flavor text: "用銳利的葉子包圍住 對手進行攻擊。 有時會降低對手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	leechlife: {
		name: "吸血",
		// Official flavor text: "吸取對手的血液進行攻擊。 可以回復給予對手 傷害的一半ＨＰ。"
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
		name: "寄生種子",
		// Official flavor text: "在對手身上植入種子， 每回合吸取對手少許的ＨＰ， 用來回復自己的ＨＰ。"
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

		start: "  將種子種植在了{POKEMON}身上！",
		end: "  {POKEMON}擺脫了寄生種子的束縛！",
		damage: "  寄生植物奪取了{POKEMON}的體力！",
	},
	leer: {
		name: "瞪眼",
		// Official flavor text: "用犀利的眼神使對手害怕， 降低對手的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	letssnuggleforever: {
		name: "親密無間大亂揍",
		shortDesc: null, // NEEDS TRANSLATION
	},
	lick: {
		name: "舌舔",
		// Official flavor text: "用長長的舌頭， 舔遍對手進行攻擊。 有時會讓對手陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lifedew: {
		name: "生命水滴",
		// Official flavor text: "灑出神奇之水， 回復自己和場上同伴的ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lightofruin: {
		name: "破滅之光",
		// Official flavor text: "借用永恆之花的力量， 發射出強力光線。 自己也會受到不小的傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lightscreen: {
		name: "光牆",
		// Official flavor text: "利用神奇的屏障， 在５回合內減輕 來自對手的特殊攻擊傷害。"
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

		start: "  光牆使{TEAM}的特殊抗性提高了！",
		end: "  {TEAM}的光牆消失了！",
	},
	lightthatburnsthesky: {
		name: "焚天滅世熾光爆",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	liquidation: {
		name: "水流裂破",
		// Official flavor text: "用水之力量撞向對手進行攻擊。 有時會降低對手的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lockon: {
		name: "鎖定",
		// Official flavor text: "精確地瞄準， 下次攻擊時一定 會命中對手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {SOURCE}將目標對準了{POKEMON}！",
	},
	lovelykiss: {
		name: "惡魔之吻",
		shortDesc: null, // NEEDS TRANSLATION
	},
	lowkick: {
		name: "踢倒",
		// Official flavor text: "用力踢對手的腳， 讓對手摔倒進行攻擊。 對手越重，威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	lowsweep: {
		name: "下盤踢",
		// Official flavor text: "瞄準對手的腳， 以敏捷的動作進行攻擊。 可降低對手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	luckychant: {
		name: "幸運咒語",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  因幸運咒語的力量，{TEAM}的要害被隱藏了起來！",
		end: "  {TEAM}的幸運咒語解除了！",
	},
	luminacrash: {
		name: "琉光衝激",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lunarblessing: {
		name: "新月祈禱",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lunardance: {
		name: "新月舞",
		// Official flavor text: "雖然自己會陷入瀕死， 但可以讓接替上場的 寶可夢回復到萬全狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		heal: "  {POKEMON}被神秘的月光包圍了！",
	},
	lunge: {
		name: "猛撲",
		// Official flavor text: "全力猛撲對手進行攻擊。 進而降低對手的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lusterpurge: {
		name: "潔淨光芒",
		// Official flavor text: "放出耀眼的光芒進行攻擊。 有時會降低對手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	machpunch: {
		name: "音速拳",
		// Official flavor text: "以迅雷不及掩耳之勢出拳。 必定能夠發動先制攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	magicalleaf: {
		name: "魔法葉",
		shortDesc: null, // NEEDS TRANSLATION
	},
	magicaltorque: {
		name: "魔法暴衝",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	magiccoat: {
		name: "魔法反射",
		// Official flavor text: "若對手使用寄生種子或 其他會讓寶可夢陷入異常狀態的招式時， 可將對手的招式反彈回去。"
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

		start: "  {POKEMON}獲得了魔法反射的效果！",
		move: "{POKEMON}將{MOVE}反射了回去！",
	},
	magicpowder: {
		name: "魔法粉",
		// Official flavor text: "撒出魔法粉末， 使對手變為超能力屬性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	magicroom: {
		name: "魔法空間",
		// Official flavor text: "創造出非常不可思議的空間。 在５回合內，所有寶可夢 攜帶的道具都會失去效果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	magmastorm: {
		name: "熔岩風暴",
		// Official flavor text: "將對手困在 熊熊燃燒的火焰中， 在４～５回合內進行攻擊。"
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

		start: "  {POKEMON}被困在了熔岩旋渦之中！",
	},
	magnetbomb: {
		name: "磁鐵炸彈",
		shortDesc: null, // NEEDS TRANSLATION
	},
	magneticflux: {
		name: "磁場操控",
		// Official flavor text: "操控磁場， 提高特性是正電和負電的 寶可夢的防禦和特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	magnetrise: {
		name: "電磁飄浮",
		// Official flavor text: "利用電氣產生的磁力浮在空中。 在５回合內可以飄浮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}因電磁力浮了起來！",
		end: "  {POKEMON}的電磁力消失了！",
	},
	magnitude: {
		name: "震級",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  震級{NUMBER}！",
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
		name: "極惡飛躍粉碎擊",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	malignantchain: {
		name: "邪毒鎖鏈",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	matblock: {
		name: "掀榻榻米",
		// Official flavor text: "將掀起來的榻榻米當作盾牌， 防禦住攻擊我方的攻擊招式。 但無法防禦住變化招式的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}正在伺機使出掀榻榻米！",
		block: "  {MOVE}被掀榻榻米防禦住了！",
	},
	matchagotcha: {
		name: "刷刷茶炮",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxairstream: {
		name: "極巨飛衝",
		// Official flavor text: "極巨化寶可夢 所使出的飛行屬性攻擊。 可提高我方的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxdarkness: {
		name: "極巨惡霸",
		// Official flavor text: "極巨化寶可夢 所使出的惡屬性攻擊。 可降低對手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxflare: {
		name: "極巨火爆",
		// Official flavor text: "極巨化寶可夢 所使出的火屬性攻擊。 可在５回合內讓日照增強。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxflutterby: {
		name: "極巨蟲蠱",
		// Official flavor text: "極巨化寶可夢 所使出的蟲屬性攻擊。 可降低對手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxgeyser: {
		name: "極巨水流",
		// Official flavor text: "極巨化寶可夢 所使出的水屬性攻擊。 在５回合內會降下大雨。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxguard: {
		name: "極巨防壁",
		// Official flavor text: "完全防住對手的所有攻擊。 連續使用時容易失敗。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}在攻擊中守護住了自己！",
	},
	maxhailstorm: {
		name: "極巨寒冰",
		// Official flavor text: "極巨化寶可夢 所使出的冰屬性攻擊。 在５回合內會降下冰雹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxknuckle: {
		name: "極巨拳鬥",
		// Official flavor text: "極巨化寶可夢 所使出的格鬥屬性攻擊。 可提高我方的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxlightning: {
		name: "極巨閃電",
		// Official flavor text: "極巨化寶可夢 所使出的電屬性攻擊。 可在５回合內將腳下變成電氣場地。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxmindstorm: {
		name: "極巨超能",
		// Official flavor text: "極巨化寶可夢 所使出的超能力屬性攻擊。 可在５回合內將腳下變成精神場地。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxooze: {
		name: "極巨酸毒",
		// Official flavor text: "極巨化寶可夢 所使出的毒屬性攻擊。 可提高我方的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxovergrowth: {
		name: "極巨草原",
		// Official flavor text: "極巨化寶可夢 所使出的草屬性攻擊。 可在５回合內將腳下變成青草場地。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxphantasm: {
		name: "極巨幽魂",
		// Official flavor text: "極巨化寶可夢 所使出的幽靈屬性攻擊。 可降低對手的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxquake: {
		name: "極巨大地",
		// Official flavor text: "極巨化寶可夢 所使出的地面屬性攻擊。 可提高我方的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxrockfall: {
		name: "極巨岩石",
		// Official flavor text: "極巨化寶可夢 所使出的岩石屬性攻擊。 在５回合內會捲起沙暴。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxstarfall: {
		name: "極巨妖精",
		// Official flavor text: "極巨化寶可夢 所使出的妖精屬性攻擊。 可在５回合內將腳下變成薄霧場地。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxsteelspike: {
		name: "極巨鋼鐵",
		// Official flavor text: "極巨化寶可夢 所使出的鋼屬性攻擊。 可提高我方的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxstrike: {
		name: "極巨攻擊",
		// Official flavor text: "極巨化寶可夢 所使出的一般屬性攻擊。 可降低對手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	maxwyrmwind: {
		name: "極巨龍騎",
		// Official flavor text: "極巨化寶可夢 所使出的龍屬性攻擊。 可降低對手的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	meanlook: {
		name: "黑色目光",
		// Official flavor text: "用漆黑深邃的眼神 一動也不動地凝視對手， 讓對手無法從戰鬥中逃走。"
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
		name: "瑜伽姿勢",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mefirst: {
		name: "搶先一步",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "超級吸取",
		// Official flavor text: "吸取對手的養分進行攻擊。 可以回復給予對手 傷害的一半ＨＰ。"
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
		name: "超級角擊",
		shortDesc: null, // NEEDS TRANSLATION
	},
	megakick: {
		name: "百萬噸重踢",
		shortDesc: null, // NEEDS TRANSLATION
	},
	megapunch: {
		name: "百萬噸重拳",
		shortDesc: null, // NEEDS TRANSLATION
	},
	memento: {
		name: "臨別禮物",
		// Official flavor text: "雖然自己會陷入瀕死， 但可以大幅降低 對手的攻擊和特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},

		heal: "  因為Ｚ力量，{POKEMON}的體力回復了！",
	},
	menacingmoonrazemaelstrom: {
		name: "月華飛濺落靈霄",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	metalburst: {
		name: "金屬爆炸",
		// Official flavor text: "將發動攻擊前 最後受到的招式傷害放大， 向對手進行反擊。"
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
		name: "金屬爪",
		// Official flavor text: "用鋼鐵之爪 撕裂對手進行攻擊。 有時會提高自己的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	metalsound: {
		name: "金屬音",
		// Official flavor text: "讓對手聽如同金屬摩擦般 的刺耳聲。 大幅降低對手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	meteorassault: {
		name: "流星突擊",
		// Official flavor text: "揮舞粗壯的莖進行攻擊。 但同時自己也會站不穩， 下一回合將無法動彈。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	meteorbeam: {
		name: "流星光束",
		// Official flavor text: "使用後的第１回合會聚集 宇宙的力量來提高特攻， 並於第２回合攻擊對手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		prepare: "{POKEMON}湧起了宇宙的力量！",
	},
	meteormash: {
		name: "彗星拳",
		// Official flavor text: "使出如同彗星般的拳頭攻擊對手。 有時會提高自己的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	metronome: {
		name: "揮指",
		// Official flavor text: "揮動手指刺激自己的大腦， 從全部的招式中 隨機選出１招使出。"
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

		move: "揮動手指後，使出了{MOVE}！",
	},
	mightycleave: {
		name: "強刃攻擊",
		shortDesc: null, // NEEDS TRANSLATION
	},
	milkdrink: {
		name: "喝牛奶",
		// Official flavor text: "回復自己最大ＨＰ的一半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	mimic: {
		name: "模仿",
		// Official flavor text: "在戰鬥期間， 將對手最近一次使用的招式 變成自己的招式。"
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

		start: "  {POKEMON}學會了{MOVE}！",
	},
	mindblown: {
		name: "驚爆大頭",
		// Official flavor text: "會讓自己的頭爆炸， 來攻擊周遭的一切。 自己也會受到傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		damage: null, // NEEDS TRANSLATION
	},
	mindreader: {
		name: "心之眼",
		// Official flavor text: "用心感受對手的行動模式， 下次攻擊時必定 會命中對手。"
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
		name: "變小",
		// Official flavor text: "蜷縮身體使自己顯得很小， 大幅提高 自己的閃避率。"
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
		name: "奇跡之眼",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "#foresight",
	},
	mirrorcoat: {
		name: "鏡面反射",
		// Official flavor text: "將來自對手的特殊攻擊傷害加倍後， 返還給該對手。"
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
		name: "鸚鵡學舌",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "鏡光射擊",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mist: {
		name: "白霧",
		// Official flavor text: "用白霧覆蓋身體。 在５回合內不會讓對手 降低自己的能力。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
			start: null, // NEEDS TRANSLATION
			block: "  {POKEMON}正受到白霧的保護！",
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			start: null, // NEEDS TRANSLATION
			block: "  但是，沒有效果！！",
		},

		start: "  {TEAM}被白霧包圍了！",
		end: "  包圍{TEAM}的白霧消失了！",
		block: "  {POKEMON}正受到白霧的保護！",
	},
	mistball: {
		name: "薄霧球",
		// Official flavor text: "將霧狀的羽毛聚集成團進行攻擊。 有時會降低對手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mistyexplosion: {
		name: "薄霧炸裂",
		// Official flavor text: "對自己周圍的所有寶可夢進行攻擊， 但使出後，自己會陷入瀕死。 在薄霧場地時，招式威力會提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mistyterrain: {
		name: "薄霧場地",
		// Official flavor text: "在５回合內， 地面上的寶可夢不會陷入異常狀態。 龍屬性招式的傷害也會減半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	moonblast: {
		name: "月亮之力",
		// Official flavor text: "借用月亮的力量攻擊對手。 有時會降低對手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	moongeistbeam: {
		name: "暗影之光",
		// Official flavor text: "放出奇怪的光線攻擊對手。 可不顧對手的特性進行攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	moonlight: {
		name: "月光",
		// Official flavor text: "回復自己的ＨＰ。 回復量會隨著天氣的不同 而有所變化。"
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
		// Official flavor text: "回復自己的ＨＰ。 回復量會隨著天氣的不同 而有所變化。"
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
		name: "晶光轉轉",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mountaingale: {
		name: "冰山風",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mudbomb: {
		name: "泥巴炸彈",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	muddywater: {
		name: "濁流",
		// Official flavor text: "用渾濁的污水攻擊對手。 有時會降低對手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mudshot: {
		name: "泥巴射擊",
		// Official flavor text: "向對手投擲 泥塊進行攻擊。 同時降低對手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mudslap: {
		name: "擲泥",
		// Official flavor text: "向對手的臉等處 投擲泥巴進行攻擊。 可降低對手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mudsport: {
		name: "玩泥巴",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "多屬性攻擊",
		// Official flavor text: "讓強大能量圍繞全身， 撞向對手進行攻擊。 招式屬性會隨著記憶碟而改變。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mysticalfire: {
		name: "魔法火焰",
		// Official flavor text: "從口中吐出特別灼熱的 火焰進行攻擊。 可降低對手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mysticalpower: {
		name: "神秘之力",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	nastyplot: {
		name: "詭計",
		// Official flavor text: "動歪腦筋，活化大腦。 大幅提高自己的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	naturalgift: {
		name: "自然之恩",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	naturepower: {
		name: "自然之力",
		// Official flavor text: "用自然之力進行攻擊。 隨著使用地點的不同， 使出的招式也會改變。"
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

		move: "自然之力變成了{MOVE}！",
	},
	naturesmadness: {
		name: "自然之怒",
		// Official flavor text: "向對手發洩自然之怒。 會使對手的ＨＰ減半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	needlearm: {
		name: "尖刺臂",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	neverendingnightmare: {
		name: "無盡暗夜之誘惑",
		shortDesc: null, // NEEDS TRANSLATION
	},
	nightdaze: {
		name: "暗黑爆破",
		// Official flavor text: "放出黑暗的衝擊波攻擊對手。 有時會降低對手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	nightmare: {
		name: "惡夢",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}開始做惡夢了！",
		damage: "  {POKEMON}正被惡夢纏身！",
	},
	nightshade: {
		name: "黑夜魔影",
		// Official flavor text: "讓對手看見恐怖幻影， 給予對手和自己等級 相同的傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	nightslash: {
		name: "暗襲要害",
		// Official flavor text: "抓住瞬間的空隙 斬切對手。 容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	nobleroar: {
		name: "戰吼",
		// Official flavor text: "發出戰吼威嚇對手， 降低對手的 攻擊和特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	noretreat: {
		name: "背水一戰",
		// Official flavor text: "提高自己所有的能力， 但無法進行替換或逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}受到背水一戰的效果影響，無法逃走了！",
	},
	noxioustorque: {
		name: "劇毒暴衝",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	nuzzle: {
		name: "蹭蹭臉頰",
		// Official flavor text: "用帶電的臉頰 磨蹭對手進行攻擊。 能讓對手陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	oblivionwing: {
		name: "死亡之翼",
		// Official flavor text: "從鎖定的對手身上吸取ＨＰ。 可以回復給予對手 傷害的一半以上的ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	obstruct: {
		name: "攔堵",
		// Official flavor text: "完全防住對手的所有攻擊。 連續使用時容易失敗。 一旦觸碰到，防禦會大幅降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	oceanicoperetta: {
		name: "海神莊嚴交響樂",
		shortDesc: null, // NEEDS TRANSLATION
	},
	octazooka: {
		name: "章魚桶炮",
		// Official flavor text: "向對手的臉等 噴出墨汁進行攻擊。 有時會降低對手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	octolock: {
		name: "蛸固",
		// Official flavor text: "讓對手無法逃走。 對手被纏住後， 防禦和特防每回合都會降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}受到蛸固的效果影響，無法逃走了！",
	},
	odorsleuth: {
		name: "氣味偵測",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "奇異之風",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	orderup: {
		name: "上菜",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	originpulse: {
		name: "根源波動",
		// Official flavor text: "放出無數閃耀著青白色光輝的 光線攻擊對手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	outrage: {
		name: "逆鱗",
		// Official flavor text: "在２～３回合內 瘋狂亂打對手進行攻擊。 大鬧一番後自己會陷入混亂。"
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
		// Official flavor text: "彈奏吉他和貝斯， 用發出巨響的激烈震動 攻擊對手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	overheat: {
		name: "過熱",
		// Official flavor text: "釋放全部能量攻擊對手。 使用後因為反作用力， 自己的特攻會大幅降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	painsplit: {
		name: "分擔痛楚",
		// Official flavor text: "將自己的ＨＰ和 對手的ＨＰ相加， 然後雙方友好地平分。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  均分了彼此的體力！",
	},
	paleowave: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	paraboliccharge: {
		name: "拋物面充電",
		// Official flavor text: "攻擊自己周圍所有的寶可夢。 可以回復給予傷害的一半ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	partingshot: {
		name: "拋下狠話",
		// Official flavor text: "拋下狠話恐嚇對手， 降低對手的攻擊和特攻後， 和後備寶可夢進行替換。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		heal: "#memento",
		switchOut: "#uturn",
	},
	payback: {
		name: "以牙還牙",
		// Official flavor text: "累積力量進行攻擊。 若在對手之後進行攻擊， 招式的威力會變成２倍。"
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
		name: "聚寶功",
		// Official flavor text: "往對手身上 投擲金幣進行攻擊。 戰鬥後可以得到錢。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  金幣散落一地！",
	},
	peck: {
		name: "啄",
		shortDesc: null, // NEEDS TRANSLATION
	},
	perishsong: {
		name: "滅亡之歌",
		// Official flavor text: "聽了歌聲的寶可夢 ３回合後將陷入瀕死。 替換寶可夢後效果就會消失。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  聽過滅亡之歌的寶可夢3回合後就會滅亡！",
		activate: "  {POKEMON}的滅亡計時變成{NUMBER}了！",
	},
	petalblizzard: {
		name: "落英繽紛",
		// Official flavor text: "猛烈地刮起飛雪般的落花， 攻擊自己周圍所有的寶可夢。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	petaldance: {
		name: "花瓣舞",
		// Official flavor text: "在２～３回合內 不斷灑出花瓣攻擊對手。 招式結束後自己會陷入混亂狀態。"
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
		name: "潛靈奇襲",
		// Official flavor text: "使用後的第１回合消失到某處， 並於第２回合攻擊對手。 可不顧對手的守護進行攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		prepare: "#shadowforce",
		activate: "#shadowforce",
	},
	photongeyser: {
		name: "光子噴湧",
		// Official flavor text: "以光柱進行攻擊。 會比較自己的攻擊和特攻， 以數值較高的一方進行攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pikapapow: {
		name: "閃閃雷光",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pinmissile: {
		name: "飛彈針",
		// Official flavor text: "向對手發射 銳利的針進行攻擊。 可連續攻擊２～５次。"
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
		name: "等離子閃電拳",
		// Official flavor text: "用帶有電流的拳頭進行攻擊。 可以將一般屬性的 招式轉變為電屬性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	playnice: {
		name: "和睦相處",
		// Official flavor text: "和對手和睦相處， 讓對手失去戰鬥意志， 降低對手的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	playrough: {
		name: "嬉鬧",
		// Official flavor text: "在和對手嬉鬧的同時進行攻擊。 有時會降低對手的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pluck: {
		name: "啄食",
		// Official flavor text: "用鳥喙進行攻擊。 可以吃下對手攜帶的樹果， 並獲得樹果的效果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		removeItem: "#bugbite",
	},
	poisonfang: {
		name: "劇毒牙",
		// Official flavor text: "用有毒的牙齒 咬住對手進行攻擊。 有時會讓對手陷入劇毒狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	poisongas: {
		name: "毒瓦斯",
		// Official flavor text: "將毒瓦斯吹到對手的臉上， 讓對手陷入中毒狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	poisonjab: {
		name: "毒擊",
		// Official flavor text: "以帶有毒性的觸手或手臂刺進對手。 有時會讓對手陷入中毒狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	poisonpowder: {
		name: "毒粉",
		// Official flavor text: "撒出大量的有毒粉末 讓對手陷入中毒狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	poisonsting: {
		name: "毒針",
		// Official flavor text: "將有毒的針 刺進對手進行攻擊。 有時會讓對手陷入中毒狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	poisontail: {
		name: "毒尾",
		// Official flavor text: "將尾巴甩向對手進行攻擊。 有時會讓對手陷入中毒狀態， 且容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	polarflare: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pollenpuff: {
		name: "花粉團",
		// Official flavor text: "對敵人使用時，用會爆炸的花粉團來攻擊。 對我方同伴使用時， 則給予有回復效果的花粉團。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	poltergeist: {
		name: "靈騷",
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}被{ITEM}襲擊了！",
	},
	populationbomb: {
		name: "鼠數兒",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pounce: {
		name: "蟲撲",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pound: {
		name: "拍擊",
		shortDesc: null, // NEEDS TRANSLATION
	},
	powder: {
		name: "粉塵",
		// Official flavor text: "被撒到粉塵的對手 使用火屬性招式時， 會發生爆炸並受到傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  向{POKEMON}拋灑了粉塵！",
		activate: "  和{MOVE}起了反應，粉塵爆炸了！",
	},
	powdersnow: {
		name: "細雪",
		// Official flavor text: "將冰冷的細雪 吹向對手進行攻擊。 有時會讓對手陷入冰凍狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	powergem: {
		name: "力量寶石",
		shortDesc: null, // NEEDS TRANSLATION
	},
	powersplit: {
		name: "力量平分",
		// Official flavor text: "用超能力將自己和對手的 攻擊和特攻各別相加後， 再進行平分。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}平分了各自的力量！",
	},
	powerswap: {
		name: "力量互換",
		// Official flavor text: "用超能力將自己和對手的 攻擊與特攻的能力變化互相交換。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	powershift: {
		name: "力量轉換",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}互換了進攻力和防守力！",
		end: "#.start",
	},
	powertrick: {
		name: "力量戲法",
		// Official flavor text: "利用超能力， 將自己的攻擊和 防禦互相交換。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}互換了攻擊和防禦！",
		end: "#.start",
	},
	powertrip: {
		name: "囂張",
		// Official flavor text: "耀武揚威地攻擊對手， 自己的能力提高得越多， 威力就越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	poweruppunch: {
		name: "增強拳",
		// Official flavor text: "反覆出拳擊打對手， 使自己的拳頭慢慢變硬。 命中對手時會提高自己的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	powerwhip: {
		name: "強力鞭打",
		shortDesc: null, // NEEDS TRANSLATION
	},
	precipiceblades: {
		name: "斷崖之劍",
		// Official flavor text: "將大地的力量化為利刃 攻擊對手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	present: {
		name: "禮物",
		// Official flavor text: "將暗藏機關的盒子 遞給對手進行攻擊。 但也有可能回復對手的ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	prismaticlaser: {
		name: "稜鏡鐳射",
		// Official flavor text: "用稜鏡的力量發射強烈光線。 下一回合自己將無法動彈。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	protect: {
		name: "守住",
		// Official flavor text: "完全防住對手的所有攻擊。 連續使用時容易失敗。"
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

		start: "  {POKEMON}擺出了防守的架勢！",
		block: "  {POKEMON}在攻擊中守護住了自己！",
	},
	psybeam: {
		name: "幻象光線",
		// Official flavor text: "向對手發射 神奇的光線進行攻擊。 有時會使對手混亂。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psyblade: {
		name: "精神劍",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psychic: {
		name: "精神強念",
		// Official flavor text: "向對手發送 強大的念力進行攻擊。 有時會降低對手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	psychicfangs: {
		name: "精神之牙",
		// Official flavor text: "利用精神力量咬住對手進行攻擊。 並可破壞光牆和反射壁等。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psychicnoise: {
		name: "精神噪音",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psychicterrain: {
		name: "精神場地",
		// Official flavor text: "在５回合內，地面上的寶可夢 不會受到先制招式攻擊。 超能力屬性的招式威力會提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	psychoboost: {
		name: "精神突進",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psychocut: {
		name: "精神利刃",
		// Official flavor text: "用實體化的 精神利刃斬向對手。 容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psychoshift: {
		name: "精神轉移",
		// Official flavor text: "用超能力施加暗示， 將自己的異常狀態 轉移給對手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psychup: {
		name: "自我暗示",
		// Official flavor text: "向自己施加自我暗示， 讓能力變化的狀態 變得與對手相同。"
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
		name: "精神衝擊",
		// Official flavor text: "將神奇的念力波實體化後攻擊對手。 給予對手物理傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psystrike: {
		name: "精神擊破",
		// Official flavor text: "將神奇的念力波實體化後攻擊對手。 給予對手物理傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	psywave: {
		name: "精神波",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "認真起來大爆擊",
		shortDesc: null, // NEEDS TRANSLATION
	},
	punishment: {
		name: "懲罰",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	purify: {
		name: "淨化",
		// Official flavor text: "治癒對手的異常狀態。 治癒後可以回復自己的ＨＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pursuit: {
		name: "追打",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		// Official flavor text: "燃燒小石子， 形成火球攻擊對手。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	quash: {
		name: "延後",
		// Official flavor text: "壓制對手，讓對手在 回合的最後才能行動。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  延後了{TARGET}的順序！",
	},
	quickattack: {
		name: "電光一閃",
		// Official flavor text: "以迅雷不及掩耳之勢 撲向對手。 必定能夠發動先制攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	quickguard: {
		name: "快速防守",
		// Official flavor text: "保護自己和同伴， 防禦來自對手的先制攻擊。"
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

		start: "  {TEAM}受到了快速防守的保護！",
		block: "  {POKEMON}受到了快速防守的保護！",
	},
	quiverdance: {
		name: "蝶舞",
		// Official flavor text: "輕巧地跳起神秘又美麗的舞蹈。 提高自己的特攻、特防和速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rage: {
		name: "憤怒",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "憤怒之拳",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	ragepowder: {
		name: "憤怒粉",
		// Official flavor text: "將令人煩躁的粉末撒在自己身上， 吸引對手的注意。進而將對手的攻擊 全部轉移到自己身上。"
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
		name: "大憤慨",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	raindance: {
		name: "求雨",
		// Official flavor text: "降下大雨，在５回合內 提高水屬性招式的威力。 火屬性招式的威力會降低。"
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
		name: "高速旋轉",
		// Official flavor text: "藉由旋轉來攻擊對手。 也可以擺脫綁緊、緊束、寄生種子等招式。 自己的速度也會提高。"
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
		name: "飛葉快刀",
		// Official flavor text: "飛射葉子， 切斬對手進行攻擊。 容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	razorshell: {
		name: "貝殼刃",
		// Official flavor text: "用鋒利的貝殼斬切 對手進行攻擊。 有時會降低對手的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	razorwind: {
		name: "旋風刀",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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

		prepare: "  {POKEMON}周圍的空氣產生了旋渦！",
	},
	recover: {
		name: "自我再生",
		// Official flavor text: "讓細胞再生， 回復自己最大ＨＰ的一半。"
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
		// Official flavor text: "將在戰鬥中已消耗完的 寶可夢持有物回收後， 回復成可以使用的狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		addItem: "  {POKEMON}撿來了{ITEM:classified}！",
	},
	reflect: {
		name: "反射壁",
		// Official flavor text: "利用神奇的屏障， 在５回合內減輕 來自對手的物理攻擊傷害。"
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
		name: "鏡面屬性",
		// Official flavor text: "在自己身上反映出對手的屬性， 讓自己也變成相同的屬性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		typeChange: "  {POKEMON}變成了和{SOURCE}相同的屬性！",
	},
	refresh: {
		name: "煥然一新",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	relicsong: {
		name: "古老之歌",
		// Official flavor text: "唱出古老之歌， 打動對手的心進行攻擊。 有時會讓對手陷入睡眠狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rest: {
		name: "睡覺",
		// Official flavor text: "連續睡２回合。 回復自己的全部ＨＰ 以及治癒所有異常狀態。"
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
		name: "報仇",
		// Official flavor text: "為倒下的同伴報仇。 前一回合有同伴被打倒時， 招式的威力會提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	return: {
		name: "報恩",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	revelationdance: {
		name: "覺醒之舞",
		// Official flavor text: "全力跳舞進行攻擊。 此招式的屬性將 變得和自己的屬性相同。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	revenge: {
		name: "報復",
		// Official flavor text: "如果受到對手的招式攻擊， 給予該對手的傷害就會變成２倍。"
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
		// Official flavor text: "竭盡全力進行攻擊。 自己的ＨＰ越少， 招式的威力越大。"
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
		name: "復生祈禱",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		heal: "  {POKEMON}復活並能夠繼續戰鬥了！",
	},
	risingvoltage: {
		name: "電力上升",
		// Official flavor text: "用從地面升騰的電擊攻擊。 當對手在電氣場地時， 招式威力會變成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	roar: {
		name: "吼叫",
		// Official flavor text: "趕走對手， 強制讓後備寶可夢上場。 對手為野生寶可夢時，戰鬥將直接結束。"
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
		name: "時光咆哮",
		// Official flavor text: "釋放出足以扭曲時間的 強大力量攻擊對手。 下一回合自己將無法動彈。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rockblast: {
		name: "岩石爆擊",
		// Official flavor text: "向對手發射 堅硬的岩石進行攻擊。 連續攻擊２～５次。"
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
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rockpolish: {
		name: "岩石打磨",
		// Official flavor text: "打磨自己的身體， 減少空氣阻力。 可大幅提高自己的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rockslide: {
		name: "岩崩",
		// Official flavor text: "將大岩石 猛烈地砸向對手進行攻擊。 有時會讓對手畏縮。"
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
		// Official flavor text: "用拳頭進行攻擊。 有時會降低對手的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rockthrow: {
		name: "落石",
		shortDesc: null, // NEEDS TRANSLATION
	},
	rocktomb: {
		name: "岩石封鎖",
		// Official flavor text: "投擲岩石進行攻擊。 封住對手的行動， 進而降低其速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rockwrecker: {
		name: "岩石炮",
		// Official flavor text: "向對手發射 巨大的岩石進行攻擊。 下一回合自己將無法動彈。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	roleplay: {
		name: "扮演",
		// Official flavor text: "扮演成對手， 讓自己的特性 也變得和對手相同。"
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

		changeAbility: "  {POKEMON}複製了{SOURCE}的{ABILITY}！",
	},
	rollingkick: {
		name: "迴旋踢",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rollout: {
		name: "滾動",
		// Official flavor text: "在５回合內連續滾動攻擊對手。 每擊中一次，威力就會提高。"
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
		name: "羽棲",
		// Official flavor text: "降落到地面，讓身體休息。 回復自己最大ＨＰ的一半。"
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
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	round: {
		name: "輪唱",
		// Official flavor text: "用歌聲攻擊對手。 大家一起輪唱便可以接連使出， 威力也會提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	ruination: {
		name: "大災難",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sacredfire: {
		name: "神聖之火",
		// Official flavor text: "用神秘的火焰 燒盡對手進行攻擊。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sacredsword: {
		name: "聖劍",
		// Official flavor text: "用長角斬切對手進行攻擊。 可不顧對手的能力變化 給予傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	safeguard: {
		name: "神秘守護",
		// Official flavor text: "在５回合內 被神奇的力量守護， 不會陷入異常狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {TEAM}被神秘之幕包圍了！",
		end: "  包圍{TEAM}的神秘之幕消失了！",
		block: "  {POKEMON}正受到神秘之幕的保護！",
	},
	saltcure: {
		name: "鹽醃",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},

		start: "  {POKEMON}陷入了鹽醃狀態！",
		damage: "  {POKEMON}受到了鹽醃的傷害。",
	},
	sandattack: {
		name: "潑沙",
		// Official flavor text: "向對手的臉上潑沙， 降低對手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sandsearstorm: {
		name: "熱沙風暴",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sandstorm: {
		name: "沙暴",
		// Official flavor text: "揚起沙暴，在５回合內給予 岩石、地面和鋼屬性以外的寶可夢傷害。 岩石屬性寶可夢的特防會提高。"
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
		name: "流沙地獄",
		// Official flavor text: "將對手困在 鋪天蓋地的沙暴中， 在４～５回合內進行攻擊。"
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

		start: "  {POKEMON}陷入了流沙地獄！",
	},
	sappyseed: {
		name: "茁茁轟炸",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	savagespinout: {
		name: "絕對捕食迴旋斬",
		shortDesc: null, // NEEDS TRANSLATION
	},
	scald: {
		name: "熱水",
		// Official flavor text: "向對手噴射 滾燙的熱水進行攻擊。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	scaleshot: {
		name: "鱗射",
		// Official flavor text: "射出鱗片進行攻擊。 可連續攻擊２～５次。 速度會提高但防禦會降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	scaryface: {
		name: "鬼面",
		// Official flavor text: "用恐怖的表情瞪著對手， 讓對手害怕， 大幅降低對手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	scorchingsands: {
		name: "熱沙大地",
		// Official flavor text: "向對手投灑熾熱的沙子進行攻擊。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	scratch: {
		name: "抓",
		shortDesc: null, // NEEDS TRANSLATION
	},
	screech: {
		name: "刺耳聲",
		// Official flavor text: "發出令人不由自主想要 摀起耳朵的刺耳聲， 大幅降低對手的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	searingshot: {
		name: "火焰彈",
		// Official flavor text: "用熊熊烈火 攻擊自己周圍所有的寶可夢。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	searingsunrazesmash: {
		name: "日光迴旋下蒼穹",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	secretpower: {
		name: "秘密之力",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "神秘之劍",
		// Official flavor text: "用長角斬切對手進行攻擊。 角上擁有的神奇力量 會給予對手物理傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	seedbomb: {
		name: "種子炸彈",
		shortDesc: null, // NEEDS TRANSLATION
	},
	seedflare: {
		name: "種子閃光",
		// Official flavor text: "從身體裡發出衝擊波攻擊對手。 有時會大幅降低對手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	seismictoss: {
		name: "地球上投",
		// Official flavor text: "利用引力將對手甩飛出去。 給予對手和自己等級相同的傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	selfdestruct: {
		name: "自爆",
		// Official flavor text: "引起爆炸， 攻擊自己周圍所有的寶可夢。 使用後自己會陷入瀕死。"
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
		// Official flavor text: "投擲一團黑影進行攻擊。 有時會降低對手的特防。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shadowbone: {
		name: "暗影之骨",
		// Official flavor text: "用寄宿了靈魂的骨頭 毆打對手進行攻擊。 有時會降低對手的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shadowclaw: {
		name: "暗影爪",
		// Official flavor text: "用黑影化成的銳利爪子 撕裂對手。 容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shadowforce: {
		name: "暗影潛襲",
		// Official flavor text: "使用後的第１回合消失身影， 並於第２回合攻擊對手。 處於守護的對手也能擊中。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  打破了{TARGET}的防守！",
		prepare: "{POKEMON}的身影瞬間消失了！",
	},
	shadowpunch: {
		name: "暗影拳",
		shortDesc: null, // NEEDS TRANSLATION
	},
	shadowsneak: {
		name: "影子偷襲",
		// Official flavor text: "伸長自己的影子， 從對手的背後進行攻擊。 必定能夠發動先制攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shadowstrike: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sharpen: {
		name: "稜角化",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shatteredpsyche: {
		name: "至高精神破壞波",
		shortDesc: null, // NEEDS TRANSLATION
	},
	shedtail: {
		name: "斷尾",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}截斷尾巴，把它做成了替身！",
		alreadyStarted: "#substitute",
		fail: "#substitute",
	},
	sheercold: {
		name: "絕對零度",
		// Official flavor text: "一擊讓對手陷入瀕死。 冰屬性以外的寶可夢使用時， 會比較不易命中對手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	shellsidearm: {
		name: "臂貝武器",
		// Official flavor text: "用物理攻擊和特殊攻擊中 能夠給予更大傷害的能力進行攻擊。 有時會讓對手陷入中毒狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shellsmash: {
		name: "破殼",
		// Official flavor text: "破殼而出。 自己的防禦和特防會降低， 但能大幅提高攻擊、特攻和速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shelltrap: {
		name: "陷阱甲殼",
		// Official flavor text: "設下甲殼陷阱。 若對手使出物理招式， 就會爆炸並給予傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}設下了陷阱甲殼！",
		prepare: "  {POKEMON}設下了陷阱甲殼！",
		cant: "{POKEMON}的陷阱甲殼沒有被觸發！",
	},
	shelter: {
		name: "閉關",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shiftgear: {
		name: "換檔",
		// Official flavor text: "轉動齒輪， 提高自己的攻擊， 同時大幅提高自己的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	shockwave: {
		name: "電擊波",
		shortDesc: null, // NEEDS TRANSLATION
	},
	shoreup: {
		name: "集沙",
		// Official flavor text: "回復自己最大ＨＰ的一半。 在沙暴中回復得更多。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	signalbeam: {
		name: "信號光束",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	silktrap: {
		name: "線阱",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	silverwind: {
		name: "銀色旋風",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	simplebeam: {
		name: "單純光束",
		// Official flavor text: "向對手發射謎樣的念力波。 接收了念力波的對手， 特性會變成單純。"
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
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sketch: {
		name: "寫生",
		// Official flavor text: "將對手使用的招式變成自己的。 寫生在使用１次之後就會消失。"
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

		activate: "  {POKEMON}對{MOVE}進行了寫生！",
	},
	skillswap: {
		name: "特性互換",
		// Official flavor text: "用超能力將自己和 對手的特性互相交換。"
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

		activate: "  {POKEMON}互換了各自的特性！",
	},
	skittersmack: {
		name: "爬擊",
		// Official flavor text: "從對手背後爬近後進行攻擊。 會降低對手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	skullbash: {
		name: "火箭頭錘",
		// Official flavor text: "使用後的第１回合把頭後縮，提高防禦。 並於第２回合攻擊對手。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		prepare: "{POKEMON}把頭縮了進去！",
	},
	skyattack: {
		name: "神鳥猛擊",
		// Official flavor text: "在使用後的下一回合進行攻擊。 有時會使對手畏縮。 且容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		prepare: "強光包圍了{POKEMON}！",
	},
	skydrop: {
		name: "自由落體",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		prepare: "{POKEMON}將{TARGET}帶上了高空！",
		end: "  {POKEMON}擺脫了自由落體！",
		failSelect: "{POKEMON}因自由落體而無法自由行動！",
		failTooHeavy: "  {POKEMON}太重了，抬不起來！",
	},
	skyuppercut: {
		name: "衝天拳",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	slackoff: {
		name: "偷懶",
		// Official flavor text: "偷懶休息。 回復自己最大ＨＰ的一半。"
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
		name: "劈開",
		// Official flavor text: "用爪子或鐮刀等 劈開對手進行攻擊。 容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sleeppowder: {
		name: "催眠粉",
		shortDesc: null, // NEEDS TRANSLATION
	},
	sleeptalk: {
		name: "夢話",
		// Official flavor text: "從自己已學會的招式中 隨機選出１個使出。 只有在睡眠狀態時可以使用。"
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
		name: "污泥攻擊",
		// Official flavor text: "向對手投擲污泥進行攻擊。 有時會讓對手陷入中毒狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	sludgebomb: {
		name: "污泥炸彈",
		// Official flavor text: "向對手投擲污泥進行攻擊。 有時會讓對手陷入中毒狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sludgewave: {
		name: "污泥波",
		// Official flavor text: "用污泥波攻擊 自己周圍所有的寶可夢。 有時會讓對手陷入中毒狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	smackdown: {
		name: "擊落",
		// Official flavor text: "向空中的對手投擲石頭或炮彈等物體 進行攻擊。對手會被擊落，掉到地面。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}被擊落，掉到了地面！",
	},
	smartstrike: {
		name: "修長之角",
		shortDesc: null, // NEEDS TRANSLATION
	},
	smellingsalts: {
		name: "清醒",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "濁霧",
		// Official flavor text: "將骯髒的濃霧 吹向對手進行攻擊。 有時會讓對手陷入中毒狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	smokescreen: {
		name: "煙幕",
		// Official flavor text: "向對手噴出煙霧或墨汁等， 降低對手的命中率。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	snaptrap: {
		name: "捕獸夾",
		// Official flavor text: "用捕獸夾， 在４～５回合內 夾住對手進行攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}被捕獸夾困住了！",
	},
	snarl: {
		name: "大聲咆哮",
		// Official flavor text: "沒完沒了地向對手大聲咆哮， 降低對手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	snatch: {
		name: "搶奪",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}正在觀察對手的動向！",
		activate: "  {POKEMON}搶奪了{TARGET}的招式！",
	},
	snipeshot: {
		name: "狙擊",
		// Official flavor text: "能不受具有吸引對手招式 效果的特性或招式影響， 向選定的對手進行攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	snore: {
		name: "打鼾",
		// Official flavor text: "在自己睡著時， 發出噪音進行攻擊。 有時會讓對手畏縮。"
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
		// Official flavor text: "朝對手灑下大量的水， 讓對手變成水屬性。"
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
		// Official flavor text: "回復自己最大ＨＰ的一半。"
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
		// Official flavor text: "使用後的第１回合吸收大量日光， 並於第２回合發射光束進行攻擊。"
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

		prepare: "  {POKEMON}吸收了光線！",
	},
	solarblade: {
		name: "日光刃",
		// Official flavor text: "使用後的第１回合吸收大量日光， 並於第２回合把力量 注入劍裡進行攻擊。"
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
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	soulstealing7starstrike: {
		name: "七星奪魂腿",
		shortDesc: null, // NEEDS TRANSLATION
	},
	spacialrend: {
		name: "亞空裂斬",
		// Official flavor text: "將對手連同周圍的空間 一起切開，給予對手傷害。 容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	spark: {
		name: "電光",
		// Official flavor text: "用電流圍繞身體， 猛撞對手進行攻擊。 有時會讓對手陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sparklingaria: {
		name: "泡影的詠歎調",
		// Official flavor text: "隨著歌聲放出許多水球。 受此招式攻擊時， 灼傷會被治癒。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sparklyswirl: {
		name: "亮亮風暴",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	spectralthief: {
		name: "暗影偷盜",
		// Official flavor text: "潛入對手的影子， 奪取對手的能力提升進行攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		clearBoost: "  {SOURCE}奪取了提高的那部分能力！",
	},
	speedswap: {
		name: "速度互換",
		// Official flavor text: "將對手和自己的速度 進行互換。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}互換了各自的速度！",
	},
	spicyextract: {
		name: "辣椒精華",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	spiderweb: {
		name: "蛛網",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "尖刺加農炮",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		// Official flavor text: "將撒菱散布在對手的腳下。 讓對手替換出場的寶可夢 受到傷害。"
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

		start: "  {TEAM}腳下散落著撒菱！",
		end: "  {TEAM}腳下的撒菱消失不見了！",
		damage: "  {POKEMON}受到了撒菱的傷害！",
	},
	spikyshield: {
		name: "尖刺防守",
		// Official flavor text: "防禦來自對手的攻擊， 同時削減接觸到自己的 對手的ＨＰ。"
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

		damage: "  {POKEMON}受傷了！",
	},
	spinout: {
		name: "疾速轉輪",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	spiritbreak: {
		name: "靈魂衝擊",
		// Official flavor text: "用足以讓對手一蹶不振的 氣勢進行攻擊。 可降低對手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	spiritshackle: {
		name: "縫影",
		// Official flavor text: "攻擊的同時， 縫住對手的影子， 使其無法逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	spite: {
		name: "怨恨",
		// Official flavor text: "向對手最近一次使用的招式 發出怨念， 讓該招式減少４ＰＰ。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  削減了{TARGET}的{MOVE}{NUMBER}點！",
	},
	spitup: {
		name: "噴出",
		// Official flavor text: "將蓄積的力量 撞向對手進行攻擊。 蓄積得越多，威力越大。"
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
		name: "躍起",
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  但是什麼事也沒發生！",
	},
	splinteredstormshards: {
		name: "狼嘯石牙颶風暴",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	splishysplash: {
		name: "滔滔衝浪",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	spore: {
		name: "蘑菇孢子",
		shortDesc: null, // NEEDS TRANSLATION
	},
	spotlight: {
		name: "聚光燈",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "#followme",
		startFromZEffect: "#followme",
	},
	springtidestorm: {
		name: "陽春風暴",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stealthrock: {
		name: "隱形岩",
		// Official flavor text: "在對手周圍撒下無數飄浮的岩石， 讓對手替換出場的寶可夢受到傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {TEAM}周圍開始浮現出尖銳的岩石！",
		end: "  {TEAM}周圍的隱形岩消失不見了！",
		damage: "  尖銳的岩石扎進了{POKEMON}的體內！",
	},
	steameruption: {
		name: "蒸汽爆炸",
		// Official flavor text: "將超高溫的蒸汽噴向對手。 有時會讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	steamroller: {
		name: "瘋狂滾壓",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	steelbeam: {
		name: "鐵蹄光線",
		// Official flavor text: "將從全身匯聚起來的鋼鐵 化為光束激烈地發射出去。 自己也會受到傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		damage: "#mindblown",
	},
	steelroller: {
		name: "鐵滾輪",
		// Official flavor text: "一邊破壞場地，一邊進行攻擊。 在不是特殊狀態的場地上使用， 招式就會失敗。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	steelwing: {
		name: "鋼翼",
		// Official flavor text: "用堅硬的翅膀撞擊 對手進行攻擊。 有時會提高自己的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stickyweb: {
		name: "黏黏網",
		// Official flavor text: "在對手周圍撒下黏黏的網， 降低替換出場的對手的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {TEAM}的腳下張開了黏黏網！",
		end: "  {TEAM}腳下的黏黏網消失不見了！",
		activate: "  {POKEMON}被黏黏網黏住了！",
	},
	stockpile: {
		name: "蓄力",
		// Official flavor text: "蓄積力量， 提高自己的防禦和特防。 最多蓄積３次。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}蓄力了{NUMBER}次！",
		end: "  {POKEMON}的蓄力效果用完了！",
	},
	stokedsparksurfer: {
		name: "駕雷馭電戲衝浪",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stomp: {
		name: "踩踏",
		// Official flavor text: "用大腳踩踏對手進行攻擊。 有時會讓對手畏縮。"
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
		name: "跺腳",
		// Official flavor text: "化悔恨為力量進行攻擊。 如果上一回合的招式沒有命中， 威力就會加倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stoneaxe: {
		name: "岩斧",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stoneedge: {
		name: "尖石攻擊",
		// Official flavor text: "用尖銳的岩石 刺進對手進行攻擊。 容易擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	storedpower: {
		name: "輔助力量",
		// Official flavor text: "用蓄積的力量攻擊對手。 自己的能力提高越多， 招式的威力越大。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stormthrow: {
		name: "山嵐摔",
		// Official flavor text: "向對手發動強烈的一擊。 一定會擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	strangesteam: {
		name: "神奇蒸汽",
		// Official flavor text: "噴出煙霧攻擊對手。 有時會使對手混亂。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	strength: {
		name: "怪力",
		shortDesc: null, // NEEDS TRANSLATION
	},
	strengthsap: {
		name: "吸取力量",
		// Official flavor text: "將自己的ＨＰ回復到和 對手的攻擊力相同。 然後降低對手的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stringshot: {
		name: "吐絲",
		// Official flavor text: "用口中吐出的絲纏繞對手， 大幅降低對手的速度。"
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
		name: "掙扎",
		// Official flavor text: "在自己的ＰＰ耗盡時， 努力掙扎攻擊對手。 自己也會受到少許傷害。"
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
		name: "蟲之抵抗",
		// Official flavor text: "抵抗對手進行攻擊。 可降低對手的特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stuffcheeks: {
		name: "大快朵頤",
		// Official flavor text: "吃掉攜帶的樹果， 大幅提高自己的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	stunspore: {
		name: "麻痺粉",
		// Official flavor text: "撒出大量令人麻痺的粉末， 讓對手陷入麻痺狀態。"
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
		name: "地獄翻滾",
		// Official flavor text: "將對手連同自己一起 摔向地面進行攻擊。 自己也會受到少許傷害。"
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
		// Official flavor text: "消耗一些自己的ＨＰ， 製造分身。 分身將成為自己的替身。"
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

		start: "  {POKEMON}的替身出現了！",
		alreadyStarted: "  但是，{POKEMON}的替身已經出現了。",
		end: "  {POKEMON}的替身消失了……",
		fail: "  但是，體力已經不夠放出替身了！",
		activate: "  替身代替{POKEMON}承受了攻擊！",
	},
	subzeroslammer: {
		name: "激狂大地萬里冰",
		shortDesc: null, // NEEDS TRANSLATION
	},
	suckerpunch: {
		name: "突襲",
		// Official flavor text: "可以搶先對手一步進行攻擊。 若對手使用的不是攻擊招式則會失敗。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	sunnyday: {
		name: "大晴天",
		// Official flavor text: "讓日照增強，在５回合內 提高火屬性招式的威力。 水屬性招式的威力會降低。"
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
		name: "流星閃衝",
		// Official flavor text: "以流星般的氣勢猛撞對手。 可不顧對手的特性進行攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	supercellslam: {
		name: "閃電強襲",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		damage: "#crash",
	},
	superfang: {
		name: "憤怒門牙",
		// Official flavor text: "用銳利的門牙 猛烈地咬住對手進行攻擊。 對手的ＨＰ將會減半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen1: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	superpower: {
		name: "蠻力",
		// Official flavor text: "發揮驚人的力量攻擊對手。 自己的攻擊和防禦會降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	supersonic: {
		name: "超音波",
		shortDesc: null, // NEEDS TRANSLATION
	},
	supersonicskystrike: {
		name: "極速俯衝轟烈撞",
		shortDesc: null, // NEEDS TRANSLATION
	},
	surf: {
		name: "衝浪",
		// Official flavor text: "使用大浪 攻擊自己周圍所有的寶可夢。"
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
		name: "水流連打",
		// Official flavor text: "將水之流派鍛鍊到了極致， 猶如行雲流水的３次連擊。 必定會擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	swagger: {
		name: "虛張聲勢",
		// Official flavor text: "讓對手火大並陷入混亂。 但對手的攻擊會因憤怒 而大幅提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	swallow: {
		name: "吞下",
		// Official flavor text: "將蓄積的力量吞下， 回復自己的ＨＰ。 蓄積得越多，回復越多。"
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
		name: "甜甜香氣",
		// Official flavor text: "用香氣大幅降低對手的閃避率。"
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
		// Official flavor text: "發射星型光線攻擊對手。 攻擊必定會命中。"
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
		// Official flavor text: "以肉眼看不清的速度 將自己和對手的持有物互相交換。"
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
		name: "劍舞",
		// Official flavor text: "激烈地跳起戰舞提升氣勢， 大幅提高自己的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	synchronoise: {
		name: "同步干擾",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	synthesis: {
		name: "光合作用",
		// Official flavor text: "回復自己的ＨＰ。 回復量會隨著天氣的不同 而有所變化。"
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
		name: "糖漿炸彈",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}陷入了滿身糖狀態！",
	},
	tackle: {
		name: "撞擊",
		shortDesc: null, // NEEDS TRANSLATION
	},
	tachyoncutter: {
		name: "迅子利刃",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	tailglow: {
		name: "螢火",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	tailslap: {
		name: "掃尾拍打",
		// Official flavor text: "將堅硬的尾巴 掃向對手進行攻擊。 可連續攻擊２～５次。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	tailwhip: {
		name: "搖尾巴",
		// Official flavor text: "可愛地左右搖晃尾巴， 誘使對手疏忽大意。 可降低對手的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen2: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	tailwind: {
		name: "順風",
		// Official flavor text: "刮起猛烈的強風， 在４回合內 提高我方全體的速度。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		start: "  從{TEAM}身後吹起了順風！",
		end: "  {TEAM}的順風停止了！",
	},
	takedown: {
		name: "猛撞",
		// Official flavor text: "以驚人的氣勢 撞向對手進行攻擊。 自己也會受到少許傷害。"
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
		name: "勇氣填充",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	tarshot: {
		name: "瀝青射擊",
		// Official flavor text: "射出黏黏的瀝青， 降低對手的速度。 對手的弱點將變為火。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}變得怕火了！",
	},
	taunt: {
		name: "挑釁",
		// Official flavor text: "激怒對手。 在３回合內讓對手 只能使出給予傷害的招式。"
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

		start: "  {POKEMON}中了挑釁！",
		end: "  {POKEMON}的挑釁效果解除了！",
		cant: "{POKEMON}受到了挑釁，無法使出{MOVE}！",
	},
	tearfullook: {
		name: "淚眼汪汪",
		// Official flavor text: "變得淚眼汪汪， 令對手喪失鬥志。 進而降低對手的攻擊和特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	teatime: {
		name: "茶會",
		// Official flavor text: "舉辦茶會， 在場上的寶可夢都會 吃掉自己攜帶的樹果。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  舉辦茶會，大家一起吃了樹果！",
		fail: "  但是什麼事也沒發生！",
	},
	technoblast: {
		name: "高科技光炮",
		// Official flavor text: "向對手發射光彈。 招式的屬性會隨著自己 攜帶的卡帶不同而改變。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	tectonicrage: {
		name: "地隆嘯天大終結",
		shortDesc: null, // NEEDS TRANSLATION
	},
	teeterdance: {
		name: "搖晃舞",
		// Official flavor text: "搖搖晃晃地跳起舞， 讓自己周圍的寶可夢 陷入混亂狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	telekinesis: {
		name: "意念移物",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  讓{POKEMON}浮在了空中！",
		end: "  {POKEMON}擺脫了意念移物！",
	},
	teleport: {
		name: "瞬間移動",
		// Official flavor text: "在有後備寶可夢時使用， 可進行替換。 野生寶可夢則會逃走。"
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
		name: "太晶爆發",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	terastarstorm: {
		name: "晶光星群",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	terrainpulse: {
		name: "大地波動",
		// Official flavor text: "藉助場地的力量進行攻擊。 視使出招式時場地狀態不同， 招式的屬性和威力會有所變化。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thief: {
		name: "小偷",
		// Official flavor text: "在攻擊的同時偷取道具。 當寶可夢自己有攜帶道具時， 則無法偷取。"
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
		name: "千箭齊發",
		// Official flavor text: "能夠命中飄浮在空中的寶可夢。 飄浮在空中的對手 會被擊落掉到地面。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thousandwaves: {
		name: "千波激盪",
		// Official flavor text: "化成波浪從地面進行攻擊。 被捲入波浪中的對手 將無法從戰鬥中逃走。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	thrash: {
		name: "大鬧一番",
		// Official flavor text: "在２～３回合內 瘋狂亂打對手進行攻擊。 大鬧一番後自己會陷入混亂。"
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
		name: "地獄突刺",
		// Official flavor text: "受到此招式攻擊的對手， 會因為地獄般的痛苦，在２回合內 無法使用會發出聲音的招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},

		cant: "{POKEMON}因地獄突刺的效果而無法使出招式！",
	},
	thunder: {
		name: "打雷",
		// Official flavor text: "向對手劈下暴雷進行攻擊。 有時會讓對手陷入麻痺狀態。"
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
		name: "十萬伏特",
		// Official flavor text: "向對手放出強力電流進行攻擊。 有時會讓對手陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thundercage: {
		name: "雷電囚籠",
		// Official flavor text: "將對手困在 電流奔竄的電牢中， 在４～５回合內進行攻擊。"
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
		name: "雷電牙",
		// Official flavor text: "用蓄滿電流的牙齒咬住對手。 有時會讓對手畏縮 或陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thunderouskick: {
		name: "雷鳴蹴擊",
		// Official flavor text: "以雷電般的動作 一邊戲弄對手一邊使出踢擊。 可降低對手的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thunderpunch: {
		name: "雷電拳",
		// Official flavor text: "用帶有電流的拳頭 攻擊對手。 有時會讓對手陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thundershock: {
		name: "電擊",
		// Official flavor text: "發出電流刺激對手進行攻擊。 有時會讓對手陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thunderwave: {
		name: "電磁波",
		// Official flavor text: "放出微弱的電流。 讓對手陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	tickle: {
		name: "搔癢",
		// Official flavor text: "搔癢對手的身體，讓對手發笑， 降低對手的攻擊和防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	tidyup: {
		name: "大掃除",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  大掃除完畢！",
	},
	topsyturvy: {
		name: "顛倒",
		// Official flavor text: "讓對手身上所有的 能力變化顛倒過來， 變成和原來相反的狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	torchsong: {
		name: "閃焰高歌",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	torment: {
		name: "無理取鬧",
		// Official flavor text: "無理取鬧， 讓對手不能連續２次 使出相同招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}遭到了無理取鬧！",
		end: "  {POKEMON}的無理取鬧效果消失了！",
	},
	toxic: {
		name: "劇毒",
		// Official flavor text: "讓對手陷入劇毒狀態。 中毒傷害會隨著 回合的進行而增加。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	toxicspikes: {
		name: "毒菱",
		// Official flavor text: "在對手腳下散布毒菱。 讓對手替換出場的寶可夢 陷入中毒狀態。"
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

		start: "  {TEAM}腳下散落著毒菱！",
		end: "  {TEAM}腳下的毒菱消失不見了！",
	},
	toxicthread: {
		name: "毒絲",
		// Official flavor text: "將混有毒的絲吐向對手。 使其中毒， 進而降低對手的速度。"
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
		name: "變身",
		// Official flavor text: "變身成對手寶可夢的樣子， 能夠使用和對手 完全相同的招式。"
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

		transform: "{POKEMON}變身成了{SPECIES}！",
	},
	triattack: {
		name: "三重攻擊",
		// Official flavor text: "用３種光線進行攻擊。 有時會讓對手陷入 麻痺、灼傷或冰凍的狀態。"
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
		name: "戲法",
		// Official flavor text: "在對手露出空隙時， 趁機交換自己和對手的持有物。"
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

		activate: "  {POKEMON}互換了各自的道具！",
	},
	trickortreat: {
		name: "萬聖夜",
		// Official flavor text: "邀請對手參加萬聖夜。 讓對手追加幽靈屬性。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	trickroom: {
		name: "戲法空間",
		// Official flavor text: "創造出非常不可思議的空間。 在５回合內， 速度慢的寶可夢可以先行動。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	triplearrows: {
		name: "三連箭",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	tripleaxel: {
		name: "三旋擊",
		// Official flavor text: "連續踢對手３次進行攻擊。 每踢中一次，威力就會提高。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	tripledive: {
		name: "三連鑽",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	triplekick: {
		name: "三連踢",
		// Official flavor text: "連續踢對手３次進行攻擊。 每踢中一次，威力就會提高。"
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
		name: "熱帶踢",
		// Official flavor text: "向對手使出來自南國的火熱腳踢。 進而降低對手的攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	trumpcard: {
		name: "王牌",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	twinbeam: {
		name: "雙光束",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	twineedle: {
		name: "雙針",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "可愛星星飛天撞",
		shortDesc: null, // NEEDS TRANSLATION
	},
	twister: {
		name: "龍捲風",
		// Official flavor text: "刮起龍捲風， 將對手捲入進行攻擊。 有時會使對手畏縮。"
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
		name: "快手還擊",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	uproar: {
		name: "吵鬧",
		// Official flavor text: "在３回合內 大吵大鬧攻擊對手。 在此期間誰都無法入眠。"
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

		start: "  {POKEMON}吵鬧了起來！",
		end: "  {POKEMON}平靜了下來！",
		upkeep: "  {POKEMON}吵鬧個不停！",
		block: "  但是，{POKEMON}被吵得無法入睡！",
		blockSelf: "  但是，{POKEMON}吵鬧個不停，無法入睡！",
	},
	uturn: {
		name: "急速折返",
		// Official flavor text: "攻擊後迅速返回， 和後備寶可夢進行替換。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		switchOut: "{POKEMON}要回到{TRAINER}的身邊了！",
	},
	vacuumwave: {
		name: "真空波",
		// Official flavor text: "揮動拳頭， 捲起真空波。 必定能夠發動先制攻擊。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	vcreate: {
		name: "Ｖ熱焰",
		// Official flavor text: "在前額產生灼熱的火焰， 然後捨身撞擊對手。 自己的防禦、特防和速度會降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	veeveevolley: {
		name: "砰砰擊破",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	venomdrench: {
		name: "毒液陷阱",
		// Official flavor text: "向對手發射特殊的毒液。 陷入中毒狀態的對手 攻擊、特攻和速度會降低。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	venoshock: {
		name: "毒液衝擊",
		// Official flavor text: "將特殊的毒液潑向對手。 攻擊陷入中毒狀態的對手時， 威力會變成２倍。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	victorydance: {
		name: "勝利之舞",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	vinewhip: {
		name: "藤鞭",
		shortDesc: null, // NEEDS TRANSLATION
	},
	visegrip: {
		name: "夾住",
		shortDesc: null, // NEEDS TRANSLATION
	},
	vitalthrow: {
		name: "借力摔",
		// Official flavor text: "攻擊的順序會在對手之後。 但是自己的攻擊必定會命中。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	voltswitch: {
		name: "伏特替換",
		// Official flavor text: "攻擊後迅速返回， 和後備寶可夢進行替換。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		switchOut: "#uturn",
	},
	volttackle: {
		name: "伏特攻擊",
		// Official flavor text: "用電流圍繞全身後猛撞對手。 自己也會受到不小的傷害。 有時會讓對手陷入麻痺狀態。"
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
		name: "喚醒巴掌",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	waterfall: {
		name: "攀瀑",
		// Official flavor text: "以驚人的氣勢撲向對手。 有時會讓對手畏縮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	watergun: {
		name: "水槍",
		shortDesc: null, // NEEDS TRANSLATION
	},
	waterpledge: {
		name: "水之誓約",
		// Official flavor text: "用水柱進行攻擊。 和火之誓約同時使用時，威力會提高， 天空會出現彩虹。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}正在等候{TARGET}……",
		start: "  彩虹出現在了{TEAM}上空！",
		end: "  彩虹從{TEAM}上空消失了！",
	},
	waterpulse: {
		name: "水之波動",
		// Official flavor text: "用水的震動攻擊對手。 有時會使對手混亂。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	watershuriken: {
		name: "飛水手裡劍",
		// Official flavor text: "射出用黏液製成的手裡劍， 連續攻擊２～５次。 必定能夠發動先制攻擊。"
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
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		name: "噴水",
		// Official flavor text: "噴起潮水進行攻擊。 自己的ＨＰ越少， 招式的威力越小。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	wavecrash: {
		name: "波動衝",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	weatherball: {
		name: "氣象球",
		// Official flavor text: "招式屬性和威力會隨著 使用時天氣的不同而改變。"
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

		move: "究極無敵大衝撞因天氣的影響變成了{MOVE}！",
	},
	whirlpool: {
		name: "潮旋",
		// Official flavor text: "將對手困在激烈的 水流漩渦中， 在４～５回合內進行攻擊。"
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

		start: "  {POKEMON}被困在了漩渦之中！",
	},
	whirlwind: {
		name: "吹飛",
		// Official flavor text: "吹飛對手， 強制讓後備寶可夢上場。 對手為野生寶可夢時，戰鬥將直接結束。"
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
		name: "暗冥強擊",
		// Official flavor text: "將惡之流派鍛鍊到了 極致的強烈一擊。 必定會擊中要害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	wickedtorque: {
		name: "黑暗暴衝",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	wideguard: {
		name: "廣域防守",
		// Official flavor text: "在１回合內， 防禦住攻擊我方全體的攻擊招式。"
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

		start: "  {TEAM}受到了廣域防守的保護！",
		block: "  {POKEMON}受到了廣域防守的保護！",
	},
	wildboltstorm: {
		name: "鳴雷風暴",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	wildcharge: {
		name: "瘋狂伏特",
		// Official flavor text: "讓電流圍繞全身， 衝撞對手進行攻擊。 自己也會受到少許傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	willowisp: {
		name: "鬼火",
		// Official flavor text: "放出詭異的火焰， 讓對手陷入灼傷狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	wingattack: {
		name: "翅膀攻擊",
		shortDesc: null, // NEEDS TRANSLATION
	},
	wish: {
		name: "祈願",
		// Official flavor text: "在下一回合回復自己或是 替換上場的寶可夢最大ＨＰ的一半。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		heal: "  {NICKNAME}的祈願實現了！",
	},
	withdraw: {
		name: "縮入殼中",
		// Official flavor text: "縮入殼中保護身體， 提高自己的防禦。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	wonderroom: {
		name: "奇妙空間",
		// Official flavor text: "創造出非常不可思議的空間。 在５回合內，讓所有寶可夢的 防禦和特防互相交換。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	woodhammer: {
		name: "木槌",
		// Official flavor text: "用堅硬的軀體 撞擊對手進行攻擊。 自己也會受到不小的傷害。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	workup: {
		name: "自我激勵",
		// Official flavor text: "激勵自己， 提高自己的攻擊和特攻。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	worryseed: {
		name: "煩惱種子",
		// Official flavor text: "埋下令人心煩意亂的種子， 讓對手睡不著， 將對手的特性變成不眠。"
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
		name: "緊束",
		// Official flavor text: "使用長長的身體或藤蔓等， 在４～５回合內 緊束對手進行攻擊。"
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

		start: "  {POKEMON}被{SOURCE}緊緊束縛住了！",
		move: null, // NEEDS TRANSLATION
	},
	wringout: {
		name: "絞緊",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
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
		// Official flavor text: "打個大哈欠引起睡意。 在下一回合 讓對手陷入睡眠狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  讓{POKEMON}產生睡意了！",
	},
	zapcannon: {
		name: "電磁炮",
		// Official flavor text: "發射如大炮般的 電流進行攻擊。 能讓對手陷入麻痺狀態。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	zenheadbutt: {
		name: "意念頭錘",
		// Official flavor text: "將意念的力量集中在 前額進行攻擊。 有時會讓對手畏縮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	zingzap: {
		name: "麻麻刺刺",
		// Official flavor text: "撞向對手，並利用 強電流使其感到麻麻刺刺的。 有時會使對手畏縮。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	zippyzap: {
		name: "電電加速",
		// Official flavor text: "無法使用此招式。 雖然忘記後將無法再想起來， 但還是建議忘記此招式。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
};
