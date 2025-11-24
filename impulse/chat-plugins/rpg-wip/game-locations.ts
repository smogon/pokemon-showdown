import type { NPCData, TrainerSpec } from './interface';

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
		dialogue: "The Rocket Hideout is to the East. It's dangerous!",
	},
	'dojoguide': {
		id: 'dojoguide',
		name: 'Dojo Guide',
		location: 'newbarktown',
		dialogue: "The Master uses Fighting-type Pokémon. Flying and Psychic moves are your best bet!",
	},
	'towerguide': {
		id: 'towerguide',
		name: 'Medium',
		location: 'hauntedtower1f',
		dialogue: "Spirits roam these halls...",
	},
	'scaredgrunt': {
		id: 'scaredgrunt',
		name: 'Terrified Grunt',
		location: 'rockethideoutb1',
		dialogue: "I'm not fighting! I just want to go home! The boss is on B5!",
	}
};

// ============================================================================
// TRAINERS
// ============================================================================

export const TRAINER_DATABASE: Record<string, TrainerSpec> = {
	// --- TOWN / DOJO ---
	'securitybob': {
		name: 'Security Bob',
		money: 100,
		party: [{ species: 'machop', level: 5, moves: ['karatechop', 'leer'] }],
		dialogue: { start: "Halt! Defeat me to enter!", win: "Fine, pass.", lose: "Train more." },
		setFlag: 'securitycleared', 
	},
	'blackbelt': {
		name: 'Black Belt Aaron',
		money: 200,
		party: [{ species: 'tyrogue', level: 7, moves: ['tackle', 'fakeout'] }],
		dialogue: { start: "Fight me!", win: "You're tough.", lose: "Train harder!" }
	},
	'dojomaster': {
		name: 'Master Ken',
		money: 1000,
		party: [
			{ species: 'riolu', level: 8, moves: ['quickattack', 'forcepalm'] },
			{ species: 'mankey', level: 9, moves: [ 'scratch', 'lowkick'] },
		],
		dialogue: { start: "Show me your strength!", win: "Excellent!", lose: "Disappointing." },
		setFlag: 'masterdefeated',
	},

	// --- ROCKET HIDEOUT ---
	// B1
	'rocketgruntb11': {
		name: 'Rocket Grunt (Door)',
		money: 400,
		party: [{ species: 'rattata', level: 10, moves: ['tackle', 'quickattack'] }],
		dialogue: { start: "Intruder!", win: "I'll alert the others...", lose: "Radio broken!" },
		setFlag: 'beatrocketb11',
	},
	'rocketgruntb12': {
		name: 'Rocket Grunt (Hall)',
		money: 400,
		party: [{ species: 'zubat', level: 10, moves: ['leechlife', 'supersonic'] }],
		dialogue: { start: "No entry!", win: "Pass then.", lose: "For Team Rocket!" },
		setFlag: 'beatrocketb12',
	},
	// B2
	'rocketgruntb21': {
		name: 'Rocket Grunt (Lab)',
		money: 500,
		party: [{ species: 'koffing', level: 12, moves: ['smog', 'tackle'] }],
		dialogue: { start: "Restricted area!", win: "Cough...", lose: "Too much smog." },
		setFlag: 'beatrocketb21',
	},
	'rocketgruntb22': {
		name: 'Rocket Grunt (Guard)',
		money: 500,
		party: [{ species: 'ekans', level: 12, moves: ['wrap', 'poisonsting'] }],
		dialogue: { start: "Scram!", win: "Hiss...", lose: "Slither away!" },
		setFlag: 'beatrocketb22',
	},
	// B3
	'rocketgruntb31': {
		name: 'Rocket Elite',
		money: 600,
		party: [{ species: 'raticate', level: 14, moves: ['hyperfang'] }],
		dialogue: { start: "You're annoying!", win: "Whatever.", lose: "Go away." },
		setFlag: 'beatrocketb31',
	},
	// B4 (Admin)
	'rocketadmin': {
		name: 'Admin Proton',
		money: 1500,
		party: [
			{ species: 'zubat', level: 16, moves: ['wingattack', 'confuseray'] },
			{ species: 'koffing', level: 16, moves: ['sludge', 'smokescreen'] }
		],
		dialogue: { start: "You won't reach the boss!", win: "The boss is stronger.", lose: "I failed!" },
		setFlag: 'beatrocketadmin',
	},
	// B5 (Boss)
	'rocketboss': {
		name: 'Boss Giovanni',
		money: 5000,
		party: [
			{ species: 'onix', level: 20, moves: ['rockthrow', 'bind', 'screech'] },
			{ species: 'rhyhorn', level: 20, moves: ['horndrill', 'stomp'] },
			{ species: 'kangaskhan', level: 22, moves: ['megapunch', 'bite', 'tailwhip'], item: 'sitrusberry' }
		],
		dialogue: {
			start: "Your journey ends here!",
			win: "Team Rocket is blasting off again!",
			lose: "Impossible.",
		},
		setFlag: ['beatrocketboss', 'rockethideoutcleared'],
	},

	// --- HAUNTED TOWER ---
	'channelerhope': {
		name: 'Channeler Hope',
		money: 300,
		party: [{ species: 'gastly', level: 15, moves: ['lick', 'spite'] }],
		dialogue: { start: "Kekeke...", win: "Restless spirits...", lose: "..." },
		setFlag: 'beatchanneler1',
	},
	'sagekoji': {
		name: 'Sage Koji',
		money: 300,
		party: [{ species: 'hoothoot', level: 16, moves: ['hypnosis', 'peck'] }],
		dialogue: { start: "Begone!", win: "You are strong.", lose: "Leave now." },
		setFlag: 'beatsage1',
	}
};

// ============================================================================
// TRAINER LOCATIONS
// ============================================================================

export const TRAINER_LOCATIONS: Record<string, string[]> = {
	'newbarktown': ['securitybob'],
	'fightingdojo': ['blackbelt'],
	
	'rockethideoutb1': ['rocketgruntb11', 'rocketgruntb12'],
	'rockethideoutb2': ['rocketgruntb21', 'rocketgruntb22'],
	'rockethideoutb3': ['rocketgruntb31'],
	'rockethideoutb4': ['rocketadmin'],
	'rockethideoutb5': ['rocketboss'],
	
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

export const TOTAL_BADGES = BADGES.length;

export function getBadgeForGymLeader(gymLeaderId: string) {
	const badge = BADGES.find(b => b.gymLeaderId === gymLeaderId);
	return badge?.badgeName;
}

export function getGymLeaderForBadge(badgeName: string) {
	const badge = BADGES.find(b => b.badgeName === badgeName);
	return badge?.gymLeaderId;
}

export function getBadgeOrder(badgeName: string) {
	const badge = BADGES.find(b => b.badgeName === badgeName);
	return badge?.order;
}

export function getAllBadgeNames() {
	return BADGES.map(b => b.badgeName);
}

export function isValidBadge(badgeName: string) {
	return BADGES.some(b => b.badgeName === badgeName);
}

export const FIRST_BADGE_NAME = BADGES[0]?.badgeName;
export const LAST_BADGE_NAME = BADGES[BADGES.length - 1]?.badgeName;

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
