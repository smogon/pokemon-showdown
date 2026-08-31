// Mechanics desc style (ja): plain form (〜する。), no flavor-text spacing,
// halfwidth numerals. Terminology: 能力ランク (stat stage), 状態異常
// (non-volatile status), 直接攻撃 (contact move), 連続攻撃技 (multi-hit move),
// 場に出たとき (on switch-in), 切り捨て/切り上げ (rounded down/up),
// 間接ダメージ (indirect damage), このポケモン (this Pokemon).

// CAP (Create-A-Pokemon) entities have no official localized names: leave name null
//   (English shows via fallback) but translate the desc, using English names inline for
//   any CAP cross-references.
export const AbilitiesText: { [id: IDEntry]: AbilityText } = {
	noability: {
		name: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	adaptability: {
		name: "てきおうりょく",
		// Official flavor text: "自分と おなじ タイプの 技の 威力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	aerilate: {
		name: "スカイスキン",
		// Official flavor text: "ノーマルタイプの 技が ひこうタイプになる。 威力が 少し 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	aftermath: {
		name: "ゆうばく",
		// Official flavor text: "ひんしに なったとき 触った 相手に ダメージを あたえる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		damage: "  {POKEMON}は ダメージを 受けた！",
	},
	airlock: {
		name: "エアロック",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  天候の影響が なくなった！",
	},
	analytic: {
		name: "アナライズ",
		// Official flavor text: "いちばん 最後に 技を 出すと 技の 威力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	angerpoint: {
		name: "いかりのつぼ",
		// Official flavor text: "急所に 攻撃が 当たると 怒りくるって 攻撃力が 最大に なる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		boost: "  {POKEMON}は 攻撃が 最大まで 上がった！",
	},
	angershell: {
		name: "いかりのこうら",
		// Official flavor text: "相手の攻撃で HPが 半分に なると 怒りで 防御と 特防が 下がるが 攻撃 特攻 素早さが 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	anticipation: {
		name: "きけんよち",
		// Official flavor text: "相手の 持つ 危険な 技を 察知する ことができる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  {POKEMON}は みぶるいした！",
	},
	arenatrap: {
		name: "ありじごく",
		// Official flavor text: "戦闘で 相手を 逃げられなくする。"
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
		name: "テイルアーマー",
		// Official flavor text: "頭を包む 謎のしっぽが こちらに むかって 先制技を 出せない ようにする。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		block: "#damp",
	},
	aromaveil: {
		name: "アロマベール",
		// Official flavor text: "自分と 味方への メンタル 攻撃を 防ぐことが できる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		block: "  {POKEMON}は アロマベールに 守られている！",
	},
	asone: {
		name: "じんばいったい",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}は ふたつの 特性を あわせ持つ！",
	},
	asoneglastrier: {
		name: "じんばいったい（ブリザポス）", // PS-style disambiguator (not part of the official name)
		shortDesc: null, // NEEDS TRANSLATION
	},
	asonespectrier: {
		name: "じんばいったい（レイスポス）", // PS-style disambiguator (not part of the official name)
		shortDesc: null, // NEEDS TRANSLATION
	},
	aurabreak: {
		name: "オーラブレイク",
		// Official flavor text: "オーラの 効果を 逆転させて 威力を 下げる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}は すべての オーラを 制圧する！",
	},
	baddreams: {
		name: "ナイトメア",
		// Official flavor text: "ねむり状態の 相手に ダメージを あたえる。"
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

		damage: "  {POKEMON}は うなされている！",
	},
	ballfetch: {
		name: "たまひろい",
		shortDesc: null, // NEEDS TRANSLATION
	},
	battery: {
		name: "バッテリー",
		shortDesc: null, // NEEDS TRANSLATION
	},
	battlearmor: {
		name: "カブトアーマー",
		shortDesc: null, // NEEDS TRANSLATION
	},
	battlebond: {
		name: "きずなへんげ",
		// Official flavor text: "相手を 倒すと トレーナーとの キズナが 深まり サトシゲッコウガに 変化する。みずしゅりけんが 強くなる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
		activate: "  {POKEMON}に きずなの 力が みなぎった！",
		transform: "{POKEMON}は サトシゲッコウガに 変化した！",
	},
	beadsofruin: {
		name: "わざわいのたま",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}の わざわいのたまで まわりの 特防が 弱まった！",
	},
	beastboost: {
		name: "ビーストブースト",
		// Official flavor text: "相手を 倒したとき 自分の いちばん 高い 能力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	berserk: {
		name: "ぎゃくじょう",
		// Official flavor text: "相手の 攻撃で ＨＰが 半分に なると 特攻が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	bigpecks: {
		name: "はとむね",
		shortDesc: null, // NEEDS TRANSLATION
	},
	blaze: {
		name: "もうか",
		// Official flavor text: "ＨＰが 減ったとき ほのおタイプの 技の 威力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	bulletproof: {
		name: "ぼうだん",
		shortDesc: null, // NEEDS TRANSLATION
	},
	cheekpouch: {
		name: "ほおぶくろ",
		// Official flavor text: "どんな きのみでも 食べると ＨＰも 回復する。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	chillingneigh: {
		name: "しろのいななき",
		// Official flavor text: "相手を 倒すと 冷たい 声で いなないて 攻撃が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	chlorophyll: {
		name: "ようりょくそ",
		// Official flavor text: "天気が 晴れのとき 素早さが 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	clearbody: {
		name: "クリアボディ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	cloudnine: {
		name: "ノーてんき",
		shortDesc: null, // NEEDS TRANSLATION

		start: "#airlock",
	},
	colorchange: {
		name: "へんしょく",
		// Official flavor text: "相手から 受けた 技の タイプに 自分の タイプが 変化 する。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	comatose: {
		name: "ぜったいねむり",
		// Official flavor text: "つねに 夢うつつの 状態で 絶対に 目覚めない。 眠ったまま 攻撃が できる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}は 夢うつつの 状態！",
	},
	commander: {
		name: "しれいとう",
		// Official flavor text: "登場したとき 味方に ヘイラッシャが いると 口の中に 入って そこから 指令を だす。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}は しれいとう として {TARGET}に 飲みこまれた！",
	},
	competitive: {
		name: "かちき",
		// Official flavor text: "能力を 下げられると 特攻が ぐーんと 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	compoundeyes: {
		name: "ふくがん",
		shortDesc: null, // NEEDS TRANSLATION
	},
	contrary: {
		name: "あまのじゃく",
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	corrosion: {
		name: "ふしょく",
		shortDesc: null, // NEEDS TRANSLATION
	},
	costar: {
		name: "きょうえん",
		shortDesc: null, // NEEDS TRANSLATION
	},
	cottondown: {
		name: "わたげ",
		// Official flavor text: "攻撃を 受けると わたげを ばらまいて 自分以外の ポケモン すべての 素早さを 下げる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	cudchew: {
		name: "はんすう",
		shortDesc: null, // NEEDS TRANSLATION
	},
	curiousmedicine: {
		name: "きみょうなくすり",
		shortDesc: null, // NEEDS TRANSLATION
	},
	cursedbody: {
		name: "のろわれボディ",
		// Official flavor text: "攻撃を 受けると 相手の 技を かなしばり状態に することが ある。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	cutecharm: {
		name: "メロメロボディ",
		// Official flavor text: "自分に 触った 相手を メロメロに することが ある。"
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
		name: "しめりけ",
		// Official flavor text: "あたりを 湿らせることに よって じばく などの 爆発する 技を だれも 使えなくなる。"
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

		block: "  {SOURCE}は {MOVE}を 使えない！",
	},
	dancer: {
		name: "おどりこ",
		// Official flavor text: "だれかが 踊り技を 使うと 自分も それに 続いて 踊り技を 出すことが できる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	darkaura: {
		name: "ダークオーラ",
		// Official flavor text: "全員の あくタイプの 技が 強くなる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}は ダークオーラを 放っている！",
	},
	dauntlessshield: {
		name: "ふくつのたて",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	dazzling: {
		name: "ビビッドボディ",
		// Official flavor text: "相手を びっくり させて こちらに むかって 先制技を 出せない ようにする。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		block: "#damp",
	},
	defeatist: {
		name: "よわき",
		// Official flavor text: "ＨＰが 半分に なると 弱気に なって 攻撃と 特攻が 半減する。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	defiant: {
		name: "まけんき",
		// Official flavor text: "能力を 下げられると 攻撃が ぐーんと 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	deltastream: {
		name: "デルタストリーム",
		// Official flavor text: "ひこうタイプの 弱点が なくなる 天気にする。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	desolateland: {
		name: "おわりのだいち",
		// Official flavor text: "みずタイプの 攻撃を 受けない 天気にする。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	disguise: {
		name: "ばけのかわ",
		// Official flavor text: "体を 被う 化けの皮で １回 攻撃を 防ぐことが できる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		block: "  ばけのかわが みがわりに なった！",
		transform: "{POKEMON}の ばけのかわが はがれた！",
	},
	download: {
		name: "ダウンロード",
		// Official flavor text: "相手の 防御と 特防を くらべて 低い ほうの 能力に あわせて 自分の 攻撃か 特攻を 上げる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonize: {
		name: "ドラゴンスキン",
		// Official flavor text: "ノーマルタイプの技がドラゴンタイプになり 威力が1.2倍になる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	dragonsmaw: {
		name: "りゅうのあぎと",
		shortDesc: null, // NEEDS TRANSLATION
	},
	drizzle: {
		name: "あめふらし",
		shortDesc: null, // NEEDS TRANSLATION
	},
	drought: {
		name: "ひでり",
		shortDesc: null, // NEEDS TRANSLATION
	},
	dryskin: {
		name: "かんそうはだ",
		// Official flavor text: "天気が 雨の時や みずタイプの 技で ＨＰが 回復し はれの時や ほのおタイプの 技で 減ってしまう。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},

		damage: "#aftermath",
	},
	earlybird: {
		name: "はやおき",
		shortDesc: null, // NEEDS TRANSLATION
	},
	eartheater: {
		name: "どしょく",
		// Official flavor text: "じめんタイプの 技を 受けると ダメージを 受けずに 回復する。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	eelevate: {
		name: "うなぎのぼり",
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	effectspore: {
		name: "ほうし",
		// Official flavor text: "攻撃で 自分に 触れた 相手を どくや まひや ねむり状態に する ことがある。"
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
		name: "エレキメイカー",
		shortDesc: null, // NEEDS TRANSLATION
	},
	electromorphosis: {
		name: "でんきにかえる",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}は {MOVE}を 受けて 充電した！",
	},
	embodyaspectcornerstone: {
		name: "おもかげやどし（いしずえ）", // PS-style disambiguator (not part of the official name)
		shortDesc: null, // NEEDS TRANSLATION

		boost: "  {POKEMON}は 礎の仮面を かがやかせ 防御が 上がった！",
	},
	embodyaspecthearthflame: {
		name: "おもかげやどし（かまど）", // PS-style disambiguator (not part of the official name)
		shortDesc: null, // NEEDS TRANSLATION

		boost: "  {POKEMON}は 竈の仮面を かがやかせ 攻撃が 上がった！",
	},
	embodyaspectteal: {
		name: "おもかげやどし（みどり）", // PS-style disambiguator (not part of the official name)
		shortDesc: null, // NEEDS TRANSLATION

		boost: "  {POKEMON}は 碧の仮面を かがやかせ 素早さが 上がった！",
	},
	embodyaspectwellspring: {
		name: "おもかげやどし（いど）", // PS-style disambiguator (not part of the official name)
		shortDesc: null, // NEEDS TRANSLATION

		boost: "  {POKEMON}は 井戸の仮面を かがやかせ 特防が 上がった！",
	},
	emergencyexit: {
		name: "ききかいひ",
		// Official flavor text: "ＨＰが 半分に なると 危険を 回避するため 手持ちに 引っ込んで しまう。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	fairyaura: {
		name: "フェアリーオーラ",
		// Official flavor text: "全員の フェアリータイプの 技が 強くなる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}は フェアリーオーラを 放っている！",
	},
	filter: {
		name: "フィルター",
		shortDesc: null, // NEEDS TRANSLATION
	},
	firemane: {
		name: "ほのおのたてがみ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	flamebody: {
		name: "ほのおのからだ",
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
		name: "ねつぼうそう",
		// Official flavor text: "やけど状態に なったとき 特殊技の 威力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	flashfire: {
		name: "もらいび",
		// Official flavor text: "ほのおタイプの 技を 受けると 炎を もらい 自分が 出す ほのおタイプの 技が 強くなる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}は ほのおの 威力が 上がった！",
	},
	flowergift: {
		name: "フラワーギフト",
		// Official flavor text: "天気が 晴れのとき 自分と 味方の 攻撃と 特防の 能力が 上がる。"
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
		name: "フラワーベール",
		// Official flavor text: "味方の 草ポケモンは 能力が 下がらず 状態異常にも ならない。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		block: "  {POKEMON}は フラワーベールに 守られている！",
	},
	fluffy: {
		name: "もふもふ",
		// Official flavor text: "相手から 受けた 接触する 技の ダメージを 半減するが ほのおタイプの 技の ダメージは ２倍になる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	forecast: {
		name: "てんきや",
		// Official flavor text: "天気の 影響を 受けて みずタイプ ほのおタイプ こおりタイプの どれかに 変化する。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	forewarn: {
		name: "よちむ",
		// Official flavor text: "登場 したとき 相手の 持つ 技を ひとつだけ 読み取る。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  {TARGET}の {MOVE} を 読み取った！",
		activateNoTarget: "  {POKEMON}は よちむで {MOVE}を よみとった！",
	},
	friendguard: {
		name: "フレンドガード",
		shortDesc: null, // NEEDS TRANSLATION
	},
	frisk: {
		name: "おみとおし",
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			shortDesc: null, // NEEDS TRANSLATION
		},

		activate: "  {POKEMON}は {TARGET}の {ITEM}を お見通しだ！",
		activateNoTarget: "  {POKEMON}は {ITEM} を お見通しだ！",
	},
	fullmetalbody: {
		name: "メタルプロテクト",
		shortDesc: null, // NEEDS TRANSLATION
	},
	furcoat: {
		name: "ファーコート",
		shortDesc: null, // NEEDS TRANSLATION
	},
	galewings: {
		name: "はやてのつばさ",
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	galvanize: {
		name: "エレキスキン",
		// Official flavor text: "ノーマルタイプの 技が でんきタイプになる。 威力が 少し 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gluttony: {
		name: "くいしんぼう",
		// Official flavor text: "ＨＰが 少なくなったら 食べる きのみを ＨＰ 半分の 時に 食べてしまう。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	goodasgold: {
		name: "おうごんのからだ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	gooey: {
		name: "ぬめぬめ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	gorillatactics: {
		name: "ごりむちゅう",
		// Official flavor text: "攻撃は 上がるが 最初に 選んだ 技しか 出せなくなる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	grasspelt: {
		name: "くさのけがわ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	grassysurge: {
		name: "グラスメイカー",
		shortDesc: null, // NEEDS TRANSLATION
	},
	grimneigh: {
		name: "くろのいななき",
		// Official flavor text: "相手を 倒すと 恐ろしい 声で いなないて 特攻が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	guarddog: {
		name: "ばんけん",
		// Official flavor text: "いかく されると 攻撃が 上がる。 ポケモンを 入れ替えさせる 技や 道具が 効かない。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	gulpmissile: {
		name: "うのミサイル",
		// Official flavor text: "なみのりか ダイビングを すると 獲物を くわえてくる。 ダメージを 受けると 獲物を 吐きだして 攻撃。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	guts: {
		name: "こんじょう",
		// Official flavor text: "状態異常に なると 根性を だして 攻撃が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hadronengine: {
		name: "ハドロンエンジン",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}は エレキフィールドを はり 未来の機関を 躍動させる！！",
		activate: "  {POKEMON}は エレキフィールドで 未来の機関を 躍動させる！！",
	},
	harvest: {
		name: "しゅうかく",
		// Official flavor text: "使った きのみを 何回も 作りだす。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		addItem: "  {POKEMON}は {ITEM}を 収穫した！",
	},
	healer: {
		name: "いやしのこころ",
		// Official flavor text: "状態異常の 味方を たまに 治してあげる。"
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
		name: "たいねつ",
		// Official flavor text: "耐熱の 体に よって ほのおタイプの 技の 威力を 半減させる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	heavymetal: {
		name: "ヘヴィメタル",
		// Official flavor text: "自分の 重さが ２倍に なる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	honeygather: {
		name: "みつあつめ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	hospitality: {
		name: "おもてなし",
		shortDesc: null, // NEEDS TRANSLATION

		heal: "  {SOURCE}が たてた お茶を {POKEMON}は 飲みほした！",
	},
	hugepower: {
		name: "ちからもち",
		shortDesc: null, // NEEDS TRANSLATION
	},
	hungerswitch: {
		name: "はらぺこスイッチ",
		// Official flavor text: "ターンの 終わりに まんぷくもよう はらぺこもよう まんぷくもよう……と 交互に 姿を 変える。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hustle: {
		name: "はりきり",
		// Official flavor text: "自分の 攻撃が 高くなるが 命中率が 下がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	hydration: {
		name: "うるおいボディ",
		// Official flavor text: "天気が 雨のとき 状態異常が 治る。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	hypercutter: {
		name: "かいりきバサミ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	icebody: {
		name: "アイスボディ",
		// Official flavor text: "天気が あられのとき ＨＰを 少しずつ 回復 する。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	iceface: {
		name: "アイスフェイス",
		// Official flavor text: "物理攻撃は 頭の 氷が みがわりに なるが 姿も 変わる。 氷は あられが 降ると 元に戻る。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	icescales: {
		name: "こおりのりんぷん",
		shortDesc: null, // NEEDS TRANSLATION
	},
	illuminate: {
		name: "はっこう",
		// Official flavor text: "あたりを 明るくする ことで 野生の ポケモンに 遭遇 しやすくなる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	illusion: {
		name: "イリュージョン",
		// Official flavor text: "手持ちの いちばん うしろに いる ポケモンに なりきって 登場して 相手を 化かす。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		end: "  {POKEMON}の イリュージョンが 解けた！",
	},
	immunity: {
		name: "めんえき",
		shortDesc: null, // NEEDS TRANSLATION
	},
	imposter: {
		name: "かわりもの",
		// Official flavor text: "目の前の ポケモンに 変身 してしまう。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	infiltrator: {
		name: "すりぬけ",
		// Official flavor text: "相手の 壁や 身代わりを すりぬけて 攻撃 できる"
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
		name: "とびだすなかみ",
		// Official flavor text: "相手に 倒されたとき ＨＰの 残りの ぶんだけ 相手に ダメージを あたえる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		damage: "#aftermath",
	},
	innerfocus: {
		name: "せいしんりょく",
		// Official flavor text: "鍛えられた 精神に よって 相手の 攻撃に ひるまない。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	insomnia: {
		name: "ふみん",
		shortDesc: null, // NEEDS TRANSLATION
	},
	intimidate: {
		name: "いかく",
		// Official flavor text: "登場 したとき 威嚇して 相手を 萎縮させ 相手の 攻撃を 下げて しまう。"
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
		name: "ふとうのけん",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	ironbarbs: {
		name: "てつのトゲ",
		// Official flavor text: "自分に 触った 相手に 鉄のトゲで ダメージを あたえる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		damage: "#roughskin",
	},
	ironfist: {
		name: "てつのこぶし",
		// Official flavor text: "パンチを 使う 技の 威力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	justified: {
		name: "せいぎのこころ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	keeneye: {
		name: "するどいめ",
		// Official flavor text: "鋭い 目の おかげで 命中率を 下げられない。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	klutz: {
		name: "ぶきよう",
		// Official flavor text: "持っている 道具を 使うことが できない。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	leafguard: {
		name: "リーフガード",
		// Official flavor text: "天気が 晴れのときは 状態異常に ならない。"
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
		name: "ふゆう",
		// Official flavor text: "地面から 浮くことによって じめんタイプの 技を 受けない。"
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
		name: "リベロ",
		// Official flavor text: "自分が 出す 技と 同じ タイプに 変化する。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	lightmetal: {
		name: "ライトメタル",
		// Official flavor text: "自分の 重さが 半分に なる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	lightningrod: {
		name: "ひらいしん",
		// Official flavor text: "でんきタイプの 技を 自分に 寄せつけ ダメージを 受けずに 特攻が 上がる。"
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

		activate: "  {POKEMON}は 攻撃を 引き寄せた！",
	},
	limber: {
		name: "じゅうなん",
		shortDesc: null, // NEEDS TRANSLATION
	},
	lingeringaroma: {
		name: "とれないにおい",
		// Official flavor text: "相手に 触られると とれないにおいが 相手に うつってしまう。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},

		changeAbility: "  {TARGET}は においが うつって とれなくなっちゃった！",
	},
	liquidooze: {
		name: "ヘドロえき",
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		damage: "  {POKEMON}は ヘドロえきを 吸い取った！",
	},
	liquidvoice: {
		name: "うるおいボイス",
		// Official flavor text: "すべての 音技が みずタイプに なる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	longreach: {
		name: "えんかく",
		shortDesc: null, // NEEDS TRANSLATION
	},
	magicbounce: {
		name: "マジックミラー",
		// Official flavor text: "相手に だされた 変化技を 受けずに そのまま 返す ことが できる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen5: {
			desc: null, // NEEDS TRANSLATION
		},

		move: "#magiccoat",
	},
	magicguard: {
		name: "マジックガード",
		// Official flavor text: "攻撃 以外では ダメージを 受けない。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	magician: {
		name: "マジシャン",
		// Official flavor text: "技を 当てた 相手の 道具を 奪ってしまう。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	magmaarmor: {
		name: "マグマのよろい",
		shortDesc: null, // NEEDS TRANSLATION
	},
	magnetpull: {
		name: "じりょく",
		// Official flavor text: "はがねタイプの ポケモンを 磁力で 引きつけて 逃げられなくする。"
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
		name: "ふしぎなうろこ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	megalauncher: {
		name: "メガランチャー",
		// Official flavor text: "波動の 技の 威力が 高くなる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	megasol: {
		name: "メガソーラー",
		shortDesc: null, // NEEDS TRANSLATION
	},
	merciless: {
		name: "ひとでなし",
		shortDesc: null, // NEEDS TRANSLATION
	},
	mimicry: {
		name: "ぎたい",
		// Official flavor text: "フィールドの 状態に あわせて ポケモンの タイプが 変わる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}は タイプが 元に 戻った！",
	},
	mindseye: {
		name: "しんがん",
		// Official flavor text: "ノーマル かくとうタイプの技を ゴーストタイプに 当てることが できる。 相手の 回避率の 変化を 無視し 命中率も 下げられない。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	minus: {
		name: "マイナス",
		// Official flavor text: "プラスか マイナスの 特性を 持つ ポケモンが 仲間に いると 自分の 特攻が 上がる。"
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
		name: "ミラーアーマー",
		// Official flavor text: "自分が 受けた 能力 ダウンの 効果 だけを 跳ね返す。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	mistysurge: {
		name: "ミストメイカー",
		shortDesc: null, // NEEDS TRANSLATION
	},
	moldbreaker: {
		name: "かたやぶり",
		// Official flavor text: "相手の 特性に ジャマされる ことなく 相手に 技を 出すことが できる。"
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

		start: "  {POKEMON}は かたやぶりだ！",
	},
	moody: {
		name: "ムラっけ",
		// Official flavor text: "毎ターン 能力の どれかが ぐーんと 上がって どれかが 下がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	motordrive: {
		name: "でんきエンジン",
		// Official flavor text: "でんきタイプの 技を 受けると ダメージを 受けずに 素早さが 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	moxie: {
		name: "じしんかじょう",
		// Official flavor text: "相手を 倒すと 自信が ついて 攻撃が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	multiscale: {
		name: "マルチスケイル",
		shortDesc: null, // NEEDS TRANSLATION
	},
	multitype: {
		name: "マルチタイプ",
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
		name: "ミイラ",
		// Official flavor text: "相手に 触られると 相手を ミイラに してしまう。"
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

		changeAbility: "  {TARGET}は 特性が ミイラになっちゃった！",
	},
	myceliummight: {
		name: "きんしのちから",
		// Official flavor text: "変化技を 出すとき 必ず 行動が 遅くなるが 相手の 特性に ジャマされない。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	naturalcure: {
		name: "しぜんかいふく",
		shortDesc: null, // NEEDS TRANSLATION

		activate: null, // NEEDS TRANSLATION
	},
	neuroforce: {
		name: "ブレインフォース",
		// Official flavor text: "効果バツグンの 攻撃で 威力が さらに 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	neutralizinggas: {
		name: "かがくへんかガス",
		// Official flavor text: "かがくへんかガスの ポケモンが 場にいると すべての ポケモンの 特性の 効果が 消えたり 発動 しなくなる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  あたりに かがくへんかガスが 充満した！",
		end: "  かがくへんかガスの 効果が 切れた！",
	},
	noguard: {
		name: "ノーガード",
		shortDesc: null, // NEEDS TRANSLATION
	},
	normalize: {
		name: "ノーマルスキン",
		// Official flavor text: "どんな タイプの 技でも すべて ノーマルタイプに なる。 威力が 少し 上がる。"
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
		name: "どんかん",
		// Official flavor text: "鈍感なので メロメロや ちょうはつ状態に ならない。"
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
		name: "びんじょう",
		shortDesc: null, // NEEDS TRANSLATION
	},
	orichalcumpulse: {
		name: "ひひいろのこどう",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}は ひざしを 強め 古代の鼓動が 暴れだす！！",
		activate: "  {POKEMON}は ひざしを 受けて 古代の鼓動が 暴れだす！！",
	},
	overcoat: {
		name: "ぼうじん",
		// Official flavor text: "すなあらしや あられなどの ダメージを 受けない。 粉の 技を 受けない。"
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
		name: "しんりょく",
		// Official flavor text: "ＨＰが 減ったとき くさタイプの 技の 威力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	owntempo: {
		name: "マイペース",
		// Official flavor text: "マイペースなので こんらん状態に ならない。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	parentalbond: {
		name: "おやこあい",
		// Official flavor text: "親子 ２匹で ２回 攻撃することが できる。"
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
		name: "パステルベール",
		// Official flavor text: "自分も 味方も どくの 状態異常を 受けなくなる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	perishbody: {
		name: "ほろびのボディ",
		// Official flavor text: "接触する 技を 受けると お互い ３ターン たつと ひんしになる。 交代すると 効果は なくなる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  おたがいは ３ターン後に 滅びてしまう！",
	},
	pickpocket: {
		name: "わるいてぐせ",
		// Official flavor text: "触られた 相手の 道具を 盗んで しまう。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	pickup: {
		name: "ものひろい",
		// Official flavor text: "相手の 使った 道具を 拾ってくることが ある。 冒険中も 拾ってくる。"
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
		name: "かんつうドリル",
		shortDesc: null, // NEEDS TRANSLATION
	},
	pixilate: {
		name: "フェアリースキン",
		// Official flavor text: "ノーマルタイプの 技が フェアリータイプになる。 威力が 少し 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	plus: {
		name: "プラス",
		// Official flavor text: "プラスか マイナスの 特性を 持つ ポケモンが 仲間に いると 自分の 特攻が 上がる。"
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
		name: "ポイズンヒール",
		// Official flavor text: "どく状態に なると ＨＰが 減らずに 増えていく。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	poisonpoint: {
		name: "どくのトゲ",
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
		name: "どくくぐつ",
		// Official flavor text: "モモワロウの 技によって どく状態に なった 相手は こんらん状態にも なってしまう。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	poisontouch: {
		name: "どくしゅ",
		// Official flavor text: "触る だけで 相手を どく 状態に することがある。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	powerconstruct: {
		name: "スワームチェンジ",
		// Official flavor text: "ＨＰが 半分に なると セルたちが 応援に 駆けつけ パーフェクトフォルムに 姿を 変える。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  たくさんの 気配を 感じる……！",
		transform: "{POKEMON}は パーフェクトフォルムに 変わった！",
	},
	powerofalchemy: {
		name: "かがくのちから",
		// Official flavor text: "倒された 味方の 特性を 受け継ぎ 同じ 特性に 変わる。"
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
		name: "パワースポット",
		// Official flavor text: "隣に いるだけで 技の 威力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	prankster: {
		name: "いたずらごころ",
		// Official flavor text: "変化技を 先制で 出すことが できる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	pressure: {
		name: "プレッシャー",
		// Official flavor text: "プレッシャーを あたえて 相手の 使う 技の ＰＰを 多く 減らす。"
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

		start: "  {POKEMON}は プレッシャーを 放っている！",
	},
	primordialsea: {
		name: "はじまりのうみ",
		// Official flavor text: "ほのおタイプの 攻撃を 受けない 天気にする。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	prismarmor: {
		name: "プリズムアーマー",
		shortDesc: null, // NEEDS TRANSLATION
	},
	propellertail: {
		name: "スクリューおびれ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	protean: {
		name: "へんげんじざい",
		// Official flavor text: "自分が 出す 技と 同じ タイプに 変化する。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	protosynthesis: {
		name: "こだいかっせい",
		// Official flavor text: "ブーストエナジーを 持たせるか 天気が 晴れのとき いちばん 高い能力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}は にほんばれで こだいかっせいを 発動した！",
		activateFromItem: "  {POKEMON}は ブーストエナジーで こだいかっせいを 発動した！",
		start: "  {POKEMON}の {STAT}が 高まった！",
		end: "  {POKEMON}は こだいかっせいの 効果が 切れた！",
	},
	psychicsurge: {
		name: "サイコメイカー",
		shortDesc: null, // NEEDS TRANSLATION
	},
	punkrock: {
		name: "パンクロック",
		// Official flavor text: "音技の 威力が 上がる。 受けた 音技の ダメージは 半分に なる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	purepower: {
		name: "ヨガパワー",
		shortDesc: null, // NEEDS TRANSLATION
	},
	purifyingsalt: {
		name: "きよめのしお",
		// Official flavor text: "清らかな塩で 状態異常に ならない。 ゴーストタイプの 技の ダメージを 半減させる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	quarkdrive: {
		name: "クォークチャージ",
		// Official flavor text: "ブーストエナジーを 持たせるか エレキフィールドのとき いちばん 高い能力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}は エレキフィールドで クォークチャージを 発動した！",
		activateFromItem: "  {POKEMON}は ブーストエナジーで クォークチャージを 発動した！",
		start: "  {POKEMON}の {STAT}が 高まった！",
		end: "  {POKEMON}は クォークチャージの 効果が 切れた！",
	},
	queenlymajesty: {
		name: "じょおうのいげん",
		// Official flavor text: "相手に 威圧感を あたえ こちらに むかって 先制技を 出せない ようにする。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		block: "#damp",
	},
	quickdraw: {
		name: "クイックドロウ",
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}は クイックドロウで 行動が はやくなった！",
	},
	quickfeet: {
		name: "はやあし",
		// Official flavor text: "状態異常に なると 素早さが 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	raindish: {
		name: "あめうけざら",
		// Official flavor text: "天気が 雨のとき 少しずつ ＨＰを 回復する。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	rattled: {
		name: "びびり",
		// Official flavor text: "あくタイプと ゴーストタイプと むしタイプの 技を 受けると びびって 素早さが 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	receiver: {
		name: "レシーバー",
		// Official flavor text: "倒された 味方の 特性を 受け継いで 同じ 特性に なる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},

		changeAbility: "  {SOURCE}の {ABILITY}を 引き継いだ！",
	},
	reckless: {
		name: "すてみ",
		// Official flavor text: "反動で ダメージを 受ける 技の 威力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	refrigerate: {
		name: "フリーズスキン",
		// Official flavor text: "ノーマルタイプの 技が こおりタイプに なる。 威力が 少し 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	regenerator: {
		name: "さいせいりょく",
		shortDesc: null, // NEEDS TRANSLATION
	},
	ripen: {
		name: "じゅくせい",
		// Official flavor text: "熟成 させることで きのみの 効果が 倍に なる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rivalry: {
		name: "とうそうしん",
		// Official flavor text: "性別が 同じだと 闘争心を 燃やして 強くなる。 性別が 違うと 弱くなる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	rkssystem: {
		name: "ＡＲシステム",
		shortDesc: null, // NEEDS TRANSLATION
	},
	rockhead: {
		name: "いしあたま",
		// Official flavor text: "反動を 受ける 技を 出しても ＨＰが 減らない。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	rockypayload: {
		name: "いわはこび",
		shortDesc: null, // NEEDS TRANSLATION
	},
	roughskin: {
		name: "さめはだ",
		// Official flavor text: "攻撃を 受けたとき 自分に 触れた 相手を ざらざらの 肌で キズつける。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		damage: "  {POKEMON}は ダメージを 受けた！",
	},
	runaway: {
		name: "にげあし",
		shortDesc: null, // NEEDS TRANSLATION
	},
	sandforce: {
		name: "すなのちから",
		// Official flavor text: "天気が すなあらしの とき いわタイプと じめんタイプと はがねタイプの 威力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sandrush: {
		name: "すなかき",
		// Official flavor text: "天気が すなあらし のとき 素早さが 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sandspit: {
		name: "すなはき",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	sandstream: {
		name: "すなおこし",
		shortDesc: null, // NEEDS TRANSLATION
	},
	sandveil: {
		name: "すながくれ",
		// Official flavor text: "砂あらしの とき 回避率が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sapsipper: {
		name: "そうしょく",
		// Official flavor text: "くさタイプの 技を 受けると ダメージを 受けずに 攻撃が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	schooling: {
		name: "ぎょぐん",
		// Official flavor text: "ＨＰが 多いときは 群れて 強くなる。 ＨＰの 残りが 少なくなると 群れは 散り散りに なってしまう。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		transform: "{POKEMON}の 群れが 集まった！",
		transformEnd: "{POKEMON}の 群れは ちりぢりに なった！",
	},
	scrappy: {
		name: "きもったま",
		// Official flavor text: "ゴーストタイプの ポケモンに ノーマルタイプと かくとうタイプの 技を 当てることが できる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	screencleaner: {
		name: "バリアフリー",
		shortDesc: null, // NEEDS TRANSLATION
	},
	seedsower: {
		name: "こぼれダネ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	serenegrace: {
		name: "てんのめぐみ",
		// Official flavor text: "天の恵みの おかげで 技の 追加効果が でやすい。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	shadowshield: {
		name: "ファントムガード",
		shortDesc: null, // NEEDS TRANSLATION
	},
	shadowtag: {
		name: "かげふみ",
		// Official flavor text: "相手の 影を 踏み 逃げたり 交代 できなくする。"
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
		name: "きれあじ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	shedskin: {
		name: "だっぴ",
		// Official flavor text: "体の 皮を 脱ぎ捨てることで 状態異常を 治すことが ある。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sheerforce: {
		name: "ちからずく",
		// Official flavor text: "技の 追加効果は なくなるが そのぶん 高い 威力で 技を 出すことが できる。"
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
		name: "シェルアーマー",
		shortDesc: null, // NEEDS TRANSLATION
	},
	shielddust: {
		name: "りんぷん",
		// Official flavor text: "りんぷんに 守られて 技の 追加効果を 受けなくなる。"
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
		name: "リミットシールド",
		// Official flavor text: "ＨＰが 半分に なると 殻が 壊れて 攻撃的に なる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		transform: "リミットシールド 発動！",
		transformEnd: "リミットシールド 解除！",
	},
	simple: {
		name: "たんじゅん",
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
		name: "スキルリンク",
		// Official flavor text: "連続技を 使うと いつも 最高回数 出すことが できる。"
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
		name: "スロースタート",
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		start: "  {POKEMON}は 調子が 上がらない！",
		end: "  {POKEMON}は 調子を 取り戻した！",
	},
	slushrush: {
		name: "ゆきかき",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	sniper: {
		name: "スナイパー",
		shortDesc: null, // NEEDS TRANSLATION
	},
	snowcloak: {
		name: "ゆきがくれ",
		// Official flavor text: "天気が あられのとき 回避率が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	snowwarning: {
		name: "ゆきふらし",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	solarpower: {
		name: "サンパワー",
		// Official flavor text: "天気が 晴れると 特攻が 上がるが 毎ターン ＨＰが 減る。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	solidrock: {
		name: "ハードロック",
		shortDesc: null, // NEEDS TRANSLATION
	},
	soulheart: {
		name: "ソウルハート",
		shortDesc: null, // NEEDS TRANSLATION
	},
	soundproof: {
		name: "ぼうおん",
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
		name: "かそく",
		// Official flavor text: "毎ターン 素早さが 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	spicyspray: {
		name: "とびだすハバネロ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	stakeout: {
		name: "はりこみ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	stall: {
		name: "あとだし",
		shortDesc: null, // NEEDS TRANSLATION
	},
	stalwart: {
		name: "すじがねいり",
		shortDesc: null, // NEEDS TRANSLATION
	},
	stamina: {
		name: "じきゅうりょく",
		shortDesc: null, // NEEDS TRANSLATION
	},
	stancechange: {
		name: "バトルスイッチ",
		// Official flavor text: "攻撃技を 出すと ブレードフォルムに 技 キングシールドを 出すと シールドフォルムに 変化する。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		transform: "ブレードフォルム チェンジ！",
		transformEnd: "シールドフォルム チェンジ！",
	},
	static: {
		name: "せいでんき",
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
		name: "ふくつのこころ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	steamengine: {
		name: "じょうききかん",
		// Official flavor text: "みずタイプ ほのおタイプの 技を 受けると 素早さが ぐぐーんと 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	steelworker: {
		name: "はがねつかい",
		shortDesc: null, // NEEDS TRANSLATION
	},
	steelyspirit: {
		name: "はがねのせいしん",
		// Official flavor text: "味方の はがねタイプの 攻撃の 威力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	stench: {
		name: "あくしゅう",
		// Official flavor text: "臭い においを 放つことによって 攻撃した ときに 相手を ひるませることが ある。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	stickyhold: {
		name: "ねんちゃく",
		// Official flavor text: "粘着質の 体に 道具が くっついているため 相手に 道具を 奪われない。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},

		block: "  {POKEMON}の 道具を 奪えない！",
	},
	stormdrain: {
		name: "よびみず",
		// Official flavor text: "みずタイプの 技を 自分に よせつけ ダメージは 受けずに 特攻が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		activate: "#lightningrod",
	},
	strongjaw: {
		name: "がんじょうあご",
		// Official flavor text: "あごが 頑丈で 噛む 技の 威力が 高くなる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	sturdy: {
		name: "がんじょう",
		// Official flavor text: "相手の 技を 受けても 一撃で 倒されることが ない。 一撃必殺技も 効かない。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},

		activate: "  {POKEMON}は 攻撃を こらえた！",
	},
	suctioncups: {
		name: "きゅうばん",
		shortDesc: null, // NEEDS TRANSLATION

		block: "  {POKEMON}は きゅうばんで はりついている！",
	},
	superluck: {
		name: "きょううん",
		shortDesc: null, // NEEDS TRANSLATION
	},
	supersweetsyrup: {
		name: "かんろなミツ",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}の ミツから あまいかおりが ただよっている！",
	},
	supremeoverlord: {
		name: "そうだいしょう",
		// Official flavor text: "登場したとき 今まで 倒された 味方の 数が 多いほど 少しずつ 攻撃と 特攻が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}は 倒された 仲間から 力を もらった！",
	},
	surgesurfer: {
		name: "サーフテール",
		shortDesc: null, // NEEDS TRANSLATION
	},
	swarm: {
		name: "むしのしらせ",
		// Official flavor text: "ＨＰが 減ったとき むしタイプの 技の 威力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	sweetveil: {
		name: "スイートベール",
		// Official flavor text: "味方の ポケモンは 眠らなくなる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		block: "  {POKEMON}は スイートベールで 眠らない！",
	},
	swiftswim: {
		name: "すいすい",
		// Official flavor text: "天気が 雨のとき 素早さが 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	swordofruin: {
		name: "わざわいのつるぎ",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}の わざわいのつるぎで まわりの 防御が 弱まった！",
	},
	symbiosis: {
		name: "きょうせい",
		// Official flavor text: "味方が 道具を 使うと 自分の 持っている 道具を 味方に 渡す。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "  {POKEMON}は {ITEM}を {TARGET}に 持たせた！",
	},
	synchronize: {
		name: "シンクロ",
		// Official flavor text: "自分が なってしまった どくや まひや やけどを 相手に うつす。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
		},
	},
	tabletsofruin: {
		name: "わざわいのおふだ",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}の わざわいのおふだで まわりの 攻撃が 弱まった！",
	},
	tangledfeet: {
		name: "ちどりあし",
		shortDesc: null, // NEEDS TRANSLATION
	},
	tanglinghair: {
		name: "カーリーヘアー",
		shortDesc: null, // NEEDS TRANSLATION
	},
	technician: {
		name: "テクニシャン",
		// Official flavor text: "威力が 低い 技の 威力を 高くして 攻撃できる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	telepathy: {
		name: "テレパシー",
		shortDesc: null, // NEEDS TRANSLATION

		block: "  {POKEMON}は 味方からの 攻撃を 受けない！",
	},
	teraformzero: {
		name: "ゼロフォーミング",
		shortDesc: null, // NEEDS TRANSLATION
	},
	terashell: {
		name: "テラスシェル",
		// Official flavor text: "全タイプの力を 秘めた甲羅は HPが 満タンの ときに 受ける ダメージを すべて 今ひとつに する。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}は 甲羅を かがやかせ タイプ相性を 歪める！！",
	},
	terashift: {
		name: "テラスチェンジ",
		shortDesc: null, // NEEDS TRANSLATION

		transform: "{POKEMON}の 姿が 変化した！",
	},
	teravolt: {
		name: "テラボルテージ",
		// Official flavor text: "相手の 特性に ジャマされず 相手に 技を 出すことが できる。"
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

		start: "  {POKEMON}は 弾ける オーラを 放っている！",
	},
	thermalexchange: {
		name: "ねつこうかん",
		// Official flavor text: "ほのおタイプの 技を 受けると 攻撃が 上がる。 やけど状態に ならない。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	thickfat: {
		name: "あついしぼう",
		// Official flavor text: "厚い 脂肪で 守られているので ほのおタイプと こおりタイプの 技の ダメージを 半減させる。"
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
		name: "いろめがね",
		shortDesc: null, // NEEDS TRANSLATION
	},
	torrent: {
		name: "げきりゅう",
		// Official flavor text: "ＨＰが 減ったとき みずタイプの 技の 威力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	toughclaws: {
		name: "かたいツメ",
		shortDesc: null, // NEEDS TRANSLATION
	},
	toxicboost: {
		name: "どくぼうそう",
		// Official flavor text: "どく状態に なったとき 物理技の 威力が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	toxicchain: {
		name: "どくのくさり",
		// Official flavor text: "毒素を ふくんだ 鎖の力で 技を 当てた 相手を 猛毒の状態に することが ある。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	toxicdebris: {
		name: "どくげしょう",
		shortDesc: null, // NEEDS TRANSLATION
	},
	trace: {
		name: "トレース",
		// Official flavor text: "登場 したとき 相手の 特性を トレースして 同じ 特性に なる。"
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

		changeAbility: "  {POKEMON}は {SOURCE}の {ABILITY}を トレースした！",
	},
	transistor: {
		name: "トランジスタ",
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	triage: {
		name: "ヒーリングシフト",
		shortDesc: null, // NEEDS TRANSLATION
	},
	truant: {
		name: "なまけ",
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
		},

		cant: "{POKEMON}は なまけている",
	},
	turboblaze: {
		name: "ターボブレイズ",
		// Official flavor text: "相手の 特性に ジャマされず 相手に 技を 出すことが できる。"
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

		start: "  {POKEMON}は 燃え盛る オーラを 放っている！",
	},
	unaware: {
		name: "てんねん",
		// Official flavor text: "相手の 能力の 変化を 無視して 攻撃が できる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	unburden: {
		name: "かるわざ",
		// Official flavor text: "持っていた 道具が なくなると 素早さが 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	unnerve: {
		name: "きんちょうかん",
		// Official flavor text: "相手を 緊張させて きのみを 食べられなく させる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {TEAM}は 緊張して きのみが 食べられなくなった！",
	},
	unseenfist: {
		name: "ふかしのこぶし",
		shortDesc: null, // NEEDS TRANSLATION
		champions: {
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	vesselofruin: {
		name: "わざわいのうつわ",
		shortDesc: null, // NEEDS TRANSLATION

		start: "  {POKEMON}の わざわいのうつわで まわりの 特攻が 弱まった！",
	},
	victorystar: {
		name: "しょうりのほし",
		shortDesc: null, // NEEDS TRANSLATION
	},
	vitalspirit: {
		name: "やるき",
		shortDesc: null, // NEEDS TRANSLATION
	},
	voltabsorb: {
		name: "ちくでん",
		// Official flavor text: "でんきタイプの 技を 受けると ダメージを 受けずに 回復する。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen3: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	wanderingspirit: {
		name: "さまようたましい",
		// Official flavor text: "接触する 技で 攻撃 してきた ポケモンと 特性を 入れ替える。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen8: {
			desc: null, // NEEDS TRANSLATION
		},

		activate: "#skillswap",
	},
	waterabsorb: {
		name: "ちょすい",
		// Official flavor text: "みずタイプの 技を 受けると ダメージを 受けずに 回復する。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	waterbubble: {
		name: "すいほう",
		// Official flavor text: "自分に 対する ほのおタイプの 技の 威力を 下げる。 やけど しない。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	watercompaction: {
		name: "みずがため",
		shortDesc: null, // NEEDS TRANSLATION
	},
	waterveil: {
		name: "みずのベール",
		shortDesc: null, // NEEDS TRANSLATION
	},
	weakarmor: {
		name: "くだけるよろい",
		// Official flavor text: "物理技で ダメージを 受けると 防御が 下がり 素早さが ぐーんと 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen6: {
			desc: null, // NEEDS TRANSLATION
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	wellbakedbody: {
		name: "こんがりボディ",
		// Official flavor text: "ほのおタイプの 技を 受けると ダメージを 受けずに 防御が ぐーんと 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	whitesmoke: {
		name: "しろいけむり",
		shortDesc: null, // NEEDS TRANSLATION
	},
	wimpout: {
		name: "にげごし",
		// Official flavor text: "ＨＰが 半分に なると あわてて 逃げ出して 手持ちに 引っ込んで しまう。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	windpower: {
		name: "ふうりょくでんき",
		// Official flavor text: "風技を 受けると じゅうでん 状態に なる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION

		start: "#electromorphosis",
	},
	windrider: {
		name: "かぜのり",
		// Official flavor text: "おいかぜが 吹いたり 風技を 受けると ダメージを 受けずに 攻撃が 上がる。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	wonderguard: {
		name: "ふしぎなまもり",
		shortDesc: null, // NEEDS TRANSLATION
		gen4: {
			shortDesc: null, // NEEDS TRANSLATION
		},
		gen3: {
			shortDesc: null, // NEEDS TRANSLATION
		},
	},
	wonderskin: {
		name: "ミラクルスキン",
		// Official flavor text: "変化技を 受けにくい 体に なっている。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	zenmode: {
		name: "ダルマモード",
		// Official flavor text: "ＨＰが 半分 以下に なると 姿が 変化する。"
		desc: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
		gen7: {
			desc: null, // NEEDS TRANSLATION
		},
		gen6: {
			desc: null, // NEEDS TRANSLATION
		},

		transform: "ダルマモード 発動！",
		transformEnd: "ダルマモード 解除！",
	},
	zerotohero: {
		name: "マイティチェンジ",
		shortDesc: null, // NEEDS TRANSLATION

		activate: "  {POKEMON}は 変身して 帰ってきた！",
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
