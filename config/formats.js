// Note: This is the list of formats
// The rules that formats use are stored in data/formats.js

exports.Formats = [

	// Singles
	///////////////////////////////////////////////////////////////////

	{
		name: "Random Battle",
		section: "Singles",

		mod: 'gen5',
		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod']
	},
	{
		name: "Unrated Random Battle",
		section: "Singles",

		mod: 'gen5',
		team: 'random',
		challengeShow: false,
		rated: false,
		ruleset: ['Random Battle']
	},
	{
		name: "OU",
		section: "Singles",

		mod: 'gen5',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	},
	{
		name: "OU (No Stealth Rock)",
		section: "Singles",

		mod: 'gen5',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew', 'Stealth Rock']
	},
	{
		name: "Ubers",
		section: "Singles",

		mod: 'gen5',
		ruleset: ['Pokemon', 'Team Preview', 'Standard Ubers'],
		banlist: []
	},
	{
		name: "UU",
		section: "Singles",

		mod: 'gen5',
		searchShow: false,
		ruleset: ['OU'],
		banlist: ['OU', 'BL', 'Drought', 'Sand Stream']
	},
	{
		name: "UU (current)",
		section: "Singles",

		mod: 'gen5',
		ruleset: ['OU'],
		banlist: ['OU', 'BL', 'Drought', 'Sand Stream']
	},
	{
		name: "RU",
		section: "Singles",

		mod: 'gen5',
		ruleset: ['UU'],
		banlist: ['UU', 'BL2', 'Shell Smash + Baton Pass', 'Snow Warning']
	},
	{
		name: "NU",
		section: "Singles",

		mod: 'gen5',
		searchShow: false,
		ruleset: ['RU'],
		banlist: ['RU','BL3']
	},
	{
		name: "NU (current)",
		section: "Singles",

		mod: 'gen5',
		ruleset: ['RU'],
		banlist: ['RU','BL3']
	},
	{
		name: "LC",
		section: "Singles",

		mod: 'gen5',
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Sonicboom', 'Dragon Rage', 'Berry Juice', 'Carvanha', 'Meditite', 'Gligar', 'Scyther', 'Sneasel', 'Tangela', 'Vulpix', 'Yanma', 'Soul Dew']
	},
	{
		name: "CAP",
		section: "Singles",

		mod: 'gen5',
		ruleset: ['CAP Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	},
	{
		name: "GBU Singles",
		section: "Singles",

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
		name: "Global Showdown",
		section: "Singles",

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
		banlist: ['Unreleased', 'Illegal', 'Sky Drop', 'Dark Void', 'Soul Dew', 'Chatot']
	},
	{
		name: "Custom Game",
		section: "Singles",

		mod: 'gen5',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 1000,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview']
	},
	{
		name: "Custom Game (no Team Preview)",
		section: "Singles",

		mod: 'gen5',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 1000,
		defaultLevel: 100,
		// no restrictions, for serious
		ruleset: []
	},

	// Doubles
	///////////////////////////////////////////////////////////////////

	{
		name: "Doubles Random Battle (dev)",
		section: 'Doubles',

		mod: 'gen5',
		gameType: 'doubles',
		team: 'random',
		searchShow: false,
		debug: true,
		ruleset: ['PotD', 'Pokemon', 'HP Percentage Mod'],
		
		column: 2
	},
	{
		name: "Smogon Doubles",
		section: 'Doubles',

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
		name: "Smogon Doubles Ubers",
		section: 'Doubles',

		mod: 'gen5',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal', 'Dark Void', 'Sky Drop']
	},
	{
		name: "Doubles VGC 2013",
		section: 'Doubles',

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
		name: "Doubles Custom Game",
		section: 'Doubles',

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
	{
		name: "Doubles Challenge Cup",
		section: 'Doubles',

		mod: 'gen5',
		gameType: 'doubles',
		team: 'randomCC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod']
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		name: "Pokebank Ubers",
		section: "OM of the Month",

		mod: 'pokebank',
		ruleset: ['Pokemon', 'Team Preview', 'Sleep Clause Mod', 'Species Clause', 'Moody Clause', 'OHKO Clause', 'HP Percentage Mod'],
		banlist: ['Illegal']
	},
	{
		name: "Ability Exchange",
		section: "OM of the Month",

		mod: 'gen5',
		ruleset: ['Pokemon', 'Ability Exchange Pokemon', 'Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal', 'Ignore Illegal Abilities', 'Drizzle ++ Swift Swim', 'Soul Dew', 'Drought ++ Chlorophyll', 'Sand Stream ++ Sand Rush',
			'Mewtwo', 'Lugia', 'Ho-Oh', 'Blaziken', 'Kyogre', 'Groudon', 'Rayquaza', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Dialga', 'Palkia', 'Giratina', 'Giratina-Origin', 'Manaphy', 'Darkrai', 'Shaymin-Sky',
			'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water',
			'Excadrill', 'Tornadus-Therian', 'Thundurus', 'Reshiram', 'Zekrom', 'Landorus', 'Kyurem-White', 'Genesect', 'Slaking', 'Regigigas'
		]
	},
	{
		name: "[Seasonal] Octoberfest",
		section: "OM of the Month",

		mod: 'gen5',
		team: 'randomSeasonalOF',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod'],
		onModifyMove: function(move) {
			if (move.id === 'trick') {
				delete move.onHit;
				switch (this.random(17)) {
				case 0:
					move.onTryHit = function() {
						this.add('-message', 'Trick: Kick on the nuts!');
					};
					move.category = 'Physical';
					move.type = 'Normal';
					move.basePower = 200;
					break;
				case 1:
					move.onTryHit = function() {
						this.add('-message', 'Trick: Fireworks at your feet!');
					};
					move.category = 'Special';
					move.type = 'Fire';
					move.basePower = 200;
					break;
				case 2:
					move.onTryHit = function() {
						this.add('-message', 'Trick: Doused with water!');
					};
					move.category = 'Special';
					move.type = 'Water';
					move.basePower = 200;
					break;
				case 3:
					move.onTryHit = function() {
						this.add('-message', 'Trick: Bombed with rotten eggs!');
					};
					move.category = 'Special';
					move.type = 'Poison';
					move.basePower = 200;
					break;
				case 4:
					move.onTryHit = function() {
						this.add('-message', 'Trick: You got scared by a real-looking costume!');
					};
					move.category = 'Special';
					move.type = 'Dark';
					move.basePower = 200;
					break;
				case 5:
					move.onTryHit = function() {
						this.add('-message', 'Trick: You got hit in the head!');
					};
					move.volatileStatus = 'confusion';
					break;
				case 6:
					move.onTryHit = function() {
						this.add('-message', 'Trick: Your arms were maimed!');
					};
					move.volatileStatus = 'disable';
					break;
				case 7:
					move.onTryHit = function() {
						this.add('-message', "Trick: You've been taunted by those meddling kids!");
					};
					move.volatileStatus = 'taunt';
					break;
				case 8:
					move.onTryHit = function() {
						this.add('-message', 'Treat: You got some yummy seeds!');
					};
					move.volatileStatus = 'leechseed';
					break;
				case 9:
					move.onTryHit = function() {
						this.add('-message', 'Trick: Your car was stolen!');
					};
					move.volatileStatus = 'embargo';
					break;
				case 10:
					move.onTryHit = function() {
						this.add('-message', "Trick: You're haunted and you're going to die!");
					};
					move.volatileStatus = 'perishsong';
					break;
				case 11:
					move.onTryHit = function() {
						this.add('-message', 'Trick: A ghost cursed you!');
					};
					move.volatileStatus = 'curse';
					break;
				case 12:
					move.onTryHit = function() {
						this.add('-message', "Trick: You're tormented by the constant tricking!");
					};
					move.volatileStatus = 'torment';
					break;
				case 13:
					move.onTryHit = function() {
						this.add('-message', 'Treat: Om nom nom roots!');
					};
					move.volatileStatus = 'ingrain';
					break;
				case 14:
					move.onTryHit = function() {
						this.add('-message', 'Treat: Uhm, these candy taste weird...');
					};
					var boosts = {};
					var possibleBoosts = ['atk','def','spa','spd','spe','accuracy','evasion'].randomize();
					boosts[possibleBoosts[0]] = 2;
					boosts[possibleBoosts[1]] = -1;
					boosts[possibleBoosts[2]] = -1;
					move.boosts = boosts;
					break;
				case 15:
					move.onTryHit = function() {
						this.add('-message', "Trick: You're tired of running after teenagers with your baseball bat.");
					};
					move.volatileStatus = 'mustrecharge';
					break;
				case 16:
					move.onTryHit = function() {
						this.add('-message', "Treat: You got candy!");
					};
					move.heal = [1,2];
					break;
				}
			} else if (move.id === 'present') {
				move.accuracy = 100;
				move.basePower = 0;
				move.category = 'Status';
				move.volatileStatus = 'confusion';
				move.pp = 10;
				move.priority = 0;
				move.name = 'Offer Beer';
				move.boosts = {'atk':-1, 'spa':-1, 'def':1, 'spd':1, 'spe':-1, 'accuracy':-1, 'evasion':1};
				move.onTryHit = function() {
					this.add('-message', "Oh, why, thank you! This beer is delicious!");
				};
				move.effect = {
					onBeforeMove: function(pokemon, target, move) {
						if (this.random(10) < 3) {
							this.useMove('Sing', target);
							return;
						}
					}
				};
			}
		}
	},
	{
		name: "Generation 5.5",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Limbo']
	},
	{
		name: "Challenge Cup",
		section: "Other Metagames",

		mod: 'gen5',
		team: 'randomCC',
		ruleset: ['Pokemon', 'HP Percentage Mod']
	},
	{
		name: "Challenge Cup 1-vs-1",
		section: "Other Metagames",

		mod: 'gen5',
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

		mod: 'gen5',
		ruleset: ['Pokemon'],
		banlist: []
	},
	{
		name: "Balanced Hackmons",
		section: "Other Metagames",

		mod: 'gen5',
		ruleset: ['Pokemon', 'OHKO Clause'],
		banlist: ['Wonder Guard', 'Pure Power', 'Huge Power', 'Shadow Tag', 'Arena Trap']
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
		name: "OU Monotype",
		section: "Other Metagames",

		mod: 'gen5',
		ruleset: ['Pokemon', 'Standard', 'Same Type Clause', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	},
	{
		name: "Glitchmons",
		section: "Other Metagames",

		mod: 'gen5',
		searchShow: false,
		ruleset: ['Pokemon', 'Team Preview', 'HP Percentage Mod'],
		banlist: ['Illegal', 'Unreleased'],
		mimicGlitch: true
	},
	{
		name: "LC Ubers",
		section: "Other Metagames",

		mod: 'gen5',
		maxLevel: 5,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Sonicboom', 'Dragon Rage', 'Berry Juice', 'Soul Dew']
	},
	{
		name: "LC UU",
		section: "Other Metagames",

		mod: 'gen5',
		maxLevel: 5,
		searchShow: false,
		ruleset: ['LC'],
		banlist: ['Abra', 'Aipom', 'Archen', 'Axew', 'Bronzor', 'Chinchou', 'Clamperl', 'Cottonee', 'Cranidos', 'Croagunk', 'Diglett', 'Drifloon', 'Drilbur', 'Dwebble', 'Ferroseed', 'Foongus', 'Frillish', 'Gastly', 'Hippopotas', 'Houndour', 'Koffing', 'Larvesta', 'Lileep', 'Machop', 'Magnemite', 'Mienfoo', 'Misdreavus', 'Munchlax', 'Murkrow', 'Pawniard', 'Ponyta', 'Porygon', 'Riolu', 'Sandshrew', 'Scraggy', 'Shellder', 'Shroomish', 'Slowpoke', 'Snover', 'Staryu', 'Tentacool', 'Timburr', 'Tirtouga']
	},
	{
		name: "Dream World",
		section: "Other Metagames",

		mod: 'gen5',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard DW', 'Team Preview'],
		banlist: []
	},
	{
		name: "Tier Shift",
		section: 'Other Metagames',

		mod: 'tiershift',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	},
	{
		name: "1v1",
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
		name: "PU",
		section: "Other Metagames",

		mod: 'gen5',
		searchShow: false,
		ruleset: ['NU'],
		banlist: ["Charizard", "Wartortle", "Kadabra", "Golem", "Haunter", "Exeggutor", "Weezing", "Kangaskhan", "Pinsir", "Lapras", "Ampharos", "Misdreavus", "Piloswine", "Miltank", "Ludicolo", "Swellow", "Gardevoir", "Ninjask", "Torkoal", "Cacturne", "Altaria", "Armaldo", "Gorebyss", "Regirock", "Regice", "Bastiodon", "Floatzel", "Drifblim", "Skuntank", "Lickilicky", "Probopass", "Rotom-Fan", "Samurott", "Musharna", "Gurdurr", "Sawk", "Carracosta", "Garbodor", "Sawsbuck", "Alomomola", "Golurk", "Braviary", "Electabuzz", "Electrode", "Liepard", "Tangela", "Eelektross", "Ditto", "Seismitoad", "Zangoose", "Roselia", "Serperior", "Metang", "Tauros", "Cradily", "Primeape", "Scolipede", "Jynx", "Basculin", "Gigalith", "Camerupt", "Golbat"]
	},
	{
		name: "STABmons",
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
		name: "Budgetmons",
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

	// Pokemon XY
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 6] Ubers (beta)",
		section: "Pokémon X/Y",

		debug: true,
		ruleset: ['Pokemon', 'Team Preview', 'Standard Ubers'],
		banlist: [],

		column: 2
	},
	{
		name: "[Gen 6] OU (beta)",
		section: "Pokémon X/Y",

		debug: true,
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Soul Dew'],

		column: 2
	},
	{
		name: "[Gen 6] Smogon Doubles (beta)",
		section: "Pokémon X/Y",

		gameType: 'doubles',
		debug: true,
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Soul Dew', 'Dark Void'],

		column: 2
	},
	{
		name: "[Gen 6] LC (beta)",
		section: "Pokémon X/Y",

		maxLevel: 5,
		debug: true,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Sonicboom', 'Dragon Rage', 'Scyther'],

		column: 2
	},
	{
		name: "[Gen 6] Custom Game",
		section: "Pokémon X/Y",

		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		ruleset: ['Team Preview']
	},
	{
		name: "[Gen 6] Doubles Custom Game",
		section: "Pokémon X/Y",

		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		ruleset: ['Team Preview']
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
