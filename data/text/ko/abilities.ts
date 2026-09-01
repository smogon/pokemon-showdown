export const AbilitiesText: { [id: IDEntry]: AbilityText } = {
	noability: {
		name: "특성 없음", // NEEDS QC
		shortDesc: "아무 효과가 없다.", // NEEDS QC
	},
	adaptability: {
		name: "적응력",
		// Official flavor text: "자신과 같은 타입의 기술 위력이 올라간다."
		desc: "이 포켓몬의 타입 일치 기술의 위력 보정이 1.5배가 아닌 2배가 된다.", // NEEDS QC
		shortDesc: "타입 일치 보정이 1.5배 대신 2배가 된다.", // NEEDS QC
	},
	aerilate: {
		name: "스카이스킨",
		// Official flavor text: "노말타입의 기술이 비행타입이 된다. 위력이 조금 올라간다."
		desc: "이 포켓몬의 노말타입 기술이 비행타입 기술이 되며 위력이 1.2배가 된다. 이 효과는 기술의 타입을 바꾸는 다른 효과보다 뒤에, 플라스마샤워와 송전의 효과보다는 앞에 적용된다.", // NEEDS QC
		shortDesc: "노말타입 기술이 비행타입이 되며 위력이 1.2배가 된다.", // NEEDS QC
		gen6: {
			desc: "이 포켓몬의 노말타입 기술이 비행타입 기술이 되며 위력이 1.3배가 된다. 이 효과는 기술의 타입을 바꾸는 다른 효과보다 뒤에, 플라스마샤워와 송전의 효과보다는 앞에 적용된다.", // NEEDS QC
			shortDesc: "이 포켓몬의 노말타입 기술이 비행타입이 되고 위력이 1.3배가 된다.", // NEEDS QC
		},
	},
	aftermath: {
		name: "유폭",
		// Official flavor text: "기절했을 때 접촉한 상대에게 데미지를 준다."
		desc: "이 포켓몬이 직접 공격으로 기절했을 때 공격한 포켓몬은 최대 HP의 1/4(버림)을 잃는다. 공격한 포켓몬의 특성이 매직가드인 경우나 배틀에 나와 있는 포켓몬 중에 특성이 습기인 포켓몬이 있는 경우에는 발동하지 않는다.", // NEEDS QC
		shortDesc: "직접 공격으로 기절하면 공격한 포켓몬이 최대 HP의 1/4을 잃는다.", // NEEDS QC

		damage: "  {POKEMON:topic} 데미지를 입었다!",
	},
	airlock: {
		name: "에어록",
		shortDesc: "이 포켓몬이 배틀에 나와 있는 동안 날씨의 효과가 사라진다.", // NEEDS QC

		start: "  날씨의 영향이 없어졌다!",
	},
	analytic: {
		name: "애널라이즈",
		// Official flavor text: "제일 마지막에 기술을 쓰면 기술의 위력이 올라간다."
		desc: "이 포켓몬이 그 턴의 마지막에 기술을 쓰면 위력이 1.3배가 된다. 파멸의소원과 미래예지에는 적용되지 않는다.", // NEEDS QC
		shortDesc: "그 턴의 마지막에 기술을 쓰면 위력이 1.3배가 된다.", // NEEDS QC
	},
	angerpoint: {
		name: "분노의경혈",
		// Official flavor text: "급소에 공격이 맞으면 크게 분노해 공격력이 최대가 된다."
		desc: "이 포켓몬이 대타가 아닌 본체로 급소에 맞았을 때 공격이 12단계 올라간다.", // NEEDS QC
		shortDesc: "대타가 아닌 본체로 급소에 맞으면 공격이 12단계 올라간다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬이나 이 포켓몬의 대타가 급소에 맞았을 때 공격이 12단계 올라간다.", // NEEDS QC
			shortDesc: "이 포켓몬이나 대타가 급소에 맞으면 공격이 12단계 올라간다.", // NEEDS QC
		},

		boost: "  {POKEMON:topic} 공격이 최고치까지 올라갔다!",
	},
	angershell: {
		name: "분노의껍질",
		desc: "이 포켓몬의 HP가 최대 HP의 1/2보다 많은 상태에서 공격을 받아 1/2 이하가 되면 공격·특수공격·스피드가 1단계씩 올라가고 방어와 특수방어가 1단계씩 떨어진다. 연속 공격 기술은 모든 공격이 끝난 뒤에 적용된다. 특성 우격다짐으로 추가 효과가 사라진 기술에는 발동하지 않는다.", // NEEDS QC
		shortDesc: "최대 HP의 1/2 이하가 되면 공격·특수공격·스피드 +1, 방어·특수방어 -1.", // NEEDS QC
	},
	anticipation: {
		name: "위험예지",
		// Official flavor text: "상대가 지닌 위험한 기술을 감지할 수 있다."
		desc: "등장했을 때 상대가 이 포켓몬에게 효과가 뛰어난 공격 기술이나 일격필살 기술을 지니고 있으면 이를 감지해 몸을 떤다. 잠재파워는 실제 타입으로, 그 외의 기술은 원래 타입으로 판정한다.", // NEEDS QC
		shortDesc: "등장했을 때 상대에게 효과가 뛰어난 기술이나 일격필살 기술이 있으면 몸을 떤다.", // NEEDS QC
		gen5: {
			desc: "등장했을 때 상대가 이 포켓몬에게 효과가 뛰어난 공격 기술이나 일격필살 기술을 지니고 있으면 이를 감지해 몸을 떤다. 기술은 원래 타입으로 판정한다.", // NEEDS QC
		},
		gen4: {
			desc: "등장했을 때 상대가 이 포켓몬에게 효과가 뛰어난 공격 기술을 지니고 있거나, 이 포켓몬에게 무효가 아닌 타입의 일격필살 기술을 지닌 상대의 레벨이 이 포켓몬보다 낮지 않으면 이를 감지해 몸을 떤다. 기술은 원래 타입으로 판정한다. 카운터, 용의분노, 메탈버스트, 미러코트, 나이트헤드, 사이코웨이브, 지구던지기는 이 효과를 발동시키지 않는다. 조건을 판정하기 전에 이 포켓몬이 검은철구를 지녔는지, 꿰뚫어보기, 중력, 뿌리박기, 미라클아이, 날개쉬기의 효과를 받는지, 상대의 특성이 노말스킨이나 배짱인지를 고려한다.", // NEEDS QC
		},

		activate: "  {POKEMON:topic} 몸을 떨었다!",
	},
	arenatrap: {
		name: "개미지옥",
		// Official flavor text: "배틀에서 상대를 도망칠 수 없게 한다."
		desc: "상대는 교체할 수 없다. 떠 있는 포켓몬, 아름다운허물을 지닌 포켓몬, 고스트타입 포켓몬은 교체할 수 있다.", // NEEDS QC
		shortDesc: "떠 있는 포켓몬을 제외한 상대는 교체할 수 없다.", // NEEDS QC
		gen6: {
			desc: "이웃한 상대는 교체할 수 없다. 떠 있는 포켓몬, 아름다운허물을 지닌 포켓몬, 고스트타입 포켓몬은 교체할 수 있다.", // NEEDS QC
		},
		gen5: {
			desc: "이웃한 상대는 교체할 수 없다. 떠 있는 포켓몬과 아름다운허물을 지닌 포켓몬은 교체할 수 있다.", // NEEDS QC
		},
		gen4: {
			desc: "상대는 교체할 수 없다. 떠 있는 포켓몬과 아름다운허물을 지닌 포켓몬은 교체할 수 있다.", // NEEDS QC
		},
		gen3: {
			desc: "상대는 교체할 수 없다. 떠 있는 포켓몬은 교체할 수 있다.", // NEEDS QC
		},
	},
	armortail: {
		name: "테일아머",
		desc: "상대가 이 포켓몬이나 아군에게 쓰는 선제 기술은 발동하지 않는다.", // NEEDS QC
		shortDesc: "이 포켓몬과 아군은 상대의 선제 기술을 받지 않는다.", // NEEDS QC

		block: "#damp",
	},
	aromaveil: {
		name: "아로마베일",
		// Official flavor text: "자신과 같은 편으로 향하는 멘탈 공격을 막을 수 있다."
		desc: "이 포켓몬과 아군은 헤롱헤롱, 사슬묶기, 앙코르, 회복봉인, 도발, 트집의 효과를 받지 않는다.", // NEEDS QC
		shortDesc: "자신과 아군은 헤롱헤롱, 사슬묶기, 앙코르, 회복봉인, 도발, 트집의 효과를 받지 않는다.", // NEEDS QC

		block: "  {POKEMON:object} 아로마베일이 지켜 주고 있다!",
	},
	asone: {
		name: "혼연일체",
		shortDesc: "'혼연일체(블리자포스)'와 '혼연일체(레이스포스)' 참조.", // NEEDS QC

		start: "  {POKEMON:topic} 두 가지 특성을 겸비한다!",
	},
	asoneglastrier: {
		name: "혼연일체 (블리자포스)", // PS-style disambiguator (not part of the official name)
		shortDesc: "긴장감과 백의울음의 효과를 합친 특성.", // NEEDS QC
	},
	asonespectrier: {
		name: "혼연일체 (레이스포스)", // PS-style disambiguator (not part of the official name)
		shortDesc: "긴장감과 흑의울음의 효과를 합친 특성.", // NEEDS QC
	},
	aurabreak: {
		name: "오라브레이크",
		// Official flavor text: "오라의 효과를 역전시켜 위력을 떨어뜨린다."
		desc: "이 포켓몬이 배틀에 나와 있는 동안 다크오라와 페어리오라의 효과가 반전되어, 악타입과 페어리타입 기술의 위력이 각각 1.33배가 아닌 3/4배가 된다.", // NEEDS QC
		shortDesc: "이 포켓몬이 배틀에 나와 있는 동안 다크오라와 페어리오라의 보정이 0.75배가 된다.", // NEEDS QC

		start: "  {POKEMON:topic} 모든 오라를 제압한다!",
	},
	auraguard: {
		name: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	baddreams: {
		name: "나이트메어",
		// Official flavor text: "잠듦 상태의 상대에게 데미지를 준다."
		desc: "매 턴 종료 시 잠들어 있는 상대 포켓몬은 최대 HP의 1/8(버림)을 잃는다.", // NEEDS QC
		shortDesc: "잠들어 있는 상대는 매 턴 종료 시 최대 HP의 1/8을 잃는다.", // NEEDS QC
		gen6: {
			desc: "매 턴 종료 시 잠들어 있는 이웃한 상대 포켓몬은 최대 HP의 1/8(버림)을 잃는다.", // NEEDS QC
			shortDesc: "매 턴 종료 시 잠들어 있는 이웃한 상대는 최대 HP의 1/8을 잃는다.", // NEEDS QC
		},
		gen4: {
			desc: "매 턴 종료 시 잠들어 있는 상대 포켓몬은 최대 HP의 1/8(버림)을 잃는다.", // NEEDS QC
			shortDesc: "잠들어 있는 상대는 매 턴 종료 시 최대 HP의 1/8을 잃는다.", // NEEDS QC
		},

		damage: "  {POKEMON:topic} 나이트메어에 시달리고 있다!",
	},
	ballfetch: {
		name: "볼줍기",
		shortDesc: "배틀에서는 효과가 없다.", // NEEDS QC
	},
	battery: {
		name: "배터리",
		shortDesc: "아군의 특수 기술의 위력이 1.3배가 된다.", // NEEDS QC
	},
	battlearmor: {
		name: "전투무장",
		shortDesc: "급소에 맞지 않는다.", // NEEDS QC
	},
	battlebond: {
		name: "유대변화",
		// Official flavor text: "상대를 쓰러뜨리면 트레이너와의 유대감이 깊어져서 지우개굴닌자로 변한다. 물수리검이 강해진다."
		desc: "이 포켓몬이 개굴닌자일 때 공격으로 다른 포켓몬을 기절시키면 공격·특수공격·스피드가 1단계씩 올라간다. 이 효과는 배틀에서 1번만 발동한다.", // NEEDS QC
		shortDesc: "상대를 기절시키면 공격·특수공격·스피드가 1단계씩 올라간다. 배틀에서 1번만.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬이 개굴닌자일 때 공격으로 다른 포켓몬을 기절시키면 지우개굴닌자로 변한다. 지우개굴닌자의 물수리검은 위력이 20이 되고 반드시 3회 공격한다.", // NEEDS QC
			shortDesc: "상대를 쓰러뜨리면 지우개굴닌자로 변한다. 물수리검: 위력 20, 3회 공격.", // NEEDS QC
		},
		activate: "  {POKEMON:directional}부터 유대의 힘이 넘쳐흐른다!",
		transform: "{POKEMON:topic} 지우개굴닌자로 변했다!",
	},
	beadsofruin: {
		name: "재앙의구슬",
		shortDesc: "이 특성이 아닌 모든 포켓몬의 특수방어가 0.75배가 된다.", // NEEDS QC

		start: "  {POKEMON}의 재앙의구슬에 의해 주위의 특수방어가 약해졌다!",
	},
	beastboost: {
		name: "비스트부스트",
		// Official flavor text: "상대를 기절시켰을 때 자신의 가장 높은 능력이 올라간다."
		desc: "이 포켓몬이 공격으로 다른 포켓몬을 기절시키면 자신의 가장 높은 능력이 1단계 올라간다. 능력 랭크 변화는 고려하지 않는다. 가장 높은 능력이 여러 개라면 공격, 방어, 특수공격, 특수방어, 스피드 순으로 우선한다.", // NEEDS QC
		shortDesc: "공격으로 상대를 기절시키면 가장 높은 능력이 1단계 올라간다.", // NEEDS QC
	},
	berserk: {
		name: "발끈",
		// Official flavor text: "상대의 공격으로 HP가 절반이 되면 특수공격이 올라간다."
		desc: "이 포켓몬의 HP가 최대 HP의 1/2보다 많은 상태에서 공격을 받아 1/2 이하가 되면 특수공격이 1단계 올라간다. 연속 공격 기술은 모든 공격이 끝난 뒤에 적용된다. 특성 우격다짐으로 추가 효과가 사라진 기술에는 발동하지 않는다.", // NEEDS QC
		shortDesc: "최대 HP의 1/2 이하가 되면 특수공격이 1단계 올라간다.", // NEEDS QC
	},
	bigpecks: {
		name: "부풀린가슴",
		shortDesc: "다른 포켓몬에 의해 방어가 떨어지지 않는다.", // NEEDS QC
	},
	blaze: {
		name: "맹화",
		// Official flavor text: "HP가 줄었을 때 불꽃타입 기술의 위력이 올라간다."
		desc: "이 포켓몬의 HP가 최대 HP의 1/3(버림) 이하일 때 불꽃타입 기술로 공격하면 공격 또는 특수공격이 1.5배가 된다.", // NEEDS QC
		shortDesc: "최대 HP의 1/3 이하일 때 불꽃타입 기술의 공격 또는 특수공격이 1.5배가 된다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬의 HP가 최대 HP의 1/3(버림) 이하일 때 불꽃타입 공격 기술의 위력이 1.5배가 된다.", // NEEDS QC
			shortDesc: "HP가 1/3 이하일 때 불꽃타입 공격의 위력이 1.5배가 된다.", // NEEDS QC
		},
	},
	bulletproof: {
		name: "방탄",
		shortDesc: "구슬·폭탄 기술을 받지 않는다.", // NEEDS QC
	},
	cheekpouch: {
		name: "볼주머니",
		// Official flavor text: "어떤 나무열매라도 먹으면 HP도 회복한다."
		desc: "이 포켓몬이 지닌 나무열매를 먹으면 나무열매의 효과에 더해 최대 HP의 1/3(버림)을 회복한다. 벌레먹기, 내던지기, 쪼아대기, 볼가득넣기, 다과회로 먹은 나무열매가 이 포켓몬에게 효과가 있었을 때도 발동한다.", // NEEDS QC
		shortDesc: "나무열매를 먹으면 그 효과에 더해 최대 HP의 1/3을 회복한다.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬이 지닌 나무열매를 먹으면 나무열매의 효과에 더해 최대 HP의 1/3(버림)을 회복한다. 벌레먹기, 내던지기, 쪼아대기로 먹은 나무열매가 이 포켓몬에게 효과가 있었을 때도 발동한다.", // NEEDS QC
		},
	},
	chillingneigh: {
		name: "백의울음",
		// Official flavor text: "상대를 쓰러뜨리면 차가운 울음소리를 내면서 공격이 올라간다."
		desc: "이 포켓몬이 공격으로 다른 포켓몬을 기절시키면 공격이 1단계 올라간다.", // NEEDS QC
		shortDesc: "공격으로 상대를 기절시키면 공격이 1단계 올라간다.", // NEEDS QC
	},
	chlorophyll: {
		name: "엽록소",
		// Official flavor text: "날씨가 맑을 때 스피드가 올라간다."
		desc: "날씨가 쾌청이 되어 있으면 이 포켓몬의 스피드가 2배가 된다. 만능우산을 지니고 있으면 발동하지 않는다.", // NEEDS QC
		shortDesc: "날씨가 쾌청이 되어 있으면 스피드가 2배가 된다.", // NEEDS QC
		gen7: {
			desc: "날씨가 쾌청이 되어 있으면 이 포켓몬의 스피드가 2배가 된다.", // NEEDS QC
		},
	},
	clearbody: {
		name: "클리어바디",
		shortDesc: "다른 포켓몬에 의해 능력이 떨어지지 않는다.", // NEEDS QC
	},
	cloudnine: {
		name: "날씨부정",
		shortDesc: "이 포켓몬이 배틀에 나와 있는 동안 날씨의 효과가 사라진다.", // NEEDS QC

		start: "#airlock",
	},
	colorchange: {
		name: "변색",
		// Official flavor text: "상대에게 받은 기술의 타입으로 자신의 타입이 변화한다."
		desc: "이 포켓몬의 타입이 마지막으로 받은 기술의 타입으로 변한다. 이미 그 타입이라면 변하지 않는다. 연속 공격 기술은 모든 공격이 끝난 뒤에 적용된다. 특성 우격다짐으로 추가 효과가 사라진 기술에는 발동하지 않는다.", // NEEDS QC
		shortDesc: "자신에게 없는 타입의 기술에 맞으면 그 타입으로 변한다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬의 타입이 마지막으로 받은 기술의 타입으로 변한다. 이미 그 타입이라면 변하지 않는다. 연속 공격 기술은 공격마다 적용된다. 이 공격으로 HP를 잃지 않았다면 발동하지 않는다.", // NEEDS QC
		},
	},
	comatose: {
		name: "절대안깸",
		// Official flavor text: "항상 비몽사몽 상태로 절대 깨지 않는다. 잠든 상태로 공격할 수 있다."
		desc: "이 포켓몬은 항상 잠들어 있는 상태로 취급되며, 상태 이상이나 하품의 효과를 받지 않는다.", // NEEDS QC
		shortDesc: "상태 이상이 되지 않으며, 항상 잠들어 있는 상태로 취급된다.", // NEEDS QC

		start: "  {POKEMON:topic} 비몽사몽 상태!",
	},
	commander: {
		name: "사령탑",
		desc: "이 포켓몬이 싸리용일 때 아군 어써러셔가 배틀에 나와 있으면 어써러셔의 입속으로 들어간다. 어써러셔는 공격, 특수공격, 스피드, 방어, 특수방어가 2단계씩 올라간다. 효과가 지속되는 동안 어써러셔는 교체할 수 없고, 이 포켓몬은 행동을 선택할 수 없으며, 이 포켓몬을 노리는 공격은 피하지만 간접적인 데미지는 받는다. 이 포켓몬이 기절하면 다른 포켓몬으로 교체해 내보낼 수 있지만 어써러셔는 여전히 교체할 수 없다. 어써러셔가 기절하면 이 포켓몬은 다시 행동을 선택할 수 있게 된다.", // NEEDS QC
		shortDesc: "아군 어써러셔의 입속으로 들어가고, 어써러셔의 모든 능력이 2단계 올라간다.", // NEEDS QC

		activate: "  {POKEMON:topic} 사령탑이 되어 {TARGET}에게 삼켜졌다!",
	},
	competitive: {
		name: "승기",
		// Official flavor text: "능력이 떨어지면 특수공격이 크게 올라간다."
		desc: "상대에 의해 능력이 1단계 떨어질 때마다 이 포켓몬의 특수공격이 2단계 올라간다.", // NEEDS QC
		shortDesc: "상대에 의해 능력이 1단계 떨어질 때마다 특수공격이 2단계 올라간다.", // NEEDS QC
	},
	compoundeyes: {
		name: "복안",
		shortDesc: "기술의 명중률이 1.3배가 된다.", // NEEDS QC
	},
	contrary: {
		name: "심술꾸러기",
		shortDesc: "능력 랭크 변화가 반대로 일어난다. 올라갈 때는 떨어지고, 떨어질 때는 올라간다.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬은 능력이 올라갈 때 대신 떨어지고, 떨어질 때 대신 올라간다. Z기술을 쓰기 전에 Z파워 효과로 받는 능력 상승에는 적용되지 않는다.", // NEEDS QC
		},
		gen6: {
			desc: "이 포켓몬은 능력이 올라갈 때 대신 떨어지고, 떨어질 때 대신 올라간다.", // NEEDS QC
		},
	},
	corrosion: {
		name: "부식",
		shortDesc: "타입과 관계없이 상대를 독 또는 맹독 상태로 만들 수 있다.", // NEEDS QC
	},
	costar: {
		name: "협연",
		shortDesc: "등장했을 때 아군의 능력 랭크 변화를 모두 복사한다.", // NEEDS QC
	},
	cottondown: {
		name: "솜털",
		// Official flavor text: "공격을 받으면 솜털을 흩뿌려서 자신을 제외한 모든 포켓몬의 스피드를 떨어뜨린다."
		desc: "이 포켓몬이 공격을 받으면 자신 이외의 모든 포켓몬의 스피드가 1단계 떨어진다.", // NEEDS QC
		shortDesc: "공격을 받으면 자신 이외의 모든 포켓몬의 스피드가 1단계 떨어진다.", // NEEDS QC
	},
	cudchew: {
		name: "되새김질",
		shortDesc: "나무열매를 먹으면 다음 턴 종료 시 그 나무열매를 한 번 더 먹는다.", // NEEDS QC
	},
	curiousmedicine: {
		name: "기묘한약",
		shortDesc: "등장했을 때 아군의 능력 랭크 변화를 0으로 되돌린다.", // NEEDS QC
	},
	cursedbody: {
		name: "저주받은바디",
		// Official flavor text: "공격을 받으면 상대의 기술을 사슬묶기 상태로 만들 때가 있다."
		desc: "이 포켓몬이 공격을 받았을 때 30%의 확률로 그 기술을 사슬묶기 상태로 만든다. 공격한 포켓몬의 기술이 이미 사슬묶기 상태라면 발동하지 않는다.", // NEEDS QC
		shortDesc: "공격을 받으면 30%의 확률로 그 기술을 사슬묶기 상태로 만든다.", // NEEDS QC
	},
	cutecharm: {
		name: "헤롱헤롱바디",
		// Official flavor text: "자신과 접촉한 상대를 헤롱헤롱 상태로 만들 때가 있다."
		desc: "이 포켓몬에게 직접 공격으로 접촉한 다른 성별의 포켓몬을 30%의 확률로 헤롱헤롱 상태로 만든다.", // NEEDS QC
		shortDesc: "직접 공격으로 접촉한 다른 성별의 포켓몬을 30%의 확률로 헤롱헤롱 상태로 만든다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 다른 성별의 포켓몬을 30%의 확률로 헤롱헤롱 상태로 만든다. 이 공격으로 HP를 잃지 않았다면 발동하지 않는다.", // NEEDS QC
		},
		gen3: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 다른 성별의 포켓몬을 1/3의 확률로 헤롱헤롱 상태로 만든다. 이 공격으로 HP를 잃지 않았다면 발동하지 않는다.", // NEEDS QC
			shortDesc: "접촉한 다른 성별의 포켓몬을 1/3의 확률로 헤롱헤롱 상태로 만든다.", // NEEDS QC
		},
	},
	damp: {
		name: "습기",
		// Official flavor text: "주변을 습하게 함으로써 자폭 등 폭발하는 기술을 아무도 못 쓰게 한다."
		desc: "이 포켓몬이 배틀에 나와 있는 동안 대폭발, 깜짝헤드, 미스트버스트, 자폭과 특성 유폭은 발동하지 않는다.", // NEEDS QC
		shortDesc: "배틀에 나와 있는 동안 대폭발, 깜짝헤드, 미스트버스트, 자폭, 유폭의 발동을 막는다.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬이 배틀에 나와 있는 동안 대폭발, 깜짝헤드, 자폭과 특성 유폭은 발동하지 않는다.", // NEEDS QC
			shortDesc: "배틀에 있는 동안 대폭발/깜짝헤드/자폭/유폭을 막는다.", // NEEDS QC
		},
		gen6: {
			desc: "이 포켓몬이 배틀에 나와 있는 동안 대폭발, 자폭과 특성 유폭은 발동하지 않는다.", // NEEDS QC
			shortDesc: "배틀에 있는 동안 대폭발/자폭/유폭을 막는다.", // NEEDS QC
		},
		gen3: {
			desc: "이 포켓몬이 배틀에 나와 있는 동안 대폭발과 자폭은 발동하지 않는다.", // NEEDS QC
			shortDesc: "배틀에 있는 동안 대폭발과 자폭을 막는다.", // NEEDS QC
		},

		block: "  {SOURCE:topic} {MOVE:object} 쓸 수 없다!",
	},
	dancer: {
		name: "무희",
		// Official flavor text: "누군가 춤 기술을 쓰면 자신도 이어서 춤 기술을 쓸 수 있다."
		desc: "다른 포켓몬이 춤 기술을 쓰면 이 포켓몬도 같은 기술을 따라 쓴다. 따라 쓴 기술도 기술 실행을 막는 모든 효과의 영향을 받는다. 이 특성으로 쓴 기술은 이 특성을 지닌 다른 포켓몬이 다시 따라 쓸 수 없다.", // NEEDS QC
		shortDesc: "다른 포켓몬이 춤 기술을 쓰면 자신도 같은 기술을 따라 쓴다.", // NEEDS QC
	},
	darkaura: {
		name: "다크오라",
		// Official flavor text: "전원의 악타입 기술이 강해진다."
		desc: "이 포켓몬이 배틀에 나와 있는 동안 모든 포켓몬의 악타입 기술의 위력이 1.33배가 된다.", // NEEDS QC
		shortDesc: "이 포켓몬이 배틀에 나와 있는 동안 모든 포켓몬의 악타입 기술의 위력이 1.33배가 된다.", // NEEDS QC

		start: "  {POKEMON:topic} 다크오라를 발산하고 있다!",
	},
	dauntlessshield: {
		name: "불굴의방패",
		shortDesc: "등장했을 때 방어가 1단계 올라간다. 배틀에서 1번만.", // NEEDS QC
		gen8: {
			shortDesc: "등장했을 때 방어가 1단계 올라간다.", // NEEDS QC
		},
	},
	dazzling: {
		name: "비비드바디",
		// Official flavor text: "상대를 놀라게 해서 이쪽을 향한 선제 기술을 사용할 수 없게 한다."
		desc: "상대가 이 포켓몬이나 아군에게 쓰는 선제 기술은 발동하지 않는다.", // NEEDS QC
		shortDesc: "이 포켓몬과 아군은 상대의 선제 기술을 받지 않는다.", // NEEDS QC

		block: "#damp",
	},
	defeatist: {
		name: "무기력",
		// Official flavor text: "HP가 절반이 되면 무기력해져서 공격과 특수공격이 반감된다."
		desc: "이 포켓몬의 HP가 최대 HP의 1/2 이하인 동안 공격과 특수공격이 절반이 된다.", // NEEDS QC
		shortDesc: "최대 HP의 1/2 이하인 동안 공격과 특수공격이 절반이 된다.", // NEEDS QC
	},
	defiant: {
		name: "오기",
		// Official flavor text: "능력이 떨어지면 공격이 크게 올라간다."
		desc: "상대에 의해 능력이 1단계 떨어질 때마다 이 포켓몬의 공격이 2단계 올라간다.", // NEEDS QC
		shortDesc: "상대에 의해 능력이 1단계 떨어질 때마다 공격이 2단계 올라간다.", // NEEDS QC
	},
	deltastream: {
		name: "델타스트림",
		// Official flavor text: "비행타입의 약점이 없어지는 날씨로 만든다."
		desc: "등장했을 때 날씨가 난기류로 변한다. 난기류일 때는 비행타입의 약점이 사라진다. 이 특성을 지닌 포켓몬이 모두 배틀에서 벗어나거나, 끝의대지와 시작의바다에 의해 날씨가 변하면 난기류는 사라진다.", // NEEDS QC
		shortDesc: "등장했을 때 난기류가 몰아친다. 이 특성이 배틀에서 사라질 때까지 지속된다.", // NEEDS QC
	},
	desolateland: {
		name: "끝의대지",
		// Official flavor text: "물타입의 공격을 받지 않는 날씨로 만든다."
		desc: "등장했을 때 날씨가 큰가뭄로 변한다. 큰가뭄은 쾌청의 모든 효과에 더해 물타입 공격 기술을 실패하게 만든다. 이 특성을 지닌 포켓몬이 모두 배틀에서 벗어나거나, 델타스트림과 시작의바다에 의해 날씨가 변하면 큰가뭄은 사라진다.", // NEEDS QC
		shortDesc: "등장했을 때 날씨가 큰가뭄이 된다. 이 특성이 배틀에서 사라질 때까지 지속된다.", // NEEDS QC
	},
	disguise: {
		name: "탈",
		// Official flavor text: "몸을 덮는 탈로 1번 공격을 막을 수 있다."
		desc: "이 포켓몬이 따라큐일 때 배틀에서 처음 받는 공격은 데미지가 0이 된다. 그 후 탈이 벗겨져 모습이 들킨 모습으로 변하고 최대 HP의 1/8을 잃는다. 혼란에 의한 데미지로도 탈이 벗겨진다.", // NEEDS QC
		shortDesc: "(따라큐 전용) 처음 받는 공격을 막고 대신 최대 HP의 1/8을 잃는다.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬이 따라큐일 때 배틀에서 처음 받는 공격은 데미지가 0이 된다. 그 후 탈이 벗겨져 모습이 들킨 모습으로 변한다. 혼란에 의한 데미지로도 탈이 벗겨진다.", // NEEDS QC
			shortDesc: "(따라큐 전용) 처음 받는 공격은 데미지 0. 탈이 벗겨진다.", // NEEDS QC
		},

		block: "  탈이 대타가 되었다!",
		transform: "{POKEMON}의 정체가 드러났다!",
	},
	download: {
		name: "다운로드",
		// Official flavor text: "상대의 방어와 특수방어를 비교해서 낮은 쪽 능력에 맞춰서 자신의 공격이나 특수공격을 올린다."
		desc: "등장했을 때 상대 전원의 방어 합계와 특수방어 합계를 비교해 낮은 쪽에 대응하는 능력이 1단계 올라간다. 방어가 더 낮으면 공격이, 특수방어가 같거나 더 낮으면 특수공격이 올라간다.", // NEEDS QC
		shortDesc: "등장했을 때 상대의 더 낮은 방어 쪽에 맞춰 공격 또는 특수공격이 1단계 올라간다.", // NEEDS QC
	},
	dragonize: {
		name: "드래곤스킨",
		desc: "이 포켓몬의 노말타입 기술이 드래곤타입 기술이 되며 위력이 1.2배가 된다. 이 효과는 기술의 타입을 바꾸는 다른 효과보다 뒤에, 플라스마샤워와 송전의 효과보다는 앞에 적용된다.", // NEEDS QC
		shortDesc: "노말타입 기술이 드래곤타입이 되며 위력이 1.2배가 된다.", // NEEDS QC
	},
	dragonsmaw: {
		name: "용의턱",
		shortDesc: "드래곤타입 기술의 공격 또는 특수공격이 1.5배가 된다.", // NEEDS QC
	},
	drizzle: {
		name: "잔비",
		shortDesc: "등장했을 때 날씨를 비로 만든다.", // NEEDS QC
	},
	drought: {
		name: "가뭄",
		shortDesc: "등장했을 때 날씨를 쾌청으로 만든다.", // NEEDS QC
	},
	dryskin: {
		name: "건조피부",
		// Official flavor text: "비가 오는 날씨나 물타입의 기술로 HP가 회복되고 맑을 때나 불꽃타입의 기술로는 줄어든다."
		desc: "이 포켓몬은 물타입 기술을 받지 않으며, 물타입 기술을 받으면 최대 HP의 1/4(버림)을 회복한다. 불꽃타입 기술의 데미지는 1.25배로 받는다. 매 턴 종료 시 날씨가 비가 되어 있으면 최대 HP의 1/8(버림)을 회복하고, 쾌청이 되어 있으면 최대 HP의 1/8(버림)을 잃는다. 만능우산을 지니고 있으면 날씨의 효과는 발동하지 않는다.", // NEEDS QC
		shortDesc: "물타입 기술로 1/4, 비에서 1/8 회복. 불꽃 데미지 1.25배, 쾌청에서 1/8을 잃는다.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬은 물타입 기술을 받지 않으며, 물타입 기술을 받으면 최대 HP의 1/4(버림)을 회복한다. 불꽃타입 기술의 데미지는 1.25배로 받는다. 매 턴 종료 시 날씨가 비가 되어 있으면 최대 HP의 1/8(버림)을 회복하고, 쾌청이 되어 있으면 최대 HP의 1/8(버림)을 잃는다.", // NEEDS QC
		},

		damage: "#aftermath",
	},
	earlybird: {
		name: "일찍기상",
		shortDesc: "잠듦 카운트가 1 대신 2씩 줄어든다.", // NEEDS QC
	},
	eartheater: {
		name: "흙먹기",
		desc: "이 포켓몬은 땅타입 기술을 받지 않으며, 땅타입 기술을 받으면 최대 HP의 1/4(버림)을 회복한다.", // NEEDS QC
		shortDesc: "땅타입 기술을 받으면 최대 HP의 1/4을 회복한다. 땅타입 기술을 받지 않는다.", // NEEDS QC
	},
	eelevate: {
		name: "천정부지",
		desc: "이 포켓몬은 땅타입 기술과 압정뿌리기, 독압정, 끈적끈적네트, 특성 개미지옥의 효과를 받지 않는다. 중력, 뿌리박기, 떨어뜨리기, 사우전드애로, 검은철구의 효과를 받으면 이 효과가 사라진다. 사우전드애로는 이 특성을 무시하고 명중한다. 또한 공격으로 다른 포켓몬을 기절시키면 가장 높은 능력이 1단계 올라간다. 능력 랭크 변화는 고려하지 않으며, 가장 높은 능력이 여러 개라면 공격, 방어, 특수공격, 특수방어, 스피드 순으로 우선한다.", // NEEDS QC
		shortDesc: "땅타입 기술을 받지 않는다. 상대를 기절시키면 가장 높은 능력이 1단계 올라간다.", // NEEDS QC
	},
	effectspore: {
		name: "포자",
		// Official flavor text: "공격으로 자신에게 접촉한 상대를 독이나 마비, 잠듦 상태로 만들 때가 있다."
		desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬을 30%의 확률로 독, 마비 또는 잠듦 상태로 만든다.", // NEEDS QC
		shortDesc: "직접 공격으로 접촉한 포켓몬을 30%의 확률로 독·마비·잠듦 상태로 만든다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬을 30%의 확률로 독, 마비 또는 잠듦 상태로 만든다. 이 공격으로 HP를 잃지 않았다면 발동하지 않는다.", // NEEDS QC
		},
		gen3: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬을 10%의 확률로 독, 마비 또는 잠듦 상태로 만든다. 이 공격으로 HP를 잃지 않았다면 발동하지 않는다.", // NEEDS QC
			shortDesc: "접촉한 포켓몬을 10%의 확률로 독/마비/잠듦 상태로 만든다.", // NEEDS QC
		},
	},
	electricsurge: {
		name: "일렉트릭메이커",
		shortDesc: "등장했을 때 일렉트릭필드를 펼친다.", // NEEDS QC
	},
	electromorphosis: {
		name: "전기로바꾸기",
		shortDesc: "공격을 받으면 충전의 효과를 얻는다.", // NEEDS QC

		start: "  {POKEMON:topic} {MOVE}에 맞아 충전되었다!",
	},
	embodyaspectcornerstone: {
		name: "초상투영 (주춧돌)", // PS-style disambiguator (not part of the official name)
		shortDesc: "등장했을 때 방어가 1단계 올라간다.", // NEEDS QC

		boost: "  {POKEMON:topic} 주춧돌의가면을 빛나게 하여 방어가 올라갔다!",
	},
	embodyaspecthearthflame: {
		name: "초상투영 (화덕)", // PS-style disambiguator (not part of the official name)
		shortDesc: "등장했을 때 공격이 1단계 올라간다.", // NEEDS QC

		boost: "  {POKEMON:topic} 화덕의가면을 빛나게 하여 공격이 올라갔다!",
	},
	embodyaspectteal: {
		name: "초상투영 (벽록)", // PS-style disambiguator (not part of the official name)
		shortDesc: "등장했을 때 스피드가 1단계 올라간다.", // NEEDS QC

		boost: "  {POKEMON:topic} 벽록의가면을 빛나게 하여 스피드가 올라갔다!",
	},
	embodyaspectwellspring: {
		name: "초상투영 (우물)", // PS-style disambiguator (not part of the official name)
		shortDesc: "등장했을 때 특수방어가 1단계 올라간다.", // NEEDS QC

		boost: "  {POKEMON:topic} 우물의가면을 빛나게 하여 특수방어가 올라갔다!",
	},
	emergencyexit: {
		name: "위기회피",
		// Official flavor text: "HP가 절반이 되면 위험을 회피하기 위해 지닌 포켓몬으로 돌아간다."
		desc: "이 포켓몬의 HP가 최대 HP의 1/2보다 많은 상태에서 데미지를 받아 1/2 이하가 되면 선택한 아군과 즉시 교체된다. 연속 공격 기술은 모든 공격이 끝난 뒤에 적용된다. 특성 우격다짐으로 추가 효과가 사라진 기술에는 발동하지 않는다. 직접적인 데미지와 간접적인 데미지 모두에 발동하지만 저주와 대타출동의 사용, 배북, 아픔나누기, 혼란에 의한 데미지는 예외다.", // NEEDS QC
		shortDesc: "최대 HP의 1/2 이하가 되면 배틀에서 물러난다.", // NEEDS QC
	},
	fairyaura: {
		name: "페어리오라",
		// Official flavor text: "전원의 페어리타입 기술이 강해진다."
		desc: "배틀에 나와 있는 동안 모든 포켓몬의 페어리타입 기술의 위력이 1.33배가 된다.", // NEEDS QC
		shortDesc: "배틀에 나와 있는 동안 모든 포켓몬의 페어리타입 기술의 위력이 1.33배가 된다.", // NEEDS QC

		start: "  {POKEMON:topic} 페어리오라를 발산하고 있다!",
	},
	filter: {
		name: "필터",
		shortDesc: "효과가 뛰어난 공격의 데미지를 3/4로 받는다.", // NEEDS QC
	},
	firemane: {
		name: "불꽃의갈기",
		shortDesc: "불꽃타입 기술의 공격 또는 특수공격이 1.5배가 된다.", // NEEDS QC
	},
	flamebody: {
		name: "불꽃몸",
		shortDesc: "직접 공격으로 접촉한 포켓몬을 30%의 확률로 화상 상태로 만든다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬을 30%의 확률로 화상 상태로 만든다. 이 공격으로 HP를 잃지 않았다면 발동하지 않는다.", // NEEDS QC
		},
		gen3: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬을 1/3의 확률로 화상 상태로 만든다. 이 공격으로 HP를 잃지 않았다면 발동하지 않는다.", // NEEDS QC
			shortDesc: "접촉한 포켓몬을 1/3의 확률로 화상 상태로 만든다.", // NEEDS QC
		},
	},
	flareboost: {
		name: "열폭주",
		// Official flavor text: "화상 상태가 되었을 때 특수 기술의 위력이 올라간다."
		desc: "이 포켓몬이 화상 상태일 때 특수 공격 기술의 위력이 1.5배가 된다.", // NEEDS QC
		shortDesc: "화상 상태일 때 특수 기술의 위력이 1.5배가 된다.", // NEEDS QC
	},
	flashfire: {
		name: "타오르는불꽃",
		// Official flavor text: "불꽃타입의 기술을 받으면 불꽃을 받아서 자신이 사용하는 불꽃타입의 기술이 강해진다."
		desc: "이 포켓몬은 불꽃타입 기술을 받지 않는다. 불꽃타입 기술을 처음 받으면 배틀에서 벗어나거나 특성이 바뀔 때까지 자신의 불꽃타입 공격 기술의 공격 또는 특수공격이 1.5배가 된다. 이 포켓몬이 얼음 상태일 때는 불꽃타입 기술로 녹지 않는다.", // NEEDS QC
		shortDesc: "불꽃타입 기술을 받지 않으며, 한 번 받으면 자신의 불꽃타입 기술이 1.5배가 된다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬은 얼음 상태가 아닌 한 불꽃타입 기술을 받지 않는다. 불꽃타입 기술을 처음 받으면 배틀에서 벗어나거나 특성이 바뀔 때까지 자신의 불꽃타입 공격의 데미지가 1.5배가 된다.", // NEEDS QC
		},
		gen3: {
			desc: "이 포켓몬은 얼음 상태가 아닌 한 불꽃타입 기술을 받지 않는다. 불꽃타입 기술을 처음 받으면 배틀에서 벗어나거나 특성이 바뀔 때까지 자신의 불꽃타입 공격의 데미지가 1.5배가 된다. 이 포켓몬이 상태 이상이거나, 불꽃타입이거나, 대타를 내세우고 있다면 도깨비불은 이 특성을 발동시키지 않는다.", // NEEDS QC
		},

		start: "  {POKEMON:topic} 불꽃의 위력이 올라갔다!",
	},
	flowergift: {
		name: "플라워기프트",
		// Official flavor text: "날씨가 맑을 때 자신과 같은 편의 공격과 특수방어의 능력이 올라간다."
		desc: "이 포켓몬이 체리꼬일 때 날씨가 쾌청이 되어 있으면 포지티브폼으로 변하고, 자신과 아군의 공격과 특수방어가 1.5배가 된다. 만능우산을 지니고 있으면 발동하지 않는다.", // NEEDS QC
		shortDesc: "체리꼬일 때 쾌청에서 자신과 아군의 공격과 특수방어가 1.5배가 된다.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬이 체리꼬이고 날씨가 쾌청이 되어 있으면 포지티브폼으로 변하고, 자신과 아군의 공격과 특수방어가 1.5배가 된다.", // NEEDS QC
		},
		gen4: {
			desc: "날씨가 쾌청이 되어 있으면 이 포켓몬과 아군의 공격과 특수방어가 1.5배가 된다.", // NEEDS QC
			shortDesc: "쾌청일 때 자신과 아군의 공격과 특수방어가 1.5배가 된다.", // NEEDS QC
		},
	},
	flowerveil: {
		name: "플라워베일",
		// Official flavor text: "같은 편의 풀타입 포켓몬은 능력이 떨어지지 않고 상태 이상도 되지 않는다."
		desc: "아군 풀타입 포켓몬은 다른 포켓몬에 의해 능력이 떨어지거나 상태 이상이 되지 않는다.", // NEEDS QC
		shortDesc: "아군 풀타입은 다른 포켓몬에 의해 능력이 떨어지거나 상태 이상이 되지 않는다.", // NEEDS QC

		block: "  {POKEMON:object} 플라워베일이 지켜 주고 있다!",
	},
	fluffy: {
		name: "복슬복슬",
		// Official flavor text: "상대로부터 받은 접촉하는 기술의 데미지를 반감시키지만 불꽃타입 기술의 데미지는 2배가 된다."
		desc: "이 포켓몬이 받는 직접 공격의 데미지는 절반이 되지만, 불꽃타입 기술의 데미지는 2배가 된다.", // NEEDS QC
		shortDesc: "직접 공격의 데미지를 절반으로, 불꽃타입 기술의 데미지를 2배로 받는다.", // NEEDS QC
	},
	forecast: {
		name: "기분파",
		// Official flavor text: "날씨의 영향을 받아 물타입, 불꽃타입, 얼음타입 중 하나로 변화한다."
		desc: "이 포켓몬이 캐스퐁일 때 모래바람을 제외한 날씨에 따라 타입이 변한다. 만능우산을 지니고 있으면 비와 쾌청에는 발동하지 않는다.", // NEEDS QC
		shortDesc: "캐스퐁의 타입이 모래바람을 제외한 날씨에 따라 변한다.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬이 캐스퐁이면 모래바람을 제외한 날씨에 따라 타입이 변한다.", // NEEDS QC
		},
	},
	forewarn: {
		name: "예지몽",
		// Official flavor text: "등장했을 때 상대가 지닌 기술을 하나만 꿰뚫어본다."
		desc: "등장했을 때 상대 포켓몬이 지닌 기술 중 위력이 가장 높은 기술 하나를 무작위로 알아낸다. 일격필살 기술은 위력 150, 카운터, 미러코트, 메탈버스트는 위력 120, 위력이 정해지지 않은 그 외의 공격 기술은 위력 80, 공격 기술이 아닌 기술은 위력 1로 판정한다.", // NEEDS QC
		shortDesc: "등장했을 때 상대의 가장 위력이 높은 기술을 알아낸다.", // NEEDS QC
		gen4: {
			desc: "등장했을 때 상대 포켓몬이 지닌 기술 중 위력이 가장 높은 기술 하나를 무작위로 알아낸다. 일격필살 기술은 위력 150, 카운터, 미러코트, 메탈버스트는 위력 120, 위력이 정해지지 않은 그 외의 공격 기술은 위력 80으로 판정한다.", // NEEDS QC
		},

		activate: "  {TARGET}의 {MOVE:object} 간파했다!",
		activateNoTarget: "  {POKEMON:topic} 예지몽으로 {MOVE:object} 간파했다!", // NEEDS QC
	},
	friendguard: {
		name: "프렌드가드",
		shortDesc: "아군은 다른 포켓몬의 공격 데미지를 3/4로 받는다.", // NEEDS QC
	},
	frisk: {
		name: "통찰",
		shortDesc: "등장했을 때 모든 상대가 지닌 도구를 알아낸다.", // NEEDS QC
		gen5: {
			shortDesc: "등장했을 때 무작위 상대 하나가 지닌 도구를 알아낸다.", // NEEDS QC
		},

		activate: "  {POKEMON:topic} {TARGET}의 {ITEM:object} 통찰했다!",
		activateNoTarget: "  {POKEMON:topic} {ITEM:object} 통찰했다!",
	},
	fullmetalbody: {
		name: "메탈프로텍트",
		shortDesc: "다른 포켓몬에 의해 능력이 떨어지지 않는다.", // NEEDS QC
	},
	furcoat: {
		name: "퍼코트",
		shortDesc: "방어가 2배가 된다.", // NEEDS QC
	},
	galewings: {
		name: "질풍날개",
		shortDesc: "HP가 가득 찼을 때 비행타입 기술의 우선도가 1 올라간다.", // NEEDS QC
		gen6: {
			shortDesc: "이 포켓몬의 비행타입 기술은 우선도가 1 올라간다.", // NEEDS QC
		},
	},
	galvanize: {
		name: "일렉트릭스킨",
		// Official flavor text: "노말타입 기술이 전기타입이 된다. 위력이 조금 올라간다."
		desc: "이 포켓몬의 노말타입 기술이 전기타입 기술이 되며 위력이 1.2배가 된다. 이 효과는 기술의 타입을 바꾸는 다른 효과보다 뒤에, 플라스마샤워와 송전의 효과보다는 앞에 적용된다.", // NEEDS QC
		shortDesc: "노말타입 기술이 전기타입이 되며 위력이 1.2배가 된다.", // NEEDS QC
	},
	gluttony: {
		name: "먹보",
		// Official flavor text: "HP가 줄어들면 먹을 나무열매를 HP가 절반일 때 먹어버린다."
		desc: "보통 최대 HP의 1/4 이하일 때 발동하는 나무열매를 지니고 있으면 최대 HP의 1/2 이하일 때 먹는다.", // NEEDS QC
		shortDesc: "보통 최대 HP의 1/4 이하에서 먹는 나무열매를 1/2 이하일 때 먹는다.", // NEEDS QC
	},
	goodasgold: {
		name: "황금몸",
		shortDesc: "변화 기술을 받지 않는다.", // NEEDS QC
	},
	gooey: {
		name: "미끈미끈",
		shortDesc: "직접 공격으로 접촉한 포켓몬의 스피드가 1단계 떨어진다.", // NEEDS QC
	},
	gorillatactics: {
		name: "무아지경",
		// Official flavor text: "공격이 올라가지만 처음에 선택한 기술 외에는 쓸 수 없게 된다."
		desc: "이 포켓몬의 공격이 1.5배가 되지만 처음 쓴 기술만 쓸 수 있게 된다. 다이맥스 중에는 발동하지 않는다.", // NEEDS QC
		shortDesc: "공격이 1.5배가 되지만 처음 쓴 기술만 선택할 수 있다.", // NEEDS QC
	},
	grasspelt: {
		name: "풀모피",
		shortDesc: "그래스필드가 펼쳐져 있으면 방어가 1.5배가 된다.", // NEEDS QC
	},
	grassysurge: {
		name: "그래스메이커",
		shortDesc: "등장했을 때 그래스필드를 펼친다.", // NEEDS QC
	},
	grimneigh: {
		name: "흑의울음",
		// Official flavor text: "상대를 쓰러뜨리면 무서운 울음소리를 내면서 특수공격이 올라간다."
		desc: "이 포켓몬이 공격으로 다른 포켓몬을 기절시키면 특수공격이 1단계 올라간다.", // NEEDS QC
		shortDesc: "공격으로 상대를 기절시키면 특수공격이 1단계 올라간다.", // NEEDS QC
	},
	guarddog: {
		name: "파수견",
		desc: "특성 위협의 효과를 받지 않고 대신 공격이 1단계 올라간다. 다른 포켓몬의 공격이나 도구에 의해 강제로 교체되지 않는다.", // NEEDS QC
		shortDesc: "위협의 효과 대신 공격이 1단계 올라간다. 강제로 교체되지 않는다.", // NEEDS QC
	},
	gulpmissile: {
		name: "그대로꿀꺽미사일",
		// Official flavor text: "파도타기나 다이빙을 쓰면 먹이를 물어온다. 데미지를 받으면 먹이를 토해내서 공격한다."
		desc: "이 포켓몬이 윽우지일 때 파도타기로 상대를 맞히거나 다이빙의 1턴째에 성공하면 모습이 변한다. 남은 HP가 최대 HP의 1/2보다 많으면 찌로꼬치를 문 그대로 삼킨 모습이, 1/2 이하면 피카츄를 문 통째로 삼킨 모습이 된다. 그 모습에서 공격을 받으면 HP가 남아 있지 않아도 찌로꼬치 또는 피카츄를 공격한 포켓몬에게 뱉어낸다. 뱉어낸 것은 상대의 최대 HP의 1/4(버림)만큼의 데미지를 주며, 이 데미지는 특성 매직가드로 막을 수 있지만 대타로는 막을 수 없다. 찌로꼬치는 추가로 상대의 방어를 1단계 떨어뜨리고, 피카츄는 상대를 마비시킨다. 뱉어내거나 교체되거나 다이맥스하면 원래 모습으로 돌아온다.", // NEEDS QC
		shortDesc: "파도타기·다이빙 후 공격받으면 공격자에게 최대 HP 1/4 데미지와 방어 -1 또는 마비.", // NEEDS QC
	},
	guts: {
		name: "근성",
		// Official flavor text: "상태 이상이 되면 근성을 보여서 공격이 올라간다."
		desc: "이 포켓몬이 상태 이상일 때 공격이 1.5배가 된다. 화상에 의한 물리 데미지 반감 효과도 무시한다.", // NEEDS QC
		shortDesc: "상태 이상일 때 공격이 1.5배가 된다. 화상에 의한 물리 데미지 반감도 무시한다.", // NEEDS QC
	},
	hadronengine: {
		name: "하드론엔진",
		shortDesc: "등장했을 때 일렉트릭필드를 펼친다. 그 필드에서 특수공격이 1.3333배가 된다.", // NEEDS QC

		start: "  {POKEMON:topic} 일렉트릭필드를 전개하여 미래 기관을 가동했다!!",
		activate: "  {POKEMON:topic} 일렉트릭필드의 힘으로 미래 기관을 가동했다!!",
	},
	harvest: {
		name: "수확",
		// Official flavor text: "사용한 나무열매를 몇 번이고 만들어 낸다."
		desc: "이 포켓몬이 마지막으로 쓴 도구가 나무열매라면 매 턴 종료 시 50%의 확률로 되찾는다. 날씨가 쾌청이 되어 있으면 반드시 되찾는다.", // NEEDS QC
		shortDesc: "마지막에 쓴 도구가 나무열매라면 매 턴 50%의 확률로 되찾는다. 쾌청에서는 100%.", // NEEDS QC

		addItem: "  {POKEMON:topic} {ITEM:object} 수확했다!",
	},
	healer: {
		name: "치유의마음",
		// Official flavor text: "같은 편의 상태 이상을 가끔 회복시킨다."
		desc: "매 턴 종료 시 30%의 확률로 아군의 상태 이상을 회복한다.", // NEEDS QC
		shortDesc: "매 턴 종료 시 30%의 확률로 아군의 상태 이상을 회복한다.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "매 턴 종료 시 이웃한 아군마다 30%의 확률로 상태 이상을 회복한다.", // NEEDS QC
			shortDesc: "매 턴 종료 시 이웃한 아군마다 30%의 확률로 상태 이상을 회복한다.", // NEEDS QC
		},
	},
	heatproof: {
		name: "내열",
		// Official flavor text: "내열인 몸으로 인해 불꽃타입 공격의 데미지를 반감한다."
		desc: "이 포켓몬이 받는 불꽃타입 공격은 공격한 포켓몬의 공격 또는 특수공격을 절반으로 계산한다. 화상에 의한 데미지도 절반(버림)으로 받는다.", // NEEDS QC
		shortDesc: "받는 불꽃타입 공격은 상대의 공격 능력을 절반으로 계산한다. 화상 데미지도 절반.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬이 받는 불꽃타입 공격의 위력이 절반이 된다. 화상에 의한 데미지도 절반(버림)으로 받는다.", // NEEDS QC
			shortDesc: "이 포켓몬이 받는 불꽃타입 공격의 위력이 절반. 화상 데미지도 절반.", // NEEDS QC
		},
	},
	heavymetal: {
		name: "헤비메탈",
		// Official flavor text: "자신의 무게가 2배가 된다."
		desc: "이 포켓몬의 무게가 2배가 된다. 이 효과는 바디퍼지의 효과보다 뒤에, 가벼운돌의 효과보다 앞에 계산된다.", // NEEDS QC
		shortDesc: "무게가 2배가 된다.", // NEEDS QC
	},
	honeygather: {
		name: "꿀모으기",
		shortDesc: "배틀에서는 효과가 없다.", // NEEDS QC
	},
	hospitality: {
		name: "대접",
		shortDesc: "등장했을 때 아군의 최대 HP의 1/4(버림)을 회복시킨다.", // NEEDS QC

		heal: "  {SOURCE:subject} 내온 차를 {POKEMON:subject} 모두 비웠다!",
	},
	hugepower: {
		name: "천하장사",
		shortDesc: "공격이 2배가 된다.", // NEEDS QC
	},
	hungerswitch: {
		name: "꼬르륵스위치",
		// Official flavor text: "턴이 끝날 때마다 배부른 모양, 배고픈 모양, 배부른 모양...으로 번갈아서 모습을 바꾼다."
		desc: "이 포켓몬이 모르페코일 때 매 턴 종료 시 배부른 모양과 배고픈 모양을 오간다.", // NEEDS QC
		shortDesc: "모르페코는 매 턴 종료 시 배부른 모양과 배고픈 모양을 오간다.", // NEEDS QC
	},
	hustle: {
		name: "의욕",
		// Official flavor text: "자신의 공격이 높아지지만 명중률이 떨어진다."
		desc: "이 포켓몬의 공격이 1.5배가 되지만 물리 공격 기술의 명중률이 0.8배가 된다.", // NEEDS QC
		shortDesc: "공격이 1.5배가 되지만 물리 기술의 명중률이 0.8배가 된다.", // NEEDS QC
	},
	hydration: {
		name: "촉촉바디",
		// Official flavor text: "비가 오는 날씨일 때 상태 이상이 회복된다."
		desc: "날씨가 비가 되어 있으면 매 턴 종료 시 상태 이상이 회복된다. 만능우산을 지니고 있으면 발동하지 않는다.", // NEEDS QC
		shortDesc: "날씨가 비가 되어 있으면 매 턴 종료 시 상태 이상이 회복된다.", // NEEDS QC
		gen7: {
			desc: "날씨가 비가 되어 있으면 매 턴 종료 시 상태 이상이 회복된다.", // NEEDS QC
		},
	},
	hypercutter: {
		name: "괴력집게",
		shortDesc: "다른 포켓몬에 의해 공격이 떨어지지 않는다.", // NEEDS QC
	},
	icebody: {
		name: "아이스바디",
		// Official flavor text: "날씨가 싸라기눈일 때 HP를 조금씩 회복한다."
		desc: "날씨가 눈일 때 매 턴 종료 시 최대 HP의 1/16(버림)을 회복한다.", // NEEDS QC
		shortDesc: "날씨가 눈일 때 매 턴 최대 HP의 1/16을 회복한다.", // NEEDS QC
		gen8: {
			desc: "날씨가 싸라기눈일 때 매 턴 종료 시 최대 HP의 1/16(버림)을 회복한다. 싸라기눈의 데미지를 받지 않는다.", // NEEDS QC
			shortDesc: "싸라기눈일 때 매 턴 최대 HP의 1/16을 회복. 싸라기눈 무효.", // NEEDS QC
		},
	},
	iceface: {
		name: "아이스페이스",
		// Official flavor text: "물리공격을 머리의 얼음이 대신 맞아주지만 모습도 바뀐다. 얼음은 싸라기눈이 내리면 원래대로 돌아온다."
		desc: "이 포켓몬이 빙큐보일 때 배틀에서 처음 받는 물리 공격은 데미지가 0이 된다. 그 후 얼음 머리가 부서져 나이스페이스 모습으로 변한다. 눈이 내리기 시작하거나 눈이 내리는 동안 등장하면 아이스페이스 모습으로 돌아온다. 혼란에 의한 데미지로도 얼음 머리가 부서진다.", // NEEDS QC
		shortDesc: "빙큐보가 처음 받는 물리 공격의 데미지가 0이 된다. 눈에서 효과가 돌아온다.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬이 빙큐보일 때 배틀에서 처음 받는 물리 공격은 데미지가 0이 된다. 그 후 얼음 머리가 부서져 나이스페이스 모습으로 변한다. 싸라기눈이 시작되거나 싸라기눈이 내리는 동안 등장하면 아이스페이스 모습으로 돌아온다. 혼란에 의한 데미지로도 얼음 머리가 부서진다.", // NEEDS QC
			shortDesc: "빙큐보가 처음 받는 물리 공격은 데미지 0. 싸라기눈에 회복된다.", // NEEDS QC
		},
	},
	icescales: {
		name: "얼음인분",
		shortDesc: "특수 공격의 데미지를 절반으로 받는다.", // NEEDS QC
	},
	illuminate: {
		name: "발광",
		// Official flavor text: "주변을 밝게 하는 것으로 야생 포켓몬과 만나기 쉬워진다."
		desc: "다른 포켓몬에 의해 명중률이 떨어지지 않는다. 상대의 회피율 랭크 변화를 무시하고 공격한다.", // NEEDS QC
		shortDesc: "다른 포켓몬에 의해 명중률이 떨어지지 않는다. 상대의 회피율을 무시한다.", // NEEDS QC
		gen8: {
			desc: "배틀에서는 효과가 없다.", // NEEDS QC
			shortDesc: "배틀에서는 효과가 없다.", // NEEDS QC
		},
	},
	illusion: {
		name: "일루전",
		// Official flavor text: "지닌 포켓몬 중 제일 뒤에 있는 포켓몬으로 둔갑하여 나와서 상대를 속인다."
		desc: "등장할 때 자신의 파티에서 기절하지 않은 마지막 포켓몬으로 둔갑한다. 다른 포켓몬의 공격으로 직접적인 데미지를 받으면 둔갑이 풀린다. 레벨과 HP는 둔갑한 포켓몬이 아닌 실제 수치가 표시된다.", // NEEDS QC
		shortDesc: "직접적인 데미지를 받을 때까지 파티의 마지막 포켓몬으로 둔갑한다.", // NEEDS QC

		end: "  {POKEMON}의 일루전이 풀렸다!",
	},
	immunity: {
		name: "면역",
		shortDesc: "독 상태가 되지 않는다. 독 상태일 때 이 특성을 얻으면 회복된다.", // NEEDS QC
	},
	imposter: {
		name: "괴짜",
		// Official flavor text: "눈앞의 포켓몬으로 변신해버린다."
		desc: "등장했을 때 마주 보고 있는 상대 포켓몬으로 변신한다. 그 자리에 포켓몬이 없으면 변신하지 않는다.", // NEEDS QC
		shortDesc: "등장했을 때 마주 보고 있는 상대 포켓몬으로 변신한다.", // NEEDS QC
	},
	infiltrator: {
		name: "틈새포착",
		// Official flavor text: "상대의 벽이나 대타출동을 뚫고 공격할 수 있다."
		desc: "이 포켓몬의 기술은 대타와 상대의 리플렉터, 빛의장막, 신비의부적, 흰안개, 오로라베일의 효과를 무시한다.", // NEEDS QC
		shortDesc: "기술이 대타와 상대의 리플렉터, 빛의장막, 신비의부적, 흰안개, 오로라베일을 무시한다.", // NEEDS QC
		gen6: {
			desc: "이 포켓몬의 기술은 대타와 상대의 리플렉터, 빛의장막, 신비의부적, 흰안개의 효과를 무시한다.", // NEEDS QC
			shortDesc: "기술이 대타와 상대의 리플렉터, 빛의장막, 신비의부적, 흰안개를 무시한다.", // NEEDS QC
		},
		gen5: {
			desc: "이 포켓몬의 기술은 상대의 리플렉터, 빛의장막, 신비의부적, 흰안개의 효과를 무시한다.", // NEEDS QC
			shortDesc: "기술이 상대의 리플렉터, 빛의장막, 신비의부적, 흰안개를 무시한다.", // NEEDS QC
		},
	},
	innardsout: {
		name: "내용물분출",
		// Official flavor text: "상대가 쓰러뜨렸을 때 HP의 남은 양만큼 상대에게 데미지를 준다."
		desc: "이 포켓몬이 기술로 기절했을 때 공격한 포켓몬은 이 포켓몬이 마지막으로 받은 데미지만큼 HP를 잃는다.", // NEEDS QC
		shortDesc: "기술로 기절하면 공격한 포켓몬이 같은 양의 HP를 잃는다.", // NEEDS QC

		damage: "#aftermath",
	},
	innerfocus: {
		name: "정신력",
		// Official flavor text: "단련한 정신으로 인하여 상대의 공격에 풀죽지 않는다."
		desc: "이 포켓몬은 풀죽지 않는다. 특성 위협의 효과를 받지 않는다.", // NEEDS QC
		shortDesc: "풀죽지 않는다. 위협의 효과를 받지 않는다.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬은 풀죽지 않는다.", // NEEDS QC
			shortDesc: "이 포켓몬은 풀죽지 않는다.", // NEEDS QC
		},
	},
	insomnia: {
		name: "불면",
		shortDesc: "잠듦 상태가 되지 않는다. 잠들어 있을 때 이 특성을 얻으면 깨어난다.", // NEEDS QC
	},
	intimidate: {
		name: "위협",
		// Official flavor text: "등장했을 때 위협해서 상대를 위축시켜 상대의 공격을 떨어뜨린다."
		desc: "등장했을 때 상대의 공격을 1단계 떨어뜨린다. 특성이 정신력, 둔감, 마이페이스, 배짱인 포켓몬이나 대타를 내세운 포켓몬에게는 효과가 없다.", // NEEDS QC
		shortDesc: "등장했을 때 상대의 공격을 1단계 떨어뜨린다.", // NEEDS QC
		gen7: {
			desc: "등장했을 때 상대의 공격을 1단계 떨어뜨린다. 대타를 내세운 포켓몬에게는 효과가 없다.", // NEEDS QC
		},
		gen6: {
			desc: "등장했을 때 이웃한 상대의 공격을 1단계 떨어뜨린다. 대타를 내세운 포켓몬에게는 효과가 없다.", // NEEDS QC
			shortDesc: "등장했을 때 이웃한 상대의 공격을 1단계 떨어뜨린다.", // NEEDS QC
		},
		gen4: {
			desc: "등장했을 때 상대의 공격을 1단계 떨어뜨린다. 대타를 내세운 포켓몬에게는 효과가 없다. 유턴이 상대의 대타를 부수고 이 포켓몬이 교체해 나와도, 대타를 내세웠던 포켓몬은 여전히 이 특성의 효과를 받지 않는다.", // NEEDS QC
			shortDesc: "등장했을 때 상대의 공격을 1단계 떨어뜨린다.", // NEEDS QC
		},
		gen3: {
			desc: "등장했을 때 상대의 공격을 1단계 떨어뜨린다. 대타를 내세운 포켓몬에게는 효과가 없다.", // NEEDS QC
		},
	},
	intrepidsword: {
		name: "불요의검",
		shortDesc: "등장했을 때 공격이 1단계 올라간다. 배틀에서 1번만.", // NEEDS QC
		gen8: {
			shortDesc: "등장했을 때 공격이 1단계 올라간다.", // NEEDS QC
		},
	},
	ironbarbs: {
		name: "철가시",
		// Official flavor text: "자신과 접촉한 상대에게 철가시로 데미지를 준다."
		desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬은 최대 HP의 1/8(버림)을 잃는다.", // NEEDS QC
		shortDesc: "직접 공격으로 접촉한 포켓몬은 최대 HP의 1/8을 잃는다.", // NEEDS QC

		damage: "#roughskin",
	},
	ironfist: {
		name: "철주먹",
		// Official flavor text: "펀치를 사용하는 기술의 위력이 올라간다."
		desc: "이 포켓몬의 펀치 기술의 위력이 1.2배가 된다.", // NEEDS QC
		shortDesc: "펀치 기술의 위력이 1.2배가 된다. 기습은 오르지 않는다.", // NEEDS QC
	},
	justified: {
		name: "정의의마음",
		shortDesc: "악타입 기술로 데미지를 받으면 공격이 1단계 올라간다.", // NEEDS QC
	},
	keeneye: {
		name: "날카로운눈",
		// Official flavor text: "날카로운 눈 덕분에 명중률이 떨어지지 않는다."
		desc: "다른 포켓몬에 의해 명중률이 떨어지지 않는다. 상대의 회피율 랭크 변화를 무시하고 공격한다.", // NEEDS QC
		shortDesc: "다른 포켓몬에 의해 명중률이 떨어지지 않는다. 상대의 회피율을 무시한다.", // NEEDS QC
		gen5: {
			desc: "이 포켓몬은 다른 포켓몬에 의해 명중률이 떨어지지 않는다.", // NEEDS QC
			shortDesc: "다른 포켓몬에 의해 명중률이 떨어지지 않는다.", // NEEDS QC
		},
	},
	klutz: {
		name: "서투름",
		// Official flavor text: "지니고 있는 도구를 쓸 수 없다."
		desc: "이 포켓몬이 지닌 도구는 효과가 없어진다. 내던지기는 쓸 수 없다. 교정깁스, 파워앵클릿, 파워밴드, 파워벨트, 파워리스트, 파워렌즈, 파워웨이트는 효과가 유지된다.", // NEEDS QC
		shortDesc: "지닌 도구가 효과를 잃는다(교정깁스는 예외). 내던지기를 쓸 수 없다.", // NEEDS QC
	},
	leafguard: {
		name: "리프가드",
		// Official flavor text: "날씨가 맑을 때는 상태 이상이 되지 않는다."
		desc: "날씨가 쾌청이 되어 있으면 상태 이상이나 하품의 효과를 받지 않고, 잠자기는 실패한다. 만능우산을 지니고 있으면 발동하지 않는다.", // NEEDS QC
		shortDesc: "쾌청에서는 상태 이상이 되지 않고 잠자기는 실패한다.", // NEEDS QC
		gen7: {
			desc: "날씨가 쾌청이 되어 있으면 이 포켓몬은 상태 이상이나 하품의 효과를 받지 않으며, 잠자기는 실패한다.", // NEEDS QC
		},
		gen4: {
			desc: "날씨가 쾌청이 되어 있으면 이 포켓몬은 상태 이상이나 하품의 효과를 받지 않지만, 잠자기는 평소대로 쓸 수 있다.", // NEEDS QC
			shortDesc: "쾌청일 때 상태 이상이 되지 않지만 잠자기는 평소대로 쓸 수 있다.", // NEEDS QC
		},
	},
	levitate: {
		name: "부유",
		// Official flavor text: "땅에서 뜨는 것으로 땅타입의 기술을 받지 않는다."
		desc: "이 포켓몬은 땅타입 기술과 압정뿌리기, 독압정, 끈적끈적네트, 특성 개미지옥의 효과를 받지 않는다. 중력, 뿌리박기, 떨어뜨리기, 사우전드애로, 검은철구의 효과를 받으면 이 효과가 사라진다. 사우전드애로는 이 특성을 무시하고 명중한다.", // NEEDS QC
		shortDesc: "땅타입 기술을 받지 않는다. 중력, 뿌리박기, 떨어뜨리기, 검은철구로 무효가 된다.", // NEEDS QC
		gen5: {
			desc: "이 포켓몬은 땅타입 기술과 압정뿌리기, 독압정, 특성 개미지옥의 효과를 받지 않는다. 중력, 뿌리박기, 떨어뜨리기, 검은철구의 효과를 받으면 무효화된다.", // NEEDS QC
		},
		gen4: {
			desc: "이 포켓몬은 땅타입 기술과 압정뿌리기, 독압정, 특성 개미지옥의 효과를 받지 않는다. 중력, 뿌리박기, 검은철구의 효과를 받으면 무효화된다.", // NEEDS QC
			shortDesc: "땅타입을 받지 않는다. 중력/뿌리박기/검은철구가 무효화한다.", // NEEDS QC
		},
		gen3: {
			desc: "이 포켓몬은 땅타입 기술과 압정뿌리기, 특성 개미지옥의 효과를 받지 않는다.", // NEEDS QC
			shortDesc: "이 포켓몬은 땅타입을 받지 않는다.", // NEEDS QC
		},
	},
	libero: {
		name: "리베로",
		// Official flavor text: "자신이 사용한 기술과 같은 타입으로 변화한다."
		desc: "이 포켓몬의 타입이 쓰려는 기술의 타입으로 변한다. 이 효과는 기술의 타입을 바꾸는 모든 효과보다 뒤에 적용된다. 등장할 때마다 1번만 발동하며, 테라스탈 중에는 발동하지 않는다.", // NEEDS QC
		shortDesc: "자신의 타입이 쓰는 기술의 타입으로 변한다. 등장할 때마다 1번만.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬의 타입이 쓰려는 기술의 타입으로 변한다. 이 효과는 기술의 타입을 바꾸는 모든 효과보다 뒤에 적용된다.", // NEEDS QC
			shortDesc: "이 포켓몬의 타입이 쓰려는 기술의 타입으로 변한다.", // NEEDS QC
		},
	},
	lightmetal: {
		name: "라이트메탈",
		// Official flavor text: "자신의 무게가 절반이 된다."
		desc: "이 포켓몬의 무게가 절반(0.1kg 단위 버림)이 된다. 이 효과는 바디퍼지의 효과보다 뒤에, 가벼운돌의 효과보다 앞에 계산된다. 무게는 0.1kg 미만이 되지 않는다.", // NEEDS QC
		shortDesc: "무게가 절반이 된다.", // NEEDS QC
	},
	lightningrod: {
		name: "피뢰침",
		// Official flavor text: "전기타입의 기술을 자신에게 끌어모아 데미지를 받지 않고 특수공격을 올린다."
		desc: "이 포켓몬은 전기타입 기술을 받지 않으며, 전기타입 기술을 받으면 특수공격이 1단계 올라간다. 다른 포켓몬이 쓰는 단일 대상 전기타입 기술의 대상이 아니라면, 그 기술의 범위 안에 있을 때 기술을 자신에게 끌어당긴다. 이 특성으로 끌어당길 수 있는 포켓몬이 여럿이라면 스피드가 가장 빠른 포켓몬이, 같다면 특성이 더 오래 활성화된 포켓몬이 끌어당긴다.", // NEEDS QC
		shortDesc: "전기타입 기술을 자신에게 끌어당겨 특수공격이 1단계 올라간다. 전기 무효.", // NEEDS QC
		gen4: {
			desc: "다른 포켓몬이 이 포켓몬이 아닌 단일 대상에게 전기타입 기술을 쓰면 그 기술을 자신에게로 끌어당긴다.", // NEEDS QC
			shortDesc: "단일 대상 전기타입 기술을 자신에게로 끌어당긴다.", // NEEDS QC
		},
		gen3: {
			desc: "상대가 이 포켓몬이 아닌 단일 대상에게 전기타입 기술을 쓰면 그 기술을 자신에게로 끌어당긴다. 잠재파워는 노말타입으로 취급한다.", // NEEDS QC
			shortDesc: "상대가 쓴 단일 대상 전기타입 기술을 자신에게로 끌어당긴다.", // NEEDS QC
		},

		activate: "  {POKEMON:topic} 공격을 끌어들였다!",
	},
	limber: {
		name: "유연",
		shortDesc: "마비 상태가 되지 않는다. 마비 상태일 때 이 특성을 얻으면 회복된다.", // NEEDS QC
	},
	lingeringaroma: {
		name: "가시지않는향기",
		desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬의 특성이 가시지않는향기로 변한다. 특성이 혼연일체, 유대변화, 절대안깸, 탈, 그대로꿀꺽미사일, 아이스페이스, 멀티타입, 가시지않는향기, 스웜체인지, AR시스템, 어군, 리밋실드, 배틀스위치, 테라체인지, 달마모드, 마이티체인지인 포켓몬에게는 효과가 없다.", // NEEDS QC
		shortDesc: "직접 공격으로 접촉한 포켓몬의 특성이 가시지않는향기로 변한다.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬의 특성이 가시지않는향기로 변한다. 특성이 혼연일체, 유대변화, 절대안깸, 탈, 그대로꿀꺽미사일, 아이스페이스, 가시지않는향기, 멀티타입, 스웜체인지, AR시스템, 어군, 리밋실드, 배틀스위치, 달마모드인 포켓몬에게는 효과가 없다.", // NEEDS QC
		},

		changeAbility: "  {TARGET}에게 향기가 배어서 가시지 않게 되었다!",
	},
	liquidooze: {
		name: "해감액",
		shortDesc: "자신의 HP를 흡수한 포켓몬은 회복하는 대신 같은 양의 데미지를 받는다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬에게서 HP를 흡수한 포켓몬은 회복할 양만큼 데미지를 받는다. 꿈먹기는 이 효과의 대상이 아니다.", // NEEDS QC
		},

		damage: "  {POKEMON:topic} 해감액을 흡수했다!",
	},
	liquidvoice: {
		name: "촉촉보이스",
		// Official flavor text: "모든 소리 기술이 물타입이 된다."
		desc: "이 포켓몬의 소리 기술이 물타입 기술이 된다. 이 효과는 기술의 타입을 바꾸는 다른 효과보다 뒤에, 플라스마샤워와 송전의 효과보다는 앞에 적용된다.", // NEEDS QC
		shortDesc: "소리 기술이 물타입이 된다.", // NEEDS QC
	},
	longreach: {
		name: "원격",
		shortDesc: "공격 기술이 상대와 접촉하지 않게 된다.", // NEEDS QC
	},
	magicbounce: {
		name: "매직미러",
		// Official flavor text: "상대가 쓴 변화 기술을 받지 않고 그대로 되받아칠 수 있다."
		desc: "이 포켓몬은 자신을 노리는 일부 변화 기술의 효과를 받지 않고 쓴 포켓몬에게 되받아친다. 되받아친 기술은 이 특성이나 매직코트의 효과로 다시 되받아칠 수 없다. 압정뿌리기, 스텔스록, 끈적끈적네트, 독압정은 진영당 1번만, 이 특성이나 매직코트의 효과를 받는 가장 왼쪽 포켓몬이 되받아친다. 특성 피뢰침과 마중물은 이 특성보다 먼저 각각의 기술을 끌어당긴다.", // NEEDS QC
		shortDesc: "일부 변화 기술을 받지 않고 쓴 포켓몬에게 되받아친다.", // NEEDS QC
		gen5: {
			desc: "이 포켓몬은 자신을 노리는 일부 변화 기술의 효과를 받지 않고 쓴 포켓몬에게 되받아친다. 되받아친 기술은 이 특성이나 매직코트의 효과로 다시 되받아칠 수 없다. 압정뿌리기, 스텔스록, 독압정은 진영당 1번만, 이 특성이나 매직코트의 효과를 받는 가장 왼쪽 포켓몬이 되받아친다. 특성 피뢰침과 마중물은 이 특성보다 먼저 각각의 기술을 끌어당긴다.", // NEEDS QC
		},

		move: "#magiccoat",
	},
	magicguard: {
		name: "매직가드",
		// Official flavor text: "공격 이외에는 데미지를 입지 않는다."
		desc: "이 포켓몬은 직접적인 공격으로만 데미지를 받는다. 저주와 대타출동의 사용, 배북, 아픔나누기, 발버둥의 반동, 혼란에 의한 데미지는 직접적인 데미지로 취급한다.", // NEEDS QC
		shortDesc: "직접적인 공격으로만 데미지를 받는다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬은 직접적인 공격으로만 데미지를 받는다. 저주와 대타출동의 사용, 배북, 아픔나누기, 발버둥의 반동, 혼란에 의한 데미지는 직접적인 데미지로 취급한다. 이 포켓몬은 마비로 움직일 수 없게 되지 않으며, 등장 시 독압정의 효과를 받지 않는다.", // NEEDS QC
			shortDesc: "직접적인 공격으로만 데미지를 받으며, 마비로 움직일 수 없게 되지 않는다.", // NEEDS QC
		},
	},
	magician: {
		name: "매지션",
		// Official flavor text: "기술을 맞은 상대의 도구를 빼앗아 버린다."
		desc: "이 포켓몬이 도구를 지니고 있지 않으면 공격을 맞힌 포켓몬의 도구를 빼앗는다. 파멸의소원과 미래예지에는 적용되지 않는다. 한 번의 공격으로 여러 대상을 맞혔다면 트릭룸의 효과를 고려해 가장 빠른 포켓몬부터, 아군보다 상대를 우선해 빼앗는다.", // NEEDS QC
		shortDesc: "도구를 지니고 있지 않으면 공격을 맞힌 포켓몬의 도구를 빼앗는다.", // NEEDS QC
	},
	magmaarmor: {
		name: "마그마의무장",
		shortDesc: "얼음 상태가 되지 않는다. 얼음 상태일 때 이 특성을 얻으면 녹는다.", // NEEDS QC
	},
	magnetpull: {
		name: "자력",
		// Official flavor text: "강철타입의 포켓몬을 자력으로 끌어모아 도망칠 수 없게 한다."
		desc: "강철타입 상대는 교체할 수 없다. 아름다운허물을 지닌 포켓몬과 고스트타입 포켓몬은 교체할 수 있다.", // NEEDS QC
		shortDesc: "강철타입 상대는 교체할 수 없다.", // NEEDS QC
		gen6: {
			desc: "이웃한 강철타입 상대는 교체할 수 없다. 아름다운허물을 지닌 포켓몬과 고스트타입 포켓몬은 교체할 수 있다.", // NEEDS QC
			shortDesc: "이웃한 강철타입 상대는 교체할 수 없다.", // NEEDS QC
		},
		gen5: {
			desc: "이웃한 강철타입 상대는 교체할 수 없다. 아름다운허물을 지닌 포켓몬은 교체할 수 있다.", // NEEDS QC
			shortDesc: "이웃한 강철타입 상대는 교체할 수 없다.", // NEEDS QC
		},
		gen4: {
			desc: "강철타입 상대는 교체할 수 없다. 아름다운허물을 지닌 포켓몬은 교체할 수 있다.", // NEEDS QC
			shortDesc: "강철타입 상대는 교체할 수 없다.", // NEEDS QC
		},
		gen3: {
			desc: "이 포켓몬을 제외한 강철타입 포켓몬은 교체할 수 없다.", // NEEDS QC
			shortDesc: "이 포켓몬을 제외한 강철타입 포켓몬은 교체할 수 없다.", // NEEDS QC
		},
	},
	marvelscale: {
		name: "이상한비늘",
		shortDesc: "상태 이상일 때 방어가 1.5배가 된다.", // NEEDS QC
	},
	megalauncher: {
		name: "메가런처",
		// Official flavor text: "파동 기술의 위력이 올라간다."
		desc: "이 포켓몬의 파동 기술의 위력이 1.5배가 된다. 치유파동은 상대의 최대 HP의 3/4(0.5는 버림)을 회복시킨다.", // NEEDS QC
		shortDesc: "파동 기술의 위력이 1.5배가 된다. 치유파동은 최대 HP의 3/4을 회복시킨다.", // NEEDS QC
	},
	megasol: {
		name: "메가솔라",
		shortDesc: "자신의 기술이 쾌청이 되어 있는 것처럼 발동한다.", // NEEDS QC
	},
	merciless: {
		name: "무도한행동",
		shortDesc: "독 상태인 상대를 공격하면 반드시 급소에 맞는다.", // NEEDS QC
	},
	mimicry: {
		name: "의태",
		// Official flavor text: "필드의 상태에 따라 포켓몬의 타입이 바뀐다."
		desc: "이 특성을 얻거나 필드가 생길 때 이 포켓몬의 타입이 필드에 맞춰 변한다. 일렉트릭필드는 전기타입, 그래스필드는 풀타입, 미스트필드는 페어리타입, 사이코필드는 에스퍼타입이 된다. 필드가 없을 때 이 특성을 얻거나 필드가 사라지면 원래 타입으로 돌아온다.", // NEEDS QC
		shortDesc: "타입이 필드에 맞춰 변한다. 필드가 사라지면 원래대로 돌아온다.", // NEEDS QC

		activate: "  {POKEMON}의 타입이 원래대로 되돌아왔다!",
	},
	mindseye: {
		name: "심안",
		desc: "이 포켓몬의 노말타입과 격투타입 기술이 고스트타입 포켓몬에게 명중한다. 다른 포켓몬에 의해 명중률이 떨어지지 않는다. 상대의 회피율 랭크 변화를 무시하고 공격한다.", // NEEDS QC
		shortDesc: "노말·격투타입 기술이 고스트에 명중. 명중률이 떨어지지 않고 회피율을 무시한다.", // NEEDS QC
	},
	minus: {
		name: "마이너스",
		// Official flavor text: "플러스나 마이너스의 특성을 가진 포켓몬이 동료에 있으면 자신의 특수공격이 올라간다."
		desc: "특성이 이 특성이나 플러스인 아군이 있으면 이 포켓몬의 특수공격이 1.5배가 된다.", // NEEDS QC
		shortDesc: "특성이 이 특성이나 플러스인 아군이 있으면 특수공격이 1.5배가 된다.", // NEEDS QC
		gen4: {
			desc: "배틀에 나와 있는 아군의 특성이 플러스라면 이 포켓몬의 특수공격이 1.5배가 된다.", // NEEDS QC
			shortDesc: "아군의 특성이 플러스라면 특수공격이 1.5배가 된다.", // NEEDS QC
		},
		gen3: {
			desc: "배틀에 나와 있는 포켓몬의 특성이 플러스라면 이 포켓몬의 특수공격이 1.5배가 된다.", // NEEDS QC
			shortDesc: "배틀에 나온 포켓몬의 특성이 플러스라면 특수공격이 1.5배가 된다.", // NEEDS QC
		},
	},
	mirrorarmor: {
		name: "미러아머",
		// Official flavor text: "자신이 받는 능력 다운 효과에 한해 되받아친다."
		desc: "다른 포켓몬에 의해 능력이 떨어지려 할 때 대신 그 포켓몬의 능력을 떨어뜨린다. 자신의 능력이 이미 -6단계라면 발동하지 않는다. 상대가 대타를 내세우고 있으면 양쪽 모두 능력이 떨어지지 않는다.", // NEEDS QC
		shortDesc: "능력이 떨어지려 할 때 대신 공격한 포켓몬의 능력을 떨어뜨린다.", // NEEDS QC
	},
	mistysurge: {
		name: "미스트메이커",
		shortDesc: "등장했을 때 미스트필드를 펼친다.", // NEEDS QC
	},
	moldbreaker: {
		name: "틀깨기",
		// Official flavor text: "상대 특성에 방해받지 않고 상대에게 기술을 쓸 수 있다."
		desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 테일아머, 아로마베일, 오라브레이크, 전투무장, 부풀린가슴, 방탄, 클리어바디, 심술꾸러기, 습기, 비비드바디, 탈, 건조피부, 흙먹기, 필터, 타오르는불꽃, 플라워기프트, 플라워베일, 복슬복슬, 프렌드가드, 퍼코트, 황금몸, 풀모피, 파수견, 내열, 헤비메탈, 괴력집게, 아이스페이스, 얼음인분, 발광, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 심안, 미러아머, 전기엔진, 멀티스케일, 둔감, 방진, 마이페이스, 파스텔베일, 펑크록, 정화의소금, 여왕의위엄, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 스위트베일, 갈지자걸음, 텔레파시, 테라셸, 열교환, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수포, 수의베일, 노릇노릇바디, 하얀연기, 바람타기, 불가사의부적, 미라클스킨이다. 이 포켓몬의 기술 대상인지, 그 특성이 이 포켓몬에게 유리한지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다.", // NEEDS QC
		shortDesc: "자신의 기술과 그 효과는 다른 포켓몬의 특성을 무시한다.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 아로마베일, 오라브레이크, 전투무장, 부풀린가슴, 방탄, 클리어바디, 심술꾸러기, 습기, 비비드바디, 탈, 건조피부, 필터, 타오르는불꽃, 플라워기프트, 플라워베일, 복슬복슬, 프렌드가드, 퍼코트, 풀모피, 내열, 헤비메탈, 괴력집게, 아이스페이스, 얼음인분, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 미러아머, 전기엔진, 멀티스케일, 둔감, 방진, 마이페이스, 파스텔베일, 펑크록, 여왕의위엄, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 스위트베일, 갈지자걸음, 텔레파시, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수포, 수의베일, 하얀연기, 불가사의부적, 미라클스킨이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 그 특성이 이 포켓몬에게 이로운지도 관계없다.", // NEEDS QC
		},
		gen7: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 아로마베일, 오라브레이크, 전투무장, 부풀린가슴, 방탄, 클리어바디, 심술꾸러기, 습기, 다크오라, 비비드바디, 탈, 건조피부, 페어리오라, 필터, 타오르는불꽃, 플라워기프트, 플라워베일, 복슬복슬, 프렌드가드, 퍼코트, 풀모피, 내열, 헤비메탈, 괴력집게, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 전기엔진, 멀티스케일, 둔감, 방진, 마이페이스, 여왕의위엄, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 스위트베일, 갈지자걸음, 텔레파시, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수포, 수의베일, 하얀연기, 불가사의부적, 미라클스킨이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 그 특성이 이 포켓몬에게 이로운지도 관계없다.", // NEEDS QC
		},
		gen6: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 아로마베일, 오라브레이크, 전투무장, 부풀린가슴, 방탄, 클리어바디, 심술꾸러기, 습기, 다크오라, 건조피부, 페어리오라, 필터, 타오르는불꽃, 플라워기프트, 플라워베일, 프렌드가드, 퍼코트, 풀모피, 내열, 헤비메탈, 괴력집게, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 전기엔진, 멀티스케일, 둔감, 방진, 마이페이스, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 스위트베일, 갈지자걸음, 텔레파시, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수의베일, 하얀연기, 불가사의부적, 미라클스킨이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 그 특성이 이 포켓몬에게 이로운지도 관계없다.", // NEEDS QC
		},
		gen5: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 전투무장, 부풀린가슴, 클리어바디, 심술꾸러기, 습기, 건조피부, 필터, 타오르는불꽃, 플라워기프트, 프렌드가드, 내열, 헤비메탈, 괴력집게, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 전기엔진, 멀티스케일, 둔감, 마이페이스, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 갈지자걸음, 텔레파시, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수의베일, 하얀연기, 불가사의부적, 미라클스킨이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 그 특성이 이 포켓몬에게 이로운지도 관계없다.", // NEEDS QC
		},
		gen4: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 전투무장, 클리어바디, 습기, 건조피부, 필터, 타오르는불꽃, 플라워기프트, 내열, 괴력집게, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 피뢰침, 유연, 마그마의무장, 이상한비늘, 전기엔진, 둔감, 마이페이스, 모래숨기, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 갈지자걸음, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수의베일, 하얀연기, 불가사의부적이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 아군의 특성 플라워기프트에 의한 공격 보정은 무시하지 않는다.", // NEEDS QC
		},

		start: "  {POKEMON}의 틀깨기!",
	},
	moody: {
		name: "변덕쟁이",
		// Official flavor text: "매 턴 능력 중 하나가 크게 오르고 하나가 떨어진다."
		desc: "매 턴 종료 시 명중률과 회피율을 제외한 능력 중 하나가 2단계 올라가고 다른 하나가 1단계 떨어진다.", // NEEDS QC
		shortDesc: "매 턴 명중률·회피율을 제외한 능력 하나가 2단계 올라가고 다른 하나가 1단계 떨어진다.", // NEEDS QC
		gen7: {
			desc: "매 턴 종료 시 무작위 능력 하나가 2단계 올라가고 다른 능력 하나가 1단계 떨어진다.", // NEEDS QC
			shortDesc: "매 턴 종료 시 무작위 능력 하나가 2단계 오르고 다른 하나가 1단계 떨어진다.", // NEEDS QC
		},
	},
	motordrive: {
		name: "전기엔진",
		// Official flavor text: "전기타입의 기술을 받으면 데미지를 받지 않고 스피드가 올라간다."
		desc: "이 포켓몬은 전기타입 기술을 받지 않으며, 전기타입 기술을 받으면 스피드가 1단계 올라간다.", // NEEDS QC
		shortDesc: "전기타입 기술을 받으면 스피드가 1단계 올라간다. 전기타입 기술을 받지 않는다.", // NEEDS QC
	},
	moxie: {
		name: "자기과신",
		// Official flavor text: "상대를 쓰러뜨리면 자신감이 붙어서 공격이 올라간다."
		desc: "이 포켓몬이 공격으로 다른 포켓몬을 기절시키면 공격이 1단계 올라간다.", // NEEDS QC
		shortDesc: "공격으로 상대를 기절시키면 공격이 1단계 올라간다.", // NEEDS QC
	},
	multiscale: {
		name: "멀티스케일",
		shortDesc: "HP가 가득 찼을 때 받는 공격의 데미지가 절반이 된다.", // NEEDS QC
	},
	multitype: {
		name: "멀티타입",
		shortDesc: "아르세우스는 지닌 플레이트에 따라 타입이 변한다.", // NEEDS QC
		gen7: {
			shortDesc: "아르세우스라면 지닌 플레이트나 Z크리스탈에 따라 타입이 변한다.", // NEEDS QC
		},
		gen6: {
			shortDesc: "아르세우스는 지닌 플레이트에 따라 타입이 변한다.", // NEEDS QC
		},
		gen4: {
			desc: "이 포켓몬이 아르세우스일 때 지닌 플레이트에 따라 타입이 변한다. 이 포켓몬은 다른 포켓몬의 공격으로 지닌 도구를 잃지 않는다.", // NEEDS QC
		},
	},
	mummy: {
		name: "미라",
		// Official flavor text: "상대가 접촉하면 상대를 미라로 만들어버린다."
		desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬의 특성이 미라로 변한다. 특성이 혼연일체, 유대변화, 절대안깸, 탈, 그대로꿀꺽미사일, 아이스페이스, 멀티타입, 미라, 스웜체인지, AR시스템, 어군, 리밋실드, 배틀스위치, 테라체인지, 달마모드, 마이티체인지인 포켓몬에게는 효과가 없다.", // NEEDS QC
		shortDesc: "직접 공격으로 접촉한 포켓몬의 특성이 미라로 변한다.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬의 특성이 미라로 변한다. 특성이 혼연일체, 유대변화, 절대안깸, 탈, 그대로꿀꺽미사일, 아이스페이스, 멀티타입, 미라, 스웜체인지, AR시스템, 어군, 리밋실드, 배틀스위치, 달마모드인 포켓몬에게는 효과가 없다.", // NEEDS QC
		},
		gen7: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬의 특성이 미라로 변한다. 특성이 유대변화, 절대안깸, 탈, 멀티타입, 미라, 스웜체인지, AR시스템, 어군, 리밋실드, 배틀스위치, 달마모드인 포켓몬에게는 효과가 없다.", // NEEDS QC
		},
		gen6: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬의 특성이 미라로 변한다. 특성이 멀티타입, 미라, 배틀스위치인 포켓몬에게는 효과가 없다.", // NEEDS QC
		},
		gen5: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬의 특성이 미라로 변한다. 특성이 멀티타입, 미라인 포켓몬에게는 효과가 없다.", // NEEDS QC
		},

		changeAbility: "  {TARGET:topic} 특성이 미라가 되어 버렸다!",
	},
	myceliummight: {
		name: "균사의힘",
		desc: "이 포켓몬의 변화 기술은 다른 포켓몬의 일부 특성을 무시하지만, 우선도가 같거나 더 높은 기술을 쓰는 포켓몬 중에서 마지막에 행동한다.", // NEEDS QC
		shortDesc: "변화 기술이 같은 우선도 안에서 마지막에 나가고 특성을 무시한다.", // NEEDS QC
	},
	naturalcure: {
		name: "자연회복",
		shortDesc: "교체해 물러나면 상태 이상이 회복된다.", // NEEDS QC

		activate: "  ({POKEMON:topic} 자연회복으로 상태 이상이 나았다!)", // NEEDS QC
	},
	neuroforce: {
		name: "브레인포스",
		// Official flavor text: "효과가 굉장한 공격의 위력이 더욱 올라간다."
		desc: "이 포켓몬의 효과가 뛰어난 공격의 데미지가 1.25배가 된다.", // NEEDS QC
		shortDesc: "효과가 뛰어난 공격의 데미지가 1.25배가 된다.", // NEEDS QC
	},
	neutralizinggas: {
		name: "화학변화가스",
		// Official flavor text: "화학변화가스를 가진 포켓몬이 배틀에 나와 있으면 모든 포켓몬이 가진 특성의 효과가 사라지거나 발동하지 않게 된다."
		desc: "이 포켓몬이 배틀에 나와 있는 동안 모든 특성이 효과를 잃는다. 이 특성은 설치 기술이나 다른 특성보다 먼저 발동한다. 혼연일체, 유대변화, 절대안깸, 탈, 그대로꿀꺽미사일, 아이스페이스, 멀티타입, 화학변화가스, 스웜체인지, AR시스템, 어군, 리밋실드, 배틀스위치, 테라체인지, 달마모드, 마이티체인지에는 효과가 없다.", // NEEDS QC
		shortDesc: "이 포켓몬이 배틀에 나와 있는 동안 모든 특성이 효과를 잃는다.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬이 배틀에 나와 있는 동안 특성은 효과가 없어진다. 이 특성은 설치물과 다른 특성보다 먼저 발동한다. 특성이 혼연일체, 유대변화, 절대안깸, 탈, 그대로꿀꺽미사일, 아이스페이스, 멀티타입, 화학변화가스, 스웜체인지, AR시스템, 어군, 리밋실드, 배틀스위치, 달마모드인 포켓몬에게는 효과가 없다.", // NEEDS QC
		},

		start: "  주위가 화학변화가스로 가득 찼다!",
		end: "  화학변화가스의 효과가 사라졌다!",
	},
	noguard: {
		name: "노가드",
		shortDesc: "자신이 쓰거나 받는 기술이 반드시 명중한다.", // NEEDS QC
	},
	normalize: {
		name: "노말스킨",
		// Official flavor text: "어떤 타입의 기술도 모두 노말타입이 된다. 위력이 조금 올라간다."
		desc: "이 포켓몬의 기술이 모두 노말타입이 되며 위력이 1.2배가 된다. 이 효과는 기술의 타입을 바꾸는 다른 효과보다 앞에 적용된다.", // NEEDS QC
		shortDesc: "모든 기술이 노말타입이 되며 위력이 1.2배가 된다.", // NEEDS QC
		gen6: {
			desc: "이 포켓몬의 기술은 노말타입이 된다. 이 효과는 기술의 타입을 바꾸는 다른 효과보다 앞에 적용된다.", // NEEDS QC
			shortDesc: "이 포켓몬의 기술은 노말타입이 된다.", // NEEDS QC
		},
		gen4: {
			desc: "이 포켓몬의 기술은 노말타입이 된다. 이 효과는 발버둥을 제외하고 기술의 타입을 바꾸는 다른 효과보다 뒤에 적용된다.", // NEEDS QC
		},
	},
	oblivious: {
		name: "둔감",
		// Official flavor text: "둔감해서 헤롱헤롱이나 도발 상태가 되지 않는다."
		desc: "이 포켓몬은 헤롱헤롱 상태나 도발의 효과를 받지 않는다. 이미 그 상태일 때 이 특성을 얻으면 회복된다. 특성 위협의 효과도 받지 않는다.", // NEEDS QC
		shortDesc: "헤롱헤롱 상태나 도발의 효과를 받지 않는다. 위협에도 면역.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬은 헤롱헤롱 상태나 도발의 효과를 받지 않는다. 헤롱헤롱 상태나 도발의 효과를 받는 중에 이 특성을 얻으면 회복된다.", // NEEDS QC
			shortDesc: "헤롱헤롱 상태나 도발의 효과를 받지 않는다.", // NEEDS QC
		},
		gen5: {
			desc: "이 포켓몬은 헤롱헤롱 상태가 되지 않는다. 헤롱헤롱 상태에서 이 특성을 얻으면 회복된다.", // NEEDS QC
			shortDesc: "헤롱헤롱 상태가 되지 않는다. 헤롱헤롱 중에 얻으면 회복된다.", // NEEDS QC
		},
	},
	opportunist: {
		name: "편승",
		shortDesc: "상대의 능력이 올라가면 그 상승을 복사한다.", // NEEDS QC
	},
	orichalcumpulse: {
		name: "진홍빛고동",
		shortDesc: "등장했을 때 날씨를 쾌청으로 만든다. 쾌청에서 공격이 1.3333배가 된다.", // NEEDS QC

		start: "  {POKEMON:topic} 햇살을 강하게 하여 고대의 고동을 폭발시켰다!!",
		activate: "  {POKEMON:topic} 햇살을 받아 고대의 고동을 폭발시켰다!!",
	},
	overcoat: {
		name: "방진",
		// Official flavor text: "모래바람이나 싸라기눈 등의 데미지를 입지 않는다. 가루의 기술을 받지 않는다."
		desc: "이 포켓몬은 가루 기술, 모래바람에 의한 데미지, 분노가루와 특성 포자의 효과를 받지 않는다.", // NEEDS QC
		shortDesc: "가루 기술, 모래바람의 데미지, 포자의 효과를 받지 않는다.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬은 가루 기술, 모래바람이나 싸라기눈의 데미지, 분노가루와 특성 포자의 효과를 받지 않는다.", // NEEDS QC
			shortDesc: "가루 기술, 모래바람/싸라기눈 데미지, 포자를 받지 않는다.", // NEEDS QC
		},
		gen5: {
			desc: "이 포켓몬은 모래바람이나 싸라기눈의 데미지를 받지 않는다.", // NEEDS QC
			shortDesc: "모래바람이나 싸라기눈의 데미지를 받지 않는다.", // NEEDS QC
		},
	},
	overgrow: {
		name: "심록",
		// Official flavor text: "HP가 줄었을 때 풀타입 기술의 위력이 올라간다."
		desc: "이 포켓몬의 HP가 최대 HP의 1/3(버림) 이하일 때 풀타입 기술로 공격하면 공격 또는 특수공격이 1.5배가 된다.", // NEEDS QC
		shortDesc: "최대 HP의 1/3 이하일 때 풀타입 기술의 공격 또는 특수공격이 1.5배가 된다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬의 HP가 최대 HP의 1/3(버림) 이하일 때 풀타입 공격 기술의 위력이 1.5배가 된다.", // NEEDS QC
			shortDesc: "HP가 1/3 이하일 때 풀타입 공격의 위력이 1.5배가 된다.", // NEEDS QC
		},
	},
	owntempo: {
		name: "마이페이스",
		// Official flavor text: "마이페이스라서 혼란 상태가 되지 않는다."
		desc: "이 포켓몬은 혼란 상태가 되지 않는다. 혼란 상태일 때 이 특성을 얻으면 회복된다. 특성 위협의 효과도 받지 않는다.", // NEEDS QC
		shortDesc: "혼란 상태가 되지 않는다. 위협의 효과를 받지 않는다.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬은 혼란 상태가 되지 않는다. 혼란 상태에서 이 특성을 얻으면 회복된다.", // NEEDS QC
			shortDesc: "이 포켓몬은 혼란 상태가 되지 않는다.", // NEEDS QC
		},
	},
	parentalbond: {
		name: "부자유친",
		// Official flavor text: "부모와 자식 2마리로 2번 공격할 수 있다."
		desc: "이 포켓몬의 공격 기술이 2회 공격하는 연속 공격 기술이 된다. 두 번째 공격의 데미지는 1/4이 된다. 파멸의소원, 드래곤애로, 다이맥스포, 죽기살기, 대폭발, 목숨걸기, 내던지기, 미래예지, 아이스볼, 구르기, 자폭, 연속 공격 기술, 대상이 여럿인 기술, 2턴 기술에는 적용되지 않는다.", // NEEDS QC
		shortDesc: "공격 기술이 2회 공격한다. 두 번째 공격의 데미지는 1/4이 된다.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬의 공격 기술은 2회 공격하는 연속 기술이 된다. 두 번째 공격의 데미지는 1/4이 된다. 파멸의소원, 드래곤애로, 다이맥스포, 죽기살기, 대폭발, 목숨걸기, 내던지기, 미래예지, 아이스볼, 구르기, 자폭, 연속 공격 기술, 여러 대상을 노리는 기술, 2턴 기술, 다이맥스 기술에는 발동하지 않는다.", // NEEDS QC
		},
		gen7: {
			desc: "이 포켓몬의 공격 기술은 2회 공격하는 연속 기술이 된다. 두 번째 공격의 데미지는 1/4이 된다. 파멸의소원, 죽기살기, 대폭발, 목숨걸기, 내던지기, 미래예지, 아이스볼, 구르기, 자폭, 연속 공격 기술, 여러 대상을 노리는 기술, 2턴 기술, Z기술에는 발동하지 않는다.", // NEEDS QC
		},
		gen6: {
			desc: "이 포켓몬의 공격 기술은 2회 공격하는 연속 기술이 된다. 두 번째 공격의 데미지는 절반이 된다. 파멸의소원, 죽기살기, 대폭발, 목숨걸기, 내던지기, 미래예지, 아이스볼, 구르기, 자폭, 연속 공격 기술, 여러 대상을 노리는 기술, 2턴 기술에는 발동하지 않는다.", // NEEDS QC
			shortDesc: "공격 기술이 2회 공격한다. 두 번째 공격은 데미지 절반.", // NEEDS QC
		},
	},
	pastelveil: {
		name: "파스텔베일",
		// Official flavor text: "자신과 같은 편이 독의 상태 이상 효과를 받지 않게 된다."
		desc: "이 포켓몬과 아군은 독 상태가 되지 않는다. 자신이나 아군이 독 상태일 때 이 특성을 얻으면 회복된다. 독을 거는 효과가 이 특성을 무시하는 경우 자신은 즉시 회복되지만 아군은 회복되지 않는다.", // NEEDS QC
		shortDesc: "자신과 아군은 독 상태가 되지 않는다. 등장했을 때 아군의 독을 회복한다.", // NEEDS QC
	},
	perishbody: {
		name: "멸망의바디",
		// Official flavor text: "접촉하는 기술을 받으면 3턴 후에 양쪽 모두 기절한다. 교체되면 효과가 없어진다."
		desc: "이 포켓몬에게 직접 공격으로 접촉하면 자신과 공격한 포켓몬에게 멸망의노래의 효과가 발동한다. 공격한 포켓몬에게 이미 멸망의 카운트가 있으면 이 포켓몬에게는 발동하지 않는다.", // NEEDS QC
		shortDesc: "직접 공격으로 접촉하면 자신과 공격한 포켓몬에게 멸망의노래의 효과가 발동한다.", // NEEDS QC

		start: "  두 포켓몬 모두 3턴 후에 쓰러져 버린다!",
	},
	pickpocket: {
		name: "나쁜손버릇",
		// Official flavor text: "접촉한 상대의 도구를 훔친다."
		desc: "이 포켓몬이 도구를 지니고 있지 않을 때 직접 공격을 받으면 공격한 포켓몬의 도구를 빼앗는다. 연속 공격 기술은 모든 공격이 끝난 뒤에 적용된다. 특성 우격다짐으로 추가 효과가 사라진 기술에는 발동하지 않는다.", // NEEDS QC
		shortDesc: "도구를 지니고 있지 않을 때 직접 공격을 받으면 공격한 포켓몬의 도구를 빼앗는다.", // NEEDS QC
	},
	pickup: {
		name: "픽업",
		// Official flavor text: "상대가 사용한 도구를 주워올 때가 있다. 모험 중에도 주워온다."
		desc: "매 턴 종료 시 이 포켓몬이 도구를 지니고 있지 않고 이웃한 포켓몬이 그 턴에 도구를 사용했다면, 그중 무작위로 한 포켓몬이 마지막으로 사용한 도구를 얻는다. 터진 풍선, 이 특성으로 다른 포켓몬이 주운 도구, 벌레먹기, 부식가스, 탐내다, 불태우기, 탁쳐서떨구기, 쪼아대기, 도둑질로 잃은 도구는 얻을 수 없다. 내던지기로 던진 도구는 주울 수 있다.", // NEEDS QC
		shortDesc: "도구를 지니고 있지 않으면 이웃한 포켓몬이 그 턴에 사용한 도구를 줍는다.", // NEEDS QC
		gen7: {
			desc: "매 턴 종료 시 이 포켓몬이 도구를 지니고 있지 않고 이웃한 포켓몬이 이 턴에 도구를 사용했다면, 그중 하나를 무작위로 골라 그 포켓몬이 마지막으로 사용한 도구를 얻는다. 터진 풍선, 이 특성을 지닌 다른 포켓몬이 주워 간 도구, 벌레먹기, 탐내다, 불태우기, 탁쳐서떨구기, 쪼아대기, 도둑질로 잃은 도구는 마지막으로 사용한 도구로 치지 않는다. 내던지기로 던진 도구는 주울 수 있다.", // NEEDS QC
		},
		gen4: {
			desc: "배틀에서는 효과가 없다.", // NEEDS QC
			shortDesc: "배틀에서는 효과가 없다.", // NEEDS QC
		},

		addItem: "#recycle",
	},
	piercingdrill: {
		name: "관통드릴",
		shortDesc: "직접 공격이 상대의 방어 효과를 뚫고 1/4의 데미지를 준다.", // NEEDS QC
	},
	pixilate: {
		name: "페어리스킨",
		// Official flavor text: "노말타입의 기술이 페어리타입이 된다. 위력이 조금 올라간다."
		desc: "이 포켓몬의 노말타입 기술이 페어리타입 기술이 되며 위력이 1.2배가 된다. 이 효과는 기술의 타입을 바꾸는 다른 효과보다 뒤에, 플라스마샤워와 송전의 효과보다는 앞에 적용된다.", // NEEDS QC
		shortDesc: "노말타입 기술이 페어리타입이 되며 위력이 1.2배가 된다.", // NEEDS QC
		gen6: {
			desc: "이 포켓몬의 노말타입 기술이 페어리타입 기술이 되며 위력이 1.3배가 된다. 이 효과는 기술의 타입을 바꾸는 다른 효과보다 뒤에, 플라스마샤워와 송전의 효과보다는 앞에 적용된다.", // NEEDS QC
			shortDesc: "이 포켓몬의 노말타입 기술이 페어리타입이 되고 위력이 1.3배가 된다.", // NEEDS QC
		},
	},
	plus: {
		name: "플러스",
		// Official flavor text: "플러스나 마이너스의 특성을 가진 포켓몬이 동료에 있으면 자신의 특수공격이 올라간다."
		desc: "특성이 이 특성이나 마이너스인 아군이 있으면 이 포켓몬의 특수공격이 1.5배가 된다.", // NEEDS QC
		shortDesc: "특성이 이 특성이나 마이너스인 아군이 있으면 특수공격이 1.5배가 된다.", // NEEDS QC
		gen4: {
			desc: "배틀에 나와 있는 아군의 특성이 마이너스라면 이 포켓몬의 특수공격이 1.5배가 된다.", // NEEDS QC
			shortDesc: "아군의 특성이 마이너스라면 특수공격이 1.5배가 된다.", // NEEDS QC
		},
		gen3: {
			desc: "배틀에 나와 있는 포켓몬의 특성이 마이너스라면 이 포켓몬의 특수공격이 1.5배가 된다.", // NEEDS QC
			shortDesc: "배틀에 나온 포켓몬의 특성이 마이너스라면 특수공격이 1.5배가 된다.", // NEEDS QC
		},
	},
	poisonheal: {
		name: "포이즌힐",
		// Official flavor text: "독 상태가 되면 HP가 줄지 않고 증가한다."
		desc: "이 포켓몬이 독 상태일 때 데미지를 받는 대신 매 턴 종료 시 최대 HP의 1/8(버림)을 회복한다.", // NEEDS QC
		shortDesc: "독 상태일 때 데미지 대신 매 턴 최대 HP의 1/8을 회복한다.", // NEEDS QC
	},
	poisonpoint: {
		name: "독가시",
		shortDesc: "직접 공격으로 접촉한 포켓몬을 30%의 확률로 독 상태로 만든다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬을 30%의 확률로 독 상태로 만든다. 이 공격으로 HP를 잃지 않았다면 발동하지 않는다.", // NEEDS QC
		},
		gen3: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬을 1/3의 확률로 독 상태로 만든다. 이 공격으로 HP를 잃지 않았다면 발동하지 않는다.", // NEEDS QC
			shortDesc: "접촉한 포켓몬을 1/3의 확률로 독 상태로 만든다.", // NEEDS QC
		},
	},
	poisonpuppeteer: {
		name: "독조종",
		desc: "이 포켓몬이 복숭악동일 때 상대를 독 또는 맹독 상태로 만들면 그 상대는 혼란 상태도 된다.", // NEEDS QC
		shortDesc: "복숭악동: 상대를 독 상태로 만들면 혼란 상태도 만든다.", // NEEDS QC
	},
	poisontouch: {
		name: "독수",
		// Official flavor text: "접촉하기만 해도 상대를 독 상태로 만들 때가 있다."
		desc: "이 포켓몬의 직접 공격에 30%의 확률로 상대를 독 상태로 만드는 효과가 생긴다. 이 효과는 기술이 원래 지닌 추가 효과의 확률 뒤에 적용된다.", // NEEDS QC
		shortDesc: "직접 공격에 30%의 확률로 상대를 독 상태로 만드는 효과가 생긴다.", // NEEDS QC
	},
	powerconstruct: {
		name: "스웜체인지",
		// Official flavor text: "HP가 절반이 되면 셀들이 응원하러 달려와 퍼펙트폼으로 모습이 변한다."
		desc: "이 포켓몬이 10%폼 또는 50%폼 지가르데일 때 턴 종료 시 HP가 최대 HP의 1/2 이하이면 퍼펙트폼으로 변한다.", // NEEDS QC
		shortDesc: "10%·50%폼 지가르데는 턴 종료 시 HP가 1/2 이하이면 퍼펙트폼이 된다.", // NEEDS QC

		activate: "  많은 기척이 느껴진다...!",
		transform: "{POKEMON:topic} 퍼펙트폼으로 바뀌었다!",
	},
	powerofalchemy: {
		name: "과학의힘",
		// Official flavor text: "쓰러진 같은 편의 특성을 이어받아 같은 특성으로 바뀐다."
		desc: "기절한 아군의 특성을 이어받는다. 혼연일체, 유대변화, 절대안깸, 사령탑, 탈, 초상투영, 플라워기프트, 기분파, 꼬르륵스위치, 아이스페이스, 일루전, 괴짜, 멀티타입, 화학변화가스, 독조종, 스웜체인지, 과학의힘, 고대활성, 쿼크차지, 리시버, AR시스템, 어군, 리밋실드, 배틀스위치, 테라셸, 테라체인지, 제로포밍, 트레이스, 불가사의부적, 달마모드, 마이티체인지는 이어받을 수 없다.", // NEEDS QC
		shortDesc: "기절한 아군의 특성을 이어받는다.", // NEEDS QC
		gen8: {
			desc: "기절한 아군의 특성을 복사한다. 혼연일체, 유대변화, 절대안깸, 탈, 플라워기프트, 기분파, 그대로꿀꺽미사일, 꼬르륵스위치, 아이스페이스, 일루전, 괴짜, 멀티타입, 화학변화가스, 스웜체인지, 과학의힘, 리시버, AR시스템, 어군, 리밋실드, 배틀스위치, 트레이스, 불가사의부적, 달마모드는 복사할 수 없다.", // NEEDS QC
		},
		gen7: {
			desc: "기절한 아군의 특성을 복사한다. 유대변화, 절대안깸, 탈, 플라워기프트, 기분파, 일루전, 괴짜, 멀티타입, 스웜체인지, 과학의힘, 리시버, AR시스템, 어군, 리밋실드, 배틀스위치, 트레이스, 불가사의부적, 달마모드는 복사할 수 없다.", // NEEDS QC
		},

		changeAbility: "#receiver",
	},
	powerspot: {
		name: "파워스폿",
		// Official flavor text: "옆에 있기만 해도 기술의 위력이 올라간다."
		desc: "아군의 기술의 위력이 1.3배가 된다. 쓴 포켓몬이 배틀에서 벗어나 있어도 파멸의소원과 미래예지에 적용된다.", // NEEDS QC
		shortDesc: "아군의 기술의 위력이 1.3배가 된다.", // NEEDS QC
	},
	prankster: {
		name: "짓궂은마음",
		// Official flavor text: "변화 기술을 먼저 쓸 수 있다."
		desc: "이 포켓몬의 변화 기술의 우선도가 1 올라간다. 상대 악타입 포켓몬에게는 이 기술과, 이 기술이 불러낸 기술(사용자가 이 특성을 지닌 경우)이 효과가 없다.", // NEEDS QC
		shortDesc: "변화 기술의 우선도가 1 올라간다. 악타입에게는 효과가 없다.", // NEEDS QC
		gen6: {
			desc: "이 포켓몬의 공격 기술이 아닌 기술은 우선도가 1 올라간다.", // NEEDS QC
			shortDesc: "이 포켓몬의 변화 기술은 우선도가 1 올라간다.", // NEEDS QC
		},
	},
	pressure: {
		name: "프레셔",
		// Official flavor text: "프레셔를 줘서 상대가 쓰는 기술의 PP를 많이 줄인다."
		desc: "이 포켓몬을 대상으로 상대가 기술을 쓰면 그 기술의 PP가 1 더 줄어든다. 상대가 쓴 봉인, 가로채기, 테라버스트로 PP가 1 더 줄어들지만 끈적끈적네트는 줄어들지 않는다.", // NEEDS QC
		shortDesc: "자신을 노리는 상대의 기술은 PP가 1 더 줄어든다.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬이 상대 기술의 대상이 되면 그 기술의 PP가 1 더 줄어든다. 상대가 쓴 봉인과 가로채기의 PP도 1 더 줄어들지만 끈적끈적네트는 줄어들지 않는다.", // NEEDS QC
		},
		gen5: {
			desc: "이 포켓몬이 상대 기술의 대상이 되면 그 기술의 PP가 1 더 줄어든다. 상대가 쓴 봉인과 가로채기의 PP도 1 더 줄어든다.", // NEEDS QC
		},
		gen4: {
			desc: "이 포켓몬이 다른 포켓몬 기술의 대상이 되면 그 기술의 PP가 1 더 줄어든다.", // NEEDS QC
			shortDesc: "이 포켓몬을 노린 기술은 PP가 1 더 줄어든다.", // NEEDS QC
		},

		start: "  {POKEMON:topic} 프레셔를 발산하고 있다!",
	},
	primordialsea: {
		name: "시작의바다",
		// Official flavor text: "불꽃타입의 공격을 받지 않는 날씨로 만든다."
		desc: "등장했을 때 날씨가 폭우로 변한다. 폭우는 비의 모든 효과에 더해 불꽃타입 공격 기술을 실패하게 만든다. 이 특성을 지닌 포켓몬이 모두 배틀에서 벗어나거나, 델타스트림과 끝의대지에 의해 날씨가 변하면 폭우는 사라진다.", // NEEDS QC
		shortDesc: "등장했을 때 날씨가 폭우가 된다. 이 특성이 배틀에서 사라질 때까지 지속된다.", // NEEDS QC
	},
	prismarmor: {
		name: "프리즘아머",
		shortDesc: "효과가 뛰어난 공격의 데미지를 3/4로 받는다.", // NEEDS QC
	},
	propellertail: {
		name: "스크루지느러미",
		shortDesc: "자신의 기술은 어떤 효과로도 다른 대상으로 유도되지 않는다.", // NEEDS QC
	},
	protean: {
		name: "변환자재",
		// Official flavor text: "자신이 사용한 기술과 같은 타입으로 변화한다."
		desc: "이 포켓몬의 타입이 쓰려는 기술의 타입으로 변한다. 이 효과는 기술의 타입을 바꾸는 모든 효과보다 뒤에 적용된다. 등장할 때마다 1번만 발동하며, 테라스탈 중에는 발동하지 않는다.", // NEEDS QC
		shortDesc: "자신의 타입이 쓰는 기술의 타입으로 변한다. 등장할 때마다 1번만.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬의 타입이 쓰려는 기술의 타입으로 변한다. 이 효과는 기술의 타입을 바꾸는 모든 효과보다 뒤에 적용된다.", // NEEDS QC
			shortDesc: "이 포켓몬의 타입이 쓰려는 기술의 타입으로 변한다.", // NEEDS QC
		},
	},
	protosynthesis: {
		name: "고대활성",
		desc: "날씨가 쾌청이 되어 있거나 지닌 부스트에너지를 사용하면 이 포켓몬의 가장 높은 능력이 1.3배(스피드라면 1.5배)가 된다. 가장 높은 능력은 이 특성이 발동하는 시점의 랭크 변화를 포함해 판정하며, 여러 능력이 같다면 공격, 방어, 특수공격, 특수방어, 스피드 순으로 우선한다. 쾌청으로 발동한 경우 지닌 부스트에너지는 발동하지 않으며 쾌청이 끝나면 효과도 사라진다. 부스트에너지로 발동한 경우 배틀에서 벗어나면 효과가 사라진다.", // NEEDS QC
		shortDesc: "쾌청 또는 부스트에너지로 발동: 가장 높은 능력이 1.3배(스피드는 1.5배).", // NEEDS QC

		activate: "  {POKEMON:topic} 쾌청에 의해 고대활성을 발동했다!",
		activateFromItem: "  {POKEMON:topic} 부스트에너지에 의해 고대활성을 발동했다!",
		start: "  {POKEMON}의 {STAT:subject} 강화되었다!",
		end: "  {POKEMON}에게서 고대활성의 효과가 사라졌다!",
	},
	psychicsurge: {
		name: "사이코메이커",
		shortDesc: "등장했을 때 사이코필드를 펼친다.", // NEEDS QC
	},
	punkrock: {
		name: "펑크록",
		// Official flavor text: "소리 기술의 위력이 올라간다. 상대로부터 받는 소리 기술의 데미지는 절반이 된다."
		desc: "이 포켓몬의 소리 기술의 위력이 1.3배가 된다. 소리 기술로 받는 데미지는 절반이 된다.", // NEEDS QC
		shortDesc: "소리 기술의 데미지를 절반으로 받는다. 자신의 소리 기술은 위력이 1.3배.", // NEEDS QC
	},
	purepower: {
		name: "순수한힘",
		shortDesc: "공격이 2배가 된다.", // NEEDS QC
	},
	purifyingsalt: {
		name: "정화의소금",
		desc: "이 포켓몬은 상태 이상이나 하품의 효과를 받지 않는다. 이 포켓몬이 받는 고스트타입 공격은 공격한 포켓몬의 공격 또는 특수공격을 절반으로 계산한다.", // NEEDS QC
		shortDesc: "받는 고스트타입 공격은 상대의 공격 능력을 절반으로 계산. 상태 이상이 되지 않는다.", // NEEDS QC
	},
	quarkdrive: {
		name: "쿼크차지",
		desc: "일렉트릭필드가 펼쳐져 있거나 지닌 부스트에너지를 사용하면 이 포켓몬의 가장 높은 능력이 1.3배(스피드라면 1.5배)가 된다. 가장 높은 능력은 이 특성이 발동하는 시점의 랭크 변화를 포함해 판정하며, 여러 능력이 같다면 공격, 방어, 특수공격, 특수방어, 스피드 순으로 우선한다. 일렉트릭필드로 발동한 경우 지닌 부스트에너지는 발동하지 않으며 일렉트릭필드가 사라지면 효과도 사라진다. 부스트에너지로 발동한 경우 배틀에서 벗어나면 효과가 사라진다.", // NEEDS QC
		shortDesc: "일렉트릭필드 또는 부스트에너지로 발동: 가장 높은 능력이 1.3배(스피드는 1.5배).", // NEEDS QC

		activate: "  {POKEMON:topic} 일렉트릭필드에 의해 쿼크차지를 발동했다!",
		activateFromItem: "  {POKEMON:topic} 부스트에너지에 의해 쿼크차지를 발동했다!",
		start: "  {POKEMON}의 {STAT:subject} 강화되었다!",
		end: "  {POKEMON}에게서 쿼크차지의 효과가 사라졌다!",
	},
	queenlymajesty: {
		name: "여왕의위엄",
		// Official flavor text: "상대에게 위압감을 줘서 이쪽을 향한 선제 기술을 사용할 수 없게 한다."
		desc: "상대가 이 포켓몬이나 아군에게 쓰는 선제 기술은 발동하지 않는다.", // NEEDS QC
		shortDesc: "이 포켓몬과 아군은 상대의 선제 기술을 받지 않는다.", // NEEDS QC

		block: "#damp",
	},
	quickdraw: {
		name: "퀵드로",
		shortDesc: "30%의 확률로 공격 기술을 같은 우선도 안에서 먼저 쓴다.", // NEEDS QC

		activate: "  {POKEMON:topic} 퀵드로에 의해 행동이 빨라졌다!",
	},
	quickfeet: {
		name: "속보",
		// Official flavor text: "상태 이상이 되면 스피드가 올라간다."
		desc: "이 포켓몬이 상태 이상일 때 스피드가 1.5배가 된다. 마비에 의한 스피드 반감 효과도 무시한다.", // NEEDS QC
		shortDesc: "상태 이상일 때 스피드가 1.5배가 된다. 마비의 스피드 반감도 무시한다.", // NEEDS QC
		gen6: {
			desc: "이 포켓몬이 상태 이상이면 스피드가 1.5배가 된다. 마비에 의한 스피드 감소는 무시한다.", // NEEDS QC
		},
	},
	raindish: {
		name: "젖은접시",
		// Official flavor text: "비가 오는 날씨일 때 조금씩 HP를 회복한다."
		desc: "날씨가 비가 되어 있으면 매 턴 종료 시 최대 HP의 1/16(버림)을 회복한다. 만능우산을 지니고 있으면 발동하지 않는다.", // NEEDS QC
		shortDesc: "날씨가 비가 되어 있으면 매 턴 최대 HP의 1/16을 회복한다.", // NEEDS QC
		gen7: {
			desc: "날씨가 비가 되어 있으면 매 턴 종료 시 최대 HP의 1/16(버림)을 회복한다.", // NEEDS QC
		},
	},
	rattled: {
		name: "주눅",
		// Official flavor text: "악타입과 고스트타입과 벌레타입의 기술을 받으면 주눅이 들어 스피드가 올라간다."
		desc: "벌레, 악, 고스트타입 공격을 받거나 상대의 특성 위협의 효과를 받으면 스피드가 1단계 올라간다.", // NEEDS QC
		shortDesc: "벌레·악·고스트타입 공격이나 위협의 효과를 받으면 스피드가 1단계 올라간다.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬이 벌레, 악 또는 고스트타입 공격에 맞으면 스피드가 1단계 올라간다.", // NEEDS QC
			shortDesc: "벌레/악/고스트타입 공격에 맞으면 스피드가 1단계 올라간다.", // NEEDS QC
		},
	},
	receiver: {
		name: "리시버",
		// Official flavor text: "쓰러진 같은 편의 특성을 이어받아 같은 특성이 된다."
		desc: "기절한 아군의 특성을 이어받는다. 혼연일체, 유대변화, 절대안깸, 사령탑, 탈, 초상투영, 플라워기프트, 기분파, 꼬르륵스위치, 아이스페이스, 일루전, 괴짜, 멀티타입, 화학변화가스, 독조종, 스웜체인지, 과학의힘, 고대활성, 쿼크차지, 리시버, AR시스템, 어군, 리밋실드, 배틀스위치, 테라셸, 테라체인지, 제로포밍, 트레이스, 불가사의부적, 달마모드, 마이티체인지는 이어받을 수 없다.", // NEEDS QC
		shortDesc: "기절한 아군의 특성을 이어받는다.", // NEEDS QC
		gen8: {
			desc: "기절한 아군의 특성을 복사한다. 혼연일체, 유대변화, 절대안깸, 탈, 플라워기프트, 기분파, 그대로꿀꺽미사일, 꼬르륵스위치, 아이스페이스, 일루전, 괴짜, 멀티타입, 화학변화가스, 스웜체인지, 과학의힘, 리시버, AR시스템, 어군, 리밋실드, 배틀스위치, 트레이스, 불가사의부적, 달마모드는 복사할 수 없다.", // NEEDS QC
		},
		gen7: {
			desc: "기절한 아군의 특성을 복사한다. 유대변화, 절대안깸, 탈, 플라워기프트, 기분파, 일루전, 괴짜, 멀티타입, 스웜체인지, 과학의힘, 리시버, AR시스템, 어군, 리밋실드, 배틀스위치, 트레이스, 불가사의부적, 달마모드는 복사할 수 없다.", // NEEDS QC
		},

		changeAbility: "  {SOURCE}의 {ABILITY:object} 이어받았다!",
	},
	reckless: {
		name: "이판사판",
		// Official flavor text: "반동 데미지를 받는 기술의 위력이 올라간다."
		desc: "이 포켓몬의 반동 데미지나 빗나갔을 때 데미지를 받는 공격 기술의 위력이 1.2배가 된다. 발버둥에는 적용되지 않는다.", // NEEDS QC
		shortDesc: "반동이나 실패 데미지가 있는 공격 기술의 위력이 1.2배(발버둥 제외).", // NEEDS QC
	},
	refrigerate: {
		name: "프리즈스킨",
		// Official flavor text: "노말타입의 기술이 얼음타입이 된다. 위력이 조금 올라간다."
		desc: "이 포켓몬의 노말타입 기술이 얼음타입 기술이 되며 위력이 1.2배가 된다. 이 효과는 기술의 타입을 바꾸는 다른 효과보다 뒤에, 플라스마샤워와 송전의 효과보다는 앞에 적용된다.", // NEEDS QC
		shortDesc: "노말타입 기술이 얼음타입이 되며 위력이 1.2배가 된다.", // NEEDS QC
		gen6: {
			desc: "이 포켓몬의 노말타입 기술이 얼음타입 기술이 되며 위력이 1.3배가 된다. 이 효과는 기술의 타입을 바꾸는 다른 효과보다 뒤에, 플라스마샤워와 송전의 효과보다는 앞에 적용된다.", // NEEDS QC
			shortDesc: "이 포켓몬의 노말타입 기술이 얼음타입이 되고 위력이 1.3배가 된다.", // NEEDS QC
		},
	},
	regenerator: {
		name: "재생력",
		shortDesc: "교체해 물러나면 최대 HP의 1/3(버림)을 회복한다.", // NEEDS QC
	},
	ripen: {
		name: "숙성",
		// Official flavor text: "나무열매를 숙성시켜서 효과가 2배가 된다."
		desc: "이 포켓몬이 일부 나무열매를 먹으면 효과가 2배가 된다. HP나 PP를 회복하는 나무열매는 회복량이 2배가 되고, 능력을 올리는 나무열매는 상승량이 2배가 되며, 데미지를 반감하는 나무열매는 1/4로 줄이고, 자보열매와 애터열매는 공격한 포켓몬의 최대 HP의 1/4(버림)을 잃게 한다.", // NEEDS QC
		shortDesc: "일부 나무열매를 먹으면 효과가 2배가 된다.", // NEEDS QC
	},
	rivalry: {
		name: "투쟁심",
		// Official flavor text: "성별이 같으면 투쟁심을 불태워 강해진다. 성별이 다르면 약해진다."
		desc: "이 포켓몬의 공격 기술은 같은 성별의 상대에게는 위력이 1.25배, 다른 성별의 상대에게는 0.75배가 된다. 자신이나 상대의 성별이 없으면 보정이 없다.", // NEEDS QC
		shortDesc: "같은 성별에게는 위력 1.25배, 다른 성별에게는 0.75배로 공격한다.", // NEEDS QC
	},
	rkssystem: {
		name: "AR시스템",
		shortDesc: "실버디는 지닌 메모리에 따라 타입이 변한다.", // NEEDS QC
	},
	rockhead: {
		name: "돌머리",
		// Official flavor text: "반동을 받는 기술을 사용해도 HP가 줄지 않는다."
		desc: "이 포켓몬은 반동 데미지를 받지 않는다. 발버둥의 반동, 생명의구슬에 의한 데미지, 빗나갔을 때의 데미지는 예외다.", // NEEDS QC
		shortDesc: "반동 데미지를 받지 않는다(발버둥·생명의구슬·실패 데미지 제외).", // NEEDS QC
		gen3: {
			desc: "이 포켓몬은 발버둥을 제외하고 반동 데미지를 받지 않는다. 빗나갔을 때의 데미지는 막지 못한다.", // NEEDS QC
			shortDesc: "발버둥과 빗나갔을 때의 데미지를 제외하고 반동 데미지를 받지 않는다.", // NEEDS QC
		},
	},
	rockypayload: {
		name: "바위나르기",
		shortDesc: "바위타입 기술의 공격 또는 특수공격이 1.5배가 된다.", // NEEDS QC
	},
	roughskin: {
		name: "까칠한피부",
		// Official flavor text: "공격을 받았을 때 자신에게 접촉한 상대를 까칠까칠한 피부로 상처를 입힌다."
		desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬은 최대 HP의 1/8(버림)을 잃는다.", // NEEDS QC
		shortDesc: "직접 공격으로 접촉한 포켓몬은 최대 HP의 1/8을 잃는다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬은 최대 HP의 1/8(버림)을 잃는다. 이 공격으로 HP를 잃지 않았다면 발동하지 않는다.", // NEEDS QC
		},
		gen3: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬은 최대 HP의 1/16(버림)을 잃는다. 이 공격으로 HP를 잃지 않았다면 발동하지 않는다.", // NEEDS QC
			shortDesc: "접촉한 포켓몬은 최대 HP의 1/16을 잃는다.", // NEEDS QC
		},

		damage: "  {POKEMON:topic} 데미지를 입었다!",
	},
	runaway: {
		name: "도주",
		shortDesc: "배틀에서는 효과가 없다.", // NEEDS QC
	},
	sandforce: {
		name: "모래의힘",
		// Official flavor text: "날씨가 모래바람일 때 바위타입과 땅타입과 강철타입의 위력이 올라간다."
		desc: "날씨가 모래바람일 때 이 포켓몬의 땅, 바위, 강철타입 기술의 위력이 1.3배가 된다. 모래바람에 의한 데미지를 받지 않는다.", // NEEDS QC
		shortDesc: "모래바람에서 땅·바위·강철타입 기술이 1.3배. 모래바람 데미지를 받지 않는다.", // NEEDS QC
	},
	sandrush: {
		name: "모래헤치기",
		// Official flavor text: "날씨가 모래바람일 때 스피드가 올라간다."
		desc: "날씨가 모래바람일 때 이 포켓몬의 스피드가 2배가 된다. 모래바람에 의한 데미지를 받지 않는다.", // NEEDS QC
		shortDesc: "날씨가 모래바람일 때 스피드가 2배. 모래바람 데미지를 받지 않는다.", // NEEDS QC
	},
	sandspit: {
		name: "모래뿜기",
		shortDesc: "공격을 받으면 모래바람이 분다.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬이 공격에 맞으면 모래바람의 효과가 시작된다. 이 효과는 다이맥스 기술의 효과보다 뒤에 발동한다.", // NEEDS QC
		},
	},
	sandstream: {
		name: "모래날림",
		shortDesc: "등장했을 때 날씨를 모래바람으로 만든다.", // NEEDS QC
	},
	sandveil: {
		name: "모래숨기",
		// Official flavor text: "모래바람일 때 회피율이 올라간다."
		desc: "날씨가 모래바람일 때 이 포켓몬을 노리는 기술의 명중률이 0.8배가 된다. 모래바람에 의한 데미지를 받지 않는다.", // NEEDS QC
		shortDesc: "모래바람일 때 회피율이 1.25배. 모래바람 데미지를 받지 않는다.", // NEEDS QC
	},
	sapsipper: {
		name: "초식",
		// Official flavor text: "풀타입 기술을 받으면 데미지를 입지 않고 공격이 올라간다."
		desc: "이 포켓몬은 풀타입 기술을 받지 않으며, 풀타입 기술을 받으면 공격이 1단계 올라간다.", // NEEDS QC
		shortDesc: "풀타입 기술을 받으면 공격이 1단계 올라간다. 풀타입 기술을 받지 않는다.", // NEEDS QC
	},
	schooling: {
		name: "어군",
		// Official flavor text: "HP가 많을 때 무리지어 강해진다. HP가 얼마 남지 않으면 무리는 뿔뿔이 흩어진다."
		desc: "이 포켓몬이 레벨 20 이상의 약어리일 때 HP가 최대 HP의 1/4보다 많은 상태로 등장하면 군집의 모습으로 변한다. 군집의 모습일 때 HP가 최대 HP의 1/4 이하가 되면 턴 종료 시 단독의 모습으로 돌아오고, 단독의 모습일 때 턴 종료 시 HP가 최대 HP의 1/4보다 많으면 군집의 모습으로 변한다.", // NEEDS QC
		shortDesc: "약어리는 HP가 1/4보다 많으면 군집의 모습, 아니면 단독의 모습이 된다.", // NEEDS QC

		transform: "{POKEMON}의 무리가 모였다!",
		transformEnd: "{POKEMON}의 무리는 뿔뿔이 흩어졌다!",
	},
	scrappy: {
		name: "배짱",
		// Official flavor text: "고스트타입 포켓몬에게 노말타입과 격투타입의 기술을 맞게 한다."
		desc: "이 포켓몬의 노말타입과 격투타입 기술이 고스트타입 포켓몬에게 명중한다. 특성 위협의 효과를 받지 않는다.", // NEEDS QC
		shortDesc: "노말·격투타입 기술이 고스트에 명중한다. 위협에도 면역.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬은 노말타입과 격투타입 기술로 고스트타입 포켓몬을 맞힐 수 있다.", // NEEDS QC
			shortDesc: "노말/격투타입 기술로 고스트타입을 맞힐 수 있다.", // NEEDS QC
		},
	},
	screencleaner: {
		name: "배리어프리",
		shortDesc: "등장했을 때 양쪽 진영의 오로라베일, 빛의장막, 리플렉터의 효과가 사라진다.", // NEEDS QC
	},
	seedsower: {
		name: "넘치는씨",
		shortDesc: "공격을 받으면 그래스필드가 펼쳐진다.", // NEEDS QC
	},
	serenegrace: {
		name: "하늘의은총",
		// Official flavor text: "하늘의 은총 덕분에 기술의 추가 효과가 나오기 쉽다."
		desc: "이 포켓몬의 기술의 추가 효과 확률이 2배가 된다. 무지개의 효과와 중복되지만, 상대를 풀죽게 하는 추가 효과에는 무지개의 효과가 중복되지 않는다.", // NEEDS QC
		shortDesc: "기술의 추가 효과 확률이 2배가 된다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬 기술의 추가 효과 확률이 2배가 된다.", // NEEDS QC
		},
	},
	shadowshield: {
		name: "스펙터가드",
		shortDesc: "HP가 가득 찼을 때 받는 공격의 데미지가 절반이 된다.", // NEEDS QC
	},
	shadowtag: {
		name: "그림자밟기",
		// Official flavor text: "상대의 그림자를 밟아 도망치거나 교체할 수 없게 한다."
		desc: "상대는 교체할 수 없다. 아름다운허물을 지닌 포켓몬, 고스트타입 포켓몬, 같은 특성을 지닌 포켓몬은 교체할 수 있다.", // NEEDS QC
		shortDesc: "같은 특성을 지닌 포켓몬을 제외한 상대는 교체할 수 없다.", // NEEDS QC
		gen6: {
			desc: "이웃한 상대는 교체할 수 없다. 아름다운허물을 지닌 포켓몬, 고스트타입 포켓몬, 같은 특성을 지닌 포켓몬은 교체할 수 있다.", // NEEDS QC
			shortDesc: "이웃한 상대는 교체할 수 없다. 같은 특성을 지녔다면 가능.", // NEEDS QC
		},
		gen5: {
			desc: "이웃한 상대는 교체할 수 없다. 아름다운허물을 지닌 포켓몬과 같은 특성을 지닌 포켓몬은 교체할 수 있다.", // NEEDS QC
		},
		gen4: {
			desc: "상대는 교체할 수 없다. 아름다운허물을 지닌 포켓몬과 같은 특성을 지닌 포켓몬은 교체할 수 있다.", // NEEDS QC
			shortDesc: "같은 특성을 지닌 포켓몬을 제외한 상대는 교체할 수 없다.", // NEEDS QC
		},
		gen3: {
			desc: "상대는 교체할 수 없다.", // NEEDS QC
			shortDesc: "상대는 교체할 수 없다.", // NEEDS QC
		},
	},
	sharpness: {
		name: "예리함",
		shortDesc: "베기 기술의 위력이 1.5배가 된다.", // NEEDS QC
	},
	shedskin: {
		name: "탈피",
		// Official flavor text: "몸의 껍질을 벗어 던져 상태 이상을 회복할 때가 있다."
		desc: "매 턴 종료 시 33%의 확률로 자신의 상태 이상이 회복된다.", // NEEDS QC
		shortDesc: "매 턴 종료 시 33%의 확률로 상태 이상이 회복된다.", // NEEDS QC
	},
	sheerforce: {
		name: "우격다짐",
		// Official flavor text: "기술의 추가 효과가 없어지지만 그만큼 높은 위력으로 기술을 사용할 수 있다."
		desc: "이 포켓몬의 추가 효과가 있는 공격 기술은 위력이 1.3배가 되지만 추가 효과가 사라진다. 추가 효과가 사라진 기술은 생명의구슬의 반동과 조개껍질방울의 회복도 없어지며, 상대의 분노의껍질, 발끈, 변색, 위기회피, 나쁜손버릇, 도망태세, 레드카드, 탈출버튼, 악키열매, 타라프열매가 발동하지 않는다.", // NEEDS QC
		shortDesc: "추가 효과가 있는 공격 기술의 위력이 1.3배가 되지만 추가 효과가 사라진다.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬의 추가 효과가 있는 공격은 위력이 1.3배가 되지만 추가 효과가 사라진다. 추가 효과가 사라진 경우, 자신의 생명의구슬 반동과 조개껍질방울 회복도 사라지며, 상대의 발끈, 변색, 위기회피, 나쁜손버릇, 도망태세, 레드카드, 탈출버튼, 악키열매, 타라프열매의 발동을 막는다.", // NEEDS QC
		},
		gen6: {
			desc: "이 포켓몬의 추가 효과가 있는 공격은 위력이 1.3배가 되지만 추가 효과가 사라진다. 추가 효과가 사라진 경우, 자신의 생명의구슬 반동과 조개껍질방울 회복도 사라지며, 상대의 변색, 나쁜손버릇, 레드카드, 탈출버튼, 악키열매, 타라프열매의 발동을 막는다.", // NEEDS QC
		},
		gen5: {
			desc: "이 포켓몬의 추가 효과가 있는 공격은 위력이 1.3배가 되지만 추가 효과가 사라진다. 추가 효과가 사라진 경우, 자신의 생명의구슬 반동과 조개껍질방울 회복도 사라지며, 상대의 변색, 나쁜손버릇, 레드카드, 탈출버튼의 발동을 막는다.", // NEEDS QC
		},
	},
	shellarmor: {
		name: "조가비갑옷",
		shortDesc: "급소에 맞지 않는다.", // NEEDS QC
	},
	shielddust: {
		name: "인분",
		// Official flavor text: "인분에 보호받아 기술의 추가 효과를 받지 않게 된다."
		desc: "이 포켓몬은 다른 포켓몬이 쓰는 기술의 추가 효과를 받지 않는다. 확률(100%인 경우 포함)로 마비·잠듦·얼음·화상·독·혼란 상태로 만들거나, 풀죽게 하거나, 이 포켓몬의 능력을 떨어뜨리는 추가 효과와 앵커샷, 섬뜩한주문, 내던지기, 사이코노이즈, 소금절이, 그림자꿰매기, 시럽봄, 지옥찌르기의 추가 효과를 막는다. 이 포켓몬이 유일한 대상이라면 물거품아리아의 효과도 막는다. 왕의징표석과 예리한이빨, 그리고 특성 독수, 악취, 독사슬이 부여하는 추가 효과도 이 포켓몬에게는 발동하지 않는다.", // NEEDS QC
		shortDesc: "다른 포켓몬이 쓰는 기술의 추가 효과를 받지 않는다.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬은 다른 포켓몬 공격의 추가 효과를 받지 않는다. 마비, 잠듦, 얼음, 화상, 독, 혼란, 풀죽음, 능력 하락의 확률(100%라도)이 있는 공격과 앵커샷, 섬뜩한주문, 내던지기, 그림자꿰매기, 지옥찌르기의 추가 효과를 막는다. 이 포켓몬이 유일한 대상이라면 물거품아리아의 효과도 막는다. 왕의징표석과 예리한이빨, 특성 독수와 악취에 의한 추가 효과도 받지 않는다.", // NEEDS QC
		},
		gen7: {
			desc: "이 포켓몬은 다른 포켓몬 공격의 추가 효과를 받지 않는다. 마비, 잠듦, 얼음, 화상, 독, 혼란, 풀죽음, 능력 하락의 확률(100%라도)이 있는 공격과 앵커샷, 내던지기, 그림자꿰매기, 지옥찌르기의 추가 효과를 막는다. 이 포켓몬이 유일한 대상이라면 물거품아리아의 효과도 막는다. 왕의징표석과 예리한이빨, 특성 독수와 악취에 의한 추가 효과도 받지 않는다.", // NEEDS QC
		},
		gen6: {
			desc: "이 포켓몬은 다른 포켓몬 공격의 추가 효과를 받지 않는다. 마비, 잠듦, 얼음, 화상, 독, 혼란, 풀죽음, 능력 하락의 확률(100%라도)이 있는 공격과 내던지기의 추가 효과를 막는다. 왕의징표석과 예리한이빨, 특성 독수와 악취에 의한 추가 효과도 받지 않는다.", // NEEDS QC
		},
		gen4: {
			desc: "이 포켓몬은 다른 포켓몬 공격의 추가 효과를 받지 않는다. 마비, 잠듦, 얼음, 화상, 독, 혼란, 풀죽음, 능력 하락의 확률(100%라도)이 있는 공격과 내던지기의 추가 효과를 막는다. 왕의징표석과 예리한이빨에 의한 추가 효과도 받지 않는다.", // NEEDS QC
		},
		gen3: {
			desc: "이 포켓몬은 다른 포켓몬 공격의 추가 효과를 받지 않는다. 마비, 잠듦, 얼음, 화상, 독, 혼란, 풀죽음, 능력 하락의 확률(100%라도)이 있는 공격을 막는다. 왕의징표석에 의한 추가 효과도 받지 않는다.", // NEEDS QC
		},
	},
	shieldsdown: {
		name: "리밋실드",
		// Official flavor text: "HP가 절반이 되면 껍질이 깨져 공격적으로 된다."
		desc: "이 포켓몬이 메테노일 때 HP가 최대 HP의 1/2 이하이면 코어의 모습으로, 1/2보다 많으면 유성의 모습으로 변한다. 이 판정은 등장할 때와 매 턴 종료 시에 이루어진다. 유성의 모습일 때는 상태 이상이나 하품의 효과를 받지 않는다.", // NEEDS QC
		shortDesc: "메테노는 HP가 1/2 이하이면 코어의 모습, 아니면 유성의 모습이 된다.", // NEEDS QC

		transform: "리밋실드 발동!",
		transformEnd: "리밋실드 해제!",
	},
	simple: {
		name: "단순",
		shortDesc: "능력 랭크 변화가 2배로 일어난다.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬의 능력이 오르거나 떨어질 때 그 폭이 2배가 된다. 변화 Z기술을 쓰기 전에 Z파워 효과로 받는 능력 상승에는 적용되지 않는다.", // NEEDS QC
		},
		gen6: {
			desc: "이 포켓몬의 능력이 오르거나 떨어질 때 그 폭이 2배가 된다.", // NEEDS QC
		},
		gen4: {
			desc: "능력치를 계산할 때 이 포켓몬의 능력 랭크 변화를 2배로 취급한다. 랭크는 6보다 크거나 -6보다 작게 취급되지 않는다.", // NEEDS QC
			shortDesc: "능력치를 계산할 때 능력 랭크 변화를 2배로 취급한다.", // NEEDS QC
		},
	},
	skilllink: {
		name: "스킬링크",
		// Official flavor text: "연속 기술을 사용하면 항상 최고 횟수를 사용할 수 있다."
		desc: "이 포켓몬의 연속 공격 기술은 항상 최대 횟수로 공격한다. 트리플킥과 트리플악셀은 두 번째와 세 번째 공격의 명중 판정을 하지 않는다.", // NEEDS QC
		shortDesc: "연속 공격 기술이 항상 최대 횟수로 공격한다.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬의 연속 공격 기술은 항상 최대 횟수로 공격한다. 트리플킥은 두 번째와 세 번째 공격의 명중 판정을 하지 않는다.", // NEEDS QC
		},
		gen4: {
			desc: "이 포켓몬의 연속 공격 기술은 항상 최대 횟수로 공격한다. 트리플킥에는 발동하지 않는다.", // NEEDS QC
		},
	},
	slowstart: {
		name: "슬로스타트",
		shortDesc: "등장하고 5턴 동안 공격과 스피드가 절반이 된다.", // NEEDS QC
		gen7: {
			desc: "등장하면 5턴 동안 공격과 스피드가 절반이 된다. 효과가 지속되는 동안 특수 기술에 기반한 일반 Z기술을 쓰면 데미지 계산 시 특수공격이 절반이 된다.", // NEEDS QC
		},
		gen6: {
			desc: "등장하면 5턴 동안 공격과 스피드가 절반이 된다.", // NEEDS QC
		},

		start: "  {POKEMON:topic} 컨디션이 좋아지지 않는다!",
		end: "  {POKEMON:topic} 컨디션을 회복했다!",
	},
	slushrush: {
		name: "눈치우기",
		shortDesc: "날씨가 눈일 때 스피드가 2배가 된다.", // NEEDS QC
		gen8: {
			shortDesc: "싸라기눈일 때 이 포켓몬의 스피드가 2배가 된다.", // NEEDS QC
		},
	},
	sniper: {
		name: "스나이퍼",
		shortDesc: "급소에 맞히면 데미지가 1.5배가 된다.", // NEEDS QC
	},
	snowcloak: {
		name: "눈숨기",
		// Official flavor text: "날씨가 싸라기눈일 때 회피율이 올라간다."
		desc: "날씨가 눈일 때 이 포켓몬을 노리는 기술의 명중률이 0.8배가 된다.", // NEEDS QC
		shortDesc: "날씨가 눈일 때 회피율이 1.25배가 된다.", // NEEDS QC
		gen8: {
			desc: "날씨가 싸라기눈일 때 이 포켓몬을 노리는 기술의 명중률이 0.8배가 된다. 싸라기눈의 데미지를 받지 않는다.", // NEEDS QC
			shortDesc: "싸라기눈일 때 회피율이 1.25배. 싸라기눈 무효.", // NEEDS QC
		},
	},
	snowwarning: {
		name: "눈퍼뜨리기",
		shortDesc: "등장했을 때 날씨를 눈으로 만든다.", // NEEDS QC
		gen8: {
			shortDesc: "등장했을 때 싸라기눈을 내리게 한다.", // NEEDS QC
		},
	},
	solarpower: {
		name: "선파워",
		// Official flavor text: "날씨가 맑으면 특수공격이 올라가지만 매 턴 HP가 줄어든다."
		desc: "날씨가 쾌청이 되어 있으면 이 포켓몬의 특수공격이 1.5배가 되지만 매 턴 종료 시 최대 HP의 1/8(버림)을 잃는다. 만능우산을 지니고 있으면 발동하지 않는다.", // NEEDS QC
		shortDesc: "쾌청에서 특수공격이 1.5배가 되지만 매 턴 최대 HP의 1/8을 잃는다.", // NEEDS QC
		gen7: {
			desc: "날씨가 쾌청이 되어 있으면 이 포켓몬의 특수공격이 1.5배가 되고, 매 턴 종료 시 최대 HP의 1/8(버림)을 잃는다.", // NEEDS QC
		},
	},
	solidrock: {
		name: "하드록",
		shortDesc: "효과가 뛰어난 공격의 데미지를 3/4로 받는다.", // NEEDS QC
	},
	soulheart: {
		name: "소울하트",
		shortDesc: "다른 포켓몬이 기절하면 특수공격이 1단계 올라간다.", // NEEDS QC
	},
	soundproof: {
		name: "방음",
		shortDesc: "자신이 쓴 것을 제외한 소리 기술을 받지 않는다.", // NEEDS QC
		gen7: {
			shortDesc: "치료방울을 포함한 소리 기술을 받지 않는다.", // NEEDS QC
		},
		gen5: {
			shortDesc: "치료방울을 제외한 소리 기술을 받지 않는다.", // NEEDS QC
		},
		gen4: {
			shortDesc: "치료방울을 포함한 소리 기술을 받지 않는다.", // NEEDS QC
		},
	},
	speedboost: {
		name: "가속",
		// Official flavor text: "매 턴 스피드가 올라간다."
		desc: "배틀에 나와서 완전히 보낸 턴의 종료 시마다 스피드가 1단계 올라간다.", // NEEDS QC
		shortDesc: "배틀에서 완전히 보낸 턴의 종료 시마다 스피드가 1단계 올라간다.", // NEEDS QC
	},
	spicyspray: {
		name: "하바네로분출",
		shortDesc: "공격을 받으면 공격한 포켓몬이 화상 상태가 된다.", // NEEDS QC
	},
	stakeout: {
		name: "잠복",
		shortDesc: "그 턴에 교체해 나온 상대에게 공격 또는 특수공격이 2배가 된다.", // NEEDS QC
	},
	stall: {
		name: "시간벌기",
		shortDesc: "우선도가 같거나 더 높은 기술 중에서 마지막에 행동한다.", // NEEDS QC
	},
	stalwart: {
		name: "굳건한신념",
		shortDesc: "자신의 기술은 어떤 효과로도 다른 대상으로 유도되지 않는다.", // NEEDS QC
	},
	stamina: {
		name: "지구력",
		shortDesc: "기술로 데미지를 받으면 방어가 1단계 올라간다.", // NEEDS QC
	},
	stancechange: {
		name: "배틀스위치",
		// Official flavor text: "공격 기술을 쓰면 블레이드폼으로 기술 킹실드를 쓰면 실드폼으로 변한다."
		desc: "이 포켓몬이 킬가르도일 때 공격 기술을 쓰기 직전에 블레이드폼으로 변하고, 킹실드를 쓰기 직전에 실드폼으로 변한다.", // NEEDS QC
		shortDesc: "킬가르도는 공격 전에 블레이드폼, 킹실드 전에 실드폼이 된다.", // NEEDS QC
		gen6: {
			desc: "이 포켓몬이 킬가르도라면 공격 기술을 쓰기 직전에 블레이드폼으로 변하고, 킹실드를 쓰기 직전에 실드폼으로 변한다.", // NEEDS QC
		},

		transform: "블레이드폼 체인지!",
		transformEnd: "실드폼 체인지!",
	},
	static: {
		name: "정전기",
		shortDesc: "직접 공격으로 접촉한 포켓몬을 30%의 확률로 마비 상태로 만든다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬을 30%의 확률로 마비 상태로 만든다. 이 공격으로 HP를 잃지 않았다면 발동하지 않는다.", // NEEDS QC
		},
		gen3: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬을 1/3의 확률로 마비 상태로 만든다. 이 공격으로 HP를 잃지 않았다면 발동하지 않는다.", // NEEDS QC
			shortDesc: "접촉한 포켓몬을 1/3의 확률로 마비 상태로 만든다.", // NEEDS QC
		},
	},
	steadfast: {
		name: "불굴의마음",
		shortDesc: "풀죽으면 스피드가 1단계 올라간다.", // NEEDS QC
	},
	steamengine: {
		name: "증기기관",
		// Official flavor text: "물타입이나 불꽃타입 기술을 받으면 스피드가 매우 크게 올라간다."
		desc: "이 포켓몬이 불꽃타입이나 물타입 기술로 데미지를 받으면 스피드가 6단계 올라간다.", // NEEDS QC
		shortDesc: "불꽃·물타입 기술로 데미지를 받으면 스피드가 6단계 올라간다.", // NEEDS QC
	},
	steelworker: {
		name: "강철술사",
		shortDesc: "강철타입 기술의 공격 또는 특수공격이 1.5배가 된다.", // NEEDS QC
	},
	steelyspirit: {
		name: "강철정신",
		// Official flavor text: "같은 편의 강철타입 공격의 위력이 올라간다."
		desc: "이 포켓몬과 아군의 강철타입 기술의 위력이 1.5배가 된다. 쓴 포켓몬이 배틀에서 벗어나 있어도 파멸의소원에 적용된다.", // NEEDS QC
		shortDesc: "자신과 아군의 강철타입 기술의 위력이 1.5배가 된다.", // NEEDS QC
	},
	stench: {
		name: "악취",
		// Official flavor text: "악취를 풍겨서 공격했을 때 상대가 풀죽을 때가 있다."
		desc: "이 포켓몬의 상대를 풀죽일 확률이 없는 공격 기술에 10%의 확률로 상대를 풀죽이는 효과가 생긴다.", // NEEDS QC
		shortDesc: "풀죽일 확률이 없는 공격 기술에 10%의 확률로 풀죽이는 효과가 생긴다.", // NEEDS QC
		gen4: {
			desc: "배틀에서는 효과가 없다.", // NEEDS QC
			shortDesc: "배틀에서는 효과가 없다.", // NEEDS QC
		},
	},
	stickyhold: {
		name: "점착",
		// Official flavor text: "점착질의 몸에 도구가 달라붙어 있어 상대에게 도구를 뺏기지 않는다."
		desc: "이 포켓몬은 다른 포켓몬의 특성이나 공격에 의해 지닌 도구를 잃지 않는다. 공격으로 기절했을 때는 예외다. 끈적끈적바늘은 이 특성과 관계없이 다른 포켓몬에게 옮겨 간다.", // NEEDS QC
		shortDesc: "다른 포켓몬의 특성이나 공격으로 지닌 도구를 잃지 않는다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬은 다른 포켓몬의 공격으로 지닌 도구를 잃지 않는다. 그 공격으로 기절해도 잃지 않는다. 끈적끈적바늘은 이 특성과 관계없이 다른 포켓몬에게 옮겨진다.", // NEEDS QC
		},

		block: "  {POKEMON}의 도구를 빼앗을 수 없다!",
	},
	stormdrain: {
		name: "마중물",
		// Official flavor text: "물타입의 기술을 자신에게 끌어모아 데미지는 받지 않고 특수공격이 올라간다."
		desc: "이 포켓몬은 물타입 기술을 받지 않으며, 물타입 기술을 받으면 특수공격이 1단계 올라간다. 다른 포켓몬이 쓰는 단일 대상 물타입 기술의 대상이 아니라면, 그 기술의 범위 안에 있을 때 기술을 자신에게 끌어당긴다. 이 특성으로 끌어당길 수 있는 포켓몬이 여럿이라면 스피드가 가장 빠른 포켓몬이, 같다면 특성이 더 오래 활성화된 포켓몬이 끌어당긴다.", // NEEDS QC
		shortDesc: "물타입 기술을 자신에게 끌어당겨 특수공격이 1단계 올라간다. 물 무효.", // NEEDS QC
		gen4: {
			desc: "다른 포켓몬이 이 포켓몬이 아닌 단일 대상에게 물타입 기술을 쓰면 그 기술을 자신에게로 끌어당긴다.", // NEEDS QC
			shortDesc: "단일 대상 물타입 기술을 자신에게로 끌어당긴다.", // NEEDS QC
		},

		activate: "#lightningrod",
	},
	strongjaw: {
		name: "옹골찬턱",
		// Official flavor text: "턱이 튼튼하여 무는 기술의 위력이 올라간다."
		desc: "이 포켓몬의 무는 기술의 위력이 1.5배가 된다.", // NEEDS QC
		shortDesc: "무는 기술의 위력이 1.5배가 된다. 벌레먹기는 오르지 않는다.", // NEEDS QC
	},
	sturdy: {
		name: "옹골참",
		// Official flavor text: "상대 기술을 받아도 일격으로 쓰러지지 않는다. 일격필살 기술도 효과 없다."
		desc: "이 포켓몬의 HP가 가득 찼을 때는 공격을 받아도 HP가 1 남는다. 일격필살 기술도 효과가 없다.", // NEEDS QC
		shortDesc: "HP가 가득 찼을 때 공격을 HP 1로 버틴다. 일격필살 기술을 받지 않는다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬에게 일격필살 기술이 통하지 않는다.", // NEEDS QC
			shortDesc: "일격필살 기술이 통하지 않는다.", // NEEDS QC
		},

		activate: "  {POKEMON:topic} 공격을 버텼다!",
	},
	suctioncups: {
		name: "흡반",
		shortDesc: "다른 포켓몬의 공격이나 도구에 의해 강제로 교체되지 않는다.", // NEEDS QC

		block: "  {POKEMON:topic} 흡반 때문에 들러붙어 있다!",
	},
	superluck: {
		name: "대운",
		shortDesc: "급소에 맞힐 확률이 1단계 올라간다.", // NEEDS QC
	},
	supersweetsyrup: {
		name: "감미로운꿀",
		shortDesc: "등장했을 때 상대의 회피율을 1단계 떨어뜨린다. 배틀에서 1번만.", // NEEDS QC

		start: "  {POKEMON}의 꿀에서 달콤한 향기가 나고 있다!",
	},
	supremeoverlord: {
		name: "총대장",
		desc: "이 특성이 발동한 시점까지 기절한 아군 수(최대 5)를 X라 할 때, 이 포켓몬의 기술의 위력이 1+(X×0.1)배가 된다.", // NEEDS QC
		shortDesc: "기절한 아군 1마리당(최대 5) 기술의 위력이 10%씩 올라간다.", // NEEDS QC

		activate: "  {POKEMON:topic} 쓰러진 동료에게서 힘을 받았다!",
	},
	surgesurfer: {
		name: "서핑테일",
		shortDesc: "일렉트릭필드가 펼쳐져 있으면 스피드가 2배가 된다.", // NEEDS QC
	},
	swarm: {
		name: "벌레의알림",
		// Official flavor text: "HP가 줄었을 때 벌레타입 기술의 위력이 올라간다."
		desc: "이 포켓몬의 HP가 최대 HP의 1/3(버림) 이하일 때 벌레타입 기술로 공격하면 공격 또는 특수공격이 1.5배가 된다.", // NEEDS QC
		shortDesc: "최대 HP의 1/3 이하일 때 벌레타입 기술의 공격 또는 특수공격이 1.5배가 된다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬의 HP가 최대 HP의 1/3(버림) 이하일 때 벌레타입 공격 기술의 위력이 1.5배가 된다.", // NEEDS QC
			shortDesc: "HP가 1/3 이하일 때 벌레타입 공격의 위력이 1.5배가 된다.", // NEEDS QC
		},
	},
	sweetveil: {
		name: "스위트베일",
		// Official flavor text: "같은 편의 포켓몬이 잠들지 않게 된다."
		desc: "이 포켓몬과 아군은 잠듦 상태가 되지 않지만, 이미 잠들어 있는 포켓몬이 바로 깨어나지는 않는다. 잠자기는 실패하고 하품의 효과도 받지 않으며, 이미 하품의 효과를 받은 포켓몬도 잠들지 않는다.", // NEEDS QC
		shortDesc: "자신과 아군은 잠들지 않는다. 이미 잠든 포켓몬이 깨어나지는 않는다.", // NEEDS QC

		block: "  {POKEMON:topic} 스위트베일 때문에 잠들지 않는다!",
	},
	swiftswim: {
		name: "쓱쓱",
		// Official flavor text: "비가 오는 날씨일 때 스피드가 올라간다."
		desc: "날씨가 비가 되어 있으면 이 포켓몬의 스피드가 2배가 된다. 만능우산을 지니고 있으면 발동하지 않는다.", // NEEDS QC
		shortDesc: "날씨가 비가 되어 있으면 스피드가 2배가 된다.", // NEEDS QC
		gen7: {
			desc: "날씨가 비가 되어 있으면 이 포켓몬의 스피드가 2배가 된다.", // NEEDS QC
		},
	},
	swordofruin: {
		name: "재앙의검",
		shortDesc: "이 특성이 아닌 모든 포켓몬의 방어가 0.75배가 된다.", // NEEDS QC

		start: "  {POKEMON}의 재앙의검에 의해 주위의 방어가 약해졌다!",
	},
	symbiosis: {
		name: "공생",
		// Official flavor text: "같은 편이 도구를 쓰면 자신이 지니고 있는 도구를 같은 편에게 건넨다."
		desc: "아군이 도구를 사용하면 즉시 자신의 도구를 그 아군에게 건네준다. 아군의 도구를 빼앗기거나 떨어뜨렸을 때, 아군이 탈출버튼이나 탈출팩을 사용했을 때는 발동하지 않는다.", // NEEDS QC
		shortDesc: "아군이 도구를 사용하면 즉시 자신의 도구를 건네준다.", // NEEDS QC
		gen7: {
			desc: "아군이 도구를 사용하면 이 포켓몬이 지닌 도구를 그 아군에게 바로 건네준다. 아군의 도구를 빼앗기거나 떨어뜨렸거나, 아군이 탈출버튼을 사용했다면 발동하지 않는다.", // NEEDS QC
		},
		gen6: {
			desc: "아군이 도구를 사용하면 이 포켓몬이 지닌 도구를 그 아군에게 바로 건네준다. 아군의 도구를 빼앗기거나 떨어뜨렸다면 발동하지 않는다.", // NEEDS QC
		},

		activate: "  {POKEMON:topic} {ITEM:object} {TARGET}에게 지니게 했다!",
	},
	synchronize: {
		name: "싱크로",
		// Official flavor text: "자신이 걸린 독이나 마비, 화상을 상대에게 옮긴다."
		desc: "다른 포켓몬이 이 포켓몬을 화상, 마비, 독 또는 맹독 상태로 만들면 그 포켓몬도 같은 상태 이상이 된다.", // NEEDS QC
		shortDesc: "자신을 화상·독·마비 상태로 만든 포켓몬도 같은 상태 이상이 된다.", // NEEDS QC
		gen4: {
			desc: "다른 포켓몬이 이 포켓몬을 화상, 마비 또는 독 상태로 만들면 그 포켓몬도 같은 상태 이상이 된다. 다른 포켓몬이 이 포켓몬을 맹독 상태로 만들면 그 포켓몬은 독 상태가 된다.", // NEEDS QC
		},
	},
	tabletsofruin: {
		name: "재앙의목간",
		shortDesc: "이 특성이 아닌 모든 포켓몬의 공격이 0.75배가 된다.", // NEEDS QC

		start: "  {POKEMON}의 재앙의목간에 의해 주위의 공격이 약해졌다!",
	},
	tangledfeet: {
		name: "갈지자걸음",
		shortDesc: "혼란 상태인 동안 회피율이 2배가 된다.", // NEEDS QC
	},
	tanglinghair: {
		name: "컬리헤어",
		shortDesc: "직접 공격으로 접촉한 포켓몬의 스피드가 1단계 떨어진다.", // NEEDS QC
	},
	technician: {
		name: "테크니션",
		// Official flavor text: "위력이 약한 기술의 위력을 올려서 공격할 수 있다."
		desc: "이 포켓몬의 위력이 60 이하인 기술의 위력이 1.5배가 된다. 발버둥도 포함된다. 이 효과는 기술 자체의 위력 변화 뒤에 적용된다.", // NEEDS QC
		shortDesc: "위력이 60 이하인 기술의 위력이 1.5배가 된다. 발버둥 포함.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬의 위력 60 이하의 기술은 위력이 1.5배가 된다. 발버둥은 제외한다. 이 효과는 기술 자체의 위력 변화와 충전, 도우미의 효과보다 뒤에 적용된다.", // NEEDS QC
			shortDesc: "위력 60 이하의 기술은 위력이 1.5배. 발버둥은 제외.", // NEEDS QC
		},
	},
	telepathy: {
		name: "텔레파시",
		shortDesc: "아군의 공격으로 데미지를 받지 않는다.", // NEEDS QC

		block: "  {POKEMON:topic} 같은 편의 공격을 받지 않는다!",
	},
	teraformzero: {
		name: "제로포밍",
		shortDesc: "테라파고스: 테라스탈하면 날씨와 필드가 사라진다. 배틀에서 1번만.", // NEEDS QC
	},
	terashell: {
		name: "테라셸",
		desc: "이 포켓몬이 HP가 가득 찬 테라파고스라면 받는 공격의 상성이 효과가 없는 경우를 제외하고 0.5배가 된다. 연속 공격 기술은 처음부터 끝까지 같은 상성으로 판정한다.", // NEEDS QC
		shortDesc: "테라파고스: HP가 가득 찼을 때 받는 공격의 상성이 무효 이외에는 0.5배가 된다.", // NEEDS QC

		activate: "  {POKEMON:topic} 등껍질을 빛나게 하여 타입 상성을 왜곡시켰다!!",
	},
	terashift: {
		name: "테라체인지",
		shortDesc: "테라파고스는 등장했을 때 테라스탈폼으로 변한다.", // NEEDS QC

		transform: "{POKEMON}의 모습이 변화했다!",
	},
	teravolt: {
		name: "테라볼티지",
		// Official flavor text: "상대 특성에 방해받지 않고 상대에게 기술을 쓸 수 있다."
		desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 테일아머, 아로마베일, 오라브레이크, 전투무장, 부풀린가슴, 방탄, 클리어바디, 심술꾸러기, 습기, 비비드바디, 탈, 건조피부, 흙먹기, 필터, 타오르는불꽃, 플라워기프트, 플라워베일, 복슬복슬, 프렌드가드, 퍼코트, 황금몸, 풀모피, 파수견, 내열, 헤비메탈, 괴력집게, 아이스페이스, 얼음인분, 발광, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 심안, 미러아머, 전기엔진, 멀티스케일, 둔감, 방진, 마이페이스, 파스텔베일, 펑크록, 정화의소금, 여왕의위엄, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 스위트베일, 갈지자걸음, 텔레파시, 테라셸, 열교환, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수포, 수의베일, 노릇노릇바디, 하얀연기, 바람타기, 불가사의부적, 미라클스킨이다. 이 포켓몬의 기술 대상인지, 그 특성이 이 포켓몬에게 유리한지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다.", // NEEDS QC
		shortDesc: "자신의 기술과 그 효과는 다른 포켓몬의 특성을 무시한다.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 아로마베일, 오라브레이크, 전투무장, 부풀린가슴, 방탄, 클리어바디, 심술꾸러기, 습기, 비비드바디, 탈, 건조피부, 필터, 타오르는불꽃, 플라워기프트, 플라워베일, 복슬복슬, 프렌드가드, 퍼코트, 풀모피, 내열, 헤비메탈, 괴력집게, 아이스페이스, 얼음인분, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 미러아머, 전기엔진, 멀티스케일, 둔감, 방진, 마이페이스, 파스텔베일, 펑크록, 여왕의위엄, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 스위트베일, 갈지자걸음, 텔레파시, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수포, 수의베일, 하얀연기, 불가사의부적, 미라클스킨이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 그 특성이 이 포켓몬에게 이로운지도 관계없다.", // NEEDS QC
		},
		gen7: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 아로마베일, 오라브레이크, 전투무장, 부풀린가슴, 방탄, 클리어바디, 심술꾸러기, 습기, 다크오라, 비비드바디, 탈, 건조피부, 페어리오라, 필터, 타오르는불꽃, 플라워기프트, 플라워베일, 복슬복슬, 프렌드가드, 퍼코트, 풀모피, 내열, 헤비메탈, 괴력집게, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 전기엔진, 멀티스케일, 둔감, 방진, 마이페이스, 여왕의위엄, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 스위트베일, 갈지자걸음, 텔레파시, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수포, 수의베일, 하얀연기, 불가사의부적, 미라클스킨이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 그 특성이 이 포켓몬에게 이로운지도 관계없다.", // NEEDS QC
		},
		gen6: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 아로마베일, 오라브레이크, 전투무장, 부풀린가슴, 방탄, 클리어바디, 심술꾸러기, 습기, 다크오라, 건조피부, 페어리오라, 필터, 타오르는불꽃, 플라워기프트, 플라워베일, 프렌드가드, 퍼코트, 풀모피, 내열, 헤비메탈, 괴력집게, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 전기엔진, 멀티스케일, 둔감, 방진, 마이페이스, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 스위트베일, 갈지자걸음, 텔레파시, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수의베일, 하얀연기, 불가사의부적, 미라클스킨이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 그 특성이 이 포켓몬에게 이로운지도 관계없다.", // NEEDS QC
		},
		gen5: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 전투무장, 부풀린가슴, 클리어바디, 심술꾸러기, 습기, 건조피부, 필터, 타오르는불꽃, 플라워기프트, 프렌드가드, 내열, 헤비메탈, 괴력집게, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 전기엔진, 멀티스케일, 둔감, 마이페이스, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 갈지자걸음, 텔레파시, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수의베일, 하얀연기, 불가사의부적, 미라클스킨이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 그 특성이 이 포켓몬에게 이로운지도 관계없다.", // NEEDS QC
		},
		gen4: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 전투무장, 클리어바디, 습기, 건조피부, 필터, 타오르는불꽃, 플라워기프트, 내열, 괴력집게, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 피뢰침, 유연, 마그마의무장, 이상한비늘, 전기엔진, 둔감, 마이페이스, 모래숨기, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 갈지자걸음, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수의베일, 하얀연기, 불가사의부적이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 아군의 특성 플라워기프트에 의한 공격 보정은 무시하지 않는다.", // NEEDS QC
		},

		start: "  {POKEMON:topic} 세차게 튀는 오라를 발산하고 있다!",
	},
	thermalexchange: {
		name: "열교환",
		desc: "이 포켓몬이 불꽃타입 기술로 데미지를 받으면 공격이 1단계 올라간다. 화상 상태가 되지 않으며, 화상 상태일 때 이 특성을 얻으면 회복된다.", // NEEDS QC
		shortDesc: "불꽃타입 기술로 데미지를 받으면 공격이 1단계 올라간다. 화상이 되지 않는다.", // NEEDS QC
	},
	thickfat: {
		name: "두꺼운지방",
		// Official flavor text: "두꺼운 지방으로 보호되고 있어 불꽃타입과 얼음타입의 기술의 데미지를 반감시킨다."
		desc: "이 포켓몬이 받는 불꽃타입과 얼음타입 공격은 공격한 포켓몬의 공격 또는 특수공격을 절반으로 계산한다.", // NEEDS QC
		shortDesc: "받는 불꽃·얼음타입 공격은 상대의 공격 능력을 절반으로 계산한다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬이 받는 불꽃타입과 얼음타입 공격의 위력이 절반이 된다.", // NEEDS QC
			shortDesc: "이 포켓몬이 받는 불꽃/얼음타입 공격의 위력이 절반이 된다.", // NEEDS QC
		},
		gen3: {
			desc: "다른 포켓몬이 이 포켓몬에게 불꽃타입이나 얼음타입 공격을 쓰면, 이 포켓몬에게 주는 데미지를 계산할 때 그 포켓몬의 특수공격이 절반이 된다.", // NEEDS QC
			shortDesc: "이 포켓몬을 노리는 불꽃/얼음타입 공격은 특수공격을 절반으로 계산한다.", // NEEDS QC
		},
	},
	tintedlens: {
		name: "색안경",
		shortDesc: "효과가 별로인 공격의 데미지가 2배가 된다.", // NEEDS QC
	},
	torrent: {
		name: "급류",
		// Official flavor text: "HP가 줄었을 때 물타입 기술의 위력이 올라간다."
		desc: "이 포켓몬의 HP가 최대 HP의 1/3(버림) 이하일 때 물타입 기술로 공격하면 공격 또는 특수공격이 1.5배가 된다.", // NEEDS QC
		shortDesc: "최대 HP의 1/3 이하일 때 물타입 기술의 공격 또는 특수공격이 1.5배가 된다.", // NEEDS QC
		gen4: {
			desc: "이 포켓몬의 HP가 최대 HP의 1/3(버림) 이하일 때 물타입 공격 기술의 위력이 1.5배가 된다.", // NEEDS QC
			shortDesc: "HP가 1/3 이하일 때 물타입 공격의 위력이 1.5배가 된다.", // NEEDS QC
		},
	},
	toughclaws: {
		name: "단단한발톱",
		shortDesc: "직접 공격의 위력이 1.3배가 된다.", // NEEDS QC
	},
	toxicboost: {
		name: "독폭주",
		// Official flavor text: "독 상태가 되었을 때 물리 기술의 위력이 올라간다."
		desc: "이 포켓몬이 독 상태일 때 물리 공격 기술의 위력이 1.5배가 된다.", // NEEDS QC
		shortDesc: "독 상태일 때 물리 기술의 위력이 1.5배가 된다.", // NEEDS QC
	},
	toxicchain: {
		name: "독사슬",
		desc: "이 포켓몬의 공격 기술에 30%의 확률로 상대를 맹독 상태로 만드는 효과가 생긴다. 이 효과는 기술이 원래 지닌 추가 효과의 확률보다 앞에 적용된다.", // NEEDS QC
		shortDesc: "공격 기술에 30%의 확률로 상대를 맹독 상태로 만드는 효과가 생긴다.", // NEEDS QC
	},
	toxicdebris: {
		name: "독치장",
		shortDesc: "물리 공격을 받으면 상대 진영에 독압정이 깔린다.", // NEEDS QC
	},
	trace: {
		name: "트레이스",
		// Official flavor text: "등장했을 때 상대의 특성을 트레이스해서 같은 특성이 된다."
		desc: "등장했을 때 무작위로 상대 포켓몬 하나의 특성을 복사한다. 혼연일체, 유대변화, 절대안깸, 사령탑, 탈, 초상투영, 플라워기프트, 기분파, 꼬르륵스위치, 아이스페이스, 일루전, 괴짜, 멀티타입, 화학변화가스, 독조종, 스웜체인지, 과학의힘, 고대활성, 쿼크차지, 리시버, AR시스템, 어군, 리밋실드, 배틀스위치, 제로포밍, 테라셸, 테라체인지, 트레이스, 달마모드, 마이티체인지는 복사할 수 없다. 복사할 수 있는 특성을 지닌 상대가 없다면, 생기는 대로 이 특성이 발동한다.", // NEEDS QC
		shortDesc: "등장했을 때 무작위로 상대의 특성을 복사한다.", // NEEDS QC
		gen8: {
			desc: "등장했을 때 상대 포켓몬 하나의 특성을 무작위로 복사한다. 혼연일체, 유대변화, 절대안깸, 탈, 플라워기프트, 기분파, 그대로꿀꺽미사일, 꼬르륵스위치, 아이스페이스, 일루전, 괴짜, 멀티타입, 화학변화가스, 스웜체인지, 과학의힘, 리시버, AR시스템, 어군, 리밋실드, 배틀스위치, 트레이스, 달마모드는 복사할 수 없다. 복사할 수 있는 특성을 지닌 상대가 없다면, 생기는 대로 이 특성이 발동한다.", // NEEDS QC
		},
		gen7: {
			desc: "등장했을 때 상대 포켓몬 하나의 특성을 무작위로 복사한다. 유대변화, 절대안깸, 탈, 플라워기프트, 기분파, 일루전, 괴짜, 멀티타입, 스웜체인지, 과학의힘, 리시버, AR시스템, 어군, 리밋실드, 배틀스위치, 트레이스, 달마모드는 복사할 수 없다. 복사할 수 있는 특성을 지닌 상대가 없다면, 생기는 대로 이 특성이 발동한다.", // NEEDS QC
		},
		gen6: {
			desc: "등장했을 때 이웃한 상대 포켓몬 하나의 특성을 무작위로 복사한다. 플라워기프트, 기분파, 일루전, 괴짜, 멀티타입, 배틀스위치, 트레이스, 달마모드는 복사할 수 없다. 복사할 수 있는 특성을 지닌 상대가 없다면, 생기는 대로 이 특성이 발동한다.", // NEEDS QC
		},
		gen5: {
			desc: "등장했을 때 이웃한 상대 포켓몬 하나의 특성을 무작위로 복사한다. 플라워기프트, 기분파, 일루전, 괴짜, 멀티타입, 트레이스, 달마모드는 복사할 수 없다. 복사할 수 있는 특성을 지닌 상대가 없다면, 생기는 대로 이 특성이 발동한다.", // NEEDS QC
		},
		gen4: {
			desc: "등장했을 때 상대 포켓몬 하나의 특성을 무작위로 복사한다. 기분파, 멀티타입, 트레이스는 복사할 수 없다. 복사할 수 있는 특성을 지닌 상대가 없다면, 생기는 대로 이 특성이 발동한다.", // NEEDS QC
		},
		gen3: {
			desc: "등장했을 때 상대 포켓몬 하나의 특성을 무작위로 복사한다.", // NEEDS QC
		},

		changeAbility: "  {POKEMON:topic} {SOURCE}의 {ABILITY:object} 트레이스했다!",
	},
	transistor: {
		name: "트랜지스터",
		shortDesc: "전기타입 기술의 공격 또는 특수공격이 1.3배가 된다.", // NEEDS QC
		gen8: {
			shortDesc: "전기타입 공격을 쓸 때 공격 능력치가 1.5배가 된다.", // NEEDS QC
		},
	},
	triage: {
		name: "힐링시프트",
		shortDesc: "회복 기술의 우선도가 3 올라간다.", // NEEDS QC
	},
	truant: {
		name: "게으름",
		shortDesc: "한 턴 걸러 한 번씩만 행동할 수 있다.", // NEEDS QC
		gen3: {
			desc: "이 포켓몬은 한 턴 걸러 기술을 쓰지 못하고 게으름을 피운다. 턴 종료 시의 효과로 기절한 포켓몬 대신 등장하면 첫 턴을 게으름 피운다.", // NEEDS QC
		},

		cant: "{POKEMON:topic} 게으름을 피우고 있다.",
	},
	turboblaze: {
		name: "터보블레이즈",
		// Official flavor text: "상대 특성에 방해받지 않고 상대에게 기술을 쓸 수 있다."
		desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 테일아머, 아로마베일, 오라브레이크, 전투무장, 부풀린가슴, 방탄, 클리어바디, 심술꾸러기, 습기, 비비드바디, 탈, 건조피부, 흙먹기, 필터, 타오르는불꽃, 플라워기프트, 플라워베일, 복슬복슬, 프렌드가드, 퍼코트, 황금몸, 풀모피, 파수견, 내열, 헤비메탈, 괴력집게, 아이스페이스, 얼음인분, 발광, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 심안, 미러아머, 전기엔진, 멀티스케일, 둔감, 방진, 마이페이스, 파스텔베일, 펑크록, 정화의소금, 여왕의위엄, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 스위트베일, 갈지자걸음, 텔레파시, 테라셸, 열교환, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수포, 수의베일, 노릇노릇바디, 하얀연기, 바람타기, 불가사의부적, 미라클스킨이다. 이 포켓몬의 기술 대상인지, 그 특성이 이 포켓몬에게 유리한지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다.", // NEEDS QC
		shortDesc: "자신의 기술과 그 효과는 다른 포켓몬의 특성을 무시한다.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 아로마베일, 오라브레이크, 전투무장, 부풀린가슴, 방탄, 클리어바디, 심술꾸러기, 습기, 비비드바디, 탈, 건조피부, 필터, 타오르는불꽃, 플라워기프트, 플라워베일, 복슬복슬, 프렌드가드, 퍼코트, 풀모피, 내열, 헤비메탈, 괴력집게, 아이스페이스, 얼음인분, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 미러아머, 전기엔진, 멀티스케일, 둔감, 방진, 마이페이스, 파스텔베일, 펑크록, 여왕의위엄, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 스위트베일, 갈지자걸음, 텔레파시, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수포, 수의베일, 하얀연기, 불가사의부적, 미라클스킨이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 그 특성이 이 포켓몬에게 이로운지도 관계없다.", // NEEDS QC
		},
		gen7: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 아로마베일, 오라브레이크, 전투무장, 부풀린가슴, 방탄, 클리어바디, 심술꾸러기, 습기, 다크오라, 비비드바디, 탈, 건조피부, 페어리오라, 필터, 타오르는불꽃, 플라워기프트, 플라워베일, 복슬복슬, 프렌드가드, 퍼코트, 풀모피, 내열, 헤비메탈, 괴력집게, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 전기엔진, 멀티스케일, 둔감, 방진, 마이페이스, 여왕의위엄, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 스위트베일, 갈지자걸음, 텔레파시, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수포, 수의베일, 하얀연기, 불가사의부적, 미라클스킨이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 그 특성이 이 포켓몬에게 이로운지도 관계없다.", // NEEDS QC
		},
		gen6: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 아로마베일, 오라브레이크, 전투무장, 부풀린가슴, 방탄, 클리어바디, 심술꾸러기, 습기, 다크오라, 건조피부, 페어리오라, 필터, 타오르는불꽃, 플라워기프트, 플라워베일, 프렌드가드, 퍼코트, 풀모피, 내열, 헤비메탈, 괴력집게, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 전기엔진, 멀티스케일, 둔감, 방진, 마이페이스, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 스위트베일, 갈지자걸음, 텔레파시, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수의베일, 하얀연기, 불가사의부적, 미라클스킨이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 그 특성이 이 포켓몬에게 이로운지도 관계없다.", // NEEDS QC
		},
		gen5: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 전투무장, 부풀린가슴, 클리어바디, 심술꾸러기, 습기, 건조피부, 필터, 타오르는불꽃, 플라워기프트, 프렌드가드, 내열, 헤비메탈, 괴력집게, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 라이트메탈, 피뢰침, 유연, 매직미러, 마그마의무장, 이상한비늘, 전기엔진, 멀티스케일, 둔감, 마이페이스, 모래숨기, 초식, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 갈지자걸음, 텔레파시, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수의베일, 하얀연기, 불가사의부적, 미라클스킨이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 그 특성이 이 포켓몬에게 이로운지도 관계없다.", // NEEDS QC
		},
		gen4: {
			desc: "이 포켓몬의 기술과 그 효과는 다른 포켓몬의 일부 특성을 무시한다. 무시할 수 있는 특성은 전투무장, 클리어바디, 습기, 건조피부, 필터, 타오르는불꽃, 플라워기프트, 내열, 괴력집게, 면역, 정신력, 불면, 날카로운눈, 리프가드, 부유, 피뢰침, 유연, 마그마의무장, 이상한비늘, 전기엔진, 둔감, 마이페이스, 모래숨기, 조가비갑옷, 인분, 단순, 눈숨기, 하드록, 방음, 점착, 마중물, 옹골참, 흡반, 갈지자걸음, 두꺼운지방, 천진, 의기양양, 축전, 저수, 수의베일, 하얀연기, 불가사의부적이다. 이 효과는 이 포켓몬의 기술의 대상인지와 관계없이 배틀에 나와 있는 다른 모든 포켓몬에게 적용된다. 아군의 특성 플라워기프트에 의한 공격 보정은 무시하지 않는다.", // NEEDS QC
		},

		start: "  {POKEMON:topic} 활활 타오르는 오라를 발산하고 있다!",
	},
	unaware: {
		name: "천진",
		// Official flavor text: "상대의 능력 변화를 무시하고 공격할 수 있다."
		desc: "이 포켓몬은 데미지를 받을 때 다른 포켓몬의 공격, 특수공격, 명중률 랭크 변화를 무시하고, 데미지를 줄 때 다른 포켓몬의 방어, 특수방어, 회피율 랭크 변화를 무시한다.", // NEEDS QC
		shortDesc: "데미지를 주고받을 때 다른 포켓몬의 능력 랭크 변화를 무시한다.", // NEEDS QC
	},
	unburden: {
		name: "곡예",
		// Official flavor text: "지니던 도구가 없어지면 스피드가 올라간다."
		desc: "이 포켓몬이 어떤 이유로든 지닌 도구를 잃으면 배틀에서 벗어나거나 특성이 바뀌거나 새로 도구를 지닐 때까지 스피드가 2배가 된다.", // NEEDS QC
		shortDesc: "지닌 도구를 잃으면 스피드가 2배가 된다. 교체하거나 새 도구를 지니면 원래대로.", // NEEDS QC
	},
	unnerve: {
		name: "긴장감",
		// Official flavor text: "상대를 긴장시켜 나무열매를 먹지 못하게 한다."
		desc: "이 포켓몬이 배틀에 나와 있는 동안 상대는 나무열매를 먹을 수 없다. 이 특성은 설치 기술이나 다른 특성보다 먼저 발동한다.", // NEEDS QC
		shortDesc: "이 포켓몬이 배틀에 나와 있는 동안 상대는 나무열매를 먹을 수 없다.", // NEEDS QC

		start: "  {TEAM:topic} 긴장해서 나무열매를 먹을 수 없게 되었다!",
	},
	unseenfist: {
		name: "보이지않는주먹",
		shortDesc: "직접 공격이 상대의 방어 효과를 뚫는다(다이월 제외).", // NEEDS QC
		champions: {
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	vesselofruin: {
		name: "재앙의그릇",
		shortDesc: "이 특성이 아닌 모든 포켓몬의 특수공격이 0.75배가 된다.", // NEEDS QC

		start: "  {POKEMON}의 재앙의그릇에 의해 주위의 특수공격이 약해졌다!",
	},
	victorystar: {
		name: "승리의별",
		shortDesc: "자신과 아군의 기술의 명중률이 1.1배가 된다.", // NEEDS QC
	},
	vitalspirit: {
		name: "의기양양",
		shortDesc: "잠듦 상태가 되지 않는다. 잠들어 있을 때 이 특성을 얻으면 깨어난다.", // NEEDS QC
	},
	voltabsorb: {
		name: "축전",
		// Official flavor text: "전기타입의 기술을 받으면 데미지를 받지 않고 회복한다."
		desc: "이 포켓몬은 전기타입 기술을 받지 않으며, 전기타입 기술을 받으면 최대 HP의 1/4(버림)을 회복한다.", // NEEDS QC
		shortDesc: "전기타입 기술을 받으면 최대 HP의 1/4을 회복한다. 전기타입 기술을 받지 않는다.", // NEEDS QC
		gen3: {
			desc: "이 포켓몬은 전기타입 공격 기술을 받지 않으며, 받으면 최대 HP의 1/4(버림)을 회복한다.", // NEEDS QC
			shortDesc: "전기타입 공격 기술을 무효화하고 최대 HP의 1/4을 회복한다.", // NEEDS QC
		},
	},
	wanderingspirit: {
		name: "떠도는영혼",
		// Official flavor text: "접촉하는 기술로 공격해온 포켓몬과 특성을 바꾼다."
		desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬은 이 포켓몬과 특성을 맞바꾼다. 특성이 혼연일체, 유대변화, 절대안깸, 사령탑, 탈, 초상투영, 꼬르륵스위치, 아이스페이스, 일루전, 멀티타입, 화학변화가스, 독조종, 스웜체인지, 고대활성, 쿼크차지, AR시스템, 어군, 리밋실드, 배틀스위치, 테라셸, 테라체인지, 제로포밍, 불가사의부적, 달마모드, 마이티체인지인 포켓몬에게는 효과가 없다.", // NEEDS QC
		shortDesc: "직접 공격으로 접촉한 포켓몬과 특성을 맞바꾼다.", // NEEDS QC
		gen8: {
			desc: "이 포켓몬에게 직접 공격으로 접촉한 포켓몬과 특성을 맞바꾼다. 특성이 혼연일체, 유대변화, 절대안깸, 탈, 그대로꿀꺽미사일, 꼬르륵스위치, 아이스페이스, 일루전, 멀티타입, 화학변화가스, 스웜체인지, AR시스템, 어군, 리밋실드, 배틀스위치, 불가사의부적, 달마모드인 포켓몬에게는 효과가 없다.", // NEEDS QC
		},

		activate: "#skillswap",
	},
	waterabsorb: {
		name: "저수",
		// Official flavor text: "물타입의 기술을 받으면 데미지를 받지 않고 회복한다."
		desc: "이 포켓몬은 물타입 기술을 받지 않으며, 물타입 기술을 받으면 최대 HP의 1/4(버림)을 회복한다.", // NEEDS QC
		shortDesc: "물타입 기술을 받으면 최대 HP의 1/4을 회복한다. 물타입 기술을 받지 않는다.", // NEEDS QC
	},
	waterbubble: {
		name: "수포",
		// Official flavor text: "자신을 향하는 불꽃타입 기술의 위력을 떨어뜨린다. 화상을 입지 않는다."
		desc: "이 포켓몬이 물타입 기술로 공격하면 공격 또는 특수공격이 2배가 된다. 이 포켓몬이 받는 불꽃타입 공격은 공격한 포켓몬의 공격 또는 특수공격을 절반으로 계산한다. 화상 상태가 되지 않으며, 화상 상태일 때 이 특성을 얻으면 회복된다.", // NEEDS QC
		shortDesc: "물타입 기술의 위력이 2배. 화상이 되지 않고, 받는 불꽃 위력은 절반이 된다.", // NEEDS QC
	},
	watercompaction: {
		name: "꾸덕꾸덕굳기",
		shortDesc: "물타입 기술로 데미지를 받으면 방어가 2단계 올라간다.", // NEEDS QC
	},
	waterveil: {
		name: "수의베일",
		shortDesc: "화상 상태가 되지 않는다. 화상 상태일 때 이 특성을 얻으면 회복된다.", // NEEDS QC
	},
	weakarmor: {
		name: "깨어진갑옷",
		// Official flavor text: "물리 기술로 데미지를 받으면 방어가 떨어지고 스피드가 크게 올라간다."
		desc: "이 포켓몬이 물리 공격을 받으면 방어가 1단계 떨어지고 스피드가 2단계 올라간다.", // NEEDS QC
		shortDesc: "물리 공격에 맞으면 방어가 1단계 떨어지고 스피드가 2단계 올라간다.", // NEEDS QC
		gen6: {
			desc: "이 포켓몬이 물리 공격에 맞으면 방어가 1단계 떨어지고 스피드가 1단계 올라간다.", // NEEDS QC
			shortDesc: "물리 공격에 맞으면 방어가 1단계 떨어지고 스피드가 1단계 올라간다.", // NEEDS QC
		},
	},
	wellbakedbody: {
		name: "노릇노릇바디",
		desc: "이 포켓몬은 불꽃타입 기술을 받지 않으며, 불꽃타입 기술을 받으면 방어가 2단계 올라간다.", // NEEDS QC
		shortDesc: "불꽃타입 기술을 받으면 방어가 2단계 올라간다. 불꽃타입 기술을 받지 않는다.", // NEEDS QC
	},
	whitesmoke: {
		name: "하얀연기",
		shortDesc: "다른 포켓몬에 의해 능력이 떨어지지 않는다.", // NEEDS QC
	},
	wimpout: {
		name: "도망태세",
		// Official flavor text: "HP가 절반이 되면 황급히 도망쳐서 지닌 포켓몬으로 돌아간다."
		desc: "이 포켓몬의 HP가 최대 HP의 1/2보다 많은 상태에서 데미지를 받아 1/2 이하가 되면 선택한 아군과 즉시 교체된다. 연속 공격 기술은 모든 공격이 끝난 뒤에 적용된다. 특성 우격다짐으로 추가 효과가 사라진 기술에는 발동하지 않는다. 직접적인 데미지와 간접적인 데미지 모두에 발동하지만 저주와 대타출동의 사용, 배북, 아픔나누기, 혼란에 의한 데미지는 예외다.", // NEEDS QC
		shortDesc: "최대 HP의 1/2 이하가 되면 배틀에서 물러난다.", // NEEDS QC
	},
	windpower: {
		name: "풍력발전",
		desc: "이 포켓몬이 바람 기술을 받거나 아군 진영에 순풍이 발동하면 충전의 효과를 얻는다.", // NEEDS QC
		shortDesc: "바람 기술을 받거나 순풍이 발동하면 충전의 효과를 얻는다.", // NEEDS QC

		start: "#electromorphosis",
	},
	windrider: {
		name: "바람타기",
		desc: "이 포켓몬은 바람 기술을 받지 않으며, 바람 기술을 받거나 아군 진영에 순풍이 발동하면 공격이 1단계 올라간다.", // NEEDS QC
		shortDesc: "바람 기술을 받거나 순풍이 발동하면 공격이 1단계 올라간다. 바람 기술 무효.", // NEEDS QC
	},
	wonderguard: {
		name: "불가사의부적",
		shortDesc: "효과가 뛰어난 기술과 간접적인 데미지로만 데미지를 받는다.", // NEEDS QC
		gen4: {
			shortDesc: "불꽃엄니, 효과가 뛰어난 기술, 간접 데미지로만 데미지를 받는다.", // NEEDS QC
		},
		gen3: {
			shortDesc: "효과가 뛰어난 기술과 간접 데미지로만 데미지를 받는다.", // NEEDS QC
		},
	},
	wonderskin: {
		name: "미라클스킨",
		// Official flavor text: "변화 기술을 받기 어려운 몸으로 되어 있다."
		desc: "이 포켓몬을 노리는 명중 판정이 있는 변화 기술의 명중률이 50%가 된다. 이 효과는 명중률을 바꾸는 다른 효과보다 앞에 적용된다.", // NEEDS QC
		shortDesc: "명중 판정이 있는 변화 기술이 50%의 명중률로 자신을 노린다.", // NEEDS QC
	},
	zenmode: {
		name: "달마모드",
		// Official flavor text: "HP가 절반 이하가 되면 모습이 변화한다."
		desc: "이 포켓몬이 불비달마 또는 불비달마（가라르의 모습）일 때 턴 종료 시 HP가 최대 HP의 1/2 이하이면 달마모드로 변한다. 턴 종료 시 HP가 최대 HP의 1/2보다 많으면 노말모드로 돌아온다.", // NEEDS QC
		shortDesc: "불비달마는 턴 종료 시 HP가 1/2 이하이면 달마모드, 아니면 노말모드가 된다.", // NEEDS QC
		gen7: {
			desc: "이 포켓몬이 불비달마라면 턴 종료 시 HP가 절반 이하일 때 달마모드로 변한다. 턴 종료 시 HP가 절반보다 많으면 노말모드로 돌아온다.", // NEEDS QC
		},
		gen6: {
			desc: "이 포켓몬이 불비달마라면 턴 종료 시 HP가 절반 이하일 때 달마모드로 변한다. 턴 종료 시 HP가 절반보다 많으면 노말모드로 돌아온다. 달마모드에서 이 특성을 잃으면 바로 노말모드로 돌아온다.", // NEEDS QC
		},

		transform: "달마모드 발동!",
		transformEnd: "달마모드 해제!",
	},
	zerotohero: {
		name: "마이티체인지",
		shortDesc: "나이브폼 돌핀맨은 교체해 물러나면 마이티폼으로 변한다.", // NEEDS QC

		activate: "  {POKEMON:topic} 변신하고 돌아왔다!",
	},

	// CAP
	mountaineer: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "등장했을 때 모든 바위타입 공격과 스텔스록을 피한다.", // NEEDS QC
	},
	rebound: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "등장했을 때 자신을 노리는 일부 변화 기술의 효과를 받지 않고 쓴 포켓몬에게 되받아친다.", // NEEDS QC
		shortDesc: "등장했을 때 일부 변화 기술을 받지 않고 쓴 포켓몬에게 되받아친다.", // NEEDS QC

		move: "#magiccoat",
	},
	persistent: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "이 포켓몬이 발동시킨 중력, 회복봉인, 매직룸, 신비의부적, 순풍, 트릭룸, 원더룸의 지속 시간이 2턴 늘어난다.", // NEEDS QC
		shortDesc: "자신이 발동시킨 중력, 회복봉인, 신비의부적, 순풍, 룸의 지속이 2턴 늘어난다.", // NEEDS QC

		activate: "  {POKEMON:topic} {MOVE:object} 2턴 연장했다!", // NEEDS QC
	},
};
