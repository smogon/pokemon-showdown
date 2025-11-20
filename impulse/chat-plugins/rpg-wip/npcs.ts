import type { NPCData } from './interface';

export const NPC_DATABASE: Record<string, NPCData> = {
	'guide': {
		id: 'guide',
		name: 'Travel Guide',
		location: 'start_room',
		dialogue: "Hello! Welcome to this new world. It's dangerous to go alone, take one of these!",
		action: {
			type: 'choosestarter',
            // Note: logic in commands.ts/npc-actions.ts reads from STARTER_POKEMON based on user input
            // but we can customize the default list in the UI if needed.
			starterLevel: 5,
			onceOnly: true,
		},
	},
};
