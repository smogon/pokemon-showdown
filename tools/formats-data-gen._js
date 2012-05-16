// Run this with streamline (_node) like so:
//  _node formats-data-gen._js > ../formats-data.js
//      or
//  ../node_modules/.bin/_node formats-data-gen._js > ../formats-data.js

var customPokemonPath = "../data/custom-pokemon.json";
var viableMovesPath = "../data/viable-moves.txt";

var fs = require("fs");
var getVeekunDatabase = require("./veekun-database._js").getVeekunDatabase;
var getSmogonDex = require("./get-smogondex._js").getSmogonDex;
var getSerebiiEventdex = require("./get-serebii-eventdex._js").getSerebiiEventdex;
var miscFunctions = require("./misc.js");
writeLine = miscFunctions.writeLine;
toId = miscFunctions.toId;
toIdForName = miscFunctions.toIdForName;

function main(argv, _) {
	var veekunDatabase = getVeekunDatabase(_);
	var viableMoves = getViableMoves();
	var smogonDex = getSmogonDex(_);
	var serebiiEventdex = getSerebiiEventdex(_);
	var languageId = veekunDatabase.getLanguageId("en", _); // Don't change the language! Bad things will happen if you do
	var formeIds = veekunDatabase.getAllFormeIds(_);

	console.warn("Starting to output.");
	writeLine("exports.BattleFormatsData = {", 1);
	console.warn("Outputting custom pokemon.");
	outputCustomPokemon();
	console.warn("Outputting real pokemon.");
	for (var f = 0; f < formeIds.length; ++f) {
		var veekunPokemon = veekunDatabase.getFormeData(formeIds[f], languageId, _, {
				name: true,
				pokedexNumbers: true
			});
		var pokemon = convertData(veekunPokemon, smogonDex, viableMoves, serebiiEventdex);
		outputPokemon(pokemon, f + 1 === formeIds.length);
	}
	writeLine("};", -1);
	console.warn("Finished outputting.");
}

function getViableMoves() {
	var result = new Object();
	var lines = fs.readFileSync(viableMovesPath).toString().split("\n");
	for (var l = 0; l < lines.length; ++l) {
		var tmp = lines[l].split(":");
		if (tmp.length !== 2) continue;
		var pokemon = toId(tmp[0]);
		var viableMoves = tmp[1].replace(/,\s*,/g, ",").split(",");
		if (!pokemon || viableMoves.length <= 1) continue;
		result[pokemon] = new Object();
		for (var v = 0; v < viableMoves.length; ++v) {
			var viableMove = viableMoves[v].trim();
			result[pokemon][toId(viableMove)] = 1;
		}
	}
	return result;
}

function outputCustomPokemon() {
	var customPokemon = JSON.parse(require("fs").readFileSync(customPokemonPath).toString());
	for (var c = 0; c < customPokemon.length; ++c) {
		outputPokemon(customPokemon[c]);
	}
}

function convertData(veekunPokemon, smogonDex, viableMoves, serebiiEventdex) {
	var result = new Object();
	result.speciesid = toIdForName(veekunPokemon.combinedName, veekunPokemon.forme);
	if (!(result.speciesid in smogonDex)) {
		console.warn("Warning: " + result.speciesid + " not in smogondex.");
		result.tier = "";
	}
	else
		result.tier = smogonDex[result.speciesid].tier;

	if (result.speciesid in viableMoves) result.viableMoves = viableMoves[result.speciesid];

	if (veekunPokemon.nationalPokedexNumber in serebiiEventdex) {
		result.eventPokemon = new Array();
		for (var e = 0; e < serebiiEventdex[veekunPokemon.nationalPokedexNumber].length; ++e) {
			var serebiiEventPokemon = serebiiEventdex[veekunPokemon.nationalPokedexNumber][e];
			if (serebiiEventPokemon.generation < 3) continue;

			var eventPokemon = new Object();
			eventPokemon.generation = serebiiEventPokemon.generation;
			eventPokemon.level = serebiiEventPokemon.level;
			eventPokemon.gender = serebiiEventPokemon.gender;
			eventPokemon.nature = serebiiEventPokemon.nature;
			eventPokemon.abilities = serebiiEventPokemon.abilities;
			eventPokemon.moves = serebiiEventPokemon.moves;

			result.eventPokemon.push(eventPokemon);
		}
	}

	// Any modifications goes here
	switch (result.speciesid)
	{
		case "arceusbug" :
			result.requiredItem = "Insect Plate";
			break;

		case "arceusdark" :
			result.requiredItem = "Dread Plate";
			break;

		case "arceusdragon" :
			result.requiredItem = "Draco Plate";
			break;

		case "arceuselectric" :
			result.requiredItem = "Zap Plate";
			break;

		case "arceusfighting" :
			result.requiredItem = "Fist Plate";
			break;

		case "arceusfire" :
			result.requiredItem = "Flame Plate";
			break;

		case "arceusflying" :
			result.requiredItem = "Sky Plate";
			break;

		case "arceusghost" :
			result.requiredItem = "Spooky Plate";
			break;

		case "arceusgrass" :
			result.requiredItem = "Meadow Plate";
			break;

		case "arceusground" :
			result.requiredItem = "Earth Plate";
			break;

		case "arceusice" :
			result.requiredItem = "Icicle Plate";
			break;

		case "arceuspoison" :
			result.requiredItem = "Toxic Plate";
			break;

		case "arceuspsychic" :
			result.requiredItem = "Mind Plate";
			break;

		case "arceusrock" :
			result.requiredItem = "Stone Plate";
			break;

		case "arceussteel" :
			result.requiredItem = "Iron Plate";
			break;

		case "arceuswater" :
			result.requiredItem = "Splash Plate";
			break;

		case "giratinaorigin" :
			result.requiredItem = "Griseous Orb";
			break;
	}

	return result;
}

function outputPokemon(pokemon, isNotNeedFinalNewline) {
	writeLine(pokemon.speciesid + ": {", 1);
	if (pokemon.viableMoves && (typeof pokemon.viableMoves === "object") && Object.keys(pokemon.viableMoves).length > 0) {
		writeLine("viableMoves: " + JSON.stringify(pokemon.viableMoves) + ",");
	}
	if (pokemon.isNonstandard) {
		writeLine("isNonstandard: true,");
	}
	if (pokemon.eventPokemon) {
		writeLine("eventPokemon: [", 1);
		for (var e = 0; e < pokemon.eventPokemon.length; ++e) {
			writeLine(JSON.stringify(pokemon.eventPokemon[e]) + (e + 1 === pokemon.eventPokemon.length ? "" : ","));
		}
		writeLine("],", -1);
	}
	if (pokemon.requiredItem) {
		writeLine("requiredItem: " + JSON.stringify(pokemon.requiredItem) + ",");
	}
	writeLine("tier: " + JSON.stringify(pokemon.tier));
	writeLine("}" + (isNotNeedFinalNewline ? "" : ","), -1);
}

main(process.argv, _);
