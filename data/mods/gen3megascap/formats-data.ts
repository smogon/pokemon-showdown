export const FormatsData: import('../../../sim/dex-species').ModdedSpeciesFormatsDataTable = {
	// ==========================================================================
	// [Gen 3] Megas usage-based tiering
	// --------------------------------------------------------------------------
	// Tiers here define the OU / UU split for the [Gen 3] Megas metagame, driven
	// by ladder usage:
	//   * usage >= 4.52%           -> OU   (banned from [Gen 3] Megas UU)
	//   * usage <  4.52%           -> UU
	//   * old UUBL is reset        -> UU   (unless usage promotes it to OU)
//   * banned from UU by council -> "UUBL" (out of UU, still OU-legal; e.g. Mega Heracross)
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
	gengarmega: { tier: "Uber" },
	mewtwomegax: { tier: "Uber" },
	mewtwomegay: { tier: "Uber" },

	// Gen 2
	magcargomega: { tier: "OU" },

	// Gen 3
	blazikenmega: { tier: "Uber" },
	medichammega: { tier: "Uber" },
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
	zangoose: { tier: "OU" },

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
};
