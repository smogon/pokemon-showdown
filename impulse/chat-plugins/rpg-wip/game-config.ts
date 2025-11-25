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

	startLocationId: 'newbarktown',
	startMoney: 1000000, // Increased for testing should be 3000
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
		champion: 'finalboss',
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
