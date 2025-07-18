export const Scripts: ModdedBattleScriptsData = {
	endTurn() {
		this.turn++;
		this.lastSuccessfulMoveThisTurn = null;

		const dynamaxEnding: Pokemon[] = [];
		for (const pokemon of this.getAllActive()) {
			if (pokemon.volatiles['dynamax']?.turns === 3) {
				dynamaxEnding.push(pokemon);
			}
		}
		if (dynamaxEnding.length > 1) {
			this.updateSpeed();
			this.speedSort(dynamaxEnding);
		}
		for (const pokemon of dynamaxEnding) {
			pokemon.removeVolatile('dynamax');
		}

		// Gen 1 partial trapping ends when either Pokemon or a switch in faints to residual damage
		if (this.gen === 1) {
			for (const pokemon of this.getAllActive()) {
				if (pokemon.volatiles['partialtrappinglock']) {
					const target = pokemon.volatiles['partialtrappinglock'].locked;
					if (target.hp <= 0 || !target.volatiles['partiallytrapped']) {
						delete pokemon.volatiles['partialtrappinglock'];
					}
				}
				if (pokemon.volatiles['partiallytrapped']) {
					const source = pokemon.volatiles['partiallytrapped'].source;
					if (source.hp <= 0 || !source.volatiles['partialtrappinglock']) {
						delete pokemon.volatiles['partiallytrapped'];
					}
				}
			}
		}

		const trappedBySide: boolean[] = [];
		const stalenessBySide: ('internal' | 'external' | undefined)[] = [];
		for (const side of this.sides) {
			let sideTrapped = true;
			let sideStaleness: 'internal' | 'external' | undefined;
			for (const pokemon of side.active) {
				if (!pokemon) continue;
				pokemon.moveThisTurn = '';
				pokemon.newlySwitched = false;
				pokemon.moveLastTurnResult = pokemon.moveThisTurnResult;
				pokemon.moveThisTurnResult = undefined;
				if (this.turn !== 1) {
					pokemon.usedItemThisTurn = false;
					pokemon.statsRaisedThisTurn = false;
					pokemon.statsLoweredThisTurn = false;
					// It shouldn't be possible in a normal battle for a Pokemon to be damaged before turn 1's move selection
					// However, this could be potentially relevant in certain OMs
					pokemon.hurtThisTurn = null;
				}

				pokemon.maybeDisabled = false;
				pokemon.maybeLocked = false;
				for (const moveSlot of pokemon.moveSlots) {
					moveSlot.disabled = false;
					moveSlot.disabledSource = '';
				}
				this.runEvent('DisableMove', pokemon);
				for (const moveSlot of pokemon.moveSlots) {
					const activeMove = this.dex.getActiveMove(moveSlot.id);
					this.singleEvent('DisableMove', activeMove, null, pokemon);
					if (activeMove.flags['cantusetwice'] && pokemon.lastMove?.id === moveSlot.id) {
						pokemon.disableMove(pokemon.lastMove.id);
					}
				}

				// If it was an illusion, it's not any more
				if (pokemon.getLastAttackedBy() && this.gen >= 7) pokemon.knownType = true;

				for (let i = pokemon.attackedBy.length - 1; i >= 0; i--) {
					const attack = pokemon.attackedBy[i];
					if (attack.source.isActive) {
						attack.thisTurn = false;
					} else {
						pokemon.attackedBy.splice(pokemon.attackedBy.indexOf(attack), 1);
					}
				}

				if (this.gen >= 7 && !pokemon.terastallized) {
					// In Gen 7, the real type of every Pokemon is visible to all players via the bottom screen while making choices
					const seenPokemon = pokemon.illusion || pokemon;
					const realTypeString = seenPokemon.getTypes(true).join('/');
					if (realTypeString !== seenPokemon.apparentType) {
						this.add('-start', pokemon, 'typechange', realTypeString, '[silent]');
						seenPokemon.apparentType = realTypeString;
						if (pokemon.addedType) {
							// The typechange message removes the added type, so put it back
							this.add('-start', pokemon, 'typeadd', pokemon.addedType, '[silent]');
						}
					}
				}

				pokemon.trapped = pokemon.maybeTrapped = false;
				this.runEvent('TrapPokemon', pokemon);
				if (!pokemon.knownType || this.dex.getImmunity('trapped', pokemon)) {
					this.runEvent('MaybeTrapPokemon', pokemon);
				}
				// canceling switches would leak information
				// if a foe might have a trapping ability
				if (this.gen > 2) {
					for (const source of pokemon.foes()) {
						const species = (source.illusion || source).species;
						if (!species.abilities) continue;
						for (const abilitySlot in species.abilities) {
							const abilityName = species.abilities[abilitySlot as keyof Species['abilities']];
							if (abilityName === source.ability) {
								// pokemon event was already run above so we don't need
								// to run it again.
								continue;
							}
							const ruleTable = this.ruleTable;
							if ((ruleTable.has('+hackmons') || !ruleTable.has('obtainableabilities')) && !this.format.team) {
								// hackmons format
								continue;
							} else if (abilitySlot === 'H' && species.unreleasedHidden) {
								// unreleased hidden ability
								continue;
							}
							const ability = this.dex.abilities.get(abilityName);
							if (ruleTable.has('-ability:' + ability.id)) continue;
							if (pokemon.knownType && !this.dex.getImmunity('trapped', pokemon)) continue;
							this.singleEvent('FoeMaybeTrapPokemon', ability, {}, pokemon, source);
						}
					}
				}

				if (pokemon.fainted) continue;

				sideTrapped = sideTrapped && pokemon.trapped;
				const staleness = pokemon.volatileStaleness || pokemon.staleness;
				if (staleness) sideStaleness = sideStaleness === 'external' ? sideStaleness : staleness;
				pokemon.activeTurns++;
			}
			trappedBySide.push(sideTrapped);
			stalenessBySide.push(sideStaleness);
			side.faintedLastTurn = side.faintedThisTurn;
			side.faintedThisTurn = null;
		}

		if (this.maybeTriggerEndlessBattleClause(trappedBySide, stalenessBySide)) return;

		if (this.gameType === 'triples' && this.sides.every(side => side.pokemonLeft === 1)) {
			// If both sides have one Pokemon left in triples and they are not adjacent, they are both moved to the center.
			const actives = this.getAllActive();
			if (actives.length > 1 && !actives[0].isAdjacent(actives[1])) {
				this.swapPosition(actives[0], 1, '[silent]');
				this.swapPosition(actives[1], 1, '[silent]');
				this.add('-center');
			}
		}

		this.add('turn', this.turn);
		if (this.gameType === 'multi') {
			for (const side of this.sides) {
				if (side.canDynamaxNow()) {
					if (this.turn === 1) {
						this.addSplit(side.id, ['-candynamax', side.id]);
					} else {
						this.add('-candynamax', side.id);
					}
				}
			}
		}
		if (this.gen === 2) this.quickClawRoll = this.randomChance(60, 256);
		if (this.gen === 3) this.quickClawRoll = this.randomChance(1, 5);

		let buf = `<div class="broadcast-blue"><details><summary>What does which wish do?</summary>`;
		buf += `&bullet; <b>Mega Evolution:</b> <span style="font-size: 9px;">Revive one fainted Pokemon</span><br />`;
		buf += `&bullet; <b>Mega Evolution X:</b> <span style="font-size: 9px;">Gain a +2 boost in the current Pokemon's dominant attack and defense stat</span><br />`;
		buf += `&bullet; <b>Mega Evolution Y:</b> <span style="font-size: 9px;">Give the current Pokemon innate Serene Grace + Focus Energy for the rest of the game</span><br />`;
		buf += `&bullet; <b>Terastallize:</b> <span style="font-size: 9px;">Scout the active Pokemon for one of their moves</span><br />`;
		buf += `</details></div>`;
		this.add(`raw|${buf}`);

		this.makeRequest('move');
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

			// Change Zacian/Zamazenta into their Crowned formes
			for (const pokemon of this.getAllPokemon()) {
				let rawSpecies: Species | null = null;
				if (pokemon.species.id === 'zacian' && pokemon.item === 'rustedsword') {
					rawSpecies = this.dex.species.get('Zacian-Crowned');
				} else if (pokemon.species.id === 'zamazenta' && pokemon.item === 'rustedshield') {
					rawSpecies = this.dex.species.get('Zamazenta-Crowned');
				}
				if (!rawSpecies) continue;
				const species = pokemon.setSpecies(rawSpecies);
				if (!species) continue;
				pokemon.baseSpecies = rawSpecies;
				pokemon.details = pokemon.getUpdatedDetails();
				pokemon.setAbility(species.abilities['0'], null, null, true);
				pokemon.baseAbility = pokemon.ability;

				const behemothMove: { [k: string]: string } = {
					'Zacian-Crowned': 'behemothblade', 'Zamazenta-Crowned': 'behemothbash',
				};
				const ironHead = pokemon.baseMoves.indexOf('ironhead');
				if (ironHead >= 0) {
					const move = this.dex.moves.get(behemothMove[rawSpecies.name]);
					pokemon.baseMoveSlots[ironHead] = {
						move: move.name,
						id: move.id,
						pp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
						maxpp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						disabledSource: '',
						used: false,
					};
					pokemon.moveSlots = pokemon.baseMoveSlots.slice();
				}
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
			for (const pokemon of this.getAllPokemon()) {
				this.singleEvent('Start', this.dex.conditions.getByID(pokemon.species.id), pokemon.speciesState, pokemon);
			}
			this.midTurn = true;
			break;
		}

		case 'move':
			if (!action.pokemon.isActive) return false;
			if (action.pokemon.fainted) return false;
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
			if (!action.sourceEffect) action.target.m.revivedByMonkeysPaw = true;
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

		if (this.gen >= 8 && (this.queue.peek()?.choice === 'move' || this.queue.peek()?.choice === 'runDynamax')) {
			// In gen 8, speed is updated dynamically so update the queue's speed properties and sort it.
			this.updateSpeed();
			for (const queueAction of this.queue.list) {
				if (queueAction.pokemon) this.getActionSpeed(queueAction);
			}
			this.queue.sort();
		}

		return false;
	},
	actions: {
		inherit: true,
		canMegaEvo(pokemon) {
			// @ts-expect-error
			if (!pokemon.side.wishesRemaining) return null;
			// @ts-expect-error
			if (!pokemon.side.wishes['life']) return null;
			return 'yes';
		},
		canMegaEvoX(pokemon) {
			// @ts-expect-error
			if (!pokemon.side.wishesRemaining) return null;
			// @ts-expect-error
			if (!pokemon.side.wishes['power']) return null;
			return 'yes';
		},
		canMegaEvoY(pokemon) {
			// @ts-expect-error
			if (!pokemon.side.wishesRemaining) return null;
			// @ts-expect-error
			if (!pokemon.side.wishes['luck']) return null;
			return 'yes';
		},
		canTerastallize(pokemon) {
			// @ts-expect-error
			if (!pokemon.side.wishesRemaining) return null;
			// @ts-expect-error
			if (!pokemon.side.wishes['knowledge']) return null;
			return 'Stellar';
		},
		// wish for life (dead teammate is revived, but that teammate has permanent slow start)
		runMegaEvo(pokemon) {
			if (!pokemon.canMegaEvo) return false;

			// Limit one wish for life per side
			for (const ally of pokemon.side.pokemon) {
				ally.canMegaEvo = null;
			}
			// @ts-expect-error
			pokemon.side.wishesRemaining--;
			// @ts-expect-error
			delete pokemon.side.wishes['life'];

			this.battle.add('message', `The Monkey's Paw curls.`);
			this.battle.add('-message', `${pokemon.side.name} wishes for Life.`);
			this.battle.add('-message', `At the cost of great power, the Pokemon revived will move at a slowed pace permanently.`);
			// @ts-expect-error
			this.battle.add('-message', `They have ${pokemon.side.wishesRemaining} wish${pokemon.side.wishesRemaining === 1 ? '' : 'es'} remaining.`);
			this.useMove('revivalblessing', pokemon, { sourceEffect: this.dex.getActiveMove('monkeyspaw') });
			this.battle.runEvent('AfterMega', pokemon);
			return true;
		},
		// wish for power (+2 prominent stat/defense, -2 every other stat)
		runMegaEvoX(pokemon) {
			if (!pokemon.canMegaEvoX) return false;

			// Limit one wish for life per side
			for (const ally of pokemon.side.pokemon) {
				ally.canMegaEvoX = null;
			}
			// @ts-expect-error
			pokemon.side.wishesRemaining--;
			// @ts-expect-error
			delete pokemon.side.wishes['power'];

			this.battle.add('message', `The Monkey's Paw curls.`);
			this.battle.add('-message', `${pokemon.side.name} wishes for Power.`);
			this.battle.add('-message', `At the cost of great power, ${pokemon.name} has become very frail.`);
			// @ts-expect-error
			this.battle.add('-message', `They have ${pokemon.side.wishesRemaining} wish${pokemon.side.wishesRemaining === 1 ? '' : 'es'} remaining.`);

			let positiveBoosts: BoostID[] = ['atk', 'def'];
			if (pokemon.getStat('spa', false, true) > pokemon.getStat('atk', false, true)) positiveBoosts = ['spa', 'spd'];
			const boostsTable: SparseBoostsTable = {};

			let boost: BoostID;
			for (boost in pokemon.boosts) {
				if (boost === 'accuracy' || boost === 'evasion' || boost === 'spe') continue;
				if (positiveBoosts.includes(boost)) {
					boostsTable[boost] = 2;
				} else {
					boostsTable[boost] = -2;
				}
			}

			this.battle.boost(boostsTable, pokemon);

			this.battle.runEvent('AfterMega', pokemon);
			return true;
		},
		// wish for luck (serene grace + focus energy but confused)
		runMegaEvoY(pokemon) {
			if (!pokemon.canMegaEvoY) return false;

			// Limit one wish for life per side
			for (const ally of pokemon.side.pokemon) {
				ally.canMegaEvoY = null;
			}
			// @ts-expect-error
			pokemon.side.wishesRemaining--;
			// @ts-expect-error
			delete pokemon.side.wishes['luck'];

			this.battle.add('message', `The Monkey's Paw curls.`);
			this.battle.add('-message', `${pokemon.side.name} wishes for Luck.`);
			this.battle.add('-message', `At the cost of great power, ${pokemon.name}'s luck becomes double-edged.`);
			// @ts-expect-error
			this.battle.add('-message', `They have ${pokemon.side.wishesRemaining} wish${pokemon.side.wishesRemaining === 1 ? '' : 'es'} remaining.`);
			pokemon.m.monkeyPawLuck = true;
			pokemon.addVolatile('focusenergy');
			pokemon.addVolatile('confusion', null, this.dex.conditions.get('monkeyspaw'));

			this.battle.runEvent('AfterMega', pokemon);
			return true;
		},
		// wish for knowledge
		terastallize(pokemon) {
			if (!pokemon.canTerastallize) return;

			// limit one wish for knowledge per side
			for (const ally of pokemon.side.pokemon) {
				ally.canTerastallize = null;
			}
			// @ts-expect-error
			pokemon.side.wishesRemaining--;
			// @ts-expect-error
			delete pokemon.side.wishes['knowledge'];

			this.battle.add('message', `The Monkey's Paw curls.`);
			this.battle.add('-message', `${pokemon.side.name} wishes for Knowledge.`);
			this.battle.add('-message', `At the cost of great power, the knowledge gained comes with increased threat.`);
			// @ts-expect-error
			this.battle.add('-message', `They have ${pokemon.side.wishesRemaining} wish${pokemon.side.wishesRemaining === 1 ? '' : 'es'} remaining.`);
			const foeActive = pokemon.foes()[0];
			if (foeActive) {
				const move = this.dex.getActiveMove(this.battle.sample(foeActive.moveSlots).id);
				this.useMove(move, foeActive,
					{ target: pokemon, zMove: move.category === 'Status' ? move.name : this.Z_MOVES[move.type] });
			}

			this.battle.runEvent('AfterTerastallization', pokemon);
		},
		// one more wish
	},
	side: {
		// @ts-expect-error
		wishesRemaining: 4,
		wishes: {
			luck: 1,
			power: 1,
			life: 1,
			knowledge: 1,
		},
	},
};
