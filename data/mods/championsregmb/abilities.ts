export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	stalwart: {
		inherit: true,
		onModifyMove(move) {
			// most of the implementation is in Battle#getTarget
			move.tracksTarget = move.target !== 'scripted';
		},
	},
};
