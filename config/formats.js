// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.js

exports.Formats = [

	// XY Singles
	///////////////////////////////////////////////////////////////////


	{
		name: "Random Battle",
		section: "Random Formats",

		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod']
	},
	{
		name: "Unrated Random Battle",
		section: "Random Formats",

		team: 'random',
		challengeShow: false,
		rated: false,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod']
	},
	{
		name: "Random Monotype",
		section: "Random Formats",

		team: 'randommonotype',
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod']
	},
	{
		name: "Random LC",
		section: "Random Formats",

		maxLevel: 5,
		team: 'randomlc',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod'],
		banlist: ['Dragon Rage', 'Sonic Boom', 'Swagger', 'LC Uber', 'Gligar', 'Misdreavus']
	},
	{
		name: "Random Doubles Battle",
		section: "Random Formats",

		gameType: 'doubles',
		team: 'randomDoubles',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod']
	},
	{
		name: "Random Triples Battle",
		section: "Random Formats",

		gameType: 'triples',
		team: 'randomDoubles',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod']
	},
	{
		name: "Challenge Cup",
		section: "Random Formats",

		team: 'randomCC',
		ruleset: ['Pokemon', 'HP Percentage Mod']
	},
	{
		name: "Challenge Cup 1-vs-1",
		section: "Random Formats",

		team: 'randomCC',
		ruleset: ['Pokemon', 'Team Preview 1v1', 'HP Percentage Mod'],
		onBegin: function () {
			this.debug('Cutting down to 1');
			this.p1.pokemon = this.p1.pokemon.slice(0, 1);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 1);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},

	{
		name: "Doubles Challenge Cup",
		section: "Random Formats",

		gameType: 'doubles',
		team: 'randomCC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod']
	},

	{
		name: "Triples Challenge Cup",
		section: "Random Formats",

		gameType: 'triples',
		team: 'randomCC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod']
	},
		{
		name: "Random Metronome",
		section: "Random Formats",

		team: 'randomMetronome',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod']
	},
  	{
		name: "Balanced Hackmons Challenge Cup",
		section: "Random Formats",
		
        	team: 'randomCCBH',
        	searchShow: false,
        	ruleset: ['Pokemon', 'HP Percentage Mod']
    	},
    	{
		name: "Balanced Hackmons Challenge Cup 1-vs-1",
		section: "Random Formats",
		
        	team: 'randomCCBH',
        	searchShow: false,
        	ruleset: ['Pokemon', 'Team Preview 1v1', 'HP Percentage Mod'],
        	onBegin: function () {
			this.debug('Cutting down to 1');
			this.p1.pokemon = this.p1.pokemon.slice(0, 1);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 1);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
    	},
	{
		name: "OU",
		section: "XY Singles",

		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite']
	},
	{
		name: "Ubers",
		section: "XY Singles",

		ruleset: ['Pokemon', 'Standard Ubers', 'Swagger Clause', 'Team Preview', 'Mega Rayquaza Ban Mod'],
		banlist: []
	},
	{
		name: "UU",
		section: "XY Singles",

		ruleset: ['OU'],
		banlist: ['OU', 'BL', 'Altarianite', 'Diancite', 'Heracronite', 'Gardevoirite', 'Medichamite', 'Metagrossite',
			'Drizzle', 'Drought', 'Shadow Tag'
		]
	},
	{
		name: "RU",
		section: "XY Singles",

		ruleset: ['UU'],
		banlist: ['UU', 'BL2', 'Galladite', 'Houndoominite']
	},
	{
		name: "NU",
		section: "XY Singles",

		ruleset: ['RU'],
		banlist: ['RU', 'BL3']
	},
	{
		name: "LC",
		section: "XY Singles",

		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Dragon Rage', 'Sonic Boom', 'Swagger', 'LC Uber', 'Gligar']
	},
	{
		name: "Anything Goes",
		section: "XY Singles",

		ruleset: ['Pokemon', 'Endless Battle Clause', 'HP Percentage Mod', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal']
	},
	/*{
		name: "CAP Plasmanta Playtest",
		section: "XY Singles",

		ruleset: ['CAP Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Uber', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Soul Dew',
			'Tomohawk', 'Necturna', 'Mollux', 'Aurumoth', 'Malaconda', 'Cawmodore', 'Volkraken', 'Syclant', 'Revenankh', 'Pyroak', 'Fidgit', 'Stratagem', 'Arghonaut', 'Kitsunoh', 'Cyclohm', 'Colossoil', 'Krilowatt', 'Voodoom'
		]
	},*/
	{
		name: "Battle Spot Singles",
		section: "XY Singles",

		onBegin: function () {
			this.debug('cutting down to 3');
			this.p1.pokemon = this.p1.pokemon.slice(0, 3);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 3);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview GBU'],
		banlist: [], // The necessary bans are in Standard GBU
		validateTeam: function (team, format) {
			if (team.length < 3) return ['You must bring at least three Pokémon.'];
		}
	},
	{
		name: "Custom Game",
		section: "XY Singles",

		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview']
	},

	// XY Doubles
	///////////////////////////////////////////////////////////////////

	{
		name: "Smogon Doubles",
		section: "XY Doubles",

		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard Doubles', 'Team Preview'],
		banlist: ['Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo',
			'Palkia', 'Rayquaza', 'Reshiram', 'Xerneas', 'Yveltal', 'Zekrom', 'Soul Dew', 'Dark Void'
		]
	},
	{
		name: "Smogon Doubles (current)",
		section: "XY Doubles",

		gameType: 'doubles',
		challengeShow: false,
		ruleset: ['Smogon Doubles']
	},
	{
		name: "Smogon Doubles (suspect test)",
		section: "XY Doubles",

		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard Doubles', 'Team Preview'],
		banlist: ['Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo',
			'Palkia', 'Rayquaza', 'Reshiram', 'Xerneas', 'Yveltal', 'Zekrom', 'Salamencite', 'Soul Dew', 'Dark Void'
		]
	},
	{
		name: "Smogon Doubles Ubers",
		section: "XY Doubles",

		gameType: 'doubles',
		ruleset: ['Pokemon', 'Species Clause', 'Moody Clause', 'OHKO Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal', 'Dark Void']
	},
	{
		name: "Smogon Doubles UU",
		section: "XY Doubles",

		gameType: 'doubles',
		ruleset: ['Smogon Doubles'],
		banlist: ['Abomasnow', 'Aegislash', 'Amoonguss', 'Aromatisse', 'Azumarill', 'Bisharp', 'Breloom', 'Chandelure', 'Charizard', 'Conkeldurr',
			'Cresselia', 'Diancie', 'Dragonite', 'Dusclops', 'Excadrill', 'Ferrothorn', 'Garchomp', 'Gardevoir', 'Gengar', 'Greninja',
			'Gyarados', 'Heatran', 'Hitmontop', 'Hydreigon', 'Jellicent', 'Kangaskhan', 'Keldeo', 'Kyurem-Black', 'Landorus-Therian', 'Latios',
			'Ludicolo', 'Mamoswine', 'Manectric', 'Mawile', 'Politoed', 'Rhyperior', 'Rotom-Heat', 'Rotom-Wash', 'Sableye', 'Salamence',
			'Scizor', 'Scrafty', 'Shaymin-Sky', 'Sylveon', 'Talonflame', 'Terrakion', 'Thundurus', 'Thundurus-Therian', 'Togekiss', 'Tyranitar',
			'Venusaur', 'Weavile', 'Whimsicott', 'Zapdos'
		]
	},
	{
		name: "Battle Spot Doubles",
		section: "XY Doubles",

		gameType: 'doubles',
		onBegin: function () {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0, 4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview VGC'],
		validateTeam: function (team, format) {
			if (team.length < 4) return ['You must bring at least four Pokémon.'];
		}
	},
	{
		name: "Battle Spot Special 7",
		section: "XY Doubles",

		gameType: 'doubles',
		maxForcedLevel: 50,
		validateTeam: function (team, format) {
			if (team.length < 4) return ['You must bring at least four Pokémon.'];
		},
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview VGC'],
		banlist: ['Abomasnow', 'Accelgor', 'Aegislash', 'Aerodactyl', 'Aipom', 'Alomomola', 'Amaura', 'Ambipom', 'Amoonguss', 'Ampharos',
			'Arbok', 'Arcanine', 'Arceus', 'Archen', 'Archeops', 'Ariados', 'Aromatisse', 'Articuno', 'Audino', 'Aurorus',
			'Avalugg', 'Axew', 'Azelf', 'Barbaracle', 'Basculin', 'Basculin-Blue-Striped', 'Bastiodon', 'Bayleef', 'Beartic', 'Beedrill',
			'Beheeyem', 'Bellsprout', 'Bergmite', 'Bibarel', 'Bidoof', 'Binacle', 'Bisharp', 'Blastoise', 'Blissey', 'Blitzle',
			'Boldore', 'Bonsly', 'Bouffalant', 'Braixen', 'Braviary', 'Bronzong', 'Bronzor', 'Buizel', 'Bulbasaur', 'Buneary',
			'Bunnelby', 'Burmy', 'Butterfree', 'Carbink', 'Carnivine', 'Carracosta', 'Caterpie', 'Celebi', 'Chandelure', 'Chansey',
			'Charizard', 'Charmander', 'Charmeleon', 'Chatot', 'Cherrim', 'Cherubi', 'Chesnaught', 'Chespin', 'Chikorita', 'Chimchar',
			'Cinccino', 'Clauncher', 'Clawitzer', 'Clefable', 'Clefairy', 'Cleffa', 'Cloyster', 'Cobalion', 'Cofagrigus', 'Combee',
			'Conkeldurr', 'Cottonee', 'Cranidos', 'Cresselia', 'Croagunk', 'Croconaw', 'Crustle', 'Cryogonal', 'Cubchoo', 'Cubone',
			'Cyndaquil', 'Darkrai', 'Darmanitan', 'Darumaka', 'Dedenne', 'Deerling', 'Deino', 'Delibird', 'Delphox', 'Deoxys',
			'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Dewgong', 'Dewott', 'Dialga', 'Diancie', 'Diggersby', 'Diglett', 'Ditto',
			'Doublade', 'Dragalge', 'Dragonair', 'Dragonite', 'Drapion', 'Dratini', 'Drifblim', 'Drifloon', 'Drilbur', 'Drowzee',
			'Druddigon', 'Ducklett', 'Dugtrio', 'Dunsparce', 'Duosion', 'Durant', 'Dwebble', 'Eelektrik', 'Eelektross', 'Eevee',
			'Ekans', 'Electabuzz', 'Electivire', 'Elekid', 'Elgyem', 'Emboar', 'Emolga', 'Empoleon', 'Entei', 'Escavalier',
			'Espeon', 'Espurr', 'Excadrill', 'Exeggcute', 'Exeggutor', "Farfetch'd", 'Fearow', 'Fennekin', 'Feraligatr', 'Ferroseed',
			'Ferrothorn', 'Finneon', 'Flaaffy', 'Flabebe', 'Flareon', 'Fletchinder', 'Fletchling', 'Floatzel', 'Floette', 'Florges',
			'Foongus', 'Forretress', 'Fraxure', 'Frillish', 'Froakie', 'Frogadier', 'Furfrou', 'Furret', 'Gabite', 'Galvantula',
			'Garbodor', 'Garchomp', 'Gastly', 'Gastrodon', 'Genesect', 'Gengar', 'Gible', 'Gigalith', 'Giratina', 'Giratina',
			'Giratina-Origin', 'Glaceon', 'Glameow', 'Gligar', 'Gliscor', 'Gogoat', 'Golett', 'Golurk', 'Goodra', 'Goomy',
			'Gothita', 'Gothitelle', 'Gothorita', 'Gourgeist', 'Gourgeist-Large', 'Gourgeist-Small', 'Gourgeist-Super', 'Granbull', 'Greninja', 'Grotle',
			'Groudon', 'Growlithe', 'Gurdurr', 'Happiny', 'Haunter', 'Hawlucha', 'Haxorus', 'Heatmor', 'Heatran', 'Heliolisk',
			'Helioptile', 'Herdier', 'Hippopotas', 'Hippowdon', 'Hitmonchan', 'Hitmonlee', 'Hitmontop', 'Ho-Oh', 'Honchkrow', 'Honedge',
			'Hoothoot', 'Hoppip', 'Houndoom', 'Houndour', 'Hydreigon', 'Hypno', 'Infernape', 'Inkay', 'Ivysaur', 'Jellicent',
			'Jirachi', 'Jolteon', 'Joltik', 'Jumpluff', 'Jynx', 'Kabuto', 'Kabutops', 'Kakuna', 'Kangaskhan', 'Karrablast',
			'Keldeo', 'Keldeo-Resolute', 'Kingler', 'Klang', 'Klefki', 'Klink', 'Klinklang', 'Krabby', 'Kricketot', 'Kricketune',
			'Krokorok', 'Krookodile', 'Kyogre', 'Kyurem', 'Kyurem-Black', 'Kyurem-White', 'Lampent', 'Landorus', 'Landorus-Therian', 'Lapras',
			'Larvesta', 'Larvitar', 'Leafeon', 'Leavanny', 'Ledian', 'Ledyba', 'Lickilicky', 'Lickitung', 'Liepard', 'Lilligant',
			'Lillipup', 'Litleo', 'Litwick', 'Lopunny', 'Lucario', 'Lugia', 'Lumineon', 'Luxio', 'Luxray', 'Magby',
			'Magmar', 'Magmortar', 'Malamar', 'Mamoswine', 'Manaphy', 'Mandibuzz', 'Mankey', 'Mantine', 'Mantyke', 'Maractus',
			'Mareep', 'Marowak', 'Meganium', 'Meloetta', 'Meowstic', 'Meowstic-F', 'Meowth', 'Mesprit', 'Metapod', 'Mew',
			'Mewtwo', 'Mienfoo', 'Mienshao', 'Miltank', 'Mime Jr.', 'Minccino', 'Misdreavus', 'Mismagius', 'Moltres', 'Monferno',
			'Mothim', 'Mr. Mime', 'Munchlax', 'Munna', 'Murkrow', 'Musharna', 'Nidoking', 'Nidoqueen', 'Nidoran-F', 'Nidoran-M',
			'Nidorina', 'Nidorino', 'Noctowl', 'Noibat', 'Noivern', 'Octillery', 'Omanyte', 'Omastar', 'Onix', 'Oshawott',
			'Pachirisu', 'Palkia', 'Palpitoad', 'Pancham', 'Pangoro', 'Panpour', 'Pansage', 'Pansear', 'Paras', 'Parasect',
			'Patrat', 'Pawniard', 'Persian', 'Petilil', 'Phantump', 'Phione', 'Pidgeot', 'Pidgeotto', 'Pidgey', 'Pidove',
			'Pignite', 'Piloswine', 'Pineco', 'Piplup', 'Politoed', 'Poliwag', 'Poliwhirl', 'Poliwrath', 'Ponyta', 'Porygon',
			'Porygon-Z', 'Porygon2', 'Primeape', 'Prinplup', 'Pumpkaboo', 'Pumpkaboo-Large', 'Pumpkaboo-Small', 'Pumpkaboo-Super', 'Pupitar', 'Purrloin',
			'Purugly', 'Pyroar', 'Quagsire', 'Quilava', 'Quilladin', 'Qwilfish', 'Raikou', 'Rampardos', 'Rapidash', 'Raticate',
			'Rattata', 'Rayquaza', 'Regigigas', 'Remoraid', 'Reshiram', 'Reuniclus', 'Riolu', 'Roggenrola', 'Rotom', 'Rotom-Fan',
			'Rotom-Frost', 'Rotom-Heat', 'Rotom-Mow', 'Rotom-Wash', 'Rufflet', 'Samurott', 'Sandile', 'Sawk', 'Sawsbuck', 'Scatterbug',
			'Scizor', 'Scolipede', 'Scrafty', 'Scraggy', 'Scyther', 'Seel', 'Seismitoad', 'Sentret', 'Serperior', 'Servine',
			'Sewaddle', 'Shaymin', 'Shaymin-Sky', 'Shellder', 'Shellos', 'Shelmet', 'Shieldon', 'Shinx', 'Shuckle', 'Sigilyph',
			'Simipour', 'Simisage', 'Simisear', 'Skiddo', 'Skiploom', 'Skorupi', 'Skrelp', 'Skuntank', 'Sliggoo', 'Slowbro',
			'Slowking', 'Slowpoke', 'Slurpuff', 'Smeargle', 'Smoochum', 'Sneasel', 'Snivy', 'Snorlax', 'Snover', 'Snubbull',
			'Solosis', 'Spearow', 'Spewpa', 'Spinarak', 'Spiritomb', 'Spritzee', 'Squirtle', 'Stantler', 'Staraptor', 'Staravia',
			'Starly', 'Steelix', 'Stoutland', 'Stunfisk', 'Stunky', 'Sudowoodo', 'Suicune', 'Sunflora', 'Sunkern', 'Swadloon',
			'Swanna', 'Swinub', 'Swirlix', 'Swoobat', 'Sylveon', 'Talonflame', 'Tangela', 'Tangrowth', 'Tauros', 'Teddiursa',
			'Tepig', 'Terrakion', 'Throh', 'Thundurus', 'Thundurus-Therian', 'Timburr', 'Tirtouga', 'Togekiss', 'Togepi', 'Togetic',
			'Tornadus', 'Tornadus-Therian', 'Torterra', 'Totodile', 'Toxicroak', 'Tranquill', 'Trevenant', 'Trubbish', 'Turtwig', 'Tympole',
			'Tynamo', 'Typhlosion', 'Tyranitar', 'Tyrantrum', 'Tyrogue', 'Tyrunt', 'Umbreon', 'Unfezant', 'Unown', 'Ursaring',
			'Uxie', 'Vanillish', 'Vanillite', 'Vanilluxe', 'Vaporeon', 'Venipede', 'Venomoth', 'Venonat', 'Venusaur', 'Vespiquen',
			'Victini', 'Victreebel', 'Virizion', 'Vivillon', 'Volcarona', 'Vullaby', 'Wartortle', 'Watchog', 'Weavile', 'Weedle',
			'Weepinbell', 'Whimsicott', 'Whirlipede', 'Woobat', 'Wooper', 'Wormadam', 'Wormadam-Sandy', 'Wormadam-Trash', 'Xerneas', 'Yamask',
			'Yanma', 'Yanmega', 'Yveltal', 'Zapdos', 'Zebstrika', 'Zekrom', 'Zoroark', 'Zorua', 'Zweilous', 'Zygarde',
			'Soul Dew'
		],
		onBegin: function () {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0, 4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "VGC 2014",
		section: "XY Doubles",

		gameType: 'doubles',
		onBegin: function () {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0, 4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview VGC', 'Kalos Pokedex'],
		requirePentagon: true,
		banlist: ['Red Orb', 'Blue Orb', 'Swampertite', 'Sceptilite', 'Sablenite', 'Altarianite', 'Galladite', 'Audinite', 'Metagrossite', 'Sharpedonite',
			'Slowbronite', 'Steelixite', 'Pidgeotite', 'Glalitite', 'Diancite', 'Cameruptite', 'Lopunnite', 'Salamencite', 'Beedrillite'
		],
		validateTeam: function (team, format) {
			if (team.length < 4) return ['You must bring at least four Pokémon.'];
		}
	},
	{
		name: "Doubles Custom Game",
		section: "XY Doubles",

		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		maxLevel: 9999,
		defaultLevel: 100,
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview']
	},

	// XY Triples
	///////////////////////////////////////////////////////////////////

	{
		name: "Smogon Triples",
		section: "XY Triples",

		gameType: 'triples',
		ruleset: ['Pokemon', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Team Preview'],
		banlist: ['Illegal', 'Unreleased', 'Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White',
			'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Xerneas', 'Yveltal', 'Zekrom',
			'Soul Dew', 'Dark Void', 'Perish Song'
		]
	},
	{
		name: "Battle Spot Triples",
		section: "XY Triples",

		gameType: 'triples',
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview'],
		validateTeam: function (team, format) {
			if (team.length < 6) return ['You must have six Pokémon.'];
		}
	},
	{
		name: "Triples Custom Game",
		section: "XY Triples",

		gameType: 'triples',
		searchShow: false,
		canUseRandomTeam: true,
		maxLevel: 9999,
		defaultLevel: 100,
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview']
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		name: "Stat Switch",
		section: "OM of the Month",
		column: 2,

		mod: 'statswitch',
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Arceus', 'Azumarill', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Giratina', 'Giratina-Origin',
			'Groudon', 'Ho-Oh', 'Kyogre', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Regice', 'Reshiram', 'Xerneas',
			'Yveltal', 'Zekrom', 'Diancite', 'Gengarite', 'Lucarionite', 'Mawilite', 'Salamencite', 'Soul Dew'
		]
	},
	{
		name: "[Seasonal] Sleigh Showdown",
		section: "OM of the Month",

		team: 'randomSeasonalSS',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod'],
		onBegin: function () {
			this.add('-message', "Yikes! You are a grinch in a reckless, regretless sleigh race, running for Showdownville to ruin christmas. But, to achieve that, you must first defeat your opponent. Fight hard and take care with the obstacles!");
			this.seasonal = {position: {}};
			this.seasonal.position[this.p1.name] = 0;
			this.seasonal.position[this.p2.name] = 0;
		},
		onModifyMove: function (move) {
			if (move.type === 'Fire') {
				move.onHit = function (pokemon, source) {
					this.add('-message', "The fire melts the snow, slowing down the sleigh!");
					this.boost({spe: -1}, pokemon, source);
				};
			}
			if (move.type === 'Water') {
				if (this.random(100) < 25) {
					this.add('-message', "The cold froze your Water-type attack, making it Ice-type instead!");
					move.type = 'Ice';
				}
			}
			if (move.type === 'Ice') {
				move.onHit = function (pokemon, source) {
					this.add('-message', "The ice makes the surface more slippery, speeding up the sleigh!");
					this.boost({spe: 1}, pokemon, source);
				};
			}
			if (move.id === 'present') {
				move.name = "Throw sack present";
				move.accuracy = 100;
				move.basePower = 0;
				move.category = "Status";
				move.heal = null;
				move.boosts = null;
				move.target = 'normal';
				move.status = null;
				move.type = "Normal";
				switch (this.random(9)) {
					case 0:
						move.onTryHit = function () {
							this.add('-message', "You got an Excadreydle from the sack!");
						};
						move.boosts = {spe: -1};
						break;
					case 1:
						move.onTryHit = function () {
							this.add('-message', "You got a Chandelnukkiyah from the sack!");
						};
						move.status = 'brn';
						break;
					case 2:
						move.onTryHit = function () {
							this.add('-message', "You got a Glalie from the sack! Ka-boom!");
						};
						move.category = 'Special';
						move.basePower = 300;
						break;
					case 3:
						move.onTryHit = function () {
							this.add('-message', "You got a tree Starmie from the sack!");
						};
						move.category = 'Special';
						move.type = 'Water';
						move.basePower = 150;
						break;
					case 4:
						move.onTryHit = function () {
							this.add('-message', "You got an Abomaxmas tree from the sack!");
						};
						move.category = 'Physical';
						move.type = 'Ice';
						move.basePower = 150;
						break;
					case 5:
						move.onTryHit = function () {
							this.add('-message', "You got a Chansey egg nog from the sack!");
						};
						move.target = 'self';
						move.heal = [3, 4];
						break;
					case 6:
						move.onTryHit = function () {
							this.add('-message', "You got Cryogonal snowflakes from the sack!");
						};
						move.category = 'Special';
						move.type = 'Ice';
						move.basePower = 200;
						break;
					case 7:
						move.onTryHit = function () {
							this.add('-message', "You got Pikachu-powered christmas lights from the sack!");
						};
						move.category = 'Special';
						move.type = 'Electric';
						move.basePower = 250;
						break;
					case 8:
						move.onTryHit = function () {
							this.add('-message', "You got Shaymin-Sky mistletoe from the sack!");
						};
						move.category = 'Special';
						move.type = 'Grass';
						move.basePower = 200;
						break;
				}
			}
		},
		onBeforeMove: function (pokemon, target, move) {
			// Before every move, trainers advance on their sleighs. There might be obstacles.
			var speed = Math.abs(pokemon.speed);
			if (this.random(100) < Math.ceil(speed / 10) + 15) {
				var name = pokemon.illusion ? pokemon.illusion.name : pokemon.name;
				// If an obstacle is found, the trainer won't advance this turn.
				switch (this.random(6)) {
				case 0:
				case 1:
				case 2:
					this.add('-message', "" + name + " hit a tree and some snow fell on it!");
					pokemon.cureStatus();
					this.damage(Math.ceil(pokemon.maxhp / 10), pokemon, pokemon, "head injuries", true);
					break;
				case 3:
					this.add('-message', "" + name + " hit a snow bank!");
					pokemon.setStatus('frz', pokemon, null, true);
					this.add('cant', pokemon, 'frz');
					return false;
				case 4:
					this.add('-message', "" + name + " fell into a traphole!");
					this.boost({spe: -1}, pokemon, pokemon, move);
					break;
				case 5:
					this.add('-message', "" + name + " hit a heavy wall!");
					// override status
					pokemon.setStatus('par', pokemon, null, true);
					break;
				}
			} else {
				// If no obstacles, the trainer advances as much meters as speed its Pokémon has.
				this.add('-message', "" + pokemon.side.name + " has advanced down the mountain " + speed + " meters!");
				this.seasonal.position[pokemon.side.name] += speed;
			}

			// Showdownville is about 4000 meters away from the mountaintop.
			if (this.seasonal.position[pokemon.side.name] >= 4000) {
				this.add('-message', "" + pokemon.side.name + " has arrived to Showdownville first and ruined christmas! The race is won!");
				this.win(pokemon.side.id);
			}
		},
		onHit: function (target) {
			// Getting hit thaws the ice if you are frozen.
			if (target.status === 'frz') target.cureStatus();
		}
	},
	{
		name: "CAP",
		section: "Other Metagames",
		column: 2,

		ruleset: ['OU'],
		banlist: ['Allow CAP']
	},

	{
		name: "Balanced Hackmons",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Team Preview', 'HP Percentage Mod'],
		banlist: ['Arena Trap', 'Huge Power', 'Parental Bond', 'Pure Power', 'Shadow Tag', 'Wonder Guard']
	},
	{
		name: "1v1",
		section: 'Other Metagames',

		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview 1v1'],
		banlist: ['Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh',
			'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Xerneas', 'Yveltal',
			'Zekrom', 'Focus Sash', 'Kangaskhanite', 'Soul Dew'
		],
		validateTeam: function (team, format) {
			if (team.length > 3) return ['You may only bring up to three Pokémon.'];
		},
		onBegin: function () {
			this.p1.pokemon = this.p1.pokemon.slice(0, 1);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 1);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Monotype",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Same Type Clause', 'Team Preview'],
		banlist: ['Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh',
			'Kyogre', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Talonflame', 'Xerneas', 'Yveltal', 'Zekrom',
			'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Salamencite', 'Soul Dew'
		]
	},
	{
		name: "Tier Shift",
		section: "Other Metagames",

		mod: 'tiershift',
		ruleset: ['OU']
	},
	{
		name: "PU",
		section: "Other Metagames",

		ruleset: ['NU'],
		banlist: ['NU', 'BL4', 'Altarianite', 'Beedrillite', 'Lopunnite']
	},
	{
		name: "Inverse Battle",
		section: "Other Metagames",

		ruleset: ['OU'],
		banlist: ['Kyurem-Black', 'Snorlax'],
		onModifyPokemon: function (pokemon) {
			pokemon.negateImmunity['Type'] = true;
		},
		onEffectiveness: function (typeMod, target, type, move) {
			// The effectiveness of Freeze Dry on Water isn't reverted
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.getImmunity(move, target)) return 1;
			return -typeMod;
		}
	},
	{
		name: "Almost Any Ability",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Ignore Illegal Abilities', 'Arceus', 'Archeops', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon',
			'Ho-Oh', 'Keldeo', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Regigigas',
			'Reshiram', 'Shedinja + Sturdy', 'Slaking', 'Smeargle + Prankster', 'Weavile', 'Xerneas', 'Yveltal', 'Zekrom',
			'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Salamencite', 'Soul Dew'
		],
		validateSet: function (set) {
			var bannedAbilities = {'Aerilate': 1, 'Arena Trap': 1, 'Contrary': 1, 'Fur Coat': 1, 'Huge Power': 1, 'Imposter': 1, 'Parental Bond': 1, 'Protean': 1, 'Pure Power': 1, 'Shadow Tag': 1, 'Simple':1, 'Speed Boost': 1, 'Wonder Guard': 1};
			if (set.ability in bannedAbilities) {
				var template = this.getTemplate(set.species || set.name);
				var legalAbility = false;
				for (var i in template.abilities) {
					if (set.ability === template.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return ['The ability ' + set.ability + ' is banned on Pokémon that do not naturally have it.'];
			}
		}
	},
	{
		name: "STABmons",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Ignore STAB Moves', 'Arceus', 'Blaziken', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Genesect', 'Giratina', 'Giratina-Origin', 'Groudon',
			'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Porygon-Z', 'Rayquaza', 'Reshiram', 'Shaymin-Sky',
			'Sylveon', 'Xerneas', 'Yveltal', 'Zekrom', 'Altarianite', 'Gengarite', 'Kangaskhanite', "King's Rock", 'Lopunnite', 'Lucarionite',
			'Mawilite', 'Metagrossite', 'Razor Claw', 'Salamencite', 'Soul Dew'
		]
	},
	{
		name: "LC UU",
		section: "Other Metagames",

		maxLevel: 5,
		ruleset: ['LC'],
		banlist: ['Abra', 'Aipom', 'Archen', 'Bellsprout', 'Bunnelby', 'Carvanha', 'Chinchou', 'Corphish', 'Cottonee', 'Cranidos',
			'Croagunk', 'Diglett', 'Drilbur', 'Dwebble', 'Ferroseed', 'Fletchling', 'Foongus', 'Gastly', 'Honedge', 'Houndour',
			'Larvesta', 'Lileep', 'Magnemite', 'Mienfoo', 'Misdreavus', 'Munchlax', 'Onix', 'Pawniard', 'Ponyta', 'Porygon',
			'Scraggy', 'Snubbull', 'Spritzee', 'Staryu', 'Timburr', 'Tirtouga', 'Trubbish', 'Vullaby', 'Vulpix', 'Zigzagoon',
			'Omanyte'
		]
	},
	{
		name: "350 Cup",
		section: "Other Metagames",

		mod: '350cup',
		searchShow: false,
		ruleset: ['Ubers', 'Evasion Moves Clause'],
		banlist: ['Abra', 'Cranidos', 'Darumaka', 'Gastly', 'Pawniard', 'Smeargle', 'Spritzee', 'DeepSeaScale', 'DeepSeaTooth', 'Light Ball', 'Thick Club'],
		validateSet: function (set) {
			var template = Tools.getTemplate(set.species);
			var item = this.getItem(set.item);
			if (item.name === 'Eviolite' && Object.values(template.baseStats).sum() <= 350) {
				return ['Eviolite is banned on Pokémon with 350 or lower BST.'];
			}
		}
	},
	{
		name: "Averagemons",
		section: "Other Metagames",

		mod: 'averagemons',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Evasion Abilities Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Shedinja', 'Smeargle', 'DeepSeaScale', 'DeepSeaTooth', 'Eviolite', 'Light Ball', 'Mawilite', 'Medichamite', 'Soul Dew', 'Thick Club', 'Huge Power', 'Pure Power']
	},
	{
		name: "Classic Hackmons",
		section: "Other Metagames",

		searchShow: false,
		ruleset: ['HP Percentage Mod'],
		validateSet: function (set) {
			var template = this.getTemplate(set.species);
			var item = this.getItem(set.item);
			var problems = [];

			if (set.species === set.name) delete set.name;
			if (template.isNonstandard) {
				problems.push(set.species + ' is not a real Pokemon.');
			}
			if (item.isNonstandard) {
				problems.push(item.name + ' is not a real item.');
			}
			var ability = {};
			if (set.ability) ability = this.getAbility(set.ability);
			if (ability.isNonstandard) {
				problems.push(ability.name + ' is not a real ability.');
			}
			if (set.moves) {
				for (var i = 0; i < set.moves.length; i++) {
					var move = this.getMove(set.moves[i]);
					if (move.isNonstandard) {
						problems.push(move.name + ' is not a real move.');
					}
				}
				if (set.moves.length > 4) {
					problems.push((set.name || set.species) + ' has more than four moves.');
				}
			}
			if (set.level && set.level > 100) {
				problems.push((set.name || set.species) + ' is higher than level 100.');
			}
			return problems;
		}
	},
	{
		name: "Hidden Type",
		section: "Other Metagames",

		searchShow: false,
		mod: 'hiddentype',
		ruleset: ['OU']
	},
	{
		name: "Middle Cup",
		section: "Other Metagames",

		searchShow: false,
		maxLevel: 50,
		defaultLevel: 50,
		validateSet: function (set) {
			var template = this.getTemplate(set.species || set.name);
			if (!template.evos || template.evos.length === 0 || !template.prevo) {
				return [set.species + " is not the middle Pokémon in an evolution chain."];
			}
		},
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Eviolite']
	},
	{
		name: "Sky Battle",
		section: "Other Metagames",

		searchShow: false,
		validateSet: function (set) {
			var template = this.getTemplate(set.species || set.name);
			if (template.types.indexOf('Flying') === -1 && set.ability !== 'Levitate') {
				return [set.species + " is not a Flying type and does not have the ability Levitate."];
			}
		},
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Archen', 'Chatot', 'Delibird', 'Dodrio', 'Doduo', 'Ducklett', "Farfetch'd", 'Fletchling', 'Gastly',
			'Gengar', 'Hawlucha', 'Hoothoot', 'Murkrow', 'Natu', 'Pidgey', 'Pidove', 'Rufflet', 'Shaymin-Sky', 'Spearow',
			'Starly', 'Taillow', 'Vullaby', 'Iron Ball', 'Pinsirite', 'Soul Dew',
			'Body Slam', 'Bulldoze', 'Dig', 'Dive', 'Earth Power', 'Earthquake', 'Electric Terrain', 'Fire Pledge', 'Fissure', 'Flying Press',
			'Frenzy Plant', 'Geomancy', 'Grass Knot', 'Grass Pledge', 'Grassy Terrain', 'Gravity', 'Heat Crash', 'Heavy Slam', 'Ingrain', "Land's Wrath",
			'Magnitude', 'Mat Block', 'Misty Terrain', 'Mud Sport', 'Muddy Water', 'Rototiller', 'Seismic Toss', 'Slam', 'Smack Down', 'Spikes',
			'Stomp', 'Substitute', 'Surf', 'Toxic Spikes', 'Water Pledge', 'Water Sport'
		]
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
        name: "Stat Switch Ubers",
        section: "New Other Metagames",
	column: 3,
        mod: 'statswitch',
	ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
	},
  {
        name: "Reliablemons",
        section: "New Other Metagames",

        ruleset: ['Pokemon', 'Standard', 'Team Preview'],
        banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite'],
        onModifyMove: function(move, pokemon) {
            var moves = pokemon.moves;
            if (move.id === moves[0]) {
                var cheese = 0;
                var crackers = true;
            } else if (move.id === moves[1] && pokemon.typesData[1]) {
                var cheese = 1;
                var crackers = true;
            } else {
                var crackers = false;
            }
            if (crackers) {
                move.type = pokemon.typesData[cheese].type;
            }
        }
    },
    {
        name: "Playstyle Reversal",
        section: "New Other Metagames",

        ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
        banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite'],
        onModifyMove: function (move) {
            if (move && move.self) {
                if (move.category === "Status") {
                    move.onHit = function(source) {
                        return this.boost({atk: 1, spa: 1, def: -1, spd: -1});
                    }
                } else {
                    move.onHit = function(attacker, defender) {
                        return this.boost({atk: -1, spa: -1, def: 1, spd: 1}, defender, attacker);
                    }
                }
            } else if (move && move.category === "Status") {
                if (move.target === "self" && move.boosts) {
                    move.self = {boosts: {atk: -1, spa: -1, def: 1, spd: 1}};
                } else {
                    move.self = {boosts: {atk: 1, spa: 1, def: -1, spd: -1}};
                }
            } else if (move) {
                move.self = {boosts: {atk: -1, spa: -1, def: 1, spd: 1}};
            }
        }
    },
{
                name: "FU",
                section: "New Other Metagames",

                ruleset: ['PU'],
                banlist: ['NU', 'Raichu', 'Throh', 'Poliwrath', 'Sneasel', 'Electrode', 'Garbodor', 'Haunter', 'Basculin', 'Camerupt', 'Piloswine', 'Musharna', 'Scyther', 'Bouffalant', 'Bastiodon', 'Avalugg', 'Golem', 'Tauros', 'Barbaracle', 'Lickilicky', 'Marowak', 'Chatot', 'Gourgeist-Super', 'Flareon', 'Tangela', 'Pelipper', 'Mantine', 'Torterra', 'Togetic', 'Beeheeyem', 'Mr. Mime', 'Kadabra', 'Rotom-Frost', 'Dusknoir', 'Carracosta', 'Serperior', 'Rampardos', 'Altaria', 'Zebstrika', 'Dodrio', 'Ursaring', 'Lumineon', 'Wartortle', 'Luxray', 'Rapidash', 'Kecleon', 'Stoutland', 'Mightyena', 'Ninetales', 'Purugly', 'Regice', 'Vigoroth', 'Kricketune', 'Victreebel', 'Roselia', 'Misdreavus', 'Sawsbuck', 'Drifblim', 'Arbok', 'Stunfisk', 'Relicanth']
        },
    {
        name: "No Legends pls",
        section: "New Other Metagames",

        ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
        banlist: ['Uber', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Articuno', 'Zapdos', 'Moltres', 'Mew', 'Entei', 'Suicune', 'Raikou', 'Celebi', 'Regirock', 'Regice', 'Registeel', 'Latios', 'Latias', 'Jirachi', 'Azelf', 'Mesprit', 'Uxie', 'Manaphy', 'Phione', 'Heatran', 'Regigigas', 'Shaymin', 'Victini', 'Cobalion', 'Terrakion', 'Virizion', 'Keldeo', 'Tornadus', 'Tornadus-Therian', 'Thundurus', 'Thundurus-Therian', 'Landorus', 'Landorus-Therian', 'Kyurem', 'Kyurem-Black', 'Meloetta', 'Zygarde']
    },
    {
        name: "Priority Cup",
        section: "New Other Metagames",
      
        mod: 'prioritycup',
        ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
        banlist: ['Uber', 'Soul Dew', 'Heracrossite', 'Kings Rock', 'Razor Fang', 'Gengarite', 'Kangaskhanite', 'Lucarionite']
    },
    {
        name: "Metagamiate",
        section: "New Other Metagames",
        ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
        banlist: ['Gengarite', 'Kangaskhanite', 'Lucarionite', 'Soul Dew',
            'Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Dialga', 'Genesect', 'Giratina',
            'Giratina-Origin', 'Groudon', 'Kyogre', 'Ho-Oh', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram',
            'Shaymin-Sky', 'Kyurem-White', 'Xerneas', 'Yveltal', 'Zekrom'
        ],
        onModifyMove: function(move, pokemon) {
            if (move.type === 'Normal' && move.id !== 'hiddenpower' && !pokemon.hasAbility(['aerilate', 'pixilate', 'refrigerate'])) {
                var types = pokemon.getTypes();
                if (!types[0] || types[0] === '???') return;
                move.type = types[0];
                move.isMetagamiate = true;
            }
        },
        onBasePowerPriority: 9,
        onBasePower: function(basePower, attacker, defender, move) {
            if (!move.isMetagamiate) return;
            return this.chainModify([0x14CD, 0x1000]);
        }
    },
    {
        name: "PacifistMons",
        section: "New Other Metagames",
        ruleset: ['Pokemon', 'Standard', 'Team Preview'],
        banlist: ['Heatran', 'Gengarite', 'Taunt', 'Magic Guard', 'Wish'],
        validateSet: function(set) {
            var problems = [];
            for (var i in set.moves) {
                var move = this.getMove(set.moves[i]);
                if (move.heal) problems.push(move.name + ' is banned as it is a healing move.');
                if (move.category !== 'Status') problems.push(move.name + ' is banned as it is an attacking move.');
            }
            return problems;
        }
    },
    {
        name: "Protean Palace",
        section: "New Other Metagames",
        ruleset: ['Pokemon', 'Standard', 'Team Preview'],
        banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite'],
        onPrepareHit: function (source, target, move) {
            var type = move.type;
            if (type && type !== '???' && source.getTypes().join() !== type) {
                if (!source.setType(type)) return;
                this.add('-start', source, 'typechange', type);
            }
        }
    },
    {
        name: "Same Type Stealth Rock",
        section: "New Other Metagames",
        mod: 'stsr',
        ruleset: ['OU']
    },
    {
        name: "No Ability",
        section: "New Other Metagames",
        mod: 'noability',
        ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
        banlist: ['Uber', 'Ignore Illegal Abilities'],
        validateSet: function (pokemon) {
            pokemon.ability = 'None';
        }
    },
    {
        name: "Camomons",
        section: "New Other Metagames",
        mod: 'camomons',
        ruleset: ['OU', 'Clean Nickname Clause']
    },
    {
        name: "Type Control",
        section: "New Other Metagames",
        mod: 'typecontrol',
        ruleset: ['OU', 'Clean Nickname Clause']
    },
   {
        name: "Atk-Def Equality",
        section: "New Other Metagames",
       
        mod: 'atkdef',
        ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
        banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite']
    },
   {
        name: "Regen Race",
        section: "New Other Metagames",
        ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Baton Pass Clause'],
        banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite'],
       	onSwitchOut: function (pokemon) {
			pokemon.heal(pokemon.maxhp / 3);
		},
    },
    {
        name: "Technician Tower",
        section: "New Other Metagames",

        mod:'technichiantower',
        ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
        banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite','Heracronite', 'Technician', 'Skill Link'],
        validateSet: function(set) {
            for (var i in set.moves) {
                var move = this.getMove(string(set.moves[i]));
                if (move.basePower && move.basePower >= 90) return ['The move ' + move.name + ' is banned because it has >90 Base Power.'];
                if (move.id === 'frustration' && set.happiness < 105) return ['The move Frustration is banned because Pokemon ' + (set.name || set.species) + ' has less than 105 happiness'];
                if (move.id === 'return' && set.happiness > 150) return ['The move Return is banned because Pokemon ' + (set.name || set.species) +  'has more than 150 happiness'];
                if (move.basePowerCallback && !(move.id in {'frustration':1,'return':1})) return ['The move ' + move.name + ' is banned because it has a variable BP'];
                if (move.basePower && move.basePower > 63 && set.ability in {'Pixilate':1,'Aerilate':1,'Refrigerate':1}) return ['The move ' + move.name + ' is banned for Pokemon with an -ate ability.']
            }
        },
        onBasePowerPriority: 8,
        onBasePower: function (basePower, attacker, defender, move) {
            if (basePower <= 60) {
                this.debug('Technician boost');
                return this.chainModify(1.5);
            }
        },
    },
    {
        name: "Acid Rain",
        section: "New Other Metagames",
     
        mod: 'acidrain',
        onBegin: function() {
            this.setWeather('raindance');
            delete this.weatherData.duration;
            this.add('-message', "Eh, close enough.");
        },
        ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
        banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Weather Ball', 'Castform']
    },
    {
        name: "Wonkymons",
	section: "New Other Metagames",
        mod: 'wonkymons',
        ruleset: ['OU'],
        banlist: ['Tyranitar', 'Charizard', 'Mantyke']
    },
    {
        name: "Stat Preference",
        section: "New Other Metagames",

        mod: 'statpreference',
        ruleset: ['OU'],
        banlist: ['']
    },
    {
    name: "Type Splice",
    section: "New Other Metagames",

    ruleset: ['OU'],
    validateTeam: function (team) {
        var maxCoverage = 250;
        var coverageTable = {
            Water: 168,
            Normal: 132,
            Flying: 129,
            Grass: 117,
            Psychic: 102,
            Bug: 94,
            Ground: 83,
            Fire: 80,
            Poison: 80,
            Rock: 73,
            Electric: 65,
            Fighting: 62,
            Dark: 61,
            Steel: 57,
            Dragon: 54,
            Ice: 50,
            Fairy: 48,
            Ghost: 47
        };
        var coverage = 0;
        for (var i = 0 ; i < team.length; i++) {
            var pokemon = Tools.getTemplate(team[i].species || team[i].name);
            coverage += coverageTable[pokemon.types[0]] || 0;
        }
        if (coverage > maxCoverage) return ["Your team was rejected because their primary typing adds up to " + (coverage / 10).toFixed(1) + "% of available Pokémon. You are restricted to 25.0%."];
    }
},
    {
        name: "The Power Within",
        section: "New Other Metagames",

        ruleset: ['OU'],
        banlist: ['The Power Within']
    },
	// BW2 Singles
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 5] OU",
		section: "BW2 Singles",
		column: 4,

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
		banlist: ['OU', 'BL', 'Drought', 'Sand Stream', 'Snow Warning']
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
		banlist: ['RU', 'BL3', 'Prankster + Assist']
	},
	{
		name: "[Gen 5] LC",
		section: "BW2 Singles",

		mod: 'gen5',
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Berry Juice', 'Soul Dew', 'Dragon Rage', 'Sonic Boom', 'LC Uber', 'Gligar', 'Scyther', 'Sneasel', 'Tangela']
	},
	{
		name: "[Gen 5] GBU Singles",
		section: "BW2 Singles",

		mod: 'gen5',
		validateSet: function (set) {
			if (!set.level || set.level >= 50) set.forcedLevel = 50;
			return [];
		},
		onBegin: function () {
			this.debug('cutting down to 3');
			this.p1.pokemon = this.p1.pokemon.slice(0, 3);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 3);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview GBU'],
		banlist: ['Sky Drop', 'Dark Void']
	},
	{
		name: "[Gen 5] Custom Game",
		section: "BW2 Singles",

		mod: 'gen5',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview']
	},

	// BW2 Doubles
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 5] Smogon Doubles",
		section: 'BW2 Doubles',
		column: 4,

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
			'Arceus',
			'Reshiram',
			'Zekrom',
			'Kyurem-White'
		]
	},
	{
		name: "[Gen 5] GBU Doubles",
		section: 'BW2 Doubles',

		mod: 'gen5',
		gameType: 'doubles',
		onBegin: function () {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0, 4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview VGC'],
		banlist: ['Sky Drop', 'Dark Void']
	},
	{
		name: "[Gen 5] Doubles Custom Game",
		section: 'BW2 Doubles',

		mod: 'gen5',
		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview']
	},

	// Past Generations
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 4] OU",
		section: "Past Generations",
		column: 4,

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber']
	},
	{
		name: "[Gen 4] Ubers",
		section: "Past Generations",

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Arceus']
	},
	{
		name: "[Gen 4] UU",
		section: "Past Generations",

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'OU', 'BL']
	},
	{
		name: "[Gen 4] LC",
		section: "Past Generations",

		mod: 'gen4',
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Little Cup'],
		banlist: ['Berry Juice', 'DeepSeaTooth', 'Dragon Rage', 'Sonic Boom', 'Meditite', 'Misdreavus', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela', 'Yanma']
	},
	{
		name: "[Gen 4] Custom Game",
		section: "Past Generations",

		mod: 'gen4',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions
		ruleset: []
	},
	{
		name: "[Gen 3] OU (beta)",
		section: "Past Generations",

		mod: 'gen3',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'Smeargle + Ingrain']
	},
	{
		name: "[Gen 3] Ubers (beta)",
		section: "Past Generations",

		mod: 'gen3',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Wobbuffet + Leftovers']
	},
	{
		name: "[Gen 3] Custom Game",
		section: "Past Generations",

		mod: 'gen3',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod']
	},
	{
		name: "[Gen 2] OU (beta)",
		section: "Past Generations",

		mod: 'gen2',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber',
			'Hypnosis + Perish Song + Mean Look',
			'Hypnosis + Perish Song + Spider Web',
			'Lovely Kiss + Perish Song + Mean Look',
			'Lovely Kiss + Perish Song + Spider Web',
			'Sing + Perish Song + Mean Look',
			'Sing + Perish Song + Spider Web',
			'Sleep Powder + Perish Song + Mean Look',
			'Sleep Powder + Perish Song + Spider Web',
			'Spore + Perish Song + Mean Look',
			'Spore + Perish Song + Spider Web'
		]
	},
	{
		name: "[Gen 2] Custom Game",
		section: "Past Generations",

		mod: 'gen2',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod']
	},
	{
		name: "[Gen 1] OU (beta)",
		section: "Past Generations",

		mod: 'gen1',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber',
			'Kakuna + Poison Sting + Harden', 'Kakuna + String Shot + Harden',
			'Beedrill + Poison Sting + Harden', 'Beedrill + String Shot + Harden',
			'Nidoking + Fury Attack + Thrash',
			'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp', 'Exeggutor + Stun Spore + Stomp',
			'Eevee + Tackle + Growl',
			'Vaporeon + Tackle + Growl',
			'Jolteon + Tackle + Growl', 'Jolteon + Focus Energy + Thunder Shock',
			'Flareon + Tackle + Growl', 'Flareon + Focus Energy + Ember'
		]
	},
	{
		name: "[Gen 1] Custom Game",
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod']
	}

];
