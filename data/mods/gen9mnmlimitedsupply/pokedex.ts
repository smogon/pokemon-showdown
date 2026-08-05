export const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {
	sableyemega: {
		inherit: true,
		baseStats: { hp: 50, atk: 90, def: 120, spa: 80, spd: 110, spe: 30 },
	},
	tyranitarmega: {
		inherit: true,
		baseStats: { hp: 100, atk: 164, def: 160, spa: 75, spd: 120, spe: 81 },
		abilities: { 0: "Stamina" },
	},
	falinksmega: {
		inherit: true,
		baseStats: { hp: 65, atk: 135, def: 110, spa: 75, spd: 70, spe: 110 },
		abilities: { 0: "Brass Bond" },
	},
	abomasnowmega: {
		inherit: true,
		baseStats: { hp: 90, atk: 132, def: 95, spa: 132, spd: 85, spe: 60 },
		abilities: { 0: "Ice Scales" },
	},
	dianciemega: {
		inherit: true,
		baseStats: { hp: 50, atk: 150, def: 125, spa: 150, spd: 125, spe: 100 },
		abilities: { 0: "Rocky Payload" },
	},
	mewtwomegax: {
		inherit: true,
		baseStats: { hp: 106, atk: 110, def: 135, spa: 154, spd: 135, spe: 140 },
		abilities: { 0: "Pure Power" },
		types: ["Psychic", "Fighting"],
	},
	mewtwomegay: {
		inherit: true,
		baseStats: { hp: 106, atk: 104, def: 120, spa: 180, spd: 120, spe: 150 },
		abilities: { 0: "Dark Aura" },
		types: ["Psychic", "Dark"],
	},
	emboarmega: {
		inherit: true,
		baseStats: { hp: 110, atk: 138, def: 75, spa: 135, spd: 95, spe: 75 },
		abilities: { 0: "Neuroforce" },
	},
	ampharosmega: {
		inherit: true,
		baseStats: { hp: 90, atk: 75, def: 100, spa: 155, spd: 130, spe: 55 },
		abilities: { 0: "Fluffy" },
	},
	garchompmega: {
		inherit: true,
		baseStats: { hp: 108, atk: 175, def: 113, spa: 100, spd: 75, spe: 129 },
		abilities: { 0: "Hustle" },
	},
	tatsugirimega: {
		inherit: true,
		baseStats: { hp: 68, atk: 75, def: 90, spa: 135, spd: 125, spe: 92 },
		abilities: { 0: "Supreme Overlord" },
	},
	raichumegax: {
		inherit: true,
		baseStats: { hp: 60, atk: 115, def: 95, spa: 115, spd: 100, spe: 100 },
		abilities: { 0: "Electromorphosis" },
	},
	zeraoramega: {
		inherit: true,
		baseStats: { hp: 88, atk: 157, def: 85, spa: 117, spd: 90, spe: 158 },
		abilities: { 0: "Transistor" },
		types: ["Electric", "Dark"],
	},
};
