export const TermNames: { [id: string]: TranslationString } = {
	shiny: "색이 다른 모습",
	happiness: "친밀도", // NEEDS QC
	level: "레벨", // NEEDS QC
	nickname: "닉네임", // NEEDS QC
	ev: "노력치", // NEEDS QC
	evs: "노력치", // NEEDS QC
	iv: "개체값", // NEEDS QC
	ivs: "개체값", // NEEDS QC
	dv: "개체값", // NEEDS QC
	dvs: "개체값", // NEEDS QC
	av: "노력치", // NEEDS QC
	avs: "노력치", // NEEDS QC
	point: "포인트", // NEEDS QC
	points: "포인트", // NEEDS QC
	// n.b. used in Teambuilder, so it should be capitalized (unlike StatNames.stats)
	stats: "스테이터스",

	pokemon: "포켓몬",
	move: "기술", // NEEDS QC
	moves: "기술", // NEEDS QC
	item: "지닌 물건", // NEEDS QC
	items: "지닌 물건", // NEEDS QC
	ability: "특성", // NEEDS QC
	abilities: "특성", // NEEDS QC
	hiddenability: "숨겨진 특성", // NEEDS QC
	team: "팀", // NEEDS QC
	teams: "팀", // NEEDS QC
	teamslist: "팀 목록", // NEEDS QC

	type: "타입",
	types: "타입",
	teratype: "테라스탈타입", // NEEDS QC
	nature: "성격",
	category: "분류",
	categories: "분류",
	gender: "성별",
	egggroup: "알그룹", // NEEDS QC
	egggroups: "알그룹", // NEEDS QC
	tag: "태그", // NEEDS QC
	article: "기사", // NEEDS QC
	articles: "기사", // NEEDS QC
	tier: "티어", // NEEDS QC
	tiers: "티어", // NEEDS QC
	color: "색",
	form: "모습", // NEEDS QC
	forme: "폼", // NEEDS QC
	dexnum: "도감 No.", // NEEDS QC
	generation: "세대", // NEEDS QC
	gennum: "[NUMBER]세대", // NEEDS QC
	evolution: "진화", // NEEDS QC
	preevolution: "진화 전", // NEEDS QC
	doesnotevolve: "진화하지 않음", // NEEDS QC
	zcrystal: "Z크리스탈", // NEEDS QC
	target: "대상", // NEEDS QC
	height: "키",
	numm: "[NUMBER]m", // NEEDS QC
	weight: "몸무게",
	numkg: "[NUMBER]kg", // NEEDS QC

	megaevolution: "메가진화", // NEEDS QC
	zpower: "Z파워", // NEEDS QC
	dynamax: "다이맥스", // NEEDS QC
	dynamaxlevel: "다이맥스 레벨", // NEEDS QC

	supereffective: "효과가 굉장함", // NEEDS QC
	extremelyeffective: "효과가 매우 굉장함", // NEEDS QC
	effective: "효과 있음", // NEEDS QC
	notveryeffective: "효과가 별로", // NEEDS QC
	mostlyineffective: "효과가 매우 별로", // NEEDS QC
	noeffect: "효과 없음", // NEEDS QC

	weak: "약점", // NEEDS QC: unofficial
	resist: "반감", // NEEDS QC: unofficial
	immune: "무효", // NEEDS QC: unofficial

	nicknamespecies: "[NICKNAME]([SPECIES])", // NEEDS QC
	speciesforme: "[SPECIES]-[FORME]",
};

export const StatNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "공격", def: "방어", spa: "특수공격", spd: "특수방어", spe: "스피드",
	accuracy: "명중률", evasion: "회피율", spc: "특수",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike TermNames.stats)
	stats: "스테이터스",
};

export const StatMediumNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "공격", def: "방어", spa: "특수공격", spd: "특수방어",
	spe: "스피드", accuracy: "명중", evasion: "회피", spc: "특수",
};

export const StatShortNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "공", def: "방", spa: "특공", spd: "특방", spe: "스핏", spc: "특수",
};

export const TypeNames: { [id: string]: TranslationString } = {
	bug: "벌레",
	dark: "악",
	dragon: "드래곤",
	electric: "전기",
	fairy: "페어리",
	fighting: "격투",
	fire: "불꽃",
	flying: "비행",
	ghost: "고스트",
	grass: "풀",
	ground: "땅",
	ice: "얼음",
	normal: "노말",
	poison: "독",
	psychic: "에스퍼",
	rock: "바위",
	steel: "강철",
	stellar: "스텔라",
	water: "물",
};

export const NatureNames: { [id: string]: TranslationString } = {
	adamant: "고집",
	bashful: "수줍음",
	bold: "대담",
	brave: "용감",
	calm: "차분",
	careful: "신중",
	docile: "온순",
	gentle: "얌전",
	hardy: "노력",
	hasty: "성급",
	impish: "장난꾸러기",
	jolly: "명랑",
	lax: "촐랑",
	lonely: "외로움",
	mild: "의젓",
	modest: "조심",
	naive: "천진난만",
	naughty: "개구쟁이",
	quiet: "냉정",
	quirky: "변덕",
	rash: "덜렁",
	relaxed: "무사태평",
	sassy: "건방",
	serious: "성실",
	timid: "겁쟁이",
};

