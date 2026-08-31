export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: null, // NEEDS TRANSLATION
		winBattle: null, // NEEDS TRANSLATION
		tieBattle: null, // NEEDS TRANSLATION

		pokemon: "{NICKNAME}",
		opposingPokemon: "相手の {NICKNAME}",
		team: "味方",
		opposingTeam: "相手",
		party: "味方の ポケモン",
		opposingParty: "相手の ポケモン",

		turn: null, // NEEDS TRANSLATION
		switchIn: "{TRAINER}は {FULLNAME}を 繰り出した！",
		switchInOwn: "ゆけっ！ {FULLNAME}！",
		switchOut: "{TRAINER}は {NICKNAME}を 引っこめた！",
		switchOutOwn: "{NICKNAME} 戻れ！",
		drag: "{FULLNAME}は 戦闘に 引きずりだされた！",
		faint: "{POKEMON}は たおれた！",
		swap: "{POKEMON}と {TARGET}は 場所を 入れ替えた！",
		swapCenter: "{POKEMON}は 真ん中に 移動した！",

		// Multi Battles only
		canDynamax: "  {TRAINER}が ダイマックス できるように なった！",
		canDynamaxOwn: "  {TRAINER}に ダイマックスパワーが 集まった！",

		zEffect: "  {POKEMON}が 解き放つ 全力の Ｚワザ！",
		move: "{POKEMON}の **{MOVE}**！",
		abilityActivation: "[{POKEMON}の {ABILITY}]",

		mega: "  {POKEMON}の {ITEM}と {TRAINER}の キーストーンが 反応した！",
		megaNoItem: null, // NEEDS TRANSLATION
		megaGen6: "  {POKEMON}の {ITEM}と {TRAINER}の メガバングルが 反応した！",
		transformMega: "{POKEMON}は メガ{SPECIES}に メガシンカした！",
		primal: "{POKEMON}の ゲンシカイキ！ 原始の姿を 取り戻した！",
		zPower: "  {POKEMON}は Ｚパワーを 身体に まとった！",
		zBroken: "  {POKEMON}は 攻撃を 守りきれずに ダメージを 受けた！",
		terastallize: null, // NEEDS TRANSLATION

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "{POKEMON}は {MOVE}を 使えない！",
		cantNoMove: "{POKEMON}は みうごきが とれない！",
		fail: "  しかし うまく 決まらなかった！！",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "{POKEMON}の 姿が 変化した！",
		typeChange: "  {POKEMON}は {TYPE}タイプに なった！",
		typeChangeFromEffect: "  {POKEMON}は {EFFECT}で {TYPE}タイプに なった！",
		typeAdd: "  {POKEMON}に {TYPE}タイプが 追加された！",

		start: null, // NEEDS TRANSLATION
		end: "  {POKEMON}は {EFFECT}から 解放された！",
		activate: null, // NEEDS TRANSLATION
		startTeamEffect: null, // NEEDS TRANSLATION
		endTeamEffect: null, // NEEDS TRANSLATION
		startFieldEffect: null, // NEEDS TRANSLATION
		endFieldEffect: null, // NEEDS TRANSLATION

		changeAbility: "  {POKEMON}は {ABILITY}に なった！",
		addItem: "  {POKEMON}は {ITEM}を 手に入れた！",
		takeItem: "  {POKEMON}は {SOURCE}から {ITEM}を 奪い取った！",
		eatItem: null, // NEEDS TRANSLATION
		useGem: "  {ITEM}は {MOVE}の 威力を 強めた！",
		eatItemWeaken: "  {POKEMON}への ダメージを {ITEM}が 弱めた！",
		removeItem: null, // NEEDS TRANSLATION
		activateItem: null, // NEEDS TRANSLATION
		activateWeaken: "  {POKEMON}への ダメージを {ITEM}が 弱めた！",

		damage: "  ({POKEMON}は ダメージを 受けた！)",
		damagePercentage: null, // NEEDS TRANSLATION
		damageFromPokemon: "  {POKEMON}は {SOURCE}の {ITEM}で ダメージを 受けた！",
		damageFromItem: "  {POKEMON}は {ITEM}で ダメージを 受けた！",
		damageFromPartialTrapping: "  {POKEMON}は {MOVE}の ダメージを 受けている",
		heal: "  {POKEMON}の 体力が 回復した！",
		healFromZEffect: "  {POKEMON}は Ｚパワーで 体力を 回復した！",
		healFromEffect: null, // NEEDS TRANSLATION

		boost: "  {POKEMON}の {STAT}が 上がった！",
		boost2: "  {POKEMON}の {STAT}が ぐーんと上がった！",
		boost3: "  {POKEMON}の {STAT}が ぐぐーんと上がった！",
		boost0: "  {POKEMON}の {STAT}は もう 上がらない！",
		boostFromItem: null, // NEEDS TRANSLATION
		boost2FromItem: null, // NEEDS TRANSLATION
		boost3FromItem: "  {POKEMON}は {ITEM}で {STAT}が ぐぐーんと 上がった！",
		boostFromZEffect: "  {POKEMON}は Ｚパワーで {STAT}が 上がった！",
		boost2FromZEffect: "  {POKEMON}は Ｚパワーで {STAT}が ぐーんと 上がった！",
		boost3FromZEffect: "  {POKEMON}は Ｚパワーで {STAT}が ぐぐーんと 上がった！",
		boostMultipleFromZEffect: "  {POKEMON}は Ｚパワーで 能力が 上がった！",

		unboost: "  {POKEMON}の {STAT}が 下がった！",
		unboost2: "  {POKEMON}の {STAT}が がくっと下がった！",
		unboost3: "  {POKEMON}の {STAT}が がくーんと下がった！",
		unboost0: "  {POKEMON}の {STAT}は もう 下がらない！",
		unboostFromItem: null, // NEEDS TRANSLATION
		unboost2FromItem: null, // NEEDS TRANSLATION
		unboost3FromItem: null, // NEEDS TRANSLATION

		swapBoost: "  {POKEMON}は 相手と自分の 能力変化を 入れ替えた！",
		swapOffensiveBoost: "  {POKEMON}は 相手と自分の 攻撃と 特攻の 能力変化を 入れ替えた！",
		swapDefensiveBoost: "  {POKEMON}は 相手と自分の 防御と 特防の 能力変化を 入れ替えた！",
		copyBoost: "  {POKEMON}は {TARGET}の 能力変化を コピーした！",
		clearBoost: "  {POKEMON}の 能力変化が 元に戻った！",
		clearBoostFromZEffect: "  {POKEMON}は Ｚパワーで 下がった 能力を 元に戻した！",
		invertBoost: "  {POKEMON}は 能力変化が ひっくりかえった！",
		clearAllBoost: "  全ての ステータスが 元に 戻った！",

		superEffective: "  効果は バツグンだ！",
		superEffectiveSpread: "  {POKEMON}に 効果は バツグンだ！",
		resisted: "  効果は いまひとつだ",
		resistedSpread: "  {POKEMON}に 効果は いまひとつだ",
		// this is official text meaning 4x effective. do not QC this
		extremelyEffective: "  効果は ちょうバツグンだ！！",
		extremelyEffectiveSpread: "  {POKEMON}に 効果は ちょうバツグンだ！！",
		// this is official text meaning 1/4x effective. do not QC this
		mostlyIneffective: "  効果は かなりいまひとつだ",
		mostlyIneffectiveSpread: "  {POKEMON}に 効果は かなりいまひとつだ",
		crit: "  急所に 当たった！",
		critSpread: "  {POKEMON}の 急所に 当たった！",
		immune: "  {POKEMON}には 効果が ないようだ…",
		// from Emerald: しかし こうかが なかった！ (kana modernized to current kanji standards)
		immuneNoPokemon: "  しかし 効果が なかった！",
		immuneOHKO: "  {POKEMON}には 全然 効いてない！",
		miss: "  {POKEMON}には 当たらなかった！",
		missNoPokemon: "  しかし {SOURCE}の こうげきは はずれた！",

		center: "  リセットムーブ！！",
		noTarget: "  しかし あいてが いないので うまく きまらなかった！",
		ohko: "  一撃必殺！",
		combine: "  2つの技が 1つになった！ コンビネーション技だ！！", // XY ja_common 22838
		hitCount: "  {NUMBER}回 当たった！",
	},
	ui: {
		whatDo: null, // NEEDS TRANSLATION
		moveTarget: null, // NEEDS TRANSLATION
		reviveWho: null, // NEEDS TRANSLATION
		replaceWho: null, // NEEDS TRANSLATION
		teamStart: null, // NEEDS TRANSLATION
		teamRest: null, // NEEDS TRANSLATION
		chooseLead: null, // NEEDS TRANSLATION
		chooseSlot: null, // NEEDS TRANSLATION
		teamSoFar: null, // NEEDS TRANSLATION
		waitingOpponent: null, // NEEDS TRANSLATION
		cantSwitchTrapped: null, // NEEDS TRANSLATION
		usuallyMovesFirst: null, // NEEDS TRANSLATION
		almostAlwaysMovesFirst: null, // NEEDS TRANSLATION
		almostAlwaysMovesLast: null, // NEEDS TRANSLATION
		failsIfHP: null, // NEEDS TRANSLATION
		koSelfIfHP: null, // NEEDS TRANSLATION
		transformedInto: null, // NEEDS TRANSLATION
		changedForme: null, // NEEDS TRANSLATION
		possibleIllusion: null, // NEEDS TRANSLATION
		pixels: null, // NEEDS TRANSLATION
		wouldTakeIfAbilityRemoved: null, // NEEDS TRANSLATION
		nextDamage: null, // NEEDS TRANSLATION
		turnsAsleep: null, // NEEDS TRANSLATION
		illusionWarning: null, // NEEDS TRANSLATION
		pressureGen3Warning: null, // NEEDS TRANSLATION
		indistinguishableWarning: null, // NEEDS TRANSLATION
		noConditions: null, // NEEDS TRANSLATION
		afterStatModifiers: null, // NEEDS TRANSLATION
		calls: null, // NEEDS TRANSLATION
		base: null, // NEEDS TRANSLATION
		zEffectClearNegativeBoost: null, // NEEDS TRANSLATION
		zEffectCrit2: null, // NEEDS TRANSLATION
		zEffectHeal: null, // NEEDS TRANSLATION
		zEffectCurse: null, // NEEDS TRANSLATION
		zEffectRedirect: null, // NEEDS TRANSLATION
		zEffectHealReplacement: null, // NEEDS TRANSLATION
		ppRange: null, // NEEDS TRANSLATION
		revealed: null, // NEEDS TRANSLATION
		range: null, // NEEDS TRANSLATION
		beforeStatStages: null, // NEEDS TRANSLATION
		beforeExternalModifiers: null, // NEEDS TRANSLATION
		flingBerry: null, // NEEDS TRANSLATION
		flingWhiteHerb: null, // NEEDS TRANSLATION
		flingMentalHerb: null, // NEEDS TRANSLATION
		cantFling: null, // NEEDS TRANSLATION
		unobtainableInGen: null, // NEEDS TRANSLATION
		tagMoves: null, // NEEDS TRANSLATION
		notifyMoveTitle: null, // NEEDS TRANSLATION
		notifyMove: null, // NEEDS TRANSLATION
		notifyMoveAgainst: null, // NEEDS TRANSLATION
		notifySwitchTitle: null, // NEEDS TRANSLATION
		notifySwitch: null, // NEEDS TRANSLATION
		notifySwitchAgainst: null, // NEEDS TRANSLATION
		notifyTeamTitle: null, // NEEDS TRANSLATION
		notifyTeam: null, // NEEDS TRANSLATION
		notifyTeamAgainst: null, // NEEDS TRANSLATION
		mightBeDisabled: null, // NEEDS TRANSLATION
		mightBeLocked: null, // NEEDS TRANSLATION
		lockedExplanation: null, // NEEDS TRANSLATION
		mightBeTrapped: null, // NEEDS TRANSLATION
		autoChoice: null, // NEEDS TRANSLATION
		unrecognizedChoice: null, // NEEDS TRANSLATION
		lockedIntoMove: null, // NEEDS TRANSLATION
		willUseMove: null, // NEEDS TRANSLATION
		atTarget: null, // NEEDS TRANSLATION
		atSlot: null, // NEEDS TRANSLATION
		atAllyTarget: null, // NEEDS TRANSLATION
		atAllySlot: null, // NEEDS TRANSLATION
		actionMegaEvolve: null, // NEEDS TRANSLATION
		actionMegaEvolveX: null, // NEEDS TRANSLATION
		actionMegaEvolveY: null, // NEEDS TRANSLATION
		actionUltraBurst: null, // NEEDS TRANSLATION
		actionTerastallize: null, // NEEDS TRANSLATION
		actionDynamax: null, // NEEDS TRANSLATION
		actionGigantamax: null, // NEEDS TRANSLATION
		willRevive: null, // NEEDS TRANSLATION
		willSwitch: null, // NEEDS TRANSLATION
		willShift: null, // NEEDS TRANSLATION
		youPicked: null, // NEEDS TRANSLATION
		listComma: null, // NEEDS TRANSLATION
		effectivenessVs: null, // NEEDS TRANSLATION
		basePowerVs: null, // NEEDS TRANSLATION
		or: null, // NEEDS TRANSLATION
	},

	// statuses
	brn: {
		start: "  {POKEMON}は やけどを 負った！",
		startFromItem: "  {POKEMON}は {ITEM}で やけどを 負った！",
		alreadyStarted: "  {POKEMON}は すでに やけどを 負っている",
		end: "  {POKEMON}の やけどが 治った！", // SV ja_common 6567 / Champions btl_set
		endFromItem: "  {POKEMON}は {ITEM}で やけどが 治った！",
		damage: "  {POKEMON}は やけどの ダメージを 受けた！",
	},
	frz: {
		start: "  {POKEMON}は 凍りついた！",
		alreadyStarted: "  {POKEMON}は すでに 凍っている",
		end: "  {POKEMON}の こおりが 溶けた！",
		endFromItem: "  {POKEMON}は {ITEM}で こおり状態が 治った！",
		endFromMove: "  {POKEMON}の {MOVE}で こおりが 溶けた！",
		cant: "{POKEMON}は 凍ってしまって 動けない！",
	},
	par: {
		start: "  {POKEMON}は まひして 技が でにくくなった！",
		alreadyStarted: "  {POKEMON}は すでに まひしている",
		end: "  {POKEMON}の しびれが とれた！",
		endFromItem: "  {POKEMON}は {ITEM}で まひが 治った！",
		cant: "{POKEMON}は 体がしびれて 動けない！",
	},
	psn: {
		start: "  {POKEMON}は 毒を あびた！",
		alreadyStarted: "  {POKEMON}は すでに 毒を あびている",
		end: "  {POKEMON}の 毒は きれいさっぱり なくなった！",
		endFromItem: "  {POKEMON}は {ITEM}で 毒が 治った！",
		damage: "  {POKEMON}は 毒の ダメージを受けた！",
	},
	tox: {
		start: "  {POKEMON}は 猛毒を あびた！",
		startFromItem: "  {POKEMON}は {ITEM}で 猛毒を あびた！",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  {POKEMON}は 眠ってしまった！",
		startFromRest: "  {POKEMON}は 眠って 元気に なった！",
		alreadyStarted: "  {POKEMON}は すでに 眠っている",
		end: "  {POKEMON}は 目を 覚ました！",
		endFromItem: "  {POKEMON}は {ITEM}で 目を 覚ました！",
		cant: "{POKEMON}は ぐうぐう 眠っている",
	},

	// misc effects
	confusion: {
		start: "  {POKEMON}は 混乱した！",
		startFromFatigue: "  {POKEMON}は つかれ果てて 混乱した！",
		end: "  {POKEMON}の 混乱が 解けた！",
		endFromItem: "  {POKEMON}は {ITEM}で 混乱が 治った！",
		alreadyStarted: "  {POKEMON}は すでに 混乱している",
		activate: "  {POKEMON}は 混乱している！",
		damage: "わけも わからず 自分を 攻撃した！",
	},
	drain: {
		heal: "  {SOURCE}から 体力を 吸い取った！",
	},
	flinch: {
		cant: "{POKEMON}は ひるんで 技が だせない！",
	},
	heal: {
		fail: "  しかし {POKEMON}は 体力が 満タンだ！",
	},
	healreplacement: {
		activate: "  {POKEMON}は Ｚパワーで 入れ替え先の 味方を回復する！",
	},
	nopp: {
		cant: "{POKEMON}の **{MOVE}**！\n  しかし　技の 残りポイントが　なかった！",
	},
	recharge: {
		cant: "{POKEMON}は 攻撃の 反動で 動けない！",
	},
	recoil: {
		damage: "  {POKEMON}は 反動による ダメージを 受けた！",
	},
	unboost: {
		fail: "  {POKEMON}の {STAT}は 下がらない！", // per-stat form; SV ja_common:6483 「{POKEMON}の 攻撃は 下がらない！」
		failNoStat: "  {POKEMON}の 能力は 下がらない！", // SV ja_common:6479
	},
	struggle: {
		activate: "  {POKEMON}は だすことの できる技が ない！",
	},
	trapped: {
		start: "  {POKEMON}は もう 逃げられない！",
	},
	dynamax: {
		start: null, // NEEDS TRANSLATION
		end: null, // NEEDS TRANSLATION
		block: "  ダイマックスの ちからで はじかれた！",
		fail: "  {POKEMON}は 首を 横に振った この技を しかけることが できないようだ……",
	},

	// weather
	sandstorm: {
		weatherName: "すなあらし",
		start: "  砂あらしが 吹き始めた！",
		end: "  砂あらしが おさまった！",
		upkeep: "  (砂あらしが 吹きあれる！)",
		damage: "  砂あらしが {POKEMON}を 襲う！",
	},
	sunnyday: {
		weatherName: "にほんばれ",
		start: "  日差しが 強くなった！",
		end: "  日差しが 元に戻った！",
		upkeep: "  (ひざしが つよい)",
	},
	raindance: {
		weatherName: "あめ",
		start: "  雨が 降り始めた！",
		end: "  雨が 上がった！",
		upkeep: "  (あめが ふりつづいている)",
	},
	hail: {
		weatherName: "あられ",
		start: "  あられが 降り始めた！",
		end: "  あられが 止んだ！",
		upkeep: "  (あられが 吹きすさぶ！)",
		damage: "  あられが {POKEMON}を 襲う！",
	},
	snowscape: {
		weatherName: "ゆき",
		start: "  雪が 降り始めた！",
		end: "  雪が 止んだ！",
		upkeep: "  (雪が 吹きすさぶ！)",
	},
	desolateland: {
		weatherName: "おおひでり",
		start: "  日差しが とても強くなった！",
		end: "  日差しが 元に戻った！",
		block: "  強い日差しの 勢いは 止まらない！",
		blockMove: "  強い日差しの 影響で みずタイプの 攻撃が 蒸発した！",
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
		block: "  {POKEMON}は エレキフィールドに 守られている！",
	},
	grassyterrain: {
		start: "  足下に 草がおいしげった！",
		end: "  足下の 草が消え去った！",
		heal: "  {POKEMON}の 体力が 回復した！",
	},
	mistyterrain: {
		start: "  足下に 霧が立ち込めた！",
		end: "  足下の 霧が消え去った！",
		block: "  {POKEMON}は ミストフィールドに 守られている！",
	},
	psychicterrain: {
		start: "  足下が 不思議な感じに なった！",
		end: "  足下の 不思議感が 消え去った！",
		block: "  {POKEMON}は サイコフィールドに 守られている！",
	},

	// field effects
	gravity: {
		start: "  じゅうりょくが 強くなった！",
		end: "  じゅうりょくが 元に戻った！",
		cant: "{POKEMON}は じゅうりょくが 強くて {MOVE}が だせない！",
		activate: "{POKEMON}は じゅうりょくの 影響で 空中に いられなくなった！",
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
		start: "  {POKEMON}は 時空を ゆがめた！",
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
		damage: "  勢いあまって {POKEMON}は 地面に ぶつかった！",
	},
};
