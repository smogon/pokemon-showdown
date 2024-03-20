export const Moves: {[k: string]: ModdedMoveData} = {
	acupressure: {
		inherit: true,
		flags: {snatch: 1, metronome: 1},
		onHit(target) {
			if (target.volatiles['substitute']) {
				return false;
			}
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in target.boosts) {
				if (target.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				const randomStat = this.sample(stats);
				const boost: SparseBoostsTable = {};
				boost[randomStat] = 2;
				this.boost(boost);
			} else {
				return false;
			}
		},
	},
	aromatherapy: {
		inherit: true,
		onHit(target, source) {
			this.add('-cureteam', source, '[from] move: Aromatherapy');
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				ally.clearStatus();
			}
		},
	},
	aquaring: {
		inherit: true,
		flags: {metronome: 1},
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Aqua Ring');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 2,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 16);
			},
		},
	},
	beatup: {
		inherit: true,
		basePower: 10,
		basePowerCallback(pokemon, target, move) {
			if (!move.allies?.length) return null;
			return 10;
		},
		onModifyMove(move, pokemon) {
			pokemon.addVolatile('beatup');
			move.type = '???';
			move.category = 'Physical';
			move.allies = pokemon.side.pokemon.filter(ally => !ally.fainted && !ally.status);
			move.multihit = move.allies.length;
		},
		condition: {
			duration: 1,
			onModifyAtkPriority: -101,
			onModifyAtk(atk, pokemon, defender, move) {
				// https://www.smogon.com/forums/posts/8992145/
				// this.add('-activate', pokemon, 'move: Beat Up', '[of] ' + move.allies![0].name);
				this.event.modifier = 1;
				return move.allies!.shift()!.species.baseStats.atk;
			},
			onFoeModifyDefPriority: -101,
			onFoeModifyDef(def, pokemon) {
				this.event.modifier = 1;
				return pokemon.species.baseStats.def;
			},
		},
	},
	bide: {
		inherit: true,
		condition: {
			duration: 3,
			onLockMove: 'bide',
			onStart(pokemon) {
				this.effectState.totalDamage = 0;
				this.add('-start', pokemon, 'move: Bide');
			},
			onDamagePriority: -101,
			onDamage(damage, target, source, move) {
				if (!move || move.effectType !== 'Move' || !source) return;
				this.effectState.totalDamage += damage;
				this.effectState.lastDamageSource = source;
			},
			onAfterSetStatus(status, pokemon) {
				if (status.id === 'slp' || status.id === 'frz') {
					pokemon.removeVolatile('bide');
				}
			},
			onBeforeMove(pokemon, target, move) {
				if (this.effectState.duration === 1) {
					this.add('-end', pokemon, 'move: Bide');
					if (!this.effectState.totalDamage) {
						this.add('-fail', pokemon);
						return false;
					}
					target = this.effectState.lastDamageSource;
					if (!target) {
						this.add('-fail', pokemon);
						return false;
					}
					if (!target.isActive) {
						const possibleTarget = this.getRandomTarget(pokemon, this.dex.moves.get('pound'));
						if (!possibleTarget) {
							this.add('-miss', pokemon);
							return false;
						}
						target = possibleTarget;
					}
					const moveData = {
						id: 'bide',
						name: "Bide",
						accuracy: true,
						damage: this.effectState.totalDamage * 2,
						category: "Physical",
						priority: 1,
						flags: {contact: 1, protect: 1},
						ignoreImmunity: true,
						effectType: 'Move',
						type: 'Normal',
					} as unknown as ActiveMove;
					this.actions.tryMoveHit(target, pokemon, moveData);
					pokemon.removeVolatile('bide');
					return false;
				}
				this.add('-activate', pokemon, 'move: Bide');
			},
			onMoveAborted(pokemon) {
				pokemon.removeVolatile('bide');
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Bide', '[silent]');
			},
		},
	},
	bind: {
		inherit: true,
		accuracy: 75,
	},
	bonerush: {
		inherit: true,
		accuracy: 80,
	},
	bravebird: {
		inherit: true,
		recoil: [1, 3],
	},
	bulletseed: {
		inherit: true,
		basePower: 10,
	},
	camouflage: {
		inherit: true,
		onHit(target) {
			if (target.hasType('Normal') || !target.setType('Normal')) return false;
			this.add('-start', target, 'typechange', 'Normal');
		},
	},
	chatter: {
		inherit: true,
		secondary: {
			chance: 31,
			volatileStatus: 'confusion',
		},
	},
	clamp: {
		inherit: true,
		accuracy: 75,
		pp: 10,
	},
	conversion: {
		inherit: true,
		flags: {metronome: 1},
		onHit(target) {
			const possibleTypes = target.moveSlots.map(moveSlot => {
				const move = this.dex.moves.get(moveSlot.id);
				if (move.id !== 'conversion' && move.id !== 'curse' && !target.hasType(move.type)) {
					return move.type;
				}
				return '';
			}).filter(type => type);
			if (!possibleTypes.length) {
				return false;
			}
			const type = this.sample(possibleTypes);

			if (!target.setType(type)) return false;
			this.add('-start', target, 'typechange', type);
		},
	},
	cottonspore: {
		inherit: true,
		accuracy: 85,
	},
	covet: {
		inherit: true,
		basePower: 40,
	},
	crabhammer: {
		inherit: true,
		accuracy: 85,
	},
	crushgrip: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			const bp = Math.floor(target.hp * 120 / target.maxhp) + 1;
			this.debug('BP for ' + target.hp + '/' + target.maxhp + " HP: " + bp);
			return bp;
		},
	},
	curse: {
		inherit: true,
		flags: {metronome: 1},
		onModifyMove(move, source, target) {
			if (!source.hasType('Ghost')) {
				delete move.volatileStatus;
				delete move.onHit;
				move.self = {boosts: {atk: 1, def: 1, spe: -1}};
				move.target = move.nonGhostTarget as MoveTarget;
			} else if (target?.volatiles['substitute']) {
				delete move.volatileStatus;
				delete move.onHit;
			}
		},
		condition: {
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'Curse', '[of] ' + source);
			},
			onResidualOrder: 10,
			onResidualSubOrder: 8,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 4);
			},
		},
		type: "???",
	},
	defog: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bypasssub: 1, metronome: 1},
	},
	detect: {
		inherit: true,
		priority: 3,
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) return;
				this.add('-activate', target, 'Protect');
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is NOT reset
					if (source.volatiles['lockedmove'].trueDuration >= 2) {
						source.volatiles['lockedmove'].duration = 2;
					}
				}
				return null;
			},
		},
	},
	disable: {
		inherit: true,
		accuracy: 80,
		flags: {protect: 1, mirror: 1, bypasssub: 1, metronome: 1},
		volatileStatus: 'disable',
		condition: {
			durationCallback() {
				return this.random(4, 8);
			},
			noCopy: true,
			onStart(pokemon) {
				if (!this.queue.willMove(pokemon)) {
					this.effectState.duration++;
				}
				if (!pokemon.lastMove) {
					return false;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === pokemon.lastMove.id) {
						if (!moveSlot.pp) {
							return false;
						} else {
							this.add('-start', pokemon, 'Disable', moveSlot.move);
							this.effectState.move = pokemon.lastMove.id;
							return;
						}
					}
				}
				return false;
			},
			onResidualOrder: 10,
			onResidualSubOrder: 13,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Disable');
			},
			onBeforeMovePriority: 7,
			onBeforeMove(attacker, defender, move) {
				if (move.id === this.effectState.move) {
					this.add('cant', attacker, 'Disable', move);
					return false;
				}
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === this.effectState.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
	},
	doomdesire: {
		inherit: true,
		accuracy: 85,
		basePower: 120,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			const moveData = {
				name: "Doom Desire",
				basePower: 120,
				category: "Special",
				flags: {metronome: 1, futuremove: 1},
				willCrit: false,
				type: '???',
			} as unknown as ActiveMove;
			const damage = this.actions.getDamage(source, target, moveData, true);
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 3,
				move: 'doomdesire',
				source: source,
				moveData: {
					id: 'doomdesire',
					name: "Doom Desire",
					accuracy: 85,
					basePower: 0,
					damage: damage,
					category: "Special",
					flags: {metronome: 1, futuremove: 1},
					effectType: 'Move',
					type: '???',
				},
			});
			this.add('-start', source, 'Doom Desire');
			return null;
		},
	},
	doubleedge: {
		inherit: true,
		recoil: [1, 3],
	},
	drainpunch: {
		inherit: true,
		basePower: 60,
		pp: 5,
	},
	dreameater: {
		inherit: true,
		onTryImmunity(target) {
			return target.status === 'slp' && !target.volatiles['substitute'];
		},
	},
	embargo: {
		inherit: true,
		flags: {protect: 1, mirror: 1, metronome: 1},
		onTryHit(pokemon) {
			if (pokemon.ability === 'multitype' || pokemon.item === 'griseousorb') {
				return false;
			}
		},
		condition: {
			duration: 5,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Embargo');
			},
			// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
			onResidualOrder: 10,
			onResidualSubOrder: 18,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Embargo');
			},
		},
	},
	encore: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bypasssub: 1, metronome: 1, failencore: 1},
		volatileStatus: 'encore',
		condition: {
			durationCallback() {
				return this.random(4, 9);
			},
			onStart(target, source) {
				const moveIndex = target.lastMove ? target.moves.indexOf(target.lastMove.id) : -1;
				if (
					!target.lastMove || target.lastMove.flags['failencore'] ||
					!target.moveSlots[moveIndex] || target.moveSlots[moveIndex].pp <= 0
				) {
					// it failed
					return false;
				}
				this.effectState.move = target.lastMove.id;
				this.add('-start', target, 'Encore');
			},
			onOverrideAction(pokemon) {
				return this.effectState.move;
			},
			onResidualOrder: 10,
			onResidualSubOrder: 14,
			onResidual(target) {
				if (
					target.moves.includes(this.effectState.move) &&
					target.moveSlots[target.moves.indexOf(this.effectState.move)].pp <= 0
				) {
					// early termination if you run out of PP
					target.removeVolatile('encore');
				}
			},
			onEnd(target) {
				this.add('-end', target, 'Encore');
			},
			onDisableMove(pokemon) {
				if (!this.effectState.move || !pokemon.hasMove(this.effectState.move)) {
					return;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id !== this.effectState.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
	},
	endeavor: {
		inherit: true,
		onTry(pokemon, target) {
			if (pokemon.hp >= target.hp) {
				this.add('-fail', pokemon);
				return null;
			}
		},
	},
	extremespeed: {
		inherit: true,
		priority: 1,
	},
	fakeout: {
		inherit: true,
		priority: 1,
	},
	feint: {
		inherit: true,
		basePower: 50,
		onTry(source, target) {
			if (!target.volatiles['protect']) {
				this.add('-fail', source);
				return null;
			}
		},
	},
	firespin: {
		inherit: true,
		accuracy: 70,
		basePower: 15,
	},
	flail: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			const ratio = Math.max(Math.floor(pokemon.hp * 64 / pokemon.maxhp), 1);
			let bp;
			if (ratio < 2) {
				bp = 200;
			} else if (ratio < 6) {
				bp = 150;
			} else if (ratio < 13) {
				bp = 100;
			} else if (ratio < 22) {
				bp = 80;
			} else if (ratio < 43) {
				bp = 40;
			} else {
				bp = 20;
			}
			this.debug('BP: ' + bp);
			return bp;
		},
	},
	flareblitz: {
		inherit: true,
		recoil: [1, 3],
	},
	focuspunch: {
		inherit: true,
		priorityChargeCallback() {},
		beforeTurnCallback(pokemon) {
			pokemon.addVolatile('focuspunch');
		},
		beforeMoveCallback() {},
		onTry(pokemon) {
			if (pokemon.volatiles['focuspunch']?.lostFocus) {
				this.attrLastMove('[still]');
				this.add('cant', pokemon, 'Focus Punch', 'Focus Punch');
				return null;
			}
		},
	},
	foresight: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bypasssub: 1, metronome: 1},
	},
	furycutter: {
		inherit: true,
		basePower: 10,
		condition: {
			duration: 2,
			onStart() {
				this.effectState.multiplier = 1;
			},
			onRestart() {
				if (this.effectState.multiplier < 16) {
					this.effectState.multiplier <<= 1;
				}
				this.effectState.duration = 2;
			},
		},
	},
	futuresight: {
		inherit: true,
		accuracy: 90,
		basePower: 80,
		pp: 15,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			const moveData = {
				name: "Future Sight",
				basePower: 80,
				category: "Special",
				flags: {metronome: 1, futuremove: 1},
				willCrit: false,
				type: '???',
			} as unknown as ActiveMove;
			const damage = this.actions.getDamage(source, target, moveData, true);
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 3,
				move: 'futuresight',
				source: source,
				moveData: {
					id: 'futuresight',
					name: "Future Sight",
					accuracy: 90,
					basePower: 0,
					damage: damage,
					category: "Special",
					flags: {metronome: 1, futuremove: 1},
					effectType: 'Move',
					type: '???',
				},
			});
			this.add('-start', source, 'Future Sight');
			return null;
		},
	},
	gigadrain: {
		inherit: true,
		basePower: 60,
	},
	glare: {
		inherit: true,
		accuracy: 75,
	},
	gravity: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Gravity');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Gravity', '[persistent]');
				} else {
					this.add('-fieldstart', 'move: Gravity');
				}
				for (const pokemon of this.getAllActive()) {
					let applies = false;
					if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
						applies = true;
						this.queue.cancelMove(pokemon);
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['skydrop']) {
						applies = true;
						this.queue.cancelMove(pokemon);

						if (pokemon.volatiles['skydrop'].source) {
							this.add('-end', pokemon.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
						}
						pokemon.removeVolatile('skydrop');
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['magnetrise']) {
						applies = true;
						delete pokemon.volatiles['magnetrise'];
					}
					if (pokemon.volatiles['telekinesis']) {
						applies = true;
						delete pokemon.volatiles['telekinesis'];
					}
					if (applies) this.add('-activate', pokemon, 'move: Gravity');
				}
			},
			onModifyAccuracy(accuracy) {
				if (typeof accuracy !== 'number') return;
				return this.chainModify([6840, 4096]);
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['gravity']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['gravity'] && !move.isZ) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onModifyMove(move, pokemon, target) {
				if (move.flags['gravity'] && !move.isZ) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onFieldResidualOrder: 9,
			onFieldEnd() {
				this.add('-fieldend', 'move: Gravity');
			},
		},
	},
	growth: {
		inherit: true,
		onModifyMove() {},
		boosts: {
			spa: 1,
		},
	},
	healbell: {
		inherit: true,
		onHit(target, source) {
			this.add('-activate', source, 'move: Heal Bell');
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (!ally.hasAbility('soundproof')) ally.cureStatus(true);
			}
		},
	},
	healblock: {
		inherit: true,
		flags: {protect: 1, mirror: 1, metronome: 1},
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Heal Block');
					return 7;
				}
				return 5;
			},
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Heal Block');
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['heal']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['heal']) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onResidualOrder: 10,
			onResidualSubOrder: 17,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Heal Block');
			},
			onTryHeal(damage, pokemon, source, effect) {
				if (effect && (effect.id === 'drain' || effect.id === 'leechseed' || effect.id === 'wish')) {
					return false;
				}
			},
		},
	},
	healingwish: {
		inherit: true,
		flags: {heal: 1, metronome: 1},
		onAfterMove(pokemon) {
			pokemon.switchFlag = true;
		},
		condition: {
			duration: 1,
			onSwitchInPriority: -1,
			onSwitchIn(target) {
				if (target.hp > 0) {
					target.heal(target.maxhp);
					target.clearStatus();
					this.add('-heal', target, target.getHealth, '[from] move: Healing Wish');
					target.side.removeSlotCondition(target, 'healingwish');
					target.lastMove = this.lastMove;
				} else {
					target.switchFlag = true;
				}
			},
		},
	},
	highjumpkick: {
		inherit: true,
		basePower: 100,
		pp: 20,
		onMoveFail(target, source, move) {
			move.causedCrashDamage = true;
			let damage = this.actions.getDamage(source, target, move, true);
			if (!damage) damage = target.maxhp;
			this.damage(this.clampIntRange(damage / 2, 1, Math.floor(target.maxhp / 2)), source, source, move);
		},
	},
	iciclespear: {
		inherit: true,
		basePower: 10,
	},
	imprison: {
		inherit: true,
		flags: {bypasssub: 1, metronome: 1},
		onTryHit(pokemon) {
			for (const target of pokemon.foes()) {
				for (const move of pokemon.moves) {
					if (target.moves.includes(move)) return;
				}
			}
			return false;
		},
	},
	ingrain: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Ingrain');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 1,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 16);
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap();
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onDragOut(pokemon) {
				this.add('-activate', pokemon, 'move: Ingrain');
				return null;
			},
		},
	},
	jumpkick: {
		inherit: true,
		basePower: 85,
		pp: 25,
		onMoveFail(target, source, move) {
			move.causedCrashDamage = true;
			let damage = this.actions.getDamage(source, target, move, true);
			if (!damage) damage = target.maxhp;
			this.damage(this.clampIntRange(damage / 2, 1, Math.floor(target.maxhp / 2)), source, source, move);
		},
	},
	knockoff: {
		inherit: true,
		onAfterHit(target, source, move) {
			if (!target.item || target.itemState.knockedOff) return;
			if (target.ability === 'multitype') return;
			const item = target.getItem();
			if (this.runEvent('TakeItem', target, source, move, item)) {
				target.itemState.knockedOff = true;
				this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of] ' + source);
				this.hint("In Gens 3-4, Knock Off only makes the target's item unusable; it cannot obtain a new item.", true);
			}
		},
	},
	lastresort: {
		inherit: true,
		basePower: 130,
	},
	leechseed: {
		inherit: true,
		condition: {
			onStart(target) {
				this.add('-start', target, 'move: Leech Seed');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 5,
			onResidual(pokemon) {
				const target = this.getAtSlot(pokemon.volatiles['leechseed'].sourceSlot);
				if (!target || target.fainted || target.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				const damage = this.damage(pokemon.baseMaxhp / 8, pokemon, target);
				if (damage) {
					this.heal(damage, target, pokemon);
				}
			},
		},
	},
	lightscreen: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onAnyModifyDamagePhase1(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Special') {
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Light Screen weaken');
						if (target.alliesAndSelf().length > 1) return this.chainModify(2, 3);
						return this.chainModify(0.5);
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'Light Screen');
			},
			onSideResidualOrder: 2,
			onSideEnd(side) {
				this.add('-sideend', side, 'Light Screen');
			},
		},
	},
	lockon: {
		inherit: true,
		condition: {
			duration: 2,
			onSourceInvulnerabilityPriority: 1,
			onSourceInvulnerability(target, source, move) {
				if (move && source === this.effectState.target && target === this.effectState.source) return 0;
			},
			onSourceAccuracy(accuracy, target, source, move) {
				if (move && source === this.effectState.target && target === this.effectState.source) return true;
			},
		},
	},
	luckychant: {
		inherit: true,
		flags: {metronome: 1},
		condition: {
			duration: 5,
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Lucky Chant');
			},
			onCriticalHit: false,
			onSideResidualOrder: 6,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Lucky Chant');
			},
		},
	},
	lunardance: {
		inherit: true,
		flags: {heal: 1, metronome: 1},
		onAfterMove(pokemon) {
			pokemon.switchFlag = true;
		},
		condition: {
			duration: 1,
			onSideStart(side) {
				this.debug('Lunar Dance started on ' + side.name);
			},
			onSwitchInPriority: -1,
			onSwitchIn(target) {
				if (target.getSlot() !== this.effectState.sourceSlot) {
					return;
				}
				if (target.hp > 0) {
					target.heal(target.maxhp);
					target.clearStatus();
					for (const moveSlot of target.moveSlots) {
						moveSlot.pp = moveSlot.maxpp;
					}
					this.add('-heal', target, target.getHealth, '[from] move: Lunar Dance');
					target.side.removeSlotCondition(target, 'lunardance');
					target.lastMove = this.lastMove;
				} else {
					target.switchFlag = true;
				}
			},
		},
	},
	magiccoat: {
		inherit: true,
		condition: {
			duration: 1,
			onTryHitPriority: 2,
			onTryHit(target, source, move) {
				if (target === source || move.hasBounced || !move.flags['reflectable']) {
					return;
				}
				target.removeVolatile('magiccoat');
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				this.actions.useMove(newMove, target, source);
				return null;
			},
		},
	},
	magmastorm: {
		inherit: true,
		accuracy: 70,
	},
	magnetrise: {
		inherit: true,
		flags: {gravity: 1, metronome: 1},
		volatileStatus: 'magnetrise',
		condition: {
			duration: 5,
			onStart(target) {
				if (target.volatiles['ingrain'] || target.ability === 'levitate') return false;
				this.add('-start', target, 'Magnet Rise');
			},
			onImmunity(type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 10,
			onResidualSubOrder: 16,
			onEnd(target) {
				this.add('-end', target, 'Magnet Rise');
			},
		},
	},
	mefirst: {
		inherit: true,
		condition: {
			duration: 1,
			onModifyDamagePhase2(damage) {
				return damage * 1.5;
			},
		},
	},
	metalburst: {
		inherit: true,
		flags: {protect: 1, mirror: 1, metronome: 1},
	},
	metronome: {
		inherit: true,
		flags: {noassist: 1, failcopycat: 1, nosleeptalk: 1, failmimic: 1},
	},
	mimic: {
		inherit: true,
		flags: {
			protect: 1, bypasssub: 1, allyanim: 1, noassist: 1, failcopycat: 1, failencore: 1, failinstruct: 1, failmimic: 1,
		},
		onHit(target, source) {
			if (source.transformed || !target.lastMove || target.volatiles['substitute']) {
				return false;
			}
			if (target.lastMove.flags['failmimic'] || source.moves.includes(target.lastMove.id)) {
				return false;
			}
			const mimicIndex = source.moves.indexOf('mimic');
			if (mimicIndex < 0) return false;
			const move = this.dex.moves.get(target.lastMove.id);
			source.moveSlots[mimicIndex] = {
				move: move.name,
				id: move.id,
				pp: 5,
				maxpp: move.pp * 8 / 5,
				disabled: false,
				used: false,
				virtual: true,
			};
			this.add('-activate', source, 'move: Mimic', move.name);
		},
	},
	minimize: {
		inherit: true,
		boosts: {
			evasion: 1,
		},
	},
	miracleeye: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bypasssub: 1, metronome: 1},
	},
	mirrormove: {
		inherit: true,
		onTryHit() {},
		onHit(pokemon) {
			const lastAttackedBy = pokemon.getLastAttackedBy();
			if (!lastAttackedBy?.source.lastMove || !lastAttackedBy.move) {
				 return false;
			}
			const noMirror = [
				'acupressure', 'aromatherapy', 'assist', 'chatter', 'copycat', 'counter', 'curse', 'doomdesire', 'feint', 'focuspunch', 'futuresight', 'gravity', 'hail', 'haze', 'healbell', 'helpinghand', 'lightscreen', 'luckychant', 'magiccoat', 'mefirst', 'metronome', 'mimic', 'mirrorcoat', 'mirrormove', 'mist', 'mudsport', 'naturepower', 'perishsong', 'psychup', 'raindance', 'reflect', 'roleplay', 'safeguard', 'sandstorm', 'sketch', 'sleeptalk', 'snatch', 'spikes', 'spitup', 'stealthrock', 'struggle', 'sunnyday', 'tailwind', 'toxicspikes', 'transform', 'watersport',
			];
			if (noMirror.includes(lastAttackedBy.move) || !lastAttackedBy.source.hasMove(lastAttackedBy.move)) {
				return false;
			}
			this.actions.useMove(lastAttackedBy.move, pokemon);
		},
		target: "self",
	},
	mist: {
		inherit: true,
		condition: {
			duration: 5,
			onTryBoost(boost, target, source, effect) {
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if (source && target !== source) {
					let showMsg = false;
					let i: BoostID;
					for (i in boost) {
						if (boost[i]! < 0) {
							delete boost[i];
							showMsg = true;
						}
					}
					if (showMsg && !(effect as ActiveMove).secondaries) {
						this.add('-activate', target, 'move: Mist');
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'Mist');
			},
			onSideResidualOrder: 3,
			onSideEnd(side) {
				this.add('-sideend', side, 'Mist');
			},
		},
	},
	moonlight: {
		inherit: true,
		onHit(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (this.field.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.heal(pokemon.baseMaxhp / 4);
			} else {
				this.heal(pokemon.baseMaxhp / 2);
			}
		},
	},
	morningsun: {
		inherit: true,
		onHit(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (this.field.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.heal(pokemon.baseMaxhp / 4);
			} else {
				this.heal(pokemon.baseMaxhp / 2);
			}
		},
	},
	mudsport: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Mud Sport');
			},
			onAnyBasePowerPriority: 3,
			onAnyBasePower(basePower, user, target, move) {
				if (move.type === 'Electric') {
					this.debug('mud sport weaken');
					return this.chainModify(0.5);
				}
			},
		},
	},
	naturepower: {
		inherit: true,
		flags: {metronome: 1},
		onHit(pokemon) {
			this.actions.useMove('triattack', pokemon);
		},
	},
	nightmare: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(pokemon) {
				if (pokemon.status !== 'slp' && !pokemon.hasAbility('comatose')) {
					return false;
				}
				this.add('-start', pokemon, 'Nightmare');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 7,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 4);
			},
		},
	},
	odorsleuth: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bypasssub: 1, metronome: 1},
	},
	outrage: {
		inherit: true,
		pp: 15,
		onAfterMove() {},
	},
	payback: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			if (this.queue.willMove(target)) {
				return 50;
			}
			this.debug('BP doubled');
			return 100;
		},
	},
	payday: {
		inherit: true,
		onHit() {
			this.add('-fieldactivate', 'move: Pay Day');
		},
	},
	perishsong: {
		inherit: true,
		condition: {
			duration: 4,
			onEnd(target) {
				this.add('-start', target, 'perish0');
				target.faint();
			},
			onResidualOrder: 12,
			onResidual(pokemon) {
				const duration = pokemon.volatiles['perishsong'].duration;
				this.add('-start', pokemon, 'perish' + duration);
			},
		},
	},
	petaldance: {
		inherit: true,
		basePower: 90,
		pp: 20,
		onAfterMove() {},
	},
	poisongas: {
		inherit: true,
		accuracy: 55,
		target: "normal",
	},
	powertrick: {
		inherit: true,
		flags: {metronome: 1},
	},
	protect: {
		inherit: true,
		priority: 3,
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) return;
				this.add('-activate', target, 'Protect');
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is NOT reset
					if (source.volatiles['lockedmove'].trueDuration >= 2) {
						source.volatiles['lockedmove'].duration = 2;
					}
				}
				return null;
			},
		},
	},
	psychup: {
		inherit: true,
		flags: {snatch: 1, bypasssub: 1, metronome: 1},
	},
	pursuit: {
		inherit: true,
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Pursuit start');
				let alreadyAdded = false;
				for (const source of this.effectState.sources) {
					if (!this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Pursuit');
						alreadyAdded = true;
					}
					// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (source.canMegaEvo || source.canUltraBurst) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source && action.choice === 'megaEvo') {
								this.actions.runMegaEvo(source);
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.actions.runMove('pursuit', source, source.getLocOf(pokemon));
				}
			},
		},
	},
	rapidspin: {
		inherit: true,
		self: {
			onHit(pokemon) {
				if (pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				for (const condition of sideConditions) {
					if (pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
					}
				}
				if (pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			},
		},
	},
	recycle: {
		inherit: true,
		flags: {metronome: 1},
	},
	reflect: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onAnyModifyDamagePhase1(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Physical') {
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Reflect weaken');
						if (target.alliesAndSelf().length > 1) return this.chainModify(2, 3);
						return this.chainModify(0.5);
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'Reflect');
			},
			onSideResidualOrder: 1,
			onSideEnd(side) {
				this.add('-sideend', side, 'Reflect');
			},
		},
	},
	reversal: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			const ratio = Math.max(Math.floor(pokemon.hp * 64 / pokemon.maxhp), 1);
			let bp;
			if (ratio < 2) {
				bp = 200;
			} else if (ratio < 6) {
				bp = 150;
			} else if (ratio < 13) {
				bp = 100;
			} else if (ratio < 22) {
				bp = 80;
			} else if (ratio < 43) {
				bp = 40;
			} else {
				bp = 20;
			}
			this.debug('BP: ' + bp);
			return bp;
		},
	},
	roar: {
		inherit: true,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1},
	},
	rockblast: {
		inherit: true,
		accuracy: 80,
	},
	roleplay: {
		inherit: true,
		onTryHit(target, source) {
			if (target.ability === source.ability || source.hasItem('griseousorb')) return false;
			if (target.getAbility().flags['failroleplay'] || source.ability === 'multitype') {
				return false;
			}
		},
	},
	safeguard: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Safeguard');
					return 7;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (!effect || !source) return;
				if (effect.id === 'yawn') return;
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if (target !== source) {
					this.debug('interrupting setStatus');
					if (effect.id === 'synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
						this.add('-activate', target, 'move: Safeguard');
					}
					return null;
				}
			},
			onTryAddVolatile(status, target, source, effect) {
				if (!effect || !source) return;
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if ((status.id === 'confusion' || status.id === 'yawn') && target !== source) {
					if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Safeguard');
					return null;
				}
			},
			onSideStart(side, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-sidestart', side, 'Safeguard', '[persistent]');
				} else {
					this.add('-sidestart', side, 'Safeguard');
				}
			},
			onSideResidualOrder: 4,
			onSideEnd(side) {
				this.add('-sideend', side, 'Safeguard');
			},
		},
	},
	sandtomb: {
		inherit: true,
		accuracy: 70,
		basePower: 15,
	},
	scaryface: {
		inherit: true,
		accuracy: 90,
	},
	secretpower: {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'par',
		},
	},
	sketch: {
		inherit: true,
		flags: {bypasssub: 1, allyanim: 1, failencore: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1},
		onHit(target, source) {
			const disallowedMoves = ['chatter', 'sketch', 'struggle'];
			if (source.transformed || !target.lastMove || target.volatiles['substitute']) {
				return false;
			}
			if (disallowedMoves.includes(target.lastMove.id) || source.moves.includes(target.lastMove.id)) {
				 return false;
			}
			const sketchIndex = source.moves.indexOf('sketch');
			if (sketchIndex < 0) return false;
			const move = this.dex.moves.get(target.lastMove.id);
			const sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				disabled: false,
				used: false,
			};
			source.moveSlots[sketchIndex] = sketchedMove;
			source.baseMoveSlots[sketchIndex] = sketchedMove;
			this.add('-activate', source, 'move: Mimic', move.name);
		},
	},
	skillswap: {
		inherit: true,
		onHit(target, source) {
			const targetAbility = target.ability;
			const sourceAbility = source.ability;
			if (targetAbility === sourceAbility || source.hasItem('griseousorb') || target.hasItem('griseousorb')) {
				return false;
			}
			this.add('-activate', source, 'move: Skill Swap');
			source.setAbility(targetAbility);
			target.setAbility(sourceAbility);
		},
	},
	sleeptalk: {
		inherit: true,
		onTryHit(pokemon) {
			return !pokemon.volatiles['choicelock'] && !pokemon.volatiles['encore'];
		},
	},
	snatch: {
		inherit: true,
		flags: {bypasssub: 1, noassist: 1, failcopycat: 1},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'Snatch');
			},
			onAnyPrepareHitPriority: -1,
			onAnyPrepareHit(source, target, move) {
				const snatchUser = this.effectState.source;
				if (snatchUser.isSkyDropped()) return;
				if (!move || move.isZ || move.isMax || !move.flags['snatch']) {
					return;
				}
				snatchUser.removeVolatile('snatch');
				this.add('-activate', snatchUser, 'move: Snatch', '[of] ' + source);
				this.actions.useMove(move.id, snatchUser);
				return null;
			},
		},
	},
	snore: {
		inherit: true,
		flags: {protect: 1, mirror: 1, sound: 1, metronome: 1},
	},
	spikes: {
		inherit: true,
		flags: {metronome: 1, mustpressure: 1},
	},
	spite: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bypasssub: 1, metronome: 1},
	},
	stealthrock: {
		inherit: true,
		flags: {metronome: 1, mustpressure: 1},
	},
	struggle: {
		inherit: true,
		flags: {
			contact: 1, protect: 1, failencore: 1, failmefirst: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
		},
		onModifyMove(move) {
			move.type = '???';
		},
	},
	substitute: {
		inherit: true,
		condition: {
			onStart(target) {
				this.add('-start', target, 'Substitute');
				this.effectState.hp = Math.floor(target.maxhp / 4);
				delete target.volatiles['partiallytrapped'];
			},
			onTryPrimaryHitPriority: -1,
			onTryPrimaryHit(target, source, move) {
				if (target === source || move.flags['bypasssub']) {
					return;
				}
				let damage = this.actions.getDamage(source, target, move);
				if (!damage && damage !== 0) {
					this.add('-fail', source);
					this.attrLastMove('[still]');
					return null;
				}
				damage = this.runEvent('SubDamage', target, source, move, damage);
				if (!damage) {
					return damage;
				}
				if (damage > target.volatiles['substitute'].hp) {
					damage = target.volatiles['substitute'].hp as number;
				}
				target.volatiles['substitute'].hp -= damage;
				source.lastDamage = damage;
				if (target.volatiles['substitute'].hp <= 0) {
					target.removeVolatile('substitute');
					target.addVolatile('substitutebroken');
					if (target.volatiles['substitutebroken']) target.volatiles['substitutebroken'].move = move.id;
					if (move.ohko) this.add('-ohko');
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				if (move.recoil && damage) {
					this.damage(this.actions.calcRecoilDamage(damage, move, source), source, target, 'recoil');
				}
				if (move.drain) {
					this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
				}
				this.runEvent('AfterSubDamage', target, source, move, damage);
				return this.HIT_SUBSTITUTE;
			},
			onEnd(target) {
				this.add('-end', target, 'Substitute');
			},
		},
	},
	suckerpunch: {
		inherit: true,
		onTry(source, target) {
			const action = this.queue.willMove(target);
			if (!action || action.choice !== 'move' || action.move.category === 'Status' || target.volatiles['mustrecharge']) {
				this.add('-fail', source);
				return null;
			}
		},
	},
	switcheroo: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target.hasAbility('multitype') || source.hasAbility('multitype')) return false;
		},
	},
	synthesis: {
		inherit: true,
		onHit(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (this.field.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.heal(pokemon.baseMaxhp / 4);
			} else {
				this.heal(pokemon.baseMaxhp / 2);
			}
		},
	},
	tackle: {
		inherit: true,
		accuracy: 95,
		basePower: 35,
	},
	tailglow: {
		inherit: true,
		boosts: {
			spa: 2,
		},
	},
	tailwind: {
		inherit: true,
		condition: {
			duration: 3,
			durationCallback(target, source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Tailwind');
					return 5;
				}
				return 3;
			},
			onSideStart(side, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-sidestart', side, 'move: Tailwind', '[persistent]');
				} else {
					this.add('-sidestart', side, 'move: Tailwind');
				}
			},
			onModifySpe(spe) {
				return spe * 2;
			},
			onSideResidualOrder: 5,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Tailwind');
			},
		},
	},
	taunt: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bypasssub: 1, metronome: 1},
		condition: {
			durationCallback() {
				return this.random(3, 6);
			},
			onStart(target) {
				this.add('-start', target, 'move: Taunt');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 15,
			onEnd(target) {
				this.add('-end', target, 'move: Taunt');
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).category === 'Status') {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 5,
			onBeforeMove(attacker, defender, move) {
				if (move.category === 'Status') {
					this.add('cant', attacker, 'move: Taunt', move);
					return false;
				}
			},
		},
	},
	thrash: {
		inherit: true,
		basePower: 90,
		pp: 20,
		onAfterMove() {},
	},
	torment: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bypasssub: 1, metronome: 1},
	},
	toxic: {
		inherit: true,
		accuracy: 85,
	},
	toxicspikes: {
		inherit: true,
		flags: {metronome: 1, mustpressure: 1},
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers++;
			},
			onEntryHazard(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (pokemon.volatiles['substitute'] || pokemon.hasType('Steel')) {
					return;
				} else if (this.effectState.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
			},
		},
	},
	transform: {
		inherit: true,
		flags: {bypasssub: 1, metronome: 1, failencore: 1},
	},
	trick: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target.hasAbility('multitype') || source.hasAbility('multitype')) return false;
		},
	},
	trickroom: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Trick Room');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Trick Room', '[of] ' + source, '[persistent]');
				} else {
					this.add('-fieldstart', 'move: Trick Room', '[of] ' + source);
				}
			},
			onFieldRestart(target, source) {
				this.field.removePseudoWeather('trickroom');
			},
			// Speed modification is changed in Pokemon.getActionSpeed() in sim/pokemon.js
			onFieldResidualOrder: 13,
			onFieldEnd() {
				this.add('-fieldend', 'move: Trick Room');
			},
		},
	},
	uproar: {
		inherit: true,
		basePower: 50,
		condition: {
			onStart(target) {
				this.add('-start', target, 'Uproar');
				// 3-6 turns
				this.effectState.duration = this.random(3, 7);
			},
			onResidual(target) {
				if (target.volatiles['throatchop']) {
					target.removeVolatile('uproar');
					return;
				}
				if (target.lastMove && target.lastMove.id === 'struggle') {
					// don't lock
					delete target.volatiles['uproar'];
				}
				this.add('-start', target, 'Uproar', '[upkeep]');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 11,
			onEnd(target) {
				this.add('-end', target, 'Uproar');
			},
			onLockMove: 'uproar',
			onAnySetStatus(status, pokemon) {
				if (status.id === 'slp') {
					if (pokemon === this.effectState.target) {
						this.add('-fail', pokemon, 'slp', '[from] Uproar', '[msg]');
					} else {
						this.add('-fail', pokemon, 'slp', '[from] Uproar');
					}
					return null;
				}
			},
		},
	},
	volttackle: {
		inherit: true,
		recoil: [1, 3],
	},
	watersport: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Water Sport');
			},
			onAnyBasePowerPriority: 3,
			onAnyBasePower(basePower, user, target, move) {
				if (move.type === 'Fire') {
					this.debug('water sport weaken');
					return this.chainModify(0.5);
				}
			},
		},
	},
	whirlpool: {
		inherit: true,
		accuracy: 70,
		basePower: 15,
	},
	whirlwind: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bypasssub: 1, metronome: 1},
	},
	wish: {
		inherit: true,
		flags: {heal: 1, metronome: 1},
		slotCondition: 'Wish',
		condition: {
			duration: 2,
			onResidualOrder: 7,
			onEnd(target) {
				if (!target.fainted) {
					const source = this.effectState.source;
					const damage = this.heal(target.baseMaxhp / 2, target, target);
					if (damage) this.add('-heal', target, target.getHealth, '[from] move: Wish', '[wisher] ' + source.name);
				}
			},
		},
	},
	woodhammer: {
		inherit: true,
		recoil: [1, 3],
	},
	worryseed: {
		inherit: true,
		onTryHit(pokemon) {
			const bannedAbilities = ['multitype', 'truant'];
			if (bannedAbilities.includes(pokemon.ability) || pokemon.hasItem('griseousorb')) {
				return false;
			}
		},
	},
	wrap: {
		inherit: true,
		accuracy: 85,
	},
	wringout: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			const bp = Math.floor(target.hp * 120 / target.maxhp) + 1;
			this.debug('BP for ' + target.hp + '/' + target.maxhp + " HP: " + bp);
			return bp;
		},
	},
	yawn: {
		inherit: true,
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			duration: 2,
			onStart(target, source) {
				this.add('-start', target, 'move: Yawn', '[of] ' + source);
			},
			onResidualOrder: 10,
			onResidualSubOrder: 19,
			onEnd(target) {
				this.add('-end', target, 'move: Yawn', '[silent]');
				target.trySetStatus('slp', this.effectState.source);
			},
		},
	},
};
