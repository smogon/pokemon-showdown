const Dex = require('@pkmn/dex').Dex;
const Generations = require('@pkmn/data').Generations;
const gens = new Generations(Dex);
const PokedexGen3 = require('./pokedex_gen3.js');
const Pokedex = require('./pokedex.js');
const Learnsets = require('./learnsets.js');
const LearnsetsJSON = require('./learnsets.json');
const Moves = require('./moves_revamp.js');
const FormatsData = require('./formats-data.js');
var MonList = [
	"altariamega",
	"ampharosmega",
	"annihilape",
	"cresselia",
	"decidueye",
	"dhelmise",
	"electivire",
	"emboar",
	"empoleon",
	"froslass",
	"glaliemega",
	"gliscor",
	"guzzlord",
	"gyaradosmega",
	"heracrossmega",
	"houndoommega",
	"hydreigon",
	"ironthorns",
	"irontreads",
	"kangaskhanmega",
	"luxray",
	"magmortar",
	"magnezone",
	"mamoswine",
	"ninetalesalola",
	"pidgeotmega",
	"ragingbolt",
	"regidrago",
	"rotomfrost",
	"rotomheat",
	"rotommow",
	"rotomwash",
	"sandyshocks",
	"sharpedomega",
	"steelixmega",
	"tangrowth",
	"tapufini",
	"tinglu",
	"togekiss",
	"tyrantrum",
	"ursalunabloodmoon",
	"victini",
	"weezinggalar",
	"wochien",
	"zapdosgalar",	
]
function print(message) {
	return console.log(message);
}
for (const mon in PokedexGen3) {
	MonList.push(mon);
}
MonList.sort();
var PokedexPrint = 'export const Pokedex: {[speciesid: string]: ModdedSpeciesData} = {\n';
var LearnsetsPrint = 'export const Learnsets: {[speciesid: string]: LearnsetData} = {\n';
var FormatsDataPrint = 'export const FormatsData: {[k: string]: ModdedSpeciesFormatsData} = {\n';
for (const mon of MonList) {
	if (!LearnsetsJSON['9'][mon]) continue;
	if (!LearnsetsJSON['9'][mon]['learnset']) continue;
	PokedexPrint += mon + ': ' + JSON.stringify(Pokedex[mon], null, '\t') + ',\n';
	LearnsetsPrint += mon + ': ' + JSON.stringify(Learnsets[mon], null, '\t').replace(']\n	}\n}', '],\n');
	for (const move in Moves) {
		if (Learnsets[mon]['learnset'][move]) continue;
		if (LearnsetsJSON['9'][mon]['learnset'][move]) LearnsetsPrint += '\t\t' + move + ': ["3L1"],\n';
	}
	LearnsetsPrint += '\t},\n},\n'
	FormatsDataPrint += mon + ': ' + JSON.stringify(FormatsData[mon], null, '\t') + ',\n';
}
print(LearnsetsPrint);