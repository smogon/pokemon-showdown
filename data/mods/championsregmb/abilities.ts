export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	stalwart: {
		onModifyMovePriority: 1,
		onModifyMove(move) {
			// most of the implementation is in Battle#getTarget
			move.tracksTarget = move.target !== 'scripted';
		},
		flags: {},
		name: "Stalwart",
		rating: 0,
		num: 242,
	},
};
