import RandomTeams from '../../random-teams';

export interface SSBSet {
	species: string;
	ability: string | string[];
	item: string | string[];
	gender: GenderName | GenderName[];
	moves: (string | string[])[];
	signatureMove: string;
	evs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	ivs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	nature?: string | string[];
	shiny?: number | boolean;
	level?: number;
	happiness?: number;
	skip?: string;
	teraType?: string | string[];
}
interface SSBSets {[k: string]: SSBSet}

export const ssbSets: SSBSets = {
	/*
	// Example:
	Username: {
		species: 'Species', ability: 'Ability', item: 'Item', gender: '',
		moves: ['Move Name', ['Move Name', 'Move Name']],
		signatureMove: 'Move Name',
		evs: {stat: number}, ivs: {stat: number}, nature: 'Nature', teraType: 'Type', level: 100, shiny: false,
	},
	// Species, ability, and item need to be captialized properly ex: Ludicolo, Swift Swim, Life Orb
	// Gender can be M, F, N, or left as an empty string
	// each slot in moves needs to be a string (the move name, captialized properly ex: Hydro Pump), or an array of strings (also move names)
	// signatureMove also needs to be capitalized properly ex: Scripting
	// You can skip Evs (defaults to 84 all) and/or Ivs (defaults to 31 all), or just skip part of the Evs (skipped evs are 0) and/or Ivs (skipped Ivs are 31)
	// You can also skip shiny, defaults to false. Level can be skipped (defaults to 100).
	// Nature needs to be a valid nature with the first letter capitalized ex: Modest
	*/
	// Please keep sets organized alphabetically based on staff member name!
	aegii: {
		species: 'Scizor', ability: 'Unburden', item: 'Lansat Berry', gender: 'M',
		moves: ['Acrobatics', 'Attack Order', ['Cross Chop', 'Night Slash']],
		signatureMove: 'Equip Aegislash',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant', teraType: 'Flying',
	},
	Aelita: {
		species: 'Melmetal', ability: 'Fortified Metal', item: 'Leftovers', gender: '',
		moves: ['Heavy Slam', 'Bitter Blade', 'Liquidation'],
		signatureMove: 'Smelt',
		evs: {hp: 252, atk: 4, spd: 252}, nature: 'Careful', teraType: 'Steel', shiny: true,
	},
	Alex: {
		species: 'Sprigatito', ability: 'Pawprints', item: 'Eviolite', gender: '',
		moves: ['Substitute', 'Protect', 'Magic Powder'],
		signatureMove: 'Spicier Extract',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Careful', teraType: 'Water',
	},
	aQrator: {
		species: 'Totodile', ability: 'Neverending fHunt', item: 'Eviolite', gender: 'F',
		moves: ['Whirlpool', 'Noble Roar', 'Slack Off'],
		signatureMove: "Tori's Stori",
		evs: {hp: 252, def: 4, spd: 252}, ivs: {atk: 0}, nature: 'Sassy', teraType: 'Fighting',
	},
	'A Quag To The Past': {
		species: 'Quagsire', ability: 'Quag of Ruin', item: 'Leftovers', gender: 'M',
		moves: ['Surging Strikes', 'Precipice Blades', 'Gunk Shot'],
		signatureMove: 'Sire Switch',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Careful', teraType: 'Water',
	},
	'A Quag To The Past-Clodsire': {
		species: 'Clodsire', ability: 'Clod of Ruin', item: 'Leftovers', gender: 'M',
		moves: ['Coil', 'Strength Sap', 'Toxic'],
		signatureMove: 'Sire Switch',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Careful', teraType: 'Poison', skip: 'A Quag To The Past',
	},
	Archas: {
		species: 'Lilligant', ability: 'Saintly Bullet', item: 'Lilligantium Z', gender: 'F',
		moves: ['Giga Drain', 'Snipe Shot', 'Hurricane'],
		signatureMove: 'Quiver Dance',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
	},
	Arya: {
		species: 'Flygon', ability: 'Tinted Lens', item: 'Flygonite', gender: 'F',
		moves: ['Clanging Scales', 'Roost', 'Bug Buzz'],
		signatureMove: 'Anyone can be killed',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', shiny: false,
	},
	Artemis: {
		species: 'Genesect', ability: 'Supervised Learning', item: 'Choice Specs', gender: 'N',
		moves: [],
		signatureMove: 'Automated Response​',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Serious', shiny: true,
	},
	berry: {
		species: 'Regirock', ability: 'Sturdy', item: 'Maranga Berry', gender: 'F',
		moves: ['Curse', 'Salt Cure', 'Stone Axe'],
		signatureMove: 'what kind',
		evs: {hp: 252, atk: 4, spd: 252}, nature: 'Careful', teraType: 'Rock',
	},
	Blitz: {
		species: 'Chi-Yu', ability: 'Blitz of Ruin', item: 'Life Orb', gender: 'N',
		moves: ['Fiery Wrath', 'Lava Plume', 'Nasty Plot'],
		signatureMove: 'Geyser Blast',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Modest', teraType: 'Water', shiny: true,
	},
	Cake: {
		species: 'Dudunsparce-Three-Segment', ability: 'Not Enough Removal', item: 'Leftovers', gender: 'N',
		moves: [
			['Silk Trap', 'Obstruct', 'Max Guard', 'Spiky Shield', 'King\'s Shield', 'Protect', 'Detect', 'Baneful Bunker'],
			['Rapid Spin', 'Mortal Spin'],
			[
				'Rest', 'Lunar Blessing', 'Healing Wish', 'Aromatherapy',
				'Heal Bell', 'Copycat', 'Grass Whistle', 'Tearful Look', 'Transform',
			],
		],
		signatureMove: 'Shawn',
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Impish', teraType: 'Ghost', shiny: 957,
	},
	Chloe: {
		species: 'Tsareena', ability: 'Acetosa', item: 'Assault Vest', gender: 'F',
		moves: ['Rapid Spin', 'Fishious Rend', 'Stone Axe'],
		signatureMove: 'De Todas las Flores',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', teraType: 'Grass', shiny: true,
	},
	clerica: {
		species: 'Mimikyu', ability: 'Masquerade', item: 'Ghostium Z', gender: 'F',
		moves: ['Protect', 'Substitute', 'Phantom Force'],
		signatureMove: 'Stockholm Syndrome',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
	Coolcodename: {
		species: 'Victini', ability: 'Firewall', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Searing Shot', 'Psychic', 'Dazzling Gleam'],
		signatureMove: 'Haxer\'s Will',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: 'Fairy', shiny: 1024,
	},
	'Cor\'Jon': {
		species: 'Dachsbun', ability: 'Painful Exit', item: 'Leftovers', gender: '',
		moves: ['Wish', 'Rest', 'Play Rough'],
		signatureMove: 'Baker\'s Douze Off',
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Impish', teraType: 'Fairy',
	},
	'Dawn of Artemis': {
		species: 'Necrozma', ability: 'Form Change', item: 'Expert Belt', gender: 'F',
		moves: ['Calm Mind', 'Photon Geyser', 'Earth Power'],
		signatureMove: 'Magical Focus',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid', teraType: 'Psychic', shiny: 8192,
	},
	'Dawn of Artemis-Ultra': {
		species: 'Necrozma-Ultra', ability: 'Form Change', item: 'Expert Belt', gender: 'F',
		moves: ['Swords Dance', 'Photon Geyser', 'Outrage'],
		signatureMove: 'Magical Focus',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', teraType: 'Dragon', skip: 'Dawn of Artemis',
	},
	DaWoblefet: {
		species: 'Wobbuffet', ability: 'Shadow Artifice', item: 'Iapapa Berry', gender: 'M',
		moves: ['Counter', 'Mirror Coat', 'Encore'],
		signatureMove: 'Super Ego Inflation',
		evs: {hp: 252, def: 252, spd: 4}, ivs: {spe: 0}, nature: 'Relaxed', teraType: 'Fairy',
	},
	deftinwolf: {
		species: 'Yveltal', ability: 'Sharpness', item: 'Dread Plate', gender: '',
		moves: ['Aerial Ace', 'Ceaseless Edge', 'Cross Poison'],
		signatureMove: 'Trivial Pursuit',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Adamant', teraType: 'Poison',
	},
	Elly: {
		species: 'Thundurus', ability: 'Storm Surge', item: 'Heavy-Duty Boots', gender: 'F',
		moves: ['Wildbolt Storm', 'Sandsear Storm', 'Volt Switch'],
		signatureMove: 'Sustained Winds',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: 'Ground',
	},
	Frozoid: {
		species: 'Gible', ability: 'Snowballer', item: 'Eviolite', gender: 'M',
		moves: ['Dragon Dance', 'Dragon Rush', 'Precipice Blades'],
		signatureMove: 'Flat out falling',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Adamant', teraType: 'Any', shiny: true,
	},
	Ganjafin: {
		species: 'Wiglett', ability: 'Gambling Addiction', item: 'Eviolite', gender: 'M',
		moves: ['Wrap', 'Cosmic Power', 'Strength Sap'],
		signatureMove: 'Wiggling Strike',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Timid', teraType: 'Grass', shiny: 2,
	},
	havi: {
		species: 'Gastly', ability: 'Mensis Cage', item: 'Leftovers', gender: 'F',
		moves: ['Astral Barrage', 'Moonblast', 'Substitute'],
		signatureMove: 'Augur of Ebrietas',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: 'Ghost',
	},
	HiZo: {
		species: 'Zoroark-Hisui', ability: 'Martyr Complex', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Last Respects', 'Boomburst', 'Spirit Break'],
		signatureMove: 'Scapegoat',
		evs: {atk: 252, spa: 4, spe: 252}, nature: 'Naive', teraType: 'Fairy',
	},
	HoeenHero: {
		species: 'Ludicolo', ability: 'Misspelled', item: 'Life Orb', gender: 'M',
		moves: [['Hydro Pump', 'Surf'], 'Giga Drain', 'Ice Beam'],
		signatureMove: 'Re-Program',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid', teraType: 'Water',
	},
	hsy: {
		species: 'Ursaluna', ability: 'Hustle', item: 'Blunder Policy', gender: 'M',
		moves: ['Drill Peck', 'Egg Bomb', 'Metronome'],
		signatureMove: 'Wonder Wing',
		evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant', teraType: 'Flying',
	},
	Hydrostatics: {
		species: 'Pichu-Spiky-eared', ability: 'Hydrostatic Positivity', item: 'Eviolite', gender: 'M',
		moves: ['Hydro Pump', 'Thunder', 'Ice Beam'],
		signatureMove: 'Hydrostatics',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Modest', teraType: 'Water', shiny: 2,
	},
	'in the hills': {
		species: 'Gligar', ability: 'Illiterit', item: 'Eviolite', gender: 'M',
		moves: ['Roost', 'Knock Off', 'Tidy Up'],
		signatureMove: '10-20-40',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Careful', teraType: 'Water',
	},
	ironwater: {
		species: 'Jirachi', ability: 'Good as Gold', item: 'Leftovers', gender: 'N',
		moves: ['Swords Dance', 'Zen Headbutt', 'Hammer Arm'],
		signatureMove: 'Jirachi Ban Hammer',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', teraType: 'Steel',
	},
	'Irpachuza!': {
		species: 'Mr. Mime', ability: 'Mime knows best', item: 'Irpatuzinium Z', gender: 'M',
		moves: [['Destiny Bond', 'Lunar Dance'], 'Parting Shot', 'Taunt'],
		signatureMove: 'Fleur Cannon',
		evs: {hp: 252, spa: 4, spd: 252}, ivs: {atk: 0}, nature: 'Modest',
	},
	Isaiah: {
		species: 'Medicham', ability: 'Psychic Surge', item: 'Medichamite', gender: 'M',
		moves: ['Close Combat', 'Knock Off', 'Triple Axel'],
		signatureMove: 'Simple Gameplan',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', shiny: true,
	},
	'J0rdy004 ♫': {
		species: 'Vulpix-Alola', ability: 'Fortifying Frost', item: 'Never-Melt Ice', gender: 'N',
		moves: ['Blizzard', 'Focus Blast', 'Recover'],
		signatureMove: 'Snowy Samba',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', shiny: 4,
	},
	kenn: {
		species: 'Larvitar', ability: 'Deserted Dunes', item: 'Eviolite', gender: 'M',
		moves: ['Salt Cure', 'Shore Up', ['Precipice Blades', 'Headlong Rush']],
		signatureMove: 'Stone Faced',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Adamant', teraType: 'Rock', shiny: true,
	},
	Kennedy: {
		species: 'Cinderace', ability: 'Anfield', item: 'Berserk Gene', gender: 'M',
		moves: ['Blaze Kick', ['Triple Kick', 'Trop Kick'], 'U-turn'],
		signatureMove: 'Hat-Trick',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Any',
	},
	Kiwi: {
		species: 'Minccino', ability: 'Sure Hit Sorcery', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Dynamic Punch', 'Substitute', 'Noble Roar'],
		signatureMove: 'Mad Manifest',
		evs: {hp: 252, atk: 144, spe: 112}, nature: 'Adamant', teraType: 'Fighting', shiny: true,
	},
	Kris: {
		species: 'Nymble', ability: 'Cacophony', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Boomburst', 'Bug Buzz', 'Torch Song'],
		signatureMove: 'ok',
		evs: {hp: 252, def: 4, spa: 252}, nature: 'Quiet', teraType: 'Normal',
	},
	Krytocon: {
		species: 'Mawile', ability: 'Curse of Dexit', item: 'Mawilite', gender: 'M',
		moves: ['Sucker Punch', 'Fire Lash', 'Play Rough'],
		signatureMove: 'Attack of Opportunity',
		evs: {hp: 252, atk: 252, spd: 4}, nature: 'Adamant', shiny: 1024,
	},
	Lasen: {
		species: 'Zekrom', ability: 'Idealized World', item: 'Leftovers', gender: 'M',
		moves: ['Volt Switch', 'Fusion Bolt', 'Dragon Claw'],
		signatureMove: 'Rise Above',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Fire',
	},
	Lily: {
		species: 'Togedemaru', ability: 'Unaware', item: 'Leftovers', gender: 'F',
		moves: ['Victory Dance', 'Plasma Fists', 'Meteor Mash'],
		signatureMove: 'Recharge',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Careful', teraType: 'Fairy', shiny: 1734,
	},
	Loethalion: {
		species: 'Ralts', ability: 'Psychic Surge', item: 'Gardevoirite', gender: '',
		moves: [['Esper Wing', 'Lumina Crash', 'Psychic Noise'], ['Agility', 'Calm Mind'], ['Draining Kiss', 'Matcha Gotcha']],
		signatureMove: 'Darkmoon Cackle',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid', shiny: true,
	},
	Lumari: {
		species: 'Ponyta-Galar', ability: 'Pyrotechnic', item: 'Eviolite', gender: 'F',
		moves: ['Substitute', ['Sappy Seed', 'Sizzly Slide'], 'Magical Torque'],
		signatureMove: 'Mystical Bonfire',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Fairy',
	},
	Lunell: {
		species: 'Vaporeon', ability: 'Low Tide, High Tide', item: 'Leftovers', gender: 'F',
		moves: ['Hydro Pump', 'Thunder', 'Moonlight'],
		signatureMove: 'Praise the Moon',
		evs: {hp: 252, def: 4, spa: 252}, ivs: {atk: 0}, nature: 'Calm', teraType: 'Fairy', shiny: 512,
	},
	'Mad Monty': {
		species: 'Castform', ability: 'Climate Change', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Weather Ball', 'Defog', ['Solar Beam', 'Thunder', 'Aurora Veil']],
		signatureMove: 'Storm Shelter',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Modest', teraType: 'Rock',
	},
	Mathy: {
		species: 'Furret', ability: 'Dynamic Typing', item: 'Big Root', gender: 'M',
		moves: ['Bitter Blade', 'Swords Dance', 'Taunt'],
		signatureMove: 'Breaking Change',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Ghost',
	},
	Meteordash: {
		species: 'Tatsugiri', ability: 'Shadow Shield', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Fickle Beam', 'Scald', 'Glare'],
		signatureMove: 'Plagiarism',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid', teraType: 'Steel',
	},
	Mex: {
		species: 'Dialga', ability: 'Time Dilation', item: 'Adamant Orb', gender: 'N',
		moves: ['Dragon Pulse', 'Flash Cannon', ['Aura Sphere', 'Volt Switch', 'Meteor Beam']],
		signatureMove: 'Time Skip',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid', teraType: 'Steel', shiny: true,
	},
	Mia: {
		species: 'Mewtwo', ability: 'Hacking', item: 'Mewtwonite X', gender: 'F',
		moves: ['Photon Geyser', 'Drain Punch', 'Iron Head'],
		signatureMove: 'Testing in Production',
		evs: {atk: 252, spa: 4, spe: 252}, nature: 'Jolly',
	},
	Monkey: {
		species: 'Infernape', ability: 'Harambe Hit', item: 'Blunder Policy', gender: 'M',
		moves: ['Dynamic Punch', 'Plasma Fists', 'Fire Punch'],
		signatureMove: 'Banana Breakfast',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant', teraType: 'Electric', shiny: 69,
	},
	Ney: {
		species: 'Banette', ability: 'Insomnia', item: 'Banettite', gender: 'M',
		moves: ['Destiny Bond', 'Will-O-Wisp', 'Parting Shot'],
		signatureMove: 'Shadow Dance',
		evs: {hp: 252, atk: 252, def: 4}, ivs: {spe: 0}, nature: 'Brave', shiny: true,
	},
	Notater517: {
		species: 'Incineroar', ability: 'Vent Crosser', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Ceaseless Edge', 'Pyro Ball', ['Rapid Spin', 'Encore']],
		signatureMove: '~nyaa',
		evs: {hp: 252, atk: 252, spd: 4}, nature: 'Adamant', teraType: 'Steel',
	},
	PartMan: {
		species: 'Chandelure', ability: 'C- Tier Shitposter', item: 'Leek', gender: 'M',
		moves: ['Searing Shot', 'Hex', 'Morning Sun'],
		signatureMove: 'Alting',
		evs: {hp: 252, spa: 69, spe: 188}, nature: 'Timid',
	},
	Peary: {
		species: 'Klinklang', ability: 'Levitate', item: 'Pearyum Z', gender: '',
		moves: ['Lock On', 'Sheer Cold', 'Substitute'],
		signatureMove: 'Gear Grind',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	phoopes: {
		species: 'Jynx', ability: 'I Did It Again', item: 'Red Card', gender: 'F',
		moves: ['Lovely Kiss', 'Psychic', 'Toxic'],
		signatureMove: 'Gen 1 Blizzard',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid', teraType: 'Ice',
	},
	PYRO: {
		species: 'Kingambit', ability: 'Hardcore Hustle', item: 'Leftovers', gender: 'M',
		moves: ['Kowtow Cleave', 'Sucker Punch', 'Swords Dance'],
		signatureMove: 'Meat Grinder',
		evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant', teraType: 'Flying',
	},
	'Quite Quiet': {
		species: 'Ribombee', ability: 'Fancy Scarf', item: ['Life Orb', 'Leftovers'], gender: 'F',
		moves: ['Roost', 'Moonblast', ['Aura Sphere', 'U-turn']],
		signatureMove: '*Worried Noises*',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid', teraType: 'Flying',
		// The nature not being Quiet is a crime
	},
	ReturnToMonkey: {
		species: 'Oranguru', ability: 'Monke See Monke Do', item: 'Twisted Spoon', gender: 'M',
		moves: ['Hyper Voice', 'Psyshock', 'Focus Blast'],
		signatureMove: 'Monke Magic',
		evs: {hp: 252, def: 4, spa: 252}, ivs: {spe: 0}, nature: 'Quiet', teraType: 'Fighting',
	},
	Rumia: {
		species: 'Duskull', ability: 'Youkai of the Dusk', item: 'Eviolite', gender: 'F',
		moves: ['Infernal Parade', 'Strength Sap', 'Mortal Spin'],
		signatureMove: 'Midnight Bird',
		evs: {hp: 252, def: 252, spa: 4}, nature: 'Bold', teraType: 'Dark',
	},
	Scotteh: {
		species: 'Suicune', ability: 'Water Absorb', item: 'Leftovers', gender: '',
		moves: ['Calm Mind', 'Scald', 'Ice Beam'],
		signatureMove: 'Purification',
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Bold', teraType: 'Water',
	},
	Siegfried: {
		species: 'Ampharos', ability: 'Static', item: 'Ampharosite', gender: 'M',
		moves: ['Calm Mind', 'Thunderclap', 'Draco Meteor'],
		signatureMove: 'BoltBeam',
		evs: {hp: 252, spa: 252, spd: 4}, ivs: {atk: 0}, nature: 'Modest', shiny: 64,
	},
	sharp_claw: {
		species: 'Sneasel', ability: 'Regenerator', item: 'Heavy-Duty Boots', gender: 'F',
		moves: ['Knock Off', 'Ice Spinner', 'Ice Shard'],
		signatureMove: 'Treacherous Traversal',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', teraType: 'Poison',
	},
	'sharp_claw-Rough': {
		species: 'Sneasel-Hisui', ability: 'Regenerator', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Combat Torque', 'Noxious Torque', 'Mach Punch'],
		signatureMove: 'Treacherous Traversal',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', teraType: 'Poison', skip: 'sharp_claw',
	},
	snake: {
		species: 'Fidgit', ability: 'Persistent', item: ['Mental Herb', 'Covert Cloak'], gender: 'M',
		moves: ['Tailwind', 'Healing Wish', 'Taunt'],
		signatureMove: 'Concept Relevant',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Water',
	},
	spoo: {
		species: 'Mumbao', ability: 'Dazzling', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Will-O-Wisp', 'Strength Sap', 'Parting Shot'],
		signatureMove: 'spoo',
		evs: {hp: 252, spa: 4, spe: 252}, nature: 'Timid', teraType: 'Steel',
	},
	'spoo-Jumbao': {
		species: 'Jumbao', ability: 'Drought', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Moonblast', 'Giga Drain', 'Fiery Dance'],
		signatureMove: 'spoo',
		evs: {hp: 252, spa: 252, spd: 4}, nature: 'Modest', teraType: 'Fire', skip: 'spoo',
	},
	Sulo: {
		species: 'Reuniclus', ability: 'Protection of the Gelatin', item: 'Life Orb', gender: 'M',
		moves: ['Calm Mind', 'Draining Kiss', 'Stored Power'],
		signatureMove: 'Vengeful Mood',
		evs: {hp: 252, def: 252, spd: 4}, ivs: {atk: 0}, nature: 'Bold', teraType: 'Fairy', shiny: true,
	},
	Swiffix: {
		species: 'Piplup', ability: 'Stinky', item: 'Loaded Dice', gender: 'M',
		moves: ['Water Shuriken', 'Nasty Plot', 'Vacuum Wave'],
		signatureMove: 'Stink Bomb',
		evs: {hp: 252, def: 4, spa: 252}, nature: 'Modest', teraType: 'Water',
	},
	Teclis: {
		species: 'Gallade', ability: 'Sharpness', item: 'Life Orb', gender: 'M',
		moves: ['Sacred Sword', 'Psycho Cut', 'Leaf Blade'],
		signatureMove: 'Rising Sword',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant', teraType: 'Psychic',
	},
	Theia: {
		species: 'Litwick', ability: 'Power Abuse', item: 'Eviolite', gender: 'F',
		moves: ['Shadow Ball', 'Flamethrower', 'Giga Drain'],
		signatureMove: 'Body Count',
		evs: {hp: 252, spa: 252, spd: 4}, ivs: {atk: 0}, nature: 'Modest', teraType: 'Ghost',
	},
	TheJesucristoOsAma: {
		species: 'Arceus', ability: 'The Grace Of Jesus Christ', gender: 'N',
		item: [
			'Draco Plate', 'Dread Plate', 'Earth Plate', 'Fist Plate', 'Flame Plate', 'Icicle Plate', 'Insect Plate', 'Iron Plate', 'Meadow Plate',
			'Mind Plate', 'Pixie Plate', 'Sky Plate', 'Splash Plate', 'Spooky Plate', 'Stone Plate', 'Toxic Plate', 'Zap Plate',
		],
		moves: ['Earthquake', 'Surf', 'Judgment'],
		signatureMove: 'The Love Of Christ',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
	},
	trace: {
		species: 'Delphox', ability: 'Eyes of Eternity', item: 'Life Orb', gender: 'F',
		moves: ['Calm Mind', 'Inferno', 'Recover'],
		signatureMove: 'Chronostasis',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Modest', teraType: 'Psychic',
	},
	'Two of Roses': {
		species: 'Luxray', ability: 'As We See', item: 'Mirror Herb', gender: 'M',
		moves: ['Knock Off', 'Supercell Slam', 'Trailblaze'],
		signatureMove: 'Dilly Dally',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', teraType: 'Flying', shiny: 1024,
	},
	UT: {
		species: 'Talonflame', ability: 'Gale Guard', item: 'Life Orb', gender: 'M',
		moves: ['Brave Bird', 'Roost', ['Swords Dance', 'Flare Blitz', 'Will-O-Wisp']],
		signatureMove: 'Wingover',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant', teraType: 'Flying',
	},
	umowu: {
		species: 'Pikachu', ability: 'Soul Surfer', item: 'Light Ball', gender: '',
		moves: ['Thunder', 'Volt Switch', 'Bouncy Bubble'],
		signatureMove: 'Hang Ten',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid', teraType: 'Water',
	},
	Venous: {
		species: 'Mantine', ability: 'Concrete Over Water', item: 'Leftovers', gender: '',
		moves: ['Scald', 'Roost', 'Clear Smog'],
		signatureMove: 'Your Crippling Interest',
		evs: {hp: 248, def: 244, spd: 16}, nature: 'Calm', teraType: 'Normal', shiny: 5,
	},
	'Vio͜͡let': {
		species: 'Ogerpon', ability: 'See No Evil, Hear No Evil, Speak No Evil', item: 'Berry Juice', gender: 'F',
		moves: ['Crabhammer', 'Mighty Cleave', 'Fire Lash'],
		signatureMove: 'building character',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', teraType: 'Stellar',
	},
	WarriorGallade: {
		species: 'Tropius', ability: 'Primeval Harvest', item: 'Starf Berry', gender: ['M', 'M', 'F'],
		moves: ['Sunny Day', 'Natural Gift', ['Bitter Blade', 'Sappy Seed', 'Stored Power', 'Counter']],
		signatureMove: 'Fruitful Longbow',
		// eslint-disable-next-line max-len
		evs: {hp: 184, atk: 112, def: 36, spd: 88, spe: 88}, ivs: {spa: 29}, nature: 'Impish', teraType: ['Dragon', 'Psychic', 'Fighting'], shiny: 20,
	},
	Waves: {
		species: 'Wailord', ability: 'Primordial Sea', item: 'Assault Vest', gender: 'M',
		moves: ['Water Spout', 'Hurricane', 'Thunder'],
		signatureMove: 'Torrential Drain',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest', ivs: {atk: 0}, teraType: 'Water', shiny: false,
	},
	WigglyTree: {
		species: 'Sudowoodo', ability: 'Tree Stance', item: 'Liechi Berry', gender: 'M',
		moves: ['Victory Dance', 'Wood Hammer', 'Head Smash'],
		signatureMove: 'Perfect Mimic',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant', teraType: 'Grass',
	},
	'XpRienzo ☑◡☑': {
		species: 'Reshiram', ability: 'Turboblaze', item: 'Choice Scarf', gender: 'M',
		moves: ['Draco Meteor', 'Volt Switch', 'Flash Cannon'],
		signatureMove: 'Scorching Truth',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest', teraType: 'Fire',
	},
	'Yellow Paint': {
		species: 'Rotom-Frost', ability: 'Yellow Magic', item: 'Chilan Berry', gender: 'N',
		moves: ['Thunderbolt', 'Blizzard', 'Ion Deluge'],
		signatureMove: 'Whiteout',
		evs: {hp: 252, spa: 252, spe: 4}, nature: 'Modest', teraType: 'Steel', shiny: 2,
	},
	YveltalNL: {
		species: 'Farigiraf', ability: 'Height Advantage', item: 'Leftovers', gender: 'M',
		moves: ['Freezing Glare', 'Ice Beam', 'Slack Off'],
		signatureMove: 'High Ground',
		evs: {hp: 248, spa: 252, spe: 8}, nature: 'Modest', teraType: 'Ground', shiny: false,
	},
	Zalm: {
		species: 'Weedle', ability: 'Water Bubble', item: 'Clear Amulet', gender: '',
		moves: ['Surging Strikes', 'Attack Order', 'Dire Claw'],
		signatureMove: 'Dud ur a fish',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant', teraType: 'Water',
	},
	zee: {
		species: 'Lilligant-Hisui', ability: 'Chlorophyll', item: 'Heat Rock', gender: 'F',
		moves: [['Close Combat', 'Axe Kick'], ['Solar Blade', 'Seed Bomb'], 'Victory Dance'],
		signatureMove: 'Solar Summon',
		evs: {hp: 80, atk: 176, spe: 252}, nature: 'Adamant', teraType: 'Fire',
	},
	zoro: {
		species: 'Umbreon', ability: 'Nine Lives', item: 'Leftovers', gender: 'M',
		moves: ['Wish', 'Protect', 'Toxic'],
		signatureMove: 'Darkest Night',
		evs: {hp: 252, def: 240, spd: 16}, nature: 'Calm', teraType: 'Steel', shiny: true,
	},
};

export class RandomStaffBrosTeams extends RandomTeams {
	randomStaffBrosTeam(options: {inBattle?: boolean} = {}) {
		this.enforceNoDirectCustomBanlistChanges();

		const team: PokemonSet[] = [];
		const debug: string[] = []; // Set this to a list of SSB sets to override the normal pool for debugging.
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const monotype = ruleTable.has('sametypeclause') ?
			this.sample([...this.dex.types.names().filter(x => x !== 'Stellar')]) : false;

		let pool = Object.keys(ssbSets);
		if (debug.length) {
			while (debug.length < 6) {
				const staff = this.sampleNoReplace(pool);
				if (debug.includes(staff) || ssbSets[staff].skip) continue;
				debug.push(staff);
			}
			pool = debug;
		}
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
			if (!(debug.length || monotype)) { // Type limits are ignored for debugging, monotype, or memes.
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

			let teraType: string | undefined;
			if (ssbSet.teraType) {
				teraType = ssbSet.teraType === 'Any' ?
					this.sample(this.dex.types.names()) :
					this.sampleIfArray(ssbSet.teraType);
			}

			const set: PokemonSet = {
				name: name,
				species: ssbSet.species,
				item: Array.isArray(ssbSet.item) ? this.sampleNoReplace(ssbSet.item) : ssbSet.item,
				ability: Array.isArray(ssbSet.ability) ? this.sampleNoReplace(ssbSet.ability) : ssbSet.ability,
				moves: [],
				nature: ssbSet.nature ? Array.isArray(ssbSet.nature) ? this.sampleNoReplace(ssbSet.nature) : ssbSet.nature : 'Serious',
				gender: ssbSet.gender ? this.sampleIfArray(ssbSet.gender) : this.sample(['M', 'F', 'N']),
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
			if (teraType) set.teraType = teraType;

			// Any set specific tweaks occur here.

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
