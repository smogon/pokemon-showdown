// Note: These are the rules that formats use
// The list of formats is stored in config/formats.js
export const Formats: {[k: string]: FormatData} = {

	// Rulesets
	///////////////////////////////////////////////////////////////////

	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		desc: "The standard ruleset for all offical Smogon singles tiers (Ubers, OU, etc.)",
		ruleset: [
			'Obtainable', 'Team Preview', 'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod',
		],
	},
	standardnext: {
		effectType: 'ValidatorRule',
		name: 'Standard NEXT',
		desc: "The standard ruleset for the NEXT mod",
		ruleset: [
			'+Unreleased', 'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'HP Percentage Mod', 'Cancel Mod',
		],
		banlist: ['Soul Dew'],
	},
	standardgbu: {
		effectType: 'ValidatorRule',
		name: 'Standard GBU',
		desc: "The standard ruleset for all official in-game Pok&eacute;mon tournaments and Battle Spot",
		ruleset: ['Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'Item Clause', 'Cancel Mod'],
		banlist: ['Battle Bond',
			'Mewtwo', 'Mew',
			'Lugia', 'Ho-Oh', 'Celebi',
			'Kyogre', 'Groudon', 'Rayquaza', 'Jirachi', 'Deoxys',
			'Dialga', 'Palkia', 'Giratina', 'Phione', 'Manaphy', 'Darkrai', 'Shaymin', 'Arceus',
			'Victini', 'Reshiram', 'Zekrom', 'Kyurem', 'Keldeo', 'Meloetta', 'Genesect',
			'Xerneas', 'Yveltal', 'Zygarde', 'Diancie', 'Hoopa', 'Volcanion',
			'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Necrozma', 'Magearna', 'Marshadow', 'Zeraora',
			'Meltan', 'Melmetal', 'Zacian', 'Zamazenta', 'Eternatus', 'Zarude', 'Calyrex',
		],
		onValidateSet(set, format) {
			if (this.gen < 7 && this.toID(set.item) === 'souldew') {
				return [`${set.name || set.species} has Soul Dew, which is banned in ${format.name}.`];
			}
		},
	},
	minimalgbu: {
		effectType: 'ValidatorRule',
		name: 'Minimal GBU',
		desc: "The standard ruleset for official tournaments, but without Restricted Legendary bans",
		ruleset: ['Obtainable', 'Species Clause', 'Nickname Clause', 'Item Clause', 'Team Preview', 'Cancel Mod'],
		banlist: ['Battle Bond',
			'Mew',
			'Celebi',
			'Jirachi', 'Deoxys',
			'Phione', 'Manaphy', 'Darkrai', 'Shaymin', 'Arceus',
			'Victini', 'Keldeo', 'Meloetta', 'Genesect',
			'Diancie', 'Hoopa', 'Volcanion',
			'Magearna', 'Marshadow', 'Zeraora',
			'Zarude',
		],
		onValidateSet(set, format) {
			if (this.gen < 7 && this.toID(set.item) === 'souldew') {
				return [`${set.name || set.species} has Soul Dew, which is banned in ${format.name}.`];
			}
		},
		onValidateTeam(team) {
			const legends = [
				'Mewtwo',
				'Lugia', 'Ho-Oh',
				'Kyogre', 'Groudon', 'Rayquaza',
				'Dialga', 'Palkia', 'Giratina',
				'Reshiram', 'Zekrom', 'Kyurem',
				'Xerneas', 'Yveltal', 'Zygarde',
				'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Necrozma',
				'Zacian', 'Zamazenta', 'Eternatus', 'Calyrex',
			];
			let n = 0;
			for (const set of team) {
				const baseSpecies = this.dex.getSpecies(set.species).baseSpecies;
				if (legends.includes(baseSpecies)) n++;
				if (n > 2) return [`You can only use up to two restricted legendary Pok\u00E9mon.`];
			}
		},
	},
	standarddoubles: {
		effectType: 'ValidatorRule',
		name: 'Standard Doubles',
		desc: "The standard ruleset for all official Smogon doubles tiers",
		ruleset: [
			'Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Gravity Sleep Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod',
		],
	},
	standardnatdex: {
		effectType: 'ValidatorRule',
		name: 'Standard NatDex',
		desc: "The standard ruleset for all National Dex tiers",
		ruleset: [
			'Obtainable', '+Unobtainable', '+Past', 'Team Preview', 'Nickname Clause', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause',
		],
		onValidateSet(set) {
			// These Pokemon are still unobtainable
			const unobtainables = [
				'Eevee-Starter', 'Floette-Eternal', 'Pichu-Spiky-eared', 'Pikachu-Belle', 'Pikachu-Cosplay', 'Pikachu-Libre',
				'Pikachu-PhD', 'Pikachu-Pop-Star', 'Pikachu-Rock-Star', 'Pikachu-Starter', 'Eternatus-Eternamax',
			];
			const species = this.dex.getSpecies(set.species);
			if (unobtainables.includes(species.name)) {
				if (this.ruleTable.has(`+pokemon:${species.id}`)) return;
				return [`${set.name || set.species} does not exist in the National Dex.`];
			}
			if (species.tier === "Unreleased") {
				const basePokemon = this.toID(species.baseSpecies);
				if (this.ruleTable.has(`+pokemon:${species.id}`) || this.ruleTable.has(`+basepokemon:${basePokemon}`)) {
					return;
				}
				return [`${set.name || set.species} does not exist in the National Dex.`];
			}
			// Items other than Z-Crystals and Pokémon-specific items should be illegal
			if (!set.item) return;
			const item = this.dex.getItem(set.item);
			if (!item.isNonstandard) return;
			if (['Past', 'Unobtainable'].includes(item.isNonstandard) && !item.zMove && !item.itemUser && !item.forcedForme) {
				if (this.ruleTable.has(`+item:${item.id}`)) return;
				return [`${set.name}'s item ${item.name} does not exist in Gen ${this.dex.gen}.`];
			}
		},
	},
	obtainable: {
		effectType: 'ValidatorRule',
		name: 'Obtainable',
		desc: "Makes sure the team is possible to obtain in-game.",
		ruleset: ['Obtainable Moves', 'Obtainable Abilities', 'Obtainable Formes', 'Obtainable Misc'],
		banlist: ['Unreleased', 'Unobtainable', 'Nonexistent'],
		// Mostly hardcoded in team-validator.ts
		onValidateTeam(team, format) {
			let kyuremCount = 0;
			let necrozmaDMCount = 0;
			let necrozmaDWCount = 0;
			let calyrexCount = 0;
			for (const set of team) {
				if (set.species === 'Kyurem-White' || set.species === 'Kyurem-Black') {
					if (kyuremCount > 0) {
						return [
							`You cannot have more than one Kyurem-Black/Kyurem-White.`,
							`(It's untradeable and you can only make one with the DNA Splicers.)`,
						];
					}
					kyuremCount++;
				}
				if (set.species === 'Necrozma-Dusk-Mane') {
					if (necrozmaDMCount > 0) {
						return [
							`You cannot have more than one Necrozma-Dusk-Mane`,
							`(It's untradeable and you can only make one with the N-Solarizer.)`,
						];
					}
					necrozmaDMCount++;
				}
				if (set.species === 'Necrozma-Dawn-Wings') {
					if (necrozmaDWCount > 0) {
						return [
							`You cannot have more than one Necrozma-Dawn-Wings`,
							`(It's untradeable and you can only make one with the N-Lunarizer.)`,
						];
					}
					necrozmaDWCount++;
				}
				if (set.species === 'Calyrex-Ice' || set.species === 'Calyrex-Shadow') {
					if (calyrexCount > 0) {
						return [
							`You cannot have more than one Calyrex-Ice/Calyrex-Shadow.`,
							`(It's untradeable and you can only make one with the Reins of Unity.)`,
						];
					}
					calyrexCount++;
				}
			}
			return [];
		},
	},
	obtainablemoves: {
		effectType: 'ValidatorRule',
		name: 'Obtainable Moves',
		desc: "Makes sure moves are learnable by the species.",
		// Hardcoded in team-validator.ts
	},
	obtainableabilities: {
		effectType: 'ValidatorRule',
		name: 'Obtainable Abilities',
		desc: "Makes sure abilities match the species.",
		// Hardcoded in team-validator.ts
	},
	obtainableformes: {
		effectType: 'ValidatorRule',
		name: 'Obtainable Formes',
		desc: "Makes sure in-battle formes only appear in-battle.",
		// Hardcoded in team-validator.ts
	},
	obtainablemisc: {
		effectType: 'ValidatorRule',
		name: 'Obtainable Misc',
		desc: "Validate all obtainability things that aren't moves/abilities (Hidden Power type, gender, stats, etc).",
		// Mostly hardcoded in team-validator.ts
		onChangeSet(set) {
			const species = this.dex.getSpecies(set.species);

			if (species.gender) {
				if (set.gender !== species.gender) {
					set.gender = species.gender;
				}
			} else {
				if (set.gender !== 'M' && set.gender !== 'F') {
					set.gender = '';
				}
			}

			// limit one of each move
			const moves = [];
			if (set.moves) {
				const hasMove: {[k: string]: true} = {};
				for (const moveId of set.moves) {
					const move = this.dex.getMove(moveId);
					const moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(moveId);
				}
			}
			set.moves = moves;
		},
	},
	hoennpokedex: {
		effectType: 'ValidatorRule',
		name: 'Hoenn Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Hoenn region (OR/AS)",
		onValidateSet(set, format) {
			const hoennDex = [
				"Abra", "Absol", "Aggron", "Alakazam", "Altaria", "Anorith", "Armaldo", "Aron", "Azumarill", "Azurill", "Bagon", "Baltoy", "Banette", "Barboach", "Beautifly", "Beldum", "Bellossom", "Blaziken", "Breloom", "Budew", "Cacnea", "Cacturne", "Camerupt", "Carvanha", "Cascoon", "Castform", "Chimecho", "Chinchou", "Chingling", "Clamperl", "Claydol", "Combusken", "Corphish", "Corsola", "Cradily", "Crawdaunt", "Crobat", "Delcatty", "Dodrio", "Doduo", "Donphan", "Dusclops", "Dusknoir", "Duskull", "Dustox", "Electrike", "Electrode", "Exploud", "Feebas", "Flygon", "Froslass", "Gallade", "Gardevoir", "Geodude", "Girafarig", "Glalie", "Gloom", "Golbat", "Goldeen", "Golduck", "Golem", "Gorebyss", "Graveler", "Grimer", "Grovyle", "Grumpig", "Gulpin", "Gyarados", "Hariyama", "Heracross", "Horsea", "Huntail", "Igglybuff", "Illumise", "Jigglypuff", "Kadabra", "Kecleon", "Kingdra", "Kirlia", "Koffing", "Lairon", "Lanturn", "Latias", "Latios", "Lileep", "Linoone", "Lombre", "Lotad", "Loudred", "Ludicolo", "Lunatone", "Luvdisc", "Machamp", "Machoke", "Machop", "Magcargo", "Magikarp", "Magnemite", "Magneton", "Magnezone", "Makuhita", "Manectric", "Marill", "Marshtomp", "Masquerain", "Mawile", "Medicham", "Meditite", "Metagross", "Metang", "Mightyena", "Milotic", "Minun", "Mudkip", "Muk", "Natu", "Nincada", "Ninetales", "Ninjask", "Nosepass", "Numel", "Nuzleaf", "Oddish", "Pelipper", "Phanpy", "Pichu", "Pikachu", "Pinsir", "Plusle", "Poochyena", "Probopass", "Psyduck", "Raichu", "Ralts", "Regice", "Regirock", "Registeel", "Relicanth", "Rhydon", "Rhyhorn", "Rhyperior", "Roselia", "Roserade", "Sableye", "Salamence", "Sandshrew", "Sandslash", "Sceptile", "Seadra", "Seaking", "Sealeo", "Seedot", "Seviper", "Sharpedo", "Shedinja", "Shelgon", "Shiftry", "Shroomish", "Shuppet", "Silcoon", "Skarmory", "Skitty", "Slaking", "Slakoth", "Slugma", "Snorunt", "Solrock", "Spheal", "Spinda", "Spoink", "Starmie", "Staryu", "Surskit", "Swablu", "Swalot", "Swampert", "Swellow", "Taillow", "Tentacool", "Tentacruel", "Torchic", "Torkoal", "Trapinch", "Treecko", "Tropius", "Vibrava", "Vigoroth", "Vileplume", "Volbeat", "Voltorb", "Vulpix", "Wailmer", "Wailord", "Walrein", "Weezing", "Whiscash", "Whismur", "Wigglytuff", "Wingull", "Wobbuffet", "Wurmple", "Wynaut", "Xatu", "Zangoose", "Zigzagoon", "Zubat",
			];
			const species = this.dex.getSpecies(set.species || set.name);
			if (!hoennDex.includes(species.baseSpecies) && !this.ruleTable.has('+' + species.id)) {
				return [species.baseSpecies + " is not in the Hoenn Pokédex."];
			}
		},
	},
	sinnohpokedex: {
		effectType: 'ValidatorRule',
		name: 'Sinnoh Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Sinnoh region (Platinum)",
		onValidateSet(set, format) {
			const sinnohDex = [
				"Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Starly", "Staravia", "Staraptor", "Bidoof", "Bibarel", "Kricketot", "Kricketune", "Shinx", "Luxio", "Luxray", "Abra", "Kadabra", "Alakazam", "Magikarp", "Gyarados", "Budew", "Roselia", "Roserade", "Zubat", "Golbat", "Crobat", "Geodude", "Graveler", "Golem", "Onix", "Steelix", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Machop", "Machoke", "Machamp", "Psyduck", "Golduck", "Burmy", "Wormadam", "Mothim", "Wurmple", "Silcoon", "Beautifly", "Cascoon", "Dustox", "Combee", "Vespiquen", "Pachirisu", "Buizel", "Floatzel", "Cherubi", "Cherrim", "Shellos", "Gastrodon", "Heracross", "Aipom", "Ambipom", "Drifloon", "Drifblim", "Buneary", "Lopunny", "Gastly", "Haunter", "Gengar", "Misdreavus", "Mismagius", "Murkrow", "Honchkrow", "Glameow", "Purugly", "Goldeen", "Seaking", "Barboach", "Whiscash", "Chingling", "Chimecho", "Stunky", "Skuntank", "Meditite", "Medicham", "Bronzor", "Bronzong", "Ponyta", "Rapidash", "Bonsly", "Sudowoodo", "Mime Jr.", "Mr. Mime", "Happiny", "Chansey", "Blissey", "Cleffa", "Clefairy", "Clefable", "Chatot", "Pichu", "Pikachu", "Raichu", "Hoothoot", "Noctowl", "Spiritomb", "Gible", "Gabite", "Garchomp", "Munchlax", "Snorlax", "Unown", "Riolu", "Lucario", "Wooper", "Quagsire", "Wingull", "Pelipper", "Girafarig", "Hippopotas", "Hippowdon", "Azurill", "Marill", "Azumarill", "Skorupi", "Drapion", "Croagunk", "Toxicroak", "Carnivine", "Remoraid", "Octillery", "Finneon", "Lumineon", "Tentacool", "Tentacruel", "Feebas", "Milotic", "Mantyke", "Mantine", "Snover", "Abomasnow", "Sneasel", "Weavile", "Uxie", "Mesprit", "Azelf", "Dialga", "Palkia", "Manaphy", "Rotom", "Gligar", "Gliscor", "Nosepass", "Probopass", "Ralts", "Kirlia", "Gardevoir", "Gallade", "Lickitung", "Lickilicky", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Swablu", "Altaria", "Togepi", "Togetic", "Togekiss", "Houndour", "Houndoom", "Magnemite", "Magneton", "Magnezone", "Tangela", "Tangrowth", "Yanma", "Yanmega", "Tropius", "Rhyhorn", "Rhydon", "Rhyperior", "Duskull", "Dusclops", "Dusknoir", "Porygon", "Porygon2", "Porygon-Z", "Scyther", "Scizor", "Elekid", "Electabuzz", "Electivire", "Magby", "Magmar", "Magmortar", "Swinub", "Piloswine", "Mamoswine", "Snorunt", "Glalie", "Froslass", "Absol", "Giratina",
			];
			const species = this.dex.getSpecies(set.species || set.name);
			if ((!sinnohDex.includes(species.baseSpecies) || species.gen > 4) && !this.ruleTable.has('+' + species.id)) {
				return [`${species.name} is not in the Sinnoh Pokédex.`];
			}
		},
	},
	kalospokedex: {
		effectType: 'ValidatorRule',
		name: 'Kalos Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Kalos region (XY)",
		onValidateSet(set, format) {
			const kalosDex = [
				"Chespin", "Quilladin", "Chesnaught", "Fennekin", "Braixen", "Delphox", "Froakie", "Frogadier", "Greninja", "Bunnelby", "Diggersby", "Zigzagoon", "Linoone", "Fletchling", "Fletchinder", "Talonflame", "Pidgey", "Pidgeotto", "Pidgeot", "Scatterbug", "Spewpa", "Vivillon", "Caterpie", "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill", "Pansage", "Simisage", "Pansear", "Simisear", "Panpour", "Simipour", "Pichu", "Pikachu", "Raichu", "Bidoof", "Bibarel", "Dunsparce", "Azurill", "Marill", "Azumarill", "Burmy", "Wormadam", "Mothim", "Surskit", "Masquerain", "Magikarp", "Gyarados", "Corphish", "Crawdaunt", "Goldeen", "Seaking", "Carvanha", "Sharpedo", "Litleo", "Pyroar", "Psyduck", "Golduck", "Farfetch\u2019d", "Riolu", "Lucario", "Ralts", "Kirlia", "Gardevoir", "Gallade", "Flabe\u0301be\u0301", "Floette", "Florges", "Budew", "Roselia", "Roserade", "Ledyba", "Ledian", "Combee", "Vespiquen", "Skitty", "Delcatty", "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Skiddo", "Gogoat", "Pancham", "Pangoro", "Furfrou", "Doduo", "Dodrio", "Plusle", "Minun", "Gulpin", "Swalot", "Scraggy", "Scrafty", "Abra", "Kadabra", "Alakazam", "Oddish", "Gloom", "Vileplume", "Bellossom", "Sentret", "Furret", "Nincada", "Ninjask", "Shedinja", "Espurr", "Meowstic", "Kecleon", "Honedge", "Doublade", "Aegislash", "Venipede", "Whirlipede", "Scolipede", "Audino", "Smeargle", "Croagunk", "Toxicroak", "Ducklett", "Swanna", "Spritzee", "Aromatisse", "Swirlix", "Slurpuff", "Volbeat", "Illumise", "Hoppip", "Skiploom", "Jumpluff", "Munchlax", "Snorlax", "Whismur", "Loudred", "Exploud", "Meditite", "Medicham", "Zubat", "Golbat", "Crobat", "Axew", "Fraxure", "Haxorus", "Diancie", "Hoopa", "Volcanion",
				"Drifloon", "Drifblim", "Mienfoo", "Mienshao", "Zangoose", "Seviper", "Spoink", "Grumpig", "Absol", "Inkay", "Malamar", "Lunatone", "Solrock", "Bagon", "Shelgon", "Salamence", "Wingull", "Pelipper", "Taillow", "Swellow", "Binacle", "Barbaracle", "Dwebble", "Crustle", "Tentacool", "Tentacruel", "Wailmer", "Wailord", "Luvdisc", "Skrelp", "Dragalge", "Clauncher", "Clawitzer", "Staryu", "Starmie", "Shellder", "Cloyster", "Qwilfish", "Horsea", "Seadra", "Kingdra", "Relicanth", "Sandile", "Krokorok", "Krookodile", "Helioptile", "Heliolisk", "Hippopotas", "Hippowdon", "Rhyhorn", "Rhydon", "Rhyperior", "Onix", "Steelix", "Woobat", "Swoobat", "Machop", "Machoke", "Machamp", "Cubone", "Marowak", "Kangaskhan", "Mawile", "Tyrunt", "Tyrantrum", "Amaura", "Aurorus", "Aerodactyl", "Ferroseed", "Ferrothorn", "Snubbull", "Granbull", "Electrike", "Manectric", "Houndour", "Houndoom", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Sylveon", "Emolga", "Yanma", "Yanmega", "Hawlucha", "Sigilyph", "Golett", "Golurk", "Nosepass", "Probopass", "Makuhita", "Hariyama", "Throh", "Sawk", "Starly", "Staravia", "Staraptor", "Stunky", "Skuntank", "Nidoran-F", "Nidorina", "Nidoqueen", "Nidoran-M", "Nidorino", "Nidoking", "Dedenne", "Chingling", "Chimecho", "Mime Jr.", "Mr. Mime", "Solosis", "Duosion", "Reuniclus", "Wynaut", "Wobbuffet", "Roggenrola", "Boldore", "Gigalith", "Sableye", "Carbink", "Tauros", "Miltank", "Mareep", "Flaaffy", "Ampharos", "Pinsir", "Heracross", "Pachirisu", "Slowpoke", "Slowbro", "Slowking", "Exeggcute", "Exeggutor", "Chatot", "Mantyke", "Mantine", "Clamperl", "Huntail", "Gorebyss", "Remoraid", "Octillery", "Corsola", "Chinchou", "Lanturn", "Alomomola", "Lapras", "Articuno", "Zapdos", "Moltres",
				"Diglett", "Dugtrio", "Trapinch", "Vibrava", "Flygon", "Gible", "Gabite", "Garchomp", "Geodude", "Graveler", "Golem", "Slugma", "Magcargo", "Shuckle", "Skorupi", "Drapion", "Wooper", "Quagsire", "Goomy", "Sliggoo", "Goodra", "Karrablast", "Escavalier", "Shelmet", "Accelgor", "Bellsprout", "Weepinbell", "Victreebel", "Carnivine", "Gastly", "Haunter", "Gengar", "Poliwag", "Poliwhirl", "Poliwrath", "Politoed", "Ekans", "Arbok", "Stunfisk", "Barboach", "Whiscash", "Purrloin", "Liepard", "Poochyena", "Mightyena", "Patrat", "Watchog", "Pawniard", "Bisharp", "Klefki", "Murkrow", "Honchkrow", "Foongus", "Amoonguss", "Lotad", "Lombre", "Ludicolo", "Buizel", "Floatzel", "Basculin", "Phantump", "Trevenant", "Pumpkaboo", "Gourgeist", "Litwick", "Lampent", "Chandelure", "Rotom", "Magnemite", "Magneton", "Magnezone", "Voltorb", "Electrode", "Trubbish", "Garbodor", "Swinub", "Piloswine", "Mamoswine", "Bergmite", "Avalugg", "Cubchoo", "Beartic", "Smoochum", "Jynx", "Vanillite", "Vanillish", "Vanilluxe", "Snover", "Abomasnow", "Delibird", "Sneasel", "Weavile", "Timburr", "Gurdurr", "Conkeldurr", "Torkoal", "Sandshrew", "Sandslash", "Aron", "Lairon", "Aggron", "Larvitar", "Pupitar", "Tyranitar", "Heatmor", "Durant", "Spinarak", "Ariados", "Spearow", "Fearow", "Cryogonal", "Skarmory", "Noibat", "Noivern", "Gligar", "Gliscor", "Hoothoot", "Noctowl", "Igglybuff", "Jigglypuff", "Wigglytuff", "Shuppet", "Banette", "Zorua", "Zoroark", "Gothita", "Gothorita", "Gothitelle", "Bonsly", "Sudowoodo", "Spinda", "Teddiursa", "Ursaring", "Lickitung", "Lickilicky", "Scyther", "Scizor", "Ditto", "Swablu", "Altaria", "Druddigon", "Deino", "Zweilous", "Hydreigon", "Dratini", "Dragonair", "Dragonite", "Xerneas", "Yveltal", "Zygarde", "Mewtwo",
			];
			const species = this.dex.getSpecies(set.species || set.name);
			if ((!kalosDex.includes(species.baseSpecies) || species.gen > 6) && !this.ruleTable.has('+' + species.id)) {
				return [`${species.name} is not in the Kalos Pokédex.`];
			}
		},
	},
	alolapokedex: {
		effectType: 'ValidatorRule',
		name: 'Alola Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Alola region (US/UM)",
		onValidateSet(set, format) {
			const alolaDex = [
				"Rowlet", "Dartrix", "Decidueye", "Litten", "Torracat", "Incineroar", "Popplio", "Brionne", "Primarina", "Pikipek", "Trumbeak", "Toucannon", "Yungoos", "Gumshoos", "Rattata-Alola", "Raticate-Alola", "Caterpie", "Metapod", "Butterfree", "Ledyba", "Ledian", "Spinarak", "Ariados", "Buneary", "Lopunny", "Inkay", "Malamar", "Zorua", "Zoroark", "Furfrou", "Pichu", "Pikachu", "Raichu-Alola", "Grubbin", "Charjabug", "Vikavolt", "Bonsly", "Sudowoodo", "Happiny", "Chansey", "Blissey", "Munchlax", "Snorlax", "Slowpoke", "Slowbro", "Slowking", "Wingull", "Pelipper", "Abra", "Kadabra", "Alakazam", "Meowth-Alola", "Persian-Alola", "Magnemite", "Magneton", "Magnezone", "Grimer-Alola", "Muk-Alola", "Mime Jr.", "Mr. Mime", "Ekans", "Arbok", "Dunsparce", "Growlithe", "Arcanine", "Drowzee", "Hypno", "Makuhita", "Hariyama", "Smeargle", "Crabrawler", "Crabominable", "Gastly", "Haunter", "Gengar", "Drifloon", "Drifblim", "Murkrow", "Honchkrow", "Zubat", "Golbat", "Crobat", "Noibat", "Noivern", "Diglett-Alola", "Dugtrio-Alola", "Spearow", "Fearow", "Rufflet", "Braviary", "Vullaby", "Mandibuzz", "Mankey", "Primeape", "Delibird", "Hawlucha", "Oricorio", "Cutiefly", "Ribombee", "Flabe\u0301be\u0301", "Floette", "Florges", "Petilil", "Lilligant", "Cottonee", "Whimsicott", "Psyduck", "Golduck", "Smoochum", "Jynx", "Magikarp", "Gyarados", "Barboach", "Whiscash", "Seal", "Dewgong", "Machop", "Machoke", "Machamp", "Roggenrola", "Boldore", "Gigalith", "Carbink", "Sableye", "Mawile", "Rockruff", "Lycanroc", "Spinda", "Tentacool", "Tentacruel", "Finneon", "Lumineon", "Wishiwashi", "Luvdisc", "Corsola", "Mareanie", "Toxapex", "Shellder", "Cloyster", "Clamperl", "Huntail", "Gorebyss", "Remoraid", "Octillery", "Mantyke", "Mantine", "Bagon", "Shelgon", "Salamence", "Lillipup", "Herdier", "Stoutland", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Sylveon", "Mareep", "Flaaffy", "Ampharos", "Mudbray", "Mudsdale", "Igglybuff", "Jigglypuff", "Wigglytuff", "Tauros", "Miltank", "Surskit", "Masquerain", "Dewpider", "Araquanid", "Fomantis", "Lurantis", "Morelull", "Shiinotic", "Paras", "Parasect", "Poliwag", "Poliwhirl", "Poliwrath", "Politoed", "Goldeen", "Seaking", "Basculin", "Feebas", "Milotic", "Alomomola", "Fletchling", "Fletchinder", "Talonflame", "Salandit", "Salazzle", "Cubone", "Marowak-Alola", "Kangaskhan", "Magby", "Magmar", "Magmortar", "Larvesta", "Volcarona", "Stufful", "Bewear", "Bounsweet", "Steenee", "Tsareena", "Comfey", "Pinsir", "Hoothoot", "Noctowl", "Kecleon", "Oranguru", "Passimian", "Goomy", "Sliggoo", "Goodra", "Castform", "Wimpod", "Golisopod", "Staryu", "Starmie", "Sandygast", "Palossand", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Lileep", "Cradily", "Anorith", "Armaldo", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Tirtouga", "Carracosta", "Archen", "Archeops", "Tyrunt", "Tyrantrum", "Amaura", "Aurorus", "Pupitar", "Larvitar", "Tyranitar", "Phantump", "Trevenant", "Natu", "Xatu", "Nosepass", "Probopass", "Pyukumuku", "Chinchou", "Lanturn", "Type: Null", "Silvally", "Poipole", "Naganadel", "Zygarde", "Trubbish", "Garbodor", "Minccino", "Cinccino", "Pineco", "Forretress", "Skarmory", "Ditto", "Cleffa", "Clefairy", "Clefable", "Elgyem", "Beheeyem", "Minior", "Beldum", "Metang", "Metagross", "Porygon", "Porygon2", "Porygon-Z", "Pancham", "Pangoro", "Komala", "Torkoal", "Turtonator", "Houndour", "Houndoom", "Dedenne", "Togedemaru", "Electrike", "Manectric", "Elekid", "Electabuzz", "Electivire", "Geodude-Alola", "Graveler-Alola", "Golem-Alola", "Sandile", "Krokorok", "Krookodile", "Trapinch", "Vibrava", "Flygon", "Gible", "Gabite", "Garchomp", "Baltoy", "Claydol", "Golett", "Golurk", "Klefki", "Mimikyu", "Shuppet", "Banette", "Frillish", "Jellicent", "Bruxish", "Drampa", "Absol", "Snorunt", "Glalie", "Froslass", "Sneasel", "Weavile", "Sandshrew-Alola", "Sandslash-Alola", "Vulpix-Alola", "Ninetales-Alola", "Vanillite", "Vanillish", "Vanilluxe", "Scraggy", "Scrafty", "Pawniard", "Bisharp", "Snubbull", "Granbull", "Shellos", "Gastrodon", "Relicanth", "Dhelmise", "Carvanha", "Sharpedo", "Skrelp", "Dragalge", "Clauncher", "Clawitzer", "Wailmer", "Wailord", "Lapras", "Tropius", "Exeggcute", "Exeggutor-Alola", "Corphish", "Crawdaunt", "Mienfoo", "Mienshao", "Jangmo-o", "Hakamo-o", "Kommo-o", "Emolga", "Scyther", "Scizor", "Heracross", "Aipom", "Ampibom", "Litleo", "Pyroar", "Misdreavus", "Mismagius", "Druddigon", "Lickitung", "Lickilicky", "Riolu", "Lucario", "Dratini", "Dragonair", "Dragonite", "Aerodactyl", "Tapu Koko", "Tapu Lele", "Tapu Bulu", "Tapu Fini", "Cosmog", "Cosmoem", "Solgaleo", "Lunala", "Nihilego", "Stakataka", "Blacephalon", "Buzzwole", "Pheromosa", "Xurkitree", "Celesteela", "Kartana", "Guzzlord", "Necrozma", "Magearna", "Marshadow", "Zeraora",
			];
			const species = this.dex.getSpecies(set.species || set.name);
			if (!alolaDex.includes(species.baseSpecies) && !alolaDex.includes(species.name) &&
				!this.ruleTable.has('+' + species.id)) {
				return [`${species.baseSpecies} is not in the Alola Pokédex.`];
			}
		},
	},
	galarpokedex: {
		effectType: 'ValidatorRule',
		name: 'Galar Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Galar region (Sw/Sh)",
		banlist: ['Raichu-Alola', 'Weezing-Base'],
		onValidateSet(set, format) {
			const galarDex = [
				"Grookey", "Thwackey", "Rillaboom", "Scorbunny", "Raboot", "Cinderace", "Sobble", "Drizzile", "Inteleon", "Blipbug", "Dottler", "Orbeetle", "Caterpie", "Metapod", "Butterfree", "Grubbin", "Charjabug", "Vikavolt", "Hoothoot", "Noctowl", "Rookidee", "Corvisquire", "Corviknight", "Skwovet", "Greedent", "Pidove", "Tranquill", "Unfezant", "Nickit", "Thievul", "Zigzagoon", "Linoone", "Obstagoon", "Wooloo", "Dubwool", "Lotad", "Lombre", "Ludicolo", "Seedot", "Nuzleaf", "Shiftry", "Chewtle", "Drednaw", "Purrloin", "Liepard", "Yamper", "Boltund", "Bunnelby", "Diggersby", "Minccino", "Cinccino", "Bounsweet", "Steenee", "Tsareena", "Oddish", "Gloom", "Vileplume", "Bellossom", "Budew", "Roselia", "Roserade", "Wingull", "Pelipper", "Joltik", "Galvantula", "Electrike", "Manectric", "Vulpix", "Ninetales", "Growlithe", "Arcanine", "Vanillite", "Vanillish", "Vanilluxe", "Swinub", "Piloswine", "Mamoswine", "Delibird", "Snorunt", "Glalie", "Froslass", "Baltoy", "Claydol", "Mudbray", "Mudsdale", "Dwebble", "Crustle", "Golett", "Golurk", "Munna", "Musharna", "Natu", "Xatu", "Stufful", "Bewear", "Snover", "Abomasnow", "Krabby", "Kingler", "Wooper", "Quagsire", "Corphish", "Crawdaunt", "Nincada", "Ninjask", "Shedinja", "Tyrogue", "Hitmonlee", "Hitmonchan", "Hitmontop", "Pancham", "Pangoro", "Klink", "Klang", "Klinklang", "Combee", "Vespiquen", "Bronzor", "Bronzong", "Ralts", "Kirlia", "Gardevoir", "Gallade", "Drifloon", "Drifblim", "Gossifleur", "Eldegoss", "Cherubi", "Cherrim", "Stunky", "Skuntank", "Tympole", "Palpitoad", "Seismitoad", "Duskull", "Dusclops", "Dusknoir", "Machop", "Machoke", "Machamp", "Gastly", "Haunter", "Gengar", "Magikarp", "Gyarados", "Goldeen", "Seaking", "Remoraid", "Octillery", "Shellder", "Cloyster", "Feebas", "Milotic", "Basculin", "Wishiwashi", "Pyukumuku", "Trubbish", "Garbodor", "Sizzlipede", "Centiskorch", "Rolycoly", "Carkol", "Coalossal", "Diglett", "Dugtrio", "Drilbur", "Excadrill", "Roggenrola", "Boldore", "Gigalith", "Timburr", "Gurdurr", "Conkeldurr", "Woobat", "Swoobat", "Noibat", "Noivern", "Onix", "Steelix", "Arrokuda", "Barraskewda", "Meowth", "Perrserker", "Persian", "Milcery", "Alcremie", "Cutiefly", "Ribombee", "Ferroseed", "Ferrothorn", "Pumpkaboo", "Gourgeist", "Pichu", "Pikachu", "Raichu", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Sylveon", "Applin", "Flapple", "Appletun", "Espurr", "Meowstic", "Swirlix", "Slurpuff", "Spritzee", "Aromatisse", "Dewpider", "Araquanid", "Wynaut", "Wobbuffet", "Farfetch\u2019d", "Sirfetch\u2019d", "Chinchou", "Lanturn", "Croagunk", "Toxicroak", "Scraggy", "Scrafty", "Stunfisk", "Shuckle", "Barboach", "Whiscash", "Shellos", "Gastrodon", "Wimpod", "Golisopod", "Binacle", "Barbaracle", "Corsola", "Cursola", "Impidimp", "Morgrem", "Grimmsnarl", "Hatenna", "Hattrem", "Hatterene", "Salandit", "Salazzle", "Pawniard", "Bisharp", "Throh", "Sawk", "Koffing", "Weezing", "Bonsly", "Sudowoodo", "Cleffa", "Clefairy", "Clefable", "Togepi", "Togetic", "Togekiss", "Munchlax", "Snorlax", "Cottonee", "Whimsicott", "Rhyhorn", "Rhydon", "Rhyperior", "Gothita", "Gothorita", "Gothitelle", "Solosis", "Duosion", "Reuniclus", "Karrablast", "Escavalier", "Shelmet", "Accelgor", "Elgyem", "Beheeyem", "Cubchoo", "Beartic", "Rufflet", "Braviary", "Vullaby", "Mandibuzz", "Skorupi", "Drapion", "Litwick", "Lampent", "Chandelure", "Inkay", "Malamar", "Sneasel", "Weavile", "Sableye", "Mawile", "Maractus", "Sigilyph", "Riolu", "Lucario", "Torkoal", "Mimikyu", "Cufant", "Copperajah", "Qwilfish", "Frillish", "Jellicent", "Mareanie", "Toxapex", "Cramorant", "Toxel", "Toxtricity", "Toxtricity-Low-Key", "Silicobra", "Sandaconda", "Hippopotas", "Hippowdon", "Durant", "Heatmor", "Helioptile", "Heliolisk", "Hawlucha", "Trapinch", "Vibrava", "Flygon", "Axew", "Fraxure", "Haxorus", "Yamask", "Runerigus", "Cofagrigus", "Honedge", "Doublade", "Aegislash", "Ponyta", "Rapidash", "Sinistea", "Polteageist", "Indeedee", "Phantump", "Trevenant", "Morelull", "Shiinotic", "Oranguru", "Passimian", "Morpeko", "Falinks", "Drampa", "Turtonator", "Togedemaru", "Snom", "Frosmoth", "Clobbopus", "Grapploct", "Pincurchin", "Mantyke", "Mantine", "Wailmer", "Wailord", "Bergmite", "Avalugg", "Dhelmise", "Lapras", "Lunatone", "Solrock", "Mime Jr.", "Mr. Mime", "Mr. Rime", "Darumaka", "Darmanitan", "Stonjourner", "Eiscue", "Duraludon", "Rotom", "Ditto", "Dracozolt", "Arctozolt", "Dracovish", "Arctovish", "Charmander", "Charmeleon", "Charizard", "Type: Null", "Silvally", "Larvitar", "Pupitar", "Tyranitar", "Deino", "Zweilous", "Hydreigon", "Goomy", "Sliggoo", "Goodra", "Jangmo-o", "Hakamo-o", "Kommo-o", "Dreepy", "Drakloak", "Dragapult",
			];
			const species = this.dex.getSpecies(set.species || set.name);
			if (!galarDex.includes(species.baseSpecies) && !galarDex.includes(species.name) &&
				!this.ruleTable.has('+' + species.id)) {
				return [`${species.baseSpecies} is not in the Galar Pokédex.`];
			}
		},
	},
	isleofarmorpokedex: {
		effectType: 'ValidatorRule',
		name: 'Isle of Armor Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Isle of Armor in the Galar Region (Sw/Sh DLC1)",
		onValidateSet(set, format) {
			const ioaDex = [
				"Slowpoke", "Slowbro", "Slowking", "Buneary", "Lopunny", "Happiny", "Chansey", "Blissey", "Skwovet", "Greedent", "Igglybuff", "Jigglypuff", "Wigglytuff", "Blipbug", "Dottler", "Fomantis", "Lurantis", "Applin", "Flapple", "Appletun", "Fletchling", "Fletchinder", "Talonflame", "Shinx", "Luxio", "Luxray", "Klefki", "Pawniard", "Bisharp", "Abra", "Kadabra", "Alakazam", "Ralts", "Kirlia", "Gardevoir", "Gallade", "Krabby", "Kingler", "Tentacool", "Tentacruel", "Magikarp", "Gyarados", "Remoraid", "Octillery", "Mantyke", "Mantine", "Wingull", "Pelipper", "Skorupi", "Drapion", "Dunsparce", "Bouffalant", "Lickitung", "Lickilicky", "Chewtle", "Drednaw", "Wooper", "Quagsire", "Goomy", "Sliggoo", "Goodra", "Druddigon", "Shelmet", "Accelgor", "Karrablast", "Escavalier", "Bulbasaur", "Ivysaur", "Venusaur", "Squirtle", "Wartortle", "Blastoise", "Venipede", "Whirlipede", "Scolipede", "Foongus", "Amoonguss", "Comfey", "Tangela", "Tangrowth", "Croagunk", "Toxicroak", "Pichu", "Pikachu", "Raichu", "Zorua", "Zoroark", "Oranguru", "Passimian", "Corphish", "Crawdaunt", "Cramorant", "Goldeen", "Seaking", "Arrokuda", "Barraskewda", "Staryu", "Starmie", "Kubfu", "Urshifu", "Emolga", "Dedenne", "Morpeko", "Magnemite", "Magneton", "Magnezone", "Inkay", "Malamar", "Wishiwashi", "Carvanha", "Sharpedo", "Lillipup", "Herdier", "Stoutland", "Tauros", "Miltank", "Scyther", "Scizor", "Pinsir", "Heracross", "Dwebble", "Crustle", "Wimpod", "Golisopod", "Pincurchin", "Mareanie", "Toxapex", "Clobbopus", "Grapploct", "Shellder", "Cloyster", "Sandygast", "Palossand", "Drifloon", "Drifblim", "Barboach", "Whiscash", "Azurill", "Marill", "Azumarill", "Poliwag", "Poliwhirl", "Poliwrath", "Politoed", "Psyduck", "Golduck", "Whismur", "Loudred", "Exploud", "Woobat", "Swoobat", "Skarmory", "Roggenrola", "Boldore", "Gigalith", "Rockruff", "Lycanroc", "Salandit", "Salazzle", "Scraggy", "Scrafty", "Mienfoo", "Mienshao", "Jangmo-o", "Hakamo-o", "Kommo-o", "Sandshrew", "Sandslash", "Cubone", "Marowak", "Kangaskhan", "Torkoal", "Silicobra", "Sandaconda", "Sandile", "Krokorok", "Krookodile", "Rufflet", "Braviary", "Vullaby", "Mandibuzz", "Rhyhorn", "Rhydon", "Rhyperior", "Larvesta", "Volcarona", "Chinchou", "Lanturn", "Wailmer", "Wailord", "Frillish", "Jellicent", "Skrelp", "Dragalge", "Clauncher", "Clawitzer", "Horsea", "Seadra", "Kingdra", "Petilil", "Lilligant", "Combee", "Vespiquen", "Exeggcute", "Exeggutor", "Ditto", "Porygon", "Porygon2", "Porygon-Z",
			];
			const species = this.dex.getSpecies(set.species || set.name);
			if (!ioaDex.includes(species.baseSpecies) && !ioaDex.includes(species.name) &&
				!this.ruleTable.has('+' + species.id)) {
				return [`${species.baseSpecies} is not in the Isle of Armor Pokédex.`];
			}
		},
	},
	crowntundrapokedex: {
		effectType: 'ValidatorRule',
		name: 'Crown Tundra Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Crown Tundra in the Galar Region (Sw/Sh DLC2)",
		onValidateSet(set, format) {
			const tundraDex = [
				"Nidoran-F", "Nidorina", "Nidoqueen", "Nidoran-M", "Nidorino", "Nidoking", "Clefairy", "Clefable", "Zubat", "Golbat", "Ponyta", "Rapidash", "Mr. Mime", "Jynx", "Electabuzz", "Magmar", "Magikarp", "Gyarados", "Lapras", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Aerodactyl", "Snorlax", "Articuno", "Zapdos", "Moltres", "Dratini", "Dragonair", "Dragonite", "Crobat", "Cleffa", "Espeon", "Umbreon", "Shuckle", "Sneasel", "Swinub", "Piloswine", "Delibird", "Smoochum", "Elekid", "Magby", "Larvitar", "Pupitar", "Tyranitar", "Zigzagoon", "Linoone", "Sableye", "Mawile", "Aron", "Lairon", "Aggron", "Swablu", "Altaria", "Barboach", "Whiscash", "Baltoy", "Claydol", "Lileep", "Cradily", "Anorith", "Armaldo", "Feebas", "Milotic", "Absol", "Snorunt", "Glalie", "Spheal", "Sealeo", "Walrein", "Relicanth", "Bagon", "Shelgon", "Salamence", "Beldum", "Metang", "Metagross", "Regirock", "Regice", "Registeel", "Bronzor", "Bronzong", "Spiritomb", "Gible", "Gabite", "Garchomp", "Munchlax", "Riolu", "Lucario", "Snover", "Abomasnow", "Weavile", "Electivire", "Magmortar", "Leafeon", "Glaceon", "Mamoswine", "Froslass", "Audino", "Timburr", "Gurdurr", "Conkeldurr", "Cottonee", "Whimsicott", "Basculin", "Darumaka", "Darmanitan", "Tirtouga", "Carracosta", "Archen", "Archeops", "Gothita", "Gothorita", "Gothitelle", "Solosis", "Duosion", "Reuniclus", "Vanillite", "Vanillish", "Vanilluxe", "Karrablast", "Escavalier", "Joltik", "Galvantula", "Ferroseed", "Ferrothorn", "Litwick", "Lampent", "Chandelure", "Cubchoo", "Beartic", "Cryogonal", "Shelmet", "Accelgor", "Druddigon", "Golett", "Golurk", "Heatmor", "Durant", "Deino", "Zweilous", "Hydreigon", "Cobalion", "Terrakion", "Virizion", "Tyrunt", "Tyrantrum", "Amaura", "Aurorus", "Sylveon", "Carbink", "Phantump", "Trevenant", "Bergmite", "Avalugg", "Noibat", "Noivern", "Dewpider", "Araquanid", "Mimikyu", "Dhelmise", "Skwovet", "Greedent", "Rookidee", "Corvisquire", "Corviknight", "Gossifleur", "Eldegoss", "Wooloo", "Dubwool", "Yamper", "Boltund", "Rolycoly", "Carkol", "Coalossal", "Sizzlipede", "Centiskorch", "Sinistea", "Polteageist", "Hatenna", "Hattrem", "Hatterene", "Impidimp", "Morgrem", "Grimmsnarl", "Obstagoon", "Mr. Rime", "Pincurchin", "Snom", "Frosmoth", "Stonjourner", "Eiscue", "Indeedee", "Morpeko", "Cufant", "Copperajah", "Dreepy", "Drakloak", "Dragapult", "Regieleki", "Regidrago", "Glastrier", "Spectrier",
			];
			const species = this.dex.getSpecies(set.species || set.name);
			if (!tundraDex.includes(species.baseSpecies) && !tundraDex.includes(species.name)) {
				return [`${species.baseSpecies} is not in the Crown Tundra Pokédex.`];
			}
		},
	},
	potd: {
		effectType: 'Rule',
		name: 'PotD',
		onBegin() {
			if (global.Config && global.Config.potd) {
				this.add('rule', "Pokemon of the Day: " + this.dex.getSpecies(Config.potd).name);
			}
		},
	},
	teampreview: {
		effectType: 'Rule',
		name: 'Team Preview',
		desc: "Allows each player to see the Pok&eacute;mon on their opponent's team before they choose their lead Pok&eacute;mon",
		onBegin() {
			this.add('clearpoke');
			for (const pokemon of this.getAllPokemon()) {
				const details = pokemon.details.replace(', shiny', '')
					.replace(/(Arceus|Gourgeist|Pumpkaboo|Silvally|Urshifu)(-[a-zA-Z?-]+)?/g, '$1-*');
				this.add('poke', pokemon.side.id, details, '');
			}
		},
		onTeamPreview() {
			this.makeRequest('teampreview');
		},
	},
	onevsone: {
		effectType: 'Rule',
		name: 'One vs One',
		desc: "Only allows one Pok&eacute;mon in battle",
		onValidateTeam(team, format) {
			if (format.gameType !== 'singles') {
				return [`One vs One is for singles formats.`, `(Use Two vs Two in doubles)`];
			}
		},
		onStart() {
			if (this.format.gameType === 'singles') (this.format as any).teamLength = {battle: 1};
		},
	},
	twovstwo: {
		effectType: 'Rule',
		name: 'Two vs Two',
		desc: "Only allows two Pok&eacute;mon in battle",
		onValidateTeam(team, format) {
			if (format.gameType === 'triples') {
				return [`Two vs Two is for non-triples formats.`];
			}
		},
		onStart() {
			if (this.format.gameType !== 'triples') (this.format as any).teamLength = {battle: 2};
		},
	},
	littlecup: {
		effectType: 'ValidatorRule',
		name: 'Little Cup',
		desc: "Only allows Pok&eacute;mon that can evolve and don't have any prior evolutions",
		onValidateSet(set) {
			const species = this.dex.getSpecies(set.species || set.name);
			if (species.prevo && this.dex.getSpecies(species.prevo).gen <= this.gen) {
				return [set.species + " isn't the first in its evolution family."];
			}
			if (!species.nfe) {
				return [set.species + " doesn't have an evolution family."];
			}
			// Temporary hack for LC past-gen formats and other mashups
			if (set.level > 5) {
				return [`${set.species} can't be above level 5 in Little Cup formats.`];
			}
		},
	},
	blitz: {
		effectType: 'Rule',
		name: 'Blitz',
		// THIS 100% INTENTIONALLY SAYS TEN SECONDS PER TURN
		// IGNORE maxPerTurn. addPerTurn IS 5, TRANSLATING TO AN INCREMENT OF 10.
		desc: "Super-fast 'Blitz' timer giving 30 second Team Preview and 10 seconds per turn.",
		onBegin() {
			this.add('rule', 'Blitz: Super-fast timer');
		},
		timer: {starting: 15, addPerTurn: 5, maxPerTurn: 15, maxFirstTurn: 40, grace: 30},
	},
	vgctimer: {
		effectType: 'Rule',
		name: 'VGC Timer',
		desc: "VGC's timer: 90 second Team Preview, 7 minutes Your Time, 1 minute per turn",
		timer: {
			starting: 7 * 60, addPerTurn: 0, maxPerTurn: 55, maxFirstTurn: 90,
			grace: 90, timeoutAutoChoose: true, dcTimerBank: false,
		},
	},
	speciesclause: {
		effectType: 'ValidatorRule',
		name: 'Species Clause',
		desc: "Prevents teams from having more than one Pok&eacute;mon from the same species",
		onBegin() {
			this.add('rule', 'Species Clause: Limit one of each Pokémon');
		},
		onValidateTeam(team, format) {
			const speciesTable: Set<number> = new Set();
			for (const set of team) {
				const species = this.dex.getSpecies(set.species);
				if (speciesTable.has(species.num)) {
					return [`You are limited to one of each Pokémon by Species Clause.`, `(You have more than one ${species.baseSpecies})`];
				}
				speciesTable.add(species.num);
			}
		},
	},
	nicknameclause: {
		effectType: 'ValidatorRule',
		name: 'Nickname Clause',
		desc: "Prevents teams from having more than one Pok&eacute;mon with the same nickname",
		onValidateTeam(team, format) {
			const nameTable: Set<string> = new Set();
			for (const set of team) {
				const name = set.name;
				if (name) {
					if (name === this.dex.getSpecies(set.species).baseSpecies) continue;
					if (nameTable.has(name)) {
						return [`Your Pokémon must have different nicknames.`, `(You have more than one ${name})`];
					}
					nameTable.add(name);
				}
			}
			// Illegality of impersonation of other species is
			// hardcoded in team-validator.js, so we are done.
		},
	},
	itemclause: {
		effectType: 'ValidatorRule',
		name: 'Item Clause',
		desc: "Prevents teams from having more than one Pok&eacute;mon with the same item",
		onBegin() {
			this.add('rule', 'Item Clause: Limit one of each item');
		},
		onValidateTeam(team) {
			const itemTable: Set<string> = new Set();
			for (const set of team) {
				const item = this.toID(set.item);
				if (!item) continue;
				if (itemTable.has(item)) {
					return [
						`You are limited to one of each item by Item Clause.`,
						`(You have more than one ${this.dex.getItem(item).name})`,
					];
				}
				itemTable.add(item);
			}
		},
	},
	"2abilityclause": {
		effectType: 'ValidatorRule',
		name: '2 Ability Clause',
		desc: "Prevents teams from having more than two Pok&eacute;mon with the same ability",
		onBegin() {
			this.add('rule', '2 Ability Clause: Limit two of each ability');
		},
		onValidateTeam(team) {
			const abilityTable: {[k: string]: number} = {};
			const base: {[k: string]: string} = {
				airlock: 'cloudnine',
				battlearmor: 'shellarmor',
				clearbody: 'whitesmoke',
				dazzling: 'queenlymajesty',
				emergencyexit: 'wimpout',
				filter: 'solidrock',
				gooey: 'tanglinghair',
				insomnia: 'vitalspirit',
				ironbarbs: 'roughskin',
				libero: 'protean',
				minus: 'plus',
				powerofalchemy: 'receiver',
				teravolt: 'moldbreaker',
				turboblaze: 'moldbreaker',
			};
			for (const set of team) {
				let ability: string = this.toID(set.ability);
				if (!ability) continue;
				if (ability in base) ability = base[ability];
				if (ability in abilityTable) {
					if (abilityTable[ability] >= 2) {
						return [
							`You are limited to two of each ability by 2 Ability Clause.`,
							`(You have more than two ${this.dex.getAbility(ability).name} variants)`,
						];
					}
					abilityTable[ability]++;
				} else {
					abilityTable[ability] = 1;
				}
			}
		},
	},
	ohkoclause: {
		effectType: 'ValidatorRule',
		name: 'OHKO Clause',
		desc: "Bans all OHKO moves, such as Fissure",
		onBegin() {
			this.add('rule', 'OHKO Clause: OHKO moves are banned');
		},
		onValidateSet(set) {
			const problems: string[] = [];
			if (set.moves) {
				for (const moveId of set.moves) {
					const move = this.dex.getMove(moveId);
					if (move.ohko) problems.push(move.name + ' is banned by OHKO Clause.');
				}
			}
			return problems;
		},
	},
	evasionabilitiesclause: {
		effectType: 'ValidatorRule',
		name: 'Evasion Abilities Clause',
		desc: "Bans abilities that boost Evasion under certain weather conditions",
		banlist: ['Sand Veil', 'Snow Cloak'],
		onBegin() {
			this.add('rule', 'Evasion Abilities Clause: Evasion abilities are banned');
		},
	},
	evasionmovesclause: {
		effectType: 'ValidatorRule',
		name: 'Evasion Moves Clause',
		desc: "Bans moves that consistently raise the user's evasion when used",
		banlist: ['Minimize', 'Double Team'],
		onBegin() {
			this.add('rule', 'Evasion Moves Clause: Evasion moves are banned');
		},
	},
	accuracymovesclause: {
		effectType: 'ValidatorRule',
		name: 'Accuracy Moves Clause',
		desc: "Bans moves that have a chance to lower the target's accuracy when used",
		banlist: [
			'Flash', 'Kinesis', 'Leaf Tornado', 'Mirror Shot', 'Mud Bomb', 'Mud-Slap', 'Muddy Water', 'Night Daze', 'Octazooka', 'Sand Attack', 'Smokescreen',
		],
		onBegin() {
			this.add('rule', 'Accuracy Moves Clause: Accuracy-lowering moves are banned');
		},
	},
	sleepmovesclause: {
		effectType: 'ValidatorRule',
		name: 'Sleep Moves Clause',
		desc: "Bans all moves that induce sleep, such as Hypnosis",
		banlist: ['Yawn'],
		onBegin() {
			this.add('rule', 'Sleep Clause: Sleep-inducing moves are banned');
		},
		onValidateSet(set) {
			const problems = [];
			if (set.moves) {
				for (const id of set.moves) {
					const move = this.dex.getMove(id);
					if (move.status && move.status === 'slp') problems.push(move.name + ' is banned by Sleep Clause.');
				}
			}
			return problems;
		},
	},
	gravitysleepclause: {
		effectType: 'ValidatorRule',
		name: 'Gravity Sleep Clause',
		desc: "Bans sleep moves below 100% accuracy, in conjunction with Gravity or Gigantamax Orbeetle",
		banlist: [
			'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder',
		],
		onValidateTeam(team) {
			let hasOrbeetle = false;
			let hasSleepMove = false;
			for (const set of team) {
				const species = this.dex.getSpecies(set.species);
				if (species.name === "Orbeetle" && set.gigantamax) hasOrbeetle = true;
				if (!hasOrbeetle && species.name === "Orbeetle-Gmax") hasOrbeetle = true;
				for (const moveid of set.moves) {
					const move = this.dex.getMove(moveid);
					if (move.status && move.status === 'slp' && move.accuracy < 100) hasSleepMove = true;
				}
			}
			if (hasOrbeetle && hasSleepMove) {
				return [`The combination of Gravity and Gigantamax Orbeetle on the same team is banned.`];
			}
		},
		onBegin() {
			this.add('rule', 'Gravity Sleep Clause: The combination of sleep-inducing moves with imperfect accuracy and Gravity or Gigantamax Orbeetle are banned');
		},
	},
	endlessbattleclause: {
		effectType: 'Rule',
		name: 'Endless Battle Clause',
		desc: "Prevents players from forcing a battle which their opponent cannot end except by forfeit",
		// implemented in sim/battle.js, see https://dex.pokemonshowdown.com/articles/battlerules#endlessbattleclause for the specification.
		onBegin() {
			this.add('rule', 'Endless Battle Clause: Forcing endless battles is banned');
		},
	},
	moodyclause: {
		effectType: 'ValidatorRule',
		name: 'Moody Clause',
		desc: "Bans the ability Moody",
		banlist: ['Moody'],
		onBegin() {
			this.add('rule', 'Moody Clause: Moody is banned');
		},
	},
	swaggerclause: {
		effectType: 'ValidatorRule',
		name: 'Swagger Clause',
		desc: "Bans the move Swagger",
		banlist: ['Swagger'],
		onBegin() {
			this.add('rule', 'Swagger Clause: Swagger is banned');
		},
	},
	batonpassclause: {
		effectType: 'ValidatorRule',
		name: 'Baton Pass Clause',
		desc: "Stops teams from having more than one Pok&eacute;mon with Baton Pass, and no Pok&eacute;mon may be capable of passing boosts to both Speed and another stat",
		banlist: ["Baton Pass > 1"],
		onBegin() {
			this.add('rule', 'Baton Pass Clause: Limit one Baton Passer, can\'t pass Spe and other stats simultaneously');
		},
		onValidateSet(set, format, setHas) {
			if (!('move:batonpass' in setHas)) return;

			const item = this.dex.getItem(set.item);
			const ability = this.toID(set.ability);
			let speedBoosted: boolean | string = false;
			let nonSpeedBoosted: boolean | string = false;

			for (const moveId of set.moves) {
				const move = this.dex.getMove(moveId);
				if (move.id === 'flamecharge' || (move.boosts && move.boosts.spe && move.boosts.spe > 0)) {
					speedBoosted = true;
				}
				const nonSpeedBoostedMoves = [
					'acupressure', 'bellydrum', 'chargebeam', 'curse', 'diamondstorm', 'fellstinger', 'fierydance',
					'flowershield', 'poweruppunch', 'rage', 'rototiller', 'skullbash', 'stockpile',
				];
				if (nonSpeedBoostedMoves.includes(move.id) ||
					move.boosts && ((move.boosts.atk && move.boosts.atk > 0) || (move.boosts.def && move.boosts.def > 0) ||
					(move.boosts.spa && move.boosts.spa > 0) || (move.boosts.spd && move.boosts.spd > 0))) {
					nonSpeedBoosted = true;
				}
				if (item.zMove && move.type === item.zMoveType && move.zMove?.boost) {
					const boosts = move.zMove.boost;
					if (boosts.spe && boosts.spe > 0) {
						if (!speedBoosted) speedBoosted = move.name;
					}
					if (
						((boosts.atk && boosts.atk > 0) || (boosts.def && boosts.def > 0) ||
						(boosts.spa && boosts.spa > 0) || (boosts.spd && boosts.spd > 0))
					) {
						if (!nonSpeedBoosted || move.name === speedBoosted) nonSpeedBoosted = move.name;
					}
				}
			}

			const speedBoostedAbilities = ['motordrive', 'rattled', 'speedboost', 'steadfast', 'weakarmor'];
			const speedBoostedItems = ['blazikenite', 'eeviumz', 'kommoniumz', 'salacberry'];
			if (speedBoostedAbilities.includes(ability) || speedBoostedItems.includes(item.id)) {
				speedBoosted = true;
			}
			if (!speedBoosted) return;

			const nonSpeedBoostedAbilities = [
				'angerpoint', 'competitive', 'defiant', 'download', 'justified', 'lightningrod', 'moxie', 'sapsipper', 'stormdrain',
			];
			const nonSpeedBoostedItems = [
				'absorbbulb', 'apicotberry', 'cellbattery', 'eeviumz', 'ganlonberry', 'keeberry', 'kommoniumz', 'liechiberry',
				'luminousmoss', 'marangaberry', 'petayaberry', 'snowball', 'starfberry', 'weaknesspolicy',
			];
			if (nonSpeedBoostedAbilities.includes(ability) || nonSpeedBoostedItems.includes(item.id)) {
				nonSpeedBoosted = true;
			}
			if (!nonSpeedBoosted) return;

			// if both boost sources are Z-moves, and they're distinct
			if (speedBoosted !== nonSpeedBoosted && typeof speedBoosted === 'string' && typeof nonSpeedBoosted === 'string') return;

			return [
				`${set.name || set.species} can Baton Pass both Speed and a different stat, which is banned by Baton Pass Clause.`,
			];
		},
	},
	"3batonpassclause": {
		effectType: 'ValidatorRule',
		name: '3 Baton Pass Clause',
		desc: "Stops teams from having more than three Pok&eacute;mon with Baton Pass",
		banlist: ["Baton Pass > 3"],
		onBegin() {
			this.add('rule', '3 Baton Pass Clause: Limit three Baton Passers');
		},
	},
	cfzclause: {
		effectType: 'ValidatorRule',
		name: 'CFZ Clause',
		desc: "Bans the use of crystal-free Z-Moves",
		banlist: [
			'10,000,000 Volt Thunderbolt', 'Acid Downpour', 'All-Out Pummeling', 'Black Hole Eclipse', 'Bloom Doom',
			'Breakneck Blitz', 'Catastropika', 'Clangorous Soulblaze', 'Continental Crush', 'Corkscrew Crash',
			'Devastating Drake', 'Extreme Evoboost', 'Genesis Supernova', 'Gigavolt Havoc', 'Guardian of Alola',
			'Hydro Vortex', 'Inferno Overdrive', 'Let\'s Snuggle Forever', 'Light That Burns the Sky',
			'Malicious Moonsault', 'Menacing Moonraze Maelstrom', 'Never-Ending Nightmare', 'Oceanic Operetta',
			'Pulverizing Pancake', 'Savage Spin-Out', 'Searing Sunraze Smash', 'Shattered Psyche', 'Sinister Arrow Raid',
			'Soul-Stealing 7-Star Strike', 'Splintered Stormshards', 'Stoked Sparksurfer', 'Subzero Slammer',
			'Supersonic Skystrike', 'Tectonic Rage', 'Twinkle Tackle',
		],
		onBegin() {
			this.add('rule', 'CFZ Clause: Crystal-free Z-Moves are banned');
		},
	},
	zmoveclause: {
		effectType: 'ValidatorRule',
		name: 'Z-Move Clause',
		desc: "Bans Pok&eacute;mon from holding Z-Crystals",
		onValidateSet(set) {
			const item = this.dex.getItem(set.item);
			if (item.zMove) return [`${set.name || set.species}'s item ${item.name} is banned by Z-Move Clause.`];
		},
		onBegin() {
			this.add('rule', 'Z-Move Clause: Z-Moves are banned');
		},
	},
	notfullyevolved: {
		effectType: 'ValidatorRule',
		name: 'Not Fully Evolved',
		desc: "Bans Pok&eacute;mon that are fully evolved or can't evolve",
		onValidateSet(set) {
			const species = this.dex.getSpecies(set.species);
			if (!species.nfe) {
				return [set.species + " cannot evolve."];
			}
		},
	},
	hppercentagemod: {
		effectType: 'Rule',
		name: 'HP Percentage Mod',
		desc: "Shows the HP of Pok&eacute;mon in percentages",
		onBegin() {
			this.add('rule', 'HP Percentage Mod: HP is shown in percentages');
			this.reportPercentages = true;
		},
	},
	exacthpmod: {
		effectType: 'Rule',
		name: 'Exact HP Mod',
		desc: "Shows the exact HP of all Pok&eacute;mon",
		onBegin() {
			this.add('rule', 'Exact HP Mod: Exact HP is shown');
			this.reportExactHP = true;
		},
	},
	cancelmod: {
		effectType: 'Rule',
		name: 'Cancel Mod',
		desc: "Allows players to change their own choices before their opponents make one",
		onBegin() {
			this.supportCancel = true;
		},
	},
	sleepclausemod: {
		effectType: 'Rule',
		name: 'Sleep Clause Mod',
		desc: "Prevents players from putting more than one of their opponent's Pok&eacute;mon to sleep at a time, and bans Mega Gengar from using Hypnosis",
		banlist: ['Hypnosis + Gengarite'],
		onBegin() {
			this.add('rule', 'Sleep Clause Mod: Limit one foe put to sleep');
		},
		onSetStatus(status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'slp') {
				for (const pokemon of target.side.pokemon) {
					if (pokemon.hp && pokemon.status === 'slp') {
						if (!pokemon.statusData.source || pokemon.statusData.source.side !== pokemon.side) {
							this.add('-message', 'Sleep Clause Mod activated.');
							return false;
						}
					}
				}
			}
		},
	},
	stadiumsleepclause: {
		effectType: 'Rule',
		name: 'Stadium Sleep Clause',
		desc: "Prevents players from putting one of their opponent's Pok\u00E9mon to sleep if any of the opponent's other Pok\u00E9mon are asleep (different from Sleep Clause Mod because putting your own Pok\u00E9mon to sleep is enough to prevent opponents from putting your others to sleep).",
		onBegin() {
			this.add('rule', 'Stadium Sleep Clause: Limit one foe put to sleep');
		},
		onSetStatus(status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'slp') {
				for (const pokemon of target.side.pokemon) {
					if (pokemon.hp && pokemon.status === 'slp') {
						this.add('-message', "Sleep Clause activated. (In Stadium, Sleep Clause activates if any of the opponent's Pokemon are asleep, even if self-inflicted from Rest)");
						return false;
					}
				}
			}
		},
	},
	switchpriorityclausemod: {
		effectType: 'Rule',
		name: 'Switch Priority Clause Mod',
		desc: "Makes a faster Pokémon switch first when double-switching, unlike in Emerald link battles, where player 1's Pokémon would switch first",
		onBegin() {
			this.add('rule', 'Switch Priority Clause Mod: Faster Pokémon switch first');
		},
	},
	desyncclausemod: {
		effectType: 'Rule',
		name: 'Desync Clause Mod',
		desc: 'If a desync would happen, the move fails instead. This rule currently covers Psywave and Counter.',
		onBegin() {
			this.add('rule', 'Desync Clause Mod: Desyncs changed to move failure.');
		},
		// Hardcoded in gen1/moves.ts
		// Can't be disabled (no precedent for how else to handle desyncs)
	},
	freezeclausemod: {
		effectType: 'Rule',
		name: 'Freeze Clause Mod',
		desc: "Prevents players from freezing more than one of their opponent's Pok&eacute;mon at a time",
		onBegin() {
			this.add('rule', 'Freeze Clause Mod: Limit one foe frozen');
		},
		onSetStatus(status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'frz') {
				for (const pokemon of target.side.pokemon) {
					if (pokemon.status === 'frz') {
						this.add('-message', 'Freeze Clause activated.');
						return false;
					}
				}
			}
		},
	},
	sametypeclause: {
		effectType: 'ValidatorRule',
		name: 'Same Type Clause',
		desc: "Forces all Pok&eacute;mon on a team to share a type with each other",
		onBegin() {
			this.add('rule', 'Same Type Clause: Pokémon in a team must share a type');
		},
		onValidateTeam(team) {
			let typeTable: string[] = [];
			for (const [i, set] of team.entries()) {
				let species = this.dex.getSpecies(set.species);
				if (!species.types) return [`Invalid pokemon ${set.name || set.species}`];
				if (i === 0) {
					typeTable = species.types;
				} else {
					typeTable = typeTable.filter(type => species.types.includes(type));
				}
				if (this.gen >= 7) {
					const item = this.dex.getItem(set.item);
					if (item.megaStone && species.baseSpecies === item.megaEvolves) {
						species = this.dex.getSpecies(item.megaStone);
						typeTable = typeTable.filter(type => species.types.includes(type));
					}
					if (item.id === "ultranecroziumz" && species.baseSpecies === "Necrozma") {
						species = this.dex.getSpecies("Necrozma-Ultra");
						typeTable = typeTable.filter(type => species.types.includes(type));
					}
				}
				if (!typeTable.length) return [`Your team must share a type.`];
			}
		},
	},
	megarayquazaclause: {
		effectType: 'Rule',
		name: 'Mega Rayquaza Clause',
		desc: "Prevents Rayquaza from mega evolving",
		onBegin() {
			this.add('rule', 'Mega Rayquaza Clause: You cannot mega evolve Rayquaza');
			for (const pokemon of this.getAllPokemon()) {
				if (pokemon.species.id === 'rayquaza') pokemon.canMegaEvo = null;
			}
		},
	},
	dynamaxclause: {
		effectType: 'Rule',
		name: 'Dynamax Clause',
		desc: "Prevents Pok&eacute;mon from dynamaxing",
		onValidateSet(set) {
			if (set.gigantamax) {
				return [
					`Your set for ${set.species} is flagged as Gigantamax, but Gigantamaxing is disallowed`,
					`(If this was a mistake, disable Gigantamaxing on the set.)`,
				];
			}
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.canDynamax = false;
			}
			this.add('rule', 'Dynamax Clause: You cannot dynamax');
		},
	},
	arceusevlimit: {
		effectType: 'ValidatorRule',
		name: 'Arceus EV Limit',
		desc: "Restricts Arceus to a maximum of 100 EVs in any one stat, and only multiples of 10",
		onValidateSet(set) {
			const species = this.dex.getSpecies(set.species);
			if (species.num === 493 && set.evs) {
				let stat: StatName;
				for (stat in set.evs) {
					const ev = set.evs[stat];
					if (ev > 100) {
						return [
							"Arceus can't have more than 100 EVs in any stat, because Arceus is only obtainable from level 100 events.",
							"Level 100 Pokemon can only gain EVs from vitamins (Carbos etc), which are capped at 100 EVs.",
						];
					}
					if (!(
						ev % 10 === 0 ||
						(ev % 10 === 8 && ev % 4 === 0)
					)) {
						return [
							"Arceus can only have EVs that are multiples of 10, because Arceus is only obtainable from level 100 events.",
							"Level 100 Pokemon can only gain EVs from vitamins (Carbos etc), which boost in multiples of 10.",
						];
					}
				}
			}
		},
	},
	inversemod: {
		effectType: 'Rule',
		name: 'Inverse Mod',
		desc: "The mod for Inverse Battle which inverts the type effectiveness chart; weaknesses become resistances, while resistances and immunities become weaknesses",
		onNegateImmunity: false,
		onBegin() {
			this.add('rule', 'Inverse Mod: Weaknesses become resistances, while resistances and immunities become weaknesses.');
		},
		onEffectivenessPriority: 1,
		onEffectiveness(typeMod, target, type, move) {
			// The effectiveness of Freeze Dry on Water isn't reverted
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.dex.getImmunity(move, type)) return 1;
			return -typeMod;
		},
	},
	stabmonsmovelegality: {
		effectType: 'ValidatorRule',
		name: 'STABmons Move Legality',
		desc: "Allows Pok&eacute;mon to use any move that they or a previous evolution/out-of-battle forme share a type with",
		checkLearnset(move, species, setSources, set) {
			const nonstandard = move.isNonstandard === 'Past' && !this.ruleTable.has('standardnatdex');
			if (!nonstandard && !move.isZ && !move.isMax && !this.ruleTable.isRestricted(`move:${move.id}`)) {
				const dex = this.dex;
				let types: string[];
				if (species.forme || species.otherFormes) {
					const baseSpecies = dex.getSpecies(species.baseSpecies);
					const originalForme = dex.getSpecies(species.changesFrom || species.name);
					types = originalForme.types;
					if (baseSpecies.otherFormes) {
						for (const formeName of baseSpecies.otherFormes) {
							if (baseSpecies.prevo) {
								const prevo = dex.getSpecies(baseSpecies.prevo);
								if (prevo.evos.includes(formeName)) continue;
							}
							const forme = dex.getSpecies(formeName);
							if (forme.changesFrom === originalForme.name && !forme.battleOnly) {
								types = types.concat(forme.types);
							}
						}
					}
				} else {
					types = species.types;
				}

				let prevo = species.prevo;
				while (prevo) {
					const prevoSpecies = dex.getSpecies(prevo);
					types = types.concat(prevoSpecies.types);
					prevo = prevoSpecies.prevo;
				}
				if (types.includes(move.type)) return null;
			}
			return this.checkLearnset(move, species, setSources, set);
		},
	},
	alphabetcupmovelegality: {
		effectType: 'ValidatorRule',
		name: 'Alphabet Cup Move Legality',
		desc: "Allows Pok&eacute;mon to use any move that shares the same first letter as their name or a previous evolution's name.",
		checkLearnset(move, species, setSources, set) {
			const nonstandard = move.isNonstandard === 'Past' && !this.ruleTable.has('standardnatdex');
			if (!nonstandard && !move.isZ && !move.isMax && !this.ruleTable.isRestricted(`move:${move.id}`)) {
				const letters = [species.id[0]];
				let prevo = species.prevo;
				while (prevo) {
					const prevoSpecies = this.dex.getSpecies(prevo);
					letters.push(prevoSpecies.id[0]);
					prevo = prevoSpecies.prevo;
				}
				if (letters.includes(move.id[0])) return null;
			}
			return this.checkLearnset(move, species, setSources, set);
		},
	},
	allowtradeback: {
		effectType: 'ValidatorRule',
		name: 'Allow Tradeback',
		desc: "Allows Gen 1 pokemon to have moves from their Gen 2 learnsets",
		// Implemented in team-validator.js
	},
	allowavs: {
		effectType: 'ValidatorRule',
		name: 'Allow AVs',
		desc: "Tells formats with the 'letsgo' mod to take Awakening Values into consideration when calculating stats",
		// implemented in TeamValidator#validateStats
	},
	nfeclause: {
		effectType: 'ValidatorRule',
		name: 'NFE Clause',
		desc: "Bans all NFE Pokemon",
		onValidateSet(set) {
			const species = this.dex.getSpecies(set.species || set.name);
			if (species.nfe) {
				if (this.ruleTable.has(`+pokemon:${species.id}`)) return;
				return [`${set.species} is banned due to NFE Clause.`];
			}
		},
	},
	mimicglitch: {
		effectType: 'ValidatorRule',
		name: 'Mimic Glitch',
		desc: "Allows any Pokemon with access to Assist, Copycat, Metronome, Mimic, or Transform to gain access to almost any other move.",
		// Implemented in sim/team-validator.ts
	},
	overflowstatmod: {
		effectType: 'Rule',
		name: 'Overflow Stat Mod',
		desc: "Caps stats at 654 after a positive nature, or 655 after a negative nature",
		// Implemented in sim/battle.ts
	},
	formeclause: {
		effectType: 'ValidatorRule',
		name: 'Forme Clause',
		desc: "Prevents teams from having more than one Pok&eacute;mon of the same forme",
		onBegin() {
			this.add('rule', 'Forme Clause: Limit one of each forme of a Pokémon');
		},
		onValidateTeam(team) {
			const formeTable: Set<string> = new Set();
			for (const set of team) {
				let species = this.dex.getSpecies(set.species);
				if (species.name !== species.baseSpecies) {
					const baseSpecies = this.dex.getSpecies(species.baseSpecies);
					if (
						species.types.join('/') === baseSpecies.types.join('/') &&
						Object.values(species.baseStats).join('/') === Object.values(baseSpecies.baseStats).join('/')
					) {
						species = baseSpecies;
					}
				}
				if (formeTable.has(species.name)) {
					return [
						`You are limited to one of each forme of a Pokémon by Forme Clause.`,
						`(You have more than one of ${species.name})`,
					];
				}
				formeTable.add(species.name);
			}
		},
	},
	'350cupmod': {
		effectType: 'Rule',
		name: '350 Cup Mod',
		desc: "If a Pok&eacute;mon's BST is 350 or lower, all of its stats get doubled.",
		onBegin() {
			this.add('rule', '350 Cup Mod: If a Pokemon\'s BST is 350 or lower, all of its stats get doubled.');
		},
		onModifySpecies(species) {
			const newSpecies = this.dex.deepClone(species);
			if (newSpecies.bst <= 350) {
				newSpecies.bst = 0;
				for (const stat in newSpecies.baseStats) {
					newSpecies.baseStats[stat] = this.clampIntRange(newSpecies.baseStats[stat] * 2, 1, 255);
					newSpecies.bst += newSpecies.baseStats[stat];
				}
			}
			return newSpecies;
		},
	},
	flippedmod: {
		effectType: 'Rule',
		name: 'Flipped Mod',
		desc: "Every Pok&eacute;mon's stats are reversed. HP becomes Spe, Atk becomes Sp. Def, Def becomes Sp. Atk, and vice versa.",
		onBegin() {
			this.add('rule', 'Flipped Mod: Pokemon have their stats flipped (HP becomes Spe, vice versa).');
		},
		onModifySpecies(species) {
			const newSpecies = this.dex.deepClone(species);
			const reversedNums = Object.values(newSpecies.baseStats).reverse();
			for (const [i, statName] of Object.keys(newSpecies.baseStats).entries()) {
				newSpecies.baseStats[statName] = reversedNums[i];
			}
			return newSpecies;
		},
	},
	scalemonsmod: {
		effectType: 'Rule',
		name: 'Scalemons Mod',
		desc: "Every Pok&eacute;mon's stats, barring HP, are scaled to give them a BST as close to 600 as possible",
		onBegin() {
			this.add('rule', 'Scalemons Mod: Every Pokemon\'s stats, barring HP, are scaled to come as close to a BST of 600 as possible');
		},
		onModifySpecies(species) {
			const newSpecies = this.dex.deepClone(species);
			const bstWithoutHp: number = newSpecies.bst - newSpecies.baseStats['hp'];
			const scale = 600 - newSpecies.baseStats['hp'];
			newSpecies.bst = newSpecies.baseStats['hp'];
			for (const stat in newSpecies.baseStats) {
				if (stat === 'hp') continue;
				newSpecies.baseStats[stat] = this.clampIntRange(newSpecies.baseStats[stat] * scale / bstWithoutHp, 1, 255);
				newSpecies.bst += newSpecies.baseStats[stat];
			}
			return newSpecies;
		},
	},
};
