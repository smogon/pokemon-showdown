export const Moves: { [k: string]: ModdedMoveData; } = {
	tentacatch: {
		num: -1,
		accuracy: 85,
		basePower: 60,
		category: "Physical",
		name: "Tentacatch",
		shortDesc: "Traps and damages the target for 4-5 turns. Lowers the target's Atk by 1 stage.",
		desc: "Traps and damages the target for 4-5 turns. Lowers the target's Atk by 1 stage.",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Toxic Thread", target);
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	schuss: {
		num: -2,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		shortDesc: "User takes 1/3 of damages inflicted.",
		name: "Schuss",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, gravity: 1 },
		recoil: [33, 100],
		secondary: null,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Icicle Crash", target);
		},
		target: "normal",
		type: "Ice",
		contestType: "Cool",
	},
	goodfishing: {
		num: -3,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Good Fishing",
		shortDesc: "1.5x if foe holds an item. Removes item and heals 10% of max HP.",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onBasePower(basePower, source, target, move) {
			const item = target.getItem();
			if (!this.singleEvent('TakeItem', item, target.itemState, target, target, move, item)) return;
			if (item.id) {
				return this.chainModify(1.5);
			}
		},
		onAfterHit(target, source) {
			if (source.hp) {
				const item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Good Fishing', '[of] ' + source);
					this.heal(source.maxhp / 10, source);
				}
			}
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Brave Bird", target);
		},
		secondary: null,
		target: "normal",
		type: "Flying",
		contestType: "Tough",
	},
	magisterialwind: {
		num: -4,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		shortDesc: "Ignores the target's ability, cannot be redirected.",
		name: "Magisterial Wind",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		ignoreAbility: true,
		tracksTarget: true,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Tailwind", target);
		},
		secondary: null,
		target: "normal",
		type: "Flying",
		contestType: "Cool",
	},
	stellarpunch: {
		num: -5,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		shortDesc: "Ignores the target's ability.",
		name: "Stellar Punch",
		pp: 10,
		priority: 0,
		flags: { punch: 1, contact: 1, protect: 1, mirror: 1 },
		ignoreAbility: true,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dynamic Punch", target);
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	toxicthread: {
		inherit: true,
		status: 'tox',
		desc: "Lowers the target's Speed by 1 stage and badly poisons it.",
		shortDesc: "Lowers the target's Speed by 1 and badly poisons it.",
	},
	toxicsting: {
		shortDesc: "50% drain; badly poison target.",
		num: -6,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Toxic Sting",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1 },
		drain: [1, 2],
		secondary: {
			chance: 100,
			status: 'tox',
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Poison Fang", target);
		},
		target: "normal",
		type: "Poison",
	},
	detectmagic: {
		num: -7,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Detect Magic",
		desc: "This move is super effective on Dark type targets.",
		shortDesc: "Super effective on Dark targets.",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onEffectiveness(typeMod, target, type) {
			if (type === 'Dark') return 1;
		},
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Psychic'] = true;
			}
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Psychic", target);
		},
		target: "normal",
		type: "Psychic",
		contestType: "Beautiful",
	},
	dispelmagic: {
		num: -8,
		accuracy: true,
		basePower: 70,
		category: "Special",
		name: "Dispel Magic",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onHit(target) {
			target.clearBoosts();
			this.add('-clearboost', target);
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Psyshock", target);
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		shortDesc: "The target is cleared from all its stat changes.",
	},
	photopower: {
		num: -9,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Photo-Power",
		shortDesc: "Raises user's Sp. Atk by 2 and Speed by 1 in Sun.",
		pp: 5,
		priority: 0,
		flags: { snatch: 1 },
		onModifyMove(move, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) move.boosts = { spa: 2, spe: 1 };
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Growth", target);
		},
		secondary: null,
		target: "self",
		type: "Grass",
		zMove: { boost: { spa: 1 } },
		contestType: "Beautiful",
	},
	draconicwrath: {
		num: -10,
		accuracy: 100,
		basePower: 50,
		basePowerCallback(pokemon, target, move) {
			if (!target.newlySwitched) {
				this.debug('Draconic Wrath damage boost');
				return move.basePower * 2;
			}
			this.debug('Draconic Wrath NOT boosted');
			return move.basePower;
		},
		category: "Physical",
		name: "Draconic Wrath",
		shortDesc: "If a foe isn't switching in, hits it at 2x power.",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Outrage", target);
		},
		secondary: null,
		target: "normal",
		type: "Dragon",
	},
	purifyingstream: {
		num: -11,
		accuracy: true,
		basePower: 90,
		category: "Special",
		name: "Purifying Stream",
		shortDesc: "Resets all of the target's stat stages to 0.",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onHit(target) {
			target.clearBoosts();
			this.add('-clearboost', target);
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Scald", target);
		},
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	railwaysmash: {
		num: -12,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Railway Smash",
		shortDesc: "Has 33% recoil.",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		recoil: [33, 100],
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Iron Head", target);
		},
		target: "normal",
		type: "Steel",
	},
	goldenexperience: {
		num: -13,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Golden Experience",
		shortDesc: "Heal 50% of damages dealt.",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, heal: 1 },
		drain: [1, 2],
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Moonblast", target);
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Tough",
	},
	dimensionalbleeding: {
		num: -14,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Dimensional Bleeding",
		shortDesc: "Physical if Atk > SpA.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hyperspace Fury", target);
		},
		secondary: null,
		target: "normal",
		type: "Dark",
	},
	frostbite: {
		num: -15,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "The Pokémon at the user's position steals some of the target's maximum HP at the end of each turn. Damage begins at 1/16, rounded down, and increases each turn like Toxic. If Big Root is held by the recipient, the HP recovered is 1.3x normal, rounded half down. If the target uses Baton Pass, the replacement will continue being leeched. If the target switches out, the effect ends.",
		shortDesc: "Target's HP is restored to user every turn. Damage increases like Toxic.",
		name: "Frostbite",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		volatileStatus: 'frostbite',
		condition: {
			onStart(target) {
				this.effectState.stage = 0;
				this.add('-start', target, 'move: Frostbite');
			},
			onResidualOrder: 8,
			onResidual(pokemon) {
				if (this.effectState.stage < 15) {
					this.effectState.stage++;
				}
				// const target = this.effectState.source.side.active[pokemon.volatiles['frostbite'].sourcePosition];
				for (const target of this.getAllActive()) {
					if (pokemon.volatiles['frostbite']) {
						const damage = this.damage(this.clampIntRange(pokemon.baseMaxhp / 16, 1) * this.effectState.stage, pokemon, target,); //'[silent]'); //looking at that soon
						if (damage) {
							this.heal(damage, target, pokemon);
						}
					}
					if (!target || target.fainted || target.hp <= 0) {
						this.debug('Nothing to leech into');
						return;
					}
				}
			},
		},
		onTryImmunity(target) {
			return (!target.hasType('Fire') && !target.hasType('Ice'));
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Icy Wind", target);
		},
		secondary: null,
		target: "normal",
		type: "Ice",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
	},
	aspiravoid: {
		num: -16,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Aspira Void",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1 },
		drain: [1, 2],
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dark Pulse", target);
		},
		secondary: null,
		target: "normal",
		shortDesc: "Heals 50% of damage dealt.",
		type: "Dark",
		contestType: "Clever",
	},
	underdog: {
		num: -17,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Underdog",
		shortDesc: "BP x2 if target's Atk > user's Atk.",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onBasePower(basePower, source, target, move) {
			const targetAtk = target.storedStats.atk;
			const sourceAtk = source.storedStats.atk;
			if (targetAtk >= sourceAtk) {
				return this.chainModify(2);
			}
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Facade", target);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	flamingsphere: {
		num: -18,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		shortDesc: "Usually goes first.",
		name: "Flaming Sphere",
		pp: 20,
		priority: 1,
		flags: { bullet: 1, protect: 1, mirror: 1 },
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Pyro Ball", target);
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Tough",
	},
	fireball: {
		num: -19,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Fire Ball",
		shortDesc: "Ends all existing terrains.",
		pp: 10,
		priority: 0,
		flags: { bullet: 1, protect: 1, mirror: 1 },
		onHit() {
			this.field.clearTerrain();
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Pyro Ball", target);
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Fire",
		contestType: "Beautiful",
	},
	backfire: {
		num: -20,
		accuracy: 100,
		basePower: 65,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				this.debug('Backfire NOT boosted');
				return move.basePower;
			}
			this.debug('Backfire damage boost');
			return move.basePower * 2;
		},
		priority: -1,
		category: "Physical",
		name: "Backfire",
		pp: 15,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Overheat", target);
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Tough",
		shortDesc: "Usually goes last. Power doubles if the user moves after the target.",
	},
	highwater: {
		num: -21,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP, rounded half up.",
		shortDesc: "Heals the user by 50% of its max HP.",
		name: "High Water",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1 },
		heal: [1, 2],
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Life Dew", target);
		},
		secondary: null,
		target: "self",
		type: "Water",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	seajaws: {
		num: -22,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Sea Jaws",
		pp: 10,
		priority: 0,
		flags: { bite: 1, contact: 1, protect: 1, mirror: 1 },
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			if (pokemon.runImmunity('Water')) {
				pokemon.side.removeSideCondition('reflect');
				pokemon.side.removeSideCondition('lightscreen');
				pokemon.side.removeSideCondition('auroraveil');
			}
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fishious Rend", target);
		},
		secondary: null,
		desc: "If this attack does not miss, the effects of Reflect, Light Screen, and Aurora Veil end for the target's side of the field before damage is calculated.",
		shortDesc: "Destroys screens, unless the target is immune.",
		target: "normal",
		type: "Water",
		contestType: "Clever",
	},
	parallelcircuit: {
		num: -23,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		name: "Parallel Circuit",
		shortDesc: "Hits 2-5 times in one turn.",
		desc: "Hits 2-5 times in one turn.",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		multihit: [2, 5],
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bolt Beak", target);
		},
		secondary: null,
		target: "normal",
		type: "Electric",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
		contestType: "Cool",
	},
	condensate: {
		num: -24,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		name: "Condensate",
		shortDesc: "Power x2 if on Misty Terrain.",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onBasePower(basePower, source) {
			if (this.field.isTerrain('mistyterrain') && source.isGrounded()) {
				this.debug('terrain buff');
				return this.chainModify(2);
			}
		},
		onModifyMove(move, source, target) {
			if (this.field.isTerrain('mistyterrain') && source.isGrounded()) {
				move.target = 'allAdjacentFoes';
			}
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Icy Wind", target);
		},
		secondary: null,
		target: "normal",
		type: "Ice",
	},
	chillblain: {
		num: -25,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		name: "Chillblain",
		shortDesc: "Freezes the target.",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		status: 'frz',
		ignoreImmunity: false,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Icy Wind", target);
		},
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Cool",
	},
	monkeypunch: {
		num: -26,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Monkey Punch",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		onEffectiveness(typeMod, target, type) {
			if (type === 'Grass' || type === 'Bug') return 1;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Close Combat", target);
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
		shortDesc: "Super effective on Bug and Grass targets.",
	},
	indomitablespirit: {
		num: -27,
		accuracy: 95,
		basePower: 75,
		category: "Special",
		shortDesc: "Power doubles if last move failed or was resisted.",
		name: "Indomitable Spirit",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		basePowerCallback(pokemon, target, move) {
			if (pokemon.moveLastTurnResult === false) return move.basePower * 2; // if the last move failed
			if (pokemon.volatiles['indomitablespirit']?.boost === 'lastMoveResisted') return move.basePower * 2; // if the last move was resisted - problematic line
			return move.basePower;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Vacuum Wave", target);
		},
		condition: { // this is *not* meant to be set as part of the move; partially defined in scripts.ts!
			onModifyDamage(damage, source, target, move) {
				if (target.getMoveHitData(move).typeMod < 0) {
					this.effectState.boost = 'thisMoveResisted';
					this.debug('set Indomitable Spirit boost');
				}
			},
			onBeforeMove(pokemon) {
				if (this.effectState.boost === 'thisMoveResisted') {
					this.effectState.boost = 'lastMoveResisted';
				} else {
					this.effectState.boost = null;
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
	},
	cosmicpunch: {
		num: -28,
		accuracy: 100,
		basePower: 80,
		desc: "Deals damage to the target based on its Special Defense instead of Defense.",
		shortDesc: "Damages target based on Sp. Def, not Defense.",
		category: "Physical",
		overrideDefensiveStat: 'spd',
		name: "Cosmic Punch",
		pp: 10,
		priority: 0,
		flags: { punch: 1, protect: 1, mirror: 1 },
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dynamic Punch", target);
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
	},
	musclecare: {
		num: -29,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Muscle Care",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1 },
		heal: [1, 2],
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bulk Up", target);
		},
		secondary: null,
		target: "self",
		type: "Fighting",
		zMove: { effect: 'clearnegativeboost' },
		desc: "The user restores 1/2 of its maximum HP, rounded half up.",
		shortDesc: "Heals the user by 50% of its max HP.",
		contestType: "Clever",
	},
	dissolution: {
		num: -30,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Dissolution",
		pp: 15,
		desc: "If the user moves after the target, the target's Ability is rendered ineffective as long as it remains active. If the target uses Baton Pass, the replacement will remain under this effect. If the target's Ability is As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Tera Shift, Zen Mode, or Zero to Hero, this effect does not happen, and receiving the effect through Baton Pass ends the effect immediately.",
		shortDesc: "Nullifies the foe(s) Ability if the foe(s) move first.",
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onHit(target) {
			if (target.getAbility().flags['cantsuppress']) return;
			if (target.newlySwitched || this.queue.willMove(target)) return;
			target.addVolatile('gastroacid');
		},
		onAfterSubDamage(damage, target) {
			if (target.getAbility().flags['cantsuppress']) return;
			if (target.newlySwitched || this.queue.willMove(target)) return;
			target.addVolatile('gastroacid');
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Acid Spray", target);
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Poison",
	},
	landslide: {
		num: -31,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Landslide",
		shortDesc: "Removes the hazards on the field. Lowers the target's Speed by one stage.",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({ spe: -1 });
			const removeTarget = [
				'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			const removeAll = [
				'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Landslide', '[of] ' + source);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Landslide', '[of] ' + source);
					success = true;
				}
			}
			return success;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Mud Shot", target);
		},
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	epicenter: {
		num: -32,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Epicenter",
		desc: "Deals damage two turns after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move or Doom Desire is already in effect for the target's position.",
		shortDesc: "Hits two turns after being used.",
		pp: 10,
		priority: 0,
		flags: { futuremove: 1, protect: 1, mirror: 1 },
		ignoreImmunity: true,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 3,
				move: 'epicenter',
				source: source,
				moveData: {
					id: 'epicenter',
					name: "epicenter",
					accuracy: 100,
					basePower: 120,
					category: "Physical",
					priority: 0,
					flags: {},
					ignoreImmunity: false,
					effectType: 'Move',
					isFutureMove: true,
					type: 'Ground',
				},
			});
			this.add('-start', source, 'move: Epicenter');
			return null;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Mud Shot", target);
		},
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	downdraft: {
		num: -33,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Downdraft",
		desc: "If the opponent is Flying type or has Levitate, the opponent's Speed is lowered by one stage.",
		shortDesc: "-1 Speed if the target has Levitate or is Flying type.",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onAfterHit(this, target, source, move) {
			if (!(target.isGrounded())) {
				this.boost({ spe: -1 }, target, target, null, true);
			}
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hurricane", target);
		},
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	clearmind: {
		num: -34,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Clear Mind",
		pp: 15,
		priority: 0,
		flags: { snatch: 1 },
		boosts: {
			spa: 1,
			accuracy: 1,
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Calm Mind", target);
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		desc: "Raises the user's Special Attack and accuracy by 1 stage.",
		shortDesc: "Raises the user's Sp. Attack and accuracy by 1.",
		zMove: { boost: { spa: 1 } },
		contestType: "Cute",
	},
	golemstrike: {
		num: -35,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Golem Strike",
		pp: 10,
		shortDesc: "10% chance to lower target's Def",
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: {
			chance: 10,
			boosts: {
				def: -1,
			},
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rock Wrecker", target);
		},
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	punishingblow: {
		num: -36,
		accuracy: 90,
		basePower: 80,
		category: "Physical",
		name: "Punishing Blow",
		shortDesc: "If the target has boosts, this move always results in a critical hit.",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onModifyMove(move, pokemon, target) {
			let hasBoost = false;
			let i: BoostID;
			if (!target) return;
			for (i in target.boosts) {
				if (target.boosts[i] !== 0) hasBoost = true;
			}
			if (hasBoost) move.critRatio = 5;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Wicked Blow", target);
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	contrariety: {
		num: -37,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Contrariety",
		shortDesc: "Every Pokemon on the field gets Contrary as an ability.",
		pp: 15,
		priority: 0,
		flags: {},
		onHitField() {
			let success = false;
			for (const pokemon of this.getAllActive()) {
				if (pokemon.ability === 'truant' || pokemon.ability === 'contrary' || pokemon.getAbility().flags['cantsuppress']) continue;
				const oldAbility = pokemon.setAbility('contrary');
				if (oldAbility) this.add('-ability', pokemon, 'Contrary', '[from] move: Contrary');
				success = true;
			}
			return success;
		},
		secondary: null,
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Torment", target, source);
		},
		target: "all",
		type: "Dark",
		zMove: { boost: { def: 1 } },
	},
	blackflash: {
		num: -38,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Black Flash",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			boosts: {
				spa: -1,
				spd: -1,
			},
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Night Daze", target);
		},
		secondary: null,
		target: "normal",
		shortDesc: "Lowers the user's SpA and SpD by one afterward.",
		type: "Dark",
		contestType: "Tough",
	},
	hypnotichorror: {
		num: -39,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Hypnotic Horror",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			boosts: {
				spa: -1,
				spd: -1,
			},
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hypnosis", target);
			this.add('-anim', source, "Psycho Boost", target);
		},
		secondary: null,
		target: "normal",
		shortDesc: "Lowers the user's SpA and SpD by one afterward.",
		type: "Psychic",
		contestType: "Tough",
	},
	sneakyassault: {
		num: -40,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		shortDesc: "Hits three times. Each hit has 10% to lower the target's Def.",
		name: "Sneaky Assault",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, slicing: 1 },
		multihit: 3,
		secondary: {
			chance: 10,
			boosts: {
				def: -1,
			},
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Lash Out", target);
		},
		target: "normal",
		type: "Dark",
		contestType: "Cool",
	},
	mercuryshot: {
		num: -41,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Mercury Shot",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		thawsTarget: true,
		secondary: {
			chance: 30,
			status: 'psn',
		},
		shortDesc: "30% to poison the target.",
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flash Cannon", target);
		},
		target: "normal",
		type: "Steel",
		contestType: "Tough",
	},
	sweetheart: {
		num: -42,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		name: "Sweetheart",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		self: {
			onHit(pokemon, source, move) {
				this.add('-activate', source, 'move: Aromatherapy');
				for (const ally of source.side.pokemon) {
					if (ally !== source && (ally.volatiles['substitute'] && !move.infiltrates)) {
						continue;
					}
					ally.cureStatus();
				}
			},
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dazzling Gleam", target);
		},
		shortDesc: "Heals the user's party's status conditions. Uses SpD instead of SpA.",
		overrideOffensiveStat: 'spd',
		secondary: null,
		target: "normal",
		type: "Fairy",
	},
	chakraterrain: {
		num: -43,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Chakra Terrain",
		desc: "Summons Chakra Terrain for 5 turns. All Fighting moves have full accuracy, and pulse moves have x1.3 power.",
		shortDesc: "Summons Chakra Terrain. 100% Acc for Fighting moves; x1.3 BP for pulse moves.",
		pp: 10,
		priority: 0,
		flags: { nonsky: 1 },
		terrain: 'chakraterrain',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if ((move.type === 'Fighting' || move.flags['pulse']) && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('chakra terrain boost');
					return this.chainModify([5325, 4096]);
				}
			},
			onModifyAccuracy(accuracy, target, source, move) {
				if (typeof accuracy !== 'number') return;
				if (move.type ==='Fighting') return true;
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Chakra Terrain', '[from] ability: ' + effect.name, '[of] ' + source);
					this.add('-message', "Fighting-type moves used by grounded Pokémon won't miss.");
					this.add('-message', "Fighting-type and Pulse moves will be boosted by 30%.");
				} else {
					this.add('-fieldstart', 'move: Chakra Terrain');
					this.add('-message', "Fighting-type moves used by grounded Pokémon won't miss.");
					this.add('-message', "Fighting-type and Pulse moves will be boosted by 30%.");
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Chakra Terrain');
			},
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Psychic Terrain", target);
		},
		secondary: null,
		target: "all",
		type: "Fighting",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	naturepower: {
		inherit: true,
		onTryHit(target, pokemon) {
			let move = 'triattack';
			if (this.field.isTerrain('electricterrain')) {
				move = 'thunderbolt';
			} else if (this.field.isTerrain('grassyterrain')) {
				move = 'energyball';
			} else if (this.field.isTerrain('mistyterrain')) {
				move = 'moonblast';
			} else if (this.field.isTerrain('psychicterrain')) {
				move = 'psychic';
			} else if (this.field.isTerrain('chakraterrain')) {
				move = 'aurasphere';
			}
			this.actions.useMove(move, pokemon, target);
			return null;
		},
	},
	terrainpulse: {
		inherit: true,
		onModifyType(move, pokemon) {
			if (!pokemon.isGrounded()) return;
			switch (this.field.terrain) {
				case 'electricterrain':
					move.type = 'Electric';
					break;
				case 'grassyterrain':
					move.type = 'Grass';
					break;
				case 'mistyterrain':
					move.type = 'Fairy';
					break;
				case 'psychicterrain':
					move.type = 'Psychic';
					break;
				case 'chakraterrain':
					move.type = 'Fighting';
					break;
			}
		},
		onModifyMove(move, pokemon) {
			if (this.field.terrain && pokemon.isGrounded()) {
				move.basePower *= 2;
			}
		},
	},
	secretpower: {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (this.field.isTerrain('')) return;
			move.secondaries = [];
			if (this.field.isTerrain('electricterrain')) {
				move.secondaries.push({
					chance: 30,
					status: 'par',
				});
			} else if (this.field.isTerrain('grassyterrain')) {
				move.secondaries.push({
					chance: 30,
					status: 'slp',
				});
			} else if (this.field.isTerrain('mistyterrain')) {
				move.secondaries.push({
					chance: 30,
					boosts: {
						spa: -1,
					},
				});
			} else if (this.field.isTerrain('psychicterrain')) {
				move.secondaries.push({
					chance: 30,
					boosts: {
						spe: -1,
					},
				});
			} else if (this.field.isTerrain('chakraterrain')) {
				move.secondaries.push({
					chance: 30,
					boosts: {
						def: -1,
					},
				});
			}
		},
	},
	camouflage: {
		inherit: true,
		onHit(target) {
			let newType = 'Normal';
			if (this.field.isTerrain('electricterrain')) {
				newType = 'Electric';
			} else if (this.field.isTerrain('grassyterrain')) {
				newType = 'Grass';
			} else if (this.field.isTerrain('mistyterrain')) {
				newType = 'Fairy';
			} else if (this.field.isTerrain('psychicterrain')) {
				newType = 'Psychic';
			} else if (this.field.isTerrain('chakraterrain')) {
				newType = 'Fighting';
			}

			if (target.hasItem('identitycard')) return false;
			if (target.getTypes().join() === newType || !target.setType(newType)) return false;
			this.add('-start', target, 'typechange', newType);
		},
	},
	dragonpulse: {
		inherit: true,
		basePower: 90,
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		desc: "This move has 10% chance to lower the opponent's SpD.",
		shortDesc: "10% chance to lower opponent's SpD.",
	},
	dragonclaw: {
		inherit: true,
		basePower: 95,
		secondary: {
			chance: 10,
			boosts: {
				def: -1,
			},
		},
		shortDesc: "Has a 10% to lower the target's Def.",
	},
	sonicboom: {
		inherit: true,
		damage: null,
		basePower: 40,
		accuracy: 100,
		category: "Special",
		desc: "Priority +1, Sound move.",
		shortDesc: "Usually goes first. Sound Move.",
		name: "Sonic Boom",
		priority: 1,
		isNonstandard: null,
		flags: { sound: 1, protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	rockwrecker: {
		inherit: true,
		shortDesc: "Cannot be selected the turn after it's used.",
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1, cantusetwice: 1 },
		self: null,
	},
	triplekick: {
		inherit: true,
		accuracy: 90,
		basePower: 20,
	},
	playrough: {
		inherit: true,
		accuracy: 100,
	},
	payback: {
		inherit: true,
		basePower: 65,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				this.debug('Payback NOT boosted');
				return move.basePower;
			}
			this.debug('Payback damage boost');
			return move.basePower * 2;
		},
		shortDesc: "Usually goes last. Power doubles if the user moves after the target.",
		priority: -1,
	},
	avalanche: {
		inherit: true,
		basePower: 65,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				this.debug('Avalanche NOT boosted');
				return move.basePower;
			}
			this.debug('Avalanche damage boost');
			return move.basePower * 2;
		},
		shortDesc: "Usually goes last. Power doubles if the user moves after the target.",
		priority: -1,
	},
	armthrust: {
		inherit: true,
		basePower: 25,
	},
	crosschop: {
		inherit: true,
		accuracy: 85,
		basePower: 120,
		pp: 10,
		shortDesc: "No additional effect.",
		desc: "No additional effect.",
	},
	submission: {
		inherit: true,
		isViable: true,
		accuracy: 100,
		basePower: 120,
		pp: 15,
		recoil: [33, 100],
		desc: "If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 33% recoil.",
	},
	powdersnow: {
		inherit: true,
		isViable: true,
		basePower: 20,
		pp: 20,
		secondary: {
			chance: 100,
			status: 'frz',
		},
		desc: "Has a 100% chance to freeze the target.",
		shortDesc: "100% chance to freeze the target.",
	},
	nightdaze: {
		inherit: true,
		isViable: true,
		accuracy: 100,
		basePower: 95,
		desc: "Has a 20% chance to lower the target's Attack by 1 stage.",
		shortDesc: "20% chance to lower the target's Atk by 1.",
		secondary: {
			chance: 20,
			boosts: {
				atk: -1,
			},
		},
	},
	lowsweep: {
		inherit: true,
		basePower: 60,
	},
	powergem: {
		inherit: true,
		basePower: 95,
		desc: "Has a 10% chance to raise the user's Defense by 1 stage.",
		shortDesc: "10% chance to raise user's Defense by 1.",
		secondary: {
			chance: 10,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
	},
	aeroblast: {
		inherit: true,
		accuracy: 100,
		desc: "Has a higher chance for a critical hit, and a 20% chance to freeze the target.",
		shortDesc: "High critical hit ratio. 20% chance to freeze the target.",
		secondary: {
			chance: 20,
			status: 'frz',
		},
	},
	relicsong: {
		inherit: true,
		basePower: 95,
		secondary: null,
		self: {
			sideCondition: 'luckychant',
		},
		desc: "This move summons Lucky Chant for 5 turns upon use. If this move is successful on at least one target and the user is a Meloetta, it changes to Pirouette Forme if it is currently in Aria Forme, or changes to Aria Forme if it is currently in Pirouette Forme. This forme change does not happen if the Meloetta has the Sheer Force Ability. The Pirouette Forme reverts to Aria Forme when Meloetta is not active.",
		shortDesc: "Summons Lucky Chant. Meloetta transforms.",
	},
	multiattack: {
		inherit: true,
		desc: "This move's type depends on the user's primary type. If the user's primary type is typeless, this move's type is the user's secondary type if it has one, otherwise the added type from Forest's Curse or Trick-or-Treat. This move is typeless if the user's type is typeless alone.",
		shortDesc: "Type varies based on the user's primary type.",
		onModifyType(move, pokemon) {
			let type = pokemon.types[0];
			if (type === "Bird") type = "???";
			move.type = type;
		},
	},
	bouncybubble: {
		inherit: true,
		basePower: 90,
		isNonstandard: null,
	},
	buzzybuzz: {
		inherit: true,
		basePower: 120,
		isNonstandard: null,
		shortDesc: "10% to paralyze target.",
		pp: 10,
		secondary: {
			chance: 10,
			status: 'par',
		},
	},
	sizzlyslide: {
		inherit: true,
		basePower: 85,
		isNonstandard: null,
		shortDesc: "30% chance to burn target.",
		secondary: {
			chance: 30,
			status: 'brn',
		},
	},
	glitzyglow: {
		inherit: true,
		isNonstandard: null,
		desc: "Lowers the target's Special Attack and Special Defense by 1 stage.",
		shortDesc: "Lowers target's Sp. Atk, Sp. Def by 1.",
		self: null,
		boosts: {
			spa: -1,
			spd: -1,
		},
	},
	baddybad: {
		inherit: true,
		isNonstandard: null,
		category: "Physical",
		desc: "Lowers the target's Attack and Defense by 1 stage.",
		shortDesc: "Lowers target's Atk, Def by 1.",
		self: null,
		boosts: {
			atk: -1,
			def: -1,
		},
	},
	sappyseed: {
		inherit: true,
		accuracy: 100,
		isNonstandard: null,
	},
	freezyfrost: {
		inherit: true,
		isNonstandard: null,
	},
	sparklyswirl: {
		inherit: true,
		accuracy: 100,
		isNonstandard: null,
		self: {
			sideCondition: 'luckychant',
		},
		desc: "This move summons Lucky Chant for 5 turns upon use.",
		shortDesc: "Summons Lucky Chant.",
	},
	veeveevolley: {
		inherit: true,
		isNonstandard: null,
	},
	pikapapow: {
		inherit: true,
		isNonstandard: null,
	},
	splishysplash: {
		inherit: true,
		isNonstandard: null,
	},
	zippyzap: {
		inherit: true,
		isNonstandard: null,
		basePower: 50,
		willCrit: true,
		secondary: null,
		desc: "This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Battle Armor or Shell Armor Abilities.",
		shortDesc: "Goes first. Always results in a critical hit.",
	},
	floatyfall: {
		inherit: true,
		isNonstandard: null,
	},
	ragingfury: {
		inherit: true,
		basePower: 130,
		self: null,
		onAfterMove(pokemon) { },
		basePowerCallback(pokemon, target, move) {
			let bp = move.basePower;
			if (pokemon.volatiles['ragingfury'] && pokemon.volatiles['ragingfury'].hitCount) {
				bp -= 30 * pokemon.volatiles['ragingfury'].hitCount;
			}
			if (pokemon.status !== 'slp') pokemon.addVolatile('ragingfury');
			this.debug("Rollout bp: " + bp);
			return bp;
		},
		condition: {
			duration: 2,
			onStart() {
				this.effectState.hitCount = 1;
			},
			onRestart() {
				this.effectState.hitCount++;
				if (this.effectState.hitCount < 5) {
					this.effectState.duration = 2;
				}
			},
		},
		shortDesc: "Lowers in BP after each use (5 turns max).",
		desc: "This move lowers in power after each use (5 turns max).",
	},
	bittermalice: {
		inherit: true,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			if (target.status === 'frz' || target.hasAbility('comatose')) return move.basePower * 2;
			return move.basePower;
		},
		desc: "Has a 30% chance to freeze the target. Power doubles if the target has a non-volatile status condition.",
		shortDesc: "30% freeze. 2x power if target is already statused.",
		secondary: {
			chance: 30,
			status: 'frz',
		},
	},
	shelter: {
		inherit: true,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'shelter',
		onTryHit(target, source, move) {
			return !!this.queue.willAct() && this.runEvent('StallMove', target);
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
				if (!move.flags['protect']) {
					if (move.isZ || (move.isMax && !move.breaksProtect)) target.getMoveHitData(move).zBrokeProtect = true;
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
				if (move.flags['contact']) {
					source.clearBoosts();
					this.add('-clearboost', source);
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && move.flags['contact']) {
					source.clearBoosts();
					this.add('-clearboost', source);
				}
			},
		},
		boosts: null,
		shortDesc: "Protects from moves. Contact: resets opponent's stat boosts.",
	},
	triplearrows: {
		inherit: true,
		volatileStatus: 'focusenergy',
		secondaries: [
			{
				chance: 50,
				boosts: {
					def: -1,
				},
			}, {
				chance: 100,
				self: {
					boosts: {
						spe: 1,
					},
				},
			},
		],
		desc: "100% chance to raise the user's Speed by 1 stage. Raise crit ratio by 2 stages. Target: 50% -1 Defense.",
		shortDesc: "100% chance to +1 Speed; +2 crit ratio; -1 Def to target.",
	},
	direclaw: {
		inherit: true,
		basePower: 90,
		shortDesc: "50% chance to poison the target.",
		secondary: {
			chance: 50,
			status: 'psn',
		},
	},
	fissure: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
		ohko: false,
		desc: "10% chance to lower the target's Defense by 1.",
		shortDesc: "10% chance to lower the target's Defense by 1.",
		pp: 10,
		secondary: {
			chance: 10,
			boosts: {
				def: -1,
			},
		},
	},
	sheercold: {
		inherit: true,
		accuracy: 100,
		basePower: 150,
		ohko: false,
		desc: "Sets Snow. User faints after use.",
		shortDesc: "Sets Snow. User faints after use.",
		weather: 'snow',
		secondary: null,
		selfdestruct: "always",
	},
	mistyexplosion: {
		inherit: true,
		basePower: 150,
		desc: "Sets Misty Terrain. User faints after use.",
		shortDesc: "Sets Misty Terrain. User faints after use.",
		terrain: 'mistyterrain',
	},
	guillotine: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
		ohko: false,
		desc: "Raises user's Attack by 1 if this KOes the target.",
		shortDesc: "Raises user's Attack by 1 if this KOes the target.",
		pp: 10,
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.boost({ atk: 1 }, pokemon, pokemon, move);
		},
	},
	horndrill: {
		inherit: true,
		accuracy: 85,
		basePower: 120,
		ohko: false,
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		pp: 10,
		type: "Steel",
	},
	hiddenpower: {
		inherit: true,
		basePower: 80,
		shortDesc: "Varies in type based on the user's IVs. Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowerbug: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowerdark: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowerdragon: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowerelectric: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowerfighting: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowerfire: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowerflying: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowerghost: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowergrass: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowerground: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowerice: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowerpoison: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowerpsychic: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowerrock: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowersteel: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hiddenpowerwater: {
		inherit: true,
		basePower: 80,
		shortDesc: "Physical if user's Atk > Sp. Atk.",
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	snipeshot: {
		inherit: true,
		basePower: 60,
		willCrit: true,
		shortDesc: "Always results in a critical hit. Cannot be redirected.",
		desc: "Always results in a critical hit. Cannot be redirected.",
	},
	lightningassault: {
		num: -44,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			let ratio = Math.floor(pokemon.getStat('spe') / target.getStat('spe'));
			if (!isFinite(ratio)) ratio = 0;
			const bp = [40, 60, 80, 120, 150][Math.min(ratio, 4)];
			this.debug(`${bp} bp`);
			return bp;
		},
		category: "Physical",
		name: "Lightning Assault",
		shortDesc: "More power the faster the user is than the target.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Spark", target);
		},
		target: "normal",
		type: "Flying",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Cool",
	},
	conversionz: {
		num: -45,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Conversion-Z",
		shortDesc: "Fails if the user has an item. Raises all stats by 1, and user gets the type of its 3rd move.",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, sound: 1, dance: 1 },
		onTryHit(pokemon, target, move) {
			if (pokemon.item) {
				return false;
			}
			if (!this.boost(move.boosts as SparseBoostsTable)) return null;
			delete move.boosts;
		},
		onHit(target) {
			const type = this.dex.moves.get(target.moveSlots[2].id).type;
			if (target.hasType(type) || !target.setType(type)) return false;
			this.add('-start', target, 'typechange', type);
		},
		boosts: {
			atk: 1,
			def: 1,
			spa: 1,
			spd: 1,
			spe: 1,
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Conversion", target);
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},
	zawall: {
		num: -46,
		accuracy: 90,
		basePower: 120,
		category: "Physical",
		name: "Za Wall",
		desc: "This attack charges on the first turn and executes on the second. Raises the user's Attack by 1 stage on the first turn. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Raises user's Atk by 1 on turn 1. Hits turn 2.",
		pp: 10,
		priority: 0,
		flags: { charge: 1, protect: 1, mirror: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			this.boost({ atk: 1 }, attacker, attacker, move);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Head Smash", target);
		},
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	awakening: {
		num: -47,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Awakening",
		pp: 10,
		priority: 0,
		desc: "Heal this Pokemon for 50% HP, and reveal one of opponent's move.",
		shortDesc: "Heal 50% HP; reveals random opponent's move.",
		flags: { snatch: 1, heal: 1 },
		heal: [1, 2],
		onHit(pokemon) {
			for (const target of pokemon.side.foe.active) {
				if (target.fainted) return;
				const temp = this.sample(target.moveSlots);
				this.add('-message', pokemon.name + "'s Awakening revealed the move " + temp.move + "!");
			}
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dream Eater", target);
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	fulldevotion: {
		num: -48,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Full Devotion",
		shortDesc: "One adjacent ally's move power is 1.5x this turn. Lowers damages this ally receives of 25%.",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1 },
		volatileStatus: 'helpinghand',
		onTryHit(target) {
			if (!target.newlySwitched && !this.queue.willMove(target)) return false;
		},
		condition: {
			duration: 1,
			onStart(target, source) {
				this.effectState.multiplier = 1.5;
				this.add('-singleturn', target, 'Full Devotion', '[of] ' + source);
			},
			onBasePowerPriority: 10,
			onBasePower(basePower) {
				this.debug('Boosting from Full Devotion: ' + this.effectState.multiplier);
				return this.chainModify(this.effectState.multiplier);
			},
			onDamagingHit(damage, target, source, move) {
				if (source.side !== target.side) {
					return damage *= 0.75;
				}
			},
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Psystrike", target);
		},
		secondary: null,
		target: "adjacentAlly",
		type: "Psychic",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
	},
	braveblade: {
		desc: "Physical if it would be stronger (Shell Side Arm clone). Hits Dark types for neutral damages.",
		shortDesc: "Physical if stronger. Hits Dark types for neutral damages.",
		num: -49,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Brave Blade",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, slicing: 1 },
		onModifyMove(move, pokemon, target) {
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
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Psychic'] = true;
			}
		},
		onHit(target, source, move) {
			this.hint(move.category + " Brave Blade");
		},
		onAfterSubDamage(damage, target, source, move) {
			this.hint(move.category + " Brave Blade");
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Spacial Rend", target);
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
	},
	teramorphosis: {
		num: -50,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Teramorphosis",
		shortDesc: "Has 33% recoil. 100% chance to raise the user's Spe by 1.",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		recoil: [1, 3],
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Trailblaze", target);
		},
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	happydance: {
		num: -51,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Happy Dance",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, dance: 1 },
		self: {
			boosts: {
				atk: 1,
				spa: 1,
			},
		},
		weather: 'RainDance',
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rain Dance", target);
		},
		secondary: null,
		target: "all",
		type: "Water",
		shortDesc: "Raises the user's Atk and SpA by 1. Summons Rain Dance.",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	windscall: {
		num: -52,
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Raises the user's Atk and SpA by 1. Sets Tailwind.",
		name: "Wind's Call",
		pp: 5,
		priority: 0,
		flags: { protect: 1, wind: 1, mirror: 1 },
		self: {
			boosts: {
				atk: 1,
				spa: 1,
			},
			sideCondition: 'tailwind',
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Tailwind", target);
		},
		secondary: null,
		target: "all",
		type: "Flying",
		contestType: "Clever",
	},
	houndshowl: {
		num: -53,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Hound's Howl",
		shortDesc: "If a foe is switching out, hits it at 2x power.",
		desc: "If a foe is switching out, hits it at 2x power.",
		basePowerCallback(pokemon, target, move) {
			// You can't get here unless the pursuit succeeds
			if (target.beingCalledBack) {
				this.debug('Hound\'s Howl damage boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		beforeTurnCallback(pokemon) {
			for (const side of this.sides) {
				if (side === pokemon.side) continue;
				side.addSideCondition('houndshowl', pokemon);
				const data = side.getSideConditionData('houndshowl');
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onModifyMove(move, source, target) {
			if (target?.beingCalledBack) move.accuracy = true;
		},
		onTryHit(target, pokemon) {
			target.side.removeSideCondition('houndshowl');
		},
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Hound\'s Howl start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectState.sources) {
					if (!source.isAdjacent(pokemon) || !this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Hound\'s Howl');
						alreadyAdded = true;
					}
					// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (source.canMegaEvo || source.canUltraBurst) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source && action.choice === 'megaEvo') {
								this.actions.runMegaEvo(source);
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.actions.runMove('houndshowl', source, source.getLocOf(pokemon));
				}
			},
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hyper Voice", target);
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	dantesinferno: {
		num: -54,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Dante's Inferno",
		shortDesc: "Starts Sun.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		weather: 'sunnyday',
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Inferno", target);
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	junglehealing: {
		inherit: true,
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, 0.33));
			return pokemon.cureStatus() || success;
		},
		shortDesc: "User and allies: healed 1/3 max HP, status cured.",
	},
	lifedew: {
		inherit: true,
		onHit(pokemon) {
			pokemon.cureStatus();
		},
		heal: [1, 3],
		shortDesc: "User and allies: healed 1/3 max HP, status cured.",
	},
	lunarblessing: {
		inherit: true,
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, 0.33));
			return pokemon.cureStatus() || success;
		},
		shortDesc: "User and allies: healed 1/3 max HP, status cured.",
	},
	monkeybusiness: {
		num: -55,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Monkey Business",
		shortDesc: "Special if user's SpA > Atk. Eats the target's berry and restores it to the user. Type varies with the user's primary type.",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('spa', false, true) > pokemon.getStat('atk', false, true)) move.category = 'Special';
		},
		onModifyType(move, pokemon) {
			let type = pokemon.types[0];
			if (type === "Bird") type = "???";
			move.type = type;
		},
		onHit(pokemon) {
			if (pokemon.item && pokemon.getItem().isBerry) pokemon.eatItem(true);
			if (!pokemon.lastItem) return false;
			const item = pokemon.lastItem;
			pokemon.lastItem = '';
			this.add('-item', pokemon, this.dex.items.get(item), '[from] move: Monkey Business');
			pokemon.setItem(item);
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Normal",
	},
	swarming: {
		num: -56,
		accuracy: 100,
		basePower: 110,
		category: "Special",
		name: "Swarming",
		shortDesc: "Lowers the user's and the target's SpD by one stage.",
		desc: "Lowers the user's and the target's SpD by one stage.",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			boosts: {
				spd: -1,
			},
		},
		secondary: {
			chance: 100,
			boosts: {
				spd: -1,
			},
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bug Buzz", target);
		},
		target: "normal",
		type: "Bug",
		contestType: "Smart",
	},
	hardwareheat: {
		num: -57,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Hardware Heat",
		shortDesc: "Lowers the user's Speed by one stage.",
		desc: "Lowers the user's Speed by one stage.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			boosts: {
				spe: -1,
			},
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Inferno", target);
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Tough",
	},
	/*enragedtext: {
		num: -58,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Enraged Text",
		shortDesc: "Raises the user's Atk by 1.",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, sound: 1 },
		self: {
			boosts: {
				atk: 1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Clever",
	},*/
	shattering: {
		num: -59,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Shattering",
		shortDesc: "The user throws its held item. Fails if the user has no item.",
		desc: "The user throws its held item. Fails if the user has no item.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, allyanim: 1, noparentalbond: 1 },
		onPrepareHit(target, source, move) {
			if (source.ignoringItem()) return false;
			const item = source.getItem();
			if (!this.singleEvent('TakeItem', item, source.itemState, source, source, move, item)) return false;
			if (!item.fling) return false;
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
					move.secondaries.push({ status: item.fling.status });
				} else if (item.fling.volatileStatus) {
					move.secondaries.push({ volatileStatus: item.fling.volatileStatus });
				}
			}
			source.addVolatile('fling');
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fling", target);
		},
		condition: {
			onUpdate(pokemon) {
				const item = pokemon.getItem();
				pokemon.setItem('');
				pokemon.lastItem = item.id;
				pokemon.usedItemThisTurn = true;
				this.add('-enditem', pokemon, item.name, '[from] move: Shattering');
				this.runEvent('AfterUseItem', pokemon, null, null, item);
				pokemon.removeVolatile('fling');
			},
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	defog: {
		inherit: true,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, wind: 1 },
	},
	grassyglide: {
		inherit: true,
		basePower: 70,
	},
	milkdrink: {
		inherit: true,
		pp: 10,
	},
	recover: {
		inherit: true,
		pp: 10,
	},
	rest: {
		inherit: true,
		pp: 10,
	},
	roost: {
		inherit: true,
		pp: 10,
	},
	shoreup: {
		inherit: true,
		pp: 10,
	},
	slackoff: {
		inherit: true,
		pp: 10,
	},
	softboiled: {
		inherit: true,
		pp: 10,
	},
	bleakwindstorm: {
		inherit: true,
		shortDesc: "20% chance to freeze foe(s).",
		secondary: {
			chance: 20,
			status: 'frz',
		},
	},
	axekick: {
		inherit: true,
		type: "Dark",
		shortDesc: "30% confusion. User loses 50% max HP if miss.",
	},
	ragingbull: {
		inherit: true,
		basePower: 120,
		secondary: {
			chance: 10,
			boosts: {
				def: -1,
			},
		},
		desc: "Has a 10% chance to lower the target's Def by 1. If this attack does not miss, the effects of Reflect, Light Screen, and Aurora Veil end for the target's side of the field before damage is calculated. If the user's current form is a Paldean Tauros, this move's type changes to match. Fighting type for Combat Breed, Fire type for Blaze Breed, and Water type for Aqua Breed.",
		shortDesc: "10% chance to lower target's Def by 1. Destroys screens. Type depends on user's form.",
	},
	tidyup: {
		inherit: true,
		shortDesc: "User +1 Atk, Spe, Acc. Clears all substitutes/hazards on user's side.",
		onHit(pokemon) {
			let success = false;
			for (const active of this.getAllActive()) {
				if (active.removeVolatile('substitute')) success = true;
			}
			const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			const sides = [pokemon.side, ...pokemon.side.foeSidesWithConditions()];
			for (const side of sides) {
				for (const sideCondition of removeAll) {
					if (side.removeSideCondition(sideCondition)) {
						this.add('-sideend', side, this.dex.conditions.get(sideCondition).name);
						success = true;
					}
				}
			}
			if (success) this.add('-activate', pokemon, 'move: Tidy Up');
			return !!this.boost({ atk: 1, spe: 1, accuracy: 1 }, pokemon, pokemon, null, false, true) || success;
		},
	},
	hyperdrill: {
		inherit: true,
		shortDesc: "Bypasses protection without breaking it. 50% chance to lower target's Def by 2 stages.",
		secondary: {
			chance: 50,
			boosts: {
				def: -2,
			},
		},
	},
	gigatonhammer: {
		inherit: true,
		shortDesc: "Cannot be used twice in a row. Super effective on Steel targets.",
		onEffectiveness(typeMod, target, type) {
			if (type === 'Steel') return 1;
		},
	},
	blazingtorque: {
		inherit: true,
		isNonstandard: null,
	},
	combattorque: {
		inherit: true,
		isNonstandard: null,
	},
	magicaltorque: {
		inherit: true,
		isNonstandard: null,
		secondary: {
			chance: 20,
			boosts: {
				def: -1,
			},
		},
		shortDesc: "20% chance to lower target's Def by 1.",
		desc: "20% chance to lower target's Def by 1.",
	},
	noxioustorque: {
		inherit: true,
		isNonstandard: null,
	},
	wickedtorque: {
		inherit: true,
		isNonstandard: null,
		secondary: {
			chance: 20,
			boosts: {
				atk: -1,
			},
		},
		shortDesc: "20% chance to lower target's Atk by 1.",
		desc: "20% chance to lower target's Atk by 1.",
	},
	roguewave: {
		num: -60,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Rogue Wave",
		shortDesc: "Has 33% recoil. Usually goes first.",
		pp: 10,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1 },
		recoil: [1, 3],
		secondary: null,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Wave Crash", target);
		},
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	natureswrath: {
		num: -61,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		shortDesc: "Either Grass or Ground-type, whichever is more effective. Heals user by 12.5% of damage dealt.",
		name: "Nature's Wrath",
		pp: 10,
		flags: { protect: 1, mirror: 1, heal: 1, metronome: 1 },
		drain: [1, 8],
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Leaf Storm", target);
		},
		onModifyType(move, pokemon) {
			for (const target of pokemon.side.foe.active) {
				const type1 = 'Grass';
				const type2 = 'Ground';
				if (this.dex.getEffectiveness(type1, target) < this.dex.getEffectiveness(type2, target)) {
					move.type = 'Ground';
				} else if (target.hasType('Flying') || target.hasAbility('eartheater') || target.hasAbility('levitate')) {
					move.type = 'Grass';
				} else if (target.hasAbility('sapsipper')) {
					move.type = 'Ground';
				} else if (this.dex.getEffectiveness(type1, target) === this.dex.getEffectiveness(type2, target)) {
					if (pokemon.hasType('Ground') && !pokemon.hasType('Grass')) {
						move.type = 'Ground';
					}
				}
			}
		},
		onHit(target, source, move) {
			this.add('-message', `Nature's Wrath dealt ${move.type}-type damage!`);
		},
		priority: 0,
		secondary: null,
		target: "any",
		type: "Grass",
		zMove: { basePower: 170 },
		contestType: "Tough",
	},
	magicmissile: {
		num: -62,
		accuracy: true,
		basePower: 25,
		category: "Special",
		name: "Magic Missile",
		shortDesc: "Hits 2-5 times in one turn. Does not check accuracy, bypasses immunities, and always hits for at least neutral damages.",
		desc: "Hits two to five times. This move does not check accuracy, bypasses immunities, and always hits for at least neutral damages.",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		multihit: [2, 5],
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Swift", target);
		},
		basePowerCallback(pokemon, target, move) {
			if (target.getMoveHitData(move).typeMod < 0) {
				this.debug('Magic Missile damage boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		onModifyMove(move, pokemon, target) {
			let type = move.type;
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity[type] = true;
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
		contestType: "Smart",
	},
	chatter: {
		inherit: true,
		basePower: 80,
		isNonstandard: null,
		pp: 10,
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		desc: "Has a 100% chance to raise the user's Special Attack by 1 stage.",
		shortDesc: "100% chance to raise the user's Sp. Atk by 1.",
	},
	waterpulse: {
		inherit: true,
		basePower: 80,
	},
	shadowpunch: {
		inherit: true,
		secondary: {
			chance: 100,
			volatileStatus: 'healblock',
		},
		desc: "For 2 turns, the target is prevented from restoring any HP as long as it remains active. During the effect, healing and draining moves are unusable, and Abilities and items that grant healing will not heal the user. If an affected Pokemon uses Baton Pass, the replacement will remain unable to restore its HP. Pain Split and the Regenerator Ability are unaffected. Does not check accuracy.",
		shortDesc: "For 2 turns, the target is prevented from healing. Does not check accuracy.",
	},
	healblock: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (effect?.name === "Psychic Noise" || effect?.name === "Shadow Punch") {
					return 2;
				}
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Heal Block');
					return 7;
				}
				return 5;
			},
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'move: Heal Block');
				source.moveThisTurnResult = true;
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['heal']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['heal'] && !move.isZ && !move.isMax) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onModifyMove(move, pokemon, target) {
				if (move.flags['heal'] && !move.isZ && !move.isMax) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onResidualOrder: 20,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Heal Block');
			},
			onTryHeal(damage, target, source, effect) {
				if ((effect?.id === 'zpower') || this.effectState.isZ) return damage;
				return false;
			},
			onRestart(target, source, effect) {
				if (effect?.name === 'Psychic Noise') return;

				this.add('-fail', target, 'move: Heal Block'); // Succeeds to supress downstream messages
				if (!source.moveThisTurnResult) {
					source.moveThisTurnResult = false;
				}
			},
		},
	},
	meteorassault: {
		inherit: true,
		flags: {cantusetwice: 1, slicing: 1, protect: 1, mirror: 1, failinstruct: 1},
		self: null,
		shortDesc: "Cannot be selected the turn after it's used.",
	},
	psyblade: {
		inherit: true,
		onBasePower(basePower, source) {
			return basePower;
		},
		terrain: 'electricterrain',
		shortDesc: "Sets Electric Terrain upon use.",
		desc: "Sets Electric Terrain upon use.",
	},
	revivalblessing: {
		inherit: true,
		flags: {heal: 1, noassist: 1},
	},
	fatbombing: {
		num: -63,
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		name: "Fat Bombing",
		pp: 10,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1, metronome: 1},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			this.boost({atk: 1}, attacker, attacker, move);
			if (this.field.getPseudoWeather('gravity')) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rock Blast", target);
		},
		secondary: null,
		hasSheerForce: true,
		target: "normal",
		type: "Rock",
		desc: "This attack charges on the first turn and executes on the second. Raises the user's Attack by 1 stage on the first turn. If the user is holding a Power Herb or Gravity is set, the move completes in one turn.",
		shortDesc: "Raises Atk by 1, hits turn 2. Gravity: no charge.",

		prepare: "[POKEMON] launched a fat bombing!",
	},
	poisonivy: {
		num: -64,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Poison Ivy",
		shortDesc: "Hits twice. This move does not check accuracy.",
		desc: "Hits twice. This move does not check accuracy.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		multihit: 2,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Power Whip", target);
			this.add('-anim', source, "Sludge Wave", target);
			this.add('-anim', source, "Power Whip", target);
			this.add('-anim', source, "Sludge Wave", target);
		},
		secondary: null,
		target: "normal",
		type: "Poison",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
		contestType: "Cool",
	},
	twinbeam: {
		inherit: true,
		desc: "Lowers the target's Special Attack and Special Defense by 1 stage.",
		shortDesc: "Lowers target's Sp. Atk, Sp. Def by 1.",
		self: null,
		boosts: {
			spa: -1,
			spd: -1,
		},
	},
	clusterexplosion: {
		num: -65,
		accuracy: 100,
		basePower: 250,
		category: "Physical",
		name: "Cluster Explosion",
		shortDesc: "Hits adjacent Pokemon. Sets Spikes. User faints.",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, metronome: 1, noparentalbond: 1},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Splintered Stormshards", pokemon);
		},
		onTryMove(source, target, move) {
			if (!move.hasSheerForce) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('spikes');
				}
			}
		},
		selfdestruct: "always",
		secondary: null,
		target: "allAdjacent",
		type: "Rock",
		contestType: "Beautiful",
	},
	lightofruin: {
		inherit: true,
		isNonstandard: null,
	},
	froststorm: {
		num: -66,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Frost Storm",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, metronome: 1, wind: 1},
		onModifyMove(move, pokemon, target) {
			if (target && ['hail', 'snow', 'everlastingwinter'].includes(target.effectiveWeather())) {
				move.secondaries.push({
					chance: 100,
					status: 'frz',
				});
			}
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hurricane", target);
			this.add('-anim', source, "Blizzard", target);
		},
		secondary: {
			chance: 30,
			status: 'frz',
		},
		target: "allAdjacentFoes",
		type: "Ice",
		shortDesc: "30% chance of Freeze, 100% in Snow.",
	},
	thunderstorm: {
		num: -67,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Thunder Storm",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, metronome: 1, wind: 1},
		onModifyMove(move, pokemon, target) {
			if (target && ['raindance', 'primordialsea'].includes(target.effectiveWeather())) {
				move.secondaries.push({
					chance: 100,
					status: 'par',
				});
			}
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hurricane", target);
			this.add('-anim', source, "Thunder", target);
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "allAdjacentFoes",
		type: "Electric",
		shortDesc: "30% chance of Para, 100% in Rain.",
	},
	heatstorm: {
		num: -68,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Heat Storm",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, metronome: 1, wind: 1},
		onModifyMove(move, pokemon, target) {
			if (target && ['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
				move.secondaries.push({
					chance: 100,
					status: 'brn',
				});
			}
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hurricane", target);
			this.add('-anim', source, "Heat Wave", target);
		},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "allAdjacentFoes",
		type: "Fire",
		shortDesc: "30% chance of Burn, 100% in Sun.",
	},
	genesiswave: {
		num: -69,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Genesis Wave",
		pp: 20,
		priority: 0,
		flags: {snatch: 1, metronome: 1},
		terrain: 'psychicterrain',
		boosts: {
			spa: 1,
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Genesis Supernova", target);
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: {effect: 'clearnegativeboost'},
		contestType: "Clever",
		shortDesc: "Raises user's SpA by 1, and sets Psychic Terrain.",
	},
	thunderway: {
		num: -70,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Thunder Way",
		pp: 10,
		priority: 0,
		flags: {heal: 1, bypasssub: 1, allyanim: 1},
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, 0.75));
			pokemon.addVolatile('taunt');
			return pokemon.cureStatus() || success;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Thunderclap", source);
		},
		secondary: null,
		target: "self",
		type: "Electric",
		shortDesc: "Heals 75% of HP and heals status, but the user is Taunted for 2 turns.",
	},
	taunt: {
		inherit: true,
		volatileStatus: 'taunt',
		condition: {
			duration: 3,
			durationCallback(target, source, effect) {
				if (effect?.name === "Thunder Way") {
					return 2;
				}
				return 3;
			},
			onStart(target) {
				if (target.activeTurns && !this.queue.willMove(target)) {
					this.effectState.duration++;
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
	},
	fieryfire: {
		num: -71,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Fiery Fire",
		pp: 20,
		priority: 0,
		flags: {snatch: 1, metronome: 1},
		boosts: {
			atk: 1,
		},
		onHit(pokemon) {
			pokemon.addVolatile('flashfire')
		},
		onEnd(pokemon) {
			pokemon.removeVolatile('flashfire');
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fiery Dance", source);
		},
		secondary: null,
		target: "self",
		type: "Fire",
		zMove: {effect: 'clearnegativeboost'},
		contestType: "Clever",
		shortDesc: "Raises Atk by 1, and applies the Flash Fire effect.",
	},
	auroraborealis: {
		num: -72,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Aurora Borealis",
		pp: 20,
		priority: 0,
		flags: {snatch: 1, metronome: 1},
		volatileStatus: 'aquaring',
		onHit(pokemon) {
			return pokemon.cureStatus();
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Aurora Veil", source);
			this.add('-anim', source, "Aqua Ring", source);
		},
		secondary: null,
		target: "self",
		type: "Water",
		zMove: {boost: {def: 1}},
		contestType: "Beautiful",
		shortDesc: "Heals user's status, and gives Aqua Ring.",
	},
	boulderbuilding: {
		num: -73,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Boulder Building",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1},
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({def: 1}, source, source, this.dex.getActiveMove("Boulder Building"));
			const removeTarget = [
				'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			const removeAll = [
				'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Boulder Building', '[of] ' + source);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Boulder Building', '[of] ' + source);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rock Blast", source);
		},
		secondary: null,
		target: "normal",
		type: "Rock",
		zMove: {boost: {accuracy: 1}},
		contestType: "Cool",
		desc: "Raises the user's Defense by 1 stage. If this move is successful and whether or not the target's evasiveness was affected, the effects of Reflect, Light Screen, Aurora Veil, Safeguard, Mist, Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the target's side, and the effects of Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the user's side. Ignores a target's substitute, although a substitute will still block the lowering of evasiveness. If there is a terrain active and this move is successful, the terrain will be cleared.",
		shortDesc: "+1 Def; clears terrain and hazards on both sides.",
	},
	icebergpolish: {
		num: -74,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Iceberg Polish",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, metronome: 1},
		boosts: {
			spe: 2,
			spa: 1,
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rock Polish", source);
		},
		secondary: null,
		target: "self",
		type: "Ice",
		zMove: {effect: 'clearnegativeboost'},
		contestType: "Clever",
		desc: "Raises the user's Speed by 2 stages and its Sp. Attack by 1 stage.",
		shortDesc: "Raises the user's Speed by 2 and Sp. Atk by 1.",
	},
	alienmetal: {
		num: -75,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Alien Metal",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1, bypasssub: 1},
		heal: [1, 4],
		volatileStatus: 'alienmetal',
		condition: {
			onStart(pokemon, source, effect) {
				this.add('-start', pokemon, 'Alien Metal');
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (target.getMoveHitData(move).typeMod > 0) {
					this.debug('Alien Metal neutralize');
					return this.chainModify(0.75);
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Alien Metal', '[silent]');
			},
		},		
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Iron Defense", source);
		},
		secondary: null,
		target: "allies",
		type: "Steel",
		shortDesc: "Heals 25% of the user's HP, and gives Filter effect for 3 turns.",
	},
	athosrapier: {
		num: -76,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Athos Rapier",
		pp: 10,
		priority: 4,
		flags: {noassist: 1, failcopycat: 1, failinstruct: 1},
		stallingMove: true,
		volatileStatus: 'athosrapier',
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Smart Strike", source);
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
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
					this.boost({def: 1}, target, target, this.dex.getActiveMove("Athos Rapier"));
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					this.boost({def: 1}, target, target, this.dex.getActiveMove("Athos Rapier"));
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Steel",
		zMove: {effect: 'clearnegativeboost'},
		contestType: "Cool",
		desc: "The user is protected from most attacks made by other Pokemon during this turn, and Pokemon trying to make contact with the user raise its Defense by 1 stage. Non-damaging moves go through this protection. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails, if the user's last move used is not Baneful Bunker, Burning Bulwark, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield, or Wide Guard, or if it was one of those moves and the user's protection was broken. Fails if the user moves last this turn.",
		shortDesc: "Protects from damaging attacks. Contact: +1 Def.",
	},
	aramisdagger: {
		num: -77,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Aramis Dagger",
		pp: 30,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Leaf Blade", target);
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Cool",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
	},
	porthosbroadsword: {
		num: -78,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Porthos Broadsword",
		pp: 20,
		priority: -3,
		flags: {contact: 1, protect: 1, slicing: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1},
		priorityChargeCallback(pokemon) {
			pokemon.addVolatile('focuspunch');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.volatiles['focuspunch']?.lostFocus) {
				this.add('cant', pokemon, 'Porthos Broadsword', 'Porthos Broadsword');
				return true;
			}
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Porthos Broadsword');
			},
			onHit(pokemon, source, move) {
				if (move.category !== 'Status') {
					this.effectState.lostFocus = true;
				}
			},
			onTryAddVolatile(status, pokemon) {
				if (status.id === 'flinch') return null;
			},
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Stone Edge", target);
		},
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
		desc: "The user loses its focus and does nothing if it is hit by a damaging attack this turn before it can execute the move.",
		shortDesc: "Fails if the user takes damage before it hits.",
	},
	razorwind: {
		inherit: true,
		basePower: 120,
		type: "Flying",
	},
	befuddlepowder: {
		num: -79,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Befuddle Powder",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, powder: 1 },
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod < 0) {
				this.debug('Tinted Lens boost');
				return this.chainModify(2);
			}
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "G-Max Befuddle", target);
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Flying",
		contestType: "Cool",
		shortDesc: "Double damage on targets that resist.",
	},
	piercingdart: {
		desc: "Hits Steel types for super effective damages.",
		shortDesc: "Super effective on Steel targets.",
		num: -80,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Piercing Dart",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, slicing: 1 },
		onModifyMove(move, pokemon, target) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Poison'] = true;
			}
		},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Steel') return 1;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Pin Missile", target);
		},
		secondary: null,
		target: "normal",
		type: "Poison",
	},
	hindenburg: {
		num: -81,
		accuracy: 100,
		basePower: 65,
		basePowerCallback(pokemon, target, move) {
			if (!pokemon.item || pokemon.status === 'brn') {
				this.debug("BP doubled");
				return move.basePower * 2;
			}
			return move.basePower;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sky Drop", target);
			this.add('-anim', source, "Explosion", target);
		},
		category: "Special",
		name: "Hindenburg",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1},
		secondary: null,
		target: "any",
		type: "Ghost",
		contestType: "Cool",
		shortDesc: "Power doubles if the user has no held item or is burned.",
	},
	ventilation: {
		num: -82,
		accuracy: 90,
		basePower: 70,
		basePowerCallback(pokemon, target, move) {
			if (pokemon.volatiles['stockpile']?.layers === 3) return move.basePower * 2;
			return move.basePower;
		},
		category: "Special",
		name: "Ventilation",
		pp: 10,
		priority: 0,
		flags: {protect: 1, metronome: 1},
		onAfterMove(pokemon) {
			if (pokemon.volatiles['stockpile']) pokemon.removeVolatile('stockpile');
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hurricane", target);
		},
		secondary: null,
		target: "normal",
		type: "Flying",
		contestType: "Tough",
		shortDesc: "Lowers the target's Speed by 1. If user has 3 stacks of Stockpile, doubles in power.",
	},
	emushdance: {
		num: -83,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Emush Dance",
		pp: 10,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1, metronome: 1},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (this.field.isTerrain('grassyterrain') || this.field.isTerrain('chakraterrain')) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Zen Headbutt", target);
		},
		secondary: null,
		hasSheerForce: true,
		target: "normal",
		type: "Psychic",
		shortDesc: "Charges on turn 1, then hits on turn 2. No charge in Chakra Terrain or Grassy Terrain.",
	},
	rainofarrows: {
		num: -83,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Rain Of Arrows",
		pp: 15,
		priority: 0,
		flags: {mirror: 1, metronome: 1},
		secondary: null,
		target: "normal",
		type: "Ice",
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Icicle Spear", target);
			this.add('-anim', source, "Thousand Arrows", target);
		},
		onHit(pokemon, source) {
			source.addVolatile('rainofarrows');
		},
		condition: {
			duration: 1,
			onResidual(pokemon) {
				this.actions.useMove('rainofarrows', target, source);
			},
		},
		shortDesc: "Hits once in this turn, then hits again in the next turn. Ignores protection.",
	},
	wyvernflight: {
		num: -84,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Wyvern Flight",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1},
		selfSwitch: true,
		secondary: null,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Boomburst", target);
			this.add('-anim', source, "U-turn", target);
		},
		target: "normal",
		type: "Dragon",
		contestType: "Cool",
		desc: "If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button or through the effect of the Emergency Exit or Wimp Out Abilities.",
		shortDesc: "User switches out after damaging the target.",
	},
	bigbang: {
		num: -85,
		accuracy: 100,
		basePower: 140,
		category: "Special",
		name: "Big Bang",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1},
		secondary: null,
		ignoreAbility: true,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Boomburst", target);
		},
		onModifyMove(move, pokemon, target) {
			let type = move.type;
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity[type] = true;
			}
		},
		onEffectiveness(typeMod, target, type) {
			if (target.getMoveHitData(move).typeMod < 0) return 0;
		},
		target: "allAdjacent",
		type: "Normal",
		contestType: "Tough",
		desc: "This move and its effects ignore the Abilities of other Pokemon, as well as resistances and immunities.",
		shortDesc: "Ignores the Abilities of other Pokemon, resistances and immunities.",
	},
	psyshieldbash: {
		inherit: true,
		accuracy: 100,
		basePower: 80,
	},
	ningencry: {
		num: -86,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Ningen Cry",
		pp: 5,
		priority: 0,
		flags: {snatch: 1, dance: 1 },
		self: {
			boosts: {
				atk: 1,
			},
		},
		weather: 'snowscape',
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Snowscape", target);
		},
		secondary: null,
		target: "all",
		type: "Ice",
		shortDesc: "Raises the user's Atk by 1. Summons Snow.",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	mantisslash: {
		num: -87,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Mantis Slash",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1},
		self: {
			boosts: {
				spe: -2,
			},
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		desc: "Lowers the user's Speed by 2 stages.",
		shortDesc: "Lowers the user's Speed by 2.",
	},
	tropkick: {
		inherit: true,
		basePower: 90,
	},
	intrepidcrash: {
		num: -88,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Intrepid Crash",
		shortDesc: "Has 33% recoil. Usually goes first.",
		pp: 10,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1 },
		recoil: [1, 3],
		secondary: null,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Brave Bird", target);
		},
		target: "normal",
		type: "Flying",
		contestType: "Cool",
	},
	doublehit: {
		inherit: true,
		basePower: 50,
	},
	timeparadox: {
		num: -89,
		accuracy: 75,
		basePower: 100,
		category: "Special",
		name: "Time Paradox",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, metronome: 1},
		volatileStatus: 'partiallytrapped',
		secondary: null,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Psywave", target);
		},
		target: "normal",
		type: "Psychic",
		contestType: "Tough",
		desc: "Prevents the target from switching for four or five turns (seven turns if the user is holding Grip Claw). Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Mortal Spin, Rapid Spin, or Substitute successfully. This effect is not stackable or reset by using this or another binding move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
	},
	armorcannon: {
		inherit: true,
		flags: {protect: 1, mirror: 1, bullet: 1},
	},
	corrosiveacid: {
		num: -90,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Corrosive Acid",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, metronome: 1},
		onModifyMove(move, pokemon, target) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Poison'] = true;
			}
		},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Steel') return 1;
		},
		secondary: {
			chance: 10,
			status: 'psn',
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Acid", target);
		},
		target: "normal",
		type: "Poison",
		contestType: "Beautiful",
		desc: "Has a 10% chance to poison the target. This move's type effectiveness against Steel is changed to be super effective no matter what this move's type is.",
		shortDesc: "10% chance to poison. Super effective on Steel.",
	},
	jumpscare: {
		num: -91,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Jumpscare",
		pp: 10,
		priority: 3,
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1},
		onTry(source) {
			if (source.activeMoveActions > 1) {
				this.hint("Jumpscare only works on your first turn out.");
				return false;
			}
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Scary Face", target);
			this.add('-anim', source, "Crunch", target);
			this.add('-anim', source, "Flash", target);
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
	futuredoom: {
		num: -92,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		name: "Future Doom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, metronome: 1},
		volatileStatus: 'partiallytrapped',
		secondary: {
			chance: 100,
			volatileStatus: 'taunt',
		},
		target: "normal",
		type: "Psychic",
		shortDesc: "Traps the target for 5 turns, and applies Taunt.",
	},
	brainblast: {
		num: -93,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		name: "Brain Blast",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, metronome: 1},
		onBasePower(basePower, source, target, move) {
			const item = target.getItem();
			if (!this.singleEvent('TakeItem', item, target.itemState, target, target, move, item)) return;
			if (item.id) {
				return this.chainModify(1.5);
			}
		},
		onAfterHit(target, source) {
			if (source.hp) {
				const item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Brain Blast', '[of] ' + source);
				}
			}
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Kinesis", target);
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
		desc: "If the target is holding an item that can be removed from it, ignoring the Sticky Hold Ability, this move's power is multiplied by 1.5. If the user has not fainted, the target loses its held item. This move cannot cause Pokemon with the Sticky Hold Ability to lose their held item or cause a Kyogre, a Groudon, a Giratina, an Arceus, a Genesect, a Silvally, a Zacian, or a Zamazenta to lose their Blue Orb, Red Orb, Griseous Orb, Plate, Drive, Memory, Rusted Sword, or Rusted Shield respectively. Items lost to this move cannot be regained with Recycle or the Harvest Ability.",
		shortDesc: "1.5x damage if foe holds an item. Removes item.",
	},
	rainbowdash: {
		num: -94,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Rainbow Dash",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, metronome: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dazzling Gleam", target);
		},
		secondary: null,
		target: "allAdjacent",
		type: "Fairy",
		contestType: "Tough",
		shortDesc: "No additional effect.",
	},
	waterslash: {
		num: -95,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		overrideDefensiveStat: 'def',
		name: "Water Slash",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, slicing: 1},
		secondary: null,
		target: "normal",
		type: "Water",
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Aqua Cutter", target);
		},
		contestType: "Beautiful",
		desc: "Deals damage to the target based on its Defense instead of Special Defense.",
		shortDesc: "Damages target based on Defense, not Sp. Def.",
	},
	marinebolt: {
		num: -96,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Marine Bolt",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, bullet: 1},
		overrideOffensiveStat: 'spe',
		secondary: null,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flame Burst", target);
		},
		target: "normal",
		type: "Fire",
		shortDesc: "Uses user's Speed stat instead of Attack in damage calculation.",
	},
	ragefist: {
		inherit: true,
		desc: "Power is equal to 50+(X*50), where X is the total number of times the user has been hit by a damaging attack during the battle, even if the user did not lose HP from the attack. X cannot be greater than 6 and does not reset upon switching out or fainting. Each hit of a multi-hit attack is counted, but confusion damage is not counted. After attacking, this Pokemon takes damage, depending on the Basepower of the move.",
		shortDesc: "+50 BP for each time user was hit. Recoil = BP.",
		self: {
			onHit(pokemon) {
				let bp = Math.min(350, 50 + 50 * pokemon.timesAttacked);
				this.damage(bp, pokemon, pokemon);
				this.add('-message', `Rage Fist currently has a BP of ${bp}!`);
			},
		},
	},
	scaredyshell: {
		num: -97,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Scaredy Shell",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		selfSwitch: true,
		secondary: null,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Iron Defense", source);
			this.add('-anim', source, "U-turn", target);
		},
		target: "normal",
		type: "Steel",
		desc: "If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button or through the effect of the Emergency Exit or Wimp Out Abilities.",
		shortDesc: "User switches out after damaging the target.",
		switchOut: "#uturn",
	},






	// Everlasting Winter field
	auroraveil: {
		inherit: true,
		onTry() {
			return this.field.isWeather(['hail', 'snow', 'everlastingwinter']);
		},
	},
	blizzard: {
		inherit: true,
		onModifyMove(move) {
			if (this.field.isWeather(['hail', 'snow', 'everlastingwinter'])) move.accuracy = true;
		},
	},
	dig: {
		inherit: true,
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (type === 'sandstorm' || type === 'hail' || type === 'everlastingwinter') return false;
			},
			onInvulnerability(target, source, move) {
				if (['earthquake', 'magnitude'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					return this.chainModify(2);
				}
			},
		},
	},
	dive: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			if (attacker.hasAbility('gulpmissile') && attacker.species.name === 'Cramorant' && !attacker.transformed) {
				attacker.formeChange('cramorantgulping', move);
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
			onImmunity(type, pokemon) {
				if (type === 'sandstorm' || type === 'hail' || type === 'everlastingwinter') return false;
			},
			onInvulnerability(target, source, move) {
				if (['surf', 'whirlpool'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'surf' || move.id === 'whirlpool') {
					return this.chainModify(2);
				}
			},
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
			case 'sandstorm':
			case 'hail':
			case 'snow':
			case 'everlastingwinter':
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
			case 'hail':
			case 'snow':
			case 'everlastingwinter':
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
	solarbeam: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			const weakWeathers = ['raindance', 'primordialsea', 'sandstorm', 'hail', 'snow', 'everlastingwinter'];
			if (weakWeathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	solarblade: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			const weakWeathers = ['raindance', 'primordialsea', 'sandstorm', 'hail', 'snow', 'everlastingwinter'];
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
			case 'hail':
			case 'snow':
			case 'everlastingwinter':
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
				move.type = 'Rock';
				break;
			case 'hail':
			case 'snow':
			case 'everlastingwinter':
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
				move.basePower *= 2;
				break;
			case 'hail':
			case 'snow':
			case 'everlastingwinter':
				move.basePower *= 2;
				break;
			}
			this.debug('BP: ' + move.basePower);
		},
	},
	// Karma field
	wish: {
		inherit: true,
		flags: {snatch: 1, heal: 1, metronome: 1, futuremove: 1},
		condition: {
			duration: 2,
			onStart(pokemon, source) {
				if (source.hasAbility('karma')) {
					this.effectState.hp = 3* source.maxhp / 4;
				} 
				else {
					this.effectState.hp = source.maxhp / 2;
				}
			},
			onResidualOrder: 4,
			onEnd(target) {
				if (target && !target.fainted) {
					const damage = this.heal(this.effectState.hp, target, target);
					if (damage) {
						this.add('-heal', target, target.getHealth, '[from] move: Wish', '[wisher] ' + this.effectState.source.name);
					}
				}
			},
		},
	},
	// Endless Dream field
	wakeupslap: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (target.status === 'slp' || target.hasAbility('comatose') || this.field.getPseudoWeather('endlessdream')) return move.basePower * 2;
			return move.basePower;
		},
	},
	dreameater: {
		inherit: true,
		onTryImmunity(target, source) {
			return target.status === 'slp' || target.hasAbility('comatose') || this.field.getPseudoWeather('endlessdream');
		},
	},
	nightmare: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(pokemon) {
				if (pokemon.status !== 'slp' && !pokemon.hasAbility('comatose') && !this.field.getPseudoWeather('endlessdream')) {
					return false;
				}
				this.add('-start', pokemon, 'Nightmare');
			},
			onResidualOrder: 9,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 4);
			},
		},
	},
	sleeptalk: {
		inherit: true,
		onTry(source) {
			let usable = false;
			for (const opponent of source.adjacentFoes()) {
				if (this.field.getPseudoWeather('endlessdream')) {
					usable = true;
					break;
				}
			}
			return source.status === 'slp' || source.hasAbility('comatose') || usable;
		},
	},
	// Psychic Prowess
	amnesia: {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (pokemon.hasAbility('psychicprowess')) move.boosts = {spa: 2, spd: 2};
		},
	},
};
