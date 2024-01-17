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
			this.add('-weather', 'Shadow Sky');
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Shadow Sky', '[upkeep]');
			if (this.field.isWeather('shadowsky')) this.eachEvent('Weather');
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
