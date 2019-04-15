'use strict';

// Used for bumbadadabum and Snaquaza's move
const RandomStaffBrosTeams = require('./random-teams');
/** @type {typeof import('../../../sim/pokemon').Pokemon} */
const Pokemon = require(/** @type {any} */ ('../../../.sim-dist/pokemon')).Pokemon;

/** @type {{[k: string]: ModdedMoveData}} */
let BattleMovedex = {
	/*
	// Example
	"moveid": {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		id: "moveid",
		name: "Move Name",
		pp: 10, // unboosted PP count
		priority: 0, // move priority, -6 -> 6
		flags: {}, // Move flags https://github.com/Zarel/Pokemon-Showdown/blob/master/data/moves.js#L1-L27
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
		zMoveEffect: '', // for status moves, what happens when this is used as a Z move? check data/moves.js for examples
		zMoveBoost: {atk: 2}, // for status moves, stat boost given when used as a z move
		critRatio: 2, // The higher the number (above 1) the higher the ratio, lowering it lowers the crit ratio
		drain: [1, 2], // recover first num / second num % of the damage dealt
		heal: [1, 2], // recover first num / second num % of the target's HP
	},
	*/
	// Please keep sets organized alphabetically based on staff member name!
	// 2xTheTap
	noblehowl: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by two stages and cures the user of burns, paralysis, and poison. Removes Reflect, Light Screen, Aurora Veil, Safeguard, and Mist from the opponent's side and removes Spikes, Toxic Spikes, Stealth Rock, and Sticky Web from both sides.",
		shortDesc: "Raises Attack by 2, clears hazards/user status.",
		id: "noblehowl",
		name: "Noble Howl",
		isNonstandard: "Custom",
		pp: 3,
		noPPBoosts: true,
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Howl', source);
			this.add('-anim', source, 'Boomburst', source);
		},
		onHit(target, source, move) {
			this.boost({atk: 2}, source, source, this.getActiveMove('Noble Howl'));
			if (!(['', 'slp', 'frz'].includes(source.status))) {
				source.cureStatus();
			}
			let removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
			let removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.getEffect(targetCondition).name, '[from] move: Noble Howl', '[of] ' + target);
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.getEffect(sideCondition).name, '[from] move: Noble Howl', '[of] ' + source);
				}
			}
		},
		flags: {mirror: 1, snatch: 1, authentic: 1},
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	// 5gen
	toomuchsaws: {
		accuracy: 100,
		basePower: 85,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched) {
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		desc: "Base Power doubles if the foe switches out the turn this move is used.",
		shortDesc: "Power doubles if foe switches out.",
		id: "toomuchsaws",
		name: "Too Much Saws",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Headbutt', target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		secondary: null,
		target: "normal",
		type: "Grass",
	},
	// ACakeWearingAHat
	sparcedance: {
		accuracy: true,
		category: "Status",
		desc: "Boosts the user's Attack, Defense, and Speed by one stage.",
		shortDesc: "+1 atk, def, and spe.",
		id: "sparcedance",
		name: "Sparce Dance",
		isNonstandard: "Custom",
		pp: 15,
		priority: 0,
		flags: {snatch: 1, mirror: 1, dance: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Quiver Dance", source);
		},
		boosts: {atk: 1, def: 1, spe: 1},
		secondary: null,
		target: "self",
		type: "Normal",
	},
	// Aelita
	energyfield: {
		accuracy: 100,
		basePower: 140,
		category: "Special",
		desc: "Has a 40% chance to paralyze the target. Lowers the user's Special Attack, Special Defense, and Speed by one stage.",
		shortDesc: "40% to paralyze. Lowers user's SpA, SpD, Spe.",
		id: "energyfield",
		name: "Energy Field",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Electro Ball", target);
			this.add('-anim', source, "Ion Deluge", target);
		},
		self: {boosts: {spa: -1, spd: -1, spe: -1}},
		secondary: {
			chance: 40,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		zMovePower: 200,
	},
	// Akir
	compost: {
		accuracy: true,
		category: "Status",
		desc: "The user recovers half their HP. If any of the user's allies fainted the previous turn, this move heals the active Pokemon by 50% of the user's HP on the following turn. Cures the user's party of all status conditions.",
		shortDesc: "Heal 50%; cures party; If ally fainted last turn: wish.",
		id: "compost",
		name: "Compost",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Ingrain", target);
		},
		onHit(target, source) {
			let didSomething = false;
			let side = source.side;
			if (side.faintedLastTurn) {
				this.add('-anim', source, "Wish", target);
				side.addSlotCondition(source, 'wish', source);
				this.add('-message', `${source.name} made a wish!`);
				didSomething = true;
			}
			for (const ally of side.pokemon) {
				if (ally.cureStatus()) didSomething = true;
			}
			if (this.heal(source.maxhp / 2, source)) didSomething = true;
			return didSomething;
		},
		secondary: null,
		target: "self",
		type: "Ghost",
	},
	// Amaluna
	turismosplash: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Summons Trick Room and raises the user's Special Attack by one stage.",
		shortDesc: "User's Sp. Atk +1; sets Trick Room.",
		id: "turismosplash",
		name: "Turismo Splash",
		isNonstandard: "Custom",
		pp: 5,
		priority: -6,
		onModifyMove(move) {
			if (!this.field.pseudoWeather.trickroom) {
				move.pseudoWeather = 'trickroom';
			}
		},
		flags: {snatch: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Coil", source);
			this.add('-anim', source, "Extreme Evoboost", source);
		},
		boosts: {
			spa: 1,
		},
		secondary: null,
		target: "self",
		type: "Water",
	},
	// Andy
	pilfer: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "If the target uses certain non-damaging moves this turn, the user steals the move to use itself. This move fails if no move is stolen or if the user is under the effect of Sky Drop.",
		shortDesc: "Steals foe's move. Fails if target attacks. Priority.",
		id: "pilfer",
		name: "Pilfer",
		isNonstandard: "Custom",
		pp: 5,
		priority: 1,
		flags: {protect: 1, mirror: 1, contact: 1, authentic: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onTryHit(target, source) {
			let decision = this.willMove(target);
			if (decision) {
				let move = this.getActiveMove(decision.move.id);
				if (move.category === 'Status' && move.id !== 'mefirst' && move.target) {
					if (['all', 'adjacentAllyOrSelf', 'allySide', 'allyTeam', 'self'].includes(move.target)) {
						 this.useMove(move, source, source);
					} else {
						 this.useMove(move, source, target);
					}
					this.add('-anim', source, "Sucker Punch", target);
					this.add('-anim', source, "Night Slash", target);
					return;
				}
			}
			return false;
		},
		volatileStatus: 'pilfer',
		effect: {
			// Simulate the snatch effect while being able to use the pilfered move 1st
			duration: 1,
			onStart() {
			},
			onBeforeMovePriority: 3,
			onBeforeMove(pokemon, target, move) {
				if (move.category === 'Status') {
					this.add('-message', move.name + ' was pilfered and unable to be used.');
					return false;
				}
			},
		},
		target: "normal",
		type: "Dark",
	},
	// ant
	truant: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "The target's ability is changed to Truant if this move hits.",
		shortDesc: "Changes the target's ability to Truant.",
		id: "truant",
		name: "TRU ANT",
		isNonstandard: "Custom",
		pp: 5,
		flags: {protect: 1, mirror: 1, contact: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Sunsteel Strike', target);
		},
		onHit(pokemon) {
			if (pokemon.ability === 'truant') return;
			let oldAbility = pokemon.setAbility('truant');
			if (oldAbility) {
				this.add('-ability', pokemon, 'Truant', '[from] move: TRU ANT');
				return;
			}
			return false;
		},
		target: "normal",
		type: "Steel",
	},
	// A Quag to The Past
	murkyambush: {
		accuracy: true,
		basePower: 150,
		category: "Physical",
		desc: "This move fails unless a foe uses a contact move on the user before the user can execute the move on the same turn. If this move is successful, the foe's move has its secondary effects suppressed and damage halved. If the user survives a hit, it attacks, and the effect ends.",
		shortDesc: "User must be hit by a contact move before moving.",
		id: "murkyambush",
		name: "Murky Ambush",
		isNonstandard: "Custom",
		pp: 20,
		priority: -3,
		flags: {contact: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			if (source.volatiles['murkyambush'] && source.volatiles['murkyambush'].gotHit) {
				this.add('-anim', source, "Crunch", target);
			}
		},
		beforeTurnCallback(pokemon) {
			pokemon.addVolatile('murkyambush');
			this.add('-message', `${pokemon.name} anticipates the opposing Pokémon's next move!`);
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Work Up", pokemon);
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.volatiles['murkyambush'] && !pokemon.volatiles['murkyambush'].gotHit) {
				this.add('cant', pokemon, 'Murky Ambush', 'Murky Ambush');
				this.add('-message', `${pokemon.name} eases up.`);
				return true;
			}
			this.add('-message', `${pokemon.side.foe.active[0].name} was caught in the ambush!`);
		},
		effect: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Murky Ambush');
			},
			onSourceBasePowerPriority: 7,
			onSourceBasePower() {
				this.debug('Murky Ambush weaken');
				return this.chainModify(0.5);
			},
			onFoeTryMove(target, source, move) {
				if (move.secondaries && move.flags.contact) {
					this.debug('Murky Ambush secondary effects suppression');
					delete move.secondaries;
				}
			},
			onHit(pokemon, source, move) {
				if (pokemon.side !== source.side && move.flags.contact) {
					pokemon.volatiles['murkyambush'].gotHit = true;
				}
			},
		},
		target: "normal",
		type: "Dark",
	},
	// Arcticblast
	trashalanche: {
		basePower: 80,
		basePowerCallback(pokemon, target, move) {
			let noitem = 0;
			for (const foes of target.side.pokemon) {
				if (!foes.item) noitem += 20;
			}
			return move.basePower + noitem;
		},
		accuracy: 100,
		category: "Physical",
		desc: "This move's Base Power increases by 20 for every foe that is not holding an item.",
		shortDesc: "+20 power for each item-less opponent.",
		id: "trashalanche",
		name: "Trashalanche",
		isNonstandard: "Custom",
		pp: 10,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Gunk Shot", target);
		},
		secondary: null,
		target: "normal",
		type: "Poison",
	},
	// Arsenal
	comeonyougunners: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "This move's type depends on the user's held Plate. If the target has the same type as this move, its Base Power is boosted by 1.5x.",
		shortDesc: "Type = Plate. 1.5x power if foe has the move's type.",
		id: "comeonyougunners",
		name: "Come on you Gunners",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Judgment', target);
			this.add('-anim', target, 'Extreme Evoboost', target);
			// Modifying BP here so it happens AFTER ModifyMove
			if (target.types.includes(move.type)) {
				this.debug('Come on you Gunners BP boost');
				move.basePower = move.basePower * 1.5;
			}
		},
		onModifyMove(move, pokemon) {
			const item = pokemon.getItem();
			if (item.id && item.onPlate && !item.zMove) {
				this.debug(`Come on you Gunners type changed to: ${item.onPlate}`);
				move.type = item.onPlate;
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	// Beowulf
	buzzingoftheswarm: {
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		desc: "Has a 20% chance to cause the target to flinch.",
		shortDesc: "20% chance to flinch.",
		id: "buzzingoftheswarm",
		name: "Buzzing of the Swarm",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Bug Buzz', source);
		},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Bug",
	},
	// Bhris Brown
	finalimpact: {
		basePower: 85,
		accuracy: 100,
		category: "Physical",
		desc: "This move summons Rain Dance and boosts the user's Defense by one stage.",
		shortDesc: "User's Def +1. Summons Rain Dance.",
		id: "finalimpact",
		name: "Final Impact",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, protect: 1, contact: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Meteor Mash', target);
		},
		onAfterMoveSecondarySelf() {
			this.field.setWeather('raindance');
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
		target: "normal",
		type: "Fighting",
	},
	// biggie
	foodrush: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "If both the user and the target have not fainted, the target is forced to switch out to a random non-fained ally. This effect fails if the target used Ingrain previously, has the Suction Cups ability, or is behind a Substitute.",
		shortDesc: "Forces the target to switch to a random ally.",
		id: "foodrush",
		name: "Food Rush",
		isNonstandard: "Custom",
		pp: 10,
		priority: -6,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Stockpile', source);
			this.add('-anim', source, 'Spit Up', target);
		},
		forceSwitch: true,
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	// bobochan
	thousandcircuitoverload: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "If the target is a Ground-type and is immune to Electric due to its typing, this move deals neutral damage regardless of other types, and the target loses its type-based immunity to Electric.",
		shortDesc: "First hit neutral on Ground; removes its immunity.",
		id: "thousandcircuitoverload",
		name: "Thousand Circuit Overload",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Plasma Fists', target);
		},
		onEffectiveness(typeMod, target, type, move) {
			if (move.type !== 'Electric') return;
			if (!target) return; // avoid crashing when called from a chat plugin
			if (!target.runImmunity('Electric')) {
				if (target.hasType('Ground')) return 0;
			}
		},
		volatileStatus: 'thousandcircuitoverload',
		effect: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Thousand Circuit Overload');
			},
			onNegateImmunity(pokemon, type) {
				if (pokemon.hasType('Ground') && type === 'Electric') return false;
			},
		},
		ignoreImmunity: {'Electric': true},
		secondary: null,
		target: "normal",
		type: "Electric",
	},
	// Brandon
	blusterywinds: {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Removes Reflect, Light Screen, Aurora Veil, Safeguard, Mist, Spikes, Toxic Spikes, Stealth Rock, and Sticky Web from both sides, and it removes any active weather condition or Terrain.",
		shortDesc: "Removes all field conditions and hazards.",
		id: "blusterywinds",
		name: "Blustery Winds",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, authentic: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Defog", target);
		},
		onHit(target, source, move) {
			let removeAll = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
			let silentRemove = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist'];
			for (const sideCondition of removeAll) {
				if (target.side.removeSideCondition(sideCondition)) {
					if (!(silentRemove.includes(sideCondition))) this.add('-sideend', target.side, this.getEffect(sideCondition).name, '[from] move: Blustery Winds', '[of] ' + source);
				}
				if (source.side.removeSideCondition(sideCondition)) {
					if (!(silentRemove.includes(sideCondition))) this.add('-sideend', source.side, this.getEffect(sideCondition).name, '[from] move: Blustery Winds', '[of] ' + source);
				}
			}
			this.field.clearWeather();
			this.field.clearTerrain();
		},
		secondary: null,
		target: "normal",
		type: "Flying",
	},
	// bumbadadabum
	wondertrade: {
		accuracy: true,
		category: "Status",
		desc: "Replaces every non-fainted member of the user's team with a Super Staff Bros. Brawl set that is randomly selected from all sets, except those with the move Wonder Trade. Remaining HP and PP percentages, as well as status conditions, are transferred onto the replacement sets This move fails if it's used by a Pokemon that does not originally know this move. This move fails if the user is not bumbadadabum.",
		shortDesc: "Replaces user's team with random StaffBros. sets.",
		id: "wondertrade",
		name: "Wonder Trade",
		isNonstandard: "Custom",
		pp: 2,
		noPPBoosts: true,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Amnesia', source);
			this.add('-anim', source, 'Double Team', source);
		},
		onTryHit(target, source) {
			if (source.name !== 'bumbadadabum') {
				this.add('-fail', source);
				this.hint("Only bumbadadabum can use Wonder Trade.");
				return null;
			}
		},
		onHit(target, source) {
			// Store percent of HP left, percent of PP left, and status for each pokemon on the user's team
			let carryOver = [];
			let currentTeam = source.side.pokemon;
			for (let pokemon of currentTeam) {
				carryOver.push({
					hp: pokemon.hp / pokemon.maxhp,
					status: pokemon.status,
					statusData: pokemon.statusData,
					pp: pokemon.moveSlots.slice().map(m => {
						return m.pp / m.maxpp;
					}),
				});
				// Handle pokemon with less than 4 moves
				while (carryOver[carryOver.length - 1].pp.length < 4) {
					carryOver[carryOver.length - 1].pp.push(1);
				}
			}
			// Generate a new team
			let team = this.teamGenerator.getTeam({name: source.side.name});
			// Overwrite un-fainted pokemon other than the user
			for (let i = 0; i < currentTeam.length; i++) {
				if (currentTeam[i].fainted || !currentTeam[i].hp || currentTeam[i].position === source.position) continue;
				let set = team.shift();
				let oldSet = carryOver[i];
				// @ts-ignore
				if (set.name === 'bumbadadabum') {
					// No way am I allowing 2 of this mon on one team
					set = team.shift();
				}

				// Bit of a hack so client doesn't crash when formeChange is called for the new pokemon
				let effect = this.effect;
				this.effect = /** @type {Effect} */ ({id: ''});
				// @ts-ignore
				let pokemon = new Pokemon(set, source.side);
				this.effect = effect;

				pokemon.hp = Math.floor(pokemon.maxhp * oldSet.hp) || 1;
				pokemon.status = oldSet.status;
				if (oldSet.statusData) pokemon.statusData = oldSet.statusData;
				for (const [j, moveSlot] of pokemon.moveSlots.entries()) {
					moveSlot.pp = Math.floor(moveSlot.maxpp * oldSet.pp[j]);
				}
				pokemon.position = currentTeam[i].position;
				currentTeam[i] = pokemon;
			}
			this.add('message', `${source.name} wonder traded ${source.side.name}'s team away!`);
		},
		target: "self",
		type: "Psychic",
	},
	// cant say
	aesthetislash: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "Summons Grassy Terrain. If the user is an Aegislash, it changes forme to Aegislash-Blade, attacks, then goes back to its base forme.",
		shortDesc: "Summons Grassy Terrain. Aegislash transforms.",
		id: "aesthetislash",
		name: "a e s t h e t i s l a s h",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Geomancy', source);
			this.add('-anim', source, 'Swords Dance', source);
			this.add('-anim', source, 'Bloom Doom', target);
		},
		onAfterMoveSecondarySelf() {
			this.field.setTerrain('grassyterrain');
		},
		onAfterMove(pokemon) {
			if (pokemon.template.baseSpecies !== 'Aegislash' || pokemon.transformed) return;
			if (pokemon.template.species !== 'Aegislash') pokemon.formeChange('Aegislash');
		},
		target: "normal",
		type: "Steel",
	},
	// cc
	restartingrouter: {
		accuracy: true,
		category: "Status",
		desc: "Raises the user's Special Attack by 2 stages and its Speed by 1 stage.",
		shortDesc: "Raises the user's Sp. Atk by 2 and Speed by 1.",
		id: "restartingrouter",
		name: "Restarting Router",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {mirror: 1, snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Charge', source);
		},
		boosts: {spa: 2, spe: 1},
		secondary: null,
		target: "self",
		type: "Electric",
	},
	// Ceteris
	bringerofdarkness: {
		accuracy: true,
		category: "Status",
		desc: "Has a 50% chance to cause the target to fall asleep. Sets one layer of Spikes on the opponent's side of the field and boosts a random stat of the user by one stage, excluding accuracy and evasion, that is not already at maximum.",
		shortDesc: "50% chance to sleep. Sets 1 Spike. Boosts a stat.",
		id: "bringerofdarkness",
		name: "Bringer of Darkness",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {reflectable: 1, mirror: 1, snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Dark Void", target);
		},
		onHit(target, source, move) {
			this.add('-anim', source, "Spikes", target);
			target.side.addSideCondition('spikes');
			let stats = [];
			for (let stat in source.boosts) {
				// @ts-ignore
				if (stat !== 'accuracy' && stat !== 'evasion' && source.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				let randomStat = this.sample(stats);
				/** @type {{[stat: string]: number}} */
				let boost = {};
				boost[randomStat] = 1;
				this.boost(boost, source);
			}
		},
		secondary: {
			chance: 50,
			status: 'slp',
		},
		target: "normal",
		type: "Dark",
	},
	// Cerberax
	blimpcrash: {
		accuracy: true,
		basePower: 165,
		category: "Physical",
		desc: "80% Accuracy if target is grounded. The user and the target will be grounded, and the user will take 1/2 of the damage inflicted as recoil.",
		shortDesc: "80 Acc vs grounded, grounds both sides, 1/2 recoil.",
		id: "blimpcrash",
		name: "Blimp Crash",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, protect: 1, contact: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onModifyMove(move, source, target) {
			if (target.isGrounded()) {
				move.accuracy = 80;
			}
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Head Smash', target);
			this.add('-anim', source, 'Earthquake', target);
		},
		onHit(target, source) {
			target.addVolatile('smackdown');
			source.addVolatile('smackdown');
		},
		secondary: null,
		recoil: [1, 2],
		target: "normal",
		type: "Flying",
	},
	// chaos
	forcewin: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Confuses the target and subjects it to the effects of Taunt, Torment, Heal Block, and Embargo.",
		shortDesc: "Ensures domination of the opponent.",
		id: "forcewin",
		name: "Forcewin",
		isNonstandard: "Custom",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Entrainment", target);
			this.add('-anim', source, "Lock On", target);
		},
		onHit(target, source) {
			target.addVolatile('taunt', source);
			target.addVolatile('embargo', source);
			target.addVolatile('torment', source);
			target.addVolatile('confusion', source);
			target.addVolatile('healblock', source);
			this.add(`c|~chaos|/forcewin chaos`);
			if (this.random(1000) === 420) {
				// Should almost never happen, but will be hilarious when it does.
				// Basically, roll a 1000 sided die, if it lands on 420 forcibly give the user's trainer the win
				this.add(`c|~chaos|Actually`);
				this.add(`c|~chaos|/forcewin ${source.side.name}`);
				this.win(source.side);
			}
		},
		secondary: null,
		target: "normal",
		type: "???",
	},
	// Chloe
	beskyttelsesnet: {
		accuracy: true,
		category: "Status",
		desc: "The user faints and sets Reflect, Light Screen, and Safeguard.",
		shortDesc: "User faints; sets screens/Safeguard for 5 turns.",
		id: "beskyttelsesnet",
		name: "beskyttelsesnet",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {mirror: 1, snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Geomancy', source);
			this.add('-anim', source, 'Memento', target);
		},
		onHit(target, source) {
			source.side.addSideCondition('lightscreen', source);
			source.side.addSideCondition('reflect', source);
			source.side.addSideCondition('safeguard', source);
		},
		selfdestruct: "ifHit",
		secondary: null,
		target: "self",
		type: "Dark",
	},
	// Cleo
	lovingembrace: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "This move has a 50% chance to infatuate the target.",
		shortDesc: "This move has a 50% chance to infatuate the target.",
		id: "lovingembrace",
		name: "Loving Embrace",
		isNonstandard: "Custom",
		pp: 25,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Wrap", target);
			this.add('-anim', source, "Liquidation", target);
			this.add('-anim', source, "Surf", target);
		},
		secondary: {
			chance: 50,
			volatileStatus: 'attract',
		},
		target: "normal",
		type: "Water",
	},
	// deg
	luciddreams: {
		accuracy: 75,
		category: "Status",
		desc: "The foe falls asleep and is inflicted with the effects of Nightmare and Leech Seed. The user loses 1/2 of their maximum HP unless this move had no effect.",
		shortDesc: "Loses 1/2 HP. Foe: sleep, Nightmare, Leech Seed.",
		id: "luciddreams",
		name: "Lucid Dreams",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, snatch: 1, reflectable: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dark Void', target);
			this.add('-anim', source, 'Night Shade', target);
		},
		onHit(target, source, move) {
			let hadEffect = false;
			if (target.trySetStatus('slp')) hadEffect = true;
			if (target.addVolatile('nightmare')) hadEffect = true;
			if (!target.hasType('Grass')) {
				if (target.addVolatile('leechseed')) hadEffect = true;
			}
			if (!hadEffect) {
				this.add('-fail', target);
			} else {
				this.damage(source.maxhp / 2, source, source, 'recoil');
			}
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
	// DragonWhale
	earthsblessing: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Sets Gravity, raises the user's Attack by 2 stages, and cure's the user's burn, paralysis, or poison. Fails if Gravity is already in effect.",
		shortDesc: "Sets Gravity, raises Attack by 2, cures status.",
		id: "earthsblessing",
		name: "Earth's Blessing",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Swords Dance', source);
			this.add('-anim', source, 'Wood Hammer', source);
		},
		onHit(pokemon, move) {
			if (this.field.pseudoWeather.gravity) return false;
			this.boost({atk: 2}, pokemon, pokemon, this.getActiveMove('EarthsBlessing'));
			this.field.addPseudoWeather('gravity');
			if (['', 'slp', 'frz'].includes(pokemon.status)) return;
			pokemon.cureStatus();
		},
		flags: {mirror: 1, snatch: 1},
		secondary: null,
		target: "self",
		type: "Ground",
		zMoveEffect: 'healhalf',
	},
	// duck
	holyduck: {
		accuracy: 95,
		basePower: 90,
		category: "Physical",
		desc: "If this attack hits, the effects of Reflect, Light Screen, and Aurora Veil end on the target's side of the field before damage is calculated.",
		shortDesc: "Destroys screens, unless the target is immune.",
		id: "holyduck",
		name: "Holy Duck!",
		isNonstandard: "Custom",
		pp: 5,
		priority: 1,
		flags: {mirror: 1, protect: 1, contact: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Extreme Speed', target);
			this.add('-anim', source, 'Feather Dance', target);
		},
		onTryHit(pokemon) {
			if (pokemon.runImmunity('Normal')) {
				pokemon.side.removeSideCondition('reflect');
				pokemon.side.removeSideCondition('lightscreen');
				pokemon.side.removeSideCondition('auroraveil');
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	// E4 Flint
	fangofthefireking: {
		accuracy: 90,
		basePower: 0,
		damage: 111,
		category: "Physical",
		desc: "Deals 111 HP of damage and burns the target. If the target already has a status ailment, it is replaced with a burn. Fails if the target is a Fire-type or if the user is not a Fire-type.",
		shortDesc: "Dmg=111HP; replace status w/burn; fail if foe=Fire.",
		id: "fangofthefireking",
		name: "Fang of the Fire King",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {mirror: 1, protect: 1, bite: 1},
		onTryMove(pokemon, target, move) {
			this.attrLastMove('[still]');
			if (!pokemon.hasType('Fire') || target.hasType('Fire')) {
				this.add('-fail', pokemon, 'move: Fang of the Fire King');
				return null;
			}
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Crunch', target);
			this.add('-anim', target, 'Searing Shot', target);
		},
		onHit(target, source) {
			target.setStatus('brn', source, null, true);
			// Cringy message
			if (this.random(5) === 1) this.add(`c|@E4 Flint|here's a __taste__ of my __firepower__ XD`);
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// explodingdaisies
	doom: {
		basePower: 100,
		accuracy: 100,
		category: "Special",
		desc: "Summons Sunny Day after doing damage.",
		shortDesc: "Summons Sunny Day after doing damage.",
		id: "doom",
		name: "DOOM!",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Eruption', target);
			this.add('-anim', source, 'Sunny Day', source);
		},
		onAfterMoveSecondarySelf() {
			this.field.setWeather('sunnyday');
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// Eien
	ancestralpower: {
		accuracy: true,
		category: "Status",
		desc: "The user's Attack and Special Attack are raised by one, it transforms into a different Pokemon, and it uses a move dependent on the Pokemon; Celebi (Future Sight), Jirachi (Doom Desire), Manaphy (Tail Glow), Shaymin (Seed Flare), or Victini (V-Create). Reverts to Mew and loses the initial raises of 1 stage to Attack and Special Attack at the end of the turn.",
		shortDesc: " For turn: transforms, boosts, uses linked move.",
		id: "ancestralpower",
		name: "Ancestral Power",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onHit(target, source, move) {
			let baseForme = source.template.id;
			/** @type {{[forme: string]: string}} */
			let formes = {
				celebi: 'Future Sight',
				jirachi: 'Doom Desire',
				manaphy: 'Tail Glow',
				shaymin: 'Seed Flare',
				victini: 'V-create',
			};
			let forme = Object.keys(formes)[this.random(5)];
			source.formeChange(forme, this.getAbility('psychicsurge'), true);
			this.boost({atk: 1, spa: 1}, source, source, move);
			this.useMove(formes[forme], source, target);
			this.boost({atk: -1, spa: -1}, source, source, move);
			source.formeChange(baseForme, this.getAbility('psychicsurge'), true);
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
	},
	// eternally
	quack: {
		accuracy: true,
		category: "Status",
		desc: "Boosts the user's Defense, Special Defense, and Speed by 1 stage.",
		shortDesc: "Raises the user's Def, Sp. Def, and Spe by 1.",
		id: "quack",
		name: "Quack",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Feather Dance', source);
			this.add('-anim', source, 'Aqua Ring', source);
		},
		boosts: {def: 1, spd: 1, spe: 1},
		secondary: null,
		target: "self",
		type: "Flying",
	},
	// EV
	evoblast: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "This move's type changes to match the user's primary type. This move is a physical attack if the user's Attack stat is greater than its Special Attack stat; otherwise, it is a special attack.",
		shortDesc: "Shares user's type. Physical if user's Atk > Sp. Atk.",
		id: "evoblast",
		name: "Evoblast",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onModifyMove(move, pokemon, target) {
			move.type = pokemon.types[0];
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Extreme Evoboost', source);
			switch (move.type) {
			case 'Fire':
				this.add('-anim', source, 'Flamethrower', target);
				break;
			case 'Electric':
				this.add('-anim', source, 'Thunderbolt', target);
				break;
			case 'Water':
				this.add('-anim', source, 'Bubblebeam', target);
				break;
			case 'Psychic':
				this.add('-anim', source, 'Psybeam', target);
				break;
			case 'Dark':
				this.add('-anim', source, 'Dark Pulse', target);
				break;
			case 'Grass':
				this.add('-anim', source, 'Solar Beam', target);
				break;
			case 'Ice':
				this.add('-anim', source, 'Ice Beam', target);
				break;
			case 'Fairy':
				this.add('-anim', source, 'Dazzling Gleam', target);
				break;
			}
		},
		onAfterMoveSecondarySelf(pokemon) {
			let stat = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy'][this.random(6)];
			/** @type {{[stat: string]: number}} */
			let boost = {};
			boost[stat] = 1;
			this.boost(boost, pokemon);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	// False
	frck: {
		accuracy: true,
		basePower: 0,
		category: "Physical",
		desc: "Does not check accuracy. KOes the foe. User faints afterwards if move hits.",
		shortDesc: "KOes foe. Always hits. User faints after on success.",
		id: "frck",
		name: "fr*ck",
		isNonstandard: "Custom",
		pp: 6,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-activate', source, 'move: Celebrate');
			this.add('-anim', source, 'Searing Sunraze Smash', target);
			this.add('-anim', source, 'Explosion', target);
		},
		onHit(target, source) {
			target.faint();
			source.faint();
		},
		secondary: null,
		target: "normal",
		type: "???",
	},
	// FOMG
	rickrollout: {
		accuracy: true,
		basePower: 140,
		category: "Physical",
		desc: "Raises the user's Speed by 2 stages and has a 30% chance to confuse the target.",
		shortDesc: "Raises Speed by 2; 30% chance to confuse target.",
		id: "rickrollout",
		name: "Rickrollout",
		isNonstandard: "Custom",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Rock Polish', source);
			this.add('-anim', source, 'Let\'s Snuggle Forever', target);
		},
		onHit() {
			let messages = ["SPL players don't want you to know about this secret",
				"North American player reveals the concerning secret how to make money with pokemon that will crack you up",
				"10 amazing facts about Zarel you have never heard of",
				"Veteran player shared his best team with a beginner - here's what happened after",
				"Use these 3 simple methods to gain 200+ rating in 10 minutes"][this.random(5)];

			this.add(`raw|<a href="https://www.youtube.com/watch?v=oHg5SJYRHA0"><b>${messages}</b></a>`);
		},
		self: {
			boosts: {
				spe: 2,
			},
		},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		isZ: "astleyiumz",
		target: "normal",
		type: "Rock",
	},
	// Forrce
	purplepills: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user gains a random typing and 3 moves based on that typing (2 special moves and 1 status move). The user's attacks deal damage based off the user's Special Defense. If used again, returns the user to its original moveset and typing. This move fails if the user is not Forrce.",
		shortDesc: "Forrce: Gains 3 random moves and typing.",
		id: "purplepills",
		name: "Purple Pills",
		isNonstandard: "Custom",
		pp: 15,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Swallow", source);
		},
		onTryHit(target, source) {
			if (source.name !== 'Forrce') {
				this.add('-fail', source);
				this.hint("Only Forrce can use Purple Pills.");
				return null;
			}
		},
		volatileStatus: 'purplepills',
		effect: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Purple Pills', '[silent]');
				this.add('-message', `${pokemon.name} swallowed some pills!`);
				const allTypes = ['Normal', 'Fire', 'Fighting', 'Water', 'Flying', 'Grass', 'Poison', 'Electric', 'Ground', 'Psychic', 'Rock', 'Ice', 'Bug', 'Dragon', 'Ghost', 'Dark', 'Steel', 'Fairy'];
				const type1 = allTypes[this.random(18)];
				const type2 = allTypes[this.random(18)];
				if (type1 === type2) {
					pokemon.types = [type1];
					this.add('-start', pokemon, 'typechange', `${type1}`);
				} else {
					pokemon.types = [type1, type2];
					this.add('-start', pokemon, 'typechange', `${type1}/${type2}`);
				}
				// track percentages to keep purple pills from resetting pp
				pokemon.m.ppPercentages = pokemon.moveSlots.map(m =>
					m.pp / m.maxpp
				);
				// Get all possible moves sorted for convience in coding
				let newMovep = [];
				let statMove = [], offMove1 = [], offMove2 = [];
				for (const id in this.data.Movedex) {
					const move = this.data.Movedex[id];
					if (id !== move.id) continue;
					if (move.isZ || move.isNonstandard || !move.isViable || move.id === 'batonpass') continue;
					if (move.type && !pokemon.types.includes(move.type)) continue;
					// Time to sort!
					if (move.category === 'Status') statMove.push(move.id);
					if (move.category === 'Special') {
						if (type1 === type2) {
							offMove1.push(move.id);
							offMove2.push(move.id);
						} else {
							if (move.type === type1) {
								offMove1.push(move.id);
							} else if (move.type === type2) {
								offMove2.push(move.id);
							}
						}
					}
				}
				const move1 = offMove1[this.random(offMove1.length)];
				offMove2 = offMove2.filter(move => move !== move1);
				if (!offMove2.length) offMove2 = ['revelationdance'];
				const move2 = offMove2[this.random(offMove2.length)];
				newMovep.push(move1);
				newMovep.push(move2);
				newMovep.push(!statMove.length ? 'moonlight' : statMove[this.random(statMove.length)]);
				newMovep.push('purplepills');
				// Replace Moveset
				pokemon.moveSlots = [];
				for (const [i, moveid] of newMovep.entries()) {
					const move = this.getMove(moveid);
					if (!move.id) continue;
					pokemon.moveSlots.push({
						move: move.name,
						id: move.id,
						// hacky way to reduce purple pill's PP
						pp: Math.floor(((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5) * (pokemon.m.ppPercentages ? pokemon.m.ppPercentages[i] : 1)),
						maxpp: ((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5),
						target: move.target,
						disabled: false,
						used: false,
						virtual: true,
					});
				}
			},
			onModifySpAPriority: 1,
			onModifySpA(spa, pokemon) {
				return pokemon.getStat('spd');
			},
			onRestart(pokemon) {
				this.add('-message', `${pokemon.name} feels better!`);
				delete pokemon.volatiles['purplepills'];
				this.add('-end', pokemon, 'Purple Pills', '[silent]');
				pokemon.types = ['Psychic'];
				this.add('-start', pokemon, 'typechange', 'Psychic');
				// track percentages to keep purple pills from resetting pp
				pokemon.m.ppPercentages = pokemon.moveSlots.slice().map(m => {
					return m.pp / m.maxpp;
				});
				// Update movepool
				let newMovep = ['moonlight', 'heartswap', 'batonpass', 'purplepills'];
				pokemon.moveSlots = [];
				for (const [i, moveid] of newMovep.entries()) {
					let move = this.getMove(moveid);
					if (!move.id) continue;
					pokemon.moveSlots.push({
						move: move.name,
						id: move.id,
						// hacky way to reduce purple pill's PP
						pp: Math.floor(((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5) * (pokemon.m.ppPercentages ? pokemon.m.ppPercentages[i] : 1)),
						maxpp: ((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5),
						target: move.target,
						disabled: false,
						used: false,
						virtual: true,
					});
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Poison",
	},
	// grimAuxiliatrix
	paintrain: {
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			let targetWeight = target.getWeight();
			let pokemonWeight = pokemon.getWeight();
			if (pokemonWeight > targetWeight * 5) {
				return 120;
			}
			if (pokemonWeight > targetWeight * 4) {
				return 100;
			}
			if (pokemonWeight > targetWeight * 3) {
				return 80;
			}
			if (pokemonWeight > targetWeight * 2) {
				return 60;
			}
			return 40;
		},
		category: "Physical",
		desc: "The power of this move depends on (user's weight / target's weight), rounded down. Power is equal to 120 if the result is 5 or more, 100 if 4, 80 if 3, 60 if 2, and 40 if 1 or less. Damage doubles and no accuracy check is done if the target has used Minimize while active. The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "Stronger if user is heavier; Heals 50% of damage.",
		id: "paintrain",
		name: "Pain Train",
		isNonstandard: "Custom",
		pp: 10,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Meteor Mash', target);
		},
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	// Hippopotas
	hazardpass: {
		accuracy: 100,
		category: "Status",
		pp: 20,
		desc: "The user sets 2 of Stealth Rock, Spikes (1 layer), Toxic Spikes (1 layer), and Sticky Web on the foe's side of the field and then switches out.",
		shortDesc: "Sets 2 random hazards, then switches out.",
		id: "hazardpass",
		name: "Hazard Pass",
		isNonstandard: "Custom",
		flags: {reflectable: 1, mirror: 1, authentic: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onHitSide(target, source) {
			// All possible hazards, and their maximum possible layer count
			/** @type {{[key: string]: number}} */
			let hazards = {stealthrock: 1, spikes: 3, toxicspikes: 2, stickyweb: 1};
			// Check how many layers of each hazard can still be added to the foe's side
			if (target.getSideCondition('stealthrock')) delete hazards.stealthrock;
			if (target.getSideCondition('spikes')) {
				hazards.spikes -= target.sideConditions['spikes'].layers;
				if (!hazards.spikes) delete hazards.spikes;
			}
			if (target.getSideCondition('toxicspikes')) {
				hazards.toxicspikes -= target.sideConditions['toxicspikes'].layers;
				if (!hazards.toxicspikes) delete hazards.toxicspikes;
			}
			if (target.getSideCondition('stickyweb')) delete hazards.stickyweb;
			// Create a list of hazards not yet at their maximum layer count
			let hazardTypes = Object.keys(hazards);
			// If there are no possible hazards, don't do anything
			if (!hazardTypes.length) return false;
			// Pick a random hazard, and set it
			let hazard1 = this.sample(hazardTypes);
			// Theoretically, this should always work
			this.add('-anim', source, this.getMove(hazard1).name, target);
			target.addSideCondition(hazard1, source, this.effect);
			// If that was the last possible layer of that hazard, remove it from our list of possible hazards
			if (hazards[hazard1] === 1) {
				hazardTypes.splice(hazardTypes.indexOf(hazard1), 1);
				// If there are no more hazards we can set, end early on a success
				if (!hazardTypes.length) return true;
			}
			// Set the last hazard and animate the switch
			let hazard2 = this.sample(hazardTypes);
			this.add('-anim', source, this.getMove(hazard2).name, target);
			target.addSideCondition(hazard2, source, this.effect);
			this.add('-anim', source, "Baton Pass", target);
		},
		selfSwitch: true,
		secondary: null,
		target: "foeSide",
		type: "Normal",
		zMoveBoost: {def: 1},
	},
	// Hipster Sigilyph
	mainstreamshock: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "This move's type effectiveness against Dark is changed to be super effective no matter what this move's type is.",
		shortDesc: "Super effective on Dark.",
		id: "mainstreamshock",
		name: "Mainstream Shock",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Psystrike", target);
		},
		ignoreImmunity: {'Psychic': true},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Dark') return 1;
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
	},
	// HoeenHero
	scriptedterrain: {
		accuracy: 100,
		category: "Status",
		desc: "Sets Scripted Terrain for 5 turns. The power of Bug type moves is boosted by 1.5, and there is a 5% chance for every move used to become Glitch Out instead. At the end of a turn, every Pokemon has a 5% chance to transform into a Missingno. with 3 random moves and Glitch Out. Switching out will restore the Pokemon to its normal state. This terrain affects floating Pokemon.",
		shortDesc: "5 turns: +Bug power, glitchy effects.",
		id: "scriptedterrain",
		name: "Scripted Terrain",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {nonsky: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Calm Mind', source);
			this.add('-anim', source, 'Geomancy', source);
		},
		terrain: 'scriptedterrain',
		effect: {
			duration: 5,
			durationCallback(source, effect) {
				if (source && source.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Bug') {
					this.debug('scripted terrain boost');
					return this.chainModify(1.5);
				}
			},
			onTryHitPriority: 4,
			onTryHit(target, source, effect) {
				if (!effect || effect.id === 'glitchout' || source.volatiles['glitchout']) return;
				if (this.random(20) === 1) {
					this.add('message', `${source.name}'s move was glitched by the Scripted Terrain!`);
					this.useMove('Glitch Out', source, source.side.foe.active[0]);
					return null;
				}
			},
			onStart(battle, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Scripted Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Scripted Terrain');
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onResidual() {
				this.eachEvent('Terrain');
			},
			onTerrain(pokemon) {
				if (pokemon.template.id === 'missingno') return;
				if (pokemon.fainted || !pokemon.hp) return;
				if (this.random(20) === 1) {
					this.debug('Scripted terrain corrupt');
					this.add('message', `${pokemon.name} was corrupted by a bug in the scripted terrain!`);
					// generate a movepool
					let moves = [];
					let pool = this.shuffle(Object.keys(this.data.Movedex));
					let metronome = this.getMove('metronome');
					for (let i of pool) {
						let move = this.getMove(i);
						if (i !== move.id) continue;
						if (move.isZ || move.isNonstandard) continue;
						if (metronome.noMetronome && metronome.noMetronome.includes(move.id)) continue;
						if (this.getMove(i).gen > this.gen) continue;
						moves.push(move);
						if (moves.length >= 3) break;
					}
					moves.push('glitchout');
					pokemon.formeChange('missingno');
					pokemon.moveSlots = [];
					for (let moveid of moves) {
						let move = this.getMove(moveid);
						if (!move.id) continue;
						pokemon.moveSlots.push({
							move: move.name,
							id: move.id,
							pp: 5,
							maxpp: 5,
							target: move.target,
							disabled: false,
							used: false,
							virtual: true,
						});
					}
				}
			},
			onEnd() {
				this.add('-fieldend', 'move: Scripted Terrain');
			},
		},
		secondary: null,
		target: "self",
		type: "Psychic",
	},
	// Used by HoeenHero's terrain
	glitchout: {
		accuracy: true,
		category: "Status",
		desc: "A random move is selected for use, other than After You, Assist, Baneful Bunker, Beak Blast, Belch, Bestow, Celebrate, Chatter, Copycat, Counter, Covet, Crafty Shield, Destiny Bond, Detect, Diamond Storm, Endure, Feint, Fleur Cannon, Focus Punch, Follow Me, Freeze Shock, Helping Hand, Hold Hands, Hyperspace Hole, Ice Burn, Instruct, King's Shield, Light of Ruin, Mat Block, Me First, Metronome, Mimic, Mind Blown, Mirror Coat, Mirror Move, Nature Power, Photon Geyser, Plasma Fists, Protect, Quash, Quick Guard, Rage Powder, Relic Song, Secret Sword, Shell Trap, Sketch, Sleep Talk, Snarl, Snatch, Snore, Spectral Thief, Spiky Shield, Spotlight, Steam Eruption, Struggle, Switcheroo, Techno Blast, Thief, Thousand Arrows, Thousand Waves, Transform, Trick, Trump Card, V-create, or Wide Guard. The selected move's Base Power is increased by 20.",
		shortDesc: "Uses a random move with Base Power +20.",
		id: "glitchout",
		name: "Glitch Out",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {},
		noMetronome: ['afteryou', 'assist', 'banefulbunker', 'beakblast', 'belch', 'bestow', 'celebrate', 'chatter', 'copycat', 'counter', 'covet', 'craftyshield', 'destinybond', 'detect', 'diamondstorm', 'dragonascent', 'endure', 'feint', 'fleurcannon', 'focuspunch', 'followme', 'freezeshock', 'helpinghand', 'holdhands', 'hyperspacefury', 'hyperspacehole', 'iceburn', 'instruct', 'kingsshield', 'lightofruin', 'matblock', 'mefirst', 'metronome', 'mimic', 'mindblown', 'mirrorcoat', 'mirrormove', 'naturepower', 'originpulse', 'photongeyser', 'plasmafists', 'precipiceblades', 'protect', 'quash', 'quickguard', 'ragepowder', 'relicsong', 'secretsword', 'shelltrap', 'sketch', 'sleeptalk', 'snarl', 'snatch', 'snore', 'spectralthief', 'spikyshield', 'spotlight', 'steameruption', 'struggle', 'switcheroo', 'technoblast', 'thief', 'thousandarrows', 'thousandwaves', 'transform', 'trick', 'trumpcard', 'vcreate', 'wideguard'],
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Bug Buzz', source);
			this.add('-anim', source, 'Metronome', source);
			source.addVolatile('glitchout');
		},
		onHit(target, source, effect) {
			let moves = [];
			for (let i in this.data.Movedex) {
				let move = this.data.Movedex[i];
				if (i !== move.id) continue;
				if (move.isZ || move.isNonstandard) continue;
				if (effect.noMetronome && effect.noMetronome.includes(move.id)) continue;
				if (this.getMove(i).gen > this.gen) continue;
				moves.push(move);
			}
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
			}
			if (!randomMove) {
				return false;
			}
			this.useMove(randomMove, target);
		},
		secondary: null,
		target: "self",
		type: "Bug",
	},
	// Hubriz
	flowertornado: {
		accuracy: 90,
		basePower: 95,
		category: "Special",
		desc: "Has a 20% chance to either poison the target or cause it to fall asleep.",
		shortDesc: "20% chance to either poison or sleep target.",
		id: "flowertornado",
		name: "Flower Tornado",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Petal Blizzard", target);
			this.add('-anim', source, "Leaf Tornado", target);
		},
		secondary: {
			chance: 20,
			onHit(target, source) {
				let result = this.random(2);
				if (result === 0) {
					target.trySetStatus('psn', source);
				} else {
					target.trySetStatus('slp', source);
				}
			},
		},
		target: "normal",
		type: "Grass",
	},
	// Hurl
	hurl: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Sets a layer of Toxic Spikes.",
		shortDesc: "Sets a layer of Toxic Spikes.",
		id: "hurl",
		name: "Hurl",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Gunk Shot', target);
		},
		onAfterMoveSecondarySelf(pokemon) {
			pokemon.side.foe.addSideCondition('toxicspikes');
		},
		secondary: null,
		target: "normal",
		type: "Poison",
	},
	// imagi
	delayedpromise: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "This move bypasses Baneful Bunker, Crafty Shield, Detect, King's Shield, Mat Block, Protect, Quick Guard, Substitute, Spiky Shield, and Wide Guard. The target's stat stages are set to 0, and the target's Speed is lowered by 1 after stats are reset. 75% chance to put the target to sleep.",
		shortDesc: "Foe: Resets stats; -1 Speed; 75% chance to sleep.",
		id: "delayedpromise",
		name: "Delayed Promise",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {authentic: 1, snatch: 1, reflectable: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Wish', source);
			this.add('-anim', source, 'Spite', target);
		},
		onHit(target, source) {
			target.clearBoosts();
			this.add('-clearboost', target);
			this.boost({spe: -1}, target, source);
		},
		secondary: {
			status: 'slp',
			chance: 75,
		},
		target: "normal",
		type: "Psychic",
	},
	// imas
	boi: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "The user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 33% recoil.",
		id: "boi",
		name: "B O I",
		isNonstandard: "Custom",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Supersonic Skystrike', target);
		},
		recoil: [33, 100],
		secondary: null,
		target: "normal",
		type: "Flying",
	},
	// Iyarito
	vbora: {
		accuracy: true,
		category: "Status",
		desc: "Cures the user's party of all status conditions, then poisons the user.",
		shortDesc: "Cures party's statuses, then poisons self.",
		id: "vbora",
		name: "Víbora",
		isNonstandard: "Custom",
		pp: 5,
		flags: {mirror: 1, snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Acid Armor', source);
		},
		onHit(pokemon, source, move) {
			//this.add('-activate', source, 'move: Víbora');
			let success = false;
			for (const ally of pokemon.side.pokemon) {
				if (ally.cureStatus()) success = true;
			}
			if (pokemon.setStatus('psn', pokemon)) success = true;
			return success;
		},
		secondary: null,
		target: "allyTeam",
		type: "Poison",
	},
	// jdarden
	wyvernswail: {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "If both the user and the target have not fainted, the target is forced to switch out and be replaced with a random unfainted ally. This effect fails if the target used Ingrain previously, has the Suction Cups Ability, or this move hit a substitute.",
		shortDesc: "Forces the target to switch to a random ally.",
		id: "wyvernswail",
		name: "Wyvern's Wail",
		isNonstandard: "Custom",
		pp: 15,
		priority: -6,
		flags: {protect: 1, mirror: 1, sound: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Whirlwind', target);
		},
		forceSwitch: true,
		target: "normal",
		type: "Flying",
	},
	// Kaiju Bunny
	bestialstrike: {
		accuracy: 100,
		basePower: 150,
		basePowerCallback(pokemon, target, move) {
			return move.basePower * pokemon.hp / pokemon.maxhp;
		},
		category: "Physical",
		desc: "Power is equal to (user's current HP * 150 / user's maximum HP), rounded down, but not less than 1.",
		shortDesc: "Less power as user's HP decreases.",
		id: "bestialstrike",
		name: "Bestial Strike",
		isNonstandard: "Custom",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Outrage', target);
		},
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		secondary: null,
		target: "normal",
		type: "Flying",
	},
	// kalalokki
	maelstrm: {
		accuracy: 85,
		basePower: 100,
		category: "Special",
		desc: "Prevents the target from switching for four or five turns (seven turns if the user is holding Grip Claw). Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. Both of these effects persist for their normal duration even if the user switches out or faints. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. The effect ends if the target leaves the field or uses Rapid Spin or Substitute successfully. This effect is not stackable or reset by using this or another binding move.",
		shortDesc: "Traps/damages for 4-5 turns, even if user returns.",
		id: "maelstrm",
		name: "Maelström",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: 'maelstrm',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dark Void', target);
			this.add('-anim', source, 'Surf', target);
		},
		effect: {
			duration: 5,
			durationCallback(target, source) {
				if (source.hasItem('gripclaw')) {
					this.debug('maelstrm grip claw duration boost');
					return 8;
				}
				return this.random(5, 7);
			},
			onStart() {
				this.add('-message', 'It became trapped in an enormous maelström!');
			},
			onResidualOrder: 11,
			onResidual(pokemon) {
				if (this.effectData.source.hasItem('bindingband')) {
					this.debug('maelstrm binding band damage boost');
					this.damage(pokemon.maxhp / 6);
				} else {
					this.damage(pokemon.maxhp / 8);
				}
			},
			onEnd() {
				this.add('-message', 'The maelström dissipated.');
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap();
			},
		},
		secondary: null,
		target: "normal",
		type: "Water",
	},
	// Kay
	inkzooka: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Lowers the user's Defense, Special Defense, and Speed by 1 stage.",
		shortDesc: "Lowers the user's Def, Sp. Def, and Spe by 1.",
		id: "inkzooka",
		name: "Inkzooka",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Never Ending Nightmare', target);
		},
		self: {
			boosts: {
				def: -1,
				spd: -1,
				spe: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
	},
	// KingSwordYT
	dragonwarriortouch: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. Raises the user's Attack by 1 stage.",
		shortDesc: "User recovers 50% of the damage dealt; Atk +1.",
		id: "dragonwarriortouch",
		name: "Dragon Warrior Touch",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, punch: 1, contact: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Outrage', target);
			this.add('-anim', source, 'Drain Punch', target);
		},
		self: {
			boosts: {
				atk: 1,
			},
		},
		drain: [1, 2],
		target: "normal",
		type: "Fighting",
	},
	// Level 51
	nextlevelstrats: {
		accuracy: true,
		category: "Status",
		desc: "The user gains 5 levels when using this move, which persist upon switching out.",
		shortDesc: "User gains 5 levels.",
		id: "nextlevelstrats",
		name: "Next Level Strats",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Nasty Plot", target);
		},
		onHit(pokemon) {
			const template = pokemon.template;
			// @ts-ignore
			pokemon.level += 5;
			pokemon.set.level = pokemon.level;
			pokemon.formeChange(template);

			pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
			this.add('detailschange', pokemon, pokemon.details);

			const newHP = Math.floor(Math.floor(2 * template.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
			pokemon.hp = newHP - (pokemon.maxhp - pokemon.hp);
			pokemon.maxhp = newHP;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');

			this.add('-message', `${pokemon.name} advanced 5 levels! It is now level ${pokemon.level}!`);
		},
		secondary: null,
		target: "self",
		type: "Normal",

	},
	// LifeisDANK
	barfight: {
		accuracy: 100,
		basePower: 10,
		category: "Physical",
		desc: "Raises both the user's and the target's Attack by 3 stages, lowers the Defense of both by 3 stages, confuses both Pokemon, and has a 100% chance to cause the target to flinch.",
		shortDesc: "+3 Atk, -3 Def, confusion to user & target. Priority.",
		id: "barfight",
		name: "Bar Fight",
		isNonstandard: "Custom",
		pp: 10,
		priority: 3,
		flags: {protect: 1, mirror: 1, contact: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Fake Out", target);
			this.add('-anim', source, "Feather Dance", target);
			return this.runEvent('StallMove', source);
		},
		onHit(target, source) {
			source.addVolatile('stall');
			this.boost({atk: 3, def: -3}, target);
			this.boost({atk: 3, def: -3}, source);
			target.addVolatile('confusion');
			source.addVolatile('confusion');
			target.addVolatile('flinch');
		},
		secondary: null,
		target: "normal",
		type: "Flying",
	},
	// Lionyx
	letitgo: {
		accuracy: 95,
		basePower: 110,
		category: "Special",
		desc: "Summons hail. Has a 15% chance to lower the target's Special Defense, and a 5% chance to freeze it.",
		shortDesc: "Summons hail; 15% to lower SpD, 5% to freeze.",
		id: "letitgo",
		name: "Let it Go",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Ice Beam", target);
			this.add('-anim', source, "Subzero Slammer", target);
			this.add('-anim', source, "Hyper Voice", target);
		},
		secondaries: [
			{
				chance: 5,
				status: 'frz',
			}, {
				chance: 15,
				boosts: {
					spd: -1,
				},
			},
		],
		onAfterMoveSecondarySelf() {
			this.field.setWeather('hail');
		},
		target: "normal",
		type: "Ice",
	},
	// Lost Seso
	shuffleramendance: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "This move's type effectiveness is inverted, meaning that it's super effective on Water-types but not very effective on Grass-types, and so forth. 20% chance to paralyze the target.",
		shortDesc: "Type effectiveness is inverted; 20% par.",
		id: "shuffleramendance",
		name: "Shuffle Ramen Dance",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, dance: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Outrage', target);
		},
		onEffectiveness(typeMod, target) {
			return -typeMod;
		},
		secondary: {
			status: 'par',
			chance: 20,
		},
		target: "normal",
		type: "Fire",
		zMovePower: 160,
	},
	// MacChaeger
	naptime: {
		accuracy: true,
		category: "Status",
		desc: "The user falls asleep for the next turn, restoring 50% of its HP and curing itself of any major status condition. If the user falls asleep in this way, all other active Pokemon that are not asleep or frozen also try to use Nap Time. Fails if the user has full HP, if the user is already asleep, or if another effect is preventing sleep.",
		shortDesc: "Active Pokemon sleep 1 turn, restoring HP/status.",
		id: "naptime",
		name: "Nap Time",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onTryMove(pokemon) {
			this.attrLastMove('[still]');
			if (pokemon.hp < pokemon.maxhp && pokemon.status !== 'slp' && !pokemon.hasAbility('comatose')) return;
			this.add('-fail', pokemon);
			this.hint("Nap Time fails if the user has full health, is already asleep, or has Comatose.");
			return null;
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Rest", target);
			this.add('-anim', source, "Aromatic Mist", target);
		},
		onHit(target, source, move) {
			let napWeather = this.field.pseudoWeather['naptime'];
			// Trigger sleep clause if not the original user
			if (!target.setStatus('slp', napWeather.source, move)) return false;
			target.statusData.time = 2;
			target.statusData.startTime = 2;
			this.heal(target.maxhp / 2); // Aesthetic only as the healing happens after you fall asleep in-game
			this.add('-status', target, 'slp', '[from] move: Rest');
			if (napWeather.source === target) {
				for (const curMon of this.getAllActive()) {
					if (curMon === source) continue;
					if (curMon.status !== 'slp' && curMon.status !== 'frz' && !curMon.hasAbility('comatose')) {
						this.add('-anim', source, "Yawn", curMon);
						this.useMove(move, curMon, curMon, move);
					}
				}
			}
			this.field.removePseudoWeather('naptime');
		},
		pseudoWeather: 'naptime',
		effect: {
			duration: 1,
		},
		target: "self",
		type: "Fairy",
		zMoveEffect: 'clearnegativeboosts',
	},
	// MajorBowman
	blazeofglory: {
		accuracy: true,
		basePower: 0,
		damageCallback(pokemon, target) {
			let damage = pokemon.hp;
			pokemon.faint();
			if (target.volatiles['banefulbunker'] || target.volatiles['kingsshield'] || target.side.sideConditions['matblock'] || target.volatiles['protect'] || target.volatiles['spikyshield'] || target.volatiles['lilypadshield']) {
				this.add('-zbroken', target);
				return Math.floor(damage / 4);
			}
			return damage;
		},
		category: "Physical",
		desc: "The user's HP is restored to maximum, and the user then faints. The target then takes damage equal to the amount of HP the user lost. This move does not check accuracy.",
		shortDesc: "Does damage equal to user's max. HP. User faints.",
		id: "blazeofglory",
		name: "Blaze of Glory",
		isNonstandard: "Custom",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Recover", source);
			this.heal(source.maxhp, source, source, this.getActiveMove('Blaze of Glory'));
			this.add('-anim', source, "Final Gambit", target);
		},
		selfdestruct: "ifHit",
		isZ: "victiniumz",
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// martha
	crystalboost: {
		accuracy: 90,
		basePower: 75,
		category: "Special",
		desc: "Has a 50% chance to raise the user's Special Attack by 1 stage.",
		shortDesc: "50% chance to raise the user's Sp. Atk. by 1.",
		id: "crystalboost",
		name: "Crystal Boost",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Power Gem", target);
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
		type: "Rock",
	},
	// Marty
	typeanalysis: {
		accuracy: true,
		category: "Status",
		desc: "If the user is a Silvally, its item becomes a random Memory whose type matches one of the target's weaknesses, it changes forme, and it uses Multi-Attack. This move and its effects ignore the Abilities of other Pokemon. Fails if the target has no weaknesses or if the user's species is not Silvally.",
		shortDesc: "Changes user/move type to a weakness of target.",
		id: "typeanalysis",
		name: "Type Analysis",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {authentic: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Conversion", source);
		},
		onHit(target, source) {
			if (source.baseTemplate.baseSpecies !== 'Silvally') return false;
			let targetTypes = target.getTypes(true).filter(type => type !== '???');
			if (!targetTypes.length) {
				if (target.addedType) {
					targetTypes = ['Normal'];
				} else {
					return false;
				}
			}
			let weaknesses = [];
			for (let type in this.data.TypeChart) {
				let typeMod = this.getEffectiveness(type, targetTypes);
				if (typeMod > 0 && this.getImmunity(type, target)) weaknesses.push(type);
			}
			if (!weaknesses.length) {
				return false;
			}
			let randomType = this.sample(weaknesses);
			source.setItem(randomType + 'memory');
			this.add('-item', source, source.getItem(), '[from] move: Type Analysis');
			let template = this.getTemplate('Silvally-' + randomType);
			source.formeChange(template, this.getAbility('rkssystem'), true);
			let move = this.getActiveMove('multiattack');
			move.basePower = 80;
			this.useMove(move, source, target);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMoveEffect: 'heal',
	},
	// Meicoo
	scavengesu: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Lowers the user's Attack and Special Attack by two stages, and then swaps all of its stat changes with the target.",
		shortDesc: "Harshly lowers own Atk/SpA; swaps stats with opp.",
		id: "scavengesu",
		name: "/scavenges u",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Imprison", source);
			this.add('-anim', source, "Miracle Eye", target);
		},
		onHit(target, source) {
			this.boost({atk: -2, spa: -2}, source, source, this.getActiveMove('/scavenges u'));
			let targetBoosts = {};
			let sourceBoosts = {};

			for (let i in target.boosts) {
				// @ts-ignore
				targetBoosts[i] = target.boosts[i];
				// @ts-ignore
				sourceBoosts[i] = source.boosts[i];
			}

			target.setBoost(sourceBoosts);
			source.setBoost(targetBoosts);

			this.add(`c|%Meicoo|cool quiz`);

			this.add('-swapboost', source, target, '[from] move: /scavenges u');
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
	},
	// Megazard
	tippingover: {
		accuracy: 100,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			return move.basePower + 20 * pokemon.positiveBoosts();
		},
		category: "Physical",
		desc: "Power rises by 20 for each of the user's positive stat stage changes. The user loses any defensive boosts not from Stockpile.",
		shortDesc: "+20 power per boost. Removes non-Stockpile boosts.",
		id: "tippingover",
		name: "Tipping Over",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Dragon Hammer", target);
			this.add('-anim', target, "Earthquake", target);
		},
		onHit(target, source, move) {
			let stockpileLayers = 0;
			if (source.volatiles['stockpile']) stockpileLayers = source.volatiles['stockpile'].layers;
			let boosts = {};
			if (source.boosts.def > stockpileLayers) boosts.def = stockpileLayers - source.boosts.def;
			if (source.boosts.spd > stockpileLayers) boosts.spd = stockpileLayers - source.boosts.spd;
			if (boosts.def || boosts.spd) this.boost(boosts, source, source, move);
		},
		secondary: null,
		target: "normal",
		type: "???",
	},
	// MicktheSpud
	cyclonespin: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "If this move is successful and the user has not fainted, the effects of Leech Seed and binding moves end for the user, and all hazards are removed from the user's side of the field.",
		shortDesc: "Frees user from hazards/partial trap/Leech Seed.",
		id: "cyclonespin",
		name: "Cyclone Spin",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {mirror: 1, protect: 1, contact: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Rapid Spin", target);
		},
		self: {
			onHit(pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Cyclone Spin', '[of] ' + pokemon);
				}
				let sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.getEffect(condition).name, '[from] move: Cyclone Spin', '[of] ' + pokemon);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
	},
	// Mitsuki
	pythonivy: {
		accuracy: 95,
		basePower: 110,
		category: "Special",
		desc: "Lowers the user's Special Attack, Special Defense, and Speed by 1 stage.",
		shortDesc: "Lowers the user's Sp. Atk, Sp. Def. and Spe by 1.",
		id: "pythonivy",
		name: "Python Ivy",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Leaf Tornado", target);
			this.add('-anim', source, "Leaf Storm", target);
		},
		self: {
			boosts: {
				spa: -1,
				spd: -1,
				spe: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Grass",
	},
	// moo
	proteinshake: {
		accuracy: true,
		category: "Status",
		desc: "The user's Attack, Defense, and Speed are boosted by 1 stage. The user also gains 100kg of weight.",
		shortDesc: "+1 Atk, Def, and Spe. User gains 100kg.",
		id: "proteinshake",
		name: "Protein Shake",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Milk Drink", source);
		},
		volatileStatus: 'proteinshake',
		effect: {
			onStart(pokemon) {
				this.effectData.multiplier = 1;
				this.add('-start', pokemon, 'Protein Shake', '[silent]');
			},
			onRestart(pokemon) {
				this.effectData.multiplier++;
				this.add('-start', pokemon, 'Protein Shake', '[silent]');
			},
			onModifyWeightPriority: 1,
			onModifyWeight(weight, pokemon) {
				if (this.effectData.multiplier) {
					weight += this.effectData.multiplier * 100;
					return weight;
				}
			},
		},
		boosts: {atk: 1, def: 1, spe: 1},
		secondary: null,
		target: "self",
		type: "Normal",
	},
	// Morfent
	e: {
		accuracy: true,
		category: "Status",
		desc: "Sets Trick Room for 5 turns and raises the user's Attack by 1 stage.",
		shortDesc: "User Attack +1; sets Trick Room.",
		id: "e",
		name: "E",
		isNonstandard: "Custom",
		pp: 5,
		priority: -6,
		onModifyMove(move) {
			if (!this.field.pseudoWeather.trickroom) {
				move.pseudoWeather = 'trickroom';
			}
		},
		flags: {snatch: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Recover", source);
			this.add('-anim', source, "Nasty Plot", source);
		},
		boosts: {
			atk: 1,
		},
		secondary: null,
		target: "self",
		type: "Ghost",
	},
	// Used for nui's ability
	prismaticterrain: {
		accuracy: true,
		category: "Status",
		desc: "For 5 turns, the terrain becomes Prismatic Terrain. During the effect, the power of Ice-type attacks is multiplied by 0.5, even if the user is not grounded. Hazards are removed and cannot be set while Prismatic Terrain is active. Fails if the current terrain is Prismatic Terrain.",
		shortDesc: "5 turns. No hazards,-Ice power even if floating.",
		id: "prismaticterrain",
		name: "Prismatic Terrain",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {},
		terrain: 'prismaticterrain',
		effect: {
			duration: 5,
			durationCallback(source, effect) {
				if (source && source.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onTryMove(target, source, move) {
				let hazardMoves = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'hazardpass', 'beskyttelsesnet', 'bringerofdarkness', 'soulbend', 'smokebomb', 'hurl'];
				if (hazardMoves.includes(move.id)) {
					this.add('-message', `Prismatic Terrain prevented ${move.name} from completing!`);
					return false;
				}
			},
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Ice') {
					this.debug('prismatic terrain weaken');
					return this.chainModify(0.5);
				}
			},
			onStart(battle, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Prismatic Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Prismatic Terrain');
				}
				let removeAll = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				let silentRemove = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist'];
				for (const sideCondition of removeAll) {
					if (source.side.foe.removeSideCondition(sideCondition)) {
						if (!(silentRemove.includes(sideCondition))) this.add('-sideend', source.side.foe, this.getEffect(sideCondition).name, '[from] move: Prismatic Terrain', '[of] ' + source);
					}
					if (source.side.removeSideCondition(sideCondition)) {
						if (!(silentRemove.includes(sideCondition))) this.add('-sideend', source.side, this.getEffect(sideCondition).name, '[from] move: Prismatic Terrain', '[of] ' + source);
					}
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd() {
				this.add('-fieldend', 'move: Prismatic Terrain');
			},
		},
		secondary: null,
		target: "self",
		type: "Fairy",
	},
	// nui
	pyramidingsong: {
		accuracy: 100,
		category: "Status",
		desc: "If the target has not fainted, both the user and the target are forced to switch out and be replaced with a chosen unfainted ally. The target's replacement has its Speed lowered by 1 stage. Fails if either Pokemon is under the effect of Ingrain or Suction Cups.",
		shortDesc: "Both Pokemon switch. Opp. replacement: Spe -1.",
		id: "pyramidingsong",
		name: "Pyramiding Song",
		isNonstandard: "Custom",
		pp: 20,
		priority: -6,
		flags: {mirror: 1, protect: 1, authentic: 1, sound: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Freeze Dry", target);
			this.add('-anim', source, "Mist", target);
		},
		onTryHit(target, source, move) {
			target.side.addSlotCondition(target, 'pyramidingsong');
		},
		onHit(target, source, move) {
			if (this.runEvent('DragOut', source, target, move)) {
				source.forceSwitchFlag = true;
			}
		},
		effect: {
			duration: 1,
			onSwitchIn(pokemon) {
				this.boost({spe: -1}, pokemon, pokemon.side.foe.active[0], this.getActiveMove('pyramidingsong'));
			},
		},
		forceSwitch: true,
		secondary: null,
		target: "normal",
		type: "Water",
		zMoveEffect: "boostreplacement",
	},
	// OM
	omboom: {
		accuracy: 95,
		basePower: 110,
		category: "Physical",
		desc: "Has a 50% chance to raise the user's Speed by 2 stages.",
		shortDesc: "Has 50% chance to raise the user's Speed by 2.",
		id: "omboom",
		name: "OM Boom",
		isNonstandard: "Custom",
		pp: 15,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Fire Lash", target);
			this.add('-anim', source, "Heat Crash", target);
		},
		onHit() {
			this.add(`c|@OM|Bang Bang`);
		},
		secondary: {
			chance: 50,
			self: {
				boosts: {
					spe: 2,
				},
			},
		},
		target: "normal",
		type: "Fire",
	},
	// Osiris
	nightmarch: {
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			let faintedmons = 0;
			for (const ally of pokemon.side.pokemon) {
				if (ally.fainted || !ally.hp) faintedmons += 20;
			}
			for (const foes of target.side.pokemon) {
				if (foes.fainted || !foes.hp) faintedmons += 20;
			}
			return move.basePower + faintedmons;
		},
		accuracy: 100,
		category: "Physical",
		desc: "Power is equal to 60+(20*X), where X is the total number of fainted Pokemon on both the user's team and on the opponent's team.",
		shortDesc: "+20 power for each fainted ally or foe.",
		id: "nightmarch",
		name: "Night March",
		isNonstandard: "Custom",
		pp: 5,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Nightmare", target);
			this.add('-anim', source, "Moongeist Beam", target);
			this.add('-anim', source, "Stomping Tantrum", target);
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
	// Overneat
	totalleech: {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "totalleech",
		name: "Total Leech",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Leech Life", target);
		},
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Fairy",
	},
	// Pablo
	jailshell: {
		accuracy: 90,
		basePower: 90,
		category: "Special",
		desc: "This move has a 50% change to paralyze the target and prevents the target from switching out or using any moves that the user also knows while the user is active.",
		shortDesc: "50% chance to paralyze. Traps and imprisons.",
		id: "jailshell",
		name: "Jail Shell",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Anchor Shot", target);
		},
		onHit(target, source, move) {
			if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
			source.addVolatile('imprison', source, move);
		},
		secondary: {
			chance: 50,
			status: 'par',
		},
		target: "normal",
		type: "Normal",
	},
	// Paradise
	corrosivetoxic: {
		accuracy: true,
		category: "Status",
		desc: "Badly poisons the target, even if they are Poison-type or Steel-type. This move does not check accuracy.",
		shortDesc: "Badly poisons the target, regardless of type.",
		id: "corrosivetoxic",
		name: "Corrosive Toxic",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Toxic", target);
		},
		onTryHit(target, source, move) {
			// hacky way of forcing toxic to effect poison / steel types without corrosion usage
			if (target.volatiles['substitute'] && !move.infiltrates) return;
			if (target.hasType('Steel') || target.hasType('Poison')) {
				if (target.status) return;
				let status = this.getEffect(move.status);
				target.status = status.id;
				target.statusData = {id: status.id, target: target, source: source, stage: 0};
				this.add('-status', target, target.status);
				move.status = undefined;
			}
		},
		status: 'tox',
		secondary: null,
		target: "normal",
		type: "Poison",
	},
	// pluviometer
	grammarhammer: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "100% chance to burn the target.",
		shortDesc: "100% chance to burn the target.",
		id: "grammarhammer",
		name: "Grammar Hammer",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hammer Arm", target);
		},
		onHit(target, source) {
			if (target.name === 'HoeenHero') {
				this.add(`c|@pluviometer|HoennHero*`);
				this.add(`c|&HoeenHero|I can speel`);
			}
		},
		secondary: {
			chance: 100,
			status: 'brn',
		},
		target: "normal",
		type: "Ghost",
	},
	// ptoad
	lilypadshield: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user is protected from most moves made by other Pokemon during this turn, and if a Pokemon makes contact with the user, the user restores 1/4 of its maximum HP, rounded half up. This move has a 1/X chance of being successful, where X starts at 1 and doubles each time this move is successfully used. X resets to 1 if this move fails, if the user's last move used is not Baneful Bunker, Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, Wide Guard, or this move, or if it was one of those moves and the user's protection was broken. Fails if the user moves last this turn.",
		shortDesc: "Protects from moves. Contact: restores 25% HP.",
		id: "lilypadshield",
		name: "Lilypad Shield",
		isNonstandard: "Custom",
		pp: 10,
		priority: 4,
		flags: {heal: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Spiky Shield", source);
		},
		stallingMove: true,
		volatileStatus: 'lilypadshield',
		onTryHit(target, source, move) {
			return !!this.willAct() && this.runEvent('StallMove', target);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (move.isZ) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				this.add('-activate', target, 'move: Protect');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (move.flags['contact']) {
					this.heal(target.maxhp / 4, target, target);
				}
				return null;
			},
			onHit(target, source, move) {
				if (move.isZPowered && move.flags['contact']) {
					this.heal(target.maxhp / 4, target, target);
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Grass",
	},
	// Psynergy
	resolve: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Speed by 1 stage. Gives Focus Energy",
		shortDesc: "Raises user's Speed by 1; Focus Energy.",
		id: "resolve",
		name: "Resolve",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Acupressure", source);
			this.add('-anim', source, "Flare Blitz", source);
		},
		onHit(target, source) {
			source.addVolatile('focusenergy', source);
		},
		boosts: {
			spe: 1,
		},
		target: "self",
		type: "Fighting",
	},
	// Quite Quiet
	literallycheating: {
		accuracy: true,
		category: "Status",
		desc: "For seven turns, any Pokemon that has one of their stats boosted through any manner loses all PP on the last move they used.",
		shortDesc: "7 turns: boosting stat: lose all PP from last move.",
		id: "literallycheating",
		name: "Literally Cheating",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {},
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Genesis Supernova", source);
		},
		pseudoWeather: 'literallycheating',
		effect: {
			duration: 7,
			onBoost(boost, target, source, effect) {
				let positiveBoost = false;
				let values = Object.values(boost);
				for (let i of values) {
					if (i !== undefined && i > 0) {
						positiveBoost = true;
						break;
					}
				}
				if (!positiveBoost || !target.lastMove) return;
				for (const moveSlot of target.moveSlots) {
					if (moveSlot.id === target.lastMove.id) {
						target.deductPP(moveSlot.id, moveSlot.pp);
					}
				}
				this.add('-activate', target, 'move: Literally Cheating', target.lastMove.name, target.lastMove.pp);
				this.add('-message', `${target.name} lost all PP for the move ${target.lastMove.name}!`);
			},
			onStart(battle, source, effect) {
				this.add('-fieldstart', 'move: Literally Cheating');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd() {
				this.add('-fieldend', 'move: Literally Cheating');
			},
		},
		secondary: null,
		target: "all",
		type: "Ghost",
	},
	// Rory Mercury
	switchoff: {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Before doing damage, the target's stat boosts are inverted. Ignores Ground-type immunity. The user switches out after damaging the target.",
		shortDesc: "Hits Ground. Inverts target's boosts, then switches.",
		id: "switchoff",
		name: "Switch Off",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Topsy-Turvy", target);
			this.add('-anim', source, "Zing Zap", target);
		},
		onTryHit(target, source, move) {
			let success = false;
			for (let i in target.boosts) {
				// @ts-ignore
				if (target.boosts[i] === 0) continue;
				// @ts-ignore
				target.boosts[i] = -target.boosts[i];
				success = true;
			}
			if (!success) return;
			this.add('-invertboost', target, '[from] move: Switch Off');
		},
		ignoreImmunity: {'Electric': true},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Electric",
	},
	// Saburo
	soulbend: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Speed by 1 stage. Has a 10% chance to summon either Reflect or Light Screen.",
		shortDesc: "Atk, Spe +1; 10% chance to set one screen.",
		id: "soulbend",
		name: "Soulbend",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Refresh", source);
			this.add('-anim', source, "Geomancy", source);
		},
		boosts: {
			atk: 1,
			spe: 1,
		},
		secondary: {
			chance: 10,
			onHit(target, source) {
				let result = this.random(2);
				if (result === 0) {
					source.side.addSideCondition('reflect', source);
				} else {
					source.side.addSideCondition('lightscreen', source);
				}
			},
		},
		target: "self",
		type: "Psychic",
	},
	// SamJo
	thicc: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and accuracy by 1 stage.",
		shortDesc: "Raises the user's Attack and accuracy by 1.",
		id: "thicc",
		name: "Thicc",
		isNonstandard: "Custom",
		pp: 15,
		priority: 0,
		flags: {snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Hone Claws", source);
		},
		boosts: {
			atk: 1,
			accuracy: 1,
		},
		secondary: null,
		target: "self",
		type: "Ice",
	},
	// SamJo Z-Move
	extrathicc: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and accuracy by 1 stage. Summons Hail and Aurora Veil.",
		shortDesc: "User's atk and acc +1. Sets Hail and Aurora Veil.",
		id: "extrathicc",
		name: "Extra T h i c c",
		isNonstandard: "Custom",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Hone Claws", source);
			this.add('-anim', source, "Extreme Evoboost", source);
			this.add('-anim', source, "Blizzard", source);
		},
		onHit(target, source) {
			this.field.setWeather('hail');
			if (this.field.isWeather('hail')) source.side.addSideCondition('auroraveil', source);
			this.add('-message', source.name + ' became extra thicc!');
		},
		boosts: {
			atk: 1,
			accuracy: 1,
		},
		isZ: "thicciniumz",
		secondary: null,
		target: "self",
		type: "Ice",
	},
	// Scotteh
	geomagneticstorm: {
		accuracy: 100,
		basePower: 140,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "geomagneticstorm",
		name: "Geomagnetic Storm",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Discharge", target);
		},
		secondary: null,
		target: "allAdjacent",
		type: "Electric",
	},
	// Shiba
	goinda: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 2 stages and Speed by 1 stage.",
		shortDesc: "Raises the user's Attack by 2 and Speed by 1.",
		id: "goinda",
		name: "GO INDA",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Swords Dance", source);
			this.add('-anim', source, "Sacred Fire", source);
		},
		boosts: {
			atk: 2,
			spe: 1,
		},
		target: "self",
		type: "Flying",
	},
	// Slowbroth
	alienwave: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, slower Pokemon move first. Psychic-type attacks can hit if the target is a Dark-type.",
		shortDesc: "Creates Trick Room; 5 turns: Psychic hits Dark.",
		id: "alienwave",
		name: "Alien Wave",
		isNonstandard: "Custom",
		pp: 10,
		priority: -7,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Telekinesis", source);
			this.add('-anim', source, "Trick Room", source);
		},
		pseudoWeather: 'alienwave',
		effect: {
			duration: 5,
			onStart(target, source) {
				this.add('-fieldstart', 'move: Alien Wave');
				this.add('-message', `Psychic-type attacks can hit Dark-type Pokemon!`);
			},
			onNegateImmunity(pokemon, type) {
				if (pokemon.hasType('Dark') && type === 'Psychic') return false;
			},
			// Speed modification is changed in Pokemon.getActionSpeed() in mods/seasonal/scripts.js
			onResidualOrder: 23,
			onEnd() {
				this.add('-fieldend', 'move: Alien Wave');
				this.add('-message', `Psychic-type attacks can no longer hit Dark-type Pokemon.`);
			},
		},
		secondary: null,
		target: "all",
		type: "Normal",
	},
	// Snaquaza
	fakeclaim: {
		accuracy: true,
		category: "Physical",
		basePower: 1,
		desc: "The user creates a substitute to take its place in battle. This substitute is a Pokemon selected from a broad set of Random Battle-eligible Pokemon able to learn the move chosen as this move's base move. Upon the substitutes creation, this Pokemon's ability is suppressed until it switches out. The substitute Pokemon is generated with a Random Battle moveset with maximum PP that is added (except for duplicates) to the user's moveset; these additions are removed when this substitute is no longer active. The substitute uses its species's base stats, types, ability, and weight but retains the user's max HP, stat stages, gender, level, status conditions, trapping, binding, and pseudo-statuses such as confusion. Its HP is 100% of the user's maximum HP. When this substitute falls to zero HP, it breaks, and the user reverts to the state in which it used this move. This substitute absorbs indirect damage and authentic moves but does not reset the counter of bad poison when broken and cannot be transfered through Baton Pass. Transforming into this substitute will not fail. If the user switches out while the substitute is up, the substitute will be removed and the user will revert to the state in which it used this move. This move's properties are based on the move Fake Claim is inheriting from.",
		shortDesc: "Uses a Random Battle Pokemon as a Substitute.",
		id: "fakeclaim",
		name: "Fake Claim",
		isNonstandard: "Custom",
		pp: 1,
		priority: 0,
		flags: {},
		onModifyMove(move) {
			// @ts-ignore Hack for Snaquaza's Z move
			move.type = move.baseMove ? move.baseMove.type : move.type;
			// @ts-ignore Hack for Snaquaza's Z move
			move.basePower = move.baseMove ? move.baseMove.basePower : move.basePower;
			// @ts-ignore Hack for Snaquaza's Z move
			move.category = move.baseMove ? move.baseMove.category : move.category;
			// @ts-ignore Hack for Snaquaza's Z move
			this.claimMove = move.baseMove;
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			let zmove = this.getMove(this.zMoveTable[move.type]);
			this.add('-anim', source, zmove.name, target);
			this.add('-anim', source, "Transform", source);
		},
		onAfterMoveSecondarySelf(pokemon, move) {
			/** @type {{[move: string]: string[]}} */
			let claims = {
				bravebird: ['Braviary', 'Crobat', 'Decidueye', 'Dodrio', 'Farfetch\'d', 'Golbat', 'Mandibuzz', 'Pidgeot', 'Skarmory', 'Staraptor', 'Swanna', 'Swellow', 'Talonflame', 'Tapu Koko', 'Toucannon'],
				superpower: ['Absol', 'Aggron', 'Armaldo', 'Avalugg', 'Azumarill', 'Barbaracle', 'Basculin', 'Beartic', 'Bewear', 'Bibarel', 'Bouffalant', 'Braviary', 'Breloom', 'Buzzwole', 'Cacturne', 'Carracosta', 'Celesteela', 'Chesnaught', 'Cobalion', 'Conkeldurr', 'Crabominable', 'Crawdaunt', 'Darmanitan', 'Diggersby', 'Donphan', 'Dragonite', 'Drampa', 'Druddigon', 'Durant', 'Eelektross', 'Emboar', 'Exeggutor-Alola', 'Feraligatr', 'Flareon', 'Flygon', 'Gigalith', 'Gogoat', 'Golem', 'Golurk', 'Goodra', 'Granbull', 'Gurdurr', 'Hariyama', 'Hawlucha', 'Haxorus', 'Heatmor', 'Hippowdon', 'Hitmonlee', 'Hydreigon', 'Incineroar', 'Kabutops', 'Keldeo', 'Kingler', 'Komala', 'Kommo-o', 'Krookodile', 'Landorus-Therian', 'Lurantis', 'Luxray', 'Machamp', 'Malamar', 'Mamoswine', 'Mew', 'Mudsdale', 'Nidoking', 'Nidoqueen', 'Pangoro', 'Passimian', 'Piloswine', 'Pinsir', 'Rampardos', 'Regice', 'Regigigas', 'Regirock', 'Registeel', 'Reuniclus', 'Rhydon', 'Rhyperior', 'Samurott', 'Sawk', 'Scizor', 'Scolipede', 'Simipour', 'Simisage', 'Simisear', 'Smeargle', 'Snorlax', 'Spinda', 'Stakataka', 'Stoutland', 'Swampert', 'Tapu Bulu', 'Terrakion', 'Throh', 'Thundurus', 'Torkoal', 'Tornadus', 'Torterra', 'Tyranitar', 'Tyrantrum', 'Ursaring', 'Virizion', 'Zeraora'],
				suckerpunch: ['Absol', 'Arbok', 'Ariados', 'Banette', 'Bisharp', 'Cacturne', 'Celebi', 'Corsola', 'Decidueye', 'Delcatty', 'Drifblim', 'Druddigon', 'Dugtrio', 'Dusknoir', 'Electrode', 'Emboar', 'Froslass', 'Furfrou', 'Furret', 'Galvantula', 'Gengar', 'Girafarig', 'Golem', 'Golisopod', 'Heatmor', 'Hitmonlee', 'Hitmontop', 'Houndoom', 'Huntail', 'Kangaskhan', 'Kecleon', 'Komala', 'Lanturn', 'Latias', 'Liepard', 'Lycanroc', 'Maractus', 'Mawile', 'Meowstic', 'Mew', 'Mightyena', 'Mismagius', 'Nidoking', 'Nidoqueen', 'Purugly', 'Raticate', 'Rotom', 'Sableye', 'Seviper', 'Shiftry', 'Skuntank', 'Slaking', 'Smeargle', 'Spinda', 'Spiritomb', 'Stantler', 'Sudowoodo', 'Toxicroak', 'Umbreon', 'Victreebel', 'Wormadam', 'Xatu'],
				flamethrower: ['Absol', 'Aerodactyl', 'Aggron', 'Altaria', 'Arcanine', 'Audino', 'Azelf', 'Bastiodon', 'Blacephalon', 'Blissey', 'Camerupt', 'Castform', 'Celesteela', 'Chandelure', 'Chansey', 'Charizard', 'Clefable', 'Clefairy', 'Darmanitan', 'Delphox', 'Dragonite', 'Drampa', 'Druddigon', 'Dunsparce', 'Eelektross', 'Electivire', 'Emboar', 'Entei', 'Exeggutor-Alola', 'Exploud', 'Flareon', 'Flygon', 'Furret', 'Garchomp', 'Golem', 'Goodra', 'Gourgeist', 'Granbull', 'Guzzlord', 'Gyarados', 'Heatmor', 'Heatran', 'Houndoom', 'Hydreigon', 'Incineroar', 'Infernape', 'Kangaskhan', 'Kecleon', 'Kommo-o', 'Lickilicky', 'Machamp', 'Magcargo', 'Magmortar', 'Malamar', 'Manectric', 'Marowak', 'Mawile', 'Mew', 'Moltres', 'Muk', 'Nidoking', 'Nidoqueen', 'Ninetales', 'Noivern', 'Octillery', 'Pyroar', 'Rampardos', 'Rapidash', 'Rhydon', 'Rhyperior', 'Salamence', 'Salazzle', 'Seviper', 'Silvally', 'Simisear', 'Skuntank', 'Slaking', 'Slowbro', 'Slowking', 'Slurpuff', 'Smeargle', 'Snorlax', 'Solrock', 'Talonflame', 'Tauros', 'Togekiss', 'Torkoal', 'Turtonator', 'Typhlosion', 'Tyranitar', 'Watchog', 'Weezing', 'Wigglytuff', 'Zangoose'],
				thunderbolt: ['Absol', 'Aggron', 'Ambipom', 'Ampharos', 'Aromatisse', 'Audino', 'Aurorus', 'Azelf', 'Banette', 'Bastiodon', 'Beheeyem', 'Bibarel', 'Blissey', 'Castform', 'Chansey', 'Cinccino', 'Clefable', 'Clefairy', 'Dedenne', 'Delcatty', 'Dragalge', 'Dragonite', 'Drampa', 'Drifblim', 'Dunsparce', 'Eelektross', 'Electivire', 'Electrode', 'Emolga', 'Ferroseed', 'Ferrothorn', 'Froslass', 'Furret', 'Gallade', 'Galvantula', 'Garbodor', 'Gardevoir', 'Gengar', 'Girafarig', 'Golem-Alola', 'Golurk', 'Goodra', 'Gothitelle', 'Granbull', 'Gyarados', 'Heliolisk', 'Illumise', 'Jirachi', 'Jolteon', 'Kangaskhan', 'Kecleon', 'Klinklang', 'Lanturn', 'Lapras', 'Latias', 'Latios', 'Lickilicky', 'Linoone', 'Lopunny', 'Luxray', 'Magearna', 'Magmortar', 'Magneton', 'Magnezone', 'Malamar', 'Manectric', 'Marowak-Alola', 'Marowak-Alola-Totem', 'Meloetta', 'Meowstic', 'Mesprit', 'Mew', 'Miltank', 'Mimikyu', 'Minun', 'Mismagius', 'Mr. Mime', 'Muk', 'Nidoking', 'Nidoqueen', 'Nihilego', 'Oranguru', 'Pachirisu', 'Persian', 'Plusle', 'Porygon-Z', 'Porygon2', 'Primeape', 'Probopass', 'Purugly', 'Raichu', 'Raikou', 'Rampardos', 'Raticate', 'Regice', 'Regigigas', 'Regirock', 'Registeel', 'Rhydon', 'Rhyperior', 'Rotom', 'Silvally', 'Slaking', 'Slurpuff', 'Smeargle', 'Snorlax', 'Stantler', 'Starmie', 'Stoutland', 'Stunfisk', 'Tapu Koko', 'Tapu Lele', 'Tauros', 'Thundurus', 'Togedemaru', 'Tyranitar', 'Uxie', 'Vikavolt', 'Volbeat', 'Watchog', 'Weezing', 'Wigglytuff', 'Xurkitree', 'Zangoose', 'Zapdos', 'Zebstrika', 'Zeraora'],
				icebeam: ['Abomasnow', 'Absol', 'Aggron', 'Alomomola', 'Altaria', 'Araquanid', 'Articuno', 'Audino', 'Aurorus', 'Avalugg', 'Azumarill', 'Barbaracle', 'Basculin', 'Bastiodon', 'Beartic', 'Bibarel', 'Blastoise', 'Blissey', 'Bruxish', 'Carracosta', 'Castform', 'Chansey', 'Clawitzer', 'Claydol', 'Clefable', 'Clefairy', 'Cloyster', 'Corsola', 'Crabominable', 'Crawdaunt', 'Cresselia', 'Cryogonal', 'Delcatty', 'Delibird', 'Dewgong', 'Dragonite', 'Drampa', 'Dunsparce', 'Dusknoir', 'Empoleon', 'Exploud', 'Feraligatr', 'Floatzel', 'Froslass', 'Furret', 'Gastrodon', 'Glaceon', 'Glalie', 'Golduck', 'Golisopod', 'Golurk', 'Goodra', 'Gorebyss', 'Greninja', 'Gyarados', 'Huntail', 'Jellicent', 'Jynx', 'Kabutops', 'Kangaskhan', 'Kecleon', 'Kingdra', 'Kingler', 'Kyurem', 'Lanturn', 'Lapras', 'Latias', 'Latios', 'Lickilicky', 'Linoone', 'Lopunny', 'Ludicolo', 'Lumineon', 'Lunatone', 'Luvdisc', 'Magearna', 'Mamoswine', 'Manaphy', 'Mantine', 'Marowak', 'Masquerain', 'Mawile', 'Mesprit', 'Mew', 'Milotic', 'Miltank', 'Nidoking', 'Nidoqueen', 'Ninetales-Alola', 'Octillery', 'Omastar', 'Pelipper', 'Phione', 'Piloswine', 'Politoed', 'Poliwrath', 'Porygon-Z', 'Porygon2', 'Primarina', 'Quagsire', 'Qwilfish', 'Rampardos', 'Raticate', 'Regice', 'Relicanth', 'Rhydon', 'Rhyperior', 'Samurott', 'Seaking', 'Sharpedo', 'Sigilyph', 'Silvally', 'Simipour', 'Slaking', 'Slowbro', 'Slowking', 'Smeargle', 'Sneasel', 'Snorlax', 'Starmie', 'Suicune', 'Swalot', 'Swampert', 'Swanna', 'Tapu Fini', 'Tauros', 'Tentacruel', 'Toxapex', 'Tyranitar', 'Vanilluxe', 'Vaporeon', 'Wailord', 'Walrein', 'Weavile', 'Whiscash', 'Wigglytuff', 'Wishiwashi', 'Zangoose'],
			};
			// @ts-ignore Hack for Snaquaza's Z move
			const baseMove = this.claimMove ? this.claimMove.id : 'bravebird';
			const pool = claims[baseMove];
			if (!pool) throw new Error(`SSB: Unable to find fake claim movepool for the move: "${baseMove}".`); // Should never happen
			const claim = claims[baseMove][this.random(pool.length)];
			// Generate new set
			const generator = new RandomStaffBrosTeams('gen7randombattle', this.prng);
			let set = generator.randomSet(claim);
			// Suppress Ability now to prevent starting new abilities when transforming
			pokemon.addVolatile('gastroacid', pokemon);
			// Tranform into it
			pokemon.formeChange(set.species);
			for (let newMove of set.moves) {
				let moveTemplate = this.getMove(newMove);
				if (pokemon.moves.includes(moveTemplate.id)) continue;
				pokemon.moveSlots.push({
					move: moveTemplate.name,
					id: moveTemplate.id,
					pp: ((moveTemplate.noPPBoosts || moveTemplate.isZ) ? moveTemplate.pp : moveTemplate.pp * 8 / 5),
					maxpp: ((moveTemplate.noPPBoosts || moveTemplate.isZ) ? moveTemplate.pp : moveTemplate.pp * 8 / 5),
					target: moveTemplate.target,
					disabled: false,
					disabledSource: '',
					used: false,
				});
			}
			// Update HP
			// @ts-ignore Hack for Snaquaza's Z Move
			pokemon.m.claimHP = pokemon.hp;
			pokemon.heal(pokemon.maxhp - pokemon.hp, pokemon);
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
			this.add('message', `${pokemon.name} claims to be a ${set.species}!`);
		},
		isZ: "fakeclaimiumz",
		secondary: null,
		target: "normal",
		type: "Dark",
	},
	// SpaceBass
	armyofmushrooms: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Before the turn starts, this Pokemon boosts its Defense and Special Defense by one stage and uses Powder on the target. When this move hits, this Pokemon uses Sleep Powder and Leech Seed. This move's priority is -1 and cannot be boosted by Prankster.",
		shortDesc: "+1 Def/SpD, Powder, Leech Seed, Sleep Powder.",
		id: "armyofmushrooms",
		name: "Army of Mushrooms",
		isNonstandard: "Custom",
		pp: 10,
		priority: -1,
		flags: {snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		beforeTurnCallback(pokemon) {
			if (pokemon.status === 'slp' || pokemon.status === 'frz') return;
			this.boost({def: 1, spd: 1}, pokemon, pokemon, this.getEffect('mushroom army'));
			this.useMove("powder", pokemon);
		},
		onHit(pokemon) {
			this.useMove("sleeppowder", pokemon);
			this.useMove("leechseed", pokemon);
		},
		secondary: null,
		target: "self",
		type: "Grass",
	},
	// SunGodVolcarona
	scorchingglobalvortex: {
		accuracy: true,
		basePower: 200,
		category: "Special",
		desc: "Burns the target. Ignores abilities.",
		shortDesc: "Burns the target. Ignores abilities.",
		id: "scorchingglobalvortex",
		name: "Scorching Global Vortex",
		isNonstandard: "Custom",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Searing Sunraze Smash", target);
		},
		onHit(target, source) {
			target.trySetStatus('brn', source);
		},
		ignoreAbility: true,
		isZ: "volcaroniumz",
		target: "normal",
		type: "Fire",
	},
	// Teclis
	zekken: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 2 stages and its Speed by 1 stage.",
		shortDesc: "Raises the user's Attack by 2 and Speed by 1.",
		id: "zekken",
		name: "Zekken",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Swords Dance", source);
		},
		boosts: {
			atk: 2,
			spe: 1,
		},
		secondary: null,
		target: "self",
		type: "Fairy",
	},
	// tennisace
	groundsurge: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "This move's type effectiveness against Ground is changed to be super effective no matter what this move's type is.",
		shortDesc: "Super effective on Ground.",
		id: "groundsurge",
		name: "Ground Surge",
		isNonstandard: "Custom",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Thunder", target);
			this.add('-anim', source, "Fissure", target);
		},
		ignoreImmunity: {'Electric': true},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Ground') return 1;
		},
		secondary: null,
		target: "normal",
		type: "Electric",
	},
	// Teremiare
	rotate: {
		accuracy: 100,
		category: "Status",
		desc: "The user's replacement will switch out after using their move on the next turn if the replacement's move is successful.",
		shortDesc: "User's replacement will switch after using its move.",
		id: "rotate",
		name: "Rotate",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Celebrate", target);
		},
		sideCondition: "rotate",
		effect: {
			duration: 2,
			onStart(source) {
				this.add('-message', `${source.active[0].name}'s replacement is going to switch out next turn!`);
			},
			onModifyMove(move) {
				move.selfSwitch = true;
			},
			onBeforeMove(source, move) {
				this.add('-message', `${source.name} is preparing to switch out!`);
			},
		},
		selfSwitch: true,
		secondary: null,
		target: "self",
		type: "Normal",
	},
	// The Immortal
	ultrasucc: {
		accuracy: true,
		basePower: 140,
		category: "Physical",
		desc: "Has a 100% chance to raise the user's Speed by 1 stage.",
		shortDesc: "100% chance to raise the user's Speed by 1.",
		id: "ultrasucc",
		name: "Ultra Succ",
		isNonstandard: "Custom",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Dragon Ascent", target);
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		isZ: "buzzniumz",
		target: "normal",
		type: "Fighting",
	},
	// The Leprechaun
	gyroballin: {
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			let power = (Math.floor(25 * target.getStat('spe') / pokemon.getStat('spe')) || 1);
			if (power > 150) power = 150;
			this.debug('' + power + ' bp');
			return power;
		},
		category: "Physical",
		desc: "Base Power is equal to (25 * target's current Speed / user's current Speed) + 1, rounded down, but not more than 150. If the user's current Speed is 0, this move's power is 1. Summons Trick Room unless Trick Room is already active.",
		shortDesc: "More power if slower; sets Trick Room.",
		id: "gyroballin",
		name: "Gyro Ballin'",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {bullet: 1, contact: 1, protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Gyro Ball", target);
		},
		onAfterMoveSecondarySelf(pokemon) {
			if (!this.field.pseudoWeather.trickroom) {
				this.field.addPseudoWeather('trickroom', pokemon);
			}
			this.add('-fieldactivate', 'move: Pay Day'); // Coins are scattered on the ground
		},
		secondary: null,
		target: "normal",
		type: "Steel",
		zMovePower: 160,
		contestType: "Cool",
	},
	// Tiksi
	devolutionwave: {
		accuracy: true,
		basePower: 25,
		category: "Physical",
		desc: "This move hits 5 times. After the first hit, the target is either badly poisoned or paralyzed. After the second hit, the user swaps abilities with the target, or the target gains the Water type. After the third hit, Stealth Rock or one layer of Spikes is added to the opponent's side of the field. After the fourth hit, Grassy Terrain or Misty Terrain is summoned. After the fifth hit, the user's Attack or Defense is raised by 1.",
		shortDesc: "Hits 5 times with various effects on each hit.",
		id: "devolutionwave",
		name: "Devolution Wave",
		isNonstandard: "Custom",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Psywave", target);
		},
		multihit: 5,
		onAfterHit(target, source, move) {
			// @ts-ignore hack for tiksi's move
			if (!move.curHits) move.curHits = 1;
			let option = this.random(2);
			this.add('-anim', source, 'Rock Throw', target);
			// @ts-ignore hack for tiksi's move
			switch (move.curHits) {
			case 1:
				if (option) {
					target.trySetStatus('tox', source);
				} else {
					target.trySetStatus('par', source);
				}
				break;
			case 2:
				if (option) {
					let bannedAbilities = ['battlebond', 'comatose', 'disguise', 'illusion', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'wonderguard'];
					if (bannedAbilities.includes(target.ability) || bannedAbilities.includes(source.ability)) {
						this.add('-fail', target, 'move: Skill Swap');
						break;
					}
					let targetAbility = this.getAbility(target.ability);
					let sourceAbility = this.getAbility(source.ability);
					if (target.side === source.side) {
						this.add('-activate', source, 'move: Skill Swap', '', '', '[of] ' + target);
					} else {
						this.add('-activate', source, 'move: Skill Swap', targetAbility, sourceAbility, '[of] ' + target);
					}
					this.singleEvent('End', sourceAbility, source.abilityData, source);
					this.singleEvent('End', targetAbility, target.abilityData, target);
					if (targetAbility.id !== sourceAbility.id) {
						source.ability = targetAbility.id;
						target.ability = sourceAbility.id;
						source.abilityData = {id: toId(source.ability), target: source};
						target.abilityData = {id: toId(target.ability), target: target};
					}
					this.singleEvent('Start', targetAbility, source.abilityData, source);
					this.singleEvent('Start', sourceAbility, target.abilityData, target);
				} else {
					if (!target.setType('Water')) {
						this.add('-fail', target, 'move: Soak');
					} else {
						this.add('-start', target, 'typechange', 'Water');
					}
				}
				break;
			case 3:
				if (option) {
					target.side.addSideCondition('stealthrock');
				} else {
					target.side.addSideCondition('spikes');
				}
				break;
			case 4:
				if (option) {
					this.field.setTerrain('grassyterrain', source);
				} else {
					this.field.setTerrain('mistyterrain', source);
				}
				break;
			case 5:
				if (option) {
					this.boost({atk: 1}, source);
				} else {
					this.boost({def: 1}, source);
				}
				break;
			}
			// @ts-ignore hack for tiksi's move
			move.curHits++;
		},
		isZ: "tiksiumz",
		secondary: null,
		target: "normal",
		type: "Rock",
	},
	// torkool
	smokebomb: {
		accuracy: true,
		category: "Status",
		desc: "Moves all hazards that are on the user's side of the field to the foe's side of the field. Sets Stealth Rock on the foe's side, after which the user switches out.",
		shortDesc: "Hazards -> foe side. Set SR. User switches out.",
		id: "smokebomb",
		name: "Smoke Bomb",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, mirror: 1, reflectable: 1, authentic: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Smokescreen", target);
			this.add('-anim', source, "Parting Shot", target);
		},
		onHit(target, source) {
			const sideConditions = {'spikes': 1, 'toxicspikes': 1, 'stealthrock': 1, 'stickyweb': 1};
			for (let i in sideConditions) {
				let layers = source.side.sideConditions[i] ? (source.side.sideConditions[i].layers || 1) : 1;
				if (source.side.removeSideCondition(i)) {
					this.add('-sideend', source.side, this.getEffect(i).name, '[from] move: Smoke Bomb', '[of] ' + source);
					for (layers; layers > 0; layers--) target.side.addSideCondition(i, source);
				}
			}
			target.side.addSideCondition('stealthrock');
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// Trickster
	minisingularity: {
		accuracy: 55,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			let targetWeight = target.getWeight();
			if (targetWeight >= 200) {
				this.debug('120 bp');
				return 120;
			}
			if (targetWeight >= 100) {
				this.debug('100 bp');
				return 100;
			}
			if (targetWeight >= 50) {
				this.debug('80 bp');
				return 80;
			}
			if (targetWeight >= 25) {
				this.debug('60 bp');
				return 60;
			}
			if (targetWeight >= 10) {
				this.debug('40 bp');
				return 40;
			}
			this.debug('20 bp');
			return 20;
		},
		category: "Special",
		desc: "This move's Base Power is 20 if the target weighs less than 10 kg, 40 if its weight is less than 25 kg, 60 if its weight is less than 50 kg, 80 if its weight is less than 100 kg, 100 if its weight is less than 200 kg, and 120 if its weight is greater than or equal to 200 kg. After doing damage, the target's item is replaced with an Iron Ball, and the target's weight is doubled.",
		shortDesc: "BP:weight; increases foe weight; foe item=Iron Ball.",
		id: "minisingularity",
		name: "Mini Singularity",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: "minisingularity",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Spacial Rend", target);
			this.add('-anim', source, "Flash", target);
		},
		onAfterHit(target, source) {
			if (source.hp) {
				let item = target.takeItem();
				if (!target.item) {
					if (item) this.add('-enditem', target, item.name, '[from] move: Mini Singularity', '[of] ' + source);
					target.setItem('ironball');
					this.add('-message', target.name + ' obtained an Iron Ball.');
				}
			}
		},
		effect: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-message', pokemon.name + '\'s weight has doubled.');
			},
			onModifyWeight(weight) {
				return weight * 2;
			},
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
	},
	// UnleashOurPassion
	continuous1v1: {
		accuracy: 90,
		basePower: 120,
		category: "Special",
		desc: "Fully restores the user's HP if this move knocks out the target.",
		shortDesc: "Fully restores user's HP if this move KOes the target.",
		id: "continuous1v1",
		name: "Continuous 1v1",
		isNonstandard: "Custom",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Discharge", target);
			this.add('-anim', source, "First Impression", target);
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.heal(pokemon.maxhp, pokemon, pokemon, move);
		},
		secondary: null,
		target: "normal",
		type: "Electric",
	},
	// urkerab
	holyorders: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Summons two of Attack Order, Defense Order, and Heal Order at random to combine for some assortment of the following effects: has a Base Power of 90 and a higher chance for a critical hit, raises the user's Defense and Special Defense by 1 stage, and heals the user by half of its maximum HP, rounded half up.",
		shortDesc: "Summons two of Attack, Defense, and Heal Order.",
		id: "holyorders",
		name: "Holy Orders",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onHit(target, source) {
			let orders = ["healorder", "defendorder", "attackorder"];
			this.shuffle(orders);
			for (const [i, order] of orders.entries()) {
				if (i > 1) return;
				let target = order === "attackorder" ? source.side.foe.active[0] : source;
				this.useMove(order, source, target);
			}
		},
		secondary: null,
		target: "self",
		type: "Bug",
	},
	// Uselesscrab
	revampedsuspectphilosophy: {
		basePower: 160,
		accuracy: true,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "revampedsuspectphilosophy",
		name: "Revamped Suspect Philosophy",
		isNonstandard: "Custom",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Subzero Slammer", target);
			this.add('-anim', source, "Tectonic Rage", target);
		},
		secondary: null,
		isZ: "nichiumz",
		target: "normal",
		type: "Ground",
	},
	// Volco
	explosivedrain: {
		basePower: 90,
		accuracy: 100,
		category: "Special",
		desc: "The user recovers half the HP lost by the target, rounded half up. If Big Root is held, the user recovers 1.3x the normal amount of HP, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "explosivedrain",
		name: "Explosive Drain",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [1, 2],
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Fire Blast", target);
			this.add('-anim', source, "Giga Drain", target);
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// Xayah
	stunningdance: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Has a 20% chance to make the target flinch and a 100% chance to paralyze the target. Prevents the target from switching out. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. If the target leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field.",
		shortDesc: "20% to flinch; 100% to paralyze; traps target.",
		id: "stunningdance",
		name: "Stunning Dance",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, dance: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Revelation Dance", source);
			this.add('-anim', source, "Air Slash", target);
			this.add('-anim', source, "Air Slash", target);
		},
		onHit(target, source, move) {
			if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
		},
		secondaries: [
			{
				chance: 20,
				volatileStatus: 'flinch',
			},
			{
				chance: 100,
				status: 'par',
			},
		],
		zMovePower: 175,
		target: "normal",
		type: "Flying",
	},
	// XpRienzo ☑◡☑
	blehflame: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 10% chance to raise all of the user's stats by 1 stage.",
		shortDesc: "10% chance to raise all stats by 1 (not acc/eva).",
		id: "blehflame",
		name: "Bleh Flame",
		isNonstandard: "Custom",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Flame Charge", target);
			this.add('-anim', source, "Overheat", target);
		},
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
					def: 1,
					spa: 1,
					spd: 1,
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Fire",
	},
	// Yuki
	cutieescape: {
		accuracy: true,
		category: "Status",
		desc: "The user is replaced with another Pokemon in its party. The opponent is confused, trapped, and infatuated regardless of the replacement's gender. This move fails unless the user already took damage this turn.",
		shortDesc: "If hit; switches out + confuses, traps, infatuates.",
		id: "cutieescape",
		name: "Cutie Escape",
		isNonstandard: "Custom",
		pp: 10,
		priority: -6,
		flags: {mirror: 1},
		beforeTurnCallback(pokemon) {
			pokemon.addVolatile('cutieescape');
			this.add('-message', `${pokemon.name} is preparing to flee!`);
		},
		beforeMoveCallback(pokemon) {
			if (!pokemon.volatiles['cutieescape'] || !pokemon.volatiles['cutieescape'].tookDamage) {
				this.add('-fail', pokemon, 'move: Cutie Escape');
				this.hint("Cutie Escape only works when Yuki is hit in the same turn the move is used.");
				return true;
			}
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Baton Pass", source);
		},
		onHit(target, source) {
			target.addVolatile('confusion');
			target.addVolatile('cutietrap');
		},
		effect: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Cutie Escape');
			},
			onHit(pokemon, source, move) {
				if (move.category !== 'Status') {
					pokemon.volatiles['cutieescape'].tookDamage = true;
				}
			},
		},
		selfSwitch: true,
		target: "normal",
		type: "Fairy",
	},
	// Zarel
	relicsongdance: {
		accuracy: 100,
		basePower: 60,
		multihit: 2,
		category: "Special",
		desc: "Hits twice and ignores type immunities. Before the second hit, the user switches to its Pirouette forme, and this move's second hit deals physical Fighting-type damage. After the second hit, the user reverts to its Aria forme. Fails unless the user is Meloetta.",
		shortDesc: "One hit each from user's Aria and Pirouette formes.",
		id: "relicsongdance",
		name: "Relic Song Dance",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		ignoreImmunity: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onTryHit(target, pokemon) {
			if (pokemon.name !== 'Zarel') {
				this.add('-fail', pokemon);
				this.hint("Only Zarel can use Relic Song Dance.");
				return null;
			}
			this.attrLastMove('[still]');
			let move = pokemon.template.speciesid === 'meloettapirouette' ? 'Brick Break' : 'Relic Song';
			this.add('-anim', pokemon, move, target);
		},
		onHit(target, pokemon, move) {
			if (pokemon.template.speciesid === 'meloettapirouette') {
				pokemon.formeChange('Meloetta');
			} else if (pokemon.formeChange('Meloetta-Pirouette')) {
				move.category = 'Physical';
				move.type = 'Fighting';
			}
		},
		onAfterMove(pokemon) {
			// Ensure Meloetta goes back to standard form after using the move
			if (pokemon.template.speciesid === 'meloettapirouette') {
				pokemon.formeChange('Meloetta');
			}
			this.hint("Zarel still has the Serene Grace ability.");
		},
		effect: {
			duration: 1,
			onAfterMoveSecondarySelf(pokemon, target, move) {
				if (pokemon.template.speciesid === 'meloettapirouette') {
					pokemon.formeChange('Meloetta');
				} else {
					pokemon.formeChange('Meloetta-Pirouette');
				}
				pokemon.removeVolatile('relicsong');
			},
		},
		target: "allAdjacentFoes",
		type: "Psychic",
	},
	// Zyg
	mylife: {
		accuracy: true,
		category: "Status",
		desc: "Badly poisons all Pokemon on the field.",
		shortDesc: "Badly poisons all Pokemon on the field.",
		id: "mylife",
		name: "My Life",
		isNonstandard: "Custom",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Toxic", target);
		},
		onHit(target, source) {
			let success = false;
			if (target.trySetStatus('tox', source)) success = true;
			if (source.trySetStatus('tox', source)) success = true;
			return success;
		},
		secondary: null,
		target: "normal",
		type: "Poison",
	},
	// Modified Moves \\
	// Purple Pills is immune to taunt
	"taunt": {
		inherit: true,
		volatileStatus: 'taunt',
		effect: {
			duration: 3,
			onStart(target) {
				if (target.activeTurns && !this.willMove(target)) {
					this.effectData.duration++;
				}
				this.add('-start', target, 'move: Taunt');
			},
			onResidualOrder: 12,
			onEnd(target) {
				this.add('-end', target, 'move: Taunt');
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.getMove(moveSlot.id).category === 'Status' && this.getMove(moveSlot.id).id !== 'purplepills') {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 5,
			onBeforeMove(attacker, defender, move) {
				if (!move.isZ && move.category === 'Status' && move.id !== 'purplepills') {
					this.add('cant', attacker, 'move: Taunt', move);
					return false;
				}
			},
		},
	},
};

exports.BattleMovedex = BattleMovedex;
