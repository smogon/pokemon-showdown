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
			if (eventPokemon.nature === "Na�ve") eventPokemon.nature = "Naive";
			eventPokemon.abilities = serebiiEventPokemon.abilities;
			eventPokemon.moves = serebiiEventPokemon.moves;
			
			if (eventPokemon.gender === "M/F") delete eventPokemon.gender;
			if (eventPokemon.nature === "Any") delete eventPokemon.nature;

			result.eventPokemon.push(eventPokemon);
		}
	}

	// Any modifications goes here
	if (releasedDreamWorldPokemon[result.speciesid]) {
		result.dreamWorldRelease = true;
		if (releasedDreamWorldPokemon[result.speciesid] === "M") result.maleOnlyDreamWorld = true;
	}
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
	if (pokemon.dreamWorldRelease) {
		writeLine("dreamWorldRelease: true,");
	}
	if (pokemon.maleOnlyDreamWorld) {
		writeLine("maleOnlyDreamWorld: true,");
	}
	if (pokemon.isNonstandard) {
		writeLine("isNonstandard: true,");
	}
	if (pokemon.requiredItem) {
		writeLine("requiredItem: " + JSON.stringify(pokemon.requiredItem) + ",");
	}
	if (pokemon.eventPokemon) {
		writeLine("eventPokemon: [", 1);
		for (var e = 0; e < pokemon.eventPokemon.length; ++e) {
			writeLine(JSON.stringify(pokemon.eventPokemon[e]) + (e + 1 === pokemon.eventPokemon.length ? "" : ","));
		}
		writeLine("],", -1);
	}
	writeLine("tier: " + JSON.stringify(pokemon.tier));
	writeLine("}" + (isNotNeedFinalNewline ? "" : ","), -1);
}

