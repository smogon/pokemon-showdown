export const Moves: {[k: string]: ModdedMoveData} = {
	attract: {
		inherit: true,
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon, source, effect) {
				if (!(pokemon.gender === 'M' && source.gender === 'F') && !(pokemon.gender === 'F' && source.gender === 'M')) {
					this.debug('incompatible gender');
					return false;
				}
				if (!this.runEvent('Attract', pokemon, source)) {
					this.debug('Attract event failed');
					return false;
				}

				if (effect.id === 'cutecharm' || effect.id === 'ability:cutecharm') {
					this.add('-start', pokemon, 'Attract', '[from] ability: Cute Charm', '[of] ' + source);
				} else if (effect.id === 'destinyknot') {
					this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', '[of] ' + source);
				} else {
					this.add('-start', pokemon, 'Attract');
				}
			},
			onUpdate(pokemon) {
				if (this.effectState.source && !this.effectState.source.isActive && pokemon.volatiles['attract']) {
					this.debug('Removing Attract volatile on ' + pokemon);
					pokemon.removeVolatile('attract');
				}
			},
			onBeforeMovePriority: 2,
			onBeforeMove(pokemon, target, move) {
				this.add('-activate', pokemon, 'move: Attract', '[of] ' + this.effectState.source);
				if (this.randomChance(1, 2)) {
					this.add('cant', pokemon, 'Attract');
					return false;
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Attract', '[silent]');
			},
		},
	},
	gastroacid: {
		inherit: true,
		condition: {
			// Ability suppression implemented in Pokemon.ignoringAbility() within sim/pokemon.js
			onStart(pokemon) {
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
	mimic: {
		inherit: true,
		onHit(target, source) {
			const disallowedMoves = [
				'behemothbash', 'behemothblade', 'chatter', 'dynamaxcannon', 'mimic', 'sketch', 'struggle', 'transform',
			];
			const move = target.lastMove;
			if (source.transformed || !move || disallowedMoves.includes(move.id) || source.moves.includes(move.id)) {
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
	safeguard: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', effect);
					return 7;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (!effect || !source) return;
				if (effect.id === 'yawn') return;
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if (target !== source) {
					this.debug('interrupting setStatus');
					if (effect.id.endsWith('synchronize') || (effect.effectType === 'Move' && !effect.secondaries)) {
						this.add('-activate', target, 'move: Safeguard');
					}
					return null;
				}
			},
			onTryAddVolatile(status, target, source, effect) {
				if (!effect || !source) return;
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if ((status.id === 'confusion' || status.id === 'yawn') && target !== source) {
					if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Safeguard');
					return null;
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'Safeguard');
			},
			onSideResidualOrder: 21,
			onSideResidualSubOrder: 2,
			onSideEnd(side) {
				this.add('-sideend', side, 'Safeguard');
			},
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
			const targetAbility = this.dex.abilities.get(target.ability);
			const sourceAbility = this.dex.abilities.get(source.ability);
			if (target.side === source.side) {
				this.add('-activate', source, 'move: Skill Swap', '', '', '[of] ' + target);
			} else {
				this.add('-activate', source, 'move: Skill Swap', targetAbility, sourceAbility, '[of] ' + target);
			}
			this.singleEvent('End', sourceAbility, source.abilityState, source);
			const sourceAlly = source.side.active.find(ally => ally && ally !== source && !ally.fainted);
			if (sourceAlly && sourceAlly.m.innate) {
				sourceAlly.removeVolatile(sourceAlly.m.innate);
				delete sourceAlly.m.innate;
			}
			this.singleEvent('End', targetAbility, target.abilityState, target);
			const targetAlly = target.side.active.find(ally => ally && ally !== target && !ally.fainted);
			if (targetAlly && targetAlly.m.innate) {
				targetAlly.removeVolatile(targetAlly.m.innate);
				delete targetAlly.m.innate;
			}
			if (targetAbility.id !== sourceAbility.id) {
				source.ability = targetAbility.id;
				target.ability = sourceAbility.id;
				source.abilityState = {id: source.ability, target: source};
				target.abilityState = {id: target.ability, target: target};
			}
			if (sourceAlly && sourceAlly.ability !== source.ability) {
				let volatile = sourceAlly.m.innate = 'ability:' + source.ability;
				sourceAlly.volatiles[volatile] = {id: volatile};
				sourceAlly.volatiles[volatile].target = sourceAlly;
				sourceAlly.volatiles[volatile].source = source;
				sourceAlly.volatiles[volatile].sourcePosition = source.position;
				if (!source.m.innate) {
					volatile = source.m.innate = 'ability:' + sourceAlly.ability;
					source.volatiles[volatile] = {id: volatile};
					source.volatiles[volatile].target = source;
					source.volatiles[volatile].source = sourceAlly;
					source.volatiles[volatile].sourcePosition = sourceAlly.position;
				}
			}
			if (targetAlly && targetAlly.ability !== target.ability) {
				let volatile = targetAlly.m.innate = 'ability:' + target.ability;
				targetAlly.volatiles[volatile] = {id: volatile};
				targetAlly.volatiles[volatile].target = targetAlly;
				targetAlly.volatiles[volatile].source = target;
				targetAlly.volatiles[volatile].sourcePosition = target.position;
				if (!target.m.innate) {
					volatile = target.m.innate = 'ability:' + targetAlly.ability;
					target.volatiles[volatile] = {id: volatile};
					target.volatiles[volatile].target = target;
					target.volatiles[volatile].source = targetAlly;
					target.volatiles[volatile].sourcePosition = targetAlly.position;
				}
			}
			this.singleEvent('Start', targetAbility, source.abilityState, source);
			if (sourceAlly && sourceAlly.m.innate) {
				this.singleEvent('Start', targetAbility, sourceAlly.volatiles[sourceAlly.m.innate], sourceAlly);
			}
			this.singleEvent('Start', sourceAbility, target.abilityState, target);
			if (targetAlly && targetAlly.m.innate) {
				this.singleEvent('Start', sourceAbility, targetAlly.volatiles[targetAlly.m.innate], targetAlly);
			}
		},
	},
};
