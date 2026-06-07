export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	// Re-legalize the abilities used by the custom Mega/Primal formes so they
	// validate in Gen 3. Each Mega's intended ability lives in the base data
	// (inherited via pokedex.ts); here we just clear the gen gate / Future flag.
	//
	// NOT re-legalized: Pixilate (Gardevoir-Mega, Altaria-Mega) — it converts
	// Normal-type moves to Fairy, which doesn't exist in Gen 3, so those formes
	// keep a Gen-3 ability instead (see pokedex.ts).

	// Canonical later-gen abilities
	toughclaws: { inherit: true, gen: 3, isNonstandard: null },
	megalauncher: { inherit: true, gen: 3, isNonstandard: null },
	adaptability: { inherit: true, gen: 3, isNonstandard: null },
	noguard: { inherit: true, gen: 3, isNonstandard: null },
	magicbounce: { inherit: true, gen: 3, isNonstandard: null },
	innardsout: { inherit: true, gen: 3, isNonstandard: null },
	parentalbond: { inherit: true, gen: 3, isNonstandard: null },
	aerilate: { inherit: true, gen: 3, isNonstandard: null },
	moldbreaker: { inherit: true, gen: 3, isNonstandard: null },
	multiscale: { inherit: true, gen: 3, isNonstandard: null },
	steadfast: { inherit: true, gen: 3, isNonstandard: null },
	sandforce: { inherit: true, gen: 3, isNonstandard: null },
	technician: { inherit: true, gen: 3, isNonstandard: null },
	skilllink: { inherit: true, gen: 3, isNonstandard: null },
	stalwart: { inherit: true, gen: 3, isNonstandard: null },
	solarpower: { inherit: true, gen: 3, isNonstandard: null },
	filter: { inherit: true, gen: 3, isNonstandard: null },
	strongjaw: { inherit: true, gen: 3, isNonstandard: null },
	sheerforce: { inherit: true, gen: 3, isNonstandard: null },
	prankster: { inherit: true, gen: 3, isNonstandard: null },
	refrigerate: { inherit: true, gen: 3, isNonstandard: null },
	primordialsea: { inherit: true, gen: 3, isNonstandard: null },
	desolateland: { inherit: true, gen: 3, isNonstandard: null },

	// Custom fork abilities (originally isNonstandard: "Future")
	megasol: { inherit: true, gen: 3, isNonstandard: null },
	dragonize: { inherit: true, gen: 3, isNonstandard: null },
};
