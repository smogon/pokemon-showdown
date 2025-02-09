import RandomTeams from '../../random-battles/gen9/teams';

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
		evs: {stat: number}, ivs: {stat: number}, nature: 'Nature', teraType: 'Type',
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
	Aethernum: {
		species: 'Giratina-Origin', ability: 'The Eminence in the Shadow', item: 'Griseous Core', gender: '',
		moves: ['Fiery Wrath', 'Lunar Blessing', 'Dragon Energy'],
		signatureMove: 'I. AM. ATOMIC.',
		evs: {atk: 4, spa: 252, spe: 252}, nature: 'Hasty', teraType: 'Dark', shiny: true,
	},
	Akir: {
		species: 'Slowbro', ability: 'Take it Slow', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Future Sight', 'Slack Off', 'Steam Eruption'],
		signatureMove: 'Free Switch Button',
		evs: {hp: 248, def: 8, spa: 252}, ivs: {spe: 0}, nature: 'Relaxed', teraType: 'Fairy',
	},
	Alex: {
		species: 'Sprigatito', ability: 'Pawprints', item: 'Eviolite', gender: '',
		moves: [['Charm', 'Tickle'], 'Protect', 'Soak'],
		signatureMove: 'Spicier Extract',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Careful', teraType: 'Water',
	},
	Alexander489: {
		species: 'Charizard', ability: 'Confirmed Town', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['No Retreat', 'Bitter Blade', 'Dual Wingbeat'],
		signatureMove: 'Scumhunt',
		evs: {atk: 252, spa: 4, spe: 252}, nature: 'Naughty', teraType: 'Fire', shiny: true,
	},
	Apple: {
		species: 'Applin', ability: 'Orchard\'s Gift', item: 'Lum Berry', gender: ['M', 'F'],
		moves: ['Apple Acid', 'Leech Seed', 'Dragon Pulse'],
		signatureMove: 'Wopple or Flopple',
		evs: {hp: 252, spa: 4, spd: 252}, nature: 'Sassy', shiny: 2, teraType: 'Dragon',
	},
	'Appletun a la Mode': {
		species: 'Appletun', ability: 'Served Cold', item: 'Sitrus Berry', gender: 'F',
		moves: ['Freeze-Dry', 'Apple Acid', 'Fickle Beam'],
		signatureMove: "Extra Course",
		evs: {hp: 252, spa: 4, spd: 252}, nature: 'Calm', teraType: 'Ground',
	},
	aQrator: {
		species: 'Totodile', ability: 'Neverending fHunt', item: 'Eviolite', gender: 'F',
		moves: ['Whirlpool', 'Noble Roar', 'Slack Off'],
		signatureMove: "Tori's Stori",
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Sassy', teraType: 'Fighting',
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
		moves: ['Giga Drain', 'Snipe Shot', 'Aeroblast'],
		signatureMove: 'Quiver Dance',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
	},
	Arcueid: {
		species: 'Deoxys-Defense', ability: 'Marble Phantasm', item: 'Heavy-Duty Boots', gender: 'N',
		moves: [['Lunar Blessing', 'Jungle Healing'], 'Body Press', ['Toxic', 'Will-O-Wisp', 'Topsy-Turvy']],
		signatureMove: 'Funny Vamp',
		evs: {hp: 248, def: 252, spd: 8}, nature: 'Bold', teraType: 'Fairy', shiny: true,
	},
	'Arcueid-Attack': {
		species: 'Deoxys-Attack', ability: 'Marble Phantasm', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Moonblast', 'Photon Geyser', 'Flamethrower'],
		signatureMove: 'Funny Vamp',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid', teraType: 'Fairy', shiny: true, skip: 'Arcueid',
	},
	Arsenal: {
		species: 'Rabsca', ability: 'Absorb Phys', item: 'Covert Cloak', gender: 'N',
		moves: ['Recover', 'Calm Mind', 'Speed Swap'],
		signatureMove: 'Megidolaon',
		evs: {hp: 4, spa: 252, spd: 252}, nature: 'Modest', teraType: 'Stellar', shiny: true,
	},
	Artemis: {
		species: 'Genesect', ability: 'Supervised Learning', item: 'Choice Specs', gender: 'N',
		moves: [],
		signatureMove: 'Automated Response',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Serious', shiny: true,
	},
	Arya: {
		species: 'Flygon', ability: 'Tinted Lens', item: 'Flygonite', gender: 'F',
		moves: ['Clanging Scales', 'Roost', 'Bug Buzz'],
		signatureMove: 'Anyone can be killed',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
	},
	Audiino: {
		species: 'Audino', ability: 'Mitosis', item: 'Leftovers', gender: 'N',
		moves: ['Recover', 'Moongeist Beam', 'Hyper Voice'],
		signatureMove: 'Thinking In Progress',
		evs: {hp: 252, def: 4, spa: 252}, nature: 'Modest', teraType: 'Ghost',
	},
	autumn: {
		species: 'Flutter Mane', ability: 'Protosynthesis', item: 'Booster Energy', gender: 'N',
		moves: ['Moonblast', 'Taunt', 'Strength Sap'],
		signatureMove: 'Season\'s Smite',
		evs: {def: 8, spa: 244, spe: 252}, nature: 'Timid', teraType: 'Fairy',
	},
	ausma: {
		species: 'Hatterene', ability: 'Cascade', item: 'Leftovers', gender: 'F',
		moves: ['Light of Ruin', 'Strength Sap', 'Substitute'],
		signatureMove: 'Sigil\'s Storm',
		evs: {hp: 252, def: 4, spa: 252}, ivs: {atk: 0, spe: 0}, nature: 'Modest', teraType: 'Fairy',
	},
	'ausma-Mismagius': {
		species: 'Mismagius', ability: 'Levitate', item: 'Leftovers', gender: 'F',
		moves: ['Light of Ruin', 'Strength Sap', 'Substitute'],
		signatureMove: 'Sigil\'s Storm',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Modest', teraType: 'Fairy', skip: 'ausma',
	},
	'ausma-Fennekin': {
		species: 'Fennekin', ability: 'Blaze', item: '', gender: '',
		moves: ['Tackle', 'Growl'],
		signatureMove: 'Ember',
		evs: {}, skip: 'ausma',
	},
	AuzBat: {
		species: 'Swoobat', ability: 'Magic Guard', item: 'Focus Sash', gender: 'M',
		moves: ['Stored Power', 'Hurricane', ['Roost', 'Focus Blast']],
		signatureMove: 'Prep Time',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid', teraType: 'Psychic', shiny: 8192,
	},
	avarice: {
		species: 'Sinistcha-Masterpiece', ability: 'Serene Grace', item: ['Covert Cloak', 'Leftovers'], gender: 'N',
		moves: ['Strength Sap', 'Calm Mind', 'Matcha Gotcha'],
		signatureMove: 'yu-gi-oh reference',
		evs: {hp: 252, def: 160, spe: 90}, nature: 'Bold', teraType: 'Steel',
	},
	Beowulf: {
		species: 'Beedrill', ability: 'Intrepid Sword', item: 'Beedrillite', gender: 'M',
		moves: ['Poison Jab', 'X-Scissor', ['Earthquake', 'Volt Tackle', 'Glacial Lance']],
		signatureMove: 'Buzzer Stinger Counter',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly', shiny: 2,
	},
	berry: {
		species: 'Regirock', ability: 'Sturdy', item: 'Maranga Berry', gender: 'F',
		moves: ['Curse', 'Salt Cure', 'Stone Axe'],
		signatureMove: 'what kind',
		evs: {hp: 252, atk: 4, spd: 252}, nature: 'Careful', teraType: 'Rock',
	},
	Bert122: {
		species: 'Sableye', ability: 'Prankster', item: 'Sablenite', gender: '',
		moves: ['Metal Burst', 'Recover', 'Will-O-Wisp'],
		signatureMove: 'Shatter and Scatter',
		evs: {hp: 252, def: 28, spd: 224}, ivs: {atk: 0, spe: 0}, nature: 'Relaxed',
	},
	Billo: {
		species: 'Cosmog', ability: 'Wonder Guard', item: 'Eviolite', gender: 'N',
		moves: [],
		signatureMove: 'Hack Check',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
	},
	'Billo-Solgaleo': {
		species: 'Solgaleo', ability: 'Magic Guard', item: 'Choice Scarf', gender: 'N',
		moves: ['Wave Crash', 'Volt Tackle', 'Flare Blitz'],
		signatureMove: 'Head Smash',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', skip: 'Billo', shiny: true,
	},
	'Billo-Lunala': {
		species: 'Lunala', ability: 'Shadow Shield', item: 'Lunalium Z', gender: 'N',
		moves: ['Moongeist Beam', 'Moonblast', 'Ice Beam'],
		signatureMove: 'Thunderbolt',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', skip: 'Billo',
	},
	blazeofvictory: {
		species: 'Sylveon', ability: 'Prismatic Lens', item: 'Leftovers', gender: 'F',
		moves: ['Wish', 'Baton Pass', 'Hyper Voice'],
		signatureMove: 'Veto',
		evs: {hp: 252, spa: 252, spe: 4}, nature: 'Modest', teraType: 'Fairy',
	},
	Blitz: {
		species: 'Chi-Yu', ability: 'Blitz of Ruin', item: 'Life Orb', gender: 'N',
		moves: ['Fiery Wrath', 'Lava Plume', 'Nasty Plot'],
		signatureMove: 'Geyser Blast',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Modest', teraType: 'Water', shiny: true,
	},
	Breadey: {
		species: 'Dachsbun', ability: 'Painful Exit', item: 'Leftovers', gender: '',
		moves: ['Protect', 'Rest', 'Play Rough'],
		signatureMove: 'Baker\'s Douze Off',
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Impish', teraType: 'Steel',
	},
	Cake: {
		species: 'Dunsparce', ability: 'Scrappy', item: 'Eviolite', gender: 'N',
		moves: [
			'Topsy-Turvy', 'Lunar Blessing', 'Lovely Kiss', 'Glare', 'Knock Off', 'Gastro Acid',
			'Trick Room', 'Toxic', 'Heal Bell', 'Octolock', 'G-Max Befuddle', 'G-Max Centiferno',
			'G-Max Cannonade', 'Magic Powder', 'Whirlwind', 'Lunar Dance', 'Power Split',
			'Snatch', 'Heal Order', 'Parting Shot', 'Population Bomb', 'Metronome',
		],
		signatureMove: 'Role System',
		// eslint-disable-next-line max-len
		evs: {hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85}, nature: 'Hardy', teraType: ['Ghost', 'Poison', 'Fairy'], shiny: 1024, level: 97,
	},
	chaos: {
		species: 'Iron Jugulis', ability: 'Transistor', item: 'Heavy-Duty Boots', gender: 'N',
		moves: [['Oblivion Wing', 'Hurricane'], ['Thunderclap', 'Volt Switch'], ['Defog', 'Roost']],
		signatureMove: 'Outage',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: ['Steel', 'Flying', 'Electric', 'Dark'],
	},
	Chloe: {
		species: 'Tsareena', ability: 'Acetosa', item: 'Assault Vest', gender: 'F',
		moves: ['Rapid Spin', 'Fishious Rend', 'Stone Axe'],
		signatureMove: 'De Todas las Flores',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', teraType: 'Grass', shiny: true,
	},
	Chris: {
		species: 'Raging Bolt', ability: 'Astrothunder', item: 'Leftovers', gender: 'N',
		moves: ['Thunder', 'Dragon Pulse', 'Calm Mind'],
		signatureMove: 'Antidote',
		evs: {hp: 148, def: 156, spa: 204}, nature: 'Quiet', teraType: 'Steel',
	},
	ciran: {
		species: 'Rapidash', ability: 'Defiant', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Protect', 'Sketch', 'Bitter Blade'],
		signatureMove: 'Summon Monster VIII: Fiendish monstrous Piplupede, Colossal',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', teraType: 'Poison', shiny: true,
	},
	Clefable: {
		species: 'Clefable', ability: 'That\'s Hacked', item: 'Leftovers', gender: 'M',
		moves: ['Cosmic Power', 'Soft-Boiled', 'Thunder Wave'],
		signatureMove: 'Giveaway!',
		evs: {hp: 252, def: 200, spd: 56}, nature: 'Calm', teraType: 'Any', shiny: true,
	},
	Clementine: {
		species: 'Avalugg', ability: 'Melting Point', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Land\'s Wrath', 'Flip Turn', 'Milk Drink'],
		signatureMove: '(╯°o°）╯︵ ┻━┻',
		nature: 'Quirky', teraType: ['Poison', 'Steel'],
	},
	'Clementine-Flipped': {
		species: 'Avalugg-Hisui', ability: 'Melting Point', item: 'Heavy-Duty Boots', gender: '',
		moves: ['Earth Power', 'Volt Switch', 'Heal Pulse'],
		signatureMove: '(╯°o°）╯︵ ┻━┻',
		nature: 'Quirky', teraType: ['Poison', 'Steel'], skip: 'Clementine',
	},
	clerica: {
		species: 'Mimikyu', ability: 'Masquerade', item: 'Ghostium Z', gender: 'F',
		moves: ['Protect', 'Substitute', 'Phantom Force'],
		signatureMove: 'Stockholm Syndrome',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
	Clouds: {
		species: 'Corvisquire', ability: 'Jet Stream', item: 'Leftovers', gender: 'M',
		moves: ['Brave Bird', 'Roost', 'Defog'],
		signatureMove: 'Winds of Change',
		evs: {hp: 252, atk: 4, def: 252}, nature: 'Jolly', teraType: 'Flying', shiny: 822,
	},
	Coolcodename: {
		species: 'Victini', ability: 'Firewall', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Searing Shot', 'Psychic', 'Dazzling Gleam'],
		signatureMove: 'Haxer\'s Will',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: 'Fairy', shiny: 1024,
	},
	Corthius: {
		species: 'Thwackey', ability: 'Grassy Emperor', item: 'Eviolite', gender: 'M',
		moves: ['Swords Dance', 'U-turn', 'Close Combat'],
		signatureMove: 'Monkey Beat Up',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant', shiny: 69,
	},
	'Dawn of Artemis': {
		species: 'Necrozma', ability: 'Form Change', item: 'Expert Belt', gender: 'F',
		moves: ['Calm Mind', 'Photon Geyser', 'Earth Power'],
		signatureMove: 'Magical Focus',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: 'Psychic', shiny: 8192,
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
	dhelmise: {
		species: 'Slowking-Galar', ability: 'Coalescence', item: 'Black Sludge', gender: 'N',
		moves: ['Sludge Bomb', 'Psychic Noise', 'Parting Shot'],
		signatureMove: 'Biotic Orb',
		evs: {hp: 252, def: 252, spa: 4}, nature: 'Bold', teraType: ['Psychic', 'Poison'],
	},
	DianaNicole: {
		species: 'Abomasnow', ability: 'Snow Warning', item: 'Abomasite', gender: 'F',
		moves: ['Giga Drain', 'Earth Power', 'Blizzard'],
		signatureMove: 'Breath of Tiamat',
		evs: {hp: 252, def: 4, spa: 252}, nature: 'Modest', shiny: true,
	},
	EasyOnTheHills: {
		species: 'Snorlax', ability: 'Immunity', item: 'Life Orb', gender: 'M',
		moves: ['Darkest Lariat', 'Body Slam', 'Heavy Slam'],
		signatureMove: 'Snack Time',
		evs: {hp: 252, atk: 252, spd: 4}, nature: 'Adamant', teraType: 'Ghost', shiny: true,
	},
	Elliot: {
		species: 'Sinistea', ability: 'Natural Cure', item: 'Focus Sash', gender: 'N',
		moves: ['Moonblast', 'Shadow Ball', 'Teatime'],
		signatureMove: 'Tea Party',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Modest', teraType: 'Water', shiny: true,
	},
	Elly: {
		species: 'Thundurus', ability: 'Storm Surge', item: 'Heavy-Duty Boots', gender: 'F',
		moves: ['Wildbolt Storm', 'Sandsear Storm', 'Volt Switch'],
		signatureMove: 'Sustained Winds',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: 'Ground',
	},
	Emboar02: {
		species: 'Emboar', ability: 'Hogwash', item: 'Choice Band', gender: 'F',
		moves: ['Flare Blitz', 'Wave Crash', 'Volt Tackle'],
		signatureMove: 'Insert boar pun here',
		// eslint-disable-next-line max-len
		evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant', teraType: ['Fire', 'Water', 'Fighting', 'Electric'], shiny: 50 / 49,
	},
	Fame: {
		species: 'Jumpluff', ability: 'Social Jumpluff Warrior', item: 'Leftovers', gender: 'F',
		moves: ['Air Slash', 'Thunder Wave', 'Toxic'],
		signatureMove: 'Solidarity',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid', teraType: 'Fire',
	},
	Felucia: {
		species: 'Vespiquen', ability: 'Mountaineer', item: 'Red Card', gender: 'F',
		moves: ['Strength Sap', ['Oblivion Wing', 'Night Shade'], ['Thief', 'Calm Mind', 'Toxic']],
		signatureMove: 'Rigged Dice',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Calm',
	},
	Froggeh: {
		species: 'Toxicroak', ability: 'Super Luck', item: 'Leftovers', gender: 'M',
		moves: ['Gunk Shot', 'Sucker Punch', 'Drain Punch'],
		signatureMove: 'Cringe Dad Joke',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Adamant', teraType: 'Dark',
	},
	Frostyicelad: {
		species: 'Qwilfish-Hisui', ability: 'Almost Frosty', item: 'Eviolite', gender: 'M',
		moves: ['Darkest Lariat', 'Recover', ['Dire Claw', 'Meteor Mash', 'Bitter Malice']],
		signatureMove: 'Puffy Spiky Destruction',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: ['Dark', 'Poison', 'Ghost', 'Steel'], shiny: 1024,
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
	'Haste Inky': {
		species: 'Falinks', ability: 'Simple', item: 'Sitrus Berry', gender: 'N',
		moves: ['Superpower', 'Ice Hammer', 'Throat Chop'],
		signatureMove: 'Hasty Revolution',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Dark',
	},
	havi: {
		species: 'Gastly', ability: 'Mensis Cage', item: 'Leftovers', gender: 'F',
		moves: ['Astral Barrage', 'Moonblast', 'Substitute'],
		signatureMove: 'Augur of Ebrietas',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: 'Ghost',
	},
	Hecate: {
		species: 'Mewtwo', ability: 'Hacking', item: 'Mewtwonite X', gender: 'F',
		moves: ['Photon Geyser', 'Drain Punch', 'Iron Head'],
		signatureMove: 'Testing in Production',
		evs: {atk: 252, spa: 4, spe: 252}, nature: 'Jolly',
	},
	HiZo: {
		species: 'Zoroark-Hisui', ability: 'Justified', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Last Respects', 'Blood Moon', 'Spirit Break'],
		signatureMove: 'Scapegoat',
		evs: {atk: 252, spa: 4, spe: 252}, nature: 'Naive', teraType: 'Fairy',
	},
	HoeenHero: {
		species: 'Ludicolo', ability: 'Misspelled', item: 'Life Orb', gender: 'M',
		moves: [['Hydro Pump', 'Surf'], 'Giga Drain', 'Ice Beam'],
		signatureMove: 'Re-Program',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: 'Water',
	},
	hsy: {
		species: 'Ursaluna', ability: 'Hustle', item: 'Blunder Policy', gender: 'M',
		moves: ['Drill Peck', 'Egg Bomb', 'Headlong Rush'],
		signatureMove: 'Wonder Wing',
		evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant', teraType: 'Flying',
	},
	Hydrostatics: {
		species: 'Pichu-Spiky-eared', ability: 'Hydrostatic Positivity', item: 'Eviolite', gender: 'M',
		moves: ['Hydro Pump', 'Thunder', 'Ice Beam'],
		signatureMove: 'Hydrostatics',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Modest', teraType: 'Water', shiny: 2,
	},
	Imperial: {
		species: 'Kyurem', ability: 'Frozen Fortuity', item: 'Never-Melt Ice', gender: 'N',
		moves: ['Chilly Reception', 'Fusion Bolt', 'Fusion Flare'],
		signatureMove: 'Storm Shroud',
		evs: {atk: 128, spa: 128, spe: 252}, nature: 'Docile', teraType: 'Ice', shiny: 193,
	},
	'Imperial-Black': {
		species: 'Kyurem-Black', ability: 'Frozen Fortuity', item: 'Never-Melt Ice', gender: 'N',
		moves: ['Mountain Gale', 'Fusion Bolt', 'Ice Shard'],
		signatureMove: 'Storm Shroud',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant', teraType: 'Electric', shiny: 193, skip: 'Imperial',
	},
	'Imperial-White': {
		species: 'Kyurem-White', ability: 'Frozen Fortuity', item: 'Never-Melt Ice', gender: 'N',
		moves: ['Ice Beam', 'Freeze-Dry', 'Fusion Flare'],
		signatureMove: 'Storm Shroud',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest', teraType: 'Fire', shiny: 193, skip: 'Imperial',
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
		evs: {hp: 252, spa: 4, spd: 252}, nature: 'Modest',
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
	Kalalokki: {
		species: 'Flamigo', ability: 'Scrappy', item: 'Choice Band', gender: 'M',
		moves: ['Brave Bird', 'Sucker Punch', ['Drain Punch', 'Rapid Spin']],
		signatureMove: 'Knot Weak',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: ['Fighting', 'Flying'],
	},
	Karthik: {
		species: 'Staraptor', ability: 'Tough Claws', item: 'Choice Scarf', gender: 'M',
		moves: ['Brave Bird', 'Head Smash', ['Flare Blitz', 'Wave Crash']],
		signatureMove: 'Salvaged Sacrifice',
		evs: {hp: 252, atk: 4, spe: 252}, nature: 'Adamant', teraType: 'Flying',
	},
	ken: {
		species: 'Jigglypuff', ability: 'Aroma Veil', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Dazzling Gleam', 'Heal Order', 'Mortal Spin'],
		signatureMove: ', (ac)',
		evs: {hp: 252, def: 252, spa: 4}, nature: 'Bold', teraType: 'Any',
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
	keys: {
		species: 'Rayquaza', ability: 'Defeatist', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Oblivion Wing', 'Sizzly Slide', 'Bouncy Bubble'],
		signatureMove: 'Protector of the Skies',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', shiny: 10,
	},
	kingbaruk: {
		species: 'Wigglytuff', ability: 'Peer Pressure', item: 'Silk Scarf', gender: 'M',
		moves: ['Trump Card', 'Encore', ['Protect', 'Thunder Wave']],
		signatureMove: 'Platinum Record',
		evs: {hp: 252, def: 4, spa: 252}, nature: 'Modest', teraType: 'Normal',
	},
	Kiwi: {
		species: 'Minccino', ability: 'Sure Hit Sorcery', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Dynamic Punch', 'Substitute', 'Noble Roar'],
		signatureMove: 'Mad Manifest',
		evs: {hp: 252, atk: 144, spe: 112}, nature: 'Adamant', teraType: 'Fighting', shiny: true,
	},
	Klmondo: {
		species: 'Cloyster', ability: 'Super Skilled', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Victory Dance', 'Icicle Spear', 'Rock Blast'],
		signatureMove: 'The Better Water Shuriken',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant', teraType: 'Water',
	},
	'kolohe ✮彡': {
		species: 'Pikachu', ability: 'Soul Surfer', item: 'Light Ball', gender: '',
		moves: ['Thunder', 'Volt Switch', 'Bouncy Bubble'],
		signatureMove: 'Hang Ten',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid', teraType: 'Water',
	},
	Kry: {
		species: 'Mawile', ability: 'Flash Freeze', item: 'Mawilite', gender: 'M',
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
	'Lets go shuckles': {
		species: 'Shuckle', ability: 'Persistent', item: 'Berry Juice', gender: 'M',
		moves: ['Diamond Storm', 'Headlong Rush', ['Glacial Lance', 'U-turn']],
		signatureMove: 'Shuckle Power',
		evs: {hp: 252, def: 252, spd: 4}, ivs: {spe: 0}, nature: 'Relaxed', teraType: 'Ground', shiny: 213,
	},
	Lily: {
		species: 'Togedemaru', ability: 'Unaware', item: 'Leftovers', gender: 'F',
		moves: ['Victory Dance', 'Plasma Fists', 'Meteor Mash'],
		signatureMove: 'Power Up',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Careful', teraType: 'Fairy', shiny: 1734,
	},
	Loethalion: {
		species: 'Ralts', ability: 'Psychic Surge', item: 'Gardevoirite', gender: '',
		moves: ['Esper Wing', 'Calm Mind', 'Lunar Blessing'],
		signatureMove: 'Darkmoon Cackle',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', shiny: true,
	},
	Lumari: {
		species: 'Ponyta-Galar', ability: 'Pyrotechnic', item: 'Eviolite', gender: 'F',
		moves: ['Substitute', 'Sappy Seed', 'Magical Torque'],
		signatureMove: 'Mystical Bonfire',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Fairy',
	},
	Lunell: {
		species: 'Vaporeon', ability: 'Low Tide, High Tide', item: 'Leftovers', gender: 'F',
		moves: ['Hydro Pump', 'Thunder', 'Moonlight'],
		signatureMove: 'Praise the Moon',
		evs: {hp: 252, def: 4, spa: 252}, nature: 'Calm', teraType: 'Fairy', shiny: 512,
	},
	'Lyna 氷': {
		species: 'Dragonair', ability: 'Magic Aura', item: 'Eviolite', gender: 'F',
		moves: ['Victory Dance', 'V-create', 'Glacial Lance'],
		signatureMove: 'Wrath of Frozen Flames',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Dragon',
	},
	Maia: {
		species: 'Litwick', ability: 'Power Abuse', item: 'Eviolite', gender: 'F',
		moves: ['Shadow Ball', 'Flamethrower', 'Giga Drain'],
		signatureMove: 'Body Count',
		evs: {hp: 252, spa: 252, spd: 4}, nature: 'Modest', teraType: 'Ghost',
	},
	'marillvibes ♫': {
		species: 'Marill', ability: 'Huge Power', item: 'Life Orb', gender: 'M',
		moves: ['Surging Strikes', 'Jet Punch', 'Close Combat'],
		signatureMove: 'Good Vibes Only',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant', teraType: 'Water', shiny: true,
	},
	Mathy: {
		species: 'Furret', ability: 'Dynamic Typing', item: 'Big Root', gender: 'M',
		moves: ['Bitter Blade', 'Swords Dance', 'Taunt'],
		signatureMove: 'Breaking Change',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Ghost',
	},
	Merritty: {
		species: 'Torchic', ability: 'End Round', item: 'Eviolite', gender: 'M',
		moves: ['Quiver Dance', 'Fiery Dance', 'Strength Sap'],
		signatureMove: 'New Bracket',
		evs: {hp: 4, def: 36, spa: 196, spd: 36, spe: 236}, nature: 'Timid', teraType: 'Flying', shiny: true,
	},
	Meteordash: {
		species: 'Tatsugiri', ability: 'TatsuGlare', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Spacial Rend', 'Steam Eruption', 'Glare'],
		signatureMove: 'Plagiarism',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: 'Steel',
	},
	Mex: {
		species: 'Dialga', ability: 'Time Dilation', item: 'Adamant Orb', gender: 'N',
		moves: ['Dragon Pulse', 'Flash Cannon', ['Aura Sphere', 'Volt Switch', 'Meteor Beam']],
		signatureMove: 'Time Skip',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid', teraType: 'Steel', shiny: true,
	},
	Miojo: {
		species: 'Spheal', ability: 'The Rolling Spheal', item: 'Choice Band', gender: '',
		moves: ['Liquidation', 'Collision Course', 'Flip Turn'],
		signatureMove: 'vruuuuuum',
		evs: {hp: 8, atk: 252, spd: 4, spe: 244}, nature: 'Jolly', teraType: 'Fighting', shiny: 363,
	},
	Monkey: {
		species: 'Infernape', ability: 'Harambe Hit', item: 'Blunder Policy', gender: 'M',
		moves: ['Dynamic Punch', 'Plasma Fists', 'Fire Punch'],
		signatureMove: 'Banana Breakfast',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly', teraType: 'Electric', shiny: 69,
	},
	MyPearl: {
		species: 'Latios', ability: 'Eon Call', item: 'Soul Dew', gender: 'M',
		moves: ['Draco Meteor', 'Aura Sphere', 'Flip Turn'],
		signatureMove: 'Eon Assault',
		evs: {hp: 252, def: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid', teraType: 'Steel', shiny: 50,
	},
	'MyPearl-Latias': {
		species: 'Latias', ability: 'Eon Call', item: 'Soul Dew', gender: 'F',
		moves: ['Calm Mind', 'Recover', 'Thunder Wave'],
		signatureMove: 'Eon Assault',
		evs: {hp: 252, def: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid', teraType: 'Steel', shiny: 50, skip: 'MyPearl',
	},
	Neko: {
		species: 'Chien-Pao', ability: 'Weatherproof', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Swords Dance', 'Bitter Blade', ['Crunch', 'Sucker Punch']],
		signatureMove: 'Quality Control Zoomies',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Fire',
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
	'nya~ ❤': {
		species: 'Delcatty', ability: 'Adorable Grace', item: 'Focus Band', gender: 'F',
		moves: ['Freeze-Dry', 'Flamethrower', 'Volt Switch'],
		signatureMove: ':3',
		evs: {hp: 252, spa: 4, spe: 252}, nature: 'Naive', teraType: 'Ice',
	},
	pants: {
		species: 'Annihilape', ability: 'Drifting', item: 'Leftovers', gender: 'M',
		moves: ['Rage Fist', 'Drain Punch', 'Dragon Dance'],
		signatureMove: 'Eerie Apathy',
		evs: {hp: 240, spd: 252, spe: 16}, nature: 'Careful', teraType: 'Ghost',
	},
	PartMan: {
		species: 'Chandelure', ability: 'C- Tier Shitposter', item: 'Leek', gender: 'M',
		moves: ['Searing Shot', 'Hex', 'Morning Sun'],
		signatureMove: 'Alting',
		evs: {hp: 252, spa: 69, spe: 188}, nature: 'Timid',
	},
	'Pastor Gigas': {
		species: 'Regigigas', ability: 'God\'s Mercy', item: 'Clear Amulet', gender: 'N',
		moves: ['Sacred Fire', 'Knock Off', 'Healing Wish'],
		signatureMove: 'Call to Repentance',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Adamant', teraType: 'Fairy',
	},
	Peary: {
		species: 'Klinklang', ability: 'Levitate', item: 'Pearyum Z', gender: '',
		moves: ['Lock On', 'Sheer Cold', 'Substitute'],
		signatureMove: 'Gear Grind',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	phoopes: {
		species: 'Jynx', ability: 'I Did It Again', item: 'Focus Sash', gender: 'F',
		moves: ['Lovely Kiss', 'Psychic', 'Amnesia'],
		signatureMove: 'Gen 1 Blizzard',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid', teraType: 'Ice',
	},
	Pissog: {
		species: 'Volcarona', ability: 'Drought', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Torch Song', 'Morning Sun', 'Solar Beam'],
		signatureMove: 'A Song Of Ice And Fire',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: 'Fire', shiny: 1096,
	},
	'Pissog-Frosmoth': {
		species: 'Frosmoth', ability: 'Snow Warning', item: 'Heavy-Duty Boots', gender: 'F',
		moves: ['Blizzard', 'Chilly Reception', 'Aurora Veil'],
		signatureMove: 'A Song Of Ice And Fire',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: 'Ice', skip: 'Pissog', shiny: 1096,
	},
	pokemonvortex: {
		species: 'Pokestar Smeargle', ability: 'Prankster', item: 'Focus Sash', gender: 'N',
		moves: ['Spore', 'Extreme Evoboost', 'Substitute'],
		signatureMove: 'Roulette',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Timid', teraType: 'Ghost',
	},
	'Princess Autumn': {
		species: 'Altaria', ability: 'Last Hymn', item: 'Altarianite', gender: 'F',
		moves: ['Earthquake', 'Amnesia', 'Roost'],
		signatureMove: 'Cotton Candy Crush',
		evs: {hp: 248, spd: 164, spe: 96}, nature: 'Careful', shiny: 4,
	},
	ptoad: {
		species: 'Politoed', ability: 'Drizzle', item: 'Leftovers', gender: 'M',
		moves: ['Jet Punch', 'Ice Punch', 'Earthquake'],
		signatureMove: 'Pleek...',
		evs: {hp: 252, atk: 252, spd: 4}, nature: 'Adamant', teraType: 'Water',
	},
	Pulse_kS: {
		species: 'Hydreigon', ability: 'Pulse Luck', item: 'Quick Claw', gender: 'N',
		moves: ['Dark Pulse', 'Dragon Pulse', 'Origin Pulse'],
		signatureMove: 'Luck Pulse',
		evs: {hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85}, nature: 'Serious', teraType: ['Steel', 'Poison'],
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
	quziel: {
		species: 'Chromera', ability: 'High Performance Computing', item: 'Covert Cloak', gender: 'M',
		moves: ['Recover', 'Revelation Dance', 'Boomburst'],
		signatureMove: 'Reshape',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Timid', teraType: 'Ghost',
	},
	R8: {
		species: 'Chansey', ability: 'Anti-Pelau', item: 'Eviolite', gender: 'N',
		moves: ['Ice Beam', 'Thunderbolt', 'Flamethrower'],
		signatureMove: 'Magic Trick',
		evs: {hp: 252, spa: 252, spe: 4}, ivs: {atk: 0}, nature: 'Modest', teraType: 'Ice', shiny: 256,
	},
	Rainshaft: {
		species: 'Xerneas', ability: 'Rainy\'s Aura', item: 'Rainium Z', gender: 'F',
		moves: ['Psychic Noise', 'Sing', 'Alluring Voice'],
		signatureMove: 'Sparkling Aria',
		evs: {hp: 252, spa: 252, spe: 4}, nature: 'Mild',
	},
	Ransei: {
		species: 'Audino-Mega', ability: 'Ultra Mystik', item: 'Safety Goggles', gender: 'M',
		moves: ['Psystrike', 'Transform', 'Light of Ruin'],
		signatureMove: 'Flood of Lore',
		evs: {hp: 252, def: 4, spa: 252}, ivs: {spe: 0}, nature: 'Modest', shiny: 2,
	},
	ReturnToMonkey: {
		species: 'Oranguru', ability: 'Monke See Monke Do', item: 'Twisted Spoon', gender: 'M',
		moves: ['Hyper Voice', 'Psyshock', 'Focus Blast'],
		signatureMove: 'Monke Magic',
		evs: {hp: 252, def: 4, spa: 252}, ivs: {spe: 0}, nature: 'Quiet', teraType: 'Fighting',
	},
	'Rio Vidal': {
		species: 'Archaludon', ability: 'Built Different', item: 'Leftovers', gender: 'M',
		moves: ['Body Press', 'Stealth Rock', 'Rapid Spin'],
		signatureMove: 'Metal Blast',
		evs: {hp: 252, def: 252, spa: 4}, nature: 'Bold', teraType: 'Flying',
	},
	Rissoux: {
		species: 'Arcanine-Hisui', ability: 'Hard Headed', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Head Smash', 'Flare Blitz', 'Morning Sun'],
		signatureMove: 'Call of the Wild',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly', teraType: 'Grass',
	},
	RSB: {
		species: 'Growlithe', ability: 'Hot Pursuit', item: 'Eviolite', gender: 'M',
		moves: ['Fire Fang', 'Thunder Fang', 'Morning Sun'],
		signatureMove: 'Confiscate',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Grass',
	},
	Rumia: {
		species: 'Duskull', ability: 'Youkai of the Dusk', item: 'Eviolite', gender: 'N',
		moves: ['Infernal Parade', 'Strength Sap', 'Mortal Spin'],
		signatureMove: 'Midnight Bird',
		evs: {hp: 252, def: 252, spa: 4}, nature: 'Bold', teraType: 'Poison', shiny: true,
	},
	Scotteh: {
		species: 'Suicune', ability: 'Water Absorb', item: 'Leftovers', gender: '',
		moves: ['Calm Mind', 'Scald', 'Ice Beam'],
		signatureMove: 'Purification',
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Bold', teraType: 'Water',
	},
	SexyMalasada: {
		species: 'Typhlosion', ability: 'Ancestry Ritual', item: 'Life Orb', gender: 'M',
		moves: ['Calm Mind', 'Aura Sphere', 'Flamethrower'],
		signatureMove: 'Hexadecimal Fire',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: 'Ghost', shiny: true,
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
	Siegfried: {
		species: 'Ampharos', ability: 'Static', item: 'Ampharosite', gender: 'M',
		moves: ['Calm Mind', 'Thunderclap', 'Draco Meteor'],
		signatureMove: 'BoltBeam',
		evs: {hp: 252, spa: 252, spd: 4}, nature: 'Modest', shiny: 64,
	},
	'Sificon~': {
		species: 'Hoppip', ability: 'Perfectly Imperfect', item: 'Eviolite', gender: 'M',
		moves: ['Strength Sap', 'Spikes', 'Seismic Toss'],
		signatureMove: 'Grass Gaming',
		evs: {hp: 252, def: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid', teraType: 'Dragon',
	},
	skies: {
		species: 'Chespin', ability: 'Spikes of Wrath', item: 'Sitrus Berry', gender: 'F',
		moves: ['Bulk Up', 'Strength Sap', 'Body Press'],
		signatureMove: 'Like..?',
		evs: {hp: 252, atk: 4, def: 252}, nature: 'Impish', teraType: ['Water', 'Steel'], shiny: 15,
	},
	snake: {
		species: 'Fidgit', ability: 'Persistent', item: ['Mental Herb', 'Covert Cloak', 'Leppa Berry'], gender: 'M',
		moves: ['Tailwind', 'Revival Blessing', 'Taunt'],
		signatureMove: 'Concept Relevant',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Water',
	},
	'Soft Flex': {
		species: 'Magnezone', ability: 'Adaptive Engineering', item: 'Leftovers', gender: 'N',
		moves: ['Thunderbolt', 'Substitute', 'Parabolic Charge'],
		signatureMove: 'Adaptive Beam',
		evs: {hp: 248, def: 8, spe: 252}, nature: 'Timid', teraType: 'Flying',
	},
	'Solaros & Lunaris': {
		species: 'Scovillain', ability: 'Ride the Sun!', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Solar Beam', 'Growth', 'Moonlight'],
		signatureMove: 'Mind Melt',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest', teraType: 'Fire',
	},
	Spiderz: {
		species: 'Iron Thorns', ability: 'Poison Heal', item: 'Toxic Orb', gender: 'M',
		moves: ['Spiky Shield', 'Stone Axe', 'Thousand Arrows'],
		signatureMove: 'Shepherd of the Mafia Room',
		evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant', teraType: 'Steel', shiny: true,
	},
	spoo: {
		species: 'Hemogoblin', ability: 'I Can Hear The Heart Beating As One', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Extreme Speed', 'Bitter Blade', 'Moonlight'],
		signatureMove: 'Cardio Training',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Adamant', teraType: 'Fairy', shiny: 32,
	},
	Steorra: {
		species: 'Kitsunoh', ability: 'Ghostly Hallow', item: 'Choice Band', gender: '',
		moves: ['Meteor Mash', 'Shadow Strike', 'U-turn'],
		signatureMove: 'Phantom Weapon',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', teraType: ['Steel', 'Ghost'], shiny: 2,
	},
	Struchni: {
		species: 'Aggron', ability: 'Overasked Clause', item: 'Leftovers', gender: 'M',
		moves: ['Detect', 'Encore', 'U-turn'],
		signatureMove: '~randfact',
		evs: {hp: 252, def: 16, spd: 240}, nature: 'Careful', teraType: 'Steel',
	},
	Sulo: {
		species: 'Reuniclus', ability: 'Protection of the Gelatin', item: 'Life Orb', gender: 'M',
		moves: ['Calm Mind', 'Draining Kiss', 'Stored Power'],
		signatureMove: 'Vengeful Mood',
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Bold', teraType: 'Fairy', shiny: true,
	},
	Swiffix: {
		species: 'Piplup', ability: 'Stinky', item: 'Eviolite', gender: 'M',
		moves: ['Water Shuriken', 'Nasty Plot', 'Roost'],
		signatureMove: 'Stink Bomb',
		evs: {hp: 252, def: 4, spa: 252}, nature: 'Modest', teraType: 'Water',
	},
	Syrinix: {
		species: 'Ceruledge', ability: 'Sword of Ruin', item: 'Life Orb', gender: 'N',
		moves: ['Poltergeist', 'Swords Dance', 'Bitter Blade'],
		signatureMove: 'A Soul for a Soul',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant', teraType: 'Fire',
	},
	Teclis: {
		species: 'Gallade', ability: 'Sharpness', item: 'Life Orb', gender: 'M',
		moves: ['Sacred Sword', 'Psycho Cut', 'Leaf Blade'],
		signatureMove: 'Rising Sword',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant', teraType: 'Psychic',
	},
	Tenshi: {
		species: 'Sandshrew', ability: 'Sand Sleuth', item: 'Eviolite', gender: 'M',
		moves: ['Precipice Blades', 'Dynamic Punch', 'Rapid Spin'],
		signatureMove: 'SAND EAT',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Ground', shiny: 10,
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
	Tico: {
		species: 'Floette-Eternal', ability: 'Eternal Generator', item: ['Covert Cloak', 'Red Card'], gender: 'M',
		moves: ['Light of Ruin', 'Lava Plume', 'Teleport'],
		signatureMove: 'Eternal Wish',
		evs: {hp: 252, def: 16, spe: 240}, nature: 'Timid', teraType: ['Fire', 'Steel'], shiny: false,
	},
	trace: {
		species: 'Delphox', ability: 'Eyes of Eternity', item: 'Life Orb', gender: 'F',
		moves: ['Calm Mind', 'Inferno', 'Recover'],
		signatureMove: 'Chronostasis',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest', teraType: 'Psychic',
	},
	Tuthur: {
		species: 'Scream Tail', ability: 'Poison Heal', item: 'Toxic Orb', gender: 'M',
		moves: ['Spikes', 'Burning Bulwark', 'Encore'],
		signatureMove: 'Symphonie du Ze\u0301ro',
		evs: {hp: 244, def: 12, spe: 252}, nature: 'Timid', teraType: 'Water',
	},
	'Two of Roses': {
		species: 'Luxray', ability: 'As We See', item: 'Mirror Herb', gender: 'M',
		moves: ['Knock Off', 'Supercell Slam', 'Trailblaze'],
		signatureMove: 'Dilly Dally',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', teraType: 'Flying', shiny: 1024,
	},
	UT: {
		species: 'Talonflame', ability: 'Gale Guard', item: 'Leftovers', gender: 'M',
		moves: ['Brave Bird', 'Roost', 'Defog'],
		signatureMove: 'My Boys',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Flying',
	},
	Valerian: {
		species: 'Lucario', ability: 'Full Bloom', item: 'Clear Amulet', gender: 'F',
		moves: ['Bullet Punch', 'Mach Punch', 'Parting Shot'],
		signatureMove: 'First Strike',
		evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant', teraType: 'Fighting',
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
	Vistar: {
		species: 'Zeraora', ability: 'Prankster', item: 'Throat Spray', gender: 'M',
		moves: ['Encore', 'Volt Switch', 'Copycat'],
		signatureMove: 'Virtual Avatar',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Timid', teraType: 'Electric',
	},
	'Vistar-Idol': {
		species: 'Zeraora', ability: 'Virtual Idol', item: 'Throat Spray', gender: 'M',
		moves: ['Sparkling Aria', 'Torch Song', 'Teeter Dance'],
		signatureMove: 'Overdrive',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Timid', teraType: 'Electric', shiny: true, skip: 'Vistar',
	},
	vmnunes: {
		species: 'Shaymin-Sky', ability: 'Wild Growth', item: 'Big Root', gender: 'M',
		moves: ['Giga Drain', 'Oblivion Wing', 'Draining Kiss'],
		signatureMove: 'Gracidea\'s Blessing',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: 'Fairy',
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
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest', teraType: 'Water',
	},
	WigglyTree: {
		species: 'Sudowoodo', ability: 'Tree Stance', item: 'Liechi Berry', gender: 'M',
		moves: ['Shell Smash', 'Wood Hammer', 'Head Smash'],
		signatureMove: 'Perfect Mimic',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant', teraType: 'Grass',
	},
	'XpRienzo ☑◡☑': {
		species: 'Reshiram', ability: 'Turboblaze', item: 'Choice Scarf', gender: 'M',
		moves: ['Draco Meteor', 'Volt Switch', 'Flash Cannon'],
		signatureMove: 'Scorching Truth',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest', teraType: 'Fire',
	},
	xy01: {
		species: 'Blissey', ability: 'Panic', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Soft-Boiled', 'Seismic Toss', 'Aromatherapy'],
		signatureMove: 'Poisonous Wind',
		evs: {hp: 248, def: 252, spd: 8}, nature: 'Bold', teraType: 'Fairy', shiny: true,
	},
	'yeet dab xd': {
		species: 'Kecleon', ability: 'Treasure Bag', item: 'Silk Scarf', gender: 'M', happiness: 0,
		moves: ['Frustration', 'Shadow Sneak', 'Fake Out'],
		signatureMove: 'top kek',
		evs: {hp: 252, atk: 4, spd: 252}, nature: 'Careful', teraType: 'Ghost',
	},
	'Yellow Paint': {
		species: 'Rotom-Frost', ability: 'Yellow Magic', item: 'Chilan Berry', gender: 'N',
		moves: ['Thunderbolt', 'Blizzard', 'Ion Deluge'],
		signatureMove: 'Whiteout',
		evs: {hp: 252, spa: 252, spe: 4}, nature: 'Modest', teraType: 'Steel', shiny: 2,
	},
	'yuki ♪': {
		species: 'Ninetales-Alola', ability: 'Party Up', item: 'Light Clay', gender: '',
		moves: ['Blizzard', 'Aurora Veil', ['Encore', 'Lovely Kiss']],
		signatureMove: 'Tag, You\'re It!',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid', teraType: 'Ghost',
	},
	YveltalNL: {
		species: 'Farigiraf', ability: 'Height Advantage', item: 'Leftovers', gender: 'M',
		moves: ['Freezing Glare', 'Ice Beam', 'Slack Off'],
		signatureMove: 'High Ground',
		evs: {hp: 248, spa: 252, spe: 8}, nature: 'Modest', teraType: 'Ground',
	},
	za: {
		species: 'Greedent', ability: 'Troll', item: 'Leftovers', gender: 'M',
		moves: ['Headbutt', 'Iron Head', 'Foul Play'],
		signatureMove: 'Shitpost',
		evs: {hp: 252, def: 252, spe: 6}, nature: 'Impish', teraType: 'Steel',
	},
	Zalm: {
		species: 'Weedle', ability: 'Water Bubble', item: 'Clear Amulet', gender: '',
		moves: ['Surging Strikes', 'Attack Order', 'Dire Claw'],
		signatureMove: 'Dud ur a fish',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant', teraType: 'Water',
	},
	Zarel: {
		species: 'Meloetta', ability: 'Tempo Change', item: 'Leftovers', gender: 'M',
		moves: ['Psystrike', 'Armor Cannon', 'Obstruct'],
		signatureMove: '@ts-ignore',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Timid', teraType: 'Stellar',
	},
	'Zarel-Pirouette': {
		species: 'Meloetta-Pirouette', ability: 'Tempo Change', item: 'Leftovers', gender: 'M',
		moves: ['Close Combat', 'Knock Off', 'Silk Trap'],
		signatureMove: '@ts-ignore',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Stellar', skip: 'Zarel',
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

const afdSSBSets: SSBSets = {
	'Fox': {
		species: 'Fennekin', ability: 'No Ability', item: '', gender: '',
		moves: [],
		signatureMove: 'Super Metronome',
	},
};

export class RandomStaffBrosTeams extends RandomTeams {
	randomStaffBrosTeam(options: {inBattle?: boolean} = {}) {
		this.enforceNoDirectCustomBanlistChanges();

		const team: PokemonSet[] = [];
		const debug: string[] = []; // Set this to a list of SSB sets to override the normal pool for debugging.
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const meme = ruleTable.has('dynamaxclause') && !debug.length;
		const monotype = this.forceMonotype || (ruleTable.has('sametypeclause') ?
			this.sample([...this.dex.types.names().filter(x => x !== 'Stellar')]) : false);

		let pool = meme ? Object.keys(afdSSBSets) : Object.keys(ssbSets);
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
		if (global.Config?.disabledssbsets?.length) {
			pool = pool.filter(x => !global.Config.disabledssbsets.includes(this.dex.toID(x)));
		}
		const typePool: {[k: string]: number} = {};
		let depth = 0;
		while (pool.length && team.length < this.maxTeamSize) {
			if (depth >= 200) throw new Error(`Infinite loop in Super Staff Bros team generation.`);
			depth++;
			const name = meme ? this.sample(pool) : this.sampleNoReplace(pool);
			const ssbSet: SSBSet = meme ? this.dex.deepClone(afdSSBSets[name]) : this.dex.deepClone(ssbSets[name]);
			if (ssbSet.skip) continue;

			// Enforce typing limits
			if (!(debug.length || monotype || meme)) { // Type limits are ignored for debugging, monotype, or memes.
				const species = this.dex.species.get(ssbSet.species);

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
			const moves: string[] = [];
			while (moves.length < 3 && ssbSet.moves.length > 0) {
				let move = this.sampleNoReplace(ssbSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				moves.push(this.dex.moves.get(move).name);
			}
			moves.push(this.dex.moves.get(ssbSet.signatureMove).name);
			const ivs = {...{hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, ...ssbSet.ivs};
			if (!moves.map(x => this.dex.moves.get(x)).some(x => x.category === 'Physical')) {
				ivs.atk = 0;
			}

			const set: PokemonSet = {
				name,
				species: ssbSet.species,
				item: this.sampleIfArray(ssbSet.item),
				ability: this.sampleIfArray(ssbSet.ability),
				moves,
				nature: ssbSet.nature ? Array.isArray(ssbSet.nature) ? this.sampleNoReplace(ssbSet.nature) : ssbSet.nature : 'Serious',
				gender: ssbSet.gender ? this.sampleIfArray(ssbSet.gender) : this.sample(['M', 'F', 'N']),
				evs: ssbSet.evs ? {...{hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}, ...ssbSet.evs} :
				{hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84},
				ivs,
				level: this.adjustLevel || ssbSet.level || 100,
				happiness: typeof ssbSet.happiness === 'number' ? ssbSet.happiness : 255,
				shiny: typeof ssbSet.shiny === 'number' ? this.randomChance(1, ssbSet.shiny) : !!ssbSet.shiny,
			};

			// Any set specific tweaks occur here.
			if (set.name === "Felucia") {
				const cmIndex = set.moves.indexOf("Calm Mind");
				if (cmIndex >= 0 && set.moves.includes("Night Shade")) {
					set.moves[cmIndex] = this.sample(["Thief", "Toxic"]);
				}
			}
			if (set.name === "Frostyicelad" && set.shiny) {
				const moveIndex = Math.max(set.moves.indexOf('Dire Claw'),
					set.moves.indexOf('Meteor Mash'), set.moves.indexOf('Bitter Malice'));
				if (moveIndex >= 0) {
					set.moves[moveIndex] = 'Fishious Rend';
					teraType = 'Water';
				}
			}

			if (teraType) set.teraType = teraType;

			team.push(set);

			// Team specific tweaks occur here
			// Swap last and second to last sets if last set has Illusion
			if (team.length === this.maxTeamSize && (set.ability === 'Illusion')) {
				team[this.maxTeamSize - 1] = team[this.maxTeamSize - 2];
				team[this.maxTeamSize - 2] = set;
			}
		}
		return team;
	}
}

export default RandomStaffBrosTeams;
