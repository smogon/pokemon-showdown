// surfnWOB sub-ZU tier ladder for Gen 3.
//
// Reclassifies 17 mons out of upstream's ZU into the custom SU (Sub-zero Used)
// and IU (Incredibly Used) tiers that the [Gen 3] SU / [Gen 3] IU formats are
// built on. This lives in its own mod (inheriting gen3) so the reclassification
// no longer leaks into stock Gen 3 formats — those keep upstream tiers.
//
// `inherit: true` merges over the parent species entry instead of replacing it,
// so any other fields gen3 attaches to these mons survive (see sim/dex.ts merge).
export const FormatsData: import('../../../sim/dex-species').ModdedSpeciesFormatsDataTable = {
	// SU — Sub-zero Used
	ivysaur: { inherit: true, tier: "SU" },
	parasect: { inherit: true, tier: "SU" },
	farfetchd: { inherit: true, tier: "SU" },
	ditto: { inherit: true, tier: "SU" },
	sunflora: { inherit: true, tier: "SU" },
	delibird: { inherit: true, tier: "SU" },
	grovyle: { inherit: true, tier: "SU" },
	dustox: { inherit: true, tier: "SU" },
	illumise: { inherit: true, tier: "SU" },
	nosepass: { inherit: true, tier: "SU" },
	spinda: { inherit: true, tier: "SU" },
	// IU — Incredibly Used
	butterfree: { inherit: true, tier: "IU" },
	ledian: { inherit: true, tier: "IU" },
	unown: { inherit: true, tier: "IU" },
	beautifly: { inherit: true, tier: "IU" },
	masquerain: { inherit: true, tier: "IU" },
	luvdisc: { inherit: true, tier: "IU" },
};
