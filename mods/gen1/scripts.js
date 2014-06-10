/**
 * Gen 1 mechanics were fairly different, so we need to make a lot of changes to battle.js
 * using this.
 */
exports.BattleScripts = {
	inherit: 'gen2',
	gen: 1,
	init: function () {
		for (var i in this.data.Learnsets) {
			this.modData('Learnsets', i);
			var learnset = this.data.Learnsets[i].learnset;
			for (var moveid in learnset) {
				if (typeof learnset[moveid] === 'string') learnset[moveid] = [learnset[moveid]];
				learnset[moveid] = learnset[moveid].filter(function (source) {
					return source[0] === '1';
				});
				if (!learnset[moveid].length) delete learnset[moveid];
			}
		}
	},
	debug: function (activity) {
		if (this.getFormat().debug) {
			this.add('debug', activity);
		}
	},
	// getStat callback for gen 1 stat dealing
	getStatCallback: function (stat, statName, pokemon) {
		// Hard coded Reflect and Light Screen boosts
		if (pokemon.volatiles['reflect'] && statName === 'def') {
			this.debug('Reflect doubles Defense');
			stat *= 2;
			// Max on reflect is 1024
			if (stat > 1024) stat = 1024;
			if (stat < 1) stat = 1;
		} else if (pokemon.volatiles['lightscreen'] && statName === 'spd') {
			this.debug('Light Screen doubles Special Defense');
			stat *= 2;
			// Max on reflect is 1024
			if (stat > 1024) stat = 1024;
			if (stat < 1) stat = 1;
		} else {
			// Gen 1 caps stats at 999 and min is 1
			if (stat > 999) stat = 999;
			if (stat < 1) stat = 1;
		}

		return stat;
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
						var roll = this.random(6);
						var duration = [2, 2, 3, 3, 4, 5][roll];
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
							// If we were on the middle of the 0 PP sequence, the PPs get reset
							pokemon.moveset[usedMovePos].pp = pokemon.moveset[usedMovePos].maxpp;
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
		if (move.target === 'self' || move.target === 'allies') {
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

		var movename = move.name;
		if (move.id === 'hiddenpower') movename = 'Hidden Power';
		if (sourceEffect) attrs += '|[from]' + this.getEffect(sourceEffect);
		this.addMove('move', pokemon, movename, target + attrs);

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
		if (move.target === 'all' || move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') {
			damage = this.moveHit(target, pokemon, move);
		} else {
			if (target.fainted) {
				this.attrLastMove('[notarget]');
				this.add('-notarget');
				return true;
			}
			damage = this.rollMoveHit(target, pokemon, move);
		}

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

		// Calculate true accuracy
		var accuracy = move.accuracy;
		if (accuracy !== true) {
			accuracy = Math.floor(accuracy * 255 / 100);
		}

		// Partial trapping moves: true accuracy while it lasts
		if (move.volatileStatus === 'partiallytrapped' && pokemon.volatiles['partialtrappinglock']) {
			accuracy = true;
		}

		if (accuracy !== true) {
			if (!move.ignoreAccuracy) {
				if (pokemon.boosts.accuracy > 0) {
					accuracy *= boostTable[pokemon.boosts.accuracy];
				} else {
					accuracy /= boostTable[-pokemon.boosts.accuracy];
				}
			}
			if (!move.ignoreEvasion) {
				if (target.boosts.evasion > 0 && !move.ignorePositiveEvasion) {
					accuracy /= boostTable[target.boosts.evasion];
				} else if (target.boosts.evasion < 0) {
					accuracy *= boostTable[-target.boosts.evasion];
				}
			}
		}

		// Bypasses ohko accuracy modifiers
		if (move.alwaysHit) accuracy = true;
		accuracy = this.runEvent('Accuracy', target, pokemon, move, accuracy);

		// Gen 1, 1/256 chance of missing always, no matter what
		if (accuracy !== true && this.random(256) >= accuracy) {
			this.attrLastMove('[miss]');
			this.add('-miss', pokemon);
			damage = false;
		}

		if (move.affectedByImmunities && !target.runImmunity(move.type, true)) {
			damage = false;
		}

		if (damage !== false) {
			pokemon.lastDamage = 0;
			if (move.multihit) {
				var hits = move.multihit;
				if (hits.length) {
					// Yes, it's hardcoded... meh
					if (hits[0] === 2 && hits[1] === 5) {
						var roll = this.random(6);
						hits = [2, 2, 3, 3, 4, 5][roll];
					} else {
						hits = this.random(hits[0], hits[1] + 1);
					}
				}
				hits = Math.floor(hits);
				// In gen 1, all the hits have the same damage for multihits move
				var moveDamage = 0;
				for (var i = 0; i < hits && target.hp && pokemon.hp; i++) {
					if (i === 0) {
						// First hit, we calculate
						moveDamage = this.moveHit(target, pokemon, move);
						var firstDamage = moveDamage;
					} else {
						// We get the previous damage to make it fix damage
						move.damage = firstDamage;
						moveDamage = this.moveHit(target, pokemon, move);
					}
					if (moveDamage === false) break;
					damage = (moveDamage || 0);
					if (target.subFainted) {
						i++
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
		if (pokemon.volatiles['partialtrappinglock'] && !pokemon.volatiles['partialtrappinglock'].damage) {
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

		// TryHit events:
		//   STEP 1: we see if the move will succeed at all:
		//   - TryHit, TryHitSide, or TryHitField are run on the move,
		//     depending on move target
		//   == primary hit line ==
		//   Everything after this only happens on the primary hit (not on
		//   secondary or self-hits)
		//   STEP 2: we see if anything blocks the move from hitting:
		//   - TryFieldHit is run on the target
		//   STEP 3: we see if anything blocks the move from hitting the target:
		//   - If the move's target is a pokemon, TryHit is run on that pokemon

		// Note:
		//   If the move target is `foeSide`:
		//     event target = pokemon 0 on the target side
		//   If the move target is `allySide` or `all`:
		//     event target = the move user
		//
		//   This is because events can't accept actual sides or fields as
		//   targets. Choosing these event targets ensures that the correct
		//   side or field is hit.
		//
		//   It is the `TryHitField` event handler's responsibility to never
		//   use `target`.
		//   It is the `TryFieldHit` event handler's responsibility to read
		//   move.target and react accordingly.
		//   An exception is `TryHitSide`, which is passed the target side.

		// Note 2:
		//   In case you didn't notice, FieldHit and HitField mean different things.
		//     TryFieldHit - something in the field was hit
		//     TryHitField - our move has a target of 'all' i.e. the field, and hit
		//   This is a VERY important distinction: Every move triggers
		//   TryFieldHit, but only  moves with a target of "all" (e.g.
		//   Haze) trigger TryHitField.

		if (target) {
			if (move.target === 'all' && !isSelf) {
				hitResult = this.singleEvent('TryHitField', moveData, {}, target, pokemon, move);
			} else if ((move.target === 'foeSide' || move.target === 'allySide') && !isSelf) {
				hitResult = this.singleEvent('TryHitSide', moveData, {}, target.side, pokemon, move);
			} else {
				hitResult = this.singleEvent('TryHit', moveData, {}, target, pokemon, move);
			}
			if (!hitResult) {
				if (hitResult === false) this.add('-fail', target);
				return false;
			}

			// Only run the hit events for the hit itself, not the secondary or self hits
			if (!isSelf && !isSecondary) {
				if (move.target === 'all') {
					hitResult = this.runEvent('TryHitField', target, pokemon, move);
				} else if (move.target === 'foeSide' || move.target === 'allySide') {
					hitResult = this.runEvent('TryHitSide', target, pokemon, move);
				} else {
					hitResult = this.runEvent('TryHit', target, pokemon, move);
				}
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
				var d = target.heal(Math.round(target.maxhp * moveData.heal[0] / moveData.heal[1]));
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
			//   These are like the TryHit events, except we don't need a FieldHit event.
			//   Scroll up for the TryHit event documentation, and just ignore the "Try" part. ;)
			if (move.target === 'all' && !isSelf) {
				hitResult = this.singleEvent('HitField', moveData, {}, target, pokemon, move);
			} else if ((move.target === 'foeSide' || move.target === 'allySide') && !isSelf) {
				hitResult = this.singleEvent('HitSide', moveData, {}, target.side, pokemon, move);
			} else {
				hitResult = this.singleEvent('Hit', moveData, {}, target, pokemon, move);
				if (!isSelf && !isSecondary) {
					this.runEvent('Hit', target, pokemon, move);
				}
			}
			if (!hitResult && !didSomething) {
				if (hitResult === false) this.add('-fail', target);
				return false;
			}
		}
		if (target) {
			var targetSub = target.getVolatile('substitute');
			if (targetSub === null) {
				var targetHasSub = false;
			} else {
				var targetHasSub = (targetSub.hp > 0);
			}
		} else {
			var targetHasSub = false;
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
		// We get the move
		if (typeof move === 'string') move = this.getMove(move);
		if (typeof move === 'number') move = {
			basePower: move,
			type: '???',
			category: 'Physical'
		};

		// First of all, we test for immunities
		if (move.affectedByImmunities) {
			if (!target.runImmunity(move.type, true)) {
				return false;
			}
		}

		// Is it ok?
		if (move.ohko) {
			if (target.speed > pokemon.speed) {
				this.add('-failed', target);
				return false;
			}
			return target.maxhp;
		}

		// We edit the damage through move's damage callback
		if (move.damageCallback) {
			return move.damageCallback.call(this, pokemon, target);
		}

		// We take damage from damage=level moves
		if (move.damage === 'level') {
			return pokemon.level;
		}

		// If there's a fix move damage, we run it
		if (move.damage) {
			return move.damage;
		}

		// If it's the first hit on a Normal-type partially trap move, it hits Ghosts but damage is 0
		if (move.volatileStatus === 'partiallytrapped' && move.type === 'Normal' && target.hasType('Ghost')) {
			return 0;
		}

		// Let's check if we are in middle of a partial trap sequence
		if (pokemon.volatiles['partialtrappinglock'] && (target !== pokemon) && (target === pokemon.volatiles['partialtrappinglock'].locked)) {
			return pokemon.volatiles['partialtrappinglock'].damage;
		}

		// There's no move for some reason, create it
		if (!move) {
			move = {};
		}

		// We check the category and typing to calculate later on the damage
		if (!move.category) move.category = 'Physical';
		if (!move.defensiveCategory) move.defensiveCategory = move.category;
		// '???' is typeless damage: used for Struggle and Confusion etc
		if (!move.type) move.type = '???';
		var type = move.type;

		// We get the base power and apply basePowerCallback if necessary
		var basePower = move.basePower;
		if (move.basePowerCallback) {
			basePower = move.basePowerCallback.call(this, pokemon, target, move);
		}

		// We check for Base Power
		if (!basePower) {
			if (basePower === 0) return; // Returning undefined means not dealing damage
			return basePower;
		}
		basePower = this.clampIntRange(basePower, 1);

		// Checking for the move's Critical Hit ratio
		// First, we check if it's a 100% crit move
		move.critRatio = this.clampIntRange(move.critRatio, 0, 5);
		move.crit = move.willCrit || false;
		var critRatio = 0;
		// Otherwise, we calculate the critical hit chance
		if (typeof move.willCrit === 'undefined') {
			// In gen 1, the critical chance is based on speed
			switch (move.critRatio) {
			case 1:
				// Normal crit-rate: BaseSpeed * 100 / 512.
				critRatio = pokemon.template.baseStats['spe'] * 100 / 512;
				break;
			case 2:
				// High crit-rate: BaseSpeed * 100 / 64
				critRatio = pokemon.template.baseStats['spe'] * 100 / 64;
				break;
			case -2:
				// Crit rate destroyed by Focus Energy (dumb trainer is dumb)
				critRatio = (pokemon.template.baseStats['spe'] * 100 / 64) * 0.25;
				this.debug('Using ruined normal crit-rate: (template.baseStats[\'spe\'] * 100 / 64) * 0.25');
				break;
			case -1:
				// High crit move ruined by Focus Energy. Deppends on speed
				if (pokemon.speed > target.speed) {
					// Critical rate not decreased if pokemon is faster than target
					critRatio = pokemon.template.baseStats['spe'] * 100 / 64;
					 this.debug('Using ruined high crit-rate: template.baseStats[\'spe\'] * 100 / 64');
				} else {
					// If you are slower, you can't crit on this moves
					this.debug('Ruined crit rate, too slow, cannnot crit');
					critRatio = false;
				}
				break;
			}

			// Last, we check deppending on ratio if the move hits
			if (critRatio) {
				critRatio = critRatio.floor();
				var random = Math.random() * 100;
				move.crit = (random.floor() <= critRatio);
			}
		}
		if (move.crit) {
			move.crit = this.runEvent('CriticalHit', target, null, move);
		}

		// Happens after crit calculation
		if (basePower) {
			basePower = this.runEvent('BasePower', pokemon, target, move, basePower);
			if (move.basePowerModifier) {
				basePower *= move.basePowerModifier;
			}
		}
		if (!basePower) return 0;
		basePower = this.clampIntRange(basePower, 1);

		// We now check for attacker and defender
		var level = pokemon.level;
		var attacker = pokemon;
		var defender = target;
		if (move.useTargetOffensive) attacker = target;
		if (move.useSourceDefensive) defender = pokemon;
		var atkType = (move.category === 'Physical')? 'atk' : 'spa';
		var defType = (move.defensiveCategory === 'Physical')? 'def' : 'spd';
		var attack = attacker.getStat(atkType);
		var defense = defender.getStat(defType);

		if (move.crit) {
			move.ignoreOffensive = true;
			move.ignoreDefensive = true;
		}
		if (move.ignoreOffensive) {
			this.debug('Negating (sp)atk boost/penalty.');
			attack = attacker.getStat(atkType, true);
		}
		if (move.ignoreDefensive) {
			this.debug('Negating (sp)def boost/penalty.');
			defense = target.getStat(defType, true);
		}

		// Gen 1 damage formula:
		// (min(((2 * L / 5 + 2) * Atk * BP) / max(1, Def) / 50, 997) + 2) * Stab * TypeEffect * Random / 255
		// Where: L: user level, A: current attack, P: move power, D: opponent current defense,
		// S is the Stab modifier, T is the type effectiveness modifier, R is random between 217 and 255
		// The max damage is 999
		var baseDamage = Math.min(Math.floor(Math.floor(Math.floor(2 * level / 5 + 2) * attack * basePower / defense) / 50), 997) + 2;

		// Crit damage addition (usually doubling)
		if (move.crit) {
			if (!suppressMessages) this.add('-crit', target);
			baseDamage = this.modify(baseDamage, move.critModifier || 2);
		}

		// STAB damage bonus, the "???" type never gets STAB
		if (type !== '???' && pokemon.hasType(type)) {
			baseDamage = Math.floor(baseDamage * 1.5);
		}

		// Type effectiveness
		var totalTypeMod = this.getEffectiveness(type, target);
		// Super effective attack
		if (totalTypeMod > 0) {
			if (!suppressMessages) this.add('-supereffective', target);
			baseDamage *= 2;
			if (totalTypeMod >= 2) {
				baseDamage *= 2;
			}
		}

		// Resisted attack
		if (totalTypeMod < 0) {
			if (!suppressMessages) this.add('-resisted', target);
			baseDamage = Math.floor(baseDamage / 2);
			if (totalTypeMod <= -2) {
				baseDamage = Math.floor(baseDamage / 2);
			}
		}

		// Randomizer, it's a number between 217 and 255
		var randFactor = Math.floor(Math.random() * 39) + 217;
		baseDamage *= Math.floor(randFactor * 100 / 255) / 100;

		// If damage is less than 1, we return 1
		if (basePower && !Math.floor(baseDamage)) {
			return 1;
		}

		// We are done, this is the final damage
		return Math.floor(baseDamage);
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
			this.damage(Math.round(damage * effect.recoil[0] / effect.recoil[1]), source, target, 'recoil');
		}
		if (effect.drain && source) {
			this.heal(Math.ceil(damage * effect.drain[0] / effect.drain[1]), source, target, 'drain');
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
		for (var i = 0; i < 6; i++)
		{
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

			var level = Math.floor(100 * mbstmin/mbst); // Initial level guess will underestimate

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
			//if (this.data.FormatsData[i].viableMoves) {
				keys.push(i);
			//}
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

		var moveKeys = Object.keys(template.viableMoves || template.learnset).randomize();
		var moves = [];
		var hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) hasType[template.types[1]] = true;
		var hasMove = {};
		var counter = {};
		var setupType = '';

		var j = 0;
		do {
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
	}
};
