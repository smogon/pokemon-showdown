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
	'newbarktown': {
		id: 'newbarktown',
		name: 'New Bark Town',
		type: 'town',
		description: 'The wind blows constantly in this quiet town.',
		connectedLocations: [
			{ 
				id: 'route101', 
				name: 'Route 101' 
			},
			{
				id: 'hiddengrove',
				name: 'Hidden Grove',
				requiredFlag: 'master_defeated', // Flag required to travel
				blockMessage: 'The path is overgrown. Only a Dojo Master could clear this way.',
			}
		],
		buildings: [
			{
				id: 'elmslab',
				name: 'Elm\'s Lab',
				type: 'lab',
				description: 'Pokemon Research Laboratory.',
				accessible: true,
				npcs: ['professorelm'], // Link to the NPC defined in game-npcs.ts
			},
			{
				id: 'townshop',
				name: 'General Store',
				type: 'pokemart',
				description: 'Supplies for your journey.',
				accessible: true,
			},
			{
				id: 'fightingdojo',
				name: 'Fighting Dojo',
				type: 'gym',
				description: 'A place where trainers temper their spirits.',
				accessible: true,
				// BUILDING GATING LOGIC
				requiredFlag: 'security_cleared',
				blockMessage: 'The Security Guard is blocking the door. Defeat him outside to enter!',
				gymLeaderId: 'dojomaster',
			},
		],
		encounterZones: [],
	},
	'route101': {
		id: 'route101',
		name: 'Route 101',
		type: 'route',
		description: 'A grassy path filled with wild Pokemon.',
		connectedLocations: [
			{ id: 'newbarktown', name: 'New Bark Town' },
		],
		encounterZones: ['grassland'],
	},
	'hiddengrove': {
		id: 'hiddengrove',
		name: 'Hidden Grove',
		type: 'forest',
		description: 'A secret clearing revealed only to the strong.',
		connectedLocations: [
			{ id: 'newbarktown', name: 'New Bark Town' },
		],
		encounterZones: ['rarezone'],
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
	'grassland': {
		name: 'Tall Grass',
		pokemon: ['rattata', 'pidgey', 'sentret'],
		levelRange: [2, 5],
		battleType: 'single',
	},
	'rarezone': {
		name: 'Mystic Clearing',
		pokemon: ['pikachu', 'eevee', 'ralts'],
		levelRange: [10, 15],
		battleType: 'single',
	}
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getStartingLocation(): { id: string, name: string } {
	return { id: 'newbarktown', name: 'New Bark Town' };
}
