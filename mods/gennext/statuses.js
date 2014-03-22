exports.BattleStatuses = {
	frz: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('-status', target, 'frz');
		},
		duration: 2,
		onBeforeMovePriority: 2,
		onBeforeMove: function(pokemon, target, move) {
			if (move.thawsUser) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onHit: function(target, source, move) {
			if (move.type === 'Fire' && move.category !== 'Status' || move.thawsUser) {
				target.cureStatus();
			}
		},
		onEnd: function(target) {
			this.battle.add('-curestatus', target, 'frz');
		}
	},
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		durationCallback: function() {
			return this.random(2,4);
		},
		onResidual: function(target) {
			var move = this.getMove(target.lastMove);
			if (!move.self || move.self.volatileStatus !== 'lockedmove') {
				// don't lock, and bypass confusion for calming
				delete target.volatiles['lockedmove'];
			} else if (target.ability === 'owntempo') {
				// Own Tempo prevents locking
				delete target.volatiles['lockedmove'];
			}
		},
		onEnd: function(target) {
			this.add('-end', target, 'rampage');
			target.addVolatile('confusion');
		},
		onLockMove: function(pokemon) {
			return pokemon.lastMove;
		}
	},
	confusion: {
		// this is a volatile status
		onStart: function(target, source, sourceEffect) {
			var result = this.runEvent('TryConfusion', target, source, sourceEffect);
			if (!result) return result;
			this.add('-start', target, 'confusion');
			this.effectData.time = this.random(3,4);
		},
		onEnd: function(target) {
			this.add('-end', target, 'confusion');
		},
		onBeforeMove: function(pokemon) {
			pokemon.volatiles.confusion.time--;
			if (!pokemon.volatiles.confusion.time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.directDamage(this.getDamage(pokemon,pokemon,30));
		}
	},


	// weather!

	raindance: {
		inherit: true,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.id === 'scald') {
				return;
			}
			if (move.type === 'Water') {
				this.debug('rain water boost');
				return basePower * 1.5;
			}
			if (move.type === 'Fire') {
				this.debug('rain fire suppress');
				return basePower * .5;
			}
		}
	},
	sunnyday: {
		inherit: true,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.id === 'scald') {
				return;
			}
			if (move.type === 'Fire') {
				this.debug('Sunny Day fire boost');
				return basePower * 1.5;
			}
			if (move.type === 'Water') {
				this.debug('Sunny Day water suppress');
				return basePower * .5;
			}
		}
	},

	// intrinsics!

	bidestall: {
		duration: 3
	},

	unown: {
		// Unown: Shadow Tag
		onImmunity: function(type) {
			if (type === 'Ground') return false;
		},
		onStart: function(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'shadowtag';
				pokemon.baseAbility = 'shadowtag';
			}
		},
		onModifyPokemon: function(pokemon) {
			if (pokemon.transformed) return;
			pokemon.types = [pokemon.hpType || 'Dark'];
		}
	},
	bronzong: {
		// Bronzong: Heatproof
		onImmunity: function(type) {
			if (type === 'Ground') return false;
		},
		onStart: function(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'heatproof';
				pokemon.baseAbility = 'heatproof';
			}
		}
	},
	weezing: {
		// Weezing: Aftermath
		onImmunity: function(type) {
			if (type === 'Ground') return false;
		},
		onStart: function(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'aftermath';
				pokemon.baseAbility = 'aftermath';
			}
		}
	},
	flygon: {
		// Flygon: Compoundeyes
		onImmunity: function(type) {
			if (type === 'Ground') return false;
		},
		onStart: function(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'compoundeyes';
				pokemon.baseAbility = 'compoundeyes';
			}
		}
	},
	eelektross: {
		// Eelektross: Poison Heal
		onImmunity: function(type) {
			if (type === 'Ground') return false;
		},
		onStart: function(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'poisonheal';
				pokemon.baseAbility = 'poisonheal';
			}
		}
	},
	claydol: {
		// Claydol: Filter
		onImmunity: function(type) {
			if (type === 'Ground') return false;
		},
		onStart: function(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'filter';
				pokemon.baseAbility = 'filter';
			}
		}
	},
	gengar: {
		// Gengar: Cursed Body
		onImmunity: function(type) {
			if (type === 'Ground') return false;
		},
		onStart: function(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'cursedbody';
				pokemon.baseAbility = 'cursedbody';
			}
		}
	},
	mismagius: {
		// Mismagius: Cursed Body
		onImmunity: function(type) {
			if (type === 'Ground') return false;
		},
		onStart: function(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'cursedbody';
				pokemon.baseAbility = 'cursedbody';
			}
		}
	},
	cryogonal: {
		// Cryogonal: infinite hail, Ice Body
		onModifyMove: function(move) {
			if (move.id === 'hail') {
				var weather = move.weather;
				move.weather = null;
				move.onHit = function(target, source) {
					this.setWeather(weather, source, this.getAbility('snowwarning'));
					this.weatherData.duration = 0;
				};
				move.target = 'self';
			}
		},
		onImmunity: function(type) {
			if (type === 'Ground') return false;
		},
		onStart: function(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'icebody';
				pokemon.baseAbility = 'icebody';
			}
		}
	},
	probopass: {
		// Probopass: infinite sand
		onModifyMove: function(move) {
			if (move.id === 'sandstorm') {
				var weather = move.weather;
				move.weather = null;
				move.onHit = function(target, source) {
					this.setWeather(weather, source, this.getAbility('sandstream'));
					this.weatherData.duration = 0;
				};
				move.target = 'self';
			}
		}
	},
	phione: {
		// Phione: infinite rain
		onModifyMove: function(move) {
			if (move.id === 'raindance') {
				var weather = move.weather;
				move.weather = null;
				move.onHit = function(target, source) {
					this.setWeather(weather, source, this.getAbility('drizzle'));
					this.weatherData.duration = 0;
				};
				move.target = 'self';
			}
		}
	}
};
