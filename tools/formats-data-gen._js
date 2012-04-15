// Run this with streamline (_node) like so:
//  _node formats-data-gen._js > ../formats-data.js
//      or
//  ../node_modules/.bin/_node formats-data-gen._js > ../formats-data.js

var customPokemonPath = "../data/custom-pokemon.json";
var viableMovesPath = "../data/viable-moves.txt";

var fs = require("fs");
var getSmogonDex = require("./get-smogondex._js").getSmogonDex;

function main(argv, _)
{
	var viableMoves = getViableMoves();
	var smogonDex = getSmogonDex(_);

	console.warn("Starting to output.");
	writeLine("exports.BattleFormatsData =");
	writeLine("{", 1);
	console.warn("Outputting custom pokemon.");
	outputCustomPokemon();
	console.warn("Outputting real pokemon.");
	for (var s in smogonDex)
	{
		var pokemon =
		{
			id: s,
			tier: smogonDex[s].tier,
			viable: s in viableMoves
		};
		if (pokemon.viable)
			pokemon.viablemoves = viableMoves[s];
		outputPokemon(pokemon);
	}
	writeLine("};", -1);
	console.warn("Finished outputting.");
}

function getViableMoves()
{
	var result = new Object();
	var lines = fs.readFileSync(viableMovesPath).toString().split("\n");
	for (var l = 0; l < lines.length; ++l)
	{
		var tmp = lines[l].split(":");
		if (tmp.length !== 2)
			continue;
		var pokemon = tmp[0].toLowerCase().replace(/[^a-z0-9]+/g, "");
		var viableMoves = tmp[1].replace(/,\s*,/g, ",").split(",");
		if (!pokemon || viableMoves.length <= 1)
			continue;
		result[pokemon] = new Object();
		for (var v = 0; v < viableMoves.length; ++v)
		{
			var viableMove = viableMoves[v].trim();
			result[pokemon][viableMove.toLowerCase().replace(/[^a-z0-9]+/g, "")] = viableMove;
		}
	}
	return result;
}

function outputCustomPokemon()
{
	var customPokemon = JSON.parse(require("fs").readFileSync(customPokemonPath).toString());
	for (var c = 0; c < customPokemon.length; ++c)
		outputPokemon(customPokemon[c]);
}

function outputPokemon(pokemon)
{
	writeLine(pokemon.id + ":");
	writeLine("{", 1);
	writeLine("tier: " + JSON.stringify(pokemon.tier) + ",");
	if (pokemon.viable)
	{
		writeLine("viable: true,");
		writeLine("viablemoves:");
		writeLine("{", 1);
		for (var v in pokemon.viablemoves)
			writeLine("\"" + v + "\": " + JSON.stringify(pokemon.viablemoves[v]) + ",");
		writeLine("},", -1);
	}
	if (pokemon.isNonstandard)
		writeLine("isNonstandard: true,");
	writeLine("},", -1);
}

var currentIndentLevel = 0;
function writeLine(line, indent)
{
	if (!indent || typeof indent !== "number")
		indent = 0;

	var nextIndentLevel = currentIndentLevel + indent;
	if (nextIndentLevel < 0)
		nextIndentLevel = 0;

	if (indent < 0)
		for (var indentLevel = nextIndentLevel; indentLevel > 0; --indentLevel)
			process.stdout.write("\t");
	else
		for (; currentIndentLevel > 0; --currentIndentLevel)
			process.stdout.write("\t");

	process.stdout.write(line);
	process.stdout.write("\n");
	currentIndentLevel = nextIndentLevel;
}

main(process.argv, _);
