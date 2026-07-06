export const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {
	lugia: {
		inherit: true,
		otherFormes: ["Shadow Lugia"],
		formeOrder: ["Shadow Lugia", "Shadow Lugia"],
	},
	shadowlugia: {
		num: 249,
		name: "Shadow Lugia",
		baseSpecies: "Lugia",
		forme: "Shadow",
		types: ["Psychic", "Flying"],
		gender: "N",
		baseStats: {hp: 154, atk: 110, def: 90, spa: 130, spd: 106, spe: 90},
		abilities: {0: "Shadow Domain"},
		heightm: 5.2,
		weightkg: 216,
		color: "White",
		tags: ["Restricted Legendary"],
		eggGroups: ["Undiscovered"],
		battleOnly: "Lugia",
	},
};
