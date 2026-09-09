import type { TranslationCatalog } from '../../../sim/dex-text';

export const translations: TranslationCatalog = {
	// #region Generic
	// ==================================================================

	// TRANSLATORS: a label, like "Ability: Intimidate"
	"{LABEL}: ": "{LABEL}：", // NEEDS QC
	// TRANSLATORS: as a value, like "Ability: None"
	"None": "无", // NEEDS QC
	"(no item)": "（无携带物品）", // NEEDS QC
	"(no ability)": "（无特性）", // NEEDS QC
	"(no weather)": "（无天气）", // NEEDS QC
	// TRANSLATORS: a side condition on the opponent's side, like "Foe's Stealth Rock"
	"Foe's {CONDITION}": "对手的{CONDITION}", // NEEDS QC

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

	"Pokémon": "宝可梦",
	"Move": "招式", // NEEDS QC
	"Moves": "招式", // NEEDS QC
	"Item": "道具", // NEEDS QC
	"Items": "道具", // NEEDS QC
	"Ability": "特性", // NEEDS QC
	"Abilities": "特性", // NEEDS QC
	"Hidden Ability": "隐藏特性", // NEEDS QC
	// TRANSLATORS: "" as in a Pokémon's type; "kind" as in kind of tournament or help ticket
	"Type": {
		"": "属性",
		"kind": "类型", // NEEDS QC
	},
	"Types": "属性",
	"Nature": "性格",
	"Category": "分类",
	"Categories": "分类",
	"Gender": "性别",
	"Egg Group": "蛋组", // NEEDS QC
	"Egg Groups": "蛋组", // NEEDS QC
	"Tag": "标签", // NEEDS QC
	"Article": "文章", // NEEDS QC
	"Articles": "文章", // NEEDS QC
	"Tier": "分级", // NEEDS QC
	"Tiers": "分级", // NEEDS QC
	"Format": "对战模式", // NEEDS QC
	"Formats": "对战模式", // NEEDS QC
	"Color": "颜色",
	// TRANSLATORS: "" as in a form you fill in; "like forme" as in a Pokémon's form/forme
	"Form": {
		"": "表单", // NEEDS QC
		"like forme": "样子", // NEEDS QC
	},
	"Forme": "形态", // NEEDS QC
	"Dex#": "图鉴No.", // NEEDS QC
	"Generation": "世代", // NEEDS QC
	// TRANSLATORS: intentionally chosen to be very short. do not go longer than three letters for this one
	"Gen {NUMBER}": "第{NUMBER}世代", // NEEDS QC
	"Evolution": "进化", // NEEDS QC
	"Pre-Evolution": "进化前", // NEEDS QC
	"Does Not Evolve": "不进化", // NEEDS QC

	// TRANSLATORS: /dt details
	"Height": "身高",
	"{NUMBER} m": "{NUMBER}m", // NEEDS QC
	"Weight": "体重",
	"{NUMBER} kg": "{NUMBER}kg", // NEEDS QC
	"Crit rate": "击中要害率", // NEEDS QC
	// TRANSLATORS: "" as in user account; "pokemon" as in someone who uses an item/move
	"User": {
		"": null,
		"pokemon": "可使用的宝可梦", // NEEDS QC
	},
	"Required move": "所需招式", // NEEDS QC
	"Target": "对象", // NEEDS QC
	"Z-Crystal": "Ｚ纯晶", // NEEDS QC
	"Dynamax power": "极巨招式威力", // NEEDS QC
	"Past gens only": "仅限过去世代", // NEEDS QC
	"Fling base power": "投掷威力", // NEEDS QC
	"Fling effect": "投掷效果", // NEEDS QC
	"Natural Gift type": "自然之恩属性", // NEEDS QC
	"Natural Gift base power": "自然之恩威力", // NEEDS QC

	// #endregion Dex

	// #region Teambuilder
	// ==================================================================

	"Shiny": "异色",
	"Happiness": "亲密度", // official (SV zh-Hans_common 115)
	"Level": "等级", // official (SV zh-Hans_common 48221)
	"Nickname": "昵称", // official (SV zh-Hans_common 4414)
	// TRANSLATORS: only the EV vs IV distinction is important
	// TRANSLATORS: the English speaking community likes to distinguish all of these,
	// TRANSLATORS: but other languages don't need to
	"EV": "努力值", // NEEDS QC
	"EVs": "努力值", // NEEDS QC
	"IV": "个体值", // NEEDS QC
	"IVs": "个体值", // NEEDS QC
	"DVs": "个体值", // NEEDS QC
	"AV": "觉醒值", // NEEDS QC
	"AVs": "觉醒值", // NEEDS QC
	"Point": "点数", // NEEDS QC
	"Points": "点数", // NEEDS QC
	// TRANSLATORS: used in Teambuilder, so it should be capitalized (unlike "stats" in names.ts)
	"Stats": "状态",
	"Team": "队伍", // NEEDS QC
	// TRANSLATORS: "Teams" as in "plural of Team"
	"Teams": "队伍", // NEEDS QC
	"Teams List": "队伍列表", // NEEDS QC
	"Tera {TYPE}": "太晶{TYPE}", // NEEDS QC
	// TRANSLATORS: the Tera type label in the team editor (the battle button uses "Tera {TYPE}" with the type's icon)
	"Tera": "太晶", // NEEDS QC

	// TRANSLATORS: search result headings
	// TRANSLATORS: "Usually useless" is intentionally evasive
	// TRANSLATORS: only for moves that are outclassed or widely considered obviously bad
	// TRANSLATORS: (to avoid arguments about what we're recommending)
	"Usually useless moves": "通常没用的招式", // NEEDS QC
	"Sketched moves": "写生招式", // NEEDS QC
	"Useless sketched moves": "没用的写生招式", // NEEDS QC
	"Special Event Ability": "活动限定特性", // NEEDS QC
	"Situational Abilities": "视情况而定的特性", // NEEDS QC
	"Unviable Abilities": "不实用的特性", // NEEDS QC
	"Illegal Pokémon": "不合法的宝可梦", // NEEDS QC
	"Illegal results": "不合法的结果", // NEEDS QC
	"CAP moves": "CAP招式", // NEEDS QC
	"Glitch": "异常", // NEEDS QC
	"{TYPE}-type Pokémon": "{TYPE}属性宝可梦", // NEEDS QC
	"{TYPE}-type moves": "{TYPE}属性招式", // NEEDS QC
	"{CATEGORY} moves": "{CATEGORY}招式", // NEEDS QC
	"{ABILITY} Pokémon": "特性为{ABILITY}的宝可梦", // NEEDS QC
	"Specific to {VALUE}": "{VALUE}专用", // NEEDS QC
	"Generation {NUMBER}": "第{NUMBER}世代", // NEEDS QC

	// #endregion Teambuilder

	// #region Battle
	// ==================================================================

	"Mega Evolution": "超级进化", // NEEDS QC
	"Z-Power": "Ｚ力量", // NEEDS QC
	"Z-Effect": "Ｚ效果", // NEEDS QC
	"Dynamax": "极巨化", // NEEDS QC
	"Dynamax Level": "极巨化等级", // NEEDS QC
	"Ultra Burst": "究极爆发", // NEEDS QC

	// TRANSLATORS: type effectiveness
	"Super effective": "效果绝佳",
	"Extremely effective": "效果无比绝佳",
	"Effective": "有效果",
	"Not very effective": "效果不好",
	"Mostly ineffective": "效果相当不好",
	"No effect": "没有效果",
	"Weak": "弱点", // NEEDS QC: unofficial
	"Resist": "抵抗", // NEEDS QC: unofficial
	"Immune": "免疫", // NEEDS QC: unofficial

	// TRANSLATORS: battle tooltips
	"Usually moves first (priority +{PRIORITY}).": "通常先制行动（优先度+{PRIORITY}）。", // NEEDS QC
	"Nearly always moves first (priority +{PRIORITY}).": "几乎总是先制行动（优先度+{PRIORITY}）。", // NEEDS QC
	"Nearly always moves last (priority \u2212{PRIORITY}).": "几乎总是最后行动（优先度−{PRIORITY}）。", // NEEDS QC
	"Fails if current HP is {HP}.": "当前HP为{HP}时会失败。", // NEEDS QC
	"KOs yourself if current HP is exactly {HP}.": "当前HP恰好为{HP}时会使自己濒死。", // NEEDS QC
	"(Transformed into {SPECIES})": "（变身为{SPECIES}）", // NEEDS QC
	"(Changed forme: {SPECIES})": "（形态变化：{SPECIES}）", // NEEDS QC
	"Possible Illusion #{NUMBER}": "可能是幻觉 #{NUMBER}", // NEEDS QC
	"({HP}/{MAXHP} pixels)": "（{HP}/{MAXHP}像素）", // NEEDS QC
	"Would take if ability removed: {PERCENT}%": "若无特性将受到：{PERCENT}%", // NEEDS QC
	"Next damage: {PERCENT}%": "下次伤害：{PERCENT}%", // NEEDS QC
	"Turns asleep: {NUMBER}": "已睡眠回合数：{NUMBER}", // NEEDS QC
	"(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.)": "（拥有5个以上招式通常意味着索罗亚克或索罗亚的幻觉。）", // NEEDS QC
	"(Pressure is not visible in Gen 3, so in certain situations, the exact amount of PP used may be unknown.)": "（第三世代中压迫感不可见，因此某些情况下无法准确得知已消耗的PP。）", // NEEDS QC
	"(Your opponent has two indistinguishable Pokémon, making it impossible for you to tell which one has which moves/ability/item.)": "（对手有两只无法区分的宝可梦，因此无法判断哪只拥有哪些招式、特性和道具。）", // NEEDS QC
	"(no conditions)": "（无场地状态）", // NEEDS QC
	"({NUMBER} turn)": "（{NUMBER}回合）", // NEEDS QC
	"({NUMBER} turns)": "（{NUMBER}回合）", // NEEDS QC
	"(After stat modifiers:)": "（能力修正后：）", // NEEDS QC
	"Calls {MOVE}": "调用{MOVE}", // NEEDS QC
	"(base: {VALUE})": "（原为{VALUE}）", // NEEDS QC
	"({LOW} to {HIGH})": "（{LOW}～{HIGH}）", // NEEDS QC
	"(revealed)": "（已知）", // NEEDS QC
	"{LOW} to {HIGH}": "{LOW}～{HIGH}", // NEEDS QC
	"(before stat stage changes)": "（能力等级变化前）", // NEEDS QC
	"(before external modifiers)": "（外部修正前）", // NEEDS QC
	"<strong>{EFFECT}</strong> vs. {POKEMON}": "对{POKEMON}<strong>{EFFECT}</strong>", // NEEDS QC
	"Base power vs. {POKEMON}": "对{POKEMON}的威力", // NEEDS QC
	" or ": "或", // NEEDS QC

	// #endregion Battle
};
