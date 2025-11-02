/**
 * Custom Moves for Pokemon RPG
 * 
 * This file defines custom moves that extend beyond the standard Pokemon Showdown Dex.
 * Moves are defined in the same format as Dex moves for compatibility.
 * 
 * Move Properties Reference:
 * - id: string (lowercase, no spaces)
 * - name: string (Display name)
 * - basePower: number (0 for status moves)
 * - category: 'Physical' | 'Special' | 'Status'
 * - type: string (Pokemon type)
 * - accuracy: number | true (true = never misses)
 * - pp: number (Power Points)
 * - priority: number (0 = normal, higher = faster, negative = slower)
 * - target: string (see TARGET_OPTIONS below)
 * - flags: object (see FLAG_OPTIONS below)
 * - secondary?: object (secondary effects with chance)
 * - boosts?: object (stat changes)
 * - status?: string (status to inflict: 'psn', 'brn', 'par', 'slp', 'frz')
 * - volatileStatus?: string (volatile status: 'confusion', 'flinch', etc.)
 * - drain?: [number, number] (heal ratio e.g., [1, 2] = heal 1/2 damage)
 * - recoil?: [number, number] (recoil ratio e.g., [1, 4] = 1/4 recoil)
 * - heal?: [number, number] (heal ratio e.g., [1, 2] = heal 1/2 max HP)
 * - multihit?: number | [number, number] (hit multiple times)
 * - weather?: string ('sun', 'rain', 'sand', 'hail')
 * - terrain?: string ('electric', 'grassy', 'psychic', 'misty')
 * - pseudoWeather?: string ('trickroom', 'magicroom', 'wonderroom', 'gravity')
 * - sideCondition?: string ('spikes', 'toxicspikes', 'stealthrock', 'stickyweb')
 * - selfSwitch?: true | 'copyvolatile' (U-turn, Baton Pass)
 * - ohko?: string (OHKO type: 'Normal', 'Ice')
 * - breaksProtect?: boolean (ignores Protect/Detect)
 * - self?: object (effects on user)
 */

export interface CustomMove {
	id: string;
	name: string;
	basePower: number;
	category: 'Physical' | 'Special' | 'Status';
	type: string;
	accuracy: number | true;
	pp: number;
	priority: number;
	target: string;
	flags: {
		protect?: 1;
		mirror?: 1;
		contact?: 1;
		charge?: 1;
		sound?: 1;
		powder?: 1;
		punch?: 1;
		bite?: 1;
		heal?: 1;
		metronome?: 1;
	};
	secondary?: {
		chance?: number;
		status?: string;
		volatileStatus?: string;
		boosts?: Record<string, number>;
	};
	boosts?: Record<string, number>;
	status?: string;
	volatileStatus?: string;
	drain?: [number, number];
	recoil?: [number, number];
	heal?: [number, number];
	multihit?: number | [number, number];
	weather?: string;
	terrain?: string;
	pseudoWeather?: string;
	sideCondition?: string;
	selfSwitch?: true | 'copyvolatile';
	selfdestruct?: 'always' | 'ifHit';
	ohko?: string;
	breaksProtect?: boolean;
	self?: {
		boosts?: Record<string, number>;
		volatileStatus?: string;
	};
}

/**
 * TARGET OPTIONS:
 * - 'normal': Single adjacent target
 * - 'any': Any single Pokemon
 * - 'self': User only
 * - 'allAdjacentFoes': Both adjacent opponents (doubles)
 * - 'allAdjacent': All adjacent Pokemon (doubles)
 * - 'scripted': All Pokemon but user (like Earthquake)
 * - 'ally': Single ally (doubles)
 * - 'allySide': User's entire team
 * - 'foeSide': Opponent's entire team
 * - 'all': All Pokemon in battle
 */

/**
 * Custom Moves Database
 * Add your custom moves here!
 */
