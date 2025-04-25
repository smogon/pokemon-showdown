/**
 * Stadium mechanics inherit from gen 1 mechanics, but fixes some stuff.
 */

const SKIP_LASTDAMAGE = new Set([
	'confuseray', 'conversion', 'counter', 'focusenergy', 'glare', 'haze', 'leechseed', 'lightscreen',
	'mimic', 'mist', 'poisongas', 'poisonpowder', 'recover', 'reflect', 'rest', 'softboiled',
	'splash', 'stunspore', 'substitute', 'supersonic', 'teleport', 'thunderwave', 'toxic', 'transform',
]);

export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen1',
	gen: 1,
	// BattlePokemon scripts. Stadium shares gen 1 code but it fixes some problems with it.
	pokemon: {
		inherit: true,
		// This is run on Stadium after boosts and status changes.
		recalculateStats() {
			let statName: StatIDExceptHP;
			for (statName in this.storedStats) {
				let stat = this.species.baseStats[statName];
				stat = Math.floor(
					Math.floor(
						2 * stat + this.set.ivs[statName] + Math.floor(this.set.evs[statName] / 4)
					) * this.level / 100 + 5
				);
				this.baseStoredStats[statName] = this.storedStats[statName] = Math.floor(stat);
				this.modifiedStats![statName] = Math.floor(stat);
				// Re-apply drops, if necessary.
				if (this.status === 'par' && statName === 'spe') this.modifyStat!('spe', 0.25);
				if (this.status === 'brn' && statName === 'atk') this.modifyStat!('atk', 0.5);
				if (this.boosts[statName] !== 0) {
					if (this.boosts[statName] >= 0) {
						this.modifyStat!(statName, [1, 1.5, 2, 2.5, 3, 3.5, 4][this.boosts[statName]]);
					} else {
						this.modifyStat!(statName, [100, 66, 50, 40, 33, 28, 25][-this.boosts[statName]] / 100);
					}
				}
				if (this.modifiedStats![statName] > 999) {
					this.modifiedStats![statName] = 999;
				}
			}
		},
		// Stadium's fixed boosting function.
		boostBy(boost) {
			let changed = false;
			let i: BoostID;
			for (i in boost) {
				let delta = boost[i];
				if (delta === undefined) continue;
				this.boosts[i] += delta;
				if (this.boosts[i] > 6) {
					delta -= this.boosts[i] - 6;
					this.boosts[i] = 6;
				}
				if (this.boosts[i] < -6) {
					delta -= this.boosts[i] - (-6);
					this.boosts[i] = -6;
				}
				if (delta) changed = true;
			}
			this.recalculateStats!();
			return changed;
		},
		// Remove stat recalculation logic from gen 1
		clearBoosts() {
			let i: BoostID;
			for (i in this.boosts) {
				this.boosts[i] = 0;
			}
		},
	},
	actions: {
		inherit: true,
		runMove(moveOrMoveName, pokemon, targetLoc, options) {
			let sourceEffect = options?.sourceEffect;
			const move = this.dex.getActiveMove(moveOrMoveName);
			const target = this.battle.getTarget(pokemon, move, targetLoc);
			if (target?.subFainted) target.subFainted = null;

			this.battle.setActiveMove(move, pokemon, target);

			if (pokemon.moveThisTurn || !this.battle.runEvent('BeforeMove', pokemon, target, move)) {
				this.battle.debug(`${pokemon.fullname} move interrupted; movedThisTurn: ${pokemon.moveThisTurn}`);
				this.battle.clearActiveMove(true);
				// This is only run for sleep
				this.battle.runEvent('AfterMoveSelf', pokemon, target, move);
				return;
			}
			if (move.beforeMoveCallback) {
				if (move.beforeMoveCallback.call(this.battle, pokemon, target, move)) {
					this.battle.clearActiveMove(true);
					return;
				}
			}
			let lockedMove = this.battle.runEvent('LockMove', pokemon);
			if (lockedMove === true) lockedMove = false;
			if (
				!lockedMove &&
				(!pokemon.volatiles['partialtrappinglock'] || pokemon.volatiles['partialtrappinglock'].locked !== target)
			) {
				pokemon.deductPP(move, null, target);
			} else {
				sourceEffect = move;
			}
			this.battle.actions.useMove(move, pokemon, { target, sourceEffect });
		},
		// This function deals with AfterMoveSelf events.
		// This leads with partial trapping moves shenanigans after the move has been used.
		useMove(moveOrMoveName, pokemon, options) {
			let sourceEffect = options?.sourceEffect;
			let target = options?.target;
			const moveResult = this.useMoveInner(moveOrMoveName, pokemon, { target, sourceEffect });

			if (!sourceEffect && this.battle.effect.id) sourceEffect = this.battle.effect;
			const baseMove = this.battle.dex.moves.get(moveOrMoveName);
			let move = this.battle.dex.getActiveMove(baseMove);
			if (target === undefined) target = this.battle.getRandomTarget(pokemon, move);
			if (move.target === 'self') {
				target = pokemon;
			}
			if (sourceEffect) move.sourceEffect = sourceEffect.id;

			this.battle.singleEvent('ModifyMove', move, null, pokemon, target, move, move);
			if (baseMove.target !== move.target) {
				// Target changed in ModifyMove, so we must adjust it here
				target = this.battle.getRandomTarget(pokemon, move);
			}
			move = this.battle.runEvent('ModifyMove', pokemon, target, move, move);
			if (baseMove.target !== move.target) {
				// Check again, this shouldn't ever happen on Gen 1.
				target = this.battle.getRandomTarget(pokemon, move);
			}

			if (move.id !== 'metronome') {
				if (move.id !== 'mirrormove' ||
					(!pokemon.side.foe.active[0]?.lastMove || pokemon.side.foe.active[0].lastMove?.id === 'mirrormove')) {
					// The move is our 'final' move (a failed Mirror Move, or any move that isn't Metronome or Mirror Move).
					pokemon.side.lastMove = move;
					pokemon.lastMove = move;
					this.battle.singleEvent('AfterMove', move, null, pokemon, target, move);

					// If target fainted
					if (target && target.hp <= 0) {
						delete pokemon.volatiles['partialtrappinglock'];
					} else {
						this.battle.runEvent('AfterMoveSelf', pokemon, target, move);
					}
					if (pokemon.volatiles['mustrecharge']) this.battle.add('-mustrecharge', pokemon);

					// For partial trapping moves, we are saving the target.
					if (move.volatileStatus === 'partiallytrapped' && target && target.hp > 0) {
						// It hit, so let's remove must recharge volatile. Yup, this happens on Stadium.
						target.removeVolatile('mustrecharge');
						// Let's check if the lock exists
						if (pokemon.volatiles['partialtrappinglock'] && target.volatiles['partiallytrapped']) {
							// Here the partialtrappinglock volatile has been already applied
							if (!pokemon.volatiles['partialtrappinglock'].locked) {
								// If it's the first hit, we save the target
								pokemon.volatiles['partialtrappinglock'].locked = target;
							}
						} // If we move to here, the move failed and there's no partial trapping lock
					}
				}
			}
			return moveResult;
		},
		// This is the function that actually uses the move, running ModifyMove events.
		// It uses the move and then deals with the effects after the move.
		useMoveInner(moveOrMoveName, pokemon, options) {
			let sourceEffect = options?.sourceEffect;
			let target = options?.target;
			if (!sourceEffect && this.battle.effect.id) sourceEffect = this.battle.effect;
			const baseMove = this.battle.dex.moves.get(moveOrMoveName);
			let move = this.battle.dex.getActiveMove(baseMove);
			if (target === undefined) target = this.battle.getRandomTarget(pokemon, move);
			if (move.target === 'self') {
				target = pokemon;
			}
			if (sourceEffect) move.sourceEffect = sourceEffect.id;

			this.battle.setActiveMove(move, pokemon, target);

			this.battle.singleEvent('ModifyMove', move, null, pokemon, target, move, move);
			if (baseMove.target !== move.target) {
				// Target changed in ModifyMove, so we must adjust it here
				target = this.battle.getRandomTarget(pokemon, move);
			}
			move = this.battle.runEvent('ModifyMove', pokemon, target, move, move);
			if (baseMove.target !== move.target) {
				// Check again, this shouldn't ever happen on Gen 1.
				target = this.battle.getRandomTarget(pokemon, move);
				this.battle.debug('not a gen 1 mechanic');
			}
			if (!move) return false;

			let attrs = '';
			if (pokemon.fainted) {
				return false;
			}

			if (sourceEffect) attrs += `|[from]${this.battle.dex.conditions.get(sourceEffect)}`;
			this.battle.addMove('move', pokemon, move.name, `${target}${attrs}`);

			if (!this.battle.singleEvent('Try', move, null, pokemon, target, move)) {
				return true;
			}
			if (!this.battle.singleEvent('TryMove', move, null, pokemon, target, move) ||
				!this.battle.runEvent('TryMove', pokemon, target, move)) {
				return true;
			}

			if (move.ignoreImmunity === undefined) {
				move.ignoreImmunity = (move.category === 'Status');
			}

			let damage: number | undefined | false | '' = false;
			if (!target || target.fainted) {
				this.battle.attrLastMove('[notarget]');
				this.battle.add('-notarget');
				return true;
			}
			// Store 0 damage for last damage if the move is not in the array.
			if (!SKIP_LASTDAMAGE.has(move.id)) this.battle.lastDamage = 0;

			damage = this.tryMoveHit(target, pokemon, move);

			// Go ahead with results of the used move.
			if (damage === false) {
				this.battle.singleEvent('MoveFail', move, null, target, pokemon, move);
				return true;
			}

			if (!move.negateSecondary) {
				this.battle.singleEvent('AfterMoveSecondarySelf', move, null, pokemon, target, move);
				this.battle.runEvent('AfterMoveSecondarySelf', pokemon, target, move);
			}
			return true;
		},
		tryMoveHit(target, pokemon, move) {
			let damage: number | false | undefined = 0;

			// First, check if the target is semi-invulnerable
			let hitResult = this.battle.runEvent('Invulnerability', target, pokemon, move);
			if (hitResult === false) {
				this.battle.attrLastMove('[miss]');
				this.battle.add('-miss', pokemon);
				if (move.selfdestruct) {
					this.battle.faint(pokemon, pokemon, move);
				}
				return false;
			}

			// Then, check if the Pokemon is immune to this move.
			if (
				(!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) &&
				!target.runImmunity(move.type, true)
			) {
				if (move.selfdestruct) {
					this.battle.faint(pokemon, pokemon, move);
				}
				return false;
			}
			hitResult = this.battle.singleEvent('TryImmunity', move, null, target, pokemon, move);
			if (hitResult === false) {
				this.battle.add('-immune', target);
				return false;
			}

			// Now, let's calculate the accuracy.
			let accuracy = move.accuracy;

			// Partial trapping moves: true accuracy while it lasts
			if (pokemon.volatiles['partialtrappinglock']) {
				if (move.volatileStatus === 'partiallytrapped' && target === pokemon.volatiles['partialtrappinglock'].locked) {
					accuracy = true;
				} else if (pokemon.volatiles['partialtrappinglock'].locked !== target) {
					// The target switched, therefor, you fail using wrap.
					delete pokemon.volatiles['partialtrappinglock'];
					return false;
				}
			}

			// OHKO moves only have a chance to hit if the user is at least as fast as the target
			if (move.ohko) {
				if (target.speed > pokemon.speed) {
					this.battle.add('-immune', target, '[ohko]');
					return false;
				}
			}

			// Calculate true accuracy for gen 1, which uses 0-255.
			// Stadium uses the Gen 2 boost table for accuracy and evasiveness, except for 1/3 instead of 0.33
			const boostTable = [1 / 3, 0.36, 0.43, 0.5, 0.66, 0.75, 1, 1.33, 1.66, 2, 2.33, 2.66, 3];
			if (accuracy !== true) {
				accuracy = Math.floor(accuracy * 255 / 100);
				// Check also for accuracy modifiers.
				if (!move.ignoreAccuracy) {
					accuracy = Math.floor(accuracy * boostTable[pokemon.boosts.accuracy + 6]);
				}
				if (!move.ignoreEvasion) {
					accuracy = Math.floor(accuracy * boostTable[-target.boosts.evasion + 6]);
				}
				accuracy = Math.min(accuracy, 255);
			}
			accuracy = this.battle.runEvent('Accuracy', target, pokemon, move, accuracy);

			// Stadium fixes the 1/256 accuracy bug.
			if (accuracy !== true && !this.battle.randomChance(accuracy + 1, 256)) {
				this.battle.attrLastMove('[miss]');
				this.battle.add('-miss', pokemon);
				damage = false;
				this.battle.lastDamage = 0;
			}

			// If damage is 0 and not false it means it didn't miss, let's calc.
			if (damage !== false) {
				if (move.multihit) {
					let hits = move.multihit;
					if (Array.isArray(hits)) {
						// Yes, it's hardcoded... meh
						if (hits[0] === 2 && hits[1] === 5) {
							hits = this.battle.sample([2, 2, 2, 3, 3, 3, 4, 5]);
						} else {
							hits = this.battle.random(hits[0], hits[1] + 1);
						}
					}
					hits = Math.floor(hits);
					// In gen 1, all the hits have the same damage for multihits move
					let moveDamage: number | false | undefined = 0;
					let i: number;
					for (i = 0; i < hits && target.hp && pokemon.hp; i++) {
						move.hit = i + 1;
						if (move.hit === hits) move.lastHit = true;
						moveDamage = this.moveHit(target, pokemon, move);
						if (moveDamage === false) break;
						damage = (moveDamage || 0);
						// Move damage is fixed to be the first move's damage
						if (i === 0) move.damage = damage;
						if (target.subFainted) {
							i++;
							break;
						}
					}
					move.damage = null;
					if (i === 0) return 1;
					this.battle.add('-hitcount', target, i);
				} else {
					damage = this.moveHit(target, pokemon, move);
				}
			}

			if (move.category !== 'Status') target.gotAttacked(move, damage, pokemon);

			if (move.selfdestruct) {
				this.battle.faint(pokemon, pokemon, move);
			}

			// The move missed.
			if (damage === false) {
				// Delete the partial trap lock if necessary.
				delete pokemon.volatiles['partialtrappinglock'];
				return false;
			}

			if (move.ohko) this.battle.add('-ohko');

			if (!move.negateSecondary) {
				this.battle.singleEvent('AfterMoveSecondary', move, null, target, pokemon, move);
				this.battle.runEvent('AfterMoveSecondary', target, pokemon, move);
			}

			return damage;
		},
		moveHit(target, pokemon, moveOrMoveName, moveData, isSecondary, isSelf) {
			let damage: number | false | null | undefined = 0;
			const move = this.dex.getActiveMove(moveOrMoveName);

			if (!isSecondary && !isSelf) this.battle.setActiveMove(move, pokemon, target);
			let hitResult: number | boolean = true;
			if (!moveData) moveData = move;

			if (move.ignoreImmunity === undefined) {
				move.ignoreImmunity = (move.category === 'Status');
			}

			if (target) {
				hitResult = this.battle.singleEvent('TryHit', moveData, {}, target, pokemon, move);

				// Partial trapping moves still apply their volatile to Pokémon behind a Sub
				const targetHadSub = !!target.volatiles['substitute'];
				if (targetHadSub && moveData.volatileStatus && moveData.volatileStatus === 'partiallytrapped') {
					target.addVolatile(moveData.volatileStatus, pokemon, move);
					if (!pokemon.volatiles['partialtrappinglock'] || pokemon.volatiles['partialtrappinglock'].duration! > 1) {
						target.volatiles[moveData.volatileStatus].duration = 2;
					}
				}

				if (!hitResult) {
					if (hitResult === false) this.battle.add('-fail', target);
					return false;
				}

				// Only run the hit events for the hit itself, not the secondary or self hits
				if (!isSelf && !isSecondary) {
					hitResult = this.battle.runEvent('TryHit', target, pokemon, move);
					if (!hitResult) {
						if (hitResult === false) this.battle.add('-fail', target);
						// Special Substitute hit flag
						if (hitResult !== 0) {
							return false;
						}
					}
					if (!this.battle.runEvent('TryFieldHit', target, pokemon, move)) {
						return false;
					}
				} else if (isSecondary && !moveData.self) {
					hitResult = this.battle.runEvent('TrySecondaryHit', target, pokemon, moveData);
				}

				if (hitResult === 0) {
					target = null;
				} else if (!hitResult) {
					if (hitResult === false) this.battle.add('-fail', target);
					return false;
				}
			}

			if (target) {
				let didSomething = false;

				damage = this.getDamage(pokemon, target, moveData);
				if (damage && damage > target.hp) {
					damage = target.hp;
				}
				if ((damage || damage === 0) && !target.fainted) {
					damage = this.battle.damage(damage, target, pokemon, move);
					if (!(damage || damage === 0)) return false;
					didSomething = true;
				} else if (damage === false && typeof hitResult === 'undefined') {
					this.battle.add('-fail', target);
				}
				if (damage === false || damage === null) {
					return false;
				}
				if (moveData.boosts && !target.fainted) {
					this.battle.boost(moveData.boosts, target, pokemon, move);
				}
				if (moveData.heal && !target.fainted) {
					const d = target.heal(Math.floor(target.maxhp * moveData.heal[0] / moveData.heal[1]));
					if (!d) {
						this.battle.add('-fail', target);
						return false;
					}
					this.battle.add('-heal', target, target.getHealth);
					didSomething = true;
				}
				if (moveData.status) {
					if (!target.status) {
						target.setStatus(moveData.status, pokemon, move);
						target.recalculateStats!();
					} else if (!isSecondary) {
						if (target.status === moveData.status) {
							this.battle.add('-fail', target, target.status);
						} else {
							this.battle.add('-fail', target);
						}
					}
					didSomething = true;
				}
				if (moveData.forceStatus) {
					if (target.setStatus(moveData.forceStatus, pokemon, move)) {
						target.recalculateStats!();
						didSomething = true;
					}
				}
				if (moveData.volatileStatus) {
					if (target.addVolatile(moveData.volatileStatus, pokemon, move)) {
						didSomething = true;
					}
				}
				if (moveData.sideCondition) {
					if (target.side.addSideCondition(moveData.sideCondition, pokemon, move)) {
						didSomething = true;
					}
				}
				if (moveData.pseudoWeather) {
					if (this.battle.field.addPseudoWeather(moveData.pseudoWeather, pokemon, move)) {
						didSomething = true;
					}
				}
				// Hit events
				hitResult = this.battle.singleEvent('Hit', moveData, {}, target, pokemon, move);
				if (!isSelf && !isSecondary) {
					this.battle.runEvent('Hit', target, pokemon, move);
				}
				if (!hitResult && !didSomething) {
					if (hitResult === false) this.battle.add('-fail', target);
					return false;
				}
			}

			// Here's where self effects are applied.
			if (moveData.self) {
				this.moveHit(pokemon, pokemon, move, moveData.self, isSecondary, true);
			}

			// Now we can save the partial trapping damage.
			if (pokemon.volatiles['partialtrappinglock']) {
				pokemon.volatiles['partialtrappinglock'].damage = this.battle.lastDamage;
			}

			// Apply move secondaries.
			if (moveData.secondaries && target && target.hp > 0) {
				for (const secondary of moveData.secondaries) {
					// Multi-hit moves only roll for status once
					if (!move.multihit || move.lastHit) {
						// We check here whether to negate the probable secondary status if it's para, burn, or freeze.
						// In the game, this is checked and if true, the random number generator is not called.
						// That means that a move that does not share the type of the target can status it.
						// If a move that was not fire-type would exist on Gen 1, it could burn a Pokémon.
						if (!(secondary.status && ['par', 'brn', 'frz'].includes(secondary.status) && target.hasType(move.type))) {
							const effectChance = Math.floor((secondary.chance || 100) * 255 / 100);
							if (typeof secondary.chance === 'undefined' || this.battle.randomChance(effectChance + 1, 256)) {
								this.moveHit(target, pokemon, move, secondary, true, isSelf);
							}
						}
					}
				}
			}
			if (move.selfSwitch && pokemon.hp) {
				pokemon.switchFlag = move.selfSwitch === true ? true : this.dex.toID(move.selfSwitch);
			}

			return damage;
		},
		getDamage(source, target, move, suppressMessages) {
			// First of all, we get the move.
			if (typeof move === 'string') {
				move = this.dex.getActiveMove(move);
			} else if (typeof move === 'number') {
				move = {
					basePower: move,
					type: '???',
					category: 'Physical',
					willCrit: false,
					flags: {},
				} as ActiveMove;
			}

			// Let's see if the target is immune to the move.
			if (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) {
				if (!target.runImmunity(move.type, true)) {
					return false;
				}
			}

			// Is it an OHKO move?
			if (move.ohko) {
				return 65535;
			}

			// We edit the damage through move's damage callback if necessary.
			if (move.damageCallback) {
				return move.damageCallback.call(this.battle, source, target);
			}

			// We take damage from damage=level moves (seismic toss).
			if (move.damage === 'level') {
				return source.level;
			}

			// If there's a fix move damage, we return that.
			if (move.damage) {
				return move.damage;
			}

			// If it's the first hit on a Normal-type partially trap move, it hits Ghosts anyways but damage is 0.
			if (move.volatileStatus === 'partiallytrapped' && move.type === 'Normal' && target.hasType('Ghost')) {
				return 0;
			}

			// Let's check if we are in middle of a partial trap sequence to return the previous damage.
			if (source.volatiles['partialtrappinglock'] && (target === source.volatiles['partialtrappinglock'].locked)) {
				return source.volatiles['partialtrappinglock'].damage;
			}

			// We check the category and typing to calculate later on the damage.
			if (!move.category) move.category = 'Physical';
			// '???' is typeless damage: used for Struggle and Confusion etc
			if (!move.type) move.type = '???';
			const type = move.type;

			// We get the base power and apply basePowerCallback if necessary.
			let basePower: number | false | null = move.basePower;
			if (move.basePowerCallback) {
				basePower = move.basePowerCallback.call(this.battle, source, target, move);
			}
			if (!basePower) {
				return basePower === 0 ? undefined : basePower;
			}
			basePower = this.battle.clampIntRange(basePower, 1);

			// Checking for the move's Critical Hit possibility. We check if it's a 100% crit move, otherwise we calculate the chance.
			let isCrit = move.willCrit || false;
			if (!isCrit) {
				// In Stadium, the critical chance is based on speed.
				// First, we get the base speed and store it. Then we add 76. This is our current crit chance.
				let critChance = source.species.baseStats['spe'] + 76;

				// Now we right logical shift it two places, essentially dividing by 4 and flooring it.
				critChance >>= 2;

				// Now we check for focus energy volatile.
				if (source.volatiles['focusenergy']) {
					// If it exists, crit chance is multiplied by 4 and floored with a logical left shift.
					critChance <<= 2;
					// Then we add 160.
					critChance += 160;
				} else {
					// If it is not active, we left shift it by 1.
					critChance <<= 1;
				}

				// Now we check for the move's critical hit ratio.
				if (move.critRatio === 2) {
					// High crit ratio, we multiply the result so far by 4.
					critChance <<= 2;
				} else if (move.critRatio === 1) {
					// Normal hit ratio, we divide the crit chance by 2 and floor the result again.
					critChance >>= 1;
				}

				// Now we make sure it's a number between 1 and 255.
				critChance = this.battle.clampIntRange(critChance, 1, 255);

				// Last, we check deppending on ratio if the move critical hits or not.
				// We compare our critical hit chance against a random number between 0 and 255.
				// If the random number is lower, we get a critical hit. This means there is always a 1/255 chance of not hitting critically.
				if (critChance > 0) {
					isCrit = this.battle.randomChance(critChance, 256);
				}
			}
			// There is a critical hit.
			if (isCrit && this.battle.runEvent('CriticalHit', target, null, move)) {
				target.getMoveHitData(move).crit = true;
			}

			// Happens after crit calculation.
			if (basePower) {
				basePower = this.battle.runEvent('BasePower', source, target, move, basePower);
				if (basePower && move.basePowerModifier) {
					basePower *= move.basePowerModifier;
				}
			}
			if (!basePower) return 0;
			basePower = this.battle.clampIntRange(basePower, 1);

			// We now check attacker's and defender's stats.
			let level = source.level;
			const attacker = move.overrideOffensivePokemon === 'target' ? target : source;
			const defender = move.overrideDefensivePokemon === 'source' ? source : target;

			const isPhysical = move.category === 'Physical';
			const atkType: StatIDExceptHP = move.overrideOffensiveStat || (isPhysical ? 'atk' : 'spa');
			const defType: StatIDExceptHP = move.overrideDefensiveStat || (isPhysical ? 'def' : 'spd');

			let attack = attacker.getStat(atkType);
			let defense = defender.getStat(defType);

			// In gen 1, screen effect is applied here.
			if ((defType === 'def' && defender.volatiles['reflect']) || (defType === 'spd' && defender.volatiles['lightscreen'])) {
				this.battle.debug('Screen doubling (Sp)Def');
				defense *= 2;
				defense = this.battle.clampIntRange(defense, 1, 1998);
			}

			// In the event of a critical hit, the offense and defense changes are ignored.
			// This includes both boosts and screens.
			// Also, level is doubled in damage calculation.
			if (isCrit) {
				move.ignoreOffensive = true;
				move.ignoreDefensive = true;
				level *= 2;
				if (!suppressMessages) this.battle.add('-crit', target);
			}

			if (move.ignoreOffensive) {
				this.battle.debug('Negating (sp)atk boost/penalty.');
				attack = attacker.getStat(atkType, true);
			}

			if (move.ignoreDefensive) {
				this.battle.debug('Negating (sp)def boost/penalty.');
				defense = target.getStat(defType, true);
			}

			// When either attack or defense are higher than 256, they are both divided by 4 and moded by 256.
			// This is what causes the rollover bugs.
			if (attack >= 256 || defense >= 256) {
				attack = this.battle.clampIntRange(Math.floor(attack / 4) % 256, 1);
				// Defense isn't checked on the cartridge, but we don't want those / 0 bugs on the sim.
				defense = this.battle.clampIntRange(Math.floor(defense / 4) % 256, 1);
			}

			// Self destruct moves halve defense at this point.
			if (move.selfdestruct && defType === 'def') {
				defense = this.battle.clampIntRange(Math.floor(defense / 2), 1);
			}

			// Let's go with the calculation now that we have what we need.
			// We do it step by step just like the game does.
			let damage = level * 2;
			damage = Math.floor(damage / 5);
			damage += 2;
			damage *= basePower;
			damage *= attack;
			damage = Math.floor(damage / defense);
			damage = this.battle.clampIntRange(Math.floor(damage / 50), 0, 997);
			damage += 2;

			// STAB damage bonus, the "???" type never gets STAB
			if (type !== '???' && source.hasType(type)) {
				damage += Math.floor(damage / 2);
			}

			// Type effectiveness.
			// In Gen 1, type effectiveness is applied against each of the target's types.
			for (const targetType of target.types) {
				const typeMod = this.battle.dex.getEffectiveness(type, targetType);
				if (typeMod > 0) {
					// Super effective against targetType
					damage *= 20;
					damage = Math.floor(damage / 10);
				}
				if (typeMod < 0) {
					// Not very effective against targetType
					damage *= 5;
					damage = Math.floor(damage / 10);
				}
			}
			const totalTypeMod = target.runEffectiveness(move);
			if (totalTypeMod > 0) {
				if (!suppressMessages) this.battle.add('-supereffective', target);
			}
			if (totalTypeMod < 0) {
				if (!suppressMessages) this.battle.add('-resisted', target);
			}

			// If damage becomes 0, the move is made to miss.
			// This occurs when damage was either 2 or 3 prior to applying STAB/Type matchup, and target is 4x resistant to the move.
			if (damage === 0) return damage;

			// Apply random factor if damage is greater than 1
			if (damage > 1) {
				damage *= this.battle.random(217, 256);
				damage = Math.floor(damage / 255);
			}

			// We are done, this is the final damage.
			return Math.floor(damage);
		},
	},
};
