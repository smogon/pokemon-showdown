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
	parasectmega: { tier: "OU" },
	hitmonchanmega: { tier: "OU" },
	dittomega: { tier: "OU" },

	// Gen 2
	noctowlmega: { tier: "OU" },
	magcargomega: { tier: "OU" },
	mantinemega: { tier: "OU" },

	// Gen 3
	mightyenamegax: { tier: "OU" },
	mightyenamegay: { tier: "OU" },
	beautiflymega: { tier: "OU" },
	walreinmega: { tier: "OU" },
	luvdiscmega: { tier: "OU" },

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

	// No usage means UU is unchanged for now.
};
