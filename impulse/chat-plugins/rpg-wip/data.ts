/*
* Pokemon Showdown
* RPG Data
*
* This file contains all static game data, such as encounter zones,
* type charts, trainer definitions, and starter Pokemon lists.
*/

import type { Stats, TrainerSpec } from './interface';

export const STARTER_POKEMON = {
	fire: ['pikachu', 'harmander', 'cyndaquil', 'torchic', 'chimchar', 'tepig'],
	water: ['eevee', 'squirtle', 'totodile', 'mudkip', 'piplup', 'oshawott'],
	grass: ['bulbasaur', 'chikorita', 'treecko', 'turtwig', 'snivy'],
};

// Location system with connections
export interface Location {
	id: string;
	name: string;
	description: string;
	connectedLocations: { id: string, name: string, requiredBadge?: string, requiredFlag?: string }[];
	hasPokeCenter: boolean;
	hasPokeMart: boolean;
	hasGym?: string; // Gym leader ID if present
}

export const LOCATIONS: Record<string, Location> = {
	'startertown': {
		id: 'startertown',
		name: 'Starter Town',
		description: 'A peaceful town where your journey begins. The air is fresh and the Pokemon are friendly.',
		connectedLocations: [
			{ id: 'route1', name: 'Route 1' },
		],
		hasPokeCenter: true,
		hasPokeMart: true,
	},
	'route1': {
		id: 'route1',
		name: 'Route 1',
		description: 'A scenic route filled with tall grass. Wild Pokemon can be found here.',
		connectedLocations: [
			{ id: 'startertown', name: 'Starter Town' },
			{ id: 'pewtercity', name: 'Pewter City' },
		],
		hasPokeCenter: false,
		hasPokeMart: false,
	},
	'pewtercity': {
		id: 'pewtercity',
		name: 'Pewter City',
		description: 'A city known for its stone and rock Pokemon. The Pewter Gym awaits challengers.',
		connectedLocations: [
			{ id: 'route1', name: 'Route 1' },
			{ id: 'route2', name: 'Route 2', requiredBadge: 'Boulder Badge' },
		],
		hasPokeCenter: true,
		hasPokeMart: true,
		hasGym: 'gym_brock',
	},
	'route2': {
		id: 'route2',
		name: 'Route 2',
		description: 'A longer route with stronger Pokemon. Only accessible after defeating the Pewter Gym.',
		connectedLocations: [
			{ id: 'pewtercity', name: 'Pewter City' },
			{ id: 'ceruleancity', name: 'Cerulean City' },
		],
		hasPokeCenter: false,
		hasPokeMart: false,
	},
	'ceruleancity': {
		id: 'ceruleancity',
		name: 'Cerulean City',
		description: 'A city surrounded by water. The Cerulean Gym specializes in Water-type Pokemon.',
		connectedLocations: [
			{ id: 'route2', name: 'Route 2' },
			{ id: 'route3', name: 'Route 3', requiredBadge: 'Cascade Badge' },
		],
		hasPokeCenter: true,
		hasPokeMart: true,
		hasGym: 'gym_misty',
	},
	'route3': {
		id: 'route3',
		name: 'Route 3',
		description: 'A mountainous route leading to Vermilion City. Electric Pokemon are common here.',
		connectedLocations: [
			{ id: 'ceruleancity', name: 'Cerulean City' },
			{ id: 'vermilioncity', name: 'Vermilion City' },
		],
		hasPokeCenter: false,
		hasPokeMart: false,
	},
	'vermilioncity': {
		id: 'vermilioncity',
		name: 'Vermilion City',
		description: 'A port city with a electric atmosphere. The Vermilion Gym tests trainers with Electric-types.',
		connectedLocations: [
			{ id: 'route3', name: 'Route 3' },
			{ id: 'route4', name: 'Route 4', requiredBadge: 'Thunder Badge' },
		],
		hasPokeCenter: true,
		hasPokeMart: true,
		hasGym: 'gym_ltsurge',
	},
	'route4': {
		id: 'route4',
		name: 'Route 4',
		description: 'A grassy route with diverse Pokemon. Leads to the next major city.',
		connectedLocations: [
			{ id: 'vermilioncity', name: 'Vermilion City' },
			{ id: 'celadoncity', name: 'Celadon City' },
		],
		hasPokeCenter: false,
		hasPokeMart: false,
	},
	'celadoncity': {
		id: 'celadoncity',
		name: 'Celadon City',
		description: 'The largest city in the region. Home to the Celadon Gym and a massive department store.',
		connectedLocations: [
			{ id: 'route4', name: 'Route 4' },
			{ id: 'route5', name: 'Route 5', requiredBadge: 'Rainbow Badge' },
		],
		hasPokeCenter: true,
		hasPokeMart: true,
		hasGym: 'gym_erika',
	},
	'route5': {
		id: 'route5',
		name: 'Route 5',
		description: 'A foggy route with mysterious Pokemon lurking in the mist.',
		connectedLocations: [
			{ id: 'celadoncity', name: 'Celadon City' },
			{ id: 'fuchsiacity', name: 'Fuchsia City' },
		],
		hasPokeCenter: false,
		hasPokeMart: false,
	},
	'fuchsiacity': {
		id: 'fuchsiacity',
		name: 'Fuchsia City',
		description: 'A city known for its Safari Zone. The Fuchsia Gym specializes in Poison-type Pokemon.',
		connectedLocations: [
			{ id: 'route5', name: 'Route 5' },
			{ id: 'route6', name: 'Route 6', requiredBadge: 'Soul Badge' },
		],
		hasPokeCenter: true,
		hasPokeMart: true,
		hasGym: 'gym_koga',
	},
	'route6': {
		id: 'route6',
		name: 'Route 6',
		description: 'A rugged path leading towards the coast.',
		connectedLocations: [
			{ id: 'fuchsiacity', name: 'Fuchsia City' },
			{ id: 'cinnabarisland', name: 'Cinnabar Island' },
		],
		hasPokeCenter: false,
		hasPokeMart: false,
	},
	'cinnabarisland': {
		id: 'cinnabarisland',
		name: 'Cinnabar Island',
		description: 'A volcanic island with a famous research lab. The Cinnabar Gym uses Fire-type Pokemon.',
		connectedLocations: [
			{ id: 'route6', name: 'Route 6' },
			{ id: 'route7', name: 'Route 7', requiredBadge: 'Volcano Badge' },
		],
		hasPokeCenter: true,
		hasPokeMart: true,
		hasGym: 'gym_blaine',
	},
	'route7': {
		id: 'route7',
		name: 'Route 7',
		description: 'The final route before reaching Viridian City and the last gym.',
		connectedLocations: [
			{ id: 'cinnabarisland', name: 'Cinnabar Island' },
			{ id: 'viridiancity', name: 'Viridian City' },
		],
		hasPokeCenter: false,
		hasPokeMart: false,
	},
	'viridiancity': {
		id: 'viridiancity',
		name: 'Viridian City',
		description: 'A historic city home to the final gym. Beyond lies Victory Road and the Pokemon League.',
		connectedLocations: [
			{ id: 'route7', name: 'Route 7' },
			{ id: 'victoryroad', name: 'Victory Road', requiredBadge: 'Earth Badge', requiredFlag: 'all_badges' },
		],
		hasPokeCenter: true,
		hasPokeMart: true,
		hasGym: 'gym_giovanni',
	},
	'victoryroad': {
		id: 'victoryroad',
		name: 'Victory Road',
		description: 'A treacherous cave filled with powerful trainers. Only those with all 8 badges may enter.',
		connectedLocations: [
			{ id: 'viridiancity', name: 'Viridian City' },
			{ id: 'pokemonleague', name: 'Pokemon League' },
		],
		hasPokeCenter: false,
		hasPokeMart: false,
	},
	'pokemonleague': {
		id: 'pokemonleague',
		name: 'Pokemon League',
		description: 'The ultimate challenge. Face the Elite Four and become the Champion!',
		connectedLocations: [
			{ id: 'victoryroad', name: 'Victory Road' },
		],
		hasPokeCenter: true,
		hasPokeMart: true,
	},
};

