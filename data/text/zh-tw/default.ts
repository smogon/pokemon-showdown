export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "{TRAINER1}與{TRAINER2}的對戰開始了！", // NEEDS QC
		winBattle: "**{TRAINER}**在對戰中獲勝了！", // NEEDS QC
		tieBattle: "{TRAINER1}與{TRAINER2}打成了平手！", // NEEDS QC

		pokemon: "{NICKNAME}",
		opposingPokemon: "對手的{NICKNAME}",
		team: "我方",
		opposingTeam: "對手",
		party: "我方的寶可夢",
		opposingParty: "對手的寶可夢",

		turn: "== 第{NUMBER}回合 ==", // NEEDS QC
		switchIn: "{TRAINER}派出了{FULLNAME}！",
		switchInOwn: "上吧！{FULLNAME}！",
		switchOut: "{TRAINER}換下了{NICKNAME}！",
		switchOutOwn: "{NICKNAME}，回來！",
		drag: "{FULLNAME}被拖出來戰鬥了！",
		faint: "{POKEMON}倒下了！",
		swap: "{POKEMON}和{TARGET}互換了位置！",
		swapCenter: "{POKEMON}移動到了中間！",

		// Multi Battles only
		canDynamax: "  {TRAINER}能夠極巨化了！",
		canDynamaxOwn: "  {TRAINER}周圍聚集了極巨力！",

		zEffect: "  {POKEMON}釋放了全力的Ｚ招式！",
		move: "{POKEMON}使出了**{MOVE}**！",
		abilityActivation: "[{POKEMON}的{ABILITY}]",

		mega: "  {POKEMON}的{ITEM}和{TRAINER}的鑰石起了反應！",
		megaNoItem: "  {TRAINER}的鑰石和{POKEMON}起了反應！",
		megaGen6: "  {POKEMON}的{ITEM}和{TRAINER}的超級手鐲產生了反應！",
		transformMega: "{POKEMON}超級進化成了超級{SPECIES}！",
		primal: "{POKEMON}的原始回歸！回到了原始的樣子！",
		zPower: "  {POKEMON}讓Ｚ力量籠罩了全身！",
		zBroken: "  {POKEMON}沒能防住攻擊，受到了傷害！",
		terastallize: "  ({POKEMON}太晶化成了{TYPE}屬性！)", // NEEDS QC

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "{POKEMON}無法使用{MOVE}！",
		cantNoMove: "{POKEMON}動彈不得！", // NEEDS QC
		fail: "  但是，沒有效果！！",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "{POKEMON}的樣子發生了變化！",
		typeChange: "  {POKEMON}變成了{TYPE}屬性！",
		typeChangeFromEffect: "  {POKEMON}變成了{TYPE}屬性！",
		typeAdd: "  {POKEMON}增加了{TYPE}屬性！",

		start: "  ({POKEMON}的{EFFECT}效果發動了！)", // NEEDS QC
		end: "  {POKEMON}擺脫了{EFFECT}的束縛！",
		activate: "  ({EFFECT}發動了！)", // NEEDS QC
		startTeamEffect: "  ({TEAM}的{EFFECT}效果發動了！)", // NEEDS QC
		endTeamEffect: "  ({TEAM}的{EFFECT}效果消失了！)", // NEEDS QC
		startFieldEffect: "  ({EFFECT}的效果發動了！)", // NEEDS QC
		endFieldEffect: "  ({EFFECT}的效果消失了！)", // NEEDS QC

		changeAbility: "  {POKEMON}的特性變成{ABILITY}了！",
		addItem: "  {POKEMON}獲得了{ITEM}！",
		takeItem: "  {POKEMON}從{SOURCE}那裡奪取了{ITEM}！",
		eatItem: "  ({POKEMON}吃了{ITEM}！)", // NEEDS QC
		useGem: "  {ITEM}加強了{MOVE}的威力！",
		eatItemWeaken: "  {ITEM}減輕了對{POKEMON}造成的傷害！",
		removeItem: "  {POKEMON}失去了{ITEM}！", // NEEDS QC
		activateItem: "  ({POKEMON}使用了{ITEM}！)", // NEEDS QC
		activateWeaken: "  {ITEM}減輕了對{POKEMON}造成的傷害！",

		damage: "  ({POKEMON}受到了傷害！)",
		damagePercentage: "  ({POKEMON}失去了{PERCENTAGE}%的體力！)", // NEEDS QC
		damageFromPokemon: "  {POKEMON}因{SOURCE}的{ITEM}而受到了傷害！",
		damageFromItem: "  {POKEMON}因{ITEM}而受到了傷害！",
		damageFromPartialTrapping: "  {POKEMON}受到了{MOVE}的傷害。",
		heal: "  {POKEMON}的體力回復了！",
		healFromZEffect: "  因為Ｚ力量，{POKEMON}回復了體力！",
		healFromEffect: "  {POKEMON}用{EFFECT}回復了體力！",

		boost: "  {POKEMON}的{STAT}提高了！",
		boost2: "  {POKEMON}的{STAT}大幅提高了！",
		boost3: "  {POKEMON}的{STAT}極大幅提高了！",
		boost0: "  {POKEMON}的{STAT}已經無法再提高了！",
		boostFromItem: "  {POKEMON}用{ITEM}提高了{STAT}！",
		boost2FromItem: "  {POKEMON}用{ITEM}大幅提高了{STAT}！",
		boost3FromItem: "  {POKEMON}用{ITEM}極大幅提高了{STAT}！",
		boostFromZEffect: "  因為Ｚ力量，{POKEMON}的{STAT}提高了！",
		boost2FromZEffect: "  因為Ｚ力量，{POKEMON}的{STAT}大幅提高了！",
		boost3FromZEffect: "  因為Ｚ力量，{POKEMON}的{STAT}極大幅提高了！",
		boostMultipleFromZEffect: "  因為Ｚ力量，{POKEMON}的能力提高了！",

		unboost: "  {POKEMON}的{STAT}降低了！",
		unboost2: "  {POKEMON}的{STAT}大幅降低了！",
		unboost3: "  {POKEMON}的{STAT}極大幅降低了！",
		unboost0: "  {POKEMON}的{STAT}已經無法再降低了！",
		unboostFromItem: "  {ITEM}降低了{POKEMON}的{STAT}！", // NEEDS QC
		unboost2FromItem: "  {ITEM}大幅降低了{POKEMON}的{STAT}！", // NEEDS QC
		unboost3FromItem: "  {ITEM}極大幅降低了{POKEMON}的{STAT}！", // NEEDS QC

		swapBoost: "  {POKEMON}和對手互換了自身的能力變化！",
		swapOffensiveBoost: "  {POKEMON}和對手互換了自身的攻擊和特攻的能力變化！",
		swapDefensiveBoost: "  {POKEMON}和對手互換了自身的防禦和特防的能力變化！",
		copyBoost: "  {POKEMON}複製了{TARGET}的能力變化！",
		clearBoost: "  {POKEMON}的能力變化解除了！",
		clearBoostFromZEffect: "  因為Ｚ力量，{POKEMON}降低的能力恢復了！",
		invertBoost: "  {POKEMON}的能力變化顛倒過來了！",
		clearAllBoost: "  所有能力都復原了！",

		superEffective: "  效果絕佳！",
		superEffectiveSpread: "  對{POKEMON}效果絕佳！",
		resisted: "  效果不好。",
		resistedSpread: "  對{POKEMON}效果不好。",
		// this is official text meaning 4x effective. do not QC this
		extremelyEffective: "  效果無比絕佳！！",
		extremelyEffectiveSpread: "  對{POKEMON}效果無比絕佳！！",
		// this is official text meaning 1/4x effective. do not QC this
		mostlyIneffective: "  效果相當不好。",
		mostlyIneffectiveSpread: "  對{POKEMON}效果相當不好。",
		crit: "  擊中了要害！",
		critSpread: "  擊中了{POKEMON}的要害！",
		immune: "  對於{POKEMON}，好像沒有效果……",
		immuneNoPokemon: "  但是，沒有效果！",
		immuneOHKO: "  對於{POKEMON}完全沒有效果！",
		miss: "  沒有擊中{POKEMON}！",
		missNoPokemon: "  但是{SOURCE}的攻擊沒有擊中！", // NEEDS QC

		center: "  復位移動！！",
		noTarget: "  但是沒有攻擊對象……", // NEEDS QC
		ohko: "  一擊必殺！",
		combine: "  兩個招式合而為一！這是合體招式！",
		hitCount: "  擊中了{NUMBER}次！",
	},
	ui: {
		whatDo: "**{POKEMON}**要怎麼做？", // NEEDS QC
		moveTarget: "{POKEMON}要對哪裡使用**{MOVE}**？", // NEEDS QC
		reviveWho: "**{POKEMON}**要復活誰？", // NEEDS QC
		replaceWho: "讓誰來替換**{POKEMON}**？", // NEEDS QC
		teamStart: "要如何開始對戰？", // NEEDS QC
		teamRest: "剩餘寶可夢的出場順序？", // NEEDS QC
		chooseLead: "選擇首發", // NEEDS QC
		chooseSlot: "選擇第{NUMBER}位", // NEEDS QC
		teamSoFar: "已選擇", // NEEDS QC
		waitingOpponent: "等待對手中……", // NEEDS QC
		cantSwitchTrapped: "你被**困住**了，無法更換！", // NEEDS QC
		usuallyMovesFirst: "通常先制行動（優先度+{PRIORITY}）。", // NEEDS QC
		almostAlwaysMovesFirst: "幾乎總是先制行動（優先度+{PRIORITY}）。", // NEEDS QC
		almostAlwaysMovesLast: "幾乎總是最後行動（優先度−{PRIORITY}）。", // NEEDS QC
		failsIfHP: "當前HP為{HP}時會失敗。", // NEEDS QC
		koSelfIfHP: "當前HP恰好為{HP}時會使自己瀕死。", // NEEDS QC
		transformedInto: "（變身為{SPECIES}）", // NEEDS QC
		changedForme: "（形態變化：{SPECIES}）", // NEEDS QC
		possibleIllusion: "可能是幻覺#{NUMBER}", // NEEDS QC
		pixels: "（{HP}/{MAXHP}像素）", // NEEDS QC
		wouldTakeIfAbilityRemoved: "若無特性將受到：{PERCENT}%", // NEEDS QC
		nextDamage: "下次傷害：{PERCENT}%", // NEEDS QC
		turnsAsleep: "已睡眠回合數：{NUMBER}", // NEEDS QC
		illusionWarning: "（擁有5個以上招式通常意味著索羅亞克或索羅亞的幻覺。）", // NEEDS QC
		pressureGen3Warning: "（第三世代中壓迫感不可見，因此某些情況下無法準確得知已消耗的PP。）", // NEEDS QC
		indistinguishableWarning: "（對手有兩隻無法區分的寶可夢，因此無法判斷哪隻擁有哪些招式、特性和道具。）", // NEEDS QC
		noConditions: "（無場地狀態）", // NEEDS QC
		turn: "（{NUMBER}回合）", // NEEDS QC
		turns: "（{NUMBER}回合）", // NEEDS QC
		afterStatModifiers: "（能力修正後：）", // NEEDS QC
		calls: "使用{MOVE}", // NEEDS QC
		base: "（原為{VALUE}）", // NEEDS QC
		zEffectClearNegativeBoost: "恢復降低的能力等級", // NEEDS QC
		zEffectCrit2: "擊中要害率+2", // NEEDS QC
		zEffectHeal: "回復全部HP", // NEEDS QC
		zEffectCurse: "幽靈屬性則回復全部HP，否則攻擊+1", // NEEDS QC
		zEffectRedirect: "將對手的攻擊引導至自己", // NEEDS QC
		zEffectHealReplacement: "回復替換上場寶可夢的全部HP", // NEEDS QC
		ppRange: "（{LOW}～{HIGH}）", // NEEDS QC
		revealed: "（已知）", // NEEDS QC
		range: "{LOW}～{HIGH}", // NEEDS QC
		beforeStatStages: "（能力等級變化前）", // NEEDS QC
		beforeExternalModifiers: "（外部修正前）", // NEEDS QC
		flingBerry: "對目標發動樹果的效果。", // NEEDS QC
		flingWhiteHerb: "恢復目標降低的能力等級。", // NEEDS QC
		flingMentalHerb: "解除目標的迷人、定身法、再來一次、回復封鎖、挑釁、無理取鬧效果。", // NEEDS QC
		cantFling: "此道具無法用投擲丟出。", // NEEDS QC
		unobtainableInGen: "第{NUMBER}世代無法獲得", // NEEDS QC
		tagMoves: "{TAG}招式", // NEEDS QC
		notifyMoveTitle: "輪到你出招了！", // NEEDS QC
		notifyMove: "在對戰中選擇招式", // NEEDS QC
		notifyMoveAgainst: "在與{OPPONENT}的對戰中選擇招式", // NEEDS QC
		notifySwitchTitle: "輪到你替換了！", // NEEDS QC
		notifySwitch: "在對戰中選擇替換的寶可夢", // NEEDS QC
		notifySwitchAgainst: "在與{OPPONENT}的對戰中選擇替換的寶可夢", // NEEDS QC
		notifyTeamTitle: "隊伍預覽！", // NEEDS QC
		notifyTeam: "在對戰中選擇隊伍順序", // NEEDS QC
		notifyTeamAgainst: "在與{OPPONENT}的對戰中選擇隊伍順序", // NEEDS QC
		mightBeDisabled: "部分招式**可能**已無法使用，因此無法取消招式選擇！", // NEEDS QC
		mightBeLocked: "你**可能**被鎖定在某個招式上。", // NEEDS QC
		lockedExplanation: "（若被鎖定，將無法替換）", // NEEDS QC
		mightBeTrapped: "你**可能**無法脫身，因此無法取消替換！", // NEEDS QC
		autoChoice: "自動選擇", // NEEDS QC
		unrecognizedChoice: "來自伺服器的未知選擇：", // NEEDS QC
		lockedIntoMove: "{POKEMON}被鎖定在某個招式上。", // NEEDS QC
		willUseMove: "{POKEMON}將{ACTIONS}{AT}使用**{MOVE}**。", // NEEDS QC
		atTarget: "對{TARGET}", // NEEDS QC
		atSlot: "對第{NUMBER}位", // NEEDS QC
		atAllyTarget: "對我方{TARGET}", // NEEDS QC
		atAllySlot: "對我方第{NUMBER}位", // NEEDS QC
		actionMegaEvolve: "**超級進化**並", // NEEDS QC
		actionMegaEvolveX: "**超級進化**（X）並", // NEEDS QC
		actionMegaEvolveY: "**超級進化**（Y）並", // NEEDS QC
		actionUltraBurst: "**究極爆發**並", // NEEDS QC
		actionTerastallize: "太晶化（**{TYPE}**）並", // NEEDS QC
		actionDynamax: "**極巨化**並", // NEEDS QC
		actionGigantamax: "**超極巨化**並", // NEEDS QC
		willRevive: "{POKEMON}將復活**{TARGET}**。", // NEEDS QC
		willSwitch: "{POKEMON}將替換為**{TARGET}**。", // NEEDS QC
		willShift: "{POKEMON}將**移動**到中央。", // NEEDS QC
		youPicked: "你選擇了{POKEMON}。", // NEEDS QC
		listComma: "、", // NEEDS QC
		effectivenessVs: "對{POKEMON}{EFFECT}", // NEEDS QC
		basePowerVs: "對{POKEMON}的{LABEL}", // NEEDS QC
		or: "或", // NEEDS QC
	},

	// statuses
	brn: {
		start: "  {POKEMON}被灼傷了！",
		startFromItem: "  {POKEMON}因{ITEM}而被灼傷了！",
		alreadyStarted: "  {POKEMON}已經被灼傷了。",
		end: "  {POKEMON}的灼傷痊癒了！",
		endFromItem: "  {POKEMON}用{ITEM}治癒了灼傷！",
		damage: "  {POKEMON}受到了灼傷的傷害！",
	},
	frz: {
		start: "  {POKEMON}凍住了！",
		alreadyStarted: "  {POKEMON}已經凍住了。",
		end: "  {POKEMON}的冰凍融化了！",
		endFromItem: "  {POKEMON}用{ITEM}治癒了冰凍狀態！",
		endFromMove: "  {POKEMON}的{MOVE}讓冰凍融化了！",
		cant: "{POKEMON}因凍住了而無法行動！",
	},
	par: {
		start: "  {POKEMON}麻痺了，不易使出招式！",
		alreadyStarted: "  {POKEMON}已經麻痺了。",
		end: "  {POKEMON}的麻痺解除了！",
		endFromItem: "  {POKEMON}用{ITEM}治癒了麻痺！",
		cant: "{POKEMON}因身體麻痺而無法行動！",
	},
	psn: {
		start: "  {POKEMON}中毒了！",
		alreadyStarted: "  {POKEMON}已經中毒了。",
		end: "  {POKEMON}中的毒徹底清除了！",
		endFromItem: "  {POKEMON}用{ITEM}治癒了中毒！",
		damage: "  {POKEMON}受到了毒的傷害！",
	},
	tox: {
		start: "  {POKEMON}中劇毒了！",
		startFromItem: "  {POKEMON}因{ITEM}而中劇毒了！",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  {POKEMON}睡著了！",
		startFromRest: "  {POKEMON}睡著了，變得精力充沛！",
		alreadyStarted: "  {POKEMON}已經睡著了。",
		end: "  {POKEMON}醒過來了！",
		endFromItem: "  {POKEMON}用{ITEM}讓自己醒過來了！",
		cant: "{POKEMON}正在呼呼大睡。",
	},

	// misc effects
	confusion: {
		start: "  {POKEMON}混亂了！",
		startFromFatigue: "  {POKEMON}因精疲力盡而混亂了！",
		end: "  {POKEMON}的混亂解除了！",
		endFromItem: "  {POKEMON}用{ITEM}治癒了混亂！",
		alreadyStarted: "  {POKEMON}已經混亂了。",
		activate: "  {POKEMON}正在混亂中！",
		damage: "不知所以地攻擊了自己！",
	},
	drain: {
		heal: "  從{SOURCE}那裡吸取了體力！",
	},
	flinch: {
		cant: "{POKEMON}畏縮了，無法使出招式！",
	},
	heal: {
		fail: "  但是，{POKEMON}的體力是全滿的！",
	},
	healreplacement: {
		activate: "  因為Ｚ力量，{POKEMON}將會回復替換上場的寶可夢的體力！",
	},
	nopp: {
		cant: "{POKEMON}使出了**{MOVE}**！\n  但是，招式的點數已經用完了！",
	},
	recharge: {
		cant: "{POKEMON}因攻擊的反作用力而無法動彈！",
	},
	recoil: {
		damage: "  {POKEMON}受到了反作用力造成的傷害！",
	},
	unboost: {
		fail: "  無法降低{POKEMON}的{STAT}！", // per-stat form; SV zh-Hant_common:6483 / Champions btl_set RankdownFail_ATK
		failNoStat: "  無法降低{POKEMON}的能力！", // SV zh-Hant_common:6479
	},
	struggle: {
		activate: "  {POKEMON}沒有可用來施展的招式！",
	},
	trapped: {
		start: "  {POKEMON}已經無法逃走了！",
	},
	dynamax: {
		start: "  ({POKEMON}極巨化了！)", // NEEDS QC
		end: "  ({POKEMON}恢復原樣了！)", // NEEDS QC
		block: "  被極巨化的力量彈開了！",
		fail: "  {POKEMON}搖了搖頭，好像無法使出這個招式……",
	},

	// weather
	sandstorm: {
		weatherName: "沙暴",
		start: "  開始刮沙暴了！",
		end: "  沙暴停止了！",
		upkeep: "  (沙暴肆虐！)",
		damage: "  沙暴襲擊了{POKEMON}！",
	},
	sunnyday: {
		weatherName: "大晴天",
		start: "  日照變強了！",
		end: "  日照復原了！",
		upkeep: "  (日照很強。)", // NEEDS QC
	},
	raindance: {
		weatherName: "下雨",
		start: "  開始下雨了！",
		end: "  雨停了！",
		upkeep: "  (雨不停地下著。)", // NEEDS QC
	},
	hail: {
		weatherName: "冰雹",
		start: "  開始下冰雹了！",
		end: "  冰雹不下了！",
		upkeep: "  (冰雹漫天！)",
		damage: "  冰雹襲擊了{POKEMON}！",
	},
	snowscape: {
		weatherName: "下雪",
		start: "  開始下雪了！",
		end: "  雪不下了！",
		upkeep: "  (雪片漫天！)",
	},
	desolateland: {
		weatherName: "大日照",
		start: "  日照變得非常強！",
		end: "  日照復原了！",
		block: "  強日照勢頭不減！",
		blockMove: "  受強日照的影響，水屬性的攻擊被蒸發了！",
	},
	primordialsea: {
		weatherName: "大雨",
		start: "  開始下起了暴雨！",
		end: "  暴雨停了！",
		block: "  暴雨勢頭不減！",
		blockMove: "  受暴雨的影響，火屬性的攻擊被撲滅了！",
	},
	deltastream: {
		weatherName: "亂流",
		start: "  神秘的亂流保護著飛行屬性寶可夢！",
		end: "  神秘的亂流停止了！",
		activate: "  神秘的亂流減弱了攻擊！",
		block: "  神秘的亂流勢頭不減！",
	},

	// terrain
	electricterrain: {
		start: "  腳下電流飛閃！",
		end: "  腳下的電流消失了！",
		block: "  {POKEMON}正受到電氣場地的保護！",
	},
	grassyterrain: {
		start: "  腳下青草如茵！",
		end: "  腳下的青草消失不見了！",
		heal: "  {POKEMON}的體力回復了！",
	},
	mistyterrain: {
		start: "  腳下霧氣繚繞！",
		end: "  腳下的霧氣消失不見了！",
		block: "  {POKEMON}正受到薄霧場地的保護！",
	},
	psychicterrain: {
		start: "  腳下傳來了奇妙的感覺！",
		end: "  腳下的奇妙感覺消失了！",
		block: "  {POKEMON}正受到精神場地的保護！",
	},

	// field effects
	gravity: {
		start: "  重力變強了！",
		end: "  重力復原了！",
		cant: "{POKEMON}因重力太強而無法使出{MOVE}！",
		activate: "{POKEMON}因重力的影響而無法留在空中！",
	},
	magicroom: {
		start: "  憑空製造出了會讓攜帶的道具的效果消失的空間！",
		end: "  魔法空間被解除，道具的效果復原了！",
	},
	mudsport: {
		start: "  電氣的威力減弱了！",
		end: "  玩泥巴的效果消失了！",
	},
	trickroom: {
		start: "  {POKEMON}扭曲了時空！",
		end: "  扭曲的時空復原了！",
	},
	watersport: {
		start: "  火焰的威力減弱了！",
		end: "  玩水的效果消失了！",
	},
	wonderroom: {
		start: "  憑空製造出了互換防禦和特防的空間！",
		end: "  奇妙空間被解除，防禦和特防復原了！",
	},

	// misc
	crash: {
		damage: "  {POKEMON}因勢頭過猛而撞到了地面！",
	},
};
