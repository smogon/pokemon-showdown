export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	// Remember, everything deals with SLOTS not with properties as they are!
	covet: {
		inherit: true,
		onAfterHit(defender, attacker, move) {
			if (attacker.item || attacker.volatiles['gem']) {
				return;
			}
			const yourItem = defender.takeItem(attacker);
			if (!yourItem) {
				return;
			}
			if (
				!this.singleEvent('TakeItem', yourItem, defender.itemState, attacker, defender, move, yourItem) ||
				!attacker.setItem(yourItem)
			) {
				if (!this.dex.items.get(yourItem.id).exists) {
					defender.setItem(yourItem.id);
					return;
				}
				defender.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-item', attacker, yourItem, '[from] move: Covet', `[of] ${defender}`);
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
			durationCallback(attacker, effect) {
				if (attacker?.hasAbility('persistent')) {
					this.add('-activate', attacker, 'ability: Persistent', '[move] Magic Room');
					return 7;
				}
				return 5;
			},
			onFieldStart(defender, attacker) {
				if (attacker?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Magic Room', `[of] ${attacker}`, '[persistent]');
				} else {
					this.add('-fieldstart', 'move: Magic Room', `[of] ${attacker}`);
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
			onFieldRestart(defender, attacker) {
				this.field.removePseudoWeather('magicroom');
			},
			// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 6,
			onFieldEnd() {
				this.add('-fieldend', 'move: Magic Room', '[of] ' + this.effectState.attacker);
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
		onHit(defender, attacker, move) {
			const yourItem = defender.takeItem(attacker);
			const myItem = attacker.takeItem();
			if (defender.item || attacker.item || (!yourItem && !myItem)) {
				if (yourItem) {
					if (!this.dex.items.get(yourItem.id).exists) {
						defender.setItem(yourItem.id);
					} else {
						defender.item = yourItem.id;
					}
				}
				if (myItem) {
					if (!this.dex.items.get(myItem.id).exists) {
						attacker.setItem(myItem.id);
					} else {
						attacker.item = myItem.id;
					}
				}
				return false;
			}
			if (
				(myItem && !this.singleEvent('TakeItem', myItem, attacker.itemState, defender, attacker, move, myItem)) ||
				(yourItem && !this.singleEvent('TakeItem', yourItem, defender.itemState, attacker, defender, move, yourItem))
			) {
				if (yourItem) {
					if (!this.dex.items.get(yourItem.id).exists) {
						defender.setItem(yourItem.id);
					} else {
						defender.item = yourItem.id;
					}
				}
				if (myItem) {
					if (!this.dex.items.get(myItem.id).exists) {
						attacker.setItem(myItem.id);
					} else {
						attacker.item = myItem.id;
					}
				}
				return false;
			}
			this.add('-activate', attacker, 'move: Trick', `[of] ${defender}`);
			if (myItem) {
				defender.setItem(myItem);
				this.add('-item', defender, myItem, '[from] move: Trick');
			} else {
				this.add('-enditem', defender, yourItem, '[silent]', '[from] move: Trick');
			}
			if (yourItem) {
				attacker.setItem(yourItem);
				this.add('-item', attacker, yourItem, '[from] move: Trick');
			} else {
				this.add('-enditem', attacker, myItem, '[silent]', '[from] move: Trick');
			}
		},
	},
	sketch: {
		inherit: true,
		onHit(defender, attacker) {
			const move = defender.lastMove;
			if (attacker.transformed || !move || attacker.moves.includes(move.id)) return false;
			if (move.flags['nosketch'] || move.isZ || move.isMax) return false;
			const sketchIndex = attacker.moves.indexOf('sketch');
			if (sketchIndex < 0) return false;
			if (this.toID(attacker.item) === 'sketch') {
				attacker.setItem(move.name);
				this.add('-activate', attacker, 'move: Sketch', move.name);
				return;
			} else if (this.toID(attacker.ability) === 'sketch') {
				attacker.setAbility(move.name);
				this.add('-activate', attacker, 'move: Sketch', move.name);
				return;
			}
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
			this.add('-activate', attacker, 'move: Sketch', move.name);
		},
	},
	skillswap: {
		inherit: true,
		onTryHit(defender, attacker) {
			const targetAbility = defender.getAbility();
			const sourceAbility = attacker.getAbility();
			if (sourceAbility.flags['failskillswap'] || targetAbility.flags['failskillswap'] || defender.volatiles['dynamax']) {
				return false;
			}
			let sourceCanBeSet = this.runEvent('SetAbility', attacker, attacker, this.effect, targetAbility);
			if (!this.dex.abilities.get(sourceAbility).exists && this.dex.items.get(sourceAbility.id).exists) {
				sourceCanBeSet = this.runEvent('TakeItem', attacker, attacker, this.effect, this.dex.items.get(sourceAbility.id));
			}

			if (!sourceCanBeSet) return sourceCanBeSet;
			let targetCanBeSet = this.runEvent('SetAbility', defender, attacker, this.effect, sourceAbility);
			if (!this.dex.abilities.get(targetAbility).exists && this.dex.items.get(targetAbility.id).exists) {
				targetCanBeSet = this.runEvent('TakeItem', defender, attacker, this.effect, this.dex.items.get(targetAbility.id));
			}
			if (!targetCanBeSet) return targetCanBeSet;
		},
		onHit(defender, attacker, move) {
			const targetAbility = defender.getAbility();
			const sourceAbility = attacker.getAbility();
			const sourceIsBMM = !this.dex.abilities.get(sourceAbility).exists;
			const targetIsBMM = !this.dex.abilities.get(targetAbility).exists;
			if (defender.isAlly(attacker)) {
				this.add('-activate', attacker, 'move: Skill Swap', '', '', `[of] ${defender}`);
			} else {
				this.add('-activate', attacker, 'move: Skill Swap', targetAbility, sourceAbility, `[of] ${defender}`);
			}
			this.singleEvent('End', sourceAbility, attacker.abilityState, attacker);
			if (sourceIsBMM) {
				const isItem = (attacker.m.scrambled.items as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
				if (isItem >= 0) {
					attacker.removeVolatile('item:' + this.toID(attacker.m.scrambled.items[isItem].thing));
					attacker.m.scrambled.items.splice(isItem, 1);
				} else if ((attacker.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability') >= 0) {
					const isMove = (attacker.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
					attacker.baseMoveSlots.splice(
						attacker.baseMoveSlots.findIndex(m => this.toID(attacker.m.scrambled.moves[isMove].thing) === m.id), 1);
					attacker.moveSlots.splice(attacker.moveSlots.findIndex(m => this.toID(attacker.m.scrambled.moves[isMove].thing) === m.id), 1);
					attacker.m.scrambled.moves.splice(isMove, 1);
				}
			}
			this.singleEvent('End', targetAbility, defender.abilityState, defender);
			if (targetIsBMM) {
				const isItem = (defender.m.scrambled.items as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
				if (isItem >= 0) {
					defender.removeVolatile('item:' + this.toID(defender.m.scrambled.items[isItem].thing));
					defender.m.scrambled.items.splice(isItem, 1);
				} else if ((defender.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability') >= 0) {
					const isMove = (defender.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
					defender.baseMoveSlots.splice(
						defender.baseMoveSlots.findIndex(m => this.toID(defender.m.scrambled.moves[isMove].thing) === m.id), 1);
					defender.moveSlots.splice(defender.moveSlots.findIndex(m => this.toID(defender.m.scrambled.moves[isMove].thing) === m.id), 1);
					defender.m.scrambled.moves.splice(isMove, 1);
				}
			}

			attacker.ability = attacker.baseAbility = targetAbility.id;
			defender.ability = defender.baseAbility = sourceAbility.id;
			attacker.abilityState = this.initEffectState({ id: this.toID(attacker.ability), defender: attacker });
			defender.abilityState = this.initEffectState({ id: this.toID(defender.ability), defender });

			attacker.volatileStaleness = undefined;
			if (!defender.isAlly(attacker)) defender.volatileStaleness = 'external';

			this.singleEvent('Start', targetAbility, attacker.abilityState, attacker);
			if (targetIsBMM) {
				if (this.dex.items.get(targetAbility.id).exists) {
					attacker.m.scrambled.items.push({ thing: targetAbility.id, inSlot: 'Ability' });
					const effect = 'item:' + this.toID(targetAbility.id);
					attacker.addVolatile(effect);
					attacker.volatiles[effect].inSlot = 'Ability';
				} else {
					attacker.m.scrambled.moves.push({ thing: targetAbility.id, inSlot: 'Ability' });
					const bmmMove = this.dex.moves.get(targetAbility.id);
					const ppUps = move.noPPBoosts ? 0 : 3;
					const basePP = this.calculatePP(move, ppUps);
					const newMove = {
						move: bmmMove.name,
						id: bmmMove.id,
						pp: basePP,
						maxpp: basePP,
						defender: bmmMove.defender,
						disabled: false,
						used: false,
					};
					attacker.baseMoveSlots.push(newMove);
					attacker.moveSlots.push(newMove);
					attacker.ppUps.push(ppUps);
				}
			}
			this.singleEvent('Start', sourceAbility, defender.abilityState, defender);
			if (sourceIsBMM) {
				if (this.dex.items.get(sourceAbility.id).exists) {
					defender.m.scrambled.items.push({ thing: sourceAbility.id, inSlot: 'Ability' });
					const effect = 'item:' + this.toID(sourceAbility.id);
					defender.addVolatile(effect);
					defender.volatiles[effect].inSlot = 'Ability';
				} else {
					defender.m.scrambled.moves.push({ thing: sourceAbility.id, inSlot: 'Ability' });
					const bmmMove = this.dex.moves.get(sourceAbility.id);
					const ppUps = move.noPPBoosts ? 0 : 3;
					const basePP = this.calculatePP(move, ppUps);
					const newMove = {
						move: bmmMove.name,
						id: bmmMove.id,
						pp: basePP,
						maxpp: basePP,
						defender: bmmMove.defender,
						disabled: false,
						used: false,
					};
					defender.baseMoveSlots.push(newMove);
					defender.moveSlots.push(newMove);
					defender.ppUps.push(ppUps);
				}
			}
		},
	},
	switcheroo: {
		inherit: true,
		onHit(defender, attacker, move) {
			const yourItem = defender.takeItem(attacker);
			const myItem = attacker.takeItem();
			if (defender.item || attacker.item || (!yourItem && !myItem)) {
				if (yourItem) {
					if (!this.dex.items.get(yourItem.id).exists) {
						defender.setItem(yourItem.id);
					} else {
						defender.item = yourItem.id;
					}
				}
				if (myItem) {
					if (!this.dex.items.get(myItem.id).exists) {
						attacker.setItem(myItem.id);
					} else {
						attacker.item = myItem.id;
					}
				}
				return false;
			}
			if (
				(myItem && !this.singleEvent('TakeItem', myItem, attacker.itemState, defender, attacker, move, myItem)) ||
				(yourItem && !this.singleEvent('TakeItem', yourItem, defender.itemState, attacker, defender, move, yourItem))
			) {
				if (yourItem) {
					if (!this.dex.items.get(yourItem.id).exists) {
						defender.setItem(yourItem.id);
					} else {
						defender.item = yourItem.id;
					}
				}
				if (myItem) {
					if (!this.dex.items.get(myItem.id).exists) {
						attacker.setItem(myItem.id);
					} else {
						attacker.item = myItem.id;
					}
				}
				return false;
			}
			this.add('-activate', attacker, 'move: Trick', `[of] ${defender}`);
			if (myItem) {
				defender.setItem(myItem);
				this.add('-item', defender, myItem, '[from] move: Switcheroo');
			} else {
				this.add('-enditem', defender, yourItem, '[silent]', '[from] move: Switcheroo');
			}
			if (yourItem) {
				attacker.setItem(yourItem);
				this.add('-item', attacker, yourItem, '[from] move: Switcheroo');
			} else {
				this.add('-enditem', attacker, myItem, '[silent]', '[from] move: Switcheroo');
			}
		},
	},
	thief: {
		inherit: true,
		onAfterHit(defender, attacker, move) {
			if (attacker.item || attacker.volatiles['gem']) {
				return;
			}
			const yourItem = defender.takeItem(attacker);
			if (!yourItem) {
				return;
			}
			if (!this.singleEvent('TakeItem', yourItem, defender.itemState, attacker, defender, move, yourItem) ||
				!attacker.setItem(yourItem)) {
				if (!this.dex.items.get(yourItem.id).exists) {
					defender.setItem(yourItem.id);
					return;
				}
				defender.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-enditem', defender, yourItem, '[silent]', '[from] move: Thief', `[of] ${attacker}`);
			this.add('-item', attacker, yourItem, '[from] move: Thief', `[of] ${defender}`);
		},
	},
};
