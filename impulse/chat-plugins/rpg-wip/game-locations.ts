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
				id: 'pokecenter',
				name: 'Pokémon Center',
				type: 'pokecenter',
				description: 'Heal your Pokémon here.',
				accessible: true,
				npcs: ['nursejoy'],
			},
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
				                // NEW: Gym Configuration
				                npcs: ['dojoguide'],
				                trainers: ['blackbelt'],
				            },
				            {
				                id: 'rockethideout',
				                name: 'Rocket Hideout',
				                type: 'misc',
				                description: 'A suspicious looking warehouse.',
				                accessible: true,
				                rooms: [
				                    {
				                        id: 'floor1',
				                        name: 'Floor 1 - Storage',
				                        description: 'Crates are piled everywhere. Two guards are patrolling.',
				                        isEntrance: true,
				                        connectedRooms: ['floor2'],
				                        npcs: ['rocketguard'],
				                        trainers: ['rocketgrunt_1a', 'rocketgrunt_1b'],
				                    },
				                    {
				                        id: 'floor2',
				                        name: 'Floor 2 - Lab',
				                        description: 'Strange chemical smells fill the air.',
				                        connectedRooms: ['floor1', 'office'],
				                        trainers: ['rocketgrunt_2'],
				                        // ACCESS CONTROL: Requires defeating both Floor 1 trainers
				                        requiredFlag: ['hideout_1a_clear', 'hideout_1b_clear'],
				                        blockMessage: 'The gate is locked electronically. It seems linked to the biometrics of the guards downstairs.',
				                    },
				                    					{
				                    						id: 'office',
				                    						name: 'Admin Office',
				                    						description: 'A lavish office overlooking the operation.',
				                    						connectedRooms: ['floor2'],
				                    						trainers: ['rocketadmin'],
				                    						// ACCESS CONTROL: Requires defeating Floor 2 trainer
				                    						requiredFlag: ['hideout_2_clear'],
				                    						blockMessage: 'The heavy oak door is locked. You need the key card from the Floor 2 guard.',
				                    					}
				                    				]
				                    			},
				                    			{
				                    				id: 'oldhouse',
				                    				name: 'Old House (Legacy Demo)',
				                    				type: 'misc',
				                    				description: 'A dusty old house with a single room.',
				                    				accessible: true,
				                    				// LEGACY SINGLE-FLOOR CONFIGURATION
				                    				npcs: ['guide'],
				                    				trainers: [],
				                    			},
				                    		],
				                    		encounterZones: [],
				                    	},	'route101': {
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
	// Badge Lock Test
	'dangerouscave': {
		name: 'Dangerous Cave',
		pokemon: ['zubat', 'geodude', 'onix'],
		levelRange: [15, 20],
		battleType: 'single',
		requiredBadge: 'Expert Badge',
		blockMessage: 'It is too dark and dangerous here! You need the Experr Badge to enter safely.',
	},
	// Flag Lock Test
	'secretgarden': {
		name: 'Secret Garden',
		pokemon: ['bulbasaur', 'chikorita', 'roselia'],
		levelRange: [12, 14],
		battleType: 'double',
		requiredFlag: 'garden_key_found',
		blockMessage: 'The gate is locked tight. You need to find a key to enter.',
	}
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getStartingLocation(): { id: string, name: string } {
	return { id: 'newbarktown', name: 'New Bark Town' };
}
