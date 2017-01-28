/**
 * Seasonal Ladders of Pokémon Showdown
 * The formats with the mod-like tweaks go into /data/formats.js
 * The team making scripts go into /data/scripts.js
 *
 * THIS IS A BACKUP FILE.
 */

'use strict';

exports.BattleScripts = {
	randomSeasonalSFTeam: function (side) {
		// This is the huge list of all the Pokemon in this seasonal
		let seasonalPokemonList = [
			'togepi', 'togetic', 'togekiss', 'happiny', 'chansey', 'blissey', 'exeggcute', 'exeggutor', 'lopunny', 'bunneary',
			'azumarill', 'bulbasaur', 'ivysaur', 'venusaur', 'caterpie', 'metapod', 'bellsprout', 'weepinbell', 'victreebel',
			'scyther', 'chikorita', 'bayleef', 'meganium', 'spinarak', 'natu', 'xatu', 'bellossom', 'politoed', 'skiploom',
			'larvitar', 'tyranitar', 'celebi', 'treecko', 'grovyle', 'sceptile', 'dustox', 'lotad', 'lombre', 'ludicolo',
			'breloom', 'electrike', 'roselia', 'gulpin', 'vibrava', 'flygon', 'cacnea', 'cacturne', 'cradily', 'keckleon',
			'tropius', 'rayquaza', 'turtwig', 'grotle', 'torterra', 'budew', 'roserade', 'carnivine', 'yanmega', 'leafeon',
			'shaymin', 'shayminsky', 'snivy', 'servine', 'serperior', 'pansage', 'simisage', 'swadloon', 'cottonee',
			'whimsicott', 'petilil', 'lilligant', 'basculin', 'maractus', 'trubbish', 'garbodor', 'solosis', 'duosion',
			'reuniclus', 'axew', 'fraxure', 'golett', 'golurk', 'virizion', 'tornadus', 'tornadustherian', 'burmy', 'wormadam',
			'kakuna', 'beedrill', 'sandshrew', 'nidoqueen', 'zubat', 'golbat', 'oddish', 'gloom', 'mankey', 'poliwrath',
			'machoke', 'machamp', 'doduo', 'dodrio', 'grimer', 'muk', 'kingler', 'cubone', 'marowak', 'hitmonlee', 'tangela',
			'mrmime', 'tauros', 'kabuto', 'dragonite', 'mewtwo', 'marill', 'hoppip', 'espeon', 'teddiursa', 'ursaring',
			'cascoon', 'taillow', 'swellow', 'pelipper', 'masquerain', 'azurill', 'minun', 'carvanha', 'huntail', 'bagon',
			'shelgon', 'salamence', 'latios', 'tangrowth', 'seismitoad', 'eelektross', 'druddigon', 'bronzor',
			'bronzong', 'murkrow', 'honchkrow', 'absol', 'pidove', 'tranquill', 'unfezant', 'dunsparce', 'jirachi',
			'deerling', 'sawsbuck', 'meloetta', 'cherrim', 'gloom', 'vileplume', 'bellossom', 'lileep', 'venusaur',
			'sunflora', 'gallade', 'vullaby',
		];

		// Pokemon that must be shiny to be green
		let mustBeShiny = {
			kakuna:1, beedrill:1, sandshrew:1, nidoqueen:1, zubat:1, golbat:1, oddish:1, gloom:1, mankey:1, poliwrath:1,
			machoke:1, machamp:1, doduo:1, dodrio:1, grimer:1, muk:1, kingler:1, cubone:1, marowak:1, hitmonlee:1, tangela:1,
			mrmime:1, tauros:1, kabuto:1, dragonite:1, mewtwo:1, marill:1, hoppip:1, espeon:1, teddiursa:1, ursaring:1,
			cascoon:1, taillow:1, swellow:1, pelipper:1, masquerain:1, azurill:1, minun:1, carvanha:1, huntail:1, bagon:1,
			shelgon:1, salamence:1, latios:1, tangrowth:1, seismitoad:1, jellicent:1, elektross:1, druddigon:1,
			bronzor:1, bronzong:1, golett:1, golurk:1,
		};
		// Pokemon that are in for their natural Super Luck ability
		let superLuckPokemon = {murkrow:1, honchkrow:1, absol:1, pidove:1, tranquill:1, unfezant:1};
		// Pokemon that are in for their natural Serene Grace ability
		let sereneGracePokemon = {dunsparce:1, jirachi:1, deerling:1, sawsbuck:1, meloetta:1};
		let team = [];

		// Now, let's make the team!
		for (let i = 0; i < 6; i++) {
			let pokemon = this.sampleNoReplace(seasonalPokemonList);
			let template = this.getTemplate(pokemon);
			let set = this.randomSet(template, i);

			// Everyone will have Metronome. EVERYONE. Luck everywhere!
			set.moves[0] = 'Metronome';
			// Also everyone will have either Softboiled, Barrage or Egg Bomb since easter!
			let secondMoveOptions = ['softboiled', 'barrage', 'eggbomb'];
			if (!secondMoveOptions.some(moveid => set.moves.includes(moveid))) {
				set.moves[1] = this.sampleNoReplace(secondMoveOptions);
			}
			// Don't worry, both attacks are boosted for this seasonal!

			// Also Super Luck or Serene Grace as an ability. Yay luck!
			if (template.id in superLuckPokemon) {
				set.ability = 'Super Luck';
			} else if (template.id in sereneGracePokemon) {
				set.ability = 'Serene Grace';
			} else {
				set.ability = ['Serene Grace', 'Super Luck'][this.random(2)];
			}

			// These Pokemon must always be shiny to be green
			if (template.id in mustBeShiny) {
				set.shiny = true;
			}

			// We don't want choice items
			if (['Choice Scarf', 'Choice Band', 'Choice Specs'].indexOf(set.item) > -1) {
				set.item = 'Metronome';
			}
			// Avoid Toxic Orb Breloom
			if (template.id === 'breloom' && set.item === 'Toxic Orb') {
				set.item = 'Lum Berry';
			}
			// Change gems to Grass Gem
			if (set.item.indexOf('Gem') > -1) {
				if (set.moves.indexOf('barrage') > -1 || set.moves.indexOf('eggbomb') > -1 || set.moves.indexOf('gigadrain') > -1) {
					set.item = 'Grass Gem';
				} else {
					set.item = 'Metronome';
				}
			}
			team.push(set);
		}

		return team;
	},
	randomSeasonalFFYTeam: function (side) {
		// Seasonal Pokemon list
		let seasonalPokemonList = [
			'missingno', 'koffing', 'weezing', 'slowpoke', 'slowbro', 'slowking', 'psyduck', 'spinda', 'whimsicott', 'liepard', 'sableye',
			'thundurus', 'tornadus', 'illumise', 'murkrow', 'purrloin', 'riolu', 'volbeat', 'rotomheat', 'rotomfan', 'haunter',
			'gengar', 'gastly', 'gliscor', 'venusaur', 'serperior', 'sceptile', 'shiftry', 'torterra', 'meganium', 'leafeon', 'roserade',
			'amoonguss', 'parasect', 'breloom', 'abomasnow', 'rotommow', 'wormadam', 'tropius', 'lilligant', 'ludicolo', 'cacturne',
			'vileplume', 'bellossom', 'victreebel', 'jumpluff', 'carnivine', 'sawsbuck', 'virizion', 'shaymin', 'arceusgrass', 'shayminsky',
			'tangrowth', 'pansage', 'maractus', 'cradily', 'celebi', 'exeggutor', 'ferrothorn', 'zorua', 'zoroark', 'dialga',
		];
		let mustHavePrankster = {whimsicott:1, liepard:1, sableye:1, thundurus:1, tornadus:1, illumise:1, volbeat:1, murkrow:1, purrloin:1, riolu:1, missingno:1};

		let team = [];
		// Now, let's make the team!
		for (let i = 0; i < 6; i++) {
			let pokemon = this.sampleNoReplace(seasonalPokemonList);
			let template = this.getTemplate(pokemon);
			let set = this.randomSet(template, i);
			// Chance to have prankster or illusion
			let dice = this.random(100);
			if (dice < 20) {
				set.ability = 'Prankster';
			} else if (dice < 60) {
				set.ability = 'Illusion';
			}
			if (template.id in mustHavePrankster) {
				set.ability = 'Prankster';
			}
			// Let's make the movesets for some Pokemon
			if (template.id === 'missingno') {
				// Some serious missingno nerfing so it's just a fun annoying Poke
				set.item = 'Flame Orb';
				set.level = 255;
				set.moves = ['Trick', 'Stored Power', 'Thunder Wave', 'Taunt', 'Encore', 'Attract', 'Charm', 'Leech Seed'];
				set.evs = {hp: 4, def: 0, spd: 0, spa: 0, atk: 255, spe: 255};
				set.ivs = {hp: 0, def: 0, spd: 0, spa: 0, atk: 0, spe: 0};
				set.nature = 'Brave';
			} else if (template.id === 'rotomheat') {
				set.item = 'Flame Orb';
				set.moves = ['Overheat', 'Volt Switch', 'Pain Split', 'Trick'];
			} else if (template.id === 'riolu') {
				set.item = 'Eviolite';
				set.moves = ['Copycat', 'Roar', 'Drain Punch', 'Substitute'];
				set.evs = {hp: 248, def: 112, spd: 96, spa: 0, atk: 0, spe: 52};
				set.nature = 'Careful';
			} else if (template.id in {gastly:1, haunter:1, gengar:1}) {
				// Gengar line, troll SubDisable set
				set.item = 'Leftovers';
				set.moves = ['Substitute', 'Disable', 'Shadow Ball', 'Focus Blast'];
				set.evs = {hp: 4, def: 0, spd: 0, spa: 252, atk: 0, spe: 252};
				set.nature = 'Timid';
			} else if (template.id === 'gliscor') {
				set.item = 'Toxic Orb';
				set.ability = 'Poison Heal';
				set.moves = ['Substitute', 'Protect', 'Toxic', 'Earthquake'];
				set.evs = {hp: 252, def: 184, spd: 0, spa: 0, atk: 0, spe: 72};
				set.ivs = {hp: 31, def: 31, spd: 31, spa: 0, atk: 31, spe: 31};
				set.nature = 'Impish';
			} else if (template.id === 'purrloin') {
				set.item = 'Eviolite';
			} else if (template.id === 'dialga') {
				set.level = 60;
			} else if (template.id === 'sceptile') {
				set.item = ['Lum Berry', 'Occa Berry', 'Yache Berry', 'Sitrus Berry'][this.random(4)];
			} else if (template.id === 'breloom' && set.item === 'Toxic Orb' && set.ability !== 'Poison Heal') {
				set.item = 'Muscle Band';
			}

			// This is purely for the lulz
			if (set.ability === 'Prankster' && !set.moves.includes('attract') && !set.moves.includes('charm') && this.random(2)) {
				set.moves[3] = ['Attract', 'Charm'][this.random(2)];
			}

			// For poison types with Illusion
			if (set.item === 'Black Sludge') {
				set.item = 'Leftovers';
			}

			team.push(set);
		}

		return team;
	},
	randomSeasonalMMTeam: function (side) {
		// Seasonal Pokemon list
		let seasonalPokemonList = [
			'cherrim', 'joltik', 'surskit', 'combee', 'kricketot', 'kricketune', 'ferrothorn', 'roserade', 'roselia', 'budew', 'clefairy', 'clefable',
			'deoxys', 'celebi', 'jirachi', 'meloetta', 'mareep', 'chatot', 'loudred', 'ludicolo', 'sudowoodo', 'yamask', 'chandelure', 'jellicent',
			'arceusghost', 'gengar', 'cofagrigus', 'giratina', 'rotom', 'kangaskhan', 'marowak', 'blissey', 'sawk', 'rhydon', 'rhyperior', 'rhyhorn',
			'politoed', 'gastrodon', 'magcargo', 'nidoking', 'espeon', 'muk', 'weezing', 'grimer', 'muk', 'swalot', 'crobat', 'hydreigon', 'arbok',
			'genesect', 'gliscor', 'aerodactyl', 'ambipom', 'drapion', 'drifblim', 'venomoth', 'spiritomb', 'rattata', 'grumpig', 'blaziken', 'mewtwo',
			'beautifly', 'skitty', 'venusaur', 'munchlax', 'wartortle', 'glaceon', 'manaphy', 'hitmonchan', 'liepard', 'sableye', 'zapdos', 'heatran',
			'treecko', 'piloswine', 'duskull', 'dusclops', 'dusknoir', 'spiritomb',
		];

		let team = [];

		// Now, let's make the team!
		for (let i = 0; i < 6; i++) {
			let pokemon = this.sampleNoReplace(seasonalPokemonList);
			let template = this.getTemplate(pokemon);
			let set = this.randomSet(template, i);
			// Use metronome because month of music
			if (set.item in {'Choice Scarf':1, 'Choice Band':1, 'Choice Specs':1, 'Life Orb':1}) {
				set.item = 'Metronome';
			// Berries over other items since spring
			} else if (set.item === 'Leftovers' || set.item === 'Black Sludge') {
				set.item = 'Sitrus Berry';
			} else if (template.id !== 'arceusghost' && set.item !== 'Chesto Berry') {
				if (this.getEffectiveness('Fire', template) >= 1) {
					set.item = 'Occa Berry';
				} else if (this.getEffectiveness('Ground', template) >= 1 && template.ability !== 'Levitate') {
					set.item = 'Shuca Berry';
				} else if (this.getEffectiveness('Ice', template) >= 1) {
					set.item = 'Yache Berry';
				} else if (this.getEffectiveness('Grass', template) >= 1) {
					set.item = 'Rindo Berry';
				} else if (this.getEffectiveness('Fighting', template) >= 1 && this.getImmunity('Fighting', template)) {
					set.item = 'Chople Berry';
				} else if (this.getEffectiveness('Rock', template) >= 1) {
					set.item = 'Charti Berry';
				} else if (this.getEffectiveness('Dark', template) >= 1) {
					set.item = 'Colbur Berry';
				} else if (this.getEffectiveness('Electric', template) >= 1 && this.getImmunity('Electric', template)) {
					set.item = 'Wacan Berry';
				} else if (this.getEffectiveness('Psychic', template) >= 1) {
					set.item = 'Payapa Berry';
				} else if (this.getEffectiveness('Flying', template) >= 1) {
					set.item = 'Coba Berry';
				} else if (this.getEffectiveness('Water', template) >= 1) {
					set.item = 'Passho Berry';
				} else {
					set.item = 'Enigma Berry';
				}
			}
			team.push(set);
		}

		return team;
	},
	randomSeasonalJJTeam: function (side) {
		// Seasonal Pokemon list
		let seasonalPokemonList = [
			'accelgor', 'aggron', 'arceusbug', 'ariados', 'armaldo', 'aurumoth', 'beautifly', 'beedrill', 'bellossom', 'blastoise',
			'butterfree', 'castform', 'charizard', 'cherrim', 'crawdaunt', 'crustle', 'delcatty', 'drifblim', 'durant',
			'dustox', 'escavalier', 'exeggutor', 'floatzel', 'forretress', 'galvantula', 'genesect', 'groudon', 'hariyama', 'heracross',
			'hooh', 'illumise', 'jumpluff', 'keldeo', 'kingler', 'krabby', 'kricketune', 'krillowatt', 'landorus', 'lapras',
			'leavanny', 'ledian', 'lilligant', 'ludicolo', 'lunatone', 'machamp', 'machoke', 'machop', 'magmar', 'magmortar',
			'malaconda', 'manaphy', 'maractus', 'masquerain', 'meganium', 'meloetta', 'moltres', 'mothim', 'ninetales',
			'ninjask', 'parasect', 'pelipper', 'pikachu', 'pinsir', 'politoed', 'raichu', 'rapidash', 'reshiram', 'rhydon',
			'rhyperior', 'roserade', 'rotomfan', 'rotomheat', 'rotommow', 'sawsbuck', 'scizor', 'scolipede', 'shedinja',
			'shuckle', 'slaking', 'snorlax', 'solrock', 'starmie', 'sudowoodo', 'sunflora', 'syclant', 'tentacool', 'tentacruel',
			'thundurus', 'tornadus', 'tropius', 'vanillish', 'vanillite', 'vanilluxe', 'venomoth', 'venusaur', 'vespiquen',
			'victreebel', 'vileplume', 'volbeat', 'volcarona', 'wailord', 'wormadam', 'wormadamsandy', 'wormadamtrash', 'yanmega', 'zapdos',
		];

		let team = [this.randomSet('delibird', 0)];

		// Now, let's make the team!
		for (let i = 1; i < 6; i++) {
			let pokemon = this.sampleNoReplace(seasonalPokemonList);
			let template = this.getTemplate(pokemon);
			let set = this.randomSet(template, i);
			if (template.id in {'vanilluxe':1, 'vanillite':1, 'vanillish':1}) {
				set.moves = ['icebeam', 'weatherball', 'autotomize', 'flashcannon'];
			}
			if (template.id in {'pikachu':1, 'raichu':1}) {
				set.moves = ['thunderbolt', 'surf', 'substitute', 'nastyplot'];
			}
			if (template.id in {'rhydon':1, 'rhyperior':1}) {
				set.moves = ['surf', 'megahorn', 'earthquake', 'rockblast'];
			}
			if (template.id === 'reshiram') {
				set.moves = ['tailwhip', 'dragontail', 'irontail', 'aquatail'];
			}
			if (template.id === 'aggron') {
				set.moves = ['surf', 'earthquake', 'bodyslam', 'rockslide'];
			}
			if (template.id === 'hariyama') {
				set.moves = ['surf', 'closecombat', 'facade', 'fakeout'];
			}
			team.push(set);
		}

		return team;
	},
	randomSeasonalJulyTeam: function (side) {
		// Seasonal Pokemon list
		let seasonalPokemonList = [
			'alomomola', 'arcanine', 'arceusfire', 'basculin', 'beautifly', 'beedrill', 'blastoise', 'blaziken', 'bouffalant',
			'braviary', 'camerupt', 'carracosta', 'castform', 'celebi', 'chandelure', 'charizard', 'charmander',
			'charmeleon', 'cherrim', 'chimchar', 'combusken', 'corsola', 'crawdaunt', 'crustle', 'cyndaquil', 'darmanitan',
			'darumaka', 'drifblim', 'emboar', 'entei', 'escavalier', 'exeggutor', 'fearow', 'ferrothorn',
			'flareon', 'galvantula', 'genesect', 'groudon', 'growlithe', 'hariyama', 'heatmor', 'heatran', 'heracross',
			'hitmonchan', 'hitmonlee', 'hitmontop', 'honchkrow', 'hooh', 'houndoom', 'houndour', 'infernape', 'jirachi',
			'jumpluff', 'kingler', 'kricketune', 'lampent', 'lanturn', 'lapras', 'larvesta', 'leafeon', 'leavanny', 'ledian',
			'lilligant', 'litwick', 'lunatone', 'magby', 'magcargo', 'magmar', 'magmortar', 'mantine', 'meganium', 'miltank',
			'moltres', 'monferno', 'murkrow', 'ninetales', 'numel', 'omastar', 'pansear', 'pignite', 'politoed', 'poliwrath',
			'ponyta', 'primeape', 'quilava', 'raikou', 'rapidash', 'reshiram', 'rotomfan', 'rotomheat', 'rotommow', 'rotomwash',
			'scizor', 'scyther', 'sharpedo', 'sigilyph', 'simisear', 'skarmory', 'slugma', 'solrock', 'stantler', 'staraptor',
			'stoutland', 'suicune', 'sunflora', 'swoobat', 'tauros', 'tepig', 'thundurus', 'thundurustherian', 'torchic',
			'torkoal', 'toxicroak', 'tropius', 'typhlosion', 'venomoth', 'venusaur', 'vespiquen', 'victini', 'victreebel',
			'vileplume', 'volcarona', 'vulpix', 'wailord', 'whimsicott', 'xatu', 'yanmega', 'zapdos', 'zebstrika', 'zoroark',
		];

		// Create the specific Pokémon for the user
		let crypto = require('crypto');
		let hash = parseInt(crypto.createHash('md5').update(toId(side.name)).digest('hex').substr(0, 8), 16);
		let random = (5 * hash + 6) % 649;
		// Find the Pokemon. Castform by default because lol
		let pokeName = 'castform';
		for (let p in this.data.Pokedex) {
			if (this.data.Pokedex[p].num === random) {
				pokeName = p;
				break;
			}
		}

		let team = [this.randomSet(this.getTemplate(pokeName), 0)];

		// Now, let's make the team!
		for (let i = 1; i < 6; i++) {
			let pokemon = this.sampleNoReplace(seasonalPokemonList);
			let template = this.getTemplate(pokemon);
			let set = this.randomSet(template, i);
			team.push(set);
		}

		return team;
	},
	randomSeasonalAATeam: function (side) {
		// First we choose the lead
		let lead = (this.random(100) < 50) ? 'groudon' : 'kyogre';
		let groudonsSailors = [
			'alakazam', 'arbok', 'arcanine', 'arceusfire', 'bibarel', 'bisharp', 'blaziken', 'blissey', 'cacturne',
			'chandelure', 'chansey', 'charizard', 'cloyster', 'conkeldurr', 'druddigon', 'electivire',
			'emboar', 'entei', 'exploud', 'gardevoir', 'genesect', 'golurk', 'hariyama', 'heatran', 'infernape',
			'jellicent', 'lilligant', 'lucario', 'luxray', 'machamp', 'machoke', 'machop', 'magmortar', 'meloetta',
			'onix', 'poliwrath', 'primeape', 'smeargle', 'snorlax', 'toxicroak', 'typhlosion', 'weezing',
		];
		let kyogresPirates = [
			'absol', 'arceusflying', 'cofagrigus', 'crobat', 'darkrai', 'delibird', 'dragonite', 'ducklett',
			'garchomp', 'gengar', 'golem', 'gothitelle', 'honchkrow', 'krookodile', 'landorus', 'ludicolo',
			'mandibuzz', 'pelipper', 'pidgeot', 'pidgey', 'sableye', 'scizor', 'scyther', 'sharpedo', 'shiftry',
			'skarmory', 'staraptor', 'swanna', 'thundurus', 'thundurustherian', 'tornadus', 'tornadustherian',
			'tyranitar', 'volcarona', 'wailord', 'weavile', 'whimsicott', 'wingull', 'zoroark',
		];

		// Add the lead.
		let team = [this.randomSet(this.getTemplate(lead), 0)];

		// Now, let's make the team. Each side has a different ability.
		let teamPool;
		let ability = 'Illuminate', moveToGet;
		if (lead === 'kyogre') {
			ability = 'Thick Fat';
			teamPool = kyogresPirates;
			moveToGet = 'hurricane';
		} else {
			let dice = this.random(100);
			ability = (dice < 33) ? 'Water Absorb' : 'Tinted Lens';
			teamPool = groudonsSailors;
			moveToGet = 'vcreate';
		}
		for (let i = 1; i < 6; i++) {
			let pokemon = this.sampleNoReplace(teamPool);
			let template = this.getTemplate(pokemon);
			let set = this.randomSet(template, i);
			set.ability = (template.baseSpecies && template.baseSpecies === 'Arceus') ? 'Multitype' : ability;
			let hasMoves = {};
			for (let j = 0; j < set.moves.length; j++) {
				if (set.moves[j] === 'dynamicpunch') set.moves[j] = 'closecombat';
				hasMoves[set.moves[j]] = true;
			}
			if (!(moveToGet in hasMoves)) {
				set.moves[3] = moveToGet;
			}
			if (set.item === 'Damp Rock' && !hasMoves['raindance']) set.item = 'Life Orb';
			if (set.item === 'Heat Rock' && !hasMoves['sunnyday']) set.item = 'Life Orb';
			team.push(set);
		}

		return team;
	},
	randomSeasonalSSTeam: function (side) {
		let fashion = [
			'Choice Scarf', 'Choice Specs', 'Silk Scarf', 'Wise Glasses', 'Choice Band', 'Wide Lens',
			'Zoom Lens', 'Destiny Knot', 'BlackGlasses', 'Expert Belt', 'Black Belt', 'Macho Brace',
			'Focus Sash', "King's Rock", 'Muscle Band', 'Mystic Water', 'Binding Band', 'Rocky Helmet',
		];

		let crypto = require('crypto');
		let hash = parseInt(crypto.createHash('md5').update(toId(side.name)).digest('hex').slice(0, 8), 16);

		let randoms = new Set([
			(13 * hash + 11) % 649 || 1,
			(18 * hash + 66) % 649 || 1,
			(25 * hash + 73) % 649 || 1,
			(1 * hash + 16) % 649 || 1,
			(23 * hash + 132) % 649 || 1,
			(5 * hash + 6) % 649 || 1,
		]);

		if (randoms.size < 6) {
			// Just in case the randoms generated the same number... highly unlikely
			let defaults = ['politoed', 'toxicroak', 'articuno', 'jirachi', 'tentacruel', 'liepard'];
			for (let i = randoms.size; i < 6; i++) {
				randoms.add(this.getTemplate(this.sampleNoReplace(defaults)).num);
			}
		}

		let team = [];

		for (let p in this.data.Pokedex) {
			if (!randoms.has(this.data.Pokedex[p].num)) continue;
			let set = this.randomSet(this.getTemplate(p), team.length);
			if (!fashion.includes(set.item)) set.item = fashion[this.random(fashion.length)];
			team.push(set);
			randoms.delete(this.data.Pokedex[p].num);
			if (!randoms.size) break;
		}

		return team;
	},
	randomSeasonalOFTeam: function (side) {
		let seasonalPokemonList = [
			'absol', 'alakazam', 'banette', 'beheeyem', 'bellossom', 'bisharp', 'blissey', 'cacturne', 'carvanha', 'chandelure',
			'cofagrigus', 'conkeldurr', 'crawdaunt', 'darkrai', 'deino', 'drapion', 'drifblim', 'drifloon', 'dusclops',
			'dusknoir', 'duskull', 'electivire', 'frillish', 'froslass', 'gallade', 'gardevoir', 'gastly', 'gengar', 'giratina',
			'golett', 'golurk', 'gothitelle', 'hariyama', 'haunter', 'hitmonchan', 'hitmonlee', 'hitmontop', 'honchkrow', 'houndoom',
			'houndour', 'hydreigon', 'hypno', 'infernape', 'jellicent', 'jynx', 'krokorok', 'krookodile', 'lampent', 'leavanny',
			'liepard', 'lilligant', 'litwick', 'lopunny', 'lucario', 'ludicolo', 'machamp', 'magmortar', 'mandibuzz', 'medicham',
			'meloetta', 'mienshao', 'mightyena', 'misdreavus', 'mismagius', 'mrmime', 'murkrow', 'nuzleaf', 'pawniard', 'poochyena',
			'probopass', 'purrloin', 'roserade', 'rotom', 'sableye', 'sandile', 'sawk', 'scrafty', 'scraggy', 'sharpedo', 'shedinja',
			'shiftry', 'shuppet', 'skuntank', 'sneasel', 'snorlax', 'spiritomb', 'stunky', 'throh', 'toxicroak', 'tyranitar', 'umbreon',
			'vullaby', 'weavile', 'wobbuffet', 'yamask', 'zoroark', 'zorua', 'zweilous',
		];

		let team = [];

		for (let i = 0; i < 6; i++) {
			let pokemon = this.sampleNoReplace(seasonalPokemonList);
			let template = this.getTemplate(pokemon);
			let set = this.randomSet(template, i);
			let trickIndex = set.moves.indexOf('trick');
			if (trickIndex < 0 || trickIndex === 2) {
				// Force Trick into last slot. Third is reserved for Present.
				set.moves[3] = 'trick';
			}
			set.moves[2] = 'present';
			team.push(set);
		}

		return team;
	},
	randomSeasonalTTTeam: function (side) {
		let seasonalPokemonList = [
			'alakazam', 'machamp', 'hypno', 'hitmonlee', 'hitmonchan', 'mrmime', 'jynx', 'hitmontop', 'hariyama', 'sableye', 'medicham',
			'toxicroak', 'electivire', 'magmortar', 'conkeldurr', 'throh', 'sawk', 'gothitelle', 'beheeyem', 'bisharp', 'volbeat', 'illumise',
			'spinda', 'cacturne', 'infernape', 'lopunny', 'lucario', 'mienshao', 'pidgeot', 'fearow', 'dodrio', 'aerodactyl', 'noctowl',
			'crobat', 'xatu', 'skarmory', 'swellow', 'staraptor', 'honchkrow', 'chatot', 'unfezant', 'sigilyph', 'braviary', 'mandibuzz',
			'farfetchd', 'pelipper', 'altaria', 'togekiss', 'swoobat', 'archeops', 'swanna', 'weavile', 'gallade', 'gardevoir', 'ludicolo',
			'snorlax', 'wobbuffet', 'meloetta', 'blissey', 'landorus', 'tornadus', 'golurk', 'bellossom', 'lilligant', 'probopass', 'roserade',
			'leavanny', 'zapdos', 'moltres', 'articuno', 'delibird', 'pancham', 'pangoro', 'hawlucha', 'noibat', 'noivern', 'fletchling',
			'fletchinder', 'talonflame', 'vivillon', 'yveltal',
		];

		let team = [];
		for (let i = 0; i < 6; i++) {
			let speciesId = this.sampleNoReplace(seasonalPokemonList);
			let set = this.randomSet(speciesId, i);
			if (speciesId === 'talonflame') set.level = 74;
			team.push(set);
		}
		return team;
	},
	randomSeasonalCCTeam: function (side) {
		let seasonalPokemonList = [
			'raichu', 'nidoqueen', 'nidoking', 'clefable', 'wigglytuff', 'rapidash', 'dewgong', 'cloyster', 'exeggutor', 'starmie', 'jynx',
			'lapras', 'snorlax', 'articuno', 'azumarill', 'granbull', 'delibird', 'stantler', 'miltank', 'blissey', 'swalot', 'lunatone',
			'castform', 'chimecho', 'glalie', 'walrein', 'regice', 'jirachi', 'bronzong', 'chatot', 'abomasnow', 'weavile', 'togekiss',
			'glaceon', 'probopass', 'froslass', 'rotom-frost', 'uxie', 'mesprit', 'azelf', 'victini', 'vanilluxe', 'sawsbuck', 'beartic',
			'cryogonal', 'chandelure', 'gardevoir', 'amaura', 'aurorus', 'bergmite', 'avalugg',
		];

		let team = [];
		for (let i = 0; i < 6; i++) {
			let set = this.randomSet(this.sampleNoReplace(seasonalPokemonList), i);
			set.moves[3] = 'present';
			team.push(set);
		}
		return team;
	},
	randomSeasonalWinterTeam: function (side) {
		let seasonalPokemonList = [
			'raichu', 'nidoqueen', 'nidoking', 'clefable', 'wigglytuff', 'rapidash', 'dewgong', 'cloyster', 'exeggutor', 'starmie', 'jynx',
			'lapras', 'snorlax', 'articuno', 'azumarill', 'granbull', 'delibird', 'stantler', 'miltank', 'blissey', 'swalot', 'lunatone',
			'castform', 'chimecho', 'glalie', 'walrein', 'regice', 'jirachi', 'bronzong', 'chatot', 'abomasnow', 'weavile', 'togekiss',
			'glaceon', 'probopass', 'froslass', 'rotom-frost', 'uxie', 'mesprit', 'azelf', 'victini', 'vanilluxe', 'sawsbuck', 'beartic',
			'cryogonal', 'chandelure', 'gardevoir', 'amaura', 'aurorus', 'bergmite', 'avalugg', 'xerneas', 'kyogre', 'rotom-wash',
		];

		let team = [];
		for (let i = 0; i < 6; i++) {
			let set = this.randomSet(this.sampleNoReplace(seasonalPokemonList), i);
			set.level *= 50;
			team.push(set);
		}
		return team;
	},
	randomSeasonalFFTeam: function (side) {
		let seasonalPokemonList = [
			'charizard', 'ninetales', 'houndoom', 'arceusfire', 'arcanine', 'moltres', 'rapidash', 'magmar', 'quilava', 'typhlosion',
			'entei', 'hooh', 'blaziken', 'rotomheat', 'chandelure', 'magcargo', 'reshiram', 'zekrom', 'heatran', 'arceusdragon',
			'arceusfighting', 'seadra', 'kingdra', 'gyarados', 'dunsparce', 'milotic', 'drapion', 'growlithe', 'paras', 'parasect',
			'magikarp', 'suicune', 'raikou', 'absol', 'spiritomb', 'horsea', 'ponyta', 'blitzle', 'zebstrika',
		];

		let team = [];
		for (let i = 0; i < 6; i++) {
			let speciesId = this.sampleNoReplace(seasonalPokemonList);
			let set = this.randomSet(speciesId, i);
			if (speciesId === 'gyarados') set.shiny = true;
			set.moves[3] = 'explosion';
			team.push(set);
		}
		return team;
	},
	randomSeasonalSBTeam: function (side) {
		let crypto = require('crypto');
		let date = new Date();
		let hash = parseInt(crypto.createHash('md5').update(toId(side.name)).digest('hex').slice(0, 8), 16) + date.getDate();

		let randoms = new Set([
			(13 * hash + 6) % 721 || 1,
			(18 * hash + 12) % 721 || 1,
			(25 * hash + 24) % 721 || 1,
			(1 * hash + 48) % 721 || 1,
			(23 * hash + 96) % 721 || 1,
			(5 * hash + 192) % 721 || 1,
		]);

		if (randoms.size < 6) {
			// There is a very improbable chance in which two hashes collide, leaving the player with five Pokémon. Fix that.
			let defaults = ['zapdos', 'venusaur', 'aegislash', 'heatran', 'unown', 'liepard'];
			for (let i = randoms.size; i < 6; i++) {
				randoms.add(this.getTemplate(this.sampleNoReplace(defaults)).num);
			}
		}

		let team = [];

		for (let p in this.data.Pokedex) {
			if (!randoms.has(this.data.Pokedex[p].num)) continue;
			let set = this.randomSet(this.getTemplate(p), team.length);
			set.moves[3] = 'present';
			team.push(set);
			randoms.delete(this.data.Pokedex[p].num);
			if (!randoms.size) break;
		}

		return team;
	},
	randomSeasonalSleighTeam: function (side) {
		// All Pokémon in this Seasonal. They are meant to pull the sleigh.
		let seasonalPokemonList = [
			'abomasnow', 'accelgor', 'aggron', 'arbok', 'arcanine', 'arceus', 'ariados', 'armaldo', 'audino', 'aurorus', 'avalugg',
			'barbaracle', 'bastiodon', 'beartic', 'bellossom', 'bibarel', 'bisharp', 'blastoise', 'blaziken', 'bouffalant', 'cacturne',
			'camerupt', 'carracosta', 'cherrim', 'cobalion', 'conkeldurr', 'crawdaunt', 'crustle', 'darmanitan', 'dedenne', 'delcatty',
			'delibird', 'dialga', 'dodrio', 'donphan', 'drapion', 'druddigon', 'dunsparce', 'durant', 'eevee', 'electivire', 'electrode',
			'emboar', 'entei', 'espeon', 'exeggutor', 'exploud', 'feraligatr', 'flareon', 'furfrou', 'furret', 'gallade', 'galvantula',
			'garbodor', 'garchomp', 'gastrodon', 'genesect', 'gigalith', 'girafarig', 'glaceon', 'glaceon', 'glalie', 'gogoat', 'golem',
			'golurk', 'granbull', 'groudon', 'grumpig', 'hariyama', 'haxorus', 'heatmor', 'heatran', 'heliolisk', 'hippowdon', 'hitmonchan',
			'hitmonlee', 'hitmontop', 'houndoom', 'hypno', 'infernape', 'jolteon', 'jynx', 'kabutops', 'kangaskhan', 'kecleon', 'keldeo',
			'kingler', 'krookodile', 'kyurem', 'kyuremblack', 'kyuremwhite', 'lapras', 'leafeon', 'leavanny', 'lickilicky', 'liepard',
			'lilligant', 'linoone', 'lopunny', 'lucario', 'ludicolo', 'luxray', 'machamp', 'magcargo', 'magmortar', 'malamar', 'mamoswine',
			'manectric', 'marowak', 'meganium', 'meowstic', 'metagross', 'mewtwo', 'mightyena', 'miltank', 'nidoking', 'nidoqueen',
			'ninetales', 'octillery', 'omastar', 'pachirisu', 'palkia', 'pangoro', 'parasect', 'persian', 'poliwrath', 'primeape', 'purugly',
			'pyroar', 'raichu', 'raikou', 'rampardos', 'rapidash', 'raticate', 'regice', 'regigigas', 'regirock', 'registeel', 'reshiram',
			'rhydon', 'rhyperior', 'samurott', 'sandslash', 'sawk', 'sawsbuck', 'sceptile', 'scolipede', 'seismitoad', 'shaymin', 'shiftry',
			'simipour', 'simisage', 'simisear', 'skuntank', 'slaking', 'slowbro', 'slowking', 'slurpuff', 'spinda', 'stantler', 'steelix',
			'stoutland', 'sudowoodo', 'suicune', 'sunflora', 'swampert', 'sylveon', 'tangrowth', 'tauros', 'terrakion', 'throh', 'torkoal',
			'torterra', 'typhlosion', 'tyrantrum', 'umbreon', 'ursaring', 'ursaring', 'vaporeon', 'venusaur', 'vileplume', 'virizion',
			'whimsicott', 'wobbuffet', 'xerneas', 'zangoose', 'zebstrika', 'zekrom', 'zoroark',
		];

		// We create the team now
		let team = [];
		for (let i = 0; i < 6; i++) {
			let pokemon = this.sampleNoReplace(seasonalPokemonList);
			let template = this.getTemplate(pokemon);
			let set = this.randomSet(template, i);

			let presentIndex = 3;
			let currentMove = set.moves[presentIndex];
			// We preserve top priority moves over the rest.
			if (set.item === 'Heat Rock' && currentMove === 'sunnyday' || currentMove === 'geomancy' || currentMove === 'rest' && set.item === 'chestoberry' || pokemon === 'haxorus' && currentMove === 'dragondance' || set.ability === 'Guts' && currentMove === 'facade') {
				presentIndex = 2;
			}
			set.moves[presentIndex] = 'present';

			if (this.getItem(set.item).megaStone) set.item = 'Life Orb';
			team.push(set);
		}

		// Done, return the result.
		return team;
	},

	randomSeasonalSFTTeam: function (side) {
		// Let's get started!
		let lead = 'gallade';
		let team = [];
		let set = {};
		let megaCount = 0;

		// If the other team has been chosen, we get its opposing force.
		if (this.seasonal && this.seasonal.scenario) {
			lead = {'lotr':'reshiram', 'redblue':'pidgeot', 'terminator':'alakazam', 'gen1':'gengar', 'desert':'probopass', 'shipwreck':'machamp'}[this.seasonal.scenario];
		} else {
			// First team being generated, let's get one of the possibilities.
			// We need a fix lead for obvious reasons.
			lead = ['gallade', 'pikachu', 'genesect', 'gengar', 'groudon', 'kyogre'][this.random(6)];
			this.seasonal = {'scenario': {'gallade':'lotr', 'pikachu':'redblue', 'genesect':'terminator', 'gengar':'gen1', 'groudon':'desert', 'kyogre':'shipwreck'}[lead]};
		}

		// Gen 1 mons and blue/red teams have their own set maker.
		if (lead === 'pikachu') {
			// Add Red's team
			team = [
				{
					name: 'Pika',
					species: 'pikachu',
					moves: ['volttackle', 'brickbreak', 'irontail', 'fakeout'],
					evs: {hp:0, atk:252, def:0, spa:0, spd:0, spe:252},
					ivs: {hp:31, atk:31, def:31, spa:31, spd:31, spe:31},
					item: 'lightball',
					level: 90,
					shiny: false,
					nature: 'Jolly',
					ability: 'Lightning Rod',
				},
				{
					name: 'Lapras',
					moves: ['hydropump', 'icebeam', 'thunderbolt', 'iceshard'],
					evs: {hp:252, atk:4, def:0, spa:252, spd:0, spe:0},
					ivs: {hp:31, atk:0, def:31, spa:31, spd:31, spe:31},
					item: 'leftovers',
					level: 80,
					shiny: false,
					nature: 'Quiet',
					ability: 'Water Absorb',
				},
				{
					name: 'Snorlax',
					moves: ['bodyslam', 'crunch', 'earthquake', 'seedbomb'],
					evs: {hp:252, atk:252, def:4, spa:0, spd:0, spe:0},
					ivs: {hp:31, atk:31, def:31, spa:31, spd:31, spe:31},
					item: 'leftovers',
					level: 82,
					shiny: false,
					nature: 'Adamant',
					ability: 'Thick Fat',
				},
				{
					name: 'Venusaur',
					moves: ['leafstorm', 'earthquake', 'sludgebomb', 'sleeppowder'],
					evs: {hp:252, atk:4, def:0, spa:252, spd:0, spe:0},
					ivs: {hp:31, atk:0, def:31, spa:31, spd:31, spe:31},
					item: 'whiteherb',
					level: 84,
					shiny: false,
					nature: 'Quiet',
					ability: 'Overgrow',
				},
				{
					name: 'Charizard',
					moves: ['fireblast', 'focusblast', 'airslash', 'dragonpulse'],
					evs: {hp:4, atk:0, def:0, spa:252, spd:0, spe:252},
					ivs: {hp:31, atk:0, def:31, spa:31, spd:31, spe:31},
					item: 'charizarditey',
					level: 73,
					shiny: false,
					nature: 'Timid',
					ability: 'Solar Power',
				},
				{
					name: 'Blastoise',
					moves: ['waterspout', 'hydropump', 'flashcannon', 'focusblast'],
					evs: {hp:252, atk:0, def:4, spa:252, spd:0, spe:0},
					ivs: {hp:31, atk:0, def:31, spa:31, spd:31, spe:31},
					item: 'choicescarf',
					level: 84,
					shiny: false,
					nature: 'Modest',
					ability: 'Torrent',
				},
			];
		} else if (lead === 'pidgeot') {
			// Add Blue's team
			team = [
				{
					name: 'Pidgeot',
					moves: ['hurricane', 'heatwave', 'roost', 'hiddenpowerground'],
					evs: {hp:4, atk:0, def:0, spa:252, spd:0, spe:252},
					ivs: {hp:31, atk:31, def:31, spa:30, spd:30, spe:31},
					item: 'pidgeotite',
					level: 76,
					shiny: false,
					nature: 'Timid',
					ability: 'Keen Eye',
				},
				{
					name: 'Exeggutor',
					moves: ['gigadrain', 'sunnyday', 'leechseed', 'substitute'],
					evs: {hp:252, atk:0, def:4, spa:252, spd:0, spe:0},
					ivs: {hp:31, atk:0, def:31, spa:31, spd:31, spe:31},
					item: 'sitrusberry',
					level: 85,
					shiny: false,
					nature: 'Modest',
					ability: 'Harvest',
				},
				{
					name: 'Gyarados',
					moves: ['waterfall', 'earthquake', 'icefang', 'dragondance'],
					evs: {hp:4, atk:252, def:0, spa:0, spd:0, spe:252},
					ivs: {hp:31, atk:31, def:31, spa:31, spd:31, spe:31},
					item: 'leftovers',
					level: 80,
					shiny: false,
					nature: 'Adamant',
					ability: 'Intimidate',
				},
				{
					name: 'Alakazam',
					moves: ['psychic', 'focusblast', 'shadowball', 'reflect'],
					evs: {hp:4, atk:0, def:0, spa:252, spd:0, spe:252},
					ivs: {hp:31, atk:0, def:31, spa:31, spd:31, spe:31},
					item: 'lifeorb',
					level: 75,
					shiny: false,
					nature: 'Modest',
					ability: 'Magic Guard',
				},
				{
					name: 'Arcanine',
					moves: ['flareblitz', 'closecombat', 'wildcharge', 'extremespeed'],
					evs: {hp:4, atk:252, def:0, spa:0, spd:0, spe:252},
					ivs: {hp:31, atk:31, def:31, spa:31, spd:31, spe:31},
					item: 'expertbelt',
					level: 80,
					shiny: false,
					nature: 'Jolly',
					ability: 'Flash Fire',
				},
				{
					name: 'Machamp',
					moves: ['superpower', 'stoneedge', 'firepunch', 'bulletpunch'],
					evs: {hp:252, atk:252, def:4, spa:0, spd:0, spe:0},
					ivs: {hp:31, atk:31, def:31, spa:31, spd:31, spe:31},
					item: 'whiteherb',
					level: 86,
					shiny: false,
					nature: 'Adamant',
					ability: 'No Guard',
				},
			];
		} else if (lead === 'gengar') {
			// Add gen 1 team.
			this.gen = 1;

			// Pre-prepare sets.
			let sets = {
				gengar: {
					name: 'GENGAR',
					moves: ['hypnosis', 'explosion', 'thunderbolt', ['megadrain', 'psychic'][this.random(2)]],
				},
				tauros: {
					name: 'TAUROS',
					moves: ['bodyslam', 'hyperbeam', 'blizzard', 'earthquake'],
				},
				alakazam: {
					name: 'ALAKAZAM',
					moves: ['psychic', 'recover', 'thunderwave', ['reflect', 'seismictoss'][this.random(2)]],
				},
				chansey: {
					name: 'CHANSEY',
					moves: ['softboiled', 'thunderwave', 'icebeam', ['thunderbolt', 'counter'][this.random(2)]],
				},
				exeggutor: {
					name: 'EXEGGUTOR',
					moves: ['sleeppowder', 'psychic', 'explosion', ['doubleedge', 'megadrain', 'stunspore'][this.random(3)]],
				},
				rhydon: {
					name: 'RHYDON',
					moves: ['earthquake', 'rockslide', 'substitute', 'bodyslam'],
				},
				golem: {
					name: 'GOLEM',
					moves: ['bodyslam', 'earthquake', 'rockslide', 'explosion'],
				},
				jynx: {
					name: 'JYNX',
					moves: ['psychic', 'lovelykiss', 'blizzard', 'mimic'],
				},
				lapras: {
					name: 'LAPRAS',
					moves: ['confuseray', ['thunderbolt', 'rest'][this.random(2)], ['blizzard', 'icebeam'][this.random(2)], 'bodyslam'],
				},
				zapdos: {
					name: 'ZAPDOS',
					moves: ['thunderbolt', 'thunderwave', 'drillpeck', 'agility'],
				},
				slowbro: {
					name: 'SLOWBRO',
					moves: ['amnesia', 'rest', 'surf', 'thunderwave'],
				},
				persian: {
					name: 'PERSIAN',
					moves: ['slash', 'bubblebeam', 'hyperbeam', ['bodyslam', 'screech', 'thunderbolt'][this.random(3)]],
				},
				cloyster: {
					name: 'CLOYSTER',
					moves: ['clamp', 'blizzard', 'hyperbeam', 'explosion'],
				},
				starmie: {
					name: 'STARMIE',
					moves: ['blizzard', 'thunderbolt', 'recover', 'thunderwave'],
				},
				snorlax: {
					name: 'SNORLAX',
					moves: [
						['amnesia', ['blizzard', 'icebeam'][this.random(2)], ['bodyslam', 'thunderbolt'][this.random(2)], ['rest', 'selfdestruct'][this.random(2)]],
						['bodyslam', 'hyperbeam', ['earthquake', 'surf'][this.random(2)], 'selfdestruct'],
					][this.random(2)],
				},
				dragonite: {
					name: 'DRAGONITE',
					moves: ['agility', 'hyperbeam', 'wrap', ['blizzard', 'surf'][this.random(2)]],
				},
			};
			let leadOptions = ['alakazam', 'jynx', 'gengar', 'exeggutor'];
			lead = this.sampleNoReplace(leadOptions);

			let partySetsIndex = ['tauros', 'chansey', 'rhydon', 'golem', 'lapras', 'zapdos', 'slowbro', 'persian', 'cloyster', 'starmie', 'snorlax', 'dragonite'];
			partySetsIndex = leadOptions.concat(partySetsIndex);

			for (let i = 0; i < 6; i++) {
				set = sets[i ? this.sampleNoReplace(partySetsIndex) : lead];
				set.ability = 'None';
				set.evs = {hp:255, atk:255, def:126, spa:255, spd:126, spe:255};
				set.ivs = {hp:30, atk:30, def:30, spa:30, spd:30, spe:30};
				set.item = '';
				set.level = 100;
				set.shiny = false;
				set.species = toId(set.name);
				team.push(set);
			}
		} else if (lead === 'gallade') {
			// This is the Aragorn team from the LOTR battle. Special set for Aragorn.
			set = this.randomSet(this.getTemplate(lead));
			set.species = toId(set.name);
			set.name = 'Aragorn';
			set.item = 'Galladite';
			set.moves = ['psychocut', 'bulkup', ['drainpunch', 'closecombat'][this.random(2)], ['nightslash', 'leafblade', 'xscissor', 'stoneedge', 'doubleedge', 'knockoff'][this.random(6)]];
			set.level = 72;
			team.push(set);

			// We get one elf or bard.
			let elf = ['jynx', 'azelf', 'celebi', 'victini', 'landorustherian'][this.random(5)];
			set = this.randomSet(this.getTemplate(elf));
			set.species = toId(set.name);
			set.name = {'jynx':'Galadriel', 'azelf':'Legolas', 'celebi':'Celeborn', 'victini':'Elrond', 'landorustherian':'Bard'}[elf];
			if (elf === 'landorustherian') {
				set.item = 'Earth Plate';
				set.moves = ['thousandarrows', 'thousandwaves', 'uturn', 'superpower'];
			}
			team.push(set);

			// Now we add some other characters from the fellowship.
			let fellowship = {'hoopa':'Gandalf', 'baltoy':'Frodo', 'munchlax':'Samwise'};
			for (let p in fellowship) {
				let template = this.getTemplate(p);
				set = this.randomSet(template);
				set.species = toId(set.name);
				set.name = fellowship[p];
				// Add a way to go around dark-types.
				let hasOrcKilling = false;
				for (let n = 0; n < 4; n++) {
					let move = this.getMove(set.moves[n]);
					if (move.type in {'Bug':1, 'Fighting':1}) {
						hasOrcKilling = true;
						break;
					}
				}
				if (!hasOrcKilling) set.moves[3] = (template.baseStats.atk > template.baseStats.spa) ? 'closecombat' : 'aurasphere';
				if (p !== 'hoopa') {
					set.item = 'Eviolite';
					set.level = 90;
					set.evs = {hp:4, atk:126, def:126, spa:126, spd:126, spe:0};
					if (p === 'baltoy') set.moves[0] = 'Growl';
				}
				team.push(set);
			}

			// And now an extra good guy.
			let goodguy = [
				'primeape', 'aegislash', 'mimejr', 'timburr', 'lucario',
				['sudowoodo', 'trevenant', 'abomasnow', 'shiftry', 'cacturne', 'nuzleaf'][this.random(6)],
				['pidgeot', 'staraptor', 'braviary', 'aerodactyl', 'noivern', 'lugia', 'hooh', 'moltres', 'articuno', 'zapdos'][this.random(10)],
			][this.random(7)];
			set = this.randomSet(this.getTemplate(goodguy));
			set.species = toId(set.name);
			set.name = {
				'primeape':'Gimli', 'aegislash':'Faramir', 'mimejr':'Pippin', 'timburr':'Merry', 'lucario':'Boromir',
				'trevenant':'Treebeard', 'sudowoodo':'Birchseed', 'abomasnow':'Fimbrethil', 'shiftry':'Quickbeam',
				'cacturne':'Finglas', 'nuzleaf':'Lindenroot', 'pidgeot':'Great Eagle', 'staraptor':'Great Eagle',
				'braviary':'Great Eagle', 'aerodactyl':'Great Eagle', 'noivern':'Great Eagle', 'lugia':'Great Eagle',
				'hooh':'Great Eagle', 'moltres':'Great Eagle', 'articuno':'Great Eagle', 'zapdos':'Great Eagle',
			}[goodguy];
			team.push(set);
		} else if (lead === 'reshiram') {
			// This is the Mordor team from the LOTR battle.
			let mordor = {'reshiram':'Smaug', 'yveltal':'Nazgûl', 'hoopaunbound':'Saruman'};
			for (let p in mordor) {
				set = this.randomSet(this.getTemplate(p));
				set.species = toId(set.name);
				set.name = mordor[p];
				if (p === 'yveltal') {
					set.item = 'Choice Scarf';
					set.moves = ['oblivionwing', 'darkpulse', 'hurricane', 'uturn'];
					set.nature = 'Timid';
					set.evs = {hp:0, atk:4, def:0, spa:252, spd:0, spe:252};
					set.level = 70;
				}
				if (p === 'hoopaunbound') set.level = 70;
				team.push(set);
			}

			// This army has an orc, a troll, and a bad-guy human. Or Gollum instead any of those three.
			let addGollum = false;
			// 66% chance of getting an orc.
			if (this.random(3) < 2) {
				let orc = ['quilladin', 'chesnaught', 'granbull', 'drapion', 'pangoro', 'feraligatr', 'haxorus', 'garchomp'][this.random(8)];
				set = this.randomSet(this.getTemplate(orc));
				set.species = toId(set.name);
				set.name = 'Orc';
				team.push(set);
			} else {
				addGollum = true;
			}
			// If we got an orc, 66% chance of getting a troll. Otherwise, 100%.
			if (addGollum || this.random(3) < 2) {
				let troll = ['conkeldurr', 'drowzee', 'hypno', 'seismitoad', 'weavile', 'machamp'][this.random(6)];
				set = this.randomSet(this.getTemplate(troll));
				set.species = toId(set.name);
				set.name = 'Troll';
				team.push(set);
			} else {
				addGollum = true;
			}
			// If we got an orc and a troll, 66% chance of getting a Mordor man. Otherwise, 100%.
			if (addGollum || this.random(3) < 2) {
				let badhuman = ['bisharp', 'alakazam', 'medicham', 'mrmime', 'gardevoir', 'hitmonlee', 'hitmonchan', 'hitmontop', 'meloetta', 'sawk', 'throh', 'scrafty'][this.random(12)];
				set = this.randomSet(this.getTemplate(badhuman));
				set.species = toId(set.name);
				set.name = 'Mordor man';
				if (badhuman === 'bisharp') {
					set.moves = ['suckerpunch', 'brickbreak', 'knockoff', 'ironhead'];
					set.item = 'Life Orb';
				}
				if (set.level < 80) set.level = 80;
				team.push(set);
			} else {
				addGollum = true;
			}
			// If we did forfeit an orc, a troll, or a Mordor man, add Gollum in its stead.
			if (addGollum) {
				set = this.randomSet(this.getTemplate('sableye'));
				set.species = toId(set.name);
				set.name = 'Gollum';
				set.moves = ['fakeout', 'bind', 'soak', 'infestation'];
				set.item = 'Leftovers';
				set.level = 99;
				team.push(set);
			}
		} else if (lead === 'genesect') {
			// Terminator team.
			set = this.randomSet(this.getTemplate(lead));
			set.species = toId(set.name);
			set.name = 'Terminator T-1000';
			set.item = 'Choice Band';
			set.moves = ['extremespeed', 'ironhead', 'blazekick', 'uturn'];
			set.nature = 'Jolly';
			set.evs.spe = 252;
			team.push(set);

			// The rest are just random botmons
			let bots = [
				'golurk', 'porygon', 'porygon2', 'porygonz', 'rotom', 'rotomheat', 'rotomwash', 'rotommow', 'rotomfan',
				'rotomfrost', 'regice', 'regirock', 'registeel', 'magnezone', 'magneton', 'magnemite', 'heatran', 'klinklang',
				'klang', 'klink', 'nosepass', 'probopass', 'electivire', 'metagross', 'armaldo', 'aggron', 'bronzong',
			];
			let names = ['T-850', 'E-3000', 'T-700', 'ISO-9001', 'WinME'];
			for (let i = 0; i < 5; i++) {
				let pokemon = this.sampleNoReplace(bots);
				let template = this.getTemplate(pokemon);
				set = this.randomSet(template, i);
				set.species = toId(set.name);
				set.name = 'SkynetBot ' + names[i];
				if (pokemon === 'rotomfan') set.item = 'Life Orb';
				set.ivs.spe = set.ivs.spe % 2;
				set.evs.spe = 0;
				team.push(set);
			}
		} else if (lead === 'alakazam') {
			// Human survival team.
			let humans = [
				'medicham', 'mrmime', 'gallade', 'gardevoir', 'lucario', 'hitmonlee', 'hitmonchan', 'hitmontop', 'tyrogue',
				'chansey', 'blissey', 'meloetta', 'sawk', 'throh', 'scrafty',
			];
			let names = ['John Connor', 'Sarah Connor', 'Terminator T-800', 'Kyle Reese', 'Miles Bennett Dyson', 'Dr. Silberman'];
			let hasMega = false;
			let makeZamSet = false;

			for (let i = 0; i < 6; i++) {
				let pokemon = i ? this.sampleNoReplace(humans) : lead;
				let template = this.getTemplate(pokemon);
				set = this.randomSet(template, i);
				set.species = toId(set.name);
				set.name = names[i];
				let hasBotKilling = false;
				// Give humans a way around robots
				for (let n = 0; n < 4; n++) {
					let move = this.getMove(set.moves[n]);
					if (move.type in {'Fire':1, 'Fighting':1}) {
						hasBotKilling = true;
						break;
					}
				}
				if (!hasBotKilling) {
					set.moves[3] = (template.baseStats.atk > template.baseStats.spa) ? ['flareblitz', 'closecombat'][this.random(2)] : ['flamethrower', 'aurasphere'][this.random(2)];
					set.level += 5;
				}
				if (toId(set.ability) === 'unburden') set.ability = 'Reckless';
				// If we have Gardevoir, make it the mega. Then, Gallade.
				if (pokemon === 'gardevoir') {
					if (!hasMega) {
						set.item = 'Gardevoirite';
						hasMega = true;
						makeZamSet = true;
					} else {
						set.item = 'Life Orb';
					}
				}
				if (pokemon === 'gallade') {
					if (!hasMega) {
						set.item = 'Galladite';
						hasMega = true;
						makeZamSet = true;
					} else {
						set.item = 'Life Orb';
					}
				}
				if (pokemon === 'lucario') {
					if (!hasMega) {
						set.item = 'Lucarionite';
						hasMega = true;
						makeZamSet = true;
					} else {
						set.item = 'Life Orb';
					}
				}
				if (pokemon === 'chansey') {
					set.item = 'Eviolite';
					set.moves = ['softboiled', 'flamethrower', 'toxic', 'counter'];
				}
				if (pokemon === 'blissey') {
					set.item = 'Leftovers';
					set.moves = ['softboiled', 'flamethrower', 'barrier', 'counter'];
				}
				if (pokemon in {'hitmontop':1, 'scrafty':1}) {
					set.ability = 'Intimidate';
					set.item = 'Leftovers';
					set.moves = ['fakeout', 'drainpunch', 'knockoff', 'flareblitz'];
					set.evs = {hp:252, atk:252, def:4, spa:0, spd:0, spe:0};
					set.nature = 'Brave';
				}
				set.evs.spe = 0;
				set.ivs.spe = set.ivs.spe % 2;
				team.push(set);
			}
			if (makeZamSet) {
				team[0].item = 'Focus Sash';
				team[0].level = 90;
				team[0].moves = ['psychic', 'earthpower', 'shadowball', 'flamethrower'];
				team[0].ivs = {hp:31, atk:31, def:31, spa:31, spd:31, spe:0};
				team[0].evs.hp += team[0].evs.spe;
				team[0].evs.spe = 0;
				team[0].nature = 'Quiet';
			}
		} else if (lead === 'groudon') {
			// Egyptians from the exodus battle.
			let egyptians = [
				'krookodile', 'tyranitar', 'rapidash', 'hippowdon', 'claydol', 'flygon', 'sandslash', 'torterra', 'darmanitan',
				'volcarona', 'arcanine', 'entei', 'aggron', 'armaldo', 'cradily', 'cacturne', 'exeggutor', 'tropius', 'yanmega',
				'muk', 'numel', 'camerupt', 'yamask', 'cofagrigus', 'glameow', 'purugly', 'skitty', 'delcatty', 'liepard',
				'solrock', 'lunatone', 'shinx', 'luxio', 'luxray', 'pidgeot', 'ampharos', 'unown', 'altaria', 'garchomp',
				'heliolisk', 'maractus', 'dugtrio', 'steelix', 'meowth', 'persian', 'gliscor', 'drapion',
			];
			let template = this.getTemplate(lead);
			set = this.randomSet(template, 0);
			set.species = toId(set.name);
			set.name = 'Ramesses II';
			set.ability = 'Rivalry';
			if (toId(set.item) === 'redorb') {
				set.item = 'Life Orb';
			}
			set.level = 67;
			team.push(set);

			for (let i = 1; i < 6; i++) {
				let pokemon = this.sampleNoReplace(egyptians);
				template = this.getTemplate(pokemon);
				let set = this.randomSet(template, i, !!megaCount);
				if (this.getItem(set.item).megaStone) megaCount++;
				set.species = toId(set.name);
				set.name = 'Egyptian ' + template.species;
				team.push(set);
			}
		} else if (lead === 'probopass') {
			// Jews from the exodus battle.
			let jews = [
				'nosepass', ['arceus', 'arceusfire'][this.random(2)], 'flaaffy', 'tauros', 'miltank', 'gogoat', 'excadrill',
				'seismitoad', 'toxicroak', 'yanmega',
			];
			let template = this.getTemplate(lead);
			set = this.randomSet(template, 0);
			set.species = toId(set.name);
			set.name = 'Moses';
			team.push(set);

			for (let i = 1; i < 6; i++) {
				let pokemon = this.sampleNoReplace(jews);
				template = this.getTemplate(pokemon);
				set = this.randomSet(template, i);
				set.species = toId(set.name);
				set.name = 'Hebrew ' + template.species;
				team.push(set);
			}
		} else {
			// Now the shipwreck battle, pretty straightforward.
			let	seasonalPokemonList;
			if (lead === 'kyogre') {
				seasonalPokemonList = [
					'sharpedo', 'malamar', 'octillery', 'gyarados', 'clawitzer', 'whiscash', 'relicanth', 'thundurus', 'thundurustherian',
					'thundurus', 'thundurustherian', 'tornadus', 'tornadustherian', 'pelipper', 'wailord', 'avalugg', 'milotic', 'crawdaunt',
				];
			} else if (lead === 'machamp') {
				seasonalPokemonList = [
					'chatot', 'feraligatr', 'poliwrath', 'swampert', 'barbaracle', 'carracosta', 'lucario', 'ursaring', 'vigoroth',
					'machoke', 'conkeldurr', 'gurdurr', 'seismitoad', 'chesnaught', 'electivire',
				];
			}
			for (let i = 0; i < 6; i++) {
				let pokemon = i ? this.sampleNoReplace(seasonalPokemonList) : lead;
				let template = this.getTemplate(pokemon);
				let set = this.randomSet(template, i, !!megaCount);
				if (this.getItem(set.item).megaStone) megaCount++;

				// Sailor team is made of pretty bad mons, boost them a little.
				if (lead === 'machamp') {
					let isAtk = (template.baseStats.atk > template.baseStats.spa);
					if (pokemon === 'machamp') {
						set.item = 'Life Orb';
						set.ability = 'Technician';
						set.moves = ['aquajet', 'bulletpunch', 'machpunch', 'hiddenpowerelectric'];
						set.level = 75;
						set.ivs = {hp:31, atk:31, def:31, spa:30, spd:31, spe:31};
						set.nature = 'Brave';
						set.evs = {hp:0, atk:252, def:0, spa:252, spd:0, spe:4};
					} else {
						let shellSmashPos = -1;
						// Too much OP if all of them have an electric attack.
						if (this.random(3) < 2) {
							let hasFishKilling = false;
							for (let n = 0; n < 4; n++) {
								let move = this.getMove(set.moves[n]);
								if (move.type in {'Electric':1}) {
									hasFishKilling = true;
								} else if (move.id === 'raindance') { // useless, replace ASAP
									// Swampert is too OP for an electric move, so we give it another move
									set.moves[n] = (pokemon === 'swampert' ? 'doubleedge' : 'fusionbolt');
									hasFishKilling = true;
								} else if (move.id === 'shellsmash') { // don't replace this!
									shellSmashPos = n;
								}
							}
							if (!hasFishKilling && pokemon !== 'swampert') {
								let fishKillerPos = (shellSmashPos === 3 ? 2 : 3);
								set.moves[fishKillerPos] = isAtk ? 'thunderpunch' : 'thunderbolt';
							}
						}
						set.evs = {hp:252, atk:0, def:0, spa:0, spd:0, spe:0};
						if (shellSmashPos > -1 || toId(set.ability) === 'swiftswim' || (pokemon === 'swampert' && this.getItem(set.item).megaStone)) {
							// Give Shell Smashers and Mega Swampert a little bit of speed
							set.evs.atk = 200;
							set.evs.spe = 56;
							set.level -= 5;
						} else if (pokemon === 'lucario') {
							// Lucario has physical and special moves, so balance the attack EVs
							set.evs.atk = 128;
							set.evs.spa = 128;
						} else if (isAtk) {
							set.evs.atk = 252;
							set.evs.spd = 4;
						} else {
							set.evs.spa = 252;
							set.evs.spd = 4;
						}
					}
				} else if (pokemon === 'kyogre') {
					set.item = 'Choice Scarf';
					set.moves = ['waterspout', 'surf', 'thunder', 'icebeam'];
				} else if (pokemon === 'milotic') {
					set.level -= 5;
				}
				team.push(set);
			}
		}

		return team;
	},

	randomSeasonalStaffTeam: function (side) {
		let team = [];
		let variant = this.random(2);
		// Hardcoded sets of the available Pokémon.
		let sets = {
			// Admins.
			'~Antar': {
				species: 'Quilava', ability: 'Turboblaze', item: 'Eviolite', gender: 'M',
				moves: ['blueflare', ['quiverdance', 'solarbeam', 'moonblast'][this.random(3)], 'sunnyday'],
				baseSignatureMove: 'spikes', signatureMove: "Firebomb",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
			},
			'~chaos': {
				species: 'Bouffalant', ability: 'Fur Coat', item: 'Red Card', gender: 'M',
				moves: ['precipiceblades', ['recover', 'stockpile', 'swordsdance'][this.random(3)], 'extremespeed', 'explosion'],
				baseSignatureMove: 'embargo', signatureMove: "Forcewin",
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
			},
			'~haunter': {
				species: 'Landorus', ability: 'Sheer Force', item: 'Life Orb', gender: 'M',
				moves: ['hurricane', 'earthpower', 'fireblast', 'blizzard', 'thunder'],
				baseSignatureMove: 'quiverdance', signatureMove: "Genius Dance",
				evs: {hp:4, spa:252, spe:252}, nature: 'Modest',
			},
			'~Jasmine': {
				species: 'Mew', ability: 'Speed Boost', item: 'Focus Sash', gender: 'F',
				moves: ['explosion', 'transform', 'milkdrink', 'storedpower'],
				baseSignatureMove: 'bellydrum', signatureMove: "Lockdown",
				evs: {hp:252, def:252, spd:4}, nature: 'Bold',
			},
			'~Joim': {
				species: 'Zapdos', ability: 'Download', item: 'Leftovers', gender: 'M', shiny: true,
				moves: ['thunderbolt', 'hurricane', ['earthpower', 'roost', 'flamethrower', 'worryseed', 'haze', 'spore'][this.random(6)]],
				baseSignatureMove: 'milkdrink', signatureMove: "Red Bull Drink",
				evs: {hp:4, spa:252, spe:252}, nature: 'Modest',
			},
			'~The Immortal': {
				species: 'Blastoise', ability: 'Magic Bounce', item: 'Blastoisinite', gender: 'M', shiny: true,
				moves: ['shellsmash', 'steameruption', 'dragontail'],
				baseSignatureMove: 'sleeptalk', signatureMove: "Sleep Walk",
				evs: {hp:252, def:4, spd:252}, nature: 'Sassy',
			},
			'~V4': {
				species: 'Victini', ability: 'Desolate Land', item: (variant === 0 ? ['Life Orb', 'Charcoal', 'Leftovers'][this.random(3)] : ['Life Orb', 'Choice Scarf', 'Leftovers'][this.random(3)]), gender: 'M',
				moves: (variant === 0 ? ['thousandarrows', 'bolt strike', 'shiftgear', 'dragonascent', 'closecombat', 'substitute'] : ['thousandarrows', 'bolt strike', 'dragonascent', 'closecombat']),
				baseSignatureMove: 'vcreate', signatureMove: "V-Generate",
				evs: {hp:4, atk:252, spe:252}, nature: 'Jolly',
			},
			'~Zarel': {
				species: 'Meloetta', ability: 'Serene Grace', item: '', gender: 'F',
				moves: ['lunardance', 'fierydance', 'perishsong', 'petaldance', 'quiverdance'],
				baseSignatureMove: 'relicsong', signatureMove: "Relic Song Dance",
				evs: {hp:4, atk:252, spa:252}, nature: 'Quiet',
			},
			// Leaders.
			'&hollywood': {
				species: 'Mr. Mime', ability: 'Prankster', item: 'Leftovers', gender: 'M',
				moves: ['batonpass', ['substitute', 'milkdrink'][this.random(2)], 'encore'],
				baseSignatureMove: 'geomancy', signatureMove: "Meme Mime",
				evs: {hp:252, def:4, spe:252}, nature: 'Timid',
			},
			'&jdarden': {
				species: 'Dragonair', ability: 'Fur Coat', item: 'Eviolite', gender: 'M',
				moves: ['rest', 'sleeptalk', 'quiverdance'], name: 'jdarden',
				baseSignatureMove: 'dragontail', signatureMove: "Wyvern's Wind",
				evs: {hp:252, def:4, spd:252}, nature: 'Calm',
			},
			'&Okuu': {
				species: 'Honchkrow', ability: 'Drought', item: 'Life Orb', gender: 'F',
				moves: [['bravebird', 'sacredfire'][this.random(2)], ['suckerpunch', 'punishment'][this.random(2)], 'roost'],
				baseSignatureMove: 'firespin', signatureMove: "Blazing Star - Ten Evil Stars",
				evs: {atk:252, spa:4, spe:252}, nature: 'Quirky',
			},
			'&sirDonovan': {
				species: 'Togetic', ability: 'Gale Wings', item: 'Eviolite', gender: 'M',
				moves: ['roost', 'hurricane', 'afteryou', 'charm', 'dazzlinggleam'],
				baseSignatureMove: 'mefirst', signatureMove: "Ladies First",
				evs: {hp:252, spa:252, spe:4}, nature: 'Modest',
			},
			'&Slayer95': {
				species: 'Scizor', ability: 'Illusion', item: 'Scizorite', gender: 'M',
				moves: ['swordsdance', 'bulletpunch', 'uturn'],
				baseSignatureMove: 'allyswitch', signatureMove: "Spell Steal",
				evs: {atk:252, def:252, spd: 4}, nature: 'Brave',
			},
			'&Sweep': {
				species: 'Omastar', ability: 'Drizzle', item: ['Honey', 'Mail'][this.random(2)], gender: 'M',
				moves: ['shellsmash', 'originpulse', ['thunder', 'icebeam'][this.random(2)]],
				baseSignatureMove: 'kingsshield', signatureMove: "Sweep's Shield",
				evs: {hp:4, spa:252, spe:252}, nature: 'Modest',
			},
			'&verbatim': {
				species: 'Archeops', ability: 'Reckless', item: 'Life Orb', gender: 'M',
				moves: ['headsmash', 'highjumpkick', 'flareblitz', 'volttackle', 'woodhammer'],
				baseSignatureMove: 'bravebird', signatureMove: "Glass Cannon",
				evs: {hp:4, atk:252, spe:252}, nature: 'Jolly',
			},
			// Mods.
			'@Acedia': {
				species: 'Slakoth', ability: 'Magic Bounce', item: 'Quick Claw', gender: 'F',
				moves: ['metronome', 'sketch', 'assist', 'swagger', 'foulplay'],
				baseSignatureMove: 'worryseed', signatureMove: "Procrastination",
				evs: {hp:252, atk:252, def:4}, nature: 'Serious',
			},
			'@AM': {
				species: 'Tyranitar', ability: 'Adaptability', item: (variant === 1 ? 'Lum Berry' : 'Choice Scarf'), gender: 'M',
				moves: (variant === 1 ? ['earthquake', 'diamondstorm', 'swordsdance', 'meanlook'] : ['knockoff', 'diamondstorm', 'earthquake']),
				baseSignatureMove: 'pursuit', signatureMove: "Predator",
				evs: {atk:252, def:4, spe: 252}, nature: 'Jolly',
			},
			'@antemortem': {
				species: 'Clefable', ability: (variant === 1 ? 'Sheer Force' : 'Multiscale'), item: (variant === 1 ? 'Life Orb' : 'Leftovers'), gender: 'M',
				moves: ['earthpower', 'cosmicpower', 'recover', 'gigadrain'],
				baseSignatureMove: 'drainingkiss', signatureMove: "Postmortem",
				evs: {hp:252, spa:252, def:4}, nature: 'Modest',
			},
			'@Ascriptmaster': {
				species: 'Rotom', ability: 'Teravolt', item: 'Air Balloon', gender: 'M',
				moves: ['chargebeam', 'signalbeam', 'flamethrower', 'aurorabeam', 'dazzlinggleam'],
				baseSignatureMove: 'triattack', signatureMove: "Spectrum Beam",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
			},
			'@asgdf': {
				species: 'Empoleon', ability: 'Filter', item: 'Rocky Helmet', gender: 'M',
				moves: ['scald', 'recover', 'calmmind', 'searingshot', 'encore'],
				baseSignatureMove: 'futuresight', signatureMove: "Obscure Pun",
				evs: {hp:252, spa:252, def:4}, nature: 'Modest',
			},
			'@Audiosurfer': {
				species: 'Audino', ability: 'Prankster', item: 'Audinite', gender: 'M',
				moves: ['boomburst', 'slackoff', 'glare'],
				baseSignatureMove: 'detect', signatureMove: "Audioshield",
				evs: {hp:252, spa:252, spe:4}, nature: 'Modest',
			},
			'@barton': {
				species: 'Piloswine', ability: 'Parental Bond', item: 'Eviolite', gender: 'M',
				moves: ['earthquake', 'iciclecrash', 'taunt'],
				baseSignatureMove: 'bulkup', signatureMove: "MDMA Huff",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant',
			},
			'@bean': {
				species: 'Liepard', ability: 'Prankster', item: 'Leftovers', gender: 'M',
				moves: ['knockoff', 'encore', 'substitute', 'gastroacid', 'leechseed'],
				baseSignatureMove: 'glare', signatureMove: "Coin Toss",
				evs: {hp:252, def:252, spd:4}, nature: 'Calm',
			},
			'@Beowulf': {
				species: 'Beedrill', ability: 'Download', item: 'Beedrillite', gender: 'M',
				moves: ['spikyshield', 'gunkshot', ['sacredfire', 'boltstrike', 'diamondstorm'][this.random(3)]],
				baseSignatureMove: 'bugbuzz', signatureMove: "Buzzing of the Swarm",
				evs: {hp:4, atk:252, spe:252}, nature: 'Jolly',
			},
			'@BiGGiE': {
				species: 'Snorlax', ability: 'Fur Coat', item: 'Leftovers', gender: 'M',
				moves: ['drainpunch', 'diamondstorm', 'kingsshield', 'knockoff', 'precipiceblades'],
				baseSignatureMove: 'dragontail', signatureMove: "Food Rush",
				evs: {hp:4, atk:252, spd:252}, nature: 'Adamant',
			},
			'@Blitzamirin': {
				species: 'Chandelure', ability: 'Prankster', item: 'Red Card', gender: 'M',
				moves: ['heartswap', ['darkvoid', 'substitute'][this.random(2)], ['shadowball', 'blueflare'][this.random(2)]],
				baseSignatureMove: 'oblivionwing', signatureMove: "Pneuma Relinquish",
				evs: {def:4, spa:252, spe:252}, nature: 'Timid',
			},
			'@CoolStoryBrobat': {
				species: 'Crobat', ability: 'Gale Wings', item: 'Black Glasses', gender: 'M',
				moves: ['knockoff', 'bulkup', 'roost', 'closecombat', 'defog'],
				baseSignatureMove: 'bravebird', signatureMove: "Brave Bat",
				evs: {hp:4, atk:252, spe:252}, nature: 'Jolly',
			},
			'@Dell': {
				species: 'Lucario', ability: 'Simple', item: 'Lucarionite', gender: 'M',
				moves: ['jumpkick', ['flashcannon', 'bulletpunch'][this.random(2)], 'batonpass'],
				baseSignatureMove: 'detect', signatureMove: "Aura Parry",
				evs: {hp:4, atk:216, spa:36, spe:252}, nature: 'Naive',
			},
			'@Eevee General': {
				species: 'Eevee', ability: 'Magic Guard', item: 'Eviolite', gender: 'M',
				moves: ['shiftgear', 'healorder', 'crunch', 'sacredsword', 'doubleedge'],
				baseSignatureMove: 'quickattack', signatureMove: "War Crimes",
				evs: {hp:252, atk:252, def:4}, nature: 'Impish',
			},
			'@Electrolyte': {
				species: 'Elekid', ability: 'Pure Power', item: 'Life Orb', gender: 'M',
				moves: ['volttackle', 'earthquake', ['iciclecrash', 'diamondstorm'][this.random(2)]],
				baseSignatureMove: 'entrainment', signatureMove: "Study",
				evs: {atk:252, spd:4, spe:252}, nature: 'Adamant',
			},
			'@Enguarde': {
				species: 'Gallade', ability: ['Intimidate', 'Hyper Cutter'][this.random(2)], item: 'Galladite', gender: 'M',
				moves: ['psychocut', 'sacredsword', ['nightslash', 'precipiceblades', 'leafblade'][this.random(3)]],
				baseSignatureMove: 'fakeout', signatureMove: "Ready Stance",
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
			},
			'@Eos': {
				species: 'Drifblim', ability: 'Fur Coat', item: 'Assault Vest', gender: 'M',
				moves: ['oblivionwing', 'paraboliccharge', 'gigadrain', 'drainingkiss'],
				baseSignatureMove: 'shadowball', signatureMove: "Shadow Curse",	//placeholder
				evs: {hp:248, spa:252, spd:8}, nature: 'Modest',
			},
			'@Former Hope': {
				species: 'Froslass', ability: 'Prankster', item: 'Focus Sash', gender: 'M',
				moves: [['icebeam', 'shadowball'][this.random(2)], 'destinybond', 'thunderwave'],
				baseSignatureMove: 'roleplay', signatureMove: "Role Play",
				evs: {hp:252, spa:252, spd:4}, nature: 'Modest',
			},
			'@Genesect': {
				species: 'Genesect', ability: 'Mold Breaker', item: 'Life Orb', gender: 'M',
				moves: ['bugbuzz', 'closecombat', 'extremespeed', 'thunderbolt', 'uturn'],
				baseSignatureMove: 'geargrind', signatureMove: "Grind you're mum",
				evs: {atk:252, spa:252, spe:4}, nature: 'Quiet',
			},
			'@Hippopotas': {
				species: 'Hippopotas', ability: 'Regenerator', item: 'Eviolite', gender: 'M',
				moves: ['haze', 'stealthrock', 'spikes', 'toxicspikes', 'stickyweb'],
				baseSignatureMove: 'partingshot', signatureMove: "Hazard Pass",
				evs: {hp:252, def:252, spd:4}, ivs: {atk:0, spa:0}, nature: 'Bold',
			},
			'@HYDRO IMPACT': {
				species: 'Charizard', ability: 'Rivalry', item: 'Life Orb', gender: 'M',
				moves: ['airslash', 'flamethrower', 'nobleroar', 'hydropump'],
				baseSignatureMove: 'hydrocannon', signatureMove: "HYDRO IMPACT",
				evs: {atk:4, spa:252, spe:252}, nature: 'Hasty',
			},
			'@innovamania': {
				species: 'Arceus', ability: 'Pick Up', item: 'Black Glasses', gender: 'M',
				moves: [['holdhands', 'trickortreat'][this.random(2)], ['swordsdance', 'agility'][this.random(2)], 'celebrate'],
				baseSignatureMove: 'splash', signatureMove: "Rage Quit",
				evs: {hp:4, atk:252, spe:252}, nature: 'Jolly',
			},
			'@jas61292': {
				species: 'Malaconda', ability: 'Analytic', item: 'Safety Goggles', gender: 'M',
				moves: ['coil', 'thunderwave', 'icefang', 'powerwhip', 'moonlight'],
				baseSignatureMove: 'crunch', signatureMove: "Minus One",
				evs: {hp:252, atk:252, spd:4}, nature: 'Adamant',
			},
			'@jin of the gale': {
				species: 'Starmie', ability: 'Drizzle', item: 'Damp Rock', gender: 'M',
				moves: ['steameruption', 'hurricane', 'recover', 'psystrike', 'quiverdance'],
				baseSignatureMove: 'rapidspin', signatureMove: "Beyblade",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
			},
			'@Kostitsyn-Kun': {
				species: 'Gothorita', ability: 'Simple', item: 'Eviolite', gender: 'F', //requested
				moves: ['calmmind', 'psyshock', ['dazzlinggleam', 'secretsword'][this.random(2)]],
				baseSignatureMove: 'refresh', signatureMove: "Kawaii-desu uguu~",
				evs: {hp:252, def:136, spe:120}, nature: 'Bold',
			},
			'@kupo': {
				species: 'Pikachu', ability: 'Prankster', item: "Light Ball", gender: 'M',
				moves: ['substitute', 'spore', 'encore'],
				baseSignatureMove: 'transform', signatureMove: "Kupo Nuts",
				evs: {hp:252, def:4, spd:252}, nature: 'Jolly',
			},
			'@Lawrence III': {
				species: 'Lugia', ability: 'Trace', item: "Grip Claw", gender: 'M',
				moves: ['infestation', 'magmastorm', 'oblivionwing'],
				baseSignatureMove: 'gust', signatureMove: "Shadow Storm",
				evs: {hp:248, def:84, spa:92, spd:84}, nature: 'Modest',
			},
			'@Layell': {
				species: 'Sneasel', ability: 'Technician', item: "King's Rock", gender: 'M',
				moves: ['iceshard', 'iciclespear', ['machpunch', 'pursuit', 'knockoff'][this.random(3)]],
				baseSignatureMove: 'protect', signatureMove: "Pixel Protection",
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
			},
			'@LegitimateUsername': {
				species: 'Shuckle', ability: 'Unaware', item: 'Leftovers', gender: 'M',
				moves: ['leechseed', 'rest', 'foulplay'],
				baseSignatureMove: 'shellsmash', signatureMove: "Shell Fortress",
				evs: {hp:252, def:228, spd:28}, nature: 'Calm',
			},
			'@Level 51': {
				species: 'Togekiss', ability: 'Parental Bond', item: 'Leftovers', gender: 'M',
				moves: ['seismictoss', 'roost', ['cosmicpower', 'cottonguard'][this.random(2)]],
				baseSignatureMove: 'trumpcard', signatureMove: "Next Level Strats",
				evs: {hp:252, def:4, spd:252}, nature: 'Calm',
			},
			'@Lyto': {
				species: 'Lanturn', ability: 'Magic Bounce', item: 'Leftovers', gender: 'M',
				moves: ['originpulse', 'lightofruin', 'blueflare', 'recover', 'tailglow'],
				baseSignatureMove: 'thundershock', signatureMove: "Gravity Storm",
				evs: {hp:188, spa:252, spe:68}, nature: 'Modest',
			},
			'@Marty': {
				species: 'Houndoom', ability: 'Drought', item: 'Houndoominite', gender: 'M',
				moves: ['nightdaze', 'solarbeam', 'aurasphere', 'thunderbolt', 'earthpower'],
				baseSignatureMove: 'sacredfire', signatureMove: "Immolate",
				evs: {spa:252, spd:4, spe:252}, ivs: {atk:0}, nature: 'Timid',
			},
			'@Morfent': {
				species: 'Dusknoir', ability: 'Fur Coat', item: "Leftovers", gender: 'M',
				moves: [['recover', 'acidarmor', 'swordsdance', 'willowisp', 'trickroom'][this.random(5)], 'shadowclaw', ['earthquake', 'icepunch', 'thunderpunch'][this.random(3)]],
				baseSignatureMove: 'spikes', signatureMove: "Used Needles",
				evs: {hp:252, atk:4, def:252}, ivs: {spe:0}, nature: 'Impish',
			},
			'@Nani Man': {
				species: 'Gengar', ability: 'Desolate Land', item: 'Black Glasses', gender: 'M', shiny: true,
				moves: ['eruption', 'swagger', 'shadow ball', 'topsyturvy', 'dazzlinggleam'],
				baseSignatureMove: 'fireblast', signatureMove: "Tanned",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
			},
			'@NixHex': {
				species: 'Porygon2', ability: 'No Guard', item: 'Eviolite', gender: 'M', shiny: true,
				moves: ['thunder', 'blizzard', 'overheat', 'triattack', 'recover'],
				baseSignatureMove: 'inferno', signatureMove: "Beautiful Disaster",
				evs: {hp:252, spa:252, spe:4}, nature: 'Modest',
			},
			'@Osiris': {
				species: 'Pumpkaboo-Super', ability: 'Bad Dreams', item: 'Eviolite', gender: 'M',
				moves: ['leechseed', 'recover', 'cosmicpower'],
				baseSignatureMove: 'hypnosis', signatureMove: "Restless Sleep",
				evs: {hp:252, def:216, spd:40}, ivs: {atk:0}, nature: 'bold',
			},
			'@phil': {
				species: 'Gastrodon', ability: 'Drizzle', item: 'Shell Bell', gender: 'M',
				moves: ['scald', 'recover', 'gastroacid', 'brine'],
				baseSignatureMove: 'whirlpool', signatureMove: "Slug Attack",
				evs: {hp:252, spa:252, def:4}, nature: 'Quirky',
			},
			'@qtrx': {
				species: 'Unown', ability: 'Levitate', item: 'Focus Sash', gender: 'M',
				moves: [],
				baseSignatureMove: 'meditate', signatureMove: "Hidden Power... Normal?",
				evs: {hp:252, def:4, spa:252}, ivs: {atk:0, spe:0}, nature: 'Quiet',
			},
			'@Queez': {
				species: 'Cubchoo', ability: 'Prankster', item: 'Eviolite', gender: 'M',
				moves: ['pound', 'fly', 'softboiled', 'thunderwave', 'waterpulse'],
				baseSignatureMove: 'leer', signatureMove: "Sneeze",
				evs: {hp:252, def:228, spd:28}, nature: 'Calm',
			},
			'@rekeri': {
				species: 'Tyrantrum', ability: 'Tough Claws', item: 'Life Orb', gender: 'M',
				moves: ['outrage', 'extremespeed', 'stoneedge', 'closecombat'],
				baseSignatureMove: 'headcharge', signatureMove: "Land Before Time",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant',
			},
			'@Relados': {
				species: 'Terrakion', ability: 'Guts', item: 'Flame Orb', gender: 'M',
				moves: ['knockoff', 'diamondstorm', 'closecombat', 'iceshard', 'drainpunch'],
				baseSignatureMove: 'stockpile', signatureMove: "Loyalty",
				evs: {atk:252, def:4, spe:252}, nature: 'Adamant',
			},
			'@Reverb': {
				species: 'Slaking', ability: 'Scrappy', item: 'Assault Vest', gender: 'M',
				moves: ['feint', 'stormthrow', 'blazekick'], // Feint as a countermeasure to the abundance of Protect-based set-up moves.
				baseSignatureMove: 'eggbomb', signatureMove: "fat monkey",
				evs: {hp:252, spd:40, spe:216}, nature: 'Jolly', // EV-nerf.
			},
			'@RosieTheVenusaur': {
				species: 'Venusaur', ability: 'Moxie', item: 'Leftovers', gender: 'F',
				moves: ['flamethrower', 'extremespeed', 'sacredfire', 'knockoff', 'closecombat'],
				baseSignatureMove: 'frenzyplant', signatureMove: "Swag Plant",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant',
			},
			'@scalarmotion': {
				species: 'Cryogonal', ability: 'Magic Guard', item: 'Focus Sash', gender: 'M',
				moves: ['rapidspin', 'willowisp', 'taunt', 'recover', 'voltswitch'],
				baseSignatureMove: 'icebeam', signatureMove: "Eroding Frost",
				evs: {spa:252, spd:4, spe:252}, nature: 'Timid',
			},
			'@Scotteh': {
				species: 'Suicune', ability: 'Fur Coat', item: 'Leftovers', gender: 'M',
				moves: ['icebeam', 'steameruption', 'recover', 'nastyplot'],
				baseSignatureMove: 'boomburst', signatureMove: "Geomagnetic Storm",
				evs: {def:252, spa:4, spe:252}, nature: 'Bold',
			},
			'@Shame That': {
				species: 'Weavile', ability: 'Magic Guard', item: 'Focus Sash', gender: 'M',
				moves: ['substitute', 'captivate', 'reflect', 'rest', 'raindance', 'foresight'],
				baseSignatureMove: 'healingwish', signatureMove: "Extreme Compromise",
				evs: {hp:252, def:4, spe:252}, nature: 'Jolly',
			},
			'@shrang': {
				species: 'Latias', ability: 'Pixilate', item: ['Latiasite', 'Life Orb', 'Leftovers'][this.random(3)], gender: 'M',
				moves: ['dracometeor', 'roost', 'nastyplot', 'fireblast', 'aurasphere', 'psystrike'], //not QD again senpai >.<
				baseSignatureMove: 'judgment', signatureMove: "Pixilate",	//placeholder
				evs: {hp:160, spa:96, spe:252}, ivs: {atk:0}, nature: 'Timid',
			},
			'@Skitty': {
				species: 'Audino', ability: 'Intimidate', item: 'Audinite', gender: 'M',
				moves: ['acupressure', 'recover', ['taunt', 'cosmicpower', 'magiccoat'][this.random(3)]],
				baseSignatureMove: 'storedpower', signatureMove: "Ultimate Dismissal",
				evs: {hp:252, def:252, spd:4}, nature: 'Bold',
			},
			'@Snowflakes': {
				species: 'Celebi', ability: 'Filter', item: 'Leftovers', gender: 'M',
				moves: [
					['gigadrain', ['recover', 'quiverdance'][this.random(2)], ['icebeam', 'searingshot', 'psystrike', 'thunderbolt', 'aurasphere', 'moonblast'][this.random(6)]],
					['gigadrain', 'recover', [['uturn', 'voltswitch'][this.random(2)], 'thunderwave', 'leechseed', 'healbell', 'healingwish', 'reflect', 'lightscreen', 'stealthrock'][this.random(8)]],
					['gigadrain', 'perishsong', ['recover', ['uturn', 'voltswitch'][this.random(2)], 'leechseed', 'thunderwave', 'healbell'][this.random(5)]],
					['gigadrain', 'recover', ['thunderwave', 'icebeam', ['uturn', 'voltswitch'][this.random(2)], 'psystrike'][this.random(4)]],
				][this.random(4)],
				baseSignatureMove: 'thousandarrows', signatureMove: "Azalea Butt Slam",
				evs: {hp:252, spa:252, def:4}, nature: 'Modest',
			},
			'@Spydreigon': {
				species: 'Hydreigon', ability: 'Mega Launcher', item: 'Life Orb', gender: 'M',
				moves: ['dragonpulse', 'darkpulse', 'aurasphere', 'originpulse', 'shiftgear'],
				baseSignatureMove: 'waterpulse', signatureMove: "Mineral Pulse",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
			},
			'@Steamroll': {
				species: 'Growlithe', ability: 'Adaptability', item: 'Life Orb', gender: 'M',
				moves: ['flareblitz', 'volttackle', 'closecombat'],
				baseSignatureMove: 'protect', signatureMove: "Conflagration",
				evs: {atk:252, def:4, spe:252}, nature: 'Adamant',
			},
			'@SteelEdges': {
				species: 'Alakazam', ability: 'Competitive', item: 'Alakazite', gender: 'M',
				moves: ['bugbuzz', 'hypervoice', 'psystrike', 'batonpass', 'focusblast'],
				baseSignatureMove: 'tailglow', signatureMove: "True Daily Double",
				evs: {hp:4, spa:252, spe:252}, nature: 'Serious',
			},
			'@Temporaryanonymous': {
				species: 'Doublade', ability: 'Tough Claws', item: 'Eviolite', gender: 'M',
				moves: ['swordsdance', ['xscissor', 'sacredsword', 'knockoff'][this.random(3)], 'geargrind'],
				baseSignatureMove: 'shadowsneak', signatureMove: "SPOOPY EDGE CUT",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant',
			},
			'@Test2017': {
				species: "Farfetch'd", ability: 'Wonder Guard', item: 'Stick', gender: 'M',
				moves: ['foresight', 'gastroacid', 'nightslash', 'roost', 'thousandarrows'],
				baseSignatureMove: 'karatechop', signatureMove: "Ducktastic",
				evs: {hp:252, atk:252, spe:4}, nature: 'Adamant',
			},
			'@TFC': {
				species: 'Blastoise', ability: 'Prankster', item: 'Leftovers', gender: 'M',
				moves: ['quiverdance', 'cottonguard', 'storedpower', 'aurasphere', 'slackoff'],
				baseSignatureMove: 'drainpunch', signatureMove: "Chat Flood",
				evs: {atk:252, def:4, spe:252}, nature: 'Modest',
			},
			'@TGMD': {
				species: 'Stoutland', ability: 'Speed Boost', item: 'Life Orb', gender: 'M',
				moves: [['extremespeed', 'sacredsword'][this.random(2)], 'knockoff', 'protect'],
				baseSignatureMove: 'return', signatureMove: "Canine Carnage",
				evs: {hp:32, atk:252, spe:224}, nature: 'Adamant',
			},
			'@Timbuktu': {
				species: 'Heatmor', ability: 'Contrary', item: 'Life Orb', gender: 'M',
				moves: ['overheat', ['hammerarm', 'substitute'][this.random(2)], ['glaciate', 'thunderbolt'][this.random(2)]], // Curse didn't make sense at all so it was changed to Hammer Arm
				baseSignatureMove: 'rockthrow', signatureMove: "Geoblast",
				evs: {spa:252, spd:4, spe:252}, nature: 'Timid',
			},
			'@Trickster': {
				species: 'Whimsicott', ability: 'Prankster', item: 'Leftovers', gender: 'M',
				moves: ['swagger', 'spore', 'seedflare', 'recover', 'nastyplot'],
				baseSignatureMove: 'naturepower', signatureMove: "Cometstorm",
				evs: {hp:252, spa:252, spe:4},
			},
			'@trinitrotoluene': {
				species: 'Metagross', ability: 'Levitate', item: 'Metagrossite', gender: 'M',
				moves: ['meteormash', 'zenheadbutt', 'hammerarm', 'grassknot', 'earthquake', 'thunderpunch', 'icepunch', 'shiftgear'],
				baseSignatureMove: 'explosion', signatureMove: "Get Haxed",
				evs: {atk:252, def:4, spe:252}, nature: 'Jolly',
			},
			'@WaterBomb': {
				species: 'Poliwrath', ability: 'Unaware', item: 'Leftovers', gender: 'M',
				moves: ['heartswap', 'softboiled', 'aromatherapy', 'highjumpkick'],
				baseSignatureMove: 'waterfall', signatureMove: "Water Bomb",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant',
			},
			'@xfix': {
				species: 'Xatu', ability: 'Magic Bounce', item: 'Focus Sash', gender: 'M',
				moves: ['thunderwave', 'substitute', 'roost'],
				baseSignatureMove: 'metronome', signatureMove: "(Super Glitch)",
				evs: {hp:252, spd:252, def:4}, nature: 'Calm',
			},
			'@zdrup': {
				species: 'Slowking', ability: 'Slow Start', item: 'Leftovers', gender: 'M',
				moves: ['psystrike', 'futuresight', 'originpulse', 'slackoff', 'destinybond'],
				baseSignatureMove: 'wish', signatureMove: "Premonition",
				evs: {hp:252, def:4, spd:252}, nature: 'Quiet',
			},
			'@Zebraiken': {
				species: 'zebstrika', ability: 'Compound Eyes', item: 'Life Orb', gender: 'M',
				moves: ['thunder', ['fire blast', 'focusblast', 'highjumpkick', 'meteormash'][this.random(3)], ['blizzard', 'iciclecrash', 'sleeppowder'][this.random(3)]], // why on earth does he learn Meteor Mash?
				baseSignatureMove: 'detect', signatureMove: "bzzt",
				evs: {atk:4, spa:252, spe:252}, nature: 'Hasty',
			},
			// Drivers.
			'%Aelita': {
				species: 'Porygon-Z', ability: 'Protean', item: 'Life Orb', gender: 'F',
				moves: ['boomburst', 'quiverdance', 'chatter', 'blizzard', 'moonblast'],
				baseSignatureMove: 'thunder', signatureMove: "Energy Field",
				evs: {hp:4, spa:252, spd:252}, nature: 'Modest',
			},
			'%Arcticblast': {
				species: 'Cresselia', ability: 'Levitate', item: 'Sitrus Berry', gender: 'M',
				moves: [
					['fakeout', 'icywind', 'trickroom', 'safeguard', 'thunderwave', 'tailwind', 'knockoff'][this.random(7)],
					['sunnyday', 'moonlight', 'calmmind', 'protect', 'taunt'][this.random(5)],
					['originpulse', 'heatwave', 'hypervoice', 'icebeam', 'moonblast'][this.random(5)],
				],
				baseSignatureMove: 'psychoboost', signatureMove: "Doubles Purism",
				evs: {hp:252, def:120, spa:56, spd:80}, nature: 'Sassy',
			},
			'%Articuno': {
				species: 'Articuno', ability: 'Magic Guard', item: 'Sitrus Berry', gender: 'F',
				moves: ['roost', 'calmmind', ['psychic', 'airslash', 'icebeam', 'thunderwave'][this.random(4)]],
				baseSignatureMove: 'whirlwind', signatureMove: "True Support",
				evs: {hp:252, def:192, spa:64}, nature: 'Modest',
			},
			'%Ast☆arA': {
				species: 'Jirachi', ability: 'Cursed Body', item: ['Leftovers', 'Sitrus Berry'][this.random(2)], gender: 'F',
				moves: ['psychic', 'moonblast', 'nastyplot', 'recover', 'surf'],
				baseSignatureMove: 'psywave', signatureMove: "Star Bolt Desperation",
				evs: {hp:4, spa:252, spd:252}, nature: 'Modest',
			},
			'%Asty': {
				species: 'Seismitoad', ability: 'Sap Sipper', item: 'Red Card', gender: 'M',
				moves: ['earthquake', 'recover', 'icepunch'],
				baseSignatureMove: 'toxic', signatureMove: "Amphibian Toxin",
				evs: {atk:252, spd:252, spe:4}, nature: 'Adamant',
			},
			'%Birkal': {
				species: 'Rotom-Fan', ability: 'Magic Guard', item: 'Choice Scarf', gender: 'M',
				moves: ['trick', 'aeroblast', ['discharge', 'partingshot', 'recover', 'tailglow'][this.random(4)]],
				baseSignatureMove: 'quickattack', signatureMove: "Caw",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
			},
			'%bloobblob': {
				species: 'Cinccino', ability: 'Skill Link', item: 'Life Orb', gender: 'M',
				moves: ['bulletseed', 'rockblast', 'uturn', 'tailslap', 'knockoff'],
				baseSignatureMove: 'spikecannon', signatureMove: "Lava Whip",
				evs: {atk:252, def:4, spe:252}, nature: 'Adamant',
			},
			'%Bumbadadabum': {
				species: 'Samurott', ability: 'Analytic', item: 'Safety Goggles', gender: 'M',
				moves: ['calmmind', 'originpulse', 'icebeam'],
				baseSignatureMove: 'hypervoice', signatureMove: "Open Source Software",
				evs: {hp:252, spa:252, spd:4}, nature: 'Modest',
			},
			'%Charles Carmichael': {
				species: 'Quagsire', ability: 'Sap Sipper', item: 'Liechi Berry', gender: 'M',
				moves: ['waterfall', 'earthquake', ['stoneedge', 'rockslide'][this.random(2)], 'icepunch'],
				baseSignatureMove: 'swagger', signatureMove: "Bad Pun",
				evs: {hp:248, atk:252, spe:8}, nature: 'Naughty',
			},
			'%Crestfall': {
				species: 'Darkrai', ability: 'Parental Bond', item: 'Lum Berry', gender: 'M',
				moves: ['darkpulse', 'icebeam', 'oblivionwing'],
				baseSignatureMove: 'protect', signatureMove: "Final Hour",
				evs: {spa:252, def:4, spe:252}, nature: 'Modest',
			},
			'%DTC': {
				species: 'Charizard', ability: 'Magic Guard', item: 'Charizardite X', gender: 'M',
				moves: ['shiftgear', 'blazekick', 'roost'],
				baseSignatureMove: 'dragonrush', signatureMove: "Dragon Smash",
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
			},
			'%Feliburn': {
				species: 'Infernape', ability: 'Adaptability', item: 'Expert Belt', gender: 'M',
				moves: ['highjumpkick', 'sacredfire', 'taunt', 'fusionbolt', 'machpunch'],
				baseSignatureMove: 'firepunch', signatureMove: "Falcon Punch",
				evs: {atk:252, def:4, spe:252}, nature: 'Jolly',
			},
			'%galbia': {
				species: 'Cobalion', ability: 'Serene Grace', item: 'Leftovers',
				moves: ['ironhead', 'taunt', 'swordsdance', 'thunderwave', 'substitute'],
				baseSignatureMove: 'highjumpkick', signatureMove: "Kibitz",
				evs: {atk:252, def:4, spe:252}, nature: 'Jolly',
			},
			'%Hugendugen': {
				species: 'Latios', ability: 'Prankster', item: 'Life Orb', gender: 'M',
				moves: ['taunt', 'dracometeor', 'surf', 'earthpower', 'recover', 'thunderbolt', 'icebeam'],
				baseSignatureMove: 'psychup', signatureMove: "Policy Decision",
				evs: {hp:4, spa:252, spe:252}, nature: 'Modest',
			},
			'%Jellicent': {
				species: 'Jellicent', ability: 'Poison Heal', item: 'Toxic Orb', gender: 'M',
				moves: ['recover', 'freezedry', 'trick', 'substitute'],
				baseSignatureMove: 'surf', signatureMove: "Shot For Shot",
				evs: {hp:252, def:4, spd:252}, nature: 'Calm',
			},
			'%Kayo': {
				species: 'Gourgeist-Super', ability: 'Magic Bounce', item: 'Leftovers', gender: 'M', shiny: true,
				moves: ['leechseed', 'shadowforce', 'spore', 'recover'],
				baseSignatureMove: 'vinewhip', signatureMove: "Beard of Zeus Bomb",
				evs: {hp:252, def:252, spd:4}, nature: 'Impish',
			},
			'%LJDarkrai': {
				species: 'Garchomp', ability: 'Compound Eyes', item: 'Life Orb', gender: 'M',
				moves: ['dragondance', 'dragonrush', 'gunkshot', 'precipiceblades', 'sleeppowder', 'stoneedge'], name: '%LJDarkrai',
				baseSignatureMove: 'blazekick', signatureMove: "Blaze Blade",
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
			},
			'%Majorbling': {
				species: 'Dedenne', ability: 'Levitate', item: 'Expert Belt', gender: 'M',
				moves: ['moonblast', 'voltswitch', 'discharge', 'focusblast', 'taunt'],
				baseSignatureMove: 'bulletpunch', signatureMove: "Focus Laser",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
			},
			'%QuoteCS': {
				species: 'Skarmory', ability: 'Adaptability', item: 'Life Orb', gender: 'M',
				moves: ['meteormash', 'bravebird', 'roost'],
				baseSignatureMove: 'spikes', signatureMove: "Diversify",
				evs: {hp:248, atk:252, spe:8}, nature: 'Adamant',
			},
			'%raseri': {
				species: 'Prinplup', ability: 'Regenerator', item: 'Eviolite', gender: 'M',
				moves: ['defog', 'stealthrock', 'toxic', 'roar', 'bravebird'],
				baseSignatureMove: 'scald', signatureMove: "Ban Scald",
				evs: {hp:252, def:228, spd:28}, nature: 'Bold',
			},
			'%uselesstrainer': {
				species: 'Scatterbug', ability: 'Skill Link', item: 'Mail', gender: 'M',
				moves: ['explosion', 'stringshot', 'stickyweb', 'spiderweb', 'mist'],
				baseSignatureMove: 'bulletpunch', signatureMove: "Ranting",
				evs: {atk:252, def:4, spe:252}, nature: 'Jolly',
			},
			'%Vacate': {
				species: 'Bibarel', ability: 'Adaptability', item: 'Leftovers', gender: 'M',
				moves: ['earthquake', 'smellingsalts', 'stockpile', 'zenheadbutt', 'waterfall'],
				baseSignatureMove: 'superfang', signatureMove: "Duper Fang",
				evs: {atk:252, def:4, spd:252}, nature: 'Quiet',
			},
			// Voices.
			'+Aldaron': {
				species: 'Conkeldurr', ability: 'Speed Boost', item: 'Assault Vest', gender: 'M',
				moves: ['drainpunch', 'machpunch', 'iciclecrash', 'closecombat', 'earthquake', 'shadowclaw'],
				baseSignatureMove: 'superpower', signatureMove: "Admin Decision",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant',
			},
			'+bmelts': {
				species: 'Mewtwo', ability: 'Regenerator', item: 'Mewtwonite X', gender: 'M',
				moves: ['batonpass', 'uturn', 'voltswitch'],
				baseSignatureMove: 'partingshot', signatureMove: "Aaaannnd... he's gone",
				evs: {hp:4, spa:252, spe:252}, nature: 'Modest',
			},
			'+Cathy': {
				species: 'Aegislash', ability: 'Stance Change', item: 'Life Orb', gender: 'F',
				moves: ['kingsshield', 'shadowsneak', ['calmmind', 'shadowball', 'shadowclaw', 'flashcannon', 'dragontail', 'hyperbeam'][this.random(5)]],
				baseSignatureMove: 'memento', signatureMove: "HP Display Policy",
				evs: {hp:4, atk:252, spa:252}, nature: 'Quiet',
			},
			'+Diatom': {
				species: 'Spiritomb', ability: 'Parental Bond', item: 'Custap Berry', gender: 'M',
				moves: ['psywave', ['poisonfang', 'shadowstrike'][this.random(2)], ['uturn', 'rapidspin'][this.random(2)]],
				baseSignatureMove: 'healingwish', signatureMove: "Be Thankful I Sacrificed Myself",
				evs: {hp:252, def:136, spd:120}, nature: 'Impish',
			},
			'+Limi': {
				species: 'Primeape', ability: 'Poison Heal', item: 'Leftovers', gender: 'M',
				moves: ['ingrain', 'doubleedge', 'leechseed'],
				baseSignatureMove: 'growl', signatureMove: "Resilience",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant',
			},
			'+MattL': {
				species: 'Mandibuzz', ability: 'Poison Heal', item: 'Leftovers', gender: 'M',
				moves: ['oblivionwing', 'leechseed', 'quiverdance', 'topsyturvy', 'substitute'],
				baseSignatureMove: 'toxic', signatureMove: "Topology",
				evs: {hp:252, def:252, spd:4}, nature: 'Bold',
			},
			'+mikel': {
				species: 'Giratina', ability: 'Prankster', item: 'Lum Berry', gender: 'M',
				moves: ['rest', 'recycle', ['toxic', 'willowisp'][this.random(2)]],
				baseSignatureMove: 'swagger', signatureMove: "Trolling Lobby",
				evs: {hp:252, def:128, spd:128}, ivs: {atk:0}, nature: 'Calm',
			},
			'+Great Sage': {
				species: 'Shuckle', ability: 'Harvest', item: 'Leppa Berry', gender: '',
				moves: ['substitute', 'protect', 'batonpass'],
				baseSignatureMove: 'judgment', signatureMove: "Judgment",
				evs: {hp:252, def:28, spd:228}, ivs: {atk:0, def:0, spe:0}, nature: 'Bold',
			},
			'+Redew': {
				species: 'Minun', ability: 'Wonder Guard', item: 'Air Balloon', gender: 'M',
				moves: ['nastyplot', 'thunderbolt', 'icebeam'],
				baseSignatureMove: 'recover', signatureMove: "Recover",
				evs:{hp:4, spa:252, spe:252}, nature: 'Modest',
			},
			'+shaymin': {
				species: 'Shaymin-Sky', ability: 'Serene Grace', item: 'Expert Belt', gender: 'F',
				moves: ['seedflare', 'airslash', ['secretsword', 'earthpower', 'roost'][this.random(3)]],
				baseSignatureMove: 'detect', signatureMove: "Flower Garden",
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
			},
			'+SOMALIA': {
				species: 'Gastrodon', ability: 'Anger Point', item: 'Leftovers', gender: 'M',
				moves: ['recover', 'steameruption', 'earthpower', 'leafstorm', 'substitute'],
				baseSignatureMove: 'energyball', signatureMove: "Ban Everyone",
				evs: {hp:252, spa:252, spd:4}, nature: 'Modest',
			},
			'+TalkTakesTime': {
				species: 'Registeel', ability: 'Flash Fire', item: 'Leftovers', gender: 'M',
				moves: ['recover', 'ironhead', 'bellydrum'],
				baseSignatureMove: 'taunt', signatureMove: "Bot Mute",
				evs: {hp:252, atk:252, def:4}, nature: 'Adamant',
			},
		};
		// Generate the team randomly.
		let pool = Object.keys(sets);
		let levels = {'~':99, '&':97, '@':96, '%':96, '+':95};
		for (let i = 0; i < 6; i++) {
			let identity = this.sampleNoReplace(pool);
			let rank = identity.charAt(0);
			let set = sets[identity];
			set.level = levels[rank];
			set.name = identity;
			if (!set.ivs) {
				set.ivs = {hp:31, atk:31, def:31, spa:31, spd:31, spe:31};
			} else {
				for (let iv in {hp:31, atk:31, def:31, spa:31, spd:31, spe:31}) {
					set.ivs[iv] = set.ivs[iv] ? set.ivs[iv] : 31;
				}
			}
			// Assuming the hardcoded set evs are all legal.
			if (!set.evs) set.evs = {hp:84, atk:84, def:84, spa:84, spd:84, spe:84};
			set.moves = set.moves.sample(3).concat(set.baseSignatureMove);
			team.push(set);
		}

		// Check for Illusion.
		if (team[5].name === '&Slayer95') {
			let temp = team[4];
			team[4] = team[5];
			team[5] = temp;
		}

		return team;
	},

	randomRainbowTeam: function () {
		let pokemonLeft = 0;
		let pokemon = [];

		let excludedTiers = {'LC':1, 'LC Uber':1, 'NFE':1};
		let allowedNFE = {'Chansey':1, 'Doublade':1, 'Gligar':1, 'Porygon2':1, 'Scyther':1};
		let excludedColors = {'Black':1, 'Brown':1, 'Gray':1, 'White':1};

		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			let template = this.getTemplate(id);
			if (!excludedTiers[template.tier] && !excludedColors[template.color] && !template.isMega && !template.isPrimal && !template.isNonstandard && template.randomBattleMoves) {
				pokemonPool.push(id);
			}
		}

		let typeCount = {};
		let typeComboCount = {};
		let colorCount = {};
		let baseFormes = {};
		let uberCount = 0;
		let puCount = 0;
		let teamDetails = {megaCount: 0, stealthRock: 0};

		while (pokemonPool.length && pokemonLeft < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;

			// Not available on ORAS
			if (template.species === 'Pichu-Spiky-eared') continue;

			// Useless in Random Battle without greatly lowering the levels of everything else
			if (template.species === 'Unown') continue;

			// Only certain NFE Pokemon are allowed
			if (template.evos.length && !allowedNFE[template.species]) continue;

			let tier = template.tier;
			switch (tier) {
			case 'PU':
				// PUs are limited to 2 but have a 20% chance of being added anyway.
				if (puCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'Uber':
				// Ubers are limited to 2 but have a 20% chance of being added anyway.
				if (uberCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'CAP':
				// CAPs have 20% the normal rate
				if (this.random(5) >= 1) continue;
				break;
			case 'Unreleased':
				// Unreleased Pokémon have 20% the normal rate
				if (this.random(5) >= 1) continue;
			}

			// Adjust rate for species with multiple formes
			switch (template.baseSpecies) {
			case 'Arceus':
				if (this.random(18) >= 1) continue;
				break;
			case 'Basculin':
				if (this.random(2) >= 1) continue;
				break;
			case 'Genesect':
				if (this.random(5) >= 1) continue;
				break;
			case 'Gourgeist':
				if (this.random(4) >= 1) continue;
				break;
			case 'Meloetta':
				if (this.random(2) >= 1) continue;
				break;
			case 'Castform':
				if (this.random(2) >= 1) continue;
				break;
			case 'Pikachu':
				// Pikachu is not a viable NFE Pokemon
				continue;
			}

			// Limit 2 of any type, 1 of any color
			let types = template.types;
			let colorGroups = {'Red': 'R', 'Pink': 'R', 'Yellow': 'G', 'Green': 'G', 'Blue': 'B', 'Purple': 'B'};
			let color = colorGroups[template.color];
			let skip = false;
			for (let t = 0; t < types.length; t++) {
				if (typeCount[types[t]] > 1 && this.random(5) >= 1) {
					skip = true;
					break;
				}
			}
			if (colorCount[color] > 1 && this.random(8) >= 1) {
				skip = true;
			}
			if (skip) continue;

			let set = this.randomSet(template, pokemon.length, teamDetails);

			// Illusion shouldn't be on the last pokemon of the team
			if (set.ability === 'Illusion' && pokemonLeft > 4) continue;

			// Limit 1 of any type combination
			let typeCombo = types.join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in typeComboCount) continue;

			// Limit the number of Megas to one
			let forme = template.otherFormes && this.getTemplate(template.otherFormes[0]);
			let isMegaSet = this.getItem(set.item).megaStone || (forme && forme.isMega && forme.requiredMove && set.moves.indexOf(toId(forme.requiredMove)) >= 0);
			if (isMegaSet && teamDetails.megaCount > 0) continue;

			// Okay, the set passes, add it to our team
			if (template.species !== 'Ditto') set.moves.push('swift');
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can increment our counters
			pokemonLeft++;

			// Increment type and color counters
			for (let t = 0; t < types.length; t++) {
				if (types[t] in typeCount) {
					typeCount[types[t]]++;
				} else {
					typeCount[types[t]] = 1;
				}
			}
			typeComboCount[typeCombo] = 1;
			if (color in colorCount) {
				colorCount[color]++;
			} else {
				colorCount[color] = 1;
			}

			// Increment Uber/NU counters
			if (tier === 'Uber') {
				uberCount++;
			} else if (tier === 'PU') {
				puCount++;
			}

			// Increment mega, stealthrock, and base species counters
			if (isMegaSet) teamDetails.megaCount++;
			if (set.moves.indexOf('stealthrock') >= 0) teamDetails.stealthRock++;
			baseFormes[template.baseSpecies] = 1;
		}
		return pokemon;
	},

	randomSpoopyTeam: function () {
		let pool = [
			'ekans', 'arbok', 'golbat', 'parasect', 'muk', 'gengar', 'marowak', 'weezing', 'tangela', 'mr. mime', 'ditto',
			'kabutops', 'noctowl', 'ariados', 'crobat', 'umbreon', 'murkrow', 'misdreavus', 'gligar', 'granbull', 'sneasel',
			'houndoom', 'mightyena', 'dustox', 'shiftry', 'shedinja', 'exploud', 'sableye', 'mawile', 'swalot', 'carvanha',
			'sharpedo', 'cacturne', 'seviper', 'lunatone', 'claydol', 'shuppet', 'banette', 'duskull', 'dusclops', 'absol',
			'snorunt', 'glalie', 'drifloon', 'drifblim', 'mismagius', 'honchkrow', 'skuntank', 'spiritomb', 'drapion',
			'toxicroak', 'weavile', 'tangrowth', 'gliscor', 'dusknoir', 'froslass', 'rotom', 'rotomwash', 'rotomheat',
			'rotommow', 'purrloin', 'liepard', 'swoobat', 'whirlipede', 'scolipede', 'basculin', 'krookodile', 'sigilyph',
			'yamask', 'cofagrigus', 'garbodor', 'zorua', 'zoroark', 'gothita', 'gothorita', 'gothitelle', 'frillish',
			'jellicent', 'joltik', 'galvantula', 'elgyem', 'beheeyem', 'litwick', 'lampent', 'chandelure', 'golurk',
			'zweilous', 'hydreigon', 'volcarona', 'espurr', 'meowstic', 'honedge', 'doublade', 'aegislash', 'malamar',
			'phantump', 'trevenant', 'pumpkaboo', 'gourgeist', 'noibat', 'noivern', 'magikarp', 'farfetchd', 'machamp',
		];
		let team = [];

		for (let i = 0; i < 6; i++) {
			let mon = this.sampleNoReplace(pool);
			let template = this.getTemplate(mon);
			if (mon === 'pumpkaboo' || mon === 'gourgeist') {
				let forme = this.random(4);
				if (forme > 0) {
					mon = template.otherFormes[forme - 1];
					template = this.getTemplate(mon);
				}
			}
			let set = this.randomSet(template, i, {megaCount: 1});
			set.species = mon;
			if (mon === 'magikarp') {
				set.name = 'ayy lmao';
				set.item = 'powerherb';
				set.ability = 'primordialsea';
				set.moves = ['hyperbeam', 'geomancy', 'originpulse', 'aquaring', 'trickortreat'];
			} else {
				if (mon === 'golurk') {
					set.name = 'Spoopy Skilenton';
				} else if (mon === 'farfetchd') {
					set.name = 'Le Toucan of Luck';
				} else if (mon === 'machamp') {
					set.name = 'John Cena';
				} else if (mon === 'espurr') {
					set.name = 'Devourer of Souls';
				}
				set.moves[4] = 'trickortreat';
				if (set.item === 'Assault Vest') {
					set.item = 'Leftovers';
				}
				if (set.item === 'Choice Band' || set.item === 'Choice Specs') {
					set.item = 'Life Orb';
				}
			}
			team.push(set);
		}

		return team;
	},

	randomSeasonalHeroTeam: function () {
		let teams = [
			['Wolverine', 'Professor X', 'Cyclops', 'Nightcrawler', 'Phoenix', 'Emma Frost', 'Storm', 'Iceman'],
			['Magneto', 'Mystique', 'Quicksilver', 'Scarlet Witch', 'Blob', 'Pyro', 'Sabretooth', 'Juggernaut', 'Toad'],
			['Captain America', 'Hulk', 'Iron Man', 'Hawkeye', 'Black Widow', 'Thor', 'Nick Fury', 'Vision'],
			['Starlord', 'Gamora', 'Groot', 'Rocket Raccoon', 'Drax the Destroyer', 'Nova'],
			['Batman', 'Superman', 'Aquaman', 'Wonder Woman', 'Green Lantern', 'The Flash', 'Green Arrow', 'Firestorm'],
			['Robin', 'Starfire', 'Cyborg', 'Beast Boy', 'Raven', 'Jinx', 'Terra', 'Blue Beetle'],
			['Mr. Fantastic', 'Invisible Woman', 'Thing', 'Human Torch', 'Spiderman', 'Ant-Man'],
			['Baymax', 'Honey Lemon', 'GoGo Tomago', 'Wasabi-no-Ginger', 'Fredzilla', 'Silver Samurai', 'Sunfire'],
			['Joker', 'Deadshot', 'Harley Quinn', 'Boomerang', 'Killer Croc', 'Enchantress'],
			['Poison Ivy', 'Bane', 'Scarecrow', 'Two-Face', 'Penguin', 'Mr. Freeze', 'Catwoman'],
		];
		let mons = {
			'Wolverine': {species: 'excadrill', ability: 'Regenerator', item: 'lifeorb', gender: 'M'},
			'Professor X': {species: 'beheeyem', moves: ['psystrike', 'thunderbolt', 'calmmind', 'aurasphere', 'signalbeam'], gender: 'M'},
			'Cyclops': {species: 'sigilyph', moves: ['icebeam', 'psybeam', 'signalbeam', 'chargebeam'], item: 'lifeorb',
				ability: 'tintedlens', gender: 'M'},
			'Nightcrawler': {species: 'sableye', gender: 'M'}, 'Phoenix': {species: 'Ho-oh', gender: 'F'},
			'Emma Frost': {species: 'dianciemega', gender: 'F'}, 'Storm': {species: 'tornadus', gender: 'F'},
			'Iceman': {species: 'regice', moves: ['freezedry', 'thunderbolt', 'focusblast', 'thunderwave'], gender: 'M'},
			'Magneto': {species: 'magnezone', required: 'flashcannon', gender: 'M'}, 'Quicksilver': {species: 'lucario', gender: 'M', required: 'extremespeed'}, 'Scarlet Witch': {species: 'delphox', gender: 'F'},
			'Blob': {species: 'snorlax', gender: 'M'}, 'Pyro': {species: 'magmortar', gender: 'M'}, 'Juggernaut': {species: 'conkeldurr', gender: 'M'}, 'Toad': {species: 'poliwrath', gender: 'M'},
			'Mystique': {species: 'mew', moves: ['knockoff', 'zenheadbutt', 'stormthrow', 'acrobatics', 'fakeout'], ability: 'Illusion', gender: 'F'},
			'Sabretooth': {species: 'zangoose', ability: 'Tough Claws', item: 'lifeorb',
				moves: ['swordsdance', 'quickattack', 'doubleedge', 'closecombat', 'knockoff'], gender: 'M'},
			'Captain America': {species: 'braviary', gender: 'M'}, 'Hulk': {species: 'machamp', shiny: true, gender: 'M'},
			'Iron Man': {species: 'magmortar', moves: ['fireblast', 'flashcannon', 'thunderbolt', 'energyball', 'focusblast', 'substitute'], gender: 'M'},
			'Hawkeye': {species: 'gliscor', item: 'flyinggem', moves: ['thousandarrows', 'acrobatics', 'stoneedge', 'knockoff'], ability: 'hypercutter', gender: 'M'},
			'Black Widow': {species: 'greninja', gender: 'F', shiny: true}, 'Thor': {species: 'ampharosmega', gender: (this.random(10) ? 'M' : 'F')}, 'Nick Fury': {species: 'primeape', gender: 'M'},
			'Vision': {species: 'genesectshock', shiny: true}, 'Starlord': {species: 'medicham', required: 'teeterdance', gender: 'M'},
			'Groot': {species: 'trevenant', moves: ['hornleech', 'shadowforce', 'hammerarm', 'icepunch'], item: 'assaultvest', gender: 'N'},
			'Rocket Raccoon': {species: 'linoone', gender: 'M'}, 'Gamora': {species: 'gardevoirmega', gender: 'F'},
			'Drax the Destroyer': {species: 'throh', gender: 'M'}, 'Nova': {species: 'electivire', gender: 'M'}, 'Batman': {species: 'crobat', gender: 'M'},
			'Superman': {species: 'deoxys', gender: 'M'}, 'Aquaman': {species: 'samurott', gender: 'M'}, 'Wonder Woman': {species: 'lopunnymega', gender: 'F'},
			'Green Lantern': {species: 'reuniclus', moves: ['psyshock', 'shadowball', 'aurasphere', 'recover'], gender: 'M'}, 'The Flash': {species: 'blaziken', gender: 'M'},
			'Green Arrow': {species: 'sceptilemega', moves: ['dragonpulse', 'thousandarrows', 'seedflare', 'flashcannon'], gender: 'M'},
			'Firestorm': {species: 'infernape', gender: 'M'}, 'Robin': {species: 'talonflame', gender: 'M'}, 'Starfire': {species: 'latias', gender: 'F'},
			'Cyborg': {species: 'golurk', gender: 'M'}, 'Raven': {species: 'absolmega', gender: 'F'}, 'Jinx': {species: 'mismagius', gender: 'F'},
			'Terra': {species: 'nidoqueen', gender: 'F'}, 'Blue Beetle': {species: 'heracross', gender: 'M'}, 'Beast Boy': {species: 'virizion', gender: 'M'},
			'Mr. Fantastic': {species: 'zygarde', gender: 'M'}, 'Invisible Woman': {species: 'cresselia', gender: 'F'}, 'Thing': {species: 'regirock', gender: 'M'},
			'Human Torch': {species: 'typhlosion', gender: 'M'}, 'Spiderman': {species: 'Ariados', gender: 'M'}, 'Ant-Man': {species: 'durant', gender: 'M'},
			'Baymax': {species: 'regigigas'}, 'Honey Lemon': {species: 'goodra', gender: 'F'}, 'GoGo Tomago': {species: 'heliolisk', gender: 'F'},
			'Wasabi-no-Ginger': {species: 'gallademega', gender: 'M'}, 'Fredzilla': {species: 'tyrantrum', gender: 'M'}, 'Silver Samurai': {species: 'cobalion', gender: 'M'},
			'Sunfire': {species: 'charizardmegay', gender: 'M'}, 'Joker': {species: 'mrmime', gender: 'M'}, 'Boomerang': {species: 'marowak', gender: 'M'},
			'Deadshot': {species: 'kingdra', ability: 'No Guard', item: 'scopelens', moves: ['dracometeor', 'hydropump', 'searingshot', 'aurasphere'], gender: 'M'},
			'Harley Quinn': {species: 'lopunny', gender: 'F'}, 'Killer Croc': {species: 'krookodile', gender: 'M'}, 'Enchantress': {species: 'mesprit', gender: 'F'},
			'Bane': {species: 'metagross', gender: 'M'}, 'Scarecrow': {species: 'cacturne', moves: ['gunkshot', 'seedbomb', 'knockoff', 'drainpunch'], shiny: true, gender: 'M'},
			'Penguin': {species: 'empoleon', gender: 'M'}, 'Two-Face': {species: 'zweilous', gender: 'M'}, 'Mr. Freeze': {species: 'beartic', gender: 'M'}, 'Catwoman': {species: 'persian', gender: 'F'},
			'Poison Ivy': {species: 'roserade', gender: 'F'},
		};

		if (!this.seasonal) this.seasonal = {};

		let teamDetails = {megaCount: 1, stealthRock: 0, hazardClear: 0};
		let sides = Object.keys(teams);
		let side;
		while (side === undefined || this.seasonal.side === side) {
			// You can't have both players have the same squad
			side = this.sampleNoReplace(sides);
		}
		if (this.seasonal.side === undefined) this.seasonal.side = side;

		let heroes = teams[side];
		let pokemonTeam = [];

		for (let i = 0; i < 6; i++) {
			let hero = this.sampleNoReplace(heroes);
			let heroTemplate = mons[hero];

			let template = {};
			if (heroTemplate.moves) template.randomBattleMoves = heroTemplate.moves;
			if (heroTemplate.required) template.requiredMove = heroTemplate.required;
			Object.merge(template, this.getTemplate(heroTemplate.species), false, false);

			let pokemon = this.randomSet(template, i, teamDetails);

			if (heroTemplate.ability) pokemon.ability = heroTemplate.ability;
			if (heroTemplate.gender) pokemon.gender = heroTemplate.gender;
			if (heroTemplate.item) pokemon.item = heroTemplate.item;
			pokemon.species = pokemon.name;
			pokemon.name = hero;
			pokemon.shiny = !!heroTemplate.shiny;

			pokemonTeam.push(pokemon);

			if (pokemon.ability === 'Snow Warning') teamDetails['hail'] = 1;
			if (pokemon.ability === 'Drizzle' || pokemon.moves.indexOf('raindance') >= 0) teamDetails['rain'] = 1;
			if (pokemon.moves.indexOf('stealthrock') >= 0) teamDetails.stealthRock++;
			if (pokemon.moves.indexOf('defog') >= 0 || pokemon.moves.indexOf('rapidspin') >= 0) teamDetails.hazardClear++;
		}

		return pokemonTeam;
	},
};
