export const FormatsData: import('../../../sim/dex-species').ModdedSpeciesFormatsDataTable = {
	// ==========================================================================
	// [Gen 3] Megas usage-based tiering
	// --------------------------------------------------------------------------
	// Tiers here define the OU / UU split for the [Gen 3] Megas metagame, driven
	// by ladder usage:
	//   * usage >= 4.52%           -> OU   (banned from [Gen 3] Megas UU)
	//   * usage <  4.52%           -> UU
	//   * old UUBL is reset        -> UU   (unless usage promotes it to OU)
	//   * a Mega whose BASE form is real OU -> "(OU)" = OU by technicality
	//     (banned from UU even with ~0 Mega usage, e.g. Mega Swampert)
	//   * Mega Alakazam            -> OU   (explicit exception)
	// "(OU)" and "OU" both match the `OU` ban tag, so both are excluded from UU.
	// Pokemon already below UU (RU/NU/etc.) keep their inherited tier and stay
	// UU-legal; only entries that actually change are listed.
	// ==========================================================================

	// --- Mega forms & Primals -------------------------------------------------
	// Tiering follows the rules above. Uber / AG Megas are untouched (banned from
	// both OU and UU already).

	// Gen 1
	venusaurmega: { tier: "UU" },
	charizardmegax: { tier: "OU" }, // usage
	charizardmegay: { tier: "OU" }, // usage
	blastoisemega: { tier: "UU" },
	beedrillmega: { tier: "OU" }, // usage
	pidgeotmega: { tier: "UU" },
	raichumegax: { tier: "UU" },
	raichumegay: { tier: "UU" },
	clefablemega: { tier: "UU" },
	alakazammega: { tier: "OU" }, // explicit exception: Mega Alakazam stays OU
	victreebelmega: { tier: "UU" },
	slowbromega: { tier: "UU" },
	gengarmega: { tier: "Uber" },
	// Kangaskhan-Mega: dropped from Uber, with the broken Parental Bond + fixed-damage-move
	// combo complex-banned in config/formats.ts (onValidateSet) instead. Kept OU (like Mega
	// Alakazam) despite sub-4.52% usage — it's new to the format, so it starts in OU rather
	// than being seeded into UU by low early usage.
	kangaskhanmega: { tier: "OU" },
	starmiemega: { tier: "UU" },
	pinsirmega: { tier: "UU" },
	gyaradosmega: { tier: "(OU)" }, // technicality: base Gyarados is OU
	aerodactylmega: { tier: "OU" }, // usage (base Aerodactyl also OU)
	dragonitemega: { tier: "UU" },
	mewtwomegax: { tier: "Uber" },
	mewtwomegay: { tier: "Uber" },

	// Gen 2
	meganiummega: { tier: "UU" },
	feraligatrmega: { tier: "UU" },
	ampharosmega: { tier: "UU" },
	steelixmega: { tier: "OU" }, // usage
	scizormega: { tier: "UU" },
	heracrossmega: { tier: "UU" },
	skarmorymega: { tier: "(OU)" }, // technicality: base Skarmory is OU
	houndoommega: { tier: "UU" },
	tyranitarmega: { tier: "Uber" },

	// Gen 3
	sceptilemega: { tier: "UU" },
	blazikenmega: { tier: "Uber" },
	swampertmega: { tier: "(OU)" }, // technicality: base Swampert is OU
	gardevoirmega: { tier: "UU" },
	sableyemega: { tier: "UU" },
	mawilemega: { tier: "UU" },
	aggronmega: { tier: "UU" },
	medichammega: { tier: "Uber" },
	manectricmega: { tier: "UU" },
	sharpedomega: { tier: "UU" },
	cameruptmega: { tier: "UU" },
	altariamega: { tier: "UU" },
	banettemega: { tier: "UU" },
	chimechomega: { tier: "UU" },
	absolmega: { tier: "UU" },
	glaliemega: { tier: "UU" },
	// Banned to AG (above Ubers): the 'Uber' tag covers AG so it's out of [Gen 3]
	// Megas, and [Gen 3] Megas Ubers bans the 'AG' tag so it's out of there too.
	salamencemega: { tier: "AG" },
	metagrossmega: { tier: "Uber" },
	latiasmega: { tier: "Uber" },
	latiosmega: { tier: "Uber" },

	// Primals
	kyogreprimal: { tier: "Uber" },
	groudonprimal: { tier: "Uber" },

	// --- Base forms: usage-based OU/UU overrides ------------------------------
	// Overrides the inherited Gen 3 (ADV) tier for base species in this metagame.

	// Promoted to OU by usage (>= 4.52%). Were UUBL / (OU) in ADV.
	exeggutor: { tier: "OU" },
	miltank: { tier: "OU" },
	raikou: { tier: "OU" },
	regirock: { tier: "OU" },
	registeel: { tier: "OU" },
	vaporeon: { tier: "OU" },

	// Dropped to UU: usage < 4.52% (former OU/(OU)) or UUBL reset.
	alakazam: { tier: "UU" },
	armaldo: { tier: "UU" },
	articuno: { tier: "UU" },
	blaziken: { tier: "UU" },
	breloom: { tier: "UU" },
	chansey: { tier: "UU" },
	charizard: { tier: "UU" },
	crobat: { tier: "UU" },
	dodrio: { tier: "UU" },
	donphan: { tier: "UU" },
	dragonite: { tier: "UU" },
	dusclops: { tier: "UU" },
	entei: { tier: "UU" },
	espeon: { tier: "UU" },
	gardevoir: { tier: "UU" },
	hariyama: { tier: "UU" },
	heracross: { tier: "UU" },
	houndoom: { tier: "UU" },
	jolteon: { tier: "UU" },
	jynx: { tier: "UU" },
	kadabra: { tier: "UU" },
	kingdra: { tier: "UU" },
	linoone: { tier: "UU" },
	ludicolo: { tier: "UU" },
	machamp: { tier: "UU" },
	marowak: { tier: "UU" },
	medicham: { tier: "UU" },
	porygon2: { tier: "UU" },
	regice: { tier: "UU" },
	rhydon: { tier: "UU" },
	sceptile: { tier: "UU" },
	scizor: { tier: "UU" },
	slaking: { tier: "UU" },
	slowbro: { tier: "UU" },
	smeargle: { tier: "UU" },
	starmie: { tier: "UU" },
	steelix: { tier: "UU" },
	swellow: { tier: "UU" },
	tauros: { tier: "UU" },
	typhlosion: { tier: "UU" },
	umbreon: { tier: "UU" },
	ursaring: { tier: "UU" },
	venusaur: { tier: "UU" },
	weezing: { tier: "UU" },
	zangoose: { tier: "UU" },
};
