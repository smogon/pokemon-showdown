export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	acupressure: {
		inherit: true,
		flags: { snatch: 1, metronome: 1 },
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
		flags: { metronome: 1 },
		condition: {
			inherit: true,
			onResidualOrder: 10,
			onResidualSubOrder: 2,
		},
	},
	assist: {
		inherit: true,
		onHit(target) {
			const moves = [];
			for (const pokemon of target.side.pokemon) {
				if (pokemon === target) continue;
				for (const moveSlot of pokemon.moveSlots) {
					const moveid = moveSlot.id;
					const move = this.dex.moves.get(moveid);
					if (
						move.flags['noassist'] ||
						(this.field.pseudoWeather['gravity'] && move.flags['gravity']) ||
						(target.volatiles['healblock'] && move.flags['heal'])
					) {
						continue;
					}
					moves.push(moveid);
				}
			}
			let randomMove = '';
			if (moves.length) randomMove = this.sample(moves);
			if (!randomMove) {
				return false;
			}
			this.actions.useMove(randomMove, target);
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
				return this.dex.species.get(move.allies!.shift()!.set.species).baseStats.atk;
			},
			onFoeModifyDefPriority: -101,
			onFoeModifyDef(def, pokemon) {
				this.event.modifier = 1;
				return this.dex.species.get(pokemon.set.species).baseStats.def;
			},
		},
	},
	bide: {
		inherit: true,
		condition: {
			inherit: true,
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
						flags: { contact: 1, protect: 1 },
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
		flags: { metronome: 1 },
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
	conversion2: {
		inherit: true,
		onHit(target, source) {
			if (!target.lastMoveUsed) {
				return false;
			}
			const possibleTypes = [];
			const lastMoveUsed = target.lastMoveUsed;
			const attackType = lastMoveUsed.id === 'struggle' ? 'Normal' : lastMoveUsed.type;
			for (const typeName of this.dex.types.names()) {
				if (source.hasType(typeName)) continue;
				const typeCheck = this.dex.types.get(typeName).damageTaken[attackType];
				if (typeCheck === 2 || typeCheck === 3) {
					possibleTypes.push(typeName);
				}
			}
			if (!possibleTypes.length) {
				return false;
			}
			const randomType = this.sample(possibleTypes);

			if (!source.setType(randomType)) return false;
			this.add('-start', source, 'typechange', randomType);
		},
	},
	copycat: {
		inherit: true,
		onHit(pokemon) {
			const move: Move | ActiveMove | null = this.lastMove;
			if (!move) return;

			if (
				move.flags['failcopycat'] ||
				(this.field.pseudoWeather['gravity'] && move.flags['gravity']) ||
				(pokemon.volatiles['healblock'] && move.flags['heal'])
			) {
				return false;
			}
			this.actions.useMove(move.id, pokemon);
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
			this.debug(`BP for ${target.hp}/${target.maxhp} HP: ${bp}`);
			return bp;
		},
	},
	curse: {
		inherit: true,
		flags: { metronome: 1 },
		onModifyMove(move, source, target) {
			if (!source.hasType('Ghost')) {
				delete move.volatileStatus;
				delete move.onHit;
				move.self = { boosts: { atk: 1, def: 1, spe: -1 } };
				move.target = move.nonGhostTarget!;
			} else if (target?.volatiles['substitute']) {
				delete move.volatileStatus;
				delete move.onHit;
			}
		},
		condition: {
			inherit: true,
			onResidualOrder: 10,
			onResidualSubOrder: 8,
		},
		type: "???",
	},
	defog: {
		inherit: true,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
	detect: {
		inherit: true,
		priority: 3,
	},
	disable: {
		inherit: true,
		accuracy: 80,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		condition: {
			inherit: true,
			duration: undefined,
			durationCallback() {
				return this.random(4, 8);
			},
			onStart(pokemon) {
				if (!this.queue.willMove(pokemon)) {
					this.effectState.duration!++;
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
				flags: { metronome: 1, futuremove: 1 },
				willCrit: false,
				type: '???',
			} as unknown as ActiveMove;
			const damage = this.actions.getDamage(source, target, moveData, true);
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 3,
				move: 'doomdesire',
				source,
				moveData: {
					id: 'doomdesire',
					name: "Doom Desire",
					accuracy: 85,
					basePower: 0,
					damage,
					category: "Special",
					flags: { metronome: 1, futuremove: 1 },
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
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryHit(pokemon) {
			if (pokemon.ability === 'multitype' || pokemon.item === 'griseousorb') {
				return false;
			}
		},
		condition: {
			inherit: true,
			onResidualOrder: 10,
			onResidualSubOrder: 18,
		},
	},
	encore: {
		inherit: true,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1, failencore: 1 },
		volatileStatus: 'encore',
		condition: {
			inherit: true,
			duration: undefined,
			durationCallback() {
				return this.random(4, 9);
			},
			onResidualOrder: 10,
			onResidualSubOrder: 14,
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
		basePowerCallback(pokemon) {
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
			this.debug(`BP: ${bp}`);
			return bp;
		},
	},
	flareblitz: {
		inherit: true,
		recoil: [1, 3],
	},
	fling: {
		inherit: true,
		onPrepareHit(target, source, move) {
			if (source.ignoringItem(true)) return false;
			if (source.hasAbility('multitype')) return false;
			const item = source.getItem();
			if (!this.singleEvent('TakeItem', item, source.itemState, source, source, move, item)) return false;
			if (!item.fling) return false;
			move.basePower = item.fling.basePower;
			this.debug(`BP: ${move.basePower}`);
			if (item.isBerry) {
				move.onHit = function (foe) {
					if (this.singleEvent('Eat', item, source.itemState, foe, source, move)) {
						this.runEvent('EatItem', foe, source, move, item);
						if (item.id === 'leppaberry') foe.staleness = 'external';
					}
					if (item.onEat) foe.ateBerry = true;
				};
			} else if (item.fling.effect) {
				move.onHit = item.fling.effect;
			} else {
				if (!move.secondaries) move.secondaries = [];
				if (item.fling.status) {
					move.secondaries.push({ status: item.fling.status });
				} else if (item.fling.volatileStatus) {
					move.secondaries.push({ volatileStatus: item.fling.volatileStatus });
				}
			}
			source.addVolatile('fling');
		},
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
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
	furycutter: {
		inherit: true,
		basePower: 10,
		condition: {
			inherit: true,
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
				flags: { metronome: 1, futuremove: 1 },
				willCrit: false,
				type: '???',
			} as unknown as ActiveMove;
			const damage = this.actions.getDamage(source, target, moveData, true);
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 3,
				move: 'futuresight',
				source,
				moveData: {
					id: 'futuresight',
					name: "Future Sight",
					accuracy: 90,
					basePower: 0,
					damage,
					category: "Special",
					flags: { metronome: 1, futuremove: 1 },
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
			inherit: true,
			onFieldResidualOrder: 9,
			onFieldResidualSubOrder: undefined,
		},
	},
	growth: {
		inherit: true,
		onModifyMove() {},
		boosts: {
			spa: 1,
		},
	},
	haze: {
		inherit: true,
		onHitField() {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
				pokemon.removeVolatile('focusenergy');
			}
		},
	},
	healbell: {
		inherit: true,
		onHit(target, source) {
			this.add('-activate', source, 'move: Heal Bell');
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally.hasAbility('soundproof') && !this.suppressingAbility(ally)) {
					if (ally.isActive) this.add('-immune', ally, '[from] ability: Soundproof');
					continue;
				}
				ally.cureStatus(true);
			}
		},
	},
	healblock: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		condition: {
			inherit: true,
			onResidualOrder: 10,
			onResidualSubOrder: 17,
			onTryHeal(damage, pokemon, source, effect) {
				if (effect && (effect.id === 'drain' || effect.id === 'leechseed' || effect.id === 'wish')) {
					return false;
				}
			},
		},
	},
	healingwish: {
		inherit: true,
		flags: { heal: 1, metronome: 1 },
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
		flags: { bypasssub: 1, metronome: 1 },
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
			inherit: true,
			onResidualOrder: 10,
			onResidualSubOrder: 1,
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
			if (!target.item) return;
			if (target.ability === 'multitype') return;
			const item = target.getItem();
			if (this.runEvent('TakeItem', target, source, move, item)) {
				target.item = '';
				target.itemKnockedOff = true;
				this.add('-enditem', target, item.name, '[from] move: Knock Off', `[of] ${source}`);
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
			inherit: true,
			onResidualOrder: 10,
			onResidualSubOrder: 5,
		},
	},
	lightscreen: {
		inherit: true,
		condition: {
			inherit: true,
			onAnyModifyDamage() {},
			onAnyModifyDamagePhase1(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Special') {
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Light Screen weaken');
						if (target.alliesAndSelf().length > 1) return this.chainModify(2, 3);
						return this.chainModify(0.5);
					}
				}
			},
			onSideResidualOrder: 2,
			onSideResidualSubOrder: undefined,
		},
	},
	lockon: {
		inherit: true,
		condition: {
			inherit: true,
			noCopy: false,
		},
	},
	luckychant: {
		inherit: true,
		flags: { metronome: 1 },
		condition: {
			inherit: true,
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 6,
		},
	},
	lunardance: {
		inherit: true,
		flags: { heal: 1, metronome: 1 },
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
			inherit: true,
			onTryHit(target, source, move) {
				if (target === source || move.hasBounced || !move.flags['reflectable']) {
					return;
				}
				target.removeVolatile('magiccoat');
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				this.actions.useMove(newMove, target, { target: source });
				return null;
			},
			onAllyTryHitSide() {},
		},
	},
	magmastorm: {
		inherit: true,
		accuracy: 70,
	},
	magnetrise: {
		inherit: true,
		flags: { gravity: 1, metronome: 1 },
		volatileStatus: 'magnetrise',
		condition: {
			inherit: true,
			onStart(target) {
				if (target.volatiles['ingrain'] || target.ability === 'levitate') return false;
				this.add('-start', target, 'Magnet Rise');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 16,
		},
	},
	mefirst: {
		inherit: true,
		condition: {
			inherit: true,
			onBasePower() {},
			onModifyDamagePhase2(damage) {
				return damage * 1.5;
			},
		},
	},
	metalburst: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
	},
	metronome: {
		inherit: true,
		flags: { noassist: 1, failcopycat: 1, nosleeptalk: 1, failmimic: 1 },
		onHit(pokemon) {
			const moves = this.dex.moves.all().filter(move => (
				(![2, 4].includes(this.gen) || !pokemon.moves.includes(move.id)) &&
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable') &&
				move.flags['metronome'] &&
				!(this.field.pseudoWeather['gravity'] && move.flags['gravity']) &&
				!(pokemon.volatiles['healblock'] && move.flags['heal'])
			));
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
			}
			if (!randomMove) return false;
			pokemon.side.lastSelectedMove = this.toID(randomMove);
			this.actions.useMove(randomMove, pokemon);
		},
	},
	mimic: {
		inherit: true,
		flags: {
			protect: 1, allyanim: 1, noassist: 1, failcopycat: 1, failencore: 1, failinstruct: 1, failmimic: 1,
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
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
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
			inherit: true,
			onSideResidualOrder: 3,
			onSideResidualSubOrder: undefined,
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
			inherit: true,
			onAnyBasePowerPriority: 3,
			onAnyBasePower(basePower, user, target, move) {
				if (move.type === 'Electric') {
					this.debug('Mud Sport weaken');
					return this.chainModify(0.5);
				}
			},
		},
	},
	naturepower: {
		inherit: true,
		flags: { metronome: 1 },
		onHit(pokemon) {
			this.actions.useMove('triattack', pokemon);
		},
	},
	nightmare: {
		inherit: true,
		condition: {
			inherit: true,
			onResidualOrder: 10,
			onResidualSubOrder: 7,
		},
	},
	odorsleuth: {
		inherit: true,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
	outrage: {
		inherit: true,
		pp: 15,
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
			inherit: true,
			onResidualOrder: 12,
		},
	},
	petaldance: {
		inherit: true,
		basePower: 90,
		pp: 20,
	},
	poisongas: {
		inherit: true,
		accuracy: 55,
		target: "normal",
	},
	powertrick: {
		inherit: true,
		flags: { metronome: 1 },
	},
	protect: {
		inherit: true,
		priority: 3,
		condition: {
			inherit: true,
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
		flags: { snatch: 1, bypasssub: 1, metronome: 1 },
	},
	pursuit: {
		inherit: true,
		beforeTurnCallback(pokemon) {
			if (['frz', 'slp'].includes(pokemon.status) ||
				(pokemon.hasAbility('truant') && pokemon.volatiles['truant'])) return;
			for (const target of pokemon.foes()) {
				target.addVolatile('pursuit');
				const data = target.volatiles['pursuit'];
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		condition: {
			inherit: true,
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
					const move = this.dex.getActiveMove('pursuit');
					source.deductPP(move.id);
					source.moveUsed(move, pokemon.position);
					if (this.actions.useMove(move, source, { target: pokemon }) && source.getItem().isChoice) {
						source.addVolatile('choicelock');
					}
				}
			},
		},
	},
	rapidspin: {
		inherit: true,
		self: {
			onHit(pokemon) {
				if (pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', `[of] ${pokemon}`);
				}
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				for (const condition of sideConditions) {
					if (pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', `[of] ${pokemon}`);
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
		flags: { metronome: 1 },
	},
	reflect: {
		inherit: true,
		condition: {
			inherit: true,
			onAnyModifyDamage() {},
			onAnyModifyDamagePhase1(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Physical') {
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Reflect weaken');
						if (target.alliesAndSelf().length > 1) return this.chainModify(2, 3);
						return this.chainModify(0.5);
					}
				}
			},
			onSideResidualOrder: 1,
			onSideResidualSubOrder: undefined,
		},
	},
	reversal: {
		inherit: true,
		basePowerCallback(pokemon) {
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
			this.debug(`BP: ${bp}`);
			return bp;
		},
	},
	roar: {
		inherit: true,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
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
			inherit: true,
			onSideResidualOrder: 4,
			onSideResidualSubOrder: undefined,
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
		flags: {
			bypasssub: 1, allyanim: 1, failencore: 1, noassist: 1,
			failcopycat: 1, failinstruct: 1, failmimic: 1, nosketch: 1,
		},
		onHit(target, source) {
			if (source.transformed || !target.lastMove || target.volatiles['substitute']) {
				return false;
			}
			if (target.lastMove.flags['nosketch'] || source.moves.includes(target.lastMove.id)) {
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
	sleeptalk: {
		inherit: true,
		onTryHit(pokemon) {
			return !pokemon.volatiles['choicelock'] && !pokemon.volatiles['encore'];
		},
	},
	snatch: {
		inherit: true,
		flags: { bypasssub: 1, noassist: 1, failcopycat: 1 },
		condition: {
			inherit: true,
			onAnyPrepareHit(source, target, move) {
				const snatchUser = this.effectState.source;
				if (snatchUser.isSkyDropped()) return;
				if (!move || move.isZ || move.isMax || !move.flags['snatch']) {
					return;
				}
				snatchUser.removeVolatile('snatch');
				this.add('-activate', snatchUser, 'move: Snatch', `[of] ${source}`);
				if (this.actions.useMove(move.id, snatchUser)) {
					snatchUser.deductPP('snatch');
				}
				return null;
			},
		},
	},
	snore: {
		inherit: true,
		flags: { protect: 1, mirror: 1, sound: 1, metronome: 1 },
	},
	spikes: {
		inherit: true,
		flags: { metronome: 1, mustpressure: 1 },
		condition: {
			inherit: true,
			onSwitchIn() {},
			onEntryHazard(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
			},
		},
	},
	spite: {
		inherit: true,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
	stealthrock: {
		inherit: true,
		flags: { metronome: 1, mustpressure: 1 },
		condition: {
			inherit: true,
			onSwitchIn() {},
			onEntryHazard(pokemon) {
				if (pokemon.hasItem('heavydutyboots')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				this.damage(pokemon.maxhp * 2 ** typeMod / 8);
			},
		},
	},
	struggle: {
		inherit: true,
		flags: {
			contact: 1, protect: 1, failencore: 1, failmefirst: 1,
			noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1, nosketch: 1,
		},
		onModifyMove(move) {
			move.type = '???';
		},
	},
	substitute: {
		inherit: true,
		condition: {
			inherit: true,
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
				if (damage > target.volatiles['substitute'].hp) {
					damage = target.volatiles['substitute'].hp as number;
				}
				target.volatiles['substitute'].hp -= damage;
				source.lastDamage = damage;
				if (target.volatiles['substitute'].hp <= 0) {
					target.removeVolatile('substitute');
					target.addVolatile('substitutebroken');
					if (target.volatiles['substitutebroken']) target.volatiles['substitutebroken'].move = move.id;
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				if (move.ohko) this.add('-ohko');
				if (move.recoil && damage) {
					this.damage(this.actions.calcRecoilDamage(damage, move, source), source, target, 'recoil');
				}
				if (move.drain) {
					this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
				}
				this.runEvent('AfterSubDamage', target, source, move, damage);
				return this.HIT_SUBSTITUTE;
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
	swallow: {
		inherit: true,
		onTry(source) {
			return !!source.volatiles['stockpile'];
		},
	},
	switcheroo: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target.itemKnockedOff || source.itemKnockedOff) return false;
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
			inherit: true,
			duration: 3,
			durationCallback(target, source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Tailwind');
					return 5;
				}
				return 3;
			},
			onModifySpe(spe) {
				return spe * 2;
			},
			onSideResidualOrder: 5,
			onSideResidualSubOrder: undefined,
		},
	},
	taunt: {
		inherit: true,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		condition: {
			inherit: true,
			duration: undefined,
			durationCallback() {
				return this.random(3, 6);
			},
			onStart(target) {
				this.add('-start', target, 'move: Taunt');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 15,
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
	},
	torment: {
		inherit: true,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
	toxic: {
		inherit: true,
		accuracy: 85,
	},
	toxicspikes: {
		inherit: true,
		flags: { metronome: 1, mustpressure: 1 },
		condition: {
			inherit: true,
			onSwitchIn() {},
			onEntryHazard(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', `[of] ${pokemon}`);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (pokemon.volatiles['substitute'] || pokemon.hasType('Steel') || pokemon.hasAbility('magicguard')) {
					// do nothing
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
		flags: { bypasssub: 1, metronome: 1, failencore: 1 },
	},
	trick: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target.itemKnockedOff || source.itemKnockedOff) return false;
			if (target.hasAbility('multitype') || source.hasAbility('multitype')) return false;
		},
	},
	trickroom: {
		inherit: true,
		condition: {
			inherit: true,
			onFieldResidualOrder: 13,
			onFieldResidualSubOrder: undefined,
		},
	},
	uproar: {
		inherit: true,
		basePower: 50,
		condition: {
			inherit: true,
			duration: undefined,
			durationCallback() {
				return this.random(3, 7);
			},
			onResidualOrder: 10,
			onResidualSubOrder: 11,
		},
	},
	volttackle: {
		inherit: true,
		recoil: [1, 3],
	},
	watersport: {
		inherit: true,
		condition: {
			inherit: true,
			onAnyBasePowerPriority: 3,
			onAnyBasePower(basePower, user, target, move) {
				if (move.type === 'Fire') {
					this.debug('Water Sport weaken');
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
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
	wish: {
		inherit: true,
		flags: { heal: 1, metronome: 1 },
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
			this.debug(`BP for ${target.hp}/${target.maxhp} HP: ${bp}`);
			return bp;
		},
	},
	yawn: {
		inherit: true,
		condition: {
			inherit: true,
			onResidualOrder: 10,
			onResidualSubOrder: 19,
		},
	},
};
