/** Fakemon learnsets (generated; see tools/fakemon/build.py and DATA_GUIDE.md). */
import { Learnsets as GeneratedLearnsets } from './generated/learnsets';

const Overrides: import('../../../sim/dex-species').ModdedLearnsetDataTable = {};

export const Learnsets: import('../../../sim/dex-species').ModdedLearnsetDataTable = {
	...GeneratedLearnsets,
	...Overrides,
};
