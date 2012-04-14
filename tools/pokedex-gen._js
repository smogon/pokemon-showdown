// Run this with streamline (_node) like so:
//  _node pokedex-gen._js > ../pokedex.js
//      or
//  ../node_modules/.bin/_node pokedex-gen._js > ../pokedex.js

var customPokemonPath = "../data/custom-pokemon.json";

var assert = require("assert").ok;
var getVeekunDatabase = require("./veekun-database._js").getVeekunDatabase;

function main(argv, _)
{
	var veekunDatabase = getVeekunDatabase(_);
	var languageId = veekunDatabase.getLanguageId("en", _); // Don't change the language! Bad things will happen if you do
	var formeIds = veekunDatabase.getAllFormeIds(_);
	
	console.warn("Starting to output.");
	writeLine("exports.BattlePokedex =");
	writeLine("{", 1);
	console.warn("Outputting custom pokemon.");
	outputCustomPokemon();
	console.warn("Outputting real pokemon.");
	for (var f = 0; f < formeIds.length; ++f)
	{
		var veekunPokemon = veekunDatabase.getFormeData(formeIds[f], languageId, _);
		var convertedPokemon = convertVeekunPokemon(veekunPokemon, veekunDatabase, _);
		outputPokemon(convertedPokemon);
		if ((f + 1) % 50 === 0)
			console.warn("Finished outputting " + (f + 1) + " pokemon.");
	}
	writeLine("};", -1);
	console.warn("Finished outputting.");
	veekunDatabase.close(_);
}

function outputCustomPokemon()
{
	var customPokemon = JSON.parse(require("fs").readFileSync(customPokemonPath).toString());
	for (var c = 0; c < customPokemon.length; ++c)
		outputPokemon(customPokemon[c]);
}

function convertVeekunPokemon(pokemon, veekunDatabase, _)
{
	function toIdForForme(combinedName, forme)
	{
		switch (combinedName)
		{
			case "Unown-!" :
				return "em";

			case "Unown-?" :
				return "qm";

			case "Arceus-???" :
				return "unknown";

			case "Basculin-Blue-Striped" :
				return "blue";
		}
		return toId(forme);
	}
	function toIdForName(combinedName, forme)
	{
		var result = toId(combinedName.replace("♂", "M").replace("♀", "F"));
		var formeId = toIdForForme(combinedName, forme);
		if (result.indexOf(formeId) === -1)
			if (toId(forme).length === 0)
				result += formeId;
			else
				if(result.indexOf(toId(forme)) !== -1)
					result.replace(toId(forme), formeId);
		return result;
	}

	var result = new Object();

	// Copy some stuff
	result.num = pokemon.nationalPokedexNumber;
	result.name = pokemon.combinedName;
	result.species = result.name;
	result.basespecies = pokemon.name;
	result.forme = pokemon.forme;
	result.isDefaultForme = pokemon.isDefaultForme;
	result.isBattleOnlyForme = pokemon.isBattleOnlyForme;
	result.genderRatio = pokemon.genderRatio;
	result.heightm = pokemon.heightm;
	result.weightkg = pokemon.masskg;
	result.colour = pokemon.colour;

	// Create some ids
	result.id = toIdForName(result.name, pokemon.forme);
	result.speciesid = result.id;
	if (result.isDefaultForme)
		result.spriteid = result.id;
	else
	{
		result.spriteid = toId(result.name.replace("-" + pokemon.forme, ""));
		result.spriteid += "-";
		result.spriteid += toIdForForme(result.name, pokemon.forme);
	}
	result.prevo = toId(pokemon.prevo);

	// Copy the type, modifing Arceus' types to the PS! style
	result.types = pokemon.types;
	if (pokemon.nationalPokedexNumber === 493)
		result.types = [pokemon.forme];

	// Convert the base stats to PS! format
	result.baseStats = new Object();
	for (var b in pokemon.baseStats)
	{
		var identifier = "";
		switch (b)
		{
			case "HP" :
				identifier = "hp";
				break;

			case "Attack" :
				identifier = "atk";
				break;

			case "Defense" :
				identifier = "def";
				break;

			case "Special Attack" :
				identifier = "spa";
				break;

			case "Special Defense" :
				identifier = "spd";
				break;

			case "Speed" :
				identifier = "spe";
				break;

			default :
				throw new Error("Unknown stat name " + b);
		}
		result.baseStats[identifier] = pokemon.baseStats[b];
	}

	// Convert the abilities to PS! format
	result.abilities = new Object();
	var abilitiesCount = 0;
	var dwAbilitiesCount = 0;
	for (var a = 0; a < pokemon.abilities.length; ++a)
		if (pokemon.abilities[a].isDreamWorld)
		{
			if (dwAbilitiesCount === 0)
				result.abilities["DW"] = pokemon.abilities[a].name;
			else
				result.abilities["DW" + dwAbilitiesCount] = pokemon.abilities[a].name;
			++dwAbilitiesCount;
		}
		else
		{
			result.abilities[abilitiesCount] = pokemon.abilities[a].name;
			++abilitiesCount;
		}

	// Convert the evolutions to ids
	result.evos = new Array();
	for (var e = 0; e < pokemon.evos.length; ++e)
		result.evos.push(toIdForName(pokemon.evos[e].combinedName, pokemon.evos[e].forme));

	// Convert the other formes to ids
	result.otherFormes = new Array();
	for (var f = 0; f < pokemon.otherFormes.length; ++f)
		result.otherFormes.push(toIdForName(pokemon.otherFormes[f].combinedName, pokemon.otherFormes[f].forme));

	return result;
}

