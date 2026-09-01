export const AbilitiesText: { [id: IDEntry]: AbilityText } = {
	noability: {
		name: "無特性", // NEEDS QC
		shortDesc: "沒有任何效果。", // NEEDS QC
	},
	adaptability: {
		name: "適應力",
		// Official flavor text: "與自身同屬性的招式 威力會提高。"
		desc: "該寶可夢與自身屬性一致的招式的屬性一致加成（STAB）由1.5倍變為2倍。", // NEEDS QC
		shortDesc: "屬性一致加成由1.5倍變為2倍。", // NEEDS QC
	},
	aerilate: {
		name: "飛行皮膚",
		// Official flavor text: "一般屬性的招式 會變為飛行屬性。 威力會少量提高。"
		desc: "該寶可夢的一般屬性招式變為飛行屬性，威力變為1.2倍。此效果在其他改變招式屬性的效果之後、等離子浴和輸電的效果之前適用。", // NEEDS QC
		shortDesc: "一般屬性招式變為飛行屬性，威力1.2倍。", // NEEDS QC
		gen6: {
			desc: "該寶可夢的一般屬性招式變為飛行屬性，威力變為1.3倍。此效果在其他改變招式屬性的效果之後、等離子浴和輸電的效果之前適用。", // NEEDS QC
			shortDesc: "該寶可夢的一般屬性招式變為飛行屬性，威力1.3倍。", // NEEDS QC
		},
	},
	aftermath: {
		name: "引爆",
		// Official flavor text: "瀕死時， 會對接觸到自己的對手造成傷害。"
		desc: "該寶可夢因接觸類招式瀕死時，攻擊方失去最大HP的1/4（向下取整）。若攻擊方的特性為魔法防守，或場上有特性為濕氣的寶可夢，則此效果不會發動。", // NEEDS QC
		shortDesc: "因接觸類招式瀕死時，攻擊方失去最大HP的1/4。", // NEEDS QC

		damage: "  {POKEMON}受到了傷害！",
	},
	airlock: {
		name: "氣閘",
		shortDesc: "在場時，天氣的效果消失。", // NEEDS QC

		start: "  天氣的影響消失了！",
	},
	analytic: {
		name: "分析",
		// Official flavor text: "如果在最後使出招式， 招式的威力就會變強。"
		desc: "若該寶可夢在一回合中最後行動，其招式威力變為1.3倍。對破滅之願和預知未來無效。", // NEEDS QC
		shortDesc: "在回合中最後行動時，招式威力變為1.3倍。", // NEEDS QC
	},
	angerpoint: {
		name: "憤怒穴位",
		// Official flavor text: "要害被擊中時會大發雷霆。 攻擊力會提高到最大。"
		desc: "該寶可夢（而非其替身）被擊中要害時，攻擊提高12級。", // NEEDS QC
		shortDesc: "（替身以外）被擊中要害時，攻擊提高12級。", // NEEDS QC
		gen4: {
			desc: "該寶可夢或其替身被擊中要害時，攻擊提高12級。", // NEEDS QC
			shortDesc: "該寶可夢或其替身被擊中要害時，攻擊提高12級。", // NEEDS QC
		},

		boost: "  {POKEMON}的攻擊被提高到了最大！",
	},
	angershell: {
		name: "憤怒甲殼",
		desc: "該寶可夢的HP高於最大HP的1/2、且受到攻擊傷害後降至1/2或以下時，其攻擊、特攻、速度各提高1級，防禦、特防各降低1級。此效果在連續攻擊招式的所有攻擊結束後判定。若招式的追加效果被特性強行消除，則此效果不會發動。", // NEEDS QC
		shortDesc: "HP變為1/2以下時，攻擊、特攻、速度+1，防禦、特防-1。", // NEEDS QC
	},
	anticipation: {
		name: "危險預知",
		// Official flavor text: "察覺對手持有的 危險招式。"
		desc: "出場時，若對手擁有對該寶可夢效果絕佳的攻擊招式或一擊必殺招式，該寶可夢會感到戰慄。覺醒力量按其實際屬性判定，其他招式按原本屬性判定。", // NEEDS QC
		shortDesc: "出場時，對手有效果絕佳或一擊必殺招式則會戰慄。", // NEEDS QC
		gen5: {
			desc: "出場時，若對手寶可夢擁有對該寶可夢效果絕佳的攻擊招式或一擊必殺招式，會戰慄示警。招式按其原本屬性判定。", // NEEDS QC
		},
		gen4: {
			desc: "出場時，若對手寶可夢擁有對該寶可夢效果絕佳的攻擊招式，或擁有對該寶可夢並非無效的一擊必殺招式且等級不低於該寶可夢，會戰慄示警。招式按其原本屬性判定。雙倍奉還、龍之怒、金屬爆炸、鏡面反射、黑夜魔影、精神波、地球上投不會觸發此效果。在進行判定前，會考慮該寶可夢是否攜帶黑色鐵球、是否處於識破、重力、扎根、奇跡之眼、羽棲的效果下，以及對手的特性是否為一般皮膚或膽量。", // NEEDS QC
		},

		activate: "  {POKEMON}發抖了！",
	},
	arenatrap: {
		name: "沙穴",
		// Official flavor text: "在戰鬥中讓對手無法逃走。"
		desc: "使對手無法選擇交換。不在地面上的寶可夢、攜帶美麗空殼的寶可夢和幽靈屬性寶可夢除外。", // NEEDS QC
		shortDesc: "使地面上的對手無法交換。", // NEEDS QC
		gen6: {
			desc: "使相鄰的對手無法選擇交換。不在地面上的寶可夢、攜帶美麗空殼的寶可夢和幽靈屬性寶可夢除外。", // NEEDS QC
		},
		gen5: {
			desc: "使相鄰的對手無法選擇交換。不在地面上的寶可夢和攜帶美麗空殼的寶可夢除外。", // NEEDS QC
		},
		gen4: {
			desc: "使對手無法選擇交換。不在地面上的寶可夢和攜帶美麗空殼的寶可夢除外。", // NEEDS QC
		},
		gen3: {
			desc: "使對手無法選擇交換。不在地面上的寶可夢除外。", // NEEDS QC
		},
	},
	armortail: {
		name: "尾甲",
		desc: "對手使用的以該寶可夢或其隊友為目標的先制招式無法生效。", // NEEDS QC
		shortDesc: "使對手指向己方的先制招式無效。", // NEEDS QC

		block: "#damp",
	},
	aromaveil: {
		name: "芳香幕",
		// Official flavor text: "可防住向自己和同伴 發出的心靈攻擊。"
		desc: "該寶可夢及其隊友不會受到迷人、定身法、再來一次、回復封鎖、挑釁、無理取鬧的影響。", // NEEDS QC
		shortDesc: "保護己方不受著迷、再來一次、挑釁等影響。", // NEEDS QC

		block: "  {POKEMON}正受到芳香幕的保護！",
	},
	asone: {
		name: "人馬一體",
		shortDesc: "參見人馬一體（雪暴馬／靈幽馬）。", // NEEDS QC

		start: "  {POKEMON}兼具２種特性！",
	},
	asoneglastrier: {
		name: "人馬一體（雪暴馬）", // PS-style disambiguator (not part of the official name)
		shortDesc: "緊張感和蒼白嘶鳴的組合。", // NEEDS QC
	},
	asonespectrier: {
		name: "人馬一體（靈幽馬）", // PS-style disambiguator (not part of the official name)
		shortDesc: "緊張感和漆黑嘶鳴的組合。", // NEEDS QC
	},
	aurabreak: {
		name: "氣場破壞",
		// Official flavor text: "讓氣場的效果逆轉， 並降低威力。"
		desc: "該寶可夢在場時，暗黑氣場和妖精氣場的效果反轉，惡屬性和妖精屬性招式的威力分別變為3/4而非1.33倍。", // NEEDS QC
		shortDesc: "暗黑氣場、妖精氣場的加成變為0.75倍。", // NEEDS QC

		start: "  {POKEMON}壓制了所有氣場！",
	},
	auraguard: {
		name: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	baddreams: {
		name: "夢魘",
		// Official flavor text: "給予陷入睡眠狀態的對手傷害。"
		desc: "每回合結束時，處於睡眠狀態的對手失去最大HP的1/8（向下取整）。", // NEEDS QC
		shortDesc: "睡眠狀態的對手每回合失去最大HP的1/8。", // NEEDS QC
		gen6: {
			desc: "每回合結束時，處於睡眠狀態的相鄰對手寶可夢失去最大HP的1/8（向下取整）。", // NEEDS QC
			shortDesc: "每回合結束時，睡眠中的相鄰對手失去最大HP的1/8。", // NEEDS QC
		},
		gen4: {
			desc: "每回合結束時，處於睡眠狀態的對手失去最大HP的1/8（向下取整）。", // NEEDS QC
			shortDesc: "睡眠狀態的對手每回合失去最大HP的1/8。", // NEEDS QC
		},

		damage: "  {POKEMON}正被惡夢纏身！",
	},
	ballfetch: {
		name: "撿球",
		shortDesc: "沒有對戰效果。", // NEEDS QC
	},
	battery: {
		name: "蓄電池",
		shortDesc: "隊友的特殊招式威力變為1.3倍。", // NEEDS QC
	},
	battlearmor: {
		name: "戰鬥盔甲",
		shortDesc: "不會被擊中要害。", // NEEDS QC
	},
	battlebond: {
		name: "牽絆變身",
		// Official flavor text: "打倒對手時，與訓練家的牽絆會加深， 變化成小智版甲賀忍蛙。 飛水手裡劍的威力會增強。"
		desc: "若該寶可夢是甲賀忍蛙，其使其他寶可夢瀕死時，攻擊、特攻、速度各提高1級。此效果每場戰鬥只能發動1次。", // NEEDS QC
		shortDesc: "打倒對手後攻擊、特攻、速度+1。每場戰鬥1次。", // NEEDS QC
		gen8: {
			desc: "該寶可夢是甲賀忍蛙時，用攻擊打倒其他寶可夢後變為小智版甲賀忍蛙。小智版甲賀忍蛙的飛水手裡劍威力為20且必定攻擊3次。", // NEEDS QC
			shortDesc: "打倒對手後變為小智版甲賀忍蛙。飛水手裡劍：威力20，攻擊3次。", // NEEDS QC
		},
		activate: "  {POKEMON}渾身充滿了牽絆之力！",
		transform: "{POKEMON}變身成了小智版甲賀忍蛙！",
	},
	beadsofruin: {
		name: "災禍之玉",
		shortDesc: "場上不具此特性的寶可夢特防變為0.75倍。", // NEEDS QC

		start: "  因為{POKEMON}的災禍之玉，周圍的特防減弱了！",
	},
	beastboost: {
		name: "異獸提升",
		// Official flavor text: "打倒對手的時候， 會提高自己最高的那項能力。"
		desc: "該寶可夢使其他寶可夢瀕死時，其數值最高的能力提高1級。此判定不考慮能力等級變化。若多項能力相同，按攻擊、防禦、特攻、特防、速度的順序優先。", // NEEDS QC
		shortDesc: "打倒對手後，數值最高的能力提高1級。", // NEEDS QC
	},
	berserk: {
		name: "怒火沖天",
		// Official flavor text: "ＨＰ因對手的攻擊 降到一半時， 特攻會提高。"
		desc: "該寶可夢的HP高於最大HP的1/2、且受到攻擊傷害後降至1/2或以下時，其特攻提高1級。此效果在連續攻擊招式的所有攻擊結束後判定。若招式的追加效果被特性強行消除，則此效果不會發動。", // NEEDS QC
		shortDesc: "HP變為1/2以下時，特攻提高1級。", // NEEDS QC
	},
	bigpecks: {
		name: "健壯胸肌",
		shortDesc: "防禦不會被降低。", // NEEDS QC
	},
	blaze: {
		name: "猛火",
		// Official flavor text: "ＨＰ減少的時候， 火屬性的招式威力會提高。"
		desc: "該寶可夢的HP為最大HP的1/3（向下取整）或以下時，其使用火屬性攻擊時進攻能力變為1.5倍。", // NEEDS QC
		shortDesc: "HP為1/3以下時，火屬性攻擊的進攻能力變為1.5倍。", // NEEDS QC
		gen4: {
			desc: "該寶可夢的HP為最大HP的1/3（向下取整）以下時，其火屬性攻擊招式的威力變為1.5倍。", // NEEDS QC
			shortDesc: "HP為1/3以下時，火屬性攻擊的威力變為1.5倍。", // NEEDS QC
		},
	},
	bulletproof: {
		name: "防彈",
		shortDesc: "不受彈類招式影響。", // NEEDS QC
	},
	cheekpouch: {
		name: "頰囊",
		// Official flavor text: "無論是哪種樹果， 吃下去後ＨＰ都會回復。"
		desc: "該寶可夢吃掉攜帶的樹果時，除樹果的效果外，還回復最大HP的1/3（向下取整）。在蟲咬、投擲、啄食、大快朵頤、茶會的效果之後，若吃掉的樹果對該寶可夢生效，此效果也會發動。", // NEEDS QC
		shortDesc: "吃掉樹果後，額外回復最大HP的1/3。", // NEEDS QC
		gen7: {
			desc: "該寶可夢吃掉攜帶的樹果時，除樹果的效果外還會回復最大HP的1/3（向下取整）。通過蟲咬、投擲、啄食吃掉的樹果對該寶可夢有效果時也會觸發。", // NEEDS QC
		},
	},
	chillingneigh: {
		name: "蒼白嘶鳴",
		// Official flavor text: "打倒對手時 會用冰冷的聲音嘶鳴 並提高攻擊。"
		desc: "該寶可夢使其他寶可夢瀕死時，攻擊提高1級。", // NEEDS QC
		shortDesc: "打倒對手後，攻擊提高1級。", // NEEDS QC
	},
	chlorophyll: {
		name: "葉綠素",
		// Official flavor text: "天氣為晴朗時， 速度會提高。"
		desc: "大晴天時，該寶可夢的速度變為2倍。攜帶萬能傘時此效果不會發動。", // NEEDS QC
		shortDesc: "大晴天時速度變為2倍。", // NEEDS QC
		gen7: {
			desc: "天氣為大晴天時，該寶可夢的速度變為2倍。", // NEEDS QC
		},
	},
	clearbody: {
		name: "恆淨之軀",
		shortDesc: "能力等級不會被其他寶可夢降低。", // NEEDS QC
	},
	cloudnine: {
		name: "無關天氣",
		shortDesc: "在場時，天氣的效果消失。", // NEEDS QC

		start: "#airlock",
	},
	colorchange: {
		name: "變色",
		// Official flavor text: "自己的屬性會變為 擊中自己的對手招式的屬性。"
		desc: "該寶可夢的屬性變為最後擊中牠的招式的屬性，除非其已具有該屬性。此效果在連續攻擊招式的所有攻擊結束後判定。若招式的追加效果被特性強行消除，則此效果不會發動。", // NEEDS QC
		shortDesc: "屬性變為擊中自己的招式的屬性。", // NEEDS QC
		gen4: {
			desc: "該寶可夢的屬性變為最後所受招式的屬性。已是該屬性時不變。連續攻擊招式在每次攻擊後都適用。該攻擊未造成HP損失時不觸發。", // NEEDS QC
		},
	},
	comatose: {
		name: "絕對睡眠",
		// Official flavor text: "總是半夢半醒的狀態， 絕對不會醒來。 可在睡著的狀況下進行攻擊。"
		desc: "該寶可夢視為處於睡眠狀態，不會陷入異常狀態，也不受哈欠的影響。", // NEEDS QC
		shortDesc: "視為處於睡眠狀態，不會陷入異常狀態。", // NEEDS QC

		start: "  {POKEMON}處於半夢半醒狀態！",
	},
	commander: {
		name: "發號施令",
		desc: "若該寶可夢是米立龍且場上有隊友吃吼霸，該寶可夢會進入吃吼霸的口中。吃吼霸的攻擊、特攻、速度、防禦、特防各提高2級。效果期間，吃吼霸無法交換，該寶可夢無法選擇行動，以該寶可夢為目標的攻擊會落空，但其仍會受到間接傷害。若該寶可夢在效果期間瀕死，可以交換其他寶可夢上場，但吃吼霸仍然無法交換。若吃吼霸在效果期間瀕死，該寶可夢恢復選擇行動的能力。", // NEEDS QC
		shortDesc: "進入隊友吃吼霸的口中，使其全部能力提高2級。", // NEEDS QC

		activate: "  {POKEMON}作為發號施令者被{TARGET}吞下去了！",
	},
	competitive: {
		name: "好勝",
		// Official flavor text: "能力被降低時， 特攻會大幅提高。"
		desc: "該寶可夢的能力等級每被對手降低1級，特攻提高2級。", // NEEDS QC
		shortDesc: "能力被對手降低時，特攻提高2級。", // NEEDS QC
	},
	compoundeyes: {
		name: "複眼",
		shortDesc: "招式命中率變為1.3倍。", // NEEDS QC
	},
	contrary: {
		name: "唱反調",
		shortDesc: "能力等級變化的升降顛倒。", // NEEDS QC
		gen7: {
			desc: "該寶可夢的能力等級提高時反而降低，降低時反而提高。對使用Z招式前Z力量帶來的能力提升不適用。", // NEEDS QC
		},
		gen6: {
			desc: "該寶可夢的能力等級提高時反而降低，降低時反而提高。", // NEEDS QC
		},
	},
	corrosion: {
		name: "腐蝕",
		shortDesc: "可以無視屬性使對方陷入中毒或劇毒狀態。", // NEEDS QC
	},
	costar: {
		name: "同台共演",
		shortDesc: "出場時複製隊友的能力等級變化。", // NEEDS QC
	},
	cottondown: {
		name: "棉絮",
		// Official flavor text: "受到攻擊時會撒下棉絮， 降低除自己以外的 所有寶可夢的速度。"
		desc: "該寶可夢受到攻擊時，場上所有其他寶可夢的速度降低1級。", // NEEDS QC
		shortDesc: "受到攻擊時，其他所有寶可夢的速度降低1級。", // NEEDS QC
	},
	cudchew: {
		name: "反芻",
		shortDesc: "吃過的樹果會在下一回合結束時再吃1次。", // NEEDS QC
	},
	curiousmedicine: {
		name: "怪藥",
		shortDesc: "出場時重置隊友的能力等級變化。", // NEEDS QC
	},
	cursedbody: {
		name: "詛咒之軀",
		// Official flavor text: "受到攻擊時， 有時會把對手的招式 變為定身法狀態。"
		desc: "該寶可夢受到攻擊時，有30%的機率使該招式陷入定身法狀態；若攻擊方已有招式處於定身法狀態，則不會發動。", // NEEDS QC
		shortDesc: "受到攻擊時，有30%的機率封印該招式。", // NEEDS QC
	},
	cutecharm: {
		name: "迷人之軀",
		// Official flavor text: "有時會讓接觸到自己的對手 陷入著迷狀態。"
		desc: "與該寶可夢直接接觸的異性寶可夢有30%的機率陷入著迷狀態。", // NEEDS QC
		shortDesc: "有30%的機率使接觸自己的異性陷入著迷。", // NEEDS QC
		gen4: {
			desc: "用接觸類招式攻擊該寶可夢的異性寶可夢有30%的機率陷入著迷狀態。該攻擊未造成HP損失時不觸發。", // NEEDS QC
		},
		gen3: {
			desc: "用接觸類招式攻擊該寶可夢的異性寶可夢有1/3的機率陷入著迷狀態。該攻擊未造成HP損失時不觸發。", // NEEDS QC
			shortDesc: "有1/3的機率使接觸的異性寶可夢著迷。", // NEEDS QC
		},
	},
	damp: {
		name: "濕氣",
		// Official flavor text: "透過把周圍都弄濕， 使誰都無法使用自爆等爆炸類的招式。"
		desc: "該寶可夢在場時，大爆炸、驚爆大頭、薄霧炸裂、自爆和特性引爆無法生效。", // NEEDS QC
		shortDesc: "阻止大爆炸和引爆等自爆類效果。", // NEEDS QC
		gen7: {
			desc: "該寶可夢在場期間，大爆炸、驚爆大頭、自爆和特性引爆不會發動。", // NEEDS QC
			shortDesc: "在場期間阻止大爆炸/驚爆大頭/自爆/引爆。", // NEEDS QC
		},
		gen6: {
			desc: "該寶可夢在場期間，大爆炸、自爆和特性引爆不會發動。", // NEEDS QC
			shortDesc: "在場期間阻止大爆炸/自爆/引爆。", // NEEDS QC
		},
		gen3: {
			desc: "該寶可夢在場期間，大爆炸和自爆不會發動。", // NEEDS QC
			shortDesc: "在場期間阻止大爆炸和自爆。", // NEEDS QC
		},

		block: "  {SOURCE}無法使用{MOVE}！",
	},
	dancer: {
		name: "舞者",
		// Official flavor text: "當有誰使出跳舞招式時， 自己也能接著使出跳舞招式。"
		desc: "其他寶可夢使用舞蹈類招式後，該寶可夢會使用相同的招式。複製的招式受所有可阻止招式執行的效果影響。通過此特性使用的招式不會再被其他擁有此特性的寶可夢複製。", // NEEDS QC
		shortDesc: "其他寶可夢使用舞蹈類招式後，自己也使出該招式。", // NEEDS QC
	},
	darkaura: {
		name: "暗黑氣場",
		// Official flavor text: "全體的惡屬性招式變強。"
		desc: "該寶可夢在場時，場上寶可夢使用的惡屬性招式威力變為1.33倍。", // NEEDS QC
		shortDesc: "在場時，惡屬性招式威力變為1.33倍。", // NEEDS QC

		start: "  {POKEMON}釋放著暗黑氣場！",
	},
	dauntlessshield: {
		name: "不屈之盾",
		shortDesc: "出場時防禦提高1級。每場戰鬥1次。", // NEEDS QC
		gen8: {
			shortDesc: "出場時防禦提高1級。", // NEEDS QC
		},
	},
	dazzling: {
		name: "鮮艷之軀",
		// Official flavor text: "讓對手嚇一跳， 使其無法對我方使出先制招式。"
		desc: "對手使用的以該寶可夢或其隊友為目標的先制招式無法生效。", // NEEDS QC
		shortDesc: "使對手指向己方的先制招式無效。", // NEEDS QC

		block: "#damp",
	},
	defeatist: {
		name: "軟弱",
		// Official flavor text: "ＨＰ降到一半以下時， 會變得軟弱而使得 攻擊和特攻減半。"
		desc: "該寶可夢的HP為最大HP的1/2或以下時，攻擊和特攻減半。", // NEEDS QC
		shortDesc: "HP為1/2以下時，攻擊和特攻減半。", // NEEDS QC
	},
	defiant: {
		name: "不服輸",
		// Official flavor text: "能力被降低時， 攻擊會大幅提高。"
		desc: "該寶可夢的能力等級每被對手降低1級，攻擊提高2級。", // NEEDS QC
		shortDesc: "能力被對手降低時，攻擊提高2級。", // NEEDS QC
	},
	deltastream: {
		name: "德爾塔氣流",
		// Official flavor text: "變為令飛行屬性的弱點 消失的天氣。"
		desc: "出場時，天氣變為亂流。亂流會消除飛行屬性寶可夢的飛行屬性弱點。此天氣持續到場上沒有寶可夢具有此特性為止，或被特性終結之地、始源之海改變為止。", // NEEDS QC
		shortDesc: "出場時刮起亂流，直到此特性不在場為止。", // NEEDS QC
	},
	desolateland: {
		name: "終結之地",
		// Official flavor text: "變為讓水屬性攻擊 失效的天氣。"
		desc: "出場時，天氣變為大日照。大日照包含大晴天的所有效果，並使水屬性攻擊招式無法使用。此天氣持續到場上沒有寶可夢具有此特性為止，或被特性德爾塔氣流、始源之海改變為止。", // NEEDS QC
		shortDesc: "出場時日照變得強烈，直到此特性不在場為止。", // NEEDS QC
	},
	disguise: {
		name: "畫皮",
		// Official flavor text: "用畫皮覆蓋住身體， 可防住１次攻擊。"
		desc: "若該寶可夢是謎擬Ｑ，戰鬥中首次受到的攻擊傷害為0（按一般屬性相性判定）。隨後畫皮被識破，變為謎擬Ｑ（現形的樣子），並失去最大HP的1/8。混亂的自傷也會識破畫皮。", // NEEDS QC
		shortDesc: "（謎擬Ｑ專用）擋下首次攻擊，改為失去1/8HP。", // NEEDS QC
		gen7: {
			desc: "若該寶可夢是謎擬Ｑ，戰鬥中首次受到的攻擊傷害為0（按一般屬性相性判定）。隨後畫皮被識破，變為現形的樣子。混亂的自傷也會識破畫皮。", // NEEDS QC
			shortDesc: "（謎擬Ｑ專用）首次受到的攻擊傷害為0，畫皮被識破。", // NEEDS QC
		},

		block: "  畫皮變成了替身！",
		transform: "{POKEMON}的畫皮脫落了！",
	},
	download: {
		name: "下載",
		// Official flavor text: "比較對手的防禦和特防， 根據較低的那項能力 相應地提高自己的攻擊或特攻。"
		desc: "出場時，根據所有對手合計較弱的防禦能力，該寶可夢的攻擊或特攻提高1級。對手的防禦較低時提高攻擊，特防相同或較低時提高特攻。", // NEEDS QC
		shortDesc: "出場時根據對手較弱的防禦，攻擊或特攻+1。", // NEEDS QC
	},
	dragonize: {
		name: "龍皮膚",
		desc: "該寶可夢的一般屬性招式變為龍屬性，威力變為1.2倍。此效果在其他改變招式屬性的效果之後、等離子浴和輸電的效果之前適用。", // NEEDS QC
		shortDesc: "一般屬性招式變為龍屬性，威力1.2倍。", // NEEDS QC
	},
	dragonsmaw: {
		name: "龍顎",
		shortDesc: "龍屬性攻擊的進攻能力變為1.5倍。", // NEEDS QC
	},
	drizzle: {
		name: "降雨",
		shortDesc: "出場時召喚下雨。", // NEEDS QC
	},
	drought: {
		name: "日照",
		shortDesc: "出場時召喚大晴天。", // NEEDS QC
	},
	dryskin: {
		name: "乾燥皮膚",
		// Official flavor text: "下雨天氣時和受到水屬性的招式攻擊時， ＨＰ會回復。晴朗天氣時和受到火屬性的 招式攻擊時，ＨＰ會減少。"
		desc: "該寶可夢不受水屬性招式影響，且被水屬性招式擊中時回復最大HP的1/4（向下取整）。火屬性招式對該寶可夢的威力變為1.25倍。每回合結束時，下雨時回復最大HP的1/8（向下取整），大晴天失去最大HP的1/8（向下取整）。攜帶萬能傘時天氣效果不會發動。", // NEEDS QC
		shortDesc: "受水屬性回復、下雨回復；受火屬性1.25倍，大晴天扣HP。", // NEEDS QC
		gen7: {
			desc: "該寶可夢不受水屬性招式影響，受到水屬性招式時回復最大HP的1/4（向下取整）。受到的火屬性招式威力變為1.25倍。每回合結束時，天氣為下雨時回復最大HP的1/8（向下取整），天氣為大晴天時失去最大HP的1/8（向下取整）。", // NEEDS QC
		},

		damage: "#aftermath",
	},
	earlybird: {
		name: "早起",
		shortDesc: "睡眠回合數以2倍速度減少。", // NEEDS QC
	},
	eartheater: {
		name: "食土",
		desc: "該寶可夢不受地面屬性招式影響，且被地面屬性招式擊中時回復最大HP的1/4（向下取整）。", // NEEDS QC
		shortDesc: "受到地面屬性招式時無效化，並回復最大HP的1/4。", // NEEDS QC
	},
	eelevate: {
		name: "鰻鰻高升",
		desc: "該寶可夢不受地面屬性攻擊及撒菱、毒菱、黏黏網和特性沙穴的影響。受到重力、扎根、擊落、千箭齊發、黑色鐵球的效果時，此免疫失效。千箭齊發可無視此特性擊中該寶可夢。該寶可夢使其他寶可夢瀕死時，其數值最高的能力提高1級。此判定不考慮能力等級變化。若多項能力相同，按攻擊、防禦、特攻、特防、速度的順序優先。", // NEEDS QC
		shortDesc: "不受地面屬性招式影響。打倒對手後最高能力+1。", // NEEDS QC
	},
	effectspore: {
		name: "孢子",
		// Official flavor text: "受到攻擊時， 有時會讓接觸到自己的對手 陷入中毒、麻痺或睡眠狀態。"
		desc: "與該寶可夢直接接觸的寶可夢有30%的機率陷入中毒、麻痺或睡眠狀態。", // NEEDS QC
		shortDesc: "有30%的機率使接觸自己的對手中毒、麻痺或睡眠。", // NEEDS QC
		gen4: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢有30%的機率陷入中毒、麻痺或睡眠狀態。該攻擊未造成HP損失時不觸發。", // NEEDS QC
		},
		gen3: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢有10%的機率陷入中毒、麻痺或睡眠狀態。該攻擊未造成HP損失時不觸發。", // NEEDS QC
			shortDesc: "有10%的機率使接觸的寶可夢中毒/麻痺/睡眠。", // NEEDS QC
		},
	},
	electricsurge: {
		name: "電氣製造者",
		shortDesc: "出場時布下電氣場地。", // NEEDS QC
	},
	electromorphosis: {
		name: "電力轉換",
		shortDesc: "受到攻擊時，進入充電狀態。", // NEEDS QC

		start: "  {POKEMON}受到{MOVE}而充電了！",
	},
	embodyaspectcornerstone: {
		name: "面影輝映（礎石）", // PS-style disambiguator (not part of the official name)
		shortDesc: "出場時防禦提高1級。", // NEEDS QC

		boost: "  {POKEMON}讓礎之假面綻放光輝，提高了防禦！",
	},
	embodyaspecthearthflame: {
		name: "面影輝映（火灶）", // PS-style disambiguator (not part of the official name)
		shortDesc: "出場時攻擊提高1級。", // NEEDS QC

		boost: "  {POKEMON}讓灶之假面綻放光輝，提高了攻擊！",
	},
	embodyaspectteal: {
		name: "面影輝映（碧草）", // PS-style disambiguator (not part of the official name)
		shortDesc: "出場時速度提高1級。", // NEEDS QC

		boost: "  {POKEMON}讓碧之假面綻放光輝，提高了速度！",
	},
	embodyaspectwellspring: {
		name: "面影輝映（水井）", // PS-style disambiguator (not part of the official name)
		shortDesc: "出場時特防提高1級。", // NEEDS QC

		boost: "  {POKEMON}讓井之假面綻放光輝，提高了特防！",
	},
	emergencyexit: {
		name: "危險迴避",
		// Official flavor text: "ＨＰ減到一半時， 為了避開危險， 會退回同行隊伍裡面。"
		desc: "該寶可夢的HP高於最大HP的1/2、且受到傷害後降至1/2或以下時，立即交換為選擇的隊友。此效果在連續攻擊招式的所有攻擊結束後判定。若招式的追加效果被特性強行消除，則此效果不會發動。直接和間接傷害均可觸發，但使用詛咒、替身時的消耗、腹鼓、分擔痛楚和混亂的自傷除外。", // NEEDS QC
		shortDesc: "HP變為1/2以下時，與同伴交換。", // NEEDS QC
	},
	fairyaura: {
		name: "妖精氣場",
		// Official flavor text: "全體的妖精屬性招式變強。"
		desc: "該寶可夢在場時，場上寶可夢使用的妖精屬性招式威力變為1.33倍。", // NEEDS QC
		shortDesc: "在場時，妖精屬性招式威力變為1.33倍。", // NEEDS QC

		start: "  {POKEMON}釋放著妖精氣場！",
	},
	filter: {
		name: "過濾",
		shortDesc: "受到的效果絕佳傷害變為3/4。", // NEEDS QC
	},
	firemane: {
		name: "火焰鬃毛",
		shortDesc: "火屬性攻擊的進攻能力變為1.5倍。", // NEEDS QC
	},
	flamebody: {
		name: "火焰之軀",
		shortDesc: "有30%的機率使接觸自己的對手陷入灼傷。", // NEEDS QC
		gen4: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢有30%的機率陷入灼傷狀態。該攻擊未造成HP損失時不觸發。", // NEEDS QC
		},
		gen3: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢有1/3的機率陷入灼傷狀態。該攻擊未造成HP損失時不觸發。", // NEEDS QC
			shortDesc: "有1/3的機率使接觸的寶可夢灼傷。", // NEEDS QC
		},
	},
	flareboost: {
		name: "受熱激升",
		// Official flavor text: "陷入灼傷狀態時， 特殊招式的威力會提高。"
		desc: "該寶可夢處於灼傷狀態時，其特殊攻擊的威力變為1.5倍。", // NEEDS QC
		shortDesc: "灼傷時特殊招式威力變為1.5倍。", // NEEDS QC
	},
	flashfire: {
		name: "引火",
		// Official flavor text: "受到火屬性的招式攻擊時， 吸收火焰，讓自己使出的 火屬性招式變強。"
		desc: "該寶可夢不受火屬性招式影響。首次被火屬性招式擊中後，只要仍在場並保持此特性，其使用火屬性攻擊時進攻能力變為1.5倍。若該寶可夢處於冰凍狀態，無法被火屬性攻擊解凍。", // NEEDS QC
		shortDesc: "免疫火屬性招式；被火招式擊中後，自身火屬性招式威力1.5倍。", // NEEDS QC
		gen4: {
			desc: "該寶可夢未處於冰凍狀態時不受火屬性招式影響。首次被火屬性招式擊中後，只要仍在場並保持此特性，其火屬性攻擊的傷害變為1.5倍。", // NEEDS QC
		},
		gen3: {
			desc: "該寶可夢未處於冰凍狀態時不受火屬性招式影響。首次被火屬性招式擊中後，只要仍在場並保持此特性，其火屬性攻擊的傷害變為1.5倍。該寶可夢處於異常狀態時、是火屬性時、處於替身狀態時，鬼火不會觸發此特性。", // NEEDS QC
		},

		start: "  {POKEMON}的火焰威力提高了！",
	},
	flowergift: {
		name: "花之禮",
		// Official flavor text: "天氣為晴朗時， 自己和同伴的攻擊和 特防能力會提高。"
		desc: "若該寶可夢是櫻花兒且天氣為大晴天，其變為陽光下的樣子，自身及隊友的攻擊和特防變為1.5倍。攜帶萬能傘時這些效果不會發動。", // NEEDS QC
		shortDesc: "（櫻花兒專用）大晴天時己方攻擊和特防變為1.5倍。", // NEEDS QC
		gen7: {
			desc: "該寶可夢是櫻花兒且天氣為大晴天時，變為陽光下的樣子，自身和隊友的攻擊和特防變為1.5倍。", // NEEDS QC
		},
		gen4: {
			desc: "天氣為大晴天時，該寶可夢和隊友的攻擊和特防變為1.5倍。", // NEEDS QC
			shortDesc: "大晴天時，自身和隊友的攻擊和特防變為1.5倍。", // NEEDS QC
		},
	},
	flowerveil: {
		name: "花幕",
		// Official flavor text: "我方的草屬性寶可夢 能力不會降低。 也不會陷入異常狀態。"
		desc: "該寶可夢一方的草屬性寶可夢不會被其他寶可夢降低能力等級，也不會被其他寶可夢施加異常狀態。", // NEEDS QC
		shortDesc: "己方草屬性寶可夢不會被降能力或陷入異常狀態。", // NEEDS QC

		block: "  {POKEMON}正受到花幕的保護！",
	},
	fluffy: {
		name: "毛茸茸",
		// Official flavor text: "會將對手所給予的接觸類招式的傷害減半， 但火屬性招式的傷害會變為２倍。"
		desc: "該寶可夢受到的接觸類招式傷害減半，但受到的火屬性招式傷害變為2倍。", // NEEDS QC
		shortDesc: "受到的接觸類傷害減半，火屬性傷害2倍。", // NEEDS QC
	},
	forecast: {
		name: "陰晴不定",
		// Official flavor text: "在天氣的影響下， 會變成水屬性、火屬性 或冰屬性之中的一種。"
		desc: "若該寶可夢是飄浮泡泡，其屬性隨當前天氣變化（沙暴除外）。攜帶萬能傘且天氣為下雨或大晴天時，此效果不會發動。", // NEEDS QC
		shortDesc: "飄浮泡泡的屬性隨天氣變化（沙暴除外）。", // NEEDS QC
		gen7: {
			desc: "該寶可夢是飄浮泡泡時，屬性隨沙暴以外的天氣變化。", // NEEDS QC
		},
	},
	forewarn: {
		name: "預知夢",
		// Official flavor text: "出場時，預見１個 對手持有的招式。"
		desc: "出場時，隨機得知一個對手威力最高的招式。此判定中，一擊必殺招式視為威力150，雙倍奉還、鏡面反射、金屬爆炸視為威力120，其他威力不定的攻擊招式視為威力80，變化招式視為威力1。", // NEEDS QC
		shortDesc: "出場時得知對手威力最高的招式。", // NEEDS QC
		gen4: {
			desc: "出場時，隨機得知對手寶可夢所擁有招式中威力最高的一個。一擊必殺招式按威力150判定，雙倍奉還、鏡面反射、金屬爆炸按威力120判定，其他威力不定的攻擊招式按威力80判定。", // NEEDS QC
		},

		activate: "  讀取了{TARGET}的{MOVE}！",
		activateNoTarget: "  {POKEMON}的預知夢讀取了{MOVE}！", // NEEDS QC
	},
	friendguard: {
		name: "友情防守",
		shortDesc: "隊友受到的傷害變為3/4。", // NEEDS QC
	},
	frisk: {
		name: "察覺",
		shortDesc: "出場時得知所有對手的攜帶道具。", // NEEDS QC
		gen5: {
			shortDesc: "出場時，得知隨機1隻對手攜帶的道具。", // NEEDS QC
		},

		activate: "  {POKEMON}察覺到了{TARGET}的{ITEM}！",
		activateNoTarget: "  {POKEMON}察覺到了對手的{ITEM}！", // NEEDS QC
	},
	fullmetalbody: {
		name: "金屬防護",
		shortDesc: "能力等級不會被其他寶可夢降低。", // NEEDS QC
	},
	furcoat: {
		name: "毛皮大衣",
		shortDesc: "防禦變為2倍。", // NEEDS QC
	},
	galewings: {
		name: "疾風之翼",
		shortDesc: "HP全滿時，飛行屬性招式優先度+1。", // NEEDS QC
		gen6: {
			shortDesc: "該寶可夢的飛行屬性招式優先度+1。", // NEEDS QC
		},
	},
	galvanize: {
		name: "電氣皮膚",
		// Official flavor text: "一般屬性的招式 會變為電屬性。 威力會少量提高。"
		desc: "該寶可夢的一般屬性招式變為電屬性，威力變為1.2倍。此效果在其他改變招式屬性的效果之後、等離子浴和輸電的效果之前適用。", // NEEDS QC
		shortDesc: "一般屬性招式變為電屬性，威力1.2倍。", // NEEDS QC
	},
	gluttony: {
		name: "貪吃鬼",
		// Official flavor text: "原本ＨＰ變得很少時才會吃的樹果， 在ＨＰ還有一半時就會把它吃掉。"
		desc: "該寶可夢攜帶的通常在最大HP的1/4或以下時發動的樹果，會提前在最大HP的1/2或以下時吃掉。", // NEEDS QC
		shortDesc: "在HP為1/2以下時提前吃掉1/4觸發的樹果。", // NEEDS QC
	},
	goodasgold: {
		name: "黃金之軀",
		shortDesc: "不受變化招式影響。", // NEEDS QC
	},
	gooey: {
		name: "黏滑",
		shortDesc: "接觸自己的對手速度降低1級。", // NEEDS QC
	},
	gorillatactics: {
		name: "一猩一意",
		// Official flavor text: "攻擊雖然會提高， 但只能使出 最初選擇的招式。"
		desc: "該寶可夢的攻擊變為1.5倍，但只能使用最先使出的招式。極巨化期間這些效果不會發動。", // NEEDS QC
		shortDesc: "攻擊變為1.5倍，但只能使出最先選擇的招式。", // NEEDS QC
	},
	grasspelt: {
		name: "草之毛皮",
		shortDesc: "青草場地時，防禦變為1.5倍。", // NEEDS QC
	},
	grassysurge: {
		name: "青草製造者",
		shortDesc: "出場時布下青草場地。", // NEEDS QC
	},
	grimneigh: {
		name: "漆黑嘶鳴",
		// Official flavor text: "打倒對手時 會用恐怖的聲音嘶鳴 並提高特攻。"
		desc: "該寶可夢使其他寶可夢瀕死時，特攻提高1級。", // NEEDS QC
		shortDesc: "打倒對手後，特攻提高1級。", // NEEDS QC
	},
	guarddog: {
		name: "看門犬",
		desc: "該寶可夢不受特性威嚇的影響，反而會因此提高1級攻擊。該寶可夢不會因其他寶可夢的攻擊或道具而被強制交換。", // NEEDS QC
		shortDesc: "受威嚇影響時攻擊+1。不會被強制交換。", // NEEDS QC
	},
	gulpmissile: {
		name: "一口飛彈",
		// Official flavor text: "衝浪或潛水時會叼來獵物。 當受到傷害時， 會吐出獵物攻擊對手。"
		desc: "若該寶可夢是古月鳥，用衝浪擊中目標或成功使用潛水的第1回合後會改變樣子。剩餘HP高於最大HP的1/2時，變為口中含著刺梭魚的古月鳥（一口吞的樣子）；剩餘HP為1/2或以下時，變為口中含著皮卡丘的古月鳥（大口吞的樣子）。這些樣子的古月鳥受到攻擊時，即使HP歸零，也會把刺梭魚或皮卡丘吐向攻擊方。吐出物造成目標最大HP1/4（向下取整）的傷害；此傷害可被特性魔法防守防止，但不會被替身擋下。刺梭魚還會使目標的防禦降低1級，皮卡丘會使目標陷入麻痺狀態。吐出後、交換下場或極巨化時，古月鳥恢復原樣。", // NEEDS QC
		shortDesc: "衝浪、潛水後受擊時，吐出獵物反擊。", // NEEDS QC
	},
	guts: {
		name: "毅力",
		// Official flavor text: "陷入異常狀態時， 會拿出毅力， 攻擊會提高。"
		desc: "該寶可夢處於異常狀態時，攻擊變為1.5倍。其物理攻擊無視灼傷減半傷害的效果。", // NEEDS QC
		shortDesc: "有異常狀態時攻擊變為1.5倍，且無視灼傷減半。", // NEEDS QC
	},
	hadronengine: {
		name: "強子引擎",
		shortDesc: "出場時布下電氣場地，期間特攻變為1.3333倍。", // NEEDS QC

		start: "  {POKEMON}布下電氣場地，使未來的機關躍動起來！！",
		activate: "  {POKEMON}透過電氣場地使未來的機關躍動起來！！",
	},
	harvest: {
		name: "收穫",
		// Official flavor text: "可多次採收 已被使用過的樹果。"
		desc: "若該寶可夢最後使用的道具是樹果，每回合結束時有50%的機率將其恢復。大晴天時，機率為100%。", // NEEDS QC
		shortDesc: "有50%的機率（大晴天必定）恢復用過的樹果。", // NEEDS QC

		addItem: "  {POKEMON}收穫了{ITEM}！",
	},
	healer: {
		name: "治癒之心",
		// Official flavor text: "有時會治癒同伴的異常狀態。"
		desc: "每回合結束時，有30%的機率治癒隊友的異常狀態。", // NEEDS QC
		shortDesc: "每回合有30%的機率治癒隊友的異常狀態。", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "每回合結束時，相鄰的每個隊友各有30%的機率治癒異常狀態。", // NEEDS QC
			shortDesc: "每回合結束時，相鄰的每個隊友各有30%的機率治癒異常狀態。", // NEEDS QC
		},
	},
	heatproof: {
		name: "耐熱",
		// Official flavor text: "靠著耐熱的體質， 讓火屬性的招式威力減半。"
		desc: "其他寶可夢對該寶可夢使用火屬性攻擊時，計算傷害時進攻能力減半。該寶可夢受到的灼傷傷害減半（向下取整）。", // NEEDS QC
		shortDesc: "受到的火屬性傷害和灼傷傷害減半。", // NEEDS QC
		gen8: {
			desc: "該寶可夢受到的火屬性攻擊威力減半。灼傷造成的傷害也減半（向下取整）。", // NEEDS QC
			shortDesc: "受到的火屬性攻擊威力減半，灼傷傷害也減半。", // NEEDS QC
		},
	},
	heavymetal: {
		name: "重金屬",
		// Official flavor text: "自己的重量會變為２倍。"
		desc: "該寶可夢的重量變為2倍。此效果在身體輕量化的效果之後、輕石的效果之前計算。", // NEEDS QC
		shortDesc: "體重變為2倍。", // NEEDS QC
	},
	honeygather: {
		name: "採蜜",
		shortDesc: "沒有對戰效果。", // NEEDS QC
	},
	hospitality: {
		name: "款待",
		shortDesc: "出場時回復隊友最大HP的1/4。", // NEEDS QC

		heal: "  {POKEMON}喝光了{SOURCE}泡的茶！",
	},
	hugepower: {
		name: "大力士",
		shortDesc: "攻擊變為2倍。", // NEEDS QC
	},
	hungerswitch: {
		name: "飽了又餓",
		// Official flavor text: "在每個回合結束時， 會在滿腹花紋和空腹花紋之間 交替改變樣子。"
		desc: "若該寶可夢是莫魯貝可，每回合結束時在滿腹花紋和空腹花紋之間切換。", // NEEDS QC
		shortDesc: "莫魯貝可每回合結束時切換花紋。", // NEEDS QC
	},
	hustle: {
		name: "活力",
		// Official flavor text: "自己的攻擊雖會變高， 但命中率會降低。"
		desc: "該寶可夢的攻擊變為1.5倍，物理攻擊的命中率變為0.8倍。", // NEEDS QC
		shortDesc: "攻擊變為1.5倍，但物理招式命中率變為0.8倍。", // NEEDS QC
	},
	hydration: {
		name: "濕潤之軀",
		// Official flavor text: "天氣為下雨時， 會治癒異常狀態。"
		desc: "下雨時，該寶可夢的異常狀態在每回合結束時治癒。攜帶萬能傘時此效果不會發動。", // NEEDS QC
		shortDesc: "下雨時，每回合結束時治癒異常狀態。", // NEEDS QC
		gen7: {
			desc: "天氣為下雨時，每回合結束時治癒異常狀態。", // NEEDS QC
		},
	},
	hypercutter: {
		name: "怪力鉗",
		shortDesc: "攻擊不會被降低。", // NEEDS QC
	},
	icebody: {
		name: "冰凍之軀",
		// Official flavor text: "天氣為冰雹時， 會漸漸回復ＨＰ。"
		desc: "下雪時，該寶可夢在每回合結束時回復最大HP的1/16（向下取整）。", // NEEDS QC
		shortDesc: "下雪時，每回合回復最大HP的1/16。", // NEEDS QC
		gen8: {
			desc: "天氣為冰雹時，每回合結束時回復最大HP的1/16（向下取整）。不受冰雹的傷害。", // NEEDS QC
			shortDesc: "冰雹時每回合回復最大HP的1/16。不受冰雹傷害。", // NEEDS QC
		},
	},
	iceface: {
		name: "結凍頭",
		// Official flavor text: "頭部的冰會代替自己承受 物理攻擊，但是樣子會改變。 下冰雹時，冰會回復原狀。"
		desc: "若該寶可夢是冰砌鵝，戰鬥中首次受到的物理攻擊傷害為0（按一般屬性相性判定）。隨後冰頭被打碎，變為冰砌鵝（解凍頭）。下雪時或在下雪時交換上場時，恢復為結凍頭的樣子。混亂的自傷也會打碎冰頭。", // NEEDS QC
		shortDesc: "（冰砌鵝專用）擋下首次物理攻擊，下雪時恢復。", // NEEDS QC
		gen8: {
			desc: "若該寶可夢是冰砌鵝，戰鬥中首次受到的物理攻擊傷害為0（按一般屬性相性判定）。隨後冰頭被打碎，變為解凍頭的樣子。冰雹開始時或冰雹期間出場時，恢復結凍頭的樣子。混亂的自傷也會打碎冰頭。", // NEEDS QC
			shortDesc: "是冰砌鵝時，首次受到的物理攻擊傷害為0。冰雹時恢復。", // NEEDS QC
		},
	},
	icescales: {
		name: "冰鱗粉",
		shortDesc: "受到的特殊招式傷害減半。", // NEEDS QC
	},
	illuminate: {
		name: "發光",
		// Official flavor text: "透過讓周圍變亮， 變得容易遇見野生的寶可夢。"
		desc: "該寶可夢的命中率不會被其他寶可夢降低。該寶可夢無視目標的回避率變化。", // NEEDS QC
		shortDesc: "命中率不會被降低，且無視對手的回避率。", // NEEDS QC
		gen8: {
			desc: "沒有對戰效果。", // NEEDS QC
			shortDesc: "沒有對戰效果。", // NEEDS QC
		},
	},
	illusion: {
		name: "幻覺",
		// Official flavor text: "假扮成同行隊伍中的 最後一隻寶可夢出場， 迷惑對手。"
		desc: "交換上場時，該寶可夢會以隊伍中最後一隻未瀕死的寶可夢的樣子出場，直到受到其他寶可夢攻擊的直接傷害為止。顯示的等級和HP為該寶可夢自身的數值。", // NEEDS QC
		shortDesc: "受到直接傷害前，偽裝成隊伍最後一隻寶可夢。", // NEEDS QC

		end: "  {POKEMON}造成的幻覺解除了！",
	},
	immunity: {
		name: "免疫",
		shortDesc: "不會陷入中毒狀態。中毒時獲得此特性會治癒。", // NEEDS QC
	},
	imposter: {
		name: "變身者",
		// Official flavor text: "變身為當前面對的寶可夢。"
		desc: "出場時，變身為正對面的對手寶可夢。若該位置沒有寶可夢，則不會變身。", // NEEDS QC
		shortDesc: "出場時變身為正對面的對手。", // NEEDS QC
	},
	infiltrator: {
		name: "穿透",
		// Official flavor text: "可穿透對手的屏障 或替身進行攻擊。"
		desc: "該寶可夢的招式無視替身以及對手方的反射壁、光牆、神祕守護、白霧、極光幕。", // NEEDS QC
		shortDesc: "攻擊時無視替身和反射壁、光牆等。", // NEEDS QC
		gen6: {
			desc: "該寶可夢的招式無視替身以及對手方的反射壁、光牆、神祕守護、白霧。", // NEEDS QC
			shortDesc: "招式無視替身及對手的反射壁、光牆、神祕守護、白霧。", // NEEDS QC
		},
		gen5: {
			desc: "該寶可夢的招式無視對手方的反射壁、光牆、神祕守護、白霧。", // NEEDS QC
			shortDesc: "招式無視對手的反射壁、光牆、神祕守護、白霧。", // NEEDS QC
		},
	},
	innardsout: {
		name: "飛出的內在物",
		// Official flavor text: "被對手打倒的時候， 會給予對手相當於 ＨＰ剩餘量的傷害。"
		desc: "該寶可夢因招式瀕死時，攻擊方失去與該寶可夢所受傷害相同的HP。", // NEEDS QC
		shortDesc: "因招式瀕死時，攻擊方受到相同傷害。", // NEEDS QC

		damage: "#aftermath",
	},
	innerfocus: {
		name: "精神力",
		// Official flavor text: "靠著經過鍛鍊的精神， 不會因對手的攻擊而畏縮。"
		desc: "該寶可夢不會畏縮。不受特性威嚇的影響。", // NEEDS QC
		shortDesc: "不會畏縮。不受威嚇影響。", // NEEDS QC
		gen7: {
			desc: "該寶可夢不會畏縮。", // NEEDS QC
			shortDesc: "該寶可夢不會畏縮。", // NEEDS QC
		},
	},
	insomnia: {
		name: "不眠",
		shortDesc: "不會陷入睡眠狀態。睡眠時獲得此特性會治癒。", // NEEDS QC
	},
	intimidate: {
		name: "威嚇",
		// Official flavor text: "出場時威嚇對手， 使其退縮， 從而降低對手的攻擊。"
		desc: "出場時，使對手的攻擊降低1級。特性為精神力、遲鈍、我行我素、膽量的寶可夢和處於替身狀態的寶可夢不受影響。", // NEEDS QC
		shortDesc: "出場時使對手的攻擊降低1級。", // NEEDS QC
		gen7: {
			desc: "出場時，使對手的攻擊降低1級。處於替身狀態的寶可夢不受影響。", // NEEDS QC
		},
		gen6: {
			desc: "出場時，使相鄰對手的攻擊降低1級。處於替身狀態的寶可夢不受影響。", // NEEDS QC
			shortDesc: "出場時，使相鄰對手的攻擊降低1級。", // NEEDS QC
		},
		gen4: {
			desc: "出場時，使對手的攻擊降低1級。處於替身狀態的寶可夢不受影響。急速折返打破對手的替身且該寶可夢作為接替出場時，原本處於替身狀態的寶可夢仍不受此特性影響。", // NEEDS QC
			shortDesc: "出場時使對手的攻擊降低1級。", // NEEDS QC
		},
		gen3: {
			desc: "出場時，使對手的攻擊降低1級。處於替身狀態的寶可夢不受影響。", // NEEDS QC
		},
	},
	intrepidsword: {
		name: "不撓之劍",
		shortDesc: "出場時攻擊提高1級。每場戰鬥1次。", // NEEDS QC
		gen8: {
			shortDesc: "出場時攻擊提高1級。", // NEEDS QC
		},
	},
	ironbarbs: {
		name: "鐵刺",
		// Official flavor text: "用鐵刺給予接觸到自己的 對手傷害。"
		desc: "與該寶可夢直接接觸的寶可夢失去最大HP的1/8（向下取整）。", // NEEDS QC
		shortDesc: "接觸自己的對手失去最大HP的1/8。", // NEEDS QC

		damage: "#roughskin",
	},
	ironfist: {
		name: "鐵拳",
		// Official flavor text: "使用到拳頭的招式 威力會提高。"
		desc: "該寶可夢的拳類招式威力變為1.2倍。", // NEEDS QC
		shortDesc: "拳類招式威力變為1.2倍（突襲除外）。", // NEEDS QC
	},
	justified: {
		name: "正義之心",
		shortDesc: "受到惡屬性招式攻擊後，攻擊提高1級。", // NEEDS QC
	},
	keeneye: {
		name: "銳利目光",
		// Official flavor text: "靠著銳利的目光， 命中率不會被降低。"
		desc: "該寶可夢的命中率不會被其他寶可夢降低。該寶可夢無視目標的回避率變化。", // NEEDS QC
		shortDesc: "命中率不會被降低，且無視對手的回避率。", // NEEDS QC
		gen5: {
			desc: "該寶可夢的命中率不會被其他寶可夢降低。", // NEEDS QC
			shortDesc: "命中率不會被其他寶可夢降低。", // NEEDS QC
		},
	},
	klutz: {
		name: "笨拙",
		// Official flavor text: "無法使用持有的道具。"
		desc: "該寶可夢攜帶的道具無效。該寶可夢無法成功使用投擲。強制鍛鍊器、力量護踝、力量束帶、力量腰帶、力量護腕、力量鏡、力量負重的效果仍然有效。", // NEEDS QC
		shortDesc: "攜帶的道具無效（強制鍛鍊器等除外）。", // NEEDS QC
	},
	leafguard: {
		name: "葉子防守",
		// Official flavor text: "天氣為晴朗時， 不會陷入異常狀態。"
		desc: "大晴天時，該寶可夢不會陷入異常狀態，不受哈欠的影響，睡覺也會失敗。攜帶萬能傘時此效果不會發動。", // NEEDS QC
		shortDesc: "大晴天時不會陷入異常狀態，睡覺也會失敗。", // NEEDS QC
		gen7: {
			desc: "天氣為大晴天時，該寶可夢不會陷入異常狀態或受哈欠影響，且睡覺會失敗。", // NEEDS QC
		},
		gen4: {
			desc: "天氣為大晴天時，該寶可夢不會陷入異常狀態或受哈欠影響，但可以正常使用睡覺。", // NEEDS QC
			shortDesc: "大晴天時不會陷入異常狀態，但可以正常使用睡覺。", // NEEDS QC
		},
	},
	levitate: {
		name: "飄浮",
		// Official flavor text: "從地面浮起， 從而不會受到地面屬性招式的攻擊。"
		desc: "該寶可夢不受地面屬性攻擊及撒菱、毒菱、黏黏網和特性沙穴的影響。受到重力、扎根、擊落、千箭齊發、黑色鐵球的效果時，此免疫失效。千箭齊發可無視此特性擊中該寶可夢。", // NEEDS QC
		shortDesc: "不受地面屬性招式影響。會被重力等無效化。", // NEEDS QC
		gen5: {
			desc: "該寶可夢不受地面屬性的攻擊及撒菱、毒菱、特性沙穴的影響。處於重力、扎根、擊落、黑色鐵球的效果下時，此免疫無效。", // NEEDS QC
		},
		gen4: {
			desc: "該寶可夢不受地面屬性的攻擊及撒菱、毒菱、特性沙穴的影響。處於重力、扎根、黑色鐵球的效果下時，此免疫無效。", // NEEDS QC
			shortDesc: "不受地面屬性影響。重力/扎根/黑色鐵球使其無效。", // NEEDS QC
		},
		gen3: {
			desc: "該寶可夢不受地面屬性的攻擊及撒菱、特性沙穴的影響。", // NEEDS QC
			shortDesc: "該寶可夢不受地面屬性影響。", // NEEDS QC
		},
	},
	libero: {
		name: "自由者",
		// Official flavor text: "變為與自己使出的招式 相同的屬性。"
		desc: "該寶可夢的屬性變為其即將使用的招式的屬性。此效果在所有改變招式屬性的效果之後適用。每次出場只能發動1次，且太晶化後不會發動。", // NEEDS QC
		shortDesc: "屬性變為自己使出的招式屬性。每次出場1次。", // NEEDS QC
		gen8: {
			desc: "該寶可夢的屬性變為即將使用的招式的屬性。此效果在所有改變招式屬性的效果之後適用。", // NEEDS QC
			shortDesc: "該寶可夢的屬性變為即將使用的招式的屬性。", // NEEDS QC
		},
	},
	lightmetal: {
		name: "輕金屬",
		// Official flavor text: "自己的重量會減半。"
		desc: "該寶可夢的重量減半（以0.1千克為單位向下取整）。此效果在身體輕量化的效果之後、輕石的效果之前計算。重量不會低於0.1千克。", // NEEDS QC
		shortDesc: "體重減半。", // NEEDS QC
	},
	lightningrod: {
		name: "避雷針",
		// Official flavor text: "將電屬性的招式吸引到自己身上， 不但不會受到傷害，反而會提高特攻。"
		desc: "該寶可夢不受電屬性招式影響，且被電屬性招式擊中時特攻提高1級。其他寶可夢使用的單體電屬性招式若不以該寶可夢為目標，且該寶可夢在其範圍內，會被引到該寶可夢身上。若多隻寶可夢可以用此特性引開招式，由速度最高的一隻引開；速度相同時，由此特性生效更久的一隻引開。", // NEEDS QC
		shortDesc: "吸引並免疫電屬性招式，特攻提高1級。", // NEEDS QC
		gen4: {
			desc: "其他寶可夢對該寶可夢以外的單體目標使用電屬性招式時，該招式被引到自己身上。", // NEEDS QC
			shortDesc: "將單體目標的電屬性招式引到自己身上。", // NEEDS QC
		},
		gen3: {
			desc: "對手對該寶可夢以外的單體目標使用電屬性招式時，該招式被引到自己身上。覺醒力量視為一般屬性。", // NEEDS QC
			shortDesc: "將對手使用的單體目標電屬性招式引到自己身上。", // NEEDS QC
		},

		activate: "  {POKEMON}吸引了攻擊！",
	},
	limber: {
		name: "柔軟",
		shortDesc: "不會陷入麻痺狀態。麻痺時獲得此特性會治癒。", // NEEDS QC
	},
	lingeringaroma: {
		name: "甩不掉的氣味",
		desc: "與該寶可夢直接接觸的寶可夢，特性會變為甩不掉的氣味。特性為人馬一體、牽絆變身、絕對睡眠、畫皮、一口飛彈、結凍頭、甩不掉的氣味、多屬性、群聚變形、ＡＲ系統、魚群、界限盾殼、戰鬥切換、太晶變形、達摩模式、全能變身的寶可夢不受影響。", // NEEDS QC
		shortDesc: "接觸自己的對手特性變為此特性。", // NEEDS QC
		gen8: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢，特性變為甩不掉的氣味。對特性為人馬一體、牽絆變身、絕對睡眠、畫皮、一口飛彈、結凍頭、甩不掉的氣味、多屬性、群聚變形、ＡＲ系統、魚群、界限盾殼、戰鬥切換、達摩模式的寶可夢無效。", // NEEDS QC
		},

		changeAbility: "  {TARGET}被染上了甩不掉的氣味！",
	},
	liquidooze: {
		name: "污泥漿",
		shortDesc: "吸取自己HP的對手受到等量傷害。", // NEEDS QC
		gen4: {
			desc: "從該寶可夢吸取HP的寶可夢，受到相當於其本應回復量的傷害。食夢不受此效果影響。", // NEEDS QC
		},

		damage: "  {POKEMON}吸到了污泥漿！",
	},
	liquidvoice: {
		name: "濕潤之聲",
		// Official flavor text: "所有的聲音招式 都變為水屬性。"
		desc: "該寶可夢的聲音類招式變為水屬性。此效果在其他改變招式屬性的效果之後、等離子浴和輸電的效果之前適用。", // NEEDS QC
		shortDesc: "聲音類招式變為水屬性。", // NEEDS QC
	},
	longreach: {
		name: "遠隔",
		shortDesc: "招式不會接觸到對手。", // NEEDS QC
	},
	magicbounce: {
		name: "魔法鏡",
		// Official flavor text: "可不受到由對手使出的 變化類招式所影響，並將其反彈。"
		desc: "該寶可夢不受以其為目標的一部分變化招式影響，並會將這些招式反彈給原使用者。以此方式反彈的招式無法被此特性或魔法反射的效果再次反彈。撒菱、隱形岩、黏黏網、毒菱每一方只能被反彈1次，由處於此特性或魔法反射效果下的最左側寶可夢反彈。特性避雷針、引水的引開效果先於此特性發動。", // NEEDS QC
		shortDesc: "將一部分變化招式反彈給對方。", // NEEDS QC
		gen5: {
			desc: "該寶可夢不受以自己為目標的部分變化招式影響，並將其反彈給原使用者。被反彈的招式無法被此特性或魔法反射的效果再次反彈。撒菱、隱形岩、毒菱每方只能被反彈1次，由受此特性或魔法反射效果影響的最左側寶可夢反彈。特性避雷針和引水在此特性生效前引來各自的招式。", // NEEDS QC
		},

		move: "#magiccoat",
	},
	magicguard: {
		name: "魔法防守",
		// Official flavor text: "不會受到攻擊以外的傷害。"
		desc: "該寶可夢只會受到直接攻擊的傷害。使用詛咒、替身時的消耗、腹鼓、分擔痛楚、掙扎的反作用力傷害和混亂的自傷視為直接傷害。", // NEEDS QC
		shortDesc: "只會受到直接攻擊的傷害。", // NEEDS QC
		gen4: {
			desc: "該寶可夢只會受到直接攻擊的傷害。使用詛咒和替身、腹鼓、分擔痛楚、掙扎的反作用力以及混亂造成的傷害視為直接傷害。該寶可夢不會因麻痺而無法行動，出場時不受毒菱影響。", // NEEDS QC
			shortDesc: "只受到直接攻擊的傷害，且不會因麻痺而無法行動。", // NEEDS QC
		},
	},
	magician: {
		name: "魔術師",
		// Official flavor text: "奪走被自己招式 擊中的對手的道具。"
		desc: "若該寶可夢沒有攜帶道具，其攻擊擊中寶可夢時會奪取對方的道具。對破滅之願和預知未來無效。攻擊擊中多個目標時，從最快的寶可夢處奪取（考慮戲法空間的效果，且對手優先於隊友）。", // NEEDS QC
		shortDesc: "未攜帶道具時，奪取被自己招式擊中的對手的道具。", // NEEDS QC
	},
	magmaarmor: {
		name: "熔岩鎧甲",
		shortDesc: "不會陷入冰凍狀態。冰凍時獲得此特性會治癒。", // NEEDS QC
	},
	magnetpull: {
		name: "磁力",
		// Official flavor text: "用磁力吸住鋼屬性的寶可夢， 使其無法逃走。"
		desc: "使鋼屬性的對手無法選擇交換。攜帶美麗空殼的寶可夢和幽靈屬性寶可夢除外。", // NEEDS QC
		shortDesc: "使鋼屬性對手無法交換。", // NEEDS QC
		gen6: {
			desc: "使相鄰的鋼屬性對手無法選擇交換。攜帶美麗空殼的寶可夢和幽靈屬性寶可夢除外。", // NEEDS QC
			shortDesc: "使相鄰的鋼屬性對手無法選擇交換。", // NEEDS QC
		},
		gen5: {
			desc: "使相鄰的鋼屬性對手無法選擇交換。攜帶美麗空殼的寶可夢除外。", // NEEDS QC
			shortDesc: "使相鄰的鋼屬性對手無法選擇交換。", // NEEDS QC
		},
		gen4: {
			desc: "使鋼屬性對手無法選擇交換。攜帶美麗空殼的寶可夢除外。", // NEEDS QC
			shortDesc: "使鋼屬性對手無法交換。", // NEEDS QC
		},
		gen3: {
			desc: "使該寶可夢以外的鋼屬性寶可夢無法選擇交換。", // NEEDS QC
			shortDesc: "使該寶可夢以外的鋼屬性寶可夢無法交換。", // NEEDS QC
		},
	},
	marvelscale: {
		name: "神奇鱗片",
		shortDesc: "有異常狀態時，防禦變為1.5倍。", // NEEDS QC
	},
	megalauncher: {
		name: "超級發射器",
		// Official flavor text: "波動和波導類招式的 威力會提高。"
		desc: "該寶可夢的波動類招式威力變為1.5倍。治癒波動回復目標最大HP的3/4（五捨六入）。", // NEEDS QC
		shortDesc: "波動類招式威力變為1.5倍，治癒波動回復量變為3/4。", // NEEDS QC
	},
	megasol: {
		name: "超級日光",
		shortDesc: "使出招式時視為處於大晴天效果下。", // NEEDS QC
	},
	merciless: {
		name: "不仁不義",
		shortDesc: "攻擊中毒狀態的對手時必定擊中要害。", // NEEDS QC
	},
	mimicry: {
		name: "擬態",
		// Official flavor text: "寶可夢的屬性會隨著 場地的狀態而改變。"
		desc: "該寶可夢獲得此特性時或場地開始時，其屬性隨當前場地變化。電氣場地時為電屬性，青草場地時為草屬性，薄霧場地時為妖精屬性，精神場地時為超能力屬性。獲得此特性時沒有場地，或場地結束時，恢復為其種族原本的屬性。", // NEEDS QC
		shortDesc: "屬性隨場地變化，場地結束後恢復。", // NEEDS QC

		activate: "  {POKEMON}變回原來的屬性了！",
	},
	mindseye: {
		name: "心眼",
		desc: "該寶可夢的一般屬性和格鬥屬性招式可以擊中幽靈屬性寶可夢。該寶可夢的命中率不會被其他寶可夢降低。該寶可夢無視目標的回避率變化。", // NEEDS QC
		shortDesc: "一般和格鬥招式可命中幽靈屬性，且無視回避率。", // NEEDS QC
	},
	minus: {
		name: "負電",
		// Official flavor text: "場上的夥伴之中， 如果有正電或負電特性的寶可夢， 自己的特攻會提高。"
		desc: "若在場隊友的特性為此特性或正電，該寶可夢的特攻變為1.5倍。", // NEEDS QC
		shortDesc: "場上隊友有正電或此特性時，特攻變為1.5倍。", // NEEDS QC
		gen4: {
			desc: "在場的隊友特性為正電時，該寶可夢的特攻變為1.5倍。", // NEEDS QC
			shortDesc: "隊友的特性為正電時，特攻變為1.5倍。", // NEEDS QC
		},
		gen3: {
			desc: "場上有特性為正電的寶可夢時，該寶可夢的特攻變為1.5倍。", // NEEDS QC
			shortDesc: "場上有特性為正電的寶可夢時，特攻變為1.5倍。", // NEEDS QC
		},
	},
	mirrorarmor: {
		name: "鏡甲",
		// Official flavor text: "只反彈自己受到的 能力降低效果。"
		desc: "該寶可夢的能力等級將被其他寶可夢降低時，改為降低對方的能力等級。若該寶可夢的該項能力已為-6級，此效果不會發動。若對方處於替身狀態，雙方的能力等級都不會降低。", // NEEDS QC
		shortDesc: "將受到的能力降低反彈給對方。", // NEEDS QC
	},
	mistysurge: {
		name: "薄霧製造者",
		shortDesc: "出場時布下薄霧場地。", // NEEDS QC
	},
	moldbreaker: {
		name: "破格",
		// Official flavor text: "可不受特性影響， 向對手使出招式。"
		desc: "該寶可夢的招式及其效果無視其他寶可夢的一部分特性。可無視的特性包括：尾甲、芳香幕、氣場破壞、戰鬥盔甲、健壯胸肌、防彈、恆淨之軀、唱反調、濕氣、鮮艷之軀、畫皮、乾燥皮膚、食土、過濾、引火、花之禮、花幕、毛茸茸、友情防守、毛皮大衣、黃金之軀、草之毛皮、看門犬、耐熱、重金屬、怪力鉗、結凍頭、冰鱗粉、發光、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、心眼、鏡甲、電氣引擎、多重鱗片、遲鈍、防塵、我行我素、粉彩護幕、龐克搖滾、潔淨之鹽、女王的威嚴、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、甜幕、蹣跚、心靈感應、太晶甲殼、熱交換、厚脂肪、純樸、幹勁、蓄電、儲水、水泡、水幕、焦香之軀、白色煙霧、乘風、神奇守護、奇跡皮膚。此效果影響場上所有其他寶可夢，無論其是否為該寶可夢招式的目標，也無論其特性是否對該寶可夢有利。", // NEEDS QC
		shortDesc: "使出招式時無視對手的特性。", // NEEDS QC
		gen8: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為芳香幕、氣場破壞、戰鬥盔甲、健壯胸肌、防彈、恆淨之軀、唱反調、濕氣、鮮艷之軀、畫皮、乾燥皮膚、過濾、引火、花之禮、花幕、毛茸茸、友情防守、毛皮大衣、草之毛皮、耐熱、重金屬、怪力鉗、結凍頭、冰鱗粉、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、鏡甲、電氣引擎、多重鱗片、遲鈍、防塵、我行我素、粉彩護幕、龐克搖滾、女王的威嚴、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、甜幕、蹣跚、心靈感應、厚脂肪、純樸、幹勁、蓄電、儲水、水泡、水幕、白色煙霧、神奇守護、奇跡皮膚。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標，也無論該特性對該寶可夢是否有利。", // NEEDS QC
		},
		gen7: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為芳香幕、氣場破壞、戰鬥盔甲、健壯胸肌、防彈、恆淨之軀、唱反調、濕氣、暗黑氣場、鮮艷之軀、畫皮、乾燥皮膚、妖精氣場、過濾、引火、花之禮、花幕、毛茸茸、友情防守、毛皮大衣、草之毛皮、耐熱、重金屬、怪力鉗、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、電氣引擎、多重鱗片、遲鈍、防塵、我行我素、女王的威嚴、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、甜幕、蹣跚、心靈感應、厚脂肪、純樸、幹勁、蓄電、儲水、水泡、水幕、白色煙霧、神奇守護、奇跡皮膚。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標，也無論該特性對該寶可夢是否有利。", // NEEDS QC
		},
		gen6: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為芳香幕、氣場破壞、戰鬥盔甲、健壯胸肌、防彈、恆淨之軀、唱反調、濕氣、暗黑氣場、乾燥皮膚、妖精氣場、過濾、引火、花之禮、花幕、友情防守、毛皮大衣、草之毛皮、耐熱、重金屬、怪力鉗、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、電氣引擎、多重鱗片、遲鈍、防塵、我行我素、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、甜幕、蹣跚、心靈感應、厚脂肪、純樸、幹勁、蓄電、儲水、水幕、白色煙霧、神奇守護、奇跡皮膚。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標，也無論該特性對該寶可夢是否有利。", // NEEDS QC
		},
		gen5: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為戰鬥盔甲、健壯胸肌、恆淨之軀、唱反調、濕氣、乾燥皮膚、過濾、引火、花之禮、友情防守、耐熱、重金屬、怪力鉗、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、電氣引擎、多重鱗片、遲鈍、我行我素、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、蹣跚、心靈感應、厚脂肪、純樸、幹勁、蓄電、儲水、水幕、白色煙霧、神奇守護、奇跡皮膚。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標，也無論該特性對該寶可夢是否有利。", // NEEDS QC
		},
		gen4: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為戰鬥盔甲、恆淨之軀、濕氣、乾燥皮膚、過濾、引火、花之禮、耐熱、怪力鉗、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、避雷針、柔軟、熔岩鎧甲、神奇鱗片、電氣引擎、遲鈍、我行我素、沙隱、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、蹣跚、厚脂肪、純樸、幹勁、蓄電、儲水、水幕、白色煙霧、神奇守護。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標。不會無視隊友的特性花之禮帶來的攻擊修正。", // NEEDS QC
		},

		start: "  {POKEMON}打破了常規！",
	},
	moody: {
		name: "心情不定",
		// Official flavor text: "每一回合，能力中的某項 會大幅提高，相對地某項會降低。"
		desc: "每回合結束時，該寶可夢隨機一項能力（命中率和回避率除外）提高2級，另一項能力降低1級。", // NEEDS QC
		shortDesc: "每回合隨機1項能力+2，另1項能力-1。", // NEEDS QC
		gen7: {
			desc: "每回合結束時，隨機一項能力提高2級，另一項能力降低1級。", // NEEDS QC
			shortDesc: "每回合結束時，隨機一項能力提高2級，另一項降低1級。", // NEEDS QC
		},
	},
	motordrive: {
		name: "電氣引擎",
		// Official flavor text: "受到電屬性的招式攻擊時， 不但不會受到傷害，反而速度會提高。"
		desc: "該寶可夢不受電屬性招式影響，且被電屬性招式擊中時速度提高1級。", // NEEDS QC
		shortDesc: "免疫電屬性招式，且速度提高1級。", // NEEDS QC
	},
	moxie: {
		name: "自信過度",
		// Official flavor text: "如果打倒對手， 會充滿自信並提高攻擊。"
		desc: "該寶可夢使其他寶可夢瀕死時，攻擊提高1級。", // NEEDS QC
		shortDesc: "打倒對手後，攻擊提高1級。", // NEEDS QC
	},
	multiscale: {
		name: "多重鱗片",
		shortDesc: "HP全滿時，受到的傷害減半。", // NEEDS QC
	},
	multitype: {
		name: "多屬性",
		shortDesc: "阿爾宙斯的屬性隨攜帶的屬性板變化。", // NEEDS QC
		gen7: {
			shortDesc: "是阿爾宙斯時，屬性隨攜帶的屬性板或Z純晶變化。", // NEEDS QC
		},
		gen6: {
			shortDesc: "阿爾宙斯的屬性隨攜帶的屬性板變化。", // NEEDS QC
		},
		gen4: {
			desc: "若該寶可夢是阿爾宙斯，其屬性隨攜帶的屬性板變化。該寶可夢不會因其他寶可夢的攻擊而失去攜帶的道具。", // NEEDS QC
		},
	},
	mummy: {
		name: "木乃伊",
		// Official flavor text: "被對手接觸到時， 會將對手變成木乃伊。"
		desc: "與該寶可夢直接接觸的寶可夢，特性會變為木乃伊。特性為人馬一體、牽絆變身、絕對睡眠、畫皮、一口飛彈、結凍頭、多屬性、木乃伊、群聚變形、ＡＲ系統、魚群、界限盾殼、戰鬥切換、太晶變形、達摩模式、全能變身的寶可夢不受影響。", // NEEDS QC
		shortDesc: "接觸自己的對手特性變為此特性。", // NEEDS QC
		gen8: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢，特性變為木乃伊。對特性為人馬一體、牽絆變身、絕對睡眠、畫皮、一口飛彈、結凍頭、多屬性、木乃伊、群聚變形、ＡＲ系統、魚群、界限盾殼、戰鬥切換、達摩模式的寶可夢無效。", // NEEDS QC
		},
		gen7: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢，特性變為木乃伊。對特性為牽絆變身、絕對睡眠、畫皮、多屬性、木乃伊、群聚變形、ＡＲ系統、魚群、界限盾殼、戰鬥切換、達摩模式的寶可夢無效。", // NEEDS QC
		},
		gen6: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢，特性變為木乃伊。對特性為多屬性、木乃伊、戰鬥切換的寶可夢無效。", // NEEDS QC
		},
		gen5: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢，特性變為木乃伊。對特性為多屬性、木乃伊的寶可夢無效。", // NEEDS QC
		},

		changeAbility: "  {TARGET}的特性變成了木乃伊！",
	},
	myceliummight: {
		name: "菌絲之力",
		desc: "該寶可夢的變化招式無視其他寶可夢的一部分特性，並且在使用相同或更高優先度招式的寶可夢中最後行動。", // NEEDS QC
		shortDesc: "變化招式在相同優先度中最後使出，但無視特性。", // NEEDS QC
	},
	naturalcure: {
		name: "自然回復",
		shortDesc: "交換下場時治癒異常狀態。", // NEEDS QC

		activate: "  ({POKEMON}因自然回復治好了異常狀態！)", // NEEDS QC
	},
	neuroforce: {
		name: "腦核之力",
		// Official flavor text: "可進一步提升 效果絕佳招式的威力。"
		desc: "該寶可夢使用效果絕佳的攻擊時，傷害變為1.25倍。", // NEEDS QC
		shortDesc: "效果絕佳的攻擊傷害變為1.25倍。", // NEEDS QC
	},
	neutralizinggas: {
		name: "化學變化氣體",
		// Official flavor text: "當場上有特性是化學變化氣體的寶可夢時， 所有寶可夢的特性效果 都會消失或無法發動。"
		desc: "該寶可夢在場時，所有特性無效。此特性先於陷阱和其他特性發動。不影響人馬一體、牽絆變身、絕對睡眠、畫皮、一口飛彈、結凍頭、多屬性、群聚變形、ＡＲ系統、魚群、界限盾殼、戰鬥切換、太晶變形、達摩模式、全能變身、化學變化氣體的特性。", // NEEDS QC
		shortDesc: "在場時，所有特性無效。", // NEEDS QC
		gen8: {
			desc: "該寶可夢在場期間，特性都失去效果。此特性在陷阱和其他特性生效前發動。對特性為人馬一體、牽絆變身、絕對睡眠、畫皮、一口飛彈、結凍頭、多屬性、化學變化氣體、群聚變形、ＡＲ系統、魚群、界限盾殼、戰鬥切換、達摩模式的寶可夢無效。", // NEEDS QC
		},

		start: "  周圍充滿了化學變化氣體！",
		end: "  化學變化氣體的效果消失了！",
	},
	noguard: {
		name: "無防守",
		shortDesc: "自己使出和受到的招式都必定命中。", // NEEDS QC
	},
	normalize: {
		name: "一般皮膚",
		// Official flavor text: "無論是什麼屬性的招式， 全部都會變為一般屬性。 威力會少量提高。"
		desc: "該寶可夢的招式全部變為一般屬性，威力變為1.2倍。此效果在其他改變招式屬性的效果之前適用。", // NEEDS QC
		shortDesc: "所有招式變為一般屬性，威力1.2倍。", // NEEDS QC
		gen6: {
			desc: "該寶可夢的招式變為一般屬性。此效果在其他改變招式屬性的效果之前適用。", // NEEDS QC
			shortDesc: "該寶可夢的招式變為一般屬性。", // NEEDS QC
		},
		gen4: {
			desc: "該寶可夢的招式變為一般屬性。此效果在除掙扎外其他改變招式屬性的效果之後適用。", // NEEDS QC
		},
	},
	oblivious: {
		name: "遲鈍",
		// Official flavor text: "感覺遲鈍， 不會陷入著迷和被挑釁狀態。"
		desc: "該寶可夢不會陷入著迷狀態，也不會被挑釁。在著迷或被挑釁時獲得此特性會將其治癒。不受特性威嚇的影響。", // NEEDS QC
		shortDesc: "不會著迷或被挑釁。不受威嚇影響。", // NEEDS QC
		gen7: {
			desc: "該寶可夢不會陷入著迷狀態或受挑釁影響。在著迷或挑釁效果中獲得此特性時會解除。", // NEEDS QC
			shortDesc: "不會陷入著迷狀態或受挑釁影響。", // NEEDS QC
		},
		gen5: {
			desc: "該寶可夢不會陷入著迷狀態。在著迷狀態中獲得此特性時會解除。", // NEEDS QC
			shortDesc: "不會陷入著迷狀態。著迷中獲得此特性時會解除。", // NEEDS QC
		},
	},
	opportunist: {
		name: "跟風",
		shortDesc: "對手提高能力等級時，自己也複製該變化。", // NEEDS QC
	},
	orichalcumpulse: {
		name: "緋紅脈動",
		shortDesc: "出場時召喚大晴天，大晴天期間攻擊變為1.3333倍。", // NEEDS QC

		start: "  {POKEMON}加強日照，使古代的脈動狂暴起來！！",
		activate: "  {POKEMON}受到日照，使古代的脈動狂暴起來！！",
	},
	overcoat: {
		name: "防塵",
		// Official flavor text: "不會受到沙暴或冰雹等的傷害。 不會受到粉末類招式的攻擊。"
		desc: "該寶可夢不受粉末類招式、沙暴的傷害以及憤怒粉和特性孢子的影響。", // NEEDS QC
		shortDesc: "不受粉末類招式、沙暴傷害和孢子影響。", // NEEDS QC
		gen8: {
			desc: "該寶可夢不受粉末類招式、沙暴或冰雹的傷害以及憤怒粉和特性孢子的影響。", // NEEDS QC
			shortDesc: "不受粉末類招式、沙暴/冰雹傷害和孢子影響。", // NEEDS QC
		},
		gen5: {
			desc: "該寶可夢不受沙暴或冰雹的傷害。", // NEEDS QC
			shortDesc: "不受沙暴或冰雹的傷害。", // NEEDS QC
		},
	},
	overgrow: {
		name: "茂盛",
		// Official flavor text: "ＨＰ減少的時候， 草屬性的招式威力會提高。"
		desc: "該寶可夢的HP為最大HP的1/3（向下取整）或以下時，其使用草屬性攻擊時進攻能力變為1.5倍。", // NEEDS QC
		shortDesc: "HP為1/3以下時，草屬性攻擊的進攻能力變為1.5倍。", // NEEDS QC
		gen4: {
			desc: "該寶可夢的HP為最大HP的1/3（向下取整）以下時，其草屬性攻擊招式的威力變為1.5倍。", // NEEDS QC
			shortDesc: "HP為1/3以下時，草屬性攻擊的威力變為1.5倍。", // NEEDS QC
		},
	},
	owntempo: {
		name: "我行我素",
		// Official flavor text: "因為我行我素， 不會陷入混亂狀態。"
		desc: "該寶可夢不會陷入混亂狀態。在混亂時獲得此特性會將其治癒。不受特性威嚇的影響。", // NEEDS QC
		shortDesc: "不會混亂。不受威嚇影響。", // NEEDS QC
		gen7: {
			desc: "該寶可夢不會陷入混亂狀態。在混亂狀態中獲得此特性時會解除。", // NEEDS QC
			shortDesc: "該寶可夢不會陷入混亂狀態。", // NEEDS QC
		},
	},
	parentalbond: {
		name: "親子愛",
		// Official flavor text: "親子倆可合計攻擊２次。"
		desc: "該寶可夢的攻擊招式變為攻擊2次的連續攻擊招式，第2次攻擊的傷害變為1/4。對破滅之願、龍箭、極巨炮、蠻幹、大爆炸、搏命、投擲、預知未來、冰球、滾動、自爆、連續攻擊招式、以多個目標為對象的招式和需要2回合的招式無效。", // NEEDS QC
		shortDesc: "攻擊招式命中2次，第2次傷害為1/4。", // NEEDS QC
		gen8: {
			desc: "該寶可夢的攻擊招式變為攻擊2次的連續招式。第2次攻擊的傷害變為1/4。對破滅之願、龍箭、極巨炮、蠻幹、大爆炸、搏命、投擲、預知未來、冰球、滾動、自爆、連續攻擊招式、以多個對象為目標的招式、需2回合的招式、極巨招式不發動。", // NEEDS QC
		},
		gen7: {
			desc: "該寶可夢的攻擊招式變為攻擊2次的連續招式。第2次攻擊的傷害變為1/4。對破滅之願、蠻幹、大爆炸、搏命、投擲、預知未來、冰球、滾動、自爆、連續攻擊招式、以多個對象為目標的招式、需2回合的招式、Z招式不發動。", // NEEDS QC
		},
		gen6: {
			desc: "該寶可夢的攻擊招式變為攻擊2次的連續招式。第2次攻擊的傷害變為一半。對破滅之願、蠻幹、大爆炸、搏命、投擲、預知未來、冰球、滾動、自爆、連續攻擊招式、以多個對象為目標的招式、需2回合的招式不發動。", // NEEDS QC
			shortDesc: "攻擊招式攻擊2次。第2次傷害減半。", // NEEDS QC
		},
	},
	pastelveil: {
		name: "粉彩護幕",
		// Official flavor text: "自己和我方同伴都不會 陷入中毒的異常狀態。"
		desc: "該寶可夢及其隊友不會陷入中毒狀態。自身或隊友中毒時獲得此特性會將其治癒。若在引發中毒的效果中此特性被無視，該寶可夢會立即被治癒，但隊友不會。", // NEEDS QC
		shortDesc: "自己和隊友不會陷入中毒狀態。", // NEEDS QC
	},
	perishbody: {
		name: "滅亡之軀",
		// Official flavor text: "在受到接觸類招式攻擊時， ３個回合後雙方都會陷入瀕死。 替換寶可夢後效果就會消失。"
		desc: "與該寶可夢直接接觸時，該寶可夢和攻擊方都會進入滅亡之歌的效果。若攻擊方已有滅亡計數，該寶可夢不會進入此效果。", // NEEDS QC
		shortDesc: "被接觸時，雙方進入滅亡之歌的效果。", // NEEDS QC

		start: "  雙方將在３回合後滅亡！",
	},
	pickpocket: {
		name: "順手牽羊",
		// Official flavor text: "盜取接觸到自己的 對手的道具。"
		desc: "若該寶可夢沒有攜帶道具，被接觸類招式擊中時會偷取攻擊方的道具。此效果在連續攻擊招式的所有攻擊結束後判定。若招式的追加效果被特性強行消除，則此效果不會發動。", // NEEDS QC
		shortDesc: "未攜帶道具時被接觸，奪取攻擊方的道具。", // NEEDS QC
	},
	pickup: {
		name: "撿拾",
		// Official flavor text: "有時會撿來對手用過的道具。 冒險過程中也會撿來。"
		desc: "每回合結束時，若該寶可夢沒有攜帶道具，且相鄰的寶可夢中至少有一隻在此回合使用過道具，會隨機選擇其中一隻，獲得其最後使用的道具。以下情況不視為最後使用的道具：破裂的氣球、被其他具有此特性的寶可夢撿走的道具、因蟲咬、腐蝕氣體、渴望、燒盡、拍落、啄食、小偷而失去的道具。用投擲丟出的道具可以撿到。", // NEEDS QC
		shortDesc: "未攜帶道具時，撿走本回合被使用的道具。", // NEEDS QC
		gen7: {
			desc: "每回合結束時，若該寶可夢沒有攜帶道具且相鄰的寶可夢本回合使用過道具，則隨機選擇其中1隻，獲得其最後使用的道具。破裂的氣球、被其他擁有此特性的寶可夢撿走的道具、因蟲咬、渴望、燒盡、拍落、啄食、小偷失去的道具不視為最後使用的道具。用投擲丟出的道具可以撿取。", // NEEDS QC
		},
		gen4: {
			desc: "沒有對戰效果。", // NEEDS QC
			shortDesc: "沒有對戰效果。", // NEEDS QC
		},

		addItem: "#recycle",
	},
	piercingdrill: {
		name: "貫穿鑽",
		shortDesc: "接觸類招式可穿透守護，造成1/4傷害。", // NEEDS QC
	},
	pixilate: {
		name: "妖精皮膚",
		// Official flavor text: "一般屬性的招式 會變為妖精屬性。 威力會少量提高。"
		desc: "該寶可夢的一般屬性招式變為妖精屬性，威力變為1.2倍。此效果在其他改變招式屬性的效果之後、等離子浴和輸電的效果之前適用。", // NEEDS QC
		shortDesc: "一般屬性招式變為妖精屬性，威力1.2倍。", // NEEDS QC
		gen6: {
			desc: "該寶可夢的一般屬性招式變為妖精屬性，威力變為1.3倍。此效果在其他改變招式屬性的效果之後、等離子浴和輸電的效果之前適用。", // NEEDS QC
			shortDesc: "該寶可夢的一般屬性招式變為妖精屬性，威力1.3倍。", // NEEDS QC
		},
	},
	plus: {
		name: "正電",
		// Official flavor text: "場上的夥伴之中， 如果有正電或負電特性的寶可夢， 自己的特攻會提高。"
		desc: "若在場隊友的特性為此特性或負電，該寶可夢的特攻變為1.5倍。", // NEEDS QC
		shortDesc: "場上隊友有負電或此特性時，特攻變為1.5倍。", // NEEDS QC
		gen4: {
			desc: "在場的隊友特性為負電時，該寶可夢的特攻變為1.5倍。", // NEEDS QC
			shortDesc: "隊友的特性為負電時，特攻變為1.5倍。", // NEEDS QC
		},
		gen3: {
			desc: "場上有特性為負電的寶可夢時，該寶可夢的特攻變為1.5倍。", // NEEDS QC
			shortDesc: "場上有特性為負電的寶可夢時，特攻變為1.5倍。", // NEEDS QC
		},
	},
	poisonheal: {
		name: "毒療",
		// Official flavor text: "陷入中毒狀態時， ＨＰ不會減少，反而會漸漸增加。"
		desc: "該寶可夢處於中毒狀態時，不會失去HP，反而在每回合結束時回復最大HP的1/8（向下取整）。", // NEEDS QC
		shortDesc: "中毒時不掉血，反而每回合回復1/8HP。", // NEEDS QC
	},
	poisonpoint: {
		name: "毒刺",
		shortDesc: "有30%的機率使接觸自己的對手中毒。", // NEEDS QC
		gen4: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢有30%的機率陷入中毒狀態。該攻擊未造成HP損失時不觸發。", // NEEDS QC
		},
		gen3: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢有1/3的機率陷入中毒狀態。該攻擊未造成HP損失時不觸發。", // NEEDS QC
			shortDesc: "有1/3的機率使接觸的寶可夢中毒。", // NEEDS QC
		},
	},
	poisonpuppeteer: {
		name: "毒傀儡",
		desc: "若該寶可夢是桃歹郎，其使目標陷入中毒或劇毒狀態時，目標還會陷入混亂狀態。", // NEEDS QC
		shortDesc: "（桃歹郎專用）使中毒的對手同時陷入混亂。", // NEEDS QC
	},
	poisontouch: {
		name: "毒手",
		// Official flavor text: "有時僅是接觸 就能讓對手中毒。"
		desc: "該寶可夢的接觸類招式有30%的機率使目標中毒。此效果在招式本身的追加效果機率之後判定。", // NEEDS QC
		shortDesc: "接觸類招式有30%的機率使對手中毒。", // NEEDS QC
	},
	powerconstruct: {
		name: "群聚變形",
		// Official flavor text: "ＨＰ變為一半時， 細胞們會趕來支援， 變為完全體形態。"
		desc: "若該寶可夢是10%形態或50%形態的基格爾德，回合結束時HP為最大HP的1/2或以下時，變為基格爾德（完全體形態）。", // NEEDS QC
		shortDesc: "10%/50%基格爾德在回合結束時HP為1/2以下則變為完全體形態。", // NEEDS QC

		activate: "  感受到大量的氣息存在……！",
		transform: "{POKEMON}變成了完全體形態！",
	},
	powerofalchemy: {
		name: "化學之力",
		// Official flavor text: "繼承被打倒的同伴的特性， 變為相同的特性。"
		desc: "該寶可夢複製瀕死隊友的特性。無法複製的特性包括：人馬一體、牽絆變身、絕對睡眠、發號施令、畫皮、面影輝映、花之禮、陰晴不定、飽了又餓、結凍頭、幻覺、變身者、多屬性、化學變化氣體、毒傀儡、群聚變形、化學之力、古代活性、夸克充能、接球手、ＡＲ系統、魚群、界限盾殼、戰鬥切換、太晶甲殼、太晶變形、歸零化境、複製、神奇守護、達摩模式、全能變身。", // NEEDS QC
		shortDesc: "複製瀕死隊友的特性。", // NEEDS QC
		gen8: {
			desc: "複製瀕死隊友的特性。人馬一體、牽絆變身、絕對睡眠、畫皮、花之禮、陰晴不定、一口飛彈、飽了又餓、結凍頭、幻覺、變身者、多屬性、化學變化氣體、群聚變形、化學之力、接球手、ＡＲ系統、魚群、界限盾殼、戰鬥切換、複製、神奇守護、達摩模式無法複製。", // NEEDS QC
		},
		gen7: {
			desc: "複製瀕死隊友的特性。牽絆變身、絕對睡眠、畫皮、花之禮、陰晴不定、幻覺、變身者、多屬性、群聚變形、化學之力、接球手、ＡＲ系統、魚群、界限盾殼、戰鬥切換、複製、神奇守護、達摩模式無法複製。", // NEEDS QC
		},

		changeAbility: "#receiver",
	},
	powerspot: {
		name: "能量點",
		// Official flavor text: "只要站在旁邊， 招式的威力就會提高。"
		desc: "該寶可夢的隊友的招式威力變為1.3倍。對破滅之願和預知未來也有效，即使使用者不在場上。", // NEEDS QC
		shortDesc: "隊友的招式威力變為1.3倍。", // NEEDS QC
	},
	prankster: {
		name: "惡作劇之心",
		// Official flavor text: "可以搶先使出變化類招式。"
		desc: "該寶可夢的變化招式優先度+1。若招式的最終使用者具有此特性，惡屬性的對手不受這些招式以及由這些招式調用的招式的影響。", // NEEDS QC
		shortDesc: "變化招式優先度+1，但對惡屬性無效。", // NEEDS QC
		gen6: {
			desc: "該寶可夢不造成傷害的招式優先度+1。", // NEEDS QC
			shortDesc: "該寶可夢不造成傷害的招式優先度+1。", // NEEDS QC
		},
	},
	pressure: {
		name: "壓迫感",
		// Official flavor text: "給予對手壓迫感， 大量減少其使用招式的ＰＰ。"
		desc: "該寶可夢成為對手招式的目標時，該招式額外消耗1點PP。對手使用封印、搶奪、太晶爆發時也額外消耗1點PP，但黏黏網不會。", // NEEDS QC
		shortDesc: "以自己為目標的招式額外消耗1點PP。", // NEEDS QC
		gen8: {
			desc: "該寶可夢成為對手招式的目標時，該招式額外減少1點PP。對手使用的封印和搶奪也額外減少1點PP，但黏黏網不會。", // NEEDS QC
		},
		gen5: {
			desc: "該寶可夢成為對手招式的目標時，該招式額外減少1點PP。對手使用的封印和搶奪也額外減少1點PP。", // NEEDS QC
		},
		gen4: {
			desc: "該寶可夢成為其他寶可夢招式的目標時，該招式額外減少1點PP。", // NEEDS QC
			shortDesc: "以該寶可夢為目標的招式額外減少1點PP。", // NEEDS QC
		},

		start: "  {POKEMON}釋放著壓迫感！",
	},
	primordialsea: {
		name: "始源之海",
		// Official flavor text: "變為讓火屬性攻擊 失效的天氣。"
		desc: "出場時，天氣變為大雨。大雨包含下雨的所有效果，並使火屬性攻擊招式無法使用。此天氣持續到場上沒有寶可夢具有此特性為止，或被特性德爾塔氣流、終結之地改變為止。", // NEEDS QC
		shortDesc: "出場時下起大雨，直到此特性不在場為止。", // NEEDS QC
	},
	prismarmor: {
		name: "稜鏡裝甲",
		shortDesc: "受到的效果絕佳傷害變為3/4。", // NEEDS QC
	},
	propellertail: {
		name: "螺旋尾鰭",
		shortDesc: "自己招式的目標不會被變更。", // NEEDS QC
	},
	protean: {
		name: "變幻自如",
		// Official flavor text: "變為與自己使出的招式 相同的屬性。"
		desc: "該寶可夢的屬性變為其即將使用的招式的屬性。此效果在所有改變招式屬性的效果之後適用。每次出場只能發動1次，且太晶化後不會發動。", // NEEDS QC
		shortDesc: "屬性變為自己使出的招式屬性。每次出場1次。", // NEEDS QC
		gen8: {
			desc: "該寶可夢的屬性變為即將使用的招式的屬性。此效果在所有改變招式屬性的效果之後適用。", // NEEDS QC
			shortDesc: "該寶可夢的屬性變為即將使用的招式的屬性。", // NEEDS QC
		},
	},
	protosynthesis: {
		name: "古代活性",
		desc: "大晴天時，或該寶可夢使用攜帶的驅勁能量時，其數值最高的能力變為1.3倍（若最高的是速度則變為1.5倍）。此特性發動時考慮能力等級變化。若多項能力相同，按攻擊、防禦、特攻、特防、速度的順序優先。若此效果由大晴天發動，攜帶的驅勁能量不會發動，且大晴天結束時此效果結束。若此效果由攜帶的驅勁能量發動，該寶可夢離場時效果結束。", // NEEDS QC
		shortDesc: "大晴天或驅勁能量發動時，最高能力1.3倍（速度則1.5倍）。", // NEEDS QC

		activate: "  {POKEMON}用大晴天發動了古代活性！",
		activateFromItem: "  {POKEMON}用驅勁能量發動了古代活性！",
		start: "  {POKEMON}的{STAT}升高了！",
		end: "  {POKEMON}的古代活性效果消失了！",
	},
	psychicsurge: {
		name: "精神製造者",
		shortDesc: "出場時布下精神場地。", // NEEDS QC
	},
	punkrock: {
		name: "龐克搖滾",
		// Official flavor text: "聲音招式的威力會提高。 受到聲音招式的傷害會減半。"
		desc: "該寶可夢的聲音類招式威力變為1.3倍。該寶可夢受到的聲音類招式傷害減半。", // NEEDS QC
		shortDesc: "聲音類招式威力1.3倍，受到的聲音類傷害減半。", // NEEDS QC
	},
	purepower: {
		name: "瑜伽之力",
		shortDesc: "攻擊變為2倍。", // NEEDS QC
	},
	purifyingsalt: {
		name: "潔淨之鹽",
		desc: "該寶可夢不會陷入異常狀態，不受哈欠的影響。其他寶可夢對該寶可夢使用幽靈屬性攻擊時，計算傷害時進攻能力減半。", // NEEDS QC
		shortDesc: "不會陷入異常狀態，受到的幽靈屬性傷害減半。", // NEEDS QC
	},
	quarkdrive: {
		name: "夸克充能",
		desc: "電氣場地存在時，或該寶可夢使用攜帶的驅勁能量時，其數值最高的能力變為1.3倍（若最高的是速度則變為1.5倍）。此特性發動時考慮能力等級變化。若多項能力相同，按攻擊、防禦、特攻、特防、速度的順序優先。若此效果由電氣場地發動，攜帶的驅勁能量不會發動，且電氣場地結束時此效果結束。若此效果由攜帶的驅勁能量發動，該寶可夢離場時效果結束。", // NEEDS QC
		shortDesc: "電氣場地或驅勁能量發動時，最高能力1.3倍（速度則1.5倍）。", // NEEDS QC

		activate: "  {POKEMON}透過電氣場地發動了夸克充能！",
		activateFromItem: "  {POKEMON}用驅勁能量發動了夸克充能！",
		start: "  {POKEMON}的{STAT}升高了！",
		end: "  {POKEMON}的夸克充能效果消失了！",
	},
	queenlymajesty: {
		name: "女王的威嚴",
		// Official flavor text: "向對手施加威懾力， 使其無法對我方使出先制招式。"
		desc: "對手使用的以該寶可夢或其隊友為目標的先制招式無法生效。", // NEEDS QC
		shortDesc: "使對手指向己方的先制招式無效。", // NEEDS QC

		block: "#damp",
	},
	quickdraw: {
		name: "速擊",
		shortDesc: "使用攻擊招式時有30%的機率在相同優先度中先行動。", // NEEDS QC

		activate: "  速擊使{POKEMON}行動變快了！",
	},
	quickfeet: {
		name: "飛毛腿",
		// Official flavor text: "陷入異常狀態時， 速度會提高。"
		desc: "該寶可夢處於異常狀態時，速度變為1.5倍。其無視麻痺使速度減半的效果。", // NEEDS QC
		shortDesc: "有異常狀態時速度1.5倍，且無視麻痺的減速。", // NEEDS QC
		gen6: {
			desc: "該寶可夢處於異常狀態時，速度變為1.5倍。無視麻痺造成的速度降低。", // NEEDS QC
		},
	},
	raindish: {
		name: "雨盤",
		// Official flavor text: "天氣為下雨時， 會漸漸回復ＨＰ。"
		desc: "下雨時，該寶可夢在每回合結束時回復最大HP的1/16（向下取整）。攜帶萬能傘時此效果不會發動。", // NEEDS QC
		shortDesc: "下雨時，每回合回復最大HP的1/16。", // NEEDS QC
		gen7: {
			desc: "天氣為下雨時，每回合結束時回復最大HP的1/16（向下取整）。", // NEEDS QC
		},
	},
	rattled: {
		name: "膽怯",
		// Official flavor text: "受到惡屬性、幽靈屬性 和蟲屬性的招式攻擊時， 會因膽怯而使得速度提高。"
		desc: "該寶可夢被蟲、惡或幽靈屬性攻擊擊中時，或受到對手特性威嚇的影響時，速度提高1級。", // NEEDS QC
		shortDesc: "受到蟲、惡、幽靈屬性攻擊或威嚇時速度+1。", // NEEDS QC
		gen7: {
			desc: "該寶可夢受到蟲、惡或幽靈屬性攻擊時，速度提高1級。", // NEEDS QC
			shortDesc: "受到蟲/惡/幽靈屬性攻擊時，速度提高1級。", // NEEDS QC
		},
	},
	receiver: {
		name: "接球手",
		// Official flavor text: "繼承被打倒的同伴的特性， 變為相同的特性。"
		desc: "該寶可夢複製瀕死隊友的特性。無法複製的特性包括：人馬一體、牽絆變身、絕對睡眠、發號施令、畫皮、面影輝映、花之禮、陰晴不定、飽了又餓、結凍頭、幻覺、變身者、多屬性、化學變化氣體、毒傀儡、群聚變形、化學之力、古代活性、夸克充能、接球手、ＡＲ系統、魚群、界限盾殼、戰鬥切換、太晶甲殼、太晶變形、歸零化境、複製、神奇守護、達摩模式、全能變身。", // NEEDS QC
		shortDesc: "複製瀕死隊友的特性。", // NEEDS QC
		gen8: {
			desc: "複製瀕死隊友的特性。人馬一體、牽絆變身、絕對睡眠、畫皮、花之禮、陰晴不定、一口飛彈、飽了又餓、結凍頭、幻覺、變身者、多屬性、化學變化氣體、群聚變形、化學之力、接球手、ＡＲ系統、魚群、界限盾殼、戰鬥切換、複製、神奇守護、達摩模式無法複製。", // NEEDS QC
		},
		gen7: {
			desc: "複製瀕死隊友的特性。牽絆變身、絕對睡眠、畫皮、花之禮、陰晴不定、幻覺、變身者、多屬性、群聚變形、化學之力、接球手、ＡＲ系統、魚群、界限盾殼、戰鬥切換、複製、神奇守護、達摩模式無法複製。", // NEEDS QC
		},

		changeAbility: "  繼承了{SOURCE}的{ABILITY}！",
	},
	reckless: {
		name: "捨身",
		// Official flavor text: "會讓自己因反作用力而受傷的招式 威力會提高。"
		desc: "該寶可夢的具有反作用力傷害或失誤自傷的攻擊招式威力變為1.2倍。對掙扎無效。", // NEEDS QC
		shortDesc: "有反作用力傷害的招式威力變為1.2倍。", // NEEDS QC
	},
	refrigerate: {
		name: "冰凍皮膚",
		// Official flavor text: "一般屬性的招式 會變為冰屬性。 威力會少量提高。"
		desc: "該寶可夢的一般屬性招式變為冰屬性，威力變為1.2倍。此效果在其他改變招式屬性的效果之後、等離子浴和輸電的效果之前適用。", // NEEDS QC
		shortDesc: "一般屬性招式變為冰屬性，威力1.2倍。", // NEEDS QC
		gen6: {
			desc: "該寶可夢的一般屬性招式變為冰屬性，威力變為1.3倍。此效果在其他改變招式屬性的效果之後、等離子浴和輸電的效果之前適用。", // NEEDS QC
			shortDesc: "該寶可夢的一般屬性招式變為冰屬性，威力1.3倍。", // NEEDS QC
		},
	},
	regenerator: {
		name: "再生力",
		shortDesc: "交換下場時回復最大HP的1/3。", // NEEDS QC
	},
	ripen: {
		name: "熟成",
		// Official flavor text: "讓樹果成熟， 使效果變為２倍。"
		desc: "該寶可夢吃掉某些樹果時，效果翻倍。回復HP或PP的樹果回復量翻倍，提高能力等級的樹果提高量翻倍，傷害減半的樹果改為使傷害變為1/4，嘉珍果和霧蓮果使攻擊方失去最大HP的1/4（向下取整）。", // NEEDS QC
		shortDesc: "樹果的效果變為2倍。", // NEEDS QC
	},
	rivalry: {
		name: "鬥爭心",
		// Official flavor text: "面對性別相同的對手， 會燃起鬥爭心，變得更強。 面對性別不同的對手時則會變弱。"
		desc: "該寶可夢攻擊同性別的目標時威力變為1.25倍，攻擊異性別的目標時威力變為0.75倍。自身或目標無性別時沒有修正。", // NEEDS QC
		shortDesc: "對同性別威力1.25倍，對異性別0.75倍。", // NEEDS QC
	},
	rkssystem: {
		name: "ＡＲ系統",
		shortDesc: "銀伴戰獸的屬性隨攜帶的記憶碟變化。", // NEEDS QC; 記憶碟 via zh-tw/items.ts (PokeAPI)
	},
	rockhead: {
		name: "堅硬腦袋",
		// Official flavor text: "即使使出會受反作用力傷害的招式， ＨＰ也不會減少。"
		desc: "該寶可夢不受反作用力傷害（掙扎除外）。對生命寶珠的傷害和失誤自傷無效。", // NEEDS QC
		shortDesc: "不受反作用力傷害（掙扎、生命寶珠、落空傷害除外）。", // NEEDS QC
		gen3: {
			desc: "該寶可夢不受反作用力傷害，掙扎除外。無法防止落空時的傷害。", // NEEDS QC
			shortDesc: "不受掙扎和落空傷害以外的反作用力傷害。", // NEEDS QC
		},
	},
	rockypayload: {
		name: "搬岩",
		shortDesc: "岩石屬性攻擊的進攻能力變為1.5倍。", // NEEDS QC
	},
	roughskin: {
		name: "粗糙皮膚",
		// Official flavor text: "受到攻擊時， 用粗糙的皮膚弄傷 接觸到自己的對手。"
		desc: "與該寶可夢直接接觸的寶可夢失去最大HP的1/8（向下取整）。", // NEEDS QC
		shortDesc: "接觸自己的對手失去最大HP的1/8。", // NEEDS QC
		gen4: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢失去最大HP的1/8（向下取整）。該攻擊未造成HP損失時不觸發。", // NEEDS QC
		},
		gen3: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢失去最大HP的1/16（向下取整）。該攻擊未造成HP損失時不觸發。", // NEEDS QC
			shortDesc: "接觸該寶可夢的寶可夢失去最大HP的1/16。", // NEEDS QC
		},

		damage: "  {POKEMON}受到了傷害！",
	},
	runaway: {
		name: "逃跑",
		shortDesc: "沒有對戰效果。", // NEEDS QC
	},
	sandforce: {
		name: "沙之力",
		// Official flavor text: "天氣為沙暴時， 岩石屬性、地面屬性 和鋼屬性招式的威力會提高。"
		desc: "沙暴時，該寶可夢的地面、岩石和鋼屬性攻擊招式威力變為1.3倍。該寶可夢不受沙暴傷害。", // NEEDS QC
		shortDesc: "沙暴時地面、岩石、鋼招式威力1.3倍，且免疫沙暴。", // NEEDS QC
	},
	sandrush: {
		name: "撥沙",
		// Official flavor text: "天氣為沙暴時， 速度會提高。"
		desc: "沙暴時，該寶可夢的速度變為2倍。該寶可夢不受沙暴傷害。", // NEEDS QC
		shortDesc: "沙暴時速度變為2倍，且免疫沙暴傷害。", // NEEDS QC
	},
	sandspit: {
		name: "吐沙",
		shortDesc: "受到攻擊時召喚沙暴。", // NEEDS QC
		gen8: {
			desc: "該寶可夢受到攻擊時，沙暴的效果開始。此效果在極巨招式和超極巨招式的效果之後發動。", // NEEDS QC
		},
	},
	sandstream: {
		name: "揚沙",
		shortDesc: "出場時召喚沙暴。", // NEEDS QC
	},
	sandveil: {
		name: "沙隱",
		// Official flavor text: "在沙暴中 閃避率會提高。"
		desc: "沙暴時，以該寶可夢為目標的招式命中率變為0.8倍。該寶可夢不受沙暴傷害。", // NEEDS QC
		shortDesc: "沙暴時回避率變為1.25倍，且免疫沙暴傷害。", // NEEDS QC
	},
	sapsipper: {
		name: "食草",
		// Official flavor text: "受到草屬性的招式攻擊時， 不但不會受到傷害，反而攻擊會提高。"
		desc: "該寶可夢不受草屬性招式影響，且被草屬性招式擊中時攻擊提高1級。", // NEEDS QC
		shortDesc: "免疫草屬性招式，且攻擊提高1級。", // NEEDS QC
	},
	schooling: {
		name: "魚群",
		// Official flavor text: "ＨＰ多的時候會聚起來變強。 ＨＰ剩餘量變少時， 群體會分崩離析。"
		desc: "出場時，若該寶可夢是等級20以上的弱丁魚且剩餘HP高於最大HP的1/4，變為弱丁魚（魚群的樣子）。處於魚群的樣子時，HP降至最大HP的1/4或以下時，回合結束時變回單獨的樣子。處於單獨的樣子時，回合結束時HP高於最大HP的1/4時，變為魚群的樣子。", // NEEDS QC
		shortDesc: "弱丁魚HP高於1/4時變為魚群的樣子。", // NEEDS QC

		transform: "{POKEMON}的群體聚集起來了！",
		transformEnd: "{POKEMON}的群體四散而去了！",
	},
	scrappy: {
		name: "膽量",
		// Official flavor text: "一般屬性和格鬥屬性的招式 可擊中幽靈屬性的寶可夢。"
		desc: "該寶可夢的一般屬性和格鬥屬性招式可以擊中幽靈屬性寶可夢。不受特性威嚇的影響。", // NEEDS QC
		shortDesc: "一般和格鬥招式可命中幽靈屬性。不受威嚇影響。", // NEEDS QC
		gen7: {
			desc: "該寶可夢可以用一般和格鬥屬性招式命中幽靈屬性寶可夢。", // NEEDS QC
			shortDesc: "可以用一般/格鬥屬性招式命中幽靈屬性。", // NEEDS QC
		},
	},
	screencleaner: {
		name: "除障",
		shortDesc: "出場時消除雙方的反射壁、光牆等。", // NEEDS QC
	},
	seedsower: {
		name: "掉出種子",
		shortDesc: "受到攻擊時布下青草場地。", // NEEDS QC
	},
	serenegrace: {
		name: "天恩",
		// Official flavor text: "受到上天保佑， 容易出現招式的追加效果。"
		desc: "該寶可夢招式的追加效果發動機率翻倍。此效果可與彩虹的效果疊加，但使目標畏縮的追加效果除外。", // NEEDS QC
		shortDesc: "招式追加效果的發動機率變為2倍。", // NEEDS QC
		gen4: {
			desc: "該寶可夢招式的追加效果發動機率變為2倍。", // NEEDS QC
		},
	},
	shadowshield: {
		name: "幻影防守",
		shortDesc: "HP全滿時，受到的傷害減半。", // NEEDS QC
	},
	shadowtag: {
		name: "踩影",
		// Official flavor text: "踩住對手的影子 使其無法逃走或替換。"
		desc: "使對手無法選擇交換。攜帶美麗空殼的寶可夢、幽靈屬性寶可夢和同樣具有此特性的寶可夢除外。", // NEEDS QC
		shortDesc: "使不具此特性的對手無法交換。", // NEEDS QC
		gen6: {
			desc: "使相鄰的對手無法選擇交換。攜帶美麗空殼的寶可夢、幽靈屬性寶可夢和同樣擁有此特性的寶可夢除外。", // NEEDS QC
			shortDesc: "使相鄰的對手無法交換。擁有相同特性時除外。", // NEEDS QC
		},
		gen5: {
			desc: "使相鄰的對手無法選擇交換。攜帶美麗空殼的寶可夢和同樣擁有此特性的寶可夢除外。", // NEEDS QC
		},
		gen4: {
			desc: "使對手無法選擇交換。攜帶美麗空殼的寶可夢和同樣擁有此特性的寶可夢除外。", // NEEDS QC
			shortDesc: "使不具此特性的對手無法交換。", // NEEDS QC
		},
		gen3: {
			desc: "使對手無法選擇交換。", // NEEDS QC
			shortDesc: "使對手無法選擇交換。", // NEEDS QC
		},
	},
	sharpness: {
		name: "鋒銳",
		shortDesc: "切割類招式威力變為1.5倍。", // NEEDS QC
	},
	shedskin: {
		name: "蛻皮",
		// Official flavor text: "透過蛻去身上的皮， 有時會治癒異常狀態。"
		desc: "每回合結束時，該寶可夢有33%的機率治癒自身的異常狀態。", // NEEDS QC
		shortDesc: "每回合有33%的機率治癒自己的異常狀態。", // NEEDS QC
	},
	sheerforce: {
		name: "強行",
		// Official flavor text: "招式會失去追加效果， 但可以用更高的威力使出招式。"
		desc: "該寶可夢具有追加效果的攻擊招式威力變為1.3倍，但追加效果消失。若追加效果被消除，還會消除自身生命寶珠的反作用力傷害和貝殼之鈴的回復，並使目標的特性憤怒甲殼、怒火沖天、變色、危險迴避、順手牽羊、躍躍欲逃以及紅牌、逃脫按鍵、亞開果、香羅果不會發動。", // NEEDS QC
		shortDesc: "有追加效果的招式威力1.3倍，但追加效果消失。", // NEEDS QC
		gen8: {
			desc: "該寶可夢帶有追加效果的攻擊威力變為1.3倍，但失去追加效果。追加效果消失時，自身的生命寶珠反作用力和貝殼之鈴回復也消失，並阻止對手的怒火沖天、變色、危險迴避、順手牽羊、躍躍欲逃、紅牌、逃脫按鍵、亞開果、香羅果發動。", // NEEDS QC
		},
		gen6: {
			desc: "該寶可夢帶有追加效果的攻擊威力變為1.3倍，但失去追加效果。追加效果消失時，自身的生命寶珠反作用力和貝殼之鈴回復也消失，並阻止對手的變色、順手牽羊、紅牌、逃脫按鍵、亞開果、香羅果發動。", // NEEDS QC
		},
		gen5: {
			desc: "該寶可夢帶有追加效果的攻擊威力變為1.3倍，但失去追加效果。追加效果消失時，自身的生命寶珠反作用力和貝殼之鈴回復也消失，並阻止對手的變色、順手牽羊、紅牌、逃脫按鍵發動。", // NEEDS QC
		},
	},
	shellarmor: {
		name: "硬殼盔甲",
		shortDesc: "不會被擊中要害。", // NEEDS QC
	},
	shielddust: {
		name: "鱗粉",
		// Official flavor text: "被鱗粉守護著， 不會受到招式的追加效果影響。"
		desc: "該寶可夢不受其他寶可夢攻擊的追加效果影響。被防止的追加效果包括：有一定機率（即使是100%）使該寶可夢陷入麻痺、睡眠、冰凍、灼傷、中毒、混亂狀態，使其畏縮，或降低其能力等級的效果，以及擲錨、詭異咒語、投擲、精神噪音、鹽醃、縫影、糖漿炸彈、地獄突刺的效果。泡影的詠歎調的效果只有在該寶可夢是唯一目標時才會被防止。王者之證、銳利之牙以及特性毒手、惡臭、毒鎖鏈附加的追加效果也會被防止。", // NEEDS QC
		shortDesc: "不受對手招式的追加效果影響。", // NEEDS QC
		gen8: {
			desc: "該寶可夢不受其他寶可夢攻擊的追加效果影響。可以防止有機率（即使是100%）造成麻痺、睡眠、冰凍、灼傷、中毒、混亂、畏縮、能力下降的攻擊以及擲錨、詭異咒語、投擲、縫影、地獄突刺的追加效果。該寶可夢是唯一目標時，也防止泡影的詠歎調的效果。也不受王者之證、銳利之牙以及特性毒手、惡臭附加的追加效果影響。", // NEEDS QC
		},
		gen7: {
			desc: "該寶可夢不受其他寶可夢攻擊的追加效果影響。可以防止有機率（即使是100%）造成麻痺、睡眠、冰凍、灼傷、中毒、混亂、畏縮、能力下降的攻擊以及擲錨、投擲、縫影、地獄突刺的追加效果。該寶可夢是唯一目標時，也防止泡影的詠歎調的效果。也不受王者之證、銳利之牙以及特性毒手、惡臭附加的追加效果影響。", // NEEDS QC
		},
		gen6: {
			desc: "該寶可夢不受其他寶可夢攻擊的追加效果影響。可以防止有機率（即使是100%）造成麻痺、睡眠、冰凍、灼傷、中毒、混亂、畏縮、能力下降的攻擊以及投擲的追加效果。也不受王者之證、銳利之牙以及特性毒手、惡臭附加的追加效果影響。", // NEEDS QC
		},
		gen4: {
			desc: "該寶可夢不受其他寶可夢攻擊的追加效果影響。可以防止有機率（即使是100%）造成麻痺、睡眠、冰凍、灼傷、中毒、混亂、畏縮、能力下降的攻擊以及投擲的追加效果。也不受王者之證和銳利之牙附加的追加效果影響。", // NEEDS QC
		},
		gen3: {
			desc: "該寶可夢不受其他寶可夢攻擊的追加效果影響。可以防止有機率（即使是100%）造成麻痺、睡眠、冰凍、灼傷、中毒、混亂、畏縮、能力下降的攻擊。也不受王者之證附加的追加效果影響。", // NEEDS QC
		},
	},
	shieldsdown: {
		name: "界限盾殼",
		// Official flavor text: "ＨＰ變為一半時， 殼會壞掉，變得更有攻擊性。"
		desc: "若該寶可夢是小隕星，HP為最大HP的1/2或以下時變為核心的樣子，高於1/2時變為流星的樣子。此判定在出場時和每回合結束時進行。處於流星的樣子時，不會陷入異常狀態，也不受哈欠的影響。", // NEEDS QC
		shortDesc: "小隕星HP為1/2以下時變為核心的樣子。", // NEEDS QC

		transform: "界限盾殼，啟動！",
		transformEnd: "界限盾殼，解除！",
	},
	simple: {
		name: "單純",
		shortDesc: "能力等級的變化量變為2倍。", // NEEDS QC
		gen7: {
			desc: "該寶可夢的能力等級提高或降低時，幅度變為2倍。對使用變化類Z招式前Z力量帶來的能力提升不適用。", // NEEDS QC
		},
		gen6: {
			desc: "該寶可夢的能力等級提高或降低時，幅度變為2倍。", // NEEDS QC
		},
		gen4: {
			desc: "計算能力時，該寶可夢的能力等級視為2倍。等級不會被視為高於6或低於-6。", // NEEDS QC
			shortDesc: "計算能力時，能力等級視為2倍。", // NEEDS QC
		},
	},
	skilllink: {
		name: "連續攻擊",
		// Official flavor text: "使用連續招式時， 每回都能以最多次數進行攻擊。"
		desc: "該寶可夢的連續攻擊招式必定攻擊最多次數。三連踢和三旋擊的第2、3次攻擊不進行命中判定。", // NEEDS QC
		shortDesc: "連續攻擊招式必定攻擊最多次數。", // NEEDS QC
		gen7: {
			desc: "該寶可夢的連續攻擊招式必定攻擊最多次數。三連踢的第2次和第3次攻擊不進行命中判定。", // NEEDS QC
		},
		gen4: {
			desc: "該寶可夢的連續攻擊招式必定攻擊最多次數。對三連踢不發動。", // NEEDS QC
		},
	},
	slowstart: {
		name: "慢啟動",
		shortDesc: "出場後5回合內，攻擊和速度減半。", // NEEDS QC
		gen7: {
			desc: "出場後5回合內，攻擊和速度減半。效果期間，使用基於特殊招式的通用Z招式時，傷害計算中特攻減半。", // NEEDS QC
		},
		gen6: {
			desc: "出場後5回合內，攻擊和速度減半。", // NEEDS QC
		},

		start: "  {POKEMON}無法拿出平時的水準！",
		end: "  {POKEMON}恢復了平時的水準！",
	},
	slushrush: {
		name: "撥雪",
		shortDesc: "下雪時速度變為2倍。", // NEEDS QC
		gen8: {
			shortDesc: "冰雹時，該寶可夢的速度變為2倍。", // NEEDS QC
		},
	},
	sniper: {
		name: "狙擊手",
		shortDesc: "擊中要害時的傷害變為1.5倍。", // NEEDS QC
	},
	snowcloak: {
		name: "雪隱",
		// Official flavor text: "天氣為冰雹時， 閃避率會提高。"
		desc: "下雪時，以該寶可夢為目標的招式命中率變為0.8倍。", // NEEDS QC
		shortDesc: "下雪時回避率變為1.25倍。", // NEEDS QC
		gen8: {
			desc: "天氣為冰雹時，以該寶可夢為目標的招式命中率變為0.8倍。不受冰雹的傷害。", // NEEDS QC
			shortDesc: "冰雹時回避率變為1.25倍。不受冰雹傷害。", // NEEDS QC
		},
	},
	snowwarning: {
		name: "降雪",
		shortDesc: "出場時召喚下雪。", // NEEDS QC
		gen8: {
			shortDesc: "出場時，使天氣變為冰雹。", // NEEDS QC
		},
	},
	solarpower: {
		name: "太陽之力",
		// Official flavor text: "天氣為晴朗時特攻會提高， 但每回合ＨＰ會減少。"
		desc: "大晴天時，該寶可夢的特攻變為1.5倍，且每回合結束時失去最大HP的1/8（向下取整）。攜帶萬能傘時這些效果不會發動。", // NEEDS QC
		shortDesc: "大晴天時特攻1.5倍，但每回合失去1/8HP。", // NEEDS QC
		gen7: {
			desc: "天氣為大晴天時，該寶可夢的特攻變為1.5倍，且每回合結束時失去最大HP的1/8（向下取整）。", // NEEDS QC
		},
	},
	solidrock: {
		name: "堅硬岩石",
		shortDesc: "受到的效果絕佳傷害變為3/4。", // NEEDS QC
	},
	soulheart: {
		name: "魂心",
		shortDesc: "每當有寶可夢瀕死，特攻提高1級。", // NEEDS QC
	},
	soundproof: {
		name: "隔音",
		shortDesc: "不受（自己以外的）聲音類招式影響。", // NEEDS QC
		gen7: {
			shortDesc: "不受包括治癒鈴聲在內的聲音類招式影響。", // NEEDS QC
		},
		gen5: {
			shortDesc: "不受除治癒鈴聲以外的聲音類招式影響。", // NEEDS QC
		},
		gen4: {
			shortDesc: "不受包括治癒鈴聲在內的聲音類招式影響。", // NEEDS QC
		},
	},
	speedboost: {
		name: "加速",
		// Official flavor text: "每一回合速度會變快。"
		desc: "該寶可夢在場上度過完整回合時，每回合結束時速度提高1級。", // NEEDS QC
		shortDesc: "每在場上度過1回合，速度提高1級。", // NEEDS QC
	},
	spicyspray: {
		name: "辣椒噴發",
		shortDesc: "使攻擊自己的對手陷入灼傷狀態。", // NEEDS QC
	},
	stakeout: {
		name: "監視",
		shortDesc: "對本回合交換出場的對手，進攻能力變為2倍。", // NEEDS QC
	},
	stall: {
		name: "慢出",
		shortDesc: "在相同優先度中最後行動。", // NEEDS QC
	},
	stalwart: {
		name: "堅毅",
		shortDesc: "自己招式的目標不會被變更。", // NEEDS QC
	},
	stamina: {
		name: "持久力",
		shortDesc: "受到招式傷害後，防禦提高1級。", // NEEDS QC
	},
	stancechange: {
		name: "戰鬥切換",
		// Official flavor text: "若使出攻擊招式，會變為刀劍形態， 若使出招式「王者盾牌」， 會變為盾牌形態。"
		desc: "若該寶可夢是堅盾劍怪，使用攻擊招式前變為刀劍形態，使用王者盾牌前變為盾牌形態。", // NEEDS QC
		shortDesc: "堅盾劍怪攻擊時變為刀劍形態，用王者盾牌時變為盾牌形態。", // NEEDS QC
		gen6: {
			desc: "該寶可夢是堅盾劍怪時，嘗試使用攻擊招式前變為刀劍形態，嘗試使用王者盾牌前變為盾牌形態。", // NEEDS QC
		},

		transform: "刀劍形態，變形！",
		transformEnd: "盾牌形態，變形！",
	},
	static: {
		name: "靜電",
		shortDesc: "有30%的機率使接觸自己的對手麻痺。", // NEEDS QC
		gen4: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢有30%的機率陷入麻痺狀態。該攻擊未造成HP損失時不觸發。", // NEEDS QC
		},
		gen3: {
			desc: "用接觸類招式攻擊該寶可夢的寶可夢有1/3的機率陷入麻痺狀態。該攻擊未造成HP損失時不觸發。", // NEEDS QC
			shortDesc: "有1/3的機率使接觸的寶可夢麻痺。", // NEEDS QC
		},
	},
	steadfast: {
		name: "不屈之心",
		shortDesc: "畏縮時速度提高1級。", // NEEDS QC
	},
	steamengine: {
		name: "蒸汽機",
		// Official flavor text: "受到水屬性或 火屬性招式攻擊時， 速度會極大幅提高。"
		desc: "該寶可夢受到火屬性或水屬性招式的傷害後，速度提高6級。", // NEEDS QC
		shortDesc: "受到火或水屬性招式傷害後，速度提高6級。", // NEEDS QC
	},
	steelworker: {
		name: "鋼能力者",
		shortDesc: "鋼屬性攻擊的進攻能力變為1.5倍。", // NEEDS QC
	},
	steelyspirit: {
		name: "鋼之意志",
		// Official flavor text: "我方的鋼屬性 攻擊威力會提高。"
		desc: "該寶可夢及其隊友的鋼屬性招式威力變為1.5倍。對破滅之願也有效，即使使用者不在場上。", // NEEDS QC
		shortDesc: "己方的鋼屬性招式威力變為1.5倍。", // NEEDS QC
	},
	stench: {
		name: "惡臭",
		// Official flavor text: "發出臭氣， 在攻擊的時候， 有時會使對手畏縮。"
		desc: "該寶可夢的攻擊招式若沒有使目標畏縮的追加效果，則獲得10%的機率使目標畏縮。", // NEEDS QC
		shortDesc: "沒有畏縮效果的攻擊招式獲得10%的畏縮機率。", // NEEDS QC
		gen4: {
			desc: "沒有對戰效果。", // NEEDS QC
			shortDesc: "沒有對戰效果。", // NEEDS QC
		},
	},
	stickyhold: {
		name: "黏著",
		// Official flavor text: "道具會黏在 具有黏性的身體上， 不會被對手奪走。"
		desc: "該寶可夢不會因其他寶可夢的特性或攻擊而失去攜帶的道具，除非該攻擊使其瀕死。附著針仍會轉移給其他寶可夢。", // NEEDS QC
		shortDesc: "不會因對手的特性或攻擊失去道具。", // NEEDS QC
		gen4: {
			desc: "該寶可夢不會因其他寶可夢的攻擊而失去攜帶的道具，即使因該攻擊瀕死也不會失去。附著針無視此特性，會轉移給其他寶可夢。", // NEEDS QC
		},

		block: "  無法奪取{POKEMON}的道具！",
	},
	stormdrain: {
		name: "引水",
		// Official flavor text: "將水屬性的招式引到自己身上， 不但不會受到傷害， 反而會提高特攻。"
		desc: "該寶可夢不受水屬性招式影響，且被水屬性招式擊中時特攻提高1級。其他寶可夢使用的單體水屬性招式若不以該寶可夢為目標，且該寶可夢在其範圍內，會被引到該寶可夢身上。若多隻寶可夢可以用此特性引開招式，由速度最高的一隻引開；速度相同時，由此特性生效更久的一隻引開。", // NEEDS QC
		shortDesc: "吸引並免疫水屬性招式，特攻提高1級。", // NEEDS QC
		gen4: {
			desc: "其他寶可夢對該寶可夢以外的單體目標使用水屬性招式時，該招式被引到自己身上。", // NEEDS QC
			shortDesc: "將單體目標的水屬性招式引到自己身上。", // NEEDS QC
		},

		activate: "#lightningrod",
	},
	strongjaw: {
		name: "強壯之顎",
		// Official flavor text: "顎部強壯， 會提高啃咬類招式的威力。"
		desc: "該寶可夢的牙類招式威力變為1.5倍。", // NEEDS QC
		shortDesc: "牙類招式威力變為1.5倍（蟲咬除外）。", // NEEDS QC
	},
	sturdy: {
		name: "結實",
		// Official flavor text: "受到對手的招式攻擊時 不會被一擊打倒。 一擊必殺的招式也沒有效果。"
		desc: "該寶可夢的HP全滿時，受到攻擊必定會留下至少1點HP。一擊必殺招式對該寶可夢無效。", // NEEDS QC
		shortDesc: "HP全滿時不會被一擊打倒。免疫一擊必殺。", // NEEDS QC
		gen4: {
			desc: "一擊必殺招式對該寶可夢無效。", // NEEDS QC
			shortDesc: "一擊必殺招式對該寶可夢無效。", // NEEDS QC
		},

		activate: "  {POKEMON}挺住了攻擊！",
	},
	suctioncups: {
		name: "吸盤",
		shortDesc: "不會被對手的招式或道具強制交換。", // NEEDS QC

		block: "  {POKEMON}用吸盤吸住了！",
	},
	superluck: {
		name: "超幸運",
		shortDesc: "擊中要害等級提高1級。", // NEEDS QC
	},
	supersweetsyrup: {
		name: "甘露之蜜",
		shortDesc: "出場時使對手的回避率降低1級。每場戰鬥1次。", // NEEDS QC

		start: "  {POKEMON}的蜜散發出甜甜的氣味！",
	},
	supremeoverlord: {
		name: "大將",
		desc: "該寶可夢的招式威力變為1+(X×0.1)倍。X為此特性發動時己方寶可夢瀕死的累計次數（最多5）。", // NEEDS QC
		shortDesc: "每有1隻同伴瀕死，招式威力+10%（最多5隻）。", // NEEDS QC

		activate: "  {POKEMON}從被打倒的夥伴那裡得到了力量！",
	},
	surgesurfer: {
		name: "衝浪之尾",
		shortDesc: "電氣場地時，速度變為2倍。", // NEEDS QC
	},
	swarm: {
		name: "蟲之預感",
		// Official flavor text: "ＨＰ減少的時候， 蟲屬性的招式威力會提高。"
		desc: "該寶可夢的HP為最大HP的1/3（向下取整）或以下時，其使用蟲屬性攻擊時進攻能力變為1.5倍。", // NEEDS QC
		shortDesc: "HP為1/3以下時，蟲屬性攻擊的進攻能力變為1.5倍。", // NEEDS QC
		gen4: {
			desc: "該寶可夢的HP為最大HP的1/3（向下取整）以下時，其蟲屬性攻擊招式的威力變為1.5倍。", // NEEDS QC
			shortDesc: "HP為1/3以下時，蟲屬性攻擊的威力變為1.5倍。", // NEEDS QC
		},
	},
	sweetveil: {
		name: "甜幕",
		// Official flavor text: "我方的寶可夢 不會陷入睡眠狀態。"
		desc: "該寶可夢及其隊友不會陷入睡眠狀態，但已經睡著的不會立即醒來。該寶可夢及其隊友無法成功使用睡覺，不會受到哈欠的影響，已受到哈欠效果的也不會睡著。", // NEEDS QC
		shortDesc: "自己和隊友不會陷入睡眠狀態。", // NEEDS QC

		block: "  {POKEMON}因甜幕而不會睡著！",
	},
	swiftswim: {
		name: "悠游自如",
		// Official flavor text: "天氣為下雨時， 速度會提高。"
		desc: "下雨時，該寶可夢的速度變為2倍。攜帶萬能傘時此效果不會發動。", // NEEDS QC
		shortDesc: "下雨時速度變為2倍。", // NEEDS QC
		gen7: {
			desc: "天氣為下雨時，該寶可夢的速度變為2倍。", // NEEDS QC
		},
	},
	swordofruin: {
		name: "災禍之劍",
		shortDesc: "場上不具此特性的寶可夢防禦變為0.75倍。", // NEEDS QC

		start: "  因為{POKEMON}的災禍之劍，周圍的防禦減弱了！",
	},
	symbiosis: {
		name: "共生",
		// Official flavor text: "同伴使用道具時， 會把自己持有的道具交給同伴。"
		desc: "隊友使用道具後，該寶可夢立即將自己的道具交給該隊友。若隊友的道具是被奪走或被拍落的，或隊友使用的是逃脫按鍵或避難背包，則不會發動。", // NEEDS QC
		shortDesc: "隊友使用道具後，立即把自己的道具交給對方。", // NEEDS QC
		gen7: {
			desc: "隊友使用道具後，該寶可夢立即將攜帶的道具交給該隊友。隊友的道具被奪走或拍落時，或隊友使用了逃脫按鍵時不發動。", // NEEDS QC
		},
		gen6: {
			desc: "隊友使用道具後，該寶可夢立即將攜帶的道具交給該隊友。隊友的道具被奪走或拍落時不發動。", // NEEDS QC
		},

		activate: "  {POKEMON}將{ITEM}交給了{TARGET}！",
	},
	synchronize: {
		name: "同步",
		// Official flavor text: "將自己的中毒、麻痺或 灼傷狀態傳染給對手。"
		desc: "該寶可夢被其他寶可夢施加灼傷、麻痺、中毒或劇毒狀態時，對方也會陷入相同的異常狀態。", // NEEDS QC
		shortDesc: "被施加灼傷、中毒或麻痺時，對方也陷入相同狀態。", // NEEDS QC
		gen4: {
			desc: "其他寶可夢使該寶可夢陷入灼傷、麻痺或中毒狀態時，該寶可夢也使其陷入相同的異常狀態。其他寶可夢使該寶可夢陷入劇毒狀態時，該寶可夢使其陷入中毒狀態。", // NEEDS QC
		},
	},
	tabletsofruin: {
		name: "災禍之簡",
		shortDesc: "場上不具此特性的寶可夢攻擊變為0.75倍。", // NEEDS QC

		start: "  因為{POKEMON}的災禍之簡，周圍的攻擊減弱了！",
	},
	tangledfeet: {
		name: "蹣跚",
		shortDesc: "混亂期間，回避率變為2倍。", // NEEDS QC
	},
	tanglinghair: {
		name: "捲髮",
		shortDesc: "接觸自己的對手速度降低1級。", // NEEDS QC
	},
	technician: {
		name: "技術高手",
		// Official flavor text: "可讓威力低的招式 提高威力來進行攻擊。"
		desc: "該寶可夢威力60以下的招式威力變為1.5倍，包括掙扎。此效果在招式自身改變威力的效果之後適用。", // NEEDS QC
		shortDesc: "威力60以下的招式威力變為1.5倍（包括掙扎）。", // NEEDS QC
		gen4: {
			desc: "該寶可夢威力60以下的招式威力變為1.5倍，掙扎除外。此效果在招式自身的威力變化以及充電、幫助的效果之後適用。", // NEEDS QC
			shortDesc: "威力60以下的招式威力變為1.5倍，掙扎除外。", // NEEDS QC
		},
	},
	telepathy: {
		name: "心靈感應",
		shortDesc: "不受隊友攻擊的傷害。", // NEEDS QC

		block: "  {POKEMON}不會受到同伴的攻擊！",
	},
	teraformzero: {
		name: "歸零化境",
		shortDesc: "（太樂巴戈斯專用）太晶化時消除天氣和場地。1次。", // NEEDS QC
	},
	terashell: {
		name: "太晶甲殼",
		desc: "若該寶可夢是HP全滿的太樂巴戈斯，受到的攻擊的屬性相性變為0.5倍，除非該寶可夢對該招式免疫。連續攻擊招式在整次攻擊中保持相同的相性。", // NEEDS QC
		shortDesc: "（太樂巴戈斯專用）HP全滿時，受擊相性變為0.5倍。", // NEEDS QC

		activate: "  {POKEMON}讓甲殼綻放光輝，扭曲了屬性相剋關係！！",
	},
	terashift: {
		name: "太晶變形",
		shortDesc: "太樂巴戈斯出場時變為太晶形態。", // NEEDS QC

		transform: "{POKEMON}的樣子發生了變化！",
	},
	teravolt: {
		name: "兆級電壓",
		// Official flavor text: "可以不受對手特性的干擾， 向對手使出招式。"
		desc: "該寶可夢的招式及其效果無視其他寶可夢的一部分特性。可無視的特性包括：尾甲、芳香幕、氣場破壞、戰鬥盔甲、健壯胸肌、防彈、恆淨之軀、唱反調、濕氣、鮮艷之軀、畫皮、乾燥皮膚、食土、過濾、引火、花之禮、花幕、毛茸茸、友情防守、毛皮大衣、黃金之軀、草之毛皮、看門犬、耐熱、重金屬、怪力鉗、結凍頭、冰鱗粉、發光、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、心眼、鏡甲、電氣引擎、多重鱗片、遲鈍、防塵、我行我素、粉彩護幕、龐克搖滾、潔淨之鹽、女王的威嚴、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、甜幕、蹣跚、心靈感應、太晶甲殼、熱交換、厚脂肪、純樸、幹勁、蓄電、儲水、水泡、水幕、焦香之軀、白色煙霧、乘風、神奇守護、奇跡皮膚。此效果影響場上所有其他寶可夢，無論其是否為該寶可夢招式的目標，也無論其特性是否對該寶可夢有利。", // NEEDS QC
		shortDesc: "使出招式時無視對手的特性。", // NEEDS QC
		gen8: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為芳香幕、氣場破壞、戰鬥盔甲、健壯胸肌、防彈、恆淨之軀、唱反調、濕氣、鮮艷之軀、畫皮、乾燥皮膚、過濾、引火、花之禮、花幕、毛茸茸、友情防守、毛皮大衣、草之毛皮、耐熱、重金屬、怪力鉗、結凍頭、冰鱗粉、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、鏡甲、電氣引擎、多重鱗片、遲鈍、防塵、我行我素、粉彩護幕、龐克搖滾、女王的威嚴、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、甜幕、蹣跚、心靈感應、厚脂肪、純樸、幹勁、蓄電、儲水、水泡、水幕、白色煙霧、神奇守護、奇跡皮膚。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標，也無論該特性對該寶可夢是否有利。", // NEEDS QC
		},
		gen7: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為芳香幕、氣場破壞、戰鬥盔甲、健壯胸肌、防彈、恆淨之軀、唱反調、濕氣、暗黑氣場、鮮艷之軀、畫皮、乾燥皮膚、妖精氣場、過濾、引火、花之禮、花幕、毛茸茸、友情防守、毛皮大衣、草之毛皮、耐熱、重金屬、怪力鉗、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、電氣引擎、多重鱗片、遲鈍、防塵、我行我素、女王的威嚴、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、甜幕、蹣跚、心靈感應、厚脂肪、純樸、幹勁、蓄電、儲水、水泡、水幕、白色煙霧、神奇守護、奇跡皮膚。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標，也無論該特性對該寶可夢是否有利。", // NEEDS QC
		},
		gen6: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為芳香幕、氣場破壞、戰鬥盔甲、健壯胸肌、防彈、恆淨之軀、唱反調、濕氣、暗黑氣場、乾燥皮膚、妖精氣場、過濾、引火、花之禮、花幕、友情防守、毛皮大衣、草之毛皮、耐熱、重金屬、怪力鉗、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、電氣引擎、多重鱗片、遲鈍、防塵、我行我素、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、甜幕、蹣跚、心靈感應、厚脂肪、純樸、幹勁、蓄電、儲水、水幕、白色煙霧、神奇守護、奇跡皮膚。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標，也無論該特性對該寶可夢是否有利。", // NEEDS QC
		},
		gen5: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為戰鬥盔甲、健壯胸肌、恆淨之軀、唱反調、濕氣、乾燥皮膚、過濾、引火、花之禮、友情防守、耐熱、重金屬、怪力鉗、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、電氣引擎、多重鱗片、遲鈍、我行我素、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、蹣跚、心靈感應、厚脂肪、純樸、幹勁、蓄電、儲水、水幕、白色煙霧、神奇守護、奇跡皮膚。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標，也無論該特性對該寶可夢是否有利。", // NEEDS QC
		},
		gen4: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為戰鬥盔甲、恆淨之軀、濕氣、乾燥皮膚、過濾、引火、花之禮、耐熱、怪力鉗、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、避雷針、柔軟、熔岩鎧甲、神奇鱗片、電氣引擎、遲鈍、我行我素、沙隱、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、蹣跚、厚脂肪、純樸、幹勁、蓄電、儲水、水幕、白色煙霧、神奇守護。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標。不會無視隊友的特性花之禮帶來的攻擊修正。", // NEEDS QC
		},

		start: "  {POKEMON}釋放著濺射氣場！",
	},
	thermalexchange: {
		name: "熱交換",
		desc: "該寶可夢受到火屬性招式的傷害後，攻擊提高1級。該寶可夢不會陷入灼傷狀態。在灼傷時獲得此特性會將其治癒。", // NEEDS QC
		shortDesc: "受到火屬性傷害時攻擊+1。不會陷入灼傷。", // NEEDS QC
	},
	thickfat: {
		name: "厚脂肪",
		// Official flavor text: "被厚厚的脂肪保護著， 能夠讓火屬性和冰屬性 招式的傷害減半。"
		desc: "其他寶可夢對該寶可夢使用火屬性或冰屬性攻擊時，計算傷害時進攻能力減半。", // NEEDS QC
		shortDesc: "受到的火和冰屬性傷害減半。", // NEEDS QC
		gen4: {
			desc: "該寶可夢受到的火屬性和冰屬性攻擊威力減半。", // NEEDS QC
			shortDesc: "受到的火/冰屬性攻擊威力減半。", // NEEDS QC
		},
		gen3: {
			desc: "其他寶可夢對該寶可夢使用火屬性或冰屬性攻擊時，計算對該寶可夢的傷害時其特攻減半。", // NEEDS QC
			shortDesc: "對該寶可夢的火/冰屬性攻擊以減半的特攻計算傷害。", // NEEDS QC
		},
	},
	tintedlens: {
		name: "有色眼鏡",
		shortDesc: "效果不好的招式傷害變為2倍。", // NEEDS QC
	},
	torrent: {
		name: "激流",
		// Official flavor text: "ＨＰ減少的時候， 水屬性的招式威力會提高。"
		desc: "該寶可夢的HP為最大HP的1/3（向下取整）或以下時，其使用水屬性攻擊時進攻能力變為1.5倍。", // NEEDS QC
		shortDesc: "HP為1/3以下時，水屬性攻擊的進攻能力變為1.5倍。", // NEEDS QC
		gen4: {
			desc: "該寶可夢的HP為最大HP的1/3（向下取整）以下時，其水屬性攻擊招式的威力變為1.5倍。", // NEEDS QC
			shortDesc: "HP為1/3以下時，水屬性攻擊的威力變為1.5倍。", // NEEDS QC
		},
	},
	toughclaws: {
		name: "硬爪",
		shortDesc: "接觸類招式威力變為1.3倍。", // NEEDS QC
	},
	toxicboost: {
		name: "中毒激升",
		// Official flavor text: "陷入中毒狀態時， 物理招式的威力會提高。"
		desc: "該寶可夢處於中毒狀態時，其物理攻擊的威力變為1.5倍。", // NEEDS QC
		shortDesc: "中毒時物理招式威力變為1.5倍。", // NEEDS QC
	},
	toxicchain: {
		name: "毒鎖鏈",
		desc: "該寶可夢的攻擊招式有30%的機率使目標陷入劇毒狀態。此效果在招式本身的追加效果機率之前判定。", // NEEDS QC
		shortDesc: "攻擊招式有30%的機率使對手劇毒。", // NEEDS QC
	},
	toxicdebris: {
		name: "毒滿地",
		shortDesc: "受到物理攻擊時，在對手方布下毒菱。", // NEEDS QC
	},
	trace: {
		name: "複製",
		// Official flavor text: "出場時，複製對手的特性， 變為與之相同的特性。"
		desc: "出場時，該寶可夢複製隨機一個對手的特性。無法複製的特性包括：人馬一體、牽絆變身、絕對睡眠、發號施令、畫皮、面影輝映、花之禮、陰晴不定、飽了又餓、結凍頭、幻覺、變身者、多屬性、化學變化氣體、毒傀儡、群聚變形、化學之力、古代活性、夸克充能、接球手、ＡＲ系統、魚群、界限盾殼、戰鬥切換、太晶甲殼、太晶變形、歸零化境、複製、達摩模式、全能變身。若沒有對手擁有可複製的特性，此特性會在出現可複製的特性時立即發動。", // NEEDS QC
		shortDesc: "出場時複製隨機一個對手的特性。", // NEEDS QC
		gen8: {
			desc: "出場時，隨機複製1隻對手寶可夢的特性。人馬一體、牽絆變身、絕對睡眠、畫皮、花之禮、陰晴不定、一口飛彈、飽了又餓、結凍頭、幻覺、變身者、多屬性、化學變化氣體、群聚變形、化學之力、接球手、ＡＲ系統、魚群、界限盾殼、戰鬥切換、複製、達摩模式無法複製。沒有擁有可複製特性的對手時，一旦出現就會發動此特性。", // NEEDS QC
		},
		gen7: {
			desc: "出場時，隨機複製1隻對手寶可夢的特性。牽絆變身、絕對睡眠、畫皮、花之禮、陰晴不定、幻覺、變身者、多屬性、群聚變形、化學之力、接球手、ＡＲ系統、魚群、界限盾殼、戰鬥切換、複製、達摩模式無法複製。沒有擁有可複製特性的對手時，一旦出現就會發動此特性。", // NEEDS QC
		},
		gen6: {
			desc: "出場時，隨機複製1隻相鄰的對手寶可夢的特性。花之禮、陰晴不定、幻覺、變身者、多屬性、戰鬥切換、複製、達摩模式無法複製。沒有擁有可複製特性的對手時，一旦出現就會發動此特性。", // NEEDS QC
		},
		gen5: {
			desc: "出場時，隨機複製1隻相鄰的對手寶可夢的特性。花之禮、陰晴不定、幻覺、變身者、多屬性、複製、達摩模式無法複製。沒有擁有可複製特性的對手時，一旦出現就會發動此特性。", // NEEDS QC
		},
		gen4: {
			desc: "出場時，隨機複製1隻對手寶可夢的特性。陰晴不定、多屬性、複製無法複製。沒有擁有可複製特性的對手時，一旦出現就會發動此特性。", // NEEDS QC
		},
		gen3: {
			desc: "出場時，隨機複製1隻對手寶可夢的特性。", // NEEDS QC
		},

		changeAbility: "  複製了{SOURCE}的{ABILITY}！",
	},
	transistor: {
		name: "電晶體",
		shortDesc: "電屬性攻擊的進攻能力變為1.3倍。", // NEEDS QC
		gen8: {
			shortDesc: "使用電屬性攻擊時，進攻能力變為1.5倍。", // NEEDS QC
		},
	},
	triage: {
		name: "先行治療",
		shortDesc: "回復類招式優先度+3。", // NEEDS QC
	},
	truant: {
		name: "懶惰",
		shortDesc: "每隔1回合才能行動。", // NEEDS QC
		gen3: {
			desc: "該寶可夢每隔一回合會偷懶而不使用招式。若接替因回合結束時的效果而瀕死的寶可夢出場，第一回合會偷懶。", // NEEDS QC
		},

		cant: "{POKEMON}正在偷懶。",
	},
	turboblaze: {
		name: "渦輪火焰",
		// Official flavor text: "可以不受對手特性的干擾， 向對手使出招式。"
		desc: "該寶可夢的招式及其效果無視其他寶可夢的一部分特性。可無視的特性包括：尾甲、芳香幕、氣場破壞、戰鬥盔甲、健壯胸肌、防彈、恆淨之軀、唱反調、濕氣、鮮艷之軀、畫皮、乾燥皮膚、食土、過濾、引火、花之禮、花幕、毛茸茸、友情防守、毛皮大衣、黃金之軀、草之毛皮、看門犬、耐熱、重金屬、怪力鉗、結凍頭、冰鱗粉、發光、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、心眼、鏡甲、電氣引擎、多重鱗片、遲鈍、防塵、我行我素、粉彩護幕、龐克搖滾、潔淨之鹽、女王的威嚴、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、甜幕、蹣跚、心靈感應、太晶甲殼、熱交換、厚脂肪、純樸、幹勁、蓄電、儲水、水泡、水幕、焦香之軀、白色煙霧、乘風、神奇守護、奇跡皮膚。此效果影響場上所有其他寶可夢，無論其是否為該寶可夢招式的目標，也無論其特性是否對該寶可夢有利。", // NEEDS QC
		shortDesc: "使出招式時無視對手的特性。", // NEEDS QC
		gen8: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為芳香幕、氣場破壞、戰鬥盔甲、健壯胸肌、防彈、恆淨之軀、唱反調、濕氣、鮮艷之軀、畫皮、乾燥皮膚、過濾、引火、花之禮、花幕、毛茸茸、友情防守、毛皮大衣、草之毛皮、耐熱、重金屬、怪力鉗、結凍頭、冰鱗粉、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、鏡甲、電氣引擎、多重鱗片、遲鈍、防塵、我行我素、粉彩護幕、龐克搖滾、女王的威嚴、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、甜幕、蹣跚、心靈感應、厚脂肪、純樸、幹勁、蓄電、儲水、水泡、水幕、白色煙霧、神奇守護、奇跡皮膚。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標，也無論該特性對該寶可夢是否有利。", // NEEDS QC
		},
		gen7: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為芳香幕、氣場破壞、戰鬥盔甲、健壯胸肌、防彈、恆淨之軀、唱反調、濕氣、暗黑氣場、鮮艷之軀、畫皮、乾燥皮膚、妖精氣場、過濾、引火、花之禮、花幕、毛茸茸、友情防守、毛皮大衣、草之毛皮、耐熱、重金屬、怪力鉗、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、電氣引擎、多重鱗片、遲鈍、防塵、我行我素、女王的威嚴、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、甜幕、蹣跚、心靈感應、厚脂肪、純樸、幹勁、蓄電、儲水、水泡、水幕、白色煙霧、神奇守護、奇跡皮膚。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標，也無論該特性對該寶可夢是否有利。", // NEEDS QC
		},
		gen6: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為芳香幕、氣場破壞、戰鬥盔甲、健壯胸肌、防彈、恆淨之軀、唱反調、濕氣、暗黑氣場、乾燥皮膚、妖精氣場、過濾、引火、花之禮、花幕、友情防守、毛皮大衣、草之毛皮、耐熱、重金屬、怪力鉗、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、電氣引擎、多重鱗片、遲鈍、防塵、我行我素、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、甜幕、蹣跚、心靈感應、厚脂肪、純樸、幹勁、蓄電、儲水、水幕、白色煙霧、神奇守護、奇跡皮膚。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標，也無論該特性對該寶可夢是否有利。", // NEEDS QC
		},
		gen5: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為戰鬥盔甲、健壯胸肌、恆淨之軀、唱反調、濕氣、乾燥皮膚、過濾、引火、花之禮、友情防守、耐熱、重金屬、怪力鉗、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、輕金屬、避雷針、柔軟、魔法鏡、熔岩鎧甲、神奇鱗片、電氣引擎、多重鱗片、遲鈍、我行我素、沙隱、食草、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、蹣跚、心靈感應、厚脂肪、純樸、幹勁、蓄電、儲水、水幕、白色煙霧、神奇守護、奇跡皮膚。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標，也無論該特性對該寶可夢是否有利。", // NEEDS QC
		},
		gen4: {
			desc: "該寶可夢的招式及其效果無視其他寶可夢的部分特性。可以無視的特性為戰鬥盔甲、恆淨之軀、濕氣、乾燥皮膚、過濾、引火、花之禮、耐熱、怪力鉗、免疫、精神力、不眠、銳利目光、葉子防守、飄浮、避雷針、柔軟、熔岩鎧甲、神奇鱗片、電氣引擎、遲鈍、我行我素、沙隱、硬殼盔甲、鱗粉、單純、雪隱、堅硬岩石、隔音、黏著、引水、結實、吸盤、蹣跚、厚脂肪、純樸、幹勁、蓄電、儲水、水幕、白色煙霧、神奇守護。此效果適用於場上其他所有寶可夢，無論其是否為該寶可夢招式的目標。不會無視隊友的特性花之禮帶來的攻擊修正。", // NEEDS QC
		},

		start: "  {POKEMON}釋放著熾焰氣場！",
	},
	unaware: {
		name: "純樸",
		// Official flavor text: "可無視對手能力的變化， 進行攻擊。"
		desc: "該寶可夢受到傷害時，無視其他寶可夢的攻擊、特攻和命中率的能力等級變化；造成傷害時，無視其他寶可夢的防禦、特防和回避率的能力等級變化。", // NEEDS QC
		shortDesc: "計算傷害時無視對手的能力等級變化。", // NEEDS QC
	},
	unburden: {
		name: "輕裝",
		// Official flavor text: "失去所持有的道具時， 速度會提高。"
		desc: "該寶可夢因任何原因失去攜帶的道具後，只要仍在場、保持此特性且沒有攜帶道具，速度變為2倍。", // NEEDS QC
		shortDesc: "失去道具後，速度變為2倍。", // NEEDS QC
	},
	unnerve: {
		name: "緊張感",
		// Official flavor text: "讓對手感到緊張， 無法吃樹果。"
		desc: "該寶可夢在場時，對手無法使用樹果。此特性先於陷阱和其他特性發動。", // NEEDS QC
		shortDesc: "在場時，對手無法食用樹果。", // NEEDS QC

		start: "  {TEAM}因太緊張而無法食用樹果！",
	},
	unseenfist: {
		name: "無形拳",
		shortDesc: "接觸類招式可穿透守護類招式（極巨防壁除外）。", // NEEDS QC
		champions: {
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	vesselofruin: {
		name: "災禍之鼎",
		shortDesc: "場上不具此特性的寶可夢特攻變為0.75倍。", // NEEDS QC

		start: "  因為{POKEMON}的災禍之鼎，周圍的特攻減弱了！",
	},
	victorystar: {
		name: "勝利之星",
		shortDesc: "己方的命中率變為1.1倍。", // NEEDS QC
	},
	vitalspirit: {
		name: "幹勁",
		shortDesc: "不會陷入睡眠狀態。睡眠時獲得此特性會治癒。", // NEEDS QC
	},
	voltabsorb: {
		name: "蓄電",
		// Official flavor text: "受到電屬性的招式攻擊時， 不會受到傷害，而是會回復。"
		desc: "該寶可夢不受電屬性招式影響，且被電屬性招式擊中時回復最大HP的1/4（向下取整）。", // NEEDS QC
		shortDesc: "免疫電屬性招式，並回復最大HP的1/4。", // NEEDS QC
		gen3: {
			desc: "該寶可夢不受電屬性攻擊招式影響，受到時回復最大HP的1/4（向下取整）。", // NEEDS QC
			shortDesc: "使電屬性攻擊招式無效，並回復最大HP的1/4。", // NEEDS QC
		},
	},
	wanderingspirit: {
		name: "遊魂",
		// Official flavor text: "與使用接觸類招式 攻擊自己的寶可夢互換特性。"
		desc: "與該寶可夢直接接觸的寶可夢，特性會與此特性互換。特性為人馬一體、牽絆變身、絕對睡眠、發號施令、畫皮、面影輝映、飽了又餓、結凍頭、幻覺、多屬性、化學變化氣體、毒傀儡、群聚變形、古代活性、夸克充能、ＡＲ系統、魚群、界限盾殼、戰鬥切換、太晶甲殼、太晶變形、歸零化境、神奇守護、達摩模式、全能變身的寶可夢不受影響。", // NEEDS QC
		shortDesc: "與接觸自己的對手互換特性。", // NEEDS QC
		gen8: {
			desc: "與用接觸類招式攻擊該寶可夢的寶可夢互換特性。對特性為人馬一體、牽絆變身、絕對睡眠、畫皮、一口飛彈、飽了又餓、結凍頭、幻覺、多屬性、化學變化氣體、群聚變形、ＡＲ系統、魚群、界限盾殼、戰鬥切換、神奇守護、達摩模式的寶可夢無效。", // NEEDS QC
		},

		activate: "#skillswap",
	},
	waterabsorb: {
		name: "儲水",
		// Official flavor text: "受到水屬性的招式攻擊時， 不會受到傷害，而是會回復。"
		desc: "該寶可夢不受水屬性招式影響，且被水屬性招式擊中時回復最大HP的1/4（向下取整）。", // NEEDS QC
		shortDesc: "免疫水屬性招式，並回復最大HP的1/4。", // NEEDS QC
	},
	waterbubble: {
		name: "水泡",
		// Official flavor text: "降低自己受到的火屬性 招式的威力。不會灼傷。"
		desc: "該寶可夢使用水屬性攻擊時進攻能力變為2倍。其他寶可夢對該寶可夢使用火屬性攻擊時，計算傷害時進攻能力減半。該寶可夢不會陷入灼傷狀態。在灼傷時獲得此特性會將其治癒。", // NEEDS QC
		shortDesc: "水屬性威力2倍，受火屬性減半，不會灼傷。", // NEEDS QC
	},
	watercompaction: {
		name: "遇水凝固",
		shortDesc: "受到水屬性招式傷害後，防禦提高2級。", // NEEDS QC
	},
	waterveil: {
		name: "水幕",
		shortDesc: "不會陷入灼傷狀態。灼傷時獲得此特性會治癒。", // NEEDS QC
	},
	weakarmor: {
		name: "碎裂鎧甲",
		// Official flavor text: "因物理招式受到傷害時， 防禦會降低， 速度會大幅提高。"
		desc: "該寶可夢被物理攻擊擊中時，防禦降低1級，速度提高2級。", // NEEDS QC
		shortDesc: "受到物理攻擊時，防禦-1，速度+2。", // NEEDS QC
		gen6: {
			desc: "該寶可夢受到物理攻擊時，防禦降低1級，速度提高1級。", // NEEDS QC
			shortDesc: "受到物理攻擊時，防禦降低1級，速度提高1級。", // NEEDS QC
		},
	},
	wellbakedbody: {
		name: "焦香之軀",
		desc: "該寶可夢不受火屬性招式影響，且被火屬性招式擊中時防禦提高2級。", // NEEDS QC
		shortDesc: "免疫火屬性招式，且防禦提高2級。", // NEEDS QC
	},
	whitesmoke: {
		name: "白色煙霧",
		shortDesc: "能力等級不會被其他寶可夢降低。", // NEEDS QC
	},
	wimpout: {
		name: "躍躍欲逃",
		// Official flavor text: "ＨＰ變為一半時， 會慌慌張張逃走， 退回同行隊伍裡面。"
		desc: "該寶可夢的HP高於最大HP的1/2、且受到傷害後降至1/2或以下時，立即交換為選擇的隊友。此效果在連續攻擊招式的所有攻擊結束後判定。若招式的追加效果被特性強行消除，則此效果不會發動。直接和間接傷害均可觸發，但使用詛咒、替身時的消耗、腹鼓、分擔痛楚和混亂的自傷除外。", // NEEDS QC
		shortDesc: "HP變為1/2以下時，與同伴交換。", // NEEDS QC
	},
	windpower: {
		name: "風力發電",
		desc: "該寶可夢受到風類招式攻擊時，或己方發動順風時，獲得充電的效果。", // NEEDS QC
		shortDesc: "受到風類招式或順風發動時，進入充電狀態。", // NEEDS QC

		start: "#electromorphosis",
	},
	windrider: {
		name: "乘風",
		desc: "該寶可夢不受風類招式影響，且被風類招式擊中時或己方發動順風時，攻擊提高1級。", // NEEDS QC
		shortDesc: "免疫風類招式且攻擊+1。順風發動時也觸發。", // NEEDS QC
	},
	wonderguard: {
		name: "神奇守護",
		shortDesc: "只會受到效果絕佳的招式和間接傷害。", // NEEDS QC
		gen4: {
			shortDesc: "只受到火焰牙、效果絕佳的招式和間接傷害。", // NEEDS QC
		},
		gen3: {
			shortDesc: "只受到效果絕佳的招式和間接傷害。", // NEEDS QC
		},
	},
	wonderskin: {
		name: "奇跡皮膚",
		// Official flavor text: "不易受到變化類招式 攻擊的身體。"
		desc: "以該寶可夢為目標、需要進行命中判定的變化招式，命中率變為50%。此效果在其他改變命中率的效果之前適用。", // NEEDS QC
		shortDesc: "需要命中判定的變化招式對自己命中率變為50%。", // NEEDS QC
	},
	zenmode: {
		name: "達摩模式",
		// Official flavor text: "ＨＰ變為一半以下時， 樣子會改變。"
		desc: "若該寶可夢是達摩狒狒（包括伽勒爾的樣子），回合結束時HP為最大HP的1/2或以下時，變為達摩模式。回合結束時HP高於最大HP的1/2時，變回普通模式。", // NEEDS QC
		shortDesc: "達摩狒狒HP為1/2以下時變為達摩模式。", // NEEDS QC
		gen7: {
			desc: "該寶可夢是達摩狒狒時，回合結束時HP為一半以下則變為達摩模式。回合結束時HP超過一半則變回普通模式。", // NEEDS QC
		},
		gen6: {
			desc: "該寶可夢是達摩狒狒時，回合結束時HP為一半以下則變為達摩模式。回合結束時HP超過一半則變回普通模式。在達摩模式中失去此特性時，立即變回普通模式。", // NEEDS QC
		},

		transform: "達摩模式，啟動！",
		transformEnd: "達摩模式，解除！",
	},
	zerotohero: {
		name: "全能變身",
		shortDesc: "海豚俠（平凡形態）交換下場後變為全能形態。", // NEEDS QC; 平凡形態/全能形態 via Bulbapedia

		activate: "  {POKEMON}在變身之後回來了！",
	},

	// CAP
	mountaineer: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "出場回合不受岩石屬性招式和隱形岩影響。", // NEEDS QC
	},
	rebound: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "出場時，該寶可夢可以反彈一部分變化招式，將其反用於原使用者。", // NEEDS QC
		shortDesc: "出場回合可反彈一部分變化招式。", // NEEDS QC

		move: "#magiccoat",
	},
	persistent: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "由該寶可夢發動的重力、回復封鎖、魔法空間、神祕守護、順風、戲法空間、奇妙空間的效果時間延長2回合。", // NEEDS QC
		shortDesc: "重力和各種空間等效果延長2回合。", // NEEDS QC

		activate: "  {POKEMON}將{MOVE}延長了2回合！", // NEEDS QC
	},
};
