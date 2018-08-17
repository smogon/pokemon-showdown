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
 * @property {string} nature
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
				species: 'Species',  ability: 'Ability', item: 'Item', gender: '',
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
			'eternally': {
				species: 'Ducklett', ability: 'Primordial Sea', item: 'Eviolite', gender: 'M',
				moves: ['Surf', 'Hurricane', 'Roost'],
				signatureMove: 'Quack',
				evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
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
			'MacChaeger': {
				species: 'Mantyke', ability: 'Water Veil', item: ['Life Orb', 'Normalium Z'], gender: 'M',
				moves: ['Scald', 'Clear Smog', 'Sleep Talk'],
				signatureMove: 'Nap Time',
				evs: {hp: 248, spa: 84, spe: 176}, ivs: {atk: 0}, nature: 'Modest',
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
			'torkool': {
				species: 'Torkoal', ability: 'Deflective Shell', item: 'Leftovers', gender: 'M',
				moves: ['Morning Sun', ['Lava Plume', 'Magma Storm'], 'Toxic'],
				signatureMove: 'Smoke Bomb',
				evs: {hp: 248, spa: 8, spd: 252}, nature: 'Calm',
			},
		};
		let pool = Object.keys(sets);
		while (pool.length && team.length < 6) {
			let name = this.sampleNoReplace(pool);
			let ssbSet = sets[name];
			/** @type {PokemonSet} */
			let set = {
				name: name,
				species: ssbSet.species,
				item: Array.isArray(ssbSet.item) ? this.sampleNoReplace(ssbSet.item) : ssbSet.item,
				ability: Array.isArray(ssbSet.ability) ? this.sampleNoReplace(ssbSet.ability) : ssbSet.ability,
				moves: [],
				nature: ssbSet.nature,
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
