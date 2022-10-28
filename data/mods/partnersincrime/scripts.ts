export const Scripts: ModdedBattleScriptsData = {
	gen: 8,
	inherit: 'gen8',
	nextTurn() {
		this.turn++;
		this.lastSuccessfulMoveThisTurn = null;

		// Partners in Crime moveSlot updating
		// Must be highest priority so imprison doesn't lag behind.
		for (const side of this.sides) {
			for (const pokemon of side.active) {
				pokemon.moveSlots = pokemon.moveSlots.filter(move => pokemon.m.curMoves.includes(move.id));
				pokemon.m.curMoves = this.dex.deepClone(pokemon.moves);
				const ally = side.active.find(mon => mon && mon !== pokemon && !mon.fainted);
				let allyMoves = ally ? this.dex.deepClone(ally.moveSlots) : [];
				if (ally) {
					// @ts-ignore
					allyMoves = allyMoves.filter(move => !pokemon.moves.includes(move.id) && ally.m.curMoves.includes(move.id));
				}
				pokemon.moveSlots = pokemon.moveSlots.concat(allyMoves);
			}
		}

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
				for (const moveSlot of pokemon.moveSlots) {
					moveSlot.disabled = false;
					moveSlot.disabledSource = '';
				}
				this.runEvent('DisableMove', pokemon);
				if (!pokemon.ateBerry) pokemon.disableMove('belch');
				if (!pokemon.getItem().isBerry) pokemon.disableMove('stuffcheeks');

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

				if (this.gen >= 7) {
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

		// Crazyhouse Progress checker because sidebars has trouble keeping track of Pokemon.
		// Please remove me once there is client support.
		if (this.ruleTable.has('crazyhouserule')) {
			for (const side of this.sides) {
				let buf = `raw|${side.name}'s team:<br />`;
				for (const pokemon of side.pokemon) {
					if (!buf.endsWith('<br />')) buf += '/</span>&#8203;';
					if (pokemon.fainted) {
						buf += `<span style="white-space:nowrap;"><span style="opacity:.3"><psicon pokemon="${pokemon.species.id}" /></span>`;
					} else {
						buf += `<span style="white-space:nowrap"><psicon pokemon="${pokemon.species.id}" />`;
					}
				}
				this.add(`${buf}</span>`);
			}
		}

		this.makeRequest('move');
	},
	pokemon: {
		setAbility(ability, source, isFromFormeChange) {
			if (!this.hp) return false;
			if (typeof ability === 'string') ability = this.battle.dex.abilities.get(ability);
			const oldAbility = this.ability;
			if (!isFromFormeChange) {
				if (ability.isPermanent || this.getAbility().isPermanent) return false;
			}
			if (!this.battle.runEvent('SetAbility', this, source, this.battle.effect, ability)) return false;
			this.battle.singleEvent('End', this.battle.dex.abilities.get(oldAbility), this.abilityState, this, source);
			const ally = this.side.active.find(mon => mon && mon !== this && !mon.fainted);
			if (ally?.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}
			if (this.battle.effect && this.battle.effect.effectType === 'Move' && !isFromFormeChange) {
				this.battle.add('-endability', this, this.battle.dex.abilities.get(oldAbility), '[from] move: ' +
					this.battle.dex.moves.get(this.battle.effect.id));
			}
			this.ability = ability.id;
			this.abilityState = {id: ability.id, target: this};
			if (ability.id && this.battle.gen > 3) {
				this.battle.singleEvent('Start', ability, this.abilityState, this, source);
				if (ally && ally.ability !== this.ability) {
					if (!this.m.innate) {
						this.m.innate = 'ability:' + ally.getAbility().id;
						this.addVolatile(this.m.innate);
					}
					ally.m.innate = 'ability:' + ability.id;
					ally.addVolatile(ally.m.innate);
				}
			}
			// Entrainment
			if (this.m.innate && this.m.innate.endsWith(ability.id)) {
				this.removeVolatile(this.m.innate);
				delete this.m.innate;
			}
			this.abilityOrder = this.battle.abilityOrder++;
			return oldAbility;
		},
		hasAbility(ability) {
			if (this.ignoringAbility()) return false;
			const ownAbility = this.ability;
			const ally = this.side.active.find(mon => mon && mon !== this && !mon.fainted);
			const allyAbility = ally ? ally.ability : "";
			if (!Array.isArray(ability)) {
				if (ownAbility === this.battle.toID(ability) || allyAbility === this.battle.toID(ability)) return true;
			} else {
				 if (ability.map(this.battle.toID).includes(ownAbility) || ability.map(this.battle.toID).includes(allyAbility)) {
					 return true;
				 }
			}
			return false;
		},
		transformInto(pokemon, effect) {
			const species = pokemon.species;
			if (pokemon.fainted || pokemon.illusion || (pokemon.volatiles['substitute'] && this.battle.gen >= 5) ||
				(pokemon.transformed && this.battle.gen >= 2) || (this.transformed && this.battle.gen >= 5) ||
				species.name === 'Eternatus-Eternamax') {
				return false;
			}

			if (this.battle.dex.currentMod === 'gen1stadium' && (
				species.name === 'Ditto' ||
				(this.species.name === 'Ditto' && pokemon.moves.includes('transform'))
			)) {
				return false;
			}

			if (!this.setSpecies(species, effect, true)) return false;

			this.transformed = true;
			this.weighthg = pokemon.weighthg;

			const types = pokemon.getTypes(true);
			this.setType(pokemon.volatiles['roost'] ? pokemon.volatiles['roost'].typeWas : types, true);
			this.addedType = pokemon.addedType;
			this.knownType = this.isAlly(pokemon) && pokemon.knownType;
			this.apparentType = pokemon.apparentType;

			let statName: StatIDExceptHP;
			for (statName in this.storedStats) {
				this.storedStats[statName] = pokemon.storedStats[statName];
				if (this.modifiedStats) this.modifiedStats[statName] = pokemon.modifiedStats![statName]; // Gen 1: Copy modified stats.
			}
			this.moveSlots = [];
			this.set.ivs = (this.battle.gen >= 5 ? this.set.ivs : pokemon.set.ivs);
			this.hpType = (this.battle.gen >= 5 ? this.hpType : pokemon.hpType);
			this.hpPower = (this.battle.gen >= 5 ? this.hpPower : pokemon.hpPower);
			for (const moveSlot of pokemon.moveSlots) {
				let moveName = moveSlot.move;
				if (!pokemon.m.curMoves.includes(moveSlot.id)) continue;
				if (moveSlot.id === 'hiddenpower') {
					moveName = 'Hidden Power ' + this.hpType;
				}
				this.moveSlots.push({
					move: moveName,
					id: moveSlot.id,
					pp: moveSlot.maxpp === 1 ? 1 : 5,
					maxpp: this.battle.gen >= 5 ? (moveSlot.maxpp === 1 ? 1 : 5) : moveSlot.maxpp,
					target: moveSlot.target,
					disabled: false,
					used: false,
					virtual: true,
				});
			}
			this.m.curMoves = pokemon.m.curMoves;
			let boostName: BoostID;
			for (boostName in pokemon.boosts) {
				this.boosts[boostName] = pokemon.boosts[boostName];
			}
			if (this.battle.gen >= 6) {
				const volatilesToCopy = ['focusenergy', 'gmaxchistrike', 'laserfocus'];
				for (const volatile of volatilesToCopy) {
					if (pokemon.volatiles[volatile]) {
						this.addVolatile(volatile);
						if (volatile === 'gmaxchistrike') this.volatiles[volatile].layers = pokemon.volatiles[volatile].layers;
					} else {
						this.removeVolatile(volatile);
					}
				}
			}
			if (effect) {
				this.battle.add('-transform', this, pokemon, '[from] ' + effect.fullname);
			} else {
				this.battle.add('-transform', this, pokemon);
			}
			if (this.battle.gen > 2) this.setAbility(pokemon.ability, this, true);

			// Change formes based on held items (for Transform)
			// Only ever relevant in Generation 4 since Generation 3 didn't have item-based forme changes
			if (this.battle.gen === 4) {
				if (this.species.num === 487) {
					// Giratina formes
					if (this.species.name === 'Giratina' && this.item === 'griseousorb') {
						this.formeChange('Giratina-Origin');
					} else if (this.species.name === 'Giratina-Origin' && this.item !== 'griseousorb') {
						this.formeChange('Giratina');
					}
				}
				if (this.species.num === 493) {
					// Arceus formes
					const item = this.getItem();
					const targetForme = (item?.onPlate ? 'Arceus-' + item.onPlate : 'Arceus');
					if (this.species.name !== targetForme) {
						this.formeChange(targetForme);
					}
				}
			}

			return true;
		},
	},
};
