// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.js

exports.Formats = [

	// XY Singles
	///////////////////////////////////////////////////////////////////

	{
		name: "Random Battle",
		section: "ORAS Singles",

		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "Unrated Random Battle",
		section: "ORAS Singles",

		team: 'random',
		challengeShow: false,
		rated: false,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "OU",
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite']
	},
	{
		name: "OU (no Mega)",
		section: "ORAS Singles",

		ruleset: ['OU'],
		onBegin: function () {
			for (var i = 0; i < this.p1.pokemon.length; i++) {
				this.p1.pokemon[i].canMegaEvo = false;
			}
			for (var i = 0; i < this.p2.pokemon.length; i++) {
				this.p2.pokemon[i].canMegaEvo = false;
			}
		}
	},
	{
		name: "Ubers",
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview', 'Mega Rayquaza Clause'],
		banlist: []
	},
	{
		name: "UU",
		section: "ORAS Singles",

		searchShow: false,
		ruleset: ['OU'],
		banlist: ['OU', 'BL', 'Alakazite', 'Altarianite', 'Diancite', 'Heracronite', 'Galladite', 'Gardevoirite', 'Lopunnite', 'Medichamite',
			'Metagrossite', 'Pinsirite', 'Drizzle', 'Drought', 'Shadow Tag'
		]
	},
	{
		name: "UU (suspect test)",
		section: "ORAS Singles",

		ruleset: ['UU'],
		banlist: ['Pidgeotite']
	},
	{
		name: "RU",
		section: "ORAS Singles",

		ruleset: ['UU'],
		banlist: ['UU', 'BL2', 'Galladite', 'Houndoominite', 'Pidgeotite']
	},
	{
		name: "NU",
		section: "ORAS Singles",

		searchShow: false,
		ruleset: ['RU'],
		banlist: ['RU', 'BL3', 'Cameruptite', 'Glalitite', 'Steelixite']
	},
	{
		name: "NU (suspect test)",
		section: "ORAS Singles",

		challengeShow: false,
		ruleset: ['RU'],
		banlist: ['RU', 'BL3', 'Cameruptite', 'Glalitite', 'Steelixite']
	},
	{
		name: "LC",
		section: "ORAS Singles",

		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['LC Uber', 'Gligar', 'Misdreavus', 'Scyther', 'Sneasel', 'Tangela', 'Dragon Rage', 'Sonic Boom', 'Swagger']
	},
	{
		name: "Anything Goes",
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal']
	},
	{
		name: "CAP Naviathan Playtest",
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Allow CAP', 'Syclant', 'Revenankh', 'Pyroak', 'Fidgit', 'Stratagem', 'Arghonaut', 'Kitsunoh', 'Cyclohm', 'Colossoil', 'Krilowatt', 'Voodoom',
			'Tomohawk', 'Necturna', 'Mollux', 'Aurumoth', 'Malaconda', 'Cawmodore', 'Volkraken', 'Plasmanta',
			'Aegislash', 'Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Dialga', 'Genesect',
			'Giratina', 'Giratina-Origin', 'Greninja', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia',
			'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Xerneas', 'Yveltal', 'Zekrom',
			'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite', 'Soul Dew'
		]
	},
	{
		name: "Battle Spot Singles",
		section: "ORAS Singles",

		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview GBU'],
		requirePentagon: true,
		validateTeam: function (team, format) {
			if (team.length < 3) return ['You must bring at least three Pok\u00e9mon.'];
		},
		onBegin: function () {
			this.debug('cutting down to 3');
			this.p1.pokemon = this.p1.pokemon.slice(0, 3);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 3);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Battle Spot Special 10",
		section: "ORAS Singles",

		maxForcedLevel: 50,
		ruleset: ['Battle Spot Singles'],
		requirePentagon: true,
		validateTeam: function (team, format) {
			if (team.length < 3) return ['You must bring at least three Pok\u00e9mon.'];
		},
		onBegin: function () {
			this.debug('cutting down to 3');
			this.p1.pokemon = this.p1.pokemon.slice(0, 3);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 3);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		onNegateImmunity: function (pokemon, type) {
			if (type in this.data.TypeChart && this.runEvent('Immunity', pokemon, null, null, type)) return false;
		},
		onEffectiveness: function (typeMod, target, type, move) {
			// The effectiveness of Freeze Dry on Water isn't reverted
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.getImmunity(move, type)) return 1;
			return -typeMod;
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
		ruleset: ['Team Preview', 'Cancel Mod']
	},

	// XY Doubles
	///////////////////////////////////////////////////////////////////

	{
		name: "Random Doubles Battle",
		section: "ORAS Doubles",

		gameType: 'doubles',
		team: 'randomDoubles',
		ruleset: ['PotD', 'Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "Doubles OU",
		section: "ORAS Doubles",

		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard Doubles', 'Team Preview'],
		banlist: ['Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo',
			'Palkia', 'Rayquaza', 'Reshiram', 'Xerneas', 'Yveltal', 'Zekrom', 'Salamencite', 'Soul Dew', 'Dark Void',
			'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder', 'Gravity ++ Spore'
		]
	},
	{
		name: "Doubles Ubers",
		section: "ORAS Doubles",

		gameType: 'doubles',
		ruleset: ['Pokemon', 'Species Clause', 'Moody Clause', 'OHKO Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal', 'Dark Void']
	},
	{
		name: "Doubles UU",
		section: "ORAS Doubles",

		gameType: 'doubles',
		ruleset: ['Doubles OU'],
		banlist: ['Aegislash', 'Amoonguss', 'Azumarill', 'Bisharp', 'Breloom', 'Camerupt', 'Chandelure', 'Charizard', 'Conkeldurr',
		'Cresselia', 'Diancie', 'Dragonite', 'Excadrill', 'Ferrothorn', 'Garchomp', 'Gardevoir',
		'Gengar', 'Greninja', 'Gyarados', 'Heatran', 'Hitmontop', 'Hydreigon', 'Kangaskhan', 'Keldeo',
		'Kyurem-Black', 'Landorus', 'Landorus-Therian', 'Latios', 'Ludicolo', 'Mamoswine', 'Mawile', 'Metagross', 'Mew',
		'Politoed', 'Rotom-Wash', 'Sableye', 'Scizor', 'Scrafty', 'Shaymin-Sky',
		'Suicune', 'Sylveon', 'Talonflame', 'Terrakion', 'Thundurus', 'Togekiss',
		'Tyranitar', 'Venusaur', 'Weavile', 'Whimsicott', 'Zapdos'
		]
	},
	{
		name: "Doubles NU",
		section: "ORAS Doubles",

		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Doubles UU'],
		banlist: ['Snorlax', 'Machamp', 'Lopunny', 'Galvantula', 'Mienshao', 'Infernape', 'Aromatisse',
		'Clawitzer', 'Kyurem', 'Flygon', 'Lucario', 'Alakazam', 'Gastrodon', 'Bronzong', 'Chandelure',
		'Dragalge', 'Mamoswine', 'Genesect', 'Arcanine', 'Volcarona', 'Aggron', 'Manectric', 'Salamence',
		'Tornadus', 'Porygon2', 'Latias', 'Meowstic', 'Ninetales', 'Crobat', 'Blastoise', 'Darmanitan',
		'Sceptile', 'Jirachi', 'Goodra', 'Deoxys-Attack', 'Milotic', 'Victini', 'Hariyama', 'Crawdaunt',
		'Aerodactyl', 'Abomasnow', 'Krookodile', 'Cofagrigus', 'Druddigon', 'Escavalier', 'Dusclops',
		'Slowbro', 'Slowking', 'Eelektross', 'Spinda', 'Cloyster', 'Raikou', 'Thundurus-Therian', 'Swampert',
		'Nidoking', 'Aurorus', 'Granbull', 'Braviary'
		]
	},
	{
		name: "Battle Spot Doubles (VGC 2015)",
		section: "ORAS Doubles",

		gameType: 'doubles',
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview VGC'],
		banlist: ['Tornadus + Defiant', 'Thundurus + Defiant', 'Landorus + Sheer Force'],
		requirePentagon: true,
		validateTeam: function (team, format) {
			if (team.length < 4) return ['You must bring at least four Pok\u00e9mon.'];
		},
		onBegin: function () {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0, 4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Doubles Hackmons Cup",
		section: "ORAS Doubles",

		gameType: 'doubles',
		team: 'randomHC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
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
		ruleset: ['Team Preview', 'Cancel Mod']
	},

	// XY Triples
	///////////////////////////////////////////////////////////////////

	{
		name: "Random Triples Battle",
		section: "ORAS Triples",

		gameType: 'triples',
		team: 'randomDoubles',
		ruleset: ['PotD', 'Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "Smogon Triples",
		section: "ORAS Triples",

		gameType: 'triples',
		ruleset: ['Pokemon', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
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
		requirePentagon: true,
		validateTeam: function (team, format) {
			if (team.length < 6) return ['You must have six Pokémon.'];
		}
	},
	{
		name: "Triples Hackmons Cup",
		section: "ORAS Triples",

		gameType: 'triples',
		team: 'randomHC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
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
		ruleset: ['Team Preview', 'Cancel Mod']
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////
	
	{
		name: "Mix and Mega",
		section: "OM of the Month",
		column: 2,

		mod: 'mixandmega', //Forcibly prevent Knock Off + Trick
		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview'],
		banlist: ['Shadow Tag', 'Gengarite'],
		validateTeam: function (team, format) {
			var itemTable = {};
			for (var i = 0; i < team.length; i++) {
				var item = this.getItem(team[i].item);
				if (!item) continue;
				if (itemTable[item] && item.megaStone) {
					return ["You are limited to one of each Mega Stone.", "(You have more than one " + this.getItem(item).name + ")"];
				} else if (itemTable[item] && (item.id === "redorb" || item.name === "blueorb")) {
					return ["You are limited to one of each Primal Orb.", "(You have more than one " + this.getItem(item).name + ")"];
				}
				itemTable[item] = true;
			}
		},
		onBegin: function () {
			var allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (var i = 0, len = allPokemon.length; i < len; i++) {
				var pokemon = allPokemon[i];
				pokemon.baseSpecies = pokemon.baseTemplate.species; //Storage
			}
		},
		//Prepare Mega-Evolutions/Devolutions
		onSwitchInPriority: -6,
		onSwitchIn: function (pokemon) {
			if (!pokemon.template.isMega && !pokemon.template.isPrimal && !pokemon.canMegaEvo) {
				if (!pokemon.baseStatStorage) pokemon.baseStatStorage = {atk: pokemon.baseTemplate.baseStats.atk, def: pokemon.baseTemplate.baseStats.def, spa: pokemon.baseTemplate.baseStats.spa, spd: pokemon.baseTemplate.baseStats.spd, spe: pokemon.baseTemplate.baseStats.spe};
				if (!pokemon.typeStorage) pokemon.typeStorage = [pokemon.baseTemplate.types[0]];
				if (pokemon.baseTemplate.types[1]) pokemon.typeStorage[1] = pokemon.baseTemplate.types[1];
				if (!pokemon.weightStorage) pokemon.weightStorage = pokemon.baseTemplate.weightkg;
				var megaEvo = false;
				var item = (pokemon.item) ? this.getItem(pokemon.item) : false;
				var spec = pokemon.baseTemplate.species;
				
				//Primal Devolution
				if (item && (item.id === 'redorb' || item.id === 'blueorb')) {
					//If you're an uber or uber-like Pokemon, don't [Gdon + Ogre will work as normal due to items.js]
					if (pokemon.baseTemplate.tier !== 'Uber' && spec !== 'Kyurem-Black' && spec !== 'Slaking' && spec !== 'Regigigas' && spec !== 'Cresselia' && !(pokemon.baseTemplate.evos && pokemon.baseTemplate.evos[0])) {
						var pstr = (item.id === 'redorb') ? 'Groudon-Primal' : 'Kyogre-Primal';
						var template = this.getTemplate(pstr);
						pokemon.formeChange(template);
						pokemon.baseTemplate = template;
						pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
						this.add('detailschange', pokemon, pokemon.details);
						this.add('message', pokemon.name + "'s Primal Reversion! It reverted to its primal form!");
						pokemon.setAbility(template.abilities['0']);
						pokemon.baseAbility = pokemon.ability;
					}
				}
				
				//Mega Evolution
				//If you're an uber, don't.
				if (pokemon.baseTemplate.tier === 'Uber' && (spec !== 'Mewtwo' || (item.id !== 'mewtwonitex' && item.id !== 'mewtwonitey'))) return pokemon.canMegaEvo = false;
				//If you don't have a mega stone, you can't mega-evolve, except if you have Dragon Ascent.
				if ((!item || !item.megaStone) && pokemon.moves.indexOf('dragonascent') === -1) return pokemon.canMegaEvo = false;
				if (item && item.megaStone) megaEvo = item.megaStone;
				//Mega stones have priority over Rayquaza-Mega.
				if (!megaEvo && pokemon.moves.indexOf('dragonascent') > -1 && spec !== 'Rayquaza') megaEvo = 'Rayquaza-Mega'; //Prevent Rayquaza from Mega Evolving, but allow Smeargle to Mega-Evolve
				//If you aren't fully evolved, due to flavor reasons, you can't mega-evolve regardless.
				//I feel bad about this too, Mega-Pikachu would've been sick [Albeit Light Ball Pikachu still would be better]
				if (pokemon.baseTemplate.evos && pokemon.baseTemplate.evos[0]) return pokemon.canMegaEvo = false;
				var ab = [pokemon.baseTemplate.abilities[0], pokemon.baseTemplate.abilities[1], pokemon.baseTemplate.abilities['H']];
				
				//Species-Based Mega-Evolutions
				if (spec === 'Kyurem-Black' || spec === 'Slaking' || spec === 'Regigigas' || spec === 'Cresselia') return pokemon.canMegaEvo = false;
				if (item.id === 'beedrillite' && spec !== 'Beedrill') return pokemon.canMegaEvo = false;
				if (item.id === 'kangaskhanite' && spec !== 'Kangaskhan') return pokemon.canMegaEvo = false;
				//Ability-Based Mega-Evolutions
				if (item.id === 'medichamite' && spec !== 'Medicham' && spec !== 'Mawile' && ab.indexOf('Huge Power') === -1 && ab.indexOf('Pure Power') === -1) return pokemon.canMegaEvo = false;
				if (item.id === 'mawilite' && spec !== 'Mawile' && ab.indexOf('Huge Power') === -1 && ab.indexOf('Pure Power') === -1) return pokemon.canMegaEvo = false;
				if (item.id === 'gengarite' && spec !== 'Gengar' && ab.indexOf('Shadow Tag') === -1) return pokemon.canMegaEvo = false;
				if (item.id === 'blazikenite' && spec !== 'Blaziken' && ab.indexOf('Speed Boost') === -1) return pokemon.canMegaEvo = false;
				//Stat-based Mega-Evolutions
				if ((item.id === 'ampharosite' || item.id === 'heracronite' || item.id === 'garchompite') && pokemon.baseStatStorage.spe < 10) return pokemon.canMegaEvo = false;
				if (item.id === 'cameruptite' && pokemon.baseStatStorage.spe < 20) return pokemon.canMegaEvo = false;
				if ((item.id === 'abomasite' || item.id === 'sablenite') && pokemon.baseStatStorage.spe < 30) return pokemon.canMegaEvo = false;
				if (item.id === 'beedrillite' && pokemon.baseStatStorage.spa < 30) return pokemon.canMegaEvo = false; //Doesn't matter
				if (item.id === 'diancite' && (pokemon.baseStatStorage.def < 40 || pokemon.baseStatStorage.spd < 40)) return pokemon.canMegaEvo = false;
				if (item.id === 'lopunnite' && pokemon.weightStorage < 5) return pokemon.canMegaEvo = false;
				if (item.id === 'mewtwonitey' && (pokemon.weightStorage < 89 || pokemon.baseStatStorage.def < 20)) return pokemon.canMegaEvo = false;
				//Overflow Limiter [SHUCKLE, Steelix, Regirock]
				if (spec === 'Shuckle' && ['abomasite', 'aggronite', 'audinite', 'cameruptite', 'charizarditex', 'charizarditey', 'galladite', 'gyaradosite', 'heracronite', 'houndoominite', 'latiasite', 'mewtwonitey', 'sablenite', 'salamencite', 'scizorite', 'sharpedonite', 'slowbronite', 'steelixite', 'tyranitarite', 'venusaurite'].indexOf(item.id) > -1) return pokemon.canMegaEvo = false;
				if ((spec === 'Steelix' || spec === 'Regirock') && item.id === 'slowbronite') return pokemon.canMegaEvo = false;
				
				return pokemon.canMegaEvo = megaEvo;
			}
		},
		onModifyPokemon: function (pokemon) {
			for (var q in pokemon.side.pokemon) {
				var p = pokemon.side.pokemon[q];
				if ((p.baseTemplate.isMega || p.baseTemplate.isPrimal) && p.baseSpecies !== 'Kyogre' && p.baseSpecies !== 'Groudon') {
					if (!p.statCalc && !p.newBaseStats) {
						var spec = p.baseTemplate.species;
						p.megaBaseStats = {atk: p.baseStatStorage.atk, def: p.baseStatStorage.def, spa: p.baseStatStorage.spa, spd: p.baseStatStorage.spd, spe: p.baseStatStorage.spe};
						if (!p.megaTypes) p.megaTypes = [p.typeStorage[0]];
						if (p.typeStorage[1]) p.megaTypes[1] = p.typeStorage[1];
						p.megaWeight = p.weightStorage;
						if (spec === 'Abomasnow-Mega') {
							p.megaBaseStats.atk += 40;
							p.megaBaseStats.def += 30;
							p.megaBaseStats.spa += 40;
							p.megaBaseStats.spd += 20;
							p.megaBaseStats.spe -= 30;
							p.megaWeight += 2;
						} else if (spec === 'Absol-Mega') {
							p.megaBaseStats.atk += 20;
							p.megaBaseStats.spa += 40;
							p.megaBaseStats.spe += 40;
						} else if (spec === 'Aerodactyl-Mega') {
							p.megaBaseStats.atk += 30;
							p.megaBaseStats.def += 20;
							p.megaBaseStats.spa += 10;
							p.megaBaseStats.spd += 20;
							p.megaBaseStats.spe += 20;
							p.megaWeight += 20;
						} else if (spec === 'Aggron-Mega') {
							p.megaBaseStats.atk += 30;
							p.megaBaseStats.def += 50;
							p.megaBaseStats.spd += 20;
							p.megaWeight += 35;
							if (p.megaTypes[0] === 'Steel') p.megaTypes = ['Steel'];
							else p.megaTypes[1] = 'Steel';
						} else if (spec === 'Alakazam-Mega') {
							p.megaBaseStats.def += 20;
							p.megaBaseStats.spa += 40;
							p.megaBaseStats.spe += 30;
						} else if (spec === 'Altaria-Mega') {
							p.megaBaseStats.atk += 40;
							p.megaBaseStats.def += 20;
							p.megaBaseStats.spa += 40;
							if (p.megaTypes[0] === 'Fairy') p.megaTypes = ['Fairy'];
							else p.megaTypes[1] = 'Fairy';
						} else if (spec === 'Ampharos-Mega') {
							p.megaBaseStats.atk += 20;
							p.megaBaseStats.def += 20;
							p.megaBaseStats.spa += 50;
							p.megaBaseStats.spd += 20;
							p.megaBaseStats.spe -= 10;
							if (p.megaTypes[0] === 'Dragon') p.megaTypes = ['Dragon'];
							else p.megaTypes[1] = 'Dragon';
						} else if (spec === 'Audino-Mega') {
							p.megaBaseStats.def += 40;
							p.megaBaseStats.spa += 20;
							p.megaBaseStats.spd += 40;
							p.megaWeight += 1;
							if (p.megaTypes[0] === 'Fairy') p.megaTypes = ['Fairy'];
							else p.megaTypes[1] = 'Fairy';
						} else if (spec === 'Banette-Mega') {
							p.megaBaseStats.atk += 50;
							p.megaBaseStats.def += 10;
							p.megaBaseStats.spa += 10;
							p.megaBaseStats.spd += 20;
							p.megaBaseStats.spe += 10;
							p.megaWeight += .5;
						} else if (spec === 'Beedrill-Mega') { //Doesn't matter, but eehhhhhhhhhhhh
							p.megaBaseStats.atk += 60;
							p.megaBaseStats.spa -= 30;
							p.megaBaseStats.spe += 70;
						} else if (spec === 'Blastoise-Mega') {
							p.megaBaseStats.atk += 20;
							p.megaBaseStats.def += 20;
							p.megaBaseStats.spa += 50;
							p.megaBaseStats.spd += 10;
							p.megaWeight += 15.6;
						} else if (spec === 'Blaziken-Mega') {
							p.megaBaseStats.atk += 40;
							p.megaBaseStats.def += 10;
							p.megaBaseStats.spa += 20;
							p.megaBaseStats.spd += 10;
							p.megaBaseStats.spe += 20;
						} else if (spec === 'Camerupt-Mega') {
							p.megaBaseStats.atk += 20;
							p.megaBaseStats.def += 30;
							p.megaBaseStats.spa += 40;
							p.megaBaseStats.spd += 30;
							p.megaBaseStats.spe -= 20;
							p.megaWeight += 100.5;
						} else if (spec === 'Charizard-Mega-X') {
							p.megaBaseStats.atk += 46;
							p.megaBaseStats.def += 33;
							p.megaBaseStats.spa += 21;
							p.megaWeight += 20;
							if (p.megaTypes[0] === 'Dragon') p.megaTypes = ['Dragon'];
							else p.megaTypes[1] = 'Dragon';
						} else if (spec === 'Charizard-Mega-Y') {
							p.megaBaseStats.atk += 20;
							p.megaBaseStats.spa += 50;
							p.megaBaseStats.spd += 30;
							p.megaWeight += 10;
						} else if (spec === 'Diancie-Mega') {
							p.megaBaseStats.atk += 60;
							p.megaBaseStats.def -= 40;
							p.megaBaseStats.spa += 60;
							p.megaBaseStats.spd -= 40;
							p.megaBaseStats.spe += 60;
							p.megaWeight += 19;
						} else if (spec === 'Gallade-Mega') {
							p.megaBaseStats.atk += 40;
							p.megaBaseStats.def += 30;
							p.megaBaseStats.spe += 30;
							p.megaWeight += 4.4;
						} else if (spec === 'Garchomp-Mega') {
							p.megaBaseStats.atk += 40;
							p.megaBaseStats.def += 20;
							p.megaBaseStats.spa += 40;
							p.megaBaseStats.spd += 10;
							p.megaBaseStats.spe -= 10;
						} else if (spec === 'Gardevoir-Mega') {
							p.megaBaseStats.atk += 20;
							p.megaBaseStats.spa += 40;
							p.megaBaseStats.spd += 20;
							p.megaBaseStats.spe += 20;
						} else if (spec === 'Gengar-Mega') {
							p.megaBaseStats.def += 20;
							p.megaBaseStats.spa += 40;
							p.megaBaseStats.spd += 20;
							p.megaBaseStats.spe += 20;
						} else if (spec === 'Glalie-Mega') {
							p.megaBaseStats.atk += 40;
							p.megaBaseStats.spa += 40;
							p.megaBaseStats.spe += 20;
							p.megaWeight += 93.7;
						} else if (spec === 'Groudon-Primal') {
							p.megaBaseStats.atk += 30;
							p.megaBaseStats.def += 20;
							p.megaBaseStats.spa += 50;
							p.megaWeight += 49.7;
							if (p.megaTypes[0] === 'Fire') p.megaTypes = ['Fire'];
							else p.megaTypes[1] = 'Fire';
						} else if (spec === 'Gyarados-Mega') {
							p.megaBaseStats.atk += 30;
							p.megaBaseStats.def += 30;
							p.megaBaseStats.spa += 10;
							p.megaBaseStats.spd += 30;
							p.megaWeight += 70;
							if (p.megaTypes[0] === 'Dark') p.megaTypes = ['Dark'];
							else p.megaTypes[1] = 'Dark';
						} else if (spec === 'Heracross-Mega') {
							p.megaBaseStats.atk += 60;
							p.megaBaseStats.def += 40;
							p.megaBaseStats.spd += 10;
							p.megaBaseStats.spe -= 10;
							p.megaWeight += 8.5;
						} else if (spec === 'Houndoom-Mega') {
							p.megaBaseStats.def += 40;
							p.megaBaseStats.spa += 30;
							p.megaBaseStats.spd += 10;
							p.megaBaseStats.spe += 20;
							p.megaWeight += 14.5;
						} else if (spec === 'Kangaskhan-Mega') { //hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
							p.megaBaseStats.atk += 30;
							p.megaBaseStats.def += 20;
							p.megaBaseStats.spa += 20;
							p.megaBaseStats.spd += 20;
							p.megaBaseStats.spe += 10;
						} else if (spec === 'Kyogre-Primal') {
							p.megaBaseStats.atk += 50;
							p.megaBaseStats.spa += 30;
							p.megaBaseStats.spd += 20;
							p.megaWeight += 78;
						} else if (spec === 'Latias-Mega') {
							p.megaBaseStats.atk += 20;
							p.megaBaseStats.def += 30;
							p.megaBaseStats.spa += 30;
							p.megaBaseStats.spd += 20;
							p.megaWeight += 12;
						} else if (spec === 'Latios-Mega') {
							p.megaBaseStats.atk += 40;
							p.megaBaseStats.def += 20;
							p.megaBaseStats.spa += 30;
							p.megaBaseStats.spd += 10;
							p.megaWeight += 10;
						} else if (spec === 'Lopunny-Mega') {
							p.megaBaseStats.atk += 60;
							p.megaBaseStats.def += 10;
							p.megaBaseStats.spe += 30;
							p.megaWeight -= 5;
							if (p.megaTypes[0] === 'Fighting') p.megaTypes = ['Fighting'];
							else p.megaTypes[1] = 'Fighting';
						} else if (spec === 'Lucario-Mega') {
							p.megaBaseStats.atk += 35;
							p.megaBaseStats.def += 18;
							p.megaBaseStats.spa += 25;
							p.megaBaseStats.spe += 22;
							p.megaWeight += 3.5;
						} else if (spec === 'Manectric-Mega') {
							p.megaBaseStats.def += 20;
							p.megaBaseStats.spa += 30;
							p.megaBaseStats.spd += 20;
							p.megaBaseStats.spe += 30;
							p.megaWeight += 3.8;
						} else if (spec === 'Mawile-Mega') {
							p.megaBaseStats.atk += 20;
							p.megaBaseStats.def += 40;
							p.megaBaseStats.spd += 40;
							p.megaWeight += 12;
						} else if (spec === 'Medicham-Mega') {
							p.megaBaseStats.atk += 40;
							p.megaBaseStats.def += 10;
							p.megaBaseStats.spa += 20;
							p.megaBaseStats.spd += 10;
							p.megaBaseStats.spe += 20;
						} else if (spec === 'Metagross-Mega') {
							p.megaBaseStats.atk += 10;
							p.megaBaseStats.def += 20;
							p.megaBaseStats.spa += 10;
							p.megaBaseStats.spd += 20;
							p.megaBaseStats.spe += 40;
							p.megaWeight += 392.9;
						} else if (spec === 'Mewtwo-Mega-X') {
							p.megaBaseStats.atk += 80;
							p.megaBaseStats.def += 10;
							p.megaBaseStats.spd += 10;
							p.megaWeight += 5;
							if (p.megaTypes[0] === 'Fighting') p.megaTypes = ['Fighting'];
							else p.megaTypes[1] = 'Fighting';
						} else if (spec === 'Mewtwo-Mega-Y') {
							p.megaBaseStats.atk += 40;
							p.megaBaseStats.def -= 20;
							p.megaBaseStats.spa += 40;
							p.megaBaseStats.spd += 30;
							p.megaBaseStats.spe += 10;
							p.megaWeight -= 89;
						} else if (spec === 'Pidgeot-Mega') {
							p.megaBaseStats.def += 5;
							p.megaBaseStats.spa += 65;
							p.megaBaseStats.spd += 10;
							p.megaBaseStats.spe += 20;
							p.megaWeight += 11;
						} else if (spec === 'Pinsir-Mega') {
							p.megaBaseStats.atk += 30;
							p.megaBaseStats.def += 20;
							p.megaBaseStats.spa += 10;
							p.megaBaseStats.spd += 20;
							p.megaBaseStats.spe += 20;
							p.megaWeight += 4;
							if (p.megaTypes[0] === 'Flying') p.megaTypes = ['Flying'];
							else p.megaTypes[1] = 'Flying';
						} else if (spec === 'Rayquaza-Mega') {
							p.megaBaseStats.atk += 30;
							p.megaBaseStats.def += 10;
							p.megaBaseStats.spa += 30;
							p.megaBaseStats.spd += 10;
							p.megaBaseStats.spe += 20;
							p.megaWeight += 185.5;
						} else if (spec === 'Sableye-Mega') {
							p.megaBaseStats.atk += 10;
							p.megaBaseStats.def += 50;
							p.megaBaseStats.spa += 20;
							p.megaBaseStats.spd += 50;
							p.megaBaseStats.spe -= 30;
							p.megaWeight += 150;
						} else if (spec === 'Salamence-Mega') {
							p.megaBaseStats.atk += 10;
							p.megaBaseStats.def += 50;
							p.megaBaseStats.spa += 10;
							p.megaBaseStats.spd += 10;
							p.megaBaseStats.spe += 20;
							p.megaWeight += 10;
						} else if (spec === 'Sceptile-Mega') {
							p.megaBaseStats.atk += 25;
							p.megaBaseStats.def += 10;
							p.megaBaseStats.spa += 40;
							p.megaBaseStats.spe += 25;
							p.megaWeight += 3;
							if (p.megaTypes[0] === 'Dragon') p.megaTypes = ['Dragon'];
							else p.megaTypes[1] = 'Dragon';
						} else if (spec === 'Scizor-Mega') {
							p.megaBaseStats.atk += 20;
							p.megaBaseStats.def += 40;
							p.megaBaseStats.spa += 10;
							p.megaBaseStats.spd += 20;
							p.megaBaseStats.spe += 10;
							p.megaWeight += 7;
						} else if (spec === 'Sharpedo-Mega') {
							p.megaBaseStats.atk += 20;
							p.megaBaseStats.def += 30;
							p.megaBaseStats.spa += 15;
							p.megaBaseStats.spd += 25;
							p.megaBaseStats.spe += 10;
							p.megaWeight += 41.5;
						} else if (spec === 'Slowbro-Mega') {
							p.megaBaseStats.def += 70;
							p.megaBaseStats.spa += 30;
							p.megaWeight += 31.5;
						} else if (spec === 'Steelix-Mega') {
							p.megaBaseStats.atk += 40;
							p.megaBaseStats.def += 30;
							p.megaBaseStats.spd += 30;
							p.megaWeight += 340;
						} else if (spec === 'Swampert-Mega') {
							p.megaBaseStats.atk += 40;
							p.megaBaseStats.def += 20;
							p.megaBaseStats.spa += 10;
							p.megaBaseStats.spd += 20;
							p.megaBaseStats.spe += 10;
							p.megaWeight += 20.1;
						} else if (spec === 'Tyranitar-Mega') {
							p.megaBaseStats.atk += 30;
							p.megaBaseStats.def += 40;
							p.megaBaseStats.spd += 20;
							p.megaBaseStats.spe += 10;
							p.megaWeight += 53;
						} else if (spec === 'Venusaur-Mega') {
							p.megaBaseStats.atk += 18;
							p.megaBaseStats.def += 40;
							p.megaBaseStats.spa += 22;
							p.megaBaseStats.spd += 20;
							p.megaWeight += 55;
						}
						p.statCalc = true;
					}
					p.newBaseStats = {};
					for (var statName in p.megaBaseStats) {
						var stat = p.megaBaseStats[statName];
						stat = Math.floor(Math.floor(2 * stat + p.set.ivs[statName] + Math.floor(p.set.evs[statName] / 4)) * p.level / 100 + 5);
						var nature = p.battle.getNature(p.set.nature);
						if (statName === nature.plus) stat *= 1.1;
						if (statName === nature.minus) stat *= 0.9;
						p.newBaseStats[statName] = Math.floor(stat);
					}
					p.baseStats = p.stats = p.newBaseStats;
					if (!p.typestr) {
						p.typestr = p.megaTypes[0];
						if (p.megaTypes[1]) p.typestr += '/' + p.megaTypes[1];
					}
					if (!p.typechange && p.isActive) {
						this.add('-start', pokemon, 'typechange', p.typestr);
						p.typechange = true;
						p.typesData = [{type: p.megaTypes[0], suppressed: false,  isAdded: false}];
						if (p.megaTypes[1]) p.typesData[1] = {type: p.megaTypes[1], suppressed: false,  isAdded: false};
						this.add('-message', p.name + ' is a ' + p.baseSpecies + '!');
					} else if (p.typechange && !p.isActive) {
						p.typechange = false;
					}
				}
			}
		}
	},
	{
		name: "Protean Palace",
		section: "OM of the Month",

		ruleset: ['OU'],
		banlist: [],
		onPrepareHit: function (source, target, move) {
			var type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] Protean');
			}
		}
	},
	{
		name: "CAP",
		section: "Other Metagames",
		column: 2,

		searchShow: false,
		ruleset: ['OU'],
		banlist: ['Allow CAP']
	},
	{
		name: "Battle Factory",
		section: "Other Metagames",

		team: 'randomFactory',
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Mega Rayquaza Clause']
	},
	{
		name: "Challenge Cup 1v1",
		section: "Other Metagames",

		team: 'randomCC',
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview 1v1'],
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

		ruleset: ['Pokemon', 'Ability Clause', '-ate Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Arena Trap', 'Huge Power', 'Parental Bond', 'Pure Power', 'Shadow Tag', 'Wonder Guard', 'Assist', 'Chatter']
	},
	{
		name: "1v1",
		section: 'Other Metagames',

		ruleset: ['Pokemon', 'Moody Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Swagger Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview 1v1'],
		banlist: ['Illegal', 'Unreleased', 'Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin',
			'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky',
			'Xerneas', 'Yveltal', 'Zekrom', 'Focus Sash', 'Kangaskhanite', 'Soul Dew'
		],
		validateTeam: function (team, format) {
			if (team.length > 3) return ['You may only bring up to three Pok\u00e9mon.'];
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
		banlist: ['Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin', 'Greninja', 'Groudon', 'Ho-Oh',
			'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Talonflame', 'Xerneas', 'Yveltal', 'Zekrom',
			'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Metagrossite', 'Salamencite', 'Shaymin-Sky', 'Slowbronite', 'Soul Dew'
		]
	},
	{
		name: "Tier Shift",
		section: "Other Metagames",

		mod: 'tiershift',
		ruleset: ['OU'],
		banlist: ['Shadow Tag', 'Chatter']
	},
	{
		name: "PU",
		section: "Other Metagames",

		ruleset: ['NU'],
		banlist: ['NU', 'BL4', 'Altarianite', 'Beedrillite', 'Lopunnite', 'Chatter', 'Shell Smash + Baton Pass']
	},
	{
		name: "Inverse Battle",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Diggersby', 'Giratina-Origin', 'Groudon',
			'Ho-Oh', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Serperior',
			'Shaymin-Sky', 'Snorlax', 'Xerneas', 'Yveltal', 'Zekrom', 'Gengarite', 'Kangaskhanite', 'Salamencite', 'Soul Dew'
		],
		onNegateImmunity: function (pokemon, type) {
			if (type in this.data.TypeChart && this.runEvent('Immunity', pokemon, null, null, type)) return false;
		},
		onEffectiveness: function (typeMod, target, type, move) {
			// The effectiveness of Freeze Dry on Water isn't reverted
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.getImmunity(move, type)) return 1;
			return -typeMod;
		}
	},
	{
		name: "Almost Any Ability",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Ability Clause', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Ignore Illegal Abilities',
			'Arceus', 'Archeops', 'Bisharp', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon',
			'Ho-Oh', 'Keldeo', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Mamoswine', 'Mewtwo', 'Palkia', 'Rayquaza',
			'Regigigas', 'Reshiram', 'Shedinja', 'Slaking', 'Smeargle', 'Terrakion', 'Weavile', 'Xerneas', 'Yveltal', 'Zekrom',
			'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite', 'Soul Dew', 'Chatter'
		],
		validateSet: function (set) {
			var bannedAbilities = {'Aerilate': 1, 'Arena Trap': 1, 'Contrary': 1, 'Fur Coat': 1, 'Huge Power': 1, 'Imposter': 1, 'Parental Bond': 1, 'Protean': 1, 'Pure Power': 1, 'Shadow Tag': 1, 'Simple':1, 'Speed Boost': 1, 'Wonder Guard': 1};
			if (set.ability in bannedAbilities) {
				var template = this.getTemplate(set.species || set.name);
				var legalAbility = false;
				for (var i in template.abilities) {
					if (set.ability === template.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return ['The ability ' + set.ability + ' is banned on Pok\u00e9mon that do not naturally have it.'];
			}
		}
	},
	{
		name: "STABmons",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Ignore STAB Moves',
			'Arceus', 'Blaziken', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Diggersby', 'Genesect', 'Giratina', 'Giratina-Origin', 'Greninja',
			'Groudon', 'Ho-Oh', 'Keldeo', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Landorus', 'Lugia', 'Mewtwo', 'Palkia',
			'Porygon-Z', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Sylveon', 'Xerneas', 'Yveltal', 'Zekrom',
			'Aerodactylite', 'Altarianite', 'Gengarite', 'Kangaskhanite', "King's Rock", 'Lopunnite', 'Lucarionite', 'Mawilite', 'Metagrossite', 'Razor Fang',
			'Salamencite', 'Slowbronite', 'Soul Dew'
		]
	},
	{
		name: "LC UU",
		section: "Other Metagames",

		maxLevel: 5,
		ruleset: ['LC'],
		banlist: ['Abra', 'Aipom', 'Archen', 'Bunnelby', 'Carvanha', 'Chinchou', 'Corphish', 'Cottonee', 'Croagunk', 'Diglett',
			'Drilbur', 'Dwebble', 'Elekid', 'Ferroseed', 'Fletchling', 'Foongus', 'Gastly', 'Gothita', 'Houndour', 'Larvesta',
			'Magnemite', 'Mienfoo', 'Munchlax', 'Omanyte', 'Onix', 'Pawniard', 'Ponyta', 'Porygon', 'Pumpkaboo-Super', 'Scraggy',
			'Shellder', 'Skrelp', 'Snivy', 'Snubbull', 'Spritzee', 'Staryu', 'Surskit', 'Timburr', 'Tirtouga', 'Vullaby',
			'Vulpix', 'Zigzagoon', 'Shell Smash'
		]
	},
	{
		name: "Hackmons Cup",
		section: "Other Metagames",

		team: 'randomHC',
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "2v2 Doubles",
		section: "Other Metagames",

		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Doubles OU'],
		banlist: ['Perish Song'],
		validateTeam: function (team, format) {
			if (team.length > 4) return ['You may only bring up to four Pok\u00e9mon.'];
		},
		onBegin: function () {
			this.p1.pokemon = this.p1.pokemon.slice(0, 2);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 2);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Averagemons",
		section: "Other Metagames",

		searchShow: false,
		mod: 'averagemons',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Sableye + Prankster', 'Shedinja', 'Smeargle', 'Venomoth',
			'DeepSeaScale', 'DeepSeaTooth', 'Eviolite', 'Gengarite', 'Kangaskhanite', 'Light Ball', 'Mawilite', 'Medichamite', 'Soul Dew', 'Thick Club',
			'Arena Trap', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Chatter'
		]
	},
	{
		name: "Hidden Type",
		section: "Other Metagames",

		searchShow: false,
		mod: 'hiddentype',
		ruleset: ['OU']
	},
	{
		name: "OU Theorymon",
		section: "Other Metagames",

		mod: 'theorymon',
		searchShow: false,
		ruleset: ['OU']
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
		name: "Monotype Random Battle",
		section: "Other Metagames",

		team: 'randomMonotype',
		searchShow: false,
		ruleset: ['Pokemon', 'Same Type Clause', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
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
		searchShow: false,
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview GBU'],
		banlist: ['Dark Void', 'Sky Drop'],
		onBegin: function () {
			this.debug('cutting down to 3');
			this.p1.pokemon = this.p1.pokemon.slice(0, 3);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 3);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
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
		ruleset: ['Team Preview', 'Cancel Mod']
	},

	// BW2 Doubles
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 5] Doubles OU",
		section: 'BW2 Doubles',
		column: 3,

		mod: 'gen5',
		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo',
			'Palkia', 'Rayquaza', 'Reshiram', 'Zekrom', 'Soul Dew', 'Dark Void', 'Sky Drop'
		]
	},
	{
		name: "[Gen 5] GBU Doubles",
		section: 'BW2 Doubles',

		mod: 'gen5',
		gameType: 'doubles',
		searchShow: false,
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview VGC'],
		banlist: ['Dark Void', 'Sky Drop'],
		onBegin: function () {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0, 4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
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
		ruleset: ['Team Preview', 'Cancel Mod']
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
		ruleset: ['Cancel Mod']
	},
	{
		name: "[Gen 4] Doubles Custom Game",
		section: 'Past Generations',

		mod: 'gen4',
		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions
		ruleset: ['Cancel Mod']
	},
	{
		name: "[Gen 3] OU",
		section: "Past Generations",

		mod: 'gen3',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'Smeargle + Ingrain']
	},
	{
		name: "[Gen 3] Ubers",
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
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "[Gen 2] OU",
		section: "Past Generations",

		mod: 'gen2',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber']
	},
	{
		name: "[Gen 2] Random Battle",
		section: "Past Generations",

		mod: 'gen2',
		searchShow: false,
		team: 'random',
		ruleset: ['Pokemon', 'Standard']
	},
	{
		name: "[Gen 2] Custom Game",
		section: "Past Generations",

		mod: 'gen2',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "[Gen 1] OU",
		section: "Past Generations",

		mod: 'gen1',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber']
	},
	{
		name: "[Gen 1] Ubers",
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
		banlist: []
	},
	{
		name: "[Gen 1] OU (tradeback)",
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Uber', 'Unreleased', 'Illegal',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember'
		]
	},
	{
		name: "[Gen 1] Random Battle",
		section: "Past Generations",

		mod: 'gen1',
		team: 'random',
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "[Gen 1] Challenge Cup",
		section: "Past Generations",

		mod: 'gen1',
		team: 'randomCC',
		searchShow: false,
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "[Gen 1] Stadium",
		section: "Past Generations",

		mod: 'stadium',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Uber',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember'
		]
	},
	{
		name: "[Gen 1] Custom Game",
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	}
];
