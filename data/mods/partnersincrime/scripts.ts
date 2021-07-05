export const Scripts: ModdedBattleScriptsData = {
	gen: 8,
	inherit: 'gen8',
	nextTurn() {
		this.turn++;
		this.lastSuccessfulMoveThisTurn = null;

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
				const ally = side.active.find(mon => mon && mon !== pokemon && !mon.fainted);
				pokemon.moveSlots = pokemon.baseMoveSlots.concat(ally?.baseMoveSlots || []);
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
					ally.m.innate = 'ability:' + ability.id;
					ally.addVolatile(ally.m.innate);
				}
			}
			this.abilityOrder = this.battle.abilityOrder++;
			return oldAbility;
		},
		hasAbility(ability) {
			if (!this.ignoringAbility()) {
				const ownAbility = this.ability;
				return Array.isArray(ability) ?
					ability.map(this.battle.toID).includes(ownAbility) :
					ownAbility === this.battle.toID(ability);
			}
			const ally = this.side.active.find(mon => mon && mon !== this && !mon.fainted);
			if (!ally || ally.ignoringAbility()) return false;
			const allyAbility = ally.ability;
			return Array.isArray(ability) ?
				ability.map(this.battle.toID).includes(allyAbility) :
				allyAbility === this.battle.toID(ability);
		},
	},
};