var releasedDreamWorldPokemon = {
	"abra": "M/F",
	"absol": "M/F",
	"aerodactyl": "M/F",
	"alakazam": "M/F",
	"altaria": "M/F",
	"ampharos": "M/F",
	"anorith": "M/F",
	"arcanine": "M/F",
	"ariados": "M/F",
	"armaldo": "M/F",
	"azumarill": "M/F",
	"azurill": "M/F",
	"bagon": "M/F",
	"banette": "M/F",
	"barboach": "M/F",
	"beldum": "M/F",
	"bellossom": "M/F",
	"bellsprout": "M/F",
	"bibarel": "M/F",
	"bidoof": "M/F",
	"blastoise": "M",
	"blaziken": "M",
	"bonsly": "M/F",
	"bronzong": "M/F",
	"bronzor": "M/F",
	"buizel": "M/F",
	"bulbasaur": "M",
	"buneary": "M/F",
	"burmy": "M/F",
	"butterfree": "M/F",
	"cacnea": "M/F",
	"cacturne": "M/F",
	"camerupt": "M/F",
	"carvanha": "M/F",
	"castform": "M/F",
	"caterpie": "M/F",
	"charizard": "M",
	"charmander": "M",
	"charmeleon": "M",
	"chatot": "M/F",
	"chimchar": "M",
	"chimecho": "M/F",
	"chinchou": "M/F",
	"chingling": "M/F",
	"clamperl": "M/F",
	"clefable": "M/F",
	"clefairy": "M/F",
	"cleffa": "M/F",
	"cloyster": "M/F",
	"combusken": "M",
	"corphish": "M/F",
	"corsola": "M/F",
	"cradily": "M/F",
	"crawdaunt": "M/F",
	"croagunk": "M",
	"crobat": "M/F",
	"darmanitan": "M/F",
	"darumaka": "M/F",
	"delcatty": "M/F",
	"delibird": "M/F",
	"dewgong": "M/F",
	"dodrio": "M/F",
	"doduo": "M/F",
	"donphan": "M/F",
	"dragonair": "M/F",
	"dragonite": "M/F",
	"drapion": "M/F",
	"dratini": "M/F",
	"drifblim": "M/F",
	"drifloon": "M/F",
	"drowzee": "M/F",
	"dusclops": "M/F",
	"dusknoir": "M/F",
	"duskull": "M/F",
	"eevee": "M/F",
	"electabuzz": "M/F",
	"electivire": "M/F",
	"electrike": "M/F",
	"elekid": "M/F",
	"empoleon": "M",
	"espeon": "M/F",
	"exeggcute": "M/F",
	"exeggutor": "M/F",
	"farfetchd": "M/F",
	"fearow": "M/F",
	"feebas": "M/F",
	"finneon": "M/F",
	"flaaffy": "M/F",
	"flareon": "M/F",
	"floatzel": "M/F",
	"flygon": "M/F",
	"furret": "M/F",
	"gallade": "M/F",
	"gardevoir": "M/F",
	"gastly": "M/F",
	"gastrodon": "M/F",
	"gastrodoneast": "M/F",
	"gengar": "M/F",
	"glaceon": "M/F",
	"glameow": "M/F",
	"gligar": "M/F",
	"gliscor": "M/F",
	"gloom": "M/F",
	"golbat": "M/F",
	"goldeen": "M/F",
	"golduck": "M/F",
	"gorebyss": "M/F",
	"granbull": "M/F",
	"grotle": "M",
	"grovyle": "M",
	"growlithe": "M/F",
	"grumpig": "M/F",
	"gyarados": "M/F",
	"hariyama": "M/F",
	"haunter": "M/F",
	"hippopotas": "M/F",
	"hippowdon": "M/F",
	"hitmonchan": "M",
	"hitmonlee": "M",
	"hitmontop": "M",
	"honchkrow": "M/F",
	"hoothoot": "M/F",
	"hoppip": "M/F",
	"horsea": "M/F",
	"houndoom": "M/F",
	"houndour": "M/F",
	"huntail": "M/F",
	"hypno": "M/F",
	"igglybuff": "M/F",
	"illumise": "M/F",
	"infernape": "M",
	"ivysaur": "M",
	"jigglypuff": "M/F",
	"jolteon": "M/F",
	"jumpluff": "M/F",
	"jynx": "M/F",
	"kabuto": "M/F",
	"kabutops": "M/F",
	"kadabra": "M/F",
	"kangaskhan": "M/F",
	"kingdra": "M/F",
	"kingler": "M/F",
	"kirlia": "M/F",
	"koffing": "M/F",
	"krabby": "M/F",
	"lanturn": "M/F",
	"lapras": "M/F",
	"larvitar": "M/F",
	"leafeon": "M/F",
	"ledian": "M/F",
	"ledyba": "M/F",
	"lickilicky": "M/F",
	"lickitung": "M/F",
	"lileep": "M/F",
	"linoone": "M/F",
	"lombre": "M/F",
	"lopunny": "M/F",
	"lotad": "M/F",
	"ludicolo": "M/F",
	"lumineon": "M/F",
	"luvdisc": "M/F",
	"luxio": "M/F",
	"luxray": "M/F",
	"machamp": "M/F",
	"machoke": "M/F",
	"machop": "M/F",
	"magby": "M/F",
	"magcargo": "M/F",
	"magikarp": "M/F",
	"magmar": "M/F",
	"magmortar": "M/F",
	"magnemite": "M/F",
	"magneton": "M/F",
	"magnezone": "M/F",
	"makuhita": "M/F",
	"mamoswine": "M",
	"manectric": "M/F",
	"mankey": "M/F",
	"mantine": "M/F",
	"mantyke": "M/F",
	"mareep": "M/F",
	"marill": "M/F",
	"marshtomp": "M",
	"masquerain": "M/F",
	"mawile": "M/F",
	"medicham": "M/F",
	"meditite": "M/F",
	"meowth": "M/F",
	"metagross": "M/F",
	"metang": "M/F",
	"metapod": "M/F",
	"mightyena": "M/F",
	"milotic": "M/F",
	"miltank": "M/F",
	"mimejr": "M/F",
	"misdreavus": "M/F",
	"mismagius": "M/F",
	"monferno": "M",
	"mothim": "M/F",
	"mrmime": "M/F",
	"mudkip": "M",
	"munna": "M/F",
	"murkrow": "M/F",
	"musharna": "M/F",
	"natu": "M/F",
	"necturna": "M/F",
	"nidoking": "M/F",
	"nidoqueen": "M/F",
	"nidoranf": "M/F",
	"nidoranm": "M/F",
	"nidorina": "M/F",
	"nidorino": "M/F",
	"ninetales": "M/F",
	"noctowl": "M/F",
	"numel": "M/F",
	"octillery": "M/F",
	"oddish": "M/F",
	"omanyte": "M/F",
	"omastar": "M/F",
	"pachirisu": "M/F",
	"pelipper": "M/F",
	"persian": "M/F",
	"phanpy": "M/F",
	"pichu": "M/F",
	"pidgeot": "M/F",
	"pidgeotto": "M/F",
	"pidgey": "M/F",
	"pikachu": "M/F",
	"piplup": "M",
	"politoed": "M/F",
	"poliwag": "M/F",
	"poliwhirl": "M/F",
	"poliwrath": "M/F",
	"ponyta": "M/F",
	"poochyena": "M/F",
	"primeape": "M/F",
	"prinplup": "M",
	"psyduck": "M/F",
	"pupitar": "M/F",
	"purugly": "M/F",
	"quagsire": "M/F",
	"qwilfish": "M/F",
	"raichu": "M/F",
	"ralts": "M/F",
	"rapidash": "M/F",
	"raticate": "M/F",
	"rattata": "M/F",
	"relicanth": "M/F",
	"remoraid": "M/F",
	"rhydon": "M/F",
	"rhyhorn": "M/F",
	"rhyperior": "M/F",
	"rotom": "M/F",
	"sableye": "M/F",
	"salamence": "M/F",
	"sceptile": "M",
	"scizor": "M/F",
	"scyther": "M/F",
	"seadra": "M/F",
	"seaking": "M/F",
	"seel": "M/F",
	"sentret": "M/F",
	"sharpedo": "M/F",
	"shelgon": "M/F",
	"shellder": "M/F",
	"shellos": "M/F",
	"shelloseast": "M/F",
	"shinx": "M/F",
	"shuppet": "M/F",
	"skarmory": "M/F",
	"skiploom": "M/F",
	"skitty": "M/F",
	"skorupi": "M/F",
	"skuntank": "M/F",
	"slowbro": "M/F",
	"slowking": "M/F",
	"slowpoke": "M/F",
	"slugma": "M/F",
	"smeargle": "M/F",
	"smoochum": "M/F",
	"snubbull": "M/F",
	"spearow": "M/F",
	"spinarak": "M/F",
	"spinda": "M/F",
	"spiritomb": "M/F",
	"spoink": "M/F",
	"squirtle": "M",
	"stantler": "M/F",
	"staraptor": "M/F",
	"staravia": "M/F",
	"starly": "M/F",
	"stunky": "M/F",
	"sudowoodo": "M/F",
	"sunflora": "M/F",
	"sunkern": "M/F",
	"surskit": "M/F",
	"swablu": "M/F",
	"swampert": "M",
	"swellow": "M/F",
	"taillow": "M/F",
	"tangela": "M/F",
	"tangrowth": "M/F",
	"tauros": "M/F",
	"teddiursa": "M/F",
	"tentacool": "M/F",
	"tentacruel": "M/F",
	"togekiss": "M",
	"tomohawk": "M/F",
	"torchic": "M",
	"torkoal": "M/F",
	"torterra": "M",
	"toxicroak": "M",
	"trapinch": "M/F",
	"treecko": "M",
	"tropius": "M/F",
	"turtwig": "M",
	"tyranitar": "M/F",
	"tyrogue": "M",
	"umbreon": "M/F",
	"ursaring": "M/F",
	"vaporeon": "M/F",
	"venusaur": "M",
	"vibrava": "M/F",
	"victreebel": "M/F",
	"vileplume": "M/F",
	"volbeat": "M/F",
	"vulpix": "M/F",
	"wailmer": "M/F",
	"wailord": "M/F",
	"wartortle": "M",
	"weepinbell": "M/F",
	"weezing": "M/F",
	"whiscash": "M/F",
	"wigglytuff": "M/F",
	"wingull": "M/F",
	"wobbuffet": "M/F",
	"wooper": "M/F",
	"wormadam": "M/F",
	"wynaut": "M/F",
	"xatu": "M/F",
	"yanma": "M/F",
	"yanmega": "M/F",
	"zigzagoon": "M/F",
	"zubat": "M/F",
};

main(process.argv, _);
