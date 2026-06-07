// surfnWOB [Gen 3] ADV 200 mod.
//
// Inherits the upstream RS-only dex (gen3rs) and overlays ONLY the ADV 200 tier
// list. Keeping the tier reassignments here — instead of editing gen3rs in place
// — means gen3rs stays pristine upstream and never conflicts on sync.
export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen3rs',
	gen: 3,
};
