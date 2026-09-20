/**
 * DigiPen fork: the registry of custom content ("fakemon") mods.
 *
 * This is the single place that knows which fakemon mods exist. Tags, existence tags, tier names,
 * the generated format list, the client's teambuilder tables and the dex's mod switcher are all
 * driven from it, so adding a mod should mean adding an entry here plus a folder under
 * `data/mods/`, not editing a dozen switch statements.
 *
 * Adding a mod:
 *   1. Add an entry below.
 *   2. Add `data/mods/<id>/` with `scripts.ts` (`inherit: 'gen9modbase'`) and its data files.
 *   3. Add the label to `CustomModName` in `sim/global-types.ts` — the one place the type system
 *      needs a literal, since `Nonstandard` and `TierTypes.Other` are derived from it.
 *   4. Add the id to `CLIENT_MODS` in the client's `build-tools/build-translations` so the client
 *      ships its data.
 *
 * Nothing else should need to change. See `docs/fakemon/` in the workspace for the whole picture.
 */

export interface CustomModInfo {
	/** Mod id, i.e. the folder name under `data/mods/`. */
	id: string;
	/**
	 * Short label. This is the `isNonstandard` value its exclusive content carries, the stem of its
	 * tier names (`DigiPen`, `DigiPen NFE`, `DigiPen LC`), the name inside a format's brackets
	 * (`[Gen 9 FNAF] Singles`) and the word used in teambuilder and dex headers.
	 */
	label: string;
	/**
	 * Full name, used only for the format dropdown's section labels, where there is room for it.
	 * Equal to `label` when the mod has no longer name.
	 */
	fullName: string;
	/** Format-id and tag prefix. Always `toID(label)`. */
	prefix: string;
}

export const CustomMods: CustomModInfo[] = [
	{ id: 'gen9digipen', label: 'DigiPen', fullName: 'DigiPen', prefix: 'digipen' },
	{ id: 'gen9fnaf', label: 'FNAF', fullName: "Five Nights at Freddy's", prefix: 'fnaf' },
];

/** The mod whose exclusive content is marked with this `isNonstandard` value, if any. */
export function getCustomModByLabel(label: string | undefined | null): CustomModInfo | undefined {
	if (!label) return undefined;
	return CustomMods.find(mod => mod.label === label);
}

/** The mod a species/move/item/ability belongs to exclusively, if any. */
export function getCustomMod(thing: { isNonstandard?: string | null }): CustomModInfo | undefined {
	return getCustomModByLabel(thing.isNonstandard);
}

/**
 * A mod's three tier names, in teambuilder order: fully evolved, not fully evolved, little cup.
 * A mod-exclusive species is assigned one of these from its evolution line; see `dex-species.ts`.
 */
export function getCustomModTiers(label: string) {
	return { fe: label, nfe: `${label} NFE`, lc: `${label} LC` };
}
