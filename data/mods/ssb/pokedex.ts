export const Pokedex: {[k: string]: ModdedSpeciesData} = {
	/*
	// Example
	id: {
		inherit: true, // Always use this, makes the pokemon inherit its default values from the parent mod (gen7)
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100}, // the base stats for the pokemon
	},
	*/
	// Abdelrahman
	cameruptmega: {
		inherit: true,
		abilities: {0: "Water Absorb"},
	},
	// Aelita
	zygardecomplete: {
		inherit: true,
		abilities: {0: "Scyphozoa"},
	},
	// aegii
	aegislash: {
		inherit: true,
		abilities: {0: "Set the Stage"},
	},
	aegislashblade: {
		inherit: true,
		abilities: {0: "Set the Stage"},
	},
	// Aeonic
	nosepass: {
		inherit: true,
		baseStats: {hp: 70, atk: 85, def: 135, spa: 45, spd: 90, spe: 70},
	},
	// Aethernum
	lotad: {
		inherit: true,
		baseStats: {hp: 40, atk: 70, def: 70, spa: 80, spd: 90, spe: 70},
	},
	// Annika
	mewtwomegay: {
		inherit: true,
		baseStats: {hp: 106, atk: 110, def: 90, spa: 154, spd: 90, spe: 130},
		abilities: {0: "Overprotective"},
	},
	// A Quag To The Past
	quagsire: {
		inherit: true,
		baseStats: {hp: 95, atk: 65, def: 85, spa: 65, spd: 85, spe: 35},
	},
	// Billo
	cosmog: {
		inherit: true,
		baseStats: {hp: 86, atk: 58, def: 62, spa: 87, spd: 62, spe: 74},
	},
	// dogknees
	furret: {
		inherit: true,
		types: ["Normal", "Ghost"],
	},
	// Elgino
	celebi: {
		inherit: true,
		types: ["Grass", "Fairy"],
	},
	// EpicNikolai
	garchompmega: {
		inherit: true,
		abilities: {0: "Dragon Heart"},
		types: ["Dragon", "Fire"],
	},
	// Felucia
	uxie: {
		inherit: true,
		types: ["Psychic", "Normal"],
	},
	// frostyicelad
	laprasgmax: {
		inherit: true,
		heightm: 2.5,
		weightkg: 220,
	},
	// GMars
	minior: {
		inherit: true,
		abilities: {0: "Capsule Armor"},
	},
	miniorviolet: {
		inherit: true,
		abilities: {0: "Capsule Armor"},
	},
	miniorindigo: {
		inherit: true,
		abilities: {0: "Capsule Armor"},
	},
	miniorblue: {
		inherit: true,
		abilities: {0: "Capsule Armor"},
	},
	miniorgreen: {
		inherit: true,
		abilities: {0: "Capsule Armor"},
	},
	minioryellow: {
		inherit: true,
		abilities: {0: "Capsule Armor"},
	},
	miniororange: {
		inherit: true,
		abilities: {0: "Capsule Armor"},
	},
	miniormeteor: {
		inherit: true,
		abilities: {0: "Capsule Armor"},
	},
	// Hydro
	pichu: {
		inherit: true,
		types: ["Electric", "Water"],
		baseStats: {hp: 67, atk: 58, def: 57, spa: 81, spd: 67, spe: 101},
	},
	// Inactive
	gyaradosmega: {
		inherit: true,
		abilities: {0: "Dragon's Fury"},
	},
	// Jho
	toxtricity: {
		inherit: true,
		abilities: {0: "Punk Rock"},
	},
	toxtricitylowkey: {
		inherit: true,
		abilities: {0: "Venomize"},
	},
	// Kaiju Bunny
	lopunnymega: {
		inherit: true,
		abilities: {0: "Second Wind"},
		types: ["Normal", "Fairy"],
	},
	// Kris
	unown: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
		// For reverting back to an Unown forme
		abilities: {0: "Protean"},
	},
	// Lamp
	lampent: {
		inherit: true,
		baseStats: {hp: 60, atk: 80, def: 100, spa: 135, spd: 100, spe: 95},
	},
	// Meicoo
	venusaurmega: {
		inherit: true,
		abilities: {0: "Unaware"},
	},
	// nui
	jigglypuff: {
		inherit: true,
		baseStats: {hp: 115, atk: 128, def: 62, spa: 128, spd: 78, spe: 62},
	},
	// Overneat
	absolmega: {
		inherit: true,
		abilities: {0: "Fluffy"},
		types: ["Dark", "Fairy"],
	},
	// PartMan
	chandelure: {
		inherit: true,
		abilities: {0: "Hecatomb"},
	},
	// Psynergy
	rayquaza: {
		inherit: true,
		abilities: {0: "Supernova"},
	},
	rayquazamega: {
		inherit: true,
		abilities: {0: "Supernova"},
		requiredMove: "Clear Breath",
	},
	// Robb576
	necrozmadawnwings: {
		inherit: true,
		abilities: {0: "The Numbers Game"},
	},
	necrozmaduskmane: {
		inherit: true,
		abilities: {0: "The Numbers Game"},
	},
	necrozmaultra: {
		inherit: true,
		abilities: {0: "The Numbers Game"},
	},
	// Strucni
	aggronmega: {
		inherit: true,
		abilities: {0: "Overasked Clause"},
	},
	// Finland
	alcremie: {
		inherit: true,
		abilities: {0: "Winding Song"},
	},
	// tiki
	snom: {
		inherit: true,
		baseStats: {hp: 70, atk: 65, def: 60, spa: 125, spd: 90, spe: 65},
	},
	// vivalospride's interaction with Coconut's move
	darumaka: {
		inherit: true,
		evos: ["Darmanitan", "Darmanitan-Zen"],
	},
	darmanitanzen: {
		inherit: true,
		prevo: "Darumaka",
	},
	// yuki
	pikachucosplay: {
		inherit: true,
		baseStats: {hp: 60, atk: 85, def: 50, spa: 95, spd: 85, spe: 110},
		abilities: {0: "Combat Training"},
	},
	pikachuphd: {
		inherit: true,
		baseStats: {hp: 60, atk: 85, def: 50, spa: 95, spd: 85, spe: 110},
		abilities: {0: "Triage"},
	},
	pikachulibre: {
		inherit: true,
		baseStats: {hp: 60, atk: 85, def: 50, spa: 95, spd: 85, spe: 110},
		abilities: {0: "White Smoke"},
	},
	pikachupopstar: {
		inherit: true,
		baseStats: {hp: 60, atk: 85, def: 50, spa: 95, spd: 85, spe: 110},
		abilities: {0: "Dancer"},
	},
	pikachurockstar: {
		inherit: true,
		baseStats: {hp: 60, atk: 85, def: 50, spa: 95, spd: 85, spe: 110},
		abilities: {0: "Punk Rock"},
	},
	pikachubelle: {
		inherit: true,
		baseStats: {hp: 60, atk: 85, def: 50, spa: 95, spd: 85, spe: 110},
		abilities: {0: "Weak Armor"},
	},
	// Zalm
	weedle: {
		inherit: true,
		baseStats: {hp: 100, atk: 35, def: 100, spa: 90, spd: 90, spe: 100},
	},
	// Zarel
	meloetta: {
		inherit: true,
		abilities: {0: "Dancer"},
	},
	meloettapirouette: {
		inherit: true,
		abilities: {0: "Serene Grace"},
	},
};
