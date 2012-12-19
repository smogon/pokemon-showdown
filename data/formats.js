exports.BattleFormats = {
/**********************************
FORMATS
**********************************/
	randombattle: {
		effectType: 'Format',
		section: 'Random',
		name: "Random Battle",
		team: 'random',
		canUseRandomTeam: true,
		searchDefault: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause']
	},
	unratedrandombattle: {
		effectType: 'Format',
		section: 'Random',
		name: "Unrated Random Battle",
		team: 'random',
		canUseRandomTeam: true,
		searchShow: true,
		ruleset: ['Random Battle']
	},
	seasonalwinterwonderland: {
		effectType: 'Format',
		section: 'Random',
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
		ruleset: ['Random Battle']
	},
	challengecup: {
		effectType: 'Format',
		section: 'Random',
		name: "Challenge Cup",
		team: 'randomCC',
		canUseRandomTeam: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		ruleset: ['Pokemon']
	},
	doublesrandombattledev: {
		effectType: 'Format',
		section: 'Random',
		gameType: 'doubles',
		name: "Doubles Random Battle",
		team: 'random',
		canUseRandomTeam: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		debug: true,
		ruleset: ['PotD', 'Pokemon']
	},
	doubleschallengecup: {
		effectType: 'Format',
		section: 'Random',
		gameType: 'doubles',
		name: "Doubles Challenge Cup",
		team: 'randomCC',
		canUseRandomTeam: true,
		rated: true,
		challengeShow: true,
		debug: true,
		ruleset: ['Pokemon']
	},
	ou: {
		effectType: 'Format',
		section: 'Standard',
		name: "OU",
		challengeDefault: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Smogon', 'Team Preview', 'Evasion Clause'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew', 'Snow Cloak', 'Sand Veil', 'Spikes + Sleep Powder + Roserade']
	},
	//ubers: {
	//	effectType: 'Format',
	//	section: 'Smogon',
	//	name: "Ubers",
	//	rated: true,
	//	challengeShow: true,
	//	searchShow: true,
	//	isTeambuilderFormat: true,
	//	ruleset: ['Pokemon', 'Smogon', 'Team Preview', 'Evasion Clause'],
	//	banlist: []
	//},
	ubers: {
		effectType: 'Format',
		section: 'Standard',
		name: "Ubers (suspect test)",//Suspect Test: no evasion clause
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Smogon', 'Team Preview'],
		banlist: []
	},
	uu: {
		effectType: 'Format',
		section: 'Standard',
		name: "UU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['OU'],
		banlist: ['OU', 'BL', 'Drought', 'Sand Stream']
	},
	ru: {
		effectType: 'Format',
		section: 'Standard',
		name: "RU (suspect test)",//Suspect Test: snow warning is legal
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['UU'],
		banlist: ['UU', 'BL2', 'Shell Smash + Baton Pass']
	},
	nu: {
		effectType: 'Format',
		section: 'Standard',
		name: "NU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['RU'],
		banlist: ['RU','BL3']
	},
	pu: {
		effectType: 'Format',
		section: 'Standard',
		name: "PU",
		challengeShow: true,
		ruleset: ['NU'],
		banlist: ["Charizard", "Wartortle", "Kadabra", "Golem", "Haunter", "Exeggutor", "Weezing", "Kangaskhan", "Pinsir", "Lapras", "Ampharos", "Misdreavus", "Piloswine", "Miltank", "Ludicolo", "Swellow", "Gardevoir", "Ninjask", "Camerupt", "Torkoal", "Cacturne", "Altaria", "Armaldo", "Absol", "Gorebyss", "Regirock", "Regice", "Torterra", "Bastiodon", "Floatzel", "Drifblim", "Skuntank", "Lickilicky", "Probopass", "Rotom-Fan", "Serperior", "Emboar", "Samurott", "Musharna", "Gurdurr", "Sawk", "Carracosta", "Garbodor", "Cinccino", "Sawsbuck", "Amoonguss", "Alomomola", "Golurk", "Braviary", "Rapidash", "Articuno"]
	},
	lc: {
		effectType: 'Format',
		section: 'Standard',
		name: "LC",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Sonicboom', 'Dragon Rage', 'Berry Juice', 'Carvanha', 'Meditite', 'Gligar', 'Scyther', 'Sneasel', 'Tangela', 'Vulpix', 'Yanma', 'Soul Dew']
	},
	lcubers: {
		effectType: 'Format',
		section: 'Standard',
		name: "LC Ubers",
		challengeShow: true,
		ruleset: ['Pokemon', 'Standard Ubers', 'Team Preview', 'Little Cup', 'Evasion Clause'],
		banlist: ['Sonicboom', 'Dragon Rage', 'Berry Juice', 'Soul Dew']
	},
	lcuu: {
		effectType: 'Format',
		section: 'Standard',
		name: "LC UU",
		challengeShow: true,
		ruleset: ['LC'],
		banlist: ['Abra', 'Aipom', 'Archen', 'Aron', 'Axew', 'Bronzor', 'Chinchou', 'Clamperl', 'Cottonee', 'Cranidos', 'Croagunk', 'Cubone', 'Diglett', 'Dratini', 'Drifloon', 'Drilbur', 'Duskull', 'Dwebble', 'Elekid', 'Ferroseed', 'Foongus', 'Frillish', 'Gastly', 'Hippopotas', 'Houndour', 'Larvesta', 'Lileep', 'Machop', 'Magnemite', 'Mienfoo', 'Misdreavus', 'Munchlax', 'Murkrow', 'Natu', 'Onix', 'Pawniard', 'Ponyta', 'Porygon', 'Scraggy', 'Shellder', 'Slowpoke', 'Snover', 'Staryu', 'Taillow', 'Timburr', 'Zorua']
	},
	doublesvgc2013dev: {
		effectType: 'Format',
		section: 'Standard',
		gameType: 'doubles',
		name: "Doubles VGC 2013 (dev)",
		rated: true,
		challengeShow: true,
		searchShow: true,
		debug: true,
		onBegin: function() {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0,4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0,4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		ruleset: ['Pokemon', 'VGC Team Preview', 'Nintendo'],
		banlist: []
	},
	norestrictions: {
		effectType: 'Format',
		section: 'Standard',
		name: "No Restrictions",
		challengeDefault: true,
		challengeShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Team Preview'],
		banlist: []
	},
	cap: {
		effectType: 'Format',
		section: 'Nonstandard',
		name: "CAP",
		rated: true,
		challengeShow: true,
	 	searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['CAP Pokemon', 'Smogon', 'Team Preview', 'Evasion Clause'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew', 'Spikes + Sleep Powder + Roserade']
	},
	hackmons: {
		effectType: 'Format',
		section: 'Nonstandard',
		name: "Hackmons",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Real Pokemon', 'Real Moves', 'Moveset Limits', 'Legal Form'],
		banlist: []
	},
	balancedhackmons: {
		effectType: 'Format',
		section: 'Nonstandard',
		name: "Balanced Hackmons",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Real Pokemon', 'Real Moves', 'Moveset Limits', 'Legal Form', 'OHKO Clause'],
		banlist: ['Wonder Guard', 'Pure Power', 'Huge Power', 'Shadow Tag', 'Arena Trap']
	},
	glitchmons: {
		effectType: 'Format',
		section: 'Nonstandard',
		name: "Glitchmons",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Team Preview'],
		banlist: ['Illegal', 'Unreleased'],
		mimicGlitch: true
	},
	dwou: {
		effectType: 'Format',
		section: 'Nonstandard',
		name: "DW OU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['DW Pokemon', 'Smogon', 'Team Preview', 'Evasion Clause'],
		banlist: ['Drizzle ++ Swift Swim', 'Soul Dew', 'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water', 'Blaziken', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Zekrom']
	},
	dwubers: {
		effectType: 'Format',
		section: 'Nonstandard',
		name: "DW Ubers",
		rated: true,
		challengeShow: true,
		isTeambuilderFormat: true,
		isDWtier: true,
		ruleset: ['DW Pokemon', 'Smogon', 'Team Preview', 'Evasion Clause'],
		banlist: []
	},
	dwuu: {
		effectType: 'Format',
		section: 'Nonstandard',
		name: "DW UU",
		challengeShow: true,
		ruleset: ['DW OU'],
		banlist: ['Chandelure', 'Genesect', 'Tyranitar', 'Dragonite', 'Breloom', 'Ferrothorn', 'Politoed', 'Gliscor', 'Ninetales', 'Scizor', 'Excadrill', 'Keldeo', 'Infernape', 'Venusaur', 'Heatran', 'Rotom-Wash', 'Garchomp', 'Serperior', 'Gengar', 'Volcarona', 'Forretress', 'Conkeldurr', 'Espeon', 'Cloyster', 'Skarmory', 'Starmie', 'Salamence', 'Gyarados', 'Zapdos', 'Jirachi', 'Latios', 'Tentacruel', 'Haxorus', 'Landorus', 'Mamoswine', 'Charizard', 'Lucario', 'Jellicent', 'Blissey', 'Terrakion', 'Heracross', 'Metagross', 'Ditto', 'Hydreigon', 'Thundurus', 'Alakazam', 'Deoxys-Speed', 'Latias', 'Gastrodon', 'Togekiss', 'Donphan', 'Bronzong', 'Manaphy']
	},
	gen4hackmons: {
		mod: 'gen4',
		effectType: 'Format',
		name: "[Gen 4] Hackmons",
		challengeShow: true,
		ruleset: ['Real Pokemon', 'Real Moves', 'Moveset Limits', 'Legal Form'],
		banlist: []
	},
	gen4customgame: {
		mod: 'gen4',
		effectType: 'Format',
		name: "[Gen 4] Custom Game",
		challengeShow: true,
		canUseRandomTeam: true,
		debug: true,
		// no restrictions, for serious
		ruleset: []
	},
        gen3hackmons: {
		mod: 'gen3',
		effectType: 'Format',
		name: "[Gen 3] Hackmons",
		challengeShow: true,
		ruleset: ['Pokemon'],
		banlist: []
	},
	gennextnextou: {
		mod: 'gennext',
		effectType: 'Format',
		name: "[Gen NEXT] NEXT-OU",
		challengeShow: true,
		ruleset: ['Pokemon', 'Smogon', 'Team Preview', 'Evasion Clause'],
		banlist: ['Uber']
	},
	customgame: {
		effectType: 'Format',
		name: "Custom Game",
		challengeShow: true,
		canUseRandomTeam: true,
		debug: true,
		// no restrictions, for serious
		ruleset: ['Team Preview']
	},
	customgamenoteampreview: {
		effectType: 'Format',
		name: "Custom Game (no Team Preview)",
		challengeShow: true,
		canUseRandomTeam: true,
		debug: true,
		// no restrictions, for serious
		ruleset: []
	},
	doublescustomgame: {
		effectType: 'Format',
		gameType: 'doubles',
		name: "Doubles Custom Game",
		challengeShow: true,
		canUseRandomTeam: true,
		debug: true,
		// no restrictions, for serious
		ruleset: ['Doubles Team Preview']
	},
/**********************************
Rule Sets
**********************************/
	pokemon: { //Includes standard legality rules
		effectType: 'Banlist',
		ruleset: ['Real Pokemon', 'Real Moves', 'Moveset Limits', 'Legal Form'],
		banlist: ['Illegal', 'Unreleased']
	},
	cappokemon: { //Allows CAP pokemon and moves to be used
		effectType: 'Banlist',
		ruleset: ['Moveset Limits', 'Legal Form'],
		banlist: ['Illegal', 'Unreleased']
	},
	dwpokemon: { //Allows CAP pokemon and moves to be used
		effectType: 'Banlist',
		ruleset: ['Moveset Limits', 'Legal Form'],
		banlist: ['Illegal']
	},
	smogon: { //Clauses used in Smogon metagames
		effectType: 'Banlist',
		ruleset: ['Sleep Clause', 'Species Clause', 'OHKO Clause', 'Moody Clause'],
	},
	nintendo: { //List of clauses used in Nintendo metagames. Also contains the standard Nintendo banlist.
		effectType: 'Banlist',
		ruleset: ['Species Clause', 'Item Clause', 'Flat Battle'],
		banlist: ['Sky Drop', 'Dark Void', 'Soul Dew', 'Mewtwo', 'Mew', 'Lugia', 'Ho-Oh', 'Celebi', 'Kyogre', 'Groudon', 'Rayquaza', 'Jirachi', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Deoxys-Defense','Chatot', 'Dialga', 'Palkia', 'Giratina', 'Phione', 'Manaphy', 'Darkrai', 'Shaymin', 'Shaymin-Sky', 'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water', 'Victini', 'Reshiram', 'Zekrom', 'Kyurem', 'Kyurem-Black', 'Kyurem-White', 'Keldeo', 'Keldeo-Resolute', 'Meloetta', 'Genesect'
		]
	},
/**********************************
Legality Rules
**********************************/
	realpokemon: { //Disallow CAP pokemon
		effectType: 'Banlist',
		validateSet: function(set, format) {
			var template = this.getTemplate(set.species);
			var problems = [];
			if (template.isNonstandard) {
				problems.push(set.species+' is not a real Pokemon.');
			}
			return problems;
		}
	},
	realmoves: { //Disallow CAP moves
		effectType: 'Banlist',
		validateSet: function(set, format) {
			var problems = [];
			if (set.moves) for (var i=0; i<set.moves.length; i++) {
				var move = this.getMove(set.moves[i]);
				if (move.isNonstandard) {
					problems.push(move.name+' is not a real move.');
				}
			}
			return problems;
		}
	},
	movesetlimits: { //Disallow moves to appear twice on the same set. Disallow pokemon with more than 4 moves
		effectType: 'Banlist',
		validateSet: function(set, format) {
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
			var problems = [];
			if (set.moves && set.moves.length > 4) {
				problems.push((set.name||set.species) + ' has more than four moves.');
			}
			return problems;
		}
	},
	legalform: { //Correct the forms of certain pokemon (ex: Keldeo-R without the move Secret Sword)
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
			return problems;
		}
	},
/**********************************
Clauses
**********************************/
	speciesclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Species Clause');
		},
		validateTeam: function(team, format) {
			var speciesTable = {};
			for (var i=0; i<team.length; i++) {
				var template = this.getTemplate(team[i].species);
				if (speciesTable[template.num]) {
					return ["You are limited to one of each pokemon by Species Clause.","(You have at least two "+template.name+")"];
				}
				speciesTable[template.num] = true;
			}
		}
	},
	itemclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Item Clause');
		},
		validateTeam: function(team, format) {
			var itemTable = {};
			for (var i=0; i<team.length; i++) {
				var item = toId(team[i].item);
				if (!item) continue;
				if (itemTable[item]) {
					return ["You are limited to one of each item by Item Clause.","(You have at least two "+this.getItem(item).name+")"];
				}
				itemTable[item] = true;
			}
		}
	},
	ohkoclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'OHKO Clause');
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
	evasionclause: {
		effectType: 'Banlist',
		name: 'Evasion Clause',
		banlist: ['Minimize', 'Double Team'],
		onStart: function() {
			this.add('rule', 'Evasion Clause');
		}
	},
	moodyclause: {
		effectType: 'Banlist',
		name: 'Moody Clause',
		banlist: ['Moody'],
		onStart: function() {
			this.add('rule', 'Moody Clause');
		}
	},
	sleepclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Sleep Clause');
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
			this.add('rule', 'Freeze Clause');
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
	flatbattle: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Flat Battle');
		},
		validateSet: function(set) {
			if (!set.level || set.level >= 50) {
				set.forcedLevel = 50;
			}
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
			if (!set.level || set.level > 5) {
				set.level = 5;
			}
		}
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
/**********************************
Team Previews
**********************************/
	teampreview: { //Choose 1 lead, use all 6 Pokemon in battle.
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
	vgcteampreview: { //Bring 6, choose 4 Pokemon to use in battle.
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
	doublesteampreview: { //Choose 2 leads, use all 6 Pokemon in battle.
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
			this.makeRequest('teampreview', 2);
		}
	},
};
