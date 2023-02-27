import {RESTORATIVE_BERRIES} from "../../../sim/pokemon";

export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	inherit: 'gen9',
	init() {
		for (const id in this.data.Pokedex) {
			const types = Array.from(new Set(this.data.Pokedex[id].types.map(type => (
				type.replace(/(Ghost|Fairy)/g, 'Psychic')
					.replace(/Bug/g, 'Grass')
					.replace(/Ice/g, 'Water')
					.replace(/(Rock|Ground)/g, 'Fighting')
					.replace(/Flying/g, 'Normal')
					.replace(/Poison/g, 'Dark')
			))));
			this.modData('Pokedex', id).types = types;
		}
		for (const id in this.data.Moves) {
			const move = this.data.Moves[id];
			const type = move.type
				.replace(/(Ghost|Fairy)/g, 'Psychic')
				.replace(/Bug/g, 'Grass')
				.replace(/Ice/g, 'Water')
				.replace(/(Rock|Ground)/g, 'Fighting')
				.replace(/Flying/g, 'Normal')
				.replace(/Poison/g, 'Dark');
			this.modData('Moves', id).type = type;
			if (move.ohko === 'Ice') {
				this.modData('Moves', id).ohko = 'Water';
			}
		}
		for (const id in this.data.Items) {
			const item = this.data.Items[id];
			if (item.onPlate) {
				const type = item.onPlate
					.replace(/(Ghost|Fairy)/g, 'Psychic')
					.replace(/Bug/g, 'Grass')
					.replace(/Ice/g, 'Water')
					.replace(/(Rock|Ground)/g, 'Fighting')
					.replace(/Flying/g, 'Normal')
					.replace(/Poison/g, 'Dark');
				this.modData('Items', id).onPlate = type;
			}
			if (item.onDrive) {
				const type = item.onDrive
					.replace(/(Ghost|Fairy)/g, 'Psychic')
					.replace(/Bug/g, 'Grass')
					.replace(/Ice/g, 'Water')
					.replace(/(Rock|Ground)/g, 'Fighting')
					.replace(/Flying/g, 'Normal')
					.replace(/Poison/g, 'Dark');
				this.modData('Items', id).onDrive = type;
			}
			if (item.onMemory) {
				const type = item.onMemory
					.replace(/(Ghost|Fairy)/g, 'Psychic')
					.replace(/Bug/g, 'Grass')
					.replace(/Ice/g, 'Water')
					.replace(/(Rock|Ground)/g, 'Fighting')
					.replace(/Flying/g, 'Normal')
					.replace(/Poison/g, 'Dark');
				this.modData('Items', id).onMemory = type;
			}
			if (item.zMoveType) {
				const type = item.zMoveType
					.replace(/(Ghost|Fairy)/g, 'Psychic')
					.replace(/Bug/g, 'Grass')
					.replace(/Ice/g, 'Water')
					.replace(/(Rock|Ground)/g, 'Fighting')
					.replace(/Flying/g, 'Normal')
					.replace(/Poison/g, 'Dark');
				this.modData('Items', id).zMoveType = type;
			}
			if (item.naturalGift) {
				const type = item.naturalGift.type
					.replace(/(Ghost|Fairy)/g, 'Psychic')
					.replace(/Bug/g, 'Grass')
					.replace(/Ice/g, 'Water')
					.replace(/(Rock|Ground)/g, 'Fighting')
					.replace(/Flying/g, 'Normal')
					.replace(/Poison/g, 'Dark');
				this.modData('Items', id).naturalGift.type = type;
			}
		}
	},
	maybeTriggerEndlessBattleClause(trappedBySide, stalenessBySide) {
		// Gen 1 Endless Battle Clause triggers
		// These are checked before the 100 turn minimum as the battle cannot progress if they are true
		if (this.gen <= 1) {
			const noProgressPossible = this.sides.every(side => {
				const foeAllGhosts = side.foe.pokemon.every(pokemon => pokemon.fainted || pokemon.types.includes('Psychic'));
				const foeAllTransform = side.foe.pokemon.every(pokemon => (
					pokemon.fainted ||
					// true if transforming into this pokemon would lead to an endless battle
					// Transform will fail (depleting PP) if used against Ditto in Stadium 1
					(this.dex.currentMod !== 'gen1stadium' || pokemon.species.id !== 'ditto') &&
					// there are some subtleties such as a Mew with only Transform and auto-fail moves,
					// but it's unlikely to come up in a real game so there's no need to handle it
					pokemon.moves.every(moveid => moveid === 'transform')
				));
				return side.pokemon.every(pokemon => (
					pokemon.fainted ||
					// frozen pokemon can't thaw in gen 1 without outside help
					pokemon.status === 'frz' ||
					// a pokemon can't lose PP if it Transforms into a pokemon with only Transform
					(pokemon.moves.every(moveid => moveid === 'transform') && foeAllTransform) ||
					// Struggle can't damage yourself if every foe is a Ghost
					(pokemon.moveSlots.every(slot => slot.pp === 0) && foeAllGhosts)
				));
			});
			if (noProgressPossible) {
				this.add('-message', `This battle cannot progress. Endless Battle Clause activated!`);
				return this.tie();
			}
		}

		if (this.turn <= 100) return;

		// the turn limit is not a part of Endless Battle Clause
		if (this.turn >= 1000) {
			this.add('message', `It is turn 1000. You have hit the turn limit!`);
			this.tie();
			return true;
		}
		if (
			(this.turn >= 500 && this.turn % 100 === 0) || // every 100 turns past turn 500,
			(this.turn >= 900 && this.turn % 10 === 0) || // every 10 turns past turn 900,
			this.turn >= 990 // every turn past turn 990
		) {
			const turnsLeft = 1000 - this.turn;
			const turnsLeftText = (turnsLeft === 1 ? `1 turn` : `${turnsLeft} turns`);
			this.add('bigerror', `You will auto-tie if the battle doesn't end in ${turnsLeftText} (on turn 1000).`);
		}

		if (!this.ruleTable.has('endlessbattleclause')) return;
		// for now, FFA doesn't support Endless Battle Clause
		if (this.format.gameType === 'freeforall') return;

		// Are all Pokemon on every side stale, with at least one side containing an externally stale Pokemon?
		if (!stalenessBySide.every(s => !!s) || !stalenessBySide.some(s => s === 'external')) return;

		// Can both sides switch to a non-stale Pokemon?
		const canSwitch = [];
		for (const [i, trapped] of trappedBySide.entries()) {
			canSwitch[i] = false;
			if (trapped) break;
			const side = this.sides[i];

			for (const pokemon of side.pokemon) {
				if (!pokemon.fainted && !(pokemon.volatileStaleness || pokemon.staleness)) {
					canSwitch[i] = true;
					break;
				}
			}
		}
		if (canSwitch.every(s => s)) return;

		// Endless Battle Clause activates - we determine the winner by looking at each side's sets.
		const losers: Side[] = [];
		for (const side of this.sides) {
			let berry = false; // Restorative Berry
			let cycle = false; // Harvest or Recycle
			for (const pokemon of side.pokemon) {
				berry = RESTORATIVE_BERRIES.has(toID(pokemon.set.item));
				if (['harvest', 'pickup'].includes(toID(pokemon.set.ability)) ||
					pokemon.set.moves.map(toID).includes('recycle' as ID)) {
					cycle = true;
				}
				if (berry && cycle) break;
			}
			if (berry && cycle) losers.push(side);
		}

		if (losers.length === 1) {
			const loser = losers[0];
			this.add('-message', `${loser.name}'s team started with the rudimentary means to perform restorative berry-cycling and thus loses.`);
			return this.win(loser.foe);
		}
		if (losers.length === this.sides.length) {
			this.add('-message', `Each side's team started with the rudimentary means to perform restorative berry-cycling.`);
		}

		return this.tie();
	},
	pokemon: {
		isGrounded(negateImmunity) {
			if ('gravity' in this.battle.field.pseudoWeather) return true;
			if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
			if ('smackdown' in this.volatiles) return true;
			const item = (this.ignoringItem() ? '' : this.item);
			if (item === 'ironball') return true;
			// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
			if (!negateImmunity && this.hasType('Normal') && !(this.hasType('???') && 'roost' in this.volatiles)) return false;
			if (this.hasAbility('levitate') && !this.battle.suppressingAbility(this)) return null;
			if ('magnetrise' in this.volatiles) return false;
			if ('telekinesis' in this.volatiles) return false;
			return item !== 'airballoon';
		},
		runImmunity(type, message) {
			if (!type || type === '???') return true;
			if (!this.battle.dex.types.isName(type)) {
				throw new Error("Use runStatusImmunity for " + type);
			}
			if (this.fainted) return false;

			const negateImmunity = !this.battle.runEvent('NegateImmunity', this, type);
			const notImmune = type === 'Fighting' ?
				this.isGrounded(negateImmunity) :
				negateImmunity || this.battle.dex.getImmunity(type, this);
			if (notImmune) return true;
			if (!message) return false;
			if (notImmune === null) {
				this.battle.add('-immune', this, '[from] ability: Levitate');
			} else {
				this.battle.add('-immune', this);
			}
			return false;
		},
		getMoves(lockedMove, restrictData) {
			if (lockedMove) {
				lockedMove = this.battle.toID(lockedMove);
				this.trapped = true;
				if (lockedMove === 'recharge') {
					return [{
						move: 'Recharge',
						id: 'recharge',
					}];
				}
				for (const moveSlot of this.moveSlots) {
					if (moveSlot.id !== lockedMove) continue;
					return [{
						move: moveSlot.move,
						id: moveSlot.id,
					}];
				}
				// does this happen?
				return [{
					move: this.battle.dex.moves.get(lockedMove).name,
					id: lockedMove,
				}];
			}
			const moves = [];
			let hasValidMove = false;
			for (const moveSlot of this.moveSlots) {
				let moveName = moveSlot.move;
				if (moveSlot.id === 'hiddenpower') {
					moveName = 'Hidden Power ' + this.hpType;
					if (this.battle.gen < 6) moveName += ' ' + this.hpPower;
				} else if (moveSlot.id === 'return' || moveSlot.id === 'frustration') {
					const basePowerCallback = this.battle.dex.moves.get(moveSlot.id).basePowerCallback as (pokemon: Pokemon) => number;
					moveName += ' ' + basePowerCallback(this);
				}
				let target = moveSlot.target;
				if (moveSlot.id === 'curse') {
					if (!this.hasType('Psychic')) {
						target = this.battle.dex.moves.get('curse').nonGhostTarget || moveSlot.target;
					}
				}
				let disabled = moveSlot.disabled;
				if (this.volatiles['dynamax']) {
					// if each of a Pokemon's base moves are disabled by one of these effects, it will Struggle
					const canCauseStruggle = ['Encore', 'Disable', 'Taunt', 'Assault Vest', 'Belch', 'Stuff Cheeks'];
					disabled = this.maxMoveDisabled(moveSlot.id) || disabled && canCauseStruggle.includes(moveSlot.disabledSource!);
				} else if (
					(moveSlot.pp <= 0 && !this.volatiles['partialtrappinglock']) || disabled &&
					this.side.active.length >= 2 && this.battle.actions.targetTypeChoices(target!)
				) {
					disabled = true;
				}

				if (!disabled) {
					hasValidMove = true;
				} else if (disabled === 'hidden' && restrictData) {
					disabled = false;
				}

				moves.push({
					move: moveName,
					id: moveSlot.id,
					pp: moveSlot.pp,
					maxpp: moveSlot.maxpp,
					target,
					disabled,
				});
			}
			return hasValidMove ? moves : [];
		},
	},
	actions: {
		hitStepInvulnerabilityEvent(targets, pokemon, move) {
			if (move.id === 'helpinghand' || (this.battle.gen >= 8 && move.id === 'toxic' && pokemon.hasType('Dark'))) {
				return new Array(targets.length).fill(true);
			}
			const hitResults = this.battle.runEvent('Invulnerability', targets, pokemon, move);
			for (const [i, target] of targets.entries()) {
				if (hitResults[i] === false) {
					if (move.smartTarget) {
						move.smartTarget = false;
					} else {
						if (!move.spreadHit) this.battle.attrLastMove('[miss]');
						this.battle.add('-miss', pokemon, target);
					}
				}
			}
			return hitResults;
		},
		hitStepAccuracy(targets, pokemon, move) {
			const hitResults = [];
			for (const [i, target] of targets.entries()) {
				this.battle.activeTarget = target;
				// calculate true accuracy
				let accuracy = move.accuracy;
				if (move.ohko) { // bypasses accuracy modifiers
					if (!target.isSemiInvulnerable()) {
						accuracy = 30;
						if (move.ohko === 'Water' && this.battle.gen >= 7 && !pokemon.hasType('Water')) {
							accuracy = 20;
						}
						if (!target.volatiles['dynamax'] && pokemon.level >= target.level &&
							(move.ohko === true || !target.hasType(move.ohko))) {
							accuracy += (pokemon.level - target.level);
						} else {
							this.battle.add('-immune', target, '[ohko]');
							hitResults[i] = false;
							continue;
						}
					}
				} else {
					accuracy = this.battle.runEvent('ModifyAccuracy', target, pokemon, move, accuracy);
					if (accuracy !== true) {
						let boost = 0;
						if (!move.ignoreAccuracy) {
							const boosts = this.battle.runEvent('ModifyBoost', pokemon, null, null, {...pokemon.boosts});
							boost = this.battle.clampIntRange(boosts['accuracy'], -6, 6);
						}
						if (!move.ignoreEvasion) {
							const boosts = this.battle.runEvent('ModifyBoost', target, null, null, {...target.boosts});
							boost = this.battle.clampIntRange(boost - boosts['evasion'], -6, 6);
						}
						if (boost > 0) {
							accuracy = this.battle.trunc(accuracy * (3 + boost) / 3);
						} else if (boost < 0) {
							accuracy = this.battle.trunc(accuracy * 3 / (3 - boost));
						}
					}
				}
				if (move.alwaysHit || (move.id === 'toxic' && this.battle.gen >= 8 && pokemon.hasType('Dark')) ||
						(move.target === 'self' && move.category === 'Status' && !target.isSemiInvulnerable())) {
					accuracy = true; // bypasses ohko accuracy modifiers
				} else {
					accuracy = this.battle.runEvent('Accuracy', target, pokemon, move, accuracy);
				}
				if (accuracy !== true && !this.battle.randomChance(accuracy, 100)) {
					if (move.smartTarget) {
						move.smartTarget = false;
					} else {
						if (!move.spreadHit) this.battle.attrLastMove('[miss]');
						this.battle.add('-miss', pokemon, target);
					}
					if (!move.ohko && pokemon.hasItem('blunderpolicy') && pokemon.useItem()) {
						this.battle.boost({spe: 2}, pokemon);
					}
					hitResults[i] = false;
					continue;
				}
				hitResults[i] = true;
			}
			return hitResults;
		},
		runZPower(move, pokemon) {
			const zPower = this.dex.conditions.get('zpower');
			if (move.category !== 'Status') {
				this.battle.attrLastMove('[zeffect]');
			} else if (move.zMove?.boost) {
				this.battle.boost(move.zMove.boost, pokemon, pokemon, zPower);
			} else if (move.zMove?.effect) {
				switch (move.zMove.effect) {
				case 'heal':
					this.battle.heal(pokemon.maxhp, pokemon, pokemon, zPower);
					break;
				case 'healreplacement':
					pokemon.side.addSlotCondition(pokemon, 'healreplacement', pokemon, move);
					break;
				case 'clearnegativeboost':
					const boosts: SparseBoostsTable = {};
					let i: BoostID;
					for (i in pokemon.boosts) {
						if (pokemon.boosts[i] < 0) {
							boosts[i] = 0;
						}
					}
					pokemon.setBoost(boosts);
					this.battle.add('-clearnegativeboost', pokemon, '[zeffect]');
					break;
				case 'redirect':
					pokemon.addVolatile('followme', pokemon, zPower);
					break;
				case 'crit2':
					pokemon.addVolatile('focusenergy', pokemon, zPower);
					break;
				case 'curse':
					if (pokemon.hasType('Psychic')) {
						this.battle.heal(pokemon.maxhp, pokemon, pokemon, zPower);
					} else {
						this.battle.boost({atk: 1}, pokemon, pokemon, zPower);
					}
				}
			}
		},
	},
};
