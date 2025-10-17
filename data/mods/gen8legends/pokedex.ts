export const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {
	pikachu: {
		inherit: true,
		evos: ["Raichu"],
	},
	alakazam: {
		inherit: true,
		evoType: "useItem",
		evoItem: "Linking Cord",
	},
	machamp: {
		inherit: true,
		evoType: "useItem",
		evoItem: "Linking Cord",
	},
	golem: {
		inherit: true,
		evoType: "useItem",
		evoItem: "Linking Cord",
	},
	gengar: {
		inherit: true,
		evoType: "useItem",
		evoItem: "Linking Cord",
	},
	chansey: {
		inherit: true,
		evoType: "useItem",
		evoItem: "Oval Stone",
		evoCondition: "during the day",
	},
	quilava: {
		inherit: true,
		evos: ["Typhlosion-Hisui"],
	},
	steelix: {
		inherit: true,
		evoType: "useItem",
		evoItem: "Metal Coat",
	},
	scizor: {
		inherit: true,
		evoType: "useItem",
		evoItem: "Metal Coat",
	},
	cherrimsunshine: {
		inherit: true,
		baseStats: {hp: 70, atk: 90, def: 70, spa: 87, spd: 117, spe: 85},
	},
	mimejr: {
		inherit: true,
		evos: ["Mr. Mime"],
	},
	weavile: {
		inherit: true,
		evoType: "useItem",
		evoItem: "Razor Claw",
		evoCondition: "at night",
	},
	magnezone: {
		inherit: true,
		evoType: "other",
		evoCondition: "Thunder Stone or near a special magnetic field",
	},
	rhyperior: {
		inherit: true,
		evoType: "useItem",
		evoItem: "Protector",
	},
	electivire: {
		inherit: true,
		evoType: "useItem",
		evoItem: "Electirizer",
	},
	magmortar: {
		inherit: true,
		evoType: "useItem",
		evoItem: "Magmarizer",
	},
	leafeon: {
		inherit: true,
		evoType: "other",
		evoCondition: "Leaf Stone or near a Moss Rock",
	},
	glaceon: {
		inherit: true,
		evoType: "other",
		evoCondition: "Ice Stone or near a Ice Rock",
	},
	gliscor: {
		inherit: true,
		evoType: "useItem",
		evoItem: "Razor Fang",
		evoCondition: "at night",
	},
	probopass: {
		inherit: true,
		evoType: "other",
		evoCondition: "Thunder Stone or near a special magnetic field",
	},
	dusknoir: {
		inherit: true,
		evoType: "useItem",
		evoItem: "Reaper Cloth",
	},
	arceus: {
		inherit: true,
		otherFormes: ["Arceus-Bug", "Arceus-Dark", "Arceus-Dragon", "Arceus-Electric", "Arceus-Fairy", "Arceus-Fighting", "Arceus-Fire", "Arceus-Flying", "Arceus-Ghost", "Arceus-Grass", "Arceus-Ground", "Arceus-Ice", "Arceus-Poison", "Arceus-Psychic", "Arceus-Rock", "Arceus-Steel", "Arceus-Water", "Arceus-Legend"],
		formeOrder: [
			"Arceus", "Arceus-Fighting", "Arceus-Flying", "Arceus-Poison", "Arceus-Ground", "Arceus-Rock", "Arceus-Bug", "Arceus-Ghost", "Arceus-Steel",
			"Arceus-Fire", "Arceus-Water", "Arceus-Grass", "Arceus-Electric", "Arceus-Psychic", "Arceus-Ice", "Arceus-Dragon", "Arceus-Dark", "Arceus-Fairy",
			"Arceus-Legend",
		],
	},
	arceuslegend: {
		num: 493,
		name: "Arceus-Legend",
		baseSpecies: "Arceus",
		forme: "Legend",
		types: ["Normal"],
		gender: "N",
		baseStats: {hp: 120, atk: 120, def: 120, spa: 120, spd: 120, spe: 120},
		abilities: {0: "Multitype"},
		heightm: 3.2,
		weightkg: 320,
		color: "White",
		eggGroups: ["Undiscovered"],
		changesFrom: "Arceus",
		gen: 8,
	},
	dewott: {
		inherit: true,
		evos: ["Samurott-Hisui"],
	},
	petilil: {
		inherit: true,
		evos: ["Lilligant-Hisui"],
	},
	rufflet: {
		inherit: true,
		evos: ["Braviary-Hisui"],
	},
	sylveon: {
		inherit: true,
		evoType: "levelFriendship",
		evoCondition: "with a Fairy-type move",
	},
	goomy: {
		inherit: true,
		evos: ["Sliggoo-Hisui"],
	},
	bergmite: {
		inherit: true,
		evos: ["Avalugg-Hisui"],
	},
	dartrix: {
		inherit: true,
		evos: ["Decidueye-Hisui"],
	},
};
