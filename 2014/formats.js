/**
 * Seasonal Ladders of Pokémon Showdown
 * The formats with the mod-like tweaks go into /config/formats.js
 * The team making scripts go into /data/scripts.js
 *
 * THIS IS A BACKUP FILE.
 */

'use strict';

exports.Formats = [
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
];
