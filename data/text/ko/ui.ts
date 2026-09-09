import type { TranslationCatalog } from '../../../sim/dex-text';

export const translations: TranslationCatalog = {
	// #region Generic
	// ==================================================================

	// TRANSLATORS: a label, like "Ability: Intimidate"
	"{LABEL}: ": "{LABEL}: ", // NEEDS QC
	// TRANSLATORS: as a value, like "Ability: None"
	"None": "없음", // NEEDS QC
	"(no item)": "(지닌 물건 없음)", // NEEDS QC
	"(no ability)": "(특성 없음)", // NEEDS QC
	"(no weather)": "(날씨 없음)", // NEEDS QC
	// TRANSLATORS: a side condition on the opponent's side, like "Foe's Stealth Rock"
	"Foe's {CONDITION}": "상대의 {CONDITION}", // NEEDS QC

	// TRANSLATORS: for constructing lists
	"{FIRST} or {SECOND}": "{FIRST} 또는 {SECOND}", // NEEDS QC
	"{FIRST} and {SECOND}": "{FIRST}, {SECOND}", // NEEDS QC
	", {NEXT}": ", {NEXT}", // NEEDS QC
	", or {LAST}": " 또는 {LAST}", // NEEDS QC
	", and {LAST}": ", {LAST}", // NEEDS QC
	// TRANSLATORS: this is for lists of users specifically
	// TRANSLATORS: (languages with counters should use the "person" counter)
	", and {NUMBER} others": " 외 {NUMBER}명", // NEEDS QC

	// #endregion Generic

	// #region Dex
	// ==================================================================

	"Pokémon": "포켓몬",
	"Move": "기술", // NEEDS QC
	"Moves": "기술", // NEEDS QC
	"Item": "지닌 물건",
	"Items": "지닌 물건",
	"Ability": "특성", // NEEDS QC
	"Abilities": "특성", // NEEDS QC
	"Hidden Ability": "숨겨진 특성", // NEEDS QC
	// TRANSLATORS: "" as in a Pokémon's type; "kind" as in kind of tournament or help ticket
	"Type": {
		"": "타입",
		"kind": "방식", // NEEDS QC
	},
	"Types": "타입",
	"Nature": "성격",
	"Category": "분류",
	"Categories": "분류",
	"Gender": "성별",
	"Egg Group": "알그룹", // NEEDS QC
	"Egg Groups": "알그룹", // NEEDS QC
	"Tag": "태그", // NEEDS QC
	"Article": "기사", // NEEDS QC
	"Articles": "기사", // NEEDS QC
	"Tier": "티어", // NEEDS QC
	"Tiers": "티어", // NEEDS QC
	"Format": "포맷", // NEEDS QC
	"Formats": "포맷", // NEEDS QC
	"Color": "색",
	// TRANSLATORS: "" as in a form you fill in; "like forme" as in a Pokémon's form/forme
	"Form": {
		"": "양식", // NEEDS QC
		"like forme": "모습", // NEEDS QC
	},
	"Forme": "폼", // NEEDS QC
	"Dex#": "도감 No.", // NEEDS QC
	"Generation": "세대", // NEEDS QC
	// TRANSLATORS: intentionally chosen to be very short. do not go longer than three letters for this one
	"Gen {NUMBER}": "{NUMBER}세대", // NEEDS QC
	"Evolution": "진화", // NEEDS QC
	"Pre-Evolution": "진화 전", // NEEDS QC
	"Does Not Evolve": "진화하지 않음", // NEEDS QC

	// TRANSLATORS: /dt details
	"Height": "키",
	"{NUMBER} m": "{NUMBER}m", // NEEDS QC
	"Weight": "몸무게",
	"{NUMBER} kg": "{NUMBER}kg", // NEEDS QC
	"Crit rate": "급소율", // NEEDS QC
	// TRANSLATORS: "" as in user account; "pokemon" as in someone who uses an item/move
	"User": {
		"": null,
		"pokemon": "사용 가능한 포켓몬", // NEEDS QC
	},
	"Required move": "필요한 기술", // NEEDS QC
	"Target": "대상", // NEEDS QC
	"Z-Crystal": "Z크리스탈", // NEEDS QC
	"Dynamax power": "다이맥스 기술 위력", // NEEDS QC
	"Past gens only": "과거 세대 전용", // NEEDS QC
	"Fling base power": "내던지기 위력", // NEEDS QC
	"Fling effect": "내던지기 효과", // NEEDS QC
	"Natural Gift type": "자연의은혜 타입", // NEEDS QC
	"Natural Gift base power": "자연의은혜 위력", // NEEDS QC

	// #endregion Dex

	// #region Teambuilder
	// ==================================================================

	"Shiny": "색이 다른 모습",
	"Happiness": "친밀도", // NEEDS QC
	"Level": "레벨", // NEEDS QC
	"Nickname": "닉네임", // NEEDS QC
	// TRANSLATORS: only the EV vs IV distinction is important
	// TRANSLATORS: the English speaking community likes to distinguish all of these,
	// TRANSLATORS: but other languages don't need to
	"EV": "노력치", // NEEDS QC
	"EVs": "노력치", // NEEDS QC
	"IV": "개체값", // NEEDS QC
	"IVs": "개체값", // NEEDS QC
	"DVs": "개체값", // NEEDS QC
	"AV": "각성치", // NEEDS QC
	"AVs": "각성치", // NEEDS QC
	"Point": "포인트", // NEEDS QC
	"Points": "포인트", // NEEDS QC
	// TRANSLATORS: used in Teambuilder, so it should be capitalized (unlike "stats" in names.ts)
	"Stats": "스테이터스",
	"Team": "팀", // NEEDS QC
	// TRANSLATORS: "Teams" as in "plural of Team"
	"Teams": "팀", // NEEDS QC
	"Teams List": "팀 목록", // NEEDS QC
	"Tera {TYPE}": "테라스탈타입: {TYPE}", // NEEDS QC
	// TRANSLATORS: the Tera type label in the team editor (the battle button uses "Tera {TYPE}" with the type's icon)
	"Tera": "테라스", // NEEDS QC

	// TRANSLATORS: search result headings
	// TRANSLATORS: "Usually useless" is intentionally evasive
	// TRANSLATORS: only for moves that are outclassed or widely considered obviously bad
	// TRANSLATORS: (to avoid arguments about what we're recommending)
	"Usually useless moves": "보통은 쓸모없는 기술", // NEEDS QC
	"Sketched moves": "스케치로 배우는 기술", // NEEDS QC
	"Useless sketched moves": "스케치로 배우는 쓸모없는 기술", // NEEDS QC
	"Special Event Ability": "이벤트 한정 특성", // NEEDS QC
	"Situational Abilities": "상황에 따라 유용한 특성", // NEEDS QC
	"Unviable Abilities": "실용성 없는 특성", // NEEDS QC
	"Illegal Pokémon": "사용할 수 없는 포켓몬", // NEEDS QC
	"Illegal results": "사용할 수 없는 검색 결과", // NEEDS QC
	"CAP moves": "CAP 기술", // NEEDS QC
	"Glitch": "글리치", // NEEDS QC
	"{TYPE}-type Pokémon": "{TYPE}타입 포켓몬", // NEEDS QC
	"{TYPE}-type moves": "{TYPE}타입 기술", // NEEDS QC
	"{CATEGORY} moves": "{CATEGORY} 기술", // NEEDS QC
	"{ABILITY} Pokémon": "특성이 {ABILITY}인 포켓몬", // NEEDS QC
	"Specific to {VALUE}": "{VALUE} 전용", // NEEDS QC
	"Generation {NUMBER}": "{NUMBER}세대", // NEEDS QC

	// #endregion Teambuilder

	// #region Battle
	// ==================================================================

	"Mega Evolution": "메가진화", // NEEDS QC
	"Z-Power": "Z파워", // NEEDS QC
	"Z-Effect": "Z효과", // NEEDS QC
	"Dynamax": "다이맥스", // NEEDS QC
	"Dynamax Level": "다이맥스 레벨", // NEEDS QC
	"Ultra Burst": "울트라버스트", // NEEDS QC

	// TRANSLATORS: type effectiveness
	"Super effective": "효과가 굉장함",
	"Extremely effective": "효과가 매우 굉장함",
	"Effective": "효과 있음",
	"Not very effective": "효과가 별로",
	"Mostly ineffective": "효과가 매우 별로",
	"No effect": "효과 없음",
	"Weak": "약점", // NEEDS QC: unofficial
	"Resist": "내성", // NEEDS QC: unofficial
	"Immune": "무효", // NEEDS QC: unofficial

	// TRANSLATORS: battle tooltips
	"Usually moves first (priority +{PRIORITY}).": "대개 먼저 행동한다(우선도 +{PRIORITY}).", // NEEDS QC
	"Nearly always moves first (priority +{PRIORITY}).": "거의 항상 먼저 행동한다(우선도 +{PRIORITY}).", // NEEDS QC
	"Nearly always moves last (priority \u2212{PRIORITY}).": "거의 항상 나중에 행동한다(우선도 −{PRIORITY}).", // NEEDS QC
	"Fails if current HP is {HP}.": "현재 HP가 {HP}이면 실패한다.", // NEEDS QC
	"KOs yourself if current HP is exactly {HP}.": "현재 HP가 정확히 {HP}이면 자신이 기절한다.", // NEEDS QC
	"(Transformed into {SPECIES})": "(변신 중: {SPECIES})", // NEEDS QC
	"(Changed forme: {SPECIES})": "(폼체인지: {SPECIES})", // NEEDS QC
	"Possible Illusion #{NUMBER}": "일루전 후보 #{NUMBER}", // NEEDS QC
	"({HP}/{MAXHP} pixels)": "({HP}/{MAXHP} 픽셀)", // NEEDS QC
	"Would take if ability removed: {PERCENT}%": "특성이 없다면 받을 데미지: {PERCENT}%", // NEEDS QC
	"Next damage: {PERCENT}%": "다음 데미지: {PERCENT}%", // NEEDS QC
	"Turns asleep: {NUMBER}": "잠든 후 경과 턴 수: {NUMBER}", // NEEDS QC
	"(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.)": "(기술이 5개 이상인 것은 대개 조로아크나 조로아의 일루전입니다.)", // NEEDS QC
	"(Pressure is not visible in Gen 3, so in certain situations, the exact amount of PP used may be unknown.)": "(3세대에서는 프레셔가 표시되지 않아 사용된 PP를 정확히 알 수 없는 경우가 있습니다.)", // NEEDS QC
	"(Your opponent has two indistinguishable Pokémon, making it impossible for you to tell which one has which moves/ability/item.)": "(상대에게 구분할 수 없는 포켓몬이 2마리 있어 어느 쪽이 어떤 기술·특성·도구를 가졌는지 알 수 없습니다.)", // NEEDS QC
	"(no conditions)": "(필드 상태 없음)", // NEEDS QC
	"({NUMBER} turn)": "({NUMBER}턴)", // NEEDS QC
	"({NUMBER} turns)": "({NUMBER}턴)", // NEEDS QC
	"(After stat modifiers:)": "(능력 보정 후:)", // NEEDS QC
	"Calls {MOVE}": "{MOVE} 사용", // NEEDS QC
	"(base: {VALUE})": "(원래: {VALUE})", // NEEDS QC
	"({LOW} to {HIGH})": "({LOW}~{HIGH})", // NEEDS QC
	"(revealed)": "(밝혀짐)", // NEEDS QC
	"{LOW} to {HIGH}": "{LOW}~{HIGH}", // NEEDS QC
	"(before stat stage changes)": "(능력 랭크 변화 전)", // NEEDS QC
	"(before external modifiers)": "(외부 보정 전)", // NEEDS QC
	"<strong>{EFFECT}</strong> vs. {POKEMON}": "{POKEMON}에게는 <strong>{EFFECT}</strong>", // NEEDS QC
	"Base power vs. {POKEMON}": "{POKEMON}에 대한 위력", // NEEDS QC
	" or ": " 또는 ", // NEEDS QC

	// #endregion Battle
};
