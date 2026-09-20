/**
 * DigiPen fork: the pokemon tags each custom content mod gets, generated from `custom-mods.ts`.
 *
 * Spread into `Tags` in `tags.ts`. Every mod gets the same four, which is what makes a format's
 * `+DigiPen` / `+FNAF` and its banlist entries work the same way for every mod:
 *
 *   `<prefix>`      generic  — the mod's exclusive content, of any kind. This one has to be a
 *                              `genericFilter`, not a `speciesFilter`: it is also what tells the
 *                              validator that the mod's items, moves and abilities exist. A
 *                              species-only filter silently rejects the mod's items.
 *   `<prefix>tier`  species  — fully evolved mod-exclusive Pokémon.
 *   `<prefix>nfe`   species  — not fully evolved.
 *   `<prefix>lc`    species  — little cup.
 *
 * The three tier tags exist so that `<Mod> NFE` and friends are valid banlist entries.
 */

import { CustomMods, getCustomModTiers } from './custom-mods';
import type { TagData } from './tags';

const tags: { [id: string]: TagData } = {};

for (const mod of CustomMods) {
	const tiers = getCustomModTiers(mod.label);
	tags[mod.prefix] = {
		name: mod.label,
		genericFilter: thing => thing.isNonstandard === mod.label,
	};
	tags[`${mod.prefix}tier`] = {
		name: `${mod.label} Tier`,
		speciesFilter: species => species.tier === tiers.fe,
	};
	tags[`${mod.prefix}nfe`] = {
		name: tiers.nfe,
		speciesFilter: species => species.tier === tiers.nfe,
	};
	tags[`${mod.prefix}lc`] = {
		name: tiers.lc,
		speciesFilter: species => species.tier === tiers.lc,
	};
}

export const CustomModTags = tags as { [id: IDEntry]: TagData };
