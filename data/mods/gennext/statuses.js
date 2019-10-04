'use strict';

/**@type {{[k: string]: ModdedPureEffectData}} */
let BattleStatuses = {
	frz: {
		name: 'frz',
		id: 'frz',
		num: 0,
		effectType: 'Status',
		onStart(target) {
			this.add('-status', target, 'frz');
		},
		duration: 2,
		onBeforeMovePriority: 2,
		onBeforeMove(pokemon, target, move) {
			if (move.flags['defrost']) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onHit(target, source, move) {
			if (move.type === 'Fire' && move.category !== 'Status' || move.flags['defrost']) {
				target.cureStatus();
			}
		},
		onEnd(target) {
			this.add('-curestatus', target, 'frz');
		},
	},
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		name: 'lockedmove',
		id: 'lockedmove',
		num: 0,
		durationCallback() {
			return this.random(2, 4);
		},
		onResidual(target) {
			/**@type {Move} */
			// @ts-ignore
			let move = target.lastMove;
			if (!move.self || (move.self !== true && move.self.volatileStatus !== 'lockedmove')) {
				// don't lock, and bypass confusion for calming
				delete target.volatiles['lockedmove'];
			} else if (target.ability === 'owntempo') {
				// Own Tempo prevents locking
				delete target.volatiles['lockedmove'];
			}
		},
		onEnd(target) {
			target.addVolatile('confusion');
		},
		onLockMove(pokemon) {
			// @ts-ignore
			return pokemon.lastMove.id;
		},
	},
	confusion: {
		// this is a volatile status
		name: 'confusion',
		id: 'confusion',
		num: 0,
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'lockedmove') {
				this.add('-start', target, 'confusion', '[fatigue]');
			} else {
				this.add('-start', target, 'confusion');
			}
			this.effectData.time = this.random(3, 4);
		},
		onEnd(target) {
			this.add('-end', target, 'confusion');
		},
		onBeforeMove(pokemon) {
			pokemon.volatiles.confusion.time--;
			if (!pokemon.volatiles.confusion.time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			let damage = this.getDamage(pokemon, pokemon, 40);
			if (typeof damage !== 'number') throw new Error("Confusion damage not dealt");
			this.directDamage(damage);
		},
	},

	// weather!

	raindance: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
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
		onBasePower(basePower, attacker, defender, move) {
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
		name: 'bidestall',
		id: 'bidestall',
		num: 0,
		duration: 3,
	},

	unown: {
		// Unown: Shadow Tag
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('shadowtag');
				pokemon.baseAbility = /** @type {ID} */('shadowtag');
			}
			if (pokemon.transformed) return;
			pokemon.setType(pokemon.hpType || 'Dark');
		},
	},
	bronzong: {
		// Bronzong: Heatproof
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('heatproof');
				pokemon.baseAbility = /** @type {ID} */('heatproof');
			}
		},
	},
	weezing: {
		// Weezing: Aftermath
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('aftermath');
				pokemon.baseAbility = /** @type {ID} */('aftermath');
			}
		},
	},
	flygon: {
		// Flygon: Compoundeyes
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('compoundeyes');
				pokemon.baseAbility = /** @type {ID} */('compoundeyes');
			}
		},
	},
	eelektross: {
		// Eelektross: Poison Heal
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('poisonheal');
				pokemon.baseAbility = /** @type {ID} */('poisonheal');
			}
		},
	},
	claydol: {
		// Claydol: Filter
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('filter');
				pokemon.baseAbility = /** @type {ID} */('filter');
			}
		},
	},
	gengar: {
		// Gengar: Cursed Body
		onImmunity(type, pokemon) {
			if (pokemon.template.id !== 'gengarmega' && type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('cursedbody');
				pokemon.baseAbility = /** @type {ID} */('cursedbody');
			}
		},
	},
	mismagius: {
		// Mismagius: Cursed Body
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('cursedbody');
				pokemon.baseAbility = /** @type {ID} */('cursedbody');
			}
		},
	},
	mesprit: {
		// Mesprit: Serene Grace
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('serenegrace');
				pokemon.baseAbility = /** @type {ID} */('serenegrace');
			}
		},
	},
	uxie: {
		// Uxie: Synchronize
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('synchronize');
				pokemon.baseAbility = /** @type {ID} */('synchronize');
			}
		},
	},
	azelf: {
		// Azelf: Steadfast
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('steadfast');
				pokemon.baseAbility = /** @type {ID} */('steadfast');
			}
		},
	},
	hydreigon: {
		// Hydreigon: Sheer Force
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('sheerforce');
				pokemon.baseAbility = /** @type {ID} */('sheerforce');
			}
		},
	},
	rotom: {
		// All Rotoms: Trace
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('trace');
				pokemon.baseAbility = /** @type {ID} */('trace');
			}
		},
	},
	rotomheat: {
		// All Rotoms: Trace
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('trace');
				pokemon.baseAbility = /** @type {ID} */('trace');
			}
		},
	},
	rotomwash: {
		// All Rotoms: Trace
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('trace');
				pokemon.baseAbility = /** @type {ID} */('trace');
			}
		},
	},
	rotomfan: {
		// All Rotoms: Trace
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('trace');
				pokemon.baseAbility = /** @type {ID} */('trace');
			}
		},
	},
	rotomfrost: {
		// All Rotoms: Trace
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('trace');
				pokemon.baseAbility = /** @type {ID} */('trace');
			}
		},
	},
	rotommow: {
		// All Rotoms: Trace
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('trace');
				pokemon.baseAbility = /** @type {ID} */('trace');
			}
		},
	},
	cryogonal: {
		// Cryogonal: infinite hail, Ice Body
		onModifyMove(move) {
			if (move.id === 'hail') {
				/**@type {string} */
				// @ts-ignore
				let weather = move.weather;
				move.weather = '';
				move.onHit = function (target, source) {
					this.field.setWeather(weather, source, this.dex.getAbility('snowwarning'));
					this.field.weatherData.duration = 0;
				};
				move.target = 'self';
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart(pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = /** @type {ID} */('icebody');
				pokemon.baseAbility = /** @type {ID} */('icebody');
			}
		},
	},
	probopass: {
		// Probopass: infinite sand
		onModifyMove(move) {
			if (move.id === 'sandstorm') {
				/**@type {string} */
				// @ts-ignore
				let weather = move.weather;
				move.weather = '';
				move.onHit = function (target, source) {
					this.field.setWeather(weather, source, this.dex.getAbility('sandstream'));
					this.field.weatherData.duration = 0;
				};
				move.target = 'self';
			}
		},
	},
	phione: {
		// Phione: infinite rain
		onModifyMove(move) {
			if (move.id === 'raindance') {
				/**@type {string} */
				// @ts-ignore
				let weather = move.weather;
				move.weather = '';
				move.onHit = function (target, source) {
					this.field.setWeather(weather, source, this.dex.getAbility('drizzle'));
					this.field.weatherData.duration = 0;
				};
				move.target = 'self';
			}
		},
	},
};

exports.BattleStatuses = BattleStatuses;
