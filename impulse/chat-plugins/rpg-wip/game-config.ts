/*
* Pokemon Showdown
* RPG Game Configuration
*
* This file holds all the "Magic Numbers" and constants for the game.
* Modify this file to change the starting state without touching the engine code.
*/

export const GameConfig = {
	// Starting State
	startLocationId: 'startertown',
	startMoney: 5000,
	startInventory: [
		{ id: 'pokeball', quantity: 5 },
		{ id: 'potion', quantity: 3 }
	],
	
	// Defaults
	defaultMoves: ['tackle', 'growl'],
	levelCap: 100,

	// Special Narrative IDs
	// Used by the battle engine to trigger credits/story flags
	specialIds: {
		champion: 'championblue', // The ID of the trainer that triggers game completion
		rivals: ['rival1', 'rival2', 'rival3'],
	},

	// Wild Pokemon Generation
	wildHeldItems: [
		'oranberry', 'sitrusberry', 'leftovers', 'rockyhelmet', 
		'chopleberry', 'yacheberry', 'keberry', 'marangaberry', 
		'stickybarb', 'toxicorb'
	],
	shinyChance: 1 / 4096,

	assets: {
        // Base URL for sprites (Gen 5 Animated is standard for Showdown)
        spriteBaseUrl: 'https://play.pokemonshowdown.com/sprites/gen5/',
        spriteBackUrl: 'https://play.pokemonshowdown.com/sprites/gen5-back/',
        shinySpriteBaseUrl: 'https://play.pokemonshowdown.com/sprites/gen5-shiny/',
        shinySpriteBackUrl: 'https://play.pokemonshowdown.com/sprites/gen5-back-shiny/',
        
        // Icon for generic items (if specific sprite not found)
        itemIconUrl: 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/ball/',
        
        // Background image for battles
        battleBackgroundUrl: 'https://i.ibb.co/6RQXD1Xx/pokemon-swsh-route-5-by-phoenixoflight92-de33uqj-350t.jpg',
        darkBattleBackgroundUrl: 'https://i.ibb.co/RGyJczN6/de33uyt-aab270ae-87c5-4511-89a9-05f39dcb1de8.jpg',
	}
};
