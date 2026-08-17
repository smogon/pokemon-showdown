export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "[TRAINER]と [TRAINER]の 勝負が 始まった！",
		winBattle: "**[TRAINER]**が 勝負に 勝った！",
		tieBattle: "[TRAINER]と [TRAINER]の 勝負は 引き分けだ！",

		pokemon: "[NICKNAME]",
		opposingPokemon: "相手の [NICKNAME]",
		team: "味方",
		opposingTeam: "相手",
		party: "味方の ポケモン",
		opposingParty: "相手の ポケモン",

		turn: "", // NOT CONVERTED: not in Champions
		switchIn: "[TRAINER]は [FULLNAME]を 繰り出した！",
		switchInOwn: "ゆけっ！ [FULLNAME]！",
		switchOut: "[TRAINER]は [NICKNAME]を 引っこめた！",
		switchOutOwn: "[NICKNAME] 戻れ！",
		drag: "[FULLNAME]は 戦闘に 引きずりだされた！",
		faint: "[POKEMON]は たおれた！",
		swap: "[POKEMON]と [TARGET]は 場所を 入れ替えた！",
		swapCenter: "[POKEMON]は 真ん中に 移動した！",

		// Multi Battles only
		canDynamax: "  [TRAINER]が ダイマックス できるように なった！",
		canDynamaxOwn: "  [TRAINER]に ダイマックスパワーが 集まった！",

		zEffect: "  [POKEMON]が 解き放つ 全力の Ｚワザ！",
		move: "[POKEMON]の **[MOVE]**！",
		abilityActivation: "[[POKEMON]の [ABILITY]]",

		mega: "", // NOT CONVERTED: not in Champions
		megaNoItem: "", // NOT CONVERTED: not in Champions
		megaGen6: "", // NOT CONVERTED: not in Champions
		transformMega: "[POKEMON]は メガ[SPECIES]に メガシンカした！",
		primal: "[POKEMON]の ゲンシカイキ！ 原始の姿を 取り戻した！",
		zPower: "  [POKEMON]は Ｚパワーを 身体に まとった！",
		zBroken: "  [POKEMON]は 攻撃を 守りきれずに ダメージを 受けた！",
		terastallize: "", // NOT CONVERTED: not in Champions

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON]は [MOVE]を 使えない！",
		cantNoMove: "", // NOT CONVERTED: not in Champions
		fail: "  しかし うまく 決まらなかった！！",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "[POKEMON]の 姿が 変化した！",
		typeChange: "  [POKEMON]は [TYPE]タイプに なった！",
		typeChangeFromEffect: "", // NOT CONVERTED: not in Champions
		typeAdd: "  [POKEMON]に [TYPE]タイプが 追加された！",

		start: "", // NOT CONVERTED: not in Champions
		end: "  [POKEMON]は [EFFECT]から 解放された！",
		activate: "", // NOT CONVERTED: not in Champions
		startTeamEffect: "", // NOT CONVERTED: not in Champions
		endTeamEffect: "", // NOT CONVERTED: not in Champions
		startFieldEffect: "", // NOT CONVERTED: not in Champions
		endFieldEffect: "", // NOT CONVERTED: not in Champions

		changeAbility: "  [POKEMON]は [ABILITY]に なった！",
		addItem: "  [POKEMON]は [ITEM]を 手に入れた！",
		takeItem: "  [POKEMON]は [SOURCE]から [ITEM]を 奪い取った！",
		eatItem: "", // NOT CONVERTED: not in Champions
		useGem: "  [ITEM]は [MOVE]の 威力を 強めた！",
		eatItemWeaken: "  [POKEMON]への ダメージを [ITEM]が 弱めた！",
		removeItem: "", // NOT CONVERTED: not in Champions
		activateItem: "", // NOT CONVERTED: not in Champions
		activateWeaken: "  [POKEMON]への ダメージを [ITEM]が 弱めた！",

		damage: "  ([POKEMON]は ダメージを 受けた！)",
		damagePercentage: "", // NOT CONVERTED: not in Champions
		damageFromPokemon: "", // NOT CONVERTED: not in Champions
		damageFromItem: "  [POKEMON]は [ITEM]で ダメージを 受けた！",
		damageFromPartialTrapping: "  [POKEMON]は [MOVE]の ダメージを 受けている",
		heal: "  [POKEMON]の 体力が 回復した！",
		healFromZEffect: "  [POKEMON]は Ｚパワーで 体力を 回復した！",
		healFromEffect: "", // NOT CONVERTED: not in Champions

		boost: "  [POKEMON]の [STAT]が 上がった！",
		boost2: "  [POKEMON]の [STAT]が ぐーんと上がった！",
		boost3: "  [POKEMON]の [STAT]が ぐぐーんと上がった！",
		boost0: "  [POKEMON]の [STAT]は もう 上がらない！",
		boostFromItem: "", // NOT CONVERTED: not in Champions
		boost2FromItem: "", // NOT CONVERTED: not in Champions
		boost3FromItem: "", // NOT CONVERTED: not in Champions
		boostFromZEffect: "", // NOT CONVERTED: not in Champions
		boost2FromZEffect: "", // NOT CONVERTED: not in Champions
		boost3FromZEffect: "", // NOT CONVERTED: not in Champions
		boostMultipleFromZEffect: "  [POKEMON]は Ｚパワーで 能力が 上がった！",

		unboost: "  [POKEMON]の [STAT]が 下がった！",
		unboost2: "  [POKEMON]の [STAT]が がくっと下がった！",
		unboost3: "  [POKEMON]の [STAT]が がくーんと下がった！",
		unboost0: "  [POKEMON]の [STAT]は もう 下がらない！",
		unboostFromItem: "", // NOT CONVERTED: not in Champions
		unboost2FromItem: "", // NOT CONVERTED: not in Champions
		unboost3FromItem: "", // NOT CONVERTED: not in Champions

		swapBoost: "  [POKEMON]は 相手と自分の 能力変化を 入れ替えた！",
		swapOffensiveBoost: "  [POKEMON]は 相手と自分の 攻撃と 特攻の 能力変化を 入れ替えた！",
		swapDefensiveBoost: "  [POKEMON]は 相手と自分の 防御と 特防の 能力変化を 入れ替えた！",
		copyBoost: "  [POKEMON]は [TARGET]の 能力変化を コピーした！",
		clearBoost: "  [POKEMON]の 能力変化が 元に戻った！",
		clearBoostFromZEffect: "  [POKEMON]は Ｚパワーで 下がった 能力を 元に戻した！",
		invertBoost: "  [POKEMON]は 能力変化が ひっくりかえった！",
		clearAllBoost: "  全ての ステータスが 元に 戻った！",

		superEffective: "  効果は バツグンだ！",
		superEffectiveSpread: "  [POKEMON]に 効果は バツグンだ！",
		resisted: "  効果は いまひとつだ",
		resistedSpread: "  [POKEMON]に 効果は いまひとつだ",
		extremelyEffective: "  効果は ちょうバツグンだ！！",
		extremelyEffectiveSpread: "  [POKEMON]に 効果は ちょうバツグンだ！！",
		mostlyIneffective: "  効果は かなりいまひとつだ",
		mostlyIneffectiveSpread: "  [POKEMON]に 効果は かなりいまひとつだ",
		crit: "  急所に 当たった！",
		critSpread: "  [POKEMON]の 急所に 当たった！",
		immune: "  [POKEMON]には 効果が ないようだ…",
		immuneNoPokemon: "", // NOT CONVERTED: not in Champions
		immuneOHKO: "  [POKEMON]には 全然 効いてない！",
		miss: "  [POKEMON]には 当たらなかった！",
		missNoPokemon: "", // NOT CONVERTED: not in Champions

		center: "  リセットムーブ！！",
		noTarget: "", // NOT CONVERTED: not in Champions
		ohko: "  一撃必殺！",
		combine: "  2つの技が 1つになった！ コンビネーション技だ！",
		hitCount: "  [NUMBER]回 当たった！",
		hitCountSingular: "  1回 当たった！",
	},

	// stats
	hp: {
		statName: "ＨＰ",
		statShortName: "ＨＰ",
	},
	atk: {
		statName: "攻撃",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	def: {
		statName: "防御",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spa: {
		statName: "特攻",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spd: {
		statName: "特防",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spe: {
		statName: "素早さ",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	accuracy: {
		statName: "命中率",
	},
	evasion: {
		statName: "回避率",
	},
	spc: {
		statName: "", // NOT CONVERTED: not in Champions
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	stats: {
		statName: "ステータス",
	},

	// statuses
	brn: {
		start: "  [POKEMON]は やけどを 負った！",
		startFromItem: "  [POKEMON]は [ITEM]で やけどを 負った！",
		alreadyStarted: "  [POKEMON]は すでに やけどを 負っている",
		end: "", // NOT CONVERTED: not in Champions
		endFromItem: "", // NOT CONVERTED: not in Champions
		damage: "  [POKEMON]は やけどの ダメージを 受けた！",
	},
	frz: {
		start: "  [POKEMON]は 凍りついた！",
		alreadyStarted: "  [POKEMON]は すでに 凍っている",
		end: "  [POKEMON]の こおりが 溶けた！",
		endFromItem: "  [POKEMON]は [ITEM]で こおり状態が 治った！",
		endFromMove: "  [POKEMON]の [MOVE]で こおりが 溶けた！",
		cant: "[POKEMON]は 凍ってしまって 動けない！",
	},
	par: {
		start: "  [POKEMON]は まひして 技が でにくくなった！",
		alreadyStarted: "  [POKEMON]は すでに まひしている",
		end: "  [POKEMON]の しびれが とれた！",
		endFromItem: "  [POKEMON]は [ITEM]で まひが 治った！",
		cant: "", // NOT CONVERTED: not in Champions
	},
	psn: {
		start: "  [POKEMON]は 毒を あびた！",
		alreadyStarted: "  [POKEMON]は すでに 毒を あびている",
		end: "  [POKEMON]の 毒は きれいさっぱり なくなった！",
		endFromItem: "  [POKEMON]は [ITEM]で 毒が 治った！",
		damage: "", // NOT CONVERTED: not in Champions
	},
	tox: {
		start: "  [POKEMON]は 猛毒を あびた！",
		startFromItem: "  [POKEMON]は [ITEM]で 猛毒を あびた！",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  [POKEMON]は 眠ってしまった！",
		startFromRest: "", // NOT CONVERTED: not in Champions
		alreadyStarted: "  [POKEMON]は すでに 眠っている",
		end: "  [POKEMON]は 目を 覚ました！",
		endFromItem: "  [POKEMON]は [ITEM]で 目を 覚ました！",
		cant: "[POKEMON]は ぐうぐう 眠っている",
	},

	// misc effects
	confusion: {
		start: "  [POKEMON]は 混乱した！",
		startFromFatigue: "  [POKEMON]は つかれ果てて 混乱した！",
		end: "  [POKEMON]の 混乱が 解けた！",
		endFromItem: "  [POKEMON]は [ITEM]で 混乱が 治った！",
		alreadyStarted: "  [POKEMON]は すでに 混乱している",
		activate: "  [POKEMON]は 混乱している！",
		damage: "わけも わからず 自分を 攻撃した！",
	},
	drain: {
		heal: "  [SOURCE]から 体力を 吸い取った！",
	},
	flinch: {
		cant: "[POKEMON]は ひるんで 技が だせない！",
	},
	heal: {
		fail: "  しかし [POKEMON]は 体力が 満タンだ！",
	},
	healreplacement: {
		activate: "", // NOT CONVERTED: not in Champions
	},
	nopp: {
		cant: "", // NOT CONVERTED: not in Champions
	},
	recharge: {
		cant: "[POKEMON]は 攻撃の 反動で 動けない！",
	},
	recoil: {
		damage: "  [POKEMON]は 反動による ダメージを 受けた！",
	},
	unboost: {
		fail: "  [POKEMON]の 能力は 下がらない！",
		failSingular: "", // NOT CONVERTED: not in Champions
	},
	struggle: {
		activate: "", // NOT CONVERTED: not in Champions
	},
	trapped: {
		start: "  [POKEMON]は もう 逃げられない！",
	},
	dynamax: {
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		block: "  ダイマックスの ちからで はじかれた！",
		fail: "  [POKEMON]は 首を 横に振った この技を しかけることが できないようだ……",
	},

	// weather
	sandstorm: {
		weatherName: "すなあらし状態",
		start: "  砂あらしが 吹き始めた！",
		end: "  砂あらしが おさまった！",
		upkeep: "  (砂あらしが 吹きあれる！)",
		damage: "  砂あらしが [POKEMON]を 襲う！",
	},
	sunnyday: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "  日差しが 強くなった！",
		end: "  日差しが 元に戻った！",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	raindance: {
		weatherName: "あめ状態",
		start: "  雨が 降り始めた！",
		end: "  雨が 上がった！",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	hail: {
		weatherName: "あられ",
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		upkeep: "", // NOT CONVERTED: not in Champions
		damage: "", // NOT CONVERTED: not in Champions
	},
	snowscape: {
		weatherName: "ゆき状態",
		start: "  雪が 降り始めた！",
		end: "  雪が 止んだ！",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	desolateland: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "  日差しが とても強くなった！",
		end: "", // NOT CONVERTED: not in Champions
		block: "  強い日差しの 勢いは 止まらない！",
		blockMove: "", // NOT CONVERTED: not in Champions
	},
	primordialsea: {
		weatherName: "おおあめ",
		start: "  強い雨が 降り始めた！",
		end: "  強い雨が 上がった！",
		block: "  強い雨の 勢いは 止まらない！",
		blockMove: "  強い雨の 影響で ほのおタイプの 攻撃が かき消された！",
	},
	deltastream: {
		weatherName: "らんきりゅう",
		start: "  謎の 乱気流が ひこうポケモンを 護る！",
		end: "  謎の 乱気流が おさまった！",
		activate: "  謎の 乱気流が 攻撃を 弱めた！",
		block: "  謎の 乱気流の 勢いは 止まらない！",
	},

	// terrain
	electricterrain: {
		start: "  足下に 電気が かけめぐる！",
		end: "  足下の 電気が 消え去った！",
		block: "  [POKEMON]は エレキフィールドに 守られている！",
	},
	grassyterrain: {
		start: "  足下に 草がおいしげった！",
		end: "  足下の 草が消え去った！",
		heal: "", // NOT CONVERTED: not in Champions
	},
	mistyterrain: {
		start: "  足下に 霧が立ち込めた！",
		end: "  足下の 霧が消え去った！",
		block: "  [POKEMON]は ミストフィールドに 守られている！",
	},
	psychicterrain: {
		start: "  足下が 不思議な感じに なった！",
		end: "  足下の 不思議感が 消え去った！",
		block: "  [POKEMON]は サイコフィールドに 守られている！",
	},

	// field effects
	gravity: {
		start: "  じゅうりょくが 強くなった！",
		end: "  じゅうりょくが 元に戻った！",
		cant: "[POKEMON]は じゅうりょくが 強くて [MOVE]が だせない！",
		activate: "[POKEMON]は じゅうりょくの 影響で 空中に いられなくなった！",
	},
	magicroom: {
		start: "  持たせた 道具の 効果が なくなる 空間を 作りだした！",
		end: "  マジックルームが 解除され 道具の 効果が 元に戻った！",
	},
	mudsport: {
		start: "  電気の 威力が 弱まった！",
		end: "  どろあそびの 効果が なくなった！",
	},
	trickroom: {
		start: "  [POKEMON]は 時空を ゆがめた！",
		end: "  ゆがんだ 時空が 元に戻った！",
	},
	watersport: {
		start: "  炎の 威力が 弱まった！",
		end: "  みずあそびの 効果が なくなった！",
	},
	wonderroom: {
		start: "  防御と 特防が 入れ替わる 空間を 作りだした！",
		end: "  ワンダールームが 解除され 防御と 特防が 元に戻った！",
	},

	// misc
	crash: {
		damage: "  勢いあまって [POKEMON]は 地面に ぶつかった！",
	},
};
