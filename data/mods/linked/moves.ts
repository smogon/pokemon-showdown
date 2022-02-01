export const Moves: {[k: string]: ModdedMoveData} = {
	pursuit: {
		inherit: true,
		beforeTurnCallback(pokemon, target) {
			// @ts-ignore
			const linkedMoves: [string, string] = pokemon.getLinkedMoves();
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
			const action = this.queue.willMove(target);
			if (action) {
				const noMeFirst = [
					'chatter', 'counter', 'covet', 'focuspunch', 'mefirst', 'metalburst', 'mirrorcoat', 'struggle', 'thief',
				];
				// Mod-specific: Me First copies the first move in the link
				// @ts-ignore
				const move = this.dex.getActiveMove(action.linked?.[0] || action.move);
				if (move.category !== 'Status' && !noMeFirst.includes(move.id)) {
					pokemon.addVolatile('mefirst');
					this.actions.useMove(move, pokemon, target);
					return null;
				}
			}
			return false;
		},
	},

	// Modify Sucker Punch to check if both moves in a link are status
	suckerpunch: {
		inherit: true,
		onTry(source, target) {
			const action = this.queue.willMove(target);
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

	// Copy the last used move of a link
	sketch: {
		inherit: true,
		onHit(target, source) {
			const disallowedMoves = ['chatter', 'sketch', 'struggle'];
			const lastMove: Move = target.m.lastMoveAbsolute;
			if (source.transformed || !lastMove || disallowedMoves.includes(lastMove.id) ||
				source.moves.includes(lastMove.id) || lastMove.isZ) return false;
			const sketchIndex = source.moves.indexOf('sketch');
			if (sketchIndex < 0) return false;
			const move = this.dex.moves.get(lastMove);
			const sketchedMove = {
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
			const disallowedMoves = ['chatter', 'mimic', 'sketch', 'struggle', 'transform'];
			const lastMove: Move = target.m.lastMoveAbsolute;
			if (source.transformed || !lastMove || disallowedMoves.includes(lastMove.id) ||
				source.moves.includes(lastMove.id) || lastMove.isZ) return false;
			const mimicIndex = source.moves.indexOf('mimic');
			if (mimicIndex < 0) return false;
			const move = this.dex.moves.get(lastMove);
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

	// Copy/call last move of a link
	instruct: {
		inherit: true,
		onHit(target, source) {
			const lastMove: Move | ActiveMove | null = target.m.lastMoveAbsolute;
			if (!lastMove || target.volatiles['dynamax']) return false;
			const moveIndex = target.moves.indexOf(lastMove.id);
			const noInstruct = [
				'assist', 'beakblast', 'belch', 'bide', 'celebrate', 'copycat', 'dynamaxcannon', 'focuspunch', 'iceball', 'instruct', 'kingsshield', 'mefirst', 'metronome', 'mimic', 'mirrormove', 'naturepower', 'obstruct', 'outrage', 'petaldance', 'rollout', 'shelltrap', 'sketch', 'sleeptalk', 'struggle', 'thrash', 'transform', 'uproar',
			];
			if (
				noInstruct.includes(lastMove.id) || lastMove.isZ || lastMove.isMax ||
				lastMove.flags['charge'] || lastMove.flags['recharge'] ||
				target.volatiles['beakblast'] || target.volatiles['focuspunch'] || target.volatiles['shelltrap'] ||
				(target.moveSlots[moveIndex] && target.moveSlots[moveIndex].pp <= 0)
			) {
				return false;
			}
			this.add('-singleturn', target, 'move: Instruct', '[of] ' + source);
			this.actions.runMove(lastMove.id, target, target.lastMoveTargetLoc!);
		},
	},
	mirrormove: {
		inherit: true,
		onTryHit(target, pokemon) {
			const move: Move | ActiveMove | null = target.m.lastMoveAbsolute;
			if (!move || !move.flags['mirror'] || move.isZ || move.isMax) {
				return false;
			}
			this.actions.useMove(move.id, pokemon, target);
			return null;
		},
	},

	// Disabling effects
	disable: {
		inherit: true,
		condition: {
			duration: 5,
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon, source, effect) {
				const lastMove: Move | ActiveMove | null = pokemon.m.lastMoveAbsolute;
				if (
					this.queue.willMove(pokemon) ||
					(pokemon === this.activePokemon && this.activeMove && !this.activeMove.isExternal)
				) {
					this.effectState.duration--;
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
							this.effectState.move = lastMove.id;
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
				if (!move.isZ && move.id === this.effectState.move) {
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
	encore: {
		inherit: true,
		condition: {
			duration: 3,
			noCopy: true, // doesn't get copied by Z-Baton Pass
			onStart(target) {
				const noEncore = [
					'assist', 'copycat', 'encore', 'mefirst', 'metronome', 'mimic', 'mirrormove', 'naturepower', 'sketch', 'sleeptalk', 'struggle', 'transform',
				];
				let lastMove: Move | ActiveMove | null = target.m.lastMoveAbsolute;
				if (!lastMove || target.volatiles['dynamax']) return false;
				if ((lastMove as ActiveMove).isZOrMaxPowered) lastMove = this.dex.moves.get(lastMove.baseMove);
				// @ts-ignore
				const linkedMoves: [string, string] = target.getLinkedMoves(true);
				const moveIndex = target.moves.indexOf(lastMove.id);
				if (linkedMoves.includes(lastMove.id) && noEncore.includes(linkedMoves[0]) && noEncore.includes(linkedMoves[1])) {
					// both moves cannot be encored
					delete target.volatiles['encore'];
					return false;
				}
				if (lastMove.isZ || noEncore.includes(lastMove.id) ||
					(target.moveSlots[moveIndex] && target.moveSlots[moveIndex].pp <= 0)) {
					// it failed
					delete target.volatiles['encore'];
					return false;
				}
				this.effectState.turnsActivated = {};
				this.effectState.move = lastMove.id;
				this.add('-start', target, 'Encore');
				if (linkedMoves.includes(lastMove.id)) {
					this.effectState.move = linkedMoves;
				}
				if (!this.queue.willMove(target)) {
					this.effectState.duration++;
				}
			},
			onOverrideAction(pokemon, target, move) {
				if (!this.effectState.turnsActivated[this.turn]) {
					// Initialize Encore effect for this turn
					this.effectState.turnsActivated[this.turn] = 0;
				} else if (
					this.effectState.turnsActivated[this.turn] >= (Array.isArray(this.effectState.move) ?
						this.effectState.move.length : 1)) {
					// Finish Encore effect for this turn
					return;
				}
				this.effectState.turnsActivated[this.turn]++;
				if (!Array.isArray(this.effectState.move)) {
					this.queue.cancelAction(pokemon);
					if (move.id !== this.effectState.move) return this.effectState.move;
					return;
				}

				// Locked into a link
				switch (this.effectState.turnsActivated[this.turn]) {
				case 1: {
					if (this.effectState.move[0] !== move.id) return this.effectState.move[0];
					return;
				}
				case 2:
					if (this.effectState.move[1] !== move.id) return this.effectState.move[1];
					return;
				}
			},
			onResidualOrder: 13,
			onResidual(target) {
				// early termination if you run out of PP
				const lastMove = target.m.lastMoveAbsolute;
				const index = target.moves.indexOf(lastMove.id);
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
				if (Array.isArray(this.effectState.move)) {
					for (const moveSlot of pokemon.moveSlots) {
						if (moveSlot.id !== this.effectState.move[0] && moveSlot.id !== this.effectState.move[1]) {
							pokemon.disableMove(moveSlot.id);
						}
					}
				}
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
	torment: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(pokemon) {
				if (pokemon.volatiles['dynamax']) {
					delete pokemon.volatiles['torment'];
					return false;
				}
				this.add('-start', pokemon, 'Torment');
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Torment');
			},
			onDisableMove(pokemon) {
				const lastMove = pokemon.lastMove;
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

	// PP-decreasing moves
	grudge: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				this.add('-singlemove', pokemon, 'Grudge');
			},
			onFaint(target, source, effect) {
				if (!source || source.fainted || !effect) return;
				const lastMove: Move | ActiveMove | null = source.m.lastMoveAbsolute;
				if (effect.effectType === 'Move' && !effect.isFutureMove && lastMove) {
					for (const moveSlot of source.moveSlots) {
						if (moveSlot.id === lastMove.id) {
							moveSlot.pp = 0;
							this.add('-activate', source, 'move: Grudge', this.dex.moves.get(lastMove.id).name);
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
			const lastMove: Move | ActiveMove | null = target.m.lastMoveAbsolute;
			if (!lastMove || lastMove.isZ || lastMove.isMax) return false;
			const ppDeducted = target.deductPP(lastMove.id, 4);
			if (!ppDeducted) return false;
			this.add("-activate", target, 'move: Spite', lastMove.name, ppDeducted);
		},
	},

	// Other lastMove checks
	conversion2: {
		inherit: true,
		onHit(target, source) {
			const lastMove: Move | ActiveMove | null = target.m.lastMoveAbsolute;
			if (!lastMove) return false;
			const possibleTypes = [];
			const attackType = lastMove.type;
			for (const type in this.dex.data.TypeChart) {
				if (source.hasType(type)) continue;
				const typeCheck = this.dex.data.TypeChart[type].damageTaken[attackType];
				if (typeCheck === 2 || typeCheck === 3) {
					possibleTypes.push(type);
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
	destinybond: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				this.add('-singlemove', pokemon, 'Destiny Bond');
			},
			onFaint(target, source, effect) {
				if (!source || !effect || target.side === source.side) return;
				if (effect.effectType === 'Move' && !effect.isFutureMove) {
					if (source.volatiles['dynamax']) {
						this.add('-hint', "Dynamaxed Pokémon are immune to Destiny Bond.");
						return;
					}
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
		},
	},
	iceball: {
		inherit: true,
		condition: {
			duration: 2,
			onLockMove: 'iceball',
			onStart() {
				this.effectState.hitCount = 1;
			},
			onRestart() {
				this.effectState.hitCount++;
				if (this.effectState.hitCount < 5) {
					this.effectState.duration = 2;
				}
			},
			onResidual(target) {
				// This is just to ensure the volatile is deleted correctly
				const lastMove: Move | ActiveMove | null = target.m.lastMoveAbsolute;
				if (lastMove?.id === 'struggle') {
					delete target.volatiles['iceball'];
				}
			},
		},
	},
	rollout: {
		inherit: true,
		condition: {
			duration: 2,
			onLockMove: 'rollout',
			onStart() {
				this.effectState.hitCount = 1;
			},
			onRestart() {
				this.effectState.hitCount++;
				if (this.effectState.hitCount < 5) {
					this.effectState.duration = 2;
				}
			},
			onResidual(target) {
				// This is just to ensure the volatile is deleted correctly
				const lastMove: Move | ActiveMove | null = target.m.lastMoveAbsolute;
				if (lastMove?.id === 'struggle') {
					delete target.volatiles['rollout'];
				}
			},
		},
	},
};
