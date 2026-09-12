import type { TranslationCatalog } from '../../../sim/dex-text';

export const translations: TranslationCatalog = {
	// #region Generic
	// ==================================================================

	// TRANSLATORS: a label, like "Ability: Intimidate"
	"{LABEL}: ": "{LABEL}: ", // NEEDS QC
	// TRANSLATORS: as a value, like "Ability: None"
	"None": "Nessuno", // NEEDS QC
	"(no item)": "(nessuno strumento)", // NEEDS QC
	"(no ability)": "(nessuna abilità)", // NEEDS QC
	"(no weather)": "(nessuna condizione atmosferica)", // NEEDS QC
	// TRANSLATORS: a side condition on the opponent's side, like "Foe's Stealth Rock"
	"Foe's {CONDITION}": "Lato avversario: {CONDITION}", // NEEDS QC

	// TRANSLATORS: for constructing lists
	"{FIRST} or {SECOND}": "{FIRST} o {SECOND}", // NEEDS QC
	"{FIRST} and {SECOND}": "{FIRST} e {SECOND}", // NEEDS QC
	", {NEXT}": ", {NEXT}", // NEEDS QC
	", or {LAST}": " o {LAST}", // NEEDS QC
	", and {LAST}": " e {LAST}", // NEEDS QC
	// TRANSLATORS: this is for lists of users specifically
	// TRANSLATORS: (languages with counters should use the "person" counter)
	", and {NUMBER} others": " e altri {NUMBER}", // NEEDS QC

	// #endregion Generic

	// #region Dex
	// ==================================================================

	"Pokémon": "Pokémon",
	"Move": "Mossa", // NEEDS QC
	"Moves": "Mosse", // NEEDS QC
	"Item": "Strumento", // NEEDS QC
	"Items": "Strumenti", // NEEDS QC
	"Ability": "Abilità", // NEEDS QC
	"Abilities": "Abilità", // NEEDS QC
	"Hidden Ability": "Abilità speciale",
	// TRANSLATORS: "" as in a Pokémon's type; "kind" as in kind of tournament or help ticket
	"Type": {
		"": "Tipo",
		"kind": "Tipo", // NEEDS QC
	},
	"Types": "Tipi",
	"Nature": "Natura",
	"Category": "Categoria",
	"Categories": "Categorie",
	"Gender": "Sesso",
	"Egg Group": "Gruppo Uova", // NEEDS QC
	"Egg Groups": "Gruppi Uova", // NEEDS QC
	"Tag": "Etichetta", // NEEDS QC
	"Article": "Articolo", // NEEDS QC
	"Articles": "Articoli", // NEEDS QC
	"Tier": "Tier",
	"Tiers": "Tier", // NEEDS QC
	"Format": "Formato", // NEEDS QC
	"Formats": "Formati", // NEEDS QC
	"Color": "Colore",
	// TRANSLATORS: "" as in a form you fill in; "like forme" as in a Pokémon's form/forme
	"Form": {
		"": "Modulo", // NEEDS QC
		"like forme": "Forma", // NEEDS QC
	},
	"Forme": "Forma", // NEEDS QC
	"Dex#": "N. Pokédex", // NEEDS QC
	"Generation": "Generazione", // NEEDS QC
	// TRANSLATORS: intentionally chosen to be very short. do not go longer than three letters for this one
	"Gen {NUMBER}": "Gen {NUMBER}", // NEEDS QC
	"Evolution": "Evoluzione", // NEEDS QC
	"Pre-Evolution": "Pre-evoluzione", // NEEDS QC
	"Does Not Evolve": "Non si evolve", // NEEDS QC

	// TRANSLATORS: /dt details
	"Height": "Altezza",
	"{NUMBER} m": "{NUMBER} m",
	"Weight": "Peso",
	"{NUMBER} kg": "{NUMBER} kg",
	"Crit rate": "Probabilità di brutto colpo", // NEEDS QC
	// TRANSLATORS: "" as in user account; "pokemon" as in someone who uses an item/move
	"User": {
		"": null,
		"pokemon": "Utilizzabile da", // NEEDS QC
	},
	"Required move": "Mossa richiesta", // NEEDS QC
	"Target": "Bersaglio", // NEEDS QC
	"Z-Crystal": "Cristallo Z",
	"Dynamax power": "Potenza Dynamax", // NEEDS QC
	"Past gens only": "Solo generazioni precedenti", // NEEDS QC
	"Fling base power": "Potenza di Lancio", // NEEDS QC
	"Fling effect": "Effetto di Lancio", // NEEDS QC
	"Natural Gift type": "Tipo di Dononaturale", // NEEDS QC
	"Natural Gift base power": "Potenza di Dononaturale", // NEEDS QC

	// #endregion Dex

	// #region Teambuilder
	// ==================================================================

	"Shiny": "Cromatico",
	"Happiness": "Amicizia", // NEEDS QC
	"Level": "Livello", // NEEDS QC
	"Nickname": "Soprannome",
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
	"Point": "Punto", // NEEDS QC
	"Points": "Punti", // NEEDS QC
	// TRANSLATORS: used in Teambuilder, so it should be capitalized (unlike "stats" in names.ts)
	"Stats": "Statistiche",
	"Team": "Squadra", // NEEDS QC
	// TRANSLATORS: "Teams" as in "plural of Team"
	"Teams": "Squadre", // NEEDS QC
	"Teams List": "Elenco squadre", // NEEDS QC
	"Tera {TYPE}": "Teratipo {TYPE}", // NEEDS QC
	// TRANSLATORS: the Tera type label in the team editor (the battle button uses "Tera {TYPE}" with the type's icon)
	"Tera": "Tera", // NEEDS QC

	// TRANSLATORS: search result headings
	// TRANSLATORS: "Usually useless" is intentionally evasive
	// TRANSLATORS: only for moves that are outclassed or widely considered obviously bad
	// TRANSLATORS: (to avoid arguments about what we're recommending)
	"Usually useless moves": "Mosse generalmente inutili", // NEEDS QC
	"Sketched moves": "Mosse da Schizzo", // NEEDS QC
	"Useless sketched moves": "Mosse inutili da Schizzo", // NEEDS QC
	"Special Event Ability": "Abilità da evento", // NEEDS QC
	"Situational Abilities": "Abilità situazionali", // NEEDS QC
	"Unviable Abilities": "Abilità inutili", // NEEDS QC
	"Illegal Pokémon": "Pokémon illegali", // NEEDS QC
	"Illegal results": "Risultati illegali", // NEEDS QC
	"CAP moves": "Mosse CAP", // NEEDS QC
	"Glitch": "Glitch", // NEEDS QC
	"{TYPE}-type Pokémon": "Pokémon di tipo {TYPE}", // NEEDS QC
	"{TYPE}-type moves": "Mosse di tipo {TYPE}", // NEEDS QC
	"{CATEGORY} moves": "Mosse di categoria {CATEGORY}", // NEEDS QC
	"{ABILITY} Pokémon": "Pokémon con {ABILITY}", // NEEDS QC
	"Specific to {VALUE}": "Esclusivo di {VALUE}", // NEEDS QC
	"Generation {NUMBER}": "Generazione {NUMBER}", // NEEDS QC

	// #endregion Teambuilder

	// #region Battle
	// ==================================================================

	"Mega Evolution": "Megaevoluzione", // NEEDS QC
	"Z-Power": "Potere Z", // NEEDS QC
	"Z-Effect": "Effetto Z", // NEEDS QC
	"Dynamax": "Dynamax", // NEEDS QC
	"Dynamax Level": "Livello Dynamax",
	"Ultra Burst": "Ultraesplosione",

	// TRANSLATORS: type effectiveness
	"Super effective": "Superefficace",
	"Extremely effective": "Iperefficace",
	"Effective": "Effetto normale", // NEEDS QC
	"Not very effective": "Poco efficace", // NEEDS QC
	"Mostly ineffective": "Quasi per niente efficace",
	"No effect": "Nessun effetto", // NEEDS QC
	"Weak": "Debolezza", // NEEDS QC: unofficial
	"Resist": "Resistenza", // NEEDS QC: unofficial
	"Immune": "Immunità", // NEEDS QC: unofficial

	// TRANSLATORS: battle tooltips
	"Usually moves first (priority +{PRIORITY}).": "Di solito agisce per primo (priorità +{PRIORITY}).", // NEEDS QC
	"Nearly always moves first (priority +{PRIORITY}).": "Agisce quasi sempre per primo (priorità +{PRIORITY}).", // NEEDS QC
	"Nearly always moves last (priority \u2212{PRIORITY}).": "Agisce quasi sempre per ultimo (priorità −{PRIORITY}).", // NEEDS QC
	"Fails if current HP is {HP}.": "Fallisce se i PS attuali sono {HP}.", // NEEDS QC
	"KOs yourself if current HP is exactly {HP}.": "Manda KO l'utilizzatore se i PS attuali sono esattamente {HP}.", // NEEDS QC
	"(Transformed into {SPECIES})": "(Trasformato in {SPECIES})", // NEEDS QC
	"(Changed forme: {SPECIES})": "(Cambio forma: {SPECIES})", // NEEDS QC
	"Possible Illusion #{NUMBER}": "Possibile Illusione n. {NUMBER}", // NEEDS QC
	"({HP}/{MAXHP} pixels)": "({HP}/{MAXHP} pixel)", // NEEDS QC
	"Would take if ability removed: {PERCENT}%": "Danni senza l'abilità: {PERCENT}%", // NEEDS QC
	"Next damage: {PERCENT}%": "Prossimi danni: {PERCENT}%", // NEEDS QC
	"Turns asleep: {NUMBER}": "Turni di sonno: {NUMBER}", // NEEDS QC
	"(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.)": "(Più di 4 mosse di solito indicano l'Illusione di Zoroark o Zorua.)", // NEEDS QC
	"(Pressure is not visible in Gen 3, so in certain situations, the exact amount of PP used may be unknown.)": "(Pressione non è visibile in terza generazione, quindi i PP usati potrebbero non essere noti con esattezza.)", // NEEDS QC
	"(Your opponent has two indistinguishable Pokémon, making it impossible for you to tell which one has which moves/ability/item.)": "(L'avversario ha due Pokémon indistinguibili: è impossibile sapere quale abbia quali mosse, abilità e strumento.)", // NEEDS QC
	"(no conditions)": "(nessuna condizione)", // NEEDS QC
	"({NUMBER} turn)": "({NUMBER} turno)", // NEEDS QC
	"({NUMBER} turns)": "({NUMBER} turni)", // NEEDS QC
	"(After stat modifiers:)": "(Dopo i modificatori delle statistiche:)", // NEEDS QC
	"Calls {MOVE}": "Richiama {MOVE}", // NEEDS QC
	"(base: {VALUE})": "(base: {VALUE})", // NEEDS QC
	"({LOW} to {HIGH})": "(da {LOW} a {HIGH})", // NEEDS QC
	"(revealed)": "(rivelata)", // NEEDS QC
	"{LOW} to {HIGH}": "da {LOW} a {HIGH}", // NEEDS QC
	"(before stat stage changes)": "(prima delle modifiche alle statistiche)", // NEEDS QC
	"(before external modifiers)": "(prima dei modificatori esterni)", // NEEDS QC
	"<strong>{EFFECT}</strong> vs. {POKEMON}": "<strong>{EFFECT}</strong> contro {POKEMON}", // NEEDS QC
	"Base power vs. {POKEMON}": "Potenza contro {POKEMON}", // NEEDS QC
	" or ": " o ", // NEEDS QC

	// #endregion Battle
};
