export const Pokedex: {[k: string]: ModdedSpeciesData} = {
	arcanine: {
		inherit: true,
		baseStats: {hp: 95, atk: 110, def: 110, spa: 100, spd: 95, spe: 95},
	},
	delibird: {
		inherit: true,
		baseStats: {hp: 65, atk: 80, def: 75, spa: 65, spd: 75, spe: 100},
		abilities: {0: "Vital Spirit", 1: "Hustle", H: "Rattled"},
	},
	vanilluxe: {
		inherit: true,
		baseStats: {hp: 71, atk: 95, def: 85, spa: 120, spd: 95, spe: 99},
	},
	vileplume: {
		inherit: true,
		baseStats: {hp: 110, atk: 80, def: 115, spa: 110, spd: 120, spe: 50},
		abilities: {0: "Chlorophyll", 1: "Prankster", H: "Effect Spore"},
	},
	salazzle: {
		inherit: true,
		baseStats: {hp: 68, atk: 74, def: 80, spa: 121, spd: 90, spe: 117},
		abilities: {0: "Corrosion", 1: "Unnerve", H: "Oblivious"},
	},
	drapion: {
		inherit: true,
		baseStats: {hp: 70, atk: 105, def: 115, spa: 65, spd: 90, spe: 95},
		abilities: {0: "Battle Armor", 1: "Sniper", H: "Keen Eye", S: "Tough Claws"},
	},
	cramorant: {
		inherit: true,
		baseStats: {hp: 75, atk: 100, def: 60, spa: 95, spd: 60, spe: 110},
		abilities: {0: "Gulp Missile", 1: "Scrappy"},
	},
	cramorantgulping: {
		inherit: true,
		baseStats: {hp: 75, atk: 100, def: 60, spa: 95, spd: 60, spe: 110},
	},
	cramorantgorging: {
		inherit: true,
		baseStats: {hp: 75, atk: 100, def: 60, spa: 95, spd: 60, spe: 110},
	},
	pyukumuku: {
		inherit: true,
		baseStats: {hp: 95, atk: 55, def: 165, spa: 55, spd: 165, spe: 5},
		abilities: {0: "Innards Out", 1: "Prankster", H: "Unaware"},
	},
	togedemaru: {
		inherit: true,
		baseStats: {hp: 105, atk: 135, def: 113, spa: 40, spd: 93, spe: 96},
		abilities: {0: "Iron Barbs", 1: "Lightning Rod", H: "Sturdy", S: "Defiant"},
	},
	hitmontop: {
		inherit: true,
		baseStats: {hp: 130, atk: 120, def: 105, spa: 35, spd: 110, spe: 70},
	},
	stunfisk: {
		inherit: true,
		baseStats: {hp: 139, atk: 66, def: 84, spa: 101, spd: 139, spe: 32},
		abilities: {0: "Static", 1: "Limber", H: "Sand Veil", S: "Wonder Skin"},
	},
	jolteon: {
		inherit: true,
		baseStats: {hp: 65, atk: 65, def: 60, spa: 115, spd: 115, spe: 145},
		abilities: {0: "Volt Absorb", 1: "Electric Surge", H: "Quick Feet"},
	},
	primarina: {
		inherit: true,
		baseStats: {hp: 90, atk: 74, def: 74, spa: 146, spd: 116, spe: 60},
		abilities: {0: "Torrent", 1: "Competitive", H: "Liquid Voice"},
	},
	golurk: {
		inherit: true,
		baseStats: {hp: 149, atk: 134, def: 90, spa: 55, spd: 80, spe: 55},
		abilities: {0: "Iron Fist", 1: "Klutz", H: "No Guard", S: "Intimidate"},
	},
	gastrodon: {
		inherit: true,
		baseStats: {hp: 131, atk: 83, def: 68, spa: 132, spd: 112, spe: 39},
		abilities: {0: "Sticky Hold", 1: "Storm Drain", H: "Sand Force", S: "Adaptability"},
	},
	ninetales: {
		inherit: true,
		baseStats: {hp: 73, atk: 76, def: 85, spa: 91, spd: 120, spe: 110},
	},
	celebi: {
		inherit: true,
		abilities: {0: "Natural Cure", 1: "Solar Power"},
	},
	meltan: {
		inherit: true,
		baseStats: {hp: 66, atk: 80, def: 95, spa: 165, spd: 85, spe: 105},
		abilities: {0: "Magnet Pull", 1: "Adaptability", H: "Huge Power"},
	},
	mawile: {
		inherit: true,
		baseStats: {hp: 70, atk: 95, def: 90, spa: 55, spd: 85, spe: 55},
		abilities: {0: "Hyper Cutter", 1: "Intimidate", H: "Sheer Force", S: "Steelworker"},
	},
	toxicroak: {
		inherit: true,
		baseStats: {hp: 83, atk: 121, def: 75, spa: 86, spd: 75, spe: 110},
	},
	noivern: {
		inherit: true,
		baseStats: {hp: 85, atk: 70, def: 80, spa: 107, spd: 80, spe: 123},
		abilities: {0: "Frisk", 1: "Infiltrator", H: "Telepathy", S: "Aerilate"},
	},
	weezinggalar: {
		inherit: true,
		baseStats: {hp: 75, atk: 90, def: 120, spa: 85, spd: 85, spe: 60},
	},
	alcremie: {
		inherit: true,
		baseStats: {hp: 70, atk: 60, def: 90, spa: 125, spd: 120, spe: 40},
		abilities: {0: "Sweet Veil", 1: "Natural Cure", H: "Aroma Veil"},
	},
	alcremiegmax: {
		inherit: true,
		baseStats: {hp: 70, atk: 60, def: 90, spa: 125, spd: 120, spe: 40},
		abilities: {0: "Sweet Veil", 1: "Natural Cure", H: "Aroma Veil"},
	},
	ninetalesalola: {
		inherit: true,
		baseStats: {hp: 75, atk: 45, def: 80, spa: 120, spd: 80, spe: 120},
		abilities: {0: "Snow Cloak", 1: "Refrigerate", H: "Snow Warning", S: "Pixilate"},
	},
	gallade: {
		inherit: true,
		baseStats: {hp: 68, atk: 125, def: 65, spa: 65, spd: 115, spe: 110},
		abilities: {0: "Steadfast", 1: "Mirror Armor", H: "Justified", S: "Shield Dust"},
	},
	orbeetle: {
		inherit: true,
		baseStats: {hp: 70, atk: 45, def: 120, spa: 100, spd: 130, spe: 90},
		abilities: {0: "Swarm", 1: "Frisk", H: "Wide Guard", S: "Friend Guard"},
	},
	orbeetlegmax: {
		inherit: true,
		baseStats: {hp: 70, atk: 45, def: 120, spa: 100, spd: 130, spe: 90},
		abilities: {0: "Swarm", 1: "Frisk", H: "Wide Guard", S: "Friend Guard"},
	},
	goodra: {
		inherit: true,
		baseStats: {hp: 110, atk: 60, def: 70, spa: 150, spd: 150, spe: 60},
		abilities: {0: "Sap Sipper", 1: "Hydration", H: "Gooey", S: "Thick Fat"},
	},
	drampa: {
		inherit: true,
		baseStats: {hp: 100, atk: 50, def: 90, spa: 155, spd: 100, spe: 25},
		abilities: {0: "Berserk", 1: "Sap Sipper", H: "Cloud Nine", S: "Inner Focus"},
	},
	keldeo: {
		inherit: true,
		baseStats: {hp: 90, atk: 75, def: 80, spa: 135, spd: 80, spe: 120},
	},
	keldeoresolute: {
		inherit: true,
		baseStats: {hp: 90, atk: 75, def: 80, spa: 135, spd: 80, spe: 120},
	},
	blastoise: {
		inherit: true,
		baseStats: {hp: 90, atk: 60, def: 125, spa: 65, spd: 125, spe: 75},
		abilities: {0: "Torrent", 1: "Prankster", H: "Rain Dish"},
	},
	blastoisegmax: {
		inherit: true,
		baseStats: {hp: 90, atk: 60, def: 125, spa: 65, spd: 125, spe: 75},
		abilities: {0: "Torrent", 1: "Prankster", H: "Rain Dish"},
	},
	marowakalola: {
		inherit: true,
		baseStats: {hp: 75, atk: 85, def: 115, spa: 50, spd: 90, spe: 40},
		abilities: {0: "Cursed Body", 1: "Lightning Rod", H: "Rock Head"},
	},
	araquanid: {
		inherit: true,
		baseStats: {hp: 68, atk: 80, def: 92, spa: 80, spd: 132, spe: 42},
	},
	dhelmise: {
		inherit: true,
		baseStats: {hp: 80, atk: 151, def: 113, spa: 66, spd: 90, spe: 50},
	},
	snorlax: {
		inherit: true,
		abilities: {0: "Immunity", 1: "Thick Fat", H: "Gluttony", S: "Poison Heal"},
	},
	obstagoon: {
		inherit: true,
		baseStats: {hp: 95, atk: 105, def: 105, spa: 60, spd: 85, spe: 95},
	},
	vikavolt: {
		inherit: true,
		abilities: {0: "Levitate", 1: "Electric Surge"},
	},
	exeggutor: {
		inherit: true,
		baseStats: {hp: 95, atk: 75, def: 95, spa: 125, spd: 95, spe: 45},
		abilities: {0: "Chlorophyll", 1: "Drought", H: "Harvest"},
	},
	exeggutoralola: {
		inherit: true,
		baseStats: {hp: 95, atk: 125, def: 95, spa: 75, spd: 95, spe: 45},
		abilities: {0: "Frisk", 1: "Grassy Surge", H: "Harvest"},
	},
};
