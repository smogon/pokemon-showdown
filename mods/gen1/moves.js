/**
 * A lot of Gen 1 moves have to be updated due to different mechanics.
 * Some moves have had major changes, such as Bite's typing.
 */
function clampIntRange(num, min, max) {
	num = Math.floor(num);
	if (num < min) num = min;
	if (typeof max !== 'undefined' && num > max) num = max;
	return num;
}
exports.BattleMovedex = {
	absorb: {
		pp: 20,
		inherit: true
	},
	acid: {
		category: "Physical",
		secondary: {
			chance: 10,
			boosts: {
				def: -1
			}
		},
		target: "normal",
		inherit: true
	},
	acidarmor: {
		pp: 40,
		inherit: true
	},
	amnesia: {
		desc: "Raises the user's Special by 2 stages.",
		shortDesc: "Boosts the user's Special by 2.",
		boosts: {
			spd: 2,
			spa: 2
		},
		inherit: true
	},
	barrier: {
		pp: 30,
		inherit: true
	},
	bide: {
		priority: 0,
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
					pokemon.effectData.duration++;
				}
				else if (pokemon.volatiles['partiallytrapped']) {
					pokemon.effectData.duration++;
				}
				else {
					switch (status.id) {
					case 'slp':
					case 'frz':
						pokemon.effectData.duration++;
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
					this.moveHit(target, pokemon, 'bide', {
						damage: this.effectData.totalDamage * 2
					});
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
		type: "???",
		inherit: true
	},
	bind: {
		accuracy: 75,
		affectedByImmunities: false,
		self: {
			volatileStatus: "partialtrappinglock"
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
		},
		inherit: true
	},
	bite: {
		secondary: {
			chance: 10,
			volatileStatus: "flinch"
		},
		type: "Normal",
		isBiteAttack: null,
		inherit: true
	},
	blizzard: {
		accuracy: 90,
		target: "normal",
		basePower: 120,
		onModifyMove: function (move) {
			if (this.isWeather('hail')) move.accuracy = true;
		},
		inherit: true
	},
	bubble: {
		target: "normal",
		basePower: 20,
		inherit: true
	},
	clamp: {
		accuracy: 75,
		category: "Special",
		pp: 10,
		self: {
			volatileStatus: "partialtrappinglock"
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
		},
		inherit: true
	},
	conversion: {
		volatileStatus: "conversion",
		target: "normal",
		effect: {
			noCopy: true,
			onStart: function (target, source) {
				this.effectData.types = target.types;
				this.add('-start', source, 'typechange', target.types.join(', '), '[from] move: Conversion', '[of] ' + target);
			},
			onRestart: function (target, source) {
				this.effectData.types = target.types;
				this.add('-start', source, 'typechange', target.types.join(', '), '[from] move: Conversion', '[of] ' + target);
			},
			onModifyPokemon: function (pokemon) {
				pokemon.types = this.effectData.types;
			}
		},
		onHit: function (target) {
			var possibleTypes = target.moveset.map(function (val) {
				var move = this.getMove(val.id);
				if (move.id !== 'conversion' && !target.hasType(move.type)) {
					return move.type;
				}
			}, this).compact();
			if (!possibleTypes.length) {
				return false;
			}
			var type = possibleTypes[this.random(possibleTypes.length)];
			this.add('-start', target, 'typechange', type);
			target.types = [type];
		},
		inherit: true
	},
	counter: {
		affectedByImmunities: false,
		willCrit: false,
		damageCallback: function (pokemon) {
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn && ((this.getMove(pokemon.lastAttackedBy.move).type === 'Normal' || this.getMove(pokemon.lastAttackedBy.move).type === 'Fighting')) && this.getMove(pokemon.lastAttackedBy.move).id !== 'seismictoss') {
				return 2 * pokemon.lastAttackedBy.damage;
			}
			this.add('-fail', pokemon);
			return false;
		},
		inherit: true
	},
	crabhammer: {
		accuracy: 85,
		category: "Special",
		basePower: 90,
		inherit: true
	},
	dig: {
		basePower: 100,
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		effect: {
			duration: 2,
			onLockMove: "dig",
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'swift') return true;
				this.add('-message', 'The foe ' + target.name + ' can not be hit underground!');
				return null;
			},
			onDamage: function (damage, target, source, move) {
				if (!move || move.effectType !== 'Move') return;
				if (!source) return;
				if (move.id === 'earthquake') {
					this.add('-message', 'The foe ' + target.name + ' can not be hit underground!');
					return null;
				}
			}
		},
		inherit: true
	},
	disable: {
		accuracy: 55,
		desc: "The target cannot choose a random move for 0-6 turns. Disable only works on one move at a time and fails if the target has not yet used a move or if its move has run out of PP. The target does nothing if it is about to use a move that becomes disabled.",
		effect: {
			duration: 4,
			durationCallBack: function (target, source, effect) {
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
		},
		inherit: true
	},
	dizzypunch: {
		desc: "Deals damage to the target.",
		shortDesc: "Deals damage.",
		secondary: false,
		inherit: true
	},
	doubleedge: {
		basePower: 100,
		desc: "Deals damage to the target. If the target lost HP, the user takes recoil damage equal to 25% that HP, rounded half up, but not less than 1HP.",
		shortDesc: "Has 25% recoil.",
		recoil: [25, 100],
		inherit: true
	},
	dreameater: {
		desc: "Deals damage to one adjacent target, if it is asleep and does not have a Substitute. The user recovers half of the HP lost by the target, rounded up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		onTryHit: function (target) {
			if (target.status !== 'slp' || target.volatiles['substitute']) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		inherit: true
	},
	explosion: {
		basePower: 340,
		target: "normal",
		inherit: true
	},
	fireblast: {
		desc: "Deals damage to the target with a 30% chance to burn it.",
		shortDesc: "30% chance to burn the target.",
		secondary: {
			chance: 30,
			"status": "brn"
		},
		basePower: 120,
		inherit: true
	},
	firepunch: {
		category: "Special",
		inherit: true
	},
	firespin: {
		accuracy: 70,
		basePower: 15,
		self: {
			volatileStatus: "partialtrappinglock"
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
		},
		inherit: true
	},
	flamethrower: {
		basePower: 95,
		inherit: true
	},
	flash: {
		accuracy: 70,
		inherit: true
	},
	fly: {
		basePower: 70,
		desc: "Deals damage to target. This attack charges on the first turn and strikes on the second. The user cannot make a move between turns. (Field: Can be used to fly to a previously visited area.)",
		effect: {
			duration: 2,
			onLockMove: "fly",
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'swift') return true;
				this.add('-message', 'The foe ' + target.name + ' can not be hit while flying!');
				return null;
			},
			onDamage: function (damage, target, source, move) {
				if (!move || move.effectType !== 'Move') return;
				if (!source || source.side === target.side) return;
				if (move.id === 'gust' || move.id === 'thunder') {
					this.add('-message', 'The foe ' + target.name + ' can not be hit while flying!');
					return null;
				}
			}
		},
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		inherit: true
	},
	focusenergy: {
		desc: "If the attack deals critical hits sometimes, then the chance of its happening is quartered. If a move has a high chance of dealing a critical hit, if the user iis currently faster than the opposing Pokemon its critical hit ratio is not decreased. If it's slower, its chances of dealing a critical hit is cut by 50%. If the user is significantly slower than the opposing Pokemon, then the user will be unable to deal critical hits to the opposing Pokemon.",
		shortDesc: "Reduces the user's chance for a critical hit.",
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'move: Focus Energy');
			},
			onModifyMove: function (move) {
				move.critRatio = -3;
			}
		},
		inherit: true
	},
	glare: {
		accuracy: 75,
		inherit: true
	},
	growth: {
		desc: "Raises the user's Special by 1 stage.",
		shortDesc: "Boosts the user's Special by 1.",
		onModifyMove: function (move) {
			if (this.isWeather('sunnyday')) move.boosts = {
				atk: 2,
				spa: 2
			};
		},
		boosts: {
			spa: 1,
			spd: 1
		},
		inherit: true
	},
	gust: {
		category: "Physical",
		type: "Normal",
		inherit: true
	},
	haze: {
		desc: "Eliminates any stat stage changes and status from all active Pokemon.",
		shortDesc: "Eliminates all stat changes and status.",
		onHitField: function (target, source) {
			this.add('-clearallboost');
			for (var i = 0; i < this.sides.length; i++) {
				for (var j = 0; j < this.sides[i].active.length; j++) {
					var hasTox = (this.sides[i].active[j].status == 'tox');
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
		},
		inherit: true
	},
	hiddenpowerbug: {
		basePower: 70,
		inherit: true
	},
	hiddenpowerdark: {
		basePower: 70,
		inherit: true
	},
	hiddenpowerdragon: {
		basePower: 70,
		inherit: true
	},
	hiddenpowerelectric: {
		basePower: 70,
		inherit: true
	},
	hiddenpowerfighting: {
		basePower: 70,
		inherit: true
	},
	hiddenpowerfire: {
		basePower: 70,
		inherit: true
	},
	hiddenpowerflying: {
		basePower: 70,
		inherit: true
	},
	hiddenpowerghost: {
		basePower: 70,
		inherit: true
	},
	hiddenpowergrass: {
		basePower: 70,
		inherit: true
	},
	hiddenpowerground: {
		basePower: 70,
		inherit: true
	},
	hiddenpowerice: {
		basePower: 70,
		inherit: true
	},
	hiddenpowerpoison: {
		basePower: 70,
		inherit: true
	},
	hiddenpowerpsychic: {
		basePower: 70,
		inherit: true
	},
	hiddenpowerrock: {
		basePower: 70,
		inherit: true
	},
	hiddenpowersteel: {
		basePower: 70,
		inherit: true
	},
	hiddenpowerwater: {
		basePower: 70,
		inherit: true
	},
	highjumpkick: {
		inherit: true,
		basePower: 85,
		desc: "If this attack misses the target, the user takes 1 HP of damage.",
		shortDesc: "User takes 1 HP damage it would have dealt if miss.",
		pp: 20,
		onMoveFail: function (target, source, move) {
			if (target.type !== 'ghost') {
				this.damage(1, source);
			}
		}
	},
	hydropump: {
		basePower: 120,
		inherit: true
	},
	hyperbeam: {
		category: "Physical",
		desc: "Deals damage to a target. If this move is successful, the user must recharge on the following turn and cannot make a move, unless the opponent faints or a Substitute is destroyed.",
		shortDesc: "User cannot move next turn unless target or substitute faints.",
		inherit: true
	},
	hyperfang: {
		isBiteAttack: null,
		inherit: true
	},
	icebeam: {
		basePower: 95,
		inherit: true
	},
	icepunch: {
		category: "Special",
		inherit: true
	},
	jumpkick: {
		basePower: 70,
		desc: "If this attack misses the target, the user 1HP of damage.",
		shortDesc: "User takes 1 HP damage if miss.",
		pp: 25,
		onMoveFail: function (target, source, move) {
			this.damage(1, source);
		},
		inherit: true
	},
	karatechop: {
		type: "Normal",
		inherit: true
	},
	leechseed: {
		onHit: function (target, source, move) {
			if (!source || source.fainted || source.hp <= 0) {
				// Well this shouldn't happen
				this.debug('Nothing to leech into');
				return;
			}
			if (target.newlySwitched && target.speed <= source.speed) {
				if (target.status === 'tox') {
					// Stage plus one since leech seed runs before Toxic
					var toLeech = clampIntRange(target.maxhp / 16, 1) * (target.statusData.stage + 1);
				}
				else {
					var toLeech = clampIntRange(target.maxhp / 16, 1);
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
					var toLeech = clampIntRange(pokemon.maxhp / 16, 1) * (pokemon.statusData.stage + 1);
				}
				else {
					var toLeech = clampIntRange(pokemon.maxhp / 16, 1);
				}
				var damage = this.damage(toLeech, pokemon, target);
				if (damage) {
					this.heal(damage, target, pokemon);
				}
			}
		},
		onTryHit: function (target) {
			if (target.hasType('Grass')) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		inherit: true
	},
	lick: {
		basePower: 20,
		inherit: true
	},
	lightscreen: {
		desc: "For 5 turns, the user has double Special when attacked. Removed by Haze.",
		shortDesc: "For 5 turns, user's Special is 2x when attacked.",
		volatileStatus: "lightscreen",
		onTryHit: function (pokemon) {
			if (pokemon.volatiles['lightscreen']) {
				return false;
			}
		},
		target: "self",
		sideCondition: null,
		effect: null,
		inherit: true
	},
	lowkick: {
		accuracy: 90,
		basePower: 50,
		basePowerCallback: function (pokemon, target) {
			var targetWeight = target.weightkg;
			if (target.weightkg >= 200) {
				return 120;
			}
			if (target.weightkg >= 100) {
				return 100;
			}
			if (target.weightkg >= 50) {
				return 80;
			}
			if (target.weightkg >= 25) {
				return 60;
			}
			if (target.weightkg >= 10) {
				return 40;
			}
			return 20;
		},
		secondary: {
			chance: 30,
			volatileStatus: "flinch"
		},
		inherit: true
	},
	megadrain: {
		pp: 10,
		inherit: true
	},
	metronome: {
		onHit: function (target) {
			var moves = [];
			for (var i in exports.BattleMovedex) {
				var move = exports.BattleMovedex[i];
				if (i !== move.id) continue;
				if (move.isNonstandard) continue;
				var noMetronome = {
					metronome: 1,
					struggle: 1
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
		inherit: true
	},
	mimic: {
		desc: "This move is replaced by a random move on target's moveset. The copied move has the maximum PP for that move. Ignores a target's Substitute.",
		shortDesc: "A random target's move replaces this one.",
		onHit: function (target, source) {
			var disallowedMoves = {
				mimic: 1,
				struggle: 1,
				transform: 1
			};
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
		},
		inherit: true
	},
	minimize: {
		boosts: {
			evasion: 1
		},
		pp: 20,
		effect: {
			noCopy: true,
			onSourceModifyDamage: function (damageMod, source, target, move) {
				if (move.id === 'stomp' || move.id === 'steamroller') {
					return this.chain(damageMod, 2);
				}
			}
		},
		inherit: true
	},
	mirrormove: {
		desc: "The user uses the last move used by a selected adjacent target. The copied move is used against that target, if possible. Fails if the target has not yet used a move, or the last move used was Counter, Haze, Light Screen, Mimic, Reflect, Struggle, Transform, or any move that is self-targeting.",
		onTryHit: function (target) {
			var noMirrorMove = {
				acupressure: 1,
				afteryou: 1,
				aromatherapy: 1,
				chatter: 1,
				feint: 1,
				finalgambit: 1,
				focuspunch: 1,
				futuresight: 1,
				gravity: 1,
				guardsplit: 1,
				hail: 1,
				haze: 1,
				healbell: 1,
				healpulse: 1,
				helpinghand: 1,
				lightscreen: 1,
				luckychant: 1,
				mefirst: 1,
				mimic: 1,
				mirrorcoat: 1,
				mirrormove: 1,
				mist: 1,
				mudsport: 1,
				naturepower: 1,
				perishsong: 1,
				powersplit: 1,
				psychup: 1,
				quickguard: 1,
				raindance: 1,
				reflect: 1,
				reflecttype: 1,
				roleplay: 1,
				safeguard: 1,
				sandstorm: 1,
				sketch: 1,
				spikes: 1,
				spitup: 1,
				stealthrock: 1,
				sunnyday: 1,
				tailwind: 1,
				taunt: 1,
				teeterdance: 1,
				toxicspikes: 1,
				transform: 1,
				watersport: 1,
				wideguard: 1
			};
			if (!target.lastMove || noMirrorMove[target.lastMove] || this.getMove(target.lastMove).target === 'self') {
				return false;
			}
		},
		onHit: function (target, source) {
			this.useMove(this.lastMove, source);
		},
		inherit: true
	},
	mist: {
		effect: {
			duration: 5,
			onBoost: function (boost, target, source) {
				if (!source || target === source) return;
				for (var i in boost) {
					if (boost[i] < 0) {
						delete boost[i];
						this.add('-activate', target, 'Mist');
					}
				}
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'Mist');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 3,
			onEnd: function (side) {
				this.add('-sideend', side, 'Mist');
			}
		},
		inherit: true
	},
	nightshade: {
		affectedByImmunities: false,
		inherit: true
	},
	payday: {
		onHit: function () {
			this.add('-fieldactivate', 'move: Pay Day');
		},
		inherit: true
	},
	petaldance: {
		basePower: 70,
		pp: 20,
		inherit: true
	},
	pinmissile: {
		accuracy: 85,
		basePower: 14,
		inherit: true
	},
	poisongas: {
		accuracy: 55,
		target: "normal",
		inherit: true
	},
	poisonpowder: {
		isPowder: null,
		onTryHit: function () {},
		inherit: true
	},
	poisonsting: {
		secondary: {
			chance: 20,
			"status": "psn"
		},
		inherit: true
	},
	psychic: {
		desc: "Deals damage to one target with a 30% chance to lower its Special by 1 stage.",
		shortDesc: "30% chance to lower the target's Special by 1.",
		secondary: {
			chance: 30,
			boosts: {
				spd: -1,
				spa: -1
			}
		},
		inherit: true
	},
	psywave: {
		damageCallback: function (pokemon) {
			return (this.random(50, 151) * pokemon.level) / 100;
		},
		inherit: true
	},
	rage: {
		effect: {
			onStart: function (pokemon) {
				this.add('-singlemove', pokemon, 'Rage');
			},
			onHit: function (target, source, move) {
				if (target !== source && move.category !== 'Status') {
					this.boost({
						atk: 1
					});
				}
			},
			onBeforeMovePriority: 100,
			onBeforeMove: function (pokemon) {
				this.debug('removing Rage before attack');
				pokemon.removeVolatile('rage');
			}
		},
		inherit: true
	},
	razorleaf: {
		category: "Special",
		target: "normal",
		inherit: true
	},
	razorwind: {
		accuracy: 75,
		category: "Physical",
		desc: "Deals damage to a foe. This attack charges on the first turn and strikes on the second. The user cannot make a move between turns.",
		shortDesc: "Charges, then hits foe turn 2.",
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		target: "normal",
		basePower: null,
		critRatio: null,
		inherit: true
	},
	recover: {
		pp: 20,
		heal: null,
		onHit: function (target) {
			// Fail when health is 255 or 511 less than max
			if (target.hp === (target.maxhp - 255) || target.hp === (target.maxhp - 511) || target.hp === target.maxhp) {
				return false;
			}
			this.heal(Math.floor(target.maxhp / 2), target, target);
		},
		inherit: true
	},
	reflect: {
		desc: "The user has doubled Defense. Critical hits ignore this protection. It is removed from the user if it is successfully hit by Haze.",
		shortDesc: "User's Defense is 2x.",
		volatileStatus: "reflect",
		onTryHit: function (pokemon) {
			if (pokemon.volatiles['reflect']) {
				return false;
			}
		},
		target: "self",
		sideCondition: null,
		effect: null,
		inherit: true
	},
	rest: {
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
		},
		inherit: true
	},
	roar: {
		desc: "Does nothing.",
		shortDesc: "Does nothing.",
		heal: false,
		forceSwitch: false,
		accuracy: 100,
		isNotProtectable: null,
		inherit: true
	},
	rockslide: {
		desc: "Deals damage to a foe.",
		shortDesc: "Deals damage.",
		secondary: false,
		target: "normal",
		inherit: true
	},
	rockthrow: {
		accuracy: 65,
		inherit: true
	},
	sandattack: {
		name: "Sand Attack",
		inherit: true
	},
	seismictoss: {
		affectedByImmunities: false,
		inherit: true
	},
	selfdestruct: {
		basePower: 260,
		target: "normal",
		inherit: true
	},
	skullbash: {
		effect: {
			duration: 2,
			onLockMove: "skullbash",
			onStart: function (pokemon) {}
		},
		basePower: 100,
		pp: 15,
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			attacker.addVolatile(move.id, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				attacker.removeVolatile(move.id);
				return;
			}
			return null;
		},
		inherit: true
	},
	skyattack: {
		critRatio: 1,
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		inherit: true
	},
	sleeppowder: {
		isPowder: null,
		onTryHit: function () {},
		inherit: true
	},
	sludge: {
		category: "Physical",
		inherit: true
	},
	smog: {
		basePower: 20,
		inherit: true
	},
	softboiled: {
		heal: null,
		onHit: function (target) {
			// Fail when health is 255 or 511 less than max
			if (target.hp === (target.maxhp - 255) || target.hp === (target.maxhp - 511) || target.hp === target.maxhp) {
				return false;
			}
			this.heal(Math.floor(target.maxhp / 2), target, target);
		},
		inherit: true
	},
	solarbeam: {
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (this.isWeather('sunnyday') || !this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		onBasePower: function (bpMod, pokemon, target) {
			if (this.isWeather(['raindance', 'sandstorm', 'hail'])) {
				this.debug('weakened by weather');
				return this.chain(bpMod, 0.5);
			}
		},
		inherit: true
	},
	sonicboom: {
		category: "Physical",
		inherit: true
	},
	splash: {
		onTryHit: function (target, source) {
			this.add('-nothing');
			return null;
		},
		inherit: true
	},
	spore: {
		onTryHit: function () {},
		inherit: true
	},
	stomp: {
		basePowerCallback: null,
		desc: "Deals damage to one adjacent target with a 30% chance to flinch it.",
		inherit: true
	},
	stringshot: {
		desc: "Lowers all adjacent foes' Speed by 1 stage. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the foe(s) Speed by 1.",
		boosts: {
			spe: -1
		},
		inherit: true
	},
	struggle: {
		accuracy: 100,
		desc: "Deals typeless damage to one adjacent foe at random. If this move was successful, the user loses 1/2 of the damage dealt, rounded half up; the Ability Rock Head does not prevent this. This move can only be used if none of the user's known moves can be selected. Makes contact.",
		shortDesc: "User loses half of the damage dealt as recoil.",
		beforeMoveCallback: function (pokemon) {
			this.add('-message', pokemon.name + ' has no moves left! (placeholder)');
		},
		onModifyMove: function (move) {
			move.type = '???';
		},
		recoil: [1, 2],
		self: null,
		inherit: true
	},
	stunspore: {
		onTryHit: function () {},
		inherit: true
	},
	substitute: {
		desc: "The user takes 1/4 of its maximum HP, rounded down, and puts it into a substitute to take its place in battle. The substitute is removed once enough damage is inflicted on it, or if the user switches out or faints. Until the substitute is broken, it receives damage from all attacks made by other Pokemon and shields the user from poison status and some stat stage changes caused by other Pokemon. The user still takes normal damage from status effects while behind its substitute. If the substitute breaks during a multi-hit attack, the user will take damage from any remaining hits. This move fails if the user already has a substitute.",
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
						lockon: 1,
						meanlook: 1,
						mindreader: 1,
						nightmare: 1
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
				}
				else {
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
				if (!target.lastAttackedBy) target.lastAttackedBy = {
					pokemon: source,
					thisTurn: true
				};
				target.lastAttackedBy.move = move.id;
				target.lastAttackedBy.damage = damage;
				return 0; // hit
			},
			onEnd: function (target) {
				this.add('-end', target, 'Substitute');
			}
		},
		inherit: true
	},
	superfang: {
		damageCallback: function (pokemon, target) {
			return target.hp / 2;
		},
		inherit: true
	},
	surf: {
		basePower: 95,
		inherit: true
	},
	swift: {
		category: "Physical",
		inherit: true
	},
	swordsdance: {
		pp: 30,
		inherit: true
	},
	tackle: {
		accuracy: 95,
		basePower: 35,
		inherit: true
	},
	thrash: {
		basePower: 90,
		pp: 20,
		inherit: true
	},
	thunder: {
		secondary: {
			chance: 10,
			"status": "par"
		},
		basePower: 120,
		onModifyMove: function (move) {
			if (this.isWeather('raindance')) move.accuracy = true;
			else if (this.isWeather('sunnyday')) move.accuracy = 50;
		},
		inherit: true
	},
	thunderpunch: {
		category: "Special",
		name: "Thunder Punch",
		inherit: true
	},
	thundershock: {
		name: "ThunderShock",
		inherit: true
	},
	thunderwave: {
		onTryHit: function (target) {
			if (target.hasType('Ground')) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		inherit: true
	},
	thunderbolt: {
		basePower: 95,
		inherit: true
	},
	toxic: {
		accuracy: 85,
		inherit: true
	},
	transform: {
		onHit: function (target, pokemon) {
			if (!pokemon.transformInto(target, pokemon)) {
				return false;
			}
			this.add('-transform', pokemon, target);
		},
		inherit: true
	},
	triattack: {
		category: "Physical",
		secondary: false,
		inherit: true
	},
	vinewhip: {
		category: "Special",
		pp: 10,
		basePower: 35,
		inherit: true
	},
	waterfall: {
		category: "Special",
		secondary: false,
		inherit: true
	},
	whirlwind: {
		accuracy: 85,
		desc: "Does nothing.",
		shortDesc: "Does nothing.",
		heal: false,
		forceSwitch: false,
		isNotProtectable: null,
		inherit: true
	},
	wingattack: {
		basePower: 35,
		inherit: true
	},
	wrap: {
		accuracy: 85,
		affectedByImmunities: false,
		self: {
			volatileStatus: "partialtrappinglock"
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
		},
		inherit: true
	},
	highjumpkick: {
		onMoveFail: function (target, source, move) {
			this.damage(source.maxhp / 2, source, source, 'highjumpkick');
		},
		inherit: true
	}
};
