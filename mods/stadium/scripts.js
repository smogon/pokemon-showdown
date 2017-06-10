'use strict';

/**
 * Stadium mechanics inherit from gen 1 mechanics, but fixes some stuff.
 */
exports.BattleScripts = {
	inherit: 'gen1',
	gen: 1,
	// BattlePokemon scripts.
	pokemon: {
		// Stadium shares gen 1 code but it fixes some problems with it.
		getStat: function (statName, unmodified) {
			statName = toId(statName);
			if (statName === 'hp') return this.maxhp;
			if (unmodified) return this.stats[statName];
			return this.modifiedStats[statName];
		},
		// Gen 1 function to apply a stat modification that is only active until the stat is recalculated or mon switched.
		// Modified stats are declared in the Pokemon object in sim/pokemon.js in about line 681.
		modifyStat: function (stat, modifier) {
			if (!(stat in this.stats)) return;
			this.modifiedStats[stat] = this.battle.clampIntRange(Math.floor(this.modifiedStats[stat] * modifier), 1);
		},
		// This is run on Stadium after boosts and status changes.
		recalculateStats: function () {
			for (let statName in this.stats) {
				let stat = this.template.baseStats[statName];
				stat = Math.floor(Math.floor(2 * stat + this.set.ivs[statName] + Math.floor(this.set.evs[statName] / 4)) * this.level / 100 + 5);
				this.baseStats[statName] = this.stats[statName] = Math.floor(stat);
				this.modifiedStats[statName] = Math.floor(stat);
				// Re-apply drops, if necessary.
				if (this.status === 'par') this.modifyStat('spe', 0.25);
				if (this.status === 'brn') this.modifyStat('atk', 0.5);
				if (this.boosts[statName] !== 0) {
					if (this.boosts[statName] >= 0) {
						this.modifyStat(statName, [1, 1.5, 2, 2.5, 3, 3.5, 4][this.boosts[statName]]);
					} else {
						this.modifyStat(statName, [100, 66, 50, 40, 33, 28, 25][-this.boosts[statName]] / 100);
					}
				}
			}
		},
		// Stadium's fixed boosting function.
		boostBy: function (boost) {
			let changed = false;
			for (let i in boost) {
				let delta = boost[i];
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
			this.recalculateStats();
			return changed;
		},
	},
	// Battle scripts.
	runMove: function (move, pokemon, targetLoc, sourceEffect) {
		let target = this.getTarget(pokemon, move, targetLoc);
		move = this.getMove(move);
		if (!target) target = this.resolveTarget(pokemon, move);
		if (target.subFainted) delete target.subFainted;

		this.setActiveMove(move, pokemon, target);

		if (pokemon.movedThisTurn || !this.runEvent('BeforeMove', pokemon, target, move)) {
			this.debug('' + pokemon.id + ' move interrupted; movedThisTurn: ' + pokemon.movedThisTurn);
			this.clearActiveMove(true);
			// This is only run for sleep
			this.runEvent('AfterMoveSelf', pokemon, target, move);
			return;
		}
		if (move.beforeMoveCallback) {
			if (move.beforeMoveCallback.call(this, pokemon, target, move)) {
				this.clearActiveMove(true);
				return;
			}
		}
		pokemon.lastDamage = 0;
		let lockedMove = this.runEvent('LockMove', pokemon);
		if (lockedMove === true) lockedMove = false;
		if (!lockedMove && !pokemon.volatiles['partialtrappinglock']) {
			pokemon.deductPP(move, null, target);
		}
		this.useMove(move, pokemon, target, sourceEffect);
		this.singleEvent('AfterMove', move, null, pokemon, target, move);

		// If rival fainted
		if (target.hp <= 0) {
			// We remove screens
			target.side.removeSideCondition('reflect');
			target.side.removeSideCondition('lightscreen');
		} else {
			this.runEvent('AfterMoveSelf', pokemon, target, move);
		}

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
	},
	tryMoveHit: function (target, pokemon, move, spreadHit) {
		let boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];
		let doSelfDestruct = true;
		let damage = 0;

		// First, check if the Pokémon is immune to this move.
		if (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type] && !target.runImmunity(move.type, true)) {
			if (move.selfdestruct) {
				this.faint(pokemon, pokemon, move);
			}
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
				this.add('-immune', target, '[ohko]');
				return false;
			}
		}

		// Calculate true accuracy for gen 1, which uses 0-255.
		if (accuracy !== true) {
			accuracy = Math.floor(accuracy * 255 / 100);
			// Check also for accuracy modifiers.
			if (!move.ignoreAccuracy) {
				if (pokemon.boosts.accuracy > 0) {
					accuracy *= boostTable[pokemon.boosts.accuracy];
				} else {
					accuracy = Math.floor(accuracy / boostTable[-pokemon.boosts.accuracy]);
				}
			}
			if (!move.ignoreEvasion) {
				if (target.boosts.evasion > 0 && !move.ignorePositiveEvasion) {
					accuracy = Math.floor(accuracy / boostTable[target.boosts.evasion]);
				} else if (target.boosts.evasion < 0) {
					accuracy *= boostTable[-target.boosts.evasion];
				}
			}
		}
		accuracy = this.runEvent('Accuracy', target, pokemon, move, accuracy);

		// Stadium fixes the 1/256 accuracy bug.
		if (accuracy !== true && this.random(256) > accuracy) {
			this.attrLastMove('[miss]');
			this.add('-miss', pokemon);
			damage = false;
		}

		// If damage is 0 and not false it means it didn't miss, let's calc.
		if (damage !== false) {
			pokemon.lastDamage = 0;
			if (move.multihit) {
				let hits = move.multihit;
				if (hits.length) {
					// Yes, it's hardcoded... meh
					if (hits[0] === 2 && hits[1] === 5) {
						hits = [2, 2, 3, 3, 4, 5][this.random(6)];
					} else {
						hits = this.random(hits[0], hits[1] + 1);
					}
				}
				hits = Math.floor(hits);
				// In gen 1, all the hits have the same damage for multihits move
				let moveDamage = 0;
				let firstDamage;
				let i;
				for (i = 0; i < hits && target.hp && pokemon.hp; i++) {
					if (i === 0) {
						// First hit, we calculate
						moveDamage = this.moveHit(target, pokemon, move);
						firstDamage = moveDamage;
					} else {
						// We get the previous damage to make it fix damage
						move.damage = firstDamage;
						moveDamage = this.moveHit(target, pokemon, move);
					}
					if (moveDamage === false) break;
					damage = (moveDamage || 0);
					if (target.subFainted) {
						i++;
						break;
					}
				}
				move.damage = null;
				if (i === 0) return true;
				this.add('-hitcount', target, i);
			} else {
				damage = this.moveHit(target, pokemon, move);
			}
		}

		if (move.category !== 'Status') target.gotAttacked(move, damage, pokemon);

		// Checking if substitute fainted
		if (target.subFainted) doSelfDestruct = false;
		if (move.selfdestruct && doSelfDestruct) {
			this.faint(pokemon, pokemon, move);
		}

		// The move missed.
		if (!damage && damage !== 0) {
			// Delete the partial trap lock if necessary.
			delete pokemon.volatiles['partialtrappinglock'];
			return false;
		}

		if (move.ohko) this.add('-ohko');

		if (!move.negateSecondary) {
			this.singleEvent('AfterMoveSecondary', move, null, target, pokemon, move);
			this.runEvent('AfterMoveSecondary', target, pokemon, move);
		}

		return damage;
	},
	moveHit: function (target, pokemon, move, moveData, isSecondary, isSelf) {
		let damage = 0;
		move = this.getMoveCopy(move);

		if (!isSecondary && !isSelf) this.setActiveMove(move, pokemon, target);
		let hitResult = true;
		if (!moveData) moveData = move;

		if (move.ignoreImmunity === undefined) {
			move.ignoreImmunity = (move.category === 'Status');
		}

		if (target) {
			hitResult = this.singleEvent('TryHit', moveData, {}, target, pokemon, move);

			// Partial trapping moves still apply their volatile to Pokémon behind a Sub
			let targetHadSub = (target && target.volatiles['substitute']);
			if (targetHadSub && moveData.volatileStatus && moveData.volatileStatus === 'partiallytrapped') {
				target.addVolatile(moveData.volatileStatus, pokemon, move);
			}

			if (!hitResult) {
				if (hitResult === false) this.add('-fail', target);
				return false;
			}

			// Only run the hit events for the hit itself, not the secondary or self hits
			if (!isSelf && !isSecondary) {
				hitResult = this.runEvent('TryHit', target, pokemon, move);
				if (!hitResult) {
					if (hitResult === false) this.add('-fail', target);
					// Special Substitute hit flag
					if (hitResult !== 0) {
						return false;
					}
				}
				if (!this.runEvent('TryFieldHit', target, pokemon, move)) {
					return false;
				}
			} else if (isSecondary && !moveData.self) {
				hitResult = this.runEvent('TrySecondaryHit', target, pokemon, moveData);
			}

			if (hitResult === 0) {
				target = null;
			} else if (!hitResult) {
				if (hitResult === false) this.add('-fail', target);
				return false;
			}
		}

		if (target) {
			let didSomething = false;

			damage = this.getDamage(pokemon, target, moveData);
			if ((damage || damage === 0) && !target.fainted) {
				if (move.noFaint && damage >= target.hp) {
					damage = target.hp - 1;
				}
				damage = this.damage(damage, target, pokemon, move);
				if (!(damage || damage === 0)) return false;
				didSomething = true;
			} else if (damage === false && typeof hitResult === 'undefined') {
				this.add('-fail', target);
			}
			if (damage === false || damage === null) {
				return false;
			}
			if (moveData.boosts && !target.fainted) {
				this.boost(moveData.boosts, target, pokemon, move);
			}
			if (moveData.heal && !target.fainted) {
				let d = target.heal(Math.floor(target.maxhp * moveData.heal[0] / moveData.heal[1]));
				if (!d) {
					this.add('-fail', target);
					return false;
				}
				this.add('-heal', target, target.getHealth);
				didSomething = true;
			}
			if (moveData.status) {
				if (!target.status) {
					target.setStatus(moveData.status, pokemon, move);
					target.recalculateStats();
				} else if (!isSecondary) {
					if (target.status === moveData.status) {
						this.add('-fail', target, target.status);
					} else {
						this.add('-fail', target);
					}
				}
				didSomething = true;
			}
			if (moveData.forceStatus) {
				if (target.setStatus(moveData.forceStatus, pokemon, move)) {
					target.recalculateStats();
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
				if (this.addPseudoWeather(moveData.pseudoWeather, pokemon, move)) {
					didSomething = true;
				}
			}
			// Hit events
			hitResult = this.singleEvent('Hit', moveData, {}, target, pokemon, move);
			if (!isSelf && !isSecondary) {
				this.runEvent('Hit', target, pokemon, move);
			}
			if (!hitResult && !didSomething) {
				if (hitResult === false) this.add('-fail', target);
				return false;
			}
		}

		// Here's where self effects are applied.
		if (moveData.self) {
			this.moveHit(pokemon, pokemon, move, moveData.self, isSecondary, true);
		}

		// Now we can save the partial trapping damage.
		if (pokemon.volatiles['partialtrappinglock']) {
			pokemon.volatiles['partialtrappinglock'].damage = pokemon.lastDamage;
		}

		// Apply move secondaries.
		if (moveData.secondaries) {
			for (let i = 0; i < moveData.secondaries.length; i++) {
				// We check here whether to negate the probable secondary status if it's para, burn, or freeze.
				// In the game, this is checked and if true, the random number generator is not called.
				// That means that a move that does not share the type of the target can status it.
				// If a move that was not fire-type would exist on Gen 1, it could burn a Pokémon.
				if (!(moveData.secondaries[i].status && moveData.secondaries[i].status in {'par':1, 'brn':1, 'frz':1} && target && target.hasType(move.type))) {
					let effectChance = Math.floor(moveData.secondaries[i].chance * 255 / 100);
					if (typeof moveData.secondaries[i].chance === 'undefined' || this.random(256) < effectChance) {
						this.moveHit(target, pokemon, move, moveData.secondaries[i], true, isSelf);
					}
				}
			}
		}
		if (move.selfSwitch && pokemon.hp) {
			pokemon.switchFlag = move.selfSwitch;
		}

		return damage;
	},
	getDamage: function (pokemon, target, move, suppressMessages) {
		// First of all, we get the move.
		if (typeof move === 'string') move = this.getMove(move);
		if (typeof move === 'number') {
			move = {
				basePower: move,
				type: '???',
				category: 'Physical',
				willCrit: false,
				flags: {},
			};
		}

		// Let's see if the target is immune to the move.
		if (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) {
			if (!target.runImmunity(move.type, true)) {
				return false;
			}
		}

		// Is it an OHKO move?
		if (move.ohko) {
			return target.maxhp;
		}

		// We edit the damage through move's damage callback if necessary.
		if (move.damageCallback) {
			return move.damageCallback.call(this, pokemon, target);
		}

		// We take damage from damage=level moves (seismic toss).
		if (move.damage === 'level') {
			return pokemon.level;
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
		if (pokemon.volatiles['partialtrappinglock'] && (target === pokemon.volatiles['partialtrappinglock'].locked)) {
			return pokemon.volatiles['partialtrappinglock'].damage;
		}

		// We check the category and typing to calculate later on the damage.
		if (!move.category) move.category = 'Physical';
		if (!move.defensiveCategory) move.defensiveCategory = move.category;
		// '???' is typeless damage: used for Struggle and Confusion etc
		if (!move.type) move.type = '???';
		let type = move.type;

		// We get the base power and apply basePowerCallback if necessary.
		let basePower = move.basePower;
		if (move.basePowerCallback) {
			basePower = move.basePowerCallback.call(this, pokemon, target, move);
		}

		// We check if the base power is proper.
		if (!basePower) {
			if (basePower === 0) return; // Returning undefined means not dealing damage
			return basePower;
		}
		basePower = this.clampIntRange(basePower, 1);

		// Checking for the move's Critical Hit possibility. We check if it's a 100% crit move, otherwise we calculate the chance.
		move.crit = move.willCrit || false;
		if (!move.crit) {
			// In Stadium, the critical chance is based on speed.
			// First, we get the base speed and store it. Then we add 76. This is our current crit chance.
			let critChance = pokemon.template.baseStats['spe'] + 76;

			// Now we right logical shift it two places, essentially dividing by 4 and flooring it.
			critChance = critChance >> 2;

			// Now we check for focus energy volatile.
			if (pokemon.volatiles['focusenergy']) {
				// If it exists, crit chance is multiplied by 4 and floored with a logical left shift.
				critChance = critChance << 2;
				// Then we add 160.
				critChance += 160;
			} else {
				// If it is not active, we left shift it by 1.
				critChance = critChance << 1;
			}

			// Now we check for the move's critical hit ratio.
			if (move.critRatio === 2) {
				// High crit ratio, we multiply the result so far by 4.
				critChance = critChance << 2;
			} else if (move.critRatio === 1) {
				// Normal hit ratio, we divide the crit chance by 2 and floor the result again.
				critChance = critChance >> 1;
			}

			// Now we make sure it's a number between 1 and 255.
			critChance = this.clampIntRange(critChance, 1, 255);

			// Last, we check deppending on ratio if the move critical hits or not.
			// We compare our critical hit chance against a random number between 0 and 255.
			// If the random number is lower, we get a critical hit. This means there is always a 1/255 chance of not hitting critically.
			if (critChance > 0) {
				move.crit = (this.random(256) < critChance);
			}
		}
		// There is a critical hit.
		if (move.crit) {
			move.crit = this.runEvent('CriticalHit', target, null, move);
		}

		// Happens after crit calculation.
		if (basePower) {
			basePower = this.runEvent('BasePower', pokemon, target, move, basePower);
			if (move.basePowerModifier) {
				basePower *= move.basePowerModifier;
			}
		}
		if (!basePower) return 0;
		basePower = this.clampIntRange(basePower, 1);

		// We now check attacker's and defender's stats.
		let level = pokemon.level;
		let attacker = pokemon;
		let defender = target;
		if (move.useTargetOffensive) attacker = target;
		if (move.useSourceDefensive) defender = pokemon;
		let atkType = (move.category === 'Physical') ? 'atk' : 'spa';
		let defType = (move.defensiveCategory === 'Physical') ? 'def' : 'spd';
		let attack = attacker.getStat(atkType);
		let defense = defender.getStat(defType);
		// In gen 1, screen effect is applied here.
		if ((defType === 'def' && defender.volatiles['reflect']) || (defType === 'spd' && defender.volatiles['lightscreen'])) {
			this.debug('Screen doubling (Sp)Def');
			defense *= 2;
			defense = this.clampIntRange(defense, 1, 1998);
		}

		// In the event of a critical hit, the ofense and defense changes are ignored.
		// This includes both boosts and screens.
		// Also, level is doubled in damage calculation.
		if (move.crit) {
			move.ignoreOffensive = true;
			move.ignoreDefensive = true;
			level *= 2;
			if (!suppressMessages) this.add('-crit', target);
		}
		if (move.ignoreOffensive) {
			this.debug('Negating (sp)atk boost/penalty.');
			attack = attacker.getStat(atkType, true);
		}
		if (move.ignoreDefensive) {
			this.debug('Negating (sp)def boost/penalty.');
			defense = target.getStat(defType, true);
		}

		// When either attack or defense are higher than 256, they are both divided by 4 and moded by 256.
		// This is what cuases the roll over bugs.
		if (attack >= 256 || defense >= 256) {
			attack = this.clampIntRange(Math.floor(attack / 4) % 256, 1);
			// Defense isn't checked on the cartridge, but we don't want those / 0 bugs on the sim.
			defense = this.clampIntRange(Math.floor(defense / 4) % 256, 1);
		}

		// Self destruct moves halve defense at this point.
		if (move.selfdestruct && defType === 'def') {
			defense = this.clampIntRange(Math.floor(defense / 2), 1);
		}

		// Let's go with the calculation now that we have what we need.
		// We do it step by step just like the game does.
		let damage = level * 2;
		damage = Math.floor(damage / 5);
		damage += 2;
		damage *= basePower;
		damage *= attack;
		damage = Math.floor(damage / defense);
		damage = this.clampIntRange(Math.floor(damage / 50), 1, 997);
		damage += 2;

		// STAB damage bonus, the "???" type never gets STAB
		if (type !== '???' && pokemon.hasType(type)) {
			damage += Math.floor(damage / 2);
		}

		// Type effectiveness.
		// The order here is not correct, must change to check the move versus each type.
		let totalTypeMod = this.getEffectiveness(type, target);
		// Super effective attack
		if (totalTypeMod > 0) {
			if (!suppressMessages) this.add('-supereffective', target);
			damage *= 20;
			damage = Math.floor(damage / 10);
			if (totalTypeMod >= 2) {
				damage *= 20;
				damage = Math.floor(damage / 10);
			}
		}
		if (totalTypeMod < 0) {
			if (!suppressMessages) this.add('-resisted', target);
			damage *= 5;
			damage = Math.floor(damage / 10);
			if (totalTypeMod <= -2) {
				damage *= 5;
				damage = Math.floor(damage / 10);
			}
		}

		// If damage becomes 0, the move is made to miss.
		// This occurs when damage was either 2 or 3 prior to applying STAB/Type matchup, and target is 4x resistant to the move.
		if (damage === 0) return damage;

		// Apply random factor is damage is greater than 1
		if (damage > 1) {
			damage *= this.random(217, 256);
			damage = Math.floor(damage / 255);
			if (damage > target.hp && !target.volatiles['substitute']) damage = target.hp;
			if (target.volatiles['substitute'] && damage > target.volatiles['substitute'].hp) damage = target.volatiles['substitute'].hp;
		}

		// We are done, this is the final damage.
		return Math.floor(damage);
	},
	damage: function (damage, target, source, effect) {
		if (this.event) {
			if (!target) target = this.event.target;
			if (!source) source = this.event.source;
			if (!effect) effect = this.effect;
		}
		if (!target || !target.hp) return 0;
		effect = this.getEffect(effect);
		if (!(damage || damage === 0)) return damage;
		if (damage !== 0) damage = this.clampIntRange(damage, 1);

		if (effect.id !== 'struggle-recoil') { // Struggle recoil is not affected by effects
			damage = this.runEvent('Damage', target, source, effect, damage);
			if (!(damage || damage === 0)) {
				this.debug('damage event failed');
				return damage;
			}
		}
		if (damage !== 0) damage = this.clampIntRange(damage, 1);
		target.battle.lastDamage = damage;
		damage = target.damage(damage, source, effect);
		if (source) source.lastDamage = damage;
		let name = effect.fullname;
		if (name === 'tox') name = 'psn';
		switch (effect.id) {
		case 'partiallytrapped':
			this.add('-damage', target, target.getHealth, '[from] ' + this.effectData.sourceEffect.fullname, '[partiallytrapped]');
			break;
		default:
			if (effect.effectType === 'Move') {
				this.add('-damage', target, target.getHealth);
			} else if (source && source !== target) {
				this.add('-damage', target, target.getHealth, '[from] ' + effect.fullname, '[of] ' + source);
			} else {
				this.add('-damage', target, target.getHealth, '[from] ' + name);
			}
			break;
		}

		// In Stadium, recoil doesn't happen if you faint an opponent.
		if (effect.recoil && source && target && target.hp > 0) {
			this.damage(this.clampIntRange(Math.floor(damage * effect.recoil[0] / effect.recoil[1]), 1), source, target, 'recoil');
		}
		if (effect.drain && source) {
			this.heal(this.clampIntRange(Math.floor(damage * effect.drain[0] / effect.drain[1]), 1), source, target, 'drain');
		}

		if (target.fainted) {
			this.faint(target);
		} else {
			damage = this.runEvent('AfterDamage', target, source, effect, damage);
		}

		return damage;
	},
	directDamage: function (damage, target, source, effect) {
		if (this.event) {
			if (!target) target = this.event.target;
			if (!source) source = this.event.source;
			if (!effect) effect = this.effect;
		}
		if (!target || !target.hp) return 0;
		if (!damage) return 0;
		damage = this.clampIntRange(damage, 1);
		damage = target.damage(damage, source, effect);
		// Now we sent the proper -damage.
		switch (effect.id) {
		case 'strugglerecoil':
			this.add('-damage', target, target.getHealth, '[from] recoil');
			break;
		case 'confusion':
			this.add('-damage', target, target.getHealth, '[from] confusion');
			break;
		default:
			this.add('-damage', target, target.getHealth);
			break;
		}
		if (target.fainted) this.faint(target);

		return damage;
	},
};
