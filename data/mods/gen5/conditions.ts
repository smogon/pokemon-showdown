export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	sandstorm: {
		name: 'Sandstorm',
		effectType: 'ClimateWeather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('weatherballoon')) {
				return 8;
			}
			return 5;
		},
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) {
			if (pokemon.effectiveClimateWeather() !== 'sandstorm') return;
			if (pokemon.hasType('Rock') && this.field.isClimateWeather('sandstorm')) {
				return this.modify(spd, 1.5);
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-climateWeather', 'Sandstorm', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-climateWeather', 'Sandstorm');
			}
		},
		onFieldResidualOrder: 8,
		onFieldResidual() {
			this.add('-climateWeather', 'Sandstorm', '[upkeep]');
			if (this.field.isClimateWeather('sandstorm')) this.eachEvent('ClimateWeather');
		},
		onClimateWeather(target) {
			this.damage(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-climateWeather', 'none');
		},
	},
	slp: {
		inherit: true,
		onSwitchIn(target) {
			this.effectState.time = this.effectState.startTime;
		},
	},
	partiallytrapped: {
		inherit: true,
		onStart(pokemon, source) {
			this.add('-activate', pokemon, 'move: ' + this.effectState.sourceEffect, `[of] ${source}`);
			this.effectState.boundDivisor = source.hasItem('bindingband') ? 8 : 16;
		},
		onResidual(pokemon) {
			const trapper = this.effectState.source;
			if (trapper && (!trapper.isActive || trapper.hp <= 0 || !trapper.activeTurns)) {
				delete pokemon.volatiles['partiallytrapped'];
				this.add('-end', pokemon, this.effectState.sourceEffect, '[partiallytrapped]', '[silent]');
				return;
			}
			this.damage(pokemon.baseMaxhp / this.effectState.boundDivisor);
		},
	},
	stall: {
		// Protect, Detect, Endure counter
		duration: 2,
		counterMax: 256,
		onStart() {
			this.effectState.counter = 2;
		},
		onStallMove() {
			// this.effectState.counter should never be undefined here.
			// However, just in case, use 1 if it is undefined.
			const counter = this.effectState.counter || 1;
			if (counter >= 256) {
				return this.randomChance(1, 2 ** 32);
			}
			this.debug(`Success chance: ${Math.round(100 / counter)}%`);
			return this.randomChance(1, counter);
		},
		onRestart() {
			if (this.effectState.counter < (this.effect as Condition).counterMax!) {
				this.effectState.counter *= 2;
			}
			this.effectState.duration = 2;
		},
	},
	gem: {
		duration: 1,
		affectsFainted: true,
		onBasePower(basePower, user, target, move) {
			this.debug('Gem Boost');
			return this.chainModify(1.5);
		},
	},
};
