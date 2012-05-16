// Run this with streamline (_node) like so:
//  _node pokedex-gen._js > ../pokedex.js
//      or
//  ../node_modules/.bin/_node pokedex-gen._js > ../pokedex.js

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
	writeLine("exports.BattlePokedex = {", 1);
	console.warn("Outputting custom pokemon.");
	outputCustomPokemon();
	console.warn("Outputting real pokemon.");
	for (var f = 0; f < formeIds.length; ++f) {
		var veekunPokemon = veekunDatabase.getFormeData(formeIds[f], languageId, _, {
				name: true,
				otherFormes: true,
				pokedexNumbers: true,
				types: true,
				baseStats: true,
				abilities: true,
				prevo: true,
				evos: true,
				eggGroups: true,
				misc: true
			});
		var convertedPokemon = convertVeekunPokemon(veekunPokemon);
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

function convertVeekunPokemon(pokemon) {
	var result = new Object();

	// Copy some stuff
	result.num = pokemon.nationalPokedexNumber;
	result.species = pokemon.combinedName.replace("♂", "M").replace("♀", "F");
	result.baseSpecies = pokemon.name.replace("♂", "M").replace("♀", "F");
	result.forme = pokemon.forme;
	result.isDefaultForme = pokemon.isDefaultForme;
	result.isBattleOnlyForme = pokemon.isBattleOnlyForme;
	result.eggGroups = pokemon.eggGroups;
	result.heightm = pokemon.heightm;
	result.weightkg = pokemon.masskg;
	result.colour = pokemon.colour;

	// Create some ids
	result.speciesid = toIdForName(result.species, pokemon.forme);
	result.prevo = toIdForName(pokemon.prevo, ""); // The prevo is always in it's normal forme

	// Copy the type, modifing Arceus' types to the PS! style
	result.types = pokemon.types;
	if (pokemon.nationalPokedexNumber === 493) {
		result.types = [pokemon.forme];
	}

	// Copy the gender ratio
	result.genderRatio = {M:pokemon.genderRatio.m, F:pokemon.genderRatio.f};

	// Convert the base stats to PS! format
	result.baseStats = new Object();
	for (var b in pokemon.baseStats) {
		var identifier = "";
		switch (b) {
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
	for (var a = 0; a < pokemon.abilities.length; ++a) {
		if (pokemon.abilities[a].isDreamWorld) {
			if (dwAbilitiesCount === 0) {
				result.abilities["DW"] = pokemon.abilities[a].name;
			} else {
				result.abilities["DW" + dwAbilitiesCount] = pokemon.abilities[a].name;
			}
			++dwAbilitiesCount;
		} else {
			result.abilities[abilitiesCount] = pokemon.abilities[a].name;
			++abilitiesCount;
		}
	}

	// Convert the evolutions to ids
	result.evos = new Array();
	for (var e = 0; e < pokemon.evos.length; ++e) {
		result.evos.push(toIdForName(pokemon.evos[e].combinedName, pokemon.evos[e].forme));
	}

	// Convert the other formes to ids
	result.otherFormes = new Array();
	for (var f = 0; f < pokemon.otherFormes.length; ++f) {
		result.otherFormes.push(toIdForName(pokemon.otherFormes[f].combinedName, pokemon.otherFormes[f].forme));
	}

	return result;
}

function outputPokemon(pokemon, isNotNeedFinalNewline) {
	// Work out the forme letter
	var formeLetter = pokemon.forme && !pokemon.isDefaultForme ? pokemon.forme[0] : '';
	switch (pokemon.speciesid) {
		case "rotommow" :
			formeLetter = 'C';
			break;

		case "rotomfan" :
			formeLetter = 'S';
			break;

		case "wormadamsandy" :
			formeLetter = 'G';
			break;

		case "wormadamtrash" :
			formeLetter = 'S';
			break;
	}

	// Work out gender exclusiveness
	var gender = 'N';
	if (pokemon.genderRatio.M > 0 && pokemon.genderRatio.F > 0) {
		gender = '';
	} else if (pokemon.genderRatio.M > 0) {
		gender = 'M';
	} else if (pokemon.genderRatio.F > 0) {
		gender = 'F';
	}

	// Start outputting!
	writeLine(pokemon.speciesid + ": {", 1);

	writeLine("num: " + JSON.stringify(pokemon.num) + ",");
	writeLine("species: " + JSON.stringify(pokemon.species) + ",");
	writeLine("speciesid: " + JSON.stringify(pokemon.speciesid) + ",");
	if (pokemon.baseSpecies && pokemon.baseSpecies !== pokemon.species) {
		writeLine("baseSpecies: " + JSON.stringify(pokemon.baseSpecies) + ",");
	}
	if (pokemon.forme) {
		writeLine("forme: " + JSON.stringify(pokemon.forme) + ",");
		writeLine("formeLetter: " + JSON.stringify(formeLetter) + ",");
	}
	writeLine("types: " + JSON.stringify(pokemon.types) + ",");
	if (pokemon.genderRatio.M !== 0.5) {
		writeLine("genderRatio: " + JSON.stringify(pokemon.genderRatio) + ",");
	}
	writeLine("gender: " + JSON.stringify(gender) + ",");

	writeLine("baseStats: {", 1);
	for (var b in pokemon.baseStats) {
		writeLine(b + ": " + JSON.stringify(pokemon.baseStats[b]) + (ObjectIsLastKey(pokemon.baseStats, b) ? "" : ","));
	}
	writeLine("},", -1);

	writeLine("abilities: {", 1);
	for (var a in pokemon.abilities) {
		writeLine(a + ": " + JSON.stringify(pokemon.abilities[a]) + (ObjectIsLastKey(pokemon.abilities, a) ? "" : ","));
	}
	writeLine("},", -1);

	writeLine("heightm: " + JSON.stringify(pokemon.heightm) + ",");
	writeLine("weightkg: " + JSON.stringify(pokemon.weightkg) + ",");
	writeLine("colour: " + JSON.stringify(pokemon.colour) + ",");

	if (pokemon.prevo) {
		writeLine("prevo: " + JSON.stringify(pokemon.prevo) + ",");
	}
	if (pokemon.evos.length > 0) {
		writeLine("evos: " + JSON.stringify(pokemon.evos) + ",");
	}
	writeLine("eggGroups: " + JSON.stringify(pokemon.eggGroups) + ",");
	if (pokemon.otherFormes.length > 0) {
		writeLine("otherFormes: " + JSON.stringify(pokemon.otherFormes) + ",");
		writeLine("isDefaultForme: " + JSON.stringify(pokemon.isDefaultForme));
	}

	writeLine("}" + (isNotNeedFinalNewline ? "" : ","), -1);
}

main(process.argv);
