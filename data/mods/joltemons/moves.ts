export const Moves: {[k: string]: ModdedMoveData} = {
	toxicthread: {
		num: 672,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Badly poisons and lowers the target's Speed by 2",
		name: "Toxic Thread",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		status: 'tox',
		boosts: {
			spe: -2,
		},
		secondary: null,
		target: "normal",
		type: "Poison",
		zMove: {boost: {spe: 1}},
		contestType: "Tough",
	},
	meltingpoint: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		shortDesc: "Replaces the user's Ice-type with Water. 1.5x power when used by Ice-types. Soaks foe.",
		name: "Melting Point",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, defrost: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Scald", target);
			this.add('-anim', source, "Acid Armor", target);
		},
		onBasePower(basePower, pokemon, target) {
			if (pokemon.hasType('Ice')) {
				return this.chainModify(1.5);
			}
		},
		onHit(target) {
			if (target.getTypes().join() === 'Water' || !target.setType('Water')) {
				// Soak should animate even when it fails.
				// Returning false would suppress the animation.
				this.add('-fail', target);
				return null;
			}
			this.add('-start', target, 'typechange', 'Water');
		},
		self: {
			onHit(pokemon) {
				if (pokemon.hasType('Water')) {
					pokemon.setType(pokemon.getTypes(true).map(type => type === "Ice" ? "???" : type));
					this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[from] move: Melting Point');
				} else {
					pokemon.setType(pokemon.getTypes(true).map(type => type === "Ice" ? "Water" : type));
					this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[from] move: Melting Point');
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Clever",
	},
	/*
	reconstruct: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "(Bugged) Charges turn 1. Heals 50% and resets lowered stats turn 2.",
		name: "Reconstruct",
		pp: 10,
		priority: 0,
		flags: {charge: 1, heal: 1},
		heal: [1, 2],
		beforeTurnCallback(pokemon) {
			pokemon.addVolatile('reconstruct');
		},
		condition: {
			duration: 2,
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Reconstruct');
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.category === 'Special' || move.category === 'Physical') {
					return this.chainModify(0.5);
				}
			},
			onTryMove(attacker, defender, move) {
				if (attacker.removeVolatile(move.id)) return;
				this.add('-prepare', attacker, move.name);
				if (!this.runEvent('ChargeMove', attacker, defender, move)) return;
				attacker.addVolatile('twoturnmove', defender);
				return null;
			},
		},
		onAfterMove(pokemon) {
			pokemon.removeVolatile('reconstruct');
		},
		self: {
			onHit(pokemon) {
				const boosts: SparseBoostsTable = {};
				let i: BoostName;
				for (i in pokemon.boosts) {
					if (pokemon.boosts[i] < 0) {
						boosts[i] = 0;
					}
				}
				pokemon.setBoost(boosts);
				this.add('-clearnegativeboost', pokemon, '[silent]');
				this.add('-message', pokemon.name + "'s negative stat changes were removed!");
			},
		},
		secondary: null,
		target: "self",
		type: "Steel",
	},
	reconstruct: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Charges turn 1. Heals 50% and resets lowered stats turn 2.",
		name: "Reconstruct",
		pp: 10,
		priority: 0,
		flags: {charge: 1, heal: 1},
		heal: [1, 2],
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
		self: {
			onHit(pokemon) {
				const boosts: SparseBoostsTable = {};
				let i: BoostName;
				for (i in pokemon.boosts) {
					if (pokemon.boosts[i] < 0) {
						boosts[i] = 0;
					}
				}
				pokemon.setBoost(boosts);
				this.add('-clearnegativeboost', pokemon, '[silent]');
				this.add('-message', pokemon.name + "'s negative stat changes were removed!");
			},
		},
		secondary: null,
		target: "self",
		type: "Steel",
	},
	*/
	reconstruct: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Charges turn 1. Heals 50% and resets lowered stats turn 2.",
		name: "Reconstruct",
		pp: 10,
		priority: 5,
		flags: {charge: 1, heal: 1},
		volatileStatus: 'reconstruct',
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", target);
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.volatiles['reconstruct']) return true;
		},
		condition: {
			duration: 2,
			onLockMove: 'reconstruct',
			onStart(pokemon) {
				this.effectState.totalDamage = 0;
				this.add('-start', pokemon, 'move: Reconstruct');
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.category === 'Special' || move.category === 'Physical') {
					return this.chainModify(0.5);
				}
			},
			onBeforeMove(pokemon, target, move) {
				if (this.effectState.duration === 1) {
					this.add('-end', pokemon, 'move: Reconstruct');
					const moveData: Partial<ActiveMove> = {
						id: 'reconstruct' as ID,
						name: "Reconstruct",
						accuracy: true,
						category: "Status",
						priority: 0,
						flags: {charge: 1, heal: 1},
						heal: [1, 2],
						effectType: 'Move',
						type: 'Steel',
					};
					this.actions.tryMoveHit(target, pokemon, moveData as ActiveMove);
					return false;
				}
				this.add('-activate', pokemon, 'move: Reconstruct');
			},
			onMoveAborted(pokemon) {
				pokemon.removeVolatile('reconstruct');
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Reconstruct', '[silent]');
			},
		},
		self: {
			onHit(pokemon) {
				const boosts: SparseBoostsTable = {};
				let i: BoostID;
				for (i in pokemon.boosts) {
					if (pokemon.boosts[i] < 0) {
						boosts[i] = 0;
					}
				}
				pokemon.setBoost(boosts);
				this.add('-clearnegativeboost', pokemon, '[silent]');
				this.add('-message', pokemon.name + "'s negative stat changes were removed!");
			},
		},
		secondary: null,
		target: "self",
		type: "Steel",
		contestType: "Tough",
	},
	focusblast: {
		num: 411,
		accuracy: 70,
		basePower: 120,
		category: "Special",
		shortDesc: "10% chance to lower the foe's SpD. Never misses if the user moves last.",
		name: "Focus Blast",
		pp: 5,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		onModifyMove(move, source, target) {
			if (target && (target.newlySwitched || !this.queue.willMove(target))) move.accuracy = true;
		},
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	/*
	aridabsorption: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "(Placeholder, Currently a Life Dew clone)",
		name: "Arid Absorption",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Shore Up", target);
		},
		heal: [1, 4],
		secondary: null,
		target: "self",
		type: "Ground",
	},
*/
	aridabsorption: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Heals by 33% of its max HP +33% and +1 Atk for every active Water-type.",
		name: "Arid Absorption",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Shore Up", target);
		},
		self: {
			onHit(pokemon, source, move) {
				this.heal(source.baseMaxhp / 3, source, pokemon);
			},
		},
		onHitField(target, source) {
			if (target.hasType('Water')) {
				this.heal(source.baseMaxhp / 3, source, target);
				this.boost({atk: 1}, source);
			}
			if (source.hasType('Water')) {
				this.heal(source.baseMaxhp / 3, source, target);
				this.boost({atk: 1}, source);
				this.damage(source.baseMaxhp / 3, source, target);
			}
		},
		secondary: null,
		target: "all",
		type: "Ground",
	},
	rototiller: {
		num: 563,
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Raises Atk/Def of grounded Grass types by 1, sets Grassy Terrain.",
		name: "Rototiller",
		pp: 10,
		priority: 0,
		flags: {distance: 1, nonsky: 1},
		onHitField(target, source) {
			this.field.setTerrain('grassyterrain');
			const targets: Pokemon[] = [];
			let anyAirborne = false;
			for (const pokemon of this.getAllActive()) {
				if (!pokemon.runImmunity('Ground')) {
					this.add('-immune', pokemon);
					anyAirborne = true;
					continue;
				}
				if (pokemon.hasType('Grass')) {
					// This move affects every grounded Grass-type Pokemon in play.
					targets.push(pokemon);
				}
			}
			if (!targets.length && !anyAirborne) return false; // Fails when there are no grounded Grass types or airborne Pokemon
			for (const pokemon of targets) {
				this.boost({atk: 1, def: 1}, pokemon, source);
			}
		},
		secondary: null,
		target: "all",
		type: "Ground",
		zMove: {boost: {atk: 1}},
		contestType: "Tough",
	},
	armthrust: {
		num: 292,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		name: "Arm Thrust",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	counterspell: {
		accuracy: 100,
		basePower: 110,
		category: "Special",
		shortDesc: "Uses target's SpA stat in damage calculation. -1 priority.",
		name: "Counterspell",
		pp: 15,
		priority: -1,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Psybeam", target);
		},
		overrideOffensivePokemon: 'target',
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Clever",
	},
	lightninglance: {
		accuracy: 100,
		basePower: 110,
		category: "Physical",
		shortDesc: "Lowers the user's Attack and Sp. Def by 1.",
		name: "Lightning Lance",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, defrost: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Charge", target);
			this.add('-anim', source, "Sacred Sword", target);
		},
		self: {
			boosts: {
				atk: -1,
				spd: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	lifedew: {
		num: 791,
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Heals the user by 50% of its max HP; 66% in Rain.",
		name: "Life Dew",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1, authentic: 1},
		onHit(pokemon) {
			let factor = 0.5;
			if (this.field.isWeather('raindance')) {
				factor = 0.667;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
		secondary: null,
		target: "allies",
		type: "Water",
	},
	trashtalk: {
		accuracy: 100,
		basePower: 85,
		category: "Special",
		shortDesc: "Prevents the target from using status moves for 1 turn.",
		name: "Trash Talk",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Confide", target);
			this.add('-anim', source, "Gunk Shot", target);
		},
		volatileStatus: 'trashtalk',
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Trash Talk');
			},
			onResidualOrder: 12,
			onEnd(target) {
				this.add('-end', target, 'move: Trash Talk');
			},
			onBeforeMovePriority: 5,
			onBeforeMove(attacker, defender, move) {
				if (!move.isZ && !move.isMax && move.category === 'Status' && move.id !== 'mefirst') {
					this.add('cant', attacker, 'move: Trash Talk', move);
					return false;
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Poison",
		contestType: "Cool",
	},
	deafeningshriek: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		shortDesc: "Target becomes immune to sound moves after being hit.",
		name: "Deafening Shriek",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hyper Voice", target);
			this.add('-anim', source, "Boomburst", target);
		},
		volatileStatus: 'deafeningshriek',
		condition: {
			onStart(target) {
				this.add('-start', target, 'move: Deafening Shriek');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (move.target !== 'self' && move.flags['sound']) {
					this.add('-immune', target, '[from] move: Deafening Shriek');
					return null;
				}
			},
		},
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	enchantedpunch: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		overrideDefensiveStat: 'spd',
		shortDesc: "Damages target based on Sp. Def, not Defense.",
		name: "Enchanted Punch",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1, punch: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Meteor Mash", target);
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Beautiful",
	},
	electroball: {
		num: 486,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Electro Ball",
		pp: 10,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		overrideOffensiveStat: 'spe',
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Clever",
		shortDesc: "Uses user's Spe stat as SpA in damage calculation.",
	},
	firepunch: {
		num: 7,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Fire Punch",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Tough",
	},
	icepunch: {
		num: 8,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Ice Punch",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	thunderpunch: {
		num: 9,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Thunder Punch",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: {
			chance: 10,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	skyuppercut: {
		num: 327,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "Hits Flying-types super effectively. Can hit Pokemon using Bounce, Fly, or Sky Drop.",
		name: "Sky Uppercut",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Flying') return 1;
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	crushclaw: {
		inherit: true,
		accuracy: 100,
		basePower: 20,
		shortDesc: "Hits twice. Lowers the target's Def after each hit.",
		pp: 20,
		multihit: 2,
		secondary: {
			chance: 100,
			boosts: {
				def: -1,
			},
		},
		type: "Dark",
		maxMove: {basePower: 100},
	},
	poisondart: {
		accuracy: true,
		basePower: 40,
		category: "Physical",
		shortDesc: "Usually goes first. 10% chance to poison foe.",
		name: "Poison Dart",
		pp: 30,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Poison Sting", target);
		},
		secondary: {
			chance: 10,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Cool",
	},
	acidicfists: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		shortDesc: "Destroys screens, unless the target is immune. 10% poison chance.",
		name: "Acidic Fists",
		pp: 10,
		priority: 0,
		flags: {punch: 1, contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Poison Jab", target);
			this.add('-anim', source, "Corrosive Gas", target);
		},
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			if (pokemon.runImmunity('Poison')) {
				pokemon.side.removeSideCondition('reflect');
				pokemon.side.removeSideCondition('lightscreen');
				pokemon.side.removeSideCondition('auroraveil');
			}
		},
		secondary: {
			chance: 10,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Cool",
	},
	mudspike: {
		num: 398,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		shortDesc: "10% poison chance, 30% if the user is a Poison-type",
		name: "Mud Spike",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Muddy Water", target);
			this.add('-anim', source, "Corrosive Gas", target);
		},
		onModifyMove(move, pokemon) {
			if (!pokemon.hasType('Poison')) return;
			if (!move.secondaries) move.secondaries = [];
			move.secondaries = move.secondaries.filter(s => s.chance !== 10 && s.status !== 'psn');
			move.secondaries.push({
				chance: 30,
				status: 'psn',
			});
		},
		secondary: {
			chance: 10,
			status: 'psn',
		},
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	bonemerang: {
		num: 155,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		shortDesc: "(Bugged) First hit has +1 priority, second hit has -1 priority.",
		name: "Bonemerang",
		pp: 10,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		onModifyMove(move) {
			if (move.hit !== 1) move.priority = -1;
		},
		secondary: null,
		target: "normal",
		type: "Ground",
		maxMove: {basePower: 130},
		contestType: "Tough",
	},
	rashpowder: {
		accuracy: 75,
		basePower: 0,
		category: "Status",
		shortDesc: "Burns the target.",
		name: "Rash Powder",
		pp: 30,
		priority: 0,
		flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Spore", target);
		},
		status: 'brn',
		secondary: null,
		target: "normal",
		type: "Grass",
		zMove: {boost: {def: 1}},
		contestType: "Clever",
	},
	payback: {
		num: 371,
		accuracy: 100,
		basePower: 50,
		basePowerCallback(pokemon, target, move) {
			if (this.queue.willMove(target)) {
				this.debug('Payback NOT boosted');
				return move.basePower;
			}
			this.debug('Payback damage boost');
			return move.basePower * 2;
		},
		category: "Physical",
		shortDesc: "Power doubles if the user moves last or the foe switches.",
		name: "Payback",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	revenge: {
		num: 279,
		accuracy: 100,
		basePower: 50,
		basePowerCallback(pokemon, target, move) {
			if (this.queue.willMove(target)) {
				this.debug('Revenge NOT boosted');
				return move.basePower;
			}
			this.debug('Revenge damage boost');
			return move.basePower * 2;
		},
		category: "Physical",
		shortDesc: "Power doubles if the user moves last or the foe switches.",
		name: "Revenge",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	avalanche: {
		num: 419,
		accuracy: 100,
		basePower: 50,
		basePowerCallback(pokemon, target, move) {
			if (this.queue.willMove(target)) {
				this.debug('Avalanche NOT boosted');
				return move.basePower;
			}
			this.debug('Avalanche damage boost');
			return move.basePower * 2;
		},
		category: "Physical",
		shortDesc: "Power doubles if the user moves last or the foe switches.",
		name: "Avalanche",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	technoblast: {
		num: 546,
		accuracy: 100,
		basePower: 90,
		onBasePower(basePower, source) {
			if (source.hasItem(['burndrive', 'dousedrive', 'chilldrive', 'shockdrive'])) {
				return this.chainModify(1.2);
			}
		},
		category: "Special",
		shortDesc: "Type varies based on the held Drive. 1.2x power when holding a Drive.",
		name: "Techno Blast",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, pulse: 1, bullet: 1},
		onModifyType(move, pokemon) {
			if (pokemon.ignoringItem()) return;
			move.type = this.runEvent('Drive', pokemon, null, move, 'Normal');
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	aggravate: {
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		shortDesc: "If the target is statused, applies Taunt.",
		name: "Aggravate",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Power Trip", target);
		},
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (target.status) {
					return !!target.addVolatile('taunt');
				}
				return false;
			},
		},
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	curse: {
		num: 174,
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Curses if Ghost, else -1 Spe, +2 Atk, +1 Def.",
		name: "Curse",
		pp: 10,
		priority: 0,
		flags: {},
		volatileStatus: 'curse',
		onModifyMove(move, source, target) {
			if (!source.hasType('Ghost')) {
				move.target = move.nonGhostTarget as MoveTarget;
			}
		},
		onTryHit(target, source, move) {
			if (!source.hasType('Ghost')) {
				delete move.volatileStatus;
				move.self = {boosts: {spe: -1, atk: 2, def: 1}};
			} else if ((move.volatileStatus && target.volatiles['curse']) || target.hasType(['Normal', 'Ghost']) ||
				target.volatiles['protect'] || target.volatiles['spikyshield'] || target.volatiles['banefulbunker']) {
				return false;
			}
		},
		condition: {
			onStart(target) {
				this.add('-start', target, 'move: Curse');
			},
			onResidualOrder: 8,
			onResidual(pokemon) {
				const target = this.effectState.source.side.active[pokemon.volatiles['curse'].sourcePosition];
				if (!target || target.fainted || target.hp <= 0) {
					this.debug('Nothing to curse');
					return;
				}
				const damage = this.damage(pokemon.baseMaxhp / 8, pokemon, target);
				if (damage) {
					this.heal(damage, target, pokemon);
				}
			},
		},
		onTryImmunity(target) {
			return (!target.hasType('Normal') || !target.hasType('Ghost'));
		},
		secondary: null,
		target: "randomNormal",
		nonGhostTarget: "self",
		type: "Ghost",
		zMove: {effect: 'curse'},
		contestType: "Tough",
	},
	octazooka: {
		num: 190,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		shortDesc: "100% chance to lower the target's Evasion by 1.",
		name: "Octazooka",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, pulse: 1, bullet: 1},
		secondary: {
			chance: 100,
			boosts: {
				evasion: -1,
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	signalbeam: {
		num: 324,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		shortDesc: "100% chance to lower the target's Speed by 1.",
		name: "Signal Beam",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Bug",
		contestType: "Tough",
	},
	aurorabeam: {
		num: 62,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		shortDesc: "100% chance to lower the target's Attack by 1.",
		name: "Aurora Beam",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Ice",
		contestType: "Tough",
	},
	venoshock: {
		num: 474,
		accuracy: 100,
		basePower: 65,
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility('comatose')) return move.basePower * 2;
			return move.basePower;
		},
		category: "Special",
		shortDesc: "Power doubles if the target has a status ailment.",
		name: "Venoshock",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Poison",
		contestType: "Beautiful",
	},
	attackorder: {
		num: 454,
		accuracy: 100,
		basePower: 75,
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility('comatose')) return move.basePower * 2;
			return move.basePower;
		},
		category: "Physical",
		shortDesc: "Power doubles if the target has a status ailment.",
		name: "Attack Order",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Flying",
		contestType: "Clever",
	},
	smother: {
		accuracy: 100,
		basePower: 65,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				this.debug('Smother damage boost');
				return move.basePower * 1.5;
			}
			this.debug('Smother NOT boosted');
			return move.basePower;
		},
		category: "Physical",
		shortDesc: "The target must move last next turn. 1.5x if the user moves first.",
		name: "Smother",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Wrap", target);
		},
		onHit(target, source) {
			target.addVolatile('smother', source);
		},
		condition: {
			duration: 2,
			onStart(target) {
				this.add('-start', target, 'Smother', '[silent]');
			},
			onFractionalPriority: -0.1,
			onResidualOrder: 22,
			onEnd(target) {
				this.add('-end', target, 'Smother', '[silent]');
			},
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Clever",
	},
	fierydance: {
		num: 552,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		name: "Fiery Dance",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, dance: 1},
		secondary: {
			chance: 50,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	snowmanjazz: {
		accuracy: 100,
		basePower: 85,
		category: "Special",
		shortDesc: "50% chance to raise the user's Sp. Atk by 1.",
		name: "Snowman Jazz",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, dance: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Quiver Dance", target);
			this.add('-anim', source, "Ice Beam", target);
		},
		secondary: {
			chance: 50,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	moonlitwaltz: {
		accuracy: 100,
		basePower: 85,
		category: "Special",
		shortDesc: "50% chance to raise the user's Sp. Atk by 1.",
		name: "Moonlit Waltz",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, dance: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Quiver Dance", target);
			this.add('-anim', source, "Dark Pulse", target);
		},
		secondary: {
			chance: 50,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Dark",
		contestType: "Beautiful",
	},
	petaldance: {
		num: 80,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		shortDesc: "50% chance to raise the user's Sp. Atk by 1.",
		name: "Petal Dance",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, dance: 1},
		secondary: {
			chance: 50,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
	},
	skysoiree: {
		accuracy: 100,
		basePower: 85,
		category: "Special",
		shortDesc: "50% chance to raise the user's Sp. Atk by 1.",
		name: "Sky Soiree",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, dance: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Quiver Dance", target);
			this.add('-anim', source, "Gust", target);
		},
		secondary: {
			chance: 50,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Flying",
		contestType: "Beautiful",
	},
	shadowpunch: {
		num: 325,
		accuracy: true,
		basePower: 80,
		category: "Physical",
		shortDesc: "Ignores burn, screens, and Substitute.",
		name: "Shadow Punch",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, punch: 1},
		onBasePower(basePower, pokemon) {
			if (pokemon.status === 'brn') {
				return this.chainModify(2);
			}
		},
		infiltrates: true,
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	bouncybubble: {
		inherit: true,
		isNonstandard: null,
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bubble", target);
		},
	},
	buzzybuzz: {
		inherit: true,
		isNonstandard: null,
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Discharge", target);
		},
	},
	sizzlyslide: {
		inherit: true,
		isNonstandard: null,
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flame Charge", target);
		},
	},
	glitzyglow: {
		inherit: true,
		isNonstandard: null,
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Psychic", target);
		},
	},
	baddybad: {
		inherit: true,
		isNonstandard: null,
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Photon Geyser", target);
		},
	},
	freezyfrost: {
		inherit: true,
		isNonstandard: null,
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Blizzard", target);
		},
	},
	sappyseed: {
		inherit: true,
		isNonstandard: null,
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Horn Leech", target);
		},
	},
	sparklyswirl: {
		inherit: true,
		isNonstandard: null,
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dazzling Gleam", target);
		},
	},
	// stuff that needs to be edited because of other stuff
	fling: {
		num: 374,
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		name: "Fling",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, mystery: 1},
		onPrepareHit(target, source, move) {
			if (source.ignoringItem()) return false;
			const item = source.getItem();
			if (!this.singleEvent('TakeItem', item, source.itemState, source, source, move, item)) return false;
			if (!item.fling) return false;
			move.basePower = item.fling.basePower;
			if (item.isBerry) {
				move.onHit = function (foe) {
					if (this.singleEvent('Eat', item, null, foe, null, null)) {
						this.runEvent('EatItem', foe, null, null, item);
						if (item.id === 'leppaberry') foe.staleness = 'external';
					}
					if (item.onEat) foe.ateBerry = true;
				};
			} else if (item.fling.effect) {
				move.onHit = item.fling.effect;
			} else {
				if (!move.secondaries) move.secondaries = [];
				if (item.fling.status) {
					move.secondaries.push({status: item.fling.status});
				} else if (item.fling.volatileStatus) {
					move.secondaries.push({volatileStatus: item.fling.volatileStatus});
				}
			}
			source.addVolatile('fling');
			if (item.id === 'boomerang') {
				source.removeVolatile('fling');
			}
		},
		condition: {
			onUpdate(pokemon) {
				const item = pokemon.getItem();
				pokemon.setItem('');
				pokemon.lastItem = item.id;
				pokemon.usedItemThisTurn = true;
				this.add('-enditem', pokemon, item.name, '[from] move: Fling');
				this.runEvent('AfterUseItem', pokemon, null, null, item);
				pokemon.removeVolatile('fling');
			},
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Cute",
	},
	knockoff: {
		num: 282,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Knock Off",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onBasePower(basePower, source, target, move) {
			const item = target.getItem();
			if (!this.singleEvent('TakeItem', item, target.itemState, target, target, move, item)) return;
			if (item.id && item.id !== 'boomerang') {
				return this.chainModify(1.5);
			}
		},
		onAfterHit(target, source) {
			if (source.hp) {
				const item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of] ' + source);
					if (item.id === 'boomerang') {
						this.add('-item', target, this.dex.items.get(item), '[from] item: Boomerang');
						target.setItem(item);
					}
				}
			}
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	stealthrock: {
		inherit: true,
		condition: {
			// this is a side condition
			onStart(side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn(pokemon) {
				if (
					pokemon.hasItem('heavydutyboots') || pokemon.hasItem('coalengine')
				) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
			},
		},
	},
	gravity: {
		num: 356,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Gravity",
		pp: 5,
		priority: 0,
		flags: {nonsky: 1},
		pseudoWeather: 'gravity',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', effect);
					return 7;
				} else if (source && source.hasItem('ironball')) {
					return 8;
				}
				return 5;
			},
			onStart() {
				this.add('-fieldstart', 'move: Gravity');
				for (const pokemon of this.getAllActive()) {
					let applies = false;
					if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
						applies = true;
						this.queue.cancelMove(pokemon);
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['skydrop']) {
						applies = true;
						this.queue.cancelMove(pokemon);

						if (pokemon.volatiles['skydrop'].source) {
							this.add('-end', pokemon.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
						}
						pokemon.removeVolatile('skydrop');
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
					if (applies) this.add('-activate', pokemon, 'move: Gravity');
				}
			},
			onModifyAccuracy(accuracy) {
				if (typeof accuracy !== 'number') return;
				return accuracy * 5 / 3;
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['gravity']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['gravity']) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onResidualOrder: 22,
			onEnd() {
				this.add('-fieldend', 'move: Gravity');
			},
		},
		secondary: null,
		target: "all",
		type: "Psychic",
		zMove: {boost: {spa: 1}},
		contestType: "Clever",
	},
	rapidspin: {
		num: 229,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Rapid Spin",
		pp: 40,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onAfterHit(target, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
			}
			if (pokemon.hp && pokemon.removeVolatile('curse')) {
				this.add('-end', pokemon, 'Curse', '[from] move: Rapid Spin', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		onAfterSubDamage(damage, target, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
			}
			if (pokemon.hp && pokemon.removeVolatile('curse')) {
				this.add('-end', pokemon, 'Curse', '[from] move: Rapid Spin', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
};
