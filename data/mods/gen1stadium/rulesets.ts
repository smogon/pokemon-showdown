export const Rulesets: {[k: string]: ModdedFormatData} = {
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: ['Obtainable', 'Stadium Sleep Clause', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Exact HP Mod', 'Cancel Mod'],
	},
	nintendocup1999movelegality: {
		effectType: 'ValidatorRule',
		name: 'Nintendo Cup 1999 Move Legality',
		onValidateTeam(team) {
			for (const set of team) {
				if (eventData.japan) {
					if (fastReturn) return true;
				},
			},
		},
	},
};
