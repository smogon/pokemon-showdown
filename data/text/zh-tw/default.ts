export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "[TRAINER]與[TRAINER]的對戰開始了！",
		winBattle: "**[TRAINER]**在對戰中獲勝了！",
		tieBattle: "[TRAINER]與[TRAINER]打成了平手！",

		pokemon: "[NICKNAME]",
		opposingPokemon: "對手的[NICKNAME]",
		team: "我方",
		opposingTeam: "對手",
		party: "我方的寶可夢",
		opposingParty: "對手的寶可夢",

		turn: "== [NUMBER]回合 ==",
		switchIn: "[TRAINER]派出了[FULLNAME]！",
		switchInOwn: "上吧！[FULLNAME]！",
		switchOut: "[TRAINER]換下了[NICKNAME]！",
		switchOutOwn: "[NICKNAME]，回來！",
		drag: "[FULLNAME]被拖出來戰鬥了！",
		faint: "[POKEMON]倒下了！",
		swap: "[POKEMON]和[TARGET]互換了位置！",
		swapCenter: "[POKEMON]移動到了中間！",

		// Multi Battles only
		canDynamax: "  [TRAINER]能夠極巨化了！",
		canDynamaxOwn: "  [TRAINER]周圍聚集了極巨力！",

		zEffect: "  [POKEMON]釋放了全力的Ｚ招式！",
		move: "[POKEMON]使出了**[MOVE]**！",
		abilityActivation: "[[POKEMON]的[ABILITY]]",

		mega: "  [POKEMON]的[ITEM]和[TRAINER]的鑰石起了反應！",
		megaNoItem: "  [TRAINER]的鑰石和[POKEMON]起了反應！",
		megaGen6: "  [POKEMON]的[ITEM]和[TRAINER]的超級手鐲產生了反應！",
		transformMega: "[POKEMON]超級進化成了超級[SPECIES]！",
		primal: "[POKEMON]的原始回歸！回到了原始的樣子！",
		zPower: "  [POKEMON]讓Ｚ力量籠罩了全身！",
		zBroken: "  [POKEMON]沒能防住攻擊，受到了傷害！",
		terastallize: "", // NEEDS TRANSLATION: Showdown custom text

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON]無法使用[MOVE]！",
		cantNoMove: "", // NEEDS TRANSLATION: predates Chinese support
		fail: "  但是，沒有效果！！",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "[POKEMON]的樣子發生了變化！",
		typeChange: "  [POKEMON]變成了[TYPE]屬性！",
		typeChangeFromEffect: "  [POKEMON]變成了[TYPE]屬性！",
		typeAdd: "  [POKEMON]增加了[TYPE]屬性！",

		start: "", // NEEDS TRANSLATION: Showdown custom text
		end: "  [POKEMON]擺脫了[EFFECT]的束縛！",
		activate: "", // NEEDS TRANSLATION: Showdown custom text
		startTeamEffect: "", // NEEDS TRANSLATION: Showdown custom text
		endTeamEffect: "", // NEEDS TRANSLATION: Showdown custom text
		startFieldEffect: "", // NEEDS TRANSLATION: Showdown custom text
		endFieldEffect: "", // NEEDS TRANSLATION: Showdown custom text

		changeAbility: "  [POKEMON]的特性變成[ABILITY]了！",
		addItem: "  [POKEMON]獲得了[ITEM]！",
		takeItem: "  [POKEMON]從[SOURCE]那裡奪取了[ITEM]！",
		eatItem: "", // NEEDS TRANSLATION: Showdown custom text
		useGem: "  [ITEM]加強了[MOVE]的威力！",
		eatItemWeaken: "  [ITEM]減輕了對[POKEMON]造成的傷害！",
		removeItem: "", // NEEDS TRANSLATION: Showdown custom text
		activateItem: "", // NEEDS TRANSLATION: Showdown custom text
		activateWeaken: "  [ITEM]減輕了對[POKEMON]造成的傷害！",

		damage: "  ([POKEMON]受到了傷害！)",
		damagePercentage: "", // NEEDS TRANSLATION: Showdown custom text
		damageFromPokemon: "  [POKEMON]因[SOURCE]的[ITEM]而受到了傷害！",
		damageFromItem: "  [POKEMON]因[ITEM]而受到了傷害！",
		damageFromPartialTrapping: "  [POKEMON]受到了[MOVE]的傷害。",
		heal: "  [POKEMON]的體力回復了！",
		healFromZEffect: "  因為Ｚ力量，[POKEMON]回復了體力！",
		healFromEffect: "  [POKEMON]用[EFFECT]回復了體力！",

		boost: "  [POKEMON]的[STAT]提高了！",
		boost2: "  [POKEMON]的[STAT]大幅提高了！",
		boost3: "  [POKEMON]的[STAT]極大幅提高了！",
		boost0: "  [POKEMON]的[STAT]已經無法再提高了！",
		boostFromItem: "  [POKEMON]用[ITEM]提高了[STAT]！",
		boost2FromItem: "  [POKEMON]用[ITEM]大幅提高了[STAT]！",
		boost3FromItem: "  [POKEMON]用[ITEM]極大幅提高了[STAT]！",
		boostFromZEffect: "  因為Ｚ力量，[POKEMON]的[STAT]提高了！",
		boost2FromZEffect: "  因為Ｚ力量，[POKEMON]的[STAT]大幅提高了！",
		boost3FromZEffect: "  因為Ｚ力量，[POKEMON]的[STAT]極大幅提高了！",
		boostMultipleFromZEffect: "  因為Ｚ力量，[POKEMON]的能力提高了！",

		unboost: "  [POKEMON]的[STAT]降低了！",
		unboost2: "  [POKEMON]的[STAT]大幅降低了！",
		unboost3: "  [POKEMON]的[STAT]極大幅降低了！",
		unboost0: "  [POKEMON]的[STAT]已經無法再降低了！",
		unboostFromItem: "", // NEEDS TRANSLATION: Showdown custom text
		unboost2FromItem: "", // NEEDS TRANSLATION: Showdown custom text
		unboost3FromItem: "", // NEEDS TRANSLATION: Showdown custom text

		swapBoost: "  [POKEMON]和對手互換了自身的能力變化！",
		swapOffensiveBoost: "  [POKEMON]和對手互換了自身的攻擊和特攻的能力變化！",
		swapDefensiveBoost: "  [POKEMON]和對手互換了自身的防禦和特防的能力變化！",
		copyBoost: "  [POKEMON]複製了[TARGET]的能力變化！",
		clearBoost: "  [POKEMON]的能力變化解除了！",
		clearBoostFromZEffect: "  因為Ｚ力量，[POKEMON]降低的能力恢復了！",
		invertBoost: "  [POKEMON]的能力變化顛倒過來了！",
		clearAllBoost: "  所有能力都復原了！",

		superEffective: "  效果絕佳！",
		superEffectiveSpread: "  對[POKEMON]效果絕佳！",
		resisted: "  效果不好。",
		resistedSpread: "  對[POKEMON]效果不好。",
		extremelyEffective: "  效果無比絕佳！！",
		extremelyEffectiveSpread: "  對[POKEMON]效果無比絕佳！！",
		mostlyIneffective: "  效果相當不好。",
		mostlyIneffectiveSpread: "  對[POKEMON]效果相當不好。",
		crit: "  擊中了要害！",
		critSpread: "  擊中了[POKEMON]的要害！",
		immune: "  對於[POKEMON]，好像沒有效果……",
		immuneNoPokemon: "  但是，沒有效果！",
		immuneOHKO: "  對於[POKEMON]完全沒有效果！",
		miss: "  沒有擊中[POKEMON]！",
		missNoPokemon: "", // NEEDS TRANSLATION: predates Chinese support

		center: "  復位移動！！",
		noTarget: "", // NEEDS TRANSLATION: predates Chinese support
		ohko: "  一擊必殺！",
		combine: "  兩個招式合而為一！這是合體招式！",
		hitCount: "  擊中了[NUMBER]次！",
	},

	// stats
	hp: {
		statName: "HP",
		statShortName: "HP",
	},
	atk: {
		statName: "攻擊",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	def: {
		statName: "防禦",
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
		statName: "閃避率",
	},
	spc: {
		statName: "特殊",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	stats: {
		statName: "狀態",
	},

	// statuses
	brn: {
		start: "  [POKEMON]被灼傷了！",
		startFromItem: "  [POKEMON]因[ITEM]而被灼傷了！",
		alreadyStarted: "  [POKEMON]已經被灼傷了。",
		end: "  [POKEMON]的灼傷痊癒了！",
		endFromItem: "  [POKEMON]用[ITEM]治癒了灼傷！",
		damage: "  [POKEMON]受到了灼傷的傷害！",
	},
	frz: {
		start: "  [POKEMON]凍住了！",
		alreadyStarted: "  [POKEMON]已經凍住了。",
		end: "  [POKEMON]的冰凍融化了！",
		endFromItem: "  [POKEMON]用[ITEM]治癒了冰凍狀態！",
		endFromMove: "  [POKEMON]的[MOVE]讓冰凍融化了！",
		cant: "[POKEMON]因凍住了而無法行動！",
	},
	par: {
		start: "  [POKEMON]麻痺了，不易使出招式！",
		alreadyStarted: "  [POKEMON]已經麻痺了。",
		end: "  [POKEMON]的麻痺解除了！",
		endFromItem: "  [POKEMON]用[ITEM]治癒了麻痺！",
		cant: "[POKEMON]因身體麻痺而無法行動！",
	},
	psn: {
		start: "  [POKEMON]中毒了！",
		alreadyStarted: "  [POKEMON]已經中毒了。",
		end: "  [POKEMON]中的毒徹底清除了！",
		endFromItem: "  [POKEMON]用[ITEM]治癒了中毒！",
		damage: "  [POKEMON]受到了毒的傷害！",
	},
	tox: {
		start: "  [POKEMON]中劇毒了！",
		startFromItem: "  [POKEMON]因[ITEM]而中劇毒了！",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  [POKEMON]睡著了！",
		startFromRest: "  [POKEMON]睡著了，變得精力充沛！",
		alreadyStarted: "  [POKEMON]已經睡著了。",
		end: "  [POKEMON]醒過來了！",
		endFromItem: "  [POKEMON]用[ITEM]讓自己醒過來了！",
		cant: "[POKEMON]正在呼呼大睡。",
	},

	// misc effects
	confusion: {
		start: "  [POKEMON]混亂了！",
		startFromFatigue: "  [POKEMON]因精疲力盡而混亂了！",
		end: "  [POKEMON]的混亂解除了！",
		endFromItem: "  [POKEMON]用[ITEM]治癒了混亂！",
		alreadyStarted: "  [POKEMON]已經混亂了。",
		activate: "  [POKEMON]正在混亂中！",
		damage: "不知所以地攻擊了自己！",
	},
	drain: {
		heal: "  從[SOURCE]那裡吸取了體力！",
	},
	flinch: {
		cant: "[POKEMON]畏縮了，無法使出招式！",
	},
	heal: {
		fail: "  但是，[POKEMON]的體力是全滿的！",
	},
	healreplacement: {
		activate: "  因為Ｚ力量，[POKEMON]將會回復替換上場的寶可夢的體力！",
	},
	nopp: {
		cant: "[POKEMON]使出了**[MOVE]**！\n  但是，招式的點數 已經用完了！",
	},
	recharge: {
		cant: "[POKEMON]因攻擊的反作用力而無法動彈！",
	},
	recoil: {
		damage: "  [POKEMON]受到了反作用力造成的傷害！",
	},
	unboost: {
		fail: "  無法降低[POKEMON]的能力！",
	},
	struggle: {
		activate: "  [POKEMON]沒有可用來施展的招式！",
	},
	trapped: {
		start: "  [POKEMON]已經無法逃走了！",
	},
	dynamax: {
		start: "", // NEEDS TRANSLATION: Showdown custom text
		end: "", // NEEDS TRANSLATION: Showdown custom text
		block: "  被極巨化的力量彈開了！",
		fail: "  [POKEMON]搖了搖頭，好像無法使出這個招式……",
	},

	// weather
	sandstorm: {
		weatherName: "沙暴狀態",
		start: "  開始刮沙暴了！",
		end: "  沙暴停止了！",
		upkeep: "  (沙暴肆虐！)",
		damage: "  沙暴襲擊了[POKEMON]！",
	},
	sunnyday: {
		weatherName: "大晴天狀態",
		start: "  日照變強了！",
		end: "  日照復原了！",
		upkeep: "", // NEEDS TRANSLATION: predates Chinese support
	},
	raindance: {
		weatherName: "下雨狀態",
		start: "  開始下雨了！",
		end: "  雨停了！",
		upkeep: "", // NEEDS TRANSLATION: predates Chinese support
	},
	hail: {
		weatherName: "冰雹",
		start: "  開始下冰雹了！",
		end: "  冰雹不下了！",
		upkeep: "  (冰雹漫天！)",
		damage: "  冰雹襲擊了[POKEMON]！",
	},
	snowscape: {
		weatherName: "下雪狀態",
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
		block: "  [POKEMON]正受到電氣場地的保護！",
	},
	grassyterrain: {
		start: "  腳下青草如茵！",
		end: "  腳下的青草消失不見了！",
		heal: "  [POKEMON]的體力回復了！",
	},
	mistyterrain: {
		start: "  腳下霧氣繚繞！",
		end: "  腳下的霧氣消失不見了！",
		block: "  [POKEMON]正受到薄霧場地的保護！",
	},
	psychicterrain: {
		start: "  腳下傳來了奇妙的感覺！",
		end: "  腳下的奇妙感覺消失了！",
		block: "  [POKEMON]正受到精神場地的保護！",
	},

	// field effects
	gravity: {
		start: "  重力變強了！",
		end: "  重力復原了！",
		cant: "[POKEMON]因重力太強而無法使出[MOVE]！",
		activate: "[POKEMON]因重力的影響而無法留在空中！",
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
		start: "  [POKEMON]扭曲了時空！",
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
		damage: "  [POKEMON]因勢頭過猛而撞到了地面！",
	},
};
