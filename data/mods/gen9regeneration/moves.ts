export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	// new
	vitalenergy: {
		accuracy: 100,
		basePower: 150,
		basePowerCallback(pokemon, target, move) {
			return move.basePower * pokemon.hp / pokemon.maxhp;
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Seed Flare", target);
		},
		category: "Special",
		name: "Vital Energy",
		shortDesc: "Less power as user's HP decreases. Hits foe(s).",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: undefined,
		target: "allAdjacentFoes",
		type: "Grass",
		contestType: "Beautiful",
	},
	smokytorment: {
		accuracy: true,
		basePower: 75,
		category: "Physical",
		name: "Smoky Torment",
		shortDesc: "Applies the Torment effect on opponent.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Outrage", target);
		},
		secondary: {
			chance: 100,
			volatileStatus: 'torment',
		},
		target: "normal",
		type: "Dark",
		contestType: "Cool",
	},
	powerwash: {
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Power Wash",
		shortDesc: "Removes all hazards in the field. If any are cleared, the user heals for 50% of its maximum HP.",
		pp: 40,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onHit(target, source, move) {
			let success = false;
			const removeAll = [
				'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Power Wash', `[of] ${source}`);
					success = true;
				}
			}
			this.heal(Math.ceil(source.maxhp * 0.5), source);
			return success;
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Volt Switch", target);
		},
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	brainwave: {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Brainwave",
		shortDesc: "Uses user's Special Defense stat as Special Attack in damage calculation.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		overrideOffensiveStat: 'spd',
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Expanding Force", target);
		},
		secondary: undefined,
		target: "normal",
		type: "Psychic",
	},
	illwind: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Ill Wind",
		shortDesc: "Lowers the user's Sp. Atk by 1, drains 25% damage, heals another 25% for each neg SpA boost.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1 },
		self: {
			boosts: {
				spa: -1,
			},
		},
		drain: [1, 4],
		/* onModifyMove(move, pokemon) {
			move.drain = [pokemon.negativeBoosts.spa(), 4];
		}, */
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Icy Wind", target);
		},
		secondary: undefined,
		target: "normal",
		type: "Ice",
		contestType: "Clever",
	},
	guardiandive: {
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Guardian Dive",
		shortDesc: "Uses user's Defense stat as Attack in damage calculation.",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		overrideOffensiveStat: 'def',
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Acrobatics", target);
		},
		secondary: undefined,
		target: "normal",
		type: "Flying",
	},
	coralcrash: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Coral Crash",
		shortDesc: "33% recoil. 10% chance to poison.",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			status: 'psn',
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Aqua Tail", target);
		},
		recoil: [33, 100],
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	slipaway: {
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Slip Away",
		shortDesc: "100% chance to lower the target's Attack by 1, switches the user out.",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Aqua Tail", target);
		},
		selfSwitch: true,
		target: "normal",
		type: "Water",
		zMove: { effect: 'healreplacement' },
		contestType: "Cool",
	},
	flareout: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Flare Out",
		shortDesc: "100% chance to lower the target's Defense by 1, switches the user out.",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				def: -1,
			},
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flame Charge", target);
		},
		selfSwitch: true,
		target: "normal",
		type: "Fire",
		zMove: { effect: 'healreplacement' },
		contestType: "Cool",
	},
	buzzoff: {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Buzz Off",
		shortDesc: "100% chance to lower the target's Speed by 1, switches the user out.",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Volt Switch", target);
		},
		selfSwitch: true,
		target: "normal",
		type: "Electric",
		zMove: { effect: 'healreplacement' },
		contestType: "Cool",
	},
	powdergale: {
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Powder Gale",
		shortDesc: "100% chance to poison. Harshly lowers a random one of the target's stats.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, wind: 1, metronome: 1 },
		onHit(target) {
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in target.boosts) {
				if (stat === 'accuracy' || stat === 'evasion') continue;
				if (target.boosts[stat] > -6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				const randomStat = this.sample(stats);
				const boost: SparseBoostsTable = {};
				boost[randomStat] = -2;
				this.boost(boost);
			} else {
				return;
			}
		},
		secondary: {
			chance: 100,
			status: 'psn',
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Silver Wind", target);
		},
		target: "normal",
		type: "Bug",
		contestType: "Clever",
	},
	splashback: {
		accuracy: 100,
		basePower: 50,
		basePowerCallback(pokemon) {
			return Math.min(300, 50 + 50 * pokemon.timesAttacked);
		},
		/* onEnd(pokemon) {
			this.add('-end', pokemon, 'Splashback', '[silent]');
		}, */
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flip Turn", target);
		},
		category: "Physical",
		name: "Splashback",
		shortDesc: "Base power increases by 50 every time this Pokemon is hit. Max 300 BP. Reset on switch out.",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: undefined,
		target: "normal",
		type: "Water",
	},
	ragingtorrent: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Raging Torrent",
		shortDesc: "Lowers the target's Atk by 1. Inflicts Encore on the user.",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {
			volatileStatus: 'encore',
		},
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Breaking Swipe", target);
		},
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Tough",
	},
	familyonslaught: {
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		shortDesc: "Hits 2-4 times.",
		name: "Family Onslaught",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 4],
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Population Bomb", target);
		},
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	pestspread: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		shortDesc: "Changes the target's type to the user's type.",
		name: "Pest Spread",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onAfterHit(target, source) {
			if (target.species && (target.species.num === 493 || target.species.num === 773)) return false;
			if (target.terastallized) return false;
			const oldApparentType = target.apparentType;
			let newBaseTypes = source.getTypes(true).filter(type => type !== '???');
			if (!newBaseTypes.length) {
				if (source.addedType) {
					newBaseTypes = ['Normal'];
				} else {
					return false;
				}
			}
			this.add('-start', target, 'typechange', '[from] move: Pest Spread', `[of] ${target}`);
			target.setType(newBaseTypes);
			target.addedType = source.addedType;
			target.knownType = source.isAlly(source) && source.knownType;
			if (!target.knownType) target.apparentType = oldApparentType;
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sludge Bomb", target);
		},
		target: "normal",
		type: "Poison",
	},
	vengefulbone: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "Power doubles if an ally fainted last turn.",
		name: "Vengeful Bone",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Shadow Bone", target);
		},
		onBasePower(basePower, pokemon) {
			if (pokemon.side.faintedLastTurn) {
				this.debug('Boosted for a faint last turn');
				return this.chainModify(2);
			}
		},
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	escort: {
		accuracy: 100,
		basePower: 50,
		category: "Special",
		shortDesc: "User switches out. Switch-in is immune to hazards.",
		name: "Escort",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		selfSwitch: true,
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Baton Pass", source);
		},
		self: {
			sideCondition: 'escort',
		},
		condition: {
			duration: 1,
		},
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	stealthrock: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasItem('heavydutyboots') || pokemon.side.getSideCondition('escort')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				this.damage(pokemon.maxhp * (2 ** typeMod) / 8);
			},
		},
	},
	gmaxsteelsurge: {
		inherit: true,
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: G-Max Steelsurge');
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasItem('heavydutyboots') || pokemon.side.getSideCondition('escort')) return;
				// Ice Face and Disguise correctly get typed damage from Stealth Rock
				// because Stealth Rock bypasses Substitute.
				// They don't get typed damage from Steelsurge because Steelsurge doesn't,
				// so we're going to test the damage of a Steel-type Stealth Rock instead.
				const steelHazard = this.dex.getActiveMove('Stealth Rock');
				steelHazard.type = 'Steel';
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(steelHazard), -6, 6);
				this.damage(pokemon.maxhp * (2 ** typeMod) / 8);
			},
		},
	},
	spikes: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots') || pokemon.side.getSideCondition('escort')) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
			},
		},
	},
	stickyweb: {
		inherit: true,
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots') || pokemon.side.getSideCondition('escort')) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({ spe: -1 }, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
			},
		},
	},
	toxicspikes: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', `[of] ${pokemon}`);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (pokemon.hasType('Steel') || pokemon.hasItem('heavydutyboots') || pokemon.side.getSideCondition('escort')) {
					// do nothing
				} else if (this.effectState.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
			},
		},
	},
	/* // leftover placeholder for hidden power because teams.ts was not cooperating previously
	terablast: {
		num: 851,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Tera Blast",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, mustpressure: 1 },
		onPrepareHit(target, source, move) {
			this.attrLastMove('[anim] Tera Blast ' + source.teraType);
		},
		onModifyType(move, pokemon, target) {
			move.type = pokemon.teraType;
			this.add('-message', `This attack is ${pokemon.teraType}-type!`);
		},
		target: "normal",
		type: "Normal",
	}, */
	magicroom: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('blackout')) {
					this.add('-activate', source, 'ability: blackout', '[move] Magic Room');
					return 0;
				}
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Magic Room');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Magic Room', `[of] ${source}`, '[persistent]');
				} else {
					this.add('-fieldstart', 'move: Magic Room', `[of] ${source}`);
				}
				for (const mon of this.getAllActive()) {
					this.singleEvent('End', mon.getItem(), mon.itemState, mon);
				}
			},
			onFieldRestart(target, source) {
				this.field.removePseudoWeather('magicroom');
			},
			// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 6,
			onFieldEnd() {
				this.add('-fieldend', 'move: Magic Room', '[of] ' + this.effectState.source);
			},
		},
	},
};
