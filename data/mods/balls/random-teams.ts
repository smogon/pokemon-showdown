import RandomTeams from '../../random-battles/gen9/teams';

export interface BLLSet {
	species: string;
	ability: string | string[];
	item: string | string[];
	gender: GenderName | GenderName[];
	moves: (string | string[])[];
	signatureMove: string;
	evs?: { hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number };
	ivs?: { hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number };
	nature?: string | string[];
	shiny?: number | boolean;
	level?: number;
	happiness?: number;
	skip?: string;
	teraType?: string | string[];
}
interface BLLSets { [k: string]: BLLSet }

export const bllSets: BLLSets = {
	// Balls
	'8ball': {
		species: '8ball', ability: 'Simple', item: 'Life Orb', gender: 'N',
		moves: ['Focus Blast', 'Flash Cannon', 'Nasty Plot'],
		signatureMove: 'Dark Pulse',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Fighting', level: 100,
	},
	Baseball: {
		species: 'Baseball', ability: ['Magic Guard', 'Shadow Tag'], item: 'Life Orb', gender: '',
		moves: ['Flare Blitz', 'Headlong Rush', 'No Retreat'],
		signatureMove: 'Extreme Speed',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Normal', level: 100,
	},
	'Baseball 2': {
		species: 'Baseball', ability: ['Magic Guard', 'Shadow Tag'], item: ['Life Orb', 'Leftovers'], gender: '',
		moves: ['Boomburst', 'Shadow Ball', 'Nasty Plot'],
		signatureMove: 'Substitute',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Normal', level: 100, skip: 'Baseball',
	},
	'Baseball 3': {
		species: 'Baseball', ability: ['Magic Guard', 'Shadow Tag'], item: ['Life Orb', 'Silk Scarf'], gender: 'N',
		moves: ['Boomburst', 'Shadow Ball', 'No Retreat'],
		signatureMove: 'Extreme Speed',
		evs: { atk: 4, spa: 252, spe: 252 }, nature: 'Naive', teraType: 'Normal', level: 100, skip: 'Baseball',
	},
	Basketball: {
		species: 'Basketball', ability: 'Magic Bounce', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Earth Power', 'Rapid Spin', 'Will-O-Wisp'],
		signatureMove: 'Flamethrower',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Calm', teraType: 'Water', level: 100,
	},
	'Basketball 2': {
		species: 'Basketball', ability: 'Magic Bounce', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Earth Power', 'Rapid Spin', 'Energy Ball'],
		signatureMove: 'Flamethrower',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Water', level: 100, skip: 'Basketball',
	},
	'Basketball 3': {
		species: 'Basketball', ability: 'Drought', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Earth Power', 'Rapid Spin', 'Nasty Plot'],
		signatureMove: 'Flamethrower',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Fire', level: 100, skip: 'Basketball',
	},
	'Basketball 4': {
		species: 'Basketball', ability: 'Drought', item: 'Choice Specs', gender: 'N',
		moves: ['Earth Power', 'Overheat', 'Solar Beam'],
		signatureMove: 'Eruption',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Modest', teraType: 'Fire', level: 100, skip: 'Basketball',
	},
	Cabbage: {
		species: 'Cabbage', ability: 'Grassy Surge', item: 'Leftovers', gender: 'N',
		moves: ['Leech Seed', 'Protect', 'Strength Sap'],
		signatureMove: 'Giga Drain',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Bold', teraType: 'Steel', level: 100,
	},
	'Cabbage 2': {
		species: 'Cabbage', ability: 'Grassy Surge', item: 'Leftovers', gender: 'N',
		moves: ['Ice Beam', 'Calm Mind', 'Strength Sap'],
		signatureMove: 'Giga Drain',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Bold', teraType: 'Steel', level: 100, skip: 'Cabbage',
	},
	Cricketball: {
		species: 'Cricketball', ability: 'Sheer Force', item: 'Focus Sash', gender: 'N',
		moves: ['Stun Spore', 'Sticky Web', 'Taunt'],
		signatureMove: 'Bug Buzz',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Ghost', level: 100,
	},
	'Cricketball 2': {
		species: 'Cricketball', ability: 'Sheer Force', item: 'Life Orb', gender: 'N',
		moves: ['Thunderbolt', 'Energy Ball', 'Quiver Dance'],
		signatureMove: 'Bug Buzz',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Modest', teraType: 'Electric', level: 100, skip: 'Cricketball',
	},
	Crystalball: {
		species: 'Crystalball', ability: 'Psychic Surge', item: 'Choice Specs', gender: 'N',
		moves: ['Shadow Ball', 'Focus Blast', 'Trick'],
		signatureMove: 'Psystrike',
		evs: { hp: 252, spa: 252, spd: 4 }, nature: 'Modest', teraType: 'Fighting', level: 100,
	},
	'Crystalball 2': {
		species: 'Crystalball', ability: 'Psychic Surge', item: 'Life Orb', gender: 'N',
		moves: ['Aura Sphere', 'Nasty Plot', 'Recover'],
		signatureMove: 'Psystrike',
		evs: { hp: 252, spa: 252, spd: 4 }, nature: 'Modest', teraType: 'Fighting', level: 100, skip: 'Crystalball',
	},
	'Crystalball 3': {
		species: 'Crystalball', ability: 'Psychic Surge', item: 'Terrain Extender', gender: 'N',
		moves: ['Trick Room', ['Wish', 'Recover'], 'Teleport'],
		signatureMove: 'Psystrike',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Sassy', teraType: 'Fighting', level: 100, skip: 'Crystalball',
	},
	Discoball: {
		species: 'Discoball', ability: 'Levitate', item: 'Leftovers', gender: 'N',
		moves: ['Volt Switch', 'Thunder Wave', 'Moonlight'],
		signatureMove: 'Flash Cannon',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Calm', teraType: 'Ghost', level: 100,
	},
	'Discoball 2': {
		species: 'Discoball', ability: 'Levitate', item: 'Leftovers', gender: 'N',
		moves: ['Volt Switch', 'Wish', 'Protect'],
		signatureMove: 'Heal Bell',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Calm', teraType: 'Ghost', level: 100, skip: 'Discoball',
	},
	Dragonball: {
		species: 'Dragonball', ability: 'Vessel of Ruin', item: 'Leftovers', gender: 'N',
		moves: [['Knock Off', 'Stealth Rock', 'Spikes'], 'Rapid Spin', 'Recover'],
		signatureMove: 'Draco Meteor',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Sassy', teraType: 'Steel', level: 100,
	},
	'Dragonball 2': {
		species: 'Dragonball', ability: 'Vessel of Ruin', item: 'Choice Specs', gender: 'N',
		moves: ['Dragon Energy', 'Earth Power', 'Fire Blast'],
		signatureMove: 'Draco Meteor',
		evs: { hp: 248, spa: 252, spd: 8 }, nature: 'Modest', teraType: 'Dragon', level: 100, skip: 'Dragonball',
	},
	'Dragonball 3': {
		species: 'Dragonball', ability: 'Vessel of Ruin', item: 'Life Orb', gender: 'N',
		moves: ['Earth Power', 'Nasty Plot', 'Recover'],
		signatureMove: 'Draco Meteor',
		evs: { hp: 248, spa: 252, spd: 8 }, nature: 'Modest', teraType: 'Steel', level: 100, skip: 'Dragonball',
	},
	Football: {
		species: 'Football', ability: 'Stamina', item: 'Leftovers', gender: 'N',
		moves: ['Close Combat', 'Rapid Spin', ['Spikes', 'Stealth Rock']],
		signatureMove: 'Headlong Rush',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Steel', level: 100,
	},
	'Football 2': {
		species: 'Football', ability: 'Stamina', item: 'Leftovers', gender: 'N',
		moves: ['Body Press', ['Spikes', 'Stealth Rock'], 'Rapid Spin'],
		signatureMove: 'Earthquake',
		evs: { hp: 252, atk: 4, def: 252 }, nature: 'Impish', teraType: 'Steel', level: 100, skip: 'Football',
	},
	'Football 3': {
		species: 'Football', ability: 'Rock Head', item: 'Life Orb', gender: 'N',
		moves: ['Close Combat', 'Head Smash', 'Swords Dance'],
		signatureMove: 'Headlong Rush',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: ['Ground', 'Rock'], level: 100, skip: 'Football',
	},
	'Football 4': {
		species: 'Football', ability: 'Hustle', item: 'Life Orb', gender: 'N',
		moves: ['Close Combat', 'Wild Charge', 'Swords Dance'],
		signatureMove: 'Headlong Rush',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Ground', level: 100, skip: 'Football',
	},
	Gumball: {
		species: 'Gumball', ability: 'Misty Surge', item: 'Choice Specs', gender: 'N',
		moves: ['Fire Blast', ['Thunderbolt', 'Psychic'], 'Trick'],
		signatureMove: 'Moonblast',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Modest', teraType: 'Fire', level: 100,
	},
	'Gumball 2': {
		species: 'Gumball', ability: 'Misty Surge', item: 'Life Orb', gender: 'N',
		moves: ['Flamethrower', ['Thunderbolt', 'Psychic'], 'Calm Mind'],
		signatureMove: 'Moonblast',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Fire', level: 100, skip: 'Gumball',
	},
	'Gumball 3': {
		species: 'Gumball', ability: 'Prankster', item: ['Focus Sash', 'Leftovers'], gender: 'N',
		moves: ['Spikes', 'Healing Wish', 'Thunder Wave'],
		signatureMove: 'Moonblast',
		evs: { hp: 248, def: 252, spa: 8 }, nature: 'Bold', teraType: 'Steel', level: 100, skip: 'Gumball',
	},
	'Gumball 4': {
		species: 'Gumball', ability: 'Prankster', item: 'Light Clay', gender: 'N',
		moves: ['Reflect', 'Light Screen', 'Healing Wish'],
		signatureMove: 'Moonblast',
		evs: { hp: 248, def: 252, spa: 8 }, nature: 'Bold', teraType: 'Steel', level: 100, skip: 'Gumball',
	},
	Plasmaball: {
		species: 'Plasmaball', ability: 'Electric Surge', item: 'Life Orb', gender: 'N',
		moves: ['Flamethrower', 'Energy Ball', 'Nasty Plot'],
		signatureMove: 'Thunderbolt',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Modest', teraType: 'Electric', level: 100,
	},
	'Plasmaball 2': {
		species: 'Plasmaball', ability: 'Electric Surge', item: 'Choice Specs', gender: 'N',
		moves: ['Fire Blast', 'Energy Ball', 'Volt Switch'],
		signatureMove: 'Thunderbolt',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Electric', level: 100, skip: 'Plasmaball',
	},
	Rock: {
		species: 'Rock', ability: ['Sand Stream', 'Solid Rock'], item: 'Leftovers', gender: 'N',
		moves: ['Body Press', 'Salt Cure', 'Stealth Rock'],
		signatureMove: 'Diamond Storm',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Careful', teraType: 'Water', level: 100,
	},
	'Rock 2': {
		species: 'Rock', ability: ['Moxie', 'Sand Stream', 'Solid Rock'], item: 'White Herb', gender: 'N',
		moves: ['Body Press', 'Shell Smash', 'Earthquake'],
		signatureMove: 'Diamond Storm',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Ground', level: 100, skip: 'Rock',
	},
	Snowball: {
		species: 'Snowball', ability: 'Refrigerate', item: 'Choice Band', gender: 'N',
		moves: ['Extreme Speed', 'Wild Charge', 'Flip Turn'],
		signatureMove: 'Double-Edge',
		evs: { atk: 252, def: 4, spe: 252 }, nature: 'Adamant', teraType: 'Ice', level: 100,
	},
	Soccerball: {
		species: 'Soccerball', ability: 'Stakeout', item: 'Choice Band', gender: 'N',
		moves: ['Headlong Rush', 'Rock Slide', 'Mach Punch'],
		signatureMove: 'Close Combat',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Fighting', level: 100,
	},
	'Soccerball 2': {
		species: 'Soccerball', ability: 'Stakeout', item: 'Life Orb', gender: 'N',
		moves: ['Headlong Rush', 'Rock Slide', 'Court Change'],
		signatureMove: 'Close Combat',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Steel', level: 100, skip: 'Soccerball',
	},
	'Soccerball 3': {
		species: 'Soccerball', ability: 'Speed Boost', item: 'Life Orb', gender: 'N',
		moves: ['Headlong Rush', 'Rock Slide', 'Swords Dance'],
		signatureMove: 'Close Combat',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Steel', level: 100, skip: 'Soccerball',
	},
	Tennisball: {
		species: 'Tennisball', ability: 'Adaptability', item: 'Choice Specs', gender: 'N',
		moves: ['Heat Wave', 'Energy Ball', 'U-turn'],
		signatureMove: 'Aeroblast',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Flying', level: 100,
	},
	'The Moon': {
		species: 'The Moon', ability: 'Pressure', item: 'Leftovers', gender: 'N',
		moves: ['Body Press', ['Moonlight', 'Stealth Rock'], 'Will-O-Wisp'],
		signatureMove: 'Poltergeist',
		evs: { hp: 252, atk: 4, def: 252 }, nature: 'Impish', teraType: 'Fairy', level: 100,
	},
	'The Moon 2': {
		species: 'The Moon', ability: 'Rocky Payload', item: 'Leftovers', gender: 'N',
		moves: ['Rock Blast', ['Moonlight', 'Stealth Rock'], 'Will-O-Wisp'],
		signatureMove: 'Poltergeist',
		evs: { hp: 252, atk: 4, def: 252 }, nature: 'Impish', teraType: 'Fairy', level: 100, skip: 'The Moon',
	},
	Virus: {
		species: 'Virus', ability: 'Regenerator', item: 'Leftovers', gender: 'N',
		moves: ['Knock Off', 'Toxic Spikes', 'Recover'],
		signatureMove: 'Poison Jab',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Careful', teraType: 'Dark', level: 100,
	},
	Watermelon: {
		species: 'Watermelon', ability: 'Unaware', item: 'Leftovers', gender: 'N',
		moves: ['Toxic', 'Leech Seed', 'Recover'],
		signatureMove: 'Scald',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Bold', teraType: 'Steel', level: 100,
	},
	'Watermelon 2': {
		species: 'Watermelon', ability: 'Drizzle', item: 'Damp Rock', gender: 'N',
		moves: [['Hydro Pump', 'Scald'], 'Energy Ball', 'Recover'],
		signatureMove: 'Ice Beam',
		evs: { hp: 252, spa: 252, spd: 4 }, nature: 'Modest', teraType: 'Water', level: 100, skip: 'Watermelon',
	},
	// Guns
	'5.7 Rock': {
		species: '5.7 Rock', ability: 'Guts', item: 'Flame Orb', gender: 'N',
		moves: ['Diamond Storm', 'Rock Polish', 'Accelerock'],
		signatureMove: 'Drain Punch',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Fighting', level: 100,
	},
	'5.7.2 Rock': {
		species: '5.7 Rock', ability: 'Rock Head', item: 'Choice Band', gender: 'N',
		moves: ['Headlong Rush', 'Close Combat', 'Accelerock'],
		signatureMove: 'Head Smash',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Rock', level: 100, skip: '5.7 Rock',
	},
	Airgun: {
		species: 'Airgun', ability: 'Neutralizing Gas', item: 'Life Orb', gender: 'N',
		moves: ['Thunderbolt', 'Focus Blast', 'Defog'],
		signatureMove: 'Aeroblast',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Fighting', level: 100,
	},
	'Airgun 2': {
		species: 'Airgun', ability: 'Neutralizing Gas', item: 'Leftovers', gender: 'N',
		moves: ['Roost', 'Brick break', 'Defog'],
		signatureMove: 'Beak Blast',
		evs: { hp: 252, def: 252, spd: 4 }, nature: 'Impish', teraType: 'Steel', level: 100, skip: 'Airgun',
	},
	Blowgun: {
		species: 'Blowgun', ability: 'Toxic Chain', item: 'Leftovers', gender: 'N',
		moves: ['Earthquake', 'Victory Dance', 'Strength Sap'],
		signatureMove: 'Noxious Torque',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Dark', level: 100,
	},
	'Blowgun 2': {
		species: 'Blowgun', ability: 'Merciless', item: 'Leftovers', gender: 'N',
		moves: ['Earthquake', 'Mortal Spin', ['Strength Sap', 'Toxic Spikes']],
		signatureMove: 'Barb Barrage',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Dark', level: 100, skip: 'Blowgun',
	},
	Crossbow: {
		species: 'Crossbow', ability: 'Analytic', item: 'Leftovers', gender: 'N',
		moves: ['Thousand Arrows', 'Triple Arrows', 'Swords Dance'],
		signatureMove: 'Power Whip',
		evs: { hp: 252, atk: 252, spd: 4 }, nature: 'Adamant', teraType: 'Water', level: 100,
	},
	'Crossbow 2': {
		species: 'Crossbow', ability: 'Unburden', item: ['Sitrus Berry', 'Air Balloon'], gender: 'N',
		moves: ['Thousand Arrows', 'Triple Arrows', 'Swords Dance'],
		signatureMove: 'Power Whip',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Water', level: 100, skip: 'Crossbow',
	},
	Dracogun: {
		species: 'Dracogun', ability: 'Dragon\'s Maw', item: 'Choice Specs', gender: 'N',
		moves: ['Draco Meteor', 'Fire Blast', 'Sludge Wave'],
		signatureMove: 'Dragon Energy',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Modest', teraType: 'Dragon', level: 100,
	},
	'Dracogun 2': {
		species: 'Dracogun', ability: 'Beast Boost', item: 'Life Orb', gender: 'N',
		moves: ['Nasty Plot', 'Fire Blast', 'Sludge Wave'],
		signatureMove: 'Dragon Pulse',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Fire', level: 100, skip: 'Dracogun',
	},
	Flamethrower: {
		species: 'Flamethrower', ability: 'Prankster', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Parting Shot', 'Morning Sun', 'Will-O-Wisp'],
		signatureMove: 'Searing Shot',
		evs: { hp: 248, spa: 8, spd: 252 }, nature: 'Calm', teraType: 'Water', level: 100,
	},
	'Flamethrower 2': {
		species: 'Flamethrower', ability: 'Prankster', item: 'Heavy-Duty Boots', gender: 'N',
		moves: [['Searing Shot', 'Torch Song'], 'Morning Sun', ['Focus Blast', 'Nasty Plot']],
		signatureMove: 'Energy Ball',
		evs: { hp: 248, spa: 252, spd: 8 }, nature: 'Modest', teraType: 'Grass', level: 100, skip: 'Flamethrower',
	},
	Freezegun: {
		species: 'Freezegun', ability: 'Regenerator', item: 'Life Orb', gender: 'N',
		moves: [['Nasty Plot', 'Thunderbolt'], 'Focus Blast', 'Freeze-Dry'],
		signatureMove: 'Ice Beam',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Ice', level: 100,
	},
	'Grenade Launcher': {
		species: 'Grenade Launcher', ability: 'Mold Breaker', item: 'Leftovers', gender: 'N',
		moves: ['Spikes', 'Stone Edge', 'Will-O-Wisp'],
		signatureMove: 'Earthquake',
		evs: { hp: 252, atk: 4, def: 252 }, nature: 'Impish', teraType: 'Water', level: 100,
	},
	'Grenade Launcher 2': {
		species: 'Grenade Launcher', ability: 'Mold Breaker', item: 'Choice Band', gender: 'N',
		moves: ['Close Combat', 'Stone Edge', 'Flare Blitz'],
		signatureMove: 'Headlong Rush',
		evs: { hp: 52, atk: 252, spe: 204 }, nature: 'Adamant', teraType: 'Ground', level: 100, skip: 'Grenade Launcher',
	},
	Handgun: {
		species: 'Handgun', ability: 'Scrappy', item: 'Life Orb', gender: 'N',
		moves: ['Close Combat', 'Rapid Spin', 'Boomburst'],
		signatureMove: 'Extreme Speed',
		evs: { atk: 252, spa: 4, spe: 252 }, nature: 'Hasty', teraType: 'Normal', level: 100,
	},
	'Handgun 2': {
		species: 'Handgun', ability: 'Scrappy', item: 'Leftovers', gender: 'N',
		moves: ['Knock Off', 'Recover', 'Rapid Spin'],
		signatureMove: 'Drain Punch',
		evs: { hp: 248, def: 144, spd: 116 }, nature: 'Careful', teraType: 'Fighting', level: 100, skip: 'Handgun',
	},
	'Handgun 3': {
		species: 'Handgun', ability: 'Adaptability', item: 'Life Orb', gender: 'N',
		moves: ['Close Combat', 'No Retreat', 'Boomburst'],
		signatureMove: 'Extreme Speed',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Hasty', teraType: 'Normal', level: 100, skip: 'Handgun',
	},
	'Handgun 4': {
		species: 'Handgun', ability: 'Protean', item: 'Choice Band', gender: 'N',
		moves: ['Close Combat', 'Rock Slide', 'Knock Off'],
		signatureMove: 'Extreme Speed',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Fighting', level: 100, skip: 'Handgun',
	},
	'Handgun 5': {
		species: 'Handgun', ability: 'Protean', item: 'Life Orb', gender: 'N',
		moves: ['Fire Blast', 'Focus Blast', 'Energy Ball'],
		signatureMove: 'Boomburst',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Normal', level: 100, skip: 'Handgun',
	},
	Lasergun: {
		species: 'Lasergun', ability: 'Magic Guard', item: 'Life Orb', gender: 'N',
		moves: ['Focus Blast', 'Shadow Ball', 'Ice Beam'],
		signatureMove: 'Lumina Crash',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Fighting', level: 100,
	},
	'Lasergun 2': {
		species: 'Lasergun', ability: 'Magic Guard', item: 'Leftovers', gender: 'N',
		moves: ['Focus Blast', 'Shadow Ball', 'Nasty Plot'],
		signatureMove: 'Psystrike',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Fighting', level: 100, skip: 'Lasergun',
	},
	'Lasergun 3': {
		species: 'Lasergun', ability: 'Neuroforce', item: 'Power Herb', gender: 'N',
		moves: ['Focus Blast', 'Shadow Ball', 'Meteor Beam'],
		signatureMove: 'Psystrike',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Fighting', level: 100, skip: 'Lasergun',
	},
	Nailgun: {
		species: 'Nailgun', ability: 'Steelworker', item: 'Leftovers', gender: 'N',
		moves: ['Knock Off', 'Body Press', 'Spikes'],
		signatureMove: 'Sunsteel Strike',
		evs: { hp: 252, atk: 4, def: 252 }, nature: 'Impish', teraType: 'Steel', level: 100,
	},
	'Nailgun 2': {
		species: 'Nailgun', ability: 'Steelworker', item: 'Life Orb', gender: 'N',
		moves: ['Bullet Punch', 'Autotomize', 'Earthquake'],
		signatureMove: 'Sunsteel Strike',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Steel', level: 100, skip: 'Nailgun',
	},
	'Proton Pack': {
		species: 'Proton Pack', ability: 'Lightning Rod', item: 'Leftovers', gender: 'N',
		moves: ['Will-O-Wisp', 'Strength Sap', 'Volt Switch'],
		signatureMove: 'Hex',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Calm', teraType: 'Dark', level: 100,
	},
	'Proton Pack 2': {
		species: 'Proton Pack', ability: 'Lightning Rod', item: 'Leftovers', gender: 'N',
		moves: ['Fire Blast', 'Nasty Plot', 'Volt Switch'],
		signatureMove: 'Moongeist Beam',
		evs: { hp: 252, spa: 252, spd: 4 }, nature: 'Modest', teraType: 'Dark', level: 100, skip: 'Proton Pack',
	},
	Railgun: {
		species: 'Railgun', ability: 'Good as Gold', item: 'Leftovers', gender: 'N',
		moves: ['Recover', 'Stealth Rock', 'Volt Switch'],
		signatureMove: 'Thunder Cage',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Calm', teraType: 'Flying', level: 100,
	},
	'Railgun 2': {
		species: 'Railgun', ability: 'Good as Gold', item: 'Life Orb', gender: 'N',
		moves: ['Energy Ball', 'Nasty Plot', 'Thunderclap'],
		signatureMove: 'Thunder Cage',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Flying', level: 100, skip: 'Railgun',
	},
	Scorpiongun: {
		species: 'Scorpiongun', ability: 'Tinted Lens', item: 'Choice Band', gender: 'N',
		moves: ['Leech Life', 'Close Combat', 'U-turn'],
		signatureMove: 'First Impression',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Adamant', teraType: 'Bug', level: 100,
	},
	'Scorpiongun 2': {
		species: 'Scorpiongun', ability: 'Tinted Lens', item: 'Leftovers', gender: 'N',
		moves: ['Taunt', 'Spikes', 'U-turn'],
		signatureMove: 'Earthquake',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Ground', level: 100, skip: 'Scorpiongun',
	},
	'Scorpiongun 3': {
		species: 'Scorpiongun', ability: 'Tinted Lens', item: 'Life Orb', gender: 'N',
		moves: ['Megahorn', 'Close Combat', 'Swords Dance'],
		signatureMove: 'Earthquake',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Fighting', level: 100, skip: 'Scorpiongun',
	},
	Shotgun: {
		species: 'Shotgun', ability: 'Sheer Force', item: 'Life Orb', gender: 'N',
		moves: ['Knock Off', 'Rock Slide', 'Iron Head'],
		signatureMove: 'Combat Torque',
		evs: { hp: 248, atk: 252, spd: 8 }, nature: 'Adamant', teraType: 'Steel', level: 100,
	},
	'Shotgun 2': {
		species: 'Shotgun', ability: 'No Guard', item: 'Life Orb', gender: 'N',
		moves: ['Earthquake', 'Stone Edge', 'Knock Off'],
		signatureMove: 'Dynamic Punch',
		evs: { hp: 248, atk: 252, spd: 8 }, nature: 'Adamant', teraType: 'Fighting', level: 100, skip: 'Shotgun',
	},
	Tommygun: {
		species: 'Tommygun', ability: 'Intimidate', item: 'Leftovers', gender: 'N',
		moves: ['Knock Off', 'Close Combat', 'Parting Shot'],
		signatureMove: 'Ceaseless Edge',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Fighting', level: 100,
	},
	'Tommygun 2': {
		species: 'Tommygun', ability: 'Intimidate', item: 'Life Orb', gender: 'N',
		moves: [['Knock Off', 'Taunt'], 'Stealth Rock', 'Parting Shot'],
		signatureMove: 'Ceaseless Edge',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly', teraType: 'Fairy', level: 100, skip: 'Tommygun',
	},
	Toygun: {
		species: 'Toygun', ability: 'Pixilate', item: 'Fairy Feather', gender: 'N',
		moves: ['Extreme Speed', 'Boomburst', 'Rapid Spin'],
		signatureMove: 'Psychic',
		evs: { atk: 4, spa: 252, spe: 252 }, nature: 'Hasty', teraType: 'Fairy', level: 100,
	},
	'Toygun 2': {
		species: 'Toygun', ability: 'Pixilate', item: 'Leftovers', gender: 'N',
		moves: ['Calm Mind', 'Boomburst', 'Rapid Spin'],
		signatureMove: 'Psychic',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Timid', teraType: 'Fairy', level: 100, skip: 'Toygun',
	},
	Watergun: {
		species: 'Watergun', ability: 'Mega Launcher', item: 'Choice Specs', gender: 'N',
		moves: ['Aura Sphere', 'Ice Beam', 'Flip Turn'],
		signatureMove: 'Steam Eruption',
		evs: { spa: 252, spd: 4, spe: 252 }, nature: 'Modest', teraType: 'Water', level: 100,
	},
};

