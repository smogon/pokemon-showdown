import type { FormatList } from "../sim/dex-formats";

export const Formats: FormatList = [
	{
		name: "[PokeBedrock] Singles",
		mod: "gen9",
		gameType: "singles",
		ruleset: [
			"Obtainable",
		],
	},
	{
		name: "[PokeBedrock] Doubles",
		mod: "gen9",
		gameType: "doubles",
		ruleset: [
			"Obtainable",
		],
	},
	{
		name: "[PokeBedrock] [Rated] Singles",
		mod: "gen9",
		gameType: "singles",
		ruleset: [
			"Obtainable",
		],
	},
	{
		name: "[PokeBedrock] [Rated] Doubles",
		mod: "gen9",
		gameType: "doubles",
		ruleset: [
			"Obtainable",
			"Evasion Moves Clause",
			"Evasion Abilities Clause",
			"Species Clause",
			"OHKO Clause",
			"Endless Battle Clause",
			"Gravity Sleep Clause",
		],
		banlist: [
			"Dialga", "Dialga-Origin", "Giratina", "Giratina-Origin",
			"Palkia", "Palkia-Origin", "Rayquaza", "Reshiram",
			"Kyurem-Black", "Kyurem-White", "Zekrom", "Zacian",
			"Zacian-Crowned", "Zamazenta", "Zamazenta-Crowned",
			"Eternatus", "Ho-Oh", "Lugia", "Lunala", "Solgaleo",
			"Koraidon", "Shadow Tag",
		],
	},
	{
		name: "[PokeBedrock] [Rated] Anything Goes",
		mod: "gen9",
		gameType: "singles",
		ruleset: [
			"Obtainable",
			"Endless Battle Clause",
		],
	},
	{
		name: "[PokeBedrock] [Rated] Uber",
		mod: 'gen9',
		gameType: "singles",
		ruleset: [
			"Obtainable",
			"Species Clause",
			"Sleep Clause Mod",
			"Evasion Moves Clause",
			"OHKO Clause",
			"Moody Clause",
			"Endless Battle Clause",
			"Swagger Clause",
			"Mega Rayquaza Clause",
		],
	},
];
