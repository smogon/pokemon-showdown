export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	poltergeist: {
		inherit: true,
		onTry(source, target) {
			return !!target.item || Object.keys(target.volatiles).some(volatile => volatile.startsWith('item:'));
		},
	},
};
