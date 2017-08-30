/**
 * A lot of Gen 1 moves have to be updated due to different mechanics.
 * Some moves have had major changes, such as Bite's typing.
 */

'use strict';

exports.BattleMovedex = {
	acid: {
		inherit: true,
		desc: "Has a 33% chance to lower the target's Defense by 1 stage.",
		shortDesc: "33% chance to lower the target's Defense by 1.",
		secondary: {
			chance: 33,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
	},
	amnesia: {
		inherit: true,
		desc: "Raises the user's Special by 2 stages.",
		shortDesc: "Boosts the user's Special by 2.",
		boosts: {
			spd: 2,
			spa: 2,
		},
	},
	aurorabeam: {
		inherit: true,
		desc: "Has a 33% chance to lower the target's Attack by 1 stage.",
		shortDesc: "33% chance to lower the target's Attack by 1.",
		secondary: {
			chance: 33,
			boosts: {
				atk: -1,
			},
		},
	},
	bide: {
		inherit: true,
		priority: 0,
		accuracy: true,
		ignoreEvasion: true,
		effect: {
			duration: 2,
			durationCallback: function (target, source, effect) {
				return this.random(3, 4);
			},
			onStart: function (pokemon) {
				this.effectData.totalDamage = 0;
				this.effectData.lastDamage = 0;
				this.add('-start', pokemon, 'Bide');
			},
			onHit: function (target, source, move) {
				if (source && source !== target && move.category !== 'Physical' && move.category !== 'Special') {
					let damage = this.effectData.totalDamage;
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
				// Sleep, freeze, and partial trap will just pause duration.
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
					let target = this.effectData.sourceSide.active[this.effectData.sourcePosition];
					this.moveHit(target, pokemon, 'bide', {damage: this.effectData.totalDamage * 2});
					return false;
				}
				this.add('-activate', pokemon, 'Bide');
				return false;
			},
			onDisableMove: function (pokemon) {
				if (!pokemon.hasMove('bide')) {
					return;
				}
				let moves = pokemon.moveset;
				for (let i = 0; i < moves.length; i++) {
					if (moves[i].id !== 'bide') {
						pokemon.disableMove(moves[i].id);
					}
				}
			},
		},
		type: "???", // Will look as Normal but it's STAB-less
	},
	bind: {
		inherit: true,
		ignoreImmunity: true,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock',
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
	},
	bite: {
		inherit: true,
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		type: "Normal",
	},
	blizzard: {
		inherit: true,
		accuracy: 90,
		target: "normal",
	},
	bubble: {
		inherit: true,
		desc: "Has a 33% chance to lower the target's Speed by 1 stage.",
		shortDesc: "33% chance to lower the target's Speed by 1.",
		secondary: {
			chance: 33,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
	},
	bubblebeam: {
		inherit: true,
		desc: "Has a 33% chance to lower the target's Speed by 1 stage.",
		shortDesc: "33% chance to lower the target's Speed by 1.",
		secondary: {
			chance: 33,
			boosts: {
				spe: -1,
			},
		},
	},
	clamp: {
		inherit: true,
		accuracy: 75,
		pp: 10,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock',
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
	},
	constrict: {
		inherit: true,
		desc: "Has a 33% chance to lower the target's Speed by 1 stage.",
		shortDesc: "33% chance to lower the target's Speed by 1.",
		secondary: {
			chance: 33,
			boosts: {
				spe: -1,
			},
		},
	},
	conversion: {
		inherit: true,
		volatileStatus: 'conversion',
		accuracy: true,
		target: "normal",
		onHit: function (target, source) {
			source.types = target.types;
			this.add('-start', source, 'typechange', source.types.join(', '), '[from] move: Conversion', '[of] ' + source);
		},
	},
	counter: {
		inherit: true,
		ignoreImmunity: true,
		willCrit: false,
		damageCallback: function (pokemon, target) {
			// Counter mechanics on gen 1 might be hard to understand.
			// It will fail if the last move selected by the opponent has base power 0 or is not Normal or Fighting Type.
			// If both are true, counter will deal twice the last damage dealt in battle, no matter what was the move.
			// That means that, if opponent switches, counter will use last counter damage * 2.
			let lastUsedMove = this.getMove(target.side.lastMove);
			if (lastUsedMove && lastUsedMove.basePower > 0 && lastUsedMove.type in {'Normal': 1, 'Fighting': 1} && target.battle.lastDamage > 0 && !this.willMove(target)) {
				return 2 * target.battle.lastDamage;
			}
			this.add('-fail', pokemon);
			return false;
		},
	},
	crabhammer: {
		inherit: true,
		critRatio: 2,
	},
	dig: {
		inherit: true,
		desc: "This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Bide and Swift.",
		basePower: 100,
		effect: {
			duration: 2,
			onLockMove: 'dig',
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
			},
		},
	},
	disable: {
		inherit: true,
		desc: "The target cannot choose a random move for 0-6 turns. Disable only works on one move at a time and fails if the target has not yet used a move or if its move has run out of PP. The target does nothing if it is about to use a move that becomes disabled.",
		effect: {
			duration: 4,
			durationCallback: function (target, source, effect) {
				let duration = this.random(1, 7);
				return duration;
			},
			onStart: function (pokemon) {
				if (!this.willMove(pokemon)) {
					this.effectData.duration++;
				}
				let moves = pokemon.moves;
				let move = this.getMove(moves[this.random(moves.length)]);
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
			onDisableMove: function (pokemon) {
				let moves = pokemon.moveset;
				for (let i = 0; i < moves.length; i++) {
					if (moves[i].id === this.effectData.move) {
						pokemon.disableMove(moves[i].id);
					}
				}
			},
		},
	},
	dizzypunch: {
		inherit: true,
		desc: "Deals damage to the target.",
		shortDesc: "Deals damage.",
		secondary: false,
	},
	doubleedge: {
		inherit: true,
		basePower: 100,
	},
	dragonrage: {
		inherit: true,
		basePower: 1,
	},
	explosion: {
		inherit: true,
		basePower: 170,
		target: "normal",
	},
	fireblast: {
		inherit: true,
		desc: "Deals damage to the target with a 30% chance to burn it.",
		shortDesc: "30% chance to burn the target.",
		secondary: {
			chance: 30,
			status: 'brn',
		},
	},
	firespin: {
		inherit: true,
		accuracy: 70,
		basePower: 15,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock',
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
	},
	fly: {
		inherit: true,
		desc: "This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Bide and Swift.",
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
			},
		},
	},
	focusenergy: {
		inherit: true,
		desc: "If the attack deals critical hits sometimes, then the chance of its happening is quartered. If a move has a high chance of dealing a critical hit, if the user iis currently faster than the opposing Pokemon its critical hit ratio is not decreased. If it's slower, its chances of dealing a critical hit is cut by 50%. If the user is significantly slower than the opposing Pokemon, then the user will be unable to deal critical hits to the opposing Pokemon.",
		shortDesc: "Reduces the user's chance for a critical hit.",
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'move: Focus Energy');
			},
			// This does nothing as it's dealt with on critical hit calculation.
			onModifyMove: function () {},
		},
	},
	glare: {
		inherit: true,
		ignoreImmunity: true,
	},
	growth: {
		inherit: true,
		desc: "Raises the user's Special by 1 stage.",
		shortDesc: "Boosts the user's Special by 1.",
		boosts: {
			spa: 1,
			spd: 1,
		},
	},
	gust: {
		inherit: true,
		type: "Normal",
	},
	haze: {
		inherit: true,
		desc: "Eliminates any stat stage changes and status from all active Pokemon.",
		shortDesc: "Eliminates all stat changes and status.",
		onHit: function (target, source) {
			this.add('-clearallboost');
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let pokemon = this.sides[i].active[j];
					pokemon.clearBoosts();

					if (pokemon !== source) {
						// Clears the status from the opponent
						pokemon.setStatus('');
					}
					if (pokemon.status === 'tox') {
						pokemon.setStatus('psn');
					}
					let volatiles = Object.keys(pokemon.volatiles);
					for (let n = 0; n < volatiles.length; n++) {
						let id = volatiles[n];
						if (id === 'residualdmg') {
							pokemon.volatiles[id].counter = 0;
						} else {
							pokemon.removeVolatile(id);
							this.add('-end', pokemon, id);
						}
					}
				}
			}
		},
		target: "self",
	},
	highjumpkick: {
		inherit: true,
		desc: "If this attack misses the target, the user takes 1 HP of damage.",
		shortDesc: "User takes 1 HP damage it would have dealt if miss.",
		onMoveFail: function (target, source, move) {
			if (target.type !== 'ghost') {
				this.directDamage(1, source);
			}
		},
	},
	hyperbeam: {
		inherit: true,
		desc: "Deals damage to a target. If this move is successful, the user must recharge on the following turn and cannot make a move, unless the opponent faints or a Substitute is destroyed.",
		shortDesc: "User cannot move next turn unless target or substitute faints.",
	},
	jumpkick: {
		inherit: true,
		desc: "If this attack misses the target, the user 1HP of damage.",
		shortDesc: "User takes 1 HP damage if miss.",
		onMoveFail: function (target, source, move) {
			this.damage(1, source);
		},
	},
	karatechop: {
		inherit: true,
		critRatio: 2,
		type: "Normal",
	},
	leechseed: {
		inherit: true,
		onHit: function () {},
		effect: {
			onStart: function (target) {
				this.add('-start', target, 'move: Leech Seed');
			},
			onAfterMoveSelfPriority: 1,
			onAfterMoveSelf: function (pokemon) {
				let leecher = pokemon.side.foe.active[pokemon.volatiles['leechseed'].sourcePosition];
				if (!leecher || leecher.fainted || leecher.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				// We check if leeched Pokémon has Toxic to increase leeched damage.
				let toxicCounter = 1;
				if (pokemon.volatiles['residualdmg']) {
					pokemon.volatiles['residualdmg'].counter++;
					toxicCounter = pokemon.volatiles['residualdmg'].counter;
				}
				let toLeech = this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1) * toxicCounter;
				let damage = this.damage(toLeech, pokemon, leecher);
				if (damage) this.heal(damage, leecher, pokemon);
			},
		},
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
		flags: {},
		volatileStatus: 'lightscreen',
		onTryHit: function (pokemon) {
			if (pokemon.volatiles['lightscreen']) {
				return false;
			}
		},
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Light Screen');
			},
		},
		target: "self",
		type: "Psychic",
	},
	metronome: {
		inherit: true,
		noMetronome: {metronome:1, struggle:1},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	mimic: {
		inherit: true,
		desc: "This move is replaced by a random move on target's moveset. The copied move has the maximum PP for that move. Ignores a target's Substitute.",
		shortDesc: "A random target's move replaces this one.",
		onHit: function (target, source) {
			let moveslot = source.moves.indexOf('mimic');
			if (moveslot < 0) return false;
			let moves = target.moves;
			let move = moves[this.random(moves.length)];
			if (!move) return false;
			move = this.getMove(move);
			source.moveset[moveslot] = {
				move: move.name,
				id: move.id,
				pp: source.moveset[moveslot].pp,
				maxpp: move.pp * 8 / 5,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			source.moves[moveslot] = toId(move.name);
			this.add('-start', source, 'Mimic', move.name);
		},
	},
	mirrormove: {
		inherit: true,
		onHit: function (pokemon) {
			let foe = pokemon.side.foe.active[0];
			if (!foe || !foe.lastMove || foe.lastMove === 'mirrormove') {
				return false;
			}
			this.useMove(foe.lastMove, pokemon);
		},
	},
	nightshade: {
		inherit: true,
		desc: "Deals damage to the target equal to the user's level. This move can hit Normal-type Pokemon.",
		shortDesc: "Damage = user's level. Can hit Normal types.",
		ignoreImmunity: true,
		basePower: 1,
	},
	poisonsting: {
		inherit: true,
		desc: "Has a 20% chance to poison the target.",
		shortDesc: "20% chance to poison the target.",
		secondary: {
			chance: 20,
			status: 'psn',
		},
	},
	psychic: {
		inherit: true,
		desc: "Has a 33% chance to lower the target's Special by 1 stage.",
		shortDesc: "33% chance to lower the target's Special by 1.",
		secondary: {
			chance: 33,
			boosts: {
				spd: -1,
				spa: -1,
			},
		},
	},
	psywave: {
		inherit: true,
		basePower: 1,
	},
	rage: {
		inherit: true,
		self: {
			volatileStatus: 'rage',
		},
		effect: {
			// Rage lock
			duration: 255,
			onStart: function (target, source, effect) {
				this.effectData.move = 'rage';
			},
			onLockMove: 'rage',
			onTryHit: function (target, source, move) {
				if (target.boosts.atk < 6 && move.id === 'disable') {
					this.boost({atk:1});
				}
			},
			onHit: function (target, source, move) {
				if (target.boosts.atk < 6 && move.category !== 'Status') {
					this.boost({atk:1});
				}
			},
		},
	},
	razorleaf: {
		inherit: true,
		critRatio: 2,
		target: "normal",
	},
	razorwind: {
		inherit: true,
		critRatio: 1,
		target: "normal",
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
		},
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
		flags: {},
		volatileStatus: 'reflect',
		onTryHit: function (pokemon) {
			if (pokemon.volatiles['reflect']) {
				return false;
			}
		},
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Reflect');
			},
		},
		secondary: false,
		target: "self",
		type: "Psychic",
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
		},
	},
	roar: {
		inherit: true,
		desc: "Does nothing.",
		shortDesc: "Does nothing.",
		isViable: false,
		forceSwitch: false,
		onTryHit: function () {},
		priority: 0,
	},
	rockslide: {
		inherit: true,
		desc: "Deals damage to a foe.",
		shortDesc: "Deals damage.",
		secondary: false,
		target: "normal",
	},
	rockthrow: {
		inherit: true,
		accuracy: 65,
	},
	sandattack: {
		inherit: true,
		ignoreImmunity: true,
		type: "Normal",
	},
	seismictoss: {
		inherit: true,
		desc: "Deals damage to the target equal to the user's level. This move can hit Ghost-type Pokemon.",
		shortDesc: "Damage = user's level. Can hit Ghost types.",
		ignoreImmunity: true,
		basePower: 1,
	},
	selfdestruct: {
		inherit: true,
		basePower: 130,
		target: "normal",
	},
	skullbash: {
		inherit: true,
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				attacker.removeVolatile(move.id);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
	},
	slash: {
		inherit: true,
		critRatio: 2,
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
		},
	},
	struggle: {
		inherit: true,
		onModifyMove: function () {},
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
				this.effectData.hp = Math.floor(target.maxhp / 4) + 1;
				delete target.volatiles['partiallytrapped'];
			},
			onTryHitPriority: -1,
			onTryHit: function (target, source, move) {
				if (move.category === 'Status') {
					// In gen 1 it only blocks:
					// poison, confusion, secondary effect confusion, stat reducing moves and Leech Seed.
					let SubBlocked = {
						lockon:1, meanlook:1, mindreader:1, nightmare:1,
					};
					if (move.status === 'psn' || move.status === 'tox' || (move.boosts && target !== source) || move.volatileStatus === 'confusion' || SubBlocked[move.id]) {
						return false;
					}
					return;
				}
				if (move.volatileStatus && target === source) return;
				let damage = this.getDamage(source, target, move);
				if (!damage) return null;
				damage = this.runEvent('SubDamage', target, source, move, damage);
				if (!damage) return damage;
				target.volatiles['substitute'].hp -= damage;
				source.lastDamage = damage;
				if (target.volatiles['substitute'].hp <= 0) {
					target.removeVolatile('substitute');
					target.subFainted = true;
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				// Drain/recoil does not happen if the substitute breaks
				if (target.volatiles['substitute']) {
					if (move.recoil) {
						this.damage(Math.round(damage * move.recoil[0] / move.recoil[1]), source, target, 'recoil');
					}
					if (move.drain) {
						this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
					}
				}
				this.runEvent('AfterSubDamage', target, source, move, damage);
				// Add here counter damage
				if (!target.lastAttackedBy) target.lastAttackedBy = {pokemon: source, thisTurn: true};
				target.lastAttackedBy.move = move.id;
				target.lastAttackedBy.damage = damage;
				return 0;
			},
			onEnd: function (target) {
				this.add('-end', target, 'Substitute');
			},
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	superfang: {
		inherit: true,
		desc: "Deals damage to the target equal to half of its current HP, rounded down, but not less than 1 HP. This move can hit Ghost-type Pokemon.",
		shortDesc: "Damage = 1/2 target's current HP. Hits Ghosts.",
		ignoreImmunity: true,
		basePower: 1,
	},
	thunder: {
		inherit: true,
		desc: "Has a 10% chance to paralyze the target.",
		shortDesc: "10% chance to paralyze the target.",
		secondary: {
			chance: 10,
			status: 'par',
		},
	},
	thunderwave: {
		inherit: true,
		accuracy: 100,
		onTryHit: function (target) {
			if (target.hasType('Ground')) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
	},
	triattack: {
		inherit: true,
		secondary: false,
	},
	whirlwind: {
		inherit: true,
		accuracy: 85,
		desc: "Does nothing.",
		shortDesc: "Does nothing.",
		isViable: false,
		forceSwitch: false,
		onTryHit: function () {},
		priority: 0,
	},
	wingattack: {
		inherit: true,
		basePower: 35,
	},
	wrap: {
		inherit: true,
		accuracy: 85,
		ignoreImmunity: true,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock',
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
	},
};
