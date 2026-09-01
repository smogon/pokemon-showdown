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
		name: "とくせいなし", // NEEDS QC
		shortDesc: "何の効果もない。", // NEEDS QC
	},
	adaptability: {
		name: "てきおうりょく",
		// Official flavor text: "自分と おなじ タイプの 技の 威力が 上がる。"
		desc: "このポケモンのタイプ一致技の威力補正が1.5倍ではなく2倍になる。", // NEEDS QC
		shortDesc: "タイプ一致補正が1.5倍ではなく2倍になる。", // NEEDS QC
	},
	aerilate: {
		name: "スカイスキン",
		// Official flavor text: "ノーマルタイプの 技が ひこうタイプになる。 威力が 少し 上がる。"
		desc: "このポケモンのノーマルタイプの技がひこうタイプになり、威力が1.2倍になる。この効果は技のタイプを変える他の効果の後、プラズマシャワーとそうでんの効果の前に適用される。", // NEEDS QC
		shortDesc: "ノーマル技がひこうタイプになり威力1.2倍。", // NEEDS QC
		gen6: {
			desc: "このポケモンのノーマルタイプの技がひこうタイプになり、威力が1.3倍になる。この効果は技のタイプを変える他の効果の後、プラズマシャワーとそうでんの効果の前に適用される。", // NEEDS QC
			shortDesc: "このポケモンのノーマル技がひこうタイプになり、威力1.3倍。", // NEEDS QC
		},
	},
	aftermath: {
		name: "ゆうばく",
		// Official flavor text: "ひんしに なったとき 触った 相手に ダメージを あたえる。"
		desc: "このポケモンが直接攻撃で倒されたとき、攻撃したポケモンは最大HPの1/4（切り捨て）を失う。攻撃側の特性がマジックガードの場合や、場にしめりけを持つポケモンがいる場合は発動しない。", // NEEDS QC
		shortDesc: "直接攻撃でひんしになると相手は最大HPの1/4を失う。", // NEEDS QC

		damage: "  {POKEMON}は ダメージを 受けた！",
	},
	airlock: {
		name: "エアロック",
		shortDesc: "場にいる間、天気の効果がなくなる。", // NEEDS QC

		start: "  天候の影響が なくなった！",
	},
	analytic: {
		name: "アナライズ",
		// Official flavor text: "いちばん 最後に 技を 出すと 技の 威力が 上がる。"
		desc: "そのターンの最後に行動した場合、このポケモンの技の威力が1.3倍になる。はめつのねがいとみらいよちには適用されない。", // NEEDS QC
		shortDesc: "そのターン最後に行動すると技の威力が1.3倍。", // NEEDS QC
	},
	angerpoint: {
		name: "いかりのつぼ",
		// Official flavor text: "急所に 攻撃が 当たると 怒りくるって 攻撃力が 最大に なる。"
		desc: "このポケモン（みがわりを除く）が急所に攻撃を受けたとき、攻撃が12段階上がる。", // NEEDS QC
		shortDesc: "（みがわり以外で）急所に当たると攻撃が12段階上がる。", // NEEDS QC
		gen4: {
			desc: "このポケモンまたはそのみがわりが急所に攻撃を受けたとき、攻撃が12段階上がる。", // NEEDS QC
			shortDesc: "このポケモンかみがわりが急所を受けると、攻撃が12段階上がる。", // NEEDS QC
		},

		boost: "  {POKEMON}は 攻撃が 最大まで 上がった！",
	},
	angershell: {
		name: "いかりのこうら",
		// Official flavor text: "相手の攻撃で HPが 半分に なると 怒りで 防御と 特防が 下がるが 攻撃 特攻 素早さが 上がる。"
		desc: "このポケモンのHPが最大の1/2より多い状態で、攻撃を受けて最大HPの1/2以下になったとき、攻撃・特攻・素早さが1段階上がり、防御・特防が1段階下がる。連続攻撃技ではすべての攻撃の後に発動する。ちからずくにより追加効果が消された技では発動しない。", // NEEDS QC
		shortDesc: "HPが1/2以下になると攻撃・特攻・素早さ+1、防御・特防-1。", // NEEDS QC
	},
	anticipation: {
		name: "きけんよち",
		// Official flavor text: "相手の 持つ 危険な 技を 察知する ことができる。"
		desc: "場に出たとき、相手のポケモンがこのポケモンに効果ばつぐんになるタイプの攻撃技か一撃必殺技を持っている場合、身震いして知らせる。めざめるパワーは実際のタイプ、それ以外の技は本来のタイプで判定される。", // NEEDS QC
		shortDesc: "出たとき、相手が効果ばつぐんか一撃必殺の技を持つと震える。", // NEEDS QC
		gen5: {
			desc: "場に出たとき、相手のポケモンがこのポケモンに効果ばつぐんになるタイプの攻撃技か一撃必殺技を持っている場合、身震いして知らせる。技は本来のタイプで判定される。", // NEEDS QC
		},
		gen4: {
			desc: "場に出たとき、相手のポケモンがこのポケモンに効果ばつぐんになるタイプの攻撃技を持っている場合、またはこのポケモンに無効でないタイプの一撃必殺技を持ち、レベルがこのポケモンより低くない場合、身震いして知らせる。技は本来のタイプで判定される。カウンター・りゅうのいかり・メタルバースト・ミラーコート・ナイトヘッド・サイコウェーブ・ちきゅうなげではこの効果は発動しない。条件の判定前に、このポケモンがくろいてっきゅうを持っているか、みやぶる・じゅうりょく・ねをはる・ミラクルアイ・はねやすめの効果を受けているか、相手の特性がノーマルスキン・きもったまかが考慮される。", // NEEDS QC
		},

		activate: "  {POKEMON}は みぶるいした！",
	},
	arenatrap: {
		name: "ありじごく",
		// Official flavor text: "戦闘で 相手を 逃げられなくする。"
		desc: "相手のポケモンは交代できなくなる。浮いているポケモン、きれいなぬけがらを持つポケモン、ゴーストタイプのポケモンは交代できる。", // NEEDS QC
		shortDesc: "地面にいる相手を交代できなくする。", // NEEDS QC
		gen6: {
			desc: "隣接する相手のポケモンは交代できなくなる。浮いているポケモン、きれいなぬけがらを持つポケモン、ゴーストタイプのポケモンは交代できる。", // NEEDS QC
		},
		gen5: {
			desc: "隣接する相手のポケモンは交代できなくなる。浮いているポケモンときれいなぬけがらを持つポケモンは交代できる。", // NEEDS QC
		},
		gen4: {
			desc: "相手のポケモンは交代できなくなる。浮いているポケモンときれいなぬけがらを持つポケモンは交代できる。", // NEEDS QC
		},
		gen3: {
			desc: "相手のポケモンは交代できなくなる。浮いているポケモンは交代できる。", // NEEDS QC
		},
	},
	armortail: {
		name: "テイルアーマー",
		// Official flavor text: "頭を包む 謎のしっぽが こちらに むかって 先制技を 出せない ようにする。"
		desc: "相手のポケモンが使う、このポケモンまたは味方を対象とした優先度の高い技を無効化する。", // NEEDS QC
		shortDesc: "自分と味方への相手の先制技を無効化する。", // NEEDS QC

		block: "#damp",
	},
	aromaveil: {
		name: "アロマベール",
		// Official flavor text: "自分と 味方への メンタル 攻撃を 防ぐことが できる。"
		desc: "このポケモンと味方は、メロメロ・かなしばり・アンコール・かいふくふうじ・ちょうはつ・いちゃもんの状態にならない。", // NEEDS QC
		shortDesc: "自分と味方をメロメロ・アンコール・ちょうはつなどから守る。", // NEEDS QC

		block: "  {POKEMON}は アロマベールに 守られている！",
	},
	asone: {
		name: "じんばいったい",
		shortDesc: "じんばいったい（ブリザポス／レイスポス）を参照。", // NEEDS QC

		start: "  {POKEMON}は ふたつの 特性を あわせ持つ！",
	},
	asoneglastrier: {
		name: "じんばいったい（ブリザポス）", // PS-style disambiguator (not part of the official name)
		shortDesc: "きんちょうかんとしろのいななきを合わせた特性。", // NEEDS QC
	},
	asonespectrier: {
		name: "じんばいったい（レイスポス）", // PS-style disambiguator (not part of the official name)
		shortDesc: "きんちょうかんとくろのいななきを合わせた特性。", // NEEDS QC
	},
	aurabreak: {
		name: "オーラブレイク",
		// Official flavor text: "オーラの 効果を 逆転させて 威力を 下げる。"
		desc: "このポケモンが場にいる間、ダークオーラとフェアリーオーラの効果が逆転し、あくタイプとフェアリータイプの技の威力がそれぞれ1.33倍ではなく3/4倍になる。", // NEEDS QC
		shortDesc: "ダークオーラ・フェアリーオーラの補正が0.75倍になる。", // NEEDS QC

		start: "  {POKEMON}は すべての オーラを 制圧する！",
	},
	auraguard: {
		name: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	baddreams: {
		name: "ナイトメア",
		// Official flavor text: "ねむり状態の 相手に ダメージを あたえる。"
		desc: "毎ターン終了時、眠っている相手のポケモンは最大HPの1/8（切り捨て）を失う。", // NEEDS QC
		shortDesc: "ねむり状態の相手は毎ターン最大HPの1/8を失う。", // NEEDS QC
		gen6: {
			desc: "毎ターン終了時、眠っている隣接する相手のポケモンは最大HPの1/8（切り捨て）を失う。", // NEEDS QC
			shortDesc: "毎ターン終了時、眠っている隣の相手は最大HPの1/8を失う。", // NEEDS QC
		},
		gen4: {
			desc: "毎ターン終了時、眠っている相手のポケモンは最大HPの1/8（切り捨て）を失う。", // NEEDS QC
			shortDesc: "ねむり状態の相手は毎ターン最大HPの1/8を失う。", // NEEDS QC
		},

		damage: "  {POKEMON}は うなされている！",
	},
	ballfetch: {
		name: "たまひろい",
		shortDesc: "対戦での効果はない。", // NEEDS QC
	},
	battery: {
		name: "バッテリー",
		shortDesc: "味方の特殊技の威力が1.3倍になる。", // NEEDS QC
	},
	battlearmor: {
		name: "カブトアーマー",
		shortDesc: "急所に当たらない。", // NEEDS QC
	},
	battlebond: {
		name: "きずなへんげ",
		// Official flavor text: "相手を 倒すと トレーナーとの キズナが 深まり サトシゲッコウガに 変化する。みずしゅりけんが 強くなる。"
		desc: "このポケモンがゲッコウガの場合、攻撃で相手のポケモンを倒すと攻撃・特攻・素早さが1段階上がる。この効果は1回の戦闘で1度しか発動しない。", // NEEDS QC
		shortDesc: "相手を倒すと攻撃・特攻・素早さ+1。1戦闘に1回。", // NEEDS QC
		gen8: {
			desc: "このポケモンがゲッコウガの場合、攻撃で相手のポケモンを倒すとサトシゲッコウガに変化する。サトシゲッコウガのみずしゅりけんは威力20になり、必ず3回攻撃する。", // NEEDS QC
			shortDesc: "相手を倒すとサトシゲッコウガに変化。みずしゅりけん: 威力20、3回攻撃。", // NEEDS QC
		},
		activate: "  {POKEMON}に きずなの 力が みなぎった！",
		transform: "{POKEMON}は サトシゲッコウガに 変化した！",
	},
	beadsofruin: {
		name: "わざわいのたま",
		shortDesc: "この特性を持たない場のポケモンの特防が0.75倍。", // NEEDS QC

		start: "  {POKEMON}の わざわいのたまで まわりの 特防が 弱まった！",
	},
	beastboost: {
		name: "ビーストブースト",
		// Official flavor text: "相手を 倒したとき 自分の いちばん 高い 能力が 上がる。"
		desc: "攻撃で相手のポケモンを倒したとき、このポケモンの最も高い能力が1段階上がる。ランク変化は考慮されない。複数の能力が同値の場合、攻撃・防御・特攻・特防・素早さの順で優先される。", // NEEDS QC
		shortDesc: "相手を倒すと最も高い能力が1段階上がる。", // NEEDS QC
	},
	berserk: {
		name: "ぎゃくじょう",
		// Official flavor text: "相手の 攻撃で ＨＰが 半分に なると 特攻が 上がる。"
		desc: "このポケモンのHPが最大の1/2より多い状態で、攻撃を受けて最大HPの1/2以下になったとき、特攻が1段階上がる。連続攻撃技ではすべての攻撃の後に発動する。ちからずくにより追加効果が消された技では発動しない。", // NEEDS QC
		shortDesc: "HPが1/2以下になると特攻が1段階上がる。", // NEEDS QC
	},
	bigpecks: {
		name: "はとむね",
		shortDesc: "防御を下げられない。", // NEEDS QC
	},
	blaze: {
		name: "もうか",
		// Official flavor text: "ＨＰが 減ったとき ほのおタイプの 技の 威力が 上がる。"
		desc: "このポケモンのHPが最大の1/3（切り捨て）以下のとき、ほのおタイプの技で攻撃する際に攻撃または特攻が1.5倍になる。", // NEEDS QC
		shortDesc: "HP1/3以下でほのお技の攻撃能力が1.5倍。", // NEEDS QC
		gen4: {
			desc: "このポケモンのHPが最大HPの1/3（切り捨て）以下のとき、ほのおタイプの攻撃技の威力が1.5倍になる。", // NEEDS QC
			shortDesc: "HPが1/3以下のとき、ほのお技の威力が1.5倍になる。", // NEEDS QC
		},
	},
	bulletproof: {
		name: "ぼうだん",
		shortDesc: "弾の技を受けない。", // NEEDS QC
	},
	cheekpouch: {
		name: "ほおぶくろ",
		// Official flavor text: "どんな きのみでも 食べると ＨＰも 回復する。"
		desc: "持っているきのみを食べたとき、きのみの効果に加えて最大HPの1/3（切り捨て）を回復する。むしくい・なげつける・ついばむ・ほおばる・おちゃかいの効果で食べたきのみがこのポケモンに効果を及ぼした場合にも発動する。", // NEEDS QC
		shortDesc: "きのみを食べるとさらに最大HPの1/3を回復する。", // NEEDS QC
		gen7: {
			desc: "このポケモンが持っているきのみを食べると、きのみの効果に加えて最大HPの1/3（切り捨て）を回復する。むしくい・なげつける・ついばむで食べたきのみがこのポケモンに効果があった場合も発動する。", // NEEDS QC
		},
	},
	chillingneigh: {
		name: "しろのいななき",
		// Official flavor text: "相手を 倒すと 冷たい 声で いなないて 攻撃が 上がる。"
		desc: "攻撃で相手のポケモンを倒したとき、このポケモンの攻撃が1段階上がる。", // NEEDS QC
		shortDesc: "相手を倒すと攻撃が1段階上がる。", // NEEDS QC
	},
	chlorophyll: {
		name: "ようりょくそ",
		// Official flavor text: "天気が 晴れのとき 素早さが 上がる。"
		desc: "天気がにほんばれのとき、このポケモンの素早さが2倍になる。ばんのうがさを持っていると発動しない。", // NEEDS QC
		shortDesc: "晴れのとき素早さが2倍になる。", // NEEDS QC
		gen7: {
			desc: "天気がにほんばれの場合、このポケモンの素早さが2倍になる。", // NEEDS QC
		},
	},
	clearbody: {
		name: "クリアボディ",
		shortDesc: "能力を下げられない。", // NEEDS QC
	},
	cloudnine: {
		name: "ノーてんき",
		shortDesc: "場にいる間、天気の効果がなくなる。", // NEEDS QC

		start: "#airlock",
	},
	colorchange: {
		name: "へんしょく",
		// Official flavor text: "相手から 受けた 技の タイプに 自分の タイプが 変化 する。"
		desc: "このポケモンのタイプが、最後に受けた技のタイプに変化する。すでにそのタイプを持っている場合は変化しない。連続攻撃技ではすべての攻撃の後に発動する。ちからずくにより追加効果が消された技では発動しない。", // NEEDS QC
		shortDesc: "受けた技のタイプに自分のタイプが変わる。", // NEEDS QC
		gen4: {
			desc: "このポケモンのタイプが、最後に受けた技のタイプに変わる。すでにそのタイプの場合は変わらない。連続攻撃技では攻撃ごとに適用される。その攻撃でHPを失っていない場合は発動しない。", // NEEDS QC
		},
	},
	comatose: {
		name: "ぜったいねむり",
		// Official flavor text: "つねに 夢うつつの 状態で 絶対に 目覚めない。 眠ったまま 攻撃が できる。"
		desc: "このポケモンは常に眠っている状態とみなされ、状態異常とあくびの影響を受けない。", // NEEDS QC
		shortDesc: "常にねむり状態として扱われ、状態異常にならない。", // NEEDS QC

		start: "  {POKEMON}は 夢うつつの 状態！",
	},
	commander: {
		name: "しれいとう",
		// Official flavor text: "登場したとき 味方に ヘイラッシャが いると 口の中に 入って そこから 指令を だす。"
		desc: "このポケモンがシャリタツで、味方の場にヘイラッシャがいるとき、ヘイラッシャの口の中に入る。ヘイラッシャの攻撃・特攻・素早さ・防御・特防が2段階上がる。効果の間、ヘイラッシャは交代できず、このポケモンは行動を選択できず、このポケモンを対象とする攻撃は回避されるが、間接ダメージは受ける。効果の間にこのポケモンがひんしになった場合、代わりのポケモンを出せるが、ヘイラッシャは引き続き交代できない。ヘイラッシャがひんしになった場合、このポケモンは行動を選択できるようになる。", // NEEDS QC
		shortDesc: "味方のヘイラッシャの口に入り全能力+2。自分は行動できず攻撃も受けない。", // NEEDS QC

		activate: "  {POKEMON}は しれいとう として {TARGET}に 飲みこまれた！",
	},
	competitive: {
		name: "かちき",
		// Official flavor text: "能力を 下げられると 特攻が ぐーんと 上がる。"
		desc: "相手のポケモンによって能力ランクが下げられるたびに、このポケモンの特攻が2段階上がる。", // NEEDS QC
		shortDesc: "相手に能力を下げられるたび特攻が2段階上がる。", // NEEDS QC
	},
	compoundeyes: {
		name: "ふくがん",
		shortDesc: "技の命中率が1.3倍になる。", // NEEDS QC
	},
	contrary: {
		name: "あまのじゃく",
		shortDesc: "能力変化の上下が逆になる。", // NEEDS QC
		gen7: {
			desc: "このポケモンは能力ランクが上がるとき代わりに下がり、下がるとき代わりに上がる。Zワザを使う前のZパワーによる能力上昇には適用されない。", // NEEDS QC
		},
		gen6: {
			desc: "このポケモンは能力ランクが上がるとき代わりに下がり、下がるとき代わりに上がる。", // NEEDS QC
		},
	},
	corrosion: {
		name: "ふしょく",
		shortDesc: "タイプに関係なくどく・もうどく状態にできる。", // NEEDS QC
	},
	costar: {
		name: "きょうえん",
		shortDesc: "出たとき味方の能力変化をコピーする。", // NEEDS QC
	},
	cottondown: {
		name: "わたげ",
		// Official flavor text: "攻撃を 受けると わたげを ばらまいて 自分以外の ポケモン すべての 素早さを 下げる。"
		desc: "このポケモンが攻撃を受けたとき、このポケモン以外の場のすべてのポケモンの素早さが1段階下がる。", // NEEDS QC
		shortDesc: "攻撃を受けると他の全ポケモンの素早さを1段階下げる。", // NEEDS QC
	},
	cudchew: {
		name: "はんすう",
		shortDesc: "食べたきのみを次のターン終了時にもう一度食べる。", // NEEDS QC
	},
	curiousmedicine: {
		name: "きみょうなくすり",
		shortDesc: "出たとき味方の能力変化を元に戻す。", // NEEDS QC
	},
	cursedbody: {
		name: "のろわれボディ",
		// Official flavor text: "攻撃を 受けると 相手の 技を かなしばり状態に することが ある。"
		desc: "このポケモンが攻撃を受けたとき、30%の確率でその技をかなしばり状態にする。攻撃側の技がすでにかなしばり状態の場合は発動しない。", // NEEDS QC
		shortDesc: "攻撃を受けると30%の確率でその技をかなしばり状態にする。", // NEEDS QC
	},
	cutecharm: {
		name: "メロメロボディ",
		// Official flavor text: "自分に 触った 相手を メロメロに することが ある。"
		desc: "このポケモンに直接攻撃で触れたポケモンが異性の場合、30%の確率でメロメロ状態にする。", // NEEDS QC
		shortDesc: "直接攻撃してきた異性を30%の確率でメロメロにする。", // NEEDS QC
		gen4: {
			desc: "このポケモンに直接攻撃で触れた異なる性別のポケモンを、30%の確率でメロメロ状態にする。その攻撃でHPを失っていない場合は発動しない。", // NEEDS QC
		},
		gen3: {
			desc: "このポケモンに直接攻撃で触れた異なる性別のポケモンを、1/3の確率でメロメロ状態にする。その攻撃でHPを失っていない場合は発動しない。", // NEEDS QC
			shortDesc: "接触した異性のポケモンを1/3の確率でメロメロにする。", // NEEDS QC
		},
	},
	damp: {
		name: "しめりけ",
		// Official flavor text: "あたりを 湿らせることに よって じばく などの 爆発する 技を だれも 使えなくなる。"
		desc: "このポケモンが場にいる間、だいばくはつ・ビックリヘッド・ミストバースト・じばく、および特性ゆうばくの効果を無効化する。", // NEEDS QC
		shortDesc: "だいばくはつ・ビックリヘッド・ミストバースト・じばく・ゆうばくを防ぐ。", // NEEDS QC
		gen7: {
			desc: "このポケモンが場にいる間、だいばくはつ・ビックリヘッド・じばくと特性ゆうばくは発動しない。", // NEEDS QC
			shortDesc: "場にいる間、だいばくはつ/ビックリヘッド/じばく/ゆうばくを防ぐ。", // NEEDS QC
		},
		gen6: {
			desc: "このポケモンが場にいる間、だいばくはつ・じばくと特性ゆうばくは発動しない。", // NEEDS QC
			shortDesc: "場にいる間、だいばくはつ/じばく/ゆうばくを防ぐ。", // NEEDS QC
		},
		gen3: {
			desc: "このポケモンが場にいる間、だいばくはつとじばくは発動しない。", // NEEDS QC
			shortDesc: "場にいる間、だいばくはつとじばくを防ぐ。", // NEEDS QC
		},

		block: "  {SOURCE}は {MOVE}を 使えない！",
	},
	dancer: {
		name: "おどりこ",
		// Official flavor text: "だれかが 踊り技を 使うと 自分も それに 続いて 踊り技を 出すことが できる。"
		desc: "他のポケモンが踊りの技を使った後、このポケモンも同じ技を使う。コピーした技は、技の実行を妨げるあらゆる効果の影響を受ける。この特性で使われた技は、この特性を持つ他のポケモンに再度コピーされない。", // NEEDS QC
		shortDesc: "他のポケモンの踊り技をコピーして使う。", // NEEDS QC
	},
	darkaura: {
		name: "ダークオーラ",
		// Official flavor text: "全員の あくタイプの 技が 強くなる。"
		desc: "このポケモンが場にいる間、場のポケモンが使うあくタイプの技の威力が1.33倍になる。", // NEEDS QC
		shortDesc: "場にいる間、あく技の威力が1.33倍になる。", // NEEDS QC

		start: "  {POKEMON}は ダークオーラを 放っている！",
	},
	dauntlessshield: {
		name: "ふくつのたて",
		shortDesc: "出たとき防御が1段階上がる。1戦闘に1回。", // NEEDS QC
		gen8: {
			shortDesc: "出たとき防御が1段階上がる。", // NEEDS QC
		},
	},
	dazzling: {
		name: "ビビッドボディ",
		// Official flavor text: "相手を びっくり させて こちらに むかって 先制技を 出せない ようにする。"
		desc: "相手のポケモンが使う、このポケモンまたは味方を対象とした優先度の高い技を無効化する。", // NEEDS QC
		shortDesc: "自分と味方への相手の先制技を無効化する。", // NEEDS QC

		block: "#damp",
	},
	defeatist: {
		name: "よわき",
		// Official flavor text: "ＨＰが 半分に なると 弱気に なって 攻撃と 特攻が 半減する。"
		desc: "このポケモンのHPが最大の1/2以下の間、攻撃と特攻が半分になる。", // NEEDS QC
		shortDesc: "HPが1/2以下のとき攻撃と特攻が半分になる。", // NEEDS QC
	},
	defiant: {
		name: "まけんき",
		// Official flavor text: "能力を 下げられると 攻撃が ぐーんと 上がる。"
		desc: "相手のポケモンによって能力ランクが下げられるたびに、このポケモンの攻撃が2段階上がる。", // NEEDS QC
		shortDesc: "相手に能力を下げられるたび攻撃が2段階上がる。", // NEEDS QC
	},
	deltastream: {
		name: "デルタストリーム",
		// Official flavor text: "ひこうタイプの 弱点が なくなる 天気にする。"
		desc: "場に出たとき、天気がらんきりゅうになる。らんきりゅうの間、ひこうタイプのポケモンのひこうタイプとしての弱点がなくなる。この天気は、この特性を持つポケモンが場からいなくなるか、おわりのだいち・はじまりのうみによって天気が変わるまで続く。", // NEEDS QC
		shortDesc: "出たとき、この特性がなくなるまでらんきりゅうが続く。", // NEEDS QC
	},
	desolateland: {
		name: "おわりのだいち",
		// Official flavor text: "みずタイプの 攻撃を 受けない 天気にする。"
		desc: "場に出たとき、天気がおおひでりになる。おおひでりはにほんばれのすべての効果を持ち、さらにみずタイプの攻撃技を失敗させる。この天気は、この特性を持つポケモンが場からいなくなるか、デルタストリーム・はじまりのうみによって天気が変わるまで続く。", // NEEDS QC
		shortDesc: "出たとき、この特性がなくなるまでおおひでりが続く。", // NEEDS QC
	},
	disguise: {
		name: "ばけのかわ",
		// Official flavor text: "体を 被う 化けの皮で １回 攻撃を 防ぐことが できる。"
		desc: "このポケモンがミミッキュの場合、戦闘で最初に受ける攻撃のダメージが0になる。その後ばけのかわが剥がれてばれたすがたになり、最大HPの1/8を失う。こんらんの自傷ダメージでもばけのかわは剥がれる。", // NEEDS QC
		shortDesc: "（ミミッキュ専用）最初の攻撃を無効化し、代わりにHPを1/8失う。", // NEEDS QC
		gen7: {
			desc: "このポケモンがミミッキュの場合、戦闘で最初に受ける攻撃はダメージが0になる。その後ばけのかわが剥がれ、ばれたすがたになる。こんらんによるダメージでもばけのかわは剥がれる。", // NEEDS QC
			shortDesc: "（ミミッキュ専用）最初に受ける攻撃はダメージ0。ばけのかわが剥がれる。", // NEEDS QC
		},

		block: "  ばけのかわが みがわりに なった！",
		transform: "{POKEMON}の ばけのかわが はがれた！",
	},
	download: {
		name: "ダウンロード",
		// Official flavor text: "相手の 防御と 特防を くらべて 低い ほうの 能力に あわせて 自分の 攻撃か 特攻を 上げる。"
		desc: "場に出たとき、相手の全ポケモンの防御の合計と特防の合計を比べ、低い方に応じて攻撃または特攻が1段階上がる。防御の方が低ければ攻撃が、特防が同じか低ければ特攻が上がる。", // NEEDS QC
		shortDesc: "出たとき相手の防御が低い方に応じて攻撃か特攻+1。", // NEEDS QC
	},
	dragonize: {
		name: "ドラゴンスキン",
		// Official flavor text: "ノーマルタイプの技がドラゴンタイプになり 威力が1.2倍になる。"
		desc: "このポケモンのノーマルタイプの技がドラゴンタイプになり、威力が1.2倍になる。この効果は技のタイプを変える他の効果の後、プラズマシャワーとそうでんの効果の前に適用される。", // NEEDS QC
		shortDesc: "ノーマル技がドラゴンタイプになり威力1.2倍。", // NEEDS QC
	},
	dragonsmaw: {
		name: "りゅうのあぎと",
		shortDesc: "ドラゴン技の攻撃能力が1.5倍になる。", // NEEDS QC
	},
	drizzle: {
		name: "あめふらし",
		shortDesc: "出たとき雨を降らせる。", // NEEDS QC
	},
	drought: {
		name: "ひでり",
		shortDesc: "出たとき日差しを強くする。", // NEEDS QC
	},
	dryskin: {
		name: "かんそうはだ",
		// Official flavor text: "天気が 雨の時や みずタイプの 技で ＨＰが 回復し はれの時や ほのおタイプの 技で 減ってしまう。"
		desc: "このポケモンはみずタイプの技を無効化し、みずタイプの技を受けると最大HPの1/4（切り捨て）を回復する。このポケモンが受けるほのおタイプの技の威力は1.25倍になる。毎ターン終了時、天気があめなら最大HPの1/8（切り捨て）を回復し、にほんばれなら最大HPの1/8（切り捨て）を失う。ばんのうがさを持っていると天気の効果は発動しない。", // NEEDS QC
		shortDesc: "みず技で回復、雨でも回復。ほのお技1.25倍、晴れでHP減。", // NEEDS QC
		gen7: {
			desc: "このポケモンはみずタイプの技を受けず、みずタイプの技を受けると最大HPの1/4（切り捨て）を回復する。ほのおタイプの技のダメージは1.25倍で受ける。毎ターン終了時、天気があめなら最大HPの1/8（切り捨て）を回復し、にほんばれなら最大HPの1/8（切り捨て）を失う。", // NEEDS QC
		},

		damage: "#aftermath",
	},
	earlybird: {
		name: "はやおき",
		shortDesc: "ねむりのターン数が2ずつ減る。", // NEEDS QC
	},
	eartheater: {
		name: "どしょく",
		// Official flavor text: "じめんタイプの 技を 受けると ダメージを 受けずに 回復する。"
		desc: "このポケモンはじめんタイプの技を無効化し、じめんタイプの技を受けると最大HPの1/4（切り捨て）を回復する。", // NEEDS QC
		shortDesc: "じめん技を受けると無効化して最大HPの1/4回復。", // NEEDS QC
	},
	eelevate: {
		name: "うなぎのぼり",
		desc: "このポケモンは、じめんタイプの攻撃とまきびし・どくびし・ねばねばネット、特性ありじごくの効果を受けない。じゅうりょく・ねをはる・うちおとす・サウザンアロー・くろいてっきゅうの効果を受けている間、この免疫はなくなる。サウザンアローは、この特性がないものとしてこのポケモンに当たる。このポケモンが攻撃して相手をひんしにすると、自分の最も高い能力が1段階上がる。この判定では能力ランクの変化は考慮されない。複数の能力が同値の場合、攻撃・防御・特攻・特防・素早さの順に優先される。", // NEEDS QC
		shortDesc: "じめん技を受けない。相手を倒すと最高の能力+1。", // NEEDS QC
	},
	effectspore: {
		name: "ほうし",
		// Official flavor text: "攻撃で 自分に 触れた 相手を どくや まひや ねむり状態に する ことがある。"
		desc: "このポケモンに直接攻撃で触れたポケモンを、30%の確率でどく・まひ・ねむりのいずれかの状態にする。", // NEEDS QC
		shortDesc: "直接攻撃してきた相手を30%でどく・まひ・ねむりに。", // NEEDS QC
		gen4: {
			desc: "このポケモンに直接攻撃で触れたポケモンを、30%の確率でどく・まひ・ねむりのいずれかの状態にする。その攻撃でHPを失っていない場合は発動しない。", // NEEDS QC
		},
		gen3: {
			desc: "このポケモンに直接攻撃で触れたポケモンを、10%の確率でどく・まひ・ねむりのいずれかの状態にする。その攻撃でHPを失っていない場合は発動しない。", // NEEDS QC
			shortDesc: "接触したポケモンを10%の確率でどく/まひ/ねむりにする。", // NEEDS QC
		},
	},
	electricsurge: {
		name: "エレキメイカー",
		shortDesc: "出たときエレキフィールドを張る。", // NEEDS QC
	},
	electromorphosis: {
		name: "でんきにかえる",
		shortDesc: "攻撃を受けるとじゅうでん状態になる。", // NEEDS QC

		start: "  {POKEMON}は {MOVE}を 受けて 充電した！",
	},
	embodyaspectcornerstone: {
		name: "おもかげやどし（いしずえ）", // PS-style disambiguator (not part of the official name)
		shortDesc: "出たとき防御が1段階上がる。", // NEEDS QC

		boost: "  {POKEMON}は 礎の仮面を かがやかせ 防御が 上がった！",
	},
	embodyaspecthearthflame: {
		name: "おもかげやどし（かまど）", // PS-style disambiguator (not part of the official name)
		shortDesc: "出たとき攻撃が1段階上がる。", // NEEDS QC

		boost: "  {POKEMON}は 竈の仮面を かがやかせ 攻撃が 上がった！",
	},
	embodyaspectteal: {
		name: "おもかげやどし（みどり）", // PS-style disambiguator (not part of the official name)
		shortDesc: "出たとき素早さが1段階上がる。", // NEEDS QC

		boost: "  {POKEMON}は 碧の仮面を かがやかせ 素早さが 上がった！",
	},
	embodyaspectwellspring: {
		name: "おもかげやどし（いど）", // PS-style disambiguator (not part of the official name)
		shortDesc: "出たとき特防が1段階上がる。", // NEEDS QC

		boost: "  {POKEMON}は 井戸の仮面を かがやかせ 特防が 上がった！",
	},
	emergencyexit: {
		name: "ききかいひ",
		// Official flavor text: "ＨＰが 半分に なると 危険を 回避するため 手持ちに 引っ込んで しまう。"
		desc: "このポケモンのHPが最大の1/2より多い状態で、ダメージを受けて最大HPの1/2以下になったとき、すぐに選んだ味方と交代する。連続攻撃技ではすべての攻撃の後に発動する。ちからずくにより追加効果が消された技では発動しない。直接のダメージでも間接ダメージでも発動するが、のろいとみがわりの使用によるHP消費、はらだいこ、いたみわけ、こんらんの自傷ダメージでは発動しない。", // NEEDS QC
		shortDesc: "HPが1/2以下になると控えと交代する。", // NEEDS QC
	},
	fairyaura: {
		name: "フェアリーオーラ",
		// Official flavor text: "全員の フェアリータイプの 技が 強くなる。"
		desc: "このポケモンが場にいる間、場のポケモンが使うフェアリータイプの技の威力が1.33倍になる。", // NEEDS QC
		shortDesc: "場にいる間、フェアリー技の威力が1.33倍になる。", // NEEDS QC

		start: "  {POKEMON}は フェアリーオーラを 放っている！",
	},
	filter: {
		name: "フィルター",
		shortDesc: "効果ばつぐんの技のダメージが3/4になる。", // NEEDS QC
	},
	firemane: {
		name: "ほのおのたてがみ",
		shortDesc: "ほのお技の攻撃能力が1.5倍になる。", // NEEDS QC
	},
	flamebody: {
		name: "ほのおのからだ",
		shortDesc: "直接攻撃してきた相手を30%の確率でやけどにする。", // NEEDS QC
		gen4: {
			desc: "このポケモンに直接攻撃で触れたポケモンを、30%の確率でやけど状態にする。その攻撃でHPを失っていない場合は発動しない。", // NEEDS QC
		},
		gen3: {
			desc: "このポケモンに直接攻撃で触れたポケモンを、1/3の確率でやけど状態にする。その攻撃でHPを失っていない場合は発動しない。", // NEEDS QC
			shortDesc: "接触したポケモンを1/3の確率でやけどにする。", // NEEDS QC
		},
	},
	flareboost: {
		name: "ねつぼうそう",
		// Official flavor text: "やけど状態に なったとき 特殊技の 威力が 上がる。"
		desc: "このポケモンがやけど状態の間、特殊技の威力が1.5倍になる。", // NEEDS QC
		shortDesc: "やけどのとき特殊技の威力が1.5倍になる。", // NEEDS QC
	},
	flashfire: {
		name: "もらいび",
		// Official flavor text: "ほのおタイプの 技を 受けると 炎を もらい 自分が 出す ほのおタイプの 技が 強くなる。"
		desc: "このポケモンはほのおタイプの技を無効化する。ほのおタイプの技を初めて受けると、場にいてこの特性を持っている間、ほのおタイプの技で攻撃する際に攻撃または特攻が1.5倍になる。このポケモンがこおり状態の場合、ほのおタイプの攻撃でこおりが治らない。", // NEEDS QC
		shortDesc: "ほのお技を無効化し、自分のほのお技が1.5倍になる。", // NEEDS QC
		gen4: {
			desc: "このポケモンはこおり状態でない限り、ほのおタイプの技を受けない。ほのおタイプの技を初めて受けると、場を離れるか特性が変わるまで、自分のほのおタイプの攻撃のダメージが1.5倍になる。", // NEEDS QC
		},
		gen3: {
			desc: "このポケモンはこおり状態でない限り、ほのおタイプの技を受けない。ほのおタイプの技を初めて受けると、場を離れるか特性が変わるまで、自分のほのおタイプの攻撃のダメージが1.5倍になる。このポケモンが状態異常か、ほのおタイプか、みがわり状態の場合、おにびではこの特性は発動しない。", // NEEDS QC
		},

		start: "  {POKEMON}は ほのおの 威力が 上がった！",
	},
	flowergift: {
		name: "フラワーギフト",
		// Official flavor text: "天気が 晴れのとき 自分と 味方の 攻撃と 特防の 能力が 上がる。"
		desc: "このポケモンがチェリムで天気がにほんばれのとき、ポジフォルムになり、自分と味方の攻撃と特防が1.5倍になる。ばんのうがさを持っていると発動しない。", // NEEDS QC
		shortDesc: "（チェリム専用）晴れのとき自分と味方の攻撃・特防1.5倍。", // NEEDS QC
		gen7: {
			desc: "このポケモンがチェリムで天気がにほんばれの場合、ポジフォルムに変化し、自分と味方の攻撃と特防が1.5倍になる。", // NEEDS QC
		},
		gen4: {
			desc: "天気がにほんばれの場合、このポケモンと味方の攻撃と特防が1.5倍になる。", // NEEDS QC
			shortDesc: "にほんばれのとき、自分と味方の攻撃と特防が1.5倍。", // NEEDS QC
		},
	},
	flowerveil: {
		name: "フラワーベール",
		// Official flavor text: "味方の 草ポケモンは 能力が 下がらず 状態異常にも ならない。"
		desc: "このポケモンの場にいるくさタイプのポケモンは、他のポケモンによって能力ランクを下げられず、状態異常にもされない。", // NEEDS QC
		shortDesc: "味方のくさタイプは能力を下げられず状態異常にならない。", // NEEDS QC

		block: "  {POKEMON}は フラワーベールに 守られている！",
	},
	fluffy: {
		name: "もふもふ",
		// Official flavor text: "相手から 受けた 接触する 技の ダメージを 半減するが ほのおタイプの 技の ダメージは ２倍になる。"
		desc: "このポケモンが受ける直接攻撃のダメージが半分になるが、ほのおタイプの技のダメージは2倍になる。", // NEEDS QC
		shortDesc: "直接攻撃のダメージ半減、ほのお技のダメージ2倍。", // NEEDS QC
	},
	forecast: {
		name: "てんきや",
		// Official flavor text: "天気の 影響を 受けて みずタイプ ほのおタイプ こおりタイプの どれかに 変化する。"
		desc: "このポケモンがポワルンの場合、すなあらし以外の天気に応じてタイプが変化する。ばんのうがさを持っている場合、あめとにほんばれでは変化しない。", // NEEDS QC
		shortDesc: "ポワルンのタイプが天気に応じて変わる（砂あらし以外）。", // NEEDS QC
		gen7: {
			desc: "このポケモンがポワルンの場合、すなあらしを除く天気に応じてタイプが変わる。", // NEEDS QC
		},
	},
	forewarn: {
		name: "よちむ",
		// Official flavor text: "登場 したとき 相手の 持つ 技を ひとつだけ 読み取る。"
		desc: "場に出たとき、相手のポケモンが持つ最も威力の高い技を1つ（同値の場合はランダム）知らせる。一撃必殺技は威力150、カウンター・ミラーコート・メタルバーストは威力120、威力が定まっていないその他の攻撃技は威力80、攻撃技以外は威力1として扱う。", // NEEDS QC
		shortDesc: "出たとき相手の最も威力の高い技がわかる。", // NEEDS QC
		gen4: {
			desc: "場に出たとき、相手のポケモンが持つ技のうち、威力が最も高い技を1つランダムに知る。一撃必殺技は威力150、カウンター・ミラーコート・メタルバーストは威力120、威力が定まっていないその他の攻撃技は威力80として判定される。", // NEEDS QC
		},

		activate: "  {TARGET}の {MOVE} を 読み取った！",
		activateNoTarget: "  {POKEMON}は よちむで {MOVE}を よみとった！",
	},
	friendguard: {
		name: "フレンドガード",
		shortDesc: "味方が受けるダメージが3/4になる。", // NEEDS QC
	},
	frisk: {
		name: "おみとおし",
		shortDesc: "出たとき相手全員の持ち物がわかる。", // NEEDS QC
		gen5: {
			shortDesc: "場に出たとき、ランダムな相手1匹の持ち物を知る。", // NEEDS QC
		},

		activate: "  {POKEMON}は {TARGET}の {ITEM}を お見通しだ！",
		activateNoTarget: "  {POKEMON}は {ITEM} を お見通しだ！",
	},
	fullmetalbody: {
		name: "メタルプロテクト",
		shortDesc: "能力を下げられない。", // NEEDS QC
	},
	furcoat: {
		name: "ファーコート",
		shortDesc: "防御が2倍になる。", // NEEDS QC
	},
	galewings: {
		name: "はやてのつばさ",
		shortDesc: "HP満タンのときひこう技の優先度+1。", // NEEDS QC
		gen6: {
			shortDesc: "このポケモンのひこう技は優先度が1上がる。", // NEEDS QC
		},
	},
	galvanize: {
		name: "エレキスキン",
		// Official flavor text: "ノーマルタイプの 技が でんきタイプになる。 威力が 少し 上がる。"
		desc: "このポケモンのノーマルタイプの技がでんきタイプになり、威力が1.2倍になる。この効果は技のタイプを変える他の効果の後、プラズマシャワーとそうでんの効果の前に適用される。", // NEEDS QC
		shortDesc: "ノーマル技がでんきタイプになり威力1.2倍。", // NEEDS QC
	},
	gluttony: {
		name: "くいしんぼう",
		// Official flavor text: "ＨＰが 少なくなったら 食べる きのみを ＨＰ 半分の 時に 食べてしまう。"
		desc: "通常はHPが最大の1/4以下で発動するきのみを、最大HPの1/2以下で食べるようになる。", // NEEDS QC
		shortDesc: "HP1/4以下で発動するきのみを1/2以下で食べる。", // NEEDS QC
	},
	goodasgold: {
		name: "おうごんのからだ",
		shortDesc: "変化技を受けない。", // NEEDS QC
	},
	gooey: {
		name: "ぬめぬめ",
		shortDesc: "直接攻撃してきた相手の素早さを1段階下げる。", // NEEDS QC
	},
	gorillatactics: {
		name: "ごりむちゅう",
		// Official flavor text: "攻撃は 上がるが 最初に 選んだ 技しか 出せなくなる。"
		desc: "このポケモンの攻撃が1.5倍になるが、最初に使った技しか選択できなくなる。ダイマックス中は発動しない。", // NEEDS QC
		shortDesc: "攻撃が1.5倍になるが、最初に選んだ技しか出せない。", // NEEDS QC
	},
	grasspelt: {
		name: "くさのけがわ",
		shortDesc: "グラスフィールドのとき防御が1.5倍になる。", // NEEDS QC
	},
	grassysurge: {
		name: "グラスメイカー",
		shortDesc: "出たときグラスフィールドを張る。", // NEEDS QC
	},
	grimneigh: {
		name: "くろのいななき",
		// Official flavor text: "相手を 倒すと 恐ろしい 声で いなないて 特攻が 上がる。"
		desc: "攻撃で相手のポケモンを倒したとき、このポケモンの特攻が1段階上がる。", // NEEDS QC
		shortDesc: "相手を倒すと特攻が1段階上がる。", // NEEDS QC
	},
	guarddog: {
		name: "ばんけん",
		// Official flavor text: "いかく されると 攻撃が 上がる。 ポケモンを 入れ替えさせる 技や 道具が 効かない。"
		desc: "このポケモンはいかくの効果を受けず、代わりに攻撃が1段階上がる。他のポケモンの技や道具によって交代させられない。", // NEEDS QC
		shortDesc: "いかくを受けると攻撃+1。強制交代されない。", // NEEDS QC
	},
	gulpmissile: {
		name: "うのミサイル",
		// Official flavor text: "なみのりか ダイビングを すると 獲物を くわえてくる。 ダメージを 受けると 獲物を 吐きだして 攻撃。"
		desc: "このポケモンがウッウの場合、なみのりを当てるかダイビングの1ターン目を成功させると姿が変わる。HPが最大の1/2より多ければサシカマスをくわえたうのみのすがたに、1/2以下ならピカチュウをくわえたまるのみのすがたになる。うのみ・まるのみのすがたのときに攻撃を受けると、HPが残っていなくてもサシカマスまたはピカチュウを攻撃者に吐き出す。吐き出されたものは相手の最大HPの1/4（切り捨て）のダメージを与える。このダメージはマジックガードで防げるが、みがわりでは防げない。サシカマスはさらに相手の防御を1段階下げ、ピカチュウはまひ状態にする。ウッウは吐き出すか、交代するか、ダイマックスすると元の姿に戻る。", // NEEDS QC
		shortDesc: "なみのり・ダイビングの後に攻撃されると獲物を吐いて反撃する。", // NEEDS QC
	},
	guts: {
		name: "こんじょう",
		// Official flavor text: "状態異常に なると 根性を だして 攻撃が 上がる。"
		desc: "このポケモンが状態異常のとき、攻撃が1.5倍になる。物理技のダメージがやけどで半減しなくなる。", // NEEDS QC
		shortDesc: "状態異常のとき攻撃が1.5倍。やけどの半減も無視。", // NEEDS QC
	},
	hadronengine: {
		name: "ハドロンエンジン",
		shortDesc: "出たときエレキフィールドを張り、その間特攻1.3333倍。", // NEEDS QC

		start: "  {POKEMON}は エレキフィールドを はり 未来の機関を 躍動させる！！",
		activate: "  {POKEMON}は エレキフィールドで 未来の機関を 躍動させる！！",
	},
	harvest: {
		name: "しゅうかく",
		// Official flavor text: "使った きのみを 何回も 作りだす。"
		desc: "最後に使った道具がきのみの場合、毎ターン終了時に50%の確率で復活する。天気がにほんばれの場合は必ず復活する。", // NEEDS QC
		shortDesc: "使ったきのみを50%（晴れなら100%）で毎ターン再生。", // NEEDS QC

		addItem: "  {POKEMON}は {ITEM}を 収穫した！",
	},
	healer: {
		name: "いやしのこころ",
		// Official flavor text: "状態異常の 味方を たまに 治してあげる。"
		desc: "毎ターン終了時、30%の確率で味方の状態異常を治す。", // NEEDS QC
		shortDesc: "毎ターン30%の確率で味方の状態異常を治す。", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "毎ターン終了時、隣接する味方ごとに30%の確率で状態異常を治す。", // NEEDS QC
			shortDesc: "毎ターン終了時、隣の味方ごとに30%で状態異常を治す。", // NEEDS QC
		},
	},
	heatproof: {
		name: "たいねつ",
		// Official flavor text: "耐熱の 体に よって ほのおタイプの 技の 威力を 半減させる。"
		desc: "このポケモンがほのおタイプの攻撃を受けるとき、ダメージ計算で攻撃側の能力（攻撃または特攻）が半分として扱われる。やけどによるダメージも通常の半分（切り捨て）になる。", // NEEDS QC
		shortDesc: "ほのお技のダメージとやけどのダメージが半減。", // NEEDS QC
		gen8: {
			desc: "このポケモンが受けるほのおタイプの攻撃の威力が半分になる。やけどによるダメージも半分（切り捨て）で受ける。", // NEEDS QC
			shortDesc: "受けるほのお技の威力が半分。やけどダメージも半分。", // NEEDS QC
		},
	},
	heavymetal: {
		name: "ヘヴィメタル",
		// Official flavor text: "自分の 重さが ２倍に なる。"
		desc: "このポケモンの重さが2倍になる。この効果はボディパージの効果の後、かるいしの効果の前に計算される。", // NEEDS QC
		shortDesc: "重さが2倍になる。", // NEEDS QC
	},
	honeygather: {
		name: "みつあつめ",
		shortDesc: "対戦での効果はない。", // NEEDS QC
	},
	hospitality: {
		name: "おもてなし",
		shortDesc: "出たとき味方の最大HPの1/4を回復する。", // NEEDS QC

		heal: "  {SOURCE}が たてた お茶を {POKEMON}は 飲みほした！",
	},
	hugepower: {
		name: "ちからもち",
		shortDesc: "攻撃が2倍になる。", // NEEDS QC
	},
	hungerswitch: {
		name: "はらぺこスイッチ",
		// Official flavor text: "ターンの 終わりに まんぷくもよう はらぺこもよう まんぷくもよう……と 交互に 姿を 変える。"
		desc: "このポケモンがモルペコの場合、毎ターン終了時にまんぷくもようとはらぺこもようを交互に切り替える。", // NEEDS QC
		shortDesc: "モルペコが毎ターン終了時に模様を切り替える。", // NEEDS QC
	},
	hustle: {
		name: "はりきり",
		// Official flavor text: "自分の 攻撃が 高くなるが 命中率が 下がる。"
		desc: "このポケモンの攻撃が1.5倍になるが、物理技の命中率が0.8倍になる。", // NEEDS QC
		shortDesc: "攻撃が1.5倍になるが、物理技の命中率が0.8倍。", // NEEDS QC
	},
	hydration: {
		name: "うるおいボディ",
		// Official flavor text: "天気が 雨のとき 状態異常が 治る。"
		desc: "天気があめのとき、毎ターン終了時にこのポケモンの状態異常が治る。ばんのうがさを持っていると発動しない。", // NEEDS QC
		shortDesc: "雨のとき毎ターン終了時に状態異常を治す。", // NEEDS QC
		gen7: {
			desc: "天気があめの場合、毎ターン終了時に状態異常が治る。", // NEEDS QC
		},
	},
	hypercutter: {
		name: "かいりきバサミ",
		shortDesc: "攻撃を下げられない。", // NEEDS QC
	},
	icebody: {
		name: "アイスボディ",
		// Official flavor text: "天気が あられのとき ＨＰを 少しずつ 回復 する。"
		desc: "天気がゆきのとき、毎ターン終了時に最大HPの1/16（切り捨て）を回復する。", // NEEDS QC
		shortDesc: "ゆきのとき毎ターン最大HPの1/16を回復する。", // NEEDS QC
		gen8: {
			desc: "天気があられのとき、毎ターン終了時に最大HPの1/16（切り捨て）を回復する。あられのダメージを受けない。", // NEEDS QC
			shortDesc: "あられのとき毎ターン最大HPの1/16を回復。あられ無効。", // NEEDS QC
		},
	},
	iceface: {
		name: "アイスフェイス",
		// Official flavor text: "物理攻撃は 頭の 氷が みがわりに なるが 姿も 変わる。 氷は あられが 降ると 元に戻る。"
		desc: "このポケモンがコオリッポの場合、戦闘で最初に受ける物理攻撃のダメージが0になる。その後アイスフェイスが壊れ、ナイスフェイスのすがたになる。天気がゆきになったとき、またはゆきの間に場に出ると、アイスフェイスのすがたに戻る。こんらんの自傷ダメージでもアイスフェイスは壊れる。", // NEEDS QC
		shortDesc: "（コオリッポ専用）最初の物理攻撃を無効化。ゆきで復活。", // NEEDS QC
		gen8: {
			desc: "このポケモンがコオリッポの場合、戦闘で最初に受ける物理攻撃はダメージが0になる。その後アイスフェイスが壊れ、ナイスフェイスのすがたになる。あられが始まるか、あられの間に場に出ると、アイスフェイスのすがたに戻る。こんらんによるダメージでもアイスフェイスは壊れる。", // NEEDS QC
			shortDesc: "コオリッポなら最初に受ける物理攻撃はダメージ0。あられで復活。", // NEEDS QC
		},
	},
	icescales: {
		name: "こおりのりんぷん",
		shortDesc: "特殊技のダメージが半減する。", // NEEDS QC
	},
	illuminate: {
		name: "はっこう",
		// Official flavor text: "あたりを 明るくする ことで 野生の ポケモンに 遭遇 しやすくなる。"
		desc: "他のポケモンによって命中率のランクを下げられない。相手の回避率のランクを無視する。", // NEEDS QC
		shortDesc: "命中率を下げられず、相手の回避率を無視する。", // NEEDS QC
		gen8: {
			desc: "対戦での効果はない。", // NEEDS QC
			shortDesc: "対戦での効果はない。", // NEEDS QC
		},
	},
	illusion: {
		name: "イリュージョン",
		// Official flavor text: "手持ちの いちばん うしろに いる ポケモンに なりきって 登場して 相手を 化かす。"
		desc: "場に出るとき、手持ちの一番後ろのひんしでないポケモンの姿で現れる。他のポケモンの攻撃で直接ダメージを受けると解除される。レベルとHPは、化けたポケモンのものではなくこのポケモン自身のものが表示される。", // NEEDS QC
		shortDesc: "直接ダメージを受けるまで手持ちの最後のポケモンに化ける。", // NEEDS QC

		end: "  {POKEMON}の イリュージョンが 解けた！",
	},
	immunity: {
		name: "めんえき",
		shortDesc: "どく状態にならない。どく状態でこの特性を得ると治る。", // NEEDS QC
	},
	imposter: {
		name: "かわりもの",
		// Official flavor text: "目の前の ポケモンに 変身 してしまう。"
		desc: "場に出たとき、正面にいる相手のポケモンにへんしんする。その位置にポケモンがいない場合はへんしんしない。", // NEEDS QC
		shortDesc: "出たとき正面の相手にへんしんする。", // NEEDS QC
	},
	infiltrator: {
		name: "すりぬけ",
		// Official flavor text: "相手の 壁や 身代わりを すりぬけて 攻撃 できる"
		desc: "このポケモンの技は、みがわりと、相手の場のリフレクター・ひかりのかべ・しんぴのまもり・しろいきり・オーロラベールを無視する。", // NEEDS QC
		shortDesc: "みがわりやリフレクター・ひかりのかべなどを無視して攻撃。", // NEEDS QC
		gen6: {
			desc: "このポケモンの技は、みがわりと相手側のリフレクター・ひかりのかべ・しんぴのまもり・しろいきりの効果を無視する。", // NEEDS QC
			shortDesc: "技がみがわりと相手のリフレクター・ひかりのかべ・しんぴのまもり・しろいきりを無視。", // NEEDS QC
		},
		gen5: {
			desc: "このポケモンの技は、相手側のリフレクター・ひかりのかべ・しんぴのまもり・しろいきりの効果を無視する。", // NEEDS QC
			shortDesc: "技が相手のリフレクター・ひかりのかべ・しんぴのまもり・しろいきりを無視。", // NEEDS QC
		},
	},
	innardsout: {
		name: "とびだすなかみ",
		// Official flavor text: "相手に 倒されたとき ＨＰの 残りの ぶんだけ 相手に ダメージを あたえる。"
		desc: "このポケモンが技で倒されたとき、その技を使ったポケモンは、このポケモンが受けたダメージと同じだけHPを失う。", // NEEDS QC
		shortDesc: "技でひんしになると相手に同じダメージを与える。", // NEEDS QC

		damage: "#aftermath",
	},
	innerfocus: {
		name: "せいしんりょく",
		// Official flavor text: "鍛えられた 精神に よって 相手の 攻撃に ひるまない。"
		desc: "このポケモンはひるまない。いかくの効果を受けない。", // NEEDS QC
		shortDesc: "ひるまない。いかくを受けない。", // NEEDS QC
		gen7: {
			desc: "このポケモンはひるまない。", // NEEDS QC
			shortDesc: "このポケモンはひるまない。", // NEEDS QC
		},
	},
	insomnia: {
		name: "ふみん",
		shortDesc: "ねむり状態にならない。ねむり状態でこの特性を得ると治る。", // NEEDS QC
	},
	intimidate: {
		name: "いかく",
		// Official flavor text: "登場 したとき 威嚇して 相手を 萎縮させ 相手の 攻撃を 下げて しまう。"
		desc: "場に出たとき、相手のポケモンの攻撃を1段階下げる。特性がせいしんりょく・どんかん・マイペース・きもったまのポケモンと、みがわり状態のポケモンには効かない。", // NEEDS QC
		shortDesc: "出たとき相手の攻撃を1段階下げる。", // NEEDS QC
		gen7: {
			desc: "場に出たとき、相手のポケモンの攻撃を1段階下げる。みがわり状態のポケモンには効かない。", // NEEDS QC
		},
		gen6: {
			desc: "場に出たとき、隣接する相手のポケモンの攻撃を1段階下げる。みがわり状態のポケモンには効かない。", // NEEDS QC
			shortDesc: "場に出たとき、隣接する相手の攻撃を1段階下げる。", // NEEDS QC
		},
		gen4: {
			desc: "場に出たとき、相手のポケモンの攻撃を1段階下げる。みがわり状態のポケモンには効かない。とんぼがえりが相手のみがわりを壊し、このポケモンが交代で出た場合も、みがわりを出していたポケモンにはこの特性は効かない。", // NEEDS QC
			shortDesc: "出たとき相手の攻撃を1段階下げる。", // NEEDS QC
		},
		gen3: {
			desc: "場に出たとき、相手のポケモンの攻撃を1段階下げる。みがわり状態のポケモンには効かない。", // NEEDS QC
		},
	},
	intrepidsword: {
		name: "ふとうのけん",
		shortDesc: "出たとき攻撃が1段階上がる。1戦闘に1回。", // NEEDS QC
		gen8: {
			shortDesc: "出たとき攻撃が1段階上がる。", // NEEDS QC
		},
	},
	ironbarbs: {
		name: "てつのトゲ",
		// Official flavor text: "自分に 触った 相手に 鉄のトゲで ダメージを あたえる。"
		desc: "このポケモンに直接攻撃で触れたポケモンは、最大HPの1/8（切り捨て）を失う。", // NEEDS QC
		shortDesc: "直接攻撃してきた相手は最大HPの1/8を失う。", // NEEDS QC

		damage: "#roughskin",
	},
	ironfist: {
		name: "てつのこぶし",
		// Official flavor text: "パンチを 使う 技の 威力が 上がる。"
		desc: "このポケモンのパンチ技の威力が1.2倍になる。", // NEEDS QC
		shortDesc: "パンチ技の威力が1.2倍（ふいうちを除く）。", // NEEDS QC
	},
	justified: {
		name: "せいぎのこころ",
		shortDesc: "あく技を受けると攻撃が1段階上がる。", // NEEDS QC
	},
	keeneye: {
		name: "するどいめ",
		// Official flavor text: "鋭い 目の おかげで 命中率を 下げられない。"
		desc: "他のポケモンによって命中率のランクを下げられない。相手の回避率のランクを無視する。", // NEEDS QC
		shortDesc: "命中率を下げられず、相手の回避率を無視する。", // NEEDS QC
		gen5: {
			desc: "このポケモンは他のポケモンに命中率を下げられない。", // NEEDS QC
			shortDesc: "他のポケモンに命中率を下げられない。", // NEEDS QC
		},
	},
	klutz: {
		name: "ぶきよう",
		// Official flavor text: "持っている 道具を 使うことが できない。"
		desc: "持っている道具の効果がなくなる。なげつけるは失敗する。きょうせいギプス・パワーアンクル・パワーバンド・パワーベルト・パワーリスト・パワーレンズ・パワーウエイトの効果はなくならない。", // NEEDS QC
		shortDesc: "持ち物の効果がなくなる（きょうせいギプスなどを除く）。", // NEEDS QC
	},
	leafguard: {
		name: "リーフガード",
		// Official flavor text: "天気が 晴れのときは 状態異常に ならない。"
		desc: "天気がにほんばれのとき、このポケモンは状態異常とあくびの影響を受けず、ねむるも失敗する。ばんのうがさを持っていると発動しない。", // NEEDS QC
		shortDesc: "晴れのとき状態異常にならず、ねむるも失敗する。", // NEEDS QC
		gen7: {
			desc: "天気がにほんばれの場合、このポケモンは状態異常やあくびの効果を受けず、ねむるは失敗する。", // NEEDS QC
		},
		gen4: {
			desc: "天気がにほんばれの場合、このポケモンは状態異常やあくびの効果を受けないが、ねむるは普通に使える。", // NEEDS QC
			shortDesc: "にほんばれのとき状態異常にならないが、ねむるは普通に使える。", // NEEDS QC
		},
	},
	levitate: {
		name: "ふゆう",
		// Official flavor text: "地面から 浮くことによって じめんタイプの 技を 受けない。"
		desc: "このポケモンはじめんタイプの攻撃と、まきびし・どくびし・ねばねばネット・特性ありじごくの効果を受けない。じゅうりょく・ねをはる・うちおとす・サウザンアロー・くろいてっきゅうの効果を受けると、この無効化はなくなる。サウザンアローはこの特性を無視して当たる。", // NEEDS QC
		shortDesc: "じめん技を受けない。じゅうりょくなどで無効化される。", // NEEDS QC
		gen5: {
			desc: "このポケモンはじめんタイプの攻撃とまきびし・どくびし、特性ありじごくの効果を受けない。じゅうりょく・ねをはる・うちおとす・くろいてっきゅうの効果を受けると無効化される。", // NEEDS QC
		},
		gen4: {
			desc: "このポケモンはじめんタイプの攻撃とまきびし・どくびし、特性ありじごくの効果を受けない。じゅうりょく・ねをはる・くろいてっきゅうの効果を受けると無効化される。", // NEEDS QC
			shortDesc: "じめんタイプを受けない。じゅうりょく/ねをはる/くろいてっきゅうで無効化。", // NEEDS QC
		},
		gen3: {
			desc: "このポケモンはじめんタイプの攻撃とまきびし、特性ありじごくの効果を受けない。", // NEEDS QC
			shortDesc: "このポケモンはじめんタイプを受けない。", // NEEDS QC
		},
	},
	libero: {
		name: "リベロ",
		// Official flavor text: "自分が 出す 技と 同じ タイプに 変化する。"
		desc: "このポケモンのタイプが、使おうとする技のタイプに変化する。この効果は技のタイプを変えるすべての効果の後に適用される。場に出てから1度しか発動せず、テラスタル中は発動しない。", // NEEDS QC
		shortDesc: "使う技のタイプに自分のタイプが変わる。出場ごとに1回。", // NEEDS QC
		gen8: {
			desc: "このポケモンのタイプが、使おうとする技のタイプに変わる。この効果は技のタイプを変えるすべての効果の後に適用される。", // NEEDS QC
			shortDesc: "このポケモンのタイプが、使おうとする技のタイプに変わる。", // NEEDS QC
		},
	},
	lightmetal: {
		name: "ライトメタル",
		// Official flavor text: "自分の 重さが 半分に なる。"
		desc: "このポケモンの重さが半分（0.1kg単位で切り捨て）になる。この効果はボディパージの効果の後、かるいしの効果の前に計算される。重さは0.1kg未満にはならない。", // NEEDS QC
		shortDesc: "重さが半分になる。", // NEEDS QC
	},
	lightningrod: {
		name: "ひらいしん",
		// Official flavor text: "でんきタイプの 技を 自分に 寄せつけ ダメージを 受けずに 特攻が 上がる。"
		desc: "このポケモンはでんきタイプの技を無効化し、でんきタイプの技を受けると特攻が1段階上がる。他のポケモンが使う単体対象のでんきタイプの技の対象になっていない場合、その技の範囲内にいれば技を自分に引き寄せる。この特性で引き寄せられるポケモンが複数いる場合、素早さが最も高いポケモンが優先され、同速の場合はこの特性がより長く場で有効なポケモンが優先される。", // NEEDS QC
		shortDesc: "でんき技を引き寄せて無効化し、特攻が1段階上がる。", // NEEDS QC
		gen4: {
			desc: "他のポケモンがこのポケモン以外の単体を対象にでんきタイプの技を使うと、その技を自分に引き寄せる。", // NEEDS QC
			shortDesc: "単体対象のでんき技を自分に引き寄せる。", // NEEDS QC
		},
		gen3: {
			desc: "相手のポケモンがこのポケモン以外の単体を対象にでんきタイプの技を使うと、その技を自分に引き寄せる。めざめるパワーはノーマルタイプとして扱う。", // NEEDS QC
			shortDesc: "相手が使う単体対象のでんき技を自分に引き寄せる。", // NEEDS QC
		},

		activate: "  {POKEMON}は 攻撃を 引き寄せた！",
	},
	limber: {
		name: "じゅうなん",
		shortDesc: "まひ状態にならない。まひ状態でこの特性を得ると治る。", // NEEDS QC
	},
	lingeringaroma: {
		name: "とれないにおい",
		// Official flavor text: "相手に 触られると とれないにおいが 相手に うつってしまう。"
		desc: "このポケモンに直接攻撃で触れたポケモンの特性がとれないにおいに変わる。特性がじんばいったい・きずなへんげ・ぜったいねむり・ばけのかわ・うのミサイル・アイスフェイス・とれないにおい・マルチタイプ・スワームチェンジ・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・テラスチェンジ・ダルマモード・マイティチェンジのポケモンには効かない。", // NEEDS QC
		shortDesc: "直接攻撃してきた相手の特性をこの特性にする。", // NEEDS QC
		gen8: {
			desc: "このポケモンに直接攻撃で触れたポケモンの特性がとれないにおいに変わる。特性がじんばいったい・きずなへんげ・ぜったいねむり・ばけのかわ・うのミサイル・アイスフェイス・とれないにおい・マルチタイプ・スワームチェンジ・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・ダルマモードのポケモンには効かない。", // NEEDS QC
		},

		changeAbility: "  {TARGET}は においが うつって とれなくなっちゃった！",
	},
	liquidooze: {
		name: "ヘドロえき",
		shortDesc: "HPを吸収した相手に回復量と同じダメージを与える。", // NEEDS QC
		gen4: {
			desc: "このポケモンからHPを吸収したポケモンは、回復するはずの量だけダメージを受ける。ゆめくいはこの効果の対象ではない。", // NEEDS QC
		},

		damage: "  {POKEMON}は ヘドロえきを 吸い取った！",
	},
	liquidvoice: {
		name: "うるおいボイス",
		// Official flavor text: "すべての 音技が みずタイプに なる。"
		desc: "このポケモンの音技がみずタイプになる。この効果は技のタイプを変える他の効果の後、プラズマシャワーとそうでんの効果の前に適用される。", // NEEDS QC
		shortDesc: "音の技がみずタイプになる。", // NEEDS QC
	},
	longreach: {
		name: "えんかく",
		shortDesc: "技が直接攻撃にならない。", // NEEDS QC
	},
	magicbounce: {
		name: "マジックミラー",
		// Official flavor text: "相手に だされた 変化技を 受けずに そのまま 返す ことが できる。"
		desc: "このポケモンは自分を対象とする一部の変化技の影響を受けず、代わりにその技を使用者に跳ね返す。跳ね返された技は、この特性やマジックコートで再び跳ね返されない。まきびし・ステルスロック・ねばねばネット・どくびしは、この特性またはマジックコートの効果を持つ最も左のポケモンによって、片方の場につき1度だけ跳ね返される。ひらいしんとよびみずによる技の引き寄せは、この特性より先に働く。", // NEEDS QC
		shortDesc: "一部の変化技を相手に跳ね返す。", // NEEDS QC
		gen5: {
			desc: "このポケモンは自分を狙う一部の変化技の効果を受けず、使ったポケモンに跳ね返す。跳ね返された技は、この特性やマジックコートの効果で再び跳ね返せない。まきびし・ステルスロック・どくびしは、この特性かマジックコートの効果を受けている一番左のポケモンによって、陣営ごとに1回だけ跳ね返される。特性ひらいしん・よびみずは、この特性が働く前にそれぞれの技を引き寄せる。", // NEEDS QC
		},

		move: "#magiccoat",
	},
	magicguard: {
		name: "マジックガード",
		// Official flavor text: "攻撃 以外では ダメージを 受けない。"
		desc: "このポケモンは直接の攻撃以外でダメージを受けない。のろいとみがわりの使用によるHP消費、はらだいこ、いたみわけ、わるあがきの反動、こんらんの自傷ダメージは直接のダメージとして扱われる。", // NEEDS QC
		shortDesc: "直接攻撃以外のダメージを受けない。", // NEEDS QC
		gen4: {
			desc: "このポケモンは直接的な攻撃でしかダメージを受けない。のろいとみがわりの使用、はらだいこ、いたみわけ、わるあがきの反動、こんらんによるダメージは直接的なダメージとして扱う。このポケモンはまひで動けなくならず、場に出たときどくびしの効果を受けない。", // NEEDS QC
			shortDesc: "直接的な攻撃でしかダメージを受けず、まひで動けなくならない。", // NEEDS QC
		},
	},
	magician: {
		name: "マジシャン",
		// Official flavor text: "技を 当てた 相手の 道具を 奪ってしまう。"
		desc: "道具を持っていないとき、攻撃を当てた相手の道具を奪う。はめつのねがいとみらいよちでは発動しない。1つの攻撃で複数の対象に当てた場合、トリックルームの効果を考慮した上で最も素早いポケモンから奪い、味方より相手のポケモンが優先される。", // NEEDS QC
		shortDesc: "道具を持っていないとき、技を当てた相手の道具を奪う。", // NEEDS QC
	},
	magmaarmor: {
		name: "マグマのよろい",
		shortDesc: "こおり状態にならない。こおり状態でこの特性を得ると治る。", // NEEDS QC
	},
	magnetpull: {
		name: "じりょく",
		// Official flavor text: "はがねタイプの ポケモンを 磁力で 引きつけて 逃げられなくする。"
		desc: "相手のはがねタイプのポケモンは交代できなくなる。きれいなぬけがらを持つポケモンとゴーストタイプのポケモンは交代できる。", // NEEDS QC
		shortDesc: "はがねタイプの相手を交代できなくする。", // NEEDS QC
		gen6: {
			desc: "隣接するはがねタイプの相手は交代できなくなる。きれいなぬけがらを持つポケモンとゴーストタイプのポケモンは交代できる。", // NEEDS QC
			shortDesc: "隣接するはがねタイプの相手は交代できない。", // NEEDS QC
		},
		gen5: {
			desc: "隣接するはがねタイプの相手は交代できなくなる。きれいなぬけがらを持つポケモンは交代できる。", // NEEDS QC
			shortDesc: "隣接するはがねタイプの相手は交代できない。", // NEEDS QC
		},
		gen4: {
			desc: "はがねタイプの相手は交代できなくなる。きれいなぬけがらを持つポケモンは交代できる。", // NEEDS QC
			shortDesc: "はがねタイプの相手を交代できなくする。", // NEEDS QC
		},
		gen3: {
			desc: "このポケモンを除くはがねタイプのポケモンは交代できなくなる。", // NEEDS QC
			shortDesc: "このポケモンを除くはがねタイプは交代できない。", // NEEDS QC
		},
	},
	marvelscale: {
		name: "ふしぎなうろこ",
		shortDesc: "状態異常のとき防御が1.5倍になる。", // NEEDS QC
	},
	megalauncher: {
		name: "メガランチャー",
		// Official flavor text: "波動の 技の 威力が 高くなる。"
		desc: "このポケモンの波動技の威力が1.5倍になる。いやしのはどうは相手の最大HPの3/4を回復するようになる。", // NEEDS QC
		shortDesc: "波動技の威力1.5倍。いやしのはどうの回復量が3/4に。", // NEEDS QC
	},
	megasol: {
		name: "メガソーラー",
		shortDesc: "技が常に晴れの効果を受けているものとして扱われる。", // NEEDS QC
	},
	merciless: {
		name: "ひとでなし",
		shortDesc: "どく状態の相手への攻撃が必ず急所に当たる。", // NEEDS QC
	},
	mimicry: {
		name: "ぎたい",
		// Official flavor text: "フィールドの 状態に あわせて ポケモンの タイプが 変わる。"
		desc: "この特性を得たとき、またはフィールドが発生したとき、このポケモンのタイプが場のフィールドに応じて変化する。エレキフィールドではでんきタイプ、グラスフィールドではくさタイプ、ミストフィールドではフェアリータイプ、サイコフィールドではエスパータイプになる。フィールドがない状態でこの特性を得た場合や、フィールドが終わった場合は、本来のタイプに戻る。", // NEEDS QC
		shortDesc: "フィールドに応じて自分のタイプが変わる。", // NEEDS QC

		activate: "  {POKEMON}は タイプが 元に 戻った！",
	},
	mindseye: {
		name: "しんがん",
		// Official flavor text: "ノーマル かくとうタイプの技を ゴーストタイプに 当てることが できる。 相手の 回避率の 変化を 無視し 命中率も 下げられない。"
		desc: "ノーマルタイプとかくとうタイプの技がゴーストタイプに当たるようになる。他のポケモンによって命中率のランクを下げられない。相手の回避率のランクを無視する。", // NEEDS QC
		shortDesc: "ノーマル・かくとう技がゴーストに当たる。回避無視。", // NEEDS QC
	},
	minus: {
		name: "マイナス",
		// Official flavor text: "プラスか マイナスの 特性を 持つ ポケモンが 仲間に いると 自分の 特攻が 上がる。"
		desc: "特性がマイナスまたはプラスの味方が場にいるとき、このポケモンの特攻が1.5倍になる。", // NEEDS QC
		shortDesc: "味方にプラスかこの特性がいると特攻が1.5倍。", // NEEDS QC
		gen4: {
			desc: "場にいる味方の特性がプラスの場合、このポケモンの特攻が1.5倍になる。", // NEEDS QC
			shortDesc: "味方の特性がプラスなら特攻が1.5倍になる。", // NEEDS QC
		},
		gen3: {
			desc: "場にいるポケモンの特性がプラスの場合、このポケモンの特攻が1.5倍になる。", // NEEDS QC
			shortDesc: "場にいるポケモンの特性がプラスなら特攻が1.5倍になる。", // NEEDS QC
		},
	},
	mirrorarmor: {
		name: "ミラーアーマー",
		// Official flavor text: "自分が 受けた 能力 ダウンの 効果 だけを 跳ね返す。"
		desc: "他のポケモンによってこのポケモンの能力ランクが下げられるとき、代わりにそのポケモンの能力ランクが下がる。このポケモンの能力ランクがすでに-6の場合は発動しない。相手がみがわり状態の場合、どちらの能力ランクも下がらない。", // NEEDS QC
		shortDesc: "受けた能力ダウンを相手に跳ね返す。", // NEEDS QC
	},
	mistysurge: {
		name: "ミストメイカー",
		shortDesc: "出たときミストフィールドを張る。", // NEEDS QC
	},
	moldbreaker: {
		name: "かたやぶり",
		// Official flavor text: "相手の 特性に ジャマされる ことなく 相手に 技を 出すことが できる。"
		desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はテイルアーマー・アロマベール・オーラブレイク・カブトアーマー・はとむね・ぼうだん・クリアボディ・あまのじゃく・しめりけ・ビビッドボディ・ばけのかわ・かんそうはだ・どしょく・フィルター・もらいび・フラワーギフト・フラワーベール・もふもふ・フレンドガード・ファーコート・おうごんのからだ・くさのけがわ・ばんけん・たいねつ・ヘヴィメタル・かいりきバサミ・アイスフェイス・こおりのりんぷん・はっこう・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・しんがん・ミラーアーマー・でんきエンジン・マルチスケイル・どんかん・ぼうじん・マイペース・パステルベール・パンクロック・きよめのしお・じょおうのいげん・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・スイートベール・ちどりあし・テレパシー・テラスシェル・ねつこうかん・あついしぼう・てんねん・やるき・ちくでん・ちょすい・すいほう・みずのベール・こんがりボディ・しろいけむり・かぜのり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうか、その特性がこのポケモンにとって有利かどうかに関わらず、場の他のすべてのポケモンに及ぶ。", // NEEDS QC
		shortDesc: "相手の特性を無視して技を出せる。", // NEEDS QC
		gen8: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はアロマベール・オーラブレイク・カブトアーマー・はとむね・ぼうだん・クリアボディ・あまのじゃく・しめりけ・ビビッドボディ・ばけのかわ・かんそうはだ・フィルター・もらいび・フラワーギフト・フラワーベール・もふもふ・フレンドガード・ファーコート・くさのけがわ・たいねつ・ヘヴィメタル・かいりきバサミ・アイスフェイス・こおりのりんぷん・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・ミラーアーマー・でんきエンジン・マルチスケイル・どんかん・ぼうじん・マイペース・パステルベール・パンクロック・じょおうのいげん・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・スイートベール・ちどりあし・テレパシー・あついしぼう・てんねん・やるき・ちくでん・ちょすい・すいほう・みずのベール・しろいけむり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。その特性がこのポケモンに有利かどうかも関係ない。", // NEEDS QC
		},
		gen7: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はアロマベール・オーラブレイク・カブトアーマー・はとむね・ぼうだん・クリアボディ・あまのじゃく・しめりけ・ダークオーラ・ビビッドボディ・ばけのかわ・かんそうはだ・フェアリーオーラ・フィルター・もらいび・フラワーギフト・フラワーベール・もふもふ・フレンドガード・ファーコート・くさのけがわ・たいねつ・ヘヴィメタル・かいりきバサミ・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・でんきエンジン・マルチスケイル・どんかん・ぼうじん・マイペース・じょおうのいげん・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・スイートベール・ちどりあし・テレパシー・あついしぼう・てんねん・やるき・ちくでん・ちょすい・すいほう・みずのベール・しろいけむり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。その特性がこのポケモンに有利かどうかも関係ない。", // NEEDS QC
		},
		gen6: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はアロマベール・オーラブレイク・カブトアーマー・はとむね・ぼうだん・クリアボディ・あまのじゃく・しめりけ・ダークオーラ・かんそうはだ・フェアリーオーラ・フィルター・もらいび・フラワーギフト・フラワーベール・フレンドガード・ファーコート・くさのけがわ・たいねつ・ヘヴィメタル・かいりきバサミ・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・でんきエンジン・マルチスケイル・どんかん・ぼうじん・マイペース・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・スイートベール・ちどりあし・テレパシー・あついしぼう・てんねん・やるき・ちくでん・ちょすい・みずのベール・しろいけむり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。その特性がこのポケモンに有利かどうかも関係ない。", // NEEDS QC
		},
		gen5: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はカブトアーマー・はとむね・クリアボディ・あまのじゃく・しめりけ・かんそうはだ・フィルター・もらいび・フラワーギフト・フレンドガード・たいねつ・ヘヴィメタル・かいりきバサミ・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・でんきエンジン・マルチスケイル・どんかん・マイペース・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・ちどりあし・テレパシー・あついしぼう・てんねん・やるき・ちくでん・ちょすい・みずのベール・しろいけむり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。その特性がこのポケモンに有利かどうかも関係ない。", // NEEDS QC
		},
		gen4: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はカブトアーマー・クリアボディ・しめりけ・かんそうはだ・フィルター・もらいび・フラワーギフト・たいねつ・かいりきバサミ・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ひらいしん・じゅうなん・マグマのよろい・ふしぎなうろこ・でんきエンジン・どんかん・マイペース・すながくれ・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・ちどりあし・あついしぼう・てんねん・やるき・ちくでん・ちょすい・みずのベール・しろいけむり・ふしぎなまもり。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。味方の特性フラワーギフトによる攻撃の補正は無視しない。", // NEEDS QC
		},

		start: "  {POKEMON}は かたやぶりだ！",
	},
	moody: {
		name: "ムラっけ",
		// Official flavor text: "毎ターン 能力の どれかが ぐーんと 上がって どれかが 下がる。"
		desc: "毎ターン終了時、命中率と回避率以外のランダムな能力が2段階上がり、別の能力が1段階下がる。", // NEEDS QC
		shortDesc: "毎ターンランダムな能力が2上がり、別の能力が1下がる。", // NEEDS QC
		gen7: {
			desc: "毎ターン終了時、ランダムな能力1つが2段階上がり、別の能力1つが1段階下がる。", // NEEDS QC
			shortDesc: "毎ターン終了時、ランダムな能力が2段階上がり、別の能力が1段階下がる。", // NEEDS QC
		},
	},
	motordrive: {
		name: "でんきエンジン",
		// Official flavor text: "でんきタイプの 技を 受けると ダメージを 受けずに 素早さが 上がる。"
		desc: "このポケモンはでんきタイプの技を無効化し、でんきタイプの技を受けると素早さが1段階上がる。", // NEEDS QC
		shortDesc: "でんき技を無効化し、素早さが1段階上がる。", // NEEDS QC
	},
	moxie: {
		name: "じしんかじょう",
		// Official flavor text: "相手を 倒すと 自信が ついて 攻撃が 上がる。"
		desc: "攻撃で相手のポケモンを倒したとき、このポケモンの攻撃が1段階上がる。", // NEEDS QC
		shortDesc: "相手を倒すと攻撃が1段階上がる。", // NEEDS QC
	},
	multiscale: {
		name: "マルチスケイル",
		shortDesc: "HP満タンのとき受けるダメージが半減。", // NEEDS QC
	},
	multitype: {
		name: "マルチタイプ",
		shortDesc: "アルセウスのタイプが持っているプレートに応じて変わる。", // NEEDS QC
		gen7: {
			shortDesc: "アルセウスなら、持っているプレートかZクリスタルでタイプが変わる。", // NEEDS QC
		},
		gen6: {
			shortDesc: "アルセウスのタイプが持っているプレートに応じて変わる。", // NEEDS QC
		},
		gen4: {
			desc: "このポケモンがアルセウスの場合、タイプが持っているプレートに応じて変わる。このポケモンは他のポケモンの攻撃で持っている道具を失わない。", // NEEDS QC
		},
	},
	mummy: {
		name: "ミイラ",
		// Official flavor text: "相手に 触られると 相手を ミイラに してしまう。"
		desc: "このポケモンに直接攻撃で触れたポケモンの特性がミイラに変わる。特性がじんばいったい・きずなへんげ・ぜったいねむり・ばけのかわ・うのミサイル・アイスフェイス・マルチタイプ・ミイラ・スワームチェンジ・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・テラスチェンジ・ダルマモード・マイティチェンジのポケモンには効かない。", // NEEDS QC
		shortDesc: "直接攻撃してきた相手の特性をこの特性にする。", // NEEDS QC
		gen8: {
			desc: "このポケモンに直接攻撃で触れたポケモンの特性がミイラに変わる。特性がじんばいったい・きずなへんげ・ぜったいねむり・ばけのかわ・うのミサイル・アイスフェイス・マルチタイプ・ミイラ・スワームチェンジ・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・ダルマモードのポケモンには効かない。", // NEEDS QC
		},
		gen7: {
			desc: "このポケモンに直接攻撃で触れたポケモンの特性がミイラに変わる。特性がきずなへんげ・ぜったいねむり・ばけのかわ・マルチタイプ・ミイラ・スワームチェンジ・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・ダルマモードのポケモンには効かない。", // NEEDS QC
		},
		gen6: {
			desc: "このポケモンに直接攻撃で触れたポケモンの特性がミイラに変わる。特性がマルチタイプ・ミイラ・バトルスイッチのポケモンには効かない。", // NEEDS QC
		},
		gen5: {
			desc: "このポケモンに直接攻撃で触れたポケモンの特性がミイラに変わる。特性がマルチタイプ・ミイラのポケモンには効かない。", // NEEDS QC
		},

		changeAbility: "  {TARGET}は 特性が ミイラになっちゃった！",
	},
	myceliummight: {
		name: "きんしのちから",
		// Official flavor text: "変化技を 出すとき 必ず 行動が 遅くなるが 相手の 特性に ジャマされない。"
		desc: "このポケモンの変化技は、他のポケモンの一部の特性を無視するが、同じ優先度の技を使うポケモンの中で最後に行動する。", // NEEDS QC
		shortDesc: "変化技が同じ優先度で最後になるが、特性を無視する。", // NEEDS QC
	},
	naturalcure: {
		name: "しぜんかいふく",
		shortDesc: "交代で下がると状態異常が治る。", // NEEDS QC

		activate: "  ({POKEMON}は しぜんかいふくで 状態異常が 治った！)", // NEEDS QC
	},
	neuroforce: {
		name: "ブレインフォース",
		// Official flavor text: "効果バツグンの 攻撃で 威力が さらに 上がる。"
		desc: "このポケモンの効果ばつぐんの攻撃のダメージが1.25倍になる。", // NEEDS QC
		shortDesc: "効果ばつぐんの攻撃のダメージが1.25倍になる。", // NEEDS QC
	},
	neutralizinggas: {
		name: "かがくへんかガス",
		// Official flavor text: "かがくへんかガスの ポケモンが 場にいると すべての ポケモンの 特性の 効果が 消えたり 発動 しなくなる。"
		desc: "このポケモンが場にいる間、特性は効果を発揮しない。この特性は、設置技や他の特性より先に発動する。じんばいったい・きずなへんげ・ぜったいねむり・ばけのかわ・うのミサイル・アイスフェイス・マルチタイプ・かがくへんかガス・スワームチェンジ・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・テラスチェンジ・ダルマモード・マイティチェンジには効かない。", // NEEDS QC
		shortDesc: "場にいる間、すべての特性が無効になる。", // NEEDS QC
		gen8: {
			desc: "このポケモンが場にいる間、特性は効果がなくなる。この特性は設置技や他の特性より先に発動する。特性がじんばいったい・きずなへんげ・ぜったいねむり・ばけのかわ・うのミサイル・アイスフェイス・マルチタイプ・かがくへんかガス・スワームチェンジ・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・ダルマモードのポケモンには効かない。", // NEEDS QC
		},

		start: "  あたりに かがくへんかガスが 充満した！",
		end: "  かがくへんかガスの 効果が 切れた！",
	},
	noguard: {
		name: "ノーガード",
		shortDesc: "自分の技も自分への技も必ず命中する。", // NEEDS QC
	},
	normalize: {
		name: "ノーマルスキン",
		// Official flavor text: "どんな タイプの 技でも すべて ノーマルタイプに なる。 威力が 少し 上がる。"
		desc: "このポケモンの技がノーマルタイプになり、威力が1.2倍になる。この効果は技のタイプを変える他の効果より先に適用される。", // NEEDS QC
		shortDesc: "技がすべてノーマルタイプになり威力1.2倍。", // NEEDS QC
		gen6: {
			desc: "このポケモンの技はノーマルタイプになる。この効果は技のタイプを変える他の効果の前に適用される。", // NEEDS QC
			shortDesc: "このポケモンの技はノーマルタイプになる。", // NEEDS QC
		},
		gen4: {
			desc: "このポケモンの技はノーマルタイプになる。この効果は、わるあがきを除き、技のタイプを変える他の効果の後に適用される。", // NEEDS QC
		},
	},
	oblivious: {
		name: "どんかん",
		// Official flavor text: "鈍感なので メロメロや ちょうはつ状態に ならない。"
		desc: "このポケモンはメロメロ状態とちょうはつ状態にならない。メロメロまたはちょうはつ状態でこの特性を得ると治る。いかくの効果を受けない。", // NEEDS QC
		shortDesc: "メロメロにも挑発状態にもならない。いかく無効。", // NEEDS QC
		gen7: {
			desc: "このポケモンはメロメロ状態やちょうはつの効果を受けない。メロメロ状態やちょうはつの効果中にこの特性を得ると治る。", // NEEDS QC
			shortDesc: "メロメロ状態やちょうはつの効果を受けない。", // NEEDS QC
		},
		gen5: {
			desc: "このポケモンはメロメロ状態にならない。メロメロ状態でこの特性を得ると治る。", // NEEDS QC
			shortDesc: "メロメロ状態にならない。メロメロ中に得ると治る。", // NEEDS QC
		},
	},
	opportunist: {
		name: "びんじょう",
		shortDesc: "相手が能力を上げるとそれをコピーする。", // NEEDS QC
	},
	orichalcumpulse: {
		name: "ひひいろのこどう",
		shortDesc: "出たとき晴れにし、晴れの間攻撃が1.3333倍。", // NEEDS QC

		start: "  {POKEMON}は ひざしを 強め 古代の鼓動が 暴れだす！！",
		activate: "  {POKEMON}は ひざしを 受けて 古代の鼓動が 暴れだす！！",
	},
	overcoat: {
		name: "ぼうじん",
		// Official flavor text: "すなあらしや あられなどの ダメージを 受けない。 粉の 技を 受けない。"
		desc: "このポケモンはこなやほうしの技、すなあらしによるダメージ、いかりのこなと特性ほうしの効果を受けない。", // NEEDS QC
		shortDesc: "粉の技・すなあらしのダメージ・ほうしを受けない。", // NEEDS QC
		gen8: {
			desc: "このポケモンは粉の技、すなあらし・あられのダメージ、いかりのこなと特性ほうしの効果を受けない。", // NEEDS QC
			shortDesc: "粉の技、すなあらし/あられのダメージ、ほうしを受けない。", // NEEDS QC
		},
		gen5: {
			desc: "このポケモンはすなあらし・あられのダメージを受けない。", // NEEDS QC
			shortDesc: "すなあらし・あられのダメージを受けない。", // NEEDS QC
		},
	},
	overgrow: {
		name: "しんりょく",
		// Official flavor text: "ＨＰが 減ったとき くさタイプの 技の 威力が 上がる。"
		desc: "このポケモンのHPが最大の1/3（切り捨て）以下のとき、くさタイプの技で攻撃する際に攻撃または特攻が1.5倍になる。", // NEEDS QC
		shortDesc: "HP1/3以下でくさ技の攻撃能力が1.5倍。", // NEEDS QC
		gen4: {
			desc: "このポケモンのHPが最大HPの1/3（切り捨て）以下のとき、くさタイプの攻撃技の威力が1.5倍になる。", // NEEDS QC
			shortDesc: "HPが1/3以下のとき、くさ技の威力が1.5倍になる。", // NEEDS QC
		},
	},
	owntempo: {
		name: "マイペース",
		// Official flavor text: "マイペースなので こんらん状態に ならない。"
		desc: "このポケモンはこんらん状態にならない。こんらん状態でこの特性を得ると治る。いかくの効果を受けない。", // NEEDS QC
		shortDesc: "こんらんしない。いかくを受けない。", // NEEDS QC
		gen7: {
			desc: "このポケモンはこんらん状態にならない。こんらん状態でこの特性を得ると治る。", // NEEDS QC
			shortDesc: "このポケモンはこんらんしない。", // NEEDS QC
		},
	},
	parentalbond: {
		name: "おやこあい",
		// Official flavor text: "親子 ２匹で ２回 攻撃することが できる。"
		desc: "このポケモンの攻撃技が、2回攻撃する連続攻撃技になる。2回目の攻撃はダメージが1/4になる。はめつのねがい、ドラゴンアロー、ダイマックスほう、がむしゃら、だいばくはつ、いのちがけ、なげつける、みらいよち、アイスボール、ころがる、じばく、もともと連続攻撃の技、複数を対象とする技、2ターンかかる技には適用されない。", // NEEDS QC
		shortDesc: "攻撃技が2回当たる。2発目のダメージは1/4。", // NEEDS QC
		gen8: {
			desc: "このポケモンの攻撃技は2回攻撃する連続技になる。2回目の攻撃のダメージは1/4になる。はめつのねがい・ドラゴンアロー・ダイマックスほう・がむしゃら・だいばくはつ・いのちがけ・なげつける・みらいよち・アイスボール・ころがる・じばく、連続攻撃技、複数を対象とする技、2ターン技、ダイマックス技には発動しない。", // NEEDS QC
		},
		gen7: {
			desc: "このポケモンの攻撃技は2回攻撃する連続技になる。2回目の攻撃のダメージは1/4になる。はめつのねがい・がむしゃら・だいばくはつ・いのちがけ・なげつける・みらいよち・アイスボール・ころがる・じばく、連続攻撃技、複数を対象とする技、2ターン技、Zワザには発動しない。", // NEEDS QC
		},
		gen6: {
			desc: "このポケモンの攻撃技は2回攻撃する連続技になる。2回目の攻撃のダメージは半分になる。はめつのねがい・がむしゃら・だいばくはつ・いのちがけ・なげつける・みらいよち・アイスボール・ころがる・じばく、連続攻撃技、複数を対象とする技、2ターン技には発動しない。", // NEEDS QC
			shortDesc: "攻撃技が2回攻撃する。2回目はダメージ半分。", // NEEDS QC
		},
	},
	pastelveil: {
		name: "パステルベール",
		// Official flavor text: "自分も 味方も どくの 状態異常を 受けなくなる。"
		desc: "このポケモンと味方はどく状態にならない。このポケモンや味方がどく状態のときにこの特性を得ると治る。どくを引き起こす効果の間この特性が無視されている場合、このポケモンはすぐに治るが、味方は治らない。", // NEEDS QC
		shortDesc: "自分と味方はどく状態にならない。出たとき味方のどくを治す。", // NEEDS QC
	},
	perishbody: {
		name: "ほろびのボディ",
		// Official flavor text: "接触する 技を 受けると お互い ３ターン たつと ひんしになる。 交代すると 効果は なくなる。"
		desc: "このポケモンに直接攻撃で触れると、このポケモンと攻撃したポケモンにほろびのうたの効果が始まる。攻撃したポケモンにすでにほろびのカウントがある場合、このポケモンには発動しない。", // NEEDS QC
		shortDesc: "直接攻撃を受けると両者にほろびのうたの効果。", // NEEDS QC

		start: "  おたがいは ３ターン後に 滅びてしまう！",
	},
	pickpocket: {
		name: "わるいてぐせ",
		// Official flavor text: "触られた 相手の 道具を 盗んで しまう。"
		desc: "道具を持っていない状態で直接攻撃を受けたとき、攻撃したポケモンの道具を奪う。連続攻撃技ではすべての攻撃の後に発動する。ちからずくにより追加効果が消された技では発動しない。", // NEEDS QC
		shortDesc: "道具なしで直接攻撃を受けると相手の道具を奪う。", // NEEDS QC
	},
	pickup: {
		name: "ものひろい",
		// Official flavor text: "相手の 使った 道具を 拾ってくることが ある。 冒険中も 拾ってくる。"
		desc: "毎ターン終了時、道具を持っておらず、隣のポケモンがそのターン中に道具を使っていた場合、その中からランダムに1匹が選ばれ、そのポケモンが最後に使った道具を手に入れる。割れたふうせんや、この特性を持つ他のポケモンに拾われた道具、むしくい・ふしょくガス・ほしがる・やきつくす・はたきおとす・ついばむ・どろぼうで失われた道具は、最後に使った道具として扱われない。なげつけるで投げられた道具は拾える。", // NEEDS QC
		shortDesc: "道具がないとき、そのターンに使われた道具を拾う。", // NEEDS QC
		gen7: {
			desc: "毎ターン終了時、このポケモンが道具を持っておらず、隣接するポケモンがこのターンに道具を使っていた場合、そのうち1匹をランダムに選び、そのポケモンが最後に使った道具を手に入れる。割れたふうせん、この特性を持つ別のポケモンに拾われた道具、むしくい・ほしがる・やきつくす・はたきおとす・ついばむ・どろぼうで失われた道具は、最後に使った道具として扱われない。なげつけるで投げた道具は拾える。", // NEEDS QC
		},
		gen4: {
			desc: "対戦での効果はない。", // NEEDS QC
			shortDesc: "対戦での効果はない。", // NEEDS QC
		},

		addItem: "#recycle",
	},
	piercingdrill: {
		name: "かんつうドリル",
		shortDesc: "直接攻撃がまもるを貫通し、1/4のダメージを与える。", // NEEDS QC
	},
	pixilate: {
		name: "フェアリースキン",
		// Official flavor text: "ノーマルタイプの 技が フェアリータイプになる。 威力が 少し 上がる。"
		desc: "このポケモンのノーマルタイプの技がフェアリータイプになり、威力が1.2倍になる。この効果は技のタイプを変える他の効果の後、プラズマシャワーとそうでんの効果の前に適用される。", // NEEDS QC
		shortDesc: "ノーマル技がフェアリータイプになり威力1.2倍。", // NEEDS QC
		gen6: {
			desc: "このポケモンのノーマルタイプの技がフェアリータイプになり、威力が1.3倍になる。この効果は技のタイプを変える他の効果の後、プラズマシャワーとそうでんの効果の前に適用される。", // NEEDS QC
			shortDesc: "このポケモンのノーマル技がフェアリータイプになり、威力1.3倍。", // NEEDS QC
		},
	},
	plus: {
		name: "プラス",
		// Official flavor text: "プラスか マイナスの 特性を 持つ ポケモンが 仲間に いると 自分の 特攻が 上がる。"
		desc: "特性がプラスまたはマイナスの味方が場にいるとき、このポケモンの特攻が1.5倍になる。", // NEEDS QC
		shortDesc: "特性がプラスかマイナスの味方がいると特攻が1.5倍。", // NEEDS QC
		gen4: {
			desc: "場にいる味方の特性がマイナスの場合、このポケモンの特攻が1.5倍になる。", // NEEDS QC
			shortDesc: "味方の特性がマイナスなら特攻が1.5倍になる。", // NEEDS QC
		},
		gen3: {
			desc: "場にいるポケモンの特性がマイナスの場合、このポケモンの特攻が1.5倍になる。", // NEEDS QC
			shortDesc: "場にいるポケモンの特性がマイナスなら特攻が1.5倍になる。", // NEEDS QC
		},
	},
	poisonheal: {
		name: "ポイズンヒール",
		// Official flavor text: "どく状態に なると ＨＰが 減らずに 増えていく。"
		desc: "このポケモンがどく状態のとき、HPを失う代わりに、毎ターン終了時に最大HPの1/8（切り捨て）を回復する。", // NEEDS QC
		shortDesc: "どく状態のときダメージの代わりに毎ターンHPを1/8回復。", // NEEDS QC
	},
	poisonpoint: {
		name: "どくのトゲ",
		shortDesc: "直接攻撃してきた相手を30%の確率でどくにする。", // NEEDS QC
		gen4: {
			desc: "このポケモンに直接攻撃で触れたポケモンを、30%の確率でどく状態にする。その攻撃でHPを失っていない場合は発動しない。", // NEEDS QC
		},
		gen3: {
			desc: "このポケモンに直接攻撃で触れたポケモンを、1/3の確率でどく状態にする。その攻撃でHPを失っていない場合は発動しない。", // NEEDS QC
			shortDesc: "接触したポケモンを1/3の確率でどくにする。", // NEEDS QC
		},
	},
	poisonpuppeteer: {
		name: "どくくぐつ",
		// Official flavor text: "モモワロウの 技によって どく状態に なった 相手は こんらん状態にも なってしまう。"
		desc: "このポケモンがモモワロウの場合、相手をどくまたはもうどく状態にすると、その相手はこんらん状態にもなる。", // NEEDS QC
		shortDesc: "（モモワロウ専用）どくにした相手をこんらんもさせる。", // NEEDS QC
	},
	poisontouch: {
		name: "どくしゅ",
		// Official flavor text: "触る だけで 相手を どく 状態に することがある。"
		desc: "このポケモンの直接攻撃に、30%の確率でどくの追加効果が加わる。この効果は技本来の追加効果の判定の後に行われる。", // NEEDS QC
		shortDesc: "直接攻撃に30%のどく追加効果がつく。", // NEEDS QC
	},
	powerconstruct: {
		name: "スワームチェンジ",
		// Official flavor text: "ＨＰが 半分に なると セルたちが 応援に 駆けつけ パーフェクトフォルムに 姿を 変える。"
		desc: "このポケモンが10%フォルムまたは50%フォルムのジガルデの場合、ターン終了時にHPが最大の1/2以下だとパーフェクトフォルムに変わる。", // NEEDS QC
		shortDesc: "10%・50%ジガルデはHP1/2以下のターン終了時にパーフェクトフォルムになる。", // NEEDS QC

		activate: "  たくさんの 気配を 感じる……！",
		transform: "{POKEMON}は パーフェクトフォルムに 変わった！",
	},
	powerofalchemy: {
		name: "かがくのちから",
		// Official flavor text: "倒された 味方の 特性を 受け継ぎ 同じ 特性に 変わる。"
		desc: "ひんしになった味方の特性をコピーする。コピーできない特性はじんばいったい・きずなへんげ・ぜったいねむり・しれいとう・ばけのかわ・おもかげやどし・フラワーギフト・てんきや・はらぺこスイッチ・アイスフェイス・イリュージョン・かわりもの・マルチタイプ・かがくへんかガス・どくくぐつ・スワームチェンジ・かがくのちから・こだいかっせい・クォークチャージ・レシーバー・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・テラスシェル・テラスチェンジ・ゼロフォーミング・トレース・ふしぎなまもり・ダルマモード・マイティチェンジ。", // NEEDS QC
		shortDesc: "ひんしになった味方の特性をコピーする。", // NEEDS QC
		gen8: {
			desc: "ひんしになった味方の特性をコピーする。じんばいったい・きずなへんげ・ぜったいねむり・ばけのかわ・フラワーギフト・てんきや・うのミサイル・はらぺこスイッチ・アイスフェイス・イリュージョン・かわりもの・マルチタイプ・かがくへんかガス・スワームチェンジ・かがくのちから・レシーバー・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・トレース・ふしぎなまもり・ダルマモードはコピーできない。", // NEEDS QC
		},
		gen7: {
			desc: "ひんしになった味方の特性をコピーする。きずなへんげ・ぜったいねむり・ばけのかわ・フラワーギフト・てんきや・イリュージョン・かわりもの・マルチタイプ・スワームチェンジ・かがくのちから・レシーバー・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・トレース・ふしぎなまもり・ダルマモードはコピーできない。", // NEEDS QC
		},

		changeAbility: "#receiver",
	},
	powerspot: {
		name: "パワースポット",
		// Official flavor text: "隣に いるだけで 技の 威力が 上がる。"
		desc: "味方の技の威力が1.3倍になる。使用者が場にいなくても、はめつのねがいとみらいよちにも適用される。", // NEEDS QC
		shortDesc: "味方の技の威力が1.3倍になる。", // NEEDS QC
	},
	prankster: {
		name: "いたずらごころ",
		// Official flavor text: "変化技を 先制で 出すことが できる。"
		desc: "このポケモンの変化技の優先度が1高くなる。相手のあくタイプのポケモンは、この特性による優先度で使われた技と、その技によって呼び出された技（使用者がこの特性を持つ場合）を無効化する。", // NEEDS QC
		shortDesc: "変化技の優先度+1。あくタイプには無効。", // NEEDS QC
		gen6: {
			desc: "このポケモンのダメージを与えない技は、優先度が1上がる。", // NEEDS QC
			shortDesc: "このポケモンの変化技は優先度が1上がる。", // NEEDS QC
		},
	},
	pressure: {
		name: "プレッシャー",
		// Official flavor text: "プレッシャーを あたえて 相手の 使う 技の ＰＰを 多く 減らす。"
		desc: "このポケモンが相手の技の対象になったとき、その技のPPが1多く減る。相手が使うふういん・よこどり・テラバーストもPPが1多く減るが、ねばねばネットは減らない。", // NEEDS QC
		shortDesc: "自分を対象とした技のPPを1多く減らす。", // NEEDS QC
		gen8: {
			desc: "このポケモンが相手の技の対象になると、その技のPPが1多く減る。相手が使ったふういん・よこどりのPPも1多く減るが、ねばねばネットは減らない。", // NEEDS QC
		},
		gen5: {
			desc: "このポケモンが相手の技の対象になると、その技のPPが1多く減る。相手が使ったふういん・よこどりのPPも1多く減る。", // NEEDS QC
		},
		gen4: {
			desc: "このポケモンが他のポケモンの技の対象になると、その技のPPが1多く減る。", // NEEDS QC
			shortDesc: "このポケモンを対象とする技はPPが1多く減る。", // NEEDS QC
		},

		start: "  {POKEMON}は プレッシャーを 放っている！",
	},
	primordialsea: {
		name: "はじまりのうみ",
		// Official flavor text: "ほのおタイプの 攻撃を 受けない 天気にする。"
		desc: "場に出たとき、天気がおおあめになる。おおあめはあめのすべての効果を持ち、さらにほのおタイプの攻撃技を失敗させる。この天気は、この特性を持つポケモンが場からいなくなるか、デルタストリーム・おわりのだいちによって天気が変わるまで続く。", // NEEDS QC
		shortDesc: "出たとき、この特性がなくなるまでおおあめが続く。", // NEEDS QC
	},
	prismarmor: {
		name: "プリズムアーマー",
		shortDesc: "効果ばつぐんの技のダメージが3/4になる。", // NEEDS QC
	},
	propellertail: {
		name: "スクリューおびれ",
		shortDesc: "技の対象を変更されない。", // NEEDS QC
	},
	protean: {
		name: "へんげんじざい",
		// Official flavor text: "自分が 出す 技と 同じ タイプに 変化する。"
		desc: "このポケモンのタイプが、使おうとする技のタイプに変化する。この効果は技のタイプを変えるすべての効果の後に適用される。場に出てから1度しか発動せず、テラスタル中は発動しない。", // NEEDS QC
		shortDesc: "使う技のタイプに自分のタイプが変わる。出場ごとに1回。", // NEEDS QC
		gen8: {
			desc: "このポケモンのタイプが、使おうとする技のタイプに変わる。この効果は技のタイプを変えるすべての効果の後に適用される。", // NEEDS QC
			shortDesc: "このポケモンのタイプが、使おうとする技のタイプに変わる。", // NEEDS QC
		},
	},
	protosynthesis: {
		name: "こだいかっせい",
		// Official flavor text: "ブーストエナジーを 持たせるか 天気が 晴れのとき いちばん 高い能力が 上がる。"
		desc: "天気がにほんばれのとき、または持っているブーストエナジーを使ったとき、このポケモンの最も高い能力が1.3倍（素早さの場合は1.5倍）になる。発動時にはランク変化も考慮される。複数の能力が同値の場合、攻撃・防御・特攻・特防・素早さの順で優先される。にほんばれで発動した場合、ブーストエナジーは使われず、にほんばれが終わると効果も終わる。ブーストエナジーで発動した場合、このポケモンが場を離れるまで効果が続く。", // NEEDS QC
		shortDesc: "晴れかブーストエナジーで最高の能力が1.3倍（素早さは1.5倍）。", // NEEDS QC

		activate: "  {POKEMON}は にほんばれで こだいかっせいを 発動した！",
		activateFromItem: "  {POKEMON}は ブーストエナジーで こだいかっせいを 発動した！",
		start: "  {POKEMON}の {STAT}が 高まった！",
		end: "  {POKEMON}は こだいかっせいの 効果が 切れた！",
	},
	psychicsurge: {
		name: "サイコメイカー",
		shortDesc: "出たときサイコフィールドを張る。", // NEEDS QC
	},
	punkrock: {
		name: "パンクロック",
		// Official flavor text: "音技の 威力が 上がる。 受けた 音技の ダメージは 半分に なる。"
		desc: "このポケモンの音技の威力が1.3倍になる。受ける音技のダメージが半分になる。", // NEEDS QC
		shortDesc: "音技の威力1.3倍、受ける音技のダメージ半減。", // NEEDS QC
	},
	purepower: {
		name: "ヨガパワー",
		shortDesc: "攻撃が2倍になる。", // NEEDS QC
	},
	purifyingsalt: {
		name: "きよめのしお",
		// Official flavor text: "清らかな塩で 状態異常に ならない。 ゴーストタイプの 技の ダメージを 半減させる。"
		desc: "このポケモンは状態異常とあくびの影響を受けない。このポケモンがゴーストタイプの攻撃を受けるとき、ダメージ計算で攻撃側の能力（攻撃または特攻）が半分として扱われる。", // NEEDS QC
		shortDesc: "状態異常にならず、ゴースト技のダメージが半減。", // NEEDS QC
	},
	quarkdrive: {
		name: "クォークチャージ",
		// Official flavor text: "ブーストエナジーを 持たせるか エレキフィールドのとき いちばん 高い能力が 上がる。"
		desc: "エレキフィールドのとき、または持っているブーストエナジーを使ったとき、このポケモンの最も高い能力が1.3倍（素早さの場合は1.5倍）になる。発動時にはランク変化も考慮される。複数の能力が同値の場合、攻撃・防御・特攻・特防・素早さの順で優先される。エレキフィールドで発動した場合、ブーストエナジーは使われず、エレキフィールドが終わると効果も終わる。ブーストエナジーで発動した場合、このポケモンが場を離れるまで効果が続く。", // NEEDS QC
		shortDesc: "エレキフィールドかブーストエナジーで最高の能力が1.3倍（素早さは1.5倍）。", // NEEDS QC

		activate: "  {POKEMON}は エレキフィールドで クォークチャージを 発動した！",
		activateFromItem: "  {POKEMON}は ブーストエナジーで クォークチャージを 発動した！",
		start: "  {POKEMON}の {STAT}が 高まった！",
		end: "  {POKEMON}は クォークチャージの 効果が 切れた！",
	},
	queenlymajesty: {
		name: "じょおうのいげん",
		// Official flavor text: "相手に 威圧感を あたえ こちらに むかって 先制技を 出せない ようにする。"
		desc: "相手のポケモンが使う、このポケモンまたは味方を対象とした優先度の高い技を無効化する。", // NEEDS QC
		shortDesc: "自分と味方への相手の先制技を無効化する。", // NEEDS QC

		block: "#damp",
	},
	quickdraw: {
		name: "クイックドロウ",
		shortDesc: "攻撃技で30%の確率で同じ優先度の中で先に動ける。", // NEEDS QC

		activate: "  {POKEMON}は クイックドロウで 行動が はやくなった！",
	},
	quickfeet: {
		name: "はやあし",
		// Official flavor text: "状態異常に なると 素早さが 上がる。"
		desc: "このポケモンが状態異常のとき、素早さが1.5倍になる。まひによる素早さ半減の影響を受けない。", // NEEDS QC
		shortDesc: "状態異常のとき素早さ1.5倍。まひの低下も無視。", // NEEDS QC
		gen6: {
			desc: "このポケモンが状態異常のとき、素早さが1.5倍になる。まひで素早さが1/4になる効果は無視する。", // NEEDS QC
		},
	},
	raindish: {
		name: "あめうけざら",
		// Official flavor text: "天気が 雨のとき 少しずつ ＨＰを 回復する。"
		desc: "天気があめのとき、毎ターン終了時に最大HPの1/16（切り捨て）を回復する。ばんのうがさを持っていると発動しない。", // NEEDS QC
		shortDesc: "雨のとき毎ターン最大HPの1/16を回復する。", // NEEDS QC
		gen7: {
			desc: "天気があめの場合、毎ターン終了時に最大HPの1/16（切り捨て）を回復する。", // NEEDS QC
		},
	},
	rattled: {
		name: "びびり",
		// Official flavor text: "あくタイプと ゴーストタイプと むしタイプの 技を 受けると びびって 素早さが 上がる。"
		desc: "むし・あく・ゴーストタイプの攻撃を受けたとき、または相手のいかくの効果を受けたとき、素早さが1段階上がる。", // NEEDS QC
		shortDesc: "むし・あく・ゴースト技かいかくで素早さ+1。", // NEEDS QC
		gen7: {
			desc: "このポケモンがむし・あく・ゴーストタイプの攻撃を受けると、素早さが1段階上がる。", // NEEDS QC
			shortDesc: "むし/あく/ゴースト技を受けると素早さが1段階上がる。", // NEEDS QC
		},
	},
	receiver: {
		name: "レシーバー",
		// Official flavor text: "倒された 味方の 特性を 受け継いで 同じ 特性に なる。"
		desc: "ひんしになった味方の特性をコピーする。コピーできない特性はじんばいったい・きずなへんげ・ぜったいねむり・しれいとう・ばけのかわ・おもかげやどし・フラワーギフト・てんきや・はらぺこスイッチ・アイスフェイス・イリュージョン・かわりもの・マルチタイプ・かがくへんかガス・どくくぐつ・スワームチェンジ・かがくのちから・こだいかっせい・クォークチャージ・レシーバー・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・テラスシェル・テラスチェンジ・ゼロフォーミング・トレース・ふしぎなまもり・ダルマモード・マイティチェンジ。", // NEEDS QC
		shortDesc: "ひんしになった味方の特性をコピーする。", // NEEDS QC
		gen8: {
			desc: "ひんしになった味方の特性をコピーする。じんばいったい・きずなへんげ・ぜったいねむり・ばけのかわ・フラワーギフト・てんきや・うのミサイル・はらぺこスイッチ・アイスフェイス・イリュージョン・かわりもの・マルチタイプ・かがくへんかガス・スワームチェンジ・かがくのちから・レシーバー・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・トレース・ふしぎなまもり・ダルマモードはコピーできない。", // NEEDS QC
		},
		gen7: {
			desc: "ひんしになった味方の特性をコピーする。きずなへんげ・ぜったいねむり・ばけのかわ・フラワーギフト・てんきや・イリュージョン・かわりもの・マルチタイプ・スワームチェンジ・かがくのちから・レシーバー・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・トレース・ふしぎなまもり・ダルマモードはコピーできない。", // NEEDS QC
		},

		changeAbility: "  {SOURCE}の {ABILITY}を 引き継いだ！",
	},
	reckless: {
		name: "すてみ",
		// Official flavor text: "反動で ダメージを 受ける 技の 威力が 上がる。"
		desc: "反動ダメージのある技や、外すとダメージを受ける技の威力が1.2倍になる。わるあがきには適用されない。", // NEEDS QC
		shortDesc: "反動のある技の威力が1.2倍になる。", // NEEDS QC
	},
	refrigerate: {
		name: "フリーズスキン",
		// Official flavor text: "ノーマルタイプの 技が こおりタイプに なる。 威力が 少し 上がる。"
		desc: "このポケモンのノーマルタイプの技がこおりタイプになり、威力が1.2倍になる。この効果は技のタイプを変える他の効果の後、プラズマシャワーとそうでんの効果の前に適用される。", // NEEDS QC
		shortDesc: "ノーマル技がこおりタイプになり威力1.2倍。", // NEEDS QC
		gen6: {
			desc: "このポケモンのノーマルタイプの技がこおりタイプになり、威力が1.3倍になる。この効果は技のタイプを変える他の効果の後、プラズマシャワーとそうでんの効果の前に適用される。", // NEEDS QC
			shortDesc: "このポケモンのノーマル技がこおりタイプになり、威力1.3倍。", // NEEDS QC
		},
	},
	regenerator: {
		name: "さいせいりょく",
		shortDesc: "交代で下がると最大HPの1/3を回復する。", // NEEDS QC
	},
	ripen: {
		name: "じゅくせい",
		// Official flavor text: "熟成 させることで きのみの 効果が 倍に なる。"
		desc: "特定のきのみを食べたとき、効果が2倍になる。HPやPPを回復するきのみは回復量が2倍に、能力ランクを上げるきのみは上昇量が2倍になり、受けるダメージを半減するきのみは1/4にし、ジャポのみとレンブのみは攻撃側に最大HPの1/4（切り捨て）のダメージを与える。", // NEEDS QC
		shortDesc: "きのみの効果が2倍になる。", // NEEDS QC
	},
	rivalry: {
		name: "とうそうしん",
		// Official flavor text: "性別が 同じだと 闘争心を 燃やして 強くなる。 性別が 違うと 弱くなる。"
		desc: "同性の相手への攻撃の威力が1.25倍になり、異性の相手への威力が0.75倍になる。自分か相手が性別不明の場合は補正がかからない。", // NEEDS QC
		shortDesc: "同性への技は1.25倍、異性へは0.75倍。", // NEEDS QC
	},
	rkssystem: {
		name: "ＡＲシステム",
		shortDesc: "シルヴァディのタイプが持っているメモリに応じて変わる。", // NEEDS QC
	},
	rockhead: {
		name: "いしあたま",
		// Official flavor text: "反動を 受ける 技を 出しても ＨＰが 減らない。"
		desc: "わるあがき以外の反動ダメージを受けない。いのちのたまのダメージと、技を外した際に受けるダメージは防げない。", // NEEDS QC
		shortDesc: "反動ダメージを受けない（わるあがき・いのちのたま等を除く）。", // NEEDS QC
		gen3: {
			desc: "このポケモンはわるあがきを除き、反動ダメージを受けない。外したときのダメージは防げない。", // NEEDS QC
			shortDesc: "わるあがきと外したときのダメージ以外の反動を受けない。", // NEEDS QC
		},
	},
	rockypayload: {
		name: "いわはこび",
		shortDesc: "いわ技の攻撃能力が1.5倍になる。", // NEEDS QC
	},
	roughskin: {
		name: "さめはだ",
		// Official flavor text: "攻撃を 受けたとき 自分に 触れた 相手を ざらざらの 肌で キズつける。"
		desc: "このポケモンに直接攻撃で触れたポケモンは、最大HPの1/8（切り捨て）を失う。", // NEEDS QC
		shortDesc: "直接攻撃してきた相手は最大HPの1/8を失う。", // NEEDS QC
		gen4: {
			desc: "このポケモンに直接攻撃で触れたポケモンは、最大HPの1/8（切り捨て）を失う。その攻撃でHPを失っていない場合は発動しない。", // NEEDS QC
		},
		gen3: {
			desc: "このポケモンに直接攻撃で触れたポケモンは、最大HPの1/16（切り捨て）を失う。その攻撃でHPを失っていない場合は発動しない。", // NEEDS QC
			shortDesc: "接触したポケモンは最大HPの1/16を失う。", // NEEDS QC
		},

		damage: "  {POKEMON}は ダメージを 受けた！",
	},
	runaway: {
		name: "にげあし",
		shortDesc: "対戦での効果はない。", // NEEDS QC
	},
	sandforce: {
		name: "すなのちから",
		// Official flavor text: "天気が すなあらしの とき いわタイプと じめんタイプと はがねタイプの 威力が 上がる。"
		desc: "天気がすなあらしのとき、じめん・いわ・はがねタイプの攻撃の威力が1.3倍になる。すなあらしのダメージを受けない。", // NEEDS QC
		shortDesc: "砂あらしのときじめん・いわ・はがね技が1.3倍。砂無効。", // NEEDS QC
	},
	sandrush: {
		name: "すなかき",
		// Official flavor text: "天気が すなあらし のとき 素早さが 上がる。"
		desc: "天気がすなあらしのとき、素早さが2倍になる。すなあらしのダメージを受けない。", // NEEDS QC
		shortDesc: "砂あらしのとき素早さが2倍。砂のダメージ無効。", // NEEDS QC
	},
	sandspit: {
		name: "すなはき",
		shortDesc: "攻撃を受けると砂あらしを起こす。", // NEEDS QC
		gen8: {
			desc: "このポケモンが攻撃を受けると、すなあらしの効果が始まる。この効果はダイマックス技・キョダイマックス技の効果の後に発動する。", // NEEDS QC
		},
	},
	sandstream: {
		name: "すなおこし",
		shortDesc: "出たとき砂あらしを起こす。", // NEEDS QC
	},
	sandveil: {
		name: "すながくれ",
		// Official flavor text: "砂あらしの とき 回避率が 上がる。"
		desc: "天気がすなあらしのとき、このポケモンを対象とする技の命中率が0.8倍になる。すなあらしのダメージを受けない。", // NEEDS QC
		shortDesc: "砂あらしのとき回避率が1.25倍。砂のダメージ無効。", // NEEDS QC
	},
	sapsipper: {
		name: "そうしょく",
		// Official flavor text: "くさタイプの 技を 受けると ダメージを 受けずに 攻撃が 上がる。"
		desc: "このポケモンはくさタイプの技を無効化し、くさタイプの技を受けると攻撃が1段階上がる。", // NEEDS QC
		shortDesc: "くさ技を無効化し、攻撃が1段階上がる。", // NEEDS QC
	},
	schooling: {
		name: "ぎょぐん",
		// Official flavor text: "ＨＰが 多いときは 群れて 強くなる。 ＨＰの 残りが 少なくなると 群れは 散り散りに なってしまう。"
		desc: "このポケモンがレベル20以上のヨワシの場合、場に出たときHPが最大の1/4より多ければむれたすがたになる。むれたすがたのときHPが最大の1/4以下になると、ターン終了時にたんどくのすがたに戻る。たんどくのすがたのとき、ターン終了時にHPが最大の1/4より多ければむれたすがたになる。", // NEEDS QC
		shortDesc: "ヨワシがHP1/4超でむれたすがたになる。", // NEEDS QC

		transform: "{POKEMON}の 群れが 集まった！",
		transformEnd: "{POKEMON}の 群れは ちりぢりに なった！",
	},
	scrappy: {
		name: "きもったま",
		// Official flavor text: "ゴーストタイプの ポケモンに ノーマルタイプと かくとうタイプの 技を 当てることが できる。"
		desc: "ノーマルタイプとかくとうタイプの技がゴーストタイプに当たるようになる。いかくの効果を受けない。", // NEEDS QC
		shortDesc: "ノーマル・かくとう技がゴーストに当たる。いかく無効。", // NEEDS QC
		gen7: {
			desc: "このポケモンはノーマル・かくとうタイプの技をゴーストタイプに当てられる。", // NEEDS QC
			shortDesc: "ノーマル/かくとう技をゴーストタイプに当てられる。", // NEEDS QC
		},
	},
	screencleaner: {
		name: "バリアフリー",
		shortDesc: "出たとき両側のリフレクター・ひかりのかべ・オーロラベールを消す。", // NEEDS QC
	},
	seedsower: {
		name: "こぼれダネ",
		shortDesc: "攻撃を受けるとグラスフィールドを張る。", // NEEDS QC
	},
	serenegrace: {
		name: "てんのめぐみ",
		// Official flavor text: "天の恵みの おかげで 技の 追加効果が でやすい。"
		desc: "このポケモンの技の追加効果の発生確率が2倍になる。この効果はにじの効果と重複するが、ひるみの追加効果には重複しない。", // NEEDS QC
		shortDesc: "技の追加効果の発動率が2倍になる。", // NEEDS QC
		gen4: {
			desc: "このポケモンの技の追加効果の発動確率が2倍になる。", // NEEDS QC
		},
	},
	shadowshield: {
		name: "ファントムガード",
		shortDesc: "HP満タンのとき受けるダメージが半減。", // NEEDS QC
	},
	shadowtag: {
		name: "かげふみ",
		// Official flavor text: "相手の 影を 踏み 逃げたり 交代 できなくする。"
		desc: "相手のポケモンは交代できなくなる。きれいなぬけがらを持つポケモン、ゴーストタイプのポケモン、同じ特性を持つポケモンは交代できる。", // NEEDS QC
		shortDesc: "この特性を持たない相手を交代できなくする。", // NEEDS QC
		gen6: {
			desc: "隣接する相手のポケモンは交代できなくなる。きれいなぬけがらを持つポケモン、ゴーストタイプのポケモン、同じ特性を持つポケモンは交代できる。", // NEEDS QC
			shortDesc: "隣接する相手は交代できない。同じ特性なら可能。", // NEEDS QC
		},
		gen5: {
			desc: "隣接する相手のポケモンは交代できなくなる。きれいなぬけがらを持つポケモンと同じ特性を持つポケモンは交代できる。", // NEEDS QC
		},
		gen4: {
			desc: "相手のポケモンは交代できなくなる。きれいなぬけがらを持つポケモンと同じ特性を持つポケモンは交代できる。", // NEEDS QC
			shortDesc: "この特性を持たない相手を交代できなくする。", // NEEDS QC
		},
		gen3: {
			desc: "相手のポケモンは交代できなくなる。", // NEEDS QC
			shortDesc: "相手のポケモンは交代できない。", // NEEDS QC
		},
	},
	sharpness: {
		name: "きれあじ",
		shortDesc: "切る技の威力が1.5倍になる。", // NEEDS QC
	},
	shedskin: {
		name: "だっぴ",
		// Official flavor text: "体の 皮を 脱ぎ捨てることで 状態異常を 治すことが ある。"
		desc: "毎ターン終了時、33%の確率で状態異常が治る。", // NEEDS QC
		shortDesc: "毎ターン33%の確率で状態異常を治す。", // NEEDS QC
	},
	sheerforce: {
		name: "ちからずく",
		// Official flavor text: "技の 追加効果は なくなるが そのぶん 高い 威力で 技を 出すことが できる。"
		desc: "追加効果のある攻撃技の威力が1.3倍になるが、追加効果がなくなる。追加効果が消された場合、いのちのたまの反動とかいがらのすずの回復もなくなり、相手のいかりのこうら・ぎゃくじょう・へんしょく・ききかいひ・わるいてぐせ・にげごし・レッドカード・だっしゅつボタン・アッキのみ・タラプのみも発動しなくなる。", // NEEDS QC
		shortDesc: "追加効果のある技の威力1.3倍。追加効果は消える。", // NEEDS QC
		gen8: {
			desc: "このポケモンの追加効果のある攻撃は威力が1.3倍になるが、追加効果がなくなる。追加効果がなくなった場合、自分のいのちのたまの反動とかいがらのすずの回復もなくなり、相手のぎゃくじょう・へんしょく・ききかいひ・わるいてぐせ・にげごし・レッドカード・だっしゅつボタン・アッキのみ・タラプのみの発動を防ぐ。", // NEEDS QC
		},
		gen6: {
			desc: "このポケモンの追加効果のある攻撃は威力が1.3倍になるが、追加効果がなくなる。追加効果がなくなった場合、自分のいのちのたまの反動とかいがらのすずの回復もなくなり、相手のへんしょく・わるいてぐせ・レッドカード・だっしゅつボタン・アッキのみ・タラプのみの発動を防ぐ。", // NEEDS QC
		},
		gen5: {
			desc: "このポケモンの追加効果のある攻撃は威力が1.3倍になるが、追加効果がなくなる。追加効果がなくなった場合、自分のいのちのたまの反動とかいがらのすずの回復もなくなり、相手のへんしょく・わるいてぐせ・レッドカード・だっしゅつボタンの発動を防ぐ。", // NEEDS QC
		},
	},
	shellarmor: {
		name: "シェルアーマー",
		shortDesc: "急所に当たらない。", // NEEDS QC
	},
	shielddust: {
		name: "りんぷん",
		// Official flavor text: "りんぷんに 守られて 技の 追加効果を 受けなくなる。"
		desc: "このポケモンは、他のポケモンの技の追加効果を受けない。防がれる追加効果には、まひ・ねむり・こおり・やけど・どく・こんらん・ひるみ・能力ランクの低下（確率が100%のものを含む）のほか、アンカーショット、ぶきみなじゅもん、なげつける、サイコノイズ、しおづけ、かげぬい、シロップボム、じごくづきの効果が含まれる。うたかたのアリアの効果は、このポケモンが唯一の対象である場合に防がれる。おうじゃのしるし・するどいキバや、特性のどくしゅ・あくしゅう・どくのくさりによって付与される追加効果も防ぐ。", // NEEDS QC
		shortDesc: "相手の技の追加効果を受けない。", // NEEDS QC
		gen8: {
			desc: "このポケモンは他のポケモンの攻撃の追加効果を受けない。まひ・ねむり・こおり・やけど・どく・こんらん・ひるみ・能力低下の確率（100%でも）がある攻撃と、アンカーショット・ぶきみなじゅもん・なげつける・かげぬい・じごくづきの追加効果を防ぐ。このポケモンが唯一の対象の場合、うたかたのアリアの効果も防ぐ。おうじゃのしるし・するどいキバ、特性どくしゅ・あくしゅうによる追加効果も受けない。", // NEEDS QC
		},
		gen7: {
			desc: "このポケモンは他のポケモンの攻撃の追加効果を受けない。まひ・ねむり・こおり・やけど・どく・こんらん・ひるみ・能力低下の確率（100%でも）がある攻撃と、アンカーショット・なげつける・かげぬい・じごくづきの追加効果を防ぐ。このポケモンが唯一の対象の場合、うたかたのアリアの効果も防ぐ。おうじゃのしるし・するどいキバ、特性どくしゅ・あくしゅうによる追加効果も受けない。", // NEEDS QC
		},
		gen6: {
			desc: "このポケモンは他のポケモンの攻撃の追加効果を受けない。まひ・ねむり・こおり・やけど・どく・こんらん・ひるみ・能力低下の確率（100%でも）がある攻撃と、なげつけるの追加効果を防ぐ。おうじゃのしるし・するどいキバ、特性どくしゅ・あくしゅうによる追加効果も受けない。", // NEEDS QC
		},
		gen4: {
			desc: "このポケモンは他のポケモンの攻撃の追加効果を受けない。まひ・ねむり・こおり・やけど・どく・こんらん・ひるみ・能力低下の確率（100%でも）がある攻撃と、なげつけるの追加効果を防ぐ。おうじゃのしるし・するどいキバによる追加効果も受けない。", // NEEDS QC
		},
		gen3: {
			desc: "このポケモンは他のポケモンの攻撃の追加効果を受けない。まひ・ねむり・こおり・やけど・どく・こんらん・ひるみ・能力低下の確率（100%でも）がある攻撃を防ぐ。おうじゃのしるしによる追加効果も受けない。", // NEEDS QC
		},
	},
	shieldsdown: {
		name: "リミットシールド",
		// Official flavor text: "ＨＰが 半分に なると 殻が 壊れて 攻撃的に なる。"
		desc: "このポケモンがメテノの場合、HPが最大の1/2以下だとコアのすがたに、1/2より多いとりゅうせいのすがたになる。この判定は場に出たときと毎ターン終了時に行われる。りゅうせいのすがたの間は状態異常とあくびの影響を受けない。", // NEEDS QC
		shortDesc: "メテノがHP1/2以下でコアの姿になる。", // NEEDS QC

		transform: "リミットシールド 発動！",
		transformEnd: "リミットシールド 解除！",
	},
	simple: {
		name: "たんじゅん",
		shortDesc: "能力変化の幅が2倍になる。", // NEEDS QC
		gen7: {
			desc: "このポケモンの能力ランクが上がるときと下がるとき、その幅が2倍になる。変化技のZワザを使う前のZパワーによる能力上昇には適用されない。", // NEEDS QC
		},
		gen6: {
			desc: "このポケモンの能力ランクが上がるときと下がるとき、その幅が2倍になる。", // NEEDS QC
		},
		gen4: {
			desc: "能力の計算時、このポケモンの能力ランクは2倍として扱われる。ランクは6より大きく、-6より小さくは扱われない。", // NEEDS QC
			shortDesc: "能力の計算時、能力ランクを2倍として扱う。", // NEEDS QC
		},
	},
	skilllink: {
		name: "スキルリンク",
		// Official flavor text: "連続技を 使うと いつも 最高回数 出すことが できる。"
		desc: "連続攻撃技が必ず最大回数当たる。トリプルキックとトリプルアクセルは2回目・3回目の命中判定を行わない。", // NEEDS QC
		shortDesc: "連続攻撃技が必ず最大回数当たる。", // NEEDS QC
		gen7: {
			desc: "このポケモンの連続攻撃技は必ず最大回数攻撃する。トリプルキックは2回目と3回目の命中判定を行わない。", // NEEDS QC
		},
		gen4: {
			desc: "このポケモンの連続攻撃技は必ず最大回数攻撃する。トリプルキックには発動しない。", // NEEDS QC
		},
	},
	slowstart: {
		name: "スロースタート",
		shortDesc: "出てから5ターンの間、攻撃と素早さが半分になる。", // NEEDS QC
		gen7: {
			desc: "場に出ると、5ターンの間、攻撃と素早さが半分になる。効果中、特殊技に基づく汎用Zワザを使うと、ダメージ計算時に特攻が半分になる。", // NEEDS QC
		},
		gen6: {
			desc: "場に出ると、5ターンの間、攻撃と素早さが半分になる。", // NEEDS QC
		},

		start: "  {POKEMON}は 調子が 上がらない！",
		end: "  {POKEMON}は 調子を 取り戻した！",
	},
	slushrush: {
		name: "ゆきかき",
		shortDesc: "ゆきのとき素早さが2倍になる。", // NEEDS QC
		gen8: {
			shortDesc: "あられのとき、このポケモンの素早さが2倍になる。", // NEEDS QC
		},
	},
	sniper: {
		name: "スナイパー",
		shortDesc: "急所に当たったときのダメージが1.5倍になる。", // NEEDS QC
	},
	snowcloak: {
		name: "ゆきがくれ",
		// Official flavor text: "天気が あられのとき 回避率が 上がる。"
		desc: "天気がゆきのとき、このポケモンを対象とする技の命中率が0.8倍になる。", // NEEDS QC
		shortDesc: "ゆきのとき回避率が1.25倍になる。", // NEEDS QC
		gen8: {
			desc: "天気があられのとき、このポケモンを狙う技の命中率が0.8倍になる。あられのダメージを受けない。", // NEEDS QC
			shortDesc: "あられのとき回避率が1.25倍。あられ無効。", // NEEDS QC
		},
	},
	snowwarning: {
		name: "ゆきふらし",
		shortDesc: "出たときゆきを降らせる。", // NEEDS QC
		gen8: {
			shortDesc: "場に出たとき、あられを降らせる。", // NEEDS QC
		},
	},
	solarpower: {
		name: "サンパワー",
		// Official flavor text: "天気が 晴れると 特攻が 上がるが 毎ターン ＨＰが 減る。"
		desc: "天気がにほんばれのとき、特攻が1.5倍になり、毎ターン終了時に最大HPの1/8（切り捨て）を失う。ばんのうがさを持っていると発動しない。", // NEEDS QC
		shortDesc: "晴れのとき特攻1.5倍、毎ターンHPを1/8失う。", // NEEDS QC
		gen7: {
			desc: "天気がにほんばれの場合、このポケモンの特攻が1.5倍になり、毎ターン終了時に最大HPの1/8（切り捨て）を失う。", // NEEDS QC
		},
	},
	solidrock: {
		name: "ハードロック",
		shortDesc: "効果ばつぐんの技のダメージが3/4になる。", // NEEDS QC
	},
	soulheart: {
		name: "ソウルハート",
		shortDesc: "誰かがひんしになるたび特攻が1段階上がる。", // NEEDS QC
	},
	soundproof: {
		name: "ぼうおん",
		shortDesc: "（自分の技以外の）音の技を受けない。", // NEEDS QC
		gen7: {
			shortDesc: "いやしのすずを含む音の技を受けない。", // NEEDS QC
		},
		gen5: {
			shortDesc: "いやしのすずを除く音の技を受けない。", // NEEDS QC
		},
		gen4: {
			shortDesc: "いやしのすずを含む音の技を受けない。", // NEEDS QC
		},
	},
	speedboost: {
		name: "かそく",
		// Official flavor text: "毎ターン 素早さが 上がる。"
		desc: "毎ターン終了時、素早さが1段階上がる。場に出たそのターンは上がらない。", // NEEDS QC
		shortDesc: "場で1ターン過ごすごとに素早さが1段階上がる。", // NEEDS QC
	},
	spicyspray: {
		name: "とびだすハバネロ",
		shortDesc: "攻撃してきた相手をやけど状態にする。", // NEEDS QC
	},
	stakeout: {
		name: "はりこみ",
		shortDesc: "そのターンに交代して出た相手への攻撃能力が2倍。", // NEEDS QC
	},
	stall: {
		name: "あとだし",
		shortDesc: "優先度が同じか高い技を使うポケモンの中で最後に行動する。", // NEEDS QC
	},
	stalwart: {
		name: "すじがねいり",
		shortDesc: "技の対象を変更されない。", // NEEDS QC
	},
	stamina: {
		name: "じきゅうりょく",
		shortDesc: "技のダメージを受けると防御が1段階上がる。", // NEEDS QC
	},
	stancechange: {
		name: "バトルスイッチ",
		// Official flavor text: "攻撃技を 出すと ブレードフォルムに 技 キングシールドを 出すと シールドフォルムに 変化する。"
		desc: "このポケモンがギルガルドの場合、攻撃技を使う前にブレードフォルムに、キングシールドを使う前にシールドフォルムに変わる。", // NEEDS QC
		shortDesc: "ギルガルドが攻撃時はブレード、キングシールド時はシールドに。", // NEEDS QC
		gen6: {
			desc: "このポケモンがギルガルドの場合、攻撃技を使う直前にブレードフォルムに、キングシールドを使う直前にシールドフォルムに変化する。", // NEEDS QC
		},

		transform: "ブレードフォルム チェンジ！",
		transformEnd: "シールドフォルム チェンジ！",
	},
	static: {
		name: "せいでんき",
		shortDesc: "直接攻撃してきた相手を30%の確率でまひにする。", // NEEDS QC
		gen4: {
			desc: "このポケモンに直接攻撃で触れたポケモンを、30%の確率でまひ状態にする。その攻撃でHPを失っていない場合は発動しない。", // NEEDS QC
		},
		gen3: {
			desc: "このポケモンに直接攻撃で触れたポケモンを、1/3の確率でまひ状態にする。その攻撃でHPを失っていない場合は発動しない。", // NEEDS QC
			shortDesc: "接触したポケモンを1/3の確率でまひにする。", // NEEDS QC
		},
	},
	steadfast: {
		name: "ふくつのこころ",
		shortDesc: "ひるむと素早さが1段階上がる。", // NEEDS QC
	},
	steamengine: {
		name: "じょうききかん",
		// Official flavor text: "みずタイプ ほのおタイプの 技を 受けると 素早さが ぐぐーんと 上がる。"
		desc: "ほのおタイプまたはみずタイプの技でダメージを受けたとき、素早さが6段階上がる。", // NEEDS QC
		shortDesc: "ほのお・みず技を受けると素早さが6段階上がる。", // NEEDS QC
	},
	steelworker: {
		name: "はがねつかい",
		shortDesc: "はがね技の攻撃能力が1.5倍になる。", // NEEDS QC
	},
	steelyspirit: {
		name: "はがねのせいしん",
		// Official flavor text: "味方の はがねタイプの 攻撃の 威力が 上がる。"
		desc: "このポケモンと味方のはがねタイプの技の威力が1.5倍になる。使用者が場にいなくても、はめつのねがいにも適用される。", // NEEDS QC
		shortDesc: "自分と味方のはがね技の威力が1.5倍になる。", // NEEDS QC
	},
	stench: {
		name: "あくしゅう",
		// Official flavor text: "臭い においを 放つことによって 攻撃した ときに 相手を ひるませることが ある。"
		desc: "このポケモンの、ひるみの追加効果がない攻撃技に、10%の確率でひるみの効果が加わる。", // NEEDS QC
		shortDesc: "ひるみ効果のない攻撃技に10%のひるみ効果がつく。", // NEEDS QC
		gen4: {
			desc: "対戦での効果はない。", // NEEDS QC
			shortDesc: "対戦での効果はない。", // NEEDS QC
		},
	},
	stickyhold: {
		name: "ねんちゃく",
		// Official flavor text: "粘着質の 体に 道具が くっついているため 相手に 道具を 奪われない。"
		desc: "他のポケモンの特性や攻撃によって、持っている道具を失わない。ただし、その攻撃でひんしになった場合は失う。くっつきバリはこの特性に関係なく他のポケモンに移る。", // NEEDS QC
		shortDesc: "相手の特性や攻撃で道具を失わない。", // NEEDS QC
		gen4: {
			desc: "このポケモンは他のポケモンの攻撃で持ち物を失わない。その攻撃でひんしになっても失わない。くっつきバリはこの特性に関係なく他のポケモンに移る。", // NEEDS QC
		},

		block: "  {POKEMON}の 道具を 奪えない！",
	},
	stormdrain: {
		name: "よびみず",
		// Official flavor text: "みずタイプの 技を 自分に よせつけ ダメージは 受けずに 特攻が 上がる。"
		desc: "このポケモンはみずタイプの技を無効化し、みずタイプの技を受けると特攻が1段階上がる。他のポケモンが使う単体対象のみずタイプの技の対象になっていない場合、その技の範囲内にいれば技を自分に引き寄せる。この特性で引き寄せられるポケモンが複数いる場合、素早さが最も高いポケモンが優先され、同速の場合はこの特性がより長く場で有効なポケモンが優先される。", // NEEDS QC
		shortDesc: "みず技を引き寄せて無効化し、特攻が1段階上がる。", // NEEDS QC
		gen4: {
			desc: "他のポケモンがこのポケモン以外の単体を対象にみずタイプの技を使うと、その技を自分に引き寄せる。", // NEEDS QC
			shortDesc: "単体対象のみず技を自分に引き寄せる。", // NEEDS QC
		},

		activate: "#lightningrod",
	},
	strongjaw: {
		name: "がんじょうあご",
		// Official flavor text: "あごが 頑丈で 噛む 技の 威力が 高くなる。"
		desc: "このポケモンのかみつく技の威力が1.5倍になる。", // NEEDS QC
		shortDesc: "かみつく技の威力が1.5倍になる（むしくいを除く）。", // NEEDS QC
	},
	sturdy: {
		name: "がんじょう",
		// Official flavor text: "相手の 技を 受けても 一撃で 倒されることが ない。 一撃必殺技も 効かない。"
		desc: "このポケモンのHPが満タンのとき、ひんしになる攻撃を受けてもHP1で耐える。一撃必殺技は効かない。", // NEEDS QC
		shortDesc: "HP満タンなら一撃で倒されない。一撃必殺無効。", // NEEDS QC
		gen4: {
			desc: "このポケモンに一撃必殺技は効かない。", // NEEDS QC
			shortDesc: "一撃必殺技が効かない。", // NEEDS QC
		},

		activate: "  {POKEMON}は 攻撃を こらえた！",
	},
	suctioncups: {
		name: "きゅうばん",
		shortDesc: "相手の技や道具で強制交代されない。", // NEEDS QC

		block: "  {POKEMON}は きゅうばんで はりついている！",
	},
	superluck: {
		name: "きょううん",
		shortDesc: "急所ランクが1段階上がる。", // NEEDS QC
	},
	supersweetsyrup: {
		name: "かんろなミツ",
		shortDesc: "出たとき相手の回避率を1段階下げる。1戦闘に1回。", // NEEDS QC

		start: "  {POKEMON}の ミツから あまいかおりが ただよっている！",
	},
	supremeoverlord: {
		name: "そうだいしょう",
		// Official flavor text: "登場したとき 今まで 倒された 味方の 数が 多いほど 少しずつ 攻撃と 特攻が 上がる。"
		desc: "この特性が発動した時点で味方がひんしになった回数の合計をXとすると、このポケモンの技の威力が(1+X×0.1)倍になる。Xは最大5。", // NEEDS QC
		shortDesc: "倒れた味方1匹につき技の威力+10%（最大5匹）。", // NEEDS QC

		activate: "  {POKEMON}は 倒された 仲間から 力を もらった！",
	},
	surgesurfer: {
		name: "サーフテール",
		shortDesc: "エレキフィールドのとき素早さが2倍になる。", // NEEDS QC
	},
	swarm: {
		name: "むしのしらせ",
		// Official flavor text: "ＨＰが 減ったとき むしタイプの 技の 威力が 上がる。"
		desc: "このポケモンのHPが最大の1/3（切り捨て）以下のとき、むしタイプの技で攻撃する際に攻撃または特攻が1.5倍になる。", // NEEDS QC
		shortDesc: "HP1/3以下でむし技の攻撃能力が1.5倍。", // NEEDS QC
		gen4: {
			desc: "このポケモンのHPが最大HPの1/3（切り捨て）以下のとき、むしタイプの攻撃技の威力が1.5倍になる。", // NEEDS QC
			shortDesc: "HPが1/3以下のとき、むし技の威力が1.5倍になる。", // NEEDS QC
		},
	},
	sweetveil: {
		name: "スイートベール",
		// Official flavor text: "味方の ポケモンは 眠らなくなる。"
		desc: "このポケモンと味方はねむり状態にならないが、すでに眠っているポケモンはすぐには目覚めない。このポケモンと味方はねむるを使っても失敗し、あくびの影響も受けず、すでにあくび状態のポケモンも眠らなくなる。", // NEEDS QC
		shortDesc: "自分と味方はねむり状態にならない。", // NEEDS QC

		block: "  {POKEMON}は スイートベールで 眠らない！",
	},
	swiftswim: {
		name: "すいすい",
		// Official flavor text: "天気が 雨のとき 素早さが 上がる。"
		desc: "天気があめのとき、素早さが2倍になる。ばんのうがさを持っていると発動しない。", // NEEDS QC
		shortDesc: "雨のとき素早さが2倍になる。", // NEEDS QC
		gen7: {
			desc: "天気があめの場合、このポケモンの素早さが2倍になる。", // NEEDS QC
		},
	},
	swordofruin: {
		name: "わざわいのつるぎ",
		shortDesc: "この特性を持たない場のポケモンの防御が0.75倍。", // NEEDS QC

		start: "  {POKEMON}の わざわいのつるぎで まわりの 防御が 弱まった！",
	},
	symbiosis: {
		name: "きょうせい",
		// Official flavor text: "味方が 道具を 使うと 自分の 持っている 道具を 味方に 渡す。"
		desc: "味方が道具を使ったとき、すぐに自分の道具をその味方に渡す。味方の道具が奪われたりはたきおとされたりした場合や、味方がだっしゅつボタン・だっしゅつパックを使った場合は発動しない。", // NEEDS QC
		shortDesc: "味方が道具を使うと自分の道具を渡す。", // NEEDS QC
		gen7: {
			desc: "味方が道具を使うと、このポケモンの持ち物をすぐにその味方に渡す。味方の道具が奪われた・はたき落とされた場合や、味方がだっしゅつボタンを使った場合は発動しない。", // NEEDS QC
		},
		gen6: {
			desc: "味方が道具を使うと、このポケモンの持ち物をすぐにその味方に渡す。味方の道具が奪われた・はたき落とされた場合は発動しない。", // NEEDS QC
		},

		activate: "  {POKEMON}は {ITEM}を {TARGET}に 持たせた！",
	},
	synchronize: {
		name: "シンクロ",
		// Official flavor text: "自分が なってしまった どくや まひや やけどを 相手に うつす。"
		desc: "他のポケモンによってやけど・まひ・どく・もうどく状態にされたとき、そのポケモンも同じ状態異常にする。", // NEEDS QC
		shortDesc: "やけど・どく・まひにされると相手も同じ状態になる。", // NEEDS QC
		gen4: {
			desc: "他のポケモンがこのポケモンをやけど・まひ・どく状態にすると、そのポケモンも同じ状態異常になる。他のポケモンがこのポケモンをもうどく状態にすると、そのポケモンはどく状態になる。", // NEEDS QC
		},
	},
	tabletsofruin: {
		name: "わざわいのおふだ",
		shortDesc: "この特性を持たない場のポケモンの攻撃が0.75倍。", // NEEDS QC

		start: "  {POKEMON}の わざわいのおふだで まわりの 攻撃が 弱まった！",
	},
	tangledfeet: {
		name: "ちどりあし",
		shortDesc: "こんらんの間、回避率が2倍になる。", // NEEDS QC
	},
	tanglinghair: {
		name: "カーリーヘアー",
		shortDesc: "直接攻撃してきた相手の素早さを1段階下げる。", // NEEDS QC
	},
	technician: {
		name: "テクニシャン",
		// Official flavor text: "威力が 低い 技の 威力を 高くして 攻撃できる。"
		desc: "威力が60以下の技の威力が1.5倍になる。わるあがきにも適用される。この効果は技自身の威力を変える効果の後に適用される。", // NEEDS QC
		shortDesc: "威力60以下の技の威力が1.5倍になる。", // NEEDS QC
		gen4: {
			desc: "このポケモンの威力60以下の技は威力が1.5倍になる。わるあがきは除く。この効果は技自体の威力変化やじゅうでん・てだすけの効果の後に適用される。", // NEEDS QC
			shortDesc: "威力60以下の技は威力1.5倍。わるあがきは除く。", // NEEDS QC
		},
	},
	telepathy: {
		name: "テレパシー",
		shortDesc: "味方の攻撃のダメージを受けない。", // NEEDS QC

		block: "  {POKEMON}は 味方からの 攻撃を 受けない！",
	},
	teraformzero: {
		name: "ゼロフォーミング",
		shortDesc: "（テラパゴス専用）テラスタルで天気とフィールドを消す。1戦闘に1回。", // NEEDS QC
	},
	terashell: {
		name: "テラスシェル",
		// Official flavor text: "全タイプの力を 秘めた甲羅は HPが 満タンの ときに 受ける ダメージを すべて 今ひとつに する。"
		desc: "このポケモンがHP満タンのテラパゴスの場合、受ける攻撃の相性が、無効でない限りすべて0.5（今ひとつ）になる。連続攻撃技には最初の攻撃と同じ相性が最後まで適用される。", // NEEDS QC; =0.5 semantics per jara-blog
		shortDesc: "（テラパゴス専用）HP満タンなら受ける技の相性がすべて0.5になる。", // NEEDS QC

		activate: "  {POKEMON}は 甲羅を かがやかせ タイプ相性を 歪める！！",
	},
	terashift: {
		name: "テラスチェンジ",
		shortDesc: "テラパゴスが出たときテラスタルフォルムになる。", // NEEDS QC

		transform: "{POKEMON}の 姿が 変化した！",
	},
	teravolt: {
		name: "テラボルテージ",
		// Official flavor text: "相手の 特性に ジャマされず 相手に 技を 出すことが できる。"
		desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はテイルアーマー・アロマベール・オーラブレイク・カブトアーマー・はとむね・ぼうだん・クリアボディ・あまのじゃく・しめりけ・ビビッドボディ・ばけのかわ・かんそうはだ・どしょく・フィルター・もらいび・フラワーギフト・フラワーベール・もふもふ・フレンドガード・ファーコート・おうごんのからだ・くさのけがわ・ばんけん・たいねつ・ヘヴィメタル・かいりきバサミ・アイスフェイス・こおりのりんぷん・はっこう・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・しんがん・ミラーアーマー・でんきエンジン・マルチスケイル・どんかん・ぼうじん・マイペース・パステルベール・パンクロック・きよめのしお・じょおうのいげん・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・スイートベール・ちどりあし・テレパシー・テラスシェル・ねつこうかん・あついしぼう・てんねん・やるき・ちくでん・ちょすい・すいほう・みずのベール・こんがりボディ・しろいけむり・かぜのり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうか、その特性がこのポケモンにとって有利かどうかに関わらず、場の他のすべてのポケモンに及ぶ。", // NEEDS QC
		shortDesc: "相手の特性を無視して技を出せる。", // NEEDS QC
		gen8: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はアロマベール・オーラブレイク・カブトアーマー・はとむね・ぼうだん・クリアボディ・あまのじゃく・しめりけ・ビビッドボディ・ばけのかわ・かんそうはだ・フィルター・もらいび・フラワーギフト・フラワーベール・もふもふ・フレンドガード・ファーコート・くさのけがわ・たいねつ・ヘヴィメタル・かいりきバサミ・アイスフェイス・こおりのりんぷん・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・ミラーアーマー・でんきエンジン・マルチスケイル・どんかん・ぼうじん・マイペース・パステルベール・パンクロック・じょおうのいげん・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・スイートベール・ちどりあし・テレパシー・あついしぼう・てんねん・やるき・ちくでん・ちょすい・すいほう・みずのベール・しろいけむり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。その特性がこのポケモンに有利かどうかも関係ない。", // NEEDS QC
		},
		gen7: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はアロマベール・オーラブレイク・カブトアーマー・はとむね・ぼうだん・クリアボディ・あまのじゃく・しめりけ・ダークオーラ・ビビッドボディ・ばけのかわ・かんそうはだ・フェアリーオーラ・フィルター・もらいび・フラワーギフト・フラワーベール・もふもふ・フレンドガード・ファーコート・くさのけがわ・たいねつ・ヘヴィメタル・かいりきバサミ・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・でんきエンジン・マルチスケイル・どんかん・ぼうじん・マイペース・じょおうのいげん・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・スイートベール・ちどりあし・テレパシー・あついしぼう・てんねん・やるき・ちくでん・ちょすい・すいほう・みずのベール・しろいけむり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。その特性がこのポケモンに有利かどうかも関係ない。", // NEEDS QC
		},
		gen6: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はアロマベール・オーラブレイク・カブトアーマー・はとむね・ぼうだん・クリアボディ・あまのじゃく・しめりけ・ダークオーラ・かんそうはだ・フェアリーオーラ・フィルター・もらいび・フラワーギフト・フラワーベール・フレンドガード・ファーコート・くさのけがわ・たいねつ・ヘヴィメタル・かいりきバサミ・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・でんきエンジン・マルチスケイル・どんかん・ぼうじん・マイペース・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・スイートベール・ちどりあし・テレパシー・あついしぼう・てんねん・やるき・ちくでん・ちょすい・みずのベール・しろいけむり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。その特性がこのポケモンに有利かどうかも関係ない。", // NEEDS QC
		},
		gen5: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はカブトアーマー・はとむね・クリアボディ・あまのじゃく・しめりけ・かんそうはだ・フィルター・もらいび・フラワーギフト・フレンドガード・たいねつ・ヘヴィメタル・かいりきバサミ・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・でんきエンジン・マルチスケイル・どんかん・マイペース・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・ちどりあし・テレパシー・あついしぼう・てんねん・やるき・ちくでん・ちょすい・みずのベール・しろいけむり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。その特性がこのポケモンに有利かどうかも関係ない。", // NEEDS QC
		},
		gen4: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はカブトアーマー・クリアボディ・しめりけ・かんそうはだ・フィルター・もらいび・フラワーギフト・たいねつ・かいりきバサミ・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ひらいしん・じゅうなん・マグマのよろい・ふしぎなうろこ・でんきエンジン・どんかん・マイペース・すながくれ・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・ちどりあし・あついしぼう・てんねん・やるき・ちくでん・ちょすい・みずのベール・しろいけむり・ふしぎなまもり。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。味方の特性フラワーギフトによる攻撃の補正は無視しない。", // NEEDS QC
		},

		start: "  {POKEMON}は 弾ける オーラを 放っている！",
	},
	thermalexchange: {
		name: "ねつこうかん",
		// Official flavor text: "ほのおタイプの 技を 受けると 攻撃が 上がる。 やけど状態に ならない。"
		desc: "ほのおタイプの技でダメージを受けたとき、攻撃が1段階上がる。やけど状態にならない。やけど状態でこの特性を得ると治る。", // NEEDS QC
		shortDesc: "ほのお技を受けると攻撃+1。やけどにならない。", // NEEDS QC
	},
	thickfat: {
		name: "あついしぼう",
		// Official flavor text: "厚い 脂肪で 守られているので ほのおタイプと こおりタイプの 技の ダメージを 半減させる。"
		desc: "このポケモンがほのおタイプまたはこおりタイプの攻撃を受けるとき、ダメージ計算で攻撃側の能力（攻撃または特攻）が半分として扱われる。", // NEEDS QC
		shortDesc: "ほのお・こおり技のダメージが半減する。", // NEEDS QC
		gen4: {
			desc: "このポケモンが受けるほのお・こおりタイプの攻撃の威力が半分になる。", // NEEDS QC
			shortDesc: "受けるほのお/こおり技の威力が半分になる。", // NEEDS QC
		},
		gen3: {
			desc: "他のポケモンがこのポケモンにほのお・こおりタイプの攻撃を使うと、このポケモンへのダメージ計算時にそのポケモンの特攻が半分になる。", // NEEDS QC
			shortDesc: "このポケモンへのほのお/こおり技は特攻半分で計算される。", // NEEDS QC
		},
	},
	tintedlens: {
		name: "いろめがね",
		shortDesc: "効果いまひとつの技のダメージが2倍になる。", // NEEDS QC
	},
	torrent: {
		name: "げきりゅう",
		// Official flavor text: "ＨＰが 減ったとき みずタイプの 技の 威力が 上がる。"
		desc: "このポケモンのHPが最大の1/3（切り捨て）以下のとき、みずタイプの技で攻撃する際に攻撃または特攻が1.5倍になる。", // NEEDS QC
		shortDesc: "HP1/3以下でみず技の攻撃能力が1.5倍。", // NEEDS QC
		gen4: {
			desc: "このポケモンのHPが最大HPの1/3（切り捨て）以下のとき、みずタイプの攻撃技の威力が1.5倍になる。", // NEEDS QC
			shortDesc: "HPが1/3以下のとき、みず技の威力が1.5倍になる。", // NEEDS QC
		},
	},
	toughclaws: {
		name: "かたいツメ",
		shortDesc: "直接攻撃の威力が1.3倍になる。", // NEEDS QC
	},
	toxicboost: {
		name: "どくぼうそう",
		// Official flavor text: "どく状態に なったとき 物理技の 威力が 上がる。"
		desc: "このポケモンがどく状態の間、物理技の威力が1.5倍になる。", // NEEDS QC
		shortDesc: "どく状態のとき物理技の威力が1.5倍になる。", // NEEDS QC
	},
	toxicchain: {
		name: "どくのくさり",
		// Official flavor text: "毒素を ふくんだ 鎖の力で 技を 当てた 相手を 猛毒の状態に することが ある。"
		desc: "このポケモンの攻撃に、30%の確率でもうどくの追加効果が加わる。この効果は技本来の追加効果の判定の前に行われる。", // NEEDS QC
		shortDesc: "攻撃技に30%のもうどく追加効果がつく。", // NEEDS QC
	},
	toxicdebris: {
		name: "どくげしょう",
		shortDesc: "物理攻撃を受けると相手側にどくびしをまく。", // NEEDS QC
	},
	trace: {
		name: "トレース",
		// Official flavor text: "登場 したとき 相手の 特性を トレースして 同じ 特性に なる。"
		desc: "場に出たとき、ランダムな相手のポケモンの特性をコピーする。コピーできない特性はじんばいったい・きずなへんげ・ぜったいねむり・しれいとう・ばけのかわ・おもかげやどし・フラワーギフト・てんきや・はらぺこスイッチ・アイスフェイス・イリュージョン・かわりもの・マルチタイプ・かがくへんかガス・どくくぐつ・スワームチェンジ・かがくのちから・こだいかっせい・クォークチャージ・レシーバー・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・ゼロフォーミング・テラスシェル・テラスチェンジ・トレース・ダルマモード・マイティチェンジ。コピーできる特性を持つ相手がいない場合、現れた時点で発動する。", // NEEDS QC
		shortDesc: "出たとき（または可能になり次第）相手の特性をコピーする。", // NEEDS QC
		gen8: {
			desc: "場に出たとき、相手のポケモン1匹の特性をランダムにコピーする。じんばいったい・きずなへんげ・ぜったいねむり・ばけのかわ・フラワーギフト・てんきや・うのミサイル・はらぺこスイッチ・アイスフェイス・イリュージョン・かわりもの・マルチタイプ・かがくへんかガス・スワームチェンジ・かがくのちから・レシーバー・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・トレース・ダルマモードはコピーできない。コピーできる特性を持つ相手がいない場合、現れ次第この特性が発動する。", // NEEDS QC
		},
		gen7: {
			desc: "場に出たとき、相手のポケモン1匹の特性をランダムにコピーする。きずなへんげ・ぜったいねむり・ばけのかわ・フラワーギフト・てんきや・イリュージョン・かわりもの・マルチタイプ・スワームチェンジ・かがくのちから・レシーバー・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・トレース・ダルマモードはコピーできない。コピーできる特性を持つ相手がいない場合、現れ次第この特性が発動する。", // NEEDS QC
		},
		gen6: {
			desc: "場に出たとき、隣接する相手のポケモン1匹の特性をランダムにコピーする。フラワーギフト・てんきや・イリュージョン・かわりもの・マルチタイプ・バトルスイッチ・トレース・ダルマモードはコピーできない。コピーできる特性を持つ相手がいない場合、現れ次第この特性が発動する。", // NEEDS QC
		},
		gen5: {
			desc: "場に出たとき、隣接する相手のポケモン1匹の特性をランダムにコピーする。フラワーギフト・てんきや・イリュージョン・かわりもの・マルチタイプ・トレース・ダルマモードはコピーできない。コピーできる特性を持つ相手がいない場合、現れ次第この特性が発動する。", // NEEDS QC
		},
		gen4: {
			desc: "場に出たとき、相手のポケモン1匹の特性をランダムにコピーする。てんきや・マルチタイプ・トレースはコピーできない。コピーできる特性を持つ相手がいない場合、現れ次第この特性が発動する。", // NEEDS QC
		},
		gen3: {
			desc: "場に出たとき、相手のポケモン1匹の特性をランダムにコピーする。", // NEEDS QC
		},

		changeAbility: "  {POKEMON}は {SOURCE}の {ABILITY}を トレースした！",
	},
	transistor: {
		name: "トランジスタ",
		shortDesc: "でんき技の攻撃能力が1.3倍になる。", // NEEDS QC
		gen8: {
			shortDesc: "でんき技の攻撃能力が1.5倍になる。", // NEEDS QC
		},
	},
	triage: {
		name: "ヒーリングシフト",
		shortDesc: "回復技の優先度+3。", // NEEDS QC
	},
	truant: {
		name: "なまけ",
		shortDesc: "1ターンおきにしか行動できない。", // NEEDS QC
		gen3: {
			desc: "このポケモンは1ターンおきに技を使わずなまける。ターン終了時の効果でひんしになったポケモンの代わりに場に出た場合、最初のターンをなまける。", // NEEDS QC
		},

		cant: "{POKEMON}は なまけている",
	},
	turboblaze: {
		name: "ターボブレイズ",
		// Official flavor text: "相手の 特性に ジャマされず 相手に 技を 出すことが できる。"
		desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はテイルアーマー・アロマベール・オーラブレイク・カブトアーマー・はとむね・ぼうだん・クリアボディ・あまのじゃく・しめりけ・ビビッドボディ・ばけのかわ・かんそうはだ・どしょく・フィルター・もらいび・フラワーギフト・フラワーベール・もふもふ・フレンドガード・ファーコート・おうごんのからだ・くさのけがわ・ばんけん・たいねつ・ヘヴィメタル・かいりきバサミ・アイスフェイス・こおりのりんぷん・はっこう・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・しんがん・ミラーアーマー・でんきエンジン・マルチスケイル・どんかん・ぼうじん・マイペース・パステルベール・パンクロック・きよめのしお・じょおうのいげん・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・スイートベール・ちどりあし・テレパシー・テラスシェル・ねつこうかん・あついしぼう・てんねん・やるき・ちくでん・ちょすい・すいほう・みずのベール・こんがりボディ・しろいけむり・かぜのり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうか、その特性がこのポケモンにとって有利かどうかに関わらず、場の他のすべてのポケモンに及ぶ。", // NEEDS QC
		shortDesc: "相手の特性を無視して技を出せる。", // NEEDS QC
		gen8: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はアロマベール・オーラブレイク・カブトアーマー・はとむね・ぼうだん・クリアボディ・あまのじゃく・しめりけ・ビビッドボディ・ばけのかわ・かんそうはだ・フィルター・もらいび・フラワーギフト・フラワーベール・もふもふ・フレンドガード・ファーコート・くさのけがわ・たいねつ・ヘヴィメタル・かいりきバサミ・アイスフェイス・こおりのりんぷん・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・ミラーアーマー・でんきエンジン・マルチスケイル・どんかん・ぼうじん・マイペース・パステルベール・パンクロック・じょおうのいげん・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・スイートベール・ちどりあし・テレパシー・あついしぼう・てんねん・やるき・ちくでん・ちょすい・すいほう・みずのベール・しろいけむり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。その特性がこのポケモンに有利かどうかも関係ない。", // NEEDS QC
		},
		gen7: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はアロマベール・オーラブレイク・カブトアーマー・はとむね・ぼうだん・クリアボディ・あまのじゃく・しめりけ・ダークオーラ・ビビッドボディ・ばけのかわ・かんそうはだ・フェアリーオーラ・フィルター・もらいび・フラワーギフト・フラワーベール・もふもふ・フレンドガード・ファーコート・くさのけがわ・たいねつ・ヘヴィメタル・かいりきバサミ・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・でんきエンジン・マルチスケイル・どんかん・ぼうじん・マイペース・じょおうのいげん・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・スイートベール・ちどりあし・テレパシー・あついしぼう・てんねん・やるき・ちくでん・ちょすい・すいほう・みずのベール・しろいけむり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。その特性がこのポケモンに有利かどうかも関係ない。", // NEEDS QC
		},
		gen6: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はアロマベール・オーラブレイク・カブトアーマー・はとむね・ぼうだん・クリアボディ・あまのじゃく・しめりけ・ダークオーラ・かんそうはだ・フェアリーオーラ・フィルター・もらいび・フラワーギフト・フラワーベール・フレンドガード・ファーコート・くさのけがわ・たいねつ・ヘヴィメタル・かいりきバサミ・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・でんきエンジン・マルチスケイル・どんかん・ぼうじん・マイペース・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・スイートベール・ちどりあし・テレパシー・あついしぼう・てんねん・やるき・ちくでん・ちょすい・みずのベール・しろいけむり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。その特性がこのポケモンに有利かどうかも関係ない。", // NEEDS QC
		},
		gen5: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はカブトアーマー・はとむね・クリアボディ・あまのじゃく・しめりけ・かんそうはだ・フィルター・もらいび・フラワーギフト・フレンドガード・たいねつ・ヘヴィメタル・かいりきバサミ・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ライトメタル・ひらいしん・じゅうなん・マジックミラー・マグマのよろい・ふしぎなうろこ・でんきエンジン・マルチスケイル・どんかん・マイペース・すながくれ・そうしょく・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・ちどりあし・テレパシー・あついしぼう・てんねん・やるき・ちくでん・ちょすい・みずのベール・しろいけむり・ふしぎなまもり・ミラクルスキン。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。その特性がこのポケモンに有利かどうかも関係ない。", // NEEDS QC
		},
		gen4: {
			desc: "このポケモンの技とその効果は、他のポケモンの一部の特性を無視する。無視できる特性はカブトアーマー・クリアボディ・しめりけ・かんそうはだ・フィルター・もらいび・フラワーギフト・たいねつ・かいりきバサミ・めんえき・せいしんりょく・ふみん・するどいめ・リーフガード・ふゆう・ひらいしん・じゅうなん・マグマのよろい・ふしぎなうろこ・でんきエンジン・どんかん・マイペース・すながくれ・シェルアーマー・りんぷん・たんじゅん・ゆきがくれ・ハードロック・ぼうおん・ねんちゃく・よびみず・がんじょう・きゅうばん・ちどりあし・あついしぼう・てんねん・やるき・ちくでん・ちょすい・みずのベール・しろいけむり・ふしぎなまもり。この効果は、このポケモンの技の対象かどうかにかかわらず、場にいる他のすべてのポケモンに適用される。味方の特性フラワーギフトによる攻撃の補正は無視しない。", // NEEDS QC
		},

		start: "  {POKEMON}は 燃え盛る オーラを 放っている！",
	},
	unaware: {
		name: "てんねん",
		// Official flavor text: "相手の 能力の 変化を 無視して 攻撃が できる。"
		desc: "ダメージを受けるとき、相手の攻撃・特攻・命中率のランク変化を無視する。ダメージを与えるとき、相手の防御・特防・回避率のランク変化を無視する。", // NEEDS QC
		shortDesc: "相手の能力変化を無視してダメージ計算する。", // NEEDS QC
	},
	unburden: {
		name: "かるわざ",
		// Official flavor text: "持っていた 道具が なくなると 素早さが 上がる。"
		desc: "何らかの理由で持っている道具を失うと、場にいてこの特性を持ち、道具を持っていない間、素早さが2倍になる。", // NEEDS QC
		shortDesc: "道具を失うと素早さ2倍。交代や新しい道具・特性で解除。", // NEEDS QC
	},
	unnerve: {
		name: "きんちょうかん",
		// Official flavor text: "相手を 緊張させて きのみを 食べられなく させる。"
		desc: "このポケモンが場にいる間、相手のポケモンはきのみを使えない。この特性は、設置技や他の特性より先に発動する。", // NEEDS QC
		shortDesc: "場にいる間、相手はきのみを食べられない。", // NEEDS QC

		start: "  {TEAM}は 緊張して きのみが 食べられなくなった！",
	},
	unseenfist: {
		name: "ふかしのこぶし",
		shortDesc: "直接攻撃がまもる系を貫通する（ダイウォールを除く）。", // NEEDS QC
		champions: {
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	vesselofruin: {
		name: "わざわいのうつわ",
		shortDesc: "この特性を持たない場のポケモンの特攻が0.75倍。", // NEEDS QC

		start: "  {POKEMON}の わざわいのうつわで まわりの 特攻が 弱まった！",
	},
	victorystar: {
		name: "しょうりのほし",
		shortDesc: "自分と味方の命中率が1.1倍になる。", // NEEDS QC
	},
	vitalspirit: {
		name: "やるき",
		shortDesc: "ねむり状態にならない。ねむり状態でこの特性を得ると治る。", // NEEDS QC
	},
	voltabsorb: {
		name: "ちくでん",
		// Official flavor text: "でんきタイプの 技を 受けると ダメージを 受けずに 回復する。"
		desc: "このポケモンはでんきタイプの技を無効化し、でんきタイプの技を受けると最大HPの1/4（切り捨て）を回復する。", // NEEDS QC
		shortDesc: "でんき技を無効化し、最大HPの1/4を回復する。", // NEEDS QC
		gen3: {
			desc: "このポケモンはでんきタイプの攻撃技を受けず、受けると最大HPの1/4（切り捨て）を回復する。", // NEEDS QC
			shortDesc: "でんきの攻撃技を無効化し、最大HPの1/4を回復する。", // NEEDS QC
		},
	},
	wanderingspirit: {
		name: "さまようたましい",
		// Official flavor text: "接触する 技で 攻撃 してきた ポケモンと 特性を 入れ替える。"
		desc: "このポケモンに直接攻撃で触れたポケモンと特性を入れ替える。特性がじんばいったい・きずなへんげ・ぜったいねむり・しれいとう・ばけのかわ・おもかげやどし・はらぺこスイッチ・アイスフェイス・イリュージョン・マルチタイプ・かがくへんかガス・どくくぐつ・スワームチェンジ・こだいかっせい・クォークチャージ・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・テラスシェル・テラスチェンジ・ゼロフォーミング・ふしぎなまもり・ダルマモード・マイティチェンジのポケモンには効かない。", // NEEDS QC
		shortDesc: "直接攻撃してきた相手と特性を入れ替える。", // NEEDS QC
		gen8: {
			desc: "このポケモンに直接攻撃で触れたポケモンと特性を入れ替える。特性がじんばいったい・きずなへんげ・ぜったいねむり・ばけのかわ・うのミサイル・はらぺこスイッチ・アイスフェイス・イリュージョン・マルチタイプ・かがくへんかガス・スワームチェンジ・ＡＲシステム・ぎょぐん・リミットシールド・バトルスイッチ・ふしぎなまもり・ダルマモードのポケモンには効かない。", // NEEDS QC
		},

		activate: "#skillswap",
	},
	waterabsorb: {
		name: "ちょすい",
		// Official flavor text: "みずタイプの 技を 受けると ダメージを 受けずに 回復する。"
		desc: "このポケモンはみずタイプの技を無効化し、みずタイプの技を受けると最大HPの1/4（切り捨て）を回復する。", // NEEDS QC
		shortDesc: "みず技を無効化し、最大HPの1/4を回復する。", // NEEDS QC
	},
	waterbubble: {
		name: "すいほう",
		// Official flavor text: "自分に 対する ほのおタイプの 技の 威力を 下げる。 やけど しない。"
		desc: "みずタイプの技で攻撃するとき、攻撃または特攻が2倍になる。ほのおタイプの攻撃を受けるとき、ダメージ計算で攻撃側の能力（攻撃または特攻）が半分として扱われる。やけど状態にならない。やけど状態でこの特性を得ると治る。", // NEEDS QC
		shortDesc: "みず技2倍、受けるほのお技半減、やけどしない。", // NEEDS QC
	},
	watercompaction: {
		name: "みずがため",
		shortDesc: "みず技を受けると防御が2段階上がる。", // NEEDS QC
	},
	waterveil: {
		name: "みずのベール",
		shortDesc: "やけど状態にならない。やけど状態でこの特性を得ると治る。", // NEEDS QC
	},
	weakarmor: {
		name: "くだけるよろい",
		// Official flavor text: "物理技で ダメージを 受けると 防御が 下がり 素早さが ぐーんと 上がる。"
		desc: "物理攻撃を受けたとき、防御が1段階下がり、素早さが2段階上がる。", // NEEDS QC
		shortDesc: "物理攻撃を受けると防御-1、素早さ+2。", // NEEDS QC
		gen6: {
			desc: "このポケモンが物理攻撃を受けると、防御が1段階下がり、素早さが1段階上がる。", // NEEDS QC
			shortDesc: "物理攻撃を受けると防御が1段階下がり、素早さが1段階上がる。", // NEEDS QC
		},
	},
	wellbakedbody: {
		name: "こんがりボディ",
		// Official flavor text: "ほのおタイプの 技を 受けると ダメージを 受けずに 防御が ぐーんと 上がる。"
		desc: "このポケモンはほのおタイプの技を無効化し、ほのおタイプの技を受けると防御が2段階上がる。", // NEEDS QC
		shortDesc: "ほのお技を無効化し、防御が2段階上がる。", // NEEDS QC
	},
	whitesmoke: {
		name: "しろいけむり",
		shortDesc: "能力を下げられない。", // NEEDS QC
	},
	wimpout: {
		name: "にげごし",
		// Official flavor text: "ＨＰが 半分に なると あわてて 逃げ出して 手持ちに 引っ込んで しまう。"
		desc: "このポケモンのHPが最大の1/2より多い状態で、ダメージを受けて最大HPの1/2以下になったとき、すぐに選んだ味方と交代する。連続攻撃技ではすべての攻撃の後に発動する。ちからずくにより追加効果が消された技では発動しない。直接のダメージでも間接ダメージでも発動するが、のろいとみがわりの使用によるHP消費、はらだいこ、いたみわけ、こんらんの自傷ダメージでは発動しない。", // NEEDS QC
		shortDesc: "HPが1/2以下になると控えと交代する。", // NEEDS QC
	},
	windpower: {
		name: "ふうりょくでんき",
		// Official flavor text: "風技を 受けると じゅうでん 状態に なる。"
		desc: "風の技でダメージを受けたとき、または自分の場でおいかぜが始まったとき、じゅうでん状態になる。", // NEEDS QC
		shortDesc: "風の技かおいかぜでじゅうでん状態になる。", // NEEDS QC

		start: "#electromorphosis",
	},
	windrider: {
		name: "かぜのり",
		// Official flavor text: "おいかぜが 吹いたり 風技を 受けると ダメージを 受けずに 攻撃が 上がる。"
		desc: "このポケモンは風の技を無効化し、風の技を受けたとき、または自分の場でおいかぜが始まったとき、攻撃が1段階上がる。", // NEEDS QC
		shortDesc: "風の技を無効化し攻撃+1。おいかぜでも発動。", // NEEDS QC
	},
	wonderguard: {
		name: "ふしぎなまもり",
		shortDesc: "効果ばつぐんの技と間接ダメージしか受けない。", // NEEDS QC
		gen4: {
			shortDesc: "ほのおのキバ・効果ばつぐんの技・間接ダメージでしかダメージを受けない。", // NEEDS QC
		},
		gen3: {
			shortDesc: "効果ばつぐんの技と間接ダメージでしかダメージを受けない。", // NEEDS QC
		},
	},
	wonderskin: {
		name: "ミラクルスキン",
		// Official flavor text: "変化技を 受けにくい 体に なっている。"
		desc: "このポケモンを対象とする、命中判定のある変化技の命中率が50%になる。この効果は命中率を変える他の効果より先に適用される。", // NEEDS QC
		shortDesc: "命中判定のある変化技の命中率が50%になる。", // NEEDS QC
	},
	zenmode: {
		name: "ダルマモード",
		// Official flavor text: "ＨＰが 半分 以下に なると 姿が 変化する。"
		desc: "このポケモンがヒヒダルマまたはガラルヒヒダルマの場合、ターン終了時にHPが最大の1/2以下だとダルマモードになる。ターン終了時にHPが最大の1/2より多いとノーマルモードに戻る。", // NEEDS QC
		shortDesc: "ヒヒダルマがHP1/2以下でダルマモードになる。", // NEEDS QC
		gen7: {
			desc: "このポケモンがヒヒダルマの場合、ターン終了時にHPが半分以下だとダルマモードに変化する。ターン終了時にHPが半分より多いと、ノーマルモードに戻る。", // NEEDS QC
		},
		gen6: {
			desc: "このポケモンがヒヒダルマの場合、ターン終了時にHPが半分以下だとダルマモードに変化する。ターン終了時にHPが半分より多いと、ノーマルモードに戻る。ダルマモード中にこの特性を失うと、すぐにノーマルモードに戻る。", // NEEDS QC
		},

		transform: "ダルマモード 発動！",
		transformEnd: "ダルマモード 解除！",
	},
	zerotohero: {
		name: "マイティチェンジ",
		shortDesc: "イルカマンが交代で下がるとマイティフォルムになる。", // NEEDS QC

		activate: "  {POKEMON}は 変身して 帰ってきた！",
	},

	// CAP
	mountaineer: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "出たターンにいわ技とステルスロックを受けない。", // NEEDS QC
	},
	rebound: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "場に出たとき、一部の変化技を防ぎ、代わりにその技を使った相手に跳ね返す。", // NEEDS QC
		shortDesc: "出たターンに一部の変化技を跳ね返す。", // NEEDS QC

		move: "#magiccoat",
	},
	persistent: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "このポケモンが発動させたじゅうりょく・かいふくふうじ・マジックルーム・しんぴのまもり・おいかぜ・トリックルーム・ワンダールームの効果時間が2ターン延長される。", // NEEDS QC
		shortDesc: "じゅうりょくや各種ルーム等の効果が2ターン延長される。", // NEEDS QC

		activate: "  {POKEMON}は {MOVE}を 2ターン 延長した！", // NEEDS QC
	},
};
