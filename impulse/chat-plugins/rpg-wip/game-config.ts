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
};
