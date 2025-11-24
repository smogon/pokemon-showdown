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
	// NEW: The Gym Guide
	'dojoguide': {
		id: 'dojoguide',
		name: 'Dojo Guide',
		location: 'newbarktown', // He is physically in New Bark Town data structure, but logically inside the building
		dialogue: "Yo! Champ in the making! The Master uses Fighting-type Pokémon. Flying and Psychic moves are your best bet!",
	},
	'nursejoy': {
		id: 'nursejoy',
		name: 'Nurse Joy',
		location: 'newbarktown',
		dialogue: "Welcome to the Pokémon Center!",
		action: {
			type: 'heal',
		},
	}
};

// ============================================================================
// TRAINERS
// ============================================================================

export const TRAINER_DATABASE: Record<string, TrainerSpec> = {
	// 1. The Gatekeeper
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
		setFlag: 'security_cleared', 
	},

	// 2. The Gym Minion (NEW)
	'blackbelt': {
		name: 'Black Belt Aaron',
		money: 200,
		party: [
			{ species: 'tyrogue', level: 7, moves: ['tackle', 'fakeout'] },
		],
		dialogue: {
			start: "I'm not letting you reach the Master without a fight!",
			win: "Oof! You're tough.",
			lose: "Train harder!",
		}
	},

	// 3. The Boss
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
		setFlag: 'master_defeated',
	},
};

// ============================================================================
// TRAINER LOCATIONS
// ============================================================================

export const TRAINER_LOCATIONS: Record<string, string[]> = {
	// Trainers that appear in the OVERWORLD (not inside buildings)
	'newbarktown': ['securitybob'], 
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
		gymLeaderId: 'dojomaster',
		badgeName: 'Expert Badge',
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
