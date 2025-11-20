/*
* Pokemon Showdown
* RPG Locations Data
*/

import type { Location } from './interface';

export const LOCATIONS: Record<string, Location> = {
	'start_room': {
		id: 'start_room',
		name: 'Starting Room',
		type: 'town',
		description: 'A quiet, empty room. Your adventure starts here.',
		connectedLocations: [], // Connect new routes here
		buildings: [
             // Example: A basic shop to start with
             {
                 id: 'start_shop',
                 name: 'General Store',
                 type: 'pokemart',
                 description: 'A small supply shop.',
                 accessible: true
             }
        ],
		encounterZones: [], 
	},
};

export const ENCOUNTER_ZONES: Record<string, { name: string, pokemon: string[], levelRange: [number, number], battleType?: 'single' | 'double' }> = {
    // Define wild encounter zones here, e.g.:
    // 'forest_zone': { name: 'Dark Forest', pokemon: ['caterpie'], levelRange: [2, 5] }
};

export function getStartingLocation(): { id: string, name: string } {
	// Fallback if config points to missing location
	const firstLocationId = Object.keys(LOCATIONS)[0];
	return {
		id: firstLocationId,
		name: LOCATIONS[firstLocationId].name,
	};
}
