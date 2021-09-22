export const Conditions: {[k: string]: ModdedConditionData} = {
	brn: {
		inherit: true,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 8);
		},
	},
	confusion: {
		inherit: true,
		onBeforeMove(pokemon) {
			pokemon.volatiles['confusion'].time--;
			if (!pokemon.volatiles['confusion'].time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (this.randomChance(1, 2)) {
				return;
			}
			const damage = this.actions.getConfusionDamage(pokemon, 40);
			if (typeof damage !== 'number') throw new Error("Confusion damage not dealt");
			this.damage(damage, pokemon, pokemon, {
				id: 'confused',
				effectType: 'Move',
				type: '???',
			} as ActiveMove);
			return false;
		},
	},
	choicelock: {
		inherit: true,
		onBeforeMove() {},
	},
};
