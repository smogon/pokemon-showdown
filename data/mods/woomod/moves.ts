export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	bouncybubble: {
		inherit: true,
		isNonstandard: null,
	},
	downtownslide: {
		accuracy: 100,
		basePower: 75,
		basePowerCallback(pokemon, target, move) {
			let allLayers = 0;
			for (const side of this.sides) {
				for (const id of ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge']) {
					const sideCondition = side.sideConditions[id];
					if (!sideCondition) continue;
					allLayers += sideCondition.layers ?? 1;
				}
			}
			this.debug('Downtown Slide damage boost');
			const bp = move.basePower + 15 * allLayers;
			this.add('-message', `Downtown Slide currently has a BP of ${bp}!`);
			return bp;
		},
		category: "Physical",
		shortDesc: "+15 power for each hazard layer on the field.",
		name: "Downtown Slide",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Acid Downpour", target);
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	shimmeringsap: {
		name: "Shimmering Sap",
		type: "Grass",
		category: "Special",
		basePower: 110,
		accuracy: 90,
		pp: 5,
		shortDesc: "Super effective on Dragon.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Seed Flare", target);
		},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Dragon') return 1;
		},
		target: "normal",
	},
	bluemoon: {
		name: "Blue Moon",
		type: "Fairy",
		category: "Special",
		basePower: 75,
		accuracy: 100,
		pp: 10,
		shortDesc: "User recovers 50% of the damage dealt.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, heal: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Moonblast", target);
		},
		drain: [1, 2],
		target: "normal",
	},
	nymblekick: {
		name: "Nymble Kick",
		type: "Steel",
		category: "Physical",
		basePower: 80,
		accuracy: 100,
		pp: 10,
		shortDesc: "Extends the duration of Rain by 1 turn.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, contact: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Mega Kick", target);
		},
		onHit(target, source) {
			if (this.field.weather === 'raindance') this.field.weatherState.duration!++;
		},
		target: "normal",
	},
	vanilliteattackwithtoomanyeffects: {
		name: "Vanillite Attack With Too Many Effects",
		type: "Fire",
		category: "Special",
		basePower: 80,
		accuracy: 100,
		pp: 10,
		shortDesc: "Burns the user.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Inferno Overdrive", target);
		},
		onHit(target, pokemon) {
			if (pokemon.trySetStatus('brn')) this.field.setWeather('sunnyday');
		},
		target: "normal",
	},
	starsmash: {
		name: "Star Smash",
		type: "Fairy",
		category: "Physical",
		basePower: 90,
		accuracy: 100,
		pp: 10,
		shortDesc: "Special if user's Sp. Atk > Atk.",
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Sunsteel Strike", target);
		},
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) < pokemon.getStat('spa', false, true)) move.category = 'Special';
		},
		target: "normal",
	},
	mentalspin: {
		name: "Mental Spin",
		type: "Psychic",
		category: "Physical",
		basePower: 30,
		accuracy: 100,
		pp: 15,
		shortDesc: "Confuses foes, frees user from hazards/bind/leech.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, contact: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Zen Headbutt", target);
		},
		onAfterHit(target, pokemon, move) {
			if (!move.hasSheerForce) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Mental Spin', `[of] ${pokemon}`);
				}
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Mental Spin', `[of] ${pokemon}`);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			}
		},
		onAfterSubDamage(damage, target, pokemon, move) {
			if (!move.hasSheerForce) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Mental Spin', `[of] ${pokemon}`);
				}
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Mental Spin', `[of] ${pokemon}`);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			}
		},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "allAdjacentFoes",
	},
	wigglinglash: {
		name: "Wiggling Lash",
		type: "Grass",
		category: "Physical",
		basePower: 80,
		accuracy: 100,
		pp: 10,
		shortDesc: "If used in Grassy Terrain, sets a layer of Toxic Spikes.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Fire Lash", target);
		},
		onAfterHit(target, source, move) {
			if (this.field.isTerrain('grassyterrain') && source.hp) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('toxicspikes');
				}
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			if (this.field.isTerrain('grassyterrain') && source.hp) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('toxicspikes');
				}
			}
		},
		target: "normal",
	},
	burialblast: {
		name: "Burial Blast",
		type: "Ground",
		category: "Special",
		basePower: 80,
		onBasePower(basePower, source) {
			if (this.field.isTerrain('grassyterrain')) {
				this.debug('terrain buff');
				return this.chainModify(1.5);
			}
		},
		accuracy: 100,
		pp: 10,
		shortDesc: "Deals 1.5x damage if used in Grassy Terrain.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Earth Power", target);
		},
		target: "normal",
	},
	duoshock: {
		name: "Duoshock",
		type: "Psychic",
		category: "Physical",
		basePower: 35,
		accuracy: 100,
		pp: 15,
		shortDesc: "Hits twice. First hit adds Fighting to the target.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Psyshock", target);
		},
		multihit: 2,
		onHit(target) {
			if (!target.hasType('Fighting') && target.addType('Fighting')) {
				this.add('-start', target, 'typeadd', 'Fighting', '[from] move: Duoshock');
			}
		},
		target: "normal",
	},
	ivycudgel: {
		inherit: true,
		onPrepareHit(target, pokemon, move) {
			this.add('-anim', pokemon, "Ivy Cudgel", target);
		},
		onModifyType(move, pokemon) {
			if (pokemon.species.id !== "farfetchd") return;
			switch (pokemon.item) {
			case 'wellspringmask':
				move.type = 'Water';
				break;
			case 'hearthflamemask':
				move.type = 'Fire';
				break;
			case 'cornerstonemask':
				move.type = 'Rock';
				break;
			case 'stormbringermask':
				move.type = 'Electric';
				break;
			}
		},
	},
	meteorcrash: {
		name: "Meteor Crash",
		type: "Rock",
		category: "Special",
		basePower: 120,
		accuracy: 100,
		pp: 15,
		shortDesc: "Has 33% recoil.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Draco Meteor", target);
		},
		recoil: [33, 100],
		target: "normal",
	},

	stealthrock: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasItem('heavydutyboots') || pokemon.side.getSlotCondition(pokemon, 'phantomchute')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
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
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots') ||
					pokemon.side.getSlotCondition(pokemon, 'phantomchute')) {
					return;
				}
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
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
				} else if (pokemon.hasType('Steel') || pokemon.hasItem('heavydutyboots') || pokemon.hasAbility('forbiddenjuice') ||
					pokemon.side.getSlotCondition(pokemon, 'phantomchute')) {
					return;
				} else if (this.effectState.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
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
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots') ||
					pokemon.side.getSlotCondition(pokemon, 'phantomchute')) {
					return;
				}
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({ spe: -1 }, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
			},
		},
	},
	friendlyfire: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Friendly Fire",
		pp: 25,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onEffectiveness(typeMod, target, type) {
			if (type === 'Fire') return 1;
		},
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Flamethrower', target);
		},
		type: "Fire",
		shortDesc: "Super effective on Fire types.",
	},
	ladybugdance: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Ladybug Dance",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, dance: 1, metronome: 1 },
		boosts: {
			spa: 1,
			spe: 1,
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Quiver Dance', target);
		},
		target: "self",
		type: "Bug",
	},
	frigidlyslide: {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Frigidly Slide",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, defrost: 1 },
		secondary: {
			chance: 100,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
		shortDesc: "Freezes the target.",
	},
	woopout: {
		name: "Woop Out",
		basePower: 60,
		type: "Ground",
		category: "Physical",
		accuracy: 100,
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, contact: 1 },
		shortDesc: "Sets 1-3 Spikes on foe side based on target's total stat boosts.",
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Play Rough', target);
		},
		onHit(target, source) {
			let boostSum = 0;
			for (const stat in target.boosts) {
				boostSum += target.boosts[stat as BoostID];
			}
			let layers = 0;
			if (boostSum > 0) layers = 1;
			if (boostSum > 3) layers = 2;
			if (boostSum > 6) layers = 3;
			if (!layers) return;
			for (let i = 0; i < layers; i++) {
				if (!target.side.addSideCondition('spikes', source)) break;
			}
		},
		target: "normal",
	},
	aegislash: {
		name: "Aegi Slash",
		basePower: 45,
		type: "Ghost",
		accuracy: 100,
		category: "Physical",
		pp: 10,
		shortDesc: "Hits twice. First hit: +5 priority, second hit: end of turn.",
		priority: 5,
		target: 'normal',
		flags: { protect: 1, mirror: 1, metronome: 1, contact: 1 },
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Night Slash', target);
		},
		onHit(source, target) {
			if (!source.side.addSlotCondition(target, 'futuremove') && target.hp && target.isActive) return false;
			Object.assign(source.side.slotConditions[target.position]['futuremove'], {
				duration: 1,
				move: 'aegislash',
				source: target,
				moveData: {
					id: 'aegislash',
					name: "aegislash",
					accuracy: 100,
					basePower: 45,
					category: "Physical",
					priority: -6,
					flags: { protect: 1 },
					onTryHit() {
						if (source.fainted || !source.isActive) return false;
					},
					ignoreImmunity: false,
					effectType: 'Move',
					isFutureMove: true,
					type: 'Ghost',
				},
			});
			this.add('-start', source, 'move: Aegislash');
			return null;
		},
	},
	electroball: {
		inherit: true,
		basePower: 90,
		basePowerCallback: undefined,
		overrideOffensiveStat: 'spe',
		shortDesc: "Uses Spe as Atk in damage calculation.",
	},
	vcreate: {
		inherit: true,
		self: {
			boosts: {
				spe: -2,
				def: -1,
				spd: -1,
			},
		},
	},
};
