// Data for computer-generated teams

export const MOVE_PAIRINGS: {[moveID: string]: string} = {
	rest: 'sleeptalk',
	sleeptalk: 'rest',
};

// Bonuses to move ratings by ability
export const ABILITY_MOVE_BONUSES: {[abilityID: string]: {[moveID: string]: number}} = {
	drought: {sunnyday: 0.2, solarbeam: 2},
};
// Bonuses to move ratings by move type
export const ABILITY_MOVE_TYPE_BONUSES: {[abilityID: string]: {[typeID: string]: number}} = {
	darkaura: {Dark: 1.33},
	fairyaura: {Fairy: 1.33},

	// -ate moves
	pixilate: {Normal: 1.5 * 1.2},
	refrigerate: {Normal: 1.5 * 1.2},
	aerilate: {Normal: 1.5 * 1.2},
	normalize: {Normal: 1.2},

	// weather
	drizzle: {Water: 1.4, Fire: 0.6},
	drought: {Fire: 1.4, Water: 0.6},
};
// For moves whose quality isn't obvious from data
// USE SPARINGLY!
export const HARDCODED_MOVE_WEIGHTS: {[moveID: string]: number} = {
	// Fails unless user is asleep
	snore: 0,
	// Hard to use
	lastresort: 0.1, dreameater: 0.1,
	// Useless without Berry + sucks even then
	belch: 0.2,

	// Power increases in conditions within our control
	acrobatics: 1.75, // not 2 because of the opportunity cost of forgoing an item
	facade: 1.5, // not 2 because we forgo an item AND get badly poisoned

	// Power increases in conditions out of our control that may occur
	avalanche: 1.2,
	hex: 1.2,

	// screens
	lightscreen: 1.5, reflect: 1.5, auroraveil: 1.5, // TODO: make sure AVeil always gets Snow?

	// hazard removal
	defog: 1.2, rapidspin: 1.2,

	// mess with the opponent
	taunt: 1.5, disable: 1.5, encore: 1.5,

	// healing moves
	// TODO: should healing moves be more common on bulkier pokemon?
	// 25%
	junglehealing: 1.5, lifedew: 1.5,
	// 50%
	milkdrink: 2.5, moonlight: 2.5, morningsun: 2.5, recover: 2.5, roost: 2.5,
	shoreup: 2.5, slackoff: 2.5, softboiled: 2.5, synthesis: 2.5,
	// delayed/consequence
	rest: 2.5, // has sleeptalk potential
	wish: 2,

	// requires terrain
	steelroller: 0.1,
};

export const WEIGHT_BASED_MOVES = ['heatcrash', 'heavyslam', 'lowkick', 'grassknot'];
export const SPEED_BASED_MOVES = ['gyroball', 'electroball'];
