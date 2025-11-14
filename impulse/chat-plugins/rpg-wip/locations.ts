/*
* Pokemon Showdown
* RPG Locations Data
*
* This file contains location definitions and their encounter zones.
* 
* Locations can include scriptedEvents that trigger when players enter or meet conditions.
* All scripted event handlers are available in scripted-events.ts
*
* Supported Event Types (see scripted-events.ts for full list of 60+ handlers):
*   - dialogue: Simple dialogue message
*   - item: Give items to player
*   - pokemon: Give Pokemon to player
*   - wildbattle: Scripted wild Pokemon encounter
*   - trainer: Scripted trainer battle
*   - cutscene: Cinematic cutscene
*   - choice: Player makes a choice
*   - quiz: Quiz question
*   - puzzle: Puzzle to solve
*   - pokemonswarm: Pokemon swarm appears
*   - bossbattle: Multi-phase boss battle
*   - tournament: Tournament event
*   - weatherchange: Change weather
*   - legendaryawakening: Legendary Pokemon awakens
*   - And 40+ more event types...
*
* Event Configuration Options:
*   - triggerOnce: Event only triggers once (default: false)
*   - requiredFlag: Player must have this flag
*   - requiredBadgeCount: Minimum badges required
*   - maxBadgeCount: Maximum badges allowed (for early-game events)
*   - preventIfFlag: Skip if player has this flag
*   - setFlag: Set this flag when event triggers
*
* Example:
*   scriptedEvents: [
*     {
*       id: 'unique_event_id',
*       name: 'Event Name',
*       triggerOnce: true,
*       type: 'wildbattle',
*       pokemon: { species: 'pikachu', level: 25, shiny: true },
*       dialogue: 'A wild shiny Pikachu appears!',
*     }
*   ]
*/

import type { Location } from './interface';

export const LOCATIONS: Record<string, Location> = {
	'startertown': {
		id: 'startertown',
		name: 'Starter Town',
		type: 'town',
		weather: 'sun',
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
				npcs: ['nursejoystartertown'],
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
				maxBadgeCount: 0, // Only triggers before getting first badge
				type: 'dialogue',
				dialogue: 'This is your first route! Wild Pokémon hide in the tall grass. Be careful and catch some new friends!',
			},
			{
				id: 'route1_return_with_badge',
				name: 'Rival Returns',
				triggerOnce: true,
				requiredBadgeCount: 1, // Only triggers when player has at least 1 badge
				type: 'trainer',
				trainerId: 'rival1',
				dialogue: 'Hey! I heard you beat Brock! Let\'s see if you\'ve really gotten stronger!',
				setFlag: 'route1_rival_defeated',
			},
			{
				id: 'route1_gift_after_rival',
				name: 'Helpful Trainer',
				triggerOnce: true,
				requiredFlag: 'route1_rival_defeated',
				type: 'item',
				itemId: 'superpotion',
				itemQuantity: 2,
				dialogue: 'I saw your battle! You\'re getting really strong. Here, take these Super Potions!',
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
				npcs: ['nursejoypewter'],
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
			{
				// Example of a REPEATABLE event (no triggerOnce)
				// This will happen every time the player enters Route 2
				id: 'route2_warning',
				name: 'Cave Warning',
				type: 'dialogue',
				dialogue: 'Be careful in the cave! Rock and Ground-type Pokemon are common here.',
				// Note: No triggerOnce property means this repeats every visit
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
				npcs: ['nursejoycerulean'],
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
		scriptedEvents: [
			{
				id: 'red_gyarados',
				name: 'Strange Pokemon',
				triggerOnce: true,
				requiredBadgeCount: 2, // After defeating Misty
				type: 'wildbattle',
				pokemon: {
					species: 'gyarados',
					level: 30,
					moves: ['waterfall', 'bite', 'icefang', 'dragondance'],
					shiny: true, // Guaranteed shiny!
				},
				dialogue: 'A strange red Gyarados appears in the water! It seems unusually aggressive!',
				setFlag: 'red_gyarados_encountered',
			},
		],
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
				npcs: ['nursejoyvermilion'],
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
				npcs: ['nursejoyceladon'],
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
				npcs: ['nursejoyfuchsia'],
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
				npcs: ['nursejoycinnabar'],
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
		scriptedEvents: [
			{
				id: 'snorlax_encounter',
				name: 'Sleeping Snorlax',
				triggerOnce: true,
				requiredBadgeCount: 7, // Late game encounter
				type: 'wildbattle',
				pokemon: {
					species: 'snorlax',
					level: 45,
					moves: ['bodyslam', 'rest', 'snore', 'amnesia'],
				},
				dialogue: 'A huge Snorlax is blocking the path! You\'ll need to battle it to pass!',
				setFlag: 'snorlax_defeated',
			},
		],
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
				npcs: ['nursejoyviridian'],
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
		scriptedEvents: [
			{
				id: 'moltres_encounter',
				name: 'Legendary Bird',
				triggerOnce: true,
				requiredBadgeCount: 8, // Post-game legendary
				type: 'wildbattle',
				pokemon: {
					species: 'moltres',
					level: 50,
					moves: ['fireblast', 'airslash', 'heatwave', 'roost'],
				},
				dialogue: 'A legendary bird Pokemon appears from the flames! It\'s Moltres!',
				setFlag: 'moltres_encountered',
			},
		],
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
				npcs: ['nursejoyleague'],
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
		pokemon: ['magikarp', 'feebas', 'palafin'],
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

/**
 * Get the starting location for new players.
 * Returns the first location from LOCATIONS object.
 */
export function getStartingLocation(): { id: string, name: string } {
	const firstLocationId = Object.keys(LOCATIONS)[0];
	const firstLocation = LOCATIONS[firstLocationId];
	return {
		id: firstLocationId,
		name: firstLocation.name,
	};
}
