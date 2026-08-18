export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "", // NEEDS TRANSLATION: Showdown custom text
		winBattle: "", // NEEDS TRANSLATION: Showdown custom text
		tieBattle: "", // NEEDS TRANSLATION: Showdown custom text

		pokemon: "[NICKNAME]",
		opposingPokemon: "상대 [NICKNAME]",
		team: "우리 편",
		opposingTeam: "상대",
		party: "같은 편 포켓몬",
		opposingParty: "상대의 포켓몬",

		turn: "== [NUMBER]턴 ==",
		switchIn: "[TRAINER:topic] [FULLNAME:object] 내보냈다!",
		switchInOwn: "가랏! [FULLNAME]!",
		switchOut: "[TRAINER:topic] [NICKNAME:object] 넣어 버렸다!",
		switchOutOwn: "[NICKNAME] 돌아와!",
		drag: "[FULLNAME:topic] 배틀에 끌려 나왔다!",
		faint: "[POKEMON:topic] 쓰러졌다!",
		swap: "[POKEMON:conjunctive] [TARGET:topic] 자리를 바꿨다!",
		swapCenter: "[POKEMON:topic] 중앙으로 이동했다!",

		// Multi Battles only
		canDynamax: "  [TRAINER:topic] 다이맥스를 사용할 수 있게 됐다!",
		canDynamaxOwn: "  [TRAINER]에게 다이맥스 파워가 모였다!",

		zEffect: "  [POKEMON:subject] 뿜어내는 전력의 Z기술!",
		move: "[POKEMON]의 **[MOVE]**!",
		abilityActivation: "[[POKEMON]의 [ABILITY]]",

		mega: "  [POKEMON]의 [ITEM:conjunctive] [TRAINER]의 키스톤이 반응했다!",
		megaNoItem: "  [TRAINER]의 키스톤과 [POKEMON:subject] 반응했다!",
		megaGen6: "  [POKEMON]의 [ITEM:conjunctive] [TRAINER]의 메가뱅글이 반응했다!",
		transformMega: "[POKEMON:topic] 메가[SPECIES:directional]로 메가진화했다!",
		primal: "[POKEMON]의 원시회귀! 원시의 모습으로 돌아갔다!",
		zPower: "  [POKEMON:topic] Z파워에 몸이 둘러싸였다!",
		zBroken: "  [POKEMON:topic] 공격을 막아 내지 못하고 데미지를 입었다!",
		terastallize: "", // NEEDS TRANSLATION: Showdown custom text

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON:topic] [MOVE:object] 쓸 수 없다!",
		cantNoMove: "", // NEEDS TRANSLATION: predates Chinese support
		fail: "  그러나 실패하고 말았다!!",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "[POKEMON]의 모습이 변화했다!",
		typeChange: "  [POKEMON:topic] [TYPE]타입이 됐다!",
		typeChangeFromEffect: "  [POKEMON] [EFFECT] 때문에 [TYPE]타입이 되었다!",
		typeAdd: "  [POKEMON]에게 [TYPE]타입이 추가되었다!",

		start: "", // NEEDS TRANSLATION: Showdown custom text
		end: "  [POKEMON:topic] [EFFECT:directional]로부터 풀려났다!",
		activate: "", // NEEDS TRANSLATION: Showdown custom text
		startTeamEffect: "", // NEEDS TRANSLATION: Showdown custom text
		endTeamEffect: "", // NEEDS TRANSLATION: Showdown custom text
		startFieldEffect: "", // NEEDS TRANSLATION: Showdown custom text
		endFieldEffect: "", // NEEDS TRANSLATION: Showdown custom text

		changeAbility: "  [POKEMON:topic] [ABILITY:subject] 되었다!",
		addItem: "  [POKEMON:topic] [ITEM:object] 손에 넣었다!",
		takeItem: "  [POKEMON:topic] [SOURCE:directional]로부터 [ITEM:object] 빼앗았다!",
		eatItem: "", // NEEDS TRANSLATION: Showdown custom text
		useGem: "  [ITEM:topic] [MOVE]의 위력을 강하게 했다!",
		eatItemWeaken: "  [POKEMON:subject] 입는 데미지를 [ITEM:subject] 약하게 했다!",
		removeItem: "", // NEEDS TRANSLATION: Showdown custom text
		activateItem: "", // NEEDS TRANSLATION: Showdown custom text
		activateWeaken: "  [POKEMON:subject] 입는 데미지를 [ITEM:subject] 약하게 했다!",

		damage: "  ([POKEMON] 데미지를 입었다!)",
		damagePercentage: "", // NEEDS TRANSLATION: Showdown custom text
		damageFromPokemon: "  [POKEMON:topic] [SOURCE]의 [ITEM] 때문에 데미지를 입었다!",
		damageFromItem: "  [POKEMON:topic] [ITEM] 때문에 데미지를 입었다!",
		damageFromPartialTrapping: "  [POKEMON:topic] [MOVE]의 데미지를 입고 있다.",
		heal: "  [POKEMON]의 체력이 회복되었다!",
		healFromZEffect: "  [POKEMON:topic] Z파워로 체력을 회복했다!",
		healFromEffect: "  [POKEMON] [EFFECT]로 인해 회복했다!",

		boost: "  [POKEMON]의 [STAT:subject] 올라갔다!",
		boost2: "  [POKEMON]의 [STAT:subject] 크게 올라갔다!",
		boost3: "  [POKEMON]의 [STAT:subject] 매우 크게 올라갔다!",
		boost0: "  [POKEMON]의 [STAT:topic] 더 올라가지 않는다!",
		boostFromItem: "  [ITEM]로 [POKEMON]의 [STAT] 올라갔다!",
		boost2FromItem: "  [ITEM]로 [POKEMON]의 [STAT] 크게 올라갔다!",
		boost3FromItem: "  [POKEMON:topic] [ITEM:directional]로 [STAT:subject] 매우 크게 올라갔다!",
		boostFromZEffect: "  [POKEMON:topic] Z파워로 [STAT:subject] 올라갔다!",
		boost2FromZEffect: "  [POKEMON:topic] Z파워로 [STAT:subject] 크게 올라갔다!",
		boost3FromZEffect: "  [POKEMON:topic] Z파워로 [STAT:subject] 매우 크게 올라갔다!",
		boostMultipleFromZEffect: "  [POKEMON:topic] Z파워로 능력이 올라갔다!",

		unboost: "  [POKEMON]의 [STAT:subject] 떨어졌다!",
		unboost2: "  [POKEMON]의 [STAT:subject] 크게 떨어졌다!",
		unboost3: "  [POKEMON]의 [STAT:subject] 매우 크게 떨어졌다!",
		unboost0: "  [POKEMON]의 [STAT:topic] 더 떨어지지 않는다!",
		unboostFromItem: "", // NEEDS TRANSLATION: Showdown custom text
		unboost2FromItem: "", // NEEDS TRANSLATION: Showdown custom text
		unboost3FromItem: "", // NEEDS TRANSLATION: Showdown custom text

		swapBoost: "  [POKEMON:topic] 상대와 자신의 능력 변화를 바꿨다!",
		swapOffensiveBoost: "  [POKEMON:topic] 상대와 자신의 공격과 특수공격의 능력 변화를 바꿨다!",
		swapDefensiveBoost: "  [POKEMON:topic] 상대와 자신의 방어와 특수방어의 능력 변화를 바꿨다!",
		copyBoost: "  [POKEMON:topic] [TARGET]의 능력 변화를 복사했다!",
		clearBoost: "  [POKEMON]의 능력 변화가 원래대로 되돌아왔다!",
		clearBoostFromZEffect: "  [POKEMON:topic] Z파워로 떨어진 능력을 원래대로 되돌렸다!",
		invertBoost: "  [POKEMON:topic] 능력 변화가 뒤집혔다!",
		clearAllBoost: "  모든 상태가 원래대로 되돌아왔다!",

		superEffective: "  효과가 굉장했다!",
		superEffectiveSpread: "  [POKEMON]에게 효과가 굉장했다!",
		resisted: "  효과가 별로인 듯하다...",
		resistedSpread: "  [POKEMON]에게 효과가 별로인 듯하다.",
		extremelyEffective: "  효과가 매우 굉장했다!!",
		extremelyEffectiveSpread: "  [POKEMON]에게 효과가 매우 굉장했다!!",
		mostlyIneffective: "  효과가 매우 별로인 듯하다...",
		mostlyIneffectiveSpread: "  [POKEMON]에게 효과가 매우 별로인 듯하다.",
		crit: "  급소에 맞았다!",
		critSpread: "  [POKEMON]의 급소에 맞았다!",
		immune: "  [POKEMON]에게는 효과가 없는 것 같다...",
		immuneNoPokemon: "  그러나 효과가 없었다!",
		immuneOHKO: "  [POKEMON]에게는 전혀 효과가 없다!",
		miss: "  [POKEMON]에게는 맞지 않았다!",
		missNoPokemon: "  그러나 [SOURCE]의 공격은 빗나갔다!",

		center: "  리셋무브!!",
		noTarget: "  그러나 상대가 없으므로 실패하고 말았다!",
		ohko: "  일격필살!",
		combine: "  2개의 기술이 하나가 되었다! 콤비네이션 기술이다!",
		hitCount: "  [NUMBER]번 맞았다!",
	},

	// stats
	hp: {
		statName: "HP",
		statShortName: "HP",
	},
	atk: {
		statName: "공격",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	def: {
		statName: "방어",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spa: {
		statName: "특수공격",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spd: {
		statName: "특수방어",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	spe: {
		statName: "스피드",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	accuracy: {
		statName: "명중률",
	},
	evasion: {
		statName: "회피율",
	},
	spc: {
		statName: "특수",
		statShortName: "", // NEEDS TRANSLATION: Showdown custom text
	},
	stats: {
		statName: "스테이터스",
	},

	// statuses
	brn: {
		start: "  [POKEMON:topic] 화상을 입었다!",
		startFromItem: "  [POKEMON:topic] [ITEM] 때문에 화상을 입었다!",
		alreadyStarted: "  [POKEMON:topic] 이미 화상을 입은 상태다.",
		end: "  [POKEMON]의 화상이 나았다!",
		endFromItem: "  [POKEMON:topic] [ITEM:directional]로 화상이 나았다!",
		damage: "  [POKEMON:topic] 화상 데미지를 입었다!",
	},
	frz: {
		start: "  [POKEMON:topic] 얼어붙었다!",
		alreadyStarted: "  [POKEMON:topic] 이미 얼어 있다.",
		end: "  [POKEMON]의 얼음이 녹았다!",
		endFromItem: "  [POKEMON:topic] [ITEM:directional]로 얼음 상태가 나았다!",
		endFromMove: "  [POKEMON]의 [MOVE] 때문에 얼음이 녹았다!",
		cant: "[POKEMON:topic] 얼어 버려서 움직일 수 없다!",
	},
	par: {
		start: "  [POKEMON:topic] 마비되어 기술이 나오기 어려워졌다!",
		alreadyStarted: "  [POKEMON:topic] 이미 마비되어 있다.",
		end: "  [POKEMON]의 몸저림이 풀렸다!",
		endFromItem: "  [POKEMON:topic] [ITEM:directional]로 마비가 풀렸다!",
		cant: "[POKEMON:topic] 몸이 저려서 움직일 수 없다!",
	},
	psn: {
		start: "  [POKEMON]의 몸에 독이 퍼졌다!",
		alreadyStarted: "  [POKEMON:topic] 이미 몸에 독이 퍼진 상태다.",
		end: "  [POKEMON]의 독은 말끔하게 해독됐다!",
		endFromItem: "  [POKEMON:topic] [ITEM:directional]로 독이 해독됐다!",
		damage: "  [POKEMON:topic] 독에 의한 데미지를 입었다!",
	},
	tox: {
		start: "  [POKEMON]의 몸에 맹독이 퍼졌다!",
		startFromItem: "  [POKEMON:topic] [ITEM] 때문에 맹독에 중독됐다!",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  [POKEMON:topic] 잠들어 버렸다!",
		startFromRest: "  [POKEMON:topic] 잠이 들어 건강해졌다!",
		alreadyStarted: "  [POKEMON:topic] 이미 잠들어 있다.",
		end: "  [POKEMON:topic] 눈을 떴다!",
		endFromItem: "  [POKEMON:topic] [ITEM:directional]로 눈을 떴다!",
		cant: "[POKEMON:topic] 쿨쿨 잠들어 있다.",
	},

	// misc effects
	confusion: {
		start: "  [POKEMON:topic] 혼란에 빠졌다!",
		startFromFatigue: "  [POKEMON:topic] 몹시 지쳐서 혼란에 빠졌다!",
		end: "  [POKEMON]의 혼란이 풀렸다!",
		endFromItem: "  [POKEMON:topic] [ITEM:directional]로 혼란이 풀렸다!",
		alreadyStarted: "  [POKEMON:topic] 이미 혼란에 빠져 있다.",
		activate: "  [POKEMON:topic] 혼란에 빠져 있다!",
		damage: "영문도 모른 채 자신을 공격했다!",
	},
	drain: {
		heal: "  [SOURCE:directional]로부터 체력을 흡수했다!",
	},
	flinch: {
		cant: "[POKEMON:topic] 풀이 죽어 기술을 쓸 수 없다!",
	},
	heal: {
		fail: "  그러나 [POKEMON:topic] 체력이 가득 찬 상태다!",
	},
	healreplacement: {
		activate: "  [POKEMON:topic] Z파워로 교체한 같은 편을 회복한다!",
	},
	nopp: {
		cant: "[POKEMON]의 **[MOVE]**!\n  그러나 남은 PP가 없었다!",
	},
	recharge: {
		cant: "[POKEMON:topic] 공격의 반동으로 움직일 수 없다!",
	},
	recoil: {
		damage: "  [POKEMON:topic] 반동으로 데미지를 입었다!",
	},
	unboost: {
		fail: "  [POKEMON]의 능력은 떨어지지 않는다!",
	},
	struggle: {
		activate: "  [POKEMON:topic] 쓸 수 있는 기술이 없다!",
	},
	trapped: {
		start: "  [POKEMON:topic] 이제 도망칠 수 없다!",
	},
	dynamax: {
		start: "", // NEEDS TRANSLATION: Showdown custom text
		end: "", // NEEDS TRANSLATION: Showdown custom text
		block: "  다이맥스의 힘으로 튕겨 냈다!",
		fail: "  [POKEMON:topic] 고개를 가로저었다. 이 기술은 쓸 수 없는 것 같다...",
	},

	// weather
	sandstorm: {
		weatherName: "모래바람 상태",
		start: "  모래바람이 불기 시작했다!",
		end: "  모래바람이 가라앉았다!",
		upkeep: "  (모래바람이 세차게 분다!)",
		damage: "  모래바람이 [POKEMON:object] 덮쳤다!",
	},
	sunnyday: {
		weatherName: "쾌청 상태",
		start: "  햇살이 강해졌다!",
		end: "  햇살이 원래대로 되돌아왔다!",
		upkeep: "  (햇살이 강하다)",
	},
	raindance: {
		weatherName: "비 상태",
		start: "  비가 내리기 시작했다!",
		end: "  비가 그쳤다!",
		upkeep: "  (비가 계속 내리고 있다)",
	},
	hail: {
		weatherName: "싸라기눈",
		start: "  싸라기눈이 내리기 시작했다!",
		end: "  싸라기눈이 그쳤다!",
		upkeep: "  (싸라기눈이 휘몰아친다!)",
		damage: "  싸라기눈이 [POKEMON:object] 덮쳤다!",
	},
	snowscape: {
		weatherName: "눈 상태",
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
		block: "  [POKEMON:object] 일렉트릭필드가 지켜 주고 있다!",
	},
	grassyterrain: {
		start: "  발밑에 풀이 무성해졌다!",
		end: "  발밑의 풀이 사라졌다!",
		heal: "  [POKEMON]의 체력이 회복되었다!",
	},
	mistyterrain: {
		start: "  발밑이 안개로 자욱해졌다!",
		end: "  발밑의 안개가 사라졌다!",
		block: "  [POKEMON:object] 미스트필드가 지켜 주고 있다!",
	},
	psychicterrain: {
		start: "  발밑에서 이상한 느낌이 든다!",
		end: "  발밑의 이상한 느낌이 사라졌다!",
		block: "  [POKEMON:topic] 사이코필드가 지켜 주고 있다!",
	},

	// field effects
	gravity: {
		start: "  중력이 강해졌다!",
		end: "  중력이 원래대로 되돌아왔다!",
		cant: "[POKEMON:topic] 중력이 강해서 [MOVE:object] 쓸 수 없다!",
		activate: "[POKEMON:topic] 중력의 영향으로 공중에 있을 수 없게 되었다!",
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
		start: "  [POKEMON:topic] 시공을 뒤틀었다!",
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
		damage: "  [POKEMON:topic] 의욕이 넘쳐서 땅에 부딪쳤다!",
	},
};
