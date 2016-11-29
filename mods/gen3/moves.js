/**
 * Gen 3 moves
 */

'use strict';

exports.BattleMovedex = {
	absorb: {
		inherit: true,
		pp: 20,
	},
	acid: {
		inherit: true,
		desc: "Has a 10% chance to lower the target's Defense by 1 stage.",
		shortDesc: "10% chance to lower the foe(s) Defense by 1.",
		secondary: {
			chance: 10,
			boosts: {
				def: -1,
			},
		},
	},
	ancientpower: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1},
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
	astonish: {
		inherit: true,
		basePowerCallback: function (pokemon, target) {
			if (target.volatiles['minimize']) return 60;
			return 30;
		},
		desc: "Has a 30% chance to flinch the target. Damage doubles if the target has used Minimize while active.",
	},
	beatup: {
		inherit: true,
		basePower: 10,
		basePowerCallback: function (pokemon, target) {
			pokemon.addVolatile('beatup');
			if (!pokemon.side.pokemon[pokemon.volatiles.beatup.index]) return null;
			return 10;
		},
		desc: "Deals typeless damage. Hits one time for each unfainted Pokemon without a major status condition in the user's party, or fails if no Pokemon meet the criteria. For each hit, the damage formula uses the participating Pokemon's base Attack as the Attack stat, the target's base Defense as the Defense stat, and ignores stat stages and other effects that modify Attack or Defense; each hit is considered to come from the user.",
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
		accuracy: 100,
		priority: 0,
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
						accuracy: 100,
						damage: this.effectData.totalDamage * 2,
						category: "Physical",
						priority: 0,
						flags: {contact: 1, protect: 1},
						effectType: 'Move',
						type: 'Normal',
					};
					this.tryMoveHit(target, pokemon, moveData);
					return false;
				}
				this.add('-activate', pokemon, 'move: Bide');
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
	blizzard: {
		inherit: true,
		desc: "Has a 10% chance to freeze the target.",
		onModifyMove: function () { },
	},
	bonerush: {
		inherit: true,
		accuracy: 80,
	},
	brickbreak: {
		inherit: true,
		onTryHit: function (pokemon) {
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
		},
	},
	bulletseed: {
		inherit: true,
		basePower: 10,
	},
	charge: {
		inherit: true,
		desc: "If the user uses an Electric-type attack on the next turn, its power will be doubled.",
		shortDesc: "The user's Electric attack next turn has 2x power.",
		boosts: false,
	},
	clamp: {
		inherit: true,
		accuracy: 75,
		pp: 10,
	},
	cottonspore: {
		inherit: true,
		accuracy: 85,
	},
	counter: {
		inherit: true,
		damageCallback: function (pokemon) {
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn && (this.getCategory(pokemon.lastAttackedBy.move) === 'Physical' || this.getMove(pokemon.lastAttackedBy.move).id === 'hiddenpower')) {
				return 2 * pokemon.lastAttackedBy.damage;
			}
			return false;
		},
	},
	covet: {
		inherit: true,
		basePower: 40,
		flags: {protect: 1, mirror: 1},
	},
	crabhammer: {
		inherit: true,
		accuracy: 85,
	},
	crunch: {
		inherit: true,
		desc: "Has a 20% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "20% chance to lower the target's Sp. Def by 1.",
		secondary: {
			chance: 20,
			boosts: {
				spd: -1,
			},
		},
	},
	curse: {
		inherit: true,
		type: "???",
	},
	detect: {
		inherit: true,
		priority: 3,
	},
	dig: {
		inherit: true,
		basePower: 60,
	},
	disable: {
		inherit: true,
		accuracy: 55,
		desc: "For 2 to 5 turns, the target's last move used becomes disabled. Fails if one of the target's moves is already disabled, if the target has not made a move, or if the target no longer knows the move.",
		shortDesc: "For 2-5 turns, disables the target's last move.",
		flags: {protect: 1, mirror: 1, authentic: 1},
		volatileStatus: 'disable',
		effect: {
			durationCallback: function () {
				return this.random(2, 6);
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
	dive: {
		inherit: true,
		basePower: 60,
	},
	doomdesire: {
		inherit: true,
		accuracy: 85,
		basePower: 120,
		onTry: function (source, target) {
			target.side.addSideCondition('futuremove');
			if (target.side.sideConditions['futuremove'].positions[target.position]) {
				return false;
			}
			let damage = this.getDamage(source, target, {
				name: "Doom Desire",
				basePower: 120,
				category: "Physical",
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
					category: "Physical",
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
	dreameater: {
		inherit: true,
		desc: "The target is unaffected by this move unless it is asleep and does not have a substitute. The user recovers 1/2 the HP lost by the target, rounded down, but not less than 1 HP.",
		onTryHit: function (target) {
			if (target.status !== 'slp' || target.volatiles['substitute']) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
	},
	encore: {
		inherit: true,
		desc: "For 3 to 6 turns, the target is forced to repeat its last move used. If the affected move runs out of PP, the effect ends. Fails if the target is already under this effect, if it has not made a move, if the move has 0 PP, or if the move is Encore, Mirror Move, or Struggle.",
		shortDesc: "The target repeats its last move for 3-6 turns.",
		flags: {protect: 1, mirror: 1, authentic: 1},
		volatileStatus: 'encore',
		effect: {
			durationCallback: function () {
				return this.random(3, 7);
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
	explosion: {
		inherit: true,
		basePower: 500,
	},
	extrasensory: {
		inherit: true,
		basePowerCallback: function (pokemon, target) {
			if (target.volatiles['minimize']) return 160;
			return 80;
		},
		desc: "Has a 10% chance to flinch the target. Damage doubles if the target has used Minimize while active.",
	},
	extremespeed: {
		inherit: true,
		priority: 1,
	},
	fakeout: {
		inherit: true,
		priority: 1,
		flags: {protect: 1, mirror: 1},
	},
	feintattack: {
		inherit: true,
		flags: {protect: 1, mirror: 1},
	},
	firespin: {
		inherit: true,
		accuracy: 70,
		basePower: 15,
	},
	flail: {
		inherit: true,
		basePowerCallback: function (pokemon, target) {
			let ratio = pokemon.hp * 48 / pokemon.maxhp;
			if (ratio < 2) {
				return 200;
			}
			if (ratio < 5) {
				return 150;
			}
			if (ratio < 10) {
				return 100;
			}
			if (ratio < 17) {
				return 80;
			}
			if (ratio < 33) {
				return 40;
			}
			return 20;
		},
	},
	flash: {
		inherit: true,
		accuracy: 70,
	},
	fly: {
		inherit: true,
		basePower: 70,
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
		pp: 5,
	},
	glare: {
		inherit: true,
		accuracy: 75,
		ignoreImmunity: false,
	},
	growth: {
		inherit: true,
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
	hiddenpower: {
		inherit: true,
		basePower: 0,
		basePowerCallback: function (pokemon) {
			return pokemon.hpPower || 70;
		},
		category: "Physical",
		onModifyMove: function (move, pokemon) {
			move.type = pokemon.hpType || 'Dark';
			let specialTypes = {Fire:1, Water:1, Grass:1, Ice:1, Electric:1, Dark:1, Psychic:1, Dragon:1};
			move.category = specialTypes[move.type] ? 'Special' : 'Physical';
		},
	},
	highjumpkick: {
		inherit: true,
		basePower: 85,
		desc: "If this attack is not successful and the target was not immune, the user loses HP equal to half of the damage the target would have taken, rounded down, but no less than 1 HP and no more than half of the target's maximum HP, as crash damage.",
		pp: 20,
		onMoveFail: function (target, source, move) {
			if (target.runImmunity('Fighting')) {
				let damage = this.getDamage(source, target, move, true);
				this.damage(this.clampIntRange(damage / 2, 1, Math.floor(target.maxhp / 2)), source, source, 'highjumpkick');
			}
		},
	},
	hypnosis: {
		inherit: true,
		accuracy: 60,
	},
	iciclespear: {
		inherit: true,
		basePower: 10,
	},
	jumpkick: {
		inherit: true,
		basePower: 70,
		desc: "If this attack is not successful and the target was not immune, the user loses HP equal to half of the damage the target would have taken, rounded down, but no less than 1 HP and no more than half of the target's maximum HP, as crash damage.",
		pp: 25,
		onMoveFail: function (target, source, move) {
			if (target.runImmunity('Fighting')) {
				let damage = this.getDamage(source, target, move, true);
				this.damage(this.clampIntRange(damage / 2, 1, Math.floor(target.maxhp / 2)), source, source, 'jumpkick');
			}
		},
	},
	leafblade: {
		inherit: true,
		basePower: 70,
	},
	megadrain: {
		inherit: true,
		pp: 10,
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
					assist:1, counter:1, covet:1, destinybond:1, detect:1, endure:1, focuspunch:1, followme:1, helpinghand:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, protect:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, thief:1, trick:1,
				};
				if (!noMetronome[move.id] && move.num < 355) {
					moves.push(move.id);
				}
			}
			let randomMove = '';
			if (moves.length) randomMove = moves[this.random(moves.length)];
			if (!randomMove) return false;
			this.useMove(randomMove, target);
		},
	},
	minimize: {
		inherit: true,
		boosts: {
			evasion: 1,
		},
	},
	mirrormove: {
		inherit: true,
		onTryHit: function () { },
		onHit: function (pokemon) {
			let noMirror = {assist:1, curse:1, doomdesire:1, focuspunch:1, futuresight:1, magiccoat:1, metronome:1, mimic:1, mirrormove:1, naturepower:1, psychup:1, roleplay:1, sketch:1, sleeptalk:1, spikes:1, spitup:1, taunt:1, teeterdance:1, transform:1};
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
			if (this.isWeather('sunnyday')) {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (this.isWeather(['raindance', 'sandstorm', 'hail'])) {
				this.heal(pokemon.maxhp / 4);
			} else {
				this.heal(pokemon.maxhp / 2);
			}
		},
	},
	morningsun: {
		inherit: true,
		onHit: function (pokemon) {
			if (this.isWeather('sunnyday')) {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (this.isWeather(['raindance', 'sandstorm', 'hail'])) {
				this.heal(pokemon.maxhp / 4);
			} else {
				this.heal(pokemon.maxhp / 2);
			}
		},
	},
	naturepower: {
		inherit: true,
		accuracy: true,
		desc: "This move calls another move for use depending on the battle terrain. Swift in Wi-Fi battles.",
		shortDesc: "Attack changes based on terrain. (Swift)",
		onHit: function (target) {
			this.useMove('swift', target);
		},
	},
	needlearm: {
		inherit: true,
		basePowerCallback: function (pokemon, target) {
			if (target.volatiles['minimize']) return 120;
			return 60;
		},
		desc: "Has a 30% chance to flinch the target. Damage doubles if the target has used Minimize while active.",
	},
	odorsleuth: {
		inherit: true,
		flags: {protect: 1, mirror: 1, authentic: 1},
	},
	outrage: {
		inherit: true,
		basePower: 90,
		pp: 15,
		onAfterMove: function () {},
	},
	overheat: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1},
	},
	petaldance: {
		inherit: true,
		basePower: 70,
		pp: 20,
		onAfterMove: function () {},
	},
	poisongas: {
		inherit: true,
		accuracy: 55,
		target: "normal",
	},
	protect: {
		inherit: true,
		priority: 3,
	},
	recover: {
		inherit: true,
		pp: 20,
	},
	reversal: {
		inherit: true,
		basePowerCallback: function (pokemon, target) {
			let ratio = pokemon.hp * 48 / pokemon.maxhp;
			if (ratio < 2) {
				return 200;
			}
			if (ratio < 5) {
				return 150;
			}
			if (ratio < 10) {
				return 100;
			}
			if (ratio < 17) {
				return 80;
			}
			if (ratio < 33) {
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
	rocksmash: {
		inherit: true,
		basePower: 20,
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
	skillswap: {
		inherit: true,
		onHit: function (target, source) {
			let targetAbility = this.getAbility(target.ability);
			let sourceAbility = this.getAbility(source.ability);
			if (targetAbility.id === sourceAbility.id) {
				return false;
			}
			this.add('-activate', source, 'move: Skill Swap');
			source.setAbility(targetAbility);
			target.setAbility(sourceAbility);
		},
	},
	sleeptalk: {
		inherit: true,
		desc: "One of the user's known moves, besides this move, is selected for use at random. Fails if the user is not asleep. The selected move does not have PP deducted from it, but if it currently has 0 PP it will fail to be used. This move cannot select Assist, Bide, Focus Punch, Metronome, Mirror Move, Sleep Talk, Uproar, or any two-turn move.",
		beforeMoveCallback: function (pokemon) {
			if (pokemon.volatiles['choicelock'] || pokemon.volatiles['encore']) {
				this.addMove('move', pokemon, 'Sleep Talk');
				this.add('-fail', pokemon);
				return true;
			}
		},
		onHit: function (pokemon) {
			let moves = [];
			for (let i = 0; i < pokemon.moveset.length; i++) {
				let move = pokemon.moveset[i].id;
				let pp = pokemon.moveset[i].pp;
				let NoSleepTalk = {
					assist:1, bide:1, focuspunch:1, metronome:1, mirrormove:1, sleeptalk:1, uproar:1,
				};
				if (move && !(NoSleepTalk[move] || this.getMove(move).flags['charge'])) {
					moves.push({move: move, pp: pp});
				}
			}
			let randomMove = '';
			if (moves.length) randomMove = moves[this.random(moves.length)];
			if (!randomMove) {
				return false;
			}
			if (!randomMove.pp) {
				this.add('cant', pokemon, 'nopp', randomMove.move);
				return;
			}
			this.useMove(randomMove.move, pokemon);
		},
	},
	spikes: {
		inherit: true,
		flags: {},
	},
	spite: {
		inherit: true,
		desc: "Causes the target's last move used to lose 2 to 5 PP, at random. Fails if the target has not made a move, if the move has 0 PP, or if it no longer knows the move.",
		shortDesc: "Lowers the PP of the target's last move by 2-5.",
		flags: {protect: 1, mirror: 1, authentic: 1},
		onHit: function (target) {
			let roll = this.random(2, 6);
			if (target.deductPP(target.lastMove, roll)) {
				this.add("-activate", target, 'move: Spite', target.lastMove, roll);
				return;
			}
			return false;
		},
	},
	stockpile: {
		inherit: true,
		desc: "The user's Stockpile count increases by 1. Fails if the user's Stockpile count is 3.",
		shortDesc: "Raises user's Stockpile count by 1. Max 3 uses.",
		pp: 10,
		effect: {
			noCopy: true,
			onStart: function (target) {
				this.effectData.layers = 1;
				this.add('-start', target, 'stockpile' + this.effectData.layers);
			},
			onRestart: function (target) {
				if (this.effectData.layers >= 3) return false;
				this.effectData.layers++;
				this.add('-start', target, 'stockpile' + this.effectData.layers);
			},
			onEnd: function (target) {
				this.effectData.layers = 0;
				this.add('-end', target, 'Stockpile');
			},
		},
	},
	struggle: {
		inherit: true,
		accuracy: 100,
		desc: "Deals typeless damage to one adjacent foe at random. If this move was successful, the user takes damage equal to 1/2 the HP lost by the target, rounded down, but not less than 1 HP; the Ability Rock Head does not prevent this. This move can only be used if none of the user's known moves can be selected.",
		shortDesc: "User loses 1/2 the HP lost by the target.",
		recoil: [1, 2],
		onModifyMove: function (move) {
			move.type = '???';
		},
		struggleRecoil: false,
	},
	surf: {
		inherit: true,
		shortDesc: "Hits adjacent foes. Power doubles against Dive.",
		target: "allAdjacentFoes",
	},
	synthesis: {
		inherit: true,
		onHit: function (pokemon) {
			if (this.isWeather('sunnyday')) {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (this.isWeather(['raindance', 'sandstorm', 'hail'])) {
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
		boosts: {
			spa: 2,
		},
	},
	taunt: {
		inherit: true,
		desc: "For 2 turns, prevents the target from using non-damaging moves.",
		shortDesc: "For 2 turns, the target can't use status moves.",
		flags: {protect: 1, mirror: 1, authentic: 1},
		effect: {
			duration: 2,
			onStart: function (target) {
				this.add('-start', target, 'move: Taunt');
			},
			onResidualOrder: 12,
			onEnd: function (target) {
				this.add('-end', target, 'move: Taunt', '[silent]');
			},
			onDisableMove: function (pokemon) {
				let moves = pokemon.moveset;
				for (let i = 0; i < moves.length; i++) {
					if (this.getMove(moves[i].move).category === 'Status') {
						pokemon.disableMove(moves[i].id);
					}
				}
			},
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
	tickle: {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
	},
	torment: {
		inherit: true,
		flags: {protect: 1, mirror: 1, authentic: 1},
	},
	toxic: {
		inherit: true,
		accuracy: 85,
	},
	uproar: {
		inherit: true,
		basePower: 50,
	},
	vinewhip: {
		inherit: true,
		pp: 10,
	},
	volttackle: {
		inherit: true,
		desc: "If the target lost HP, the user takes recoil damage equal to 1/3 the HP lost by the target, rounded down, but not less than 1 HP.",
		shortDesc: "Has 1/3 recoil.",
		recoil: [1, 3],
		secondary: false,
	},
	waterfall: {
		inherit: true,
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		secondary: false,
	},
	weatherball: {
		inherit: true,
		onModifyMove: function (move) {
			switch (this.effectiveWeather()) {
			case 'sunnyday':
				move.type = 'Fire';
				move.category = 'Special';
				break;
			case 'raindance':
				move.type = 'Water';
				move.category = 'Special';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
				move.type = 'Ice';
				move.category = 'Special';
				break;
			}
		},
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
	wrap: {
		inherit: true,
		accuracy: 85,
	},
	zapcannon: {
		inherit: true,
		basePower: 100,
	},
	magikarpsrevenge: null,
};
