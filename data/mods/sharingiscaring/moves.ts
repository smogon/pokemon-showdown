export const Moves: {[id: IDEntry]: ModdedMoveData} = {
	poltergeist: {
		inherit: true,
		onTry(source, target) {
			return !!target.item || Object.keys(target.volatiles).some(volatile => volatile.startsWith('item:'));
		},
	},
};
