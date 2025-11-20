import type { TrainerSpec } from './interface';

export const TRAINER_DATABASE: Record<string, TrainerSpec> = {
	'youngsterjoey': {
		name: 'Youngster Joey',
		money: 200,
		party: [
			{ species: 'rattata', level: 5, moves: ['tackle', 'tailwhip'] },
		],
		dialogue: {
			start: "My Rattata is in the top percentage of Rattata!",
			win: "I'll never give up!",
			lose: "You're tough!",
		},
	},
};

export const TRAINER_LOCATIONS: Record<string, string[]> = {
	'grassypath': ['youngsterjoey'],
};
