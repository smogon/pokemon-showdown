function clampIntRange(num, min, max) {
	num = Math.floor(num);
	if (num < min) num = min;
	if (typeof max !== 'undefined' && num > max) num = max;
	return num;
}
/*
Hidden Power's status as a physical/special move plagued me.  I tested it and it never seemed to work no matter what I did.
Marty told me the way I did it was correct - testing it on kupo's server failed, however.
It is possible kupo just forgot to update it.
-Relados
*/
exports.BattleMovedex = {
	absorb: {
		inherit: true,
		pp: 20
	},
	acid: {
		inherit: true,
		secondary: {
			chance: 10,
			boosts: {
				def: -1
			}
		}
	},
	ancientpower: {
		inherit: true,
		isContact: true
	},
	assist: {
		inherit: true,
		desc: "The user performs a random move from any of the Pokemon on its team. Assist cannot generate itself, Chatter, Copycat, Counter, Covet, Destiny Bond, Detect, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Protect, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief or Trick.",
		onHit: function(target) {
			var moves = [];
			for (var j=0; j<target.side.pokemon.length; j++) {
				var pokemon = target.side.pokemon[j];
				if (pokemon === target) continue;
				for (var i=0; i<pokemon.moves.length; i++) {
					var move = pokemon.moves[i];
					var noAssist = {
						assist:1, chatter:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, endure:1, feint:1, focuspunch:1, followme:1, helpinghand:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, protect:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, switcheroo:1, thief:1, trick:1
					};
					if (move && !noAssist[move]) {
						moves.push(move);
					}
				}
			}
			var move = '';
			if (moves.length) move = moves[this.random(moves.length)];
			if (!move) {
				return false;
			}
			this.useMove(move, target);
		}
	},
	astonish: {
		inherit: true,
		basePowerCallback: function(pokemon, target) {
			if (target.volatiles['minimize']) return 60;
			return 30;
		}
	},
	beatup: {
		inherit: true,
		basePower: 10,
		basePowerCallback: undefined,
		desc: "Does one hit for the user and each other unfainted non-egg active and non-active Pokemon on the user's side without a status problem."
	},
	bide: {
		inherit: true,
		desc: "The user spends two to three turns locked into this move and then, on the second turn after using this move, the user attacks the last Pokemon that hit it, inflicting double the damage in HP it lost during the two turns. If the last Pokemon that hit it is no longer on the field, the user attacks a random foe instead. If the user is prevented from moving during this move's use, the effect ends. This move ignores Accuracy and Evasion modifiers and can hit Ghost-types. Makes contact. Priority +1.",
		shortDesc: "Waits 2-3 turns; deals double the damage taken.",
		priority: 0,
		effect: {
			duration: 2,	// TODO: Use correct duration.
			onLockMove: 'bide',
			onStart: function(pokemon) {
				this.effectData.totalDamage = 0;
				this.add('-start', pokemon, 'Bide');
			},
			onDamage: function(damage, target, source, move) {
				if (!move || move.effectType !== 'Move') return;
				if (!source || source.side === target.side) return;
				this.effectData.totalDamage += damage;
				this.effectData.sourcePosition = source.position;
				this.effectData.sourceSide = source.side;
			},
			onAfterSetStatus: function(status, pokemon) {
				if (status.id === 'slp') {
					pokemon.removeVolatile('bide');
				}
			},
			onBeforeMove: function(pokemon) {
				if (this.effectData.duration === 1) {
					if (!this.effectData.totalDamage) {
						this.add('-fail', pokemon);
						return false;
					}
					this.add('-end', pokemon, 'Bide');
					var target = this.effectData.sourceSide.active[this.effectData.sourcePosition];
					this.moveHit(target, pokemon, 'bide', {damage: this.effectData.totalDamage*2});
					return false;
				}
				this.add('-message', pokemon.name+' is storing energy! (placeholder)');
				return false;
			}
		},
		type: "???"
	},
	bind: {
		inherit: true,
		accuracy: 75
	},
	blizzard: {
		inherit: true,
		onModifyMove: null
	},
	bonerush: {
		inherit: true,
		accuracy: 80
	},
	brickbreak: {
		inherit: true,
		desc: "Reflect and Light Screen are removed from the target's field even if the attack misses or the target is a Ghost-type.",
		//shortDesc: "",
		onTryHit: function(pokemon) {
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
		}
	},
	bulletseed: {
		inherit: true,
		basePower: 10
	},
	charge: {
		inherit: true,
		boosts: false
	},
	clamp: {
		inherit: true,
		accuracy: 75,
		pp: 10
	},
	cottonspore: {
		inherit: true,
		accuracy: 85
	},
	counter: {
		inherit: true,
		damageCallback: function(pokemon) {
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn && (this.getCategory(pokemon.lastAttackedBy.move) === 'Physical' || this.getMove(pokemon.lastAttackedBy.move).id === 'hiddenpower')) {
				return 2 * pokemon.lastAttackedBy.damage;
			}
			this.add('-fail',pokemon.id);
			return false;
		}
	},
	covet: {
		inherit: true,
		basePower: 40,
		isContact: false
	},
	crabhammer: {
		inherit: true,
		accuracy: 85
	},
	crunch: {
		inherit: true,
		secondary: {
			chance: 20,
			boosts: {
				spd: -1
			}
		}
	},
	curse: {
		inherit: true,
		type: "???"
	},
	detect: {
		inherit: true,
		//desc: "",
		priority: 3
	},
	dig: {
		inherit: true,
		basePower: 60
	},
	disable: {
		inherit: true,
		accuracy: 55,
		desc: "The target cannot choose its last move for 4-7 turns. Disable only works on one move at a time and fails if the target has not yet used a move or if its move has run out of PP. The target does nothing if it is about to use a move that becomes disabled.",
		//shortDesc: "",
		isBounceable: false,
		volatileStatus: 'disable',
		effect: {
			durationCallback: function() {
				return this.random(2,6);
			},
			noCopy: true,
			onStart: function(pokemon) {
				if (!this.willMove(pokemon)) {
					this.effectData.duration++;
				}
				if (!pokemon.lastMove) {
					return false;
				}
				var moves = pokemon.moveset;
				for (var i=0; i<moves.length; i++) {
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
			onEnd: function(pokemon) {
				this.add('-message', pokemon.name+' is no longer disabled! (placeholder)');
			},
			onBeforeMove: function(attacker, defender, move) {
				if (move.id === this.effectData.move) {
					this.add('cant', attacker, 'Disable', move);
					return false;
				}
			},
			onModifyPokemon: function(pokemon) {
				var moves = pokemon.moveset;
				for (var i=0; i<moves.length; i++) {
					if (moves[i].id === this.effectData.move) {
						moves[i].disabled = true;
					}
				}
			}
		}
	},
	dive: {
		inherit: true,
		basePower: 60
	},
	doomdesire: {
		inherit: true,
		accuracy: 85,
		basePower: 120,
		onModifyMove: function(move) {
			move.type = '???';
		}
	},
	dreameater: {
		inherit: true,
		desc: "Deals damage to one adjacent target, if it is asleep and does not have a Substitute. The user recovers half of the HP lost by the target, rounded up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		onTryHit: function(target) {
			if (target.status !== 'slp' || target.volatiles['substitute']) {
				this.add('-immune', target.id, '[msg]');
				return null;
			}
		}
	},
	encore: {
		inherit: true,
		//desc: "",
		//shortDesc: "",
		isBounceable: false,
		volatileStatus: 'encore',
		effect: {
			durationCallback: function() {
				return this.random(3,7);
			},
			onStart: function(target) {
				var noEncore = {encore:1, mimic:1, mirrormove:1, sketch:1, transform:1};
				var moveIndex = target.moves.indexOf(target.lastMove);
				if (!target.lastMove || noEncore[target.lastMove] || (target.moveset[moveIndex] && target.moveset[moveIndex].pp <= 0)) {
					// it failed
					this.add('-fail',target);
					delete target.volatiles['encore'];
					return;
				}
				this.effectData.move = target.lastMove;
				this.add('-start', target, 'Encore');
				if (!this.willMove(target)) {
					this.effectData.duration++;
				}
			},
			onOverrideDecision: function(pokemon) {
				return this.effectData.move;
			},
			onResidualOrder: 13,
			onResidual: function(target) {
				if (target.moves.indexOf(target.lastMove) >= 0 && target.moveset[target.moves.indexOf(target.lastMove)].pp <= 0) {
					// early termination if you run out of PP
					delete target.volatiles.encore;
					this.add('-end', target, 'Encore');
				}
			},
			onEnd: function(target) {
				this.add('-end', target, 'Encore');
			},
			onModifyPokemon: function(pokemon) {
				if (!this.effectData.move || !pokemon.hasMove(this.effectData.move)) {
					return;
				}
				for (var i=0; i<pokemon.moveset.length; i++) {
					if (pokemon.moveset[i].id !== this.effectData.move) {
						pokemon.moveset[i].disabled = true;
					}
				}
			}
		}
	},
	explosion: {
		inherit: true,
		basePower: 500,
		//desc: ""
	},
	extrasensory: {
		inherit: true,
		basePowerCallback: function(pokemon, target) {
			if (target.volatiles['minimize']) return 160;
			return 80;
		}
	},
	extremespeed: {
		inherit: true,
		shortDesc: "Usually goes first.",
		priority: 1
	},
	faintattack: {
		inherit: true,
		isContact: false
	},
	fakeout: {
		inherit: true,
		shortDesc: "Usually hits first; first turn out only; target flinch.",
		priority: 1,
		isContact: false
	},
	firespin: {
		inherit: true,
		accuracy: 70,
		basePower: 15
	},
	flail: {
		num: 175,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon, target) {
			var hpPercent = pokemon.hp * 100 / pokemon.maxhp;
			if (hpPercent <= 5) {
				return 200;
			}
			if (hpPercent <= 10) {
				return 150;
			}
			if (hpPercent <= 20) {
				return 100;
			}
			if (hpPercent <= 35) {
				return 80;
			}
			if (hpPercent <= 70) {
				return 40;
			}
			return 20;
		},
		desc: "Deals damage to one adjacent target based on the amount of HP the user has left. X is equal to (user's current HP * 48 / user's maximum HP), rounded down; the base power of this attack is 20 if X is 33 to 48, 40 if X is 17 to 32, 80 if X is 10 to 16, 100 if X is 5 to 9, 150 if X is 2 to 4, and 200 if X is 0 or 1. Makes contact.",
		shortDesc: "More power the less HP the user has left.",
		id: "flail",
		isViable: true,
		name: "Flail",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	flash: {
		inherit: true,
		accuracy: 70
	},
	fly: {
		inherit: true,
		basePower: 70
	},
	foresight: {
		inherit: true,
		isBounceable: false
	},
	furycutter: {
		inherit: true,
		basePower: 10
	},
	futuresight: {
		inherit: true,
		accuracy: 90,
		basePower: 80,
		pp: 15,
		onModifyMove: function(move) {
			move.type = '???';
		}
	},
	gigadrain: {
		inherit: true,
		basePower: 60,
		pp: 5
	},
	glare: {
		inherit: true,
		accuracy: 75,
		affectedByImmunities: true
	},
	growth: {
		inherit: true,
		desc: "Raises the user's Special Attack by 1 stage.",
		shortDesc: "Boosts the user's Sp. Atk by 1.",
		onModifyMove: null,
		boosts: {
			spa: 1
		}
	},
	hiddenpower: {
		num: 237,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon) {
			return pokemon.hpPower || 70;
		},
		desc: "Deals damage to one adjacent target. This move's type and power depend on the user's individual values (IVs). Power varies between 30 and 70, and type can be any but Normal.",
		shortDesc: "Varies in power and type based on the user's IVs.",
		id: "hiddenpower",
		isViable: true,
		name: "Hidden Power",
		pp: 15,
		priority: 0,
		onModifyMove: function(move, pokemon) {
			move.type = pokemon.hpType || 'Dark';
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	hijumpkick: {
		inherit: true,
		basePower: 85,
		desc: "If this attack misses the target, the user takes half of the damage it would have dealt in recoil damage.",
		shortDesc: "User takes half damage it would have dealt if miss.",
		pp: 20,
		onMoveFail: function(target, source, move) {
			if (target.type !== 'ghost') {
				var damage = this.getDamage(source, target, move, true);
				this.damage(clampIntRange(damage/8, 1, Math.floor(target.maxhp/2)), source);
			}
		}
	},
	hypnosis: {
		inherit: true,
		accuracy: 60
	},
	iciclespear: {
		inherit: true,
		basePower: 10
	},
	jumpkick: {
		inherit: true,
		basePower: 70,
		desc: "If this attack misses the target, the user takes half of the damage it would have dealt in recoil damage.",
		shortDesc: "User takes half damage it would have dealt if miss.",
		pp: 25,
		onMoveFail: function(target, source, move) {
			var damage = this.getDamage(source, target, move, true);
			this.damage(clampIntRange(damage/2, 1, Math.floor(target.maxhp/2)), source);
		}
	},
	leafblade: {
		inherit: true,
		basePower: 70
	},
	megadrain: {
		inherit: true,
		pp: 10
	},
	minimize: {
		inherit: true,
		desc: "Raises the user's evasion by 1 stage. After using this move, Astonish, Extrasensory, Needle Arm, and Stomp will have their power doubled if used against the user while it is active.",
		shortDesc: "Boosts the user's evasion by 1.",
		boosts: {
			evasion: 1
		}
	},
	mirrormove: {
		num: 119,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user uses the last move used by a selected adjacent target. The copied move is used against that target, if possible. Fails if the target has not yet used a move, or the last move used was Acupressure, After You, Aromatherapy, Chatter, Conversion 2, Counter, Curse, Doom Desire, Feint, Final Gambit, Focus Punch, Future Sight, Gravity, Guard Split, Hail, Haze, Heal Bell, Heal Pulse, Helping Hand, Light Screen, Lucky Chant, Me First, Mimic, Mirror Coat, Mist, Mud Sport, Nature Power, Perish Song, Power Split, Psych Up, Quick Guard, Rain Dance, Reflect, Reflect Type, Role Play, Safeguard, Sandstorm, Sketch, Spikes, Spit Up, Stealth Rock, Struggle, Sunny Day, Tailwind, Toxic Spikes, Transform, Water Sport, Wide Guard, or any move that is self-targeting.",
		shortDesc: "User uses the target's last used move against it.",
		id: "mirrormove",
		name: "Mirror Move",
		pp: 20,
		priority: 0,
		isNotProtectable: true,
		onTryHit: function(target) {
			var noMirrorMove = {acupressure:1, afteryou:1, aromatherapy:1, chatter:1, conversion2:1, curse:1, doomdesire:1, feint:1, finalgambit:1, focuspunch:1, futuresight:1, gravity:1, guardsplit:1, hail:1, haze:1, healbell:1, healpulse:1, helpinghand:1, lightscreen:1, luckychant:1, mefirst:1, mimic:1, mirrorcoat:1, mirrormove:1, mist:1, mudsport:1, naturepower:1, perishsong:1, powersplit:1, psychup:1, quickguard:1, raindance:1, reflect:1, reflecttype:1, roleplay:1, safeguard:1, sandstorm:1, sketch:1, spikes:1, spitup:1, stealthrock:1, sunnyday:1, tailwind:1, taunt:1, teeterdance:1, toxicspikes:1, transform:1, watersport:1, wideguard:1};
			if (!target.lastMove || noMirrorMove[target.lastMove] || this.getMove(target.lastMove).target === 'self') {
				return false;
			}
		},
		onHit: function(target, source) {
			this.useMove(this.lastMove, source);
		},
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	naturepower: {
		inherit: true,
		accuracy: 95,
		onModifyMove: function(move) {
			move.accuracy = true;
		},
		onHit: function(target) {
			this.useMove('swift', target);
		}
	},
	needlearm: {
		inherit: true,
		basePowerCallback: function(pokemon, target) {
			if (target.volatiles['minimize']) return 120;
			return 60;
		}
	},
	odorsleuth: {
		inherit: true,
		isBounceable: false
	},
	outrage: {
		inherit: true,
		basePower: 90,
		pp: 15
	},
	overheat: {
		inherit: true,
		isContact: true
	},
	payback: {
		inherit: true,
		basePowerCallback: function(pokemon, target) {
			if (this.willMove(target)) {
				return 50;
			}
			return 100;
		}
	},
	petaldance: {
		inherit: true,
		basePower: 70,
		pp: 20
	},
	poisongas: {
		inherit: true,
		accuracy: 55,
		target: "normal"
	},
	protect: {
		inherit: true,
		//desc: "",
		priority: 3
	},
	recover: {
		inherit: true,
		pp: 20
	},
	roar: {
		inherit: true,
		isBounceable: false
	},
	rockblast: {
		inherit: true,
		accuracy: 80
	},
	rocksmash: {
		inherit: true,
		basePower: 20
	},
	sandtomb: {
		inherit: true,
		accuracy: 70,
		basePower: 15
	},
	scaryface: {
		inherit: true,
		accuracy: 90
	},
	selfdestruct: {
		inherit: true,
		basePower: 400,
		//desc: ""
	},
	spikes: {
		inherit: true,
		isBounceable: false
	},
	spite: {
		inherit: true,
		isBounceable: false,
		onHit: function(target) {
			var roll = this.random(2,6);
			if (target.deductPP(target.lastMove, roll)) {
				this.add("-activate", target, 'move: Spite', target.lastMove, roll);
				return;
			}
			return false;
		},
	},
	stockpile: {
		inherit: true,
		pp: 10,
		boosts: false
	},
	struggle: {
		num: 165,
		accuracy: true,
		basePower: 50,
		desc: "Deals typeless damage to one adjacent foe at random. If this move was successful, the user loses 1/2 of the damage dealt, rounded half up; the Ability Rock Head does not prevent this. This move can only be used if none of the user's known moves can be selected. Makes contact.",
		shortDesc: "User loses half of the damage dealt as recoil.",
		id: "struggle",
		name: "Struggle",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		isContact: true,
		beforeMoveCallback: function(pokemon) {
			this.add('-message', pokemon.name+' has no moves left! (placeholder)');
		},
		onModifyMove: function(move) {
			move.type = '???';
		},
		recoil: [1,2],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	tackle: {
		inherit: true,
		accuracy: 95,
		basePower: 35
	},
	tailglow: {
		inherit: true,
		desc: "Raises the user's Special Attack by 2 stages.",
		shortDesc: "Boosts the user's Sp. Atk by 2.",
		boosts: {
			spa: 2
		}
	},
	taunt: {
		inherit: true,
		isBounceable: false,
		effect: {
			duration: 2,
			onStart: function(target) {
				this.add('-start', target, 'move: Taunt');
			},
			onResidualOrder: 12,
			onEnd: function(target) {
				this.add('-end', target, 'move: Taunt');
			},
			onModifyPokemon: function(pokemon) {
				var moves = pokemon.moveset;
				for (var i=0; i<moves.length; i++) {
					if (this.getMove(moves[i].move).category === 'Status') {
						moves[i].disabled = true;
					}
				}
			},
			onBeforeMove: function(attacker, defender, move) {
				if (move.category === 'Status') {
					this.add('cant', attacker, 'move: Taunt', move);
					return false;
				}
			}
		}
	},
	thrash: {
		inherit: true,
		basePower: 90,
		pp: 20
	},
	tickle: {
		inherit: true,
		notSubBlocked: true
	},
	torment: {
		inherit: true,
		isBounceable: false
	},
	toxic: {
		inherit: true,
		accuracy: 85
	},
	uproar: {
		inherit: true,
		basePower: 50
	},
	vinewhip: {
		inherit: true,
		pp: 10
	},
	volttackle: {
		inherit: true,
		desc: "Deals damage to one adjacent target. If the target lost HP, the user takes recoil damage equal to 33% that HP, rounded half up, but not less than 1HP. Makes contact.",
		shortDesc: "Has 1/3 recoil.",
		recoil: [1,3],
		secondary: false
	},
	waterfall: {
		inherit: true,
		secondary: false
	},
	whirlpool: {
		inherit: true,
		accuracy: 70,
		basePower: 15
	},
	whirlwind: {
		inherit: true,
		isBounceable: false
	},
	wish: {
		inherit: true,
		//desc: "",
		shortDesc: "Next turn, heals 50% of the recipient's max HP.",
		effect: {
			duration: 2,
			onResidualOrder: 2,
			onEnd: function(side) {
				var target = side.active[this.effectData.sourcePosition];
				if (!target.fainted) {
					var source = this.effectData.source;
					var damage = this.heal(target.maxhp/2, target, target);
					if (damage) this.add('-heal', target, target.getHealth, '[from] move: Wish', '[wisher] '+source.name);
				}
			}
		}
	},
	wrap: {
		inherit: true,
		accuracy: 85
	},
	zapcannon: {
		inherit: true,
		basePower: 100
	},
	magikarpsrevenge: null
};
