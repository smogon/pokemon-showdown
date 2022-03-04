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


	// National Dex
	///////////////////////////////////////////////////////////////////

	{
		section: "ISL Format",
	},
	{
		name: "[Gen 8] Draft",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3666135/">National Dex Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3667921/">National Dex Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3666572/">National Dex Viability Rankings</a>`,
		],

		mod: 'gen8',
		ruleset: ['Standard NatDex', 'OHKO Clause', 'Evasion Moves Clause', 'Species Clause', 'Dynamax Clause', 'Sleep Clause Mod'],
		banlist: [
			'Alakazam-Mega', 'Arceus', 'Blastoise-Mega', 'Blaziken-Mega', 'Calyrex-Ice', 'Calyrex-Shadow', 'Cinderace + Libero', 'Darkrai',
			'Darmanitan-Galar', 'Deoxys-Attack', 'Deoxys-Base', 'Deoxys-Speed', 'Dialga', 'Dracovish', 'Eternatus',
			'Genesect', 'Gengar-Mega', 'Giratina', 'Giratina-Origin', 'Greninja + Protean', 'Groudon', 'Ho-Oh', 'Kangaskhan-Mega', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Landorus-Base + Sheer Force', 'Lucario-Mega', 'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Metagross-Mega', 'Mewtwo',
			'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Necrozma-Ultra', 'Palkia', 'Pheromosa', 'Rayquaza', 'Reshiram',
			'Salamence-Mega', 'Shaymin-Sky', 'Solgaleo', 'Spectrier', 'Tornadus-Therian', 'Urshifu-Base', 'Xerneas', 'Yveltal', 'Zacian',
			'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Zygarde-Base', 'Zygarde-Complete', 'Arena Trap', 'Battle Bond', 'Moody',
			'Power Construct', 'Sand Veil', 'Shadow Tag', 'Snow Cloak', 'Bright Powder', 'King\'s Rock', 'Lax Incense', 'Razor Fang',
			'Quick Claw', 'Baton Pass',
		],
	},
];
