export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	invulnerability: {
		// Dig/Fly
		name: 'invulnerability',
		onInvulnerability(defender, attacker, move) {
			if (defender === attacker) return true;
			if ((move.id === 'swift' && defender.volatiles['substitute']) || move.id === 'transform') return true;
			this.add('-message', 'The foe ' + defender.name + ' can\'t be hit while invulnerable!');
			return false;
		},
	},
};
