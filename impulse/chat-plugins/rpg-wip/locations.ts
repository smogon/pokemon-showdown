/*
* Pokemon Showdown
* RPG Locations Data
*/

import type { Location } from './interface';

export const LOCATIONS: Record<string, Location> = {
	'startingroom': {
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
    'grassypath': {
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
        pokemon: ['rattata', 'pidgey', 'sentret'],
        levelRange: [2, 5],
        battleType: 'single'
    }
};

export function getStartingLocation(): { id: string, name: string } {
	return { id: 'startingroom', name: 'Starting Room' };
}
