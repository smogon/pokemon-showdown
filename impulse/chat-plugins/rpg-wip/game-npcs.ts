import type { NPCData, TrainerSpec } from './interface';

/**
 * Game NPCs & Story Configuration
 */

// ============================================================================
// NPCS
// ============================================================================

export const NPC_DATABASE: Record<string, NPCData> = {
	// --- New Bark Town NPCs ---
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
		dialogue: "The Rocket Hideout is to the East. It's dangerous! The Haunted Tower is to the North.",
	},
	'dojoguide': {
		id: 'dojoguide',
		name: 'Dojo Guide',
		location: 'newbarktown',
		dialogue: "Yo! Champ in the making! The Master uses Fighting-type Pokémon. Flying and Psychic moves are your best bet!",
	},

	// --- Haunted Tower NPCs ---
	'towerguide': {
		id: 'towerguide',
		name: 'Medium',
		location: 'hauntedtower1f',
		dialogue: "Spirits roam these halls... Do not disturb them unless you are strong.",
	},
	'scaredgrunt': {
		id: 'scaredgrunt',
		name: 'Terrified Grunt',
		location: 'rocket_hideout_b1',
		dialogue: "I'm not fighting! I just want to go home! The boss is on B5, just leave me alone!",
	}
};

// ============================================================================
// TRAINERS
// ============================================================================

export const TRAINER_DATABASE: Record<string, TrainerSpec> = {
	// --- New Bark Town / Dojo Trainers ---
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

	// --- ROCKET HIDEOUT FLOOR 1 ---
	'rocketgruntb11': {
		name: 'Rocket Grunt (Door)',
		money: 400,
		party: [{ species: 'rattata', level: 10, moves: ['tackle', 'quickattack'] }],
		dialogue: { start: "Intruder alert!", win: "I'll alert the others...", lose: "My radio is broken!" },
		setFlag: 'beat_rocket_b1_1', // Required for B2
	},
	'rocketgruntb12': {
		name: 'Rocket Grunt (Hall)',
		money: 400,
		party: [{ species: 'zubat', level: 10, moves: ['leechlife', 'supersonic'] }],
		dialogue: { start: "You can't go down there!", win: "Fine, pass.", lose: "Glory to Team Rocket!" },
		setFlag: 'beat_rocket_b1_2', // Required for B2
	},

	// --- ROCKET HIDEOUT FLOOR 2 ---
	'rocketgruntb21': {
		name: 'Rocket Grunt (Lab)',
		money: 500,
		party: [{ species: 'koffing', level: 12, moves: ['smog', 'tackle'] }],
		dialogue: { start: "This is a restricted area!", win: "Cough... cough...", lose: "Too much smog." },
		setFlag: 'beat_rocket_b2_1', // Required for B3
	},
	'rocketgruntb22': {
		name: 'Rocket Grunt (Guard)',
		money: 500,
		party: [{ species: 'ekans', level: 12, moves: ['wrap', 'poisonsting'] }],
		dialogue: { start: "Ssssscram!", win: "Hiss...", lose: "Slither away!" },
		setFlag: 'beat_rocket_b2_2', // Required for B3
	},

	// --- ROCKET HIDEOUT FLOOR 3 ---
	'rocketgruntb31': {
		name: 'Rocket Elite',
		money: 600,
		party: [{ species: 'raticate', level: 14, moves: ['hyperfang'] }],
		dialogue: { start: "You're annoying!", win: "Whatever.", lose: "Go away." },
		setFlag: 'beat_rocket_b3_1', // Required for B4
	},

	// --- ROCKET HIDEOUT FLOOR 4 ---
	'rocketadmin': {
		name: 'Admin Proton',
		money: 1500,
		party: [
			{ species: 'zubat', level: 16, moves: ['wingattack', 'confuseray'] },
			{ species: 'koffing', level: 16, moves: ['sludge', 'smokescreen'] }
		],
		dialogue: { start: "You won't reach the boss!", win: "The boss is stronger than me.", lose: "I failed you, sir!" },
		setFlag: 'beat_rocket_admin', // Required for B5
	},

	// --- ROCKET HIDEOUT FLOOR 5 (BOSS) ---
	'rocketboss': {
		name: 'Boss Giovanni',
		money: 5000,
		party: [
			{ species: 'onix', level: 20, moves: ['rockthrow', 'bind', 'screech'] },
			{ species: 'rhyhorn', level: 20, moves: ['horndrill', 'stomp'] },
			{ species: 'kangaskhan', level: 22, moves: ['megapunch', 'bite', 'tailwhip'], item: 'sitrusberry' }
		],
		dialogue: {
			start: "I am impressed you made it this far. But your journey ends here!",
			win: "What? This cannot be! Team Rocket is blasting off again!",
			lose: "As expected of a child.",
		},
		setFlag: ['beat_rocket_boss', 'rocket_hideout_cleared'],
	},

	// --- HAUNTED TOWER TRAINERS ---
	'channelerhope': {
		name: 'Channeler Hope',
		money: 300,
		party: [{ species: 'gastly', level: 15, moves: ['lick', 'spite'] }],
		dialogue: { start: "Kekeke...", win: "The spirits are restless.", lose: "..." },
		setFlag: 'beat_channeler_1', // Required for 3F
	},
	'sagekoji': {
		name: 'Sage Koji',
		money: 300,
		party: [{ species: 'hoothoot', level: 16, moves: ['hypnosis', 'peck'] }],
		dialogue: { start: "Begone from this sacred place.", win: "You are strong.", lose: "Leave now." },
		setFlag: 'beat_sage_1',
	}
};

// ============================================================================
// TRAINER LOCATIONS
// ============================================================================

export const TRAINER_LOCATIONS: Record<string, string[]> = {
	// Overworld
	'newbarktown': ['securitybob'],
	// Dojo
	'fightingdojo': ['blackbelt'], // Note: building IDs are used if trainers are inside a building
	
	// Rocket Hideout
	'rockethideoutb1': ['rocketgruntb11', 'rocketgruntb12'],
	'rockethideoutb2': ['rocketgruntb21', 'rocketgruntb22'],
	'rockethideoutb3': ['rocketgruntb31'],
	'rockethideoutb4': ['rocketadmin'],
	'rockethideoutb5': ['rocketboss'],
	
	// Haunted Tower
	'hauntedtower2f': ['channelerhope'],
	'hauntedtower3f': ['sagekoji'],
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
		description: 'Allows access to dangerous caves.',
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
