/**
 * Game Locations Configuration
 *
 * This file contains all location-related story data including:
 * - Locations and their connections
 * - Encounter zones with wild Pokemon
 *
 * Edit this file to create new stories and adventures.
 */

// ============================================================================
// LOCATIONS
// ============================================================================

export const LOCATIONS: Record<string, any> = {
	'startingroom': {
		id: 'startingroom',
		name: 'Starting Room',
		type: 'town',
		description: 'A quiet, empty room. Your adventure starts here.',
		connectedLocations: [
			{ id: 'grassypath', name: 'Grassy Path' },
		],
		buildings: [
			{
				id: 'startshop',
				name: 'General Store',
				type: 'pokemart',
				requiredFlags: 'ps',
				blockMessage: 'Requires Prince Sky\'s Permission.',
				description: 'A small supply shop.',
				accessible: true,
			},
			{
				id: 'townhall',
				name: 'Town Hall',
				type: 'house',
				description: 'The local administration building.',
				accessible: true,
				npcs: ['guide'],
			},
		],
		encounterZones: [],
	},
	'grassypath': {
		id: 'grassypath',
		name: 'Grassy Path',
		type: 'route',
		description: 'A simple path with weak wild Pokemon.',
		connectedLocations: [
			{ id: 'startingroom', name: 'Starting Room' },
		],
		encounterZones: ['pathzone1'],
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
	'pathzone1': {
		name: 'Tall Grass',
		pokemon: ['rattata', 'pidgey', 'sentret'],
		levelRange: [2, 5],
		battleType: 'single',
	},
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getStartingLocation(): { id: string, name: string } {
	return { id: 'startingroom', name: 'Starting Room' };
}
