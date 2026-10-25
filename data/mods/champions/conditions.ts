export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	par: {
		inherit: true,
		onBeforeMove(pokemon) {
			if (this.randomChance(1, 8)) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		},
	},
	slp: {
		inherit: true,
		onStart(defender, attacker, sourceEffect) {
			if (sourceEffect?.effectType === 'Ability') {
				this.add('-status', defender, 'slp', '[from] ability: ' + sourceEffect.name, `[of] ${attacker}`);
			} else if (sourceEffect?.effectType === 'Move') {
				this.add('-status', defender, 'slp', `[from] move: ${sourceEffect.name}`);
			} else {
				this.add('-status', defender, 'slp');
			}

			// 1/3 chance for a Pokemon to wake up on turn 2
			this.effectState.startTime = this.sample([2, 3, 3]);
			this.effectState.time = this.effectState.startTime;

			if (defender.removeVolatile('nightmare')) {
				this.add('-end', defender, 'Nightmare', '[silent]');
			}
		},
	},
	frz: {
		inherit: true,
		onStart(defender, attacker, sourceEffect) {
			if (sourceEffect?.effectType === 'Ability') {
				this.add('-status', defender, 'frz', '[from] ability: ' + sourceEffect.name, `[of] ${attacker}`);
			} else {
				this.add('-status', defender, 'frz');
			}
			if (defender.species.name === 'Shaymin-Sky' && defender.baseSpecies.baseSpecies === 'Shaymin') {
				defender.formeChange('Shaymin', this.effect, true);
			}

			this.effectState.startTime = 3;
			this.effectState.time = this.effectState.startTime;
		},
		onBeforeMove(pokemon, defender, move) {
			if (move.flags['defrost'] && !(move.id === 'burnup' && !pokemon.hasType('Fire'))) return;
			pokemon.statusState.time--;
			if (pokemon.statusState.time <= 0 || this.randomChance(1, 4)) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
	},
};
