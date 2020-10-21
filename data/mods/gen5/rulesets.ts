export const Formats: {[k: string]: ModdedFormatData} = {
	standard: {
		inherit: true,
		ruleset: [
			'Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod',
		],
	},
	obtainablemoves: {
		inherit: true,
		banlist: [
			// Shell Smash: Clamperl Gen 5+ level-up
			// Sucker Punch: Huntail Gen 4 tutor
			'Huntail + Shell Smash + Sucker Punch',
		],
	},
};
