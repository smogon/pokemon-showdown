import { inherits } from "util";

export const Pokedex: { [k: string]: ModdedSpeciesData } = {
	volcarona: {
		inherit: true,
		abilities: {0: "Fluffy"},
	},
	golemalola: {
		inherit: true,	
	},
	lurantis: {
		inherit: true,
		baseStats: {hp: 85, atk: 105, def: 90, spa: 95, spd: 90, spe: 75},
	},
	ironcrown: {
		inherit: true,
		abilities: {0: "Queenly Majesty", H: "Battle Armor"},
	},
	mamoswine: {
		inherit: true,
	},
	ceruledge: {
		inherit: true,
	},
	carbink: {
		inherit: true,
		abilities: {0: "Magic Bounce"},
	},
	moltres: {
		inherit: true,
		abilities: {0: "Magic Guard"},
	},
	kommoo: {
		inherit: true,
		baseStats: {hp: 75, atk: 100, def: 125, spa: 110, spd: 105, spe: 85},
		abilities: {0: "Punk Rock"},
	},
	illumise: {
		inherit: true,
		abilities: {0: "Call Volbeat"},
	},
	volbeat: {
		inherit: true,
		abilities: {0: "Call Illumise"},
	},
	abomasnow: {
		inherit: true,
	},
	abomasnowmega: {
		inherit: true,
		baseStats: {hp: 90, atk: 132, def: 105, spa: 92, spd: 105, spe: 70},
		abilities: {0: "Slush Rush"},
	},
	dugtrio: {
		inherit: true,
	},
	altaria: {
		inherit: true,
		abilities: {0: "Fluffy"},
	},
	altariamega: {
		inherit: true,
	},
	tyranitar: {
		inherit: true,
		abilities: {0: "Sand Stream", H: "Sharpness"},
	},
	tyranitarmega: {
		inherit: true,
		baseStats: {hp: 100, atk: 114, def: 150, spa: 155, spd: 110, spe: 71},
		types: ["Rock", "Dragon"],
	},
	mimikyu: {
		inherit: true,
		baseStats: {hp: 65, atk: 110, def: 80, spa: 50, spd: 105, spe: 96},
	},
	mimikyubusted: {
		inherit: true,
		abilities: {0: "Perish Body"},
		baseStats: {hp: 65, atk: 90, def: 80, spa: 50, spd: 105, spe: 116},
	},
	mesprit: {
		inherit: true,
		abilities: {0: "Liquid Voice"},
		types: ["Psychic", "Water"],
	},
	electrode: {
		inherit: true,
		abilities: {0: "Short Fuse"},
		types: ["Electric", "Normal"],
	},
	taurospaldeacombat: {
		inherit: true,
		abilities: {0: "Adaptability"},
	},
	chiyu: {
		inherit: true,
		abilities: {0: "Water Absorb"},
		baseStats: {hp: 55, atk: 135, def: 80, spa: 80, spd: 120, spe: 100},
	},
	wochien: {
		inherit: true,
		abilities: {0: "Liquid Ooze"},
		types: ["Grass", "Water"],
	},
	staraptor: {
		inherit: true,
		types: ["Flying"],
	},
	archaludon: {
		inherit: true,
		abilities: {0: "Hydroelectric Dam", 1: "Stamina"},
	},
	malamar: {
		inherit: true,
		abilities: {0: "Flip Flop"},
		baseStats: {hp: 86, atk: 92, def: 88, spa: 88, spd: 75, spe: 73},
	},
	empoleon: {
		inherit: true,
		abilities: {0: "Rough Skin"},
		baseStats: {hp: 84, atk: 111, def: 88, spa: 86, spd: 101, spe: 60},
	},
	glastrier: {
		inherit: true,
		abilities: {0: "Frozen Armor"},
	},
	calyrexice: {
		inherit: true,
		baseStats: {hp: 100, atk: 165, def: 130, spa: 85, spd: 110, spe: 90},
	},
	regieleki: {
		inherit: true,
		abilities: {0: "Galvanize"},
	},
	lycanrocmidnight: {
		inherit: true,
		abilities: {0: "Technician"},
	},
	lycanroc: {
		inherit: true,
		abilities: {0: "Drought"},
	},
	lycanrocdusk: {
		inherit: true,
		abilities: {0: "Strong Jaw"},
	},
	dodrio: {
		inherit: true,
		abilities: {0: "Speed Boost"},
		types: ["Flying", "Fighting"],
	},
	whiscash: {
		inherit: true,
		abilities: {0: "Regenerator"},
		baseStats: {hp: 110, atk: 78, def: 88, spa: 76, spd: 86, spe: 60},
	},
	hippowdon: {
		inherit: true,
		abilities: {0: "Earth Eater"},
	},
	cramorant: {
		inherit: true,
		baseStats: {hp: 90, atk: 85, def: 75, spa: 85, spd: 95, spe: 85},
	},
	cramorantgulping: {
		inherit: true,
		baseStats: {hp: 90, atk: 85, def: 75, spa: 85, spd: 95, spe: 85},
		abilities: {0: "Storm Drain"},
	},
	cramorantgorging: {
		inherit: true,
		baseStats: {hp: 90, atk: 85, def: 75, spa: 85, spd: 95, spe: 85},
		abilities: {0: "Lightning Rod"},
	},
	grafaiai: {
		inherit: true,
		baseStats: {hp: 83, atk: 95, def: 65, spa: 80, spd: 72, spe: 110},
	},
	tatsugiri: {
		inherit: true,
		abilities: {0: "Dry Skin"},
	},
	kyurem: {
		inherit: true,
		abilities: {0: "Skill Link"},
	},
	roaringmoon: {
		inherit: true,
		abilities: {0: "Shadow Shield"},
	},
	milotic: {
		inherit: true,
		abilities: {0: "Aqua Veil"},
		types: ["Water", "Fairy"],
	},
	gogoat: {
		inherit: true,
		types: ["Grass", "Rock"],
	},
	clodsire: {
		inherit: true,
		abilities: {0: "Still Water"},
	},
	masquerain: {
		inherit: true,
		abilities: {0: "Intimidate"},
	},
	masquerainmega: {
		num: -999,
		name: "Masquerain-Mega",
		baseSpecies: "Masquerain",
		forme: "Mega",
		types: ["Bug", "Dark"],
		genderRatio: { M: 0.5, F: 0.5 },
		baseStats: { hp: 70, atk: 60, def: 82, spa: 140, spd: 82, spe: 120 },
		abilities: { 0: "Primordial Sea" },
		heightm: 0.8,
		weightkg: 3.6,
		color: "Blue",
		eggGroups: ["Water 1", "Bug"],
		requiredItem: "Masquerainite",
	},
	kyuremblack: {
		inherit: true,
		abilities: {0: "Teravolt"},
		types: ["Dragon", "Ice", "Electric"],
	},
	ironthorns: {
		inherit: true,
		abilities: {0: "Iron Barbs"},
	},
	dudunsparce: {
		inherit: true,
		abilities: {0: "Earth Eater"},
		types: ["Normal", "Ground"],
	},
	dudunsparcethreesegment: {
		inherit: true,
		abilities: {0: "Earth Eater"},
		types: ["Normal", "Ground"],
	},
	chienpao: {
		inherit: true,
		abilities: {0: "Tablets of Ruin"},
	},
	pelipper: {
		inherit: true,
	},
	kleavor: {
		inherit: true,
		abilities: {0: "King of the Hill"},
		baseStats: { hp: 120, atk: 135, def: 95, spa: 45, spd: 75, spe: 85 },
	},
	araquanid: {
		inherit: true,
		baseStats: { hp: 2, atk: 140, def: 92, spa: 50, spd: 132, spe: 42 },
		maxHP: 16,
	},
	avalugghisui: {
		inherit: true,
		abilities: {0: "Multiscale"},
		baseStats: { hp: 95, atk: 127, def: 184, spa: 68, spd: 72, spe: 76 },
	},
	swalot: {
		inherit: true,
		abilities: {0: "Omnivore"},
	},
	zapdosgalar: {
		inherit: true,
		types: ["Electric", "Fighting"],
	},
	phione: {
		inherit: true,
	},
	sudowoodo: {
		inherit: true,
		abilities: {0: "Pseudowoodo"},
		types: ["Grass"],
		baseForme: "Grass",
		otherFormes: ["Sudowoodo-Rock"],
		formeOrder: ["Sudowoodo", "Sudowoodo-Rock"],
	},
	sudowoodorock: {
		num: 185,
		name: "Sudowoodo-Rock",
		baseSpecies: "Sudowoodo",
		forme: "Rock",
		types: ["Rock"],
		baseStats: { hp: 70, atk: 100, def: 110, spa: 30, spd: 65, spe: 30 },
		abilities: { 0: "Pseudowoodo" },
		heightm: 1.7,
		weightkg: 38,
		color: "Brown",
		eggGroups: ["Mineral"],
		requiredAbility: "Pseudowoodo",
		battleOnly: "Sudowoodo",
	},
	dondozo: {
		inherit: true,
	},
	golurk: {
		inherit: true,
	},
	meowscarada: {
		inherit: true,
	},
	infernape: {
		inherit: true,
		abilities: {0: "Berserk"},
	},
	salamence: {
		inherit: true,
		abilities: {0: "Aerilate"},
	},
	salamencemega: {
		num: 373,
		name: "Salamence-Mega",
		baseSpecies: "Salamence",
		forme: "Mega",
		types: ["Dragon", "Flying"],
		baseStats: { hp: 95, atk: 145, def: 130, spa: 120, spd: 90, spe: 120 },
		abilities: { 0: "Blood-Soaked Crescent" },
		heightm: 1.8,
		weightkg: 112.6,
		color: "Blue",
		eggGroups: ["Dragon"],
		requiredItem: "Salamencite",
	},
	urshifu: {
		inherit: true,
		abilities: {0: "Sniper"},
	},
	urshifurapidstrike: {
		inherit: true,
		abilities: {0: "Sniper"},
	},
	stonjourner: {
		inherit: true,
	},
	veluza: {
		inherit: true,
		types: ["Water", "Ghost"],
		baseStats: { hp: 90, atk: 102, def: 123, spa: 78, spd: 115, spe: 70 },
	},
	ogerponhearthflame: {
		inherit: true,
		abilities: {0: "Intimidate"},
	},
	dachsbun: {
		inherit: true,
	},
	koraidon: {
		inherit: true,
	},
	mew: {
		inherit: true,
		abilities: {0: "Biogenesis"},
	}
};
