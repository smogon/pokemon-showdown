/**
 * Seasonal Ladders of Pokémon Showdown
 * The formats with the mod-like tweaks go into /data/formats.js
 * The team making scripts go into /data/scripts.js
 *
 * THIS IS A BACKUP FILE.
 */

'use strict';

exports.BattleScripts = {
	randomSeasonalSFTTeam: function (side) {
		// Let's get started!
		let lead = 'gallade';
		let team = [];
		let set = {};
		let teamDetails = {megaStone: 0};

		// If the other team has been chosen, we get its opposing force.
		if (this.scenario) {
			lead = {'lotr':'reshiram', 'redblue':'pidgeot', 'terminator':'alakazam', 'gen1':'gengar', 'desert':'probopass', 'shipwreck':'machamp'}[this.scenario];
		} else {
			// First team being generated, let's get one of the possibilities.
			// We need a fix lead for obvious reasons.
			lead = this.sample(['gallade', 'pikachu', 'genesect', 'gengar', 'groudon', 'kyogre']);
			this.scenario = {'scenario': {'gallade':'lotr', 'pikachu':'redblue', 'genesect':'terminator', 'gengar':'gen1', 'groudon':'desert', 'kyogre':'shipwreck'}[lead]};
		}

		// Gen 1 mons and blue/red teams have their own set maker.
		if (lead === 'pikachu') {
			// Add Red's team
			team = [
				{
					name: 'Pika',
					species: 'pikachu',
					moves: ['volttackle', 'brickbreak', 'irontail', 'fakeout'],
					evs: {hp: 0, atk: 252, def: 0, spa: 0, spd: 0, spe: 252},
					ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
					item: 'lightball',
					level: 90,
					shiny: false,
					nature: 'Jolly',
					ability: 'Lightning Rod',
				},
				{
					name: 'Lapras',
					moves: ['hydropump', 'icebeam', 'thunderbolt', 'iceshard'],
					evs: {hp: 252, atk: 4, def: 0, spa: 252, spd: 0, spe: 0},
					ivs: {hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31},
					item: 'leftovers',
					level: 80,
					shiny: false,
					nature: 'Quiet',
					ability: 'Water Absorb',
				},
				{
					name: 'Snorlax',
					moves: ['bodyslam', 'crunch', 'earthquake', 'seedbomb'],
					evs: {hp: 252, atk: 252, def: 4, spa: 0, spd: 0, spe: 0},
					ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
					item: 'leftovers',
					level: 82,
					shiny: false,
					nature: 'Adamant',
					ability: 'Thick Fat',
				},
				{
					name: 'Venusaur',
					moves: ['leafstorm', 'earthquake', 'sludgebomb', 'sleeppowder'],
					evs: {hp: 252, atk: 4, def: 0, spa: 252, spd: 0, spe: 0},
					ivs: {hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31},
					item: 'whiteherb',
					level: 84,
					shiny: false,
					nature: 'Quiet',
					ability: 'Overgrow',
				},
				{
					name: 'Charizard',
					moves: ['fireblast', 'focusblast', 'airslash', 'dragonpulse'],
					evs: {hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252},
					ivs: {hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31},
					item: 'charizarditey',
					level: 73,
					shiny: false,
					nature: 'Timid',
					ability: 'Solar Power',
				},
				{
					name: 'Blastoise',
					moves: ['waterspout', 'hydropump', 'flashcannon', 'focusblast'],
					evs: {hp: 252, atk: 0, def: 4, spa: 252, spd: 0, spe: 0},
					ivs: {hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31},
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
					evs: {hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252},
					ivs: {hp: 31, atk: 31, def: 31, spa: 30, spd: 30, spe: 31},
					item: 'pidgeotite',
					level: 76,
					shiny: false,
					nature: 'Timid',
					ability: 'Keen Eye',
				},
				{
					name: 'Exeggutor',
					moves: ['gigadrain', 'sunnyday', 'leechseed', 'substitute'],
					evs: {hp: 252, atk: 0, def: 4, spa: 252, spd: 0, spe: 0},
					ivs: {hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31},
					item: 'sitrusberry',
					level: 85,
					shiny: false,
					nature: 'Modest',
					ability: 'Harvest',
				},
				{
					name: 'Gyarados',
					moves: ['waterfall', 'earthquake', 'icefang', 'dragondance'],
					evs: {hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252},
					ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
					item: 'leftovers',
					level: 80,
					shiny: false,
					nature: 'Adamant',
					ability: 'Intimidate',
				},
				{
					name: 'Alakazam',
					moves: ['psychic', 'focusblast', 'shadowball', 'reflect'],
					evs: {hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252},
					ivs: {hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31},
					item: 'lifeorb',
					level: 75,
					shiny: false,
					nature: 'Modest',
					ability: 'Magic Guard',
				},
				{
					name: 'Arcanine',
					moves: ['flareblitz', 'closecombat', 'wildcharge', 'extremespeed'],
					evs: {hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252},
					ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
					item: 'expertbelt',
					level: 80,
					shiny: false,
					nature: 'Jolly',
					ability: 'Flash Fire',
				},
				{
					name: 'Machamp',
					moves: ['superpower', 'stoneedge', 'firepunch', 'bulletpunch'],
					evs: {hp: 252, atk: 252, def: 4, spa: 0, spd: 0, spe: 0},
					ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
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
					moves: ['hypnosis', 'explosion', 'thunderbolt', this.sample(['megadrain', 'psychic'])],
				},
				tauros: {
					name: 'TAUROS',
					moves: ['bodyslam', 'hyperbeam', 'blizzard', 'earthquake'],
				},
				alakazam: {
					name: 'ALAKAZAM',
					moves: ['psychic', 'recover', 'thunderwave', this.sample(['reflect', 'seismictoss'])],
				},
				chansey: {
					name: 'CHANSEY',
					moves: ['softboiled', 'thunderwave', 'icebeam', this.sample(['thunderbolt', 'counter'])],
				},
				exeggutor: {
					name: 'EXEGGUTOR',
					moves: ['sleeppowder', 'psychic', 'explosion', this.sample(['doubleedge', 'megadrain', 'stunspore'])],
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
					moves: ['confuseray', this.sample(['thunderbolt', 'rest']), this.sample(['blizzard', 'icebeam']), 'bodyslam'],
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
					moves: ['slash', 'bubblebeam', 'hyperbeam', this.sample(['bodyslam', 'screech', 'thunderbolt'])],
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
						['amnesia', this.sample(['blizzard', 'icebeam']), this.sample(['bodyslam', 'thunderbolt']), this.sample(['rest', 'selfdestruct'])],
						['bodyslam', 'hyperbeam', this.sample(['earthquake', 'surf']), 'selfdestruct'],
					][this.random(2)],
				},
				dragonite: {
					name: 'DRAGONITE',
					moves: ['agility', 'hyperbeam', 'wrap', this.sample(['blizzard', 'surf'])],
				},
			};
			let leadOptions = ['alakazam', 'jynx', 'gengar', 'exeggutor'];
			lead = this.sampleNoReplace(leadOptions);

			let partySetsIndex = ['tauros', 'chansey', 'rhydon', 'golem', 'lapras', 'zapdos', 'slowbro', 'persian', 'cloyster', 'starmie', 'snorlax', 'dragonite'];
			partySetsIndex = leadOptions.concat(partySetsIndex);

			for (let i = 0; i < 6; i++) {
				set = sets[i ? this.sampleNoReplace(partySetsIndex) : lead];
				set.ability = 'None';
				set.evs = {hp: 255, atk: 255, def: 126, spa: 255, spd: 126, spe: 255};
				set.ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};
				set.item = '';
				set.level = 100;
				set.shiny = false;
				set.species = toId(set.name);
				team.push(set);
			}
		} else if (lead === 'gallade') {
			// This is the Aragorn team from the LOTR battle. Special set for Aragorn.
			set = this.randomSet(this.getTemplate(lead), team.length, {});
			set.species = toId(set.name);
			set.name = 'Aragorn';
			set.item = 'Galladite';
			set.moves = ['psychocut', 'bulkup', this.sample(['drainpunch', 'closecombat']), this.sample(['nightslash', 'leafblade', 'xscissor', 'stoneedge', 'doubleedge', 'knockoff'])];
			set.level = 72;
			team.push(set);

			// We get one elf or bard.
			let elf = this.sample(['jynx', 'azelf', 'celebi', 'victini', 'landorustherian']);
			set = this.randomSet(this.getTemplate(elf), team.length, {});
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
				set = this.randomSet(template, team.length, {});
				set.species = toId(set.name);
				set.name = fellowship[p];
				// Add a way to go around dark-types.
				let hasOrcKilling = false;
				for (let n = 0; n < 4; n++) {
					let move = this.getMove(set.moves[n]);
					if (move.type in {'Bug': 1, 'Fighting': 1}) {
						hasOrcKilling = true;
						break;
					}
				}
				if (!hasOrcKilling) set.moves[3] = (template.baseStats.atk > template.baseStats.spa) ? 'closecombat' : 'aurasphere';
				if (p !== 'hoopa') {
					set.item = 'Eviolite';
					set.level = 90;
					set.evs = {hp: 4, atk: 126, def: 126, spa: 126, spd: 126, spe: 0};
					if (p === 'baltoy') set.moves[0] = 'Growl';
				}
				team.push(set);
			}

			// And now an extra good guy.
			let goodguy = [
				'primeape', 'aegislash', 'mimejr', 'timburr', 'lucario',
				this.sample(['sudowoodo', 'trevenant', 'abomasnow', 'shiftry', 'cacturne', 'nuzleaf']),
				['pidgeot', 'staraptor', 'braviary', 'aerodactyl', 'noivern', 'lugia', 'hooh', 'moltres', 'articuno', 'zapdos'][this.random(10)],
			][this.random(7)];
			set = this.randomSet(this.getTemplate(goodguy), team.length, {});
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
				set = this.randomSet(this.getTemplate(p), team.length, {});
				set.species = toId(set.name);
				set.name = mordor[p];
				if (p === 'yveltal') {
					set.item = 'Choice Scarf';
					set.moves = ['oblivionwing', 'darkpulse', 'hurricane', 'uturn'];
					set.nature = 'Timid';
					set.evs = {hp: 0, atk: 4, def: 0, spa: 252, spd: 0, spe: 252};
					set.level = 70;
				}
				if (p === 'hoopaunbound') set.level = 70;
				team.push(set);
			}

			// This army has an orc, a troll, and a bad-guy human. Or Gollum instead any of those three.
			let addGollum = false;
			// 66% chance of getting an orc.
			if (this.randomChance(2, 3)) {
				let orc = this.sample(['quilladin', 'chesnaught', 'granbull', 'drapion', 'pangoro', 'feraligatr', 'haxorus', 'garchomp']);
				set = this.randomSet(this.getTemplate(orc), team.length, {});
				set.species = toId(set.name);
				set.name = 'Orc';
				team.push(set);
			} else {
				addGollum = true;
			}
			// If we got an orc, 66% chance of getting a troll. Otherwise, 100%.
			if (addGollum || this.randomChance(2, 3)) {
				let troll = this.sample(['conkeldurr', 'drowzee', 'hypno', 'seismitoad', 'weavile', 'machamp']);
				set = this.randomSet(this.getTemplate(troll), team.length, {});
				set.species = toId(set.name);
				set.name = 'Troll';
				team.push(set);
			} else {
				addGollum = true;
			}
			// If we got an orc and a troll, 66% chance of getting a Mordor man. Otherwise, 100%.
			if (addGollum || this.randomChance(2, 3)) {
				let badhuman = ['bisharp', 'alakazam', 'medicham', 'mrmime', 'gardevoir', 'hitmonlee', 'hitmonchan', 'hitmontop', 'meloetta', 'sawk', 'throh', 'scrafty'][this.random(12)];
				set = this.randomSet(this.getTemplate(badhuman), team.length, {});
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
				set = this.randomSet(this.getTemplate('sableye'), team.length, {});
				set.species = toId(set.name);
				set.name = 'Gollum';
				set.moves = ['fakeout', 'bind', 'soak', 'infestation'];
				set.item = 'Leftovers';
				set.level = 99;
				team.push(set);
			}
		} else if (lead === 'genesect') {
			// Terminator team.
			set = this.randomSet(this.getTemplate(lead), team.length, {});
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
				set = this.randomSet(template, i, {});
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
				set = this.randomSet(template, i, {});
				set.species = toId(set.name);
				set.name = names[i];
				let hasBotKilling = false;
				// Give humans a way around robots
				for (let n = 0; n < 4; n++) {
					let move = this.getMove(set.moves[n]);
					if (move.type in {'Fire': 1, 'Fighting': 1}) {
						hasBotKilling = true;
						break;
					}
				}
				if (!hasBotKilling) {
					set.moves[3] = (template.baseStats.atk > template.baseStats.spa) ? this.sample(['flareblitz', 'closecombat']) : this.sample(['flamethrower', 'aurasphere']);
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
				if (pokemon in {'hitmontop': 1, 'scrafty': 1}) {
					set.ability = 'Intimidate';
					set.item = 'Leftovers';
					set.moves = ['fakeout', 'drainpunch', 'knockoff', 'flareblitz'];
					set.evs = {hp: 252, atk: 252, def: 4, spa: 0, spd: 0, spe: 0};
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
				team[0].ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 0};
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
			set = this.randomSet(template, 0, {});
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
				let set = this.randomSet(template, i, teamDetails);
				if (this.getItem(set.item).megaStone) teamDetails.megaStone++;
				set.species = toId(set.name);
				set.name = 'Egyptian ' + template.species;
				team.push(set);
			}
		} else if (lead === 'probopass') {
			// Jews from the exodus battle.
			let jews = [
				'nosepass', this.sample(['arceus', 'arceusfire']), 'flaaffy', 'tauros', 'miltank', 'gogoat', 'excadrill',
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
				let set = this.randomSet(template, i, teamDetails);
				if (this.getItem(set.item).megaStone) teamDetails.megaStone++;

				// Sailor team is made of pretty bad mons, boost them a little.
				if (lead === 'machamp') {
					let isAtk = (template.baseStats.atk > template.baseStats.spa);
					if (pokemon === 'machamp') {
						set.item = 'Life Orb';
						set.ability = 'Technician';
						set.moves = ['aquajet', 'bulletpunch', 'machpunch', 'hiddenpowerelectric'];
						set.level = 75;
						set.ivs = {hp: 31, atk: 31, def: 31, spa: 30, spd: 31, spe: 31};
						set.nature = 'Brave';
						set.evs = {hp: 0, atk: 252, def: 0, spa: 252, spd: 0, spe: 4};
					} else {
						let shellSmashPos = -1;
						// Too much OP if all of them have an electric attack.
						if (this.randomChance(2, 3)) {
							let hasFishKilling = false;
							for (let n = 0; n < 4; n++) {
								let move = this.getMove(set.moves[n]);
								if (move.type in {'Electric': 1}) {
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
						set.evs = {hp: 252, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
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

	randomSeasonalMulanTeam: function (side) {
		let armySide = 'china';
		let team = [];
		let pokemon = '';
		let template, set;
		let teamDetails = {megaStone: 0};
		let pokemonLeft = 0;

		// If the other team has been chosen, we get its opposing force.
		if (this.takenSide) {
			armySide = (this.takenSide === 'hun' ? 'china' : 'hun');
		} else {
			// First team being generated, pick a armySide at random.
			armySide = (Math.random() > 0.5 ? 'china' : 'hun');
			this.takenSide = armySide;
		}

		if (armySide === 'china') {
			const chinese = [
				'accelgor', 'bisharp', 'gallade', 'hitmonchan', 'hitmonlee', 'hitmontop', 'infernape', 'lucario', 'machoke', 'medicham',
				'medicham', 'mienshao', 'pangoro', 'sawk', 'scrafty', 'scizor', 'throh', 'ursaring', 'vigoroth', 'weavile', 'zangoose',
			];

			const weakCount = {};

			// Add the members of the army.
			const names = ["Li Shang", "Mulan", "Yao", "Ling"];

			for (let i = 0; i < chinese.length && pokemonLeft < 4; i++) {
				pokemon = this.sampleNoReplace(chinese);
				template = this.getTemplate(pokemon);

				// Li Shang shouldn't be an NFE Pokemon.
				if (names[pokemonLeft] === "Li Shang" && template.evos.length) continue;

				// We don't want too many Fighting or Flying weaknesses, since those moves will be common
				// Hard limit it to two, since after factoring in Chien-Po we might have a lot of common weakness
				const mainWeakness = {};
				if (Dex.getEffectiveness('Flying', template) > 0) mainWeakness['Flying'] = true;
				if (Dex.getEffectiveness('Fighting', template) > 0) mainWeakness['Fighting'] = true;
				if (mainWeakness['Fighting'] && weakCount['Fighting'] >= 2) continue;
				if (mainWeakness['Flying'] && weakCount['Flying'] >= 2) continue;

				for (const type in mainWeakness) {
					if (type in weakCount) {
						weakCount[type]++;
					} else {
						weakCount[type] = 1;
					}
				}

				set = this.randomSet(template, pokemonLeft, teamDetails);
				if (this.getItem(set.item).megaStone) teamDetails.megaStone++;
				set.species = toId(set.name);
				set.name = names[pokemonLeft];
				set.gender = (set.name === "Mulan" ? 'F' : 'M');
				set.moves[4] = 'searingshot';
				if (set.name === "Li Shang") {
					set.moves[5] = 'sing';
				}

				// Baton Pass is not allowed.
				let bpIndex = set.moves.indexOf('batonpass');
				if (bpIndex >= 0) {
					set.moves[bpIndex] = 'secretpower';
				}

				team.push(set);
				pokemonLeft++;
			}

			// Chien Po is very large, so he samples from a different pool of Pokemon
			pokemon = this.sample(['blastoise', 'snorlax', 'golem', 'lickilicky', 'poliwrath', 'hariyama', 'magmortar']);
			template = this.getTemplate(pokemon);
			set = this.randomSet(template, 4, teamDetails);
			if (this.getItem(set.item).megaStone) teamDetails.megaStone++;
			set.species = toId(set.name);
			set.name = "Chien-Po";
			set.gender = 'M';
			set.moves[4] = 'searingshot';
			team.push(set);

			// Add Eddie Murphy-- I mean, Mushu, to the team as a Dragonair.
			template = this.getTemplate('dragonair');
			template.randomBattleMoves = ['dragondance', 'aquatail', 'waterfall', 'wildcharge', 'extremespeed', 'dracometeor', 'dragonascent'];
			set = this.randomSet(template, 5);
			set.species = toId(set.name);
			set.name = "Mushu";
			set.gender = 'M';
			set.ability = "Turboblaze";
			set.moves[4] = 'sacredfire';
			set.moves[5] = 'dragonrush';
			team.push(set);
		} else {
			const huns = [
				'aggron', 'chesnaught', 'conkeldurr', 'drapion', 'electivire', 'emboar', 'exploud', 'feraligatr', 'granbull',
				'haxorus', 'machamp', 'nidoking', 'rhyperior', 'swampert', 'tyranitar',
			];

			for (let i = 0; i < huns.length && pokemonLeft < 5; i++) {
				pokemon = this.sampleNoReplace(huns);
				template = this.getTemplate(pokemon);
				set = this.randomSet(template, pokemonLeft, teamDetails);
				if (this.getItem(set.item).megaStone) teamDetails.megaStone++;
				set.species = toId(set.name);
				set.name = (i === 0 ? "Shan Yu" : "Hun " + template.species);
				set.gender = 'M';
				team.push(set);
				pokemonLeft++;
			}

			// Add Hayabusa the falcon.
			pokemon = this.sample(['fearow', 'pidgeot', 'staraptor', 'honchkrow', 'aerodactyl', 'archeops', 'braviary', 'noivern']);
			template = this.getTemplate(pokemon);
			set = this.randomSet(template, 5, teamDetails);
			set.species = toId(set.name);
			set.name = "Hayabusa";
			team.push(set);
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
				moves: ['blueflare', this.sample(['quiverdance', 'solarbeam', 'moonblast']), 'sunnyday'],
				baseSignatureMove: 'spikes', signatureMove: "Firebomb",
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
			},
			'~chaos': {
				species: 'Bouffalant', ability: 'Fur Coat', item: 'Red Card', gender: 'M',
				moves: ['precipiceblades', this.sample(['recover', 'stockpile', 'swordsdance']), 'extremespeed', 'explosion'],
				baseSignatureMove: 'embargo', signatureMove: "Forcewin",
				evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant',
			},
			'~haunter': {
				species: 'Landorus', ability: 'Sheer Force', item: 'Life Orb', gender: 'M',
				moves: ['hurricane', 'earthpower', 'fireblast', 'blizzard', 'thunder'],
				baseSignatureMove: 'quiverdance', signatureMove: "Genius Dance",
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Modest',
			},
			'~Jasmine': {
				species: 'Mew', ability: 'Speed Boost', item: 'Focus Sash', gender: 'F',
				moves: ['explosion', 'transform', 'milkdrink', 'storedpower'],
				baseSignatureMove: 'bellydrum', signatureMove: "Lockdown",
				evs: {hp: 252, def: 252, spd: 4}, nature: 'Bold',
			},
			'~Joim': {
				species: 'Zapdos', ability: 'Download', item: 'Leftovers', gender: 'M', shiny: true,
				moves: ['thunderbolt', 'hurricane', this.sample(['earthpower', 'roost', 'flamethrower', 'worryseed', 'haze', 'spore'])],
				baseSignatureMove: 'milkdrink', signatureMove: "Red Bull Drink",
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Modest',
			},
			'~The Immortal': {
				species: 'Blastoise', ability: 'Magic Bounce', item: 'Blastoisinite', gender: 'M', shiny: true,
				moves: ['shellsmash', 'steameruption', 'dragontail'],
				baseSignatureMove: 'sleeptalk', signatureMove: "Sleep Walk",
				evs: {hp: 252, def: 4, spd: 252}, nature: 'Sassy',
			},
			'~V4': {
				species: 'Victini', ability: 'Desolate Land', item: (variant === 0 ? this.sample(['Life Orb', 'Charcoal', 'Leftovers']) : this.sample(['Life Orb', 'Choice Scarf', 'Leftovers'])), gender: 'M',
				moves: (variant === 0 ? ['thousandarrows', 'bolt strike', 'shiftgear', 'dragonascent', 'closecombat', 'substitute'] : ['thousandarrows', 'bolt strike', 'dragonascent', 'closecombat']),
				baseSignatureMove: 'vcreate', signatureMove: "V-Generate",
				evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
			},
			'~Zarel': {
				species: 'Meloetta', ability: 'Serene Grace', item: '', gender: 'F',
				moves: ['lunardance', 'fierydance', 'perishsong', 'petaldance', 'quiverdance'],
				baseSignatureMove: 'relicsong', signatureMove: "Relic Song Dance",
				evs: {hp: 4, atk: 252, spa: 252}, nature: 'Quiet',
			},
			// Leaders.
			'&hollywood': {
				species: 'Mr. Mime', ability: 'Prankster', item: 'Leftovers', gender: 'M',
				moves: ['batonpass', this.sample(['substitute', 'milkdrink']), 'encore'],
				baseSignatureMove: 'geomancy', signatureMove: "Meme Mime",
				evs: {hp: 252, def: 4, spe: 252}, nature: 'Timid',
			},
			'&jdarden': {
				species: 'Dragonair', ability: 'Fur Coat', item: 'Eviolite', gender: 'M',
				moves: ['rest', 'sleeptalk', 'quiverdance'], name: 'jdarden',
				baseSignatureMove: 'dragontail', signatureMove: "Wyvern's Wind",
				evs: {hp: 252, def: 4, spd: 252}, nature: 'Calm',
			},
			'&Okuu': {
				species: 'Honchkrow', ability: 'Drought', item: 'Life Orb', gender: 'F',
				moves: [this.sample(['bravebird', 'sacredfire']), this.sample(['suckerpunch', 'punishment']), 'roost'],
				baseSignatureMove: 'firespin', signatureMove: "Blazing Star - Ten Evil Stars",
				evs: {atk: 252, spa: 4, spe: 252}, nature: 'Quirky',
			},
			'&sirDonovan': {
				species: 'Togetic', ability: 'Gale Wings', item: 'Eviolite', gender: 'M',
				moves: ['roost', 'hurricane', 'afteryou', 'charm', 'dazzlinggleam'],
				baseSignatureMove: 'mefirst', signatureMove: "Ladies First",
				evs: {hp: 252, spa: 252, spe: 4}, nature: 'Modest',
			},
			'&Slayer95': {
				species: 'Scizor', ability: 'Illusion', item: 'Scizorite', gender: 'M',
				moves: ['swordsdance', 'bulletpunch', 'uturn'],
				baseSignatureMove: 'allyswitch', signatureMove: "Spell Steal",
				evs: {atk: 252, def: 252, spd: 4}, nature: 'Brave',
			},
			'&Sweep': {
				species: 'Omastar', ability: 'Drizzle', item: this.sample(['Honey', 'Mail']), gender: 'M',
				moves: ['shellsmash', 'originpulse', this.sample(['thunder', 'icebeam'])],
				baseSignatureMove: 'kingsshield', signatureMove: "Sweep's Shield",
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Modest',
			},
			'&verbatim': {
				species: 'Archeops', ability: 'Reckless', item: 'Life Orb', gender: 'M',
				moves: ['headsmash', 'highjumpkick', 'flareblitz', 'volttackle', 'woodhammer'],
				baseSignatureMove: 'bravebird', signatureMove: "Glass Cannon",
				evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
			},
			// Mods.
			'@Acedia': {
				species: 'Slakoth', ability: 'Magic Bounce', item: 'Quick Claw', gender: 'F',
				moves: ['metronome', 'sketch', 'assist', 'swagger', 'foulplay'],
				baseSignatureMove: 'worryseed', signatureMove: "Procrastination",
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Serious',
			},
			'@AM': {
				species: 'Tyranitar', ability: 'Adaptability', item: (variant === 1 ? 'Lum Berry' : 'Choice Scarf'), gender: 'M',
				moves: (variant === 1 ? ['earthquake', 'diamondstorm', 'swordsdance', 'meanlook'] : ['knockoff', 'diamondstorm', 'earthquake']),
				baseSignatureMove: 'pursuit', signatureMove: "Predator",
				evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
			},
			'@antemortem': {
				species: 'Clefable', ability: (variant === 1 ? 'Sheer Force' : 'Multiscale'), item: (variant === 1 ? 'Life Orb' : 'Leftovers'), gender: 'M',
				moves: ['earthpower', 'cosmicpower', 'recover', 'gigadrain'],
				baseSignatureMove: 'drainingkiss', signatureMove: "Postmortem",
				evs: {hp: 252, spa: 252, def: 4}, nature: 'Modest',
			},
			'@Ascriptmaster': {
				species: 'Rotom', ability: 'Teravolt', item: 'Air Balloon', gender: 'M',
				moves: ['chargebeam', 'signalbeam', 'flamethrower', 'aurorabeam', 'dazzlinggleam'],
				baseSignatureMove: 'triattack', signatureMove: "Spectrum Beam",
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
			},
			'@asgdf': {
				species: 'Empoleon', ability: 'Filter', item: 'Rocky Helmet', gender: 'M',
				moves: ['scald', 'recover', 'calmmind', 'searingshot', 'encore'],
				baseSignatureMove: 'futuresight', signatureMove: "Obscure Pun",
				evs: {hp: 252, spa: 252, def: 4}, nature: 'Modest',
			},
			'@Audiosurfer': {
				species: 'Audino', ability: 'Prankster', item: 'Audinite', gender: 'M',
				moves: ['boomburst', 'slackoff', 'glare'],
				baseSignatureMove: 'detect', signatureMove: "Audioshield",
				evs: {hp: 252, spa: 252, spe: 4}, nature: 'Modest',
			},
			'@barton': {
				species: 'Piloswine', ability: 'Parental Bond', item: 'Eviolite', gender: 'M',
				moves: ['earthquake', 'iciclecrash', 'taunt'],
				baseSignatureMove: 'bulkup', signatureMove: "MDMA Huff",
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
			},
			'@bean': {
				species: 'Liepard', ability: 'Prankster', item: 'Leftovers', gender: 'M',
				moves: ['knockoff', 'encore', 'substitute', 'gastroacid', 'leechseed'],
				baseSignatureMove: 'glare', signatureMove: "Coin Toss",
				evs: {hp: 252, def: 252, spd: 4}, nature: 'Calm',
			},
			'@Beowulf': {
				species: 'Beedrill', ability: 'Download', item: 'Beedrillite', gender: 'M',
				moves: ['spikyshield', 'gunkshot', this.sample(['sacredfire', 'boltstrike', 'diamondstorm'])],
				baseSignatureMove: 'bugbuzz', signatureMove: "Buzzing of the Swarm",
				evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
			},
			'@BiGGiE': {
				species: 'Snorlax', ability: 'Fur Coat', item: 'Leftovers', gender: 'M',
				moves: ['drainpunch', 'diamondstorm', 'kingsshield', 'knockoff', 'precipiceblades'],
				baseSignatureMove: 'dragontail', signatureMove: "Food Rush",
				evs: {hp: 4, atk: 252, spd: 252}, nature: 'Adamant',
			},
			'@Blitzamirin': {
				species: 'Chandelure', ability: 'Prankster', item: 'Red Card', gender: 'M',
				moves: ['heartswap', this.sample(['darkvoid', 'substitute']), this.sample(['shadowball', 'blueflare'])],
				baseSignatureMove: 'oblivionwing', signatureMove: "Pneuma Relinquish",
				evs: {def: 4, spa: 252, spe: 252}, nature: 'Timid',
			},
			'@CoolStoryBrobat': {
				species: 'Crobat', ability: 'Gale Wings', item: 'Black Glasses', gender: 'M',
				moves: ['knockoff', 'bulkup', 'roost', 'closecombat', 'defog'],
				baseSignatureMove: 'bravebird', signatureMove: "Brave Bat",
				evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
			},
			'@Dell': {
				species: 'Lucario', ability: 'Simple', item: 'Lucarionite', gender: 'M',
				moves: ['jumpkick', this.sample(['flashcannon', 'bulletpunch']), 'batonpass'],
				baseSignatureMove: 'detect', signatureMove: "Aura Parry",
				evs: {hp: 4, atk: 216, spa: 36, spe: 252}, nature: 'Naive',
			},
			'@Eevee General': {
				species: 'Eevee', ability: 'Magic Guard', item: 'Eviolite', gender: 'M',
				moves: ['shiftgear', 'healorder', 'crunch', 'sacredsword', 'doubleedge'],
				baseSignatureMove: 'quickattack', signatureMove: "War Crimes",
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Impish',
			},
			'@Electrolyte': {
				species: 'Elekid', ability: 'Pure Power', item: 'Life Orb', gender: 'M',
				moves: ['volttackle', 'earthquake', this.sample(['iciclecrash', 'diamondstorm'])],
				baseSignatureMove: 'entrainment', signatureMove: "Study",
				evs: {atk: 252, spd: 4, spe: 252}, nature: 'Adamant',
			},
			'@Enguarde': {
				species: 'Gallade', ability: this.sample(['Intimidate', 'Hyper Cutter']), item: 'Galladite', gender: 'M',
				moves: ['psychocut', 'sacredsword', this.sample(['nightslash', 'precipiceblades', 'leafblade'])],
				baseSignatureMove: 'fakeout', signatureMove: "Ready Stance",
				evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant',
			},
			'@Eos': {
				species: 'Drifblim', ability: 'Fur Coat', item: 'Assault Vest', gender: 'M',
				moves: ['oblivionwing', 'paraboliccharge', 'gigadrain', 'drainingkiss'],
				baseSignatureMove: 'shadowball', signatureMove: "Shadow Curse",	//placeholder
				evs: {hp: 248, spa: 252, spd: 8}, nature: 'Modest',
			},
			'@Former Hope': {
				species: 'Froslass', ability: 'Prankster', item: 'Focus Sash', gender: 'M',
				moves: [this.sample(['icebeam', 'shadowball']), 'destinybond', 'thunderwave'],
				baseSignatureMove: 'roleplay', signatureMove: "Role Play",
				evs: {hp: 252, spa: 252, spd: 4}, nature: 'Modest',
			},
			'@Genesect': {
				species: 'Genesect', ability: 'Mold Breaker', item: 'Life Orb', gender: 'M',
				moves: ['bugbuzz', 'closecombat', 'extremespeed', 'thunderbolt', 'uturn'],
				baseSignatureMove: 'geargrind', signatureMove: "Grind you're mum",
				evs: {atk: 252, spa: 252, spe: 4}, nature: 'Quiet',
			},
			'@Hippopotas': {
				species: 'Hippopotas', ability: 'Regenerator', item: 'Eviolite', gender: 'M',
				moves: ['haze', 'stealthrock', 'spikes', 'toxicspikes', 'stickyweb'],
				baseSignatureMove: 'partingshot', signatureMove: "Hazard Pass",
				evs: {hp: 252, def: 252, spd: 4}, ivs: {atk: 0, spa: 0}, nature: 'Bold',
			},
			'@HYDRO IMPACT': {
				species: 'Charizard', ability: 'Rivalry', item: 'Life Orb', gender: 'M',
				moves: ['airslash', 'flamethrower', 'nobleroar', 'hydropump'],
				baseSignatureMove: 'hydrocannon', signatureMove: "HYDRO IMPACT",
				evs: {atk: 4, spa: 252, spe: 252}, nature: 'Hasty',
			},
			'@innovamania': {
				species: 'Arceus', ability: 'Pick Up', item: 'Black Glasses', gender: 'M',
				moves: [this.sample(['holdhands', 'trickortreat']), this.sample(['swordsdance', 'agility']), 'celebrate'],
				baseSignatureMove: 'splash', signatureMove: "Rage Quit",
				evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
			},
			'@jas61292': {
				species: 'Malaconda', ability: 'Analytic', item: 'Safety Goggles', gender: 'M',
				moves: ['coil', 'thunderwave', 'icefang', 'powerwhip', 'moonlight'],
				baseSignatureMove: 'crunch', signatureMove: "Minus One",
				evs: {hp: 252, atk: 252, spd: 4}, nature: 'Adamant',
			},
			'@jin of the gale': {
				species: 'Starmie', ability: 'Drizzle', item: 'Damp Rock', gender: 'M',
				moves: ['steameruption', 'hurricane', 'recover', 'psystrike', 'quiverdance'],
				baseSignatureMove: 'rapidspin', signatureMove: "Beyblade",
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
			},
			'@Kostitsyn-Kun': {
				species: 'Gothorita', ability: 'Simple', item: 'Eviolite', gender: 'F', //requested
				moves: ['calmmind', 'psyshock', this.sample(['dazzlinggleam', 'secretsword'])],
				baseSignatureMove: 'refresh', signatureMove: "Kawaii-desu uguu~",
				evs: {hp: 252, def: 136, spe: 120}, nature: 'Bold',
			},
			'@kupo': {
				species: 'Pikachu', ability: 'Prankster', item: "Light Ball", gender: 'M',
				moves: ['substitute', 'spore', 'encore'],
				baseSignatureMove: 'transform', signatureMove: "Kupo Nuts",
				evs: {hp: 252, def: 4, spd: 252}, nature: 'Jolly',
			},
			'@Lawrence III': {
				species: 'Lugia', ability: 'Trace', item: "Grip Claw", gender: 'M',
				moves: ['infestation', 'magmastorm', 'oblivionwing'],
				baseSignatureMove: 'gust', signatureMove: "Shadow Storm",
				evs: {hp: 248, def: 84, spa: 92, spd: 84}, nature: 'Modest',
			},
			'@Layell': {
				species: 'Sneasel', ability: 'Technician', item: "King's Rock", gender: 'M',
				moves: ['iceshard', 'iciclespear', this.sample(['machpunch', 'pursuit', 'knockoff'])],
				baseSignatureMove: 'protect', signatureMove: "Pixel Protection",
				evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant',
			},
			'@LegitimateUsername': {
				species: 'Shuckle', ability: 'Unaware', item: 'Leftovers', gender: 'M',
				moves: ['leechseed', 'rest', 'foulplay'],
				baseSignatureMove: 'shellsmash', signatureMove: "Shell Fortress",
				evs: {hp: 252, def: 228, spd: 28}, nature: 'Calm',
			},
			'@Level 51': {
				species: 'Togekiss', ability: 'Parental Bond', item: 'Leftovers', gender: 'M',
				moves: ['seismictoss', 'roost', this.sample(['cosmicpower', 'cottonguard'])],
				baseSignatureMove: 'trumpcard', signatureMove: "Next Level Strats",
				evs: {hp: 252, def: 4, spd: 252}, nature: 'Calm',
			},
			'@Lyto': {
				species: 'Lanturn', ability: 'Magic Bounce', item: 'Leftovers', gender: 'M',
				moves: ['originpulse', 'lightofruin', 'blueflare', 'recover', 'tailglow'],
				baseSignatureMove: 'thundershock', signatureMove: "Gravity Storm",
				evs: {hp: 188, spa: 252, spe: 68}, nature: 'Modest',
			},
			'@Marty': {
				species: 'Houndoom', ability: 'Drought', item: 'Houndoominite', gender: 'M',
				moves: ['nightdaze', 'solarbeam', 'aurasphere', 'thunderbolt', 'earthpower'],
				baseSignatureMove: 'sacredfire', signatureMove: "Immolate",
				evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
			},
			'@Morfent': {
				species: 'Dusknoir', ability: 'Fur Coat', item: "Leftovers", gender: 'M',
				moves: [this.sample(['recover', 'acidarmor', 'swordsdance', 'willowisp', 'trickroom']), 'shadowclaw', this.sample(['earthquake', 'icepunch', 'thunderpunch'])],
				baseSignatureMove: 'spikes', signatureMove: "Used Needles",
				evs: {hp: 252, atk: 4, def: 252}, ivs: {spe: 0}, nature: 'Impish',
			},
			'@Nani Man': {
				species: 'Gengar', ability: 'Desolate Land', item: 'Black Glasses', gender: 'M', shiny: true,
				moves: ['eruption', 'swagger', 'shadow ball', 'topsyturvy', 'dazzlinggleam'],
				baseSignatureMove: 'fireblast', signatureMove: "Tanned",
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
			},
			'@NixHex': {
				species: 'Porygon2', ability: 'No Guard', item: 'Eviolite', gender: 'M', shiny: true,
				moves: ['thunder', 'blizzard', 'overheat', 'triattack', 'recover'],
				baseSignatureMove: 'inferno', signatureMove: "Beautiful Disaster",
				evs: {hp: 252, spa: 252, spe: 4}, nature: 'Modest',
			},
			'@Osiris': {
				species: 'Pumpkaboo-Super', ability: 'Bad Dreams', item: 'Eviolite', gender: 'M',
				moves: ['leechseed', 'recover', 'cosmicpower'],
				baseSignatureMove: 'hypnosis', signatureMove: "Restless Sleep",
				evs: {hp: 252, def: 216, spd: 40}, ivs: {atk: 0}, nature: 'bold',
			},
			'@phil': {
				species: 'Gastrodon', ability: 'Drizzle', item: 'Shell Bell', gender: 'M',
				moves: ['scald', 'recover', 'gastroacid', 'brine'],
				baseSignatureMove: 'whirlpool', signatureMove: "Slug Attack",
				evs: {hp: 252, spa: 252, def: 4}, nature: 'Quirky',
			},
			'@qtrx': {
				species: 'Unown', ability: 'Levitate', item: 'Focus Sash', gender: 'M',
				moves: [],
				baseSignatureMove: 'meditate', signatureMove: "Hidden Power... Normal?",
				evs: {hp: 252, def: 4, spa: 252}, ivs: {atk: 0, spe: 0}, nature: 'Quiet',
			},
			'@Queez': {
				species: 'Cubchoo', ability: 'Prankster', item: 'Eviolite', gender: 'M',
				moves: ['pound', 'fly', 'softboiled', 'thunderwave', 'waterpulse'],
				baseSignatureMove: 'leer', signatureMove: "Sneeze",
				evs: {hp: 252, def: 228, spd: 28}, nature: 'Calm',
			},
			'@rekeri': {
				species: 'Tyrantrum', ability: 'Tough Claws', item: 'Life Orb', gender: 'M',
				moves: ['outrage', 'extremespeed', 'stoneedge', 'closecombat'],
				baseSignatureMove: 'headcharge', signatureMove: "Land Before Time",
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
			},
			'@Relados': {
				species: 'Terrakion', ability: 'Guts', item: 'Flame Orb', gender: 'M',
				moves: ['knockoff', 'diamondstorm', 'closecombat', 'iceshard', 'drainpunch'],
				baseSignatureMove: 'stockpile', signatureMove: "Loyalty",
				evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant',
			},
			'@Reverb': {
				species: 'Slaking', ability: 'Scrappy', item: 'Assault Vest', gender: 'M',
				moves: ['feint', 'stormthrow', 'blazekick'], // Feint as a countermeasure to the abundance of Protect-based set-up moves.
				baseSignatureMove: 'eggbomb', signatureMove: "fat monkey",
				evs: {hp: 252, spd: 40, spe: 216}, nature: 'Jolly', // EV-nerf.
			},
			'@RosieTheVenusaur': {
				species: 'Venusaur', ability: 'Moxie', item: 'Leftovers', gender: 'F',
				moves: ['flamethrower', 'extremespeed', 'sacredfire', 'knockoff', 'closecombat'],
				baseSignatureMove: 'frenzyplant', signatureMove: "Swag Plant",
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
			},
			'@scalarmotion': {
				species: 'Cryogonal', ability: 'Magic Guard', item: 'Focus Sash', gender: 'M',
				moves: ['rapidspin', 'willowisp', 'taunt', 'recover', 'voltswitch'],
				baseSignatureMove: 'icebeam', signatureMove: "Eroding Frost",
				evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
			},
			'@Scotteh': {
				species: 'Suicune', ability: 'Fur Coat', item: 'Leftovers', gender: 'M',
				moves: ['icebeam', 'steameruption', 'recover', 'nastyplot'],
				baseSignatureMove: 'boomburst', signatureMove: "Geomagnetic Storm",
				evs: {def: 252, spa: 4, spe: 252}, nature: 'Bold',
			},
			'@Shame That': {
				species: 'Weavile', ability: 'Magic Guard', item: 'Focus Sash', gender: 'M',
				moves: ['substitute', 'captivate', 'reflect', 'rest', 'raindance', 'foresight'],
				baseSignatureMove: 'healingwish', signatureMove: "Extreme Compromise",
				evs: {hp: 252, def: 4, spe: 252}, nature: 'Jolly',
			},
			'@shrang': {
				species: 'Latias', ability: 'Pixilate', item: this.sample(['Latiasite', 'Life Orb', 'Leftovers']), gender: 'M',
				moves: ['dracometeor', 'roost', 'nastyplot', 'fireblast', 'aurasphere', 'psystrike'], //not QD again senpai >.<
				baseSignatureMove: 'judgment', signatureMove: "Pixilate",	//placeholder
				evs: {hp: 160, spa: 96, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
			},
			'@Skitty': {
				species: 'Audino', ability: 'Intimidate', item: 'Audinite', gender: 'M',
				moves: ['acupressure', 'recover', this.sample(['taunt', 'cosmicpower', 'magiccoat'])],
				baseSignatureMove: 'storedpower', signatureMove: "Ultimate Dismissal",
				evs: {hp: 252, def: 252, spd: 4}, nature: 'Bold',
			},
			'@Snowflakes': {
				species: 'Celebi', ability: 'Filter', item: 'Leftovers', gender: 'M',
				moves: [
					['gigadrain', this.sample(['recover', 'quiverdance']), this.sample(['icebeam', 'searingshot', 'psystrike', 'thunderbolt', 'aurasphere', 'moonblast'])],
					['gigadrain', 'recover', [this.sample(['uturn', 'voltswitch']), 'thunderwave', 'leechseed', 'healbell', 'healingwish', 'reflect', 'lightscreen', 'stealthrock'][this.random(8)]],
					['gigadrain', 'perishsong', ['recover', this.sample(['uturn', 'voltswitch']), 'leechseed', 'thunderwave', 'healbell'][this.random(5)]],
					['gigadrain', 'recover', ['thunderwave', 'icebeam', this.sample(['uturn', 'voltswitch']), 'psystrike'][this.random(4)]],
				][this.random(4)],
				baseSignatureMove: 'thousandarrows', signatureMove: "Azalea Butt Slam",
				evs: {hp: 252, spa: 252, def: 4}, nature: 'Modest',
			},
			'@Spydreigon': {
				species: 'Hydreigon', ability: 'Mega Launcher', item: 'Life Orb', gender: 'M',
				moves: ['dragonpulse', 'darkpulse', 'aurasphere', 'originpulse', 'shiftgear'],
				baseSignatureMove: 'waterpulse', signatureMove: "Mineral Pulse",
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
			},
			'@Steamroll': {
				species: 'Growlithe', ability: 'Adaptability', item: 'Life Orb', gender: 'M',
				moves: ['flareblitz', 'volttackle', 'closecombat'],
				baseSignatureMove: 'protect', signatureMove: "Conflagration",
				evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant',
			},
			'@SteelEdges': {
				species: 'Alakazam', ability: 'Competitive', item: 'Alakazite', gender: 'M',
				moves: ['bugbuzz', 'hypervoice', 'psystrike', 'batonpass', 'focusblast'],
				baseSignatureMove: 'tailglow', signatureMove: "True Daily Double",
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Serious',
			},
			'@Temporaryanonymous': {
				species: 'Doublade', ability: 'Tough Claws', item: 'Eviolite', gender: 'M',
				moves: ['swordsdance', this.sample(['xscissor', 'sacredsword', 'knockoff']), 'geargrind'],
				baseSignatureMove: 'shadowsneak', signatureMove: "SPOOPY EDGE CUT",
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
			},
			'@Test2017': {
				species: "Farfetch'd", ability: 'Wonder Guard', item: 'Stick', gender: 'M',
				moves: ['foresight', 'gastroacid', 'nightslash', 'roost', 'thousandarrows'],
				baseSignatureMove: 'karatechop', signatureMove: "Ducktastic",
				evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant',
			},
			'@TFC': {
				species: 'Blastoise', ability: 'Prankster', item: 'Leftovers', gender: 'M',
				moves: ['quiverdance', 'cottonguard', 'storedpower', 'aurasphere', 'slackoff'],
				baseSignatureMove: 'drainpunch', signatureMove: "Chat Flood",
				evs: {atk: 252, def: 4, spe: 252}, nature: 'Modest',
			},
			'@TGMD': {
				species: 'Stoutland', ability: 'Speed Boost', item: 'Life Orb', gender: 'M',
				moves: [this.sample(['extremespeed', 'sacredsword']), 'knockoff', 'protect'],
				baseSignatureMove: 'return', signatureMove: "Canine Carnage",
				evs: {hp: 32, atk: 252, spe: 224}, nature: 'Adamant',
			},
			'@Timbuktu': {
				species: 'Heatmor', ability: 'Contrary', item: 'Life Orb', gender: 'M',
				moves: ['overheat', this.sample(['hammerarm', 'substitute']), this.sample(['glaciate', 'thunderbolt'])], // Curse didn't make sense at all so it was changed to Hammer Arm
				baseSignatureMove: 'rockthrow', signatureMove: "Geoblast",
				evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
			},
			'@Trickster': {
				species: 'Whimsicott', ability: 'Prankster', item: 'Leftovers', gender: 'M',
				moves: ['swagger', 'spore', 'seedflare', 'recover', 'nastyplot'],
				baseSignatureMove: 'naturepower', signatureMove: "Cometstorm",
				evs: {hp: 252, spa: 252, spe: 4},
			},
			'@trinitrotoluene': {
				species: 'Metagross', ability: 'Levitate', item: 'Metagrossite', gender: 'M',
				moves: ['meteormash', 'zenheadbutt', 'hammerarm', 'grassknot', 'earthquake', 'thunderpunch', 'icepunch', 'shiftgear'],
				baseSignatureMove: 'explosion', signatureMove: "Get Haxed",
				evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
			},
			'@WaterBomb': {
				species: 'Poliwrath', ability: 'Unaware', item: 'Leftovers', gender: 'M',
				moves: ['heartswap', 'softboiled', 'aromatherapy', 'highjumpkick'],
				baseSignatureMove: 'waterfall', signatureMove: "Water Bomb",
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
			},
			'@xfix': {
				species: 'Xatu', ability: 'Magic Bounce', item: 'Focus Sash', gender: 'M',
				moves: ['thunderwave', 'substitute', 'roost'],
				baseSignatureMove: 'metronome', signatureMove: "(Super Glitch)",
				evs: {hp: 252, spd: 252, def: 4}, nature: 'Calm',
			},
			'@zdrup': {
				species: 'Slowking', ability: 'Slow Start', item: 'Leftovers', gender: 'M',
				moves: ['psystrike', 'futuresight', 'originpulse', 'slackoff', 'destinybond'],
				baseSignatureMove: 'wish', signatureMove: "Premonition",
				evs: {hp: 252, def: 4, spd: 252}, nature: 'Quiet',
			},
			'@Zebraiken': {
				species: 'zebstrika', ability: 'Compound Eyes', item: 'Life Orb', gender: 'M',
				moves: ['thunder', this.sample(['fire blast', 'focusblast', 'highjumpkick', 'meteormash']), this.sample(['blizzard', 'iciclecrash', 'sleeppowder'])], // why on earth does he learn Meteor Mash?
				baseSignatureMove: 'detect', signatureMove: "bzzt",
				evs: {atk: 4, spa: 252, spe: 252}, nature: 'Hasty',
			},
			// Drivers.
			'%Aelita': {
				species: 'Porygon-Z', ability: 'Protean', item: 'Life Orb', gender: 'F',
				moves: ['boomburst', 'quiverdance', 'chatter', 'blizzard', 'moonblast'],
				baseSignatureMove: 'thunder', signatureMove: "Energy Field",
				evs: {hp: 4, spa: 252, spd: 252}, nature: 'Modest',
			},
			'%Arcticblast': {
				species: 'Cresselia', ability: 'Levitate', item: 'Sitrus Berry', gender: 'M',
				moves: [
					this.sample(['fakeout', 'icywind', 'trickroom', 'safeguard', 'thunderwave', 'tailwind', 'knockoff']),
					this.sample(['sunnyday', 'moonlight', 'calmmind', 'protect', 'taunt']),
					this.sample(['originpulse', 'heatwave', 'hypervoice', 'icebeam', 'moonblast']),
				],
				baseSignatureMove: 'psychoboost', signatureMove: "Doubles Purism",
				evs: {hp: 252, def: 120, spa: 56, spd: 80}, nature: 'Sassy',
			},
			'%Articuno': {
				species: 'Articuno', ability: 'Magic Guard', item: 'Sitrus Berry', gender: 'F',
				moves: ['roost', 'calmmind', this.sample(['psychic', 'airslash', 'icebeam', 'thunderwave'])],
				baseSignatureMove: 'whirlwind', signatureMove: "True Support",
				evs: {hp: 252, def: 192, spa: 64}, nature: 'Modest',
			},
			'%Ast☆arA': {
				species: 'Jirachi', ability: 'Cursed Body', item: this.sample(['Leftovers', 'Sitrus Berry']), gender: 'F',
				moves: ['psychic', 'moonblast', 'nastyplot', 'recover', 'surf'],
				baseSignatureMove: 'psywave', signatureMove: "Star Bolt Desperation",
				evs: {hp: 4, spa: 252, spd: 252}, nature: 'Modest',
			},
			'%Asty': {
				species: 'Seismitoad', ability: 'Sap Sipper', item: 'Red Card', gender: 'M',
				moves: ['earthquake', 'recover', 'icepunch'],
				baseSignatureMove: 'toxic', signatureMove: "Amphibian Toxin",
				evs: {atk: 252, spd: 252, spe: 4}, nature: 'Adamant',
			},
			'%Birkal': {
				species: 'Rotom-Fan', ability: 'Magic Guard', item: 'Choice Scarf', gender: 'M',
				moves: ['trick', 'aeroblast', this.sample(['discharge', 'partingshot', 'recover', 'tailglow'])],
				baseSignatureMove: 'quickattack', signatureMove: "Caw",
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
			},
			'%bloobblob': {
				species: 'Cinccino', ability: 'Skill Link', item: 'Life Orb', gender: 'M',
				moves: ['bulletseed', 'rockblast', 'uturn', 'tailslap', 'knockoff'],
				baseSignatureMove: 'spikecannon', signatureMove: "Lava Whip",
				evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant',
			},
			'%Bumbadadabum': {
				species: 'Samurott', ability: 'Analytic', item: 'Safety Goggles', gender: 'M',
				moves: ['calmmind', 'originpulse', 'icebeam'],
				baseSignatureMove: 'hypervoice', signatureMove: "Open Source Software",
				evs: {hp: 252, spa: 252, spd: 4}, nature: 'Modest',
			},
			'%Charles Carmichael': {
				species: 'Quagsire', ability: 'Sap Sipper', item: 'Liechi Berry', gender: 'M',
				moves: ['waterfall', 'earthquake', this.sample(['stoneedge', 'rockslide']), 'icepunch'],
				baseSignatureMove: 'swagger', signatureMove: "Bad Pun",
				evs: {hp: 248, atk: 252, spe: 8}, nature: 'Naughty',
			},
			'%Crestfall': {
				species: 'Darkrai', ability: 'Parental Bond', item: 'Lum Berry', gender: 'M',
				moves: ['darkpulse', 'icebeam', 'oblivionwing'],
				baseSignatureMove: 'protect', signatureMove: "Final Hour",
				evs: {spa: 252, def: 4, spe: 252}, nature: 'Modest',
			},
			'%DTC': {
				species: 'Charizard', ability: 'Magic Guard', item: 'Charizardite X', gender: 'M',
				moves: ['shiftgear', 'blazekick', 'roost'],
				baseSignatureMove: 'dragonrush', signatureMove: "Dragon Smash",
				evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant',
			},
			'%Feliburn': {
				species: 'Infernape', ability: 'Adaptability', item: 'Expert Belt', gender: 'M',
				moves: ['highjumpkick', 'sacredfire', 'taunt', 'fusionbolt', 'machpunch'],
				baseSignatureMove: 'firepunch', signatureMove: "Falcon Punch",
				evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
			},
			'%galbia': {
				species: 'Cobalion', ability: 'Serene Grace', item: 'Leftovers',
				moves: ['ironhead', 'taunt', 'swordsdance', 'thunderwave', 'substitute'],
				baseSignatureMove: 'highjumpkick', signatureMove: "Kibitz",
				evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
			},
			'%Hugendugen': {
				species: 'Latios', ability: 'Prankster', item: 'Life Orb', gender: 'M',
				moves: ['taunt', 'dracometeor', 'surf', 'earthpower', 'recover', 'thunderbolt', 'icebeam'],
				baseSignatureMove: 'psychup', signatureMove: "Policy Decision",
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Modest',
			},
			'%Jellicent': {
				species: 'Jellicent', ability: 'Poison Heal', item: 'Toxic Orb', gender: 'M',
				moves: ['recover', 'freezedry', 'trick', 'substitute'],
				baseSignatureMove: 'surf', signatureMove: "Shot For Shot",
				evs: {hp: 252, def: 4, spd: 252}, nature: 'Calm',
			},
			'%Kayo': {
				species: 'Gourgeist-Super', ability: 'Magic Bounce', item: 'Leftovers', gender: 'M', shiny: true,
				moves: ['leechseed', 'shadowforce', 'spore', 'recover'],
				baseSignatureMove: 'vinewhip', signatureMove: "Beard of Zeus Bomb",
				evs: {hp: 252, def: 252, spd: 4}, nature: 'Impish',
			},
			'%LJDarkrai': {
				species: 'Garchomp', ability: 'Compound Eyes', item: 'Life Orb', gender: 'M',
				moves: ['dragondance', 'dragonrush', 'gunkshot', 'precipiceblades', 'sleeppowder', 'stoneedge'], name: '%LJDarkrai',
				baseSignatureMove: 'blazekick', signatureMove: "Blaze Blade",
				evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant',
			},
			'%Majorbling': {
				species: 'Dedenne', ability: 'Levitate', item: 'Expert Belt', gender: 'M',
				moves: ['moonblast', 'voltswitch', 'discharge', 'focusblast', 'taunt'],
				baseSignatureMove: 'bulletpunch', signatureMove: "Focus Laser",
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
			},
			'%QuoteCS': {
				species: 'Skarmory', ability: 'Adaptability', item: 'Life Orb', gender: 'M',
				moves: ['meteormash', 'bravebird', 'roost'],
				baseSignatureMove: 'spikes', signatureMove: "Diversify",
				evs: {hp: 248, atk: 252, spe: 8}, nature: 'Adamant',
			},
			'%raseri': {
				species: 'Prinplup', ability: 'Regenerator', item: 'Eviolite', gender: 'M',
				moves: ['defog', 'stealthrock', 'toxic', 'roar', 'bravebird'],
				baseSignatureMove: 'scald', signatureMove: "Ban Scald",
				evs: {hp: 252, def: 228, spd: 28}, nature: 'Bold',
			},
			'%uselesstrainer': {
				species: 'Scatterbug', ability: 'Skill Link', item: 'Mail', gender: 'M',
				moves: ['explosion', 'stringshot', 'stickyweb', 'spiderweb', 'mist'],
				baseSignatureMove: 'bulletpunch', signatureMove: "Ranting",
				evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
			},
			'%Vacate': {
				species: 'Bibarel', ability: 'Adaptability', item: 'Leftovers', gender: 'M',
				moves: ['earthquake', 'smellingsalts', 'stockpile', 'zenheadbutt', 'waterfall'],
				baseSignatureMove: 'superfang', signatureMove: "Duper Fang",
				evs: {atk: 252, def: 4, spd: 252}, nature: 'Quiet',
			},
			// Voices.
			'+Aldaron': {
				species: 'Conkeldurr', ability: 'Speed Boost', item: 'Assault Vest', gender: 'M',
				moves: ['drainpunch', 'machpunch', 'iciclecrash', 'closecombat', 'earthquake', 'shadowclaw'],
				baseSignatureMove: 'superpower', signatureMove: "Admin Decision",
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
			},
			'+bmelts': {
				species: 'Mewtwo', ability: 'Regenerator', item: 'Mewtwonite X', gender: 'M',
				moves: ['batonpass', 'uturn', 'voltswitch'],
				baseSignatureMove: 'partingshot', signatureMove: "Aaaannnd... he's gone",
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Modest',
			},
			'+Cathy': {
				species: 'Aegislash', ability: 'Stance Change', item: 'Life Orb', gender: 'F',
				moves: ['kingsshield', 'shadowsneak', this.sample(['calmmind', 'shadowball', 'shadowclaw', 'flashcannon', 'dragontail', 'hyperbeam'])],
				baseSignatureMove: 'memento', signatureMove: "HP Display Policy",
				evs: {hp: 4, atk: 252, spa: 252}, nature: 'Quiet',
			},
			'+Diatom': {
				species: 'Spiritomb', ability: 'Parental Bond', item: 'Custap Berry', gender: 'M',
				moves: ['psywave', this.sample(['poisonfang', 'shadowstrike']), this.sample(['uturn', 'rapidspin'])],
				baseSignatureMove: 'healingwish', signatureMove: "Be Thankful I Sacrificed Myself",
				evs: {hp: 252, def: 136, spd: 120}, nature: 'Impish',
			},
			'+Limi': {
				species: 'Primeape', ability: 'Poison Heal', item: 'Leftovers', gender: 'M',
				moves: ['ingrain', 'doubleedge', 'leechseed'],
				baseSignatureMove: 'growl', signatureMove: "Resilience",
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
			},
			'+MattL': {
				species: 'Mandibuzz', ability: 'Poison Heal', item: 'Leftovers', gender: 'M',
				moves: ['oblivionwing', 'leechseed', 'quiverdance', 'topsyturvy', 'substitute'],
				baseSignatureMove: 'toxic', signatureMove: "Topology",
				evs: {hp: 252, def: 252, spd: 4}, nature: 'Bold',
			},
			'+mikel': {
				species: 'Giratina', ability: 'Prankster', item: 'Lum Berry', gender: 'M',
				moves: ['rest', 'recycle', this.sample(['toxic', 'willowisp'])],
				baseSignatureMove: 'swagger', signatureMove: "Trolling Lobby",
				evs: {hp: 252, def: 128, spd: 128}, ivs: {atk: 0}, nature: 'Calm',
			},
			'+Great Sage': {
				species: 'Shuckle', ability: 'Harvest', item: 'Leppa Berry', gender: '',
				moves: ['substitute', 'protect', 'batonpass'],
				baseSignatureMove: 'judgment', signatureMove: "Judgment",
				evs: {hp: 252, def: 28, spd: 228}, ivs: {atk: 0, def: 0, spe: 0}, nature: 'Bold',
			},
			'+Redew': {
				species: 'Minun', ability: 'Wonder Guard', item: 'Air Balloon', gender: 'M',
				moves: ['nastyplot', 'thunderbolt', 'icebeam'],
				baseSignatureMove: 'recover', signatureMove: "Recover",
				evs:{hp: 4, spa: 252, spe: 252}, nature: 'Modest',
			},
			'+shaymin': {
				species: 'Shaymin-Sky', ability: 'Serene Grace', item: 'Expert Belt', gender: 'F',
				moves: ['seedflare', 'airslash', this.sample(['secretsword', 'earthpower', 'roost'])],
				baseSignatureMove: 'detect', signatureMove: "Flower Garden",
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
			},
			'+SOMALIA': {
				species: 'Gastrodon', ability: 'Anger Point', item: 'Leftovers', gender: 'M',
				moves: ['recover', 'steameruption', 'earthpower', 'leafstorm', 'substitute'],
				baseSignatureMove: 'energyball', signatureMove: "Ban Everyone",
				evs: {hp: 252, spa: 252, spd: 4}, nature: 'Modest',
			},
			'+TalkTakesTime': {
				species: 'Registeel', ability: 'Flash Fire', item: 'Leftovers', gender: 'M',
				moves: ['recover', 'ironhead', 'bellydrum'],
				baseSignatureMove: 'taunt', signatureMove: "Bot Mute",
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
			},
		};
		// Generate the team randomly.
		let pool = Object.keys(sets);
		let levels = {'~': 99, '&': 97, '@': 96, '%': 96, '+': 95};
		for (let i = 0; i < 6; i++) {
			let identity = this.sampleNoReplace(pool);
			let rank = identity.charAt(0);
			let set = sets[identity];
			set.level = levels[rank];
			set.name = identity;
			if (!set.ivs) {
				set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
			} else {
				for (let iv in {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}) {
					set.ivs[iv] = set.ivs[iv] ? set.ivs[iv] : 31;
				}
			}
			// Assuming the hardcoded set evs are all legal.
			if (!set.evs) set.evs = {hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84};
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

		let excludedTiers = {'LC': 1, 'LC Uber': 1, 'NFE': 1};
		let allowedNFE = {'Chansey': 1, 'Doublade': 1, 'Gligar': 1, 'Porygon2': 1, 'Scyther': 1};
		let excludedColors = {'Black': 1, 'Brown': 1, 'Gray': 1, 'White': 1};

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
		let teamDetails = {megaStone: 0, stealthRock: 0};

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
				if (puCount > 1 && this.randomChance(4, 5)) continue;
				break;
			case 'Uber':
				// Ubers are limited to 2 but have a 20% chance of being added anyway.
				if (uberCount > 1 && this.randomChance(4, 5)) continue;
				break;
			case 'CAP':
				// CAPs have 20% the normal rate
				if (this.randomChance(4, 5)) continue;
				break;
			case 'Unreleased':
				// Unreleased Pokémon have 20% the normal rate
				if (this.randomChance(4, 5)) continue;
			}

			// Adjust rate for species with multiple formes
			switch (template.baseSpecies) {
			case 'Arceus':
				if (this.randomChance(17, 18)) continue;
				break;
			case 'Basculin':
				if (this.randomChance(1, 2)) continue;
				break;
			case 'Genesect':
				if (this.randomChance(4, 5)) continue;
				break;
			case 'Gourgeist':
				if (this.randomChance(3, 4)) continue;
				break;
			case 'Meloetta':
				if (this.randomChance(1, 2)) continue;
				break;
			case 'Castform':
				if (this.randomChance(1, 2)) continue;
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
				if (typeCount[types[t]] > 1 && this.randomChance(4, 5)) {
					skip = true;
					break;
				}
			}
			if (colorCount[color] > 1 && this.randomChance(7, 8)) {
				skip = true;
			}
			if (skip) continue;

			let set = this.randomSet(template, pokemon.length, teamDetails);

			// Illusion shouldn't be on the last pokemon of the team
			if (set.ability === 'Illusion' && pokemonLeft > 4) continue;

			// Make sure that the base forme isn't of a banned color.
			if (this.getTemplate(set.species).color in excludedColors) continue;

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
			if (isMegaSet && teamDetails.megaStone > 0) continue;

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
			if (isMegaSet) teamDetails.megaStone++;
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
			let set = this.randomSet(template, i, {megaStone: 1});
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

		let teamDetails = {megaStone: 1, stealthRock: 0, hazardClear: 0};
		let sides = teams.map((_, index) => index);
		let side;

		if (!this.takenSide) {
			side = this.sample(sides);
			this.takenSide = side;
		} else {
			do {
				// You can't have both players have the same squad
				side = this.sampleNoReplace(sides);
			} while (side === this.takenSide);
		}

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
