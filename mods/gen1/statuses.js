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
		onAfterMoveSelfPriority: 2,
		onAfterMoveSelf: function (pokemon) {
			var toxicCounter = 1;
			if (pokemon.volatiles['residualdmg']) {
				pokemon.volatiles['residualdmg'].counter++;
				toxicCounter = pokemon.volatiles['residualdmg'].counter;
			}
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1) * toxicCounter, pokemon);
		},
		onSwitchIn: function (pokemon) {
			pokemon.addVolatile('brnattackdrop');
		},
		onAfterSwitchInSelf: function (pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
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
			if (this.random(256) < 63) {
				this.add('cant', pokemon, 'par');
				pokemon.removeVolatile('bide');
				pokemon.removeVolatile('twoturnmove');
				pokemon.removeVolatile('fly');
				pokemon.removeVolatile('dig');
				pokemon.removeVolatile('solarbeam');
				pokemon.removeVolatile('skullbash');
				pokemon.removeVolatile('partialtrappinglock');
				return false;
			}
		},
		onSwitchIn: function (pokemon) {
			pokemon.addVolatile('parspeeddrop');
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
			if (pokemon.statusData.time > 0) {
				this.add('cant', pokemon, 'slp');
			}
			pokemon.lastMove = '';
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
			pokemon.lastMove = '';
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
		onAfterMoveSelfPriority: 2,
		onAfterMoveSelf: function (pokemon) {
			var toxicCounter = 1;
			if (pokemon.volatiles['residualdmg']) {
				pokemon.volatiles['residualdmg'].counter++;
				toxicCounter = pokemon.volatiles['residualdmg'].counter;
			}
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1) * toxicCounter, pokemon);
		},
		onAfterSwitchInSelf: function (pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		}
	},
	tox: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'tox');
			if (!target.volatiles['residualdmg']) target.addVolatile('residualdmg');
			target.volatiles['residualdmg'].counter = 0;
		},
		onAfterMoveSelfPriority: 2,
		onAfterMoveSelf: function (pokemon) {
			pokemon.volatiles['residualdmg'].counter++;
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1) * pokemon.volatiles['residualdmg'].counter, pokemon);
		},
		onSwitchIn: function (pokemon) {
			// Regular poison status and damage after a switchout -> switchin.
			pokemon.setStatus('psn');
		},
		onAfterSwitchInSelf: function (pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		}
	},
	confusion: {
		// this is a volatile status
		onStart: function (target, source, sourceEffect) {
			var result = this.runEvent('TryConfusion');
			if (!result) return result;
			if (sourceEffect && sourceEffect.id === 'lockedmove') {
				this.add('-start', target, 'confusion', '[silent]');
			} else {
				this.add('-start', target, 'confusion');
			}
			this.effectData.time = this.random(2, 6);
		},
		onEnd: function (target) {
			this.add('-end', target, 'confusion');
		},
		onBeforeMove: function (pokemon, target) {
			pokemon.volatiles.confusion.time--;
			if (!pokemon.volatiles.confusion.time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (this.random(256) >= 128) {
				// We check here to implement the substitute bug since otherwise we need to change directDamage to take target.
				var damage = Math.floor(Math.floor(((Math.floor(2 * pokemon.level / 5) + 2) * pokemon.getStat('atk') * 40) / pokemon.getStat('def', false, false, true)) / 50) + 2;
				if (pokemon.volatiles['substitute']) {
					// If there is Substitute, we check for opposing substitute.
					if (target.volatiles['substitute']) {
						// Damage that one instead.
						this.directDamage(damage, target);
					}
				} else {
					// No substitute, direct damage to itself.
					this.directDamage(damage);
				}
				pokemon.removeVolatile('bide');
				pokemon.removeVolatile('twoturnmove');
				pokemon.removeVolatile('fly');
				pokemon.removeVolatile('dig');
				pokemon.removeVolatile('solarbeam');
				pokemon.removeVolatile('skullbash');
				pokemon.removeVolatile('partialtrappinglock');
				return false;
			}
			return;
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
			var duration = [2, 2, 2, 3, 3, 3, 4, 5][this.random(8)];
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
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		inherit: true,
		durationCallback: function () {
			return this.random(3, 5);
		}
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

				this.add('-fieldactivate', move);
				target.removeVolatile('Protect');
				target.removeVolatile('Endure');

				if (posData.moveData.ignoreImmunity === undefined) {
					posData.moveData.ignoreImmunity = false;
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
