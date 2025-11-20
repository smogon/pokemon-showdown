/*
* Pokemon Showdown
* RPG Game Configuration
*
* This file holds all the "Magic Numbers" and constants for the game.
* Modify this file to change the starting state without touching the engine code.
*/

export const GameConfig = {
	// Starting State
	startLocationId: 'start_room', // Matches locations.ts
	startMoney: 3000,
	startInventory: [
		{ id: 'pokeball', quantity: 5 },
		{ id: 'potion', quantity: 5 }
	],
	
	// Defaults
	defaultMoves: ['tackle', 'growl'],
	levelCap: 100,

	// Special Narrative IDs
	specialIds: {
		champion: 'final_boss', 
		rivals: [],
	},

	// Wild Pokemon Generation
	wildHeldItems: ['oranberry'],
	shinyChance: 1 / 4096,

    // Assets & UI
    assets: {
        spriteBaseUrl: 'https://play.pokemonshowdown.com/sprites/gen5/',
        spriteBackUrl: 'https://play.pokemonshowdown.com/sprites/gen5-back/',
        shinySpriteBaseUrl: 'https://play.pokemonshowdown.com/sprites/gen5-shiny/',
        shinySpriteBackUrl: 'https://play.pokemonshowdown.com/sprites/gen5-back-shiny/',
        itemIconUrl: 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/ball/',
        battleBackgroundUrl: 'https://play.pokemonshowdown.com/fx/bg-forest.png', 
        darkBattleBackgroundUrl: 'https://play.pokemonshowdown.com/fx/bg-forest-dark.png',
    }
};
