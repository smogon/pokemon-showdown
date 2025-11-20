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
		protect?: 1,
		mirror?: 1,
		contact?: 1,
		charge?: 1,
		sound?: 1,
		powder?: 1,
		punch?: 1,
		bite?: 1,
		pulse?: 1,
		bullet?: 1,
		heal?: 1,
		metronome?: 1,
	};
	secondary?: {
		chance?: number,
		status?: string,
		volatileStatus?: string,
		boosts?: Record<string, number>,
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
		boosts?: Record<string, number>,
		volatileStatus?: string,
	};
}

export const CUSTOM_MOVES: Record<string, CustomMove> = {

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
			chance: 80,
			volatileStatus: 'flinch',
		},
	},

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
		flags: { protect: 1, mirror: 1, pulse: 1 },
		secondary: {
			chance: 20,
			boosts: {
				spa: -1,
			},
		},
	},

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
		heal: [1, 2],
	},

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
		flags: { protect: 1, mirror: 1, bullet: 1 },
		multihit: [2, 5],
	},

	'quickslash': {
		id: 'quickslash',
		name: 'Quick Slash',
		basePower: 40,
		category: 'Physical',
		type: 'Steel',
		accuracy: 100,
		pp: 30,
		priority: 1,
		target: 'normal',
		flags: { protect: 1, mirror: 1, contact: 1 },
	},

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
		drain: [1, 2],
	},

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
		recoil: [1, 3],
	},

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
		selfSwitch: true,
	},

	'earthquakex': {
		id: 'earthquakex',
		name: 'Earthquake X',
		basePower: 110,
		category: 'Physical',
		type: 'Ground',
		accuracy: 100,
		pp: 10,
		priority: 0,
		target: 'allAdjacent',
		flags: { protect: 1, mirror: 1 },
	},

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
		sideCondition: 'spikes',
	},

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
		ohko: 'Normal',
	},

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
		flags: { charge: 1, protect: 1, mirror: 1 },
	},
};

export function isCustomMove(moveId: string): boolean {
	return moveId in CUSTOM_MOVES;
}

export function getCustomMove(moveId: string): CustomMove | null {
	return CUSTOM_MOVES[moveId] || null;
}

export function getAllCustomMoveIds(): string[] {
	return Object.keys(CUSTOM_MOVES);
}

export function getAllCustomMoves(): CustomMove[] {
	return Object.values(CUSTOM_MOVES);
}
