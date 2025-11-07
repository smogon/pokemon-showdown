/*
* Pokemon Showdown
* RPG Data
*
* This file contains all static game data, such as encounter zones,
* type charts, trainer definitions, and starter Pokemon lists.
*/

import type { Stats, TrainerSpec, NPCData, Location } from './interface';

export const STARTER_POKEMON = {
	fire: ['pikachu', 'harmander', 'cyndaquil', 'torchic', 'chimchar', 'tepig'],
	water: ['eevee', 'squirtle', 'totodile', 'mudkip', 'piplup', 'oshawott'],
	grass: ['bulbasaur', 'chikorita', 'treecko', 'turtwig', 'snivy'],
};

export const LOCATIONS: Record<string, Location> = {
	'startertown': {
		id: 'startertown',
		name: 'Starter Town',
		type: 'town',
		description: 'A peaceful town where your journey begins. The air is fresh and the Pokemon are friendly.',
		connectedLocations: [
			{ id: 'route1', name: 'Route 1' },
		],
		buildings: [
			{
				id: 'startertown_pokecenter',
				name: 'Pokemon Center',
				type: 'pokecenter',
				description: 'A place to heal your Pokemon and access your PC.',
				npcs: ['nursejoy_startertown'],
			},
			{
				id: 'startertown_pokemart',
				name: 'Poke Mart',
				type: 'pokemart',
				description: 'A shop where you can buy items for your journey.',
				shopTier: 1,
			},
			{
				id: 'startertown_lab',
				name: 'Professor\'s Lab',
				type: 'lab',
				description: 'The lab where Professor Oak conducts his research.',
				npcs: ['professor'],
			},
			{
				id: 'startertown_house1',
				name: 'Friendly House',
				type: 'house',
				description: 'A cozy house with a friendly resident.',
				npcs: ['itemcollector'],
			},
		],
		encounterZones: ['startertown_grass', 'startertown_pond', 'startertown_doubles_grass'],
		scriptedEvents: [
			{
				id: 'welcome_to_startertown',
				name: 'Professor Oak\'s Welcome',
				triggerOnce: true,
				type: 'dialogue',
				dialogue: 'Welcome to Starter Town! I\'m Professor Oak. I see you\'re ready to begin your Pokémon journey. Make sure to visit the Pokémon Center if your Pokémon need healing!',
			},
		],
	},
	'route1': {
		id: 'route1',
		name: 'Route 1',
		type: 'route',
		description: 'A scenic route filled with tall grass. Wild Pokemon can be found here.',
		connectedLocations: [
			{ id: 'startertown', name: 'Starter Town' },
			{ id: 'pewtercity', name: 'Pewter City' },
		],
		encounterZones: ['route1_grass', 'route1_forest'],
		scriptedEvents: [
			{
				id: 'route1_first_visit',
				name: 'First Route Experience',
				triggerOnce: true,
				type: 'dialogue',
				dialogue: 'This is your first route! Wild Pokémon hide in the tall grass. Be careful and catch some new friends!',
			},
		],
	},
	'pewtercity': {
		id: 'pewtercity',
		name: 'Pewter City',
		type: 'city',
		description: 'A city known for its stone and rock Pokemon. The Pewter Gym awaits challengers.',
		connectedLocations: [
			{ id: 'route1', name: 'Route 1' },
			{ id: 'route2', name: 'Route 2', requiredBadge: 'Boulder Badge' },
		],
		buildings: [
			{
				id: 'pewtercity_pokecenter',
				name: 'Pokemon Center',
				type: 'pokecenter',
				description: 'A place to heal your Pokemon and access your PC.',
				npcs: ['nursejoy_pewter'],
			},
			{
				id: 'pewtercity_pokemart',
				name: 'Poke Mart',
				type: 'pokemart',
				description: 'A shop where you can buy items for your journey.',
				shopTier: 1,
			},
			{
				id: 'pewtercity_gym',
				name: 'Pewter City Gym',
				type: 'gym',
				description: 'The Pewter City Gym, where Brock tests trainers with Rock-type Pokemon.',
				gymLeaderId: 'gymbrock',
			},
			{
				id: 'pewtercity_museum',
				name: 'Pewter Museum of Science',
				type: 'museum',
				description: 'A museum showcasing ancient Pokemon fossils.',
				npcs: ['oldmanpewter'],
			},
		],
		encounterZones: ['pewtercity_museum'],
	},
	'route2': {
		id: 'route2',
		name: 'Route 2',
		type: 'route',
		description: 'A longer route with stronger Pokemon. Only accessible after defeating the Pewter Gym.',
		connectedLocations: [
			{ id: 'pewtercity', name: 'Pewter City' },
			{ id: 'ceruleancity', name: 'Cerulean City' },
		],
		encounterZones: ['route2_grass', 'route2_cave'],
		scriptedEvents: [
			{
				id: 'rival_battle_route2',
				name: 'Rival Encounter',
				triggerOnce: true,
				type: 'trainer',
				trainerId: 'rival2',
				dialogue: 'Hey! I\'ve been training hard since we last met. Let\'s battle!',
				setFlag: 'rival2_defeated',
			},
			{
				id: 'route2_gift',
				name: 'Hiker\'s Gift',
				triggerOnce: true,
				requiredFlag: 'rival2_defeated',
				type: 'item',
				itemId: 'potion',
				itemQuantity: 3,
				dialogue: 'You look like a strong trainer! Here, take these potions for your journey.',
			},
		],
	},
	'ceruleancity': {
		id: 'ceruleancity',
		name: 'Cerulean City',
		type: 'city',
		description: 'A city surrounded by water. The Cerulean Gym specializes in Water-type Pokemon.',
		connectedLocations: [
			{ id: 'route2', name: 'Route 2' },
			{ id: 'route3', name: 'Route 3', requiredBadge: 'Cascade Badge' },
		],
		buildings: [
			{
				id: 'ceruleancity_pokecenter',
				name: 'Pokemon Center',
				type: 'pokecenter',
				description: 'A place to heal your Pokemon and access your PC.',
				npcs: ['nursecerulean'],
			},
			{
				id: 'ceruleancity_pokemart',
				name: 'Poke Mart',
				type: 'pokemart',
				description: 'A shop where you can buy items for your journey.',
				shopTier: 2,
			},
			{
				id: 'ceruleancity_gym',
				name: 'Cerulean City Gym',
				type: 'gym',
				description: 'The Cerulean City Gym, where Misty tests trainers with Water-type Pokemon.',
				gymLeaderId: 'gymmisty',
			},
		],
		encounterZones: ['ceruleancity_water'],
	},
	'route3': {
		id: 'route3',
		name: 'Route 3',
		type: 'route',
		description: 'A mountainous route leading to Vermilion City. Electric Pokemon are common here.',
		connectedLocations: [
			{ id: 'ceruleancity', name: 'Cerulean City' },
			{ id: 'vermilioncity', name: 'Vermilion City' },
		],
		encounterZones: ['route3_grass', 'route3_mountain'],
	},
	'vermilioncity': {
		id: 'vermilioncity',
		name: 'Vermilion City',
		type: 'city',
		description: 'A port city with an electric atmosphere. The Vermilion Gym tests trainers with Electric-types.',
		connectedLocations: [
			{ id: 'route3', name: 'Route 3' },
			{ id: 'route4', name: 'Route 4', requiredBadge: 'Thunder Badge' },
		],
		buildings: [
			{
				id: 'vermilioncity_pokecenter',
				name: 'Pokemon Center',
				type: 'pokecenter',
				description: 'A place to heal your Pokemon and access your PC.',
				npcs: ['nursejoy_vermilion'],
			},
			{
				id: 'vermilioncity_pokemart',
				name: 'Poke Mart',
				type: 'pokemart',
				description: 'A shop where you can buy items for your journey.',
				shopTier: 3,
			},
			{
				id: 'vermilioncity_gym',
				name: 'Vermilion City Gym',
				type: 'gym',
				description: 'The Vermilion City Gym, where Lt. Surge tests trainers with Electric-type Pokemon.',
				gymLeaderId: 'gymltsurge',
			},
			{
				id: 'vermilioncity_house1',
				name: 'Port House',
				type: 'house',
				description: 'A house near the port.',
				npcs: ['girlvermilion'],
			},
		],
		encounterZones: [],
	},
	'route4': {
		id: 'route4',
		name: 'Route 4',
		type: 'route',
		description: 'A grassy route with diverse Pokemon. Leads to the next major city.',
		connectedLocations: [
			{ id: 'vermilioncity', name: 'Vermilion City' },
			{ id: 'celadoncity', name: 'Celadon City' },
		],
		encounterZones: ['route4_grass'],
	},
	'celadoncity': {
		id: 'celadoncity',
		name: 'Celadon City',
		type: 'city',
		description: 'The largest city in the region. Home to the Celadon Gym and a massive department store.',
		connectedLocations: [
			{ id: 'route4', name: 'Route 4' },
			{ id: 'route5', name: 'Route 5', requiredBadge: 'Rainbow Badge' },
		],
		buildings: [
			{
				id: 'celadoncity_pokecenter',
				name: 'Pokemon Center',
				type: 'pokecenter',
				description: 'A place to heal your Pokemon and access your PC.',
				npcs: ['nursejoy_celadon'],
			},
			{
				id: 'celadoncity_department',
				name: 'Celadon Department Store',
				type: 'department',
				description: 'A massive department store with the best items in the region.',
				shopTier: 4,
				npcs: ['shopkeeperceladon'],
			},
			{
				id: 'celadoncity_gym',
				name: 'Celadon City Gym',
				type: 'gym',
				description: 'The Celadon City Gym, where Erika tests trainers with Grass-type Pokemon.',
				gymLeaderId: 'gymerika',
			},
			{
				id: 'celadoncity_gamecorner',
				name: 'Game Corner',
				type: 'gameCorner',
				description: 'A place where trainers can play games and win prizes.',
				npcs: ['mysteryman'],
			},
		],
		encounterZones: [],
	},
	'route5': {
		id: 'route5',
		name: 'Route 5',
		type: 'route',
		description: 'A foggy route with mysterious Pokemon lurking in the mist.',
		connectedLocations: [
			{ id: 'celadoncity', name: 'Celadon City' },
			{ id: 'fuchsiacity', name: 'Fuchsia City' },
		],
		encounterZones: ['route5_grass'],
	},
	'fuchsiacity': {
		id: 'fuchsiacity',
		name: 'Fuchsia City',
		type: 'city',
		description: 'A city known for its Safari Zone. The Fuchsia Gym specializes in Poison-type Pokemon.',
		connectedLocations: [
			{ id: 'route5', name: 'Route 5' },
			{ id: 'route6', name: 'Route 6', requiredBadge: 'Soul Badge' },
		],
		buildings: [
			{
				id: 'fuchsiacity_pokecenter',
				name: 'Pokemon Center',
				type: 'pokecenter',
				description: 'A place to heal your Pokemon and access your PC.',
				npcs: ['nursejoy_fuchsia'],
			},
			{
				id: 'fuchsiacity_pokemart',
				name: 'Poke Mart',
				type: 'pokemart',
				description: 'A shop where you can buy items for your journey.',
				shopTier: 5,
			},
			{
				id: 'fuchsiacity_gym',
				name: 'Fuchsia City Gym',
				type: 'gym',
				description: 'The Fuchsia City Gym, where Koga tests trainers with Poison-type Pokemon.',
				gymLeaderId: 'gymkoga',
			},
			{
				id: 'fuchsiacity_house1',
				name: 'Expert Trainer\'s House',
				type: 'house',
				description: 'The home of an expert trainer.',
				npcs: ['trainerfuchsia'],
			},
		],
		encounterZones: ['fuchsiacity_safari'],
	},
	'route6': {
		id: 'route6',
		name: 'Route 6',
		type: 'route',
		description: 'A rugged path leading towards the coast.',
		connectedLocations: [
			{ id: 'fuchsiacity', name: 'Fuchsia City' },
			{ id: 'cinnabarisland', name: 'Cinnabar Island' },
		],
		encounterZones: ['route6_grass'],
	},
	'cinnabarisland': {
		id: 'cinnabarisland',
		name: 'Cinnabar Island',
		type: 'city',
		description: 'A volcanic island with a famous research lab. The Cinnabar Gym uses Fire-type Pokemon.',
		connectedLocations: [
			{ id: 'route6', name: 'Route 6' },
			{ id: 'route7', name: 'Route 7', requiredBadge: 'Volcano Badge' },
		],
		buildings: [
			{
				id: 'cinnabarisland_pokecenter',
				name: 'Pokemon Center',
				type: 'pokecenter',
				description: 'A place to heal your Pokemon and access your PC.',
				npcs: ['nursejoy_cinnabar'],
			},
			{
				id: 'cinnabarisland_pokemart',
				name: 'Poke Mart',
				type: 'pokemart',
				description: 'A shop where you can buy items for your journey.',
				shopTier: 6,
			},
			{
				id: 'cinnabarisland_gym',
				name: 'Cinnabar Island Gym',
				type: 'gym',
				description: 'The Cinnabar Island Gym, where Blaine tests trainers with Fire-type Pokemon.',
				gymLeaderId: 'gymblaine',
			},
			{
				id: 'cinnabarisland_lab',
				name: 'Pokemon Lab',
				type: 'lab',
				description: 'A research lab studying Pokemon.',
				npcs: ['scientistcinnabar'],
			},
		],
		encounterZones: ['cinnabarisland_volcano'],
	},
	'route7': {
		id: 'route7',
		name: 'Route 7',
		type: 'route',
		description: 'The final route before reaching Viridian City and the last gym.',
		connectedLocations: [
			{ id: 'cinnabarisland', name: 'Cinnabar Island' },
			{ id: 'viridiancity', name: 'Viridian City' },
		],
		encounterZones: ['route7_grass'],
	},
	'viridiancity': {
		id: 'viridiancity',
		name: 'Viridian City',
		type: 'city',
		description: 'A historic city home to the final gym. Beyond lies Victory Road and the Pokemon League.',
		connectedLocations: [
			{ id: 'route7', name: 'Route 7' },
			{ id: 'victoryroad', name: 'Victory Road', requiredBadge: 'Earth Badge', requiredFlag: 'all_badges' },
		],
		buildings: [
			{
				id: 'viridiancity_pokecenter',
				name: 'Pokemon Center',
				type: 'pokecenter',
				description: 'A place to heal your Pokemon and access your PC.',
				npcs: ['nursejoy_viridian'],
			},
			{
				id: 'viridiancity_pokemart',
				name: 'Poke Mart',
				type: 'pokemart',
				description: 'A shop where you can buy items for your journey.',
				shopTier: 7,
			},
			{
				id: 'viridiancity_gym',
				name: 'Viridian City Gym',
				type: 'gym',
				description: 'The Viridian City Gym, where Giovanni tests trainers with Ground-type Pokemon.',
				gymLeaderId: 'gymgiovanni',
			},
			{
				id: 'viridiancity_house1',
				name: 'Guard House',
				type: 'house',
				description: 'The house of the city guard.',
				npcs: ['guardviridian'],
			},
		],
		encounterZones: [],
	},
	'victoryroad': {
		id: 'victoryroad',
		name: 'Victory Road',
		type: 'special',
		description: 'A treacherous cave filled with powerful trainers. Only those with all 8 badges may enter.',
		connectedLocations: [
			{ id: 'viridiancity', name: 'Viridian City' },
			{ id: 'pokemonleague', name: 'Pokemon League' },
		],
		encounterZones: ['victoryroad_cave', 'victoryroad_doubles'],
	},
	'pokemonleague': {
		id: 'pokemonleague',
		name: 'Pokemon League',
		type: 'special',
		description: 'The ultimate challenge. Face the Elite Four and become the Champion!',
		connectedLocations: [
			{ id: 'victoryroad', name: 'Victory Road' },
		],
		buildings: [
			{
				id: 'pokemonleague_pokecenter',
				name: 'Pokemon Center',
				type: 'pokecenter',
				description: 'The final Pokemon Center before the Elite Four.',
				npcs: ['nursejoy_league'],
			},
			{
				id: 'pokemonleague_pokemart',
				name: 'Poke Mart',
				type: 'pokemart',
				description: 'The final shop before the ultimate challenge.',
				shopTier: 8,
			},
		],
		encounterZones: [],
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
	'rival1': {
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
	'rival2': {
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
	'rival3': {
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
	'gymbrock': {
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
	'gymmisty': {
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
	'gymltsurge': {
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
	'gymerika': {
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
	'gymkoga': {
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
	'gymblaine': {
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
	'gymsabrina': {
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
	'gymgiovanni': {
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
	'youngsterjoey': {
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
	'lassalice': {
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
	'elitelorelei': {
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
	'elitebruno': {
		name: 'Elite Four Bruno',
		money: 10000,
		party: [
			{ species: 'onix', level: 55, moves: ['earthquake', 'stoneedge', 'stealthrock', 'explosion'], item: 'custapberry' },
			{ species: 'hitmonchan', level: 55, moves: ['drainpunch', 'icepunch', 'thunderpunch', 'machpunch'], item: 'expertbelt' },
			{ species: 'hitmonlee', level: 55, moves: ['highjumpkick', 'stoneedge', 'blazekick', 'suckerpunch'], item: 'lifeorb' },
			{ species: 'machamp', level: 57, moves: ['dynamicpunch', 'stoneedge', 'payback', 'bulletpunch'], item: 'focussash' },
			{ species: 'poliwrath', level: 58, moves: ['waterfall', 'icepunch', 'earthquake', 'circlethrow'], item: 'leftovers' },
		],
		dialogue: {
			start: "I am Bruno of the Elite Four! Through rigorous training, my Fighting Pokémon have become true champions!",
			win: "My training wasn't enough... You have great strength!",
			lose: "Discipline and training are the keys to victory!",
		},
	},
	'eliteagatha': {
		name: 'Elite Four Agatha',
		money: 10000,
		party: [
			{ species: 'gengar', level: 56, moves: ['shadowball', 'sludgebomb', 'focusblast', 'taunt'], item: 'blacksludge' },
			{ species: 'golbat', level: 56, moves: ['bravebird', 'crosspoison', 'uturn', 'roost'], item: 'lifeorb' },
			{ species: 'haunter', level: 55, moves: ['shadowball', 'sludgebomb', 'willowisp', 'substitute'], item: 'focussash' },
			{ species: 'arbok', level: 57, moves: ['gunkshot', 'earthquake', 'suckerpunch', 'coil'], item: 'blacksludge' },
			{ species: 'gengar', level: 60, moves: ['shadowball', 'sludgebomb', 'thunderbolt', 'destinybond'], item: 'lifeorb' },
		],
		dialogue: {
			start: "Kekeke! I am Agatha of the Elite Four! I'll show you how frightening Poison and Ghost-type Pokémon can be!",
			win: "Oh my! You're something special...",
			lose: "Ghosts and Poison are the perfect combination!",
		},
	},
	'elitelance': {
		name: 'Elite Four Lance',
		money: 10000,
		party: [
			{ species: 'gyarados', level: 58, moves: ['waterfall', 'icefang', 'earthquake', 'dragondance'], item: 'lumberry' },
			{ species: 'dragonair', level: 56, moves: ['dragonpulse', 'icebeam', 'thunderbolt', 'agility'], item: 'leftovers' },
			{ species: 'dragonair', level: 56, moves: ['outrage', 'aquatail', 'extremespeed', 'dragondance'], item: 'lumberry' },
			{ species: 'aerodactyl', level: 58, moves: ['stoneedge', 'earthquake', 'firefang', 'wingattack'], item: 'focussash' },
			{ species: 'dragonite', level: 62, moves: ['outrage', 'earthquake', 'extremespeed', 'fireblast'], item: 'choiceband' },
		],
		dialogue: {
			start: "I am Lance, the Dragon Master! I've been waiting for a trainer strong enough to face me!",
			win: "I still can't believe it... You are truly a Dragon Master now!",
			lose: "The might of dragons is unmatched!",
		},
	},

	// Champion
	'championblue': {
		name: 'Champion Blue',
		money: 15000,
		party: [
			{ species: 'pidgeot', level: 61, moves: ['hurricane', 'heatwave', 'uturn', 'roost'], item: 'sharpbeak' },
			{ species: 'alakazam', level: 61, moves: ['psychic', 'shadowball', 'focusblast', 'calmmind'], item: 'lifeorb' },
			{ species: 'rhydon', level: 61, moves: ['earthquake', 'stoneedge', 'megahorn', 'swordsdance'], item: 'softsand' },
			{ species: 'exeggutor', level: 63, moves: ['gigadrain', 'psychic', 'sleeppowder', 'explosion'], item: 'leftovers' },
			{ species: 'gyarados', level: 63, moves: ['waterfall', 'earthquake', 'icefang', 'dragondance'], item: 'lumberry' },
			{ species: 'blastoise', level: 65, moves: ['hydropump', 'icebeam', 'earthquake', 'rapidspin'], item: 'sitrusberry' },
		],
		dialogue: {
			start: "I've been waiting for you! I'm Blue, the Pokémon League Champion! Your rival from the very beginning!",
			win: "What!? I lost!? No way! You are the new Champion!",
			lose: "I'm the Champion for a reason!",
		},
	},

	// Route Trainers - More variety
	'bugcatcherrick': {
		name: 'Bug Catcher Rick',
		money: 120,
		party: [
			{ species: 'weedle', level: 6 },
			{ species: 'caterpie', level: 6 },
		],
		dialogue: {
			start: "I love Bug Pokémon! Want to see my collection?",
			win: "My bugs need more training...",
			lose: "Bug types are the best!",
		},
	},
	'picnickerliz': {
		name: 'Picnicker Liz',
		money: 320,
		party: [
			{ species: 'nidoranf', level: 14 },
			{ species: 'nidoranm', level: 14 },
		],
		dialogue: {
			start: "Nice day for a picnic and a battle!",
			win: "You're really strong!",
			lose: "Nothing beats a victory picnic!",
		},
	},
	'hikerdan': {
		name: 'Hiker Dan',
		money: 640,
		party: [
			{ species: 'geodude', level: 15 },
			{ species: 'machop', level: 16 },
			{ species: 'onix', level: 17 },
		],
		dialogue: {
			start: "I've been training in these mountains for years!",
			win: "You've got the strength of a mountain!",
			lose: "Rock solid victory!",
		},
	},
	'cooltrainerjake': {
		name: 'Cool Trainer Jake',
		money: 1600,
		party: [
			{ species: 'nidoking', level: 38, moves: ['earthquake', 'megahorn', 'icebeam', 'thunderbolt'] },
			{ species: 'arcanine', level: 39, moves: ['flareblitz', 'extremespeed', 'wildcharge', 'crunch'] },
			{ species: 'starmie', level: 40, moves: ['hydropump', 'psychic', 'thunderbolt', 'rapidspin'] },
		],
		dialogue: {
			start: "I'm a Cool Trainer! Are you cool enough to beat me?",
			win: "You're cooler than I thought!",
			lose: "Cool Trainers never lose!",
		},
	},
	'acetrainersarah': {
		name: 'Ace Trainer Sarah',
		money: 2800,
		party: [
			{ species: 'kangaskhan', level: 46, moves: ['return', 'earthquake', 'suckerpunch', 'fakeout'], item: 'silkscarf' },
			{ species: 'vaporeon', level: 46, moves: ['surf', 'icebeam', 'shadowball', 'acidarmor'], item: 'leftovers' },
			{ species: 'alakazam', level: 47, moves: ['psychic', 'shadowball', 'focusblast', 'calmmind'], item: 'twistedspoon' },
		],
		dialogue: {
			start: "Ace Trainers only use the best strategies! Prepare yourself!",
			win: "You've truly mastered Pokémon battling!",
			lose: "That's the mark of an Ace Trainer!",
		},
	},
	'blackbeltkoji': {
		name: 'Black Belt Koji',
		money: 1200,
		party: [
			{ species: 'machoke', level: 32 },
			{ species: 'primeape', level: 32 },
			{ species: 'hitmonlee', level: 34 },
		],
		dialogue: {
			start: "My fighting spirit burns bright! Face my martial arts!",
			win: "Your spirit was stronger...",
			lose: "The path of martial arts is superior!",
		},
	},
	'scientistted': {
		name: 'Scientist Ted',
		money: 2400,
		party: [
			{ species: 'magneton', level: 43, moves: ['thunderbolt', 'flashcannon', 'triattack', 'lightscreen'] },
			{ species: 'electrode', level: 43, moves: ['thunderbolt', 'signalbeam', 'taunt', 'explosion'] },
			{ species: 'porygon', level: 45, moves: ['triattack', 'thunderbolt', 'icebeam', 'recover'] },
		],
		dialogue: {
			start: "Science will prevail! Let me demonstrate!",
			win: "My hypothesis was incorrect...",
			lose: "Science always wins!",
		},
	},

	// Additional Route Trainers
	'camperricky': {
		name: 'Camper Ricky',
		money: 480,
		party: [
			{ species: 'nidorino', level: 20 },
			{ species: 'raticate', level: 20 },
		],
		dialogue: {
			start: "I've been camping out here for days!",
			win: "Guess I need more training...",
			lose: "Camping makes you strong!",
		},
	},
	'picnickerdiana': {
		name: 'Picnicker Diana',
		money: 440,
		party: [
			{ species: 'bulbasaur', level: 18 },
			{ species: 'oddish', level: 18 },
			{ species: 'bellsprout', level: 18 },
		],
		dialogue: {
			start: "I love Grass-type Pokémon!",
			win: "Oh no! My flowers...",
			lose: "Grass types are the best!",
		},
	},
	'swimmerjack': {
		name: 'Swimmer Jack',
		money: 560,
		party: [
			{ species: 'goldeen', level: 24 },
			{ species: 'tentacool', level: 24 },
			{ species: 'staryu', level: 26 },
		],
		dialogue: {
			start: "I train with my Water Pokémon every day!",
			win: "You made a big splash!",
			lose: "Water is the source of life!",
		},
	},
	'fisherned': {
		name: 'Fisherman Ned',
		money: 720,
		party: [
			{ species: 'magikarp', level: 15 },
			{ species: 'magikarp', level: 15 },
			{ species: 'gyarados', level: 30 },
		],
		dialogue: {
			start: "I finally evolved one of my Magikarp!",
			win: "My pride and joy...",
			lose: "See? Magikarp can be strong!",
		},
	},
	'birdkeeperrobert': {
		name: 'Bird Keeper Robert',
		money: 880,
		party: [
			{ species: 'pidgeotto', level: 28 },
			{ species: 'fearow', level: 28 },
			{ species: 'dodrio', level: 30 },
		],
		dialogue: {
			start: "My Flying-type Pokémon soar above all others!",
			win: "Grounded...",
			lose: "The sky is mine!",
		},
	},
	'twinsamymay': {
		name: 'Twins Amy & May',
		money: 640,
		party: [
			{ species: 'clefairy', level: 22 },
			{ species: 'jigglypuff', level: 22 },
		],
		dialogue: {
			start: "We battle together as one!",
			win: "We'll train harder!",
			lose: "Teamwork makes the dream work!",
		},
	},
	'gentlemanthomas': {
		name: 'Gentleman Thomas',
		money: 1800,
		party: [
			{ species: 'growlithe', level: 35 },
			{ species: 'ponyta', level: 35 },
		],
		dialogue: {
			start: "A gentleman never backs down from a challenge!",
			win: "A most splendid battle, good sir!",
			lose: "Quite right, quite right!",
		},
	},
	'beautygrace': {
		name: 'Beauty Grace',
		money: 1600,
		party: [
			{ species: 'clefairy', level: 36 },
			{ species: 'wigglytuff', level: 36 },
			{ species: 'persian', level: 38 },
		],
		dialogue: {
			start: "My beautiful Pokémon will dazzle you!",
			win: "Your Pokémon are lovely too...",
			lose: "Beauty and power combined!",
		},
	},
	'psychicjohan': {
		name: 'Psychic Johan',
		money: 1440,
		party: [
			{ species: 'abra', level: 31 },
			{ species: 'kadabra', level: 31 },
			{ species: 'drowzee', level: 33 },
		],
		dialogue: {
			start: "I foresaw this battle... but not the outcome!",
			win: "My visions were clouded...",
			lose: "The future is clear to me!",
		},
	},
	'channelerpaula': {
		name: 'Channeler Paula',
		money: 1200,
		party: [
			{ species: 'gastly', level: 32 },
			{ species: 'haunter', level: 32 },
			{ species: 'gastly', level: 32 },
		],
		dialogue: {
			start: "The spirits guide my path...",
			win: "The spirits have spoken...",
			lose: "Beware the ghostly curse!",
		},
	},
	'rockervincent': {
		name: 'Rocker Vincent',
		money: 960,
		party: [
			{ species: 'voltorb', level: 29 },
			{ species: 'electrode', level: 29 },
		],
		dialogue: {
			start: "Let's rock and roll!",
			win: "That was electrifying!",
			lose: "Feel the power of rock!",
		},
	},
	'jugglershawn': {
		name: 'Juggler Shawn',
		money: 1360,
		party: [
			{ species: 'voltorb', level: 31 },
			{ species: 'voltorb', level: 31 },
			{ species: 'electrode', level: 33 },
			{ species: 'mr.mime', level: 33 },
		],
		dialogue: {
			start: "Watch carefully! Don't blink!",
			win: "I dropped the ball...",
			lose: "The hand is quicker than the eye!",
		},
	},
	'engineerbernie': {
		name: 'Engineer Bernie',
		money: 1920,
		party: [
			{ species: 'magnemite', level: 42 },
			{ species: 'magnemite', level: 42 },
			{ species: 'magneton', level: 44 },
		],
		dialogue: {
			start: "My Electric Pokémon are well-engineered!",
			win: "System overload!",
			lose: "Perfect engineering!",
		},
	},
	'burglarsimon': {
		name: 'Burglar Simon',
		money: 2160,
		party: [
			{ species: 'growlithe', level: 44 },
			{ species: 'vulpix', level: 44 },
			{ species: 'ninetales', level: 46 },
		],
		dialogue: {
			start: "I'll steal this victory!",
			win: "Caught red-handed!",
			lose: "Clean getaway!",
		},
	},
	'firebreatherray': {
		name: 'Firebreather Ray',
		money: 1280,
		party: [
			{ species: 'magmar', level: 36 },
			{ species: 'flareon', level: 36 },
		],
		dialogue: {
			start: "Feel the heat of my flames!",
			win: "Extinguished...",
			lose: "I'm on fire!",
		},
	},
	'pokemaniacmark': {
		name: 'Pokémaniac Mark',
		money: 2000,
		party: [
			{ species: 'rhyhorn', level: 38 },
			{ species: 'rhydon', level: 38 },
			{ species: 'nidoking', level: 40 },
		],
		dialogue: {
			start: "I'm obsessed with powerful Pokémon!",
			win: "I need to catch more!",
			lose: "My collection is unbeatable!",
		},
	},
	'supernerdglenn': {
		name: 'Super Nerd Glenn',
		money: 1080,
		party: [
			{ species: 'grimer', level: 28 },
			{ species: 'muk', level: 28 },
			{ species: 'koffing', level: 30 },
		],
		dialogue: {
			start: "My studies have prepared me for this!",
			win: "Back to the books...",
			lose: "Knowledge is power!",
		},
	},
	'gamblerrich': {
		name: 'Gambler Rich',
		money: 2800,
		party: [
			{ species: 'farfetchd', level: 46 },
			{ species: 'mr.mime', level: 46 },
		],
		dialogue: {
			start: "Let's make this interesting!",
			win: "I bet on the wrong Pokémon...",
			lose: "The house always wins!",
		},
	},
	'sailorduncan': {
		name: 'Sailor Duncan',
		money: 920,
		party: [
			{ species: 'machop', level: 27 },
			{ species: 'machoke', level: 27 },
			{ species: 'poliwrath', level: 29 },
		],
		dialogue: {
			start: "Ahoy! Ready for a sea battle?",
			win: "Anchors aweigh...",
			lose: "Smooth sailing!",
		},
	},
	'aromaladynikki': {
		name: 'Aroma Lady Nikki',
		money: 1440,
		party: [
			{ species: 'roselia', level: 36 },
			{ species: 'bellossom', level: 36 },
		],
		dialogue: {
			start: "My Pokémon smell wonderful!",
			win: "The sweet scent of defeat...",
			lose: "A bouquet of victory!",
		},
	},
	'ruinmaniacdusty': {
		name: 'Ruin Maniac Dusty',
		money: 1920,
		party: [
			{ species: 'geodude', level: 44 },
			{ species: 'graveler', level: 44 },
			{ species: 'sandslash', level: 46 },
		],
		dialogue: {
			start: "I explore ancient ruins and train!",
			win: "Another ruin to explore...",
			lose: "History repeats itself!",
		},
	},
	'dragontamernicolas': {
		name: 'Dragon Tamer Nicolas',
		money: 2160,
		party: [
			{ species: 'dratini', level: 42 },
			{ species: 'dragonair', level: 42 },
			{ species: 'seadra', level: 44 },
		],
		dialogue: {
			start: "Dragons are the ultimate Pokémon!",
			win: "Even dragons can fall...",
			lose: "Feel the dragon's fury!",
		},
	},
	'cooltrainermary': {
		name: 'Cool Trainer Mary',
		money: 2400,
		party: [
			{ species: 'persian', level: 48 },
			{ species: 'dewgong', level: 48 },
			{ species: 'ninetales', level: 48 },
		],
		dialogue: {
			start: "Only the coolest trainers make it this far!",
			win: "You're cooler than I thought!",
			lose: "Stay cool!",
		},
	},
	'cooltrainersamuel': {
		name: 'Cool Trainer Samuel',
		money: 2400,
		party: [
			{ species: 'sandslash', level: 47 },
			{ species: 'cloyster', level: 47 },
			{ species: 'electrode', level: 49 },
		],
		dialogue: {
			start: "I'm one of the best trainers around!",
			win: "You're even better!",
			lose: "That's how Cool Trainers do it!",
		},
	},
	'youngsterben': {
		name: 'Youngster Ben',
		money: 280,
		party: [
			{ species: 'ekans', level: 11 },
			{ species: 'sandshrew', level: 11 },
		],
		dialogue: {
			start: "I'm gonna be the best trainer!",
			win: "I have a lot to learn...",
			lose: "I'm getting stronger!",
		},
	},
	'lassrobin': {
		name: 'Lass Robin',
		money: 320,
		party: [
			{ species: 'jigglypuff', level: 14 },
			{ species: 'meowth', level: 14 },
		],
		dialogue: {
			start: "My cute Pokémon are tough!",
			win: "They're still cute though!",
			lose: "Cute and strong!",
		},
	},
	'hikerclark': {
		name: 'Hiker Clark',
		money: 800,
		party: [
			{ species: 'geodude', level: 22 },
			{ species: 'geodude', level: 22 },
			{ species: 'graveler', level: 24 },
		],
		dialogue: {
			start: "I hike these mountains every day!",
			win: "Time for a break...",
			lose: "Nothing beats mountain training!",
		},
	},
	'picnickerkelsey': {
		name: 'Picnicker Kelsey',
		money: 520,
		party: [
			{ species: 'nidoranf', level: 21 },
			{ species: 'pidgeotto', level: 21 },
		],
		dialogue: {
			start: "Let's have a fun picnic battle!",
			win: "That was still fun!",
			lose: "Perfect picnic!",
		},
	},
};

// Trainer locations - maps trainers to locations where they can be challenged
export const TRAINER_LOCATIONS: Record<string, string[]> = {
	'route1': ['youngsterjoey', 'lassalice', 'bugcatcherrick', 'youngsterben', 'lassrobin', 'camperricky'],
	'route2': ['picnickerliz', 'hikerdan', 'hikerclark', 'picnickerkelsey', 'picnickerdiana'],
	'route3': ['blackbeltkoji', 'swimmerjack', 'fisherned', 'birdkeeperrobert', 'twinsamymay'],
	'route4': ['cooltrainerjake', 'gentlemanthomas', 'beautygrace', 'psychicjohan'],
	'route5': ['acetrainersarah', 'channelerpaula', 'rockervincent', 'jugglershawn'],
	'route6': ['scientistted', 'engineerbernie', 'burglarsimon', 'firebreatherray'],
	'route7': ['pokemaniacmark', 'supernerdglenn', 'gamblerrich', 'sailorduncan'],
	'victoryroad': ['aromaladynikki', 'ruinmaniacdusty', 'dragontamernicolas', 'cooltrainermary', 'cooltrainersamuel'],
	'pokemonleague': ['elitelorelei', 'elitebruno', 'eliteagatha', 'elitelance', 'championblue'],
};

// Story events - triggered at specific points in the game
export interface StoryEvent {
	id: string;
	name: string;
	description: string;
	trigger: 'location_enter' | 'trainer_defeat' | 'badge_obtain' | 'manual';
	location?: string;
	trainerId?: string;
	badgeName?: string;
	flagsRequired?: string[];
	flagsSet?: string[];
	dialogue?: string;
}

export const STORY_EVENTS: Record<string, StoryEvent> = {
	'welcome': {
		id: 'welcome',
		name: 'Welcome to the World',
		description: 'Your journey begins',
		trigger: 'manual',
		flagsSet: ['game_started'],
		dialogue: 'Welcome to the world of Pokémon! Your adventure is about to begin!',
	},
	'first_badge': {
		id: 'first_badge',
		name: 'First Badge Earned',
		description: 'You earned your first gym badge',
		trigger: 'badge_obtain',
		badgeName: 'Boulder Badge',
		flagsSet: ['first_badge_earned'],
		dialogue: 'Congratulations on earning your first badge! The road ahead will be challenging, but I believe in you!',
	},
	'halfway_badges': {
		id: 'halfway_badges',
		name: 'Four Badges',
		description: 'You have earned four badges',
		trigger: 'manual',
		flagsRequired: [],
		flagsSet: ['halfway_badges'],
		dialogue: "You're halfway to the Pokémon League! Keep training and you'll make it!",
	},
	'all_badges': {
		id: 'all_badges',
		name: 'All Badges Obtained',
		description: 'You have earned all eight gym badges',
		trigger: 'badge_obtain',
		badgeName: 'Earth Badge',
		flagsSet: ['all_badges'],
		dialogue: 'You have all eight badges! Victory Road awaits. The Elite Four will test everything you have learned!',
	},
	'elitefourready': {
		id: 'elitefourready',
		name: 'Ready for Elite Four',
		description: 'Entered the Pokémon League',
		trigger: 'location_enter',
		location: 'pokemonleague',
		flagsRequired: ['all_badges'],
		dialogue: 'This is it! The Elite Four await. Only the strongest trainers make it past here. Are you ready?',
	},
	'championdefeated': {
		id: 'championdefeated',
		name: 'Champion Defeated',
		description: 'You defeated the Champion and became the new Champion',
		trigger: 'trainer_defeat',
		trainerId: 'championblue',
		flagsSet: ['champion', 'game_complete'],
		dialogue: "Congratulations! You are the new Pokémon League Champion! You've proven yourself as one of the greatest trainers!",
	},
};

// NPC Database with dialogue and actions
export const NPC_DATABASE: Record<string, NPCData> = {
	'professor': {
		id: 'professor',
		name: 'Professor Oak',
		location: 'startertown_lab',
		dialogue: "Welcome! I research Pokémon as a profession. Let me give you some advice: defeat all 8 gym leaders to challenge the Elite Four!",
	},
	'nursejoy_startertown': {
		id: 'nursejoy_startertown',
		name: 'Nurse Joy',
		location: 'startertown_pokecenter',
		dialogue: "Welcome to the Pokémon Center! We can heal your Pokémon to perfect health. Use /rpg heal anytime!",
	},
	'nursejoy_pewter': {
		id: 'nursejoy_pewter',
		name: 'Nurse Joy',
		location: 'pewtercity_pokecenter',
		dialogue: "Welcome to the Pokémon Center! Your Pokémon look tired. Would you like me to heal them?",
	},
	'nursejoy_cerulean': {
		id: 'nursejoy_cerulean',
		name: 'Nurse Joy',
		location: 'ceruleancity_pokecenter',
		dialogue: "Welcome to the Pokémon Center! Remember to heal your Pokémon often. You can use /rpg heal anytime!",
	},
	'nursejoy_vermilion': {
		id: 'nursejoy_vermilion',
		name: 'Nurse Joy',
		location: 'vermilioncity_pokecenter',
		dialogue: "Welcome to the Pokémon Center! Trainers who challenge Lt. Surge need to be prepared!",
	},
	'nursejoy_celadon': {
		id: 'nursejoy_celadon',
		name: 'Nurse Joy',
		location: 'celadoncity_pokecenter',
		dialogue: "Welcome to the Pokémon Center! Celadon City is such a lovely place, isn't it?",
	},
	'nursejoy_fuchsia': {
		id: 'nursejoy_fuchsia',
		name: 'Nurse Joy',
		location: 'fuchsiacity_pokecenter',
		dialogue: "Welcome to the Pokémon Center! Be careful of Poison-type moves in this city!",
	},
	'nursejoy_cinnabar': {
		id: 'nursejoy_cinnabar',
		name: 'Nurse Joy',
		location: 'cinnabarisland_pokecenter',
		dialogue: "Welcome to the Pokémon Center! The volcano here can be quite intense, just like Blaine's battles!",
	},
	'nursejoy_viridian': {
		id: 'nursejoy_viridian',
		name: 'Nurse Joy',
		location: 'viridiancity_pokecenter',
		dialogue: "Welcome to the Pokémon Center! Giovanni's Gym is very challenging. Make sure you're prepared!",
	},
	'nursejoy_league': {
		id: 'nursejoy_league',
		name: 'Nurse Joy',
		location: 'pokemonleague_pokecenter',
		dialogue: "Welcome to the Pokémon Center! This is your last chance to prepare before facing the Elite Four. Good luck!",
	},
	'aideroute1': {
		id: 'aideroute1',
		name: 'Professor\'s Aide',
		location: 'route1',
		dialogue: "Wild Pokémon live in tall grass! If you want to catch them, weaken them first, then throw a Poké Ball!",
		action: {
			type: 'giveitem',
			itemId: 'potion',
			quantity: 5,
			onceOnly: true,
		},
	},
	'oldmanpewter': {
		id: 'oldmanpewter',
		name: 'Old Man',
		location: 'pewtercity_museum',
		dialogue: "Brock, the Pewter Gym Leader, uses Rock-type Pokémon. Water and Grass moves work well against them!",
	},
	'nursecerulean': {
		id: 'nursecerulean',
		name: 'City Guide',
		location: 'ceruleancity',
		dialogue: "Welcome to Cerulean City! Make sure to visit the Pokémon Center and challenge Misty at the Gym!",
	},
	'hikerroute2': {
		id: 'hikerroute2',
		name: 'Friendly Hiker',
		location: 'route2',
		dialogue: "This route has tougher Pokémon! Make sure your team is at least level 10 before continuing. Good luck!",
		action: {
			type: 'exchangeitems',
			itemId: 'greatball',
			quantity: 3,
			requiredItem: 'pokeball',
			requiredQuantity: 10,
			onceOnly: true,
		},
	},
	'girlvermilion': {
		id: 'girlvermilion',
		name: 'Little Girl',
		location: 'vermilioncity_house1',
		dialogue: "Lt. Surge is really tough! His Electric Pokémon can paralyze yours. Ground types work great against them!",
	},
	'shopkeeperceladon': {
		id: 'shopkeeperceladon',
		name: 'Shop Keeper',
		location: 'celadoncity_department',
		dialogue: "Welcome to Celadon City! We have the biggest department store in the region. Check out /rpg shop for great deals!",
	},
	'trainerfuchsia': {
		id: 'trainerfuchsia',
		name: 'Expert Trainer',
		location: 'fuchsiacity_house1',
		dialogue: "Koga specializes in Poison types. They can badly poison your Pokémon! Psychic and Ground moves work well here.",
		action: {
			type: 'givepokemon',
			pokemon: {
				species: 'eevee',
				level: 25,
			},
			onceOnly: true,
		},
	},
	'scientistcinnabar': {
		id: 'scientistcinnabar',
		name: 'Lab Scientist',
		location: 'cinnabarisland_lab',
		dialogue: "Blaine's Fire types are no joke! Water, Rock, and Ground moves are super effective. Prepare well!",
	},
	'guardviridian': {
		id: 'guardviridian',
		name: 'City Guard',
		location: 'viridiancity_house1',
		dialogue: "Giovanni, the Viridian Gym Leader, is incredibly strong! His Ground types are tough. Use Water, Grass, or Ice types!",
	},
	'veteranvictoryroad': {
		id: 'veteranvictoryroad',
		name: 'Veteran Hiker',
		location: 'victoryroad',
		dialogue: "Only trainers with all 8 badges can enter here. The Pokémon are level 48+. Make sure you're prepared!",
		flags: ['all_badges'],
	},
	'championguide': {
		id: 'championguide',
		name: 'Elite Four Guide',
		location: 'pokemonleague',
		dialogue: "You've made it to the Pokémon League! The Elite Four specialize in Ice, Fighting, Ghost/Poison, and Dragon types. The Champion uses a balanced team. Good luck!",
		flags: ['all_badges'],
	},
	'congratulations': {
		id: 'congratulations',
		name: 'Champion\'s Aide',
		location: 'pokemonleague',
		dialogue: "Congratulations, Champion! You've completed your journey. You can explore, catch more Pokémon, or challenge trainers again!",
		flags: ['champion'],
	},
	'itemcollector': {
		id: 'itemcollector',
		name: 'Item Collector',
		location: 'startertown_house1',
		dialogue: "I collect rare berries! If you bring me 5 Oran Berries, I'll give you a Sitrus Berry!",
		action: {
			type: 'exchangeitems',
			itemId: 'sitrusberry',
			quantity: 1,
			requiredItem: 'oranberry',
			requiredQuantity: 5,
		},
	},
	'mysteryman': {
		id: 'mysteryman',
		name: 'Mysterious Man',
		location: 'celadoncity_gamecorner',
		dialogue: "I need rare candies for my research! Bring me 3 Rare Candies and I'll give you something special.",
		action: {
			type: 'takeitem',
			itemId: 'rarecandy',
			quantity: 3,
			onceOnly: true,
		},
	},
};
