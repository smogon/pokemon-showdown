exports.BattleScripts = {
	init: function () {
		var tankStats = {hp:90, atk:30, def:120, spa:130, spd:120, spe:50};
		var healerStats = {hp:50, atk:10, def:95, spa:80, spd:95, spe:10};
		var supportStats = {hp:75, atk:50, def:90, spa:50, spd:90, spe:100};
		var dpsStats = {hp:65, atk:130, def:85, spa:130, spd:85, spe:150};
		// Modify tanks
		this.modData('Pokedex', 'registeel').baseStats = tankStats;
		this.modData('Pokedex', 'golurk').baseStats = tankStats;
		this.modData('Pokedex', 'golett').baseStats = tankStats;
		this.modData('Pokedex', 'palkia').baseStats = tankStats;
		this.modData('Pokedex', 'slugma').baseStats = tankStats;
		this.modData('Pokedex', 'snorlax').baseStats = tankStats;
		this.modData('Pokedex', 'xerneas').baseStats = tankStats;
		this.modData('Pokedex', 'muk').baseStats = tankStats;
		this.modData('Pokedex', 'gothitelle').baseStats = tankStats;
		// Modify healers
		this.modData('Pokedex', 'jynx').baseStats = healerStats;
		this.modData('Pokedex', 'gardevoir').baseStats = healerStats;
		this.modData('Pokedex', 'alakazam').baseStats = healerStats;
		this.modData('Pokedex', 'celebi').baseStats = healerStats;
		this.modData('Pokedex', 'bisharp').baseStats = healerStats;
		this.modData('Pokedex', 'machoke').baseStats = healerStats;
		this.modData('Pokedex', 'treecko').baseStats = healerStats;
		// Modify supporters
		this.modData('Pokedex', 'regirock').baseStats = supportStats;
		this.modData('Pokedex', 'scrafty').baseStats = supportStats;
		this.modData('Pokedex', 'mrmime').baseStats = supportStats;
		this.modData('Pokedex', 'elgyem').baseStats = supportStats;
		this.modData('Pokedex', 'heliolisk').baseStats = supportStats;
		this.modData('Pokedex', 'regigigas').baseStats = supportStats;
		this.modData('Pokedex', 'genesect').baseStats = supportStats;
		this.modData('Pokedex', 'delphox').baseStats = supportStats;
		// Modify DPSs
		this.modData('Pokedex', 'groudon').baseStats = dpsStats;
		this.modData('Pokedex', 'ursaring').baseStats = dpsStats;
		this.modData('Pokedex', 'magmar').baseStats = dpsStats;
		this.modData('Pokedex', 'sawk').baseStats = dpsStats;
		this.modData('Pokedex', 'hitmonlee').baseStats = dpsStats;
		this.modData('Pokedex', 'throh').baseStats = dpsStats;
		this.modData('Pokedex', 'monferno').baseStats = dpsStats;
		this.modData('Pokedex', 'dialga').baseStats = dpsStats;
		this.modData('Pokedex', 'clawitzer').baseStats = dpsStats;
		this.modData('Pokedex', 'yveltal').baseStats = dpsStats;
		this.modData('Pokedex', 'dusknoir').baseStats = dpsStats;
		this.modData('Pokedex', 'cofagrigus').baseStats = dpsStats;
		this.modData('Pokedex', 'toxicroak').baseStats = dpsStats;
		this.modData('Pokedex', 'raticate').baseStats = dpsStats;
	},
	randomSeasonalMay2015Team: function (side) {
		var team = [];
		var healers, tanks, supports, dps = [];
		// Teams on this seasonal have: A tank. A healer. A dps. A support. An off-tank. Another dps.
		// We have a pool of them, depending on the team, and give them.
		// If the other team has been chosen, we get its opposing force.
		if (this.seasonal && this.seasonal.side) {
			side = (this.seasonal.side === 'heroes' ? 'evil' : 'heroes');
		} else {
			// First team being generated, pick a side at random.
			side = (Math.random() > 0.5 ? 'heroes' : 'evil');
			this.seasonal = {'side': side};
		}

		if (side === 'heroes') {
			healers = ['Amy', 'Princess Leia', 'Scruffy', 'Yoda'].randomize();
			tanks = ['Bender', 'Gurren Lagann', 'Lagann', 'Rei Ayanami', 'Slurms McKenzie'].randomize();
			supports = ['C3PO', 'Hermes', 'Professor Farnsworth', 'Kif', 'Jar Jar Binks', 'R2D2'].randomize();
			dps = ['Asuka Langley', 'Chewy', 'Fry', 'Han Solo', 'Leela', 'Luke Skywalker', 'Nibbler', 'Shinji Ikari', 'Zoidberg'].randomize();
		} else {
			healers = ['Anti-Spiral', 'Gendo Ikari', 'Kaworu Nagisa'].randomize();
			tanks = ['Jabba the Hut', 'Lilith', 'Lrrr', 'Mommy'].randomize();
			supports = ['Bobba Fett', 'Zapp Brannigan'].randomize();
			dps = ['An angel', 'Darth Vader', 'Emperor Palpatine', 'Fender', 'Storm Trooper'].randomize();
		}
		var pool = [healers[0], tanks[0], dps[0], supports[0], dps[1], supports[1]];
		var sets = {
			'Amy': {species: 'Jynx', role: 'healer', evs: {spa:200, def:252, spd:56}},
			'Princess Leia': {species: 'Gardevoir', gender: 'F', role: 'healer', evs: {spa:200, def:200, spd:56, spe:52}},
			'Scruffy': {species: 'Alakazam', gender: 'M', role: 'healer', evs: {spa:4, def:248, spd:248, spe: 8}},
			'Yoda': {species: 'Celebi', gender: 'M', role: 'healer', evs: {spa:184, def:56, spd:252, spe:16}},
			'Bender': {species: 'Registeel', gender: 'M', role: 'tank', evs: {hp:252, def:248, spd:4, spe:4}},
			'Gurren Lagann': {species: 'Golurk', gender: 'N', role: 'tank', evs: {spa:4, def:232, spd:4, spe:20}},
			'Lagann': {species: 'Golett', gender: 'N', role: 'tank', evs: {hp:236, def:128, spd:128, spe:16}},
			'Rei Ayanami': {species: 'Palkia', gender: 'F', role: 'tank', evs: {hp:200, def:154, spd:130, spe:24}},
			'Slurms McKenzie': {species: 'Slugma', gender: 'M', role: 'tank', evs: {hp:100, def:204, spd:204}},
			'C3PO': {species: 'Regirock', gender: 'N', role: 'support', evs: {hp:252, def:248, spd:4, spe:4}},
			'Hermes': {species: 'Scrafty', gender: 'M', role: 'support', evs: {hp:252, def:152, spd:4, spe:100}},
			'Professor Farnsworth': {species: 'Mr. Mime', gender: 'M', role: 'support', evs: {hp:4, def:252, spd:252}},
			'Kif': {species: 'Elgyem', gender: 'N', role: 'support', evs: {hp:252, def:248, spd:4, spe:4}},
			'Jar Jar Binks': {species: 'Heliolisk', gender: 'N', role: 'support', evs: {hp:4, def:152, spd:252, spe:100}},
			'R2D2': {species: 'Regigigas', gender: 'N', role: 'support', evs: {hp:252, def:208, spd:4, spe:44}},
			'Asuka Langley': {species: 'Groudon', gender: 'F', role: 'dps', evs: {spa:104, atk:252, spe:152}},
			'Chewy': {species: 'Ursaring', gender: 'N', role: 'dps', evs: {spa:252, atk:252, spe:4}},
			'Fry': {species: 'Magmar', gender: 'M', role: 'dps', evs: {spa:252, atk:236, spe:20}},
			'Han Solo': {species: 'Sawk', gender: 'M', role: 'dps', evs: {spa:180, atk:224, spe:104}},
			'Leela': {species: 'Hitmonlee', gender: 'F', role: 'dps', evs: {spa:128, atk:132, spe:248}},
			'Luke Skywalker': {species: 'Throh', gender: 'M', role: 'dps', evs: {spa:252, atk:176, spe:80}},
			'Nibbler': {species: 'Monferno', gender: 'N', role: 'dps', evs: {spa:248, atk:252, spe:8}},
			'Shinji Ikari': {species: 'Dialga', gender: 'F', role: 'dps', evs: {spa:4, atk:252, spe:252}},
			'Zoidberg': {species: 'Clawitzer', gender: 'M', role: 'dps', shiny: true, evs: {spa:184, atk:184, spe:140}},
			'Anti-Spiral': {species: 'Bisharp', gender: 'N', role: 'healer', evs: {spa:56, def:200, spd:200, spe:52}},
			'Gendo Ikari': {species: 'Machoke', gender: 'M', role: 'healer', evs: {spa:252, def:128, spd:120, spe:8}},
			'Kaworu Nagisa': {species: 'Treecko', gender: 'N', role: 'healer', evs: {spa:4, def:236, spd:252, spe:16}},
			'Jabba the Hut': {species: 'Snorlax', gender: 'N', role: 'tank', evs: {hp:252, def:248, spd:4, spe:4}},
			'Lilith': {species: 'Xerneas', gender: 'F', role: 'tank', evs: {hp:236, def:4, spd:252, spe:16}},
			'Lrrr': {species: 'Muk', gender: 'M', role: 'tank', evs: {hp:232, def:128, spd:128, spe:20}},
			'Mommy': {species: 'Gothitelle', gender: 'F', role: 'tank', evs: {hp:100, def:200, spd:184, spe:24}},
			'Bobba Fett': {species: 'Genesect', gender: 'M', role: 'support', evs: {hp:252, def:100, spd:56, spe:96}},
			'Zapp Brannigan': {species: 'Delphox', gender: 'M', role: 'support', evs: {hp:252, def:56, spd:176, spe:20}},
			'An angel': {species: 'Yveltal', gender: 'N', role: 'dps', evs: {spa:252, atk:8, spe:248}},
			'Darth Vader': {species: 'Dusknoir', gender: 'M', role: 'dps', evs: {spa:252, atk:156, spe:100}},
			'Emperor Palpatine': {species: 'Cofagrigus', gender: 'M', role: 'dps', evs: {spa:252, atk:208, spe:48}},
			'Fender': {species: 'Toxicroak', gender: 'M', role: 'dps', evs: {spa:252, atk:252, spe:4}},
			'Storm Trooper': {species: 'Raticate', gender: 'M', role: 'dps', evs: {spa:248, atk:252, spe:8}}
		};
		var movesets = {
			'healer': [
				['softboiled', 'icebeam', 'reflect', 'holdhands'],
				['softboiled', 'icebeam', 'luckychant', 'holdhands'],
				['softboiled', 'icebeam', 'reflect', 'aromaticmist']
			],
			'tank': [
				['followme', 'meditate', 'helpinghand', 'seismictoss'],
				['followme', 'endure', 'withdraw', 'seismictoss'],
				['followme', 'meditate', 'endure', 'seismictoss'],
				['meditate', 'helpinghand', 'protect', 'seismictoss'],
				['meditate', 'withdraw', 'protect', 'endure']
			],
			'support': [
				['recover', 'acupressure', 'healbell', 'withdraw'],
				['spite', 'fakeout', 'matblock', 'withdraw'],
				['recover', 'acupressure', 'spite', 'healbell'],
				['recover', 'acupressure', 'healbell', 'fakeout'],
				['acupressure', 'spite', 'healbell', 'matblock'],
				['acupressure', 'aircutter', 'healbell', 'matblock']
			],
			'dps': [
				['fireblast', 'flamethrower', 'aircutter', 'freezeshock'],
				['freezeshock', 'icebeam', 'aircutter', 'muddywater'],
				['thunderbolt', 'thunder', 'aircutter', 'freezeshock'],
				['toxic', 'leechseed', 'muddywater', 'aircutter'],
				['furyswipes', 'scratch', 'slash', 'smog']
			]
		};
		for (var i = 0; i < 6; i++) {
			var set = sets[pool[i]];
			set.level = 100;
			set.name = pool[i];
			set.moves = movesets[set.role][this.random(movesets[set.role].length)];
			team.push(set);
		}

		return team;
	},
	pokemon: {
		runImmunity: function (type, message) {
			return true;
		}
	},
	getDamage: function (pokemon, target, move, suppressMessages) {
		if (typeof move === 'string') move = this.getMove(move);

		if (typeof move === 'number') move = {
			basePower: move,
			type: '???',
			category: 'Physical',
			flags: {}
		};

		if (move.damageCallback) {
			return move.damageCallback.call(this, pokemon, target);
		}
		if (move.damage === 'level') {
			return pokemon.level;
		}
		if (move.damage) {
			return move.damage;
		}

		if (!move) move = {};
		if (!move.type) move.type = '???';
		var type = move.type;
		var category = this.getCategory(move);
		var defensiveCategory = move.defensiveCategory || category;

		var basePower = move.basePower;
		if (move.basePowerCallback) {
			basePower = move.basePowerCallback.call(this, pokemon, target, move);
		}
		if (!basePower) {
			if (basePower === 0) return; // returning undefined means not dealing damage
			return basePower;
		}
		basePower = this.clampIntRange(basePower, 1);
		basePower = this.runEvent('BasePower', pokemon, target, move, basePower, true);

		if (!basePower) return 0;
		basePower = this.clampIntRange(basePower, 1);

		var level = pokemon.level;
		var attacker = pokemon;
		var defender = target;
		var attackStat = category === 'Physical' ? 'atk' : 'spa';
		var defenseStat = defensiveCategory === 'Physical' ? 'def' : 'spd';
		var statTable = {atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe'};
		var attack;
		var defense;
		var atkBoosts = move.useTargetOffensive ? defender.boosts[attackStat] : attacker.boosts[attackStat];
		var defBoosts = move.useSourceDefensive ? attacker.boosts[defenseStat] : defender.boosts[defenseStat];
		var ignoreNegativeOffensive = !!move.ignoreNegativeOffensive;
		var ignorePositiveDefensive = !!move.ignorePositiveDefensive;

		if (move.useTargetOffensive) attack = defender.calculateStat(attackStat, atkBoosts);
		else attack = attacker.calculateStat(attackStat, atkBoosts);

		if (move.useSourceDefensive) defense = attacker.calculateStat(defenseStat, defBoosts);
		else defense = defender.calculateStat(defenseStat, defBoosts);

		// Apply Stat Modifiers
		attack = this.runEvent('Modify' + statTable[attackStat], attacker, defender, move, attack);
		defense = this.runEvent('Modify' + statTable[defenseStat], defender, attacker, move, defense);

		// In this mod, basePower is the %HP of the caster that is used on the damage calcualtion.
		//var baseDamage = Math.floor(Math.floor(Math.floor(2 * level / 5 + 2) * basePower * attack / defense) / 50) + 2;
		var baseDamage = Math.floor(pokemon.maxhp * basePower / 100);

		// Now this is varied by stats slightly.
		baseDamage += Math.floor(baseDamage * (attack - defense) / 100);

		// Randomizer. Doesn't change much.
		baseDamage = Math.floor(baseDamage * (90 + this.random(11)) / 100);

		if (pokemon.volatiles['chilled']) {
			baseDamage = Math.floor(baseDamage * 0.9);
		}

		// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
		baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

		// Minimum is 1
		if (basePower && !Math.floor(baseDamage)) {
			return 1;
		}

		return Math.floor(baseDamage);
	}
};
