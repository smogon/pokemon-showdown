import type { NPCData, TrainerSpec } from './interface';

/**
 * Game NPCs & Story Configuration
 */

// ============================================================================
// NPCS
// ============================================================================

export const NPC_DATABASE: Record<string, NPCData> = {
	'professorelm': {
		id: 'professorelm',
		name: 'Professor Elm',
		location: 'newbarktown',
		dialogue: "Welcome to the lab! To start your journey, you'll need a Pokémon partner. Please, choose one!",
		action: {
			type: 'choosestarter',
			starterLevel: 5,
			onceOnly: true,
		},
	},
	'guide': {
		id: 'guide',
		name: 'Town Guide',
		location: 'newbarktown',
		dialogue: "The Dojo Master is looking for a challenger, but his guard won't let anyone in! You should go to the Lab to get a Pokémon first.",
	},
};

// ============================================================================
// TRAINERS
// ============================================================================

export const TRAINER_DATABASE: Record<string, TrainerSpec> = {
	// 1. The Gatekeeper: Defeating him unlocks the Building
	'securitybob': {
		name: 'Security Bob',
		money: 100,
		party: [
			{ species: 'machop', level: 5, moves: ['karatechop', 'leer'] },
		],
		dialogue: {
			start: "Halt! No one enters the Dojo unless they can beat me!",
			win: "Fine, you may pass.",
			lose: "Go home and train more.",
		},
		// REWARD: Sets this flag on victory
		setFlag: 'security_cleared', 
	},

	// 2. The Boss: Defeating him unlocks the Location Connection
	'dojomaster': {
		name: 'Master Ken',
		money: 1000,
		party: [
			{ species: 'riolu', level: 8, moves: ['quickattack', 'forcepalm'] },
			{ species: 'mankey', level: 9, moves: [ 'scratch', 'lowkick'] },
		],
		dialogue: {
			start: "So you got past Bob? Show me your strength!",
			win: "Excellent! You have earned the right to visit the Hidden Grove.",
			lose: "Disappointing.",
		},
		// REWARD: Sets this flag on victory
		setFlag: 'master_defeated',
	},

	// 3. The Gym Leader: Defeating him awards the Boulder Badge
	'brock': {
		name: 'Brock',
		money: 1500,
		party: [
			{ species: 'geodude', level: 12, moves: ['tackle', 'defensecurl'] },
			{ species: 'onix', level: 14, moves: ['tackle', 'bind', 'rockthrow'] },
		],
		dialogue: {
			start: "I believe in rock hard defense and determination! Show me what you've got!",
			win: "You have proven your worth. Take this Badge.",
			lose: "Your attacks are still too soft.",
		},
		// Note: Badge logic is handled automatically via the BADGES array below
	}
};

// ============================================================================
// TRAINER LOCATIONS
// ============================================================================

export const TRAINER_LOCATIONS: Record<string, string[]> = {
	// Added brock here so you can challenge him in town for testing
	'newbarktown': ['securitybob', 'brock'], 
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

// ADDED: Definition linking Brock to the Boulder Badge
export const BADGES: BadgeInfo[] = [
	{
		gymLeaderId: 'brock',
		badgeName: 'Boulder Badge',
		order: 1,
		description: 'Allows access to dark caves.',
	}
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

export const STORY_EVENTS: Record<string, StoryEvent> = {};
