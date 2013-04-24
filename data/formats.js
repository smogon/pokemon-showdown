exports.BattleFormats = {

	// Singles
	///////////////////////////////////////////////////////////////////

	randombattle: {
		name: "Random Battle",
		section: "Singles",

		effectType: 'Format',
		team: 'random',
		canUseRandomTeam: true,
		searchDefault: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause']
	},
	unratedrandombattle: {
		name: "Unrated Random Battle",
		section: "Singles",

		effectType: 'Format',
		team: 'random',
		canUseRandomTeam: true,
		searchShow: true,
		ruleset: ['Random Battle']
	},
	challengecup: {
		name: "Challenge Cup",
		section: "Singles",

		effectType: 'Format',
		team: 'randomCC',
		canUseRandomTeam: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		ruleset: ['Pokemon']
	},
	challengecup1vs1: {
		name: "Challenge Cup 1-vs-1",
		section: "Singles",

		effectType: 'Format',
		team: 'randomCC',
		canUseRandomTeam: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		ruleset: ['Pokemon', 'Team Preview 1v1'],
		onBegin: function() {
			this.debug('Cutting down to 1');
			this.p1.pokemon = this.p1.pokemon.slice(0, 1);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 1);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	ou: {
		name: "OU",
		section: "Singles",

		effectType: 'Format',
		challengeDefault: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	},
	//oucurrent: {
	//	effectType: 'Format',
	//	name: "OU (current)",
	//	challengeDefault: true,
	//	rated: true,
	//	challengeShow: true,
	//	searchShow: true,
	//	isTeambuilderFormat: true,
	//	ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
	//	banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	//},
	/*oususpecttest: {
		effectType: 'Format',
		name: "OU (suspect test)",
		rated: true,
		challengeShow: true,
		searchShow: true,
		teambuilderFormat: 'ou',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		//  banlist: [
			// 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Excadrill', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Lugia', 'Manaphy', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Thundurus', 'Zekrom', 'Kyurem-White', 'Drizzle ++ Swift Swim', 'Soul Dew'
		// ] 
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew', 'Deoxys-Defense']
	},*/
	cap: {
		name: "CAP",
		section: "Singles",

		effectType: 'Format',
		rated: true,
		challengeShow: true,
	 	searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['CAP Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	},
	// capaurumothplaytest: {
	// 	effectType: 'Format',
	// 	name: "CAP Aurumoth Playtest",
	// 	challengeShow: true,
	// 	searchShow: true,
	// 	rated: true,
	// 	ruleset: ['CAP Pokemon', 'Standard', 'Team Preview'],
	// 	banlist: ['G4CAP','Tomohawk','Necturna','Mollux','Kyurem-Black','Garchomp','ShadowStrike','Paleo Wave','Drizzle ++ Swift Swim', 'Soul Dew','Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Excadrill', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Lugia', 'Manaphy', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Thundurus', 'Zekrom', 'Kyurem-White']
	// },
	ubers: {
		name: "Ubers",
		section: "Singles",

		effectType: 'Format',
		rated: true,
		challengeShow: true,
		// searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Team Preview', 'Standard Ubers'],
		banlist: []
	},
	uberssuspecttest: {
		name: "Ubers (suspect test)",
		section: "Singles",

		effectType: 'Format',
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Team Preview', 'Sleep Clause', 'Species Clause', 'OHKO Clause'],
		banlist: ['Unreleased', 'Illegal']
	},
	uu: {
		name: "UU",
		section: "Singles",

		effectType: 'Format',
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['OU'],
		banlist: ['OU', 'BL', 'Drought', 'Sand Stream']
	},
	// uususpecttest: {
	// 	effectType: 'Format',
	// 	name: "UU (suspect test)",
	// 	rated: true,
	// 	challengeShow: true,
	// 	searchShow: true,
	// 	ruleset: ['OU'],
	// 	banlist: ['OU', 'BL', 'Drought', 'Sand Stream']
	// },
	ru: {
		name: "RU",
		section: "Singles",

		effectType: 'Format',
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['UU'],
		banlist: ['UU', 'BL2', 'Shell Smash + Baton Pass']
	},
	// rucurrent: {
	// 	effectType: 'Format',
	// 	name: "RU (current)",
	// 	rated: true,
	// 	challengeShow: true,
	// 	searchShow: true,
	// 	ruleset: ['UU'],
	// 	banlist: ['UU', 'BL2', 'Shell Smash + Baton Pass']
	// },
	// rususpecttest: {
	// 	effectType: 'Format',
	// 	name: "RU (Suspect Test)",
	// 	rated: true,
	// 	challengeShow: true,
	// 	searchShow: true,
	// 	isTeambuilderFormat: true,
	// 	ruleset: ['UU'],
	// 	banlist: ['UU', 'BL2', 'Shell Smash + Baton Pass']
	// },
	nu: {
		name: "NU",
		section: "Singles",

		effectType: 'Format',
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['RU'],
		banlist: ['RU','BL3']
	},
	lc: {
		name: "LC",
		section: "Singles",

		effectType: 'Format',
		maxLevel: 5,
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Sonicboom', 'Dragon Rage', 'Berry Juice', 'Carvanha', 'Meditite', 'Gligar', 'Scyther', 'Sneasel', 'Tangela', 'Vulpix', 'Yanma', 'Soul Dew']
	},
	customgame: {
		name: "Custom Game",
		section: "Singles",

		effectType: 'Format',
		challengeShow: true,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 1000,
		// no restrictions, for serious
		ruleset: ['Team Preview']
	},
	customgamenoteampreview: {
		name: "Custom Game (no Team Preview)",
		section: "Singles",

		effectType: 'Format',
		challengeShow: true,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 1000,
		// no restrictions, for serious
		ruleset: []
	},

	// Doubles
	///////////////////////////////////////////////////////////////////

	doublesvgc2013: {
		name: "Doubles VGC 2013",
		section: 'Doubles',

		effectType: 'Format',
		gameType: 'doubles',
		rated: true,
		challengeShow: true,
		searchShow: true,
		onBegin: function() {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0,4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0,4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		maxForcedLevel: 50,
		// no restrictions, for serious
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
			'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water',
			'Victini',
			'Reshiram',
			'Zekrom',
			'Kyurem', 'Kyurem-Black', 'Kyurem-White',
			'Keldeo', 'Keldeo-Resolute',
			'Meloetta',
			'Genesect'
		]
	},
	smogondoubles: {
		name: "Smogon Doubles",
		section: 'Doubles',

		effectType: 'Format',
		gameType: 'doubles',
		challengeShow: true,
		searchShow: true,
		rated: true,
		// no restrictions, for serious
		ruleset: ['Pokemon', 'Team Preview', 'Sleep Clause', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Evasion Abilities Clause'],
		banlist: ['Unreleased', 'Illegal', 'Sky Drop', 'Dark Void', 'Soul Dew',
			'Mewtwo',
			'Lugia',
			'Ho-Oh',
			'Kyogre',
			'Groudon',
			'Rayquaza',
			'Dialga',
			'Palkia',
			'Giratina', 'Giratina-Origin',
			'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water',
			'Reshiram',
			'Zekrom',
			'Kyurem-White'
		]
	},
	doublesrandombattledev: {
		name: "Doubles Random Battle (dev)",
		section: 'Doubles',

		effectType: 'Format',
		gameType: 'doubles',
		team: 'random',
		canUseRandomTeam: true,
		rated: true,
		challengeShow: true,
		debug: true,
		ruleset: ['PotD', 'Pokemon']
	},
	doubleschallengecup: {
		name: "Doubles Challenge Cup",
		section: 'Doubles',

		effectType: 'Format',
		gameType: 'doubles',
		team: 'randomCC',
		canUseRandomTeam: true,
		rated: true,
		challengeShow: true,
		debug: true,
		ruleset: ['Pokemon']
	},
	doublescustomgame: {
		name: "Doubles Custom Game",
		section: 'Doubles',

		effectType: 'Format',
		gameType: 'doubles',
		challengeShow: true,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 1000,
		// no restrictions, for serious
		ruleset: ['Team Preview']
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	tiershift: {
		name: "Tier Shift",
		section: 'OM of the Month',

		mod: 'tiershift',
		effectType: 'Format',
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	},
	/* seasonalseasoningsgreetings: {
		effectType: 'Format',
		name: "[Seasonal] Seasoning's Greetings",
		team: 'randomSeasonal',
		canUseRandomTeam: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause']
	},
	seasonalwinterwonderland: {
		effectType: 'Format',
		name: "[Seasonal] Winter Wonderland",
		team: 'randomSeasonalWW',
		canUseRandomTeam: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		onBegin: function() {
			this.setWeather('Hail');
			delete this.weatherData.duration;
		},
		onModifyMove: function(move) {
			if (move.id === 'present') {
				move.category = 'Status';
				move.basePower = 0;
				delete move.heal;
				move.accuracy = 100;
				switch (this.random(20)) {
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
					move.onTryHit = function() {
						this.add('-message', "The present was a bomb!");
					};
					move.category = 'Physical';
					move.basePower = 200;
					break;
				case 5:
					move.onTryHit = function() {
						this.add('-message', "The present was confusion!");
					};
					move.volatileStatus = 'confusion';
					break;
				case 6:
					move.onTryHit = function() {
						this.add('-message', "The present was Disable!");
					};
					move.volatileStatus = 'disable';
					break;
				case 7:
					move.onTryHit = function() {
						this.add('-message', "The present was a taunt!");
					};
					move.volatileStatus = 'taunt';
					break;
				case 8:
					move.onTryHit = function() {
						this.add('-message', "The present was some seeds!");
					};
					move.volatileStatus = 'leechseed';
					break;
				case 9:
					move.onTryHit = function() {
						this.add('-message', "The present was an embargo!");
					};
					move.volatileStatus = 'embargo';
					break;
				case 10:
					move.onTryHit = function() {
						this.add('-message', "The present was a music box!");
					};
					move.volatileStatus = 'perishsong';
					break;
				case 11:
					move.onTryHit = function() {
						this.add('-message', "The present was a curse!");
					};
					move.volatileStatus = 'curse';
					break;
				case 12:
					move.onTryHit = function() {
						this.add('-message', "The present was Torment!");
					};
					move.volatileStatus = 'torment';
					break;
				case 13:
					move.onTryHit = function() {
						this.add('-message', "The present was a trap!");
					};
					move.volatileStatus = 'partiallytrapped';
					break;
				case 14:
					move.onTryHit = function() {
						this.add('-message', "The present was a root!");
					};
					move.volatileStatus = 'ingrain';
					break;
				case 15:
				case 16:
				case 17:
					move.onTryHit = function() {
						this.add('-message', "The present was a makeover!");
					};
					var boosts = {};
					var possibleBoosts = ['atk','def','spa','spd','spe','accuracy'].randomize();
					boosts[possibleBoosts[0]] = 1;
					boosts[possibleBoosts[1]] = -1;
					boosts[possibleBoosts[2]] = -1;
					move.boosts = boosts;
					break;
				case 18:
					move.onTryHit = function() {
						this.add('-message', "The present was psychic powers!");
					};
					move.volatileStatus = 'telekinesis';
					break;
				case 19:
					move.onTryHit = function() {
						this.add('-message', "The present was fatigue!");
					};
					move.volatileStatus = 'mustrecharge';
					break;
				}
			}
		},
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause']
	},
	seasonalvalentineventure: {
		effectType: 'Format',
		name: "[Seasonal] Valentine Venture",
		team: 'randomSeasonalVV',
		gameType: 'doubles',
		canUseRandomTeam: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause']
	},
	seasonalspringforward: {
		effectType: 'Format',
		name: "[Seasonal] Spring Forward",
		team: 'randomSeasonalSF',
		canUseRandomTeam: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		onBegin: function() {
			if (this.random(100) < 75) {
				this.add('-message', "March and April showers bring May flowers...");
				this.setWeather('Rain Dance');
				delete this.weatherData.duration;
			}
			this.debug('Cutting teams down to three.');
    		this.p1.pokemon = this.p1.pokemon.slice(0,3);
	        this.p1.pokemonLeft = this.p1.pokemon.length;
	        this.p2.pokemon = this.p2.pokemon.slice(0,3);
	        this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		onSwitchIn: function(pokemon) {
			var greenPokemon = {
				bulbasaur:1, ivysaur:1, venusaur:1, caterpie:1, metapod:1, bellsprout:1, weepinbell:1, victreebel:1, scyther:1,
				chikorita:1, bayleef:1, meganium:1, spinarak:1, natu:1, xatu:1, bellossom:1, politoed:1, skiploom:1, lavitar:1, 
				tyranitar:1, celebi:1, treecko:1, grovyle:1, sceptile:1, dustox:1, lotad:1, lombre:1, ludicolo:1, breloom:1, 
				electrike:1, roselia:1, gulpin:1, vibrava:1, flygon:1, cacnea:1, cacturne:1, cradily:1, keckleon:1, tropius:1, 
				rayquaza:1, turtwig:1, grotle:1, torterra:1, budew:1, roserade:1, carnivine:1, yanmega:1, leafeon:1, shaymin:1, 
				shayminsky:1, snivy:1, servine:1, serperior:1, pansage:1, simisage:1, swadloon:1, cottonee:1, whimsicott:1, 
				petilil:1, lilligant:1, basculin:1, maractus:1, trubbish:1, garbodor:1, solosis:1, duosion:1, reuniclus:1, 
				axew:1, fraxure:1, golett:1, golurk:1, virizion:1, tornadus:1, tornadustherian:1, burmy:1, 
				kakuna:1, beedrill:1, sandshrew:1, nidoqueen:1, zubat:1, golbat:1, oddish:1, gloom:1, mankey:1, poliwrath:1, 
				machoke:1, machamp:1, doduo:1, dodrio:1, grimer:1, muk:1, kingler:1, cubone:1, marowak:1, hitmonlee:1, tangela:1, 
				mrmime:1, tauros:1, kabuto:1, dragonite:1, mewtwo:1, marill:1, hoppip:1, espeon:1, teddiursa:1, ursaring:1, 
				cascoon:1, taillow:1, swellow:1, pelipper:1, masquerain:1, azurill:1, minun:1, carvanha:1, huntail:1, bagon:1, 
				shelgon:1, salamence:1, latios:1, tangrowth:1, seismitoad:1, jellicent:1, elektross:1, druddigon:1, 
				bronzor:1, bronzong:1, gallade:1
			};
			if (pokemon.template.id in greenPokemon) {
				this.add('-message', pokemon.name + " drank way too much!");
				pokemon.addVolatile('confusion');
				pokemon.statusData.time = 0;
			}
		},
		onModifyMove: function(move) {
			if (move.id === 'barrage') {
				move.category = 'Special';
				move.type = 'Grass';
				move.basePower = 35;
				move.critRatio = 2;
				move.accuracy = 100;
				move.multihit = [3,5],
				move.onBeforeMove = function() {
					this.add('-message', "You found a little chocolate egg!");
				};
				move.onHit = function (target, source) {
					this.heal(Math.ceil(source.maxhp / 40), source);
				};
			} else if (move.id === 'eggbomb') {
				move.category = 'Special';
				move.type = 'Grass';
				move.basePower = 100;
				move.willCrit = true;
				move.accuracy = 100;
				move.onHit = function (target, source) {
					this.add('-message', source.name + " ate a big chocolate egg!");
					this.heal(source.maxhp / 8, source);
				};
				// Too much chocolate, you get fat. Also with STAB it's too OP
				move.self = {boosts: {spe: -2, spa: -1}};
			} else if (move.id === 'softboiled') {
				move.heal = [3,4];
				move.onHit = function(target) {
					this.add('-message', target.name + " ate a delicious chocolate egg!");
				};
			} else {
				// As luck is everywhere...
				move.critRatio = 2;
			}
		},
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause']
	},*/
	seasonalfoolsfestival: {
		name: "[Seasonal] Fools Festival",
		section: 'OM of the Month',

		effectType: 'Format',
		team: 'randomSeasonalFF',
		canUseRandomTeam: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		onBegin: function() {
			var dice = this.random(100);
			if (dice < 65) {
				this.add('-message', "April showers bring May flowers...");
				this.setWeather('Rain Dance');
			} else if (dice < 95) {
				this.add('-message', "What a wonderful spring day! Let's go picnic!");
				this.setWeather('Sunny Day');
			} else {
				this.add('-message', "Bollocks, it's hailing?! In april?! Curse you, spring!!");
				this.setWeather('Hail');
			}
			delete this.weatherData.duration;
		},
		onSwitchIn: function(pokemon) {
			var name = (pokemon.ability === 'illusion' && pokemon.illusion)? pokemon.illusion.toString().substr(4, pokemon.illusion.toString().length) : pokemon.name;
			var stonedPokemon = {Koffing:1, Weezing:1, Slowpoke:1, Slowbro:1, Slowking:1, Psyduck:1, Spinda:1};
			var stonerQuotes = ['your face is green!', 'I just realised that Arceus fainted for our sins', 'I can, you know, feel the colors', 
			"you're my bro", "I'm imaginining a new color!", "I'm smelling the things I see!", 'hehe, hehe, funny', "I'm hungry!" , 'we are pokemanz',        
			'Did you know that Eevee backwards is eevee?! AMAZING', 'aaaam gonna be the verrrry best like no one evar wasss', 
			"I feel like someone is watching us through a screen!", "come at me bro"];
			if (name in stonedPokemon) {
				var random = this.random(stonerQuotes.length);
				this.add('-message', name + ": Duuuuuude, " + stonerQuotes[random]);
				this.boost({spe:-1, def:1, spd:1}, pokemon, pokemon, {fullname:'high'});
			}
			// Pokemon switch in messages
			var msg = '';
			switch (name) {
			case 'Ludicolo':
				msg = "¡Ay, ay, ay! ¡Vámonos de fiesta, ya llegó Ludicolo!";
				break;
			case 'Missingno':
				msg = "Hide yo items, hide yo data, missingno is here!";
				break;
			case 'Slowpoke': case 'Slowbro':
				var didYouHear = ['Black & White are coming out soon!', 'Genesect has been banned to Ubers!',
				'Smogon is moving to Pokemon Showdown!', "We're having a new thing called Seasonal Ladder!", 'Deoxys is getting Nasty Plot!'];
				didYouHear = didYouHear.randomize();
				msg = 'Did you hear? ' + didYouHear[0];
				break;
			case 'Spinda':
				msg = "LOOK AT ME I'M USING SPINDA";
				break;
			case 'Whimsicott':
				msg = 'Oh dear lord, not SubSeed again!';
				break;
			case 'Liepard':
				msg = '#yoloswag';
				break;
			case 'Tornadus':
				msg = "It's HURRICANE time!";
				break;
			case 'Riolu':
				msg = 'Have you ever raged so hard that you smashed your keyboard? Let me show you.';
				break;
			case 'Gastly': case 'Haunter': case 'Gengar':
				msg = 'Welcome to Trolledville, population: you';
				break;
			case 'Amoonguss':
				msg = 'How do you feel about three sleep turns?';
				break;
			case 'Shaymin-Sky':
				msg = 'Do you know what paraflinch is? huehue';
				break;
			case 'Ferrothorn':
				msg = 'inb4 Stealth Rock';
				break;
			}
			if (msg !== '') {
				this.add('-message', msg);
			}
		},
		onModifyMove: function(move) {
			var dice = this.random(100);
			if (dice < 40) {
				var type = '';
				switch (move.type.toLowerCase()){
				case 'rock':
				case 'ground':
					type = 'Grass';
					break;
				case 'fire':
				case 'bug':
					type = 'Water';
					break;
				case 'water':
				case 'grass':
					type = 'Fire';
					break;
				case 'flying':
					type = 'Fighting';
					break;
				case 'fighting':
					type = 'Flying';
					break;
				case 'dark':
					type = 'Bug';
					break;
				case 'dragon':
				case 'electric':
					type = 'Ice';
					break;
				case 'ghost':
					type = 'Normal';
					break;
				case 'ice':
					type = 'Electric';
					break;
				case 'normal':
				case 'poison':
					type = 'Ghost';
					break;
				case 'psychic':
					type = 'Dark';
					break;
				case 'steel':
					type = 'Poison';
					break;
				}
				
				move.type = type;
				this.add('-message', 'lol trolled, I changed yo move type');
			}
			
			// Additional changes
			if (move.id === 'bulkup') {
				move.onHit = function (target, source, move) {
					var name = (target.ability === 'illusion' && target.illusion)? target.illusion.toString().substr(4, target.illusion.toString().length) : target.name;
					this.add('-message', name + ': Do you even lift, bro?!');
				};
			} else if (move.id === 'charm' || move.id === 'sweetkiss' || move.id === 'attract') {
				var malePickUpLines = ['have you been to Fukushima recently? Because you are glowing tonight!', 
				'did it hurt when you fell to the earth? Because you must be an angel!', 'can I buy you a drink?',
				'roses are red / lemons are sour / spread your legs / and give me an hour', 
				"roses are red / violets are red / I'm not good with colors", "Let's go watch cherry bossoms together (´･ω･`)",
				"Will you be my Denko? (´･ω･`)"];
				malePickUpLines = malePickUpLines.randomize();
				var femalePickUpLines = ['Do you go to the gym? You are buff!', "Guy, you make me hotter than July.",
				"While I stare at you I feel like I just peed myself", "Let's go to my apartment to have midnight coffee", 
				"Marry me, I wanna have 10 kids of you!", "Go out with me or I'll twist your neck!", "Man, you have some nice abs, can I touch them?"];
				femalePickUpLines = femalePickUpLines.randomize();
				move.onTryHit = function (target, source, move) {
					var pickUpLine = '';
					if (source.gender === 'M') {
						pickUpLine = malePickUpLines[0];
					} else if (source.gender === 'F') {
						pickUpLine = femalePickUpLines[0];
					} else {
						return;
					}
					var name = (source.ability === 'illusion' && source.illusion)? source.illusion.toString().substr(4, source.illusion.toString().length) : source.name;
					var targetName = (target.ability === 'illusion' && target.illusion)? target.illusion.toString().substr(4, target.illusion.toString().length) : target.name;
					this.add('-message', name + ': Hey, ' + targetName + ', ' + pickUpLine);
				};
				move.onMoveFail = function(target, source, move) {
                    // Returns false so move calls onHit and onMoveFail
					var femaleRejectLines = ['Uuuh... how about no', "gtfo I'm taken", 'I have to water the plants. On Easter Island. For a year. Bye',
					'GO AWAY CREEP', 'Do you smell like rotten eggs?', "I wouldn't date you even if you were the last Pokemon on earth."];
					femaleRejectLines = femaleRejectLines.randomize();
					var maleRejectLines = ["I'd rather get it on with a dirty daycare Ditto", "I'm not realy sure you're clean", 
					"Ew, you're disgusting!", "It's not me, it's you. Go away, ugly duckling.", "Not really interested *cough*weirdo*cough*"];
					maleRejectLines = maleRejectLines.randomize();
					var answer = '';
					if (target.gender === 'M') {
						answer = maleRejectLines[0];
					} else if (target.gender === 'F') {
						answer = femaleRejectLines[0];
					} else {
						return;
					}
					var targetName = (target.ability === 'illusion' && target.illusion)? target.illusion.toString().substr(4, target.illusion.toString().length) : target.name;
                    if (!target.volatiles['attract']) {
                        this.add('-message', targetName + ': ' + answer);
                    }
                };
			} else if (move.id === 'taunt') {
				var quotes = [
					"Yo mama so fat, she 4x resists Ice- and Fire-type attacks!",
					"Yo mama so ugly, Captivate raises her opponent's Special Attack!",
					"Yo mama so dumb, she lowers her Special Attack when she uses Nasty Plot!",
					"Yo mama so fat, Smogon switched to Pokemon Showdown because PO had an integer overflow bug when you used Grass Knot against her!",
					"Yo mama so dumb, she thought Sylveon would be Light Type!"
				];
				move.onHit = function (target, source) {
					var sourceName = (source.ability === 'illusion' && source.illusion) ? source.illusion.toString().substr(4, source.illusion.toString().length) : source.name;
					this.add('-message', sourceName + ' said, "' + quotes.sample() + '"');
				};
			}
		},
		onFaint: function (pokemon) {
			// A poem every time a Pokemon faints
			var haikus = ["You suck a lot / You are a bad trainer / let a mon faint", "they see me driving / round town with the girl i love / and I'm like, haikou",
			"Ain't no Pokemon tough enough / ain't no bulk decent enough / ain't no recovery good enough / to keep me from fainting you, babe",
			"Roses are red / violets are blue / you must be on some med / 'coz as a trainer you suck",
			"You're gonna be the very worst / like no one ever was / to lose all the battles is your test / to faint them all is your cause",
			'Twinkle twinkle little star / fuck you that was my best sweeper', "I'm wheezy and I'm sleezy / but as a trainer you're measly", 
			"You're sharp as a rock / you're bright as a hole / you're one to mock / you could be beaten by a maimed mole",
			"Alas, poor trainer! I knew him, your Pokémon, a fellow of infinite jest, of most excellent fancy."];
			haikus = haikus.randomize();
			this.add('-message', haikus[0]);
		},
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause']
	},
	hackmons: {
		name: "Hackmons",
		section: "Other Metagames",

		effectType: 'Format',
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon'],
		banlist: []
	},
	balancedhackmons: {
		name: "Balanced Hackmons",
		section: "Other Metagames",

		effectType: 'Format',
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'OHKO Clause'],
		banlist: ['Wonder Guard', 'Pure Power', 'Huge Power', 'Shadow Tag', 'Arena Trap']
	},
	pu: {
		name: "PU",
		section: "Other Metagames",

		effectType: 'Format',
		challengeShow: true,
		ruleset: ['NU'],
		banlist: ["Charizard", "Wartortle", "Kadabra", "Golem", "Haunter", "Exeggutor", "Weezing", "Kangaskhan", "Pinsir", "Lapras", "Ampharos", "Misdreavus", "Piloswine", "Miltank", "Ludicolo", "Swellow", "Gardevoir", "Ninjask", "Torkoal", "Cacturne", "Altaria", "Armaldo", "Gorebyss", "Regirock", "Regice", "Bastiodon", "Floatzel", "Drifblim", "Skuntank", "Lickilicky", "Probopass", "Rotom-Fan", "Samurott", "Musharna", "Gurdurr", "Sawk", "Carracosta", "Garbodor", "Sawsbuck", "Alomomola", "Golurk", "Braviary", "Articuno", "Electabuzz", "Electrode", "Marowak", "Liepard", "Tangela", "Eelektross", "Ditto", "Seismitoad", "Zangoose", "Roselia", "Zebstrika", "Serperior", "Metang", "Tauros", "Torterra", "Cradily"]
	},
	gennextnextou: {
		name: "Gen-NEXT OU",
		section: "Other Metagames",

		mod: 'gennext',
		effectType: 'Format',
		challengeShow: true,
		ruleset: ['Pokemon', 'Standard NEXT', 'Team Preview'],
		banlist: ['Uber']
	},
	oumonotype: {
		name: "OU Monotype",
		section: "Other Metagames",

		effectType: 'Format',
		challengeShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Standard', 'Same Type Clause', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	},
	glitchmons: {
		name: "Glitchmons",
		section: "Other Metagames",

		effectType: 'Format',
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Team Preview'],
		banlist: ['Illegal', 'Unreleased'],
		mimicGlitch: true
	},
	lcubers: {
		name: "LC Ubers",
		section: "Other Metagames",

		effectType: 'Format',
		maxLevel: 5,
		challengeShow: true,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Sonicboom', 'Dragon Rage', 'Berry Juice', 'Soul Dew']
	},
	lcuu: {
		name: "LC UU",
		section: "Other Metagames",

		effectType: 'Format',
		maxLevel: 5,
		challengeShow: true,
		ruleset: ['LC'],
		banlist: ['Abra', 'Aipom', 'Archen', 'Axew', 'Bronzor', 'Chinchou', 'Clamperl', 'Cottonee', 'Cranidos', 'Croagunk', 'Diglett', 'Drifloon', 'Drilbur', 'Dwebble', 'Ferroseed', 'Foongus', 'Frillish', 'Gastly', 'Hippopotas', 'Houndour', 'Koffing', 'Larvesta', 'Lileep', 'Machop', 'Magnemite', 'Mienfoo', 'Misdreavus', 'Munchlax', 'Murkrow', 'Pawniard', 'Ponyta', 'Porygon', 'Riolu', 'Sandshrew', 'Scraggy', 'Shellder', 'Shroomish', 'Slowpoke', 'Snover', 'Staryu', 'Tentacool', 'Timburr', 'Tirtouga']
		},
	dwubers: {
		name: "DW Ubers",
		section: "Other Metagames",

		effectType: 'Format',
		challengeShow: true,
		isTeambuilderFormat: true,
		isDWtier: true,
		ruleset: ['Pokemon', 'Standard DW', 'Team Preview'],
		banlist: []
	},
	dwou: {
		name: "DW OU",
		section: "Other Metagames",

		effectType: 'Format',
		challengeShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Standard DW', 'Team Preview'],
		banlist: ['Drizzle ++ Swift Swim', 'Soul Dew', 'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water', 'Blaziken', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Zekrom']
	},
	dwuu: {
		name: "DW UU",
		section: "Other Metagames",

		effectType: 'Format',
		challengeShow: true,
		ruleset: ['DW OU'],
		banlist: ['Chandelure', 'Genesect', 'Tyranitar', 'Dragonite', 'Breloom', 'Ferrothorn', 'Politoed', 'Gliscor', 'Ninetales', 'Scizor', 'Excadrill', 'Keldeo', 'Infernape', 'Venusaur', 'Heatran', 'Rotom-Wash', 'Garchomp', 'Serperior', 'Gengar', 'Volcarona', 'Forretress', 'Conkeldurr', 'Espeon', 'Cloyster', 'Skarmory', 'Starmie', 'Salamence', 'Gyarados', 'Zapdos', 'Jirachi', 'Latios', 'Tentacruel', 'Haxorus', 'Landorus', 'Mamoswine', 'Charizard', 'Lucario', 'Jellicent', 'Blissey', 'Terrakion', 'Heracross', 'Metagross', 'Ditto', 'Hydreigon', 'Thundurus', 'Alakazam', 'Deoxys-Speed', 'Latias', 'Gastrodon', 'Togekiss', 'Donphan', 'Bronzong', 'Manaphy']
	},

	// Past Generations
	///////////////////////////////////////////////////////////////////

	gen4oubeta: {
		name: "[Gen 4] OU (beta)",
		section: "Past Generations",

		mod: 'gen4',
		effectType: 'Format',
		challengeDefault: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber']
	},
	gen4hackmons: {
		name: "[Gen 4] Hackmons",
		section: "Past Generations",

		mod: 'gen4',
		effectType: 'Format',
		challengeShow: true,
		ruleset: ['Pokemon'],
		banlist: []
	},
	gen4customgame: {
		name: "[Gen 4] Custom Game",
		section: "Past Generations",

		mod: 'gen4',
		effectType: 'Format',
		challengeShow: true,
		canUseRandomTeam: true,
		debug: true,
		ruleset: []
	},
	gen3hackmons: {
		name: "[Gen 3] Hackmons",
		section: "Past Generations",

		mod: 'gen3',
		effectType: 'Format',
		challengeShow: true,
		ruleset: ['Pokemon'],
		banlist: []
	},
	gen3customgame: {
		name: "[Gen 3] Custom Game",
		section: "Past Generations",

		mod: 'gen3',
		effectType: 'Format',
		challengeShow: true,
		ruleset: []
	},
	gen1customgame: {
		name: "[Gen 1] Custom Game",
		section: "Past Generations",

		mod: 'gen1',
		effectType: 'Format',
		challengeShow: true,
		debug: true,
		ruleset: ['Pokemon']
	},


	standardnext: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause', 'Species Clause', 'OHKO Clause'],
		banlist: ['Unreleased', 'Illegal', 'Double Team'],
		validateSet: function(set) {
			// limit one of each move in Standard
			var moves = [];
			if (set.moves) {
				var hasMove = {};
				for (var i=0; i<set.moves.length; i++) {
					var move = this.getMove(set.moves[i]);
					var moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(set.moves[i]);
				}
			}
			set.moves = moves;
		}
	},

	// Rulesets
	///////////////////////////////////////////////////////////////////

	standard: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause'],
		banlist: ['Unreleased', 'Illegal'],
		validateSet: function(set) {
			// limit one of each move in Standard
			var moves = [];
			if (set.moves) {
				var hasMove = {};
				for (var i=0; i<set.moves.length; i++) {
					var move = this.getMove(set.moves[i]);
					var moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(set.moves[i]);
				}
			}
			set.moves = moves;
		}
	},
	standardubers: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause', 'Species Clause', 'Moody Clause', 'OHKO Clause'],
		banlist: ['Unreleased', 'Illegal'],
		validateSet: function(set) {
			// limit one of each move in Standard
			var moves = [];
			if (set.moves) {
				var hasMove = {};
				for (var i=0; i<set.moves.length; i++) {
					var move = this.getMove(set.moves[i]);
					var moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(set.moves[i]);
				}
			}
			set.moves = moves;
		}
	},
	standarddw: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause'],
		banlist: ['Illegal', 'Moody'],
		validateSet: function(set) {
			// limit one of each move in Standard
			var moves = [];
			if (set.moves) {
				var hasMove = {};
				for (var i=0; i<set.moves.length; i++) {
					var move = this.getMove(set.moves[i]);
					var moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(set.moves[i]);
				}
			}
			set.moves = moves;
		}
	},
	pokemon: {
		effectType: 'Banlist',
		validateSet: function(set, format) {
			var item = this.getItem(set.item);
			var template = this.getTemplate(set.species);
			var problems = [];

			if (set.species === set.name) delete set.name;
			if (template.num == 493) { // Arceus
				if (set.ability === 'Multitype' && item.onPlate) {
					set.species = 'Arceus-'+item.onPlate;
				} else {
					set.species = 'Arceus';
				}
			}
			if (template.num == 487) { // Giratina
				if (item.id === 'griseousorb') {
					set.species = 'Giratina-Origin';
					if (format.banlistTable && format.banlistTable['illegal']) set.ability = 'Levitate';
				} else {
					set.species = 'Giratina';
					if (format.banlistTable && format.banlistTable['illegal']) set.ability = 'Pressure';
				}
			}
			if (template.num == 555) { // Darmanitan
				set.species = 'Darmanitan';
			}
			if (template.num == 648) { // Meloetta
				set.species = 'Meloetta';
			}
			if (template.num == 351) { // Castform
				set.species = 'Castform';
			}
			if (template.num == 421) { // Cherrim
				set.species = 'Cherrim';
			}
			if (template.num == 647) { // Keldeo
				if (set.species === 'Keldeo-Resolution' && set.moves.indexOf('Secret Sword') < 0) {
					set.species = 'Keldeo';
				}
			}
			if (template.isNonstandard) {
				problems.push(set.species+' is not a real Pokemon.');
			}
			if (set.ability) {
				var ability = this.getAbility(set.ability);
				if (ability.isNonstandard) {
					problems.push(ability.name+' is not a real ability.');
				}
			}
			if (set.moves) for (var i=0; i<set.moves.length; i++) {
				var move = this.getMove(set.moves[i]);
				if (move.isNonstandard) {
					problems.push(move.name+' is not a real move.');
				}
			}
			if (set.moves && set.moves.length > 4) {
				problems.push((set.name||set.species) + ' has more than four moves.');
			}
			if (set.level && set.level > 100) {
				problems.push((set.name||set.species) + ' is higher than level 100.');
			}
			return problems;
		}
	},
	cappokemon: {
		effectType: 'Rule',
		validateSet: function(set, format) {
			// don't return
			this.getEffect('Pokemon').validateSet.call(this, set, format);
		}
	},
	legal: {
		effectType: 'Banlist',
		banlist: ['Crobat+BraveBird+Hypnosis']
	},
	potd: {
		effectType: 'Rule',
		onPotD: '',
		onStart: function() {
			if (this.effect.onPotD) {
				this.add('rule', 'Pokemon of the Day: '+this.effect.onPotD);
			}
		}
	},
	teampreviewvgc: {
		onStartPriority: -10,
		onStart: function() {
			this.add('clearpoke');
			for (var i=0; i<this.sides[0].pokemon.length; i++) {
				this.add('poke', this.sides[0].pokemon[i].side.id, this.sides[0].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++) {
				this.add('poke', this.sides[1].pokemon[i].side.id, this.sides[1].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
		},
		onTeamPreview: function() {
			this.makeRequest('teampreview', 4);
		}
	},
	teampreview1v1: {
		onStartPriority: -10,
		onStart: function() {
			this.add('clearpoke');
			for (var i=0; i<this.sides[0].pokemon.length; i++) {
				this.add('poke', this.sides[0].pokemon[i].side.id, this.sides[0].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++) {
				this.add('poke', this.sides[1].pokemon[i].side.id, this.sides[1].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
		},
		onTeamPreview: function() {
			this.makeRequest('teampreview', 1);
		}
	},
	teampreview: {
		onStartPriority: -10,
		onStart: function() {
			this.add('clearpoke');
			for (var i=0; i<this.sides[0].pokemon.length; i++) {
				this.add('poke', this.sides[0].pokemon[i].side.id, this.sides[0].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++) {
				this.add('poke', this.sides[1].pokemon[i].side.id, this.sides[1].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
		},
		onTeamPreview: function() {
			this.makeRequest('teampreview');
		}
	},
	littlecup: {
		effectType: 'Rule',
		validateSet: function(set) {
			var template = this.getTemplate(set.species || set.name);
			if (template.prevo) {
				return [set.species+" isn't the first in its evolution family."];
			}
			if (!template.nfe) {
				return [set.species+" doesn't have an evolution family."];
			}
		}
	},
	speciesclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Species Clause: Limit one of each Pokemon');
		},
		validateTeam: function(team, format) {
			var speciesTable = {};
			for (var i=0; i<team.length; i++) {
				var template = this.getTemplate(team[i].species);
				if (speciesTable[template.num]) {
					return ["You are limited to one of each pokemon by Species Clause.","(You have more than one "+template.name+")"];
				}
				speciesTable[template.num] = true;
			}
		}
	},
	itemclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Item Clause: Limit one of each item');
		},
		validateTeam: function(team, format) {
			var itemTable = {};
			for (var i=0; i<team.length; i++) {
				var item = toId(team[i].item);
				if (!item) continue;
				if (itemTable[item]) {
					return ["You are limited to one of each item by Item Clause.","(You have more than one "+this.getItem(item).name+")"];
				}
				itemTable[item] = true;
			}
		}
	},
	ohkoclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'OHKO Clause: OHKO moves are banned');
		},
		validateSet: function(set) {
			var problems = [];
			if (set.moves) {
				for (var i in set.moves) {
					var move = this.getMove(set.moves[i]);
					if (move.ohko) problems.push(move.name+' is banned by OHKO Clause.');
				}
			}
			return problems;
		}
	},
	evasionabilitiesclause: {
		effectType: 'Banlist',
		name: 'Evasion Abilities Clause',
		banlist: ['Sand Veil', 'Snow Cloak'],
		onStart: function() {
			this.add('rule', 'Evasion Abilities Clause: Evasion abilities are banned');
		}
	},
	evasionmovesclause: {
		effectType: 'Banlist',
		name: 'Evasion Moves Clause',
		banlist: ['Minimize', 'Double Team'],
		onStart: function() {
			this.add('rule', 'Evasion Moves Clause: Evasion moves are banned');
		}
	},
	moodyclause: {
		effectType: 'Banlist',
		name: 'Moody Clause',
		banlist: ['Moody'],
		onStart: function() {
			this.add('rule', 'Moody Clause: Moody is banned');
		}
	},
	sleepclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Sleep Clause: Limit one foe put to sleep');
		},
		onSetStatus: function(status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'slp') {
				for (var i=0; i<target.side.pokemon.length; i++) {
					var pokemon = target.side.pokemon[i];
					if (pokemon.status === 'slp') {
						if (!pokemon.statusData.source ||
							pokemon.statusData.source.side !== pokemon.side) {
							this.add('-message', 'Sleep Clause activated.');
							return false;
						}
					}
				}
			}
		}
	},
	freezeclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Freeze Clause: Limit one foe frozen');
		},
		onSetStatus: function(status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'frz') {
				for (var i=0; i<target.side.pokemon.length; i++) {
					var pokemon = target.side.pokemon[i];
					if (pokemon.status === 'frz') {
						this.add('-message', 'Freeze Clause activated.');
						return false;
					}
				}
			}
		}
	},
	sametypeclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Same Type Clause: Pokemon in a team must share a type');
		},
		validateTeam: function(team, format) {
			var typeTable = {};
			for (var i=0; i<team.length; i++) {
				var template = this.getTemplate(team[i].species);

				// first type
				var type = template.types[0];
				typeTable[type] = (typeTable[type]||0) + 1;

				// second type
				type = template.types[1];
				if (type) typeTable[type] = (typeTable[type]||0) + 1;
			}
			for (var type in typeTable) {
				if (typeTable[type] >= team.length) {
					return;
				}
			}
			return ["Your team must share a type."];
		}
	}
};
