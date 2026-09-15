export const StatNames: { [id: string]: TranslationString } = {
	hp: "HP", atk: "공격", def: "방어", spa: "특수공격", spd: "특수방어", spe: "스피드",
	accuracy: "명중률", evasion: "회피율", spc: "특수",

	// n.b. used in "stats were lowered" battle messages,
	// so it should be lowercase (unlike "Stats" in ui.ts)
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
	Bug: "벌레",
	Dark: "악",
	Dragon: "드래곤",
	Electric: "전기",
	Fairy: "페어리",
	Fighting: "격투",
	Fire: "불꽃",
	Flying: "비행",
	Ghost: "고스트",
	Grass: "풀",
	Ground: "땅",
	Ice: "얼음",
	Normal: "노말",
	Poison: "독",
	Psychic: "에스퍼",
	Rock: "바위",
	Steel: "강철",
	Stellar: "스텔라",
	Water: "물",
	"???": "???",
};

export const NatureNames: { [id: string]: TranslationString } = {
	Adamant: "고집",
	Bashful: "수줍음",
	Bold: "대담",
	Brave: "용감",
	Calm: "차분",
	Careful: "신중",
	Docile: "온순",
	Gentle: "얌전",
	Hardy: "노력",
	Hasty: "성급",
	Impish: "장난꾸러기",
	Jolly: "명랑",
	Lax: "촐랑",
	Lonely: "외로움",
	Mild: "의젓",
	Modest: "조심",
	Naive: "천진난만",
	Naughty: "개구쟁이",
	Quiet: "냉정",
	Quirky: "변덕",
	Rash: "덜렁",
	Relaxed: "무사태평",
	Sassy: "건방",
	Serious: "성실",
	Timid: "겁쟁이",
};

export const GenderNames: { [id: string]: TranslationString } = {
	M: "수컷",
	F: "암컷",
	N: "성별 없음",
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
	Monster: "괴수", // NEEDS QC
	"Water 1": "수중 1", // NEEDS QC
	Bug: "벌레", // NEEDS QC
	Flying: "비행", // NEEDS QC
	Field: "육상", // NEEDS QC
	Fairy: "요정", // NEEDS QC
	Grass: "식물", // NEEDS QC
	"Human-Like": "인간형", // NEEDS QC
	"Water 3": "수중 3", // NEEDS QC
	Mineral: "광물", // NEEDS QC
	Amorphous: "부정형", // NEEDS QC
	"Water 2": "수중 2", // NEEDS QC
	Ditto: "메타몽", // NEEDS QC
	Dragon: "드래곤", // NEEDS QC
	Undiscovered: "알미발견", // NEEDS QC
};

export const ColorNames: { [id: string]: TranslationString } = {
	Black: "검정",
	Blue: "파랑",
	Brown: "갈색",
	Gray: "회색",
	Green: "초록",
	Pink: "담홍",
	Purple: "보라",
	Red: "빨강",
	White: "하양",
	Yellow: "노랑",
};
