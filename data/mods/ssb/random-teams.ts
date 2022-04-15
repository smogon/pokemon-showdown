import RandomTeams from '../../random-teams';

export interface SSBSet {
	species: string;
	ability: string | string[];
	item: string | string[];
	gender: GenderName;
	moves: (string | string[])[];
	signatureMove: string;
	evs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	ivs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	nature?: string | string[];
	shiny?: number | boolean;
	level?: number;
	happiness?: number;
	skip?: string;
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
	Abdelrahman: {
		species: 'Camerupt', ability: 'Water Absorb', item: 'Cameruptite', gender: 'M',
		moves: ['Eruption', 'Earth Power', 'Fire Blast'],
		signatureMove: 'The Town Outplay',
		evs: {hp: 252, spd: 172, spe: 84}, nature: 'Calm',
	},
	Adri: {
		species: 'Latios', ability: 'Psychic Surge', item: 'Leftovers', gender: 'M',
		moves: ['Psyshock', 'Calm Mind', 'Aura Sphere'],
		signatureMove: 'Skystriker',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Aelita: {
		species: 'Zygarde', ability: 'Scyphozoa', item: 'Focus Sash', gender: 'F',
		moves: ['Protect', 'Leech Seed', 'Thousand Arrows'],
		signatureMove: 'XANA\'s Keys To Lyoko',
		evs: {hp: 252, atk: 4, spd: 252}, nature: 'Careful',
	},
	aegii: {
		species: 'Aegislash', ability: 'Set the Stage', item: 'Life Orb', gender: 'M',
		moves: ['Shadow Claw', 'Iron Head', 'Shadow Sneak'],
		signatureMove: 'Reset',
		evs: {hp: 252, def: 192, spd: 64}, nature: 'Sassy',
	},
	'aegii-Alt': {
		species: 'Aegislash', ability: 'Set the Stage', item: 'Life Orb', gender: 'M',
		moves: ['Shadow Ball', 'Flash Cannon', 'Shadow Sneak'],
		signatureMove: 'Reset',
		evs: {hp: 252, def: 192, spd: 64}, nature: 'Sassy',
		skip: 'aegii',
	},
	Aeonic: {
		species: 'Nosepass', ability: 'Arsene', item: 'Stone Plate', gender: 'M',
		moves: ['Diamond Storm', 'Earthquake', 'Milk Drink'],
		signatureMove: 'Looking Cool',
		evs: {atk: 252, def: 4, spd: 252}, nature: 'Impish',
	},
	Aethernum: {
		species: 'Lotad', ability: 'Rainy Season', item: 'Big Root', gender: 'M',
		moves: ['Giga Drain', 'Muddy Water', 'Hurricane'],
		signatureMove: 'Lilypad Overflow',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest',
	},
	Akir: {
		species: 'Forretress', ability: 'Fortifications', item: 'Leftovers', gender: 'M',
		moves: ['Rapid Spin', 'Stealth Rock', ['U-turn', 'Toxic']],
		signatureMove: 'Ravelin',
		evs: {hp: 248, def: 252, spe: 8}, ivs: {spa: 0}, nature: 'Impish',
	},
	Alpha: {
		species: 'Aurorus', ability: 'Snow Warning', item: 'Caionium Z', gender: 'M',
		moves: ['Freeze-Dry', 'Ancient Power', 'Earth Power'],
		signatureMove: 'Blizzard',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid', shiny: true,
	},
	Andrew: {
		species: 'Spectrier', ability: 'Neutralizing Gas', item: 'Choice Specs', gender: 'M',
		moves: ['Moongeist Beam', 'Pollen Puff', 'Trick'],
		signatureMove: 'Whammer Jammer',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Annika: {
		species: 'Mewtwo', ability: 'Overprotective', item: 'Mewtwonite Y', gender: 'F',
		moves: [['Rising Voltage', 'Lava Plume'], ['Hex', 'Aurora Beam'], ['Psychic', 'Psyshock']],
		signatureMove: 'Data Corruption',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Quirky', shiny: true,
	},
	'A Quag To The Past': {
		species: 'Quagsire', ability: 'Carefree', item: 'Quagnium Z', gender: 'M',
		moves: ['Shore Up', 'Flip Turn', ['Haze', 'Toxic']],
		signatureMove: 'Scorching Sands',
		evs: {hp: 252, def: 252, spd: 4}, ivs: {spe: 0}, nature: 'Relaxed',
	},
	Arby: {
		species: 'Keldeo-Resolute', ability: 'Wave Surge', item: 'Expert Belt', gender: '',
		moves: ['Hydro Pump', 'Secret Sword', 'Ice Beam'],
		signatureMove: 'Quickhammer',
		evs: {def: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Arcticblast: {
		species: 'Tapu Fini', ability: 'Misty Surge', item: 'Misty Seed', gender: '',
		moves: ['Heal Order', 'Sparkling Aria', ['Clear Smog', 'Moonblast']],
		signatureMove: 'Radiant Burst',
		evs: {hp: 252, def: 252, spe: 4}, ivs: {atk: 0}, nature: 'Bold',
	},
	Archas: {
		species: 'Naviathan', ability: 'Indomitable', item: 'Iron Plate', gender: 'F',
		moves: ['Waterfall', 'Icicle Crash', 'No Retreat'],
		signatureMove: 'Broadside Barrage',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
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
	biggie: {
		species: 'Snorlax', ability: 'Super Armor', item: 'Leftovers', gender: 'M',
		moves: ['Body Slam', 'Darkest Lariat', 'Assist'],
		signatureMove: 'Juggernaut Punch',
		evs: {hp: 4, def: 252, spd: 252}, nature: 'Brave',
	},
	Billo: {
		species: 'Cosmog', ability: 'Proof Policy', item: 'Eviolite', gender: 'N',
		moves: ['Cosmic Power', 'Calm Mind', 'Stored Power'],
		signatureMove: 'Fishing for Hacks',
		evs: {hp: 252, spa: 252, spd: 4}, ivs: {atk: 0}, nature: 'Modest', shiny: true,
	},
	Blaz: {
		species: 'Carbink', ability: 'Solid Rock', item: 'Leftovers', gender: 'N',
		moves: ['Cosmic Power', 'Body Press', 'Recover'],
		signatureMove: 'Bleak December',
		evs: {hp: 4, def: 252, spd: 252}, ivs: {atk: 0}, nature: 'Careful', shiny: true,
	},
	Brandon: {
		species: 'Shaymin', ability: 'Bane Surge', item: ['Leftovers', 'Terrain Extender'], gender: 'M',
		moves: [['Ice Beam', 'Paleo Wave'], ['Earthquake', 'Flamethrower'], 'Recover'],
		signatureMove: 'Flower Shower',
		evs: {hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84}, nature: 'Quirky',
	},
	brouha: {
		species: 'Mantine', ability: 'Turbulence', item: 'Leftovers', gender: 'M',
		moves: ['Scald', 'Recover', 'Haze'],
		signatureMove: 'Kinetosis',
		evs: {hp: 248, def: 8, spd: 252}, ivs: {atk: 0}, nature: 'Calm',
	},
	Buffy: {
		species: 'Dragonite', ability: 'Speed Control', item: 'Metal Coat', gender: '',
		moves: ['Swords Dance', 'Thousand Arrows', 'Double Iron Bash'],
		signatureMove: 'Pandora\'s Box',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', shiny: 2,
	},
	Cake: {
		species: 'Dunsparce', ability: 'Wonder Guard', item: 'Shell Bell', gender: 'M',
		moves: ['Haze', 'Jungle Healing', ['Baton Pass', 'Poison Gas', 'Corrosive Gas', 'Magic Powder', 'Speed Swap', 'Spite', 'Screech', 'Trick Room', 'Heal Block', 'Geomancy']],
		signatureMove: 'Kevin',
		evs: {hp: 252, atk: 252, spd: 4}, nature: 'Adamant',
	},
	'cant say': {
		species: 'Volcarona', ability: 'Rage Quit', item: 'Kee Berry', gender: 'M',
		moves: ['Quiver Dance', 'Roost', 'Will-O-Wisp'],
		signatureMove: 'Never Lucky',
		evs: {hp: 248, def: 36, spe: 224}, ivs: {atk: 0}, nature: 'Timid',
	},
	Celine: {
		species: 'Lucario', ability: 'Guardian Armor', item: 'Leftovers', gender: 'F',
		moves: ['Wish', 'Teleport', 'Drain Punch'],
		signatureMove: 'Status Guard',
		evs: {hp: 248, def: 252, spd: 8}, nature: 'Impish',
	},
	'c.kilgannon': {
		species: 'Yveltal', ability: 'Infiltrator', item: 'Choice Scarf', gender: 'N',
		moves: ['Knock Off', 'Steel Wing', 'U-turn'],
		signatureMove: 'Soul Siphon',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Adamant',
	},
	Coconut: {
		species: 'Misdreavus', ability: 'Levitate', item: 'Focus Sash', gender: 'F',
		moves: ['Dazzling Gleam', 'Shadow Ball', 'Snatch'],
		signatureMove: 'Devolution Beam',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
	},
	dogknees: {
		species: 'Furret', ability: 'Adaptability', item: ['Normalium Z', 'Ghostium Z'], gender: 'M',
		moves: ['Extreme Speed', 'Shadow Claw', 'Explosion'],
		signatureMove: 'Belly Rubs',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
	},
	DragonWhale: {
		species: 'Mimikyu', ability: 'Disguise', item: 'Life Orb', gender: 'M',
		moves: ['Play Rough', 'Spectral Thief', 'Shadow Sneak'],
		signatureMove: 'Cloak Dance',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
	},
	'drampa\'s grandpa': {
		species: 'Drampa', ability: 'Old Manpa', item: 'Wise Glasses', gender: 'M',
		moves: [
			['Spikes', 'Stealth Rock', 'Toxic Spikes'], 'Slack Off', ['Core Enforcer', 'Snarl', 'Lava Plume', 'Scorching Sands'],
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
		species: 'Flygon', ability: 'Drake Skin', item: 'Throat Spray', gender: 'M',
		moves: ['Boomburst', 'Earth Power', 'Agility'],
		signatureMove: 'Forced Landing',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	estarossa: {
		species: 'Hippowdon', ability: 'Sands of Time', item: 'Leftovers', gender: 'M',
		moves: ['Earthquake', 'Stone Edge', 'Slack Off'],
		signatureMove: 'Sand Balance',
		evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
	},
	EpicNikolai: {
		species: 'Garchomp', ability: 'Dragon Heart', item: 'Garchompite', gender: 'M',
		moves: ['Outrage', 'Earthquake', 'Swords Dance'],
		signatureMove: 'Epic Rage',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	explodingdaisies: {
		species: 'Shedinja', ability: 'Wonder Guard', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Swords Dance', 'X-Scissor', 'Shadow Sneak'],
		signatureMove: 'You Have No Hope!',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Adamant',
	},
	fart: {
		species: 'Kartana', ability: 'Bipolar', item: 'Metronome', gender: 'M',
		moves: ['U-turn'],
		signatureMove: 'Soup-Stealing 7-Star Strike: Redux',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', level: 100, shiny: true,
	},
	Felucia: {
		species: 'Uxie', ability: 'Regenerator', item: 'Red Card', gender: 'F',
		moves: ['Strength Sap', ['Psyshock', 'Night Shade'], ['Thief', 'Toxic']],
		signatureMove: 'Rigged Dice',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Calm',
	},
	Finland: {
		species: 'Alcremie', ability: 'Winding Song', item: 'Leftovers', gender: 'M',
		moves: ['Shore Up', 'Moonblast', ['Infestation', 'Whirlwind']],
		signatureMove: 'Cradily Chaos',
		evs: {hp: 252, def: 64, spa: 64, spd: 64, spe: 64}, ivs: {atk: 0}, nature: 'Serious',
	},
	'Finland-Tsikhe': {
		species: 'Alcremie-Lemon-Cream', ability: 'Winding Song', item: 'Leftovers', gender: 'M',
		moves: ['Shore Up', 'Spiky Shield', ['Reflect', 'Light Screen']],
		signatureMove: 'Cradily Chaos',
		evs: {hp: 252, def: 64, spa: 64, spd: 64, spe: 64}, ivs: {atk: 0}, nature: 'Serious',
		skip: 'Finland',
	},
	'Finland-Nezavisa': {
		species: 'Alcremie-Ruby-Swirl', ability: 'Winding Song', item: 'Leftovers', gender: 'M',
		moves: ['Lava Plume', 'Scorching Sands', ['Refresh', 'Destiny Bond']],
		signatureMove: 'Cradily Chaos',
		evs: {hp: 252, def: 64, spa: 64, spd: 64, spe: 64}, ivs: {atk: 0}, nature: 'Serious',
		skip: 'Finland',
	},
	'Finland-Järvilaulu': {
		species: 'Alcremie-Mint-Cream', ability: 'Winding Song', item: 'Leftovers', gender: 'M',
		moves: ['Sticky Web', 'Parting Shot', ['Light of Ruin', 'Sparkling Aria']],
		signatureMove: 'Cradily Chaos',
		evs: {hp: 252, def: 64, spa: 64, spd: 64, spe: 64}, ivs: {atk: 0}, nature: 'Serious',
		skip: 'Finland',
	},
	'frostyicelad ❆': {
		species: 'Lapras-Gmax', ability: 'Ice Shield', item: 'Life Orb', gender: 'M',
		moves: ['Quiver Dance', 'Sparkling Aria', 'Recover'],
		signatureMove: 'Frosty Wave',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	'gallant\'s pear': {
		species: 'Orbeetle', ability: 'Armor Time', item: ['Life Orb', 'Heavy-Duty Boots'], gender: 'M',
		moves: ['Bug Buzz', 'Nasty Plot', 'Snipe Shot'],
		signatureMove: 'King Giri Giri Slash',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Timid',
	},
	Gimmick: {
		species: 'Grimmsnarl', ability: 'IC3PEAK', item: 'Throat Spray', gender: 'M',
		moves: ['Boomburst', 'Disarming Voice', 'Snarl'],
		signatureMove: 'Random Screaming',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid', shiny: true,
	},
	GMars: {
		species: 'Minior-Meteor', ability: 'Capsule Armor', item: 'White Herb', gender: 'N',
		moves: ['Acrobatics', 'Earthquake', 'Diamond Storm'],
		signatureMove: 'Gacha',
		evs: {hp: 68, atk: 252, spe: 188}, nature: 'Adamant',
	},
	grimAuxiliatrix: {
		species: 'Duraludon', ability: 'Aluminum Alloy', item: 'Assault Vest', gender: '',
		moves: [['Core Enforcer', 'Draco Meteor'], 'Fire Blast', ['Thunderbolt', 'Earth Power']],
		signatureMove: 'Skyscraper Suplex',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
	},
	HoeenHero: {
		species: 'Ludicolo', ability: 'Tropical Cyclone', item: 'Life Orb', gender: 'M',
		moves: ['Scald', 'Giga Drain', 'Hurricane'],
		signatureMove: 'Landfall',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Modest',
	},
	Hubriz: {
		species: 'Roserade', ability: 'Stakeout', item: 'Rose Incense', gender: 'F',
		moves: [['Toxic Spikes', 'Spikes'], 'Leaf Storm', 'Sludge Bomb'],
		signatureMove: 'Steroid Anaphylaxia',
		evs: {def: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Hydro: {
		species: 'Pichu', ability: 'Hydrostatic', item: 'Eviolite', gender: 'M',
		moves: ['Hydro Pump', 'Thunder', 'Ice Beam'],
		signatureMove: 'Hydrostatics',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Modest',
	},
	Inactive: {
		species: 'Gyarados', ability: 'Dragon\'s Fury', item: 'Gyaradosite', gender: '',
		moves: ['Dragon Dance', 'Earthquake', 'Crabhammer'],
		signatureMove: 'Paranoia',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	instruct: {
		species: 'Riolu', ability: 'Truant', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Explosion', 'Lunar Dance', 'Memento'],
		signatureMove: 'Soda Break',
		evs: {hp: 252, atk: 4, spe: 252}, nature: 'Jolly',
	},
	Iyarito: {
		species: 'Gengar', ability: 'Pollo Diablo', item: 'Choice Specs', gender: 'F',
		moves: ['Sludge Wave', 'Volt Switch', 'Fusion Flare'],
		signatureMove: 'Patrona Attack',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Timid', shiny: true,
	},
	Jett: {
		species: 'Sneasel', ability: 'Deceiver', item: 'Heavy Duty Boots', gender: 'F',
		moves: ['Knock Off', 'Triple Axel', 'Counter'],
		signatureMove: 'The Hunt is On!',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
	},
	Jho: {
		species: 'Toxtricity', ability: 'Punk Rock', item: 'Throat Spray', gender: 'M',
		moves: ['Nasty Plot', 'Overdrive', 'Volt Switch'],
		signatureMove: 'Genre Change',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	'Jho-Low-Key': {
		species: 'Toxtricity-Low-Key', ability: 'Venomize', item: 'Throat Spray', gender: 'M',
		moves: ['Aura Sphere', 'Boomburst', 'Volt Switch'],
		signatureMove: 'Genre Change',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
		skip: 'Jho',
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
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', shiny: true,
	},
	Kalalokki: {
		species: 'Wingull', ability: 'Magic Guard', item: 'Kalalokkium Z', gender: 'M',
		moves: ['Tailwind', 'Encore', 'Healing Wish'],
		signatureMove: 'Blackbird',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Kennedy: {
		species: 'Cinderace', ability: 'False Nine', item: 'Choice Band', gender: 'M',
		moves: ['High Jump Kick', 'Triple Axel', 'U-turn'],
		signatureMove: 'Top Bins',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant',
	},
	Kev: {
		species: 'Kingdra', ability: 'King of Atlantis', item: 'Life Orb', gender: 'M',
		moves: ['Hydro Pump', 'Core Enforcer', 'Hurricane'],
		signatureMove: 'King\'s Trident',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Modest',
	},
	Kingbaruk: {
		species: 'Stonjourner', ability: 'Sturdy', item: 'Heavy Duty Boots', gender: 'M',
		moves: ['Diamond Storm', ['Superpower', 'Earthquake'], 'King\'s Shield'],
		signatureMove: 'Leave it to the team!',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	KingSwordYT: {
		species: 'Pangoro', ability: 'Bamboo Kingdom', item: 'Rocky Helmet', gender: 'M',
		moves: ['Body Press', 'Spiky Shield', 'Shore Up'],
		signatureMove: 'Clash of Pangoros',
		evs: {hp: 252, atk: 4, def: 252}, nature: 'Impish', shiny: true,
	},
	Kipkluif: {
		species: 'Gossifleur', ability: 'Degenerator', item: 'Eviolite', gender: 'M',
		moves: ['Strength Sap', 'Apple Acid', 'Court Change'],
		signatureMove: 'Kip Up',
		evs: {hp: 196, def: 116, spa: 36, spd: 116, spe: 36}, ivs: {atk: 0}, nature: 'Modest', shiny: true,
	},
	Kris: {
		species: 'Unown', ability: 'Protean', item: 'Life Orb', gender: 'N',
		moves: ['Light of Ruin', 'Psystrike', ['Secret Sword', 'Mind Blown', 'Seed Flare']],
		signatureMove: 'Alphabet Soup',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Lamp: {
		species: 'Lampent', ability: 'Soul-Heart', item: 'Eviolite', gender: 'M',
		moves: ['Nasty Plot', 'Searing Shot', 'Recover'],
		signatureMove: 'Soul Swap',
		evs: {def: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Lionyx: {
		species: 'Gardevoir', ability: 'Tension', item: 'Blunder Policy', gender: 'F',
		moves: [
			['Psychic', 'Psystrike'], 'Quiver Dance', [
				'Blizzard', 'Focus Blast', 'Hurricane', 'Hydro Pump', 'Inferno', 'Zap Cannon',
			],
		],
		signatureMove: 'Big Bang',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid', shiny: true,
	},
	'Litt♥Eleven': {
		species: 'Bisharp', ability: 'Dark Royalty', item: 'Black Glasses', gender: 'M',
		moves: ['Sucker Punch', 'Knock Off', 'Iron Head'],
		signatureMove: '/nexthunt',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant', shiny: true,
	},
	Lunala: {
		species: 'Hattrem', ability: 'Magic Hat', item: 'Eviolite', gender: 'F',
		moves: ['Nuzzle', 'Flamethrower', 'Healing Wish'],
		signatureMove: 'Hat of Wisdom',
		evs: {hp: 252, def: 4, spd: 252}, ivs: {atk: 0}, nature: 'Sassy',
	},
	'Mad Monty ¾°': {
		species: 'Zekrom', ability: 'Petrichor', item: 'Damp Rock', gender: 'N',
		moves: ['Bolt Strike', 'Dragon Claw', 'Liquidation'],
		signatureMove: 'Ca-LLAMA-ty',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', shiny: true,
	},
	MajorBowman: {
		species: 'Weezing-Galar', ability: 'Neutralizing Gas', item: 'Black Sludge', gender: 'M',
		moves: ['Strange Steam', ['Toxic Spikes', 'Haze'], 'Recover'],
		signatureMove: 'Corrosive Cloud',
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Bold',
	},
	Marshmallon: {
		species: 'Munchlax', ability: 'Stubbornness', item: 'Eviolite', gender: 'M',
		moves: ['Head Charge', 'Flare Blitz', 'Wood Hammer', 'Head Smash'],
		signatureMove: 'RAWWWR',
		evs: {hp: 248, def: 252, spd: 8}, ivs: {spe: 0}, nature: 'Relaxed',
	},
	Meicoo: {
		species: 'Venusaur', ability: 'Regenerator', item: 'Venusaurite', gender: 'M',
		moves: ['Sludge Bomb', ['Giga Drain', 'Knock Off', 'Flamethrower'], ['Recover', 'Strength Sap']],
		signatureMove: 'spamguess',
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Bold',
	},
	Mitsuki: {
		species: 'Leafeon', ability: 'Photosynthesis', item: ['Life Orb', 'Miracle Seed'], gender: 'M',
		moves: ['Leaf Blade', 'Attack Order', 'Thousand Arrows'],
		signatureMove: 'Terraforming',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	n10siT: {
		species: 'Hoopa', ability: 'Greedy Magician', item: 'Focus Sash', gender: 'N',
		moves: ['Hyperspace Hole', 'Shadow Ball', 'Aura Sphere'],
		signatureMove: 'Unbind',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Naziel: {
		species: 'Kirlia', ability: 'Prankster', item: 'Eviolite', gender: '',
		moves: ['Glare', 'Defog', 'Swagger'],
		signatureMove: 'Not-so-worthy Pirouette',
		evs: {hp: 252, def: 200, spd: 56}, ivs: {atk: 0}, nature: 'Calm', shiny: true,
	},
	Nol: {
		species: 'Litwick', ability: 'Burning Soul', item: 'Spooky Plate', gender: 'F',
		moves: ['Shadow Ball', 'Flamethrower', 'Giga Drain'],
		signatureMove: 'Mad Hacks',
		evs: {hp: 252, spa: 252, spd: 4}, ivs: {atk: 0, spe: 0}, nature: 'Quiet', shiny: true,
	},
	Notater517: {
		species: 'Jellicent', ability: 'Last-Minute Lag', item: 'Leftovers', gender: 'M',
		moves: ['Hydro Cannon', 'Blast Burn', ['Toxic Spikes', 'Recover']],
		signatureMove: 'Techno Tuber Transmission',
		evs: {hp: 236, spa: 252, spe: 20}, ivs: {atk: 0}, nature: 'Modest',
	},
	nui: {
		species: 'Jigglypuff', ability: 'Condition Override', item: 'King\'s Rock', gender: 'M',
		moves: ['Stealth Rock', 'Attract', 'Heal Order'],
		signatureMove: 'Win Condition',
		evs: {hp: 248, def: 92, spd: 168}, nature: 'Bold', shiny: true,
	},
	'OM~!': {
		species: 'Glastrier', ability: 'Filter', item: 'Heavy Duty Boots', gender: 'M',
		moves: ['Recover', 'Stealth Rock', 'Earthquake'],
		signatureMove: 'OM Zoom',
		evs: {hp: 252, def: 252, spd: 4}, ivs: {spe: 0}, nature: 'Relaxed',
	},
	Overneat: {
		species: 'Absol', ability: 'Intimidate', item: 'Absolite', gender: 'M',
		moves: ['Play Rough', 'U-turn', 'Close Combat'],
		signatureMove: 'Healing you?',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	pants: {
		species: 'Phantump', ability: 'Ghost Spores', item: 'Eviolite', gender: 'M',
		moves: ['Taunt', 'Spirit Shackle', ['Horn Leech', 'U-turn', 'Flip Turn']],
		signatureMove: 'Wistful Thinking',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Impish', shiny: true,
	},
	'Paradise ╱╲☼': {
		species: 'Slaking', ability: 'Unaware', item: 'Choice Scarf', gender: '',
		moves: ['Sacred Fire', 'Spectral Thief', 'Icicle Crash'],
		signatureMove: 'Rapid Turn',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	PartMan: {
		species: 'Chandelure', ability: 'Hecatomb', item: 'Focus Sash', gender: 'M',
		moves: ['Nasty Plot', 'Draining Kiss', 'Dark Pulse'],
		signatureMove: 'Baleful Blaze',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	'PartMan-Shiny': {
		species: 'Chandelure', ability: 'Hecatomb', item: 'Focus Sash', gender: 'M',
		moves: ['Nasty Plot', 'Light of Ruin', 'Fiery Wrath'],
		signatureMove: 'Baleful Blaze',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid', shiny: true,
		skip: 'PartMan',
	},
	'peapod c': {
		species: 'Dragapult', ability: 'Stealth Black', item: 'Leftovers', gender: 'M',
		moves: ['Hex', 'Dragon Darts', 'Work Up'],
		signatureMove: 'Submartingale',
		evs: {atk: 4, spa: 252, spe: 252}, nature: 'Mild',
	},
	'Perish Song': {
		species: 'Rhydon', ability: 'Soup Sipper', item: 'Rocky Helmet', gender: 'M',
		moves: ['Swords Dance', 'Stealth Rock', 'Rock Blast'],
		signatureMove: 'Trickery',
		evs: {hp: 252, atk: 4, def: 252}, nature: 'Impish',
	},
	phiwings99: {
		species: 'Froslass', ability: 'Plausible Deniability', item: 'Heavy Duty Boots', gender: 'M',
		moves: ['Moongeist Beam', 'Spikes', 'Haze'],
		signatureMove: 'Ghost of 1v1 Past',
		evs: {hp: 252, spa: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	'piloswine gripado': {
		species: 'Piloswine', ability: 'Forever Winter Nights', item: 'Eviolite', gender: 'M',
		moves: ['Earthquake', 'Bulk Up', 'refresh'],
		signatureMove: 'Icicle Spirits',
		evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
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
	Psynergy: {
		species: 'Rayquaza', ability: 'Supernova', item: 'Wise Glasses', gender: 'M',
		moves: ['Bouncy Bubble', 'Discharge', 'Lava Plume'],
		signatureMove: 'Clear Breath',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Serious', shiny: true,
	},
	ptoad: {
		species: 'Palpitoad', ability: 'Swampy Surge', item: 'Eviolite', gender: 'M',
		moves: ['Recover', 'Refresh', ['Sludge Bomb', 'Sludge Wave']],
		signatureMove: 'Croak',
		evs: {hp: 248, def: 8, spd: 252}, ivs: {atk: 0}, nature: 'Calm',
	},
	Rabia: {
		species: 'Mew', ability: 'Psychic Surge', item: 'Life Orb', gender: 'M',
		moves: ['Nasty Plot', ['Flamethrower', 'Fire Blast'], 'Roost'],
		signatureMove: 'Psycho Drive',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', shiny: true,
	},
	Rach: {
		species: 'Spinda', ability: 'BURN IT DOWN!', item: 'Leftovers', gender: 'F',
		moves: ['Extreme Speed', 'Recover', 'Knock Off'],
		signatureMove: 'Spinda Wheel',
		evs: {hp: 252, atk: 4, def: 252}, nature: 'Impish',
	},
	Rage: {
		species: 'Espeon', ability: 'Inversion Surge', item: 'Leftovers', gender: 'M',
		moves: ['Psychic', 'Calm Mind', 'Hyper Voice'],
		signatureMove: ':shockedlapras:',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	'Raihan Kibana': {
		species: 'Stoutland', ability: 'Royal Coat', item: 'Leftovers', gender: 'M',
		moves: ['Knock Off', 'Thousand Waves', ['Play Rough', 'Power Whip']],
		signatureMove: 'Stony Kibbles',
		evs: {atk: 128, spd: 252, spe: 128}, nature: 'Jolly',
	},
	'Raj.Shoot': {
		species: 'Charizard', ability: 'Tough Claws', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Flare Blitz', 'Dragon Claw', 'Roost'],
		signatureMove: 'Fan Service',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	Ransei: {
		species: 'Audino', ability: 'Neutralizing Gas', item: 'Choice Scarf', gender: 'M',
		moves: ['Trick', 'Recover', 'Spectral Thief'],
		signatureMove: 'ripsei',
		evs: {hp: 252, atk: 4, spe: 252}, nature: 'Jolly',
	},
	RavioliQueen: {
		species: 'Mismagius', ability: 'Phantom Plane', item: 'Spell Tag', gender: '',
		moves: ['Shadow Ball', 'Dark Pulse', 'Psychic'],
		signatureMove: 'Witching Hour',
		evs: {def: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Modest',
	},
	Robb576: {
		species: 'Necrozma-Dawn-Wings', ability: 'The Numbers Game', item: 'Metronome', gender: 'M',
		moves: ['Moongeist Beam', 'Psystrike', 'Thunder Wave'],
		signatureMove: 'Mode [5: Offensive]',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Modest',
	},
	'Robb576-Dusk-Mane': {
		species: 'Necrozma-Dusk-Mane', ability: 'The Numbers Game', item: 'Leftovers', gender: 'M',
		moves: ['Sunsteel Strike', 'Toxic', 'Rapid Spin'],
		signatureMove: 'Mode [7: Defensive]',
		evs: {hp: 252, atk: 4, spd: 252}, nature: 'Careful',
		skip: 'Robb576', // This set is transformed into by The Numbers Game ability
	},
	'Robb576-Ultra': {
		species: 'Necrozma-Ultra', ability: 'The Numbers Game', item: 'Modium-6 Z', gender: 'M',
		moves: ['Earthquake', 'Dynamax Cannon', 'Fusion Flare'],
		signatureMove: 'Photon Geyser',
		evs: {atk: 204, spa: 200, spe: 104}, nature: 'Hasty',
		skip: 'Robb576', // This set is transformed into by The Numbers Game ability
	},
	Sectonia: {
		species: 'Reuniclus', ability: 'Royal Aura', item: 'Leftovers', gender: 'M',
		moves: ['Eerie Spell', 'Moonblast', 'Recover'],
		signatureMove: 'Homunculus\'s Vanity',
		evs: {hp: 252, def: 252, spd: 4}, ivs: {atk: 0, spe: 0}, nature: 'Relaxed', shiny: true,
	},
	Segmr: {
		species: 'Runerigus', ability: 'Skill Drain', item: 'Leftovers', gender: 'M',
		moves: ['Recover', 'Will-O-Wisp', 'Protect'],
		signatureMove: 'Tsukuyomi',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Calm', shiny: true,
	},
	sejesensei: {
		species: 'Garbodor', ability: 'Trash Consumer', item: 'Red Card', gender: 'M',
		moves: ['Toxic Spikes', 'Spikes', 'Thousand Waves'],
		signatureMove: 'Bad Opinion',
		evs: {hp: 252, atk: 56, def: 200}, nature: 'Impish', shiny: 2,
	},
	Seso: {
		species: 'Nidoking', ability: 'Intrepid Sword', item: 'Weakness Policy', gender: 'M',
		moves: ['Sacred Sword', 'Leaf Blade', 'Behemoth Blade'],
		signatureMove: 'Legendary Swordsman',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant', shiny: true,
	},
	Shadecession: {
		species: 'Honchkrow', ability: 'Shady Deal', item: 'Heavy Duty Boots', gender: 'M',
		moves: ['Knock Off', 'Roost', 'Brave Bird'],
		signatureMove: 'Shade Uppercut',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', shiny: true,
	},
	'Soft Flex': {
		species: 'Zapdos', ability: 'Eye of the Storm', item: ['Leftovers', 'Damp Rock'], gender: '',
		moves: ['Thunder', 'Roost', ['Defog', 'Toxic']],
		signatureMove: 'Updraft',
		evs: {hp: 252, def: 252, spe: 8}, ivs: {atk: 0}, nature: 'Bold', shiny: 1024,
	},
	Spandan: {
		species: 'Mareanie', ability: 'Hacked Corrosion', item: 'Eviolite', gender: 'M',
		moves: ['Toxic', 'Recover', 'Spiky Shield'],
		signatureMove: 'I\'m Toxic You\'re Slippin\' Under',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Calm',
	},
	Struchni: {
		species: 'Aggron', ability: 'Overasked Clause', item: 'Choice Band', gender: 'M',
		moves: ['Pursuit', 'U-turn', 'Fishious Rend'],
		signatureMove: 'Veto',
		evs: {hp: 251, atk: 5, def: 11, spd: 241}, nature: 'Careful',
	},
	Teclis: {
		species: 'Typhlosion', ability: 'Fiery Fur', item: 'Heavy Duty Boots', gender: 'M',
		moves: ['Earth Power', 'Seed Flare', 'Spiky Shield'],
		signatureMove: 'Kaboom',
		evs: {def: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Modest',
	},
	temp: {
		species: 'Latias', ability: 'Charged Up', item: 'Dragon Fang', gender: 'F',
		moves: ['Psychic', 'Surf', 'Roost'],
		signatureMove: 'DROP A DRACO',
		evs: {def: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid', shiny: true,
	},
	'The Immortal': {
		species: 'Xurkitree', ability: 'Teravolt', item: 'Electrium Z', gender: '',
		moves: ['Tail Glow', 'Freeze Dry', 'Secret Sword'],
		signatureMove: 'Watt Up',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	thewaffleman: {
		species: 'Mr. Rime', ability: 'Prankster', item: 'Kasib Berry', gender: 'M',
		moves: ['Cotton Guard', 'Slack Off', 'Focus Blast'],
		signatureMove: 'Ice Press',
		evs: {hp: 252, def: 4, spd: 252}, ivs: {atk: 0}, nature: 'Calm',
	},
	tiki: {
		species: 'Snom', ability: 'True Grit', item: 'Eviolite', gender: 'M',
		moves: ['Toxic', 'Strength Sap', 'U-turn'],
		signatureMove: 'Right. On. Cue!',
		evs: {hp: 128, def: 144, spd: 236}, ivs: {atk: 0}, nature: 'Bold',
	},
	trace: {
		species: 'Jirachi', ability: 'Trace', item: 'Leftovers', gender: '',
		moves: ['Wish', 'Protect', 'Psychic'],
		signatureMove: 'Hero Creation',
		evs: {hp: 248, def: 8, spd: 252}, ivs: {atk: 0}, nature: 'Calm',
	},
	Trickster: {
		species: 'Shiinotic', ability: 'Trillionage Roots', item: 'Leftovers', gender: '',
		moves: ['Strength Sap', 'Cosmic Power', 'Knock Off'],
		signatureMove: 'Soul-Shattering Stare',
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Bold', shiny: true,
	},
	Vexen: {
		species: 'Tauros', ability: 'Aquila\'s Blessing', item: 'Life Orb', gender: 'M',
		moves: ['Earthquake', 'Zen Headbutt', 'Rock Slide'],
		signatureMove: 'Asterius Strike',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	vivalospride: {
		species: 'Darmanitan-Zen', ability: 'Regenerator', item: 'Heavy Duty Boots', gender: 'M',
		moves: ['Teleport', 'Future Sight', 'Toxic'],
		signatureMove: 'DRIP BAYLESS',
		evs: {hp: 252, spa: 252, def: 4}, ivs: {atk: 0}, nature: 'Modest',
	},
	Volco: {
		species: 'Volcanion', ability: 'Speedrunning', item: 'Choice Scarf',
		moves: ['Steam Eruption', ['Vacuum Wave', 'Secret Sword'], 'Overdrive'],
		signatureMove: 'Glitch Exploiting',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid', gender: 'N',
	},
	vooper: {
		species: 'Pancham', ability: 'Qi-Gong', item: 'Eviolite', gender: 'M',
		moves: ['Drain Punch', 'Knock Off', 'Swords Dance'],
		signatureMove: 'Panda Express',
		evs: {hp: 252, atk: 252, spd: 4}, ivs: {atk: 0}, nature: 'Adamant',
	},
	yuki: {
		species: 'Pikachu-Cosplay', ability: 'Combat Training', item: 'Light Ball', gender: 'F',
		moves: ['Quick Attack', 'Agility'],
		signatureMove: 'Class Change',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: ['Modest', 'Timid'],
	},
	'yuki-Cleric': {
		species: 'Pikachu-PhD', ability: 'Triage', item: 'Light Ball', gender: 'F',
		moves: ['Parabolic Charge', 'Wish', 'Baton Pass'],
		signatureMove: 'Class Change',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0},
		skip: 'yuki',
	},
	'yuki-Dancer': {
		species: 'Pikachu-Pop-Star', ability: 'Dancer', item: 'Light Ball', gender: 'F',
		moves: ['Fiery Dance', 'Revelation Dance', 'Quiver Dance'],
		signatureMove: 'Class Change',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0},
		skip: 'yuki',
	},
	'yuki-Ninja': {
		species: 'Pikachu-Libre', ability: 'White Smoke', item: 'Light Ball', gender: 'F',
		moves: ['Water Shuriken', 'Frost Breath', 'Toxic'],
		signatureMove: 'Class Change',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0},
		skip: 'yuki',
	},
	'yuki-Songstress': {
		species: 'Pikachu-Rock-Star', ability: 'Punk Rock', item: 'Light Ball', gender: 'F',
		moves: ['Hyper Voice', 'Overdrive', 'Sing'],
		signatureMove: 'Class Change',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0},
		skip: 'yuki',
	},
	'yuki-Jester': {
		species: 'Pikachu-Belle', ability: 'Weak Armor', item: 'Light Ball', gender: 'F',
		moves: ['Fire Blast', 'Thunder', 'Blizzard'],
		signatureMove: 'Class Change',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0},
		skip: 'yuki',
	},
	Zalm: {
		species: 'Weedle', ability: 'Berserk', item: 'Sitrus Berry', gender: 'M',
		moves: ['Quiver Dance', 'Belch', ['Snipe Shot', 'Power Gem']],
		signatureMove: 'Ingredient Foraging',
		evs: {hp: 252, spa: 252, spd: 4}, ivs: {atk: 0}, nature: 'Modest',
	},
	Zarel: {
		species: 'Meloetta', ability: 'Dancer', item: 'Leftovers', gender: 'N',
		moves: ['Quiver Dance', 'Feather Dance', 'Lunar Dance'],
		signatureMove: 'Relic Dance',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Modest',
	},
	'Zarel-Pirouette': {
		species: 'Meloetta-Pirouette', ability: 'Serene Grace', item: 'Leftovers', gender: 'N',
		moves: ['Revelation Dance', 'Fiery Dance', 'Petal Dance'],
		signatureMove: 'Relic Dance',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Modest',
		skip: 'Zarel',
	},
	Zodiax: {
		species: 'Oricorio-Pom-Pom', ability: 'Primordial Sea', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Quiver Dance', 'Hurricane', 'Thunder'],
		signatureMove: 'Big Storm Coming',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
	},
	Zyg: {
		species: 'Azelf', ability: 'Magic Bounce', item: ['Life Orb', 'Expert Belt'], gender: 'M',
		moves: ['Photon Geyser', 'Knock Off', ['U-turn', 'Play Rough', 'Close Combat']],
		signatureMove: 'Luck of the Draw',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
};

export class RandomStaffBrosTeams extends RandomTeams {
	randomStaffBrosTeam(options: {inBattle?: boolean} = {}) {
		this.enforceNoDirectCustomBanlistChanges();

		const team: PokemonSet[] = [];
		const debug: string[] = []; // Set this to a list of SSB sets to override the normal pool for debugging.
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const monotype = ruleTable.has('sametypeclause') ? this.sample([...this.dex.types.names()]) : false;
		let pool = debug.length ? debug : Object.keys(ssbSets);
		if (monotype && !debug.length) {
			pool = pool.filter(x => this.dex.species.get(ssbSets[x].species).types.includes(monotype));
		}
		const typePool: {[k: string]: number} = {};
		let depth = 0;
		while (pool.length && team.length < this.maxTeamSize) {
			if (depth >= 200) throw new Error(`Infinite loop in Super Staff Bros team generation.`);
			depth++;
			const name = this.sampleNoReplace(pool);
			const ssbSet: SSBSet = this.dex.deepClone(ssbSets[name]);
			if (ssbSet.skip) continue;

			// Enforce typing limits
			if (!(debug.length || monotype)) { // Type limits are ignored when debugging or for monotype variations.
				const species = this.dex.species.get(ssbSet.species);
				if (this.forceMonotype && !species.types.includes(this.forceMonotype)) continue;

				const weaknesses = [];
				for (const type of this.dex.types.names()) {
					const typeMod = this.dex.getEffectiveness(type, species.types);
					if (typeMod > 0) weaknesses.push(type);
				}
				let rejected = false;
				for (const type of weaknesses) {
					if (typePool[type] === undefined) typePool[type] = 0;
					if (typePool[type] >= 3) {
						// Reject
						rejected = true;
						break;
					}
				}
				if (ssbSet.ability === 'Wonder Guard') {
					if (!typePool['wonderguard']) {
						typePool['wonderguard'] = 1;
					} else {
						rejected = true;
					}
				}
				if (rejected) continue;
				// Update type counts
				for (const type of weaknesses) {
					typePool[type]++;
				}
			}

			const set: PokemonSet = {
				name: name,
				species: ssbSet.species,
				item: Array.isArray(ssbSet.item) ? this.sampleNoReplace(ssbSet.item) : ssbSet.item,
				ability: Array.isArray(ssbSet.ability) ? this.sampleNoReplace(ssbSet.ability) : ssbSet.ability,
				moves: [],
				nature: ssbSet.nature ? Array.isArray(ssbSet.nature) ? this.sampleNoReplace(ssbSet.nature) : ssbSet.nature : 'Serious',
				gender: ssbSet.gender || this.sample(['M', 'F', 'N']),
				evs: ssbSet.evs ? {...{hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}, ...ssbSet.evs} :
				{hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84},
				ivs: {...{hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, ...ssbSet.ivs},
				level: this.adjustLevel || ssbSet.level || 100,
				happiness: typeof ssbSet.happiness === 'number' ? ssbSet.happiness : 255,
				shiny: typeof ssbSet.shiny === 'number' ? this.randomChance(1, ssbSet.shiny) : !!ssbSet.shiny,
			};
			while (set.moves.length < 3 && ssbSet.moves.length > 0) {
				let move = this.sampleNoReplace(ssbSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				set.moves.push(move);
			}
			set.moves.push(ssbSet.signatureMove);

			// Any set specific tweaks occur here.
			if (set.name === 'Marshmallon' && !set.moves.includes('Head Charge')) set.moves[this.random(3)] = 'Head Charge';

			team.push(set);

			// Team specific tweaks occur here
			// Swap last and second to last sets if last set has Illusion
			if (team.length === this.maxTeamSize && set.ability === 'Illusion') {
				team[this.maxTeamSize - 1] = team[this.maxTeamSize - 2];
				team[this.maxTeamSize - 2] = set;
			}
		}
		return team;
	}
}

export default RandomStaffBrosTeams;
