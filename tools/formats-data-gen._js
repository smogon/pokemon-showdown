// Run this with streamline (_node) like so:
//  _node formats-data-gen._js > ../formats-data.js
//      or
//  ../node_modules/.bin/_node formats-data-gen._js > ../formats-data.js

var customPokemonPath = "../data/custom-pokemon.json";
var viableMovesPath = "../data/viable-moves.txt";

var fs = require("fs");
var getSmogonDex = require("./get-smogondex._js").getSmogonDex;
var miscFunctions = require("./misc.js");
writeLine = miscFunctions.writeLine;
ObjectIsLastKey = miscFunctions.ObjectIsLastKey;
toId = miscFunctions.toId;

function main(argv, _) {
	var viableMoves = getViableMoves();
	var smogonDex = getSmogonDex(_);

	console.warn("Starting to output.");
	writeLine("exports.BattleFormatsData = {", 1);
	console.warn("Outputting custom pokemon.");
	outputCustomPokemon();
	console.warn("Outputting real pokemon.");
	for (var s in smogonDex) {
		var pokemon = {
			id: s,
			tier: smogonDex[s].tier,
			viable: s in viableMoves
		};
		if (pokemon.viable)
			pokemon.viablemoves = viableMoves[s];
		outputPokemon(pokemon, ObjectIsLastKey(smogonDex, s));
	}
	writeLine("};", -1);
	console.warn("Finished outputting.");
}

function getViableMoves() {
	var result = new Object();
	var lines = fs.readFileSync(viableMovesPath).toString().split("\n");
	for (var l = 0; l < lines.length; ++l) {
		var tmp = lines[l].split(":");
		if (tmp.length !== 2)
			continue;
		var pokemon = toId(tmp[0]);
		var viableMoves = tmp[1].replace(/,\s*,/g, ",").split(",");
		if (!pokemon || viableMoves.length <= 1)
			continue;
		result[pokemon] = new Object();
		for (var v = 0; v < viableMoves.length; ++v) {
			var viableMove = viableMoves[v].trim();
			result[pokemon][toId(viableMove)] = viableMove;
		}
	}
	return result;
}

function outputCustomPokemon() {
	var customPokemon = JSON.parse(require("fs").readFileSync(customPokemonPath).toString());
	for (var c = 0; c < customPokemon.length; ++c)
		outputPokemon(customPokemon[c]);
}

function outputPokemon(pokemon, isNotNeedFinalNewline) {
	writeLine(pokemon.id + ": {", 1);
	if (pokemon.viable) {
		writeLine("viable: true,");
		writeLine("viablemoves: " + JSON.stringify(pokemon.viablemoves) + ",");
	}
	if (pokemon.isNonstandard)
		writeLine("isNonstandard: true,");
	writeLine("tier: " + JSON.stringify(pokemon.tier));
	writeLine("}" + (isNotNeedFinalNewline ? "" : ","), -1);
}

main(process.argv, _);
