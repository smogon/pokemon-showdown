/* eslint-disable @stylistic/max-len */

export const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {
	// Pokemon whose otherFormes include Mega forms need updating so the
	// engine knows to look for them.  Entries that already list the right
	// formes in the parent data still need `inherit: true, gen: 3` so
	// their computed gen doesn't prevent the forme from loading.
	//
	// Each Mega keeps its intended (canonical or custom) ability; those
	// abilities are re-legalized for Gen 3 in abilities.ts. The exception is
	// Pixilate (Normal→Fairy), which can't work without the Fairy type, so the
	// Gardevoir/Altaria formes fall back to a Gen-3 ability below.

	// === GENERATION 1 ===
	hitmonchanmega: { inherit: true, gen: 3, isNonstandard: null },
	dittomega: { inherit: true, gen: 3, isNonstandard: null },
	venomoth: { inherit: true, otherFormes: ["Venomoth-Mega"] },

	// === GENERATION 2 ===
	yanmega: { inherit: true, gen: 3 },
	noctowlmega: { inherit: true, gen: 3, isNonstandard: null },
	mantinemega: { inherit: true, gen: 3, isNonstandard: null },
	quagsire: { inherit: true, otherFormes: ["Quagsire-Mega"] },
	corsola: { inherit: true, otherFormes: ["Corsola-Galar", "Corsola-Mega"] },

	// === GENERATION 3 ===
	mightyenamegax: { inherit: true, gen: 3, isNonstandard: null, baseStats: { hp: 61, atk: 110, def: 60, spa: 119, spd: 60, spe: 110 }, abilities: { 0: "Serene Grace" } },
	mightyenamegay: { inherit: true, gen: 3, isNonstandard: null, types: ["Dark", "Poison"], baseStats: { hp: 100, atk: 100, def: 100, spa: 35, spd: 110, spe: 95 }, abilities: { 0: "Fur Coat" } },
	walreinmega: { inherit: true, gen: 3, isNonstandard: null, types: ["Water", "Ice"] },
	masquerain: { inherit: true, otherFormes: ["Masquerain-Mega"] },
	shedinja: { inherit: true, otherFormes: ["Shedinja-Mega"] },
	volbeat: { inherit: true, otherFormes: ["Volbeat-Mega"] },
	illumise: { inherit: true, otherFormes: ["Illumise-Mega"] },
	grumpig: { inherit: true, otherFormes: ["Grumpig-Mega"] },
	flygon: { inherit: true, otherFormes: ["Flygon-Mega"] },
	solrock: { inherit: true, otherFormes: ["Solrock-Mega"] },
	kecleon: { inherit: true, otherFormes: ["Kecleon-Mega-X", "Kecleon-Mega-Y"] },
	// Rayquaza-Mega excluded: requires Dragon Ascent which doesn't exist in Gen 3

	// === Base-forme ability corrections ===
	// Re-legalizing later-gen abilities for the Mega formes (abilities.ts) had the
	// side effect of un-stripping the same abilities from their *base* formes: the
	// Gen-3 species loader only drops a slot-1 ability when its gen is exactly 4,
	// and re-legalizing rewrites that gen to 3. Pin these base formes back to their
	// real Gen-3 ability so e.g. Cloyster can't run Skill Link, Machamp No Guard.
	// (The Mega formes are separate species and keep their re-legalized ability.)
	mrmime: { inherit: true, abilities: { 0: "Soundproof" } },
	tyrogue: { inherit: true, abilities: { 0: "Guts" } },
	hitmontop: { inherit: true, abilities: { 0: "Intimidate" } },
	meowth: { inherit: true, abilities: { 0: "Pickup" } },
	persian: { inherit: true, abilities: { 0: "Limber" } },
	machop: { inherit: true, abilities: { 0: "Guts" } },
	machoke: { inherit: true, abilities: { 0: "Guts" } },
	machamp: { inherit: true, abilities: { 0: "Guts" } },
	shellder: { inherit: true, abilities: { 0: "Shell Armor" } },
	cloyster: { inherit: true, abilities: { 0: "Shell Armor" } },
	scyther: { inherit: true, abilities: { 0: "Swarm" } },
	pinsir: { inherit: true, abilities: { 0: "Hyper Cutter" } },
	eevee: { inherit: true, abilities: { 0: "Run Away" } },
	sunkern: { inherit: true, abilities: { 0: "Chlorophyll" } },
	sunflora: { inherit: true, abilities: { 0: "Chlorophyll" } },
	scizor: { inherit: true, abilities: { 0: "Swarm" } },
	smeargle: { inherit: true, abilities: { 0: "Own Tempo" } },
	tropius: { inherit: true, abilities: { 0: "Chlorophyll" } },

	// New roster data delivered with this revision. These are defined in the mod so
	// the custom CAP roster does not leak into unrelated formats.
	venomothmega: { num: 49, name: "Venomoth-Mega", baseSpecies: "Venomoth", forme: "Mega", types: ["Bug", "Poison"], baseStats: { hp: 85, atk: 100, def: 60, spa: 100, spd: 80, spe: 120 }, abilities: { 0: "Merciless" }, heightm: 1.5, weightkg: 12.5, color: "Purple", eggGroups: ["Bug"], requiredItem: "Venomite", gen: 3, isNonstandard: null },
	quagsiremega: { num: 196, name: "Quagsire-Mega", baseSpecies: "Quagsire", forme: "Mega", types: ["Water", "Ground"], baseStats: { hp: 110, atk: 95, def: 110, spa: 90, spd: 90, spe: 35 }, abilities: { 0: "Unaware" }, heightm: 1.4, weightkg: 75, color: "Blue", eggGroups: ["Water 1", "Field"], requiredItem: "Quagsite", gen: 3, isNonstandard: null },
	corsolamega: { num: 222, name: "Corsola-Mega", baseSpecies: "Corsola", forme: "Mega", types: ["Water", "Psychic"], baseStats: { hp: 90, atk: 100, def: 120, spa: 100, spd: 95, spe: 35 }, abilities: { 0: "Natural Cure" }, heightm: 0.6, weightkg: 5, color: "Pink", eggGroups: ["Water 1", "Water 3"], requiredItem: "Corsolite", gen: 3, isNonstandard: null },
	masquerainmega: { num: 284, name: "Masquerain-Mega", baseSpecies: "Masquerain", forme: "Mega", types: ["Bug", "Water"], baseStats: { hp: 91, atk: 80, def: 84, spa: 90, spd: 110, spe: 95 }, abilities: { 0: "Water Bubble" }, heightm: 0.8, weightkg: 3.6, color: "Blue", eggGroups: ["Water 1", "Bug"], requiredItem: "Masquerite", gen: 3, isNonstandard: null },
	shedinjamega: { num: 292, name: "Shedinja-Mega", baseSpecies: "Shedinja", forme: "Mega", types: ["Bug", "Ghost"], baseStats: { hp: 4, atk: 110, def: 45, spa: 51, spd: 30, spe: 96 }, maxHP: 4, abilities: { 0: "Wonder Guard" }, heightm: 0.8, weightkg: 1.2, color: "Brown", eggGroups: ["Mineral"], requiredItem: "Shedinjite", gen: 3, isNonstandard: null },
	volbeatmega: { num: 313, name: "Volbeat-Mega", baseSpecies: "Volbeat", forme: "Mega", types: ["Bug", "Electric"], baseStats: { hp: 85, atk: 65, def: 75, spa: 90, spd: 90, spe: 125 }, abilities: { 0: "Teravolt" }, heightm: 0.7, weightkg: 17.7, color: "Gray", eggGroups: ["Bug", "Human-Like"], requiredItem: "Volbeatite", gen: 3, isNonstandard: null },
	illumisemega: { num: 314, name: "Illumise-Mega", baseSpecies: "Illumise", forme: "Mega", types: ["Bug", "Electric"], baseStats: { hp: 70, atk: 70, def: 90, spa: 125, spd: 90, spe: 85 }, abilities: { 0: "Prankster" }, heightm: 0.6, weightkg: 17.7, color: "Purple", eggGroups: ["Bug", "Human-Like"], requiredItem: "Illumite", gen: 3, isNonstandard: null },
	grumpigmega: { num: 326, name: "Grumpig-Mega", baseSpecies: "Grumpig", forme: "Mega", types: ["Psychic"], baseStats: { hp: 100, atk: 60, def: 80, spa: 125, spd: 125, spe: 80 }, abilities: { 0: "Opportunist" }, heightm: 0.9, weightkg: 71.5, color: "Purple", eggGroups: ["Field"], requiredItem: "Grumpigite", gen: 3, isNonstandard: null },
	flygonmega: { num: 330, name: "Flygon-Mega", baseSpecies: "Flygon", forme: "Mega", types: ["Ground", "Dragon"], baseStats: { hp: 80, atk: 100, def: 120, spa: 100, spd: 80, spe: 110 }, abilities: { 0: "Sandy" }, heightm: 2, weightkg: 82, color: "Green", eggGroups: ["Bug", "Dragon"], requiredItem: "Flygonite", gen: 3, isNonstandard: null },
	solrockmega: { num: 338, name: "Solrock-Mega", baseSpecies: "Solrock", forme: "Mega", types: ["Rock", "Psychic"], baseStats: { hp: 90, atk: 115, def: 110, spa: 90, spd: 85, spe: 90 }, abilities: { 0: "High Noon" }, heightm: 1.2, weightkg: 154, color: "Red", eggGroups: ["Mineral"], requiredItem: "Sole Rock", gen: 3, isNonstandard: null },
	kecleonmegax: { num: 352, name: "Kecleon-Mega-X", baseSpecies: "Kecleon", forme: "Mega", types: ["Normal"], baseStats: { hp: 60, atk: 120, def: 60, spa: 110, spd: 120, spe: 105 }, abilities: { 0: "Color Change" }, heightm: 1, weightkg: 22, color: "Green", eggGroups: ["Field"], requiredItem: "Kecleite X", gen: 3, isNonstandard: null },
	kecleonmegay: { num: 352, name: "Kecleon-Mega-Y", baseSpecies: "Kecleon", forme: "Mega", types: ["Normal"], baseStats: { hp: 100, atk: 100, def: 120, spa: 100, spd: 100, spe: 40 }, abilities: { 0: "Protean" }, heightm: 1, weightkg: 22, color: "Green", eggGroups: ["Field"], requiredItem: "Kecleite Y", gen: 3, isNonstandard: null },
	parasectmega: { inherit: true, gen: 3, isNonstandard: null, baseStats: { hp: 90, atk: 125, def: 100, spa: 60, spd: 100, spe: 30 }, abilities: { 0: "Perish Body" } },
	magcargomega: { inherit: true, gen: 3, isNonstandard: null, baseStats: { hp: 80, atk: 100, def: 125, spa: 100, spd: 125, spe: 30 }, abilities: { 0: "Earth Eater" } },
	beautiflymega: { inherit: true, gen: 3, isNonstandard: null, types: ["Grass", "Flying"], baseStats: { hp: 90, atk: 10, def: 90, spa: 130, spd: 90, spe: 116 }, abilities: { 0: "Mega Sol" } },
	luvdiscmega: { inherit: true, gen: 3, isNonstandard: null, baseStats: { hp: 45, atk: 70, def: 25, spa: 160, spd: 25, spe: 125 }, abilities: { 0: "Soul-Heart" } },
};
