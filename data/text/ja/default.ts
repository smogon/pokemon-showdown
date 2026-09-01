export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "{TRAINER1}と {TRAINER2}の 勝負が 始まった！", // NEEDS QC
		winBattle: "**{TRAINER}**が 勝負に 勝った！", // NEEDS QC
		tieBattle: "{TRAINER1}と {TRAINER2}の 勝負は 引き分けだ！", // NEEDS QC

		pokemon: "{NICKNAME}",
		opposingPokemon: "相手の {NICKNAME}",
		team: "味方",
		opposingTeam: "相手",
		party: "味方の ポケモン",
		opposingParty: "相手の ポケモン",

		turn: "== {NUMBER}ターン目 ==", // NEEDS QC
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
		megaNoItem: "  {POKEMON}と {TRAINER}の キーストーンが 反応した！", // NEEDS QC: modeled on ORAS ja_common 30388; Key Stone hardcoded per English
		megaGen6: "  {POKEMON}の {ITEM}と {TRAINER}の メガバングルが 反応した！",
		transformMega: "{POKEMON}は メガ{SPECIES}に メガシンカした！",
		primal: "{POKEMON}の ゲンシカイキ！ 原始の姿を 取り戻した！",
		zPower: "  {POKEMON}は Ｚパワーを 身体に まとった！",
		zBroken: "  {POKEMON}は 攻撃を 守りきれずに ダメージを 受けた！",
		terastallize: "  ({POKEMON}は {TYPE}タイプに テラスタルした！)", // NEEDS QC

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

		start: "  ({POKEMON}に {EFFECT}の 効果が 発生した！)", // NEEDS QC
		end: "  {POKEMON}は {EFFECT}から 解放された！",
		activate: "  ({EFFECT}が 発動した！)", // NEEDS QC
		startTeamEffect: "  ({TEAM}に {EFFECT}の 効果が 発生した！)", // NEEDS QC
		endTeamEffect: "  ({TEAM}の {EFFECT}の 効果が なくなった！)", // NEEDS QC
		startFieldEffect: "  ({EFFECT}の 効果が 発生した！)", // NEEDS QC
		endFieldEffect: "  ({EFFECT}の 効果が なくなった！)", // NEEDS QC

		changeAbility: "  {POKEMON}は {ABILITY}に なった！",
		addItem: "  {POKEMON}は {ITEM}を 手に入れた！",
		takeItem: "  {POKEMON}は {SOURCE}から {ITEM}を 奪い取った！",
		eatItem: "  ({POKEMON}は {ITEM}を 食べた！)", // NEEDS QC
		useGem: "  {ITEM}は {MOVE}の 威力を 強めた！",
		eatItemWeaken: "  {POKEMON}への ダメージを {ITEM}が 弱めた！",
		removeItem: "  {POKEMON}は {ITEM}を 失った！", // NEEDS QC
		activateItem: "  ({POKEMON}は {ITEM}を 使った！)", // NEEDS QC
		activateWeaken: "  {POKEMON}への ダメージを {ITEM}が 弱めた！",

		damage: "  ({POKEMON}は ダメージを 受けた！)",
		damagePercentage: "  ({POKEMON}は 体力の {PERCENTAGE}％を 失った！)", // NEEDS QC
		damageFromPokemon: "  {POKEMON}は {SOURCE}の {ITEM}で ダメージを 受けた！",
		damageFromItem: "  {POKEMON}は {ITEM}で ダメージを 受けた！",
		damageFromPartialTrapping: "  {POKEMON}は {MOVE}の ダメージを 受けている",
		heal: "  {POKEMON}の 体力が 回復した！",
		healFromZEffect: "  {POKEMON}は Ｚパワーで 体力を 回復した！",
		healFromEffect: "  {POKEMON}は {EFFECT}で 回復した！", // NEEDS QC

		boost: "  {POKEMON}の {STAT}が 上がった！",
		boost2: "  {POKEMON}の {STAT}が ぐーんと上がった！",
		boost3: "  {POKEMON}の {STAT}が ぐぐーんと上がった！",
		boost0: "  {POKEMON}の {STAT}は もう 上がらない！",
		boostFromItem: "  {POKEMON}は {ITEM}で {STAT}が 上がった！", // NEEDS QC: cf. SV ja_common 7479
		boost2FromItem: "  {POKEMON}は {ITEM}で {STAT}が ぐーんと 上がった！", // NEEDS QC: PS extension of SV 7479 pattern
		boost3FromItem: "  {POKEMON}は {ITEM}で {STAT}が ぐぐーんと 上がった！",
		boostFromZEffect: "  {POKEMON}は Ｚパワーで {STAT}が 上がった！",
		boost2FromZEffect: "  {POKEMON}は Ｚパワーで {STAT}が ぐーんと 上がった！",
		boost3FromZEffect: "  {POKEMON}は Ｚパワーで {STAT}が ぐぐーんと 上がった！",
		boostMultipleFromZEffect: "  {POKEMON}は Ｚパワーで 能力が 上がった！",

		unboost: "  {POKEMON}の {STAT}が 下がった！",
		unboost2: "  {POKEMON}の {STAT}が がくっと下がった！",
		unboost3: "  {POKEMON}の {STAT}が がくーんと下がった！",
		unboost0: "  {POKEMON}の {STAT}は もう 下がらない！",
		unboostFromItem: "  {POKEMON}は {ITEM}で {STAT}が 下がった！", // NEEDS QC
		unboost2FromItem: "  {POKEMON}は {ITEM}で {STAT}が がくっと 下がった！", // NEEDS QC
		unboost3FromItem: "  {POKEMON}は {ITEM}で {STAT}が がくーんと 下がった！", // NEEDS QC

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
		whatDo: "**{POKEMON}**は どうする？", // NEEDS QC
		moveTarget: "{POKEMON}は **{MOVE}**を どこに使う？", // NEEDS QC
		reviveWho: "**{POKEMON}**は だれを復活させる？", // NEEDS QC
		replaceWho: "**{POKEMON}**の代わりに だれを出す？", // NEEDS QC
		teamStart: "どのポケモンで始める？", // NEEDS QC
		teamRest: "残りのポケモンの順番は？", // NEEDS QC
		chooseLead: "先発を選択", // NEEDS QC
		chooseSlot: "{NUMBER}番目を選択", // NEEDS QC
		teamSoFar: "選択済み", // NEEDS QC
		waitingOpponent: "相手を待っています……", // NEEDS QC
		cantSwitchTrapped: "**にげられない**ので 交代できない！", // NEEDS QC
		usuallyMovesFirst: "たいてい先に動く（優先度+{PRIORITY}）。", // NEEDS QC
		almostAlwaysMovesFirst: "ほぼ必ず先に動く（優先度+{PRIORITY}）。", // NEEDS QC
		almostAlwaysMovesLast: "ほぼ必ず後に動く（優先度−{PRIORITY}）。", // NEEDS QC
		failsIfHP: "現在のHPが{HP}だと失敗する。", // NEEDS QC
		koSelfIfHP: "現在のHPがちょうど{HP}だと自分がひんしになる。", // NEEDS QC
		transformedInto: "（{SPECIES}にへんしん中）", // NEEDS QC
		changedForme: "（フォルムチェンジ中：{SPECIES}）", // NEEDS QC
		possibleIllusion: "イリュージョン候補 #{NUMBER}", // NEEDS QC
		pixels: "（{HP}/{MAXHP}ピクセル）", // NEEDS QC
		wouldTakeIfAbilityRemoved: "特性がなければ受けるダメージ：{PERCENT}%", // NEEDS QC
		nextDamage: "次のダメージ：{PERCENT}%", // NEEDS QC
		turnsAsleep: "ねむりの経過ターン数：{NUMBER}", // NEEDS QC
		illusionWarning: "（技が5つ以上あるのは、たいていゾロアークやゾロアのイリュージョンです。）", // NEEDS QC
		pressureGen3Warning: "（第3世代ではプレッシャーが表示されないため、正確なPP消費量がわからないことがあります。）", // NEEDS QC
		indistinguishableWarning: "（相手に見分けのつかないポケモンが2体いるため、どちらがどの技・特性・持ち物を持っているか判別できません。）", // NEEDS QC
		noConditions: "（場の状態なし）", // NEEDS QC
		turn: "（{NUMBER}ターン）", // NEEDS QC
		turns: "（{NUMBER}ターン）", // NEEDS QC
		afterStatModifiers: "（能力補正後：）", // NEEDS QC
		calls: "{MOVE}を使う", // NEEDS QC
		base: "（もとは{VALUE}）", // NEEDS QC
		zEffectClearNegativeBoost: "下がった能力ランクを元に戻す", // NEEDS QC
		zEffectCrit2: "急所率+2", // NEEDS QC
		zEffectHeal: "HPを全回復する", // NEEDS QC
		zEffectCurse: "ゴーストタイプならHPを全回復、それ以外なら攻撃+1", // NEEDS QC
		zEffectRedirect: "相手の攻撃を自分に向ける", // NEEDS QC
		zEffectHealReplacement: "交代で出てくるポケモンのHPを全回復する", // NEEDS QC
		ppRange: "（{LOW}〜{HIGH}）", // NEEDS QC
		revealed: "（判明済み）", // NEEDS QC
		range: "{LOW}〜{HIGH}", // NEEDS QC
		beforeStatStages: "（能力ランク変化前）", // NEEDS QC
		beforeExternalModifiers: "（外部補正前）", // NEEDS QC
		flingBerry: "きのみの効果を対象に発動させる。", // NEEDS QC
		flingWhiteHerb: "対象の下がった能力ランクを元に戻す。", // NEEDS QC
		flingMentalHerb: "対象のメロメロ・かなしばり・アンコール・かいふくふうじ・ちょうはつ・いちゃもんの効果を解除する。", // NEEDS QC
		cantFling: "この持ち物はなげつけるで投げられない。", // NEEDS QC
		unobtainableInGen: "第{NUMBER}世代では入手不可", // NEEDS QC
		tagMoves: "{TAG}の技", // NEEDS QC
		notifyMoveTitle: "技を選ぼう！", // NEEDS QC
		notifyMove: "バトルで技を選んでください", // NEEDS QC
		notifyMoveAgainst: "{OPPONENT}とのバトルで技を選んでください", // NEEDS QC
		notifySwitchTitle: "交代しよう！", // NEEDS QC
		notifySwitch: "バトルで交代するポケモンを選んでください", // NEEDS QC
		notifySwitchAgainst: "{OPPONENT}とのバトルで交代するポケモンを選んでください", // NEEDS QC
		notifyTeamTitle: "チームプレビュー！", // NEEDS QC
		notifyTeam: "バトルでチームの並び順を選んでください", // NEEDS QC
		notifyTeamAgainst: "{OPPONENT}とのバトルでチームの並び順を選んでください", // NEEDS QC
		mightBeDisabled: "使えない技がある**可能性**があるため、技の選択をキャンセルできません！", // NEEDS QC
		mightBeLocked: "技が固定されている**可能性**があります。", // NEEDS QC
		lockedExplanation: "（固定されている場合、交代できなくなります）", // NEEDS QC
		mightBeTrapped: "交代できなくなっている**可能性**があるため、交代をキャンセルできません！", // NEEDS QC
		autoChoice: "自動選択", // NEEDS QC
		unrecognizedChoice: "サーバーからの不明な選択：", // NEEDS QC
		lockedIntoMove: "{POKEMON}は技が固定されています。", // NEEDS QC
		willUseMove: "{POKEMON}は{ACTIONS}{AT}**{MOVE}**を使う。", // NEEDS QC
		atTarget: "{TARGET}に", // NEEDS QC
		atSlot: "{NUMBER}番の位置に", // NEEDS QC
		atAllyTarget: "味方の{TARGET}に", // NEEDS QC
		atAllySlot: "味方の{NUMBER}番の位置に", // NEEDS QC
		actionMegaEvolve: "**メガシンカ**して", // NEEDS QC
		actionMegaEvolveX: "**メガシンカ**（X）して", // NEEDS QC
		actionMegaEvolveY: "**メガシンカ**（Y）して", // NEEDS QC
		actionUltraBurst: "**ウルトラバースト**して", // NEEDS QC
		actionTerastallize: "テラスタル（**{TYPE}**）して", // NEEDS QC
		actionDynamax: "**ダイマックス**して", // NEEDS QC
		actionGigantamax: "**キョダイマックス**して", // NEEDS QC
		willRevive: "{POKEMON}は**{TARGET}**を復活させる。", // NEEDS QC
		willSwitch: "{POKEMON}は**{TARGET}**と交代する。", // NEEDS QC
		willShift: "{POKEMON}は中央に**移動**する。", // NEEDS QC
		youPicked: "{POKEMON}を選んだ。", // NEEDS QC
		listComma: "、", // NEEDS QC
		effectivenessVs: "{POKEMON}には{EFFECT}", // NEEDS QC
		basePowerVs: "{POKEMON}への{LABEL}", // NEEDS QC
		or: "か", // NEEDS QC
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
		start: "  ({POKEMON}は ダイマックスした！)", // NEEDS QC
		end: "  ({POKEMON}は 元の姿に 戻った！)", // NEEDS QC
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
