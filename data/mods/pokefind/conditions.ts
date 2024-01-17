export const Conditions: {[id: string]: ModdedConditionData} = {
	shadowsky: {
		name: 'ShadowSky',
		effectType: 'Weather',
		duration: 5,
		// durationCallback(source, effect) {
		// 	if (source?.hasItem('icyrock')) {
		// 		return 8;
		// 	}
		// 	return 5;
		// },
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'ShadowSky', '[from] ability: ' + effect.name, '[of] ' + source);
			} else {
				this.add('-weather', 'ShadowSky');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'ShadowSky', '[upkeep]');
			this.eachEvent('Weather');
		},
		onWeather(target) {
			if (!target.hasType('Shadow')) {
				this.damage(target.baseMaxhp / 16);
			}
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
		onModifyMove(move) {
			if (move.type === 'Shadow') move.basePower *= 1.5;
			if (move.name === "Weather Ball") {
				move.type = "???";
				move.basePower *= 2;
			}
		},
	},
};
