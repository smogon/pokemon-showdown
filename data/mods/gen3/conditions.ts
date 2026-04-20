export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', `[from] move: ${sourceEffect.name}`);
			} else {
				this.add('-status', target, 'slp');
			}
			// 1-4 turns
			this.effectState.time = this.random(2, 6);
			// Turns spent using Sleep Talk/Snore immediately before switching out while asleep
			this.effectState.skippedTime = 0;

			if (target.removeVolatile('nightmare')) {
				this.add('-end', target, 'Nightmare', '[silent]');
			}
		},
		onSwitchIn(target) {
			this.effectState.time += this.effectState.skippedTime;
			this.effectState.skippedTime = 0;
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (pokemon.hasAbility('earlybird')) {
				pokemon.statusState.time--;
			}
			pokemon.statusState.time--;
			if (pokemon.statusState.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) {
				this.effectState.skippedTime++;
				return;
			}
			this.effectState.skippedTime = 0;
			return false;
		},
	},
	frz: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			// don't count Hidden Power or Weather Ball as Fire-type
			if (this.dex.moves.get(move.id).type === 'Fire' && move.category !== 'Status') {
				target.cureStatus();
			}
		},
	},
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
		onFieldResidualOrder: 1,
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
};
