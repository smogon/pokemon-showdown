export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	gastroacid: {
		inherit: true,
		condition: {
			// Ability suppression implemented in Pokemon.ignoringAbility() within sim/pokemon.js
			onStart(pokemon) {
				if (pokemon.hasItem('Ability Shield')) return false;
				this.add('-endability', pokemon);
				this.singleEvent('End', pokemon.getAbility(), pokemon.abilityState, pokemon, pokemon, 'gastroacid');
				const keys = Object.keys(pokemon.volatiles).filter(x => x.startsWith("ability:"));
				if (keys.length) {
					for (const abil of keys) {
						pokemon.removeVolatile(abil);
					}
				}
			},
		},
	},
	grudge: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				this.add('-singlemove', pokemon, 'Grudge');
			},
			onFaint(defender, attacker, effect) {
				if (!attacker || attacker.fainted || !effect) return;
				if (effect.effectType === 'Move' && !effect.flags['futuremove'] && attacker.lastMove) {
					let move: Move = attacker.lastMove;
					if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);

					for (const moveSlot of attacker.moveSlots) {
						if (moveSlot.id === move.id) {
							moveSlot.pp = 0;
							if (!attacker.m.curMoves.includes(moveSlot.id) && attacker.m.trackPP.get(moveSlot.id)) {
								attacker.m.trackPP.set(moveSlot.id, moveSlot.maxpp - moveSlot.pp);
							}
							this.add('-activate', attacker, 'move: Grudge', move.name);
						}
					}
				}
			},
			onBeforeMovePriority: 100,
			onBeforeMove(pokemon) {
				this.debug('removing Grudge before attack');
				pokemon.removeVolatile('grudge');
			},
		},
	},
	lunardance: {
		inherit: true,
		condition: {
			onSwitchIn(defender) {
				this.singleEvent('Swap', this.effect, this.effectState, defender);
			},
			onSwap(defender) {
				if (
					!defender.fainted && (
						defender.hp < defender.maxhp ||
						defender.status ||
						defender.moveSlots.some(moveSlot => moveSlot.pp < moveSlot.maxpp)
					)
				) {
					defender.heal(defender.maxhp);
					defender.clearStatus();
					for (const moveSlot of defender.moveSlots) {
						moveSlot.pp = moveSlot.maxpp;
					}
					for (const key of defender.m.trackPP.keys()) {
						defender.m.trackPP.set(key, 0);
					}
					this.add('-heal', defender, defender.getHealth, '[from] move: Lunar Dance');
					defender.side.removeSlotCondition(defender, 'lunardance');
				}
			},
		},
	},
	mimic: {
		inherit: true,
		onHit(defender, attacker) {
			const move = defender.lastMove;
			if (attacker.transformed || !move || move.flags['failmimic'] || attacker.moves.includes(move.id)) {
				return false;
			}
			if (move.isZ || move.isMax) return false;
			const mimicIndex = attacker.moves.indexOf('mimic');
			if (mimicIndex < 0) return false;
			if (!attacker.m.curMoves.includes('mimic')) return false;

			const mimickedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				defender: move.defender,
				disabled: false,
				used: false,
				virtual: true,
			};
			attacker.moveSlots[mimicIndex] = mimickedMove;
			attacker.m.curMoves[mimicIndex] = mimickedMove.id;
			this.add('-start', attacker, 'Mimic', move.name);
		},
	},
	sketch: {
		inherit: true,
		onHit(defender, attacker) {
			const disallowedMoves = ['chatter', 'sketch', 'struggle'];
			const move = defender.lastMove;
			if (attacker.transformed || !move || attacker.moves.includes(move.id)) return false;
			if (disallowedMoves.includes(move.id) || move.isZ || move.isMax) return false;
			const sketchIndex = attacker.moves.indexOf('sketch');
			if (sketchIndex < 0) return false;
			if (!attacker.m.curMoves.includes('sketch')) return false;
			const sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				defender: move.defender,
				disabled: false,
				used: false,
			};
			attacker.moveSlots[sketchIndex] = sketchedMove;
			attacker.baseMoveSlots[sketchIndex] = sketchedMove;
			attacker.m.curMoves[sketchIndex] = sketchedMove.id;
			this.add('-activate', attacker, 'move: Sketch', move.name);
		},
	},
	skillswap: {
		inherit: true,
		onHit(defender, attacker, move) {
			const targetAbility = defender.getAbility();
			const sourceAbility = attacker.getAbility();
			const ally = attacker.side.active.find(mon => mon && mon !== attacker && !mon.fainted);
			const foeAlly = defender.side.active.find(mon => mon && mon !== defender && !mon.fainted);
			if (defender.isAlly(attacker)) {
				this.add('-activate', attacker, 'move: Skill Swap', '', '', `[of] ${defender}`);
			} else {
				this.add('-activate', attacker, 'move: Skill Swap', targetAbility, sourceAbility, `[of] ${defender}`);
			}
			this.singleEvent('End', sourceAbility, attacker.abilityState, attacker);
			if (ally?.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}

			this.singleEvent('End', targetAbility, defender.abilityState, defender);
			if (foeAlly?.m.innate) {
				foeAlly.removeVolatile(foeAlly.m.innate);
				delete foeAlly.m.innate;
			}

			attacker.ability = targetAbility.id;
			attacker.abilityState = this.initEffectState({ id: this.toID(attacker.ability), defender: attacker });
			if (attacker.m.innate?.endsWith(targetAbility.id)) {
				attacker.removeVolatile(attacker.m.innate);
				delete attacker.m.innate;
			}
			if (ally && ally.ability !== targetAbility.id) {
				if (!attacker.m.innate) {
					attacker.m.innate = 'ability:' + ally.getAbility().id;
					attacker.addVolatile(attacker.m.innate);
				}
				ally.m.innate = 'ability:' + targetAbility.id;
				ally.addVolatile(ally.m.innate);
			}

			defender.ability = sourceAbility.id;
			defender.abilityState = this.initEffectState({ id: this.toID(defender.ability), defender });
			if (defender.m.innate?.endsWith(sourceAbility.id)) {
				defender.removeVolatile(defender.m.innate);
				delete defender.m.innate;
			}
			if (foeAlly && foeAlly.ability !== sourceAbility.id) {
				if (!defender.m.innate) {
					defender.m.innate = 'ability:' + foeAlly.getAbility().id;
					defender.addVolatile(defender.m.innate);
				}
				foeAlly.m.innate = 'ability:' + sourceAbility.id;
				foeAlly.addVolatile(foeAlly.m.innate);
			}

			if (!defender.isAlly(attacker)) defender.volatileStaleness = 'external';
			this.singleEvent('Start', targetAbility, attacker.abilityState, attacker);
			this.singleEvent('Start', sourceAbility, defender.abilityState, defender);
		},
	},
};
