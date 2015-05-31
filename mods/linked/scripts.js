exports.BattleScripts = {
	runMove: function (move, pokemon, target, sourceEffect) {
		if (!sourceEffect && toId(move) !== 'struggle') {
			var changedMove = this.runEvent('OverrideDecision', pokemon, target, move);
			if (changedMove === false) return; // Linked: Encore hack
			if (changedMove && changedMove !== true) {
				move = changedMove;
				target = null;
			}
		}
		move = this.getMove(move);
		if (!target && target !== false) target = this.resolveTarget(pokemon, move);

		this.setActiveMove(move, pokemon, target);

		// Linked: Pokemon can move more than once per turn
		/* if (pokemon.moveThisTurn) {
			// THIS IS PURELY A SANITY CHECK
			// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
			// USE this.cancelMove INSTEAD
			this.debug('' + pokemon.id + ' INCONSISTENT STATE, ALREADY MOVED: ' + pokemon.moveThisTurn);
			this.clearActiveMove(true);
			return;
		}*/
		if (!this.runEvent('BeforeMove', pokemon, target, move)) {
			// Prevent invulnerability from persisting until the turn ends
			// Linked: make sure that the cancelled move is the correct one.
			if (pokemon.volatiles['twoturnmove'] && pokemon.volatiles['twoturnmove'].move === move.id) {
				pokemon.removeVolatile('twoturnmove');
			}
			this.clearActiveMove(true);
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
		this.singleEvent('AfterMove', move, null, pokemon, target, move);
	},
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
					'megaEvo': 5.9,
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

				var linkedMoves = decision.pokemon.getLinkedMoves();
				if (linkedMoves.length) {
					var decisionMove = toId(decision.move);
					var index = linkedMoves.indexOf(decisionMove);
					if (index !== -1) {
						// flag the move as linked here
						decision.linked = linkedMoves;
						if (this.getMove(linkedMoves[1 - index]).beforeTurnCallback) {
							this.addQueue({choice: 'beforeTurnMove', pokemon: decision.pokemon, move: linkedMoves[1 - index], targetLoc: decision.targetLoc}, true);
						}
					}
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
					// this target is not relevant to Linked (or any other game mode)
					target = this.resolveTarget(decision.pokemon, decision.move);
					decision.targetSide = target.side;
					decision.targetPosition = target.position;
				}

				decision.move = this.getMoveCopy(decision.move);
				if (!decision.priority) {
					var priority = decision.move.priority;
					priority = this.runEvent('ModifyPriority', decision.pokemon, target, decision.move, priority);

					// Linked: if two moves are linked, the effective priority is minimized
					var linkedMoves = decision.pokemon.getLinkedMoves();
					if (linkedMoves.length) {
						var decisionMove = toId(decision.move);
						var index = linkedMoves.indexOf(decisionMove);
						if (index !== -1) {
							var altMove = this.getMoveCopy(linkedMoves[1 - index]);
							var altPriority = altMove.priority;
							altPriority = this.runEvent('ModifyPriority', decision.pokemon, target, altMove, altPriority);
							priority = Math.min(priority, altPriority);
						}
					}

					decision.priority = priority;
					// In Gen 6, Quick Guard blocks moves with artificially enhanced priority.
					if (this.gen > 5) decision.move.priority = priority;
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
	runDecision: function (decision) {
		var pokemon;

		// returns whether or not we ended in a callback
		switch (decision.choice) {
		case 'start':
			// I GIVE UP, WILL WRESTLE WITH EVENT SYSTEM LATER
			var beginCallback = this.getFormat().onBegin;
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
			if (decision.linked) {
				var linkedMoves = decision.linked;
				for (var i = linkedMoves.length - 1; i >= 0; i--) {
					var pseudoDecision = {choice: 'move', move: linkedMoves[i], targetLoc: decision.targetLoc, pokemon: decision.pokemon, targetPosition: decision.targetPosition, targetSide: decision.targetSide};
					this.queue.unshift(pseudoDecision);
				}
				return;
			}
			this.runMove(decision.move, decision.pokemon, this.getTarget(decision), decision.sourceEffect);
			break;
		case 'megaEvo':
			if (decision.pokemon.canMegaEvo) this.runMegaEvo(decision.pokemon);
			break;
		case 'beforeTurnMove':
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			this.debug('before turn callback: ' + decision.move.id);
			var target = this.getTarget(decision);
			if (!target) return false;
			decision.move.beforeTurnCallback.call(this, decision.pokemon, target);
			break;
		case 'event':
			this.runEvent(decision.event, decision.pokemon);
			break;
		case 'team':
			var len = decision.side.pokemon.length;
			var newPokemon = [null, null, null, null, null, null].slice(0, len);
			for (var j = 0; j < len; j++) {
				var i = decision.team[j];
				newPokemon[j] = decision.side.pokemon[i];
				newPokemon[j].position = j;
			}
			decision.side.pokemon = newPokemon;

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
				var lastMove = this.getMove(decision.pokemon.getLastMoveAbsolute());
				if (lastMove.selfSwitch !== 'copyvolatile') {
					this.runEvent('BeforeSwitchOut', decision.pokemon);
				}
				if (!this.runEvent('SwitchOut', decision.pokemon)) {
					// Warning: DO NOT interrupt a switch-out
					// if you just want to trap a pokemon.
					// To trap a pokemon and prevent it from switching out,
					// (e.g. Mean Look, Magnet Pull) use the 'trapped' flag
					// instead.

					// Note: Nothing in BW or earlier interrupts
					// a switch-out.
					break;
				}
				this.singleEvent('End', this.getAbility(decision.pokemon.ability), decision.pokemon.abilityData, decision.pokemon);
			}
			if (decision.pokemon && !decision.pokemon.hp && !decision.pokemon.fainted) {
				// a pokemon fainted from Pursuit before it could switch
				if (this.gen <= 4) {
					// in gen 2-4, the switch still happens
					decision.priority = -101;
					this.queue.unshift(decision);
					this.debug('Pursuit target fainted');
					break;
				}
				// in gen 5+, the switch is cancelled
				this.debug('A Pokemon can\'t switch between when it runs out of HP and when it faints');
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
			if (this.gen === 1 && !decision.pokemon.side.faintedThisTurn) this.runEvent('AfterSwitchInSelf', decision.pokemon);
			if (!decision.pokemon.hp) break;
			decision.pokemon.isStarted = true;
			if (!decision.pokemon.fainted) {
				this.singleEvent('Start', decision.pokemon.getAbility(), decision.pokemon.abilityData, decision.pokemon);
				this.singleEvent('Start', decision.pokemon.getItem(), decision.pokemon.itemData, decision.pokemon);
			}
			break;
		case 'shift':
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			this.swapPosition(decision.pokemon, 1);
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
			if (this.gen >= 5) {
				this.eachEvent('Update');
			}
			this.makeRequest('switch');
			return true;
		}

		this.eachEvent('Update');

		return false;
	},
	comparePriority: function (a, b) { // intentionally not in Battle.prototype
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
	pokemon: {
		moveUsed: function (move) { // overrided
			var lastMove = this.moveThisTurn ? [this.moveThisTurn, this.battle.getMove(move).id] : this.battle.getMove(move).id;
			this.lastMove = lastMove;
			this.moveThisTurn = lastMove;
		},
		getLastMoveAbsolute: function () { // used
			if (Array.isArray(this.lastMove)) return this.lastMove[1];
			return this.lastMove;
		},
		checkMoveThisTurn: function (move) {
			move = toId(move);
			if (Array.isArray(this.moveThisTurn)) return this.moveThisTurn.indexOf(move) >= 0;
			return this.moveThisTurn === move;
		},
		getLinkedMoves: function () {
			var linkedMoves = this.moveset.slice(0, 2);
			if (linkedMoves.length !== 2 || linkedMoves[0].pp <= 0 || linkedMoves[1].pp <= 0) return [];
			return linkedMoves.map('id');
		},
		hasLinkedMove: function (move) {
			move = toId(move);
			var linkedMoves = this.getLinkedMoves();
			if (!linkedMoves.length) return;

			return linkedMoves[0] === move || linkedMoves[1] === move;
		}
	}
};
