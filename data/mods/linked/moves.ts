export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	pursuit: {
		inherit: true,
		beforeTurnCallback(pokemon) {
			// @ts-expect-error modded
			const linkedMoves: [ActiveMove, ActiveMove] = pokemon.getLinkedMoves();
			if (linkedMoves.length) {
				if (linkedMoves[0].id !== 'pursuit' && linkedMoves[1].id === 'pursuit') return;
			}
			pokemon.addVolatile('pursuit', pokemon, this.dex.getActiveMove('pursuit'));
		},
	},
	mefirst: {
		inherit: true,
		onTryHit(defender, pokemon) {
			const action = this.queue.willMove(defender);
			if (!action) return false;
			// Mod-specific: Me First copies the first move in the link
			// @ts-expect-error modded
			const move = this.dex.getActiveMove(action.linked?.[0] || action.move.id);
			if (action.zmove || move.isZ || move.isMax) return false;
			if (defender.volatiles['mustrecharge']) return false;
			if (move.category === 'Status' || move.flags['failmefirst']) return false;

			pokemon.addVolatile('mefirst');
			this.actions.useMove(move, pokemon, { defender });
			return null;
		},
	},

	// Modify Sucker Punch to check if both moves in a link are status
	suckerpunch: {
		inherit: true,
		onTry(attacker, defender) {
			const action = this.queue.willMove(defender);
			if (action?.choice !== 'move') return false;
			// @ts-expect-error modded
			if (!action.linked) {
				const move = action.move;
				if (move.category === 'Status' && move.id !== 'mefirst') {
					return false;
				}
			} else {
				// @ts-expect-error modded
				if (action.linked.every(move => move.category === 'Status' && move.id !== 'mefirst')) {
					return false;
				}
			}
			if (defender.volatiles['mustrecharge'] && defender.volatiles['mustrecharge'].duration! < 2) {
				// Duration may not be lower than 2 if Sucker Punch is used as a low-priority move
				// i.e. if Sucker Punch is linked with a negative priority move
				return false;
			}
		},
	},
	thunderclap: {
		inherit: true,
		onTry(attacker, defender) {
			const action = this.queue.willMove(defender);
			if (action?.choice !== 'move') return false;
			// @ts-expect-error modded
			if (!action.linked) {
				const move = action.move;
				if (move.category === 'Status' && move.id !== 'mefirst') {
					return false;
				}
			} else {
				// @ts-expect-error modded
				if (action.linked.every(move => move.category === 'Status' && move.id !== 'mefirst')) {
					return false;
				}
			}
			if (defender.volatiles['mustrecharge'] && defender.volatiles['mustrecharge'].duration! < 2) {
				// Duration may not be lower than 2 if Sucker Punch is used as a low-priority move
				// i.e. if Sucker Punch is linked with a negative priority move
				return false;
			}
		},
	},
	upperhand: {
		inherit: true,
		onTry(attacker, defender) {
			const action = this.queue.willMove(defender);
			if (action?.choice !== 'move') return false;
			// @ts-expect-error modded
			if (!action.linked) {
				const move = action.move;
				if (move.priority < 0.1 || move.category === 'Status') {
					return false;
				}
			} else {
				// @ts-expect-error modded
				if (action.linked.every(move => move.priority < 0.1 || move.category === 'Status')) {
					return false;
				}
			}
			if (defender.volatiles['mustrecharge'] && defender.volatiles['mustrecharge'].duration! < 2) {
				// Duration may not be lower than 2 if Sucker Punch is used as a low-priority move
				// i.e. if Sucker Punch is linked with a negative priority move
				return false;
			}
		},
	},

	encore: {
		inherit: true,
		condition: {
			duration: 3,
			noCopy: true, // doesn't get copied by Z-Baton Pass
			onStart(defender) {
				let move: Move | ActiveMove | null = defender.lastMove;
				if (!move || defender.volatiles['dynamax']) return false;
				// Encore only works on Max Moves if the base move is not itself a Max Move
				if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
				// @ts-expect-error modded
				const linkedMoves: [ActiveMove, ActiveMove] = defender.getLinkedMoves(true);
				const moveSlot = defender.getMoveData(move.id);
				const isLinkedMove = linkedMoves.some(x => x.id === move.id);
				if (isLinkedMove && linkedMoves.every(m => !!m.flags['failencore'])) {
					// both moves cannot be encored
					delete defender.volatiles['encore'];
					return false;
				}
				if (move.isZ || move.isMax || move.flags['failencore'] || !moveSlot || moveSlot.pp <= 0) {
					// it failed
					return false;
				}
				this.effectState.timesActivated = {};
				this.effectState.move = move.id;
				this.add('-start', defender, 'Encore');
				if (isLinkedMove) {
					this.effectState.move = linkedMoves;
				}
				if (!this.queue.willMove(defender)) {
					this.effectState.duration!++;
				}
			},
			onOverrideAction(pokemon, defender, move) {
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
			onResidual(defender) {
				if (Array.isArray(this.effectState.move)) {
					if (this.effectState.move.map(move => defender.getMoveData(move)).some(moveSlot => !moveSlot || moveSlot.pp <= 0)) {
						defender.removeVolatile('encore');
					}
				} else {
					const moveSlot = defender.getMoveData(this.effectState.move);
					if (!moveSlot || moveSlot.pp <= 0) {
						defender.removeVolatile('encore');
					}
				}
			},
			onEnd(defender) {
				this.add('-end', defender, 'Encore');
			},
			onDisableMove(pokemon) {
				if (!this.effectState.move) return;
				if (Array.isArray(this.effectState.move)) {
					if (this.effectState.move.every(move => !pokemon.hasMove(move))) return;
					for (const moveSlot of pokemon.moveSlots) {
						if (!this.effectState.move.map(move => move.id).includes(moveSlot.id)) {
							pokemon.disableMove(moveSlot.id);
						}
					}
				} else {
					if (!pokemon.hasMove(this.effectState.move)) return;
					for (const moveSlot of pokemon.moveSlots) {
						if (moveSlot.id !== this.effectState.move) {
							pokemon.disableMove(moveSlot.id);
						}
					}
				}
			},
		},
	},
	torment: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(pokemon, attacker, effect) {
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
				const lastMove = pokemon.lastMove;
				if (!lastMove || lastMove.id === 'struggle') return;

				pokemon.disableMove(lastMove.id);
				// @ts-expect-error
				const { linkIndex, linkedMoves } = pokemon.queryLinkMove(lastMove);
				if (linkIndex >= 0) pokemon.disableMove(linkedMoves[1 - linkIndex].id);
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
			onFaint(defender, attacker, effect) {
				if (!attacker || attacker.fainted || !effect) return;
				let move = attacker.lastMove;
				if (effect.effectType === 'Move' && !effect.flags['futuremove'] && move) {
					if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove) as ActiveMove;
					for (const moveSlot of attacker.moveSlots) {
						if (moveSlot.id === move.id) {
							moveSlot.pp = 0;
							this.add('-activate', attacker, 'move: Grudge', move.name);
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

	// Other lastMove checks
	destinybond: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				this.add('-singlemove', pokemon, 'Destiny Bond');
			},
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
			onBeforeMovePriority: -1,
			onBeforeMove(pokemon, defender, move) {
				// Second stage of a Linked move does not remove Destiny Bond
				if (pokemon.moveThisTurn || move.id === 'destinybond') return;
				this.debug('removing Destiny Bond before attack');
				pokemon.removeVolatile('destinybond');
			},
			onMoveAborted(pokemon, defender, move) {
				pokemon.removeVolatile('destinybond');
			},
		},
	},
};
