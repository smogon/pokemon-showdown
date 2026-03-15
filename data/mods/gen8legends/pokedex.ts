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
	quilava: {
		inherit: true,
		evos: ["Typhlosion-Hisui"],
	},
	cherrimsunshine: {
		inherit: true,
		baseStats: { hp: 70, atk: 90, def: 70, spa: 87, spd: 117, spe: 85 },
	},
	mimejr: {
		inherit: true,
		evos: ["Mr. Mime"],
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
	basculegion: {
		inherit: true,
		evoType: "other",
		evoCondition: "Receive 294+ recoil without fainting",
	},
	basculegionf: {
		inherit: true,
		evoType: "other",
		evoCondition: "Receive 294+ recoil without fainting",
	},
	overqwil: {
		inherit: true,
		evoType: "other",
		evoCondition: "Use strong style Barb Barrage 20 times",
	},
};
