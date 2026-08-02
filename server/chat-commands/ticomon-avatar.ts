export const TICOMON_TRAINER_AVATARS = new Set([
	'red',
	'leaf-gen3',
	'blue',
	'silver',
	'ethan',
	'lyra',
	'brendan',
	'dawn',
	'lucas',
	'barry',
	'dawn-gen4pt',
	'lucas-gen4pt',
	'lance',
	'cheryl',
	'buck',
	'marley',
	'mira',
	'riley',
]);

export function isTicoMonTrainerAvatar(value: unknown): value is string {
	return typeof value === 'string' && TICOMON_TRAINER_AVATARS.has(value);
}
