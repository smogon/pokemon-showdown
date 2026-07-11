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
	gengarmega: {
		inherit: true,
		gen: 3,
		// Shadow Tag exists in Gen 3 — no change
	},
	mewtwomegax: {
		inherit: true,
		gen: 3,
		// Steadfast re-legalized (abilities.ts)
	},
	mewtwomegay: {
		inherit: true,
		gen: 3,
		// Insomnia exists in Gen 3 — no change
	},

	// === GENERATION 2 ===
	magcargomega: {
		num: 219,
		gen: 3,
		name: "Magcargo-Mega",
		baseSpecies: "Magcargo",
		forme: "Mega",
		types: ["Fire", "Rock"],
		baseStats: { hp: 80, atk: 90, def: 125, spa: 90, spd: 125, spe: 30 },
		abilities: { 0: "Drought" },
		heightm: 0.8,
		weightkg: 55,
		color: "Red",
		eggGroups: ["Amorphous"],
		requiredItem: "Magcargoite",
	},

	// === GENERATION 3 ===
	blazikenmega: {
		inherit: true,
		gen: 3,
		// Speed Boost exists in Gen 3 — no change
	},
	medichammega: {
		inherit: true,
		gen: 3,
		// Pure Power exists in Gen 3 — no change
	},
	salamencemega: {
		inherit: true,
		gen: 3,
		// Aerilate re-legalized (abilities.ts) — converts Normal→Flying, OK in Gen 3
	},
	metagrossmega: {
		inherit: true,
		gen: 3,
		// Tough Claws re-legalized (abilities.ts)
	},
	latiasmega: {
		inherit: true,
		gen: 3,
		// Levitate exists in Gen 3 — no change
	},
	latiosmega: {
		inherit: true,
		gen: 3,
		// Levitate exists in Gen 3 — no change
	},
	kyogreprimal: {
		inherit: true,
		gen: 3,
		// Primordial Sea re-legalized (abilities.ts)
	},
	groudonprimal: {
		inherit: true,
		gen: 3,
		// Desolate Land re-legalized (abilities.ts)
	},
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
};
