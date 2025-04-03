// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts

export const Formats: import('../sim/dex-formats').FormatList = [

	{
		section: "Nuevo Meta Singles",
		column: 1,
	},
	{
		name: "[Gen 9] Nuevo Meta",
		mod: 'gen9',
		ruleset: ['Standard NatDex', 'Species Clause', 'Sleep Clause Mod', 'Terastal Clause', 'Nuevo Meta Pokedex', 'Item Clause = 1'],
		banlist: ['Baton Pass', 'Uber'],
	},
	{
		name: "[Gen 9] Nuevo Meta Random",
		desc: `Randomized teams of Pok&eacute;mon with sets that are generated to be competitively viable.`,
		mod: 'gen9',
		team: 'randomFactory',
		ruleset: ['Standard NatDex', 'PotD', 'Species Clause', 'Sleep Clause Mod', 'Illusion Level Mod', 'Kanto Pokedex', 'Terastal Clause', 'Item Clause = 1'],
	},

];


// Nuevo Meta Singles
	///////////////////////////////////////////////////////////////////


