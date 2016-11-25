'use strict';

exports.BattleMovedex = {
	acupressure: {
		inherit: true,
		desc: "Raises a random stat by 2 stages as long as the stat is not already at stage 6. The user can choose to use this move on itself or an ally. Fails if no stat stage can be raised or if the user or ally has a substitute.",
		flags: {snatch: 1},
		onHit: function (target) {
			if (target.volatiles['substitute']) {
				return false;
			}
			let stats = [];
			for (let stat in target.boosts) {
				if (target.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				let randomStat = stats[this.random(stats.length)];
				let boost = {};
				boost[randomStat] = 2;
				this.boost(boost);
			} else {
				return false;
			}
		},
	},
	aromatherapy: {
		inherit: true,
		onHit: function (target, source) {
			this.add('-cureteam', source, '[from] move: Aromatherapy');
			source.side.pokemon.forEach(pokemon => pokemon.clearStatus());
		},
	},
	assist: {
		inherit: true,
		desc: "A random move among those known by the user's party members is selected for use. Does not select Assist, Chatter, Copycat, Counter, Covet, Destiny Bond, Detect, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Protect, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief or Trick.",
		onHit: function (target) {
			let moves = [];
			for (let j = 0; j < target.side.pokemon.length; j++) {
				let pokemon = target.side.pokemon[j];
				if (pokemon === target) continue;
				for (let i = 0; i < pokemon.moves.length; i++) {
					let move = pokemon.moves[i];
					let noAssist = {
						assist:1, chatter:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, endure:1, feint:1, focuspunch:1, followme:1, helpinghand:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, protect:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, switcheroo:1, thief:1, trick:1,
					};
					if (move && !noAssist[move]) {
						moves.push(move);
					}
				}
			}
			let randomMove = '';
			if (moves.length) randomMove = moves[this.random(moves.length)];
			if (!randomMove) {
				return false;
			}
			this.useMove(randomMove, target);
		},
	},
	aquaring: {
		inherit: true,
		flags: {},
	},
	beatup: {
		inherit: true,
		basePower: 10,
		basePowerCallback: function (pokemon, target) {
			pokemon.addVolatile('beatup');
			if (!pokemon.side.pokemon[pokemon.volatiles.beatup.index]) return null;
			return 10;
		},
		desc: "Deals typeless damage. Hits one time for the user and one time for each unfainted Pokemon without a major status condition in the user's party. For each hit, the damage formula uses the participating Pokemon's base Attack as the Attack stat, the target's base Defense as the Defense stat, and ignores stat stages and other effects that modify Attack or Defense; each hit is considered to come from the user.",
		onModifyMove: function (move, pokemon) {
			move.type = '???';
			move.category = 'Physical';
		},
		effect: {
			duration: 1,
			onStart: function (pokemon) {
				let index = 0;
				let team = pokemon.side.pokemon;
				while (!team[index] || team[index].fainted || team[index].status) {
					index++;
					if (index >= team.length) break;
				}
				this.effectData.index = index;
			},
			onRestart: function (pokemon) {
				let index = this.effectData.index;
				let team = pokemon.side.pokemon;
				do {
					index++;
					if (index >= team.length) break;
				} while (!team[index] || team[index].fainted || team[index].status);
				this.effectData.index = index;
			},
			onModifyAtkPriority: -101,
			onModifyAtk: function (atk, pokemon) {
				this.add('-activate', pokemon, 'move: Beat Up', '[of] ' + pokemon.side.pokemon[this.effectData.index].name);
				this.event.modifier = 1;
				return pokemon.side.pokemon[this.effectData.index].template.baseStats.atk;
			},
			onFoeModifyDefPriority: -101,
			onFoeModifyDef: function (def, pokemon) {
				this.event.modifier = 1;
				return pokemon.template.baseStats.def;
			},
		},
	},
	bide: {
		inherit: true,
		effect: {
			duration: 3,
			onLockMove: 'bide',
			onStart: function (pokemon) {
				this.effectData.totalDamage = 0;
				this.add('-start', pokemon, 'move: Bide');
			},
			onDamagePriority: -101,
			onDamage: function (damage, target, source, move) {
				if (!move || move.effectType !== 'Move' || !source) return;
				this.effectData.totalDamage += damage;
				this.effectData.lastDamageSource = source;
			},
			onAfterSetStatus: function (status, pokemon) {
				if (status.id === 'slp' || status.id === 'frz') {
					pokemon.removeVolatile('bide');
				}
			},
			onBeforeMove: function (pokemon, target, move) {
				if (this.effectData.duration === 1) {
					this.add('-end', pokemon, 'move: Bide');
					if (!this.effectData.totalDamage) {
						this.add('-fail', pokemon);
						return false;
					}
					target = this.effectData.lastDamageSource;
					if (!target) {
						this.add('-fail', pokemon);
						return false;
					}
					if (!target.isActive) target = this.resolveTarget(pokemon, this.getMove('pound'));
					if (!this.isAdjacent(pokemon, target)) {
						this.add('-miss', pokemon, target);
						return false;
					}
					let moveData = {
						id: 'bide',
						name: "Bide",
						accuracy: true,
						damage: this.effectData.totalDamage * 2,
						category: "Physical",
						priority: 1,
						flags: {contact: 1, protect: 1},
						ignoreImmunity: true,
						effectType: 'Move',
						type: 'Normal',
					};
					this.tryMoveHit(target, pokemon, moveData);
					return false;
				}
				this.add('-activate', pokemon, 'move: Bide');
			},
			onMoveAborted: function (pokemon) {
				pokemon.removeVolatile('bide');
			},
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'move: Bide', '[silent]');
			},
		},
	},
	bind: {
		inherit: true,
		accuracy: 75,
	},
	bonerush: {
		inherit: true,
		accuracy: 80,
	},
	bravebird: {
		inherit: true,
		recoil: [1, 3],
	},
	brickbreak: {
		inherit: true,
		desc: "Whether or not this attack misses or the target is immune, the effects of Reflect and Light Screen end for the target's side of the field before damage is calculated.",
		shortDesc: "Destroys screens, even if the target is immune.",
		onTryHit: function (pokemon) {
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
		},
	},
	bulletseed: {
		inherit: true,
		basePower: 10,
	},
	chatter: {
		inherit: true,
		desc: "Has an X% chance to confuse the target, where X is 0 unless the user is a Chatot that hasn't Transformed. If the user is a Chatot, X is 1, 11, or 31 depending on the volume of Chatot's recorded cry, if any; 1 for no recording or low volume, 11 for medium volume, and 31 for high volume.",
		shortDesc: "For Chatot, 31% chance to confuse the target.",
		secondary: {
			chance: 31,
			volatileStatus: 'confusion',
		},
	},
	clamp: {
		inherit: true,
		accuracy: 75,
		pp: 10,
	},
	conversion: {
		inherit: true,
		flags: {},
	},
	copycat: {
		inherit: true,
		onHit: function (pokemon) {
			let noCopycat = {assist:1, chatter:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, endure:1, feint:1, focuspunch:1, followme:1, helpinghand:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, protect:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, switcheroo:1, thief:1, trick:1};
			if (!this.lastMove || noCopycat[this.lastMove]) {
				return false;
			}
			this.useMove(this.lastMove, pokemon);
		},
	},
	cottonspore: {
		inherit: true,
		accuracy: 85,
	},
	covet: {
		inherit: true,
		basePower: 40,
	},
	crabhammer: {
		inherit: true,
		accuracy: 85,
	},
	crushgrip: {
		inherit: true,
		basePowerCallback: function (pokemon, target) {
			return Math.floor(target.hp * 120 / target.maxhp) + 1;
		},
	},
	curse: {
		inherit: true,
		desc: "If the user is not a Ghost type, lowers the user's Speed by 1 stage and raises the user's Attack and Defense by 1 stage. If the user is a Ghost type, the user loses 1/2 of its maximum HP, rounded down and even if it would cause fainting, in exchange for the target losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if there is no target or if the target is already affected or has a substitute.",
		flags: {},
		onModifyMove: function (move, source, target) {
			if (!source.hasType('Ghost')) {
				delete move.volatileStatus;
				delete move.onHit;
				move.self = {boosts: {atk:1, def:1, spe:-1}};
				move.target = move.nonGhostTarget;
			} else if (target.volatiles['substitute']) {
				delete move.volatileStatus;
				delete move.onHit;
			}
		},
		type: "???",
	},
	defog: {
		inherit: true,
		flags: {protect: 1, mirror: 1, authentic: 1},
	},
	detect: {
		inherit: true,
		priority: 3,
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (!move.flags['protect']) return;
				this.add('-activate', target, 'Protect');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is NOT reset
					if (source.volatiles['lockedmove'].trueDuration >= 2) {
						source.volatiles['lockedmove'].duration = 2;
					}
				}
				return null;
			},
		},
	},
	disable: {
		inherit: true,
		accuracy: 80,
		desc: "For 4 to 7 turns, the target's last move used becomes disabled. Fails if one of the target's moves is already disabled, if the target has not made a move, or if the target no longer knows the move.",
		flags: {protect: 1, mirror: 1, authentic: 1},
		volatileStatus: 'disable',
		effect: {
			durationCallback: function () {
				return this.random(4, 8);
			},
			noCopy: true,
			onStart: function (pokemon) {
				if (!this.willMove(pokemon)) {
					this.effectData.duration++;
				}
				if (!pokemon.lastMove) {
					return false;
				}
				let moves = pokemon.moveset;
				for (let i = 0; i < moves.length; i++) {
					if (moves[i].id === pokemon.lastMove) {
						if (!moves[i].pp) {
							return false;
						} else {
							this.add('-start', pokemon, 'Disable', moves[i].move);
							this.effectData.move = pokemon.lastMove;
							return;
						}
					}
				}
				return false;
			},
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'move: Disable');
			},
			onBeforeMovePriority: 7,
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
	doomdesire: {
		inherit: true,
		accuracy: 85,
		basePower: 120,
		desc: "Deals typeless damage that cannot be a critical hit two turns after this move is used. Damage is calculated against the target on use, and at the end of the final turn that damage is dealt to the Pokemon at the position the original target had at the time. Fails if this move or Future Sight is already in effect for the target's position.",
		onTry: function (source, target) {
			target.side.addSideCondition('futuremove');
			if (target.side.sideConditions['futuremove'].positions[target.position]) {
				return false;
			}
			let damage = this.getDamage(source, target, {
				name: "Doom Desire",
				basePower: 120,
				category: "Special",
				flags: {},
				willCrit: false,
				type: '???',
			}, true);
			target.side.sideConditions['futuremove'].positions[target.position] = {
				duration: 3,
				move: 'doomdesire',
				source: source,
				moveData: {
					id: 'doomdesire',
					name: "Doom Desire",
					accuracy: 85,
					basePower: 0,
					damage: damage,
					category: "Special",
					flags: {},
					effectType: 'Move',
					isFutureMove: true,
					type: '???',
				},
			};
			this.add('-start', source, 'Doom Desire');
			return null;
		},
	},
	doubleedge: {
		inherit: true,
		recoil: [1, 3],
	},
	drainpunch: {
		inherit: true,
		basePower: 60,
		pp: 5,
	},
	dreameater: {
		inherit: true,
		desc: "The target is unaffected by this move unless it is asleep and does not have a substitute. The user recovers 1/2 the HP lost by the target, rounded down, but not less than 1 HP. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded down.",
		onTryHit: function (target) {
			if (target.status !== 'slp' || target.volatiles['substitute']) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
	},
	embargo: {
		inherit: true,
		flags: {protect: 1, mirror: 1},
		onTryHit: function (pokemon) {
			if (pokemon.ability === 'multitype' || pokemon.item === 'griseousorb') {
				return false;
			}
		},
	},
	encore: {
		inherit: true,
		desc: "For 4 to 8 turns, the target is forced to repeat its last move used. If the affected move runs out of PP, the effect ends. Fails if the target is already under this effect, if it has not made a move, if the move has 0 PP, or if the move is Encore, Mimic, Mirror Move, Sketch, Struggle, or Transform.",
		shortDesc: "The target repeats its last move for 4-8 turns.",
		flags: {protect: 1, mirror: 1, authentic: 1},
		volatileStatus: 'encore',
		effect: {
			durationCallback: function () {
				return this.random(4, 9);
			},
			onStart: function (target) {
				let noEncore = {encore:1, mimic:1, mirrormove:1, sketch:1, struggle:1, transform:1};
				let moveIndex = target.moves.indexOf(target.lastMove);
				if (!target.lastMove || noEncore[target.lastMove] || (target.moveset[moveIndex] && target.moveset[moveIndex].pp <= 0)) {
					// it failed
					this.add('-fail', target);
					delete target.volatiles['encore'];
					return;
				}
				this.effectData.move = target.lastMove;
				this.add('-start', target, 'Encore');
				if (!this.willMove(target)) {
					this.effectData.duration++;
				}
			},
			onOverrideDecision: function (pokemon) {
				return this.effectData.move;
			},
			onResidualOrder: 13,
			onResidual: function (target) {
				if (target.moves.indexOf(target.lastMove) >= 0 && target.moveset[target.moves.indexOf(target.lastMove)].pp <= 0) {
					// early termination if you run out of PP
					delete target.volatiles.encore;
					this.add('-end', target, 'Encore');
				}
			},
			onEnd: function (target) {
				this.add('-end', target, 'Encore');
			},
			onDisableMove: function (pokemon) {
				if (!this.effectData.move || !pokemon.hasMove(this.effectData.move)) {
					return;
				}
				for (let i = 0; i < pokemon.moveset.length; i++) {
					if (pokemon.moveset[i].id !== this.effectData.move) {
						pokemon.disableMove(pokemon.moveset[i].id);
					}
				}
			},
		},
	},
	endeavor: {
		inherit: true,
		onTry: function (pokemon, target) {
			if (pokemon.hp >= target.hp) {
				this.add('-fail', pokemon);
				return null;
			}
		},
	},
	explosion: {
		inherit: true,
		basePower: 500,
	},
	extremespeed: {
		inherit: true,
		shortDesc: "Usually goes first.",
		priority: 1,
	},
	fakeout: {
		inherit: true,
		priority: 1,
	},
	feint: {
		inherit: true,
		basePower: 50,
		desc: "Fails unless the target is using Detect or Protect. If this move is successful, it breaks through the target's Detect or Protect for this turn, allowing other Pokemon to attack the target normally.",
		shortDesc: "Breaks protection. Fails if target is not protecting.",
		onTry: function (source, target) {
			if (!target.volatiles['protect']) {
				this.add('-fail', source);
				return null;
			}
		},
	},
	firespin: {
		inherit: true,
		accuracy: 70,
		basePower: 15,
	},
	flail: {
		inherit: true,
		basePowerCallback: function (pokemon, target) {
			let ratio = pokemon.hp * 64 / pokemon.maxhp;
			if (ratio < 2) {
				return 200;
			}
			if (ratio < 6) {
				return 150;
			}
			if (ratio < 13) {
				return 100;
			}
			if (ratio < 22) {
				return 80;
			}
			if (ratio < 43) {
				return 40;
			}
			return 20;
		},
	},
	flareblitz: {
		inherit: true,
		recoil: [1, 3],
	},
	focuspunch: {
		inherit: true,
		beforeMoveCallback: function () { },
		onTry: function (pokemon) {
			if (pokemon.volatiles['focuspunch'] && pokemon.volatiles['focuspunch'].lostFocus) {
				this.attrLastMove('[still]');
				this.add('cant', pokemon, 'Focus Punch', 'Focus Punch');
				return false;
			}
		},
	},
	foresight: {
		inherit: true,
		flags: {protect: 1, mirror: 1, authentic: 1},
	},
	furycutter: {
		inherit: true,
		basePower: 10,
	},
	futuresight: {
		inherit: true,
		accuracy: 90,
		basePower: 80,
		desc: "Deals typeless damage that cannot be a critical hit two turns after this move is used. Damage is calculated against the target on use, and at the end of the final turn that damage is dealt to the Pokemon at the position the original target had at the time. Fails if this move or Doom Desire is already in effect for the target's position.",
		pp: 15,
		onTry: function (source, target) {
			target.side.addSideCondition('futuremove');
			if (target.side.sideConditions['futuremove'].positions[target.position]) {
				return false;
			}
			let damage = this.getDamage(source, target, {
				name: "Future Sight",
				basePower: 80,
				category: "Special",
				flags: {},
				willCrit: false,
				type: '???',
			}, true);
			target.side.sideConditions['futuremove'].positions[target.position] = {
				duration: 3,
				move: 'futuresight',
				source: source,
				moveData: {
					id: 'futuresight',
					name: "Future Sight",
					accuracy: 90,
					basePower: 0,
					damage: damage,
					category: "Special",
					flags: {},
					effectType: 'Move',
					isFutureMove: true,
					type: '???',
				},
			};
			this.add('-start', source, 'Future Sight');
			return null;
		},
	},
	gigadrain: {
		inherit: true,
		basePower: 60,
	},
	glare: {
		inherit: true,
		accuracy: 75,
	},
	growth: {
		inherit: true,
		desc: "Raises the user's Special Attack by 1 stage.",
		shortDesc: "Raises the user's Sp. Atk by 1.",
		onModifyMove: function () { },
		boosts: {
			spa: 1,
		},
	},
	healbell: {
		inherit: true,
		onHit: function (target, source) {
			this.add('-activate', source, 'move: Heal Bell');
			source.side.pokemon.forEach(pokemon => {
				if (!pokemon.hasAbility('soundproof')) pokemon.cureStatus(true);
			});
		},
	},
	healblock: {
		inherit: true,
		desc: "For 5 turns, the target is prevented from restoring any HP as long as it remains active. During the effect, healing moves are unusable, move effects that grant healing will not heal, but Abilities and items will continue to heal the user. If an affected Pokemon uses Baton Pass, the replacement will remain under the effect. Pain Split is unaffected.",
		flags: {protect: 1, mirror: 1},
		effect: {
			duration: 5,
			durationCallback: function (target, source, effect) {
				if (source && source.hasAbility('persistent')) {
					return 7;
				}
				return 5;
			},
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'move: Heal Block');
			},
			onDisableMove: function (pokemon) {
				for (let i = 0; i < pokemon.moveset.length; i++) {
					if (this.getMove(pokemon.moveset[i].id).flags['heal']) {
						pokemon.disableMove(pokemon.moveset[i].id);
					}
				}
			},
			onBeforeMovePriority: 6,
			onBeforeMove: function (pokemon, target, move) {
				if (move.flags['heal']) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onResidualOrder: 17,
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'move: Heal Block');
			},
			onTryHeal: function (damage, pokemon, source, effect) {
				if (effect && (effect.id === 'drain' || effect.id === 'leechseed' || effect.id === 'wish')) {
					return false;
				}
			},
		},
	},
	healingwish: {
		inherit: true,
		flags: {heal: 1},
		onAfterMove: function (pokemon) {
			pokemon.switchFlag = true;
		},
		effect: {
			duration: 1,
			onStart: function (side) {
				this.debug('Healing Wish started on ' + side.name);
			},
			onSwitchInPriority: -1,
			onSwitchIn: function (target) {
				if (target.position !== this.effectData.sourcePosition) {
					return;
				}
				if (target.hp > 0) {
					target.heal(target.maxhp);
					target.setStatus('');
					this.add('-heal', target, target.getHealth, '[from] move: Healing Wish');
					target.side.removeSideCondition('healingwish');
				} else {
					target.switchFlag = true;
				}
			},
		},
	},
	highjumpkick: {
		inherit: true,
		basePower: 100,
		desc: "If this attack is not successful, the user loses HP equal to half the target's maximum HP, rounded down, if the target is immune, or half of the damage the target would have taken, rounded down, but no less than 1 HP and no more than half of the target's maximum HP, as crash damage. Pokemon with the Ability Magic Guard are unaffected by crash damage.",
		shortDesc: "If miss, user takes 1/2 damage it would've dealt.",
		pp: 20,
		onMoveFail: function (target, source, move) {
			let damage = this.getDamage(source, target, move, true);
			if (!damage) damage = target.maxhp;
			this.damage(this.clampIntRange(damage / 2, 1, Math.floor(target.maxhp / 2)), source, source, 'highjumpkick');
		},
	},
	iciclespear: {
		inherit: true,
		basePower: 10,
	},
	imprison: {
		inherit: true,
		desc: "The user prevents all of its foes from using any moves that the user also knows as long as the user remains active. Fails if no opponents know any of the user's moves.",
		flags: {authentic: 1},
		onTryHit: function (pokemon) {
			let targets = pokemon.side.foe.active;
			for (let i = 0; i < targets.length; i++) {
				if (!targets[i] || targets[i].fainted) continue;
				for (let j = 0; j < pokemon.moves.length; j++) {
					if (targets[i].moves.indexOf(pokemon.moves[j]) >= 0) return;
				}
			}
			return false;
		},
	},
	jumpkick: {
		inherit: true,
		basePower: 85,
		desc: "If this attack is not successful, the user loses HP equal to half the target's maximum HP, rounded down, if the target is immune, or half of the damage the target would have taken, rounded down, but no less than 1 HP and no more than half of the target's maximum HP, as crash damage. Pokemon with the Ability Magic Guard are unaffected by crash damage.",
		shortDesc: "If miss, user takes 1/2 damage it would've dealt.",
		pp: 25,
		onMoveFail: function (target, source, move) {
			let damage = this.getDamage(source, target, move, true);
			if (!damage) damage = target.maxhp;
			this.damage(this.clampIntRange(damage / 2, 1, Math.floor(target.maxhp / 2)), source, source, 'jumpkick');
		},
	},
	lastresort: {
		inherit: true,
		basePower: 130,
	},
	luckychant: {
		inherit: true,
		flags: {},
	},
	lunardance: {
		inherit: true,
		flags: {heal: 1},
		onAfterMove: function (pokemon) {
			pokemon.switchFlag = true;
		},
		effect: {
			duration: 1,
			onStart: function (side) {
				this.debug('Lunar Dance started on ' + side.name);
			},
			onSwitchInPriority: -1,
			onSwitchIn: function (target) {
				if (target.position !== this.effectData.sourcePosition) {
					return;
				}
				if (target.hp > 0) {
					target.heal(target.maxhp);
					target.setStatus('');
					for (let m in target.moveset) {
						target.moveset[m].pp = target.moveset[m].maxpp;
					}
					this.add('-heal', target, target.getHealth, '[from] move: Lunar Dance');
					target.side.removeSideCondition('lunardance');
				} else {
					target.switchFlag = true;
				}
			},
		},
	},
	magiccoat: {
		inherit: true,
		desc: "The user is unaffected by certain non-damaging moves directed at it and will instead use such moves against the original user. Once a move is reflected, this effect ends. Moves reflected in this way are unable to be reflected again by another Pokemon under this effect. If the user has the Ability Soundproof, this move's effect happens before a sound-based move can be nullified. The Abilities Lightning Rod and Storm Drain redirect their respective moves before this move takes effect.",
		effect: {
			duration: 1,
			onTryHitPriority: 2,
			onTryHit: function (target, source, move) {
				if (target === source || move.hasBounced || !move.flags['reflectable']) {
					return;
				}
				target.removeVolatile('magiccoat');
				let newMove = this.getMoveCopy(move.id);
				newMove.hasBounced = true;
				this.useMove(newMove, target, source);
				return null;
			},
		},
	},
	magmastorm: {
		inherit: true,
		accuracy: 70,
	},
	magnetrise: {
		inherit: true,
		flags: {gravity: 1},
		volatileStatus: 'magnetrise',
		effect: {
			duration: 5,
			onStart: function (target) {
				if (target.volatiles['ingrain'] || target.ability === 'levitate') return false;
				this.add('-start', target, 'Magnet Rise');
			},
			onImmunity: function (type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 6,
			onResidualSubOrder: 9,
			onEnd: function (target) {
				this.add('-end', target, 'Magnet Rise');
			},
		},
	},
	metronome: {
		inherit: true,
		onHit: function (target) {
			let moves = [];
			for (let i in exports.BattleMovedex) {
				let move = exports.BattleMovedex[i];
				if (i !== move.id) continue;
				if (move.isNonstandard) continue;
				let noMetronome = {
					assist:1, chatter:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, endure:1, feint:1, focuspunch:1, followme:1, helpinghand:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, protect:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, switcheroo:1, thief:1, trick:1,
				};
				if (!noMetronome[move.id] && move.num < 468) {
					moves.push(move.id);
				}
			}
			let randomMove = '';
			if (moves.length) randomMove = moves[this.random(moves.length)];
			if (!randomMove) return false;
			this.useMove(randomMove, target);
		},
	},
	mimic: {
		inherit: true,
		onHit: function (target, source) {
			let disallowedMoves = {chatter:1, metronome:1, mimic:1, sketch:1, struggle:1, transform:1};
			if (source.transformed || !target.lastMove || disallowedMoves[target.lastMove] || source.moves.indexOf(target.lastMove) !== -1 || target.volatiles['substitute']) return false;
			let moveslot = source.moves.indexOf('mimic');
			if (moveslot < 0) return false;
			let move = Tools.getMove(target.lastMove);
			source.moveset[moveslot] = {
				move: move.name,
				id: move.id,
				pp: 5,
				maxpp: move.pp * 8 / 5,
				disabled: false,
				used: false,
				virtual: true,
			};
			source.moves[moveslot] = toId(move.name);
			this.add('-activate', source, 'move: Mimic', move.name);
		},
	},
	minimize: {
		inherit: true,
		desc: "Raises the user's evasiveness by 1 stage. Whether or not the user's evasiveness was changed, Stomp will have its power doubled if used against the user while it is active.",
		shortDesc: "Raises the user's evasiveness by 1.",
		boosts: {
			evasion: 1,
		},
	},
	miracleeye: {
		inherit: true,
		flags: {protect: 1, mirror: 1, authentic: 1},
	},
	mirrormove: {
		inherit: true,
		onTryHit: function () { },
		onHit: function (pokemon) {
			let noMirror = {acupressure:1, aromatherapy:1, assist:1, chatter:1, copycat:1, counter:1, curse:1, doomdesire:1, feint:1, focuspunch:1, futuresight:1, gravity:1, hail:1, haze:1, healbell:1, helpinghand:1, lightscreen:1, luckychant:1, magiccoat:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, mist:1, mudsport:1, naturepower:1, perishsong:1, psychup:1, raindance:1, reflect:1, roleplay:1, safeguard:1, sandstorm:1, sketch:1, sleeptalk:1, snatch:1, spikes:1, spitup:1, stealthrock:1, struggle:1, sunnyday:1, tailwind:1, toxicspikes:1, transform:1, watersport:1};
			if (!pokemon.lastAttackedBy || !pokemon.lastAttackedBy.pokemon.lastMove || noMirror[pokemon.lastAttackedBy.move] || !pokemon.lastAttackedBy.pokemon.hasMove(pokemon.lastAttackedBy.move)) {
				return false;
			}
			this.useMove(pokemon.lastAttackedBy.move, pokemon);
		},
		target: "self",
	},
	moonlight: {
		inherit: true,
		onHit: function (pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (this.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.heal(pokemon.maxhp / 4);
			} else {
				this.heal(pokemon.maxhp / 2);
			}
		},
	},
	morningsun: {
		inherit: true,
		onHit: function (pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (this.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.heal(pokemon.maxhp / 4);
			} else {
				this.heal(pokemon.maxhp / 2);
			}
		},
	},
	odorsleuth: {
		inherit: true,
		flags: {protect: 1, mirror: 1, authentic: 1},
	},
	outrage: {
		inherit: true,
		pp: 15,
		onAfterMove: function () {},
	},
	payback: {
		inherit: true,
		basePowerCallback: function (pokemon, target) {
			if (this.willMove(target)) {
				return 50;
			}
			return 100;
		},
		desc: "Power doubles if the target moves before the user; power is also doubled if the target switches out.",
	},
	petaldance: {
		inherit: true,
		basePower: 90,
		pp: 20,
		onAfterMove: function () {},
	},
	poisongas: {
		inherit: true,
		accuracy: 55,
		target: "normal",
	},
	powertrick: {
		inherit: true,
		flags: {},
	},
	protect: {
		inherit: true,
		priority: 3,
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (!move.flags['protect']) return;
				this.add('-activate', target, 'Protect');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is NOT reset
					if (source.volatiles['lockedmove'].trueDuration >= 2) {
						source.volatiles['lockedmove'].duration = 2;
					}
				}
				return null;
			},
		},
	},
	psychup: {
		inherit: true,
		flags: {snatch:1, authentic: 1},
	},
	recycle: {
		inherit: true,
		flags: {},
	},
	reversal: {
		inherit: true,
		basePowerCallback: function (pokemon, target) {
			let ratio = pokemon.hp * 64 / pokemon.maxhp;
			if (ratio < 2) {
				return 200;
			}
			if (ratio < 6) {
				return 150;
			}
			if (ratio < 13) {
				return 100;
			}
			if (ratio < 22) {
				return 80;
			}
			if (ratio < 43) {
				return 40;
			}
			return 20;
		},
	},
	roar: {
		inherit: true,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
	},
	rockblast: {
		inherit: true,
		accuracy: 80,
	},
	sandtomb: {
		inherit: true,
		accuracy: 70,
		basePower: 15,
	},
	scaryface: {
		inherit: true,
		accuracy: 90,
	},
	selfdestruct: {
		inherit: true,
		basePower: 400,
	},
	sketch: {
		inherit: true,
		onHit: function (target, source) {
			let disallowedMoves = {chatter:1, sketch:1, struggle:1};
			if (source.transformed || !target.lastMove || disallowedMoves[target.lastMove] || source.moves.indexOf(target.lastMove) >= 0 || target.volatiles['substitute']) return false;
			let moveslot = source.moves.indexOf('sketch');
			if (moveslot < 0) return false;
			let move = Tools.getMove(target.lastMove);
			let sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				disabled: false,
				used: false,
			};
			source.moveset[moveslot] = sketchedMove;
			source.baseMoveset[moveslot] = sketchedMove;
			source.moves[moveslot] = toId(move.name);
			this.add('-activate', source, 'move: Mimic', move.name);
		},
	},
	skillswap: {
		inherit: true,
		onHit: function (target, source) {
			let targetAbility = target.ability;
			let sourceAbility = source.ability;
			if (targetAbility === sourceAbility) {
				return false;
			}
			this.add('-activate', source, 'move: Skill Swap');
			source.setAbility(targetAbility);
			target.setAbility(sourceAbility);
		},
	},
	sleeptalk: {
		inherit: true,
		beforeMoveCallback: function (pokemon) {
			if (pokemon.volatiles['choicelock'] || pokemon.volatiles['encore']) {
				this.addMove('move', pokemon, 'Sleep Talk');
				this.add('-fail', pokemon);
				return true;
			}
		},
	},
	spikes: {
		inherit: true,
		flags: {},
	},
	spite: {
		inherit: true,
		flags: {protect: 1, mirror: 1, authentic: 1},
	},
	stealthrock: {
		inherit: true,
		flags: {},
	},
	struggle: {
		inherit: true,
		onModifyMove: function (move) {
			move.type = '???';
		},
	},
	suckerpunch: {
		inherit: true,
		desc: "Fails if the target did not select a physical or special attack for use this turn, or if the target moves before the user.",
		onTry: function (source, target) {
			let decision = this.willMove(target);
			if (!decision || decision.choice !== 'move' || decision.move.category === 'Status' || target.volatiles.mustrecharge) {
				this.add('-fail', source);
				return null;
			}
		},
	},
	synthesis: {
		inherit: true,
		onHit: function (pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (this.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.heal(pokemon.maxhp / 4);
			} else {
				this.heal(pokemon.maxhp / 2);
			}
		},
	},
	tackle: {
		inherit: true,
		accuracy: 95,
		basePower: 35,
	},
	tailglow: {
		inherit: true,
		desc: "Raises the user's Special Attack by 2 stages.",
		shortDesc: "Raises the user's Sp. Atk by 2.",
		boosts: {
			spa: 2,
		},
	},
	tailwind: {
		inherit: true,
		desc: "For 3 turns, the user and its party members have their Speed doubled. Fails if this move is already in effect for the user's side.",
		shortDesc: "For 3 turns, allies' Speed is doubled.",
		effect: {
			duration: 3,
			durationCallback: function (target, source, effect) {
				if (source && source.ability === 'persistent') {
					return 5;
				}
				return 3;
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Tailwind');
			},
			onModifySpe: function (spe) {
				return spe * 2;
			},
			onResidualOrder: 21,
			onResidualSubOrder: 4,
			onEnd: function (side) {
				this.add('-sideend', side, 'move: Tailwind');
			},
		},
	},
	taunt: {
		inherit: true,
		desc: "For 3 to 5 turns, prevents the target from using non-damaging moves.",
		shortDesc: "For 3-5 turns, the target can't use status moves.",
		flags: {protect: 1, mirror: 1, authentic: 1},
		effect: {
			durationCallback: function () {
				return this.random(3, 6);
			},
			onStart: function (target) {
				this.add('-start', target, 'move: Taunt');
			},
			onResidualOrder: 12,
			onEnd: function (target) {
				this.add('-end', target, 'move: Taunt');
			},
			onDisableMove: function (pokemon) {
				let moves = pokemon.moveset;
				for (let i = 0; i < moves.length; i++) {
					if (this.getMove(moves[i].move).category === 'Status') {
						pokemon.disableMove(moves[i].id);
					}
				}
			},
			onBeforeMovePriority: 5,
			onBeforeMove: function (attacker, defender, move) {
				if (move.category === 'Status') {
					this.add('cant', attacker, 'move: Taunt', move);
					return false;
				}
			},
		},
	},
	thrash: {
		inherit: true,
		basePower: 90,
		pp: 20,
		onAfterMove: function () {},
	},
	torment: {
		inherit: true,
		flags: {protect: 1, mirror: 1, authentic: 1},
	},
	toxic: {
		inherit: true,
		accuracy: 85,
	},
	toxicspikes: {
		inherit: true,
		desc: "Sets up a hazard on the foe's side of the field, poisoning each foe that switches in, unless it is a Flying-type Pokemon or has the Ability Levitate. Can be used up to two times before failing. Foes become poisoned with one layer and badly poisoned with two layers. Can be removed from the foe's side if any foe uses Rapid Spin, is hit by Defog, or a grounded Poison-type Pokemon switches in. Safeguard prevents the foe's party from being poisoned on switch-in, as well as switching in with a substitute.",
		flags: {},
		effect: {
			// this is a side condition
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers = 1;
			},
			onRestart: function (side) {
				if (this.effectData.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers++;
			},
			onSwitchIn: function (pokemon) {
				if (!pokemon.runImmunity('Ground')) return;
				if (!pokemon.runImmunity('Poison')) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
					pokemon.side.removeSideCondition('toxicspikes');
				}
				if (pokemon.volatiles['substitute']) {
					return;
				} else if (this.effectData.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
			},
		},
	},
	transform: {
		inherit: true,
		desc: "The user transforms into the target. The target's current stats, stat stages, types, moves, Ability, weight, IVs, species, and sprite are copied. The user's level and HP remain the same and each copied move receives only 5 PP. This move fails if the target has transformed.",
		flags: {authentic: 1},
	},
	uproar: {
		inherit: true,
		basePower: 50,
	},
	volttackle: {
		inherit: true,
		recoil: [1, 3],
	},
	whirlpool: {
		inherit: true,
		accuracy: 70,
		basePower: 15,
	},
	whirlwind: {
		inherit: true,
		flags: {protect: 1, mirror: 1, authentic: 1},
	},
	wish: {
		inherit: true,
		desc: "At the end of the next turn, the Pokemon at the user's position has 1/2 of its maximum HP restored to it, rounded down. Fails if this move is already in effect for the user's position.",
		shortDesc: "Next turn, heals 50% of the recipient's max HP.",
		flags: {heal: 1},
		sideCondition: 'Wish',
		effect: {
			duration: 2,
			onResidualOrder: 0,
			onEnd: function (side) {
				let target = side.active[this.effectData.sourcePosition];
				if (!target.fainted) {
					let source = this.effectData.source;
					let damage = this.heal(target.maxhp / 2, target, target);
					if (damage) this.add('-heal', target, target.getHealth, '[from] move: Wish', '[wisher] ' + source.name);
				}
			},
		},
	},
	woodhammer: {
		inherit: true,
		recoil: [1, 3],
	},
	worryseed: {
		inherit: true,
		onTryHit: function (pokemon) {
			let bannedAbilities = {multitype:1, truant:1};
			if (bannedAbilities[pokemon.ability]) {
				return false;
			}
		},
	},
	wrap: {
		inherit: true,
		accuracy: 85,
	},
	wringout: {
		inherit: true,
		basePowerCallback: function (pokemon, target) {
			return Math.floor(target.hp * 120 / target.maxhp) + 1;
		},
	},
};
