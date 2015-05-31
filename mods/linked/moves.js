exports.BattleMovedex = {
	/**
	 * Artificial priority
	 *
	 */
	pursuit: {
		inherit: true,
		beforeTurnCallback: function (pokemon, target) {
			var linkedMoves = pokemon.getLinkedMoves();
			if (linkedMoves.length) {
				if (linkedMoves[0] === 'pursuit' && linkedMoves[1] !== 'pursuit') return;
				if (linkedMoves[0] !== 'pursuit' && linkedMoves[1] === 'pursuit') return;
			}

			target.side.addSideCondition('pursuit', pokemon);
			if (!target.side.sideConditions['pursuit'].sources) {
				target.side.sideConditions['pursuit'].sources = [];
			}
			target.side.sideConditions['pursuit'].sources.push(pokemon);
		}
	},
	mefirst: {
		inherit: true,
		onHit: function (target, pokemon) {
			var decision = this.willMove(target);
			if (!decision) return false;
			var noMeFirst = {
				chatter:1, counter:1, covet:1, focuspunch:1, mefirst:1, metalburst:1, mirrorcoat:1, struggle:1, thief:1
			};
			// Mod-specific: Me First copies the first move in the link
			var move = this.getMove(decision.linked ? decision.linked[0] : decision.move);
			if (move.category !== 'Status' && !noMeFirst[move]) {
				pokemon.addVolatile('mefirst');
				this.useMove(move, pokemon);
				return;
			}
			return false;
		}
	},
	quash: {
		inherit: true
		// Mod-specific: default mechanics
	},

	/**
	 *	Sucker Punch
	 *	Will miss on two linked Status moves
	 *
	 */

	suckerpunch: {
		inherit: true,
		onTry: function (source, target) {
			var decision = this.willMove(target);
			if (!decision || decision.choice !== 'move') {
				this.add('-fail', source);
				return false;
			}
			if (target.volatiles['mustrecharge'] && target.volatiles['mustrecharge'].duration < 2) {
				// Duration may not be lower than 2 if Sucker Punch is used as a low-priority move
				// i.e. if Sucker Punch is linked with a negative priority move
				this.add('-fail', source);
				return false;
			}
			if (!decision.linked) {
				if (decision.move.category !== 'Status' || decision.move.id === 'mefirst') return;
				this.add('-fail', source);
				return false;
			}

			for (var i = 0; i < decision.linked.length; i++) {
				var linkedMove = this.getMove(decision.linked[i]);
				if (linkedMove.category !== 'Status' || linkedMove.id === 'mefirst') return;
			}
			this.add('-fail', source);
			return false;
		}
	},


	/**
	 * Pledges
	 * If two Pledge moves are linked, the joint effect is triggered
	 *
	 **/

	firepledge: {
		inherit: true
		// Mod-specific: default mechanics
	},
	grasspledge: {
		inherit: true
		// Mod-specific: default mechanics
	},
	waterpledge: {
		inherit: true
		// Mod-specific: default mechanics
	},

	/**
	 * Mimic and Sketch
	 * When any of them is linked, the link will get updated for the new move
	 * They will copy the last absolute single move used by the foe.
	 *
	 **/

	sketch: {
		inherit: true,
		onHit: function (target, source) {
			var disallowedMoves = {chatter:1, sketch:1, struggle:1};
			var lastMove = target.getLastMoveAbsolute();
			if (source.transformed || !lastMove || disallowedMoves[lastMove] || source.moves.indexOf(lastMove) !== -1) return false;
			var moveslot = source.moves.indexOf('sketch');
			if (moveslot === -1) return false;
			var move = Tools.getMove(lastMove);
			var sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false
			};
			source.moveset[moveslot] = sketchedMove;
			source.baseMoveset[moveslot] = sketchedMove;
			source.moves[moveslot] = toId(move.name);
			this.add('-activate', source, 'move: Sketch', move.name);
		}
	},
	mimic: {
		inherit: true,
		onHit: function (target, source) {
			var disallowedMoves = {chatter:1, mimic:1, sketch:1, struggle:1, transform:1};
			var lastMove = target.getLastMoveAbsolute();
			if (source.transformed || !lastMove || disallowedMoves[lastMove] || source.moves.indexOf(lastMove) !== -1) return false;
			var moveslot = source.moves.indexOf('mimic');
			if (moveslot === -1) return false;
			var move = Tools.getMove(lastMove);
			source.moveset[moveslot] = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false
			};
			source.moves[moveslot] = toId(move.name);
			this.add('-start', source, 'Mimic', move.name);
		}
	},

	/**
	 * Copycat and Mirror Move
	 * Copy/call the last absolute move used by the target
	 *
	 */

	copycat: {
		inherit: true,
		onHit: function (pokemon) {
			var noCopycat = {assist:1, bestow:1, chatter:1, circlethrow:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, dragontail:1, endure:1, feint:1, focuspunch:1, followme:1, helpinghand:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, naturepower:1, protect:1, ragepowder:1, roar:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, switcheroo:1, thief:1, transform:1, trick:1, whirlwind:1};
			var lastMove = pokemon.getLastMoveAbsolute();
			if (!lastMove || noCopycat[lastMove]) return false;
			this.useMove(lastMove, pokemon);
		}
	},
	mirrormove: {
		inherit: true,
		onTryHit: function (target) {
			var lastMove = target.getLastMoveAbsolute();
			if (!lastMove || !this.getMove(lastMove).flags['mirror']) {
				return false;
			}
		},
		onHit: function (target, source) {
			this.useMove(target.getLastMoveAbsolute(), source);
		}
	},

	/**
	 * Disable, Encore and Torment
	 * Disabling effects
	 *
	 */

	disable: {
		inherit: true,
		effect: {
			duration: 4,
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function (pokemon) {
				var lastMove = pokemon.getLastMoveAbsolute();
				if (!this.willMove(pokemon)) {
					this.effectData.duration++;
				}
				if (!lastMove) {
					this.debug('pokemon hasn\'t moved yet');
					return false;
				}
				var moves = pokemon.moveset;
				for (var i = 0; i < moves.length; i++) {
					if (moves[i].id === lastMove) {
						if (!moves[i].pp) {
							this.debug('Move out of PP');
							return false;
						} else {
							this.add('-start', pokemon, 'Disable', moves[i].move);
							this.effectData.move = lastMove;
							return;
						}
					}
				}
				this.debug('Move doesn\'t exist ???');
				return false;
			},
			onResidualOrder: 14,
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'Disable');
			},
			onBeforeMovePriority: 7,
			onBeforeMove: function (attacker, defender, move) {
				if (move.id === this.effectData.move) {
					this.add('cant', attacker, 'Disable', move);
					return false;
				}
			},
			onDisableMove: function (pokemon) {
				var moves = pokemon.moveset;
				for (var i = 0; i < moves.length; i++) {
					if (moves[i].id === this.effectData.move) {
						pokemon.disableMove(moves[i].id);
					}
				}
			}
		}
	},
	encore: {
		inherit: true,
		effect: {
			duration: 3,
			onStart: function (target) {
				var noEncore = {encore:1, mimic:1, mirrormove:1, sketch:1, struggle:1, transform:1};
				var lastMove = target.getLastMoveAbsolute();
				var moveIndex = target.moves.indexOf(lastMove);
				if (!lastMove) {
					// it failed
					delete target.volatiles['encore'];
					return false;
				}
				if (target.hasLinkedMove(lastMove)) {
					var linkedMoves = target.getLinkedMoves();
					if (noEncore[linkedMoves[0]] || noEncore[linkedMoves[1]] || target.moveset[0].pp <= 0 || target.moveset[1].pp <= 0) {
						// it failed
						delete target.volatiles['encore'];
						return false;
					}
				} else {
					if (noEncore[lastMove] || (target.moveset[moveIndex] && target.moveset[moveIndex].pp <= 0)) {
						// it failed
						delete target.volatiles['encore'];
						return false;
					}
				}
				this.effectData.move = lastMove;
				this.add('-start', target, 'Encore');
				if (!this.willMove(target)) {
					this.effectData.duration++;
				}
			},
			onOverrideDecision: function (pokemon, target, move) {
				if (this.willMove(pokemon)) return false;
				if (pokemon.hasLinkedMove(this.effectData.move)) {
					var linkedMoves = pokemon.getLinkedMoves();
					// pass a `sourceEffect` argument to prevent infinite recursion at `runMove`
					this.runMove(linkedMoves[0], pokemon, target, this.effectData);
					return move.id !== linkedMoves[1] ? linkedMoves[1] : void 0; // are we fine with this targetting method? (Doubles/Triples)
				}
				if (move.id !== this.effectData.move) return this.effectData.move;
			},
			onResidualOrder: 13,
			onResidual: function (target) {
				// early termination if you run out of PP
				var lastMove = target.getLastMoveAbsolute();

				var index = target.moves.indexOf(lastMove);
				if (index === -1) return; // no last move

				if (target.hasLinkedMove(lastMove)) {
					if (target.moveset[0].pp <= 0 || target.moveset[1].pp <= 0) {
						delete target.volatiles.encore;
						this.add('-end', target, 'Encore');
					}
				} else {
					if (target.moveset[index].pp <= 0) {
						delete target.volatiles.encore;
						this.add('-end', target, 'Encore');
					}
				}
			},
			onEnd: function (target) {
				this.add('-end', target, 'Encore');
			},
			onDisableMove: function (pokemon) {
				if (!this.effectData.move) return; // ??
				if (!pokemon.hasMove(this.effectData.move)) {
					return;
				}
				if (pokemon.hasLinkedMove(this.effectData.move)) {
					// taking advantage of the fact that the first two move slots are reserved to linked moves
					for (var i = 2; i < pokemon.moveset.length; i++) {
						pokemon.disableMove(pokemon.moveset[i].id);
					}
				} else {
					for (var i = 0; i < pokemon.moveset.length; i++) {
						if (pokemon.moveset[i].id !== this.effectData.move) {
							pokemon.disableMove(pokemon.moveset[i].id);
						}
					}
				}
			}
		}
	},
	torment: {
		inherit: true,
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Torment');
			},
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'Torment');
			},
			onDisableMove: function (pokemon) {
				var lastMove = pokemon.lastMove;
				if (lastMove === 'struggle') return;

				if (Array.isArray(lastMove)) {
					for (var i = 0; i < lastMove.length; i++) {
						pokemon.disableMove(lastMove[i]);
					}
				} else {
					pokemon.disableMove(lastMove);
				}
			}
		}
	},

	/**
	 * Spite and Grudge
	 * Decrease the PP of the last absolute move used by the target
	 * Also, Grudge's effect won't be removed by its linked move, if any
	 *
	 */

	grudge: {
		inherit: true,
		effect: {
			onStart: function (pokemon) {
				this.add('-singlemove', pokemon, 'Grudge');
			},
			onFaint: function (target, source, effect) {
				this.debug('Grudge detected fainted pokemon');
				if (!source || !effect) return;
				if (effect.effectType === 'Move') {
					var lastMove = source.getLastMoveAbsolute();
					for (var i in source.moveset) {
						if (source.moveset[i].id === lastMove) {
							source.moveset[i].pp = 0;
							this.add('-activate', source, 'Grudge', this.getMove(lastMove).name);
						}
					}
				}
			},
			onBeforeMovePriority: 100,
			onBeforeMove: function (pokemon) {
				if (pokemon.moveThisTurn) return; // Second stage of a Linked move
				this.debug('removing Grudge before attack');
				pokemon.removeVolatile('grudge');
			}
		}
	},
	spite: {
		inherit: true,
		onHit: function (target) {
			var lastMove = target.getLastMoveAbsolute();
			if (target.deductPP(lastMove, 4)) {
				this.add("-activate", target, 'move: Spite', lastMove, 4);
				return;
			}
			return false;
		}
	},

	/**
	 * Rollout and Ice Ball
	 *
	 */

	rollout: {
		inherit: true
		// Mod-specific: default mechanics
	},
	iceball: {
		inherit: true
		// Mod-specific: default mechanics
	},

	/**
	 * Other moves that check `pokemon.lastMove`
	 * (may behave counter-intuitively if left unmodded)
	 *
	 **/

	conversion2: {
		inherit: true,
		onHit: function (target, source) {
			var lastMove = target.getLastMoveAbsolute();
			if (!lastMove) return false;
			var possibleTypes = [];
			var attackType = this.getMove(lastMove).type;
			for (var type in this.data.TypeChart) {
				if (source.hasType(type) || target.hasType(type)) continue;
				var typeCheck = this.data.TypeChart[type].damageTaken[attackType];
				if (typeCheck === 2 || typeCheck === 3) {
					possibleTypes.push(type);
				}
			}
			if (!possibleTypes.length) {
				return false;
			}
			var type = possibleTypes[this.random(possibleTypes.length)];

			if (!source.setType(type)) return false;
			this.add('-start', source, 'typechange', type);
		}
	},
	destinybond: {
		inherit: true,
		effect: {
			onStart: function (pokemon) {
				this.add('-singlemove', pokemon, 'Destiny Bond');
			},
			onFaint: function (target, source, effect) {
				if (!source || !effect) return;
				if (effect.effectType === 'Move' && !effect.isFutureMove) {
					this.add('-activate', target, 'Destiny Bond');
					source.faint();
				}
			},
			onBeforeMovePriority: 100,
			onBeforeMove: function (pokemon, target, move) {
				// Second stage of a Linked move does not remove Destiny Bond
				if (pokemon.moveThisTurn) return;
				this.debug('removing Destiny Bond before attack');
				pokemon.removeVolatile('destinybond');
			}
		}
	},
	trumpcard: {
		inherit: true,
		basePowerCallback: function (pokemon) {
			var move = pokemon.getMoveData(pokemon.getLastMoveAbsolute()); // Account for calling Trump Card via other moves
			switch (move.pp) {
			case 0:
				return 200;
			case 1:
				return 80;
			case 2:
				return 60;
			case 3:
				return 50;
			default:
				return 40;
			}
		}
	},
	uproar: {
		inherit: true
		// Mod-specific: default mechanics
	},

	/**
	 * Moves that check `pokemon.moveThisTurn`
	 * (may behave counter-intuitively if left unmodded)
	 *
	 **/

	 fusionbolt: {
		inherit: true,
		onBasePower: function (basePower, pokemon) {
			var actives = pokemon.side.active;
			for (var i = 0; i < actives.length; i++) {
				if (actives[i] && actives[i].checkMoveThisTurn('fusionflare')) {
					this.debug('double power');
					return this.chainModify(2);
				}
			}
		}
	 },
	 fusionflare: {
		inherit: true,
		onBasePower: function (basePower, pokemon) {
			var actives = pokemon.side.active;
			for (var i = 0; i < actives.length; i++) {
				if (actives[i] && actives[i].checkMoveThisTurn('fusionbolt')) {
					this.debug('double power');
					return this.chainModify(2);
				}
			}
		}
	 },

	/**
	 * Moves that should clean the house after running
	 * (but aren't doing so in standard for whatever reason)
	 */

	beatup: {
		inherit: true,
		onAfterMove: function (pokemon) {
			pokemon.removeVolatile('beatup');
		}
	},
	triplekick: {
		inherit: true,
		onAfterMove: function (pokemon) {
			pokemon.removeVolatile('triplekick');
		}
	},

	/**
	 * Moves that should clean the house if they aren't run
	 *
	 */

	 furycutter: {
		inherit: true,
		effect: {
			duration: 2,
			onStart: function () {
				this.effectData.multiplier = 1;
			},
			onRestart: function () {
				if (this.effectData.multiplier < 4) {
					this.effectData.multiplier <<= 1;
				}
				this.effectData.duration = 2;
			},
			onBeforeMove: function (pokemon, target, move) {
				if (move.id !== 'furycutter') pokemon.removeVolatile('furycutter');
			}
		}
	 },

	/**
	 * First Law of Pokémon Simulation:
	 * Always make sure that Sky Drop works
	 *
	 */

	 skydrop: {
		inherit: true,
		effect: {
			duration: 2,
			onDragOut: false,
			onSourceDragOut: false,
			onFoeModifyPokemon: function (defender) {
				if (defender !== this.effectData.source) return;
				defender.trapped = true;
			},
			onFoeBeforeMovePriority: 11,
			onFoeBeforeMove: function (attacker, defender, move) {
				if (attacker === this.effectData.source) {
					this.debug('Sky drop nullifying.');
					return null;
				}
			},
			onRedirectTarget: function (target, source, source2) {
				if (source !== this.effectData.target) return;
				if (this.effectData.source.fainted) return;
				return this.effectData.source;
			},
			onAnyAccuracy: function (accuracy, target, source, move) {
				// both user and target of Sky Drop avoid moves, yet
				// not moves targetting themselves (Linked)

				if (target !== this.effectData.target && target !== this.effectData.source) {
					return;
				}
				if (source === this.effectData.target && target === this.effectData.source) {
					return;
				}
				if (source === target) return;

				if (move.id === 'gust' || move.id === 'twister') {
					return;
				}
				if (move.id === 'skyuppercut' || move.id === 'thunder' || move.id === 'hurricane' || move.id === 'smackdown' || move.id === 'thousandarrows' || move.id === 'helpinghand') {
					return;
				}
				if (source.hasAbility('noguard') || target.hasAbility('noguard')) {
					return;
				}
				if (source.volatiles['lockon'] && target === source.volatiles['lockon'].source) return;
				return 0;
			},
			onAnyBasePower: function (basePower, target, source, move) {
				if (target !== this.effectData.target && target !== this.effectData.source) {
					return;
				}
				if (source === this.effectData.target && target === this.effectData.source) {
					return;
				}
				if (move.id === 'gust' || move.id === 'twister') {
					return this.chainModify(2);
				}
			},
			onFaint: function (target) {
				if (target.volatiles['skydrop'] && target.volatiles['twoturnmove'].source) {
					this.add('-end', target.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
				}
			}
		}
	}
};
