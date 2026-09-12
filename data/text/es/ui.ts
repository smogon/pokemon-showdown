import type { TranslationCatalog } from '../../../sim/dex-text';

export const translations: TranslationCatalog = {
	// #region Generic
	// ==================================================================

	// TRANSLATORS: a label, like "Ability: Intimidate"
	"{LABEL}: ": "{LABEL}: ", // NEEDS QC
	// TRANSLATORS: as a value, like "Ability: None"
	"None": "Ninguno", // NEEDS QC
	"(no item)": "(sin objeto)", // NEEDS QC
	"(no ability)": "(sin habilidad)", // NEEDS QC
	"(no weather)": "(sin clima)", // NEEDS QC
	// TRANSLATORS: a side condition on the opponent's side, like "Foe's Stealth Rock"
	"Foe's {CONDITION}": "{CONDITION} del rival", // NEEDS QC

	// TRANSLATORS: for constructing lists
	"{FIRST} or {SECOND}": "{FIRST} o {SECOND}", // NEEDS QC
	"{FIRST} and {SECOND}": "{FIRST} y {SECOND}", // NEEDS QC
	", {NEXT}": ", {NEXT}", // NEEDS QC
	", or {LAST}": " o {LAST}", // NEEDS QC
	", and {LAST}": " y {LAST}", // NEEDS QC
	// TRANSLATORS: this is for lists of users specifically
	// TRANSLATORS: (languages with counters should use the "person" counter)
	", and {NUMBER} others": " y {NUMBER} más", // NEEDS QC

	// #endregion Generic

	// #region Dex
	// ==================================================================

	"Pokémon": "Pokémon",
	"Move": "Movimiento", // NEEDS QC
	"Moves": "Movimientos", // verified: Champions es_ms 502
	"Item": "Objeto", // NEEDS QC
	"Items": "Objetos", // NEEDS QC
	"Ability": "Habilidad", // verified: Champions es_ms 498
	"Abilities": "Habilidades", // NEEDS QC
	"Hidden Ability": "Habilidad oculta", // NEEDS QC
	// TRANSLATORS: "" as in a Pokémon's type; "kind" as in kind of tournament or help ticket
	"Type": {
		"": "Tipo",
		"kind": "Tipo", // NEEDS QC
	},
	"Types": "Tipos",
	"Nature": "Naturaleza",
	"Category": "Clase",
	"Categories": "Clases",
	"Gender": "Sexo",
	"Egg Group": "Grupo Huevo", // NEEDS QC
	"Egg Groups": "Grupos Huevo", // NEEDS QC
	"Tag": "Etiqueta", // NEEDS QC
	"Article": "Artículo", // NEEDS QC
	"Articles": "Artículos", // NEEDS QC
	"Tier": "Tier",
	"Tiers": "Tiers",
	"Format": "Formato", // NEEDS QC
	"Formats": "Formatos", // NEEDS QC
	"Color": "Color",
	// TRANSLATORS: "" as in a form you fill in; "like forme" as in a Pokémon's form/forme
	"Form": {
		"": "Formulario", // NEEDS QC
		"like forme": "Forma", // NEEDS QC
	},
	"Forme": "Forma", // NEEDS QC
	"Dex#": "N.º Pokédex", // NEEDS QC
	"Generation": "Generación", // NEEDS QC
	// TRANSLATORS: intentionally chosen to be very short. do not go longer than three letters for this one
	"Gen {NUMBER}": "{NUMBER}.ª Gen", // NEEDS QC
	"Evolution": "Evolución", // NEEDS QC
	"Pre-Evolution": "Preevolución", // NEEDS QC
	"Does Not Evolve": "No evoluciona", // NEEDS QC

	// TRANSLATORS: /dt details
	"Height": "Altura",
	"{NUMBER} m": "{NUMBER} m",
	"Weight": "Peso",
	"{NUMBER} kg": "{NUMBER} kg",
	"Crit rate": "Índice de crítico", // NEEDS QC
	// TRANSLATORS: "" as in user account; "pokemon" as in someone who uses an item/move
	"User": {
		"": null,
		"pokemon": "Utilizable por", // NEEDS QC
	},
	"Required move": "Movimiento requerido", // NEEDS QC
	"Target": "Objetivo", // NEEDS QC
	"Z-Crystal": "Cristal Z", // NEEDS QC
	"Dynamax power": "Potencia Dinamax", // NEEDS QC
	"Past gens only": "Solo generaciones anteriores", // NEEDS QC
	"Fling base power": "Potencia de Lanzamiento", // NEEDS QC
	"Fling effect": "Efecto de Lanzamiento", // NEEDS QC
	"Natural Gift type": "Tipo de Don Natural", // NEEDS QC
	"Natural Gift base power": "Potencia de Don Natural", // NEEDS QC

	// #endregion Dex

	// #region Teambuilder
	// ==================================================================

	"Shiny": "Variocolor",
	"Happiness": "Amistad", // NEEDS QC
	"Level": "Nivel", // NEEDS QC
	"Nickname": "Mote", // NEEDS QC
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
	"Points": "Puntos", // NEEDS QC
	// TRANSLATORS: used in Teambuilder, so it should be capitalized (unlike "stats" in names.ts)
	"Stats": "Características",
	"Team": "Equipo", // NEEDS QC
	// TRANSLATORS: "Teams" as in "plural of Team"
	"Teams": "Equipos", // NEEDS QC
	"Teams List": "Lista de equipos", // NEEDS QC
	"Tera {TYPE}": "Teratipo: {TYPE}", // NEEDS QC
	// TRANSLATORS: the Tera type label in the team editor (the battle button uses "Tera {TYPE}" with the type's icon)
	"Tera": "Tera", // NEEDS QC

	// TRANSLATORS: search result headings
	// TRANSLATORS: "Usually useless" is intentionally evasive
	// TRANSLATORS: only for moves that are outclassed or widely considered obviously bad
	// TRANSLATORS: (to avoid arguments about what we're recommending)
	"Usually useless moves": "Movimientos generalmente inútiles", // NEEDS QC
	"Sketched moves": "Movimientos por Esquema", // NEEDS QC
	"Useless sketched moves": "Movimientos inútiles por Esquema", // NEEDS QC
	"Special Event Ability": "Habilidad de evento", // NEEDS QC
	"Situational Abilities": "Habilidades situacionales", // NEEDS QC
	"Unviable Abilities": "Habilidades inviables", // NEEDS QC
	"Illegal Pokémon": "Pokémon ilegales", // NEEDS QC
	"Illegal results": "Resultados ilegales", // NEEDS QC
	"CAP moves": "Movimientos CAP", // NEEDS QC
	"Glitch": "Glitch", // NEEDS QC
	"{TYPE}-type Pokémon": "Pokémon de tipo {TYPE}", // NEEDS QC
	"{TYPE}-type moves": "Movimientos de tipo {TYPE}", // NEEDS QC
	"{CATEGORY} moves": "Movimientos de categoría {CATEGORY}", // NEEDS QC
	"{ABILITY} Pokémon": "Pokémon con {ABILITY}", // NEEDS QC
	"Specific to {VALUE}": "Exclusivo de {VALUE}", // NEEDS QC
	"Generation {NUMBER}": "Generación {NUMBER}", // NEEDS QC

	// #endregion Teambuilder

	// #region Battle
	// ==================================================================

	"Mega Evolution": "Megaevolución", // NEEDS QC
	"Z-Power": "Poder Z", // NEEDS QC
	"Z-Effect": "Efecto Z", // NEEDS QC
	"Dynamax": "Dinamax", // NEEDS QC
	"Dynamax Level": "Nivel Dinamax", // NEEDS QC
	"Ultra Burst": "Ultraexplosión", // NEEDS QC

	// TRANSLATORS: type effectiveness
	"Super effective": "Supereficaz", // verified: Champions es_ms 427
	"Extremely effective": "Hipereficaz", // verified: Champions es_ms 428
	"Effective": "Eficaz", // verified: Champions es_ms 429
	"Not very effective": "Poco eficaz", // verified: Champions es_ms 430
	"Mostly ineffective": "Muy poco eficaz", // verified: Champions es_ms 431
	"No effect": "Sin efecto", // verified: Champions es_ms 432 ("Has no effect")
	"Weak": "Debilidad", // NEEDS QC: unofficial
	"Resist": "Resistencia", // NEEDS QC: unofficial
	"Immune": "Inmunidad", // NEEDS QC: unofficial

	// TRANSLATORS: battle tooltips
	"Usually moves first (priority +{PRIORITY}).": "Suele actuar primero (prioridad +{PRIORITY}).", // NEEDS QC
	"Nearly always moves first (priority +{PRIORITY}).": "Casi siempre actúa primero (prioridad +{PRIORITY}).", // NEEDS QC
	"Nearly always moves last (priority \u2212{PRIORITY}).": "Casi siempre actúa al final (prioridad −{PRIORITY}).", // NEEDS QC
	"Fails if current HP is {HP}.": "Falla si los PS actuales son {HP}.", // NEEDS QC
	"KOs yourself if current HP is exactly {HP}.": "Debilita al usuario si los PS actuales son exactamente {HP}.", // NEEDS QC
	"(Transformed into {SPECIES})": "(Transformado en {SPECIES})", // NEEDS QC
	"(Changed forme: {SPECIES})": "(Cambio de forma: {SPECIES})", // NEEDS QC
	"Possible Illusion #{NUMBER}": "Posible Ilusión n.º {NUMBER}", // NEEDS QC
	"({HP}/{MAXHP} pixels)": "({HP}/{MAXHP} píxeles)", // NEEDS QC
	"Would take if ability removed: {PERCENT}%": "Daño sin la habilidad: {PERCENT}%", // NEEDS QC
	"Next damage: {PERCENT}%": "Próximo daño: {PERCENT}%", // NEEDS QC
	"Turns asleep: {NUMBER}": "Turnos dormido: {NUMBER}", // NEEDS QC
	"(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.)": "(Más de 4 movimientos suele indicar la Ilusión de Zoroark o Zorua.)", // NEEDS QC
	"(Pressure is not visible in Gen 3, so in certain situations, the exact amount of PP used may be unknown.)": "(Presión no es visible en la 3.ª generación, por lo que los PP usados pueden no conocerse con exactitud.)", // NEEDS QC
	"(Your opponent has two indistinguishable Pokémon, making it impossible for you to tell which one has which moves/ability/item.)": "(El rival tiene dos Pokémon indistinguibles, por lo que es imposible saber cuál tiene qué movimientos, habilidad y objeto.)", // NEEDS QC
	"(no conditions)": "(sin condiciones)", // NEEDS QC
	"({NUMBER} turn)": "({NUMBER} turno)", // NEEDS QC
	"({NUMBER} turns)": "({NUMBER} turnos)", // NEEDS QC
	"(After stat modifiers:)": "(Tras modificadores de características:)", // NEEDS QC
	"Calls {MOVE}": "Invoca {MOVE}", // NEEDS QC
	"(base: {VALUE})": "(base: {VALUE})", // NEEDS QC
	"({LOW} to {HIGH})": "({LOW} a {HIGH})", // NEEDS QC
	"(revealed)": "(revelado)", // NEEDS QC
	"{LOW} to {HIGH}": "{LOW} a {HIGH}", // NEEDS QC
	"(before stat stage changes)": "(antes de cambios de características)", // NEEDS QC
	"(before external modifiers)": "(antes de modificadores externos)", // NEEDS QC
	"<strong>{EFFECT}</strong> vs. {POKEMON}": "<strong>{EFFECT}</strong> contra {POKEMON}", // NEEDS QC
	"Base power vs. {POKEMON}": "Potencia contra {POKEMON}", // NEEDS QC
	" or ": " o ", // NEEDS QC

	// #endregion Battle
};
