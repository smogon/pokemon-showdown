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
	Adri: {
		species: 'Latios', ability: 'Psychic Surge', item: 'Leftovers', gender: 'M',
		moves: ['Psyshock', 'Calm Mind', 'Aura Sphere'],
		signatureMove: 'Skystriker',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Aeonic: {
		species: 'Nosepass', ability: 'Arsene', item: 'Stone Plate', gender: 'M',
		moves: ['Diamond Storm', 'Earthquake', 'Milk Drink'],
		signatureMove: 'Looking Cool',
		evs: {hp: 252, def: 8, spd: 252}, nature: 'Impish',
	},
	Aethernum: {
		species: 'Lotad', ability: 'Rainy Season', item: 'Big Root', gender: 'M',
		moves: ['Giga Drain', 'Muddy Water', 'Hurricane'],
		signatureMove: 'Lilypad Overflow',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest',
	},
	Alpha: {
		species: 'Aurorus', ability: 'Snow Warning', item: 'Caionium Z', gender: 'M',
		moves: ['Freeze-Dry', 'Ancient Power', 'Earth Power'],
		signatureMove: 'Blizzard',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid', shiny: true,
	},
	Arsenal: {
		species: 'Corvisquire', ability: 'Royal Privilege', item: 'Eviolite', gender: '',
		moves: ['Sky Attack', 'High Jump Kick', 'Earthquake'],
		signatureMove: 'Vorpal Wings',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
	},
	'awa!': {
		species: 'Lycanroc', ability: 'Sand Rush', item: 'Life Orb', gender: 'F',
		moves: ['Earthquake', 'Close Combat', 'Swords Dance'],
		signatureMove: 'awa!',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Adamant',
	},
	Beowulf: {
		species: 'Beedrill', ability: 'Intrepid Sword', item: 'Beedrillite', gender: '',
		moves: ['Megahorn', 'Gunk Shot', ['Precipice Blades', 'Head Smash']],
		signatureMove: 'Buzz Inspection',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly', shiny: 2,
	},
	Cake: {
		species: 'Dunsparce', ability: 'h', item: 'Leftovers', gender: 'M',
		moves: ['Toxic', 'Spiky Shield', 'Skill Swap'],
		signatureMove: 'Kevin',
		evs: {hp: 252, atk: 252, spd: 4}, nature: 'Adamant',
	},
	'cant say': {
		species: 'Volcarona', ability: 'Rage Quit', item: 'Kee Berry', gender: 'M',
		moves: ['Quiver Dance', 'Roost', 'Will-O-Wisp'],
		signatureMove: 'Never Lucky',
		evs: {hp: 248, def: 36, spe: 224}, ivs: {atk: 0}, nature: 'Timid',
	},
	Chloe: {
		species: 'Delphox', ability: 'No Guard', item: 'Heavy-Duty Boots', gender: 'F',
		moves: ['Nasty Plot', 'Inferno', 'Psystrike'],
		signatureMove: 'Víðsýni',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
	},
	'c.kilgannon': {
		species: 'Yveltal', ability: 'Pestilence', item: 'Choice Scarf', gender: 'N',
		moves: ['Knock Off', 'Steel Wing', 'U-turn'],
		signatureMove: 'Death Wing',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Adamant',
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
	dream: {
		species: 'Klefki', ability: 'Greed Punisher', item: 'Life Orb', gender: 'N',
		moves: ['Light of Ruin', 'Steel Beam', 'Mind Blown'],
		signatureMove: 'Lock and Key',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Modest',
	},
	Elgino: {
		species: 'Celebi', ability: 'Magic Guard', item: 'Life Orb', gender: 'M',
		moves: ['Leaf Storm', 'Nasty Plot', 'Power Gem'],
		signatureMove: 'Navi\'s Grace',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid', shiny: true,
	},
	Emeri: {
		species: 'Flygon', ability: 'Draco Voice', item: 'Throat Spray', gender: 'M',
		moves: ['Boomburst', 'Earth Power', 'Agility'],
		signatureMove: 'Forced Landing',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	fart: {
		species: 'Kartana', ability: 'Bipolar', item: 'Metronome', gender: 'M',
		moves: ['U-turn'],
		signatureMove: 'Soup-Stealing 7-Star Strike: Redux',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', level: 100, shiny: 1,
	},
	Flare: {
		species: 'Weavile', ability: 'Permafrost Armor', item: 'Life Orb', gender: 'N',
		moves: ['Sacred Sword', 'Knock Off', 'U-turn'],
		signatureMove: 'Kōri Senbon',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
	},
	'frostyicelad ❆': {
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
	'Jett x_x': {
		species: 'Sneasel', ability: 'Deceiver', item: 'Heavy Duty Boots', gender: 'M',
		moves: ['Knock Off', 'Icicle Crash', 'Counter'],
		signatureMove: 'The Hunt is On!',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
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
	Jordy: {
		species: 'Archeops', ability: 'Divine Sandstorm', item: 'Life Orb', gender: 'M',
		moves: ['Brave Bird', 'Head Smash', ['U-turn', 'Roost', 'Icicle Crash']],
		signatureMove: 'Archeops\'s Rage',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
	'Kaiju Bunny': {
		species: 'Lopunny', ability: 'Second Wind', item: 'Lopunnite', gender: 'F',
		moves: ['Return', 'Play Rough', ['Drain Punch', 'High Jump Kick']],
		signatureMove: 'Cozy Cuddle',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', shiny: 1,
	},
	KingSwordYT: {
		species: 'Pangoro', ability: 'Bamboo Kingdom', item: 'Rocky Helmet', gender: 'M',
		moves: ['Body Press', 'Spiky Shield', 'Shore Up'],
		signatureMove: 'Clash of Pangoros',
		evs: {hp: 252, atk: 4, def: 252}, nature: 'Impish', shiny: true,
	},
	Kris: {
		species: 'Unown', ability: 'Protean', item: 'Life Orb', gender: 'N',
		moves: ['Light of Ruin', 'Psystrike', ['Secret Sword', 'Mind Blown', 'Seed Flare']],
		signatureMove: 'Alphabet Soup',
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
	n10siT: {
		species: 'Hoopa', ability: 'Greedy Magician', item: 'Focus Sash', gender: 'N',
		moves: ['Hyperspace Hole', 'Shadow Ball', 'Aura Sphere'],
		signatureMove: 'Unbind',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
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
	'PiraTe Princess': {
		species: 'Polteageist', ability: 'Wild Magic Surge', item: 'Expert Belt', gender: 'F',
		moves: [
			'Moongeist Beam', 'Spacial Rend', [
				'Tri Attack', 'Fiery Dance', 'Scald', 'Discharge', 'Apple Acid', 'Ice Beam',
				'Aura Sphere', 'Sludge Bomb', 'Earth Power', 'Oblivion Wing', 'Psyshock', 'Bug Buzz',
				'Power Gem', 'Dark Pulse', 'Flash Cannon', 'Dazzling Gleam',
			],
		],
		signatureMove: 'Dungeons & Dragons',
		evs: {def: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	quadrophenic: {
		species: 'Porygon', ability: 'Adaptability', item: 'Eviolite', gender: 'N',
		moves: [
			'Tri Attack', 'Flamethrower', 'Surf', 'Energy Ball', 'Bug Buzz', 'Aeroblast',
			'Thunderbolt', 'Ice Beam', 'Dragon Pulse', 'Power Gem', 'Earth Power', 'Moonblast',
			'Dark Pulse', 'Shadow Ball', 'Psychic', 'Aura Sphere', 'Flash Cannon', 'Sludge Bomb',
		],
		signatureMove: 'Extreme Ways',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
	},
	Rabia: {
		species: 'Mew', ability: 'Psychic Surge', item: 'Life Orb', gender: 'M',
		moves: ['Nasty Plot', ['Flamethrower', 'Fire Blast'], 'Roost'],
		signatureMove: 'Psycho Drive',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', shiny: true,
	},
	Ransei: {
		species: 'Audino', ability: 'Neutralizing Gas', item: 'Choice Scarf', gender: 'M',
		moves: ['Trick', 'Recover', 'Spectral Thief'],
		signatureMove: 'ripsei',
		evs: {hp: 252, atk: 4, spe: 252}, nature: 'Jolly',
	},
	Robb576: {
		species: 'Necrozma-Dawn-Wings', ability: 'The Numbers Game', item: 'Metronome', gender: 'M',
		moves: ['Moongeist Beam', 'Psystrike', 'Thunder Wave'],
		signatureMove: 'Mode [5: Offensive]',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Modest',
	},
	Segmr: {
		species: 'Ninetales-Alola', ability: 'wAll In', item: 'Light Clay', gender: 'M',
		moves: ['Recover', 'Will-O-Wisp', 'Freeze-Dry'],
		signatureMove: 'Disconnect',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Modest',
	},
	Sunny: {
		species: 'Charizard', ability: 'Blaze', item: 'Charizardite X', gender: 'M',
		moves: ['Earthquake', ['Double Edge', 'Flare Blitz'], 'Roost'],
		signatureMove: 'One For All: Full Cowl - 100%',
		evs: {atk: 252, spd: 4, spe: 252}, ivs: {spa: 0}, nature: 'Jolly',
	},
	Teclis: {
		species: 'Alakazam', ability: 'Protean', item: 'Life Orb', gender: 'M',
		moves: ['Psychic', 'Shadow Ball', 'Aura Sphere'],
		signatureMove: 'Ten',
		evs: {def: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Tenshi: {
		species: 'Stoutland', ability: 'Royal Coat', item: 'Leftovers', gender: 'M',
		moves: ['Knock Off', 'Thousand Waves', ['Play Rough', 'Power Whip']],
		signatureMove: 'Stony Kibbles',
		evs: {atk: 128, spd: 252, spe: 128}, nature: 'Jolly',
	},
	tiki: {
		species: 'Snom', ability: 'True Grit', item: 'Eviolite', gender: 'M',
		moves: ['Toxic', 'Strength Sap', 'U-turn'],
		signatureMove: 'Right. On. Cue!',
		evs: {hp: 128, def: 144, spd: 236}, ivs: {atk: 0}, nature: 'Bold',
	},
	yuki: {
		species: 'Pikachu-Cosplay', ability: 'Combat Training', item: 'Light Ball', gender: 'F',
		moves: ['Quick Attack'],
		signatureMove: 'Class Change',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: ['Modest', 'Timid'],
	},
	Zalm: {
		species: 'Weedle', ability: 'Berserk', item: 'Sitrus Berry', gender: 'M',
		moves: ['Quiver Dance', 'Belch', ['Snipe Shot', 'Power Gem']],
		signatureMove: 'Ingredient Foraging',
		evs: {hp: 252, spa: 252, spd: 4}, ivs: {atk: 0}, nature: 'Modest',
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
			const ssbSet: SSBSet = this.dex.deepClone(ssbSets[name]);

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
				item: Array.isArray(ssbSet.item) ? this.sampleNoReplace(ssbSet.item) : ssbSet.item,
				ability: Array.isArray(ssbSet.ability) ? this.sampleNoReplace(ssbSet.ability) : ssbSet.ability,
				moves: [],
				nature: Array.isArray(ssbSet.nature) ? this.sampleNoReplace(ssbSet.nature) : ssbSet.nature,
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

			while (set.moves.length < 3 && ssbSet.moves.length > 0) {
				let move = this.sampleNoReplace(ssbSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				set.moves.push(move);
			}
			set.moves.push(ssbSet.signatureMove);

			// Any set specific tweaks occur here.
			if (set.name === 'quadrophenic') set.moves[this.random(2) + 1] = 'Conversion';

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
