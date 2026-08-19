export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	spicyspray: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (!source.trySetStatus('brn', target) && !source.status && source.hasType('Fire')) {
				this.add('-immune', source);
			}
		},
	},
};