export const ENCOUNTER_ZONES: Record<string, { name: string, pokemon: string[], levelRange: [number, number], battleType?: 'single' | 'double' }> = {
	// Starter Town
	'startertown_grass': {
		name: 'Tall Grass',
		pokemon: ['pidgey', 'rattata', 'caterpie', 'weedle'],
		levelRange: [2, 5],
		battleType: 'single',
	},
	'startertown_pond': {
		name: 'Pond',
		pokemon: ['magikarp', 'feebas'],
		levelRange: [5, 10],
		battleType: 'single',
	},
	'startertown_doubles_grass': {
		name: 'Shaking Grass',
		pokemon: ['pidgey', 'rattata', 'nidoranf', 'nidoranm'],
		levelRange: [3, 6],
		battleType: 'double',
	},
	// Route 1
	'route1_grass': {
		name: 'Route 1 - Grass',
		pokemon: ['pidgey', 'rattata', 'spearow', 'sentret'],
		levelRange: [5, 8],
		battleType: 'single',
	},
	'route1_forest': {
		name: 'Route 1 - Forest',
		pokemon: ['caterpie', 'weedle', 'metapod', 'kakuna', 'butterfree', 'beedrill'],
		levelRange: [6, 9],
		battleType: 'single',
	},
	// Route 2
	'route2_grass': {
		name: 'Route 2 - Grass',
		pokemon: ['pidgey', 'spearow', 'ekans', 'sandshrew', 'nidoranf', 'nidoranm'],
		levelRange: [10, 14],
		battleType: 'single',
	},
	'route2_cave': {
		name: 'Route 2 - Cave Entrance',
		pokemon: ['zubat', 'geodude', 'onix'],
		levelRange: [11, 15],
		battleType: 'single',
	},
	// Route 3
	'route3_grass': {
		name: 'Route 3 - Grass',
		pokemon: ['pikachu', 'voltorb', 'magnemite', 'electrike'],
		levelRange: [17, 21],
		battleType: 'single',
	},
	'route3_mountain': {
		name: 'Route 3 - Mountain Path',
		pokemon: ['geodude', 'graveler', 'machop', 'onix'],
		levelRange: [18, 22],
		battleType: 'single',
	},
	// Route 4
	'route4_grass': {
		name: 'Route 4 - Grass',
		pokemon: ['oddish', 'bellsprout', 'weepinbell', 'gloom', 'tangela'],
		levelRange: [24, 28],
		battleType: 'single',
	},
	// Route 5
	'route5_grass': {
		name: 'Route 5 - Foggy Field',
		pokemon: ['gastly', 'haunter', 'drowzee', 'misdreavus'],
		levelRange: [30, 34],
		battleType: 'single',
	},
	// Route 6
	'route6_grass': {
		name: 'Route 6 - Rocky Path',
		pokemon: ['machop', 'machoke', 'geodude', 'graveler', 'rhyhorn'],
		levelRange: [36, 40],
		battleType: 'single',
	},
	// Route 7
	'route7_grass': {
		name: 'Route 7 - Final Stretch',
		pokemon: ['tauros', 'doduo', 'dodrio', 'ponyta', 'rapidash'],
		levelRange: [43, 47],
		battleType: 'single',
	},
	// Victory Road
	'victoryroad_cave': {
		name: 'Victory Road',
		pokemon: ['graveler', 'golem', 'machoke', 'machamp', 'onix', 'rhydon'],
		levelRange: [48, 52],
		battleType: 'single',
	},
	'victoryroad_doubles': {
		name: 'Victory Road - Deep Cave',
		pokemon: ['graveler', 'machoke', 'onix', 'rhydon'],
		levelRange: [50, 54],
		battleType: 'double',
	},
	// Pewter City
	'pewtercity_museum': {
		name: 'Museum Grounds',
		pokemon: ['omanyte', 'kabuto', 'aerodactyl'],
		levelRange: [15, 20],
		battleType: 'single',
	},
	// Cerulean City
	'ceruleancity_water': {
		name: 'Cerulean River',
		pokemon: ['goldeen', 'seaking', 'staryu', 'tentacool', 'psyduck'],
		levelRange: [18, 23],
		battleType: 'single',
	},
	// Fuchsia City
	'fuchsiacity_safari': {
		name: 'Safari Zone',
		pokemon: ['tauros', 'kangaskhan', 'scyther', 'pinsir', 'chansey', 'dratini'],
		levelRange: [35, 40],
		battleType: 'single',
	},
	// Cinnabar Island
	'cinnabarisland_volcano': {
		name: 'Volcano Path',
		pokemon: ['vulpix', 'growlithe', 'ponyta', 'magmar', 'flareon'],
		levelRange: [40, 45],
		battleType: 'single',
	},
};

