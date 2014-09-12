exports.BattleAbilities = {
	flowergift: {
		inherit: true,
		onUpdate: function (pokemon) {
			if (!pokemon.isActive || pokemon.speciesid !== 'cherrim') return;
			if (this.isWeather('sunnyday') && this.effectData.forme !== 'Sunshine') {
				this.effectData.forme = 'Sunshine';
				this.add('-formechange', pokemon, 'Cherrim-Sunshine');
				var type = pokemon.hpType || 'Dark';
				if (!pokemon.hasType(type)) pokemon.addType(type);
				this.add('-message', pokemon.name + ' transformed!');
			} else {
				if (this.effectData.forme) {
					delete this.effectData.forme;
					this.add('-formechange', pokemon, 'Cherrim');
					var type = pokemon.hpType || 'Dark';
					if (!pokemon.hasType(type)) pokemon.addType(type);
					this.add('-message', pokemon.name + ' transformed!');
				}
			}
		}
	},
	forecast: {
		inherit: true,
		onUpdate: function (pokemon) {
			if (pokemon.baseTemplate.species !== 'Castform' || pokemon.transformed) return;
			var forme = null;
			switch (this.effectiveWeather()) {
			case 'sunnyday':
				if (pokemon.template.speciesid !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
				if (pokemon.template.speciesid !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'hail':
				if (pokemon.template.speciesid !== 'castformsnowy') forme = 'Castform-Snowy';
				break;
			default:
				if (pokemon.template.speciesid !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme);
				this.add('-formechange', pokemon, forme);
				var type = pokemon.hpType || 'Dark';
				if (!pokemon.hasType(type)) pokemon.addType(type);
				this.add('-message', pokemon.name + ' transformed!');
			}
		}
	},
	zenmode: {
		inherit: true,
		effect: {
			onStart: function (pokemon) {
				if (pokemon.formeChange('Darmanitan-Zen')) {
					this.add('-formechange', pokemon, 'Darmanitan-Zen');
					var type = pokemon.hpType || 'Dark';
					if (!pokemon.hasType(type)) pokemon.addType(type);
					this.add('-message', 'Zen Mode triggered!');
				} else {
					return false;
				}
			},
			onEnd: function (pokemon) {
				if (pokemon.formeChange('Darmanitan')) {
					this.add('-formechange', pokemon, 'Darmanitan');
					var type = pokemon.hpType || 'Dark';
					if (!pokemon.hasType(type)) pokemon.addType(type);
					this.add('-message', 'Zen Mode ended!');
				} else {
					return false;
				}
			},
			onUpdate: function (pokemon) {
				if (!pokemon.hasAbility('zenmode')) {
					pokemon.transformed = false;
					pokemon.removeVolatile('zenmode');
				}
			}
		}
	}
};
