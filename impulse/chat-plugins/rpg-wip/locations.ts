import type { Location } from './interface';

export const LOCATIONS: Record<string, Location> = {
	'start_room': {
		id: 'start_room',
		name: 'Starting Room',
		type: 'town',
		description: 'A quiet room with a Travel Guide standing in the center.',
		connectedLocations: [
            { id: 'grassy_path', name: 'Grassy Path' }
        ],
		buildings: [
             {
                 id: 'start_shop',
                 name: 'General Store',
                 type: 'pokemart',
                 description: 'A small supply shop.',
                 accessible: true
             }
        ],
		encounterZones: [],
        // Add the NPC to the main location logic
        // (Note: Depending on your core logic, NPCs might need to be in a 'building' or handled via 'scriptedEvents' or a direct 'npcs' array on Location)
        // Based on your structure, NPCs are usually inside buildings, but let's put this one in the "Town" if the engine supports it, 
        // or create a "Town Hall" building.
        // Let's add a Town Hall for the Guide:
	},
    'grassy_path': {
        id: 'grassy_path',
        name: 'Grassy Path',
        type: 'route',
        description: 'A simple path with weak wild Pokemon.',
        connectedLocations: [
            { id: 'start_room', name: 'Starting Room' }
        ],
        encounterZones: ['path_zone_1'],
    }
};

// Update start_room to include the building with the NPC
LOCATIONS['start_room'].buildings?.push({
    id: 'town_hall',
    name: 'Town Hall',
    type: 'house',
    description: 'The local administration building.',
    accessible: true,
    npcs: ['guide']
});

export const ENCOUNTER_ZONES: Record<string, { name: string, pokemon: string[], levelRange: [number, number], battleType?: 'single' | 'double' }> = {
    'path_zone_1': {
        name: 'Tall Grass',
        pokemon: ['rattata', 'pidgey', 'sentret'],
        levelRange: [2, 5],
        battleType: 'single'
    }
};

export function getStartingLocation(): { id: string, name: string } {
	return { id: 'start_room', name: 'Starting Room' };
}
