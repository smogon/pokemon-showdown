/** Tiering for the Fakemon dex (generated). */
import { FormatsData as GeneratedFormatsData } from './generated/formats-data';

const Overrides: import('../../../sim/dex-species').ModdedSpeciesFormatsDataTable = {};

export const FormatsData: import('../../../sim/dex-species').ModdedSpeciesFormatsDataTable = {
	...GeneratedFormatsData,
	...Overrides,
};
