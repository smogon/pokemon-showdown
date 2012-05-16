// Run this with streamline (_node) like so:
//  _node learnsets-gen._js > ../learnsets.js
//      or
//  ../node_modules/.bin/_node learnsets-gen._js > ../learnsets.js

var customPokemonPath = "../data/custom-pokemon.json";

var assert = require("assert").ok;
var getVeekunDatabase = require("./veekun-database._js").getVeekunDatabase;
var getSerebiiEventdex = require("./get-serebii-eventdex._js").getSerebiiEventdex;
var miscFunctions = require("./misc.js");
writeLine = miscFunctions.writeLine;
ObjectIsLastKey = miscFunctions.ObjectIsLastKey;
toId = miscFunctions.toId;
toIdForForme = miscFunctions.toIdForForme;
toIdForName = miscFunctions.toIdForName;

function main(argv, _) {
	var veekunDatabase = getVeekunDatabase(_);
	var serebiiEventdex = getSerebiiEventdex(_);
	var languageId = veekunDatabase.getLanguageId("en", _); // Don't change the language! Bad things will happen if you do
	var formeIds = veekunDatabase.getAllFormeIds(_);

	console.warn("Starting to output.");
	writeLine("exports.BattleLearnsets = {", 1);
	console.warn("Outputting custom pokemon.");
	outputCustomPokemon();
	console.warn("Outputting real pokemon.");
	for (var f = 0; f < formeIds.length; ++f) {
		var veekunPokemon = veekunDatabase.getFormeData(formeIds[f], languageId, _, {
				name: true,
				pokedexNumbers: true,
				learnset: true,
			});
		var convertedPokemon = convertData(veekunPokemon, serebiiEventdex);
		outputPokemon(convertedPokemon, f === formeIds.length - 1);
		if ((f + 1) % 50 === 0) {
			console.warn("Finished outputting " + (f + 1) + "/" + formeIds.length + " pokemon.");
		}
	}
	writeLine("};", -1);
	console.warn("Finished outputting.");
	veekunDatabase.close(_);
}

function outputCustomPokemon() {
	var customPokemon = JSON.parse(require("fs").readFileSync(customPokemonPath).toString());
	for (var c = 0; c < customPokemon.length; ++c) {
		outputPokemon(customPokemon[c]);
	}
}

function convertData(veekunPokemon, serebiiEventdex) {
	var result = new Object();
	result.speciesid = toIdForName(veekunPokemon.combinedName, veekunPokemon.forme);

	result.learnset = new Object();
	for (var g in veekunPokemon.learnset) {
		// g is the generation
		if (g < 3) continue;

		for (var l = 0; l < veekunPokemon.learnset[g].length; ++l) {
			var move = veekunPokemon.learnset[g][l];
			move.name = toId(move.name);
			if (!result.learnset[move.name]) {
				result.learnset[move.name] = new Array();
			}
			var convertedMethodOfLearning = g;
			switch (move.methodOfLearning) {
				case "Level up" :
					convertedMethodOfLearning += "L" + move.levelLearnt;
					break;

				case "Egg" :
				case "Volt Tackle Pichu" :
					convertedMethodOfLearning += "E";
					break;

				case "Tutor" :
				case "Rotom Form" :
					convertedMethodOfLearning += "T";
					break;

				case "Machine" :
					convertedMethodOfLearning += "M";
					break;

				case "Stadium: Surfing Pikachu" :
				case "Colosseum: Purification" :
				case "XD: Shadow" :
				case "XD: Purification" :
					convertedMethodOfLearning += "X"; // Placeholder
					break;

				default :
					console.warn("Unknown method of move learning: \"" + move.methodOfLearning + "\".");
					convertedMethodOfLearning += "?";
					break;
			}
			if (result.learnset[move.name].indexOf(convertedMethodOfLearning) === -1) {
				result.learnset[move.name].push(convertedMethodOfLearning);
			}
		}
	}

	// Event moves
	if (veekunPokemon.nationalPokedexNumber in serebiiEventdex) {
		var eventPokemon = serebiiEventdex[veekunPokemon.nationalPokedexNumber];
		for (var e = 0; e < eventPokemon.length; ++e) {
			if (eventPokemon[e].generation < 3) continue;
			for (var m = 0; m < eventPokemon[e].moves.length; ++m) {
				var move = toId(eventPokemon[e].moves[m]);
				var methodOfLearning = eventPokemon[e].generation + "S" + e;

				if (!result.learnset[move]) {
					result.learnset[move] = new Array();
				}
				result.learnset[move].push(methodOfLearning);
			}
		}
	}

	return result;
}

function outputPokemon(pokemon, isNotNeedFinalNewline) {
	writeLine(pokemon.speciesid + ": {", 1);

	// Alphabetlise the moves
	var learnsetMoves;
	if (pokemon.learnset) {
		learnsetMoves = Object.keys(pokemon.learnset).sort();
	} else {
		learnsetMoves = new Array();
	}
	writeLine("learnset: {", 1);
	for (var l = 0; l < learnsetMoves.length; ++l) {
		if (learnsetMoves[l] === "hiddenpower") {
			// Placeholders until we fully remove all the individual hidden power types
			var hiddenPowerTypes = ["bug", "dark", "dragon", "electric", "fighting", "fire", "flying", "ghost", "grass", "ground", "ice", "poison", "pyschic", "rock", "steel", "water"];
			for (var h = 0; h < hiddenPowerTypes.length; ++h) {
				writeLine(learnsetMoves[l] + hiddenPowerTypes[h] + ": " + JSON.stringify(pokemon.learnset[learnsetMoves[l]]) + ",");
			}
		}
		writeLine(learnsetMoves[l] + ": " + JSON.stringify(pokemon.learnset[learnsetMoves[l]]) + (l + 1 === learnsetMoves.length ? "" : ","));
	}
	writeLine("}", -1);

	writeLine("}" + (isNotNeedFinalNewline ? "" : ","), -1);
}

main(process.argv);
