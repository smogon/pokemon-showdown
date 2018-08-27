'use strict';

/** @typedef {{[name: string]: SSBSet}} SSBSets */
/**
 * @typedef {Object} SSBSet
 * @property {string} species
 * @property {string | string[]} ability
 * @property {string | string[]} item
 * @property {GenderName} gender
 * @property {(string | string[])[]} moves
 * @property {string} signatureMove
 * @property {{hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number}=} evs
 * @property {{hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number}=} ivs
 * @property {string | string[]} nature
 * @property {number=} level
 * @property {boolean=} shiny
 */

const RandomTeams = require('../../data/random-teams');

class RandomStaffBrosTeams extends RandomTeams {
	randomStaffBrosTeam() {
		/** @type {PokemonSet[]} */
		let team = [];
		/** @type {SSBSets} */
		let sets = {
			/*
			// Example:
			'Username': {
				species: 'Species', ability: 'Ability', item: 'Item', gender: '',
				moves: ['Move Name', ['Move Name', 'Move Name']],
				signatureMove: 'Move Name',
				evs: {stat: number}, ivs: {stat: number}, nature: 'Nature', level: 100, shiny: false,
			},
			// Species, ability, and item need to be captialized properly ex: Ludicolo, Swift Swim, Life Orb
			// Gender can be M, F, N, or left as an empty string
			// each slot in moves needs to be a string (the move name, captialized properly ex: Hydro Pump), or an array of strings (also move names)
			// signatureMove also needs to be capitalized properly ex: Scripting
			// You can skip Evs (defaults to 82 all) and/or Ivs (defaults to 31 all), or just skip part of the Evs (skipped evs are 0) and/or Ivs (skipped Ivs are 31)
			// You can also skip shiny, defaults to false. Level can be skipped (defaults to 100).
			// Nature needs to be a valid nature with the first letter capitalized ex: Modest
			*/
			// Please keep sets organized alphabetically based on staff member name!
			'Aelita': {
				species: 'Porygon-Z', ability: 'Protean', item: ['Life Orb'], gender: 'F',
				moves: [['Boomburst', 'Moonblast'], 'Blue Flare', 'Chatter'],
				signatureMove: 'Energy Field',
				evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Modest',
			},
			'ant': {
				species: 'Durant', ability: 'Flash Fire', item: 'Leftovers', gender: 'F',
				moves: ['King\'s Shield', 'U-turn', 'Pursuit'],
				signatureMove: 'TRU ANT',
				evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
			},
			'Akir': {
				species: 'Parasect', ability: 'Dry Skin', item: 'Leftovers', gender: 'M',
				moves: ['Spore', 'Leech Life', ['Toxic', 'Stun Spore', 'Sacred Fire']],
				signatureMove: 'Compost',
				evs: {hp: 248, atk: 8, spd: 252}, nature: 'Careful',
			},
			'Beowulf': {
				species: 'Beedrill', ability: ['Download', 'Speed Boost'], item: 'Beedrillite', gender: 'M',
				moves: ['Spiky Shield', 'Gunk Shot', ['Bolt Strike', 'Diamond Storm', 'Sacred Fire']],
				signatureMove: 'Buzzing of the Swarm',
				evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
			},
			'cc': {
				species: 'Cobalion', ability: 'Lurking', item: ['Shuca Berry', 'Chople Berry', 'Fightinium Z'], gender: 'M',
				moves: ['Focus Blast', 'Flash Cannon', ['Thunderbolt', 'Ice Beam']],
				signatureMove: 'Restarting Router',
				evs: {def: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
			},
			'Cerberax': {
				species: 'Wailord', ability: 'Levitate', item: 'Figy Berry', gender: 'F',
				moves: ['Shift Gear', 'Waterfall', 'Recover'],
				signatureMove: 'Blimp Crash',
				evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant',
			},
			'Chloe': {
				species: 'Tapu Fini', ability: 'Prankster', item: 'Light Clay', gender: 'F',
				moves: ['Fleur Cannon', 'Parting Shot', ['Taunt', 'Topsy Turvy']],
				signatureMove: 'beskyttelsesnet',
				evs: {hp: 248, def: 252, spa: 8}, ivs: {atk: 0}, nature: 'Bold',
			},
			'deg': {
				species: 'Gengar', ability: 'Bad Dreams', item: 'Gengarite', gender: 'M',
				moves: [['Hex', 'Shadow Ball'], 'Sludge Wave', 'Focus Blast'],
				signatureMove: 'Lucid Dreams',
				evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: ['Modest', 'Timid'],
			},
			'DragonWhale': {
				species: 'Garchomp', ability: 'Beast Boost', item: 'Groundium Z', gender: 'M',
				moves: ['Earthquake', 'Dragon Rush', 'Diamond Storm'],
				signatureMove: 'Earth\'s Blessing',
				evs: {hp: 112, atk: 144, spe: 252}, nature: 'Jolly',
			},
			'E4 Flint': {
				species: 'Steelix', ability: 'Sturdy', item: 'Magmarizer', gender: 'M', // Ability is changed on mega evo, which is instant for this set
				moves: ['Sunsteel Strike', 'Thousand Arrows', ['Dragon Tail', 'Diamond Storm', 'V-create', 'V-create']], // V-create listed twice for 50% chance to get it
				signatureMove: 'Fang of the Fire King',
				evs: {hp: 252, atk: 36, def: 100, spd: 120}, nature: 'Adament',
			},
			'Eien': {
				species: 'Mew', ability: 'Psychic Surge', item: 'Terrain Extender', gender: 'N',
				moves: ['Calm Mind', 'Psychic', 'Psyshock'],
				signatureMove: 'Ancestral Power',
				evs: {hp: 252, spd: 4, spe: 252}, nature: 'Timid',
			},
			'eternally': {
				species: 'Ducklett', ability: 'Primordial Sea', item: 'Eviolite', gender: 'M',
				moves: ['Surf', 'Hurricane', 'Roost'],
				signatureMove: 'Quack',
				evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
			},
			'EV': {
				species: 'Eevee', ability: 'Anticipation', item: 'Leftovers', gender: 'M',
				moves: ['Baton Pass', 'Wish', 'Protect'],
				signatureMove: 'Evoblast',
				evs: {hp: 252, spe: 252}, nature: 'Serious',
			},
			'Hippopotas': {
				species: 'Hippopotas', ability: 'Regenerator', item: 'Eviolite', gender: 'N',
				moves: ['Stealth Rock', 'Spikes', 'Toxic Spikes', 'Sticky Web'],
				signatureMove: 'Hazard Pass',
				evs: {hp: 252, def: 252, spd: 4}, ivs: {atk: 0, spa: 0}, nature: 'Bold',
			},
			'HoeenHero': {
				species: 'Ludicolo', ability: 'Swift Swim', item: 'Damp Rock', gender: 'M',
				moves: [['Hydro Pump', 'Scald'], 'Giga Drain', 'Ice Beam'],
				signatureMove: 'Scripting',
				evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Modest',
			},
			'Iyarito': {
				species: 'Vaporeon', ability: 'Poison Heal', item: 'Leftovers', gender: 'F',
				moves: ['Scald', 'Wish', 'Toxic'],
				signatureMove: 'Víbora',
				evs: {hp: 252, def: 220, spd: 36}, nature: 'Bold', shiny: true,
			},
			'Kalalokki': {
				species: 'Wingull', ability: 'Swift Swim', item: ['Waterium Z', 'Flyinium Z', 'Electrium Z'], gender: 'M',
				moves: ['Water Spout', 'Hurricane', 'Thunder'],
				signatureMove: 'Maelström',
				evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Modest',
			},
			'Kay': {
				species: 'Inkay', ability: 'Contrary', item: 'Eviolite', gender: 'M',
				moves: ['Power Trip', 'Rest', 'Sleep Talk'],
				signatureMove: 'Inked',
				evs: {hp: 252, atk: 144, spe: 112}, nature: 'Adament',
			},
			'KingSwordYT': {
				species: 'Pangoro', ability: 'Kung Fu Panda', item: 'Life Orb', gender: 'M',
				moves: ['Ice Punch', 'Bullet Punch', 'Knock Off'],
				signatureMove: 'Dragon Warrior Touch',
				evs: {atk: 252, hp: 4, spe: 252}, nature: 'Jolly',
			},
			'Level 51': {
				species: 'Porygon2', ability: 'Parental Bond', item: 'Eviolite', gender: 'N',
				moves: ['Recover', 'Seismic Toss', ['Cosmic Power', 'Aqua Ring']],
				signatureMove: 'Next Level Strats',
				evs: {hp: 236, def: 220, spd: 48, spe: 4}, ivs: {atk: 0}, nature: 'Calm',
			},
			'LifeisDANK': {
				species: 'Delibird', ability: 'Mountaineer', item: 'Focus Sash', gender: 'F',
				moves: ['Ice Shard', 'Return', 'Explosion'],
				signatureMove: 'Bar Fight',
				evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
			},
			'MacChaeger': {
				species: 'Mantyke', ability: 'Water Veil', item: ['Life Orb', 'Normalium Z'], gender: 'M',
				moves: ['Scald', 'Clear Smog', 'Sleep Talk'],
				signatureMove: 'Nap Time',
				evs: {hp: 248, spa: 84, spe: 176}, ivs: {atk: 0}, nature: 'Modest',
			},
			'martha': {
				species: 'Diancie', ability: 'Pixilate', item: 'Diancite', gender: 'F',
				moves: ['BoomBurst', ['Fire Blast', 'Earth Power'], 'Photon Geyser'],
				signatureMove: 'Crystal Boost',
				evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
			},
			'Marty': {
				species: 'Silvally', ability: 'RKS System', item: 'Normal Gem', gender: 'N',
				moves: ['Parting Shot', 'Explosion', 'Extreme Speed'],
				signatureMove: 'Type Analysis',
				evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
			},
			'Megazard': {
				species: 'Exeggutor-Alola', ability: 'Stand Up Tall', item: 'Leftovers', gender: 'M',
				moves: ['Strength Sap', 'Growth', 'Stockpile'],
				signatureMove: 'Tipping Over',
				evs: {hp: 252, atk: 252, def: 4}, ivs: {spe: 0}, nature: 'Adament',
			},
			'moo': {
				species: 'Miltank', ability: 'Scrappy', item: 'Life Orb', gender: 'M',
				moves: ['Extreme Speed', 'Rapid Spin', 'Close Combat'],
				signatureMove: 'Protein Shake',
				evs: {hp: 252, def: 4, spd: 252}, nature: 'Careful',
			},
			'Quite Quiet': {
				species: 'Misdreavus', ability: 'Levitate', item: 'Leftovers', gender: 'F',
				moves: [['Moongeist Beam', 'Shadow Ball', 'Night Shade'], 'Recover', ['Heal Bell', 'Taunt']],
				signatureMove: 'Spooky Transform',
				evs: {hp: 252, def: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
			},
			'Teremiare': {
				species: 'Zorua', ability: 'Not Prankster', item: 'Eject Button', gender: 'N',
				moves: ['Encore', 'Taunt', 'Lunar Dance'],
				signatureMove: 'No Fun Zone',
				evs: {hp: 252, def: 136, spd: 120}, ivs: {atk: 0}, nature: 'Bold', shiny: true,
			},
			'The Immortal': {
				species: 'Buzzwole', ability: 'Beast Boost 2', item: 'Assault Vest', gender: 'N', // confirm with TI
				moves: ['Leech Life', 'Plasma Fists', 'Ice Punch'],
				signatureMove: 'Ultra Succ',
				evs: {atk: 252, hp: 252, spd: 4}, nature: 'Adamant',
			},
			'Tiksi': {
				species: 'Cradily', ability: 'Sand Stream', item: 'Tiksium Z', gender: 'M',
				moves: ['Shore Up', 'Horn Leech', 'Curse'],
				signatureMove: 'Rock Slide', // Base move for custom Z-move
				evs: {hp: 252, atk: 252, spd: 4}, nature: 'Adament',
			},
			'torkool': {
				species: 'Torkoal', ability: 'Deflective Shell', item: 'Leftovers', gender: 'M',
				moves: ['Morning Sun', ['Lava Plume', 'Magma Storm'], 'Toxic'],
				signatureMove: 'Smoke Bomb',
				evs: {hp: 248, spa: 8, spd: 252}, nature: 'Calm',
			},
			'Trickster': {
				species: 'Hoopa', ability: 'Interdimensional', item: 'Life Orb', gender: 'M',
				moves: ['Inferno', 'Zap Cannon', ['Roost', 'Grasswhistle']],
				signatureMove: 'Mini Singularity',
				evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
			},
			'Yuki': {
				species: 'Ninetales-Alola', ability: 'Snow Storm', item: 'Focus Sash', gender: 'F',
				moves: ['Blizzard', 'Moonblast', 'Aurora Veil'],
				signatureMove: 'Cutie Escape',
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
			},
		};
		let pool = Object.keys(sets);
		while (pool.length && team.length < 6) {
			let name = '';
			// DEBUG CODE
			let debug = false; // Programmers - Toggle this to use the code below
			if (team.length === 1 && debug) {
				// Force a specific set to appear for testing
				name = 'Yuki';
				if (pool.indexOf(name) > -1) pool.splice(pool.indexOf(name), 1);
			} else {
				name = this.sampleNoReplace(pool);
			}
			let ssbSet = sets[name];
			/** @type {PokemonSet} */
			let set = {
				name: name,
				species: ssbSet.species,
				item: Array.isArray(ssbSet.item) ? this.sampleNoReplace(ssbSet.item) : ssbSet.item,
				ability: Array.isArray(ssbSet.ability) ? this.sampleNoReplace(ssbSet.ability) : ssbSet.ability,
				moves: [],
				nature: Array.isArray(ssbSet.nature) ? this.sampleNoReplace(ssbSet.nature) : ssbSet.nature,
				gender: ssbSet.gender,
				evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
				ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
				level: ssbSet.level || 100,
				shiny: ssbSet.shiny,
			};
			if (ssbSet.ivs) {
				for (let iv in ssbSet.ivs) {
					// IVs from the set override the default of 31, assume the hardcoded IVs are legal
					// @ts-ignore StatsTable has no index signature
					set.ivs[iv] = ssbSet.ivs[iv];
				}
			}
			if (ssbSet.evs) {
				for (let ev in ssbSet.evs) {
					// EVs from the set override the default of 0, assume the hardcoded EVs are legal
					// @ts-ignore StatsTable has no index signature
					set.evs[ev] = ssbSet.evs[ev];
				}
			} else {
				set.evs = {hp: 82, atk: 82, def: 82, spa: 82, spd: 82, spe: 82};
			}
			while (set.moves.length < 3 && ssbSet.moves.length > 0) {
				let move = this.sampleNoReplace(ssbSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				set.moves.push(move);
			}
			set.moves.push(ssbSet.signatureMove);
			team.push(set);
		}
		return team;
	}
}

module.exports = RandomStaffBrosTeams;
