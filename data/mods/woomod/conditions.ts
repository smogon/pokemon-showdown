export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	frz: {
		onStart(target, source, sourceEffect) {
			this.add('-message', `${target.name} was frozen!`);
			this.hint(`Freeze halves SpA + 1/16 chip, like in Pokemon Legends: Arceus`);
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'frz', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'frz');
			}
		},
		onResidualOrder: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
		},
		onModifySpA(spa, pokemon) {
			return this.chainModify(0.5);
		},
	},
};
