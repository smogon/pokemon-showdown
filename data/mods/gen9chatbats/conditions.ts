export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	frostbite: {
		name: 'frostbite',
		effectType: 'Status',
		onStart(target) {
			this.add('-start', target, 'Frostbite', '[silent]');
			this.add('-message', `${target.species.name} is inflicted with frostbite!`);
		},
		onSwitchIn(pokemon) {
			this.add('-start', pokemon, 'Frostbite', '[silent]');
		},
		onResidualOrder: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
		},
		onBasePower(basePower, source, target) {
			return basePower / 2;
		},
	},
};
