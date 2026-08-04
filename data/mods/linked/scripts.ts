export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	init() {
		// Since twoturnmove isn't currently implemented using linked volatiles,
		// patch related moves so that 'twoturnmove' and e.g. 'skullbash' end simultaneously.
		const removeTwoTurnMove = function (target: Pokemon) {
			// Cannot use target.removeVolatile, since it would cause stack overflow.
			delete target.volatiles['twoturnmove'];
		};
		for (const id in this.data.Moves) {
			if (this.data.Moves[id].flags['charge'] && id !== 'skydrop') {
				this.modData("Moves", id).condition ||= {};
				if ('onEnd' in this.modData("Moves", id).condition) throw new Error(`onEnd needs manual override for move ${id}`);
				this.modData("Moves", id).condition.onEnd = removeTwoTurnMove;
			}
		}
	},
	getActionSpeed(action) {
		if (action.choice === 'move') {
			let move = action.move;
			if (action.zmove) {
				const zMoveName = this.actions.getZMove(action.move, action.pokemon, true);
				if (zMoveName) {
					const zMove = this.dex.getActiveMove(zMoveName);
					if (zMove.exists && zMove.isZ) {
						move = zMove;
					}
				}
			}
			if (action.maxMove) {
				const maxMoveName = this.actions.getMaxMove(action.maxMove, action.pokemon);
				if (maxMoveName) {
					const maxMove = this.actions.getActiveMaxMove(action.move, action.pokemon);
					if (maxMove.exists && maxMove.isMax) {
						move = maxMove;
					}
				}
			}
			// Linked mod
			const { linkIndex, linkedMoves } = action.pokemon.queryLinkMove(action.move);
			if (linkIndex >= 0 && action.pokemon.getCanLinkMove(action.move)) {
				const linkedActions = action.linked || linkedMoves;
				const originalMove = linkedActions[linkIndex];
				const altMove = linkedActions[1 - linkIndex];
				let thisPriority = this.dex.moves.get(originalMove.id).priority;
				thisPriority = this.singleEvent('ModifyPriority', originalMove, null, action.pokemon, null, null, thisPriority);
				thisPriority = this.runEvent('ModifyPriority', action.pokemon, null, originalMove, thisPriority);
				let thatPriority = this.dex.moves.get(altMove.id).priority;
				thatPriority = this.singleEvent('ModifyPriority', altMove, null, action.pokemon, null, null, thatPriority);
				thatPriority = this.runEvent('ModifyPriority', action.pokemon, null, altMove, thatPriority);
				const priority = Math.min(thisPriority, thatPriority);
				action.priority = priority + action.fractionalPriority;
				if (this.gen > 5) {
					// Gen 6+: Quick Guard blocks moves with artificially enhanced priority.
					// This also applies to Psychic Terrain.
					originalMove.priority = priority;
					altMove.priority = priority;
				}
			} else {
				// take priority from the base move, so abilities like Prankster only apply once
				// (instead of compounding every time `getActionSpeed` is called)
				let priority = this.dex.moves.get(move.id).priority;
				priority = this.singleEvent('ModifyPriority', move, null, action.pokemon, null, null, priority);
				priority = this.runEvent('ModifyPriority', action.pokemon, null, move, priority);
				action.priority = priority + action.fractionalPriority;
				// In Gen 6, Quick Guard blocks moves with artificially enhanced priority.
				if (this.gen > 5) action.move.priority = priority;
			}
		}

		if (!action.pokemon) {
			action.speed = 1;
		} else {
			action.speed = action.pokemon.getActionSpeed();
		}
	},
	runAction(action) {
		const pokemonOriginalHP = action.pokemon?.hp;
		let residualPokemon: (readonly [Pokemon, number])[] = [];
		// returns whether or not we ended in a callback
		switch (action.choice) {
		case 'start': {
			for (const side of this.sides) {
				if (side.pokemonLeft) side.pokemonLeft = side.pokemon.length;
				this.add('teamsize', side.id, side.pokemon.length);
			}

			this.add('start');

			for (const pokemon of this.getAllPokemon()) {
				this.singleEvent('BattleStart', this.dex.conditions.getByID(pokemon.species.id), pokemon.speciesState, pokemon);
			}

			this.format.onBattleStart?.call(this);
			for (const rule of this.ruleTable.keys()) {
				if ('+*-!'.includes(rule.charAt(0))) continue;
				const subFormat = this.dex.formats.get(rule);
				subFormat.onBattleStart?.call(this);
			}

			for (const side of this.sides) {
				for (let i = 0; i < side.active.length; i++) {
					if (!side.pokemonLeft) {
						// forfeited before starting
						side.active[i] = side.pokemon[i];
						side.active[i].fainted = true;
						side.active[i].hp = 0;
					} else {
						this.actions.switchIn(side.pokemon[i], i);
					}
				}
			}
			this.midTurn = true;
			break;
		}

		case 'move':
			if (!action.pokemon.isActive) return false;
			if (action.pokemon.fainted) return false;
			// Linked moves
			// @ts-expect-error modded
			if (action.linked) {
				// @ts-expect-error modded
				const linkedMoves: ActiveMove[] = action.linked;
				for (let i = linkedMoves.length - 1; i >= 0; i--) {
					// @ts-expect-error modded
					const targetLoc = this.resolveTargetLoc(action.targetLoc, action, linkedMoves[i]);
					const pseudoAction: Action = {
						choice: 'move', priority: action.priority, speed: action.speed, pokemon: action.pokemon,
						targetLoc, moveid: linkedMoves[i].id, move: linkedMoves[i], mega: action.mega,
						order: action.order, fractionalPriority: action.fractionalPriority,
						// @ts-expect-error modded
						originalTarget: action.linkedTargets[i],
						// @ts-expect-error modded
						sorted: i === 1,
					};
					this.queue.unshift(pseudoAction);
				}
				return;
			}
			this.actions.runMove(action.move, action.pokemon, action.targetLoc, {
				sourceEffect: action.sourceEffect, zMove: action.zmove,
				maxMove: action.maxMove, originalTarget: action.originalTarget,
			});
			break;
		case 'megaEvo':
			this.actions.runMegaEvo(action.pokemon);
			break;
		case 'megaEvoX':
			this.actions.runMegaEvoX?.(action.pokemon);
			break;
		case 'megaEvoY':
			this.actions.runMegaEvoY?.(action.pokemon);
			break;
		case 'runDynamax':
			action.pokemon.addVolatile('dynamax');
			action.pokemon.side.dynamaxUsed = true;
			if (action.pokemon.side.allySide) action.pokemon.side.allySide.dynamaxUsed = true;
			break;
		case 'terastallize':
			this.actions.terastallize(action.pokemon);
			break;
		case 'beforeTurnMove':
			if (!action.pokemon.isActive) return false;
			if (action.pokemon.fainted) return false;
			this.debug('before turn callback: ' + action.move.id);
			const target = this.getTarget(action.pokemon, action.move, action.targetLoc);
			if (!target) return false;
			if (!action.move.beforeTurnCallback) throw new Error(`beforeTurnMove has no beforeTurnCallback`);
			action.move.beforeTurnCallback.call(this, action.pokemon, target);
			break;
		case 'priorityChargeMove':
			if (!action.pokemon.isActive) return false;
			if (action.pokemon.fainted) return false;
			this.debug('priority charge callback: ' + action.move.id);
			if (!action.move.priorityChargeCallback) throw new Error(`priorityChargeMove has no priorityChargeCallback`);
			action.move.priorityChargeCallback.call(this, action.pokemon);
			break;

		case 'event':
			this.runEvent(action.event!, action.pokemon);
			break;
		case 'team':
			if (action.index === 0) {
				action.pokemon.side.pokemon = [];
			}
			action.pokemon.side.pokemon.push(action.pokemon);
			action.pokemon.position = action.index;
			// we return here because the update event would crash since there are no active pokemon yet
			return;

		case 'pass':
			return;
		case 'instaswitch':
		case 'switch':
			if (action.choice === 'switch' && action.pokemon.status) {
				this.singleEvent('CheckShow', this.dex.abilities.getByID('naturalcure' as ID), null, action.pokemon);
			}
			if (this.actions.switchIn(action.target, action.pokemon.position, action.sourceEffect) === 'pursuitfaint') {
				// a pokemon fainted from Pursuit before it could switch
				if (this.gen <= 4) {
					// in gen 2-4, the switch still happens
					this.hint("Previously chosen switches continue in Gen 2-4 after a Pursuit target faints.");
					action.priority = -101;
					this.queue.unshift(action);
					break;
				} else {
					// in gen 5+, the switch is cancelled
					this.hint("A Pokemon can't switch between when it runs out of HP and when it faints");
					break;
				}
			}
			break;
		case 'revivalblessing':
			action.pokemon.side.pokemonLeft++;
			if (action.target.position < action.pokemon.side.active.length) {
				this.queue.addChoice({
					choice: 'instaswitch',
					pokemon: action.target,
					target: action.target,
				});
			}
			action.target.fainted = false;
			action.target.faintQueued = false;
			action.target.subFainted = false;
			action.target.status = '';
			action.target.hp = 1; // Needed so hp functions works
			action.target.sethp(action.target.maxhp / 2);
			this.add('-heal', action.target, action.target.getHealth, '[from] move: Revival Blessing');
			action.pokemon.side.removeSlotCondition(action.pokemon, 'revivalblessing');
			break;
		case 'runSwitch':
			this.actions.runSwitch(action.pokemon);
			break;
		case 'shift':
			if (!action.pokemon.isActive) return false;
			if (action.pokemon.fainted) return false;
			this.swapPosition(action.pokemon, 1);
			break;

		case 'beforeTurn':
			this.eachEvent('BeforeTurn');
			break;
		case 'residual':
			this.add('');
			this.clearActiveMove(true);
			this.updateSpeed();
			residualPokemon = this.getAllActive().map(pokemon => [pokemon, pokemon.getUndynamaxedHP()] as const);
			this.fieldEvent('Residual');
			if (!this.ended) this.add('upkeep');
			break;
		}

		// phazing (Roar, etc)
		for (const side of this.sides) {
			for (const pokemon of side.active) {
				if (pokemon.forceSwitchFlag) {
					if (pokemon.hp) this.actions.dragIn(pokemon.side, pokemon.position);
					pokemon.forceSwitchFlag = false;
				}
			}
		}

		this.clearActiveMove();

		// fainting

		this.faintMessages();
		if (this.ended) return true;

		// switching (fainted pokemon, U-turn, Baton Pass, etc)

		if (!this.queue.peek() || (this.gen <= 3 && ['move', 'residual'].includes(this.queue.peek()!.choice))) {
			// in gen 3 or earlier, switching in fainted pokemon is done after
			// every move, rather than only at the end of the turn.
			this.checkFainted();
		} else if (['megaEvo', 'megaEvoX', 'megaEvoY'].includes(action.choice) && this.gen === 7) {
			this.eachEvent('Update');
			// In Gen 7, the action order is recalculated for a Pokémon that mega evolves.
			for (const [i, queuedAction] of this.queue.list.entries()) {
				if (queuedAction.pokemon === action.pokemon && queuedAction.choice === 'move') {
					this.queue.list.splice(i, 1);
					queuedAction.mega = 'done';
					this.queue.insertChoice(queuedAction, true);
					break;
				}
			}
			return false;
		} else if (this.queue.peek()?.choice === 'instaswitch') {
			return false;
		}

		if (this.gen >= 5 && action.choice !== 'start') {
			this.eachEvent('Update');
			for (const [pokemon, originalHP] of residualPokemon) {
				const maxhp = pokemon.getUndynamaxedHP(pokemon.maxhp);
				if (pokemon.hp && pokemon.getUndynamaxedHP() <= maxhp / 2 && originalHP > maxhp / 2) {
					this.runEvent('EmergencyExit', pokemon);
				}
			}
		}

		if (action.choice === 'runSwitch') {
			const pokemon = action.pokemon;
			if (pokemon.hp && pokemon.hp <= pokemon.maxhp / 2 && pokemonOriginalHP! > pokemon.maxhp / 2) {
				this.runEvent('EmergencyExit', pokemon);
			}
		}

		const switches = this.sides.map(
			side => side.active.some(pokemon => pokemon && !!pokemon.switchFlag)
		);

		for (let i = 0; i < this.sides.length; i++) {
			let reviveSwitch = false; // Used to ignore the fake switch for Revival Blessing
			if (switches[i] && !this.canSwitch(this.sides[i])) {
				for (const pokemon of this.sides[i].active) {
					if (this.sides[i].slotConditions[pokemon.position]['revivalblessing']) {
						reviveSwitch = true;
						continue;
					}
					pokemon.switchFlag = false;
				}
				if (!reviveSwitch) switches[i] = false;
			} else if (switches[i]) {
				for (const pokemon of this.sides[i].active) {
					if (
						pokemon.hp && pokemon.switchFlag && pokemon.switchFlag !== 'revivalblessing' &&
						!pokemon.skipBeforeSwitchOutEventFlag
					) {
						this.runEvent('BeforeSwitchOut', pokemon);
						pokemon.skipBeforeSwitchOutEventFlag = true;
						this.faintMessages(); // Pokemon may have fainted in BeforeSwitchOut
						if (this.ended) return true;
						if (pokemon.fainted) {
							switches[i] = this.sides[i].active.some(sidePokemon => sidePokemon && !!sidePokemon.switchFlag);
						}
					}
				}
			}
		}

		for (const playerSwitch of switches) {
			if (playerSwitch) {
				this.makeRequest('switch');
				return true;
			}
		}

		if (this.gen < 5) this.eachEvent('Update');

		const nextAction = this.queue.peek();
		if (this.gen >= 8 &&
			// @ts-expect-error modded
			(nextAction?.choice === 'move' || nextAction?.choice === 'runDynamax') && !nextAction?.sorted) {
			// In gen 8, speed is updated dynamically so update the queue's speed properties and sort it.
			this.updateSpeed();
			for (const queueAction of this.queue.list) {
				if (queueAction.pokemon) this.getActionSpeed(queueAction);
			}
			this.queue.sort();
		}

		return false;
	},
	resolveTargetLoc(targetLoc: number, action: Action, move: ActiveMove) {
		const isValidTarget = this.validTargetLoc(targetLoc, action.pokemon!, move.target);
		if (isValidTarget) return targetLoc;
		const randomTarget = this.getRandomTarget(action.pokemon!, move);
		if (!randomTarget) return targetLoc;
		return action.pokemon!.getLocOf(randomTarget);
	},
	actions: {
		runMove(moveOrMoveName, pokemon, targetLoc, options) {
			pokemon.activeMoveActions++;
			const zMove = options?.zMove;
			const maxMove = options?.maxMove;
			const externalMove = options?.externalMove;
			const originalTarget = options?.originalTarget;
			let sourceEffect = options?.sourceEffect;
			let target = this.battle.getTarget(pokemon, maxMove || zMove || moveOrMoveName, targetLoc, originalTarget);
			let baseMove = this.dex.getActiveMove(moveOrMoveName);
			const priority = baseMove.priority;
			const pranksterBoosted = baseMove.pranksterBoosted;
			if (baseMove.id !== 'struggle' && !zMove && !maxMove && !externalMove) {
				const changedMove = this.battle.runEvent('OverrideAction', pokemon, target, baseMove);
				if (changedMove && changedMove !== true) {
					baseMove = this.dex.getActiveMove(changedMove);
					baseMove.priority = priority;
					if (pranksterBoosted) baseMove.pranksterBoosted = pranksterBoosted;
					target = this.battle.getRandomTarget(pokemon, baseMove);
				}
			}
			let move = baseMove;
			if (zMove) {
				move = this.getActiveZMove(baseMove, pokemon);
			} else if (maxMove) {
				move = this.getActiveMaxMove(baseMove, pokemon);
			}

			move.isExternal = externalMove;

			this.battle.setActiveMove(move, pokemon, target);

			/* if (pokemon.moveThisTurn) {
				// THIS IS PURELY A SANITY CHECK
				// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
				// USE this.queue.cancelMove INSTEAD
				this.battle.debug(`${pokemon.id} INCONSISTENT STATE, ALREADY MOVED: ${pokemon.moveThisTurn}`);
				this.battle.clearActiveMove(true);
				return;
			} */
			const willTryMove = this.battle.runEvent('BeforeMove', pokemon, target, move);
			if (!willTryMove) {
				this.battle.runEvent('MoveAborted', pokemon, target, move);
				this.battle.clearActiveMove(true);
				// The event 'BeforeMove' could have returned false or null
				// false indicates that this counts as a move failing for the purpose of calculating Stomping Tantrum's base power
				// null indicates the opposite, as the Pokemon didn't have an option to choose anything
				pokemon.moveThisTurnResult = willTryMove;
				return;
			}

			// Used exclusively for a hint later
			if (move.flags['cantusetwice'] && pokemon.lastMove?.id === move.id) {
				pokemon.addVolatile(move.id);
			}

			if (move.beforeMoveCallback) {
				if (move.beforeMoveCallback.call(this.battle, pokemon, target, move)) {
					this.battle.clearActiveMove(true);
					pokemon.moveThisTurnResult = false;
					return;
				}
			}
			pokemon.lastDamage = 0;
			let lockedMove;
			if (!externalMove) {
				lockedMove = this.battle.runEvent('LockMove', pokemon);
				if (lockedMove === true) lockedMove = false;
				if (!lockedMove) {
					if (!pokemon.deductPP(baseMove, null, target) && (move.id !== 'struggle')) {
						this.battle.add('cant', pokemon, 'nopp', move);
						this.battle.clearActiveMove(true);
						pokemon.moveThisTurnResult = false;
						return;
					}
				} else {
					sourceEffect = this.dex.conditions.get('lockedmove');
				}
				pokemon.moveUsed(move, targetLoc);
			}

			// Dancer Petal Dance hack
			// TODO: implement properly
			const noLock = externalMove && !pokemon.volatiles['lockedmove'];

			if (zMove) {
				if (pokemon.illusion) {
					this.battle.singleEvent('End', this.dex.abilities.get('Illusion'), pokemon.abilityState, pokemon);
				}
				this.battle.add('-zpower', pokemon);
				pokemon.side.zMoveUsed = true;
			}

			const oldActiveMove = move;

			const moveDidSomething = this.useMove(baseMove, pokemon, { target, sourceEffect, zMove, maxMove });
			this.battle.lastSuccessfulMoveThisTurn = moveDidSomething ? this.battle.activeMove && this.battle.activeMove.id : null;
			if (this.battle.activeMove) move = this.battle.activeMove;
			this.battle.singleEvent('AfterMove', move, null, pokemon, target, move);
			this.battle.runEvent('AfterMove', pokemon, target, move);
			if (move.flags['cantusetwice'] && pokemon.removeVolatile(move.id)) {
				this.battle.add('-hint', `Some effects can force a Pokemon to use ${move.name} again in a row.`);
			}

			// TODO: Refactor to use BattleQueue#prioritizeAction in onAnyAfterMove handlers
			// Dancer's activation order is completely different from any other event, so it's handled separately
			if (move.flags['dance'] && moveDidSomething && !move.isExternal) {
				const dancers = [];
				for (const currentPoke of this.battle.getAllActive()) {
					if (pokemon === currentPoke) continue;
					if (currentPoke.hasAbility('dancer') && !currentPoke.isSemiInvulnerable()) {
						dancers.push(currentPoke);
					}
				}
				// Dancer activates in order of lowest speed stat to highest
				// Note that the speed stat used is after any volatile replacements like Speed Swap,
				// but before any multipliers like Agility or Choice Scarf
				// Ties go to whichever Pokemon has had the ability for the least amount of time
				dancers.sort(
					(a, b) => -(b.storedStats['spe'] - a.storedStats['spe']) || b.abilityState.effectOrder - a.abilityState.effectOrder
				);
				const targetOf1stDance = this.battle.activeTarget!;
				for (const dancer of dancers) {
					if (this.battle.faintMessages()) break;
					if (dancer.fainted) continue;
					this.battle.add('-activate', dancer, 'ability: Dancer');
					const dancersTarget = !targetOf1stDance.isAlly(dancer) && pokemon.isAlly(dancer) ?
						targetOf1stDance :
						pokemon;
					const dancersTargetLoc = dancer.getLocOf(dancersTarget);
					this.runMove(move.id, dancer, dancersTargetLoc, { sourceEffect: this.dex.abilities.get('dancer'), externalMove: true });
				}
			}
			if (noLock && pokemon.volatiles['lockedmove']) delete pokemon.volatiles['lockedmove'];
			this.battle.faintMessages();
			this.battle.checkWin();

			if (this.battle.gen <= 4) {
				// In gen 4, the outermost move is considered the last move for Copycat
				this.battle.activeMove = oldActiveMove;
			}
		},
	},
	queue: {
		resolveAction(action, midTurn = false) {
			if (!action) throw new Error(`Action not passed to resolveAction`);
			if (action.choice === 'pass') return [];
			const actions = [action];

			if (!action.side && action.pokemon) action.side = action.pokemon.side;
			if (!action.move && action.moveid) action.move = this.battle.dex.getActiveMove(action.moveid);
			if (!action.order) {
				const orders: { [choice: string]: number } = {
					team: 1,
					start: 2,
					instaswitch: 3,
					beforeTurn: 4,
					beforeTurnMove: 5,
					revivalblessing: 6,

					runSwitch: 101,
					switch: 103,
					megaEvo: 104,
					megaEvoX: 104,
					megaEvoY: 104,
					runDynamax: 105,
					terastallize: 106,
					priorityChargeMove: 107,

					shift: 200,
					// default is 200 (for moves)

					residual: 300,
				};
				if (action.choice in orders) {
					action.order = orders[action.choice];
				} else {
					action.order = 200;
					if (!['move', 'event'].includes(action.choice)) {
						throw new Error(`Unexpected orderless action ${action.choice}`);
					}
				}
			}
			if (!midTurn) {
				if (action.choice === 'move') {
					if (!action.maxMove && !action.zmove && action.move.beforeTurnCallback) {
						actions.unshift(...this.resolveAction({
							choice: 'beforeTurnMove', pokemon: action.pokemon, move: action.move, targetLoc: action.targetLoc,
						}));
					}
					if (action.mega && !action.pokemon.isSkyDropped()) {
						actions.unshift(...this.resolveAction({
							choice: 'megaEvo',
							pokemon: action.pokemon,
						}));
					}
					if (action.megax && !action.pokemon.isSkyDropped()) {
						actions.unshift(...this.resolveAction({
							choice: 'megaEvoX',
							pokemon: action.pokemon,
						}));
					}
					if (action.megay && !action.pokemon.isSkyDropped()) {
						actions.unshift(...this.resolveAction({
							choice: 'megaEvoY',
							pokemon: action.pokemon,
						}));
					}
					if (action.terastallize && !action.pokemon.terastallized) {
						actions.unshift(...this.resolveAction({
							choice: 'terastallize',
							pokemon: action.pokemon,
						}));
					}
					if (action.maxMove && !action.pokemon.volatiles['dynamax']) {
						actions.unshift(...this.resolveAction({
							choice: 'runDynamax',
							pokemon: action.pokemon,
						}));
					}
					if (!action.maxMove && !action.zmove && action.move.priorityChargeCallback) {
						actions.unshift(...this.resolveAction({
							choice: 'priorityChargeMove',
							pokemon: action.pokemon,
							move: action.move,
						}));
					}
					action.fractionalPriority = this.battle.runEvent('FractionalPriority', action.pokemon, null, action.move, 0);
					const linkedMoves: [ActiveMove, ActiveMove] = action.pokemon.getLinkedMoves();
					if (
						linkedMoves.length &&
						!action.pokemon.getWillLockMove!() &&
						!action.pokemon.getIsMoveLocked!() &&
						!action.zmove && !action.maxMove
					) {
						const decisionMove = this.battle.toID(action.move);
						if (linkedMoves.some(x => x.id === decisionMove)) {
							action.linked = linkedMoves;
							action.linkedTargets = [];
							for (const move of linkedMoves) {
								// @ts-expect-error modded
								const targetLoc = this.battle.resolveTargetLoc(action.targetLoc, action, move);
								action.linkedTargets.push(action.pokemon.getAtLoc(targetLoc));
							}
							const linkedOtherIndex = 1 - linkedMoves.findIndex(x => x.id === decisionMove);
							const linkedOtherMove = action.linked[linkedOtherIndex];
							if (linkedOtherMove.beforeTurnCallback) {
								this.addChoice({
									choice: 'beforeTurnMove',
									pokemon: action.pokemon,
									move: linkedOtherMove,
									targetLoc: action.linkedTargets[linkedOtherIndex],
								});
							}
							if (linkedOtherMove.priorityChargeCallback) {
								this.addChoice({
									choice: 'priorityChargeMove',
									pokemon: action.pokemon,
									move: linkedOtherMove,
									targetLoc: action.linkedTargets[linkedOtherIndex],
								});
							}
						}
					}
				} else if (['switch', 'instaswitch'].includes(action.choice)) {
					if (typeof action.pokemon.switchFlag === 'string') {
						action.sourceEffect = this.battle.dex.moves.get(action.pokemon.switchFlag as ID) as any;
					}
					action.pokemon.switchFlag = false;
				}
			}

			const deferPriority = this.battle.gen === 7 && action.mega && action.mega !== 'done';
			if (action.move) {
				let target = null;
				action.move = this.battle.dex.getActiveMove(action.move);

				if (!action.targetLoc) {
					target = this.battle.getRandomTarget(action.pokemon, action.move);
					// TODO: what actually happens here?
					if (target) action.targetLoc = action.pokemon.getLocOf(target);
				}
				action.originalTarget = action.pokemon.getAtLoc(action.targetLoc);
			}
			if (!deferPriority) this.battle.getActionSpeed(action);
			return actions as any;
		},
	},
	pokemon: {
		moveUsed(move, targetLoc) {
			this.lastMove = move;
			this.moveThisTurn = move.id;
			this.lastMoveTargetLoc = targetLoc;
		},
		getLinkedMoves(ignoreDisabled) {
			const linkedMoves = this.moveSlots.slice(0, 2);
			if (linkedMoves.length !== 2 || linkedMoves[0].pp <= 0 || linkedMoves[1].pp <= 0) return [];
			const ret: [ActiveMove, ActiveMove] = [
				this.battle.dex.getActiveMove(linkedMoves[0].id), this.battle.dex.getActiveMove(linkedMoves[1].id),
			];
			if (ignoreDisabled) return ret;
			if (!this.ateBerry && ret.some(x => x.id === 'belch')) return [];
			if (this.hasItem('assaultvest') && (ret[0].category === 'Status' || ret[1].category === 'Status')) {
				return [];
			}
			return ret;
		},
		hasLinkedMove(move) {
			// @ts-expect-error modded
			const linkedMoves: [ActiveMove, ActiveMove] = this.getLinkedMoves!(true);
			if (!linkedMoves.length) return false;
			return linkedMoves.some(x => x.id === move.id);
		},
		getIsMoveLocked() {
			// Detects active Outrage.
			return !!this.volatiles['choicelock'] || !!this.volatiles['lockedmove'];
		},
		getWillLockMove() {
			// Ignores Outrage, etc, since they can miss.
			return this.hasItem(['choiceband', 'choicescarf', 'choicespecs']) || this.hasAbility('gorillatactics');
		},
		getCanLinkMove(move) {
			// @ts-expect-error modded
			return !move.isZ && !move.isMax && !this.getWillLockMove() && !this.getIsMoveLocked();
		},
		queryLinkMove(move, ignoreDisabled) {
			// @ts-expect-error modded
			const linkedMoves: [ActiveMove, ActiveMove] = this.getLinkedMoves!(ignoreDisabled);
			if (!linkedMoves.length) return { linkIndex: -1, linkedMoves };
			return { linkIndex: linkedMoves.findIndex(x => x.id === move.id), linkedMoves };
		},
	},
};
