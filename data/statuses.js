function clampIntRange(num, min, max) {
	num = Math.floor(num);
	if (num < min) num = min;
	if (typeof max !== 'undefined' && num > max) num = max;
	return num;
}
exports.BattleStatuses = {
	brn: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('-status', target, 'brn');
		},
		onBasePower: function(basePower, attacker, defender, move) {
			if (move && move.category === 'Physical' && attacker && attacker.ability !== 'guts') {
				return basePower / 2;
			}
		},
		onResidualOrder: 9,
		onResidual: function(pokemon) {
			this.damage(pokemon.maxhp/8);
		}
	},
	par: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('-status', target, 'par');
		},
		onModifySpe: function(spe, pokemon) {
			if (pokemon.ability !== 'quickfeet') {
				return spe / 4;
			}
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function(pokemon) {
			if (this.random(4) === 0) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		}
	},
	slp: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('-status', target, 'slp');
			// 1-3 turns
			this.effectData.startTime = this.random(2,5);
			this.effectData.time = this.effectData.startTime;
		},
		onSwitchIn: function(target) {
			this.effectData.time = this.effectData.startTime;
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function(pokemon, target, move) {
			if (pokemon.getAbility().isHalfSleep) {
				pokemon.statusData.time--;
			}
			pokemon.statusData.time--;
			if (pokemon.statusData.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) {
				return;
			}
			return false;
		}
	},
	frz: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('-status', target, 'frz');
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function(pokemon, target, move) {
			if (move.thawsUser || this.random(5) === 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onHit: function(target, source, move) {
			if (move.type === 'Fire' && move.category !== 'Status') {
				target.cureStatus();
			}
		}
	},
	psn: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('-status', target, 'psn');
		},
		onResidualOrder: 9,
		onResidual: function(pokemon) {
			this.damage(pokemon.maxhp/8);
		}
	},
	tox: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('-status', target, 'tox');
			this.effectData.stage = 0;
		},
		onSwitchIn: function() {
			this.effectData.stage = 0;
		},
		onResidualOrder: 9,
		onResidual: function(pokemon) {
			if (this.effectData.stage < 15) {
				this.effectData.stage++;
			}
			this.damage(clampIntRange(pokemon.maxhp/16, 1)*this.effectData.stage);
		}
	},
	confusion: {
		// this is a volatile status
		onStart: function(target, source) {
			var result = this.runEvent('TryConfusion', target, source);
			if (!result) return result;
			this.add('-start', target, 'confusion');
			this.effectData.time = this.random(2,6);
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
			this.add('-activate', pokemon, 'confusion');
			if (this.random(2) === 0) {
				return;
			}
			this.directDamage(this.getDamage(pokemon,pokemon,40));
			return false;
		}
	},
	flinch: {
		duration: 1,
		onBeforeMovePriority: 1,
		onBeforeMove: function(pokemon) {
			if (!this.runEvent('Flinch', pokemon)) {
				return;
			}
			this.add('cant', pokemon, 'flinch');
			return false;
		}
	},
	trapped: {
		noCopy: true,
		onModifyPokemon: function(pokemon) {
			if (!this.effectData.source || !this.effectData.source.isActive) {
				delete pokemon.volatiles['trapped'];
				return;
			}
			pokemon.trapped = true;
		}
	},
	partiallytrapped: {
		duration: 5,
		durationCallback: function(target, source) {
			if (source.item === 'gripclaw') return 8;
			return this.random(5,7);
		},
		onStart: function(pokemon, source) {
			this.add('-activate', pokemon, 'move: ' +this.effectData.sourceEffect, '[of] '+source);
		},
		onResidualOrder: 11,
		onResidual: function(pokemon) {
			if (this.effectData.source && (!this.effectData.source.isActive || this.effectData.source.hp <= 0)) {
				pokemon.removeVolatile('partiallytrapped');
				return;
			}
			if (this.effectData.source.item === 'bindingband') {
				this.damage(pokemon.maxhp/8);
			} else {
				this.damage(pokemon.maxhp/16);
			}
		},
		onEnd: function(pokemon) {
			this.add('-end', pokemon, this.effectData.sourceEffect, '[partiallytrapped]');
		},
		onModifyPokemon: function(pokemon) {
			pokemon.trapped = true;
		}
	},
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		durationCallback: function() {
			return this.random(2,4);
		},
		onResidual: function(target) {
			if (target.lastMove === 'struggle' || target.status === 'slp' || !target.moveThisTurn) {
				// don't lock, and bypass confusion for calming
				delete target.volatiles['lockedmove'];
			}
		},
		onStart: function(target, source, effect) {
			this.effectData.move = effect.id;
		},
		onEnd: function(target) {
			this.add('-end', target, 'rampage');
			target.addVolatile('confusion');
		},
		onLockMove: function(pokemon) {
			return this.effectData.move;
		}
	},
	choicelock: {
		onStart: function(pokemon) {
			this.effectData.move = this.activeMove.id;
			if (!this.effectData.move) return false;
		},
		onModifyPokemon: function(pokemon) {
			if (!pokemon.getItem().isChoice || !pokemon.hasMove(this.effectData.move)) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (pokemon.ignore['Item']) {
				return;
			}
			var moves = pokemon.moveset;
			for (var i=0; i<moves.length; i++) {
				if (moves[i].id !== this.effectData.move) {
					moves[i].disabled = true;
				}
			}
		}
	},
	mustrecharge: {
		duration: 2,
		onBeforeMove: function(pokemon) {
			this.add('cant', pokemon, 'recharge');
			pokemon.removeVolatile('mustrecharge');
			return false;
		},
		onLockMove: 'recharge'
	},
	futuremove: {
		// this is a side condition
		onStart: function(side) {
			this.effectData.positions = [];
			for (var i=0; i<side.active.length; i++) {
				this.effectData.positions[i] = null;
			}
		},
		onResidualOrder: 3,
		onResidual: function(side) {
			var finished = true;
			for (var i=0; i<side.active.length; i++) {
				var posData = this.effectData.positions[i];
				if (!posData) continue;

				posData.duration--;

				if (posData.duration > 0) {
					finished = false;
					continue;
				}

				// time's up; time to hit! :D
				var target = side.foe.active[posData.targetPosition];
				var move = this.getMove(posData.move);
				if (target.fainted) {
					this.add('-hint', ''+move.name+' did not hit because the target is fainted.');
					this.effectData.positions[i] = null;
					continue;
				}

				this.add('-message', ''+move.name+' hit! (placeholder)');
				target.removeVolatile('Protect');
				target.removeVolatile('Endure');

				if (typeof posData.moveData.affectedByImmunities === 'undefined') {
					posData.moveData.affectedByImmunities = true;
				}

				this.moveHit(target, posData.source, move, posData.moveData);

				this.effectData.positions[i] = null;
			}
			if (finished) {
				side.removeSideCondition('futuremove');
			}
		}
	},
	stall: {
		// Protect, Detect, Endure counter
		duration: 2,
		counterMax: 256,
		onStart: function() {
			this.effectData.counter = 2;
		},
		onStallMove: function() {
			// this.effectData.counter should never be undefined here.
			// However, just in case, use 1 if it is undefined.
			var counter = this.effectData.counter || 1;
			if (counter >= 256) {
				// 2^32 - special-cased because Battle.random(n) can't handle n > 2^16 - 1
				return (this.random()*4294967296 < 1);
			}
			this.debug("Success chance: "+Math.round(100/counter)+"%");
			return (this.random(counter) === 0);
		},
		onRestart: function() {
			if (this.effectData.counter < this.effect.counterMax) {
				this.effectData.counter *= 2;
			}
			this.effectData.duration = 2;
		}
	},

	// weather

	// weather is implemented here since it's so important to the game

	raindance: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function(source, effect) {
			if (source && source.item === 'damprock') {
				return 8;
			}
			return 5;
		},
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('rain water boost');
				return basePower * 1.5;
			}
			if (move.type === 'Fire') {
				this.debug('rain fire suppress');
				return basePower * .5;
			}
		},
		onStart: function(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				this.effectData.duration = 0;
				this.add('-weather', 'RainDance', '[from] ability: '+effect, '[of] '+source);
			} else {
				this.add('-weather', 'RainDance');
			}
		},
		onResidualOrder: 1,
		onResidual: function() {
			this.add('-weather', 'RainDance', '[upkeep]');
			this.eachEvent('Weather');
		},
		onEnd: function() {
			this.add('-weather', 'none');
		}
	},
	sunnyday: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function(source, effect) {
			if (source && source.item === 'heatrock') {
				return 8;
			}
			return 5;
		},
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Sunny Day fire boost');
				return basePower * 1.5;
			}
			if (move.type === 'Water') {
				this.debug('Sunny Day water suppress');
				return basePower * .5;
			}
		},
		onStart: function(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				this.effectData.duration = 0;
				this.add('-weather', 'SunnyDay', '[from] ability: '+effect, '[of] '+source);
			} else {
				this.add('-weather', 'SunnyDay');
			}
		},
		onImmunity: function(type) {
			if (type === 'frz') return false;
		},
		onResidualOrder: 1,
		onResidual: function() {
			this.add('-weather', 'SunnyDay', '[upkeep]');
			this.eachEvent('Weather');
		},
		onEnd: function() {
			this.add('-weather', 'none');
		}
	},
	sandstorm: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function(source, effect) {
			if (source && source.item === 'smoothrock') {
				return 8;
			}
			return 5;
		},
		onModifySpD: function(spd, pokemon) {
			if (pokemon.hasType('Rock') && this.isWeather('sandstorm')) {
				return spd * 3/2;
			}
		},
		onStart: function(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				this.effectData.duration = 0;
				this.add('-weather', 'Sandstorm', '[from] ability: '+effect, '[of] '+source);
			} else {
				this.add('-weather', 'Sandstorm');
			}
		},
		onResidualOrder: 1,
		onResidual: function() {
			this.add('-weather', 'Sandstorm', '[upkeep]');
			if (this.isWeather('sandstorm')) this.eachEvent('Weather');
		},
		onWeather: function(target) {
			this.damage(target.maxhp/16);
		},
		onEnd: function() {
			this.add('-weather', 'none');
		}
	},
	hail: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function(source, effect) {
			if (source && source.item === 'icyrock') {
				return 8;
			}
			return 5;
		},
		onStart: function(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				this.effectData.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: '+effect, '[of] '+source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
		onResidualOrder: 1,
		onResidual: function() {
			this.add('-weather', 'Hail', '[upkeep]');
			if (this.isWeather('hail')) this.eachEvent('Weather');
		},
		onWeather: function(target) {
			this.damage(target.maxhp/16);
		},
		onEnd: function() {
			this.add('-weather', 'none');
		}
	},

	arceus: {
		// Arceus's actual typing is implemented here
		// Arceus's true typing for all its formes is Normal, and it's only
		// Multitype that changes its type, but its formes are specified to
		// be their corresponding type in the Pokedex, so that needs to be
		// overridden. This is mainly relevant for Hackmons and Balanced
		// Hackmons.
		onModifyPokemon: function(pokemon) {
			if (pokemon.transformed) return;
			var type = 'Normal';
			if (pokemon.ability === 'multitype') {
				var type = this.runEvent('Plate', pokemon);
				if (!type || type === true) {
					type = 'Normal';
				}
			}
			pokemon.types = [type];
		}
	}
};
