export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	bide: {
		inherit: true,
		priority: 0,
		accuracy: true,
		condition: {
			durationCallback(defender, attacker, effect) {
				return this.random(3, 5);
			},
			onStart(pokemon) {
				this.effectState.totalDamage = 0;
				this.effectState.lastDamage = 0;
				this.add('-start', pokemon, 'Bide');
			},
			onHit(defender, attacker, move) {
				if (attacker && attacker !== defender && move.category !== 'Physical' && move.category !== 'Special') {
					const damage = this.effectState.totalDamage;
					this.effectState.totalDamage += damage;
					this.effectState.lastDamage = damage;
					this.effectState.sourceSlot = attacker.getSlot();
				}
			},
			onDamage(damage, defender, attacker, move) {
				if (!attacker || attacker.isAlly(defender)) return;
				if (move?.effectType !== 'Move') return;
				if (!damage && this.effectState.lastDamage > 0) {
					damage = this.effectState.totalDamage;
				}
				this.effectState.totalDamage += damage;
				this.effectState.lastDamage = damage;
				this.effectState.sourceSlot = attacker.getSlot();
			},
			onAfterSetStatus(status, pokemon) {
				// Sleep, freeze, and partial trap will just pause duration.
				if (pokemon.volatiles['flinch']) {
					this.effectState.duration!++;
				} else if (pokemon.volatiles['partiallytrapped']) {
					this.effectState.duration!++;
				} else {
					switch (status.id) {
					case 'slp':
					case 'frz':
						this.effectState.duration!++;
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
					const defender = this.getAtSlot(this.effectState.sourceSlot);
					if (defender.isSemiInvulnerable()) {
						this.add('-message', 'The foe ' + defender.name + ' can\'t be hit while flying!');
						pokemon.removeVolatile('bide');
						return false;
					}
					this.actions.moveHit(defender, pokemon, move, { damage: this.effectState.totalDamage * 2 } as ActiveMove);
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
		damageCallback(pokemon, defender) {
			// Counter mechanics in Stadium 1:
			// - a move is Counterable if it is Normal or Fighting type, has nonzero Base Power, and is not Counter
			// - Counter succeeds if the defender used a Counterable move earlier this turn

			const lastMoveThisTurn = defender.side.lastMove?.id === defender.side.lastSelectedMove &&
				!this.queue.willMove(defender) && this.dex.moves.get(defender.side.lastMove.id);
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
		onHit(defender, attacker) {
			this.add('-activate', defender, 'move: Haze');
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
		onMoveFail(defender, attacker, move) {
			attacker.addVolatile('mustrecharge');
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
			inherit: true,
			// Rage lock
			onStart(defender, attacker, effect) {
				this.effectState.move = 'rage';
			},
			onHit(defender, attacker, move) {
				if (defender.boosts.atk < 6 && (move.category !== 'Status' || move.id === 'disable')) {
					this.boost({ atk: 1 });
				}
			},
		},
	},
	recover: {
		inherit: true,
		onHit(defender) {
			if (defender.hp === defender.maxhp) {
				return false;
			}
			this.heal(Math.floor(defender.maxhp / 2), defender, defender);
		},
	},
	rest: {
		inherit: true,
		onHit(defender, attacker, move) {
			// Fails if the difference between
			// max HP and current HP is 0, 255, or 511
			if (defender.hp >= defender.maxhp) return false;
			if (!defender.setStatus('slp', attacker, move)) return false;
			defender.statusState.time = 2;
			defender.statusState.startTime = 2;
			defender.recalculateStats!(); // Stadium Rest removes statdrops given by Major Status Conditions.
			this.heal(defender.maxhp); // Aesthetic only as the healing happens after you fall asleep in-game
		},
	},
	softboiled: {
		inherit: true,
		onHit(defender) {
			// Fail when health is 255 or 511 less than max
			if (defender.hp === defender.maxhp) {
				return false;
			}
			this.heal(Math.floor(defender.maxhp / 2), defender, defender);
		},
	},
	substitute: {
		inherit: true,
		onTryHit(defender) {
			if (defender.volatiles['substitute']) {
				this.add('-fail', defender, 'move: Substitute');
				return null;
			}
			// Stadium fixes the 25% = you die gag
			if (defender.hp <= defender.maxhp / 4) {
				this.add('-fail', defender, 'move: Substitute', '[weak]');
				return null;
			}
		},
		condition: {
			inherit: true,
			onTryHit(defender, attacker, move) {
				if (defender === attacker) {
					this.debug('sub bypass: self hit');
					return;
				}
				if (move.drain) {
					this.add('-miss', attacker);
					return null;
				}
				if (move.category === 'Status') {
					const SubBlocked = ['leechseed', 'lockon', 'mindreader', 'nightmare'];
					if (move.status || move.boosts || move.volatileStatus === 'confusion' || SubBlocked.includes(move.id)) {
						this.add('-activate', defender, 'Substitute', '[block] ' + move.name);
						return null;
					}
					return;
				}
				if (move.volatileStatus && defender === attacker) return;
				let damage = this.actions.getDamage(attacker, defender, move);
				if (damage && damage > defender.volatiles['substitute'].hp) {
					damage = defender.volatiles['substitute'].hp;
				}
				if (!damage && damage !== 0) return null;
				defender.volatiles['substitute'].hp -= damage;
				this.lastDamage = damage;
				if (defender.volatiles['substitute'].hp <= 0) {
					this.debug('Substitute broke');
					defender.removeVolatile('substitute');
					defender.subFainted = true;
				} else {
					this.add('-activate', defender, 'Substitute', '[damage]');
				}
				// Drain/recoil does not happen if the substitute breaks
				if (defender.volatiles['substitute']) {
					if (move.recoil) {
						this.damage(this.clampIntRange(Math.floor(damage * move.recoil[0] / move.recoil[1]), 1), attacker, defender, 'recoil');
					}
				}
				this.runEvent('AfterSubDamage', defender, attacker, move, damage);
				// Add here counter damage
				const lastAttackedBy = defender.getLastAttackedBy();
				if (!lastAttackedBy) {
					defender.attackedBy.push({ attacker, move: move.id, damage, slot: attacker.getSlot(), thisTurn: true });
				} else {
					lastAttackedBy.move = move.id;
					lastAttackedBy.damage = damage;
				}
				return 0;
			},
		},
		target: "self",
		type: "Normal",
	},
	struggle: {
		inherit: true,
		ignoreImmunity: { 'Normal': true },
	},
	wrap: {
		inherit: true,
		// FIXME: onBeforeMove() {},
	},
};
