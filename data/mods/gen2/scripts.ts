/**
 * Gen 2 scripts.
 */

export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen3',
	gen: 2,
	pokemon: {
		inherit: true,
		getStat(statName, unboosted, unmodified, fastReturn) {
			// @ts-expect-error type checking prevents 'hp' from being passed, but we're paranoid
			if (statName === 'hp') throw new Error("Please read `maxhp` directly");

			// base stat
			let stat = this.storedStats[statName];

			// Stat boosts.
			if (!unboosted) {
				let boost = this.boosts[statName];
				if (boost > 6) boost = 6;
				if (boost < -6) boost = -6;
				if (boost >= 0) {
					const boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
					stat = Math.floor(stat * boostTable[boost]);
				} else {
					const numerators = [100, 66, 50, 40, 33, 28, 25];
					stat = Math.floor(stat * numerators[-boost] / 100);
				}
			}

			if (this.status === 'par' && statName === 'spe') {
				stat = Math.floor(stat / 4);
			}

			if (!unmodified) {
				// Burn attack drop is checked when you get the attack stat upon switch in and used until switch out.
				if (this.status === 'brn' && statName === 'atk') {
					stat = Math.floor(stat / 2);
				}
			}

			// Gen 2 caps stats at 999 and min is 1.
			stat = this.battle.clampIntRange(stat, 1, 999);
			if (fastReturn) return stat;

			// Screens
			if (!unboosted) {
				if (
					(statName === 'def' && this.side.sideConditions['reflect']) ||
					(statName === 'spd' && this.side.sideConditions['lightscreen'])
				) {
					stat *= 2;
				}
			}

			// Handle boosting items
			if (
				(['Cubone', 'Marowak'].includes(this.baseSpecies.name) && this.item === 'thickclub' && statName === 'atk') ||
				(this.baseSpecies.name === 'Pikachu' && this.item === 'lightball' && statName === 'spa')
			) {
				stat *= 2;
			} else if (this.baseSpecies.name === 'Ditto' && this.item === 'metalpowder' && ['def', 'spd'].includes(statName)) {
				stat = Math.floor(stat * 1.5);
			}

			return stat;
		},
		boostBy(boost) {
			let delta = 0;
			let i: BoostID;
			for (i in boost) {
				delta = boost[i]!;
				if (delta > 0 && this.getStat(i as StatIDExceptHP, false, true) === 999) {
					delta = 0;
					continue;
				}
				this.boosts[i] += delta;
				if (this.boosts[i] > 6) {
					delta -= this.boosts[i] - 6;
					this.boosts[i] = 6;
				}
				if (this.boosts[i] < -6) {
					delta -= this.boosts[i] - (-6);
					this.boosts[i] = -6;
				}
			}
			return delta;
		},
	},
	actions: {
		inherit: true,
		runMove(moveOrMoveName, pokemon, targetLoc, options) {
			let move = this.dex.getActiveMove(moveOrMoveName);
			let defender = this.battle.getTarget(pokemon, move, targetLoc);
			if (!options?.sourceEffect && move.id !== 'struggle') {
				const changedMove = this.battle.runEvent('OverrideAction', pokemon, defender, move);
				if (changedMove && changedMove !== true) {
					move = this.dex.getActiveMove(changedMove);
					defender = this.battle.getRandomTarget(pokemon, move);
				}
			}
			if (!defender && defender !== false) defender = this.battle.getRandomTarget(pokemon, move);

			this.battle.setActiveMove(move, pokemon, defender);

			if (pokemon.moveThisTurn) {
				// THIS IS PURELY A SANITY CHECK
				// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
				// USE this.battle.queue.cancelMove INSTEAD
				this.battle.debug(`${pokemon.fullname} INCONSISTENT STATE, ALREADY MOVED: ${pokemon.moveThisTurn as DebugOutput}`);
				this.battle.clearActiveMove(true);
				return;
			}
			if (!this.battle.runEvent('BeforeMove', pokemon, defender, move)) {
				this.battle.runEvent('MoveAborted', pokemon, defender, move);
				this.battle.clearActiveMove(true);
				// This is only run for sleep and fully paralysed.
				this.battle.runEvent('AfterMoveSelf', pokemon, defender, move);
				return;
			}
			if (move.beforeMoveCallback) {
				if (move.beforeMoveCallback.call(this.battle, pokemon, defender, move)) {
					this.battle.clearActiveMove(true);
					return;
				}
			}
			pokemon.lastDamage = 0;
			const lockedMove = pokemon.getLockedMove() || pokemon.getSemiLockedMove();
			if (!lockedMove) {
				if (!pokemon.deductPP(move, null, defender) && (move.id !== 'struggle')) {
					this.battle.add('cant', pokemon, 'nopp', move);
					this.battle.clearActiveMove(true);
					return;
				}
			}
			pokemon.moveUsed(move);
			this.battle.actions.useMove(move, pokemon, { defender, sourceEffect: options?.sourceEffect });
			this.battle.singleEvent('AfterMove', move, null, pokemon, defender, move);
			if (!move.selfSwitch && pokemon.side.foe.active[0].hp) this.battle.runEvent('AfterMoveSelf', pokemon, defender, move);
		},
		tryMoveHit(defender, pokemon, move) {
			const positiveBoostTable = [1, 1.33, 1.66, 2, 2.33, 2.66, 3];
			const negativeBoostTable = [1, 0.75, 0.6, 0.5, 0.43, 0.36, 0.33];
			const doSelfDestruct = true;
			let damage: number | false | undefined = 0;

			if (move.selfdestruct && doSelfDestruct) {
				this.battle.faint(pokemon, pokemon, move);
			}

			let hitResult = this.battle.singleEvent('PrepareHit', move, {}, defender, pokemon, move);
			if (!hitResult) {
				if (hitResult === false) this.battle.add('-fail', defender);
				return false;
			}
			this.battle.runEvent('PrepareHit', pokemon, defender, move);

			if (!this.battle.singleEvent('Try', move, null, pokemon, defender, move)) {
				return false;
			}

			if (move.defender === 'all' || move.defender === 'foeSide' || move.defender === 'allySide' || move.defender === 'allyTeam') {
				if (move.defender === 'all') {
					hitResult = this.battle.runEvent('TryHitField', defender, pokemon, move);
				} else {
					hitResult = this.battle.runEvent('TryHitSide', defender, pokemon, move);
				}
				if (!hitResult) {
					if (hitResult === false) {
						this.battle.add('-fail', pokemon);
						this.battle.attrLastMove('[still]');
					}
					return false;
				}
				return this.moveHit(defender, pokemon, move);
			}

			hitResult = this.battle.runEvent('Invulnerability', defender, pokemon, move);
			if (hitResult === false) {
				this.battle.attrLastMove('[miss]');
				this.battle.add('-miss', pokemon);
				return false;
			}

			if (move.ignoreImmunity === undefined) {
				move.ignoreImmunity = (move.category === 'Status');
			}

			if (!defender.runImmunity(move, true)) {
				return false;
			}

			hitResult = this.battle.singleEvent('TryImmunity', move, {}, defender, pokemon, move);
			if (hitResult === false) {
				this.battle.add('-immune', defender);
				return false;
			}

			hitResult = this.battle.runEvent('TryHit', defender, pokemon, move);
			if (!hitResult) {
				if (hitResult === false) this.battle.add('-fail', defender);
				return false;
			}

			if (move.ohko && pokemon.level < defender.level) {
				this.battle.add('-immune', defender, '[ohko]');
				return false;
			}

			let accuracy = move.accuracy;
			if (move.alwaysHit) {
				accuracy = true;
			} else {
				accuracy = this.battle.runEvent('Accuracy', defender, pokemon, move, accuracy);
			}
			// Now, let's calculate the accuracy.
			if (accuracy !== true) {
				accuracy = Math.floor(accuracy * 255 / 100);
				if (move.ohko) {
					accuracy += (pokemon.level - defender.level) * 2;
					accuracy = Math.min(accuracy, 255);
				}
				if (!move.ignoreAccuracy) {
					if (pokemon.boosts.accuracy > 0) {
						accuracy *= positiveBoostTable[pokemon.boosts.accuracy];
					} else {
						accuracy *= negativeBoostTable[-pokemon.boosts.accuracy];
					}
				}
				if (!move.ignoreEvasion) {
					if (defender.boosts.evasion > 0 && !move.ignorePositiveEvasion) {
						accuracy *= negativeBoostTable[defender.boosts.evasion];
					} else if (defender.boosts.evasion < 0) {
						accuracy *= positiveBoostTable[-defender.boosts.evasion];
					}
				}
				accuracy = Math.min(Math.floor(accuracy), 255);
				accuracy = Math.max(accuracy, 1);
			} else {
				accuracy = this.battle.runEvent('Accuracy', defender, pokemon, move, accuracy);
			}
			accuracy = this.battle.runEvent('ModifyAccuracy', defender, pokemon, move, accuracy);
			if (accuracy !== true) accuracy = Math.max(accuracy, 0);
			if (move.alwaysHit) {
				accuracy = true;
			} else {
				accuracy = this.battle.runEvent('Accuracy', defender, pokemon, move, accuracy);
			}
			if (accuracy !== true && accuracy !== 255 && !this.battle.randomChance(accuracy, 256)) {
				this.battle.attrLastMove('[miss]');
				this.battle.add('-miss', pokemon);
				damage = false;
				return damage;
			}
			move.totalDamage = 0;
			pokemon.lastDamage = 0;
			if (move.multihit) {
				let hits = move.multihit;
				if (Array.isArray(hits)) {
					if (hits[0] === 2 && hits[1] === 5) {
						hits = this.battle.sample([2, 2, 2, 3, 3, 3, 4, 5]);
					} else {
						hits = this.battle.random(hits[0], hits[1] + 1);
					}
				}
				hits = Math.floor(hits);
				let nullDamage = true;
				let moveDamage: number | undefined | false;

				const isSleepUsable = move.sleepUsable || this.dex.moves.get(move.sourceEffect).sleepUsable;
				let i: number;
				for (i = 0; i < hits && defender.hp && pokemon.hp; i++) {
					if (pokemon.status === 'slp' && !isSleepUsable) break;
					move.hit = i + 1;
					move.lastHit = move.hit === hits;
					moveDamage = this.moveHit(defender, pokemon, move);
					if (moveDamage === false) break;
					if (nullDamage && (moveDamage || moveDamage === 0 || moveDamage === undefined)) nullDamage = false;
					damage = (moveDamage || 0);
					move.totalDamage += damage;
					this.battle.eachEvent('Update');
				}
				if (i === 0) return 1;
				if (nullDamage) damage = false;
				this.battle.add('-hitcount', defender, i);
			} else {
				damage = this.moveHit(defender, pokemon, move);
				move.totalDamage = damage;
			}
			if (move.category !== 'Status') {
				defender.gotAttacked(move, damage, pokemon);
			}
			if (move.ohko) this.battle.add('-ohko');

			this.battle.singleEvent('AfterMoveSecondary', move, null, defender, pokemon, move);
			this.battle.runEvent('AfterMoveSecondary', defender, pokemon, move);

			if (move.totalDamage) {
				this.applyRecoilDamage(move.totalDamage, move, pokemon);
			}
			return damage;
		},
		moveHit(defender, pokemon, move, moveData, isSecondary, isSelf) {
			let damage: number | false | null | undefined = undefined;
			move = this.dex.getActiveMove(move);

			if (!moveData) moveData = move;
			let hitResult: boolean | number | null = true;

			if (move.defender === 'all' && !isSelf) {
				hitResult = this.battle.singleEvent('TryHitField', moveData, {}, defender, pokemon, move);
			} else if ((move.defender === 'foeSide' || move.defender === 'allySide') && !isSelf) {
				hitResult = this.battle.singleEvent('TryHitSide', moveData, {}, (defender ? defender.side : null), pokemon, move);
			} else if (defender) {
				hitResult = this.battle.singleEvent('TryHit', moveData, {}, defender, pokemon, move);
			}
			if (!hitResult) {
				if (hitResult === false) this.battle.add('-fail', defender);
				return false;
			}

			if (defender && !isSecondary && !isSelf) {
				hitResult = this.battle.runEvent('TryPrimaryHit', defender, pokemon, moveData);
				if (hitResult === 0) {
					// special Substitute flag
					hitResult = true;
					defender = null;
				}
			}
			if (defender && isSecondary && !moveData.self) {
				hitResult = true;
			}
			if (!hitResult) {
				return false;
			}

			if (defender) {
				let didSomething: boolean | number | null = false;
				damage = this.getDamage(pokemon, defender, moveData);

				if ((damage || damage === 0) && !defender.fainted) {
					damage = this.battle.damage(damage, defender, pokemon, move);
					if (!(damage || damage === 0)) {
						this.battle.debug('damage interrupted');
						return false;
					}
					didSomething = true;
				}
				if (damage === false || damage === null) {
					if (damage === false && !isSecondary && !isSelf) {
						this.battle.add('-fail', defender);
					}
					this.battle.debug('damage calculation interrupted');
					return false;
				}

				if (moveData.boosts && !defender.fainted) {
					if (
						defender === pokemon.volatiles['lockon']?.attacker &&
						defender.isSemiInvulnerable() && !isSelf
					) {
						if (!isSecondary) this.battle.add('-fail', defender);
						return false;
					}
					hitResult = this.battle.boost(moveData.boosts, defender, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (moveData.heal && !defender.fainted) {
					const d = defender.heal(Math.round(defender.maxhp * moveData.heal[0] / moveData.heal[1]));
					if (!d && d !== 0) {
						this.battle.add('-fail', defender);
						this.battle.debug('heal interrupted');
						return false;
					}
					this.battle.add('-heal', defender, defender.getHealth);
					didSomething = true;
				}
				if (moveData.status) {
					hitResult = defender.trySetStatus(moveData.status, pokemon, move);
					if (!hitResult && move.status) return hitResult;
					didSomething = didSomething || hitResult;
				}
				if (moveData.forceStatus) {
					hitResult = defender.setStatus(moveData.forceStatus, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (moveData.volatileStatus) {
					hitResult = defender.addVolatile(moveData.volatileStatus, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (moveData.sideCondition) {
					hitResult = defender.side.addSideCondition(moveData.sideCondition, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (moveData.weather) {
					hitResult = this.battle.field.setWeather(moveData.weather, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (moveData.pseudoWeather) {
					hitResult = this.battle.field.addPseudoWeather(moveData.pseudoWeather, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (moveData.forceSwitch) {
					if (this.battle.canSwitch(defender.side)) didSomething = true; // at least defer the fail message to later
				}
				if (moveData.selfSwitch) {
					if (this.battle.canSwitch(pokemon.side)) didSomething = true; // at least defer the fail message to later
				}
				// Hit events
				//   These are like the TryHit events, except we don't need a FieldHit event.
				//   Scroll up for the TryHit event documentation, and just ignore the "Try" part. ;)
				hitResult = null;
				if (move.defender === 'all' && !isSelf) {
					if (moveData.onHitField) hitResult = this.battle.singleEvent('HitField', moveData, {}, defender, pokemon, move);
				} else if ((move.defender === 'foeSide' || move.defender === 'allySide') && !isSelf) {
					if (moveData.onHitSide) hitResult = this.battle.singleEvent('HitSide', moveData, {}, defender.side, pokemon, move);
				} else {
					if (moveData.onHit) hitResult = this.battle.singleEvent('Hit', moveData, {}, defender, pokemon, move);
					if (!isSelf && !isSecondary) {
						this.battle.runEvent('Hit', defender, pokemon, move);
					}
					if (moveData.onAfterHit) hitResult = this.battle.singleEvent('AfterHit', moveData, {}, defender, pokemon, move);
				}

				if (!hitResult && !didSomething && !moveData.self && !moveData.selfdestruct) {
					if (!isSelf && !isSecondary) {
						if (hitResult === false || didSomething === false) this.battle.add('-fail', defender);
					}
					this.battle.debug('move failed because it did nothing');
					return false;
				}
			}
			if (moveData.self) {
				// This is done solely to mimic in-game RNG behaviour. All self drops have a 100% chance of happening but still grab a random number.
				if (!isSecondary && moveData.self.boosts) this.battle.random(100);
				this.moveHit(pokemon, pokemon, move, moveData.self, isSecondary, true);
			}
			// Secondary effects don't happen if the defender faints from the attack
			if (defender?.hp && moveData.secondaries && this.battle.runEvent('TrySecondaryHit', defender, pokemon, moveData)) {
				for (const secondary of moveData.secondaries) {
					// We check here whether to negate the probable secondary status if it's burn or freeze.
					// In the game, this is checked and if true, the random number generator is not called.
					// That means that a move that does not share the type of the defender can status it.
					// This means tri-attack can burn fire-types and freeze ice-types.
					// Unlike gen 1, though, paralysis works for all unless the defender is immune to direct move (ie. ground-types and t-wave).
					if (secondary.status && ['brn', 'frz'].includes(secondary.status) && defender.hasType(move.type)) {
						this.battle.debug('Target immune to [' + secondary.status + ']');
						continue;
					}
					// A sleeping or frozen defender cannot be flinched in Gen 2; King's Rock is exempt
					if (secondary.volatileStatus === 'flinch' && ['slp', 'frz'].includes(defender.status) && !secondary.kingsrock) {
						this.battle.debug('Cannot flinch a sleeping or frozen defender');
						continue;
					}
					// Multi-hit moves only roll for status once
					if (!move.multihit || move.lastHit) {
						const effectChance = Math.floor((secondary.chance || 100) * 255 / 100);
						if (typeof secondary.chance === 'undefined' || this.battle.randomChance(effectChance, 256)) {
							this.moveHit(defender, pokemon, move, secondary, true, isSelf);
						} else if (effectChance === 255) {
							this.battle.hint("In Gen 2, moves with a 100% secondary effect chance will not trigger in 1/256 uses.");
						}
					}
				}
			}
			if (defender && defender.hp > 0 && pokemon.hp > 0 && moveData.forceSwitch && this.battle.canSwitch(defender.side)) {
				hitResult = this.battle.runEvent('DragOut', defender, pokemon, move);
				if (hitResult) {
					this.dragIn(defender.side, defender.position);
				} else if (hitResult === false) {
					this.battle.add('-fail', defender);
				}
			}
			if (move.selfSwitch && pokemon.hp && !pokemon.volatiles['commanded'] &&
				(this.battle.canSwitch(pokemon.side) || move.id === 'revivalblessing')) {
				pokemon.switchFlag = move.id;
			}
			return damage;
		},
		getDamage(attacker, defender, move, suppressMessages) {
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
				} as unknown as ActiveMove;
			}

			// Let's test for immunities.
			if (!defender.runImmunity(move, true)) {
				return false;
			}

			// Is it an OHKO move?
			if (move.ohko) {
				return defender.maxhp;
			}

			// We edit the damage through move's damage callback
			if (move.damageCallback) {
				return move.damageCallback.call(this.battle, attacker, defender);
			}

			// We take damage from damage=level moves
			if (move.damage === 'level') {
				return attacker.level;
			}

			// If there's a fix move damage, we run it
			if (move.damage) {
				return move.damage;
			}

			// We check the category and typing to calculate later on the damage
			move.category = this.battle.getCategory(move);
			// '???' is typeless damage: used for Struggle and Confusion etc
			if (!move.type) move.type = '???';
			const type = move.type;

			// We get the base power and apply basePowerCallback if necessary
			let basePower: number | false | null | undefined = move.basePower;
			if (move.basePowerCallback) {
				basePower = move.basePowerCallback.call(this.battle, attacker, defender, move);
			}

			// We check for Base Power
			if (!basePower) {
				if (basePower === 0) return; // Returning undefined means not dealing damage
				return basePower;
			}
			basePower = this.battle.clampIntRange(basePower, 1);

			// Checking for the move's Critical Hit ratio
			let critRatio = this.battle.runEvent('ModifyCritRatio', attacker, defender, move, move.critRatio || 0);
			critRatio = this.battle.clampIntRange(critRatio, 0, 5);
			const critMult = [0, 17, 32, 64, 85, 128];
			let isCrit = move.willCrit || false;
			if (typeof move.willCrit === 'undefined') {
				if (critRatio) {
					isCrit = this.battle.random(256) < critMult[critRatio];
				}
			}

			if (isCrit && this.battle.runEvent('CriticalHit', defender, null, move)) {
				defender.getMoveHitData(move).crit = true;
			}

			// Happens after crit calculation
			if (basePower) {
				// confusion damage
				if (move.isConfusionSelfHit) {
					move.type = move.baseMoveType!;
					basePower = this.battle.runEvent('BasePower', attacker, defender, move, basePower, true);
					move.type = '???';
				} else {
					basePower = this.battle.runEvent('BasePower', attacker, defender, move, basePower, true);
				}
				if (basePower && move.basePowerModifier) {
					basePower *= move.basePowerModifier;
				}
			}
			if (!basePower) return 0;
			basePower = this.battle.clampIntRange(basePower, 1);

			// We now check for attacker and defender
			let level = attacker.level;

			// Using Beat Up
			if (move.allies) {
				this.battle.add('-activate', attacker, 'move: Beat Up', '[of] ' + move.allies[0].name);
				level = move.allies[0].level;
			}

			const attacker = move.overrideOffensivePokemon === 'defender' ? defender : attacker;
			const defender = move.overrideDefensivePokemon === 'attacker' ? attacker : defender;

			const isPhysical = move.category === 'Physical';
			const atkType: StatIDExceptHP = move.overrideOffensiveStat || (isPhysical ? 'atk' : 'spa');
			const defType: StatIDExceptHP = move.overrideDefensiveStat || (isPhysical ? 'def' : 'spd');

			let unboosted = false;
			let noburndrop = false;

			if (isCrit) {
				if (!suppressMessages) this.battle.add('-crit', defender);
				// Stat level modifications are ignored if they are neutral to or favour the defender.
				// Reflect and Light Screen defensive boosts are only ignored if stat level modifications were also ignored as a result of that.
				if (attacker.boosts[atkType] <= defender.boosts[defType]) {
					unboosted = true;
					noburndrop = true;
				}
			}

			let attack = attacker.getStat(atkType, unboosted, noburndrop);
			let defense = defender.getStat(defType, unboosted);

			// Using Beat Up
			if (move.allies) {
				attack = move.allies[0].species.baseStats.atk;
				move.allies.shift();
				defense = defender.species.baseStats.def;
			}

			// Moves that ignore offense and defense respectively.
			if (move.ignoreOffensive) {
				this.battle.debug('Negating (sp)atk boost/penalty.');
				// The attack drop from the burn is only applied when attacker's attack level is higher than defender's defense level.
				attack = attacker.getStat(atkType, true, true);
			}

			if (move.ignoreDefensive) {
				this.battle.debug('Negating (sp)def boost/penalty.');
				defense = defender.getStat(defType, true, true);
			}

			if (move.id === 'present') {
				const typeIndexes: { [k: string]: number } = {
					Normal: 0, Fighting: 1, Flying: 2, Poison: 3, Ground: 4, Rock: 5, Bug: 7, Ghost: 8, Steel: 9,
					Fire: 20, Water: 21, Grass: 22, Electric: 23, Psychic: 24, Ice: 25, Dragon: 26, Dark: 27,
				};
				attack = 10;

				const attackerLastType = attacker.getTypes().slice(-1)[0];
				const defenderLastType = defender.getTypes().slice(-1)[0];

				defense = typeIndexes[attackerLastType] || 1;
				level = typeIndexes[defenderLastType] || 1;
				this.battle.hint("Gen 2 Present has a glitched damage calculation using the secondary types of the Pokemon for the Attacker's Level and Defender's Defense.", true);
			}

			// When either attack or defense are higher than 256, they are both divided by 4 and modded by 256.
			// This is what causes the rollover bugs.
			if (attack >= 256 || defense >= 256) {
				if (attack >= 1024 || defense >= 1024) {
					this.battle.hint("In Gen 2, a stat will roll over to a small number if it is larger than 1024.");
				}
				attack = this.battle.clampIntRange(this.battle.trunc(Math.floor(attack / 4), 8), 1);
				defense = this.battle.clampIntRange(this.battle.trunc(Math.floor(defense / 4), 8), 1);
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
			damage = Math.floor(damage / 50);
			if (isCrit) damage *= 2;
			damage = Math.floor(this.battle.runEvent('ModifyDamage', attacker, defender, move, damage));
			damage = this.battle.clampIntRange(damage, 1, 997);
			damage += 2;

			// Weather modifiers
			if (
				(type === 'Water' && this.battle.field.isWeather('raindance')) ||
				(type === 'Fire' && this.battle.field.isWeather('sunnyday'))
			) {
				damage = Math.floor(damage * 1.5);
			} else if (
				((type === 'Fire' || move.id === 'solarbeam') && this.battle.field.isWeather('raindance')) ||
				(type === 'Water' && this.battle.field.isWeather('sunnyday'))
			) {
				damage = Math.floor(damage / 2);
			}

			// STAB damage bonus, the "???" type never gets STAB
			if (type !== '???' && attacker.hasType(type)) {
				damage += Math.floor(damage / 2);
			}

			// Type effectiveness
			const totalTypeMod = defender.runEffectiveness(move);
			// Super effective attack
			if (totalTypeMod > 0) {
				if (!suppressMessages) this.battle.add('-supereffective', defender);
				damage *= 2;
				if (totalTypeMod >= 2) {
					damage *= 2;
				}
			}
			// Resisted attack
			if (totalTypeMod < 0) {
				if (!suppressMessages) this.battle.add('-resisted', defender);
				damage = Math.floor(damage / 2);
				if (totalTypeMod <= -2) {
					damage = Math.floor(damage / 2);
				}
			}

			// Apply random factor if damage is greater than 1, except for Flail and Reversal
			if (!move.noDamageVariance && damage > 1) {
				damage *= this.battle.random(217, 256);
				damage = Math.floor(damage / 255);
			}

			// If damage is less than 1, we return 1
			if (basePower && !Math.floor(damage)) {
				return 1;
			}

			// We are done, this is the final damage
			return damage;
		},
	},
};
