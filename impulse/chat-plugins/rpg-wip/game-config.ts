/**
 * Game Configuration
 *
 * This file contains general game settings and mechanics configuration.
 *
 * For story-specific data, see:
 * - game-locations.ts - Locations and encounter zones
 * - game-npcs.ts - NPCs, trainers, trainer locations, and badges
 * - game-shops.ts - Shop inventories and item availability
 */

export const GameConfig = {

	startLocationId: 'startingroom',
	startMoney: 3000,
	startInventory: [
		{ id: 'pokeball', quantity: 5 },
		{ id: 'potion', quantity: 5 },
	],

	defaultMoves: ['tackle', 'growl'],
	// Pokemon level cap - can be adjusted between 5 and 1000, default is 100
	levelCap: 100,
	minLevelCap: 5,
	maxLevelCap: 1000,

	// Battle settings
	allowItemUsageInBattle: true, // Enable/disable using items (potions, revives, stat boosters, etc.) during battle (Poké Balls for catching are not affected)

	specialIds: {
		champion: 'final_boss',
		rivals: [],
	},

	wildHeldItems: ['oranberry'],
	shinyChance: 1 / 4096,

	assets: {
		spriteBaseUrl: 'https://play.pokemonshowdown.com/sprites/gen5/',
		spriteBackUrl: 'https://play.pokemonshowdown.com/sprites/gen5-back/',
		shinySpriteBaseUrl: 'https://play.pokemonshowdown.com/sprites/gen5-shiny/',
		shinySpriteBackUrl: 'https://play.pokemonshowdown.com/sprites/gen5-back-shiny/',
		itemIconUrl: 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/ball/',
		battleBackgroundUrl: 'https://play.pokemonshowdown.com/fx/bg-forest.png',
		darkBattleBackgroundUrl: 'https://play.pokemonshowdown.com/fx/bg-forest-dark.png',
	},
};

// ============================================================================
// STARTER POKEMON
// ============================================================================

export const STARTER_POKEMON = {
	fire: ['torchic'],
	water: ['mudkip'],
	grass: ['grookey'],
};

// ============================================================================
// FOSSIL REVIVAL
// ============================================================================

export const FOSSIL_REVIVAL_MAP: Record<string, { species: string, level: number }> = {
	'helixfossil': { species: 'omanyte', level: 20 },
	'domefossil': { species: 'kabuto', level: 20 },
	'oldamber': { species: 'aerodactyl', level: 20 },
	'rootfossil': { species: 'lileep', level: 20 },
	'clawfossil': { species: 'anorith', level: 20 },
	'skullfossil': { species: 'cranidos', level: 20 },
	'armorfossil': { species: 'shieldon', level: 20 },
	'coverfossil': { species: 'tirtouga', level: 20 },
	'plumefossil': { species: 'archen', level: 20 },
	'jawfossil': { species: 'tyrunt', level: 20 },
	'sailfossil': { species: 'amaura', level: 20 },
};

// ============================================================================
// FORTUNE TELLER MESSAGES
// ============================================================================

export const FORTUNE_TELLER_MESSAGES: Record<string, string> = {
	'luck': 'Your luck will shine today! Shiny encounter rate increased!',
	'battle': 'Victory awaits you! Battle rewards increased!',
	'catch': 'The Pokemon will come to you! Catch rate increased!',
};
