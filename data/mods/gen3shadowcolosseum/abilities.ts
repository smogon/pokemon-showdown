export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	shadowdomain: {
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('shadowsky')) {
				if (move.type === 'Shadow') {
					this.debug('Sand Force boost');
					return this.chainModify([5325, 4096]);
				}
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'shadowsky') return false;
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type !== 'Shadow' && this.field.isWeather('shadowsky')) {
				this.debug('Shadow Domain weaken');
				return this.chainModify(0.8);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type !== 'Shadow' && this.field.isWeather('shadowsky')) {
				this.debug('Shadow Domain weaken');
				return this.chainModify(0.8);
			}
		},
		flags: {breakable: 1},
		name: "Shadow Domain",
		rating: 2,
		shortDesc: "If Shadow Sky is active, this Pokemon's Shadow moves deal 1.3x damage and it takes 0.8x damage from non-Shadow moves.",
		gen: 3,
	},
};
