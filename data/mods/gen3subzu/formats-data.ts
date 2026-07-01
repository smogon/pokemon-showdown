// surfnWOB sub-ZU tier ladder for Gen 3.
//
// Reclassifies mons out of upstream's ZU into the custom SU (Sub-zero Used) and
// IU (Incredibly Used) tiers that the [Gen 3] SU / [Gen 3] IU formats are built
// on. This lives in its own mod (inheriting gen3) so the reclassification no
// longer leaks into stock Gen 3 formats — those keep upstream tiers.
//
// `inherit: true` merges over the parent species entry instead of replacing it,
// so any other fields gen3 attaches to these mons survive (see sim/dex.ts merge).
//
// === SU roster ===
// The SU tier is the ADV Sub-zero Used Viability Rankings, every mon ranked
// ABOVE the C band — i.e. S, S-, A+, A, A-, B+, B, B-. The C ranks (C+, C, C-)
// and unranked mons are intentionally left out ("ignore the ones below").
// Source: Smogon ADV Sub-zero Used VR thread, post 10612321 (last updated
// 2026-05-03). Re-derive from that post if the VR shifts.
//
// Tagging tier: "SU" here also fixes the teambuilder display: build-indexes
// buckets gen3subzu mons by species.tier (no NFE short-circuit for this mod),
// so NFE mons (Aron, Bagon, Larvitar, Geodude, …) now sort under the "SU"
// header instead of "NFEs not in a higher tier".
export const FormatsData: import('../../../sim/dex-species').ModdedSpeciesFormatsDataTable = {
	// Grovyle and Ivysaur are "NEW" (unranked) on the SU VR and are held OUT of the
	// SU pool: they are tagged "ZU" so the [Gen 3] SU / IU banlists (which ban the
	// ZU tag) exclude them, and Tier Shift gives them the ZU +35 rather than the SU
	// +40. Tagging "ZU" (not "New") also keeps the teambuilder bucketing sane.
	grovyle: { inherit: true, tier: "ZU" }, // NEW (unranked) -> held at ZU, banned from SU
	ivysaur: { inherit: true, tier: "ZU" }, // NEW (unranked) -> held at ZU, banned from SU

	// --- S Ranks ---
	illumise: { inherit: true, tier: "SU" }, // S
	staryu: { inherit: true, tier: "SU" }, // S
	delibird: { inherit: true, tier: "SU" }, // S-
	spinda: { inherit: true, tier: "SU" }, // S-

	// --- A Ranks ---
	croconaw: { inherit: true, tier: "SU" }, // A+
	dustox: { inherit: true, tier: "SU" }, // A+
	nosepass: { inherit: true, tier: "SU" }, // A+
	sunflora: { inherit: true, tier: "SU" }, // A+
	wailmer: { inherit: true, tier: "SU" }, // A+
	aron: { inherit: true, tier: "SU" }, // A
	grimer: { inherit: true, tier: "SU" }, // A
	growlithe: { inherit: true, tier: "SU" }, // A
	lombre: { inherit: true, tier: "SU" }, // A
	onix: { inherit: true, tier: "SU" }, // A
	spoink: { inherit: true, tier: "SU" }, // A
	taillow: { inherit: true, tier: "SU" }, // A
	weepinbell: { inherit: true, tier: "SU" }, // A
	bayleef: { inherit: true, tier: "SU" }, // A-
	meowth: { inherit: true, tier: "SU" }, // A-
	nidorino: { inherit: true, tier: "SU" }, // A-
	smoochum: { inherit: true, tier: "SU" }, // A-
	snorunt: { inherit: true, tier: "SU" }, // A-

	// --- B Ranks ---
	cacnea: { inherit: true, tier: "SU" }, // B+
	cyndaquil: { inherit: true, tier: "SU" }, // B+
	exeggcute: { inherit: true, tier: "SU" }, // B+
	farfetchd: { inherit: true, tier: "SU" }, // B+
	horsea: { inherit: true, tier: "SU" }, // B+
	shuppet: { inherit: true, tier: "SU" }, // B+
	snubbull: { inherit: true, tier: "SU" }, // B+
	clefairy: { inherit: true, tier: "SU" }, // B
	larvitar: { inherit: true, tier: "SU" }, // B
	parasect: { inherit: true, tier: "SU" }, // B
	pidgeotto: { inherit: true, tier: "SU" }, // B
	slowpoke: { inherit: true, tier: "SU" }, // B
	bagon: { inherit: true, tier: "SU" }, // B-
	geodude: { inherit: true, tier: "SU" }, // B-
	luvdisc: { inherit: true, tier: "SU" }, // B-
	mankey: { inherit: true, tier: "SU" }, // B-
	mareep: { inherit: true, tier: "SU" }, // B-
	masquerain: { inherit: true, tier: "SU" }, // B-
	numel: { inherit: true, tier: "SU" }, // B-

	// Carried over from the pre-VR hand-curated list; not on the current SU VR.
	// Left as SU pending a call on whether to drop it.
	ditto: { inherit: true, tier: "SU" },

	// IU — Incredibly Used. These predate the VR import and sit at/below the C
	// band on the SU VR (Butterfree/Ledian/Beautifly are C-), so they're kept out
	// of SU per "ignore the ones below" and parked in IU for now.
	butterfree: { inherit: true, tier: "IU" },
	ledian: { inherit: true, tier: "IU" },
	unown: { inherit: true, tier: "IU" },
	beautifly: { inherit: true, tier: "IU" },
};
