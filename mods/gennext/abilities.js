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
					this.setWeather(weather, source, this.getAbility('forecast'));
					this.weatherData.duration = 0;
				};
				move.target = 'self';
			}
		}
	},
	"flowergift": {
		inherit: true,
		onModifyMove: function(move) {
			if (move.id === 'sunnyday') {
				var weather = move.weather;
				move.weather = null;
				move.onHit = function(target, source) {
					this.setWeather(weather, source, this.getAbility('flowergift'));
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
	},
	"compoundeyes": {
		desc: "The accuracy of this Pokemon's moves receives a 50% increase; for example, a 50% accurate move becomes 75% accurate.",
		shortDesc: "This Pokemon's moves have their Accuracy boosted to 1.5x.",
		onModifyMove: function(move) {
			if (typeof move.accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			move.accuracy *= 1.5;
		},
		id: "compoundeyes",
		name: "Compoundeyes",
		rating: 3.5,
		num: 14
	},
	"telepathy": {
		inherit: true,
		onSwitchOut: function() {}
	}
};
