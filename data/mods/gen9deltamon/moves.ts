export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	suckypunch: {
		name: "Sucky Punch",
		type: "Water",
		category: "Physical",
		basePower: 75,
		accuracy: 100,
		pp: 10,
		shortDesc: "User recovers 50% of damage dealt.",
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Surging Strikes", target);
		},
		target: "normal",
	},
	spadeblast: {
		name: "Spade Blast",
		type: "Dark",
		category: "Physical",
		basePower: 45,
		accuracy: 100,
		pp: 10,
		shortDesc: "Hits twice. Attempts to hit each available foe once.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: 2,
		smartTarget: true,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Fling", target);
			this.add('-anim', pokemon, "Fling", target);
		},
		target: "normal",
	},
	shockingsnare: {
		name: "Shocking Snare",
		type: "Electric",
		category: "Physical",
		basePower: 40,
		basePowerCallback(pokemon, target, move) {
			if (target.beingCalledBack || target.switchFlag) {
				this.debug('Shocking Snare boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		accuracy: 100,
		pp: 20,
		shortDesc: "Acts before switching. 2x damage if target is switching.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		beforeTurnCallback(pokemon) {
			for (const side of this.sides) {
				if (side.hasAlly(pokemon)) continue;
				side.addSideCondition('shockingsnare', pokemon);
				const data = side.getSideConditionData('shockingsnare');
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onModifyMove(move, source, target) {
			if (target?.beingCalledBack || target?.switchFlag) move.accuracy = true;
		},
		onTryHit(target, pokemon) {
			target.side.removeSideCondition('shockingsnare');
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Thunder Cage", target);
			this.add('-anim', pokemon, "Sucker Punch", target);
		},
		// Copied from Pursuit
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Shocking Snare start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectState.sources) {
					if (!source.isAdjacent(pokemon) || !this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Shocking Snare');
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
					this.actions.runMove('shockingsnare', source, source.getLocOf(pokemon));
				}
			},
		},
		target: "normal",
	},
	buble: {
		name: "Buble",
		type: "Water",
		category: "Special",
		basePower: 135,
		accuracy: 95,
		pp: 5,
		shortDesc: "Buble.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Oceanic Operetta", target);
		},
		target: "normal",
	},
	snowgrave: {
		name: "Snowgrave",
		type: "Ice",
		category: "Special",
		basePower: 140,
		accuracy: true,
		pp: 5,
		shortDesc: "50% of your max HP is used up. 15% freeze.",
		priority: 0,
		flags: { protect: 1 },
		mindBlownRecoil: true,
		onAfterMove(pokemon, target, move) {
			if (move.mindBlownRecoil && !move.multihit) {
				const hpBeforeRecoil = pokemon.hp;
				this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Snowgrave'), true);
				if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
					this.runEvent('EmergencyExit', pokemon, pokemon);
				}
			}
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Blizzard", target);
			this.add('-anim', pokemon, "Sheer Cold", target);
		},

		secondary: {
			chance: 15,
			status: 'frz',
		},
		target: "normal",
	},
	smartzephyr: {
		name: "Smart Zephyr",
		type: "Flying",
		category: "Special",
		basePower: 60,
		accuracy: 100,
		pp: 10,
		shortDesc: "Priority -6. Forces the target to switch to a random ally.",
		priority: -6,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		forceSwitch: true,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Nasty Plot", target);
			this.add('-anim', pokemon, "Whirlwind", target);
		},
		target: "normal",
		contestType: "Clever",
	},
	chaosbomb: {
		name: "Chaos Bomb",
		type: "Ghost",
		category: "Status",
		basePower: 0,
		accuracy: true,
		pp: 10,
		shortDesc: "Sets a random terrain and weather, user switches.",
		priority: 0,
		flags: { metronome: 1 },
		selfSwitch: true,
		onHit(move, pokemon) {
			const randTerrain = this.random(100);
			const randWeather = this.random(100);
			if (randTerrain < 26) {
				this.field.setTerrain('electricterrain');
			} else if (randTerrain < 51) {
				this.field.setTerrain('psychicterrain');
			} else if (randTerrain < 76) {
				this.field.setTerrain('grassyterrain');
			} else {
				this.field.setTerrain('mistyterrain');
			}
			if (randWeather < 26) {
				this.field.setWeather('sunnyday');
			} else if (randWeather < 51) {
				this.field.setWeather('raindance');
			} else if (randWeather < 76) {
				this.field.setWeather('snow');
			} else {
				this.field.setWeather('sandstorm');
			}
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Mind Blown", target);
		},
		target: "normal",
	},
	bigshot: {
		name: "BIG SHOT",
		type: "Electric",
		category: "Special",
		basePower: 150,
		accuracy: true,
		pp: 1,
		noPPBoosts: true,
		shortDesc: "Partially hits through Protect.",
		priority: 0,
		flags: { metronome: 1, bullet: 1, pulse: 1, protect: 1 },
		onModifyMove(move) {
			delete move.flags['protect'];
		},

		onBasePower(basePower, source, target) {
			if (target.volatiles['protect']) {
				this.debug('Big Shot Bypass');
				this.chainModify(0.25);
			}
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Gigavolt Havoc", target);
		},
		target: "normal",
	},
	blackknife: {
		name: "Black Knife",
		type: "Dark",
		category: "Physical",
		basePower: 100,
		accuracy: true,
		pp: 5,
		shortDesc: "Targets with 1/3 HP or lower are instantly KOed.",
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		onTryHit(target, pokemon, move) {
			if (target.hp * 3 <= target.maxhp) {
				this.add('-message', "SWOON!");
				move.ohko = true;
			}
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Ceaseless Edge", target);
		},
		target: "normal",
	},
	bellchime: {
		name: "Bell Chime",
		type: "Steel",
		category: "Special",
		basePower: 85,
		accuracy: 100,
		pp: 10,
		shortDesc: "10% chance to Confuse. Bypasses Substitute.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, sound: 1, bypasssub: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Heal Bell", target);
			this.add('-anim', pokemon, "Hyper Voice", target);
		},
		secondary: {
			chance: 10,
			volatileStatus: 'confusion',
		},
		target: "normal",
	},
	miccheck: {
		name: "Mic Check",
		type: "Normal",
		category: "Special",
		basePower: 20,
		accuracy: 100,
		pp: 15,
		shortDesc: "Hits 2-5 times. Bypasses Substitute.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, sound: 1, bypasssub: 1 },
		multihit: [2, 5],
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Boomburst", target);
		},
		target: "allAdjacent",
	},
	rudebuster: {
		name: "Rude Buster",
		type: "Dragon",
		category: "Physical",
		overrideDefensiveStat: 'spd',
		basePower: 85,
		accuracy: 100,
		pp: 10,
		shortDesc: "Hits target's Special Defense rather than Defense.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Dragon Pulse", target);
			this.add('-anim', pokemon, "Psyshock", target);
		},
		target: "normal",
	},
	battleact: {
		name: "Battle Act",
		type: "Normal",
		category: "Status",
		basePower: 0,
		accuracy: true,
		pp: 10,
		shortDesc: "Opponents: -1 SpD & Def, Allies: +1 SpA & Atk. Priority +1. Bypasses Substitute.",
		priority: 1,
		flags: { protect: 1, mirror: 1, metronome: 1, reflectable: 1, bypasssub: 1, allyanim: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Metronome", target);
			this.add('-anim', pokemon, "Lovely Kiss", target);
		},
		onModifyMove(move, source, target) {
			if (target?.isAlly(source)) move.boosts = { atk: 1, spa: 1 };
			else move.boosts = { def: -1, spd: -1 };
		},
		target: "normal",
		zMove: { boost: { spe: 1 } },
	},
	pacify: {
		name: "Pacify",
		type: "Fairy",
		category: "Status",
		basePower: 0,
		accuracy: 100,
		pp: 5,
		shortDesc: "Enemies below 100% HP: Drowsy. Can't be used twice.",
		priority: 0,
		flags: { protect: 1, mirror: 1, reflectable: 1, metronome: 1, cantusetwice: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Mist", target);
		},
		onHit(target) {
			if (target.status || !target.runStatusImmunity('slp') || target.hp >= target.maxhp) return;
			target.addVolatile('yawn');
		},

		target: "allAdjacentFoes",
		zMove: { boost: { def: 1 } },
	},
	bedazzlingblade: {
		name: "Bedazzling Blade",
		type: "Fairy",
		category: "Physical",
		basePower: 85,
		accuracy: 100,
		pp: 10,
		shortDesc: "20% chance to confuse.",
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Dazzling Gleam", target);
			this.add('-anim', pokemon, "Aqua Cutter", target);
		},
		secondary: {
			chance: 20,
			volatileStatus: 'confusion',
		},
		target: "normal",
	},
	neochaos: {
		name: "Neo Chaos",
		type: "Stellar",
		category: "Special",
		basePower: 160,
		accuracy: true,
		pp: 1,
		shortDesc: "Random status, weather, and terrain. User switches.",
		priority: 0,
		flags: {},
		selfSwitch: true,
		isZ: "jestersshadowcrystal",
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Nature's Madness", target);
			this.add('-anim', pokemon, "Ruination", target);
			this.add('-anim', pokemon, "Hex", target);
		},
		secondary:
		{
			chance: 100,
			onHit(target, source) {
				const randStatus = this.sample(['psn', 'tox', 'par', 'slp', 'frz', 'brn']);
				// Neo Chaos will attempt to inflict a status before the field effects to avoid clashing with Misty Terrain.
				target.trySetStatus(randStatus, source);
			},
			self: {
				onHit(pokemon, target, source) {
					const randTerrain = this.random(100);
					const randWeather = this.random(100);
					if (randTerrain < 26) {
						this.field.setTerrain('electricterrain');
					} else if (randTerrain < 51) {
						this.field.setTerrain('psychicterrain');
					} else if (randTerrain < 76) {
						this.field.setTerrain('grassyterrain');
					} else {
						this.field.setTerrain('mistyterrain');
					}
					if (randWeather < 26) {
						this.field.setWeather('sunnyday');
					} else if (randWeather < 51) {
						this.field.setWeather('raindance');
					} else if (randWeather < 76) {
						this.field.setWeather('snow');
					} else {
						this.field.setWeather('sandstorm');
					}
				},
			},
		},
		target: "normal",
	},
	transmitkromer: {
		name: "TRANSMIT KROMER",
		type: "Steel",
		category: "Special",
		basePower: 180,
		accuracy: true,
		pp: 1,
		shortDesc: "User heals 50% of the damage dealt. Speed +1",
		priority: 0,
		flags: { heal: 1 },
		drain: [1, 2],
		selfBoost: {
			boosts: {
				spe: 1,
			},
		},
		isZ: "puppetsshadowcrystal",
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Giga Drain", target);
			this.add('-anim', pokemon, "Make It Rain", target);
		},
		target: "normal",
	},
	bellowingstarburstslice: {
		name: "Bellowing Starburst Slice",
		type: "Dark",
		category: "Physical",
		basePower: 180,
		accuracy: true,
		pp: 1,
		ohko: false,
		shortDesc: "Targets with 45% HP or lower are instantly KOed.",
		priority: 0,
		flags: { slicing: 1 },
		isZ: "knightsshadowcrystal",
		// I originally wanted this to be a spread move. I'm disabling it for now because I'm not sure if this individual OHKO mechanic is even possible to implement. Until I find a solution that works, Bellowing Starburst Slice will be single-target.
		// onHit(damage, target, pokemon, move) {
		// const hpBeforeHit = target.hp + damage;
		// if (target.hpBeforeHit * 0.45 <= target.maxhp && !target.volatiles ['substitute']) {
		// this.add('-message', `SWOON! On ${target.name}!`);
		// target.faint();
		// }
		// },
		onTryHit(target, pokemon, move) {
			if (target.hp * 100 / 45 <= target.maxhp) {
				this.add('-message', "SWOON!");
				move.ohko = true;
			}
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Snarl", target);
			this.add('-anim', pokemon, "Swift", target);
			this.add('-anim', pokemon, "Spacial Rend", target);
		},

		target: "normal",
	},
	omegaperseverance: {
		name: "Omega Perseverance",
		type: "Psychic",
		category: "Special",
		basePower: 190,
		accuracy: true,
		pp: 1,
		shortDesc: "Clears stats. Disables ability before damage. 50% confuse.",
		priority: 0,
		flags: {},
		isZ: "violetomegapetal",
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Miracle Eye", target);
			this.add('-anim', pokemon, "Springtide Storm", target);
			this.add('-anim', pokemon, "Block", target);
		},
		onTryHit(target) {
			if (target.getAbility().flags['cantsuppress']) return;
			target.addVolatile('gastroacid');
		},
		onHit(target) {
			target.clearBoosts();
			this.add('-clearboost', target);
		},

		secondary: {
			chance: 50,
			volatileStatus: 'confusion',
		},
		target: "normal",
	},
	omegajustice: {
		name: "Omega Justice",
		type: "Fighting",
		category: "Special",
		basePower: 120,
		accuracy: true,
		pp: 1,
		shortDesc: "Always crits, bypasses Substitute, ignores abilities.",
		priority: 0,
		flags: { bullet: 1, bypasssub: 1 },
		willCrit: true,
		ignoreAbility: true,
		isZ: "goldenomegapetal",
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Photon Geyser", target);
		},
		target: "normal",
	},
	omegabravery: {
		name: "Omega Bravery",
		type: "Fighting",
		category: "Physical",
		basePower: 18,
		accuracy: true,
		pp: 1,
		shortDesc: "Hits 10 times. Priority +1. User can't switch.",
		priority: 1,
		flags: { punch: 1, contact: 1 },
		multihit: 10,
		self: {
			volatileStatus: 'noretreat',
		},
		isZ: "amberomegapetal",
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "All-Out Pummeling", target);
		},
		target: "normal",
	},
	omegakindness: {
		name: "Omega Kindness",
		type: "Grass",
		category: "Status",
		basePower: 0,
		accuracy: true,
		pp: 1,
		shortDesc: "Full heal + PP, clears negative boosts, cures status + confusion.",
		priority: 0,
		flags: { heal: 1 },
		heal: [1, 1],
		isZ: "verdantomegapetal",
		onHit(target) {
			target.clearStatus();
			target.removeVolatile('confusion');
			target.setBoost(this.effectState.boosts);
			this.add('-clearnegativeboost', target, '[silent]');
			for (const moveSlot of target.moveSlots) {
				moveSlot.pp = moveSlot.maxpp;
			}
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Flower Trick", target);
		},
		target: "adjacentAllyOrSelf",
	},
	omegaintegrity: {
		name: "Omega Integrity",
		type: "Water",
		category: "Special",
		basePower: 190,
		accuracy: true,
		pp: 1,
		shortDesc: "Defog effect for both sides. Set a rainbow for 4 turns.",
		priority: 0,
		flags: {},
		self: {
			sideCondition: 'waterpledge',
		},
		isZ: "azureomegapetal",
		// Copied from Defog
		onHit(target, source, move) {
			let success = false;
			const removeTarget = [
				'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist',
			];
			const removeSource = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
				'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist'];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeTarget.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name,
						'[from] move: Omega Integrity', `[of] ${source}`);
					success = true;
				}
			}
			for (const sideCondition of removeSource) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Omega Integrity', `[of] ${source}`);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Lunar Blessing", pokemon);
			this.add('-anim', pokemon, "Hydro Pump", target);
		},
		target: "normal",
	},
	omegapatience: {
		name: "Omega Patience",
		type: "Fairy",
		category: "Physical",
		basePower: 215,
		accuracy: true,
		pp: 1,
		shortDesc: "Hits 4 turns after use. Ignores stats. Fails if Future Move is up.",
		priority: 0,
		flags: { allyanim: 1, futuremove: 1, slicing: 1 },
		ignoreDefensive: true,
		isZ: 'cyanomegapetal',
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 5,
				move: 'omegapatience',
				source,
				moveData: {
					id: 'omegapatience',
					name: "Omega Patience",
					accuracy: true,
					basePower: 215,
					category: "Physical",
					priority: 0,
					flags: { allyanim: 1, futuremove: 1, slicing: 1 },
					ignoreDefensive: true,
					ignoreImmunity: false,
					effectType: 'Move',
					type: 'Fairy',
				},
			});
			this.add('-start', source, 'move: Omega Patience');
			return this.NOT_FAIL;
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Tachyon Cutter", target);
		},
		target: "normal",
	},
	mewmewwand: {
		name: "Mew Mew Wand",
		category: "Special",
		basePower: 95,
		accuracy: 100,
		pp: 10,
		shortDesc: "Pink: PSY, 50% -SpA, Corporeal. GHST, 50% -Atk, Ghost.",
		type: "Psychic",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, pulse: 1 },
		onTry(source) {
			if (source.species.baseSpecies === 'Pink') {
				return;
			}
			this.attrLastMove('[still]');
			this.add('-fail', source, 'move: Mew Mew Wand');
			return null;
		},
		onModifyType(move, pokemon) {
			if (pokemon.species.name === 'Pink-Ghost') move.type = 'Ghost';
		},
		onModifyMove(move, pokemon) {
			if (pokemon.species.name === 'Pink-Ghost') {
				move.secondaries = [{
					chance: 50,
					boosts: { atk: -1 },
				}];
			} else {
				move.secondaries = [{
					chance: 50,
					boosts: { spa: -1 },
				}];
			}
		},
		onPrepareHit(target, pokemon, move) {
			if (pokemon.species.name === 'Pink') {
				this.attrLastMove('[still]');
				this.add('-anim', pokemon, "Fleur Cannon", target);
			} else {
				this.attrLastMove('[still]');
				this.add('-anim', pokemon, "Infernal Parade", target);
			}
		},
		target: "normal",
	},
	taintedvines: {
		name: "Tainted Vines",
		type: "Grass",
		category: "Physical",
		basePower: 80,
		basePowerCallback(pokemon, target, move) {
			const bp = move.basePower + 20 * target.positiveBoosts();
			this.debug(`BP: ${bp}`);
			if (bp >= 140) {
				move.drain = [1, 3];
				move.flags.heal = 1;
				this.add('-anim', pokemon, "Giga Drain", target);
			}
			return bp;
		},

		accuracy: 100,
		pp: 5,
		shortDesc: "+20 BP per enemy boost. 140 Power: heal 33% dmg.",
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Power Whip", target);
		},

		target: "normal",
	},
	jarona: {
		name: "Jarona",
		type: "Grass",
		category: "Physical",
		basePower: 95,
		accuracy: 100,
		pp: 10,
		shortDesc: "50% chance to lower Defense by 1. High critical rate.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, contact: 1, punch: 1 },
		critRatio: 2,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Leaf Storm", target);
			this.add('-anim', pokemon, "Mach Punch", target);
		},
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
	},
	gorgonsgaze: {
		name: "Gorgon's Gaze",
		type: "Rock",
		category: "Special",
		basePower: 65,
		accuracy: 100,
		pp: 10,
		shortDesc: "30% par. chance, 2x power on paralyzed target.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, pokemon, target) {
			if (target.status === 'par') {
				return this.chainModify(2);
			}
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Freezing Glare", target);
			this.add('-anim', pokemon, "Glare", target);
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
	},
	cleansingflame: {
		name: "Cleansing Flame",
		type: "Fire",
		category: "Special",
		basePower: 70,
		accuracy: 100,
		pp: 10,
		shortDesc: "Clears target's stat changes before doing damage.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Mystical Fire", target);
			this.add('-anim', pokemon, "Nature's Madness", target);
		},

		onTryHit(target) {
			if (!target.volatiles['substitute']) {
				target.clearBoosts();
				this.add('-clearboost', target);
			}
		},
		target: "normal",
	},

	blueattack: {
		name: "Blue Attack",
		type: "Ground",
		category: "Physical",
		basePower: 70,
		accuracy: 100,
		pp: 5,
		shortDesc: "Grounds target. Priority +1. Fails if target isn't attacking.",
		priority: 1,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'smackdown',
		ignoreImmunity: { 'Ground': true },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Water Pulse", target);
		},
		onTry(source, target) {
			const action = this.queue.willMove(target);
			const move = action?.choice === 'move' ? action.move : null;
			if (!move || (move.category === 'Status' && move.id !== 'mefirst') || target.volatiles['mustrecharge']) {
				return false;
			}
		},
		// copied from Thousand Arrows
		onEffectiveness(typeMod, target, type, move) {
			if (move.type !== 'Ground') return;
			if (!target) return; // avoid crashing when called from a chat plugin
			// ignore effectiveness if the target is Flying type and immune to Ground
			if (!target.runImmunity('Ground')) {
				if (target.hasType('Flying')) return 0;
			}
		},
		target: "normal",
	},
	rousingmelody: {
		name: "Rousing Melody",
		type: "Water",
		category: "Status",
		basePower: 0,
		accuracy: 100,
		pp: 10,
		shortDesc: "Ally Pokemon gets +1 Speed, cures Sleep or Drowsy. Bypasses Substitute",
		priority: 0,
		flags: { protect: 1, mirror: 1, reflectable: 1, metronome: 1, sound: 1, bypasssub: 1 },
		boosts: {
			spe: 1,
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Screech", target);
		},
		onHit(target) {
			if (target.status === 'slp') target.cureStatus();
			if (target.volatiles['yawn']) target.removeVolatile('yawn');
		},
		target: "adjacentAlly",
		zMove: { boost: { spe: 1 } },
	},
	// copied from Knock Off
	expelspell: {
		name: "Expel Spell",
		type: "Psychic",
		category: "Special",
		basePower: 70,
		accuracy: 100,
		pp: 20,
		shortDesc: "1.5x damage if target holds an item. Removes item.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Expanding Force", target);
		},
		onBasePower(basePower, source, target, move) {
			const item = target.getItem();
			if (!this.singleEvent('TakeItem', item, target.itemState, target, target, move, item)) return;
			if (item.id) {
				return this.chainModify(1.5);
			}
		},
		onAfterHit(target, source) {
			const item = target.takeItem();
			if (item) {
				this.add('-enditem', target, item.name, '[from] move: Expel Spell', `[of] ${source}`);
			}
		},
		target: "normal",
	},
	goodmorningstar: {
		name: "Good Morningstar",
		type: "Steel",
		category: "Physical",
		basePower: 90,
		basePowerCallback(pokemon, target, move) {
			if (target.status === 'slp' || target.hasAbility('comatose')) {
				this.debug('Good Morningstar double damage');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		accuracy: 100,
		pp: 15,
		shortDesc: "2x damage + confusion on sleeping targets. Wakes sleeping targets.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onHit(target) {
			if (target.status === 'slp') {
				target.cureStatus();
				target.addVolatile('confusion');
			}
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Gigaton Hammer", target);
		},
		target: "normal",
	},
	spearbarrage: {
		name: "Spear Barrage",
		type: "Water",
		category: "Physical",
		basePower: 25,
		accuracy: 100,
		pp: 10,
		shortDesc: "Hits 4-5 times. Targets a random opponent.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		multihit: [4, 5],
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Water Shuriken", target);
		},
		target: "randomNormal",
	},
	flamingtrident: {
		name: "Flaming Trident",
		type: "Fire",
		category: "Physical",
		basePower: 90,
		accuracy: 100,
		pp: 10,
		shortDesc: "30% chance to Taunt the target for 3 turns.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Fire Lash", target);
		},
		secondary: {
			chance: 30,
			volatileStatus: 'taunt',
		},
		target: "normal",
	},
	gasterblaster: {
		name: "Gaster Blaster",
		type: "Ghost",
		category: "Special",
		basePower: 95,
		accuracy: 100,
		pp: 10,
		shortDesc: "Ally fainted last turn: poison the target.",
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Hyper Beam", target);
		},
		onHit(target, source, move) {
			if (source.side.faintedLastTurn) target.trySetStatus('psn');
		},
		target: "normal",
	},
	umbrallaser: {
		name: "Umbral Laser",
		type: "Dark",
		category: "Special",
		basePower: 140,
		accuracy: 100,
		pp: 5,
		shortDesc: "Def & SpD -2 before attacking.",
		priority: 0,
		flags: { protect: 1, failcopycat: 1, failmimic: 1 },
		onTryMove(attacker, defender, move) {
			this.add('-message', `${attacker.name} lowers its guard!`);
			this.boost({ spd: -2, def: -2 }, attacker, attacker, move);
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Scale Shot", target);
			this.add('-anim', pokemon, "Doom Desire", target);
		},
		target: "normal",
	},
	starblazing: {
		name: "Star Blazing",
		type: "Normal",
		category: "Special",
		basePower: 130,
		accuracy: 100,
		pp: 5,
		shortDesc: "Ignores the target's stat changes.",
		priority: 0,
		flags: { protect: 1, failcopycat: 1, failmimic: 1 },
		ignoreDefensive: true,
		ignoreEvasion: true,
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Tera Starstorm", target);
		},
		target: "normal",
	},
	hypergoner: {
		name: "Hyper Goner",
		type: "Normal",
		category: "Special",
		basePower: 0,
		accuracy: true,
		pp: 1,
		shortDesc: "Sets the target's HP to 1.",
		priority: 0,
		flags: {},
		isZ: "soulcollective",
		ignoreImmunity: true,
		damageCallback(pokemon, target) {
			const hp1 = target.getUndynamaxedHP() - 1;
			return Math.floor(hp1);
		},
		onPrepareHit(target, pokemon, move) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Black Hole Eclipse", target);
		},
		target: "normal",
	},
	// Pollen Puff and Sharpshooter
	pollenpuff: {
		inherit: true,
		onHit(target, source, move) {
			if (source.isAlly(target)) {
				let mult = 0.5;
				if (source.ability === 'Sharpshooter') mult = 0.75;
				if (!this.heal(Math.floor(target.baseMaxhp * mult))) {
					return this.NOT_FAIL;
				}
			}
		},
	},
	// Torque Moves
	blazingtorque: {
		inherit: true,
		isNonstandard: null,
	},
	wickedtorque: {
		inherit: true,
		isNonstandard: null,
	},
};
