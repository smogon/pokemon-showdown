exports.BattleAbilities = {
	"drizzle": {
		inherit: true,
		onStart: function(source) {
			this.setWeather('raindance', null, null);
		}
	},
	"drought": {
		inherit: true,
		onStart: function(source) {
			this.setWeather('sunnyday', null, null);
		}
	},
	"snowwarning": {
		inherit: true,
		onStart: function(source) {
			this.setWeather('hail', null, null);
		}
	},
	"sandstream": {
		inherit: true,
		onStart: function(source) {
			this.setWeather('sandstorm', null, null);
		}
	},
	"forecast": {
		inherit: true,
		onModifyMove: function(move) {
			if (move.weather) {
				var weather = move.weather;
				move.weather = null;
				move.onHit = function(target, source) {
					this.setWeather(weather, source, 'forecast');
					this.weatherData.duration = 0;
				}
			}
		}
	},
	"flowergift": {
		inherit: true,
		onModifyMove: function(move) {
			if (move.id = 'sunnyday') {
				var weather = move.weather;
				move.weather = null;
				move.onHit = function(target, source) {
					this.setWeather(weather, source, 'forecast');
					this.weatherData.duration = 0;
				};
				move.target = 'self';
				move.sideCondition = 'flowergift';
			}
		},
		effect: {
			onSwitchInPriority: 1,
			onSwitchIn: function(target) {
				if (!target.fainted) {
					this.boost({atk:1,spd:1}, target, target, this.getAbility('flowergift'));
				}
				target.side.removeSideCondition('flowergift');
			}
		}
	}
};
