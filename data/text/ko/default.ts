export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		startBattle: "", // NOT CONVERTED: not in Champions
		winBattle: "", // NOT CONVERTED: not in Champions
		tieBattle: "", // NOT CONVERTED: not in Champions

		pokemon: "[NICKNAME]",
		opposingPokemon: "상대 [NICKNAME]",
		team: "우리 편",
		opposingTeam: "상대",
		party: "같은 편 포켓몬",
		opposingParty: "상대의 포켓몬",

		turn: "", // NOT CONVERTED: not in Champions
		switchIn: "[TRAINER] [FULLNAME] 내보냈다!",
		switchInOwn: "가랏! [FULLNAME]!",
		switchOut: "[TRAINER] [NICKNAME] 넣어 버렸다!",
		switchOutOwn: "[NICKNAME] 돌아와!",
		drag: "[FULLNAME] 배틀에 끌려 나왔다!",
		faint: "[POKEMON] 쓰러졌다!",
		swap: "[POKEMON] [TARGET] 자리를 바꿨다!",
		swapCenter: "", // NOT CONVERTED: not in Champions

		// Multi Battles only
		canDynamax: "", // NOT CONVERTED: not in Champions
		canDynamaxOwn: "", // NOT CONVERTED: not in Champions

		zEffect: "", // NOT CONVERTED: not in Champions
		move: "[POKEMON]의 **[MOVE]**!",
		abilityActivation: "[[POKEMON]의 [ABILITY]]",

		mega: "", // NOT CONVERTED: not in Champions
		megaNoItem: "", // NOT CONVERTED: not in Champions
		megaGen6: "", // NOT CONVERTED: not in Champions
		transformMega: "[POKEMON] 메가[SPECIES]로 메가진화했다!",
		primal: "", // NOT CONVERTED: not in Champions
		zPower: "", // NOT CONVERTED: not in Champions
		zBroken: "  [POKEMON] 공격을 막아 내지 못하고 데미지를 입었다!",
		terastallize: "", // NOT CONVERTED: not in Champions

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON] [MOVE] 쓸 수 없다!",
		cantNoMove: "", // NOT CONVERTED: not in Champions
		fail: "  그러나 실패하고 말았다!!",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "[POKEMON]의 모습이 변화했다!",
		typeChange: "  [POKEMON] [TYPE]타입이 됐다!",
		typeChangeFromEffect: "", // NOT CONVERTED: not in Champions
		typeAdd: "  [POKEMON]에게 [TYPE]타입이 추가되었다!",

		start: "", // NOT CONVERTED: not in Champions
		end: "  [POKEMON] [EFFECT]로부터 풀려났다!",
		activate: "", // NOT CONVERTED: not in Champions
		startTeamEffect: "", // NOT CONVERTED: not in Champions
		endTeamEffect: "", // NOT CONVERTED: not in Champions
		startFieldEffect: "", // NOT CONVERTED: not in Champions
		endFieldEffect: "", // NOT CONVERTED: not in Champions

		changeAbility: "  [POKEMON] [ABILITY] 되었다!",
		addItem: "  [POKEMON] [ITEM] 손에 넣었다!",
		takeItem: "  [POKEMON] [SOURCE]로부터 [ITEM] 빼앗았다!",
		eatItem: "", // NOT CONVERTED: not in Champions
		useGem: "  [ITEM] [MOVE]의 위력을 강하게 했다!",
		eatItemWeaken: "  [POKEMON] 입는 데미지를 [ITEM] 약하게 했다!",
		removeItem: "", // NOT CONVERTED: not in Champions
		activateItem: "", // NOT CONVERTED: not in Champions
		activateWeaken: "  [POKEMON] 입는 데미지를 [ITEM] 약하게 했다!",

		damage: "  ([POKEMON] 데미지를 입었다!)",
		damagePercentage: "", // NOT CONVERTED: not in Champions
		damageFromPokemon: "", // NOT CONVERTED: not in Champions
		damageFromItem: "", // NOT CONVERTED: not in Champions
		damageFromPartialTrapping: "  [POKEMON] [MOVE]의 데미지를 입고 있다.",
		heal: "  [POKEMON]의 체력이 회복되었다!",
		healFromZEffect: "", // NOT CONVERTED: not in Champions
		healFromEffect: "", // NOT CONVERTED: not in Champions

		boost: "  [POKEMON]의 [STAT] 올라갔다!",
		boost2: "  [POKEMON]의 [STAT] 크게 올라갔다!",
		boost3: "  [POKEMON]의 [STAT] 매우 크게 올라갔다!",
		boost0: "  [POKEMON]의 [STAT] 더 올라가지 않는다!",
		boostFromItem: "", // NOT CONVERTED: not in Champions
		boost2FromItem: "", // NOT CONVERTED: not in Champions
		boost3FromItem: "", // NOT CONVERTED: not in Champions
		boostFromZEffect: "", // NOT CONVERTED: not in Champions
		boost2FromZEffect: "", // NOT CONVERTED: not in Champions
		boost3FromZEffect: "", // NOT CONVERTED: not in Champions
		boostMultipleFromZEffect: "", // NOT CONVERTED: not in Champions

		unboost: "  [POKEMON]의 [STAT] 떨어졌다!",
		unboost2: "  [POKEMON]의 [STAT] 크게 떨어졌다!",
		unboost3: "  [POKEMON]의 [STAT] 매우 크게 떨어졌다!",
		unboost0: "  [POKEMON]의 [STAT] 더 떨어지지 않는다!",
		unboostFromItem: "", // NOT CONVERTED: not in Champions
		unboost2FromItem: "", // NOT CONVERTED: not in Champions
		unboost3FromItem: "", // NOT CONVERTED: not in Champions

		swapBoost: "", // NOT CONVERTED: not in Champions
		swapOffensiveBoost: "  [POKEMON] 상대와 자신의 공격과 특수공격의 능력 변화를 바꿨다!",
		swapDefensiveBoost: "  [POKEMON] 상대와 자신의 방어와 특수방어의 능력 변화를 바꿨다!",
		copyBoost: "  [POKEMON] [TARGET]의 능력 변화를 복사했다!",
		clearBoost: "  [POKEMON]의 능력 변화가 원래대로 되돌아왔다!",
		clearBoostFromZEffect: "", // NOT CONVERTED: not in Champions
		invertBoost: "  [POKEMON] 능력 변화가 뒤집혔다!",
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
		immuneNoPokemon: "", // NOT CONVERTED: not in Champions
		immuneOHKO: "", // NOT CONVERTED: not in Champions
		miss: "  [POKEMON]에게는 맞지 않았다!",
		missNoPokemon: "", // NOT CONVERTED: not in Champions

		center: "", // NOT CONVERTED: not in Champions
		noTarget: "", // NOT CONVERTED: not in Champions
		ohko: "  일격필살!",
		combine: "", // NOT CONVERTED: not in Champions
		hitCount: "  [NUMBER]번 맞았다!",
		hitCountSingular: "  1번 맞았다!",
	},

	// stats
	hp: {
		statName: "HP",
		statShortName: "HP",
	},
	atk: {
		statName: "공격",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	def: {
		statName: "방어",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spa: {
		statName: "특수공격",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spd: {
		statName: "특수방어",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	spe: {
		statName: "스피드",
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	accuracy: {
		statName: "명중률",
	},
	evasion: {
		statName: "회피율",
	},
	spc: {
		statName: "", // NOT CONVERTED: not in Champions
		statShortName: "", // NOT CONVERTED: not in Champions
	},
	stats: {
		statName: "스테이터스",
	},

	// statuses
	brn: {
		start: "  [POKEMON] 화상을 입었다!",
		startFromItem: "  [POKEMON] [ITEM] 때문에 화상을 입었다!",
		alreadyStarted: "  [POKEMON] 이미 화상을 입은 상태다.",
		end: "", // NOT CONVERTED: not in Champions
		endFromItem: "", // NOT CONVERTED: not in Champions
		damage: "  [POKEMON] 화상 데미지를 입었다!",
	},
	frz: {
		start: "  [POKEMON] 얼어붙었다!",
		alreadyStarted: "", // NOT CONVERTED: not in Champions
		end: "  [POKEMON]의 얼음이 녹았다!",
		endFromItem: "  [POKEMON] [ITEM]로 얼음 상태가 나았다!",
		endFromMove: "  [POKEMON]의 [MOVE] 때문에 얼음이 녹았다!",
		cant: "[POKEMON] 얼어 버려서 움직일 수 없다!",
	},
	par: {
		start: "  [POKEMON] 마비되어 기술이 나오기 어려워졌다!",
		alreadyStarted: "  [POKEMON] 이미 마비되어 있다.",
		end: "  [POKEMON]의 몸저림이 풀렸다!",
		endFromItem: "  [POKEMON] [ITEM]로 마비가 풀렸다!",
		cant: "", // NOT CONVERTED: not in Champions
	},
	psn: {
		start: "  [POKEMON]의 몸에 독이 퍼졌다!",
		alreadyStarted: "  [POKEMON] 이미 몸에 독이 퍼진 상태다.",
		end: "  [POKEMON]의 독은 말끔하게 해독됐다!",
		endFromItem: "", // NOT CONVERTED: not in Champions
		damage: "", // NOT CONVERTED: not in Champions
	},
	tox: {
		start: "  [POKEMON]의 몸에 맹독이 퍼졌다!",
		startFromItem: "  [POKEMON] [ITEM] 때문에 맹독에 중독됐다!",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  [POKEMON] 잠들어 버렸다!",
		startFromRest: "", // NOT CONVERTED: not in Champions
		alreadyStarted: "  [POKEMON] 이미 잠들어 있다.",
		end: "  [POKEMON] 눈을 떴다!",
		endFromItem: "  [POKEMON] [ITEM]로 눈을 떴다!",
		cant: "[POKEMON] 쿨쿨 잠들어 있다.",
	},

	// misc effects
	confusion: {
		start: "  [POKEMON] 혼란에 빠졌다!",
		startFromFatigue: "  [POKEMON] 몹시 지쳐서 혼란에 빠졌다!",
		end: "  [POKEMON]의 혼란이 풀렸다!",
		endFromItem: "  [POKEMON] [ITEM]로 혼란이 풀렸다!",
		alreadyStarted: "  [POKEMON] 이미 혼란에 빠져 있다.",
		activate: "  [POKEMON] 혼란에 빠져 있다!",
		damage: "영문도 모른 채 자신을 공격했다!",
	},
	drain: {
		heal: "  [SOURCE]로부터 체력을 흡수했다!",
	},
	flinch: {
		cant: "[POKEMON] 풀이 죽어 기술을 쓸 수 없다!",
	},
	heal: {
		fail: "  그러나 [POKEMON] 체력이 가득 찬 상태다!",
	},
	healreplacement: {
		activate: "", // NOT CONVERTED: not in Champions
	},
	nopp: {
		cant: "", // NOT CONVERTED: not in Champions
	},
	recharge: {
		cant: "[POKEMON] 공격의 반동으로 움직일 수 없다!",
	},
	recoil: {
		damage: "  [POKEMON] 반동으로 데미지를 입었다!",
	},
	unboost: {
		fail: "  [POKEMON]의 능력은 떨어지지 않는다!",
		failSingular: "", // NOT CONVERTED: not in Champions
	},
	struggle: {
		activate: "", // NOT CONVERTED: not in Champions
	},
	trapped: {
		start: "  [POKEMON] 이제 도망칠 수 없다!",
	},
	dynamax: {
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		block: "", // NOT CONVERTED: not in Champions
		fail: "", // NOT CONVERTED: not in Champions
	},

	// weather
	sandstorm: {
		weatherName: "모래바람 상태",
		start: "  모래바람이 불기 시작했다!",
		end: "  모래바람이 가라앉았다!",
		upkeep: "", // NOT CONVERTED: not in Champions
		damage: "  모래바람이 [POKEMON] 덮쳤다!",
	},
	sunnyday: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "  햇살이 강해졌다!",
		end: "  햇살이 원래대로 되돌아왔다!",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	raindance: {
		weatherName: "비 상태",
		start: "  비가 내리기 시작했다!",
		end: "  비가 그쳤다!",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	hail: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		upkeep: "", // NOT CONVERTED: not in Champions
		damage: "", // NOT CONVERTED: not in Champions
	},
	snowscape: {
		weatherName: "눈 상태",
		start: "  눈이 내리기 시작했다!",
		end: "  눈이 그쳤다!",
		upkeep: "", // NOT CONVERTED: not in Champions
	},
	desolateland: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		block: "", // NOT CONVERTED: not in Champions
		blockMove: "", // NOT CONVERTED: not in Champions
	},
	primordialsea: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		block: "", // NOT CONVERTED: not in Champions
		blockMove: "", // NOT CONVERTED: not in Champions
	},
	deltastream: {
		weatherName: "", // NOT CONVERTED: not in Champions
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
		activate: "", // NOT CONVERTED: not in Champions
		block: "", // NOT CONVERTED: not in Champions
	},

	// terrain
	electricterrain: {
		start: "  발밑에 전기가 흐르기 시작했다!",
		end: "  발밑의 전기가 사라졌다!",
		block: "  [POKEMON] 일렉트릭필드가 지켜 주고 있다!",
	},
	grassyterrain: {
		start: "  발밑에 풀이 무성해졌다!",
		end: "  발밑의 풀이 사라졌다!",
		heal: "", // NOT CONVERTED: not in Champions
	},
	mistyterrain: {
		start: "  발밑이 안개로 자욱해졌다!",
		end: "  발밑의 안개가 사라졌다!",
		block: "  [POKEMON] 미스트필드가 지켜 주고 있다!",
	},
	psychicterrain: {
		start: "  발밑에서 이상한 느낌이 든다!",
		end: "  발밑의 이상한 느낌이 사라졌다!",
		block: "  [POKEMON] 사이코필드가 지켜 주고 있다!",
	},

	// field effects
	gravity: {
		start: "  중력이 강해졌다!",
		end: "  중력이 원래대로 되돌아왔다!",
		cant: "[POKEMON] 중력이 강해서 [MOVE] 쓸 수 없다!",
		activate: "[POKEMON] 중력의 영향으로 공중에 있을 수 없게 되었다!",
	},
	magicroom: {
		start: "  지니게 한 도구의 효과가 없어지는 공간을 만들어 냈다!",
		end: "  매직룸이 해제되어 도구의 효과가 원래대로 되돌아왔다!",
	},
	mudsport: {
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
	},
	trickroom: {
		start: "  [POKEMON] 시공을 뒤틀었다!",
		end: "  뒤틀린 시공이 원래대로 되돌아왔다!",
	},
	watersport: {
		start: "", // NOT CONVERTED: not in Champions
		end: "", // NOT CONVERTED: not in Champions
	},
	wonderroom: {
		start: "  방어와 특수방어가 바뀌는 공간을 만들어 냈다!",
		end: "  원더룸이 해제되어 방어와 특수방어가 원래대로 되돌아왔다!",
	},

	// misc
	crash: {
		damage: "  [POKEMON] 의욕이 넘쳐서 땅에 부딪쳤다!",
	},
};