export const BERRY_FLAVORS: Record<string, { flavor: string, stat: keyof Stats }> = {
	'figyberry': { flavor: 'Spicy', stat: 'atk' },
	'wikiberry': { flavor: 'Dry', stat: 'spa' },
	'magoberry': { flavor: 'Sweet', stat: 'spe' },
	'aguavberry': { flavor: 'Bitter', stat: 'spd' },
	'iapapaberry': { flavor: 'Sour', stat: 'def' },
};

export const NATURE_FLAVOR_PREFERENCES: Record<keyof Stats, string> = {
	atk: 'Spicy', def: 'Sour', spa: 'Dry', spd: 'Bitter', spe: 'Sweet', maxHp: '',
};

export const TYPE_RESIST_BERRIES: Record<string, string> = {
	'babiriberry': 'Steel', 'chartiberry': 'Rock', 'chilanberry': 'Normal', 'chopleberry': 'Fighting',
	'cobaberry': 'Flying', 'colburberry': 'Dark', 'habanberry': 'Dragon', 'kasibberry': 'Ghost',
	'kebiaberry': 'Poison', 'occaberry': 'Fire', 'passhoberry': 'Water', 'payapaberry': 'Psychic',
	'rindoberry': 'Grass', 'roseliberry': 'Fairy', 'shucaberry': 'Ground', 'tangaberry': 'Bug',
	'wacanberry': 'Electric', 'yacheberry': 'Ice',
};