function outputPokemon(pokemon)
{
	// Work out the formeletter
	var formeletter = pokemon.forme && !pokemon.isDefaultForme ? pokemon.forme[0] : '';
	switch (pokemon.id)
	{
		case "rotommow" :
			formeletter = 'C';
			break;

		case "rotomfan" :
			formeletter = 'S';
			break;

		case "wormadamsandy" :
			formeletter = 'G';
			break;

		case "wormadamtrash" :
			formeletter = 'S';
			break;
	}

	// Work out gender exclusiveness
	var gender = 'N';
	if (pokemon.genderRatio.m > 0 && pokemon.genderRatio.f > 0)
		gender = '';
	else if (pokemon.genderRatio.m > 0)
		gender = 'M';
	else if (pokemon.genderRatio.f > 0)
		gender = 'F';

	// Deduce NFE'ness
	var nfe = pokemon.evos.length > 0;

	// Start outputting!
	writeLine(pokemon.id + ":");
	writeLine("{", 1);

	writeLine("num: " + JSON.stringify(pokemon.num) + ",");
	writeLine("name: " + JSON.stringify(pokemon.name) + ",");
	writeLine("id: " + JSON.stringify(pokemon.id) + ",");
	writeLine("species: " + JSON.stringify(pokemon.species) + ",");
	writeLine("speciesid: " + JSON.stringify(pokemon.speciesid) + ",");
	writeLine("basespecies: " + JSON.stringify(pokemon.basespecies) + ",");
	writeLine("forme: " + JSON.stringify(pokemon.forme) + ",");
	writeLine("formeletter: " + JSON.stringify(formeletter) + ",");
	writeLine("spriteid: " + JSON.stringify(pokemon.spriteid) + ",");
	writeLine("types: " + JSON.stringify(pokemon.types) + ",");
	writeLine("genderRatio: " + JSON.stringify(pokemon.genderRatio) + ",");
	writeLine("gender: " + JSON.stringify(gender) + ",");

	writeLine("baseStats:");
	writeLine("{", 1);
	for (var b in pokemon.baseStats)
		writeLine(b + ": " + JSON.stringify(pokemon.baseStats[b]) + ",");
	writeLine("},", -1);

	writeLine("abilities:");
	writeLine("{", 1);
	for (var a in pokemon.abilities)
		writeLine(a + ": " + JSON.stringify(pokemon.abilities[a]) + ",");
	writeLine("},", -1);

	writeLine("heightm: " + JSON.stringify(pokemon.heightm) + ",");
	writeLine("weightkg: " + JSON.stringify(pokemon.weightkg) + ",");

	writeLine("colour: " + JSON.stringify(pokemon.colour) + ",");

	writeLine("nfe: " + JSON.stringify(nfe) + ",");
	writeLine("prevo: " + JSON.stringify(pokemon.prevo) + ",");
	writeLine("evos: " + JSON.stringify(pokemon.evos) + ",");
	writeLine("otherFormes: " + JSON.stringify(pokemon.otherFormes) + ",");
	writeLine("isDefaultForme: " + JSON.stringify(pokemon.isDefaultForme) + ",");
	//writeLine("isBattleOnlyForme: " + JSON.stringify(pokemon.isBattleOnlyForme) + ",");

	writeLine("},", -1);
}

function toId(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, ""); }

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

main(process.argv);
