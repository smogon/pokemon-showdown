export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		desc: "The standard ruleset for all official Smogon singles tiers (Ubers, OU, etc.)",
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Switch Priority Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Items Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Volbeat + Trick + Baton Pass', 'Seedot + Leech Seed + Quick Attack', 'Nuzleaf + Leech Seed + Quick Attack', 'Shiftry + Leech Seed + Quick Attack', 'Spheal + Curse + Rock Slide', 'Sealeo + Curse + Rock Slide', 'Walrein + Curse + Rock Slide'],
	},
};
