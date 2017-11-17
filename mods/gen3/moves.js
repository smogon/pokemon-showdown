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
		desc: "Deals typeless damage. Hits one time for each unfainted Pokemon without a major status condition in the user's party, or fails if no Pokemon meet the criteria. For each hit, the damage formula uses the participating Pokemon's base Attack as the Attack stat, the target's base Defense as the Defense stat, and ignores stat stages and other effects that modify Attack or Defense; each hit is considered to come from the user.",
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
			onMoveAborted: function (pokemon) {
				pokemon.removeVolatile('bide');
			},
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'move: Bide', '[silent]');
			},
		},
	},
	blizzard: {
		inherit: true,
		desc: "Has a 10% chance to freeze the target.",
		onModifyMove: function () { },
	},
	charge: {
		inherit: true,
		desc: "If the user uses an Electric-type attack on the next turn, its power will be doubled.",
		shortDesc: "The user's Electric attack next turn has 2x power.",
		boosts: false,
	},
	counter: {
		inherit: true,
		damageCallback: function (pokemon) {
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn && (this.getCategory(pokemon.lastAttackedBy.move) === 'Physical' || this.getMove(pokemon.lastAttackedBy.move).id === 'hiddenpower')) {
				return 2 * pokemon.lastAttackedBy.damage;
			}
			return false;
		},
		effect: {
			duration: 1,
			noCopy: true,
			onStart: function (target, source, source2, move) {
				this.effectData.position = null;
				this.effectData.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget: function (target, source, source2) {
				if (source !== this.effectData.target) return;
				return source.side.foe.active[this.effectData.position];
			},
			onDamagePriority: -101,
			onDamage: function (damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && source.side !== target.side && this.getCategory(effect.id) === 'Physical') {
					this.effectData.position = source.position;
					this.effectData.damage = 2 * damage;
				}
			},
		},
	},
	covet: {
		inherit: true,
		flags: {protect: 1, mirror: 1},
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
	dreameater: {
		inherit: true,
		desc: "The target is unaffected by this move unless it is asleep and does not have a substitute. The user recovers 1/2 the HP lost by the target, rounded down, but not less than 1 HP.",
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
	extrasensory: {
		inherit: true,
		basePowerCallback: function (pokemon, target) {
			if (target.volatiles['minimize']) return 160;
			return 80;
		},
		desc: "Has a 10% chance to flinch the target. Damage doubles if the target has used Minimize while active.",
	},
	fakeout: {
		inherit: true,
		flags: {protect: 1, mirror: 1},
	},
	feintattack: {
		inherit: true,
		flags: {protect: 1, mirror: 1},
	},
	flash: {
		inherit: true,
		accuracy: 70,
	},
	fly: {
		inherit: true,
		basePower: 70,
	},
	gigadrain: {
		inherit: true,
		pp: 5,
	},
	glare: {
		inherit: true,
		ignoreImmunity: false,
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
		shortDesc: "If miss, user takes 1/2 damage it would've dealt.",
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
	ingrain: {
		inherit: true,
		desc: "The user has 1/16 of its maximum HP restored at the end of each turn, but it is prevented from switching out and other Pokemon cannot force the user to switch out. The user can still switch out if it uses Baton Pass, and the replacement will remain trapped and still receive the healing effect.",
		shortDesc: "User recovers 1/16 max HP per turn. Traps user.",
	},
	jumpkick: {
		inherit: true,
		basePower: 70,
		desc: "If this attack is not successful and the target was not immune, the user loses HP equal to half of the damage the target would have taken, rounded down, but no less than 1 HP and no more than half of the target's maximum HP, as crash damage.",
		shortDesc: "If miss, user takes 1/2 damage it would've dealt.",
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
	mirrorcoat: {
		inherit: true,
		effect: {
			duration: 1,
			noCopy: true,
			onStart: function (target, source, source2, move) {
				this.effectData.position = null;
				this.effectData.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget: function (target, source, source2) {
				if (source !== this.effectData.target) return;
				return source.side.foe.active[this.effectData.position];
			},
			onDamagePriority: -101,
			onDamage: function (damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && source.side !== target.side && this.getCategory(effect.id) === 'Special') {
					this.effectData.position = source.position;
					this.effectData.damage = 2 * damage;
				}
			},
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
	outrage: {
		inherit: true,
		basePower: 90,
	},
	overheat: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1},
	},
	petaldance: {
		inherit: true,
		basePower: 70,
	},
	recover: {
		inherit: true,
		pp: 20,
	},
	rocksmash: {
		inherit: true,
		basePower: 20,
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
	spite: {
		inherit: true,
		desc: "Causes the target's last move used to lose 2 to 5 PP, at random. Fails if the target has not made a move, if the move has 0 PP, or if it no longer knows the move.",
		shortDesc: "Lowers the PP of the target's last move by 2-5.",
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
		desc: "Deals typeless damage to one adjacent foe at random. If this move was successful, the user takes damage equal to 1/4 the HP lost by the target, rounded down, but not less than 1 HP; the Ability Rock Head does not prevent this. This move can only be used if none of the user's known moves can be selected.",
		shortDesc: "User loses 1/4 the HP lost by the target.",
		recoil: [1, 4],
		struggleRecoil: false,
	},
	surf: {
		inherit: true,
		shortDesc: "Hits adjacent foes. Power doubles against Dive.",
		target: "allAdjacentFoes",
	},
	taunt: {
		inherit: true,
		desc: "For 2 turns, prevents the target from using non-damaging moves.",
		shortDesc: "For 2 turns, the target can't use status moves.",
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
	tickle: {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
	},
	vinewhip: {
		inherit: true,
		pp: 10,
	},
	volttackle: {
		inherit: true,
		desc: "If the target lost HP, the user takes recoil damage equal to 1/3 the HP lost by the target, rounded down, but not less than 1 HP.",
		shortDesc: "Has 1/3 recoil.",
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
	zapcannon: {
		inherit: true,
		basePower: 100,
	},
};
