// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts

import { CustomMods, type CustomModInfo } from '../data/custom-mods';

/**
 * DigiPen fork: every custom content mod gets the same eight formats, generated here.
 *
 * Adding a mod to `data/custom-mods.ts` is what adds its formats; there is nothing to write by
 * hand. Keeping the set identical across mods is also what lets the client map a format to a
 * teambuilder table from its name alone, instead of a `case` per format.
 *
 * Mechanics, which are less obvious than they look:
 *
 * - **Mega Evolution and Z-Moves** are not banned by any ruleset. Mega stones and Z-crystals are
 *   simply `isNonstandard: "Past"` items, so every format here runs `NatDex Mod` to allow them.
 * - **Terastallization** stays on because none of these inherit `[Gen 9] National Dex`, which is
 *   what adds `Terastal Clause`. `NatDex Mod` separately turns Tera off for Mega, Primal and Ultra
 *   formes, which is the real-game behaviour.
 * - **Dynamax** needs no ban: `sim/side.ts` disables it outside gen 8, and Gmax formes are
 *   `natDexTier: "Illegal"`, which `NatDex Mod` rejects.
 * - **`+Future`** has to be explicit — `NatDex Mod` grants `+Unobtainable` and `+Past` only. The
 *   Champions Pokémon it lets in also need the National Dex tiers that `gen9modbase` gives them.
 * - **`+Light of Ruin`** is what makes Mega Floette usable. Upstream's National Dex check flags
 *   that move by id no matter what, but honours `+move:` on it.
 * - **Mod-only formats** (`Singles`, `VGC`) ban `All Pokemon` and unban the mod. Mega and armoured
 *   formes still work, because the ban check runs against the forme the item produces, which is
 *   the mod's own species.
 */

function customModFormats(mod: CustomModInfo): import('../sim/dex-formats').FormatList {
	const label = mod.label;
	// The National Dex mechanics every format here shares.
	const mechanics = ['+Future', '+Light of Ruin'];
	const withMod = [`+${label}`, ...mechanics];
	// A mod-only pool. `All Pokemon` has to be banned inside the ruleset rather than via `banlist`,
	// because every `+` rule must resolve after it and the whole ruleset resolves before the banlist.
	const modOnly = ['-All Pokemon', ...withMod];
	const vgcBase = ['Flat Rules', 'NatDex Mod', '!! Adjust Level = 50', 'VGC Timer', 'Open Team Sheets'];
	const natDex = ['Standard NatDex', ...withMod];
	const vgc = [...vgcBase, ...withMod];
	const doubles = { mod: mod.id, searchShow: false, gameType: 'doubles' as const, bestOfDefault: true };

	return [
		{
			section: `${mod.fullName} Singles`,
			column: 1,
		},
		{
			// Only the mod's own Pokémon, and all of them.
			name: `[Gen 9 ${label}] Singles`,
			mod: mod.id,
			searchShow: false,
			ruleset: ['Standard AG', 'NatDex Mod', 'Species Clause', 'Nickname Clause', ...modOnly],
		},
		{
			// Arceus is tagged Mythical rather than Restricted Legendary, so it needs banning by
			// name. `Arceus` resolves to `basepokemon:arceus`, which covers all eighteen formes.
			// The client mirrors this list in `BattleCustomMods.nationalDexBanned`.
			name: `[Gen 9 ${label}] National Dex`,
			mod: mod.id,
			searchShow: false,
			ruleset: natDex,
			banlist: ['Restricted Legendary', 'Arceus'],
		},
		{
			name: `[Gen 9 ${label}] National Dex Ubers`,
			mod: mod.id,
			searchShow: false,
			ruleset: natDex,
		},
		{
			section: `${mod.fullName} Doubles`,
			column: 1,
		},
		{
			// Only the mod's own Pokémon, and all of them.
			name: `[Gen 9 ${label}] VGC`,
			...doubles,
			ruleset: [...vgcBase, ...modOnly],
		},
		{
			name: `[Gen 9 ${label}] VGC Non-Restricted`,
			...doubles,
			ruleset: vgc,
		},
		{
			name: `[Gen 9 ${label}] VGC Restricted`,
			...doubles,
			ruleset: [...vgc, 'Limit One Restricted'],
			restricted: ['Restricted Legendary'],
		},
		{
			name: `[Gen 9 ${label}] VGC Dual Restricted`,
			...doubles,
			ruleset: [...vgc, 'Limit Two Restricted'],
			restricted: ['Restricted Legendary'],
		},
		{
			name: `[Gen 9 ${label}] VGC Mythical`,
			...doubles,
			ruleset: [...vgc, 'Limit Two Restricted'],
			restricted: ['Restricted Legendary', 'Mythical'],
		},
	];
}

export const Formats: import('../sim/dex-formats').FormatList =
	CustomMods.flatMap(customModFormats);
