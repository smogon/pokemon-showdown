/**
 * DigiPen fork: data fixups every custom content mod runs from its own `scripts.ts` `init()`.
 *
 * `init` is deliberately the one part of `scripts.ts` a mod does **not** inherit from its parent
 * (see `Scripts.init` in `sim/dex.ts`), so each mod calls into here rather than getting this for
 * free from `gen9modbase`.
 */

import type { ModdedDex } from '../sim/dex';

/**
 * Make a mod's learnset entries **add** moves to a base-game Pokémon instead of replacing its
 * movepool.
 *
 * The dex loader merges a mod's data one level deep: `{ ...parentEntry, ...childEntry }`. For most
 * data that is what you want, but a learnset entry's moves live in a nested `learnset` object, so
 * a mod that lists one new move replaces the entire movepool with that one move. Upstream's own
 * mods work around this by writing out complete movepools (see `data/mods/champions/learnsets.ts`);
 * this fork's mods list only their additions, which silently left base-game Pokémon with a single
 * legal move each.
 *
 * A mod's learnset entry for a base-game Pokémon should therefore:
 *   - use `inherit: true`, so sibling keys such as `eventData` and `encounters` survive, and
 *   - list only the moves the mod adds.
 *
 * An entry for one of the mod's own new Pokémon has no parent entry and is left alone.
 */
export function mergeModLearnsets(dex: ModdedDex) {
	if (!dex.parentMod) return;
	const parentLearnsets = dex.mod(dex.parentMod).data.Learnsets;
	for (const id in dex.data.Learnsets) {
		const entry = dex.data.Learnsets[id];
		const parentEntry = parentLearnsets[id];
		// Identical references mean the mod did not declare this entry; it was inherited whole.
		// This is the same check `ModdedDex#modData` uses to spot a mod's own data.
		if (!parentEntry || entry === parentEntry) continue;
		if (!entry.learnset || !parentEntry.learnset) continue;
		entry.learnset = { ...parentEntry.learnset, ...entry.learnset };
	}
}

/** Everything a custom content mod's `init()` should do. */
export function initCustomMod(dex: ModdedDex) {
	mergeModLearnsets(dex);
}
