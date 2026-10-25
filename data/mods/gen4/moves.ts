export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	acupressure: {
		inherit: true,
		flags: { snatch: 1, metronome: 1 },
		onHit(defender) {
			if (defender.volatiles['substitute']) {
				return false;
			}
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in defender.boosts) {
				if (defender.boosts[stat] < 6) {
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
		onHit(defender, attacker) {
			this.add('-cureteam', attacker, '[from] move: Aromatherapy');
			const allies = [...defender.side.pokemon, ...defender.side.allySide?.pokemon || []];
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
		onHit(defender) {
			const moves = [];
			for (const pokemon of defender.side.pokemon) {
				if (pokemon === defender) continue;
				for (const moveSlot of pokemon.moveSlots) {
					const moveid = moveSlot.id;
					const move = this.dex.moves.get(moveid);
					if (
						move.flags['noassist'] ||
						(this.field.pseudoWeather['gravity'] && move.flags['gravity']) ||
						(defender.volatiles['healblock'] && move.flags['heal'])
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
			this.actions.useMove(randomMove, defender);
		},
	},
	beatup: {
		inherit: true,
		basePower: 10,
		basePowerCallback(pokemon, defender, move) {
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
				if (!this.ruleTable.has('beatupnicknamesmod')) {
					this.add('-activate', pokemon, 'move: Beat Up', '[of] ' + move.allies![0].name);
				}
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
			onBeforeMove(pokemon, defender, move) {
				if (this.effectState.duration === 1) {
					this.add('-end', pokemon, 'move: Bide');
					if (!this.effectState.totalDamage) {
						this.add('-fail', pokemon);
						return false;
					}
					defender = this.effectState.lastDamageSource;
					if (!defender) {
						this.add('-fail', pokemon);
						return false;
					}
					if (!defender.isActive) {
						const possibleTarget = this.getRandomTarget(pokemon, this.dex.moves.get('pound'));
						if (!possibleTarget) {
							this.add('-miss', pokemon);
							return false;
						}
						defender = possibleTarget;
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
					this.actions.tryMoveHit(defender, pokemon, moveData);
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
		onHit(defender) {
			if (defender.hasType('Normal') || !defender.setType('Normal')) return false;
			this.add('-start', defender, 'typechange', 'Normal');
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
		onHit(defender) {
			const possibleTypes = defender.moveSlots.map(moveSlot => {
				const move = this.dex.moves.get(moveSlot.id);
				if (move.id !== 'conversion' && move.id !== 'curse' && !defender.hasType(move.type)) {
					return move.type;
				}
				return '';
			}).filter(type => type);
			if (!possibleTypes.length) {
				return false;
			}
			const type = this.sample(possibleTypes);

			if (!defender.setType(type)) return false;
			this.add('-start', defender, 'typechange', type);
		},
	},
	conversion2: {
		inherit: true,
		onHit(defender, attacker) {
			if (!defender.lastMoveUsed) {
				return false;
			}
			const possibleTypes = [];
			const lastMoveUsed = defender.lastMoveUsed;
			const attackType = lastMoveUsed.id === 'struggle' ? 'Normal' : lastMoveUsed.type;
			for (const typeName of this.dex.types.names()) {
				if (attacker.hasType(typeName)) continue;
				const typeCheck = this.dex.types.get(typeName).damageTaken[attackType];
				if (typeCheck === 2 || typeCheck === 3) {
					possibleTypes.push(typeName);
				}
			}
			if (!possibleTypes.length) {
				return false;
			}
			const randomType = this.sample(possibleTypes);

			if (!attacker.setType(randomType)) return false;
			this.add('-start', attacker, 'typechange', randomType);
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
		basePowerCallback(pokemon, defender) {
			const bp = Math.floor(defender.hp * 120 / defender.maxhp) + 1;
			this.debug(`BP for ${defender.hp}/${defender.maxhp} HP: ${bp}`);
			return bp;
		},
	},
	curse: {
		inherit: true,
		flags: { metronome: 1 },
		onModifyMove(move, attacker, defender) {
			if (!attacker.hasType('Ghost')) {
				delete move.volatileStatus;
				delete move.onHit;
				move.self = { boosts: { atk: 1, def: 1, spe: -1 } };
				move.defender = 'self';
			} else if (defender?.volatiles['substitute']) {
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
			duration: undefined, // no inherit
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
		onTry(attacker, defender) {
			if (!defender.side.addSlotCondition(defender, 'futuremove')) return false;
			const moveData = {
				name: "Doom Desire",
				basePower: 120,
				category: "Special",
				flags: { metronome: 1, futuremove: 1 },
				willCrit: false,
				type: '???',
			} as unknown as ActiveMove;
			const damage = this.actions.getDamage(attacker, defender, moveData, true);
			Object.assign(defender.side.slotConditions[defender.position]['futuremove'], {
				duration: 3,
				move: 'doomdesire',
				attacker,
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
			this.add('-start', attacker, 'Doom Desire');
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
		onTryImmunity(defender) {
			return defender.status === 'slp' && !defender.volatiles['substitute'];
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
			duration: undefined, // no inherit
			durationCallback() {
				return this.random(4, 9);
			},
			onStart(defender, attacker) {
				const moveSlot = defender.lastMove ? defender.getMoveData(defender.lastMove.id) : null;
				if (defender.lastMove === null || defender.lastMove.flags['failencore'] || !moveSlot || moveSlot.pp <= 0) {
					// it failed
					return false;
				}
				this.effectState.move = defender.lastMove.id;
				this.add('-start', defender, 'Encore');
				if (this.effectState.move === 'pursuit') {
					defender.addVolatile('pursuit', defender, this.dex.getActiveMove('pursuit'));
				}
			},
			onResidualOrder: 10,
			onResidualSubOrder: 14,
		},
	},
	endeavor: {
		inherit: true,
		onTry(pokemon, defender) {
			if (pokemon.hp >= defender.hp) {
				this.add('-fail', pokemon);
				return null;
			}
		},
	},
	endure: {
		inherit: true,
		condition: {
			inherit: true,
			onDamage(damage, defender, attacker, effect) {
				if (effect?.effectType === 'Move' && !effect?.flags['futuremove'] && damage >= defender.hp) {
					this.add('-activate', defender, 'move: Endure');
					return defender.hp - 1;
				}
			},
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
		onTry(attacker, defender) {
			if (!defender.volatiles['protect']) {
				this.add('-fail', attacker);
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
		onPrepareHit(defender, attacker, move) {
			if (attacker.ignoringItem(true)) return false;
			const item = attacker.getItem();
			if (!this.singleEvent('TakeItem', item, attacker.itemState, attacker, attacker, move, item)) return false;
			if (!item.fling) return false;
			move.basePower = item.fling.basePower;
			this.debug(`BP: ${move.basePower}`);
			if (item.isBerry) {
				move.onHit = function (foe) {
					if (this.singleEvent('Eat', item, attacker.itemState, foe, attacker, move)) {
						this.runEvent('EatItem', foe, attacker, move, item);
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
			attacker.addVolatile('fling');
		},
	},
	focuspunch: {
		inherit: true,
		priorityChargeCallback: undefined, // no inherit
		beforeTurnCallback(pokemon) {
			pokemon.addVolatile('focuspunch');
		},
		beforeMoveCallback: undefined, // no inherit
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
		onTry(attacker, defender) {
			if (!defender.side.addSlotCondition(defender, 'futuremove')) return false;
			const moveData = {
				name: "Future Sight",
				basePower: 80,
				category: "Special",
				flags: { metronome: 1, futuremove: 1 },
				willCrit: false,
				type: '???',
			} as unknown as ActiveMove;
			const damage = this.actions.getDamage(attacker, defender, moveData, true);
			Object.assign(defender.side.slotConditions[defender.position]['futuremove'], {
				duration: 3,
				move: 'futuresight',
				attacker,
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
			this.add('-start', attacker, 'Future Sight');
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
			onFieldResidualSubOrder: undefined, // no inherit
		},
	},
	growth: {
		inherit: true,
		onModifyMove: undefined, // no inherit
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
		onHit(defender, attacker) {
			this.add('-activate', attacker, 'move: Heal Bell');
			const allies = [...defender.side.pokemon, ...defender.side.allySide?.pokemon || []];
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
			onTryHeal(damage, pokemon, attacker, effect) {
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
			onEntryHazardPriority: -1,
			onEntryHazard(defender) {
				if (defender.hp > 0) {
					defender.heal(defender.maxhp);
					defender.clearStatus();
					this.add('-heal', defender, defender.getHealth, '[from] move: Healing Wish');
					defender.side.removeSlotCondition(defender, 'healingwish');
					defender.lastMove = this.lastMove;
				} else {
					defender.switchFlag = true;
				}
			},
		},
	},
	highjumpkick: {
		inherit: true,
		basePower: 100,
		pp: 20,
		onMoveFail(defender, attacker, move) {
			move.causedCrashDamage = true;
			let damage = this.actions.getDamage(attacker, defender, move, true);
			if (!damage) damage = defender.maxhp;
			this.damage(this.clampIntRange(damage / 2, 1, Math.floor(defender.maxhp / 2)), attacker, attacker, move);
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
			for (const defender of pokemon.foes()) {
				for (const move of pokemon.moves) {
					if (defender.moves.includes(move)) return;
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
		onMoveFail(defender, attacker, move) {
			move.causedCrashDamage = true;
			let damage = this.actions.getDamage(attacker, defender, move, true);
			if (!damage) damage = defender.maxhp;
			this.damage(this.clampIntRange(damage / 2, 1, Math.floor(defender.maxhp / 2)), attacker, attacker, move);
		},
	},
	knockoff: {
		inherit: true,
		onAfterHit(defender, attacker, move) {
			if (!defender.item) return;
			const item = defender.getItem();
			if (this.runEvent('TakeItem', defender, attacker, move, item)) {
				defender.item = '';
				defender.itemKnockedOff = true;
				this.add('-enditem', defender, item.name, '[from] move: Knock Off', `[of] ${attacker}`);
				if (this.gen === 4) {
					this.hint("In Gen 4, Knock Off makes the Pokémon unable to obtain a new item.", true);
				}
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
			onAnyModifyDamage: undefined, // no inherit
			onAnyModifyDamagePhase1(damage, attacker, defender, move) {
				if (defender !== attacker && this.effectState.defender.hasAlly(defender) && this.getCategory(move) === 'Special') {
					if (!defender.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Light Screen weaken');
						if (defender.alliesAndSelf().length > 1) return this.chainModify(2, 3);
						return this.chainModify(0.5);
					}
				}
			},
			onSideResidualOrder: 2,
			onSideResidualSubOrder: undefined, // no inherit
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
			onSideResidualOrder: 6,
			onSideResidualSubOrder: undefined, // no inherit
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
			onStart(defender) {
				this.debug('Lunar Dance started on ' + defender.getSlot());
			},
			onEntryHazardPriority: -1,
			onEntryHazard(defender) {
				if (defender.getSlot() !== this.effectState.sourceSlot) {
					return;
				}
				if (defender.hp > 0) {
					defender.heal(defender.maxhp);
					defender.clearStatus();
					for (const moveSlot of defender.moveSlots) {
						moveSlot.pp = moveSlot.maxpp;
					}
					this.add('-heal', defender, defender.getHealth, '[from] move: Lunar Dance');
					defender.side.removeSlotCondition(defender, 'lunardance');
					defender.lastMove = this.lastMove;
				} else {
					defender.switchFlag = true;
				}
			},
		},
	},
	magiccoat: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(defender, attacker, move) {
				if (defender === attacker || move.hasBounced || !move.flags['reflectable']) {
					return;
				}
				defender.removeVolatile('magiccoat');
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				this.actions.useMove(newMove, defender, { defender: attacker });
				return null;
			},
			onAllyTryHitSide: undefined, // no inherit
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
			onStart(defender) {
				if (defender.volatiles['ingrain'] || defender.ability === 'levitate') return false;
				this.add('-start', defender, 'Magnet Rise');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 16,
		},
	},
	mefirst: {
		inherit: true,
		condition: {
			inherit: true,
			onBasePower: undefined, // no inherit
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
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable') &&
				move.flags['metronome'] &&
				(![2, 4].includes(this.gen) || !pokemon.moves.includes(move.id)) &&
				!(this.field.pseudoWeather['gravity'] && move.flags['gravity']) &&
				!(pokemon.volatiles['healblock'] && move.flags['heal'])
			));
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
			}
			if (!randomMove) return false;
			this.actions.useMove(randomMove, pokemon);
		},
	},
	mimic: {
		inherit: true,
		flags: {
			protect: 1, allyanim: 1, noassist: 1, failcopycat: 1, failencore: 1, failinstruct: 1, failmimic: 1,
		},
		onHit(defender, attacker) {
			if (attacker.transformed || !defender.lastMove || defender.volatiles['substitute']) {
				return false;
			}
			if (defender.lastMove.flags['failmimic'] || attacker.moves.includes(defender.lastMove.id)) {
				return false;
			}
			const mimicIndex = attacker.moves.indexOf('mimic');
			if (mimicIndex < 0) return false;
			const move = this.dex.moves.get(defender.lastMove.id);
			attacker.moveSlots[mimicIndex] = {
				move: move.name,
				id: move.id,
				pp: Math.min(5, move.pp),
				maxpp: this.calculatePP(move, attacker.ppUps[mimicIndex] || 0),
				disabled: false,
				used: false,
				virtual: true,
			};
			this.add('-activate', attacker, 'move: Mimic', move.name);
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
		onTryHit: undefined, // no inherit
		onHit(pokemon) {
			const lastAttackedBy = pokemon.getLastAttackedBy();
			if (!lastAttackedBy?.attacker.lastMove || !lastAttackedBy.move) {
				return false;
			}
			const noMirror = [
				'acupressure', 'aromatherapy', 'assist', 'chatter', 'copycat', 'counter', 'curse', 'doomdesire', 'feint', 'focuspunch', 'futuresight', 'gravity', 'hail', 'haze', 'healbell', 'helpinghand', 'lightscreen', 'luckychant', 'magiccoat', 'mefirst', 'metronome', 'mimic', 'mirrorcoat', 'mirrormove', 'mist', 'mudsport', 'naturepower', 'perishsong', 'psychup', 'raindance', 'reflect', 'roleplay', 'safeguard', 'sandstorm', 'sketch', 'sleeptalk', 'snatch', 'spikes', 'spitup', 'stealthrock', 'struggle', 'sunnyday', 'tailwind', 'toxicspikes', 'transform', 'watersport',
			];
			if (noMirror.includes(lastAttackedBy.move) || !lastAttackedBy.attacker.hasMove(lastAttackedBy.move)) {
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
			onSideResidualSubOrder: undefined, // no inherit
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
			noCopy: false,
			onAnyBasePowerPriority: 3,
			onAnyBasePower(basePower, user, defender, move) {
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
		basePowerCallback(pokemon, defender) {
			if (this.queue.willMove(defender)) {
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
			onTryHit(defender, attacker, move) {
				if (this.checkMoveBypassesProtect(move, attacker, defender)) return;
				this.add('-activate', defender, 'Protect');
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is NOT reset
					if (attacker.volatiles['lockedmove'].trueDuration >= 2) {
						attacker.volatiles['lockedmove'].duration = 2;
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
		condition: {
			inherit: true,
			onFoeBeforeSwitchOut(pokemon) {
				const attacker: Pokemon = this.effectState.attacker;
				this.debug('Pursuit start');
				if (
					['frz', 'slp'].includes(attacker.status) || (attacker.hasAbility('truant') && attacker.volatiles['truant']) ||
					!attacker.isAdjacent(pokemon) || !attacker.hp ||
					(attacker.volatiles['encore'] && attacker.volatiles['encore'].move !== 'pursuit') ||
					!this.queue.cancelMove(attacker)
				) {
					return;
				}
				if (!pokemon.pursuitActivated) {
					this.add('-activate', pokemon, 'move: Pursuit');
					pokemon.pursuitActivated = true;
				}
				// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
				// If it is, then Mega Evolve before moving.
				if (attacker.canMegaEvo || attacker.canUltraBurst) {
					for (const [actionIndex, action] of this.queue.entries()) {
						if (action.pokemon === attacker && action.choice === 'megaEvo') {
							this.actions.runMegaEvo(attacker);
							this.queue.list.splice(actionIndex, 1);
							break;
						}
					}
				}
				const move = this.dex.getActiveMove('pursuit');
				attacker.deductPP(move.id);
				attacker.moveUsed(move, pokemon.position);
				if (this.actions.useMove(move, attacker, { defender: pokemon, sourceEffect: this.effectState.sourceEffect }) &&
					attacker.getItem().isChoice) {
					attacker.addVolatile('choicelock');
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
			onAnyModifyDamage: undefined, // no inherit
			onAnyModifyDamagePhase1(damage, attacker, defender, move) {
				if (defender !== attacker && this.effectState.defender.hasAlly(defender) && this.getCategory(move) === 'Physical') {
					if (!defender.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Reflect weaken');
						if (defender.alliesAndSelf().length > 1) return this.chainModify(2, 3);
						return this.chainModify(0.5);
					}
				}
			},
			onSideResidualOrder: 1,
			onSideResidualSubOrder: undefined, // no inherit
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
	safeguard: {
		inherit: true,
		condition: {
			inherit: true,
			onSideResidualOrder: 4,
			onSideResidualSubOrder: undefined, // no inherit
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
		onHit(defender, attacker) {
			if (attacker.transformed || !defender.lastMove || defender.volatiles['substitute']) {
				return false;
			}
			if (defender.lastMove.flags['nosketch'] || attacker.moves.includes(defender.lastMove.id)) {
				return false;
			}
			const sketchIndex = attacker.moves.indexOf('sketch');
			if (sketchIndex < 0) return false;
			const move = this.dex.moves.get(defender.lastMove.id);
			const sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: this.calculatePP(move, attacker.ppUps[sketchIndex] || 0),
				disabled: false,
				used: false,
			};
			attacker.moveSlots[sketchIndex] = sketchedMove;
			attacker.baseMoveSlots[sketchIndex] = sketchedMove;
			this.add('-activate', attacker, 'move: Mimic', move.name);
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
			onAnyPrepareHit(attacker, defender, move) {
				const snatchUser = this.effectState.attacker;
				if (snatchUser.isSkyDropped()) return;
				if (!move || move.isZ || move.isMax || !move.flags['snatch']) {
					return;
				}
				snatchUser.removeVolatile('snatch');
				this.add('-activate', snatchUser, 'move: Snatch', `[of] ${attacker}`);

				// check Pressure
				const ppDrop = this.runEvent('DeductPP', attacker, snatchUser, this.effectState.sourceEffect);
				const extraPP = ppDrop !== true ? ppDrop : 0;
				if (extraPP > 0) {
					snatchUser.deductPP(this.effectState.sourceEffect.id, extraPP);
				}

				this.actions.useMove(move.id, snatchUser);
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
			onSwitchIn: undefined, // no inherit
			onEntryHazardPriority: 2,
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
			onSwitchIn: undefined, // no inherit
			onEntryHazardPriority: 1,
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
			onTryPrimaryHit(defender, attacker, move) {
				if (defender === attacker || move.flags['bypasssub']) {
					return;
				}
				let damage = this.actions.getDamage(attacker, defender, move);
				if (!damage && damage !== 0) {
					this.add('-fail', attacker);
					this.attrLastMove('[still]');
					return null;
				}
				if (damage > defender.volatiles['substitute'].hp) {
					damage = defender.volatiles['substitute'].hp as number;
				}
				defender.volatiles['substitute'].hp -= damage;
				attacker.lastDamage = damage;
				if (defender.volatiles['substitute'].hp <= 0) {
					defender.removeVolatile('substitute');
					defender.addVolatile('substitutebroken');
					if (defender.volatiles['substitutebroken']) defender.volatiles['substitutebroken'].move = move.id;
				} else {
					this.add('-activate', defender, 'Substitute', '[damage]');
				}
				if (move.ohko) this.add('-ohko');
				if (damage) {
					this.actions.applyRecoilDamage(damage, move, attacker);
				}
				if (move.drain) {
					this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), attacker, defender, 'drain');
				}
				this.runEvent('AfterSubDamage', defender, attacker, move, damage);
				return this.HIT_SUBSTITUTE;
			},
		},
	},
	suckerpunch: {
		inherit: true,
		onTry(attacker, defender) {
			const action = this.queue.willMove(defender);
			if (action?.choice !== 'move' || action.move.category === 'Status' || defender.volatiles['mustrecharge']) {
				this.add('-fail', attacker);
				return null;
			}
		},
	},
	swallow: {
		inherit: true,
		onTry(attacker) {
			return !!attacker.volatiles['stockpile'];
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
			durationCallback(defender, attacker, effect) {
				if (attacker?.hasAbility('persistent')) {
					this.add('-activate', attacker, 'ability: Persistent', '[move] Tailwind');
					return 5;
				}
				return 3;
			},
			onModifySpe(spe) {
				return spe * 2;
			},
			onSideResidualOrder: 5,
			onSideResidualSubOrder: undefined, // no inherit
		},
	},
	taunt: {
		inherit: true,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		condition: {
			inherit: true,
			duration: undefined, // no inherit
			durationCallback() {
				return this.random(3, 6);
			},
			onStart(defender) {
				this.add('-start', defender, 'move: Taunt');
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
			onSwitchIn: undefined, // no inherit
			onEntryHazardPriority: 3,
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
	trickroom: {
		inherit: true,
		condition: {
			inherit: true,
			onFieldResidualOrder: 13,
			onFieldResidualSubOrder: undefined, // no inherit
		},
	},
	uproar: {
		inherit: true,
		basePower: 50,
		condition: {
			inherit: true,
			duration: undefined, // no inherit
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
			noCopy: false,
			onAnyBasePowerPriority: 3,
			onAnyBasePower(basePower, user, defender, move) {
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
			onEnd(defender) {
				if (!defender.fainted) {
					const attacker = this.effectState.attacker;
					const damage = this.heal(defender.baseMaxhp / 2, defender, defender);
					if (damage) this.add('-heal', defender, defender.getHealth, '[from] move: Wish', '[wisher] ' + attacker.name);
				}
			},
		},
	},
	woodhammer: {
		inherit: true,
		recoil: [1, 3],
	},
	wrap: {
		inherit: true,
		accuracy: 85,
	},
	wringout: {
		inherit: true,
		basePowerCallback(pokemon, defender) {
			const bp = Math.floor(defender.hp * 120 / defender.maxhp) + 1;
			this.debug(`BP for ${defender.hp}/${defender.maxhp} HP: ${bp}`);
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
