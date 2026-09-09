export const StatNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "공격", def: "방어", spa: "특수공격", spd: "특수방어", spe: "스피드",
	accuracy: "명중률", evasion: "회피율", spc: "특수",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike the "Stats" UI catalog entry)
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
	normal: "인접한 아군이나 상대를 노릴 수 있다", // NEEDS QC
	normalDoubles: "아군이나 어느 상대든 노릴 수 있다", // NEEDS QC
	normalSingles: "상대에게 명중한다", // NEEDS QC
	normalFFA: "어느 상대든 노릴 수 있다", // NEEDS QC
	self: "자신이 대상", // NEEDS QC
	adjacentAlly: "인접한 아군을 노릴 수 있다", // NEEDS QC
	adjacentAllyDoubles: "아군에게 명중한다", // NEEDS QC
	adjacentAllySingles: "싱글배틀에서는 반드시 실패한다", // NEEDS QC
	adjacentAllyOrSelf: "자신이나 인접한 아군을 노릴 수 있다", // NEEDS QC
	adjacentAllyOrSelfDoubles: "자신이나 아군을 노릴 수 있다", // NEEDS QC
	adjacentFoe: "인접한 상대를 노릴 수 있다", // NEEDS QC
	allAdjacentFoes: "인접한 상대 전체에게 명중한다", // NEEDS QC
	allAdjacentFoesDoubles: "상대 2마리에게 명중한다", // NEEDS QC
	foeSide: "상대 필드가 대상", // NEEDS QC
	allySide: "자신의 필드가 대상", // NEEDS QC
	allyTeam: "자신의 파티 전원이 대상", // NEEDS QC
	allAdjacent: "인접한 아군과 상대에게 명중한다", // NEEDS QC
	allAdjacentDoubles: "아군과 상대 2마리에게 명중한다", // NEEDS QC
	allAdjacentFFA: "상대 전원에게 명중한다", // NEEDS QC
	any: "트리플배틀에서는 떨어져 있는 포켓몬도 노릴 수 있다", // NEEDS QC
	all: "전원에게 명중한다", // NEEDS QC
	scripted: "대상이 자동으로 정해진다", // NEEDS QC
	randomNormal: "인접한 상대에게 랜덤으로 명중한다", // NEEDS QC
	randomNormalDoubles: "상대에게 랜덤으로 명중한다", // NEEDS QC
	allies: "자신과 아군 전체가 대상", // NEEDS QC
};

// from veekun/Bulbapedia who presumably got it from Pokédex 3D Pro
// note spaced 수중 1 and 알미발견.
export const EggGroupNames: { [id: string]: TranslationString } = {
	monster: "괴수", // NEEDS QC
	water1: "수중 1", // NEEDS QC
	bug: "벌레", // NEEDS QC
	flying: "비행", // NEEDS QC
	field: "육상", // NEEDS QC
	fairy: "요정", // NEEDS QC
	grass: "식물", // NEEDS QC
	humanlike: "인간형", // NEEDS QC
	water3: "수중 3", // NEEDS QC
	mineral: "광물", // NEEDS QC
	amorphous: "부정형", // NEEDS QC
	water2: "수중 2", // NEEDS QC
	ditto: "메타몽", // NEEDS QC
	dragon: "드래곤", // NEEDS QC
	undiscovered: "알미발견", // NEEDS QC
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