export const CUSTOM_MOVES: Record<string, CustomMove> = {
	// Example 1: Custom Physical Attack
	'shadowstrike': {
		id: 'shadowstrike',
		name: 'Shadow Strike',
		basePower: 85,
		category: 'Physical',
		type: 'Dark',
		accuracy: 100,
		pp: 15,
		priority: 0,
		target: 'normal',
		flags: { protect: 1, mirror: 1, contact: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
	},

	// Example 2: Custom Special Attack with Stat Drop
	'voidblast': {
		id: 'voidblast',
		name: 'Void Blast',
		basePower: 90,
		category: 'Special',
		type: 'Psychic',
		accuracy: 100,
		pp: 10,
		priority: 0,
		target: 'normal',
		flags: { protect: 1, mirror: 1 },
		secondary: {
			chance: 20,
			boosts: {
				spa: -1,
			},
		},
	},

	// Example 3: Custom Status Move
	'cosmicshield': {
		id: 'cosmicshield',
		name: 'Cosmic Shield',
		basePower: 0,
		category: 'Status',
		type: 'Psychic',
		accuracy: true,
		pp: 10,
		priority: 0,
		target: 'self',
		flags: {},
		boosts: {
			def: 2,
			spd: 1,
		},
	},

	// Example 4: Custom Healing Move
	'moongrace': {
		id: 'moongrace',
		name: 'Moon Grace',
		basePower: 0,
		category: 'Status',
		type: 'Fairy',
		accuracy: true,
		pp: 5,
		priority: 0,
		target: 'self',
		flags: { heal: 1 },
		heal: [1, 2], // Heals 50% HP
	},

	// Example 5: Custom Multi-Hit Move
	'rapidfire': {
		id: 'rapidfire',
		name: 'Rapid Fire',
		basePower: 25,
		category: 'Special',
		type: 'Fire',
		accuracy: 95,
		pp: 10,
		priority: 0,
		target: 'normal',
		flags: { protect: 1, mirror: 1 },
		multihit: [2, 5], // Hits 2-5 times
	},

	// Example 6: Custom Priority Move
	'quickslash': {
		id: 'quickslash',
		name: 'Quick Slash',
		basePower: 40,
		category: 'Physical',
		type: 'Steel',
		accuracy: 100,
		pp: 30,
		priority: 1, // +1 priority like Quick Attack
		target: 'normal',
		flags: { protect: 1, mirror: 1, contact: 1 },
	},

	// Example 7: Custom Drain Move
	'lifedrain': {
		id: 'lifedrain',
		name: 'Life Drain',
		basePower: 75,
		category: 'Special',
		type: 'Ghost',
		accuracy: 100,
		pp: 10,
		priority: 0,
		target: 'normal',
		flags: { protect: 1, mirror: 1, heal: 1 },
		drain: [1, 2], // Heals 50% of damage dealt
	},

	// Example 8: Custom Recoil Move
	'berserkcharge': {
		id: 'berserkcharge',
		name: 'Berserk Charge',
		basePower: 120,
		category: 'Physical',
		type: 'Fighting',
		accuracy: 100,
		pp: 15,
		priority: 0,
		target: 'normal',
		flags: { protect: 1, mirror: 1, contact: 1 },
		recoil: [1, 3], // Takes 1/3 recoil damage
	},

	// Example 9: Custom Weather Move
	'mysticmist': {
		id: 'mysticmist',
		name: 'Mystic Mist',
		basePower: 0,
		category: 'Status',
		type: 'Water',
		accuracy: true,
		pp: 5,
		priority: 0,
		target: 'all',
		flags: {},
		weather: 'rain',
	},

	// Example 10: Custom Pivot Move
	'phantomswitch': {
		id: 'phantomswitch',
		name: 'Phantom Switch',
		basePower: 70,
		category: 'Special',
		type: 'Ghost',
		accuracy: 100,
		pp: 20,
		priority: 0,
		target: 'normal',
		flags: { protect: 1, mirror: 1 },
		selfSwitch: true, // Like U-turn
	},

	// Example 11: Custom Spread Move (Doubles)
	'earthquakex': {
		id: 'earthquakex',
		name: 'Earthquake X',
		basePower: 110,
		category: 'Physical',
		type: 'Ground',
		accuracy: 100,
		pp: 10,
		priority: 0,
		target: 'allAdjacent', // Hits everyone but user
		flags: { protect: 1, mirror: 1 },
	},

	// Example 12: Custom Entry Hazard
	'crystalspikes': {
		id: 'crystalspikes',
		name: 'Crystal Spikes',
		basePower: 0,
		category: 'Status',
		type: 'Ice',
		accuracy: true,
		pp: 20,
		priority: 0,
		target: 'foeSide',
		flags: { mirror: 1 },
		sideCondition: 'spikes', // Uses existing hazard system
	},

	// Example 13: Custom OHKO Move
	'dimensionalrift': {
		id: 'dimensionalrift',
		name: 'Dimensional Rift',
		basePower: 0,
		category: 'Special',
		type: 'Psychic',
		accuracy: 30,
		pp: 5,
		priority: 0,
		target: 'normal',
		flags: { protect: 1, mirror: 1 },
		ohko: 'Normal', // OHKO move
	},

	// Example 14: Custom Self-Boost Move
	'powersurge': {
		id: 'powersurge',
		name: 'Power Surge',
		basePower: 0,
		category: 'Status',
		type: 'Electric',
		accuracy: true,
		pp: 20,
		priority: 0,
		target: 'self',
		flags: {},
		boosts: {
			atk: 1,
			spa: 1,
		},
	},

	// Example 15: Custom Charging Move
	'solarflare': {
		id: 'solarflare',
		name: 'Solar Flare',
		basePower: 150,
		category: 'Special',
		type: 'Fire',
		accuracy: 90,
		pp: 5,
		priority: 0,
		target: 'normal',
		flags: { charge: 1, protect: 1, mirror: 1 }, // Two-turn move
	},
};

/**
 * Check if a move ID is a custom move
 */
export function isCustomMove(moveId: string): boolean {
	return moveId in CUSTOM_MOVES;
}

/**
 * Get a custom move by ID
 */
export function getCustomMove(moveId: string): CustomMove | null {
	return CUSTOM_MOVES[moveId] || null;
}

/**
 * Get all custom move IDs
 */
export function getAllCustomMoveIds(): string[] {
	return Object.keys(CUSTOM_MOVES);
}

/**
 * Get all custom moves
 */
export function getAllCustomMoves(): CustomMove[] {
	return Object.values(CUSTOM_MOVES);
}
