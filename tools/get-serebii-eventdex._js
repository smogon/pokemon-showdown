var url = require("url");
var request = require("request");
var libxml = require("libxmljs");
var toId = require("./misc.js").toId;

exports.getSerebiiEventdex = function(_) {
	console.warn("Downloading Serebii Eventdex.");
	var indexUrl = "http://www.serebii.net/events/";

	// Get a list of all the years
	var indexHtml = libxml.parseHtmlString(request(indexUrl, _).body);
	var yearsHtml = indexHtml.find("//form[@name='yra']//select/option");
	var yearsHref = new Array();
	for (var y = 1; y < yearsHtml.length; ++y) {
		yearsHref.push(yearsHtml[y].attr("value").value());
	}

	// Get the data for each of the years
	var results = new Object();
	for (var y = 0; y < yearsHref.length; ++y) {
		var yearUrl = url.resolve(indexUrl, yearsHref[y]);
		var yearHtml = libxml.parseHtmlString(request(yearUrl, _).body);

		var entries = yearHtml.find("//table[@class='eventpoke']");
		for (var e = 0; e < entries.length; ++e) {
			try
			{
				// The first row contains all the information we need
				var columnsHtml = entries[e].find("./tr[1]/td");

				// The first column contains the generation, the pokemon, it's level and it's gender
				var gendersHtml = columnsHtml[0].find("./table/tr[1]//font");
				var gender = "";
				if (gendersHtml.length === 0) {
					gender = "N/A";
				} else if (gendersHtml.length === 1) {
					if (gendersHtml[0].text() === "♂") {
						gender = "M";
					} else {
						gender = "F";
					}
				} else {
					gender = "M/F";
				}

				var nationalPokedexNumberAndForme = columnsHtml[0].get("./table/tr[2]//img/@src").text().replace(/^.*?([0-9]+)(-([a-z]+))?\.png$/, "$1,$3").split(",");
				var nationalPokedexNumber = parseInt(nationalPokedexNumberAndForme[0], 10);
				var formeLetter = nationalPokedexNumberAndForme[1];
				var generationLetters = columnsHtml[0].get("./table/tr[2]//a/@href").text().replace(/^\/pokedex-([a-z]+)\/[0-9]+\.shtml$/, "$1");
				var level = parseInt(columnsHtml[0].get("./table/tr[3]").text().replace(/Level ([0-9]+)/, "$1"), 10);

				// Fix the forme letter
				if ((formeLetter === 'm' && gender === "M") ||
					(formeLetter === 'f' && gender === "F")) {
					formeLetter = '';
				}
				if (formeLetter === 'l' && nationalPokedexNumber === 492) { // Shaymin
					formeLetter = '';
				}

				// Convert the generation
				var generation;
				switch (generationLetters) {
					case "rb" :
						generation = 1;
						break;

					case "gs" :
						generation = 2;
						break;

					case "rs" :
						generation = 3;
						break;

					case "dp" :
						generation = 4;
						break;

					case "bw" :
						generation = 5;
						break;

					default :
						console.warn("Warning: Unknown generation letters \"" + generationLetters + "\".");
						generation = 999;
						break;
				}

				// The second column contains the ability
				var abilitiesHtml = columnsHtml[1].find("./table/tr[3]/td[2]/a");
				var abilities = new Array();
				for (var a = 0; a < abilitiesHtml.length; ++a) {
					abilities.push(toId(abilitiesHtml[a].text()));
				}

				// The third column contains the nature
				var nature = columnsHtml[2].childNodes()[0].text().replace(/^(.*?) Nature\.$/, "$1");
				if (nature === "??") {
					// Change unknown nature data to any nature
					nature = "Any";
				}

				// The fourth columns contains the moves
				var movesHtml = columnsHtml[3].find("./table/tr");
				var moves = new Array();
				for (var m = 0; m < movesHtml.length; ++m) {
					if (movesHtml[m].text().trim().length > 0) {
						moves.push(toId(movesHtml[m].text()));
					}
				}

				// Combine the results
				var result = {
						generation: generation,
						level: level,
						formeLetter: formeLetter.toUpperCase(),
						gender: gender,
						abilities: abilities,
						nature: nature,
						moves: moves
					};

				// Check if there is already an entry for this pokemon
				if (!results[nationalPokedexNumber]) {
					results[nationalPokedexNumber] = new Array();
				}
				var isDuplicate = false;
				for (var r = 0; r < results[nationalPokedexNumber].length; ++r) {
					if (JSON.stringify(results[nationalPokedexNumber][r]) === JSON.stringify(result)) {
						isDuplicate = true;
						break;
					}
				}
				if (!isDuplicate) {
					results[nationalPokedexNumber].push(result);
				}
			}
			catch (error)
			{
				console.warn("Could not parse event pokemon #" + e + " at " + yearsHref[y] + ":");
				console.warn(error);
			}
		}
	}
	return results;
}
