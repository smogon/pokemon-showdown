/**
 * Fakemon species. The table itself is generated from the dex PDF
 * (`tools/fakemon/build.py`); this file exists so extra hand-written species or
 * tweaks can be layered on top without touching generated output.
 */
import { Pokedex as GeneratedPokedex } from './generated/pokedex';

/** Hand-written overrides, applied on top of the generated dex. */
const Overrides: import('../../../sim/dex-species').ModdedSpeciesDataTable = {};

export const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {
	...GeneratedPokedex,
	...Overrides,
};
