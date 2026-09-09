import type { TranslationCatalog } from '../../../sim/dex-text';

export const translations: TranslationCatalog = {
	// #region Generic
	// ==================================================================

	// TRANSLATORS: a label, like "Ability: Intimidate"
	"{LABEL}: ": "{LABEL}: ", // NEEDS QC
	// TRANSLATORS: as a value, like "Ability: None"
	"None": "Keine", // NEEDS QC
	"(no item)": "(kein Item)", // NEEDS QC
	"(no ability)": "(keine Fähigkeit)", // NEEDS QC
	"(no weather)": "(kein Wetter)", // NEEDS QC
	// TRANSLATORS: a side condition on the opponent's side, like "Foe's Stealth Rock"
	"Foe's {CONDITION}": "{CONDITION} des Gegners", // NEEDS QC

	// TRANSLATORS: for constructing lists
	"{FIRST} or {SECOND}": "{FIRST} oder {SECOND}", // NEEDS QC
	"{FIRST} and {SECOND}": "{FIRST} und {SECOND}", // NEEDS QC
	", {NEXT}": ", {NEXT}", // NEEDS QC
	", or {LAST}": " oder {LAST}", // NEEDS QC
	", and {LAST}": " und {LAST}", // NEEDS QC
	// TRANSLATORS: this is for lists of users specifically
	// TRANSLATORS: (languages with counters should use the "person" counter)
	", and {NUMBER} others": " und {NUMBER} weitere", // NEEDS QC

	// #endregion Generic

	// #region Dex
	// ==================================================================

	"Pokémon": "Pokémon",
	"Move": "Attacke", // NEEDS QC
	"Moves": "Attacken", // NEEDS QC
	"Item": "Item", // NEEDS QC
	"Items": "Items", // NEEDS QC
	"Ability": "Fähigkeit", // NEEDS QC
	"Abilities": "Fähigkeiten", // NEEDS QC
	"Hidden Ability": "Versteckte Fähigkeit", // NEEDS QC
	// TRANSLATORS: "" as in a Pokémon's type; "kind" as in kind of tournament or help ticket
	"Type": {
		"": "Typ",
		"kind": "Typ", // NEEDS QC
	},
	"Types": "Typen",
	"Nature": "Wesen",
	"Category": "Kategorie",
	"Categories": "Kategorien",
	"Gender": "Geschlecht",
	"Egg Group": "Ei-Gruppe", // NEEDS QC
	"Egg Groups": "Ei-Gruppen", // NEEDS QC
	"Tag": "Tag", // NEEDS QC: borrowed term, user-approved (avoids collision with category = "Kategorie")
	"Article": "Artikel", // NEEDS QC
	"Articles": "Artikel", // NEEDS QC
	"Tier": "Tier",
	"Tiers": "Tiers",
	"Format": "Format", // NEEDS QC
	"Formats": "Formate", // NEEDS QC
	"Color": "Farbe",
	// TRANSLATORS: "" as in a form you fill in; "like forme" as in a Pokémon's form/forme
	"Form": {
		"": "Formular", // NEEDS QC
		"like forme": "Form", // NEEDS QC
	},
	"Forme": "Form", // NEEDS QC
	"Dex#": "Pokédex-Nr.", // NEEDS QC
	"Generation": "Generation",
	// TRANSLATORS: intentionally chosen to be very short. do not go longer than three letters for this one
	"Gen {NUMBER}": "{NUMBER}. Gen", // NEEDS QC
	"Evolution": "Entwicklung", // NEEDS QC
	"Pre-Evolution": "Vorentwicklung", // NEEDS QC
	"Does Not Evolve": "Entwickelt sich nicht", // NEEDS QC

	// TRANSLATORS: /dt details
	"Height": "Größe",
	"{NUMBER} m": "{NUMBER} m",
	"Weight": "Gewicht",
	"{NUMBER} kg": "{NUMBER} kg",
	"Crit rate": "Volltrefferquote", // NEEDS QC
	// TRANSLATORS: "" as in user account; "pokemon" as in someone who uses an item/move
	"User": {
		"": null,
		"pokemon": "Nutzbar von", // NEEDS QC
	},
	"Required move": "Benötigte Attacke", // NEEDS QC
	"Target": "Ziel", // NEEDS QC
	"Z-Crystal": "Z-Kristall", // NEEDS QC
	"Dynamax power": "Dynamax-Stärke", // NEEDS QC
	"Past gens only": "Nur frühere Generationen", // NEEDS QC
	"Fling base power": "Schleuder-Stärke", // NEEDS QC
	"Fling effect": "Schleuder-Effekt", // NEEDS QC
	"Natural Gift type": "Beerenkräfte-Typ", // NEEDS QC
	"Natural Gift base power": "Beerenkräfte-Stärke", // NEEDS QC

	// #endregion Dex

	// #region Teambuilder
	// ==================================================================

	"Shiny": "Schillernd",
	"Happiness": "Freundschaft", // NEEDS QC
	"Level": "Level",
	"Nickname": "Spitzname", // NEEDS QC
	// TRANSLATORS: only the EV vs IV distinction is important
	// TRANSLATORS: the English speaking community likes to distinguish all of these,
	// TRANSLATORS: but other languages don't need to
	"EV": "EV",
	"EVs": "EVs",
	"IV": "IV",
	"IVs": "IVs",
	"DVs": "DVs",
	"AV": "AV",
	"AVs": "AVs",
	"Point": "Punkt", // NEEDS QC
	"Points": "Punkte", // NEEDS QC
	// TRANSLATORS: used in Teambuilder, so it should be capitalized (unlike "stats" in names.ts)
	"Stats": "Statuswerte",
	"Team": "Team",
	// TRANSLATORS: "Teams" as in "plural of Team"
	"Teams": "Teams",
	"Teams List": "Teamliste", // NEEDS QC
	"Tera {TYPE}": "Tera-Typ: {TYPE}", // NEEDS QC
	// TRANSLATORS: the Tera type label in the team editor (the battle button uses "Tera {TYPE}" with the type's icon)
	"Tera": "Tera", // NEEDS QC

	// TRANSLATORS: search result headings
	// TRANSLATORS: "Usually useless" is intentionally evasive
	// TRANSLATORS: only for moves that are outclassed or widely considered obviously bad
	// TRANSLATORS: (to avoid arguments about what we're recommending)
	"Usually useless moves": "Meist nutzlose Attacken", // NEEDS QC
	"Sketched moves": "Nachahmer-Attacken", // NEEDS QC
	"Useless sketched moves": "Nutzlose Nachahmer-Attacken", // NEEDS QC
	"Special Event Ability": "Event-Fähigkeit", // NEEDS QC
	"Situational Abilities": "Situative Fähigkeiten", // NEEDS QC
	"Unviable Abilities": "Unbrauchbare Fähigkeiten", // NEEDS QC
	"Illegal Pokémon": "Illegale Pokémon", // NEEDS QC
	"Illegal results": "Illegale Ergebnisse", // NEEDS QC
	"CAP moves": "CAP-Attacken", // NEEDS QC
	"Glitch": "Glitch", // NEEDS QC
	"{TYPE}-type Pokémon": "{TYPE}-Pokémon", // NEEDS QC
	"{TYPE}-type moves": "{TYPE}-Attacken", // NEEDS QC
	"{CATEGORY} moves": "Attacken der Kategorie {CATEGORY}", // NEEDS QC
	"{ABILITY} Pokémon": "Pokémon mit {ABILITY}", // NEEDS QC
	"Specific to {VALUE}": "Nur für {VALUE}", // NEEDS QC
	"Generation {NUMBER}": "Generation {NUMBER}", // NEEDS QC

	// #endregion Teambuilder

	// #region Battle
	// ==================================================================

	"Mega Evolution": "Mega-Entwicklung", // NEEDS QC
	"Z-Power": "Z-Kraft", // NEEDS QC
	"Z-Effect": "Z-Effekt", // NEEDS QC
	"Dynamax": "Dynamax", // NEEDS QC
	"Dynamax Level": "Dynamax-Level", // NEEDS QC
	"Ultra Burst": "Ultra-Burst", // NEEDS QC

	// TRANSLATORS: type effectiveness
	"Super effective": "Sehr effektiv", // NEEDS QC
	"Extremely effective": "Extrem effektiv", // NEEDS QC
	"Effective": "Effektiv", // NEEDS QC
	"Not very effective": "Nicht sehr effektiv", // NEEDS QC
	"Mostly ineffective": "Extrem ineffektiv", // NEEDS QC
	"No effect": "Wirkungslos", // NEEDS QC
	"Weak": "Schwäche", // NEEDS QC: unofficial
	"Resist": "Resistenz", // NEEDS QC: unofficial
	"Immune": "Immunität", // NEEDS QC: unofficial

	// TRANSLATORS: battle tooltips
	"Usually moves first (priority +{PRIORITY}).": "Handelt meist zuerst (Priorität +{PRIORITY}).", // NEEDS QC
	"Nearly always moves first (priority +{PRIORITY}).": "Handelt fast immer zuerst (Priorität +{PRIORITY}).", // NEEDS QC
	"Nearly always moves last (priority \u2212{PRIORITY}).": "Handelt fast immer zuletzt (Priorität −{PRIORITY}).", // NEEDS QC
	"Fails if current HP is {HP}.": "Schlägt fehl, wenn die aktuellen KP {HP} betragen.", // NEEDS QC
	"KOs yourself if current HP is exactly {HP}.": "Besiegt den Anwender, wenn die aktuellen KP genau {HP} betragen.", // NEEDS QC
	"(Transformed into {SPECIES})": "(Verwandelt in {SPECIES})", // NEEDS QC
	"(Changed forme: {SPECIES})": "(Formwechsel: {SPECIES})", // NEEDS QC
	"Possible Illusion #{NUMBER}": "Mögliches Trugbild #{NUMBER}", // NEEDS QC
	"({HP}/{MAXHP} pixels)": "({HP}/{MAXHP} Pixel)", // NEEDS QC
	"Would take if ability removed: {PERCENT}%": "Schaden ohne Fähigkeit: {PERCENT}%", // NEEDS QC
	"Next damage: {PERCENT}%": "Nächster Schaden: {PERCENT}%", // NEEDS QC
	"Turns asleep: {NUMBER}": "Schlafrunden: {NUMBER}", // NEEDS QC
	"(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.)": "(Mehr als 4 Attacken deuten meist auf das Trugbild von Zoroark/Zorua hin.)", // NEEDS QC
	"(Pressure is not visible in Gen 3, so in certain situations, the exact amount of PP used may be unknown.)": "(Erzwinger ist in Gen 3 nicht sichtbar, daher ist der genaue AP-Verbrauch manchmal unbekannt.)", // NEEDS QC
	"(Your opponent has two indistinguishable Pokémon, making it impossible for you to tell which one has which moves/ability/item.)": "(Der Gegner hat zwei ununterscheidbare Pokémon, daher lässt sich nicht sagen, welches welche Attacken/Fähigkeit/Item hat.)", // NEEDS QC
	"(no conditions)": "(keine Zustände)", // NEEDS QC
	"({NUMBER} turn)": "({NUMBER} Runde)", // NEEDS QC
	"({NUMBER} turns)": "({NUMBER} Runden)", // NEEDS QC
	"(After stat modifiers:)": "(Nach Statuswert-Modifikatoren:)", // NEEDS QC
	"Calls {MOVE}": "Ruft {MOVE} auf", // NEEDS QC
	"(base: {VALUE})": "(Basis: {VALUE})", // NEEDS QC
	"({LOW} to {HIGH})": "({LOW} bis {HIGH})", // NEEDS QC
	"(revealed)": "(bekannt)", // NEEDS QC
	"{LOW} to {HIGH}": "{LOW} bis {HIGH}", // NEEDS QC
	"(before stat stage changes)": "(vor Statuswert-Änderungen)", // NEEDS QC
	"(before external modifiers)": "(vor externen Modifikatoren)", // NEEDS QC
	"<strong>{EFFECT}</strong> vs. {POKEMON}": "<strong>{EFFECT}</strong> gegen {POKEMON}", // NEEDS QC
	"Base power vs. {POKEMON}": "Stärke gegen {POKEMON}", // NEEDS QC
	" or ": " oder ", // NEEDS QC

	// #endregion Battle
};