export const GenderNames: { [id: string]: TranslationString } = {
	male: "수컷",
	female: "암컷",
	genderless: "성별 없음",
};

export const StatusNames: { [id: string]: TranslationString } = {
	brn: "화상", // NEEDS QC
	par: "마비", // NEEDS QC
	slp: "잠듦", // NEEDS QC
	frz: "얼음", // NEEDS QC
	psn: "독", // NEEDS QC
	tox: "맹독", // NEEDS QC
	fnt: "기절", // NEEDS QC
	confusion: "혼란", // NEEDS QC
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: "인접한 포켓몬 1마리", // NEEDS QC
	self: "자신", // NEEDS QC
	adjacentAlly: "아군 1마리", // NEEDS QC
	adjacentAllyOrSelf: "자신 또는 아군 1마리", // NEEDS QC
	adjacentFoe: "인접한 상대 1마리", // NEEDS QC
	allAdjacentFoes: "인접한 상대 전체", // NEEDS QC
	foeSide: "상대의 필드", // NEEDS QC
	allySide: "자신의 필드", // NEEDS QC
	allyTeam: "자신의 지닌 포켓몬 전체", // NEEDS QC
	allAdjacent: "인접한 포켓몬 전체", // NEEDS QC
	any: "포켓몬 1마리", // NEEDS QC
	all: "필드의 포켓몬 전체", // NEEDS QC
	scripted: "자동으로 선택", // NEEDS QC
	randomNormal: "무작위 상대 1마리", // NEEDS QC
	allies: "자신과 아군 전체", // NEEDS QC
};

export const EggGroupNames: { [id: string]: TranslationString } = {
	monster: "괴수", // NEEDS QC
	water1: "수중1", // NEEDS QC
	bug: "벌레", // NEEDS QC
	flying: "비행", // NEEDS QC
	field: "육상", // NEEDS QC
	fairy: "요정", // NEEDS QC
	grass: "식물", // NEEDS QC
	humanlike: "인간형", // NEEDS QC
	water3: "수중3", // NEEDS QC
	mineral: "광물", // NEEDS QC
	amorphous: "부정형", // NEEDS QC
	water2: "수중2", // NEEDS QC
	ditto: "메타몽", // NEEDS QC
	dragon: "드래곤", // NEEDS QC
	undiscovered: "미발견", // NEEDS QC
};

export const TagNames: { [id: string]: TranslationString } = {
	physical: "물리",
	special: "특수",
	status: "변화",
	mega: "메가진화",
	gigantamax: "거다이맥스",
	mythical: "환상의 포켓몬",
	sublegendary: "준전설", // NEEDS QC
	restrictedlegendary: "제한 전설", // NEEDS QC
	ultrabeast: "울트라비스트",
	paradox: "패러독스",
	pokestar: "포켓우드", // NEEDS QC
	zmove: "Z기술",
	maxmove: "다이맥스기술",
	contact: "직접 공격", // NEEDS QC
	sound: "소리", // NEEDS QC
	powder: "가루", // NEEDS QC
	fist: "펀치", // NEEDS QC
	pulse: "파동", // NEEDS QC
	bite: "물기", // NEEDS QC
	bullet: "탄환", // NEEDS QC
	dance: "춤", // NEEDS QC
	slicing: "베기", // NEEDS QC
	wind: "바람", // NEEDS QC
	bypassprotect: "방어 관통", // NEEDS QC
	nonreflectable: "반사 불가", // NEEDS QC
	nonmirror: "따라하기 불가", // NEEDS QC
	nonsnatchable: "가로채기 불가", // NEEDS QC
	bypasssubstitute: "대타출동 관통", // NEEDS QC
	gmaxmove: "거다이맥스기술", // NEEDS QC
	past: "과거작", // NEEDS QC
	truepast: "완전 과거작", // NEEDS QC
	pastunobtainable: "과거작 입수 불가", // NEEDS QC
	future: "미실장", // NEEDS QC
	lgpe: "LGPE",
	unobtainable: "입수 불가", // NEEDS QC
	cap: "CAP",
	custom: "커스텀", // NEEDS QC
	nonexistent: "존재하지 않음", // NEEDS QC

	introducedgen: "등장 세대", // NEEDS QC
	height: "키",
	weight: "몸무게",
	hp: "HP",
	atk: "공", // NEEDS QC
	def: "방", // NEEDS QC
	spa: "특공", // NEEDS QC
	spd: "특방", // NEEDS QC
	spe: "속", // NEEDS QC
	bst: "종족값 합계", // NEEDS QC
	basepower: "위력",
	priority: "우선도", // NEEDS QC
	accuracy: "명중",
	maxpp: "최대 PP", // NEEDS QC
};

export const ColorNames: { [id: string]: TranslationString } = {
	black: "검정",
	blue: "파랑",
	brown: "갈색",
	gray: "회색",
	green: "초록",
	pink: "담홍",
	purple: "보라",
	red: "빨강",
	white: "하양",
	yellow: "노랑",
};
