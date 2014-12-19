/**
 * Gen 2 scripts.
 */
exports.BattleScripts = {
	inherit: 'gen3',
	gen: 2,
	getStatCallback: function (stat, statName, pokemon) {
		// Gen 2 caps stats at 999 and min is 1. Stats over 1023 with items roll over (Marowak, Pikachu)
		if (pokemon.species === 'Marowak' && pokemon.item === 'thickclub' && statName === 'atk' && stat > 1023) {
			stat = stat - 1024;
		} else if (pokemon.species === 'Pikachu' && pokemon.item === 'lightball' && statName === 'spa' && stat > 1023) {
			stat = stat - 1024;
		} else if (pokemon.species === 'Ditto' && pokemon.item === 'metalpowder' && statName in {def:1, spd:1} && stat > 1023) {
			// what. the. fuck. stop playing pokémon
			stat = stat - 1024;
		} else {
			if (stat > 999) stat = 999;
		}
		if (stat < 1) stat = 1;

		return stat;
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
			if (target.level > pokemon.level) {
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

		// There's no move for some reason, create it
		if (!move) {
			move = {};
		}

		// We check the category and typing to calculate later on the damage
		move.category = this.getCategory(move);
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
		move.critRatio = this.clampIntRange(move.critRatio, 0, 5);
		var critMult = [0, 16, 8, 4, 3, 2];
		move.crit = move.willCrit || false;
		if (typeof move.willCrit === 'undefined') {
			if (move.critRatio) {
				move.crit = (this.random(critMult[move.critRatio]) === 0);
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
			move.ignoreNegativeOffensive = true;
			move.ignorePositiveDefensive = true;
		}
		if (move.ignoreNegativeOffensive && attack < attacker.getStat(move.category === 'Physical' ? 'atk' : 'spa', true, true)) {
			move.ignoreOffensive = true;
		}
		if (move.ignoreOffensive) {
			this.debug('Negating (sp)atk boost/penalty.');
			attack = attacker.getStat(move.category === 'Physical' ? 'atk' : 'spa', true, true);
		}
		if (move.ignorePositiveDefensive && defense > target.getStat(move.defensiveCategory === 'Physical' ? 'def' : 'spd', true, true)) {
			move.ignoreDefensive = true;
		}
		if (move.ignoreDefensive) {
			this.debug('Negating (sp)def boost/penalty.');
			defense = target.getStat(move.defensiveCategory === 'Physical' ? 'def' : 'spd', true, true);
		}

		// Gen 2 damage formula
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
	faint: function (pokemon, source, effect) {
		pokemon.faint(source, effect);
		this.queue = [];
	},
	comparePriority: function (a, b) {
		a.priority = a.priority || 0;
		a.subPriority = a.subPriority || 0;
		a.speed = a.speed || 0;
		b.priority = b.priority || 0;
		b.subPriority = b.subPriority || 0;
		b.speed = b.speed || 0;
		if ((typeof a.order === 'number' || typeof b.order === 'number') && a.order !== b.order) {
			if (typeof a.order !== 'number') {
				return -1;
			}
			if (typeof b.order !== 'number') {
				return 1;
			}
			if (b.order - a.order) {
				return -(b.order - a.order);
			}
		}
		if (b.priority - a.priority) {
			return b.priority - a.priority;
		}
		if (b.speed - a.speed) {
			if (b.priority === -1 && a.priority === -1) return a.speed - b.speed;
			return b.speed - a.speed;
		}
		if (b.subOrder - a.subOrder) {
			return -(b.subOrder - a.subOrder);
		}
		return Math.random() - 0.5;
	},
	getResidualStatuses: function (thing, callbackType) {
		var statuses = this.getRelevantEffectsInner(thing || this, callbackType || 'residualCallback', null, null, false, true, 'duration');
		statuses.sort(this.comparePriority);
		//if (statuses[0]) this.debug('match ' + (callbackType || 'residualCallback') + ': ' + statuses[0].status.id);
		return statuses;
	},
	residualEvent: function (eventid, relayVar) {
		var statuses = this.getRelevantEffectsInner(this, 'on' + eventid, null, null, false, true, 'duration');
		statuses.sort(this.comparePriority);
		while (statuses.length) {
			var statusObj = statuses.shift();
			var status = statusObj.status;
			if (statusObj.thing.fainted) continue;
			if (statusObj.statusData && statusObj.statusData.duration) {
				statusObj.statusData.duration--;
				if (!statusObj.statusData.duration) {
					statusObj.end.call(statusObj.thing, status.id);
					continue;
				}
			}
			this.singleEvent(eventid, status, statusObj.statusData, statusObj.thing, relayVar);
		}
	},
	getRelevantEffects: function (thing, callbackType, foeCallbackType, foeThing, checkChildren) {
		var statuses = this.getRelevantEffectsInner(thing, callbackType, foeCallbackType, foeThing, true, false);
		statuses.sort(this.comparePriority);
		//if (statuses[0]) this.debug('match ' + callbackType + ': ' + statuses[0].status.id);
		return statuses;
	},
	addQueue: function (decision, noSort, side) {
		if (decision) {
			if (Array.isArray(decision)) {
				for (var i = 0; i < decision.length; i++) {
					this.addQueue(decision[i], noSort);
				}
				return;
			}
			if (decision.choice === 'pass') return;
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

				decision.move = this.getMove(decision.move);
				if (!decision.priority) {
					var priority = decision.move.priority;
					priority = this.runEvent('ModifyPriority', decision.pokemon, target, decision.move, priority);
					decision.priority = priority;
				}
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
		if (!noSort) {
			this.queue.sort(this.comparePriority);
		}
	}
};
