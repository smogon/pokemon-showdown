// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts
/*
If you want to add custom formats, create a file in this folder named: "custom-formats.ts"

Paste the following code into the file and add your desired formats and their sections between the brackets:
--------------------------------------------------------------------------------
// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts

export const Formats: FormatList = [
];
--------------------------------------------------------------------------------

If you specify a section that already exists, your format will be added to the bottom of that section.
New sections will be added to the bottom of the specified column.
The column value will be ignored for repeat sections.
*/

export const Formats: FormatList = [

	// S/V Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "BudpoW",
	},
	{
		name: "[Gen 9] Random Battle",
				desc: `Randomized teams of Pok&eacute;mon with sets that are generated to be competitively viable.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3712619/">Random Battle Suggestions</a>`,
		],

		mod: 'gen9',
		searchShow: false,
		team: 'random',
		ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod'],
	},
	{
		name: "[Gen 9] Unrated Random Battle",

		mod: 'gen9',
		searchShow: false,
		team: 'random',
		challengeShow: false,
		rated: false,
		ruleset: ['Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod'],
	},
	{
		name: "[Gen 9] Random Battle (Blitz)",

		mod: 'gen9',
		searchShow: false,
		team: 'random',
		ruleset: ['[Gen 9] Random Battle', 'Blitz'],
	},
	{
		name: "[Gen 9] OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3710915/">SV OU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3712513/">SV OU Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3712493/">SV OU Viability Rankings</a>`,
		],

		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard'],
		banlist: ['Uber', 'AG', 'Arena Trap', 'Moody', 'Sand Veil', 'Shadow Tag', 'Snow Cloak', 'King\'s Rock', 'Baton Pass', 'Shed Tail'],
	},
	{
		name: "[Gen 9] Ubers",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3710870/">Ubers Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3712978/">Ubers Viability Rankings</a>`,
		],

		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard'],
		banlist: ['AG', 'Moody', 'King\'s Rock', 'Baton Pass'],
	},
	{
		name: "[Gen 9] UU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3713709/">UU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3716435/">UU Viability Rankings</a>`,
		],

		mod: 'gen9',
		searchShow: false,
		ruleset: ['[Gen 9] OU'],
		banlist: ['OU', 'UUBL'],
	},
	{
		name: "[Gen 9] RU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3713711/">RU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3717138/">RU Viability Rankings</a>`,
		],

		mod: 'gen9',
		searchShow: false,
		ruleset: ['[Gen 9] UU'],
		banlist: ['UU', 'RUBL', 'Light Clay'],
	},
];