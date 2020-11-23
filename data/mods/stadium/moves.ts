export const Moves: {[k: string]: ModdedMoveData} = {
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
				this.dex.getMove(target.side.lastMove.id);
			const lastMoveThisTurnIsCounterable = lastMoveThisTurn && lastMoveThisTurn.basePower > 0 &&
				['Normal', 'Fighting'].includes(lastMoveThisTurn.type) && lastMoveThisTurn.id !== 'counter';

			if (lastMoveThisTurnIsCounterable && !this.queue.willMove(target)) {
				this.debug("Stadium 1 Counter: last move was not Counterable");
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
	highjumpkick: {
		inherit: true,
		desc: "If this attack misses the target, the user takes 1 HP of damage.",
		shortDesc: "User takes 1 HP damage it would have dealt if miss.",
		onMoveFail(target, source, move) {
			if (!target.types.includes('Ghost')) {
				this.directDamage(1, source);
			}
		},
	},
	hyperbeam: {
		inherit: true,
		onMoveFail(target, source, move) {
			source.addVolatile('mustrecharge');
		},
	},
	jumpkick: {
		inherit: true,
		desc: "If this attack misses the target, the user 1HP of damage.",
		shortDesc: "User takes 1 HP damage if miss.",
		onMoveFail(target, source, move) {
			this.damage(1, source);
		},
	},
	leechseed: {
		inherit: true,
		onHit() {},
		condition: {
			onStart(target) {
				this.add('-start', target, 'move: Leech Seed');
			},
			onAfterMoveSelfPriority: 1,
			onAfterMoveSelf(pokemon) {
				const leecher = pokemon.side.foe.active[pokemon.volatiles['leechseed'].sourcePosition];
				if (!leecher || leecher.fainted || leecher.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				const toLeech = this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1);
				const damage = this.damage(toLeech, pokemon, leecher);
				if (damage) this.heal(damage, leecher, pokemon);
			},
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
			duration: 255,
			onStart(target, source, effect) {
				this.effectData.move = 'rage';
			},
			onLockMove: 'rage',
			onTryHit(target, source, move) {
				if (target.boosts.atk < 6 && move.id === 'disable') {
					this.boost({atk: 1});
				}
			},
			onHit(target, source, move) {
				if (target.boosts.atk < 6 && move.category !== 'Status') {
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
			target.statusData.time = 2;
			target.statusData.startTime = 2;
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
		condition: {
			onStart(target) {
				this.add('-start', target, 'Substitute');
				this.effectData.hp = Math.floor(target.maxhp / 4);
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
				let damage = this.getDamage(source, target, move);
				if (!damage) return null;
				damage = this.runEvent('SubDamage', target, source, move, damage);
				if (!damage) return damage;
				target.volatiles['substitute'].hp -= damage;
				source.lastDamage = damage;
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
						this.damage(Math.round(damage * move.recoil[0] / move.recoil[1]), source, target, 'recoil');
					}
				}
				this.runEvent('AfterSubDamage', target, source, move, damage);
				// Add here counter damage
				const lastAttackedBy = target.getLastAttackedBy();
				if (!lastAttackedBy) {
					target.attackedBy.push({source: source, move: move.id, damage: damage, thisTurn: true});
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
