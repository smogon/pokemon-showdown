export const Conditions: {[k: string]: ModdedConditionData} = {
	par: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (!pokemon.hasAbility('unflagging')) {
				return this.chainModify(0.5);
			}
		},
		onBeforeMove(pokemon) {
			if (this.randomChance(1, 4) && !pokemon.hasAbility('unflagging')) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		},
	},
	slp: {
		inherit: true,
		onBeforeMove(pokemon, target, move) {
			if (pokemon.hasAbility('earlybird')) {
				pokemon.statusData.time--;
			}
			pokemon.statusData.time--;
			if (pokemon.statusData.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable || pokemon.hasAbility('unflagging')) {
				return;
			}
			return false;
		},
	},
	frz: {
		inherit: true,
		onBeforeMove(pokemon, target, move) {
			if (move.flags['defrost']) return;
			if (this.randomChance(1, 5)) {
				pokemon.cureStatus();
				return;
			}
			if (pokemon.hasAbility('unflagging')) {
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
	},
};
