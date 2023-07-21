export const Moves: {[k: string]: ModdedMoveData} = {
	bide: {
		inherit: true,
		priority: 0,
		accuracy: true,
		condition: {
			durationCallback(target, source, effect) {
				return this.random(3, 5);
			},
			onStart(pokemon) {
				this.effectState.totalDamage = 0;
				this.effectState.lastDamage = 0;
				this.add('-start', pokemon, 'Bide');
			},
			onHit(target, source, move) {
				if (source && source !== target && move.category !== 'Physical' && move.category !== 'Special') {
					const damage = this.effectState.totalDamage;
					this.effectState.totalDamage += damage;
					this.effectState.lastDamage = damage;
					this.effectState.sourceSlot = source.getSlot();
				}
			},
			onDamage(damage, target, source, move) {
				if (!source || source.isAlly(target)) return;
				if (!move || move.effectType !== 'Move') return;
				if (!damage && this.effectState.lastDamage > 0) {
					damage = this.effectState.totalDamage;
				}
				this.effectState.totalDamage += damage;
				this.effectState.lastDamage = damage;
				this.effectState.sourceSlot = source.getSlot();
			},
			onAfterSetStatus(status, pokemon) {
				// Sleep, freeze, and partial trap will just pause duration.
				if (pokemon.volatiles['flinch']) {
					this.effectState.duration++;
				} else if (pokemon.volatiles['partiallytrapped']) {
					this.effectState.duration++;
				} else {
					switch (status.id) {
					case 'slp':
					case 'frz':
						this.effectState.duration++;
						break;
					}
				}
			},
			onBeforeMove(pokemon, t, move) {
				if (this.effectState.duration === 1) {
					this.add('-end', pokemon, 'Bide');
					if (!this.effectState.totalDamage) {
						this.debug("Bide failed because no damage was taken");
						this.add('-fail', pokemon);
						return false;
					}
					const target = this.getAtSlot(this.effectState.sourceSlot);
					if (target.isSemiInvulnerable()) {
						this.add('-message', 'The foe ' + target.name + ' can\'t be hit while flying!');
						pokemon.removeVolatile('bide');
						return false;
					}
					this.actions.moveHit(target, pokemon, move, {damage: this.effectState.totalDamage * 2} as ActiveMove);
					pokemon.removeVolatile('bide');
					return false;
				}
				this.add('-activate', pokemon, 'Bide');
				return false;
			},
			onDisableMove(pokemon) {
				if (!pokemon.hasMove('bide')) {
					return;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id !== 'bide') {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
		type: "???", // Will look as Normal but it's STAB-less
	},
	bind: {
		inherit: true,
		// FIXME: onBeforeMove() {},
	},
	clamp: {
		inherit: true,
		// FIXME: onBeforeMove() {},
	},
	counter: {
		inherit: true,
		ignoreImmunity: true,
		willCrit: false,
		basePower: 1,
		damageCallback(pokemon, target) {
			// Counter mechanics in Stadium 1:
			// - a move is Counterable if it is Normal or Fighting type, has nonzero Base Power, and is not Counter
			// - Counter succeeds if the target used a Counterable move earlier this turn

			const lastMoveThisTurn = target.side.lastMove && target.side.lastMove.id === target.side.lastSelectedMove &&
				!this.queue.willMove(target) && this.dex.moves.get(target.side.lastMove.id);
			if (!lastMoveThisTurn) {
				this.debug("Stadium 1 Counter: last move was not this turn");
				this.add('-fail', pokemon);
				return false;
			}

			const lastMoveThisTurnIsCounterable = lastMoveThisTurn && lastMoveThisTurn.basePower > 0 &&
				['Normal', 'Fighting'].includes(lastMoveThisTurn.type) && lastMoveThisTurn.id !== 'counter';
			if (!lastMoveThisTurnIsCounterable) {
				this.debug(`Stadium 1 Counter: last move ${lastMoveThisTurn.name} was not Counterable`);
				this.add('-fail', pokemon);
				return false;
			}
			if (this.lastDamage <= 0) {
				this.debug("Stadium 1 Counter: no previous damage exists");
				this.add('-fail', pokemon);
				return false;
			}

			return 2 * this.lastDamage;
		},
	},
	firespin: {
		inherit: true,
		// FIXME: onBeforeMove() {},
	},
	haze: {
		inherit: true,
		onHit(target, source) {
			this.add('-activate', target, 'move: Haze');
			this.add('-clearallboost', '[silent]');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
				pokemon.cureStatus(true);
				for (const id of Object.keys(pokemon.volatiles)) {
					pokemon.removeVolatile(id);
					this.add('-end', pokemon, id, '[silent]');
				}
				pokemon.recalculateStats!();
			}
		},
	},
	hyperbeam: {
		inherit: true,
		onMoveFail(target, source, move) {
			source.addVolatile('mustrecharge');
		},
	},
	psywave: {
		inherit: true,
		basePower: 1,
		damageCallback(pokemon) {
			return this.random(1, this.trunc(1.5 * pokemon.level));
		},
	},
	rage: {
		inherit: true,
		self: {
			volatileStatus: 'rage',
		},
		condition: {
			// Rage lock
			onStart(target, source, effect) {
				this.effectState.move = 'rage';
			},
			onLockMove: 'rage',
			onHit(target, source, move) {
				if (target.boosts.atk < 6 && (move.category !== 'Status' || move.id === 'disable')) {
					this.boost({atk: 1});
				}
			},
		},
	},
	recover: {
		inherit: true,
		heal: null,
		onHit(target) {
			if (target.hp === target.maxhp) {
				return false;
			}
			this.heal(Math.floor(target.maxhp / 2), target, target);
		},
	},
	rest: {
		inherit: true,
		onHit(target, source, move) {
			// Fails if the difference between
			// max HP and current HP is 0, 255, or 511
			if (target.hp >= target.maxhp) return false;
			if (!target.setStatus('slp', source, move)) return false;
			target.statusState.time = 2;
			target.statusState.startTime = 2;
			target.recalculateStats!(); // Stadium Rest removes statdrops given by Major Status Conditions.
			this.heal(target.maxhp); // Aesthetic only as the healing happens after you fall asleep in-game
		},
	},
	softboiled: {
		inherit: true,
		heal: null,
		onHit(target) {
			// Fail when health is 255 or 511 less than max
			if (target.hp === target.maxhp) {
				return false;
			}
			this.heal(Math.floor(target.maxhp / 2), target, target);
		},
	},
	substitute: {
		inherit: true,
		onTryHit(target) {
			if (target.volatiles['substitute']) {
				this.add('-fail', target, 'move: Substitute');
				return null;
			}
			// Stadium fixes the 25% = you die gag
			if (target.hp <= target.maxhp / 4) {
				this.add('-fail', target, 'move: Substitute', '[weak]');
				return null;
			}
		},
		condition: {
			onStart(target) {
				this.add('-start', target, 'Substitute');
				this.effectState.hp = Math.floor(target.maxhp / 4);
				delete target.volatiles['partiallytrapped'];
			},
			onTryHitPriority: -1,
			onTryHit(target, source, move) {
				if (target === source) {
					this.debug('sub bypass: self hit');
					return;
				}
				if (move.drain) {
					this.add('-miss', source);
					return null;
				}
				if (move.category === 'Status') {
					const SubBlocked = ['leechseed', 'lockon', 'mindreader', 'nightmare'];
					if (move.status || move.boosts || move.volatileStatus === 'confusion' || SubBlocked.includes(move.id)) {
						this.add('-activate', target, 'Substitute', '[block] ' + move.name);
						return null;
					}
					return;
				}
				if (move.volatileStatus && target === source) return;
				let damage = this.actions.getDamage(source, target, move);
				if (damage && damage > target.volatiles['substitute'].hp) {
					damage = target.volatiles['substitute'].hp;
				}
				if (!damage && damage !== 0) return null;
				damage = this.runEvent('SubDamage', target, source, move, damage);
				if (!damage && damage !== 0) return damage;
				target.volatiles['substitute'].hp -= damage;
				this.lastDamage = damage;
				if (target.volatiles['substitute'].hp <= 0) {
					this.debug('Substitute broke');
					target.removeVolatile('substitute');
					target.subFainted = true;
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				// Drain/recoil does not happen if the substitute breaks
				if (target.volatiles['substitute']) {
					if (move.recoil) {
						this.damage(this.clampIntRange(Math.floor(damage * move.recoil[0] / move.recoil[1]), 1), source, target, 'recoil');
					}
				}
				this.runEvent('AfterSubDamage', target, source, move, damage);
				// Add here counter damage
				const lastAttackedBy = target.getLastAttackedBy();
				if (!lastAttackedBy) {
					target.attackedBy.push({source: source, move: move.id, damage: damage, slot: source.getSlot(), thisTurn: true});
				} else {
					lastAttackedBy.move = move.id;
					lastAttackedBy.damage = damage;
				}
				return 0;
			},
			onEnd(target) {
				this.add('-end', target, 'Substitute');
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},
	struggle: {
		inherit: true,
		ignoreImmunity: {'Normal': true},
	},
	wrap: {
		inherit: true,
		// FIXME: onBeforeMove() {},
	},
};
