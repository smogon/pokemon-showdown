// Note: This is the list of formats
// The rules that formats use are stored in data/formats.js

exports.Formats = [

	// XY Singles
	///////////////////////////////////////////////////////////////////

	{
		name: "OU (beta)",
		section: "XY Singles",

		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		noPokebank: true,
		banlist: ['Uber', 'Soul Dew']
	},
	{
		name: "Ubers (beta)",
		section: "XY Singles",

		ruleset: ['Pokemon', 'Standard Ubers', 'Team Preview'],
		noPokebank: true,
		banlist: []
	},
	{
		name: "LC (beta)",
		section: "XY Singles",

		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		noPokebank: true,
		banlist: ['Sonicboom', 'Dragon Rage', 'Scyther']
	},
	{
		name: "XY Battle Spot Singles (beta)",
		section: "XY Singles",

		onBegin: function() {
			this.debug('cutting down to 3');
			this.p1.pokemon = this.p1.pokemon.slice(0,3);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0,3);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview GBU'],
		noPokebank: true,
		banlist: [], // The neccessary bans are in Standard GBU
		validateTeam: function(team, format) {
			if (team.length < 3) return ['You must bring at least 3 Pokemon.'];
		}
	},
	{
		name: "XY Battle Spot Special (beta)",
		section: "XY Singles",

		onBegin: function() {
			this.debug('cutting down to 3');
			this.p1.pokemon = this.p1.pokemon.slice(0,3);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0,3);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview GBU'],
		noPokebank: true,
		banlist: [], // The neccessary bans are in Standard GBU
		validateTeam: function(team, format) {
			for (var i = 0; i < team.length; i++) {
				var template = this.getTemplate(team[i].species);
				if (template.num < 650) {
					return ['You may only use Pokemon from Gen 6'];
				}
			}
			if (team.length < 3) return ['You must bring at least 3 Pokemon.'];
		}
	},
	{
		name: "Pokebank OU (beta)",
		section: "XY Singles",

		ruleset: ['Pokemon', 'Standard Pokebank', 'Team Preview'],
		banlist: ['Uber', 'Soul Dew']
	},
	{
		name: "Pokebank Ubers (beta)",
		section: "XY Singles",

		ruleset: ['Pokemon', 'Standard Pokebank', 'Team Preview'],
		banlist: []
	},
	{
		name: "Pokebank LC (beta)",
		section: "XY Singles",

		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard Pokebank', 'Team Preview', 'Little Cup'],
		banlist: ['Sonicboom', 'Dragon Rage', 'Scyther']
	},
	{
		name: "Custom Game",
		section: "XY Singles",

		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 1000,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview']
	},

	// BW2 Singles
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 5] CAP Cawmodore Playtest",
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['CAP Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew', "Tomohawk", "Necturna", "Mollux", "Aurumoth", "Malaconda", "Syclant", "Revenankh", "Pyroak", "Fidgit", "Stratagem", "Arghonaut", "Kitsunoh", "Cyclohm", "Colossoil", "Krilowatt", "Voodoom"]
	},
	{
		name: "[Gen 5] Random Battle",
		section: "BW2 Singles",

		mod: 'gen5',
		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod']
	},
	{
		name: "[Gen 5] Unrated Random Battle",
		section: "BW2 Singles",

		mod: 'gen5',
		team: 'random',
		challengeShow: false,
		rated: false,
		ruleset: ['Random Battle']
	},
	{
		name: "[Gen 5] OU",
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	},
	{
		name: "[Gen 5] Ubers",
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['Pokemon', 'Team Preview', 'Standard Ubers'],
		banlist: []
	},
	{
		name: "[Gen 5] UU",
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['[Gen 5] OU'],
		banlist: ['OU', 'BL', 'Drought', 'Sand Stream']
	},
	{
		name: "[Gen 5] RU",
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['[Gen 5] UU'],
		banlist: ['UU', 'BL2', 'Shell Smash + Baton Pass', 'Snow Warning']
	},
	{
		name: "[Gen 5] NU",
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['[Gen 5] RU'],
		banlist: ['RU','BL3', 'Prankster + Assist']
	},
	{
		name: "[Gen 5] LC",
		section: "BW2 Singles",

		mod: 'gen5',
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Sonicboom', 'Dragon Rage', 'Berry Juice', 'Carvanha', 'Meditite', 'Gligar', 'Scyther', 'Sneasel', 'Tangela', 'Vulpix', 'Yanma', 'Soul Dew']
	},
	{
		name: "[Gen 5] GBU Singles",
		section: "BW2 Singles",

		mod: 'gen5',
		validateSet: function(set) {
			if (!set.level || set.level >= 50) set.forcedLevel = 50;
			return [];
		},
		onBegin: function() {
			this.debug('cutting down to 3');
			this.p1.pokemon = this.p1.pokemon.slice(0,3);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0,3);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		ruleset: ['Pokemon', 'Species Clause', 'Item Clause', 'Team Preview GBU'],
		banlist: ['Unreleased', 'Illegal', 'Sky Drop', 'Dark Void', 'Soul Dew',
			'Mewtwo', 'Mew', 'Lugia', 'Ho-Oh', 'Celebi', 'Kyogre', 'Groudon',
			'Rayquaza', 'Jirachi',  'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Deoxys-Defense',
			'Chatot', 'Dialga', 'Palkia', 'Giratina', 'Giratina-Origin', 'Phione',
			'Manaphy',  'Darkrai', 'Shaymin', 'Shaymin-Sky',
			'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire',
			'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison',
			'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water',
			'Victini', 'Reshiram', 'Zekrom', 'Kyurem', 'Kyurem-Black', 'Kyurem-White',
			'Keldeo', 'Keldeo-Resolute',  'Meloetta', 'Genesect'
		]
	},
	{
		name: "[Gen 5] Custom Game",
		section: "BW2 Singles",

		mod: 'gen5',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 1000,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview']
	},

	// XY Doubles
	///////////////////////////////////////////////////////////////////

	{
		name: "Smogon Doubles (beta)",
		section: "XY Doubles",
		column: 2,

		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		noPokebank: true,
		banlist: ['Dark Void', 'Soul Dew',
			'Mewtwo',
			'Lugia',
			'Ho-Oh',
			'Kyogre',
			'Groudon',
			'Rayquaza',
			'Dialga',
			'Palkia',
			'Giratina', 'Giratina-Origin',
			'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fairy', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water',
			'Reshiram',
			'Zekrom',
			'Kyurem-White',
			'Xerneas',
			'Yveltal'
		]
	},
	{
		name: "Pokebank Smogon Doubles (beta)",
		section: "XY Doubles",
		column: 2,

		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard Pokebank', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Dark Void', 'Soul Dew',
			'Mewtwo',
			'Lugia',
			'Ho-Oh',
			'Kyogre',
			'Groudon',
			'Rayquaza',
			'Dialga',
			'Palkia',
			'Giratina', 'Giratina-Origin',
			'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fairy', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water',
			'Reshiram',
			'Zekrom',
			'Kyurem-White',
			'Xerneas',
			'Yveltal'
		]
	},
	{
		name: "XY Battle Spot Doubles (beta)",
		section: "XY Doubles",
		column: 2,

		gameType: 'doubles',
		onBegin: function() {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0,4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0,4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview VGC'],
		noPokebank: true,
		banlist: [], // The neccessary bans are in Standard GBU
		validateTeam: function(team, format) {
			if (team.length < 4) return ['You must bring at least 4 Pokemon.'];
		}
	},
	{
		name: "VGC 2014 (beta)",
		section: "XY Doubles",
		column: 2,

		gameType: 'doubles',
		onBegin: function() {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0,4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0,4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview VGC'],
		requirePentagon: true,
		banlist: [], // The neccessary bans are in Standard GBU
		validateTeam: function(team, format) {
			if (team.length < 4) return ['You must bring at least 4 Pokemon.'];
		},
		validateSet: function(set) {
			var validKalosDex = {
				"Abomasnow":1,"Abomasnow-Mega":1,"Abra":1,"Absol":1,"Absol-Mega":1,"Accelgor":1,"Aegislash":1,"Aegislash-Blade":1,"Aerodactyl":1,"Aerodactyl-Mega":1,"Aggron":1,"Aggron-Mega":1,"Alakazam":1,"Alakazam-Mega":1,"Alomomola":1,"Altaria":1,"Amaura":1,"Amoonguss":1,"Ampharos":1,"Ampharos-Mega":1,"Arbok":1,"Ariados":1,"Aromatisse":1,"Aron":1,"Articuno":1,"Audino":1,"Aurorus":1,"Avalugg":1,"Axew":1,"Azumarill":1,"Azurill":1,"Bagon":1,"Banette":1,"Banette-Mega":1,"Barbaracle":1,"Barboach":1,"Basculin":1,"Basculin-Blue-Striped":1,"Beartic":1,"Beedrill":1,"Bellossom":1,"Bellsprout":1,"Bergmite":1,"Bibarel":1,"Bidoof":1,"Binacle":1,"Bisharp":1,"Blastoise":1,"Blastoise-Mega":1,"Boldore":1,"Bonsly":1,"Braixen":1,"Budew":1,"Buizel":1,"Bulbasaur":1,"Bunnelby":1,"Burmy":1,"Butterfree":1,"Carbink":1,"Carnivine":1,"Carvanha":1,"Caterpie":1,"Chandelure":1,"Charizard":1,"Charizard-Mega-X":1,"Charizard-Mega-Y":1,"Charmander":1,"Charmeleon":1,"Chatot":1,"Chesnaught":1,"Chespin":1,"Chimecho":1,"Chinchou":1,"Chingling":1,"Clamperl":1,"Clauncher":1,"Clawitzer":1,"Cloyster":1,"Combee":1,"Conkeldurr":1,"Corphish":1,"Corsola":1,"Crawdaunt":1,"Croagunk":1,"Crobat":1,"Crustle":1,"Cryogonal":1,"Cubchoo":1,"Cubone":1,"Dedenne":1,"Deino":1,"Delcatty":1,"Delibird":1,"Delphox":1,"Diggersby":1,"Diglett":1,"Ditto":1,"Dodrio":1,"Doduo":1,"Doublade":1,"Dragalge":1,"Dragonair":1,"Dragonite":1,"Drapion":1,"Dratini":1,"Drifblim":1,"Drifloon":1,"Druddigon":1,"Ducklett":1,"Dugtrio":1,"Dunsparce":1,"Duosion":1,"Durant":1,"Dwebble":1,"Eevee":1,"Ekans":1,"Electrike":1,"Electrode":1,"Emolga":1,"Escavalier":1,"Espeon":1,"Espurr":1,"Exeggcute":1,"Exeggutor":1,"Exploud":1,"Farfetch'd":1,"Fearow":1,"Fennekin":1,"Ferroseed":1,"Ferrothorn":1,"Flaaffy":1,"Flabebe":1,"Flareon":1,"Fletchinder":1,"Fletchling":1,"Floatzel":1,"Floette":1,"Florges":1,"Flygon":1,"Foongus":1,"Fraxure":1,"Froakie":1,"Frogadier":1,"Furfrou":1,"Furret":1,"Gabite":1,"Gallade":1,"Garbodor":1,"Garchomp":1,"Garchomp-Mega":1,"Gardevoir":1,"Gardevoir-Mega":1,"Gastly":1,"Gengar":1,"Gengar-Mega":1,"Geodude":1,"Gible":1,"Gigalith":1,"Glaceon":1,"Gligar":1,"Gliscor":1,"Gloom":1,"Gogoat":1,"Golbat":1,"Goldeen":1,"Golduck":1,"Golem":1,"Golett":1,"Golurk":1,"Goodra":1,"Goomy":1,"Gorebyss":1,"Gothita":1,"Gothitelle":1,"Gothorita":1,"Gourgeist-Small":1,"Gourgeist":1,"Gourgeist-Large":1,"Gourgeist-Super":1,"Granbull":1,"Graveler":1,"Greninja":1,"Grumpig":1,"Gulpin":1,"Gurdurr":1,"Gyarados":1,"Gyarados-Mega":1,"Hariyama":1,"Haunter":1,"Hawlucha":1,"Haxorus":1,"Heatmor":1,"Heliolisk":1,"Helioptile":1,"Heracross":1,"Heracross-Mega":1,"Hippopotas":1,"Hippowdon":1,"Honchkrow":1,"Honedge":1,"Hoothoot":1,"Hoppip":1,"Horsea":1,"Houndoom":1,"Houndoom-Mega":1,"Houndour":1,"Huntail":1,"Hydreigon":1,"Igglybuff":1,"Illumise":1,"Inkay":1,"Ivysaur":1,"Jigglypuff":1,"Jolteon":1,"Jumpluff":1,"Jynx":1,"Kadabra":1,"Kakuna":1,"Kangaskhan":1,"Kangaskhan-Mega":1,"Karrablast":1,"Kecleon":1,"Kingdra":1,"Kirlia":1,"Klefki":1,"Krokorok":1,"Krookodile":1,"Lairon":1,"Lampent":1,"Lanturn":1,"Lapras":1,"Larvitar":1,"Leafeon":1,"Ledian":1,"Ledyba":1,"Lickilicky":1,"Lickitung":1,"Liepard":1,"Linoone":1,"Litleo":1,"Litwick":1,"Lombre":1,"Lotad":1,"Loudred":1,"Lucario":1,"Lucario-Mega":1,"Ludicolo":1,"Lunatone":1,"Luvdisc":1,"Machamp":1,"Machoke":1,"Machop":1,"Magcargo":1,"Magikarp":1,"Magnemite":1,"Magneton":1,"Magnezone":1,"Makuhita":1,"Malamar":1,"Mamoswine":1,"Manectric":1,"Manectric-Mega":1,"Mantine":1,"Mantyke":1,"Mareep":1,"Marill":1,"Marowak":1,"Masquerain":1,"Mawile":1,"Mawile-Mega":1,"Medicham":1,"Medicham-Mega":1,"Meditite":1,"Meowstic":1,"Metapod":1,"Mewtwo":1,"Mewtwo-Mega-X":1,"Mewtwo-Mega-Y":1,"Mienfoo":1,"Mienshao":1,"Mightyena":1,"Miltank":1,"Mime Jr.":1,"Minun":1,"Moltres":1,"Mothim":1,"Mr. Mime":1,"Munchlax":1,"Murkrow":1,"Nidoking":1,"Nidoqueen":1,"Nidoran-M":1,"Nidoran-F":1,"Nidorina":1,"Nidorino":1,"Nincada":1,"Ninjask":1,"Noctowl":1,"Noibat":1,"Noivern":1,"Nosepass":1,"Octillery":1,"Oddish":1,"Onix":1,"Pachirisu":1,"Pancham":1,"Pangoro":1,"Panpour":1,"Pansage":1,"Pansear":1,"Patrat":1,"Pawniard":1,"Pelipper":1,"Phantump":1,"Pichu":1,"Pidgeot":1,"Pidgeotto":1,"Pidgey":1,"Pikachu":1,"Piloswine":1,"Pinsir":1,"Pinsir-Mega":1,"Plusle":1,"Politoed":1,"Poliwag":1,"Poliwhirl":1,"Poliwrath":1,"Poochyena":1,"Probopass":1,"Psyduck":1,"Pumpkaboo-Small":1,"Pumpkaboo":1,"Pumpkaboo-Large":1,"Pumpkaboo-Super":1,"Pupitar":1,"Purrloin":1,"Pyroar":1,"Quagsire":1,"Quilladin":1,"Qwilfish":1,"Raichu":1,"Ralts":1,"Relicanth":1,"Remoraid":1,"Reuniclus":1,"Rhydon":1,"Rhyhorn":1,"Rhyperior":1,"Riolu":1,"Roggenrola":1,"Roselia":1,"Roserade":1,"Rotom":1,"Rotom-Heat":1,"Rotom-Wash":1,"Rotom-Frost":1,"Rotom-Fan":1,"Rotom-Mow":1,"Sableye":1,"Salamence":1,"Sandile":1,"Sandshrew":1,"Sandslash":1,"Sawk":1,"Scatterbug":1,"Scizor":1,"Scizor-Mega":1,"Scolipede":1,"Scrafty":1,"Scraggy":1,"Scyther":1,"Seadra":1,"Seaking":1,"Sentret":1,"Seviper":1,"Sharpedo":1,"Shedinja":1,"Shelgon":1,"Shellder":1,"Shelmet":1,"Shuckle":1,"Shuppet":1,"Sigilyph":1,"Simipour":1,"Simisage":1,"Simisear":1,"Skarmory":1,"Skiddo":1,"Skiploom":1,"Skitty":1,"Skorupi":1,"Skrelp":1,"Skuntank":1,"Sliggoo":1,"Slowbro":1,"Slowking":1,"Slowpoke":1,"Slugma":1,"Slurpuff":1,"Smeargle":1,"Smoochum":1,"Sneasel":1,"Snorlax":1,"Snover":1,"Snubbull":1,"Solosis":1,"Solrock":1,"Spearow":1,"Spewpa":1,"Spinarak":1,"Spinda":1,"Spoink":1,"Spritzee":1,"Squirtle":1,"Staraptor":1,"Staravia":1,"Starly":1,"Starmie":1,"Staryu":1,"Steelix":1,"Stunfisk":1,"Stunky":1,"Sudowoodo":1,"Surskit":1,"Swablu":1,"Swalot":1,"Swanna":1,"Swellow":1,"Swinub":1,"Swirlix":1,"Swoobat":1,"Sylveon":1,"Taillow":1,"Talonflame":1,"Tauros":1,"Teddiursa":1,"Tentacool":1,"Tentacruel":1,"Throh":1,"Timburr":1,"Torkoal":1,"Toxicroak":1,"Trapinch":1,"Trevenant":1,"Trubbish":1,"Tyranitar":1,"Tyranitar-Mega":1,"Tyrantrum":1,"Tyrunt":1,"Umbreon":1,"Ursaring":1,"Vanillish":1,"Vanillite":1,"Vanilluxe":1,"Vaporeon":1,"Venipede":1,"Venusaur":1,"Venusaur-Mega":1,"Vespiquen":1,"Vibrava":1,"Victreebel":1,"Vileplume":1,"Vivillon":1,"Volbeat":1,"Voltorb":1,"Wailmer":1,"Wailord":1,"Wartortle":1,"Watchog":1,"Weavile":1,"Weedle":1,"Weepinbell":1,"Whirlipede":1,"Whiscash":1,"Whismur":1,"Wigglytuff":1,"Wingull":1,"Wobbuffet":1,"Woobat":1,"Wooper":1,"Wormadam":1,"Wormadam-Sandy":1,"Wormadam-Trash":1,"Wynaut":1,"Xerneas":1,"Yanma":1,"Yanmega":1,"Yveltal":1,"Zangoose":1,"Zapdos":1,"Zigzagoon":1,"Zoroark":1,"Zorua":1,"Zubat":1,"Zweilous":1,"Zygarde":1
			};
			if (!(set.species in validKalosDex)) {
				return [set.species+" is not in the Kalos Pokedex."]
			}
		}
	},
	{
		name: "Doubles Challenge Cup",
		section: 'XY Doubles',

		gameType: 'doubles',
		team: 'randomCC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod']
	},
	{
		name: "Doubles Custom Game",
		section: "XY Doubles",
		column: 2,

		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		ruleset: ['Team Preview']
	},

	// BW2 Doubles
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 5] Smogon Doubles",
		section: 'BW2 Doubles',
		column: 2,

		mod: 'gen5',
		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal', 'Dark Void', 'Soul Dew', 'Sky Drop',
			'Mewtwo',
			'Lugia',
			'Ho-Oh',
			'Kyogre',
			'Groudon',
			'Rayquaza',
			'Dialga',
			'Palkia',
			'Giratina', 'Giratina-Origin',
			'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water',
			'Reshiram',
			'Zekrom',
			'Kyurem-White'
		]
	},
	{
		name: "[Gen 5] Doubles VGC 2013",
		section: 'BW2 Doubles',

		mod: 'gen5',
		gameType: 'doubles',
		onBegin: function() {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0,4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0,4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Team Preview VGC', 'Species Clause', 'Item Clause'],
		banlist: ['Unreleased', 'Illegal', 'Sky Drop', 'Dark Void', 'Soul Dew',
			'Mewtwo',
			'Mew',
			'Lugia',
			'Ho-Oh',
			'Celebi',
			'Kyogre',
			'Groudon',
			'Rayquaza',
			'Jirachi',
			'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Deoxys-Defense',
			'Chatot',
			'Dialga',
			'Palkia',
			'Giratina', 'Giratina-Origin',
			'Phione',
			'Manaphy',
			'Darkrai',
			'Shaymin', 'Shaymin-Sky',
			'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water',
			'Victini',
			'Reshiram',
			'Zekrom',
			'Kyurem', 'Kyurem-Black', 'Kyurem-White',
			'Keldeo', 'Keldeo-Resolute',
			'Meloetta',
			'Genesect'
		]
	},
	{
		name: "[Gen 5] Doubles Custom Game",
		section: 'BW2 Doubles',

		mod: 'gen5',
		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 1000,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview']
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		name: "[Seasonal] Thankless Thanksgiving",
		section: "OM of the Month",

		team: 'randomSeasonal',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod']
	},
	{
		name: "Inverse Battle",
		section: "OM of the Month",

		mod: 'inverse',
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: [
			'Ho-Oh',
			'Kangaskhanite',
			'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fairy', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water',
			'Mewtwo',
			'Xerneas'
		]
	},
	{
		name: "CAP (beta)",
		section: "Other Metagames",

		searchShow: false,
		ruleset: ['CAP Pokemon', 'Standard Pokebank', 'Team Preview'],
		banlist: ['Uber', 'Cawmodore', 'Soul Dew']
	},
	{
		name: "Challenge Cup",
		section: "Other Metagames",

		team: 'randomCC',
		ruleset: ['Pokemon', 'HP Percentage Mod']
	},
	{
		name: "Challenge Cup 1-vs-1",
		section: "Other Metagames",

		team: 'randomCC',
		ruleset: ['Pokemon', 'Team Preview 1v1', 'HP Percentage Mod'],
		onBegin: function() {
			this.debug('Cutting down to 1');
			this.p1.pokemon = this.p1.pokemon.slice(0, 1);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 1);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Hackmons",
		section: "Other Metagames",

		ruleset: ['Pokemon'],
		banlist: []
	},
	{
		name: "Balanced Hackmons",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'OHKO Clause'],
		banlist: ['Wonder Guard', 'Shadow Tag', 'Arena Trap', 'Pure Power', 'Huge Power']
	},
	{
		name: "Gen-NEXT OU",
		section: "Other Metagames",

		mod: 'gennext',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard NEXT', 'Team Preview'],
		banlist: ['Uber']
	},
	{
		name: "[Gen 5] OU Monotype",
		section: "Other Metagames",

		mod: 'gen5',
		ruleset: ['Pokemon', 'Standard', 'Same Type Clause', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	},
	{
		name: "[Gen 5] Glitchmons",
		section: "Other Metagames",

		mod: 'gen5',
		searchShow: false,
		ruleset: ['Pokemon', 'Team Preview', 'HP Percentage Mod'],
		banlist: ['Illegal', 'Unreleased'],
		mimicGlitch: true
	},
	{
		name: "[Gen 5] 1v1",
		section: 'Other Metagames',

		mod: 'gen5',
		onBegin: function() {
			this.p1.pokemon = this.p1.pokemon.slice(0,1);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0,1);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Unreleased', 'Illegal', 'Soul Dew',
			'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water',
			'Blaziken',
			'Darkrai',
			'Deoxys', 'Deoxys-Attack',
			'Dialga',
			'Giratina', 'Giratina-Origin',
			'Groudon',
			'Ho-Oh',
			'Kyogre',
			'Kyurem-White',
			'Lugia',
			'Mewtwo',
			'Palkia',
			'Rayquaza',
			'Reshiram',
			'Shaymin-Sky',
			'Zekrom',
			'Memento', 'Explosion', 'Perish Song', 'Destiny Bond', 'Healing Wish', 'Selfdestruct', 'Lunar Dance', 'Final Gambit',
			'Focus Sash'
		]
	},
	{
		name: "[Gen 5] PU",
		section: "Other Metagames",

		mod: 'gen5',
		searchShow: false,
		ruleset: ['NU'],
		banlist: ["Charizard", "Wartortle", "Kadabra", "Golem", "Haunter", "Exeggutor", "Weezing", "Kangaskhan", "Pinsir", "Lapras", "Ampharos", "Misdreavus", "Piloswine", "Miltank", "Ludicolo", "Swellow", "Gardevoir", "Ninjask", "Torkoal", "Cacturne", "Altaria", "Armaldo", "Gorebyss", "Regirock", "Regice", "Bastiodon", "Floatzel", "Drifblim", "Skuntank", "Lickilicky", "Probopass", "Rotom-Fan", "Samurott", "Musharna", "Gurdurr", "Sawk", "Carracosta", "Garbodor", "Sawsbuck", "Alomomola", "Golurk", "Braviary", "Electabuzz", "Electrode", "Liepard", "Tangela", "Eelektross", "Ditto", "Seismitoad", "Zangoose", "Roselia", "Serperior", "Metang", "Tauros", "Cradily", "Primeape", "Scolipede", "Jynx", "Basculin", "Gigalith", "Camerupt", "Golbat"]
	},
	{
		name: "[Gen 5] STABmons",
		section: "Other Metagames",

		mod: 'gen5',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Drizzle ++ Swift Swim', 'Soul Dew', 'Soul Dew',
			'Mewtwo', 'Lugia', 'Ho-Oh', 'Blaziken', 'Kyogre', 'Groudon', 'Rayquaza', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Palkia', 'Giratina', 'Giratina-Origin', 'Manaphy', 'Shaymin-Sky',
			'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water',
			'Reshiram', 'Zekrom', 'Kyurem-White', 'Genesect'
		]
	},
	{
		name: "[Gen 5] Budgetmons",
		section: "Other Metagames",

		mod: 'gen5',
		searchShow: false,
		ruleset: ['OU'],
		banlist: [],
		validateTeam: function(team, format) {
			var bst = 0;
			for (var i=0; i<team.length; i++) {
				var template = this.getTemplate(team[i].species);
				Object.values(template.baseStats, function(value) {
					bst += value;
				});
			}
			if (bst > 2300) return ['The combined BST of your team is greater than 2300.'];
		}
	},
	{
		name: "[Gen 5] Ability Exchange",
		section: "Other Metagames",

		mod: 'gen5',
		searchShow: false,
		ruleset: ['Pokemon', 'Ability Exchange Pokemon', 'Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal', 'Ignore Illegal Abilities', 'Drizzle ++ Swift Swim', 'Soul Dew', 'Drought ++ Chlorophyll', 'Sand Stream ++ Sand Rush',
			'Mewtwo', 'Lugia', 'Ho-Oh', 'Blaziken', 'Kyogre', 'Groudon', 'Rayquaza', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Dialga', 'Palkia', 'Giratina', 'Giratina-Origin', 'Manaphy', 'Darkrai', 'Shaymin-Sky',
			'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water',
			'Excadrill', 'Tornadus-Therian', 'Thundurus', 'Reshiram', 'Zekrom', 'Landorus', 'Kyurem-White', 'Genesect', 'Slaking', 'Regigigas'
		]
	},

	// Past Generations
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 4] OU (beta)",
		section: "Past Generations",

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber'],
		
		column: 2
	},
	{
		name: "[Gen 4] UU (beta)",
		section: "Past Generations",

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'OU', 'BL']
	},
	{
		name: "[Gen 4] Hackmons",
		section: "Past Generations",

		mod: 'gen4',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod'],
		banlist: []
	},
	{
		name: "[Gen 4] Custom Game",
		section: "Past Generations",

		mod: 'gen4',
		searchShow: false,
		debug: true,
		ruleset: []
	},
	{
		name: "[Gen 3] Hackmons",
		section: "Past Generations",

		mod: 'gen3',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod'],
		banlist: []
	},
	{
		name: "[Gen 3] Custom Game",
		section: "Past Generations",

		mod: 'gen3',
		searchShow: false,
		debug: true,
		ruleset: []
	},
	{
		name: "[Gen 2] OU (beta)",
		section: "Past Generations",

		mod: 'gen2',
		debug: true,
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'Mean Look + Hypnosis + Perish Song']
	},
	{
		name: "[Gen 2] Custom Game",
		section: "Past Generations",

		mod: 'gen2',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon']
	},
	{
		name: "[Gen 1] OU (beta)",
		section: "Past Generations",

		mod: 'gen1',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber']
	},
	{
		name: "[Gen 1] Custom Game",
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon']
	}

];
