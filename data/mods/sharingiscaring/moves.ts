export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	poltergeist: {
		inherit: true,
		onTry(attacker, defender) {
			return !!defender.item || Object.keys(defender.volatiles).some(volatile => volatile.startsWith('item:'));
		},
	},
};
