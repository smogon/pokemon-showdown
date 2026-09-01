export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "{TRAINER1:conjunctive} {TRAINER2}의 배틀이 시작되었다!", // NEEDS QC
		winBattle: "**{TRAINER}**의 승리다!", // NEEDS QC
		tieBattle: "{TRAINER1:conjunctive} {TRAINER2}의 배틀은 무승부다!", // NEEDS QC

		pokemon: "{NICKNAME}",
		opposingPokemon: "상대 {NICKNAME}",
		team: "우리 편",
		opposingTeam: "상대",
		party: "같은 편 포켓몬",
		opposingParty: "상대의 포켓몬",

		turn: "== {NUMBER}턴째 ==", // NEEDS QC
		switchIn: "{TRAINER:topic} {FULLNAME:object} 내보냈다!",
		switchInOwn: "가랏! {FULLNAME}!",
		switchOut: "{TRAINER:topic} {NICKNAME:object} 넣어 버렸다!",
		switchOutOwn: "{NICKNAME} 돌아와!",
		drag: "{FULLNAME:topic} 배틀에 끌려 나왔다!",
		faint: "{POKEMON:topic} 쓰러졌다!",
		swap: "{POKEMON:conjunctive} {TARGET:topic} 자리를 바꿨다!",
		swapCenter: "{POKEMON:topic} 중앙으로 이동했다!",

		// Multi Battles only
		canDynamax: "  {TRAINER:topic} 다이맥스를 사용할 수 있게 됐다!",
		canDynamaxOwn: "  {TRAINER}에게 다이맥스 파워가 모였다!",

		zEffect: "  {POKEMON:subject} 뿜어내는 전력의 Z기술!",
		move: "{POKEMON}의 **{MOVE}**!",
		abilityActivation: "[{POKEMON}의 {ABILITY}]",

		mega: "  {POKEMON}의 {ITEM:conjunctive} {TRAINER}의 키스톤이 반응했다!",
		megaNoItem: "  {TRAINER}의 키스톤과 {POKEMON:subject} 반응했다!",
		megaGen6: "  {POKEMON}의 {ITEM:conjunctive} {TRAINER}의 메가뱅글이 반응했다!",
		transformMega: "{POKEMON:topic} 메가{SPECIES:directional} 메가진화했다!",
		primal: "{POKEMON}의 원시회귀! 원시의 모습으로 돌아갔다!",
		zPower: "  {POKEMON:topic} Z파워에 몸이 둘러싸였다!",
		zBroken: "  {POKEMON:topic} 공격을 막아 내지 못하고 데미지를 입었다!",
		terastallize: "  ({POKEMON:topic} {TYPE}타입으로 테라스탈했다!)", // NEEDS QC

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "{POKEMON:topic} {MOVE:object} 쓸 수 없다!",
		cantNoMove: "{POKEMON:topic} 움직일 수 없다!", // NEEDS QC
		fail: "  그러나 실패하고 말았다!!",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "{POKEMON}의 모습이 변화했다!",
		typeChange: "  {POKEMON:topic} {TYPE}타입이 됐다!",
		typeChangeFromEffect: "  {POKEMON}의 {EFFECT} 때문에 {TYPE}타입이 되었다!", // NEEDS QC: possessive 의 per official 때문에-lines
		typeAdd: "  {POKEMON}에게 {TYPE}타입이 추가되었다!",

		start: "  ({POKEMON}에게 {EFFECT}의 효과가 발생했다!)", // NEEDS QC
		end: "  {POKEMON:topic} {EFFECT:directional}부터 풀려났다!",
		activate: "  ({EFFECT:subject} 발동했다!)", // NEEDS QC
		startTeamEffect: "  ({TEAM}에게 {EFFECT}의 효과가 발생했다!)", // NEEDS QC
		endTeamEffect: "  ({TEAM}의 {EFFECT} 효과가 없어졌다!)", // NEEDS QC
		startFieldEffect: "  ({EFFECT}의 효과가 발생했다!)", // NEEDS QC
		endFieldEffect: "  ({EFFECT}의 효과가 없어졌다!)", // NEEDS QC

		changeAbility: "  {POKEMON:topic} {ABILITY:subject} 되었다!",
		addItem: "  {POKEMON:topic} {ITEM:object} 손에 넣었다!",
		takeItem: "  {POKEMON:topic} {SOURCE:directional}부터 {ITEM:object} 빼앗았다!",
		eatItem: "  ({POKEMON:topic} {ITEM:object} 먹었다!)", // NEEDS QC
		useGem: "  {ITEM:topic} {MOVE}의 위력을 강하게 했다!",
		eatItemWeaken: "  {POKEMON:subject} 입는 데미지를 {ITEM:subject} 약하게 했다!",
		removeItem: "  {POKEMON:topic} {ITEM:object} 잃었다!", // NEEDS QC
		activateItem: "  ({POKEMON:topic} {ITEM:object} 사용했다!)", // NEEDS QC
		activateWeaken: "  {POKEMON:subject} 입는 데미지를 {ITEM:subject} 약하게 했다!",

		damage: "  ({POKEMON:topic} 데미지를 입었다!)",
		damagePercentage: "  ({POKEMON:topic} 체력의 {PERCENTAGE}%를 잃었다!)", // NEEDS QC
		damageFromPokemon: "  {POKEMON:topic} {SOURCE}의 {ITEM} 때문에 데미지를 입었다!",
		damageFromItem: "  {POKEMON:topic} {ITEM} 때문에 데미지를 입었다!",
		damageFromPartialTrapping: "  {POKEMON:topic} {MOVE}의 데미지를 입고 있다.",
		heal: "  {POKEMON}의 체력이 회복되었다!",
		healFromZEffect: "  {POKEMON:topic} Z파워로 체력을 회복했다!",
		healFromEffect: "  {POKEMON:topic} {EFFECT:directional} 인해 회복했다!", // NEEDS QC: PS-authored; particle structure per SV ko_common:7447

		boost: "  {POKEMON}의 {STAT:subject} 올라갔다!",
		boost2: "  {POKEMON}의 {STAT:subject} 크게 올라갔다!",
		boost3: "  {POKEMON}의 {STAT:subject} 매우 크게 올라갔다!",
		boost0: "  {POKEMON}의 {STAT:topic} 더 올라가지 않는다!",
		boostFromItem: "  {POKEMON:topic} {ITEM:directional} {STAT:subject} 올라갔다!", // NEEDS QC: structure per SM ko_common:8030
		boost2FromItem: "  {POKEMON:topic} {ITEM:directional} {STAT:subject} 크게 올라갔다!", // NEEDS QC: structure per SM ko_common:8030
		boost3FromItem: "  {POKEMON:topic} {ITEM:directional} {STAT:subject} 매우 크게 올라갔다!", // NEEDS QC: structure per SM ko_common:8030; literal 로 dropped — :directional emits 으로/로
		boostFromZEffect: "  {POKEMON:topic} Z파워로 {STAT:subject} 올라갔다!",
		boost2FromZEffect: "  {POKEMON:topic} Z파워로 {STAT:subject} 크게 올라갔다!",
		boost3FromZEffect: "  {POKEMON:topic} Z파워로 {STAT:subject} 매우 크게 올라갔다!",
		boostMultipleFromZEffect: "  {POKEMON:topic} Z파워로 능력이 올라갔다!",

		unboost: "  {POKEMON}의 {STAT:subject} 떨어졌다!",
		unboost2: "  {POKEMON}의 {STAT:subject} 크게 떨어졌다!",
		unboost3: "  {POKEMON}의 {STAT:subject} 매우 크게 떨어졌다!",
		unboost0: "  {POKEMON}의 {STAT:topic} 더 떨어지지 않는다!",
		unboostFromItem: "  {POKEMON:topic} {ITEM:directional} {STAT:subject} 떨어졌다!", // NEEDS QC
		unboost2FromItem: "  {POKEMON:topic} {ITEM:directional} {STAT:subject} 크게 떨어졌다!", // NEEDS QC
		unboost3FromItem: "  {POKEMON:topic} {ITEM:directional} {STAT:subject} 매우 크게 떨어졌다!", // NEEDS QC

		swapBoost: "  {POKEMON:topic} 상대와 자신의 능력 변화를 바꿨다!",
		swapOffensiveBoost: "  {POKEMON:topic} 상대와 자신의 공격과 특수공격의 능력 변화를 바꿨다!",
		swapDefensiveBoost: "  {POKEMON:topic} 상대와 자신의 방어와 특수방어의 능력 변화를 바꿨다!",
		copyBoost: "  {POKEMON:topic} {TARGET}의 능력 변화를 복사했다!",
		clearBoost: "  {POKEMON}의 능력 변화가 원래대로 되돌아왔다!",
		clearBoostFromZEffect: "  {POKEMON:topic} Z파워로 떨어진 능력을 원래대로 되돌렸다!",
		invertBoost: "  {POKEMON:topic} 능력 변화가 뒤집혔다!",
		clearAllBoost: "  모든 상태가 원래대로 되돌아왔다!",

		superEffective: "  효과가 굉장했다!",
		superEffectiveSpread: "  {POKEMON}에게 효과가 굉장했다!",
		resisted: "  효과가 별로인 듯하다...",
		resistedSpread: "  {POKEMON}에게 효과가 별로인 듯하다.",
		// this is official text meaning 4x effective. do not QC this
		extremelyEffective: "  효과가 매우 굉장했다!!",
		extremelyEffectiveSpread: "  {POKEMON}에게 효과가 매우 굉장했다!!",
		// this is official text meaning 1/4x effective. do not QC this
		mostlyIneffective: "  효과가 매우 별로인 듯하다...",
		mostlyIneffectiveSpread: "  {POKEMON}에게 효과가 매우 별로인 듯하다.",
		crit: "  급소에 맞았다!",
		critSpread: "  {POKEMON}의 급소에 맞았다!",
		immune: "  {POKEMON}에게는 효과가 없는 것 같다...",
		immuneNoPokemon: "  그러나 효과가 없었다!",
		immuneOHKO: "  {POKEMON}에게는 전혀 효과가 없다!",
		miss: "  {POKEMON}에게는 맞지 않았다!",
		missNoPokemon: "  그러나 {SOURCE}의 공격은 빗나갔다!",

		center: "  리셋무브!!",
		noTarget: "  그러나 상대가 없으므로 실패하고 말았다!",
		ohko: "  일격필살!",
		combine: "  2개의 기술이 하나가 되었다! 콤비네이션 기술이다!",
		hitCount: "  {NUMBER}번 맞았다!",
	},
	ui: {
		whatDo: "**{POKEMON:topic}** 무엇을 할까?", // NEEDS QC
		moveTarget: "{POKEMON:topic} **{MOVE:object}** 어디에 쓸까?", // NEEDS QC
		reviveWho: "**{POKEMON:topic}** 누구를 부활시킬까?", // NEEDS QC
		replaceWho: "**{POKEMON}** 대신 누구를 내보낼까?", // NEEDS QC
		teamStart: "어느 포켓몬으로 시작할까?", // NEEDS QC
		teamRest: "나머지 포켓몬의 순서는?", // NEEDS QC
		chooseLead: "선봉 선택", // NEEDS QC
		chooseSlot: "{NUMBER}번째 선택", // NEEDS QC
		teamSoFar: "현재 팀", // NEEDS QC
		waitingOpponent: "상대를 기다리는 중...", // NEEDS QC
		cantSwitchTrapped: "**도망칠 수 없어서** 교체할 수 없다!", // NEEDS QC
		usuallyMovesFirst: "대개 먼저 행동한다(우선도 +{PRIORITY}).", // NEEDS QC
		almostAlwaysMovesFirst: "거의 항상 먼저 행동한다(우선도 +{PRIORITY}).", // NEEDS QC
		almostAlwaysMovesLast: "거의 항상 나중에 행동한다(우선도 −{PRIORITY}).", // NEEDS QC
		failsIfHP: "현재 HP가 {HP}이면 실패한다.", // NEEDS QC
		koSelfIfHP: "현재 HP가 정확히 {HP}이면 자신이 기절한다.", // NEEDS QC
		transformedInto: "(변신 중: {SPECIES})", // NEEDS QC
		changedForme: "(폼체인지: {SPECIES})", // NEEDS QC
		possibleIllusion: "일루전 후보 #{NUMBER}", // NEEDS QC
		pixels: "({HP}/{MAXHP} 픽셀)", // NEEDS QC
		wouldTakeIfAbilityRemoved: "특성이 없다면 받을 데미지: {PERCENT}%", // NEEDS QC
		nextDamage: "다음 데미지: {PERCENT}%", // NEEDS QC
		turnsAsleep: "잠든 후 경과 턴 수: {NUMBER}", // NEEDS QC
		illusionWarning: "(기술이 5개 이상인 것은 대개 조로아크나 조로아의 일루전입니다.)", // NEEDS QC
		pressureGen3Warning: "(3세대에서는 프레셔가 표시되지 않아 사용된 PP를 정확히 알 수 없는 경우가 있습니다.)", // NEEDS QC
		indistinguishableWarning: "(상대에게 구분할 수 없는 포켓몬이 2마리 있어 어느 쪽이 어떤 기술·특성·도구를 가졌는지 알 수 없습니다.)", // NEEDS QC
		noConditions: "(필드 상태 없음)", // NEEDS QC
		turn: "({NUMBER}턴)", // NEEDS QC
		turns: "({NUMBER}턴)", // NEEDS QC
		afterStatModifiers: "(능력 보정 후:)", // NEEDS QC
		calls: "{MOVE} 사용", // NEEDS QC
		base: "(원래: {VALUE})", // NEEDS QC
		zEffectClearNegativeBoost: "떨어진 능력 랭크를 원래대로 되돌린다", // NEEDS QC
		zEffectCrit2: "급소율 +2", // NEEDS QC
		zEffectHeal: "HP를 모두 회복한다", // NEEDS QC
		zEffectCurse: "고스트타입이면 HP를 모두 회복, 그 외에는 공격 +1", // NEEDS QC
		zEffectRedirect: "상대의 공격을 자신에게 돌린다", // NEEDS QC
		zEffectHealReplacement: "교체로 나오는 포켓몬의 HP를 모두 회복한다", // NEEDS QC
		ppRange: "({LOW}~{HIGH})", // NEEDS QC
		revealed: "(밝혀짐)", // NEEDS QC
		range: "{LOW}~{HIGH}", // NEEDS QC
		beforeStatStages: "(능력 랭크 변화 전)", // NEEDS QC
		beforeExternalModifiers: "(외부 보정 전)", // NEEDS QC
		flingBerry: "나무열매의 효과를 대상에게 발동시킨다.", // NEEDS QC
		flingWhiteHerb: "대상의 떨어진 능력 랭크를 원래대로 되돌린다.", // NEEDS QC
		flingMentalHerb: "대상의 헤롱헤롱, 사슬묶기, 앙코르, 회복봉인, 도발, 트집 효과를 해제한다.", // NEEDS QC
		cantFling: "이 도구는 내던지기로 던질 수 없다.", // NEEDS QC
		unobtainableInGen: "{NUMBER}세대에서는 입수 불가", // NEEDS QC
		tagMoves: "{TAG} 기술", // NEEDS QC
		notifyMoveTitle: "기술을 선택하세요!", // NEEDS QC
		notifyMove: "배틀에서 기술을 선택하세요", // NEEDS QC
		notifyMoveAgainst: "{OPPONENT}와의 배틀에서 기술을 선택하세요", // NEEDS QC
		notifySwitchTitle: "교체하세요!", // NEEDS QC
		notifySwitch: "배틀에서 교체할 포켓몬을 선택하세요", // NEEDS QC
		notifySwitchAgainst: "{OPPONENT}와의 배틀에서 교체할 포켓몬을 선택하세요", // NEEDS QC
		notifyTeamTitle: "팀 미리보기!", // NEEDS QC
		notifyTeam: "배틀에서 팀 순서를 선택하세요", // NEEDS QC
		notifyTeamAgainst: "{OPPONENT}와의 배틀에서 팀 순서를 선택하세요", // NEEDS QC
		mightBeDisabled: "사용할 수 없는 기술이 있을 **가능성**이 있어 기술 선택을 취소할 수 없습니다!", // NEEDS QC
		mightBeLocked: "기술이 고정되었을 **가능성**이 있습니다.", // NEEDS QC
		lockedExplanation: "(고정된 경우 교체할 수 없게 됩니다)", // NEEDS QC
		mightBeTrapped: "교체할 수 없게 되었을 **가능성**이 있어 교체를 취소할 수 없습니다!", // NEEDS QC
		autoChoice: "자동 선택", // NEEDS QC
		unrecognizedChoice: "서버로부터 알 수 없는 선택:", // NEEDS QC
		lockedIntoMove: "{POKEMON:topic} 기술이 고정되어 있습니다.", // NEEDS QC
		willUseMove: "{POKEMON:topic} {ACTIONS}{AT}**{MOVE:object}** 사용한다.", // NEEDS QC
		atTarget: "{TARGET}에게 ", // NEEDS QC
		atSlot: "{NUMBER}번 위치에 ", // NEEDS QC
		atAllyTarget: "아군 {TARGET}에게 ", // NEEDS QC
		atAllySlot: "아군 {NUMBER}번 위치에 ", // NEEDS QC
		actionMegaEvolve: "**메가진화**하고 ", // NEEDS QC
		actionMegaEvolveX: "**메가진화**(X)하고 ", // NEEDS QC
		actionMegaEvolveY: "**메가진화**(Y)하고 ", // NEEDS QC
		actionUltraBurst: "**울트라버스트**하고 ", // NEEDS QC
		actionTerastallize: "테라스탈(**{TYPE}**)하고 ", // NEEDS QC
		actionDynamax: "**다이맥스**하고 ", // NEEDS QC
		actionGigantamax: "**거다이맥스**하고 ", // NEEDS QC
		willRevive: "{POKEMON:topic} **{TARGET:object}** 부활시킨다.", // NEEDS QC
		willSwitch: "{POKEMON:topic} **{TARGET:conjunctive}** 교체한다.", // NEEDS QC
		willShift: "{POKEMON:topic} 중앙으로 **이동**한다.", // NEEDS QC
		youPicked: "{POKEMON:object} 선택했다.", // NEEDS QC
		listComma: ", ", // NEEDS QC
		effectivenessVs: "{POKEMON}에게는 {EFFECT}", // NEEDS QC
		basePowerVs: "{POKEMON}에 대한 {LABEL}", // NEEDS QC
		or: " 또는 ", // NEEDS QC
	},

	// statuses
	brn: {
		start: "  {POKEMON:topic} 화상을 입었다!",
		startFromItem: "  {POKEMON:topic} {ITEM} 때문에 화상을 입었다!",
		alreadyStarted: "  {POKEMON:topic} 이미 화상을 입은 상태다.",
		end: "  {POKEMON}의 화상이 나았다!",
		endFromItem: "  {POKEMON:topic} {ITEM:directional} 화상이 나았다!",
		damage: "  {POKEMON:topic} 화상 데미지를 입었다!",
	},
	frz: {
		start: "  {POKEMON:topic} 얼어붙었다!",
		alreadyStarted: "  {POKEMON:topic} 이미 얼어 있다.",
		end: "  {POKEMON}의 얼음이 녹았다!",
		endFromItem: "  {POKEMON:topic} {ITEM:directional} 얼음 상태가 나았다!",
		endFromMove: "  {POKEMON}의 {MOVE} 때문에 얼음이 녹았다!",
		cant: "{POKEMON:topic} 얼어 버려서 움직일 수 없다!",
	},
	par: {
		start: "  {POKEMON:topic} 마비되어 기술이 나오기 어려워졌다!",
		alreadyStarted: "  {POKEMON:topic} 이미 마비되어 있다.",
		end: "  {POKEMON}의 몸저림이 풀렸다!",
		endFromItem: "  {POKEMON:topic} {ITEM:directional} 마비가 풀렸다!",
		cant: "{POKEMON:topic} 몸이 저려서 움직일 수 없다!",
	},
	psn: {
		start: "  {POKEMON}의 몸에 독이 퍼졌다!",
		alreadyStarted: "  {POKEMON:topic} 이미 몸에 독이 퍼진 상태다.",
		end: "  {POKEMON}의 독은 말끔하게 해독됐다!",
		endFromItem: "  {POKEMON:topic} {ITEM:directional} 독이 해독됐다!",
		damage: "  {POKEMON:topic} 독에 의한 데미지를 입었다!",
	},
	tox: {
		start: "  {POKEMON}의 몸에 맹독이 퍼졌다!",
		startFromItem: "  {POKEMON:topic} {ITEM} 때문에 맹독에 중독됐다!",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  {POKEMON:topic} 잠들어 버렸다!",
		startFromRest: "  {POKEMON:topic} 잠이 들어 건강해졌다!",
		alreadyStarted: "  {POKEMON:topic} 이미 잠들어 있다.",
		end: "  {POKEMON:topic} 눈을 떴다!",
		endFromItem: "  {POKEMON:topic} {ITEM:directional} 눈을 떴다!",
		cant: "{POKEMON:topic} 쿨쿨 잠들어 있다.",
	},

	// misc effects
	confusion: {
		start: "  {POKEMON:topic} 혼란에 빠졌다!",
		startFromFatigue: "  {POKEMON:topic} 몹시 지쳐서 혼란에 빠졌다!",
		end: "  {POKEMON}의 혼란이 풀렸다!",
		endFromItem: "  {POKEMON:topic} {ITEM:directional} 혼란이 풀렸다!",
		alreadyStarted: "  {POKEMON:topic} 이미 혼란에 빠져 있다.",
		activate: "  {POKEMON:topic} 혼란에 빠져 있다!",
		damage: "영문도 모른 채 자신을 공격했다!",
	},
	drain: {
		heal: "  {SOURCE:directional}부터 체력을 흡수했다!",
	},
	flinch: {
		cant: "{POKEMON:topic} 풀이 죽어 기술을 쓸 수 없다!",
	},
	heal: {
		fail: "  그러나 {POKEMON:topic} 체력이 가득 찬 상태다!",
	},
	healreplacement: {
		activate: "  {POKEMON:topic} Z파워로 교체한 같은 편을 회복한다!",
	},
	nopp: {
		cant: "{POKEMON}의 **{MOVE}**!\n  그러나 남은 PP가 없었다!",
	},
	recharge: {
		cant: "{POKEMON:topic} 공격의 반동으로 움직일 수 없다!",
	},
	recoil: {
		damage: "  {POKEMON:topic} 반동으로 데미지를 입었다!",
	},
	unboost: {
		fail: "  {POKEMON}의 {STAT:topic} 떨어지지 않는다!", // per-stat form; SV ko_common:6483 "공격은 떨어지지 않는다!"
		failNoStat: "  {POKEMON}의 능력은 떨어지지 않는다!", // SV ko_common:6479
	},
	struggle: {
		activate: "  {POKEMON:topic} 쓸 수 있는 기술이 없다!",
	},
	trapped: {
		start: "  {POKEMON:topic} 이제 도망칠 수 없다!",
	},
	dynamax: {
		start: "  ({POKEMON:topic} 다이맥스했다!)", // NEEDS QC
		end: "  ({POKEMON:topic} 원래 모습으로 되돌아왔다!)", // NEEDS QC
		block: "  다이맥스의 힘으로 튕겨 냈다!",
		fail: "  {POKEMON:topic} 고개를 가로저었다. 이 기술은 쓸 수 없는 것 같다...",
	},

	// weather
	sandstorm: {
		weatherName: "모래바람",
		start: "  모래바람이 불기 시작했다!",
		end: "  모래바람이 가라앉았다!",
		upkeep: "  (모래바람이 세차게 분다!)",
		damage: "  모래바람이 {POKEMON:object} 덮쳤다!",
	},
	sunnyday: {
		weatherName: "쾌청",
		start: "  햇살이 강해졌다!",
		end: "  햇살이 원래대로 되돌아왔다!",
		upkeep: "  (햇살이 강하다)",
	},
	raindance: {
		weatherName: "비",
		start: "  비가 내리기 시작했다!",
		end: "  비가 그쳤다!",
		upkeep: "  (비가 계속 내리고 있다)",
	},
	hail: {
		weatherName: "싸라기눈",
		start: "  싸라기눈이 내리기 시작했다!",
		end: "  싸라기눈이 그쳤다!",
		upkeep: "  (싸라기눈이 휘몰아친다!)",
		damage: "  싸라기눈이 {POKEMON:object} 덮쳤다!",
	},
	snowscape: {
		weatherName: "눈",
		start: "  눈이 내리기 시작했다!",
		end: "  눈이 그쳤다!",
		upkeep: "  (눈이 휘몰아친다!)",
	},
	desolateland: {
		weatherName: "큰가뭄",
		start: "  햇살이 아주 강해졌다!",
		end: "  햇살이 원래대로 되돌아왔다!",
		block: "  강한 햇살의 기세는 멈추지 않는다!",
		blockMove: "  강한 햇살의 영향으로 물타입의 공격이 증발했다!",
	},
	primordialsea: {
		weatherName: "폭우",
		start: "  강한 비가 내리기 시작했다!",
		end: "  강한 비가 그쳤다!",
		block: "  강한 비의 기세는 멈추지 않는다!",
		blockMove: "  강한 비의 영향으로 불꽃타입의 공격이 사라졌다!",
	},
	deltastream: {
		weatherName: "난기류",
		start: "  수수께끼의 난기류가 비행포켓몬을 지킨다!",
		end: "  수수께끼의 난기류가 가라앉았다!",
		activate: "  수수께끼의 난기류가 공격을 약하게 만들었다!",
		block: "  수수께끼의 난기류의 기세는 멈추지 않는다!",
	},

	// terrain
	electricterrain: {
		start: "  발밑에 전기가 흐르기 시작했다!",
		end: "  발밑의 전기가 사라졌다!",
		block: "  {POKEMON:object} 일렉트릭필드가 지켜 주고 있다!",
	},
	grassyterrain: {
		start: "  발밑에 풀이 무성해졌다!",
		end: "  발밑의 풀이 사라졌다!",
		heal: "  {POKEMON}의 체력이 회복되었다!",
	},
	mistyterrain: {
		start: "  발밑이 안개로 자욱해졌다!",
		end: "  발밑의 안개가 사라졌다!",
		block: "  {POKEMON:object} 미스트필드가 지켜 주고 있다!",
	},
	psychicterrain: {
		start: "  발밑에서 이상한 느낌이 든다!",
		end: "  발밑의 이상한 느낌이 사라졌다!",
		block: "  {POKEMON:topic} 사이코필드가 지켜 주고 있다!",
	},

	// field effects
	gravity: {
		start: "  중력이 강해졌다!",
		end: "  중력이 원래대로 되돌아왔다!",
		cant: "{POKEMON:topic} 중력이 강해서 {MOVE:object} 쓸 수 없다!",
		activate: "{POKEMON:topic} 중력의 영향으로 공중에 있을 수 없게 되었다!",
	},
	magicroom: {
		start: "  지니게 한 도구의 효과가 없어지는 공간을 만들어 냈다!",
		end: "  매직룸이 해제되어 도구의 효과가 원래대로 되돌아왔다!",
	},
	mudsport: {
		start: "  전기의 위력이 약해졌다!",
		end: "  흙놀이의 효과가 없어졌다!",
	},
	trickroom: {
		start: "  {POKEMON:topic} 시공을 뒤틀었다!",
		end: "  뒤틀린 시공이 원래대로 되돌아왔다!",
	},
	watersport: {
		start: "  불꽃의 위력이 약해졌다!",
		end: "  물놀이의 효과가 없어졌다!",
	},
	wonderroom: {
		start: "  방어와 특수방어가 바뀌는 공간을 만들어 냈다!",
		end: "  원더룸이 해제되어 방어와 특수방어가 원래대로 되돌아왔다!",
	},

	// misc
	crash: {
		damage: "  {POKEMON:topic} 의욕이 넘쳐서 땅에 부딪쳤다!",
	},
};
