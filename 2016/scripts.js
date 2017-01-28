
/**
 * Seasonal Ladders of Pokémon Showdown
 * The formats with the mod-like tweaks go into /data/formats.js
 * The team making scripts go into /data/scripts.js
 *
 * THIS IS A BACKUP FILE.
 */

'use strict';

exports.BattleScripts = {
	randomSeasonalPolarTeam: function () {
		let pokemonLeft = 0;
		let pokemon = [];

		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			let template = this.getTemplate(id);
			if (!template.evos.length && !template.isMega && !template.isNonstandard && template.randomBattleMoves && template.types.indexOf("Ice") >= 0) {
				pokemonPool.push(id);
			}
		}

		let baseFormes = {};
		let uberCount = 0;
		let puCount = 0;
		let weakCount = 0;
		let teamDetails = {};

		while (pokemonPool.length && pokemonLeft < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;
			let types = template.types.sort().join('/');

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;

			// Limit to 2 Water/Ice Pokemon (double weakness to Ice in an Ice-dominant format)
			if (weakCount > 2 && types === 'Ice/Water' && this.random(5) >= 1) continue;

			let tier = template.tier;
			switch (tier) {
			case 'Uber':
				// Ubers are limited to 1 but have a 20% chance of being added anyway.
				if (uberCount && this.random(5) >= 1) continue;
				break;
			case 'PU':
				// PUs are limited to 2 but have a 20% chance of being added anyway.
				if (puCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'Unreleased':
				// Unreleased Pokémon have 20% the normal rate
				if (this.random(5) >= 1) continue;
				break;
			case 'CAP':
				// CAPs have 20% the normal rate
				if (this.random(5) >= 1) continue;
			}

			let set = this.randomSet(template, pokemon.length, teamDetails);

			// Freeze-Dry is pointless because of Inverse Battle rules
			let freezedry = set.moves.indexOf('freezedry');
			if (freezedry >= 0 && set.moves.indexOf('icebeam') < 0) {
				set.moves[freezedry] = 'icebeam';
			}

			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;
			if (types === 'Ice/Water') weakCount++;
			pokemonLeft++;

			// Increment Uber/NU counters
			if (tier === 'Uber') {
				uberCount++;
			} else if (tier === 'PU') {
				puCount++;
			}

			// Team has Mega/weather/hazards
			if (this.getItem(set.item).megaStone) teamDetails['megaCount'] = 1;
			if (set.ability === 'Snow Warning') teamDetails['hail'] = 1;
			if (set.ability === 'Drizzle' || set.moves.indexOf('raindance') >= 0) teamDetails['rain'] = 1;
			if (set.ability === 'Sand Stream') teamDetails['sand'] = 1;
			if (set.moves.indexOf('stealthrock') >= 0) teamDetails['stealthRock'] = 1;
			if (set.moves.indexOf('toxicspikes') >= 0) teamDetails['toxicSpikes'] = 1;
			if (set.moves.indexOf('defog') >= 0 || set.moves.indexOf('rapidspin') >= 0) teamDetails['hazardClear'] = 1;
		}
		return pokemon;
	},

	randomSeasonalDimensionalTeam: function () {
		let side = 'good';
		let team = [];
		let pokemon = '';
		let set = {};
		let sides = {
			good: this.shuffle([
				'Rick', 'Morty', 'Summer', 'Mr. Meeseks', 'Scary Terry', 'Dr. Xenon Bloom', 'Bird Person', 'Squanchy', 'Krombopulos Michael', 'Unity',
				'Morty Jr.', 'Dipper', 'Mabel', 'Stanley', 'Stanford', 'Wendy', 'Soos', 'Fiddleford McGucket', 'Time Baby', 'Blendin',
			]),
			bad: this.shuffle([
				'Evil Rick', 'Evil Morty', 'King Flippy Nips', 'Mr. Lucius Needful', 'Snowball', 'Mr. Jellybean', 'Poncho',
				'Galactic Fed Soldier', 'Tammy', 'Bill Cipher', "Lil' Gideon", '8-Ball', 'Keyhole', 'Pacifier',
			]),
		};
		let mons = {
			'Rick': {species: 'alakazam', ability: 'regenerator', item: 'lifeorb', gender: 'M', moves: ['psystrike', 'recover', 'aurasphere', 'watergun'], signatureMove: 'Portal Gun'},
			'Morty': {species: 'machop', ability: 'furcoat', item: 'leftovers', gender: 'M', moves: ['bodyslam', 'highjumpkick', 'stockpile', 'outrage'], signatureMove: 'Morty Rage'},
			'Summer': {species: 'kirlia', ability: 'drought', item: 'brightpowder', gender: 'F', moves: ['moonblast', 'psystrike', 'moonlight', 'chatter'], signatureMove: 'Teen Problems'},
			'Mr. Meeseks': {species: 'deoxys', ability: 'wonderguard', item: 'blacksludge', gender: 'N', moves: ['copycat', 'assist', 'partingshot', 'thunderwave']},
			'Scary Terry': {species: 'excadrill', ability: 'baddreams', item: 'earthplate', gender: 'M', moves: ['spore', 'precipiceblades', 'slash', 'dreameater'], signatureMove: 'Super Dream Eater'},
			'Dr. Xenon Bloom': {species: 'reuniclus', ability: 'waterabsorb', item: 'choicespecs', gender: 'M', moves: ['psyshock', 'aurasphere', 'sludgebomb', 'shadowball']},
			'Bird Person': {species: 'hawlucha', ability: 'intimidate', item: 'expertbelt', gender: 'M', moves: ['dragonascent', 'superpower', 'substitute', 'swordsdance']},
			'Squanchy': {species: 'persian', ability: 'hugepower', item: 'lifeorb', gender: 'M', moves: ['return', 'superpower', 'recover', 'bulkup'], signatureMove: 'Squanch Up'},
			'Krombopulos Michael': {species: 'kricketune', ability: 'speedboost', item: 'chartiberry', gender: 'M', moves: ['megahorn', 'waterfall', 'iciclecrash', 'protect']},
			'Unity': {species: 'blissey', ability: 'imposter', item: 'leftovers', gender: 'F', moves: ['transform', 'return']},
			'Morty Jr.': {species: 'machamp', ability: 'moxie', item: 'leftovers', gender: 'M', moves: ['drainpunch', 'machpunch', 'shadowclaw', 'bulkup']},
			'Dipper': {species: 'spinda', ability: 'oblivious', item: 'sitrusberry', gender: 'M', moves: ['machpunch', 'suckerpunch', 'quickattack', 'recycle'], signatureMove: 'Pines Recycle'},
			'Mabel': {species: 'ralts', ability: 'moody', item: 'brightpowder', gender: 'F', moves: ['protect', 'doubleteam', 'moonblast', 'psychic'], signatureMove: 'Grappling Hook'},
			'Stanley': {species: 'hitmonchan', ability: 'hugepower', item: 'muscleband', gender: 'M', moves: ['drainpunch', 'bulletpunch', 'closecombat', 'tackle'], signatureMove: 'Baseball Bat'},
			'Stanford': {species: 'hitmonchan', ability: 'furcoat', item: 'sitrusberry', gender: 'M', moves: ['machpunch', 'suckerpunch', 'dynamicpunch', 'hyperbeam'], signatureMove: 'Dimensional Sniper'},
			'Wendy': {species: 'gallade', ability: 'sniper', item: 'scopelens', gender: 'F', moves: ['focusenergy', 'psychocut', 'stoneedge', 'aurasphere']},
			'Soos': {species: 'snorlax', ability: 'thickfat', item: 'leftovers', gender: 'M', moves: ['defensecurl', 'return', 'shiftgear', 'recover']},
			'Fiddleford McGucket': {species: 'scrafty', ability: 'regenerator', item: 'choiceband', gender: 'M', moves: ['crunch', 'closecombat', 'iciclecrash', 'playrough']},
			'Time Baby': {species: 'chansey', ability: 'filter', item: 'eviolite', gender: 'N', moves: ['softboiled', 'cottonguard', 'hypervoice', 'leechseed']},
			'Blendin': {species: 'beheeyem', ability: 'magicguard', item: 'lifeorb', gender: 'M', moves: ['psychic', 'sludgebomb', 'aurasphere', 'partingshot']},
			'Evil Rick': {species: 'alakazam', ability: 'regenerator', item: 'lifeorb', gender: 'M', moves: ['psystrike', 'recover', 'aurasphere', 'watergun'], shiny: true, signatureMove: 'Portal Gun'},
			'Evil Morty': {species: 'machoke', ability: 'furcoat', item: 'leftovers', gender: 'M', moves: ['bodyslam', 'highjumpkick', 'stockpile', 'kinesis'], shiny: true, signatureMove: 'Mind Control'},
			'King Flippy Nips': {species: 'palpitoad', ability: 'swiftswim', item: 'leftovers', gender: 'M', moves: ['raindance', 'freezedry', 'recover', 'thunderbolt']},
			'Mr. Lucius Needful': {species: 'banette', ability: 'magicguard', item: 'blacksludge', gender: 'M', moves: ['trick', 'shadowball', 'disable', 'destinybond']},
			'Snowball': {species: 'furfrou', ability: 'hugepower', item: 'lumberry', gender: 'M', moves: ['shiftgear', 'frustration', 'geargrind', 'drainpunch'], happiness: 0},
			'Mr. Jellybean': {species: 'ditto', ability: 'prankster', item: 'powerherb', gender: 'M', moves: ['geomancy', 'hyperbeam', 'shadowball', 'psystrike']},
			'Poncho': {species: 'golurk', ability: 'skilllink', item: 'kingsrock', gender: 'M', moves: ['iciclecrash', 'rockblast', 'iceshard', 'bulletseed']},
			'Galactic Fed Soldier': {species: 'pinsir', ability: 'aerilate', item: 'chartiberry', gender: 'M', moves: ['return', 'quickattack', 'megahorn', 'shadowclaw']},
			'Tammy': {species: 'jynx', ability: 'illusion', item: 'choicespecs', gender: 'F', moves: ['shadowball', 'psystrike', 'thunderbolt', 'surf']},
			'Bill Cipher': {species: 'zapdos', ability: 'magicbounce', item: 'brightpowder', gender: 'N', moves: ['thunderbolt', 'nastyplot', 'recover', 'thunder'], signatureMove: 'Bill Thunder'},
			"Lil' Gideon": {species: 'Snubbull', ability: 'hugepower', item: 'leftovers', gender: 'M', moves: ['playrough', 'stockpile', 'quickattack', 'earthquake']},
			'8-Ball': {species: 'rayquaza', ability: 'filter', item: 'lifeorb', gender: 'N', moves: ['dragonclaw', 'fly', 'return', 'superpower']},
			'Keyhole': {species: 'klefki', ability: 'levitate', item: 'leftovers', gender: 'N', moves: ['playrough', 'recover', 'bulkup', 'geargrind']},
			'Pacifier': {species: 'tauros', ability: 'flamebody', item: 'lifeorb', gender: 'N', moves: ['extremespeed', 'swordsdance', 'machpunch', 'suckerpunch']},
		};

		// Choose the proper side.
		if (this.seasonal && this.seasonal.side) {
			side = (this.seasonal.side === 'good' ? 'bad' : 'good');
		} else {
			side = (Math.random() > 0.5 ? 'good' : 'bad');
			this.seasonal = {'side': side};
		}

		// Shake the Pookémon pool. We want a mixed team, don't we?
		for (let i = 0; i < 6; i++) {
			pokemon = sides[side][i];
			set = mons[pokemon];
			set.name = pokemon;
			team.push(set);
		}

		return team;
	},

	randomSeasonalJubileeTeam: function (side) {
		let seasonalPokemonList = [
			'accelgor', 'aggron', 'arceusbug', 'ariados', 'armaldo', 'aurumoth', 'beautifly', 'beedrill', 'bellossom', 'blastoise',
			'butterfree', 'castform', 'charizard', 'cherrim', 'crawdaunt', 'crustle', 'delcatty', 'drifblim', 'durant',
			'dustox', 'escavalier', 'exeggutor', 'floatzel', 'forretress', 'galvantula', 'genesect', 'groudon', 'hariyama', 'heracross',
			'hooh', 'illumise', 'jumpluff', 'keldeo', 'kingler', 'krabby', 'kricketune', 'landorus', 'lapras',
			'leavanny', 'ledian', 'lilligant', 'ludicolo', 'lunatone', 'machamp', 'machoke', 'machop', 'magmar', 'magmortar',
			'malaconda', 'manaphy', 'maractus', 'masquerain', 'meganium', 'meloetta', 'moltres', 'mothim', 'ninetales',
			'ninjask', 'parasect', 'pelipper', 'pikachu', 'pinsir', 'politoed', 'raichu', 'rapidash', 'reshiram', 'rhydon',
			'rhyperior', 'roserade', 'rotomfan', 'rotomheat', 'rotommow', 'sawsbuck', 'scizor', 'scolipede', 'shedinja',
			'shuckle', 'slaking', 'snorlax', 'solrock', 'starmie', 'sudowoodo', 'sunflora', 'syclant', 'tentacool', 'tentacruel',
			'thundurus', 'tornadus', 'tropius', 'vanillish', 'vanillite', 'vanilluxe', 'venomoth', 'venusaur', 'vespiquen',
			'victreebel', 'vileplume', 'volbeat', 'volcarona', 'wailord', 'wormadam', 'wormadamsandy', 'wormadamtrash', 'yanmega', 'zapdos',
		];
		let team = [this.randomSet(this.getTemplate('delibird'), 0)];

		for (let i = 1; i < 6; i++) {
			let pokemon = this.sampleNoReplace(seasonalPokemonList);
			let template = Object.assign({}, this.getTemplate(pokemon));

			if (template.id in {'vanilluxe':1, 'vanillite':1, 'vanillish':1}) {
				template.randomBattleMoves = ['icebeam', 'weatherball', 'autotomize', 'flashcannon'];
			}
			if (template.id in {'pikachu':1, 'raichu':1}) {
				template.randomBattleMoves = ['thunderbolt', 'surf', 'substitute', 'nastyplot'];
			}
			if (template.id in {'rhydon':1, 'rhyperior':1}) {
				template.randomBattleMoves = ['surf', 'megahorn', 'earthquake', 'rockblast'];
			}
			if (template.id === 'reshiram') {
				template.randomBattleMoves = ['tailwhip', 'dragontail', 'irontail', 'aquatail'];
			}
			if (template.id === 'aggron') {
				template.randomBattleMoves = ['surf', 'earthquake', 'bodyslam', 'rockslide'];
			}
			if (template.id === 'hariyama') {
				template.randomBattleMoves = ['surf', 'closecombat', 'facade', 'fakeout'];
			}

			let set = this.randomSet(template, i);

			if (template.id === 'pelipper') {
				set.ability = 'raindish';
			}
			team.push(set);
		}

		return team;
	},

	randomSeasonalFireworksTeam: function (side) {
		let seasonalPokemonList = [
			"aerodactyl", "altaria", "archeops", "articuno", "azelf", "beautifly", "braviary", "bronzong",
			"butterfree", "carnivine", "charizard", "chingling", "claydol", "cresselia", "crobat", "cryogonal",
			"dragonite", "drifblim", "eelektross", "emolga", "fearow", "flygon", "giratinaorigin", "gligar",
			"gliscor", "gyarados", "honchkrow", "hooh", "hydreigon", "jumpluff", "landorus", "landorustherian",
			"latias", "latios", "lugia", "lunatone", "mandibuzz", "mantine", "masquerain", "mesprit", "mismagius",
			"moltres", "mothim", "ninjask", "noctowl", "noivern", "pelipper", "pidgeot", "rayquaza", "rotom",
			"rotomfan", "rotomfrost", "rotomheat", "rotommow", "rotomwash", "salamence", "scyther", "sigilyph",
			"skarmory", "solrock", "staraptor", "swanna", "swellow", "swoobat", "talonflame", "thundurus",
			"thundurustherian", "togekiss", "tornadus", "tornadustherian", "tropius", "unfezant", "uxie",
			"vespiquen", "vivillon", "weezing", "xatu", "yanma", "yanmega", "yveltal", "zapdos",
		];

		let forbiddenMoves = {
			bodyslam:1, bulldoze:1, dig:1, dive:1, earthpower:1, earthquake:1, electricterrain:1, fissure:1,
			firepledge:1, flyingpress:1, frenzyplant:1, geomancy:1, grassknot:1, grasspledge:1, grassyterrain:1,
			gravity:1, heatcrash:1, heavyslam:1, ingrain:1, landswrath:1, magnitude:1, matblock:1, mistyterrain:1,
			mudsport:1, muddywater:1, rototiller:1, seismictoss:1, slam:1, smackdown:1, spikes:1, stomp:1,
			substitute:1, surf:1, toxicspikes:1, thousandarrows:1, thousandwaves:1, waterpledge:1, watersport:1,
		};

		let team = [];
		let typeCount = {};
		let typeComboCount = {};
		let baseFormes = {};
		let uberCount = 0;
		let puCount = 0;
		let teamDetails = {};

		while (team.length < 6) {
			let pokemon = this.sampleNoReplace(seasonalPokemonList);
			let template = Object.assign({}, this.getTemplate(pokemon));

			if (!template.randomBattleMoves) template.randomBattleMoves = template.learnset;
			template.randomBattleMoves = template.randomBattleMoves.filter(move => !forbiddenMoves[move]);

			// Define sets for the Ground/Flying mons that don't have good Flying STAB
			if (template.id === 'gligar') {
				template.randomBattleMoves = ['stealthrock', 'roost', 'knockoff', ['uturn', 'toxic'][this.random(2)]];
			}
			if (template.id === 'gliscor') {
				template.randomBattleMoves = ['stealthrock', 'protect', 'knockoff', ['toxic', 'roost'][this.random(2)]];
			}
			if (template.id === 'landorus') {
				template.randomBattleMoves = ['sludgewave', 'knockoff', 'rockslide', ['focusblast', 'psychic'][this.random(2)]];
			}
			if (template.id === 'landorustherian') {
				template.randomBattleMoves = ['uturn', 'stealthrock', 'stoneedge', 'knockoff'];
			}

			let tier = template.tier;
			switch (tier) {
			case 'Uber':
				// Ubers are limited to 2 but have a 20% chance of being added anyway.
				if (uberCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'PU':
				// PUs are limited to 2 but have a 20% chance of being added anyway.
				if (puCount > 1 && this.random(5) >= 1) continue;
				break;
			}

			// Adjust rate for species with multiple formes
			switch (template.baseSpecies) {
			case 'Landorus':
				if (this.random(2) >= 1) continue;
				break;
			case 'Rotom':
				if (this.random(6) >= 1) continue;
				break;
			case 'Thundurus':
				if (this.random(2) >= 1) continue;
				break;
			case 'Tornadus':
				if (this.random(2) >= 1) continue;
				break;
			}

			let set = this.randomSet(template, team.length);

			let types = template.types;

			// Limit 2 of any type, except Flying because it's most common
			let skip = false;
			for (let t = 0; t < types.length; t++) {
				if (types[t] !== 'Flying' && typeCount[types[t]] > 1 && this.random(5) >= 1) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (typeCombo in typeComboCount) continue;

			// Okay, the set passes, add it to our team
			team.push(set);

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;

			// Increment type counters
			for (let t = 0; t < types.length; t++) {
				if (types[t] in typeCount) {
					typeCount[types[t]]++;
				} else {
					typeCount[types[t]] = 1;
				}
			}
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Increment Uber/NU counters
			if (tier === 'Uber') {
				uberCount++;
			} else if (tier === 'PU') {
				puCount++;
			}

			// Team has Mega/weather/hazards
			if (this.getItem(set.item).megaStone) teamDetails['megaCount'] = 1;
			if (set.ability === 'Snow Warning') teamDetails['hail'] = 1;
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails['rain'] = 1;
			if (set.ability === 'Sand Stream') teamDetails['sand'] = 1;
			if (set.moves.includes('stealthrock')) teamDetails['stealthRock'] = 1;
			if (set.moves.includes('defog') || set.moves.includes('rapidspin')) teamDetails['hazardClear'] = 1;
		}

		return team;
	},
};
