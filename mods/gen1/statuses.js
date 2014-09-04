/**
 * Statuses worked way different.
 * Sleep lasted longer, had no reset on switch and took a whole turn to wake up.
 * Frozen only thaws when hit by fire or Haze.
 *
 * Secondary effects to status (-speed, -atk) worked differently, so they are
 * separated as volatile statuses that are applied on switch in, removed
 * under certain conditions and re-applied under other conditions.
 */
exports.BattleStatuses = {
	brn: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'brn');
			target.addVolatile('brnattackdrop');
		},
		onAfterMoveSelf: function (pokemon) {
			this.damage(pokemon.maxhp / 16);
		},
		onSwitchIn: function (pokemon){
			pokemon.addVolatile('brnattackdrop');
			if (pokemon.side.foe.active[0] && pokemon.speed <= pokemon.side.foe.active[0].speed) {
				this.damage(pokemon.maxhp / 16);
			}
		}
	},
	brnattackdrop: {
		onBasePower: function (basePower, attacker, defender, move) {
			if (move && move.category === 'Physical' && attacker) {
				return basePower / 2;
			}
		}
	},
	par: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'par');
			target.addVolatile('parspeeddrop');
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon) {
			if (this.random(4) === 0) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		},
		onSwitchIn: function (pokemon){
			pokemon.addVolatile('parspeeddrop');
		}
	},
	parspeeddrop: {
		onModifySpe: function (spe, pokemon) {
			return spe / 4;
		}
	},
	slp: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'slp');
			// 1-7 turns. Put 1-7 since they awake at end of turn.
			this.effectData.startTime = this.random(1, 7);
			this.effectData.time = this.effectData.startTime;
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon, target, move) {
			pokemon.statusData.time--;
			this.add('cant', pokemon, 'slp');
			return false;
		},
		onAfterMoveSelf: function (pokemon) {
			if (pokemon.statusData.time <= 0) pokemon.cureStatus();
		}
	},
	frz: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'frz');
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon, target, move) {
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onHit: function (target, source, move) {
			if (move.type === 'Fire' && move.category !== 'Status') {
				target.cureStatus();
			}
		}
	},
	psn: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'psn');
		},
		onAfterMoveSelf: function (pokemon) {
			this.damage(pokemon.maxhp / 16);
		},
		onSwitchIn: function (pokemon) {
			if (pokemon.side.foe.active[0] && pokemon.speed <= pokemon.side.foe.active[0].speed) {
				this.damage(pokemon.maxhp / 16);
			}
		}
	},
	tox: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'tox');
			this.effectData.stage = 0;
		},
		onAfterMoveSelf: function (pokemon) {
			if (this.effectData.stage < 15) {
				this.effectData.stage++;
			}
			this.damage(this.clampIntRange(pokemon.maxhp / 16, 1) * this.effectData.stage);
		},
		onSwitchIn: function (pokemon) {
			this.effectData.stage = 0; // probably unnecessary...
			pokemon.setStatus('psn');
			// normal poison damage...
			if (pokemon.side.foe.active[0] && pokemon.speed <= pokemon.side.foe.active[0].speed) {
				this.damage(pokemon.maxhp / 16);
			}
		}
	},
	confusion: {
		// this is a volatile status
		onStart: function (target) {
			var result = this.runEvent('TryConfusion');
			if (!result) return result;
			this.add('-start', target, 'confusion');
			this.effectData.time = this.random(2, 6);
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
			this.add('-activate', pokemon, 'confusion');
			if (this.random(2) === 0) {
				return;
			}
			this.directDamage(this.getDamage(pokemon, pokemon, 40));
			return false;
		}
	},
	flinch: {
		duration: 1,
		onBeforeMovePriority: 1,
		onBeforeMove: function (pokemon) {
			if (!this.runEvent('Flinch', pokemon)) {
				return;
			}
			this.add('cant', pokemon, 'flinch');
			return false;
		}
	},
	trapped: {
		noCopy: true,
		onModifyPokemon: function (pokemon) {
			if (!this.effectData.source || !this.effectData.source.isActive) {
				delete pokemon.volatiles['trapped'];
				return;
			}
			pokemon.trapped = true;
		}
	},
	partiallytrapped: {
		duration: 2,
		onBeforeMovePriority: 1,
		onStart: function (target, source, effect) {
			this.add('-activate', target, 'move: ' + effect, '[of] ' + source);
		},
		onBeforeMove: function (pokemon) {
			this.add('cant', pokemon, 'partiallytrapped');
			return false;
		},
		onEnd: function (pokemon) {
			this.add('-end', pokemon, this.effectData.sourceEffect, '[partiallytrapped]');
		}
	},
	partialtrappinglock: {
		durationCallback: function () {
			var roll = this.random(6);
			var duration = [2, 2, 3, 3, 4, 5][roll];
			return duration;
		},
		onResidual: function (target) {
			if (target.lastMove === 'struggle' || target.status === 'slp') {
				delete target.volatiles['partialtrappinglock'];
			}
		},
		onStart: function (target, source, effect) {
			this.effectData.move = effect.id;
		},
		onModifyPokemon: function (pokemon) {
			if (!pokemon.hasMove(this.effectData.move)) {
				return;
			}
			var moves = pokemon.moveset;
			for (var i = 0; i < moves.length; i++) {
				if (moves[i].id !== this.effectData.move) {
					moves[i].disabled = true;
				}
			}
		}
	},
	rage: {
		// Rage lock
		duration: 255,
		onStart: function (target, source, effect) {
			this.effectData.move = 'rage';
		},
		onLockMove: 'rage',
		onTryHit: function (target, source, move) {
			if (target.boosts.atk < 6 && move.id === 'disable') {
				this.boost({atk:1});
			}
		},
		onHit: function (target, source, move) {
			if (target.boosts.atk < 6 && move.category !== 'Status') {
				this.boost({atk:1});
			}
		}
	},
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		durationCallback: function () {
			return this.random(2, 4);
		},
		onResidual: function (target) {
			if (target.lastMove === 'struggle' || target.status === 'slp') {
				// don't lock, and bypass confusion for calming
				delete target.volatiles['lockedmove'];
			}
		},
		onStart: function (target, source, effect) {
			this.effectData.move = effect.id;
		},
		onEnd: function (target) {
			this.add('-end', target, 'rampage');
			target.addVolatile('confusion');
		},
		onLockMove: function (pokemon) {
			return this.effectData.move;
		},
		onBeforeTurn: function (pokemon) {
			var move = this.getMove(this.effectData.move);
			if (move.id) {
				this.debug('Forcing into ' + move.id);
				this.changeDecision(pokemon, {move: move.id});
			}
		}
	},
	mustrecharge: {
		duration: 2,
		onBeforeMove: function (pokemon) {
			this.add('cant', pokemon, 'recharge');
			pokemon.removeVolatile('mustrecharge');
			return false;
		},
		onLockMove: 'recharge'
	},
	futuremove: {
		// this is a side condition
		onStart: function (side) {
			this.effectData.positions = [];
			for (var i = 0; i < side.active.length; i++) {
				this.effectData.positions[i] = null;
			}
		},
		onResidualOrder: 3,
		onResidual: function (side) {
			var finished = true;
			for (var i = 0; i < side.active.length; i++) {
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
					this.add('-hint', '' + move.name + ' did not hit because the target is fainted.');
					this.effectData.positions[i] = null;
					continue;
				}

				this.add('-message', '' + move.name + ' hit! (placeholder)');
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
		onStart: function () {
			this.effectData.counter = 2;
		},
		onStallMove: function () {
			// this.effectData.counter should never be undefined here.
			// However, just in case, use 1 if it is undefined.
			var counter = this.effectData.counter || 1;
			if (counter >= 256) {
				// 2^32 - special-cased because Battle.random(n) can't handle n > 2^16 - 1
				return (this.random() * 4294967296 < 1);
			}
			this.debug("Success chance: " + Math.round(100 / counter) + "%");
			return (this.random(counter) === 0);
		},
		onRestart: function () {
			if (this.effectData.counter < this.effect.counterMax) {
				this.effectData.counter *= 2;
			}
			this.effectData.duration = 2;
		}
	}
};
