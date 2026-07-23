/**
 * Mega/Primal additions to the vanilla Gen 3 Random Battle pool.
 *
 * Every transformation has one explicit first-pass set and level in sets.json.
 * Keeping those values in data makes balance changes reviewable and avoids
 * inheriting base-form roles that depend on an item the Mega Stone displaces.
 */

export const MEGA_FORMES = [
	'venusaurmega',
	'charizardmegax',
	'charizardmegay',
	'blastoisemega',
	'beedrillmega',
	'pidgeotmega',
	'raichumegax',
	'raichumegay',
	'clefablemega',
	'alakazammega',
	'victreebelmega',
	'slowbromega',
	'gengarmega',
	'kangaskhanmega',
	'starmiemega',
	'pinsirmega',
	'gyaradosmega',
	'aerodactylmega',
	'dragonitemega',
	'mewtwomegax',
	'mewtwomegay',
	'meganiummega',
	'feraligatrmega',
	'ampharosmega',
	'steelixmega',
	'scizormega',
	'heracrossmega',
	'skarmorymega',
	'houndoommega',
	'tyranitarmega',
	'sceptilemega',
	'blazikenmega',
	'swampertmega',
	'gardevoirmega',
	'sableyemega',
	'mawilemega',
	'aggronmega',
	'medichammega',
	'manectricmega',
	'sharpedomega',
	'cameruptmega',
	'altariamega',
	'banettemega',
	'chimechomega',
	'absolmega',
	'glaliemega',
	'salamencemega',
	'metagrossmega',
	'latiasmega',
	'latiosmega',
	'kyogreprimal',
	'groudonprimal',
] as const;

export type Gen3MegaForme = typeof MEGA_FORMES[number];

export const MEGA_RANDOM_SETS: Record<Gen3MegaForme, RandomTeamsTypes.RandomSpeciesData> =
	require('./sets.json');
