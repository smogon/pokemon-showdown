// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts

export const Formats: import('../sim/dex-formats').FormatList = [

	// Formats removed from the main formats.ts file
	///////////////////////////////////////////////////////////////////
	{
		name: "[Gen 9] VGC 2026 Reg F",

		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		bestOfDefault: true,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Open Team Sheets'],
	},


	// DigiPen S/V Singles
	///////////////////////////////////////////////////////////////////
	// Each format inherits from its standard Gen 9 counterpart, then
	// adds `+DigiPen` to allow Pokémon and items tagged isNonstandard: "DigiPen".

	{
		section: "DigiPen Gen 9 Singles",
		column: 1,
	},
	{
		name: "[Gen 9 DigiPen] Singles",
		mod: 'gen9digipen',
		searchShow: false,
		ruleset: ['Standard AG', 'Nickname Clause', 'Species Clause'],
		banlist: ['All Pokemon'],
		unbanlist: ['DigiPen', 'DigiPen Past', 'DigiPen Future'],
	},
	{
		name: "[Gen 9 DigiPen] OU",
		mod: 'gen9digipen',
		searchShow: false,
		ruleset: ['[Gen 9] OU', '+DigiPen'],
		banlist: ['DigiPen Uber'],
		unbanlist: [
			'Annihilape', 'Archaludon', 'Chi-Yu', 'Chien-Pao', 'Espathra', 'Flutter Mane', 'Gouging Fire', 'Iron Bundle',
			'Landorus', 'Magearna', 'Ogerpon-Hearthflame', 'Palafin', 'Roaring Moon', 
			'Shaymin-Sky', 'Sneasler', 'Spectrier', 'Ursaluna-Bloodmoon', 'Urshifu', 'Urshifu-Rapid-Strike',
		]
	},
	{
		name: "[Gen 9 DigiPen] Ubers",
		mod: 'gen9digipen',
		searchShow: false,
		ruleset: ['Standard AG', 'Species Clause', 'Nickname Clause', '+DigiPen'],
	},
	{
		name: "[Gen 9 DigiPen] National Dex",
		mod: 'gen9digipen',
		searchShow: false,
		ruleset: ['Standard AG', 'Nickname Clause', 'Species Clause', 'OHKO Clause', 'Evasion Clause', 'Sleep Clause Mod', '+DigiPen', '+DigiPenPast', '+DigiPenFuture', '+Past', '+Future'],
		banlist: ['ND Uber', 'DigiPen Uber'],
		unbanlist: [
			'Annihilape', 'Baxcalibur', 'Chi-Yu', 'Chien-Pao', 'Darkrai', 'Darmanitan-Galar', 'Deoxys-Speed',
			'Dracovish', 'Dragapult', 'Espathra', 'Flutter Mane', 'Genesect', 'Gouging Fire',
			'Iron Bundle', 'Landorus', 'Magearna', 'Marshadow', 'Naganadel', 'Ogerpon-Hearthflame',
			'Palafin', 'Pheromosa', 'Roaring Moon', 'Shaymin-Sky', 'Sneasler', 'Spectrier',
			'Ursaluna-Bloodmoon', 'Urshifu', 'Walking Wake', 'Zygarde-50%'
		]
	},
	{
		name: "[Gen 9 DigiPen] National Dex Ubers",
		mod: 'gen9digipen',
		searchShow: false,
		ruleset: ['Standard AG', 'Nickname Clause', 'Species Clause', 'OHKO Clause', 'Evasion Clause', 'Sleep Clause Mod', '+DigiPen', '+DigiPenPast', '+DigiPenFuture', '+Past', '+Future'],
		banlist: ['Assist'],
	},


	// DigiPen S/V Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: "DigiPen Gen 9 Doubles",
		column: 1,
	},
	// Would need to add natdex doubles table to build indexes first
	/*{
		name: "[Gen 9 DigiPen] Doubles",
		mod: 'gen9digipen',
		searchShow: false,
		gameType: 'doubles',
		ruleset: ['Standard AG', 'Species Clause', 'Nickname Clause'],
		banlist: ['All Pokemon'],
		unbanlist: ['DigiPen', 'DigiPen Past', 'DigiPen Future'],
	},*/
	{
		name: "[Gen 9 DigiPen] Doubles OU",
		mod: 'gen9digipen',
		searchShow: false,
		gameType: 'doubles',
		ruleset: ['[Gen 9] Doubles OU', '+DigiPen', '+DigiPenPast', '+DigiPenFuture', '+Past', '+Future'],
		banlist: ['DigiPen DUber'],
	},
	{
		name: "[Gen 9 DigiPen] Doubles Ubers",
		mod: 'gen9digipen',
		searchShow: false,
		gameType: 'doubles',
		ruleset: ['[Gen 9] Doubles Ubers', '+DigiPen', '+DigiPenPast', '+DigiPenFuture', '+Past', '+Future'],
	},
	{
		name: "[Gen 9 DigiPen] VGC 2026 Reg F",
		mod: 'gen9digipen',
		searchShow: false,
		gameType: 'doubles',
		bestOfDefault: true,
		ruleset: ['[Gen 9] VGC 2026 Reg F', '+DigiPen'],
	},
	{
		name: "[Gen 9 DigiPen] VGC 2026 Reg G",
		mod: 'gen9digipen',
		searchShow: false,
		gameType: 'doubles',
		bestOfDefault: true,
		ruleset: ['[Gen 9] VGC 2024 Reg G', '+DigiPen'],
	},
	{
		name: "[Gen 9 DigiPen] VGC 2026 Reg I",
		mod: 'gen9digipen',
		searchShow: false,
		gameType: 'doubles',
		bestOfDefault: true,
		ruleset: ['[Gen 9] VGC 2025 Reg I', '+DigiPen'],
	},
	{
		name: "[Gen 9 DigiPen] VGC Non-Restricted",
		mod: 'gen9digipen',
		searchShow: false,
		gameType: 'doubles',
		bestOfDefault: true,
		ruleset: ['Flat Rules', 'VGC Timer', 'Open Team Sheets', '+DigiPen', '+Past', '+Future'],
	},
	{
		name: "[Gen 9 DigiPen] VGC One Restricted",
		mod: 'gen9digipen',
		searchShow: false,
		gameType: 'doubles',
		bestOfDefault: true,
		ruleset: ['Flat Rules', 'VGC Timer', 'Open Team Sheets', 'Limit One Restricted',  '+DigiPen', '+Past', '+Future'],
		restricted: ['Restricted Legendary'],
	},
	{
		name: "[Gen 9 DigiPen] VGC Two Restricted",
		mod: 'gen9digipen',
		searchShow: false,
		gameType: 'doubles',
		bestOfDefault: true,
		ruleset: ['Flat Rules', 'VGC Timer', 'Open Team Sheets', 'Limit Two Restricted',  '+DigiPen', '+Past', '+Future'],
		restricted: ['Restricted Legendary'],
	},
	// FNAF
	///////////////////////////////////////////////////////////////////
	{
		section: "Five Nights At Freddy's",
		column: 1,
	},
	{
		name: "[Gen 9 FNAF] Singles",
		mod: 'gen9fnaf',
		searchShow: false,
		ruleset: ['Standard AG', 'Nickname Clause', 'Species Clause'],
		banlist: ['All Pokemon'],
		unbanlist: ['FNAF'],
	},
];
