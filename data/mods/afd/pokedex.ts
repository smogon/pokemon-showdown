export const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {
	seaking: {
		inherit: true,
		baseStats: { hp: 80, atk: 92, def: 65, spa: 65, spd: 80, spe: 98 },
	},
	lickitung: {
		inherit: true,
		abilities: { 0: "Own Tempo", 1: "Oblivious", H: "Chaos Saliva" },
	},
	mewtwo: {
		inherit: true,
		abilities: { 0: "Pressure", 1: "Neuroforce", H: "Unnerve" },
	},
	scovillainmega: {
		inherit: true,
		abilities: { 0: "Contrary" },
	},
	mew: {
		inherit: true,
		abilities: { 0: "Synchronize", 1: "Neuroforce" },
	},
	smeargle: {
		inherit: true,
		abilities: { 0: "Own Tempo", 1: "Prankster", H: "Moody" },
	},
	swampert: {
		inherit: true,
		abilities: { 0: "Torrent", 1: "Sap Sipper", H: "Damp" },
	},
	bibarel: {
		inherit: true,
		baseStats: { hp: 159, atk: 85, def: 60, spa: 55, spd: 60, spe: 151 },
	},
	skuntank: {
		inherit: true,
		baseStats: { hp: 103, atk: 93, def: 67, spa: 106, spd: 61, spe: 84 },
		abilities: { 0: "Stench", 1: "Aftermath", H: "Mega Launcher" },
	},
	rampardos: {
		inherit: true,
		baseStats: { hp: 97, atk: 225, def: 30, spa: 65, spd: 30, spe: 58 },
		abilities: { 0: "Rocky Payload", H: "Sheer Force" },
	},
	gallademega: {
		inherit: true,
		abilities: { 0: "Sharpness" },
	},
	garchompmega: {
		inherit: true,
		abilities: { 0: "Sand Rush" },
	},
	dusknoir: {
		inherit: true,
		abilities: { 0: "Damp" },
	},
	lickilicky: {
		inherit: true,
		abilities: { 0: "Own Tempo", 1: "Oblivious", H: "Chaos Saliva" },
	},
	regigigas: {
		inherit: true,
		abilities: { 0: "Slow Start", H: "Fast Start" },
	},
	serperior: {
		inherit: true,
		types: ['Grass', 'Dragon'],
		baseStats: { hp: 75, atk: 75, def: 95, spa: 105, spd: 95, spe: 113 },
	},
	simisage: {
		inherit: true,
		baseStats: { hp: 120, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 },
	},
	excadrillmega: {
		inherit: true,
		abilities: { 0: "It's Excadrillin' Time!" },
	},
	chandelure: {
		inherit: true,
		abilities: { 0: "Flash Fire", 1: "Flame Body", H: "Shadow Tag" },
	},
	delphox: {
		inherit: true,
		abilities: { 0: "Blaze", H: "Discourage" },
	},
	clawitzer: {
		inherit: true,
		abilities: { 0: "Super Mega Launcher" },
	},
	malamar: {
		inherit: true,
		baseStats: { hp: 101, atk: 112, def: 88, spa: 68, spd: 75, spe: 73 },
	},
	malamarmega: {
		inherit: true,
		baseStats: { hp: 101, atk: 122, def: 88, spa: 98, spd: 120, spe: 88 },
		abilities: { 0: "Contrary" },
	},
	goodra: {
		inherit: true,
		otherFormes: ["Goodra-Hisui", "Goodra-Agency"],
		formeOrder: ["Goodra", "Goodra-Hisui", "Goodra-Agency"],
	},
	goodraagency: {
		num: 706,
		name: "Goodra-Agency",
		baseSpecies: "Goodra",
		forme: "Agency",
		types: ["Dragon"],
		baseStats: { hp: 80, atk: 100, def: 120, spa: 110, spd: 200, spe: 60 },
		abilities: { 0: "Regenerator", 1: "Hydration", H: "Gooey" },
		heightm: 1.7,
		weightkg: 334.1,
		color: "Purple",
		eggGroups: ["Dragon"],
	},
	incineroar: {
		inherit: true,
		types: ['Fire', 'Fighting'],
	},
	incineroar2: {
		num: 2000,
		name: "Incineroar 2",
		types: ["Ghost", "Steel"],
		genderRatio: { M: 0.875, F: 0.125 },
		baseStats: { hp: 95, atk: 115, def: 90, spa: 80, spd: 90, spe: 60 },
		abilities: { 0: "Intimidate 2" },
		heightm: 1.8,
		weightkg: 83,
		color: "Red",
		eggGroups: ["Field"],
	},
	celesteela: {
		inherit: true,
		baseStats: { hp: 5, atk: 5, def: 5, spa: 5, spd: 5, spe: 5 },
	},
	hatterene: {
		inherit: true,
		types: ['Psychic', 'Dark'],
	},
	glimmora: {
		inherit: true,
		baseStats: { hp: 106, atk: 150, def: 70, spa: 194, spd: 120, spe: 140 },
	},
	glimmoramega: {
		inherit: true,
		baseStats: { hp: 106, atk: 185, def: 85, spa: 214, spd: 145, spe: 155 },
	},
	tatsugiri: {
		inherit: true,
		abilities: { 0: "Commander", 1: "Parental Bond", H: "Storm Drain" },
	},
	tatsugiridroopy: {
		inherit: true,
		abilities: { 0: "Commander", 1: "Parental Bond", H: "Storm Drain" },
	},
	tatsugiristretchy: {
		inherit: true,
		abilities: { 0: "Commander", 1: "Parental Bond", H: "Storm Drain" },
	},
	calyrex: {
		num: 898,
		name: "Calyrex",
		types: ["Psychic", "Grass"],
		gender: "N",
		baseStats: { hp: 100, atk: 80, def: 80, spa: 80, spd: 80, spe: 80 },
		abilities: { 0: "Unnerve" },
		heightm: 1.1,
		weightkg: 7.7,
		color: "Green",
		eggGroups: ["Undiscovered"],
		tags: ["Restricted Legendary"],
		otherFormes: ["Calyrex-Ice", "Calyrex-Shadow", "Calyrex-Monarch"],
		formeOrder: ["Calyrex", "Calyrex-Ice", "Calyrex-Shadow", "Calyrex-Monarch"],
	},
	calyrexmonarch: {
		num: 898,
		name: "Calyrex-Monarch",
		baseSpecies: "Calyrex",
		forme: "Monarch",
		types: ["Psychic", "Grass"],
		gender: "N",
		baseStats: { hp: 200, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 },
		abilities: { 0: "As One (Calyrex)" },
		heightm: 2.2,
		weightkg: 15.4,
		color: "Green",
		eggGroups: ["Undiscovered"],
		changesFrom: "Calyrex",
	},
	spidops: {
		inherit: true,
		baseStats: { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 0 },
	},
};
