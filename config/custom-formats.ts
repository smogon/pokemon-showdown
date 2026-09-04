// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts
//
// Fakemon - the custom Pokemon system. Every format here runs the `fakemon`
// mod, which loads only the custom dex (see data/mods/fakemon/scripts.ts).

export const Formats: import('../sim/dex-formats').FormatList = [

	// Fakemon
	///////////////////////////////////////////////////////////////////

	{
		section: "Fakemon",
		column: 1,
	},
	{
		name: "[Fakemon] Singles",
		desc: `The custom Fakemon system, 6v6 singles. Every Pok&eacute;mon can Mega Evolve.`,
		mod: 'fakemon',
		ruleset: [
			'Fakemon Standard', 'Fakemon Mechanics', 'Standard Fakemon',
		],
	},
	{
		name: "[Fakemon] Doubles",
		desc: `The custom Fakemon system, 4v4 doubles. Every Pok&eacute;mon can Mega Evolve.`,
		mod: 'fakemon',
		gameType: 'doubles',
		ruleset: [
			'Fakemon Standard', 'Fakemon Mechanics', 'Standard Fakemon',
		],
	},
	{
		name: "[Fakemon] Random Battle",
		desc: `Randomly generated Fakemon teams, 6v6 singles. Also used by the bot.`,
		mod: 'fakemon',
		team: 'random',
		ruleset: [
			'Fakemon Mechanics', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod',
		],
	},
	{
		name: "[Fakemon] Random Doubles Battle",
		desc: `Randomly generated Fakemon teams, 4v4 doubles. Also used by the bot.`,
		mod: 'fakemon',
		gameType: 'doubles',
		team: 'random',
		ruleset: [
			'Fakemon Mechanics', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod',
		],
	},
	{
		name: "[Fakemon] Custom Game",
		desc: `Fakemon with all rules relaxed - useful for testing new Pok&eacute;mon.`,
		mod: 'fakemon',
		searchShow: false,
		challengeShow: true,
		debug: true,
		battle: { trunc: Math.trunc },
		ruleset: ['Fakemon Mechanics', 'Team Preview', 'Cancel Mod'],
	},
	{
		name: "[Fakemon] Doubles Custom Game",
		desc: `Fakemon doubles with all rules relaxed.`,
		mod: 'fakemon',
		gameType: 'doubles',
		searchShow: false,
		challengeShow: true,
		debug: true,
		battle: { trunc: Math.trunc },
		ruleset: ['Fakemon Mechanics', 'Team Preview', 'Cancel Mod'],
	},
];
