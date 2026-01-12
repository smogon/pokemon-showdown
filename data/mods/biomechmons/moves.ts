export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	// Remember, everything deals with SLOTS not with properties as they are!
	covet: {
		inherit: true,
		onAfterHit(target, source, move) {
			if (source.item || source.volatiles['gem']) {
				return;
			}
			const yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (
				!this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem) ||
				!source.setItem(yourItem)
			) {
				if (!this.dex.items.get(yourItem.id).exists) {
					target.setItem(yourItem.id);
					return;
				}
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-item', source, yourItem, '[from] move: Covet', `[of] ${target}`);
		},
	},
	embargo: {
		inherit: true,
		condition: {
			duration: 5,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Embargo');
				this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
				if (!this.dex.items.get(pokemon.item).exists) {
					const isAbil = (pokemon.m.scrambled.abilities as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
					if (isAbil >= 0) {
						pokemon.removeVolatile('ability:' + this.toID(pokemon.m.scrambled.abilities[isAbil].thing));
					} else if ((pokemon.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item') >= 0) {
						const isMove = (pokemon.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
						const slotNo = pokemon.moveSlots.findIndex(m => this.toID(pokemon.m.scrambled.moves[isMove].thing) === m.id);
						if (slotNo >= 0) pokemon.moveSlots.splice(slotNo, 1);
					}
				}
			},
			// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
			onResidualOrder: 21,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Embargo');
				if (!this.dex.items.get(pokemon.item).exists) {
					const isAbil = (pokemon.m.scrambled.abilities as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
					if (isAbil >= 0) {
						pokemon.addVolatile('ability:' + this.toID(pokemon.m.scrambled.abilities[isAbil].thing));
					} else if ((pokemon.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item') >= 0) {
						const findMove = (pokemon.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
						const findSlot = pokemon.baseMoveSlots.find(e => e.id === this.toID(pokemon.m.scrambled.moves[findMove].thing));
						pokemon.moveSlots.push(this.dex.deepClone(findSlot));
					}
				}
			},
		},
	},
	magicroom: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Magic Room');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Magic Room', `[of] ${source}`, '[persistent]');
				} else {
					this.add('-fieldstart', 'move: Magic Room', `[of] ${source}`);
				}
				for (const mon of this.getAllActive()) {
					this.singleEvent('End', mon.getItem(), mon.itemState, mon);
					if (!this.dex.items.get(mon.item).exists) {
						const isAbil = (mon.m.scrambled.abilities as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
						if (isAbil >= 0) {
							mon.removeVolatile('ability:' + this.toID(mon.m.scrambled.abilities[isAbil].thing));
						} else if ((mon.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item') >= 0) {
							const isMove = (mon.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
							const slotNo = mon.moveSlots.findIndex(m => this.toID(mon.m.scrambled.moves[isMove].thing) === m.id);
							if (slotNo >= 0) mon.moveSlots.splice(slotNo, 1);
						}
					}
				}
			},
			onFieldRestart(target, source) {
				this.field.removePseudoWeather('magicroom');
			},
			// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 6,
			onFieldEnd() {
				this.add('-fieldend', 'move: Magic Room', '[of] ' + this.effectState.source);
				for (const pokemon of this.getAllActive()) {
					if (!this.dex.items.get(pokemon.item).exists) {
						const isAbil = (pokemon.m.scrambled.abilities as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
						if (isAbil >= 0) {
							pokemon.addVolatile('ability:' + this.toID(pokemon.m.scrambled.abilities[isAbil].thing));
						} else if ((pokemon.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item') >= 0) {
							const findMove = (pokemon.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Item');
							const findSlot = pokemon.baseMoveSlots.find(e => e.id === this.toID(pokemon.m.scrambled.moves[findMove].thing));
							pokemon.moveSlots.push(this.dex.deepClone(findSlot));
						}
					}
				}
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
				if (!this.dex.abilities.get(pokemon.ability).exists) {
					const isItem = (pokemon.m.scrambled.items as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
					if (isItem >= 0) {
						pokemon.removeVolatile('item:' + this.toID(pokemon.m.scrambled.items[isItem].thing));
					} else if ((pokemon.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability') >= 0) {
						const isMove = (pokemon.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
						const slotNo = pokemon.moveSlots.findIndex(m => this.toID(pokemon.m.scrambled.moves[isMove].thing) === m.id);
						if (slotNo >= 0) pokemon.moveSlots.splice(slotNo, 1);
					}
				}
			},
		},
	},
	trick: {
		inherit: true,
		onHit(target, source, move) {
			const yourItem = target.takeItem(source);
			const myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) {
					if (!this.dex.items.get(yourItem.id).exists) {
						target.setItem(yourItem.id);
					} else {
						target.item = yourItem.id;
					}
				}
				if (myItem) {
					if (!this.dex.items.get(myItem.id).exists) {
						source.setItem(myItem.id);
					} else {
						source.item = myItem.id;
					}
				}
				return false;
			}
			if (
				(myItem && !this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem)) ||
				(yourItem && !this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem))
			) {
				if (yourItem) {
					if (!this.dex.items.get(yourItem.id).exists) {
						target.setItem(yourItem.id);
					} else {
						target.item = yourItem.id;
					}
				}
				if (myItem) {
					if (!this.dex.items.get(myItem.id).exists) {
						source.setItem(myItem.id);
					} else {
						source.item = myItem.id;
					}
				}
				return false;
			}
			this.add('-activate', source, 'move: Trick', `[of] ${target}`);
			if (myItem) {
				target.setItem(myItem);
				this.add('-item', target, myItem, '[from] move: Trick');
			} else {
				this.add('-enditem', target, yourItem, '[silent]', '[from] move: Trick');
			}
			if (yourItem) {
				source.setItem(yourItem);
				this.add('-item', source, yourItem, '[from] move: Trick');
			} else {
				this.add('-enditem', source, myItem, '[silent]', '[from] move: Trick');
			}
		},
	},
	sketch: {
		inherit: true,
		onHit(target, source) {
			const move = target.lastMove;
			if (source.transformed || !move || source.moves.includes(move.id)) return false;
			if (move.flags['nosketch'] || move.isZ || move.isMax) return false;
			const sketchIndex = source.moves.indexOf('sketch');
			if (sketchIndex < 0) return false;
			if (this.toID(source.item) === 'sketch') {
				source.setItem(move.name);
				this.add('-activate', source, 'move: Sketch', move.name);
				return;
			} else if (this.toID(source.ability) === 'sketch') {
				source.setAbility(move.name);
				this.add('-activate', source, 'move: Sketch', move.name);
				return;
			}
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
	skillswap: {
		inherit: true,
		onTryHit(target, source) {
			const targetAbility = target.getAbility();
			const sourceAbility = source.getAbility();
			if (sourceAbility.flags['failskillswap'] || targetAbility.flags['failskillswap'] || target.volatiles['dynamax']) {
				return false;
			}
			let sourceCanBeSet = this.runEvent('SetAbility', source, source, this.effect, targetAbility);
			if (!this.dex.abilities.get(sourceAbility).exists && this.dex.items.get(sourceAbility.id).exists) {
				sourceCanBeSet = this.runEvent('TakeItem', source, source, this.effect, this.dex.items.get(sourceAbility.id));
			}

			if (!sourceCanBeSet) return sourceCanBeSet;
			let targetCanBeSet = this.runEvent('SetAbility', target, source, this.effect, sourceAbility);
			if (!this.dex.abilities.get(targetAbility).exists && this.dex.items.get(targetAbility.id).exists) {
				targetCanBeSet = this.runEvent('TakeItem', target, source, this.effect, this.dex.items.get(targetAbility.id));
			}
			if (!targetCanBeSet) return targetCanBeSet;
		},
		onHit(target, source, move) {
			const targetAbility = target.getAbility();
			const sourceAbility = source.getAbility();
			const sourceIsBMM = !this.dex.abilities.get(sourceAbility).exists;
			const targetIsBMM = !this.dex.abilities.get(targetAbility).exists;
			if (target.isAlly(source)) {
				this.add('-activate', source, 'move: Skill Swap', '', '', `[of] ${target}`);
			} else {
				this.add('-activate', source, 'move: Skill Swap', targetAbility, sourceAbility, `[of] ${target}`);
			}
			this.singleEvent('End', sourceAbility, source.abilityState, source);
			if (sourceIsBMM) {
				const isItem = (source.m.scrambled.items as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
				if (isItem >= 0) {
					source.removeVolatile('item:' + this.toID(source.m.scrambled.items[isItem].thing));
					source.m.scrambled.items.splice(isItem, 1);
				} else if ((source.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability') >= 0) {
					const isMove = (source.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
					source.baseMoveSlots.splice(
						source.baseMoveSlots.findIndex(m => this.toID(source.m.scrambled.moves[isMove].thing) === m.id), 1);
					source.moveSlots.splice(source.moveSlots.findIndex(m => this.toID(source.m.scrambled.moves[isMove].thing) === m.id), 1);
					source.m.scrambled.moves.splice(isMove, 1);
				}
			}
			this.singleEvent('End', targetAbility, target.abilityState, target);
			if (targetIsBMM) {
				const isItem = (target.m.scrambled.items as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
				if (isItem >= 0) {
					target.removeVolatile('item:' + this.toID(target.m.scrambled.items[isItem].thing));
					target.m.scrambled.items.splice(isItem, 1);
				} else if ((target.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability') >= 0) {
					const isMove = (target.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
					target.baseMoveSlots.splice(
						target.baseMoveSlots.findIndex(m => this.toID(target.m.scrambled.moves[isMove].thing) === m.id), 1);
					target.moveSlots.splice(target.moveSlots.findIndex(m => this.toID(target.m.scrambled.moves[isMove].thing) === m.id), 1);
					target.m.scrambled.moves.splice(isMove, 1);
				}
			}

			source.ability = source.baseAbility = targetAbility.id;
			target.ability = target.baseAbility = sourceAbility.id;
			source.abilityState = this.initEffectState({ id: this.toID(source.ability), target: source });
			target.abilityState = this.initEffectState({ id: this.toID(target.ability), target });

			source.volatileStaleness = undefined;
			if (!target.isAlly(source)) target.volatileStaleness = 'external';

			this.singleEvent('Start', targetAbility, source.abilityState, source);
			if (targetIsBMM) {
				if (this.dex.items.get(targetAbility.id).exists) {
					source.m.scrambled.items.push({ thing: targetAbility.id, inSlot: 'Ability' });
					const effect = 'item:' + this.toID(targetAbility.id);
					source.addVolatile(effect);
					source.volatiles[effect].inSlot = 'Ability';
				} else {
					source.m.scrambled.moves.push({ thing: targetAbility.id, inSlot: 'Ability' });
					const bmmMove = Dex.moves.get(targetAbility.id);
					const newMove = {
						move: bmmMove.name,
						id: bmmMove.id,
						pp: bmmMove.noPPBoosts ? bmmMove.pp : bmmMove.pp * 8 / 5,
						maxpp: bmmMove.noPPBoosts ? bmmMove.pp : bmmMove.pp * 8 / 5,
						target: bmmMove.target,
						disabled: false,
						used: false,
					};
					source.baseMoveSlots.push(newMove);
					source.moveSlots.push(newMove);
				}
			}
			this.singleEvent('Start', sourceAbility, target.abilityState, target);
			if (sourceIsBMM) {
				if (this.dex.items.get(sourceAbility.id).exists) {
					target.m.scrambled.items.push({ thing: sourceAbility.id, inSlot: 'Ability' });
					const effect = 'item:' + this.toID(sourceAbility.id);
					target.addVolatile(effect);
					target.volatiles[effect].inSlot = 'Ability';
				} else {
					target.m.scrambled.moves.push({ thing: sourceAbility.id, inSlot: 'Ability' });
					const bmmMove = Dex.moves.get(sourceAbility.id);
					const newMove = {
						move: bmmMove.name,
						id: bmmMove.id,
						pp: bmmMove.noPPBoosts ? bmmMove.pp : bmmMove.pp * 8 / 5,
						maxpp: bmmMove.noPPBoosts ? bmmMove.pp : bmmMove.pp * 8 / 5,
						target: bmmMove.target,
						disabled: false,
						used: false,
					};
					target.baseMoveSlots.push(newMove);
					target.moveSlots.push(newMove);
				}
			}
		},
	},
	switcheroo: {
		inherit: true,
		onHit(target, source, move) {
			const yourItem = target.takeItem(source);
			const myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) {
					if (!this.dex.items.get(yourItem.id).exists) {
						target.setItem(yourItem.id);
					} else {
						target.item = yourItem.id;
					}
				}
				if (myItem) {
					if (!this.dex.items.get(myItem.id).exists) {
						source.setItem(myItem.id);
					} else {
						source.item = myItem.id;
					}
				}
				return false;
			}
			if (
				(myItem && !this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem)) ||
				(yourItem && !this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem))
			) {
				if (yourItem) {
					if (!this.dex.items.get(yourItem.id).exists) {
						target.setItem(yourItem.id);
					} else {
						target.item = yourItem.id;
					}
				}
				if (myItem) {
					if (!this.dex.items.get(myItem.id).exists) {
						source.setItem(myItem.id);
					} else {
						source.item = myItem.id;
					}
				}
				return false;
			}
			this.add('-activate', source, 'move: Trick', `[of] ${target}`);
			if (myItem) {
				target.setItem(myItem);
				this.add('-item', target, myItem, '[from] move: Switcheroo');
			} else {
				this.add('-enditem', target, yourItem, '[silent]', '[from] move: Switcheroo');
			}
			if (yourItem) {
				source.setItem(yourItem);
				this.add('-item', source, yourItem, '[from] move: Switcheroo');
			} else {
				this.add('-enditem', source, myItem, '[silent]', '[from] move: Switcheroo');
			}
		},
	},
	thief: {
		inherit: true,
		onAfterHit(target, source, move) {
			if (source.item || source.volatiles['gem']) {
				return;
			}
			const yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (!this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem) ||
				!source.setItem(yourItem)) {
				if (!this.dex.items.get(yourItem.id).exists) {
					target.setItem(yourItem.id);
					return;
				}
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-enditem', target, yourItem, '[silent]', '[from] move: Thief', `[of] ${source}`);
			this.add('-item', source, yourItem, '[from] move: Thief', `[of] ${target}`);
		},
	},
};
