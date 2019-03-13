'use strict';

class RandomTeams extends Dex.ModdedDex {
	randomSeasonalMay2015Team(side) {
		let team = [];
		let healers, tanks, supports, dps = [];
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
		let pool = [healers[0], tanks[0], dps[0], supports[0], dps[1], supports[1]];
		let sets = {
			'Amy': {species: 'Jynx', role: 'healer', evs: {spa: 200, def: 252, spd: 56}},
			'Princess Leia': {species: 'Gardevoir', gender: 'F', role: 'healer', evs: {spa: 200, def: 200, spd: 56, spe: 52}},
			'Scruffy': {species: 'Alakazam', gender: 'M', role: 'healer', evs: {spa: 4, def: 248, spd: 248, spe: 8}},
			'Yoda': {species: 'Celebi', gender: 'M', role: 'healer', evs: {spa: 184, def: 56, spd: 252, spe: 16}},
			'Bender': {species: 'Registeel', gender: 'M', role: 'tank', evs: {hp: 252, def: 248, spd: 4, spe: 4}},
			'Gurren Lagann': {species: 'Golurk', gender: 'N', role: 'tank', evs: {spa: 4, def: 232, spd: 4, spe: 20}},
			'Lagann': {species: 'Golett', gender: 'N', role: 'tank', evs: {hp: 236, def: 128, spd: 128, spe: 16}},
			'Rei Ayanami': {species: 'Palkia', gender: 'F', role: 'tank', evs: {hp: 200, def: 154, spd: 130, spe: 24}},
			'Slurms McKenzie': {species: 'Slugma', gender: 'M', role: 'tank', evs: {hp: 100, def: 204, spd: 204}},
			'C3PO': {species: 'Regirock', gender: 'N', role: 'support', evs: {hp: 252, def: 248, spd: 4, spe: 4}},
			'Hermes': {species: 'Scrafty', gender: 'M', role: 'support', evs: {hp: 252, def: 152, spd: 4, spe: 100}},
			'Professor Farnsworth': {species: 'Mr. Mime', gender: 'M', role: 'support', evs: {hp: 4, def: 252, spd: 252}},
			'Kif': {species: 'Elgyem', gender: 'N', role: 'support', evs: {hp: 252, def: 248, spd: 4, spe: 4}},
			'Jar Jar Binks': {species: 'Heliolisk', gender: 'N', role: 'support', evs: {hp: 4, def: 152, spd: 252, spe: 100}},
			'R2D2': {species: 'Regigigas', gender: 'N', role: 'support', evs: {hp: 252, def: 208, spd: 4, spe: 44}},
			'Asuka Langley': {species: 'Groudon', gender: 'F', role: 'dps', evs: {spa: 104, atk: 252, spe: 152}},
			'Chewy': {species: 'Ursaring', gender: 'N', role: 'dps', evs: {spa: 252, atk: 252, spe: 4}},
			'Fry': {species: 'Magmar', gender: 'M', role: 'dps', evs: {spa: 252, atk: 236, spe: 20}},
			'Han Solo': {species: 'Sawk', gender: 'M', role: 'dps', evs: {spa: 180, atk: 224, spe: 104}},
			'Leela': {species: 'Hitmonlee', gender: 'F', role: 'dps', evs: {spa: 128, atk: 132, spe: 248}},
			'Luke Skywalker': {species: 'Throh', gender: 'M', role: 'dps', evs: {spa: 252, atk: 176, spe: 80}},
			'Nibbler': {species: 'Monferno', gender: 'N', role: 'dps', evs: {spa: 248, atk: 252, spe: 8}},
			'Shinji Ikari': {species: 'Dialga', gender: 'F', role: 'dps', evs: {spa: 4, atk: 252, spe: 252}},
			'Zoidberg': {species: 'Clawitzer', gender: 'M', role: 'dps', shiny: true, evs: {spa: 184, atk: 184, spe: 140}},
			'Anti-Spiral': {species: 'Bisharp', gender: 'N', role: 'healer', evs: {spa: 56, def: 200, spd: 200, spe: 52}},
			'Gendo Ikari': {species: 'Machoke', gender: 'M', role: 'healer', evs: {spa: 252, def: 128, spd: 120, spe: 8}},
			'Kaworu Nagisa': {species: 'Treecko', gender: 'N', role: 'healer', evs: {spa: 4, def: 236, spd: 252, spe: 16}},
			'Jabba the Hut': {species: 'Snorlax', gender: 'N', role: 'tank', evs: {hp: 252, def: 248, spd: 4, spe: 4}},
			'Lilith': {species: 'Xerneas', gender: 'F', role: 'tank', evs: {hp: 236, def: 4, spd: 252, spe: 16}},
			'Lrrr': {species: 'Muk', gender: 'M', role: 'tank', evs: {hp: 232, def: 128, spd: 128, spe: 20}},
			'Mommy': {species: 'Gothitelle', gender: 'F', role: 'tank', evs: {hp: 100, def: 200, spd: 184, spe: 24}},
			'Bobba Fett': {species: 'Genesect', gender: 'M', role: 'support', evs: {hp: 252, def: 100, spd: 56, spe: 96}},
			'Zapp Brannigan': {species: 'Delphox', gender: 'M', role: 'support', evs: {hp: 252, def: 56, spd: 176, spe: 20}},
			'An angel': {species: 'Yveltal', gender: 'N', role: 'dps', evs: {spa: 252, atk: 8, spe: 248}},
			'Darth Vader': {species: 'Dusknoir', gender: 'M', role: 'dps', evs: {spa: 252, atk: 156, spe: 100}},
			'Emperor Palpatine': {species: 'Cofagrigus', gender: 'M', role: 'dps', evs: {spa: 252, atk: 208, spe: 48}},
			'Fender': {species: 'Toxicroak', gender: 'M', role: 'dps', evs: {spa: 252, atk: 252, spe: 4}},
			'Storm Trooper': {species: 'Raticate', gender: 'M', role: 'dps', evs: {spa: 248, atk: 252, spe: 8}},
		};
		let movesets = {
			'healer': [
				['softboiled', 'icebeam', 'reflect', 'holdhands'],
				['softboiled', 'icebeam', 'luckychant', 'holdhands'],
				['softboiled', 'icebeam', 'reflect', 'aromaticmist'],
			],
			'tank': [
				['followme', 'meditate', 'helpinghand', 'seismictoss'],
				['followme', 'endure', 'withdraw', 'seismictoss'],
				['followme', 'meditate', 'endure', 'seismictoss'],
				['meditate', 'helpinghand', 'protect', 'seismictoss'],
				['meditate', 'withdraw', 'protect', 'endure'],
			],
			'support': [
				['recover', 'acupressure', 'healbell', 'withdraw'],
				['spite', 'fakeout', 'matblock', 'withdraw'],
				['recover', 'acupressure', 'spite', 'healbell'],
				['recover', 'acupressure', 'healbell', 'fakeout'],
				['acupressure', 'spite', 'healbell', 'matblock'],
				['acupressure', 'aircutter', 'healbell', 'matblock'],
			],
			'dps': [
				['fireblast', 'flamethrower', 'aircutter', 'freezeshock'],
				['freezeshock', 'icebeam', 'aircutter', 'muddywater'],
				['thunderbolt', 'thunder', 'aircutter', 'freezeshock'],
				['toxic', 'leechseed', 'muddywater', 'aircutter'],
				['furyswipes', 'scratch', 'slash', 'smog'],
			],
		};
		for (let i = 0; i < 6; i++) {
			let set = sets[pool[i]];
			set.level = 100;
			set.name = pool[i];
			set.moves = movesets[set.role][this.random(movesets[set.role].length)];
			team.push(set);
		}

		return team;
	}
}
