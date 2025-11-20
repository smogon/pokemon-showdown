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
	professoroak: {
		id: 'professoroak',
		name: 'Professor Oak',
		location: 'pallettown',
		dialogue: "Welcome! The world of Pokemon awaits! Choose your starter wisely!",
		action: {
			type: 'choosestarter',
			starterLevel: 5,
			onceOnly: true,
		},
	},
	bill: {
		id: 'bill',
		name: 'Bill',
		location: 'route25',
		dialogue: "Thanks for helping me! Take this S.S. Ticket as a reward!",
		action: {
			type: 'giveitem',
			itemId: 'ssticket',
			onceOnly: true,
		},
	},
	professorelm: {
		id: 'professorelm',
		name: 'Professor Elm',
		location: 'newbarktown',
		dialogue: "Welcome to Johto! Your journey continues here!",
		action: {
			type: 'dialogue',
		},
	},
};

// ============================================================================
// TRAINERS
// ============================================================================

export const TRAINER_DATABASE: Record<string, TrainerSpec> = {
	// Kanto Gym Leaders
	brock: {
		name: 'Brock (Boulder Badge)',
		money: 1400,
		party: [
			{ species: 'geodude', level: 12, moves: ['tackle', 'defensecurl', 'rockthrow'] },
			{ species: 'onix', level: 14, moves: ['tackle', 'screech', 'bind', 'rockthrow'] },
		],
		dialogue: {
			start: "I'm Brock! I'm Pewter's Gym Leader! My rock-hard will shall overcome!",
			win: "I took you for granted. Here is the Boulder Badge!",
			lose: "Your Pokemon's powerful attacks overcame my rock-hard defense!",
		},
	},
	misty: {
		name: 'Misty (Cascade Badge)',
		money: 1800,
		party: [
			{ species: 'staryu', level: 18, moves: ['tackle', 'harden', 'watergun', 'rapidspin'] },
			{ species: 'starmie', level: 21, moves: ['tackle', 'watergun', 'rapidspin', 'recover'] },
		],
		dialogue: {
			start: "I'm Misty! Cerulean's Gym Leader! Prepare to get soaked!",
			win: "Wow! You're too much! Here's the Cascade Badge!",
			lose: "You really know your stuff! Take this!",
		},
	},
	surge: {
		name: 'Lt. Surge (Thunder Badge)',
		money: 2400,
		party: [
			{ species: 'voltorb', level: 21, moves: ['tackle', 'screech', 'sonicboom', 'spark'] },
			{ species: 'pikachu', level: 18, moves: ['quickattack', 'thunderwave', 'spark', 'slam'] },
			{ species: 'raichu', level: 24, moves: ['thundershock', 'thunderwave', 'slam', 'thunderbolt'] },
		],
		dialogue: {
			start: "Ten-hut! Lt. Surge, the Lightning American, here! You want to battle me?",
			win: "Amazing! You're strong! Take the Thunder Badge!",
			lose: "A shocking defeat! You're electrifying!",
		},
	},
	erika: {
		name: 'Erika (Rainbow Badge)',
		money: 2800,
		party: [
			{ species: 'victreebel', level: 29, moves: ['poisonpowder', 'acid', 'razorleaf', 'sleeppowder'] },
			{ species: 'tangela', level: 24, moves: ['bind', 'poisonpowder', 'vinewhip', 'growth'] },
			{ species: 'vileplume', level: 29, moves: ['poisonpowder', 'stunspore', 'acid', 'petalblizzard'] },
		],
		dialogue: {
			start: "Hello... Lovely weather, isn't it? It's so pleasant... I'm Erika, the Gym Leader.",
			win: "Oh! I concede defeat... You are remarkably strong. Take this Rainbow Badge.",
			lose: "Nature always wins... Such is the law of the world.",
		},
	},
	koga: {
		name: 'Koga (Soul Badge)',
		money: 3200,
		party: [
			{ species: 'koffing', level: 37, moves: ['tackle', 'smokescreen', 'sludge', 'selfdestruct'] },
			{ species: 'muk', level: 39, moves: ['poisongas', 'sludge', 'minimize', 'sludgebomb'] },
			{ species: 'koffing', level: 37, moves: ['tackle', 'smokescreen', 'sludge', 'selfdestruct'] },
			{ species: 'weezing', level: 43, moves: ['tackle', 'sludge', 'smokescreen', 'sludgebomb'] },
		],
		dialogue: {
			start: "Fwahahaha! A mere child like you dares to challenge me? Poison is the ultimate weapon!",
			win: "Humph! You have proven your worth. Here is the Soul Badge!",
			lose: "Poison techniques are the way of the ninja!",
		},
	},
	sabrina: {
		name: 'Sabrina (Marsh Badge)',
		money: 3600,
		party: [
			{ species: 'kadabra', level: 38, moves: ['psybeam', 'reflect', 'futuresight', 'psyshock'] },
			{ species: 'mrmine', level: 37, moves: ['confusion', 'barrier', 'psywave', 'dazzlinggleam'] },
			{ species: 'venomoth', level: 38, moves: ['psybeam', 'supersonic', 'poisonpowder', 'gust'] },
			{ species: 'alakazam', level: 43, moves: ['psybeam', 'recover', 'psychic', 'futuresight'] },
		],
		dialogue: {
			start: "I had a vision of your arrival. I have had psychic powers since I was a child.",
			win: "I'm shocked! Your power exceeds my vision. Take the Marsh Badge.",
			lose: "Your mind cannot overcome mine!",
		},
	},
	blaine: {
		name: 'Blaine (Volcano Badge)',
		money: 4000,
		party: [
			{ species: 'growlithe', level: 42, moves: ['ember', 'leer', 'takedown', 'flamethrower'] },
			{ species: 'ponyta', level: 40, moves: ['ember', 'stomp', 'firespin', 'bounce'] },
			{ species: 'rapidash', level: 42, moves: ['ember', 'stomp', 'firespin', 'flareblitz'] },
			{ species: 'arcanine', level: 47, moves: ['takedown', 'fireblast', 'extremespeed', 'crunch'] },
		],
		dialogue: {
			start: "Hah! I am Blaine! I am the Leader of Cinnabar Gym! My fiery Pokemon will incinerate all challengers!",
			win: "I have burned out! You have earned the Volcano Badge!",
			lose: "Fire always triumphs!",
		},
	},
	giovanni: {
		name: 'Giovanni (Earth Badge)',
		money: 5000,
		party: [
			{ species: 'rhyhorn', level: 45, moves: ['stomp', 'earthquake', 'rockslide', 'takedown'] },
			{ species: 'dugtrio', level: 42, moves: ['dig', 'slash', 'earthquake', 'sandstorm'] },
			{ species: 'nidoqueen', level: 44, moves: ['bodyslam', 'earthquake', 'poisonsting', 'thunderbolt'] },
			{ species: 'nidoking', level: 45, moves: ['bodyslam', 'earthquake', 'megahorn', 'icebeam'] },
			{ species: 'rhydon', level: 50, moves: ['earthquake', 'rockslide', 'megahorn', 'stoneedge'] },
		],
		dialogue: {
			start: "Welcome to my Gym! I am Giovanni, the Gym Leader! For your insolence, I will crush you!",
			win: "Ha! That was a truly intense fight. You have won! Take the Earth Badge!",
			lose: "Team Rocket's glory shall never fade!",
		},
	},

	// Johto Gym Leaders
	falkner: {
		name: 'Falkner (Zephyr Badge)',
		money: 1400,
		party: [
			{ species: 'pidgey', level: 57, moves: ['gust', 'sandattack', 'quickattack', 'wingattack'] },
			{ species: 'pidgeotto', level: 60, moves: ['gust', 'quickattack', 'wingattack', 'aerialace'] },
		],
		dialogue: {
			start: "I'm Falkner! Violet's Gym Leader! I'll show you the magnificent power of my Bird Pokemon!",
			win: "I understand... Here's the Zephyr Badge.",
			lose: "My Flying Pokemon soar above all!",
		},
	},
	bugsy: {
		name: 'Bugsy (Hive Badge)',
		money: 1600,
		party: [
			{ species: 'metapod', level: 59, moves: ['harden', 'tackle'] },
			{ species: 'kakuna', level: 59, moves: ['harden', 'poisonsting'] },
			{ species: 'scyther', level: 64, moves: ['quickattack', 'slash', 'uturn', 'aerialace'] },
		],
		dialogue: {
			start: "I'm Bugsy! Azalea's Gym Leader! Bug Pokemon are deep and profound!",
			win: "Whoa, amazing! You're an expert on Pokemon! Take the Hive Badge!",
			lose: "Bug Pokemon rule the world!",
		},
	},
	whitney: {
		name: 'Whitney (Plain Badge)',
		money: 2000,
		party: [
			{ species: 'clefairy', level: 63, moves: ['doubleslap', 'encore', 'metronome', 'bodyslam'] },
			{ species: 'miltank', level: 67, moves: ['rollout', 'bodyslam', 'attract', 'stomp'] },
		],
		dialogue: {
			start: "I'm Whitney! Everyone was into Pokemon, so I got into it too! I'm cute, strong, and I cry sometimes!",
			win: "Waaah! You're too strong! Take the Plain Badge!",
			lose: "Cuteness is power!",
		},
	},
	morty: {
		name: 'Morty (Fog Badge)',
		money: 2400,
		party: [
			{ species: 'gastly', level: 66, moves: ['curse', 'hypnosis', 'lick', 'shadowball'] },
			{ species: 'haunter', level: 66, moves: ['curse', 'hypnosis', 'shadowpunch', 'shadowball'] },
			{ species: 'gengar', level: 70, moves: ['hypnosis', 'shadowball', 'sludgebomb', 'dreameater'] },
			{ species: 'haunter', level: 66, moves: ['curse', 'hypnosis', 'shadowpunch', 'shadowball'] },
		],
		dialogue: {
			start: "I'm Morty, of Ecruteak. I see what others cannot. I have foreseen that you would come.",
			win: "I'm not good enough yet... Here, take the Fog Badge.",
			lose: "My visions are absolute!",
		},
	},
	jasmine: {
		name: 'Jasmine (Mineral Badge)',
		money: 2800,
		party: [
			{ species: 'magnemite', level: 68, moves: ['thundershock', 'supersonic', 'sonicboom', 'thunderwave'] },
			{ species: 'magnemite', level: 68, moves: ['thundershock', 'supersonic', 'sonicboom', 'thunderwave'] },
			{ species: 'steelix', level: 73, moves: ['screech', 'rockthrow', 'ironta il', 'crunch'] },
		],
		dialogue: {
			start: "Thank you for helping Amphy... I'm Jasmine, the Gym Leader. I use the Steel-type.",
			win: "You are a truly strong trainer. Please take the Mineral Badge.",
			lose: "Steel Pokemon are resilient!",
		},
	},
	chuck: {
		name: 'Chuck (Storm Badge)',
		money: 3000,
		party: [
			{ species: 'primeape', level: 69, moves: ['karatechop', 'rage', 'seismictoss', 'crosschop'] },
			{ species: 'poliwrath', level: 72, moves: ['surf', 'bodyslam', 'submission', 'dynamicpunch'] },
		],
		dialogue: {
			start: "WAHAHA! I'm Chuck! The Fighting-type Gym Leader! Let's get physical!",
			win: "Wha? Huh? I lost! Here, take the Storm Badge!",
			lose: "Fighting spirit conquers all!",
		},
	},
	pryce: {
		name: 'Pryce (Glacier Badge)',
		money: 3200,
		party: [
			{ species: 'seel', level: 70, moves: ['icebeam', 'headbutt', 'aurorabeam', 'rest'] },
			{ species: 'dewgong', level: 70, moves: ['icebeam', 'surf', 'aurorabeam', 'rest'] },
			{ species: 'piloswine', level: 74, moves: ['earthquake', 'iceshard', 'blizzard', 'amnesia'] },
		],
		dialogue: {
			start: "I am Pryce, the winter trainer. I have trained in the cold for 30 years!",
			win: "Your passion for Pokemon melted my icy heart! Take the Glacier Badge!",
			lose: "Ice is the ultimate defense!",
		},
	},
	clair: {
		name: 'Clair (Rising Badge)',
		money: 4000,
		party: [
			{ species: 'dragonair', level: 73, moves: ['surf', 'slam', 'dragonbreath', 'thunderwave'] },
			{ species: 'dragonair', level: 73, moves: ['icebeam', 'slam', 'dragonbreath', 'thunderwave'] },
			{ species: 'dragonair', level: 73, moves: ['fireblast', 'slam', 'dragonbreath', 'thunderwave'] },
			{ species: 'kingdra', level: 78, moves: ['surf', 'smokescreen', 'dragonbreath', 'hydropump'] },
		],
		dialogue: {
			start: "I am Clair. The world's best dragon trainer! You will not defeat my dragons!",
			win: "I can't believe it... You're strong. Take the Rising Badge.",
			lose: "Dragon types are supreme!",
		},
	},

	// Regular Trainers
	youngsterjoey: {
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
	// Kanto Badges (0-7, order 1-8)
	{ gymLeaderId: 'brock', badgeName: 'Boulder Badge', order: 1, description: 'Pewter City - Rock Badge' },
	{ gymLeaderId: 'misty', badgeName: 'Cascade Badge', order: 2, description: 'Cerulean City - Water Badge' },
	{ gymLeaderId: 'surge', badgeName: 'Thunder Badge', order: 3, description: 'Vermilion City - Electric Badge' },
	{ gymLeaderId: 'erika', badgeName: 'Rainbow Badge', order: 4, description: 'Celadon City - Grass Badge' },
	{ gymLeaderId: 'koga', badgeName: 'Soul Badge', order: 5, description: 'Fuchsia City - Poison Badge' },
	{ gymLeaderId: 'sabrina', badgeName: 'Marsh Badge', order: 6, description: 'Saffron City - Psychic Badge' },
	{ gymLeaderId: 'blaine', badgeName: 'Volcano Badge', order: 7, description: 'Cinnabar Island - Fire Badge' },
	{ gymLeaderId: 'giovanni', badgeName: 'Earth Badge', order: 8, description: 'Viridian City - Ground Badge' },
	
	// Johto Badges (8-15, order 9-16)
	{ gymLeaderId: 'falkner', badgeName: 'Zephyr Badge', order: 9, description: 'Violet City - Flying Badge' },
	{ gymLeaderId: 'bugsy', badgeName: 'Hive Badge', order: 10, description: 'Azalea Town - Bug Badge' },
	{ gymLeaderId: 'whitney', badgeName: 'Plain Badge', order: 11, description: 'Goldenrod City - Normal Badge' },
	{ gymLeaderId: 'morty', badgeName: 'Fog Badge', order: 12, description: 'Ecruteak City - Ghost Badge' },
	{ gymLeaderId: 'jasmine', badgeName: 'Mineral Badge', order: 13, description: 'Olivine City - Steel Badge' },
	{ gymLeaderId: 'chuck', badgeName: 'Storm Badge', order: 14, description: 'Cianwood City - Fighting Badge' },
	{ gymLeaderId: 'pryce', badgeName: 'Glacier Badge', order: 15, description: 'Mahogany Town - Ice Badge' },
	{ gymLeaderId: 'clair', badgeName: 'Rising Badge', order: 16, description: 'Blackthorn City - Dragon Badge' },
	
	// Future regions (Hoenn through Paldea) would continue here
	// Total of 72 badges across all 9 regions
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
