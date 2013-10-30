/**
 * Gen 2 moves
 */
function clampIntRange(num, min, max) {
	num = Math.floor(num);
	if (num < min) num = min;
	if (typeof max !== 'undefined' && num > max) num = max;
	return num;
}
exports.BattleMovedex = {
	acidarmor: {
		pp: 40,
		inherit: true
	},
	attract: {
		effect: {
			noCopy: true,
			onStart: function (pokemon, source, effect) {
				if (!(pokemon.gender === 'M' && source.gender === 'F') && !(pokemon.gender === 'F' && source.gender === 'M')) {
					this.debug('incompatible gender');
					return false;
				}
				if (!this.runEvent('Attract', pokemon, source)) {
					this.debug('Attract event failed');
					return false;
				}

				if (effect.id === 'cutecharm') {
					this.add('-start', pokemon, 'Attract', '[from] ability: Cute Charm', '[of] ' + source);
				}
				else if (effect.id === 'destinyknot') {
					this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', '[of] ' + source);
				}
				else {
					this.add('-start', pokemon, 'Attract');
				}
			},
			onBeforeMove: function (pokemon, target, move) {
				if (this.effectData.source && !this.effectData.source.isActive && pokemon.volatiles['attract']) {
					this.debug('Removing Attract volatile on ' + pokemon);
					pokemon.removeVolatile('attract');
					return;
				}
				this.add('-activate', pokemon, 'Attract', '[of] ' + this.effectData.source);
				if (this.random(2) === 0) {
					this.add('cant', pokemon, 'Attract');
					return false;
				}
			}
		},
		inherit: true
	},
	barrier: {
		pp: 30,
		inherit: true
	},
	beatup: {
		basePowerCallBack: function (pokemon, target) {
			pokemon.addVolatile('beatup');
			if (!pokemon.side.pokemon[pokemon.volatiles.beatup.index]) return null;
			return 5 + Math.floor(pokemon.side.pokemon[pokemon.volatiles.beatup.index].template.baseStats.atk / 10);
		},
		effect: {
			duration: 1,
			onStart: function (pokemon) {
				this.effectData.index = 0;
				while (pokemon.side.pokemon[this.effectData.index] !== pokemon &&
					(!pokemon.side.pokemon[this.effectData.index] ||
						pokemon.side.pokemon[this.effectData.index].fainted ||
						pokemon.side.pokemon[this.effectData.index].status)) {
					this.effectData.index++;
				}
			},
			onRestart: function (pokemon) {
				do {
					this.effectData.index++;
					if (this.effectData.index >= 6) break;
				} while (!pokemon.side.pokemon[this.effectData.index] ||
					pokemon.side.pokemon[this.effectData.index].fainted ||
					pokemon.side.pokemon[this.effectData.index].status)
			}
		},
		inherit: true
	},
	bellydrum: {
		onHit: function (target) {
			if (target.boosts.atk >= 6) {
				return false;
			}
			if (target.hp <= target.maxhp / 2) {
				this.boost({
					atk: 2
				});
				return false;
			}
			this.directDamage(target.maxhp / 2);
			target.setBoost({
				atk: 6
			});
			this.add('-setboost', target, 'atk', '6', '[from] move: Belly Drum');
		},
		inherit: true
	},
	bide: {
		effect: {
			duration: 3,
			onLockMove: "bide",
			onStart: function (pokemon) {
				this.effectData.totalDamage = 0;
				this.add('-start', pokemon, 'Bide');
			},
			onDamage: function (damage, target, source, move) {
				if (!move || move.effectType !== 'Move') return;
				if (!source || source.side === target.side) return;
				this.effectData.totalDamage += damage;
				this.effectData.sourcePosition = source.position;
				this.effectData.sourceSide = source.side;
			},
			onAfterSetStatus: function (status, pokemon) {
				if (status.id === 'slp') {
					pokemon.removeVolatile('bide');
				}
			},
			onBeforeMove: function (pokemon) {
				if (this.effectData.duration === 1) {
					if (!this.effectData.totalDamage) {
						this.add('-end', pokemon, 'Bide');
						this.add('-fail', pokemon);
						return false;
					}
					this.add('-end', pokemon, 'Bide');
					var target = this.effectData.sourceSide.active[this.effectData.sourcePosition];
					if (!target.runImmunity('Normal')) {
						this.add('-immune', target, '[msg]');
						return false;
					}
					this.moveHit(target, pokemon, 'bide', {
						damage: this.effectData.totalDamage * 2
					});
					return false;
				}
				this.add('-activate', pokemon, 'Bide');
				return false;
			}
		},
		inherit: true
	},
	bite: {
		isBiteAttack: null,
		inherit: true
	},
	blizzard: {
		basePower: 120,
		onModifyMove: function (move) {
			if (this.isWeather('hail')) move.accuracy = true;
		},
		inherit: true
	},
	bubble: {
		basePower: 20,
		inherit: true
	},
	charm: {
		type: "Normal",
		inherit: true
	},
	conversion: {
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
	conversion2: {
		onHit: function (target, source) {
			if (!target.lastMove) {
				return false;
			}
			var possibleTypes = [];
			var attackType = this.getMove(target.lastMove).type;
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
			this.add('-start', source, 'typechange', type);
			source.types = [type];
		},
		inherit: true
	},
	cottonspore: {
		onTryHit: function () {},
		inherit: true
	},
	counter: {
		damageCallback: function (pokemon) {
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn && this.getCategory(pokemon.lastAttackedBy.move) === 'Physical') {
				return 2 * pokemon.lastAttackedBy.damage;
			}
			return false;
		},
		inherit: true
	},
	crabhammer: {
		basePower: 90,
		inherit: true
	},
	crunch: {
		isBiteAttack: null,
		inherit: true
	},
	curse: {
		onModifyMove: function (move, source, target) {
			if (!source.hasType('Ghost')) {
				delete move.volatileStatus;
				delete move.onHit;
				move.self = {
					boosts: {
						atk: 1,
						def: 1,
						spe: -1
					}
				};
				move.target = move.nonGhostTarget;
			}
		},
		onTryHit: function (target, source, move) {
			if (move.volatileStatus && target.volatiles.curse) return false;
		},
		onHit: function (target, source) {
			this.directDamage(source.maxhp / 2, source, source);
		},
		effect: {
			onStart: function (pokemon, source) {
				this.add('-start', pokemon, 'Curse', '[of] ' + source);
			},
			onResidualOrder: 10,
			onResidual: function (pokemon) {
				this.damage(pokemon.maxhp / 4);
			}
		},
		inherit: true
	},
	detect: {
		onTryHit: function (pokemon) {
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('stall');
		},
		inherit: true
	},
	dig: {
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
		effect: {
			duration: 2,
			onLockMove: "dig",
			onImmunity: function (type, pokemon) {
				if (type === 'sandstorm' || type === 'hail') return false;
			},
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude' || move.id === 'helpinghand') {
					return;
				}
				return 0;
			},
			onSourceModifyDamage: function (damageMod, source, target, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					return this.chain(damageMod, 2);
				}
			}
		},
		inherit: true
	},
	disable: {
		effect: {
			duration: 4,
			noCopy: true,
			onStart: function (pokemon) {
				if (!this.willMove(pokemon)) {
					this.effectData.duration++;
				}
				if (!pokemon.lastMove) {
					this.debug('pokemon has not moved yet');
					return false;
				}
				var moves = pokemon.moveset;
				for (var i = 0; i < moves.length; i++) {
					if (moves[i].id === pokemon.lastMove) {
						if (!moves[i].pp) {
							this.debug('Move out of PP');
							return false;
						}
						else {
							this.add('-start', pokemon, 'Disable', moves[i].move);
							this.effectData.move = pokemon.lastMove;
							return;
						}
					}
				}
				this.debug('Move does not exist ???');
				return false;
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
	dreameater: {
		onTryHit: function (target) {
			if (target.status !== 'slp') {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		inherit: true
	},
	encore: {
		isBounceable: false,
		effect: {
			durationCallBack: function () {
				return this.random(2, 6);
			},
			onStart: function (target) {
				var noEncore = {
					encore: 1,
					mimic: 1,
					mirrormove: 1,
					sketch: 1,
					transform: 1
				};
				var moveIndex = target.moves.indexOf(target.lastMove);
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
			onModifyPokemon: function (pokemon) {
				if (!this.effectData.move || !pokemon.hasMove(this.effectData.move)) {
					return;
				}
				for (var i = 0; i < pokemon.moveset.length; i++) {
					if (pokemon.moveset[i].id !== this.effectData.move) {
						pokemon.moveset[i].disabled = true;
					}
				}
			}
		},
		inherit: true
	},
	endure: {
		onTryHit: function (pokemon) {
			return this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'move: Endure');
			},
			onDamagePriority: -10,
			onDamage: function (damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && damage >= target.hp) {
					return target.hp - 1;
				}
			}
		},
		inherit: true
	},
	explosion: {
		basePower: 500,
		inherit: true
	},
	fireblast: {
		basePower: 120,
		inherit: true
	},
	flail: {
		basePowerCallBack: function (pokemon, target) {
			var ratio = pokemon.hp * 48 / pokemon.maxhp;
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
		inherit: true
	},
	flamethrower: {
		basePower: 95,
		inherit: true
	},
	fly: {
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
		effect: {
			duration: 2,
			onLockMove: "fly",
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return;
				}
				if (move.id === 'skyuppercut' || move.id === 'thunder' || move.id === 'hurricane' || move.id === 'smackdown' || move.id === 'helpinghand') {
					return;
				}
				return 0;
			},
			onSourceBasePower: function (bpMod, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return this.chain(bpMod, 2);
				}
			}
		},
		inherit: true
	},
	focusenergy: {
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'move: Focus Energy');
			},
			onModifyMove: function (move) {
				move.critRatio += 2;
			}
		},
		inherit: true
	},
	frustration: {
		basePowerCallBack: function (pokemon) {
			return Math.floor(((255 - pokemon.happiness) * 10) / 25) || 1;
		},
		inherit: true
	},
	furycutter: {
		basePower: 20,
		basePowerCallBack: function (pokemon) {
			if (!pokemon.volatiles.furycutter) {
				pokemon.addVolatile('furycutter');
			}
			return 20 * pokemon.volatiles.furycutter.multiplier;
		},
		onHit: function (target, source) {
			source.addVolatile('furycutter');
		},
		inherit: true
	},
	futuresight: {
		basePower: 100,
		onTryHit: function (target, source) {
			source.side.addSideCondition('futuremove');
			if (source.side.sideConditions['futuremove'].positions[source.position]) {
				return false;
			}
			source.side.sideConditions['futuremove'].positions[source.position] = {
				duration: 3,
				move: 'futuresight',
				targetPosition: target.position,
				source: source,
				moveData: {
					basePower: 100,
					category: "Special",
					affectedByImmunities: true,
					type: 'Psychic'
				}
			};
			this.add('-start', source, 'move: Future Sight');
			return null;
		},
		inherit: true
	},
	glare: {
		accuracy: 90,
		inherit: true
	},
	growth: {
		onModifyMove: null,
		boosts: {
			spa: 1
		},
		inherit: true
	},
	haze: {
		onHitField: function () {
			this.add('-clearallboost');
			for (var i = 0; i < this.sides.length; i++) {
				for (var j = 0; j < this.sides[i].active.length; j++) {
					this.sides[i].active[j].clearBoosts();
				}
			}
		},
		inherit: true
	},
	healbell: {
		onHit: function (pokemon, source) {
			var side = pokemon.side;
			for (var i = 0; i < side.pokemon.length; i++) {
				side.pokemon[i].status = '';
			}
			this.add('-cureteam', source, '[from] move: HealBell');
		},
		inherit: true
	},
	hiddenpower: {
		basePower: 0,
		basePowerCallBack: function (pokemon) {
			return pokemon.hpPower || 70;
		},
		desc: "Deals damage to one adjacent target. This move's type and power depend on the user's individual values (IVs). Power varies between 30 and 70, and type can be any but Normal.",
		shortDesc: "Varies in power and type based on the user's IVs.",
		onModifyMove: function (move, pokemon) {
			move.type = pokemon.hpType || 'Dark';
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
		onMoveFail: function (target, source, move) {
			this.damage(source.maxhp / 2, source, source, 'highjumpkick');
		},
		inherit: true
	},
	hydropump: {
		basePower: 120,
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
	jumpkick: {
		onMoveFail: function (target, source, move) {
			this.damage(source.maxhp / 2, source, source, 'jumpkick');
		},
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
				var toLeech = clampIntRange(target.maxhp / 8, 1);
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
				var toLeech = clampIntRange(pokemon.maxhp / 8, 1);
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
		effect: {
			duration: 5,
			onModifySpD: function (spd) {
				return spd * 2;
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Light Screen');
			},
			onResidualOrder: 21,
			onEnd: function (side) {
				this.add('-sideend', side, 'move: Light Screen');
			}
		},
		inherit: true
	},
	lowkick: {
		basePowerCallBack: function (pokemon, target) {
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
		inherit: true
	},
	magnitude: {
		onModifyMove: function (move, pokemon) {
			var i = this.random(100);
			if (i < 5) {
				this.add('-activate', pokemon, 'move: Magnitude', 4);
				move.basePower = 10;
			}
			else if (i < 15) {
				this.add('-activate', pokemon, 'move: Magnitude', 5);
				move.basePower = 30;
			}
			else if (i < 35) {
				this.add('-activate', pokemon, 'move: Magnitude', 6);
				move.basePower = 50;
			}
			else if (i < 65) {
				this.add('-activate', pokemon, 'move: Magnitude', 7);
				move.basePower = 70;
			}
			else if (i < 85) {
				this.add('-activate', pokemon, 'move: Magnitude', 8);
				move.basePower = 90;
			}
			else if (i < 95) {
				this.add('-activate', pokemon, 'move: Magnitude', 9);
				move.basePower = 110;
			}
			else {
				this.add('-activate', pokemon, 'move: Magnitude', 10);
				move.basePower = 150;
			}
		},
		inherit: true
	},
	meanlook: {
		onHit: function (target) {
			target.addVolatile('trapped');
		},
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
					afteryou: 1,
					assist: 1,
					bestow: 1,
					chatter: 1,
					copycat: 1,
					counter: 1,
					covet: 1,
					destinybond: 1,
					detect: 1,
					endure: 1,
					feint: 1,
					focuspunch: 1,
					followme: 1,
					freezeshock: 1,
					helpinghand: 1,
					iceburn: 1,
					mefirst: 1,
					metronome: 1,
					mimic: 1,
					mirrorcoat: 1,
					mirrormove: 1,
					naturepower: 1,
					protect: 1,
					quash: 1,
					quickguard: 1,
					ragepowder: 1,
					relicsong: 1,
					secretsword: 1,
					sketch: 1,
					sleeptalk: 1,
					snatch: 1,
					snarl: 1,
					snore: 1,
					struggle: 1,
					switcheroo: 1,
					technoblast: 1,
					thief: 1,
					transform: 1,
					trick: 1,
					vcreate: 1,
					wideguard: 1
				};
				if (!noMetronome[move.id]) {
					moves.push(move.id);
				}
			}
			var move = '';
			if (moves.length) move = moves[this.random(moves.length)];
			if (!move) {
				return false;
			}
			this.useMove(move, target);
		},
		inherit: true
	},
	mimic: {
		onHit: function (target, source) {
			var disallowedMoves = {
				chatter: 1,
				mimic: 1,
				sketch: 1,
				struggle: 1,
				transform: 1
			};
			if (source.transformed || !target.lastMove || disallowedMoves[target.lastMove] || source.moves.indexOf(target.lastMove) !== -1) return false;
			var moveslot = source.moves.indexOf('mimic');
			if (moveslot === -1) return false;
			var move = Tools.getMove(target.lastMove);
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
	mirrorcoat: {
		damageCallback: function (pokemon) {
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn && this.getCategory(pokemon.lastAttackedBy.move) === 'Special') {
				return 2 * pokemon.lastAttackedBy.damage;
			}
			return false;
		},
		inherit: true
	},
	mirrormove: {
		onTryHit: function (target) {
			var noMirrorMove = {
				acupressure: 1,
				afteryou: 1,
				aromatherapy: 1,
				chatter: 1,
				conversion2: 1,
				counter: 1,
				curse: 1,
				doomdesire: 1,
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
				struggle: 1,
				sunnyday: 1,
				tailwind: 1,
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
			this.useMove(target.lastMove, source);
		},
		inherit: true
	},
	moonlight: {
		onHit: function (pokemon) {
			if (this.isWeather('sunnyday')) this.heal(this.modify(pokemon.maxhp, 0.667));
			else if (this.isWeather(['raindance', 'sandstorm', 'hail'])) this.heal(this.modify(pokemon.maxhp, 0.25));
			else this.heal(this.modify(pokemon.maxhp, 0.5));
		},
		type: "Normal",
		inherit: true
	},
	morningsun: {
		onHit: function (pokemon) {
			if (this.isWeather('sunnyday')) this.heal(this.modify(pokemon.maxhp, 0.667));
			else if (this.isWeather(['raindance', 'sandstorm', 'hail'])) this.heal(this.modify(pokemon.maxhp, 0.25));
			else this.heal(this.modify(pokemon.maxhp, 0.5));
		},
		inherit: true
	},
	nightmare: {
		effect: {
			onResidualOrder: 9,
			onStart: function (pokemon) {
				if (pokemon.status !== 'slp') {
					return false;
				}
				this.add('-start', pokemon, 'Nightmare');
			},
			onResidual: function (pokemon) {
				if (pokemon.status !== 'slp') {
					pokemon.removeVolatile('nightmare');
					return;
				}
				this.damage(pokemon.maxhp / 4);
			}
		},
		inherit: true
	},
	painsplit: {
		onHit: function (target, pokemon) {
			var averagehp = Math.floor((target.hp + pokemon.hp) / 2) || 1;
			target.sethp(averagehp);
			pokemon.sethp(averagehp);
			this.add('-sethp', target, target.getHealth, pokemon, pokemon.getHealth, '[from] move: Pain Split');
		},
		inherit: true
	},
	payday: {
		onHit: function () {
			this.add('-fieldactivate', 'move: Pay Day');
		},
		inherit: true
	},
	perishsong: {
		onHitField: function (target, source) {
			var result = true;
			for (var i = 0; i < this.sides.length; i++) {
				for (var j = 0; j < this.sides[i].active.length; j++) {
					if (this.sides[i].active[j]) {
						if (!this.sides[i].active[j].volatiles['perishsong']) {
							result = false;
						}
						if (this.sides[i].active[j].ability !== 'soundproof') {
							this.sides[i].active[j].addVolatile('perishsong');
						}
						else {
							this.add('-immune', this.sides[i].active[j], '[msg]');
							this.add('-end', this.sides[i].active[j], 'Perish Song');
						}
					}
				}
			}
			if (result) return false;
			this.add('-fieldactivate', 'move: Perish Song');
		},
		effect: {
			duration: 4,
			onEnd: function (target) {
				this.add('-start', target, 'perish0');
				target.faint();
			},
			onResidual: function (pokemon) {
				var duration = pokemon.volatiles['perishsong'].duration;
				this.add('-start', pokemon, 'perish' + duration);
			}
		},
		inherit: true
	},
	pinmissile: {
		accuracy: 85,
		basePower: 14,
		inherit: true
	},
	poisongas: {
		accuracy: 80,
		inherit: true
	},
	poisonpowder: {
		isPowder: null,
		onTryHit: function () {},
		inherit: true
	},
	present: {
		onModifyMove: function (move, pokemon, target) {
			var rand = this.random(10);
			if (rand < 2) {
				move.heal = [1, 4];
			}
			else if (rand < 6) {
				move.basePower = 40;
			}
			else if (rand < 9) {
				move.basePower = 80;
			}
			else {
				move.basePower = 120;
			}
		},
		inherit: true
	},
	protect: {
		onTryHit: function (pokemon) {
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('stall');
		},
		inherit: true
	},
	psychup: {
		onHit: function (target, source) {
			var targetBoosts = {};
			for (var i in target.boosts) {
				targetBoosts[i] = target.boosts[i];
			}
			source.setBoost(targetBoosts);
			this.add('-copyboost', source, target, '[from] move: Psych Up');
		},
		inherit: true
	},
	psywave: {
		damageCallback: function (pokemon) {
			return (this.random(50, 151) * pokemon.level) / 100;
		},
		inherit: true
	},
	pursuit: {
		basePowerCallBack: function (pokemon, target) {
			// you can't get here unless the pursuit succeeds
			if (target.beingCalledBack) {
				this.debug('Pursuit damage boost');
				return 80;
			}
			return 40;
		},
		beforeTurnCallback: function (pokemon, target) {
			target.side.addSideCondition('pursuit', pokemon);
			if (!target.side.sideConditions['pursuit'].sources) {
				target.side.sideConditions['pursuit'].sources = [];
			}
			target.side.sideConditions['pursuit'].sources.push(pokemon);
		},
		onModifyMove: function (move, source, target) {
			if (target && target.beingCalledBack) move.accuracy = true;
		},
		onTryHit: function (target, pokemon) {
			target.side.removeSideCondition('pursuit');
		},
		effect: {
			duration: 1,
			onBeforeSwitchOut: function (pokemon) {
				this.debug('Pursuit start');
				var sources = this.effectData.sources;
				for (var i = 0; i < sources.length; i++) {
					this.cancelMove(sources[i]);
					this.runMove('pursuit', sources[i], pokemon);
				}
			}
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
	rapidspin: {
		self: {
			onHit: function (pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
				var sideConditions = {
					spikes: 1,
					toxicspikes: 1,
					stealthrock: 1
				};
				for (var i in sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(i)) {
						this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					this.add('-remove', pokemon, pokemon.volatiles['partiallytrapped'].sourceEffect.name, '[from] move: Rapid Spin', '[of] ' + pokemon, '[partiallytrapped]');
					delete pokemon.volatiles['partiallytrapped'];
				}
			}
		},
		inherit: true
	},
	razorwind: {
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
	reflect: {
		effect: {
			duration: 5,
			onModifyDef: function (def) {
				return def * 2;
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'Reflect');
			},
			onResidualOrder: 21,
			onEnd: function (side) {
				this.add('-sideend', side, 'Reflect');
			}
		},
		inherit: true
	},
	rest: {
		onHit: function (target) {
			if (target.hp >= target.maxhp) return false;
			if (!target.setStatus('slp') && target.status !== 'slp') return false;
			target.statusData.time = 3;
			target.statusData.startTime = 3;
			this.heal(target.maxhp);
			this.add('-status', target, 'slp', '[from] move: Rest');
		},
		inherit: true
	},
	return :{
		basePowerCallBack: function (pokemon) {
			return Math.floor((pokemon.happiness * 10) / 25) || 1;
		},
		inherit: true
	},
	reversal: {
		basePowerCallBack: function (pokemon, target) {
			var ratio = pokemon.hp * 48 / pokemon.maxhp;
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
		inherit: true
	},
	roar: {
		priority: -1,
		accuracy: 100,
		isNotProtectable: null,
		inherit: true
	},
	rollout: {
		basePowerCallBack: function (pokemon, target) {
			var bp = 30;
			var bpTable = [30, 60, 120, 240, 480];
			if (pokemon.volatiles.rollout && pokemon.volatiles.rollout.hitCount) {
				bp = (bpTable[pokemon.volatiles.rollout.hitCount] || 480);
			}
			pokemon.addVolatile('rollout');
			if (pokemon.volatiles.defensecurl) {
				bp *= 2;
			}
			this.debug("Rollout bp: " + bp);
			return bp;
		},
		inherit: true
	},
	safeguard: {
		effect: {
			duration: 5,
			durationCallBack: function (target, source, effect) {
				if (source && source.ability === 'persistent') {
					return 7;
				}
				return 5;
			},
			onSetStatus: function (status, target, source, effect) {
				if (source && source !== target && source.ability !== 'infiltrator' || (effect && effect.id === 'toxicspikes')) {
					this.debug('interrupting setStatus');
					return false;
				}
			},
			onTryConfusion: function (target, source, effect) {
				if (source && source !== target && source.ability !== 'infiltrator') {
					this.debug('interrupting addVolatile');
					return false;
				}
			},
			onTryHit: function (target, source, move) {
				if (move && move.id === 'yawn') {
					this.debug('blocking yawn');
					return false;
				}
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'Safeguard');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd: function (side) {
				this.add('-sideend', side, 'Safeguard');
			}
		},
		inherit: true
	},
	selfdestruct: {
		basePower: 400,
		inherit: true
	},
	sketch: {
		onHit: function (target, source) {
			var disallowedMoves = {
				chatter: 1,
				sketch: 1,
				struggle: 1
			};
			if (source.transformed || !target.lastMove || disallowedMoves[target.lastMove] || source.moves.indexOf(target.lastMove) !== -1) return false;
			var moveslot = source.moves.indexOf('sketch');
			if (moveslot === -1) return false;
			var move = Tools.getMove(target.lastMove);
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
		},
		inherit: true
	},
	skullbash: {
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
		effect: {
			duration: 2,
			onLockMove: "skullbash",
			onStart: function (pokemon) {
				this.boost({
					def: 1
				}, pokemon, pokemon, this.getMove('skullbash'));
			}
		},
		inherit: true
	},
	skyattack: {
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
	sleeptalk: {
		onHit: function (pokemon) {
			var moves = [];
			for (var i = 0; i < pokemon.moveset.length; i++) {
				var move = pokemon.moveset[i].id;
				var NoSleepTalk = {
					bide: 1,
					dig: 1,
					fly: 1,
					metronome: 1,
					mirrormove: 1,
					skullbash: 1,
					skyattack: 1,
					sleeptalk: 1,
					solarbeam: 1,
					razorwind: 1
				};
				if (move && !NoSleepTalk[move]) {
					moves.push(move);
				}
			}
			var move = '';
			if (moves.length) move = moves[this.random(moves.length)];
			if (!move) return false;
			move.isSleepTalk = true;
			this.useMove(move, pokemon);
		},
		onTryHit: function (pokemon) {
			if (pokemon.status !== 'slp') return false;
		},
		inherit: true
	},
	smog: {
		basePower: 20,
		inherit: true
	},
	snore: {
		basePower: 40,
		onTryHit: function (target, source) {
			if (source.status !== 'slp') return false;
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
	spiderweb: {
		onHit: function (target) {
			target.addVolatile('trapped');
		},
		inherit: true
	},
	spikes: {
		effect: {
			onStart: function (side) {
				if (!this.effectData.layers || this.effectData.layers === 0) {
					this.add('-sidestart', side, 'Spikes');
					this.effectData.layers = 1;
				}
				else {
					return false;
				}
			},
			onSwitchIn: function (pokemon) {
				var side = pokemon.side;
				if (!pokemon.runImmunity('Ground')) return;
				var damageAmounts = [0, 3];
				var damage = this.damage(damageAmounts[this.effectData.layers] * pokemon.maxhp / 24);
			}
		},
		inherit: true
	},
	spite: {
		onHit: function (target) {
			var reduction = this.random(2, 6);
			if (target.deductPP(target.lastMove, reduction)) {
				this.add("-activate", target, 'move: Spite', target.lastMove, reduction);
				return;
			}
			return false;
		},
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
	stringshot: {
		desc: "Lowers all adjacent foes' Speed by 1 stage. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the foe(s) Speed by 1.",
		boosts: {
			spe: -1
		},
		inherit: true
	},
	struggle: {
		beforeMoveCallback: function (pokemon) {
			this.add('-activate', pokemon, 'move: Struggle');
		},
		onModifyMove: function (move) {
			move.type = '???';
		},
		self: {
			onHit: function (source) {
				this.directDamage(source.maxhp / 4, source, source, 'strugglerecoil');
			}
		},
		inherit: true
	},
	stunspore: {
		onTryHit: function () {},
		inherit: true
	},
	substitute: {
		effect: {
			onStart: function (target) {
				this.add('-start', target, 'Substitute');
				this.effectData.hp = Math.floor(target.maxhp / 4);
				delete target.volatiles['partiallytrapped'];
			},
			onTryPrimaryHitPriority: -1,
			onTryPrimaryHit: function (target, source, move) {
				if (target === source) {
					this.debug('sub bypass: self hit');
					return;
				}
				if (move.category === 'Status') {
					var SubBlocked = {
						leechseed: 1,
						lockon: 1,
						mindreader: 1,
						nightmare: 1,
						painsplit: 1
					};
					if (move.status || move.boosts || move.volatileStatus === 'confusion' || SubBlocked[move.id]) {
						return false;
					}
					return;
				}
				var damage = this.getDamage(source, target, move);
				if (!damage) {
					return null;
				}
				damage = this.runEvent('SubDamage', target, source, move, damage);
				if (!damage) {
					return damage;
				}
				if (damage > target.volatiles['substitute'].hp) {
					damage = target.volatiles['substitute'].hp;
				}
				target.volatiles['substitute'].hp -= damage;
				source.lastDamage = damage;
				if (target.volatiles['substitute'].hp <= 0) {
					target.removeVolatile('substitute');
				}
				else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				if (move.recoil) {
					this.damage(Math.round(damage * move.recoil[0] / move.recoil[1]), source, target, 'recoil');
				}
				if (move.drain) {
					this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
				}
				this.runEvent('AfterSubDamage', target, source, move, damage);
				return 0; // hit
			},
			onEnd: function (target) {
				this.add('-end', target, 'Substitute');
			}
		},
		onTryHit: function (target) {
			if (target.volatiles['substitute']) {
				this.add('-fail', target, 'move: Substitute');
				return null;
			}
			if (target.hp <= target.maxhp / 4 || target.maxhp === 1) { // Shedinja clause
				this.add('-fail', target, 'move: Substitute', '[weak]');
				return null;
			}
		},
		onHit: function (target) {
			this.directDamage(target.maxhp / 4);
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
	sweetkiss: {
		type: "Normal",
		inherit: true
	},
	sweetscent: {
		desc: "Lowers all adjacent foes' evasion by 1 stage. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. (Field: Can be used to attract wild Pokemon while standing in grass. Fails if the weather is not clear.)",
		shortDesc: "Lowers the foe(s) evasion by 1.",
		boosts: {
			"evasion": -1
		},
		inherit: true
	},
	swordsdance: {
		pp: 30,
		inherit: true
	},
	synthesis: {
		onHit: function (pokemon) {
			if (this.isWeather('sunnyday')) this.heal(this.modify(pokemon.maxhp, 0.667));
			else if (this.isWeather(['raindance', 'sandstorm', 'hail'])) this.heal(this.modify(pokemon.maxhp, 0.25));
			else this.heal(this.modify(pokemon.maxhp, 0.5));
		},
		inherit: true
	},
	thief: {
		basePower: 40,
		onHit: function (target, source) {
			if (source.item) {
				return;
			}
			var yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (!source.setItem(yourItem)) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-item', source, yourItem, '[from] move: Thief', '[of] ' + target);
		},
		inherit: true
	},
	thunder: {
		basePower: 120,
		onModifyMove: function (move) {
			if (this.isWeather('raindance')) move.accuracy = true;
			else if (this.isWeather('sunnyday')) move.accuracy = 50;
		},
		inherit: true
	},
	thundershock: {
		name: "ThunderShock",
		inherit: true
	},
	thunderbolt: {
		basePower: 95,
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
		secondary: {
			chance: 20,
			onHit: function (target, source) {
				var result = this.random(3);
				if (result === 0) {
					target.trySetStatus('brn', source);
				}
				else if (result === 1) {
					target.trySetStatus('par', source);
				}
				else {
					target.trySetStatus('frz', source);
				}
			}
		},
		inherit: true
	},
	triplekick: {
		basePowerCallBack: function (pokemon) {
			pokemon.addVolatile('triplekick');
			return 10 * pokemon.volatiles['triplekick'].hit;
		},
		inherit: true
	},
	vinewhip: {
		basePower: 35,
		pp: 15,
		inherit: true
	},
	whirlwind: {
		priority: -1,
		accuracy: 100,
		isNotProtectable: null,
		inherit: true
	},
	magikarpsrevenge: {
		onTryHit: function (target, source) {
			if (source.template.name !== 'Magikarp') {
				this.add('-message', 'It didn\t work since it wasn\t used by a Magikarp!'); // TODO?
				return null;
			}
		},
		self: {
			onHit: function (source) {
				this.setWeather('raindance');
				source.addVolatile('magiccoat');
				source.addVolatile('aquaring');
			},
			volatileStatus: "mustrecharge"
		},
		inherit: true
	},
	highjumpkick: {
		onMoveFail: function (target, source, move) {
			this.damage(source.maxhp / 2, source, source, 'hijumpkick');
		},
		inherit: true
	}
};
