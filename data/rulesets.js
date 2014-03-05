// Note: These are the rules that formats use
// The list of formats is stored in config/formats.js

exports.BattleFormats = {

	// Rulesets
	///////////////////////////////////////////////////////////////////

	standard: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod'],
		banlist: ['Unreleased', 'Illegal']
	},
	standardnext: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'HP Percentage Mod'],
		banlist: ['Illegal', 'Soul Dew']
	},
	standardubers: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'Moody Clause', 'OHKO Clause', 'Endless Battle Clause', 'HP Percentage Mod'],
		banlist: ['Unreleased', 'Illegal']
	},
	standardgbu: {
		effectType: 'Banlist',
		ruleset: ['Species Clause', 'Item Clause'],
		banlist: ['Unreleased', 'Illegal', 'Soul Dew',
			'Mewtwo', 'Mewtwo-Mega-X', 'Mewtwo-Mega-Y',
			'Mew',
			'Lugia',
			'Ho-Oh',
			'Celebi',
			'Kyogre',
			'Groudon',
			'Rayquaza',
			'Jirachi',
			'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed',
			'Dialga',
			'Palkia',
			'Giratina', 'Giratina-Origin',
			'Phione',
			'Manaphy',
			'Darkrai',
			'Shaymin', 'Shaymin-Sky',
			'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fairy', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water',
			'Victini',
			'Reshiram',
			'Zekrom',
			'Kyurem', 'Kyurem-Black', 'Kyurem-White',
			'Keldeo',
			'Meloetta',
			'Genesect',
			'Xerneas',
			'Yveltal',
			'Zygarde'
		]
	},
	pokemon: {
		effectType: 'Banlist',
		validateSet: function(set, format, isNonstandard) {
			var item = this.getItem(set.item);
			var template = this.getTemplate(set.species);
			var problems = [];

			if (set.species === set.name) delete set.name;
			if (template.gen > this.gen) {
				problems.push(set.species+' does not exist in gen '+this.gen+'.');
			}
			var ability = {};
			if (set.ability) {
				ability = this.getAbility(set.ability);
				if (ability.gen > this.gen) {
					problems.push(ability.name+' does not exist in gen '+this.gen+'.');
				}
			}
			if (set.moves) for (var i=0; i<set.moves.length; i++) {
				var move = this.getMove(set.moves[i]);
				if (move.gen > this.gen) {
					problems.push(move.name+' does not exist in gen '+this.gen+'.');
				} else if (!isNonstandard && move.isNonstandard) {
					problems.push(move.name+' is not a real move.');
				}
			}
			if (item.gen > this.gen) {
				problems.push(item.name+' does not exist in gen '+this.gen+'.');
			}
			if (set.moves && set.moves.length > 4) {
				problems.push((set.name||set.species) + ' has more than four moves.');
			}
			if (set.level && set.level > 100) {
				problems.push((set.name||set.species) + ' is higher than level 100.');
			}

			if (!isNonstandard) {
				if (template.isNonstandard) {
					problems.push(set.species+' is not a real Pokemon.');
				}
				if (ability.isNonstandard) {
					problems.push(ability.name+' is not a real ability.');
				}
				if (item.isNonstandard) {
					problems.push(item.name + ' is not a real item.');
				}
			}

			// ----------- legality line ------------------------------------------
			if (!format.banlistTable || !format.banlistTable['illegal']) return problems;
			// everything after this line only happens if we're doing legality enforcement

			// limit one of each move
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

			if (template.requiredItem) {
				if (template.isMega) {
					// Mega evolutions evolve in-battle
					set.species = template.baseSpecies;
					var baseAbilities = Tools.getTemplate(set.species).abilities;
					var niceAbility = false;
					for (var i in baseAbilities) {
						if (baseAbilities[i] === set.ability) {
							niceAbility = true;
							break;
						}
					}
					if (!niceAbility) set.ability = baseAbilities['0'];
				}
				if (item.name !== template.requiredItem) {
					problems.push((set.name||set.species) + ' needs to hold '+template.requiredItem+'.');
				}
			}
			if (template.num == 351) { // Castform
				set.species = 'Castform';
			}
			if (template.num == 421) { // Cherrim
				set.species = 'Cherrim';
			}
			if (template.num == 493) { // Arceus
				if (set.ability === 'Multitype' && item.onPlate) {
					set.species = 'Arceus-'+item.onPlate;
				} else {
					set.species = 'Arceus';
				}
			}
			if (template.num == 555) { // Darmanitan
				if (set.species === 'Darmanitan-Zen' && ability.id !== 'zenmode') {
					problems.push('Darmanitan-Zen transforms in-battle with Zen Mode.');
				}
				set.species = 'Darmanitan';
			}
			if (template.num == 487) { // Giratina
				if (item.id === 'griseousorb') {
					set.species = 'Giratina-Origin';
					set.ability = 'Levitate';
				} else {
					set.species = 'Giratina';
					set.ability = 'Pressure';
				}
			}
			if (template.num == 647) { // Keldeo
				if (set.moves.indexOf('Secret Sword') < 0) {
					set.species = 'Keldeo';
				}
			}
			if (template.num == 648) { // Meloetta
				if (set.species === 'Meloetta-Pirouette' && set.moves.indexOf('Relic Song') < 0) {
					problems.push('Meloetta-Pirouette transforms in-battle with Relic Song.');
				}
				set.species = 'Meloetta';
			}
			if (template.num === 649) { // Genesect
				switch (item.id) {
					case 'burndrive':
						set.species = 'Genesect-Burn';
						break;
					case 'chilldrive':
						set.species = 'Genesect-Chill';
						break;
					case 'dousedrive':
						set.species = 'Genesect-Douse';
						break;
					case 'shockdrive':
						set.species = 'Genesect-Shock';
						break;
					default:
						set.species = 'Genesect';
				}
			}
			if (template.num == 681) { // Aegislash
				set.species = 'Aegislash';
			}
			return problems;
		}
	},
	cappokemon: {
		effectType: 'Rule',
		validateSet: function(set, format) {
			return this.getEffect('Pokemon').validateSet.call(this, set, format, true);
		}
	},
	kalospokedex: {
		effectType: 'Rule',
		validateSet: function(set) {
			var validKalosDex = {
				"Abomasnow":1,"Abomasnow-Mega":1,"Abra":1,"Absol":1,"Absol-Mega":1,"Accelgor":1,"Aegislash":1,"Aegislash-Blade":1,"Aerodactyl":1,"Aerodactyl-Mega":1,"Aggron":1,"Aggron-Mega":1,"Alakazam":1,"Alakazam-Mega":1,"Alomomola":1,"Altaria":1,"Amaura":1,"Amoonguss":1,"Ampharos":1,"Ampharos-Mega":1,"Arbok":1,"Ariados":1,"Aromatisse":1,"Aron":1,"Articuno":1,"Audino":1,"Aurorus":1,"Avalugg":1,"Axew":1,"Azumarill":1,"Azurill":1,"Bagon":1,"Banette":1,"Banette-Mega":1,"Barbaracle":1,"Barboach":1,"Basculin":1,"Basculin-Blue-Striped":1,"Beartic":1,"Beedrill":1,"Bellossom":1,"Bellsprout":1,"Bergmite":1,"Bibarel":1,"Bidoof":1,"Binacle":1,"Bisharp":1,"Blastoise":1,"Blastoise-Mega":1,"Boldore":1,"Bonsly":1,"Braixen":1,"Budew":1,"Buizel":1,"Bulbasaur":1,"Bunnelby":1,"Burmy":1,"Butterfree":1,"Carbink":1,"Carnivine":1,"Carvanha":1,"Caterpie":1,"Chandelure":1,"Charizard":1,"Charizard-Mega-X":1,"Charizard-Mega-Y":1,"Charmander":1,"Charmeleon":1,"Chatot":1,"Chesnaught":1,"Chespin":1,"Chimecho":1,"Chinchou":1,"Chingling":1,"Clamperl":1,"Clauncher":1,"Clawitzer":1,"Cloyster":1,"Combee":1,"Conkeldurr":1,"Corphish":1,"Corsola":1,"Crawdaunt":1,"Croagunk":1,"Crobat":1,"Crustle":1,"Cryogonal":1,"Cubchoo":1,"Cubone":1,"Dedenne":1,"Deino":1,"Delcatty":1,"Delibird":1,"Delphox":1,"Diggersby":1,"Diglett":1,"Ditto":1,"Dodrio":1,"Doduo":1,"Doublade":1,"Dragalge":1,"Dragonair":1,"Dragonite":1,"Drapion":1,"Dratini":1,"Drifblim":1,"Drifloon":1,"Druddigon":1,"Ducklett":1,"Dugtrio":1,"Dunsparce":1,"Duosion":1,"Durant":1,"Dwebble":1,"Eevee":1,"Ekans":1,"Electrike":1,"Electrode":1,"Emolga":1,"Escavalier":1,"Espeon":1,"Espurr":1,"Exeggcute":1,"Exeggutor":1,"Exploud":1,"Farfetch'd":1,"Fearow":1,"Fennekin":1,"Ferroseed":1,"Ferrothorn":1,"Flaaffy":1,"Flabebe":1,"Flareon":1,"Fletchinder":1,"Fletchling":1,"Floatzel":1,"Floette":1,"Florges":1,"Flygon":1,"Foongus":1,"Fraxure":1,"Froakie":1,"Frogadier":1,"Furfrou":1,"Furret":1,"Gabite":1,"Gallade":1,"Garbodor":1,"Garchomp":1,"Garchomp-Mega":1,"Gardevoir":1,"Gardevoir-Mega":1,"Gastly":1,"Gengar":1,"Gengar-Mega":1,"Geodude":1,"Gible":1,"Gigalith":1,"Glaceon":1,"Gligar":1,"Gliscor":1,"Gloom":1,"Gogoat":1,"Golbat":1,"Goldeen":1,"Golduck":1,"Golem":1,"Golett":1,"Golurk":1,"Goodra":1,"Goomy":1,"Gorebyss":1,"Gothita":1,"Gothitelle":1,"Gothorita":1,"Gourgeist-Small":1,"Gourgeist":1,"Gourgeist-Large":1,"Gourgeist-Super":1,"Granbull":1,"Graveler":1,"Greninja":1,"Grumpig":1,"Gulpin":1,"Gurdurr":1,"Gyarados":1,"Gyarados-Mega":1,"Hariyama":1,"Haunter":1,"Hawlucha":1,"Haxorus":1,"Heatmor":1,"Heliolisk":1,"Helioptile":1,"Heracross":1,"Heracross-Mega":1,"Hippopotas":1,"Hippowdon":1,"Honchkrow":1,"Honedge":1,"Hoothoot":1,"Hoppip":1,"Horsea":1,"Houndoom":1,"Houndoom-Mega":1,"Houndour":1,"Huntail":1,"Hydreigon":1,"Igglybuff":1,"Illumise":1,"Inkay":1,"Ivysaur":1,"Jigglypuff":1,"Jolteon":1,"Jumpluff":1,"Jynx":1,"Kadabra":1,"Kakuna":1,"Kangaskhan":1,"Kangaskhan-Mega":1,"Karrablast":1,"Kecleon":1,"Kingdra":1,"Kirlia":1,"Klefki":1,"Krokorok":1,"Krookodile":1,"Lairon":1,"Lampent":1,"Lanturn":1,"Lapras":1,"Larvitar":1,"Leafeon":1,"Ledian":1,"Ledyba":1,"Lickilicky":1,"Lickitung":1,"Liepard":1,"Linoone":1,"Litleo":1,"Litwick":1,"Lombre":1,"Lotad":1,"Loudred":1,"Lucario":1,"Lucario-Mega":1,"Ludicolo":1,"Lunatone":1,"Luvdisc":1,"Machamp":1,"Machoke":1,"Machop":1,"Magcargo":1,"Magikarp":1,"Magnemite":1,"Magneton":1,"Magnezone":1,"Makuhita":1,"Malamar":1,"Mamoswine":1,"Manectric":1,"Manectric-Mega":1,"Mantine":1,"Mantyke":1,"Mareep":1,"Marill":1,"Marowak":1,"Masquerain":1,"Mawile":1,"Mawile-Mega":1,"Medicham":1,"Medicham-Mega":1,"Meditite":1,"Meowstic":1,"Meowstic-F":1,"Metapod":1,"Mewtwo":1,"Mewtwo-Mega-X":1,"Mewtwo-Mega-Y":1,"Mienfoo":1,"Mienshao":1,"Mightyena":1,"Miltank":1,"Mime Jr.":1,"Minun":1,"Moltres":1,"Mothim":1,"Mr. Mime":1,"Munchlax":1,"Murkrow":1,"Nidoking":1,"Nidoqueen":1,"Nidoran-M":1,"Nidoran-F":1,"Nidorina":1,"Nidorino":1,"Nincada":1,"Ninjask":1,"Noctowl":1,"Noibat":1,"Noivern":1,"Nosepass":1,"Octillery":1,"Oddish":1,"Onix":1,"Pachirisu":1,"Pancham":1,"Pangoro":1,"Panpour":1,"Pansage":1,"Pansear":1,"Patrat":1,"Pawniard":1,"Pelipper":1,"Phantump":1,"Pichu":1,"Pidgeot":1,"Pidgeotto":1,"Pidgey":1,"Pikachu":1,"Piloswine":1,"Pinsir":1,"Pinsir-Mega":1,"Plusle":1,"Politoed":1,"Poliwag":1,"Poliwhirl":1,"Poliwrath":1,"Poochyena":1,"Probopass":1,"Psyduck":1,"Pumpkaboo-Small":1,"Pumpkaboo":1,"Pumpkaboo-Large":1,"Pumpkaboo-Super":1,"Pupitar":1,"Purrloin":1,"Pyroar":1,"Quagsire":1,"Quilladin":1,"Qwilfish":1,"Raichu":1,"Ralts":1,"Relicanth":1,"Remoraid":1,"Reuniclus":1,"Rhydon":1,"Rhyhorn":1,"Rhyperior":1,"Riolu":1,"Roggenrola":1,"Roselia":1,"Roserade":1,"Rotom":1,"Rotom-Heat":1,"Rotom-Wash":1,"Rotom-Frost":1,"Rotom-Fan":1,"Rotom-Mow":1,"Sableye":1,"Salamence":1,"Sandile":1,"Sandshrew":1,"Sandslash":1,"Sawk":1,"Scatterbug":1,"Scizor":1,"Scizor-Mega":1,"Scolipede":1,"Scrafty":1,"Scraggy":1,"Scyther":1,"Seadra":1,"Seaking":1,"Sentret":1,"Seviper":1,"Sharpedo":1,"Shedinja":1,"Shelgon":1,"Shellder":1,"Shelmet":1,"Shuckle":1,"Shuppet":1,"Sigilyph":1,"Simipour":1,"Simisage":1,"Simisear":1,"Skarmory":1,"Skiddo":1,"Skiploom":1,"Skitty":1,"Skorupi":1,"Skrelp":1,"Skuntank":1,"Sliggoo":1,"Slowbro":1,"Slowking":1,"Slowpoke":1,"Slugma":1,"Slurpuff":1,"Smeargle":1,"Smoochum":1,"Sneasel":1,"Snorlax":1,"Snover":1,"Snubbull":1,"Solosis":1,"Solrock":1,"Spearow":1,"Spewpa":1,"Spinarak":1,"Spinda":1,"Spoink":1,"Spritzee":1,"Squirtle":1,"Staraptor":1,"Staravia":1,"Starly":1,"Starmie":1,"Staryu":1,"Steelix":1,"Stunfisk":1,"Stunky":1,"Sudowoodo":1,"Surskit":1,"Swablu":1,"Swalot":1,"Swanna":1,"Swellow":1,"Swinub":1,"Swirlix":1,"Swoobat":1,"Sylveon":1,"Taillow":1,"Talonflame":1,"Tauros":1,"Teddiursa":1,"Tentacool":1,"Tentacruel":1,"Throh":1,"Timburr":1,"Torkoal":1,"Toxicroak":1,"Trapinch":1,"Trevenant":1,"Trubbish":1,"Tyranitar":1,"Tyranitar-Mega":1,"Tyrantrum":1,"Tyrunt":1,"Umbreon":1,"Ursaring":1,"Vanillish":1,"Vanillite":1,"Vanilluxe":1,"Vaporeon":1,"Venipede":1,"Venusaur":1,"Venusaur-Mega":1,"Vespiquen":1,"Vibrava":1,"Victreebel":1,"Vileplume":1,"Vivillon":1,"Volbeat":1,"Voltorb":1,"Wailmer":1,"Wailord":1,"Wartortle":1,"Watchog":1,"Weavile":1,"Weedle":1,"Weepinbell":1,"Whirlipede":1,"Whiscash":1,"Whismur":1,"Wigglytuff":1,"Wingull":1,"Wobbuffet":1,"Woobat":1,"Wooper":1,"Wormadam":1,"Wormadam-Sandy":1,"Wormadam-Trash":1,"Wynaut":1,"Xerneas":1,"Yanma":1,"Yanmega":1,"Yveltal":1,"Zangoose":1,"Zapdos":1,"Zigzagoon":1,"Zoroark":1,"Zorua":1,"Zubat":1,"Zweilous":1,"Zygarde":1
			};
			if (!(set.species in validKalosDex)) {
				return [set.species+" is not in the Kalos Pokedex."];
			}
		}
	},
	abilityexchangepokemon: {
		effectType: 'Banlist',
		validateTeam: function(team, format) {
			var selectedAbilities = [];
			var defaultAbilities = [];
			var bannedAbilities = {adaptability:1, arenatrap:1, contrary:1, hugepower:1, imposter:1, purepower:1, prankster:1, serenegrace:1, shadowtag:1, simple:1, speedboost:1, tintedlens:1, wonderguard:1};
			var problems = [];
			for (var i=0; i<team.length; i++) {
				var template = this.getTemplate(team[i].species);
				var ability = this.getAbility(team[i].ability);
				var abilities = Object.extended(template.abilities).values();
				if (ability.id in bannedAbilities && abilities.indexOf(ability.name) === -1) {
					problems.push(ability.name+' is banned on Pokemon that do not legally have it.');
				}
				selectedAbilities.push(ability.name);
				defaultAbilities.push(abilities);
			}
			if (problems.length) return problems;
			if (!this.checkAbilities(selectedAbilities, defaultAbilities)) {
				return ['That is not a valid Ability Exchange team.'];
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
	teampreviewvgc: {
		onStartPriority: -10,
		onStart: function() {
			this.add('clearpoke');
			for (var i=0; i<this.sides[0].pokemon.length; i++) {
				this.add('poke', this.sides[0].pokemon[i].side.id, this.sides[0].pokemon[i].details.replace(/(Arceus|Gourgeist|Genesect|Pumpkaboo)-[a-zA-Z?]+/g, '$1-*'));
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++) {
				this.add('poke', this.sides[1].pokemon[i].side.id, this.sides[1].pokemon[i].details.replace(/(Arceus|Gourgeist|Genesect|Pumpkaboo)-[a-zA-Z?]+/g, '$1-*'));
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
				this.add('poke', this.sides[0].pokemon[i].side.id, this.sides[0].pokemon[i].details.replace(/(Arceus|Gourgeist|Genesect|Pumpkaboo)-[a-zA-Z?]+/g, '$1-*'));
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++) {
				this.add('poke', this.sides[1].pokemon[i].side.id, this.sides[1].pokemon[i].details.replace(/(Arceus|Gourgeist|Genesect|Pumpkaboo)-[a-zA-Z?]+/g, '$1-*'));
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
				this.add('poke', this.sides[0].pokemon[i].side.id, this.sides[0].pokemon[i].details.replace(/(Arceus|Gourgeist|Genesect|Pumpkaboo)-[a-zA-Z?]+/g, '$1-*'));
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++) {
				this.add('poke', this.sides[1].pokemon[i].side.id, this.sides[1].pokemon[i].details.replace(/(Arceus|Gourgeist|Genesect|Pumpkaboo)-[a-zA-Z?]+/g, '$1-*'));
			}
		},
		onTeamPreview: function() {
			this.makeRequest('teampreview');
		}
	},
	teampreviewgbu: {
		onStartPriority: -10,
		onStart: function() {
			this.add('clearpoke');
			for (var i=0; i<this.sides[0].pokemon.length; i++) {
				this.add('poke', this.sides[0].pokemon[i].side.id, this.sides[0].pokemon[i].details.replace(/(Arceus|Gourgeist|Genesect|Pumpkaboo)-[a-zA-Z?]+/g, '$1-*'));
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++) {
				this.add('poke', this.sides[1].pokemon[i].side.id, this.sides[1].pokemon[i].details.replace(/(Arceus|Gourgeist|Genesect|Pumpkaboo)-[a-zA-Z?]+/g, '$1-*'));
			}
		},
		onTeamPreview: function() {
			this.makeRequest('teampreview', 3);
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
	endlessbattleclause: {
		effectType: 'Banlist',
		name: 'Endless Battle Clause',
		banlist: ['Leppa Berry + Recycle', 'Harvest + Leppa Berry', 'Shadow Tag + Leppa Berry + Trick'],
		onStart: function() {
			this.add('rule', 'Endless Battle Clause: Forcing endless battles is banned.');
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
	hppercentagemod: {
		effectType: 'Rule',
		name: 'HP Percentage Mod',
		onStart: function() {
			this.add('rule', 'HP Percentage Mod: HP is reported as percentages');
			this.reportPercentages = true;
		}
	},
	sleepclausemod: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Sleep Clause Mod: Limit one foe put to sleep');
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
							this.add('-message', 'Sleep Clause Mod activated.');
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
				if (!template.types) continue;

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
	},
	megaonly: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Mega Pokemon only');
		},
		validateTeam: function(team, format) {
			for (var i=0; i<team.length; i++) {
				var formLetter = this.getTemplate(team[i].species).formeLetter;
				if (formLetter !== 'M') return ["All Pokemon on your team must be mega Pokemon."];
			}
		}
	},
	sashclause: {
        effectType: 'Rule',
        onStart: function() {
            this.add('rule', 'Sash Clause: Limit one Focus Sash');
        },
        validateTeam: function(team, format) {
            var hasFocusSash = 0;
            for (var i=0; i<team.length; i++) { // Check each pokemon
                var item = toId(team[i].item); // Get it's item
                if (item === 'focussash') hasFocusSash++; // If it's an item add 1 to the counter
                if (hasFocusSash > 1) { // If the counter is more than 1 return the error
                    return ["You are limited to only one Focus Sash by Sash Clause."];
				}				
			}
		}
	},
	pointsystem: {
		name: 'Point System',
		effectType: 'Banlist',
		validateTeam: function(team, format) {
			var movePoints = {
				absorb: 0,
				acid: 0,
				acidarmor: 0,
				acidspray: 0,
				acrobatics: 0,
				acupressure: 0,
				aerialace: 0,
				aeroblast: 0,
				afteryou: 0,
				agility: 0,
				aircutter: 0,
				airslash: 0,
				allyswitch: 0,
				amnesia: 0,
				ancientpower: 0,
				aquajet: 0,
				aquaring: 0,
				aquatail: 0,
				armthrust: 0,
				aromatherapy: 0,
				assist: 0,
				assurance: 0,
				astonish: 0,
				attackorder: 0,
				attract: 0,
				aurasphere: 0,
				aurorabeam: 0,
				autotomize: 0,
				avalanche: 0,
				barrage: 0,
				barrier: 0,
				batonpass: 0,
				beatup: 0,
				bellydrum: 0,
				bestow: 0,
				bide: 0,
				bind: 0,
				bite: 0,
				blastburn: 0,
				blazekick: 0,
				blizzard: 0,
				block: 0,
				blueflare: 0,
				bodyslam: 0,
				boltstrike: 0,
				boneclub: 0,
				bonerush: 0,
				bonemerang: 0,
				bounce: 0,
				bravebird: 0,
				brickbreak: 0,
				brine: 0,
				bubble: 0,
				bubblebeam: 0,
				bugbite: 0,
				bugbuzz: 0,
				bulkup: 0,
				bulldoze: 0,
				bulletpunch: 0,
				bulletseed: 0,
				calmmind: 0,
				camouflage: 0,
				captivate: 0,
				charge: 0,
				chargebeam: 0,
				charm: 0,
				chatter: 0,
				chipaway: 0,
				circlethrow: 0,
				clamp: 0,
				clearsmog: 0,
				closecombat: 0,
				coil: 0,
				cometpunch: 0,
				confuseray: 0,
				confusion: 0,
				constrict: 0,
				conversion: 0,
				conversion2: 0,
				copycat: 0,
				cosmicpower: 0,
				cottonguard: 0,
				cottonspore: 0,
				counter: 0,
				covet: 0,
				crabhammer: 0,
				crosschop: 0,
				crosspoison: 0,
				crunch: 0,
				crushclaw: 0,
				crushgrip: 0,
				curse: 0,
				cut: 0,
				darkpulse: 0,
				darkvoid: 0,
				defendorder: 0,
				defensecurl: 0,
				defog: 0,
				destinybond: 0,
				detect: 0,
				dig: 0,
				disable: 0,
				discharge: 0,
				dive: 0,
				dizzypunch: 0,
				doomdesire: 0,
				doubleedge: 0,
				doublehit: 0,
				doublekick: 0,
				doubleslap: 0,
				doubleteam: 0,
				dracometeor: 0,
				dragonbreath: 0,
				dragonclaw: 0,
				dragondance: 0,
				dragonpulse: 0,
				dragonrage: 0,
				dragonrush: 0,
				dragontail: 0,
				drainpunch: 0,
				dreameater: 0,
				drillpeck: 0,
				drillrun: 0,
				dualchop: 0,
				dynamicpunch: 0,
				earthpower: 0,
				earthquake: 0,
				echoedvoice: 0,
				eggbomb: 0,
				electroball: 0,
				electroweb: 0,
				embargo: 0,
				ember: 0,
				encore: 0,
				endeavor: 0,
				endure: 0,
				energyball: 0,
				entrainment: 0,
				eruption: 0,
				explosion: 0,
				extrasensory: 0,
				extremespeed: 0,
				facade: 0,
				faintattack: 0,
				fakeout: 0,
				faketears: 0,
				falseswipe: 0,
				featherdance: 0,
				feint: 0,
				fierydance: 0,
				finalgambit: 0,
				fireblast: 0,
				firefang: 0,
				firepledge: 0,
				firepunch: 0,
				firespin: 0,
				fissure: 0,
				flail: 0,
				flameburst: 0,
				flamecharge: 0,
				flamewheel: 0,
				flamethrower: 0,
				flareblitz: 0,
				flash: 0,
				flashcannon: 0,
				flatter: 0,
				fling: 0,
				fly: 0,
				focusblast: 0,
				focusenergy: 0,
				focuspunch: 0,
				followme: 0,
				forcepalm: 0,
				foresight: 0,
				foulplay: 0,
				freezeshock: 0,
				frenzyplant: 0,
				frostbreath: 0,
				frustration: 0,
				furyattack: 0,
				furycutter: 0,
				furyswipes: 0,
				fusionbolt: 0,
				fusionflare: 0,
				futuresight: 0,
				gastroacid: 0,
				geargrind: 0,
				gigadrain: 0,
				gigaimpact: 0,
				glaciate: 0,
				glare: 0,
				grassknot: 0,
				grasspledge: 0,
				grasswhistle: 0,
				gravity: 0,
				growl: 0,
				growth: 0,
				grudge: 0,
				guardsplit: 0,
				guardswap: 0,
				guillotine: 0,
				gunkshot: 0,
				gust: 0,
				gyroball: 0,
				hail: 0,
				hammerarm: 0,
				harden: 0,
				haze: 0,
				headcharge: 0,
				headsmash: 0,
				headbutt: 0,
				healbell: 0,
				healblock: 0,
				healorder: 0,
				healpulse: 0,
				healingwish: 0,
				heartstamp: 0,
				heartswap: 0,
				heatcrash: 0,
				heatwave: 0,
				heavyslam: 0,
				helpinghand: 0,
				hex: 0,
				hijumpkick: 0,
				hiddenpower: 0,
				hiddenpowerbug: 0,
				hiddenpowerdark: 0,
				hiddenpowerdragon: 0,
				hiddenpowerelectric: 0,
				hiddenpowerfighting: 0,
				hiddenpowerfire: 0,
				hiddenpowerflying: 0,
				hiddenpowerghost: 0,
				hiddenpowergrass: 0,
				hiddenpowerground: 0,
				hiddenpowerice: 0,
				hiddenpowerpoison: 0,
				hiddenpowerpsychic: 0,
				hiddenpowerrock: 0,
				hiddenpowersteel: 0,
				hiddenpowerwater: 0,
				honeclaws: 0,
				hornattack: 0,
				horndrill: 0,
				hornleech: 0,
				howl: 0,
				hurricane: 0,
				hydrocannon: 0,
				hydropump: 0,
				hyperbeam: 0,
				hyperfang: 0,
				hypervoice: 0,
				hypnosis: 0,
				iceball: 0,
				icebeam: 0,
				iceburn: 0,
				icefang: 0,
				icepunch: 0,
				iceshard: 0,
				iciclecrash: 0,
				iciclespear: 0,
				icywind: 0,
				imprison: 0,
				incinerate: 0,
				inferno: 0,
				ingrain: 0,
				irondefense: 0,
				ironhead: 0,
				irontail: 0,
				judgment: 0,
				jumpkick: 0,
				karatechop: 0,
				kinesis: 0,
				knockoff: 0,
				lastresort: 0,
				lavaplume: 0,
				leafblade: 0,
				leafstorm: 0,
				leaftornado: 0,
				leechlife: 0,
				leechseed: 0,
				leer: 0,
				lick: 0,
				lightscreen: 0,
				lockon: 0,
				lovelykiss: 0,
				lowkick: 0,
				lowsweep: 0,
				luckychant: 0,
				lunardance: 0,
				lusterpurge: 0,
				machpunch: 0,
				magiccoat: 0,
				magicroom: 0,
				magicalleaf: 0,
				magmastorm: 0,
				magnetbomb: 0,
				magnetrise: 0,
				magnitude: 0,
				mefirst: 0,
				meanlook: 0,
				meditate: 0,
				megadrain: 0,
				megakick: 0,
				megapunch: 0,
				megahorn: 0,
				memento: 0,
				metalburst: 0,
				metalclaw: 0,
				metalsound: 0,
				meteormash: 0,
				metronome: 0,
				milkdrink: 0,
				mimic: 0,
				mindreader: 0,
				minimize: 0,
				miracleeye: 0,
				mirrorcoat: 0,
				mirrormove: 0,
				mirrorshot: 0,
				mist: 0,
				mistball: 0,
				moonlight: 0,
				morningsun: 0,
				mudslap: 0,
				mudbomb: 0,
				mudshot: 0,
				mudsport: 0,
				muddywater: 0,
				nastyplot: 0,
				naturalgift: 0,
				naturepower: 0,
				needlearm: 0,
				nightdaze: 0,
				nightshade: 0,
				nightslash: 0,
				nightmare: 0,
				octazooka: 0,
				odorsleuth: 0,
				ominouswind: 0,
				outrage: 0,
				overheat: 0,
				painsplit: 0,
				payday: 0,
				payback: 0,
				peck: 0,
				perishsong: 0,
				petaldance: 0,
				pinmissile: 0,
				pluck: 0,
				poisonfang: 0,
				poisongas: 0,
				poisonjab: 0,
				poisonpowder: 0,
				poisonsting: 0,
				poisontail: 0,
				pound: 0,
				powdersnow: 0,
				powergem: 0,
				powersplit: 0,
				powerswap: 0,
				powertrick: 0,
				powerwhip: 0,
				present: 0,
				protect: 0,
				psybeam: 0,
				psychup: 0,
				psychic: 0,
				psychoboost: 0,
				psychocut: 0,
				psychoshift: 0,
				psyshock: 0,
				psystrike: 0,
				psywave: 0,
				punishment: 0,
				pursuit: 0,
				quash: 0,
				quickattack: 0,
				quickguard: 0,
				quiverdance: 0,
				rage: 0,
				ragepowder: 0,
				raindance: 0,
				rapidspin: 0,
				razorleaf: 0,
				razorshell: 0,
				razorwind: 0,
				recover: 0,
				recycle: 0,
				reflect: 0,
				reflecttype: 0,
				refresh: 0,
				relicsong: 0,
				rest: 0,
				retaliate: 0,
				"return": 0,
				revenge: 0,
				reversal: 0,
				roar: 0,
				roaroftime: 0,
				rockblast: 0,
				rockclimb: 0,
				rockpolish: 0,
				rockslide: 0,
				rocksmash: 0,
				rockthrow: 0,
				rocktomb: 0,
				rockwrecker: 0,
				roleplay: 0,
				rollingkick: 0,
				rollout: 0,
				roost: 0,
				round: 0,
				sacredfire: 0,
				sacredsword: 0,
				safeguard: 0,
				sandattack: 0,
				sandtomb: 0,
				sandstorm: 0,
				scald: 0,
				scaryface: 0,
				scratch: 0,
				screech: 0,
				searingshot: 0,
				secretpower: 0,
				secretsword: 0,
				seedbomb: 0,
				seedflare: 0,
				seismictoss: 0,
				selfdestruct: 0,
				shadowball: 0,
				shadowclaw: 0,
				shadowforce: 0,
				shadowpunch: 0,
				shadowsneak: 0,
				sharpen: 0,
				sheercold: 0,
				shellsmash: 0,
				shiftgear: 0,
				shockwave: 0,
				signalbeam: 0,
				silverwind: 0,
				simplebeam: 0,
				sing: 0,
				sketch: 0,
				skillswap: 0,
				skullbash: 0,
				skyattack: 0,
				skydrop: 0,
				skyuppercut: 0,
				slackoff: 0,
				slam: 0,
				slash: 0,
				sleeppowder: 0,
				sleeptalk: 0,
				sludge: 0,
				sludgebomb: 0,
				sludgewave: 0,
				smackdown: 0,
				smellingsalt: 0,
				smog: 0,
				smokescreen: 0,
				snarl: 0,
				snatch: 0,
				snore: 0,
				soak: 0,
				softboiled: 0,
				solarbeam: 0,
				sonicboom: 0,
				spacialrend: 0,
				spark: 0,
				spiderweb: 0,
				spikecannon: 0,
				spikes: 0,
				spitup: 0,
				spite: 0,
				splash: 0,
				spore: 0,
				stealthrock: 0,
				steelwing: 0,
				stockpile: 0,
				stomp: 0,
				stoneedge: 0,
				storedpower: 0,
				stormthrow: 0,
				steamroller: 0,
				strength: 0,
				stringshot: 0,
				struggle: 0,
				strugglebug: 0,
				stunspore: 0,
				submission: 0,
				substitute: 0,
				suckerpunch: 0,
				sunnyday: 0,
				superfang: 0,
				superpower: 0,
				supersonic: 0,
				surf: 0,
				swagger: 0,
				swallow: 0,
				sweetkiss: 0,
				sweetscent: 0,
				swift: 0,
				switcheroo: 0,
				swordsdance: 0,
				synchronoise: 0,
				synthesis: 0,
				tackle: 0,
				tailglow: 0,
				tailslap: 0,
				tailwhip: 0,
				tailwind: 0,
				takedown: 0,
				taunt: 0,
				technoblast: 0,
				teeterdance: 0,
				telekinesis: 0,
				teleport: 0,
				thief: 0,
				thrash: 0,
				thunder: 0,
				thunderfang: 0,
				thunderpunch: 0,
				thundershock: 0,
				thunderwave: 0,
				thunderbolt: 0,
				tickle: 0,
				torment: 0,
				toxic: 0,
				toxicspikes: 0,
				transform: 0,
				triattack: 0,
				trick: 0,
				trickroom: 0,
				triplekick: 0,
				trumpcard: 0,
				twineedle: 0,
				twister: 0,
				uturn: 0,
				uproar: 0,
				vcreate: 0,
				vacuumwave: 0,
				venoshock: 0,
				vicegrip: 0,
				vinewhip: 0,
				vitalthrow: 0,
				voltswitch: 0,
				volttackle: 0,
				wakeupslap: 0,
				watergun: 0,
				waterpledge: 0,
				waterpulse: 0,
				watersport: 0,
				waterspout: 0,
				waterfall: 0,
				weatherball: 0,
				whirlpool: 0,
				whirlwind: 0,
				wideguard: 0,
				wildcharge: 0,
				willowisp: 0,
				wingattack: 0,
				wish: 0,
				withdraw: 0,
				wonderroom: 0,
				woodhammer: 0,
				workup: 0,
				worryseed: 0,
				wrap: 0,
				wringout: 0,
				xscissor: 0,
				yawn: 0,
				zapcannon: 0,
				zenheadbutt: 0,
				paleowave: 0,
				shadowstrike: 0,
				magikarpsrevenge: 0
			};
			var itemPoints = {
				adamantorb: 0,
				aguavberry: 50,
				airballoon: 50,
				apicotberry: 50,
				armorfossil: 0,
				aspearberry: 50,
				babiriberry: 50,
				belueberry: 0,
				berryjuice: 50,
				bigroot: 50,
				bindingband: 50,
				blackbelt: 50,
				blacksludge: 50,
				blackglasses: 50,
				blukberry: 0,
				brightpowder: 50,
				buggem: 50,
				burndrive: 0,
				cellbattery: 50,
				charcoal: 50,
				chartiberry: 50,
				cheriberry: 50,
				cherishball: 0,
				chestoberry: 50,
				chilanberry: 50,
				chilldrive: 0,
				choiceband: 100,
				choicescarf: 100,
				choicespecs: 100,
				chopleberry: 50,
				clawfossil: 0,
				cobaberry: 50,
				colburberry: 50,
				cornnberry: 0,
				coverfossil: 0,
				custapberry: 50,
				damprock: 50,
				darkgem: 50,
				deepseascale: 50,
				deepseatooth: 50,
				destinyknot: 50,
				diveball: 0,
				domefossil: 0,
				dousedrive: 0,
				dracoplate: 50,
				dragonfang: 50,
				dragongem: 50,
				dreadplate: 50,
				dreamball: 0,
				durinberry: 0,
				duskball: 0,
				earthplate: 50,
				ejectbutton: 50,
				electirizer: 0,
				electricgem: 50,
				energypowder: 0,
				enigmaberry: 50,
				eviolite: 100,
				expertbelt: 50,
				fastball: 0,
				fightinggem: 50,
				figyberry: 50,
				firegem: 50,
				fistplate: 50,
				flameorb: 50,
				flameplate: 50,
				floatstone: 50,
				flyinggem: 50,
				focusband: 50,
				focussash: 50,
				fullincense: 50,
				ganlonberry: 50,
				ghostgem: 50,
				grassgem: 50,
				greatball: 0,
				grepaberry: 0,
				gripclaw: 50,
				griseousorb: 0,
				groundgem: 50,
				habanberry: 50,
				hardstone: 50,
				healball: 0,
				heatrock: 50,
				heavyball: 0,
				helixfossil: 0,
				hondewberry: 0,
				iapapaberry: 50,
				icegem: 50,
				icicleplate: 50,
				icyrock: 50,
				insectplate: 50,
				ironball: 50,
				ironplate: 50,
				jabocaberry: 50,
				kasibberry: 50,
				kebiaberry: 50,
				kelpsyberry: 0,
				kingsrock: 50,
				laggingtail: 50,
				lansatberry: 50,
				laxincense: 50,
				leftovers: 100,
				leppaberry: 50,
				levelball: 0,
				liechiberry: 50,
				lifeorb: 50,
				lightball: 50,
				lightclay: 50,
				loveball: 0,
				luckypunch: 50,
				lumberry: 100,
				lureball: 0,
				lustrousorb: 0,
				luxuryball: 0,
				machobrace: 50,
				magnet: 50,
				magoberry: 50,
				magostberry: 0,
				mail: 0,
				masterball: 0,
				meadowplate: 50,
				mentalherb: 50,
				metalcoat: 50,
				metalpowder: 50,
				metronome: 50,
				micleberry: 50,
				mindplate: 50,
				miracleseed: 50,
				moonball: 0,
				muscleband: 50,
				mysticwater: 50,
				nanabberry: 0,
				nestball: 0,
				netball: 0,
				nevermeltice: 50,
				nomelberry: 0,
				normalgem: 50,
				occaberry: 50,
				oddincense: 50,
				oldamber: 0,
				oranberry: 50,
				pamtreberry: 0,
				parkball: 0,
				passhoberry: 50,
				payapaberry: 50,
				pechaberry: 50,
				persimberry: 50,
				petayaberry: 50,
				pinapberry: 0,
				plumefossil: 0,
				poisonbarb: 50,
				poisongem: 50,
				pokeball: 0,
				pomegberry: 0,
				powerherb: 50,
				premierball: 0,
				psychicgem: 50,
				qualotberry: 0,
				quickball: 0,
				quickclaw: 50,
				quickpowder: 50,
				rabutaberry: 0,
				rarebone: 0,
				rawstberry: 50,
				razorclaw: 50,
				razorfang: 50,
				razzberry: 0,
				redcard: 50,
				repeatball: 0,
				rindoberry: 50,
				ringtarget: 50,
				rockgem: 50,
				rockincense: 50,
				rockyhelmet: 50,
				rootfossil: 0,
				roseincense: 50,
				rowapberry: 50,
				safariball: 0,
				salacberry: 50,
				scopelens: 50,
				seaincense: 50,
				sharpbeak: 50,
				shedshell: 50,
				shellbell: 50,
				shockdrive: 0,
				shucaberry: 50,
				silkscarf: 50,
				silverpowder: 50,
				sitrusberry: 50,
				skullfossil: 0,
				skyplate: 50,
				smoothrock: 50,
				softsand: 50,
				souldew: 0, //BANNED
				spelltag: 50,
				spelonberry: 0,
				splashplate: 50,
				spookyplate: 50,
				sportball: 0,
				starfberry: 50,
				steelgem: 50,
				stick: 50,
				stickybarb: 50,
				stoneplate: 50,
				tamatoberry: 0,
				tangaberry: 50,
				thickclub: 50,
				timerball: 0,
				toxicorb: 50,
				toxicplate: 0,
				twistedspoon: 50,
				ultraball: 0,
				wacanberry: 50,
				watergem: 50,
				watmelberry: 0,
				waveincense: 50,
				wepearberry: 0,
				whiteherb: 50,
				widelens: 50,
				wikiberry: 50,
				wiseglasses: 50,
				yacheberry: 50,
				zapplate: 50,
				zoomlens: 50
			};
			var abilityPoints = {
				adaptability: 0,
				aftermath: 0,
				airlock: 200,
				analytic: 0,
				angerpoint: 0,
				anticipation: 0,
				arenatrap: 0,
				baddreams: 0,
				battlearmor: 0,
				bigpecks: 0,
				blaze: 0,
				chlorophyll: 0,
				clearbody: 0,
				cloudnine: 0,
				colorchange: 0,
				compoundeyes: 0,
				contrary: 0,
				cursedbody: 0,
				cutecharm: 0,
				damp: 0,
				defeatist: 0,
				defiant: 0,
				download: 0,
				drizzle: 200,
				drought: 200,
				dryskin: 0,
				earlybird: 0,
				effectspore: 0,
				filter: 0,
				flamebody: 0,
				flareboost: 0,
				flashfire: 0,
				flowergift: 0,
				forecast: 0,
				forewarn: 0,
				friendguard: 0,
				frisk: 0,
				gluttony: 0,
				guts: 0,
				harvest: 0,
				healer: 0,
				heatproof: 0,
				heavymetal: 0,
				honeygather: 0,
				hugepower: 0,
				hustle: 0,
				hydration: 0,
				hypercutter: 0,
				icebody: 0,
				illuminate: 0,
				illusion: 0,
				immunity: 0,
				imposter: 0,
				infiltrator: 0,
				innerfocus: 0,
				insomnia: 0,
				intimidate: 0,
				ironbarbs: 0,
				ironfist: 0,
				justified: 0,
				keeneye: 0,
				klutz: 0,
				leafguard: 0,
				levitate: 0,
				lightmetal: 0,
				lightningrod: 0,
				limber: 0,
				liquidooze: 0,
				magicbounce: 0,
				magicguard: 0,
				magmaarmor: 0,
				magnetpull: 0,
				marvelscale: 0,
				minus: 0,
				moldbreaker: 0,
				moody: 0,
				motordrive: 0,
				moxie: 0,
				multiscale: 0,
				multitype: 0,
				mummy: 0,
				naturalcure: 0,
				noguard: 0,
				normalize: 0,
				oblivious: 0,
				overcoat: 0,
				overgrow: 0,
				owntempo: 0,
				pickup: 0,
				pickpocket: 0,
				plus: 0,
				poisonheal: 0,
				poisonpoint: 0,
				poisontouch: 0,
				prankster: 0,
				pressure: 0,
				purepower: 0,
				quickfeet: 0,
				raindish: 0,
				rattled: 0,
				reckless: 0,
				regenerator: 0,
				rivalry: 0,
				rockhead: 0,
				roughskin: 0,
				runaway: 0,
				sandforce: 0,
				sandrush: 0,
				sandstream: 200,
				sandveil: 0,
				sapsipper: 0,
				scrappy: 0,
				serenegrace: 0,
				shadowtag: 0, //BANNED
				shedskin: 0,
				sheerforce: 0,
				shellarmor: 0,
				shielddust: 0,
				simple: 0,
				skilllink: 0,
				slowstart: 0,
				sniper: 0,
				snowcloak: 0,
				snowwarning: 200,
				solarpower: 0,
				solidrock: 0,
				soundproof: 0,
				speedboost: 0,
				stall: 0,
				"static": 0,
				steadfast: 0,
				stench: 0,
				stickyhold: 0,
				stormdrain: 0,
				sturdy: 0,
				suctioncups: 0,
				superluck: 0,
				swarm: 0,
				swiftswim: 0,
				synchronize: 0,
				tangledfeet: 0,
				technician: 0,
				telepathy: 0,
				teravolt: 0,
				thickfat: 0,
				tintedlens: 0,
				torrent: 0,
				toxicboost: 0,
				trace: 0,
				truant: 0,
				turboblaze: 0,
				unaware: 0,
				unburden: 0,
				unnerve: 0,
				victorystar: 0,
				vitalspirit: 0,
				voltabsorb: 0,
				waterabsorb: 0,
				waterveil: 0,
				weakarmor: 0,
				whitesmoke: 0,
				wonderguard: 0,
				wonderskin: 0,
				zenmode: 0,
				mountaineer: 0,
				rebound: 0,
				persistent: 0
			};
			var formatPoints = {
				Uber: 800,
				OU: 400,
				BL: 350,
				UU: 300,
				BL2: 250,
				RU: 200,
				NU: 150,
				NFE: 150,
				LC: 150
			};
			var maxPoints = 2000;			
			var problems = [];

			var points = 0;

			for (var i=0; i<team.length; i++) {
				var set = team[i];
				var template = this.getTemplate(set.species);
				var item = this.getItem(set.item);

				if(formatPoints[template.tier])
					points += formatPoints[template.tier];

				if (set.ability) {
					var ability = this.getAbility(set.ability);

					if(abilityPoints[ability.id])
						points += abilityPoints[ability.id];
				}

				if (set.moves) {
					for (var x=0; x<set.moves.length; x++) {
						var move = this.getMove(set.moves[x]);

						if(movePoints[move.id])
							points += movePoints[move.id];
					}
				}

				if (item) {
					if(itemPoints[item.id])
						points += itemPoints[item.id];
				}
			}

			var nonDam = 0;

			for (var i=0; i<team.length; i++){
				var set = team[i];
				var template = this.getTemplate(set.species);

				if (template.tier === 'Uber'){
					for (var b=0; b<set.moves.length; b++){
						var base = this.getMove(set.moves[b]).basePower;
						if (base === 0){
							if (nonDam > 1){
								problems.push("You cannot have more than one non-daming move on an Uber.");
								break;
							}
							nonDam++;
						}
					}
				}
			}

			if(points > maxPoints)
				problems.push("You've used "+points+"/"+maxPoints+" Points.");

			return problems;
		}
	},
};
