/**
 * Gen 1 mechanics were fairly different, so we need to make a lot of changes to battle.js
 * using this.
 */
exports.BattleScripts = {
	inherit: 'gen2',
	gen: 1,
	debug: function (activity) {
		if (this.getFormat().debug) {
			this.add('debug', activity);
		}
	},
	// Gen 1 stores the last damage dealt by a move in the battle.
	lastDamage: 0,
	// BattleSide scripts.
	// In gen 1, last move information is stored on the side rather than on the active Pokémon.
	side: {
		lastMove: ''
	},
	// BattlePokemon scripts.
	pokemon: {
		getStat: function (statName, unboosted, unmodified) {
			statName = toId(statName);
			if (statName === 'hp') return this.maxhp;

			// base stat
			var stat = this.stats[statName];

			// stat boosts
			if (!unboosted) {
				var boost = this.boosts[statName];
				if (boost > 6) boost = 6;
				if (boost < -6) boost = -6;
				if (boost >= 0) {
					var boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
					stat = Math.floor(stat * boostTable[boost]);
				} else {
					var numerators = [100, 66, 50, 40, 33, 28, 25];
					stat = Math.floor(stat * numerators[-boost] / 100);
				}
			}

			// Stat modifier effects
			if (!unmodified) {
				var statTable = {atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe'};
				var statMod = 1;
				statMod = this.battle.runEvent('Modify' + statTable[statName], this, null, null, statMod);
				stat = this.battle.modify(stat, statMod);
				// Burn attack drop is checked when you get the attack stat upon switch in and used until switch out.
				if (this.volatiles['brnattackdrop'] && statName === 'atk') {
					stat = this.battle.clampIntRange(Math.floor(stat / 2), 1);
				}
				if (this.volatiles['parspeeddrop'] && statName === 'spe') {
					stat = this.battle.clampIntRange(Math.floor(stat / 4), 1);
				}
			}

			// Hard coded Reflect and Light Screen boosts
			if (this.volatiles['reflect'] && statName === 'def' && !unboosted) {
				this.battle.debug('Reflect doubles Defense');
				stat *= 2;
				stat = this.battle.clampIntRange(stat, 1, 1998);
			} else if (this.volatiles['lightscreen'] && statName === 'spd' && !unboosted) {
				this.battle.debug('Light Screen doubles Special Defense');
				stat *= 2;
				stat = this.battle.clampIntRange(stat, 1, 1998);
			} else {
				// Gen 1 normally caps stats at 999 and min is 1.
				stat = this.battle.clampIntRange(stat, 1, 999);
			}

			return stat;
		}
	},
	// Battle scripts.
	// We need to override addQueue just to save the last used move.
	addQueue: function (decision, noSort, side) {
		if (decision) {
			if (Array.isArray(decision)) {
				for (var i = 0; i < decision.length; i++) {
					this.addQueue(decision[i], noSort);
				}
				return;
			}
			if (!decision.side && side) decision.side = side;
			if (!decision.side && decision.pokemon) decision.side = decision.pokemon.side;
			if (!decision.choice && decision.move) decision.choice = 'move';
			if (!decision.priority) {
				var priorities = {
					'beforeTurn': 100,
					'beforeTurnMove': 99,
					'switch': 6,
					'runSwitch': 6.1,
					'residual': -100,
					'team': 102,
					'start': 101
				};
				if (priorities[decision.choice]) {
					decision.priority = priorities[decision.choice];
				}
			}
			if (decision.choice === 'move') {
				// On gen 1 moves are stored when they are chosen.
				decision.side.lastMove = decision.move;
				decision.pokemon.lastMove = decision.move;
				if (this.getMove(decision.move).beforeTurnCallback) {
					this.addQueue({choice: 'beforeTurnMove', pokemon: decision.pokemon, move: decision.move, targetLoc: decision.targetLoc}, true);
				}
			} else if (decision.choice === 'switch') {
				if (decision.pokemon.switchFlag && decision.pokemon.switchFlag !== true) {
					decision.pokemon.switchCopyFlag = decision.pokemon.switchFlag;
				}
				decision.pokemon.switchFlag = false;
				if (!decision.speed && decision.pokemon && decision.pokemon.isActive) decision.speed = decision.pokemon.speed;
			}
			if (decision.move) {
				var target;

				if (!decision.targetPosition) {
					target = this.resolveTarget(decision.pokemon, decision.move);
					decision.targetSide = target.side;
					decision.targetPosition = target.position;
				}

				decision.move = this.getMoveCopy(decision.move);
				if (!decision.priority) decision.priority = decision.move.priority;
			}
			if (!decision.pokemon && !decision.speed) decision.speed = 1;
			if (!decision.speed && decision.choice === 'switch' && decision.target) decision.speed = decision.target.speed;
			if (!decision.speed) decision.speed = decision.pokemon.speed;

			if (decision.choice === 'switch' && !decision.side.pokemon[0].isActive) {
				// if there's no actives, switches happen before activations
				decision.priority = 6.2;
			}
			this.queue.push(decision);
		}
		if (!noSort) this.queue.sort(this.comparePriority);
	},
	runMove: function (move, pokemon, target, sourceEffect) {
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
		var lockedMove = this.runEvent('LockMove', pokemon);
		if (lockedMove === true) lockedMove = false;
		if (!lockedMove && !pokemon.volatiles['partialtrappinglock']) {
			pokemon.deductPP(move, null, target);
		}
		this.useMove(move, pokemon, target, sourceEffect);
		this.runEvent('AfterMove', target, pokemon, move);
		this.runEvent('AfterMoveSelf', pokemon, target, move);

		// If rival fainted
		if (target.hp <= 0) {
			// We remove recharge
			if (pokemon.volatiles['mustrecharge']) pokemon.removeVolatile('mustrecharge');
			// We remove screens
			target.side.removeSideCondition('reflect');
			target.side.removeSideCondition('lightscreen');
		}

		// For partial trapping moves, we are saving the target
		if (move.volatileStatus === 'partiallytrapped' && target && target.hp > 0) {
			// Let's check if the lock exists
			if (pokemon.volatiles['partialtrappinglock'] && target.volatiles['partiallytrapped']) {
				// Here the partialtrappinglock volatile has been already applied
				if (!pokemon.volatiles['partialtrappinglock'].locked) {
					// If it's the first hit, we save the target
					pokemon.volatiles['partialtrappinglock'].locked = target;
				} else {
					if (pokemon.volatiles['partialtrappinglock'].locked !== target && target !== pokemon) {
						// The target switched, therefor, we must re-roll the duration
						var duration = [2, 2, 2, 3, 3, 3, 4, 5][this.random(8)];
						pokemon.volatiles['partialtrappinglock'].duration = duration;
						pokemon.volatiles['partialtrappinglock'].locked = target;
						// Duration reset thus partially trapped at 2 always
						target.volatiles['partiallytrapped'].duration = 2;
						// We deduct an additional PP that was not deducted earlier
						// Get the move position
						var usedMovePos = -1;
						for (var m in pokemon.moveset) {
							if (pokemon.moveset[m].id === move.id) usedMovePos = m;
						}
						if (usedMovePos > -1 && pokemon.moveset[usedMovePos].pp === 0) {
							// If we were on the middle of the 0 PP sequence, the PPs get reset to 63.
							pokemon.moveset[usedMovePos].pp = 63;
						} else {
							// Otherwise, plain reduct
							pokemon.deductPP(move, null, target);
						}
					}
				}
			} // If we move to here, the move failed and there's no partial trapping lock
		}
	},
	useMove: function (move, pokemon, target, sourceEffect) {
		if (!sourceEffect && this.effect.id) sourceEffect = this.effect;
		move = this.getMove(move);
		var baseMove = move;
		move = this.getMoveCopy(move);
		if (!target) target = this.resolveTarget(pokemon, move);
		if (move.target === 'self') {
			target = pokemon;
		}
		if (sourceEffect) move.sourceEffect = sourceEffect.id;

		this.setActiveMove(move, pokemon, target);

		this.singleEvent('ModifyMove', move, null, pokemon, target, move, move);
		if (baseMove.target !== move.target) {
			// Target changed in ModifyMove, so we must adjust it here
			target = this.resolveTarget(pokemon, move);
		}
		move = this.runEvent('ModifyMove', pokemon, target, move, move);
		if (baseMove.target !== move.target) {
			// Check again
			target = this.resolveTarget(pokemon, move);
		}
		if (!move) return false;

		var attrs = '';
		var missed = false;
		if (pokemon.fainted) {
			// Removing screens upon faint
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
			return false;
		}

		if (move.isTwoTurnMove && !pokemon.volatiles[move.id]) {
			attrs = '|[still]'; // Suppress the default move animation
		}

		if (sourceEffect) attrs += '|[from]' + this.getEffect(sourceEffect);
		this.addMove('move', pokemon, move.name, target + attrs);

		if (!this.singleEvent('Try', move, null, pokemon, target, move)) {
			return true;
		}
		if (!this.runEvent('TryMove', pokemon, target, move)) {
			return true;
		}

		if (typeof move.affectedByImmunities === 'undefined') {
			move.affectedByImmunities = (move.category !== 'Status');
		}

		var damage = false;
		if (target.fainted) {
			this.attrLastMove('[notarget]');
			this.add('-notarget');
			return true;
		}
		damage = this.rollMoveHit(target, pokemon, move);

		// Store 0 damage for last damage if move failed or dealt 0 damage.
		if (!damage) pokemon.battle.lastDamage = 0;

		// Go ahead with results of the used move.
		if (!damage && damage !== 0) {
			this.singleEvent('MoveFail', move, null, target, pokemon, move);
			return true;
		}

		if (!move.negateSecondary) {
			this.singleEvent('AfterMoveSecondarySelf', move, null, pokemon, target, move);
			this.runEvent('AfterMoveSecondarySelf', pokemon, target, move);
		}
		return true;
	},
	rollMoveHit: function (target, pokemon, move, spreadHit) {
		var boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];
		var doSelfDestruct = true;
		var damage = 0;

		// First, let's calculate the accuracy.
		var accuracy = move.accuracy;

		// Partial trapping moves: true accuracy while it lasts
		if (move.volatileStatus === 'partiallytrapped' && pokemon.volatiles['partialtrappinglock']) {
			accuracy = true;
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

		// 1/256 chance of missing always, no matter what.
		if (accuracy !== true && this.random(256) >= accuracy) {
			this.attrLastMove('[miss]');
			this.add('-miss', pokemon);
			damage = false;
		}

		// Check if the Pokémon is immune to this move.
		if (move.affectedByImmunities && !target.runImmunity(move.type, true)) {
			damage = false;
		}

		// If damage is 0 and not false it means it didn't miss, let's calc.
		if (damage !== false) {
			pokemon.lastDamage = 0;
			if (move.multihit) {
				var hits = move.multihit;
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
				var moveDamage = 0;
				var firstDamage;
				var i;
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

		if (!damage && damage !== 0) return false;

		if (!move.negateSecondary) {
			this.singleEvent('AfterMoveSecondary', move, null, target, pokemon, move);
			this.runEvent('AfterMoveSecondary', target, pokemon, move);
		}

		// If we used a partial trapping move, we save the damage to repeat it
		if (pokemon.volatiles['partialtrappinglock']) {
			pokemon.volatiles['partialtrappinglock'].damage = damage;
		}

		return damage;
	},
	moveHit: function (target, pokemon, move, moveData, isSecondary, isSelf) {
		var damage = 0;
		move = this.getMoveCopy(move);

		if (!isSecondary && !isSelf) this.setActiveMove(move, pokemon, target);
		var hitResult = true;
		if (!moveData) moveData = move;

		if (typeof move.affectedByImmunities === 'undefined') {
			move.affectedByImmunities = (move.category !== 'Status');
		}

		// We get the sub to the target to see if it existed
		var targetSub = (target)? target.volatiles['substitute'] : false;
		var targetHadSub = (targetSub !== null && targetSub !== false && (typeof targetSub !== 'undefined'));

		if (target) {
			hitResult = this.singleEvent('TryHit', moveData, {}, target, pokemon, move);

			// Handle here the applying of partial trapping moves to Pokémon with Substitute
			if (targetSub && moveData.volatileStatus && moveData.volatileStatus === 'partiallytrapped') {
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
			var didSomething = false;

			damage = this.getDamage(pokemon, target, moveData);

			// getDamage has several possible return values:
			//
			//   a number:
			//     means that much damage is dealt (0 damage still counts as dealing
			//     damage for the purposes of things like Static)
			//   false:
			//     gives error message: "But it failed!" and move ends
			//   null:
			//     the move ends, with no message (usually, a custom fail message
			//     was already output by an event handler)
			//   undefined:
			//     means no damage is dealt and the move continues
			//
			// basically, these values have the same meanings as they do for event
			// handlers.

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
				var d = target.heal(Math.floor(target.maxhp * moveData.heal[0] / moveData.heal[1]));
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
		var targetHasSub = false;
		if (target) {
			var targetSub = target.getVolatile('substitute');
			if (targetSub !== null) {
				targetHasSub = (targetSub.hp > 0);
			}
		}

		var doSelf = (targetHadSub && targetHasSub) || !targetHadSub;
		if (moveData.self && doSelf) {
			this.moveHit(pokemon, pokemon, move, moveData.self, isSecondary, true);
		}
		if (moveData.secondaries) {
			var secondaryRoll;
			var effectChance;
			for (var i = 0; i < moveData.secondaries.length; i++) {
				secondaryRoll = this.random(256);
				effectChance = Math.floor(moveData.secondaries[i].chance * 255 / 100);
				if (typeof moveData.secondaries[i].chance === 'undefined' || secondaryRoll < effectChance) {
					this.moveHit(target, pokemon, move, moveData.secondaries[i], true, isSelf);
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
		if (typeof move === 'number') move = {
			basePower: move,
			type: '???',
			category: 'Physical'
		};

		// Let's see if the target is immune to the move.
		if (move.affectedByImmunities) {
			if (!target.runImmunity(move.type, true)) {
				return false;
			}
		}

		// Is it an OHKO move?
		if (move.ohko) {
			// If it is, move hits if the Pokémon is faster.
			if (target.speed > pokemon.speed) {
				this.add('-failed', target);
				return false;
			}
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
		if (pokemon.volatiles['partialtrappinglock'] && (target !== pokemon) && (target === pokemon.volatiles['partialtrappinglock'].locked)) {
			return pokemon.volatiles['partialtrappinglock'].damage;
		}

		// We check the category and typing to calculate later on the damage.
		if (!move.category) move.category = 'Physical';
		if (!move.defensiveCategory) move.defensiveCategory = move.category;
		// '???' is typeless damage: used for Struggle and Confusion etc
		if (!move.type) move.type = '???';
		var type = move.type;

		// We get the base power and apply basePowerCallback if necessary.
		var basePower = move.basePower;
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
			// In gen 1, the critical chance is based on speed.
			// First, we get the base speed, divide it by 2 and floor it. This is our current crit chance.
			var critChance = Math.floor(pokemon.template.baseStats['spe'] / 2);

			// Now we check for focus energy volatile.
			if (pokemon.volatiles['focusenergy']) {
				// If it exists, crit chance is divided by 2 again and floored.
				critChance = Math.floor(critChance / 2);
			} else {
				// Normally, without focus energy, crit chance is multiplied by 2 and capped at 255 here.
				critChance = this.clampIntRange(critChance * 2, 1, 255);
			}

			// Now we check for the move's critical hit ratio.
			if (move.critRatio === 1) {
				// Normal hit ratio, we divide the crit chance by 2 and floor the result again.
				critChance = Math.floor(critChance / 2);
			} else if (move.critRatio === 2) {
				// High crit ratio, we multiply the result so far by 4 and cap it at 255.
				critChance = this.clampIntRange(critChance * 4, 1, 255);
			}

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
		var level = pokemon.level;
		var attacker = pokemon;
		var defender = target;
		if (move.useTargetOffensive) attacker = target;
		if (move.useSourceDefensive) defender = pokemon;
		var atkType = (move.category === 'Physical')? 'atk' : 'spa';
		var defType = (move.defensiveCategory === 'Physical')? 'def' : 'spd';
		var attack = attacker.getStat(atkType);
		var defense = defender.getStat(defType);

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
		var damage = level * 2;
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
		var totalTypeMod = this.getEffectiveness(type, target);
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
			if (damage > target.hp) damage = target.hp;
		}

		// We are done, this is the final damage.
		return Math.floor(damage);
	},
	boost: function (boost, target, source, effect) {
		// Editing boosts to take into account para and burn stat drops glitches
		if (this.event) {
			if (!target) target = this.event.target;
			if (!source) source = this.event.source;
			if (!effect) effect = this.effect;
		}
		if (!target || !target.hp) return 0;
		effect = this.getEffect(effect);
		boost = this.runEvent('Boost', target, source, effect, Object.clone(boost));
		for (var i in boost) {
			var currentBoost = {};
			currentBoost[i] = boost[i];
			if (boost[i] !== 0 && target.boostBy(currentBoost)) {
				var msg = '-boost';
				if (boost[i] < 0) {
					msg = '-unboost';
					boost[i] = -boost[i];
					// Re-add attack and speed drops if not present
					if (i === 'atk' && target.status === 'brn' && !target.volatiles['brnattackdrop']) {
						target.addVolatile('brnattackdrop');
					}
					if (i === 'spe' && target.status === 'par' && !target.volatiles['parspeeddrop']) {
						target.addVolatile('parspeeddrop');
					}
				} else {
					// Check for boost increases deleting attack or speed drops
					if (i === 'atk' && target.status === 'brn' && target.volatiles['brnattackdrop']) {
						target.removeVolatile('brnattackdrop');
					}
					if (i === 'spe' && target.status === 'par' && target.volatiles['parspeeddrop']) {
						target.removeVolatile('parspeeddrop');
					}
				}
				if (effect.effectType === 'Move') {
					this.add(msg, target, i, boost[i]);
				} else {
					this.add(msg, target, i, boost[i], '[from] ' + effect.fullname);
				}
				this.runEvent('AfterEachBoost', target, source, effect, currentBoost);
			}
		}
		this.runEvent('AfterBoost', target, source, effect, boost);
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
		var name = effect.fullname;
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

		if (effect.recoil && source) {
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
	// This is random teams making for gen 1
	randomCCTeam: function (side) {
		var teamdexno = [];
		var team = [];

		//pick six random pokmeon--no repeats, even among formes
		//also need to either normalize for formes or select formes at random
		//unreleased are okay. No CAP for now, but maybe at some later date
		for (var i = 0; i < 6; i++) {
			while (true) {
				var x = Math.floor(Math.random() * 150) + 1;
				if (teamdexno.indexOf(x) === -1) {
					teamdexno.push(x);
					break;
				}
			}
		}

		for (var i = 0; i < 6; i++) {
			//choose forme
			var formes = [];
			for (var j in this.data.Pokedex) {
				if (this.data.Pokedex[j].num === teamdexno[i] && this.getTemplate(this.data.Pokedex[j].species).learnset && this.data.Pokedex[j].species !== 'Pichu-Spiky-eared') {
					formes.push(this.data.Pokedex[j].species);
				}
			}
			var poke = formes.sample();
			var template = this.getTemplate(poke);

			//level balance--calculate directly from stats rather than using some silly lookup table
			var mbstmin = 1307; //sunkern has the lowest modified base stat total, and that total is 807

			var stats = template.baseStats;

			// Modified base stat total assumes 30 IVs, 255 EVs in every stat
			var mbst = (stats["hp"] * 2 + 30 + 63 + 100) + 10;
			mbst += (stats["atk"] * 2 + 30 + 63 + 100) + 5;
			mbst += (stats["def"] * 2 + 30 + 63 + 100) + 5;
			mbst += (stats["spa"] * 2 + 30 + 63 + 100) + 5;
			mbst += (stats["spd"] * 2 + 30 + 63 + 100) + 5;
			mbst += (stats["spe"] * 2 + 30 + 63 + 100) + 5;

			var level = Math.floor(100 * mbstmin / mbst); // Initial level guess will underestimate

			while (level < 100) {
				mbst = Math.floor((stats["hp"] * 2 + 30 + 63 + 100) * level / 100 + 10);
				mbst += Math.floor(((stats["atk"] * 2 + 30 + 63 + 100) * level / 100 + 5) * level / 100); //since damage is roughly proportional to lvl
				mbst += Math.floor((stats["def"] * 2 + 30 + 63 + 100) * level / 100 + 5);
				mbst += Math.floor(((stats["spa"] * 2 + 30 + 63 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats["spd"] * 2 + 30 + 63 + 100) * level / 100 + 5);
				mbst += Math.floor((stats["spe"] * 2 + 30 + 63 + 100) * level / 100 + 5);

				if (mbst >= mbstmin)
					break;
				level++;
			}

			// Random IVs
			var ivs = {
				hp: Math.floor(Math.random() * 31),
				atk: Math.floor(Math.random() * 31),
				def: Math.floor(Math.random() * 31),
				spa: Math.floor(Math.random() * 31),
				spd: Math.floor(Math.random() * 31),
				spe: Math.floor(Math.random() * 31)
			};

			// ALl EVs
			var evs = {
				hp: 255,
				atk: 255,
				def: 255,
				spa: 255,
				spd: 255,
				spe: 255
			};

			// Four random unique moves from movepool. don't worry about "attacking" or "viable"
			var moves;
			var pool = ['struggle'];
			pool = Object.keys(template.learnset);
			if (pool.length <= 4) {
				moves = pool;
			} else {
				moves = pool.sample(4);
			}

			team.push({
				name: poke,
				moves: moves,
				ability: 'None',
				evs: evs,
				ivs: ivs,
				item: '',
				level: level,
				happiness: 0,
				shiny: false,
				nature: 'Serious'
			});
		}

		return team;
	},
	randomTeam: function (side) {
		var keys = [];
		var pokemonLeft = 0;
		var pokemon = [];
		for (var i in this.data.FormatsData) {
			if (this.data.FormatsData[i].randomBattleMoves) {
				keys.push(i);
			}
		}
		keys = keys.randomize();

		var ruleset = this.getFormat().ruleset;

		for (var i = 0; i < keys.length && pokemonLeft < 6; i++) {
			var template = this.getTemplate(keys[i]);
			if (!template || !template.name || !template.types) continue;
			var set = this.randomSet(template, i);

			pokemon.push(set);
			pokemonLeft++;
		}

		return pokemon;
	},
	randomSet: function (template, i) {
		if (i === undefined) i = 1;
		template = this.getTemplate(template);
		if (!template.exists) template = this.getTemplate('pikachu'); // Because Gen 1

		var moveKeys = (template.randomBattleMoves || Object.keys(template.learnset)).randomize();
		var moves = [];
		var hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) hasType[template.types[1]] = true;
		var hasMove = {};
		var counter = {};
		var setupType = '';

		var j = 0;
		do {
			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length < 4 && j < moveKeys.length) {
				var moveid = toId(moveKeys[j]);
				j++;
				if (moveid.substr(0, 11) === 'hiddenpower') {
					if (!hasMove['hiddenpower']) {
						hasMove['hiddenpower'] = true;
					} else {
						continue;
					}
				}
				moves.push(moveid);
			}

			hasMove = {};
			counter = {
				Physical: 0, Special: 0, Status: 0, damage: 0,
				recoil: 0, inaccurate: 0,
				physicalsetup: 0, specialsetup: 0, mixedsetup: 0
			};
			for (var k = 0; k < moves.length; k++) {
				var move = this.getMove(moves[k]);
				var moveid = move.id;
				hasMove[moveid] = true;
				if (move.damage || move.damageCallback) {
					counter['damage']++;
				} else {
					counter[move.category]++;
				}
				if (move.recoil) {
					counter['recoil']++;
				}
				if (move.accuracy && move.accuracy !== true && move.accuracy < 90) {
					counter['inaccurate']++;
				}
				var PhysicalSetup = {swordsdance:1};
				var SpecialSetup = {amnesia:1};
				var MixedSetup = {growth:1};
				if (PhysicalSetup[moveid]) {
					counter['physicalsetup']++;
				}
				if (SpecialSetup[moveid]) {
					counter['specialsetup']++;
				}
				if (MixedSetup[moveid]) {
					counter['mixedsetup']++;
				}
			}

			if (counter['mixedsetup']) {
				setupType = 'Mixed';
			} else if (counter['specialsetup']) {
				setupType = 'Special';
			} else if (counter['physicalsetup']) {
				setupType = 'Physical';
			}

			for (var k = 0; k < moves.length; k++) {
				var moveid = moves[k];
				var move = this.getMove(moveid);
				var rejected = false;
				var isSetup = false;

				switch (moveid) {
				// bad after setup
				case 'seismictoss': case 'nightshade':
					if (setupType) rejected = true;
					break;

				// bit redundant to have both
				case 'flamethrower':
					if (hasMove['fireblast']) rejected = true;
					break;
				case 'icebeam':
					if (hasMove['blizzard']) rejected = true;
					break;
				case 'surf':
					if (hasMove['hydropump']) rejected = true;
					break;
				case 'petaldance': case 'solarbeam':
					if (hasMove['megadrain'] || hasMove['razorleaf']) rejected = true;
					break;
				case 'megadrain':
					if (hasMove['razorleaf']) rejected = true;
					break;
				case 'thunder':
					if (hasMove['thunderbolt']) rejected = true;
					break;
				case 'bonemerang':
					if (hasMove['earthquake']) rejected = true;
					break;
				case 'rest':
					if (hasMove['recover'] || hasMove['softboiled']) rejected = true;
					break;
				case 'softboiled':
					if (hasMove['recover']) rejected = true;
					break;
				} // End of switch for moveid
				if (setupType === 'Physical' && move.category !== 'Physical' && counter['Physical'] < 2) {
					rejected = true;
				}
				if (setupType === 'Special' && move.category !== 'Special' && counter['Special'] < 2) {
					rejected = true;
				}

				if (rejected && j < moveKeys.length) {
					moves.splice(k, 1);
					break;
				}
			} // End of for
		} while (moves.length < 4 && j < moveKeys.length);

		var levelScale = {
			LC: 95,
			UU: 78,
			OU: 74,
			Uber: 70
		};
		// Really bad Pokemon and jokemons
		var customScale = {
			Caterpie: 99, Kakuna: 99, Magikarp: 99, Metapod: 99, Weedle: 99,
			Clefairy: 95, "Farfetch'd": 95, Jigglypuff: 95
		};
		var level = levelScale[template.tier] || 90;
		if (customScale[template.name]) level = customScale[template.name];

		return {
			name: template.name,
			moves: moves,
			ability: 'None',
			evs: {hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255},
			ivs: {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30},
			item: '',
			level: level,
			shiny: false,
			gender: false
		};
	},
	faint: function (pokemon, source, effect) {
		pokemon.faint(source, effect);
		this.queue = [];
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
		// Check here for Substitute on confusion since it's not exactly a move that causes the damage and thus it can't TryMoveHit.
		// The hi jump kick recoil also hits the sub.
		if (effect.id in {'confusion': 1, 'highjumpkick': 1} && target.volatiles['substitute']) {
			target.volatiles['substitute'].hp -= damage;
			if (target.volatiles['substitute'].hp <= 0) {
				target.removeVolatile('substitute');
				target.subFainted = true;
			} else {
				this.add('-activate', target, 'Substitute', '[damage]');
			}
		} else {
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
		}

		return damage;
	}
};
