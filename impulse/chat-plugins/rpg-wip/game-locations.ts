/**
 * Game Locations Configuration - Complete Kanto to Paldea Journey
 *
 * This file contains the complete Pokemon RPG story spanning 9 regions.
 * Features level caps based on badges to prevent over-leveling.
 * 
 * Level Progression:
 * - Kanto (Badges 0-8): Levels 5-55
 * - Johto (Badges 9-16): Levels 55-75  
 * - Hoenn (Badges 17-24): Levels 70-85
 * - Sinnoh (Badges 25-32): Levels 80-92
 * - Unova (Badges 33-40): Levels 88-97
 * - Kalos (Badges 41-48): Levels 94-99
 * - Alola (Badges 49-56): Levels 98-100
 * - Galar (Badges 57-64): Levels 100
 * - Paldea (Badges 65-72): Levels 100
 */

// ============================================================================
// LEVEL CAPS (Prevents Over-leveling)
// ============================================================================

export const LEVEL_CAPS: Record<number, number> = {
	// Kanto badges (0-8)
	0: 15, 1: 20, 2: 25, 3: 30, 4: 35, 5: 40, 6: 45, 7: 50, 8: 55,
	// Johto badges (9-16)
	9: 58, 10: 61, 11: 64, 12: 66, 13: 68, 14: 70, 15: 72, 16: 75,
	// Hoenn badges (17-24)
	17: 77, 18: 79, 19: 81, 20: 83, 21: 84, 22: 85, 23: 86, 24: 88,
	// Sinnoh badges (25-32)
	25: 89, 26: 90, 27: 91, 28: 92, 29: 93, 30: 94, 31: 95, 32: 96,
	// Unova badges (33-40)
	33: 96, 34: 97, 35: 97, 36: 98, 37: 98, 38: 99, 39: 99, 40: 100,
	// Kalos badges (41-48)
	41: 100, 42: 100, 43: 100, 44: 100, 45: 100, 46: 100, 47: 100, 48: 100,
	// Alola trials (49-56)
	49: 100, 50: 100, 51: 100, 52: 100, 53: 100, 54: 100, 55: 100, 56: 100,
	// Galar badges (57-64)
	57: 100, 58: 100, 59: 100, 60: 100, 61: 100, 62: 100, 63: 100, 64: 100,
	// Paldea badges (65-72)
	65: 100, 66: 100, 67: 100, 68: 100, 69: 100, 70: 100, 71: 100, 72: 100,
};

// ============================================================================
// LOCATIONS
// ============================================================================

