/**
 * Central image paths for the Fakemon system.
 *
 * This is the ONLY place that knows where images live. Nothing else in the code
 * hard-codes an image path, so replacing the placeholders with real artwork is a
 * matter of dropping files into `assets/` - no code search required.
 *
 * Naming rule: every file is named after the entry's ID (lowercase, letters and
 * digits only). `Hallowisp-Mega` -> `assets/pokemon/hallowispmega.png`.
 * `assets/manifest.json` lists the expected path of every single entry.
 *
 * Anything that has no file yet falls back to `assets/placeholder.png`, so the
 * game always renders.
 */

import { toID } from '../../../sim/dex-data';

/** Change this one constant to serve assets from a CDN or another folder. */
export const ASSET_ROOT = 'assets';

export const ASSET_PATHS = {
	placeholder: `${ASSET_ROOT}/placeholder.png`,
	iconPlaceholder: `${ASSET_ROOT}/pokemon-icons/placeholder.png`,
	pokemon: `${ASSET_ROOT}/pokemon`,
	pokemonIcons: `${ASSET_ROOT}/pokemon-icons`,
	moves: `${ASSET_ROOT}/moves`,
	abilities: `${ASSET_ROOT}/abilities`,
	items: `${ASSET_ROOT}/items`,
	mega: `${ASSET_ROOT}/mega`,
	ui: `${ASSET_ROOT}/ui`,
} as const;

export type AssetKind = 'pokemon' | 'pokemonIcons' | 'moves' | 'abilities' | 'items' | 'mega';

/**
 * The path an asset would live at. Callers that render should pass the result
 * through their own "does this file exist" check and fall back to
 * `ASSET_PATHS.placeholder`; `assetUrlWithFallback` does that for Node callers.
 */
export function assetPath(kind: AssetKind, name: string): string {
	return `${ASSET_PATHS[kind]}/${toID(name)}.png`;
}

/** Node-side helper: the real path if the file exists, else the placeholder. */
export function assetUrlWithFallback(kind: AssetKind, name: string): string {
	const path = assetPath(kind, name);
	try {
		const fs = require('fs') as typeof import('fs');
		if (fs.existsSync(path)) return path;
	} catch {}
	return kind === 'pokemonIcons' ? ASSET_PATHS.iconPlaceholder : ASSET_PATHS.placeholder;
}
