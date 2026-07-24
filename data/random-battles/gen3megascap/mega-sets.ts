/**
 * Mega additions to the vanilla Gen 3 Random Battle pool for [Gen 3] Megas CAP.
 *
 * The CAP roster is the community "Create-A-Pokemon" take on Gen 1-3 Megas: a
 * different set of transformations from [Gen 3] Megas (Venomoth, Quagsire,
 * Kecleon, Flygon, ...), each with its own custom typing, stats and ability
 * (re-legalized for Gen 3 by the gen3megascap mod). Every transformation has one
 * explicit first-pass set and level in sets.json, so balance changes stay
 * reviewable and no Mega inherits a base-form role that depends on an item the
 * Mega Stone displaces.
 */

export const MEGA_FORMES = [
	'parasectmega',
	'venomothmega',
	'hitmonchanmega',
	'dittomega',
	'noctowlmega',
	'quagsiremega',
	'magcargomega',
	'corsolamega',
	'mantinemega',
	'mightyenamegax',
	'mightyenamegay',
	'beautiflymega',
	'masquerainmega',
	'shedinjamega',
	'volbeatmega',
	'illumisemega',
	'grumpigmega',
	'flygonmega',
	'solrockmega',
	'kecleonmegax',
	'kecleonmegay',
	'walreinmega',
	'luvdiscmega',
] as const;

export type Gen3MegasCAPForme = typeof MEGA_FORMES[number];

export const MEGA_RANDOM_SETS: Record<Gen3MegasCAPForme, RandomTeamsTypes.RandomSpeciesData> =
	require('./sets.json');
