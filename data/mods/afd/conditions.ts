export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	sandstorm: {
		inherit: true,
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Rock') {
				this.debug('Sandstorm rock boost');
				return this.chainModify(1.5);
			}
		},
	},
	snowscape: {
		inherit: true,
		onModifySpePriority: 10,
		onModifySpe(spe, pokemon) {
			if (!pokemon.getTypes(false, true).includes('Ice') && !pokemon.getTypes(false, true).includes('Steel') &&
				!pokemon.hasAbility(['slushrush', 'snowcloak', 'iceface', 'icebody']) && pokemon.effectiveWeather() === 'snowscape') {
				return this.modify(spe, 0.5);
			}
		},
	},
};
