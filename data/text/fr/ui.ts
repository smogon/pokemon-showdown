import type { TranslationCatalog } from '../../../sim/dex-text';

export const translations: TranslationCatalog = {
	// #region Generic
	// ==================================================================

	// TRANSLATORS: a label, like "Ability: Intimidate"
	"{LABEL}: ": "{LABEL} : ", // NEEDS QC (non-breaking space before the colon)
	// TRANSLATORS: as a value, like "Ability: None"
	"None": "Aucun", // NEEDS QC
	"(no item)": "(aucun objet)", // NEEDS QC
	"(no ability)": "(aucun talent)", // NEEDS QC
	"(no weather)": "(aucune météo)", // NEEDS QC
	// TRANSLATORS: a side condition on the opponent's side, like "Foe's Stealth Rock"
	"Foe's {CONDITION}": "Côté adverse : {CONDITION}", // NEEDS QC

	// TRANSLATORS: for constructing lists
	"{FIRST} or {SECOND}": "{FIRST} ou {SECOND}", // NEEDS QC
	"{FIRST} and {SECOND}": "{FIRST} et {SECOND}", // NEEDS QC
	", {NEXT}": ", {NEXT}", // NEEDS QC
	", or {LAST}": " ou {LAST}", // NEEDS QC
	", and {LAST}": " et {LAST}", // NEEDS QC
	// TRANSLATORS: this is for lists of users specifically
	// TRANSLATORS: (languages with counters should use the "person" counter)
	", and {NUMBER} others": " et {NUMBER} autres", // NEEDS QC

	// #endregion Generic

	// #region Dex
	// ==================================================================

	"Pokémon": "Pokémon",
	"Move": "Capacité", // official term (SV fr_common, e.g. 7435 "la capacité …")
	"Moves": "Capacités",
	"Item": "Objet", // SV fr_common 431 (Held Item → Objet); Champions fra btl_data_pokedetail 11
	"Items": "Objets", // NEEDS QC
	"Ability": "Talent", // SV en/fr_common 429; Champions fra btl_data_pokedetail 3
	"Abilities": "Talents", // NEEDS QC
	"Hidden Ability": "Talent caché", // NEEDS QC
	// TRANSLATORS: "" as in a Pokémon's type; "kind" as in kind of tournament or help ticket
	"Type": {
		"": "Type",
		"kind": "Type", // NEEDS QC
	},
	"Types": "Types",
	"Nature": "Nature",
	"Category": "Catégorie",
	"Categories": "Catégories",
	"Gender": "Sexe",
	"Egg Group": "Groupe d’Œuf", // NEEDS QC
	"Egg Groups": "Groupes d’Œufs", // NEEDS QC
	"Tag": "Étiquette", // NEEDS QC
	"Article": "Article",
	"Articles": "Articles",
	"Tier": "Tier",
	"Tiers": "Tiers",
	"Format": "Format", // NEEDS QC
	"Formats": "Formats", // NEEDS QC
	"Color": "Couleur",
	// TRANSLATORS: "" as in a form you fill in; "like forme" as in a Pokémon's form/forme
	"Form": {
		"": "Formulaire", // NEEDS QC
		"like forme": "Forme", // NEEDS QC
	},
	"Forme": "Forme", // NEEDS QC
	"Dex#": "N° Pokédex", // NEEDS QC
	"Generation": "Génération", // NEEDS QC
	// TRANSLATORS: intentionally chosen to be very short. do not go longer than three letters for this one
	"Gen {NUMBER}": "Gén {NUMBER}", // NEEDS QC
	"Evolution": "Évolution", // NEEDS QC
	"Pre-Evolution": "Pré-évolution", // NEEDS QC
	"Does Not Evolve": "N'évolue pas", // NEEDS QC

	// TRANSLATORS: /dt details
	"Height": "Taille",
	"{NUMBER} m": "{NUMBER} m",
	"Weight": "Poids",
	"{NUMBER} kg": "{NUMBER} kg",
	"Crit rate": "Taux de critique", // NEEDS QC
	// TRANSLATORS: "" as in user account; "pokemon" as in someone who uses an item/move
	"User": {
		"": null,
		"pokemon": "Utilisable par", // NEEDS QC
	},
	"Required move": "Capacité requise", // NEEDS QC
	"Target": "Cible", // NEEDS QC
	"Z-Crystal": "Cristal Z", // NEEDS QC
	"Dynamax power": "Puissance Dynamax", // NEEDS QC
	"Past gens only": "Générations précédentes uniquement", // NEEDS QC
	"Fling base power": "Puissance de Dégommage", // NEEDS QC
	"Fling effect": "Effet de Dégommage", // NEEDS QC
	"Natural Gift type": "Type de Don Naturel", // NEEDS QC
	"Natural Gift base power": "Puissance de Don Naturel", // NEEDS QC

	// #endregion Dex

	// #region Teambuilder
	// ==================================================================

	"Shiny": "Chromatique",
	"Happiness": "Bonheur", // NEEDS QC
	"Level": "Niveau", // NEEDS QC
	"Nickname": "Surnom", // NEEDS QC
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
	"Point": "Point",
	"Points": "Points",
	// TRANSLATORS: used in Teambuilder, so it should be capitalized (unlike "stats" in names.ts)
	"Stats": "Stats",
	"Team": "Équipe", // NEEDS QC
	// TRANSLATORS: "Teams" as in "plural of Team"
	"Teams": "Équipes", // NEEDS QC
	"Teams List": "Liste des équipes", // NEEDS QC
	"Tera {TYPE}": "Type Téracristal : {TYPE}", // NEEDS QC (term "Type Téracristal" = SV en/fr_common 565; label composition is PS-authored)
	// TRANSLATORS: the Tera type label in the team editor (the battle button uses "Tera {TYPE}" with the type's icon)
	"Tera": "Téra", // NEEDS QC

	// TRANSLATORS: search result headings
	// TRANSLATORS: "Usually useless" is intentionally evasive
	// TRANSLATORS: only for moves that are outclassed or widely considered obviously bad
	// TRANSLATORS: (to avoid arguments about what we're recommending)
	"Usually useless moves": "Capacités généralement inutiles", // NEEDS QC
	"Sketched moves": "Capacités via Gribouille", // NEEDS QC
	"Useless sketched moves": "Capacités inutiles via Gribouille", // NEEDS QC
	"Special Event Ability": "Talent d'événement", // NEEDS QC
	"Situational Abilities": "Talents situationnels", // NEEDS QC
	"Unviable Abilities": "Talents non viables", // NEEDS QC
	"Illegal Pokémon": "Pokémon illégaux", // NEEDS QC
	"Illegal results": "Résultats illégaux", // NEEDS QC
	"CAP moves": "Capacités CAP", // NEEDS QC
	"Glitch": "Glitch", // NEEDS QC
	"{TYPE}-type Pokémon": "Pokémon de type {TYPE}", // NEEDS QC
	"{TYPE}-type moves": "Capacités de type {TYPE}", // NEEDS QC
	"{CATEGORY} moves": "Capacités de catégorie {CATEGORY}", // NEEDS QC
	"{ABILITY} Pokémon": "Pokémon avec {ABILITY}", // NEEDS QC
	"Specific to {VALUE}": "Exclusif à {VALUE}", // NEEDS QC
	"Generation {NUMBER}": "Génération {NUMBER}", // NEEDS QC

	// #endregion Teambuilder

	// #region Battle
	// ==================================================================

	"Mega Evolution": "Méga-Évolution", // NEEDS QC
	"Z-Power": "Force Z", // NEEDS QC
	"Z-Effect": "Effet Z", // NEEDS QC
	"Dynamax": "Dynamax", // NEEDS QC
	"Dynamax Level": "Niveau Dynamax", // NEEDS QC
	"Ultra Burst": "Ultra-Explosion", // NEEDS QC

	// TRANSLATORS: type effectiveness
	"Super effective": "Super efficace", // NEEDS QC
	"Extremely effective": "Hyper efficace", // NEEDS QC
	"Effective": "Efficace", // NEEDS QC
	"Not very effective": "Pas très efficace", // NEEDS QC
	"Mostly ineffective": "Vraiment pas très efficace", // NEEDS QC
	"No effect": "Aucun effet", // NEEDS QC
	"Weak": "Faiblesse", // NEEDS QC: unofficial
	"Resist": "Résistance", // NEEDS QC: unofficial
	"Immune": "Immunité", // NEEDS QC: unofficial

	// TRANSLATORS: battle tooltips
	"Usually moves first (priority +{PRIORITY}).": "Agit généralement en premier (priorité +{PRIORITY}).", // NEEDS QC
	"Nearly always moves first (priority +{PRIORITY}).": "Agit presque toujours en premier (priorité +{PRIORITY}).", // NEEDS QC
	"Nearly always moves last (priority \u2212{PRIORITY}).": "Agit presque toujours en dernier (priorité −{PRIORITY}).", // NEEDS QC
	"Fails if current HP is {HP}.": "Échoue si les PV actuels sont {HP}.", // NEEDS QC
	"KOs yourself if current HP is exactly {HP}.": "Met K.O. l'utilisateur si les PV actuels sont exactement {HP}.", // NEEDS QC
	"(Transformed into {SPECIES})": "(Transformé en {SPECIES})", // NEEDS QC
	"(Changed forme: {SPECIES})": "(Changement de forme : {SPECIES})", // NEEDS QC
	"Possible Illusion #{NUMBER}": "Illusion possible nº {NUMBER}", // NEEDS QC
	"({HP}/{MAXHP} pixels)": "({HP}/{MAXHP} pixels)", // NEEDS QC
	"Would take if ability removed: {PERCENT}%": "Dégâts sans le talent : {PERCENT} %", // NEEDS QC
	"Next damage: {PERCENT}%": "Prochains dégâts : {PERCENT} %", // NEEDS QC
	"Turns asleep: {NUMBER}": "Tours de sommeil : {NUMBER}", // NEEDS QC
	"(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.)": "(Plus de 4 capacités indiquent généralement l'Illusion de Zoroark ou Zorua.)", // NEEDS QC
	"(Pressure is not visible in Gen 3, so in certain situations, the exact amount of PP used may be unknown.)": "(Pression n'est pas visible en 3G, la quantité exacte de PP utilisés peut donc être inconnue.)", // NEEDS QC
	"(Your opponent has two indistinguishable Pokémon, making it impossible for you to tell which one has which moves/ability/item.)": "(L'adversaire a deux Pokémon impossibles à distinguer ; on ne peut pas savoir lequel a quelles capacités, quel talent ou quel objet.)", // NEEDS QC
	"(no conditions)": "(aucune condition)", // NEEDS QC
	"({NUMBER} turn)": "({NUMBER} tour)", // NEEDS QC
	"({NUMBER} turns)": "({NUMBER} tours)", // NEEDS QC
	"(After stat modifiers:)": "(Après modificateurs de stats :)", // NEEDS QC
	"Calls {MOVE}": "Utilise {MOVE}", // NEEDS QC
	"(base: {VALUE})": "(base : {VALUE})", // NEEDS QC
	"({LOW} to {HIGH})": "({LOW} à {HIGH})", // NEEDS QC
	"(revealed)": "(révélée)", // NEEDS QC
	"{LOW} to {HIGH}": "{LOW} à {HIGH}", // NEEDS QC
	"(before stat stage changes)": "(avant changements de stats)", // NEEDS QC
	"(before external modifiers)": "(avant modificateurs externes)", // NEEDS QC
	"<strong>{EFFECT}</strong> vs. {POKEMON}": "<strong>{EFFECT}</strong> contre {POKEMON}", // NEEDS QC
	"Base power vs. {POKEMON}": "Puissance contre {POKEMON}", // NEEDS QC
	" or ": " ou ", // NEEDS QC

	// #endregion Battle
};
