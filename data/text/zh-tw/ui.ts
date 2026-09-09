import type { TranslationCatalog } from '../../../sim/dex-text';

export const translations: TranslationCatalog = {
	// #region Generic
	// ==================================================================

	// TRANSLATORS: a label, like "Ability: Intimidate"
	"{LABEL}: ": "{LABEL}：", // NEEDS QC
	// TRANSLATORS: as a value, like "Ability: None"
	"None": "無", // NEEDS QC
	"(no item)": "（無攜帶物品）", // NEEDS QC
	"(no ability)": "（無特性）", // NEEDS QC
	"(no weather)": "（無天氣）", // NEEDS QC
	// TRANSLATORS: a side condition on the opponent's side, like "Foe's Stealth Rock"
	"Foe's {CONDITION}": "對手的{CONDITION}", // NEEDS QC

	// TRANSLATORS: for constructing lists
	"{FIRST} or {SECOND}": "{FIRST}或{SECOND}", // NEEDS QC
	"{FIRST} and {SECOND}": "{FIRST}和{SECOND}", // NEEDS QC
	", {NEXT}": "、{NEXT}", // NEEDS QC
	", or {LAST}": "或{LAST}", // NEEDS QC
	", and {LAST}": "和{LAST}", // NEEDS QC
	// TRANSLATORS: this is for lists of users specifically
	// TRANSLATORS: (languages with counters should use the "person" counter)
	", and {NUMBER} others": "等{NUMBER}人", // NEEDS QC

	// #endregion Generic

	// #region Dex
	// ==================================================================

	"Pokémon": "寶可夢",
	"Move": "招式", // NEEDS QC
	"Moves": "招式", // NEEDS QC
	"Item": "道具", // NEEDS QC
	"Items": "道具", // NEEDS QC
	"Ability": "特性", // NEEDS QC
	"Abilities": "特性", // NEEDS QC
	"Hidden Ability": "隱藏特性", // NEEDS QC
	// TRANSLATORS: "" as in a Pokémon's type; "kind" as in kind of tournament or help ticket
	"Type": {
		"": "屬性",
		"kind": "類型", // NEEDS QC
	},
	"Types": "屬性",
	"Nature": "性格",
	"Category": "分類",
	"Categories": "分類",
	"Gender": "性別",
	"Egg Group": "蛋群", // NEEDS QC
	"Egg Groups": "蛋群", // NEEDS QC
	"Tag": "標籤", // NEEDS QC
	"Article": "文章", // NEEDS QC
	"Articles": "文章", // NEEDS QC
	"Tier": "分級", // NEEDS QC
	"Tiers": "分級", // NEEDS QC
	"Format": "對戰模式", // NEEDS QC
	"Formats": "對戰模式", // NEEDS QC
	"Color": "顏色",
	// TRANSLATORS: "" as in a form you fill in; "like forme" as in a Pokémon's form/forme
	"Form": {
		"": "表單", // NEEDS QC
		"like forme": "樣子", // NEEDS QC
	},
	"Forme": "形態", // NEEDS QC
	"Dex#": "圖鑑No.", // NEEDS QC
	"Generation": "世代", // NEEDS QC
	// TRANSLATORS: intentionally chosen to be very short. do not go longer than three letters for this one
	"Gen {NUMBER}": "第{NUMBER}世代", // NEEDS QC
	"Evolution": "進化", // NEEDS QC
	"Pre-Evolution": "進化前", // NEEDS QC
	"Does Not Evolve": "不進化", // NEEDS QC

	// TRANSLATORS: /dt details
	"Height": "身高",
	"{NUMBER} m": "{NUMBER}m", // NEEDS QC
	"Weight": "體重",
	"{NUMBER} kg": "{NUMBER}kg", // NEEDS QC
	"Crit rate": "擊中要害率", // NEEDS QC
	// TRANSLATORS: "" as in user account; "pokemon" as in someone who uses an item/move
	"User": {
		"": null,
		"pokemon": "可使用的寶可夢", // NEEDS QC
	},
	"Required move": "所需招式", // NEEDS QC
	"Target": "對象", // NEEDS QC
	"Z-Crystal": "Ｚ純晶", // NEEDS QC
	"Dynamax power": "極巨招式威力", // NEEDS QC
	"Past gens only": "僅限過去世代", // NEEDS QC
	"Fling base power": "投擲威力", // NEEDS QC
	"Fling effect": "投擲效果", // NEEDS QC
	"Natural Gift type": "自然之恩屬性", // NEEDS QC
	"Natural Gift base power": "自然之恩威力", // NEEDS QC

	// #endregion Dex

	// #region Teambuilder
	// ==================================================================

	"Shiny": "異色",
	"Happiness": "親密度", // NEEDS QC
	"Level": "等級", // NEEDS QC
	"Nickname": "暱稱", // NEEDS QC
	// TRANSLATORS: only the EV vs IV distinction is important
	// TRANSLATORS: the English speaking community likes to distinguish all of these,
	// TRANSLATORS: but other languages don't need to
	"EV": "努力值", // NEEDS QC
	"EVs": "努力值", // NEEDS QC
	"IV": "個體值", // NEEDS QC
	"IVs": "個體值", // NEEDS QC
	"DVs": "個體值", // NEEDS QC
	"AV": "覺醒值", // NEEDS QC
	"AVs": "覺醒值", // NEEDS QC
	"Point": "點數", // NEEDS QC
	"Points": "點數", // NEEDS QC
	// TRANSLATORS: used in Teambuilder, so it should be capitalized (unlike "stats" in names.ts)
	"Stats": "狀態",
	"Team": "隊伍", // NEEDS QC
	// TRANSLATORS: "Teams" as in "plural of Team"
	"Teams": "隊伍", // NEEDS QC
	"Teams List": "隊伍清單", // NEEDS QC
	"Tera {TYPE}": "太晶{TYPE}", // NEEDS QC
	// TRANSLATORS: the Tera type label in the team editor (the battle button uses "Tera {TYPE}" with the type's icon)
	"Tera": "太晶", // NEEDS QC

	// TRANSLATORS: search result headings
	// TRANSLATORS: "Usually useless" is intentionally evasive
	// TRANSLATORS: only for moves that are outclassed or widely considered obviously bad
	// TRANSLATORS: (to avoid arguments about what we're recommending)
	"Usually useless moves": "通常沒用的招式", // NEEDS QC
	"Sketched moves": "寫生招式", // NEEDS QC
	"Useless sketched moves": "沒用的寫生招式", // NEEDS QC
	"Special Event Ability": "活動限定特性", // NEEDS QC
	"Situational Abilities": "視情況而定的特性", // NEEDS QC
	"Unviable Abilities": "不實用的特性", // NEEDS QC
	"Illegal Pokémon": "不合法的寶可夢", // NEEDS QC
	"Illegal results": "不合法的結果", // NEEDS QC
	"CAP moves": "CAP招式", // NEEDS QC
	"Glitch": "異常", // NEEDS QC
	"{TYPE}-type Pokémon": "{TYPE}屬性寶可夢", // NEEDS QC
	"{TYPE}-type moves": "{TYPE}屬性招式", // NEEDS QC
	"{CATEGORY} moves": "{CATEGORY}招式", // NEEDS QC
	"{ABILITY} Pokémon": "特性為{ABILITY}的寶可夢", // NEEDS QC
	"Specific to {VALUE}": "{VALUE}專用", // NEEDS QC
	"Generation {NUMBER}": "第{NUMBER}世代", // NEEDS QC

	// #endregion Teambuilder

	// #region Battle
	// ==================================================================

	"Mega Evolution": "超級進化", // NEEDS QC
	"Z-Power": "Ｚ力量", // NEEDS QC
	"Z-Effect": "Ｚ效果", // NEEDS QC
	"Dynamax": "極巨化", // NEEDS QC
	"Dynamax Level": "極巨化等級", // NEEDS QC
	"Ultra Burst": "究極爆發", // NEEDS QC

	// TRANSLATORS: type effectiveness
	"Super effective": "效果絕佳",
	"Extremely effective": "效果無比絕佳",
	"Effective": "有效果",
	"Not very effective": "效果不好",
	"Mostly ineffective": "效果相當不好",
	"No effect": "沒有效果",
	"Weak": "弱點", // NEEDS QC: unofficial
	"Resist": "抵抗", // NEEDS QC: unofficial
	"Immune": "免疫", // NEEDS QC: unofficial

	// TRANSLATORS: battle tooltips
	"Usually moves first (priority +{PRIORITY}).": "通常先制行動（優先度+{PRIORITY}）。", // NEEDS QC
	"Nearly always moves first (priority +{PRIORITY}).": "幾乎總是先制行動（優先度+{PRIORITY}）。", // NEEDS QC
	"Nearly always moves last (priority \u2212{PRIORITY}).": "幾乎總是最後行動（優先度−{PRIORITY}）。", // NEEDS QC
	"Fails if current HP is {HP}.": "當前HP為{HP}時會失敗。", // NEEDS QC
	"KOs yourself if current HP is exactly {HP}.": "當前HP恰好為{HP}時會使自己瀕死。", // NEEDS QC
	"(Transformed into {SPECIES})": "（變身為{SPECIES}）", // NEEDS QC
	"(Changed forme: {SPECIES})": "（形態變化：{SPECIES}）", // NEEDS QC
	"Possible Illusion #{NUMBER}": "可能是幻覺#{NUMBER}", // NEEDS QC
	"({HP}/{MAXHP} pixels)": "（{HP}/{MAXHP}像素）", // NEEDS QC
	"Would take if ability removed: {PERCENT}%": "若無特性將受到：{PERCENT}%", // NEEDS QC
	"Next damage: {PERCENT}%": "下次傷害：{PERCENT}%", // NEEDS QC
	"Turns asleep: {NUMBER}": "已睡眠回合數：{NUMBER}", // NEEDS QC
	"(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.)": "（擁有5個以上招式通常意味著索羅亞克或索羅亞的幻覺。）", // NEEDS QC
	"(Pressure is not visible in Gen 3, so in certain situations, the exact amount of PP used may be unknown.)": "（第三世代中壓迫感不可見，因此某些情況下無法準確得知已消耗的PP。）", // NEEDS QC
	"(Your opponent has two indistinguishable Pokémon, making it impossible for you to tell which one has which moves/ability/item.)": "（對手有兩隻無法區分的寶可夢，因此無法判斷哪隻擁有哪些招式、特性和道具。）", // NEEDS QC
	"(no conditions)": "（無場地狀態）", // NEEDS QC
	"({NUMBER} turn)": "（{NUMBER}回合）", // NEEDS QC
	"({NUMBER} turns)": "（{NUMBER}回合）", // NEEDS QC
	"(After stat modifiers:)": "（能力修正後：）", // NEEDS QC
	"Calls {MOVE}": "使用{MOVE}", // NEEDS QC
	"(base: {VALUE})": "（原為{VALUE}）", // NEEDS QC
	"({LOW} to {HIGH})": "（{LOW}～{HIGH}）", // NEEDS QC
	"(revealed)": "（已知）", // NEEDS QC
	"{LOW} to {HIGH}": "{LOW}～{HIGH}", // NEEDS QC
	"(before stat stage changes)": "（能力等級變化前）", // NEEDS QC
	"(before external modifiers)": "（外部修正前）", // NEEDS QC
	"<strong>{EFFECT}</strong> vs. {POKEMON}": "對{POKEMON}<strong>{EFFECT}</strong>", // NEEDS QC
	"Base power vs. {POKEMON}": "對{POKEMON}的威力", // NEEDS QC
	" or ": "或", // NEEDS QC

	// #endregion Battle
};
