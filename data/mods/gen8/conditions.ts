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
