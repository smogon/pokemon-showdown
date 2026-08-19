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
			onFaint(target, source, effect) {
				if (!source || source.fainted || !effect) return;
				if (effect.effectType === 'Move' && !effect.flags['futuremove'] && source.lastMove) {
					let move: Move = source.lastMove;
					if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);

					for (const moveSlot of source.moveSlots) {
						if (moveSlot.id === move.id) {
							moveSlot.pp = 0;
							if (!source.m.curMoves.includes(moveSlot.id) && source.m.trackPP.get(moveSlot.id)) {
								source.m.trackPP.set(moveSlot.id, moveSlot.maxpp - moveSlot.pp);
							}
							this.add('-activate', source, 'move: Grudge', move.name);
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
			onSwitchIn(target) {
				this.singleEvent('Swap', this.effect, this.effectState, target);
			},
			onSwap(target) {
				if (
					!target.fainted && (
						target.hp < target.maxhp ||
						target.status ||
						target.moveSlots.some(moveSlot => moveSlot.pp < moveSlot.maxpp)
					)
				) {
					target.heal(target.maxhp);
					target.clearStatus();
					for (const moveSlot of target.moveSlots) {
						moveSlot.pp = moveSlot.maxpp;
					}
					for (const key of target.m.trackPP.keys()) {
						target.m.trackPP.set(key, 0);
					}
					this.add('-heal', target, target.getHealth, '[from] move: Lunar Dance');
					target.side.removeSlotCondition(target, 'lunardance');
				}
			},
		},
	},
	mimic: {
		inherit: true,
		onHit(target, source) {
			const move = target.lastMove;
			if (source.transformed || !move || move.flags['failmimic'] || source.moves.includes(move.id)) {
				return false;
			}
			if (move.isZ || move.isMax) return false;
			const mimicIndex = source.moves.indexOf('mimic');
			if (mimicIndex < 0) return false;
			if (!source.m.curMoves.includes('mimic')) return false;

			const mimickedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			source.moveSlots[mimicIndex] = mimickedMove;
			source.m.curMoves[mimicIndex] = mimickedMove.id;
			this.add('-start', source, 'Mimic', move.name);
		},
	},
	sketch: {
		inherit: true,
		onHit(target, source) {
			const disallowedMoves = ['chatter', 'sketch', 'struggle'];
			const move = target.lastMove;
			if (source.transformed || !move || source.moves.includes(move.id)) return false;
			if (disallowedMoves.includes(move.id) || move.isZ || move.isMax) return false;
			const sketchIndex = source.moves.indexOf('sketch');
			if (sketchIndex < 0) return false;
			if (!source.m.curMoves.includes('sketch')) return false;
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
			source.m.curMoves[sketchIndex] = sketchedMove.id;
			this.add('-activate', source, 'move: Sketch', move.name);
		},
	},
	skillswap: {
		inherit: true,
		onHit(target, source, move) {
			const targetAbility = target.getAbility();
			const sourceAbility = source.getAbility();
			const ally = source.side.active.find(mon => mon && mon !== source && !mon.fainted);
			const foeAlly = target.side.active.find(mon => mon && mon !== target && !mon.fainted);
			if (target.isAlly(source)) {
				this.add('-activate', source, 'move: Skill Swap', '', '', `[of] ${target}`);
			} else {
				this.add('-activate', source, 'move: Skill Swap', targetAbility, sourceAbility, `[of] ${target}`);
			}
			this.singleEvent('End', sourceAbility, source.abilityState, source);
			if (ally?.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}

			this.singleEvent('End', targetAbility, target.abilityState, target);
			if (foeAlly?.m.innate) {
				foeAlly.removeVolatile(foeAlly.m.innate);
				delete foeAlly.m.innate;
			}

			source.ability = targetAbility.id;
			source.abilityState = this.initEffectState({ id: this.toID(source.ability), target: source });
			if (source.m.innate?.endsWith(targetAbility.id)) {
				source.removeVolatile(source.m.innate);
				delete source.m.innate;
			}
			if (ally && ally.ability !== targetAbility.id) {
				if (!source.m.innate) {
					source.m.innate = 'ability:' + ally.getAbility().id;
					source.addVolatile(source.m.innate);
				}
				ally.m.innate = 'ability:' + targetAbility.id;
				ally.addVolatile(ally.m.innate);
			}

			target.ability = sourceAbility.id;
			target.abilityState = this.initEffectState({ id: this.toID(target.ability), target });
			if (target.m.innate?.endsWith(sourceAbility.id)) {
				target.removeVolatile(target.m.innate);
				delete target.m.innate;
			}
			if (foeAlly && foeAlly.ability !== sourceAbility.id) {
				if (!target.m.innate) {
					target.m.innate = 'ability:' + foeAlly.getAbility().id;
					target.addVolatile(target.m.innate);
				}
				foeAlly.m.innate = 'ability:' + sourceAbility.id;
				foeAlly.addVolatile(foeAlly.m.innate);
			}

			if (!target.isAlly(source)) target.volatileStaleness = 'external';
			this.singleEvent('Start', targetAbility, source.abilityState, source);
			this.singleEvent('Start', sourceAbility, target.abilityState, target);
		},
	},
};
