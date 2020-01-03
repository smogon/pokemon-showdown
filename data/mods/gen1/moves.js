/**
 * A lot of Gen 1 moves have to be updated due to different mechanics.
 * Some moves have had major changes, such as Bite's typing.
 */

'use strict';

/**@type {{[k: string]: ModdedMoveData}} */
let BattleMovedex = {
	absorb: {
		inherit: true,
		desc: "The user recovers 1/2 the HP lost by the target, rounded down. If this move breaks the target's substitute, the user does not recover any HP.",
	},
	acid: {
		inherit: true,
		desc: "Has a 33% chance to lower the target's Defense by 1 stage.",
		shortDesc: "33% chance to lower the target's Defense by 1.",
		secondary: {
			chance: 33,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
	},
	amnesia: {
		inherit: true,
		desc: "Raises the user's Special by 2 stages.",
		shortDesc: "Raises the user's Special by 2.",
		boosts: {
			spd: 2,
			spa: 2,
		},
	},
	aurorabeam: {
		inherit: true,
		desc: "Has a 33% chance to lower the target's Attack by 1 stage.",
		shortDesc: "33% chance to lower the target's Attack by 1.",
		secondary: {
			chance: 33,
			boosts: {
				atk: -1,
			},
		},
	},
	barrage: {
		inherit: true,
		desc: "Hits two to five times. Has a 3/8 chance to hit two or three times, and a 1/8 chance to hit four or five times. Damage is calculated once for the first hit and used for every hit. If one of the hits breaks the target's substitute, the move ends.",
	},
	bide: {
		inherit: true,
		desc: "The user spends two or three turns locked into this move and then, on the second or third turn after using this move, the user attacks the opponent, inflicting double the damage in HP it lost during those turns. This move ignores type immunity and cannot be avoided even if the target is using Dig or Fly. The user can choose to switch out during the effect. If the user switches out or is prevented from moving during this move's use, the effect ends. During the effect, if the opposing Pokemon switches out or uses Confuse Ray, Conversion, Focus Energy, Glare, Haze, Leech Seed, Light Screen, Mimic, Mist, Poison Gas, Poison Powder, Recover, Reflect, Rest, Soft-Boiled, Splash, Stun Spore, Substitute, Supersonic, Teleport, Thunder Wave, Toxic, or Transform, the previous damage dealt to the user will be added to the total.",
		priority: 0,
		accuracy: true,
		ignoreEvasion: true,
		effect: {
			duration: 2,
			durationCallback(target, source, effect) {
				return this.random(3, 4);
			},
			onStart(pokemon) {
				this.effectData.totalDamage = 0;
				this.effectData.lastDamage = 0;
				this.add('-start', pokemon, 'Bide');
			},
			onHit(target, source, move) {
				if (source && source !== target && move.category !== 'Physical' && move.category !== 'Special') {
					let damage = this.effectData.totalDamage;
					this.effectData.totalDamage += damage;
					this.effectData.lastDamage = damage;
					this.effectData.sourcePosition = source.position;
					this.effectData.sourceSide = source.side;
				}
			},
			onDamage(damage, target, source, move) {
				if (!source || source.side === target.side) return;
				if (!move || move.effectType !== 'Move') return;
				if (!damage && this.effectData.lastDamage > 0) {
					damage = this.effectData.totalDamage;
				}
				this.effectData.totalDamage += damage;
				this.effectData.lastDamage = damage;
				this.effectData.sourcePosition = source.position;
				this.effectData.sourceSide = source.side;
			},
			onAfterSetStatus(status, pokemon) {
				// Sleep, freeze, and partial trap will just pause duration.
				if (pokemon.volatiles['flinch']) {
					this.effectData.duration++;
				} else if (pokemon.volatiles['partiallytrapped']) {
					this.effectData.duration++;
				} else {
					switch (status.id) {
					case 'slp':
					case 'frz':
						this.effectData.duration++;
						break;
					}
				}
			},
			onBeforeMove(pokemon, target, move) {
				if (this.effectData.duration === 1) {
					if (!this.effectData.totalDamage) {
						this.debug("Bide failed due to 0 damage taken");
						this.add('-fail', pokemon);
						return false;
					}
					this.add('-end', pokemon, 'Bide');
					let target = this.effectData.sourceSide.active[this.effectData.sourcePosition];
					this.moveHit(target, pokemon, move, /** @type {ActiveMove} */ ({damage: this.effectData.totalDamage * 2}));
					return false;
				}
				this.add('-activate', pokemon, 'Bide');
				return false;
			},
			onDisableMove(pokemon) {
				if (!pokemon.hasMove('bide')) {
					return;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id !== 'bide') {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
		type: "???", // Will look as Normal but it's STAB-less
	},
	bind: {
		inherit: true,
		desc: "The user spends two to five turns using this move. Has a 3/8 chance to last two or three turns, and a 1/8 chance to last four or five turns. The damage calculated for the first turn is used for every other turn. The user cannot select a move and the target cannot execute a move during the effect, but both may switch out. If the user switches out, the target remains unable to execute a move during that turn. If the target switches out, the user uses this move again automatically, and if it had 0 PP at the time, it becomes 63. If the user or the target switch out, or the user is prevented from moving, the effect ends. This move can prevent the target from moving even if it has type immunity, but will not deal damage.",
		shortDesc: "Prevents the target from moving for 2-5 turns.",
		ignoreImmunity: true,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock',
		},
		// FIXME: onBeforeMove(pokemon, target) {target.removeVolatile('mustrecharge')}
		onHit(target, source) {
			/**
			 * The duration of the partially trapped must be always renewed to 2
			 * so target doesn't move on trapper switch out as happens in gen 1.
			 * However, this won't happen if there's no switch and the trapper is
			 * about to end its partial trapping.
			 **/
			if (target.volatiles['partiallytrapped']) {
				if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
					target.volatiles['partiallytrapped'].duration = 2;
				}
			}
		},
	},
	bite: {
		inherit: true,
		desc: "Has a 10% chance to flinch the target.",
		shortDesc: "10% chance to flinch the target.",
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		type: "Normal",
	},
	blizzard: {
		inherit: true,
		accuracy: 90,
		target: "normal",
	},
	bonemerang: {
		inherit: true,
		desc: "Hits twice. If the first hit breaks the target's substitute, the move ends.",
	},
	bubble: {
		inherit: true,
		desc: "Has a 33% chance to lower the target's Speed by 1 stage.",
		shortDesc: "33% chance to lower the target's Speed by 1.",
		secondary: {
			chance: 33,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
	},
	bubblebeam: {
		inherit: true,
		desc: "Has a 33% chance to lower the target's Speed by 1 stage.",
		shortDesc: "33% chance to lower the target's Speed by 1.",
		secondary: {
			chance: 33,
			boosts: {
				spe: -1,
			},
		},
	},
	clamp: {
		inherit: true,
		desc: "The user spends two to five turns using this move. Has a 3/8 chance to last two or three turns, and a 1/8 chance to last four or five turns. The damage calculated for the first turn is used for every other turn. The user cannot select a move and the target cannot execute a move during the effect, but both may switch out. If the user switches out, the target remains unable to execute a move during that turn. If the target switches out, the user uses this move again automatically, and if it had 0 PP at the time, it becomes 63. If the user or the target switch out, or the user is prevented from moving, the effect ends. This move can prevent the target from moving even if it has type immunity, but will not deal damage.",
		shortDesc: "Prevents the target from moving for 2-5 turns.",
		accuracy: 75,
		pp: 10,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock',
		},
		// FIXME: onBeforeMove(pokemon, target) {target.removeVolatile('mustrecharge')}
		onHit(target, source) {
			/**
			 * The duration of the partially trapped must be always renewed to 2
			 * so target doesn't move on trapper switch out as happens in gen 1.
			 * However, this won't happen if there's no switch and the trapper is
			 * about to end its partial trapping.
			 **/
			if (target.volatiles['partiallytrapped']) {
				if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
					target.volatiles['partiallytrapped'].duration = 2;
				}
			}
		},
	},
	cometpunch: {
		inherit: true,
		desc: "Hits two to five times. Has a 3/8 chance to hit two or three times, and a 1/8 chance to hit four or five times. Damage is calculated once for the first hit and used for every hit. If one of the hits breaks the target's substitute, the move ends.",
	},
	constrict: {
		inherit: true,
		desc: "Has a 33% chance to lower the target's Speed by 1 stage.",
		shortDesc: "33% chance to lower the target's Speed by 1.",
		secondary: {
			chance: 33,
			boosts: {
				spe: -1,
			},
		},
	},
	conversion: {
		inherit: true,
		desc: "Causes the user's types to become the same as the current types of the target.",
		shortDesc: "User becomes the same type as the target.",
		volatileStatus: 'conversion',
		accuracy: true,
		target: "normal",
		onHit(target, source) {
			source.types = target.types;
			this.add('-start', source, 'typechange', source.types.join(', '), '[from] move: Conversion', '[of] ' + source);
		},
	},
	counter: {
		inherit: true,
		desc: "Deals damage to the opposing Pokemon equal to twice the damage dealt by the last move used in the battle. This move ignores type immunity. Fails if the user moves first, or if the opposing side's last move was Counter, had 0 power, or was not Normal or Fighting type. Fails if the last move used by either side did 0 damage and was not Confuse Ray, Conversion, Focus Energy, Glare, Haze, Leech Seed, Light Screen, Mimic, Mist, Poison Gas, Poison Powder, Recover, Reflect, Rest, Soft-Boiled, Splash, Stun Spore, Substitute, Supersonic, Teleport, Thunder Wave, Toxic, or Transform.",
		ignoreImmunity: true,
		willCrit: false,
		damageCallback(pokemon, target) {
			// Counter mechanics on gen 1 might be hard to understand.
			// It will fail if the last move selected by the opponent has base power 0 or is not Normal or Fighting Type.
			// If both are true, counter will deal twice the last damage dealt in battle, no matter what was the move.
			// That means that, if opponent switches, counter will use last counter damage * 2.
			let lastUsedMove = target.side.lastMove && this.dex.getMove(target.side.lastMove.id);
			if (lastUsedMove && lastUsedMove.basePower > 0 && ['Normal', 'Fighting'].includes(lastUsedMove.type) && this.lastDamage > 0 && !this.willMove(target)) {
				return 2 * this.lastDamage;
			}
			this.debug("Gen 1 Counter failed due to conditions not met");
			this.add('-fail', pokemon);
			return false;
		},
	},
	crabhammer: {
		inherit: true,
		critRatio: 2,
	},
	defensecurl: {
		inherit: true,
		desc: "Raises the user's Defense by 1 stage.",
	},
	dig: {
		inherit: true,
		desc: "This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Bide, Swift, and Transform. If the user is fully paralyzed on the second turn, it continues avoiding attacks until it switches out or successfully executes the second turn of this move or Fly.",
		basePower: 100,
		effect: {
			duration: 2,
			onLockMove: 'dig',
			onInvulnerability(target, source, move) {
				if (move.id === 'swift') return true;
				this.add('-message', 'The foe ' + target.name + ' can\'t be hit underground!');
				return false;
			},
			onDamage(damage, target, source, move) {
				if (!move || move.effectType !== 'Move') return;
				if (!source) return;
				if (move.id === 'earthquake') {
					this.add('-message', 'The foe ' + target.name + ' can\'t be hit underground!');
					return null;
				}
			},
		},
	},
	disable: {
		inherit: true,
		desc: "For 0 to 7 turns, one of the target's known moves that has at least 1 PP remaining becomes disabled, at random. Fails if one of the target's moves is already disabled, or if none of the target's moves have PP remaining. If any Pokemon uses Haze, this effect ends. Whether or not this move was successful, it counts as a hit for the purposes of the opponent's use of Rage.",
		shortDesc: "For 0-7 turns, disables one of the target's moves.",
		effect: {
			duration: 4,
			durationCallback(target, source, effect) {
				let duration = this.random(1, 7);
				return duration;
			},
			onStart(pokemon) {
				if (!this.willMove(pokemon)) {
					this.effectData.duration++;
				}
				let moves = pokemon.moves;
				let move = this.dex.getMove(this.sample(moves));
				this.add('-start', pokemon, 'Disable', move.name);
				this.effectData.move = move.id;
				return;
			},
			onResidualOrder: 14,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Disable');
			},
			onBeforeMove(attacker, defender, move) {
				if (move.id === this.effectData.move) {
					this.add('cant', attacker, 'Disable', move);
					return false;
				}
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === this.effectData.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
	},
	dizzypunch: {
		inherit: true,
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		secondary: null,
	},
	doubleedge: {
		inherit: true,
		desc: "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded down, but not less than 1 HP. If this move breaks the target's substitute, the user does not take any recoil damage.",
		basePower: 100,
	},
	doublekick: {
		inherit: true,
		desc: "Hits twice. Damage is calculated once for the first hit and used for both hits. If the first hit breaks the target's substitute, the move ends.",
	},
	doubleslap: {
		inherit: true,
		desc: "Hits two to five times. Has a 3/8 chance to hit two or three times, and a 1/8 chance to hit four or five times. Damage is calculated once for the first hit and used for every hit. If one of the hits breaks the target's substitute, the move ends.",
	},
	dragonrage: {
		inherit: true,
		basePower: 1,
	},
	dreameater: {
		inherit: true,
		desc: "The target is unaffected by this move unless it is asleep. The user recovers 1/2 the HP lost by the target, rounded down, but not less than 1 HP. If this move breaks the target's substitute, the user does not recover any HP.",
	},
	earthquake: {
		inherit: true,
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
	},
	explosion: {
		inherit: true,
		desc: "The user faints after using this move, unless this move broke the target's substitute. The target's Defense is halved during damage calculation.",
		basePower: 170,
		target: "normal",
	},
	fireblast: {
		inherit: true,
		desc: "Has a 30% chance to burn the target.",
		shortDesc: "30% chance to burn the target.",
		secondary: {
			chance: 30,
			status: 'brn',
		},
	},
	firespin: {
		inherit: true,
		desc: "The user spends two to five turns using this move. Has a 3/8 chance to last two or three turns, and a 1/8 chance to last four or five turns. The damage calculated for the first turn is used for every other turn. The user cannot select a move and the target cannot execute a move during the effect, but both may switch out. If the user switches out, the target remains unable to execute a move during that turn. If the target switches out, the user uses this move again automatically, and if it had 0 PP at the time, it becomes 63. If the user or the target switch out, or the user is prevented from moving, the effect ends. This move can prevent the target from moving even if it has type immunity, but will not deal damage.",
		shortDesc: "Prevents the target from moving for 2-5 turns.",
		accuracy: 70,
		basePower: 15,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock',
		},
		// FIXME: onBeforeMove(pokemon, target) {target.removeVolatile('mustrecharge')}
		onHit(target, source) {
			/**
			 * The duration of the partially trapped must be always renewed to 2
			 * so target doesn't move on trapper switch out as happens in gen 1.
			 * However, this won't happen if there's no switch and the trapper is
			 * about to end its partial trapping.
			 **/
			if (target.volatiles['partiallytrapped']) {
				if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
					target.volatiles['partiallytrapped'].duration = 2;
				}
			}
		},
	},
	fissure: {
		inherit: true,
		desc: "Deals 65535 damage to the target. Fails if the target's Speed is greater than the user's.",
		shortDesc: "Deals 65535 damage. Fails if target is faster.",
	},
	fly: {
		inherit: true,
		desc: "This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Bide, Swift, and Transform. If the user is fully paralyzed on the second turn, it continues avoiding attacks until it switches out or successfully executes the second turn of this move or Dig.",
		effect: {
			duration: 2,
			onLockMove: 'fly',
			onInvulnerability(target, source, move) {
				if (move.id === 'swift') return true;
				this.add('-message', 'The foe ' + target.name + ' can\'t be hit while flying!');
				return false;
			},
			onDamage(damage, target, source, move) {
				if (!move || move.effectType !== 'Move') return;
				if (!source || source.side === target.side) return;
				if (move.id === 'gust' || move.id === 'thunder') {
					this.add('-message', 'The foe ' + target.name + ' can\'t be hit while flying!');
					return null;
				}
			},
		},
	},
	focusenergy: {
		inherit: true,
		desc: "While the user remains active, its chance for a critical hit is quartered. Fails if the user already has the effect. If any Pokemon uses Haze, this effect ends.",
		shortDesc: "Quarters the user's chance for a critical hit.",
		effect: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Focus Energy');
			},
			// This does nothing as it's dealt with on critical hit calculation.
			onModifyMove() {},
		},
	},
	furyattack: {
		inherit: true,
		desc: "Hits two to five times. Has a 3/8 chance to hit two or three times, and a 1/8 chance to hit four or five times. Damage is calculated once for the first hit and used for every hit. If one of the hits breaks the target's substitute, the move ends.",
	},
	furyswipes: {
		inherit: true,
		desc: "Hits two to five times. Has a 3/8 chance to hit two or three times, and a 1/8 chance to hit four or five times. Damage is calculated once for the first hit and used for every hit. If one of the hits breaks the target's substitute, the move ends.",
	},
	glare: {
		inherit: true,
		desc: "Paralyzes the target.",
		ignoreImmunity: true,
	},
	growth: {
		inherit: true,
		desc: "Raises the user's Special by 1 stage.",
		shortDesc: "Raises the user's Special by 1.",
		boosts: {
			spa: 1,
			spd: 1,
		},
	},
	guillotine: {
		inherit: true,
		desc: "Deals 65535 damage to the target. Fails if the target's Speed is greater than the user's.",
		shortDesc: "Deals 65535 damage. Fails if target is faster.",
	},
	gust: {
		inherit: true,
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		type: "Normal",
	},
	haze: {
		inherit: true,
		desc: "Resets the stat stages of both Pokemon to 0 and removes stat reductions due to burn and paralysis. Resets Toxic counters to 0 and removes the effect of confusion, Disable, Focus Energy, Leech Seed, Light Screen, Mist, and Reflect from both Pokemon. Removes the opponent's major status condition.",
		shortDesc: "Resets all stat changes. Removes foe's status.",
		onHit(target, source) {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();

				if (pokemon !== source) {
					// Clears the status from the opponent
					pokemon.setStatus('');
				}
				if (pokemon.status === 'tox') {
					pokemon.setStatus('psn');
				}
				for (const id of Object.keys(pokemon.volatiles)) {
					if (id === 'residualdmg') {
						pokemon.volatiles[id].counter = 0;
					} else {
						pokemon.removeVolatile(id);
						this.add('-end', pokemon, id);
					}
				}
			}
		},
		target: "self",
	},
	highjumpkick: {
		inherit: true,
		desc: "If this attack misses the target, the user takes 1 HP of crash damage. If the user has a substitute, the crash damage is dealt to the target's substitute if it has one, otherwise no crash damage is dealt.",
		shortDesc: "User takes 1 HP of damage if it misses.",
		onMoveFail(target, source, move) {
			if (!target.types.includes('Ghost')) {
				this.directDamage(1, source, target);
			}
		},
	},
	horndrill: {
		inherit: true,
		desc: "Deals 65535 damage to the target. Fails if the target's Speed is greater than the user's.",
		shortDesc: "Deals 65535 damage. Fails if target is faster.",
	},
	hyperbeam: {
		inherit: true,
		desc: "If this move is successful, the user must recharge on the following turn and cannot select a move, unless the target or its substitute was knocked out by this move.",
		shortDesc: "Can't move next turn if target or sub is not KOed.",
	},
	jumpkick: {
		inherit: true,
		desc: "If this attack misses the target, the user takes 1 HP of crash damage. If the user has a substitute, the crash damage is dealt to the target's substitute if it has one, otherwise no crash damage is dealt.",
		shortDesc: "User takes 1 HP of damage if it misses.",
		onMoveFail(target, source, move) {
			if (!target.types.includes('Ghost')) {
				this.directDamage(1, source, target);
			}
		},
	},
	karatechop: {
		inherit: true,
		critRatio: 2,
		type: "Normal",
	},
	leechseed: {
		inherit: true,
		desc: "At the end of each of the target's turns, The Pokemon at the user's position steals 1/16 of the target's maximum HP, rounded down and multiplied by the target's current Toxic counter if it has one, even if the target currently has less than that amount of HP remaining. If the target switches out or any Pokemon uses Haze, this effect ends. Grass-type Pokemon are immune to this move.",
		onHit() {},
		effect: {
			onStart(target) {
				this.add('-start', target, 'move: Leech Seed');
			},
			onAfterMoveSelfPriority: 1,
			onAfterMoveSelf(pokemon) {
				let leecher = pokemon.side.foe.active[pokemon.volatiles['leechseed'].sourcePosition];
				if (!leecher || leecher.fainted || leecher.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				// We check if leeched Pokémon has Toxic to increase leeched damage.
				let toxicCounter = 1;
				let residualdmg = pokemon.volatiles['residualdmg'];
				if (residualdmg) {
					residualdmg.counter++;
					toxicCounter = residualdmg.counter;
				}
				let toLeech = this.dex.clampIntRange(Math.floor(pokemon.baseMaxhp / 16), 1) * toxicCounter;
				let damage = this.damage(toLeech, pokemon, leecher);
				if (residualdmg) this.hint("In Gen 1, Leech Seed's damage is affected by Toxic's counter.", true);
				if (!damage || toLeech > damage) {
					this.hint("In Gen 1, Leech Seed recovery is not limited by the remaining HP of the seeded Pokemon.", true);
				}
				this.heal(toLeech, leecher, pokemon);
			},
		},
	},
	lightscreen: {
		num: 113,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "While the user remains active, its Special is doubled when taking damage. Critical hits ignore this effect. If any Pokemon uses Haze, this effect ends.",
		shortDesc: "While active, user's Special is 2x when damaged.",
		id: "lightscreen",
		isViable: true,
		name: "Light Screen",
		pp: 30,
		priority: 0,
		flags: {},
		volatileStatus: 'lightscreen',
		onTryHit(pokemon) {
			if (pokemon.volatiles['lightscreen']) {
				return false;
			}
		},
		effect: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Light Screen');
			},
		},
		target: "self",
		type: "Psychic",
	},
	metronome: {
		inherit: true,
		desc: "A random move is selected for use, other than Metronome or Struggle.",
		noMetronome: ['metronome', 'struggle'],
		secondary: null,
		target: "self",
		type: "Normal",
	},
	mimic: {
		inherit: true,
		desc: "While the user remains active, this move is replaced by a random move known by the target, even if the user already knows that move. The copied move keeps the remaining PP for this move, regardless of the copied move's maximum PP. Whenever one PP is used for a copied move, one PP is used for this move.",
		shortDesc: "Random move known by the target replaces this.",
		onHit(target, source) {
			let moveslot = source.moves.indexOf('mimic');
			if (moveslot < 0) return false;
			let moves = target.moves;
			let moveid = this.sample(moves);
			if (!moveid) return false;
			let move = this.dex.getMove(moveid);
			source.moveSlots[moveslot] = {
				move: move.name,
				id: move.id,
				pp: source.moveSlots[moveslot].pp,
				maxpp: move.pp * 8 / 5,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			this.add('-start', source, 'Mimic', move.name);
		},
	},
	minimize: {
		inherit: true,
		desc: "Raises the user's evasiveness by 1 stage.",
	},
	mirrormove: {
		inherit: true,
		desc: "The user uses the last move used by the target. Fails if the target has not made a move, or if the last move used was Mirror Move.",
		onHit(pokemon) {
			let foe = pokemon.side.foe.active[0];
			if (!foe || !foe.lastMove || foe.lastMove.id === 'mirrormove') {
				return false;
			}
			this.useMove(foe.lastMove.id, pokemon);
		},
	},
	mist: {
		inherit: true,
		desc: "While the user remains active, it is protected from having its stat stages lowered by other Pokemon, unless caused by the secondary effect of a move. Fails if the user already has the effect. If any Pokemon uses Haze, this effect ends.",
	},
	nightshade: {
		inherit: true,
		desc: "Deals damage to the target equal to the user's level. This move ignores type immunity.",
		shortDesc: "Damage = user's level. Can hit Normal types.",
		ignoreImmunity: true,
		basePower: 1,
	},
	petaldance: {
		inherit: true,
		desc: "Whether or not this move is successful, the user spends three or four turns locked into this move and becomes confused immediately after its move on the last turn of the effect, even if it is already confused. If the user is prevented from moving, the effect ends without causing confusion. During the effect, this move's accuracy is overwritten every turn with the current calculated accuracy including stat stage changes, but not to less than 1/256 or more than 255/256.",
		shortDesc: "Lasts 3-4 turns. Confuses the user afterwards.",
	},
	pinmissile: {
		inherit: true,
		desc: "Hits two to five times. Has a 3/8 chance to hit two or three times, and a 1/8 chance to hit four or five times. Damage is calculated once for the first hit and used for every hit. If one of the hits breaks the target's substitute, the move ends.",
	},
	poisonsting: {
		inherit: true,
		desc: "Has a 20% chance to poison the target.",
		shortDesc: "20% chance to poison the target.",
		secondary: {
			chance: 20,
			status: 'psn',
		},
	},
	psychic: {
		inherit: true,
		desc: "Has a 33% chance to lower the target's Special by 1 stage.",
		shortDesc: "33% chance to lower the target's Special by 1.",
		secondary: {
			chance: 33,
			boosts: {
				spd: -1,
				spa: -1,
			},
		},
	},
	psywave: {
		inherit: true,
		basePower: 1,
	},
	rage: {
		inherit: true,
		desc: "Once this move is successfully used, the user automatically uses this move every turn and can no longer switch out. During the effect, the user's Attack is raised by 1 stage every time it is hit by the opposing Pokemon, and this move's accuracy is overwritten every turn with the current calculated accuracy including stat stage changes, but not to less than 1/256 or more than 255/256.",
		shortDesc: "Lasts forever. Raises user's Attack by 1 when hit.",
		self: {
			volatileStatus: 'rage',
		},
		effect: {
			// Rage lock
			duration: 255,
			onStart(target, source, effect) {
				this.effectData.move = 'rage';
			},
			onLockMove: 'rage',
			onTryHit(target, source, move) {
				if (target.boosts.atk < 6 && move.id === 'disable') {
					this.boost({atk: 1});
				}
			},
			onHit(target, source, move) {
				if (target.boosts.atk < 6 && move.category !== 'Status') {
					this.boost({atk: 1});
				}
			},
		},
	},
	razorleaf: {
		inherit: true,
		critRatio: 2,
		target: "normal",
	},
	razorwind: {
		inherit: true,
		desc: "This attack charges on the first turn and executes on the second.",
		shortDesc: "Charges turn 1. Hits turn 2.",
		critRatio: 1,
		target: "normal",
	},
	recover: {
		inherit: true,
		desc: "The user restores 1/2 of its maximum HP, rounded down. Fails if (user's maximum HP - user's current HP + 1) is divisible by 256.",
		heal: null,
		onHit(target) {
			// Fail when health is 255 or 511 less than max
			if (target.hp === (target.maxhp - 255) || target.hp === (target.maxhp - 511) || target.hp === target.maxhp) {
				this.hint("In Gen 1, recovery moves fail if (user's maximum HP - user's current HP + 1) is divisible by 256.");
				return false;
			}
			this.heal(Math.floor(target.maxhp / 2), target, target);
		},
	},
	reflect: {
		num: 115,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "While the user remains active, its Defense is doubled when taking damage. Critical hits ignore this protection. This effect can be removed by Haze.",
		shortDesc: "While active, the user's Defense is doubled.",
		id: "reflect",
		isViable: true,
		name: "Reflect",
		pp: 20,
		priority: 0,
		flags: {},
		volatileStatus: 'reflect',
		onTryHit(pokemon) {
			if (pokemon.volatiles['reflect']) {
				return false;
			}
		},
		effect: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Reflect');
			},
		},
		secondary: null,
		target: "self",
		type: "Psychic",
	},
	rest: {
		inherit: true,
		desc: "The user falls asleep for the next two turns and restores all of its HP, curing itself of any major status condition in the process. This does not remove the user's stat penalty for burn or paralysis. Fails if the user has full HP.",
		onTryMove() {},
		onHit(target, source, move) {
			// Fails if the difference between
			// max HP and current HP is 0, 255, or 511
			if (target.hp >= target.maxhp ||
			target.hp === (target.maxhp - 255) ||
			target.hp === (target.maxhp - 511)) return false;
			if (!target.setStatus('slp', source, move)) return false;
			target.statusData.time = 2;
			target.statusData.startTime = 2;
			this.heal(target.maxhp); // Aesthetic only as the healing happens after you fall asleep in-game
		},
	},
	roar: {
		inherit: true,
		desc: "No competitive use.",
		shortDesc: "No competitive use.",
		isViable: false,
		forceSwitch: false,
		onTryHit() {},
		priority: 0,
	},
	rockslide: {
		inherit: true,
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		secondary: null,
		target: "normal",
	},
	rockthrow: {
		inherit: true,
		accuracy: 65,
	},
	sandattack: {
		inherit: true,
		ignoreImmunity: true,
		type: "Normal",
	},
	seismictoss: {
		inherit: true,
		desc: "Deals damage to the target equal to the user's level. This move ignores type immunity.",
		shortDesc: "Damage = user's level. Can hit Ghost types.",
		ignoreImmunity: true,
		basePower: 1,
	},
	selfdestruct: {
		inherit: true,
		desc: "The user faints after using this move, unless the target's substitute was broken by the damage. The target's Defense is halved during damage calculation.",
		basePower: 130,
		target: "normal",
	},
	skullbash: {
		inherit: true,
		desc: "This attack charges on the first turn and executes on the second.",
		shortDesc: "Charges turn 1. Hits turn 2.",
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
	},
	slash: {
		inherit: true,
		critRatio: 2,
	},
	sludge: {
		inherit: true,
		desc: "Has a 40% chance to poison the target.",
		shortDesc: "40% chance to poison the target.",
	},
	softboiled: {
		inherit: true,
		desc: "The user restores 1/2 of its maximum HP, rounded down. Fails if (user's maximum HP - user's current HP + 1) is divisible by 256.",
		heal: null,
		onHit(target) {
			// Fail when health is 255 or 511 less than max
			if (target.hp === (target.maxhp - 255) || target.hp === (target.maxhp - 511) || target.hp === target.maxhp) {
				this.hint("In Gen 1, recovery moves fail if (user's maximum HP - user's current HP + 1) is divisible by 256.");
				return false;
			}
			this.heal(Math.floor(target.maxhp / 2), target, target);
		},
	},
	solarbeam: {
		inherit: true,
		desc: "This attack charges on the first turn and executes on the second.",
		shortDesc: "Charges turn 1. Hits turn 2.",
	},
	sonicboom: {
		inherit: true,
		desc: "Deals 20 HP of damage to the target. This move ignores type immunity.",
	},
	spikecannon: {
		inherit: true,
		desc: "Hits two to five times. Has a 3/8 chance to hit two or three times, and a 1/8 chance to hit four or five times. Damage is calculated once for the first hit and used for every hit. If one of the hits breaks the target's substitute, the move ends.",
	},
	stomp: {
		inherit: true,
		desc: "Has a 30% chance to flinch the target.",
	},
	struggle: {
		inherit: true,
		desc: "Deals Normal-type damage. If this move was successful, the user takes damage equal to 1/2 the HP lost by the target, rounded down, but not less than 1 HP. This move is automatically used if none of the user's known moves can be selected.",
		shortDesc: "User loses 1/2 the HP lost by the target.",
		recoil: [1, 2],
		onModifyMove() {},
	},
	stunspore: {
		inherit: true,
		desc: "Paralyzes the target.",
	},
	submission: {
		inherit: true,
		desc: "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded down, but not less than 1 HP. If this move breaks the target's substitute, the user does not take any recoil damage.",
	},
	substitute: {
		num: 164,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user takes 1/4 of its maximum HP, rounded down, and puts it into a substitute to take its place in battle. The substitute has 1 HP plus the HP used to create it, and is removed once enough damage is inflicted on it or 255 damage is inflicted at once, or if the user switches out or faints. Until the substitute is broken, it receives damage from all attacks made by the opposing Pokemon and shields the user from status effects and stat stage changes caused by the opponent, unless the effect is Disable, Leech Seed, sleep, primary paralysis, or secondary confusion and the user's substitute did not break. The user still takes normal damage from status effects while behind its substitute, unless the effect is confusion damage, which is applied to the opposing Pokemon's substitute instead. If the substitute breaks during a multi-hit attack, the attack ends. Fails if the user does not have enough HP remaining to create a substitute, or if it already has a substitute. The user will create a substitute and then faint if its current HP is exactly 1/4 of its maximum HP.",
		shortDesc: "User takes 1/4 its max HP to put in a Substitute.",
		id: "substitute",
		isViable: true,
		name: "Substitute",
		pp: 10,
		priority: 0,
		volatileStatus: 'substitute',
		onTryHit(target) {
			if (target.volatiles['substitute']) {
				this.add('-fail', target, 'move: Substitute');
				return null;
			}
			// We only prevent when hp is less than one quarter.
			// If you use substitute at exactly one quarter, you faint.
			if (target.hp === target.maxhp / 4) target.faint();
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
		effect: {
			onStart(target) {
				this.add('-start', target, 'Substitute');
				this.effectData.hp = Math.floor(target.maxhp / 4) + 1;
				delete target.volatiles['partiallytrapped'];
			},
			onTryHitPriority: -1,
			onTryHit(target, source, move) {
				if (move.category === 'Status') {
					// In gen 1 it only blocks:
					// poison, confusion, secondary effect confusion, stat reducing moves and Leech Seed.
					let SubBlocked = ['lockon', 'meanlook', 'mindreader', 'nightmare'];
					if (move.status === 'psn' || move.status === 'tox' || (move.boosts && target !== source) || move.volatileStatus === 'confusion' || SubBlocked.includes(move.id)) {
						return false;
					}
					return;
				}
				if (move.volatileStatus && target === source) return;
				// NOTE: In future generations the damage is capped to the remaining HP of the
				// Substitute, here we deliberately use the uncapped damage when tracking lastDamage etc.
				// Also, multi-hit moves must always deal the same damage as the first hit for any subsequent hits
				let uncappedDamage = move.hit > 1 ? source.lastDamage : this.getDamage(source, target, move);
				if (!uncappedDamage) return null;
				uncappedDamage = this.runEvent('SubDamage', target, source, move, uncappedDamage);
				if (!uncappedDamage) return uncappedDamage;
				source.lastDamage = uncappedDamage;
				target.volatiles['substitute'].hp -= uncappedDamage > target.volatiles['substitute'].hp ?
					/** @type {number} */(target.volatiles['substitute'].hp) : uncappedDamage;
				if (target.volatiles['substitute'].hp <= 0) {
					target.removeVolatile('substitute');
					target.subFainted = true;
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				// Drain/recoil does not happen if the substitute breaks
				if (target.volatiles['substitute']) {
					if (move.recoil) {
						this.damage(Math.round(uncappedDamage * move.recoil[0] / move.recoil[1]), source, target, 'recoil');
					}
					if (move.drain) {
						this.heal(Math.ceil(uncappedDamage * move.drain[0] / move.drain[1]), source, target, 'drain');
					}
				}
				this.runEvent('AfterSubDamage', target, source, move, uncappedDamage);
				// Add here counter damage
				let lastAttackedBy = target.getLastAttackedBy();
				if (!lastAttackedBy) {
					target.attackedBy.push({source: source, move: move.id, damage: uncappedDamage, thisTurn: true});
				} else {
					lastAttackedBy.move = move.id;
					lastAttackedBy.damage = uncappedDamage;
				}
				return 0;
			},
			onEnd(target) {
				this.add('-end', target, 'Substitute');
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},
	superfang: {
		inherit: true,
		desc: "Deals damage to the target equal to half of its current HP, rounded down, but not less than 1 HP. This move ignores type immunity.",
		shortDesc: "Damage = 1/2 target's current HP. Hits Ghosts.",
		ignoreImmunity: true,
		basePower: 1,
	},
	swift: {
		inherit: true,
		desc: "This move does not check accuracy and hits even if the target is using Dig or Fly.",
		shortDesc: "Never misses, even against Dig and Fly.",
	},
	takedown: {
		inherit: true,
		desc: "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded down, but not less than 1 HP. If this move breaks the target's substitute, the user does not take any recoil damage.",
	},
	thrash: {
		inherit: true,
		desc: "Whether or not this move is successful, the user spends three or four turns locked into this move and becomes confused immediately after its move on the last turn of the effect, even if it is already confused. If the user is prevented from moving, the effect ends without causing confusion. During the effect, this move's accuracy is overwritten every turn with the current calculated accuracy including stat stage changes, but not to less than 1/256 or more than 255/256.",
		shortDesc: "Lasts 3-4 turns. Confuses the user afterwards.",
	},
	thunder: {
		inherit: true,
		desc: "Has a 10% chance to paralyze the target.",
		shortDesc: "10% chance to paralyze the target.",
		secondary: {
			chance: 10,
			status: 'par',
		},
	},
	thunderwave: {
		inherit: true,
		accuracy: 100,
		onTryHit(target) {
			if (target.hasType('Ground')) {
				this.add('-immune', target);
				return null;
			}
		},
	},
	transform: {
		inherit: true,
		desc: "The user transforms into the target. The target's current stats, stat stages, types, moves, DVs, species, and sprite are copied. The user's level and HP remain the same and each copied move receives only 5 PP. This move can hit a target using Dig or Fly.",
	},
	triattack: {
		inherit: true,
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		onHit() {},
		secondary: null,
	},
	twineedle: {
		inherit: true,
		desc: "Hits twice, with the second hit having a 20% chance to poison the target. If the first hit breaks the target's substitute, the move ends.",
	},
	whirlwind: {
		inherit: true,
		accuracy: 85,
		desc: "No competitive use.",
		shortDesc: "No competitive use.",
		isViable: false,
		forceSwitch: false,
		onTryHit() {},
		priority: 0,
	},
	wingattack: {
		inherit: true,
		basePower: 35,
	},
	wrap: {
		inherit: true,
		desc: "The user spends two to five turns using this move. Has a 3/8 chance to last two or three turns, and a 1/8 chance to last four or five turns. The damage calculated for the first turn is used for every other turn. The user cannot select a move and the target cannot execute a move during the effect, but both may switch out. If the user switches out, the target remains unable to execute a move during that turn. If the target switches out, the user uses this move again automatically, and if it had 0 PP at the time, it becomes 63. If the user or the target switch out, or the user is prevented from moving, the effect ends. This move can prevent the target from moving even if it has type immunity, but will not deal damage.",
		shortDesc: "Prevents the target from moving for 2-5 turns.",
		accuracy: 85,
		ignoreImmunity: true,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock',
		},
		// FIXME: onBeforeMove(pokemon, target) {target.removeVolatile('mustrecharge')}
		onHit(target, source) {
			/**
			 * The duration of the partially trapped must be always renewed to 2
			 * so target doesn't move on trapper switch out as happens in gen 1.
			 * However, this won't happen if there's no switch and the trapper is
			 * about to end its partial trapping.
			 **/
			if (target.volatiles['partiallytrapped']) {
				if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
					target.volatiles['partiallytrapped'].duration = 2;
				}
			}
		},
	},
};

exports.BattleMovedex = BattleMovedex;
