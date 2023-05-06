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

		ruleset: ['[Gen 9] UU'],
		banlist: ['UU', 'RUBL', 'Light Clay'],
	},
	{
		name: "[Gen 9] NU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3715408/">NU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3715712/">NU Viability Rankings</a>`,
		],

		mod: 'gen9',
		ruleset: ['[Gen 9] RU'],
		banlist: ['RU', 'NUBL'],
	},
	{
		name: "[Gen 9] PU",

		mod: 'gen9',
		ruleset: ['[Gen 9] NU'],
		banlist: ['NU', 'PUBL'],
	},
	{
		name: "[Gen 9] LC",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3710868/">Little Cup Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3712989/">Little Cup Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3712664/">Little Cup Viability Rankings</a>`,
		],

		mod: 'gen9',
		ruleset: ['Little Cup', 'Standard'],
		banlist: ['Dunsparce', 'Flittle', 'Gastly', 'Girafarig', 'Meditite', 'Misdreavus', 'Murkrow', 'Rufflet', 'Scyther', 'Sneasel', 'Moody', 'Baton Pass'],
	},
	{
		name: "[Gen 9] Monotype",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3710724/">Monotype Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3715794/">Monotype Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3714063/">Monotype Viability Rankings</a>`,
		],

		mod: 'gen9',
		ruleset: ['Standard', 'Evasion Abilities Clause', 'Same Type Clause', 'Terastal Clause'],
		banlist: ['Annihilape', 'Chi-Yu', 'Houndstone', 'Iron Bundle', 'Koraidon', 'Miraidon', 'Palafin', 'Moody', 'Shadow Tag', 'Booster Energy', 'Damp Rock', 'Focus Band', 'King\'s Rock', 'Quick Claw', 'Acupressure', 'Baton Pass'],
	},
	{
		name: "[Gen 9] 1v1",
		desc: `Bring three Pok&eacute;mon to Team Preview and choose one to battle.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3710864/">1v1 Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3712375/">1v1 Viability Rankings</a>`,
		],

		mod: 'gen9',
		ruleset: [
			'Picked Team Size = 1', 'Max Team Size = 3',
			'Standard', 'Terastal Clause', 'Sleep Moves Clause', 'Accuracy Moves Clause', '!Sleep Clause Mod',
		],
		banlist: [
			'Chi-Yu', 'Cinderace', 'Dragonite', 'Flutter Mane', 'Gholdengo', 'Greninja', 'Koraidon', 'Mimikyu', 'Miraidon', 'Scream Tail',
			'Moody', 'Focus Band', 'Focus Sash', 'King\'s Rock', 'Quick Claw', 'Acupressure', 'Perish Song',
		],
	},
	{
		name: "[Gen 9] Anything Goes",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3710911/">AG Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3714177/">AG Viability Rankings</a>`,
		],

		mod: 'gen9',
		ruleset: ['Min Source Gen = 9', 'Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause'],
	},
	{
		name: "[Gen 9] ZU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3719022/">ZU Metagame Discussion</a>`,
		],

		mod: 'gen9',
		ruleset: ['[Gen 9] PU'],
		banlist: ['PU', 'Beartic', 'Fraxure', 'Girafarig', 'Vigoroth'],
	},
	{
		name: "[Gen 9] LC UU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3711750/">LC UU Metagame Discussion</a>`,
		],

		mod: 'gen9',
		searchShow: false,
		ruleset: ['[Gen 9] LC'],
		banlist: [
			'Crabrawler', 'Cyndaquil', 'Diglett', 'Drifloon', 'Foongus', 'Fuecoco', 'Glimmet', 'Gothita', 'Greavard', 'Larvesta',
			'Magnemite', 'Mankey', 'Mareanie', 'Mudbray', 'Nymble', 'Oshawott', 'Pawniard', 'Quaxly', 'Sandile', 'Shellder',
			'Shellos', 'Shroodle', 'Surskit', 'Tinkatink', 'Toedscool', 'Voltorb', 'Wattrel', 'Wingull', 'Zorua', 'Zorua-Hisui',
		],
	},
	{
		name: "[Gen 9] CAP",

		mod: 'gen9',
		ruleset: ['[Gen 9] OU', '+CAP'],
		banlist: ['Walking Wake', 'Crucibellite'],
	},
	{
		name: "[Gen 9] Free-For-All",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3711724/">Free-For-All</a>`,
		],

		mod: 'gen9',
		gameType: 'freeforall',
		rated: false,
		tournamentShow: false,
		ruleset: ['Standard', '!Evasion Items Clause'],
		banlist: [
			'Annihilape', 'Chi-Yu', 'Flutter Mane', 'Houndstone', 'Koraidon', 'Iron Bundle', 'Miraidon', 'Palafin', 'Moody', 'Shadow Tag',
			'Toxic Debris', 'Acupressure', 'Aromatic Mist', 'Baton Pass', 'Court Change', 'Final Gambit', 'Flatter', 'Follow Me', 'Heal Pulse',
			'Poison Fang', 'Rage Powder', 'Spicy Extract', 'Swagger', 'Toxic', 'Toxic Spikes',
		],
	},
	{
		name: "[Gen 9] Battle Stadium Singles Series 2",

		mod: 'gen9',
		searchShow: false,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Paldea Pokedex', 'Min Source Gen = 9', 'VGC Timer'],
		banlist: ['Sub-Legendary'],
	},
	{
		name: "[Gen 9] Battle Stadium Singles Regulation C",

		mod: 'gen9',
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Paldea Pokedex', 'Min Source Gen = 9', 'VGC Timer'],
	},
	{
		name: "[Gen 9] Custom Game",

		mod: 'gen9',
		searchShow: false,
		debug: true,
		battle: {trunc: Math.trunc},
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},

	// S/V Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: "S/V Doubles",
	},
	{
		name: "[Gen 9] Doubles OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3710876/">Doubles OU Sample Teams</a>`,
		],

		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard Doubles'],
		banlist: ['DUber', 'Shadow Tag'],
	},
	{
		name: "[Gen 9] Doubles Ubers",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3712864/">Doubles Ubers</a>`,
		],

		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard Doubles', '!Gravity Sleep Clause'],
	},
	{
		name: "[Gen 9] Doubles UU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3712825/">Doubles UU</a>`,
		],

		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['[Gen 9] Doubles OU'],
		banlist: ['DOU', 'DBL'],
	},
	{
		name: "[Gen 9] Doubles LC",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3710957/">Doubles LC</a>`,
		],

		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard Doubles', 'Little Cup', 'Sleep Clause Mod'],
		banlist: ['Dunsparce', 'Murkrow', 'Scyther', 'Sneasel'],
	},
	{
		name: "[Gen 9] 2v2 Doubles",
		desc: `Double battle where you bring four Pok&eacute;mon to Team Preview and choose only two.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3710849/">2v2 Doubles</a>`,
		],

		mod: 'gen9',
		gameType: 'doubles',
		ruleset: [
			'Picked Team Size = 2', 'Max Team Size = 4',
			'Standard Doubles', 'Accuracy Moves Clause', 'Terastal Clause', 'Sleep Clause Mod', 'Evasion Items Clause',
		],
		banlist: ['Chi-Yu', 'Koraidon', 'Miraidon', 'Commander', 'Focus Sash', 'King\'s Rock', 'Ally Switch', 'Final Gambit', 'Moody', 'Perish Song', 'Swagger'],
	},
	{
		name: "[Gen 9] VGC 2023 Series 2",

		mod: 'gen9',
		searchShow: false,
		gameType: 'doubles',
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Paldea Pokedex', 'Min Source Gen = 9', 'VGC Timer', 'Open Team Sheets'],
		banlist: ['Sub-Legendary'],
	},
	{
		name: "[Gen 9] VGC 2023 Regulation C",

		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Paldea Pokedex', 'Min Source Gen = 9', 'VGC Timer', 'Open Team Sheets'],
	},
	{
		name: "[Gen 9] Doubles Custom Game",

		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		battle: {trunc: Math.trunc},
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
];