export const TYPE_CHART: { [type: string]: { superEffective: string[], notVeryEffective: string[], noEffect: string[] } } = {
	Normal: { superEffective: [], notVeryEffective: ['Rock', 'Steel'], noEffect: ['Ghost'] },
	Fire: { superEffective: ['Grass', 'Ice', 'Bug', 'Steel'], notVeryEffective: ['Fire', 'Water', 'Rock', 'Dragon'], noEffect: [] },
	Water: { superEffective: ['Fire', 'Ground', 'Rock'], notVeryEffective: ['Water', 'Grass', 'Dragon'], noEffect: [] },
	Grass: { superEffective: ['Water', 'Ground', 'Rock'], notVeryEffective: ['Fire', 'Grass', 'Poison', 'Flying', 'Bug', 'Dragon', 'Steel'], noEffect: [] },
	Electric: { superEffective: ['Water', 'Flying'], notVeryEffective: ['Grass', 'Electric', 'Dragon'], noEffect: ['Ground'] },
	Ice: { superEffective: ['Grass', 'Ground', 'Flying', 'Dragon'], notVeryEffective: ['Fire', 'Water', 'Ice', 'Steel'], noEffect: [] },
	Fighting: { superEffective: ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'], notVeryEffective: ['Poison', 'Flying', 'Psychic', 'Bug', 'Fairy'], noEffect: ['Ghost'] },
	Poison: { superEffective: ['Grass', 'Fairy'], notVeryEffective: ['Poison', 'Ground', 'Rock', 'Ghost'], noEffect: ['Steel'] },
	Ground: { superEffective: ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'], notVeryEffective: ['Grass', 'Bug'], noEffect: ['Flying'] },
	Flying: { superEffective: ['Grass', 'Fighting', 'Bug'], notVeryEffective: ['Electric', 'Rock', 'Steel'], noEffect: [] },
	Psychic: { superEffective: ['Fighting', 'Poison'], notVeryEffective: ['Psychic', 'Steel'], noEffect: ['Dark'] },
	Bug: { superEffective: ['Grass', 'Psychic', 'Dark'], notVeryEffective: ['Fire', 'Fighting', 'Poison', 'Flying', 'Ghost', 'Steel', 'Fairy'], noEffect: [] },
	Rock: { superEffective: ['Fire', 'Ice', 'Flying', 'Bug'], notVeryEffective: ['Fighting', 'Ground', 'Steel'], noEffect: [] },
	Ghost: { superEffective: ['Psychic', 'Ghost'], notVeryEffective: ['Dark'], noEffect: ['Normal'] },
	Dragon: { superEffective: ['Dragon'], notVeryEffective: ['Steel'], noEffect: ['Fairy'] },
	Dark: { superEffective: ['Psychic', 'Ghost'], notVeryEffective: ['Fighting', 'Dark', 'Fairy'], noEffect: [] },
	Steel: { superEffective: ['Ice', 'Rock', 'Fairy'], notVeryEffective: ['Fire', 'Water', 'Electric', 'Steel'], noEffect: [] },
	Fairy: { superEffective: ['Fighting', 'Dragon', 'Dark'], notVeryEffective: ['Fire', 'Poison', 'Steel'], noEffect: [] },
};

export const TRAINER_DATABASE: Record<string, TrainerSpec> = {
	// Rival Battles
	'rival_1': {
		name: 'Rival',
		money: 500,
		party: [
			{ species: 'eevee', level: 5, item: 'oranberry' },
		],
		dialogue: {
			start: "Wait up! Let's see whose Pokémon is stronger!",
			win: "What? I... I lost?!",
			lose: "Heh! I'm stronger than you!",
		},
	},
	'rival_2': {
		name: 'Rival',
		money: 1500,
		party: [
			{ species: 'pidgeotto', level: 16 },
			{ species: 'flareon', level: 18, item: 'oranberry' },
		],
		dialogue: {
			start: "I've been training hard! My Eevee evolved!",
			win: "No way! I trained so much...",
			lose: "See? I'm getting stronger!",
		},
	},
	'rival_3': {
		name: 'Rival',
		money: 2500,
		party: [
			{ species: 'pidgeot', level: 28 },
			{ species: 'gyarados', level: 30, moves: ['waterfall', 'bite', 'icefang', 'dragondance'] },
			{ species: 'flareon', level: 30, item: 'sitrusberry' },
		],
		dialogue: {
			start: "You're still here? Let's see if you can keep up!",
			win: "Ugh... You're tough!",
			lose: "I'm on my way to becoming Champion!",
		},
	},
	
	// Gym Leaders
	'gym_brock': {
		name: 'Gym Leader Brock',
		money: 1680,
		party: [
			{ species: 'geodude', level: 12, moves: ['tackle', 'defensecurl', 'rockthrow', 'rollout'] },
			{ species: 'onix', level: 14, moves: ['tackle', 'rockthrow', 'bind', 'rockpolish'], item: 'sitrusberry' },
		],
		dialogue: {
			start: "I'm Brock! I'm Pewter's Gym Leader! I believe in rock-solid defense and determination!",
			win: "I took you for granted. As proof of your victory, here's the Boulder Badge!",
			lose: "The best offense is a good defense! That's my way!",
		},
	},
	'gym_misty': {
		name: 'Gym Leader Misty',
		money: 2520,
		party: [
			{ species: 'staryu', level: 19, moves: ['watergun', 'rapidspin', 'recover', 'bubblebeam'] },
			{ species: 'starmie', level: 21, moves: ['watergun', 'confuseray', 'psychic', 'bubblebeam'], item: 'mysticwater' },
		],
		dialogue: {
			start: "Hi! I'm Misty, the Cerulean Gym Leader! I'm a Water-type specialist!",
			win: "Wow! You're too much! Here, take the Cascade Badge!",
			lose: "Was it too easy for you? Hahaha!",
		},
	},
	'gym_ltsurge': {
		name: 'Gym Leader Lt. Surge',
		money: 3360,
		party: [
			{ species: 'voltorb', level: 25, moves: ['spark', 'sonicboom', 'selfdestruct', 'lightscreen'] },
			{ species: 'pikachu', level: 25, moves: ['thunderbolt', 'quickattack', 'thunderwave', 'slam'] },
			{ species: 'raichu', level: 28, moves: ['thunderbolt', 'quickattack', 'thunderwave', 'bodyslam'], item: 'lumberry' },
		],
		dialogue: {
			start: "Hey kid! You want to battle me? I'm Lt. Surge, the Lightning American!",
			win: "Whoa! You're electrifying! Take the Thunder Badge!",
			lose: "Hahaha! That was electrifying!",
		},
	},
	'gym_erika': {
		name: 'Gym Leader Erika',
		money: 4200,
		party: [
			{ species: 'victreebel', level: 32, moves: ['razorleaf', 'acid', 'poisonpowder', 'wrap'] },
			{ species: 'tangela', level: 32, moves: ['vinewhip', 'bind', 'poisonpowder', 'growth'] },
			{ species: 'vileplume', level: 34, moves: ['gigadrain', 'acid', 'stunspore', 'moonlight'], item: 'bigroot' },
		],
		dialogue: {
			start: "Hello... I am Erika. I am the Celadon Gym Leader. Nature and Grass Pokémon are my specialty.",
			win: "Oh! I concede defeat... You are remarkably strong. Here is the Rainbow Badge.",
			lose: "You may go now.",
		},
	},
	'gym_koga': {
		name: 'Gym Leader Koga',
		money: 5040,
		party: [
			{ species: 'koffing', level: 38, moves: ['sludge', 'smokescreen', 'selfdestruct', 'toxic'] },
			{ species: 'muk', level: 39, moves: ['sludgebomb', 'minimize', 'toxic', 'acidarmor'], item: 'blacksludge' },
			{ species: 'weezing', level: 40, moves: ['sludgebomb', 'smokescreen', 'toxic', 'explosion'] },
			{ species: 'venomoth', level: 42, moves: ['psychic', 'sludgebomb', 'toxic', 'quiverdance'], item: 'focussash' },
		],
		dialogue: {
			start: "Fwahahaha! A challenger! I am Koga, master of Poison-type Pokémon!",
			win: "Humph! You have proven your worth! Take the Soul Badge!",
			lose: "Confusion, poison... Ninjutsu is all about strategy!",
		},
	},
	'gym_blaine': {
		name: 'Gym Leader Blaine',
		money: 5880,
		party: [
			{ species: 'growlithe', level: 44, moves: ['flamethrower', 'bite', 'takedown', 'roar'] },
			{ species: 'rapidash', level: 45, moves: ['fireblast', 'bounce', 'megahorn', 'quickattack'] },
			{ species: 'arcanine', level: 47, moves: ['flareblitz', 'extremespeed', 'crunch', 'wildcharge'], item: 'charcoal' },
		],
		dialogue: {
			start: "Hah! I am Blaine! I am the Leader of Cinnabar Gym! My fiery Pokémon will incinerate all challengers!",
			win: "I have burned out! You have earned the Volcano Badge!",
			lose: "Haha! Intense heat makes intense battles!",
		},
	},
	'gym_sabrina': {
		name: 'Gym Leader Sabrina',
		money: 5040,
		party: [
			{ species: 'kadabra', level: 40, moves: ['psychic', 'psybeam', 'reflect', 'recover'] },
			{ species: 'mrmine', level: 40, moves: ['psychic', 'reflect', 'lightscreen', 'batonpass'], item: 'lightclay' },
			{ species: 'alakazam', level: 43, moves: ['psychic', 'shadowball', 'calmmind', 'recover'], item: 'twistedspoon' },
		],
		dialogue: {
			start: "I had a vision of your arrival. I am Sabrina, Saffron's Gym Leader!",
			win: "I... I can't... believe it... Take the Marsh Badge.",
			lose: "Everyone has psychic power! People just don't realize it!",
		},
	},
	'gym_giovanni': {
		name: 'Gym Leader Giovanni',
		money: 6720,
		party: [
			{ species: 'rhyhorn', level: 47, moves: ['earthquake', 'rockslide', 'megahorn', 'drillrun'] },
			{ species: 'nidoking', level: 48, moves: ['earthquake', 'megahorn', 'icebeam', 'thunderbolt'], item: 'lifeorb' },
			{ species: 'nidoqueen', level: 48, moves: ['earthquake', 'sludgebomb', 'icebeam', 'crunch'] },
			{ species: 'rhydon', level: 50, moves: ['earthquake', 'stoneedge', 'megahorn', 'swordsdance'], item: 'focussash' },
		],
		dialogue: {
			start: "So, you wish to challenge me? I am Giovanni, the Viridian Gym Leader and master of Ground-type Pokémon!",
			win: "Ha! That was truly impressive. Take the Earth Badge. You've earned it.",
			lose: "This is the power of earth itself!",
		},
	},
	
	// Regular Trainers - Route 1
	'youngster_joey': {
		name: 'Youngster Joey',
		money: 240,
		party: [
			{ species: 'rattata', level: 6 },
		],
		dialogue: {
			start: "My Rattata is in the top percentage of Rattata!",
			win: "My Rattata needs more training...",
			lose: "See? Top percentage!",
		},
	},
	'lass_alice': {
		name: 'Lass Alice',
		money: 280,
		party: [
			{ species: 'pidgey', level: 7 },
			{ species: 'caterpie', level: 7 },
		],
		dialogue: {
			start: "Want to battle? I just started my journey!",
			win: "I'll train harder next time!",
			lose: "Yay! I won!",
		},
	},
	
	// Elite Four
	'elite_lorelei': {
		name: 'Elite Four Lorelei',
		money: 10000,
		party: [
			{ species: 'dewgong', level: 54, moves: ['icebeam', 'surf', 'signalbeam', 'rest'], item: 'chestoberry' },
			{ species: 'cloyster', level: 54, moves: ['iciclecrash', 'hydropump', 'shellsmash', 'rockblast'], item: 'focussash' },
			{ species: 'slowbro', level: 54, moves: ['icebeam', 'psychic', 'surf', 'slackoff'], item: 'leftovers' },
			{ species: 'jynx', level: 56, moves: ['blizzard', 'psychic', 'lovelykiss', 'nastyplot'], item: 'lifeorb' },
			{ species: 'lapras', level: 58, moves: ['icebeam', 'hydropump', 'thunderbolt', 'iceshard'], item: 'sitrusberry' },
		],
		dialogue: {
			start: "Welcome. I am Lorelei of the Elite Four. No one can best me when it comes to icy Pokémon!",
			win: "How dare you! You're strong... You'll make it far.",
			lose: "That's the way a true master does it!",
		},
	},
};
