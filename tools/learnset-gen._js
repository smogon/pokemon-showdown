// Run this with streamline (_node) like so:
//  _node learnset-gen._js > ../learnset.js
//      or
//  ../node_modules/.bin/_node learnset-gen._js > ../learnset.js

var customPokemonPath = "../data/custom-pokemon.json";

var assert = require("assert").ok;
var getVeekunDatabase = require("./veekun-database._js").getVeekunDatabase;
var miscFunctions = require("./misc.js");
writeLine = miscFunctions.writeLine;
ObjectIsLastKey = miscFunctions.ObjectIsLastKey;
toId = miscFunctions.toId;
toIdForForme = miscFunctions.toIdForForme;
toIdForName = miscFunctions.toIdForName;

function main(argv, _) {
	var veekunDatabase = getVeekunDatabase(_);
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
				learnset: true,
			});
		var convertedPokemon = convertVeekunPokemon(veekunPokemon, veekunDatabase, _);
		outputPokemon(convertedPokemon, f === formeIds.length - 1);
		if ((f + 1) % 50 === 0)
			console.warn("Finished outputting " + (f + 1) + "/" + formeIds.length + " pokemon.");
	}
	writeLine("};", -1);
	console.warn("Finished outputting.");
	veekunDatabase.close(_);
}

function outputCustomPokemon() {
	var customPokemon = JSON.parse(require("fs").readFileSync(customPokemonPath).toString());
	for (var c = 0; c < customPokemon.length; ++c)
		outputPokemon(customPokemon[c]);
}

function convertVeekunPokemon(pokemon, veekunDatabase, _) {
	var result = new Object();
	result.id = toIdForName(pokemon.combinedName, pokemon.forme);
	
	result.learnset = new Object();
	for (var g in pokemon.learnset) {
		// g is the generation
		if (g < 3)
			continue;
		for (var l = 0; l < pokemon.learnset[g].length; ++l) {
			var move = pokemon.learnset[g][l];
			move.name = toId(move.name);
			if (!result.learnset[move.name])
				result.learnset[move.name] = new Array();
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
				
				default :
					convertedMethodOfLearning += "S";
					break;
			}
			if (result.learnset[move.name].indexOf(convertedMethodOfLearning) === -1)
				result.learnset[move.name].push(convertedMethodOfLearning);
		}
	}

	return result;
}

function outputPokemon(pokemon, isNotNeedFinalNewline) {
	writeLine(pokemon.id + ": {", 1);
	writeLine("learnset: {", 1);
	for (var l in pokemon.learnset)
		writeLine(l + ": " + JSON.stringify(pokemon.learnset[l]) + (ObjectIsLastKey(pokemon.learnset, l) ? "" : ","));
	writeLine("}", -1);
	writeLine("}" + (isNotNeedFinalNewline ? "" : ","), -1);
}

main(process.argv);
