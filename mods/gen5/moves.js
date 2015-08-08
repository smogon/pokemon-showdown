exports.BattleMovedex = {
	acidarmor: {
		inherit: true,
		pp: 40
	},
	aircutter: {
		inherit: true,
		basePower: 55
	},
	airslash: {
		inherit: true,
		pp: 20
	},
	aromatherapy: {
		inherit: true,
		onHit: function (pokemon, source) {
			var side = pokemon.side;
			for (var i = 0; i < side.pokemon.length; i++) {
				side.pokemon[i].status = '';
			}
			this.add('-cureteam', source, '[from] move: Aromatherapy');
		}
	},
	assist: {
		inherit: true,
		desc: "A random move among those known by the user's party members is selected for use. Does not select Assist, Bestow, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dragon Tail, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Rage Powder, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief, Transform, or Trick.",
		onHit: function (target) {
			var moves = [];
			for (var j = 0; j < target.side.pokemon.length; j++) {
				var pokemon = target.side.pokemon[j];
				if (pokemon === target) continue;
				for (var i = 0; i < pokemon.moves.length; i++) {
					var move = pokemon.moves[i];
					var noAssist = {
						assist:1, bestow:1, chatter:1, circlethrow:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, dragontail:1, endure:1, feint:1, focuspunch:1, followme:1, helpinghand:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, naturepower:1, protect:1, ragepowder:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, switcheroo:1, thief:1, transform:1, trick:1
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
	assurance: {
		inherit: true,
		basePower: 50,
		basePowerCallback: function (pokemon, target) {
			if (pokemon.volatiles.assurance && pokemon.volatiles.assurance.hurt) {
				this.debug('Boosted for being damaged this turn');
				return 100;
			}
			return 50;
		}
	},
	aurasphere: {
		inherit: true,
		basePower: 90
	},
	barrier: {
		inherit: true,
		pp: 30
	},
	bestow: {
		inherit: true,
		flags: {protect: 1, mirror: 1}
	},
	bind: {
		inherit: true,
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move. Makes contact."
	},
	blizzard: {
		inherit: true,
		basePower: 120
	},
	block: {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1}
	},
	bubble: {
		inherit: true,
		basePower: 20
	},
	bugbuzz: {
		inherit: true,
		flags: {protect: 1, mirror: 1, sound: 1}
	},
	camouflage: {
		inherit: true,
		desc: "The user's type changes based on the battle terrain. Ground-type in Wi-Fi battles. (In-game: Ground-type in puddles, rocky ground, and sand, Water-type on water, Rock-type in caves, Ice-type on snow and ice, and Normal-type everywhere else.) Fails if the user's type cannot be changed or if the user is already purely that type.",
		shortDesc: "Changes user's type based on terrain. (Ground)",
		onHit: function (target) {
			if (!target.setType('Ground')) return false;
			this.add('-start', target, 'typechange', 'Ground');
		}
	},
	charm: {
		inherit: true,
		type: "Normal"
	},
	chatter: {
		inherit: true,
		basePower: 60,
		desc: "Deals damage to one adjacent or non-adjacent target. This move has an X% chance to confuse the target, where X is 0 unless the user is a Chatot that hasn't Transformed. If the user is a Chatot, X is 0 or 10 depending on the volume of Chatot's recorded cry, if any; 0 for a low volume or no recording, 10 for a medium to high volume recording. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "10% chance to confuse the target.",
		onModifyMove: function (move, pokemon) {
			if (pokemon.template.species !== 'Chatot') delete move.secondaries;
		},
		secondary: {
			chance: 10,
			volatileStatus: 'confusion'
		},
		flags: {protect: 1, mirror: 1, sound: 1, distance: 1}
	},
	clamp: {
		inherit: true,
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move. Makes contact."
	},
	conversion: {
		inherit: true,
		desc: "The user's type changes to match the original type of one of its four moves besides this move, at random, but not either of its current types. Fails if the user cannot change its type, or if this move would only be able to select one of the user's current types.",
		shortDesc: "Changes user's type to match a known move.",
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

			if (!target.setType(type)) return false;
			this.add('-start', target, 'typechange', type);
		}
	},
	copycat: {
		inherit: true,
		desc: "The user uses the last move used by any Pokemon, including itself. Fails if no move has been used, or if the last move used was Assist, Bestow, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dragon Tail, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Rage Powder, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief, Transform, or Trick.",
		shortDesc: "Uses the last move used in the battle.",
		onHit: function (pokemon) {
			var noCopycat = {assist:1, bestow:1, chatter:1, circlethrow:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, dragontail:1, endure:1, feint:1, focuspunch:1, followme:1, helpinghand:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, naturepower:1, protect:1, ragepowder:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, switcheroo:1, thief:1, transform:1, trick:1};
			if (!this.lastMove || noCopycat[this.lastMove]) {
				return false;
			}
			this.useMove(this.lastMove, pokemon);
		}
	},
	cottonspore: {
		inherit: true,
		onTryHit: function () {},
		target: "normal"
	},
	covet: {
		inherit: true,
		pp: 40
	},
	crabhammer: {
		inherit: true,
		basePower: 90
	},
	defog: {
		inherit: true,
		desc: "Lowers one adjacent target's evasion by 1 stage. Whether or not the target's evasion was affected, the effects of Reflect, Light Screen, Safeguard, Mist, Spikes, Toxic Spikes, and Stealth Rock end for the target's side. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Ignores a target's Substitute, although a Substitute will still block the evasion lowering.",
		shortDesc: "Removes target's hazards, lowers evasion by 1.",
		onHit: function (pokemon) {
			if (!pokemon.volatiles['substitute']) this.boost({evasion:-1});
			var sideConditions = {reflect:1, lightscreen:1, safeguard:1, mist:1, spikes:1, toxicspikes:1, stealthrock:1};
			for (var i in sideConditions) {
				if (pokemon.side.removeSideCondition(i)) {
					this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: Defog', '[of] ' + pokemon);
				}
			}
		}
	},
	dracometeor: {
		inherit: true,
		basePower: 140
	},
	dragonpulse: {
		inherit: true,
		basePower: 90
	},
	echoedvoice: {
		inherit: true,
		flags: {protect: 1, mirror: 1, sound: 1}
	},
	energyball: {
		inherit: true,
		basePower: 80
	},
	extrasensory: {
		inherit: true,
		pp: 30
	},
	finalgambit: {
		inherit: true,
		desc: "Deals damage to one adjacent target equal to the user's current HP. If this move is successful, the user faints. Makes contact.",
		flags: {contact: 1, protect: 1}
	},
	fireblast: {
		inherit: true,
		basePower: 120
	},
	firepledge: {
		inherit: true,
		basePower: 50,
		basePowerCallback: function (target, source, move) {
			if (move.sourceEffect in {grasspledge:1, waterpledge:1}) {
				this.add('-combine');
				return 150;
			}
			return 50;
		}
	},
	firespin: {
		inherit: true,
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move."
	},
	flamethrower: {
		inherit: true,
		basePower: 95
	},
	followme: {
		inherit: true,
		priority: 3
	},
	frostbreath: {
		inherit: true,
		basePower: 40
	},
	furycutter: {
		inherit: true,
		basePower: 20,
		basePowerCallback: function (pokemon) {
			if (!pokemon.volatiles.furycutter) {
				pokemon.addVolatile('furycutter');
			}
			return 20 * pokemon.volatiles.furycutter.multiplier;
		},
		effect: {
			duration: 2,
			onStart: function () {
				this.effectData.multiplier = 1;
			},
			onRestart: function () {
				if (this.effectData.multiplier < 8) {
					this.effectData.multiplier <<= 1;
				}
				this.effectData.duration = 2;
			}
		}
	},
	futuresight: {
		inherit: true,
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
					name: "Future Sight",
					basePower: 100,
					category: "Special",
					flags: {},
					ignoreImmunity: false,
					type: 'Psychic'
				}
			};
			this.add('-start', source, 'move: Future Sight');
			return null;
		}
	},
	glare: {
		inherit: true,
		accuracy: 90
	},
	grasswhistle: {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1}
	},
	grasspledge: {
		inherit: true,
		basePower: 50,
		basePowerCallback: function (target, source, move) {
			if (move.sourceEffect in {waterpledge:1, firepledge:1}) {
				this.add('-combine');
				return 150;
			}
			return 50;
		}
	},
	growl: {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1}
	},
	growth: {
		inherit: true,
		pp: 40
	},
	gunkshot: {
		inherit: true,
		accuracy: 70
	},
	healbell: {
		inherit: true,
		flags: {protect: 1, mirror: 1, sound: 1}
	},
	healblock: {
		inherit: true,
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
				var disabledMoves = {healingwish:1, lunardance:1, rest:1, swallow:1, wish:1};
				var moves = pokemon.moveset;
				for (var i = 0; i < moves.length; i++) {
					if (disabledMoves[moves[i].id] || this.getMove(moves[i].id).heal) {
						pokemon.disableMove(moves[i].id);
					}
				}
			},
			onBeforeMovePriority: 6,
			onBeforeMove: function (pokemon, target, move) {
				var disabledMoves = {healingwish:1, lunardance:1, rest:1, swallow:1, wish:1};
				if (disabledMoves[move.id] || move.heal) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onResidualOrder: 17,
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'move: Heal Block');
			},
			onTryHeal: false
		}
	},
	healpulse: {
		inherit: true,
		heal: [1, 2],
		onHit: function () {}
	},
	heatwave: {
		inherit: true,
		basePower: 100
	},
	hex: {
		inherit: true,
		basePower: 50,
		basePowerCallback: function (pokemon, target) {
			if (target.status) return 100;
			return 50;
		}
	},
	hiddenpower: {
		inherit: true,
		basePower: 0,
		basePowerCallback: function (pokemon) {
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
	hurricane: {
		inherit: true,
		basePower: 120
	},
	hydropump: {
		inherit: true,
		basePower: 120
	},
	hypervoice: {
		inherit: true,
		flags: {protect: 1, mirror: 1, sound: 1}
	},
	icebeam: {
		inherit: true,
		basePower: 95
	},
	incinerate: {
		inherit: true,
		basePower: 30,
		desc: "Deals damage to all adjacent foes and destroys any Berry they may be holding.",
		shortDesc: "Destroys the foe(s) Berry.",
		onHit: function (pokemon, source) {
			var item = pokemon.getItem();
			if (item.isBerry && pokemon.takeItem(source)) {
				this.add('-enditem', pokemon, item.name, '[from] move: Incinerate');
			}
		}
	},
	knockoff: {
		inherit: true,
		basePower: 20,
		desc: "Deals damage to one adjacent target and causes it to drop its held item. This move cannot force Pokemon with the Ability Sticky Hold to lose their held item, or force a Giratina, an Arceus, or a Genesect to lose their Griseous Orb, Plate, or Drive, respectively. Items lost to this move cannot be regained with Recycle. Makes contact.",
		shortDesc: "Removes the target's held item.",
		onBasePower: function () {}
	},
	leafstorm: {
		inherit: true,
		basePower: 140
	},
	lick: {
		inherit: true,
		basePower: 20
	},
	lowsweep: {
		inherit: true,
		basePower: 60
	},
	magicroom: {
		inherit: true,
		priority: 0
	},
	magmastorm: {
		inherit: true,
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move.",
		basePower: 120
	},
	meanlook: {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1}
	},
	metalsound: {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1}
	},
	meteormash: {
		inherit: true,
		accuracy: 85,
		basePower: 100
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
					afteryou:1, assist:1, bestow:1, chatter:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, endure:1, feint:1, focuspunch:1, followme:1, freezeschok:1, helpinghand:1, iceburn:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, naturepower:1, protect:1, quash:1, quickguard:1, ragepowder:1, relicsong:1, secretsword:1, sketch:1, sleeptalk:1, snarl:1, snatch:1, snore:1, struggle:1, switcheroo:1, technoblast:1, thief:1, transform:1, trick:1, vcreate:1, wideguard:1
				};
				if (!noMetronome[move.id] && move.num < 560) {
					moves.push(move.id);
				}
			}
			var move = '';
			if (moves.length) move = moves[this.random(moves.length)];
			if (!move) return false;
			this.useMove(move, target);
		}
	},
	minimize: {
		inherit: true,
		desc: "Raises the user's evasion by 2 stages. After using this move, Stomp and Steamroller will have their power doubled if used against the user while it is active.",
		pp: 20,
		effect: {
			noCopy: true,
			onSourceModifyDamage: function (damage, source, target, move) {
				if (move.id in {'stomp':1, 'steamroller':1}) {
					return this.chainModify(2);
				}
			}
		}
	},
	moonlight: {
		inherit: true,
		type: "Normal"
	},
	mudsport: {
		num: 300,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the user is no longer active, all Electric-type attacks used by any active Pokemon have their power reduced to 0.33x. Fails if this move is already in effect; not stackable.",
		shortDesc: "Weakens Electric-type attacks to 1/3 their power.",
		id: "mudsport",
		name: "Mud Sport",
		pp: 15,
		priority: 0,
		flags: {},
		volatileStatus: 'mudsport',
		onTryHitField: function (target, source) {
			if (source.volatiles['mudsport']) return false;
		},
		effect: {
			noCopy: true,
			onStart: function (pokemon) {
				this.add("-start", pokemon, 'Mud Sport');
			},
			onBasePowerPriority: 1,
			onAnyBasePower: function (basePower, user, target, move) {
				if (move.type === 'Electric') return this.chainModify([0x548, 0x1000]); // The Mud Sport modifier is slightly higher than the usual 0.33 modifier (0x547)
			}
		},
		secondary: false,
		target: "all",
		type: "Ground"
	},
	muddywater: {
		inherit: true,
		basePower: 95
	},
	naturepower: {
		inherit: true,
		desc: "This move calls another move for use depending on the battle terrain. Earthquake in Wi-Fi battles.",
		shortDesc: "Attack changes based on terrain. (Earthquake)",
		onTryHit: function () {},
		onHit: function (pokemon) {
			this.useMove('earthquake', pokemon);
		},
		target: "self"
	},
	overheat: {
		inherit: true,
		basePower: 140
	},
	perishsong: {
		inherit: true,
		flags: {sound: 1, distance: 1}
	},
	pinmissile: {
		inherit: true,
		accuracy: 85,
		basePower: 14
	},
	poisonfang: {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'tox'
		}
	},
	poisongas: {
		inherit: true,
		accuracy: 80
	},
	poisonpowder: {
		inherit: true,
		onTryHit: function () {}
	},
	powergem: {
		inherit: true,
		basePower: 70
	},
	psychoshift: {
		inherit: true,
		accuracy: 90
	},
	psywave: {
		inherit: true,
		accuracy: 80
	},
	quickguard: {
		inherit: true,
		desc: "The user and its party members are protected from attacks with original priority greater than 0 made by other Pokemon, including allies, during this turn. This attack has a 1/X chance of being successful, where X starts at 1 and doubles each time this move is successfully used. X resets to 1 if this attack fails or if the user's last used move is not Detect, Endure, Protect, Quick Guard, or Wide Guard. If X is 256 or more, this move has a 1/(2^32) chance of being successful. Fails if the user moves last this turn or if this move is already in effect for the user's side. Priority +3.",
		stallingMove: true,
		onTryHitSide: function (side, source) {
			return this.willAct() && this.runEvent('StallMove', source);
		},
		onHitSide: function (side, source) {
			source.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function (target, source) {
				this.add('-singleturn', source, 'Quick Guard');
			},
			onTryHitPriority: 4,
			onTryHit: function (target, source, effect) {
				// Quick Guard only blocks moves with a natural positive priority
				// (e.g. it doesn't block 0 priority moves boosted by Prankster)
				if (effect && (effect.id === 'feint' || this.getMove(effect.id).priority <= 0)) {
					return;
				}
				this.add('-activate', target, 'Quick Guard');
				var lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			}
		}
	},
	ragepowder: {
		num: 476,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the end of the turn, all single-target attacks from the foe's team are redirected to the user if they are in range. Such attacks are redirected to the user before they can be reflected by Magic Coat or the Ability Magic Bounce, or drawn in by the Abilities Lightningrod or Storm Drain. Fails if it is not a double or triple battle. Priority +3.",
		shortDesc: "The foes' moves target the user on the turn used.",
		id: "ragepowder",
		name: "Rage Powder",
		pp: 20,
		priority: 3,
		flags: {},
		volatileStatus: 'followme',
		secondary: false,
		target: "self",
		type: "Bug"
	},
	relicsong: {
		inherit: true,
		flags: {protect: 1, mirror: 1, sound: 1}
	},
	roar: {
		inherit: true,
		accuracy: 100,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, authentic: 1}
	},
	rocktomb: {
		inherit: true,
		accuracy: 80,
		basePower: 50,
		pp: 10
	},
	round: {
		inherit: true,
		flags: {protect: 1, mirror: 1, sound: 1}
	},
	sandtomb: {
		inherit: true,
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move."
	},
	sacredsword: {
		inherit: true,
		pp: 20
	},
	scald: {
		inherit: true,
		thawsTarget: false
	},
	screech: {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1}
	},
	secretpower: {
		inherit: true,
		onHit: function () {},
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1
			}
		}
	},
	sing: {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1}
	},
	skillswap: {
		inherit: true,
		onHit: function (target, source) {
			var targetAbility = target.ability;
			var sourceAbility = source.ability;
			if (targetAbility === sourceAbility) {
				return false;
			}
			this.add('-activate', source, 'move: Skill Swap', this.getAbility(targetAbility), this.getAbility(sourceAbility), '[of] ' + target);
			source.setAbility(targetAbility);
			target.setAbility(sourceAbility);
		}
	},
	skullbash: {
		inherit: true,
		basePower: 100,
		pp: 15
	},
	skydrop: {
		inherit: true,
		onTryHit: function (target, source, move) {
			if (target.fainted) return false;
			if (source.removeVolatile(move.id)) {
				if (target !== source.volatiles['twoturnmove'].source) return false;

				if (target.hasType('Flying')) {
					this.add('-immune', target, '[msg]');
					this.add('-end', target, 'Sky Drop');
					return null;
				}
			} else {
				if (target.volatiles['substitute'] || target.side === source.side) {
					return false;
				}

				this.add('-prepare', source, move.name, target);
				source.addVolatile('twoturnmove', target);
				return null;
			}
		}
	},
	sleeppowder: {
		inherit: true,
		onTryHit: function () {}
	},
	smellingsalts: {
		inherit: true,
		basePower: 60,
		basePowerCallback: function (pokemon, target) {
			if (target.status === 'par') return 120;
			return 60;
		}
	},
	smog: {
		inherit: true,
		basePower: 20
	},
	snarl: {
		inherit: true,
		flags: {protect: 1, mirror: 1, sound: 1}
	},
	snore: {
		inherit: true,
		basePower: 40,
		flags: {protect: 1, mirror: 1, sound: 1}
	},
	spore: {
		inherit: true,
		onTryHit: function () {}
	},
	stormthrow: {
		inherit: true,
		basePower: 40
	},
	stringshot: {
		inherit: true,
		desc: "Lowers all adjacent foes' Speed by 1 stage. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the foe(s) Speed by 1.",
		boosts: {
			spe: -1
		}
	},
	strugglebug: {
		inherit: true,
		basePower: 30
	},
	stunspore: {
		inherit: true,
		onTryHit: function () {}
	},
	substitute: {
		inherit: true,
		effect: {
			onStart: function (target) {
				this.add('-start', target, 'Substitute');
				this.effectData.hp = Math.floor(target.maxhp / 4);
				delete target.volatiles['partiallytrapped'];
			},
			onTryPrimaryHitPriority: -1,
			onTryPrimaryHit: function (target, source, move) {
				if (target === source || move.flags['authentic']) {
					return;
				}
				var damage = this.getDamage(source, target, move);
				if (!damage && damage !== 0) {
					this.add('-fail', target);
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
				} else {
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
		}
	},
	submission: {
		inherit: true,
		pp: 25
	},
	supersonic: {
		inherit: true,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1}
	},
	surf: {
		inherit: true,
		basePower: 95
	},
	sweetkiss: {
		inherit: true,
		type: "Normal"
	},
	sweetscent: {
		inherit: true,
		desc: "Lowers all adjacent foes' evasion by 1 stage. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the foe(s) evasion by 1.",
		boosts: {
			evasion: -1
		}
	},
	swordsdance: {
		inherit: true,
		pp: 30
	},
	synchronoise: {
		inherit: true,
		basePower: 70,
		pp: 15
	},
	tailwind: {
		inherit: true,
		pp: 30
	},
	technoblast: {
		inherit: true,
		basePower: 85
	},
	thief: {
		inherit: true,
		basePower: 40,
		pp: 10
	},
	thunder: {
		inherit: true,
		basePower: 120
	},
	thunderbolt: {
		inherit: true,
		basePower: 95
	},
	uproar: {
		inherit: true,
		flags: {protect: 1, mirror: 1, sound: 1}
	},
	toxic: {
		inherit: true,
		onModifyMove: function () {}
	},
	vinewhip: {
		inherit: true,
		basePower: 35,
		pp: 15
	},
	wakeupslap: {
		inherit: true,
		basePower: 60,
		basePowerCallback: function (pokemon, target) {
			if (target.status === 'slp') return 120;
			return 60;
		}
	},
	waterpledge: {
		inherit: true,
		basePower: 50,
		basePowerCallback: function (target, source, move) {
			if (move.sourceEffect in {firepledge:1, grasspledge:1}) {
				this.add('-combine');
				return 150;
			}
			return 50;
		}
	},
	watersport: {
		num: 346,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the user is no longer active, all Fire-type attacks used by any active Pokemon have their power reduced to 0.33x. Fails if this move is already in effect; not stackable.",
		shortDesc: "Weakens Fire-type attacks to 1/3 their power.",
		id: "watersport",
		name: "Water Sport",
		pp: 15,
		priority: 0,
		flags: {},
		volatileStatus: 'watersport',
		onTryHitField: function (target, source) {
			if (source.volatiles['watersport']) return false;
		},
		effect: {
			noCopy: true,
			onStart: function (pokemon) {
				this.add("-start", pokemon, 'move: Water Sport');
			},
			onBasePowerPriority: 1,
			onAnyBasePower: function (basePower, user, target, move) {
				if (move.type === 'Fire') return this.chainModify([0x548, 0x1000]); // The Water Sport modifier is slightly higher than the usual 0.33 modifier (0x547)
			}
		},
		secondary: false,
		target: "all",
		type: "Water"
	},
	whirlwind: {
		inherit: true,
		accuracy: 100,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1}
	},
	wideguard: {
		inherit: true,
		desc: "The user and its party members are protected from damaging attacks made by other Pokemon, including allies, during this turn that target all adjacent foes or all adjacent Pokemon. This attack has a 1/X chance of being successful, where X starts at 1 and doubles each time this move is successfully used. X resets to 1 if this attack fails or if the user's last used move is not Detect, Endure, Protect, Quick Guard, or Wide Guard. If X is 256 or more, this move has a 1/(2^32) chance of being successful. Fails if the user moves last this turn or if this move is already in effect for the user's side. Priority +3.",
		stallingMove: true,
		onTryHitSide: function (side, source) {
			return this.willAct() && this.runEvent('StallMove', source);
		},
		onHitSide: function (side, source) {
			source.addVolatile('stall');
		}
	},
	whirlpool: {
		inherit: true,
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Power doubles if the target is using Dive. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move."
	},
	willowisp: {
		inherit: true,
		accuracy: 75
	},
	wonderroom: {
		inherit: true,
		priority: -7
	},
	wrap: {
		inherit: true,
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move. Makes contact."
	}
};
