export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	armorsong: {
		isNonstandard: "FNAF",
		num: -1,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Armor Song",
		pp: 40,
		priority: 0,
		flags: { snatch: 1, sound: 1, metronome: 1 },
		boosts: {
			def: 1,
            spd: 1,
		},
		target: "allies",
		type: "Steel",
		zMove: { boost: { def: 2, spd: 2 } },
		contestType: "Cool",
        desc: "Raises the Defense and Special Defense of the user and all allies 1 stages.",
		shortDesc: "Raises user's and ally's Defense and Special Defense by 1.",
	},
    badpizza: {
        isNonstandard: "FNAF",
		num: -2,
		accuracy: 75,
		basePower: 90,
		category: "Physical",
		name: "Bad Pizza",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
        desc: "Has a 100% chance to poison the target.",
		shortDesc: "100% chance to poison the target.",
	},
    balloons: {
        isNonstandard: "FNAF",
		num: -3,
		accuracy: 90,
		basePower: 50,
		category: "Physical",
		name: "Balloons",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, noparentalbond: 1 },
		multihit: 2,
		smartTarget: true,
		target: "normal",
		type: "Flying",
		maxMove: { basePower: 130 },
        desc: "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit. In Double Battles, this move attempts to hit the targeted Pokemon and its ally once each. If hitting one of these Pokemon would be prevented by immunity, protection, semi-invulnerability, an Ability, or accuracy, it attempts to hit the other Pokemon twice instead. If this move is redirected, it hits that target twice.",
		shortDesc: "Hits twice. Doubles: Tries to hit each foe once.",
	},
    bashjam: {
        isNonstandard: "FNAF",
		num: -4,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Bash Jam",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		target: "allAdjacentFoes",
		type: "Ghost",
		contestType: "Cool",
        desc: "No additional effect.",
		shortDesc: "No additional effect. Hits adjacent foes.",
	},
    birthday: {
        isNonstandard: "FNAF",
		num: -5,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Birthday",
		pp: 10,
		priority: 0,
		flags: { bypasssub: 1, allyanim: 1, metronome: 1 },
		boosts: {
			atk: 1,
			def: 1,
			spe: 1,
		},
		target: "adjacentAlly",
		type: "Normal",    
        desc: "Raises the target's Attack, Defense, and Speed by 1 stage.",
		shortDesc: "Raises the target's Attack, Defense, Speed by 1.",
    },
    superbite: {
        isNonstandard: "FNAF",
        num: -6,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Super Bite",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Dark",
		contestType: "Tough",
        desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to make the target flinch.",
    },
    cosmicsong: {
        isNonstandard: "FNAF",
		num: -7,
		accuracy: 100,
		basePower: 25,
		category: "Special",
		name: "Cosmic Song",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, sound: 1, bypasssub: 1 },
		multihit: [2, 5],
		target: "normal",
		type: "Fairy",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
		contestType: "Beautiful",
        desc: "Hits two to five times. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If the user has the Skill Link Ability, this move will always hit five times. If the user is holding Loaded Dice, this move will hit 4-5 times.",
		shortDesc: "Hits 2-5 times in one turn.",
    },
    cupcake: {
        isNonstandard: "FNAF",
		num: -8,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Cupcake",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1, bypasssub: 1 },
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, 0.25));
			return pokemon.cureStatus() || success;
		},
		target: "allies",
		type: "Normal",
		desc: "Each Pokemon on the user's side restores 1/4 of its maximum HP, rounded half up, and has its status condition cured.",
		shortDesc: "User and allies: healed 1/4 max HP, status cured.",
    },
    endoarmy: {
        isNonstandard: "FNAF",
        num: -9,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		name: "Endo Army",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, bullet: 1 },
		multihit: 3,
		target: "allAdjacentFoes",
		type: "Steel",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
        desc: "Hits adjacent foes three times.",
		shortDesc: "Hits adjacent foes 3 times.",
    },
    esckey: {
        isNonstandard: "FNAF",
        num: -10,
		accuracy: 30,
		basePower: 0,
		category: "Special",
		name: "Esc Key",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		ohko: true,
		target: "normal",
		type: "Ghost",
		zMove: { basePower: 180 },
		maxMove: { basePower: 130 },
		contestType: "Cool",
		desc: "Deals damage to the target equal to the target's maximum HP. Ignores accuracy and evasiveness modifiers. This attack's accuracy is equal to (user's level - target's level + 30)%, and fails if the target is at a higher level. Pokemon with the Sturdy Ability are immune.",
		shortDesc: "OHKOs the target. Fails if user's lower level.",
    },
    eyebeam: {
        isNonstandard: "FNAF",
        num: -11,
		accuracy: 80,
		basePower: 100,
		category: "Special",
		name: "Eye Beam",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 20,
			onHit(target, source) {
				const status = this.sample(['brn', 'par']);
				target.trySetStatus(status, source);
			},
		},
		critRatio: 2,
		target: "normal",
		type: "Electric",
		contestType: "Tough",
		desc: "Has a higher chance for a critical hit. Has a 20% chance to either burn or paralyze the target.",
		shortDesc: "High crit ratio. 20% chance to paralyze or burn.",
    },
    freddles: {
        isNonstandard: "FNAF",
		num: -12,
		accuracy: 90,
		basePower: 25,
		category: "Physical",
		name: "Freddles",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		target: "allAdjacentFoes",
		type: "Dark",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
		contestType: "Tough",
        desc: "Hits adjacent foes two to five times. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times. If the user is holding Loaded Dice, this move will hit 4-5 times.",
		shortDesc: "Hits adjacent foes 2-5 times in one turn.",
	},
    giftboxes: {
        isNonstandard: "FNAF",
        num: -13,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Gift Boxes",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: { heal: 1, nosketch: 1 },
		onTryHit(source) {
			if (!source.side.pokemon.filter(ally => ally.fainted).length) {
				return false;
			}
		},
		slotCondition: 'revivalblessing',
		// No this not a real switchout move
		// This is needed to trigger a switch protocol to choose a fainted party member
		// Feel free to refactor
		selfSwitch: true,
		condition: {
			duration: 1,
			// reviving implemented in side.ts, kind of
		},
		target: "self",
		type: "Normal",
        desc: "A fainted party member is selected and revived with 1/2 its max HP, rounded down. Fails if there are no fainted party members.",
		shortDesc: "Revives a fainted Pokemon to 50% HP.",
    },
    gloomballoon: {
        isNonstandard: "FNAF",
        num: -14,
		accuracy: 90,
		basePower: 50,
		category: "Physical",
		name: "Gloom Balloon",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		boosts: {
			atk: -2,
		},
		target: "normal",
		type: "Ghost",
		zMove: { boost: { def: 1 } },
		contestType: "Tough",
        desc: "Lowers the target's Attack by 2 stages.",
		shortDesc: "Lowers the target's Attack by 2.",    
    },
    gloomsong: {
        isNonstandard: "FNAF",
        num: -15,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Gloom Song",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Ghost",
		contestType: "Tough",
        desc: "Has a 100% chance to lower the target's Attack by 1 stage.",
		shortDesc: "100% chance to lower the foe(s) Attack by 1.",
    },
    happyjam: {
        isNonstandard: "FNAF",
	    num: -16,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Happy Jam",
		pp: 10,
		priority: 0,
		flags: { heal: 1, allyanim: 1, metronome: 1, sound: 1, bypasssub: 1},
		onHit(target, source) {
			let success = false;
			if (source.hasAbility('punkrock')) {
				success = !!this.heal(this.modify(target.baseMaxhp, 0.75));
			} else {
				success = !!this.heal(Math.ceil(target.baseMaxhp * 0.5));
			}
			if (success && !target.isAlly(source)) {
				target.staleness = 'external';
			}
			if (!success) {
				this.add('-fail', target, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
		target: "adjacentAlly",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
        desc: "The target restores 1/2 of its maximum HP, rounded half up. If the user has the Punk Rock Ability, the target instead restores 3/4 of its maximum HP, rounded half down.",
		shortDesc: "Heals ally by 50% of its max HP. Punk Rock: 75%",
    },
    haunting: {
        isNonstandard: "FNAF",
        num: -17,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Haunting",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			status: 'par',
		},
		target: "normal",
		type: "Ghost",
		contestType: "Cute",
        desc: "Has a 100% chance to paralyze the target.",
		shortDesc: "100% chance to paralyze the target.",
    },
    hook: {
        isNonstandard: "FNAF",
    	num: -18,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Hook",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 50,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Tough",
        desc: "Has a 50% chance to raise the user's Attack by 1 stage.",
		shortDesc: "50% chance to raise the user's Attack by 1.",
    },
    hotcheese: {
        isNonstandard: "FNAF",
		num: -19,
		accuracy: 75,
		basePower: 90,
		category: "Special",
		name: "Hot Cheese",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
        secondary: {
			chance: 30,
			status: 'brn',
		},
		volatileStatus: 'partiallytrapped',
		target: "normal",
		type: "Normal",
		contestType: "Tough",
        desc: "Has a 30% chance to burn the target. Prevents the target from switching for four or five turns (seven turns if the user is holding Grip Claw). Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Mortal Spin, Rapid Spin, or Substitute successfully. This effect is not stackable or reset by using this or another binding move.",
		shortDesc: "30% burn chance. Traps and damages target for 4-5 turns.",
    },
    jumpscare: {
        isNonstandard: "FNAF",
        num: -20,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Jumpscare",
		pp: 10,
		priority: 3,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTry(source) {
			if (source.activeMoveActions > 1) {
				this.hint("Jumpscare only works on your first turn out.");
				return false;
			}
		},
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Ghost",
		contestType: "Cute",
        desc: "Has a 100% chance to make the target flinch. Fails unless it is the user's first turn on the field.",
		shortDesc: "Hits first. First turn out only. 100% flinch chance.",
    },
    megabite: {
        isNonstandard: "FNAF",
        num: -21,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Mega Bite",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Dark",
		contestType: "Tough",
        desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to make the target flinch.",
    },
    mictoss: {
        isNonstandard: "FNAF",
		num: -21,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		name: "Mic Toss",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "allAdjacentFoes",
		type: "Steel",
		contestType: "Tough",
        desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to make the target flinch.",
	},
    mimicball: {
        isNonstandard: "FNAF",
		num: -22,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Mimic Ball",
		pp: 20,
		priority: 0,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onHit(pokemon) {
			let move: Move | ActiveMove | null = this.lastMove;
			if (!move) return;

			if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
			if (move.flags['failcopycat'] || move.isZ || move.isMax) {
				return false;
			}
			this.actions.useMove(move.id, pokemon);
		},
		callsMove: true,
		target: "self",
		type: "Normal",
		zMove: { boost: { accuracy: 1 } },
		contestType: "Cute",
        desc: "The user uses the last move used by any Pokemon, including itself. Fails if no move has been used, or if the last move used was Assist, Baneful Bunker, Beak Blast, Behemoth Bash, Behemoth Blade, Belch, Bestow, Blazing Torque, Celebrate, Chatter, Circle Throw, Combat Torque, Copycat, Counter, Covet, Destiny Bond, Detect, Dragon Tail, Dynamax Cannon, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Hold Hands, King's Shield, Magical Torque, Mat Block, Me First, Metronome, Mimic, Mirror Move, Nature Power, Noxious Torque, Protect, Rage Powder, Roar, Shell Trap, Sketch, Sleep Talk, Snatch, Spiky Shield, Spotlight, Struggle, Switcheroo, Tera Starstorm, Thief, Transform, Trick, Whirlwind, or Wicked Torque.",
		shortDesc: "Uses the last move used in the battle.",
	},
    munchies: {
        isNonstandard: "FNAF",
		num: -23,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Munchies",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		target: "normal",
		type: "Dark",
		contestType: "Cute",
		desc: "Prevents the target from switching for four or five turns (seven turns if the user is holding Grip Claw). Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Mortal Spin, Rapid Spin, or Substitute successfully. This effect is not stackable or reset by using this or another binding move.",
        shortDesc: "Traps and damages the target for 4-5 turns.",
    },
    mysterybox: {
        isNonstandard: "FNAF",
        num: -24,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Mystery Box",
		pp: 20,
		priority: -6,
		flags: { reflectable: 1, mirror: 1,  allyanim: 1, metronome: 1, noassist: 1, failcopycat: 1 },
		forceSwitch: true,
        selfSwitch: true,
		target: "normal",
		type: "Normal",
		zMove: { effect: 'healreplacement' },
		contestType: "Cool",
        desc: "If both the user and the target have not fainted, the target is forced to switch out and be replaced with a random unfainted ally. This effect fails if the target used Ingrain previously, has the Suction Cups Ability, or this move hit a substitute. The user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members.",
		shortDesc: "Forces target to switch to random ally. User switches out.",
    },
    neonwall: {
        isNonstandard: "FNAF",
        num: -25,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Neon Wall",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		sideCondition: 'neonwall',
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 5;
				}
				return 3;
			},
			onAnyModifyDamage(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target)) {
					if ((target.side.getSideCondition('reflect') && this.getCategory(move) === 'Physical') ||
						(target.side.getSideCondition('lightscreen') && this.getCategory(move) === 'Special') ||
						(target.side.getSideCondition('auroraveil'))) {
						return;
					}
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Neon Wall weaken');
						if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
						return this.chainModify(0.5);
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Neon Wall');
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 10,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Neon Wall');
			},
		},
		target: "allySide",
		type: "Electric",
		zMove: { boost: { spe: 1 } },
		contestType: "Beautiful",
        desc: "For 3 turns, the user and its party members take 0.5x damage from physical and special attacks, or 0.66x damage if in a Double Battle; does not reduce damage further with Reflect, Light Screen, or Aurora Veil. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break, Psychic Fangs, or Defog. Brick Break and Psychic Fangs remove the effect before damage is calculated. Lasts for 5 turns if the user is holding Light Clay. Fails unless the weather is Snow.",
		shortDesc: "For 3 turns, damage to allies halved.",
    },
    partyfavors: {
        isNonstandard: "FNAF",
        num: -26,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Party Favors",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, defrost: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		target: "allAdjacentFoes",
		type: "Normal",
        desc: "Hits adjacent foes. The user recovers 1/2 the HP lost by the target(s), rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "Hits adjacent foes. Recovers 50% dmg dealt.",
    },
    pizzawheel: {
        isNonstandard: "FNAF",
        num: -27,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Pizza Wheel",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		target: "normal",
		type: "Steel",
		contestType: "Tough",
        desc: "No additional effect.",
		shortDesc: "No additional effect.",
    },
    poppers: {
        isNonstandard: "FNAF",
        num: -28,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Poppers",
		pp: 10,
		priority: 0,
		flags: { allyanim: 1, metronome: 1, futuremove: 1 },
		ignoreImmunity: true,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				move: 'poppers',
				source,
				moveData: {
					id: 'poppers',
					name: "Poppers",
					accuracy: 100,
					basePower: 120,
					category: "Physical",
					priority: 0,
					flags: { allyanim: 1, metronome: 1, futuremove: 1 },
                    secondary: {
			            chance: 30,
			            volatileStatus: 'flinch',
		            },
					ignoreImmunity: false,
					effectType: 'Move',
					type: 'Fire',
				},
			});
			this.add('-start', source, 'move: Poppers');
			return this.NOT_FAIL;
		},
		target: "normal",
		type: "Fire",
		contestType: "Clever",
        desc: "Deals damage two turns after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move or Doom Desire is already in effect for the target's position. Has a 30% chance to make the target flinch when the damage is dealt.",
		shortDesc: "Hits two turns after being used. 30% chance to flinch.",
	},
    powersong: {
        isNonstandard: "FNAF",
		num: -29,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Power Song",
		pp: 40,
		priority: 0,
		flags: { snatch: 1, sound: 1, metronome: 1 },
		boosts: {
			atk: 1,
            spa: 1,
		},
		target: "allies",
		type: "Fighting",
		zMove: { boost: { atk: 2, spa: 2 } },
		contestType: "Cool",
        desc: "Raises the Attack and Special Attack of the user and all allies 1 stages.",
		shortDesc: "Raises user's and ally's Attack and Sp. Atk by 1.",
	},
    prizeball: {
        isNonstandard: "FNAF",
        num: -30,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Prize Ball",
		pp: 10,
		priority: 0,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onHit(target) {
			// Filter for metronome-valid, single-target attacking moves
			let validMoves = this.dex.moves.all().filter(move => (
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable') &&
				move.flags['metronome'] && move.target === 'normal' &&
                (move.category === 'Physical' || move.category === 'Special')
			));
			
			// Further filter for moves super effective on the target
			const superEffectiveMoves = validMoves.filter(move => {
				for (const targetType of target.types) {
					if (this.dex.getEffectiveness(move.type, targetType) > 1) {
						return true;
					}
				}
				return false;
			});
			
			// Use super effective moves if available, otherwise fall back to all valid moves
			const movesToChooseFrom = superEffectiveMoves.length > 0 ? superEffectiveMoves : validMoves;
			
			let randomMove = '';
			if (movesToChooseFrom.length) {
				movesToChooseFrom.sort((a, b) => a.num - b.num);
				randomMove = this.sample(movesToChooseFrom).id;
			}
			if (!randomMove) return false;
			this.actions.useMove(randomMove, target);
		},
		callsMove: true,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
        desc: "A random single-target damaging move that is super effective against the target is selected for use, other than After You, Apple Acid, Armor Cannon, Assist, Astral Barrage, Aura Wheel, Baneful Bunker, Beak Blast, Behemoth Bash, Behemoth Blade, Belch, Bestow, Blazing Torque, Body Press, Branch Poke, Breaking Swipe, Celebrate, Chatter, Chilling Water, Chilly Reception, Clangorous Soul, Collision Course, Combat Torque, Comeuppance, Copycat, Counter, Covet, Crafty Shield, Decorate, Destiny Bond, Detect, Diamond Storm, Doodle, Double Iron Bash, Double Shock, Dragon Ascent, Dragon Energy, Drum Beating, Dynamax Cannon, Electro Drift, Endure, Eternabeam, False Surrender, Feint, Fiery Wrath, Fillet Away, Fleur Cannon, Focus Punch, Follow Me, Freeze Shock, Freezing Glare, Glacial Lance, Grav Apple, Helping Hand, Hold Hands, Hyper Drill, Hyperspace Fury, Hyperspace Hole, Ice Burn, Instruct, Jet Punch, Jungle Healing, King's Shield, Life Dew, Light of Ruin, Magical Torque, Make It Rain, Mat Block, Me First, Meteor Assault, Metronome, Mimic, Mind Blown, Mirror Coat, Mirror Move, Moongeist Beam, Nature Power, Nature's Madness, Noxious Torque, Obstruct, Order Up, Origin Pulse, Overdrive, Photon Geyser, Plasma Fists, Population Bomb, Pounce, Power Shift, Precipice Blades, Protect, Pyro Ball, Quash, Quick Guard, Rage Fist, Rage Powder, Raging Bull, Raging Fury, Relic Song, Revival Blessing, Ruination, Salt Cure, Secret Sword, Shed Tail, Shell Trap, Silk Trap, Sketch, Sleep Talk, Snap Trap, Snarl, Snatch, Snore, Snowscape, Spectral Thief, Spicy Extract, Spiky Shield, Spirit Break, Spotlight, Springtide Storm, Steam Eruption, Steel Beam, Strange Steam, Struggle, Sunsteel Strike, Surging Strikes, Switcheroo, Techno Blast, Tera Starstorm, Thief, Thousand Arrows, Thousand Waves, Thunder Cage, Thunderous Kick, Tidy Up, Trailblaze, Transform, Trick, Twin Beam, V-create, Wicked Blow, Wicked Torque, or Wide Guard.",
		shortDesc: "Picks a random super effective single-target move.",
    },
    rainyday: {
        isNonstandard: "FNAF",
        num: -31,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Rainy Day",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		secondary: {
			chance: 100,
			boosts: {
				def: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Beautiful",
        desc: "Has a 100% chance to lower the target's Defense by 1 stage.",
		shortDesc: "100% chance to lower the foe(s) Defense by 1.",
    },
    regensong: {
        isNonstandard: "FNAF",
		num: -32,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Regen Song",
		pp: 20,
		priority: 0,
		flags: { sound: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'regensong',
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Regen Song');
			},
			onResidualOrder: 6,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 16);
			},
		},
		target: "allies",
		type: "Normal",
		zMove: { boost: { def: 1 } },
		contestType: "Beautiful",
        desc: "Each of the user and its allies have 1/16 of their maximum HP, rounded down, restored at the end of each turn while that Pokemon remains active. If Big Root is held by the user or an ally, the HP recovered by that Pokemon is 1.3x normal, rounded half down. If the user or an ally uses Baton Pass, the replacement will receive the healing effect.",
		shortDesc: "User and Allies recovers 1/16 max HP per turn.",
	},
    sludge: {
        isNonstandard: "FNAF",
        num: -33,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		name: "Sludge",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Poison",
		contestType: "Beautiful",
        desc: "Has a 100% chance to lower the target's Speed by 1 stage.",
		shortDesc: "100% chance to lower the foe(s) Speed by 1.",
    },
    speedsong: {
        isNonstandard: "FNAF",
		num: -34,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Speed Song",
		pp: 40,
		priority: 0,
		flags: { snatch: 1, sound: 1, metronome: 1 },
		boosts: {
            spe: 1,
		},
		target: "allies",
		type: "Electric",
		zMove: { boost: { atk: 2, spa: 2 } },
		contestType: "Cool",
        desc: "Raises the Speed of the user and all allies 1 stages.",
		shortDesc: "Raises user's and ally's Speed by 1.",
	},
    springlocks: {
        isNonstandard: "FNAF",
        num: -35,
		accuracy: 70,
		basePower: 130,
		category: "Physical",
		name: "Springlocks",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
			case 'raindance':
			case 'primordialsea':
				move.accuracy = true;
				break;
			}
        },
        secondary: {
            chance: 50,
            volatileStatus: 'flinch',
        },
		target: "normal",
		type: "Steel",
		contestType: "Tough",
        desc: "Has a 50% chance to flinch the target. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy",
		shortDesc: "50% chance to flinch. Can't miss in rain",
    },
    toxicballoon: {
        isNonstandard: "FNAF",
		num: -36,
		accuracy: 90,
		basePower: 50,
		category: "Physical",
		name: "Toxic Balloon",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, noparentalbond: 1 },
        secondary: {
			chance: 100,
			status: 'psn',
        },
		target: "normal",
		type: "Flying",
		maxMove: { basePower: 130 },
        desc: "Has a 100% chance to poison the target.",
		shortDesc: "100% chance to poison the target.",
    },
    toxicbite: {
        isNonstandard: "FNAF",
		num: -37,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Bad Pizza",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondary: {
			chance: 100,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
        desc: "Has a 100% chance to poison the target.",
		shortDesc: "100% chance to poison the target.",
	},
    unscrew: {
        isNonstandard: "FNAF",
        num: -38,
		accuracy: 30,
		basePower: 0,
		category: "Physical",
		name: "Unscrew",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
        ohko: 'Dark',
		target: "normal",
		type: "Dark",
		zMove: { basePower: 180 },
		maxMove: { basePower: 130 },
		contestType: "Beautiful",
		desc: "Deals damage to the target equal to the target's maximum HP. Ignores accuracy and evasiveness modifiers. This attack's accuracy is equal to (user's level - target's level + X)%, where X is 30 if the user is an Dark type and 20 otherwise, and fails if the target is at a higher level. Dark-type Pokemon and Pokemon with the Sturdy Ability are immune.",
		shortDesc: "OHKOs non-Dark targets. Fails if user's lower level.",
    },
    waterhose: {
		num: -39,
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		isNonstandard: "FNAF",
		name: "Water Hose",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryHit(target) {
			if (target.hp >= target.maxhp / 2) {
				return false;
			}
		},
		onDamage(damage, target, source, effect) {
			return target.maxhp;
		},
		target: "normal",
		type: "Water",
		contestType: "Cool",
        desc: "Deals damage to the target equal to the target's maximum HP, rounded down. This move fails if the target is at or above 50% of its maximum HP.",
        shortDesc: "OHKOs target below 50% HP. Fails otherwise.",
    },
   slasher: {
       isNonstandard: "FNAF",
		num: -40,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Slasher",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, failinstruct: 1, slicing: 1 },
		self: {
			volatileStatus: 'lockedmove',
		},
		target: "randomNormal",
		type: "Steel",
		contestType: "Tough",    
        desc: "The user spends two or three turns locked into this move and becomes confused immediately after its move on the last turn of the effect if it is not already. This move targets an opposing Pokemon at random on each turn. If the user is prevented from moving, is asleep at the beginning of a turn, or the attack is not successful against the target on the first turn of the effect or the second turn of a three-turn effect, the effect ends without causing confusion. If this move is called by Sleep Talk and the user is asleep, the move is used for one turn and does not confuse the user.",
		shortDesc: "Lasts 2-3 turns. Confuses the user afterwards.",
    },
    jackobomb: {
        isNonstandard: "FNAF",
	    num: -41,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Jack-O-Bomb",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
        desc: "Has a 10% chance to burn the target.",
		shortDesc: "10% chance to burn the target.",
    } ,
    buzzsaw: {
        isNonstandard: "FNAF",
        num: -42,
		accuracy: 80,
		basePower: 100,
		category: "Physical",
		name: "Buzzsaw",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		ignoreEvasion: true,
        ignoreDefensive: true,
		target: "normal",
		type: "Steel",
		contestType: "Cool",
		desc: "Ignores the target's stat stage changes, including evasiveness.",
		shortDesc: "Ignores the target's stat stage changes.",
    },
    fourthwall: {
        isNonstandard: "FNAF",
        num: -43,
		accuracy: true,
		basePower: 90,
		category: "Special",
		name: "Fourth Wall",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1},
        ignoreDefensive: true,
		target: "normal",
		type: "Dark",
		contestType: "Cool",
		desc: "Ignores the target's stat stage changes, including evasiveness. This move does not check accuracy.",
		shortDesc: "Does not check accuracy. Ignores target's stat changes.",
    },
    bubblebreath: {
        isNonstandard: "FNAF",
        num: -44,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Bubble Breath",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
        desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
    },
    megavirus: {
        isNonstandard: "FNAF",
        num: -45,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		overrideDefensiveStat: 'def',
		name: "Mega Virus",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		target: "normal",
		type: "Electric",
		contestType: "Beautiful",
        desc: "Deals damage to the target based on its Defense instead of Special Defense.",
		shortDesc: "Damages target based on Defense, not Sp. Def.",
    },

    givegiftsgivelife: {
        isNonstandard: "FNAF",
        num: -46,
		accuracy: true,
		basePower: 0,
		category: "Status",
        name: "Give Gifts, Give Life",
        pp: 5,
        priority: 0,
        flags: { reflectable: 1, mirror: 1, metronome: 1 },
		onHit(target, source, move) {
            target.setType(target.getTypes(true).map(type => type === "Ghost" ? "???" : type));
            this.add('-start', target, 'typechange', target.getTypes().join('/'), '[from] move: Give Gifts, Give Life');
			return target.addVolatile('trapped', source, move, 'trapper');
		},
        target: "allAdjacentFoes",
		type: "Ghost",
		zMove: { boost: { spd: 1 } },
		contestType: "Beautiful",
        desc: "Foe's Ghost type becomes typeless. Prevents the target from switching out. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field.",
		shortDesc: "Foes lose Ghost type and can't switch out.",
    },
    vent: {
        isNonstandard: "FNAF",
		num: -47,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		name: "Vent",
		pp: 5,
		priority: 1,
		flags: { contact: 1, charge: 1, mirror: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		condition: {
			duration: 2,
			onInvulnerability: false,
		},
		target: "normal",
		type: "Dark",
		contestType: "Cool",  
		desc: "This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Usually goes first. Disappears turn 1. Hits turn 2.",  
    },
    distractingvoice: {
        isNonstandard: "FNAF",
		num: -48,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Distracting Voice",
		pp: 20,
		priority: 2,
		flags: { noassist: 1, failcopycat: 1, sound: 1 },
		volatileStatus: 'distractingvoice',
		onTry(source) {
			return this.activePerHalf > 1;
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Distracting Voice');
			},
			onFoeRedirectTargetPriority: 1,
			onFoeRedirectTarget(target, source, source2, move) {
				const distractingVoiceUser = this.effectState.target;
				if (distractingVoiceUser.isSkyDropped()) return;

				if ((!source.hasAbility('soundproof') || this.suppressingAbility(source)) 
                    && this.validTarget(distractingVoiceUser, source, move.target
                )) {
					if (move.smartTarget) move.smartTarget = false;
					this.debug("Distracting Voice redirected target of move");
					return distractingVoiceUser;
				}
			},
		},
		target: "self",
		type: "Fairy",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
        desc: "Until the end of the turn, all single-target attacks from the opposing side are redirected to the user. Such attacks are redirected to the user before they can be reflected by Magic Coat or the Magic Bounce Ability, or drawn in by the Lightning Rod or Storm Drain Abilities. Fails if it is not a Double Battle or Battle Royal. This effect is ignored while the user is under the effect of Sky Drop.",
		shortDesc: "The foes' moves target the user on the turn used.",
    },
};
