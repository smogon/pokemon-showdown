'use strict';

exports.BattleStatuses = {
	frz: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'frz');
		},
		duration: 2,
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon, target, move) {
			if (move.flags['defrost']) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onHit: function (target, source, move) {
			if (move.type === 'Fire' && move.category !== 'Status' || move.flags['defrost']) {
				target.cureStatus();
			}
		},
		onEnd: function (target) {
			this.battle.add('-curestatus', target, 'frz');
		},
	},
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		durationCallback: function () {
			return this.random(2, 4);
		},
		onResidual: function (target) {
			let move = this.getMove(target.lastMove);
			if (!move.self || move.self.volatileStatus !== 'lockedmove') {
				// don't lock, and bypass confusion for calming
				delete target.volatiles['lockedmove'];
			} else if (target.ability === 'owntempo') {
				// Own Tempo prevents locking
				delete target.volatiles['lockedmove'];
			}
		},
		onEnd: function (target) {
			target.addVolatile('confusion');
		},
		onLockMove: function (pokemon) {
			return pokemon.lastMove;
		},
	},
	confusion: {
		// this is a volatile status
		onStart: function (target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'lockedmove') {
				this.add('-start', target, 'confusion', '[fatigue]');
			} else {
				this.add('-start', target, 'confusion');
			}
			this.effectData.time = this.random(3, 4);
		},
		onEnd: function (target) {
			this.add('-end', target, 'confusion');
		},
		onBeforeMove: function (pokemon) {
			pokemon.volatiles.confusion.time--;
			if (!pokemon.volatiles.confusion.time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.directDamage(this.getDamage(pokemon, pokemon, 30));
		},
	},

	// weather!

	raindance: {
		inherit: true,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.id === 'scald' || move.id === 'steameruption') {
				return;
			}
			if (move.type === 'Water') {
				this.debug('rain water boost');
				return basePower * 1.5;
			}
			if (move.type === 'Fire') {
				this.debug('rain fire suppress');
				return basePower * 0.5;
			}
		},
	},
	sunnyday: {
		inherit: true,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.id === 'scald' || move.id === 'steameruption') {
				return;
			}
			if (move.type === 'Fire') {
				this.debug('Sunny Day fire boost');
				return basePower * 1.5;
			}
			if (move.type === 'Water') {
				this.debug('Sunny Day water suppress');
				return basePower * 0.5;
			}
		},
	},

	// intrinsics!

	bidestall: {
		duration: 3,
	},

	unown: {
		// Unown: Shadow Tag
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'shadowtag';
				pokemon.baseAbility = 'shadowtag';
			}
			if (pokemon.transformed) return;
			pokemon.setType(pokemon.hpType || 'Dark');
		},
	},
	bronzong: {
		// Bronzong: Heatproof
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'heatproof';
				pokemon.baseAbility = 'heatproof';
			}
		},
	},
	weezing: {
		// Weezing: Aftermath
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'aftermath';
				pokemon.baseAbility = 'aftermath';
			}
		},
	},
	flygon: {
		// Flygon: Compoundeyes
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'compoundeyes';
				pokemon.baseAbility = 'compoundeyes';
			}
		},
	},
	eelektross: {
		// Eelektross: Poison Heal
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'poisonheal';
				pokemon.baseAbility = 'poisonheal';
			}
		},
	},
	claydol: {
		// Claydol: Filter
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'filter';
				pokemon.baseAbility = 'filter';
			}
		},
	},
	gengar: {
		// Gengar: Cursed Body
		onImmunity: function (type, pokemon) {
			if (pokemon.template.id !== 'gengarmega' && type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'cursedbody';
				pokemon.baseAbility = 'cursedbody';
			}
		},
	},
	mismagius: {
		// Mismagius: Cursed Body
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'cursedbody';
				pokemon.baseAbility = 'cursedbody';
			}
		},
	},
	mesprit: {
		// Mesprit: Serene Grace
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'serenegrace';
				pokemon.baseAbility = 'serenegrace';
			}
		},
	},
	uxie: {
		// Uxie: Synchronize
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'synchronize';
				pokemon.baseAbility = 'synchronize';
			}
		},
	},
	azelf: {
		// Azelf: Steadfast
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'steadfast';
				pokemon.baseAbility = 'steadfast';
			}
		},
	},
	hydreigon: {
		// Hydreigon: Sheer Force
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'sheerforce';
				pokemon.baseAbility = 'sheerforce';
			}
		},
	},
	rotom: {
		// All Rotoms: Trace
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'trace';
				pokemon.baseAbility = 'trace';
			}
		},
	},
	rotomheat: {
		// All Rotoms: Trace
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'trace';
				pokemon.baseAbility = 'trace';
			}
		},
	},
	rotomwash: {
		// All Rotoms: Trace
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'trace';
				pokemon.baseAbility = 'trace';
			}
		},
	},
	rotomfan: {
		// All Rotoms: Trace
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'trace';
				pokemon.baseAbility = 'trace';
			}
		},
	},
	rotomfrost: {
		// All Rotoms: Trace
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'trace';
				pokemon.baseAbility = 'trace';
			}
		},
	},
	rotommow: {
		// All Rotoms: Trace
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'trace';
				pokemon.baseAbility = 'trace';
			}
		},
	},
	cryogonal: {
		// Cryogonal: infinite hail, Ice Body
		onModifyMove: function (move) {
			if (move.id === 'hail') {
				let weather = move.weather;
				move.weather = null;
				move.onHit = function (target, source) {
					this.setWeather(weather, source, this.getAbility('snowwarning'));
					this.weatherData.duration = 0;
				};
				move.target = 'self';
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'icebody';
				pokemon.baseAbility = 'icebody';
			}
		},
	},
	probopass: {
		// Probopass: infinite sand
		onModifyMove: function (move) {
			if (move.id === 'sandstorm') {
				let weather = move.weather;
				move.weather = null;
				move.onHit = function (target, source) {
					this.setWeather(weather, source, this.getAbility('sandstream'));
					this.weatherData.duration = 0;
				};
				move.target = 'self';
			}
		},
	},
	phione: {
		// Phione: infinite rain
		onModifyMove: function (move) {
			if (move.id === 'raindance') {
				let weather = move.weather;
				move.weather = null;
				move.onHit = function (target, source) {
					this.setWeather(weather, source, this.getAbility('drizzle'));
					this.weatherData.duration = 0;
				};
				move.target = 'self';
			}
		},
	},
};