export class RandomBLLTeams extends RandomTeams {
	randomBLLTeam(options: { inBattle?: boolean } = {}) {
		this.enforceNoDirectCustomBanlistChanges();

		const team: PokemonSet[] = [];
		const debug: string[] = []; // Set this to a list of BLL sets to override the normal pool for debugging.
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const monotype = this.forceMonotype || (ruleTable.has('sametypeclause') ?
			this.sample(this.dex.types.names().filter(x => x !== 'Stellar')) : false);

		let pool = Object.keys(bllSets);
		if (debug.length) {
			while (debug.length < 6) {
				const fakemon = this.sampleNoReplace(pool);
				if (debug.includes(fakemon) || bllSets[fakemon].skip) continue;
				debug.push(fakemon);
			}
			pool = debug;
		}
		if (monotype && !debug.length) {
			pool = pool.filter(x => this.dex.species.get(bllSets[x].species).types.includes(monotype));
		}
		if (global.Config?.disabledssbsets?.length) {
			pool = pool.filter(x => !global.Config.disabledssbsets.includes(this.dex.toID(x)));
		}
		const typePool: { [k: string]: number } = {};
		let depth = 0;
		while (pool.length && team.length < this.maxTeamSize) {
			if (depth >= 200) throw new Error(`Infinite loop in BLL team generation.`);
			depth++;
			const name = this.sampleNoReplace(pool);
			const bllSet: BLLSet = this.dex.deepClone(bllSets[name]);
			if (bllSet.skip) continue;

			// Enforce typing limits
			if (!(debug.length || monotype)) { // Type limits are ignored for debugging and monotype
				const species = this.dex.species.get(bllSet.species);

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
				if (bllSet.ability === 'Wonder Guard') {
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
			if (bllSet.teraType) {
				teraType = bllSet.teraType === 'Any' ?
					this.sample(this.dex.types.names()) :
					this.sampleIfArray(bllSet.teraType);
			}
			const moves: string[] = [];
			while (moves.length < 3 && bllSet.moves.length > 0) {
				let move = this.sampleNoReplace(bllSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				moves.push(this.dex.moves.get(move).name);
			}
			moves.push(this.dex.moves.get(bllSet.signatureMove).name);
			const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...bllSet.ivs };

			if (!moves.map(x => this.dex.moves.get(x)).some(x => x.category === 'Physical')) {
				ivs.atk = 0;
			}

			const set: PokemonSet = {
				name,
				species: bllSet.species,
				item: this.sampleIfArray(bllSet.item),
				ability: this.sampleIfArray(bllSet.ability),
				moves,
				nature: bllSet.nature ? Array.isArray(bllSet.nature) ? this.sampleNoReplace(bllSet.nature) : bllSet.nature : 'Lax',
				gender: bllSet.gender ? this.sampleIfArray(bllSet.gender) : this.sample(['M', 'F', 'N']),
				evs: bllSet.evs ? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...bllSet.evs } :

				{ hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84 },
				ivs,
				level: this.adjustLevel || bllSet.level || 100,
				happiness: typeof bllSet.happiness === 'number' ? bllSet.happiness : 255,
				shiny: typeof bllSet.shiny === 'number' ? this.randomChance(1, bllSet.shiny) : !!bllSet.shiny,
			};

			if (teraType) set.teraType = teraType;

			team.push(set);

			if (team.length === this.maxTeamSize && (set.ability === 'Illusion')) {
				team[this.maxTeamSize - 1] = team[this.maxTeamSize - 2];
				team[this.maxTeamSize - 2] = set;
			}
		}
		return team;
	}
}

export default RandomBLLTeams;