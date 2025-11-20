/*
* Pokemon Showdown
* RPG NPCs Data
*/

import type { NPCData } from './interface';

export const NPC_DATABASE: Record<string, NPCData> = {
	'guide': {
		id: 'guide',
		name: 'Travel Guide',
		location: 'startingroom', // [CHANGED] Updated to match new ID
		dialogue: "Hello! Welcome to this new world. It's dangerous to go alone, take one of these!",
		action: {
			type: 'choosestarter',
			starterLevel: 5,
			onceOnly: true,
		},
	},
};
