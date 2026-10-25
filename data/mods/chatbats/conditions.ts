export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	frostbite: {
		name: 'frostbite',
		effectType: 'Status',
		onStart(defender) {
			this.add('-start', defender, 'Frostbite', '[silent]');
			this.add('-message', `${defender.species.name} is inflicted with frostbite!`);
		},
		onSwitchIn(pokemon) {
			this.add('-start', pokemon, 'Frostbite', '[silent]');
		},
		onResidualOrder: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
		},
		onBasePower(basePower, attacker, defender) {
			return basePower / 2;
		},
	},
};
