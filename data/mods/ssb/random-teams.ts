import RandomTeams from '../../random-teams';

interface SSBSet {
	species: string;
	ability: string | string[];
	item: string | string[];
	gender: GenderName;
	moves: (string | string[])[];
	signatureMove: string;
	evs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	ivs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	nature: string | string[];
	shiny?: number | boolean;
	level?: number;
	happiness?: number;
}
interface SSBSets {[k: string]: SSBSet}

export const ssbSets: SSBSets = {
	/*
	// Example:
	Username: {
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
	Aethernum: {
		species: 'Lotad', ability: 'Rainy Season', item: 'Big Root', gender: 'M',
		moves: ['Giga Drain', 'Muddy Water', 'Hurricane'],
		signatureMove: 'Lilypad Overflow',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest',
	},
	'cant say': {
		species: 'Volcarona', ability: 'Rage Quit', item: 'Kee Berry', gender: 'M',
		moves: ['Quiver Dance', 'Roost', 'Will-O-Wisp'],
		signatureMove: 'Never Lucky',
		evs: {hp: 248, def: 36, spe: 224}, ivs: {atk: 0}, nature: 'Timid',
	},
	Darth: {
		species: 'Articuno', ability: 'Guardian Angel', item: 'Heavy Duty Boots', gender: 'M',
		moves: ['Revelation Dance', ['Recover', 'Roost'], 'U-turn'],
		signatureMove: 'Archangel\'s Requiem',
		evs: {hp: 252, def: 128, spd: 128}, nature: 'Bold',
	},
	'drampa\'s grandpa': {
		species: 'Drampa', ability: 'Old Manpa', item: 'Wise Glasses', gender: 'M',
		moves: [
			['Spikes', 'Stealth Rock', 'Toxic Spikes'], 'Slack Off', ['Core Enforcer', 'Snarl', 'Lava Plume', 'Steam Eruption'],
		],
		signatureMove: 'GET OFF MY LAWN!',
		evs: {hp: 248, def: 8, spa: 252}, ivs: {atk: 0}, nature: 'Modest',
	},
	Elgino: {
		species: 'Celebi', ability: 'Magic Guard', item: 'Life Orb', gender: 'M',
		moves: ['Leaf Storm', 'Nasty Plot', 'Power Gem'],
		signatureMove: 'Navi\'s Grace',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid', shiny: true,
	},
	Flare: {
		species: 'Weavile', ability: 'Permafrost Armor', item: 'Life Orb', gender: 'N',
		moves: ['Earthquake', 'Knock Off', ['Play Rough', 'U-turn']],
		signatureMove: 'Kōri Senbon',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
  },
  Frostyicelad: {
		species: 'Frosmoth', ability: 'Ice Shield', item: 'Ice Stone', gender: 'M',
		moves: ['Quiver Dance', 'Bug Buzz', ['Earth Power', 'Sparkling Aria']],
		signatureMove: 'Frosty Wave',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	GXS: {
		species: 'Porygon-Z', ability: 'Virus Upload', item: 'Life Orb', gender: 'N',
		moves: ['Nasty Plot', 'Aura Sphere', 'Thunderbolt'],
		signatureMove: 'Data Corruption',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
	},
	Instruct: {
		species: 'Cinderace', ability: 'Determination', item: 'Flame Plate', gender: 'N',
		moves: ['Pyro Ball', 'Sacred Sword', 'Bolt Strike'],
		signatureMove: 'Hyper Goner',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
	Jho: {
		species: 'Toxtricity', ability: 'Punk Rock', item: 'Throat Spray', gender: 'M',
		moves: ['Nasty Plot', 'Overdrive', 'Volt Switch'],
		signatureMove: 'Genre Change',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	'Kaiju Bunny': {
		species: 'Lopunny', ability: 'Second Wind', item: 'Lopunnite', gender: 'F',
		moves: ['Return', 'Play Rough', ['Drain Punch', 'High Jump Kick']],
		signatureMove: 'Cozy Cuddle',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', shiny: 1,
	},
	Kris: {
		species: 'Unown', ability: 'Protean', item: 'Life Orb', gender: 'N',
		moves: ['Light of Ruin', 'Psystrike', ['Secret Sword', 'Mind Blown', 'Seed Flare']],
		signatureMove: 'ebhewbnjgWEGAER',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	MajorBowman: {
		species: 'Weezing-Galar', ability: 'Neutralizing Gas', item: 'Black Sludge', gender: 'M',
		moves: ['Strange Steam', ['Toxic Spikes', 'Haze'], 'Recover'],
		signatureMove: 'Corrosive Cloud',
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Bold',
	},
	Mitsuki: {
		species: 'Leafeon', ability: 'Photosynthesis', item: ['Life Orb', 'Miracle Seed'], gender: 'M',
		moves: ['Solar Blade', ['Body Slam', 'X-Scissor'], 'Thousand Arrows'],
		signatureMove: 'Terraforming',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	'OM~!': {
		species: 'Magneton', ability: 'Triage', item: 'Metronome', gender: 'N',
		moves: ['Parabolic Charge', 'Oblivion Wing', 'Giga Drain'],
		signatureMove: 'MechOMnism',
		evs: {hp: 252, spa: 252, spd: 4}, nature: 'Modest', level: 100, shiny: 1,
	},
	Overneat: {
		species: 'Absol', ability: 'Intimidate', item: 'Absolite', gender: 'M',
		moves: ['Play Rough', 'U-turn', 'Close Combat'],
		signatureMove: 'Healing you?',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', level: 100,
	},
	'Paradise ╱╲☼': {
		species: 'Slaking', ability: 'Unaware', item: 'Choice Scarf', gender: '',
		moves: ['Sacred Fire', 'Spectral Thief', 'Icicle Crash'],
		signatureMove: 'Rapid Turn',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', level: 100,
	},
	'Perish Song': {
		species: 'Mismagius', ability: 'Snowstorm', item: 'Icium Z', gender: 'M',
		moves: ['Nasty Plot', 'Flamethrower', ['Blizzard', 'Freeze-Dry']],
		signatureMove: 'Sinister Gaze',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
	},
	phiwings99: {
		species: 'Froslass', ability: 'Plausible Deniability', item: 'Boatium Z', gender: 'M',
		moves: ['Destiny Bond', 'Ice Beam', 'Haze'],
		signatureMove: 'Moongeist Beam',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Rabia: {
		species: 'Mew', ability: 'Psychic Surge', item: 'Life Orb', gender: 'M',
		moves: ['Nasty Plot', ['Flamethrower', 'Fire Blast'], 'Roost'],
		signatureMove: 'Psycho Drive',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', shiny: true,
	},
	Segmr: {
		species: 'Ninetales-Alola', ability: 'wAll In', item: 'Light Clay', gender: 'M',
		moves: ['Recover', 'Will-O-Wisp', 'Freeze-Dry'],
		signatureMove: 'Disconnect',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Modest',
	},
	Zodiax: {
		species: 'Oricorio-Pom-Pom', ability: 'Primordial Sea', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Quiver Dance', 'Hurricane', 'Thunder'],
		signatureMove: 'Big Storm Coming',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
	},
};

export class RandomStaffBrosTeams extends RandomTeams {
	randomStaffBrosTeam(options: {inBattle?: boolean} = {}) {
		const team: PokemonSet[] = [];
		const debug: string[] = []; // Set this to a list of SSB sets to override the normal pool for debugging.
		const pool = debug.length ? debug : Object.keys(ssbSets);
		const typePool: {[k: string]: number} = {};
		let depth = 0;
		while (pool.length && team.length < 6) {
			if (depth >= 200) throw new Error(`Infinite loop in Super Staff Bros team generation.`);
			depth++;
			const name = this.sampleNoReplace(pool);
			const ssbSet = Object.assign({}, ssbSets[name]);

			// Enforce typing limits
			if (!debug.length) { // Type limits are ignored when debugging
				const types = this.dex.getSpecies(ssbSet.species).types;
				let rejected = false;
				for (const type of types) {
					if (typePool[type] === undefined) typePool[type] = 0;
					if (typePool[type] >= 2) {
						// Reject
						rejected = true;
						break;
					}
				}
				if (rejected) continue;
				// Update type counts
				for (const type of types) {
					typePool[type]++;
				}
			}

			const set: PokemonSet = {
				name: name,
				species: ssbSet.species,
				item: Array.isArray(ssbSet.item) ? this.sampleNoReplace(ssbSet.item.slice()) : ssbSet.item,
				ability: Array.isArray(ssbSet.ability) ? this.sampleNoReplace(ssbSet.ability.slice()) : ssbSet.ability,
				moves: [],
				nature: Array.isArray(ssbSet.nature) ? this.sampleNoReplace(ssbSet.nature.slice()) : ssbSet.nature,
				gender: ssbSet.gender,
				evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
				ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
				level: ssbSet.level || 100,
				happiness: typeof ssbSet.happiness === 'number' ? ssbSet.happiness : 255,
				shiny: typeof ssbSet.shiny === 'number' ? this.randomChance(1, ssbSet.shiny) : ssbSet.shiny,
			};
			if (ssbSet.ivs) {
				let iv: StatName;
				for (iv in ssbSet.ivs) {
					// IVs from the set override the default of 31, assume the hardcoded IVs are legal
					set.ivs[iv] = ssbSet.ivs[iv]!;
				}
			}
			if (ssbSet.evs) {
				let ev: StatName;
				for (ev in ssbSet.evs) {
					// EVs from the set override the default of 0, assume the hardcoded EVs are legal
					set.evs[ev] = ssbSet.evs[ev]!;
				}
			} else {
				set.evs = {hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84};
			}

			const movepool = ssbSet.moves.slice();
			while (set.moves.length < 3 && ssbSet.moves.length > 0) {
				let move = this.sampleNoReplace(movepool);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				set.moves.push(move);
			}
			set.moves.push(ssbSet.signatureMove);

			// Any set specific tweaks occur here.

			team.push(set);

			// Team specific tweaks occur here
			// Swap last and second to last sets if last set has Illusion
			if (team.length === 6 && set.ability === 'Illusion') {
				team[5] = team[4];
				team[4] = set;
			}
		}
		return team;
	}
}

export default RandomStaffBrosTeams;