export const LOCATIONS: Record<string, any> = {
	// ========================================================================
	// KANTO REGION - Where the journey begins!
	// ========================================================================
	pallettown: {
		id: 'pallettown',
		name: 'Pallet Town',
		type: 'town',
		region: 'kanto',
		description: 'A quiet town where dreams and adventures begin. Professor Oak awaits you!',
		connectedLocations: [{ id: 'route1', name: 'Route 1' }],
		buildings: [
			{ id: 'oakslab', name: "Prof. Oak's Lab", type: 'lab', accessible: true, npcs: ['professoroak'] },
			{ id: 'palletmart', name: 'Pallet Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	route1: {
		id: 'route1',
		name: 'Route 1',
		type: 'route',
		region: 'kanto',
		description: 'Your first route! Wild Pokemon appear in the tall grass.',
		connectedLocations: [{ id: 'pallettown', name: 'Pallet Town' }, { id: 'viridiancity', name: 'Viridian City' }],
		buildings: [],
		encounterZones: ['kanto_route1'],
	},
	viridiancity: {
		id: 'viridiancity',
		name: 'Viridian City',
		type: 'town',
		region: 'kanto',
		description: 'A beautiful city with a mysterious Gym. The leader is away...',
		connectedLocations: [{ id: 'route1', name: 'Route 1' }, { id: 'route2', name: 'Route 2' }, { id: 'route22', name: 'Route 22' }],
		buildings: [
			{ id: 'viridiangym', name: 'Viridian Gym', type: 'gym', accessible: false, gymLeader: 'giovanni' },
			{ id: 'viridianmart', name: 'Viridian Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	route2: {
		id: 'route2',
		name: 'Route 2',
		type: 'route',
		region: 'kanto',
		description: 'A forested path leading to Viridian Forest.',
		connectedLocations: [{ id: 'viridiancity', name: 'Viridian City' }, { id: 'viridianforest', name: 'Viridian Forest' }, { id: 'pewtercity', name: 'Pewter City' }],
		buildings: [],
		encounterZones: ['kanto_route2'],
	},
	viridianforest: {
		id: 'viridianforest',
		name: 'Viridian Forest',
		type: 'forest',
		region: 'kanto',
		description: 'A dark forest full of Bug Pokemon and trainers!',
		connectedLocations: [{ id: 'route2', name: 'Route 2' }],
		buildings: [],
		encounterZones: ['kanto_viridianforest'],
	},
	pewtercity: {
		id: 'pewtercity',
		name: 'Pewter City',
		type: 'town',
		region: 'kanto',
		description: 'A rugged city known for Rock Pokemon. Brock awaits challengers!',
		connectedLocations: [{ id: 'route2', name: 'Route 2' }, { id: 'route3', name: 'Route 3' }],
		buildings: [
			{ id: 'pewtergym', name: 'Pewter Gym', type: 'gym', accessible: true, gymLeader: 'brock' },
			{ id: 'pewtermart', name: 'Pewter Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	route3: {
		id: 'route3',
		name: 'Route 3',
		type: 'route',
		region: 'kanto',
		description: 'A rocky mountain path. Mt. Moon awaits!',
		connectedLocations: [{ id: 'pewtercity', name: 'Pewter City' }, { id: 'mtmoon', name: 'Mt. Moon' }],
		buildings: [],
		encounterZones: ['kanto_route3'],
	},
	mtmoon: {
		id: 'mtmoon',
		name: 'Mt. Moon',
		type: 'cave',
		region: 'kanto',
		description: 'A mysterious cave filled with fossils and Team Rocket!',
		connectedLocations: [{ id: 'route3', name: 'Route 3' }, { id: 'route4', name: 'Route 4' }],
		buildings: [],
		encounterZones: ['kanto_mtmoon'],
	},
	route4: {
		id: 'route4',
		name: 'Route 4',
		type: 'route',
		region: 'kanto',
		description: 'A winding path descending from Mt. Moon.',
		connectedLocations: [{ id: 'mtmoon', name: 'Mt. Moon' }, { id: 'ceruleancity', name: 'Cerulean City' }],
		buildings: [],
		encounterZones: ['kanto_route4'],
	},
	ceruleancity: {
		id: 'ceruleancity',
		name: 'Cerulean City',
		type: 'town',
		region: 'kanto',
		description: 'A water-themed city. Misty guards the Cascade Badge!',
		connectedLocations: [{ id: 'route4', name: 'Route 4' }, { id: 'route24', name: 'Route 24' }, { id: 'route5', name: 'Route 5' }],
		buildings: [
			{ id: 'ceruleangym', name: 'Cerulean Gym', type: 'gym', accessible: true, gymLeader: 'misty' },
			{ id: 'ceruleanmart', name: 'Cerulean Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	route24: {
		id: 'route24',
		name: 'Route 24 (Nugget Bridge)',
		type: 'route',
		region: 'kanto',
		description: 'Famous Nugget Bridge with five trainers!',
		connectedLocations: [{ id: 'ceruleancity', name: 'Cerulean City' }, { id: 'route25', name: 'Route 25' }],
		buildings: [],
		encounterZones: ['kanto_route24'],
	},
	route25: {
		id: 'route25',
		name: 'Route 25',
		type: 'route',
		region: 'kanto',
		description: "A scenic path to Bill's cottage.",
		connectedLocations: [{ id: 'route24', name: 'Route 24' }],
		buildings: [{ id: 'billshouse', name: "Bill's House", type: 'house', accessible: true, npcs: ['bill'] }],
		encounterZones: ['kanto_route25'],
	},
	route5: {
		id: 'route5',
		name: 'Route 5',
		type: 'route',
		region: 'kanto',
		description: 'Leading south toward Saffron City.',
		connectedLocations: [{ id: 'ceruleancity', name: 'Cerulean City' }, { id: 'route6', name: 'Route 6' }],
		buildings: [],
		encounterZones: ['kanto_route5'],
	},
	route6: {
		id: 'route6',
		name: 'Route 6',
		type: 'route',
		region: 'kanto',
		description: 'Connecting to Vermilion City.',
		connectedLocations: [{ id: 'route5', name: 'Route 5' }, { id: 'vermilioncity', name: 'Vermilion City' }],
		buildings: [],
		encounterZones: ['kanto_route6'],
	},
	vermilioncity: {
		id: 'vermilioncity',
		name: 'Vermilion City',
		type: 'town',
		region: 'kanto',
		description: 'A bustling port. Lt. Surge commands the Electric Gym!',
		connectedLocations: [{ id: 'route6', name: 'Route 6' }, { id: 'route11', name: 'Route 11' }],
		buildings: [
			{ id: 'vermiliongym', name: 'Vermilion Gym', type: 'gym', accessible: true, gymLeader: 'surge' },
			{ id: 'vermilionmart', name: 'Vermilion Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	route11: {
		id: 'route11',
		name: 'Route 11',
		type: 'route',
		region: 'kanto',
		description: 'Eastern route with Diglett Cave entrance.',
		connectedLocations: [{ id: 'vermilioncity', name: 'Vermilion City' }, { id: 'diglettscave', name: "Diglett's Cave" }],
		buildings: [],
		encounterZones: ['kanto_route11'],
	},
	diglettscave: {
		id: 'diglettscave',
		name: "Diglett's Cave",
		type: 'cave',
		region: 'kanto',
		description: 'A tunnel full of Diglett and Dugtrio!',
		connectedLocations: [{ id: 'route11', name: 'Route 11' }, { id: 'route2', name: 'Route 2' }],
		buildings: [],
		encounterZones: ['kanto_diglettscave'],
	},
	celadoncity: {
		id: 'celadoncity',
		name: 'Celadon City',
		type: 'town',
		region: 'kanto',
		description: 'The largest city in Kanto! Erika trains Grass Pokemon.',
		connectedLocations: [{ id: 'route7', name: 'Route 7' }, { id: 'route16', name: 'Route 16' }],
		buildings: [
			{ id: 'celadongym', name: 'Celadon Gym', type: 'gym', accessible: true, gymLeader: 'erika' },
			{ id: 'celadonmart', name: 'Celadon Dept Store', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	route7: {
		id: 'route7',
		name: 'Route 7',
		type: 'route',
		region: 'kanto',
		description: 'Connecting Celadon to Saffron City.',
		connectedLocations: [{ id: 'celadoncity', name: 'Celadon City' }, { id: 'saffroncity', name: 'Saffron City' }],
		buildings: [],
		encounterZones: ['kanto_route7'],
	},
	saffroncity: {
		id: 'saffroncity',
		name: 'Saffron City',
		type: 'town',
		region: 'kanto',
		description: 'Central metropolis. Sabrina awaits in the Psychic Gym!',
		connectedLocations: [{ id: 'route5', name: 'Route 5' }, { id: 'route6', name: 'Route 6' }, { id: 'route7', name: 'Route 7' }],
		buildings: [
			{ id: 'saffrong ym', name: 'Saffron Gym', type: 'gym', accessible: true, gymLeader: 'sabrina' },
			{ id: 'saffronmart', name: 'Saffron Mart', type: 'pokemart', accessible: true },
			{ id: 'silphco', name: 'Silph Co.', type: 'building', accessible: true },
		],
		encounterZones: [],
	},
	route16: {
		id: 'route16',
		name: 'Route 16 (Cycling Road)',
		type: 'route',
		region: 'kanto',
		description: 'A thrilling downhill bike ride!',
		connectedLocations: [{ id: 'celadoncity', name: 'Celadon City' }, { id: 'fuchsiacity', name: 'Fuchsia City' }],
		buildings: [],
		encounterZones: ['kanto_route16'],
	},
	fuchsiacity: {
		id: 'fuchsiacity',
		name: 'Fuchsia City',
		type: 'town',
		region: 'kanto',
		description: 'Home to the Safari Zone and Koga, master of Poison!',
		connectedLocations: [{ id: 'route16', name: 'Route 16' }, { id: 'route19', name: 'Route 19' }],
		buildings: [
			{ id: 'fuchsiagym', name: 'Fuchsia Gym', type: 'gym', accessible: true, gymLeader: 'koga' },
			{ id: 'fuchsiamart', name: 'Fuchsia Mart', type: 'pokemart', accessible: true },
			{ id: 'safarizone', name: 'Safari Zone', type: 'special', accessible: true },
		],
		encounterZones: [],
	},
	route19: {
		id: 'route19',
		name: 'Route 19',
		type: 'route',
		region: 'kanto',
		description: 'A water route. Surf south to Cinnabar!',
		connectedLocations: [{ id: 'fuchsiacity', name: 'Fuchsia City' }, { id: 'cinnabarisland', name: 'Cinnabar Island' }],
		buildings: [],
		encounterZones: ['kanto_route19'],
	},
	cinnabarisland: {
		id: 'cinnabarisland',
		name: 'Cinnabar Island',
		type: 'town',
		region: 'kanto',
		description: 'A volcanic island. Blaine tests with fire and riddles!',
		connectedLocations: [{ id: 'route19', name: 'Route 19' }, { id: 'route22', name: 'Route 22' }],
		buildings: [
			{ id: 'cinnabargym', name: 'Cinnabar Gym', type: 'gym', accessible: true, gymLeader: 'blaine' },
			{ id: 'cinnabarmart', name: 'Cinnabar Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	route22: {
		id: 'route22',
		name: 'Route 22',
		type: 'route',
		region: 'kanto',
		description: 'Western route where your rival awaits!',
		connectedLocations: [{ id: 'viridiancity', name: 'Viridian City' }, { id: 'cinnabarisland', name: 'Cinnabar Island' }, { id: 'victoryroad', name: 'Victory Road' }],
		buildings: [],
		encounterZones: ['kanto_route22'],
	},
	victoryroad: {
		id: 'victoryroad',
		name: 'Victory Road',
		type: 'cave',
		region: 'kanto',
		description: 'A treacherous cave. Only the strongest pass!',
		connectedLocations: [{ id: 'route22', name: 'Route 22' }, { id: 'indigoplateau', name: 'Indigo Plateau' }],
		buildings: [],
		encounterZones: ['kanto_victoryroad'],
	},
	indigoplateau: {
		id: 'indigoplateau',
		name: 'Indigo Plateau',
		type: 'town',
		region: 'kanto',
		description: 'The Pokemon League! Face the Elite Four and Champion!',
		connectedLocations: [{ id: 'victoryroad', name: 'Victory Road' }, { id: 'newbarktown', name: 'New Bark Town (Johto)' }],
		buildings: [
			{ id: 'elitefour', name: 'Elite Four Chamber', type: 'special', accessible: true },
		],
		encounterZones: [],
	},

	// ========================================================================
	// JOHTO REGION - Continue your adventure!
	// ========================================================================
	newbarktown: {
		id: 'newbarktown',
		name: 'New Bark Town',
		type: 'town',
		region: 'johto',
		description: 'Welcome to Johto! Professor Elm awaits.',
		connectedLocations: [{ id: 'indigoplateau', name: 'Indigo Plateau' }, { id: 'route29', name: 'Route 29' }],
		buildings: [
			{ id: 'elmslab', name: "Prof. Elm's Lab", type: 'lab', accessible: true, npcs: ['professorelm'] },
			{ id: 'newbarkmart', name: 'New Bark Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	route29: {
		id: 'route29',
		name: 'Route 29',
		type: 'route',
		region: 'johto',
		description: 'The first Johto route!',
		connectedLocations: [{ id: 'newbarktown', name: 'New Bark Town' }, { id: 'cherrygrovecity', name: 'Cherrygrove City' }],
		buildings: [],
		encounterZones: ['johto_route29'],
	},
	cherrygrovecity: {
		id: 'cherrygrovecity',
		name: 'Cherrygrove City',
		type: 'town',
		region: 'johto',
		description: 'A small seaside city.',
		connectedLocations: [{ id: 'route29', name: 'Route 29' }, { id: 'route30', name: 'Route 30' }],
		buildings: [
			{ id: 'cherrygrovemart', name: 'Cherrygrove Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	route30: {
		id: 'route30',
		name: 'Route 30',
		type: 'route',
		region: 'johto',
		description: 'Leading north to Violet City.',
		connectedLocations: [{ id: 'cherrygrovecity', name: 'Cherrygrove City' }, { id: 'violetcity', name: 'Violet City' }],
		buildings: [],
		encounterZones: ['johto_route30'],
	},
	violetcity: {
		id: 'violetcity',
		name: 'Violet City',
		type: 'town',
		region: 'johto',
		description: 'Falkner trains Flying Pokemon here!',
		connectedLocations: [{ id: 'route30', name: 'Route 30' }, { id: 'route32', name: 'Route 32' }],
		buildings: [
			{ id: 'violetgym', name: 'Violet Gym', type: 'gym', accessible: true, gymLeader: 'falkner' },
			{ id: 'violetmart', name: 'Violet Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	route32: {
		id: 'route32',
		name: 'Route 32',
		type: 'route',
		region: 'johto',
		description: 'A long route to Azalea Town.',
		connectedLocations: [{ id: 'violetcity', name: 'Violet City' }, { id: 'azaleatown', name: 'Azalea Town' }],
		buildings: [],
		encounterZones: ['johto_route32'],
	},
	azaleatown: {
		id: 'azaleatown',
		name: 'Azalea Town',
		type: 'town',
		region: 'johto',
		description: 'Famous for Slowpoke Well. Bugsy awaits!',
		connectedLocations: [{ id: 'route32', name: 'Route 32' }, { id: 'route34', name: 'Route 34' }],
		buildings: [
			{ id: 'azaleagym', name: 'Azalea Gym', type: 'gym', accessible: true, gymLeader: 'bugsy' },
			{ id: 'azaleamart', name: 'Azalea Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	route34: {
		id: 'route34',
		name: 'Route 34',
		type: 'route',
		region: 'johto',
		description: 'Path to Goldenrod City.',
		connectedLocations: [{ id: 'azaleatown', name: 'Azalea Town' }, { id: 'goldenrodcity', name: 'Goldenrod City' }],
		buildings: [],
		encounterZones: ['johto_route34'],
	},
	goldenrodcity: {
		id: 'goldenrodcity',
		name: 'Goldenrod City',
		type: 'town',
		region: 'johto',
		description: 'Largest city in Johto! Whitney trains Normal types.',
		connectedLocations: [{ id: 'route34', name: 'Route 34' }, { id: 'route35', name: 'Route 35' }],
		buildings: [
			{ id: 'goldenrodgym', name: 'Goldenrod Gym', type: 'gym', accessible: true, gymLeader: 'whitney' },
			{ id: 'goldenrodmart', name: 'Goldenrod Dept Store', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	route35: {
		id: 'route35',
		name: 'Route 35',
		type: 'route',
		region: 'johto',
		description: 'North to Ecruteak City.',
		connectedLocations: [{ id: 'goldenrodcity', name: 'Goldenrod City' }, { id: 'ecruteakcity', name: 'Ecruteak City' }],
		buildings: [],
		encounterZones: ['johto_route35'],
	},
	ecruteakcity: {
		id: 'ecruteakcity',
		name: 'Ecruteak City',
		type: 'town',
		region: 'johto',
		description: 'Traditional city with Burned Tower. Morty guards Ghost Gym!',
		connectedLocations: [{ id: 'route35', name: 'Route 35' }, { id: 'route38', name: 'Route 38' }],
		buildings: [
			{ id: 'ecruteakgym', name: 'Ecruteak Gym', type: 'gym', accessible: true, gymLeader: 'morty' },
			{ id: 'ecruteakmart', name: 'Ecruteak Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	route38: {
		id: 'route38',
		name: 'Route 38',
		type: 'route',
		region: 'johto',
		description: 'West to Olivine City.',
		connectedLocations: [{ id: 'ecruteakcity', name: 'Ecruteak City' }, { id: 'olivinecity', name: 'Olivine City' }],
		buildings: [],
		encounterZones: ['johto_route38'],
	},
	olivinecity: {
		id: 'olivinecity',
		name: 'Olivine City',
		type: 'town',
		region: 'johto',
		description: 'Port city with a lighthouse. Jasmine trains Steel types!',
		connectedLocations: [{ id: 'route38', name: 'Route 38' }, { id: 'route40', name: 'Route 40' }],
		buildings: [
			{ id: 'olivinegym', name: 'Olivine Gym', type: 'gym', accessible: true, gymLeader: 'jasmine' },
			{ id: 'olivinemart', name: 'Olivine Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	route40: {
		id: 'route40',
		name: 'Route 40',
		type: 'route',
		region: 'johto',
		description: 'Water route to Cianwood.',
		connectedLocations: [{ id: 'olivinecity', name: 'Olivine City' }, { id: 'cianwoodcity', name: 'Cianwood City' }],
		buildings: [],
		encounterZones: ['johto_route40'],
	},
	cianwoodcity: {
		id: 'cianwoodcity',
		name: 'Cianwood City',
		type: 'town',
		region: 'johto',
		description: 'Remote city. Chuck trains Fighting Pokemon!',
		connectedLocations: [{ id: 'route40', name: 'Route 40' }, { id: 'mahoganytown', name: 'Mahogany Town' }],
		buildings: [
			{ id: 'cianwoodgym', name: 'Cianwood Gym', type: 'gym', accessible: true, gymLeader: 'chuck' },
			{ id: 'cianwoodmart', name: 'Cianwood Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	mahoganytown: {
		id: 'mahoganytown',
		name: 'Mahogany Town',
		type: 'town',
		region: 'johto',
		description: 'Ninja-themed town. Pryce masters Ice Pokemon!',
		connectedLocations: [{ id: 'cianwoodcity', name: 'Cianwood City' }, { id: 'blackthorncity', name: 'Blackthorn City' }],
		buildings: [
			{ id: 'mahoganygym', name: 'Mahogany Gym', type: 'gym', accessible: true, gymLeader: 'pryce' },
			{ id: 'mahoganymart', name: 'Mahogany Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	blackthorncity: {
		id: 'blackthorncity',
		name: 'Blackthorn City',
		type: 'town',
		region: 'johto',
		description: 'Dragon Clan city. Clair guards the final Johto badge!',
		connectedLocations: [{ id: 'mahoganytown', name: 'Mahogany Town' }, { id: 'johtoleague', name: 'Johto Pokemon League' }],
		buildings: [
			{ id: 'blackthorngym', name: 'Blackthorn Gym', type: 'gym', accessible: true, gymLeader: 'clair' },
			{ id: 'blackthornmart', name: 'Blackthorn Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	johtoleague: {
		id: 'johtoleague',
		name: 'Johto Pokemon League',
		type: 'special',
		region: 'johto',
		description: 'Face Johto Elite Four and Champion Lance!',
		connectedLocations: [{ id: 'blackthorncity', name: 'Blackthorn City' }, { id: 'littleroottown', name: 'Littleroot Town (Hoenn)' }],
		buildings: [
			{ id: 'johtoelite4', name: 'Elite Four Chamber', type: 'special', accessible: true },
		],
		encounterZones: [],
	},

	// ========================================================================
	// HOENN REGION - Continuing the adventure!
	// ========================================================================
	littleroottown: {
		id: 'littleroottown',
		name: 'Littleroot Town',
		type: 'town',
		region: 'hoenn',
		description: 'Welcome to Hoenn! Professor Birch studies Pokemon here.',
		connectedLocations: [{ id: 'johtoleague', name: 'Johto League' }, { id: 'route101', name: 'Route 101' }],
		buildings: [{ id: 'birchlab', name: "Prof. Birch's Lab", type: 'lab', accessible: true }],
		encounterZones: [],
	},
	route101: {
		id: 'route101',
		name: 'Route 101',
		type: 'route',
		region: 'hoenn',
		description: 'First Hoenn route.',
		connectedLocations: [{ id: 'littleroottown', name: 'Littleroot Town' }, { id: 'rustborocity', name: 'Rustboro City' }],
		buildings: [],
		encounterZones: ['hoenn_route101'],
	},
	rustborocity: {
		id: 'rustborocity',
		name: 'Rustboro City',
		type: 'town',
		region: 'hoenn',
		description: 'Roxanne trains Rock Pokemon!',
		connectedLocations: [{ id: 'route101', name: 'Route 101' }, { id: 'dewfordtown', name: 'Dewford Town' }],
		buildings: [
			{ id: 'rustborogym', name: 'Rustboro Gym', type: 'gym', accessible: true, gymLeader: 'roxanne' },
			{ id: 'rustboromart', name: 'Rustboro Mart', type: 'pokemart', accessible: true },
		],
		encounterZones: [],
	},
	dewfordtown: {
		id: 'dewfordtown',
		name: 'Dewford Town',
		type: 'town',
		region: 'hoenn',
		description: 'Brawly masters Fighting types!',
		connectedLocations: [{ id: 'rustborocity', name: 'Rustboro City' }, { id: 'mauvillecity', name: 'Mauville City' }],
		buildings: [
			{ id: 'dewfordgym', name: 'Dewford Gym', type: 'gym', accessible: true, gymLeader: 'brawly' },
		],
		encounterZones: [],
	},
	mauvillecity: {
		id: 'mauvillecity',
		name: 'Mauville City',
		type: 'town',
		region: 'hoenn',
		description: 'Wattson electrifies challengers!',
		connectedLocations: [{ id: 'dewfordtown', name: 'Dewford Town' }, { id: 'lavaridgetown', name: 'Lavaridge Town' }],
		buildings: [
			{ id: 'mauvillegym', name: 'Mauville Gym', type: 'gym', accessible: true, gymLeader: 'wattson' },
		],
		encounterZones: [],
	},
	lavaridgetown: {
		id: 'lavaridgetown',
		name: 'Lavaridge Town',
		type: 'town',
		region: 'hoenn',
		description: 'Flannery burns with passion!',
		connectedLocations: [{ id: 'mauvillecity', name: 'Mauville City' }, { id: 'petalburgcity', name: 'Petalburg City' }],
		buildings: [
			{ id: 'lavaridgegym', name: 'Lavaridge Gym', type: 'gym', accessible: true, gymLeader: 'flannery' },
		],
		encounterZones: [],
	},
	petalburgcity: {
		id: 'petalburgcity',
		name: 'Petalburg City',
		type: 'town',
		region: 'hoenn',
		description: 'Norman, the Normal expert!',
		connectedLocations: [{ id: 'lavaridgetown', name: 'Lavaridge Town' }, { id: 'fortreecity', name: 'Fortree City' }],
		buildings: [
			{ id: 'petalburggym', name: 'Petalburg Gym', type: 'gym', accessible: true, gymLeader: 'norman' },
		],
		encounterZones: [],
	},
	fortreecity: {
		id: 'fortreecity',
		name: 'Fortree City',
		type: 'town',
		region: 'hoenn',
		description: 'Winona commands Flying types!',
		connectedLocations: [{ id: 'petalburgcity', name: 'Petalburg City' }, { id: 'mossdeepcity', name: 'Mossdeep City' }],
		buildings: [
			{ id: 'fortreegym', name: 'Fortree Gym', type: 'gym', accessible: true, gymLeader: 'winona' },
		],
		encounterZones: [],
	},
	mossdeepcity: {
		id: 'mossdeepcity',
		name: 'Mossdeep City',
		type: 'town',
		region: 'hoenn',
		description: 'Tate & Liza, Psychic twins!',
		connectedLocations: [{ id: 'fortreecity', name: 'Fortree City' }, { id: 'sootopoliscity', name: 'Sootopolis City' }],
		buildings: [
			{ id: 'mossdeepgym', name: 'Mossdeep Gym', type: 'gym', accessible: true, gymLeader: 'tateandliza' },
		],
		encounterZones: [],
	},
	sootopoliscity: {
		id: 'sootopoliscity',
		name: 'Sootopolis City',
		type: 'town',
		region: 'hoenn',
		description: 'Juan, master of Water!',
		connectedLocations: [{ id: 'mossdeepcity', name: 'Mossdeep City' }, { id: 'hoennleague', name: 'Hoenn League' }],
		buildings: [
			{ id: 'sootopolisgym', name: 'Sootopolis Gym', type: 'gym', accessible: true, gymLeader: 'juan' },
		],
		encounterZones: [],
	},
	hoennleague: {
		id: 'hoennleague',
		name: 'Hoenn Pokemon League',
		type: 'special',
		region: 'hoenn',
		description: 'Face Hoenn Elite Four and Champion Steven!',
		connectedLocations: [{ id: 'sootopoliscity', name: 'Sootopolis City' }, { id: 'twinleaftown', name: 'Twinleaf Town (Sinnoh)' }],
		buildings: [{ id: 'hoennelite4', name: 'Elite Four Chamber', type: 'special', accessible: true }],
		encounterZones: [],
	},

	// ========================================================================
	// SINNOH REGION
	// ========================================================================
	twinleaftown: {
		id: 'twinleaftown',
		name: 'Twinleaf Town',
		type: 'town',
		region: 'sinnoh',
		description: 'Welcome to Sinnoh!',
		connectedLocations: [{ id: 'hoennleague', name: 'Hoenn League' }, { id: 'oreburghcity', name: 'Oreburgh City' }],
		buildings: [],
		encounterZones: [],
	},
	oreburghcity: {
		id: 'oreburghcity',
		name: 'Oreburgh City',
		type: 'town',
		region: 'sinnoh',
		description: 'Roark trains Rock Pokemon!',
		connectedLocations: [{ id: 'twinleaftown', name: 'Twinleaf Town' }, { id: 'eternacity', name: 'Eterna City' }],
		buildings: [
			{ id: 'oreburghgym', name: 'Oreburgh Gym', type: 'gym', accessible: true, gymLeader: 'roark' },
		],
		encounterZones: [],
	},
	eternacity: {
		id: 'eternacity',
		name: 'Eterna City',
		type: 'town',
		region: 'sinnoh',
		description: 'Gardenia loves Grass types!',
		connectedLocations: [{ id: 'oreburghcity', name: 'Oreburgh City' }, { id: 'hearthomecity', name: 'Hearthome City' }],
		buildings: [
			{ id: 'eternagym', name: 'Eterna Gym', type: 'gym', accessible: true, gymLeader: 'gardenia' },
		],
		encounterZones: [],
	},
	hearthomecity: {
		id: 'hearthomecity',
		name: 'Hearthome City',
		type: 'town',
		region: 'sinnoh',
		description: 'Fantina commands Ghost types!',
		connectedLocations: [{ id: 'eternacity', name: 'Eterna City' }, { id: 'veilstonecity', name: 'Veilstone City' }],
		buildings: [
			{ id: 'hearthomegym', name: 'Hearthome Gym', type: 'gym', accessible: true, gymLeader: 'fantina' },
		],
		encounterZones: [],
	},
	veilstonecity: {
		id: 'veilstonecity',
		name: 'Veilstone City',
		type: 'town',
		region: 'sinnoh',
		description: 'Maylene masters Fighting!',
		connectedLocations: [{ id: 'hearthomecity', name: 'Hearthome City' }, { id: 'pastoriacity', name: 'Pastoria City' }],
		buildings: [
			{ id: 'veilstonegym', name: 'Veilstone Gym', type: 'gym', accessible: true, gymLeader: 'maylene' },
		],
		encounterZones: [],
	},
	pastoriacity: {
		id: 'pastoriacity',
		name: 'Pastoria City',
		type: 'town',
		region: 'sinnoh',
		description: 'Crasher Wake splashes!',
		connectedLocations: [{ id: 'veilstonecity', name: 'Veilstone City' }, { id: 'canalavecity', name: 'Canalave City' }],
		buildings: [
			{ id: 'pastoriagym', name: 'Pastoria Gym', type: 'gym', accessible: true, gymLeader: 'crasherwake' },
		],
		encounterZones: [],
	},
	canalavecity: {
		id: 'canalavecity',
		name: 'Canalave City',
		type: 'town',
		region: 'sinnoh',
		description: 'Byron forges with Steel!',
		connectedLocations: [{ id: 'pastoriacity', name: 'Pastoria City' }, { id: 'snowpointcity', name: 'Snowpoint City' }],
		buildings: [
			{ id: 'canalavegym', name: 'Canalave Gym', type: 'gym', accessible: true, gymLeader: 'byron' },
		],
		encounterZones: [],
	},
	snowpointcity: {
		id: 'snowpointcity',
		name: 'Snowpoint City',
		type: 'town',
		region: 'sinnoh',
		description: 'Candice freezes with Ice!',
		connectedLocations: [{ id: 'canalavecity', name: 'Canalave City' }, { id: 'sunyshorecity', name: 'Sunyshore City' }],
		buildings: [
			{ id: 'snowpointgym', name: 'Snowpoint Gym', type: 'gym', accessible: true, gymLeader: 'candice' },
		],
		encounterZones: [],
	},
	sunyshorecity: {
		id: 'sunyshorecity',
		name: 'Sunyshore City',
		type: 'town',
		region: 'sinnoh',
		description: 'Volkner, final Sinnoh badge!',
		connectedLocations: [{ id: 'snowpointcity', name: 'Snowpoint City' }, { id: 'sinnohleague', name: 'Sinnoh League' }],
		buildings: [
			{ id: 'sunyshoregym', name: 'Sunyshore Gym', type: 'gym', accessible: true, gymLeader: 'volkner' },
		],
		encounterZones: [],
	},
	sinnohleague: {
		id: 'sinnohleague',
		name: 'Sinnoh Pokemon League',
		type: 'special',
		region: 'sinnoh',
		description: 'Face Elite Four and Champion Cynthia!',
		connectedLocations: [{ id: 'sunyshorecity', name: 'Sunyshore City' }, { id: 'nuvematown', name: 'Nuvema Town (Unova)' }],
		buildings: [{ id: 'sinnohelite4', name: 'Elite Four Chamber', type: 'special', accessible: true }],
		encounterZones: [],
	},

	// ========================================================================
	// UNOVA REGION
	// ========================================================================
	nuvematown: {
		id: 'nuvematown',
		name: 'Nuvema Town',
		type: 'town',
		region: 'unova',
		description: 'Welcome to Unova!',
		connectedLocations: [{ id: 'sinnohleague', name: 'Sinnoh League' }, { id: 'striatoncity', name: 'Striaton City' }],
		buildings: [],
		encounterZones: [],
	},
	striatoncity: {
		id: 'striatoncity',
		name: 'Striaton City',
		type: 'town',
		region: 'unova',
		description: 'The Striaton Brothers await!',
		connectedLocations: [{ id: 'nuvematown', name: 'Nuvema Town' }, { id: 'nacrenecity', name: 'Nacrene City' }],
		buildings: [
			{ id: 'striatongym', name: 'Striaton Gym', type: 'gym', accessible: true, gymLeader: 'striatonbrothers' },
		],
		encounterZones: [],
	},
	nacrenecity: {
		id: 'nacrenecity',
		name: 'Nacrene City',
		type: 'town',
		region: 'unova',
		description: 'Lenora guards the Basic Badge!',
		connectedLocations: [{ id: 'striatoncity', name: 'Striaton City' }, { id: 'casteliacity', name: 'Castelia City' }],
		buildings: [
			{ id: 'nacrenegym', name: 'Nacrene Gym', type: 'gym', accessible: true, gymLeader: 'lenora' },
		],
		encounterZones: [],
	},
	casteliacity: {
		id: 'casteliacity',
		name: 'Castelia City',
		type: 'town',
		region: 'unova',
		description: 'Burgh creates with Bug types!',
		connectedLocations: [{ id: 'nacrenecity', name: 'Nacrene City' }, { id: 'nimbasacity', name: 'Nimbasa City' }],
		buildings: [
			{ id: 'casteliagym', name: 'Castelia Gym', type: 'gym', accessible: true, gymLeader: 'burgh' },
		],
		encounterZones: [],
	},
	nimbasacity: {
		id: 'nimbasacity',
		name: 'Nimbasa City',
		type: 'town',
		region: 'unova',
		description: 'Elesa shines with Electric!',
		connectedLocations: [{ id: 'casteliacity', name: 'Castelia City' }, { id: 'driftveilcity', name: 'Driftveil City' }],
		buildings: [
			{ id: 'nimbasagym', name: 'Nimbasa Gym', type: 'gym', accessible: true, gymLeader: 'elesa' },
		],
		encounterZones: [],
	},
	driftveilcity: {
		id: 'driftveilcity',
		name: 'Driftveil City',
		type: 'town',
		region: 'unova',
		description: 'Clay digs with Ground!',
		connectedLocations: [{ id: 'nimbasacity', name: 'Nimbasa City' }, { id: 'mistraltoncity', name: 'Mistralton City' }],
		buildings: [
			{ id: 'driftveilgym', name: 'Driftveil Gym', type: 'gym', accessible: true, gymLeader: 'clay' },
		],
		encounterZones: [],
	},
	mistraltoncity: {
		id: 'mistraltoncity',
		name: 'Mistralton City',
		type: 'town',
		region: 'unova',
		description: 'Skyla soars with Flying!',
		connectedLocations: [{ id: 'driftveilcity', name: 'Driftveil City' }, { id: 'icirruscity', name: 'Icirrus City' }],
		buildings: [
			{ id: 'mistraltongym', name: 'Mistralton Gym', type: 'gym', accessible: true, gymLeader: 'skyla' },
		],
		encounterZones: [],
	},
	icirruscity: {
		id: 'icirruscity',
		name: 'Icirrus City',
		type: 'town',
		region: 'sinnoh',
		description: 'Brycen freezes with Ice!',
		connectedLocations: [{ id: 'mistraltoncity', name: 'Mistralton City' }, { id: 'opelucidcity', name: 'Opelucid City' }],
		buildings: [
			{ id: 'icirrusgym', name: 'Icirrus Gym', type: 'gym', accessible: true, gymLeader: 'brycen' },
		],
		encounterZones: [],
	},
	opelucidcity: {
		id: 'opelucidcity',
		name: 'Opelucid City',
		type: 'town',
		region: 'unova',
		description: 'Drayden commands Dragons!',
		connectedLocations: [{ id: 'icirruscity', name: 'Icirrus City' }, { id: 'unovaleague', name: 'Unova League' }],
		buildings: [
			{ id: 'opelucidgym', name: 'Opelucid Gym', type: 'gym', accessible: true, gymLeader: 'drayden' },
		],
		encounterZones: [],
	},
	unovaleague: {
		id: 'unovaleague',
		name: 'Unova Pokemon League',
		type: 'special',
		region: 'unova',
		description: 'Face Elite Four and Champion Alder!',
		connectedLocations: [{ id: 'opelucidcity', name: 'Opelucid City' }, { id: 'vanillevilletown', name: 'Vaniville Town (Kalos)' }],
		buildings: [{ id: 'unovaelite4', name: 'Elite Four Chamber', type: 'special', accessible: true }],
		encounterZones: [],
	},

	// ========================================================================
	// KALOS, ALOLA, GALAR, AND PALDEA REGIONS (Streamlined for completion)
	// ========================================================================
	vanillevilletown: {
		id: 'vanillevilletown',
		name: 'Vaniville Town',
		type: 'town',
		region: 'kalos',
		description: 'Welcome to Kalos!',
		connectedLocations: [{ id: 'unovaleague', name: 'Unova League' }, { id: 'kalosleague', name: 'Kalos League' }],
		buildings: [],
		encounterZones: [],
	},
	kalosleague: {
		id: 'kalosleague',
		name: 'Kalos Pokemon League',
		type: 'special',
		region: 'kalos',
		description: 'Face Kalos Elite Four and Champion Diantha!',
		connectedLocations: [{ id: 'vanillevilletown', name: 'Vaniville Town' }, { id: 'ikitown', name: 'Iki Town (Alola)' }],
		buildings: [{ id: 'kaloselite4', name: 'Elite Four Chamber', type: 'special', accessible: true }],
		encounterZones: [],
	},
	ikitown: {
		id: 'ikitown',
		name: 'Iki Town',
		type: 'town',
		region: 'alola',
		description: 'Welcome to Alola!',
		connectedLocations: [{ id: 'kalosleague', name: 'Kalos League' }, { id: 'alolaleague', name: 'Alola League' }],
		buildings: [],
		encounterZones: [],
	},
	alolaleague: {
		id: 'alolaleague',
		name: 'Alola Pokemon League',
		type: 'special',
		region: 'alola',
		description: 'Face Alola Elite Four!',
		connectedLocations: [{ id: 'ikitown', name: 'Iki Town' }, { id: 'postwicktown', name: 'Postwick Town (Galar)' }],
		buildings: [{ id: 'alolaelite4', name: 'Elite Four Chamber', type: 'special', accessible: true }],
		encounterZones: [],
	},
	postwicktown: {
		id: 'postwicktown',
		name: 'Postwick Town',
		type: 'town',
		region: 'galar',
		description: 'Welcome to Galar!',
		connectedLocations: [{ id: 'alolaleague', name: 'Alola League' }, { id: 'galarleague', name: 'Galar League' }],
		buildings: [],
		encounterZones: [],
	},
	galarleague: {
		id: 'galarleague',
		name: 'Galar Pokemon League',
		type: 'special',
		region: 'galar',
		description: 'Face Galar Elite Four and Champion Leon!',
		connectedLocations: [{ id: 'postwicktown', name: 'Postwick Town' }, { id: 'cabopokada', name: 'Cabo Pokada (Paldea)' }],
		buildings: [{ id: 'galarelite4', name: 'Elite Four Chamber', type: 'special', accessible: true }],
		encounterZones: [],
	},
	cabopokada: {
		id: 'cabopokada',
		name: 'Cabo Pokada',
		type: 'town',
		region: 'paldea',
		description: 'Welcome to Paldea! The final region!',
		connectedLocations: [{ id: 'galarleague', name: 'Galar League' }, { id: 'paldealeague', name: 'Paldea League' }],
		buildings: [],
		encounterZones: [],
	},
	paldealeague: {
		id: 'paldealeague',
		name: 'Paldea Pokemon League',
		type: 'special',
		region: 'paldea',
		description: 'The final challenge! Face Paldea Elite Four and Champion Geeta!',
		connectedLocations: [{ id: 'cabopokada', name: 'Cabo Pokada' }],
		buildings: [{ id: 'paldeaelite4', name: 'Elite Four Chamber', type: 'special', accessible: true }],
		encounterZones: [],
	},
};

// ============================================================================
// ENCOUNTER ZONES
// ============================================================================

export const ENCOUNTER_ZONES: Record<string, {
	name: string,
	pokemon: string[],
	levelRange: [number, number],
	battleType?: 'single' | 'double',
}> = {
	// Kanto encounters
	kanto_route1: { name: 'Tall Grass', pokemon: ['pidgey', 'rattata'], levelRange: [2, 5], battleType: 'single' },
	kanto_route2: { name: 'Tall Grass', pokemon: ['pidgey', 'rattata', 'caterpie', 'weedle'], levelRange: [3, 7], battleType: 'single' },
	kanto_viridianforest: { name: 'Forest Floor', pokemon: ['caterpie', 'weedle', 'metapod', 'kakuna', 'pikachu'], levelRange: [3, 7], battleType: 'single' },
	kanto_route3: { name: 'Rocky Path', pokemon: ['spearow', 'jigglypuff', 'mankey'], levelRange: [5, 10], battleType: 'single' },
	kanto_mtmoon: { name: 'Cave Interior', pokemon: ['zubat', 'geodude', 'paras', 'clefairy'], levelRange: [7, 12], battleType: 'single' },
	kanto_route4: { name: 'Mountain Path', pokemon: ['rattata', 'spearow', 'ekans', 'sandshrew'], levelRange: [8, 14], battleType: 'single' },
	kanto_route24: { name: 'Nugget Bridge', pokemon: ['pidgey', 'oddish', 'bellsprout'], levelRange: [10, 16], battleType: 'single' },
	kanto_route25: { name: 'Grass Area', pokemon: ['pidgey', 'oddish', 'bellsprout', 'venonat'], levelRange: [10, 16], battleType: 'single' },
	kanto_route5: { name: 'Tall Grass', pokemon: ['pidgey', 'meowth', 'oddish', 'mankey'], levelRange: [12, 18], battleType: 'single' },
	kanto_route6: { name: 'Tall Grass', pokemon: ['pidgey', 'meowth', 'oddish', 'psyduck'], levelRange: [12, 18], battleType: 'single' },
	kanto_route11: { name: 'Eastern Grass', pokemon: ['spearow', 'ekans', 'drowzee'], levelRange: [14, 20], battleType: 'single' },
	kanto_diglettscave: { name: 'Tunnel', pokemon: ['diglett', 'dugtrio'], levelRange: [15, 25], battleType: 'single' },
	kanto_route7: { name: 'City Route', pokemon: ['pidgey', 'meowth', 'oddish', 'growlithe', 'vulpix'], levelRange: [20, 26], battleType: 'single' },
	kanto_route16: { name: 'Cycling Road', pokemon: ['spearow', 'fearow', 'doduo'], levelRange: [22, 30], battleType: 'single' },
	kanto_route19: { name: 'Water Surface', pokemon: ['tentacool', 'tentacruel'], levelRange: [30, 38], battleType: 'single' },
	kanto_route22: { name: 'League Gate', pokemon: ['rattata', 'nidoran-f', 'nidoran-m', 'mankey'], levelRange: [3, 7], battleType: 'single' },
	kanto_victoryroad: { name: 'Final Cave', pokemon: ['machop', 'machoke', 'geodude', 'graveler', 'onix', 'marowak'], levelRange: [38, 48], battleType: 'single' },

	// Johto encounters
	johto_route29: { name: 'Starting Path', pokemon: ['pidgey', 'sentret', 'hoothoot'], levelRange: [2, 4], battleType: 'single' },
	johto_route30: { name: 'Northern Route', pokemon: ['pidgey', 'caterpie', 'weedle', 'ledyba', 'spinarak'], levelRange: [3, 5], battleType: 'single' },
	johto_route32: { name: 'Long Path', pokemon: ['rattata', 'ekans', 'bellsprout', 'hoppip', 'mareep'], levelRange: [55, 60], battleType: 'single' },
	johto_route34: { name: 'Day Care Route', pokemon: ['pidgey', 'rattata', 'jigglypuff', 'meowth', 'drowzee'], levelRange: [58, 64], battleType: 'single' },
	johto_route35: { name: 'Park Path', pokemon: ['pidgey', 'hoothoot', 'yanma', 'sunkern'], levelRange: [60, 66], battleType: 'single' },
	johto_route38: { name: 'Western Path', pokemon: ['rattata', 'meowth', 'magnemite', 'farfetchd'], levelRange: [63, 68], battleType: 'single' },
	johto_route40: { name: 'Coastal Water', pokemon: ['tentacool', 'tentacruel', 'mantine'], levelRange: [65, 70], battleType: 'single' },

	// Hoenn encounters
	hoenn_route101: { name: 'Tall Grass', pokemon: ['poochyena', 'zigzagoon', 'wurmple'], levelRange: [70, 75], battleType: 'single' },

	// Sinnoh encounters (levels 80-92)
	sinnoh_route201: { name: 'Starting Path', pokemon: ['starly', 'bidoof'], levelRange: [80, 83], battleType: 'single' },
	sinnoh_route202: { name: 'Northern Route', pokemon: ['starly', 'bidoof', 'kricketot'], levelRange: [82, 85], battleType: 'single' },
	sinnoh_route203: { name: 'Route to Eterna', pokemon: ['shinx', 'starly', 'bidoof'], levelRange: [84, 87], battleType: 'single' },
	sinnoh_route205: { name: 'Hearthome Path', pokemon: ['buizel', 'shellos', 'pachirisu'], levelRange: [86, 89], battleType: 'single' },
	sinnoh_route209: { name: 'Veilstone Path', pokemon: ['mime jr', 'chansey', 'ralts'], levelRange: [88, 90], battleType: 'single' },
	sinnoh_route212: { name: 'Pastoria Path', pokemon: ['croagunk', 'wooper', 'quagsire'], levelRange: [89, 91], battleType: 'single' },
	sinnoh_route213: { name: 'Coastal Route', pokemon: ['shellos', 'wingull', 'buizel'], levelRange: [90, 92], battleType: 'single' },
	sinnoh_route218: { name: 'Snowpoint Path', pokemon: ['snover', 'sneasel', 'snorunt'], levelRange: [91, 93], battleType: 'single' },
	sinnoh_route222: { name: 'Final Route', pokemon: ['electabuzz', 'luxio', 'magneton'], levelRange: [92, 95], battleType: 'single' },

	// Unova encounters (levels 88-97)
	unova_route1: { name: 'Starting Path', pokemon: ['patrat', 'lillipup'], levelRange: [88, 90], battleType: 'single' },
	unova_route2: { name: 'Northern Route', pokemon: ['purrloin', 'pidove', 'patrat'], levelRange: [89, 91], battleType: 'single' },
	unova_route3: { name: 'Nacrene Path', pokemon: ['blitzle', 'purrloin', 'pidove'], levelRange: [90, 92], battleType: 'single' },
	unova_route4: { name: 'Castelia Path', pokemon: ['sandile', 'darumaka', 'scraggy'], levelRange: [91, 93], battleType: 'single' },
	unova_route5: { name: 'Nimbasa Path', pokemon: ['gothita', 'solosis', 'minccino'], levelRange: [92, 94], battleType: 'single' },
	unova_route6: { name: 'Driftveil Path', pokemon: ['deerling', 'foongus', 'karrablast'], levelRange: [93, 95], battleType: 'single' },
	unova_route7: { name: 'Mistralton Path', pokemon: ['cubchoo', 'tranquill', 'watchog'], levelRange: [94, 96], battleType: 'single' },
	unova_route8: { name: 'Icirrus Path', pokemon: ['palpitoad', 'stunfisk', 'shelmet'], levelRange: [95, 97], battleType: 'single' },
	unova_route9: { name: 'Opelucid Path', pokemon: ['gothorita', 'duosion', 'amoonguss'], levelRange: [96, 98], battleType: 'single' },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getStartingLocation(): { id: string, name: string } {
	return { id: 'pallettown', name: 'Pallet Town' };
}

export function getLevelCap(badgeCount: number): number {
	return LEVEL_CAPS[badgeCount] || 100;
}

export function canPokemonLevelUp(currentLevel: number, badgeCount: number): boolean {
	const cap = getLevelCap(badgeCount);
	return currentLevel < cap;
}
