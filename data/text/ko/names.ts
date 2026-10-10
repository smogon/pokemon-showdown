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
	"???": null, // NEEDS TRANSLATION
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
	brn: null, // NEEDS TRANSLATION
	par: null, // NEEDS TRANSLATION
	slp: null, // NEEDS TRANSLATION
	frz: null, // NEEDS TRANSLATION
	psn: null, // NEEDS TRANSLATION
	tox: null, // NEEDS TRANSLATION
	fnt: null, // NEEDS TRANSLATION
	confusion: null, // NEEDS TRANSLATION
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: null, // NEEDS TRANSLATION
	normalDoubles: null, // NEEDS TRANSLATION
	normalSingles: null, // NEEDS TRANSLATION
	normalFFA: null, // NEEDS TRANSLATION
	self: null, // NEEDS TRANSLATION
	adjacentAlly: null, // NEEDS TRANSLATION
	adjacentAllyDoubles: null, // NEEDS TRANSLATION
	adjacentAllySingles: null, // NEEDS TRANSLATION
	adjacentAllyOrSelf: null, // NEEDS TRANSLATION
	adjacentAllyOrSelfDoubles: null, // NEEDS TRANSLATION
	adjacentFoe: null, // NEEDS TRANSLATION
	allAdjacentFoes: null, // NEEDS TRANSLATION
	allAdjacentFoesDoubles: null, // NEEDS TRANSLATION
	foeSide: null, // NEEDS TRANSLATION
	allySide: null, // NEEDS TRANSLATION
	allyTeam: null, // NEEDS TRANSLATION
	allAdjacent: null, // NEEDS TRANSLATION
	allAdjacentDoubles: null, // NEEDS TRANSLATION
	allAdjacentFFA: null, // NEEDS TRANSLATION
	any: null, // NEEDS TRANSLATION
	all: null, // NEEDS TRANSLATION
	scripted: null, // NEEDS TRANSLATION
	randomNormal: null, // NEEDS TRANSLATION
	randomNormalDoubles: null, // NEEDS TRANSLATION
	allies: null, // NEEDS TRANSLATION
};

// from veekun/Bulbapedia who presumably got it from Pokédex 3D Pro
// note spaced 수중 1 and 알미발견.
export const EggGroupNames: { [id: string]: TranslationString } = {
	Monster: null, // NEEDS TRANSLATION
	"Water 1": null, // NEEDS TRANSLATION
	Bug: null, // NEEDS TRANSLATION
	Flying: null, // NEEDS TRANSLATION
	Field: null, // NEEDS TRANSLATION
	Fairy: null, // NEEDS TRANSLATION
	Grass: null, // NEEDS TRANSLATION
	"Human-Like": null, // NEEDS TRANSLATION
	"Water 3": null, // NEEDS TRANSLATION
	Mineral: null, // NEEDS TRANSLATION
	Amorphous: null, // NEEDS TRANSLATION
	"Water 2": null, // NEEDS TRANSLATION
	Ditto: null, // NEEDS TRANSLATION
	Dragon: null, // NEEDS TRANSLATION
	Undiscovered: null, // NEEDS TRANSLATION
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
