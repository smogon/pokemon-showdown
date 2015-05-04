exports.BattleScripts = {
	init: function () {
		var tankStats = {hp:90, atk:30, def:120, spa:130, spd:120, spe:50};
		var healerStats = {hp:50, atk:10, def:100, spa:80, spd:100, spe:10};
		var supportStats = {hp:75, atk:50, def:80, spa:50, spd:80, spe:100};
		var dpsStats = {hp:65, atk:130, def:60, spa:130, spd:60, spe:150};
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
			'Amy': {species: 'Jynx', role: 'healer'},
			'Princess Leia': {species: 'Gardevoir', gender: 'F', role: 'healer'},
			'Scruffy': {species: 'Alakazam', gender: 'M', role: 'healer'},
			'Yoda': {species: 'Celebi', gender: 'M', role: 'healer'},
			'Bender': {species: 'Registeel', gender: 'M', role: 'tank'},
			'Gurren Lagann': {species: 'Golurk', gender: 'N', role: 'tank'},
			'Lagann': {species: 'Golett', gender: 'N', role: 'tank'},
			'Rei Ayanami': {species: 'Palkia', gender: 'F', role: 'tank'},
			'Slurms McKenzie': {species: 'Slugma', gender: 'M', role: 'tank'},
			'C3PO': {species: 'Regirock', gender: 'N', role: 'support'},
			'Hermes': {species: 'Scrafty', gender: 'M', role: 'support'},
			'Professor Farnsworth': {species: 'Mr. Mime', gender: 'M', role: 'support'},
			'Kif': {species: 'Elgyem', gender: 'N', role: 'support'},
			'Jar Jar Binks': {species: 'Heliolisk', gender: 'N', role: 'support'},
			'R2D2': {species: 'Regigigas', gender: 'N', role: 'support'},
			'Asuka Langley': {species: 'Groudon', gender: 'F', role: 'dps'},
			'Chewy': {species: 'Ursaring', gender: 'N', role: 'dps'},
			'Fry': {species: 'Magmar', gender: 'M', role: 'dps'},
			'Han Solo': {species: 'Sawk', gender: 'M', role: 'dps'},
			'Leela': {species: 'Hitmonlee', gender: 'F', role: 'dps'},
			'Luke Skywalker': {species: 'Throh', gender: 'M', role: 'dps'},
			'Nibbler': {species: 'Monferno', gender: 'N', role: 'dps'},
			'Shinji Ikari': {species: 'Dialga', gender: 'F', role: 'dps'},
			'Zoidberg': {species: 'Clawitzer', gender: 'M', role: 'dps', shiny: true},
			'Anti-Spiral': {species: 'Bisharp', gender: 'N', role: 'healer'},
			'Gendo Ikari': {species: 'Machoke', gender: 'M', role: 'healer'},
			'Kaworu Nagisa': {species: 'Treecko', gender: 'N', role: 'healer'},
			'Jabba the Hut': {species: 'Snorlax', gender: 'N', role: 'tank'},
			'Lilith': {species: 'Xerneas', gender: 'F', role: 'tank'},
			'Lrrr': {species: 'Muk', gender: 'M', role: 'tank'},
			'Mommy': {species: 'Gothitelle', gender: 'F', role: 'tank'},
			'Bobba Fett': {species: 'Genesect', gender: 'M', role: 'support'},
			'Zapp Brannigan': {species: 'Delphox', gender: 'M', role: 'support'},
			'An angel': {species: 'Yveltal', gender: 'N', role: 'dps'},
			'Darth Vader': {species: 'Dusknoir', gender: 'M', role: 'dps'},
			'Emperor Palpatine': {species: 'Cofagrigus', gender: 'M', role: 'dps'},
			'Fender': {species: 'Toxicroak', gender: 'M', role: 'dps'},
			'Storm Trooper': {species: 'Raticate', gender: 'M', role: 'dps'}
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
				['meditate', 'helpinghand', 'protect', 'seismictoss']
			],
			'support': [
				['recover', 'acupressure', 'healbell', 'withdraw'],
				['spite', 'fakeout', 'protect', 'withdraw'],
				['recover', 'acupressure', 'spite', 'healbell'],
				['recover', 'acupressure', 'healbell', 'fakeout'],
				['acupressure', 'spite', 'healbell', 'protect']
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
		baseDamage += Math.floor(baseDamage * (attack - defense * 0.9) / 100);

		// Randomizer. Doesn't change much.
		baseDamage = Math.floor(baseDamage * (95 + this.random(6)) / 100);

		if (pokemon.volatiles['chilled']) {
			baseDamage = Math.floor(baseDamage * 0.9);
		}

		// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
		baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

		// Minimum is 1
		if (basePower && !Math.floor(baseDamage)) {
			return 1;
		}

		// Check for damage
		baseDamage = this.runEvent('Damage', target, pokemon, move, baseDamage);

		return Math.floor(baseDamage);
	}
};
