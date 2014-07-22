/**
 * Gen 2 moves
 */
exports.BattleMovedex = {
	bellydrum: {
		inherit: true,
		onHit: function (target) {
			if (target.boosts.atk >= 6) {
				return false;
			}
			if (target.hp <= target.maxhp / 2) {
				this.boost({atk: 2});
				return false;
			}
			this.directDamage(target.maxhp / 2);
			target.setBoost({atk: 6});
			this.add('-setboost', target, 'atk', '6', '[from] move: Belly Drum');
		}
	},
	leechseed: {
		inherit: true,
		onHit: function (target, source, move) {
			if (!source || source.fainted || source.hp <= 0) {
				// Well this shouldn't happen
				this.debug('Nothing to leech into');
				return;
			}
			if (target.newlySwitched && target.speed <= source.speed) {
				var toLeech = this.clampIntRange(target.maxhp / 8, 1);
				var damage = this.damage(toLeech, target, source, 'move: Leech Seed');
				if (damage) {
					this.heal(damage, source, target);
				}
			}
		},
		effect: {
			onStart: function (target) {
				this.add('-start', target, 'move: Leech Seed');
			},
			onAfterMoveSelf: function (pokemon) {
				var target = pokemon.side.foe.active[pokemon.volatiles['leechseed'].sourcePosition];
				if (!target || target.fainted || target.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				var toLeech = this.clampIntRange(pokemon.maxhp / 8, 1);
				var damage = this.damage(toLeech, pokemon, target);
				if (damage) {
					this.heal(damage, target, pokemon);
				}
			}
		}
	},
	lightscreen: {
		inherit: true,
		effect: {
			duration: 5,
			onModifySpD: function (spd) {
				return spd * 2;
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Light Screen');
			},
			onResidualOrder: 21,
			onEnd: function (side) {
				this.add('-sideend', side, 'move: Light Screen');
			}
		}
	},
	metronome: {
		inherit: true,
		onHit: function (target) {
			var moves = [];
			for (var i in exports.BattleMovedex) {
				var move = exports.BattleMovedex[i];
				if (i !== move.id) continue;
				if (move.isNonstandard) continue;
				var noMetronome = {
					counter:1, destinybond:1, detect:1, endure:1, metronome:1, mimic:1, mirrorcoat:1, protect:1, sketch:1, sleeptalk:1, struggle:1, thief:1
				};
				if (!noMetronome[move.id] && move.num < 252) {
					moves.push(move.id);
				}
			}
			var move = '';
			if (moves.length) move = moves[this.random(moves.length)];
			if (!move) return false;
			this.useMove(move, target);
		}
	},
	rage: {
		// todo
		// Rage boosts in Gens 2-4 is for the duration of Rage only
		// Disable does not build
		inherit: true
	},
	reflect: {
		inherit: true,
		effect: {
			duration: 5,
			onModifyDef: function (def) {
				return def * 2;
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'Reflect');
			},
			onResidualOrder: 21,
			onEnd: function (side) {
				this.add('-sideend', side, 'Reflect');
			}
		}
	},
	rest: {
		inherit: true,
		onHit: function (target) {
			if (target.hp >= target.maxhp) return false;
			if (!target.setStatus('slp') && target.status !== 'slp') return false;
			target.statusData.time = 3;
			target.statusData.startTime = 3;
			this.heal(target.maxhp);
			this.add('-status', target, 'slp', '[from] move: Rest');
		},
		secondary: false
	},
	roar: {
		inherit: true,
		onTryHit: function () {
			for (var i = 0; i < this.queue.length; i++) {
				// Roar only works if it is the last action in a turn, including when it's called by Sleep Talk
				if (this.queue[i].choice === 'move' || this.queue[i].choice === 'switch') return false;
			}
		},
		priority: -1
	},
	sleeptalk: {
		inherit: true,
			onHit: function (pokemon) {
				var moves = [];
				for (var i = 0; i < pokemon.moveset.length; i++) {
					var move = pokemon.moveset[i].id;
					var NoSleepTalk = {
						bide:1, dig:1, fly:1, metronome:1, mirrormove:1,
						skullbash:1, skyattack:1, sleeptalk:1, solarbeam:1, razorwind:1
					};
					if (move && !NoSleepTalk[move]) {
						moves.push(move);
					}
				}
				var move = '';
				if (moves.length) move = moves[this.random(moves.length)];
				if (!move) return false;
				move.isSleepTalk = true;
				this.useMove(move, pokemon);
			}
	},
	spikes: {
		inherit: true,
		effect: {
			// this is a side condition
			onStart: function (side) {
				if (!this.effectData.layers || this.effectData.layers === 0) {
					this.add('-sidestart', side, 'Spikes');
					this.effectData.layers = 1;
				} else {
					return false;
				}
			},
			onSwitchIn: function (pokemon) {
				var side = pokemon.side;
				if (!pokemon.runImmunity('Ground')) return;
				var damageAmounts = [0, 3];
				var damage = this.damage(damageAmounts[this.effectData.layers] * pokemon.maxhp / 24);
			}
		}
	},
	substitute: {
		inherit: true,
		effect: {
			onStart: function (target) {
				this.add('-start', target, 'Substitute');
				this.effectData.hp = Math.floor(target.maxhp / 4);
				delete target.volatiles['partiallytrapped'];
			},
			onTryPrimaryHitPriority: -1,
			onTryPrimaryHit: function (target, source, move) {
				if (target === source) {
					this.debug('sub bypass: self hit');
					return;
				}
				if (move.category === 'Status') {
					var SubBlocked = {
						leechseed:1, lockon:1, mindreader:1, nightmare:1, painsplit:1
					};
					if (move.status || move.boosts || move.volatileStatus === 'confusion' || SubBlocked[move.id]) {
						return false;
					}
					return;
				}
				var damage = this.getDamage(source, target, move);
				if (!damage) {
					return null;
				}
				damage = this.runEvent('SubDamage', target, source, move, damage);
				if (!damage) {
					return damage;
				}
				if (damage > target.volatiles['substitute'].hp) {
					damage = target.volatiles['substitute'].hp;
				}
				target.volatiles['substitute'].hp -= damage;
				source.lastDamage = damage;
				if (target.volatiles['substitute'].hp <= 0) {
					target.removeVolatile('substitute');
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				if (move.recoil) {
					this.damage(Math.round(damage * move.recoil[0] / move.recoil[1]), source, target, 'recoil');
				}
				if (move.drain) {
					this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
				}
				this.runEvent('AfterSubDamage', target, source, move, damage);
				return 0; // hit
			},
			onEnd: function (target) {
				this.add('-end', target, 'Substitute');
			}
		}
	},
	whirlwind: {
		inherit: true,
		onTryHit: function () {
			for (var i = 0; i < this.queue.length; i++) {
				// Whirlwind only works if it is the last action in a turn, including when it's called by Sleep Talk
				if (this.queue[i].choice === 'move' || this.queue[i].choice === 'switch') return false;
			}
		},
		priority: -1
	}
};
