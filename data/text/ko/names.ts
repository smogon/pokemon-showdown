export const TermNames: { [id: string]: TranslationString } = {
	shiny: "색이 다른 모습",
	happiness: null, // NEEDS TRANSLATION
	level: null, // NEEDS TRANSLATION
	nickname: null, // NEEDS TRANSLATION
	ev: null, // NEEDS TRANSLATION
	evs: null, // NEEDS TRANSLATION
	iv: null, // NEEDS TRANSLATION
	ivs: null, // NEEDS TRANSLATION
	dv: null, // NEEDS TRANSLATION
	dvs: null, // NEEDS TRANSLATION
	av: null, // NEEDS TRANSLATION
	avs: null, // NEEDS TRANSLATION
	point: null, // NEEDS TRANSLATION
	points: null, // NEEDS TRANSLATION
	// n.b. used in Teambuilder, so it should be capitalized (unlike StatNames.stats)
	stats: "스테이터스",

	pokemon: "포켓몬",
	move: null, // NEEDS TRANSLATION
	moves: null, // NEEDS TRANSLATION
	item: "지닌 물건", // official: SV "지닌 물건 교체" (poke-corpus ScarletViolet ko_common:387)
	items: "지닌 물건", // official: SV (poke-corpus ScarletViolet ko_common:387)
	ability: null, // NEEDS TRANSLATION
	abilities: null, // NEEDS TRANSLATION
	hiddenability: null, // NEEDS TRANSLATION
	possibleabilities: null, // NEEDS TRANSLATION
	team: null, // NEEDS TRANSLATION
	teams: null, // NEEDS TRANSLATION
	teamslist: null, // NEEDS TRANSLATION

	type: "타입",
	types: "타입",
	teratype: null, // NEEDS TRANSLATION
	nature: "성격",
	category: "분류",
	categories: "분류",
	gender: "성별",
	egggroup: null, // NEEDS TRANSLATION
	egggroups: null, // NEEDS TRANSLATION
	tag: null, // NEEDS TRANSLATION
	article: null, // NEEDS TRANSLATION
	articles: null, // NEEDS TRANSLATION
	tier: null, // NEEDS TRANSLATION
	tiers: null, // NEEDS TRANSLATION
	format: null, // NEEDS TRANSLATION
	formats: null, // NEEDS TRANSLATION
	color: "색",
	form: null, // NEEDS TRANSLATION
	forme: null, // NEEDS TRANSLATION
	dexnum: null, // NEEDS TRANSLATION
	generation: null, // NEEDS TRANSLATION
	gennum: null, // NEEDS TRANSLATION
	evolution: null, // NEEDS TRANSLATION
	preevolution: null, // NEEDS TRANSLATION
	doesnotevolve: null, // NEEDS TRANSLATION
	zcrystal: null, // NEEDS TRANSLATION
	target: null, // NEEDS TRANSLATION
	height: "키",
	numm: null, // NEEDS TRANSLATION
	weight: "몸무게",
	numkg: null, // NEEDS TRANSLATION
	critrate: null, // NEEDS TRANSLATION
	user: null, // NEEDS TRANSLATION
	requiredmove: null, // NEEDS TRANSLATION
	dynamaxpower: null, // NEEDS TRANSLATION
	none: null, // NEEDS TRANSLATION
	pastgensonly: null, // NEEDS TRANSLATION
	flingbasepower: null, // NEEDS TRANSLATION
	flingeffect: null, // NEEDS TRANSLATION
	naturalgifttype: null, // NEEDS TRANSLATION
	naturalgiftbasepower: null, // NEEDS TRANSLATION

	megaevolution: null, // NEEDS TRANSLATION
	zpower: null, // NEEDS TRANSLATION
	zeffect: null, // NEEDS TRANSLATION
	dynamax: null, // NEEDS TRANSLATION
	dynamaxlevel: null, // NEEDS TRANSLATION
	ultraburst: null, // NEEDS TRANSLATION
	tera: null, // NEEDS TRANSLATION

	supereffective: "효과가 굉장함",
	extremelyeffective: "효과가 매우 굉장함",
	effective: "효과 있음",
	notveryeffective: "효과가 별로",
	mostlyineffective: "효과가 매우 별로",
	noeffect: "효과 없음",

	weak: null, // NEEDS TRANSLATION
	resist: null, // NEEDS TRANSLATION
	immune: null, // NEEDS TRANSLATION

	nicknamespecies: null, // NEEDS TRANSLATION
	label: null, // NEEDS TRANSLATION
	speciesforme: null, // NEEDS TRANSLATION
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
	monster: null, // NEEDS TRANSLATION
	water1: null, // NEEDS TRANSLATION
	bug: null, // NEEDS TRANSLATION
	flying: null, // NEEDS TRANSLATION
	field: null, // NEEDS TRANSLATION
	fairy: null, // NEEDS TRANSLATION
	grass: null, // NEEDS TRANSLATION
	humanlike: null, // NEEDS TRANSLATION
	water3: null, // NEEDS TRANSLATION
	mineral: null, // NEEDS TRANSLATION
	amorphous: null, // NEEDS TRANSLATION
	water2: null, // NEEDS TRANSLATION
	ditto: null, // NEEDS TRANSLATION
	dragon: null, // NEEDS TRANSLATION
	undiscovered: null, // NEEDS TRANSLATION
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
