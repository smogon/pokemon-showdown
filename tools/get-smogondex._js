var url = require("url");
var request = require("request");
var libxml = require("libxmljs");

exports.getSmogonDex = function(_) {
	console.warn("Downloading Smogon Pokedex.");
	var requestOptions = {
			uri: "http://www.smogon.com/bw/pokemon/",
			headers: { Cookie: "dexprefs=\"AQAAAA==\"" }
		};
	var smogonDexHtml = libxml.parseHtmlString(request(requestOptions, _).body);

	// Check if we are at the latest version
	var version = smogonDexHtml.get("//*[@id='content']//ul[@class='tabs']/li[last()]/*");
	if (version.name() === "a") {
		// Nope, so we get the new one
		requestOptions.uri = url.resolve(requestOptions.uri, version.attr("href").value());
		smogonDexHtml = libxml.parseHtmlString(request(requestOptions, _).body);
	}

	// Process each row
	var smogonDex = new Object();
	var rows = smogonDexHtml.find("//*[@id='content_wrapper']//tbody[1]//tr");
	for (var r = 0; r < rows.length; ++r) {
		var cols = rows[r].find("./td");

		var name = cols[0].text().toLowerCase().replace(/[^a-z0-9]+/g, "");

		var types = cols[1].text().replace(/\s+/g, " ").split("/");
		for (var t = 0; t < types.length; ++t) {
			types[t] = types[t].trim();
		}

		var tier = cols[2].text().replace(/\s+/g, " ").trim();

		var abilitiesArray = cols[3].text().replace(/\s+/g, " ").split("/");
		var abilities = new Object();
		for (var a = 0; a < abilitiesArray.length; ++a) {
			if (a !== 0 && a + 1 === abilitiesArray.length) {
				abilities["DW"] = abilitiesArray[a].trim();
			} else {
				abilities[a] = abilitiesArray[a].trim();
			}
		}

		var hp = parseInt(cols[4].text().replace(/\s+/g, " ").trim(), 10);
		var atk = parseInt(cols[5].text().replace(/\s+/g, " ").trim(), 10);
		var def = parseInt(cols[6].text().replace(/\s+/g, " ").trim(), 10);
		var spa = parseInt(cols[7].text().replace(/\s+/g, " ").trim(), 10);
		var spd = parseInt(cols[8].text().replace(/\s+/g, " ").trim(), 10);
		var spe = parseInt(cols[9].text().replace(/\s+/g, " ").trim(), 10);

		// Any modifications goes here
		switch (name) {
			case "arceusnormal" :
				name = "arceus";
				break;

			case "basculinb" :
				name = "basculinbluestriped";
				break;

			case "darmanitanz" :
				name = "darmanitanzen";
				tier = "Illegal";
				break;

			case "deoxysa" :
				name = "deoxysattack";
				break;

			case "deoxysd" :
				name = "deoxysdefense";
				break;

			case "deoxyss" :
				name = "deoxysspeed";
				break;

			case "giratinao" :
				name = "giratinaorigin";
				break;

			case "landorust" :
				name = "landorustherian";
				break;

			case "kyuremb" :
				name = "kyuremblack";
				break;

			case "kyuremw" :
				name = "kyuremwhite";
				break;

			case "meloettap" :
				name = "meloettapirouette";
				tier = "Illegal";
				break;

			case "rotomc" :
				name = "rotommow";
				break;

			case "rotomf" :
				name = "rotomfrost";
				break;

			case "rotomh" :
				name = "rotomheat";
				break;

			case "rotoms" :
				name = "rotomfan";
				break;

			case "rotomw" :
				name = "rotomwash";
				break;

			case "shaymins" :
				name = "shayminsky";
				break;

			case "thundurust" :
				name = "thundurustherian";
				break;

			case "tornadust" :
				name = "tornadustherian";
				break;

			case "wormadamg" :
				name = "wormadamsandy";
				break;

			case "wormadams" :
				name = "wormadamtrash";
				break;
		}

		smogonDex[name] = {
			types: types,
			tier: tier,
			abilities: abilities,
			baseStats: {
				hp: hp,
				atk: atk,
				def: def,
				spa: spa,
				spd: spd,
				spe: spe
			}
		};

		// Add formes not in the smogon dex
		switch (name) {
			case "arceus" :
				smogonDex["arceusunknown"] = {
						types: ["???"],
						tier: "Illegal",
						abilities: abilities,
						baseStats: {
							hp: hp,
							atk: atk,
							def: def,
							spa: spa,
							spd: spd,
							spe: spe
						}
					};
				break;

			case "burmy" :
				var burmyFormes = ["Sandy", "Trash"];
				for (var b = 0; b < burmyFormes.length; ++b) {
					smogonDex["burmy" + burmyFormes[b].toLowerCase()] = {
							types: types,
							tier: tier,
							abilities: abilities,
							baseStats: {
								hp: hp,
								atk: atk,
								def: def,
								spa: spa,
								spd: spd,
								spe: spe
							}
						};
				}
				break;


			case "castform" :
				var castformFormes = [{name: "Sunny", type: "Fire"},
									  {name: "Snowy", type: "Ice"},
									  {name: "Rainy", type: "Water"}];
				for (var c = 0; c < castformFormes.length; ++c) {
					smogonDex["castform" + castformFormes[c].name.toLowerCase()] = {
							types: [castformFormes[c].type],
							tier: tier,
							abilities: abilities,
							baseStats: {
								hp: hp,
								atk: atk,
								def: def,
								spa: spa,
								spd: spd,
								spe: spe
							}
						};
				}
				break;

			case "cherrim" :
				smogonDex["cherrimsunshine"] = {
						types: types,
						tier: tier,
						abilities: abilities,
						baseStats: {
							hp: hp,
							atk: atk,
							def: def,
							spa: spa,
							spd: spd,
							spe: spe
						}
					};
				break;

			case "genesect" :
				var genesectFormes = ["Douse", "Shock", "Burn", "Chill"];
				for (var g = 0; g < genesectFormes.length; ++g) {
					smogonDex["genesect" + genesectFormes[g].toLowerCase()] = {
							types: types,
							tier: "Illegal",
							abilities: abilities,
							baseStats: {
								hp: hp,
								atk: atk,
								def: def,
								spa: spa,
								spd: spd,
								spe: spe
							}
						};
				}
				break;

			case "pichu" :
				smogonDex["pichuspikyeared"] = {
						types: types,
						tier: tier,
						abilities: abilities,
						baseStats: {
							hp: hp,
							atk: atk,
							def: def,
							spa: spa,
							spd: spd,
							spe: spe
						}
					};
				break;

			case "shellos" :
			case "gastrodon" :
				smogonDex[name + "east"] = {
						types: types,
						tier: tier,
						abilities: abilities,
						baseStats: {
							hp: hp,
							atk: atk,
							def: def,
							spa: spa,
							spd: spd,
							spe: spe
						}
					};
				break;

			case "sawsbuck" :
			case "deerling" :
				var seasons = ["Summer", "Autumn", "Winter"];
				for (var s = 0; s < seasons.length; ++s) {
					smogonDex[name + seasons[s].toLowerCase()] = {
							types: types,
							tier: tier,
							abilities: abilities,
							baseStats: {
								hp: hp,
								atk: atk,
								def: def,
								spa: spa,
								spd: spd,
								spe: spe
							}
						};
				}
				break;

			case "keldeo" :
				smogonDex["keldeoresolute"] = {
						types: types,
						tier: tier,
						abilities: abilities,
						baseStats: {
							hp: hp,
							atk: atk,
							def: def,
							spa: spa,
							spd: spd,
							spe: spe
						}
					};
				break;

			case "unown" :
				var unownFormes = ["B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "EM", "QM"];
				for (var u = 0; u < unownFormes.length; ++u) {
					smogonDex["unown" + unownFormes[u].toLowerCase()] = {
							types: types,
							tier: tier,
							abilities: abilities,
							baseStats: {
								hp: hp,
								atk: atk,
								def: def,
								spa: spa,
								spd: spd,
								spe: spe
							}
						};
				}
				break;
		}
	}

	return smogonDex;
}
