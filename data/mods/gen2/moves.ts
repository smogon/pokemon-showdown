/**
 * Gen 2 moves
 */

export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	aeroblast: {
		inherit: true,
		critRatio: 3,
	},
	beatup: {
		inherit: true,
		onModifyMove(move, pokemon) {
			move.type = '???';
			move.category = 'Special';
			move.allies = pokemon.side.pokemon.filter(ally => !ally.fainted && !ally.status);
			move.multihit = move.allies.length;
		},
	},
	bellydrum: {
		inherit: true,
		onHit(defender) {
			if (defender.boosts.atk >= 6) {
				return false;
			}
			if (defender.hp <= defender.maxhp / 2) {
				this.boost({ atk: 2 }, null, null, this.dex.conditions.get('bellydrum2'));
				return false;
			}
			this.directDamage(defender.maxhp / 2);
			const originalStage = defender.boosts.atk;
			let currentStage = originalStage;
			let boosts = 0;
			let loopStage = 0;
			while (currentStage < 6) {
				loopStage = currentStage;
				currentStage++;
				if (currentStage < 6) currentStage++;
				defender.boosts.atk = loopStage;
				if (defender.getStat('atk', false, true) < 999) {
					defender.boosts.atk = currentStage;
					continue;
				}
				defender.boosts.atk = currentStage - 1;
				break;
			}
			boosts = defender.boosts.atk - originalStage;
			defender.boosts.atk = originalStage;
			this.boost({ atk: boosts });
		},
	},
	bide: {
		inherit: true,
		condition: {
			inherit: true,
			durationCallback(defender, attacker, effect) {
				return this.random(3, 5);
			},
			onLockMove: undefined, // no inherit
			onSemiLockMove: 'bide',
		},
	},
	conversion2: {
		inherit: true,
		onHit(defender, attacker) {
			if (!defender.lastMove) {
				return false;
			}
			const possibleTypes = [];
			const lastMove = defender.lastMove;
			const attackType = lastMove.id === 'struggle' ? 'Normal' : lastMove.type;
			for (const typeName of this.dex.types.names()) {
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
	counter: {
		inherit: true,
		damageCallback(pokemon, defender) {
			const lastAttackedBy = pokemon.getLastAttackedBy();
			if (!lastAttackedBy?.move || !lastAttackedBy.thisTurn) return false;
			const lastMove = lastAttackedBy.attacker.lastMove;
			if (lastAttackedBy.move !== lastMove?.id) return false;

			// Hidden Power counts as physical
			if (this.getCategory(lastAttackedBy.move) === 'Physical') {
				return 2 * lastAttackedBy.damage;
			}
			return false;
		},
		beforeTurnCallback: undefined, // no inherit
		onTry: undefined, // no inherit
		condition: {},
		priority: -1,
	},
	crabhammer: {
		inherit: true,
		critRatio: 3,
	},
	crosschop: {
		inherit: true,
		critRatio: 3,
	},
	curse: {
		inherit: true,
		condition: {
			inherit: true,
			onAfterMoveSelfPriority: 0, // explicit
			onAfterMoveSelf(pokemon) {
				this.damage(pokemon.baseMaxhp / 4);
			},
			onResidual: undefined, // no inherit
		},
	},
	destinybond: {
		inherit: true,
		condition: {
			inherit: true,
			onFaint(defender, attacker, effect) {
				if (!attacker || !effect || defender.isAlly(attacker)) return;
				if (effect.effectType === 'Move' && !effect.flags['futuremove']) {
					if (attacker.volatiles['dynamax']) {
						this.add('-hint', "Dynamaxed Pokémon are immune to Destiny Bond.");
						return;
					}
					this.add('-activate', defender, 'move: Destiny Bond');
					attacker.faint();
				}
			},
		},
	},
	detect: {
		inherit: true,
		priority: 2,
	},
	dig: {
		inherit: true,
		onPrepareHit(defender, attacker) {
			return attacker.status !== 'slp';
		},
		condition: {
			inherit: true,
			onInvulnerability(defender, attacker, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude' || move.id === 'fissure') {
					return;
				}
				if (['attract', 'curse', 'foresight', 'meanlook', 'mimic', 'nightmare', 'spiderweb', 'transform'].includes(move.id)) {
					// Oversight in the interaction between these moves and the Lock-On effect
					return false;
				}
				if (defender === attacker.volatiles['lockon']?.attacker) return;
				return false;
			},
			onSourceModifyDamage: undefined, // no inherit
			onSourceBasePower(basePower, defender, attacker, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					return this.chainModify(2);
				}
			},
		},
	},
	doubleedge: {
		inherit: true,
		recoil: [25, 100],
	},
	encore: {
		inherit: true,
		condition: {
			inherit: true,
			onStart(defender) {
				const lockedMove = defender.lastMoveEncore?.id || '';
				const moveSlot = lockedMove ? defender.getMoveData(lockedMove) : null;
				if (!moveSlot || defender.lastMoveEncore?.flags['failencore'] || moveSlot.pp <= 0) {
					// it failed
					return false;
				}
				this.effectState.move = lockedMove;
				this.add('-start', defender, 'Encore');
				if (this.effectState.move === 'pursuit') {
					defender.addVolatile('pursuit', defender, this.dex.getActiveMove('pursuit'));
				}
			},
			onResidualOrder: 13,
			onResidualSubOrder: undefined, // no inherit
		},
	},
	endure: {
		inherit: true,
		priority: 2,
	},
	explosion: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1, noparentalbond: 1, nosketch: 1 },
	},
	flail: {
		inherit: true,
		noDamageVariance: true,
		willCrit: false,
	},
	fly: {
		inherit: true,
		onPrepareHit(defender, attacker) {
			return attacker.status !== 'slp';
		},
		condition: {
			inherit: true,
			onInvulnerability(defender, attacker, move) {
				if (move.id === 'gust' || move.id === 'twister' || move.id === 'thunder' || move.id === 'whirlwind') {
					return;
				}
				if (move.id === 'earthquake' || move.id === 'magnitude' || move.id === 'fissure') {
					// These moves miss even during the Lock-On effect
					return false;
				}
				if (['attract', 'curse', 'foresight', 'meanlook', 'mimic', 'nightmare', 'spiderweb', 'transform'].includes(move.id)) {
					// Oversight in the interaction between these moves and the Lock-On effect
					return false;
				}
				if (defender === attacker.volatiles['lockon']?.attacker) return;
				return false;
			},
			onSourceModifyDamage: undefined, // no inherit
			onSourceBasePower(basePower, defender, attacker, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return this.chainModify(2);
				}
			},
		},
	},
	focusenergy: {
		inherit: true,
		condition: {
			inherit: true,
			onModifyCritRatio(critRatio) {
				return critRatio + 1;
			},
		},
	},
	foresight: {
		inherit: true,
		onTryHit(defender) {
			if (defender.volatiles['foresight']) return false;
		},
		condition: {
			inherit: true,
			noCopy: false,
		},
	},
	frustration: {
		inherit: true,
		basePowerCallback(pokemon) {
			return Math.floor(((255 - pokemon.happiness) * 10) / 25) || null;
		},
	},
	healbell: {
		inherit: true,
		onHit(defender, attacker) {
			this.add('-cureteam', attacker, '[from] move: Heal Bell');
			for (const pokemon of defender.side.pokemon) {
				pokemon.clearStatus();
			}
		},
	},
	highjumpkick: {
		inherit: true,
		onMoveFail(defender, attacker, move) {
			if (defender.runImmunity('Fighting')) {
				const damage = this.actions.getDamage(attacker, defender, move, true);
				if (typeof damage !== 'number') throw new Error("Couldn't get High Jump Kick recoil");
				this.damage(this.clampIntRange(damage / 8, 1), attacker, attacker, move);
			}
		},
	},
	jumpkick: {
		inherit: true,
		onMoveFail(defender, attacker, move) {
			if (defender.runImmunity('Fighting')) {
				const damage = this.actions.getDamage(attacker, defender, move, true);
				if (typeof damage !== 'number') throw new Error("Couldn't get Jump Kick recoil");
				this.damage(this.clampIntRange(damage / 8, 1), attacker, attacker, move);
			}
		},
	},
	karatechop: {
		inherit: true,
		critRatio: 3,
	},
	leechseed: {
		inherit: true,
		onHit: undefined, // no inherit
		condition: {
			inherit: true,
			onResidual: undefined, // no inherit
			onAfterMoveSelfPriority: 2,
			onAfterMoveSelf(pokemon) {
				if (!pokemon.hp) return;
				const leecher = this.getAtSlot(pokemon.volatiles['leechseed'].sourceSlot);
				if (!leecher || leecher.fainted || leecher.hp <= 0) {
					return;
				}
				const toLeech = this.clampIntRange(pokemon.maxhp / 8, 1);
				const damage = this.damage(toLeech, pokemon, leecher);
				if (damage) {
					this.heal(damage, leecher, pokemon);
				}
			},
		},
	},
	lightscreen: {
		inherit: true,
		condition: {
			duration: 5,
			// Sp. Def boost applied directly in stat calculation
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Light Screen');
			},
			onSideResidualOrder: 9,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Light Screen');
			},
		},
	},
	lockon: {
		inherit: true,
		onTryHit(defender) {
			if (defender.volatiles['foresight'] || defender.volatiles['lockon']) return false;
		},
		condition: {
			inherit: true,
			onSourceInvulnerability: undefined, // no inherit
		},
	},
	lowkick: {
		inherit: true,
		accuracy: 90,
		basePower: 50,
		basePowerCallback: undefined, // no inherit
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
	},
	meanlook: {
		inherit: true,
		flags: { reflectable: 1, mirror: 1, metronome: 1 },
	},
	metronome: {
		inherit: true,
		flags: { failencore: 1, nosketch: 1 },
	},
	mimic: {
		inherit: true,
		accuracy: 100,
		flags: { protect: 1, bypasssub: 1, allyanim: 1, failencore: 1, noassist: 1, nosketch: 1 },
	},
	mindreader: {
		inherit: true,
		onTryHit(defender) {
			if (defender.volatiles['foresight'] || defender.volatiles['lockon']) return false;
		},
	},
	mirrorcoat: {
		inherit: true,
		damageCallback(pokemon, defender) {
			const lastAttackedBy = pokemon.getLastAttackedBy();
			if (!lastAttackedBy?.move || !lastAttackedBy.thisTurn) return false;
			const lastMove = lastAttackedBy.attacker.lastMove;
			if (lastAttackedBy.move !== lastMove?.id) return false;

			// Hidden Power counts as physical
			if (this.getCategory(lastAttackedBy.move) === 'Special') {
				return 2 * lastAttackedBy.damage;
			}
			return false;
		},
		beforeTurnCallback: undefined, // no inherit
		onTry: undefined, // no inherit
		condition: {},
		priority: -1,
	},
	mirrormove: {
		inherit: true,
		flags: { metronome: 1, failencore: 1, nosketch: 1 },
		onHit(pokemon) {
			const noMirror = ['metronome', 'mimic', 'mirrormove', 'sketch', 'sleeptalk', 'transform'];
			const defender = pokemon.side.foe.active[0];
			const lastMove = defender.lastMove?.id;
			if (!lastMove || noMirror.includes(lastMove) || pokemon.moves.includes(lastMove)) {
				return false;
			}
			this.actions.useMove(lastMove, pokemon);
		},
	},
	mist: {
		inherit: true,
		volatileStatus: 'mist',
		sideCondition: undefined, // no inherit
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Mist');
			},
			onTryBoost(boost, defender, attacker, effect) {
				if (attacker && defender !== attacker) {
					let showMsg = false;
					let i: BoostID;
					for (i in boost) {
						if (boost[i]! < 0) {
							delete boost[i];
							showMsg = true;
						}
					}
					if (showMsg && !(effect as ActiveMove).secondaries) {
						this.add('-activate', defender, 'move: Mist');
					}
				}
			},
		},
		target: "self",
	},
	moonlight: {
		inherit: true,
		onHit(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				this.heal(pokemon.maxhp);
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
				this.heal(pokemon.maxhp);
			} else if (this.field.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.heal(pokemon.baseMaxhp / 4);
			} else {
				this.heal(pokemon.baseMaxhp / 2);
			}
		},
	},
	nightmare: {
		inherit: true,
		condition: {
			inherit: true,
			onResidual: undefined, // no inherit
			onAfterMoveSelfPriority: 1,
			onAfterMoveSelf(pokemon) {
				if (pokemon.status === 'slp') this.damage(pokemon.baseMaxhp / 4);
			},
		},
	},
	outrage: {
		inherit: true,
		onMoveFail(defender, attacker, move) {
			attacker.addVolatile('lockedmove');
		},
	},
	painsplit: {
		inherit: true,
		accuracy: 100,
	},
	perishsong: {
		inherit: true,
		condition: {
			inherit: true,
			onResidualOrder: 4,
		},
	},
	petaldance: {
		inherit: true,
		onMoveFail(defender, attacker, move) {
			attacker.addVolatile('lockedmove');
		},
	},
	poisongas: {
		inherit: true,
		ignoreImmunity: false,
	},
	poisonpowder: {
		inherit: true,
		ignoreImmunity: false,
	},
	protect: {
		inherit: true,
		priority: 2,
	},
	psywave: {
		inherit: true,
		damageCallback(pokemon) {
			return this.random(1, pokemon.level + Math.floor(pokemon.level / 2));
		},
	},
	pursuit: {
		inherit: true,
		onModifyMove: undefined, // no inherit
		condition: {
			inherit: true,
			onFoeBeforeSwitchOut(pokemon) {
				const attacker: Pokemon = this.effectState.attacker;
				this.debug('Pursuit start');
				if (
					this.effectState.targetLoc !== attacker.getLocOf(pokemon) ||
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
				if (attacker.speed < pokemon.speed || (attacker.speed === pokemon.speed && this.randomChance(1, 2))) {
					// Destiny Bond ends if the switch action "outspeeds" the attacker, regardless of host
					pokemon.removeVolatile('destinybond');
				}
				this.actions.runMove('pursuit', attacker, attacker.getLocOf(pokemon), { sourceEffect: this.effectState.sourceEffect });
			},
		},
	},
	razorleaf: {
		inherit: true,
		critRatio: 3,
	},
	razorwind: {
		inherit: true,
		accuracy: 75,
		critRatio: 3,
		onPrepareHit(defender, attacker) {
			return attacker.status !== 'slp';
		},
	},
	reflect: {
		inherit: true,
		condition: {
			duration: 5,
			// Defense boost applied directly in stat calculation
			onSideStart(side) {
				this.add('-sidestart', side, 'Reflect');
			},
			onSideResidualOrder: 9,
			onSideEnd(side) {
				this.add('-sideend', side, 'Reflect');
			},
		},
	},
	rest: {
		inherit: true,
		onTry(pokemon) {
			if (pokemon.hp < pokemon.maxhp) return;
			this.add('-fail', pokemon);
			return null;
		},
		onHit(defender, attacker, move) {
			if (defender.status !== 'slp') {
				if (!defender.setStatus('slp', attacker, move)) return;
			} else {
				this.add('-status', defender, 'slp', '[from] move: Rest');
			}
			defender.statusState.time = 3;
			defender.statusState.startTime = 3;
			defender.statusState.attacker = defender;
			this.heal(defender.maxhp);
		},
	},
	return: {
		inherit: true,
		basePowerCallback(pokemon) {
			return Math.floor((pokemon.happiness * 10) / 25) || null;
		},
	},
	reversal: {
		inherit: true,
		noDamageVariance: true,
		willCrit: false,
	},
	roar: {
		inherit: true,
		onTryHit() {
			for (const action of this.queue) {
				// Roar only works if it is the last action in a turn, including when it's called by Sleep Talk
				if (action.choice === 'move' || action.choice === 'switch') return false;
			}
		},
		priority: -1,
	},
	safeguard: {
		inherit: true,
		condition: {
			inherit: true,
			onSideResidualOrder: 8,
		},
	},
	selfdestruct: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1, noparentalbond: 1, nosketch: 1 },
	},
	sketch: {
		inherit: true,
		flags: { bypasssub: 1, failencore: 1, noassist: 1, nosketch: 1 },
		onHit() {
			// Sketch always fails in Link Battles
			this.add('-nothing');
		},
	},
	skullbash: {
		inherit: true,
		onPrepareHit(defender, attacker) {
			return attacker.status !== 'slp';
		},
	},
	skyattack: {
		inherit: true,
		critRatio: 1,
		onPrepareHit(defender, attacker) {
			return attacker.status !== 'slp';
		},
		secondary: undefined, // no inherit
	},
	slash: {
		inherit: true,
		critRatio: 3,
	},
	sleeptalk: {
		inherit: true,
		flags: { failencore: 1, nosleeptalk: 1, nosketch: 1 },
		onHit(pokemon) {
			const moves = [];
			for (const moveSlot of pokemon.moveSlots) {
				const moveid = moveSlot.id;
				const move = this.dex.moves.get(moveid);
				if (moveid && !move.flags['nosleeptalk'] && !move.flags['charge']) {
					moves.push(moveid);
				}
			}
			let randomMove = '';
			if (moves.length) randomMove = this.sample(moves);
			if (!randomMove) return false;
			this.actions.useMove(randomMove, pokemon);
		},
	},
	solarbeam: {
		inherit: true,
		onPrepareHit(defender, attacker) {
			return attacker.status !== 'slp';
		},
		// Rain weakening done directly in the damage formula
		onBasePower: undefined, // no inherit
	},
	spiderweb: {
		inherit: true,
		flags: { reflectable: 1, mirror: 1, metronome: 1 },
	},
	spikes: {
		inherit: true,
		condition: {
			inherit: true,
			onSideRestart: undefined, // no inherit
		},
	},
	substitute: {
		inherit: true,
		condition: {
			inherit: true,
			onTryPrimaryHit(defender, attacker, move) {
				if (move.stallingMove) {
					this.add('-fail', attacker);
					return null;
				}
				if (defender === attacker) {
					this.debug('sub bypass: self hit');
					return;
				}
				if (move.id === 'twineedle') {
					move.secondaries = move.secondaries!.filter(p => !p.kingsrock);
				}
				if (move.drain) {
					this.add('-miss', attacker);
					this.hint("In Gen 2, draining moves always miss against Substitute.");
					return null;
				}
				if (move.category === 'Status') {
					const SubBlocked = ['leechseed', 'lockon', 'mindreader', 'nightmare', 'painsplit', 'sketch'];
					if (move.id === 'swagger') {
						// this is safe, move is a copy
						delete move.volatileStatus;
					}
					if (
						move.status || (move.boosts && move.id !== 'swagger') ||
						move.volatileStatus === 'confusion' || SubBlocked.includes(move.id)
					) {
						this.add('-activate', defender, 'Substitute', '[block] ' + move.name);
						return null;
					}
					return;
				}
				let damage = this.actions.getDamage(attacker, defender, move);
				if (!damage) {
					return null;
				}
				if (damage > defender.volatiles['substitute'].hp) {
					damage = defender.volatiles['substitute'].hp as number;
				}
				defender.volatiles['substitute'].hp -= damage;
				attacker.lastDamage = damage;
				if (defender.volatiles['substitute'].hp <= 0) {
					defender.removeVolatile('substitute');
				} else {
					this.add('-activate', defender, 'Substitute', '[damage]');
				}
				if (move.recoil) {
					this.damage(1, attacker, defender, 'recoil');
				}
				this.runEvent('AfterSubDamage', defender, attacker, move, damage);
				return this.HIT_SUBSTITUTE;
			},
		},
	},
	swagger: {
		inherit: true,
		onTryHit(defender, pokemon) {
			if (defender.boosts.atk >= 6 || defender.getStat('atk', false, true) === 999) {
				this.add('-miss', pokemon);
				return null;
			}
		},
	},
	synthesis: {
		inherit: true,
		onHit(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				this.heal(pokemon.maxhp);
			} else if (this.field.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.heal(pokemon.baseMaxhp / 4);
			} else {
				this.heal(pokemon.baseMaxhp / 2);
			}
		},
	},
	thief: {
		inherit: true,
		onAfterHit: undefined, // no inherit
		secondary: {
			chance: 100,
			onHit(defender, attacker) {
				if (attacker.item || attacker.volatiles['gem']) {
					return;
				}
				const yourItem = defender.takeItem(attacker);
				if (!yourItem) {
					return;
				}
				if (!attacker.setItem(yourItem)) {
					defender.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
					return;
				}
				this.add('-item', attacker, yourItem, '[from] move: Thief', `[of] ${defender}`);
			},
		},
	},
	thrash: {
		inherit: true,
		onMoveFail(defender, attacker, move) {
			attacker.addVolatile('lockedmove');
		},
	},
	toxic: {
		inherit: true,
		ignoreImmunity: false,
	},
	transform: {
		inherit: true,
		flags: { bypasssub: 1, metronome: 1, failencore: 1, nosketch: 1 },
	},
	triattack: {
		inherit: true,
		onHit(defender, attacker, move) {
			move.statusRoll = this.sample(['par', 'frz', 'brn']);
		},
		secondary: {
			chance: 20,
			onHit(defender, attacker, move) {
				if (move.statusRoll) {
					defender.trySetStatus(move.statusRoll, attacker);
				}
			},
		},
	},
	triplekick: {
		inherit: true,
		multiaccuracy: false,
		multihit: [1, 3],
	},
	whirlwind: {
		inherit: true,
		onTryHit() {
			for (const action of this.queue) {
				// Whirlwind only works if it is the last action in a turn, including when it's called by Sleep Talk
				if (action.choice === 'move' || action.choice === 'switch') return false;
			}
		},
		priority: -1,
	},
};
