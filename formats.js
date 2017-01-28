/**
 * Seasonal Ladders of Pokémon Showdown
 * The formats with the mod-like tweaks go into /config/formats.js
 * The team making scripts go into /data/scripts.js
 *
 * THIS IS A BACKUP FILE.
 */

'use strict';

exports.Formats = [
	// Seasoning Greetings, November 2012
	{
		section: "OM of the Month",
	},
	{
		name: "[Seasonal] Seasoning's Greetings",

		team: 'randomSeasonal',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause'],
	},
	// Winter Wonderland, December 2012 and January 2013
	{
		name: "[Seasonal] Winter Wonderland",

		team: 'randomSeasonalWW',
		onBegin: function () {
			this.setWeather('Hail');
			delete this.weatherData.duration;
		},
		onModifyMove: function (move) {
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
					move.onTryHit = function () {
						this.add('-message', "The present was a bomb!");
					};
					move.category = 'Physical';
					move.basePower = 200;
					break;
				case 5:
					move.onTryHit = function () {
						this.add('-message', "The present was confusion!");
					};
					move.volatileStatus = 'confusion';
					break;
				case 6:
					move.onTryHit = function () {
						this.add('-message', "The present was Disable!");
					};
					move.volatileStatus = 'disable';
					break;
				case 7:
					move.onTryHit = function () {
						this.add('-message', "The present was a taunt!");
					};
					move.volatileStatus = 'taunt';
					break;
				case 8:
					move.onTryHit = function () {
						this.add('-message', "The present was some seeds!");
					};
					move.volatileStatus = 'leechseed';
					break;
				case 9:
					move.onTryHit = function () {
						this.add('-message', "The present was an embargo!");
					};
					move.volatileStatus = 'embargo';
					break;
				case 10:
					move.onTryHit = function () {
						this.add('-message', "The present was a music box!");
					};
					move.volatileStatus = 'perishsong';
					break;
				case 11:
					move.onTryHit = function () {
						this.add('-message', "The present was a curse!");
					};
					move.volatileStatus = 'curse';
					break;
				case 12:
					move.onTryHit = function () {
						this.add('-message', "The present was Torment!");
					};
					move.volatileStatus = 'torment';
					break;
				case 13:
					move.onTryHit = function () {
						this.add('-message', "The present was a trap!");
					};
					move.volatileStatus = 'partiallytrapped';
					break;
				case 14:
					move.onTryHit = function () {
						this.add('-message', "The present was a root!");
					};
					move.volatileStatus = 'ingrain';
					break;
				case 15:
				case 16:
				case 17: {
					move.onTryHit = function () {
						this.add('-message', "The present was a makeover!");
					};

					let possibleBoosts = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy']; // Respect Evasion Clause
					let boosts = {
						[this.sampleNoReplace(possibleBoosts)]: 1,
						[this.sampleNoReplace(possibleBoosts)]: -1,
						[this.sampleNoReplace(possibleBoosts)]: -1,
					};
					move.boosts = boosts;
					break;
				}
				case 18:
					move.onTryHit = function () {
						this.add('-message', "The present was psychic powers!");
					};
					move.volatileStatus = 'telekinesis';
					break;
				case 19:
					move.onTryHit = function () {
						this.add('-message', "The present was fatigue!");
					};
					move.volatileStatus = 'mustrecharge';
					break;
				}
			}
		},
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause'],
	},
	// Valentine Venture, February 2013
	{
		name: "[Seasonal] Valentine Venture",

		team: 'randomSeasonalVV',
		gameType: 'doubles',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause'],
	},
	// Spring Forward, March 2013
	{
		name: "[Seasonal] Spring Forward",

		team: 'randomSeasonalSF',
		teamLength: {
			battle: 3,
		},
		greenPokemon: {
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
			bronzor:1, bronzong:1, gallade:1,
		},
		onBegin: function () {
			if (this.random(100) < 75) {
				this.add('-message', "March and April showers bring May flowers...");
				this.setWeather('Rain Dance');
				delete this.weatherData.duration;
			}
		},
		onSwitchIn: function (pokemon) {
			if (pokemon.template.speciesid in this.getFormat().greenPokemon) {
				this.add('-message', pokemon.name + " drank way too much!");
				pokemon.addVolatile('confusion');
				pokemon.statusData.time = 0;
			}
		},
		onBeforeMove: function (attacker, defender, move) {
			if (move.id === 'barrage') {
				this.add('-message', "You found a little chocolate egg!");
			}
		},
		onModifyMove: function (move) {
			if (move.id === 'barrage') {
				move.category = 'Special';
				move.type = 'Grass';
				move.basePower = 35;
				move.critRatio = 2;
				move.accuracy = 100;
				move.multihit = [3, 5];
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
				move.heal = [3, 4];
				move.onHit = function (target) {
					this.add('-message', target.name + " ate a delicious chocolate egg!");
				};
			} else {
				// As luck is everywhere...
				move.critRatio = 2;
			}
		},
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause'],
	},
	// Fools Festival, April 2013
	{
		name: "[Seasonal] Fools Festival",

		team: 'randomSeasonalFF',
		onBegin: function () {
			let dice = this.random(100);
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
		onSwitchIn: function (pokemon) {
			let name = (pokemon.ability === 'illusion' && pokemon.illusion) ? pokemon.illusion.toString().substr(4, pokemon.illusion.toString().length) : pokemon.name;
			let stonedPokemon = {Koffing:1, Weezing:1, Slowpoke:1, Slowbro:1, Slowking:1, Psyduck:1, Spinda:1};
			let stonerQuotes = ['your face is green!', 'I just realised that Arceus fainted for our sins', 'I can, you know, feel the colors',
				"you're my bro", "I'm imaginining a new color!", "I'm smelling the things I see!", 'hehe, hehe, funny', "I'm hungry!", 'we are pokemanz',
				'Did you know that Eevee backwards is eevee?! AMAZING', 'aaaam gonna be the verrrry best like no one evar wasss',
				"I feel like someone is watching us through a screen!", "come at me bro"];
			if (name in stonedPokemon) {
				let random = this.random(stonerQuotes.length);
				this.add('-message', name + ": Duuuuuude, " + stonerQuotes[random]);
				this.boost({spe:-1, def:1, spd:1}, pokemon, pokemon, {fullname:'high'});
			}
			// Pokemon switch in messages
			let msg = '';
			switch (name) {
			case 'Ludicolo':
				msg = "¡Ay, ay, ay! ¡Vámonos de fiesta, ya llegó Ludicolo!";
				break;
			case 'Missingno':
				msg = "Hide yo items, hide yo data, missingno is here!";
				break;
			case 'Slowpoke': case 'Slowbro':
				let didYouHear = ['Black & White are coming out soon!', 'Genesect has been banned to Ubers!',
					'Smogon is moving to Pokemon Showdown!', "We're having a new thing called Seasonal Ladder!", 'Deoxys is getting Nasty Plot!'];
				msg = 'Did you hear? ' + this.sampleNoReplace(didYouHear);
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
		onModifyMove: function (move) {
			let dice = this.random(100);
			if (dice < 40) {
				let type = '';
				switch (move.type.toLowerCase()) {
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
					let name = (target.ability === 'illusion' && target.illusion) ? target.illusion.toString().substr(4, target.illusion.toString().length) : target.name;
					this.add('-message', name + ': Do you even lift, bro?!');
				};
			} else if (move.id === 'charm' || move.id === 'sweetkiss' || move.id === 'attract') {
				let malePickUpLines = [
					'have you been to Fukushima recently? Because you are glowing tonight!',
					'did it hurt when you fell to the earth? Because you must be an angel!', 'can I buy you a drink?',
					'roses are red / lemons are sour / spread your legs / and give me an hour',
					"roses are red / violets are red / I'm not good with colors", "Let's go watch cherry bossoms together (´･ω･`)",
					"Will you be my Denko? (´･ω･`)",
				];
				let femalePickUpLines = [
					'Do you go to the gym? You are buff!', "Guy, you make me hotter than July.",
					"While I stare at you I feel like I just peed myself", "Let's go to my apartment to have midnight coffee",
					"Marry me, I wanna have 10 kids of you!", "Go out with me or I'll twist your neck!", "Man, you have some nice abs, can I touch them?",
				];
				move.onTryHit = function (target, source, move) {
					let pickUpLine = '';
					if (source.gender === 'M') {
						pickUpLine = this.sampleNoReplace(malePickUpLines);
					} else if (source.gender === 'F') {
						pickUpLine = this.sampleNoReplace(femalePickUpLines);
					} else {
						return;
					}
					let name = (source.ability === 'illusion' && source.illusion) ? source.illusion.name : source.name;
					let targetName = (target.ability === 'illusion' && target.illusion) ? target.illusion.name : target.name;
					this.add('-message', name + ': Hey, ' + targetName + ', ' + pickUpLine);
				};
				move.onMoveFail = function (target, source, move) {
					// Returns false so move calls onHit and onMoveFail
					let femaleRejectLines = [
						'Uuuh... how about no', "gtfo I'm taken", 'I have to water the plants. On Easter Island. For a year. Bye',
						'GO AWAY CREEP', 'Do you smell like rotten eggs?', "I wouldn't date you even if you were the last Pokemon on earth.",
					];
					let maleRejectLines = [
						"I'd rather get it on with a dirty daycare Ditto", "I'm not realy sure you're clean",
						"Ew, you're disgusting!", "It's not me, it's you. Go away, ugly duckling.", "Not really interested *cough*weirdo*cough*",
					];
					let answer = '';
					if (target.gender === 'M') {
						answer = this.sampleNoReplace(maleRejectLines);
					} else if (target.gender === 'F') {
						answer = this.sampleNoReplace(femaleRejectLines);
					} else {
						return;
					}
					let targetName = (target.ability === 'illusion' && target.illusion) ? target.illusion.name : target.name;
					if (!target.volatiles['attract']) {
						this.add('-message', targetName + ': ' + answer);
					}
				};
			} else if (move.id === 'taunt') {
				let quotes = [
					"Yo mama so fat, she 4x resists Ice- and Fire-type attacks!",
					"Yo mama so ugly, Captivate raises her opponent's Special Attack!",
					"Yo mama so dumb, she lowers her Special Attack when she uses Nasty Plot!",
					"Yo mama so fat, Smogon switched to Pokemon Showdown because PO had an integer overflow bug when you used Grass Knot against her!",
					"Yo mama so dumb, she thought Sylveon would be Light Type!",
				];
				move.onHit = function (target, source) {
					let sourceName = (source.ability === 'illusion' && source.illusion) ? source.illusion.name : source.name;
					this.add('-message', sourceName + ' said, "' + quotes.sample() + '"');
				};
			}
		},
		onFaint: function (pokemon) {
			// A poem every time a Pokemon faints
			let haikus = [
				"You suck a lot / You are a bad trainer / let a mon faint", "they see me driving / round town with the girl i love / and I'm like, haikou",
				"Ain't no Pokemon tough enough / ain't no bulk decent enough / ain't no recovery good enough / to keep me from fainting you, babe",
				"Roses are red / violets are blue / you must be on some med / 'coz as a trainer you suck",
				"You're gonna be the very worst / like no one ever was / to lose all the battles is your test / to faint them all is your cause",
				'Twinkle twinkle little star / fuck you that was my best sweeper', "I'm wheezy and I'm sleezy / but as a trainer you're measly",
				"You're sharp as a rock / you're bright as a hole / you're one to mock / you could be beaten by a maimed mole",
				"Alas, poor trainer! I knew him, your Pokémon, a fellow of infinite jest, of most excellent fancy.",
			];
			this.add('-message', this.sampleNoReplace(haikus));
		},
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause'],
	},
	{
		name: "[Seasonal] May Mayhem",

		team: 'randomSeasonalMM',
		onBegin: function () {
			// Shameless plug
			let day = new Date().getDay();
			if (day === 12) {
				this.add('-message', 'Wish a HAPPY BIRTHDAY to Treecko32!!');
			}
			if (day === 16) {
				this.add('-message', 'Wish a HAPPY BIRTHDAY to Joim!!');
			}
		},
		onSwitchIn: function (pokemon) {
			let dice = this.random(100);
			if (dice < 25) {
				this.add('-message', 'Never gonna give you up, never gonna let you down');
			}
		},
	},
	{
		name: "[Seasonal] June Jubilee",

		team: 'randomSeasonalJJ',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod'],
		onBegin: function () {
			this.add('-message', "Greetings, trainer! Delibird needs your help! It's lost in the US and it needs to find its way back to the arctic before summer starts! Help your Delibird while travelling north, but you must defeat the opponent before he reaches there first!");
			this.setWeather('Sunny Day');
			delete this.weatherData.duration;

			this.seasonal = {'none':false, 'drizzle':false, 'hail':false};
		},
		onBeforeMove: function (pokemon, target, move) {
			// Reshiram changes weather with its tail until you reach the arctic
			if (pokemon.template.speciesid === 'reshiram' && this.turn < 15) {
				let weatherMsg = '';
				let dice = this.random(100);
				if (dice < 25) {
					this.setWeather('Rain Dance');
					weatherMsg = 'a Drizzle';
				} else if (dice < 50) {
					this.setWeather('Sunny Day');
					weatherMsg = 'a Sunny Day';
				} else if (dice < 75) {
					this.setWeather('Hail');
					weatherMsg = 'Hail';
				} else {
					this.setWeather('Sandstorm');
					weatherMsg = 'a Sandstorm';
				}
				this.add('-message', "Reshiram caused " + weatherMsg + " with its tail!");
				delete this.weatherData.duration;
			}

			if (this.turn >= 4 && this.seasonal.none === false) {
				this.add('-message', "You are travelling north and you have arrived to North Dakota! There's a clear sky and the temperature is lower here.");
				this.clearWeather();
				this.seasonal.none = true;
			}
			if (this.turn >= 8 && this.seasonal.drizzle === false) {
				this.add('-message', "You are travelling further north and you have arrived to Edmonton! It started raining a lot... and it's effing cold.");
				this.setWeather('Rain Dance');
				delete this.weatherData.duration;
				this.seasonal.drizzle = true;
			}
			if (this.turn >= 12 && this.seasonal.hail === false) {
				this.add('-message', "You have arrived to the arctic! Defeat the other trainer so Delibird can be free!");
				this.setWeather('Hail');
				delete this.weatherData.duration;
				this.seasonal.hail = true;
			}
		},
		onFaint: function (pokemon) {
			if (pokemon.template.id === 'delibird') {
				let name = pokemon.side.name;
				let winner = pokemon.side.id === 'p1' ? 'p2' : 'p1';
				this.add('-message', "No!! You let Delibird down. He trusted you. You lost the battle, " + name + ". But you lost something else: your Pokémon's trust.");
				pokemon.battle.win(winner);
			}
		},
	},
	{
		name: "[Seasonal] Jolly July",

		team: 'randomSeasonalJuly',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod'],
		onBegin: function () {
			this.add('-message', "You and your faithful favourite Pokémon are travelling around the world, and you will fight this trainer in many places until either win or finish the travel!");
			// ~learn international independence days with PS~
			switch (new Date().getDay()) {
			case 4:
				// 4th of July for the US
				this.add('-message', "FUCK YEAH 'MURICA!");
				break;
			case 5:
				// 5th independence day of Algeria and Venezuela
				this.add('-message', "¡Libertad para Venezuela o muerte!");
				break;
			case 9:
				// 9th independence day of Argentina and South Sudan
				this.add('-message', "¡Che, viteh que somos libres!");
				break;
			case 10:
				// Bahamas
				this.add('-message', "Free the beaches!");
				break;
			case 20:
				// Colombia
				this.add('-message', "¡Independencia para Colombia!");
				break;
			case 28:
				// Perú
				this.add('-message', "¡Per\u00fa libre!");
				break;
			}

			// Set up the cities you visit around the world
			this.cities = {
				'N': [
					'Madrid', 'Paris', 'London', 'Ghent', 'Amsterdam', 'Gdansk',
					'Munich', 'Rome', 'Rabat', 'Stockholm', 'Moscow', 'Beijing',
					'Tokyo', 'Dubai', 'New York', 'Vancouver', 'Los Angeles',
					'Edmonton', 'Houston', 'Mexico DF', 'Barcelona', 'Blanes',
				],
				'S': [
					'Buenos Aires', 'Lima', 'Johanesburg', 'Sydney', 'Melbourne',
					'Santiago de Chile', 'Bogota', 'Lima', 'Montevideo',
					'Wellington', 'Canberra', 'Jakarta', 'Kampala', 'Mumbai',
					'Auckland', 'Pretoria', 'Cape Town',
				],
			};
			this.currentPlace = {'hemisphere':'N', 'city':'Townsville'};
			this.cities.N = this.shuffle(this.cities.N.slice());
			this.cities.S = this.shuffle(this.cities.S.slice());
			this.indexes = {'N':0, 'S':0};

			// We choose a hemisphere and city to be in at the beginning
			if (this.random(100) < 50) this.currentPlace.hemisphere = 'S';
			this.currentPlace.city = this.cities[this.currentPlace.hemisphere][0];
			this.indexes[this.currentPlace.hemisphere]++;
		},
		onBeforeMove: function (pokemon) {
			if (this.random(100) > 75) {
				// Snarky comments from one trainer to another
				let comments = [
					"I've heard your mom is also travelling around the world catchin' em all, if you get what I mean, %s.",
					"You fight like a Miltank!", "I'm your Stealth Rock to your Charizard, %s!",
					"I bet I could beat you with a Spinda. Or an Unown.", "I'm rubber, you're glue!",
					"I've seen Slowpokes with more training prowess, %s.", "You are no match for me, %s!",
					"%s, have you learned how to battle from Bianca?",
				];
				let otherTrainer = (pokemon.side.id === 'p1') ? 'p2' : 'p1';
				this.add('-message', pokemon.side.name + ': ' + this.sampleNoReplace(comments).replace('%s', this[otherTrainer].name));
			}

			// This is the stuff that is calculated every turn once
			if (!this.lastMoveTurn) this.lastMoveTurn = 0;
			if (this.lastMoveTurn !== this.turn) {
				let nextChange = this.random(2, 4);
				if (this.lastMoveTurn === 0 || this.lastMoveTurn + nextChange <= this.turn) {
					this.lastMoveTurn = this.turn;
					if (this.random(100) < 50) {
						if (this.currentPlace.hemisphere === 'N') {
							this.currentPlace.hemisphere = 'S';
							this.add('-fieldstart', 'move: Wonder Room', '[of] Seasonal');
						} else {
							this.currentPlace.hemisphere = 'N';
							this.add('-fieldend', 'move: Wonder Room', '[of] Seasonal');
						}
					}

					// Let's check if there's cities to visit left
					if (this.indexes.N === this.cities['N'].length - 1 &&
						this.indexes.S === this.cities['S'].length - 1) {
						this.add('-message', "You have travelled all around the world, " + pokemon.side.name + "! You won!");
						pokemon.battle.win(pokemon.side.id);
						return false;
					}
					// Otherwise, move to the next city
					this.currentPlace.city = this.cities[this.currentPlace.hemisphere][this.indexes[this.currentPlace.hemisphere]];
					this.indexes[this.currentPlace.hemisphere]++;
					let hemispheres = {'N':'northern', 'S':'southern'};
					this.add('-message', "Travelling around the world, you have arrived to a new city in the " + hemispheres[this.currentPlace.hemisphere] + " hemisphere, " + this.currentPlace.city + "!");
				}
			}
		},
		onModifyMove: function (move) {
			if (move.id === 'fireblast') move.name = 'July 4th Fireworks';
		},
	},
	{
		name: "[Seasonal] Average August",

		team: 'randomSeasonalAA',
		gameType: 'doubles',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod'],
		shipNames: [
			'Zarelrules', 'Joimawesome', 'Treeckonoob', 'MJailBait', 'mikelpuns', 'TTTtttttt', 'Frazzle Dazzle',
			'TIbot', 'CDXCIV', 'Srs Bsns Trts', 'Leemz', 'Eggymad', 'Snoffles', 'bmelted', 'Poopes', 'Hugonedugen',
			'Il Haunter', 'chaospwns', 'WaterBro', 'niggie', 'DOOM', 'qhore', 'Jizzmine', 'Aldarown',
		],
		onBegin: function () {
			// What does player 1 lead with?
			let p1Where = 'boat';
			let p2Where = 'boat';
			if (this.p1.pokemon[0].name === 'Kyogre') p1Where = 'pirates';
			if (this.p2.pokemon[0].name === 'Kyogre') p2Where = 'pirates';
			let ships = this.getFormat().shipNames;
			let shipName = `S. S. ${ships[Math.floor(Math.random() * ships.length)]}`;
			let whereAreThey = (p1Where === 'boat' && p2Where === 'boat') ? 'You both were aboard the fantastic ship ' + shipName :
			((p1Where === 'pirates' && p2Where === 'pirates') ? 'You are two pirate gangs on a summer sea storm about to raze the ship ' + shipName :
			((p1Where === 'pirates') ? this.p1.name : this.p2.name) + ' leads a pirate boat to raze the ship ' + shipName +
			' where ' + ((p1Where === 'pirates') ? this.p2.name : this.p1.name)) + ' is enjoying a sea travel,';

			this.add('-message',
				'Alas, poor trainers! ' + whereAreThey + " when a sudden summer Hurricane made a Wailord hit your transport, and now it's sinking! " +
				"There are not enough life boats for everyone nor trainers ain't sharing their Water-type friends, " +
				"so you'll have to fight to access a life boat! Good luck! You have to be fast to not to be hit by the Hurricane!"
			);
		},
		onSwitchIn: function () {
			if (!this.turn) return;
			let notifyActivate = false;
			let allActives = this.p1.active.concat(this.p2.active);
			for (let pokemon of allActives) {
				if (!pokemon) continue;
				if (!pokemon.volatiles['perishsong']) {
					notifyActivate = true;
				}
				if (!pokemon.hasAbility('soundproof')) {
					pokemon.addVolatile('perishsong');
				} else {
					this.add('-immune', pokemon, '[msg]');
					this.add('-end', pokemon, 'Perish Song');
				}
			}

			if (notifyActivate) {
				this.add('-fieldactivate', 'move: Perish Song');
			}
		},
	},
	{
		name: "[Seasonal] School Schemes",

		team: 'randomSeasonalSS',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod'],
	},
	{
		name: "[Seasonal] Octoberfest",

		mod: 'gen5',
		team: 'randomSeasonalOF',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod'],

		onModifyMove: function (move) {
			if (move.id === 'trick') {
				delete move.onHit;
				switch (this.random(17)) {
				case 0:
					move.onTryHit = function () {
						this.add('-message', 'Trick: Kick on the nuts!');
					};
					move.category = 'Physical';
					move.type = 'Normal';
					move.basePower = 200;
					break;
				case 1:
					move.onTryHit = function () {
						this.add('-message', 'Trick: Fireworks at your feet!');
					};
					move.category = 'Special';
					move.type = 'Fire';
					move.basePower = 200;
					break;
				case 2:
					move.onTryHit = function () {
						this.add('-message', 'Trick: Doused with water!');
					};
					move.category = 'Special';
					move.type = 'Water';
					move.basePower = 200;
					break;
				case 3:
					move.onTryHit = function () {
						this.add('-message', 'Trick: Bombed with rotten eggs!');
					};
					move.category = 'Special';
					move.type = 'Poison';
					move.basePower = 200;
					break;
				case 4:
					move.onTryHit = function () {
						this.add('-message', 'Trick: You got scared by a real-looking costume!');
					};
					move.category = 'Special';
					move.type = 'Dark';
					move.basePower = 200;
					break;
				case 5:
					move.onTryHit = function () {
						this.add('-message', 'Trick: You got hit in the head!');
					};
					move.volatileStatus = 'confusion';
					break;
				case 6:
					move.onTryHit = function () {
						this.add('-message', 'Trick: Your arms were maimed!');
					};
					move.volatileStatus = 'disable';
					break;
				case 7:
					move.onTryHit = function () {
						this.add('-message', "Trick: You've been taunted by those meddling kids!");
					};
					move.volatileStatus = 'taunt';
					break;
				case 8:
					move.onTryHit = function () {
						this.add('-message', 'Treat: You got some yummy seeds!');
					};
					move.volatileStatus = 'leechseed';
					break;
				case 9:
					move.onTryHit = function () {
						this.add('-message', 'Trick: Your car was stolen!');
					};
					move.volatileStatus = 'embargo';
					break;
				case 10:
					move.onTryHit = function () {
						this.add('-message', "Trick: You're haunted and you're going to die!");
					};
					move.volatileStatus = 'perishsong';
					break;
				case 11:
					move.onTryHit = function () {
						this.add('-message', 'Trick: A ghost cursed you!');
					};
					move.volatileStatus = 'curse';
					break;
				case 12:
					move.onTryHit = function () {
						this.add('-message', "Trick: You're tormented by the constant tricking!");
					};
					move.volatileStatus = 'torment';
					break;
				case 13:
					move.onTryHit = function () {
						this.add('-message', 'Treat: Om nom nom roots!');
					};
					move.volatileStatus = 'ingrain';
					break;
				case 14: {
					move.onTryHit = function () {
						this.add('-message', 'Treat: Uhm, these candy taste weird...');
					};

					let possibleBoosts = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy']; // Respect Evasion Clause
					let boosts = {
						[this.sampleNoReplace(possibleBoosts)]: 1,
						[this.sampleNoReplace(possibleBoosts)]: -1,
						[this.sampleNoReplace(possibleBoosts)]: -1,
					};
					move.boosts = boosts;
					break;
				}
				case 15:
					move.onTryHit = function () {
						this.add('-message', "Trick: You're tired of running after teenagers with your baseball bat.");
					};
					move.volatileStatus = 'mustrecharge';
					break;
				case 16:
					move.onTryHit = function () {
						this.add('-message', "Treat: You got candy!");
					};
					move.heal = [1, 2];
					break;
				}
			} else if (move.id === 'present' && this.random(10) < 3) {
				move.accuracy = 55;
				move.basePower = 0;
				move.category = 'Status';
				move.status = 'slp';
				move.heal = null;
				move.name = 'Sing';
				move.flags = Object.assign({}, this.getMove('sing').flags);
			} else if (move.id === 'present') {
				move.accuracy = 100;
				move.basePower = 0;
				move.category = 'Status';
				move.volatileStatus = 'confusion';
				move.pp = 10;
				move.priority = 0;
				move.name = 'Offer Beer';
				move.boosts = {'atk':-1, 'spa':-1, 'def':1, 'spd':1, 'spe':-1, 'accuracy':-1, 'evasion':1};
				move.onTryHit = function () {
					this.add('-message', "Oh, why, thank you! This beer is delicious!");
				};
				if (move.id === 'present' && this.random(10) < 3) {
					return 'Sing';
				}
			}
		},
	},
	// Thankless Thanksgiving, November 2013
	{
		name: "[Seasonal] Thankless Thanksgiving",

		team: 'randomSeasonalTT',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod'],
	},
	// Christmas Charade, December 2013
	{
		name: "[Seasonal] Christmas Charade",

		team: 'randomSeasonalCC',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod'],
		onBegin: function () {
			this.setWeather('Hail');
			delete this.weatherData.duration;
		},
		onModifyMove: function (move) {
			if (move.id === 'present') {
				move.category = 'Status';
				move.basePower = 0;
				delete move.heal;
				move.accuracy = 100;
				switch (this.random(19)) {
				case 0:
					move.onTryHit = function () {
						this.add('-message', "The present was a bomb!");
					};
					move.category = 'Physical';
					move.basePower = 250;
					break;
				case 1:
					move.onTryHit = function () {
						this.add('-message', "The present was confusion!");
					};
					move.volatileStatus = 'confusion';
					break;
				case 2:
					move.onTryHit = function () {
						this.add('-message', "The present was Disable!");
					};
					move.volatileStatus = 'disable';
					break;
				case 3:
					move.onTryHit = function () {
						this.add('-message', "The present was a taunt!");
					};
					move.volatileStatus = 'taunt';
					break;
				case 4:
					move.onTryHit = function () {
						this.add('-message', "The present was some seeds!");
					};
					move.volatileStatus = 'leechseed';
					break;
				case 5:
					move.onTryHit = function () {
						this.add('-message', "The present was an embargo!");
					};
					move.volatileStatus = 'embargo';
					break;
				case 6:
					move.onTryHit = function () {
						this.add('-message', "The present was a music box!");
					};
					move.volatileStatus = 'perishsong';
					break;
				case 7:
					move.onTryHit = function () {
						this.add('-message', "The present was a curse!");
					};
					move.volatileStatus = 'curse';
					break;
				case 8:
					move.onTryHit = function () {
						this.add('-message', "The present was Torment!");
					};
					move.volatileStatus = 'torment';
					break;
				case 9:
					move.onTryHit = function () {
						this.add('-message', "The present was a trap!");
					};
					move.volatileStatus = 'partiallytrapped';
					break;
				case 10:
					move.onTryHit = function () {
						this.add('-message', "The present was a root!");
					};
					move.volatileStatus = 'ingrain';
					break;
				case 11: {
					move.onTryHit = function () {
						this.add('-message', "The present was a makeover!");
					};

					let possibleBoosts = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy']; // Respect Evasion Clause
					let boosts = {
						[this.sampleNoReplace(possibleBoosts)]: 1,
						[this.sampleNoReplace(possibleBoosts)]: -1,
						[this.sampleNoReplace(possibleBoosts)]: -1,
					};
					move.boosts = boosts;
					break;
				}
				case 12:
					move.onTryHit = function () {
						this.add('-message', "The present was psychic powers!");
					};
					move.volatileStatus = 'telekinesis';
					break;
				case 13:
					move.onTryHit = function () {
						this.add('-message', "The present was fatigue!");
					};
					move.volatileStatus = 'mustrecharge';
					break;
				case 14:
				case 15:
					move.onTryHit = function () {
						this.add('-message', "The present was a snowball hit!");
					};
					move.category = 'Ice';
					move.basePower = 250;
					break;
				case 16:
					move.onTryHit = function () {
						this.add('-message', "The present was a crafty shield!");
					};
					move.volatileStatus = 'craftyshield';
					break;
				case 17:
					move.onTryHit = function () {
						this.add('-message', "The present was an electrification!");
					};
					move.volatileStatus = 'electrify';
					break;
				case 18:
					move.onTryHit = function () {
						this.add('-message', "The present was an ion deluge!");
					};
					move.volatileStatus = 'iondeluge';
					break;
				}
			}
		},
	},
	// Winter's Wont, January 2014
	{
		name: "[Seasonal] Winter's Wont",

		gameType: 'doubles',
		team: 'randomSeasonalWinter',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod'],
		maxLevel: 1000,
		onBegin: function () {
			this.setWeather('Hail');
			delete this.weatherData.duration;
		},
		onNegateImmunity: false,
		onEffectiveness: function (typeMod, target, type, move) {
			// The effectiveness of Freeze Dry on Water isn't reverted
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.getImmunity(move, type)) return 1;
			return -typeMod;
		},
	},
	// Fabulous February, February 2014
	{
		name: "[Seasonal] Fabulous February",

		gameType: 'doubles',
		team: 'randomSeasonalFFY',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod'],
		onBegin: function () {
			this.add('-message', "新年快乐");
		},
		onModifyMove: function (move) {
			if (move.id === 'explosion') {
				move.name = 'Firecrackers';
			} else if (move.type === 'Fire') {
				move.name = 'Fireworks';
			}
		},
		onNegateImmunity: false,
		onEffectiveness: function (typeMod, target, type, move) {
			// The effectiveness of Freeze Dry on Water isn't reverted
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.getImmunity(move, type)) return 1;
			return -typeMod;
		},
	},
	// Strikes Back, November 2014
	{
		name: "[Seasonal] Strikes Back",

		gameType: 'triples',
		team: 'randomSeasonalSB',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod'],
		onBegin: function () {
			this.add('-message', "V4 is a big poo-poo!");
		},
		onModifyMove: function (move) {
			// Change present mechanics
			if (move.id === 'present') {
				move.category = 'Status';
				move.basePower = 0;
				delete move.heal;
				move.accuracy = 100;
				switch (this.random(16)) {
				case 0:
					move.onTryHit = function () {
						this.add('-message', "The present was a bomb!");
					};
					move.category = 'Physical';
					move.basePower = 250;
					break;
				case 1:
					move.onTryHit = function () {
						this.add('-message', "The present was confusion!");
					};
					move.volatileStatus = 'confusion';
					break;
				case 2:
					move.onTryHit = function () {
						this.add('-message', "The present was Disable!");
					};
					move.volatileStatus = 'disable';
					break;
				case 3:
					move.onTryHit = function () {
						this.add('-message', "The present was a taunt!");
					};
					move.volatileStatus = 'taunt';
					break;
				case 4:
					move.onTryHit = function () {
						this.add('-message', "The present was some seeds!");
					};
					move.volatileStatus = 'leechseed';
					break;
				case 5:
					move.onTryHit = function () {
						this.add('-message', "The present was an embargo!");
					};
					move.volatileStatus = 'embargo';
					break;
				case 6:
					move.onTryHit = function () {
						this.add('-message', "The present was a music box!");
					};
					move.volatileStatus = 'perishsong';
					break;
				case 7:
					move.onTryHit = function () {
						this.add('-message', "The present was a curse!");
					};
					move.volatileStatus = 'curse';
					break;
				case 8:
					move.onTryHit = function () {
						this.add('-message', "The present was Torment!");
					};
					move.volatileStatus = 'torment';
					break;
				case 9:
					move.onTryHit = function () {
						this.add('-message', "The present was a trap!");
					};
					move.volatileStatus = 'partiallytrapped';
					break;
				case 10:
					move.onTryHit = function () {
						this.add('-message', "The present was a root!");
					};
					move.volatileStatus = 'ingrain';
					break;
				case 11: {
					move.onTryHit = function () {
						this.add('-message', "The present was a makeover!");
					};

					let possibleBoosts = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'];
					let boosts = {
						[this.sampleNoReplace(possibleBoosts)]: 1,
						[this.sampleNoReplace(possibleBoosts)]: -1,
						[this.sampleNoReplace(possibleBoosts)]: -1,
					};
					move.boosts = boosts;
					break;
				}
				case 12:
					move.onTryHit = function () {
						this.add('-message', "The present was psychic powers!");
					};
					move.volatileStatus = 'telekinesis';
					break;
				case 13:
					move.onTryHit = function () {
						this.add('-message', "The present was fatigue!");
					};
					move.volatileStatus = 'mustrecharge';
					break;
				case 14:
				case 15:
					move.onTryHit = function () {
						this.add('-message', "The present was a snowball hit!");
					};
					move.category = 'Ice';
					move.basePower = 250;
					break;
				}
			} else {
				// Change move type time to time only when the move is not Present.
				if (this.random(100) < 35 && move.target !== 'self') {
					let type = '';
					switch (move.type.toLowerCase()) {
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
					case 'poison':
						type = 'Fairy';
						break;
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
						type = 'Ghost';
						break;
					case 'psychic':
						type = 'Dark';
						break;
					case 'steel':
						type = 'Poison';
						break;
					case 'fairy':
						type = 'Dragon';
						break;
					}

					move.type = type;
					this.add('-message', 'LOL trolled I changed yer move type hahaha');
				}
			}
		},
		onSwitchIn: function (pokemon) {
			if (this.random(100) < 25) {
				this.add('-message', pokemon.name + " drank way too much!");
				pokemon.addVolatile('confusion');
				pokemon.statusData.time = 0;
			}
		},
		onFaint: function (pokemon) {
			// A poem every time a Pokemon faints
			let haikus = [
				"You suck a lot / You are a bad trainer / let a mon faint", "they see me driving / round town with the girl i love / and I'm like, haikou",
				"Ain't no Pokemon tough enough / ain't no bulk decent enough / ain't no recovery good enough / to keep me from fainting you, babe",
				"Roses are red / violets are blue / you must be on some med / 'coz as a trainer you suck",
				"You're gonna be the very worst / like no one ever was / to lose all the battles is your test / to faint them all is your cause",
				'Twinkle twinkle little star / screw you that was my best sweeper', "I'm wheezy and I'm sleezy / but as a trainer you're measly",
				"You're sharp as a rock / you're bright as a hole / you're one to mock / you could be beaten by a maimed mole",
				"Alas, poor trainer! I knew him, your Pokémon, a fellow of infinite jest, of most excellent fancy.",
			];
			this.add('-message', this.sampleNoReplace(haikus));
		},
	},
	// Sleigh Showdown, December 2014
	{
		name: "[Seasonal] Sleigh Showdown",

		team: 'randomSeasonalSleigh',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod'],
		onBegin: function () {
			this.add('-message', "Yikes! You are a grinch in a reckless, regretless sleigh race, running for Showdownville to ruin christmas. But, to achieve that, you must first defeat your opponent. Fight hard and take care with the obstacles!");
			this.seasonal = {position: [0, 0], weight: [2500, 2500]};
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
					move.onTryHit = function (target, source) {
						this.add('-message', "You got an Excadreydle from the sack!");
						this.seasonal.weight[source.side.n] -= 40.4;
					};
					move.boosts = {spe: -1};
					break;
				case 1:
					move.onTryHit = function (target, source) {
						this.add('-message', "You got a Chandelnukkiyah from the sack!");
						this.seasonal.weight[source.side.n] -= 34.3;
					};
					move.status = 'brn';
					break;
				case 2:
					move.onTryHit = function (target, source) {
						this.add('-message', "You got a Glalie from the sack! Ka-boom!");
						this.seasonal.weight[source.side.n] -= 256.5;
					};
					move.category = 'Special';
					move.basePower = 300;
					break;
				case 3:
					move.onTryHit = function (target, source) {
						this.add('-message', "You got a tree Starmie from the sack!");
						this.seasonal.weight[source.side.n] -= 80;
					};
					move.category = 'Special';
					move.type = 'Water';
					move.basePower = 150;
					break;
				case 4:
					move.onTryHit = function (target, source) {
						this.add('-message', "You got an Abomaxmas tree from the sack!");
						this.seasonal.weight[source.side.n] -= 40.4;
					};
					move.category = 'Physical';
					move.type = 'Ice';
					move.basePower = 150;
					break;
				case 5:
					move.onTryHit = function (target, source) {
						this.add('-message', "You got a Chansey egg nog from the sack!");
						this.seasonal.weight[source.side.n] -= 34.6;
					};
					move.target = 'self';
					move.heal = [3, 4];
					break;
				case 6:
					move.onTryHit = function (target, source) {
						this.add('-message', "You got Cryogonal snowflakes from the sack!");
						this.seasonal.weight[source.side.n] -= 148;
					};
					move.category = 'Special';
					move.type = 'Ice';
					move.basePower = 200;
					break;
				case 7:
					move.onTryHit = function (target, source) {
						this.add('-message', "You got Pikachu-powered christmas lights from the sack!");
						this.seasonal.weight[source.side.n] -= 6;
					};
					move.category = 'Special';
					move.type = 'Electric';
					move.basePower = 250;
					break;
				case 8:
					move.onTryHit = function (target, source) {
						this.add('-message', "You got Shaymin-Sky mistletoe from the sack!");
						this.seasonal.weight[source.side.n] -= 5.2;
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
			// The speed depends on the current load of the sleigh. Less load, more speed.
			let speed = Math.abs(pokemon.speed) + Math.ceil((2500 - this.seasonal.weight[pokemon.side.n]) / 25);

			// If no obstacles are found, we advance as much distance as the speed is.
			// However, the faster the sleigh, the higher the chances of meeting an obstacle are!
			if (this.random(100) < Math.ceil(speed * 0.083) + 5) {
				let name = pokemon.illusion ? pokemon.illusion.name : pokemon.name;
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
				this.seasonal.position[pokemon.side.n] += speed;
			}

			// Showdownville is about 4000 meters away from the mountaintop.
			if (this.seasonal.position[pokemon.side.n] >= 3500) {
				this.add('-message', "" + pokemon.side.name + " has arrived to Showdownville first and ruined christmas! The race is won!");
				this.win(pokemon.side.id);
			}
		},
		onHit: function (target) {
			// Getting hit thaws the ice if you are frozen.
			if (target.status === 'frz') target.cureStatus();
		},
	},
	// Spacetime Funtimes, January - February 2015
	// https://github.com/Zarel/Pokemon-Showdown/tree/7fb61bf240975a9c93e302c9a2059b55ee458ffb
	{
		name: "[Seasonal] Spacetime Funtimes",

		team: 'randomSeasonalSFT',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onBegin: function () {
			this.add('message', "Dialga and Palkia have distorted space and time!");
			// This shouldn't happen.
			if (!this.seasonal) this.seasonal = {scenario: 'lotr'};

			// Add the message for the scenario.
			this.add('-message', {
				'gen1': "It appears that you have travelled to the past! This looks like... 1997!",
				'lotr': "You find yourselves in middle of an epic battle for Middle Earth!",
				'redblue': "Wow! You are taking part in the most epic Pokémon fight ever!",
				'terminator': "You are caught up in the epic apocalyptic battle of the machines against the humans!",
				'desert': "It's no less than the exodus itself!",
				'shipwreck': "You're on a giant ship that was rekt by an iceberg. And the fish Pokémon want to eat the sailors!",
			}[this.seasonal.scenario]);

			// Let's see what's the scenario and change space and time.
			if (this.seasonal.scenario === 'lotr') {
				this.addPseudoWeather('wonderroom', this.p1.pokemon[0], null, '[of] Seasonal');
				delete this.pseudoWeather.wonderroom.duration;
			} else if (this.seasonal.scenario === 'terminator') {
				this.addPseudoWeather('trickroom', this.p1.pokemon[0], null, '[of] Seasonal');
				delete this.pseudoWeather.trickroom.duration;
			} else if (this.seasonal.scenario === 'gen1') {
				this.addPseudoWeather('magicroom', this.p1.pokemon[0], null, '[of] Seasonal');
				delete this.pseudoWeather.magicroom.duration;
			} else if (this.seasonal.scenario === 'desert') {
				this.setWeather(['Sandstorm', 'Sunnyday'][this.random(2)]);
				delete this.weatherData.duration;
			} else if (this.seasonal.scenario === 'shipwreck') {
				this.setWeather('raindance');
				this.addPseudoWeather('watersport', this.p1.pokemon[0], null, '[of] Seasonal');
				delete this.pseudoWeather.watersport.duration;
				delete this.weatherData.duration;
			}
		},
		onFaint: function (target, source) {
			if (this.seasonal.scenario === 'gen1') {
				if (source && source.removeVolatile) source.removeVolatile('mustrecharge');
				if (target && target.side) target.side.removeSideCondition('reflect');
				this.queue = [];
			}
		},
		onModifyMove: function (move) {
			if (this.seasonal.scenario === 'gen1') {
				if (move.id === 'blizzard') {
					move.accuracy = 90;
				}
				if (move.id === 'psychic') {
					move.secondary = {chance: 33, boosts: {spd: -1, spa: -1}};
				}
				if (move.id === 'amnesia') {
					move.boosts = {spa:2, spd:2};
				}
				if (move.id === 'hyperbeam') {
					move.category = 'Physical';
				}
			}
			if (this.seasonal.scenario === 'lotr') {
				if (move.id === 'growl') {
					move.name = 'Throw ring to lava';
					move.category = 'Special';
					move.basePower = 160;
					move.type = 'Fire';
					move.accuracy = true;
					move.self = {volatileStatus: 'mustrecharge'};
					move.onTryHit = function () {
						this.add('-message', 'Frodo throws the one ring into the lava!');
					};
				}
				if (move.id === 'thousandarrows') {
					move.onBasePower = function (basePower, pokemon, target) {
						if (target.name === 'Smaug') {
							this.add('-message', "Bard's arrow pierces through Smaug's diamond-tough skin!");
							return this.chainModify(3);
						}
					};
				}
			}
		},
		onSwitchIn: function (pokemon) {
			if (this.seasonal.scenario === 'lotr') {
				if (pokemon.name === 'Frodo') {
					this.add('-message', 'The One Ring gives power to Frodo!');
					this.boost({def:2, spd:2, evasion:2}, pokemon);
					if (pokemon.setType(['Ground', 'Fairy'])) {
						this.add('-start', pokemon, 'typechange', 'Ground/Fairy', '[silent]');
					}
				}
				if (pokemon.name === 'Gandalf') {
					this.add('-message', 'Fly, you fools!');
					this.boost({spe:1}, pokemon);
				}
				if (pokemon.name === 'Saruman') {
					this.add('-message', 'Against the power of Mordor there can be no victory.');
					this.boost({spd:1}, pokemon);
				}
				if (pokemon.name === 'Legolas') {
					this.add('-message', "They're taking the hobbits to Isengard!");
					this.boost({atk:1, spa:1}, pokemon);
				}
				if (pokemon.name === 'Boromir') {
					this.add('-message', 'One does not simply walk into Mordor.');
					pokemon.addVolatile('confusion');
				}
				if (pokemon.name === 'Aragorn') {
					this.add('-message', 'Aragorn, son of Arathor, king of Gondor.');
					this.boost({spd:1}, pokemon);
				}
				if (pokemon.name === 'Pippin') {
					this.add('-message', 'How about second breakfast?');
					this.boost({def:1, spd:1}, pokemon);
				}
				if (pokemon.name === 'Merry') {
					this.add('-message', "I don't think he knows about second breakfast, Pippin.");
					this.boost({def:1, spd:1}, pokemon);
				}
				if (pokemon.name === 'Samwise') {
					this.add('-message', 'Mr. Frodo!!');
					if (pokemon.setType(['Normal', 'Fairy'])) {
						this.add('-start', pokemon, 'typechange', 'Normal/Fairy', '[silent]');
					}
					this.boost({spe:3}, pokemon);
				}
				if (pokemon.name === 'Nazgûl') {
					this.add('-message', 'One ring to rule them all.');
				}
				if (pokemon.name === 'Smaug') {
					this.add('-message', 'I am fire. I am death.');
				}
				if (pokemon.name === 'Treebeard') {
					this.add('-message', 'Come, my friends. The ents are going to war!');
					this.boost({spe:2}, pokemon);
				}
				if (pokemon.name === 'Bard') {
					this.add('-message', 'Black arrow! Go now and speed well!');
					this.boost({accuracy:1, evasion:1}, pokemon);
				}
				if (pokemon.name === 'Gollum') {
					this.add('-message', 'My preciousssss!');
					this.boost({accuracy:6, evasion:1}, pokemon);
				}
			}
			if (this.seasonal.scenario === 'gen1') {
				pokemon.side.removeSideCondition('reflect');
			}
			if (this.seasonal.scenario === 'desert') {
				if (pokemon.name === 'Moses') {
					this.add('-message', 'Let my people go!');
					this.boost({spd:1}, pokemon);
				}
			}
		},
	},

	// Super Staff Bros., March - April 2015
	// https://github.com/Zarel/Pokemon-Showdown/tree/120995476512db995ecd3e5c8fdc898d6cd634cd

	{
		name: "[Seasonal] Super Staff Bros.",

		team: 'randomSeasonalStaff',
		ruleset: ['Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		onBegin: function () {
			// This seasonal gets a bit from Super Smash Bros., that's where the initial message comes from.
			this.add('message', "GET READY FOR THE NEXT BATTLE!");
			// This link leads to a post where all signature moves can be found so the user can use this resource while battling.
			this.add("raw|Seasonal help for moves can be found <a href='https://www.smogon.com/forums/threads/3491902/page-6#post-6093168'>here</a>");
			// Prepare Steamroll's special lead role.
			if (toId(this.p1.pokemon[0].name) === 'steamroll') {
				this.add('c|@Steamroll|I wasn\'t aware we were starting. Allow me...');
				this.p1.pokemon[0].isLead = true;
			}
			if (toId(this.p2.pokemon[0].name) === 'steamroll') {
				this.add('c|@Steamroll|I wasn\'t aware we were starting. Allow me...');
				this.p2.pokemon[0].isLead = true;
			}
			// This variable saves the status of a spammy conversation to be played, so it's only played once.
			this.convoPlayed = false;

			// This code here is used for the renaming of moves showing properly on client.
			let globalRenamedMoves = {
				'defog': "Defrog",
			};
			let customRenamedMoves = {
				"cathy": {
					'kingsshield': "Heavy Dosage of Fun",
					'calmmind': "Surplus of Humour",
					'shadowsneak': "Patent Hilarity",
					'shadowball': "Ion Ray of Fun",
					'shadowclaw': "Sword of Fun",
					'flashcannon': "Fun Cannon",
					'dragontail': "/kick",
					'hyperbeam': "/ban",
				},
			};
			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);

			for (let i = 0, len = allPokemon.length; i < len; i++) {
				let pokemon = allPokemon[i];
				let last = pokemon.moves.length - 1;
				if (pokemon.moves[last]) {
					pokemon.moves[last] = toId(pokemon.set.signatureMove);
					pokemon.moveset[last].move = pokemon.set.signatureMove;
					pokemon.baseMoveset[last].move = pokemon.set.signatureMove;
				}
				for (let j = 0; j < pokemon.moveset.length; j++) {
					let moveData = pokemon.moveset[j];
					if (globalRenamedMoves[moveData.id]) {
						pokemon.moves[j] = toId(pokemon.set.signatureMove);
						moveData.move = globalRenamedMoves[moveData.id];
						pokemon.baseMoveset[j].move = globalRenamedMoves[moveData.id];
					}

					let customRenamedSet = customRenamedMoves[toId(pokemon.name)];
					if (customRenamedSet && customRenamedSet[moveData.id]) {
						pokemon.moves[j] = toId(pokemon.set.signatureMove);
						moveData.move = customRenamedSet[moveData.id];
						pokemon.baseMoveset[j].move = customRenamedSet[moveData.id];
					}
				}
			}
		},
		// Here we add some flavour or design immunities.
		onImmunity: function (type, pokemon) {
			// Great Sage is naturally immune to Attract.
			if (type === 'attract' && toId(pokemon.name) === 'greatsage') {
				this.add('-immune', pokemon, '[from] Irrelevant');
				return false;
			}
			// qtrx is immune to Torment or Taunt.
			if ((type === 'torment' || type === 'taunt') && pokemon.volatiles['unownaura']) {
				this.add('-immune', pokemon, '[from] Unown aura');
				return false;
			}
			// Somalia's Ban Spree makes it immune to some move types, since he's too mad to feel pain.
			// Types have been chosen from types you can be immune against with an ability.
			if (toId(pokemon.name) === 'somalia' && type in {'Ground':1, 'Water':1, 'Fire':1, 'Grass':1, 'Poison':1, 'Normal':1, 'Electric':1}) {
				this.add('-message', "You can't stop SOMALIA in middle of his Ban Spree!");
				return false;
			}
		},
		// Hacks for megas changed abilities. This allow for their changed abilities.
		onUpdate: function (pokemon) {
			let name = toId(pokemon.name);

			if (pokemon.template.isMega) {
				if (name === 'theimmortal' && pokemon.getAbility().id === 'megalauncher') {
					pokemon.setAbility('cloudnine'); // Announced ability.
				}
				if (name === 'enguarde' && pokemon.getAbility().id === 'innerfocus') {
					pokemon.setAbility('superluck');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'shrang' && pokemon.getAbility().id === 'levitate') {
					pokemon.setAbility('pixilate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'skitty' && pokemon.getAbility().id === 'healer') {
					pokemon.setAbility('shedskin');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'audiosurfer' && pokemon.getAbility().id === 'healer') {
					pokemon.setAbility('pixilate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'dtc' && pokemon.getAbility().id === 'toughclaws') {
					pokemon.setAbility('levitate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'trinitrotoluene' && pokemon.getAbility().id === 'toughclaws') {
					pokemon.setAbility('protean');
					this.add('-ability', pokemon, pokemon.ability);
				}
			}
		},
		// Here we treat many things, read comments inside for information.
		onSwitchInPriority: 1,
		onSwitchIn: function (pokemon) {
			let name = toId(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
			// No OP pls. Balance stuff, changing them upon switch in. Wonder Guard gets curse to minimise their turns out.
			if (pokemon.getAbility().id === 'wonderguard') {
				pokemon.addVolatile('curse', pokemon);
				this.add('-message', pokemon.name + "'s Wonder Guard has cursed it!");
			}
			// Weak Pokémon get a boost so they can fight amongst the other monsters.
			// Innovamania is just useless, so the boosts are a prank.
			if (name === 'test2017' && !pokemon.illusion) {
				this.boost({atk:1}, pokemon, pokemon, 'innate ability');
			}
			if (name === 'okuu' && !pokemon.illusion) {
				this.boost({def:2, spd:1}, pokemon, pokemon, 'innate ability');
			}
			if (name === 'innovamania' && !pokemon.illusion) {
				this.boost({atk:6, def:6, spa:6, spd:6, spe:6, accuracy:6}, pokemon, pokemon, 'divine grace');
			}
			if (name === 'bloobblob' && !pokemon.illusion) {
				this.boost({def:1, spd:1, spe:2}, pokemon, pokemon, 'innate ability');
			}
			if (name === 'timbuktu' && !pokemon.illusion) {
				this.boost({def:-2, spd:-1}, pokemon, pokemon, 'innate ability');
			}
			if (name === 'electrolyte') {
				pokemon.lastAttackType = 'None';
			}
			// Deal with kupo's special transformation ability.
			if (pokemon.kupoTransformed) {
				pokemon.name = '@kupo';
				pokemon.kupoTransformed = false;
			}
			// Deal with Timbuktu's move (read onModifyMove relevant part).
			if (name === 'timbuktu') {
				pokemon.timesGeoblastUsed = 0;
			}

			// Add here more hacky stuff for mega abilities.
			// This happens when the mega switches in, as opposed to mega-evolving on the turn.
			if (pokemon.template.isMega) {
				if (name === 'theimmortal' && pokemon.getAbility().id !== 'cloudnine') {
					pokemon.setAbility('cloudnine'); // Announced ability.
				}
				if (name === 'dell' && pokemon.getAbility().id !== 'adaptability') {
					pokemon.setAbility('adaptability');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'enguarde' && pokemon.getAbility().id !== 'superluck') {
					pokemon.setAbility('superluck');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'skitty' && pokemon.getAbility().id !== 'shedskin') {
					pokemon.setAbility('shedskin');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'audiosurfer' && pokemon.getAbility().id !== 'pixilate') {
					pokemon.setAbility('pixilate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'dtc' && pokemon.getAbility().id !== 'levitate') {
					pokemon.setAbility('levitate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'shrang' && pokemon.getAbility().id !== 'pixilate') {
					pokemon.setAbility('pixilate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'trinitrotoluene' && pokemon.getAbility().id !== 'protean') {
					pokemon.setAbility('protean');
					this.add('-ability', pokemon, pokemon.ability);
				}
			} else {
				pokemon.canMegaEvo = this.canMegaEvo(pokemon); // Bypass one mega limit.
			}

			// Add here special typings, done for flavour mainly.
			if (name === 'mikel' && !pokemon.illusion) {
				if (pokemon.setType(['Normal', 'Ghost'])) {
					this.add('-start', pokemon, 'typechange', 'Normal/Ghost', '[silent]');
				}
			}
			if (name === 'qtrx') {
				this.add('-message', pokemon.name + " is radiating an Unown aura!"); // Even if only illusion.
				if (!pokemon.illusion) {
					pokemon.addVolatile('unownaura');
					if (pokemon.setType(['Normal', 'Psychic'])) {
						this.add('-start', pokemon, 'typechange', 'Normal/Psychic', '[silent]');
					}
				}
				pokemon.addVolatile('focusenergy');
				this.boost({evasion: -1}, pokemon, pokemon, 'Unown aura');
			}
			if (name === 'birkal' && !pokemon.illusion) {
				pokemon.addType('Bird');
				this.add('-start', pokemon, 'typeadd', 'Bird', '[from] ability: Caw');
			}

			// Edgy switch-in sentences go here.
			// Sentences vary in style and how they are presented, so each Pokémon has its own way of sending them.
			let sentences = [];
			let sentence = '';

			// Admins.
			if (name === 'antar') {
				this.add("c|~Antar|It's my time in the sun.");
			}
			if (name === 'chaos') {
				this.add("c|~chaos|I always win");
			}
			if (name === 'haunter') {
				this.add("c|~haunter|Dux mea lux");
			}
			if (name === 'jasmine') {
				if (this[((pokemon.side.id === 'p1') ? 'p2' : 'p1')].active[0].name.charAt(0) === '%') {
					sentence = "Back in my day we didn't have Drivers.";
				} else {
					sentences = ["Your mum says hi.", "Sorry I was just enjoying a slice of pineapple pizza, what was I supposed to do again?", "I could go for some Cheesy Chips right about now.", "I'd tap that.", "/me throws coffee at the server"].randomize();
					sentence = sentences[0];
				}
				this.add('c|~Jasmine|' + sentence);
			}
			if (name === 'joim') {
				let dice = this.random(4);
				if (dice === 1) {
					// Fullscreen toucan!
					this.add('-message', '░░░░░░░░▄▄▄▀▀▀▄▄███▄');
					this.add('-message', '░░░░░▄▀▀░░░░░░░▐░▀██▌');
					this.add('-message', '░░░▄▀░░░░▄▄███░▌▀▀░▀█');
					this.add('-message', '░░▄█░░▄▀▀▒▒▒▒▒▄▐░░░░█▌');
					this.add('-message', '░▐█▀▄▀▄▄▄▄▀▀▀▀▌░░░░░▐█▄');
					this.add('-message', '░▌▄▄▀▀░░░░░░░░▌░░░░▄███████▄');
					this.add('-message', '░░░░░░░░░░░░░▐░░░░▐███████████▄');
					this.add('-message', '░░blessed by░░░░▐░░░░▐█████████████▄');
					this.add('-message', '░░le toucan░░░░░░▀▄░░░▐██████████████▄');
					this.add('-message', '░░░░░░ of ░░░░░░░░▀▄▄████████████████▄');
					this.add('-message', '░░░░░luck░░░░░░░░░░░░░█▀██████');
				} else if (dice === 2) {
					// Too spammy, sends it to chat only.
					this.add('c|~Joim|░░░░░░░░░░░░▄▐');
					this.add('c|~Joim|░░░░░░▄▄▄░░▄██▄');
					this.add('c|~Joim|░░░░░▐▀█▀▌░░░░▀█▄');
					this.add('c|~Joim|░░░░░▐█▄█▌░░░░░░▀█▄');
					this.add('c|~Joim|░░░░░░▀▄▀░░░▄▄▄▄▄▀▀');
					this.add('c|~Joim|░░░░▄▄▄██▀▀▀▀');
					this.add('c|~Joim|░░░█▀▄▄▄█░▀▀');
					this.add('c|~Joim|░░░▌░▄▄▄▐▌▀▀▀');
					this.add('c|~Joim|▄░▐░░░▄▄░█░▀▀ U HAVE BEEN SPOOKED');
					this.add('c|~Joim|▀█▌░░░▄░▀█▀░▀');
					this.add('c|~Joim|░░░░░░░▄▄▐▌▄▄ BY THE');
					this.add('c|~Joim|░░░░░░░▀███▀█░▄');
					this.add('c|~Joim|░░░░░░▐▌▀▄▀▄▀▐▄ SPOOKY SKILENTON');
					this.add('c|~Joim|░░░░░░▐▀░░░░░░▐▌');
					this.add('c|~Joim|░░░░░░█░░░░░░░░█');
					this.add('c|~Joim|░░░░░▐▌░░░░░░░░░█');
					this.add('c|~Joim|░░░░░█░░░░░░░░░░▐▌SEND THIS TO 7 PPL OR SKELINTONS WILL EAT YOU');
				} else if (dice === 3) {
					this.add('-message', '░░░░░░░░░░░░▄▄▄▄░░░░░░░░░░░░░░░░░░░░░░░▄▄▄▄▄');
					this.add('-message', '░░░█░░░░▄▀█▀▀▄░░▀▀▀▄░░░░▐█░░░░░░░░░▄▀█▀▀▄░░░▀█▄');
					this.add('-message', '░░█░░░░▀░▐▌░░▐▌░░░░░▀░░░▐█░░░░░░░░▀░▐▌░░▐▌░░░░█▀');
					this.add('-message', '░▐▌░░░░░░░▀▄▄▀░░░░░░░░░░▐█▄▄░░░░░░░░░▀▄▄▀░░░░░▐▌');
					this.add('-message', '░█░░░░░░░░░░░░░░░░░░░░░░░░░▀█░░░░░░░░░░░░░░░░░░█');
					this.add('-message', '▐█░░░░░░░░░░░░░░░░░░░░░░░░░░█▌░░░░░░░░░░░░░░░░░█');
					this.add('-message', '▐█░░░░░░░░░░░░░░░░░░░░░░░░░░█▌░░░░░░░░░░░░░░░░░█');
					this.add('-message', '░█░░░░░░░░░░░░░░░░░░░░█▄░░░▄█░░░░░░░░░░░░░░░░░░█');
					this.add('-message', '░▐▌░░░░░░░░░░░░░░░░░░░░▀███▀░░░░░░░░░░░░░░░░░░▐▌');
					this.add('-message', '░░█░░░░░░░░░░░░░░░░░▀▄░░░░░░░░░░▄▀░░░░░░░░░░░░█');
					this.add('-message', '░░░█░░░░░░░░░░░░░░░░░░▀▄▄▄▄▄▄▄▀▀░░░░░░░░░░░░░█');
				} else {
					sentences = ["Gen 1 OU is a true skill metagame.", "Finally a good reason to punch a teenager in the face!", "So here we are again, it's always such a pleasure.", "( ͝° ͜ʖ͡°)"].randomize();
					sentence = sentences[0];
					this.add('c|~Joim|' + sentence);
				}
			}
			if (name === 'theimmortal') {
				this.add('c|~The Immortal|Give me my robe, put on my crown!');
			}
			if (name === 'v4') {
				sentences = ["Oh right. I'm still here...", "WHAT ELSE WERE YOU EXPECTING?!", "Soaring on beautiful buttwings."].randomize();
				this.add('c|~V4|' + sentences[0]);
			}
			if (name === 'zarel') {
				this.add('c|~Zarel|Your mom');
			}

			// Leaders.
			if (name === 'hollywood') {
				this.add('c|&hollywood|Kappa');
			}
			if (name === 'jdarden') {
				this.add('c|&jdarden|Did someone call for some BALK?');
			}
			if (name === 'okuu') {
				sentences = ["Current Discussion Topics: Benefits of Nuclear Energy, green raymoo worst raymoo, ...", "Current Discussion Topics: I ate the Sun - AMA, Card Games inside of Fighting Games, ...", "Current Discussion Topics: Our testing process shouldn't include Klaxons, Please remove Orin from keyboard prior to entering chat, ...", "Current Discussion Topics: Please refrain from eating crow, We'll get out of Beta once we handle all of this Alpha Decay, ...", "Current Discussion Topics: Schroedinger's Chen might still be in that box, I'm So Meta Even This Acronym, ...", "Current Discussion Topics: What kind of idiot throws knives into a thermonuclear explosion?, わからない ハハハ, ..."].randomize();
				this.add("raw|<div class=\"broadcast-blue\"><b>" + sentences[0] + "</b></div>");
			}
			if (name === 'sirdonovan') {
				this.add('c|&sirDonovan|Oh, a battle? Let me finish my tea and crumpets');
			}
			if (name === 'sweep') {
				this.add('c|&Sweep|xD');
			}
			if (name === 'verbatim') {
				this.add('c|&verbatim|All in');
			}

			// Mods.
			if (name === 'acedia') {
				this.add('c|@Acedia|Time for a true display of skill ( ͡° ͜ʖ ͡°)');
			}
			if (name === 'am') {
				this.add('c|@AM|Lucky and Bad');
			}
			if (name === 'antemortem') {
				this.add('c|@antemortem|I Am Here To Oppress Users');
			}
			if (name === 'ascriptmaster') {
				this.add("c|@Ascriptmaster|Good luck, I'm behind 7 proxies");
			}
			if (name === 'asgdf') {
				sentences = ["Steel waters run deep, they say!", "I will insteell fear in your heart!", "Man the harpuns!"].randomize();
				this.add('c|@asgdf|' + sentences[0]);
			}
			if (name === 'audiosurfer') {
				pokemon.phraseIndex = this.random(3);
				if (pokemon.phraseIndex === 2) {
					let singers = ['Waxahatchee', 'Speedy Ortiz', 'Sufjan Stevens', 'Kendrick Lamar'];
					this.add('c|@Audiosurfer|Have you heard the new ' + singers[this.random(4)] + ' song?');
				} else if (pokemon.phraseIndex === 1) {
					this.add('c|@Audiosurfer|If you were worth playing you wouldn\'t be on the ladder.');
				} else {
					this.add('c|@Audiosurfer| Just came back from surfing. Don\'t believe me? Here\'s a pic: http://fc02.deviantart.net/fs70/i/2011/352/d/3/surf_all_the_oceans_by_dawn_shade-d4jga6b.png');
				}
			}
			if (name === 'barton') {
				this.add('c|@barton|free passion');
			}
			if (name === 'bean') {
				sentences = ["Everybody wants to be a cat", "if you KO me i'll ban u on PS", "just simply outplay the coin-toss"].randomize();
				this.add('c|@bean|' + sentences[0]);
			}
			if (name === 'beowulf') {
				this.add('c|@Beowulf|Grovel peasant, you are in the presence of the RNGesus');
			}
			if (name === 'biggie') {
				sentences = ["Now I'm in the limelight cause I rhyme tight", "HAPPY FEET! WOMBO COMBO!", "You finna mess around and get dunked on"].randomize();
				this.add('c|@BiGGiE|' + sentences[0]);
			}
			if (name === 'blitzamirin') {
				this.add('c|@Blitzamirin|How Can Mirrors Be Real If Our Eyes Aren\'t Real? ╰( ~ ◕ ᗜ ◕ ~ )੭━☆ﾟ.*･｡ﾟ');
			}
			if (name === 'businesstortoise') {
				this.add('c|@Business Tortoise|' + ["Another day, another smile :)", "Hello this is steve, how may I help you?"][this.random(2)]);
			}
			if (name === 'coolstorybrobat') {
				pokemon.phraseIndex = this.random(5);
				switch (pokemon.phraseIndex) {
				case 1:
					sentence = "Time to GET SLAYED";
					break;
				case 2:
					sentence = "BRUH!";
					break;
				case 3:
					sentence = "Ahem! Gentlemen...";
					break;
				case 4:
					sentence = "I spent 6 months training in the mountains for this day!";
					break;
				default:
					sentence = "Shoutout to all the pear...";
				}
				this.add('c|@CoolStoryBrobat|' + sentence);
			}
			if (name === 'dell') {
				this.add('c|@Dell|<[~.~]> Next best furry besides Yoshi taking the stand!');
			}
			if (name === 'eeveegeneral') {
				sentences = ['Eevee army assemble!', 'To the ramparts!', 'You and what army?'];
				this.add('c|@Eevee General|' + sentences[this.random(3)]);
			}
			if (name === 'electrolyte') {
				this.add('c|@Electrolyte|Eyyy where the middle school azn girls at??');
			}
			if (name === 'eos') {
				this.add('c|@Eos|ᕦ༼ຈل͜ຈ༽ᕤ');
			}
			if (name === 'formerhope') {
				this.add('c|@Former Hope|/me enters battle');
			}
			if (name === 'genesect') {
				pokemon.phraseIndex = this.random(6);
				if (pokemon.phraseIndex === 5) {
					this.add('-message', '░░ ░░ ██ ██ ██ ██ ██ ░░ ░░');
					this.add('-message', '░░ ██ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ██ ░░');
					this.add('-message', '██ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ██');
					this.add('-message', '██ ▓▓ ▓▓ ██ ██ ██ ▓▓ ▓▓ ██');
					this.add('-message', '██ ██ ██ ██ ░░ ██ ██ ██ ██');
					this.add('-message', '██ ▒▒ ▒▒ ██ ██ ██ ▒▒ ▒▒ ██');
					this.add('-message', '██ ▒▒ ▒▒ ▒▒ ▒▒ ▒▒ ▒▒ ▒▒ ██');
					this.add('-message', '░░ ██ ▒▒ ▒▒ ▒▒ ▒▒ ▒▒ ██ ░░');
					this.add('-message', '░░ ░░ ██ ██ ██ ██ ██ ░░ ░░');
				} else if (pokemon.phraseIndex === 4) {
					this.add('c|@Genesect|┬┴┬┴┤  ʕ├┬┴┬┴');
					this.add('c|@Genesect|┬┴┬┴┤ ʕ•├┬┴┬┴');
					this.add('c|@Genesect|┬┴┬┴┤ʕ•ᴥ├┬┴┬┴');
					this.add('c|@Genesect|Shitposting?');
				} else if (pokemon.phraseIndex === 3) {
					this.add('-message', '▄ ▄▄░░░░░░░▄▄▄▄░░░░▌▄▄▄▄▄░░░░░▐▌');
					this.add('-message', '▒▀█▌░░░▐▀▀▄▄▐▌▒░░▒▀▒▄▒█▄░░░░▐▌');
					this.add('-message', '░░▀█▒░░▓░░█▐█▌▌░░▒░▐▌█▌▐▌░░▐▌░');
					this.add('-message', '░░░░░░▓▀░░▒▐▀▄▀▀▀▀▒▒▀▀░░▀▌▒▀░░');
					this.add('-message', '░░░░░░▌░░░░░░▀▄▄▄▄▀░░░░░░▌░░░░');
					this.add('-message', '░░░░░▄▌░░░░░░░░░░░░░░░░░░▒░░░░');
				} else if (pokemon.phraseIndex === 2) {
					this.add('c|@Genesect|Born too early to explore the universe');
					this.add('c|@Genesect|Born too late to explore the world');
					this.add('c|@Genesect|Born just in time to explore ＤＡＮＫＭＥＭＥＳ');
				} else if (pokemon.phraseIndex === 1) {
					this.add('-message', '░░░░░░░░░░▄▄▄▄▄▄░░░░░░░░░░');
					this.add('-message', '░░░░░░░░▄▀█▀█▄██████████▄▄');
					this.add('-message', '░░░░░░░▐██████████████████▌');
					this.add('-message', '░░░░░░░███████████████████▌');
					this.add('-message', '░░░░░░▐███████████████████▌');
					this.add('-message', '░░░░░░█████████████████████▄');
					this.add('-message', '░░░▄█▐█▄█▀█████████████▀█▄█▐█▄');
					this.add('-message', '░▄██▌██████▄█▄█▄█▄█▄█▄█████▌██▌');
					this.add('-message', '████▄▀▀▀▀████████████▀▀▀▀▄███');
					this.add('-message', '█████████▄▄▄▄▄▄▄▄▄▄▄▄██████▀');
					this.add('-message', '░░░▀▀████████████████████▀');
					this.add('c|@Genesect|/me tips fedora');
				} else {
					sentences = ["(ง ͠ ͠° ͟ل͜ ͡°)ง sᴏᴜɴᴅs ᴅᴏɴɢᴇʀᴏᴜs... ɪᴍ ɪɴ (ง ͠ ͠° ͟ل͜ ͡°)ง", 'http://pastebin.com/8r0jgDd7 become a mod today!'].randomize();
					this.add('c|@Genesect|' + sentences[0]);
				}
			}
			if (name === 'hippopotas') {
				this.add('-message', '@Hippopotas\'s Sand Stream whipped up a sandstorm!');
			}
			if (name === 'hydroimpact') {
				this.add('c|@HYDRO IMPACT|Think about the name first and then the Pokemon. Look beyond the "simple" detail.');
			}
			if (name === 'innovamania') {
				sentences = ['Don\'t take this seriously', 'These Black Glasses sure look cool', 'Ready for some fun?( ͡° ͜ʖ ͡°)', '( ͡° ͜ʖ ͡°'];
				this.add('c|@innovamania|' + sentences[this.random(4)]);
			}
			if (name === 'jac') {
				this.add('c|@Jac|YAAAAAAAAAAAAAAAS');
			}
			if (name === 'jinofthegale') {
				this.add('c|@jin of the gale|' + ['3...2...1... LET IT RIP!', 'My bit-beast is going to eat you alive!'][this.random(2)]);
			}
			if (name === 'kostitsynkun') {
				this.add('c|@Kostitsyn-kun|Kyun ★ Kyun~');
			}
			if (name === 'kupo') {
				this.add('c|@kupo|abc!');
			}
			if (name === 'lawrenceiii') {
				this.add('c|@Lawrence III|Give me all of your virgin maidens.');
			}
			if (name === 'layell') {
				this.add('c|@Layell|Enter stage left');
			}
			if (name === 'legitimateusername') {
				this.add('c|@LegitimateUsername|``And believe me I am still alive.``');
				this.add('c|@LegitimateUsername|``I\'m doing Science and I\'m still alive.``');
				this.add('c|@LegitimateUsername|``I feel FANTASTIC and I\'m still alive.``');
				this.add('c|@LegitimateUsername|``While you\'re dying I\'ll be still alive.``');
				this.add('c|@LegitimateUsername|``And when you\'re dead I will be still alive.``');
			}
			if (name === 'level51') {
				this.add('c|@Level 51|Happiness and rainbows, hurrah!');
			}
			if (name === 'lyto') {
				sentences = ["This is divine retribution!", "I will handle this myself!", "Let battle commence!"].randomize();
				this.add('c|@Lyto|' + sentences[0]);
			}
			if (name === 'marty') {
				this.add('c|@Marty|Prepare yourself.');
			}
			if (name === 'morfent') {
				this.add('c|@Morfent|``──────▀█████▄──────▲``');
				this.add('c|@Morfent|``───▄███████████▄──◀█▶``');
				this.add('c|@Morfent|``─────▄████▀█▄──────█``');
				this.add('c|@Morfent|``───▄█████████████████▄  - I``');
				this.add('c|@Morfent|``─▄█████.▼.▼.▼.▼.▼.▼.▼   - cast``');
				this.add('c|@Morfent|``▄███████▄.▲.▲.▲.▲.▲.▲   - magic``');
				this.add('c|@Morfent|``█████████████████████▀▀ - shitpost``');
			}
			if (name === 'naniman') {
				this.add('c|@Nani Man|rof');
			}
			if (name === 'phil') {
				this.add('c|@phil|GET SLUGGED');
			}
			if (name === 'qtrx') {
				sentences = ["cutie are ex", "q-trix", "quarters", "cute T-rex", "Qatari", "random letters", "spammy letters", "asgdf"];
				this.add('c|@qtrx|omg DONT call me \'' + sentences[this.random(8)] + '\' pls respect my name its very special!!1!');
			}
			if (name === 'queez') {
				this.add('c|@Queez|B-be gentle');
			}
			if (name === 'rekeri') {
				this.add('c|@rekeri|Get Rekeri\'d :]');
			}
			if (name === 'relados') {
				let italians = {'haunter': 1, 'test2017': 1, 'uselesstrainer': 1};
				if (toId(pokemon.side.foe.active[0].name) in italians) {
					this.add('c|@Relados|lol italians');
				} else {
					sentences = ['lmfao why are you even playing this game', 'and now, to unleash screaming temporal doom', 'rof'];
					this.add('c|@Relados|' + sentences[this.random(3)]);
				}
			}
			if (name === 'reverb') {
				this.add('c|@Reverb|How is this legal?');
			}
			if (name === 'rosiethevenusaur') {
				sentences = ['!dt party', 'Are you Wifi whitelisted?', 'Read the roomintro!'];
				this.add('c|@RosieTheVenusaur|' + sentences[this.random(3)]);
			}
			if (name === 'scalarmotion') {
				this.add('-message', 'sraclrlamtio got prmotd to driier');
			}
			if (name === 'scotteh') {
				this.add('c|@Scotteh|─────▄▄████▀█▄');
				this.add('c|@Scotteh|───▄██████████████████▄');
				this.add('c|@Scotteh|─▄█████.▼.▼.▼.▼.▼.▼.▼');
			}
			if (name === 'shamethat') {
				sentences = ['no guys stop fighting', 'mature people use their words', 'please direct all attacks to user: beowulf'];
				this.add('c|@Shame That|' + sentences[this.random(3)]);
			}
			if (name === 'skitty') {
				this.add('c|@Skitty|\\_$-_-$_/');
			}
			if (name === 'spydreigon') {
				sentences = ['curry consumer', 'try to keep up', 'fucking try to knock me down', 'Sometimes I slather myself in vasoline and pretend I\'m a slug', 'I\'m really feeling it!'];
				this.add('c|@Spydreigon|' + sentences[this.random(5)]);
			}
			if (name === 'steamroll') {
				if (!pokemon.isLead) {
					sentences = ['You\'re in for it now!', 'Welcome to a new world of pain!', 'This is going to be **__fun__**...', 'Awesome! Imma deck you in the shnoz!'];
					this.add('c|@Steamroll|' + sentences[this.random(4)]);
				} else {
					pokemon.isLead = false;
				}
			}
			if (name === 'steeledges') {
				sentences = ["In this moment, I am euphoric. Not because of any phony god's blessing. But because, I am enlightened by my own intelligence.", "Potent Potables for $200, Alex."].randomize();
				this.add('c|@SteelEdges|' + sentences[0]);
			}
			if (name === 'temporaryanonymous') {
				sentences = ['Hey, hey, can I gently scramble your insides (just for laughs)? ``hahahaha``', 'check em', 'If you strike me down, I shall become more powerful than you can possibly imagine! I have a strong deathrattle effect and I cannot be silenced!'];
				this.add('c|@Temporaryanonymous|' + sentences[this.random(3)]);
			}
			if (name === 'test2017') {
				let quacks = '';
				let count = 0;
				do {
					count++;
					quacks = quacks + 'QUACK!';
				} while (this.random(3) !== 2 && count < 15);
				this.add('c|@Test2017|' + quacks);
			}
			if (name === 'tfc') {
				sentences = ['Here comes the king', ' this chat sucks', 'Coronis smells'];
				this.add('c|@TFC|' + sentences[this.random(3)]);
			}
			if (name === 'tgmd') {
				this.add('c|@TGMD|I\'m a dog :]');
			}
			if (name === 'timbuktu') {
				this.add('c|@Timbuktu|plot twist');
			}
			if (name === 'trickster') {
				this.add('c|@Trickster|' + ['I do this for free, you know.', 'Believe in the me that believes in you!'][this.random(2)]);
			}
			if (name === 'trinitrotoluene') {
				this.add('c|@trinitrotoluene|pls no hax');
			}
			if (name === 'waterbomb') {
				this.add('c|@WaterBomb|Get off my lawn! *shakes cane*');
			}
			if (name === 'xfix') {
				let hazards = {stealthrock: 1, spikes: 1, toxicspikes: 1, stickyweb: 1};
				let hasHazards = false;
				for (let hazard in hazards) {
					if (pokemon.side.getSideCondition(hazard)) {
						hasHazards = true;
						break;
					}
				}
				if (hasHazards) {
					this.add('c|@xfix|(no haz... too late)');
				} else {
					this.add('c|@xfix|(no hazards, attacks only, final destination)');
				}
			}
			if (name === 'zdrup') {
				this.add('c|@zdrup|Wait for it...');
			}
			if (name === 'zebraiken') {
				pokemon.phraseIndex = this.random(3);
				//  Zeb's faint and entry phrases correspond to each other.
				if (pokemon.phraseIndex === 2) {
					this.add('c|@Zebraiken|bzzt n_n');
				} else if (pokemon.phraseIndex === 1) {
					this.add('c|@Zebraiken|bzzt *_*');
				} else {
					this.add('c|@Zebraiken|bzzt o_o');
				}
			}

			// Drivers.
			if (name === 'aelita') {
				this.add('c|%Aelita|Transfer: Aelita. Scanner: Aelita. Virtualization!');
			}
			if (name === 'arcticblast') {
				sentences = ['BEAR MY ARCTIC BLAST', 'lmao what kind of team is this', 'guys guys guess what?!?!?!?!', 'Double battles are completely superior to single battles.', 'I miss the days when PS never broke 100 users and all the old auth were still around.'];
				this.add('c|%Arcticblast|' + sentences[this.random(5)]);
			}
			if (name === 'articuno') {
				sentences = ['Don\'t hurt me, I\'m a gril!', '/me quivers **violently**', 'Don\'t make me use my ban whip...'];
				this.add('c|%Articuno|' + sentences[this.random(3)]);
			}
			if (name === 'astara') {
				this.add('c|%Ast☆arA|I\'d rather take a nap, I hope you won\'t be a petilil shit, Eat some rare candies and get on my level.');
			}
			if (name === 'asty') {
				this.add('c|%Asty|:^) Top kek');
			}
			if (name === 'birkal') {
				this.add('c|%Birkal|caw');
			}
			if (name === 'bloobblob') {
				this.add('c|%bloobblob|Contract?');
			}
			if (name === 'charlescarmichael') {
				this.add('c|%Charles Carmichael|If Taylor Swift were in a Fast and Furious movie, it’d be called Taylor Drift.');
			}
			if (name === 'crestfall') {
				sentences = ['On wings of night.', 'Let us hunt those who have fallen to darkness.'];
				this.add('c|%Crestfall|' + sentences[this.random(2)]);
			}
			if (name === 'feliburn') {
				this.add('c|%Feliburn|Come on!');
			}
			if (name === 'galbia') {
				this.add('c|%galbia|prepare for my beautiful display of pure italian skill');
			}
			if (name === 'hugendugen') {
				this.add('c|%Hugendugen|4-1-0 let\'s go for it');
			}
			if (name === 'jellicent') {
				this.add('c|%Jellicent|~(^.^)~');
			}
			if (name === 'kayo') {
				this.add('c|%Kayo|The One and Only Obese Phantom Enthusiast');
			}
			if (name === 'ljdarkrai') {
				this.add('c|%LJDarkrai|Azideias');
			}
			if (name === 'majorbling') {
				sentences = ['(ゞ๑⚈ ˳̫⚈๑) ♡', 'If you can\'t win contests as well as battles, your team is bad~ <3', '♡ Dedenne is too cute to KO ♡'];
				this.add('c|%Majorbling|' + sentences[this.random(3)]);
			}
			if (name === 'raseri') {
				this.add('c|%raseri|ban prinplup');
			}
			if (name === 'quotecs') {
				this.add('c|%QuoteCS|Yeah, I know what you mean, but unfortunately I lack good answers to those because of my incredibly dry personality.');
			}
			if (name === 'uselesstrainer') {
				sentences = ['huehuehuehue', 'PIZA', 'SPAGUETI', 'RAVIOLI RAVIOLI GIVE ME THE FORMUOLI', 'get ready for PUN-ishment'];
				this.add('c|%useless trainer|' + sentences[this.random(5)]);
			}
			if (name === 'vacate') {
				this.add('c|%Vacate|sticky situation');
			}

			// Voices.
			if (name === 'aldaron') {
				this.add('c|+Aldaron|indefatigable workhorse');
			}
			if (name === 'bmelts') {
				this.add('c|+bmelts|zero post hero');
			}
			if (name === 'cathy') {
				let foe = toId(pokemon.side.foe.active[0].name);
				if (foe === 'greatsage' && !this.convoPlayed) {
					this.add('-message', '<~GreatSage> from my observation, it appears that most romantic partners occupy their discussions with repetitive declarations and other uninteresting content');
					this.add('-message', '<&Cathy> lol');
					this.add('-message', '<&Cathy> sounds dull');
					this.add('-message', '<~GreatSage> i do not believe i have ever observed romantic partners discuss any consequential matters (e.g. mathematics, science, or other topics of intellectual interest)');
					this.add('-message', '<~GreatSage> the "normal social protocol" of romance has always presented as exceptionally absurd to me');
					this.add('-message', '<&Cathy> which aspects are you referring to?');
					this.add('-message', '<~GreatSage> it is rather difficult to summarize them in phrases');
					this.add('-message', '<~GreatSage> it\'s not something i have investigated with any thoroughness');
					this.convoPlayed = true;
				} else {
					switch (foe) {
					case 'bmelts':
						sentence = ['attacks bmelts with a heavy dosage of fun', 'destroys bmelts with an ion ray of fun times'][this.random(2)];
						break;
					case 'snowflakes':
						sentence = 'pounces on Snowflakes with a surplus of humour';
						break;
					case 'mikel':
						sentence = 'crushes mikel with patent hilarity';
						break;
					case 'hugendugen':
						sentence = 'skewers Hugendugen with the sword of fun';
						break;
					case 'limi':
						sentence = 'devastates Limi with the fun cannon';
						break;
					}
				}
				if (sentence) {
					this.add('c|HappyFunTimes|/me ' + sentence);
				} else if (!this.convoPlayed) {
					this.add('c|+Cathy|Trivial.');
				}
			}
			if (toId(pokemon.side.foe.active[0].name) === 'cathy') {
				if (name === 'greatsage' && !this.convoPlayed) {
					this.add('-message', '<~GreatSage> from my observation, it appears that most romantic partners occupy their discussions with repetitive declarations and other uninteresting content');
					this.add('-message', '<&Cathy> lol');
					this.add('-message', '<&Cathy> sounds dull');
					this.add('-message', '<~GreatSage> i do not believe i have ever observed romantic partners discuss any consequential matters (e.g. mathematics, science, or other topics of intellectual interest)');
					this.add('-message', '<~GreatSage> the "normal social protocol" of romance has always presented as exceptionally absurd to me');
					this.add('-message', '<&Cathy> which aspects are you referring to?');
					this.add('-message', '<~GreatSage> it is rather difficult to summarize them in phrases');
					this.add('-message', '<~GreatSage> it\'s not something i have investigated with any thoroughness');
					this.convoPlayed = true;
				} else {
					switch (name) {
					case 'bmelts':
						sentence = ['attacks bmelts with a heavy dosage of fun', 'destroys bmelts with an ion ray of fun times'][this.random(2)];
						break;
					case 'snowflakes':
						sentence = 'pounces on Snowflakes with a surplus of humour';
						break;
					case 'mikel':
						sentence = 'crushes mikel with patent hilarity';
						break;
					case 'hugendugen':
						sentence = 'skewers Hugendugen with the sword of fun';
						break;
					case 'limi':
						sentence = 'devastates Limi with the fun cannon';
						break;
					}
					if (sentence) this.add('c|HappyFunTimes|/me ' + sentence);
				}
			}
			if (name === 'diatom') {
				this.add('-message', pokemon.side.foe.name + ' was banned by Diatom. (you should be thankful you are banned and not permabanned)');
			}
			if (name === 'mattl') {
				this.add('c|+MattL|The annoyance I will cause is not well-defined.');
			}
			if (name === 'shaymin') {
				this.add('c|+shaymin|Ready for hax?');
			}
			if (name === 'somalia') {
				this.add('c|+SOMALIA|stupidest shit ever');
			}
			if (name === 'talktakestime') {
				this.add('c|+TalkTakesTime|Welcome to BoTTT!');
			}
		},
		// Here we deal with some special mechanics due to custom sets and moves.
		onBeforeMove: function (pokemon, target, move) {
			let name = toId(pokemon.name);
			// Special Shaymin forme change.
			if (name === 'shaymin' && !pokemon.illusion) {
				let targetSpecies = (move.category === 'Status') ? 'Shaymin' : 'Shaymin-Sky';

				if (targetSpecies !== pokemon.template.species) {
					this.add('message', pokemon.name + ((move.category === 'Status') ? ' has reverted to Land Forme!' : ' took to the sky once again!'));
					let template = this.getTemplate(targetSpecies);
					pokemon.formeChange(targetSpecies);
					pokemon.baseTemplate = template;
					pokemon.setAbility(template.abilities['0']);
					pokemon.baseAbility = template.ability;
					pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
					this.add('detailschange', pokemon, pokemon.details);
				}
			}

			// Break the secondary of Dell's sig if an attack is attempted.
			if (target.volatiles['parry'] && move.category !== 'Status') {
				target.removeVolatile('parry');
			}

			if (pokemon.volatiles['needles']) {
				let dice = this.random(3);
				pokemon.removeVolatile('needles');
				if (dice === 2) {
					this.boost({atk:1, spe:1, def:-1}, pokemon, pokemon, 'used needles');
				} else if (dice === 1) {
					this.boost({def:1, spd:1, spe:-1}, pokemon, pokemon, 'used needles');
				} else {
					this.boost({atk:1, def:1, spe:-1}, pokemon, pokemon, 'used needles');
				}
			}

			if (move.id === 'judgment' && name === 'shrang' && !pokemon.illusion) {
				if (pokemon.setType(['Dragon', 'Fairy'])) {
					this.add('-start', pokemon, 'typechange', 'Dragon/Fairy', '[silent]');
				}
			}
		},
		// Add here salty tears, that is, custom faint phrases.
		onFaint: function (pokemon) {
			if (pokemon.kupoTransformed) {
				pokemon.name = '@kupo';
				pokemon.kupoTransformed = false;
			}
			let name = toId(pokemon.name);
			let sentences = [];
			let sentence = '';

			// Admins.
			if (name === 'antar') {
				this.add('c|~Antar|Should\'ve been an Umbreon.');
			}
			if (name === 'chaos') {
				if (name === toId(pokemon.name)) this.add('c|~chaos|//forcewin chaos');
				if (this.random(1000) === 420) {
					// Shouldn't happen much, but if this happens it's hilarious.
					this.add('c|~chaos|actually');
					this.add('c|~chaos|//forcewin ' + pokemon.side.name);
					this.win(pokemon.side);
				}
			}
			if (name === 'haunter') {
				this.add('c|~haunter|you can\'t compare with my powers');
			}
			if (name === 'jasmine') {
				this.add('c|~Jasmine|' + ['I meant to do that.', 'God, I\'m the worse digimon.'][this.random(2)]);
			}
			if (name === 'joim') {
				sentences = ['AVENGE ME, KIDS! AVEEEENGEEE MEEEEEE!!', '``This was a triumph, I\'m making a note here: HUGE SUCCESS.``', '``Remember when you tried to kill me twice? Oh how we laughed and laughed! Except I wasn\'t laughing.``', '``I\'m not even angry, I\'m being so sincere right now, even though you broke my heart and killed me. And tore me to pieces. And threw every piece into a fire.``'];
				this.add('c|~Joim|' + sentences[this.random(4)]);
			}
			if (name === 'theimmortal') {
				this.add('c|~The Immortal|Oh how wrong we were to think immortality meant never dying.');
			}
			if (name === 'v4') {
				this.add('c|~V4|' + ['Back to irrevelance for now n_n', 'Well that was certainly a pleasant fall.'][this.random(2)]);
			}
			if (name === 'zarel') {
				this.add('c|~Zarel|your mom');
				// Followed by the usual '~Zarel fainted'.
				this.add('-message', '~Zarel used your mom!');
			}

			// Leaders.
			if (name === 'hollywood') {
				this.add('c|&hollywood|BibleThump');
			}
			if (name === 'jdarden') {
				this.add('c|&jdarden|;-;7');
			}
			if (name === 'okuu') {
				this.add("raw|<div class=\"broadcast-blue\"><b>...and Smooth Jazz.</b></div>");
			}
			if (name === 'sirdonovan') {
				this.add('-message', 'RIP sirDonovan');
			}
			if (name === 'slayer95') {
				this.add('c|&Slayer95|I may be defeated this time, but that is irrevelant in the grand plot of seasonals!');
			}
			if (name === 'sweep') {
				this.add('c|&Sweep|xD');
			}
			if (name === 'verbatim') {
				this.add('c|&verbatim|Crash and Burn');
			}

			// Mods.
			if (name === 'acedia') {
				this.add('c|@Acedia|My dad smoked his whole life. One day my mom told him "If you want to see your children graduate, you have to stop". 3 years later he died of lung cancer. My mom told me "Dont smoke; dont put your family through this". At 24, I have never touched a cigarette. I must say, I feel a sense of regret, because watching you play Pokemon gave me cancer anyway ( ͝° ͜ʖ͡°)');
			}
			if (name === 'am') {
				this.add('c|@AM|RIP');
			}
			if (name === 'antemortem') {
				this.add('c|@antemortem|FUCKING CAMPAIGNERS');
			}
			if (name === 'ascriptmaster') {
				this.add('c|@Ascriptmaster|Too overpowered. I\'m nerfing you next patch');
			}
			if (name === 'asgdf') {
				this.add('c|@asgdf|' + ['Looks like I spoke too hasteely', 'You only won because I couldn\'t think of a penguin pun!'][this.random(2)]);
			}
			if (name === 'audiosurfer') {
				if (pokemon.phraseIndex === 2) {
					this.add('c|@Audiosurfer|No? Well you should check it out.');
				} else if (pokemon.phraseIndex === 1) {
					this.add('c|@Audiosurfer|You should consider Battling 101 friend.');
				} else {
					this.add('c|@Audiosurfer|Back to catching waves.');
				}
			}
			if (name === 'barton') {
				this.add('c|@barton|' + ['ok', 'haha?'][this.random(2)]);
			}
			if (name === 'bean') {
				sentences = ['that\'s it ur getting banned', 'meow', '(✖╭╮✖)'];
				this.add('c|@bean|' + sentences[this.random(3)]);
			}
			if (name === 'beowulf') {
				this.add('c|@Beowulf|There is no need to be mad');
			}
			if (name === 'biggie') {
				sentences = ['It was all a dream', 'It\'s gotta be the shoes', 'ヽ༼ຈل͜ຈ༽ﾉ RIOT ヽ༼ຈل͜ຈ༽ﾉ'];
				this.add('c|@BiGGiE|' + sentences[this.random(3)]);
			}
			if (name === 'blitzamirin') {
				this.add('c|@Blitzamirin| The Mirror Can Lie It Doesn\'t Show What\'s Inside! ╰〳~ ✖ Д ✖ ~〵⊃━☆ﾟ.*･｡ﾟ');
			}
			if (name === 'businesstortoise') {
				this.add('c|@Business Tortoise|couldn\'t meet my deadline...');
			}
			if (name === 'coolstorybrobat') {
				switch (pokemon.phraseIndex) {
				case 1:
					sentence = "Lol I got slayed";
					break;
				case 2:
					sentence = "BRUH...";
					break;
				case 3:
					sentence = "I tried";
					break;
				case 4:
					sentence = "Going back to those mountains to train brb";
					break;
				default:
					sentence = "I forgot what fruit had... tasted like...";
				}
				this.add('c|@CoolStoryBrobat|' + sentence);
			}
			if (name === 'dell') {
				this.add('c|@Dell|All because I couldn\'t use Yoshi...');
				this.add('c|@Dell|───────────────████─███────────');
				this.add('c|@Dell|──────────────██▒▒▒█▒▒▒█───────');
				this.add('c|@Dell|─────────────██▒────────█──────');
				this.add('c|@Dell|─────────██████──██─██──█──────');
				this.add('c|@Dell|────────██████───██─██──█──────');
				this.add('c|@Dell|────────██▒▒▒█──────────███────');
				this.add('c|@Dell|────────██▒▒▒▒▒▒───▒──██████───');
				this.add('c|@Dell|───────██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███─');
				this.add('c|@Dell|──────██▒▒▒▒─────▒▒▒▒▒▒▒▒▒▒▒▒█─');
				this.add('c|@Dell|──────██▒▒▒───────▒▒▒▒▒▒▒█▒█▒██');
				this.add('c|@Dell|───────██▒▒───────▒▒▒▒▒▒▒▒▒▒▒▒█');
				this.add('c|@Dell|────────██▒▒─────█▒▒▒▒▒▒▒▒▒▒▒▒█');
				this.add('c|@Dell|────────███▒▒───██▒▒▒▒▒▒▒▒▒▒▒▒█');
				this.add('c|@Dell|─────────███▒▒───█▒▒▒▒▒▒▒▒▒▒▒█─');
				this.add('c|@Dell|────────██▀█▒▒────█▒▒▒▒▒▒▒▒██──');
				this.add('c|@Dell|──────██▀██▒▒▒────█████████────');
				this.add('c|@Dell|────██▀███▒▒▒▒────█▒▒██────────');
				this.add('c|@Dell|█████████▒▒▒▒▒█───██──██───────');
				this.add('c|@Dell|█▒▒▒▒▒▒█▒▒▒▒▒█────████▒▒█──────');
				this.add('c|@Dell|█▒▒▒▒▒▒█▒▒▒▒▒▒█───███▒▒▒█──────');
				this.add('c|@Dell|█▒▒▒▒▒▒█▒▒▒▒▒█────█▒▒▒▒▒█──────');
				this.add('c|@Dell|██▒▒▒▒▒█▒▒▒▒▒▒█───█▒▒▒███──────');
				this.add('c|@Dell|─██▒▒▒▒███████───██████────────');
				this.add('c|@Dell|──██▒▒▒▒▒██─────██─────────────');
				this.add('c|@Dell|───██▒▒▒██─────██──────────────');
				this.add('c|@Dell|────█████─────███──────────────');
				this.add('c|@Dell|────█████▄───█████▄────────────');
				this.add('c|@Dell|──▄█▓▓▓▓▓█▄─█▓▓▓▓▓█▄───────────');
				this.add('c|@Dell|──█▓▓▓▓▓▓▓▓██▓▓▓▓▓▓▓█──────────');
				this.add('c|@Dell|──█▓▓▓▓▓▓▓▓██▓▓▓▓▓▓▓█──────────');
				this.add('c|@Dell|──▀████████▀▀███████▀──────────');
			}
			if (name === 'eeveegeneral') {
				this.add('c|@Eevee General|' + ['Retreat!', 'You may have won the battle, but you haven\'t won the war!', 'I salute you o7'][this.random(3)]);
			}
			if (name === 'electrolyte') {
				this.add('c|@Electrolyte|just wait till I hit puberty...');
			}
			if (name === 'enguarde') {
				this.add('c|@Enguarde|I let my guard down...');
			}
			if (name === 'eos') {
				this.add('c|@EoS|؍༼ಥ_ಥ༽ጋ');
			}
			if (name === 'formerhope') {
				this.add('c|@Former Hope|This is why we can\'t have nice things.');
			}
			if (name === 'genesect') {
				if (pokemon.phraseIndex === 5 || pokemon.phraseIndex === 3 || pokemon.phraseIndex === 1) {
					this.add('-message', '▄████▄░░░░░░░░░░░░░░░░░░░░');
					this.add('-message', '██████▄░░░░░░▄▄▄░░░░░░░░░░');
					this.add('-message', '░███▀▀▀▄▄▄▀▀▀░░░░░░░░░░░░░');
					this.add('-message', '░░░▄▀▀▀▄░░░█▀▀▄░▄▀▀▄░█▄░█░');
					this.add('-message', '░░░▄▄████░░█▀▀▄░█▄▄█░█▀▄█░');
					this.add('-message', '░░░░██████░█▄▄▀░█░░█░█░▀█░');
					this.add('-message', '░░░░░▀▀▀▀░░░░░░░░░░░░░░░░░');
				} else if (pokemon.phraseIndex === 4) {
					this.add('c|@Genesect|Well, if that\'s what you want');
					this.add('c|@Genesect|┬┴┬┴┤ʕ•ᴥ├┬┴┬┴');
					this.add('c|@Genesect|┬┴┬┴┤ ʕ•├┬┴┬┴');
					this.add('c|@Genesect|┬┴┬┴┤  ʕ├┬┴┬┴');
				} else {
					sentences = ["The darkside cannot be extinguished, when you fight...", "؍༼ಥ_ಥ༽ጋ lament your dongers ؍༼ಥ_ಥ༽ጋ", "Yᵒᵘ Oᶰˡʸ Lᶤᵛᵉ Oᶰᶜᵉ", "やれやれだぜ", " ୧༼ಠ益ಠ༽୨ MRGLRLRLR ୧༼ಠ益ಠ༽୨"].randomize();
					this.add('c|@Genesect|' + sentences[0]);
				}
			}
			if (name === 'hippopotas') {
				this.add('-message', 'The sandstorm subsided.');
			}
			if (name === 'hydroimpact') {
				this.add('c|@HYDRO IMPACT|Well done, you\'ve gone beyond your limits and have gained my trust. Now go and write your own destiny, don\'t let fate write it for you.');
			}
			if (name === 'innovamania') {
				sentences = ['Did you rage quit?', 'How\'d you lose with this set?', 'Pm Nani Man to complain about this set ( ͡° ͜ʖ ͡°)'];
				this.add('c|@innovamania|' + sentences[this.random(3)]);
			}
			if (name === 'jac') {
				this.add('c|@Jac|bruh');
			}
			if (name === 'jinofthegale') {
				sentences = ['ヽ༼ຈل͜ຈ༽ﾉ You\'ve upped your game ヽ༼ຈل͜ຈ༽ﾉ?', 'Please don\'t steal my bit-beast!', 'Should have used Black'];
				this.add('c|@jin of the gale|' + sentences[this.random(3)]);
			}
			if (name === 'kostitsynkun') {
				this.add('c|@Kostitsyn-kun|Kyun ★ Kyun~');
			}
			if (name === 'kupo') {
				this.add('c|@kupo|:C');
			}
			if (name === 'lawrenceiii') {
				this.add('c|@Lawrence III|Fuck off.');
			}
			if (name === 'layell') {
				this.add('c|@Layell|' + ['Alas poor me', 'Goodnight sweet prince'][this.random(2)]);
			}
			if (name === 'legitimateusername') {
				this.add('c|@LegitimateUsername|``This isn\'t brave. It\'s murder. What did I ever do to you?``');
			}
			if (name === 'level51') {
				this.add('c|@Level 51|You made me sad. That\'s the opposite of happy.');
			}
			if (name === 'lyto') {
				this.add('c|@Lyto|' + ['Unacceptable!', 'Mrgrgrgrgr...'][this.random(2)]);
			}
			if (name === 'marty') {
				this.add('c|@Marty|Your fate is sealed');
			}
			if (name === 'morfent') {
				sentences = ['Hacking claims the lives of over 2,000 registered laddering alts every day.', 'Every 60 seconds in Africa, a minute passes. Together we can stop this. Please spread the word.', 'SOOOOOO $TONED FUCK MAN AW $HIT NIGGA HELLA MOTHER FUCKING 666 ODD FUTURE MAN BRO CHECK THIS OUT MY SWAG WITH THE WHAT WHOLE 666 420 $$$$ HOLLA HOLLA GET DOLLA SWED CASH FUCKING MARIJUANA CIGARETTES GANGSTA GANGSTA EAZY-E C;;R;E;A;M; SO BAKED OFF THE BOBMARLEY GANJA 420 SHIT PURE OG KUUSSHHH LEGALIZE CRYSTAL WEED'];
				this.add('c|@Morfent|' + sentences[this.random(3)]);
			}
			if (name === 'naniman') {
				sentences = ['rof', "deck'd", '**praise** TI'];
				this.add('c|@Nani Man|' + sentences[this.random(3)]);
			}
			if (name === 'phil') {
				this.add('c|@phil|The salt is real right now');
			}
			if (name === 'qtrx') {
				sentences = ['Keyboard not found; press **Ctrl + W** to continue...', 'hfowurfbiEU;DHBRFEr92he', 'At least my name ain\t asgdf...'];
				this.add('c|@qtrx|' + sentences[this.random(3)]);
			}
			if (name === 'queez') {
				this.add('c|@Queez|(◕‿◕✿)');
			}
			if (name === 'rekeri') {
				this.add('c|@rekeri|lucky af :[');
			}
			if (name === 'relados') {
				sentences = ['BS HAX', 'rekt', 'rof'];
				this.add('c|@Relados|' + sentences[this.random(3)]);
			}
			if (name === 'reverb') {
				this.add('c|@Reverb|stupid communist dipshit');
			}
			if (name === 'rosiethevenusaur') {
				this.add('c|@RosieTheVenusaur|' + ['SD SKARM SHALL LIVE AGAIN!!!', 'Not my WiFi!'][this.random(2)]);
			}
			if (name === 'scalarmotion') {
				this.add('-message', 'scalarmotion was banned by Nani Man. (spangj)');
			}
			if (name === 'scotteh') {
				this.add('-message', '▄███████▄.▲.▲.▲.▲.▲.▲');
				this.add('-message', '█████████████████████▀▀');
			}
			if (name === 'shamethat') {
				sentences = ["ok agree to disagree", "rematch, don't attack this time", "i blame beowulf"];
				this.add('c|@Shame That|' + sentences[this.random(3)]);
			}
			if (name === 'skitty') {
				this.add('c|@Skitty|!learn skitty, roleplay');
				this.add('raw|<div class="infobox">Skitty <span class="message-learn-cannotlearn">can\'t</span> learn Role Play</div>');
			}
			if (name === 'spydreigon') {
				sentences = ['lolhax', 'crit mattered', 'bruh cum @ meh', '>thinking Pokemon takes any skill'];
				this.add('c|@Spydreigon|' + sentences[this.random(4)]);
			}
			if (name === 'steamroll') {
				if (!pokemon.killedSome) {
					sentence = 'Goddamn I feel useless.';
				} else {
					sentences = ['...And I saw, as it were... Spaghetti.', "Agh, shouldn't of been that easy.", 'Hope that was enough.'];
					sentence = sentences[this.random(3)];
				}
				this.add('c|@Steamroll|' + sentence);
			}
			if (name === 'steeledges') {
				this.add('c|@SteelEdges|' + ['You know, I never really cared for Hot Pockets.', 'Suck it, Trebek. Suck it long, and suck it hard.'][this.random(2)]);
			}
			if (name === 'temporaryanonymous') {
				sentences = [';_;7', 'This kills the tempo', 'I\'m kill. rip.', 'S-senpai! Y-you\'re being too rough! >.<;;;;;;;;;;;;;;;;;', 'A-at least you checked my dubs right?', 'B-but that\'s impossible! This can\'t be! AAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHGH'];
				this.add('c|@Temporaryanonymous|' + sentences[this.random(6)]);
			}
			if (name === 'test2017') {
				sentences = ['DUCK YOU!', 'GO DUCK YOURSELF!', 'SUCK MY DUCK!'];
				this.add('c|@Test2017|' + sentences[this.random(3)]);
			}
			if (name === 'tfc') {
				this.add('c|@TFC|' + ['brb gotta piss', 'oh thats bs'][this.random(2)]);
			}
			if (name === 'tgmd') {
				this.add('c|@TGMD|rip in pepsi');
			}
			if (name === 'timbuktu') {
				this.add('c|@Timbuktu|' + ['</3', 'broken'][this.random(2)]);
			}
			if (name === 'trickster') {
				sentences = ['RIP in pepperoni cappuccino pistachio.', 'El psy congroo.', 'W-wow! Hacker!', '“This guy\'s team is CRAZY!” ☑ “My team can\'t win against a team like that” ☑ "He NEEDED precisely those two crits to win" ☑ “He led with the only Pokemon that could beat me” ☑ "He got the perfect hax" ☑ “There was nothing I could do” ☑ “I played that perfectly”', '(⊙﹏⊙✿)'];
				this.add('c|@Trickster|' + sentences[this.random(5)]);
			}
			if (name === 'trinitrotoluene') {
				this.add('c|@trinitrotoluene|why hax @_@');
			}
			if (name === 'waterbomb') {
				this.add('c|@WaterBomb|brb getting more denture cream');
			}
			if (name === 'xfix') {
				let foe = pokemon.side.foe.active[0];
				if (foe.name === '@xfix') {
					this.add('c|@xfix|(annoying Dittos...)');
				} else if (foe.ability === 'magicbounce') {
					this.add('c|@xfix|(why ' + foe.name + ' has Magic Bounce...)');
					this.add('c|@xfix|(gg... why...)');
				} else {
					this.add('c|@xfix|(gg... I guess)');
				}
			}
			if (name === 'zdrup') {
				this.add('c|@zdrup|... keep waiting for it ...');
			}
			if (name === 'zebraiken') {
				if (pokemon.phraseIndex === 2) {
					this.add('c|@Zebraiken|bzzt u_u');
				} else if (pokemon.phraseIndex === 1) {
					this.add('c|@Zebraiken|bzzt ._.');
				} else {
					// Default faint.
					this.add('c|@Zebraiken|bzzt x_x');
				}
			}

			// Drivers.
			if (name === 'aelita') {
				sentences = ['Oh no, the Scyphozoa\'s here!', 'Devirtualized...', 'Stones. Aelita Stones. Like the rock group. I\'m Odd\'s cousin from Canada.'];
				this.add('c|%Aelita|' + sentences[this.random(3)]);
			}
			if (name === 'arcticblast') {
				sentences = ['totally had it but choked, gg', 'I would have won if it weren\'t for HAX', 'oh', 'Double battles are stil superior to single battles.', 'newfag'];
				this.add('c|%Arcticblast|' + sentences[this.random(5)]);
			}
			if (name === 'articuno') {
				sentences = ['This is why you don\'t get any girls.', 'fite me irl', 'Actually, I don\'t have a gender...'];
				this.add('c|%Articuno|' + sentences[this.random(3)]);
			}
			if (name === 'astara') {
				sentences = ['/me twerks into oblivion', 'good night ♥', 'Astara Vista Baby'];
				this.add('c|%Ast☆arA|' + sentences[this.random(3)]);
			}
			if (name === 'asty') {
				this.add('c|%Asty|:^( Bottom kek');
			}
			if (name === 'birkal') {
				this.add('c|%Birkal|//birkal');
			}
			if (name === 'bloobblob') {
				this.add('c|%bloobblob|I won\'t die! Even if I\'m killed!');
			}
			if (name === 'charlescarmichael') {
				this.add('c|%Charles Carmichael|The Grandmaster of Puns will be back for revenge!');
			}
			if (name === 'crestfall') {
				this.add('c|%Crestfall|Vayne [All Chat]: Outplayed me gg no re');
			}
			if (name === 'feliburn') {
				this.add('c|%Feliburn|' + ['BHUWUUU!', 'I like shorts! They\'re comfy and easy to wear!'][this.random(2)]);
			}
			if (name === 'galbia') {
				this.add('c|%galbia|' + ['azz e mo', 'rip luck :('][this.random(2)]);
			}
			if (name === 'jellicent') {
				this.add('c|%Jellicent|X_X');
			}
			if (name === 'kayo') {
				this.add('c|%Kayo|Fat ShOoOoOoSty!');
			}
			if (name === 'ljdarkrai') {
				this.add('c|%LJDarkrai|:<');
			}
			if (name === 'majorbling') {
				this.add('c|%Majorbling|There is literally no way to make this pokemon good...(ゞ๑T  ˳̫T\'๑) ');
			}
			if (name === 'raseri') {
				this.add('c|%raseri|banned');
			}
			if (name === 'quotecs') {
				this.add('c|%QuoteCS|#StillIrrelevant');
			}
			if (name === 'uselesstrainer') {
				sentences = ['MATTERED', 'CAIO', 'ima repr0t', 'one day i\'ll turn into a beautiful butterfly'];
				this.add('c|%useless trainer|' + sentences[this.random(4)]);
			}
			if (name === 'vacate') {
				this.add('c|%Vacate|dam it');
			}

			// Ex-staff or honorary voice.
			if (name === 'bmelts') {
				this.add('c|+bmelts|retired now');
			}
			if (name === 'cathy') {
				this.add('c|+Cathy|I was being facetious');
			}
			if (name === 'diatom' && !pokemon.hasBeenThanked) {
				this.add('c|★' + pokemon.side.foe.name + '|Thanks Diatom...');
			}
			if (name === 'mattl') {
				this.add('c|+MattL|Finish him! You used "Finals week!" Fatality!');
			}
			if (name === 'redew') {
				this.add('c|+Redew|i hope u think ur a good player');
				this.add('c|+Redew|play spl man');
				this.add('c|+Redew|ud win lots');
			}
			if (name === 'shaymin') {
				this.add('c|+shaymin|You\'ve done well, perhaps...too well, even beating the odds!');
			}
			if (name === 'somalia') {
				this.add('c|+SOMALIA|tired of this shitass game');
			}
			if (name === 'talktakestime') {
				this.add('-message', '(Automated response: Your battle contained a banned outcome.)');
			}
		},
		// Special switch-out events for some mons.
		onSwitchOut: function (pokemon) {
			if (toId(pokemon.name) === 'hippopotas' && !pokemon.illusion) {
				this.add('-message', 'The sandstorm subsided.');
			}
			// Shaymin forme change.
			if (toId(pokemon.name) === 'shaymin' && !pokemon.illusion) {
				if (pokemon.template.species === 'Shaymin') {
					let template = this.getTemplate('Shaymin-Sky');
					pokemon.formeChange('Shaymin-Sky');
					pokemon.baseTemplate = template;
					pokemon.setAbility(template.abilities['0']);
					pokemon.baseAbility = template.ability;
					pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				}
			}

			// Transform
			if (pokemon.originalName) pokemon.name = pokemon.originalName;
		},
		onDragOut: function (pokemon) {
			// Prevents qtrx from being red carded by chaos while in the middle of using sig move, which causes a visual glitch.
			if (pokemon.isDuringAttack) {
				this.add('-message', "But the Unown Aura absorbed the effect!");
				return null;
			}
			if (pokemon.kupoTransformed) {
				pokemon.name = '@kupo';
				pokemon.kupoTransformed = false;
			}
		},
		onAfterMoveSelf: function (source, target, move) {
			// Make haunter not immune to Life Orb as a means to balance.
			if (toId(source.name) === 'haunter') {
				this.damage(source.maxhp / 10, source, source, this.getItem('lifeorb'));
			}
		},
		onModifyPokemon: function (pokemon) {
			let name = toId(pokemon.name);
			// Enforce choice item locking on custom moves.
			// qtrx only has one move anyway. This isn't implemented for Cathy since her moves are all custom. Don't trick her a Scarf!
			if (name !== 'qtrx' && name !== 'Cathy') {
				let moves = pokemon.moveset;
				if (pokemon.getItem().isChoice && pokemon.lastMove === moves[3].id) {
					for (let i = 0; i < 3; i++) {
						if (!moves[i].disabled) {
							pokemon.disableMove(moves[i].id, false);
							moves[i].disabled = true;
						}
					}
				}
			}
			// Enforce taunt disabling custom moves.
			if (pokemon.volatiles['taunt']) {
				let moves = pokemon.moveset;
				for (let i = 0; i < moves.length; i++) {
					if (this.getMove(moves[i].id).category === 'Status' && !moves[i].disabled) {
						pokemon.disableMove(moves[i].id, false);
						moves[i].disabled = true;
					}
				}
			}
		},
		// Specific residual events for custom moves.
		// This allows the format to have kind of custom side effects and volatiles.
		onResidual: function (battle) {
			for (let s in battle.sides) {
				let thisSide = battle.sides[s];
				if (thisSide.premonTimer > 4) {
					thisSide.premonTimer = 0;
					thisSide.premonEffect = true;
				} else if (thisSide.premonTimer > 0) {
					if (thisSide.premonTimer === 4) thisSide.addSideCondition('safeguard');
					thisSide.premonTimer++;
				}
				for (let p in thisSide.active) {
					let pokemon = thisSide.active[p];
					let name = toId(pokemon.name);

					if (pokemon.side.premonEffect) {
						pokemon.side.premonEffect = false;
						this.add('c|@zdrup|...dary! __**LEGENDARY!**__');
						this.boost({atk:1, def:1, spa:1, spd:1, spe:1, accuracy:1}, pokemon, pokemon, 'legendary premonition');
						pokemon.addVolatile('aquaring');
						pokemon.addVolatile('focusenergy');
					}
					if (pokemon.volatiles['resilience'] && !pokemon.fainted) {
						this.heal(pokemon.maxhp / 16, pokemon, pokemon);
						this.add('-message', pokemon.name + "'s resilience healed itself!");
					}
					if (pokemon.volatiles['unownaura'] && !pokemon.fainted && !pokemon.illusion) {
						this.add('-message', "Your keyboard is reacting to " + pokemon.name + "'s Unown aura!");
						if (this.random(2) === 1) {
							this.useMove('trickroom', pokemon);
						} else {
							this.useMove('wonderroom', pokemon);
						}
					}
					if (name === 'beowulf' && !pokemon.fainted && !pokemon.illusion) {
						this.add('c|@Beowulf|/me buzzes loudly!');
					}
					if (name === 'cathy' && !pokemon.fainted && !pokemon.illusion) {
						let messages = [
							'kicking is hilarious!',
							'flooding the chat log with kicks makes me lol',
							'please don\'t stop me from having fun',
							'having fun is great!',
							'isn\'t this so much fun?',
							'let\'s all have fun by spamming the channel!',
							'FUN FUN FUN',
							'SO MUCH FUN!',
							'^_^ fun times ^_^',
							'/me is having so much fun!',
							'having fun is great!',
							'/me thinks spam is fun!',
							'/me loves spamming this channel, because it\'s completely inconsequential!',
							'this is just the internet -- nothing matters!',
							'let\'s have fun ALL NIGHT LONG!!!!!!!!!!!!!!!!!!!!!!',
						];
						this.add('c|HappyFunTimes|' + messages[this.random(15)]);
					}
					if (pokemon.volatiles['parry']) {
						// Dell hasn't been attacked.
						pokemon.removeVolatile('parry');
						this.add('-message', "Untouched, the Aura Parry grows stronger still!");
						this.boost({def:1, spd:1}, pokemon, pokemon, 'Aura Parry');
					}
				}
			}
		},
		// This is where the signature moves are actually done.
		onModifyMove: function (move, pokemon) {
			// This is to make signature moves work when transformed.
			if (move.id === 'transform') {
				move.onHit = function (target, pokemon) {
					if (!pokemon.transformInto(target, pokemon)) return false;
					pokemon.originalName = pokemon.name;
					pokemon.name = target.name;
				};
			}

			let name = toId(pokemon.illusion && move.sourceEffect === 'allyswitch' ? pokemon.illusion.name : pokemon.name);
			// Prevent visual glitch with Spell Steal.
			move.effectType = 'Move';
			// Just because it's funny.
			if (move.id === 'defog') {
				move.name = 'Defrog';
				this.attrLastMove('[still]');
				this.add('-anim', pokemon, "Defog", pokemon);
			}

			// Admin signature moves.
			if (move.id === 'spikes' && name === 'antar') {
				move.name = 'Firebomb';
				move.basePower = 100;
				move.category = 'Special';
				move.flags = {};
				move.type = 'Fire';
				move.onTryHitSide = function (side, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Overheat", side.active[0]);
				};
			}
			if (move.id === 'embargo' && name === 'chaos') {
				move.name = 'Forcewin';
				move.onHit = function (pokemon) {
					pokemon.addVolatile('taunt');
					pokemon.addVolatile('torment');
					pokemon.addVolatile('confusion');
					pokemon.addVolatile('healblock');
				};
			}
			if (move.id === 'quiverdance' && name === 'haunter') {
				move.name = 'Genius Dance';
				move.boosts = {spd:1, spe:1, accuracy:2, evasion:-1, def:-1};
				move.onTryHit = function (pokemon) {
					if (pokemon.volatiles['haunterino']) return false;
				};
				move.onHit = function (pokemon) {
					if (pokemon.volatiles['haunterino']) return false;
					pokemon.addVolatile('haunterino');
				};
			}
			if (move.id === 'bellydrum' && name === 'jasmine') {
				move.name = 'Lockdown';
				move.onHit = function (target, pokemon) {
					this.add("raw|<div class=\"broadcast-red\"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>");
				};
				move.self = {boosts: {atk:6}};
			}
			if (move.id === 'milkdrink' && name === 'joim') {
				move.name = 'Red Bull Drink';
				move.boosts = {spa:1, spe:1, accuracy:1, evasion:-1};
				delete move.heal;
				move.onTryHit = function (pokemon) {
					if (pokemon.volatiles['redbull']) return false;
					this.attrLastMove('[still]');
					this.add('-anim', pokemon, "Geomancy", pokemon);
				};
				move.onHit = function (pokemon) {
					if (pokemon.volatiles['redbull']) return false;
					pokemon.addVolatile('redbull');
				};
			}
			if (move.id === 'sleeptalk' && name === 'theimmortal') {
				move.name = 'Sleep Walk';
				move.pp = 20;
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Healing Wish", target);
				};
				move.onHit = function (pokemon) {
					if (pokemon.status !== 'slp') {
						if (pokemon.hp >= pokemon.maxhp) return false;
						if (!pokemon.setStatus('slp')) return false;
						pokemon.statusData.time = 3;
						pokemon.statusData.startTime = 3;
						this.heal(pokemon.maxhp);
						this.add('-status', pokemon, 'slp', '[from] move: Rest');
					}
					let moves = pokemon.moveset.map(moveData => moveData.id).filter(moveId => moveId !== 'sleeptalk');
					let move = '';
					if (moves.length) move = moves[this.random(moves.length)];
					if (!move) return false;
					this.useMove(move, pokemon);
					let activate = false;
					let boosts = {};
					for (let i in pokemon.boosts) {
						if (pokemon.boosts[i] < 0) {
							activate = true;
							boosts[i] = 0;
						}
					}
					if (activate) pokemon.setBoost(boosts);
					if (!pokemon.informed) {
						this.add('c|~The Immortal|I don\'t really sleep walk...');
						pokemon.informed = true;
					}
				};
			}
			if (move.id === 'vcreate' && name === 'v4') {
				move.name = 'V-Generate';
				move.self = {boosts: {accuracy: -2}};
				move.accuracy = 85;
				move.secondaries = [{chance: 50, status: 'brn'}];
			}
			if (move.id === 'relicsong' && name === 'zarel') {
				move.name = 'Relic Song Dance';
				move.basePower = 60;
				move.multihit = 2;
				move.category = 'Special';
				move.type = 'Psychic';
				move.negateSecondary = true;
				move.ignoreImmunity = true;
				delete move.secondaries;
				move.onTryHit = function (target, pokemon) {
					this.attrLastMove('[still]');
					let move = pokemon.template.speciesid === 'meloettapirouette' ? 'Brick Break' : 'Relic Song';
					this.add('-anim', pokemon, move, target);
				};
				move.onHit = function (target, pokemon, move) {
					if (pokemon.template.speciesid === 'meloettapirouette' && pokemon.formeChange('Meloetta')) {
						this.add('-formechange', pokemon, 'Meloetta', '[msg]');
					} else if (pokemon.formeChange('Meloetta-Pirouette')) {
						this.add('-formechange', pokemon, 'Meloetta-Pirouette', '[msg]');
						// Modifying the move outside of the ModifyMove event? BLASPHEMY
						move.category = 'Physical';
						move.type = 'Fighting';
					}
				};
				move.onAfterMove = function (pokemon) {
					// Ensure Meloetta goes back to standard form after using the move
					if (pokemon.template.speciesid === 'meloettapirouette' && pokemon.formeChange('Meloetta')) {
						this.add('-formechange', pokemon, 'Meloetta', '[msg]');
					}
				};
			}

			// Leader signature moves.
			if (move.id === 'geomancy' && name === 'hollywood') {
				move.name = 'Meme Mime';
				move.flags = {};
				move.onTry = function () {};
				move.boosts = {atk:1, def:1, spa:1, spd:1, spe:1, accuracy:1};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', pokemon, "Geomancy", pokemon);
				};
			}
			if (move.id === 'dragontail' && name === 'jdarden') {
				move.name = 'Wyvern\'s Wind';
				if (!move.flags) move.flags = {};
				move.flags['sound'] = 1;
				move.type = 'Flying';
				move.category = 'Special';
				move.basePower = 80;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Boomburst", target);
				};
			}
			if (move.id === 'firespin' && name === 'okuu') {
				move.name = 'Blazing Star - Ten Evil Stars';
				move.basePower = 60;
				move.accuracy = true;
				move.type = 'Fire';
				move.priority = 2;
				move.status = 'brn';
				move.self = {boosts: {spa:-1}};
				move.onHit = function (target, source) {
					let oldAbility = target.setAbility('solarpower');
					if (oldAbility) {
						this.add('-ability', target, target.ability, '[from] move: Blazing Star - Ten Evil Stars');
					}
				};
			}
			if (move.id === 'mefirst' && name === 'sirdonovan') {
				move.name = 'Ladies First';
				move.category = 'Special';
				move.type = 'Fairy';
				move.basePower = 120;
				move.accuracy = 100;
				move.self = {boosts: {spe:1}};
				move.onHit = function (target, pokemon) {
					let decision = this.willMove(pokemon);
					if (decision && target.gender === 'F') {
						this.cancelMove(pokemon);
						this.queue.unshift(decision);
						this.add('-activate', pokemon, 'move: Ladies First');
					}
				};
			}
			if (move.id === 'allyswitch' && name === 'slayer95') {
				move.name = 'Spell Steal';
				move.target = 'self';
				move.onTryHit = function (target, source) {
					if (!source.illusion) {
						this.add('-fail', source);
						this.add('-hint', "Spell Steal only works behind an Illusion!");
						return null;
					}
				};
				move.onHit = function (target, source) {
					let lastMove = source.illusion.moveset[source.illusion.moves.length - 1];
					this.useMove(lastMove.id, source);
				};
			}
			if (move.id === 'kingsshield' && name === 'sweep') {
				move.name = "Sweep's Shield";
				move.onHit = function (pokemon) {
					pokemon.setAbility('swiftswim');
					pokemon.addVolatile('stall');
				};
			}
			if (move.id === 'superfang' && name === 'vacate') {
				move.name = 'Duper Fang';
				move.basePower = 105;
				delete move.damageCallback;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Super Fang", target);
				};
				move.onHit = function (pokemon) {
					if (this.random(100) < 95) {
						pokemon.trySetStatus('par');
					} else {
						pokemon.addVolatile('confusion');
					}
				};
			}
			if (move.id === 'bravebird' && name === 'verbatim') {
				move.name = 'Glass Cannon';
				move.basePower = 170;
				move.accuracy = 80;
				move.recoil = [1, 4];
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "High Jump Kick", target);
				};
				move.onHit = function (pokemon) {
					this.add('c|&verbatim|DEFENESTRATION!');
					if (this.random(20) === 1) pokemon.switchFlag = true;
				};
				move.onMoveFail = function (target, source, move) {
					this.damage(source.maxhp / 2, source, source, 'glasscannon');
				};
			}

			// Mod signature moves.
			if (move.id === 'worryseed' && name === 'acedia') {
				move.name = 'Procrastination';
				move.onHit = function (pokemon, source) {
					let oldAbility = pokemon.setAbility('slowstart');
					if (oldAbility) {
						this.add('-ability', pokemon, 'Slow Start', '[from] move: Procrastination');
						if (this.random(100) < 10) source.faint();
						return;
					}
					return false;
				};
			}
			if (move.id === 'pursuit' && name === 'am') {
				move.name = 'Predator';
				move.basePowerCallback = function (pokemon, target) {
					if (target.beingCalledBack) return 120;
					return 60;
				};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Pursuit", target);
				};
				move.boosts = {atk:-1, spa:-1, accuracy:-2};
			}
			if (move.id === 'triattack' && name === 'ascriptmaster') {
				move.name = 'Spectrum Beam';
				move.ignoreImmunity = true;
				move.basePower = 8;
				move.critRatio = 1;
				move.accuracy = 95;
				move.typechart = Object.keys(Tools.data.TypeChart);
				move.hitcount = 0;
				move.type = move.typechart[0];
				move.multihit = move.typechart.length;
				delete move.secondaries;
				move.onPrepareHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Swift", target);
				};
				move.onHit = function (target, source, move) {
					move.hitcount++;
					move.type = move.typechart[move.hitcount];
				};
			}
			if (move.id === 'drainingkiss' && name === 'antemortem') {
				move.name = 'Postmortem';
				move.basePower = 110;
				move.accuracy = 85;
				delete move.drain;
				// Manually activate the ability again.
				if (pokemon.ability === 'sheerforce') {
					delete move.secondaries;
					move.negateSecondary = true;
					pokemon.addVolatile('sheerforce');
				} else {
					move.secondaries = [{chance: 50, self: {boosts: {spa: 1, spe: 1}}}];
				}
			}
			if (move.id === 'futuresight' && name === 'asgdf') {
				move.name = 'Obscure Pun';
				// It's easier onHit since it's a future move.
				// Otherwise, all of onTryHit must be rewritten here to add the drop chance.
				move.onHit = function (pokemon) {
					this.add('-message', 'I get it now!');
					if (this.random(100) < 70) {
						this.boost({spa:-1, spd:-1}, pokemon, pokemon, move.sourceEffect);
					}
				};
			}
			if (move.id === 'detect' && name === 'audiosurfer') {
				move.name = 'Audioshield';
				move.secondary = {chance: 50, self: {boosts: {accuracy:-1}}};
				move.onTryHit = function (target) {
					this.add('-anim', target, "Boomburst", target);
					return !!this.willAct() && this.runEvent('StallMove', target);
				};
				move.onHit = function (pokemon) {
					let foe = pokemon.side.foe.active[0];
					if (foe.ability !== 'soundproof') {
						this.add('-message', 'The Audioshield is making a deafening noise!');
						this.damage(foe.maxhp / 12, foe, pokemon);
						if (this.random(2) === 1) this.boost({atk:-1, spa:-1}, foe, foe, 'noise damage');
					}
					pokemon.addVolatile('stall');
				};
			}
			if (move.id === 'bulkup' && name === 'barton') {
				move.name = 'MDMA Huff';
				move.boosts = {atk:2, spe:1, accuracy:-1};
			}
			if (move.id === 'glare' && name === 'bean') {
				move.name = 'Coin Toss';
				move.accuracy = true;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Pay Day", target);
				};
				move.onHit = function (pokemon) {
					pokemon.addVolatile('confusion');
				};
				move.ignoreImmunity = true;
				move.type = 'Dark';
			}
			if (move.id === 'bugbuzz' && name === 'beowulf') {
				move.name = 'Buzzing of the Swarm';
				move.category = 'Physical';
				move.basePower = 100;
				move.secondaries = [{chance:10, volatileStatus: 'flinch'}];
			}
			if (move.id === 'dragontail' && name === 'biggie') {
				move.name = 'Food Rush';
				move.basePower = 100;
				move.type = 'Normal';
				move.self = {boosts: {evasion:-1}};
			}
			if (move.id === 'quickattack' && name === 'birkal') {
				move.name = 'Caw';
				move.type = '???';
				move.category = 'Status';
				move.onHit = function (target) {
					if (!target.setType('Bird')) return false;
					this.add('-start', target, 'typechange', 'Bird');
					this.add('c|%Birkal|caw');
				};
			}
			if (move.id === 'oblivionwing' && name === 'blitzamirin') {
				move.name = 'Pneuma Relinquish';
				move.type = 'Ghost';
				move.damageCallback = function (pokemon, target) {
					return target.hp / 2;
				};
				move.onImmunity = function (type) {
					if (type in {'Normal':1, 'Ghost':1}) return false;
				};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Roar of Time", target);
				};
				move.onHit = function (pokemon) {
					pokemon.addVolatile('gastroacid');
				};
			}
			if (move.id === 'bravebird' && name === 'coolstorybrobat') {
				move.name = 'Brave Bat';
				move.basePower = 130;
				move.critRatio = 2;
				delete move.recoil;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Brave Bird", target);
				};
			}
			if (move.id === 'detect' && name === 'dell') {
				let dmg = Math.ceil(pokemon.maxhp / (pokemon.ability === 'simple' ? 2 : 4));
				move.name = 'Aura Parry';
				move.self = {boosts: {atk:1, spa:1, spe:1}};
				move.onTryHit = function (target, source) {
					if (source.hp <= dmg) return false;
					this.attrLastMove('[still]');
					this.add('-anim', source, "Amnesia", source);
					return !!this.willAct() && this.runEvent('StallMove', target);
				};
				move.onHit = function (target) {
					this.directDamage(dmg, target, target);
					pokemon.addVolatile('parry');
					pokemon.addVolatile('stall');
				};
			}
			if (name === 'eeveegeneral') {
				if (move.id === 'shiftgear') {
					move.name = 'Gears of War';
				}
				if (move.id === 'quickattack') {
					move.name = 'War Crimes';
					move.type = 'Normal';
					move.category = 'Status';
					move.basePower = 0;
					move.onHit = function (pokemon, source) {
						this.directDamage(source.maxhp / 4, source, source);
						pokemon.addVolatile('curse');
						pokemon.addVolatile('confusion');
						this.add("c|@Eevee General|What's a Geneva Convention?");
					};
				}
			}
			if (name === 'electrolyte') {
				if (move.id === 'entrainment') {
					move.name = 'Study';
					move.priority = 1;
					move.flags = {protect:1};
					move.onTryHit = function (target, source) {
						if (source.lastAttackType === 'None') {
							this.add('-hint', "Study only works when preceded by an attacking move.");
							return false;
						}
					};
					move.onHit = function (target, source) {
						let possibleTypes = [];
						let attackType = source.lastAttackType;
						source.lastAttackType = 'None';
						for (let type in this.data.TypeChart) {
							if (target.hasType(type)) continue;
							let typeCheck = this.data.TypeChart[type].damageTaken[attackType];
							if (typeCheck === 1) {
								possibleTypes.push(type);
							}
						}
						if (!possibleTypes.length) {
							return false;
						}
						let targetType = possibleTypes[this.random(possibleTypes.length)];
						if (!target.setType(targetType)) {
							return false;
						}
						this.add('c|@Electrolyte|Ha! I\'ve found your weakness.');
						this.add('-start', target, 'typechange', targetType);
					};
				} else {
					pokemon.lastAttackType = move.type;
				}
			}
			if (move.id === 'fakeout' && name === 'enguarde') {
				move.name = 'Ready Stance';
				move.type = 'Steel';
				move.secondaries = [{chance:100, boosts:{atk:-1, spa:-1}, volatileStatus: 'flinch'}];
				move.onTryHit = function (target, source) {
					if (source.activeTurns > 1) {
						this.add('-hint', "Ready Stance only works on your first turn out.");
						return false;
					}
				};
				move.onHit = function (target, source) {
					source.addVolatile('focusenergy');
					this.add('c|@Enguarde|En garde!'); // teehee
				};
			}
			if (move.id === 'shadowball' && name === 'eos') {
				move.name = 'Shadow Curse';
				move.power = 60;
				move.priority = 1;
				move.volatileStatus = 'curse';
				move.onHit = function (target, source) {
					this.directDamage(source.maxhp / 2, source, source);
				};
			}
			if (move.id === 'roleplay' && name === 'formerhope') {
				move.volatileStatus = 'taunt';
				move.self = {boosts: {spa:1}};
				move.onTryHit = function (target, source) {
					this.add('c|@Former Hope|/me godmodes');
				};
				move.onHit = function () {};
			}
			if (move.id === 'geargrind' && name === 'genesect') {
				move.name = "Grind you're mum";
				move.basePower = 30;
				move.onHit = function (target, pokemon) {
					if (target.fainted || target.hp <= 0) this.boost({atk:2, spa:2, spe:1}, pokemon, pokemon, move);
				};
			}
			if (move.id === 'partingshot' && name === 'hippopotas') {
				move.name = 'Hazard Pass';
				delete move.boosts;
				move.onHit = function (pokemon) {
					let hazards = ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb'].randomize();
					pokemon.side.addSideCondition(hazards[0]);
					pokemon.side.addSideCondition(hazards[1]);
				};
			}
			if (move.id === 'hydrocannon' && name === 'hydroimpact') {
				move.name = 'HYDRO IMPACT';
				move.basePower = 150;
				move.accuracy = 90;
				move.category = 'Physical';
				move.status = 'brn';
				delete move.self;
				move.onHit = function (target, source) {
					this.directDamage(source.maxhp * 0.35, source, source);
				};
			}
			if (move.id === 'splash' && name === 'innovamania') {
				move.name = 'Rage Quit';
				delete move.onTryHit;
				move.onHit = function (pokemon) {
					pokemon.faint();
				};
			}
			if (move.id === 'crunch' && name === 'jas61292') {
				move.name = 'Minus One';
				move.basePower = 110;
				move.accuracy = 85;
				delete move.secondary;
				delete move.secondaries;
				move.onHit = function (pokemon, source) {
					let boosts = {};
					let stats = Object.keys(pokemon.stats).slice(1);
					boosts[stats[this.random(4)]] = -1;
					this.boost(boosts, pokemon, source);
				};
			}
			if (move.id === 'rapidspin' && name === 'jinofthegale') {
				move.name = 'Beyblade';
				move.category = 'Special';
				move.type = 'Electric';
				move.basePower = 90;
				// If we use onHit but use source, we don't have to edit self.onHit.
				move.onHit = function (pokemon, source) {
					let side = source.side;
					for (let i = 0; i < side.pokemon.length; i++) {
						side.pokemon[i].status = '';
					}
					this.add('-cureteam', source, '[from] move: Beyblade');
				};
			}
			if (move.id === 'refresh' && name === 'kostitsynkun') {
				move.name = 'Kawaii-desu uguu~';
				move.heal = [1, 2];
				move.flags = {heal: 1};
				move.onHit = function (target, source) {
					this.add('-curestatus', source, source.status);
					source.status = '';
					source.removeVolatile('confusion');
					source.removeVolatile('curse');
					source.removeVolatile('attract');
					if (this.random(7) === 1) {
						pokemon.side.foe.active[0].addVolatile('attract');
					}
				};
			}
			if (move.id === 'transform' && name === 'kupo') {
				move.name = 'Kupo Nuts';
				move.flags = {};
				move.priority = 2;
				move.onHit = function (pokemon, user) {
					let template = pokemon.template;
					if (pokemon.fainted || pokemon.illusion) {
						return false;
					}
					if (!template.abilities || (pokemon && pokemon.transformed) || (user && user.transformed)) {
						return false;
					}
					if (!user.formeChange(template, true)) {
						return false;
					}
					user.transformed = true;
					user.types = pokemon.types;
					user.addedType = pokemon.addedType;
					for (let statName in user.stats) {
						user.stats[statName] = pokemon.stats[statName];
					}
					user.moveset = [];
					user.moves = [];
					for (let i = 0; i < pokemon.moveset.length; i++) {
						let move = this.getMove(user.set.moves[i]);
						let moveData = pokemon.moveset[i];
						let moveName = moveData.move;
						if (moveData.id === 'hiddenpower') {
							moveName = 'Hidden Power ' + user.hpType;
						}
						user.moveset.push({
							move: moveName,
							id: moveData.id,
							pp: move.noPPBoosts ? moveData.maxpp : 5,
							maxpp: move.noPPBoosts ? moveData.maxpp : 5,
							target: moveData.target,
							disabled: false,
						});
						user.moves.push(toId(moveName));
					}
					for (let j in pokemon.boosts) {
						user.boosts[j] = pokemon.boosts[j];
					}
					this.add('-transform', user, pokemon);
					user.setAbility(pokemon.ability);
					user.originalName = user.name;
					user.name = pokemon.name;
				};
			}
			if (move.id === 'gust' && name === 'lawrenceiii') {
				move.name = 'Shadow Storm';
				move.type = '???'; // Shadow
				move.accuracy = true;
				move.ignoreDefensive = true;
				move.defensiveCategory = 'Physical';
				move.basePowerCallback = function (pokemon, target) {
					if (target.volatiles['partiallytrapped']) return 65;
					return 35;
				};
				move.onEffectiveness = function (typeMod, target, type, move) {
					let eff = 1;
					if (toId(pokemon.side.foe.active[0].name) === 'lawrenceiii') eff = -1;
					return eff; // Shadow moves are SE against all non-Shadow mons.
				};
				move.onHit = function (target, source) {
					if (target.volatiles['partiallytrapped'] && (this.random(100) < 35)) {
						target.addVolatile('confusion');
					}
				};
			}
			if (move.id === 'shellsmash' && name === 'legitimateusername') {
				move.name = 'Shell Fortress';
				move.boosts = {def:2, spd:2, atk:-4, spa:-4, spe:-4};
			}
			if (move.id === 'trumpcard' && name === 'level51') {
				move.name = 'Next Level Strats';
				delete move.basePowerCallback;
				move.target = 'self';
				move.category = 'Status';
				move.onTryHit = function (pokemon) {
					if (pokemon.level >= 200) return false;
				};
				move.onHit = function (pokemon) {
					pokemon.level += 9;
					if (pokemon.level > 200) pokemon.level = 200;
					this.add('-message', 'Level 51 advanced 9 levels! It is now level ' + pokemon.level + '!');
				};
			}
			if (move.id === 'thundershock' && name === 'lyto') {
				move.name = 'Gravity Storm';
				move.basePower = 100;
				move.accuracy = 100;
				delete move.secondary;
				delete move.secondaries;
				move.self = {volatileStatus: 'magnetrise'};
			}
			if (move.id === 'protect' && name === 'layell') {
				move.name = 'Pixel Protection';
				move.self = {boosts: {def:3, spd:2}};
				move.onTryHit = function (pokemon) {
					if (pokemon.volatiles['pixels']) {
						this.add('-hint', "Pixel Protection only works once per outing.");
						return false;
					}
					this.attrLastMove('[still]');
					this.add('-anim', pokemon, "Moonblast", pokemon);
					return !!this.willAct() && this.runEvent('StallMove', pokemon);
				};
				move.onHit = function (pokemon) {
					if (pokemon.volatiles['pixels']) return false;
					pokemon.addVolatile('pixels');
					pokemon.addVolatile('stall');
				};
			}
			if (move.id === 'sacredfire' && name === 'marty') {
				move.name = 'Immolate';
				move.basePower += 20;
				move.category = 'Special';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Flamethrower", target);
				};
			}
			if (move.id === 'spikes' && name === 'morfent') {
				move.name = 'Used Needles';
				move.self = {boosts: {evasion: -1}};
				move.target = 'normal';
				move.onTryHit = function (target, source) {
					source.addVolatile('needles');
				};
			}
			if (name === 'naniman') {
				if (move.id === 'fireblast') {
					move.name = 'Tanned';
					move.accuracy = 100;
					move.secondaries = [{status:'brn', chance:100}];
					move.onTryHit = function (target, source, move) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Eruption", target);
					};
					move.onHit = function (target, source) {
						this.boost({atk:1, spa:1, evasion:-1, accuracy:-1}, source, source);
					};
				} else if (move.id === 'topsyturvy') {
					move.name = 'rof';
				}
			}
			if (move.id === 'inferno' && name === 'nixhex') {
				move.name = 'Beautiful Disaster';
				move.type = 'Normal';
				move.secondaries = [{
					chance:100,
					onHit: function (target, source) {
						let result = this.random(2);
						if (result < 1) {
							target.trySetStatus('brn', source);
						} else {
							target.trySetStatus('par', source);
						}
					},
				}];
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Simple Beam", target);
				};
			}
			if (move.id === 'hypnosis' && name === 'osiris') {
				move.name = 'Restless Sleep';
				move.accuracy = 85;
				move.volatileStatus = 'nightmare';
			}
			if (move.id === 'whirlpool' && name === 'phil') {
				move.name = 'Slug Attack';
				move.basePower = 50;
				move.secondaries = [{chance:100, status:'tox'}];
			}
			if (move.id === 'meditate' && name === 'qtrx') {
				move.name = 'KEYBOARD SMASH';
				move.target = 'normal';
				move.boosts = null;
				move.hitcount = [3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 7][this.random(11)];
				move.onPrepareHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Fairy Lock", target);
					this.add('-anim', pokemon, "Fairy Lock", pokemon); // DRAMATIC FLASHING
				};
				move.onHit = function (target, source) {
					let gibberish = '';
					let hits = 0;
					let hps = ['hiddenpowerbug', 'hiddenpowerdark', 'hiddenpowerdragon', 'hiddenpowerelectric', 'hiddenpowerfighting', 'hiddenpowerfire', 'hiddenpowerflying', 'hiddenpowerghost', 'hiddenpowergrass', 'hiddenpowerground', 'hiddenpowerice', 'hiddenpowerpoison', 'hiddenpowerpsychic', 'hiddenpowerrock', 'hiddenpowersteel', 'hiddenpowerwater'];
					this.add('c|@qtrx|/me slams face into keyboard!');
					source.isDuringAttack = true; // Prevents the user from being kicked out in the middle of using Hidden Powers.
					for (let i = 0; i < move.hitcount; i++) {
						if (target.hp !== 0) {
							let len = 16 + this.random(35);
							gibberish = '';
							for (let j = 0; j < len; j++) gibberish += String.fromCharCode(48 + this.random(79));
							this.add('-message', gibberish);
							this.useMove(hps[this.random(16)], source, target);
							hits++;
						}
					}
					this.add('-message', 'Hit ' + hits + ' times!');
					source.isDuringAttack = false;
				};
			}
			if (move.id === 'leer' && name === 'queez') {
				move.name = 'Sneeze';
				delete move.boosts;
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Curse", target);
				};
				move.onHit = function (target, source) {
					if (!target.volatiles.curse) {
						this.boost({atk:1, def:1, spa:1, spd:1, spe:1, accuracy:1}, source, source);
						target.addVolatile('curse');
					} else {
						this.boost({atk: 1}, source, source);
						this.boost({def: -1}, target, source);
						this.useMove('explosion', source, target);
					}
				};
			}
			if (move.id === 'headcharge' && name === 'rekeri') {
				move.name = 'Land Before Time';
				move.basePower = 125;
				move.type = 'Rock';
				move.accuracy = 90;
				move.secondaries = [{chance:10, volatileStatus:'flinch'}];
			}
			if (move.id === 'stockpile' && name === 'relados') {
				move.name = 'Loyalty';
				move.type = 'Fire';
				move.priority = 1;
				delete move.volatileStatus;
				move.onTryHit = function () {
					return true;
				};
				move.onHit = function (target, source) {
					if (!source.volatiles['stockpile'] || (source.volatiles['stockpile'].layers < 3)) {
						source.addVolatile('stockpile');
						this.add("raw|<div class=\"broadcast-blue\"><b>Relados received a loyalty point!</b></div>");
					} else {
						source.removeVolatile('stockpile');
						this.add("raw|<div class=\"broadcast-red\"><b>Relados was rewarded for his loyalty!</b><br />Relados has advanced one level.</div>");
						source.level++;
						source.formeChange('Terrakion');
						source.details = source.species + (source.level === 99 ? '' : ', L' + source.level + 1);
						this.add('detailschange', source, source.details);
						this.heal(source.maxhp, source, source);
					}
					this.add('-clearallboost');
					for (let i = 0; i < this.sides.length; i++) {
						if (this.sides[i].active[0]) this.sides[i].active[0].clearBoosts();
					}
				};
			}
			if (move.id === 'eggbomb' && name === 'reverb') {
				move.name = 'fat monkey';
				move.accuracy = 95;
				move.flags = {contact: 1, protect: 1};
				move.self = {boosts: {def:-1, spe:-1}};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Brave Bird", target);
				};
				move.onHit = function (target, source) {
					this.heal(120, source, source);
				};
				move.onMoveFail = function (target, source, move) {
					this.directDamage(120, source, source);
				};
			}
			if (move.id === 'frenzyplant' && name === 'rosiethevenusaur') {
				move.name = 'Swag Plant';
				move.volatileStatus = 'confusion';
				move.self = {boosts: {atk:1, def:1}};
			}
			if (move.id === 'icebeam' && name === 'scalarmotion') {
				move.name = 'Eroding Frost';
				move.basePower = 65;
				move.onEffectiveness = function (typeMod, type) {
					if (type in {'Fire':1, 'Water': 1}) return 1;
				};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Blizzard", target);
				};
			}
			if (move.id === 'boomburst' && name === 'scotteh') {
				move.name = 'Geomagnetic Storm';
				move.type = 'Electric';
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Discharge", target);
				};
			}
			if (move.id === 'healingwish' && name === 'shamethat') {
				move.name = 'Extreme Compromise';
			}
			if (move.id === 'judgment' && name === 'shrang') {
				move.name = 'Pixilate';
			}
			if (move.id === 'storedpower' && name === 'skitty') {
				move.name = 'Ultimate Dismissal';
				move.type = 'Fairy';
				move.onDamage = function (damage, target, source, effect) {
					if (damage > 0) {
						this.heal(Math.ceil((damage * 0.25) * 100 / target.maxhp), source, source);
					}
				};
			}
			if (move.id === 'thousandarrows' && name === 'snowflakes') {
				move.name = 'Azalea Butt Slam';
				move.category = 'Special';
				move.onHit = function (target, source, move) {
					target.addVolatile('trapped', source, move, 'trapper');
				};
			}
			if (move.id === 'waterpulse' && name === 'spydreigon') {
				move.name = 'Mineral Pulse';
				move.basePower = 95;
				move.type = 'Steel';
				move.accuracy = 100;
			}
			if (name === 'steamroll') {
				if (move.id === 'protect') {
					move.name = 'Conflagration';
					move.onTryHit = function (pokemon) {
						if (pokemon.activeTurns > 1) {
							this.add('-hint', "Conflagration only works on your first turn out.");
							return false;
						}
						this.attrLastMove('[still]');
						this.add('-anim', pokemon, "Fire Blast", pokemon);
					};
					move.self = {boosts: {atk:2, def:2, spa:2, spd:2, spe:2}};
				}
				move.onHit = function (target, pokemon) {
					if (target.fainted || target.hp <= 0) pokemon.killedSome = 1;
				};
			}
			if (move.id === 'tailglow' && name === 'steeledges') {
				delete move.boosts;
				move.name = 'True Daily Double';
				move.target = 'normal';
				move.onTryHit = function (target, source) {
					if (source.volatiles['truedailydouble']) return false;
					this.attrLastMove('[still]');
					this.add('-anim', source, "Nasty Plot", target);
				};
				move.onHit = function (target, source) {
					if (this.random(2)) {
						this.add('-message', '@SteelEdges failed misserably!');
						this.boost({spa: -2}, source, source);
					} else {
						this.add('-message', '@SteelEdges is the winner!');
						this.boost({spa: 4}, source, source);
					}
					source.addVolatile('truedailydouble');
				};
			}
			if (move.id === 'shadowsneak' && name === 'temporaryanonymous') {
				move.name = 'SPOOPY EDGE CUT';
				move.basePower = 90;
				move.accuracy = 100;
				move.self = {boosts: {evasion:-1}};
				move.onTryHit = function (target, source) {
					this.add('-message', '*@Temporaryanonymous teleports behind you*');
					this.attrLastMove('[still]');
					this.add('-anim', source, "Shadow Force", target);
				};
				move.onHit = function (pokemon) {
					if (pokemon.hp <= 0 || pokemon.fainted) {
						this.add('c|@Temporaryanonymous|YOU ARE ALREADY DEAD *unsheathes glorious cursed nippon steel katana and cuts you in half with it* heh......nothing personnel.........kid......................');
					}
				};
				move.onMoveFail = function (target, source, move) {
					this.add('-message', '*@Temporaryanonymous teleports behind you*');
					this.add('c|@Temporaryanonymous|YOU ARE ALREADY DEAD *misses* Tch......not bad.........kid......................');
				};
			}
			if (name === 'test2017') {
				if (move.id === 'karatechop') {
					move.name = 'Ducktastic';
					move.basePower = 100;
					move.accuracy = 100;
					move.type = 'Normal';
				}
				if (move.id === 'roost') {
					move.onHit = function (pokemon) {
						pokemon.trySetStatus('tox');
					};
				}
			}
			if (move.id === 'drainpunch' && name === 'tfc') {
				move.name = 'Chat Flood';
				move.basePower = 150;
				move.type = 'Water';
				move.category = 'Special';
				move.self = {boosts: {spa:-1, spd:-1, def:-1}};
			}
			if (move.id === 'return' && name === 'tgmd') {
				delete move.basePowerCallback;
				move.name = 'Canine Carnage';
				move.basePower = 120;
				move.secondaries = [{chance:10, volatileStatus:'flinch'}, {chance:100, boosts:{def:-1}}];
				move.accuracy = 90;
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Close Combat", target);
				};
			}
			if (move.id === 'rockthrow' && name === 'timbuktu') {
				move.name = 'Geoblast';
				move.type = 'Fire';	// Not the other way round or STAB would be lost.
				move.category = 'Special';
				move.accuracy = true;
				move.basePowerCallback = function (source, target) {
					return (40 * Math.pow(2, source.timesGeoblastUsed));
				};
				move.onEffectiveness = function (typeMod, type, move) {
					return typeMod + this.getEffectiveness('Rock', type);
				};
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Fire Blast", source);
					this.add('-anim', source, "Power Gem", target);
				};
				move.onHit = function (target, source) {
					source.timesGeoblastUsed++;
				};
			}
			if (move.id === 'naturepower' && name === 'trickster') {
				move.name = 'Cometstorm';
				move.category = 'Special';
				move.type = 'Fairy';
				move.basePower = 80;
				move.secondaries = [{chance:30, status:'brn'}, {chance:30, status:'frz'}];
				move.onEffectiveness = function (typeMod, type, move) {
					return typeMod + this.getEffectiveness('Ice', type);
				};
				move.self = {boosts: {accuracy:-1}};
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Simple Beam", target);
				};
				delete move.onHit;
			}
			if (move.id === 'explosion' && name === 'trinitrotoluene') {
				move.name = 'Get Haxed';
				move.basePower = 250;
				move.onTryHit = function (target, source) {
					this.boost({def: -1}, target, source);
				};
				move.onHit = function (pokemon) {
					pokemon.side.addSideCondition('spikes');
					this.add('-message', 'Debris was scattered on ' + pokemon.name + "'s side!");
				};
			}
			if (move.id === 'waterfall' && name === 'waterbomb') {
				move.name = 'Water Bomb';
				move.basePowerCallback = function (pokemon, target) {
					if (this.effectiveWeather() === 'raindance' || this.effectiveWeather() === 'primordialsea') return 93;
					if (this.effectiveWeather() === 'sunnyday' || this.effectiveWeather() === 'desolateland') return 210;
					return 140;
				};
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Seismic Toss", target);
				};
				move.accuracy = true;
				move.ignoreImmunity = true;
				move.ignoreDefensive = true;
				move.ignoreEvasion = true;
				move.ignoreAbility = true;
			}
			if (move.id === 'metronome' && name === 'xfix') {
				if (pokemon.moveset[3] && pokemon.moveset[3].pp) {
					pokemon.moveset[3].pp = Math.round(pokemon.moveset[3].pp * 10 + 6) / 10;
				}
				move.name = '(Super Glitch)';
				move.multihit = [2, 5];
				move.onTryHit = function (target, source) {
					if (!source.isActive) return null;
					if (this.random(777) !== 42) return;
					let opponent = pokemon.side.foe.active[0];
					opponent.setStatus('brn');
					let possibleStatuses = ['confusion', 'flinch', 'attract', 'focusenergy', 'foresight', 'healblock'];
					for (let i = 0; i < possibleStatuses.length; i++) {
						if (this.random(3) === 1) {
							opponent.addVolatile(possibleStatuses[i]);
						}
					}

					function generateNoise() {
						let noise = '';
						let random = this.random(40, 81);
						for (let i = 0; i < random; i++) {
							if (this.random(4) !== 0) {
								// Non-breaking space
								noise += '\u00A0';
							} else {
								noise += String.fromCharCode(this.random(0xA0, 0x3040));
							}
						}
						return noise;
					}
					this.add('-message', "(Enemy " + generateNoise.call(this) + " TMTRAINER " + opponent.name + " is frozen solid?)");
					this.add('-message', "(Enemy " + generateNoise.call(this) + " TMTRAINER " + opponent.name + " is hurt by its burn!)");
					this.damage(opponent.maxhp * this.random(42, 96) * 0.01, opponent, opponent);
					let exclamation = source.status === 'brn' ? '!' : '?';
					this.add('-message', "(Enemy " + generateNoise.call(this) + " TMTRAINER @xfix is hurt by its burn" + exclamation + ")");
					this.damage(source.maxhp * this.random(24, 48) * 0.01, source, source);
					return null;
				};
			}
			if (move.id === 'detect' && name === 'zebraiken') {
				move.name = 'bzzt';
				move.self = {boosts: {spa:1, atk:1}};
			}
			if (move.id === 'wish' && name === 'zdrup') {
				move.name = 'Premonition';
				move.flags = {};
				move.sideCondition = 'mist';
				move.onTryHit = function (pokemon) {
					if (pokemon.side.premonTimer) {
						this.add('-hint', 'Premonition\'s effect is already underway!');
						return false;
					}
				};
				move.onHit = function (pokemon) {
					pokemon.side.premonTimer = 1;
				};
			}

			// Driver signature moves.
			if (move.id === 'thunder' && name === 'aelita') {
				move.name = 'Energy Field';
				move.accuracy = 100;
				move.basePower = 150;
				move.secondaries = [{chance:40, status:'par'}];
				move.self = {boosts:{spa:-1, spd:-1, spe:-1}};
			}
			if (move.id === 'psychoboost' && name === 'arcticblast') {
				move.name = 'Doubles Purism';
				delete move.self;
				move.onHit = function (target, source) {
					if (source.hp) {
						let hasRemovedHazards = false;
						let sideConditions = {'spikes': 1, 'toxicspikes': 1, 'stealthrock': 1, 'stickyweb': 1};
						for (let i in sideConditions) {
							if (target.side.removeSideCondition(i)) {
								hasRemovedHazards = true;
								this.add('-sideend', target.side, this.getEffect(i).name, '[from] move: Doubles Purism', '[of] ' + source);
							}
							if (source.side.removeSideCondition(i)) {
								hasRemovedHazards = true;
								this.add('-sideend', source.side, this.getEffect(i).name, '[from] move: Doubles Purism', '[of] ' + source);
							}
						}
						if (hasRemovedHazards) this.add('c|%Arcticblast|HAZARDS ARE TERRIBLE IN DOUBLES');
					}
				};
			}
			if (move.id === 'whirlwind' && name === 'articuno') {
				move.name = 'True Support';
				move.self = {boosts: {def:1, spd:1}};
				move.onHit = function (target, source) {
					this.useMove('substitute', target, target);
				};
			}
			if (move.id === 'toxic' && name === 'asty') {
				move.name = 'Amphibian Toxin';
				move.accuracy = 100;
				move.self = {boosts:{atk:-1, spa:-1}};
				move.boosts = {atk:-1, spa:-1};
				move.onHit = function (target, source) {
					target.side.addSideCondition('toxicspikes');
					target.side.addSideCondition('toxicspikes');
				};
			}
			if (move.id === 'psywave' && name === 'astara') {
				move.name = 'Star Bolt Desperation';
				move.type = ['???', 'Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water'][this.random(19)];
				move.damageCallback = function (pokemon) {
					return pokemon.hp * 7 / 8;
				};
				move.onHit = function (target, source) {
					if (this.random(2) === 1) target.addVolatile('confusion');
					let status = ['par', 'brn', 'frz', 'psn', 'tox', 'slp'][this.random(6)];
					if (this.random(2) === 1) target.trySetStatus(status);
					let boosts = {};
					let increase = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy'][this.random(6)];
					let decrease = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy'][this.random(6)];
					boosts[increase] = 1;
					boosts[decrease] = -1;
					this.boost(boosts, source, source);
				};
			}
			if (move.id === 'spikecannon' && name === 'bloobblob') {
				// I fear that having two moves with id 'bulletseed' would mess with PP.
				move.name = 'Lava Whip';
				move.type = 'Fire';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Tail Slap", target);
				};
			}
			if (move.id === 'hypervoice' && name === 'bumbadadabum') {
				move.name = 'Open Source Software';
				move.type = 'Electric';
				move.basePower = 110;
				move.accuracy = 95;
				move.secondaries = [{chance:20, self:{boosts:{spa:-1}}, volatileStatus:'disable'}];
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Dark Void", target);
				};
				move.onHit = function () {
					this.add('c|%Bumbadadabum|I\'d just like to interject for a moment. What you\'re referring to as Linux, is in fact, GNU/Linux, or as I\'ve recently taken to calling it, GNU plus Linux. Linux is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX.');
				};
			}
			if (move.id === 'swagger' && name === 'charlescarmichael') {
				move.name = 'Bad Pun';
				move.onHit = function (pokemon) {
					pokemon.addVolatile('taunt');
				};
			}
			if (move.id === 'protect' && name === 'crestfall') {
				move.name = 'Final Hour';
				move.onTryHit = function (pokemon) {
					if (pokemon.activeTurns > 1) {
						this.add('-hint', "Final Hour only works on your first turn out.");
						return false;
					}
					this.attrLastMove('[still]');
					this.add('-anim', pokemon, "Dark Pulse", pokemon);
				};
				move.onHit = function () {
					this.add('c|%Crestfall|' + ['The die is cast...', 'Time for reckoning.'][this.random(2)]);
				};
				move.self = {boosts: {spe:2, evasion:1, def:-2, spd:-2}};
			}
			if (move.id === 'dragonrush' && name === 'dtc') {
				move.name = 'Dragon Smash';
				move.basePower = 150;
				move.recoil = [1, 2];
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Head Charge", target);
				};
			}
			if (name === 'feliburn') {
				if (move.id === 'firepunch') {
					move.name = 'Falcon Punch';
					move.basePower = 150;
					move.accuracy = 85;
					move.self = {boosts: {atk:-1, def:-1, spd:-1}};
					move.onTryHit = function (target, source) {
						this.add('c|%Feliburn|FAALCOOOOOOON');
						this.attrLastMove('[still]');
						this.add('-anim', source, "Fire Punch", target);
					};
					move.onHit = function () {
						this.add('c|%Feliburn|PUUUUUNCH!!');
					};
				}
				if (move.id === 'taunt') {
					move.onHit = function () {
						this.add('c|%Feliburn|Show me your moves!');
					};
				}
			}
			if (move.id === 'highjumpkick' && name === 'galbia') {
				move.name = 'Kibitz';
				move.basePower = 110;
				move.accuracy = 100;
				delete move.onMoveFail;
				move.onHit = function (target, source) {
					let result = this.random(100);
					let chance = source.hasAbility('serenegrace') ? 60 : 30;
					// If the result is less than 60 or 30, then Kibitz will flinch the target.
					if (this.willMove(target) && result < chance) {
						target.addVolatile('flinch');
					} else if (target.hp !== 0 && !target.newlySwitched) {
						this.damage(source.maxhp / 3, source, source, 'Kibitz');
					}
				};
			}
			if (move.id === 'psychup' && name === 'hugendugen') {
				move.name = 'Policy Decision';
				move.onHit = function (target, source) {
					let targetBoosts = {};
					let targetDeboosts = {};
					for (let i in target.boosts) {
						targetBoosts[i] = target.boosts[i];
						targetDeboosts[i] = -target.boosts[i];
					}
					source.setBoost(targetBoosts);
					target.setBoost(targetDeboosts);
					this.add('-copyboost', source, target, '[from] move: Policy Decision');
					this.add('-invertboost', target, '[from] move: Policy Decision');
				};
			}
			if (move.id === 'surf' && name === 'jellicent') {
				move.name = 'Shot For Shot';
				move.basePower = 80;
				move.volatileStatus = 'confusion';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Teeter Dance", target);
				};
			}
			if (move.id === 'vinewhip' && name === 'kayo') {
				move.name = 'Beard of Zeus Bomb';
				move.type = 'Steel';
				move.basePower = 90;
				move.secondaries = [{
					chance:50,
					self:{boosts:{atk:1, spd:1}},
					onHit: function (target, source) {
						if (target.gender === 'F') {
							target.addVolatile('attract');
						} else if (target.gender === 'M') {
							target.addVolatile('confusion');
						} else {
							target.trySetStatus('brn');
						}
					},
				}];
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Leaf Storm", target);
				};
			}
			if (move.id === 'blazekick' && name === 'ljdarkrai') {
				move.name = 'Blaze Blade';
				move.accuracy = 100;
				move.basePower = 90;
				move.critRatio = 2;
			}
			if (move.id === 'bulletpunch' && name === 'majorbling') {
				move.name = 'Focus Laser';
				move.type = 'Electric';
				move.category = 'Status';
				move.basePower = 0;
				move.self = {volatileStatus:'torment'};
				move.onTryHit = function (target, source) {
					if (pokemon.activeTurns > 1) {
						this.add('-hint', "Focus Laser only works on your first turn out.");
						return false;
					}
				};
				move.onPrepareHit = function (source, target, move) {
					if (pokemon.activeTurns > 1) {
						return;
					}
					this.add('-message', "%Majorbling's power level is increasing! It's over nine thousand!");
					target.addVolatile('focuspunch');
					this.boost({spa:2, atk:2, spe:2}, target, target);
				};
				move.onHit = function (target, source) {
					this.useMove('discharge', source, target);
					source.removeVolatile('focuspunch');
				};
			}
			if (move.id === 'scald' && name === 'raseri') {
				move.name = 'Ban Scald';
				move.basePower = 150;
				delete move.secondary;
				delete move.secondaries;
				move.status = 'brn';
			}
			if (move.id === 'spikes' && name === 'quotecs') {
				move.name = 'Diversify';
				move.self = {boosts: {atk:1, spd:1}};
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Eruption", source);
				};
			}
			if (move.id === 'bulletpunch' && name === 'uselesstrainer') {
				move.name = 'Ranting';
				move.type = 'Bug';
				move.basePower = 40;
				move.multihit = [2, 5];
				move.self = {volatileStatus: 'mustrecharge'};
				move.accuracy = 95;
			}

			// Voices signature moves.
			if (move.id === 'superpower' && name === 'aldaron') {
				move.name = 'Admin Decision';
				move.basePower = 80;
				move.self = {boosts: {def:1, spd:1, spe:-2}};
				move.onEffectiveness = function () {
					return 1;
				};
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Simple Beam", target);
				};
			}
			if (move.id === 'partingshot' && name === 'bmelts') {
				move.name = "Aaaannnd... he's gone";
				move.type = 'Ice';
				move.category = 'Special';
				move.basePower = 80;
				delete move.boosts;
			}
			if (name === 'cathy') {
				if (move.id === 'kingsshield') {
					move.name = 'Heavy Dosage of Fun';
				}
				if (move.id === 'calmmind') {
					move.name = 'Surplus of Humour';
					move.self = {boosts: {spa:1, atk:1}};
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', target, "Geomancy", target);
					};
				}
				if (move.id === 'shadowsneak') {
					move.name = 'Patent Hilarity';
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Shadow Sneak", target);
					};
				}
				if (move.id === 'shadowball') {
					move.name = 'Ion Ray of Fun';
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Simple Beam", target);
					};
				}
				if (move.id === 'shadowclaw') {
					move.name = 'Sword of Fun';
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Sacred Sword", target);
					};
				}
				if (move.id === 'flashcannon') {
					move.name = 'Fun Cannon';
					move.secondaries = [{chance:60, boosts:{spd:-1}}];
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Hydro Pump", target);
					};
				}
				if (move.id === 'dragontail') {
					move.name = '/kick';
					move.type = 'Steel';
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Karate Chop", target);
					};
				}
				if (move.id === 'hyperbeam') {
					move.name = '/ban';
					move.basePower = 150;
					move.type = 'Ghost';
				}
				if (move.id === 'memento') {
					move.name = 'HP Display Policy';
					move.boosts = {atk: -12, def: -12, spa: -12, spd: -12, spe: -12, accuracy: -12, evasion: -12};
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Explosion", target);
					};
					move.onHit = function (target, source) {
						source.faint();
					};
				}
			}
			if (name === 'diatom') {
				if (move.id === 'healingwish') {
					move.name = 'Be Thankful';
					move.sideCondition = 'luckychant';
					move.onHit = function () {
						pokemon.side.addSideCondition('reflect');
						pokemon.side.addSideCondition('lightscreen');
						pokemon.side.addSideCondition('safeguard');
						pokemon.side.addSideCondition('mist');
						for (let i = 0; i < 6; i++) {
							let thanker = pokemon.side.pokemon[i];
							if (toId(thanker.name) !== name && !thanker.fainted) this.add('c|' + thanker.name + '|Thanks Diatom!');
							pokemon.hasBeenThanked = true;
						}
					};
				}
				if (move.id === 'psywave') {
					move.accuracy = 80;
					move.onMoveFail = function () {
						this.add('c|+Diatom|you should be thankful my psywave doesn\'t always hit');
					};
				}
			}
			if (move.id === 'growl' && name === 'limi') {
				move.name = 'Resilience';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Shadow Ball", target);
				};
				move.onHit = function (target, source) {
					target.trySetStatus('psn');
					source.trySetStatus('psn');
					source.addVolatile('resilience');
					source.addVolatile('aquaring');
				};
			}
			if (move.id === 'toxic' && name === 'mattl') {
				move.name = 'Topology';
				move.self = {status: 'tox'};
			}
			if (move.id === 'swagger' && name === 'mikel') {
				move.accuracy = true;
				move.name = 'Trolling Lobby';
				move.onTryHit = function (pokemon, source) {
					if (source.hp <= Math.floor(source.maxhp * 2 / 3)) return false;
					return;
				};
				move.onHit = function (pokemon, source) {
					pokemon.addVolatile('taunt');
					if (!pokemon.hasType('Grass')) pokemon.addVolatile('leechseed');
					pokemon.addVolatile('torment');
					this.directDamage(source.maxhp * 2 / 3, source, source);
				};
			}
			if (move.id === 'judgment' && name === 'greatsage') {
				move.type = 'Rock';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Energy Ball", target);
					this.add('c|+Great Sage|JUDGEMENT ' + target.name);
				};
				move.onHit = function (target, source) {
					source.addVolatile('ingrain');
					source.addVolatile('aquaring');
				};
			}
			if (move.id === 'recover' && name === 'redew') {
				move.onHit = function (pokemon) {
					if (pokemon.trySetStatus('tox')) {
						this.add('-message', '+Redew lost at SPL and got badly poisoned due to excessive trolling!');
					}
				};
			}
			if (move.id === 'detect' && name === 'shaymin') {
				move.name = 'Flower Garden';
				move.type = 'Grass';
				move.self = {boosts: {def:1, spa:1, spd:1}};
				move.onTryHit = function (target, source) {
					if (source.volatiles['flowergarden']) return false;
					this.attrLastMove('[still]');
					this.add('-anim', source, "Amnesia", source);
				};
				move.onHit = function (target, source) {
					source.addVolatile('stall');
					source.addVolatile('flowergarden');
				};
			}
			if (move.id === 'energyball' && name === 'somalia') {
				move.name = 'Ban Everyone';
				move.basePower = 0;
				delete move.secondary;
				move.category = 'Status';
				move.accuracy = 50 + 50 * pokemon.hp / pokemon.maxhp;
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Explosion", target);
					source.faint();
				};
				move.onHit = function (target, source) {
					this.add('-anim', target, "Explosion", source);
					target.faint();
					target.side.addSideCondition('stealthrock');
					target.side.addSideCondition('toxicspikes');
				};
				move.onMoveFail = function (target, source, move) {
					source.faint();
				};
			}
			if (move.id === 'taunt' && name === 'talktakestime') {
				move.name = 'Bot Mute';
				move.onHit = function (target) {
					target.addVolatile('embargo');
					target.addVolatile('torment');
					target.addVolatile('healblock');
				};
			}
		},
	},

	// You are (not) prepared, May - June 2015
	// https://github.com/Zarel/Pokemon-Showdown/tree/0bffa43f85b8818e2c1f4c40e6b351a389f8c4c0

	{
		name: "[Seasonal] You are (not) prepared",

		team: 'randomSeasonalMay2015',
		mod: 'seasonal',
		gameType: 'triples',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onBegin: function () {
			this.add('raw|<b><font color="red">IMPORTANT!</font></b> All moves on this seasonal are custom. Use the command <b>/seasonaldata</b>, <b>/sdata</b>, or <b>/sdt</b> to know what they do.');
			this.add('raw|More information can be found <a href="http://www.smogon.com/forums/threads/3491902/page-12#post-6202283">here</a>');
		},
		onModifyMove: function (move) {
			// Shows legit name after use...
			let legitNames = {
				recover: "Cura", softboiled: "Curaga", reflect: "Wild Growth", acupressure: "Power Shield",
				holdhands: "Rejuvenation", luckychant: "Fairy Ward", followme: "Taunt", meditate: "Sacrifice",
				helpinghand: "Cooperation", spite: "Slow Down", aromaticmist: "Healing Touch", healbell: "Penance",
				fakeout: "Stop", endure: "Last Stand", withdraw: "Barkskin", seismictoss: "Punishment",
				flamethrower: "Flamestrike", fireblast: "Conflagration", thunderbolt: "Moonfire", thunder: "Starfire",
				toxic: "Corruption", leechseed: "Soul Leech", icebeam: "Ice Lance", freezeshock: "Frostbite",
				aircutter: "Hurricane", muddywater: "Storm", furyswipes: "Fury", scratch: "Garrote", slash: "Mutilate",
				smog: "Poison Gas", protect: "Evasion", matblock: "Sacred Shield",
			};
			if (move.id in legitNames) {
				move.name = legitNames[move.id];
			}
		},
		onFaint: function (pokemon) {
			let message = {
				'Amy': 'French?', 'Princess Leia': 'Why, you stuck up, half-witted, scruffy-looking Nerf herder.',
				'Scruffy': "Scruffy's gonna die the way he lived. [Turns page of Zero-G Juggs magazine.] Mmhm.",
				'Yoda': 'Wrath leads to the dark side.', 'Bender': 'DEATH TO ALL HUMANS!', 'Gurren Lagann': 'Later, buddy.',
				'Lagann': "Eh, I guess I'm no one.", 'Rei Ayanami': 'Man fears the darkness, and so he scrapes away at the edges of it with fire.',
				'Slurms McKenzie': 'I will keep partying until the end.', 'C3PO': 'Oh, dear!',
				'Hermes': 'I can still... limbo...', 'Professor Farnsworth': 'Bad news, everyone!', 'Kif': 'Sigh.',
				'Jar Jar Binks': "Better dead here than deader in the Core. Ye gods, whatta meesa sayin'?",
				'R2D2': '*beep boop*', 'Asuka Langley': 'Disgusting.', 'Chewy': 'GRARARWOOWRALWRL',
				'Fry': 'Huh. Did everything just taste purple for a second?', 'Han Solo': 'I should have shot first...',
				'Leela': 'Yeeee-hAW!', 'Luke Skywalker': 'I could not use the force...',
				'Nibbler': 'I hereby place an order for one cheese pizza.',
				'Shinji Ikari': 'It would be better if I never existed. I should just die too.', 'Zoidberg': 'Why not Zoidberg?',
				'Anti-Spiral': 'If this is how it must be, protect the universe at all costs.', 'Gendo Ikari': 'Everything goes according to the plan.',
				'Kaworu Nagisa': 'Dying of your own will. That is the one and only absolute freedom there is.',
				'Jabba the Hut': 'Han, ma bukee.', 'Lilith': '...', 'Lrrr': "But I'm emperor of Omicron Persei 8!",
				'Mommy': 'Stupid!', 'Bobba Fett': "I see now I've done terrible things.", 'Zapp Brannigan': "Oh, God, I'm pathetic. Sorry. Just go...",
				'An angel': ',,,', 'Darth Vader': "I'm sorry, son.", 'Emperor Palpatine': 'What the hell is an "Aluminum Falcon"?',
				'Fender': '*beeps*', 'Storm Trooper': 'But my aim is perfect!',
			}[pokemon.name];
			this.add('-message', pokemon.name + ': ' + message);
		},
	},

	// Rainbow Road, August - September 2015
	// https://github.com/Zarel/Pokemon-Showdown/tree/cb7f7e5639b6e98986ea8b687a10e185639551f8
	{
		name: "[Seasonal] Rainbow Road",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],

		team: "randomRainbow",
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onBegin: function () {
			this.add('message', "The last attack on each Pok\u00e9mon is based on their Pok\u00e9dex color.");
			this.add('-message', "Red/Pink beats Yellow/Green, which beats Blue/Purple, which beats Red/Pink.");
			this.add('-message', "Using a color move on a Pok\u00e9mon in the same color group is a neutral hit.");
			this.add('-message', "Use /details [POKEMON] to check its Pok\u00e9dex color.");

			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			let physicalnames = {
				'Red': 'Crimson Crash', 'Pink': 'Rose Rush', 'Yellow': 'Saffron Strike', 'Green': 'Viridian Slash',
				'Blue': 'Blue Bombardment', 'Purple': 'Indigo Impact',
			};
			let specialnames = {
				'Red': 'Scarlet Shine', 'Pink': 'Coral Catapult', 'Yellow': 'Golden Gleam', 'Green': 'Emerald Flash',
				'Blue': 'Cerulean Surge', 'Purple': 'Violet Radiance',
			};
			for (let i = 0; i < allPokemon.length; i++) {
				let pokemon = allPokemon[i];
				let color = pokemon.template.color;
				let category = (pokemon.stats.atk > pokemon.stats.spa ? 'Physical' : 'Special');
				let last = pokemon.moves.length - 1;
				let move = (category === 'Physical' ? physicalnames[color] : specialnames[color]);
				if (pokemon.moves[last]) {
					pokemon.moves[last] = toId(move);
					pokemon.moveset[last].move = move;
					pokemon.baseMoveset[last].move = move;
				}
			}
		},
		onBeforeTurn: function (pokemon) {
			let side = pokemon.side;
			side.item = '';

			let decisions = [];
			let decision, i;
			if (side.hadItem || this.random(4) === 0) { // Can never get 2 consecutive turns of items
				side.hadItem = false;
				return;
			}
			switch (this.random(8)) {
			case 0:
				side.item = 'lightning';
				side.hadItem = true;
				this.add('message', "Lightning suddenly struck " + side.name + " and shrank their Pok\u00e9mon!");
				this.add('-start', pokemon, 'shrunken', '[silent]');
				break;
			case 1:
				side.item = 'blooper';
				side.hadItem = true;
				this.add('message', "A Blooper came down and splattered ink all over " + side.name + "'s screen!");
				this.add('-start', pokemon, 'blinded', '[silent]');
				break;
			case 2:
				if (pokemon.isGrounded()) {
					side.item = 'banana';
					side.hadItem = true;
					this.add('message', side.name + " slipped on a banana peel!");
					this.add('-start', pokemon, 'slipped', '[silent]');
					pokemon.addVolatile('flinch');
				}
				break;
			case 3:
				if (!side.sideConditions['goldenmushroom']) {
					side.item = 'goldmushroom';
					side.hadItem = true;
					this.add('message', side.name + " collected a Golden Mushroom, giving them a speed boost!");
					this.add('-start', pokemon, 'goldenmushroom', '[silent]');
					side.addSideCondition('goldenmushroom');
					side.sideConditions['goldenmushroom'].duration = 3;
					// Get all relevant decisions from the Pokemon and tweak speed.
					for (i = 0; i < this.queue.length; i++) {
						if (this.queue[i].pokemon === pokemon) {
							decision = this.queue[i];
							decision.speed = pokemon.getStat('spe');
							decisions.push(decision);
							// Cancel the decision
							this.queue.splice(i, 1);
							i--;
						}
					}
					for (i = 0; i < decisions.length; i++) {
						this.insertQueue(decisions[i]);
					}
				}
				break;
			case 4:
			case 5:
				if (!side.sideConditions['goldenmushroom']) {
					side.item = 'mushroom';
					side.hadItem = true;
					this.add('message', side.name + " collected a Mushroom, giving them a quick speed boost!");
					this.add('-start', pokemon, 'mushroom', '[silent]');
					side.addSideCondition('mushroom');
					side.sideConditions['mushroom'].duration = 1;
					// Get all relevant decisions from the Pokemon and tweak speed.
					for (i = 0; i < this.queue.length; i++) {
						if (this.queue[i].pokemon === pokemon) {
							decision = this.queue[i];
							decision.speed = pokemon.getStat('spe');
							decisions.push(decision);
							// Cancel the decision
							this.queue.splice(i, 1);
							i--;
						}
					}
					for (i = 0; i < decisions.length; i++) {
						this.insertQueue(decisions[i]);
					}
				}
				break;
			default:
				if (side.pokemonLeft - side.foe.pokemonLeft >= 2) {
					side.item = 'blueshell';
					side.hadItem = true;
					this.add('message', "A Blue Spiny Shell flew over the horizon and crashed into " + side.name + "!");
					this.damage(pokemon.maxhp / 2, pokemon, pokemon, this.getMove('judgment'), true);
				}
			}
		},
		onAccuracy: function (accuracy, target, source, move) {
			if (source.hasAbility('keeneye')) return;
			let modifier = 1;
			if (source.side.item === 'blooper' && !source.hasAbility('clearbody')) {
				modifier *= 0.4;
			}
			if (target.side.item === 'lightning') {
				modifier *= 0.8;
			}
			return this.chainModify(modifier);
		},
		onDisableMove: function (pokemon) {
			// Enforce Choice Item locking on color moves
			// Technically this glitches with Klutz, but Lopunny is Brown and will never appear :D
			if (!pokemon.ignoringItem() && pokemon.getItem().isChoice && pokemon.lastMove === 'swift') {
				let moves = pokemon.moveset;
				for (let i = 0; i < moves.length; i++) {
					if (moves[i].id !== 'swift') {
						pokemon.disableMove(moves[i].id, false);
					}
				}
			}
		},
		onEffectivenessPriority: -5,
		onEffectiveness: function (typeMod, target, type, move) {
			if (move.id !== 'swift') return;
			// Only calculate color effectiveness once
			if (target.getTypes()[0] !== type) return 0;
			let targetColor = target.template.color;
			let sourceColor = this.activePokemon.template.color;
			let effectiveness = {
				'Red': {'Red': 0, 'Pink': 0, 'Yellow': 1, 'Green': 1, 'Blue': -1, 'Purple': -1},
				'Pink': {'Red': 0, 'Pink': 0, 'Yellow': 1, 'Green': 1, 'Blue': -1, 'Purple': -1},
				'Yellow': {'Red': -1, 'Pink': -1, 'Yellow': 0, 'Green': 0, 'Blue': 1, 'Purple': 1},
				'Green': {'Red': -1, 'Pink': -1, 'Yellow': 0, 'Green': 0, 'Blue': 1, 'Purple': 1},
				'Blue': {'Red': 1, 'Pink': 1, 'Yellow': -1, 'Green': -1, 'Blue': 0, 'Purple': 0},
				'Purple': {'Red': 1, 'Pink': 1, 'Yellow': -1, 'Green': -1, 'Blue': 0, 'Purple': 0},
			};
			return effectiveness[sourceColor][targetColor];
		},
		onModifyDamage: function (damage, source, target, effect) {
			if (source === target || effect.effectType !== 'Move') return;
			if (target.side.item === 'lightning') return this.chainModify(2);
			if (source.side.item === 'lightning') return this.chainModify(0.5);
		},
		onModifySpe: function (speMod, pokemon) {
			if (pokemon.side.sideConditions['goldenmushroom'] || pokemon.side.sideConditions['mushroom']) {
				return this.chainModify(1.75);
			}
		},
		onResidual: function (battle) {
			let side;
			for (let i = 0; i < battle.sides.length; i++) {
				side = battle.sides[i];
				if (side.sideConditions['goldenmushroom'] && side.sideConditions['goldenmushroom'].duration === 1) {
					this.add('-message', "The effect of " + side.name + "'s Golden Mushroom wore off.");
					this.add('-end', side.active[0], 'goldenmushroom', '[silent]');
					side.removeSideCondition('goldenmushroom');
				}
				switch (side.item) {
				case 'lightning':
					this.add('-end', side.active[0], 'shrunken', '[silent]');
					break;
				case 'blooper':
					this.add('-end', side.active[0], 'blinded', '[silent]');
					break;
				case 'banana':
					this.add('-end', side.active[0], 'slipped', '[silent]');
					break;
				case 'mushroom':
					this.add('-end', side.active[0], 'mushroom', '[silent]');
				}

				side.item = '';
			}
		},
		onModifyMove: function (move, pokemon) {
			if (move.id !== 'swift') return;
			let physicalnames = {
				'Red': 'Crimson Crash', 'Pink': 'Rose Rush', 'Yellow': 'Saffron Strike', 'Green': 'Viridian Slash',
				'Blue': 'Blue Bombardment', 'Purple': 'Indigo Impact',
			};
			let specialnames = {
				'Red': 'Scarlet Shine', 'Pink': 'Coral Catapult', 'Yellow': 'Golden Gleam', 'Green': 'Emerald Flash',
				'Blue': 'Cerulean Surge', 'Purple': 'Violet Radiance',
			};
			let color = pokemon.template.color;
			move.category = (pokemon.stats.atk > pokemon.stats.spa ? 'Physical' : 'Special');
			move.name = (move.category === 'Physical' ? physicalnames[color] : specialnames[color]);
			move.basePower = 100;
			move.accuracy = 100;
			move.type = '???';
			if (move.category === 'Physical') move.flags['contact'] = true;
		},
		onPrepareHit: function (pokemon, target, move) {
			if (move.id !== 'swift') return;
			let animations = {
				'Crimson Crash': 'Flare Blitz', 'Scarlet Shine': 'Fusion Flare', 'Rose Rush': 'Play Rough',
				'Coral Catapult': 'Moonblast', 'Saffron Strike': 'Bolt Strike',	'Golden Gleam': 'Charge Beam',
				'Viridian Slash': 'Power Whip', 'Emerald Flash': 'Solarbeam', 'Blue Bombardment': 'Waterfall',
				'Cerulean Surge': 'Hydro Pump', 'Indigo Impact': 'Poison Jab', 'Violet Radiance': 'Gunk Shot',
			};
			this.attrLastMove('[anim] ' + animations[move.name]);
		},
		onSwitchInPriority: -9,
		onSwitchIn: function (pokemon) {
			if (!pokemon.hp) return;
			this.add('-start', pokemon, pokemon.template.color, '[silent]');
			if (pokemon.side.item === 'lightning') {
				this.add('-start', pokemon, 'shrunken', '[silent]');
			}
			if (pokemon.side.sideConditions['goldenmushroom']) {
				this.add('-start', pokemon, 'goldenmushroom', '[silent]');
			}
		},
		onSwitchOut: function (pokemon) {
			this.add('-end', pokemon, pokemon.template.color, '[silent]');
		},
	},

	// Spoopy Party, October 2015
	// https://github.com/Zarel/Pokemon-Showdown/tree/fc0237649cff994585a298b47199ba70925c0bb5/

	{
		name: "[Seasonal] Spoopy Party",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],

		team: 'randomSpoopy',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onSwitchIn: function (pokemon) {
			if (pokemon.species === 'Magikarp') {
				this.boost({spe:4, spd:2, def:2}, pokemon, pokemon, 'the power of dank');
			}
		},
		onModifyMove: function (move) {
			if (move.id === 'aquaring') {
				move.volatileStatus = 'wonderring';
				move.onHit = function (pokemon) {
					this.add('-start', pokemon, 'Aqua Ring');
					this.add('-message', "7.8/10, too much water - IGN");
				};
			}
			if (move.id === 'hyperbeam') {
				move.type = 'Water';
				move.accuracy = true;
				delete move.self;
				move.onTryHit = function (target, source) {
					this.add('-message', target.name + "'s fuel cannot melt " + source.name + " beams!");
				};
			}
			if (move.id === 'trickortreat') {
				switch (this.random(7)) {
				case 0:
					move.category = 'Special';
					move.type = 'Fire';
					move.basePower = 200;
					move.onTryHit = function () {
						this.add('-message', "Pumpkin bomb!");
					};
					move.onHit = function () {};
					break;
				case 1:
					move.category = 'Physical';
					move.type = 'Poison';
					move.basePower = 25;
					move.multihit = 4;
					move.onTryHit = function () {
						this.add('-message', "Toilet paper missile attack!");
					};
					move.onHit = function () {};
					break;
				case 2:
					move.onTryHit = function () {
						this.add('-message', "Yum! Chocolate!");
					};
					move.onHit = function (target, source) {
						this.heal(Math.ceil(target.maxhp * 0.5));
					};
					break;
				case 3:
					move.onTryHit = function () {
						this.add('-message', "This is a rather bland candy.");
					};
					move.onHit = function (target, source) {
						this.heal(Math.ceil(target.maxhp * 0.25));
						target.setStatus('par');
						target.addVolatile('confusion');
					};
					break;
				case 4:
					move.onTryHit = function () {
						this.add('-message', "You are about to be rotten-egged on!");
					};
					move.onHit = function (target, source) {
						target.setStatus('tox');
						target.addVolatile('torment');
					};
					break;
				case 5:
					move.category = 'Special';
					move.type = 'Dark';
					move.basePower = 500;
					move.self = {volatileStatus: 'mustrecharge'};
					move.onTryHit = function () {
						this.add('-message', "Ultimate Super Hiper Mega Awesome Beam destroyer of worlds!");
					};
					move.onHit = function (target, source) {
						this.add('-message', source.name + " was caught in the explosion!");
						source.setStatus('brn');
						source.addVolatile('disabled');
						source.addVolatile('confusion');
					};
					break;
				case 6:
					move.onTryHit = function () {
						this.add('-message', "Have some refreshment, my fellow.");
					};
					move.onHit = function (target, source) {
						target.addVolatile('aquaring');
					};
					break;
				}
			}
		},
		onResidual: function () {
			let allpokes = this.p1.active.concat(this.p2.active);
			let pokemon;
			for (let i = 0; i < allpokes.length; i++) {
				pokemon = allpokes[i];
				if (pokemon.hp && pokemon.volatiles['wonderring']) {
					this.heal(pokemon.maxhp / 8, pokemon, pokemon, 'dank memes');
				}
			}
		},
	},

	// Super Squad Smackdown, November 2015
	// https://github.com/Zarel/Pokemon-Showdown/tree/06b23a562e4b6d7814c97519b5f7584a8acfb493

	{
		name: "[Seasonal] Super Squad Smackdown",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],

		team: 'randomSeasonalHero',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onEffectiveness: function (typeMod, target, move, type) {
			if (this.activePokemon && this.activePokemon.name === 'Magneto' && move.id === 'flashcannon' && type === 'Steel') return 1;
		},
		onSwitchInPriority: 10,
		onSwitchIn: function (pokemon) {
			switch (pokemon.name) {
			case 'Iron Man':
				if (pokemon.addType('Steel')) {
					this.add('-start', pokemon, 'typeadd', 'Steel', '[silent]');
				}
				break;
			case 'Spiderman':
				this.boost({atk: 1, spe: 2}, pokemon, pokemon, 'Spidey Sense');
				break;
			}
		},
	},

	// Polar Opposites, Janary - February 2016
	// https://github.com/Zarel/Pokemon-Showdown/tree/5047fda6fc6e8ee7b7bab364b9f9a6c201ed5838

	{
		name: "[Seasonal] Polar Opposites",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],

		team: 'randomSeasonalPolar',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onBegin: function () {
			this.add('-message', "NOTE: This is an Inverse Battle! Type effectivenesses are reversed!");
		},
		onNegateImmunity: false,
		onEffectiveness: function (typeMod, target, type, move) {
			// The effectiveness of Freeze Dry on Water isn't reverted
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.getImmunity(move, type)) return 1;
			return -typeMod;
		},
	},

	// Dimension Doom, March 2016
	// https://github.com/Zarel/Pokemon-Showdown/tree/10bdcfdd338028ccb89da2d0c5290d9344f74e38

	{
		name: "[Seasonal] Dimension Doom",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],

		team: 'randomSeasonalDimensional',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onBegin: function () {
			this.add('-message', "The world is about to end!");
			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (let i = 0, len = allPokemon.length; i < len; i++) {
				let pokemon = allPokemon[i];
				if (pokemon.set.signatureMove) {
					let last = pokemon.moves.length - 1;
					if (pokemon.moves[last]) {
						pokemon.moves[last] = toId(pokemon.set.signatureMove);
						pokemon.moveset[last].move = pokemon.set.signatureMove;
						pokemon.baseMoveset[last].move = pokemon.set.signatureMove;
					}
				}
			}
		},
		onSwitchIn: function (pokemon) {
			let name = toId(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
			if (name === 'rick') {
				this.add('-message', 'WUBBA LUBBA DUB DUB!!');
			}
			if (name === 'morty') {
				this.add('-message', "I-I'm not sure t-this is a good idea, Rick!");
			}
			if (name === 'mrmeeseks') {
				this.add('-message', "Hi! I'm Mr. Meeseks! Look at me!");
			}
			if (name === 'birdperson') {
				this.add('-message', "It's been a tough mating season for birdperson.");
			}
			if (name === 'squanch') {
				this.add('-message', "You're getting squanched, squanch!");
			}
			if (name === 'mortyjr') {
				this.add('-message', 'The government is lame!');
			}
			if (name === 'dipper') {
				this.add('-message', 'A mystery to solve!');
			}
			if (name === 'mabel') {
				this.add('-message', 'Yay! Splinters!');
			}
			if (name === 'stanley') {
				this.add('-message', 'Discount punches! No refunds!');
			}
			if (name === 'stanford') {
				this.add('-message', 'Being a hero means fighting back even when it seems impossible.');
			}
			if (name === 'snowball') {
				this.add('-message', 'You may call me snowball, because my fur is white and pretty.');
			}
			if (name === 'billcipher') {
				this.add('-message', 'Let the weirdmaggedon start! HAHAHA!');
			}
			if (name === 'lilgideon') {
				this.add('-message', 'I can buy and sell you, old man!');
			}
		},
		onModifyMove: function (move, pokemon) {
			let name = toId(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
			if (move.id === 'watergun' && name in {'rick':1, 'evilrick':1}) {
				move.name = 'Portal Gun';
				move.type = 'Psychic';
				move.basePower = 66;
				move.accuracy = true;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Hyper Beam", target);
				};
				switch (this.random(6)) {
				case 0:
					move.volatileStatus = 'confusion';
					move.onHit = function () {
						this.add('-message', "This weird dimension confuses you!");
					};
					break;
				case 1:
					move.category = 'embargo';
					move.onHit = function () {
						this.add('-message', "Your item got sucked by the dimension hole!");
					};
					break;
				case 2:
					move.forceSwitch = true;
					move.onHit = function () {
						this.add('-message', "You got sucked into the portal!");
					};
					break;
				case 3:
					move.basePower = 150;
					move.type = 'Fire';
					move.onHit = function () {
						this.add('-message', "Flames came out of the portal gun!");
					};
					break;
				case 4:
					move.basePower = 130;
					move.type = 'Poison';
					move.status = 'tox';
					move.onHit = function () {
						this.add('-message', "Toxic air came out of the portal gun!");
					};
					break;
				case 5:
					move.basePower = 45;
					move.multihit = 3;
					move.type = 'Bug';
					move.onHit = function () {
						this.add('-message', "Tentacles came out of the portal gun!");
					};
					break;
				}
			}
			if (move.id === 'outrage' && name === 'morty') {
				move.name = 'Morty Rage';
				move.type = 'Fighting';
				move.basePower = 200;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Outrage", target);
					this.add('-message', 'Morty grew tired of your shennanigans!');
				};
			}
			if (move.id === 'kinesis' && name === 'evilmorty') {
				move.name = 'Mind Control';
				move.volatileStatus = 'confusion';
				move.category = 'Special';
				move.type = 'Fire';
				move.basePower = 50;
				move.boosts = {accuracy: -1};
			}
			if (move.id === 'dreameater' && name === 'scaryterry') {
				move.name = 'Super Dream Eater';
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Hyper Beam", target);
				};
				move.onBasePower = function (basePower, attacker, defender) {
					if (defender.status && defender.status === 'slp') {
						return this.chainModify(2);
					}
				};
			}
			if (move.id === 'bulkup' && name === 'squanchy') {
				move.name = 'Squanch Up';
				move.boosts = {atk: 2, def: 2};
			}
			if (move.id === 'recycle') {
				move.name = 'Pines Recycle';
				move.heal = [2, 3];
			}
			if (move.id === 'psychic' && name === 'mabel') {
				move.name = 'Grappling Hook';
				move.basePower = 110;
				move.drain = [2, 3];
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Hyper Beam", target);
					this.add('-message', 'GRAPPLING HOOK!');
				};
			}
			if (move.id === 'thunder' && name === 'billcipher') {
				move.name = 'Bill Thunder';
				move.basePower = 200;
			}
			if (move.id === 'tackle' && name === 'stanley') {
				move.name = 'Baseball Bat';
				move.basePower = 135;
				move.volatileStatus = 'confusion';
			}
			if (move.id === 'hyperbeam' && name === 'stanford') {
				move.name = 'Dimensional Sniper';
				move.category = 'Physical';
				move.basePower = 300;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Origin Pulse", target);
				};
			}
			if (move.id === 'chatter' && name === 'summer') {
				move.name = 'Teen Problems';
				move.basePower = 90;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Meteor Mash", target);
					this.add('-message', 'This is so embarrasing!');
				};
			}
		},
	},

	// Super Staff Bros. Melee, April - May 2016
	// https://github.com/Zarel/Pokemon-Showdown/tree/129d35d5eefb295b1ec24f3e1985a586da3f049c

	{
		name: "[Seasonal] Super Staff Bros. Melee",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],

		mod: 'seasonal',
		team: 'randomSeasonalMelee',
		ruleset: ['Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		onBegin: function () {
			this.add("raw|Super Staff Bros. <b>MELEEEEEEEEEEEEEE</b>!!");
			this.add('message', "SURVIVAL! GET READY FOR THE NEXT BATTLE!");

			let globalRenamedMoves = {};
			let customRenamedMoves = {};

			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (let i = 0, len = allPokemon.length; i < len; i++) {
				let pokemon = allPokemon[i];
				let last = pokemon.moves.length - 1;
				if (pokemon.moves[last]) {
					pokemon.moves[last] = toId(pokemon.set.signatureMove);
					pokemon.moveset[last].move = pokemon.set.signatureMove;
					pokemon.baseMoveset[last].move = pokemon.set.signatureMove;
				}
				for (let j = 0; j < pokemon.moveset.length; j++) {
					let moveData = pokemon.moveset[j];
					if (globalRenamedMoves[moveData.id]) {
						pokemon.moves[j] = toId(pokemon.set.signatureMove);
						moveData.move = globalRenamedMoves[moveData.id];
						pokemon.baseMoveset[j].move = globalRenamedMoves[moveData.id];
					}

					let customRenamedSet = customRenamedMoves[toId(pokemon.name)];
					if (customRenamedSet && customRenamedSet[moveData.id]) {
						pokemon.moves[j] = toId(pokemon.set.signatureMove);
						moveData.move = customRenamedSet[moveData.id];
						pokemon.baseMoveset[j].move = customRenamedSet[moveData.id];
					}
				}
			}
		},
		// Here we add some flavour or design immunities.
		onImmunity: function (type, pokemon) {
			if (toId(pokemon.name) === 'juanma' && type === 'Fire') {
				this.add('-message', "Did you think fire would stop __him__? You **fool**!");
				return false;
			}
		},
		onNegateImmunity: function (pokemon, type) {
			if (pokemon.volatiles['flipside']) return false;
			const foes = pokemon.side.foe.active;
			if (foes.length && foes[0].volatiles['samuraijack'] && pokemon.hasType('Dark') && type === 'Psychic') return false;
		},
		onEffectiveness: function (typeMod, target, type, move) {
			if (!target.volatiles['flipside']) return;
			if (move && move.id === 'retreat') return;
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.getImmunity(move, type)) return 1;
			return -typeMod;
		},
		// Hacks for megas changed abilities. This allow for their changed abilities.
		onUpdate: function (pokemon) {
			let name = toId(pokemon.name);
			if (pokemon.template.isMega) {
				if (name === 'andy' && pokemon.getAbility().id === 'magicbounce') {
					pokemon.setAbility('adaptability');
					this.add('-ability', pokemon, 'Adaptability');
				}
				if (name === 'reisen' && pokemon.getAbility().id === 'hugepower') {
					pokemon.setAbility('adaptability');
					this.add('-ability', pokemon, 'Tough Claws');
				}
				if (name === 'crestfall' && pokemon.getAbility().id === 'magicbounce') {
					pokemon.setAbility('simple');
					this.add('-ability', pokemon, 'Simple');
				}
				if (name === 'dreameatergengar' && pokemon.getAbility().id === 'shadowtag') {
					pokemon.setAbility('infiltrator');
					this.add('-ability', pokemon, 'Infiltrator');
				}
				if (name === 'overneat' && pokemon.getAbility().id === 'speedboost') {
					pokemon.setAbility('noguard');
					this.add('-ability', pokemon, 'No Guard');
				}
				if (name === 'skitty' && pokemon.getAbility().id === 'healer') {
					pokemon.setAbility('shedskin');
					this.add('-ability', pokemon, 'Shed Skin');
				}
				if (name === 'theimmortal' && pokemon.getAbility().id === 'megalauncher') {
					pokemon.setAbility('cloudnine');
				}
			}
			if (!this.shownTip) {
				this.add('raw|<div class=\"broadcast-green\">Huh? But what do all these weird moves do??<br><b>Protip: Refer to the <a href="https://github.com/Zarel/Pokemon-Showdown/blob/129d35d5eefb295b1ec24f3e1985a586da3f049c/mods/seasonal/README.md">PLAYER\'S MANUAL</a>!</b></div>');
				this.shownTip = true;
			}
		},
		// Here we treat many things, read comments inside for information.
		onSwitchInPriority: 1,
		onSwitchIn: function (pokemon) {
			let name = toId(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
			// Wonder Guard is available, but it curses you.
			if (pokemon.getAbility().id === 'wonderguard' && pokemon.baseTemplate.baseSpecies !== 'Shedinja' && pokemon.baseTemplate.baseSpecies !== 'Kakuna') {
				pokemon.addVolatile('curse', pokemon);
				this.add('-message', pokemon.name + "'s Wonder Guard has cursed it!");
			}

			// Add here more hacky stuff for mega abilities.
			// This happens when the mega switches in, as opposed to mega-evolving on the turn.
			if (pokemon.template.isMega) {
				if (name === 'andy' && pokemon.getAbility().id === 'magicbounce') {
					pokemon.setAbility('adaptability');
					this.add('-ability', pokemon, 'Adaptability');
				}
				if (name === 'reisen' && pokemon.getAbility().id === 'hugepower') {
					pokemon.setAbility('adaptability');
					this.add('-ability', pokemon, 'Tough Claws');
				}
				if (name === 'crestfall' && pokemon.getAbility().id === 'magicbounce') {
					pokemon.setAbility('simple');
					this.add('-ability', pokemon, 'Simple');
				}
				if (name === 'dreameatergengar' && pokemon.getAbility().id === 'shadowtag') {
					pokemon.setAbility('infiltrator');
					this.add('-ability', pokemon, 'Infiltrator');
				}
				if (name === 'overneat' && pokemon.getAbility().id === 'speedboost') {
					pokemon.setAbility('noguard');
					this.add('-ability', pokemon, 'No Guard');
				}
				if (name === 'skitty' && pokemon.getAbility().id === 'healer') {
					pokemon.setAbility('shedskin');
					this.add('-ability', pokemon, 'Shed Skin');
				}
				if (name === 'theimmortal' && pokemon.getAbility().id === 'megalauncher') {
					pokemon.setAbility('cloudnine');
				}
			} else {
				// Bypass one mega limit.
				pokemon.canMegaEvo = this.canMegaEvo(pokemon);
			}

			// Innate effects.
			if (name === 'ascriptmaster') {
				pokemon.addVolatile('ascriptinnate', pokemon);
			}
			if (name === 'atomicllamas') {
				pokemon.addVolatile('baddreamsinnate', pokemon);
			}
			if (name === 'blastchance') {
				pokemon.addVolatile('flipside', pokemon);
			}
			if (name === 'bondie') {
				pokemon.addVolatile('crabstance', pokemon);
			}
			if (name === 'clefairy') {
				pokemon.addVolatile('coldsteel', pokemon);
			}
			if (name === 'duck') {
				pokemon.addVolatile('firstblood', pokemon);
			}
			if (name === 'eeveegeneral') {
				this.add('detailschange', pokemon, pokemon.details); //run mega evo animation
				this.add('-mega', pokemon, 'Eevee', null);
				for (let i = 0; i < pokemon.stats.length; i++) {
					pokemon.stats[i] += 50;
				}
			}
			if (name === 'formerhope') {
				pokemon.addVolatile('cursedbodyinnate', pokemon);
			}
			if (name === 'galbia' || name === 'aurora') {
				this.setWeather('sandstorm');
			}
			if (name === 'rodan') {
				pokemon.addVolatile('gonnamakeyousweat', pokemon);
			}
			if (name === 'giagantic') {
				pokemon.addVolatile('deltastreaminnate', pokemon);
			}
			if (name === 'hashtag') {
				this.boost({spe:1}, pokemon, pokemon, 'innate ability');
			}
			if (name === 'haund') {
				pokemon.addVolatile('prodigy', pokemon);
			}
			if (name === 'innovamania' && !pokemon.illusion) {
				this.boost({atk:6, def:6, spa:6, spd:6, spe:6, accuracy:6}, pokemon, pokemon, 'divine grace');
			}
			if (name === 'jackhiggins') {
				this.setWeather('sunnyday');
			}
			if (name === 'lemonade') {
				pokemon.addVolatile('adaptabilityinnate', pokemon);
			}
			if (name === 'manu11') {
				pokemon.addVolatile('arachnophobia', pokemon);
			}
			if (name === 'marshmallon') {
				this.boost({def: 1}, pokemon, pokemon, 'fur coat innate');
			}
			if (name === 'mizuhime' || name === 'kalalokki' || name === 'sweep') {
				this.setWeather('raindance');
			}
			if (name === 'nv') {
				pokemon.addVolatile('cuteness', pokemon);
			}
			if (name === 'pikachuun') {
				this.boost({spe: 1}, pokemon, pokemon, 'Reisen Cosplay');
			}
			if (name === 'qtrx') {
				pokemon.addVolatile('qtrxinnate', pokemon);
			}
			if (name === 'raseri') {
				this.useMove('hypnosis', pokemon);
			}
			if (name === 'rssp1') {
				pokemon.addVolatile('speedboostinnate', pokemon);
			}
			if (name === 'scythernoswiping') {
				pokemon.addVolatile('mountaineerinnate', pokemon);
			}
			if (name === 'sigilyph') {
				pokemon.addVolatile('samuraijack', pokemon);
			}
			if (name === 'sonired') {
				this.boost({def: -1, spd: -1, atk: 1, spe: 1}, pokemon, pokemon, 'Weak Skin');
			}
			if (name === 'snobalt') {
				pokemon.addVolatile('amityabsorb', pokemon);
			}
			if (name === 'spacebass') {
				pokemon.addVolatile('badtrip', pokemon);
			}
			if (name === 'sparktrain') {
				pokemon.addVolatile('refrigerateinnate', pokemon);
			}
			if (name === 'specsmegabeedrill') {
				pokemon.addVolatile('weed', pokemon);
			}
			if (name === 'starmei') {
				this.useMove('cosmicpower', pokemon);
			}
			if (name === 'talkingtree') {
				this.useMove('synthesis', pokemon);
				this.useMove('bulkup', pokemon);
			}
			if (name === 'teremiare') {
				pokemon.addVolatile('coinflip', pokemon);
			}
			if (name === 'trickster' || name === 'blitzamirin') {
				let target = pokemon.battle[pokemon.side.id === 'p1' ? 'p2' : 'p1'].active[0];
				let targetBoosts = {};
				let sourceBoosts = {};
				for (let i in target.boosts) {
					targetBoosts[i] = target.boosts[i];
					sourceBoosts[i] = pokemon.boosts[i];
				}
				target.setBoost(sourceBoosts);
				pokemon.setBoost(targetBoosts);
				this.add('-swapboost', pokemon, target);
			}
			if (name === 'unfixable') {
				pokemon.addVolatile('ironbarbsinnate', pokemon);
			}
			if (name === 'urkerab') {
				pokemon.addVolatile('focusenergy', pokemon);
				this.useMove('magnetrise', pokemon);
			}
			if (name === 'uselesstrainer') {
				pokemon.addVolatile('ninja', pokemon);
			}
			if (name === 'winry') {
				pokemon.addVolatile('hellacute', pokemon);
			}

			// Edgy switch-in sentences go here.
			// Sentences vary in style and how they are presented, so each Pokémon has its own way of sending them.
			let sentences = [];
			let sentence = '';

			if (name === 'acast') {
				this.add('c|%Acast|__A wild Castform appeared!__');
			}
			if (name === 'ace') {
				this.add('c|@Ace|Lmaonade');
			}
			if (name === 'aelita') {
				this.add('c|%Aelita|Transfer, Aelita. Scanner, Aelita. Virtualization!');
			}
			if (name === 'ajhockeystar') {
				this.add('c|+ajhockeystar|Here comes the greatest hockey player alive!');
			}
			if (name === 'albacore') {
				this.add('c|@Albacore|do I have to?');
			}
			if (name === 'albert') {
				this.add('c|+Albert|Art is risk.');
			}
			if (name === 'always') {
				sentence = (pokemon.side.foe.active.length && pokemon.side.foe.active[0].hp ? pokemon.side.foe.active[0].name : "... ohh nobody's there...");
				this.add('c|+Always|Oh it\'s ' + sentence);
			}
			if (name === 'am') {
				this.add('c|+AM|Lucky and Bad');
			}
			if (name === 'andy') {
				this.add('c|%AndrewGoncel|:I');
			}
			if (name === 'antemortem') {
				this.add('c|&antemortem|I Am Here To Oppress Users');
			}
			if (name === 'anttya') {
				this.add('c|+Anttya|Those crits didn\'t even matter');
			}
			if (name === 'anty') {
				this.add('c|+Anty|mhm');
			}
			if (name === 'articuno') {
				this.add('c|%Articuno|Abolish the patriarchy!');
			}
			if (name === 'ascriptmaster') {
				this.add("c|@Ascriptmaster|It's time for a hero to take the stage!");
			}
			if (name === 'astara') {
				this.add('c|%Ast☆arA|I\'d rather take a nap, I hope you won\'t be a petilil shit, Eat some rare candies and get on my level.');
			}
			if (name === 'asty') {
				this.add('c|@Asty|Top kek :^)');
			}
			if (name === 'atomicllamas') {
				this.add('c|&atomicllamas|(celebrate)(dog)(celebrate)');
			}
			if (name === 'aurora') {
				this.add('c|@Aurora|Best of luck to all competitors!');
			}
			if (name === 'reisen') {
				this.add('c|%Reisen|Fite me irl bruh.');
			}
			if (name === 'beowulf') {
				this.add('c|@Beowulf|Grovel peasant, you are in the presence of the RNGesus');
			}
			if (name === 'biggie') {
				sentences = ["Now I'm in the limelight cause I rhyme tight", "HAPPY FEET! WOMBO COMBO!", "You finna mess around and get dunked on"];
				this.add('c|@biggie|' + sentences[this.random(3)]);
			}
			if (name === 'blastchance') {
				this.add("c|+Blast Chance|MAN BALAMAR");
			}
			if (name === 'blitzamirin') {
				this.add('c|@Blitzamirin|How Can Mirrors Be Real If Our Eyes Aren\'t Real? ╰( ~ ◕ ᗜ ◕ ~ )੭━☆ﾟ.*･｡ﾟ');
			}
			if (name === 'bludz') {
				this.add('c|+bludz|420 blaze it');
			}
			if (name === 'bondie') {
				this.add('c|+Bondie|__(\\/) snip snip (\\/)__');
			}
			if (name === 'bottt') {
				this.add('c|boTTT|Beep, boop');
			}
			if (name === 'brandon') {
				this.add("c|+Brrandon|Life's too short to take it seriously ALL the time.");
			}
			if (name === 'bumbadadabum') {
				this.add('c|@bumbadadabum|Time for card games on motorcycles!');
				if (pokemon.side.foe.active.length && pokemon.side.foe.active[0].name === 'Scotteh') this.add('c|@bumbadadabum|Also, fuck you Scotteh');
			}
			if (name === 'bummer') {
				this.add("c|&Bummer|Oh hi.");
			}
			if (name === 'chaos') {
				this.add("c|~chaos|I always win");
			}
			if (name === 'ciran') {
				this.add("c|+Ciran|You called?");
			}
			if (name === 'clefairy') {
				this.add('c|+Clefairy|google "dj clefairyfreak" now');
			}
			if (name === 'coolstorybrobat') {
				sentence = [
					"Time to GET SLAYED", "BRUH!", "Ahem! Gentlemen...", "I spent 6 months training in the mountains for this day!",
					"Shoutout to all the pear...",
				][this.random(5)];
				this.add('c|@CoolStoryBrobat|' + sentence);
			}
			if (name === 'crestfall') {
				this.add('c|%Crestfall|To say that we\'re in love is dangerous');
			}
			if (name === 'deathonwings') {
				this.add('c|+Death on Wings|rof');
			}
			if (name === 'dirpz') {
				this.add('c|+Dirpz|IT\'S A WATER/FAIRY TYPE!!11!');
			}
			if (name === 'dmt') {
				this.add('c|+DMT|DMT');
			}
			if (name === 'dreameatergengar') {
				this.add('c|+Dream Eater Gengar|Goodnight sweet prince.');
			}
			if (name === 'duck') {
				this.add('c|@Duck|Don\'t duck with me!');
			}
			if (name === 'e4flint') {
				this.add('c|+E4 Flint|hf lul');
			}
			if (name === 'eeveegeneral') {
				sentences = ['yo', 'anyone seen goku?'];
				this.add('c|~Eevee General|' + sentences[this.random(2)]);
			}
			if (name === 'eyan') {
				this.add('c|@Eyan|░░░░░░░░▄▄▄▀▀▀▄▄███▄░░░░░░░░░░░░░░░░░');
				this.add('c|@Eyan|░░░░░▄▀▀░░░░░░░▐░▀██▌░░░░░░░░░░░░░░░░');
				this.add('c|@Eyan|░░░▄▀░░░░▄▄███░▌▀▀░▀█░░░░░░░░░░░░░░░░');
				this.add('c|@Eyan|░░▄█░░▄▀▀▒▒▒▒▒▄▐░░░░█▌░░░░░░░░░░░░░░░ ');
				this.add('c|@Eyan|░▐█▀▄▀▄▄▄▄▀▀▀▀▌░░░░░▐█▄░░░░░░░░░░░░░░');
				this.add('c|@Eyan|░▌▄▄▀▀░░░░░░░░▌░░░░▄███████▄░░░░░░░░░');
				this.add('c|@Eyan|░░░░░░░░░░░░░▐░░░░▐███████████▄░░░░░░');
				this.add('c|@Eyan|░░░░░le░░░░░░░▐░░░░▐█████████████▄░░░');
				this.add('c|@Eyan|░░░░toucan░░░░░░▀▄░░░▐██████████████▄');
				this.add('c|@Eyan|░░░░░░has░░░░░░░░▀▄▄████████████████▄');
				this.add('c|@Eyan|░░░░░arrived░░░░░░░░░░░░█▀██████░░░░░');
				this.add('c|@Eyan|WELCOME TO COMPETITIVE TOUCANNING');
			}
			if (name === 'feliburn') {
				this.add('c|@Feliburn|you don\'t go hand to hand with a fighter noob');
			}
			if (name === 'fireburn') {
				this.add('c|+Fireburn|:V');
			}
			if (name === 'flyingkebab') {
				this.add("c|+Flying Kebab|Kebab > Pizza");
			}
			if (name === 'formerhope') {
				this.add('c|@Former Hope|I have Hope');
			}
			if (name === 'freeroamer') {
				this.add('c|%Freeroamer|lol this is a wrap');
			}
			if (name === 'frysinger') {
				this.add("c|+Frysinger|Nice boosts kid.");
			}
			if (name === 'fx') {
				this.add("c|+f(x)|love is 4 wawawawawawawalls");
			}
			if (name === 'galbia') {
				this.add('c|@galbia|(dog)');
			}
			if (name === 'galom') {
				this.add('c|+Galom|To the end.');
			}
			if (name === 'rodan') { // don't delete
				this.add("c|+RODAN|Here I Come, Rougher Than The Rest of 'Em.");
			}
			if (name === 'geoffbruedly') {
				this.add("c|%GeoffBruedly|FOR WINRY");
			}
			if (name === 'giagantic') {
				this.add("c|%Giagantic|e.e");
			}
			if (name === 'golui') {
				this.add("c|+Golui|Golly gee");
			}
			if (name === 'goodmorningespeon') {
				this.add("c|+GoodMorningEspeon|type /part to continue participating in this battle :)");
			}
			if (name === 'grimauxiliatrix') {
				this.add("c|%grimAuxiliatrix|ᕕ( ᐛ )ᕗ");
			}
			if (name === 'halite') {
				this.add('c|@Halite|You’re gonna get haxxed kid :^)');
			}
			if (name === 'hannah') {
				this.add('c|+Hannahh|♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥');
			}
			if (name === 'hashtag') {
				this.add("c|#Hashtag|hey opponent, you get 5 hashtag points if you forfeit right now ;}");
			}
			if (name === 'haund') {
				this.add('c|%Haund|le balanced normal flying bird has arrived');
			}
			if (name === 'healndeal') {
				this.add('c|+HeaLnDeaL|screw clerics');
			}
			if (name === 'himynamesl') {
				this.add('c|@HiMyNamesL|There’s no such thing as winning or losing. There is won and there is lost, there is victory and defeat. There are absolutes. Everything in between is still left to fight for.');
				this.add('c|@HiMyNamesL|' + pokemon.side.foe.name + ' will have won only when there is no one left to stand against them. Until then, there is only the struggle, because tides do what tides do – they turn.');
			}
			if (name === 'hippopotas') {
				this.add('-message', '@Hippopotas\'s Sand Stream whipped up a sandstorm!');
			}
			if (name === 'hollywood') {
				this.add('c|+hollywood|Kappa');
			}
			if (name === 'ih8ih8sn0w') {
				this.add('c|+ih8ih8sn0w|*sips tea*');
			}
			if (name === 'imanalt') {
				this.add('c|+imanalt|muh bulk');
			}
			if (name === 'imas234') {
				this.add('c|@imas234|hlo');
			}
			if (name === 'innovamania') {
				sentences = ['Don\'t take this seriously', 'These Black Glasses sure look cool', 'Ready for some fun?( ͡° ͜ʖ ͡°)', '( ͡° ͜ʖ ͡°'];
				this.add('c|@innovamania|' + sentences[this.random(4)]);
			}
			if (name === 'iplaytennislol') {
				this.add('c|%iplaytennislol|KACAW');
			}
			if (name === 'iyarito') {
				this.add('c|+Iyarito|Welp');
			}
			if (name === 'jackhiggins') {
				this.add("c|+Jack Higgins|Ciran was right, fun deserved to be banned");
			}
			if (name === 'jasmine') {
				this.add("c|+Jasmine|I'm still relevant!");
			}
			if (name === 'jdarden') {
				this.add('c|@jdarden|Did someone call for some BALK?');
			}
			if (name === 'jetpack') {
				this.add('c|+Jetpack|You\'ve met with a terrible fate, haven\'t you?');
			}
			if (name === 'joim') {
				let dice = this.random(8);
				if (dice === 1) {
					this.add('c|~Joim|░░░░░░░░░░░░▄▐');
					this.add('c|~Joim|░░░░░░▄▄▄░░▄██▄');
					this.add('c|~Joim|░░░░░▐▀█▀▌░░░░▀█▄');
					this.add('c|~Joim|░░░░░▐█▄█▌░░░░░░▀█▄');
					this.add('c|~Joim|░░░░░░▀▄▀░░░▄▄▄▄▄▀▀');
					this.add('c|~Joim|░░░░▄▄▄██▀▀▀▀');
					this.add('c|~Joim|░░░█▀▄▄▄█░▀▀');
					this.add('c|~Joim|░░░▌░▄▄▄▐▌▀▀▀');
					this.add('c|~Joim|▄░▐░░░▄▄░█░▀▀ U HAVE BEEN SPOOKED');
					this.add('c|~Joim|▀█▌░░░▄░▀█▀░▀');
					this.add('c|~Joim|░░░░░░░▄▄▐▌▄▄ BY THE');
					this.add('c|~Joim|░░░░░░░▀███▀█░▄');
					this.add('c|~Joim|░░░░░░▐▌▀▄▀▄▀▐▄ SPOOKY SKILENTON');
					this.add('c|~Joim|░░░░░░▐▀░░░░░░▐▌');
					this.add('c|~Joim|░░░░░░█░░░░░░░░█');
					this.add('c|~Joim|░░░░░▐▌░░░░░░░░░█');
					this.add('c|~Joim|░░░░░█░░░░░░░░░░▐▌ SEND THIS TO 7 PPL OR SKELINTONS WILL EAT YOU');
				} else {
					sentences = [
						"Finally a good reason to punch a teenager in the face!", "WUBBA LUBBA DUB DUB",
						"``So here we are again, it's always such a pleasure.``", "My ex-wife still misses me, BUT HER AIM IS GETTING BETTER!",
						"A man chooses, a slave obeys.", "You're gonna have a bad time.", "Would you kindly let me win?",
						"I'm sorry, but I only enjoy vintage memes from the early 00's.",
					];
					sentence = sentences[this.random(8)];
					this.add('c|~Joim|' + sentence);
				}
			}
			if (name === 'juanma') {
				this.add("c|+Juanma|Okay, well, sometimes, science is more art than science, " + pokemon.side.name + ". A lot of people don't get that.");
			}
			if (name === 'kalalokki') {
				this.add('c|+Kalalokki|(•_•)');
				this.add('c|+Kalalokki|( •_•)>⌐■-■');
				this.add('c|+Kalalokki|(⌐■_■)');
			}
			if (name === 'kidwizard') {
				this.add('c|+Kid Wizard|Eevee General room mod me.');
			}
			if (name === 'layell') {
				this.add('c|@Layell|Enter stage left');
			}
			if (name === 'legitimateusername') {
				sentence = ["This isn't my fault.", "I'm not sorry."][this.random(2)];
				this.add('c|@LegitimateUsername|``' + sentence + '``');
			}
			if (name === 'lemonade') {
				this.add('c|+Lemonade|Pasta');
			}
			if (name === 'level51') {
				this.add('c|@Level 51|n_n!');
			}
			if (name === 'lj') {
				this.add('c|%LJDarkrai|Powerfulll');
			}
			if (name === 'lyto') {
				sentences = ["This is divine retribution!", "I will handle this myself!", "Let battle commence!"];
				this.add('c|@Lyto|' + sentences[this.random(3)]);
			}
			if (name === 'macle') {
				this.add("c|+macle|Follow the Frog Blog");
			}
			if (name === 'manu11') {
				this.add("c|@manu 11|/me is pet by ihateyourpancreas");
			}
			if (name === 'marshmallon') {
				this.add("c|%Marshmallon|Marshtomb be like");
				this.add("c|%Marshmallon|- He sees you when you're sleeping -");
				this.add("c|%Marshmallon|- He knows when you're awake -");
				this.add("c|%Marshmallon|- He knows if you've been bad or good -");
				this.add("c|%Marshmallon|- So be good for goodness sake -");
			}
			if (name === 'mattl') {
				this.add('c|+MattL|If you strike me down, I shall become more powerful than you can possibly imagine.');
			}
			if (name === 'mcmeghan') {
				this.add("c|&McMeghan|A Game of Odds");
			}
			if (name === 'megazard') {
				this.add('c|+Megazard|New tricks');
			}
			if (name === 'mizuhime') {
				this.add('c|+Mizuhime|Thou Shalt Double Laser From The Edge');
			}
			if (name === 'nv') {
				this.add('c|+nv|Who tf is nv?');
			}
			if (name === 'omegaxis') {
				this.add('c|+Omega-Xis|lol this isn’t even my final form');
			}
			if (name === 'orday') {
				this.add('c|%Orda-Y|❄');
			}
			if (name === 'overneat') {
				this.add('c|+Overneat|tsk, tsk, is going to be funny');
			}
			if (name === 'paradise') {
				this.add('c|%Paradise~|I sexually identify as a hazard setter');
			}
			if (name === 'pikachuun') {
				sentences = ['Reisen is best waifu', 'Hey look I coded myself into the game', 'sup (\'.w.\')'];
				this.add('c|+Pikachuun|' + sentences[this.random(3)]);
			}
			if (name === 'pluviometer') {
				this.add('c|+pluviometer|p^2laceholder');
			}
			if (name === 'qtrx') {
				sentences = ["cutie are ex", "q-trix", "quarters", "cute T-rex", "Qatari", "random letters", "spammy letters", "asgdf"];
				this.add("c|@qtrx|omg DONT call me '" + sentences[this.random(8)] + "' pls respect my name its very special!!1!");
			}
			if (name === 'quitequiet') {
				this.add("c|@Quite Quiet|I'll give it a shot.");
			}
			if (name === 'raseri') {
				this.add('c|&Raseri|gg');
			}
			if (name === 'raven') {
				this.add('c|&Raven|Are you ready? Then let the challenge... Begin!');
			}
			if (name === 'rekeri') {
				this.add('c|@rekeri|Get Rekeri\'d :]');
			}
			if (name === 'rosiethevenusaur') {
				sentences = ['!dt party', 'Are you Wifi whitelisted?', 'Read the roomintro!'];
				this.add('c|@RosieTheVenusaur|' + sentences[this.random(3)]);
			}
			if (name === 'rssp1') {
				this.add('c|+rssp1|Witness the power of the almighty Rufflet!');
			}
			if (name === 'sailorcosmos') {
				this.add("c|+SailorCosmos|Cosmos Prism Power Make Up!");
			}
			if (name === 'scotteh') {
				this.add('c|&Scotteh|─────▄▄████▀█▄');
				this.add('c|&Scotteh|───▄██████████████████▄');
				if (pokemon.side.foe.active.length && pokemon.side.foe.active[0].name === 'bumbadadabum') this.add('c|@bumbadadabum|Fuck you Scotteh');
				this.add('c|&Scotteh|─▄█████.▼.▼.▼.▼.▼.▼.▼');
			}
			if (name === 'scpinion') {
				this.add('c|@scpinion|/me welcomes funbro');
			}
			if (name === 'scythernoswiping') {
				this.add('c|%Scyther NO Swiping|/me prepares to swipe victory');
			}
			if (name === 'shrang') {
				this.add('raw| [15:30] @<b>Scrappie</b>: It is I, the great and powerful shrang, who is superior to you proles in every conceivable way.');
			}
			if (name === 'sigilyph') {
				this.add('c|@Sigilyph|Prepare to feel the mighty power of an exploding star!');
			}
			if (name === 'sirdonovan') {
				this.add('c|&sirDonovan|Oh, a battle? Let me finish my tea and crumpets');
			}
			if (name === 'skitty') {
				this.add('c|@Skitty|\\_$-_-$_/');
			}
			if (name === 'snobalt') {
				this.add('c|+Snobalt|By the power vested in me from the great Lord Tomohawk...');
			}
			if (name === 'snowy') {
				this.add('c|+Snowy|Why do a lot of black people call each other monica?');
			}
			if (name === 'solarisfox') {
				this.add('raw|<div class="chat chatmessage-solarisfox"><small>%</small><b><font color="#2D8F1E"><span class="username" data-name="SolarisFox">SolarisFox</span>:</font></b> <em><marquee behavior="alternate" scrollamount=3 scrolldelay="60" width="108">[Intense vibrating]</marquee></em></div>');
			}
			if (name === 'sonired') {
				this.add('c|+Sonired|~');
			}
			if (name === 'spacebass') {
				this.add('c|@SpaceBass|He aims his good ear best he can towards conversation and sometimes leans in awkward toward your seat');
				this.add('c|@SpaceBass|And if by chance one feels their space too invaded, then try your best to calmly be discreet');
				this.add('c|@SpaceBass|Because this septic breathed man that stands before you is a champion from days gone by');
			}
			if (name === 'sparktrain') {
				this.add('c|+sparktrain|hi');
			}
			if (name === 'specsmegabeedrill') {
				this.add('c|+SpecsMegaBeedrill|(◕‿◕✿)');
			}
			if (name === 'spy') {
				sentences = ['curry consumer', 'try to keep up', 'fucking try to knock me down', 'Sometimes I slather myself in vasoline and pretend I\'m a slug', 'I\'m really feeling it!'];
				this.add('c|+Spy|' + sentences[this.random(5)]);
			}
			if (name === 'starmei') {
				this.add('c|+Starmei|Starmei wins again');
			}
			if (name === 'starry') {
				this.add('c|%starry|oh');
			}
			if (name === 'steamroll') {
				this.add('c|@Steamroll|Banhammer ready!');
			}
			if (name === 'sunfished') {
				this.add('c|+Sunfished|*raptor screeches*');
			}
			if (name === 'sweep') {
				this.add('c|&Sweep|(ninjacat)(beer)');
			}
			if (name === 'talkingtree') {
				this.add('c|+talkingtree|I am Groot n_n');
			}
			if (name === 'teg') {
				this.add("c|+TEG|It's __The__ Eevee General");
			}
			if (name === 'temporaryanonymous') {
				sentences = ['Hey, hey, can I gently scramble your insides (just for laughs)? ``hahahaha``', 'check em', 'If you strike me down, I shall become more powerful than you can possibly imagine! I have a strong deathrattle effect and I cannot be silenced!'];
				this.add('c|@Temporaryanonymous|' + sentences[this.random(3)]);
			}
			if (name === 'teremiare') {
				this.add('c|%Teremiare|I like to call it skill');
			}
			if (name === 'theimmortal') {
				this.add('c|~The Immortal|Give me my robe, put on my crown!');
			}
			if (name === 'tone114') {
				this.add('c|+TONE114|Haven\'t you heard the new sensation sweeping the nation?');
			}
			if (name === 'trickster') {
				sentences = ["heh….watch out before you get cut on my edge", "AaAaAaAAaAaAAa"];
				this.add('c|@Trickster|' + sentences[this.random(2)]);
			}
			if (name === 'unfixable') {
				this.add('c|+unfixable|eevee general sucks lol');
			}
			if (name === 'urkerab') {
				this.add('j|urkerab');
			}
			if (name === 'uselesstrainer') {
				sentences = ['huehuehuehue', 'PIZA', 'SPAGUETI', 'RAVIOLI RAVIOLI GIVE ME THE FORMUOLI', 'get ready for PUN-ishment', 'PIU\' RUSPE PER TUTTI, E I MARO\'???'];
				this.add('c|@useless trainer|' + sentences[this.random(6)]);
			}
			if (name === 'vapo') {
				this.add('c|%Vapo|/me vapes');
			}
			if (name === 'vexeniv') {
				this.add('c|+Vexen IV|The Arcana is the means by which all is revealed.');
			}
			if (name === 'winry') {
				this.add('c|@Winry|fight me irl');
			}
			if (name === 'xfix') {
				if (this.random(2)) {
					// The classic one
					const hazards = {stealthrock: 1, spikes: 1, toxicspikes: 1, burnspikes: 1, stickyweb: 1};
					let hasHazards = false;
					for (const hazard in hazards) {
						if (pokemon.side.getSideCondition(hazard)) {
							hasHazards = true;
							break;
						}
					}
					if (hasHazards) {
						this.add('c|+xfix|(no haz... too late)');
					} else {
						this.add('c|+xfix|(no hazards, attacks only, final destination)');
					}
				} else {
					this.add("c|+xfix|//starthunt 1 + 1 | 2 | 2 + 2 | 4 | Opponent's status soon (answer with three letters) | FNT :)");
				}
			}
			if (name === 'xjoelituh') {
				this.add("c|%xJoelituh|I won't be haxed again, you will be the next one. UUUUUU");
			}
			if (name === 'xshiba') { // dd
				this.add("c|+xShiba|LINDA IS INDA");
			}
			if (name === 'zarel') {
				this.add('c|~Zarel|Your mom');
			}
			if (name === 'zebraiken') {
				pokemon.phraseIndex = this.random(3);
				//  Zeb's faint and entry phrases correspond to each other.
				if (pokemon.phraseIndex === 2) {
					this.add('c|&Zebraiken|bzzt n_n');
				} else if (pokemon.phraseIndex === 1) {
					this.add('c|&Zebraiken|bzzt *_*');
				} else {
					this.add('c|&Zebraiken|bzzt o_o');
				}
			}
			if (name === 'zeroluxgiven') {
				this.add('c|%Zero Lux Given|This should be an electrifying battle!');
			}
			if (name === 'zodiax') {
				this.add('c|%Zodiax|Introducing 7 time Grand Champion to the battle!');
			}
		},
		onFaint: function (pokemon, source, effect) {
			let name = toId(pokemon.name);

			if (name === 'innovamania') {
				pokemon.side.addSideCondition('healingwish', pokemon, this);
			}
			// Add here salty tears, that is, custom faint phrases.
			let sentences = [];
			// This message is different from others, as it triggers when
			// opponent faints
			if (source && source.name === 'galbia') {
				this.add('c|@galbia|literally 2HKOged');
			}
			// Actual faint phrases
			if (name === 'acast') {
				this.add('c|%Acast|If only I had more screens...');
			}
			if (name === 'ace') {
				this.add('c|@Ace|inhale all of this');
			}
			if (name === 'aelita') {
				this.add('c|%Aelita|CODE: LYOKO. Tower deactivated...');
			}
			if (name === 'ajhockeystar') {
				this.add('c|+ajhockeystar|You may have beaten me in battle, but never in hockey.');
			}
			if (name === 'albacore') {
				this.add('c|@Albacore|Joke\'s on you, I was just testing!');
			}
			if (name === 'albert') {
				this.add("c|+Albert|You may be good looking, but you're not a piece of art.");
			}
			if (name === 'always') {
				this.add('c|+Always|i swear to fucking god how can a single person be this lucky after getting played all the fucking way. you are a mere slave you glorified heap of trash.');
			}
			if (name === 'am') {
				this.add('c|+AM|RIP');
			}
			if (name === 'andy') {
				this.add('c|%AndrewGoncel|wow r00d! :c');
			}
			if (name === 'antemortem') {
				this.add('c|&antemortem|FUCKING CAMPAIGNERS');
			}
			if (name === 'anttya') {
				this.add('c|+Anttya|Can\'t beat hax ¯\\_(ツ)_/¯');
			}
			if (name === 'anty') {
				this.add('c|+Anty|k');
			}
			if (name === 'articuno') {
				this.add('c|%Articuno|This is why you don\'t get any girls.');
			}
			if (name === 'ascriptmaster') {
				this.add('c|@Ascriptmaster|Farewell, my friends. May we meet another day...');
			}
			if (name === 'astara') {
				sentences = ['/me twerks into oblivion', 'good night ♥', 'Astara Vista Baby'];
				this.add('c|%Ast☆arA|' + sentences[this.random(3)]);
			}
			if (name === 'asty') {
				this.add('c|@Asty|Bottom kek :^(');
			}
			if (name === 'atomicllamas') {
				this.add('c|&atomicllamas|(puke)');
			}
			if (name === 'aurora') {
				this.add('c|@Aurora|are you serious you\'re so bad oh my god haxed ughhhhh');
			}
			if (name === 'reisen') {
				this.add("c|%Reisen|No need for goodbye. I'll see you on the flip side.");
			}
			if (name === 'beowulf') {
				this.add('c|@Beowulf|There is no need to be mad');
			}
			if (name === 'biggie') {
				sentences = ['It was all a dream', 'It\'s gotta be the shoes', 'ヽ༼ຈل͜ຈ༽ﾉ RIOT ヽ༼ຈل͜ຈ༽ﾉ'];
				this.add('c|@biggie|' + sentences[this.random(3)]);
			}
			if (name === 'blastchance') {
				this.add("c|+Blast Chance|**oh no!**");
			}
			if (name === 'blitzamirin') {
				this.add('c|@Blitzamirin|The Mirror Can Lie It Doesn\'t Show What\'s Inside ╰( ~ ◕ ᗜ ◕ ~ )੭━☆ﾟ.*･｡ﾟ');
			}
			if (name === 'bludz') {
				this.add('c|+bludz|zzz');
			}
			if (name === 'bondie') {
				this.add('c|+Bondie|Sigh...');
			}
			if (name === 'bottt') {
				this.add("c| boTTT|No longer being maintained...");
			}
			if (name === 'brandon') {
				this.add("c|+Brrandon|Always leave the crowd wanting more~");
			}
			if (name === 'bumbadadabum') {
				this.add("c|@bumbadadabum|Find another planet make the same mistakes.");
			}
			if (name === 'bummer') {
				this.add('c|&Bummer|Thanks for considering me!');
			}
			if (name === 'chaos') {
				this.add('c|~chaos|//forcewin chaos');
				if (this.random(1000) === 420) {
					// Shouldn't happen much, but if this happens it's hilarious.
					this.add('c|~chaos|actually');
					this.add('c|~chaos|//forcewin ' + pokemon.side.name);
					this.win(pokemon.side);
				}
			}
			if (name === 'ciran') {
				this.add("c|+Ciran|Fun is still banned in the Wi-Fi room!");
			}
			if (name === 'clefairy') {
				this.add('c|+Clefairy|flex&no flex zone nightcore remix dj clefairyfreak 2015');
			}
			if (name === 'coolstorybrobat') {
				let sentence = [
					"Lol I got slayed", "BRUH!", "I tried", "Going back to those mountains to train brb", "I forgot what fruit had... tasted like...",
				][this.random(5)];
				this.add('c|@CoolStoryBrobat|' + sentence);
			}
			if (name === 'crestfall') {
				this.add("c|%Crestfall|Her pistol go (bang bang, boom boom, pop pop)");
			}
			if (name === 'deathonwings') {
				this.add('c|+Death on Wings|DEG\'s a nub');
			}
			if (name === 'dirpz') {
				this.add('c|+Dirpz|sylveon is an eeeveeeeeeelutioooooon....');
			}
			if (name === 'dmt') {
				this.add('c|+DMT|DMT');
			}
			if (name === 'dreameatergengar') {
				this.add('c|+Dream Eater Gengar|In the darkness I fade. Remember ghosts don\'t die!');
			}
			if (name === 'duck') {
				this.add('c|@Duck|Duck you!');
			}
			if (name === 'e4flint') {
				this.add('c|#E4 Flint|+n1');
				this.add('c|+sparkyboTTT|nice 1');
			}
			if (name === 'eeveegeneral') {
				sentences = ["bye room, Electrolyte is in charge", "/me secretly cries", "inap!"];
				this.add("c|~Eevee General|" + sentences[this.random(3)]);
			}
			if (name === 'eyan') {
				this.add("c|@Eyan|;-;7");
			}
			if (name === 'feliburn') {
				this.add('c|@Feliburn|gg la verga de tu madre');
			}
			if (name === 'fireburn') {
				this.add('c|+Fireburn|>:Y');
			}
			if (name === 'flyingkebab') {
				this.add("c|+Flying Kebab|" + ["I\'ll see you in hell!", "/me vanishes to the depths of hell"][this.random(2)]);
			}
			if (name === 'formerhope') {
				this.add('c|@Former Hope|Now I have Former Hope.');
			}
			if (name === 'freeroamer') {
				this.add('c|%Freeroamer|how do people get these matchups...');
			}
			if (name === 'frysinger') {
				this.add("c|+Frysinger|/me teleports away from the battle and eats a senzu bean");
			}
			if (name === 'fx') {
				this.add("c|+f(x)|mirror, mirror");
			}
			if (name === 'galbia') {
				this.add('c|@galbia|(dog)');
			}
			if (name === 'galom') {
				this.add('c|+Galom|GAME OVER.');
			}
			if (name === 'rodan') {
				this.add("c|+RODAN|The Great Emeralds power allows me to feel... ");
			}
			if (name === 'geoffbruedly') {
				this.add("c|%GeoffBruedly|IM SORRY WINRY");
			}
			if (name === 'giagantic') {
				this.add("c|%Giagantic|x.x");
			}
			if (name === 'golui') {
				this.add("c|+Golui|Freeze in hell");
			}
			if (name === 'goodmorningespeon') {
				this.add("c|+GoodMorningEspeon|gg wp good hunt would scavenge again");
			}
			if (name === 'grimauxiliatrix') {
				this.add("c|%grimAuxiliatrix|∠( ᐛ 」∠)_");
			}
			if (name === 'halite') {
				this.add('c|@Halite|Today was your lucky day...');
			}
			if (name === 'hannah') {
				this.add('c|+Hannahh|Nooo! ;~;');
			}
			if (name === 'hashtag') {
				this.add("c|#Hashtag|fukn immigrants,,, slash me spits");
			}
			if (name === 'haund') {
				this.add('c|%Haund|omg noob team report');
			}
			if (name === 'healndeal') {
				this.add('c|+HeaLnDeaL|sadface I should have been a Sylveon');
			}
			if (name === 'himynamesl') {
				this.add('c|@HiMyNamesL|hey ' + pokemon.side.name + ', get good');
			}
			if (name === 'hippopotas') {
				this.add('-message', 'The sandstorm subsided.');
			}
			if (name === 'hollywood') {
				this.add('c|+hollywood|BibleThump');
			}
			if (name === 'ih8ih8sn0w') {
				this.add('c|+ih8ih8sn0w|nice hax :(');
			}
			if (name === 'imanalt') {
				this.add('c|+imanalt|bshax imo');
			}
			if (name === 'imas234') {
				this.add('c|@imas234|bg no re');
			}
			if (name === 'innovamania') {
				sentences = ['Did you rage quit?', 'How\'d you lose with this set?'];
				this.add('c|@innovamania|' + sentences[this.random(2)]);
			}
			if (name === 'iplaytennislol') {
				this.add('c|%iplaytennislol|/me des');
			}
			if (name === 'iyarito') {
				this.add('c|+Iyarito|Owwnn ;_;');
			}
			if (name === 'jackhiggins') {
				this.add("c|+Jack Higgins|I blame HiMyNamesL");
			}
			if (name === 'jasmine') {
				this.add("raw|<div class=\"broadcast-red\"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>");
			}
			if (name === 'jdarden') {
				this.add('c|@jdarden|;-;7');
			}
			if (name === 'jetpack') {
				this.add('c|+Jetpack|You shouldn\'t of done that. ;_;');
			}
			if (name === 'joim') {
				sentences = ['AVENGE ME, KIDS! AVEEEENGEEE MEEEEEE!!', 'OBEY!', '``This was a triumph, I\'m making a note here: HUGE SUCCESS.``', '``Remember when you tried to kill me twice? Oh how we laughed and laughed! Except I wasn\'t laughing.``', '``I\'m not even angry, I\'m being so sincere right now, even though you broke my heart and killed me. And tore me to pieces. And threw every piece into a fire.``'];
				this.add('c|~Joim|' + sentences[this.random(4)]);
			}
			if (name === 'juanma') {
				this.add("c|+Juanma|I guess you were right, now you must be the happiest person in the world, " + pokemon.side.name + "! You get to be major of 'I-told-you-so' town!");
			}
			if (name === 'kalalokki') {
				this.add('c|+Kalalokki|(⌐■_■)');
				this.add('c|+Kalalokki|( •_•)>⌐■-■');
				this.add('c|+Kalalokki|(x_x)');
			}
			if (name === 'kidwizard') {
				this.add('c|+Kid Wizard|Go to hell.');
			}
			if (name === 'layell') {
				this.add('c|@Layell|' + ['Alas poor me', 'Goodnight sweet prince'][this.random(2)]);
			}
			if (name === 'legitimateusername') {
				this.add('c|@LegitimateUsername|``This isn\'t brave. It\'s murder. What did I ever do to you?``');
			}
			if (name === 'lemonade') {
				this.add('c|+Lemonade|Pasta');
			}
			if (name === 'level51') {
				this.add('c|@Level 51|u_u!');
			}
			if (name === 'lj') {
				this.add('c|%LJDarkrai|.Blast');
			}
			if (name === 'lyto') {
				this.add('c|@Lyto|' + ['Unacceptable!', 'Mrgrgrgrgr...'][this.random(2)]);
			}
			if (name === 'macle') {
				this.add("c|+macle|Follow the Frog Blog - https://gonefroggin.wordpress.com/");
			}
			if (name === 'manu11') {
				this.add("c|@manu 11|so much hax, why do I even try");
			}
			if (name === 'marshmallon') {
				this.add("c|%Marshmallon|Shoutouts to sombolo and Rory Mercury ... for this trash set -_-");
			}
			if (name === 'mattl') {
				this.add('c|+MattL|Forgive me. I feel it again... the call from the light.');
			}
			if (name === 'mcmeghan') {
				this.add("c|&McMeghan|Out-odded");
			}
			if (name === 'megazard') {
				this.add('c|+Megazard|Old dog');
			}
			if (name === 'mizuhime') {
				this.add('c|+Mizuhime|I got Gimped.');
			}
			if (name === 'nv') {
				this.add('c|+nv|Too cute for this game ;~;');
			}
			if (name === 'omegaxis') {
				this.add('c|+Omega-Xis|bull shit bull sHit thats ✖️ some bullshit rightth ere right✖️there ✖️✖️if i do ƽaү so my selｆ ‼️ i say so ‼️ thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ‼️ HO0ОଠＯOOＯOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ ‼️ Bull shit');
			}
			if (name === 'orday') {
				this.add('c|%Orda-Y|❄_❄');
			}
			if (name === 'overneat') {
				this.add('c|+Overneat|Ugh! I failed you Iya-sama');
			}
			if (name === 'paradise') {
				this.add('c|%Paradise~|RIP THE DREAM');
			}
			if (name === 'pikachuun') {
				sentences = ['press f to pay respects ;_;7', 'this wouldn\'t have happened in my version', 'wait we were battling?'];
				this.add('c|+Pikachuun|' + sentences[this.random(3)]);
			}
			if (name === 'pluviometer') {
				this.add('c|+pluviometer|GP 2/2');
			}
			if (name === 'qtrx') {
				sentences = ['Keyboard not found; press **Ctrl + W** to continue...', 'hfowurfbiEU;DHBRFEr92he', 'At least my name ain\'t asgdf...'];
				this.add('c|@qtrx|' + sentences[this.random(3)]);
			}
			if (name === 'quitequiet') {
				this.add('c|@Quite Quiet|Well, I tried at least.');
			}
			if (name === 'raseri') {
				this.add('c|&Raseri|you killed a mush :(');
			}
			if (name === 'raven') {
				this.add('c|&Raven|I failed the challenge, and for that, I must lose a life. At least I had one to lose in the first place, nerd.');
			}
			if (name === 'rekeri') {
				this.add('c|@rekeri|lucky af :[');
			}
			if (name === 'rssp1') {
				this.add('c|+rssp1|Witness the power of the almighty Rufflet!');
			}
			if (name === 'rosiethevenusaur') {
				this.add('c|@RosieTheVenusaur|' + ['SD SKARM SHALL LIVE AGAIN!!!', 'Not my WiFi!'][this.random(2)]);
			}
			if (name === 'sailorcosmos') {
				this.add("c|+SailorCosmos|Cosmos Gorgeous Retreat!");
			}
			if (name === 'scotteh') {
				this.add('c|&Scotteh|▄███████▄.▲.▲.▲.▲.▲.▲');
				this.add('c|&Scotteh|█████████████████████▀▀');
			}
			if (name === 'scpinion') {
				this.add("c|@scpinion|guys, I don't even know how to pronounce scpinion");
			}
			if (name === 'scythernoswiping') {
				this.add('c|%Scyther NO Swiping|Aww man!');
			}
			if (name === 'shrang') {
				this.add('c|@shrang|FUCKING 2 YO KID');
			}
			if (name === 'sigilyph') {
				this.add('c|@Sigilyph|FROM THE BACK FROM THE BACK FROM THE BACK FROM THE BACK **ANDD**');
			}
			if (name === 'sirdonovan') {
				this.add('-message', 'RIP sirDonovan');
			}
			if (name === 'skitty') {
				this.add('c|@Skitty|!learn skitty, roleplay');
				this.add('raw|<div class="infobox">In Gen 6, Skitty <span class="message-learn-cannotlearn">can\'t</span> learn Role Play</div>');
			}
			if (name === 'solarisfox') {
				this.add('c|%SolarisFox|So long, and thanks for all the fish.');
			}
			if (name === 'sonired') {
				this.add('c|+Sonired|sigh lucky players.');
			}
			if (name === 'sparktrain') {
				this.add('c|+sparktrain|nice');
			}
			if (name === 'spy') {
				sentences = ['lolhax', 'crit mattered', 'bruh cum @ meh', '>thinking Pokemon takes any skill'];
				this.add('c|+Spy|' + sentences[this.random(4)]);
			}
			if (name === 'snobalt') {
				this.add('c|+Snobalt|Blasphemy!');
			}
			if (name === 'snowy') {
				this.add('c|+Snowy|i never understood this i always hear them be like "yo whats up monica" "u tryna blaze monica"');
			}
			if (name === 'spacebass') {
				this.add('c|@SpaceBass|And the tales of whales and woe off his liquored toungue will flow, the light will soft white twinkle off the cataracts in his eye');
				this.add("c|@SpaceBass|So if by chance you're cornered near the bathroom, or he blocks you sprawled in his aisle seat");
				this.add("c|@SpaceBass|Embrace the chance to hear some tales of greatness, 'cause he's the most interesting ball of toxins you're ever apt to meet");
			}
			if (name === 'specsmegabeedrill') {
				this.add('c|+SpecsMegaBeedrill|Tryhard.');
			}
			if (name === 'starmei') {
				this.add('c|+Starmei|//message AM, must be nice being this lucky');
			}
			if (name === 'starry') {
				this.add('c|%starry|o-oh');
			}
			if (name === 'steamroll') {
				this.add('c|@Steamroll|Not my problem anymore!');
			}
			if (name === 'sunfished') {
				this.add('c|+Sunfished|*raptor screeches*');
			}
			if (name === 'sweep') {
				this.add('c|&Sweep|You offended :C');
			}
			if (name === 'talkingtree') {
				this.add('c|+talkingtree|I am Groot u_u');
			}
			if (name === 'teg') {
				sentences = ['Save me, Joim!', 'Arcticblast is the worst OM leader in history'];
				this.add('c|+TEG|' + sentences[this.random(2)]);
			}
			if (name === 'temporaryanonymous') {
				sentences = [';_;7', 'This kills the tempo', 'I\'m kill. rip.', 'S-senpai! Y-you\'re being too rough! >.<;;;;;;;;;;;;;;;;;', 'A-at least you checked my dubs right?', 'B-but that\'s impossible! This can\'t be! AAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHGH'];
				this.add('c|@Temporaryanonymous|' + sentences[this.random(6)]);
			}
			if (name === 'teremiare') {
				this.add('c|%Teremiare|sigh...');
			}
			if (name === 'theimmortal') {
				this.add('c|~The Immortal|Oh how wrong we were to think immortality meant never dying.');
			}
			if (name === 'tone114') {
				this.add('c|+TONE114|I don\'t have to take this. I\'m going for a walk.');
			}
			if (name === 'trickster') {
				this.add('c|@Trickster|UPLOADING VIRUS.EXE \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588] 99% COMPLETE');
			}
			if (name === 'unfixable') {
				this.add('c|+unfixable|i may be dead but my eyebrows are better than yours will ever be');
			}
			if (name === 'urkerab') {
				this.add('l|urkerab');
			}
			if (name === 'uselesstrainer') {
				sentences = ['TIME TO SET UP', 'One day I\'ll become a beautiful butterfly'];
				this.add('c|@useless trainer|' + sentences[this.random(2)]);
			}
			if (name === 'vapo') {
				this.add('c|%Vapo|( ; _> ;)');
			}
			if (name === 'vexeniv') {
				this.add('c|+Vexen IV|brb burning my dread');
			}
			if (name === 'winry') {
				this.add('c|@Winry|I AM NOT A WEEB');
			}
			if (name === 'xfix') {
				const foe = pokemon.side.foe.active[0];
				if (foe.name === 'xfix') {
					this.add("c|+xfix|(I won. I lost. I... huh... ~~can somebody tell me what actually happened?~~)");
				} else if (foe.ability === 'magicbounce') {
					this.add('c|+xfix|(How do mirrors work... oh right, when you use a mirror, your opponent has a mirror as well... or something, ~~that\'s how you "balance" this game~~)');
				} else {
					this.add('c|+xfix|~~That must have been a glitch. Hackers.~~');
				}
			}
			if (name === 'xjoelituh') {
				this.add("c|%xJoelituh|THAT FOR SURE MATTERED. Blame Nayuki. I'm going to play CSGO then.");
			}
			if (name === 'xshiba') {
				this.add("c|+xShiba|Lol that feeling when you just win but get haxed..");
			}
			if (name === 'zarel') {
				this.add('c|~Zarel|your mom');
				// Followed by the usual '~Zarel fainted'.
				this.add('-message', '~Zarel used your mom!');
			}
			if (name === 'zebraiken') {
				if (pokemon.phraseIndex === 2) {
					this.add('c|&Zebraiken|bzzt u_u');
				} else if (pokemon.phraseIndex === 1) {
					this.add('c|&Zebraiken|bzzt ._.');
				} else {
					// Default faint.
					this.add('c|&Zebraiken|bzzt x_x');
				}
			}
			if (name === 'zeroluxgiven') {
				this.add('c|%Zero Lux Given|I\'ve been beaten, what a shock!');
			}
			if (name === 'zodiax') {
				this.add('c|%Zodiax|We need to go full out again soon...');
			}
		},
		// Special switch-out events for some mons.
		onSwitchOut: function (pokemon) {
			let name = toId(pokemon.name);

			if (!pokemon.illusion) {
				if (name === 'hippopotas') {
					this.add('-message', 'The sandstorm subsided.');
				}
			}

			// Transform
			if (pokemon.originalName) pokemon.name = pokemon.originalName;
		},
		onModifyPokemon: function (pokemon) {
			let name = toId(pokemon.name);
			// Enforce choice item locking on custom moves.
			// qtrx only has one move anyway.
			if (name !== 'qtrx') {
				let moves = pokemon.moveset;
				if (pokemon.getItem().isChoice && pokemon.lastMove === moves[3].id) {
					for (let i = 0; i < 3; i++) {
						if (!moves[i].disabled) {
							pokemon.disableMove(moves[i].id, false);
							moves[i].disabled = true;
						}
					}
				}
			}
		},
		// Specific residual events for custom moves.
		// This allows the format to have kind of custom side effects and volatiles.
		onResidual: function (battle) {
			// Deal with swapping from qtrx's mega signature move.
			let swapmon1, swapmon2;
			let swapped = false;
			for (let i = 1; i < 6 && !swapped; i++) {
				swapmon1 = battle.sides[0].pokemon[i];
				if (swapmon1.swapping && swapmon1.hp > 0) {
					swapmon1.swapping = false;
					for (let j = 1; j < 6; j++) {
						swapmon2 = battle.sides[1].pokemon[j];
						if (swapmon2.swapping && swapmon2.hp > 0) {
							swapmon2.swapping = false;

							this.add('message', "Link standby... Please wait.");
							swapmon1.side = battle.sides[1];
							swapmon1.fullname = swapmon1.side.id + ': ' + swapmon1.name;
							swapmon1.id = swapmon1.fullname;
							swapmon2.side = battle.sides[0];
							swapmon2.fullname = swapmon2.side.id + ': ' + swapmon2.name;
							swapmon2.id = swapmon2.fullname;
							let oldpos = swapmon1.position;
							swapmon1.position = swapmon2.position;
							swapmon2.position = oldpos;
							battle.sides[0].pokemon[i] = swapmon2;
							battle.sides[1].pokemon[j] = swapmon1;

							this.add("c|\u2605" + swapmon1.side.name + "|Bye-bye, " + swapmon2.name + "!");
							this.add("c|\u2605" + swapmon2.side.name + "|Bye-bye, " + swapmon1.name + "!");
							if (swapmon1.side.active[0].hp && swapmon2.side.active[0].hp) {
								this.add('-anim', swapmon1.side.active, "Healing Wish", swapmon1.side.active);
								this.add('-anim', swapmon2.side.active, "Aura Sphere", swapmon2.side.active);
								this.add('message', swapmon2.side.name + " received " + swapmon2.name + "! Take good care of " + swapmon2.name + "!");
								this.add('-anim', swapmon2.side.active, "Healing Wish", swapmon2.side.active);
								this.add('-anim', swapmon1.side.active, "Aura Sphere", swapmon1.side.active);
								this.add('message', swapmon1.side.name + " received " + swapmon1.name + "! Take good care of " + swapmon1.name + "!");
							} else {
								this.add('message', swapmon2.side.name + " received " + swapmon2.name + "! Take good care of " + swapmon2.name + "!");
								this.add('message', swapmon1.side.name + " received " + swapmon1.name + "! Take good care of " + swapmon1.name + "!");
							}
							swapped = true;
							break;
						}
					}
				}
			}
		},
	},


	// June Jubilee: Revenge, June 2016
	// https://github.com/Zarel/Pokemon-Showdown/tree/b54a1ac9163771f200f13d271624a519120baa49

	{
		name: "[Seasonal] June Jubilee: Revenge",

		team: 'randomSeasonalJubilee',
		ruleset: ['Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		onBegin: function () {
			this.add('message', "You are traveling with your fellow Delibird around the world, when your mortal enemy attacks you, seeking revenge since you defeated them on June 2013. Palkia inverted space, so you need to help it reach the south pole before summer starts!");
			this.add("raw|<font color='red'><b>Don't let your Delibird faint, or you will automatically lose the battle!</b></font>");
			this.setWeather('Sunny Day');
			delete this.weatherData.duration;

			this.seasonal = {'none':false, 'drizzle':false, 'hail':false};
		},
		onBeforeMove: function (pokemon, target, move) {
			// Reshiram changes weather with its tail until you reach the arctic
			if (pokemon.template.speciesid === 'reshiram' && this.turn < 15) {
				let weatherMsg = '';
				let dice = this.random(100);
				if (dice < 25) {
					this.setWeather('Rain Dance');
					weatherMsg = 'a rainstorm';
				} else if (dice < 50) {
					this.setWeather('Sunny Day');
					weatherMsg = 'a heat wave';
				} else if (dice < 75) {
					this.setWeather('Hail');
					weatherMsg = 'a snowstorm';
				} else {
					this.setWeather('Sandstorm');
					weatherMsg = 'a sandstorm';
				}
				this.add('-message', "Reshiram caused " + weatherMsg + " with its tail!");
				delete this.weatherData.duration;
			}

			if (this.turn >= 4 && this.seasonal.none === false) {
				this.add('-message', "You are travelling south and you have arrived in Sao Paulo! There's a clear sky and the temperature is lower here.");
				this.clearWeather();
				this.seasonal.none = true;
			}
			if (this.turn >= 8 && this.seasonal.drizzle === false) {
				this.add('-message', "You are travelling further south and you have arrived at Tierra del Fuego! It started raining a lot... and it's getting quite cold.");
				this.setWeather('Rain Dance');
				delete this.weatherData.duration;
				this.seasonal.drizzle = true;
			}
			if (this.turn >= 12 && this.seasonal.hail === false) {
				this.add('-message', "You have arrived at the Antarctic! Defeat the other trainer so Delibird can be free!");
				this.setWeather('Hail');
				delete this.weatherData.duration;
				this.seasonal.hail = true;
			}
		},
		onFaint: function (pokemon) {
			if (pokemon.template.id === 'delibird') {
				let name = pokemon.side.name;
				let winner = pokemon.side.id === 'p1' ? 'p2' : 'p1';
				this.add('-message', "No!! You let Delibird down. It trusted you. You lost the battle, " + name + ". But you lost something else: your Pokémon's trust.");
				pokemon.battle.win(winner);
			}
		},
	},

	// Fireworks Frenzy (July - September 2016)
	// https://github.com/Zarel/Pokemon-Showdown/tree/c4719698de756f629b0f5f3a72beaccd44d8535f
	{
		name: "[Seasonal] Fireworks Frenzy",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],

		team: 'randomSeasonalFireworks',
		ruleset: ['Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		onBegin: function () {
			this.add('message', "A fireworks show is starting!");
			// this.add('-weather', 'Fireworks'); // un-comment when the client supports custom named weathers
		},
		onResidual: function () {
			if (this.isWeather('')) this.eachEvent('Weather');
		},
		onWeather: function (target) {
			if (!target.hasType('Fire')) this.damage(target.maxhp / 16, target, null, 'exploding fireworks');
		},
	},
];
