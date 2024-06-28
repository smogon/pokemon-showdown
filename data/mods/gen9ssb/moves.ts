import {ssbSets} from "./random-teams";
import {PSEUDO_WEATHERS, changeSet, getName} from "./scripts";
import {Teams} from '../../../sim/teams';

export const Moves: {[k: string]: ModdedMoveData} = {
	/*
	// Example
	moveid: {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		shortDesc: "", // short description, shows up in /dt
		desc: "", // long description
		name: "Move Name",
		gen: 8,
		pp: 10, // unboosted PP count
		priority: 0, // move priority, -6 -> 6
		flags: {}, // Move flags https://github.com/smogon/pokemon-showdown/blob/master/data/moves.js#L1-L27
		onTryMove() {
			this.attrLastMove('[still]'); // For custom animations
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Move Name 1', source);
			this.add('-anim', source, 'Move Name 2', source);
		}, // For custom animations
		secondary: {
			status: "tox",
			chance: 20,
		}, // secondary, set to null to not use one. Exact usage varies, check data/moves.js for examples
		target: "normal", // What does this move hit?
		// normal = the targeted foe, self = the user, allySide = your side (eg light screen), foeSide = the foe's side (eg spikes), all = the field (eg raindance). More can be found in data/moves.js
		type: "Water", // The move's type
		// Other useful things
		noPPBoosts: true, // add this to not boost the PP of a move, not needed for Z moves, dont include it otherwise
		isZ: "crystalname", // marks a move as a z move, list the crystal name inside
		zMove: {effect: ''}, // for status moves, what happens when this is used as a Z move? check data/moves.js for examples
		zMove: {boost: {atk: 2}}, // for status moves, stat boost given when used as a z move
		critRatio: 2, // The higher the number (above 1) the higher the ratio, lowering it lowers the crit ratio
		drain: [1, 2], // recover first num / second num % of the damage dealt
		heal: [1, 2], // recover first num / second num % of the target's HP
	},
	*/
	// Kozuchi
	weaponenhancement: {
		accuracy: true,
		basepower: 0,
		category: "Status",
		name: "Weapon Enhancement",
		pp: 3,
		noPPBoosts: true,
		priority: 0,
		flags: {snatch: 1},
		condition: {
			onHit(pokemon) {
				if (!pokemon.abilityState.enhancement) pokemon.abilityState.enhancement = 0;
				if (pokemon.abilityState.enhancement >= 3) {
					this.add('-message', `${pokemon.name}'s weapon is already at maximum enhancement!`);
					return;
				}
				if (pokemon.abilityState.enhancement < 3) {
					pokemon.abilityState.enhancement +=1;
					this.add('-message', `${pokemon.name} is strengthening their weapon!`);
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Steel",	
	},
	// Urabrask
	terrorizethepeaks: {
		accuracy: 70,
		basePower: 100,
		category: "Special",
		desc: "Hits the opposing Pokemon and one random inactive Pokemon on the opposing side.",
		shortDesc: "Hits a random inactive opposing Pokemon.",
		name: "Terrorize the Peaks",
		gen: 9,
		pp: 8,
		noPPBoosts: true,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Roar', target);
			this.add('-anim', source, 'Eruption', target);
		},
		onHit(target, source, move) {
			let possibleTargets = [];
			for (const pokemon of target.side.pokemon) {
				if (pokemon === target) continue;
				if (pokemon.hp) possibleTargets.push(pokemon);
			}
			const newTarget = this.sample(possibleTargets);
			const dmg = this.actions.getDamage(source, newTarget, move);
			newTarget.hp -= dmg;
			this.add('-message', `${newTarget.name} took ${Math.round(dmg/newTarget.baseMaxhp * 100)}% from Terrorize the Peaks!`);
			if (this.randomChance(1, 5)) {
				newTarget.status === 'brn';
				newTarget.setStatus('brn', source);
				this.add('-message', `${newTarget.name} was burned!`);
			}
			return null;
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// Urabrask
	blasphemousact: {
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		desc: "Steals 10-33% HP from all healthy allies. This Pokemon recovers HP equal to the stolen HP. This move's power is equal to (HP Stolen / 1.5). 40% chance to burn each Pokemon affected by this move. If the affected Pokemon already has a status condition, it will be replaced with burn. (30% chance per Pokemon, not 30% chance that all Pokemon are burned)",
		shortDesc: "Steals allies' HP to determine power. 40% to burn each affected foe.",
		name: "Blasphemous Act",
		gen: 9,
		pp: 1,
		priority: 0,
		flags: {contact: 1},
		breaksProtect: true,
		isZ: "urabrasksforge",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Inferno', source);
			this.add('-anim', source, 'G-Max Fireball', target);
		},
		basePowerCallback(pokemon, target, move) {
			this.effectState.totaldrain = 0;
			for (const ally of pokemon.side.pokemon) {
				if (ally === pokemon) continue;
				if (ally.hp <= ally.baseMaxhp / 3) continue;
				let dmg = ally.baseMaxhp / this.random(3, 10);
				ally.hp -= dmg;
				this.effectState.totaldrain += dmg;
			}
			if (!this.effectState.totaldrain) return false;
			this.heal(this.effectState.totaldrain, pokemon, pokemon, move);
			return this.effectState.totaldrain / 1.5;
		},
		onAfterHit(target, source) {
			for (const pokemon of target.side.pokemon) {
				if (this.randomChance(4, 10)) {
					pokemon.status === 'brn';
					pokemon.setStatus('brn', source);
					this.add('-message', `${pokemon.name} was burned admist the chaos!`);
				}
			}
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// Sariel
	civilizationofmagic: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Target's Special Attack is used in damage calculation.",
		shortDesc: "Uses foe's SpA.",
		name: "Civilization of Magic",
		gen: 9,
		pp: 24,
		noPPBoosts: true,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dazzling Gleam', target);
		},
		overrideOffensivePokemon: 'target',
		secondary: null,
		target: "normal",
		type: "Fairy",
	},
	// Mima
	reincarnation: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "User fully restores HP and status condition and resets boosts before permanently transforming into foe.",
		shortDesc: "Full restore & boost reset; transformation.",
		name: "Reincarnation",
		gen: 9,
		pp: 1,
		priority: 0,
		flags: {defrost: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Revival Blessing', source);
		},
		onHit(target, pokemon) {
			pokemon.clearBoosts();
			pokemon.cureStatus();
			let move: Move | ActiveMove | null = pokemon.lastMove;
			changeSet(this, pokemon, target);
			this.heal(pokemon.baseMaxhp, pokemon, pokemon, move);
		},
		isZ: "crescentstaff",
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
	// Mima
	completedarkness: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "The target's positive stat changes are stolen and applied to the user before dealing damage.",
		shortDesc: "Steals target's boosts before dealing damage.",
		name: "Complete Darkness",
		gen: 9,
		pp: 16,
		noPPBoosts: true,
		priority: 0,
		flags: {bypasssub: 1, mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Spectral Thief', target);
		},
		stealsBoosts: true,
		secondary: null,
		target: "normal",
		type: "Dark",
	},
	// Gizmo
	coinclash: {
		accuracy: 80,
		basePower: 20,
		category: "Physical",
		name: "Coin Clash",
		desc: "Hits 3-5 times. Flings coin at target after use. 50% chance to gain +2 crit ratio and 1.25x evasion until switch/faint. Fails if not holding Inconspicuous Coin.",
		shortDesc: "See this entry with '/ssb Gizmo'!",
		pp: 10,
		noPPBoosts: true,
		flags: {contact: 1},
		onTryMove(pokemon, target, move) {
			this.attrLastMove('[still]');
			if (!pokemon.item) {
				this.add('-message', `${pokemon.name} couldn't find their coin!`);
				return false;
			}
		},
		onPrepareHit(target, source) {
			if (!source.item) return;
			this.add('-anim', source, 'Magnetic Flux', source);
			this.add('-anim', source, 'Pay Day', target);
		},
		onAfterMove(source, target, move) {
			if (!source.item) return;
			this.add('-message', `${source.name} hurled the Inconspicuous Coin at ${target.name}!`);
			this.damage(target.maxhp / this.random(6, 10), target, source);
			source.addVolatile('coinclash');
			source.abilityState.recallActive = true;
			if (this.randomChance(1, 2)) {
				this.add('-message', `Hey! The coin landed on heads!`);
				this.add('-message', `${source.name} is fired up!`);
				this.heal(source.maxhp / this.random(4, 8));
				source.abilityState.firedUp = true;
			}
		},
		condition: {
			duration: 2,
			onStart(pokemon) {
				const item = pokemon.getItem();
				pokemon.setItem('');
				pokemon.lastItem = item.id;
				pokemon.usedItemThisTurn = true;
				this.add('-enditem', pokemon, item.name, '[from] move: Coin Clash');
				this.runEvent('AfterUseItem', pokemon, null, null, item);
			},
			onEnd(pokemon) {
				if (pokemon.item || pokemon.name !== 'Gizmo') return;
				pokemon.setItem('inconspicuouscoin');
				this.add('-item', pokemon, pokemon.getItem(), '[from] item: Inconspicuous Coin');
				pokemon.abilityState.recallActive = false;
			},
		},
		multihit: [3, 5],
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	// Glint
	gigameld: {
		accuracy: true,
		basePower: 0,
		category: "Physical",
		name: "GigaMeld",
		pp: 5,
		noPPBoosts: true,
		flags: {contact: 1},
		volatileStatus: 'meld',
		ignoreImmunity: true,
		beforeMoveCallback(pokemon) {
			if (pokemon.volatiles['bide']) return true;
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.effectState.totalDamage = 0;
				this.add('-start', pokemon, 'move: GigaMeld');
				this.add('-message', `${pokemon.name} is preparing to meld with ${pokemon.side.foe.active[0].name}!`);
			},
			onDamagePriority: -101,
			onDamage(damage, target, source, move) {
				if (!move || move.effectType !== 'Move' || !source) return;
				this.effectState.totalDamage += damage;
				this.effectState.lastDamageSource = source;
			},
			onBeforeMove(pokemon, target, move) {
				if (this.effectState.duration === 1) {
					this.add('-end', pokemon, 'move: GigaMeld');
					target = this.effectState.lastDamageSource;
					if (!target || !this.effectState.totalDamage) {
						this.attrLastMove('[still]');
						this.add('-fail', pokemon);
						return false;
					}
					if (!target.isActive) {
						const possibleTarget = this.getRandomTarget(pokemon, this.dex.moves.get('pound'));
						if (!possibleTarget) {
							this.add('-miss', pokemon);
							return false;
						}
						target = possibleTarget;
					}
					const moveData: Partial<ActiveMove> = {
						id: 'bide' as ID,
						name: "Bide",
						accuracy: true,
						damage: this.effectState.totalDamage * 2,
						category: "Physical",
						priority: 1,
						flags: {contact: 1, protect: 1},
						effectType: 'Move',
						type: 'Normal',
					};
					this.actions.tryMoveHit(target, pokemon, moveData as ActiveMove);
					pokemon.removeVolatile('bide');
					return false;
				}
				this.add('-activate', pokemon, 'move: Bide');
			},
			onMoveAborted(pokemon) {
				pokemon.removeVolatile('bide');
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Bide', '[silent]');
			},
		},
		secondary: null,
		target: "self",
		type: "Steel",
	},
	megametronome: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Mega Metronome",
		desc: "Uses two-to-five randomly selected moves.",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', target, 'Geomancy', target);
			this.add('-anim', target, 'Metronome', target);
		},
		onHit(target, source, effect) {
			// Metronome
			const moves = this.dex.moves.all().filter(move => (
				(![2, 4].includes(this.gen) || !source.moves.includes(move.id)) &&
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable') &&
				move.flags['metronome']
			));
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
			}
			if (!randomMove) return false;
			source.side.lastSelectedMove = this.toID(randomMove);
			this.actions.useMove(randomMove, target);

			// Check if metronome count exists, add 1 to it, then exit the function
			// unless mCount is more than or equal to 5
			if (!target.mCount) target.mCount = 0;
			target.mCount++;
			if (!target.mCount || target.mCount < 5) return;
			if (target.ftfActivated) return;

			// Replaces Mega Metronome with Fear the Finger if mCount >= 5
			const mmIndex = target.moves.indexOf('megametronome');
			if (mmIndex < 0) return;
			const ftf = {
				move: 'Fear the Finger',
				id: 'fearthefinger',
				pp: 1,
				maxpp: 1,
				target: 'normal',
				disabled: false,
				used: false,
			};
			target.moveSlots[mmIndex] = ftf;
			target.baseMoveSlots[mmIndex] = ftf;
			target.ftfActivated = true;
			this.add('-activate', target, 'move: Mega Metronome', 'Fear the Finger');
		},
		secondary: null,
		multihit: [2, 5],
		target: "self",
		type: "Normal",
	},
	// Finger
	fearthefinger: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Fear the Finger",
		shortDesc: "Uses ten randomly selected moves. Breaks protection.",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', target, 'Springtide Storm', target);
		},
		onHit(target, source, effect) {
			// Metronome
			const moves = this.dex.moves.all().filter(move => (
				(![2, 4].includes(this.gen) || !source.moves.includes(move.id)) &&
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable') &&
				move.flags['metronome']
			));
			for (let i = 0; i < 10; i++) {
				let randomMove = '';
				if (moves.length) {
					moves.sort((a, b) => a.num - b.num);
					randomMove = this.sample(moves).id;
				}
				if (!randomMove) return false;
				source.side.lastSelectedMove = this.toID(randomMove);
				this.actions.useMove(randomMove, target);
			}

			// Turns Fear the Finger back into Mega Metronome after use
			const ftfIndex = target.moves.indexOf('fearthefinger');
			if (ftfIndex < 0) return;
			const mm = {
				move: 'Mega Metronome',
				id: 'megametronome',
				pp: 8,
				maxpp: 8,
				target: 'self',
				disabled: false,
				used: false,
			};
			target.moveSlots[ftfIndex] = mm;
			target.baseMoveSlots[ftfIndex] = mm;
			this.add('-activate', target, 'move: Fear the Finger', 'Mega Metronome');
		},
		flags: {},
		breaksProtect: true,
		secondary: null,
		target: "self",
		type: "Dark",
	},
	// Pablo
	plagiarize: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Replaces this move with target's last move. Lowers that move's PP to 0.",
		name: "Plagiarize",
		gen: 9,
		pp: 16,
		noPPBoosts: true,
		priority: 0,
		// Sketch
		onHit(target, source) {
			const targetFoe = target.side.pokemon[this.random(1, 6)];
			targetFoe.hp -= 100;
			this.add('-message', `${targetFoe.name} was hurt!`);
			const move = target.lastMove;
			if (source.transformed || !move || source.moves.includes(move.id)) return false;
			if (move.isZ || move.isMax) return false;
			const index = source.moves.indexOf('plagiarize');
			if (index < 0) return false;
			const sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
			};
			source.moveSlots[index] = sketchedMove;
			source.baseMoveSlots[index] = sketchedMove;
			this.add('-activate', source, 'move: Plagiarize', move.name);
		},
		// PP Nullification
		onTryHit(target) {
			let move: Move | ActiveMove | null = target.lastMove;
			if (!move || move.isZ) return false;
			if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
			const ppDeducted = target.deductPP(move.id, 64);
			if (!ppDeducted) return false;
			this.add("-activate", target, 'move: Plagiarize', move.name, ppDeducted);
		},
		flags: {},
		target: "normal",
		type: "Normal",
	},
	// Pablo
	sketchbook: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Sketchbook",
		gen: 9,
		pp: 10,
		noPPBoosts: true,
		priority: 0,
		flags: {},
		onHit(target, source) {
			let i: BoostID;
			for (i in target.boosts) {
				source.boosts[i] = target.boosts[i];
			}
			this.add('-copyboost', source, target, '[from] move: Sketchbook');
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},
	// Trey
	burstdelta: {
		accuracy: true,
		basePower: 80,
		category: "Physical",
		desc: "User heals equal to 1/3 of damage dealt and lowers target's Defense by 1 stage but this move cannot be used twice in a row.",
		shortDesc: "Heal 1/3 damage and lower Defense by 1 stage but can't use twice in a row.",
		name: "Burst Delta",
		gen: 9,
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		flags: {mirror: 1, protect: 1, cantusetwice: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Thousand Arrows', target);
		},
		drain: [1, 3],
		secondary: {
			chance: 100,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Flying",
	},
	// Trey
	granddelta: {
		accuracy: true,
		basePower: 110,
		category: "Physical",
		desc: "User heals equal to half of damage dealt and lowers target's Defense by 1 stage. This move hits again next turn for half damage.",
		shortDesc: "Heal 1/2 damage and lower Defense by 1 stage; hits again next turn for 0.5x damage.",
		name: "Grand Delta",
		gen: 9,
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		isZ: "yoichisbow",
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Splintered Stormshards', target);
		},
		onTry(source, target) {
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 2,
				move: 'granddelta',
				moveData: {
					id: 'granddelta',
					name: 'Grand Delta',
					accuracy: true,
					basePower: 55,
					category: "Physical",
					priority: 0,
					flags: {},
					secondary: {
						chance: 100,
						boosts: {
							def: -1,
						},
					},
					drain: [1, 2],
					effectType: 'Move',
					type: 'Flying',
				},
			});
			this.add('-start', source, 'move: Grand Delta');
		},
		drain: [1, 2],
		flags: {},
		secondary: {
			chance: 100,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Flying",
	},
	// Trey
	dynamitearrow: {
		accuracy: true,
		basePower: 50,
		category: "Physical",
		desc: "This move will connect one turn later.",
		shortDesc: "Lands 1 turn after.",
		name: "Dynamite Arrow",
		gen: 9,
		pp: 40,
		noPPBoosts: true,
		priority: 0,
		flags: {mirror: 1, protect: 1, futuremove: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Searing Shot', target);
		},
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 2,
				move: 'dynamitearrow',
				source: source,
				moveData: {
					id: 'dynamitearrow',
					name: "Dynamite Arrow",
					accuracy: true,
					basePower: 50,
					category: "Physical",
					priority: 0,
					flags: {futuremove: 1},
					effectType: 'Move',
					type: 'Fire',
				},
			});
			this.add('-start', source, 'move: Dynamite Arrow');
			return this.NOT_FAIL;
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// Yukari Yakumo
	gap: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "User and target switch to a random ally.",
		name: "Gap",
		gen: 9,
		pp: 5,
		noPPBoosts: true,
		priority: -6,
		flags: {bypasssub: 1, noassist: 1, failcopycat: 1},
		forceSwitch: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dark Void', target);
		},
		onHit(target, source, move) {
			if (source.forceSwitchFlag) return;
			source.forceSwitchFlag = true;
		},
		target: "normal",
		type: "Psychic",
	},
	// Aeri
	blissfulbreeze: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Blissful Breeze",
		gen: 9,
		pp: 16,
		noPPBoosts: true,
		priority: 0,
		flags: {futuremove: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Petal Dance', target);
		},
		onHit(target, source, move) {
			this.add('-activate', source, 'move: Blissful Breeze');
			let success = false;
			const allies = [...source.side.pokemon, ...source.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
		sideCondition: 'blissfulbreeze',
		condition: {
			duration: 3,
			onSideStart(targetSide) {
				this.add('-sidestart', targetSide, 'Blissful Breeze');
			},
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) {
				const rand = this.random(85, 100) / 100;
				const def = target.getStat('spd', false, true);
				const damage = (1.5)*(72576/(5*def)+2)*rand;
				this.damage(damage, target);
				this.add('-message', `${target.name} was damaged by Blissful Breeze!`);
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
			onSideEnd(targetSide) {
				this.add('-sideend', targetSide, 'Blissful Breeze');
			},
		},
		target: "normal",
		type: "Flying",
	},
};
