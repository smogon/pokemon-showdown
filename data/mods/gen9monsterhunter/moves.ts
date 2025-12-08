export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	magnalance: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Magna Lance",
		shortDesc: "Usually goes first. Fails if target is not attacking.",
		pp: 5,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTry(source, target) {
			const action = this.queue.willMove(target);
			const move = action?.choice === 'move' ? action.move : null;
			if (!move || (move.category === 'Status' && move.id !== 'mefirst') || target.volatiles['mustrecharge']) {
				return false;
			}
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Torch Song", target);
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Clever",
	},
	eggbarrage: {
		accuracy: 90,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			return 20 * move.hit;
		},
		category: "Physical",
		name: "Egg Barrage",
		shortDesc: "Hits 3 times. Each hit can miss, but power rises.",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 3,
		multiaccuracy: true,
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 120 },
		maxMove: { basePower: 140 },
	},
	glidebomb: {
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		name: "Glide Bomb",
		shortDesc: "Hits 2-5 times in one turn.",
		pp: 30,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Fire",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
		contestType: "Beautiful",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fire Lash", target);
		},
	},
	dragonator: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Dragonator",
		shortDesc: "Cannot be used on consecutive turns. Super-Effective on Dragon-Types. 10% Flinch.",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, cantusetwice: 1 },
		onEffectiveness(typeMod, target, type) {
			if (type === 'Dragon') return 1;
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Gigaton Hammer", target);
		},
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Steel",
		contestType: "Beautiful",
	},
	devour: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Devour",
		shortDesc: "Heals 25% HP. If holding a berry, eats it and heals 50%.",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onHit(pokemon) {
			const item = pokemon.getItem().isBerry;
			if (item) {
				// Heal 50% if berry is present
				this.heal(pokemon.baseMaxhp / 2, pokemon);
				pokemon.eatItem(true);
				this.add('-message', `${pokemon.name} devoured its berry and restored more HP!`);
			} else {
				// Heal 25% if no berry
				this.heal(pokemon.baseMaxhp / 4, pokemon);
				this.add('-message', `${pokemon.name} devoured nothing... but still restored some HP!`);
			}
		},
		secondary: null,
		target: "self",
		type: "Normal",
		contestType: "Beautiful",
	},
	wretchedwater: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Wretched Water",
		shortDesc: "30% chance to paralyze the target.",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Cool",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Whirlpool", target);
		},
	},
	cutwingbarrage: {
		accuracy: 95,
		basePower: 90,
		category: "Physical",
		name: "Cutwing Barrage",
		shortDesc: "30% chance to inflict bleed.",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, slicing: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'bleeding',
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Aerial Ace", target);
		},
		target: "normal",
		type: "Flying",
		contestType: "Cool",
	},
	thunderrush: {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Thunder Rush",
		shortDesc: "Always crits.",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		willCrit: true,
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Supercell Slam", target);
		},
	},
	frenzyslam: {
		accuracy: 95,
		basePower: 80,
		category: "Special",
		name: "Frenzy Slam",
		shortDesc: "Summons Reflect. Only usable by Dark-types.",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			sideCondition: 'reflect',
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Kowtow Cleave", target);
		},
		onTry(source, target, move) {
			if (!source.hasType('Dark')) {
				this.add('-fail', source, 'move: Frenzy Slam');
				return null;
			}
		},
	},
	bewitchedbubble: {
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Bewitched Bubble",
		shortDesc: "User recovers 50% of the damage dealt.",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Clever",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Chilling Water", target);
		},
	},
	creepynoise: {
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Creepy Noise",
		shortDesc: "100% chance to paralyze the foe.",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		secondary: {
			chance: 100,
			status: 'par',
		},
		target: "normal",
		type: "Bug",
		contestType: "Clever",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bug Buzz", target);
		},
	},
	arcticshriek: {
		accuracy: 90,
		basePower: 100,
		category: "Special",
		name: "Arctic Shriek",
		shortDesc: "Eliminates all stat changes.",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		onHit() {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
			}
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Freeze-Dry", target);
		},
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Clever",
	},
	cloakingglow: {
		accuracy: 95,
		basePower: 80,
		category: "Special",
		name: "Cloaking Glow",
		shortDesc: "Summons Light Screen.",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			sideCondition: 'lightscreen',
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Luster Purge", target);
		},
	},
	mossbomb: {
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		name: "Moss Bomb",
		shortDesc: "Summons Leech Seed.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onHit(target, source) {
			if (target.hasType('Grass')) return null;
			target.addVolatile('leechseed', source);
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Seed Bomb", target);
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	magmasurge: {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Magma Surge",
		shortDesc: "100% chance to burn the foe.",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, defrost: 1 },
		secondary: {
			chance: 100,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Clever",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flame Wheel", target);
		},
	},
	apexburst: {
		accuracy: 85,
		basePower: 110,
		category: "Special",
		name: "Apex Burst",
		shortDesc: "Cures the user's party of all status conditions.",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			onHit(pokemon, source, move) {
				this.add('-activate', source, 'move: Aromatherapy');
				for (const ally of source.side.pokemon) {
					if (ally !== source && (ally.volatiles['substitute'] && !move.infiltrates)) {
						ally.cureStatus();
					}
				}
			},
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fleur Cannon", target);
			this.add('-anim', source, "Aromatherapy", source);
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Clever",
	},
	frenzypulse: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Frenzy Pulse",
		shortDesc: "Lowers SpA by 1; Raises Spe by 1.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		selfBoost: {
			boosts: {
				spa: -1,
				spe: +1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Strange Steam", target);
		},
	},
	psychocrush: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Psycho Crush",
		shortDesc: "Summons Gravity.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			pseudoWeather: 'gravity',
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Psystrike", target);
		},
	},
	biocharge: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Biocharge",
		shortDesc: "Raises the user's Sp. Atk by 3. Lowest priority.",
		pp: 5,
		priority: -6,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			spa: 3,
		},
		secondary: null,
		target: "self",
		type: "Bug",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Parabolic Charge", source);
		},
	},
	heatbeam: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		overrideDefensiveStat: 'spd',
		name: "Heat Beam",
		shortDesc: "Damages target based on Sp. Def, not Defense.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Heat Wave", target);
		},
	},
	boltbreath: {
		accuracy: 100,
		basePower: 70,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				this.debug('Bolt Breath damage boost');
				return move.basePower * 2;
			}
			this.debug('Bolt Breath NOT boosted');
			return move.basePower;
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Wildbolt Storm", target);
		},
		category: "Special",
		name: "Bolt Breath",
		shortDesc: "Power doubles if the user moves before the target.",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Electric",
	},
	cyclonerend: {
		accuracy: 100,
		basePower: 70,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				this.debug('Cyclone Rend damage boost');
				return move.basePower * 2;
			}
			this.debug('Cyclone Rend NOT boosted');
			return move.basePower;
		},
		category: "Special",
		name: "Cyclone Rend",
		shortDesc: "Power doubles if the user moves before the target.",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Water",
	},
	coldsnap: {
		accuracy: 85,
		basePower: 0,
		category: "Status",
		name: "Cold Snap",
		shortDesc: "Freezes the target.",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'frz',
		secondary: null,
		target: "normal",
		type: "Ice",
		zMove: { boost: { spa: 1 } },
		contestType: "Beautiful",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Mist", target);
		},
	},
	blazeball: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Blaze Ball",
		shortDesc: "No additional effect.",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Pyro Ball", target);
		},
	},
	crimsondawn: {
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		name: "Crimson Dawn",
		shortDesc: "Can't be used consecutively. Fails if user isn't Fire-Type",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, cantusetwice: 1, contact: 1 },
		secondary: null,
		target: "normal",
		type: "Fire",
		onTryMove(pokemon, target, move) {
			if (pokemon.hasType('Fire')) return;
			this.add('-fail', pokemon, 'move: Crimson Dawn');
			this.attrLastMove('[still]');
			return null;
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "V-create", target);
		},
	},
	ancestralthunder: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Ancestral Thunder",
		shortDesc: "Can't be used consecutively. Fails if user isn't Electric-Type",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, cantusetwice: 1 },
		secondary: null,
		target: "normal",
		type: "Electric",
		onTryMove(pokemon, target, move) {
			if (pokemon.hasType('Electric')) return;
			this.add('-fail', pokemon, 'move: Ancestral Thunder');
			this.attrLastMove('[still]');
			return null;
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Electro Drift", target);
		},
	},
	quicksandbreath: {
		accuracy: 75,
		basePower: 100,
		category: "Special",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		name: "Quicksand Breath",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sandsear Storm", target);
		},
	},
	sedativespine: {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Sedative Spine",
		shortDesc: "100% chance to make the foe drowsy.",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: {
			chance: 100,
			status: 'slp',
		},
		target: "normal",
		type: "Bug",
		contestType: "Clever",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Leech Life", target);
		},
	},
	hellflare: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Hellflare",
		shortDesc: "Hits two turns after being used.",
		pp: 10,
		priority: 0,
		flags: { allyanim: 1, metronome: 1, futuremove: 1 },
		ignoreImmunity: true,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 3,
				move: 'hellflare',
				source,
				moveData: {
					id: 'hellflare',
					name: "Hellflare",
					accuracy: 100,
					basePower: 120,
					category: "Special",
					priority: 0,
					flags: { allyanim: 1, metronome: 1, futuremove: 1 },
					ignoreImmunity: false,
					effectType: 'Move',
					type: 'Fire',
				},
			});
			this.add('-start', source, 'move: Future Sight');
			return this.NOT_FAIL;
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sacred Fire", target);
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Clever",
	},
	boulderpunch: {
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Boulder Punch",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		shortDesc: "50% chance to lower the target's defense.",
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Accelerock", target);
		},
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	dragoncharge: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Dragon Charge",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'dragoncharge',
		condition: {
			onStart(pokemon, source, effect) {
				if (effect && effect.name === 'Wyversion') {
					this.add('-start', pokemon, 'Dragon Charge', '[from] ability: Wyversion');
				} else {
					this.add('-start', pokemon, 'Dragon Charge');
				}
			},
			onRestart(pokemon, source, effect) {
				if (effect && effect.name === 'Wyversion') {
					this.add('-start', pokemon, 'Dragon Charge', '[from] ability: Wyversion');
				} else {
					this.add('-start', pokemon, 'Dragon Charge');
				}
			},
			onBasePowerPriority: 9,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Dragon') {
					this.debug('dragoncharge boost');
					return this.chainModify(2);
				}
			},
			onMoveAborted(pokemon, target, move) {
				if (move.type === 'Dragon' && move.id !== 'dragoncharge') {
					pokemon.removeVolatile('dragoncharge');
				}
			},
			onAfterMove(pokemon, target, move) {
				if (move.type === 'Dragon' && move.id !== 'dragoncharge') {
					pokemon.removeVolatile('dragoncharge');
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Dragon Charge', '[silent]');
			},
		},
		secondary: null,
		target: "self",
		type: "Dragon",
		zMove: { boost: { spd: 1 } },
		contestType: "Clever",
	},
	convectionnova: {
		accuracy: 100,
		basePower: 135,
		category: "Special",
		name: "Convection Nova",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, cantusetwice: 1 },
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Ice Burn", target);
		},
		secondary: null,
		shortDesc: "Fire moves become Ice type this turn, can't use twice.",
		pseudoWeather: 'convection',
		target: "allAdjacentFoes",
		type: "Ice",
		contestType: "Beautiful",
	},
	convection: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Convection",
		pp: 25,
		priority: 1,
		flags: { metronome: 1 },
		shortDesc: "Fire moves become Ice type this turn.",
		pseudoWeather: 'convection',
		condition: {
			duration: 1,
			onFieldStart(target, source, sourceEffect) {
				this.add('-fieldactivate', 'move: Convection');
				this.hint(`Fire-type moves become Ice-type after using ${sourceEffect}.`);
			},
			onModifyTypePriority: -2,
			onModifyType(move) {
				if (move.type === 'Fire') {
					move.type = 'Ice';
					this.debug(move.name + "'s type changed to Ice");
				}
			},
		},
		secondary: null,
		target: "all",
		type: "Ice",
		zMove: { boost: { spa: 1 } },
		contestType: "Beautiful",
	},
	/*
	Monhun Status
	*/
	hellfirerifle: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Hellfire Rifle",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, pulse: 1 },
		secondary: null,
		onAfterMove(pokemon, target, move) {
			if (this.randomChance(3, 10)) {
				target.addVolatile('blastblight');
			}
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Infernal Parade", target);
		},
		shortDesc: "30% chance to inflict blastblight.",
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	slimepunch: {
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		name: "Slime Punch",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: null,
		onAfterMove(pokemon, target, move) {
			if (this.randomChance(5, 10)) {
				target.addVolatile('blastblight');
			}
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Shell Side Arm", target);
		},
		shortDesc: "50% chance to inflict blastblight.",
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	powderkeg: {
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Powderkeg",
		pp: 25,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, powder: 1 },
		secondary: null,
		onAfterMove(pokemon, target, move) {
			if (this.randomChance(10, 10)) {
				target.addVolatile('blastblight');
			}
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fiery Dance", target);
		},
		shortDesc: "Inflicts blastblight.",
		target: "normal",
		type: "Fire",
		contestType: "Clever",
	},
	blastbite: {
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Blast Bite",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondaries: [
			{
				chance: 10,
				volatileStatus: 'flinch',
			},
		],
		onAfterMove(pokemon, target, move) {
			if (this.randomChance(10, 10)) {
				target.addVolatile('blastblight');
			}
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fire Fang", target);
		},
		shortDesc: "Inflicts blast. 10% chance to flinch.",
		target: "normal",
		type: "Fire",
		contestType: "Cool",
	},
	abyssaleruption: {
		accuracy: 90,
		basePower: 130,
		category: "Special",
		name: "Abyssal Eruption",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: null,
		onAfterMove(pokemon, target, move) {
			if (this.randomChance(5, 10)) {
				target.addVolatile('blastblight');
			}
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Black Hole Eclipse", target);
		},
		shortDesc: "Reduces Sp. Atk by 2. 50% chance to inflict blast.",
		target: "normal",
		type: "Dark",
		contestType: "Beautiful",
	},
	supremacysquall: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Supremacy Squall",
		pp: 5,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: null,
		shortDesc: "Inflicts defense down.",
		volatileStatus: 'defensedown',
		target: "allAdjacentFoes",
		type: "Flying",
		zMove: { boost: { def: 1 } },
		contestType: "Tough",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bleakwind Storm", source);
		},
	},
	harshsting: {
		accuracy: 100,
		basePower: 15,
		category: "Physical",
		name: "Harsh Sting",
		pp: 35,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			status: 'defensedown',
		},
		shortDesc: "Inflicts defense down.",
		target: "normal",
		type: "Bug",
		contestType: "Clever",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Leech Life", target);
		},
	},
	decayduster: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Decay Duster",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'defensedown',
		shortDesc: "Hits adjacent pokemon. Inflicts defense down.",
		secondary: null,
		target: "allAdjacent",
		type: "Bug",
		contestType: "Beautiful",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Pollen Puff", target);
		},
	},
	slimyspit: {
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Slimy Spit",
		pp: 30,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			volatileStatus: 'defensedown',
		},
		shortDesc: "100% chance to inflict Defense Down.",
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Clever",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Snipe Shot", target);
		},
	},
	stinkbomb: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Stink Bomb",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'stench',
		},
		shortDesc: "30% chance to inflict stench.",
		target: "normal",
		type: "Poison",
		contestType: "Tough",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sludge Bomb", target);
		},
	},
	perfumepulse: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Perfume Pulse",
		shortDesc: "30% chance to inflict Stench.",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, pulse: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'stench',
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Malignant Chain", target);
		},
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},
	phlegmshot: {
		accuracy: 80,
		basePower: 120,
		category: "Physical",
		name: "Phlegm Shot",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'fatigue',
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Gunk Shot", target);
		},
		shortDesc: "30% chance to inflict fatigue.",
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	sweetlick: {
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Sweet Lick",
		pp: 30,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		shortDesc: "Inflicts Fatigue.",
		secondary: {
			chance: 100,
			volatileStatus: 'fatigue',
		},
		target: "normal",
		type: "Poison",
		contestType: "Cute",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Poison Tail", target);
		},
	},
	roughhouse: {
		accuracy: 90,
		basePower: 95,
		category: "Physical",
		name: "Roughhouse",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 50,
			volatileStatus: 'bleeding',
		},
		shortDesc: "50% chance to inflict bleeding.",
		target: "normal",
		type: "Fighting",
		contestType: "Cute",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Play Rough", target);
		},
	},
	cruelclaw: {
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Cruel Claw",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondaries: [
			{
				chance: 50,
				boosts: {
					def: -1,
				},
			}, {
				chance: 30,
				volatileStatus: 'bleeding',
			},
		],
		shortDesc: "50% chance to lower Defense, 30% to bleed.",
		target: "normal",
		type: "Dark",
		contestType: "Cool",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dire Claw", target);
		},
	},
	brimstoneblade: {
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Brimstone Blade",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		critRatio: 2,
		secondary: {
			chance: 100,
			volatileStatus: 'bleeding',
		},
		shortDesc: "High crit ratio. 100% chance to bleed.",
		target: "normal",
		type: "Rock",
		contestType: "Cool",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Stone Axe", target);
		},
	},
	sulfurousblade: {
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Sulfurous Blade",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		critRatio: 2,
		secondary: {
			chance: 10,
			volatileStatus: 'defensedown',
		},
		shortDesc: "High crit ratio. 30% chance to inflict Def. Down.",
		target: "normal",
		type: "Poison",
		contestType: "Cool",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Cross Poison", target);
		},
	},
	thousandblades: {
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		name: "Thousand Blades",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		critRatio: 2,
		secondary: {
			chance: 20,
			volatileStatus: 'bleeding',
		},
		shortDesc: "High crit ratio. 20% chance to bleed.",
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Triple Arrows", target);
		},
	},
	snowballcannon: {
		accuracy: 95,
		basePower: 90,
		category: "Physical",
		name: "Snowball Cannon",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			volatileStatus: 'snowman',
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Mountain Gale", target);
		},
		shortDesc: "10% chance to trap the foe in a Snowman.",
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	glacialgale: {
		accuracy: 100,
		basePower: 85,
		category: "Special",
		name: "Glacial Gale",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		secondary: {
			chance: 10,
			volatileStatus: 'snowman',
		},
		shortDesc: "10% chance to trap the foe in a Snowman.",
		target: "allAdjacentFoes",
		type: "Ice",
		contestType: "Beautiful",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Blizzard", target);
		},
	},
	oxideairstrike: {
		accuracy: 95,
		basePower: 70,
		category: "Physical",
		name: "Oxide Airstrike",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1 },
		secondary: {
			chance: 100,
			volatileStatus: 'rusted',
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dragon Ascent", target);
		},
		shortDesc: "100% chance to inflict Rust.",
		target: "allAdjacentFoes",
		type: "Flying",
		contestType: "Cool",
	},
	dracophage: {
		accuracy: 85,
		basePower: 0,
		category: "Status",
		name: "Dracophage",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		shortDesc: "Dragonblights the opponent.",
		status: 'dragonblight',
		secondary: null,
		target: "normal",
		type: "Dragon",
		zMove: { boost: { atk: 1 } },
		contestType: "Beautiful",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Spicy Extract", target);
		},
	},
	devilsjaw: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Devil's Jaw",
		shortDesc: "100% chance to inflict Dragonblight.",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, bite: 1 },
		secondary: {
			chance: 100,
			status: 'dragonblight',
		},
		target: "normal",
		type: "Dragon",
		contestType: "Clever",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Poison Fang", target);
		},
	},
	seraphicshift: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Seraphic Shift",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bypasssub: 1 },
		onHit(target, pokemon, move) {
			if (pokemon.baseSpecies.baseSpecies === 'Disufiroa' && !pokemon.transformed) {
				move.willChangeForme = true;
			}
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.willChangeForme) {
				const meloettaForme = pokemon.species.id === 'disufiroasol' ? '' : '-Sol';
				pokemon.formeChange('Disufiroa' + meloettaForme, this.effect, false, '[msg]');
			}
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sheer Cold", target);
		},
		shortDesc: "Changes Disufiroa's form.",
		target: "allAdjacentFoes",
		type: "Ice",
		contestType: "Beautiful",
	},
	nethercurrent: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Nether Current",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
			},
		},
		shortDesc: "Prevents the target from switching out.",
		target: "normal",
		type: "Water",
		contestType: "Tough",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Surf", target);
		},
	},
	frozencleave: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Frozen Cleave",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		onEffectiveness(typeMod, target, type) {
			if (type === 'Water') return 1;
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Ice Spinner", target);
		},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "normal",
		shortDesc: "10% chance to freeze. Super effective on Water.",
		type: "Ice",
		contestType: "Beautiful",
	},
	boomblast: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Boomblast",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: null,
		onAfterMove(pokemon, target, move) {
			if (this.randomChance(5, 10)) {
				target.addVolatile('blastblight');
			}
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fusion Flare", target);
		},
		shortDesc: "50% chance to Blast. Hits adjacent Pokemon.",
		target: "allAdjacent",
		type: "Fire",
		contestType: "Tough",
	},
	shroomshield: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Shroom Shield",
		pp: 10,
		priority: 4,
		flags: { metronome: 1, noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'shroomshield',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					source.trySetStatus('psn', target);
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					source.trySetStatus('psn', target);
				}
			},
		},
		shortDesc: "Protects from damaging attacks. Contact: poison.",
		secondary: null,
		target: "self",
		type: "Grass",
	},
	risenburst: {
		accuracy: true,
		basePower: 60,
		category: "Special",
		name: "Risen Burst",
		pp: 1,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dark Pulse", target);
		},
		onModifyMove(move, pokemon, target) {
			move.type = '???';
			if (!target) return;
			const atk = pokemon.getStat('atk', false, true);
			const spa = pokemon.getStat('spa', false, true);
			const def = target.getStat('def', false, true);
			const spd = target.getStat('spd', false, true);
			const physical = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * atk) / def) / 50);
			const special = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * spa) / spd) / 50);
			if (physical > special || (physical === special && this.random(2) === 0)) {
				move.category = 'Physical';
				move.flags.contact = 1;
			}
		},
		type: 'Dark',
		secondary: null,
		target: "allAdjacent",
	},
	selenitebeam: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Selenite Beam",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		shortDesc: "30% chance to inflict paralysis.",
		type: "Fairy",
		contestType: "Beautiful",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Meteor Beam", target);
		},
	},
	rageray: {
		accuracy: 100,
		basePower: 0,
		damage: 'level',
		category: "Special",
		name: "Rage Ray",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'taunt',
		condition: {
			duration: 1,
			onStart(target) {
				if (!target) return;
				if (target.activeTurns && !this.queue.willMove(target)) {
					this.effectState.duration!++;
				}
				this.add('-start', target, 'move: Taunt');
			},
			onResidualOrder: 15,
			onEnd(target) {
				this.add('-end', target, 'move: Taunt');
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					const move = this.dex.moves.get(moveSlot.id);
					if (move.category === 'Status' && move.id !== 'mefirst') {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 5,
			onBeforeMove(attacker, defender, move) {
				if (!move.isZ && !move.isMax && move.category === 'Status' && move.id !== 'mefirst') {
					this.add('cant', attacker, 'move: Taunt', move);
					return false;
				}
			},
		},
		secondary: null,
		shortDesc: "Does damage equal to the user's level. Applies Taunt for one turn.",
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Tera Starstorm", target);
		},
	},
	butterflare: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Butterflare",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		shortDesc: "30% chance to inflict burn.",
		type: "Bug",
		contestType: "Beautiful",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flamethrower", target);
			this.add('-anim', source, "Bug Buzz", source);
		},
	},
	butterflight: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Butterflight",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		selfSwitch: true,
		secondary: null,
		shortDesc: "User switches out after damaging the target.",
		target: "normal",
		type: "Flying",
		contestType: "Cute",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Aerial Ace", target);
		},
	},
	gracefulsweep: {
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		name: "Graceful Sweep",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 20,
			boosts: {
				spe: -1,
			},
		},
		shortDesc: "20% to lower the target's Speed by 1.",
		target: "normal",
		type: "Fairy",
		contestType: "Cute",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Play Rough", target);
		},
	},
	immolationorder: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Immolation Order",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		self: {
			boosts: {
				def: -1,
				spd: -1,
			},
		},
		secondary: null,
		shortDesc: "Lowers the user's Defense and Sp. Def by 1.",
		target: "normal",
		type: "Dragon",
		contestType: "Tough",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Draco Meteor", target);
			this.add('-anim', source, "Bug Buzz", source);
		},
	},
	virulentvolley: {
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		name: "Virulent Volley",
		pp: 30,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
			pokemon.side.removeSideCondition('auroraveil');
		},
		secondary: null,
		target: "normal",
		type: "Poison",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
		contestType: "Beautiful",
		shortDesc: "Hits 2-5 times. Destroys screens, unless the target is immune.",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Icicle Spear", target);
			this.add('-anim', source, "Baneful Bunker", target);
		},
	},
	aviniasblessing: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Avinia's Blessing",
		shortDesc: "Cures user's status, raises Atk, Def by 1.",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onHit(pokemon) {
			const success = !!this.boost({ atk: 1, def: 1 });
			return pokemon.cureStatus() || success;
		},
		secondary: null,
		target: "self",
		type: "Ice",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Haze", source);
		},
	},
	dreadrockcannon: {
		accuracy: 85,
		basePower: 100,
		category: "Special",
		name: "Dreadrock Cannon",
		pp: 5,
		priority: 0,
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
			case 'sandstorm':
			case 'dustdevil':
				move.accuracy = true;
				break;
			}
		},
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, pulse: 1 },
		secondary: null,
		target: "allAdjacent",
		type: "Rock",
		contestType: "Beautiful",
		shortDesc: "Can't miss in sand.",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rock Wrecker", target);
		},
	},
	mentalload: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Mental Load",
		shortDesc: "Uses user's SpD. stat as Atk in damage calculation.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		overrideOffensiveStat: 'spd',
		secondary: null,
		target: "normal",
		type: "Psychic",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', target, "Psycho Boost", target);
		},
	},
	pyrotoxicgale: {
		accuracy: 90,
		basePower: 100,
		category: "Special",
		name: "Pyrotoxic Gale",
		shortDesc: "Sea of Fire for 3 turns.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, wind: 1 },
		secondary: null,
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Heat Wave", target);
			this.add('-anim', target, "Corrosive Gas", target);
		},
		onHit(target, source, move) {
			if (!target.side.sideConditions['firepledge']) {
				target.side.addSideCondition('firepledge');
				this.add('-fieldactivate', 'move: Fire Pledge');
			}
		},
		target: "normal",
		type: "Poison",
	},
	ignitionflare: {
		accuracy: 90,
		basePower: 120,
		category: "Special",
		name: "Ignition Flare",
		shortDesc: "Charges turn 1, hits turn 2.",
		pp: 10,
		priority: 0,
		flags: { charge: 1, protect: 1, mirror: 1, metronome: 1 },
		// prepareAnim: "Burning Bulwark",
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.attrLastMove('[still]');
			this.add('-anim', attacker, "Burning Bulwark", attacker);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Eruption", target);
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	lightofruin: {
		num: 617,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		name: "Light of Ruin",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		recoil: [1, 2],
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Beautiful",
		desc: "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 1/2 recoil.",
	},
	swift: {
		inherit: true,
		desc: "Does not check accuracy. Usually goes first.",
		shortDesc: "Does not check accuracy. Usually goes first.",
		priority: 1,
	},
	healorder: {
		inherit: true,
		isNonstandard: null,
		pp: 5,
	},
	hyperspacefury: {
		inherit: true,
		breaksProtect: true,
		onTry(source) {},
	},
	ivycudgel: {
		inherit: true,
		onPrepareHit(target, source, move) {
			if (move.type !== "Grass") {
				this.attrLastMove('[anim] Ivy Cudgel ' + move.type);
			}
		},
		onModifyType(move, pokemon) {},
	},
	razorshell: {
		inherit: true,
		desc: "20% chance to inflict Bleed",
		shortDesc: "20% chance to inflict bleed.",
		secondary: {
			chance: 20,
			volatileStatus: 'bleeding',
		},
	},
	razorleaf: {
		inherit: true,
		basePower: 60,
		desc: "High critical hit ratio. 30% chance to inflict bleed.",
		shortDesc: "High critical hit ratio. 30% chance to inflict bleed.",
		secondary: {
			chance: 30,
			volatileStatus: 'bleeding',
		},
	},
	rest: {
		inherit: true,
		flags: { snatch: 1, heal: 1, metronome: 1, cantusetwice: 1 },
		desc: "Induces Drowsy; Heals HP/Status. Can't use consecutively.",
	},
	razorwind: {
		inherit: true,
		isNonstandard: null,
		onTryMove(attacker, defender, move) {},
		desc: "High critical hit ratio. 30% chance to inflict bleed.",
		shortDesc: "High critical hit ratio. 30% chance to inflict bleed.",
		secondary: {
			chance: 30,
			volatileStatus: 'bleeding',
		},
	},
	bubblebeam: {
		inherit: true,
		desc: "10% chance to inflict Bubbleblight.",
		shortDesc: "10% chance to inflict Bubbleblight.",
		secondary: {
			chance: 10,
			volatileStatus: 'bubbleblight',
		},
	},
	dragonclaw: {
		inherit: true,
		desc: "30% chance to inflict bleed.",
		shortDesc: "30% chance to inflict bleed.",
		secondary: {
			chance: 10,
			volatileStatus: 'bleeding',
		},
	},
	dualchop: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Hits twice. Removes Reflect, Light Screen, and Aurora Veil on hit.",
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
			pokemon.side.removeSideCondition('auroraveil');
		},
	},
	irontail: {
		inherit: true,
		accuracy: 90,
	},
	chipaway: {
		isNonstandard: null,
		inherit: true,
		basePower: 90,
	},
	bitterblade: {
		inherit: true,
		basePower: 80,
	},
	shadowclaw: {
		inherit: true,
		basePower: 85,
	},
	tailslap: {
		inherit: true,
		accuracy: 90,
	},
	crushclaw: {
		inherit: true,
		accuracy: 100,
		basePower: 85,
	},
	cut: {
		accuracy: 100,
		inherit: true,
		category: "Physical",
		isNonstandard: null,
		name: "Cut",
		pp: 30,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		secondary: {
			chance: 100,
			volatileStatus: 'bleeding',
		},
		shortDesc: "Inflicts bleed.",
	},
	doublehit: {
		inherit: true,
		basePower: 50,
		multihit: 2,
	},
	megakick: {
		inherit: true,
		accuracy: 85,
	},
	megapunch: {
		inherit: true,
		accuracy: 90,
		basePower: 100,
	},
	stomp: {
		inherit: true,
		basePower: 80,
	},
	takedown: {
		inherit: true,
		accuracy: 100,
		basePower: 100,
	},
	headcharge: {
		inherit: true,
		isNonstandard: null,
		accuracy: 100,
		shortDesc: "Has 1/2 recoil.",
		basePower: 150,
		pp: 5,
		recoil: [1, 2],
	},
	blazekick: {
		inherit: true,
		accuracy: 100,
	},
	aquatail: {
		inherit: true,
		accuracy: 100,
	},
	wildcharge: {
		inherit: true,
		accuracy: 100,
		basePower: 100,
	},
	paraboliccharge: {
		inherit: true,
		basePower: 75,
	},
	seedbomb: {
		inherit: true,
		basePower: 85,
	},
	tropkick: {
		inherit: true,
		basePower: 90,
	},
	glaciate: {
		inherit: true,
		basePower: 80,
	},
	doublekick: {
		inherit: true,
		basePower: 40,
	},
	forcepalm: {
		inherit: true,
		basePower: 80,
	},
	submission: {
		inherit: true,
		isNonstandard: null,
		accuracy: 100,
		basePower: 100,
	},
	skyuppercut: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Removes the target's Ground immunity.",
		accuracy: 100,
		condition: {
			noCopy: true,
			onStart(pokemon) {
				let applies = false;
				if (pokemon.hasType('Flying') || pokemon.hasAbility('levitate')) applies = true;
				if (pokemon.hasItem('ironball') || pokemon.volatiles['ingrain'] ||
					this.field.getPseudoWeather('gravity')) applies = false;
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					applies = true;
					this.queue.cancelMove(pokemon);
					pokemon.removeVolatile('twoturnmove');
				}
				if (pokemon.volatiles['magnetrise']) {
					applies = true;
					delete pokemon.volatiles['magnetrise'];
				}
				if (pokemon.volatiles['telekinesis']) {
					applies = true;
					delete pokemon.volatiles['telekinesis'];
				}
				if (!applies) return false;
				this.add('-start', pokemon, 'Smack Down');
			},
			onRestart(pokemon) {
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					this.queue.cancelMove(pokemon);
					pokemon.removeVolatile('twoturnmove');
					this.add('-start', pokemon, 'Smack Down');
				}
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
		},
	},
	poisontail: {
		inherit: true,
		accuracy: 90,
		basePower: 100,
		shortDesc: "30% chance to lower the target's Attack by 1.",
		pp: 15,
		critRatio: 1,
		secondary: {
			chance: 30,
			boosts: {
				atk: -1,
			},
		},
	},
	zenheadbutt: {
		inherit: true,
		accuracy: 100,
	},
	steamroller: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Ends the effects of Terrain. 30% chance to flinch.",
		basePower: 95,
		onAfterHit(target, source) {
			if (source.hp) {
				this.field.clearTerrain();
			}
		},
		onAfterSubDamage(damage, target, source) {
			if (source.hp) {
				this.field.clearTerrain();
			}
		},
	},
	refresh: {
		inherit: true,
		isNonstandard: null,
		onHit(pokemon) {
			pokemon.cureStatus();
		},
		shortDesc: "Cures status",
	},
	facade: {
		inherit: true,
		shortDesc: "Power doubles if user has any non-volatile status.",
		onBasePower(basePower, pokemon) {
			if (pokemon.status) {
				return this.chainModify(2);
			}
		},
	},
	twineedle: {
		inherit: true,
		isNonstandard: null,
		basePower: 45,
	},
	shadowpunch: {
		inherit: true,
		shortDesc: "Always results in a critical hit.",
		willCrit: true,
	},
	dragonrush: {
		inherit: true,
		accuracy: 90,
	},
	geargrind: {
		inherit: true,
		isNonstandard: null,
		accuracy: 90,
	},
	spinout: {
		inherit: true,
		basePower: 110,
		accuracy: 100,
	},
	steelwing: {
		inherit: true,
		accuracy: 100,
		shortDesc: "50% chance to raise the users's Defense by 1.",
		basePower: 80,
		pp: 10,
		secondary: {
			chance: 50,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
	},
	firefang: {
		inherit: true,
		basePower: 70,
	},
	icefang: {
		inherit: true,
		basePower: 70,
		shortDesc: "10% chance to frostbite. 10% chance to flinch.",
	},
	thunderfang: {
		inherit: true,
		basePower: 70,
	},
	strengthsap: {
		inherit: true,
		pp: 5,
	},
	poisonfang: {
		inherit: true,
		basePower: 70,
		secondary: {},
		shortDesc: "10% chance to poison. 10% chance to flinch.",
		secondaries: [
			{
				chance: 10,
				status: 'psn',
			}, {
				chance: 10,
				volatileStatus: 'flinch',
			},
		],
	},
	darkvoid: {
		inherit: true,
		shortDesc: "Makes the foe(s) drowsy",
		accuracy: 80,
		onTry(source, target, move) {},
	},
	direclaw: {
		inherit: true,
		shortDesc: "50% chance to poison, paralyze, or make the target drowsy.",
	},
	dreameater: {
		inherit: true,
		shortDesc: "User gains 1/2 HP inflicted. Drowsy target only.",
	},
	electricterrain: {
		inherit: true,
		shortDesc: "5 turns. Grounded: +Electric power, can't be drowsy.",
	},
	grasswhistle: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Makes the target drowsy.",
	},
	hypnosis: {
		inherit: true,
		shortDesc: "Makes the target drowsy.",
		accuracy: 85,
	},
	lovelykiss: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Makes the target drowsy.",
	},
	takeheart: {
		inherit: true,
	},
	nightmare: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "A drowsy target is hurt by 1/4 max HP per turn.",
	},
	relicsong: {
		inherit: true,
		shortDesc: "10% chance to make foe(s) drowsy.",
	},
	sing: {
		inherit: true,
		shortDesc: "Makes the target drowsy.",
		accuracy: 80,
	},
	sleeppowder: {
		inherit: true,
		shortDesc: "Makes the target drowsy.",
	},
	sleeptalk: {
		inherit: true,
		shortDesc: "User must be drowsy. Uses another known move.",
	},
	snore: {
		inherit: true,
		shortDesc: "User must be drowsy. 30% chance to flinch the target.",
	},
	uproar: {
		inherit: true,
		shortDesc: "Last 3 turns. Active Pokemon cannot become drowsy.",
	},
	wakeupslap: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Power doubles if target is drowsy, and wakes it.",
	},
	yawn: {
		inherit: true,
		shortDesc: "Makes the target drowsy after 1 turn.",
	},
	blizzard: {
		inherit: true,
		onModifyMove(move) {
			if (this.field.isWeather(['hail', 'snow', 'absolutezero'])) move.accuracy = true;
		},
		shortDesc: "10% chance to frostbite foe(s). Can't miss in Snow.",
	},
	freezedry: {
		inherit: true,
		shortDesc: "10% chance to frostbite. Super effective on Water.",
	},
	freezingglare: {
		inherit: true,
		shortDesc: "10% chance to frostbite the target.",
	},
	icebeam: {
		inherit: true,
		shortDesc: "10% chance to frostbite the target.",
	},
	icepunch: {
		inherit: true,
		shortDesc: "10% chance to frostbite the target.",
	},
	powdersnow: {
		inherit: true,
		shortDesc: "10% chance to frostbite foe(s).",
	},
	triattack: {
		inherit: true,
		shortDesc: "20% chance to paralyze, burn, or frostbite target.",
	},
	shoreup: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			if (['sandstorm', 'dustdevil'].includes(pokemon.effectiveWeather())) {
				factor = 0.667;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	solarbeam: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			const weakWeathers = ['raindance', 'primordialsea', 'dustdevil', 'absolutezero', 'sandstorm', 'hail', 'snow'];
			if (weakWeathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	solarblade: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			const weakWeathers = ['raindance', 'primordialsea', 'dustdevil', 'absolutezero', 'sandstorm', 'hail', 'snow'];
			if (weakWeathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	synthesis: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'dustdevil':
			case 'hail':
			case 'absolutezero':
			case 'snow':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	morningsun: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'dustdevil':
			case 'hail':
			case 'absolutezero':
			case 'snow':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	moonlight: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'dustdevil':
			case 'sandstorm':
			case 'hail':
			case 'absolutezero':
			case 'snow':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	weatherball: {
		inherit: true,
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
				move.type = 'Water';
				break;
			case 'sandstorm':
			case 'dustdevil':
				move.type = 'Rock';
				break;
			case 'hail':
			case 'absolutezero':
			case 'snow':
				move.type = 'Ice';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.basePower *= 2;
				break;
			case 'raindance':
			case 'primordialsea':
				move.basePower *= 2;
				break;
			case 'sandstorm':
			case 'dustdevil':
				move.basePower *= 2;
				break;
			case 'hail':
			case 'absolutezero':
			case 'snow':
				move.basePower *= 2;
				break;
			}
			this.debug(`BP: ${move.basePower}`);
		},
	},
	auroraveil: {
		inherit: true,
		onTry() {
			return this.field.isWeather(['hail', 'snow', 'absolutezero']);
		},
	},
	dragonpulse: {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'dragonblight',
		},
		desc: "30% chance to dragonblight the target.",
		shortDesc: "30% chance to dragonblight the target.",
	},
	bittermalice: {
		inherit: true,
		basePower: 60,
		pp: 15,
		secondary: {
			chance: 30,
			status: 'frz',
		},
		desc: "30% chance to frostbite the target.",
		shortDesc: "30% chance to frostbite the target.",
	},
	bleakwindstorm: {
		inherit: true,
		secondary: {
			chance: 20,
			status: 'frz',
		},
		desc: "Has a 20% to frostbite the target. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If this move is used against a Pokemon holding Utility Umbrella, this move's accuracy remains at 80%.",
		shortDesc: "20% to frostbite the target. Rain: can't miss.",
	},
	firepledge: {
		inherit: true,
		condition: {
			duration: 4,
			durationCallback(target, source, effect) {
				if (effect?.name === "Pyrotoxic Gale") {
					return 3;
				}
				return 4;
			},
			onSideStart(targetSide) {
				this.add('-sidestart', targetSide, 'Fire Pledge');
			},
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(pokemon) {
				if (!pokemon.hasType('Fire')) this.damage(pokemon.baseMaxhp / 8, pokemon);
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 8,
			onSideEnd(targetSide) {
				this.add('-sideend', targetSide, 'Fire Pledge');
			},
		},
	},
	blazingtorque: {
		num: 896,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		isNonstandard: null,
		name: "Blazing Torque",
		pp: 10,
		priority: 0,
		flags: {
			protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,
		},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
	},
	combattorque: {
		num: 899,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		isNonstandard: null,
		name: "Combat Torque",
		pp: 10,
		priority: 0,
		flags: {
			protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Fighting",
	},
	magicaltorque: {
		num: 900,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		isNonstandard: null,
		name: "Magical Torque",
		pp: 10,
		priority: 0,
		flags: {
			protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,
		},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Fairy",
	},
	noxioustorque: {
		num: 898,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		isNonstandard: null,
		name: "Noxious Torque",
		pp: 10,
		priority: 0,
		flags: {
			protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,
		},
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
	},
	wickedtorque: {
		num: 897,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		isNonstandard: null,
		shortDesc: "10% chance to make the target drowsy.",
		name: "Wicked Torque",
		pp: 10,
		priority: 0,
		flags: {
			protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,
		},
		secondary: {
			chance: 10,
			status: 'slp',
		},
		target: "normal",
		type: "Dark",
	},
	// undexiting moves (because the standard natdex rule isn't doing it already fsr)
	anchorshot: {
		inherit: true,
		isNonstandard: null,
	},
	aromatherapy: {
		inherit: true,
		isNonstandard: null,
	},
	assist: {
		inherit: true,
		isNonstandard: null,
	},
	autotomize: {
		inherit: true,
		isNonstandard: null,
	},
	barrage: {
		inherit: true,
		isNonstandard: null,
	},
	barrier: {
		inherit: true,
		isNonstandard: null,
	},
	bestow: {
		inherit: true,
		isNonstandard: null,
	},
	bide: {
		inherit: true,
		isNonstandard: null,
	},
	boltbeak: {
		inherit: true,
		isNonstandard: null,
	},
	boneclub: {
		inherit: true,
		isNonstandard: null,
	},
	bonemerang: {
		inherit: true,
		isNonstandard: null,
	},
	bubble: {
		inherit: true,
		isNonstandard: null,
	},
	camouflage: {
		inherit: true,
		isNonstandard: null,
	},
	captivate: {
		inherit: true,
		isNonstandard: null,
	},
	chatter: {
		inherit: true,
		isNonstandard: null,
	},
	clamp: {
		inherit: true,
		isNonstandard: null,
	},
	cometpunch: {
		inherit: true,
		isNonstandard: null,
	},
	constrict: {
		inherit: true,
		isNonstandard: null,
	},
	coreenforcer: {
		inherit: true,
		isNonstandard: null,
	},
	craftyshield: {
		inherit: true,
		isNonstandard: null,
	},
	dizzypunch: {
		inherit: true,
		isNonstandard: null,
	},
	doubleironbash: {
		inherit: true,
		isNonstandard: null,
	},
	doubleslap: {
		inherit: true,
		isNonstandard: null,
	},
	dragonrage: {
		inherit: true,
		isNonstandard: null,
	},
	eggbomb: {
		inherit: true,
		isNonstandard: null,
	},
	electrify: {
		inherit: true,
		isNonstandard: null,
	},
	embargo: {
		inherit: true,
		isNonstandard: null,
	},
	eternabeam: {
		inherit: true,
		isNonstandard: null,
	},
	feintattack: {
		inherit: true,
		isNonstandard: null,
	},
	fishiousrend: {
		inherit: true,
		isNonstandard: null,
	},
	flameburst: {
		inherit: true,
		isNonstandard: null,
	},
	flash: {
		inherit: true,
		isNonstandard: null,
	},
	flowershield: {
		inherit: true,
		isNonstandard: null,
	},
	foresight: {
		inherit: true,
		isNonstandard: null,
	},
	frustration: {
		inherit: true,
		isNonstandard: null,
	},
	gearup: {
		inherit: true,
		isNonstandard: null,
	},
	geomancy: {
		inherit: true,
		isNonstandard: null,
	},
	grudge: {
		inherit: true,
		isNonstandard: null,
	},
	hail: {
		inherit: true,
		isNonstandard: null,
	},
	healblock: {
		inherit: true,
		isNonstandard: null,
	},
	heartstamp: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpower: {
		inherit: true,
		isNonstandard: null,
	},
	hyperfang: {
		inherit: true,
		isNonstandard: null,
	},
	iceball: {
		inherit: true,
		isNonstandard: null,
	},
	iondeluge: {
		inherit: true,
		isNonstandard: null,
	},
	jumpkick: {
		inherit: true,
		isNonstandard: null,
	},
	karatechop: {
		inherit: true,
		isNonstandard: null,
	},
	kinesis: {
		inherit: true,
		isNonstandard: null,
	},
	kingsshield: {
		inherit: true,
		isNonstandard: null,
	},
	landswrath: {
		inherit: true,
		isNonstandard: null,
	},
	laserfocus: {
		inherit: true,
		isNonstandard: null,
	},
	leaftornado: {
		inherit: true,
		isNonstandard: null,
	},
	luckychant: {
		inherit: true,
		isNonstandard: null,
	},
	magiccoat: {
		inherit: true,
		isNonstandard: null,
	},
	magnetrise: {
		inherit: true,
		isNonstandard: null,
	},
	magnitude: {
		inherit: true,
		isNonstandard: null,
	},
	matblock: {
		inherit: true,
		isNonstandard: null,
	},
	meditate: {
		inherit: true,
		isNonstandard: null,
	},
	mefirst: {
		inherit: true,
		isNonstandard: null,
	},
	meteorassault: {
		inherit: true,
		isNonstandard: null,
	},
	mindblown: {
		inherit: true,
		isNonstandard: null,
	},
	mindreader: {
		inherit: true,
		isNonstandard: null,
	},
	miracleeye: {
		inherit: true,
		isNonstandard: null,
	},
	mirrormove: {
		inherit: true,
		isNonstandard: null,
	},
	mirrorshot: {
		inherit: true,
		isNonstandard: null,
	},
	mudbomb: {
		inherit: true,
		isNonstandard: null,
	},
	mudsport: {
		inherit: true,
		isNonstandard: null,
	},
	watersport: {
		inherit: true,
		isNonstandard: null,
	},
	multiattack: {
		inherit: true,
		isNonstandard: null,
	},
	naturalgift: {
		inherit: true,
		isNonstandard: null,
	},
	naturepower: {
		inherit: true,
		isNonstandard: null,
	},
	naturesmadness: {
		inherit: true,
		isNonstandard: null,
	},
	needlearm: {
		inherit: true,
		isNonstandard: null,
	},
	oblivionwing: {
		inherit: true,
		isNonstandard: null,
	},
	obstruct: {
		inherit: true,
		isNonstandard: null,
	},
	octazooka: {
		inherit: true,
		isNonstandard: null,
	},
	octolock: {
		inherit: true,
		isNonstandard: null,
	},
	odorsleuth: {
		inherit: true,
		isNonstandard: null,
	},
	ominouswind: {
		inherit: true,
		isNonstandard: null,
	},
	plasmafists: {
		inherit: true,
		isNonstandard: null,
	},
	powder: {
		inherit: true,
		isNonstandard: null,
	},
	poweruppunch: {
		inherit: true,
		isNonstandard: null,
	},
	psychoshift: {
		inherit: true,
		isNonstandard: null,
	},
	psywave: {
		inherit: true,
		isNonstandard: null,
	},
	punishment: {
		inherit: true,
		isNonstandard: null,
	},
	purify: {
		inherit: true,
		isNonstandard: null,
	},
	pursuit: {
		inherit: true,
		isNonstandard: null,
	},
	rage: {
		inherit: true,
		isNonstandard: null,
	},
	return: {
		inherit: true,
		isNonstandard: null,
	},
	revenge: {
		inherit: true,
		isNonstandard: null,
	},
	rockclimb: {
		inherit: true,
		isNonstandard: null,
	},
	rollingkick: {
		inherit: true,
		isNonstandard: null,
	},
	rototiller: {
		inherit: true,
		isNonstandard: null,
	},
	searingshot: {
		inherit: true,
		isNonstandard: null,
	},
	secretpower: {
		inherit: true,
		isNonstandard: null,
	},
	shadowbone: {
		inherit: true,
		isNonstandard: null,
	},
	sharpen: {
		inherit: true,
		isNonstandard: null,
	},
	shelltrap: {
		inherit: true,
		isNonstandard: null,
	},
	signalbeam: {
		inherit: true,
		isNonstandard: null,
	},
	silverwind: {
		inherit: true,
		isNonstandard: null,
	},
	skullbash: {
		inherit: true,
		isNonstandard: null,
	},
	skydrop: {
		inherit: true,
		isNonstandard: null,
	},
	smellingsalts: {
		inherit: true,
		isNonstandard: null,
	},
	snaptrap: {
		inherit: true,
		isNonstandard: null,
	},
	snatch: {
		inherit: true,
		isNonstandard: null,
	},
	sonicboom: {
		inherit: true,
		isNonstandard: null,
	},
	spectralthief: {
		inherit: true,
		isNonstandard: null,
	},
	spiderweb: {
		inherit: true,
		isNonstandard: null,
	},
	spikecannon: {
		inherit: true,
		isNonstandard: null,
	},
	spotlight: {
		inherit: true,
		isNonstandard: null,
	},
	stormthrow: {
		inherit: true,
		isNonstandard: null,
	},
	synchronoise: {
		inherit: true,
		isNonstandard: null,
	},
	technoblast: {
		inherit: true,
		isNonstandard: null,
	},
	telekinesis: {
		inherit: true,
		isNonstandard: null,
	},
	thousandwaves: {
		inherit: true,
		isNonstandard: null,
	},
	thousandarrows: {
		inherit: true,
		isNonstandard: null,
	},
	trickortreat: {
		inherit: true,
		isNonstandard: null,
	},
	trumpcard: {
		inherit: true,
		isNonstandard: null,
	},
	venomdrench: {
		inherit: true,
		isNonstandard: null,
	},
	vitalthrow: {
		inherit: true,
		isNonstandard: null,
	},
	wringout: {
		inherit: true,
		isNonstandard: null,
	},
};
