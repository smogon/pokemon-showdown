'use strict';

/**@type {{[k: string]: ModdedMoveData}} */
exports.BattleMovedex = {
	/**
	 * Artificial priority
	 *
	 */
	pursuit: {
		inherit: true,
		beforeTurnCallback(pokemon, target) {
			// @ts-ignore
			let linkedMoves = pokemon.getLinkedMoves();
			if (linkedMoves.length) {
				if (linkedMoves[0] !== 'pursuit' && linkedMoves[1] === 'pursuit') return;
			}

			target.side.addSideCondition('pursuit', pokemon);
			if (!target.side.sideConditions['pursuit'].sources) {
				target.side.sideConditions['pursuit'].sources = [];
			}
			target.side.sideConditions['pursuit'].sources.push(pokemon);
		},
	},
	mefirst: {
		inherit: true,
		onTryHit(target, pokemon) {
			let action = this.willMove(target);
			if (action) {
				let noMeFirst = ['chatter', 'counter', 'covet', 'focuspunch', 'mefirst', 'metalburst', 'mirrorcoat', 'struggle', 'thief'];
				// Mod-specific: Me First copies the first move in the link
				// @ts-ignore
				let move = this.getActiveMove(action.linked ? action.linked[0] : action.move);
				if (move.category !== 'Status' && !noMeFirst.includes(move.id)) {
					pokemon.addVolatile('mefirst');
					this.useMove(move, pokemon, target);
					return null;
				}
			}
			return false;
		},
	},

	/**
	 *	Sucker Punch
	 *	Will miss on two linked Status moves
	 *
	 */

	suckerpunch: {
		inherit: true,
		onTry(source, target) {
			let action = this.willMove(target);
			if (!action || action.choice !== 'move') {
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return null;
			}
			if (target.volatiles.mustrecharge && target.volatiles.mustrecharge.duration < 2) {
				// Duration may not be lower than 2 if Sucker Punch is used as a low-priority move
				// i.e. if Sucker Punch is linked with a negative priority move
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return null;
			}
			// @ts-ignore
			if (!action.linked) {
				if (action.move.category === 'Status' && action.move.id !== 'mefirst') {
					this.attrLastMove('[still]');
					this.add('-fail', source);
					return null;
				}
			} else {
				// @ts-ignore
				for (const linkedMove of action.linked) {
					if (linkedMove.category !== 'Status' || linkedMove.id === 'mefirst') return;
				}
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return null;
			}
		},
	},

	/**
	 * Mimic and Sketch
	 * When any of them is linked, the link will get updated for the new move
	 * They will copy the last absolute single move used by the foe.
	 *
	 **/

	sketch: {
		inherit: true,
		onHit(target, source) {
			let disallowedMoves = ['chatter', 'sketch', 'struggle'];
			let lastMove = target.m.lastMoveAbsolute;
			if (source.transformed || !lastMove || disallowedMoves.includes(lastMove.id) || source.moves.indexOf(lastMove.id) >= 0 || lastMove.isZ) return false;
			let sketchIndex = source.moves.indexOf('sketch');
			if (sketchIndex < 0) return false;
			let move = this.getMove(lastMove);
			let sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
			};
			source.moveSlots[sketchIndex] = sketchedMove;
			source.baseMoveSlots[sketchIndex] = sketchedMove;
			this.add('-activate', source, 'move: Sketch', move.name);
		},
	},
	mimic: {
		inherit: true,
		onHit(target, source) {
			let disallowedMoves = ['chatter', 'mimic', 'sketch', 'struggle', 'transform'];
			let lastMove = target.m.lastMoveAbsolute;
			if (source.transformed || !lastMove || disallowedMoves.includes(lastMove.id) || source.moves.indexOf(lastMove.id) >= 0 || lastMove.isZ) return false;
			let mimicIndex = source.moves.indexOf('mimic');
			if (mimicIndex < 0) return false;
			let move = this.getMove(lastMove);
			source.moveSlots[mimicIndex] = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			this.add('-start', source, 'Mimic', move.name);
		},
	},

	/**
	 * Instruct and Mirror Move
	 * Copy/call the last absolute move used by the target
	 *
	 */

	instruct: {
		inherit: true,
		onHit(target, source) {
			let lastMove = target.m.lastMoveAbsolute;
			if (!lastMove) return false;
			let moveIndex = target.moves.indexOf(lastMove.id);
			let noInstruct = ['assist', 'beakblast', 'bide', 'copycat', 'focuspunch', 'iceball', 'instruct', 'mefirst', 'metronome', 'mimic', 'mirrormove', 'naturepower', 'outrage', 'petaldance', 'rollout', 'shelltrap', 'sketch', 'sleeptalk', 'thrash', 'transform'];
			if (noInstruct.includes(lastMove.id) || lastMove.isZ || lastMove.flags['charge'] || lastMove.flags['recharge'] || target.volatiles['beakblast'] || target.volatiles['focuspunch'] || target.volatiles['shelltrap'] || (target.moveSlots[moveIndex] && target.moveSlots[moveIndex].pp <= 0)) {
				return false;
			}
			this.add('-singleturn', target, 'move: Instruct', '[of] ' + source);
			// @ts-ignore
			this.runMove(lastMove.id, target, target.lastMoveTargetLoc);
		},
	},
	mirrormove: {
		inherit: true,
		onTryHit(target, pokemon) {
			let lastMove = target.m.lastMoveAbsolute;
			if (!lastMove || !lastMove.flags['mirror']) {
				return false;
			}
			this.useMove(lastMove.id, pokemon, target);
			return null;
		},
	},

	/**
	 * Disable, Encore, and Torment
	 * Disabling effects
	 *
	 */

	disable: {
		inherit: true,
		effect: {
			duration: 4,
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon, source, effect) {
				let lastMove = pokemon.m.lastMoveAbsolute;
				if (!this.willMove(pokemon)) {
					this.effectData.duration++;
				}
				if (!lastMove) {
					this.debug('pokemon hasn\'t moved yet');
					return false;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === lastMove.id) {
						if (!moveSlot.pp) {
							this.debug('Move out of PP');
							return false;
						} else {
							if (effect.id === 'cursedbody') {
								this.add('-start', pokemon, 'Disable', moveSlot.move, '[from] ability: Cursed Body', '[of] ' + source);
							} else {
								this.add('-start', pokemon, 'Disable', moveSlot.move);
							}
							this.effectData.move = lastMove.id;
							return;
						}
					}
				}
				return false;
			},
			onResidualOrder: 14,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Disable');
			},
			onBeforeMovePriority: 7,
			onBeforeMove(attacker, defender, move) {
				if (move.id === this.effectData.move) {
					this.add('cant', attacker, 'Disable', move);
					return false;
				}
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === this.effectData.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
	},
	encore: {
		inherit: true,
		effect: {
			duration: 3,
			noCopy: true, // doesn't get copied by Z-Baton Pass
			onStart(target) {
				let noEncore = ['assist', 'copycat', 'encore', 'mefirst', 'metronome', 'mimic', 'mirrormove', 'naturepower', 'sketch', 'sleeptalk', 'struggle', 'transform'];
				let lastMove = target.m.lastMoveAbsolute;
				// @ts-ignore
				let linkedMoves = target.getLinkedMoves(true);
				let moveIndex = lastMove ? target.moves.indexOf(lastMove.id) : -1;
				if (lastMove && linkedMoves.includes(lastMove.id) && noEncore.includes(linkedMoves[0]) && noEncore.includes(linkedMoves[1])) {
					// both moves cannot be encored
					delete target.volatiles['encore'];
					return false;
				}
				if (!lastMove || lastMove.isZ || noEncore.includes(lastMove.id) || (target.moveSlots[moveIndex] && target.moveSlots[moveIndex].pp <= 0)) {
					// it failed
					delete target.volatiles['encore'];
					return false;
				}
				this.effectData.turnsActivated = {};
				this.effectData.move = lastMove.id;
				this.add('-start', target, 'Encore');
				if (linkedMoves.includes(lastMove.id)) {
					this.effectData.move = linkedMoves;
				}
				if (!this.willMove(target)) {
					this.effectData.duration++;
				}
			},
			onOverrideAction(pokemon, target, move) {
				if (!this.effectData.turnsActivated[this.turn]) {
					// Initialize Encore effect for this turn
					this.effectData.turnsActivated[this.turn] = 0;
				} else if (this.effectData.turnsActivated[this.turn] >= (Array.isArray(this.effectData.move) ? this.effectData.move.length : 1)) {
					// Finish Encore effect for this turn
					return;
				}
				this.effectData.turnsActivated[this.turn]++;
				if (!Array.isArray(this.effectData.move)) {
					let nextAction = this.willMove(pokemon);
					if (nextAction) this.queue.splice(this.queue.indexOf(nextAction), 1);
					if (move.id !== this.effectData.move) return this.effectData.move;
					return;
				}

				// Locked into a link
				switch (this.effectData.turnsActivated[this.turn]) {
				case 1: {
					if (this.effectData.move[0] !== move.id) return this.effectData.move[0];
					return;
				}
				case 2:
					if (this.effectData.move[1] !== move.id) return this.effectData.move[1];
					return;
				}
			},
			onResidualOrder: 13,
			onResidual(target) {
				// early termination if you run out of PP
				let lastMove = target.m.lastMoveAbsolute;
				let index = target.moves.indexOf(lastMove.id);
				if (index === -1) return; // no last move

				// @ts-ignore
				if (target.hasLinkedMove(lastMove.id)) {
					// TODO: Check instead whether the last executed move was linked
					if (target.moveSlots[0].pp <= 0 || target.moveSlots[1].pp <= 0) {
						delete target.volatiles.encore;
						this.add('-end', target, 'Encore');
					}
				} else {
					if (target.moveSlots[index].pp <= 0) {
						delete target.volatiles.encore;
						this.add('-end', target, 'Encore');
					}
				}
			},
			onEnd(target) {
				this.add('-end', target, 'Encore');
			},
			onDisableMove(pokemon) {
				if (Array.isArray(this.effectData.move)) {
					for (const moveSlot of pokemon.moveSlots) {
						if (moveSlot.id !== this.effectData.move[0] && moveSlot.id !== this.effectData.move[1]) {
							pokemon.disableMove(moveSlot.id);
						}
					}
				}
				if (!this.effectData.move || !pokemon.hasMove(this.effectData.move)) {
					return;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id !== this.effectData.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
	},
	torment: {
		inherit: true,
		effect: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Torment');
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Torment');
			},
			onDisableMove(pokemon) {
				let lastMove = pokemon.lastMove;
				if (!lastMove || lastMove.id === 'struggle') return;

				if (Array.isArray(lastMove)) {
					for (const move of lastMove) {
						pokemon.disableMove(move.id);
					}
				} else {
					pokemon.disableMove(lastMove.id);
				}
			},
		},
	},

	/**
	 * Spite and Grudge
	 * Decrease the PP of the last absolute move used by the target
	 * Also, Grudge's effect won't be removed by its linked move, if any
	 *
	 */

	grudge: {
		inherit: true,
		effect: {
			onStart(pokemon) {
				this.add('-singlemove', pokemon, 'Grudge');
			},
			onFaint(target, source, effect) {
				if (!source || source.fainted || !effect) return;
				let lastMove = source.m.lastMoveAbsolute;
				if (effect.effectType === 'Move' && !effect.isFutureMove && lastMove) {
					for (const moveSlot of source.moveSlots) {
						if (moveSlot.id === lastMove.id) {
							moveSlot.pp = 0;
							this.add('-activate', source, 'move: Grudge', this.getMove(lastMove.id).name);
						}
					}
				}
			},
			onBeforeMovePriority: 100,
			onBeforeMove(pokemon) {
				if (pokemon.moveThisTurn) return; // Second stage of a Linked move
				this.debug('removing Grudge before attack');
				pokemon.removeVolatile('grudge');
			},
		},
	},
	spite: {
		inherit: true,
		onHit(target) {
			let lastMove = target.m.lastMoveAbsolute;
			if (lastMove && target.deductPP(lastMove.id, 4)) {
				this.add("-activate", target, 'move: Spite', this.getMove(lastMove.id).name, 4);
				return;
			}
			return false;
		},
	},

	/**
	 * Other moves that check `pokemon.lastMove`
	 * (may behave counter-intuitively if left unmodded)
	 *
	 **/

	conversion2: {
		inherit: true,
		onHit(target, source) {
			let lastMove = target.m.lastMoveAbsolute;
			if (!lastMove) return false;
			let possibleTypes = [];
			let attackType = lastMove.type;
			for (let type in this.data.TypeChart) {
				if (source.hasType(type) || target.hasType(type)) continue;
				let typeCheck = this.data.TypeChart[type].damageTaken[attackType];
				if (typeCheck === 2 || typeCheck === 3) {
					possibleTypes.push(type);
				}
			}
			if (!possibleTypes.length) {
				return false;
			}
			let randomType = this.sample(possibleTypes);

			if (!source.setType(randomType)) return false;
			this.add('-start', source, 'typechange', randomType);
		},
	},
	destinybond: {
		inherit: true,
		effect: {
			onStart(pokemon) {
				this.add('-singlemove', pokemon, 'Destiny Bond');
			},
			onFaint(target, source, effect) {
				if (!source || !effect || target.side === source.side) return;
				if (effect.effectType === 'Move' && !effect.isFutureMove) {
					this.add('-activate', target, 'move: Destiny Bond');
					source.faint();
				}
			},
			onBeforeMovePriority: -1,
			onBeforeMove(pokemon, target, move) {
				// Second stage of a Linked move does not remove Destiny Bond
				if (pokemon.moveThisTurn || move.id === 'destinybond') return;
				this.debug('removing Destiny Bond before attack');
				pokemon.removeVolatile('destinybond');
			},
			onMoveAborted(pokemon, target, move) {
				pokemon.removeVolatile('destinybond');
			},
			onBeforeSwitchOutPriority: 1,
			onBeforeSwitchOut(pokemon) {
				pokemon.removeVolatile('destinybond');
			},
		},
	},
	iceball: {
		inherit: true,
		effect: {
			duration: 2,
			onLockMove: 'iceball',
			onStart() {
				this.effectData.hitCount = 1;
			},
			onRestart() {
				this.effectData.hitCount++;
				if (this.effectData.hitCount < 5) {
					this.effectData.duration = 2;
				}
			},
			onResidual(target) {
				// This is just to ensure the volatile is deleted correctly
				let lastMove = target.m.lastMoveAbsolute;
				if (lastMove && lastMove.id === 'struggle') {
					delete target.volatiles['iceball'];
				}
			},
		},
	},
	rollout: {
		inherit: true,
		effect: {
			duration: 2,
			onLockMove: 'rollout',
			onStart() {
				this.effectData.hitCount = 1;
			},
			onRestart() {
				this.effectData.hitCount++;
				if (this.effectData.hitCount < 5) {
					this.effectData.duration = 2;
				}
			},
			onResidual(target) {
				// This is just to ensure the volatile is deleted correctly
				let lastMove = target.m.lastMoveAbsolute;
				if (lastMove && lastMove.id === 'struggle') {
					delete target.volatiles['rollout'];
				}
			},
		},
	},
};
