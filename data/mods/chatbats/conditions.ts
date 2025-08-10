export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	frostbite: {
	   name: 'frostbite',
		effectType: 'Status',
		onStart(target) {
		    this.add('-message', `hi`);
		    this.add('-status', target, 'frostbite');
		},
		onResidualOrder: 10,
		onResidual(pokemon) {
			this.add('-message', `hi`);
			this.damage(pokemon.baseMaxhp / 16);
		},
		onBasePower(basePower, source, target) {
			return basePower/2;
		},
	}
};
