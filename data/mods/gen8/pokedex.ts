export const Pokedex: {[k: string]: ModdedSpeciesData} = {
	growlithehisui: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Flash Fire", H: "Justified"},
	},
	arcaninehisui: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Flash Fire", H: "Justified"},
	},
	typhlosionhisui: {
		inherit: true,
		abilities: {0: "Blaze", H: "Flash Fire"},
	},
	sneaselhisui: {
		inherit: true,
		abilities: {0: "Inner Focus", 1: "Keen Eye", H: "Poison Touch"},
	},
	shiftry: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Early Bird", H: "Pickpocket"},
	},
	piplup: {
		inherit: true,
		abilities: {0: "Torrent", H: "Defiant"},
	},
	prinplup: {
		inherit: true,
		abilities: {0: "Torrent", H: "Defiant"},
	},
	empoleon: {
		inherit: true,
		abilities: {0: "Torrent", H: "Defiant"},
	},
	gallade: {
		inherit: true,
		abilities: {0: "Steadfast", H: "Justified"},
	},
	giratinaorigin: {
		inherit: true,
		requiredItem: "Griseous Orb",
	},
	cresselia: {
		inherit: true,
		baseStats: {hp: 120, atk: 70, def: 120, spa: 75, spd: 130, spe: 85},
	},
	samurotthisui: {
		inherit: true,
		abilities: {0: "Torrent", H: "Shell Armor"},
	},
	braviaryhisui: {
		inherit: true,
		abilities: {0: "Keen Eye", 1: "Sheer Force", H: "Defiant"},
	},
	spewpa: {
		inherit: true,
		evos: ["Vivillon"],
	},
	vivillonfancy: {
		inherit: true,
		abilities: {0: "Shield Dust", 1: "Compound Eyes"},
		prevo: undefined,
		evoLevel: undefined,
	},
	vivillonpokeball: {
		inherit: true,
		abilities: {0: "Shield Dust", 1: "Compound Eyes"},
	},
	sliggoohisui: {
		inherit: true,
		abilities: {0: "Sap Sipper", 1: "Overcoat", H: "Gooey"},
	},
	goodrahisui: {
		inherit: true,
		abilities: {0: "Sap Sipper", 1: "Overcoat", H: "Gooey"},
	},
	decidueyehisui: {
		inherit: true,
		abilities: {0: "Overgrow", H: "Long Reach"},
	},
	zacian: {
		inherit: true,
		baseStats: {hp: 92, atk: 130, def: 115, spa: 80, spd: 115, spe: 138},
	},
	zaciancrowned: {
		inherit: true,
		baseStats: {hp: 92, atk: 170, def: 115, spa: 80, spd: 115, spe: 148},
	},
	zamazenta: {
		inherit: true,
		baseStats: {hp: 92, atk: 130, def: 115, spa: 80, spd: 115, spe: 138},
	},
	zamazentacrowned: {
		inherit: true,
		baseStats: {hp: 92, atk: 130, def: 145, spa: 80, spd: 145, spe: 128},
	},
	kleavor: {
		inherit: true,
		abilities: {0: "Swarm", 1: "Sheer Force", H: "Steadfast"},
	},
	basculegion: {
		inherit: true,
		abilities: {0: "Rattled", 1: "Adaptability", H: "Mold Breaker"},
	},
	basculegionf: {
		inherit: true,
		abilities: {0: "Rattled", 1: "Adaptability", H: "Mold Breaker"},
	},
	sneasler: {
		inherit: true,
		abilities: {0: "Pressure", H: "Poison Touch"},
		evoType: "useItem",
		evoItem: "Razor Claw",
		evoCondition: "during the day",
	},
	enamorus: {
		inherit: true,
		abilities: {0: "Healer", H: "Contrary"},
	},
};
