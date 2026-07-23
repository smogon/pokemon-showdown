export const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {
	// Legacy Mega/Primal formes plus the Champions-supported Mega roster are
	// backported when their base species exists by Gen 4. Legends: Z-A-only
	// formes remain nonstandard, matching the existing gen3mega roster policy.
	//
	// Gen 4 has no Fairy type. Formes that gain Fairy retain their pre-Fairy
	// typing, and Pixilate users retain an era-compatible base-line ability.

	// Gen 1
	venusaurmega: { inherit: true, gen: 4 },
	charizardmegax: { inherit: true, gen: 4 },
	charizardmegay: { inherit: true, gen: 4 },
	blastoisemega: { inherit: true, gen: 4 },
	beedrillmega: { inherit: true, gen: 4 },
	pidgeotmega: { inherit: true, gen: 4 },
	raichumegax: {
		inherit: true,
		gen: 4,
		// Electric Terrain does not exist in Gen 4.
		abilities: { 0: "Static" },
	},
	raichumegay: { inherit: true, gen: 4 },
	clefablemega: {
		inherit: true,
		gen: 4,
		types: ["Normal", "Flying"],
	},
	alakazammega: { inherit: true, gen: 4 },
	victreebelmega: { inherit: true, gen: 4 },
	slowbromega: { inherit: true, gen: 4 },
	gengarmega: { inherit: true, gen: 4 },
	kangaskhanmega: { inherit: true, gen: 4 },
	starmiemega: { inherit: true, gen: 4 },
	pinsirmega: { inherit: true, gen: 4 },
	gyaradosmega: { inherit: true, gen: 4 },
	aerodactylmega: { inherit: true, gen: 4 },
	dragonitemega: { inherit: true, gen: 4 },
	mewtwomegax: { inherit: true, gen: 4 },
	mewtwomegay: { inherit: true, gen: 4 },

	// Gen 2
	meganiummega: {
		inherit: true,
		gen: 4,
		types: ["Grass"],
	},
	feraligatrmega: { inherit: true, gen: 4 },
	ampharosmega: { inherit: true, gen: 4 },
	steelixmega: { inherit: true, gen: 4 },
	scizormega: { inherit: true, gen: 4 },
	heracrossmega: { inherit: true, gen: 4 },
	skarmorymega: { inherit: true, gen: 4 },
	houndoommega: { inherit: true, gen: 4 },
	tyranitarmega: { inherit: true, gen: 4 },

	// Gen 3
	sceptilemega: { inherit: true, gen: 4 },
	blazikenmega: { inherit: true, gen: 4 },
	swampertmega: { inherit: true, gen: 4 },
	gardevoirmega: {
		inherit: true,
		gen: 4,
		types: ["Psychic"],
		abilities: { 0: "Trace" },
	},
	sableyemega: { inherit: true, gen: 4 },
	mawilemega: {
		inherit: true,
		gen: 4,
		types: ["Steel"],
	},
	aggronmega: { inherit: true, gen: 4 },
	medichammega: { inherit: true, gen: 4 },
	manectricmega: { inherit: true, gen: 4 },
	sharpedomega: { inherit: true, gen: 4 },
	cameruptmega: { inherit: true, gen: 4 },
	altariamega: {
		inherit: true,
		gen: 4,
		types: ["Dragon", "Flying"],
		abilities: { 0: "Natural Cure" },
	},
	banettemega: { inherit: true, gen: 4 },
	chimechomega: { inherit: true, gen: 4 },
	absolmega: { inherit: true, gen: 4 },
	glaliemega: { inherit: true, gen: 4 },
	salamencemega: { inherit: true, gen: 4 },
	metagrossmega: { inherit: true, gen: 4 },
	latiasmega: { inherit: true, gen: 4 },
	latiosmega: { inherit: true, gen: 4 },
	kyogreprimal: { inherit: true, gen: 4 },
	groudonprimal: { inherit: true, gen: 4 },

	// Gen 4
	staraptormega: { inherit: true, gen: 4 },
	lopunnymega: { inherit: true, gen: 4 },
	garchompmega: { inherit: true, gen: 4 },
	lucariomega: { inherit: true, gen: 4 },
	abomasnowmega: { inherit: true, gen: 4 },
	gallademega: { inherit: true, gen: 4 },
	froslassmega: { inherit: true, gen: 4 },

	// Rayquaza-Mega is excluded: Dragon Ascent is not obtainable in Gen 4.
};
