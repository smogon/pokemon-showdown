import type { NPCData, TrainerSpec } from './interface';

/**
 * Game NPCs & Story Configuration
 *
 * This file contains all NPC and story-related data including:
 * - NPCs and their dialogues
 * - Trainers and their parties
 * - Trainer locations (where trainers can be found)
 * - Gym badges and leaders
 * - Story events and triggers
 *
 * Edit this file to create new stories and adventures.
 */

// ============================================================================
// NPCS
// ============================================================================

export const NPC_DATABASE: Record<string, NPCData> = {
	'guide': {
		id: 'guide',
		name: 'Travel Guide',
		location: 'startingroom',
		dialogue: "Hello! Welcome to this new world. It's dangerous to go alone, take one of these!",
		action: {
			type: 'choosestarter',
			starterLevel: 5,
			onceOnly: true,
		},
	},
};

// ============================================================================
// TRAINERS
// ============================================================================

export const TRAINER_DATABASE: Record<string, TrainerSpec> = {
	'youngsterjoey': {
		name: 'Youngster Joey',
		money: 200,
		party: [
			{ species: 'rattata', level: 5, moves: ['tackle', 'tailwhip'] },
		],
		dialogue: {
			start: "My Rattata is in the top percentage of Rattata!",
			win: "I'll never give up!",
			lose: "You're tough!",
		},
	},
};

// ============================================================================
// TRAINER LOCATIONS
// ============================================================================

export const TRAINER_LOCATIONS: Record<string, string[]> = {
	'grassypath': ['youngsterjoey'],
};

// ============================================================================
// BADGES
// ============================================================================

export interface BadgeInfo {
	gymLeaderId: string;
	badgeName: string;
	order: number;
	description?: string;
}

export const BADGES: BadgeInfo[] = [
	{
		gymLeaderId: 'youngsterjoey',
		badgeName: 'Rat Badge',
		order: 1,
		description: 'Awarded for defeating the Top Percentage Rattata.',
	},
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const TOTAL_BADGES = BADGES.length;

export function getBadgeForGymLeader(gymLeaderId: string): string | undefined {
	const badge = BADGES.find(b => b.gymLeaderId === gymLeaderId);
	return badge?.badgeName;
}

export function getGymLeaderForBadge(badgeName: string): string | undefined {
	const badge = BADGES.find(b => b.badgeName === badgeName);
	return badge?.gymLeaderId;
}

export function getBadgeOrder(badgeName: string): number | undefined {
	const badge = BADGES.find(b => b.badgeName === badgeName);
	return badge?.order;
}

export function getAllBadgeNames(): string[] {
	return BADGES.map(b => b.badgeName);
}

export function isValidBadge(badgeName: string): boolean {
	return BADGES.some(b => b.badgeName === badgeName);
}

export const FIRST_BADGE_NAME = BADGES[0]?.badgeName;
export const LAST_BADGE_NAME = BADGES[BADGES.length - 1]?.badgeName;

// ============================================================================
// STORY EVENTS
// ============================================================================

export interface StoryEvent {
	id: string;
	name: string;
	description: string;
	trigger: 'location_enter' | 'trainer_defeat' | 'badge_obtain' | 'manual';
	location?: string;
	trainerId?: string;
	badgeName?: string;
	flagsRequired?: string[];
	flagsSet?: string[];
	dialogue?: string;
}

export const STORY_EVENTS: Record<string, StoryEvent> = {
	// Add your story events here
	// Example:
	// 'first_rival_battle': {
	//   id: 'first_rival_battle',
	//   name: 'First Rival Battle',
	//   description: 'Your first battle with your rival',
	//   trigger: 'location_enter',
	//   location: 'route1',
	//   flagsRequired: ['got_starter'],
	//   flagsSet: ['rival_battle_1_complete'],
	//   dialogue: 'Your rival challenges you to a battle!',
	// },
};
