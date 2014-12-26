// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.js

exports.Formats = [

	// XY Singles
	///////////////////////////////////////////////////////////////////

	{
		name: "Random Battle",
		section: "ORAS Singles",

		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod']
	},
	{
		name: "Unrated Random Battle",
		section: "ORAS Singles",

		team: 'random',
		challengeShow: false,
		rated: false,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod']
	},
	{
		name: "OU",
		section: "ORAS Singles",

		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite']
	},
	{
		name: "OU (suspect test)",
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite', 'Greninja']
	},
	{
		name: "Ubers",
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Standard Ubers', 'Swagger Clause', 'Team Preview', 'Mega Rayquaza Ban Mod'],
		banlist: []
	},
	{
		name: "UU",
		section: "ORAS Singles",

		ruleset: ['OU'],
		banlist: ['OU', 'BL', 'Altarianite', 'Diancite', 'Heracronite', 'Galladite', 'Gardevoirite', 'Lopunnite', 'Medichamite', 'Metagrossite',
			'Drizzle', 'Drought', 'Shadow Tag'
		]
	},
	{
		name: "RU",
		section: "ORAS Singles",

		ruleset: ['UU'],
		banlist: ['UU', 'BL2', 'Galladite', 'Houndoominite']
	},
	{
		name: "NU",
		section: "ORAS Singles",

		ruleset: ['RU'],
		banlist: ['RU', 'BL3', 'Glalitite']
	},
	{
		name: "LC",
		section: "ORAS Singles",

		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Dragon Rage', 'Sonic Boom', 'Swagger', 'LC Uber', 'Gligar']
	},
	{
		name: "Anything Goes",
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Endless Battle Clause', 'HP Percentage Mod', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal']
	},
	/*{
		name: "CAP Plasmanta Playtest",
		section: "ORAS Singles",

		ruleset: ['CAP Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Uber', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Soul Dew',
			'Tomohawk', 'Necturna', 'Mollux', 'Aurumoth', 'Malaconda', 'Cawmodore', 'Volkraken', 'Syclant', 'Revenankh', 'Pyroak', 'Fidgit', 'Stratagem', 'Arghonaut', 'Kitsunoh', 'Cyclohm', 'Colossoil', 'Krilowatt', 'Voodoom'
		]
	},*/
	{
		name: "Battle Spot Singles",
		section: "ORAS Singles",

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
		name: "Battle of Hoenn",
		section: "ORAS Singles",

		onBegin: function () {
			this.debug('cutting down to 3');
			this.p1.pokemon = this.p1.pokemon.slice(0, 3);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 3);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Hoenn Pokedex', 'Team Preview GBU'],
		requirePentagon: true,
		validateTeam: function (team, format) {
			if (team.length < 3) return ['You must bring at least three Pokémon.'];
		}
	},
	{
		name: "Custom Game",
		section: "ORAS Singles",

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
		name: "Random Doubles Battle",
		section: "ORAS Doubles",

		gameType: 'doubles',
		team: 'randomDoubles',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod']
	},
	{
		name: "Smogon Doubles",
		section: "ORAS Doubles",

		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard Doubles', 'Team Preview'],
		banlist: ['Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo',
			'Palkia', 'Rayquaza', 'Reshiram', 'Xerneas', 'Yveltal', 'Zekrom', 'Soul Dew', 'Dark Void'
		]
	},
	{
		name: "Smogon Doubles (suspect test)",
		section: "ORAS Doubles",

		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard Doubles', 'Team Preview'],
		banlist: ['Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo',
			'Palkia', 'Rayquaza', 'Reshiram', 'Xerneas', 'Yveltal', 'Zekrom', 'Salamencite', 'Soul Dew', 'Dark Void'
		]
	},
	{
		name: "Smogon Doubles Ubers",
		section: "ORAS Doubles",

		gameType: 'doubles',
		ruleset: ['Pokemon', 'Species Clause', 'Moody Clause', 'OHKO Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal', 'Dark Void']
	},
	{
		name: "Smogon Doubles UU",
		section: "ORAS Doubles",

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
		section: "ORAS Doubles",

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
		section: "ORAS Doubles",

		gameType: 'doubles',
		maxForcedLevel: 50,
		validateTeam: function (team, format) {
			if (team.length < 4) return ['You must bring at least four Pokémon.'];
		},
		ruleset: ['Pokemon', 'Standard GBU', 'Hoenn Pokedex', 'Team Preview VGC'],
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
		section: "ORAS Doubles",

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
		name: "VGC 2015",
		section: "ORAS Doubles",

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
		requirePentagon: true,
		validateTeam: function (team, format) {
			if (team.length < 4) return ['You must bring at least four Pokémon.'];
		}
	},
	{
		name: "Doubles Challenge Cup",
		section: "ORAS Doubles",

		gameType: 'doubles',
		team: 'randomCC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod']
	},
	{
		name: "Doubles Custom Game",
		section: "ORAS Doubles",

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
		name: "Random Triples Battle",
		section: "ORAS Triples",

		gameType: 'triples',
		team: 'randomDoubles',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod']
	},
	{
		name: "Smogon Triples",
		section: "ORAS Triples",

		gameType: 'triples',
		ruleset: ['Pokemon', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Team Preview'],
		banlist: ['Illegal', 'Unreleased', 'Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White',
			'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Xerneas', 'Yveltal', 'Zekrom',
			'Soul Dew', 'Dark Void', 'Perish Song'
		]
	},
	{
		name: "Battle Spot Triples",
		section: "ORAS Triples",

		gameType: 'triples',
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview'],
		validateTeam: function (team, format) {
			if (team.length < 6) return ['You must have six Pokémon.'];
		}
	},
	{
		name: "Triples Challenge Cup",
		section: "ORAS Triples",

		gameType: 'triples',
		team: 'randomCC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod']
	},
	{
		name: "Triples Custom Game",
		section: "ORAS Triples",

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
			// We add more speed the less loaded the sleigh is.
			// Then, we get a random number from 0 to 99, then calculate if it's less than (Pokémon's speed * 0.083) + 5.
			var speed = Math.abs(pokemon.speed) + Math.ceil((2500 - this.seasonal.weight[pokemon.side.n]) / 25);
			if (this.random(100) < Math.ceil(speed * 0.083) + 5) {
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
		onBegin: function () {
			this.debug('Cutting down to 1');
			this.p1.pokemon = this.p1.pokemon.slice(0, 1);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 1);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Balanced Hackmons",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Ability Clause', '-ate Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Team Preview', 'HP Percentage Mod'],
		banlist: ['Arena Trap', 'Huge Power', 'Parental Bond', 'Pure Power', 'Shadow Tag', 'Wonder Guard']
	},
	{
		name: "1v1",
		section: 'Other Metagames',

		ruleset: ['Pokemon', 'Moody Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Swagger Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Team Preview 1v1'],
		banlist: ['Illegal', 'Unreleased', 'Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin',
			'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky',
			'Xerneas', 'Yveltal', 'Zekrom', 'Focus Sash', 'Kangaskhanite', 'Soul Dew'
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

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Giratina-Origin', 'Groudon', 'Ho-Oh',
			'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Snorlax',
			'Xerneas', 'Yveltal', 'Zekrom', 'Gengarite', 'Kangaskhanite', 'Salamencite', 'Soul Dew'
		],
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
			'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Salamencite', 'Soul Dew'
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
			'Mawilite', 'Metagrossite', 'Razor Claw', 'Salamencite', 'Slowbronite', 'Soul Dew'
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
		banlist: ['Chansey', 'Frogadier', 'Eviolite']
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

	// BW2 Singles
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 5] OU",
		section: "BW2 Singles",
		column: 3,

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
		column: 3,

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
		column: 3,

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
		name: "[Gen 2] OU",
		section: "Past Generations",

		mod: 'gen2',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber']
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
		name: "[Gen 1] OU",
		section: "Past Generations",

		mod: 'gen1',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber']
	},
	{
		name: "[Gen 1] OU (tradeback)",
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod'],
		banlist: ['Uber', 'Unreleased', 'Illegal',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Tackle + Growl'
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
