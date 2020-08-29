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
	skip?: boolean;
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
	Aelita: {
		species: 'Zygarde', ability: 'Scyphozoa', item: 'Focus Sash', gender: 'F',
		moves: ['Rest', 'Sleep Talk', 'Thousand Arrows'],
		signatureMove: 'XANA\'s Keys To Lyoko',
		evs: {hp: 252, atk: 4, spd: 252}, nature: 'Careful',
	},
	aegii: {
		species: 'Aegislash', ability: 'New Stage', item: 'Leftovers', gender: 'M',
		moves: ['Shadow Claw', 'Iron Head', 'Shadow Sneak'],
		signatureMove: 'K-Shield',
		evs: {hp: 252, def: 64, spd: 192}, nature: 'Sassy',
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
	Annika: {
		species: 'Mewtwo', ability: 'Overprotective', item: 'Mewtwonite Y', gender: 'F',
		moves: [['Rising Voltage', 'Lava Plume'], ['Hex', 'Aurora Beam'], ['Psychic', 'Psyshock']],
		signatureMove: 'Refactor',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Quirky', shiny: true,
	},
	'A Quag To The Past': {
		species: 'Quagsire', ability: 'Carefree', item: 'Quagnium Z', gender: 'M',
		moves: ['Shore Up', 'Flip Turn', ['Haze', 'Toxic']],
		signatureMove: 'Scorching Sands',
		evs: {hp: 252, def: 252, spd: 4}, ivs: {spe: 0}, nature: 'Relaxed',
	},
	'a random duck': {
		species: 'Ducklett', ability: 'Gale Wings v1', item: 'Heavy Duty Boots', gender: 'M',
		moves: ['Thousand Waves', 'Liquidation', ['Brave Bird', 'Dragon Ascent']],
		signatureMove: 'Grapes',
		evs: {hp: 252, atk: 252, spd: 4}, nature: 'Adamant',
	},
	Arcticblast: {
		species: 'Tapu Fini', ability: 'Misty Surge', item: 'Misty Seed', gender: '',
		moves: ['Heal Order', 'Sparkling Aria', ['Clear Smog', 'Moonblast']],
		signatureMove: 'Radiant Burst',
		evs: {hp: 252, def: 252, spe: 4}, ivs: {atk: 0}, nature: 'Bold',
	},
	ArchasTL: {
		species: 'Naviathan', ability: 'Indomitable', item: 'Iron Plate', gender: 'F',
		moves: ['Waterfall', 'Icicle Crash', 'No Retreat'],
		signatureMove: 'Broadside Barrage',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	Averardo: {
		species: 'Hattrem', ability: 'Magic Hat', item: 'Eviolite', gender: 'M',
		moves: ['Nuzzle', 'Flamethrower', 'Healing Wish'],
		signatureMove: 'Hat of Wisdom',
		evs: {hp: 252, def: 4, spd: 252}, ivs: {atk: 0}, nature: 'Sassy',
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
	Blaz: {
		species: 'Carbink', ability: 'Why Worry', item: 'Leftovers', gender: 'N',
		moves: ['Cosmic Power', 'Body Press', 'Recover'],
		signatureMove: 'Bleak December',
		evs: {hp: 4, def: 252, spd: 252}, ivs: {atk: 0}, nature: 'Careful', shiny: true,
	},
	Cake: {
		species: 'Dunsparce', ability: 'Wonder Guard', item: 'Shell Bell', gender: 'M',
		moves: ['Haze', 'Ingrain', ['Poison Gas', 'Corrosive Gas', 'Magic Powder', 'Speed Swap', 'Spite', 'Refresh', 'Screech', 'Trick Room', 'Heal Block', 'Geomancy']],
		signatureMove: 'Kevin',
		evs: {hp: 252, atk: 252, spd: 4}, nature: 'Adamant',
	},
	'cant say': {
		species: 'Volcarona', ability: 'Rage Quit', item: 'Kee Berry', gender: 'M',
		moves: ['Quiver Dance', 'Roost', 'Will-O-Wisp'],
		signatureMove: 'Never Lucky',
		evs: {hp: 248, def: 36, spe: 224}, ivs: {atk: 0}, nature: 'Timid',
	},
	Celestial: {
		species: 'Dragonite', ability: 'Speed Control', item: 'Metal Coat', gender: '',
		moves: ['Swords Dance', 'Thousand Arrows', 'Double Iron Bash'],
		signatureMove: 'Pandora\'s Box',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', shiny: 2,
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
	Darth: {
		species: 'Articuno', ability: 'Guardian Angel', item: 'Heavy Duty Boots', gender: 'M',
		moves: ['Revelation Dance', ['Recover', 'Roost'], 'U-turn'],
		signatureMove: 'Archangel\'s Requiem',
		evs: {hp: 252, def: 128, spd: 128}, nature: 'Bold',
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
		species: 'Flygon', ability: 'Draco Voice', item: 'Throat Spray', gender: 'M',
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
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', level: 100, shiny: 1,
	},
	Felucia: {
		species: 'Uxie', ability: 'Regenerator', item: 'Red Card', gender: 'F',
		moves: ['Strength Sap', ['Psyshock', 'Night Shade'], ['Thief', 'Toxic']],
		signatureMove: 'Rigged Dice',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Calm',
	},
	'frostyicelad ❆': {
		species: 'Frosmoth', ability: 'Ice Shield', item: 'Ice Stone', gender: 'M',
		moves: ['Quiver Dance', 'Bug Buzz', ['Earth Power', 'Sparkling Aria']],
		signatureMove: 'Frosty Wave',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	GMars: {
		species: 'Minior-Meteor', ability: 'Capsule Armor', item: 'White Herb', gender: 'N',
		moves: ['Acrobatics', 'Earthquake', 'Diamond Storm'],
		signatureMove: 'Gacha',
		evs: {hp: 68, atk: 252, spe: 188}, nature: 'Adamant',
	},
	grimAuxiliatrix: {
		species: 'Duraludon', ability: 'Bio-steel', item: 'Assault Vest', gender: '',
		moves: [['Core Enforcer', 'Draco Meteor'], 'Flash Cannon', ['Thunderbolt', 'Fire Blast']],
		signatureMove: 'Do Not Steel',
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
		species: 'Gyarados', ability: 'Dragon Scale', item: 'Gyaradosite', gender: '',
		moves: ['Dragon Dance', 'Earthquake', 'Crabhammer'],
		signatureMove: 'Paranoia',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	Instruct: {
		species: 'Riolu', ability: 'Truant', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Explosion', 'Lunar Dance', 'Memento'],
		signatureMove: 'Savant/Blanco',
		evs: {hp: 252, atk: 4, spe: 252}, nature: 'Jolly',
	},
	Iyarito: {
		species: 'Gengar', ability: 'Pollo Diablo', item: 'Choice Specs', gender: 'F',
		moves: ['Sludge Wave', 'Volt Switch', 'Fusion Flare'],
		signatureMove: 'Patrona Attack',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Timid', shiny: true,
	},
	'Jett x~x': {
		species: 'Sneasel', ability: 'Deceiver', item: 'Heavy Duty Boots', gender: 'M',
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
		skip: true,
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
	Kalalokki: {
		species: 'Wingull', ability: 'Magic Guard', item: 'Kalalokkium Z', gender: 'M',
		moves: ['Tailwind', 'Encore', 'Healing Wish'],
		signatureMove: 'Blackbird',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	KennedyLFC: {
		species: 'Cinderace', ability: 'False Nine', item: 'Choice Band', gender: 'M',
		moves: ['High Jump Kick', 'Triple Axel', 'U-turn'],
		signatureMove: 'Top Bins',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant',
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
	Kris: {
		species: 'Unown', ability: 'Protean', item: 'Life Orb', gender: 'N',
		moves: ['Light of Ruin', 'Psystrike', ['Secret Sword', 'Mind Blown', 'Seed Flare']],
		signatureMove: 'Alphabet Soup',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Lamp: {
		species: 'Lampent', ability: 'Candlewax', item: 'Eviolite', gender: 'M',
		moves: ['Nasty Plot', 'Searing Shot', 'Strength Sap'],
		signatureMove: 'Soul Swap',
		evs: {def: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	'Level 51': {
		species: 'Togekiss', ability: 'Wonder Guard', item: 'Choice Scarf', gender: 'M',
		moves: ['U-turn', 'Parting Shot', 'Baton Pass'],
		signatureMove: 'Swan Song',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	Lionyx: {
		species: 'Gardevoir', ability: 'Tension', item: 'Blunder Policy', gender: 'F',
		moves: [['Psychic', 'Psystrike'], 'Quiver Dance', [
			'Blizzard', 'Focus Blast', 'Hurricane', 'Hydro Pump', 'Inferno', 'Zap Cannon',
		]],
		signatureMove: 'Big Bang',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid', shiny: true,
	},
	'Litt♥Eleven': {
		species: 'Bisharp', ability: 'Dark Royalty', item: 'Black Glasses', gender: 'M',
		moves: ['Sucker Punch', 'Knock Off', 'Iron Head'],
		signatureMove: '/nexthunt',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant', shiny: true,
	},
	'Mad Monty ¾°': {
		species: 'Zekrom', ability: 'Petrichor', item: 'Damp Rock', gender: 'N',
		moves: ['Bolt Strike', 'Dragon Claw', 'Liquidation'],
		signatureMove: 'Ca-LLAMA-ty',
		evs: {atk: 252, def: 4, spe: 252}, ivs: {def: 0}, nature: 'Jolly', shiny: true,
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
	Mitsuki: {
		species: 'Leafeon', ability: 'Photosynthesis', item: ['Life Orb', 'Miracle Seed'], gender: 'M',
		moves: ['Leaf Blade', 'Attack Order', 'Thousand Arrows'],
		signatureMove: 'Terraforming',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	'Morfent ( _̀> ̀)': {
		species: 'Banette', ability: 'Normalize', item: 'Ghost Memory', gender: 'M',
		moves: ['Skill Swap', 'Multi-Attack', 'Recover'],
		signatureMove: 'OwO wuts dis?',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Adamant',
	},
	n10siT: {
		species: 'Hoopa', ability: 'Greedy Magician', item: 'Focus Sash', gender: 'N',
		moves: ['Hyperspace Hole', 'Shadow Ball', 'Aura Sphere'],
		signatureMove: 'Unbind',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Nolali: {
		species: 'Litwick', ability: 'Burning Soul', item: 'Spooky Plate', gender: 'F',
		moves: ['Shadow Ball', 'Flamethrower', 'Memento'],
		signatureMove: 'Mad Hacks',
		evs: {hp: 252, spa: 252, spd: 4}, ivs: {atk: 0}, nature: 'Modest', shiny: true,
	},
	'OM~!': {
		species: 'Magneton', ability: 'Triage', item: 'Metronome', gender: 'N',
		moves: ['Parabolic Charge', 'Oblivion Wing', 'Giga Drain'],
		signatureMove: 'MechOMnism',
		evs: {hp: 252, spa: 252, spd: 4}, nature: 'Modest', shiny: true,
	},
	Overneat: {
		species: 'Absol', ability: 'Intimidate', item: 'Absolite', gender: 'M',
		moves: ['Play Rough', 'U-turn', 'Close Combat'],
		signatureMove: 'Healing you?',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	'Paradise ╱╲☼': {
		species: 'Slaking', ability: 'Unaware', item: 'Choice Scarf', gender: '',
		moves: ['Sacred Fire', 'Spectral Thief', 'Icicle Crash'],
		signatureMove: 'Rapid Turn',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	'Perish Song': {
		species: 'Rhydon', ability: 'Soup Sipper', item: 'Rocky Helmet', gender: 'M',
		moves: ['Swords Dance', 'Rock Blast', 'Earthquake'],
		signatureMove: 'Shifting Rocks',
		evs: {hp: 252, atk: 4, def: 252}, nature: 'Impish',
	},
	phiwings99: {
		species: 'Froslass', ability: 'Plausible Deniability', item: 'Boatium Z', gender: 'M',
		moves: ['Destiny Bond', 'Ice Beam', 'Haze'],
		signatureMove: 'Moongeist Beam',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
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
	ptoad: {
		species: 'Palpitoad', ability: 'Swampy Surge', item: 'Eviolite', gender: 'M',
		moves: ['Recover', 'Refresh', ['Sludge Bomb', 'Sludge Wave']],
		signatureMove: 'Croak',
		evs: {hp: 248, def: 8, spd: 252}, ivs: {atk: 0}, nature: 'Calm',
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
	Rach: {
		species: 'Spinda', ability: 'BURN IT DOWN!', item: 'Leftovers', gender: 'F',
		moves: ['Extreme Speed', 'Recover', 'Knock Off'],
		signatureMove: 'Spinda Wheel',
		evs: {hp: 252, atk: 4, def: 252}, nature: 'Impish',
	},
	'Raj.Shoot': {
		species: 'Swampert', ability: 'Sap Sipper', item: 'Life Orb', gender: 'N',
		moves: ['Earthquake', 'Waterfall', 'Ice Punch'],
		signatureMove: 'Fan Service',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
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
	Robb576DuskMane: {
		species: 'Necrozma-Dusk-Mane', ability: 'The Numbers Game', item: 'Leftovers', gender: 'M',
		moves: ['Sunsteel Strike', 'Toxic', 'Rapid Spin'],
		signatureMove: 'Mode [7: Defensive]',
		evs: {hp: 252, atk: 4, spd: 252}, nature: 'Careful',
		skip: true, // This set is transformed into by The Numbers Game ability
	},
	Robb576Ultra: {
		species: 'Necrozma-Ultra', ability: 'The Numbers Game', item: 'Modium-6 Z', gender: 'M',
		moves: ['Earthquake', 'Dynamax Cannon', 'Fusion Flare'],
		signatureMove: 'Photon Geyser',
		evs: {atk: 204, spa: 200, spe: 104}, ivs: {atk: 0}, nature: 'Hasty',
		skip: true, // This set is transformed into by The Numbers Game ability
	},
	SectoniaServant: {
		species: 'Reuniclus', ability: 'Magic Guard', item: 'Leftovers', gender: 'M',
		moves: [['Psystrike', 'Psychic'], 'Moonblast', 'Recover'],
		signatureMove: 'Homunculus\'s Vanity',
		evs: {hp: 252, def: 4, spa: 252}, ivs: {atk: 0, spe: 0}, nature: 'Quiet', shiny: true,
	},
	Segmr: {
		species: 'Ninetales-Alola', ability: 'wAll In', item: 'Light Clay', gender: 'M',
		moves: ['Recover', 'Will-O-Wisp', 'Freeze-Dry'],
		signatureMove: 'Disconnect',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Modest',
	},
	Shadecession: {
		species: 'Honchkrow', ability: 'Shady Deal', item: 'Heavy Duty Boots', gender: 'M',
		moves: ['Knock Off', 'Roost', 'Brave Bird'],
		signatureMove: 'Shade Uppercut',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', shiny: true,
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
	tennisace: {
		species: 'Yamper', ability: 'Stout Build', item: 'Eviolite', gender: 'M',
		moves: ['Crunch', 'Play Rough', 'Slack Off'],
		signatureMove: 'Corgi Stampede',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', shiny: true,
	},
	Tenshi: {
		species: 'Stoutland', ability: 'Royal Coat', item: 'Leftovers', gender: 'M',
		moves: ['Knock Off', 'Thousand Waves', ['Play Rough', 'Power Whip']],
		signatureMove: 'Stony Kibbles',
		evs: {atk: 128, spd: 252, spe: 128}, nature: 'Jolly',
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
	vooper: {
		species: 'Pancham', ability: 'Qi-Gong', item: 'Eviolite', gender: 'M',
		moves: ['Drain Punch', 'Knock Off', 'Swords Dance'],
		signatureMove: 'Panda Express',
		evs: {hp: 252, atk: 252, spd: 4}, ivs: {atk: 0}, nature: 'Adamant',
	},
	xJoelituh: {
		species: 'Marowak-Alola', ability: 'Mountaineer', item: 'Rare Bone', gender: 'M',
		moves: ['Poltergeist', 'Fire Punch', 'Stomping Tantrum'],
		signatureMove: 'Burn Bone',
		evs: {hp: 248, atk: 8, spd: 252}, nature: 'Careful', shiny: true,
	},
	yuki: {
		species: 'Pikachu-Cosplay', ability: 'Combat Training', item: 'Light Ball', gender: 'F',
		moves: ['Quick Attack'],
		signatureMove: 'Class Change',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: ['Modest', 'Timid'],
	},
	'yuki-Cleric': {
		species: 'Pikachu-PhD', ability: 'Triage', item: 'Light Ball', gender: 'F',
		moves: ['Parabolic Charge', 'Wish', 'Baton Pass'],
		signatureMove: 'Class Change',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0},
		skip: true,
	},
	'yuki-Dancer': {
		species: 'Pikachu-Pop-Star', ability: 'Dancer', item: 'Light Ball', gender: 'F',
		moves: ['Fiery Dance', 'Revelation Dance', 'Lunar Dance'],
		signatureMove: 'Class Change',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0},
		skip: true,
	},
	'yuki-Ninja': {
		species: 'Pikachu-Libre', ability: 'White Smoke', item: 'Light Ball', gender: 'F',
		moves: ['Water Shuriken', 'Acrobatics', 'Toxic'],
		signatureMove: 'Class Change',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0},
		skip: true,
	},
	'yuki-Songstress': {
		species: 'Pikachu-Rock-Star', ability: 'Punk Rock', item: 'Light Ball', gender: 'F',
		moves: ['Hyper Voice', 'Overdrive', 'Sing'],
		signatureMove: 'Class Change',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0},
		skip: true,
	},
	'yuki-Jester': {
		species: 'Pikachu-Belle', ability: 'Tangled Feet', item: 'Light Ball', gender: 'F',
		moves: ['Present', 'Metronome', 'Teeter Dance'],
		signatureMove: 'Class Change',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0},
		skip: true,
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
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Timid',
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
			if (ssbSet.skip) continue;

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
				if (ssbSet.ability === 'Wonder Guard') {
					if (typePool['wonderguard'] === undefined) {
						typePool['wonderguard'] = 1;
					} else {
						rejected = true;
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
				nature: ssbSet.nature ? Array.isArray(ssbSet.nature) ? this.sampleNoReplace(ssbSet.nature) : ssbSet.nature : 'Serious',
				gender: ssbSet.gender || this.sample(['M', 'F', 'N']),
				evs: Object.assign({hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}, ssbSet.evs),
				ivs: Object.assign({hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, ssbSet.ivs),
				level: ssbSet.level || 100,
				happiness: typeof ssbSet.happiness === 'number' ? ssbSet.happiness : 255,
				shiny: typeof ssbSet.shiny === 'number' ? this.randomChance(1, ssbSet.shiny) : !!ssbSet.shiny,
			};
			if (!ssbSet.evs) set.evs = {hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84};
			while (set.moves.length < 3 && ssbSet.moves.length > 0) {
				let move = this.sampleNoReplace(ssbSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				set.moves.push(move);
			}
			set.moves.push(ssbSet.signatureMove);

			// Any set specific tweaks occur here.
			if (set.name === 'quadrophenic') set.moves[this.random(2) + 1] = 'Conversion';
			if (set.name === 'aegii' && this.randomChance(1, 2)) {
				set.moves[set.moves.indexOf('Shadow Claw')] = 'Shadow Ball';
				set.moves[set.moves.indexOf('Iron Head')] = 'Flash Cannon';
			}
			if (set.name === 'Marshmallon' && !set.moves.includes('Head Charge')) set.moves[this.random(3)] = 'Head Charge';

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
