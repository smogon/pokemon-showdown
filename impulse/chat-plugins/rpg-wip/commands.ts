/*
* Pokemon Showdown
* RPG Commands
*
* This is the "Controller" layer. It handles user input and calls
* functions from core, battle-engine, items, and html.
*
*/
import { commands as coreCommands } from './commands/core';
import { commands as pokemonCommands } from './commands/pokemon';
import { commands as itemCommands } from './commands/item';
import { commands as battleCommands } from './commands/battle';
import { commands as worldCommands } from './commands/world';
import { commands as playerCommands } from './commands/player';

export const commands: ChatCommands = {
	rpg: {
		...coreCommands.rpg,
		...pokemonCommands.rpg,
		...itemCommands.rpg,
		...battleCommands.rpg,
		...worldCommands.rpg,
		...playerCommands.rpg,
	},
};
