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

	venusaurmega: {
		inherit: true,
		gen: 3,
		// Thick Fat exists in Gen 3 — no change
	},
	charizardmegax: {
		inherit: true,
		gen: 3,
		// Fire/Dragon — no Fairy, OK
		// Tough Claws re-legalized (abilities.ts)
	},
	charizardmegay: {
		inherit: true,
		gen: 3,
		// Drought exists in Gen 3 — no change
	},
	blastoisemega: {
		inherit: true,
		gen: 3,
		// Mega Launcher re-legalized (abilities.ts)
	},
	beedrillmega: {
		inherit: true,
		gen: 3,
		// Adaptability re-legalized (abilities.ts)
	},
	pidgeotmega: {
		inherit: true,
		gen: 3,
		// No Guard re-legalized (abilities.ts)
	},
	clefablemega: {
		inherit: true,
		gen: 3,
		// Fairy/Flying → Clefable is Normal monotype in Gen 3, stays Normal
		types: ["Normal"],
		// Magic Bounce re-legalized (abilities.ts)
	},
	alakazammega: {
		inherit: true,
		gen: 3,
		// Trace exists in Gen 3 — no change
	},
	victreebelmega: {
		inherit: true,
		gen: 3,
		// Innards Out re-legalized (abilities.ts)
	},
	slowbromega: {
		inherit: true,
		gen: 3,
		// Shell Armor exists in Gen 3 — no change
	},
	gengarmega: {
		inherit: true,
		gen: 3,
		// Shadow Tag exists in Gen 3 — no change
	},
	kangaskhanmega: {
		inherit: true,
		gen: 3,
		// Parental Bond re-legalized (abilities.ts)
	},
	starmiemega: {
		inherit: true,
		gen: 3,
		// Huge Power exists in Gen 3 — no change
	},
	pinsirmega: {
		inherit: true,
		gen: 3,
		// Aerilate re-legalized (abilities.ts) — converts Normal→Flying, OK in Gen 3
	},
	gyaradosmega: {
		inherit: true,
		gen: 3,
		// Mold Breaker re-legalized (abilities.ts)
	},
	aerodactylmega: {
		inherit: true,
		gen: 3,
		// Tough Claws re-legalized (abilities.ts)
	},
	dragonitemega: {
		inherit: true,
		gen: 3,
		// Multiscale re-legalized (abilities.ts)
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

	meganiummega: {
		inherit: true,
		gen: 3,
		// Grass/Fairy → Meganium is Grass monotype, stays Grass
		types: ["Grass"],
		// Mega Sol re-legalized (abilities.ts)
	},
	feraligatrmega: {
		inherit: true,
		gen: 3,
		// Water/Dragon — no Fairy, OK
		// Dragonize re-legalized (abilities.ts) — converts Normal→Dragon, OK in Gen 3
	},
	ampharosmega: {
		inherit: true,
		gen: 3,
		// Mold Breaker re-legalized (abilities.ts)
	},
	steelixmega: {
		inherit: true,
		gen: 3,
		// Sand Force re-legalized (abilities.ts)
	},
	scizormega: {
		inherit: true,
		gen: 3,
		// Technician re-legalized (abilities.ts)
	},
	heracrossmega: {
		inherit: true,
		gen: 3,
		// Skill Link re-legalized (abilities.ts)
	},
	skarmorymega: {
		inherit: true,
		gen: 3,
		// Stalwart re-legalized (abilities.ts)
	},
	houndoommega: {
		inherit: true,
		gen: 3,
		// Solar Power re-legalized (abilities.ts)
	},
	tyranitarmega: {
		inherit: true,
		gen: 3,
		// Sand Stream exists in Gen 3 — no change
	},

	// === GENERATION 3 ===

	sceptilemega: {
		inherit: true,
		gen: 3,
		// Lightning Rod exists in Gen 3 — no change
	},
	blazikenmega: {
		inherit: true,
		gen: 3,
		// Speed Boost exists in Gen 3 — no change
	},
	swampertmega: {
		inherit: true,
		gen: 3,
		// Swift Swim exists in Gen 3 — no change
	},
	gardevoirmega: {
		inherit: true,
		gen: 3,
		// Psychic/Fairy → Gardevoir is Psychic monotype in Gen 3, stays Psychic
		types: ["Psychic"],
		// Pixilate can't be legalized (Normal→Fairy, no Fairy type in Gen 3) → Synchronize
		abilities: { 0: "Synchronize" },
	},
	sableyemega: {
		inherit: true,
		gen: 3,
		// Magic Bounce re-legalized (abilities.ts)
	},
	mawilemega: {
		inherit: true,
		gen: 3,
		// Steel/Fairy → Mawile is Steel monotype in Gen 3, stays Steel
		types: ["Steel"],
		// Huge Power exists in Gen 3 — keep it
	},
	aggronmega: {
		inherit: true,
		gen: 3,
		// Filter re-legalized (abilities.ts)
	},
	medichammega: {
		inherit: true,
		gen: 3,
		// Pure Power exists in Gen 3 — no change
	},
	manectricmega: {
		inherit: true,
		gen: 3,
		// Intimidate exists in Gen 3 — no change
	},
	sharpedomega: {
		inherit: true,
		gen: 3,
		// Strong Jaw re-legalized (abilities.ts)
	},
	cameruptmega: {
		inherit: true,
		gen: 3,
		// Sheer Force re-legalized (abilities.ts)
	},
	altariamega: {
		inherit: true,
		gen: 3,
		// Dragon/Fairy → Altaria is Dragon/Flying, keep secondary type
		types: ["Dragon", "Flying"],
		// Pixilate can't be legalized (Normal→Fairy, no Fairy type in Gen 3) → Natural Cure
		abilities: { 0: "Natural Cure" },
	},
	banettemega: {
		inherit: true,
		gen: 3,
		// Prankster re-legalized (abilities.ts)
	},
	chimechomega: {
		inherit: true,
		gen: 3,
		// Levitate exists in Gen 3 — no change
	},
	absolmega: {
		inherit: true,
		gen: 3,
		// Magic Bounce re-legalized (abilities.ts)
	},
	// Absol-Mega-Z excluded: forme has no finalized ability yet
	glaliemega: {
		inherit: true,
		gen: 3,
		// Refrigerate re-legalized (abilities.ts) — converts Normal→Ice, OK in Gen 3
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
