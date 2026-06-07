/**
 * A lot of Gen 1 moves have to be updated due to different mechanics.
 * Some moves have had major changes, such as Bite's typing.
 */

export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	acid: {
		inherit: true,
		secondary: {
			chance: 33,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		gen: 1,
	},
	airslash: {
		num: 403,
		accuracy: 95,
		basePower: 75,
		category: "Special",
		name: "Air Slash",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, slicing: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "any",
		type: "Flying",
		contestType: "Cool",
		gen: 1,
	},
	amnesia: {
		inherit: true,
		boosts: {
			spa: 2,
			spd: 2,
		},
		gen: 1,
	},
	aquajet: {
		num: 453,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Aqua Jet",
		pp: 20,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		target: "normal",
		type: "Water",
		contestType: "Cool",
		gen: 1,
	},
	aurorabeam: {
		inherit: true,
		secondary: {
			chance: 33,
			boosts: {
				atk: -1,
			},
		},
		gen: 1,
	},
	bide: {
		inherit: true,
		accuracy: true,
		condition: {
			onStart(pokemon) {
				this.effectState.damage = 0;
				this.effectState.time = this.random(2, 4);
				this.add('-start', pokemon, 'Bide');
			},
			onBeforeMove(pokemon, t, move) {
				const currentMove = this.dex.getActiveMove('bide');
				this.effectState.damage += this.lastDamage;
				this.effectState.time--;
				if (!this.effectState.time) {
					this.add('-end', pokemon, currentMove);
					if (!this.effectState.damage) {
						this.debug("Bide failed because no damage was stored");
						this.add('-fail', pokemon);
						pokemon.removeVolatile('bide');
						return false;
					}
					const target = this.getRandomTarget(pokemon, 'Pound');
					this.actions.moveHit(target, pokemon, currentMove, { damage: this.effectState.damage * 2 } as ActiveMove);
					pokemon.removeVolatile('bide');
					return false;
				}
				this.add('-activate', pokemon, 'Bide');
				return false;
			},
			onSemiLockMove: 'bide',
			onDisableMove(target) {
				target.maybeLocked = false; // the player knows it is locked
			},
		},
		type: "???", // Will look as Normal but it's STAB-less
		gen: 1,
	},
	bind: {
		inherit: true,
		ignoreImmunity: true,
		self: {
			volatileStatus: 'partialtrappinglock',
		},
		onTryMove(source, target) {
			if (target.volatiles['mustrecharge']) {
				target.removeVolatile('mustrecharge');
				this.hint("In Gen 1, partial trapping moves negate the recharge turn of Hyper Beam, even if they miss.", true);
			}
		},
		gen: 1,
	},
	bite: {
		inherit: true,
		category: "Physical",
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		type: "Normal",
		gen: 1,
	},
	blizzard: {
		inherit: true,
		accuracy: 90,
		target: "normal",
		gen: 1,
	},
	bravebird: {
		num: 413,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Brave Bird",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		recoil: [33, 100],
		target: "any",
		type: "Flying",
		contestType: "Cool",
		gen: 1,
	},
	brickbreak: {
		num: 280,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Brick Break",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
			pokemon.side.removeSideCondition('auroraveil');
		},
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
		gen: 1,
	},
	bubble: {
		inherit: true,
		secondary: {
			chance: 33,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		gen: 1,
	},
	bubblebeam: {
		inherit: true,
		secondary: {
			chance: 33,
			boosts: {
				spe: -1,
			},
		},
		gen: 1,
	},
	bugbuzz: {
		num: 405,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Bug Buzz",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Bug",
		contestType: "Beautiful",
		gen: 1,
	},
	clamp: {
		inherit: true,
		accuracy: 75,
		pp: 10,
		self: {
			volatileStatus: 'partialtrappinglock',
		},
		onTryMove(source, target) {
			if (target.volatiles['mustrecharge']) {
				target.removeVolatile('mustrecharge');
				this.hint("In Gen 1, partial trapping moves negate the recharge turn of Hyper Beam, even if they miss.", true);
			}
		},
		gen: 1,
	},
	constrict: {
		inherit: true,
		secondary: {
			chance: 33,
			boosts: {
				spe: -1,
			},
		},
		gen: 1,
	},
	conversion: {
		inherit: true,
		target: "normal",
		onHit(target, source) {
			source.setType(target.getTypes(true));
			this.add('-start', source, 'typechange', source.types.join('/'), '[from] move: Conversion', `[of] ${target}`);
		},
		gen: 1,
	},
	counter: {
		inherit: true,
		ignoreImmunity: true,
		willCrit: false,
		basePower: 1,
		damageCallback(pokemon, target) {
			// Counter mechanics in gen 1:
			// - a move is Counterable if it is Normal or Fighting type, has nonzero Base Power, and is not Counter
			// - if Counter is used by the player, it will succeed if the opponent's last used move is Counterable
			// - if Counter is used by the opponent, it will succeed if the player's last selected move is Counterable
			// - (Counter will thus desync if the target's last used move is not as counterable as the target's last selected move)
			// - if Counter succeeds it will deal twice the last move damage dealt in battle (even if it's from a different pokemon because of a switch)
			const isCounterable = (move: Move | null) => move && move.basePower > 0 &&
				['Normal', 'Fighting'].includes(move.type) && move.id !== 'counter';

			const lastMove = target.side.lastMove && this.dex.moves.get(target.side.lastMove.id);
			const lastMoveIsCounterable = isCounterable(lastMove);

			const lastSelectedMove = target.side.lastSelectedMove && this.dex.moves.get(target.side.lastSelectedMove);
			const lastSelectedMoveIsCounterable = isCounterable(lastSelectedMove || null);

			if (!lastMoveIsCounterable && !lastSelectedMoveIsCounterable) {
				this.debug("Gen 1 Counter: last move was not Counterable");
				this.add('-fail', pokemon);
				return false;
			}
			if (this.lastDamage <= 0) {
				this.debug("Gen 1 Counter: no previous damage exists");
				this.add('-fail', pokemon);
				return false;
			}
			if (!lastMoveIsCounterable || !lastSelectedMoveIsCounterable) {
				this.hint("Desync Clause Mod activated!");
				this.add('-fail', pokemon);
				return false;
			}

			return 2 * this.lastDamage;
		},
		flags: { contact: 1, protect: 1, metronome: 1 },
		gen: 1,
	},
	crabhammer: {
		inherit: true,
		critRatio: 2,
		gen: 1,
	},
	crunch: {
		num: 242,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Crunch",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondary: {
			chance: 20,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Normal",
		contestType: "Tough",
		gen: 1,
	},
	darkpulse: {
		num: 399,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Dark Pulse",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, pulse: 1 },
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "any",
		type: "Normal",
		contestType: "Cool",
		gen: 1,
	},
	dazzlinggleam: {
		num: 605,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Dazzling Gleam",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Beautiful",
		gen: 1,
	},
	defog: {
		num: 432,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Defog",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({ evasion: -1 });
			const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			const removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', ...removeAll];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', `[of] ${source}`);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', `[of] ${source}`);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
		target: "normal",
		type: "Flying",
		zMove: { boost: { accuracy: 1 } },
		contestType: "Cool",
		gen: 1,
	},
	dig: {
		inherit: true,
		basePower: 100,
		condition: {},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile('twoturnmove')) {
				attacker.removeVolatile('invulnerability');
				return;
			}
			this.add('-prepare', attacker, move.name);
			attacker.addVolatile('twoturnmove', defender);
			attacker.addVolatile('invulnerability', defender);
			return null;
		},
		gen: 1,
	},
	disable: {
		inherit: true,
		onTryHit(target) {
			return target.moveSlots.some(ms => ms.pp > 0);
		},
		condition: {
			inherit: true,
			durationCallback: undefined, // no inherit
			onStart(pokemon) {
				// disable can only select moves that have pp > 0, hence the onTryHit modification
				const [slotIndex, moveSlot] = this.sample(Array.from(pokemon.moveSlots.entries()).filter(([i, ms]) => ms.pp > 0));
				this.debug(`Disable: disabling move ${moveSlot.move} in slot ${slotIndex}`);
				this.add('-start', pokemon, 'Disable', moveSlot.move);
				this.effectState.move = moveSlot.id;
				this.effectState.slotIndex = slotIndex;
				// 1-8 turns (which will in effect translate to 0-7 missed turns for the target)
				this.effectState.time = this.random(1, 9);
			},
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				pokemon.volatiles['disable'].time--;
				if (!pokemon.volatiles['disable'].time) {
					pokemon.removeVolatile('disable');
					return;
				}
				if (pokemon.volatiles['bide']) move = this.dex.getActiveMove('bide');
				if (move.id === this.effectState.move) {
					this.add('cant', pokemon, 'Disable', move);
					pokemon.removeVolatile('twoturnmove');
					return false;
				}
			},
			onDisableMove(pokemon) {
				// disable the move slot
				if (pokemon.moveSlots.length > this.effectState.slotIndex) {
					pokemon.moveSlots[this.effectState.slotIndex].disabled = true;
					pokemon.moveSlots[this.effectState.slotIndex].disabledSource = this.effect.name;
				}
			},
		},
		gen: 1,
	},
	discharge: {
		num: 435,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Discharge",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "allAdjacent",
		type: "Electric",
		contestType: "Beautiful",
		gen: 1,
	},
	dizzypunch: {
		inherit: true,
		secondary: undefined, // no inherit
		gen: 1,
	},
	doubleedge: {
		inherit: true,
		basePower: 100,
		gen: 1,
	},
	dragondance: {
		num: 349,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Dragon Dance",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, dance: 1, metronome: 1 },
		boosts: {
			atk: 1,
			spe: 1,
		},
		target: "self",
		type: "Dragon",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cool",
		gen: 1,
	},
	dragonpulse: {
		num: 406,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Dragon Pulse",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, pulse: 1 },
		target: "any",
		type: "Dragon",
		contestType: "Beautiful",
		gen: 1,
	},
	dragonrage: {
		inherit: true,
		basePower: 1,
		gen: 1,
	},
	dragontail: {
		num: 525,
		accuracy: 90,
		basePower: 60,
		category: "Physical",
		name: "Dragon Tail",
		pp: 10,
		priority: -6,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, noassist: 1, failcopycat: 1 },
		forceSwitch: true,
		target: "normal",
		type: "Dragon",
		contestType: "Tough",
		gen: 1,
	},
	energyball: {
		num: 412,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Energy Ball",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
		gen: 1,
	},
	explosion: {
		inherit: true,
		basePower: 170,
		target: "normal",
		gen: 1,
	},
	fireblast: {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'brn',
		},
		gen: 1,
	},
	firespin: {
		inherit: true,
		accuracy: 70,
		basePower: 15,
		self: {
			volatileStatus: 'partialtrappinglock',
		},
		onTryMove(source, target) {
			if (target.volatiles['mustrecharge']) {
				target.removeVolatile('mustrecharge');
				this.hint("In Gen 1, partial trapping moves negate the recharge turn of Hyper Beam, even if they miss.", true);
			}
		},
		gen: 1,
	},
	flashcannon: {
		num: 430,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Flash Cannon",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Rock",
		contestType: "Beautiful",
		gen: 1,
	},
	flipturn: {
		num: 812,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Flip Turn",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		selfSwitch: true,
		target: "normal",
		type: "Water",
		gen: 1,
	},
	fly: {
		inherit: true,
		condition: {},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile('twoturnmove')) {
				attacker.removeVolatile('invulnerability');
				return;
			}
			this.add('-prepare', attacker, move.name);
			attacker.addVolatile('twoturnmove', defender);
			attacker.addVolatile('invulnerability', defender);
			return null;
		},
		gen: 1,
	},
	focusenergy: {
		inherit: true,
		condition: {
			inherit: true,
			// This does nothing as it's dealt with on critical hit calculation.
			onModifyCritRatio: undefined, // no inherit
		},
		gen: 1,
	},
	gigadrain: {
		num: 202,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		name: "Giga Drain",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		target: "normal",
		type: "Grass",
		contestType: "Clever",
		gen: 1,
	},
	glare: {
		inherit: true,
		ignoreImmunity: true,
		gen: 1,
	},
	growth: {
		inherit: true,
		boosts: {
			spa: 1,
			spd: 1,
		},
		gen: 1,
	},
	gunkshot: {
		num: 441,
		accuracy: 80,
		basePower: 105,
		category: "Physical",
		name: "Gunk Shot",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
		gen: 1,
	},
	gust: {
		inherit: true,
		type: "Normal",
		gen: 1,
	},
	haze: {
		inherit: true,
		onHit(target, source) {
			this.add('-activate', target, 'move: Haze');
			this.add('-clearallboost', '[silent]');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
				if (pokemon !== source) {
					if (['frz', 'slp'].includes(pokemon.status)) {
						pokemon.side.lastSelectedMove = 'cannotmove' as ID;
						if (this.queue.willMove(pokemon)) {
							this.queue.changeAction(pokemon, { choice: 'move', pokemon, moveid: 'cannotmove' });
						}
					}
					pokemon.cureStatus(true);
				}
				if (pokemon.status === 'tox') {
					pokemon.setStatus('psn', null, null, true);
				}
				pokemon.updateSpeed();
				// should only clear a specific set of volatiles
				// while technically the toxic counter shouldn't be cleared, the preserved toxic counter is never used again
				// in-game, so it is equivalent to just clear it.
				const silentHack = '|[silent]';
				const silentHackVolatiles = ['disable', 'confusion'];
				const hazeVolatiles: { [key: string]: string } = {
					'disable': '',
					'confusion': '',
					'mist': 'Mist',
					'focusenergy': 'move: Focus Energy',
					'leechseed': 'move: Leech Seed',
					'lightscreen': 'Light Screen',
					'reflect': 'Reflect',
					'residualdmg': 'Toxic counter',
				};
				for (const v in hazeVolatiles) {
					if (!pokemon.removeVolatile(v)) {
						continue;
					}
					if (silentHackVolatiles.includes(v)) {
						// these volatiles have their own onEnd method that prints, so to avoid
						// double printing and ensure they are still silent, we need to tack on a
						// silent attribute at the end
						this.log[this.log.length - 1] += silentHack;
					} else {
						this.add('-end', pokemon, hazeVolatiles[v], '[silent]');
					}
				}
			}
		},
		target: "self",
		gen: 1,
	},
	healbell: {
		num: 215,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Heal Bell",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, sound: 1, distance: 1, bypasssub: 1, metronome: 1 },
		onHit(target, source) {
			this.add('-activate', source, 'move: Heal Bell');
			let success = false;
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally !== source && !this.suppressingAbility(ally)) {
					if (ally.hasAbility('soundproof')) {
						this.add('-immune', ally, '[from] ability: Soundproof');
						continue;
					}
					if (ally.hasAbility('goodasgold')) {
						this.add('-immune', ally, '[from] ability: Good as Gold');
						continue;
					}
				}
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
		target: "allyTeam",
		type: "Normal",
		zMove: { effect: 'heal' },
		contestType: "Beautiful",
		gen: 1,
	},
	heatwave: {
		num: 257,
		accuracy: 90,
		basePower: 100,
		category: "Special",
		name: "Heat Wave",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "allAdjacentFoes",
		type: "Fire",
		contestType: "Beautiful",
		gen: 1,
	},
	highjumpkick: {
		inherit: true,
		onMoveFail(target, source, move) {
			this.directDamage(1, source, target);
		},
		gen: 1,
	},
	hurricane: {
		num: 542,
		accuracy: 70,
		basePower: 105,
		category: "Special",
		name: "Hurricane",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, wind: 1 },
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
			case 'raindance':
			case 'primordialsea':
				move.accuracy = true;
				break;
			case 'sunnyday':
			case 'desolateland':
				move.accuracy = 50;
				break;
			}
		},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		target: "any",
		type: "Flying",
		contestType: "Tough",
		gen: 1,
	},
	hypervoice: {
		num: 304,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Hyper Voice",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Cool",
		gen: 1,
	},
	iceshard: {
		num: 420,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Ice Shard",
		pp: 30,
		priority: 1,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
		gen: 1,
	},
	ironhead: {
		num: 442,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Iron Head",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Rock",
		contestType: "Tough",
		gen: 1,
	},
	jumpkick: {
		inherit: true,
		onMoveFail(target, source, move) {
			this.directDamage(1, source, target);
		},
		gen: 1,
	},
	karatechop: {
		inherit: true,
		critRatio: 2,
		type: "Normal",
		gen: 1,
	},
	leechseed: {
		inherit: true,
		onHit: undefined, // no inherit
		condition: {
			inherit: true,
			onAfterMoveSelfPriority: 1,
			onAfterMoveSelf(pokemon) {
				const leecher = this.getAtSlot(pokemon.volatiles['leechseed'].sourceSlot);
				if (!leecher || leecher.fainted || leecher.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				// We check if leeched Pokémon has Toxic to increase leeched damage.
				let toxicCounter = 1;
				const residualdmg = pokemon.volatiles['residualdmg'];
				if (residualdmg) {
					residualdmg.counter++;
					toxicCounter = residualdmg.counter;
				}
				const toLeech = this.clampIntRange(Math.floor(pokemon.baseMaxhp / 16), 1) * toxicCounter;
				const damage = this.damage(toLeech, pokemon, leecher);
				if (residualdmg) this.hint("In Gen 1, Leech Seed's damage is affected by Toxic's counter.", true);
				if (!damage || toLeech > damage) {
					this.hint("In Gen 1, Leech Seed recovery is not limited by the remaining HP of the seeded Pokemon.", true);
				}
				this.heal(toLeech, leecher, pokemon);
			},
		},
		gen: 1,
	},
	lightscreen: {
		inherit: true,
		volatileStatus: 'lightscreen',
		sideCondition: undefined, // no inherit
		onTryHit(pokemon) {
			if (pokemon.volatiles['lightscreen']) {
				return false;
			}
		},
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Light Screen');
			},
		},
		target: "self",
		gen: 1,
	},
	megahorn: {
		num: 224,
		accuracy: 85,
		basePower: 105,
		category: "Physical",
		name: "Megahorn",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		target: "normal",
		type: "Bug",
		contestType: "Cool",
		gen: 1,
	},
	metronome: {
		inherit: true,
		onHit(pokemon) {
			const moves = this.dex.moves.all().filter(move => (
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable') && move.flags['metronome']
			));
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
			}
			if (!randomMove) return false;
			pokemon.side.lastSelectedMove = this.toID(randomMove);
			this.actions.useMove(randomMove, pokemon);
		},
		gen: 1,
	},
	mimic: {
		inherit: true,
		flags: { protect: 1, bypasssub: 1, metronome: 1 },
		onHit(target, source) {
			const moveslot = source.side.lastSelectedMoveSlot;
			const moves = target.moves;
			const moveid = this.sample(moves);
			if (!moveid) return false;
			const move = this.dex.moves.get(moveid);
			source.moveSlots[moveslot] = {
				move: move.name,
				id: move.id,
				pp: source.moveSlots[moveslot].pp,
				maxpp: this.calculatePP(move, source.ppUps[moveslot] || 0),
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			this.add('-start', source, 'Mimic', move.name);
		},
		gen: 1,
	},
	minimize: {
		inherit: true,
		condition: {
			inherit: true,
			onSourceModifyDamage: undefined, // no inherit
		},
		gen: 1,
	},
	mirrormove: {
		inherit: true,
		onHit(pokemon) {
			const foe = pokemon.side.foe.active[0];
			if (!foe?.lastMove || foe.lastMove.id === 'mirrormove') {
				return false;
			}
			pokemon.side.lastSelectedMove = foe.lastMove.id;
			this.actions.useMove(foe.lastMove.id, pokemon);
		},
		gen: 1,
	},
	mist: {
		inherit: true,
		condition: {
			inherit: true,
			onTryBoost(boost, target, source, effect) {
				if (effect.effectType === 'Move' && effect.category !== 'Status') return;
				if (source && target !== source) {
					let showMsg = false;
					let i: BoostID;
					for (i in boost) {
						if (boost[i]! < 0) {
							delete boost[i];
							showMsg = true;
						}
					}
					if (showMsg && !(effect as ActiveMove).secondaries) {
						this.add('-activate', target, 'move: Mist');
					}
				}
			},
		},
		gen: 1,
	},
	nightshade: {
		inherit: true,
		ignoreImmunity: true,
		basePower: 1,
		gen: 1,
	},
	nightslash: {
		num: 400,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Night Slash",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		critRatio: 2,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
		gen: 1,
	},
	petaldance: {
		inherit: true,
		onMoveFail: undefined, // no inherit
		gen: 1,
	},
	playrough: {
		num: 583,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		name: "Play Rough",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Normal",
		contestType: "Cute",
		gen: 1,
	},
	poisonjab: {
		num: 398,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Poison Jab",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
		gen: 1,
	},
	poisonsting: {
		inherit: true,
		secondary: {
			chance: 20,
			status: 'psn',
		},
		gen: 1,
	},
	powerwhip: {
		num: 438,
		accuracy: 85,
		basePower: 100,
		category: "Physical",
		name: "Power Whip",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		target: "normal",
		type: "Grass",
		contestType: "Tough",
		gen: 1,
	},
	psychic: {
		inherit: true,
		secondary: {
			chance: 33,
			boosts: {
				spa: -1,
				spd: -1,
			},
		},
		gen: 1,
	},
	psychicnoise: {
		num: 917,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Psychic Noise",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: {
			chance: 100,
			volatileStatus: 'healblock',
		},
		target: "normal",
		type: "Psychic",
		gen: 1,
	},
	psyshock: {
		num: 473,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		overrideDefensiveStat: 'def',
		name: "Psyshock",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		target: "normal",
		type: "Psychic",
		contestType: "Beautiful",
		gen: 1,
	},
	psywave: {
		inherit: true,
		basePower: 1,
		damageCallback(pokemon) {
			if ([0, 1, 171].includes(pokemon.level)) {
				this.hint("Desync Clause Mod activated!");
				this.hint("In Gen 1, if a Pokémon at level 0, 1 or 171 uses Psywave, the game softlocks.");
				return false;
			}
			const psywaveDamage = (this.random(0, this.trunc(1.5 * pokemon.level)));
			if (psywaveDamage <= 0) {
				this.hint("Desync Clause Mod activated!");
				this.hint("In Gen 1, Psywave can roll 0 damage.");
				return false;
			}
			return psywaveDamage;
		},
		gen: 1,
	},
	pursuit: {
		num: 228,
		accuracy: 100,
		basePower: 40,
		basePowerCallback(pokemon, target, move) {
			// You can't get here unless the pursuit succeeds
			if (target.beingCalledBack || target.switchFlag) {
				this.debug('Pursuit damage boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		isNonstandard: "Past",
		name: "Pursuit",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		beforeTurnCallback(pokemon) {
			for (const target of pokemon.foes()) {
				target.addVolatile('pursuit');
				const data = target.volatiles['pursuit'];
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onModifyMove(move, source, target) {
			if (target?.beingCalledBack || target?.switchFlag) move.accuracy = true;
		},
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Pursuit start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectState.sources) {
					if (!source.isAdjacent(pokemon) || !this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Pursuit');
						alreadyAdded = true;
					}
					// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (source.canMegaEvo || source.canUltraBurst || source.canTerastallize) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source) {
								if (action.choice === 'megaEvo') {
									this.actions.runMegaEvo(source);
								} else if (action.choice === 'terastallize') {
									// Also a "forme" change that happens before moves, though only possible in NatDex
									this.actions.terastallize(source);
								} else {
									continue;
								}
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.actions.runMove('pursuit', source, source.getLocOf(pokemon));
				}
			},
		},
		target: "normal",
		type: "Normal",
		contestType: "Clever",
		gen: 1,
	},
	rage: {
		inherit: true,
		self: {
			volatileStatus: 'rage',
		},
		condition: {
			// Rage lock
			onStart(target, source, effect) {
				this.effectState.move = 'rage';
				this.effectState.accuracy = 255;
			},
			onLockMove: 'rage',
			onHit(target, source, move) {
				// Disable and exploding moves boost Rage even if they miss/fail, so they are dealt with separately.
				if (target.boosts.atk < 6 && (move.category !== 'Status' && !move.selfdestruct)) {
					this.boost({ atk: 1 });
				}
			},
		},
		gen: 1,
	},
	rapidspin: {
		num: 229,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Rapid Spin",
		pp: 40,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		// The Gen 1 engine never fires onAfterHit/onAfterSubDamage; it fires
		// AfterMoveSecondarySelf (scripts.ts) on the move's user after a hit
		// connects, so the spin-away cleanup has to live here instead.
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!pokemon.hp) return;
			if (pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', `[of] ${pokemon}`);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock'];
			for (const condition of sideConditions) {
				if (pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', `[of] ${pokemon}`);
				}
			}
			if (pokemon.volatiles['partiallytrapped']) {
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
		gen: 1,
	},
	razorleaf: {
		inherit: true,
		critRatio: 2,
		target: "normal",
		gen: 1,
	},
	razorwind: {
		inherit: true,
		critRatio: 1,
		target: "normal",
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile('twoturnmove')) {
				attacker.removeVolatile('invulnerability');
				return;
			}
			this.add('-prepare', attacker, move.name);
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		gen: 1,
	},
	recover: {
		inherit: true,
		heal: undefined, // no inherit
		onHit(target) {
			if (target.hp === target.maxhp) return false;
			// Fail when health is 255 or 511 less than max, unless it is divisible by 256
			if (
				target.hp === target.maxhp ||
				((target.hp === (target.maxhp - 255) || target.hp === (target.maxhp - 511)) && target.hp % 256 !== 0)
			) {
				this.hint(
					"In Gen 1, recovery moves fail if (user's maximum HP - user's current HP + 1) is divisible by 256, " +
					"unless the current hp is also divisible by 256."
				);
				return false;
			}
			this.heal(Math.floor(target.maxhp / 2), target, target);
		},
		gen: 1,
	},
	reflect: {
		inherit: true,
		volatileStatus: 'reflect',
		sideCondition: undefined, // no inherit
		onTryHit(pokemon) {
			if (pokemon.volatiles['reflect']) {
				return false;
			}
		},
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Reflect');
			},
		},
		target: "self",
		gen: 1,
	},
	rest: {
		inherit: true,
		onTry: undefined, // no inherit
		onHit(target, source, move) {
			if (target.hp === target.maxhp) return false;
			// Fail when health is 255 or 511 less than max, unless it is divisible by 256
			if (
				target.hp === target.maxhp ||
				((target.hp === (target.maxhp - 255) || target.hp === (target.maxhp - 511)) && target.hp % 256 !== 0)
			) {
				this.hint(
					"In Gen 1, recovery moves fail if (user's maximum HP - user's current HP + 1) is divisible by 256, " +
					"unless the current hp is also divisible by 256."
				);
				return false;
			}
			if (!target.setStatus('slp', source, move)) return false;
			target.statusState.time = 2;
			target.statusState.startTime = 2;
			this.heal(target.maxhp); // Aesthetic only as the healing happens after you fall asleep in-game
		},
		gen: 1,
	},
	rockthrow: {
		inherit: true,
		accuracy: 65,
		gen: 1,
	},
	roost: {
		num: 355,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Roost",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		heal: [1, 2],
		self: {
			volatileStatus: 'roost',
		},
		condition: {
			duration: 1,
			onResidualOrder: 25,
			onStart(target) {
				if (target.terastallized) {
					if (target.hasType('Flying')) {
						this.add('-hint', "If a Terastallized Pokemon uses Roost, it remains Flying-type.");
					}
					return false;
				}
				this.add('-singleturn', target, 'move: Roost');
			},
			onTypePriority: -1,
			onType(types, pokemon) {
				this.effectState.typeWas = types;
				return types.filter(type => type !== 'Flying');
			},
		},
		target: "self",
		type: "Flying",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
		gen: 1,
	},
	sandattack: {
		inherit: true,
		ignoreImmunity: true,
		type: "Normal",
		gen: 1,
	},
	seismictoss: {
		inherit: true,
		ignoreImmunity: true,
		basePower: 1,
		gen: 1,
	},
	selfdestruct: {
		inherit: true,
		basePower: 130,
		target: "normal",
		gen: 1,
	},
	shadowball: {
		num: 247,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Shadow Ball",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 20,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
		gen: 1,
	},
	shadowclaw: {
		num: 421,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Shadow Claw",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
		gen: 1,
	},
	shadowsneak: {
		num: 425,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Shadow Sneak",
		pp: 30,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
		gen: 1,
	},
	skullbash: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile('twoturnmove')) {
				attacker.removeVolatile('invulnerability');
				return;
			}
			this.add('-prepare', attacker, move.name);
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		gen: 1,
	},
	skyattack: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile('twoturnmove')) {
				attacker.removeVolatile('invulnerability');
				return;
			}
			this.add('-prepare', attacker, move.name);
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		gen: 1,
	},
	slash: {
		inherit: true,
		critRatio: 2,
		gen: 1,
	},
	sludge: {
		inherit: true,
		secondary: {
			chance: 40,
			status: 'psn',
		},
		gen: 1,
	},
	sludgebomb: {
		num: 188,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Sludge Bomb",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
		gen: 1,
	},
	softboiled: {
		inherit: true,
		heal: undefined, // no inherit
		onHit(target) {
			if (target.hp === target.maxhp) return false;
			// Fail when health is 255 or 511 less than max, unless it is divisible by 256
			if (
				target.hp === target.maxhp ||
				((target.hp === (target.maxhp - 255) || target.hp === (target.maxhp - 511)) && target.hp % 256 !== 0)
			) {
				this.hint(
					"In Gen 1, recovery moves fail if (user's maximum HP - user's current HP + 1) is divisible by 256, " +
					"unless the current hp is also divisible by 256."
				);
				return false;
			}
			this.heal(Math.floor(target.maxhp / 2), target, target);
		},
		gen: 1,
	},
	solarbeam: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile('twoturnmove')) {
				attacker.removeVolatile('invulnerability');
				return;
			}
			this.add('-prepare', attacker, move.name);
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		gen: 1,
	},
	sonicboom: {
		inherit: true,
		ignoreImmunity: true,
		basePower: 1,
		gen: 1,
	},
	spikes: {
		num: 191,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Spikes",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, nonsky: 1, metronome: 1, mustpressure: 1 },
		sideCondition: 'spikes',
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
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
			},
		},
		target: "foeSide",
		type: "Ground",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
		gen: 1,
	},
	stealthrock: {
		num: 446,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Stealth Rock",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, metronome: 1, mustpressure: 1 },
		sideCondition: 'stealthrock',
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasItem('heavydutyboots')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				this.damage(pokemon.maxhp * (2 ** typeMod) / 8);
			},
		},
		target: "foeSide",
		type: "Rock",
		zMove: { boost: { def: 1 } },
		contestType: "Cool",
		gen: 1,
	},
	stoneedge: {
		num: 444,
		accuracy: 80,
		basePower: 85,
		category: "Physical",
		name: "Stone Edge",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
		gen: 1,
	},
	struggle: {
		inherit: true,
		pp: 10,
		recoil: [1, 2],
		onModifyMove: undefined, // no inherit
		gen: 1,
	},
	substitute: {
		inherit: true,
		onTryHit(target) {
			if (target.volatiles['substitute']) {
				this.add('-fail', target, 'move: Substitute');
				return null;
			}
			// We only prevent when hp is less than one quarter.
			// If you use substitute at exactly one quarter, you faint.
			if (target.hp < target.maxhp / 4) {
				this.add('-fail', target, 'move: Substitute', '[weak]');
				return null;
			}
		},
		onHit(target) {
			// If max HP is 3 or less substitute makes no damage
			if (target.maxhp > 3) {
				this.directDamage(target.maxhp / 4, target, target);
			}
		},
		condition: {
			inherit: true,
			onStart(target) {
				this.add('-start', target, 'Substitute');
				this.effectState.hp = Math.floor(target.maxhp / 4) + 1;
				if (target.volatiles['partiallytrapped']) {
					this.add('-end', target, target.volatiles['partiallytrapped'].sourceEffect, '[partiallytrapped]', '[silent]');
					delete target.volatiles['partiallytrapped'];
				}
			},
			onTryPrimaryHit: undefined, // no inherit
			onTryHitPriority: -1,
			onTryHit(target, source, move) {
				if (move.category === 'Status') {
					// In gen 1 it only blocks:
					// poison, confusion, secondary effect confusion, stat reducing moves and Leech Seed.
					const SubBlocked = ['lockon', 'meanlook', 'mindreader', 'nightmare'];
					if (
						move.status === 'psn' || move.status === 'tox' || (move.boosts && target !== source) ||
						move.volatileStatus === 'confusion' || SubBlocked.includes(move.id)
					) {
						return false;
					}
					return;
				}
				if (move.volatileStatus && target === source) return;
				// NOTE: In future generations the damage is capped to the remaining HP of the
				// Substitute, here we deliberately use the uncapped damage when tracking lastDamage etc.
				// Also, multi-hit moves must always deal the same damage as the first hit for any subsequent hits
				let uncappedDamage = move.hit > 1 ? this.lastDamage : this.actions.getDamage(source, target, move);
				if (move.id === 'bide') uncappedDamage = source.volatiles['bide'].damage * 2;
				if (!uncappedDamage && uncappedDamage !== 0) return null;
				this.lastDamage = uncappedDamage;
				target.volatiles['substitute'].hp -= uncappedDamage > target.volatiles['substitute'].hp ?
					target.volatiles['substitute'].hp : uncappedDamage;
				if (target.volatiles['substitute'].hp <= 0) {
					target.removeVolatile('substitute');
					target.subFainted = true;
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				// Drain/recoil/secondary effect confusion do not happen if the substitute breaks
				if (target.volatiles['substitute']) {
					if (move.recoil) {
						this.damage(this.clampIntRange(Math.floor(uncappedDamage * move.recoil[0] / move.recoil[1]), 1),
							source, target, 'recoil');
					}
					if (move.drain) {
						const amount = this.clampIntRange(Math.floor(uncappedDamage * move.drain[0] / move.drain[1]), 1);
						this.lastDamage = amount;
						this.heal(amount, source, target, 'drain');
					}
					if (move.secondary?.volatileStatus === 'confusion') {
						const secondary = move.secondary;
						if (secondary.chance === undefined || this.randomChance(Math.ceil(secondary.chance * 256 / 100) - 1, 256)) {
							target.addVolatile(move.secondary.volatileStatus, source, move);
							this.hint(
								"In Gen 1, moves that inflict confusion as a secondary effect can confuse targets with a Substitute, " +
								"as long as the move does not break the Substitute."
							);
						}
					}
				}
				this.runEvent('AfterSubDamage', target, source, move, uncappedDamage);
				// Add here counter damage
				const lastAttackedBy = target.getLastAttackedBy();
				if (!lastAttackedBy) {
					target.attackedBy.push({ source, move: move.id, damage: uncappedDamage, slot: source.getSlot(), thisTurn: true });
				} else {
					lastAttackedBy.move = move.id;
					lastAttackedBy.damage = uncappedDamage;
				}
				return 0;
			},
		},
		gen: 1,
	},
	superfang: {
		inherit: true,
		ignoreImmunity: true,
		basePower: 1,
		gen: 1,
	},
	synthesis: {
		num: 235,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Synthesis",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather(undefined, true)) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snowscape':
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
		target: "self",
		type: "Grass",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
		gen: 1,
	},
	taunt: {
		num: 269,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Taunt",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'taunt',
		condition: {
			duration: 2,
			onStart(target) {
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
				if (!(move.isZ && move.isZOrMaxPowered) && move.category === 'Status' && move.id !== 'mefirst') {
					this.add('cant', attacker, 'move: Taunt', move);
					return false;
				}
			},
		},
		target: "normal",
		type: "Normal",
		zMove: { boost: { atk: 1 } },
		contestType: "Clever",
		gen: 1,
	},
	thrash: {
		inherit: true,
		onMoveFail: undefined, // no inherit
		gen: 1,
	},
	throatchop: {
		num: 675,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Throat Chop",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		condition: {
			duration: 2,
			onStart(target) {
				this.add('-start', target, 'Throat Chop', '[silent]');
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['sound']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (!move.isZOrMaxPowered && move.flags['sound']) {
					this.add('cant', pokemon, 'move: Throat Chop');
					return false;
				}
			},
			onModifyMove(move, pokemon, target) {
				if (!move.isZOrMaxPowered && move.flags['sound']) {
					this.add('cant', pokemon, 'move: Throat Chop');
					return false;
				}
			},
			onResidualOrder: 22,
			onEnd(target) {
				this.add('-end', target, 'Throat Chop', '[silent]');
			},
		},
		secondary: {
			chance: 100,
			onHit(target) {
				target.addVolatile('throatchop');
			},
		},
		target: "normal",
		type: "Normal",
		contestType: "Clever",
		gen: 1,
	},
	thunder: {
		inherit: true,
		secondary: {
			chance: 10,
			status: 'par',
		},
		gen: 1,
	},
	toxicspikes: {
		num: 390,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Toxic Spikes",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, nonsky: 1, metronome: 1, mustpressure: 1 },
		sideCondition: 'toxicspikes',
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
				} else if (pokemon.hasType('Steel') || pokemon.hasItem('heavydutyboots')) {
					// do nothing
				} else if (this.effectState.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
			},
		},
		target: "foeSide",
		type: "Poison",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
		gen: 1,
	},
	triattack: {
		inherit: true,
		onHit: undefined, // no inherit
		secondary: undefined, // no inherit
		gen: 1,
	},
	uturn: {
		num: 369,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "U-turn",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		selfSwitch: true,
		target: "normal",
		type: "Bug",
		contestType: "Cute",
		gen: 1,
	},
	vacuumwave: {
		num: 410,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Vacuum Wave",
		pp: 30,
		priority: 1,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
		gen: 1,
	},
	voltswitch: {
		num: 521,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Volt Switch",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		selfSwitch: true,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
		gen: 1,
	},
	willowisp: {
		num: 261,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		name: "Will-O-Wisp",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'brn',
		target: "normal",
		type: "Fire",
		zMove: { boost: { atk: 1 } },
		contestType: "Beautiful",
		gen: 1,
	},
	wingattack: {
		inherit: true,
		basePower: 35,
		gen: 1,
	},
	wrap: {
		inherit: true,
		accuracy: 85,
		ignoreImmunity: true,
		self: {
			volatileStatus: 'partialtrappinglock',
		},
		onTryMove(source, target) {
			if (target.volatiles['mustrecharge']) {
				target.removeVolatile('mustrecharge');
				this.hint("In Gen 1, partial trapping moves negate the recharge turn of Hyper Beam, even if they miss.", true);
			}
		},
		gen: 1,
	},
	xscissor: {
		num: 404,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "X-Scissor",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		target: "normal",
		type: "Bug",
		contestType: "Cool",
		gen: 1,
	},
	leechlife: {
		inherit: true,
		basePower: 70,
		gen: 1,
	},
	teleport: {
		inherit: true,
		priority: -6,
		onTry(source) {
			return !!this.canSwitch(source.side);
		},
		selfSwitch: true,
		gen: 1,
	},
	toxic: {
		num: 92,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		name: "Toxic",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		// No Guard-like effect for Poison-type users implemented in Scripts#tryMoveHit
		status: 'tox',
		target: "normal",
		type: "Poison",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
		gen: 1,
	},
};
