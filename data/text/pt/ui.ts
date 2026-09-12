import type { TranslationCatalog } from '../../../sim/dex-text';

export const translations: TranslationCatalog = {
	// #region Generic
	// ==================================================================

	// TRANSLATORS: a label, like "Ability: Intimidate"
	"{LABEL}: ": null, // NEEDS TRANSLATION
	// TRANSLATORS: as a value, like "Ability: None"
	"None": null, // NEEDS TRANSLATION
	"(no item)": null, // NEEDS TRANSLATION
	"(no ability)": null, // NEEDS TRANSLATION
	"(no weather)": null, // NEEDS TRANSLATION
	// TRANSLATORS: a side condition on the opponent's side, like "Foe's Stealth Rock"
	"Foe's {CONDITION}": null, // NEEDS TRANSLATION

	// TRANSLATORS: for constructing lists
	"{FIRST} or {SECOND}": "{FIRST} ou {SECOND}", // NEEDS QC
	"{FIRST} and {SECOND}": "{FIRST} e {SECOND}", // NEEDS QC
	", {NEXT}": ", {NEXT}", // NEEDS QC
	", or {LAST}": " ou {LAST}", // NEEDS QC
	", and {LAST}": " e {LAST}", // NEEDS QC
	// TRANSLATORS: this is for lists of users specifically
	// TRANSLATORS: (languages with counters should use the "person" counter)
	", and {NUMBER} others": " e mais {NUMBER}", // NEEDS QC

	// #endregion Generic

	// #region Dex
	// ==================================================================

	"Pokémon": null, // NEEDS TRANSLATION
	"Move": null, // NEEDS TRANSLATION
	"Moves": null, // NEEDS TRANSLATION
	"Item": null, // NEEDS TRANSLATION
	"Items": null, // NEEDS TRANSLATION
	"Ability": null, // NEEDS TRANSLATION
	"Abilities": null, // NEEDS TRANSLATION
	"Hidden Ability": null, // NEEDS TRANSLATION
	// TRANSLATORS: "" as in a Pokémon's type; "kind" as in kind of tournament or help ticket
	"Type": {
		"": null, // NEEDS TRANSLATION
		"kind": "Tipo", // NEEDS QC
	},
	"Types": null, // NEEDS TRANSLATION
	"Nature": null, // NEEDS TRANSLATION
	"Category": null, // NEEDS TRANSLATION
	"Categories": null, // NEEDS TRANSLATION
	"Gender": null, // NEEDS TRANSLATION
	"Egg Group": null, // NEEDS TRANSLATION
	"Egg Groups": null, // NEEDS TRANSLATION
	"Tag": null, // NEEDS TRANSLATION
	"Article": null, // NEEDS TRANSLATION
	"Articles": null, // NEEDS TRANSLATION
	"Tier": null, // NEEDS TRANSLATION
	"Tiers": null, // NEEDS TRANSLATION
	"Format": null, // NEEDS TRANSLATION
	"Formats": null, // NEEDS TRANSLATION
	"Color": null, // NEEDS TRANSLATION
	// TRANSLATORS: "" as in a form you fill in; "like forme" as in a Pokémon's form/forme
	"Form": {
		"": "Formulário", // NEEDS QC
		"like forme": null, // NEEDS TRANSLATION
	},
	"Forme": null, // NEEDS TRANSLATION
	"Dex#": null, // NEEDS TRANSLATION
	"Generation": null, // NEEDS TRANSLATION
	// TRANSLATORS: intentionally chosen to be very short. do not go longer than three letters for this one
	"Gen {NUMBER}": "Gen {NUMBER}", // NEEDS QC
	"Evolution": null, // NEEDS TRANSLATION
	"Pre-Evolution": null, // NEEDS TRANSLATION
	"Does Not Evolve": null, // NEEDS TRANSLATION

	// TRANSLATORS: /dt details
	"Height": null, // NEEDS TRANSLATION
	"{NUMBER} m": null, // NEEDS TRANSLATION
	"Weight": null, // NEEDS TRANSLATION
	"{NUMBER} kg": null, // NEEDS TRANSLATION
	"Crit rate": null, // NEEDS TRANSLATION
	// TRANSLATORS: "" as in user account; "pokemon" as in someone who uses an item/move
	"User": {
		"": null,
		"pokemon": null, // NEEDS TRANSLATION
	},
	"Required move": null, // NEEDS TRANSLATION
	"Target": null, // NEEDS TRANSLATION
	"Z-Crystal": null, // NEEDS TRANSLATION
	"Dynamax power": null, // NEEDS TRANSLATION
	"Past gens only": null, // NEEDS TRANSLATION
	"Fling base power": null, // NEEDS TRANSLATION
	"Fling effect": null, // NEEDS TRANSLATION
	"Natural Gift type": null, // NEEDS TRANSLATION
	"Natural Gift base power": null, // NEEDS TRANSLATION

	// #endregion Dex

	// #region Teambuilder
	// ==================================================================

	"Shiny": null, // NEEDS TRANSLATION
	"Happiness": null, // NEEDS TRANSLATION
	"Level": null, // NEEDS TRANSLATION
	"Nickname": null, // NEEDS TRANSLATION
	// TRANSLATORS: only the EV vs IV distinction is important
	// TRANSLATORS: the English speaking community likes to distinguish all of these,
	// TRANSLATORS: but other languages don't need to
	"EV": null, // NEEDS TRANSLATION
	"EVs": null, // NEEDS TRANSLATION
	"IV": null, // NEEDS TRANSLATION
	"IVs": null, // NEEDS TRANSLATION
	"DVs": null, // NEEDS TRANSLATION
	"AV": null, // NEEDS TRANSLATION
	"AVs": null, // NEEDS TRANSLATION
	"Point": null, // NEEDS TRANSLATION
	"Points": null, // NEEDS TRANSLATION
	// TRANSLATORS: used in Teambuilder, so it should be capitalized (unlike "stats" in names.ts)
	"Stats": null, // NEEDS TRANSLATION
	"Team": null, // NEEDS TRANSLATION
	// TRANSLATORS: "Teams" as in "plural of Team"
	"Teams": null, // NEEDS TRANSLATION
	"Teams List": null, // NEEDS TRANSLATION
	"Tera {TYPE}": null, // NEEDS TRANSLATION
	// TRANSLATORS: the Tera type label in the team editor (the battle button uses "Tera {TYPE}" with the type's icon)
	"Tera": "Tera", // NEEDS QC

	// TRANSLATORS: search result headings
	// TRANSLATORS: "Usually useless" is intentionally evasive
	// TRANSLATORS: only for moves that are outclassed or widely considered obviously bad
	// TRANSLATORS: (to avoid arguments about what we're recommending)
	"Usually useless moves": null, // NEEDS TRANSLATION
	"Sketched moves": null, // NEEDS TRANSLATION
	"Useless sketched moves": null, // NEEDS TRANSLATION
	"Special Event Ability": null, // NEEDS TRANSLATION
	"Situational Abilities": null, // NEEDS TRANSLATION
	"Unviable Abilities": null, // NEEDS TRANSLATION
	"Illegal Pokémon": null, // NEEDS TRANSLATION
	"Illegal results": null, // NEEDS TRANSLATION
	"CAP moves": null, // NEEDS TRANSLATION
	"Glitch": null, // NEEDS TRANSLATION
	"{TYPE}-type Pokémon": null, // NEEDS TRANSLATION
	"{TYPE}-type moves": null, // NEEDS TRANSLATION
	"{CATEGORY} moves": null, // NEEDS TRANSLATION
	"{ABILITY} Pokémon": null, // NEEDS TRANSLATION
	"Specific to {VALUE}": null, // NEEDS TRANSLATION
	"Generation {NUMBER}": null, // NEEDS TRANSLATION

	// #endregion Teambuilder

	// #region Battle
	// ==================================================================

	"Mega Evolution": null, // NEEDS TRANSLATION
	"Z-Power": null, // NEEDS TRANSLATION
	"Z-Effect": null, // NEEDS TRANSLATION
	"Dynamax": null, // NEEDS TRANSLATION
	"Dynamax Level": null, // NEEDS TRANSLATION
	"Ultra Burst": null, // NEEDS TRANSLATION

	// TRANSLATORS: type effectiveness
	"Super effective": null, // NEEDS TRANSLATION
	"Extremely effective": null, // NEEDS TRANSLATION
	"Effective": null, // NEEDS TRANSLATION
	"Not very effective": null, // NEEDS TRANSLATION
	"Mostly ineffective": null, // NEEDS TRANSLATION
	"No effect": null, // NEEDS TRANSLATION
	"Weak": null, // NEEDS TRANSLATION
	"Resist": null, // NEEDS TRANSLATION
	"Immune": null, // NEEDS TRANSLATION

	// TRANSLATORS: battle tooltips
	"Usually moves first (priority +{PRIORITY}).": null, // NEEDS TRANSLATION
	"Nearly always moves first (priority +{PRIORITY}).": null, // NEEDS TRANSLATION
	"Nearly always moves last (priority \u2212{PRIORITY}).": null, // NEEDS TRANSLATION
	"Fails if current HP is {HP}.": null, // NEEDS TRANSLATION
	"KOs yourself if current HP is exactly {HP}.": null, // NEEDS TRANSLATION
	"(Transformed into {SPECIES})": null, // NEEDS TRANSLATION
	"(Changed forme: {SPECIES})": null, // NEEDS TRANSLATION
	"Possible Illusion #{NUMBER}": null, // NEEDS TRANSLATION
	"({HP}/{MAXHP} pixels)": null, // NEEDS TRANSLATION
	"Would take if ability removed: {PERCENT}%": null, // NEEDS TRANSLATION
	"Next damage: {PERCENT}%": null, // NEEDS TRANSLATION
	"Turns asleep: {NUMBER}": null, // NEEDS TRANSLATION
	"(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.)": null, // NEEDS TRANSLATION
	"(Pressure is not visible in Gen 3, so in certain situations, the exact amount of PP used may be unknown.)": null, // NEEDS TRANSLATION
	"(Your opponent has two indistinguishable Pokémon, making it impossible for you to tell which one has which moves/ability/item.)": null, // NEEDS TRANSLATION
	"(no conditions)": null, // NEEDS TRANSLATION
	"({NUMBER} turn)": null, // NEEDS TRANSLATION
	"({NUMBER} turns)": null, // NEEDS TRANSLATION
	"(After stat modifiers:)": null, // NEEDS TRANSLATION
	"Calls {MOVE}": null, // NEEDS TRANSLATION
	"(base: {VALUE})": null, // NEEDS TRANSLATION
	"({LOW} to {HIGH})": null, // NEEDS TRANSLATION
	"(revealed)": null, // NEEDS TRANSLATION
	"{LOW} to {HIGH}": null, // NEEDS TRANSLATION
	"(before stat stage changes)": null, // NEEDS TRANSLATION
	"(before external modifiers)": null, // NEEDS TRANSLATION
	"<strong>{EFFECT}</strong> vs. {POKEMON}": null, // NEEDS TRANSLATION
	"Base power vs. {POKEMON}": null, // NEEDS TRANSLATION
	" or ": null, // NEEDS TRANSLATION

	// #endregion Battle
};
