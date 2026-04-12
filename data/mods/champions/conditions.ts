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
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'slp', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', `[from] move: ${sourceEffect.name}`);
			} else {
				this.add('-status', target, 'slp');
			}

			// 1/3 chance for a Pokemon to wake up on turn 2
			this.effectState.startTime = this.sample([2, 3, 3]);
			this.effectState.time = this.effectState.startTime;

			if (target.removeVolatile('nightmare')) {
				this.add('-end', target, 'Nightmare', '[silent]');
			}
		},
	},
	frz: {
		inherit: true,
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'frz', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'frz');
			}
			if (target.species.name === 'Shaymin-Sky' && target.baseSpecies.baseSpecies === 'Shaymin') {
				target.formeChange('Shaymin', this.effect, true);
			}

			this.effectState.startTime = 3;
			this.effectState.time = this.effectState.startTime;
		},
		onBeforeMove(pokemon, target, move) {
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

	raindance: {
		inherit: true,
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (attacker.effectiveWeather() !== 'raindance') return;
			if (move.type === 'Water') {
				this.debug('rain water boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Fire') {
				this.debug('rain fire suppress');
				return this.chainModify(0.5);
			}
		},
	},
	primordialsea: {
		inherit: true,
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (attacker.effectiveWeather() !== 'primordialsea') return;
			if (move.type === 'Water') {
				this.debug('Rain water boost');
				return this.chainModify(1.5);
			}
		},
	},
	sunnyday: {
		inherit: true,
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (attacker.effectiveWeather() !== 'sunnyday') return;
			if (move.id === 'hydrosteam') {
				this.debug('Sunny Day Hydro Steam boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Fire') {
				this.debug('Sunny Day fire boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Water') {
				this.debug('Sunny Day water suppress');
				return this.chainModify(0.5);
			}
		},
	},
	desolateland: {
		inherit: true,
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (attacker.effectiveWeather() !== 'desolateland') return;
			if (move.type === 'Fire') {
				this.debug('Desolate Land fire boost');
				return this.chainModify(1.5);
			}
		},
	},
	sandstorm: {
		inherit: true,
		onModifySpD(spd, target, source) {
			if (target.hasType('Rock') && source.effectiveWeather() === 'sandstorm') {
				return this.modify(spd, 1.5);
			}
		},
	},
	snowscape: {
		inherit: true,
		onModifyDef(def, target, source) {
			if (target.hasType('Ice') && source.effectiveWeather() === 'snowscape') {
				return this.modify(def, 1.5);
			}
		},
	},
	// TODO: check Mega Sol's interaction with Deltastream
	// deltastream: {
	// 	inherit: true,
	// 	onEffectiveness(typeMod, target, type, move) {
	// 		if (move && move.effectType === 'Move' && move.category !== 'Status' && type === 'Flying' && typeMod > 0) {
	// 			this.add('-fieldactivate', 'Delta Stream');
	// 			return 0;
	// 		}
	// 	},
	// },
};
