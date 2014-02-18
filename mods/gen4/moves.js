function clampIntRange(num, min, max) {
	num = Math.floor(num);
	if (num < min) num = min;
	if (typeof max !== 'undefined' && num > max) num = max;
	return num;
}
exports.BattleMovedex = {
	acupressure: {
		inherit: true,
		desc: "Raises a random stat by 2 stages as long as the stat is not already at stage 6. The user can choose to use this move on itself or an ally. Fails if no stat stage can be raised or if the user or ally has a Substitute. This move ignores Protect and Detect.",
		isSnatchable: true,
		onHit: function(target) {
			if (target.volatiles['substitute']) {
				return false;
			}
			var stats = [];
			for (var i in target.boosts) {
				if (target.boosts[i] < 6) {
					stats.push(i);
				}
			}
			if (stats.length) {
				var i = stats[this.random(stats.length)];
				var boost = {};
				boost[i] = 2;
				this.boost(boost);
			} else {
				return false;
			}
		}
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
	aquaring: {
		inherit: true,
		isSnatchable: false
	},
	beatup: {
		inherit: true,
		basePower: 10,
		basePowerCallback: undefined,
		desc: "Does one hit for the user and each other unfainted non-egg active and non-active Pokemon on the user's side without a status problem."
	},
	bide: {
		inherit: true,
		effect: {
			duration: 3,
			onLockMove: 'bide',
			onStart: function(pokemon) {
				this.effectData.totalDamage = 0;
				this.add('-start', pokemon, 'Bide');
			},
			onDamagePriority: -101,
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
						this.add('-end', pokemon, 'Bide');
						this.add('-fail', pokemon);
						return false;
					}
					this.add('-end', pokemon, 'Bide');
					var target = this.effectData.sourceSide.active[this.effectData.sourcePosition];
					this.moveHit(target, pokemon, 'bide', {damage: this.effectData.totalDamage*2});
					return false;
				}
				this.add('-activate', pokemon, 'Bide');
				return false;
			}
		}
	},
	bind: {
		inherit: true,
		accuracy: 75
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
	chatter: {
		inherit: true,
		desc: "Deals damage to one adjacent target. This move has an X% chance to confuse the target, where X is 0 unless the user is a Chatot that hasn't Transformed. If the user is a Chatot, X is 1, 11, or 31 depending on the volume of Chatot's recorded cry, if any; 1 for no recording or low volume, 11 for medium volume, and 31 for high volume. Pokemon with the Ability Soundproof are immune. (Field: Can be used to record a sound to replace Chatot's cry. The cry is reset if Chatot is deposited in a PC.)",
		shortDesc: "31% chance to confuse the target.",
		secondary: {
			chance: 31,
			volatileStatus: 'confusion'
		}
	},
	clamp: {
		inherit: true,
		accuracy: 75,
		pp: 10
	},
	conversion: {
		inherit: true,
		isSnatchable: false
	},
	copycat: {
		inherit: true,
		//desc: "",
		onHit: function(pokemon) {
			var noCopycat = {assist:1, chatter:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, endure:1, feint:1, focuspunch:1, followme:1, helpinghand:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, protect:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, switcheroo:1, thief:1, trick:1};
			if (!this.lastMove || noCopycat[this.lastMove]) {
				return false;
			}
			this.useMove(this.lastMove, pokemon);
		}
	},
	cottonspore: {
		inherit: true,
		accuracy: 85
	},
	covet: {
		inherit: true,
		basePower: 40
	},
	crabhammer: {
		inherit: true,
		accuracy: 85
	},
	crushgrip: {
		inherit: true,
		basePowerCallback: function(pokemon) {
			return Math.floor(pokemon.hp*120/pokemon.maxhp) + 1;
		}
	},
	curse: {
		inherit: true,
		desc: "If the user is not a Ghost-type, lowers the user's Speed by 1 stage and raises the user's Attack and Defense by 1 stage. If the user is a Ghost-type, the user loses 1/2 of its maximum HP, rounded down and even if it would cause fainting, in exchange for one adjacent target losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if there is no target or if the target is already affected or has a Substitute.",
		effect: {
			onStart: function(pokemon, source) {
				if (pokemon.volatiles['substitute']) {
					this.add('-fail', pokemon);
					return false;
				}
				this.add('-start', pokemon, 'Curse', '[of] '+source);
				this.directDamage(source.maxhp/2, source, source);
			},
			onResidualOrder: 10,
			onResidual: function(pokemon) {
				this.damage(pokemon.maxhp/4);
			}
		},
		type: "???"
	},
	defog: {
		inherit: true,
		isBounceable: false
	},
	detect: {
		inherit: true,
		//desc: "",
		priority: 3
	},
	disable: {
		inherit: true,
		accuracy: 80,
		desc: "The target cannot choose its last move for 4-7 turns. Disable only works on one move at a time and fails if the target has not yet used a move or if its move has run out of PP. The target does nothing if it is about to use a move that becomes disabled.",
		//shortDesc: "",
		isBounceable: false,
		volatileStatus: 'disable',
		effect: {
			durationCallback: function() {
				return this.random(4,8);
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
	doomdesire: {
		inherit: true,
		accuracy: 85,
		basePower: 120,
		onModifyMove: function(move) {
			move.type = '???';
		}
	},
	drainpunch: {
		inherit: true,
		basePower: 60,
		pp: 5
	},
	dreameater: {
		inherit: true,
		desc: "Deals damage to one adjacent target, if it is asleep and does not have a Substitute. The user recovers half of the HP lost by the target, rounded up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		onTryHit: function(target) {
			if (target.status !== 'slp' || target.volatiles['substitute']) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		}
	},
	embargo: {
		inherit: true,
		//desc: "",
		isBounceable: false,
		onTryHit: function(pokemon) {
			if (pokemon.ability === 'multitype' || pokemon.item === 'griseousorb') {
				return false;
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
				return this.random(4,9);
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
	endeavor: {
		inherit: true,
		damageCallback: function(pokemon,target) {
			if (target.hp > pokemon.hp) {
				return target.hp - pokemon.hp;
			}
			this.add('-fail', pokemon);
			return false;
		}
	},
	explosion: {
		inherit: true,
		basePower: 500,
		//desc: ""
	},
	extremespeed: {
		inherit: true,
		shortDesc: "Usually goes first.",
		priority: 1
	},
	fakeout: {
		inherit: true,
		shortDesc: "Usually hits first; first turn out only; target flinch.",
		priority: 1
	},
	feint: {
		inherit: true,
		basePower: 50,
		onTryHit: function(target) {
			if (!target.volatiles['protect']) {
				return false;
			}
		}
	},
	firespin: {
		inherit: true,
		accuracy: 70,
		basePower: 15
	},
	flail: {
		inherit: true,
		basePowerCallback: function(pokemon, target) {
			var ratio = pokemon.hp * 64 / pokemon.maxhp;
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
		}
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
		basePower: 60
	},
	glare: {
		inherit: true,
		accuracy: 75
	},
	growth: {
		inherit: true,
		desc: "Raises the user's Special Attack by 1 stage.",
		shortDesc: "Boosts the user's Sp. Atk by 1.",
		onModifyMove: function() { },
		boosts: {
			spa: 1
		}
	},
	healblock: {
		inherit: true,
		isBounceable: false
	},
	healingwish: {
		inherit: true,
		isSnatchable: false,
		effect: {
			duration: 2,
			onStart: function(side) {
				this.debug('Healing Wish started on '+side.name);
			},
			onSwitchInPriority: -6,
			// Accounting for the offchance that 5 remaining pokemon are KO'd by entry hazards
			onSwitchIn: function(target) {
				if (target.position != this.effectData.sourcePosition) {
					return;
				}
				if (!target.hp <= 0) {
					var source = this.effectData.source;
					var damage = target.heal(target.maxhp);
					target.setStatus('');
					this.add('-heal',target,target.getHealth,'[from] move: Healing Wish');
					target.side.removeSideCondition('healingwish');
				}
			}
		}
	},
	hiddenpower: {
		inherit: true,
		basePower: 0,
		basePowerCallback: function(pokemon) {
			return pokemon.hpPower || 70;
		},
		desc: "Deals damage to one adjacent target. This move's type and power depend on the user's individual values (IVs). Power varies between 30 and 70, and type can be any but Normal.",
		shortDesc: "Varies in power and type based on the user's IVs."
	},
	hiddenpowerbug: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerdark: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerdragon: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerelectric: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerfighting: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerfire: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerflying: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerghost: {
		inherit: true,
		basePower: 70
	},
	hiddenpowergrass: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerground: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerice: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerpoison: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerpsychic: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerrock: {
		inherit: true,
		basePower: 70
	},
	hiddenpowersteel: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerwater: {
		inherit: true,
		basePower: 70
	},
	highjumpkick: {
		inherit: true,
		basePower: 100,
		desc: "If this attack misses the target, the user takes half of the damage it would have dealt in recoil damage.",
		shortDesc: "User takes half damage it would have dealt if miss.",
		pp: 20,
		onMoveFail: function(target, source, move) {
			var damage = this.getDamage(source, target, move, true);
			this.damage(clampIntRange(damage/2, 1, Math.floor(target.maxhp/2)), source);
		}
	},
	iciclespear: {
		inherit: true,
		basePower: 10
	},
	imprison: {
		inherit: true,
		isSnatchable: false,
		onTryHit: function(pokemon) {
			var targets = pokemon.side.foe.active;
			for (var i=0; i<targets.length; i++) {
				if (!targets[i] || targets[i].fainted) continue;
				for (var j=0; j<pokemon.moves.length; j++) {
					if (targets[i].moves.indexOf(pokemon.moves[j]) >= 0) return;
				}
			}
			return false;
		}
	},
	jumpkick: {
		inherit: true,
		basePower: 85,
		desc: "If this attack misses the target, the user takes half of the damage it would have dealt in recoil damage.",
		shortDesc: "User takes half damage it would have dealt if miss.",
		pp: 25,
		onMoveFail: function(target, source, move) {
			var damage = this.getDamage(source, target, move, true);
			this.damage(clampIntRange(damage/2, 1, Math.floor(target.maxhp/2)), source);
		}
	},
	lastresort: {
		inherit: true,
		basePower: 130
	},
	luckychant: {
		inherit: true,
		isSnatchable: false
	},
	lunardance: {
		inherit: true,
		isSnatchable: false
	},
	magiccoat: {
		inherit: true,
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('-singleturn', target, 'move: Magic Coat');
			},
			onTryHitPriority: 2,
			onTryHit: function(target, source, move) {
				if (target === source) return;
				if (move.hasBounced) return;
				if (typeof move.isBounceable === 'undefined') {
					move.isBounceable = !!(move.category === 'Status' && (move.status || move.boosts || move.volatileStatus === 'confusion' || move.forceSwitch));
				}
				if (move.isBounceable) {
					var newMove = this.getMoveCopy(move.id);
					newMove.hasBounced = true;
					this.useMove(newMove, target, source);
					return null;
				}
			},
			onAllyTryHitSide: function(target, source, move) {
				if (target.side === source.side) return;
				if (move.hasBounced) return;
				if (typeof move.isBounceable === 'undefined') {
					move.isBounceable = !!(move.category === 'Status' && (move.status || move.boosts || move.volatileStatus === 'confusion' || move.forceSwitch));
				}
				if (move.isBounceable) {
					target.removeVolatile('MagicCoat');
					var newMove = this.getMoveCopy(move.id);
					newMove.hasBounced = true;
					this.useMove(newMove, target, source);
					return null;
				}
			}
		}
	},
	magmastorm: {
		inherit: true,
		accuracy: 70
	},
	magnetrise: {
		inherit: true,
		isSnatchable: false,
		volatileStatus: 'magnetrise',
		effect: {
			duration: 5,
			onStart: function(target) {
				if (target.volatiles['ingrain'] || target.ability === 'levitate') return false;
				this.add('-start', target, 'Magnet Rise');
			},
			onImmunity: function(type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 6,
			onResidualSubOrder: 9,
			onEnd: function(target) {
				this.add('-end', target, 'Magnet Rise');
			}
		}
	},
	metronome: {
		inherit: true,
		onHit: function(target) {
			var moves = [];
			for (var i in exports.BattleMovedex) {
				var move = exports.BattleMovedex[i];
				if (i !== move.id) continue;
				if (move.isNonstandard) continue;
				var noMetronome = {
					assist:1, chatter:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, endure:1, feint:1, focuspunch:1, followme:1, helpinghand:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, protect:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, switcheroo:1, thief:1, trick:1
				};
				if (!noMetronome[move.id] && move.num < 468) {
					moves.push(move.id);
				}
			}
			var move = '';
			if (moves.length) move = moves[this.random(moves.length)];
			if (!move) return false;
			this.useMove(move, target);
		}
	},
	mimic: {
		inherit: true,
		//desc: "",
		onHit: function(target, source) {
			var disallowedMoves = {chatter:1, metronome:1, mimic:1, sketch:1, struggle:1, transform:1};
			if (source.transformed || !target.lastMove || disallowedMoves[target.lastMove] || source.moves.indexOf(target.lastMove) !== -1 || target.volatiles['substitute']) return false;
			var moveslot = source.moves.indexOf('mimic');
			if (moveslot === -1) return false;
			var move = Tools.getMove(target.lastMove);
			source.moveset[moveslot] = {
				move: move.name,
				id: move.id,
				pp: 5,
				maxpp: move.pp * 8/5,
				disabled: false,
				used: false
			};
			source.moves[moveslot] = toId(move.name);
			this.add('-message', source.name+' learned '+move.name+'! (placeholder)');
		}
	},
	minimize: {
		inherit: true,
		desc: "Raises the user's evasion by 1 stage. After using this move, Stomp will have its power doubled if used against the user while it is active.",
		shortDesc: "Boosts the user's evasion by 1.",
		boosts: {
			evasion: 1
		}
	},
	miracleeye: {
		inherit: true,
		isBounceable: false
	},
	odorsleuth: {
		inherit: true,
		isBounceable: false
	},
	outrage: {
		inherit: true,
		pp: 15
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
		basePower: 90,
		pp: 20
	},
	poisongas: {
		inherit: true,
		accuracy: 55,
		target: "normal"
	},
	powertrick: {
		inherit: true,
		isSnatchable: false
	},
	protect: {
		inherit: true,
		//desc: "",
		priority: 3
	},
	psychup: {
		inherit: true,
		isSnatchable: true
	},
	recycle: {
		inherit: true,
		isSnatchable: false
	},
	reversal: {
		inherit: true,
		basePowerCallback: function(pokemon, target) {
			var ratio = pokemon.hp * 64 / pokemon.maxhp;
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
		}
	},
	roar: {
		inherit: true,
		isBounceable: false
	},
	rockblast: {
		inherit: true,
		accuracy: 80
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
	sketch: {
		inherit: true,
		//desc: "",
		onHit: function(target, source) {
			var disallowedMoves = {chatter:1, sketch:1, struggle:1};
			if (source.transformed || !target.lastMove || disallowedMoves[target.lastMove] || source.moves.indexOf(target.lastMove) !== -1 || target.volatiles['substitute']) return false;
			var moveslot = source.moves.indexOf('sketch');
			if (moveslot === -1) return false;
			var move = Tools.getMove(target.lastMove);
			var sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				disabled: false,
				used: false
			};
			source.moveset[moveslot] = sketchedMove;
			source.baseMoveset[moveslot] = sketchedMove;
			source.moves[moveslot] = toId(move.name);
			this.add('-message', source.name+' learned '+move.name+'! (placeholder)');
		}
	},
	skillswap: {
		inherit: true,
		onHit: function(target, source) {
			var targetAbility = target.ability;
			var sourceAbility = source.ability;
			if (!target.setAbility(sourceAbility) || !source.setAbility(targetAbility)) {
				target.ability = targetAbility;
				source.ability = sourceAbility;
				return false;
			}
			this.add('-activate', source, 'move: Skill Swap');
		}
	},
	spikes: {
		inherit: true,
		isBounceable: false
	},
	spite: {
		inherit: true,
		isBounceable: false
	},
	stealthrock: {
		inherit: true,
		isBounceable: false
	},
	suckerpunch: {
		inherit: true,
		onTryHit: function(target) {
			decision = this.willMove(target);
			if (!decision || decision.choice !== 'move' || decision.move.category === 'Status') {
				return false;
			}
		}
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
	tailwind: {
		inherit: true,
		desc: "For 3 turns, the user and its party members have their Speed doubled. Fails if this move is already in effect for the user's side.",
		shortDesc: "For 3 turns, allies' Speed is doubled.",
		effect: {
			duration: 3,
			durationCallback: function(target, source, effect) {
				if (source && source.ability === 'persistent') {
					return 5;
				}
				return 3;
			},
			onStart: function(side) {
				this.add('-sidestart', side, 'move: Tailwind');
			},
			onModifySpe: function(spe) {
				return spe * 2;
			},
			onResidualOrder: 21,
			onResidualSubOrder: 4,
			onEnd: function(side) {
				this.add('-sideend', side, 'move: Tailwind');
			}
		}
	},
	taunt: {
		inherit: true,
		isBounceable: false
	},
	thrash: {
		inherit: true,
		basePower: 90,
		pp: 20
	},
	torment: {
		inherit: true,
		isBounceable: false
	},
	toxic: {
		inherit: true,
		accuracy: 85
	},
	toxicspikes: {
		inherit: true,
		isBounceable: false,
		effect: {
			// this is a side condition
			onStart: function(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers = 1;
			},
			onRestart: function(side) {
				if (this.effectData.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers++;
			},
			onSwitchIn: function(pokemon) {
				if (!pokemon.runImmunity('Ground')) return;
				if (!pokemon.runImmunity('Poison')) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] '+pokemon);
					pokemon.side.removeSideCondition('toxicspikes');
				}
				if (pokemon.volatiles['substitute']) {
					return;
				} else if (this.effectData.layers >= 2) {
					pokemon.trySetStatus('tox');
				} else {
					pokemon.trySetStatus('psn');
				}
			}
		}
	},
	uproar: {
		inherit: true,
		basePower: 50
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
		isSnatchable: false,
		sideCondition: 'Wish',
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
	worryseed: {
		inherit: true,
		//desc: "",
		onTryHit: function(pokemon) {
			var bannedAbilities = {multitype:1, truant:1};
			if (bannedAbilities[pokemon.ability]) {
				return false;
			}
		}
	},
	wrap: {
		inherit: true,
		accuracy: 85
	},
	wringout: {
		inherit: true,
		basePowerCallback: function(pokemon) {
			return Math.floor(pokemon.hp*120/pokemon.maxhp) + 1;
		}
	},
	magikarpsrevenge: null
};
