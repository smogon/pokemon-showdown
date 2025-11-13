export const Conditions: {[id: string]: ModdedConditionData} = {
	raindance: {
		inherit: true,
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Water') {
				this.debug('rain water boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Fire' && !attacker.hasAbility('hakkero')) {
				this.debug('rain fire suppress');
				return this.chainModify(0.5);
			}
		},
	},
	dynamax: {
		inherit: true,
		onResidual(pokemon) {
			pokemon.removeVolatile('dynamax');
			pokemon.hasDynamaxed = true;
		},
	},
};
