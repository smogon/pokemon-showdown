/*
* Pokemon Showdown
* RPG Locations Data
*/

import type { Location } from './interface';

export const LOCATIONS: Record<string, Location> = {
	'startingroom': { // [CHANGED] Key matches toID("Starting Room")
		id: 'startingroom',
		name: 'Starting Room',
		type: 'town',
		description: 'A quiet, empty room. Your adventure starts here.',
		connectedLocations: [
            { id: 'grassypath', name: 'Grassy Path' }
        ],
		buildings: [
             {
                 id: 'start_shop',
                 name: 'General Store',
                 type: 'pokemart',
                 description: 'A small supply shop.',
                 accessible: true
             },
             {
                id: 'town_hall',
                name: 'Town Hall',
                type: 'house',
                description: 'The local administration building.',
                accessible: true,
                npcs: ['guide']
            }
        ],
		encounterZones: [], 
	},
    'grassypath': { // [CHANGED] Consistent ID format
        id: 'grassypath',
        name: 'Grassy Path',
        type: 'route',
        description: 'A simple path with weak wild Pokemon.',
        connectedLocations: [
            { id: 'startingroom', name: 'Starting Room' }
        ],
        encounterZones: ['path_zone_1'],
    }
};

export const ENCOUNTER_ZONES: Record<string, { name: string, pokemon: string[], levelRange: [number, number], battleType?: 'single' | 'double' }> = {
    'path_zone_1': {
        name: 'Tall Grass',
        // Make sure these IDs match valid species in Pokemon Showdown
        pokemon: ['rattata', 'pidgey', 'caterpie', 'zigzagoon'], 
        levelRange: [2, 4],
        battleType: 'single'
    },
    // Add a harder zone
    'deep_woods': {
        name: 'Deep Woods',
        pokemon: ['beedrill', 'pikachu', 'murkrow'],
        levelRange: [5, 8],
        battleType: 'double' // Test double battles
    }
};

export function getStartingLocation(): { id: string, name: string } {
	return { id: 'startingroom', name: 'Starting Room' };
}
