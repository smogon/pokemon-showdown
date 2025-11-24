/**
 * Game Locations Configuration
 *
 * This file contains all location-related story data including:
 * - Locations and their connections
 * - Encounter zones with wild Pokemon
 *
 * Edit this file to create new stories and adventures.
 */

import type { EncounterZone } from './interface';

// ============================================================================
// LOCATIONS
// ============================================================================

export const LOCATIONS: Record<string, any> = {
	// --- MAIN TOWN ---
	'newbarktown': {
		id: 'newbarktown',
		name: 'New Bark Town',
		type: 'town',
		description: 'The wind blows constantly in this quiet town.',
		connectedLocations: [
			{ id: 'route101', name: 'Route 101' },
			{ 
				id: 'hiddengrove', 
				name: 'Hidden Grove',
				requiredFlag: 'master_defeated',
				blockMessage: 'The path is overgrown. Only a Dojo Master could clear this way.'
			},
			{ id: 'rocket_hideout_b1', name: '🚀 Enter Rocket Hideout' },
			{ id: 'haunted_tower_1f', name: '👻 Enter Haunted Tower' },
		],
		buildings: [
			{
				id: 'elmslab',
				name: 'Elm\'s Lab',
				type: 'lab',
				description: 'Pokemon Research Laboratory.',
				accessible: true,
				npcs: ['professorelm'],
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
				requiredFlag: 'security_cleared',
				blockMessage: 'The Security Guard is blocking the door. Defeat him outside to enter!',
				gymLeaderId: 'dojomaster',
				npcs: ['dojoguide'],
				trainers: ['blackbelt'],
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
		encounterZones: ['grassland', 'dangerouscave'],
	},

	'hiddengrove': {
		id: 'hiddengrove',
		name: 'Hidden Grove',
		type: 'forest',
		description: 'A secret clearing revealed only to the strong.',
		connectedLocations: [
			{ id: 'newbarktown', name: 'New Bark Town' },
		],
		encounterZones: ['rarezone', 'secretgarden'],
	},

	// ========================================================================
	// ROCKET HIDEOUT (5 Floors)
	// ========================================================================

	'rocket_hideout_b1': {
		id: 'rocket_hideout_b1',
		name: 'Rocket Hideout B1F',
		type: 'dungeon',
		description: 'A dark basement. Two grunts are guarding the stairs.',
		connectedLocations: [
			{ id: 'newbarktown', name: 'Exit to Surface' },
			{ 
				id: 'rocket_hideout_b2', 
				name: '▼ Stairs to B2F',
				// GATING: Must defeat BOTH trainers on this floor
				requiredFlag: ['beat_rocket_b1_1', 'beat_rocket_b1_2'],
				blockMessage: 'The grunts are blocking the stairs! Defeat them all to proceed.'
			}
		],
		encounterZones: ['hideout_encounters'],
		buildings: [
			// Just a dummy interaction for flavor
			{
				id: 'b1_statue',
				name: 'Giovanni Statue',
				type: 'misc',
				description: 'A statue of the boss. It feels intimidating.',
				accessible: true
			}
		]
	},

	'rocket_hideout_b2': {
		id: 'rocket_hideout_b2',
		name: 'Rocket Hideout B2F',
		type: 'dungeon',
		description: 'The air is getting thick with smog.',
		connectedLocations: [
			{ id: 'rocket_hideout_b1', name: '▲ Stairs to B1F' },
			{ 
				id: 'rocket_hideout_b3', 
				name: '▼ Stairs to B3F',
				requiredFlag: ['beat_rocket_b2_1', 'beat_rocket_b2_2'],
				blockMessage: 'More grunts are blocking the way!'
			}
		],
		encounterZones: ['hideout_encounters'],
	},

	'rocket_hideout_b3': {
		id: 'rocket_hideout_b3',
		name: 'Rocket Hideout B3F',
		type: 'dungeon',
		description: 'A maze of spinning tiles.',
		connectedLocations: [
			{ id: 'rocket_hideout_b2', name: '▲ Stairs to B2F' },
			{ 
				id: 'rocket_hideout_b4', 
				name: '▼ Stairs to B4F',
				requiredFlag: ['beat_rocket_b3_1'],
				blockMessage: 'A strong grunt refuses to let you pass.'
			}
		],
		encounterZones: ['hideout_encounters'],
	},

	'rocket_hideout_b4': {
		id: 'rocket_hideout_b4',
		name: 'Rocket Hideout B4F',
		type: 'dungeon',
		description: 'The Admin\'s office is here. There is a bed in the corner.',
		connectedLocations: [
			{ id: 'rocket_hideout_b3', name: '▲ Stairs to B3F' },
			{ 
				id: 'rocket_hideout_b5', 
				name: '▼ Stairs to Boss Room',
				requiredFlag: ['beat_rocket_admin'],
				blockMessage: 'The Admin blocks the door to the Boss\'s office.'
			}
		],
		buildings: [
			{
				id: 'rocket_rest_area',
				name: 'Employee Rest Area',
				type: 'pokecenter', // Allows healing before boss
				description: 'A comfortable bed. Looks like a good spot to rest.',
				accessible: true
			}
		],
		encounterZones: [], // No wild encounters on Admin floor
	},

	'rocket_hideout_b5': {
		id: 'rocket_hideout_b5',
		name: 'Rocket Hideout B5F (Boss)',
		type: 'dungeon',
		description: 'The deepest part of the base. The Boss is waiting.',
		connectedLocations: [
			{ id: 'rocket_hideout_b4', name: '▲ Stairs to B4F' },
		],
		encounterZones: [],
	},

	// ========================================================================
	// HAUNTED TOWER (3 Floors)
	// ========================================================================

	'hauntedtower1f': {
		id: 'hauntedtower1f',
		name: 'Haunted Tower 1F',
		type: 'indoor',
		description: 'A spooky tower filled with mist.',
		connectedLocations: [
			{ id: 'newbarktown', name: 'Exit Tower' },
			{ id: 'hauntedtower2f', name: '▲ Stairs to 2F' },
		],
		buildings: [
			{
				id: 'towershrine',
				name: 'Healing Shrine',
				type: 'pokecenter',
				description: 'A safe spot to rest.',
				accessible: true
			}
		],
		encounterZones: ['ghostzonelow'],
	},

	'hauntedtower2f': {
		id: 'hauntedtower2f',
		name: 'Haunted Tower 2F',
		type: any,
		description: 'You hear whispers from the shadows.',
		connectedLocations: [
			{ id: 'hauntedtower1f', name: '▼ Stairs to 1F' },
			{ 
				id: 'hauntedtower3f', 
				name: '▲ Stairs to 3F',
				requiredFlag: 'beat_channeler_1', 
				blockMessage: 'A spirit blocks the stairs up. You must calm it (defeat it).'
			},
		],
		encounterZones: ['ghostzonemed'],
	},

	'hauntedtower3f': {
		id: 'hauntedtower3f',
		name: 'Haunted Tower 3F',
		type: any,
		description: 'The top of the tower. The mist is thickest here.',
		connectedLocations: [
			{ id: 'hauntedtower2f', name: '▼ Stairs to 2F' },
		],
		encounterZones: ['ghostzonehigh'],
	},
};

// ============================================================================
// ENCOUNTER ZONES
// ============================================================================

export const ENCOUNTER_ZONES: Record<string, EncounterZone> = {
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
	},
	'dangerouscave': {
		name: 'Dangerous Cave',
		pokemon: ['zubat', 'geodude', 'onix'],
		levelRange: [15, 20],
		battleType: 'single',
		requiredBadge: 'Expert Badge',
		blockMessage: 'It is too dark and dangerous here! You need the Expert Badge to enter safely.',
	},
	'secretgarden': {
		name: 'Secret Garden',
		pokemon: ['bulbasaur', 'chikorita', 'roselia'],
		levelRange: [12, 14],
		battleType: 'double',
		requiredFlag: 'garden_key_found',
		blockMessage: 'The gate is locked tight. You need to find a key to enter.',
	},
	// --- Rocket Hideout Spawns ---
	'hideoutencounters': {
		name: 'Base Patrol',
		pokemon: ['rattata', 'zubat', 'koffing', 'grimer'],
		levelRange: [10, 14],
		battleType: 'single',
	},
	// --- Haunted Tower Spawns ---
	'ghostzonelow': {
		name: 'Tower Mist',
		pokemon: ['gastly', 'cubone'],
		levelRange: [10, 13],
		battleType: 'single',
	},
	'ghostzonemed': {
		name: 'Spooky Mist',
		pokemon: ['gastly', 'haunter', 'misdreavus'],
		levelRange: [14, 17],
		battleType: 'single',
	},
	'ghostzonehigh': {
		name: 'Spirit Realm',
		pokemon: ['haunter', 'gengar', 'duskull'],
		levelRange: [18, 22],
		battleType: 'single',
	},
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getStartingLocation(): { id: string, name: string } {
	return { id: 'newbarktown', name: 'New Bark Town' };
}
