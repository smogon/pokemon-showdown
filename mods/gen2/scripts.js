/**
 * Gen 2 scripts.
 */
exports.BattleScripts = {
	inherit: 'gen3',
	gen: 2,
	// BattlePokemon scripts.
	pokemon: {
		getStat: function (statName, unboosted, unmodified) {
			statName = toId(statName);
			if (statName === 'hp') return this.maxhp;

			// base stat
			var stat = this.stats[statName];

			// Stat boosts.
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

				// On Gen 2 we check modifications here from moves and items
				var statTable = {atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe'};
				var statMod = 1;
				statMod = this.battle.runEvent('Modify' + statTable[statName], this, null, null, statMod);
				stat = this.battle.modify(stat, statMod);
			}

			if (!unmodified) {
				// Burn attack drop is checked when you get the attack stat upon switch in and used until switch out.
				if (this.status === 'brn' && statName === 'atk') {
					stat = this.battle.clampIntRange(Math.floor(stat / 2), 1);
				}
			}

			// Gen 2 caps stats at 999 and min is 1.
			stat = this.battle.clampIntRange(stat, 1, 999);

			// Treat here the items.
			if ((this.species in {'Cubone':1, 'Marowak':1} && this.item === 'thickclub' && statName === 'atk') || (this.species === 'Pikachu' && this.item === 'lightball' && statName === 'spa')) {
				stat *= 2;
			} else if (this.species === 'Ditto' && this.item === 'metalpowder' && statName in {'def':1, 'spd':1}) {
				// what. the. fuck. stop playing pokémon
				stat *= 1.5;
			}

			return stat;
		}
	},
	// Battle scripts.
	runMove: function (move, pokemon, target, sourceEffect) {
		if (!sourceEffect && toId(move) !== 'struggle') {
			var changedMove = this.runEvent('OverrideDecision', pokemon, target, move);
			if (changedMove && changedMove !== true) {
				move = changedMove;
				target = null;
			}
		}
		move = this.getMove(move);
		if (!target && target !== false) target = this.resolveTarget(pokemon, move);

		this.setActiveMove(move, pokemon, target);

		if (pokemon.moveThisTurn) {
			// THIS IS PURELY A SANITY CHECK
			// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
			// USE this.cancelMove INSTEAD
			this.debug('' + pokemon.id + ' INCONSISTENT STATE, ALREADY MOVED: ' + pokemon.moveThisTurn);
			this.clearActiveMove(true);
			return;
		}
		if (!this.runEvent('BeforeMove', pokemon, target, move)) {
			// Prevent invulnerability from persisting until the turn ends
			pokemon.removeVolatile('twoturnmove');
			this.clearActiveMove(true);
			// This is only run for sleep and fully paralysed.
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
		if (!lockedMove) {
			if (!pokemon.deductPP(move, null, target) && (move.id !== 'struggle')) {
				this.add('cant', pokemon, 'nopp', move);
				this.clearActiveMove(true);
				return;
			}
		}
		pokemon.moveUsed(move);
		this.useMove(move, pokemon, target, sourceEffect);
		this.runEvent('AfterMove', target, pokemon, move);
		if (!move.selfSwitch) this.runEvent('AfterMoveSelf', pokemon, target, move);
	},
	moveHit: function (target, pokemon, move, moveData, isSecondary, isSelf) {
		var damage;
		move = this.getMoveCopy(move);

		if (!moveData) moveData = move;
		var hitResult = true;

		if (move.target === 'all' && !isSelf) {
			hitResult = this.singleEvent('TryHitField', moveData, {}, target, pokemon, move);
		} else if ((move.target === 'foeSide' || move.target === 'allySide') && !isSelf) {
			hitResult = this.singleEvent('TryHitSide', moveData, {}, target.side, pokemon, move);
		} else if (target) {
			hitResult = this.singleEvent('TryHit', moveData, {}, target, pokemon, move);
		}
		if (!hitResult) {
			if (hitResult === false) this.add('-fail', target);
			return false;
		}

		if (target && !isSecondary && !isSelf) {
			hitResult = this.runEvent('TryPrimaryHit', target, pokemon, moveData);
			if (hitResult === 0) {
				// special Substitute flag
				hitResult = true;
				target = null;
			}
		}
		if (target && isSecondary && !moveData.self) {
			hitResult = true;
		}
		if (!hitResult) {
			return false;
		}

		if (target) {
			var didSomething = false;
			damage = this.getDamage(pokemon, target, moveData);

			if ((damage || damage === 0) && !target.fainted) {
				if (move.noFaint && damage >= target.hp) {
					damage = target.hp - 1;
				}
				damage = this.damage(damage, target, pokemon, move);
				if (!(damage || damage === 0)) {
					this.debug('damage interrupted');
					return false;
				}
				didSomething = true;
			}
			if (damage === false || damage === null) {
				if (damage === false) {
					this.add('-fail', target);
				}
				this.debug('damage calculation interrupted');
				return false;
			}

			if (moveData.boosts && !target.fainted) {
				hitResult = this.boost(moveData.boosts, target, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.heal && !target.fainted) {
				var d = target.heal(Math.round(target.maxhp * moveData.heal[0] / moveData.heal[1]));
				if (!d && d !== 0) {
					this.add('-fail', target);
					this.debug('heal interrupted');
					return false;
				}
				this.add('-heal', target, target.getHealth);
				didSomething = true;
			}
			if (moveData.status) {
				if (!target.status) {
					hitResult = target.setStatus(moveData.status, pokemon, move);
					didSomething = didSomething || hitResult;
				} else if (!isSecondary) {
					if (target.status === moveData.status) {
						this.add('-fail', target, target.status);
					} else {
						this.add('-fail', target);
					}
					return false;
				}
			}
			if (moveData.forceStatus) {
				hitResult = target.setStatus(moveData.forceStatus, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.volatileStatus) {
				hitResult = target.addVolatile(moveData.volatileStatus, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.sideCondition) {
				hitResult = target.side.addSideCondition(moveData.sideCondition, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.weather) {
				hitResult = this.setWeather(moveData.weather, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.pseudoWeather) {
				hitResult = this.addPseudoWeather(moveData.pseudoWeather, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.forceSwitch) {
				if (this.canSwitch(target.side)) didSomething = true; // at least defer the fail message to later
			}
			if (moveData.selfSwitch) {
				if (this.canSwitch(pokemon.side)) didSomething = true; // at least defer the fail message to later
			}
			// Hit events
			//   These are like the TryHit events, except we don't need a FieldHit event.
			//   Scroll up for the TryHit event documentation, and just ignore the "Try" part. ;)
			hitResult = null;
			if (move.target === 'all' && !isSelf) {
				if (moveData.onHitField) hitResult = this.singleEvent('HitField', moveData, {}, target, pokemon, move);
			} else if ((move.target === 'foeSide' || move.target === 'allySide') && !isSelf) {
				if (moveData.onHitSide) hitResult = this.singleEvent('HitSide', moveData, {}, target.side, pokemon, move);
			} else {
				if (moveData.onHit) hitResult = this.singleEvent('Hit', moveData, {}, target, pokemon, move);
				if (!isSelf && !isSecondary) {
					this.runEvent('Hit', target, pokemon, move);
				}
				if (moveData.onAfterHit) hitResult = this.singleEvent('AfterHit', moveData, {}, target, pokemon, move);
			}

			if (!hitResult && !didSomething && !moveData.self && !moveData.selfdestruct) {
				if (!isSelf && !isSecondary) {
					if (hitResult === false || didSomething === false) this.add('-fail', target);
				}
				this.debug('move failed because it did nothing');
				return false;
			}
		}
		if (moveData.self) {
			var selfRoll;
			if (!isSecondary && moveData.self.boosts) selfRoll = this.random(100);
			// This is done solely to mimic in-game RNG behaviour. All self drops have a 100% chance of happening but still grab a random number.
			if (typeof moveData.self.chance === 'undefined' || selfRoll < moveData.self.chance) {
				this.moveHit(pokemon, pokemon, move, moveData.self, isSecondary, true);
			}
		}
		if (moveData.secondaries && this.runEvent('TrySecondaryHit', target, pokemon, moveData)) {
			for (var i = 0; i < moveData.secondaries.length; i++) {
				// We check here whether to negate the probable secondary status if it's burn or freeze.
				// In the game, this is checked and if true, the random number generator is not called.
				// That means that a move that does not share the type of the target can status it.
				// This means tri-attack can burn fire-types and freeze ice-types.
				// Unlike gen 1, though, paralysis works for all unless the target is immune to direct move (ie. ground-types and t-wave).
				if (!(moveData.secondaries[i].status && moveData.secondaries[i].status in {'brn':1, 'frz':1} && target && target.hasType(move.type))) {
					var effectChance = Math.floor(moveData.secondaries[i].chance * 255 / 100);
					if (typeof moveData.secondaries[i].chance === 'undefined' || this.random(256) < effectChance) {
						this.moveHit(target, pokemon, move, moveData.secondaries[i], true, isSelf);
					}
				}
			}
		}
		if (target && target.hp > 0 && pokemon.hp > 0 && moveData.forceSwitch && this.canSwitch(target.side)) {
			hitResult = this.runEvent('DragOut', target, pokemon, move);
			if (hitResult) {
				target.forceSwitchFlag = true;
			} else if (hitResult === false) {
				this.add('-fail', target);
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

		// Let's test for immunities.
		if (move.affectedByImmunities) {
			if (!target.runImmunity(move.type, true)) {
				return false;
			}
		}

		// Is it an OHKO move?
		if (move.ohko) {
			// If it is, move hits if the Pokémon is more level.
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
		var unboosted = false;
		var noburndrop = false;

		// The move is a critical hit. Several things happen here.
		if (move.crit) {
			// Level is doubled for damage calculation.
			level *= 2;
			if (!suppressMessages) this.add('-crit', target);
			// If the attacker is burned, stat level modifications are always ignored. This includes screens.
			if (attacker.status === 'brn') unboosted = true;
			// Stat level modifications are ignored if they are neutral to or favour the defender.
			// Reflect and Light Screen defensive boosts are only ignored if stat level modifications were also ignored as a result of that.
			if (attacker.boosts[atkType] <= defender.boosts[defType]) {
				unboosted = true;
				noburndrop = true;
			}
		}
		// Get stats now.
		var attack = attacker.getStat(atkType, unboosted, noburndrop);
		var defense = defender.getStat(defType, unboosted);

		// Moves that ignore offense and defense respectively.
		if (move.ignoreOffensive) {
			this.debug('Negating (sp)atk boost/penalty.');
			// The attack drop from the burn is only applied when attacker's attack level is higher than defender's defense level.
			attack = attacker.getStat(atkType, true, true);
		}
		if (move.ignoreDefensive) {
			this.debug('Negating (sp)def boost/penalty.');
			defense = target.getStat(defType, true, true);
		}

		// When either attack or defense are higher than 256, they are both divided by 4 and moded by 256.
		// This is what cuases the roll over bugs.
		if (attack >= 256 || defense >= 256) {
			attack = this.clampIntRange(Math.floor(attack / 4) % 256, 1);
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

		// Type effectiveness
		var totalTypeMod = this.getEffectiveness(type, target);
		// Super effective attack
		if (totalTypeMod > 0) {
			if (!suppressMessages) this.add('-supereffective', target);
			damage *= 2;
			if (totalTypeMod >= 2) {
				damage *= 2;
			}
		}
		// Resisted attack
		if (totalTypeMod < 0) {
			if (!suppressMessages) this.add('-resisted', target);
			damage = Math.floor(damage / 2);
			if (totalTypeMod <= -2) {
				damage = Math.floor(damage / 2);
			}
		}

		// Apply random factor is damage is greater than 1
		if (damage > 1) {
			damage *= this.random(217, 256);
			damage = Math.floor(damage / 255);
			if (damage > target.hp && !target.volatiles['substitute']) damage = target.hp;
		}

		// If damage is less than 1, we return 1
		if (basePower && !Math.floor(damage)) {
			return 1;
		}

		// We are done, this is the final damage
		return damage;
	},
	faint: function (pokemon, source, effect) {
		pokemon.faint(source, effect);
		this.queue = [];
	},
	getResidualStatuses: function (thing, callbackType) {
		var statuses = this.getRelevantEffectsInner(thing || this, callbackType || 'residualCallback', null, null, false, true, 'duration');
		statuses.sort(this.comparePriority);
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
			return b.speed - a.speed;
		}
		if (b.subOrder - a.subOrder) {
			return -(b.subOrder - a.subOrder);
		}
		return Math.random() - 0.5;
	},
	runDecision: function (decision) {
		// We have to declare here the vars we are going to use on the switch outside of blocks due to the let hack on the gulpfile.
		var pokemon, beginCallback, target, i;

		// returns whether or not we ended in a callback
		switch (decision.choice) {
		case 'start':
			// I GIVE UP, WILL WRESTLE WITH EVENT SYSTEM LATER
			beginCallback = this.getFormat().onBegin;
			if (beginCallback) beginCallback.call(this);

			this.add('start');
			for (var pos = 0; pos < this.p1.active.length; pos++) {
				this.switchIn(this.p1.pokemon[pos], pos);
			}
			for (var pos = 0; pos < this.p2.active.length; pos++) {
				this.switchIn(this.p2.pokemon[pos], pos);
			}
			for (var pos = 0; pos < this.p1.pokemon.length; pos++) {
				pokemon = this.p1.pokemon[pos];
				this.singleEvent('Start', this.getEffect(pokemon.species), pokemon.speciesData, pokemon);
			}
			for (var pos = 0; pos < this.p2.pokemon.length; pos++) {
				pokemon = this.p2.pokemon[pos];
				this.singleEvent('Start', this.getEffect(pokemon.species), pokemon.speciesData, pokemon);
			}
			this.midTurn = true;
			break;
		case 'move':
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			this.runMove(decision.move, decision.pokemon, this.getTarget(decision), decision.sourceEffect);
			break;
		case 'beforeTurnMove':
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			this.debug('before turn callback: ' + decision.move.id);
			target = this.getTarget(decision);
			if (!target) return false;
			decision.move.beforeTurnCallback.call(this, decision.pokemon, target);
			break;
		case 'event':
			this.runEvent(decision.event, decision.pokemon);
			break;
		case 'team':
			i = parseInt(decision.team[0], 10) - 1;
			if (i >= 6 || i < 0) return;

			if (decision.team[1]) {
				// validate the choice
				var len = decision.side.pokemon.length;
				var newPokemon = [null, null, null, null, null, null].slice(0, len);
				for (var j = 0; j < len; j++) {
					var i = parseInt(decision.team[j], 10) - 1;
					newPokemon[j] = decision.side.pokemon[i];
				}
				var reject = false;
				for (var j = 0; j < len; j++) {
					if (!newPokemon[j]) reject = true;
				}
				if (!reject) {
					for (var j = 0; j < len; j++) {
						newPokemon[j].position = j;
					}
					decision.side.pokemon = newPokemon;
					return;
				}
			}

			if (i === 0) return;
			pokemon = decision.side.pokemon[i];
			if (!pokemon) return;
			decision.side.pokemon[i] = decision.side.pokemon[0];
			decision.side.pokemon[0] = pokemon;
			decision.side.pokemon[i].position = i;
			decision.side.pokemon[0].position = 0;
			// we return here because the update event would crash since there are no active pokemon yet
			return;
		case 'pass':
			if (!decision.priority || decision.priority <= 101) return;
			if (decision.pokemon) {
				decision.pokemon.switchFlag = false;
			}
			break;
		case 'switch':
			if (decision.pokemon) {
				decision.pokemon.beingCalledBack = true;
				var lastMove = this.getMove(decision.pokemon.lastMove);
				if (lastMove.selfSwitch !== 'copyvolatile') {
					this.runEvent('BeforeSwitchOut', decision.pokemon);
				}
				if (!this.runEvent('SwitchOut', decision.pokemon)) {
					break;
				}
				this.singleEvent('End', this.getAbility(decision.pokemon.ability), decision.pokemon.abilityData, decision.pokemon);
			}
			if (decision.pokemon && !decision.pokemon.hp && !decision.pokemon.fainted) {
				// A pokemon fainted from Pursuit before it could switch.
				// In gen 2, the switch still happens.
				decision.priority = -101;
				this.queue.unshift(decision);
				this.debug('Pursuit target fainted');
				break;
			}
			if (decision.target.isActive) {
				this.debug('Switch target is already active');
				break;
			}
			this.switchIn(decision.target, decision.pokemon.position);
			break;
		case 'runSwitch':
			this.runEvent('SwitchIn', decision.pokemon);
			this.runEvent('AfterSwitchInSelf', decision.pokemon);
			if (!decision.pokemon.hp) break;
			decision.pokemon.isStarted = true;
			if (!decision.pokemon.fainted) {
				this.singleEvent('Start', decision.pokemon.getAbility(), decision.pokemon.abilityData, decision.pokemon);
				this.singleEvent('Start', decision.pokemon.getItem(), decision.pokemon.itemData, decision.pokemon);
			}
			break;
		case 'beforeTurn':
			this.eachEvent('BeforeTurn');
			break;
		case 'residual':
			this.add('');
			this.clearActiveMove(true);
			this.residualEvent('Residual');
			break;
		}

		// phazing (Roar, etc)

		var self = this;
		function checkForceSwitchFlag(a) {
			if (!a) return false;
			if (a.hp && a.forceSwitchFlag) {
				self.dragIn(a.side, a.position);
			}
			delete a.forceSwitchFlag;
		}
		this.p1.active.forEach(checkForceSwitchFlag);
		this.p2.active.forEach(checkForceSwitchFlag);

		this.clearActiveMove();

		// fainting

		this.faintMessages();
		if (this.ended) return true;

		// switching (fainted pokemon, U-turn, Baton Pass, etc)

		if (!this.queue.length || (this.gen <= 3 && this.queue[0].choice in {move:1, residual:1})) {
			// in gen 3 or earlier, switching in fainted pokemon is done after
			// every move, rather than only at the end of the turn.
			this.checkFainted();
		} else if (decision.choice === 'pass') {
			this.eachEvent('Update');
			return false;
		}

		function hasSwitchFlag(a) { return a ? a.switchFlag : false; }
		function removeSwitchFlag(a) { if (a) a.switchFlag = false; }
		var p1switch = this.p1.active.any(hasSwitchFlag);
		var p2switch = this.p2.active.any(hasSwitchFlag);

		if (p1switch && !this.canSwitch(this.p1)) {
			this.p1.active.forEach(removeSwitchFlag);
			p1switch = false;
		}
		if (p2switch && !this.canSwitch(this.p2)) {
			this.p2.active.forEach(removeSwitchFlag);
			p2switch = false;
		}

		if (p1switch || p2switch) {
			this.makeRequest('switch');
			return true;
		}

		this.eachEvent('Update');

		return false;
	}
};
