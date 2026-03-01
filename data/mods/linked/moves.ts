export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	pursuit: {
		inherit: true,
		beforeTurnCallback(pokemon) {
			// @ts-expect-error modded
			const linkedMoves: [string, string] = pokemon.getLinkedMoves();
			if (linkedMoves.length) {
				if (linkedMoves[0] !== 'pursuit' && linkedMoves[1] === 'pursuit') return;
			}

			for (const target of pokemon.foes()) {
				target.addVolatile('pursuit');
				const data = target.volatiles['pursuit'];
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
	},
	mefirst: {
		inherit: true,
		onTryHit(target, pokemon) {
			const action = this.queue.willMove(target);
			if (!action) return false;
			// Mod-specific: Me First copies the first move in the link
			// @ts-expect-error modded
			const move = this.dex.getActiveMove(action.linked?.[0] || action.move.id);
			if (action.zmove || move.isZ || move.isMax) return false;
			if (target.volatiles['mustrecharge']) return false;
			if (move.category === 'Status' || move.flags['failmefirst']) return false;

			pokemon.addVolatile('mefirst');
			this.actions.useMove(move, pokemon, { target });
			return null;
		},
	},

	// Modify Sucker Punch to check if both moves in a link are status
	suckerpunch: {
		inherit: true,
		onTry(source, target) {
			const action = this.queue.willMove(target);
			if (!action || action.choice !== 'move' ||
				// @ts-expect-error modded
				(!action.linked && action.move.category === 'Status' && action.move.id !== 'mefirst')) {
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return null;
			}
			if (target.volatiles.mustrecharge && target.volatiles.mustrecharge.duration! < 2) {
				// Duration may not be lower than 2 if Sucker Punch is used as a low-priority move
				// i.e. if Sucker Punch is linked with a negative priority move
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return null;
			}
			// @ts-expect-error modded
			if (action.linked) {
				// @ts-expect-error modded
				for (const linkedMove of action.linked) {
					if (linkedMove.category !== 'Status' || linkedMove.id === 'mefirst') return;
				}
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return null;
			}
		},
	},
	thunderclap: {
		inherit: true,
		onTry(source, target) {
			const action = this.queue.willMove(target);
			if (!action || action.choice !== 'move' ||
				// @ts-expect-error modded
				(!action.linked && action.move.category === 'Status' && action.move.id !== 'mefirst')) {
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return null;
			}
			if (target.volatiles.mustrecharge && target.volatiles.mustrecharge.duration! < 2) {
				// Duration may not be lower than 2 if Sucker Punch is used as a low-priority move
				// i.e. if Sucker Punch is linked with a negative priority move
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return null;
			}
			// @ts-expect-error modded
			if (action.linked) {
				// @ts-expect-error modded
				for (const linkedMove of action.linked) {
					if (linkedMove.category !== 'Status' || linkedMove.id === 'mefirst') return;
				}
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return null;
			}
		},
	},
	upperhand: {
		inherit: true,
		onTry(source, target) {
			const action = this.queue.willMove(target);
			if (!action || action.choice !== 'move' || action.move.priority < 0.1 ||
				// @ts-expect-error modded
				(!action.linked && action.move.category === 'Status' && action.move.id !== 'mefirst')) {
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return null;
			}
			if (target.volatiles.mustrecharge && target.volatiles.mustrecharge.duration! < 2) {
				// Duration may not be lower than 2 if Sucker Punch is used as a low-priority move
				// i.e. if Sucker Punch is linked with a negative priority move
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return null;
			}
			// @ts-expect-error modded
			if (action.linked) {
				// @ts-expect-error modded
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
			const move = target.m.lastMoveAbsolute;
			if (source.transformed || !move || source.moves.includes(move.id)) return false;
			if (move.flags['nosketch'] || move.isZ || move.isMax) return false;
			const sketchIndex = source.moves.indexOf('sketch');
			if (sketchIndex < 0) return false;
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
			const move = target.m.lastMoveAbsolute;
			if (source.transformed || !move || move.flags['failmimic'] || source.moves.includes(move.id)) {
				return false;
			}
			if (move.isZ || move.isMax) return false;
			const mimicIndex = source.moves.indexOf('mimic');
			if (mimicIndex < 0) return false;

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
			const lastMove = target.m.lastMoveAbsolute;
			if (!lastMove || target.volatiles['dynamax']) return false;
			const moveSlot = target.getMoveData(lastMove.id);
			if (
				lastMove.flags['failinstruct'] || lastMove.isZ || lastMove.isMax ||
				lastMove.flags['charge'] || lastMove.flags['recharge'] ||
				target.volatiles['beakblast'] || target.volatiles['focuspunch'] || target.volatiles['shelltrap'] ||
				(moveSlot && moveSlot.pp <= 0)
			) {
				return false;
			}
			this.add('-singleturn', target, 'move: Instruct', `[of] ${source}`);
			this.queue.prioritizeAction(this.queue.resolveAction({
				choice: 'move',
				pokemon: target,
				moveid: lastMove.id,
				targetLoc: target.lastMoveTargetLoc!,
			})[0] as MoveAction);
		},
	},
	mirrormove: {
		inherit: true,
		onTryHit(target, pokemon) {
			const move = target.m.lastMoveAbsolute;
			if (!move?.flags['mirror'] || move.isZ || move.isMax) {
				return false;
			}
			this.actions.useMove(move.id, pokemon, { target });
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
				// The target hasn't taken its turn, or Cursed Body activated and the move was not used through Dancer or Instruct
				if (
					this.queue.willMove(pokemon) ||
					(pokemon === this.activePokemon && this.activeMove && !this.activeMove.isExternal)
				) {
					this.effectState.duration!--;
				}
				const lastMove = pokemon.m.lastMoveAbsolute;
				if (!lastMove) {
					this.debug(`Pokemon hasn't moved yet`);
					return false;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === lastMove.id) {
						if (!moveSlot.pp) {
							this.debug('Move out of PP');
							return false;
						}
					}
				}
				if (effect.effectType === 'Ability') {
					this.add('-start', pokemon, 'Disable', lastMove.name, '[from] ability: ' + effect.name, `[of] ${source}`);
				} else {
					this.add('-start', pokemon, 'Disable', lastMove.name);
				}
				this.effectState.move = lastMove.id;
			},
			onResidualOrder: 14,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Disable');
			},
			onBeforeMovePriority: 7,
			onBeforeMove(attacker, defender, move) {
				if (!(move.isZ && move.isZOrMaxPowered) && move.id === this.effectState.move) {
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
				let move: Move | ActiveMove | null = target.m.lastMoveAbsolute;
				if (!move || target.volatiles['dynamax']) return false;
				// Encore only works on Max Moves if the base move is not itself a Max Move
				if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
				// @ts-expect-error modded
				const linkedMoves: [string, string] = target.getLinkedMoves(true);
				const moveSlot = target.getMoveData(move.id);
				if (linkedMoves.includes(move.id) && linkedMoves.every(m => !!this.dex.moves.get(m).flags['failencore'])) {
					// both moves cannot be encored
					delete target.volatiles['encore'];
					return false;
				}
				if (move.isZ || move.isMax || move.flags['failencore'] || !moveSlot || moveSlot.pp <= 0) {
					// it failed
					return false;
				}
				this.effectState.timesActivated = {};
				this.effectState.move = move.id;
				this.add('-start', target, 'Encore');
				if (linkedMoves.includes(move.id)) {
					this.effectState.move = linkedMoves;
				}
				if (!this.queue.willMove(target)) {
					this.effectState.duration!++;
				}
			},
			onOverrideAction(pokemon, target, move) {
				if (!this.effectState.timesActivated[this.turn]) {
					// Initialize Encore effect for this turn
					this.effectState.timesActivated[this.turn] = 0;
				} else if (this.effectState.timesActivated[this.turn] >= (Array.isArray(this.effectState.move) ?
					this.effectState.move.length : 1)) {
					// Finish Encore effect for this turn
					return;
				}
				this.effectState.timesActivated[this.turn]++;
				if (!Array.isArray(this.effectState.move)) {
					this.queue.cancelAction(pokemon);
					if (move.id !== this.effectState.move) return this.effectState.move;
				} else {
				// Locked into a link
					switch (this.effectState.timesActivated[this.turn]) {
					case 1: {
						if (this.effectState.move[0] !== move.id) return this.effectState.move[0];
						return;
					}
					case 2:
						if (this.effectState.move[1] !== move.id) return this.effectState.move[1];
						return;
					}
				}
			},
			onResidualOrder: 13,
			onResidual(target) {
				// early termination if you run out of PP
				const lastMove = target.m.lastMoveAbsolute;
				const moveSlot = target.getMoveData(lastMove);
				if (!moveSlot) {
					target.removeVolatile('encore');
					return; // no last move
				}

				// @ts-expect-error modded
				if (target.hasLinkedMove(lastMove.id)) {
					// TODO: Check instead whether the last executed move was linked
					if (target.moveSlots[0].pp <= 0 || target.moveSlots[1].pp <= 0) {
						target.removeVolatile('encore');
					}
				} else {
					if (moveSlot.pp <= 0) {
						target.removeVolatile('encore');
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
			onStart(pokemon, source, effect) {
				if (pokemon.volatiles['dynamax']) {
					delete pokemon.volatiles['torment'];
					return false;
				}
				if (effect?.id === 'gmaxmeltdown') this.effectState.duration = 3;
				this.add('-start', pokemon, 'Torment');
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Torment');
			},
			onDisableMove(pokemon) {
				const lastMove = pokemon.m.lastMoveAbsolute;
				if (!lastMove || lastMove.id === 'struggle') return;

				// @ts-expect-error
				if (pokemon.hasLinkedMove(lastMove.id)) {
				// @ts-expect-error
					for (const move of pokemon.getLinkedMoves()) {
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
				let move = source.m.lastMoveAbsolute;
				if (effect.effectType === 'Move' && !effect.flags['futuremove'] && move) {
					if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
					for (const moveSlot of source.moveSlots) {
						if (moveSlot.id === move.id) {
							moveSlot.pp = 0;
							this.add('-activate', source, 'move: Grudge', move.name);
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
			let move: Move | ActiveMove | null = target.m.lastMoveAbsolute;
			if (!move || move.isZ) return false;
			if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);

			const ppDeducted = target.deductPP(move.id, 4);
			if (!ppDeducted) return false;
			this.add("-activate", target, 'move: Spite', move.name, ppDeducted);
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
	destinybond: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				this.add('-singlemove', pokemon, 'Destiny Bond');
			},
			onFaint(target, source, effect) {
				if (!source || !effect || target.isAlly(source)) return;
				if (effect.effectType === 'Move' && !effect.flags['futuremove']) {
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
			duration: 1,
			onLockMove: 'iceball',
			onStart() {
				this.effectState.hitCount = 0;
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
			duration: 1,
			onLockMove: 'rollout',
			onStart() {
				this.effectState.hitCount = 0;
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
