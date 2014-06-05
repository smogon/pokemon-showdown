/**
 * A lot of Gen 1 moves have to be updated due to different mechanics.
 * Some moves have had major changes, such as Bite's typing.
 */
exports.BattleMovedex = {
	acid: {
		inherit: true,
		target: "normal"
	},
	amnesia: {
		inherit: true,
		desc: "Raises the user's Special by 2 stages.",
		shortDesc: "Boosts the user's Special by 2.",
		boosts: {
			spd: 2,
			spa: 2
		}
	},
	aurorabeam: {
		inherit: true,
		secondary: {
			chance: 10,
			boosts: {
				atk: -1
			}
		}
	},
	bide: {
		inherit: true,
		priority: 0,
		accuracy: true,
		ignoreEvasion: true,
		effect: {
			duration: 2,
			durationCallBack: function (target, source, effect) {
				return this.random(3, 4);
			},
			onStart: function (pokemon) {
				this.effectData.totalDamage = 0;
				this.effectData.lastDamage = 0;
				this.add('-start', pokemon, 'Bide');
			},
			onHit: function (target, source, move) {
				if (source && source !== target && move.category !== 'Physical' && move.category !== 'Special') {
					damage = this.effectData.totalDamage;
					this.effectData.totalDamage += damage;
					this.effectData.lastDamage = damage;
					this.effectData.sourcePosition = source.position;
					this.effectData.sourceSide = source.side;
				}
			},
			onDamage: function (damage, target, source, move) {
				if (!source || source.side === target.side) return;
				if (!move || move.effectType !== 'Move') return;
				if (!damage && this.effectData.lastDamage > 0) {
					damage = this.effectData.totalDamage;
				}
				this.effectData.totalDamage += damage;
				this.effectData.lastDamage = damage;
				this.effectData.sourcePosition = source.position;
				this.effectData.sourceSide = source.side;
			},
			onAfterSetStatus: function (status, pokemon) {
				// Sleep, freeze, partial trap will just pause duration
				if (pokemon.volatiles['flinch']) {
					this.effectData.duration++;
				} else if (pokemon.volatiles['partiallytrapped']) {
					this.effectData.duration++;
				} else {
					switch (status.id) {
					case 'slp':
					case 'frz':
						this.effectData.duration++;
						break;
					}
				}
			},
			onBeforeMove: function (pokemon) {
				if (this.effectData.duration === 1) {
					if (!this.effectData.totalDamage) {
						this.add('-fail', pokemon);
						return false;
					}
					this.add('-end', pokemon, 'Bide');
					var target = this.effectData.sourceSide.active[this.effectData.sourcePosition];
					this.moveHit(target, pokemon, 'bide', {damage: this.effectData.totalDamage * 2});
					return false;
				}
				this.add('-message', pokemon.name + ' is storing energy! (placeholder)');
				return false;
			},
			onModifyPokemon: function (pokemon) {
				if (!pokemon.hasMove('bide')) {
					return;
				}
				var moves = pokemon.moveset;
				for (var i = 0; i < moves.length; i++) {
					if (moves[i].id !== 'bide') {
						moves[i].disabled = true;
					}
				}
			}
		},
		type: "???" // Will look as Normal but it's STAB-less
	},
	bind: {
		inherit: true,
		affectedByImmunities: false,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock'
		},
		onBeforeMove: function (pokemon, target, move) {
			// Removes must recharge volatile even if it misses
			target.removeVolatile('mustrecharge');
		},
		onHit: function (target, source) {
			/**
			 * The duration of the partially trapped must be always renewed to 2
			 * so target doesn't move on trapper switch out as happens in gen 1.
			 * However, this won't happen if there's no switch and the trapper is
			 * about to end its partial trapping.
			 **/
			if (target.volatiles['partiallytrapped']) {
				if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
					target.volatiles['partiallytrapped'].duration = 2;
				}
			}
		}
	},
	bite: {
		inherit: true,
		secondary: {
			chance: 10,
			volatileStatus: 'flinch'
		},
		type: "Normal"
	},
	blizzard: {
		inherit: true,
		accuracy: 90,
		target: "normal"
	},
	bubble: {
		inherit: true,
		target: "normal"
	},
	clamp: {
		inherit: true,
		accuracy: 75,
		pp: 10,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock'
		},
		onBeforeMove: function (pokemon, target, move) {
			// Removes must recharge volatile even if it misses
			target.removeVolatile('mustrecharge');
		},
		onHit: function (target, source) {
			/**
			 * The duration of the partially trapped must be always renewed to 2
			 * so target doesn't move on trapper switch out as happens in gen 1.
			 * However, this won't happen if there's no switch and the trapper is
			 * about to end its partial trapping.
			 **/
			if (target.volatiles['partiallytrapped']) {
				if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
					target.volatiles['partiallytrapped'].duration = 2;
				}
			}
		}
	},
	conversion: {
		inherit: true,
		volatileStatus: 'conversion',
		accuracy: true,
		target: "normal",
		effect: {
			noCopy: true,
			onStart: function (target, source) {
				this.effectData.typesData = [];
				for (var i = 0, l = target.typesData.length; i < l; i++) {
					this.effectData.typesData.push(Object.clone(target.typesData[i]));
				}
				this.add('-start', source, 'typechange', target.getTypes(true).join(', '), '[from] move: Conversion', '[of] ' + target);
			},
			onRestart: function (target, source) {
				this.effectData.typesData = [];
				for (var i = 0, l = target.typesData.length; i < l; i++) {
					this.effectData.typesData.push(Object.clone(target.typesData[i]));
				}
				this.add('-start', source, 'typechange', target.getTypes(true).join(', '), '[from] move: Conversion', '[of] ' + target);
			},
			onModifyPokemon: function (pokemon) {
				pokemon.typesData = this.effectData.typesData;
			}
		}
	},
	counter: {
		inherit: true,
		affectedByImmunities: false,
		willCrit: false,
		damageCallback: function (pokemon) {
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn
			&& ((this.getMove(pokemon.lastAttackedBy.move).type === 'Normal' || this.getMove(pokemon.lastAttackedBy.move).type === 'Fighting'))
			&& this.getMove(pokemon.lastAttackedBy.move).id !== 'seismictoss') {
				return 2 * pokemon.lastAttackedBy.damage;
			}
			this.add('-fail', pokemon);
			return false;
		}
	},
	dig: {
		inherit: true,
		basePower: 100,
		effect: {
			duration: 2,
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'swift') return true;
				this.add('-message', 'The foe ' + target.name + ' can\'t be hit underground!');
				return null;
			},
			onDamage: function (damage, target, source, move) {
				if (!move || move.effectType !== 'Move') return;
				if (!source) return;
				if (move.id === 'earthquake') {
					this.add('-message', 'The foe ' + target.name + ' can\'t be hit underground!');
					return null;
				}
			}
		}
	},
	disable: {
		inherit: true,
		desc: "The target cannot choose a random move for 0-6 turns. Disable only works on one move at a time and fails if the target has not yet used a move or if its move has run out of PP. The target does nothing if it is about to use a move that becomes disabled.",
		effect: {
			duration: 4,
			durationCallback: function (target, source, effect) {
				var duration = this.random(1, 7);
				return duration;
			},
			onStart: function (pokemon) {
				if (!this.willMove(pokemon)) {
					this.effectData.duration++;
				}
				var moves = pokemon.moves;
				moves = moves.randomize();
				var move = this.getMove(moves[0]);
				this.add('-start', pokemon, 'Disable', move.name);
				this.effectData.move = move.id;
				return;
			},
			onResidualOrder: 14,
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'Disable');
			},
			onBeforeMove: function (attacker, defender, move) {
				if (move.id === this.effectData.move) {
					this.add('cant', attacker, 'Disable', move);
					return false;
				}
			},
			onModifyPokemon: function (pokemon) {
				var moves = pokemon.moveset;
				for (var i = 0; i < moves.length; i++) {
					if (moves[i].id === this.effectData.move) {
						moves[i].disabled = true;
					}
				}
			}
		}
	},
	dizzypunch: {
		inherit: true,
		desc: "Deals damage to the target.",
		shortDesc: "Deals damage.",
		secondary: false
	},
	doubleedge: {
		inherit: true,
		basePower: 100,
		desc: "Deals damage to the target. If the target lost HP, the user takes recoil damage equal to 25% that HP, rounded half up, but not less than 1HP.",
		shortDesc: "Has 25% recoil.",
		recoil: [25, 100]
	},
	explosion: {
		inherit: true,
		basePower: 340,
		target: "normal"
	},
	fireblast: {
		inherit: true,
		desc: "Deals damage to the target with a 30% chance to burn it.",
		shortDesc: "30% chance to burn the target.",
		secondary: {
			chance: 30,
			status: 'brn'
		}
	},
	firespin: {
		inherit: true,
		accuracy: 70,
		basePower: 15,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock'
		},
		onBeforeMove: function (pokemon, target, move) {
			// Removes must recharge volatile even if it misses
			target.removeVolatile('mustrecharge');
		},
		onHit: function (target, source) {
			/**
			 * The duration of the partially trapped must be always renewed to 2
			 * so target doesn't move on trapper switch out as happens in gen 1.
			 * However, this won't happen if there's no switch and the trapper is
			 * about to end its partial trapping.
			 **/
			if (target.volatiles['partiallytrapped']) {
				if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
					target.volatiles['partiallytrapped'].duration = 2;
				}
			}
		}
	},
	fly: {
		inherit: true,
		desc: "Deals damage to target. This attack charges on the first turn and strikes on the second. The user cannot make a move between turns. (Field: Can be used to fly to a previously visited area.)",
		shortDesc: "Flies up on first turn, then strikes the next turn.",
		effect: {
			duration: 2,
			onLockMove: 'fly',
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'swift') return true;
				this.add('-message', 'The foe ' + target.name + ' can\'t be hit while flying!');
				return null;
			},
			onDamage: function (damage, target, source, move) {
				if (!move || move.effectType !== 'Move') return;
				if (!source || source.side === target.side) return;
				if (move.id === 'gust' || move.id === 'thunder') {
					this.add('-message', 'The foe ' + target.name + ' can\'t be hit while flying!');
					return null;
				}
			}
		}
	},
	focusenergy: {
		inherit: true,
		desc: "If the attack deals critical hits sometimes, then the chance of its happening is quartered. If a move has a high chance of dealing a critical hit, if the user iis currently faster than the opposing Pokemon its critical hit ratio is not decreased. If it's slower, its chances of dealing a critical hit is cut by 50%. If the user is significantly slower than the opposing Pokemon, then the user will be unable to deal critical hits to the opposing Pokemon.",
		shortDesc: "Reduces the user's chance for a critical hit.",
		id: "focusenergy",
		name: "Focus Energy",
		pp: 30,
		priority: 0,
		isSnatchable: true,
		volatileStatus: 'focusenergy',
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'move: Focus Energy');
			},
			onModifyMove: function (move) {
				move.critRatio = -3;
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	glare: {
		inherit: true,
		affectedByImmunities: false
	},
	growth: {
		inherit: true,
		desc: "Raises the user's Special by 1 stage.",
		shortDesc: "Boosts the user's Special by 1.",
		boosts: {
			spa: 1,
			spd: 1
		}
	},
	gust: {
		inherit: true,
		type: "Normal"
	},
	haze: {
		inherit: true,
		desc: "Eliminates any stat stage changes and status from all active Pokemon.",
		shortDesc: "Eliminates all stat changes and status.",
		onHitField: function (target, source) {
			this.add('-clearallboost');
			for (var i = 0; i < this.sides.length; i++) {
				for (var j = 0; j < this.sides[i].active.length; j++) {
					var hasTox = (this.sides[i].active[j].status === 'tox');
					this.sides[i].active[j].clearBoosts();
					if (this.sides[i].active[j].id !== source.id) {
						// Clears the status from the opponent
						this.sides[i].active[j].clearStatus();
					}
					this.sides[i].removeSideCondition('lightscreen');
					this.sides[i].removeSideCondition('reflect');
					// Turns toxic to poison for user
					if (hasTox && this.sides[i].active[j].id === source.id) {
						this.sides[i].active[j].setStatus('psn');
					}
					// Clears volatile only from user
					if (this.sides[i].active[j].id === source.id) {
						this.sides[i].active[j].clearVolatile();
					}
				}
			}
		}
	},
	highjumpkick: {
		inherit: true,
		desc: "If this attack misses the target, the user takes 1 HP of damage.",
		shortDesc: "User takes 1 HP damage it would have dealt if miss.",
		onMoveFail: function (target, source, move) {
			if (target.type !== 'ghost') {
				this.damage(1, source);
			}
		}
	},
	hyperbeam: {
		inherit: true,
		desc: "Deals damage to a target. If this move is successful, the user must recharge on the following turn and cannot make a move, unless the opponent faints or a Substitute is destroyed.",
		shortDesc: "User cannot move next turn unless target or substitute faints."
	},
	jumpkick: {
		inherit: true,
		desc: "If this attack misses the target, the user 1HP of damage.",
		shortDesc: "User takes 1 HP damage if miss.",
		onMoveFail: function (target, source, move) {
			this.damage(1, source);
		}
	},
	karatechop: {
		inherit: true,
		type: "Normal"
	},
	leechseed: {
		inherit: true,
		onHit: function (target, source, move) {
			if (!source || source.fainted || source.hp <= 0) {
				// Well this shouldn't happen
				this.debug('Nothing to leech into');
				return;
			}
			if (target.newlySwitched && target.speed <= source.speed) {
				if (target.status === 'tox') {
					// Stage plus one since leech seed runs before Toxic
					var toLeech = this.clampIntRange(target.maxhp / 16, 1) * (target.statusData.stage + 1);
				} else {
					var toLeech = this.clampIntRange(target.maxhp / 16, 1);
				}
				var damage = this.damage(toLeech, target, source, 'move: Leech Seed');
				if (damage) {
					this.heal(damage, source, target);
				}
			}
		},
		effect: {
			onStart: function (target) {
				this.add('-start', target, 'move: Leech Seed');
			},
			onAfterMoveSelf: function (pokemon) {
				var target = pokemon.side.foe.active[pokemon.volatiles['leechseed'].sourcePosition];
				if (!target || target.fainted || target.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				// We check if target has Toxic to increase leeched damage
				if (pokemon.status === 'tox') {
					// Stage plus one since leech seed runs before Toxic
					var toLeech = this.clampIntRange(pokemon.maxhp / 16, 1) * (pokemon.statusData.stage + 1);
				} else {
					var toLeech = this.clampIntRange(pokemon.maxhp / 16, 1);
				}
				var damage = this.damage(toLeech, pokemon, target);
				if (damage) {
					this.heal(damage, target, pokemon);
				}
			}
		}
	},
	lightscreen: {
		num: 113,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user has double Special when attacked. Removed by Haze.",
		shortDesc: "For 5 turns, user's Special is 2x when attacked.",
		id: "lightscreen",
		isViable: true,
		name: "Light Screen",
		pp: 30,
		priority: 0,
		isSnatchable: true,
		secondary: false,
		volatileStatus: 'lightscreen',
		onTryHit: function (pokemon) {
			if (pokemon.volatiles['lightscreen']) {
				return false;
			}
		},
		target: "self",
		type: "Psychic"
	},
	lowkick: {
		inherit: true,
		accuracy: 90,
		basePower: 50,
		basePowerCallback: undefined,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		}
	},
	metronome: {
		inherit: true,
		onHit: function (target) {
			var moves = [];
			for (var i in exports.BattleMovedex) {
				var move = exports.BattleMovedex[i];
				if (i !== move.id) continue;
				if (move.isNonstandard) continue;
				var noMetronome = {
					metronome:1, struggle:1
				};
				if (!noMetronome[move.id] && move.num <= 165) {
					moves.push(move.id);
				}
			}
			var move = '';
			if (moves.length) move = moves[this.random(moves.length)];
			if (!move) return false;
			this.useMove(move, target);
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	mimic: {
		inherit: true,
		desc: "This move is replaced by a random move on target's moveset. The copied move has the maximum PP for that move. Ignores a target's Substitute.",
		shortDesc: "A random target's move replaces this one.",
		onHit: function (target, source) {
			var disallowedMoves = {mimic:1, struggle:1, transform:1};
			if (source.transformed) return false;
			var moveslot = source.moves.indexOf('mimic');
			if (moveslot === -1) return false;
			var moves = target.moves;
			moves = moves.randomize();
			for (var i = 0; i < moves.length; i++) {
				if (!(moves[i] in disallowedMoves)) {
					var move = moves[i];
					break;
				}
			}
			var move = this.getMove(move);
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
	mirrormove: {
		num: 119,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user uses the last move used by a selected adjacent target. The copied move is used against that target, if possible. Fails if the target has not yet used a move, or the last move used was Counter, Haze, Light Screen, Mimic, Reflect, Struggle, Transform, or any move that is self-targeting.",
		shortDesc: "User uses the target's last used move against it.",
		id: "mirrormove",
		name: "Mirror Move",
		pp: 20,
		priority: 0,
		isNotProtectable: true,
		onTryHit: function (target) {
			var noMirrorMove = {acupressure:1, afteryou:1, aromatherapy:1, chatter:1, feint:1, finalgambit:1, focuspunch:1, futuresight:1, gravity:1, guardsplit:1, hail:1, haze:1, healbell:1, healpulse:1, helpinghand:1, lightscreen:1, luckychant:1, mefirst:1, mimic:1, mirrorcoat:1, mirrormove:1, mist:1, mudsport:1, naturepower:1, perishsong:1, powersplit:1, psychup:1, quickguard:1, raindance:1, reflect:1, reflecttype:1, roleplay:1, safeguard:1, sandstorm:1, sketch:1, spikes:1, spitup:1, stealthrock:1, sunnyday:1, tailwind:1, taunt:1, teeterdance:1, toxicspikes:1, transform:1, watersport:1, wideguard:1};
			if (!target.lastMove || noMirrorMove[target.lastMove] || this.getMove(target.lastMove).target === 'self') {
				return false;
			}
		},
		onHit: function (target, source) {
			this.useMove(this.lastMove, source);
		},
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	nightshade: {
		inherit: true,
		affectedByImmunities: false
	},
	poisonsting: {
		inherit: true,
		secondary: {
			chance: 20,
			status: 'psn'
		}
	},
	psychic: {
		inherit: true,
		desc: "Deals damage to one target with a 30% chance to lower its Special by 1 stage.",
		shortDesc: "30% chance to lower the target's Special by 1.",
		secondary: {
			chance: 30,
			boosts: {
				spd: -1,
				spa: -1
			}
		}
	},
	rage: {
		inherit: true,
		self: {
			volatileStatus: 'rage'
		}
	},
	razorleaf: {
		inherit: true,
		target: "normal"
	},
	razorwind: {
		inherit: true,
		accuracy: 75,
		critRatio: 1,
		target: "normal"
	},
	recover: {
		inherit: true,
		heal: null,
		onHit: function (target) {
			// Fail when health is 255 or 511 less than max
			if (target.hp === (target.maxhp - 255) || target.hp === (target.maxhp - 511) || target.hp === target.maxhp) {
				return false;
			}
			this.heal(Math.floor(target.maxhp / 2), target, target);
		}
	},
	reflect: {
		num: 115,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user has doubled Defense. Critical hits ignore this protection. It is removed from the user if it is successfully hit by Haze.",
		shortDesc: "User's Defense is 2x.",
		id: "reflect",
		isViable: true,
		name: "Reflect",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		volatileStatus: 'reflect',
		onTryHit: function (pokemon) {
			if (pokemon.volatiles['reflect']) {
				return false;
			}
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	rest: {
		inherit: true,
		onHit: function (target) {
			// Fails if the difference between
			// max HP and current HP is 0, 255, or 511
			if (target.hp >= target.maxhp ||
			target.hp === (target.maxhp - 255) ||
			target.hp === (target.maxhp - 511)) return false;
			if (!target.setStatus('slp')) return false;
			target.statusData.time = 2;
			target.statusData.startTime = 2;
			this.heal(target.maxhp); // Aeshetic only as the healing happens after you fall asleep in-game
			this.add('-status', target, 'slp', '[from] move: Rest');
		}
	},
	roar: {
		inherit: true,
		desc: "Does nothing.",
		shortDesc: "Does nothing.",
		isViable: false,
		forceSwitch: false,
		onTryHit: function () {}
	},
	rockslide: {
		inherit: true,
		desc: "Deals damage to a foe.",
		shortDesc: "Deals damage.",
		secondary: false,
		target: "normal"
	},
	rockthrow: {
		inherit: true,
		accuracy: 65
	},
	seismictoss: {
		inherit: true,
		affectedByImmunities: false
	},
	selfdestruct: {
		inherit: true,
		basePower: 260,
		target: "normal"
	},
	skullbash: {
		inherit: true,
		effect: {
			duration: 2,
			onLockMove: 'skullbash',
			onStart: function (pokemon) {}
		}
	},
	skyattack: {
		inherit: true,
		critRatio: 1
	},
	softboiled: {
		inherit: true,
		heal: null,
		onHit: function (target) {
			// Fail when health is 255 or 511 less than max
			if (target.hp === (target.maxhp - 255) || target.hp === (target.maxhp - 511) || target.hp === target.maxhp) {
				return false;
			}
			this.heal(Math.floor(target.maxhp / 2), target, target);
		}
	},
	struggle: {
		num: 165,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Deals typeless damage to one adjacent foe at random. If this move was successful, the user loses 1/2 of the damage dealt, rounded half up; the Ability Rock Head does not prevent this. This move can only be used if none of the user's known moves can be selected. Makes contact.",
		shortDesc: "User loses half of the damage dealt as recoil.",
		id: "struggle",
		name: "Struggle",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		isContact: true,
		beforeMoveCallback: function (pokemon) {
			this.add('-message', pokemon.name + ' has no moves left! (placeholder)');
		},
		recoil: [1, 2],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	substitute: {
		num: 164,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user takes 1/4 of its maximum HP, rounded down, and puts it into a substitute to take its place in battle. The substitute is removed once enough damage is inflicted on it, or if the user switches out or faints. Until the substitute is broken, it receives damage from all attacks made by other Pokemon and shields the user from poison status and some stat stage changes caused by other Pokemon. The user still takes normal damage from status effects while behind its substitute. If the substitute breaks during a multi-hit attack, the user will take damage from any remaining hits. This move fails if the user already has a substitute.",
		shortDesc: "User takes 1/4 its max HP to put in a Substitute.",
		id: "substitute",
		isViable: true,
		name: "Substitute",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		volatileStatus: 'Substitute',
		onTryHit: function (target) {
			if (target.volatiles['substitute']) {
				this.add('-fail', target, 'move: Substitute');
				return null;
			}
			// We only prevent when hp is less than one quarter.
			// If you use substitute at exactly one quarter, you faint.
			if (target.hp === target.maxhp / 4) target.faint();
			if (target.hp < target.maxhp / 4) {
				this.add('-fail', target, 'move: Substitute', '[weak]');
				return null;
			}
		},
		onHit: function (target) {
			// If max HP is 3 or less substitute makes no damage
			if (target.maxhp > 3) {
				this.directDamage(target.maxhp / 4, target, target);
			}
		},
		effect: {
			onStart: function (target) {
				this.add('-start', target, 'Substitute');
				this.effectData.hp = Math.floor(target.maxhp / 4);
				delete target.volatiles['partiallytrapped'];
			},
			onTryHitPriority: -1,
			onTryHit: function (target, source, move) {
				if (move.category === 'Status') {
					// In gen 1 it only blocks:
					// poison, confusion, the effect of partial trapping moves, secondary effect confusion,
					// stat reducing moves and Leech Seed.
					var SubBlocked = {
						lockon:1, meanlook:1, mindreader:1, nightmare:1
					};
					if (move.status === 'psn' || move.status === 'tox' || (move.boosts && target !== source) || move.volatileStatus === 'confusion' || SubBlocked[move.id]) {
						return false;
					}
					return;
				}
				if (move.volatileStatus && target === source) return;
				var damage = this.getDamage(source, target, move);
				if (!damage) return null;
				damage = this.runEvent('SubDamage', target, source, move, damage);
				if (!damage) return damage;
				target.volatiles['substitute'].hp -= damage;
				source.lastDamage = damage;
				if (target.volatiles['substitute'].hp <= 0) {
					this.debug('Substitute broke');
					target.removeVolatile('substitute');
					target.subFainted = true;
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				if (move.recoil) {
					this.damage(Math.round(damage * move.recoil[0] / move.recoil[1]), source, target, 'recoil');
				}
				// Attacker does not heal from drain if substitute breaks
				if (move.drain && target.volatiles['substitute'] && target.volatiles['substitute'].hp > 0) {
					this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
				}
				this.runEvent('AfterSubDamage', target, source, move, damage);
				// Add here counter damage
				if (!target.lastAttackedBy) target.lastAttackedBy = {pokemon: source, thisTurn: true};
				target.lastAttackedBy.move = move.id;
				target.lastAttackedBy.damage = damage;
				return 0; // hit
			},
			onEnd: function (target) {
				this.add('-end', target, 'Substitute');
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	thunder: {
		inherit: true,
		secondary: {
			chance: 10,
			status: 'par'
		}
	},
	thunderwave: {
		inherit: true,
		accuracy: 100,
		onTryHit: function (target) {
			if (target.hasType('Ground')) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		}
	},
	triattack: {
		inherit: true,
		secondary: false
	},
	whirlwind: {
		inherit: true,
		accuracy: 85,
		desc: "Does nothing.",
		shortDesc: "Does nothing.",
		isViable: false,
		forceSwitch: false,
		onTryHit: function () {}
	},
	wingattack: {
		inherit: true,
		basePower: 35
	},
	wrap: {
		inherit: true,
		accuracy: 85,
		affectedByImmunities: false,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock'
		},
		onBeforeMove: function (pokemon, target, move) {
			// Removes must recharge volatile even if it misses
			target.removeVolatile('mustrecharge');
		},
		onHit: function (target, source) {
			/**
			 * The duration of the partially trapped must be always renewed to 2
			 * so target doesn't move on trapper switch out as happens in gen 1.
			 * However, this won't happen if there's no switch and the trapper is
			 * about to end its partial trapping.
			 **/
			if (target.volatiles['partiallytrapped']) {
				if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
					target.volatiles['partiallytrapped'].duration = 2;
				}
			}
		}
	}
};
