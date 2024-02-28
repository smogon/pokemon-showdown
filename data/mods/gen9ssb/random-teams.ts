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
	Akir: {
		species: 'Slowbro', ability: 'Take it Slow', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Future Sight', 'Slack Off', 'Steam Eruption'],
		signatureMove: 'Free Switch Button',
		evs: {hp: 248, def: 8, spa: 252}, ivs: {atk: 0, spe: 0}, nature: 'Relaxed', teraType: 'Fairy',
	},
	Alex: {
		species: 'Sprigatito', ability: 'Pawprints', item: 'Eviolite', gender: '',
		moves: ['Substitute', 'Protect', 'Magic Powder'],
		signatureMove: 'Spicier Extract',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Careful', teraType: 'Water',
	},
	Alexander489: {
		species: 'Charizard', ability: 'Confirmed Town', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['No Retreat', 'Bitter Blade', 'Dual Wingbeat'],
		signatureMove: 'Scumhunt',
		evs: {atk: 252, spa: 4, spe: 252}, nature: 'Naughty', teraType: 'Fire', shiny: true,
	},
	Alpha: {
		species: 'Ting-Lu', ability: 'Vessel of Ruin', item: 'Leftovers', gender: 'M',
		moves: ['Stealth Rock', 'Spikes', 'Whirlwind'],
		signatureMove: 'Vessel of CAIO',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Careful', teraType: 'Fairy',
	},
	'Appletun a la Mode': {
		species: 'Appletun', ability: 'Served Cold', item: 'Sitrus Berry', gender: 'F',
		moves: ['Freeze-Dry', 'Apple Acid', 'Fickle Beam'],
		signatureMove: "Extra Course",
		evs: {hp: 252, spa: 4, spd: 252}, ivs: {atk: 0}, nature: 'Calm', teraType: 'Ground',
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
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
	},
	Arsenal: {
		species: 'Rabsca', ability: 'One More', item: 'Covert Cloak', gender: 'N',
		moves: ['Skill Swap', 'Calm Mind', 'Speed Swap'],
		signatureMove: 'Megidolaon',
		evs: {hp: 4, spa: 252, spd: 252}, nature: 'Modest', teraType: 'Stellar', shiny: true,
	},
	Artemis: {
		species: 'Genesect', ability: 'Supervised Learning', item: 'Choice Specs', gender: 'N',
		moves: [],
		signatureMove: 'Automated Response',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Serious', shiny: true,
	},
	autumn: {
		species: 'Flutter Mane', ability: 'Protosynthesis', item: 'Booster Energy', gender: 'N',
		moves: ['Moonblast', 'Taunt', 'Strength Sap'],
		signatureMove: 'Season\'s Smite',
		evs: {def: 8, spa: 244, spe: 252}, nature: 'Timid', teraType: 'Fairy',
	},
	AuzBat: {
		species: 'Swoobat', ability: 'Magic Guard', item: 'Focus Sash', gender: 'M',
		moves: ['Stored Power', 'Hurricane', ['Roost', 'Focus Blast']],
		signatureMove: 'Prep Time',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid', teraType: 'Psychic', shiny: 8192,
	},
	avarice: {
		species: 'Sinistcha-Masterpiece', ability: 'Serene Grace', item: ['Covert Cloak', 'Leftovers'], gender: 'N',
		moves: ['Strength Sap', 'Calm Mind', 'Matcha Gotcha'],
		signatureMove: 'yu-gi-oh reference',
		evs: {hp: 252, def: 160, spe: 90}, ivs: {atk: 0}, nature: 'Bold', teraType: 'Steel',
	},
	berry: {
		species: 'Regirock', ability: 'Sturdy', item: 'Maranga Berry', gender: 'F',
		moves: ['Curse', 'Salt Cure', 'Stone Axe'],
		signatureMove: 'what kind',
		evs: {hp: 252, atk: 4, spd: 252}, nature: 'Careful', teraType: 'Rock',
	},
	Billo: {
		species: 'Cosmog', ability: 'Wonder Guard', item: 'Eviolite', gender: 'N',
		moves: [],
		signatureMove: 'Hack Check',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
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
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid', skip: 'Billo',
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
	Clefable: {
		species: 'Clefable', ability: 'That\'s Hacked', item: 'Leftovers', gender: 'M',
		moves: ['Cosmic Power', 'Soft-Boiled', 'Thunder Wave'],
		signatureMove: 'Giveaway!',
		evs: {hp: 252, def: 200, spd: 56}, nature: 'Calm', teraType: 'Any', shiny: true,
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
	'Cor\'Jon': {
		species: 'Dachsbun', ability: 'Painful Exit', item: 'Leftovers', gender: '',
		moves: ['Wish', 'Rest', 'Play Rough'],
		signatureMove: 'Baker\'s Douze Off',
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Impish', teraType: 'Fairy',
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
	havi: {
		species: 'Gastly', ability: 'Mensis Cage', item: 'Leftovers', gender: 'F',
		moves: ['Astral Barrage', 'Moonblast', 'Substitute'],
		signatureMove: 'Augur of Ebrietas',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid', teraType: 'Ghost',
	},
	HiZo: {
		species: 'Zoroark-Hisui', ability: 'Martyr Complex', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Last Respects', 'Blood Moon', 'Spirit Break'],
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
	kingbaruk: {
		species: 'Wigglytuff', ability: 'Peer Pressure', item: 'Leftovers', gender: 'M',
		moves: ['Trump Card', 'Moonblast', ['Protect', 'Flamethrower', 'Eerie Spell']],
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
	'Lets go shuckles': {
		species: 'Shuckle', ability: 'Persistent', item: 'Berry Juice', gender: 'M',
		moves: ['Diamond Storm', 'Headlong Rush', ['Glacial Lance', 'U-turn']],
		signatureMove: 'Shuckle Power',
		evs: {hp: 252, def: 252, spd: 4}, ivs: {spe: 0}, nature: 'Relaxed', teraType: 'Ground', shiny: 213,
	},
	Lily: {
		species: 'Togedemaru', ability: 'Unaware', item: 'Leftovers', gender: 'F',
		moves: ['Victory Dance', 'Plasma Fists', 'Meteor Mash'],
		signatureMove: 'Recharge',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Careful', teraType: 'Fairy', shiny: 1734,
	},
	Lionyx: {
		species: 'Miltank', ability: 'EnorMOOs', item: 'Leftovers', gender: 'M',
		moves: ['Glacial Lance', 'Bolt Strike', 'Defense Curl'],
		signatureMove: 'Super Rollout',
		evs: {hp: 252, def: 252, spd: 4}, ivs: {atk: 0, spa: 0}, nature: 'Impish', teraType: ['Electric', 'Ice'], shiny: true,
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
	maroon: {
		species: 'Archaludon', ability: 'Built Different', item: 'Leftovers', gender: 'M',
		moves: ['Body Press', 'Stealth Rock', 'Rapid Spin'],
		signatureMove: 'Metal Blast',
		evs: {hp: 252, def: 252, spa: 4}, nature: 'Bold', teraType: 'Flying',
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
	ptoad: {
		species: 'Politoed', ability: 'Drizzle', item: 'Leftovers', gender: 'M',
		moves: ['Jet Punch', 'Ice Punch', 'Earthquake'],
		signatureMove: 'Pleek...',
		evs: {hp: 252, atk: 252, spd: 4}, nature: 'Adamant', teraType: 'Water',
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
	Ransei: {
		species: 'Audino-Mega', ability: 'Ultra Mystik', item: 'Safety Goggles', gender: 'M',
		moves: ['Psystrike', 'Transform', 'Light of Ruin'],
		signatureMove: 'Flood of Lore',
		evs: {hp: 252, def: 4, spa: 252}, ivs: {atk: 0, spe: 0}, nature: 'Modest', shiny: 2,
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
	skies: {
		species: 'Chespin', ability: 'Spikes of Wrath', item: 'Sitrus Berry', gender: 'F',
		moves: ['Bulk Up', 'Strength Sap', 'Body Press'],
		signatureMove: 'Like..?',
		evs: {hp: 252, atk: 4, def: 252}, nature: 'Impish', teraType: ['Water', 'Steel'], shiny: 15,
	},
	snake: {
		species: 'Fidgit', ability: 'Persistent', item: ['Mental Herb', 'Covert Cloak'], gender: 'M',
		moves: ['Tailwind', 'Healing Wish', 'Taunt'],
		signatureMove: 'Concept Relevant',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Jolly', teraType: 'Water',
	},
	'Soft Flex': {
		species: 'Magnezone', ability: 'Adaptive Engineering', item: 'Leftovers', gender: 'N',
		moves: ['Thunderbolt', 'Substitute', 'Parabolic Charge'],
		signatureMove: 'Adaptive Beam',
		evs: {hp: 248, def: 8, spe: 252}, ivs: {atk: 0}, nature: 'Timid', teraType: 'Flying',
	},
	'Solaros & Lunaris': {
		species: 'Scovillain', ability: 'Ride the Sun!', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Solar Beam', 'Growth', 'Moonlight'],
		signatureMove: 'Mind Melt',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest', teraType: 'Fire',
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
	Struchni: {
		species: 'Aggron', ability: 'Overasked Clause', item: 'Leftovers', gender: 'M',
		moves: ['Protect', 'Encore', 'U-turn'],
		signatureMove: '~randfact',
		evs: {hp: 252, def: 16, spd: 240}, nature: 'Careful', teraType: 'Steel',
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
	Tico: {
		species: 'Floette-Eternal', ability: 'Eternal Generator', item: ['Covert Cloak', 'Red Card'], gender: 'M',
		moves: ['Moonblast', 'Mystical Fire', 'Teleport'],
		signatureMove: 'Eternal Wish',
		evs: {hp: 252, def: 16, spe: 240}, ivs: {atk: 0}, nature: 'Timid', teraType: ['Fire', 'Steel'], shiny: false,
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
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest', ivs: {atk: 0}, teraType: 'Water',
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
	xy01: {
		species: 'Blissey', ability: 'Panic', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Soft-Boiled', 'Seismic Toss', 'Aromatherapy'],
		signatureMove: 'Poisonous Wind',
		evs: {hp: 248, def: 252, spd: 8}, nature: 'Bold', teraType: 'Fairy', shiny: true,
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
		evs: {def: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid', teraType: 'Stellar',
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
