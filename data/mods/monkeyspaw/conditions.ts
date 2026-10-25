export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	monkeyspaw: {
		name: "Monkey's Paw",
	},
	confusion: {
		inherit: true,
		name: 'confusion',
		// this is a volatile status
		onStart(defender, attacker, sourceEffect) {
			if (sourceEffect?.id === 'lockedmove') {
				this.add('-start', defender, 'confusion', '[fatigue]');
			} else if (sourceEffect?.effectType === 'Ability') {
				this.add('-start', defender, 'confusion', '[from] ability: ' + sourceEffect.name, `[of] ${attacker}`);
			} else {
				this.add('-start', defender, 'confusion');
			}
			const min = sourceEffect?.id === 'axekick' ? 3 : 2;
			if (!defender.m.monkeyPawLuck) this.effectState.time = this.random(min, 6);
		},
		onEnd(defender) {
			this.add('-end', defender, 'confusion');
		},
		onBeforeMovePriority: 3,
		onBeforeMove(pokemon) {
			if (pokemon.m.monkeyPawLuck) pokemon.volatiles['confusion'].time--;
			if (!pokemon.volatiles['confusion'].time && !pokemon.m.monkeyPawLuck) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (!this.randomChance(33, 100)) {
				return;
			}
			this.activeTarget = pokemon;
			const damage = this.actions.getConfusionDamage(pokemon, 40);
			if (typeof damage !== 'number') throw new Error("Confusion damage not dealt");
			const activeMove = { id: this.toID('confused'), effectType: 'Move', type: '???' };
			this.damage(damage, pokemon, pokemon, activeMove as ActiveMove);
			return false;
		},
	},
};
