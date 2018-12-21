'use strict';

const RandomTeams = require('../../data/random-teams');

class RandomPKLandTeams extends RandomTeams {
	randomPKLandTeam() {
		/** @type {PokemonSet[]} */
		let team = [];
		/** @type {Sets} */
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
			'Static': {
				species: 'Pikachu', ability: 'Keep It Steady', item: 'Zap Plate', gender: 'M',
				moves: [['Splishy Splash', 'Floaty Fall', 'Zippy Zap'], 'Nasty Plot', ['Thunderbolt', 'Grass Knot']],
				signatureMove: 'Pika Power!',
				evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest',
			},
			'Erika': {
				species: 'Eevee', ability: 'Quick Start', item: 'Leftovers', gender: 'F',
				moves: ['Wish', ['Agility', 'Swords Dance'], ['Flare Blitz', 'Aqua Tail', 'Wild Charge', 'Zen Headbutt', 'Foul Play', 'Ice Hammer', 'Wood Hammer', 'Play Rough']],
				signatureMove: 'Evo-Impact',
				evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
			},
			'Aqua': {
				species: 'Mew', ability: 'Primordial Sea', item: 'Leftovers', gender: 'M',
				moves: [['Origin Pulse', 'Psystrike', 'Freeze Dry', 'Ice Beam'], 'Recover', 'Calm Mind'],
				signatureMove: 'Aqua Sphere',
				evs: {hp: 252, def: 4, spd: 252}, nature: 'Calm', shiny: true,
			},
			'Mizzy': {
				species: 'Wigglytuff', ability: 'Neuroforce', item: 'Expert Belt', gender: 'F',
				moves: ['Dazzling Gleam', ['Ice Beam', 'Thunderbolt', 'Flamethrower'], 'Calm Mind'],
				signatureMove: 'Prism Rocket',
				evs: {hp: 252, spd: 4, spa: 252}, nature: 'Rash',
			},
			'Zena': {
				species: 'Zygarde', ability: 'Power Construct', item: 'Leftovers', gender: 'F',
				moves: [['Thousand Arrows', 'Thousand Waves', 'Core Enforcer'], 'Close Combat', ['Cosmic Power', 'Work Up', 'Noble Roar']],
				signatureMove: 'Titan Force',
				evs: {hp: 252, def: 4, atk: 252}, nature: 'Adamant',
			},
			'Kyle': {
				species: 'Cacturne', ability: 'Desert Cactus', item: 'Big Root', gender: 'M',
				moves: [['Ingrain', 'Cross Chop', 'Recover'], 'Seed Flare', ['Protect', 'Earthquake']],
				signatureMove: 'Desert Drain',
				evs: {hp: 252, atk: 4, spa: 252}, nature: 'Rash',
			},
			'Serene Star': {
				species: 'Sandslash-Alola', ability: 'Snow Power!', item: 'Icy Rock', gender: 'F',
				moves: [['Cross Chop', 'Zen Headbutt'], ['Ice Punch', 'Blizzard', 'Icicle Crash'], 'Liquidation'],
				signatureMove: 'Snow Dance',
				evs: {atk: 252, hp: 4, def: 252}, nature: 'Brave', shiny: true,
			},
			'Goby': {
				species: 'Dedenne', ability: 'Simple', item: 'Red Card', gender: 'M',
				moves: ['Dazzling Gleam', ['Calm Mind', 'Quiver Dance', 'Work Up'], ['Power Trip', 'Stored Power']],
				signatureMove: 'Electro Flash',
				evs: {atk: 252, spe: 4, spa: 252}, nature: 'Serious',
			},
			'The Hound': {
				species: 'Houndoom', ability: 'Dark Aura', item: 'Charcoal', gender: 'F',
				moves: [['Work Up', 'Dark Pulse'], ['Overheat', 'Flamethrower', 'Blue Flare'], 'Solar Beam'],
				signatureMove: 'Dark Flare',
				evs: {atk: 252, spe: 4, spa: 252}, nature: 'Modest',
			},
			'Felix': {
				species: 'Meowth-Alola', ability: 'Lucky Number Seven', item: 'Felixium Z', gender: 'M',
				moves: ['Baton Pass', ['Play Rough', 'Zen Headbutt'], ['Night Daze', 'Dark Pulse', 'Foul Play']],
				signatureMove: 'Metronome', // Base move for custom Z-move
				evs: {spe: 252, hp: 4, atk: 252}, nature: 'Docile',
			},
			'Chuck': {
				species: 'Skuntank', ability: 'Prankster', item: 'Air Balloon', gender: 'M',
				moves: ['Foul Play', 'Toxic', 'Leech Seed'],
				signatureMove: 'Frenzy Dance',
				evs: {atk: 252, hp: 4, spe: 252}, nature: 'Jolly',
			},
			'Abby': {
				species: 'Altaria', ability: 'Liquid Voice', item: 'Mystic Water', gender: 'F',
				moves: ['Hyper Voice', ['Dragon Pulse', 'Dragon Breath'], ['Quiver Dance', 'Calm Mind']],
				signatureMove: 'Mermaid Whirl',
				evs: {spa: 252, spd: 252, hp: 4}, nature: 'Rash',
			},
      'Nappa': {
				species: 'Gallade', ability: 'Hero\'s Will', item: 'Life Orb', gender: 'M',
				moves: [['Blaze Kick', 'Thunder Punch'], 'Psycho Cut', 'Shift Gear'],
				signatureMove: 'Hero\'s Sword',
				evs: {atk: 252, spe: 4, spa: 252}, nature: 'Adamant', shiny: true,
			},
			'Gidget': {
				species: 'Ditto', ability: 'Limber', item: 'Metal Powder', gender: 'F',
				moves: ['Transform', 'Baton Pass', 'Psych Up'],
				signatureMove: 'Gidgetblast',
				evs: {hp: 252, spa: 4, spe: 252}, nature: 'Timid',
			},
      'Sedna': {
				species: 'Marill', ability: 'Misty Surge', item: 'Terrain Extender', gender: 'F',
				moves: [['Play Rough', 'Dazzling Gleam'], 'Dragon Pulse', ['Aqua Tail', 'Surf']],
				signatureMove: 'Sky Dance',
				evs: {spa: 252, spe: 4, atk: 252}, nature: 'Quiet',
			},
			'Skyla': {
				species: 'Lugia', ability: 'Psychic Shield', item: 'Leftovers', gender: 'F',
				moves: ['Aeroblast', ['Glitzy Glow', 'Psychic'], ['Recover', 'Wish']],
				signatureMove: 'Lugia\'s Song',
				evs: {def: 252, spa: 4, spd: 252}, nature: 'Lax', shiny: true,
			},
			'Kris': {
				species: 'Mewtwo', ability: 'Chaos Innation', item: 'Mewtwonite Y', gender: 'F',
				moves: ['Dark Pulse', ['Thunderbolt', 'Ice Beam', 'Flamethrower'], ['Quiver Dance', 'Calm Mind']],
				signatureMove: 'Psycho Flash',
				evs: {spa: 252, spe: 252, hp: 4}, nature: 'Rash',
			},
			'Sheka': {
				species: 'Silvally', ability: 'RKS System', item: 'Normal Gem', gender: 'F',
				moves: [['Outrage', 'Play Rough'], ['Ice Beam', 'Thunderbolt', 'Flamethrower'], 'Extreme Speed'],
				signatureMove: 'Analyzing Colors',
				evs: {atk: 252, spe: 4, spa: 252}, nature: 'Serious',
			},
     'Leonas': {
				species: 'Serperior', ability: 'Contrary', item: 'Leftovers', gender: 'M',
				moves: [['V-Create', 'Dragon Ascent', 'Superpower'], ['Draco Meteor', 'Leaf Storm', 'Overheat'], ['Recover', 'Substitute']],
				signatureMove: 'Turn Over',
				evs: {spa: 252, spe: 4, atk: 252}, nature: 'Modest',
			},
			'Anabelle': {
				species: 'Starmie', ability: 'Psychic Surge', item: 'Terrain Extender', gender: 'F',
				moves: [['Psystrike', 'Psychic'], ['Ice Beam', 'Surf', 'Dazzling Gleam'], 'Water Pulse'],
				signatureMove: 'Fairy Pulse',
				evs: {spa: 252, spe: 4, spd: 252}, nature: 'Rash',
			},
			'Crystal': {
				species: 'Suicune', ability: 'Misty Guard', item: 'Sitrus Berry', gender: 'F',
				moves: [['Water Pulse', 'Surf'], ['Bouncy Bubble', 'Psychic', 'Dazzling Gleam'], 'Freeze Dry'],
				signatureMove: 'Crystal Boom',
				evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
			},
			'Speedy': {
				species: 'Jolteon', ability: 'Huge Power', item: 'Focus Sash', gender: 'M',
				moves: [['Extreme Speed', 'Quick Attack'], ['Wild Charge', 'Aqua Tail', 'Close Combat'], 'Endeavor'],
				signatureMove: 'Charge Spin',
				evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
			},
			'Gold Ho-Oh': {
				species: 'Ho-Oh', ability: 'Mountaineer', item: 'Gold Ho-Ohnium Z', gender: 'M',
				moves: ['Sunny Day', ['Wish', 'Recover', 'Healing Wish'], ['Wild Charge', 'Earthquake', 'Power Whip']],
				signatureMove: 'Sacred Fire',
				evs: {atk: 252, def: 4, spd: 252}, nature: 'Adamant', shiny: true,
			},
         'AJ The Keldeo': {
				species: 'Keldeo', ability: 'Justified', item: 'Payapa Berry', gender: 'M',
				moves: ['Water Pulse', ['Ice Beam', 'Earth Power', 'Dark Pulse'], ['Secret Sword', 'Sacred Sword']],
				signatureMove: 'Oblivion Sword',
				evs: {spa: 252, atk: 4, spe: 252}, nature: 'Modest',
			},			
			'Zatch': {
				species: 'Necrozma-Ultra', ability: 'Wonder Guard', item: 'Lum Berry', gender: 'N',
				moves: ['Photon Geyser', ['Moongeist Beam', 'Sunsteel Strike'], 'Recover', ['Z-Shield', 'Z-Next Level', 'Z-Expo', 'Z-Spin']],
				signatureMove: 'Z-Boom',
				evs: {hp: 4, atk: 252, spa: 252}, nature: 'Serious', shiny: true,
			},
		};
		let pool = Object.keys(sets);
		/** @type {{[type: string]: number}} */
		let typePool = {};
		while (pool.length && team.length < 6) {
			let name = this.sampleNoReplace(pool);
			let billSet = sets[name];
			// Enforce typing limits
			let types = this.getTemplate(billSet.species).types;
			if (name === 'Abby') types = ["Dragon", "Fairy", "Water"];
			if (name === 'Anabelle') types = ["Water", "Fairy", "Psychic"];
			if (name === 'Crystal') types = ["Water", "Ice"];
			if (name === 'Mizzy') types = ["Fairy", "Psychic"];
			if (name === 'Aqua') types = ["Water"];
			let rejected = false;
			for (let type of types) {
				if (typePool[type] === undefined) typePool[type] = 0;
				if (typePool[type] >= 2) {
					// Reject
					rejected = true;
					break;
				}
			}
			if (rejected) continue;
			// Update type counts
			for (let type of types) {
				typePool[type]++;
			}
			/** @type {PokemonSet} */
			let set = {
				name: name,
				species: billSet.species,
				item: Array.isArray(billSet.item) ? this.sampleNoReplace(billSet.item) : billSet.item,
				ability: Array.isArray(billSet.ability) ? this.sampleNoReplace(billSet.ability) : billSet.ability,
				moves: [],
				nature: Array.isArray(billSet.nature) ? this.sampleNoReplace(billSet.nature) : billSet.nature,
				gender: billSet.gender,
				evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
				ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
				level: billSet.level || 100,
				shiny: billSet.shiny,
			};
			if (billSet.ivs) {
				for (let iv in billSet.ivs) {
					// IVs from the set override the default of 31, assume the hardcoded IVs are legal
					// @ts-ignore StatsTable has no index signature
					set.ivs[iv] = billSet.ivs[iv];
				}
			}
			if (billSet.evs) {
				for (let ev in billSet.evs) {
					// EVs from the set override the default of 0, assume the hardcoded EVs are legal
					// @ts-ignore StatsTable has no index signature
					set.evs[ev] = billSet.evs[ev];
				}
			} else {
				set.evs = {hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84};
			}
			while (set.moves.length < 3 && billSet.moves.length > 0) {
				let move = this.sampleNoReplace(billSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				set.moves.push(move);
			}
			set.moves.push(billSet.signatureMove);
			if (name === 'Maxim' && set.item === 'Choice Scarf') set.moves[3] = 'Meteor Mass';
			team.push(set);
		}
		return team;
	}
}

module.exports = RandomPKLandTeams;
