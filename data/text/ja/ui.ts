import type { TranslationCatalog } from '../../../sim/dex-text';

export const translations: TranslationCatalog = {
	// #region Generic
	// ==================================================================

	// TRANSLATORS: a label, like "Ability: Intimidate"
	"{LABEL}: ": "{LABEL}：", // NEEDS QC
	// TRANSLATORS: as a value, like "Ability: None"
	"None": "なし", // NEEDS QC
	"(no item)": "（もちものなし）", // NEEDS QC
	"(no ability)": "（とくせいなし）", // NEEDS QC
	"(no weather)": "（天候なし）", // NEEDS QC
	// TRANSLATORS: a side condition on the opponent's side, like "Foe's Stealth Rock"
	"Foe's {CONDITION}": "相手の{CONDITION}", // NEEDS QC

	// TRANSLATORS: for constructing lists
	"{FIRST} or {SECOND}": "{FIRST}か{SECOND}", // NEEDS QC
	"{FIRST} and {SECOND}": "{FIRST}と{SECOND}", // NEEDS QC
	", {NEXT}": "、{NEXT}", // NEEDS QC
	", or {LAST}": "、または{LAST}", // NEEDS QC
	", and {LAST}": "、{LAST}", // NEEDS QC
	// TRANSLATORS: this is for lists of users specifically
	// TRANSLATORS: (languages with counters should use the "person" counter)
	", and {NUMBER} others": "、ほか{NUMBER}名", // NEEDS QC

	// #endregion Generic

	// #region Dex
	// ==================================================================

	"Pokémon": "ポケモン",
	"Move": "技", // NEEDS QC
	"Moves": "技", // NEEDS QC
	"Item": "持ち物", // NEEDS QC
	"Items": "持ち物", // NEEDS QC
	"Ability": "特性", // NEEDS QC
	"Abilities": "特性", // NEEDS QC
	"Hidden Ability": "隠れ特性", // NEEDS QC
	// TRANSLATORS: "" as in a Pokémon's type; "kind" as in kind of tournament or help ticket
	"Type": {
		"": "タイプ",
		"kind": "形式", // NEEDS QC
	},
	"Types": "タイプ",
	"Nature": "せいかく",
	"Category": "ぶんるい",
	"Categories": "ぶんるい",
	"Gender": "せいべつ",
	"Egg Group": "タマゴグループ", // NEEDS QC
	"Egg Groups": "タマゴグループ", // NEEDS QC
	"Tag": "タグ", // NEEDS QC
	"Article": "記事", // NEEDS QC
	"Articles": "記事", // NEEDS QC
	"Tier": "ティア", // NEEDS QC
	"Tiers": "ティア", // NEEDS QC
	"Format": "フォーマット", // NEEDS QC
	"Formats": "フォーマット", // NEEDS QC
	"Color": "色",
	// TRANSLATORS: "" as in a form you fill in; "like forme" as in a Pokémon's form/forme
	"Form": {
		"": "フォーム", // NEEDS QC
		"like forme": "すがた", // NEEDS QC
	},
	"Forme": "フォルム", // NEEDS QC
	"Dex#": "図鑑No.", // NEEDS QC
	"Generation": "世代", // NEEDS QC
	// TRANSLATORS: intentionally chosen to be very short. do not go longer than three letters for this one
	"Gen {NUMBER}": "第{NUMBER}世代", // NEEDS QC
	"Evolution": "進化", // NEEDS QC
	"Pre-Evolution": "進化前", // NEEDS QC
	"Does Not Evolve": "進化しない", // NEEDS QC

	// TRANSLATORS: /dt details
	"Height": "高さ",
	"{NUMBER} m": "{NUMBER}m", // NEEDS QC
	"Weight": "重さ",
	"{NUMBER} kg": "{NUMBER}kg", // NEEDS QC
	"Crit rate": "急所率", // NEEDS QC
	// TRANSLATORS: "" as in user account; "pokemon" as in someone who uses an item/move
	"User": {
		"": null,
		"pokemon": "使用できるポケモン", // NEEDS QC
	},
	"Required move": "必要な技", // NEEDS QC
	"Target": "対象", // NEEDS QC
	"Z-Crystal": "Ｚクリスタル", // NEEDS QC
	"Dynamax power": "ダイマックス技の威力", // NEEDS QC
	"Past gens only": "過去世代のみ", // NEEDS QC
	"Fling base power": "なげつけるの威力", // NEEDS QC
	"Fling effect": "なげつけるの効果", // NEEDS QC
	"Natural Gift type": "しぜんのめぐみのタイプ", // NEEDS QC
	"Natural Gift base power": "しぜんのめぐみの威力", // NEEDS QC

	// #endregion Dex

	// #region Teambuilder
	// ==================================================================

	"Shiny": "いろちがい",
	"Happiness": "なかよし度", // NEEDS QC
	"Level": "レベル", // NEEDS QC
	"Nickname": "ニックネーム", // NEEDS QC
	// TRANSLATORS: only the EV vs IV distinction is important
	// TRANSLATORS: the English speaking community likes to distinguish all of these,
	// TRANSLATORS: but other languages don't need to
	"EV": "努力値", // NEEDS QC
	"EVs": "努力値", // NEEDS QC
	"IV": "個体値", // NEEDS QC
	"IVs": "個体値", // NEEDS QC
	"DVs": "個体値", // NEEDS QC
	"AV": "覚醒値", // community term
	"AVs": "覚醒値", // community term
	"Point": "ポイント", // NEEDS QC
	"Points": "ポイント", // NEEDS QC
	// TRANSLATORS: used in Teambuilder, so it should be capitalized (unlike "stats" in names.ts)
	"Stats": "ステータス",
	"Team": "チーム", // NEEDS QC
	// TRANSLATORS: "Teams" as in "plural of Team"
	"Teams": "チーム", // NEEDS QC
	"Teams List": "チーム一覧", // NEEDS QC
	"Tera {TYPE}": "テラスタイプ：{TYPE}", // official term (SV)
	// TRANSLATORS: the Tera type label in the team editor (the battle button uses "Tera {TYPE}" with the type's icon)
	"Tera": "テラス", // NEEDS QC

	// TRANSLATORS: search result headings
	// TRANSLATORS: "Usually useless" is intentionally evasive
	// TRANSLATORS: only for moves that are outclassed or widely considered obviously bad
	// TRANSLATORS: (to avoid arguments about what we're recommending)
	"Usually useless moves": "ふつうは役に立たない技", // NEEDS QC
	"Sketched moves": "スケッチで覚える技", // NEEDS QC
	"Useless sketched moves": "スケッチで覚える役に立たない技", // NEEDS QC
	"Special Event Ability": "イベント限定特性", // NEEDS QC
	"Situational Abilities": "状況次第の特性", // NEEDS QC
	"Unviable Abilities": "実用性のない特性", // NEEDS QC
	"Illegal Pokémon": "使用できないポケモン", // NEEDS QC
	"Illegal results": "使用できない検索結果", // NEEDS QC
	"CAP moves": "CAPの技", // NEEDS QC
	"Glitch": "グリッチ", // NEEDS QC
	"{TYPE}-type Pokémon": "{TYPE}タイプのポケモン", // NEEDS QC
	"{TYPE}-type moves": "{TYPE}タイプの技", // NEEDS QC
	"{CATEGORY} moves": "{CATEGORY}技", // NEEDS QC
	"{ABILITY} Pokémon": "特性「{ABILITY}」のポケモン", // NEEDS QC
	"Specific to {VALUE}": "{VALUE}専用", // NEEDS QC
	"Generation {NUMBER}": "第{NUMBER}世代", // NEEDS QC

	// #endregion Teambuilder

	// #region Battle
	// ==================================================================

	"Mega Evolution": "メガシンカ", // official term (XY)
	"Z-Power": "Ｚパワー", // official term (SM ja_common 8430)
	"Z-Effect": "Ｚ効果", // NEEDS QC
	"Dynamax": "ダイマックス", // official term (SwSh)
	"Dynamax Level": "ダイマックスレベル", // NEEDS QC
	"Ultra Burst": "ウルトラバースト", // NEEDS QC

	// TRANSLATORS: type effectiveness
	"Super effective": "ばつぐん",
	"Extremely effective": "ちょうばつぐん",
	"Effective": "こうかあり", // NEEDS QC
	"Not very effective": "いまひとつ",
	"Mostly ineffective": "かなりいまひとつ",
	"No effect": "こうかなし", // NEEDS QC
	"Weak": "弱点", // NEEDS QC: unofficial
	"Resist": "耐性", // NEEDS QC: unofficial
	"Immune": "無効", // NEEDS QC: unofficial

	// TRANSLATORS: battle tooltips
	"Usually moves first (priority +{PRIORITY}).": "たいてい先に動く（優先度+{PRIORITY}）。", // NEEDS QC
	"Nearly always moves first (priority +{PRIORITY}).": "ほぼ必ず先に動く（優先度+{PRIORITY}）。", // NEEDS QC
	"Nearly always moves last (priority \u2212{PRIORITY}).": "ほぼ必ず後に動く（優先度−{PRIORITY}）。", // NEEDS QC
	"Fails if current HP is {HP}.": "現在のHPが{HP}だと失敗する。", // NEEDS QC
	"KOs yourself if current HP is exactly {HP}.": "現在のHPがちょうど{HP}だと自分がひんしになる。", // NEEDS QC
	"(Transformed into {SPECIES})": "（{SPECIES}にへんしん中）", // NEEDS QC
	"(Changed forme: {SPECIES})": "（フォルムチェンジ中：{SPECIES}）", // NEEDS QC
	"Possible Illusion #{NUMBER}": "イリュージョン候補 #{NUMBER}", // NEEDS QC
	"({HP}/{MAXHP} pixels)": "（{HP}/{MAXHP}ピクセル）", // NEEDS QC
	"Would take if ability removed: {PERCENT}%": "特性がなければ受けるダメージ：{PERCENT}%", // NEEDS QC
	"Next damage: {PERCENT}%": "次のダメージ：{PERCENT}%", // NEEDS QC
	"Turns asleep: {NUMBER}": "ねむりの経過ターン数：{NUMBER}", // NEEDS QC
	"(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.)": "（技が5つ以上あるのは、たいていゾロアークやゾロアのイリュージョンです。）", // NEEDS QC
	"(Pressure is not visible in Gen 3, so in certain situations, the exact amount of PP used may be unknown.)": "（第3世代ではプレッシャーが表示されないため、正確なPP消費量がわからないことがあります。）", // NEEDS QC
	"(Your opponent has two indistinguishable Pokémon, making it impossible for you to tell which one has which moves/ability/item.)": "（相手に見分けのつかないポケモンが2体いるため、どちらがどの技・特性・持ち物を持っているか判別できません。）", // NEEDS QC
	"(no conditions)": "（場の状態なし）", // NEEDS QC
	"({NUMBER} turn)": "（{NUMBER}ターン）", // NEEDS QC
	"({NUMBER} turns)": "（{NUMBER}ターン）", // NEEDS QC
	"(After stat modifiers:)": "（能力補正後：）", // NEEDS QC
	"Calls {MOVE}": "{MOVE}を使う", // NEEDS QC
	"(base: {VALUE})": "（もとは{VALUE}）", // NEEDS QC
	"({LOW} to {HIGH})": "（{LOW}〜{HIGH}）", // NEEDS QC
	"(revealed)": "（判明済み）", // NEEDS QC
	"{LOW} to {HIGH}": "{LOW}〜{HIGH}", // NEEDS QC
	"(before stat stage changes)": "（能力ランク変化前）", // NEEDS QC
	"(before external modifiers)": "（外部補正前）", // NEEDS QC
	"<strong>{EFFECT}</strong> vs. {POKEMON}": "{POKEMON}には<strong>{EFFECT}</strong>", // NEEDS QC
	"Base power vs. {POKEMON}": "{POKEMON}へのいりょく", // NEEDS QC
	" or ": "か", // NEEDS QC

	// #endregion Battle
};
