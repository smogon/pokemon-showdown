/**
 * Seasonal Ladders of Pokémon Showdown
 * The formats with the mod-like tweaks go into /data/formats.js
 * The team making scripts go into /data/scripts.js
 *
 * THIS IS A BACKUP FILE.
 */

'use strict';

exports.BattleScripts = {
	randomSeasonalVVTeam: function (side) {
		let couples = [
			'nidoranf+nidoranm', 'nidorina+nidorino', 'nidoqueen+nidoking', 'gallade+gardevoir', 'plusle+minun', 'illumise+volbeat',
			'latias+latios', 'skitty+wailord', 'tauros+miltank', 'rufflet+vullaby', 'braviary+mandibuzz', 'mew+mesprit',
			'audino+chansey', 'lickilicky+blissey', 'purugly+beautifly', 'clefairy+wigglytuff', 'clefable+jigglypuff',
			'cleffa+igglybuff', 'pichu+pachirisu', 'alomomola+luvdisc', 'gorebyss+huntail', 'kyuremb+kyuremw', 'cherrim+cherubi',
			'slowbro+slowking', 'jynx+lickitung', 'milotic+gyarados', 'slowpoke+shellder', 'happiny+mimejr', 'mrmime+smoochum',
			'woobat+munna', 'swoobat+musharna', 'delcatty+lopunny', 'skitty+buneary', 'togetic+shaymin', 'glameow+snubbull', 'whismur+wormadam',
			'finneon+porygon', 'ditto+porygon2', 'porygonz+togekiss', 'hoppip+togepi', 'lumineon+corsola', 'exeggcute+flaaffy',
		];
		let shouldHaveAttract = {audino:1, beautifly:1, delcatty:1, finneon:1, glameow:1, lumineon:1, purugly:1, swoobat:1, woobat:1, wormadam:1, wormadamsandy:1, wormadamtrash:1};
		let shouldHaveKiss = {buneary:1, finneon:1, lopunny:1, lumineon:1, minun:1, pachirisu:1, pichu:1, plusle:1, shaymin:1, togekiss:1, togepi:1, togetic:1};

		let team = [];
		let pokemons = [...this.sampleNoReplace(couples).split('+'), ...this.sampleNoReplace(couples).split('+'), ...this.sampleNoReplace(couples).split('+')];

		for (let i = 0; i < 6; i++) {
			let pokemon = pokemons[i];
			if (pokemon === 'wormadam') pokemon = ['wormadam', 'wormadamsandy', 'wormadamtrash'][this.random(3)];
			let template = this.getTemplate(pokemon);
			let set = this.randomSet(template, i);
			// We set some arbitrary moves
			if (template.id === 'jynx' && set.moves.indexOf('lovelykiss') < 0) set.moves[0] = 'Lovely Kiss';
			if (template.id in shouldHaveAttract) set.moves[0] = 'Attract';
			if (template.id in shouldHaveKiss) set.moves[0] = 'Sweet Kiss';
			// We set some arbitrary levels to balance
			if (template.id === 'kyuremblack' || template.id === 'kyuremwhite') set.level = 60;
			if (template.id === 'magikarp') set.level = 100;
			team.push(set);
		}

		return team;
	},
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
};
